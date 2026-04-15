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

# WORKFLOW RULES

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
| Unit | Vitest | Business logic, >80% coverage |
| Integration | Vitest + supertest | API endpoints, database |
| E2E | Playwright + playwright-bdd | User workflows (Gherkin) |

### Test Selectors: data-testid First

Always use `data-testid` as primary selector. Naming: kebab-case, include component context (e.g., `building-card-{id}`, `tenant-name-input`). Avoid CSS selectors. See `docs/claude-reference.md` for E2E Gherkin details.
