# Architecture: Minimum Viable Architecture for Dwello

## Goal

Dwello should have a **Minimum Viable Architecture (MVA)** in the sense of _Continuous Architecture in Practice_ (Erder, Pureur, Woods): the smallest architecture that meets the quality requirements, and no more.

This gives the approach:

1. **Quality attributes before functions** (principle 2): the architecture is measured against the quality scenarios below, not against a target picture.
2. **Delay decisions** (principle 3): an architecture change needs a scenario that is not met today. Without such a scenario the structure stays as it is.
3. **Record decisions:** every decision taken or deliberately deferred becomes its own ADR in `docs/adr/` (created in step 1).
4. **Small steps:** refactorings preserve behavior, are covered by tests, and moves and behavior changes land in separate commits.

Constraints: one developer, one user, fewer than 50 apartments, one PostgreSQL database, no distributed system. The backend has about 10,000 lines without tests. The business logic sits in two layers: `backend/src/routes` (HTTP) and `backend/src/services` (business logic and data access); next to them are `db/`, `config/`, `mail/` and `middleware/`.

## Quality scenarios

Scenario and measure presuppose no design; the files in the column "Status and evidence" show where the scenario is met today. Measured against the code of October 2026.

| No. | Attribute | Scenario | Measure | Status and evidence |
| --- | --- | --- | --- | --- |
| Q1 | Modifiability | The property manager needs a new allocation key from floor area and number of rooms. | Without a code change. | ✅ Custom formulas (`formula.service.ts`); `distribution-keys.feature` |
| Q2 | Modifiability | Ollama is replaced by another LLM provider with an OpenAI-compatible API. | Without a code change, only through configuration (`.env`); the privacy statement covers both cases. | ✅ Any OpenAI-compatible API via `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` (`config/llm.ts`); `invoice-categorization.pg.test.ts`. The privacy statement names an external provider and its country from `LLM_PROVIDER`, `LLM_PROVIDER_COUNTRY` (`llm-recipient.test.ts`, `privacy.feature`) |
| Q3 | Modifiability | A change in the law affects how the utility cost statement is calculated. | No change to routes, UI or rendering. | ✅ Calculation in `calculation`, `prorating`, `distribution-key`, `formula`, `heating-profile` |
| Q4 | Modifiability | The PDF layout of the statement changes. | No change to the calculation. | ✅ `pdf.service.ts`; new fields also in `statement-pdf.service.ts` |
| Q5 | Testability | The calculation of a statement is checked. | In an automated test without a web server and without a PDF. | ✅ `generateStatement`; `statement-creation.pg.test.ts` |
| D1 | Data integrity | Someone tries to change or delete a sent, overdue or paid statement. | Rejected; amounts and line items stay unchanged. A test proves it. | ✅ Only a draft can be deleted, extended or have its amounts changed (`statement.service.ts`); `statement-lock.pg.test.ts`. A rental contract with a statement cannot be deleted |
| D2 | Data integrity | Statement generation aborts in the middle of writing. | No statement without its line items. | ✅ `db.transaction` in `createStatement`; `statement-creation.pg.test.ts` ("speichert keine Abrechnung, wenn …") |
| S1 | Security | A request without a valid session reaches the BFF or the backend. | Response 401 or redirect to login. | ✅ `auth-guard.test.ts`, `auth.pg.test.ts` |
| S2 | Security | A script in the browser tries to read the session. | The browser has no access to any token (HttpOnly cookie). | ❓ Built that way (BFF), but no test |
| P1 | Performance | In the wizard, the property manager generates the statements of a building with 50 apartments, including PDFs. | From start to the last statement under 60 s on the target hardware. | ❓ Not measured; the loop over the rental contracts runs in the BFF (`src/lib/server/statement-generation.ts`). The PRD states 60 s once and 10 s once; step 1 fixes the value |
| P2 | Performance | The property manager opens a list or the dashboard. | API response under 500 ms (p95), target from `docs/tech-stack.md`. | ❓ Not measured |
| R1 | Resilience | The LLM provider is unreachable. | Invoices can still be entered and categorized by hand. | ⚠️ Re-categorizing is tested (`invoice-detail.feature`); entering catches the error (`categorizeWithKi`), but without a test |
| R2 | Resilience | The database is lost. | At most one day of data loss, restore in under an hour, monthly restore drill (PRD). | ❌ No backup set up |

The list is a proposal. It applies once it is confirmed in an ADR (step 1).

## Structural flaws

These points blur the layering without violating a scenario themselves. They are fixed when the affected code is touched anyway.

- `config.service.ts` (configuration) imports `heatingProfileExists` and `distributionKeyExists` from the business services.
- `db/demo-data.ts` imports `statement.service` and `statement-pdf.service`. That is intended for the demo data, but it belongs with the scripts, not under `db/`.
- `routes/dashboard.ts` queries the database itself instead of going through a service.
- `reminder-pdf.ts` (rendering) imports its type from `reminder-letter.ts` (business logic of the payment reminder).
- `config/llm.ts` keeps the categories for the prompt (`SWISS_UTILITY_CATEGORIES`) as a second list next to the table `categories`; `utility-validation.service.ts` uses it as well.

## Implementation

Already done: statement generation moved from `routes/statements.ts` into `statement.service.ts` and `statement-pdf.service.ts`, with a transaction (Q5, D2). Every statement except a draft is locked, including an overdue one (D1).

### Step 1: confirm the scenarios, record the decisions

Status October 2026: open; `docs/adr/` does not exist yet.

- Confirm, extend or drop quality scenarios; fix the target value for P1.
- Decide whether an invoice that is part of a statement may be deleted. `deleteInvoice` does not check it, and statement line items do not reference invoices. If not: add it as a scenario.
- One short ADR per decision in `docs/adr/`. Initial set:
  - Two layers (routes, services) instead of module folders, as long as all modifiability scenarios are met.
  - One model and one language (`UBIQUITOUS_LANGUAGE.md`), no bounded contexts.
  - Read joins across business areas are allowed; there is a single database with foreign keys.
  - The deliberately deferred measures (see below).

Done when: the scenarios are confirmed and the ADRs exist.

### Step 2: close the open scenarios

Only for scenarios that are not met, each with a test that fails first:

- **R2:** daily database backup in `docker-compose.prod.yml`, documented restore, first drill.
- **R1, S2:** add the missing tests.
- **P1, P2:** measure once. If a target is missed, a scenario of its own with a measure.

Done when: all confirmed scenarios are met and proven.

### Step 3: stop

The refactoring ends here. Further measures only when a scenario is no longer met or a new one is added. The scenarios are re-evaluated with every larger change.

## When a scenario calls for a cut

If a modifiability scenario is no longer met later because changes scatter across too many services, this section is the starting point. It is a decision aid, not an assignment.

**Where effort pays off** (distillation after Evans):

- **Core: utility cost statement.** Allocation keys, proration, heating profiles, balance. This is where the business complexity and the value of the product sit.
- **Supporting: properties and invoices.** Master data, entry, categorization.
- **Generic: rendering (PDF, QR-bill), mail, authentication, configuration.** Replaceable technology.

**Possible modules** along the sections of `UBIQUITOUS_LANGUAGE.md`:

| Module | Services and other files |
| --- | --- |
| Property management (`rental`) | `building`, `apartment`, `tenant`, `contract` |
| Cost accounting (`costs`) | `invoice`, `category`, `llm`, `utility-validation`, `config/llm.ts` |
| Utility cost statement (`settlement`) | `distribution-key`, `formula`, `heating-profile`, `calculation`, `prorating`, `statement`, `statement-pdf`, `reminder`, `reminder-letter`, `document` |
| Infrastructure | `pdf`, `qr-bill`, `reminder-pdf`, `config`, `conflict`, `default-setting`, `mail/`, `middleware/`, `db/` |

Every route belongs to the module of its service; `routes/dashboard.ts` reads across all modules and stays outside.

**Dependency direction:** `settlement` imports `costs` and `rental`, `costs` imports `rental`; infrastructure imports no business module. Current deviations:

- `contract.service.ts` reads `utility_statements` (deletion guard, D1). Acceptable as a read access, or to be exported as a function from `settlement`.
- `invoices.distribution_key_id` references `distribution_keys`, and `invoice.service.ts` joins the table. This makes `costs` depend on `settlement`. Before a cut, decide whether the allocation key belongs to `costs` or the read join stays allowed.
- `config.service.ts`, `db/demo-data.ts` and `reminder-pdf.ts` (see structural flaws).

`fallow` can check architecture boundaries (zones and rules in `.fallowrc.json`, shown with `bunx fallow list --boundaries`); that would be the check in CI. No boundaries are configured today.

## Deliberately not implemented

| Measure | Introduce when |
| --- | --- |
| Module folders with `index.ts` and a boundary check | a modifiability scenario is not met because changes scatter |
| In-process domain events | a second consumer of the same event exists or processing must be asynchronous |
| Value objects (`Money`, `DateRange`), typed IDs | a rounding or mix-up bug occurs that types would have prevented |
| Read models / denormalization | P2 is not met |
| Anti-corruption layer | an external system with its own model is connected (e.g. bank, accounting); then with its own modifiability scenario |
| Repository layer | a scenario calls for switching the database or the ORM |
| Separate bounded contexts | a second team or a diverging model appears |
| Rebuilding the BFF (`src/lib/server`) | a scenario calls for logic in the BFF beyond proxying, cookies, XSRF and composing pages |

## Verification

- The checklist from `CLAUDE.md` is green (`bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, affected E2E scenarios).
- The column "Status and evidence" is up to date.
- `docs/design/offene-punkte.md` (O-8) is up to date.

## Risks

- **The plan grows again.** Every addition needs a scenario that is not met without it.
- **Scenarios go stale unnoticed.** Only scenarios with a test stay reliably proven. Today the test is missing for Q3 and Q4 (static dependencies, checkable with fallow boundaries), S2, P1, P2, R1 (entering) and R2.
