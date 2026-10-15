# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (11): #159 list filters keep old values after a navigation

Request (chat): work through the open bug issues one by one (see session 10 in the archive); this is the second, #147 merged in #218. Next: #208, then #209.

The filter forms of apartments, buildings and invoices copy the URL into `$state` once (`untrack`), so a later navigation within the list (empty-state link, back/forward, pagination) leaves the old values. Tenants and contracts render their GET forms from `$page` (`value=`, `selected=`), to be checked by a DOM test. Invoices are not in the issue's "Where" but are a list with the same pattern; "Done means" says any list, so they are included.

- [x] Scenario «Filter nach dem Zurücksetzen leer» (`apartments.feature`, `@wip`) red
  Scenario red: `die Wohnungssuche ist leer` – Expected "", Received "Gibt es nicht" (again after replacing the anchor «ist die Wohnung 2.01 Leer», which found 2.01 of parallel scenarios, by «zeigt die Wohnungsliste wieder Wohnungen»)
- [x] DOM tests: apartments (back), buildings, tenants, contracts, invoices follow the URL after a navigation (`list-filters.dom.test.ts`)
  Test red: «Filter der Liste /apartments|/buildings|/invoices › ist leer, wenn …» – expected 'Ahornh' to be ''; «… zeigt nach «Zurück» …» – the later term; «zeigt nach «Filter zurücksetzen» wieder alle Status» – expected 'reserved' to be ''. Tenants and contracts were green already (GET forms rendered from `$page`); statements follow the URL through a writable `$derived` and were not added
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Fix: `{#key $page.url.search}` around `ApartmentFilters` and `InvoiceSearch`; buildings' search and city as writable `$derived` (as `StatementSearch`)
- [x] Checks: test:coverage (2458), lint, check, backend type-check, deepcheck:audit, E2E apartments, buildings, invoices, tenants, contracts (38 passed); backend test: 615 pass, the `afterAll` of `swiss-today.pg.test.ts` fails on `main` too at this hour -> `offene-punkte.md` H-27
- [x] The two observations in the issue's comment (statements: filter lost after deleting a draft, deleted draft from the browser cache) are not in «Done means» and existed before -> `offene-punkte.md` U-31
- [ ] code-reviewer round(s)
- [ ] Persona (list screens changed: what a filter form shows)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-159.md`
- [ ] Archive session, push, PR `Fixes #159`, CI, merge
