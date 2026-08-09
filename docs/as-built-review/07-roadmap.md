# Implementation Roadmap

**Source:** Derived from `northstar-master-plan.md` gap analysis and `06-gap-analysis.md`
**Total Estimated Duration:** 12 weeks (remaining, assuming Phases 1 Foundation is done)

---

## Phase 2: Intelligence (Weeks 3-4)

### Goal
Add real AI-powered search, LLM integration, and vector search capabilities.

### Tasks

| Week | Task | Priority | Dependencies |
|------|------|----------|-------------|
| 3.1 | Migrate database from SQLite to PostgreSQL | **P0** | None |
| 3.1 | Add pgvector extension for embedding storage | **P0** | PostgreSQL |
| 3.1 | Add Alembic for database migrations | P1 | PostgreSQL |
| 3.1 | Add bcrypt password hashing to User model | **P0** | None |
| 3.1 | Implement JWT authentication (access + refresh tokens) | **P0** | bcrypt |
| 3.1 | Add server-side auth middleware to all endpoints | **P0** | JWT |
| 3.1 | Harden CORS (whitelist origins, remove wildcard) | **P0** | None |
| 3.2 | Integrate LLM API (OpenAI or Anthropic Claude) for AI answers | **P0** | Auth |
| 3.2 | Generate text embeddings for all knowledge assets | **P0** | PostgreSQL + pgvector |
| 3.2 | Implement vector similarity search (pgvector cosine distance) | **P0** | Embeddings |
| 3.2 | Replace hardcoded Spiral Search AI answers with LLM-generated responses | **P0** | LLM integration |
| 3.2 | Add embedding generation pipeline on asset creation/update | P1 | Embeddings |
| 3.2 | Add Recharts for KPI dashboard charts | P1 | None |

### Phase 2 Deliverables
- PostgreSQL database with pgvector running in production
- Real user authentication with password hashing and JWT tokens
- AI-powered spiral search returning LLM-generated answers
- Vector search for semantic similarity across knowledge assets
- KPI charts replacing static cards

---

## Phase 3: Governance (Weeks 5-6)

### Goal
Implement the full governance engine: approval workflows, audit logging, user management, and notifications.

### Tasks

| Week | Task | Priority | Dependencies |
|------|------|----------|-------------|
| 5.1 | Implement approval workflow state machine (submit → review → approve/reject) | **P0** | Auth (Phase 2) |
| 5.1 | Add Approve/Reject backend handlers with comments | **P0** | Workflow engine |
| 5.1 | Implement Request Changes action | P1 | Workflow engine |
| 5.1 | Add notification service (email or in-app) for workflow events | P1 | Workflow engine |
| 5.1 | Add file upload endpoint (PDF, DOCX, images) | P1 | None |
| 5.1 | Implement file storage (local or GCS) | P1 | Upload endpoint |
| 5.1 | Add input validation with Pydantic schemas for all POST endpoints | **P0** | None |
| 5.2 | Implement audit logging middleware (who, what, when) | **P0** | Auth |
| 5.2 | Add User Management CRUD interface (Admin only) | P1 | Auth |
| 5.2 | Add rate limiting middleware (slowapi) | P1 | None |
| 5.2 | Add CSRF protection | P1 | Auth |
| 5.2 | Implement session expiry and refresh token rotation | P1 | Auth |
| 5.2 | Add error handling that doesn't leak internals to clients | P1 | None |
| 5.2 | Add CSP headers and HTML sanitization (bleach) | P1 | None |

### Phase 3 Deliverables
- Functional approval workflows with approve/reject/request-changes
- Email or in-app notifications for workflow events
- File upload and management for knowledge assets
- Complete audit trail of all data access and modifications
- User management interface for administrators
- Production-grade security hardening

---

## Phase 4: Enterprise (Week 7+)

### Goal
Enterprise features, analytics, SSO, and compliance readiness.

### Tasks

| Week | Task | Priority | Dependencies |
|------|------|----------|-------------|
| 7.1 | Implement SSO/SAML integration (Azure AD, Google Workspace) | P1 | Auth |
| 7.1 | Add role-based access control enforcement on backend | **P0** | Auth |
| 7.1 | Implement data export endpoint (GDPR Article 20) | P1 | Auth |
| 7.1 | Implement data deletion endpoint (GDPR Article 17) | P1 | Auth |
| 7.1 | Add data retention policies with automated cleanup | P2 | None |
| 7.1 | Enable L4 confidentiality level (Top Secret) | P2 | None |
| 7.2 | Add analytics and reporting dashboard | P2 | Phase 3 complete |
| 7.2 | Implement multi-tenancy (organization isolation) | P2 | PostgreSQL |
| 7.2 | Add advanced full-text search (PostgreSQL FTS or Elasticsearch) | P2 | PostgreSQL |
| 7.2 | Mobile-responsive enhancements and PWA support | P2 | None |
| 7.2 | Add automated test suite (pytest + Playwright) | P2 | All features stable |
| 7.2 | Performance optimization and caching layer (Redis) | P2 | PostgreSQL |
| 7.2 | ISO 30401 compliance documentation and evidence gathering | P2 | All features |

### Phase 4 Deliverables
- SSO integration with enterprise identity providers
- GDPR-compliant data management
- Analytics and reporting capabilities
- Multi-tenant architecture for enterprise customers
- Comprehensive test coverage
- ISO 30401 readiness documentation

---

## Parallel Track: Testing & Quality (Weeks 3-12)

Independent track running alongside Phases 2-4.

| Week | Task |
|------|------|
| 3.1 | Set up pytest with fixtures for FastAPI test client |
| 3.2 | Write unit tests for all API endpoints |
| 4.1 | Write integration tests for auth flows |
| 5.1 | Write integration tests for approval workflows |
| 6.1 | Write integration tests for search/Spiral Search |
| 7.1 | Set up Playwright for E2E tests |
| 8.1 | Write E2E tests for critical user journeys (login, search, submit, approve) |
| 9.1 | Add CI pipeline for automated test execution |
| 10.1 | Add code coverage reporting |
| 11-12 | Address test debt, increase coverage to 80%+ |

---

## Infrastructure Improvements

### Immediate (Before Production)
1. Remove `--allow-unauthenticated` from Cloud Run deployment
2. Configure Cloud SQL (PostgreSQL) instance on GCP
3. Set up secret management (Secret Manager or env vars)
4. Enable Cloud Armor for DDoS protection
5. Configure HTTPS-only traffic

### Short-term (Phase 2)
1. Add Redis caching layer for frequent queries
2. Set up application monitoring (Cloud Monitoring or Sentry)
3. Configure backup strategy for PostgreSQL
4. Add health check endpoints with dependency checks

### Long-term (Phase 4)
1. Implement CDN for static assets
2. Set up log aggregation (Cloud Logging or ELK)
3. Add APM (Application Performance Monitoring)
4. Configure auto-scaling policies

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Authentication bypass in production | High | Critical | Phase 2 Week 3.1 — implement before any production deployment |
| Data loss from SQLite corruption | Medium | High | Migrate to PostgreSQL in Phase 2 |
| LLM API cost overrun | Medium | Medium | Implement caching, set token limits, monitor usage |
| Scope creep delaying delivery | High | Medium | Strict phase gate reviews, prioritize P0 tasks |
| No test coverage leads to regressions | High | Medium | Parallel testing track from Week 3 |
| External avatar service dependency | Low | Low | Host avatars locally in Phase 2 |

---

## Success Metrics

| Metric | Current | Phase 2 Target | Phase 3 Target | Phase 4 Target |
|--------|---------|---------------|---------------|---------------|
| Authentication security | 0/10 | 8/10 | 9/10 | 10/10 |
| AI/RAG capability | 0/10 | 7/10 | 7/10 | 9/10 |
| Approval workflow functionality | 2/10 | 2/10 | 9/10 | 10/10 |
| Test coverage | 0% | 30% | 60% | 80% |
| Security findings (by severity) | 12 | 5 | 2 | 0 |
| API response time (p95) | ~50ms | ~100ms | ~150ms | ~100ms |
| Knowledge asset types supported | HTML only | HTML + file upload | HTML + file upload | Multi-format |
