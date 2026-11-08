## Session: 2026-11-08 workflow review 07.11./08.11., proposals 1 to 5

Product owner, 08.11.2026: «Setze 1 bis 5 um» (proposals of the closing report: 1 fitness per slice, 2 persona stack in a fresh container, 3 decisions name the scenarios they change, 4 the step-1 hold only for domain slices, 5 no own closing round for test-only changes). No scenario: tooling and rules only, nothing a user sees.

- [x] 1: `fitness.ts` ends with a summary line; hook `.claude/hooks/fitness-gate.sh` runs `fitness --base origin/main` on each commit that changes `src/`, `backend/src/` or `tools/fitness/` (tests in `tools/claude-hooks/fitness-gate.test.ts`, seen red); `settings.json`, CLAUDE.md (gates, «Before marking anything complete»), skill `commit-gates`
- [x] 2: `docs/design/tools/persona-stack.sh`: `bun run i18n` and `svelte-kit sync` before the build, «not ready» with the end of the build log on a failed build (red shown by a fresh-tree reproduction)
- [x] 3: skill `grill-me`: list every non-`@wip` scenario whose steps reach the changed element
- [x] 4: CLAUDE.md Workflow 1: the hold covers only behaviours whose texts or domain rules the review reads
- [x] 5: CLAUDE.md Workflow 7 and skill `pull-request`: a change of test titles, or a Minor fix only in tests, rides the next round's prompt
- [x] Decisions recorded in `workflow-rules-review-2026-11-07.md` and `-11-08.md`
- [x] code-reviewer `docs/reviews/wfr1108-review-1.md`: no Blocker/Major; C-1 Minor (no test of the run without origin/main) fixed in the first hook test, seen red with the base always passed; a Minor fix only in a test file, so no round of its own (Workflow 7)
- [x] Archive the session; PR pushed after this archive
