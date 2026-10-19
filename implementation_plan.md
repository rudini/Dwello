# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session C1: E2E in every browser on pull requests

Branch `ccr-01e823d6-yhj5kc`. Product owner 2026-10-19: instead of a merge queue (only for repositories of an organisation), pull requests run the E2E tests in every browser, so a race only Firefox or WebKit loses shows before the merge (runs 595 to 614 on `main`). No scenario: CI only.

- [x] `ci.yml`: E2E on pull requests with Chromium, Firefox, WebKit and `api` (60 min, as `main`); the axe check stays Chromium; `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`
- [x] Slice review (`docs/reviews/ci-browsers-review-1.md`): C-1 `docs/tech-stack.md` fixed; C-2 (the axe shards get 60 min on pull requests too) kept, harmless
- [ ] PR: the first pull request with every browser shows the time it takes; its first run found a Firefox failure in «Suche ohne Treffer», cause not found (O-41)

## Session I2: open issues, one after another, continued (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: «Weiter mit issues» after Session I1. No open bug; #470 waits for a decision.

### #464 Akonto with a validity date and PDF line months × amount

Design: a table of Akonto amounts per Mietvertrag with the day from which each applies (migration: one row per contract from its Vertragsbeginn with today's amount; sent statements keep their stored totals); the statement sums each amount over the months (split months by days, as today) it applied; a berichtigte Abrechnung recalculates and so uses the amounts of its period; the contract keeps `monthlyAdvancePayment` as the amount that applies today. Coordinate with #453 (Akonto row «ab {Datum}»).

- [x] @wip scenarios (contract-edit, statement-generate, statement-detail), committed; fach-reviewer before the implementation (domain rule, amounts, PDF)
- [x] Steps and tests red until the review reports
- [x] fach-reviewer round 1 (`docs/reviews/464-fachreview-1.md`: F-1 to F-6 Major, F-7 to F-14 Minor, F-15 Nit); product owner 2026-10-19 (recorded in #464): F-4 option A (warning at the correction), «Gültig ab» only the first of a month within the contract, refusal when a stored statement's Akonto would change, the same day replaces and later entries can be deleted; glossary issue #477 (F-11, marker on «Gültig ab»)
- [x] Scenarios after the review: correction with a change inside 2024 (F-8), PDF lines with closed ranges and «Monate», total and the note (F-6, F-7, F-9), refusal (F-3), warning (F-4); all seven seen red at the missing behaviour
- [ ] Migration and schema; calculation over several amounts; contract API and form (amount with «gültig ab»); contract page lists the amounts; PDF lines; help texts in four languages
- [ ] Slice review, persona, daten-pruefer, closing review; PR `Fixes #464`

