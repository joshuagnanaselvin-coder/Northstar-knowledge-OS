# ISO 30401 Alignment: Plan vs. Prototype

**Standard:** ISO 30401:2021 — Knowledge Management Systems — Requirements
**Master Plan Reference:** Section 3 of `northstar-master-plan.md`
**Prototype Assessment Date:** 2026-08-09
**Purpose:** Honest comparison of what ISO 30401 required us to plan vs. what the prototype actually delivers

---

## About This Document

The master plan positioned NorthStar Knowledge OS as a platform aligned with ISO 30401:2021, the international standard for Knowledge Management Systems. This document compares each ISO 30401 clause against what was planned, what was built, and what remains to be done.

**Important:** This prototype does **not** claim ISO 30401 certification or compliance. The standard requires organizational processes, documented policies, training records, management reviews, and evidence of continual improvement — none of which can be delivered by software alone. What this document shows is how the software *supports* the standard's requirements and where the gaps remain.

---

## ISO 30401:2021 — Clause-by-Clause Assessment

### Clause 4: Context of the Organization

| Sub-clause | What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------|------------------------|-----------------|----------------|--------|
| 4.1 Understanding the organization | Understand internal/external factors affecting knowledge | Governance Dashboard with KPIs | KPI cards exist but show hardcoded values | **Partial** |
| 4.2 Understanding stakeholder needs | Identify interested parties and their knowledge requirements | User roles (Admin, Leader, Champion, Employee) | Role selection exists, no stakeholder analysis | **Partial** |
| 4.3 Scope of the KMS | Define what knowledge the system covers | 7 competences across engineering domains | 7 competences with 30 assets seeded | **Delivered** |
| 4.4 KMS and its processes | Establish the knowledge management framework | Competence-based organization | Competence model fully implemented | **Delivered** |

**Clause 4 Assessment:** The organizational context is partially addressed. The scope (7 competences) is defined and implemented. Stakeholder analysis exists only as role definitions — no formal stakeholder mapping or needs assessment. The governance dashboard shows metrics but they are not derived from real data.

---

### Clause 5: Leadership

| Sub-clause | What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------|------------------------|-----------------|----------------|--------|
| 5.1 Leadership and commitment | Top management must demonstrate leadership and commitment | Governance Dashboard for SteerCo visibility | Dashboard with KPI cards only | **Partial** |
| 5.2 Policy | Establish a knowledge management policy | Governance Status card referencing ISO 30401 | UI badge only, no policy document | **Not Implemented** |
| 5.3 Organizational roles | Assign responsibilities and authorities | Role-based access (Admin, Leader, Champion, Employee) | Roles defined, UI filtering only | **Partial** |
| 5.4 Competence | Ensure people have the competence to perform KM tasks | Experts display per competence, training materials | Experts listed, training hardcoded | **Partial** |

**Clause 5 Assessment:** Leadership support is partially demonstrated through the governance dashboard concept. Organizational roles are defined and implemented at the UI level, but the backend does not enforce them. No knowledge management policy document exists. The competence model is implemented, but training materials are hardcoded rather than managed content.

---

### Clause 6: Planning

| Sub-clause | What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------|------------------------|-----------------|----------------|--------|
| 6.1 Actions to address risks and opportunities | Identify risks to knowledge and plan mitigations | Risk Register in master plan (Section 12) | Not reflected in software | **Not Implemented** |
| 6.2 Knowledge management objectives | Set measurable objectives for KM | KPI Dashboard with 8 metrics | KPIs displayed, most are hardcoded | **Partial** |
| 6.3 Planning of changes | Plan how changes to the KMS are managed | Version control for knowledge assets | Version field exists, no change management | **Partial** |

**Clause 6 Assessment:** KM objectives are partially addressed through the KPI dashboard, but the values are hardcoded or randomized rather than computed from real data. Risk management is documented in the master plan but not in the software. Change management exists only as a version number field on assets.

---

### Clause 7: Support

#### 7.1 Resources

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Provide adequate resources for the KMS | Docker deployment, cloud hosting | Docker Compose, Cloud Run deployment | **Delivered** |

#### 7.2 Competence

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Ensure competence of persons affecting KM performance | Experts display, training materials per competence | Experts listed per competence, 1 hardcoded training entry | **Partial** |

#### 7.3 Awareness

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Ensure persons are aware of the KM policy and objectives | Dashboard visibility of governance metrics | Governance Status card on Dashboard | **Partial** |

#### 7.4 Communication

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Internal and external communication about KM | In-app notifications for workflow events | Not implemented | **Not Implemented** |

#### 7.5 Documented Information

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Create, update, control documented information | Knowledge assets as documented information with metadata | Full asset metadata (owner, reviewer, approver, version, review date, tags) | **Delivered** |
| Documented information shall be available and suitable for use | Search and retrieval across all assets | Library with search and filters | **Delivered** |
| Documented information shall be protected from loss of confidentiality, improper use, or loss of integrity | Confidentiality levels (L0-L4), access control | L0-L3 badges displayed, no backend enforcement | **Partial** |

**Clause 7 Assessment:** The documented information aspect is the strongest area. Knowledge assets are created, versioned, and searchable. Confidentiality levels are defined and displayed. However, protection of documented information is only UI-based — the backend has no access control. Communication mechanisms (notifications) are not implemented. Competence awareness through training materials is minimal (hardcoded entries only).

---

### Clause 8: Operation

#### 8.1 Operational Planning and Control

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Plan, implement, and control processes to meet requirements | Knowledge lifecycle management | 7-stage lifecycle (Draft → Published → Archived) | **Partial** |
| | Approval workflows for knowledge quality | Workflow display, no transition engine | **Partial** |

#### 8.2 Knowledge Identification

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Identify knowledge that the organization needs | Competence-based knowledge mapping | 7 competences with asset categorization | **Delivered** |

#### 8.3 Knowledge Capture and Creation

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Capture and create knowledge in a systematic way | Submit Knowledge form with structured fields | Full submission form with metadata | **Delivered** |
| | File upload for documents | Not implemented (HTML content only) | **Not Implemented** |

#### 8.4 Knowledge Organization and Storage

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Organize and store knowledge for accessibility and usability | Competence-based organization, asset library | Competence pages + asset library with filters | **Delivered** |

#### 8.5 Knowledge Sharing and Transfer

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Enable knowledge sharing and transfer across the organization | Spiral Search, expert identification, cross-competence links | 7-layer search, experts listed per competence | **Partial** |
| | AI-assisted knowledge discovery | Hardcoded mock AI responses | **Not Implemented** |

#### 8.6 Knowledge Application

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Apply knowledge to improve performance | Lessons Learned, Best Practices, Cases as asset types | All three types exist in the data model | **Delivered** |
| | Lessons learned from past mistakes accessible at point of need | Lessons Learned tab per competence | **Delivered** |

**Clause 8 Assessment:** Knowledge identification, organization, storage, and capture are well-supported by the platform. The asset model with full metadata, competence categorization, and structured submission form directly serve ISO 30401 requirements. The main gaps are: no file upload capability (only HTML text content), no real AI-powered knowledge sharing, and the approval workflow doesn't enforce state transitions — it only displays current status.

---

### Clause 9: Performance Evaluation

#### 9.1 Monitoring, Measurement, Analysis, and Evaluation

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Monitor and measure KM performance | KPI Dashboard with quantifiable metrics | 8 KPI cards (total_assets, pending_reviews, etc.) | **Partial** |
| | Search analytics (what users search for, what they click) | Search Logs table in master plan | **Not Implemented** |
| | Audit trail of knowledge access and modifications | Audit Log table in master plan | **Not Implemented** |

#### 9.2 Internal Audit

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Conduct internal audits of the KMS | Audit log for tracking changes | No audit logging | **Not Implemented** |

#### 9.3 Management Review

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Top management reviews the KMS at planned intervals | Governance Dashboard for SteerCo | Dashboard with KPI cards | **Partial** |

**Clause 9 Assessment:** Performance evaluation is the weakest area. The KPI dashboard exists but most values are hardcoded or randomized — they don't reflect actual system data. There is no audit logging, no search analytics, and no management review mechanism beyond the static dashboard. This is a critical gap for any organization seeking ISO 30401 compliance.

---

### Clause 10: Improvement

#### 10.1 Nonconformity and Corrective Action

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| React to nonconformities and take corrective action | Overdue review alerts, review due tracking | Overdue_docs hardcoded to 0, no alert mechanism | **Not Implemented** |

#### 10.2 Continual Improvement

| What ISO 30401 Requires | What We Planned | What Was Built | Status |
|------------------------|-----------------|----------------|--------|
| Continually improve the suitability, adequacy, and effectiveness of the KMS | Review Due dates, Overdue tracking, Approval feedback loops | Review due date field exists, no overdue logic, no feedback mechanism | **Partial** |

**Clause 10 Assessment:** Continual improvement is minimally addressed. Review due dates are stored on assets, but there is no mechanism to flag overdue reviews, send reminders, or track improvement actions. The approval workflow was designed to capture feedback (rejection comments), but without an enforcement engine, this feedback loop is broken.

---

## Compliance Summary

### What ISO 30401 Requires vs. What the Prototype Delivers

```
Clause 4 — Context of the Organization:    ████████░░  75% (Partial)
Clause 5 — Leadership:                      ██████░░░░  60% (Partial)
Clause 6 — Planning:                        █████░░░░░  50% (Partial)
Clause 7 — Support:                         ██████░░░░  60% (Partial)
  └─ 7.5 Documented Information:            ████████░░  80% (Strongest area)
Clause 8 — Operation:                       ███████░░░  70% (Partial)
  └─ 8.4 Knowledge Organization:            █████████░  90% (Strong)
  └─ 8.3 Knowledge Capture:                 ████████░░  80% (Strong)
Clause 9 — Performance Evaluation:          ███░░░░░░░  30% (Weakest area)
Clause 10 — Improvement:                    ████░░░░░░  40% (Partial)
```

### Overall ISO 30401 Alignment: **~55% — Partially Addressed**

The prototype delivers a solid foundation for knowledge management (capture, organization, storage, sharing) but lacks the governance, measurement, and improvement mechanisms that ISO 30401 requires for full compliance.

---

## Where the Prototype Excels (ISO 30401 Support)

### 1. Documented Information (Clause 7.5) — Strongest Area

The platform's knowledge asset model is well-designed for ISO 30401's documented information requirements:

| ISO 30401 Requirement | Prototype Feature | Status |
|----------------------|-------------------|--------|
| Create documented information | Submit Knowledge form | **Delivered** |
| Update documented information | Version field on assets | **Delivered** |
| Control documented information | Owner, reviewer, approver fields | **Delivered** |
| Review date tracking | `review_date` field | **Delivered** |
| Availability and suitability | Search, filters, competence pages | **Delivered** |
| | L0-L3 confidentiality levels with badges | **UI Only** |
| Loss prevention | Approval workflow (display) | **Partial** |

**What's missing:** Backend enforcement of confidentiality levels, version control with change history, document retention policies, and content integrity checks.

### 2. Knowledge Identification (Clause 8.2) — Strong Area

The competence-based organization directly addresses ISO 30401's requirement to identify and categorize organizational knowledge:

- 7 competences covering the organization's technical domains
- Each competence has a designated leader
- Assets tagged by competence, type, and keywords
- Expert identification per competence domain

### 3. Knowledge Capture (Clause 8.3) — Good Foundation

The structured submission form captures knowledge systematically with:
- Title, description, and full content body
- Asset type classification (Procedure, Manual, Case Study, etc.)
- Source reference and related documents
- Tags for discoverability
- Automatic assignment of owner, reviewer, and approver

**What's missing:** File upload (PDFs, DOCX), content validation, and version history.

### 4. Knowledge Application (Clause 8.6) — Supported

The platform supports applying knowledge through:
- Lessons Learned assets (capturing past mistakes)
- Best Practices assets (documenting effective approaches)
- Cases assets (real-world scenarios)
- Cross-competence linking (finding related knowledge in other domains)

---

## Where the Prototype Falls Short (ISO 30401 Gaps)

### 1. Performance Evaluation (Clause 9) — Critical Gap

ISO 30401 requires organizations to monitor, measure, and evaluate their knowledge management performance. The prototype has the *visual framework* (KPI cards) but not the *measurement capability*:

| ISO 30401 Requirement | Current State | Gap |
|----------------------|---------------|-----|
| Monitor KM performance | KPI cards with hardcoded/random values | No real measurement |
| Measure knowledge usage | No search analytics | No usage data collected |
| Evaluate effectiveness | No evaluation mechanism | Subjective only |
| Internal audit capability | No audit logging | Cannot trace changes |
| Management review | Static dashboard | No review workflow |

**Why this matters:** Without real measurement, management cannot make evidence-based decisions about the knowledge management system. The dashboard gives the *appearance* of governance without the *substance*.

### 2. Continual Improvement (Clause 10) — Significant Gap

ISO 30401 requires systematic improvement of the KMS. The prototype lacks:

- **Overdue review alerts** — `overdue_docs` is hardcoded to `0`
- **Improvement action tracking** — No mechanism to capture or track improvement initiatives
- **Feedback loops** — Approval comments exist but are not connected to improvement actions
- **Nonconformity management** — No process for identifying and resolving knowledge gaps

### 3. Leadership Commitment (Clause 5) — Formal Gap

ISO 30401 requires documented leadership commitment through:
- A knowledge management policy (does not exist)
- Assigned responsibilities with documented authority (roles exist but aren't enforced)
- Resource allocation decisions (not documented)
- Management review at planned intervals (dashboard exists but no review process)

### 4. Communication (Clause 7.4) — Missing

ISO 30401 requires internal communication about the KMS:
- No notification system for workflow events
- No announcement or broadcast mechanism
- No feedback collection from users

---

## What the Master Plan Said vs. What We Said We'd Build

The master plan (Section 3) claimed the following ISO 30401 mapping:

| ISO 30401 Clause | Master Plan Claim | Actual Delivery | Honest Assessment |
|-----------------|-------------------|-----------------|-------------------|
| Leadership & Commitment | "Strong" | Dashboard only | **Overstated** — no policy, no documented commitment |
| Knowledge Identification | "Strong" | Competences with assets | **Accurate** — well implemented |
| Knowledge Capture | "Strong" | Submission form | **Accurate** — well implemented |
| Knowledge Sharing | "Strong" | Spiral Search (mock) | **Overstated** — no real AI sharing |
| Knowledge Application | "Good" | Asset types exist | **Accurate** — Lessons Learned, Cases, Best Practices present |
| Competence & Culture | "Good" | Experts display | **Partial** — experts listed, no competence development tracking |
| Documented Information | "Strong" | Asset metadata | **Accurate** — comprehensive metadata model |
| Access Control | "Strong" | Confidentiality badges | **Overstated** — UI only, no backend enforcement |
| Performance Evaluation | "Good" | KPI cards (hardcoded) | **Overstated** — no real measurement or evaluation |
| Continual Improvement | "Good" | Review dates | **Overstated** — no improvement mechanism |

**Summary:** 3 claims are accurate, 4 are overstated, and 3 are partial. The master plan's self-assessment was optimistic in areas requiring governance and enforcement (access control, performance evaluation, continual improvement, leadership commitment).

---

## The ISO 30401 Reality Check

### What the Prototype Demonstrates

The prototype demonstrates that the *software infrastructure* for knowledge management can be built. It shows:

1. Knowledge can be captured with structured metadata
2. Knowledge can be organized by domain (competences)
3. Knowledge can be searched and retrieved
4. Knowledge can flow through an approval lifecycle
5. Knowledge can be classified by confidentiality

These are the *enablers* of ISO 30401, not the *compliance* itself.

### What the Prototype Cannot Deliver

ISO 30401 compliance requires organizational commitment that software cannot provide:

| Requirement | Why Software Alone Cannot Deliver |
|-------------|----------------------------------|
| Knowledge management policy | Requires management decision and documentation |
| Leadership commitment | Requires cultural change, not software |
| Competence development | Requires training programs and assessment |
| Internal audits | Requires trained auditors and audit schedules |
| Management reviews | Requires governance processes and meeting cadences |
| Continual improvement | Requires organizational learning cycles |
| Communication plans | Requires stakeholder engagement strategy |

### The Honest Statement

> "NorthStar Knowledge OS is a software tool designed to support an ISO 30401-aligned knowledge management system. The platform provides the technical infrastructure for knowledge capture, organization, sharing, and governance. However, ISO 30401 compliance requires organizational processes, documented policies, management commitment, training, audits, and continual improvement cycles that extend beyond software. The platform is compliant-ready — it provides the foundation upon which compliance can be built — but it is not, and does not claim to be, ISO 30401 certified."

---

## Roadmap to ISO 30401 Support

### Phase 2: Measurement (Weeks 3-4)

| Action | ISO 30401 Clause Supported | Implementation |
|--------|---------------------------|----------------|
| Replace hardcoded KPIs with real database queries | Clause 9.1 | Compute metrics from actual data |
| Add search analytics logging | Clause 9.1 | Log queries, results, clicks |
| Implement audit logging | Clause 9.2 | Log all CRUD operations with user, timestamp, details |
| Add real-time overdue review alerts | Clause 10.1 | Query assets past review date, trigger notifications |

### Phase 3: Governance (Weeks 5-6)

| Action | ISO 30401 Clause Supported | Implementation |
|--------|---------------------------|----------------|
| Implement full approval workflow engine | Clause 8.1 | Enforce state transitions with audit trail |
| Add management review dashboard | Clause 9.3 | Trend analysis, competence participation metrics |
| Add notification system | Clause 7.4 | Email/in-app for workflow events, overdue reviews |
| Enforce confidentiality levels on backend | Clause 7.5 | Server-side access control per role/level |
| Add improvement action tracking | Clause 10.2 | Create and track improvement initiatives |

### Phase 4: Compliance Readiness (Week 7+)

| Action | ISO 30401 Clause Supported | Implementation |
|--------|---------------------------|----------------|
| Add knowledge management policy document | Clause 5.2 | Publish policy in platform for all users |
| Add competence development tracking | Clause 5.4 | Training records, certification tracking |
| Add export functionality (GDPR Article 20) | Clause 7.5 | Data portability for users |
| Add retention policy enforcement | Clause 7.5 | Automated archival of outdated content |
| Generate compliance reports | Clause 9.2 | Audit-ready reports for internal/external review |

---

## Conclusion

The NorthStar Knowledge OS prototype is a **competent technical foundation** for ISO 30401-aligned knowledge management. It excels at the operational aspects: capturing, organizing, storing, and retrieving knowledge. Its gaps are in the governance aspects: measuring effectiveness, ensuring continual improvement, and providing evidence of compliance.

The path forward is clear:
1. **Fix the measurements** — replace hardcoded KPIs with real data
2. **Add the governance layer** — enforce workflows, add audit logs
3. **Build the improvement cycles** — alerts, tracking, feedback loops
4. **Document the policies** — make the ISO 30401 alignment real, not aspirational

The software is ready to be the *tool* for ISO 30401 compliance. The organizational work — policies, training, audits, management reviews — remains to be done by the people using the tool.

---

*This document is an honest assessment, not a marketing claim. ISO 30401 compliance is achieved through organizational processes, not software alone. This platform supports those processes — it does not replace them.*
