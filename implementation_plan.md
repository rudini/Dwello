# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (10): #147 contract form shows empty lists when they cannot be loaded

Request (chat): work through the open bug issues one by one, each with its own pull request, merged before the next starts. Issues with `entscheiden` are not started (#191, #141, #138, #136, #131, #130, #124, #93). Order: #147, #159, #208, #209.

The edit page (`contracts/[id]/edit`) no longer loads tenants or apartments since #152 (both are fixed and only named), so the gap the issue names is gone there; the new-contract page (`contracts/new`), which the issue says to check, has it: a failed `/tenants` or `/apartments` gives an empty choice. Following the code, not the wording (CLAUDE.md, Coding guidelines). No scenario: the state needs a failing request between the load function and the backend (CLAUDE.md, Workflow 1). No persona: the text is reachable only through that server-side failure.

- [ ] Test first: `contract-new-load.test.ts` with a failing tenants and a failing apartments response -> load error
- [ ] Fix in `src/routes/contracts/new/+page.server.ts`, new text in `messages/{de,fr,it,en}.json`
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit
- [ ] code-reviewer round(s)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-147.md`
- [ ] Archive session, push, PR `Fixes #147`, CI, merge
