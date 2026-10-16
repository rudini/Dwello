# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: the other proposals of the guardrail analysis

Request (chat): «setze alle Vorschläge um», the proposals of the guardrail analysis not in PR #264. Rules, hooks, tooling and one test; no app behaviour, so no scenario. Own pull request after #264 is merged. Not in the repository: the stop hook `~/.claude/stop-hook-git-check.sh` (Blocked on me).

- [x] Fewer duplicate checks: no `deepcheck:audit` by hand after each step (the commit hook runs it; `tools/deepcheck/README.md`, its readme test and the `tdd` skill follow), full checks before the first push only, later pushes lint, check and the affected tests (`CLAUDE.md` Workflow 3, 4, 9). Kept: the fallow and deepcheck hooks on `git push`, which also gate merge commits that no commit hook sees (`git merge` commits without `git commit`)
- [x] `ponytail-review` as part of `code-reviewer` instead of its own step (`CLAUDE.md` Workflow 3, `.claude/agents/code-reviewer.md`)
- [x] Feature review: 1–2 personas by the matrix, all only for a new screen or flow; `fach-reviewer` only when texts or rules changed after its first review; `daten-pruefer` after the persona whose records it needs; SQL in `dwello_persona` also to clear blocking demo records (`CLAUDE.md` Workflow 5, `docs/design/personas/README.md`)
- [x] Persona stack builds into its own directories (`BUILD_DIR=/tmp/persona-app`, SvelteKit's `outDir` `.svelte-kit/persona`: outside the project Node cannot resolve the packages), so E2E may run while personas run (`svelte.config.js`, `persona-stack.sh`, Gotchas «One build»); shown: persona app answered 200 while `navigation.feature` «Fusszeile» ran, 3 passed
- [x] Triage: same cause from several reviewers is one finding; checks reported with exit codes (`slice-review`, Workflow 4)
- [x] Reviewed translation wording needs no red test of its own; work allowed while `fach-reviewer` runs (Workflow 1, 6)
- [x] Test: row IDs in `offene-punkte.md` are unique (`open-work.test.ts`)
- [x] Commit gate `--check "<subject>"` (`.claude/hooks/commit-msg-gate.mjs`, test); fallow gate: stash for a slice while the next is in progress (Gotchas)
- [x] Issue templates: how a landlord reaches the state, tests that pin today's behaviour; before starting, check open `entscheiden` issues on the same data (`.github/ISSUE_TEMPLATE/`, «Open work»)
- [x] `grill-me`: check decided texts against the cases the code produces
- [x] Split issue: several pull requests (`Refs`, last `Fixes`); a Major whose fix is another ready issue's decided text closes both (Workflow 8)
- [x] PDF strings outside `messages/*.json`: they are already one structure (`translations` in `pdf.service.ts`); the gap was a text missing in a language, which falls back to German: `backend/src/__tests__/pdf-translations.test.ts` (today complete except the shared `m²`)
- [x] Shorter `CLAUDE.md`: the «No scenario» cases to `tests/e2e/CLAUDE.md`, the persona details to `docs/design/personas/README.md`
- [ ] `code-reviewer` round
- [x] Checks (exit 0 each, frontend 2608 tests, backend 683): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [ ] Archive the session, push after #264 is merged, pull request, CI, merge
