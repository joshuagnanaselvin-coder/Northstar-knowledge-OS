# Live Demo Script

**Duration:** 15-20 minutes
**Presenter Role:** Solution Architect / Technical Lead
**Audience:** Management, stakeholders, or technical reviewers

---

## Pre-Demo Checklist

- [ ] Backend server running on port 8000 (`uvicorn main:app --reload`)
- [ ] Frontend dev server running on port 5173 (`npm run dev`)
- [ ] Browser open to `http://localhost:5173`
- [ ] Close any other browser tabs to avoid confusion
- [ ] Have browser DevTools Network tab open (optional, for demonstrating API calls)
- [ ] Test that seed data loaded (check `/api/health` returns `"status": "ok"`)

---

## Act 1: Introduction (1 minute)

**Script:**
> "Good morning. Today I'll walk you through the NorthStar Knowledge OS — a knowledge management platform designed for industrial enterprises. I'll show you the full user experience, from logging in through searching the knowledge base, to managing approvals. Let's begin."

**Action:** Navigate to `http://localhost:5173`

---

## Act 2: Login & User Selection (2 minutes)

**Script:**
> "The platform uses role-based access. Users don't create accounts — they're provisioned by an administrator and log in by selecting their identity. We have five role levels, from Community Member up to Admin, each with different permissions."

**Actions:**
1. Point out the login screen with 7 pre-seeded users
2. Click on "Alice Chen (Admin)" — notice the Admin badge
3. Click "Sign In"

**Talking Points:**
- Mention the 7 pre-seeded users with different roles
- Note the ISO 30401 badge (acknowledge it as a design reference, not certification)
- Explain that in production, this would integrate with SSO/Active Directory

---

## Act 3: Dashboard Overview (3 minutes)

**Script:**
> "This is the main dashboard. It gives leadership a real-time snapshot of the knowledge base health. You can see KPIs across the top — total assets, pending reviews, active competences, and more. Below that, recently updated assets and quick actions."

**Actions:**
1. Scroll through the KPI cards, pointing out each metric
2. Scroll to "Recent Assets" section — click "View All" to go to Library
3. Click back button to return to Dashboard
4. Scroll to "Pending Approvals" section
5. Scroll to "Governance Status" card

**Talking Points:**
- Explain each KPI and why it matters for governance
- Note that overdue_docs is currently 0 (hardcoded in this prototype)
- Mention the governance status card showing ISO 30401 alignment (aspirational)

---

## Act 4: Competences (3 minutes)

**Script:**
> "Knowledge in NorthStar is organized around Competences — subject-matter domains like Electrical Systems, Mechanical Design, or Automation. Each competence has a leader, member count, and associated assets."

**Actions:**
1. Click "Competences" in the sidebar
2. Show the 7 competence cards with their colors and icons
3. Click on "Electrical Systems" (first card)
4. Walk through the 7 tabs: Overview, Assets, Lessons Learned, Experts, Training, Related, Activity

**Talking Points:**
- Explain the 7-tab structure and what each tab represents
- In the "Experts" tab, show how the platform identifies subject-matter experts
- In the "Training" tab, note that training data is currently hardcoded (planned for LMS integration)
- Mention the color-coded confidentiality badges

---

## Act 5: Knowledge Library (3 minutes)

**Script:**
> "The Knowledge Library is where all knowledge assets live. Users can search, filter by competence, asset type, confidentiality level, and status. Let me show you the filtering capabilities."

**Actions:**
1. Click "Library" in the sidebar
2. Apply a filter: Select "Procedure" from Asset Type dropdown
3. Clear filter, apply confidentiality filter: Select "L1 - Internal"
4. Clear all filters
5. Click on "Generator Shutdown Procedure" asset card
6. Walk through the asset detail view

**Talking Points:**
- Show the filter bar and how it narrows results
- In the asset detail, point out: title, version, tags, confidentiality badge, owner, reviewer, approver
- Scroll to the content area — note the HTML-rendered knowledge content
- Mention that in production, this would support PDF uploads and file attachments
- Point out the "Related Documents" section

---

## Act 6: Spiral Search (2 minutes)

**Script:**
> "The Spiral Search is NorthStar's signature feature. It performs a 7-layer deep search across documents, lessons learned, cases, cross-competence references, experts, training materials, and open actions. Let me demonstrate."

**Actions:**
1. Click "Search" in the sidebar (or navigate to `/search`)
2. Enter query: "generator shutdown"
3. Click "Search" or press Enter
4. Walk through the results:
   - AI Answer section at the top
   - Source documents listed
   - Each of the 7 layers expanding

**Talking Points:**
- Explain the 7-layer concept (Documents → Lessons Learned → Cases → Cross-Competence → Experts → Training → Open Actions)
- Note that the AI answer is currently a hardcoded response matching the query keywords
- Explain that Phase 2 will replace this with a real LLM + RAG pipeline
- Point out the cross-competence results showing which other domains reference this topic
- Mention the "Experts" layer identifying who to contact

---

## Act 7: Submit Knowledge (2 minutes)

**Script:**
> "The platform supports structured knowledge submission. Users can submit new procedures, manuals, case studies, or lessons learned through a guided form. Let me walk through the submission flow."

**Actions:**
1. Click "Submit Knowledge" in the sidebar
2. Fill in the form fields:
   - Title: "New Safety Protocol"
   - Description: "Updated safety protocol for high-voltage operations"
   - Knowledge Type: Select "Procedure"
   - Competence: Select "Electrical Systems"
   - Confidentiality: Select "L1 - Internal"
   - Tags: "safety, electrical, protocol"
   - Source Reference: "Ticket #456"
   - Related Documents: "1, 2, 3"
   - Review Due: Select a future date
3. Click "Submit Knowledge"

**Talking Points:**
- Explain the auto-assignment logic (owner, reviewer, approver are auto-assigned based on role)
- Note that the asset will enter the approval workflow
- Mention that in production, this would trigger notifications to the assigned reviewers

---

## Act 8: Approvals (2 minutes)

**Script:**
> "The approval workflow ensures knowledge quality. Submitted assets flow through Champion Review and Leader Approval stages before being published. Let me show you the approval queue."

**Actions:**
1. Click "Approvals" in the sidebar
2. Show the list of pending approval workflows
3. Click on one workflow to expand it
4. Point out the Approve/Reject buttons (note: UI-only in this prototype)

**Talking Points:**
- Explain the workflow stages: Draft → Submitted → Champion Review → Leader Approval → Published
- Note that the Approve/Reject buttons are UI-only in this prototype
- Mention that Phase 3 will implement the full workflow engine with state transitions
- Explain how this ensures knowledge quality and regulatory compliance

---

## Act 9: User Profile & Logout (1 minute)

**Script:**
> "Finally, let me show the user profile. Users can view their profile information and log out. The session is managed through the browser."

**Actions:**
1. Click the user avatar/name in the top-right corner
2. Show the user profile dropdown
3. Click "Logout"
4. Return to the login screen

**Talking Points:**
- Note that sessions persist in localStorage (no expiry in prototype)
- Mention that Phase 2 will implement JWT with session expiry

---

## Closing (1 minute)

**Script:**
> "That concludes the demo. To summarize what you've seen: a fully functional frontend with role-based access, knowledge organized by competences, a 7-layer spiral search, structured submission workflows, and an approval pipeline. The platform is built on FastAPI and React, containerized with Docker, and deployed on Google Cloud.
>
> The next phases will add real authentication, LLM-powered AI search, full approval workflow enforcement, audit logging, and enterprise features like SSO and multi-tenancy.
>
> I'm happy to take any questions."

---

## Demo Data Reference

| Item | Value |
|------|-------|
| Demo User | Alice Chen (Admin) |
| Sample Search Query | "generator shutdown" |
| Sample Competence | Electrical Systems |
| Sample Asset | Generator Shutdown Procedure (ID: 1) |
| Sample Approval | SCADA Alarm Management Framework (Champion Review) |

---

## Fallback Plan

If the application fails to load during the demo:

1. **Backend not running:** Start with `uvicorn main:app --reload --port 8000`
2. **Frontend not running:** Start with `npm run dev` in the frontend directory
3. **Database empty:** Stop and restart the server — `seed_data()` runs on startup
4. **Port conflict:** Change port with `--port 8001` and update `VITE_API_URL`
5. **Network issue:** Use the screenshots in this documentation folder as reference
