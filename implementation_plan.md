# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (10): #147 contract form shows empty lists when they cannot be loaded

Request (chat): work through the open bug issues one by one, each with its own pull request, merged before the next starts. Issues with `entscheiden` are not started (#191, #141, #138, #136, #131, #130, #124, #93). Order: #147, #159, #208, #209.

The edit page (`contracts/[id]/edit`) no longer loads tenants or apartments since #152 (both are fixed and only named), so the gap the issue names is gone there; the new-contract page (`contracts/new`), which the issue says to check, has it: a failed `/tenants` or `/apartments` gives an empty choice. Following the code, not the wording (CLAUDE.md, Coding guidelines). No scenario: the state needs a failing request between the load function and the backend (CLAUDE.md, Workflow 1). No persona: the text is reachable only through that server-side failure.

- [x] Test first: `contract-new-load.test.ts` with a failing tenants and a failing apartments response -> load error
  Test red: «meldet einen Ladefehler, wenn tenants fehlen» / «… apartments fehlen» – promise resolved instead of rejecting; «… wenn das Backend nicht antwortet» (fix without `.catch`) – expected TypeError to match { status: 500 }
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Fix in `src/routes/contracts/new/+page.server.ts`, new text `contracts_choices_load_failed` in `messages/{de,fr,it,en}.json`
- [x] Checks: test:coverage (2447), lint, check, backend test (615) + type-check, deepcheck:audit
- [x] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/issue-147-review-1.md`): open -, fixed C-1 (Minor), C-2 (Minor), rejected C-3: passing the backend status on would show «Diese Seite gibt es nicht.» for a 404 of a list route; C-4: one text for both lists keeps the error page simple, the landlord's next step is the same
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-147.md`
- [ ] Archive session, push, PR `Fixes #147`, CI, merge
