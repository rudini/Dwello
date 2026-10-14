# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 36 - October 2026: KI proposes «Umlagefähig» for a new Kategorie (#176)

From the issue (decided by the product owner 2026-10-14): the KI proposes whether a new Kategorie is umlagefähig with its reasoning, the Liegenschaftsverwalter decides; without a KI answer nothing is preset; the prompt names Art. 257a–257b OR and Art. 4–6 VMWG; Schädlingsbekämpfung and Feuerlöscher-Wartung become nicht umlagefähig; an evaluation script without threshold. Assumptions: the KI is asked with a button «Von der KI prüfen lassen» after the name (the form action pattern of «Formel testen»), not on every keystroke; «umlagefähig» becomes a choice of two (radio) so «not chosen yet» exists; the seed is changed in `0002_stammdaten.sql`, not in a new migration (`backend/CLAUDE.md`: until the first installation; this overrides the issue's «new migration»); in E2E a local KI stand-in answers only the category prompt (invoice scenarios keep «KI nicht erreichbar»).

- [x] Scenarios `@wip` in `categories.feature` (KI proposal, override, no choice), seen red; KI stand-in `backend/scripts/llm-stub.ts` for E2E
  - Scenario red: «KI schlägt vor …» and «… übersteuert …»: `waiting for getByTestId('category-propose-button')`; «Neue Kategorie ohne Wahl …»: `sees whether shown: Fehlermeldung «Wählen Sie, ob die Kosten umlagefähig sind.»` false
- [x] fach-reviewer round 1 on scenarios and seed table (before production code); decided by the product owner after it: prompt quotes Art. 256 Abs. 1, 256b, 257a, 257b OR and Art. 4–6c VMWG (F-3), Abwasser and Kaltwasser descriptions (F-9), glossary rows moved once by this session (F-1); F-2 became #180, F-7 a comment on #75
- [x] Slice 1, Stammdaten (Test red: `allocable-categories.pg.test.ts` – Pest Control and Fire Extinguisher Maintenance received true, both in the statement): Schädlingsbekämpfung, Feuerlöscher-Wartung nicht umlagefähig; Lift, Hauswart, Abwasser and Kaltwasser descriptions; glossary, `docs/data-model.md`, `docs/PRD-Dwello.md`; pg test over every seeded Kategorie (statement takes its invoice exactly when allowed, expected values written out)
- [ ] Slice 2, prompt basis: shared legal constant (verbatim Fedlex), invoice prompt from the database categories (custom ones included) instead of `SWISS_UTILITY_CATEGORIES`
- [ ] Slice 3, proposal: backend `POST /categories/propose` (KI answer, low confidence or no KI gives `KI_NO_PROPOSAL`), BFF action `propose`, form with choice, reasoning, help; texts de/fr/it/en; a11y and language screens
- [ ] Slice 4: evaluation script `backend/scripts/llm-eval.ts` (about 30 cost types from the leaflet, hit rate, outside CI)
- [ ] code-reviewer per slice; feature review (personas, fach-reviewer, daten-pruefer)
- [ ] Docs: `docs/nebenkostenabrechnung-anforderungen.md:29`, `docs/api-specification.md`, `docs/data-model.md` if touched
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-176.md`
- [ ] Checks, push, pull request `Fixes #176`, session archived

Skills: tdd, ponytail (slice 1; ponytail-review: nothing to cut, one table and one regex).

fach-reviewer round 1 (`docs/reviews/176-fachreview-1.md`): fixed F-1 (Major, glossary moved with the product owner's leave), F-4, F-8, F-10; open F-3, F-5, F-6, F-9, F-11 (Minor, slices 2–3); F-2 → #180, F-7 → #75
