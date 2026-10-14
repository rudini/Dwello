# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 36 - October 2026: KI proposes «Umlagefähig» for a new Kategorie (#176)

From the issue (decided by the product owner 2026-10-14): the KI proposes whether a new Kategorie is umlagefähig with its reasoning, the Liegenschaftsverwalter decides; without a KI answer nothing is preset; the prompt names Art. 257a–257b OR and Art. 4–6 VMWG; Schädlingsbekämpfung and Feuerlöscher-Wartung become nicht umlagefähig; an evaluation script without threshold. Assumptions: the KI is asked with a button «Von der KI prüfen lassen» after the name (the form action pattern of «Formel testen»), not on every keystroke; «umlagefähig» becomes a choice of two (radio) so «not chosen yet» exists; the seed is changed in `0002_stammdaten.sql`, not in a new migration (`backend/CLAUDE.md`: until the first installation; this overrides the issue's «new migration»); in E2E a local KI stand-in answers only the category prompt (invoice scenarios keep «KI nicht erreichbar»).

- [x] Scenarios `@wip` in `categories.feature` (KI proposal, override, no choice), seen red; KI stand-in `backend/scripts/llm-stub.ts` for E2E
  - Scenario red: «KI schlägt vor …» and «… übersteuert …»: `waiting for getByTestId('category-propose-button')`; «Neue Kategorie ohne Wahl …»: `sees whether shown: Fehlermeldung «Wählen Sie, ob die Kosten umlagefähig sind.»` false
- [x] fach-reviewer round 1 on scenarios and seed table (before production code); decided by the product owner after it: prompt quotes Art. 256 Abs. 1, 256b, 257a, 257b OR and Art. 4–6c VMWG (F-3), Abwasser and Kaltwasser descriptions (F-9), glossary rows moved once by this session (F-1); F-2 became #180, F-7 a comment on #75
- [x] Slice 1, Stammdaten (Test red: `allocable-categories.pg.test.ts` – Pest Control and Fire Extinguisher Maintenance received true, both in the statement): Schädlingsbekämpfung, Feuerlöscher-Wartung nicht umlagefähig; Lift, Hauswart, Abwasser and Kaltwasser descriptions; glossary, `docs/data-model.md`, `docs/PRD-Dwello.md`; pg test over every seeded Kategorie in its own file `allocable-categories.pg.test.ts` instead of `statement-generation.pg.test.ts`, whose amounts it would change (statement takes its invoice exactly when allowed, expected values written out)
  - Scenario red (C-1, added after review): «Vordefinierte Kategorien, deren Kosten der Vermieter trägt» on the old seed – `sees the text of Umlagefähigkeit der Kategorie Schädlingsbekämpfung` «Umlagefähig»; green on the new seed
- [x] Slice 2, prompt basis: shared legal constant `LEGAL_BASIS` (verbatim Fedlex: Art. 256 Abs. 1, 256b, 257a, 257b OR; Art. 4 Abs. 3, 5, 6, 6a, 6b, 6c Abs. 3 VMWG), invoice prompt and `GET /invoices/utility-rules` from the database categories (custom ones included) instead of `SWISS_UTILITY_CATEGORIES`
  - Test red: `llm-prompt.test.ts` «zitiert OR und VMWG wörtlich» and «bietet die Kategorien der Stammdaten an» – toContain failed; `utility-rules.pg.test.ts` (moved from the unit file, now reads the database) «folgt den Stammdaten: Schädlingsbekämpfung …» – not in notAllowedCategories; `invoice-categorization.pg.test.ts` «bietet der KI auch eigene Kategorien an» – custom name missing from the prompt
  - No scenario: the prompt runs only on the server, the E2E KI stand-in answers no invoice prompt, and no screen shows `utility-rules` (D-1)
- [ ] Slice 3, proposal: backend `POST /categories/propose` (KI answer, low confidence or no KI gives `KI_NO_PROPOSAL`), BFF action `propose`, form with choice, reasoning, help; texts de/fr/it/en; a11y and language screens
- [ ] Slice 4: evaluation script `backend/scripts/llm-eval.ts` (about 30 cost types from the leaflet, hit rate, outside CI)
- [ ] code-reviewer per slice; feature review (personas, fach-reviewer, daten-pruefer)
- [ ] Docs: `docs/nebenkostenabrechnung-anforderungen.md:29`, `docs/api-specification.md`, `docs/data-model.md` if touched
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-176.md`
- [ ] Checks, push, pull request `Fixes #176`, session archived

Skills: tdd, ponytail, ponytail-review (slice 1: nothing to cut, one table and one regex; slice 2: dropped the hard-coded category list instead of syncing it).

fach-reviewer round 1 (`docs/reviews/176-fachreview-1.md`): fixed F-1 (Major, glossary moved with the product owner's leave), F-4, F-8, F-10; fixed F-3 (slice 2), F-9 (slice 1); open F-5, F-6, F-11 (Minor, slice 3); F-2 → #180, F-7 → #75
code-reviewer slice 1 round 1 (`docs/reviews/176-s1-review-1.md`): fixed C-1 (Major, scenario), C-2 (slice 2), C-3, C-7, C-9, C-10; open C-4 (with F-6 in slice 3), C-6 (slice 3 shows the category scenarios green), C-8 (help text in slice 3); rejected C-5: steps may ask questions through the actor (`tests/e2e/CLAUDE.md`, Layers), the wait belongs to the Given that needs the proposal shown
code-reviewer slice 2 round 1 (`docs/reviews/176-s2-review-1.md`): fixed D-1, D-2, D-3 (Minor; cache keyed by the prompt, test red: «fragt die KI neu, sobald es eine neue Kategorie gibt» – received 1 prompt, expected 2), D-5, D-6, D-7, D-8 (Nit); D-10 (Nit) goes to the fach-reviewer in the feature review; rejected D-4: the count subquery is noise next to the KI call for under 50 apartments, a second query function would only be a thinner copy; D-9: the endpoint has no screen, custom categories take the same filter as seeded ones
