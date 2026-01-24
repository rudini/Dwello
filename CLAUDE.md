# Dwello - Claude Code Context

**Project Name:** Dwello
**Description:** Swiss Property Management System
**Status:** In Planning/Documentation Phase

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

## Documentation Structure

All documentation is in `./docs/`:

1. **`docs/PRD-Dwello.md`** (9,468 words)
   - Complete product requirements document
   - All 11 core features with detailed specs
   - UI/UX design for all screens
   - Non-functional requirements
   - Implementation phases (7 phases, 12 weeks)
   - Risk assessment

2. **`docs/data-model.md`** (2,531 words)
   - PostgreSQL schema for all 12 tables
   - Relationships and constraints
   - Indexes and query optimization
   - Migration strategy
   - Backup & recovery procedures

3. **`docs/api-specification.md`** (2,494 words)
   - Complete REST API specification
   - All 11 endpoint groups with examples
   - Error handling
   - Authentication & authorization
   - Rate limiting & pagination

4. **`docs/tech-stack.md`** (2,858 words)
   - Architecture diagrams
   - Technology justifications
   - Development workflow
   - Performance targets
   - Security best practices
   - Scaling strategy

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
│   ├── 001_initial_schema.sql
│   ├── 002_indexes.sql
│   ├── 003_views.sql
│   └── 004_initial_data.sql
├── docs/                     # Documentation (detailed above)
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
└── README.md                 # (To be created)
```

### Architecture Notes

**BFF Layer (SvelteKit):**
- Handles OAuth 2.0 login flow (no client-side OAuth code)
- Manages HTTPOnly cookies for session storage
- Validates XSRF tokens (double-submit pattern)
- Proxies all API calls to ElysiaJS backend
- All authentication logic centralized here

**Backend (ElysiaJS):**
- Validates JWT from BFF layer (Authorization header)
- Processes business logic
- No OAuth endpoints (moved to BFF)
- No cookie management (handled by BFF)
- Unchanged API endpoints

**Client (SvelteKit Pages):**
- Uses `apiCall()` helper for API requests
- No token management code
- No localStorage/sessionStorage usage
- Cookies handled automatically by browser

---

## Key Features (MVP - All Implemented)

### 1. Building Management
- CRUD operations for buildings
- OpenPLZ API integration for address search
- Map visualization with Leaflet/OpenStreetMap
- GPS coordinates storage and validation

### 2. Apartment Management
- Multiple apartments per building
- Floor, size (m²), room count tracking
- Occupancy status tracking
- Historical occupancy records

### 3. Tenant Management
- Tenant information storage
- Current and historical apartment tracking
- Contact information for statements

### 4. Rental Contract Management
- Contract CRUD with date validation
- Base rent + additional rent (garage, parking, storage)
- Monthly advance payments (Akonto)
- Contract modifications tracking
- PDF upload for original contracts
- Multi-contract history per apartment

### 5. Invoice Management
- Invoice entry with categorization
- **LLM-powered auto-categorization** (Mistral 7B via Ollama)
- Manual category override with logging
- Swiss utility cost validation (allowed vs. not allowed)
- Distribution key assignment
- Bulk import support (future)

### 6. Distribution Keys
- **Predefined:** Heating Costs, Per Unit, Per Area
- **Custom:** Formula-based with variables: {area}, {rooms}, {volume}, {units}
- Formula testing and validation

### 7. Heating Distribution Configuration
- **Predefined profiles:**
  - Heating + Hot Water (standard)
  - Heating only - Mittelland (plateau)
  - Heating only - Mountain Region
  - Heating only - Tessin (south)
- **Custom profiles:** Manual monthly percentage entry
- Used for prorating when tenants move mid-year

### 8. Utility Cost Statements
- Complex calculation engine with prorating
- **Multiple contracts in one period:** Prorate by days occupied
- **Mid-year moves:** Use monthly heating distribution
- **Vacancy periods:** Separate vacancy cost tracking
- **Management fee:** Configurable % (max 3% per Swiss law)
- Statement status: Open → Paid
- Payment reminders with configurable deadlines

### 9. PDF Generation & QR Bills
- Professional PDF statements
- **Swiss QR-bill generation** (ISO 20022 compliant)
- Multi-language PDF templates
- Async PDF generation for performance
- PDF storage in database blob storage

### 10. Accounting Period Configuration
- **Options:** July-June, November-October, Calendar year
- Global settings with per-building overrides (future)
- Management cost percentage (0-3%)
- Payment deadlines

### 11. Payment Tracking & Reminders
- Mark statements as paid/unpaid
- Automatic reminder generation for overdue statements
- Configurable reminder deadlines
- Payment history tracking

---

## Core Business Logic

### Prorating Calculations
The system handles complex utility cost distributions:

**Scenario 1: Multiple contracts in same period**
- Tenant A occupies: Jan 1 - Mar 15 (74 days)
- Tenant B occupies: Mar 16 - Dec 31 (291 days)
- Total utility costs: CHF 12,000
- Tenant A pays: 12,000 × (74/365) = CHF 2,438
- Tenant B pays: 12,000 × (291/365) = CHF 9,562

**Scenario 2: Heating with mid-year move**
- Tenant moved Oct 1 - Dec 31
- Using Mittelland profile: Oct 8%, Nov 10%, Dec 12%
- Total heating costs: CHF 10,000
- Tenant share: 10,000 × (0.08 + 0.10 + 0.12) = CHF 3,000

### Swiss Utility Cost Rules (Allowed/Not Allowed)
**Allowed:**
- Heating, hot water, water, wastewater, electricity
- Property maintenance (garden, snow removal)
- Building infrastructure (elevator, caretaker wages)
- Waste disposal
- Management fee (max 3%)

**NOT Allowed:**
- Repairs & maintenance (unless service contract)
- Taxes & insurance
- Connection fees
- Financing costs

---

## Development Workflow

### Local Setup
```bash
# Clone and setup
git clone <repo>
cd dwello
npm install

# Start development environment
docker-compose -f docker-compose.dev.yml up

# In another terminal
npm run dev
```

### Development Commands
```bash
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript check
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run build        # Build for production
```

### Coding Standards
- **Language:** TypeScript (strict mode)
- **Code Style:** ESLint + Prettier (auto-format)
- **Type Safety:** Zod schemas for validation (shared client/server)
- **Database:** Drizzle ORM with full type safety
- **Testing:** Vitest for unit, Playwright for E2E

---

## Implementation Phases

The MVP is implemented as a single comprehensive project with 7 internal phases:

### Phase 1: Foundation (Weeks 1-2)
- SvelteKit + ElysiaJS + PostgreSQL setup
- Database schema with migrations
- OAuth authentication
- Base UI framework & i18n setup

### Phase 2: Core Management (Weeks 3-4)
- Building, Apartment, Tenant CRUD
- OpenPLZ API integration
- Map visualization
- Contract management

### Phase 3: Financial Management (Weeks 5-6)
- Invoice CRUD
- LLM integration for categorization
- Category & distribution key management
- Cost validation logic

### Phase 4: Statement Generation (Weeks 7-8)
- Configuration screens
- Prorating calculation engine
- Heating distribution profiles
- Statement list & detail views

### Phase 5: PDF & QR (Weeks 9-10)
- PDF generation (PDFKit)
- Swiss QR-bill generation
- Multi-language PDF templates

### Phase 6: Status & Reminders (Week 11)
- Payment status tracking
- Reminder generation
- Status workflow

### Phase 7: Polish & Testing (Week 12)
- Performance optimization
- Comprehensive testing
- Documentation
- Backup automation

---

## Key Decisions & Trade-offs

### Why SvelteKit + ElysiaJS + Bun?
- **Svelte:** Smallest bundle size, best DX, no VDOM overhead
- **Elysia:** Fast TypeScript framework, perfect for Bun
- **Bun:** 2-3x faster than Node.js, native TypeScript, modern JS
- **Trade-off:** Smaller ecosystems, but all dependencies available

### Why Local LLM (Ollama)?
- **Privacy:** All data stays on-premises
- **Cost:** No API fees
- **Offline:** Works without internet
- **Trade-off:** Limited to smaller models (Mistral 7B), less accuracy than Claude/GPT-4

### Why PostgreSQL?
- **Reliability:** ACID transactions for financial data
- **JSON:** JSONB type for flexible schemas
- **Mature:** 25+ years of production use
- **Trade-off:** Monolithic (no horizontal scaling initially)

### Why Docker Compose?
- **Simplicity:** One-command deployment
- **Portability:** Works anywhere Docker runs
- **Trade-off:** Limited orchestration (upgrade to Kubernetes later)

### Why BFF Pattern with HTTPOnly Cookies?
- **Security:** JWT stored in HTTPOnly cookies (prevents XSS token theft)
- **Simplicity:** Client code has no token management logic
- **Standards:** Double-submit cookie pattern for XSRF protection (industry standard)
- **OAuth:** All OAuth flow handled server-side (no client-side OAuth code)
- **Separation:** Clear boundary between frontend and backend responsibilities
- **Trade-off:** Slightly more complex server-side routing (but better security posture)

**Authentication Architecture:**
- OAuth 2.0 → SvelteKit BFF (server routes)
- JWT generation → SvelteKit BFF (server-side only)
- Session storage → HTTPOnly cookies (browser secure storage)
- XSRF tokens → Double-submit pattern (cookie + header)
- API proxying → SvelteKit server routes → ElysiaJS backend
- No bearer tokens in client code
- No localStorage/sessionStorage usage

**Benefits Over Bearer Tokens:**
- ✅ JWT hidden from JavaScript (XSS protected)
- ✅ Automatic cookie handling by browser
- ✅ Built-in CSRF protection mechanism
- ✅ Centralized auth logic (easier to audit)
- ✅ No client-side token refresh complexity

---

## Swiss Legal Compliance

### Key Requirements Implemented
- ✅ Allowed/disallowed utility cost validation per Swiss law
- ✅ Management fee capped at 3% of total utility costs
- ✅ Annual statement generation requirement
- ✅ QR-bill generation (Swiss QR standard, ISO 20022)
- ✅ Multi-language support for tenant communications
- ✅ Data retention: 10 years for financial records
- ✅ GDPR compliance for EU tenant data

### References
- Swiss Property Lease Act (Mietgesetz)
- SVIT Property Management Guidelines
- Swiss QR-bill Standard (ISO 20022)
- Swiss Data Protection Act (SDPA)

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

## Future Enhancements (Post-MVP)

### Phase 2 Features
- Tenant portal (view statements, contracts)
- Owner portal (view financials)
- Email notifications
- CSV invoice import with OCR
- Advanced analytics & custom reports
- Mobile app
- Payment gateway integration
- Multi-user support with RBAC
- Third-party API integrations

---

## How to Work with Claude Code

### Effective Prompts
✅ **Good:**
- "Implement the Building CRUD endpoints based on the PRD section 5.1"
- "Create the prorating calculation function following the specification in data-model.md"
- "Set up the OAuth authentication flow using Google OAuth"

❌ **Vague:**
- "Add building management"
- "Make statements work"
- "Improve performance"

### Best Practices
1. **Reference the PRD:** "According to PRD section 5.5, invoices should..."
2. **Link to docs:** Point to specific sections in data-model.md or api-specification.md
3. **Define success:** "Verify with: `npm run test` and check that all endpoints return 200"
4. **Be specific:** Include exact feature names from the specifications

### File References
- **Requirements:** `./requirements-prosa.md` (original German requirements)
- **PRD:** `./docs/PRD-Dwello.md` (complete specification)
- **Database:** `./docs/data-model.md` (schema details)
- **API:** `./docs/api-specification.md` (endpoint specs)
- **Tech:** `./docs/tech-stack.md` (architecture & decisions)

### BFF Architecture Guidance

**When implementing features, remember:**

1. **Authentication/OAuth:**
   - Lives in: `src/routes/auth/**/+server.ts`
   - Uses: SvelteKit server routes
   - Returns: Cookies (session={jwt}, xsrf-token={token})
   - Never: Returns JSON tokens to client

2. **API Proxy Routes:**
   - Lives in: `src/routes/api/**/+server.ts`
   - Pattern: Extract JWT from cookie → Forward to ElysiaJS → Return response
   - XSRF validation: Check cookie[xsrf-token] === header[X-XSRF-TOKEN]
   - Example: `/api/buildings/+server.ts` proxies to `/api/v1/buildings` on ElysiaJS

3. **Client API Calls:**
   - Use: `apiCall()` helper from `src/lib/api.ts`
   - Never: Manage tokens directly
   - Automatic: XSRF token included for POST/PUT/DELETE
   - Example: `const buildings = await apiCall('/buildings')`

4. **Backend (ElysiaJS):**
   - Lives in: `backend/src/routes/*`
   - Validates: JWT from Authorization header (from BFF)
   - Unchanged: Business logic is same as direct API
   - Never: Handles OAuth or cookies

**Example Request Flow:**
```
1. Frontend: await apiCall('/buildings')
2. BFF: GET /api/buildings/+server.ts
3. BFF: Validate JWT from cookie
4. BFF: fetch('http://localhost:3001/api/v1/buildings',
        { headers: { Authorization: `Bearer ${jwt}` } })
5. Backend: Validate JWT, process request
6. BFF: Return response to frontend
```

---

## Conventional Commits Standard

This project enforces **Conventional Commits** for all commits to maintain a clean, predictable commit history.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Rules:**
- ✅ **Type is required:** One of `feat`, `fix`, `docs`, `chore`
- ✅ **Scope is required:** Must be one of the predefined scopes (see below)
- ✅ **Subject is required:** Concise description in imperative form
- ⏳ **Body is optional:** Detailed explanation if needed
- ⏳ **Footer is optional:** Use for `BREAKING CHANGE:` or related issues

### Commit Types

| Type | When to Use | Example |
|------|------------|---------|
| `feat` | New feature or functionality | `feat(auth): add OAuth 2.0 callback handler` |
| `fix` | Bug fix | `fix(statements): correct prorating calculation for mid-year moves` |
| `docs` | Documentation, README, comments | `docs(api): update endpoint specifications for invoices` |
| `chore` | Build, deps, tooling, config | `chore(deps): upgrade TypeScript to 5.0` |

### Scopes

Required scope must indicate the area of the codebase being changed:

**Frontend (Client):**
- `auth` - Authentication/OAuth flows
- `buildings` - Building management UI
- `apartments` - Apartment management UI
- `tenants` - Tenant management UI
- `contracts` - Contract management UI
- `invoices` - Invoice management UI
- `statements` - Statement generation & display
- `config` - Configuration & settings UI
- `components` - Reusable Svelte components
- `stores` - State management (Svelte stores)
- `styles` - CSS, Tailwind, theming

**Backend (ElysiaJS API):**
- `api` - API endpoints (use specific route if needed)
- `db` - Database & Drizzle ORM
- `middleware` - Auth, CORS, logging middleware
- `services` - Business logic services
- `schema` - Database schema & migrations

**Cross-Cutting:**
- `docker` - Docker, docker-compose, containers
- `types` - TypeScript types, Zod schemas
- `i18n` - Internationalization
- `tests` - Test files & testing infrastructure
- `ci` - GitHub Actions, CI/CD
- `build` - Build configuration, vite, tsconfig

### Examples

**Valid commits:**
```bash
git commit -m "feat(auth): implement JWT token refresh endpoint"
git commit -m "fix(statements): correct calculation for vacancy periods"
git commit -m "docs(api): add invoice categorization examples"
git commit -m "chore(deps): update Drizzle ORM to v0.28"
git commit -m "feat(invoices): add LLM-powered categorization"
```

**Multi-line commit with body:**
```bash
git commit -m "feat(statements): implement prorating for mid-year moves

- Calculate daily rates for overlapping contracts
- Support heating distribution profile selection
- Validate management fee cap (3% per Swiss law)
- Add comprehensive unit tests for edge cases

Fixes #123"
```

**Breaking change:**
```bash
git commit -m "chore(schema): restructure invoice table

BREAKING CHANGE: Invoice.category field renamed to Invoice.categoryId (foreign key).
Update all invoice queries and API responses accordingly."
```

### Setup & Enforcement

Conventional commits are enforced via **git hooks** using `husky` and `commitlint`.

**Installation (already configured in package.json):**
```bash
npm install husky commitlint --save-dev
husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**Verification:**
- Before each commit, the hook validates the message format
- Non-compliant messages are rejected with helpful error messages
- Allows retry: fix your commit message and try again

**Configuration:**
- Rules defined in `.commitlintrc.js` (to be created in project root)
- Enforces: required types, required scopes, subject format, footer format
- Allows commit amending: `git commit --amend --no-edit`

### Commit Message Guidelines

**Subject (first line):**
- 50 characters or less
- Use imperative mood: "add feature" not "added feature"
- Don't capitalize first letter
- No period at the end

**Body (optional):**
- Separate from subject by a blank line
- Wrap at 72 characters
- Explain *what* and *why*, not *how* (code shows the how)
- Reference issues with `Fixes #123` or `Closes #456`

**Footer (optional):**
- Use `BREAKING CHANGE:` for API/schema changes
- Use `Refs #123` for related issues
- Use `Co-Authored-By:` when pair programming

### Tips

**Undo and retry:**
```bash
git reset --soft HEAD~1    # Undo last commit, keep changes staged
git commit -m "feat(scope): proper message"
```

**Amend last commit:**
```bash
git commit --amend --no-edit  # Keeps message, updates staged changes
```

**View commit history:**
```bash
git log --oneline    # See formatted history
git log -5 --oneline # Last 5 commits
```

---

# ⚡ WORKFLOW - STRICT RULES FOR IMPLEMENTATION

## Critical Rule: Update implementation_plan.md After Every Task

### ⚠️ MANDATORY PROCESS

**After completing and verifying ANY task, you MUST:**

1. ✅ **Complete the task fully** and verify it works
2. 📝 **Update `implementation_plan.md` immediately**
3. ✔️ **Mark EVERY checkbox as complete** - Change `- [ ]` to `- [x]` for:
   - The main task item
   - ALL sub-tasks and checklist items under that task
   - Update status indicators (✅, 🔄, ⏳, ⚠️)
4. 💬 **Add a brief note** explaining what was implemented/changed
5. 🔄 **Update the Progress Summary table** in implementation_plan.md

**⚠️ CRITICAL:** Do NOT leave unchecked boxes in completed tasks. Every sub-item should be marked `[x]` once the task is done.

### Format for Task Completion Notes

When updating implementation_plan.md, use this format for the note:

```markdown
- [x] Task Name
  **Note:** Brief description of what was done, key files created/modified, any issues encountered
```

**Example:**
```markdown
- [x] Create `src/lib/server/auth.ts`
  **Note:** Implemented generateJwt(), verifyJwt(), setSessionCookie(), validateXsrfToken(), and clearAuthCookies(). All functions tested. File: src/lib/server/auth.ts (185 lines)
```

### Why This Matters

- **Continuity:** Maintains context across multiple sessions
- **Accountability:** Clear record of what's been completed
- **Progress Tracking:** Real-time visibility into implementation status
- **Debugging:** Easy reference if issues arise later
- **Handoff:** Clear state for other team members

### Verification Steps: Unit Tests & E2E Tests

**EVERY phase MUST include verification testing before marking complete:**

1. **Unit Tests**
   - Write unit tests for all new functions/utilities
   - Target >80% code coverage for critical paths
   - Run: `npm run test`
   - All tests must PASS ✅
   - Tests should verify:
     - Normal operation (happy path)
     - Edge cases and boundary conditions
     - Error handling and validation
     - Return types and data structures

2. **E2E Tests**
   - Write E2E tests for all user workflows
   - Cover the key user journeys for the phase
   - Run: `npm run test:e2e`
   - All tests must PASS ✅
   - E2E tests should verify:
     - Complete feature workflows from start to finish
     - Integration between components
     - Navigation and page transitions
     - Data persistence and retrieval

3. **Manual Testing Checklist**
   - Test locally in dev server
   - Verify all UI elements render correctly
   - Test keyboard navigation and accessibility
   - Test on different screen sizes (responsive)
   - Check console for any errors or warnings
   - Verify no TypeScript errors: `npm run type-check`
   - Verify no linting issues: `npm run lint`

4. **Documentation of Tests**
   - Create test files in `tests/unit/` and `tests/e2e/`
   - Add test documentation in phase completion notes
   - Include test coverage statistics
   - Note any known limitations or skipped tests

**⚠️ CRITICAL:** Do NOT mark a phase as complete unless:
- ✅ All unit tests pass
- ✅ All E2E tests pass
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Manual testing checklist complete

### Progress Summary Update

After completing a phase or major section, update the table:

```markdown
| Phase | Status | Completion |
|-------|--------|------------|
| Phase 0: Initialization | ✅ Complete | 100% |
| Phase 1: Auth Routes | 🔄 In Progress | 45% |
| Phase 2: API Proxies | ⏳ Pending | 0% |
```

Use these status indicators:
- **✅ Complete** - All tasks done and verified
- **🔄 In Progress** - Currently working on this phase
- **⏳ Pending** - Not started
- **⚠️ Blocked** - Waiting for something

### Document Changes Made

When you complete a task, also note in the file:

```markdown
- [x] Task Name
  **Files Created:** src/lib/server/auth.ts
  **Files Modified:** src/lib/server/oauth.ts
  **Tests Added:** src/lib/server/auth.test.ts
  **Status:** ✅ Verified - All tests pass
  **Changes:** Implemented JWT generation, verification, cookie management functions
```

### Example Full Entry

```markdown
### 1.1 Server-Side Auth Utilities

- [x] Create `src/lib/server/auth.ts`
  **Files:** src/lib/server/auth.ts (185 lines)
  **Functions:** generateJwt, verifyJwt, setSessionCookie, setXsrfToken, getJwtFromCookie, validateXsrfToken, clearAuthCookies
  **Tests:** All 7 functions tested with 22 test cases
  **Status:** ✅ Complete and verified - npm run test passes

- [x] Create `src/lib/server/oauth.ts`
  **Files:** src/lib/server/oauth.ts (120 lines)
  **Functions:** generateOAuthUrl, exchangeCodeForToken, fetchUserProfile
  **Tests:** OAuth flow tested with mocked responses
  **Status:** ✅ Complete and verified

- [x] Unit tests for `src/lib/server/auth.ts`
  **Files:** src/lib/server/auth.test.ts (340 lines)
  **Test Count:** 22 test cases, 100% pass rate
  **Coverage:** 88% line coverage, 100% function coverage
  **Status:** ✅ All tests pass
```

---

## Recording Learnings After Implementation

### ⚠️ MANDATORY PROCESS FOR DISCOVERIES

**After completing and verifying any significant implementation or bug fix, you MUST:**

1. ✅ **Complete the task fully** and verify it works
2. 📚 **Record any learnings** in the `# Learnings` section below
3. 🔍 **Document:** Unexpected behaviors, specific commands that worked, or architectural constraints discovered
4. 📝 **Keep entries concise** but informative (2-4 sentences per entry)
5. 🔗 **Link to relevant code** using `file:line` format when applicable

### Format for Learnings Entries

When updating the Learnings section, use this format:

```markdown
### Discovery Name
**Date:** YYYY-MM-DD | **Task:** [task name] | **Severity:** Low/Medium/High
- **What:** Concise description of the learning
- **Why It Matters:** Impact on future work
- **Reference:** file:line or issue link
- **Workaround/Solution:** If it's a constraint or issue
```

**Example:**
```markdown
### Bun Runtime SvelteKit Compatibility Issue
**Date:** 2026-01-23 | **Task:** Setup SvelteKit + Elysia | **Severity:** Medium
- **What:** HTTPOnly cookies not set correctly with Bun's response object in certain scenarios
- **Why It Matters:** Authentication would fail silently in specific edge cases (e.g., after OAuth redirect)
- **Reference:** src/routes/auth/callback/+server.ts:42
- **Workaround:** Explicitly call `response.headers.append()` instead of relying on implicit cookie headers
```

### Why This Matters

- **Debugging:** Future developers can avoid the same pitfalls
- **Context:** Explains non-obvious code patterns or workarounds
- **Performance:** Records performance findings and optimization opportunities
- **Constraints:** Documents architectural limitations discovered during implementation
- **Knowledge Transfer:** Captures tribal knowledge before it's forgotten

---

## Session Workflow Checklist

### Beginning a Session

- [ ] Read `implementation_plan.md` to see current progress
- [ ] Check the Progress Summary table
- [ ] Find the next incomplete task (first `- [ ]` item)
- [ ] Review the task requirements
- [ ] Reference relevant documentation (PRD, tech-stack, api-specification)

### During Implementation

- [ ] Follow the task checklist item by item
- [ ] Write code in small, testable chunks
- [ ] Run tests frequently (`npm run test`)
- [ ] Commit code regularly with clear messages
- [ ] Document any issues or blockers

### After Task Completion

1. **Verify the task works:**
   - Tests pass
   - Manual testing if applicable
   - No TypeScript errors
   - Linting passes

2. **Update implementation_plan.md:**
   - Change `- [ ]` to `- [x]`
   - Add note with what was accomplished
   - List files created/modified
   - Update progress percentage if section is complete

3. **Update Progress Summary:**
   - Recalculate phase completion percentage
   - Update status indicator (⏳ → 🔄 → ✅)
   - Note any blockers

4. **Move to next task:**
   - Identify next incomplete item in plan
   - Read its requirements
   - Begin implementation

### End of Session

- [ ] Ensure last completed task is marked in implementation_plan.md
- [ ] Update Progress Summary with final status
- [ ] Commit all changes to git (including updated plan)
- [ ] Leave clear notes about what was completed
- [ ] Note any blockers or next steps

---

## File References for Workflow

- **Living Progress Report:** `./implementation_plan.md` ⭐ **UPDATE AFTER EACH TASK**
- **Project Context:** `./CLAUDE.md` (this file)
- **Architecture:** `./docs/tech-stack.md`
- **Requirements:** `./docs/PRD-Dwello.md`
- **API Spec:** `./docs/api-specification.md`
- **Database Schema:** `./docs/data-model.md`

---

## Common Issues & Solutions

### Issue: Implementation Plan Gets Out of Sync

**Solution:** At the start of each session, verify the plan matches the actual code. If discrepancies exist, update the plan to reflect reality.

### Issue: Task Takes Longer Than Expected

**Solution:** Update implementation_plan.md with blockers and split large tasks into smaller sub-tasks if needed.

### Issue: Dependencies Between Tasks

**Solution:** If Task B depends on Task A, clearly mark the dependency in the plan. Don't start Task B until Task A is complete and verified.

### Issue: Unclear Task Requirements

**Solution:** Reference the specific documentation section. Add clarity to the task description before starting work.

---

## Implementation Phases Overview

```
Phase 0: Project Initialization (Setup)
    ↓
Phase 1: SvelteKit Auth Routes (BFF Layer - Auth)
    ↓
Phase 2: API Proxy Routes (BFF Layer - Proxy)
    ↓
Phase 3: Client-Side API Helper & Pages (Frontend)
    ↓
Phase 4: ElysiaJS Backend Setup (Backend)
    ↓
Phase 5: Integration Testing (Testing)
    ↓
Phase 6: Environment & Configuration (Config)
    ↓
Phase 7: Docker & Deployment (Deployment)
    ↓
Phase 8: Documentation & Testing (Docs)
    ↓
Phase 9: Manual Testing Checklist (QA)
    ↓
Phase 10: Cleanup & Optimization (Polish)
    ↓
Phase 11: Known Issues & Limitations (Final)
```

Each phase should be completed sequentially. Update implementation_plan.md after each phase is complete.

---

## Testing Strategy

### Unit Tests
- **Coverage Target:** >80% for critical paths
- **Focus:** Business logic (prorating, calculations)
- **Framework:** Vitest

### Integration Tests
- **Focus:** API endpoints, database operations
- **Framework:** Vitest + supertest

### E2E Tests
- **Focus:** Key user workflows (create building → generate statement)
- **Framework:** Playwright
- **Critical flows:**
  1. Building creation with OpenPLZ address search
  2. Tenant move with contract change
  3. Invoice addition with LLM categorization
  4. Statement generation with prorating
  5. Payment marking and reminders

---

## Deployment

### Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

### Services
- **app:** SvelteKit + ElysiaJS (port 3000)
- **postgres:** PostgreSQL database (port 5432)
- **ollama:** LLM service (port 11434)
- **nginx:** Reverse proxy, TLS (port 80/443)

### Environment Variables
See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` - OAuth provider credentials
- `OLLAMA_API_URL` - Local LLM endpoint
- `JWT_SECRET` - Token signing key
- `IBAN` - Property manager's IBAN for QR-bills

---

## Troubleshooting

### Common Issues

**Ollama not connecting**
```bash
# Check if Ollama is running
docker-compose logs ollama

# Pull a model
docker exec dwello-ollama ollama pull mistral
```

**Database migration failed**
```bash
# Check logs
docker-compose logs postgres

# Manually run migration
docker-compose exec postgres psql -U dwello -d dwello -f /migrations/001_initial_schema.sql
```

**OAuth callback failing**
- Verify redirect URL in OAuth provider matches app configuration
- Check `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`
- Ensure `JWT_SECRET` is set and >32 characters

---

# 📚 Learnings

This section records discoveries, unexpected behaviors, and architectural constraints learned during implementation. Each entry helps future work and serves as a reference for non-obvious decisions in the codebase.

## Template for New Learnings

Use this template when adding new learnings:

```markdown
### [Discovery Name]
**Date:** YYYY-MM-DD | **Task:** [task name] | **Severity:** Low/Medium/High
- **What:** Concise description of what was discovered
- **Why It Matters:** Impact on current or future work
- **Reference:** file:line or GitHub issue link
- **Workaround/Solution:** How to work around or fix this issue
```

## Entries

### Svelte 5 Runes: $derived for Computed Values
**Date:** 2026-01-24 | **Task:** Apartment Details UI (Phase 10.2) | **Severity:** Low
- **What:** In Svelte 5, computed/derived values must use the `$derived` rune rather than just assigning to a variable. Simple assignments don't reactively update when inputs change.
- **Why It Matters:** ESLint warning: "This reference only captures the initial value of X. Did you mean to reference it inside a closure instead?" indicates missed reactive updates. Using `$derived` ensures proper reactivity.
- **Reference:** `src/lib/components/StatusBadge.svelte:24`, `src/lib/components/Button.svelte:26`
- **Workaround/Solution:** Replace variable assignments with `$derived`:
  ```javascript
  // ❌ Wrong - not reactive
  const classes = `${base} ${variant[type]}`;

  // ✅ Correct - reactive
  const classes = $derived(`${base} ${variant[type]}`);
  ```
- **Impact:** All components with computed properties from props must use `$derived` for reactivity. This is a Svelte 5 migration issue for projects upgrading from Svelte 4.

### Material Symbols and Font Loading
**Date:** 2026-01-24 | **Task:** Apartment Details UI (Phase 10.2) | **Severity:** Low
- **What:** Material Symbols icons require Google Fonts import in CSS and font variation settings configuration. SvelteKit's `+layout.svelte` doesn't automatically inject fonts into `<head>`.
- **Why It Matters:** Icons won't render without proper CSS @import declarations. Font variation settings control icon weight and fill.
- **Reference:** `src/styles/globals.css:1-2`, `src/lib/components/Icon.svelte:17-21`
- **Workaround/Solution:** Add Google Fonts imports to `globals.css` and configure CSS for icon display:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  :global(.material-symbols-outlined) {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  ```
- **Impact:** Any component using Material Symbols must import this CSS file.

---

## Contact & References

### Resources
- **Original Requirements:** `./requirements-prosa.md`
- **Full PRD:** `./docs/PRD-Dwello.md`
- **Database Schema:** `./docs/data-model.md`
- **API Spec:** `./docs/api-specification.md`
- **Tech Stack:** `./docs/tech-stack.md`

### Project Owner
**Roger Rudin** - Dwello Project Lead

---

**Last Updated:** January 24, 2026
**Status:** Implementation In Progress - Phase 10 (Frontend - Core Management Pages)
