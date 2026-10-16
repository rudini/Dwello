# Dwello Technology Stack & Architecture

**Version:** 1.1
**Date:** January 23, 2026 (corrected against the code: October 2026)

---

## Executive Summary

Dwello is a full-stack TypeScript application: a SvelteKit frontend that doubles as Backend for Frontend (BFF), an ElysiaJS API on Bun, and PostgreSQL. All parts run in Docker containers.

**Stack Overview:**
- **Frontend + BFF:** SvelteKit (Svelte 5) + TypeScript + Tailwind CSS
- **Backend:** ElysiaJS on Bun, Drizzle ORM
- **Database:** PostgreSQL
- **LLM:** any OpenAI-compatible API; by default a local Ollama with `qwen2.5vl:7b`
- **Deployment:** Docker Compose
- **Maps:** Leaflet (CARTO basemap on OpenStreetMap data)
- **Auth:** OAuth 2.0 (Google, Microsoft), session JWT in HTTPOnly cookies
- **E-mail:** nodemailer (SMTP) or Resend

---

## Architecture Diagram (BFF Pattern)

```
┌─────────────────────────────────────────────┐
│         Client (Web Browser)                 │
│  SvelteKit + TypeScript + TailwindCSS       │
│  ├─ Buildings, apartments, tenants          │
│  ├─ Contracts, invoices                     │
│  ├─ Statement generation wizard             │
│  ├─ Building mini map (Leaflet)             │
│  └─ Address lookup (OpenPLZ, from browser)  │
│                                              │
│  Cookies: dwello_session (HTTPOnly),        │
│           dwello_xsrf (readable)            │
│  Header:  X-XSRF-TOKEN={token}              │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS/TLS (Cookies + Headers)
                   │
┌──────────────────▼──────────────────────────┐
│   SvelteKit BFF (Port 3000)                 │
│  ├─ Auth Routes (src/routes/auth):          │
│  │  ├─ GET  /auth/login (OAuth initiation) │
│  │  ├─ GET  /auth/callback (OAuth callback)│
│  │  ├─ POST /auth/refresh (session refresh)│
│  │  ├─ POST /auth/logout (Logout)          │
│  │  └─ GET  /auth/me (Current user)        │
│  ├─ Cookie management (src/lib/server/auth)│
│  ├─ XSRF validation (double-submit)        │
│  ├─ Page loads (+page.server.ts) and form  │
│  │  handling (src/lib/server/*.ts)          │
│  └─ API proxy routes (src/routes/api/*):   │
│     └─ Forward to ElysiaJS with the JWT    │
│        (src/lib/server/api-proxy.ts)        │
└──────────────────┬──────────────────────────┘
                   │
                   │ Internal network (BACKEND_URL)
                   │ Authorization: Bearer {jwt}
                   │
┌──────────────────▼──────────────────────────┐
│  Backend API (ElysiaJS on Bun, Port 3001)   │
│  ├─ JWT validation middleware               │
│  ├─ Routes (backend/src/routes, /api/v1)    │
│  ├─ Services (backend/src/services):        │
│  │  buildings, apartments, tenants,         │
│  │  contracts, invoices, statements,        │
│  │  PDF + Swiss QR-bill, reminders, LLM     │
│  └─ Mail (backend/src/mail: SMTP, Resend)   │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐    ┌──────────────────────────┐
│ PostgreSQL    │    │ LLM (OpenAI-compatible)  │
│ Database      │    │ Default: local Ollama    │
│               │    │ - qwen2.5vl:7b           │
│ Schema:       │    │ - Port 11434             │
│ backend/src/  │    │ Or an external provider  │
│ db/schema.ts  │    │ via LLM_BASE_URL         │
└───────────────┘    └──────────────────────────┘

┌─────────────────────────────────────────────┐
│    External Services                        │
│  ├─ OpenPLZ: postal code / street lookup    │
│  │  (called from the browser)               │
│  ├─ OAuth providers: Google, Microsoft      │
│  └─ SMTP or Resend: reminder e-mails        │
└─────────────────────────────────────────────┘
```

### Key Architectural Properties (BFF Pattern)

- JWT hidden from JavaScript (HTTPOnly cookie)
- BFF handles the OAuth flow and sets the cookies
- XSRF protection via double-submit cookie pattern
- Security logic centralized on the server; the client only reads the XSRF cookie and calls `/auth/refresh` periodically

---

## Frontend Stack

### Framework: SvelteKit

**Why SvelteKit?**
- **Compilation:** Svelte compiles to vanilla JavaScript, resulting in smaller bundles
- **Reactivity:** Fine-grained reactivity (Svelte 5 runes) without VDOM overhead
- **Full-Stack:** Server routes serve as the BFF
- **Adapter:** `@sveltejs/adapter-node`

**Version:** SvelteKit 2, Svelte 5

### UI Framework: Tailwind CSS

- Tailwind CSS 3 (`tailwind.config.js` at the repo root)
- Design tokens (colours, Inter font, spacing, radius, shadow) in `src/styles/tokens.css`, see `docs/design/token-referenz.md`
- Base styles (body, focus outline, placeholder) in `src/styles/globals.css`; components in `src/lib/ui`
- Dark mode follows the system setting (`prefers-color-scheme`), token overrides only

### Type Safety: TypeScript

- Strict mode enabled (`tsconfig.json` extends `.svelte-kit/tsconfig.json`)
- `bun run check` (svelte-check) covers `src`, `tests/` and `*.config.ts`

### State Management: Svelte Stores

Svelte's built-in stores are sufficient for a single-user application. Page data comes from `+page.server.ts` loads; `src/lib/stores.ts` holds only cross-page client state (current user, toasts).

### Validation

- **Backend:** Elysia's `t` schemas on the routes (`backend/src/routes`); zod is used only for the JWT payload in `backend/src/middleware/auth.ts`
- **Frontend:** form handling and mapping in `src/lib/server/*-form.ts`; there are no shared schemas between frontend and backend

### HTTP Client: Fetch API + Custom Wrapper (BFF Pattern)

`src/lib/api.ts` provides `apiCall()`, a thin `fetch` wrapper that calls `/api/*` on the BFF, reads the `dwello_xsrf` cookie and sends it as `X-XSRF-TOKEN` on POST, PUT, DELETE and PATCH. No token is stored client-side.

**Session refresh:** `src/routes/+layout.svelte` calls `POST /auth/refresh` every 50 minutes while a user is signed in; if the refresh fails, the stores are cleared and the user is sent to `/login`.

### Language

- The UI is in German (de-CH); there is no translation library (the unused svelte-i18n setup was removed in the 2026 redesign).
- Statement PDFs are generated by the backend in four languages (de, fr, it, en; `backend/src/services/pdf.service.ts`).

### Dates and Numbers

No date library; formatting uses the built-in `Intl` APIs / `Date`.

### Map Library: Leaflet

- `leaflet` (no Svelte wrapper), used in `src/routes/buildings/BuildingMiniMap.svelte`
- Tiles: CARTO `light_all` / `dark_all` basemap (OpenStreetMap data), API key in `PUBLIC_CARTO_API_KEY`

### Address Lookup: OpenPLZ

`src/lib/services/openplz.ts` calls `https://openplzapi.org/ch` directly from the browser (postal codes, localities, streets).

### Build & Tooling

**Package Manager:** Bun (frontend and backend). The frontend still runs on Node: `bun run` starts its tools (Vite, Vitest, Playwright) with Node, and the production image runs `node build`.

**Build Command:**
```bash
bun run build   # adapter-node output in build/
```

**Dev Server:**
```bash
bun run dev     # http://localhost:3000 (vite.config.ts); needs the backend on 3001
```

**Environment Variables:** see `.env.example` (e.g. `BACKEND_URL`, `JWT_SECRET`, `JWT_EXPIRY`, `OAUTH_GOOGLE_*`, `OAUTH_MICROSOFT_*`, `COOKIE_*`).

---

## Backend Stack

### Framework: ElysiaJS on Bun

**Why ElysiaJS + Bun?**
- **Performance:** Bun is fast to start and run
- **TypeScript Native:** First-class TypeScript support, no build step in development
- **DX:** ElysiaJS is lightweight; route schemas with `t` give validation and types
- **API docs:** `@elysiajs/swagger` at `/swagger`

Business logic lives in `backend/src/services`; routes in `backend/src/routes` under `/api/v1`.

### Database: PostgreSQL 15+

**Why PostgreSQL?**
- **Reliability:** ACID compliance for financial data
- **Proven:** decades of production use
- **Extensions:** `uuid-ossp`

**Connection Pool:** `pg` Pool in `backend/src/db/connection.ts` (`DB_POOL_SIZE`, default 20)

**Migrations:** plain SQL files in `backend/migrations/`, applied by `backend/scripts/migrate.ts` (`bun run db:migrate`; `bun run dev` runs it first)

### ORM / Query Builder: Drizzle ORM

- **Type-Safe:** TypeScript-first, fully typed queries
- **Lightweight:** thin layer over SQL
- Schema: `backend/src/db/schema.ts`

**Example:**
```typescript
import { db } from './db'
import { buildings } from './schema'

const allBuildings = await db.select().from(buildings)
```

### Authentication: BFF Pattern with OAuth 2.0 + HTTPOnly Cookies

**OAuth Providers** (`src/lib/server/oauth.ts`):
1. **Google OAuth**
2. **Microsoft Azure AD** (`OAUTH_MICROSOFT_TENANT_ID`, default `common`)

**Token Storage:** stateless JWT (HS256, `jose`) in an HTTPOnly cookie

**Cookies** (`src/lib/server/jwt-config.ts`):
- **`dwello_session`** = JWT
  - HttpOnly: true
  - Secure: `COOKIE_SECURE`
  - SameSite: `COOKIE_SAME_SITE` (default Lax)
  - MaxAge: `JWT_EXPIRY` (default 7d)
- **`dwello_xsrf`** = random token
  - HttpOnly: false (client reads it for the header)
  - Secure / SameSite / MaxAge as above
- **`dwello_oauth_state`** = OAuth state parameter during login

**Security Flow:**
```
1. User clicks "Login with Google"
   Browser → GET /auth/login?provider=google

2. BFF creates a state parameter, stores it in dwello_oauth_state,
   redirects to the provider

3. Provider → GET /auth/callback?code=xxx&state=yyy

4. BFF validates state, exchanges the code, fetches the profile,
   signs a JWT {sub, email, name, provider, picture, iss, aud},
   sets dwello_session and dwello_xsrf, redirects into the app

5. Client calls /api/* with X-XSRF-TOKEN on mutations;
   the browser sends the cookies

6. BFF compares cookie dwello_xsrf with header X-XSRF-TOKEN
   (constant-time), forwards with Authorization: Bearer {jwt}

7. ElysiaJS verifies signature, expiry, issuer and audience, processes the request
```

**Code locations:**
- `src/routes/auth/*/+server.ts`: login, callback, refresh, logout, me
- `src/lib/server/auth.ts`: cookies, JWT, XSRF validation
- `src/lib/server/api-proxy.ts`: forwarding to the backend
- `backend/src/middleware/auth.ts`: JWT validation in the backend

**Session refresh:** `POST /auth/refresh` (XSRF-checked) re-signs the JWT and sets new cookies; the layout calls it every 50 minutes.

### LLM Integration

**Why a local model by default?**
- **Self-Hosted:** no vendor lock-in, invoice data stays on the server
- **Free:** no API costs
- **Offline:** works without internet

**Deployment:**
```bash
# docker-compose.prod.yml includes the Ollama service
docker exec dwello-ollama ollama pull qwen2.5vl:7b
```

**Integration:** `backend/src/services/llm.service.ts` talks to any OpenAI-compatible API (`/chat/completions`, `/models`); configuration in `backend/src/config/llm.ts`. The provider is set by environment variables: `LLM_BASE_URL` (default: the local Ollama at `http://localhost:11434/v1`), `LLM_API_KEY` (Bearer token, empty for Ollama) and `LLM_MODEL` (default `qwen2.5vl:7b`). Further: `LLM_TIMEOUT` (ms, default 30000), `LLM_ENABLED` (`false` turns categorization off), `LLM_CACHE_TTL` (s, default 3600; in-memory cache of categorization results). With an external provider, the invoice's billing entity, description and amount leave the server, and so do uploaded invoice files (their pages as images, with the file name); `LLM_PROVIDER` and `LLM_PROVIDER_COUNTRY` name it in the privacy statement (`GET /api/v1/invoices/llm-recipient`), and the backend refuses to start without them (README, "External LLM provider").

**Model Selection:** `qwen2.5vl:7b` by default: it reads the pages of uploaded invoices as images and categorizes in German (#217). With an external provider, use a chat model that reads images; requests send no `max_tokens` or `temperature`, so reasoning models work too.

### PDF Generation: PDFKit + qrcode

**Why PDFKit?**
- Pure JavaScript, no external dependencies
- Swiss QR-bill drawn with custom code
- Works in containers without extra libraries

**Swiss QR-Bill** (`backend/src/services/qr-bill.service.ts`):
- Creditor IBAN must be Swiss (CH) or Liechtenstein (LI), checked with MOD-97
- QR reference (QRR, MOD10) only with a QR-IBAN (IID 30000–31999); with a normal IBAN no reference (`NON`)
- Debtor block only when name, postal code and town are all present
- QR code rendered with `qrcode`, embedded in the PDF

### E-Mail

`backend/src/mail/`: transport chosen by `MAIL_TRANSPORT` (`smtp` via nodemailer, or `resend`). Used for payment reminders (Mahnungen). Without `MAIL_TRANSPORT`, reminders for tenants with e-mail correspondence are filed as "to be sent" instead.

### Error Handling & Logging

- Backend: Elysia error handling in the routes; service-specific error classes (e.g. `ReminderError`, `MailConfigError`)
- BFF: `src/lib/server/error-handler.ts` (`AppError`, `JWTError`, `ValidationError`, `logger`)

---

## Database Stack

### PostgreSQL Configuration

**Version:** 15+; 16 (`postgres:16-alpine`) used in Docker Compose and CI

**Extensions:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Schema and indexes:** `backend/src/db/schema.ts`, `backend/migrations/`, see `docs/data-model.md`

---

## Deployment & Infrastructure

### Docker Compose

- `docker-compose.yml`: PostgreSQL only (Ollama commented out), for local development
- `docker-compose.dev.yml`: PostgreSQL and Ollama for development
- `docker-compose.prod.yml`: production

**Services in `docker-compose.prod.yml`:**
1. **frontend** (SvelteKit BFF, Node 20, port 3000, root `Dockerfile`)
2. **backend** (ElysiaJS on Bun, port 3001, `backend/Dockerfile`)
3. **postgres** (`postgres:16-alpine`)
4. **ollama** (LLM service; not needed with an external provider)
5. **nginx** (reverse proxy, TLS termination): commented out, optional

```bash
docker-compose -f docker-compose.prod.yml up -d
docker exec dwello-ollama ollama pull qwen2.5vl:7b
```

### Environment Configuration

See `.env.example`. Main variables:

```
# Frontend / BFF
PUBLIC_APP_URL=http://localhost:3000
PUBLIC_CARTO_API_KEY=...  # map tiles, from carto.com/basemaps/apikey; visible to the browser
BACKEND_URL=http://localhost:3001
JWT_SECRET=...            # min 32 characters, same value in backend
JWT_EXPIRY=7d
OAUTH_GOOGLE_CLIENT_ID / OAUTH_GOOGLE_CLIENT_SECRET / OAUTH_GOOGLE_REDIRECT_URI
OAUTH_MICROSOFT_CLIENT_ID / OAUTH_MICROSOFT_CLIENT_SECRET / OAUTH_MICROSOFT_TENANT_ID / OAUTH_MICROSOFT_REDIRECT_URI
COOKIE_DOMAIN / COOKIE_SECURE / COOKIE_SAME_SITE

# Backend
DATABASE_URL=postgresql://dwello:dwello@localhost:5432/dwello
CORS_ORIGIN=http://localhost:3000
LLM_BASE_URL / LLM_API_KEY / LLM_MODEL / LLM_PROVIDER / LLM_PROVIDER_COUNTRY
MAIL_TRANSPORT / MAIL_FROM / SMTP_* / RESEND_API_KEY
```

---

## Development Workflow

### Local Setup

**Requirements:**
- Node.js >= 20 (frontend runtime; `package.json` engines; CI uses 22)
- Bun >= 1.4 (package manager; backend runtime; older versions misread `bun.lock`)
- Docker & Docker Compose (PostgreSQL)

**Installation:**
```bash
bun install
(cd backend && bun install)
cp .env.example .env.local

docker-compose up -d          # PostgreSQL on 5432
(cd backend && bun run dev:demo)   # backend on 3001 with demo data
bun run dev                   # frontend/BFF on 3000
```

See `README.md` for details.

### Project Structure

```
dwello/
├── src/
│   ├── routes/              # SvelteKit pages
│   │   ├── api/             # BFF proxy routes to the backend
│   │   └── auth/            # OAuth login, callback, refresh, logout, me
│   ├── lib/
│   │   ├── ui/              # Design system: components, icons, illustrations
│   │   ├── server/          # BFF: auth, api-proxy, form handling, mapping
│   │   ├── services/        # e.g. openplz.ts
│   │   ├── stores.ts
│   │   └── api.ts           # apiCall() wrapper
│   └── styles/globals.css
├── backend/
│   ├── src/
│   │   ├── routes/          # Elysia routes (/api/v1)
│   │   ├── services/        # business logic
│   │   ├── db/schema.ts     # Drizzle schema
│   │   ├── mail/            # SMTP / Resend
│   │   └── middleware/auth.ts
│   ├── migrations/          # SQL migrations
│   └── Dockerfile
├── tests/                   # e2e (playwright-bdd), contracts, unit, ui-screenshots
├── docs/
├── docker-compose.yml / .dev.yml / .prod.yml
├── Dockerfile
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Code Quality

```bash
bun run lint             # ESLint, fails on warnings
bun run format           # Prettier
bun run check            # svelte-check
bunx vitest run           # frontend unit tests
bun run test:coverage    # with coverage floor
bun run test:e2e         # acceptance tests (playwright-bdd)
cd backend && bun run test && bun run type-check
```

### CI/CD Pipeline

**GitHub Actions (`.github/workflows/ci.yml`)**, on push to `main` and on pull requests (Node 22, Bun, PostgreSQL 16 service):

| Job | What it does |
|-----|--------------|
| Changes | On PRs, detects whether backend/contracts or app code changed, so untouched parts are skipped |
| Build | `bun run build` and `bun run build` (backend) |
| Lint and types | `bun run lint`, `bun run check`, backend `bun run type-check` |
| Unit tests | `bun run test:coverage`; backend `bun run test` if backend changed |
| E2E tests | `bun run test:e2e` (PRs: Chromium + API driver; main: all browsers); skipped for docs-only changes |
| Fallow audit | `bunx fallow audit` against the base |
| UI screenshots | On PRs: screenshots of changed pages, posted as a PR comment |

No Docker image is built or pushed in CI.

---

## Performance Targets & Benchmarks

### Frontend Performance

| Metric | Target | Optimization |
|--------|--------|--------------|
| First Contentful Paint | <1.5s | Critical CSS, lazy loading |
| Time to Interactive | <2.5s | Code splitting, async routes |
| Largest Contentful Paint | <2.5s | Image optimization, font loading |
| Bundle Size | <150KB | Tree-shaking, compression |

### Backend Performance

| Metric | Target | Optimization |
|--------|--------|--------------|
| API Response Time | <500ms (p95) | Query optimization, caching |
| PDF Generation | <5s | |
| Statement Generation (50 apts) | <60s (open: PRD states 10 s, see docs/migration-mva.md P1) | |
| LLM Categorization | <2s | In-memory result cache |

### Database Performance

| Metric | Target | Optimization |
|--------|--------|--------------|
| Query Latency | <100ms (p95) | Indexing, connection pooling |
| Statement Generation Query | <5s | Composite indexes, query optimization |

None of these targets is measured yet (see `docs/migration-mva.md`).

---

## Security Best Practices

### Authentication & Session Security (BFF Pattern)

**HTTPOnly Cookies:**
- JWT stored in the HTTPOnly cookie `dwello_session` (not client-side)
- Prevents XSS attacks from stealing tokens
- Lifetime `JWT_EXPIRY` (default 7 days), refreshed by the client every 50 minutes

**XSRF Protection (Double-Submit Cookie Pattern):**
- XSRF token in the readable cookie `dwello_xsrf`
- Same token required in the `X-XSRF-TOKEN` header on mutations, compared in constant time
- SameSite=Lax (default) provides additional protection

**OAuth Security:**
- State parameter (cookie `dwello_oauth_state`) validates the callback
- All OAuth handling on the server (BFF)
- No client-side OAuth token exposure

### Deployment Security
- **Secret Management:** environment variables, not in git
- **CORS:** backend allows `CORS_ORIGIN` only
- **SQL Injection:** parameterized queries via Drizzle ORM
- **XSS:** Svelte output encoding, HTTPOnly cookies
- **TLS:** to be terminated by a reverse proxy (nginx in `docker-compose.prod.yml` is commented out)

---

## Not Implemented / Planned

- PKCE in the OAuth flow
- Rate limiting
- Swiss eID login
- Shared validation schemas between frontend and backend
- Background job queue for statement generation (generation loops over the contracts in the BFF, `src/lib/server/statement-generation.ts`)
- Monitoring stack (metrics, APM, uptime checks)
- Dependency/SAST/DAST scanning in CI
- Container image build/push in CI
- Scaling beyond one instance per service (read replicas, Redis, load balancer)

---

## Technology Decisions Summary

| Component | Choice | Why |
|-----------|--------|-----|
| Backend | ElysiaJS + Bun | Performance, DX, modern |
| Frontend + BFF | SvelteKit | Lightweight, reactive, server routes |
| Database | PostgreSQL | Reliable, ACID |
| ORM | Drizzle | Type-safe, lightweight |
| LLM | OpenAI-compatible API, default local Ollama (`qwen2.5vl:7b`) | Self-hosted by default, privacy, cost; external provider possible |
| Auth | OAuth 2.0 (Google, Microsoft) + HTTPOnly cookie JWT | Standard, no token in the browser |
| Maps | Leaflet + CARTO/OSM tiles | Lightweight, free CARTO API key |
| PDF | PDFKit + qrcode | Pure JS, Swiss QR-bill |
| Mail | nodemailer (SMTP) / Resend | Either own mail server or hosted |
| Deployment | Docker Compose | Simple, portable |

---

**Last Updated:** October 2026
