# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: shorter CLAUDE.md (guide review G-1, G-2, G-5, G-8)

Request (chat): «Setze G-1, G-2, G-5 und G-8 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #266 is merged. Step numbers 1–9 stay, since agents, skills and tools cite them.

- [x] G-1 (4'955 → 3'200 words; the rest are daily rules: conventions, design, gotchas, so the 2'000 of the proposal is not reached): rare procedures out of `CLAUDE.md` into what loads on demand: skills `pull-request`, `workflow-review`, `commit-gates`; findings and rounds to `slice-review`; feature-review details to `docs/design/personas/README.md`; the KI eval case to `backend/CLAUDE.md`; target about 2'000 words
- [x] G-2: round limit and closing round in one sentence each
- [x] G-5: every point where to ask in one list
- [x] G-8: a short "Done means" list at the start of "Workflow"
- [x] Nothing lost: every rule that left `CLAUDE.md` exists at its new place, `CLAUDE.md` points there
- [ ] `code-reviewer` round
  code-reviewer round 1 (docs/reviews/shorter-review-1.md): fixed C-1 (Major: check for open `entscheiden` issues back in "Open work"), C-2 (Major: stop hook rule back in step 9), C-3..C-13, C-15, C-16; rejected C-14: «or that there is none» names the case of a pull request without UI changes, where CI posts no screenshot comment (#264)
- [x] Checks (exit 0 each, frontend 2619, backend 683): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [ ] Archive the session, push after #266 is merged, pull request, CI, merge
