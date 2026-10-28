# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: open functional issues, one pull request each (2026-10-28)

### #773 «Bitte ausfüllen» and «Gelesen» in «Rechnungen hochladen»
- [x] Scenarios: badge and status line in «Rechnungen hochladen, wenn keine KI gewählt ist»; changed status line in «Das Auslesen einer Datei scheitert» and «Dwello sagt, was nach dem Lesen zu tun ist …» (`Spec change approved: #773`); seen red
- [x] DOM tests: «Gelesen: …», badge «Bitte ausfüllen» for a file nobody read, no progress with «Keine KI»; seen red
- [x] Code: `stateOf` in `src/lib/invoice-upload.ts`, `InvoiceUploadRow.svelte`, `InvoiceUploadDialog.svelte`, `messages/*.json`
- [x] Slice review round 1: `docs/reviews/773-review-1.md`
- [x] Persona Helga: `docs/design/personas/helga-773.md` (run 1 with a reading KI stand-in did not reach the state, not kept)
- [x] Helga P-1 (Major, «Gelesen: 1 von 1» next to «nicht gelesen»): product owner decided 2026-10-28, counts only once all are read; DOM tests seen red
- [x] Closing review: `docs/reviews/773-review-2.md`
- [x] PR merged: #929

### #484 Glossary row «Erledigt»
- [x] Row «Erledigt» in `UBIQUITOUS_LANGUAGE.md` as decided on 2026-10-28 (proposal of domain review 448-4 V-28, `settled`)
- [x] Help texts checked: `glossary_balance_text`, `glossary_settled_text` and the help at «Bezahlt am» already follow #448; no marker names #484
- [x] No scenario: glossary text only, no app change
- [x] PR merged: #930

### #512 Missing statements before a change of the period setting
- [x] `@wip` scenarios (contract page, wizard link, Übersicht), seen red at the missing behaviour; the setting stays «Kalenderjahr», the building's statements follow «Juli – Juni» (no global setting changed)
- [x] `fach-reviewer` round 1: `docs/reviews/512-fachreview-1.md`; V-1 (switch point by the first statement under the setting), V-2 (hint #486 in the row of the short period, new scenario), V-3 (Übersicht reads the building's statements) fixed before green; V-4 (two changes of the setting) stays in the report
- [x] Unit tests of the rule in `backend/src/__tests__/accounting-period.test.ts`, seen red; case a of V-1 pins kept behaviour
- [x] Code: `backend/src/services/accounting-period.ts`, `statement-run.service.ts`, `src/routes/contracts/[id]/MissingStatement.svelte`
- [ ] Slice review (`code-reviewer`)
- [ ] Persona Dr. Weber, Helga
- [ ] PR merged
