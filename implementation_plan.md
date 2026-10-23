# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session H-28: heating hints of a run in the backend

H-28 (`docs/design/offene-punkte.md`), statement rules: which heating hints a run shows (#339 heating invoices without Leistungszeitraum only at a move-in or move-out with a Heizprofil; #335 a sent statement under the old rule only when the run bills another contract of its apartment) is decided in the backend, not in `src/lib/server/statement-generation.ts` (`heatingHints`, `runContracts`, `movesIn`, `rebills`). Stacked on #646. No scenario: behaviour unchanged, the hints keep their scenarios.

- [x] Backend: pure `runHeatingHints` in `statement-run.service.ts`, tests red first
- [x] Backend: route `GET /statements/run-heating`, contract, api-contracts test
- [x] BFF: `heatingHints` takes the backend's answer; `runContracts`, `movesIn`, `rebills` gone
- [x] Slice review `code-reviewer` round 1: `docs/reviews/h28c-review-1.md` (E-1 open question: #647)
- [ ] Merge `main` after #646, before complete, closing round, PR
