# Database Schema

**Database:** SQLite (file: `northstar.db`)
**ORM:** SQLAlchemy 2.0.23
**Schema defined in:** `backend/main.py`

---

## Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│    users     │     │   competences    │     │  knowledge_assets   │
├─────────────┤     ├──────────────────┤     ├─────────────────────┤
│ id (PK)     │◀────│ leader_id (FK)   │     │ id (PK)             │
│ name        │     │ name             │     │ title               │
│ email       │     │ description      │     │ description         │
│ role        │     │ icon             │     │ asset_type          │
│ competence  │     │ leader_id (FK)   │     │ confidentiality     │
│ avatar      │     │ member_count     │     │ status              │
│ department  │     │ asset_count      │     │ version             │
└─────────────┘     │ color            │     │ tags                │
                    └──────────────────┘     │ owner_id (FK)       │
                                            │ reviewer_id (FK)    │
┌──────────────────────┐                   │ approver_id (FK)    │
│ approval_workflows    │                   │ competence_id (FK)  │
├──────────────────────┤                   │ review_date         │
│ id (PK)              │                   │ created_at          │
│ asset_id (FK)        │◀──────────────────│ updated_at          │
│ current_stage        │                   │ content             │
│ submitted_by (FK)    │                   │ related_docs        │
│ reviewed_by (FK)     │                   └─────────────────────┘
│ approved_by (FK)     │
│ submitted_at         │
│ reviewed_at          │
│ approved_at          │
│ comments             │
└──────────────────────┘
```

## Table Definitions

### users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY | Manual IDs in seed data |
| name | VARCHAR(120) | NOT NULL | Display name |
| email | VARCHAR(200) | NOT NULL | No unique constraint |
| role | VARCHAR(20) | NOT NULL | Employee, Champion, Leader, Admin |
| competence | VARCHAR(120) | NULLABLE | Free text, not FK |
| avatar | VARCHAR(500) | NULLABLE | External URL |
| department | VARCHAR(120) | NULLABLE | Department name |

**Indexes:** Primary key only
**Seed count:** 7 records

### competences

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY | Manual IDs (1-7) |
| name | VARCHAR(200) | NOT NULL | Unique competence name |
| description | TEXT | NULLABLE | Full description |
| icon | VARCHAR(50) | NULLABLE | Lucide icon name |
| leader_id | INTEGER | FOREIGN KEY → users.id | Competence leader |
| member_count | INTEGER | DEFAULT 0 | Seed: random(8,45) |
| asset_count | INTEGER | DEFAULT 0 | Computed at seed time |
| color | VARCHAR(20) | NULLABLE | Hex color code |

**Relationships:** leader → User
**Indexes:** Primary key only
**Seed count:** 7 records

### knowledge_assets

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY | Manual IDs (1-30) |
| title | VARCHAR(300) | NOT NULL | Asset title |
| description | TEXT | NULLABLE | Summary description |
| asset_type | VARCHAR(30) | NOT NULL | Procedure, Manual, Guide, etc. |
| confidentiality | VARCHAR(5) | NOT NULL | L0, L1, L2, L3 |
| status | VARCHAR(25) | NOT NULL | Draft, Submitted, Published, etc. |
| version | VARCHAR(10) | DEFAULT "1.0" | Semantic version |
| tags | TEXT | NULLABLE | Comma-separated keywords |
| owner_id | INTEGER | FOREIGN KEY → users.id | Asset owner |
| reviewer_id | INTEGER | FOREIGN KEY → users.id | Assigned reviewer |
| approver_id | INTEGER | FOREIGN KEY → users.id | Assigned approver |
| competence_id | INTEGER | FOREIGN KEY → competences.id | Parent competence |
| review_date | DateTime | NULLABLE | Next review date |
| created_at | DateTime | DEFAULT utcnow | Creation timestamp |
| updated_at | DateTime | DEFAULT utcnow | Last modification |
| content | TEXT | NULLABLE | HTML content body |
| related_docs | TEXT | NULLABLE | JSON array of IDs |

**Relationships:** owner, reviewer, approver → User; competence → Competence
**Indexes:** Primary key only
**Seed count:** 30 records

### approval_workflows

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY | Manual IDs (1-3) |
| asset_id | INTEGER | FOREIGN KEY → knowledge_assets.id | Associated asset |
| current_stage | VARCHAR(30) | NOT NULL | Current workflow stage |
| submitted_by | INTEGER | FOREIGN KEY → users.id | Submitting user |
| reviewed_by | INTEGER | FOREIGN KEY → users.id, NULLABLE | Reviewer user |
| approved_by | INTEGER | FOREIGN KEY → users.id, NULLABLE | Approver user |
| submitted_at | DateTime | DEFAULT utcnow | Submission timestamp |
| reviewed_at | DateTime | NULLABLE | Review timestamp |
| approved_at | DateTime | NULLABLE | Approval timestamp |
| comments | TEXT | NULLABLE | Reviewer/approver notes |

**Relationships:** asset → KnowledgeAsset; submitted_user → User
**Indexes:** Primary key only
**Seed count:** 3 records

## Seed Data Details

### Users
| ID | Name | Email | Role | Competence |
|----|------|-------|------|------------|
| 1 | Alice Chen | alice.chen@example.com | Admin | Knowledge Management |
| 2 | Marcus Johansson | marcus.j@example.com | Leader | Electrical Systems |
| 3 | Sarah Patel | sarah.p@example.com | Leader | Mechanical Design |
| 4 | David Okafor | david.o@example.com | Champion | Automation |
| 5 | Elena Rodriguez | elena.r@example.com | Employee | Product Support |
| 6 | James Mueller | james.m@example.com | Employee | Field Service |
| 7 | Jordan Taylor | jordan.t@example.com | Community Member | — |

### Competences
| ID | Name | Leader | Color |
|----|------|--------|-------|
| 1 | Electrical Systems | Marcus Johansson (2) | #f59e0b |
| 2 | Mechanical Design | Sarah Patel (3) | #6366f1 |
| 3 | Automation | David Okafor (4) | #10b981 |
| 4 | Product Support | Elena Rodriguez (5) | #ec4899 |
| 5 | Field Service | James Mueller (6) | #f97316 |
| 6 | Quality | Alice Chen (2) | #14b8a6 |
| 7 | Project Management | Sarah Patel (3) | #8b5cf6 |

### Asset Distribution by Competence
| Competence | Asset Count | Asset IDs |
|-----------|-------------|-----------|
| Electrical Systems | 5 | 1, 2, 3, 4, 5 |
| Mechanical Design | 5 | 6, 7, 8, 9, 10 |
| Automation | 5 | 11, 12, 13, 14, 15 |
| Product Support | 5 | 16, 17, 18, 19, 20 |
| Field Service | 5 | 21, 22, 23, 24, 25 |
| Quality | 4 | 26, 27, 28 |
| Project Management | 2 | 29, 30 |

### Approval Workflows
| ID | Asset | Stage | Submitted By | Submitted At |
|----|-------|-------|-------------|-------------|
| 1 | Pump Failure RCA (#6) | Draft | Elena Rodriguez | now - 2 days |
| 2 | SCADA Alarm Management (#12) | Champion Review | David Okafor | now - 5 days |
| 3 | Project Governance (#29) | Leader Approval | Sarah Patel | now - 7 days |

## Data Integrity Notes

1. **No foreign key enforcement** — SQLite has FK enforcement OFF by default
2. **No unique constraints** — Email addresses can be duplicated
3. **JSON in Text column** — `related_docs` stored as JSON string, not queryable
4. **CSV in Text column** — `tags` stored as comma-separated, not queryable
5. **Hardcoded counts** — `member_count` and `asset_count` are set at seed time, not maintained
6. **Timestamps** — `review_date` uses random dates; overdue logic queries but returns 0
7. **Eager loading** — All relationship queries use `selectinload` to avoid N+1
