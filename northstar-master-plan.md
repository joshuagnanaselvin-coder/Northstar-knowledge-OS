# NorthStar Knowledge OS — Master Plan

**Version:** 1.0  
**Date:** 2026-08-08  
**Purpose:** Neutral concept prototype to demonstrate a governed Knowledge Management System aligned with ISO 30401:2021  
**Scope:** 5–6 week solo build, dummy data only, no company IP

---

## 1. Concept & Positioning

### One-Line Description

NorthStar Knowledge OS is a governed knowledge management platform that connects documents, people, lessons learned, approvals, confidential access, and AI-powered search into one operating system.

### What It Is NOT

- Not a chatbot
- Not a SharePoint clone
- Not a file portal
- Not a wiki

### What It Is

A complete Knowledge Operating System — governed, searchable, approval-driven, access-controlled, and AI-assisted.

### Why "NorthStar"

The name suggests direction, guidance, navigation, and knowledge discovery — without referencing any company, project, or internal system. It signals a *platform*, not a document library.

---

## 2. Strategic Rationale

### Why Build Outside Company Systems

| Concern | Risk if Built Internally | Solution |
|---------|------------------------|----------|
| IT access restrictions | Cannot install tools, configure databases | Build standalone on local machine |
| Approval delays | Weeks/months waiting for procurement | No approvals needed for a prototype |
| Confidentiality policy | Cannot test with real data | Use only dummy/synthetic data |
| IP ownership questions | Unclear if tool belongs to company or individual | Neutral name, no company branding, clear purpose statement |

### The Management Story

**Opening line:**  
*"Today, knowledge is scattered across 17 heads, 400 SharePoint folders, and a handful of people's memory. NorthStar Knowledge OS makes it governed, searchable, and actionable."*

**Problem:**  
Engineers searching for "alternator excitation issues" get 12 unrelated documents, no expert guidance, and no AI-assisted answer with source references.

**Solution:**  
A governed Knowledge OS with competence spaces, approval workflows, access control, and AI spiral search.

**Future:**  
Build the real version inside approved enterprise systems with IT, security, and management alignment.

---

## 3. ISO 30401:2021 Alignment

This standard provides the requirements for establishing, implementing, maintaining, and improving a Knowledge Management System. The prototype maps directly to its clauses:

| ISO 30401 Clause | Prototype Feature | Coverage |
|-----------------|------------------|----------|
| **Leadership & Commitment** | Governance Dashboard, SteerCo visibility | Strong |
| **Knowledge Identification** | Competence Spaces, Knowledge Asset model | Strong |
| **Knowledge Capture** | Submit Knowledge form, Asset metadata fields | Strong |
| **Knowledge Sharing** | Spiral Search, AI Assistant, Access Levels | Strong |
| **Knowledge Application** | Lessons Learned, Best Practices, Cases | Strong |
| **Competence & Culture** | Experts display, Champions, Leaders roles | Good |
| **Documented Information** | Asset fields (owner, reviewer, approver, review date) | Strong |
| **Access Control** | L0–L4 Confidentiality levels, role-based access | Strong |
| **Performance Evaluation** | KPI Dashboard, Search Logs, Audit Log | Good |
| **Continual Improvement** | Review Due dates, Overdue tracking, Approval feedback | Good |

### Knowledge Compass Governance Mapping

The existing governance model maps directly to the system:

| Governance Layer | System Role |
|-----------------|------------|
| SteerCo | Governance Admin — full system oversight, metrics |
| Leadership Team (21 leaders) | Competence Leaders — approve knowledge assets |
| Knowledge Champions (50 champions) | Knowledge Champions — review submissions, local KM support |
| Community Members | Employees — browse, search, request access, submit knowledge |

---

## 4. MVP Scope — 7 Core Modules

### Module 1: Home Dashboard

**Purpose:** First impression. Management should immediately feel this is a *knowledge operating system*, not a folder browser.

**Elements:**
- Global search bar ("Search Knowledge")
- Browse by Competence (7 competence cards)
- Pending Approvals (for logged-in user's role)
- Recently Updated Knowledge (last 10 assets)
- Most Used Documents (search/access metrics)
- Expired / Review Due Documents (overdue alerts)
- Ask AI Assistant (quick access to Spiral Search)
- Submit New Knowledge (quick action button)
- KPI summary cards (total assets, pending reviews, active competences)

### Module 2: Competence Spaces

**Purpose:** Organize knowledge by technical domain, each with its own dedicated space.

**Demo Structure (7 competences):**

1. Electrical Systems
2. Mechanical Design
3. Automation
4. Product Support
5. Field Service
6. Quality
7. Project Management

**Each competence page contains:**
- Overview (description, scope, leader)
- Key Experts (linked user profiles)
- Documents (filtered asset list)
- Lessons Learned (filtered by type)
- Best Practices (filtered by type)
- Training Materials (filtered by type)
- FAQs
- Approval Queue (pending items for this competence)
- Confidential Area (restricted access section)
- KPI Snapshot (participation metrics)

**Build scope:** 2 competences fully built, 5 simplified views.

### Module 3: Knowledge Library

**Purpose:** Browse, filter, and discover all knowledge assets.

**Features:**
- Grid/list view toggle
- Filter by: Competence, Knowledge Type, Confidentiality Level, Status, Owner
- Sort by: Most Recent, Most Used, Review Due Date, Title
- Search bar with basic keyword search
- Asset cards showing: Title, Type badge, Confidentiality badge, Owner, Review Due date, Status

### Module 4: Knowledge Asset Detail

**Purpose:** The full metadata view of any knowledge asset.

**Every asset displays:**
- Title and Summary
- Competence (linked to competence page)
- Knowledge Type (Troubleshooting Case, Lesson Learned, Best Practice, Training Material, Standard Procedure, etc.)
- Owner (linked user profile)
- Reviewer (linked user profile)
- Approver (linked user profile)
- Confidentiality Level (visual badge: L0–L4)
- Status (Draft, Submitted, In Review, Approved, Published, Overdue, Archived)
- Version number
- Review Due Date
- Tags
- Related Documents (linked assets)
- Related Expert (linked user)
- Source Reference
- Audit history (who changed what and when)
- Action buttons: Request Access, Ask AI About This, View Related Lessons, View Expert

### Module 5: Approval Workflow

**Purpose:** Governed content lifecycle with role-based approvals.

**Workflow State Machine:**

```
┌─────────┐     [Submit]      ┌───────────┐
│  DRAFT  │ ────────────────▶ │ SUBMITTED │
└────┬────┘                    └─────┬─────┘
     ▲                              │
     │  [Champion Reject]            │ [Champion Approve]
     │                              ▼
     │                    ┌─────────────────┐
     └────────────────────│ LEADER REVIEW   │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
               [Approve]    [Return for     [Request
                    │        Revision]       Changes]
                    │              │              │
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │PUBLISHED │  │  DRAFT   │  │  DRAFT   │
              └────┬─────┘  └──────────┘  └──────────┘
                   │
           ┌───────┼────────┐
           │       │        │
      [Review  [Review   [Archive
        Pass]   Overdue]  Request]
           │       │        │
           ▼       ▼        ▼
    ┌──────────┐ ┌──────┐ ┌──────────┐
    │PUBLISHED │ │OVERDUE│ │ARCHIVED  │
    │(new ver) │ └──────┘ └──────────┘
    └──────────┘
```

**Features:**
- Submit for Approval (from Draft)
- Champion Review screen (approve / reject with comments)
- Leader Approval screen (approve / return for revision / request changes)
- Rejection with reason tracking
- Review Due date tracking
- Overdue alerts and notifications
- Archive request and confirmation
- Full audit trail of all state transitions

### Module 6: Confidential Access Layer

**Purpose:** Protect sensitive knowledge while enabling appropriate access.

**Access Levels:**

| Level | Name | Who Can Access | Demo Users |
|-------|------|---------------|------------|
| L0 | Public Demo Knowledge | Everyone (including unauthenticated) | All users |
| L1 | Competence Only | Members of the specific competence | Employee, Champion, Leader, Admin |
| L2 | Cross-Functional Restricted | Designated roles across competences | Champion, Leader, Admin |
| L3 | Leadership Restricted | Leadership team and above | Leader, Admin |
| L4 | Named Users Only | Explicitly granted individual access | Admin grants, specific users |

**Demo User Accounts (dummy data only):**

```
admin@northstar.demo    → Governance Admin (all access)
leader@northstar.demo   → Competence Leader (L0–L3)
champion@northstar.demo → Knowledge Champion (L0–L2)
employee@northstar.demo → Employee (L0–L1)
```

**Features:**
- Visual confidentiality badges on all assets
- Blurred/locked content for unauthorized users
- "Request Access" button for restricted content
- Access request approval flow
- Role-based UI (different menus and actions per role)

### Module 7: AI Spiral Search (The Killer Feature)

**Purpose:** Multi-source, AI-powered knowledge discovery — the feature that makes this different from every other KM tool.

**How Normal Search Works:**
1. User types a query
2. System returns a list of matching documents
3. User opens documents one by one
4. User manually connects the dots

**How Spiral Search Works:**

When a user searches, the system surfaces **8 layers of knowledge simultaneously**:

```
User Query: "How to troubleshoot repeated generator shutdown?"

Spiral Search Returns:

┌─────────────────────────────────────────────────┐
│ Layer 1: Best Matching Documents                │
│  • Generator Shutdown Troubleshooting Guide v2.1 │
│  • Alternator Excitation Troubleshooting Guide   │
│  • Alarm Matrix — Generator Protection           │
├─────────────────────────────────────────────────┤
│ Layer 2: Related Lessons Learned                 │
│  • Lesson: Cooling Fan Failure Caused Shutdown   │
│  • Lesson: Sensor Fault Cascade Sequence         │
├─────────────────────────────────────────────────┤
│ Layer 3: Related Troubleshooting Cases            │
│  • Case: Repeated Shutdown — Unit #47            │
│  • Case: Overload-Induced Trip — Q3 2025         │
├─────────────────────────────────────────────────┤
│ Layer 4: Similar Issues from Other Competences   │
│  • Automation: Controller Alarm Sequencing        │
│  • Quality: Root Cause — Unplanned Stops         │
├─────────────────────────────────────────────────┤
│ Layer 5: Experts Who Reviewed This Topic         │
│  • Demo Electrical SME (8 related assets)        │
│  • Demo Field Support Champion (5 related assets)│
├─────────────────────────────────────────────────┤
│ Layer 6: Training Materials                      │
│  • Training: Alarm Analysis Basics               │
│  • Training: Generator Protection Relays         │
├─────────────────────────────────────────────────┤
│ Layer 7: Open Improvement Actions                │
│  • Action #42: Update shutdown procedure         │
│  • Action #38: Revise alarm response matrix      │
├─────────────────────────────────────────────────┤
│ Layer 8: AI-Generated Answer with Citations      │
│                                                     │
│  Based on approved knowledge assets, repeated     │
│  generator shutdown may be linked to:             │
│                                                     │
│  1. Sensor fault causing false alarm signals      │
│  2. Overload condition triggering protection trip │
│  3. Cooling system failure leading to thermal cut │
│  4. Controller alarm sequence misconfiguration    │
│                                                     │
│  Sources:                                         │
│  [1] Generator Shutdown Troubleshooting Guide     │
│  [2] Lesson Learned: Cooling Fan Failure Case     │
│  [3] Training: Alarm Analysis Basics              │
│                                                     │
│  Related Expert: Demo Electrical SME              │
└─────────────────────────────────────────────────┘
```

**Technical Implementation:**
- LlamaIndex RAG pipeline
- Qdrant vector database for semantic search
- Metadata filtering (competence, type, confidentiality, status)
- Source citation in AI-generated answers
- Pre-seeded with realistic dummy data for credible demo queries

---

## 5. Technology Stack

### Recommended Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend Framework** | React + TypeScript | Industry standard, type safety, large ecosystem |
| **Build Tool** | Vite | Fast dev server, excellent DX |
| **Styling** | Tailwind CSS | Rapid, consistent UI development |
| **UI Components** | shadcn/ui | Professional, accessible, customizable |
| **Charts** | Recharts | Clean charts for KPI dashboard |
| **Backend** | Python FastAPI | Fast, clean API design, async support, great for AI endpoints |
| **Primary Database** | PostgreSQL | Relational data (users, assets, approvals, audit logs) |
| **Vector Database** | Qdrant | Self-hostable, Docker-friendly, good Python SDK |
| **RAG Framework** | LlamaIndex | Easier setup than Haystack, good source citation support |
| **LLM (Demo)** | OpenAI GPT-4o-mini | Fastest path to credible demo results |
| **LLM (Alternative)** | Claude Haiku / Together AI / Groq | Lower cost options |
| **File Storage** | Local filesystem or MinIO | Fine for prototype |
| **Auth** | Simple role-based login | Sufficient for demo |
| **Orchestration** | Docker Compose | One command to start entire backend |
| **Version Control** | Git + GitHub | Standard practice |

### Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│              React Frontend (Vite + TS)              │
│         Tailwind + shadcn/ui + Recharts              │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │ Dashboard│ │Competences│ │   AI Spiral Search  │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │  Library  │ │Approvals │ │  Governance Panel   │  │
│  └──────────┘ └──────────┘ └────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────────────┐
│              FastAPI Backend                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │ Users  │ │ Assets │ │Approval│ │  Access Ctrl  │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │ Audit  │ │ Search │ │  KPI   │ │  Competences  │  │
│  │  Log   │ │  Log   │ │Metrics │ │              │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │         RAG Engine (LlamaIndex)              │    │
│  │  Ingest → Chunk → Embed → Index             │    │
│  │  Query → Retrieve → Generate → Cite          │    │
│  └──────────────────────────────────────────────┘    │
└──────────┬───────────────────────────┬───────────────┘
           │                           │
           ▼                           ▼
┌──────────────────────┐    ┌───────────────────┐
│     PostgreSQL       │    │      Qdrant       │
│  (users, assets,     │    │  (embeddings,     │
│   approvals, logs,   │    │   vector index,   │
│   competences, KPIs) │    │   metadata)       │
└──────────────────────┘    └───────────────────┘
```

---

## 6. Database Schema

### Core Tables

```sql
-- Users & Roles
Users (id, name, email, role, competence_id, avatar_url, created_at)

-- Competences
Competences (id, name, description, leader_id, champion_ids[], kpi_target, created_at)

-- Knowledge Assets (the core entity)
KnowledgeAssets (id, title, summary, competence_id, knowledge_type,
                 owner_id, reviewer_id, approver_id,
                 confidentiality_level, status, version,
                 review_due_date, tags[], related_asset_ids[],
                 source_reference, file_path, file_type,
                 created_at, updated_at, published_at)

-- Approval Workflow
ApprovalRequests (id, asset_id, requester_id, reviewer_id, approver_id,
                  current_stage, stage_history[], submitted_at,
                  approved_at, rejection_reason, comments)

-- Access Control
AccessRequests (id, user_id, asset_id, requested_level,
                status, requested_at, reviewed_by, reviewed_at, comments)

-- Audit Trail
AuditLog (id, user_id, action, target_type, target_id,
          timestamp, ip_address, details)

-- Search Analytics
SearchLogs (id, user_id, query, results_count, clicked_result_id,
            timestamp, session_id)

-- KPI Metrics
KPIMetrics (id, competence_id, metric_name, value,
            measurement_period, recorded_at)
```

### Qdrant Collection Schema

```
KnowledgeChunk:
  - id: UUID
  - text: str (chunked content)
  - embedding: float[1536] (OpenAI ada-002 or similar)
  - metadata:
      - asset_id: int
      - competence_id: int
      - knowledge_type: str
      - confidentiality_level: str
      - status: str
      - owner_id: int
      - title: str
      - tags: list[str]
      - chunk_index: int
```

---

## 7. Seed Data Plan

### Users (6 dummy accounts)

| Email | Role | Competence |
|-------|------|-----------|
| admin@northstar.demo | Governance Admin | All |
| leader.elec@northstar.demo | Competence Leader | Electrical Systems |
| leader.mech@northstar.demo | Competence Leader | Mechanical Design |
| champion@northstar.demo | Knowledge Champion | Multiple |
| employee@northstar.demo | Employee | Electrical Systems |
| employee2@northstar.demo | Employee | Mechanical Design |

### Competences (7)

1. Electrical Systems — Leader: leader.elec@northstar.demo
2. Mechanical Design — Leader: leader.mech@northstar.demo
3. Automation — Leader: leader.elec@northstar.demo
4. Product Support — Leader: leader.mech@northstar.demo
5. Field Service — Leader: leader.elec@northstar.demo
6. Quality — Leader: leader.mech@northstar.demo
7. Project Management — Leader: leader.mech@northstar.demo

### Knowledge Assets (25–30 samples)

| # | Title | Type | Competence | Confidentiality | Status | Owner |
|---|-------|------|-----------|----------------|--------|-------|
| 1 | Pump Seal Failure Lesson Learned | Lesson Learned | Mechanical Design | L1 | Published | champion@ |
| 2 | Generator Shutdown Troubleshooting Guide | Troubleshooting Case | Electrical Systems | L1 | Published | leader.elec@ |
| 3 | Compressor Oil Carryover Case Study | Case Study | Mechanical Design | L2 | Published | employee2@ |
| 4 | Design Review Checklist | Standard Procedure | Mechanical Design | L0 | Published | champion@ |
| 5 | Project Handover Template | Template | Project Management | L0 | Published | leader.mech@ |
| 6 | Customer Complaint Root Cause Format | Template | Quality | L0 | Published | employee2@ |
| 7 | Technical Training Plan — Q3 | Training Material | Field Service | L1 | Published | champion@ |
| 8 | Knowledge Capture Template | Template | All | L0 | Published | admin@ |
| 9 | PLC Programming Best Practices | Best Practice | Automation | L1 | Published | leader.elec@ |
| 10 | Alternator Excitation Troubleshooting | Troubleshooting Case | Electrical Systems | L1 | Published | leader.elec@ |
| 11 | Vibration Analysis Methodology | Standard Procedure | Mechanical Design | L1 | Published | employee2@ |
| 12 | Safety Incident Near-Miss Report | Lesson Learned | Quality | L2 | Published | champion@ |
| 13 | SCADA System Configuration Guide | Best Practice | Automation | L2 | In Review | employee2@ |
| 14 | Field Service Report Template | Template | Field Service | L0 | Published | champion@ |
| 15 | Root Cause Analysis Workshop Materials | Training Material | Quality | L1 | Published | employee2@ |
| 16 | Generator Alarm Matrix | Reference | Electrical Systems | L1 | Published | leader.elec@ |
| 17 | Motor Control Circuit Design Guide | Best Practice | Electrical Systems | L2 | Draft | employee@ |
| 18 | Preventive Maintenance Schedule | Standard Procedure | Field Service | L1 | Published | champion@ |
| 19 | Product Specification Change Process | Standard Procedure | Project Management | L3 | Published | leader.mech@ |
| 20 | Bearing Failure Root Cause Analysis | Lesson Learned | Mechanical Design | L1 | Published | employee2@ |
| 21 | HMI Screen Design Standards | Best Practice | Automation | L1 | Published | leader.elec@ |
| 22 | Customer Site Survey Checklist | Template | Field Service | L1 | Published | champion@ |
| 23 | Non-Conformance Report Template | Template | Quality | L0 | Published | employee2@ |
| 24 | Project Risk Assessment Matrix | Template | Project Management | L2 | Draft | employee@ |
| 25 | Cooling System Overhaul Procedure | Standard Procedure | Mechanical Design | L1 | In Review | employee2@ |
| 26 | Sensor Calibration Protocol | Standard Procedure | Automation | L2 | Published | leader.elec@ |
| 27 | Field Engineer Onboarding Guide | Training Material | Field Service | L1 | Published | champion@ |
| 28 | Design Failure Mode Analysis | Best Practice | Mechanical Design | L2 | Published | employee2@ |
| 29 | ISO 30401 Knowledge Audit Checklist | Template | All | L3 | Published | admin@ |
| 30 | Emergency Response Procedure | Standard Procedure | All | L0 | Published | admin@ |

### Approval Workflows (3 sample tracks)

**Sample 1: Published Asset**
Motor Control Circuit Design Guide → Draft → Submitted → Champion Review → Leader Approval → Published

**Sample 2: In Review Asset**
SCADA System Configuration Guide → Draft → Submitted → In Review (awaiting champion)

**Sample 3: Overdue Asset**
Alternator Excitation Guide → Published → Review Due (overdue by 15 days)

---

## 8. Demo Data Guidelines

### What To Use

- Technical content: realistic troubleshooting scenarios, plausible lessons learned, believable document titles
- Company-adjacent but not real: use generic engineering/industrial contexts
- Realistic user names and email patterns
- Plausible dates, version numbers, and review cycles

### What NOT To Use

- Internal company files or documents
- Customer data or project details
- Real employee names or contact information
- Confidential or proprietary content
- Screenshots of internal systems
- ISO licensed document text

### Rule

Everything in the prototype must be synthetic. If you wouldn't show it to a stranger, it doesn't go in the demo.

---

## 9. Development Plan — 6 Weeks

### Week 1: Design & Foundation

**Goal:** Design, schema, and environment ready.

- [ ] Finalize name, logo, and tagline
- [ ] Create wireframes for all 7 screens
- [ ] Design PostgreSQL schema (full DDL)
- [ ] Design Qdrant collection schema
- [ ] Set up Docker Compose (PostgreSQL + Qdrant + FastAPI + React)
- [ ] Create seed data scripts (users, competences, 30 assets, 3 workflows)
- [ ] Create 5-minute demo script
- [ ] Initialize Git repository

**Deliverables:** Schema documentation, running environment, seed data, wireframes

### Week 2: Core Application

**Goal:** All CRUD operations working, all 7 screens have real content.

- [ ] React app with routing (all 7 routes)
- [ ] FastAPI with all REST endpoints
- [ ] PostgreSQL with seed data loaded
- [ ] Login page with 4 role-based views
- [ ] Home Dashboard with KPI cards
- [ ] Competence pages (2 fully built, 5 simplified)
- [ ] Knowledge Library with filtering and search
- [ ] Knowledge Asset detail page with full metadata
- [ ] Basic navigation and layout shell

**Must be pixel-perfect:** Home Dashboard, Competence page, Asset detail page

**Deliverables:** Functional web app with all core screens

### Week 3: Governance & Access

**Goal:** Approval workflow and access control working.

- [ ] Approval workflow state machine (backend)
- [ ] Submit for Approval flow (frontend + backend)
- [ ] Champion Review screen
- [ ] Leader Approval screen
- [ ] Rejection with comments
- [ ] Return-for-revision flow
- [ ] Review Due date tracking
- [ ] Overdue alerts
- [ ] Role-based UI (per-role menus and actions)
- [ ] Confidentiality badge system
- [ ] Access Request flow
- [ ] Audit log (backend + Governance Dashboard view)

**Deliverables:** Working approval system with full state transitions

### Week 4: AI Spiral Search

**Goal:** The killer feature works and impresses.

- [ ] Document ingestion pipeline (read files, chunk, embed)
- [ ] Qdrant vector index with metadata
- [ ] LlamaIndex RAG pipeline setup
- [ ] Spiral Search UI with 8-layer results
- [ ] AI answer with source citations
- [ ] Metadata-filtered search
- [ ] Pre-load 15 demo queries
- [ ] Test all demo queries for quality
- [ ] Tune prompts and chunking strategy

**Critical:** Pre-test every demo query. If AI answers are mediocre, fix before demo.

**Deliverables:** Functional RAG search with credible demo results

### Week 5: Polish

**Goal:** Make it look production-quality.

- [ ] Governance Dashboard with metrics
- [ ] KPI Dashboard with charts (Recharts)
- [ ] Responsive design check
- [ ] Loading states and empty states
- [ ] Error handling and user feedback
- [ ] Color-coded confidentiality levels
- [ ] Consistent spacing, typography, and component usage
- [ ] Font selection and branding consistency

**Deliverables:** Polished, demo-ready application

### Week 6: Demo Package

**Goal:** Presentation-ready materials.

- [ ] Record demo video (Loom or similar)
- [ ] Write 1-page concept summary document
- [ ] Create "Why Not SharePoint?" comparison slide
- [ ] Create presentation deck (5–7 slides)
- [ ] Internal testing with 2–3 people
- [ ] Bug fixes based on feedback
- [ ] Prepare answers to likely questions (security, cost, integration, timeline)
- [ ] Prepare "what happens next" roadmap slide

**Deliverables:** Complete demo package — app, video, slides, summary document

---

## 10. Demo Presentation

### The Demo Script (5 Minutes)

**Slide 1: The Problem (30 seconds)**
"Today, knowledge in our organization lives in 17 heads, 400 SharePoint folders, and a handful of people's memory. When an engineer needs to find information, they get a document list — not an answer."

**Slide 2: The Concept (30 seconds)**
"NorthStar Knowledge OS is a governed knowledge operating system. It connects people, documents, lessons learned, approvals, and AI search into one platform. It aligns with ISO 30401, the international standard for knowledge management."

**Slide 3: The Home Dashboard (30 seconds)**
"Users land on a dashboard that shows what matters: pending approvals, recently updated knowledge, overdue reviews, and instant access to search and AI assistance."

*Click through: Show Dashboard, hover on KPI cards*

**Slide 4: Competence Spaces (30 seconds)**
"Knowledge is organized by competence — Electrical Systems, Mechanical Design, Automation, and so on. Each space has its own documents, experts, lessons learned, best practices, and approval queue."

*Click through: Navigate to Electrical Systems, show sub-sections*

**Slide 5: Knowledge Assets with Governance (30 seconds)**
"Every piece of knowledge has an owner, a reviewer, an approver, a review date, a confidentiality level, and a version. This is ISO 30401's documented information control in action."

*Click through: Show asset detail page, highlight metadata fields*

**Slide 6: Approval Workflow (30 seconds)**
"Content goes through a governed lifecycle: Draft, Submitted, Champion Review, Leader Approval, Published, Review Due, and Archive. Every transition is tracked with an audit trail."

*Click through: Show approval queue, a document in "In Review" state, then "Published"*

**Slide 7: Spiral Search — The Wow Moment (60 seconds)**
"Here is where it becomes different. Watch."

*Type in a search query related to the organization's actual challenges. Show:*
1. Direct document matches
2. Related lessons learned
3. Related cases
4. Similar issues from other competences
5. Recommended experts
6. Training materials
7. Open improvement actions
8. AI-generated answer with source citations

*"One search. Eight layers of knowledge. An answer with references."*

**Slide 8: Confidential Access (30 seconds)**
"Knowledge isn't shared blindly. Every asset has a confidentiality level. Employees see what they need. Sensitive content stays protected. Access requests are tracked and approved."

*Click through: Switch between user roles, show same page with different access levels*

**Slide 9: Governance Dashboard (30 seconds)**
"For management, there's a real-time view: participation metrics per competence, pending approvals, overdue reviews, audit trails, and knowledge coverage."

*Click through: Show Governance Dashboard with charts and metrics*

**Slide 10: What Happens Next (30 seconds)**
"This prototype is a concept. The real system would be built inside our approved enterprise infrastructure — SharePoint, Microsoft Search, Power Automate, and Azure AI. The path is:

- Phase 1: Validate this concept (now)
- Phase 2: Pilot with 2 competences using real data
- Phase 3: Expand to all competences
- Phase 4: Full enterprise integration"

### Likely Questions & Prepared Answers

**Q: "Why not just use SharePoint?"**
A: "SharePoint is excellent for document storage and will be part of the final solution. But it doesn't provide competence-based organization, structured approval workflows with role-based governance, multi-source AI search with citations, or knowledge-specific metadata. NorthStar fills those gaps."

**Q: "How much would the real system cost?"**
A: "The prototype proves the concept. The production version would leverage existing Microsoft 365 investments — SharePoint for storage, Microsoft Search for indexing, Power Automate for workflows, and Copilot Studio or Azure AI Search for the AI layer. The incremental cost is primarily implementation and configuration effort, not new software licenses."

**Q: "What about security and data privacy?"**
A: "This prototype uses only dummy data. The production version would run inside our infrastructure with existing identity management (Microsoft Entra ID), existing access controls (Microsoft Permissions Model), and existing compliance frameworks. No data leaves our environment."

**Q: "How long to build the real version?"**
A: "A phased approach: 3 months for a 2-competence pilot, 6 months for full organizational rollout. But we don't have to guess — this prototype lets us validate the concept and refine requirements before committing."

**Q: "Who would own and run this?"**
A: "The Knowledge Compass governance model already defines the ownership: SteerCo for strategy, Competence Leaders for content governance, and Knowledge Champions for day-to-day enablement. The system is the tool; the governance model is the operating system."

---

## 11. Key Screens Reference

| # | Screen | Priority | Status |
|---|--------|----------|--------|
| 1 | Landing / Login | Must Have | Week 2 |
| 2 | Home Dashboard | Must Have | Week 2 |
| 3 | Competence Page | Must Have | Week 2 |
| 4 | Knowledge Library | Must Have | Week 2 |
| 5 | Knowledge Asset Detail | Must Have | Week 2 |
| 6 | Submit Knowledge Form | Must Have | Week 3 |
| 7 | Approval Queue | Must Have | Week 3 |
| 8 | Champion Review Screen | Must Have | Week 3 |
| 9 | Leader Approval Screen | Must Have | Week 3 |
| 10 | Spiral Search Results | Must Have | Week 4 |
| 11 | AI Answer Panel | Must Have | Week 4 |
| 12 | Access Request Flow | Should Have | Week 3 |
| 13 | Governance Dashboard | Should Have | Week 5 |
| 14 | KPI Dashboard | Should Have | Week 5 |
| 15 | Audit Log View | Nice to Have | Week 5 |

---

## 12. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| RAG answers are poor quality in demo | High | Medium | Use GPT-4o-mini, craft quality dummy data, pre-test all queries, tune prompts |
| UI doesn't look polished enough | Medium | Medium | Use shadcn/ui consistently, spend extra time on Dashboard and Search screens |
| 6-week timeline slips | Medium | High | Prioritize must-have screens, simplify approval workflow if needed, buffer in Week 6 |
| Management doesn't grasp the concept | Medium | Low | Prepare demo script, practice narrative, have comparison slides ready |
| "Why not SharePoint?" objection | High | High | Prepare comparison slide, emphasize governance + AI + competence structure gaps |
| Technical issues during live demo | Medium | Low | Record backup video, test on two devices, have screenshots ready |
| Building too much, demoing too little | Medium | Medium | Focus on 5 key screens for Week 5, mark rest as "Phase 2" |
| Docker / environment issues | Low | Medium | Test environment setup early in Week 1, document setup steps |

---

## 13. Success Criteria

The prototype succeeds if, after the demo, management says any of the following:

- "We should build this internally."
- "Can we pilot this with 2 competences?"
- "What would it take to integrate this with our systems?"
- "I want to show this to [other executive]."

The prototype fails if:

- The AI search gives poor or hallucinated answers during the demo
- The UI looks like an internal tool, not a platform
- The demo narrative is unclear or too technical
- Management's response is "we already have SharePoint"

---

## 14. Post-Prototype Roadmap

### Phase 1: Concept Validation (Now — 6 Weeks)
- Build NorthStar Knowledge OS prototype
- Demo to management
- Gather feedback and refine requirements

### Phase 2: Pilot (Months 2–4)
- Select 2 competences for pilot
- Ingest real (sanitized) knowledge assets
- Onboard 20–30 real users
- Measure usage, satisfaction, and knowledge findability
- Refine based on pilot feedback

### Phase 3: Expansion (Months 5–8)
- Roll out to all 7 competences
- Onboard all 21 leaders and 50 champions
- Activate full governance model
- Integrate with Microsoft 365 (SharePoint, Teams, Search)

### Phase 4: Enterprise Integration (Months 9–12)
- Microsoft Search integration for unified search experience
- Power Automate for approval workflows
- Power BI for governance dashboards
- Copilot Studio or Azure AI Search for AI layer
- Full ISO 30401 compliance audit

---

## 15. Technical Quick Start Commands

### Docker Compose Setup

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: northstar
      POSTGRES_USER: northstar
      POSTGRES_PASSWORD: northstar
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://northstar:northstar@postgres:5432/northstar
      - QDRANT_URL=http://qdrant:6333
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - qdrant

volumes:
  postgres_data:
  qdrant_data:
```

### Project Structure

```
northstar-knowledge-os/
├── docker-compose.yml
├── README.md
├── .env
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── alembic/
│   ├── models/
│   │   ├── user.py
│   │   ├── competence.py
│   │   ├── knowledge_asset.py
│   │   ├── approval.py
│   │   ├── access.py
│   │   ├── audit.py
│   │   └── kpi.py
│   ├── schemas/
│   ├── routers/
│   │   ├── auth.py
│   │   ├── competences.py
│   │   ├── assets.py
│   │   ├── approvals.py
│   │   ├── search.py
│   │   ├── governance.py
│   │   └── admin.py
│   ├── services/
│   │   ├── rag_engine.py
│   │   ├── document_ingestion.py
│   │   └── embedding_service.py
│   ├── seed_data.py
│   └── config.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── routes/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Competences.tsx
│   │   │   ├── CompetenceDetail.tsx
│   │   │   ├── Library.tsx
│   │   │   ├── AssetDetail.tsx
│   │   │   ├── SubmitKnowledge.tsx
│   │   │   ├── ApprovalQueue.tsx
│   │   │   ├── SpiralSearch.tsx
│   │   │   ├── Governance.tsx
│   │   │   └── Login.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── AssetCard.tsx
│   │   │   ├── ConfidentialityBadge.tsx
│   │   │   ├── ApprovalFlow.tsx
│   │   │   ├── SpiralResults.tsx
│   │   │   └── KPICard.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── data/
│   │       └── seed.ts
│   └── index.html
└── docs/
    ├── schema.md
    ├── api.md
    └── demo-script.md
```

---

## 16. Environment Variables

```bash
# .env
# Database
DATABASE_URL=postgresql://northstar:northstar@localhost:5432/northstar

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# AI / LLM
OPENAI_API_KEY=sk-...
# Or alternative:
# ANTHROPIC_API_KEY=sk-ant-...
# TOGETHER_API_KEY=...
# GROQ_API_KEY=...

# Application
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173

# App
APP_NAME=NorthStar Knowledge OS
APP_VERSION=0.1.0
```

---

## 17. Dependencies

### Backend (requirements.txt)

```
fastapi==0.110.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.28
alembic==1.13.0
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
qdrant-client==1.7.0
llama-index==0.10.0
llama-index-llms-openai==0.1.0
llama-index-embeddings-openai==0.1.0
llama-index-readers-file==0.1.0
python-dotenv==1.0.0
```

### Frontend (package.json dependencies)

```
react, react-dom, react-router-dom
typescript, @types/react, @types/react-dom
vite, @vitejs/plugin-react
tailwindcss, postcss, autoprefixer
shadcn/ui components
recharts
axios
lucide-react
```

---

## 18. Demo Queries (Pre-Tested)

Prepare these queries for the Spiral Search demo. Ensure each produces credible results:

1. "How to troubleshoot repeated generator shutdown?"
2. "What are the best practices for PLC programming?"
3. "How do I handle a customer complaint?"
4. "What is the procedure for design review?"
5. "Lessons learned from pump failures"
6. "How to onboard a new field engineer?"
7. "Root cause analysis process"
8. "Motor control circuit design guidelines"
9. "Preventive maintenance schedule"
10. "How to request access to confidential documents?"
11. "Who is the expert on vibration analysis?"
12. "What training is available for automation?"
13. "Safety incident reporting procedure"
14. "How does the approval process work?"
15. "What documents are due for review?"

---

## 19. Project Principles

### The Three Non-Negotiables

1. **No real data ever.** Every piece of content in the prototype is synthetic. No exceptions.
2. **No company branding.** The name, logos, and identity are neutral. This is a concept, not an internal project.
3. **Clear positioning as a prototype.** When presenting, always state: "This is a neutral concept prototype demonstrating the operating model. The final system would be built inside approved enterprise infrastructure."

### The Story Always Comes First

Technology impresses engineers. A story impresses management. Always lead with the problem, not the solution. Show the pain before showing the tool.

---

## 20. Files in This Directory

```
NorthStar-Knowledge-OS/
├── MASTER-PLAN.md          ← This file — the complete plan
├── README.md               ← Quick start and overview
├── docker-compose.yml      ← Backend orchestration
├── .env.example            ← Environment variables template
├── backend/                ← FastAPI backend (to be built)
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   ├── schemas/
│   ├── routers/
│   ├── services/
│   └── seed_data.py
├── frontend/               ← React frontend (to be built)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── data/
└── docs/
    ├── schema.md
    ├── api.md
    └── demo-script.md
```

---

*This document is the master reference for the NorthStar Knowledge OS prototype. All development decisions should trace back to this plan.*
