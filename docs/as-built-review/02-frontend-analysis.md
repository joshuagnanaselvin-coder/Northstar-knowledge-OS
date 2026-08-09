# Frontend Analysis

**Framework:** React 18.2 + TypeScript 5.2 + Vite 5.1 + Tailwind CSS 3.4
**Location:** `frontend/src/`

---

## Architecture Overview

```
frontend/src/
├── api.ts                    # API URL helper (env-based)
├── types/index.ts            # TypeScript interfaces + color constants
├── hooks/useAuth.tsx         # Auth context with localStorage persistence
├── components/
│   └── Layout.tsx            # Shell: sidebar + top bar + mobile overlay
├── pages/
│   ├── Login.tsx             # Role selection login
│   ├── Dashboard.tsx         # KPI cards + recent + quick actions
│   ├── Competences.tsx       # Competence grid
│   ├── CompetenceDetail.tsx  # 7-tab detail view
│   ├── Library.tsx           # Asset grid + client-side filters
│   ├── AssetDetail.tsx       # Full asset view
│   ├── SpiralSearch.tsx      # 7-layer search
│   ├── SubmitKnowledge.tsx   # Submission form
│   └── Approvals.tsx         # Approval workflow list
└── App.tsx                   # Route definitions + AuthProvider wrapper
```

## Dependencies

### Runtime
- `react` 18.2.0
- `react-dom` 18.2.0
- `react-router-dom` 6.21.0
- `lucide-react` 0.344.0

### Dev
- `vite` 5.1.6
- `@vitejs/plugin-react` 4.2.1
- `typescript` 5.2.2
- `tailwindcss` 3.4.1
- `autoprefixer` 10.4.17
- `postcss` 8.4.33

Notable absences:
- No `axios` (uses native `fetch`)
- No `recharts` (planned for KPI charts)
- No state management library (React Context only)
- No form library (controlled inputs)
- No data fetching library (native fetch)

## Routing

```tsx
/ → Dashboard (all roles)
/login → Login (redirects if authenticated)
/competences → Competence grid (all roles)
/competences/:id → CompetenceDetail (all roles)
/library → Knowledge Library (all roles)
/assets/:id → AssetDetail (all roles)
/search → SpiralSearch (all roles)
/approvals → Approvals (Admin, Leader, Champion only)
/submit → SubmitKnowledge (Admin, Leader, Champion only)
```

## Auth Context (`useAuth.tsx`)

```tsx
interface AuthContextType {
  user: User | null;
  login: (name: string, role: string) => Promise<void>;
  logout: () => void;
  kpis: KPIs | null;
  setKpis: (k: KPIs | null) => void;
}
```

- User persisted in `localStorage` key `northstar_user`
- KPIs persisted in `localStorage` key `northstar_kpis`
- No token refresh, no expiry, no session validation
- Login calls `/api/auth/login` with name + role only

## Types (`types/index.ts`)

### Interfaces
- `User` — id, name, email, role, competence, avatar, department
- `Competence` — id, name, description, icon, leader, member_count, asset_count, color, assets, lessons_learned, experts, training
- `KnowledgeAsset` — id, title, description, asset_type, confidentiality, status, version, tags, owner, reviewer, approver, competence, review_date, created_at, updated_at, content, related_docs, workflows
- `ApprovalWorkflow` — id, asset, current_stage, submitted_user, submitted_at, reviewed_at, approved_at, comments
- `KPIs` — total_assets, pending_reviews, overdue_docs, active_competences, published_this_month, active_users, approval_queue, avg_review_time
- `SearchLayer` — layer, icon, count, items
- `SearchResponse` — query, ai_answer, sources, layers

### Constants
- `CONFIDENTIALITY_COLORS` — L0 (emerald), L1 (sky), L2 (amber), L3 (rose)
- `STATUS_COLORS` — Published, Champion Review, Leader Approval, Submitted, Draft, Review Due, Archived
- `TYPE_ICONS` — Emoji mappings for 11 asset types

## Styling

- **CSS Framework:** Tailwind CSS 3.4
- **Primary Color:** sky-500 (#0ea5e9)
- **Font:** Inter (Google Fonts, loaded via index.html)
- **Responsive breakpoints:** sm (640px), md (768px), lg (1024px)
- **Mobile:** Sidebar becomes off-canvas with overlay

## Vite Configuration

- Dev server proxies `/api` to `http://localhost:8000`
- Allows ngrok host patterns for tunneled development
- `VITE_API_URL` environment variable overrides API base

## Component Quality

### Strengths
- Consistent Tailwind utility patterns
- Loading states with skeleton/placeholder UI
- Error handling with fallback data
- Responsive design with mobile sidebar
- Proper TypeScript typing throughout
- Accessible markup (semantic HTML, labels)

### Weaknesses
- No error boundaries
- No Suspense for data fetching
- Some components are very long (CompetenceDetail: 293 lines)
- No memoization for expensive renders
- `any` type used in several places (training data, approval items)
- No form library — manual state management for SubmitKnowledge form

## Non-Functional UI Elements

These buttons/actions exist in the UI but have no backend implementation:

| Location | Element | Status |
|----------|---------|--------|
| AssetDetail | Share button | Non-functional |
| AssetDetail | Download PDF button | Non-functional |
| AssetDetail | Request Edit Access button | Non-functional |
| Approvals | Approve button | Non-functional |
| Approvals | Request Changes button | Non-functional |

## State Management

- React Context (AuthContext) for user state
- useState for all component-level state
- No global state management (Redux, Zustand, etc.)
- localStorage for persistence across sessions
- No caching layer for API responses
