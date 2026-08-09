# API Documentation

**Base URL:** `/api`
**Framework:** FastAPI
**Authentication:** None (all endpoints public)

---

## Health

### GET `/api/health`

Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "NorthStar Knowledge OS"
}
```

---

## Authentication

### POST `/api/auth/login`

Authenticate a user by name and role. **No password verification.**

**Request Body:**
```json
{
  "name": "Alice Chen",
  "role": "Admin"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Alice Chen",
  "email": "alice.chen@example.com",
  "role": "Admin",
  "competence": "Knowledge Management",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
  "department": "Enterprise Services"
}
```

**Behavior:** If `name` doesn't match any user, falls back to finding first user with matching `role`.

### GET `/api/auth/users`

List all users in the system.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alice Chen",
    "email": "alice.chen@example.com",
    "role": "Admin",
    "competence": "Knowledge Management",
    "avatar": "https://...",
    "department": "Enterprise Services"
  }
]
```

---

## Dashboard

### GET `/api/dashboard/kpis`

Return dashboard key performance indicators. **Some values are hardcoded or randomized.**

**Response:**
```json
{
  "total_assets": 30,
  "pending_reviews": 4,
  "overdue_docs": 0,
  "active_competences": 7,
  "published_this_month": 14,
  "active_users": 7,
  "approval_queue": 4,
  "avg_review_time": "7 days"
}
```

**Notes:**
- `overdue_docs` is hardcoded to `0`
- `active_users` is hardcoded to `7`
- `published_this_month` is `random.randint(8, 20)`
- `avg_review_time` is `random.randint(3, 14)` + " days"

### GET `/api/dashboard/recent`

Return recently updated assets (ordered by `updated_at` DESC, limit 10).

**Response:** Array of `KnowledgeAsset` objects (see `/api/assets/{id}` for schema).

### GET `/api/dashboard/pending-approvals`

Return approval workflows that are not in Draft, Published, or Archived state.

**Response:**
```json
[
  {
    "id": 2,
    "current_stage": "Champion Review",
    "submitted_at": "2026-08-04T...",
    "reviewed_at": "2026-08-08T...",
    "approved_at": null,
    "comments": "Under review for technical accuracy.",
    "submitted_user": { "id": 4, "name": "David Okafor", ... },
    "asset": { "id": 12, "title": "SCADA Alarm Management Framework", ... }
  }
]
```

---

## Competences

### GET `/api/competences`

List all competences with leader information.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electrical Systems",
    "description": "High-voltage systems...",
    "icon": "Zap",
    "leader_id": 2,
    "member_count": 23,
    "asset_count": 5,
    "color": "#f59e0b",
    "leader": { "id": 2, "name": "Marcus Johansson", ... }
  }
]
```

### GET `/api/competences/{competence_id}`

Get competence detail with associated assets, lessons learned, experts, and training.

**Response:**
```json
{
  "id": 1,
  "name": "Electrical Systems",
  "description": "...",
  "icon": "Zap",
  "leader_id": 2,
  "member_count": 23,
  "asset_count": 5,
  "color": "#f59e0b",
  "leader": { ... },
  "assets": [ /* KnowledgeAsset[] filtered by competence_id */ ],
  "lessons_learned": [ /* KnowledgeAsset[] where asset_type == "Lesson Learned" */ ],
  "experts": [ /* User[] with role in [Leader, Champion] in this competence */ ],
  "training": [
    {
      "title": "Electrical Systems Fundamentals Training",
      "duration": "4 hours",
      "format": "E-Learning",
      "status": "Active"
    }
  ]
}
```

**Note:** `training` is a single hardcoded entry per competence — not from database.

---

## Assets

### GET `/api/assets`

List knowledge assets with optional filters. Supports pagination (`skip`, `limit`).

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `competence_id` | int? | Filter by competence |
| `asset_type` | string? | Filter by asset type |
| `confidentiality` | string? | Filter by confidentiality level (L0-L3) |
| `status` | string? | Filter by status |
| `search` | string? | Text search in title and description |
| `skip` | int | Pagination offset (default: 0) |
| `limit` | int | Page size (default: 50) |

**Response:** Array of `KnowledgeAsset` objects:
```json
[
  {
    "id": 1,
    "title": "Generator Shutdown Procedure",
    "description": "Step-by-step emergency shutdown...",
    "asset_type": "Procedure",
    "confidentiality": "L1",
    "status": "Published",
    "version": "2.3",
    "tags": "generator, shutdown, emergency",
    "owner": { "id": 1, "name": "Alice Chen", ... },
    "reviewer": { "id": 2, "name": "Marcus Johansson", ... },
    "approver": { "id": 2, "name": "Marcus Johansson", ... },
    "competence": { "id": 1, "name": "Electrical Systems", ... },
    "review_date": "2026-06-15T...",
    "created_at": "2024-06-01T...",
    "updated_at": "2026-07-20T...",
    "content": "<p><strong>Generator Shutdown Procedure</strong></p>...",
    "related_docs": "[3, 5]"
  }
]
```

### GET `/api/assets/{asset_id}`

Get single asset detail with associated approval workflows.

**Response:**
```json
{
  "id": 1,
  "title": "Generator Shutdown Procedure",
  /* ... all KnowledgeAsset fields ... */
  "workflows": [
    {
      "id": 1,
      "current_stage": "Draft",
      "submitted_at": "2026-08-07T...",
      "reviewed_at": null,
      "approved_at": null,
      "comments": null,
      "submitted_user": { "id": 5, "name": "Elena Rodriguez", ... }
    }
  ]
}
```

### GET `/api/assets/filters/options`

Get distinct values for filter dropdowns.

**Response:**
```json
{
  "asset_types": ["Procedure", "Manual", "Case Study", ...],
  "statuses": ["Published", "Draft", "Submitted", ...],
  "confidentialities": ["L0", "L1", "L2", "L3"]
}
```

### POST `/api/assets`

Create a new knowledge asset. **No authentication. Owner auto-assigned.**

**Request Body:**
```json
{
  "title": "New Procedure",
  "summary": "Description here",
  "knowledgeType": "Procedure",
  "competence": "Electrical Systems",
  "confidentialityLevel": "L1",
  "tags": ["tag1", "tag2"],
  "sourceReference": "Ticket #123",
  "relatedDocuments": "1, 2, 3",
  "reviewDueDate": "2027-01-01",
  "owner_id": null,
  "competence_id": null
}
```

**Response (200):**
```json
{
  "id": 31,
  "status": "Submitted",
  "message": "Knowledge asset submitted successfully"
}
```

**Auto-assignment logic:**
- `owner_id` → First user with role in [Admin, Leader, Champion]
- `competence_id` → First competence in database
- `reviewer_id` → First user with role "Leader"
- `approver_id` → Last user with role "Leader" (ordered by id DESC)

---

## Approvals

### GET `/api/approvals`

List approval workflows. Optionally filter by stage.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `stage` | string? | Filter by workflow stage |

**Response:** Same format as `GET /api/dashboard/pending-approvals`

---

## Search

### POST `/api/search/spiral`

Perform 7-layer spiral search. **AI answers are hardcoded.**

**Request Body:**
```json
{
  "query": "generator shutdown"
}
```

**Response:**
```json
{
  "query": "generator shutdown",
  "ai_answer": "Based on the knowledge base, generator shutdowns are most commonly caused by: (1) Low oil pressure...",
  "sources": ["Generator Shutdown Procedure v2.3", "Pump Failure Root Cause Analysis"],
  "layers": [
    {
      "layer": "Documents",
      "count": 3,
      "items": [ /* up to 8 matching assets */ ]
    },
    {
      "layer": "Lessons Learned",
      "count": 1,
      "items": [ /* Lesson Learned assets matching query */ ]
    },
    {
      "layer": "Cases",
      "count": 0,
      "items": []
    },
    {
      "layer": "Cross-Competence",
      "count": 2,
      "items": [
        { "name": "Electrical Systems", "match_count": 3 },
        { "name": "Field Service", "match_count": 1 }
      ]
    },
    {
      "layer": "Experts",
      "count": 1,
      "items": [
        { "name": "Marcus Johansson", "role": "Leader", "competence": "Electrical Systems" }
      ]
    },
    {
      "layer": "Training",
      "count": 2,
      "items": [
        { "title": "Related: Electrical Systems Training", "status": "Active" }
      ]
    },
    {
      "layer": "Open Actions",
      "count": 1,
      "items": [
        { "action": "Review related generator documentation", "priority": "Medium", "owner": "Assigned Champion" }
      ]
    }
  ]
}
```

**Search algorithm:**
1. SQL LIKE on `title` and `description` (case-insensitive)
2. Split results by `asset_type`
3. Group by `competence.name`
4. Match experts from hardcoded dictionary
5. Select AI answer from hardcoded dictionary
6. Generate random match counts for Cross-Competence
