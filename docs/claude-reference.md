# Dwello - Reference Material

Reference content for Claude Code sessions. Loaded on demand, not every turn.

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
├── CLAUDE.md
├── requirements-prosa.md     # Original requirements (German)
└── README.md
```

## BFF Architecture Detail

**Request Flow:**
```
Frontend -> apiCall() -> BFF (SvelteKit) -> Backend (ElysiaJS) -> DB
                          |                    |
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
2. **Apartment Management** - Floor, size (m2), room count, occupancy tracking, historical records
3. **Tenant Management** - Info storage, current/historical apartment tracking, contact info
4. **Contract Management** - Base rent + additional rent (garage, parking), Akonto, PDF upload, multi-contract history
5. **Invoice Management** - LLM-powered categorization (Mistral 7B), manual override with logging, Swiss cost validation, distribution key assignment
6. **Distribution Keys** - Predefined (Heating Costs, Per Unit, Per Area) + custom formulas ({area}, {rooms}, {volume}, {units})
7. **Heating Distribution** - Profiles: Standard, Mittelland, Mountain, Tessin + custom monthly %, for mid-year prorating
8. **Utility Statements** - Prorating by days/heating profile, vacancy tracking, management fee (max 3%), status workflow
9. **PDF & QR Bills** - Swiss QR-bill (ISO 20022), multi-language templates, async generation
10. **Accounting Period** - July-June, Nov-Oct, Calendar year options, management cost percentage
11. **Payment Tracking** - Status workflow (Open -> Paid), configurable reminder deadlines, payment history

---

## Core Business Logic

### Prorating Calculations

**Scenario 1: Multiple contracts in same period**
- Tenant A: Jan 1 - Mar 15 (74 days), Tenant B: Mar 16 - Dec 31 (291 days)
- Total costs CHF 12,000 -> Tenant A: 12,000 x (74/365) = CHF 2,438

**Scenario 2: Heating with mid-year move**
- Tenant moved Oct 1 - Dec 31, Mittelland profile: Oct 8%, Nov 10%, Dec 12%
- Total heating CHF 10,000 -> Tenant share: 10,000 x 0.30 = CHF 3,000

### Swiss Utility Cost Rules
- Allowed: Heating, hot water, water, wastewater, electricity, property maintenance (garden, snow), building infrastructure (elevator, caretaker), waste, management fee (max 3%)
- Not Allowed: Repairs & maintenance (unless service contract), taxes, insurance, connection fees, financing costs

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

- Allowed/disallowed utility cost validation per Swiss law
- Management fee capped at 3%
- QR-bill generation (Swiss QR standard, ISO 20022)
- Multi-language support for tenant communications
- Data retention: 10 years for financial records
- GDPR compliance

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

## E2E Testing with Gherkin (BDD)

Uses [playwright-bdd](https://github.com/vitalets/playwright-bdd) for E2E tests with Gherkin syntax.

**Structure:**
```
tests/e2e/
├── features/           # Gherkin .feature files
├── steps/              # Step definitions
└── fixtures/           # Custom test fixtures
```

**Commands:**
```bash
npm run bddgen          # Generate Playwright tests from features
npm run test:e2e        # Generate + run E2E tests
npm run test:e2e:ui     # Generate + run with Playwright UI
```

The E2E run starts its own stack (backend on 3101, frontend on 3100) against its own database `dwello_e2e`,
recreated from `backend/migrations` before every run (`cd backend && bun run e2e-db`). The development
servers and database are never touched; only PostgreSQL on 5432 is required. Override the database with
`E2E_DATABASE_URL`.

**Critical E2E Flows:**
1. Building creation with OpenPLZ address search
2. Tenant move with contract change
3. Invoice addition with LLM categorization
4. Statement generation with prorating
5. Payment marking and reminders
