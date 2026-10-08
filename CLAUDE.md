# Dwello - Claude Code Context

**Swiss Property Management System** | Phase 5 Complete, OAuth Configured

## Overview

Web app for Swiss property managers (Liegenschaftsverwalter): building/tenant/contract management, invoice categorization via LLM, utility cost statements (Nebenkostenabrechnungen) with Swiss legal compliance, QR-bill generation. Single-user MVP, <50 apartments.

**Stack:** SvelteKit + TypeScript + TailwindCSS | ElysiaJS on Bun + PostgreSQL + Drizzle ORM | Ollama (Mistral 7B) | BFF pattern (HTTPOnly cookies, XSRF, no client-side tokens)

## Documentation

- **`docs/PRD-Dwello.md`** - Complete requirements, 11 features, UI/UX
- **`docs/data-model.md`** - PostgreSQL schema (12 tables), relationships, indexes
- **`docs/api-specification.md`** - REST API spec, endpoints, auth, errors
- **`docs/tech-stack.md`** - Architecture, justifications, performance targets
- **`docs/test-pyramid.md`** - Test pyramid and ATDD workflow (layers, runners, rules)
- **`docs/claude-reference.md`** - Project structure, BFF detail, business logic, deployment, troubleshooting
- **`implementation_plan.md`** - Living progress tracker (UPDATE AFTER EACH TASK)
- **`requirements-prosa.md`** - Original German requirements

## Architecture (BFF)

`Frontend -> apiCall() -> BFF (SvelteKit cookies/XSRF) -> Backend (ElysiaJS JWT) -> DB`

BFF handles OAuth + cookies, backend handles JWT validation + business logic, client never sees tokens. See `docs/claude-reference.md` for full detail.

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

## Conventional Commits

Format: `<type>(<scope>): <subject>` (50 chars max, imperative, no period)

Types: `feat`, `fix`, `docs`, `chore`

Scopes - Frontend: `auth`, `buildings`, `apartments`, `tenants`, `contracts`, `invoices`, `statements`, `config`, `components`, `stores`, `styles` | Backend: `api`, `db`, `middleware`, `services`, `schema` | Cross: `docker`, `types`, `i18n`, `tests`, `ci`, `build`

---

# CODING GUIDELINES

## Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs. State assumptions explicitly. If multiple interpretations exist, present them — don't pick silently. If a simpler approach exists, say so. Push back when warranted.

## Simplicity First

Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code. No "flexibility" or "configurability" that wasn't requested. No error handling for impossible scenarios.

## Surgical Changes

Touch only what you must. Don't "improve" adjacent code, comments, or formatting. Don't refactor things that aren't broken. Match existing style. Remove imports/variables/functions that YOUR changes made unused, but don't remove pre-existing dead code unless asked. Every changed line should trace directly to the request.

## Goal-Driven Execution

Transform tasks into verifiable goals. For multi-step tasks, state a brief plan with verification checks. "Fix the bug" → write a test that reproduces it, then make it pass.

---

# WORKFLOW RULES

## Acceptance Test First (ATDD)

Every feature or behavior change starts with an acceptance test: write the scenario in business language in the matching `tests/e2e/features/*.feature`, tag it `@wip` (excluded from runs, so the pipeline stays green), and watch it fail for the right reason. Then drive the implementation with `/tdd` until the scenario passes, and remove `@wip`. A feature is done when its scenario is green without `@wip`, not when unit tests pass.

## Run /tdd and /ponytail for Every Implementation

Every implementation (feature or fix) runs both skills: `/tdd` (red-green, one behavior at a time, tests through public interfaces) and `/ponytail` (shortest working diff). Check the finished change against both before committing.

## Update implementation_plan.md After Every Task

After completing ANY task: mark `- [ ]` to `- [x]` for task AND sub-items, add note with files created/modified, update Progress Summary table.

Status indicators: complete, in progress, pending, blocked

## Verification Before Marking Complete

Do NOT mark complete unless all unit tests pass, all E2E tests pass, no TypeScript errors, no ESLint warnings.

## Unit Tests Required for Every Fix

Every bug fix MUST include unit tests. Backend: `backend/src/__tests__/` | Frontend: `src/__tests__/`

## No Mocks in Development

NEVER use mock data, mock API responses, or hardcoded/fake data in components during development. Always connect to real PostgreSQL and real backend endpoints.

## Session Workflow

**Start:** Read `implementation_plan.md` -> find next unchecked item -> review requirements -> reference docs

## Testing Strategy

| Type | Framework | Focus |
|------|-----------|-------|
| Acceptance (outer loop, written first) | Playwright + playwright-bdd | What the business wants: Gherkin scenarios against the built app and a fresh database |
| Integration | `bun test` (`backend/src/__tests__/*.pg.test.ts`) | API routes, SQL, mail against a real PostgreSQL test database (`dwello_test`), no mocks |
| Unit (inner loop, TDD) | Vitest (frontend), `bun test` (backend) | What the developer intends: business logic through public exports; coverage may not drop below the floor; target coverage in `docs/test-pyramid.md` |

### Test Selectors: data-testid First

Always use `data-testid` as primary selector. Naming: kebab-case, include component context (e.g., `building-card-{id}`, `tenant-name-input`). Avoid CSS selectors. See `docs/claude-reference.md` for E2E Gherkin details.
