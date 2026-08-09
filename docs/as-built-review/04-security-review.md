# Security & Privacy Review

**Assessment Date:** 2026-08-09
**Scope:** Full security review of backend, frontend, and deployment configuration

---

## Findings

### CRITICAL

#### FIND-001: No Password Authentication
**Location:** `backend/main.py` lines 252-266
**CVSS:** 9.1 (Critical)

The login endpoint authenticates users by name lookup only. No password is required, verified, or stored.

```python
@app.post("/api/auth/login")
def login(req: LoginRequest):
    user = db.query(User).filter(User.name == req.name).first()
    if not user:
        user = db.query(User).filter(User.role == req.role).first()
    return LoginResponse(**_user(user))
```

**Impact:** Any client can impersonate any user by sending their name in a POST request. In a production environment, this would allow complete account takeover.

**Recommendation:**
1. Add `password_hash` column to User model
2. Implement bcrypt/argon2 hashing
3. Verify password hash on login
4. Add password reset flow
5. Implement JWT tokens for session management

---

### HIGH

#### FIND-002: Permissive CORS with Credentials
**Location:** `backend/main.py` lines 225-231

```python
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Impact:** When `allow_credentials=True` is combined with `allow_origins=["*"]`, any website can make authenticated cross-origin requests to the API. This defeats the purpose of CORS.

**Note:** FastAPI's CORSMiddleware reflects the first matching origin when credentials are allowed, but the `"*"` wildcard with credentials is a misconfiguration per the CORS specification.

**Recommendation:**
1. Replace `"*"` with a whitelist of known origins
2. Set `allow_credentials=True` only when needed
3. Use separate CORS configs for dev/production

---

#### FIND-003: No Server-Side Authentication
**Location:** All API endpoints

Every endpoint is publicly accessible without any authentication check. The API endpoints listed below require no token, session, or credential verification:

- `POST /api/auth/login` — No credentials checked
- `GET /api/auth/users` — Exposes all user data
- `GET /api/dashboard/kpis` — Exposes organizational metrics
- `POST /api/assets` — Allows creating assets as any user
- `GET /api/approvals` — Exposes approval workflow data

**Impact:** Complete data exposure. Any client can read, create, or modify data without authentication.

**Recommendation:**
1. Implement JWT-based authentication
2. Add `Depends(get_current_user)` to protected routes
3. Return 401 for unauthenticated requests to sensitive endpoints
4. Log authentication failures

---

#### FIND-004: Cloud Run Deployed Without Authentication
**Location:** `cloudbuild.yaml` line 26

```yaml
args:
  - '--allow-unauthenticated'
```

**Impact:** The backend API is exposed to the public internet without any authentication layer. Combined with FIND-003, the entire API is fully accessible.

**Recommendation:**
1. Remove `--allow-unauthenticated` flag
2. Configure IAP (Identity-Aware Proxy) or service-to-service authentication
3. Use `--no-allow-unauthenticated` for production deployments

---

### MEDIUM

#### FIND-005: No Session Expiry
**Location:** `frontend/src/hooks/useAuth.tsx`

User sessions persist in `localStorage` indefinitely. There is no token expiry, no refresh mechanism, and no server-side session validation.

**Impact:** Sessions never expire. If a device is shared or lost, the session remains valid until the user manually logs out or clears browser data.

**Recommendation:**
1. Add JWT with short expiry (15-30 minutes)
2. Implement refresh token mechanism
3. Clear session on inactivity timeout
4. Add "Remember me" vs "Session only" options

---

#### FIND-006: No CSRF Protection
**Location:** Throughout application

State-changing operations (POST requests) have no CSRF token validation. The login endpoint is particularly vulnerable as it creates a session.

**Impact:** Cross-Site Request Forgery attacks could trigger actions on behalf of authenticated users.

**Recommendation:**
1. Implement CSRF tokens for all state-changing requests
2. Use SameSite cookies for session management
3. Validate Origin/Referer headers on sensitive endpoints

---

#### FIND-007: No Rate Limiting
**Location:** All API endpoints

No rate limiting exists on any endpoint. The login endpoint is particularly susceptible to brute-force attacks.

**Impact:** Unlimited request volume could lead to DoS or credential enumeration.

**Recommendation:**
1. Add rate limiting middleware (e.g., `slowapi`)
2. Implement exponential backoff for login attempts
3. Add IP-based request throttling

---

#### FIND-008: No Input Validation on POST Endpoints
**Location:** `backend/main.py` lines 411-460

The `create_asset` endpoint accepts raw JSON body without Pydantic schema validation. Field types, lengths, and values are not validated.

```python
@app.post("/api/assets")
async def create_asset(request: Request):
    body = await request.json()
    # Direct use of body without validation
```

**Impact:** Malformed input could cause database errors, injection attacks, or unexpected behavior.

**Recommendation:**
1. Define Pydantic request models for all POST endpoints
2. Validate field types, lengths, and enum values
3. Reject unexpected fields

---

#### FIND-009: Error Details Leaked to Client
**Location:** `backend/main.py` line 264-266

```python
except Exception as e:
    import traceback
    traceback.print_exc()
    raise HTTPException(500, f"Login error: {str(e)}")
```

**Impact:** Internal error details and stack traces are returned to the client, potentially revealing implementation details.

**Recommendation:**
1. Log errors server-side only
2. Return generic error messages to clients
3. Use structured logging

---

### LOW

#### FIND-010: External Avatar Dependencies
**Location:** `backend/main.py` line 136

All user avatars are loaded from `https://api.dicebear.com/7.x/avataaars/svg?seed=...`.

**Impact:** If the external service is unavailable, avatar images will not load. Privacy concern: user identifiers are sent to a third-party service.

**Recommendation:**
1. Host avatars locally or use base64-encoded defaults
2. If external service is needed, proxy through own server

---

#### FIND-011: No Content Security Policy
**Location:** All HTML responses

No CSP headers are set. The AssetDetail page renders HTML content via `dangerouslySetInnerHTML`.

**Impact:** If content is ever user-controlled (not in current implementation), XSS attacks are possible.

**Recommendation:**
1. Add CSP headers
2. Sanitize HTML content before rendering
3. Use a whitelist-based HTML sanitizer (e.g., `bleach`)

---

#### FIND-012: SQLite Foreign Keys Disabled
**Location:** `backend/main.py` line 30

```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```

SQLite disables foreign key constraints by default. No `PRAGMA foreign_keys = ON` is set.

**Impact:** Orphaned records are possible if parent records are deleted.

**Recommendation:**
1. Add event listener: `event.listen(engine, "connect", lambda c: c.execute("PRAGMA foreign_keys=ON"))`

---

## Privacy Assessment

### Data Handling

| Data Type | Storage | Retention | Sharing |
|-----------|---------|-----------|---------|
| User profiles | SQLite DB | Indefinite | None |
| Knowledge assets | SQLite DB | Indefinite | None |
| Approval workflows | SQLite DB | Indefinite | None |
| Avatars | External (DiceBear) | Indefinite | Third-party |

### Compliance Gaps

- **No data subject rights** — No mechanism for users to request data export or deletion
- **No consent management** — No privacy consent flow
- **No data retention policy** — Data persists indefinitely
- **No encryption at rest** — SQLite file is unencrypted
- **No audit logging** — Cannot trace who accessed or modified data
- **No GDPR Article 30 records** — No record of processing activities

### Recommendations

1. Implement data export and deletion endpoints
2. Add data retention policies with automated cleanup
3. Consider SQLite encryption (SQLCipher) or migrate to PostgreSQL with encryption
4. Add comprehensive audit logging
5. Create privacy policy and terms of service
