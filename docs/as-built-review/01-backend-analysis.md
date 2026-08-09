# Backend Analysis

**File:** `backend/main.py` (551 lines)
**Framework:** FastAPI 0.104.1
**ORM:** SQLAlchemy 2.0.23
**Database:** SQLite (file-based)

---

## Architecture Overview

The entire backend is contained in a single file. There is no service layer, no repository pattern, and no dependency injection. All models, seed data, schemas, and routes live in `main.py`.

## Dependencies

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.2
```

Notable absences:
- No `python-jose` (JWT tokens)
- No `passlib`/`bcrypt` (password hashing)
- No `python-multipart` (file uploads)
- No AI SDK (openai, anthropic, llama-index)
- No vector DB client (pgvector, qdrant-client)

## Models

### User
- `id`, `name`, `email`, `role`, `competence`, `avatar`, `department`
- No password field, no password_hash field
- No unique constraint on email
- Role is free-text String, not Enum at DB level

### Competence
- `id`, `name`, `description`, `icon`, `leader_id` (FK to users), `member_count`, `asset_count`, `color`
- Relationship to User (leader) with `lazy="joined"`

### KnowledgeAsset
- `id`, `title`, `description`, `asset_type`, `confidentiality`, `status`, `version`
- `tags` (Text), `owner_id` (FK), `reviewer_id` (FK), `approver_id` (FK), `competence_id` (FK)
- `review_date` (DateTime), `created_at`, `updated_at`
- `content` (Text — HTML), `related_docs` (Text — JSON)
- Relationships to User (owner, reviewer, approver) and Competence, all `lazy="joined"`

### ApprovalWorkflow
- `id`, `asset_id` (FK), `current_stage`, `submitted_by` (FK), `reviewed_by` (FK, nullable), `approved_by` (FK, nullable)
- `submitted_at`, `reviewed_at` (nullable), `approved_at` (nullable), `comments`
- Relationship to KnowledgeAsset and User (submitted_user)

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/health` | Health check | None |
| POST | `/api/auth/login` | Login by name+role | None |
| GET | `/api/auth/users` | List all users | None |
| GET | `/api/dashboard/kpis` | Dashboard KPIs | None |
| GET | `/api/dashboard/recent` | Recently updated assets | None |
| GET | `/api/dashboard/pending-approvals` | Pending approval workflows | None |
| GET | `/api/competences` | List all competences | None |
| GET | `/api/competences/{id}` | Competence detail with assets | None |
| GET | `/api/assets` | List assets (with filters) | None |
| GET | `/api/assets/{id}` | Asset detail with workflows | None |
| GET | `/api/assets/filters/options` | Distinct filter values | None |
| POST | `/api/assets` | Create new asset | None |
| GET | `/api/approvals` | List approval workflows | None |
| POST | `/api/search/spiral` | Spiral search (7 layers) | None |

**Zero endpoints require authentication.**

## Seed Data

### Users (7)
```python
# id=1: Alice Chen, Admin, Knowledge Management
# id=2: Marcus Johansson, Leader, Electrical Systems
# id=3: Sarah Patel, Leader, Mechanical Design
# id=4: David Okafor, Champion, Automation
# id=5: Elena Rodriguez, Employee, Product Support
# id=6: James Mueller, Employee, Field Service
# id=7: Jordan Taylor, Community Member
```

All emails use `@example.com` domain. All avatars use DiceBear external API.

### Competences (7)
Electrical Systems, Mechanical Design, Automation, Product Support, Field Service, Quality, Project Management

### Assets (30)
Realistic titles and descriptions across all competences. All set to "Published" status. Tags are comma-separated keywords.

### Workflows (3)
- id=1: Asset #6 (Pump Failure RCA) — Draft stage
- id=2: Asset #12 (SCADA Alarm Management) — Champion Review
- id=3: Asset #29 (Project Governance) — Leader Approval

## Key Code Patterns

### Login (no password check)
```python
@app.post("/api/auth/login")
def login(req: LoginRequest):
    user = db.query(User).filter(User.name == req.name).first()
    if not user:
        user = db.query(User).filter(User.role == req.role).first()
    return LoginResponse(**_user(user))
```

### Hardcoded KPI values
```python
return {
    "total_assets": total,
    "pending_reviews": pending + 1,     # Off-by-one
    "overdue_docs": 0,                   # Hardcoded
    "published_this_month": random.randint(8, 20),  # Random
    "active_users": 7,                   # Hardcoded
    "avg_review_time": f"{random.randint(3, 14)} days",  # Random
}
```

### Hardcoded AI answers
```python
ai_answers = {
    "generator": "Based on the knowledge base...",
    "pump": "The knowledge base shows...",
    "plc": "The knowledge base contains...",
    "default": "The knowledge base returned relevant results..."
}
```

### CORS (permissive)
```python
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Configuration

```python
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./northstar.db")
```

SQLite-specific: `connect_args={"check_same_thread": False}` — required for multi-threaded access but disables SQLite's thread safety check.

Tables are created at startup via `Base.metadata.create_all(bind=engine)` (line 103) — **before** the seed_data check. This means tables always exist, which is fine for SQLite but would fail in a migration-based workflow.

## Session Management

Sessions are created per-request via `SessionLocal()` and closed manually. No context managers or try/finally blocks are used — if an exception occurs between `db = SessionLocal()` and `db.close()`, connections can leak. The `create_asset` endpoint does use try/except with rollback, but most GET endpoints do not.
