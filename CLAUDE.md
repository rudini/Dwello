# Dwello - Claude Code Context

**Project Name:** Dwello
**Description:** Swiss Property Management System
**Status:** Implementation In Progress - Phase 5 Complete, OAuth Configured

---

## Project Overview

Dwello is a comprehensive web application for managing residential properties in Switzerland, specifically designed for property managers (Liegenschaftsverwalter). The system handles building management, tenant relationships, rental contracts, invoice management, and most importantly, complex utility cost statement generation (Nebenkostenabrechnungen) with Swiss legal compliance.

### Target Users
- Property managers managing 1-5 buildings with <50 apartments
- Single user initially (no multi-user support in MVP)

### Key Domains
- Building & Apartment Management
- Tenant & Contract Management
- Invoice Management with LLM-powered categorization
- Utility Cost Statement Generation with complex prorating
- Swiss QR-bill Generation
- Multi-language Support (German, French, Italian, Romansh, English)

---

## Technology Stack

- **Frontend:** SvelteKit + TypeScript + TailwindCSS
- **Backend:** ElysiaJS on Bun + PostgreSQL + Drizzle ORM
- **Authentication:** BFF Pattern with OAuth 2.0 / SSO (Google, Microsoft, Swiss eID future)
  - SvelteKit server routes handle OAuth flow and session management
  - HTTPOnly cookies for secure JWT storage (no client-side exposure)
  - Double-submit cookie pattern for XSRF protection
  - No bearer tokens in client code
- **LLM:** Ollama (self-hosted Mistral/Llama for invoice categorization)
- **Deployment:** Docker Compose
- **Maps:** OpenStreetMap + Leaflet
- **Internationalization:** svelte-i18n

---

## Documentation

All documentation in `./docs/`:
- **`docs/PRD-Dwello.md`** - Complete requirements, 11 features, UI/UX, phases, risks
- **`docs/data-model.md`** - PostgreSQL schema (12 tables), relationships, indexes, migrations
- **`docs/api-specification.md`** - REST API spec, endpoints, auth, errors
- **`docs/tech-stack.md`** - Architecture, justifications, performance targets
- **`implementation_plan.md`** - Living progress tracker ⭐ **UPDATE AFTER EACH TASK**
- **`requirements-prosa.md`** - Original German requirements

---

## Project Structure (BFF Architecture)

```
dwello/
├── src/
│   ├── routes/              # SvelteKit routes (BFF Layer)
│   │   ├── +page.svelte     # Dashboard
│   │   ├── +layout.svelte   # Auto token refresh
│   │   ├── auth/            # Authentication server routes
│   │   │   ├── login/+server.ts        # OAuth initiation
│   │   │   ├── callback/+server.ts     # OAuth callback, cookie setting
│   │   │   ├── refresh/+server.ts      # Token refresh
│   │   │   ├── logout/+server.ts       # Logout, clear cookies
│   │   │   └── me/+server.ts           # Current user info
│   │   ├── api/              # API proxy routes (forward to ElysiaJS)
│   │   │   ├── buildings/+server.ts
│   │   │   ├── buildings/[id]/+server.ts
│   │   │   ├── apartments/+server.ts
│   │   │   ├── apartments/[id]/+server.ts
│   │   │   ├── tenants/+server.ts
│   │   │   ├── tenants/[id]/+server.ts
│   │   │   ├── contracts/+server.ts
│   │   │   ├── contracts/[id]/+server.ts
│   │   │   ├── invoices/+server.ts
│   │   │   ├── invoices/[id]/+server.ts
│   │   │   ├── categories/+server.ts
│   │   │   ├── categories/[id]/+server.ts
│   │   │   ├── distribution-keys/+server.ts
│   │   │   ├── distribution-keys/[id]/+server.ts
│   │   │   ├── statements/+server.ts
│   │   │   ├── statements/[id]/+server.ts
│   │   │   ├── statements/[id]/pdf/+server.ts
│   │   │   ├── config/+server.ts
│   │   │   └── dashboard/+server.ts
│   │   ├── login/+page.svelte
│   │   ├── buildings/+page.svelte
│   │   ├── [remaining pages]/
│   ├── lib/
│   │   ├── server/           # Server-only utilities
│   │   │   ├── auth.ts       # JWT generation, verification, cookies, XSRF
│   │   │   └── oauth.ts      # OAuth provider integration
│   │   ├── components/       # Svelte components
│   │   ├── stores.ts         # State management
│   │   ├── api.ts            # Client-side API helper (uses BFF layer)
│   │   ├── schemas.ts        # Zod validation schemas (shared)
│   │   ├── utils/            # Utility functions
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.config.js
├── backend/                  # ElysiaJS backend (separate deployment)
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── middleware/
│   │   │   ├── auth.ts       # JWT validation middleware
│   │   │   └── cors.ts       # CORS configuration
│   │   ├── routes/
│   │   │   ├── buildings.ts  # Building CRUD
│   │   │   ├── apartments.ts
│   │   │   ├── tenants.ts
│   │   │   ├── contracts.ts
│   │   │   ├── invoices.ts
│   │   │   ├── categories.ts
│   │   │   ├── distribution-keys.ts
│   │   │   ├── statements.ts
│   │   │   ├── config.ts
│   │   │   └── dashboard.ts
│   │   ├── db.ts             # Database connection
│   │   └── schema.ts         # Drizzle schema
│   ├── Dockerfile
│   └── package.json
├── migrations/               # Database migrations
├── docs/                     # Documentation
├── docker-compose.yml
├── Dockerfile
├── svelte.config.js
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.example
├── CLAUDE.md                 # This file
├── requirements-prosa.md     # Original requirements (German)
└── README.md
```

### BFF Architecture

**Request Flow:**
```
Frontend → apiCall() → BFF (SvelteKit) → Backend (ElysiaJS) → DB
                         ↓                    ↓
                   HTTPOnly cookies      JWT validation
                   XSRF validation       Business logic
```

**Layer Responsibilities:**
| Layer | Handles | Never |
|-------|---------|-------|
| **BFF** (`src/routes/auth/`, `src/routes/api/`) | OAuth flow, JWT in HTTPOnly cookies, XSRF tokens, proxies to backend | Returns tokens to client |
| **Backend** (`backend/src/routes/`) | JWT validation from Authorization header, business logic | OAuth, cookies |
| **Client** | `apiCall()` from `src/lib/api.ts`, UI | Token management, localStorage |

**Example Flow:**
```typescript
// Client
const buildings = await apiCall('/buildings');

// BFF: /api/buildings/+server.ts
const jwt = cookies.get('session');
fetch('http://localhost:3001/api/v1/buildings', {
  headers: { Authorization: `Bearer ${jwt}` }
});

// Backend: validates JWT, returns data
```

---

## Key Features (MVP)

All 11 features detailed in `docs/PRD-Dwello.md`:

1. **Building Management** - CRUD, OpenPLZ API for address, map visualization with Leaflet, GPS storage
2. **Apartment Management** - Floor, size (m²), room count, occupancy tracking, historical records
3. **Tenant Management** - Info storage, current/historical apartment tracking, contact info
4. **Contract Management** - Base rent + additional rent (garage, parking), Akonto, PDF upload, multi-contract history
5. **Invoice Management** - LLM-powered categorization (Mistral 7B), manual override with logging, Swiss cost validation, distribution key assignment
6. **Distribution Keys** - Predefined (Heating Costs, Per Unit, Per Area) + custom formulas ({area}, {rooms}, {volume}, {units})
7. **Heating Distribution** - Profiles: Standard, Mittelland, Mountain, Tessin + custom monthly %, for mid-year prorating
8. **Utility Statements** - Prorating by days/heating profile, vacancy tracking, management fee (max 3%), status workflow
9. **PDF & QR Bills** - Swiss QR-bill (ISO 20022), multi-language templates, async generation
10. **Accounting Period** - July-June, Nov-Oct, Calendar year options, management cost percentage
11. **Payment Tracking** - Status workflow (Open → Paid), configurable reminder deadlines, payment history

---

## Core Business Logic

### Prorating Calculations

**Scenario 1: Multiple contracts in same period**
- Tenant A: Jan 1 - Mar 15 (74 days), Tenant B: Mar 16 - Dec 31 (291 days)
- Total costs CHF 12,000 → Tenant A: 12,000 × (74/365) = CHF 2,438

**Scenario 2: Heating with mid-year move**
- Tenant moved Oct 1 - Dec 31, Mittelland profile: Oct 8%, Nov 10%, Dec 12%
- Total heating CHF 10,000 → Tenant share: 10,000 × 0.30 = CHF 3,000

### Swiss Utility Cost Rules
- ✅ **Allowed:** Heating, hot water, water, wastewater, electricity, property maintenance (garden, snow), building infrastructure (elevator, caretaker), waste, management fee (max 3%)
- ❌ **Not Allowed:** Repairs & maintenance (unless service contract), taxes, insurance, connection fees, financing costs

---

## Development

```bash
npm run dev          # Start dev server
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript check
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run build        # Production build
```

**Standards:** TypeScript strict, ESLint + Prettier, Zod schemas, Drizzle ORM

---

## Key Decisions & Trade-offs

### Why SvelteKit + ElysiaJS + Bun?
- **Svelte:** Smallest bundle size, best DX, no VDOM overhead
- **Elysia:** Fast TypeScript framework, perfect for Bun
- **Bun:** 2-3x faster than Node.js, native TypeScript
- **Trade-off:** Smaller ecosystems, but all dependencies available

### Why Local LLM (Ollama)?
- **Privacy:** All data stays on-premises
- **Cost:** No API fees
- **Trade-off:** Limited to smaller models (Mistral 7B)

### Why BFF Pattern?
- **Security:** JWT in HTTPOnly cookies (XSS protected)
- **Simplicity:** No client-side token management
- **Trade-off:** Slightly more server-side complexity

---

## Swiss Legal Compliance

- ✅ Allowed/disallowed utility cost validation per Swiss law
- ✅ Management fee capped at 3%
- ✅ QR-bill generation (Swiss QR standard, ISO 20022)
- ✅ Multi-language support for tenant communications
- ✅ Data retention: 10 years for financial records
- ✅ GDPR compliance

**References:** Swiss Property Lease Act (Mietgesetz), SVIT Guidelines, Swiss QR-bill Standard

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page load time | <2s (p95) |
| API response | <500ms (p95) |
| PDF generation | <5s per statement |
| Statement generation (50 apts) | <60s |
| LLM categorization | <2s (with caching) |

---

## Implementation Phases

7 internal phases (see `implementation_plan.md` for detailed tracking):

1. **Foundation (Weeks 1-2)** - SvelteKit + ElysiaJS + PostgreSQL, OAuth, i18n
2. **Core Management (Weeks 3-4)** - Building/Apartment/Tenant CRUD, OpenPLZ, maps, contracts
3. **Financial Management (Weeks 5-6)** - Invoice CRUD, LLM categorization, distribution keys
4. **Statement Generation (Weeks 7-8)** - Config screens, prorating engine, heating profiles
5. **PDF & QR (Weeks 9-10)** - PDF generation (PDFKit), Swiss QR-bills, multi-language
6. **Status & Reminders (Week 11)** - Payment tracking, reminder generation
7. **Polish & Testing (Week 12)** - Performance, comprehensive testing, backup

---

## Conventional Commits

**Format:** `<type>(<scope>): <subject>`

**Types:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `chore` (build/deps/config)

**Scopes:**
- Frontend: `auth`, `buildings`, `apartments`, `tenants`, `contracts`, `invoices`, `statements`, `config`, `components`, `stores`, `styles`
- Backend: `api`, `db`, `middleware`, `services`, `schema`
- Cross: `docker`, `types`, `i18n`, `tests`, `ci`, `build`

**Examples:**
```bash
git commit -m "feat(auth): implement JWT token refresh endpoint"
git commit -m "fix(statements): correct prorating calculation for mid-year moves"
git commit -m "docs(api): add invoice categorization examples"
git commit -m "chore(deps): update Drizzle ORM to v0.28"
```

**Commit message guidelines:** 50 chars max subject, imperative mood, no period at end.

---

# ⚡ WORKFLOW RULES

## Critical: Update implementation_plan.md After Every Task

**After completing ANY task:**

1. ✅ Complete and verify the task works
2. 📝 Update `implementation_plan.md`:
   - Change `- [ ]` to `- [x]` for task AND all sub-items
   - Add note with what was done, files created/modified
3. 🔄 Update Progress Summary table

**Format:**
```markdown
- [x] Task Name
  **Note:** Brief description. Files: path/to/file.ts (lines)
  **Status:** ✅ Verified - tests pass
```

**Status indicators:** ✅ Complete, 🔄 In Progress, ⏳ Pending, ⚠️ Blocked

### Why This Matters
- **Continuity:** Maintains context across sessions
- **Progress Tracking:** Real-time visibility into status
- **Handoff:** Clear state for team members

## Verification Before Marking Complete

Do NOT mark complete unless:
- ✅ All unit tests pass (`npm run test`)
- ✅ All E2E tests pass (`npm run test:e2e`)
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ No ESLint warnings (`npm run lint`)

## Session Workflow

**Start:** Read `implementation_plan.md` → Find next `- [ ]` item → Review requirements → Reference docs (PRD, tech-stack, api-specification)

**During:** Follow checklist, write testable code, run tests frequently, commit regularly

**End:** Mark completed tasks, update Progress Summary, commit all changes including plan

---

## Testing Strategy

| Type | Framework | Focus | Target |
|------|-----------|-------|--------|
| Unit | Vitest | Business logic (prorating, calculations) | >80% coverage |
| Integration | Vitest + supertest | API endpoints, database | - |
| E2E | Playwright | User workflows | Critical flows |

**Critical E2E Flows:**
1. Building creation with OpenPLZ address search
2. Tenant move with contract change
3. Invoice addition with LLM categorization
4. Statement generation with prorating
5. Payment marking and reminders

---

## Deployment

```bash
docker-compose -f docker-compose.dev.yml up   # Development
docker-compose -f docker-compose.prod.yml up  # Production
```

**Services:** app (3000), postgres (5432), ollama (11434), nginx (80/443)

**Key Env Vars:** `DATABASE_URL`, `OAUTH_CLIENT_ID/SECRET`, `JWT_SECRET`, `OLLAMA_API_URL`, `IBAN`

---

## Troubleshooting

**Ollama not connecting:**
```bash
docker-compose logs ollama
docker exec dwello-ollama ollama pull mistral
```

**Database migration failed:**
```bash
docker-compose logs postgres
docker-compose exec postgres psql -U dwello -d dwello -f /migrations/001_initial_schema.sql
```

**OAuth callback failing:**
- Verify redirect URL matches OAuth provider config
- Check `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`
- Ensure `JWT_SECRET` is set and >32 characters

---

# 📚 Learnings

Records discoveries and architectural constraints learned during implementation.

**Format for new entries:**
```markdown
### Discovery Name
**Date:** YYYY-MM-DD | **Task:** [task] | **Severity:** Low/Medium/High
- **What:** Concise description
- **Reference:** file:line
- **Solution:** How to fix/workaround
```

## Entries

### Svelte 5 Runes: $derived for Computed Values
**Date:** 2026-01-24 | **Task:** Apartment Details UI | **Severity:** Low
- **What:** Computed values must use `$derived` rune for reactivity. Simple assignments don't update reactively.
- **Reference:** `src/lib/components/StatusBadge.svelte:24`
- **Solution:** `const classes = $derived(\`${base} ${variant[type]}\`);`

### Material Symbols Font Loading
**Date:** 2026-01-24 | **Task:** Apartment Details UI | **Severity:** Low
- **What:** Material Symbols require Google Fonts @import and font-variation-settings in CSS.
- **Reference:** `src/styles/globals.css:1-2`
- **Solution:** Add @import URL and font-variation-settings in globals.css

### API Response Wrapper Mismatch
**Date:** 2026-01-24 | **Task:** OAuth Login | **Severity:** Medium
- **What:** `/auth/me` returns `{ user: {...} }` - must destructure correctly or store gets wrapper object.
- **Reference:** `src/routes/+layout.svelte:29-30`
- **Solution:** `user.set(data.user)` not `user.set(data)`

### Docker Compose Credentials Must Match
**Date:** 2026-01-24 | **Task:** Database Setup | **Severity:** Medium
- **What:** Default DATABASE_URL password in code must match docker-compose.yml or auth fails.
- **Reference:** `backend/src/db/connection.ts:11`, `docker-compose.yml:8`
- **Solution:** Use consistent defaults (dwello:dwello)

### Port Conflicts with Dev Servers
**Date:** 2026-01-24 | **Task:** Dev Environment | **Severity:** Low
- **What:** Stale processes cause Vite to auto-increment ports, breaking BFF proxy expectations.
- **Reference:** `.env.local:28`
- **Solution:** Kill stale processes: `killall node bun 2>/dev/null`

### Defensive User Property Access
**Date:** 2026-01-24 | **Task:** OAuth Login | **Severity:** Low
- **What:** OAuth providers may not return all expected fields (name, email).
- **Reference:** `src/lib/components/Header.svelte:52`
- **Solution:** Use fallback chains: `$user.name || $user.email || '?'`

---

**Last Updated:** January 24, 2026
