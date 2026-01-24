# Dwello Full System Implementation Plan

**Status:** Ready for Implementation
**Date Created:** January 23, 2026
**Architecture:** SvelteKit BFF + ElysiaJS Backend + PostgreSQL
**Scope:** Complete MVP with all 11 core features

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation Phases](#implementation-phases)
3. [Phase Details & Checklists](#phase-details--checklists)
4. [Progress Tracking](#progress-tracking)
5. [Success Criteria](#success-criteria)

---

## Overview

This is a comprehensive implementation plan for the entire Dwello property management system. The system includes:

**11 Core Features:**
1. Building Management
2. Apartment Management
3. Tenant Management
4. Rental Contract Management
5. Invoice Management with LLM-powered categorization
6. Distribution Keys (predefined and custom formulas)
7. Heating Distribution Configuration
8. Utility Cost Statements with complex prorating
9. PDF Generation & Swiss QR Bills
10. Accounting Period Configuration
11. Payment Tracking & Reminders

**Architecture:**
- Backend for Frontend (BFF) pattern with SvelteKit server routes
- ElysiaJS backend for business logic
- PostgreSQL for data storage
- Docker Compose for deployment
- Multi-language support (German, French, Italian, Romansh, English)

---

## Implementation Phases

| # | Phase | Duration | Status | Completion |
|---|-------|----------|--------|-----------|
| 0 | Project Initialization | 1 week | ✅ Complete | 100% |
| 1 | SvelteKit Auth Routes (BFF) | 1 week | ⏳ Pending | 0% |
| 2 | API Proxy Routes (BFF) | 1 week | ⏳ Pending | 0% |
| 3 | Client-Side Auth & Layout | 3 days | ⏳ Pending | 0% |
| 4 | Database Schema & Migrations | 3 days | ⏳ Pending | 0% |
| 5 | Backend - Core Entities | 2 weeks | ⏳ Pending | 0% |
| 6 | Backend - Invoices & LLM | 2 weeks | ⏳ Pending | 0% |
| 7 | Backend - Distribution Keys | 1 week | ⏳ Pending | 0% |
| 8 | Backend - Statements & Prorating | 3 weeks | ⏳ Pending | 0% |
| 9 | PDF & QR Bill Generation | 2 weeks | ⏳ Pending | 0% |
| 10 | Frontend - Core Management Pages | 2 weeks | 🔄 In Progress | 14% |
| 11 | Frontend - Invoice Management | 1.5 weeks | ⏳ Pending | 0% |
| 12 | Frontend - Configuration Pages | 1.5 weeks | ⏳ Pending | 0% |
| 13 | Frontend - Statement Generation | 2 weeks | ⏳ Pending | 0% |
| 14 | Frontend - Dashboard & Analytics | 1 week | ⏳ Pending | 0% |
| 15 | Integration Testing | 1.5 weeks | ⏳ Pending | 0% |
| 16 | Environment & Config | 3 days | ⏳ Pending | 0% |
| 17 | Docker & Deployment | 1 week | ⏳ Pending | 0% |
| 18 | Documentation & Tests | 1 week | ⏳ Pending | 0% |
| 19 | Manual Testing & QA | 1 week | ⏳ Pending | 0% |
| 20 | Optimization & Cleanup | 3 days | ⏳ Pending | 0% |
| 21 | Go-Live Preparation | 3 days | ⏳ Pending | 0% |

**Total Duration:** ~22 weeks for full MVP

---

# Phase Details & Checklists

---

## Phase 0: Project Initialization ✅ COMPLETE

### 0.1 Project Setup ✅

- [x] Initialize Git repository
  - [x] Create `.gitignore` for Node.js
  - [x] Add `/node_modules`, `/.env.local`, `/dist`, `/.svelte-kit`
  - [x] Create initial commit

- [x] Initialize SvelteKit project
  - [x] Run `npm create svelte@latest . -- --typescript --no-git` (used manual setup instead, newer CLI available)
  - [x] Select "Skeleton project" template (equivalent: skeleton project structure)
  - [x] Verify `package.json` created
  - [x] Verify `svelte.config.js` exists
  - [x] Verify `tsconfig.json` with strict mode

- [x] Initialize backend project structure
  - [x] Create `backend/` directory
  - [x] Create `backend/package.json`
  - [x] Create `backend/src/` directory
  - [x] Create `backend/tsconfig.json`

### 0.2 Frontend Dependencies ✅

- [x] Install core frontend dependencies
  - [x] `npm install jose` (JWT signing/verification)
  - [x] `npm install zod` (validation schemas)
  - [x] `npm install tailwindcss postcss autoprefixer`
  - [x] `npm install svelte-i18n` (internationalization)
  - [x] `npm install date-fns` (date handling)
  - [x] `npm install leaflet` (maps - svelte-leaflet not available)

- [x] Install dev dependencies
  - [x] `npm install -D @sveltejs/adapter-node`
  - [x] `npm install -D typescript @types/node`
  - [x] `npm install -D eslint prettier`
  - [x] `npm install -D vitest @vitest/ui`
  - [x] `npm install -D @playwright/test`
  - [x] `npm install -D svelte-check`

- [x] Verify all dependencies in `package.json`

### 0.3 Backend Dependencies ✅

- [x] Install core backend dependencies
  - [x] Navigate to `backend/` directory
  - [x] `npm install elysia` (framework)
  - [x] `npm install pg` (PostgreSQL client)
  - [x] `npm install drizzle-orm` (ORM)
  - [x] `npm install drizzle-kit` (migration tool)
  - [x] `npm install zod` (validation)
  - [x] `npm install jose` (JWT validation)
  - [x] `npm install cors` (CORS support)

- [x] Install backend dev dependencies
  - [x] `npm install -D typescript @types/node`
  - [x] `npm install -D vitest`
  - [x] `npm install -D eslint prettier`

### 0.4 Configuration Files ✅

- [x] Create `svelte.config.js`
  - [x] Set adapter to `@sveltejs/adapter-node`
  - [x] Enable CSRF protection
  - [x] Configure environment variables

- [x] Create `vite.config.ts`
  - [x] Define environment variables
  - [x] Configure build settings

- [x] Create `tsconfig.json` (root)
  - [x] Set strict mode: `"strict": true`
  - [x] Configure paths for imports

- [x] Create `backend/tsconfig.json`
  - [x] Set strict mode: `"strict": true`
  - [x] Target ES2020

- [x] Create `eslint.config.js` (modern flat config format)
  - [x] Configure ESLint rules
  - [x] Include Svelte rules

- [x] Create `.prettierrc`
  - [x] Configure Prettier formatting
  - [x] Tab width, line length, quotes

### 0.5 Environment Setup ✅

- [x] Create `.env.example`
  - [x] Document all environment variables
  - [x] Include comments for each variable
  - [x] Provide example values

- [x] Create `.env.local` (gitignored)
  - [x] Copy from `.env.example`
  - [x] Fill in local development values
  - [x] Generate `JWT_SECRET` (32+ chars random)
  - [x] Set `NODE_ENV=development`

- [x] Create `.env.production` template (documented in .env.example)
  - [x] Document production values
  - [x] Note: Do NOT commit with secrets

### 0.6 Directory Structure ✅

- [x] Create frontend directories
  - [x] `src/routes/auth/` (auth server routes)
  - [x] `src/routes/api/` (API proxy routes)
  - [x] `src/routes/buildings/` (building pages)
  - [x] `src/routes/apartments/` (apartment pages)
  - [x] `src/routes/tenants/` (tenant pages)
  - [x] `src/routes/contracts/` (contract pages)
  - [x] `src/routes/invoices/` (invoice pages)
  - [x] `src/routes/statements/` (statement pages)
  - [x] `src/routes/config/` (configuration pages)
  - [x] `src/routes/dashboard/` (dashboard page)
  - [x] `src/lib/server/` (server-only utilities)
  - [x] `src/lib/components/` (Svelte components)
  - [x] `src/lib/utils/` (utility functions)
  - [x] `migrations/` (database migrations)

- [x] Create backend directories
  - [x] `backend/src/middleware/` (middlewares)
  - [x] `backend/src/routes/` (API routes)
  - [x] `backend/src/db/` (database connection)
  - [x] `backend/src/schema/` (database schema)
  - [x] `backend/src/services/` (business logic)
  - [x] `backend/tests/` (tests)

### 0.7 Documentation Structure ✅

- [x] Create docs structure (already exists but verify)
  - [x] `docs/PRD-Dwello.md` (product requirements) ✅ exists
  - [x] `docs/tech-stack.md` (architecture decisions) ✅ exists
  - [x] `docs/api-specification.md` (API specs) ✅ exists
  - [x] `docs/data-model.md` (database schema) ✅ exists
  - [x] Create `DEVELOPMENT.md` (dev guide) - to be created in Phase 1
  - [x] Create `DEPLOYMENT.md` (deployment guide) - to be created in Phase 1

### 0.8 Testing Setup ✅

- [x] Configure Vitest
  - [x] Create `vitest.config.ts`
  - [x] Configure test environment
  - [x] Setup coverage reporting

- [x] Configure Playwright
  - [x] Create `playwright.config.ts`
  - [x] Configure browsers
  - [x] Setup headless mode

### 0.9 Initial Git Commit ✅

- [x] Commit initial project setup
  - [x] Commit message: "feat(init): complete Phase 0 project initialization"
  - [x] Verify all files tracked (except `.env.local`)

**Status: Phase 0 Complete** ✅ | **Commit: 2301baa** | **Date: Jan 23, 2026**

---

## Phase 1: SvelteKit Auth Routes (BFF Layer - Authentication)

### 1.1 Server-Side Auth Utilities

- [ ] Create `src/lib/server/auth.ts`
  - [ ] `generateJwt(user)` - Create JWT token
  - [ ] `verifyJwt(token)` - Verify and decode JWT
  - [ ] `setSessionCookie(cookies, jwt)` - Set HTTPOnly session cookie
  - [ ] `setXsrfToken(cookies)` - Set XSRF token cookie
  - [ ] `getJwtFromCookie(cookies)` - Extract JWT from cookie
  - [ ] `validateXsrfToken(request, cookies)` - Validate XSRF protection
  - [ ] `clearAuthCookies(cookies)` - Clear auth cookies on logout
  - [ ] Add unit tests (test coverage >85%)

- [ ] Create `src/lib/server/oauth.ts`
  - [ ] `generateOAuthUrl(provider, state)` - Generate OAuth URL
  - [ ] `exchangeCodeForToken(code, provider)` - Exchange code for token
  - [ ] `fetchUserProfile(accessToken, provider)` - Fetch user profile
  - [ ] Support Google OAuth
  - [ ] Support Microsoft Azure AD OAuth
  - [ ] Support future: Swiss eID
  - [ ] Add unit tests (test coverage >85%)

- [ ] Create `src/lib/server/jwt-config.ts`
  - [ ] Export JWT secret and configuration
  - [ ] Validate secret length (min 32 chars)

### 1.2 Auth Routes - Login

- [ ] Create `src/routes/auth/login/+server.ts`
  - [ ] GET handler: Initiate OAuth flow
  - [ ] Extract provider from query params
  - [ ] Validate provider (google | microsoft)
  - [ ] Generate OAuth state parameter
  - [ ] Store state in secure cookie
  - [ ] Redirect to OAuth provider
  - [ ] Error handling (return 400 on invalid provider)
  - [ ] Add unit tests
  - [ ] Add integration tests

### 1.3 Auth Routes - Callback

- [ ] Create `src/routes/auth/callback/+server.ts`
  - [ ] GET handler: Handle OAuth callback
  - [ ] Extract code and state from query params
  - [ ] Validate state parameter (CSRF protection)
  - [ ] Return 400 on state mismatch
  - [ ] Exchange code for access token
  - [ ] Fetch user profile from OAuth provider
  - [ ] Generate JWT from user profile
  - [ ] Set session cookie (HTTPOnly, Secure, SameSite=Lax)
  - [ ] Set XSRF token cookie
  - [ ] Delete OAuth state cookie
  - [ ] Redirect to `/dashboard`
  - [ ] Comprehensive error handling (400, 500)
  - [ ] Log errors appropriately
  - [ ] Add unit tests
  - [ ] Add integration tests

### 1.4 Auth Routes - Current User

- [ ] Create `src/routes/auth/me/+server.ts`
  - [ ] GET handler: Return current user info
  - [ ] Extract JWT from session cookie
  - [ ] Return 401 if no cookie
  - [ ] Verify JWT signature
  - [ ] Return 401 if invalid or expired
  - [ ] Return user object (sub, email, name)
  - [ ] Add unit tests
  - [ ] Add integration tests

### 1.5 Auth Routes - Token Refresh

- [ ] Create `src/routes/auth/refresh/+server.ts`
  - [ ] POST handler: Refresh session token
  - [ ] Extract JWT from session cookie
  - [ ] Return 401 if no cookie
  - [ ] Verify JWT (allow if not expired yet)
  - [ ] Generate new JWT with same user data
  - [ ] Generate new XSRF token
  - [ ] Set new session cookie
  - [ ] Set new XSRF token cookie
  - [ ] Return `{ success: true }`
  - [ ] Add unit tests
  - [ ] Add integration tests

### 1.6 Auth Routes - Logout

- [ ] Create `src/routes/auth/logout/+server.ts`
  - [ ] POST handler: Logout user
  - [ ] Clear session cookie (set Max-Age=0)
  - [ ] Clear XSRF token cookie (set Max-Age=0)
  - [ ] Return `{ success: true }`
  - [ ] Add unit tests
  - [ ] Add integration tests

### 1.7 Error Handling & Logging

- [ ] Create `src/lib/server/error-handler.ts`
  - [ ] Define custom error types
  - [ ] OAuthError, JWTError, ValidationError
  - [ ] Standardized error responses
  - [ ] Logging configuration

- [ ] Implement error logging
  - [ ] Log all OAuth failures
  - [ ] Log JWT validation failures
  - [ ] Log invalid state parameters
  - [ ] Include context (provider, timestamp, etc.)

### 1.8 Testing Auth Routes

- [ ] Unit tests for `src/lib/server/auth.ts`
  - [ ] JWT generation and expiration (5 tests)
  - [ ] JWT verification with valid/invalid tokens (4 tests)
  - [ ] Cookie creation with correct attributes (3 tests)
  - [ ] XSRF token validation matching/non-matching (4 tests)
  - [ ] Cookie deletion (2 tests)
  - [ ] **Coverage Target:** >85%

- [ ] Unit tests for `src/lib/server/oauth.ts`
  - [ ] OAuth URL generation (2 tests)
  - [ ] Token exchange (2 tests)
  - [ ] User profile fetch (2 tests)
  - [ ] Error handling (3 tests)
  - [ ] **Coverage Target:** >85%

- [ ] Integration tests for auth routes
  - [ ] Login initiation → OAuth redirect (1 test)
  - [ ] OAuth callback → Session creation (1 test)
  - [ ] Get current user → Returns user info (1 test)
  - [ ] Token refresh → New tokens set (1 test)
  - [ ] Logout → Cookies cleared (1 test)
  - [ ] State validation failure → 400 error (1 test)
  - [ ] Expired token → 401 error (1 test)

- [ ] Manual testing
  - [ ] Test with Google OAuth (dev credentials)
  - [ ] Test with Microsoft OAuth (dev credentials)
  - [ ] Verify cookies set correctly in browser
  - [ ] Verify redirect to dashboard

### 1.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for `src/lib/server/auth.ts`
  - [ ] Create `tests/unit/auth.test.ts`
  - [ ] Test `generateJwt()` with valid/invalid user data
  - [ ] Test `verifyJwt()` with valid/expired/invalid tokens
  - [ ] Test `setSessionCookie()` sets HTTPOnly flag
  - [ ] Test `validateXsrfToken()` with matching/mismatched tokens
  - [ ] Test `clearAuthCookies()` removes all auth cookies
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Unit Tests for `src/lib/server/oauth.ts`
  - [ ] Create `tests/unit/oauth.test.ts`
  - [ ] Test `generateOAuthUrl()` with different providers
  - [ ] Test `exchangeCodeForToken()` with mock responses
  - [ ] Test `fetchUserProfile()` with mock provider responses
  - [ ] Test error handling for failed OAuth flows
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Unit Tests for `src/routes/auth/**/+server.ts`
  - [ ] Create `tests/unit/auth-routes.test.ts`
  - [ ] Test login endpoint with invalid provider
  - [ ] Test callback endpoint with valid/invalid state
  - [ ] Test refresh endpoint with expired tokens
  - [ ] Test logout endpoint clears cookies
  - [ ] Test me endpoint returns current user
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Auth Flow
  - [ ] Create `tests/e2e/auth.spec.ts`
  - [ ] Test complete OAuth login flow (mock provider)
  - [ ] Test login redirect to OAuth provider
  - [ ] Test callback redirect to dashboard
  - [ ] Test token refresh on page reload
  - [ ] Test logout clears session and redirects
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run dev server: `npm run dev`
  - [ ] Verify no TypeScript errors: `npm run type-check`
  - [ ] Verify no linting issues: `npm run lint`
  - [ ] Test OAuth flows in browser (with dev credentials)
  - [ ] Check browser console for errors
  - [ ] Verify cookies appear in DevTools

**Status: Phase 1 Complete** ✅

---

## Phase 2: API Proxy Routes (BFF Layer - API Proxying)

### 2.1 API Proxy Helper Functions

- [ ] Create `src/lib/server/api-proxy.ts`
  - [ ] `forwardRequest(path, method, options)` function
    - [ ] Extract JWT from cookies (return 401 if missing)
    - [ ] Build backend URL (`http://localhost:3001/api/v1${path}`)
    - [ ] Forward request with Authorization header
    - [ ] Return response status and body
    - [ ] Handle backend errors

  - [ ] `validateXsrfForMutation(request, cookies)` function
    - [ ] Check if method is POST/PUT/DELETE/PATCH
    - [ ] Validate XSRF token if needed
    - [ ] Return 403 if invalid
    - [ ] Return 200 if valid or method is GET

### 2.2 Buildings API Proxy

- [ ] Create `src/routes/api/buildings/+server.ts`
  - [ ] GET: List buildings with pagination
  - [ ] POST: Create new building
  - [ ] Add XSRF validation for POST
  - [ ] Add unit tests
  - [ ] Add integration tests

- [ ] Create `src/routes/api/buildings/[id]/+server.ts`
  - [ ] GET: Fetch single building with details
  - [ ] PUT: Update building
  - [ ] DELETE: Delete building
  - [ ] Add XSRF validation for PUT/DELETE
  - [ ] Add unit tests
  - [ ] Add integration tests

### 2.3 Apartments API Proxy

- [ ] Create `src/routes/api/apartments/+server.ts`
  - [ ] GET: List apartments (with filters)
  - [ ] POST: Create apartment
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/apartments/[id]/+server.ts`
  - [ ] GET: Fetch apartment details
  - [ ] PUT: Update apartment
  - [ ] DELETE: Delete apartment
  - [ ] Add unit and integration tests

### 2.4 Tenants API Proxy

- [ ] Create `src/routes/api/tenants/+server.ts`
  - [ ] GET: List tenants
  - [ ] POST: Create tenant
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/tenants/[id]/+server.ts`
  - [ ] GET: Fetch tenant details
  - [ ] PUT: Update tenant
  - [ ] DELETE: Delete tenant
  - [ ] Add unit and integration tests

### 2.5 Contracts API Proxy

- [ ] Create `src/routes/api/contracts/+server.ts`
  - [ ] GET: List contracts
  - [ ] POST: Create contract
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/contracts/[id]/+server.ts`
  - [ ] GET: Fetch contract details
  - [ ] PUT: Update contract
  - [ ] DELETE: Delete contract
  - [ ] Add unit and integration tests

### 2.6 Invoices API Proxy

- [ ] Create `src/routes/api/invoices/+server.ts`
  - [ ] GET: List invoices (with filters)
  - [ ] POST: Create invoice
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/invoices/[id]/+server.ts`
  - [ ] GET: Fetch invoice details
  - [ ] PUT: Update invoice
  - [ ] DELETE: Delete invoice
  - [ ] Add unit and integration tests

### 2.7 Categories API Proxy

- [ ] Create `src/routes/api/categories/+server.ts`
  - [ ] GET: List categories
  - [ ] POST: Create category
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/categories/[id]/+server.ts`
  - [ ] GET: Fetch category details
  - [ ] PUT: Update category
  - [ ] DELETE: Delete category
  - [ ] Add unit and integration tests

### 2.8 Distribution Keys API Proxy

- [ ] Create `src/routes/api/distribution-keys/+server.ts`
  - [ ] GET: List distribution keys
  - [ ] POST: Create distribution key
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/distribution-keys/[id]/+server.ts`
  - [ ] GET: Fetch distribution key details
  - [ ] PUT: Update distribution key
  - [ ] DELETE: Delete distribution key
  - [ ] Add unit and integration tests

### 2.9 Statements API Proxy

- [ ] Create `src/routes/api/statements/+server.ts`
  - [ ] GET: List statements (with filters by building, status, period)
  - [ ] POST: Create statements (bulk generation)
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/statements/[id]/+server.ts`
  - [ ] GET: Fetch statement details
  - [ ] PUT: Update statement status
  - [ ] DELETE: Delete statement
  - [ ] Add unit and integration tests

- [ ] Create `src/routes/api/statements/[id]/pdf/+server.ts`
  - [ ] GET: Download statement as PDF
  - [ ] Set correct content-type header
  - [ ] Add unit and integration tests

### 2.10 Configuration API Proxy

- [ ] Create `src/routes/api/config/+server.ts`
  - [ ] GET: Read global configuration
  - [ ] PUT: Update configuration
  - [ ] Add XSRF validation for PUT
  - [ ] Add unit and integration tests

### 2.11 Dashboard API Proxy

- [ ] Create `src/routes/api/dashboard/+server.ts`
  - [ ] GET: Fetch dashboard statistics
  - [ ] Include: total buildings, occupancy rate, pending statements, etc.
  - [ ] Add unit and integration tests

### 2.12 API Proxy Testing

- [ ] Unit tests for `src/lib/server/api-proxy.ts`
  - [ ] Request forwarding (3 tests)
  - [ ] JWT extraction (2 tests)
  - [ ] XSRF validation (4 tests)
  - [ ] Error handling (4 tests)
  - [ ] **Coverage Target:** >85%

- [ ] Integration tests for all proxy routes
  - [ ] Each route GET/POST/PUT/DELETE (80+ tests total)
  - [ ] XSRF protection on mutations
  - [ ] Error handling (401, 403, 404, 500)
  - [ ] Request/response forwarding
  - [ ] Query parameter passing

### 2.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for `src/lib/server/api-proxy.ts`
  - [ ] Create `tests/unit/api-proxy.test.ts`
  - [ ] Test `forwardRequest()` with valid JWT
  - [ ] Test missing JWT returns 401
  - [ ] Test XSRF token validation
  - [ ] Test query parameter forwarding
  - [ ] Test header forwarding
  - [ ] Test error responses from backend
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for All Proxy Routes
  - [ ] Create `tests/integration/api-routes.test.ts`
  - [ ] Test all building routes (GET, POST, PUT, DELETE)
  - [ ] Test all apartment routes (GET, POST, PUT, DELETE)
  - [ ] Test all tenant routes (GET, POST, PUT, DELETE)
  - [ ] Test all contract routes (GET, POST, PUT, DELETE)
  - [ ] Test authentication enforcement (401 on missing JWT)
  - [ ] Test XSRF protection (403 on missing token)
  - [ ] Test query parameters passed through correctly
  - [ ] Test pagination works
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for API Proxy Integration
  - [ ] Create `tests/e2e/api.spec.ts`
  - [ ] Test complete request flow through BFF layer
  - [ ] Test authenticated requests work
  - [ ] Test unauthenticated requests return 401
  - [ ] Test XSRF protection blocks requests
  - [ ] Test response data returned to client
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run dev server: `npm run dev`
  - [ ] Verify no TypeScript errors: `npm run type-check`
  - [ ] Verify no linting issues: `npm run lint`
  - [ ] Test API proxy with mock backend responses
  - [ ] Check browser DevTools network tab for forwarded requests
  - [ ] Verify XSRF token in request headers

**Status: Phase 2 Complete** ✅

---

## Phase 3: Client-Side Auth & Layout

### 3.1 Client API Helper

- [ ] Create `src/lib/api.ts`
  - [ ] `getXsrfTokenFromCookie()` - Read XSRF token from cookie
  - [ ] `apiCall(path, options)` - Main API helper
    - [ ] Add XSRF token header for mutations
    - [ ] Handle 401 errors (redirect to login)
    - [ ] Parse JSON responses
    - [ ] Error handling and throwing

  - [ ] Add unit tests for `apiCall()`
  - [ ] Test with GET/POST/PUT/DELETE
  - [ ] Test XSRF token inclusion
  - [ ] Test 401 error handling

### 3.2 Login Page

- [ ] Create `src/routes/login/+page.svelte`
  - [ ] Display "Login with Google" button
  - [ ] Display "Login with Microsoft" button
  - [ ] On click: Redirect to `/auth/login?provider={provider}`
  - [ ] Add Tailwind styling
  - [ ] Add loading state during redirect
  - [ ] Add error handling and display

- [ ] Add unit tests for login page
- [ ] Add E2E tests for login flow

### 3.3 Protected Layout with Auth Check

- [ ] Create/Update `src/routes/+layout.svelte`
  - [ ] Add script to check authentication
  - [ ] On mount: Call `/auth/me` to get current user
  - [ ] If not authenticated: Redirect to `/login`
  - [ ] If authenticated: Load user data into store
  - [ ] Setup auto-token refresh (every 50 minutes)

- [ ] Create `src/lib/stores.ts`
  - [ ] `user` store (writable)
  - [ ] `isAuthenticated` store (readable, derived)
  - [ ] `buildings` store (writable)
  - [ ] `selectedBuilding` store (writable)
  - [ ] `statements` store (writable)

### 3.4 Main Layout Components

- [ ] Create `src/lib/components/Header.svelte`
  - [ ] Display user name
  - [ ] Display logout button
  - [ ] Add navigation menu

- [ ] Create `src/lib/components/Navigation.svelte`
  - [ ] Links to all main sections
  - [ ] Buildings, Apartments, Tenants, Contracts
  - [ ] Invoices, Statements, Configuration
  - [ ] Dashboard

- [ ] Create `src/lib/components/Footer.svelte`
  - [ ] Copyright and version info

### 3.5 Dashboard Page

- [ ] Create `src/routes/+page.svelte` (Dashboard)
  - [ ] Display welcome message with user name
  - [ ] Show quick statistics
  - [ ] Show recent activity
  - [ ] Add navigation to main features

### 3.6 Error Handling Pages

- [ ] Create `src/routes/+error.svelte`
  - [ ] Display error message
  - [ ] Provide link to home or login

- [ ] Create `src/routes/error/+page.svelte`
  - [ ] Display detailed error information

### 3.7 Loading & Auth Testing

- [ ] E2E tests for auth flow
  - [ ] Visit `/login` (not authenticated) (1 test)
  - [ ] Click login button (1 test)
  - [ ] OAuth callback (mocked) (1 test)
  - [ ] Redirected to dashboard (1 test)
  - [ ] User info displayed (1 test)
  - [ ] Automatic token refresh (1 test)
  - [ ] Logout clears cookies (1 test)

### 3.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for `src/lib/api.ts`
  - [ ] Create `tests/unit/api.test.ts`
  - [ ] Test `getXsrfTokenFromCookie()` extraction
  - [ ] Test `apiCall()` with GET/POST/PUT/DELETE
  - [ ] Test XSRF token inclusion in headers
  - [ ] Test 401 error handling and redirect
  - [ ] Test request/response serialization
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Component Tests for Auth Components
  - [ ] Create `tests/unit/auth-components.test.ts`
  - [ ] Test LoginPage renders correctly
  - [ ] Test user info displays after auth
  - [ ] Test logout button works
  - [ ] Test layout persists auth state
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Full Auth & Layout
  - [ ] Create `tests/e2e/auth-layout.spec.ts`
  - [ ] Test login flow with redirect to dashboard
  - [ ] Test layout renders on authenticated pages
  - [ ] Test user dropdown works
  - [ ] Test logout redirects to login
  - [ ] Test navigation between authenticated pages
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run dev server: `npm run dev`
  - [ ] Verify no TypeScript errors: `npm run type-check`
  - [ ] Verify no linting issues: `npm run lint`
  - [ ] Test auth flow in browser
  - [ ] Test page navigation works
  - [ ] Check responsive design on mobile

**Status: Phase 3 Complete** ✅

---

## Phase 4: Database Schema & Migrations

### 4.1 Database Connection Setup

- [ ] Create `src/lib/server/db.ts`
  - [ ] Import PostgreSQL driver
  - [ ] Create connection pool
  - [ ] Configure pool size: 20
  - [ ] Test connection on startup
  - [ ] Export pool for use in routes

- [ ] Create `backend/src/db/connection.ts`
  - [ ] Setup PostgreSQL connection
  - [ ] Connection pool configuration
  - [ ] Test connection on startup

### 4.2 Database Schema Definition

- [ ] Create `backend/src/db/schema.ts` (using Drizzle ORM)
  - [ ] Define `buildings` table
    - [ ] id (uuid, primary key)
    - [ ] address, postal_code, city, country
    - [ ] latitude, longitude
    - [ ] building_name, building_type, year_built
    - [ ] created_at, updated_at

  - [ ] Define `apartments` table
    - [ ] id, building_id (foreign key)
    - [ ] address, floor, size_m2, room_count
    - [ ] occupancy_status
    - [ ] created_at, updated_at

  - [ ] Define `tenants` table
    - [ ] id
    - [ ] first_name, last_name, email, phone
    - [ ] address, postal_code, city
    - [ ] created_at, updated_at

  - [ ] Define `rental_contracts` table
    - [ ] id, apartment_id (FK), tenant_id (FK)
    - [ ] start_date, end_date (nullable)
    - [ ] base_rent, additional_rent
    - [ ] reference_index
    - [ ] monthly_advance_payment
    - [ ] agreed_utility_categories
    - [ ] contract_pdf (blob)
    - [ ] created_at, updated_at

  - [ ] Define `invoices` table
    - [ ] id, building_id (FK)
    - [ ] billing_entity_name, billing_entity_address
    - [ ] work_description
    - [ ] category_id (FK)
    - [ ] amount_chf
    - [ ] distribution_key_id (FK)
    - [ ] is_valid_utility_cost
    - [ ] invoice_date
    - [ ] created_at, updated_at

  - [ ] Define `categories` table
    - [ ] id
    - [ ] name
    - [ ] is_allowed_utility_cost
    - [ ] created_at, updated_at

  - [ ] Define `distribution_keys` table
    - [ ] id
    - [ ] name
    - [ ] formula (nullable, for custom keys)
    - [ ] created_at, updated_at

  - [ ] Define `heating_distribution_profiles` table
    - [ ] id
    - [ ] name
    - [ ] january_pct through december_pct (12 columns)
    - [ ] created_at, updated_at

  - [ ] Define `utility_statements` table
    - [ ] id, tenant_id (FK), rental_contract_id (FK), apartment_id (FK)
    - [ ] period_start, period_end
    - [ ] statement_number
    - [ ] statement_date
    - [ ] rental_days
    - [ ] total_costs
    - [ ] total_advance_payments
    - [ ] balance
    - [ ] status (open | paid)
    - [ ] payment_deadline
    - [ ] pdf_blob
    - [ ] created_at, updated_at

  - [ ] Define `utility_statement_line_items` table
    - [ ] id, utility_statement_id (FK)
    - [ ] category_id (FK)
    - [ ] distribution_key_id (FK)
    - [ ] amount
    - [ ] created_at

  - [ ] Define `configuration` table
    - [ ] id
    - [ ] key
    - [ ] value
    - [ ] created_at, updated_at

  - [ ] Define indexes for performance
    - [ ] Index on buildings.city
    - [ ] Index on apartments.building_id
    - [ ] Index on rental_contracts.apartment_id
    - [ ] Index on rental_contracts.tenant_id
    - [ ] Index on rental_contracts.end_date
    - [ ] Index on invoices.building_id
    - [ ] Index on invoices.invoice_date
    - [ ] Index on utility_statements.tenant_id
    - [ ] Index on utility_statements.period_start
    - [ ] Index on utility_statements.status
    - [ ] Composite index on utility_statements (tenant_id, period_start)

### 4.3 Database Migrations

- [ ] Create `migrations/001_initial_schema.sql`
  - [ ] Create all tables from schema
  - [ ] Create all indexes
  - [ ] Add constraints (foreign keys, unique, check)

- [ ] Create `migrations/002_initial_data.sql`
  - [ ] Insert predefined categories (heating, water, electricity, etc.)
  - [ ] Insert predefined distribution keys
  - [ ] Insert predefined heating profiles (Mittelland, Mountain, Tessin)
  - [ ] Insert default configuration values

### 4.4 Migration Tooling

- [ ] Setup Drizzle migration system
  - [ ] Create `backend/drizzle.config.ts`
  - [ ] Configure migration folder: `backend/migrations/`
  - [ ] Configure database connection

- [ ] Create migration scripts in `package.json`
  - [ ] `npm run migrate` - Run migrations
  - [ ] `npm run migrate:create` - Create new migration
  - [ ] `npm run migrate:rollback` - Rollback migration

### 4.5 Database Testing

- [ ] Unit tests for database connection
  - [ ] Connection pool creation (1 test)
  - [ ] Connection test on startup (1 test)

- [ ] Integration tests for schema
  - [ ] Create/read/update/delete for each table (8 tests)
  - [ ] Foreign key constraints (3 tests)
  - [ ] Index performance (2 tests)

### 4.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for Database Connection
  - [ ] Create `tests/unit/db.test.ts`
  - [ ] Test connection pool creation
  - [ ] Test connection string validation
  - [ ] Test error handling for connection failures
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for Migrations
  - [ ] Create `tests/integration/migrations.test.ts`
  - [ ] Test migration application (up)
  - [ ] Test migration rollback (down)
  - [ ] Test schema correctness after migration
  - [ ] Test indexes are created
  - [ ] Verify database state after each migration
  - [ ] All tests pass: `npm run test`

- [ ] Manual Testing
  - [ ] Run: `npm run test`
  - [ ] Verify all migrations apply successfully
  - [ ] Verify database schema matches specification
  - [ ] Check indexes exist: `\d+ table_name`
  - [ ] Verify constraint enforcement

**Status: Phase 4 Complete** ✅

---

## Phase 5: Backend - Core Entities (Building, Apartment, Tenant, Contract)

### 5.1 Building CRUD Routes

- [ ] Create `backend/src/routes/buildings.ts`
  - [ ] GET `/api/v1/buildings` (list with pagination)
    - [ ] Query params: search, limit, offset
    - [ ] Return: buildings list, total count
    - [ ] Add filters by city, postal code

  - [ ] POST `/api/v1/buildings` (create)
    - [ ] Validate input (address, postal_code, city, latitude, longitude)
    - [ ] Return: 201 created with building data

  - [ ] GET `/api/v1/buildings/:id` (fetch single)
    - [ ] Return: building data with apartments list
    - [ ] Include recent invoices and pending statements

  - [ ] PUT `/api/v1/buildings/:id` (update)
    - [ ] Validate updates
    - [ ] Return: 200 with updated data

  - [ ] DELETE `/api/v1/buildings/:id` (delete)
    - [ ] Check for dependent data (apartments, contracts)
    - [ ] Allow deletion only if no dependent data
    - [ ] Return: 204 no content or 400 conflict

### 5.2 Apartment CRUD Routes

- [ ] Create `backend/src/routes/apartments.ts`
  - [ ] GET `/api/v1/apartments` (list with filtering)
    - [ ] Query params: building_id, floor, occupancy_status
    - [ ] Return: apartments list

  - [ ] POST `/api/v1/apartments` (create)
    - [ ] Validate: building_id exists, floor, size_m2, room_count
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/apartments/:id` (fetch single)
    - [ ] Return: apartment data with current tenant and contract

  - [ ] PUT `/api/v1/apartments/:id` (update)
    - [ ] Validate updates
    - [ ] Return: 200

  - [ ] DELETE `/api/v1/apartments/:id` (delete)
    - [ ] Check for active contracts
    - [ ] Return: 204 or 400 conflict

### 5.3 Tenant CRUD Routes

- [ ] Create `backend/src/routes/tenants.ts`
  - [ ] GET `/api/v1/tenants` (list)
    - [ ] Return: tenants list with current occupancy

  - [ ] POST `/api/v1/tenants` (create)
    - [ ] Validate: email format, required fields
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/tenants/:id` (fetch single)
    - [ ] Return: tenant data with contract history

  - [ ] PUT `/api/v1/tenants/:id` (update)
    - [ ] Validate updates
    - [ ] Return: 200

  - [ ] DELETE `/api/v1/tenants/:id` (delete)
    - [ ] Check for active contracts
    - [ ] Return: 204 or 400 conflict

### 5.4 Rental Contract CRUD Routes

- [ ] Create `backend/src/routes/contracts.ts`
  - [ ] GET `/api/v1/contracts` (list)
    - [ ] Query params: apartment_id, tenant_id, status (active|ended)
    - [ ] Return: contracts list with tenant and apartment info

  - [ ] POST `/api/v1/contracts` (create)
    - [ ] Validate: apartment_id, tenant_id, start_date, end_date
    - [ ] Validate: base_rent, additional_rent amounts
    - [ ] Check for overlapping contracts
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/contracts/:id` (fetch single)
    - [ ] Return: contract details with tenant and apartment

  - [ ] PUT `/api/v1/contracts/:id` (update)
    - [ ] Allow updating end_date, rent amounts
    - [ ] Validate date ranges
    - [ ] Return: 200

  - [ ] DELETE `/api/v1/contracts/:id` (delete)
    - [ ] Check for associated statements
    - [ ] Return: 204 or 400 conflict

### 5.5 Business Logic Services

- [ ] Create `backend/src/services/building.service.ts`
  - [ ] `createBuilding(data)` - With validation
  - [ ] `getBuilding(id)` - With relations
  - [ ] `updateBuilding(id, data)` - With validation
  - [ ] `deleteBuilding(id)` - With dependency check
  - [ ] `listBuildings(filters)` - With pagination

- [ ] Create `backend/src/services/apartment.service.ts`
  - [ ] Similar CRUD operations
  - [ ] `getApartmentOccupancy(id)` - Current occupancy info

- [ ] Create `backend/src/services/tenant.service.ts`
  - [ ] Similar CRUD operations
  - [ ] `getTenantContractHistory(id)` - All contracts

- [ ] Create `backend/src/services/contract.service.ts`
  - [ ] Similar CRUD operations
  - [ ] `validateContractOverlap(apartment_id, start_date, end_date)` - Check conflicts
  - [ ] `getActiveContract(apartment_id, date)` - Get contract at specific date
  - [ ] `getContractsByPeriod(apartment_id, start, end)` - Get all contracts in period

### 5.6 Validation Schemas

- [ ] Create `src/lib/schemas/building.ts` (Zod schemas)
  - [ ] `CreateBuildingSchema`
  - [ ] `UpdateBuildingSchema`
  - [ ] `BuildingQuerySchema`

- [ ] Create `src/lib/schemas/apartment.ts`
  - [ ] `CreateApartmentSchema`
  - [ ] `UpdateApartmentSchema`

- [ ] Create `src/lib/schemas/tenant.ts`
  - [ ] `CreateTenantSchema`
  - [ ] `UpdateTenantSchema`

- [ ] Create `src/lib/schemas/contract.ts`
  - [ ] `CreateContractSchema`
  - [ ] `UpdateContractSchema`

### 5.7 Backend Testing

- [ ] Unit tests for building service (8 tests)
  - [ ] Create, read, update, delete (4)
  - [ ] Validation (2)
  - [ ] List with pagination (2)

- [ ] Unit tests for apartment service (8 tests)
- [ ] Unit tests for tenant service (8 tests)
- [ ] Unit tests for contract service (10 tests)
  - [ ] Overlap detection (4)
  - [ ] Date range validation (3)

- [ ] Integration tests for routes (40+ tests)
  - [ ] Buildings CRUD (10)
  - [ ] Apartments CRUD (10)
  - [ ] Tenants CRUD (10)
  - [ ] Contracts CRUD (10)

### 5.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for All Services
  - [ ] Test all business logic with valid/invalid inputs
  - [ ] Test validation rules and constraints
  - [ ] Test error handling and edge cases
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for All Routes
  - [ ] Test all CRUD operations (create, read, update, delete)
  - [ ] Test pagination and filtering
  - [ ] Test authorization checks
  - [ ] Test validation errors return 400
  - [ ] Test authentication errors return 401
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Frontend Integration
  - [ ] Test frontend can create/read/update/delete items
  - [ ] Test data persists correctly
  - [ ] Test error messages display properly
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Verify TypeScript: `npm run type-check`
  - [ ] Verify linting: `npm run lint`
  - [ ] Test in browser with dev server
  - [ ] Verify no console errors

**Status: Phase 5 Complete** ✅

---

## Phase 6: Backend - Invoices & LLM Integration

### 6.1 Invoice CRUD Routes

- [ ] Create `backend/src/routes/invoices.ts`
  - [ ] GET `/api/v1/invoices` (list with filters)
    - [ ] Query params: building_id, category_id, date_from, date_to
    - [ ] Return: invoices list with category and distribution key info

  - [ ] POST `/api/v1/invoices` (create)
    - [ ] Validate: building_id, billing_entity, amount
    - [ ] Call LLM for auto-categorization (async)
    - [ ] Return: 201 created with categorization

  - [ ] GET `/api/v1/invoices/:id` (fetch single)
    - [ ] Return: invoice details with category and distribution key

  - [ ] PUT `/api/v1/invoices/:id` (update)
    - [ ] Allow: category override, distribution key change
    - [ ] Log category override
    - [ ] Return: 200

  - [ ] DELETE `/api/v1/invoices/:id` (delete)
    - [ ] Check for inclusion in statements
    - [ ] Return: 204 or 400 conflict

### 6.2 Category Management Routes

- [ ] Create `backend/src/routes/categories.ts`
  - [ ] GET `/api/v1/categories` (list all)
    - [ ] Return: categories with is_allowed_utility_cost flag

  - [ ] POST `/api/v1/categories` (create custom)
    - [ ] Validate: category name unique
    - [ ] Validate: is_allowed_utility_cost (Swiss compliance)
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/categories/:id` (fetch single)
  - [ ] PUT `/api/v1/categories/:id` (update)
  - [ ] DELETE `/api/v1/categories/:id` (delete)
    - [ ] Check for invoices using this category
    - [ ] Return: 204 or 400 conflict

### 6.3 LLM Integration

- [ ] Create `backend/src/services/llm.service.ts`
  - [ ] `categorizeInvoice(invoiceData)` function
    - [ ] Send to Ollama endpoint
    - [ ] Parse response
    - [ ] Return category with confidence score
    - [ ] Cache results to avoid duplicate calls

  - [ ] `validateCategory(category, rules)` function
    - [ ] Check if category allowed per Swiss law
    - [ ] Return validation result

  - [ ] Error handling
    - [ ] Handle Ollama connection errors
    - [ ] Fallback to manual categorization

- [ ] Create `backend/src/config/llm.ts`
  - [ ] Ollama configuration
  - [ ] Model selection (Mistral, Llama)
  - [ ] Prompt templates for categorization
  - [ ] Cache configuration

### 6.4 Invoice Service

- [ ] Create `backend/src/services/invoice.service.ts`
  - [ ] `createInvoice(data)` - Create with LLM categorization
  - [ ] `updateInvoice(id, data)` - Update, log overrides
  - [ ] `deleteInvoice(id)` - Delete with checks
  - [ ] `listInvoices(filters)` - List with pagination
  - [ ] `categorizeInvoice(id)` - Manually re-categorize
  - [ ] `validateInvoiceForUtilityStatement(invoice)` - Check compliance

### 6.5 Swiss Utility Cost Validation

- [ ] Create `backend/src/services/utility-validation.service.ts`
  - [ ] `isAllowedUtilityCost(category)` function
    - [ ] Define allowed categories (heating, water, electricity, etc.)
    - [ ] Return boolean

  - [ ] `getUtilityCostRules()` function
    - [ ] Return Swiss legal compliance rules
    - [ ] Include management fee limits (3% max)

- [ ] Define allowed/disallowed costs per Swiss law
  - [ ] Allowed: heating, water, electricity, maintenance, disposal
  - [ ] Not allowed: repairs, taxes, insurance, connection fees

### 6.6 Validation Schemas

- [ ] Create `src/lib/schemas/invoice.ts`
  - [ ] `CreateInvoiceSchema`
  - [ ] `UpdateInvoiceSchema`
  - [ ] `InvoiceQuerySchema`

- [ ] Create `src/lib/schemas/category.ts`
  - [ ] `CreateCategorySchema`
  - [ ] `UpdateCategorySchema`

### 6.7 Testing Invoices & LLM

- [ ] Unit tests for invoice service (10 tests)
  - [ ] Create, read, update, delete (4)
  - [ ] LLM categorization call (2)
  - [ ] Category override logging (2)
  - [ ] Validation (2)

- [ ] Unit tests for LLM service (8 tests)
  - [ ] Ollama categorization (2)
  - [ ] Error handling (2)
  - [ ] Caching (2)
  - [ ] Response parsing (2)

- [ ] Unit tests for utility validation (6 tests)
  - [ ] Allowed/disallowed categories (4)
  - [ ] Management fee limits (2)

- [ ] Integration tests for invoice routes (15+ tests)
  - [ ] Invoice CRUD (10)
  - [ ] LLM categorization (3)
  - [ ] Category management (2)

- [ ] Integration tests with mocked Ollama (5 tests)

### 6.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for Invoice Service
  - [ ] Test invoice CRUD operations
  - [ ] Test Swiss cost validation
  - [ ] Test cost categorization
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Unit Tests for LLM Integration
  - [ ] Test LLM service with mocked Ollama
  - [ ] Test categorization accuracy
  - [ ] Test fallback handling
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for Invoice Routes
  - [ ] Test invoice CRUD endpoints
  - [ ] Test automatic categorization
  - [ ] Test manual override
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Invoice Workflow
  - [ ] Test creating invoice and categorization
  - [ ] Test editing invoice
  - [ ] Test LLM suggestions appear
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Verify Ollama connectivity (if enabled)
  - [ ] Test in browser with dev server

**Status: Phase 6 Complete** ✅

---

## Phase 7: Backend - Distribution Keys

### 7.1 Distribution Key Management Routes

- [ ] Create `backend/src/routes/distribution-keys.ts`
  - [ ] GET `/api/v1/distribution-keys` (list all)
    - [ ] Return: predefined + custom keys

  - [ ] POST `/api/v1/distribution-keys` (create custom)
    - [ ] Validate formula syntax (if custom)
    - [ ] Test formula with sample values
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/distribution-keys/:id` (fetch single)
  - [ ] PUT `/api/v1/distribution-keys/:id` (update)
    - [ ] Allow updating formula and name
    - [ ] Re-test formula validation

  - [ ] DELETE `/api/v1/distribution-keys/:id` (delete)
    - [ ] Only allow if no invoices use this key
    - [ ] Return: 204 or 400 conflict

### 7.2 Distribution Key Service

- [ ] Create `backend/src/services/distribution-key.service.ts`
  - [ ] `getDistributionKeys()` - Get all (predefined + custom)
  - [ ] `createDistributionKey(data)` - Create custom key
  - [ ] `updateDistributionKey(id, data)` - Update key
  - [ ] `deleteDistributionKey(id)` - Delete key
  - [ ] `validateFormula(formula, variables)` - Test formula syntax
  - [ ] `calculateDistribution(key, apartments, totalAmount)` - Calculate amounts

### 7.3 Formula Parsing & Calculation

- [ ] Create `backend/src/services/formula.service.ts`
  - [ ] `parseFormula(formula)` function
    - [ ] Parse formula with variables: {area}, {rooms}, {volume}, {units}
    - [ ] Validate syntax
    - [ ] Return parsed formula or error

  - [ ] `evaluateFormula(formula, variables)` function
    - [ ] Replace variables with values
    - [ ] Evaluate expression
    - [ ] Return result or error

  - [ ] `testFormula(formula, testData)` function
    - [ ] Run formula against test cases
    - [ ] Return results and validation

### 7.4 Predefined Distribution Keys

- [ ] Create default distribution keys
  - [ ] "Heating Costs" (per unit)
  - [ ] "Per Unit" (by apartment count)
  - [ ] "Per Area" (by square meters)
  - [ ] Stored in database on initialization

### 7.5 Validation Schemas

- [ ] Create `src/lib/schemas/distribution-key.ts`
  - [ ] `CreateDistributionKeySchema`
  - [ ] `UpdateDistributionKeySchema`
  - [ ] `FormulaValidationSchema`

### 7.6 Testing Distribution Keys

- [ ] Unit tests for distribution key service (12 tests)
  - [ ] Create, read, update, delete (4)
  - [ ] Formula validation (4)
  - [ ] Formula evaluation (2)
  - [ ] Distribution calculation (2)

- [ ] Unit tests for formula service (10 tests)
  - [ ] Formula parsing (3)
  - [ ] Variable substitution (2)
  - [ ] Expression evaluation (3)
  - [ ] Error handling (2)

- [ ] Integration tests for routes (10+ tests)
  - [ ] Distribution key CRUD (8)
  - [ ] Formula testing endpoint (2)

### 7.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for Distribution Key Service
  - [ ] Test formula validation and parsing
  - [ ] Test variable substitution
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for Routes
  - [ ] Test CRUD operations
  - [ ] Test formula evaluation
  - [ ] All tests pass: `npm run test`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test formula editor in browser

**Status: Phase 7 Complete** ✅

---

## Phase 8: Backend - Statements & Prorating Logic

### 8.1 Heating Distribution Profiles

- [ ] Create `backend/src/routes/heating-profiles.ts`
  - [ ] GET `/api/v1/heating-profiles` (list all)
    - [ ] Return: predefined + custom profiles

  - [ ] POST `/api/v1/heating-profiles` (create custom)
    - [ ] Validate: 12 monthly percentages sum to ~100%
    - [ ] Return: 201 created

  - [ ] GET `/api/v1/heating-profiles/:id` (fetch single)
  - [ ] PUT `/api/v1/heating-profiles/:id` (update)
  - [ ] DELETE `/api/v1/heating-profiles/:id` (delete)
    - [ ] Check usage in configuration
    - [ ] Return: 204 or 400

### 8.2 Heating Profile Service

- [ ] Create `backend/src/services/heating-profile.service.ts`
  - [ ] Predefined profiles:
    - [ ] "Heating + Hot Water" (standard distribution)
    - [ ] "Mittelland" (plateau region)
    - [ ] "Mountain Region"
    - [ ] "Tessin" (south region)

  - [ ] `getHeatingProfile(id)` - Fetch profile
  - [ ] `createHeatingProfile(data)` - Create custom
  - [ ] `validatePercentages(profile)` - Verify percentages
  - [ ] `getMonthlyPercentage(profile, month)` - Get percentage for month

### 8.3 Configuration Routes

- [ ] Create `backend/src/routes/config.ts`
  - [ ] GET `/api/v1/config` (read configuration)
    - [ ] Return: accounting_period, management_fee_pct, default_heating_profile, etc.

  - [ ] PUT `/api/v1/config` (update configuration)
    - [ ] Validate: accounting_period (july-june | november-october | calendar)
    - [ ] Validate: management_fee_pct (0-3)
    - [ ] Validate: heating_profile_id exists
    - [ ] Return: 200

### 8.4 Statement Generation Core

- [ ] Create `backend/src/services/statement.service.ts`
  - [ ] `generateStatements(buildingId, period)` function
    - [ ] Find all apartments with tenants in period
    - [ ] Find all contracts for each apartment in period
    - [ ] For each (apartment, contract) pair, create statement
    - [ ] Calculate prorated amounts
    - [ ] Call calculation service

  - [ ] `createStatement(data)` - Create single statement
  - [ ] `updateStatement(id, data)` - Update status/payment info
  - [ ] `deleteStatement(id)` - Delete statement
  - [ ] `listStatements(filters)` - List with filtering

### 8.5 Prorating Calculations (Complex Logic)

- [ ] Create `backend/src/services/prorating.service.ts`
  - [ ] `calculateProrationDays(startDate, endDate, periodStart, periodEnd)` function
    - [ ] Calculate days tenant occupied apartment during period
    - [ ] Handle: full period, partial period, multiple contracts

  - [ ] `prorateCosts(totalAmount, proratingDays, totalDays)` function
    - [ ] Calculate prorated amount
    - [ ] Return: prorated_amount

  - [ ] `handleMultipleContracts(apartment, period)` function
    - [ ] Find all contracts for apartment in period
    - [ ] Calculate days for each contract
    - [ ] Prorate costs across all contracts
    - [ ] Return: array of (contract, prorated_days, prorated_costs)

  - [ ] `handleMidYearMoves(contract, heatingProfile, totalCosts)` function
    - [ ] Get heating profile monthly percentages
    - [ ] Get months tenant occupied
    - [ ] Sum percentages for those months
    - [ ] Apply to total costs
    - [ ] Return: prorated_heating_cost

  - [ ] `handleVacancy(apartment, startDate, endDate, invoices)` function
    - [ ] Track vacancy periods
    - [ ] Calculate vacancy costs separately
    - [ ] Return: vacancy_cost

### 8.6 Statement Calculation Engine

- [ ] Create `backend/src/services/calculation.service.ts`
  - [ ] `calculateStatementForContract(contract, period, config)` function
    - [ ] Get all invoices for building in period
    - [ ] Group invoices by category
    - [ ] For each category, apply distribution key
    - [ ] Calculate tenant's share
    - [ ] Prorate if needed (multiple contracts, mid-year move)
    - [ ] Apply management fee
    - [ ] Return: line items with costs

  - [ ] `calculateManagementFee(totalCosts, feePercentage)` function
    - [ ] Calculate management fee
    - [ ] Validate not exceeding 3% per Swiss law
    - [ ] Return: fee_amount

  - [ ] `calculateTotalForStatement(lineItems)` function
    - [ ] Sum all line item costs
    - [ ] Add management fee
    - [ ] Return: total_cost

  - [ ] `calculateBalance(totalCost, totalAdvancePaid)` function
    - [ ] Calculate final balance
    - [ ] Positive: tenant owes money (refund needed)
    - [ ] Negative: tenant overpaid (credit)
    - [ ] Return: balance

### 8.7 Statement PDF Data Preparation

- [ ] Create `backend/src/services/statement-pdf.service.ts`
  - [ ] `prepareStatementForPDF(statement)` function
    - [ ] Get statement data
    - [ ] Get tenant info
    - [ ] Get apartment info
    - [ ] Get line items
    - [ ] Format all for PDF rendering
    - [ ] Return: PDF-ready data object

  - [ ] `formatCurrencyForDisplay(amount)` function
    - [ ] Format CHF with 2 decimals

  - [ ] `formatDateForDisplay(date, language)` function
    - [ ] Format date per language (de, fr, it, rm, en)

### 8.8 Validation Schemas

- [ ] Create `src/lib/schemas/statement.ts`
  - [ ] `GenerateStatementsSchema`
  - [ ] `UpdateStatementSchema`
  - [ ] `StatementQuerySchema`

- [ ] Create `src/lib/schemas/config.ts`
  - [ ] `UpdateConfigSchema`
  - [ ] `HeatingProfileSchema`

### 8.9 Testing Statements & Prorating

- [ ] Unit tests for prorating service (20 tests)
  - [ ] Proration days calculation (4)
  - [ ] Cost prorating (4)
  - [ ] Multiple contracts (4)
  - [ ] Mid-year moves (4)
  - [ ] Vacancy handling (2)
  - [ ] Edge cases (2)

- [ ] Unit tests for calculation service (16 tests)
  - [ ] Distribution key application (4)
  - [ ] Management fee calculation (3)
  - [ ] Total calculation (2)
  - [ ] Balance calculation (2)
  - [ ] Swiss law compliance (3)
  - [ ] Edge cases (2)

- [ ] Unit tests for statement service (10 tests)
  - [ ] Statement generation (3)
  - [ ] Statement CRUD (4)
  - [ ] Status workflow (3)

- [ ] Integration tests for statement generation (20+ tests)
  - [ ] Full statement generation flow (5)
  - [ ] Multiple contracts in period (3)
  - [ ] Mid-year moves (3)
  - [ ] Vacancy periods (2)
  - [ ] Management fee calculations (2)
  - [ ] Swiss compliance validation (3)
  - [ ] Edge cases (2)

### 8.10 Test Data & Scenarios

- [ ] Create comprehensive test scenarios
  - [ ] Scenario 1: Single tenant, single contract, full year
  - [ ] Scenario 2: Multiple contracts in same period
  - [ ] Scenario 3: Mid-year move with heating proration
  - [ ] Scenario 4: Vacancy periods
  - [ ] Scenario 5: Multiple buildings, mixed scenarios
  - [ ] Verify each scenario produces correct results

### 8.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for Prorating Logic
  - [ ] Test each prorating scenario
  - [ ] Test edge cases (single day, full year, no tenants)
  - [ ] Target >85% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for Statement Routes
  - [ ] Test statement generation
  - [ ] Test multiple scenarios
  - [ ] All tests pass: `npm run test`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Verify calculations manually for test cases

**Status: Phase 8 Complete** ✅

---

## Phase 9: PDF & QR Bill Generation

### 9.1 PDF Generation Service

- [ ] Create `backend/src/services/pdf.service.ts`
  - [ ] `generateStatementPDF(statementData, language)` function
    - [ ] Use PDFKit or similar
    - [ ] Generate professional statement document
    - [ ] Include header (company, period)
    - [ ] Include tenant info
    - [ ] Include apartment details
    - [ ] Include cost breakdown by category
    - [ ] Include total calculations
    - [ ] Include payment details and deadline
    - [ ] Return: PDF buffer or stream

  - [ ] `generateQRBill(statementData)` function
    - [ ] Generate Swiss QR-bill section
    - [ ] Include ISO 20022 compliant QR code
    - [ ] Include IBAN, creditor, amount
    - [ ] Include reference number
    - [ ] Return: QR-bill as image/PDF section

### 9.2 Swiss QR-Bill Implementation

- [ ] Create `backend/src/services/qr-bill.service.ts`
  - [ ] `generateQRData(statement, config)` function
    - [ ] Create QR-bill data structure per ISO 20022
    - [ ] Include: version, amount, currency, creditor, debtor
    - [ ] Include: IBAN, reference number
    - [ ] Include: structured data format

  - [ ] `encodeQRCode(qrData)` function
    - [ ] Encode QR data to image
    - [ ] Use QR code library
    - [ ] Return: QR code image

  - [ ] `validateIBAN(iban)` function
    - [ ] Validate Swiss IBAN format
    - [ ] Return: valid/invalid

### 9.3 Multi-Language PDF Templates

- [ ] Create language-specific templates
  - [ ] German template (de)
  - [ ] French template (fr)
  - [ ] Italian template (it)
  - [ ] Romansh template (rm)
  - [ ] English template (en)

- [ ] Each template includes
  - [ ] Translated labels
  - [ ] Translated descriptions
  - [ ] Correct date/currency formatting

### 9.4 PDF Storage

- [ ] Create `backend/src/routes/statements.ts` (update)
  - [ ] POST `/api/v1/statements/:id/generate-pdf` (generate and store)
    - [ ] Call PDF generation service
    - [ ] Store PDF blob in database
    - [ ] Store generation timestamp
    - [ ] Return: { success: true, pdf_url: "..." }

  - [ ] GET `/api/v1/statements/:id/pdf` (download)
    - [ ] Get PDF from database
    - [ ] Set content-type: application/pdf
    - [ ] Return: PDF file

### 9.5 Async PDF Generation

- [ ] Create background job for PDF generation
  - [ ] Generate PDFs asynchronously
  - [ ] Don't block statement creation
  - [ ] Queue system for multiple PDFs
  - [ ] Job status tracking

### 9.6 Testing PDF & QR

- [ ] Unit tests for PDF service (8 tests)
  - [ ] PDF generation (2)
  - [ ] QR code generation (2)
  - [ ] Language templates (2)
  - [ ] Error handling (2)

- [ ] Unit tests for QR-bill service (6 tests)
  - [ ] QR data generation (2)
  - [ ] IBAN validation (2)
  - [ ] ISO 20022 compliance (2)

- [ ] Integration tests (8 tests)
  - [ ] PDF generation and storage (2)
  - [ ] PDF retrieval (2)
  - [ ] QR-bill in PDF (2)
  - [ ] Multi-language rendering (2)

- [ ] Manual visual verification
  - [ ] Generate PDFs for all languages
  - [ ] Verify formatting
  - [ ] Verify QR code readability
  - [ ] Verify all data accurate

### 9.X Verification: Unit Tests & E2E Tests

- [ ] Unit Tests for PDF Generation
  - [ ] Test PDF creation with valid data
  - [ ] Test multi-language support
  - [ ] Test QR-bill generation
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] Integration Tests for PDF Routes
  - [ ] Test PDF generation endpoint
  - [ ] Test PDF retrieval and storage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for PDF Workflow
  - [ ] Test generating and downloading PDFs
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Generate PDFs for all scenarios
  - [ ] Verify QR codes scan correctly

**Status: Phase 9 Complete** ✅

---

## Phase 10: Frontend - Core Management Pages

### 10.1 Building Pages

- [ ] Create `src/routes/buildings/+page.svelte` (list view)
  - [ ] Display buildings in table or cards
  - [ ] Show: address, city, apartment count
  - [ ] Add search/filter by city
  - [ ] Add "Create Building" button
  - [ ] Link to building details
  - [ ] Add loading and error states

- [ ] Create `src/routes/buildings/[id]/+page.svelte` (detail view)
  - [ ] Display building details
  - [ ] Display apartments list
  - [ ] Display recent invoices
  - [ ] Add "Edit" button
  - [ ] Add "Delete" button (with confirmation)
  - [ ] Add "Add Apartment" button

- [ ] Create `src/routes/buildings/new/+page.svelte` (create form)
  - [ ] Form with fields: address, postal code, city
  - [ ] Integrate OpenPLZ for address search
  - [ ] Auto-populate latitude/longitude
  - [ ] Add optional fields: building_name, building_type, year_built
  - [ ] Add "Create" and "Cancel" buttons
  - [ ] Validation and error display

- [ ] Create `src/routes/buildings/[id]/edit/+page.svelte` (edit form)
  - [ ] Pre-fill form with current data
  - [ ] Allow editing all fields
  - [ ] Add "Save" and "Cancel" buttons

### 10.2 Apartment Pages

- [ ] Create `src/routes/apartments/+page.svelte` (list view)
  - [ ] Display apartments in table
  - [ ] Filter by building
  - [ ] Show: building, floor, size, room count, occupancy
  - [ ] Add "Create Apartment" button
  - [ ] Link to apartment details

- [x] Create `src/routes/apartments/[id]/+page.svelte` (detail view)
  - [x] Display apartment details
  - [x] Display current tenant (if occupied)
  - [x] Display current contract
  - [x] Display contract history
  - [x] Add buttons: Edit, Delete, View Tenant
  **Note:** Implemented based on design mock. Created reusable components:
  - `src/lib/components/Icon.svelte` - Material Symbols wrapper
  - `src/lib/components/StatusBadge.svelte` - AKTIV/Beendet badges
  - `src/lib/components/Button.svelte` - Primary/secondary/icon buttons
  - `src/lib/components/Card.svelte` - Base card component
  - `src/lib/components/InfoCard.svelte` - Icon + label + value cards
  - `src/lib/components/TabNavigation.svelte` - Tab navigation with icons
  - `src/lib/components/ApartmentHeader.svelte` - Breadcrumb + title + actions
  - `src/lib/components/CurrentTenantCard.svelte` - Tenant info with avatar
  - `src/lib/components/MonthlyCostsCard.svelte` - Cost breakdown card
  - `src/lib/components/ContractHistoryTable.svelte` - Contract history table
  - `src/lib/types.ts` - TypeScript type definitions
  - `src/lib/schemas.ts` - Zod validation schemas
  - `src/routes/apartments/[id]/+page.server.ts` - Server load with mock data
  - Updated `tailwind.config.js` with design system colors
  - Updated `src/styles/globals.css` with Manrope font
  - Created `src/app.html` (was missing)

- [ ] Create `src/routes/apartments/new/+page.svelte` (create form)
  - [ ] Form with: building_id (dropdown), floor, size_m2, room_count
  - [ ] Add "Create" and "Cancel" buttons

- [ ] Create `src/routes/apartments/[id]/edit/+page.svelte` (edit form)

### 10.3 Tenant Pages

- [ ] Create `src/routes/tenants/+page.svelte` (list view)
  - [ ] Display tenants in table
  - [ ] Show: name, email, phone, current occupancy
  - [ ] Add "Create Tenant" button
  - [ ] Link to tenant details

- [ ] Create `src/routes/tenants/[id]/+page.svelte` (detail view)
  - [ ] Display tenant info
  - [ ] Display current apartment and contract
  - [ ] Display contract history
  - [ ] Add buttons: Edit, Delete

- [ ] Create `src/routes/tenants/new/+page.svelte` (create form)
  - [ ] Form with: first_name, last_name, email, phone, address

- [ ] Create `src/routes/tenants/[id]/edit/+page.svelte` (edit form)

### 10.4 Contract Pages

- [ ] Create `src/routes/contracts/+page.svelte` (list view)
  - [ ] Display contracts in table
  - [ ] Filter by building, apartment, status (active/ended)
  - [ ] Show: apartment, tenant, start_date, end_date, base_rent
  - [ ] Add "Create Contract" button
  - [ ] Link to contract details

- [ ] Create `src/routes/contracts/[id]/+page.svelte` (detail view)
  - [ ] Display full contract info
  - [ ] Display apartment and tenant
  - [ ] Display rent details
  - [ ] Show PDF upload area or link
  - [ ] Add buttons: Edit, Delete, Download PDF

- [ ] Create `src/routes/contracts/new/+page.svelte` (create form)
  - [ ] Form with: apartment_id, tenant_id, start_date, end_date
  - [ ] Form with: base_rent, additional_rent breakdown
  - [ ] Add checkboxes for agreed utility categories
  - [ ] File upload for contract PDF

- [ ] Create `src/routes/contracts/[id]/edit/+page.svelte` (edit form)

### 10.5 Shared Components

- [ ] Create `src/lib/components/Form.svelte`
  - [ ] Reusable form wrapper with validation display

- [ ] Create `src/lib/components/Input.svelte`
  - [ ] Text input component with label and error

- [ ] Create `src/lib/components/Select.svelte`
  - [ ] Dropdown select component

- [ ] Create `src/lib/components/DataTable.svelte`
  - [ ] Reusable table component with sorting/filtering

- [ ] Create `src/lib/components/Modal.svelte`
  - [ ] Reusable modal for confirmations

- [ ] Create `src/lib/components/Loading.svelte`
  - [ ] Loading spinner component

- [ ] Create `src/lib/components/Error.svelte`
  - [ ] Error message display component

### 10.6 OpenPLZ Integration

- [ ] Create `src/lib/services/openplz.ts`
  - [ ] `searchAddress(query)` function
    - [ ] Call OpenPLZ API
    - [ ] Handle errors gracefully
    - [ ] Return: address suggestions

  - [ ] `getAddressDetails(address)` function
    - [ ] Get full address info including coordinates
    - [ ] Return: complete address object

### 10.7 Testing Frontend Pages

- [ ] Unit tests for API calls (8 tests)
  - [ ] Building list fetch (1)
  - [ ] Building create (1)
  - [ ] Apartment list fetch (1)
  - [ ] Apartment create (1)
  - [ ] Tenant list fetch (1)
  - [ ] Tenant create (1)
  - [ ] Contract list fetch (1)
  - [ ] Contract create (1)

- [ ] E2E tests for user flows (10+ tests)
  - [ ] Create building flow (1)
  - [ ] Edit building flow (1)
  - [ ] Create apartment flow (1)
  - [ ] Create tenant flow (1)
  - [ ] Create contract flow (1)
  - [ ] View building details (1)
  - [ ] Search buildings (1)
  - [ ] Filter apartments (1)
  - [ ] Delete building (with confirmation) (1)
  - [ ] Contract history view (1)

### 10.X Verification: Unit Tests & E2E Tests

- [ ] Component Tests
  - [ ] Test all pages render correctly
  - [ ] Test form submissions
  - [ ] Test validation messages
  - [ ] Target >80% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Management Workflows
  - [ ] Test building CRUD workflows
  - [ ] Test apartment management workflows
  - [ ] Test tenant management workflows
  - [ ] Test contract management workflows
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test UI/UX in browser
  - [ ] Test responsive design

**Status: Phase 10 Complete** ✅

---

## Phase 11: Frontend - Invoice Management

### 11.1 Invoice List Page

- [ ] Create `src/routes/invoices/+page.svelte`
  - [ ] Display invoices in table
  - [ ] Columns: date, entity, category, amount, validity, distribution key
  - [ ] Filters: building, category, date range, validity
  - [ ] Add "Create Invoice" button
  - [ ] Link to invoice details
  - [ ] Show categorization status (pending, auto-categorized, manual)

### 11.2 Invoice Create/Edit Pages

- [ ] Create `src/routes/invoices/new/+page.svelte`
  - [ ] Form with: building_id, billing_entity, work_description, amount
  - [ ] Show LLM categorization in progress
  - [ ] Display suggested category with confidence
  - [ ] Allow override of category
  - [ ] Select distribution key
  - [ ] Auto-check "is_valid_utility_cost" based on category
  - [ ] Add "Create" and "Cancel" buttons

- [ ] Create `src/routes/invoices/[id]/+page.svelte` (detail view)
  - [ ] Display invoice info
  - [ ] Show category and confidence
  - [ ] Show distribution key
  - [ ] Show validity flag
  - [ ] Add buttons: Edit, Delete, Re-categorize

- [ ] Create `src/routes/invoices/[id]/edit/+page.svelte`
  - [ ] Pre-fill form
  - [ ] Allow category override
  - [ ] Log override reason (optional)

### 11.3 Category Management Page

- [ ] Create `src/routes/config/categories/+page.svelte`
  - [ ] Display all categories in table
  - [ ] Columns: name, is_allowed_utility_cost, usage_count
  - [ ] Filter: show only allowed or only disallowed
  - [ ] Add "Create Category" button
  - [ ] Link to category details or inline edit

- [ ] Create `src/routes/config/categories/new/+page.svelte`
  - [ ] Form with: category name, is_allowed_utility_cost checkbox
  - [ ] Explain Swiss law rules
  - [ ] Add "Create" and "Cancel" buttons

### 11.4 LLM Categorization UI

- [ ] Create `src/lib/components/InvoiceCategorization.svelte`
  - [ ] Show loading state while LLM processes
  - [ ] Display suggested category
  - [ ] Show confidence score
  - [ ] Allow manual override
  - [ ] Show reason for override (if applicable)

- [ ] Create `src/lib/components/CategoryBadge.svelte`
  - [ ] Show category name with color coding
  - [ ] Show validity indicator (allowed/not allowed)

### 11.5 Testing Invoice Pages

- [ ] Unit tests for invoice API calls (6 tests)
  - [ ] Invoice list fetch (1)
  - [ ] Invoice create (1)
  - [ ] Invoice update (1)
  - [ ] Invoice delete (1)
  - [ ] Category list fetch (1)
  - [ ] Category create (1)

- [ ] E2E tests for invoice flows (8+ tests)
  - [ ] Create invoice with LLM categorization (1)
  - [ ] Override category (1)
  - [ ] Edit invoice (1)
  - [ ] Delete invoice (1)
  - [ ] Create custom category (1)
  - [ ] Filter invoices (1)
  - [ ] View invoice details (1)
  - [ ] Re-categorize invoice (1)

### 11.X Verification: Unit Tests & E2E Tests

- [ ] Component Tests for Invoice Pages
  - [ ] Test form validation
  - [ ] Test API integration
  - [ ] Target >75% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Invoice Workflows
  - [ ] Test create, read, update, delete workflows
  - [ ] Test LLM categorization display
  - [ ] Test filtering and sorting
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test in browser with dev server

**Status: Phase 11 Complete** ✅

---

## Phase 12: Frontend - Configuration Pages

### 12.1 Global Configuration Page

- [ ] Create `src/routes/config/+page.svelte`
  - [ ] Display current configuration
  - [ ] Editable form with: accounting_period, management_fee_pct, default_heating_profile
  - [ ] Show validation rules (management_fee_pct 0-3%)
  - [ ] Add "Save" button

### 12.2 Heating Profile Pages

- [ ] Create `src/routes/config/heating-profiles/+page.svelte`
  - [ ] Display all heating profiles (predefined + custom)
  - [ ] Show monthly percentages
  - [ ] Show total percentage (should be ~100%)
  - [ ] Add "Create Custom Profile" button

- [ ] Create `src/routes/config/heating-profiles/new/+page.svelte`
  - [ ] Form with 12 monthly percentage inputs
  - [ ] Real-time validation: sum should be ~100%
  - [ ] Name field
  - [ ] Add "Create" and "Cancel" buttons

- [ ] Create `src/routes/config/heating-profiles/[id]/+page.svelte` (detail/edit)
  - [ ] Display profile details
  - [ ] Allow editing (if custom)
  - [ ] Show usage in configuration

### 12.3 Distribution Key Management Pages

- [ ] Create `src/routes/config/distribution-keys/+page.svelte`
  - [ ] Display all distribution keys (predefined + custom)
  - [ ] Show formula for custom keys
  - [ ] Add "Create Custom Key" button

- [ ] Create `src/routes/config/distribution-keys/new/+page.svelte`
  - [ ] Form with: name, formula
  - [ ] Provide formula examples: {area}, {rooms}, {volume}, {units}
  - [ ] Show formula test interface
  - [ ] Test with sample apartment data
  - [ ] Add "Create" and "Cancel" buttons

- [ ] Create `src/routes/config/distribution-keys/[id]/+page.svelte` (detail/edit)
  - [ ] Display key details
  - [ ] Allow editing formula (if custom)
  - [ ] Show formula test results

### 12.4 Configuration Components

- [ ] Create `src/lib/components/PercentageInput.svelte`
  - [ ] Input for percentage values (0-100)
  - [ ] Validation display

- [ ] Create `src/lib/components/FormulaBuilder.svelte`
  - [ ] Help text for formula syntax
  - [ ] Variable selector buttons
  - [ ] Example formulas
  - [ ] Test interface

- [ ] Create `src/lib/components/ConfigurationForm.svelte`
  - [ ] Reusable form for configuration updates

### 12.5 Testing Configuration Pages

- [ ] Unit tests for config API calls (6 tests)
  - [ ] Config fetch (1)
  - [ ] Config update (1)
  - [ ] Heating profile list (1)
  - [ ] Heating profile create (1)
  - [ ] Distribution key list (1)
  - [ ] Distribution key create (1)

- [ ] E2E tests for configuration flows (8+ tests)
  - [ ] Update accounting period (1)
  - [ ] Update management fee percentage (1)
  - [ ] Create custom heating profile (1)
  - [ ] Validate percentage sum (1)
  - [ ] Create custom distribution key (1)
  - [ ] Test formula (1)
  - [ ] Edit custom profile (1)
  - [ ] Edit custom key (1)

### 12.X Verification: Unit Tests & E2E Tests

- [ ] Component Tests for Config Pages
  - [ ] Test form validation
  - [ ] Test formula editor
  - [ ] Target >75% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Configuration Workflows
  - [ ] Test config updates
  - [ ] Test heating profile management
  - [ ] Test distribution key management
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test in browser

**Status: Phase 12 Complete** ✅

---

## Phase 13: Frontend - Statement Generation & Management

### 13.1 Statement Generation Wizard

- [ ] Create `src/routes/statements/generate/+page.svelte` (multi-step wizard)
  - [ ] Step 1: Select period (date range or accounting period preset)
  - [ ] Step 2: Select buildings/apartments
  - [ ] Step 3: Review generated statements
  - [ ] Step 4: Generate PDFs and save
  - [ ] Progress indicator showing current step

- [ ] Create `src/lib/components/StatementWizard.svelte`
  - [ ] Step component wrapper
  - [ ] Navigation (Previous, Next, Generate)
  - [ ] Form validation at each step

### 13.2 Statement List Page

- [ ] Create `src/routes/statements/+page.svelte`
  - [ ] Display statements in table
  - [ ] Columns: number, tenant, apartment, period, amount, status, actions
  - [ ] Filters: building, status (open/paid), date range
  - [ ] Add "Generate Statements" button
  - [ ] Link to statement details
  - [ ] Bulk actions: mark as paid, send reminders

### 13.3 Statement Detail Pages

- [ ] Create `src/routes/statements/[id]/+page.svelte`
  - [ ] Display full statement
  - [ ] Show header: period, tenant, apartment, date
  - [ ] Show line items with costs by category
  - [ ] Show total costs, advance payments, balance
  - [ ] Show payment status and deadline
  - [ ] Add buttons: Edit, Delete, Download PDF, Mark as Paid, Send Reminder

- [ ] Create `src/routes/statements/[id]/pdf/+page.ts`
  - [ ] Server route to download PDF
  - [ ] Set correct content-type and headers

### 13.4 Payment Status Management

- [ ] Create `src/lib/components/PaymentStatus.svelte`
  - [ ] Show current status (open/paid)
  - [ ] Show payment deadline
  - [ ] Show days overdue (if applicable)
  - [ ] Button to mark as paid

- [ ] Create `src/routes/statements/[id]/mark-paid/+server.ts`
  - [ ] Server route to update statement status
  - [ ] Update payment date

### 13.5 Reminder Management

- [ ] Create `src/lib/components/ReminderPanel.svelte`
  - [ ] Show last reminder date (if any)
  - [ ] Show reminder deadline
  - [ ] Button to send reminder

- [ ] Create `src/routes/statements/[id]/send-reminder/+server.ts`
  - [ ] Server route to send reminder (placeholder for Phase 2 email)
  - [ ] Log reminder sent

### 13.6 Statement Preview

- [ ] Create `src/lib/components/StatementPreview.svelte`
  - [ ] Display statement formatted for PDF
  - [ ] Multi-language support
  - [ ] Professional formatting

### 13.7 Statement Review/Edit

- [ ] Create `src/routes/statements/[id]/edit/+page.svelte`
  - [ ] Allow editing: status, line items (in advanced mode)
  - [ ] Recalculate totals when editing
  - [ ] Add "Save" and "Cancel" buttons

### 13.8 Testing Statement Pages

- [ ] Unit tests for statement API calls (6 tests)
  - [ ] Statement list fetch (1)
  - [ ] Statement create (1)
  - [ ] Statement fetch detail (1)
  - [ ] Statement update (1)
  - [ ] Statement delete (1)
  - [ ] PDF download (1)

- [ ] E2E tests for statement flows (12+ tests)
  - [ ] Generate statements wizard flow (1)
  - [ ] View statement details (1)
  - [ ] Download PDF (1)
  - [ ] Mark as paid (1)
  - [ ] Send reminder (1)
  - [ ] Edit statement (1)
  - [ ] Delete statement (1)
  - [ ] Filter statements (1)
  - [ ] Bulk mark as paid (1)
  - [ ] Statement with multi-contract apartment (1)
  - [ ] Statement with mid-year move (1)
  - [ ] Statement with vacancy (1)

### 13.X Verification: Unit Tests & E2E Tests

- [ ] Component Tests for Statement Pages
  - [ ] Test PDF download
  - [ ] Test statement creation
  - [ ] Target >75% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Statement Workflows
  - [ ] Test complete statement workflow
  - [ ] Test payment marking
  - [ ] Test PDF generation and download
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test full workflow in browser

**Status: Phase 13 Complete** ✅

---

## Phase 14: Frontend - Dashboard & Analytics

### 14.1 Dashboard Overview

- [ ] Create `src/routes/dashboard/+page.svelte` (main dashboard)
  - [ ] Display summary statistics in cards
  - [ ] Portfolio overview: total buildings, apartments, occupancy rate
  - [ ] Financial overview: outstanding statements, total pending, overdue amount
  - [ ] Recent activity: latest invoices, recent statements
  - [ ] Quick actions: generate statements, create invoice

### 14.2 Dashboard Statistics Components

- [ ] Create `src/lib/components/StatCard.svelte`
  - [ ] Display statistic with label and value
  - [ ] Optional: trend indicator (up/down)
  - [ ] Optional: link to detailed view

- [ ] Create `src/lib/components/ActivityFeed.svelte`
  - [ ] Display recent activities in list
  - [ ] Activities: statements created, invoices added, payments received

- [ ] Create `src/lib/components/OccupancyChart.svelte`
  - [ ] Show occupancy rates per building
  - [ ] Bar chart or donut chart
  - [ ] Include building names

### 14.3 Analytics Pages (Future Phase 2, but setup structure)

- [ ] Create `src/routes/analytics/+page.svelte` (placeholder)
  - [ ] Layout for future analytics pages
  - [ ] Show message: "Analytics coming in Phase 2"

### 14.4 Reports (Future Phase 2, but setup structure)

- [ ] Create `src/routes/reports/+page.svelte` (placeholder)
  - [ ] Layout for future reports
  - [ ] Show message: "Reports coming in Phase 2"

### 14.5 Testing Dashboard

- [ ] Unit tests for dashboard API calls (3 tests)
  - [ ] Dashboard data fetch (1)
  - [ ] Statistics calculation (1)
  - [ ] Recent activity fetch (1)

- [ ] E2E tests for dashboard (5+ tests)
  - [ ] Dashboard loads with data (1)
  - [ ] Statistics display correctly (1)
  - [ ] Activity feed shows recent items (1)
  - [ ] Occupancy chart displays (1)
  - [ ] Quick action buttons work (1)

### 14.X Verification: Unit Tests & E2E Tests

- [ ] Component Tests for Dashboard
  - [ ] Test charts render
  - [ ] Test statistics calculate correctly
  - [ ] Target >75% code coverage
  - [ ] All tests pass: `npm run test`

- [ ] E2E Tests for Dashboard
  - [ ] Test dashboard loads
  - [ ] Test all widgets display
  - [ ] Test navigation from dashboard
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Test in browser

**Status: Phase 14 Complete** ✅

---

## Phase 15: Integration Testing

### 15.1 End-to-End Workflows

- [ ] Test complete workflow: Building → Apartment → Tenant → Contract
  - [ ] Create building with OpenPLZ (1 test)
  - [ ] Create apartment in building (1 test)
  - [ ] Create tenant (1 test)
  - [ ] Create contract linking all three (1 test)
  - [ ] Verify relationships correct (1 test)

- [ ] Test complete workflow: Invoices → Statement
  - [ ] Create invoices for building (1 test)
  - [ ] Invoke LLM categorization (1 test)
  - [ ] Override category if needed (1 test)
  - [ ] Generate statements (1 test)
  - [ ] Verify statement calculations (1 test)
  - [ ] Download PDF (1 test)

- [ ] Test complex prorating scenarios (6+ tests)
  - [ ] Multiple contracts in one period (1 test)
  - [ ] Mid-year move with heating proration (1 test)
  - [ ] Vacancy periods (1 test)
  - [ ] All three combined (1 test)
  - [ ] Management fee calculation (1 test)
  - [ ] Swiss law compliance (1 test)

### 15.2 Cross-Component Integration

- [ ] Test authentication throughout app (5+ tests)
  - [ ] Login → Access protected routes (1 test)
  - [ ] Token refresh (1 test)
  - [ ] Logout → Access denied (1 test)
  - [ ] Invalid token → Redirect to login (1 test)
  - [ ] XSRF protection on all mutations (1 test)

- [ ] Test data consistency across flows (6+ tests)
  - [ ] Update building → Reflected in statements (1 test)
  - [ ] Delete contract → Statements handled (1 test)
  - [ ] Update tenant → Reflected in statements (1 test)
  - [ ] Configuration changes → Applied to new statements (1 test)
  - [ ] PDF generation includes latest data (1 test)
  - [ ] Dashboard reflects all changes (1 test)

### 15.3 Error Handling & Edge Cases

- [ ] Test error scenarios (10+ tests)
  - [ ] Offline backend → User-friendly error (1 test)
  - [ ] Database connection error → Graceful fallback (1 test)
  - [ ] Invalid input → Validation errors (1 test)
  - [ ] Duplicate contract → Prevented (1 test)
  - [ ] Missing required fields → Error display (1 test)
  - [ ] Concurrent updates → Last write wins (1 test)
  - [ ] PDF generation failure → Error handling (1 test)
  - [ ] LLM timeout → Fallback to manual (1 test)
  - [ ] API rate limiting → Queue/retry (1 test)
  - [ ] Storage full → Graceful error (1 test)

### 15.4 Performance Testing

- [ ] Load tests
  - [ ] 100 buildings, 1000 apartments, 5000 tenants (1 test)
  - [ ] Statement generation for 100 apartments (1 test)
  - [ ] List pages with large datasets (1 test)

- [ ] Response time benchmarks
  - [ ] API response time <500ms (p95) (1 test)
  - [ ] PDF generation <5s (1 test)
  - [ ] Dashboard load <2s (1 test)

### 15.5 Security Testing

- [ ] Test authentication security (6+ tests)
  - [ ] XSRF protection on all POST/PUT/DELETE (1 test)
  - [ ] XSS protection in form inputs (1 test)
  - [ ] SQL injection prevention (1 test)
  - [ ] Unauthorized access denied (1 test)
  - [ ] Session hijacking prevention (1 test)
  - [ ] JWT expiration enforced (1 test)

### 15.6 Multi-Language Testing

- [ ] Test all 5 languages (5+ tests)
  - [ ] German (de) - statement generation and PDF (1 test)
  - [ ] French (fr) - statement generation and PDF (1 test)
  - [ ] Italian (it) - statement generation and PDF (1 test)
  - [ ] Romansh (rm) - statement generation and PDF (1 test)
  - [ ] English (en) - statement generation and PDF (1 test)

### 15.7 Browser Compatibility

- [ ] Test on multiple browsers (5+ tests)
  - [ ] Chrome latest - all features (1 test)
  - [ ] Firefox latest - all features (1 test)
  - [ ] Safari latest - all features (1 test)
  - [ ] Edge latest - all features (1 test)
  - [ ] Mobile Safari - responsive (1 test)

### 15.X Verification: Unit Tests & E2E Tests

- [ ] Full Integration Test Suite
  - [ ] All E2E tests covering complete workflows
  - [ ] Cross-browser testing (Chrome, Firefox, Safari)
  - [ ] All tests pass: `npm run test:e2e`

- [ ] Load Testing
  - [ ] Test with 50+ apartments
  - [ ] Test with 100+ invoices
  - [ ] Verify performance targets met

- [ ] Manual Testing
  - [ ] Test on real devices
  - [ ] Test all major workflows end-to-end

**Status: Phase 15 Complete** ✅

---

## Phase 16: Environment & Deployment Configuration

### 16.1 Environment Variables

- [ ] Complete `.env.example` with all variables
  - [ ] Frontend variables
  - [ ] Backend variables
  - [ ] Database configuration
  - [ ] OAuth credentials (template)
  - [ ] LLM configuration
  - [ ] Deployment URLs

- [ ] Create environment-specific configs
  - [ ] `.env.development` (local)
  - [ ] `.env.staging` (staging)
  - [ ] `.env.production` (production template)

### 16.2 Build Configuration

- [ ] Setup frontend build
  - [ ] `npm run build` in root
  - [ ] Output: SvelteKit build
  - [ ] Verify bundle size <150KB

- [ ] Setup backend build
  - [ ] `npm run build` in backend/
  - [ ] Output: compiled JavaScript

### 16.3 Node & Runtime Configuration

- [ ] Update `package.json` scripts
  - [ ] `npm run dev` - Start dev server
  - [ ] `npm run dev:api` - Start API dev server
  - [ ] `npm run build` - Build frontend
  - [ ] `npm run preview` - Preview build
  - [ ] `npm run test` - Run tests
  - [ ] `npm run test:e2e` - Run E2E tests
  - [ ] `npm run lint` - Run linter
  - [ ] `npm run format` - Format code
  - [ ] `npm run type-check` - TypeScript check
  - [ ] `npm run db:migrate` - Run migrations

- [ ] Update `backend/package.json` scripts
  - [ ] Similar scripts for backend

### 16.4 Database Configuration

- [ ] Setup local PostgreSQL
  - [ ] Create database `dwello`
  - [ ] Create user `dwello` with password
  - [ ] Grant all privileges
  - [ ] Test connection

- [ ] Setup test database
  - [ ] Create database `dwello_test`
  - [ ] Used for integration tests

### 16.5 LLM Configuration

- [ ] Configure Ollama
  - [ ] Set `OLLAMA_API_URL` to local Ollama instance
  - [ ] Download and setup Mistral model
  - [ ] Test connection
  - [ ] Verify model loads

### 16.6 Testing Configuration

- [ ] Verify test database setup
  - [ ] Run `npm run test`
  - [ ] All tests pass with test database
  - [ ] Coverage reports generated

### 16.X Verification: Unit Tests & E2E Tests

- [ ] Configuration Validation
  - [ ] Verify all environment variables documented
  - [ ] Test development environment setup
  - [ ] Test production environment template
  - [ ] All configurations load correctly

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test`
  - [ ] Verify environment files work correctly

**Status: Phase 16 Complete** ✅

---

## Phase 17: Docker & Deployment

### 17.1 Frontend Dockerfile

- [ ] Create `Dockerfile` (frontend)
  - [ ] Multi-stage build
  - [ ] Stage 1: Build (Node 18+, install, build)
  - [ ] Stage 2: Runtime (Node 18+, copy build, start server)
  - [ ] Expose port 5173 or 3000
  - [ ] Health check

- [ ] Verify Dockerfile builds
  - [ ] `docker build -t dwello-frontend .`
  - [ ] Test image locally

### 17.2 Backend Dockerfile

- [ ] Create `backend/Dockerfile`
  - [ ] Use Bun official image
  - [ ] Install dependencies with Bun
  - [ ] Copy source code
  - [ ] Expose port 3001
  - [ ] Health check

- [ ] Verify Dockerfile builds
  - [ ] `docker build -t dwello-backend ./backend`
  - [ ] Test image locally

### 17.3 Docker Compose Configuration

- [ ] Create `docker-compose.yml` (production-like)
  - [ ] Service: frontend (port 3000, depends on backend)
  - [ ] Service: backend (port 3001, depends on postgres, ollama)
  - [ ] Service: postgres (port 5432, volume for data)
  - [ ] Service: ollama (port 11434, volume for models)
  - [ ] Volumes: postgres-data, ollama-models
  - [ ] Networks: single network for all services

- [ ] Create `docker-compose.dev.yml` (development)
  - [ ] Mount source directories
  - [ ] Enable hot-reload
  - [ ] Development environment variables

### 17.4 Docker Compose Testing

- [ ] Test development stack
  - [ ] `docker-compose -f docker-compose.dev.yml up`
  - [ ] Wait for all services to start
  - [ ] Verify frontend accessible at localhost:5173
  - [ ] Verify backend accessible at localhost:3001
  - [ ] Verify database accessible at localhost:5432
  - [ ] Verify Ollama accessible at localhost:11434

- [ ] Test login flow in Docker
  - [ ] Login with test credentials
  - [ ] Create test building
  - [ ] Create test invoice
  - [ ] Generate test statement
  - [ ] Download PDF

### 17.5 Production Deployment

- [ ] Create deployment guide
  - [ ] Prerequisites (Docker, docker-compose)
  - [ ] Installation steps
  - [ ] Configuration setup
  - [ ] Database initialization
  - [ ] Health checks
  - [ ] Backup strategy

- [ ] Create `.dockerignore` (frontend)
  - [ ] Exclude: node_modules, .git, .svelte-kit, dist

- [ ] Create `backend/.dockerignore`
  - [ ] Exclude: node_modules, .git, dist

### 17.6 Database Initialization

- [ ] Create `init-db.sh` script
  - [ ] Create database
  - [ ] Run migrations
  - [ ] Populate initial data
  - [ ] Set permissions

- [ ] Document database setup
  - [ ] Connection strings
  - [ ] Credentials
  - [ ] Backup procedures

### 17.X Verification: Unit Tests & E2E Tests

- [ ] Docker Build & Run Tests
  - [ ] Build Docker images successfully
  - [ ] Run containers and verify they start
  - [ ] Test services communicate correctly
  - [ ] Verify data persistence

- [ ] Docker Compose Tests
  - [ ] Bring up full stack: `docker-compose up`
  - [ ] Verify all services are healthy
  - [ ] Test API endpoints work
  - [ ] Bring down and verify cleanup

- [ ] Manual Testing
  - [ ] Build and run locally
  - [ ] Test complete system end-to-end

**Status: Phase 17 Complete** ✅

---

## Phase 18: Documentation & Testing Finalization

### 18.1 API Documentation

- [ ] Complete OpenAPI/Swagger spec
  - [ ] Document all endpoints
  - [ ] Include request/response examples
  - [ ] Add authentication requirements
  - [ ] Add error responses

- [ ] Generate API documentation
  - [ ] Generate from spec
  - [ ] Deploy to documentation site

### 18.2 Developer Documentation

- [ ] Create `DEVELOPMENT.md`
  - [ ] Local setup instructions (5 steps)
  - [ ] Project structure overview
  - [ ] Common tasks (add endpoint, add page, etc.)
  - [ ] Running tests
  - [ ] Debugging tips
  - [ ] Code style guide

- [ ] Create `ARCHITECTURE.md`
  - [ ] System architecture overview
  - [ ] Data flow diagrams
  - [ ] Component relationships
  - [ ] Design patterns used

- [ ] Create `DATABASE.md`
  - [ ] Schema overview
  - [ ] Table descriptions
  - [ ] Relationships
  - [ ] Query optimization tips

### 18.3 User Documentation

- [ ] Create `USER_GUIDE.md`
  - [ ] Getting started
  - [ ] Managing buildings
  - [ ] Managing tenants
  - [ ] Creating contracts
  - [ ] Managing invoices
  - [ ] Generating statements
  - [ ] Downloading reports

### 18.4 Deployment Documentation

- [ ] Create `DEPLOYMENT.md`
  - [ ] Prerequisites
  - [ ] Docker setup
  - [ ] Configuration
  - [ ] Database setup
  - [ ] Running the system
  - [ ] Health checks
  - [ ] Troubleshooting

- [ ] Create `BACKUP_RECOVERY.md`
  - [ ] Backup procedures
  - [ ] Recovery procedures
  - [ ] Testing backups

### 18.5 Security Documentation

- [ ] Create `SECURITY.md`
  - [ ] Authentication mechanism
  - [ ] Authorization rules
  - [ ] Data protection measures
  - [ ] Compliance requirements
  - [ ] Security best practices
  - [ ] Vulnerability reporting

### 18.6 Test Coverage Report

- [ ] Generate test coverage
  - [ ] `npm run test -- --coverage`
  - [ ] Verify >80% coverage for critical paths
  - [ ] Identify gaps

- [ ] Document test strategy
  - [ ] Unit test approach
  - [ ] Integration test approach
  - [ ] E2E test approach

### 18.7 README.md

- [ ] Create comprehensive README
  - [ ] Project description
  - [ ] Features overview
  - [ ] Tech stack
  - [ ] Quick start (5 minutes)
  - [ ] Development setup
  - [ ] Testing
  - [ ] Deployment
  - [ ] Contributing
  - [ ] License

### 18.X Verification: Unit Tests & E2E Tests

- [ ] Documentation Validation
  - [ ] All links work
  - [ ] Code examples are correct
  - [ ] README instructions work
  - [ ] All tests still pass: `npm run test`

- [ ] Manual Testing
  - [ ] Follow README instructions
  - [ ] Run project from scratch
  - [ ] Verify all docs are accurate

**Status: Phase 18 Complete** ✅

---

## Phase 19: Manual Testing & QA

### 19.1 Feature Testing

- [ ] Building Management
  - [ ] Create building with OpenPLZ search (1)
  - [ ] Edit building address (1)
  - [ ] Delete building (1)
  - [ ] View building details (1)
  - [ ] List buildings with pagination (1)

- [ ] Apartment Management
  - [ ] Create apartment (1)
  - [ ] Edit apartment (1)
  - [ ] Delete apartment (1)
  - [ ] View apartment with tenant info (1)

- [ ] Tenant Management
  - [ ] Create tenant (1)
  - [ ] Edit tenant (1)
  - [ ] Delete tenant (1)
  - [ ] View tenant with contract history (1)

- [ ] Contract Management
  - [ ] Create contract (1)
  - [ ] Edit contract dates (1)
  - [ ] Delete contract (1)
  - [ ] View contract with PDF (1)
  - [ ] Contract overlap prevention (1)

- [ ] Invoice Management
  - [ ] Create invoice (1)
  - [ ] Auto-categorize with LLM (1)
  - [ ] Override category (1)
  - [ ] Edit invoice (1)
  - [ ] Delete invoice (1)

- [ ] Statement Generation
  - [ ] Generate statement (single contract) (1)
  - [ ] Generate statements (multiple contracts) (1)
  - [ ] Statement with mid-year move (1)
  - [ ] Statement with vacancy (1)
  - [ ] Download PDF (1)
  - [ ] Verify calculations (1)

- [ ] Configuration
  - [ ] Update accounting period (1)
  - [ ] Update management fee percentage (1)
  - [ ] Create custom heating profile (1)
  - [ ] Create custom distribution key (1)

### 19.2 Multi-Browser Testing

- [ ] Chrome (latest)
  - [ ] All features functional (1)
  - [ ] Responsive design (1)
  - [ ] Performance acceptable (1)

- [ ] Firefox (latest)
  - [ ] All features functional (1)
  - [ ] Responsive design (1)

- [ ] Safari (latest)
  - [ ] All features functional (1)
  - [ ] Responsive design (1)

- [ ] Edge (latest)
  - [ ] All features functional (1)

### 19.3 Responsive Design Testing

- [ ] Desktop (1920x1080)
  - [ ] All pages render correctly (1)
  - [ ] No horizontal scroll (1)

- [ ] Tablet (iPad, 768x1024)
  - [ ] All pages responsive (1)
  - [ ] Navigation accessible (1)

- [ ] Mobile (iPhone, 375x667)
  - [ ] All pages responsive (1)
  - [ ] Touch interactions work (1)
  - [ ] Text readable (1)

### 19.4 Accessibility Testing

- [ ] Keyboard navigation
  - [ ] All interactive elements reachable via Tab (1)
  - [ ] Focus indicators visible (1)

- [ ] Screen reader testing
  - [ ] Page structure logical (1)
  - [ ] Form labels associated (1)
  - [ ] Images have alt text (1)

### 19.5 Performance Testing

- [ ] Page load times
  - [ ] Dashboard <2s (1)
  - [ ] Buildings list <2s (1)
  - [ ] Statement detail <2s (1)

- [ ] API response times
  - [ ] GET endpoints <500ms (1)
  - [ ] POST endpoints <500ms (1)
  - [ ] PDF generation <5s (1)

### 19.6 Data Integrity Testing

- [ ] Test calculations
  - [ ] Simple prorating accurate (1)
  - [ ] Multi-contract prorating accurate (1)
  - [ ] Mid-year move heating accurate (1)
  - [ ] Management fee correct (1)
  - [ ] Swiss law compliance (1)

### 19.7 Backup & Recovery

- [ ] Test backup process
  - [ ] Backup created successfully (1)
  - [ ] Backup contains all data (1)

- [ ] Test recovery process
  - [ ] Restore from backup (1)
  - [ ] Data integrity after restore (1)

### 19.8 Sign-Off

- [ ] QA sign-off checklist
  - [ ] All 57+ manual tests passed
  - [ ] No critical issues
  - [ ] Performance acceptable
  - [ ] Security verified
  - [ ] Documentation complete

### 19.X Verification: All Tests Complete

- [ ] Full Test Suite
  - [ ] Unit Tests: `npm run test` - All pass
  - [ ] E2E Tests: `npm run test:e2e` - All pass
  - [ ] Integration Tests: All pass
  - [ ] Load/Performance Tests: Targets met
  - [ ] Manual QA: 57+ test cases passed

- [ ] Quality Gates
  - [ ] Code Coverage: >80% for critical paths
  - [ ] TypeScript: No errors
  - [ ] Linting: No warnings
  - [ ] Security: No vulnerabilities

- [ ] Manual Testing
  - [ ] Run all tests: `npm run test && npm run test:e2e`
  - [ ] Complete full manual testing checklist
  - [ ] Get stakeholder sign-off

**Status: Phase 19 Complete** ✅

---

## Phase 20: Optimization & Cleanup

### 20.1 Code Cleanup

- [ ] Remove console.log statements
  - [ ] Search for console.log throughout codebase
  - [ ] Keep only for errors/warnings
  - [ ] Remove debug statements (1)

- [ ] Remove commented code
  - [ ] Search for commented sections
  - [ ] Delete or implement (1)

- [ ] Fix TypeScript warnings
  - [ ] Run `npm run type-check`
  - [ ] Fix all warnings (1)

- [ ] Remove unused imports
  - [ ] Use IDE to find unused imports
  - [ ] Clean up (1)

- [ ] Fix ESLint issues
  - [ ] Run `npm run lint`
  - [ ] Fix all issues (1)

### 20.2 Performance Optimization

- [ ] Bundle size optimization
  - [ ] Analyze bundle: `npm run build`
  - [ ] Check for large dependencies (1)
  - [ ] Consider alternatives for large packages

- [ ] Image optimization
  - [ ] Compress all images (1)
  - [ ] Use WebP format where appropriate (1)

- [ ] Database query optimization
  - [ ] Review slow queries
  - [ ] Add indexes if needed (1)
  - [ ] Optimize N+1 queries (1)

- [ ] Frontend optimization
  - [ ] Lazy load components (1)
  - [ ] Code splitting for routes (1)
  - [ ] Minimize bundle (1)

### 20.3 Dependency Audit

- [ ] Run security audit
  - [ ] `npm audit`
  - [ ] Fix critical vulnerabilities (1)
  - [ ] Update dependencies if needed (1)

- [ ] Check for outdated dependencies
  - [ ] `npm outdated`
  - [ ] Update minor versions (1)

### 20.4 Final Code Review

- [ ] Code style consistency
  - [ ] Run `npm run format` (1)
  - [ ] Verify consistent throughout (1)

- [ ] Documentation accuracy
  - [ ] Comments match code (1)
  - [ ] Examples still valid (1)

### 20.5 Final Testing

- [ ] Quick regression test
  - [ ] Login flow (1)
  - [ ] Create building (1)
  - [ ] Generate statement (1)
  - [ ] Download PDF (1)
  - [ ] Logout (1)

- [ ] Browser compatibility check
  - [ ] Chrome, Firefox, Safari (1)

### 20.6 Prepare for Release

- [ ] Create `.gitignore` (final)
  - [ ] Exclude sensitive files
  - [ ] Exclude build artifacts

- [ ] Create `.gitattributes`
  - [ ] Line ending consistency

- [ ] Final git cleanup
  - [ ] Clean commit history (1)
  - [ ] Create release branch (1)

### 20.X Verification: Final Quality Check

- [ ] Final Test Suite Run
  - [ ] All unit tests pass: `npm run test`
  - [ ] All E2E tests pass: `npm run test:e2e`
  - [ ] No TypeScript errors: `npm run type-check`
  - [ ] No linting issues: `npm run lint`
  - [ ] Coverage reports reviewed

- [ ] Code Quality Review
  - [ ] All linting issues fixed
  - [ ] All deprecated warnings removed
  - [ ] Performance profiling complete
  - [ ] Security scan passed

- [ ] Final Manual Testing
  - [ ] Production-like setup testing
  - [ ] Performance validation
  - [ ] Data integrity checks

**Status: Phase 20 Complete** ✅

---

## Phase 21: Go-Live Preparation

### 21.1 Production Deployment

- [ ] Deploy to staging
  - [ ] Build Docker images (1)
  - [ ] Deploy with docker-compose (1)
  - [ ] Verify all services running (1)
  - [ ] Run smoke tests (1)

- [ ] Verify configuration
  - [ ] All environment variables set (1)
  - [ ] Database connection verified (1)
  - [ ] LLM connection verified (1)
  - [ ] OAuth credentials configured (1)

### 21.2 Backup & Recovery Verification

- [ ] Test backup on production setup
  - [ ] Create backup (1)
  - [ ] Verify backup integrity (1)
  - [ ] Test recovery procedure (1)

### 21.3 Monitoring & Logging

- [ ] Setup logging
  - [ ] Application logs (1)
  - [ ] Error tracking (1)
  - [ ] Audit logs for important actions (1)

- [ ] Setup monitoring (Phase 2)
  - [ ] Document monitoring requirements

### 21.4 Documentation Final Pass

- [ ] Review all documentation
  - [ ] README (1)
  - [ ] DEVELOPMENT.md (1)
  - [ ] DEPLOYMENT.md (1)
  - [ ] USER_GUIDE.md (1)
  - [ ] API docs (1)

- [ ] Create release notes
  - [ ] Features implemented (1)
  - [ ] Known limitations (1)
  - [ ] Installation instructions (1)

### 21.5 Security Final Check

- [ ] Security audit
  - [ ] Authentication verified (1)
  - [ ] Authorization verified (1)
  - [ ] Data encryption verified (1)
  - [ ] No sensitive data in logs (1)
  - [ ] HTTPS/TLS ready (1)

### 21.6 Performance Final Check

- [ ] Performance benchmarks
  - [ ] API response times acceptable (1)
  - [ ] Page load times acceptable (1)
  - [ ] PDF generation acceptable (1)

### 21.7 Go-Live Checklist

- [ ] All phases complete (✓)
- [ ] All tests passing (✓)
- [ ] All documentation complete (✓)
- [ ] Staging deployment successful (✓)
- [ ] Production configuration ready (✓)
- [ ] Backup & recovery tested (✓)
- [ ] Team trained (✓)
- [ ] Launch plan finalized (✓)

### 21.8 Launch

- [ ] Deploy to production
  - [ ] Build final images (1)
  - [ ] Deploy with docker-compose (1)
  - [ ] Run smoke tests (1)
  - [ ] Verify users can access (1)

- [ ] Post-launch monitoring
  - [ ] Monitor for errors (1)
  - [ ] Monitor performance (1)
  - [ ] Address any issues immediately (1)

### 21.X Verification: Go-Live Readiness

- [ ] Pre-Launch Verification
  - [ ] All tests passing on production-like environment
  - [ ] All integrations verified (Ollama, OpenPLZ, etc.)
  - [ ] Backup/recovery tested and working
  - [ ] Monitoring and logging active
  - [ ] Documentation complete and accurate

- [ ] Launch Day Testing
  - [ ] Smoke tests run successfully
  - [ ] Critical workflows tested
  - [ ] Data integrity verified
  - [ ] Performance acceptable

- [ ] Post-Launch Validation
  - [ ] Monitor logs for errors
  - [ ] Monitor performance metrics
  - [ ] User feedback collection
  - [ ] Issue response protocol active

**Status: Phase 21 Complete - System Launched! 🚀**

---

# Progress Tracking

## Overall Completion

**Current Status:** ~6% (Phase 10 In Progress)

| Phase | Status | Completion | Tasks | Done |
|-------|--------|-----------|-------|------|
| Phase 0 | ✅ Complete | 100% | 42 | 42 |
| Phase 1 | ⏳ Pending | 0% | 37 | 0 |
| Phase 2 | ⏳ Pending | 0% | 60 | 0 |
| Phase 3 | ⏳ Pending | 0% | 38 | 0 |
| Phase 4 | ⏳ Pending | 0% | 31 | 0 |
| Phase 5 | ⏳ Pending | 0% | 44 | 0 |
| Phase 6 | ⏳ Pending | 0% | 48 | 0 |
| Phase 7 | ⏳ Pending | 0% | 32 | 0 |
| Phase 8 | ⏳ Pending | 0% | 61 | 0 |
| Phase 9 | ⏳ Pending | 0% | 34 | 0 |
| Phase 10 | 🔄 In Progress | 14% | 43 | 6 |
| Phase 11 | ⏳ Pending | 0% | 28 | 0 |
| Phase 12 | ⏳ Pending | 0% | 30 | 0 |
| Phase 13 | ⏳ Pending | 0% | 40 | 0 |
| Phase 14 | ⏳ Pending | 0% | 23 | 0 |
| Phase 15 | ⏳ Pending | 0% | 48 | 0 |
| Phase 16 | ⏳ Pending | 0% | 26 | 0 |
| Phase 17 | ⏳ Pending | 0% | 28 | 0 |
| Phase 18 | ⏳ Pending | 0% | 36 | 0 |
| Phase 19 | ⏳ Pending | 0% | 57 | 0 |
| Phase 20 | ⏳ Pending | 0% | 24 | 0 |
| Phase 21 | ⏳ Pending | 0% | 28 | 0 |

**Total Tasks: ~850** | **Completed: 48** | **Overall: ~6%**

---

## Completion Notes

After completing each task, add a note here:

## Session 1 - January 23, 2026

### Phase 0: Project Initialization ✅

**Completed:** January 23, 2026
**Commit:** 2301baa - "feat(init): complete Phase 0 project initialization"

**What Was Done:**
- ✅ Initialized SvelteKit project with TypeScript (manually created, not using deprecated create-svelte)
- ✅ Created backend ElysiaJS project structure with Bun runtime support
- ✅ Installed all frontend dependencies (SvelteKit, TailwindCSS, Zod, Jose, Leaflet, svelte-i18n, date-fns)
- ✅ Installed all backend dependencies (Elysia, Drizzle ORM, PostgreSQL client, CORS)
- ✅ Created all configuration files:
  - `svelte.config.js` - SvelteKit config with adapter-node and CSRF protection
  - `vite.config.ts` - Vite build configuration
  - `tsconfig.json` - TypeScript strict mode configuration
  - `backend/tsconfig.json` - Backend TypeScript config for Bun
  - `eslint.config.js` - ESLint with TypeScript and Svelte support
  - `.prettierrc` - Code formatting rules
  - `tailwind.config.js` - Tailwind CSS configuration
  - `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
  - `vitest.config.ts` - Unit test configuration
  - `playwright.config.ts` - E2E test configuration
- ✅ Created environment files:
  - `.env.example` - Complete documentation of all required variables
  - `.env.local` - Local development values (gitignored)
- ✅ Created complete directory structure:
  - Frontend: `src/routes/{auth,api,buildings,apartments,tenants,contracts,invoices,statements,config,dashboard}`
  - Frontend: `src/lib/{server,components,utils}`
  - Backend: `backend/src/{middleware,routes,db,schema,services}`
  - Testing: `tests/{e2e,unit}`
  - Database: `migrations/`
- ✅ Created README.md with project overview and quick start guide
- ✅ Added example test files (unit and E2E)
- ✅ Created basic ElysiaJS server with health endpoint
- ✅ Created basic SvelteKit pages (+layout.svelte, +page.svelte)

**Files Created:**
- Configuration: 14 files
- Source code: 5 files
- Tests: 2 files
- Documentation: 1 file (README.md)
- Total: 23 files, 8,890 lines added

**Status:** ✅ Complete and committed

**Issues Encountered:**
1. `create-svelte` deprecated - Manually created project structure instead
2. `svelte-leaflet@0.8.0` doesn't exist - Removed from dependencies (will add when needed)
3. Vite plugin version conflict - Updated `@sveltejs/vite-plugin-svelte` to v5.0.4
4. `.svelte-kit` directory not generated initially - Will be created on first dev server run

**Next Steps:**
- Phase 1: SvelteKit Auth Routes (BFF Layer)
  - Implement server-side auth utilities (JWT, cookies, XSRF)
  - Create OAuth login flow
  - Implement token refresh and logout

---

# Success Criteria

✅ **MVP Complete When:**

1. All 21 phases completed
2. All ~850 tasks checked off
3. Test coverage >80% for all critical paths
4. All automated tests passing (unit + integration + E2E)
5. Manual testing checklist (Phase 19) complete
6. Security audit passed
7. Performance targets met
8. All documentation complete and accurate
9. Docker deployment verified and tested
10. System ready for production use

---

# Workflow Rules

⚠️ **CRITICAL:** After completing any task, you MUST:

1. ✅ Mark task complete: `- [x]`
2. 📝 Add implementation note
3. 🔄 Update progress percentage in this file
4. 📊 Update Phase status indicator

**Example note:**
```
- [x] Create `src/lib/server/auth.ts`
  **Note:** JWT generation, verification, cookie management. 7 functions, 280 lines.
  **Tests:** 22 test cases passing. **Status:** ✅ Complete
```

---

**Last Updated:** January 23, 2026
**Total Duration:** ~22 weeks
**Target:** Full MVP production-ready system

---

# Quick Links

- 📋 [CLAUDE.md Workflow Rules](./CLAUDE.md#-workflow---strict-rules-for-implementation)
- 🏗️ [Architecture](./docs/tech-stack.md)
- 📖 [PRD](./docs/PRD-Dwello.md)
- 🗄️ [Database Schema](./docs/data-model.md)
- 🔌 [API Spec](./docs/api-specification.md)
