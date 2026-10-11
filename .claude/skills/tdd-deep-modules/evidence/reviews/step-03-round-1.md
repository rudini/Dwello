# Review of step 3: `tdd-guard` PreToolUse hook (round 1)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
The frontmatter registration matches the documented skill-hooks format; the TDD history is clean; the green/refactor deviation is justified and correctly implemented. Two real holes, independent of the deviation: (1) `file_path` is never normalised, so a production file reached through `tests/..` counts as a test file and the edit is allowed; (2) if the path reaches the repo through a symlink, or its case differs from git's, the hook crashes with an uncaught `ValueError` -> exit 1 (non-blocking), so every edit goes through. Fix: resolve the target before `relative_to`.

## Commands run (key output)
- `-p 'test_tdd_guard.py'`: 8 OK; `-p 'test_skill_registration.py'`: 1 OK. `git ls-files -s scripts/tdd-guard` -> 100755.
- Docs: skill hooks use the settings format; exit 2 blocks with stderr as the reason, other non-zero exits are non-blocking; matcher `Write|Edit|MultiEdit` is an exact-name list; double-quoted path placeholder; no `${CLAUDE_SKILL_DIR}` for hooks, so `"$CLAUDE_PROJECT_DIR"/...` is the documented choice.
- Probes after `test: list`: `r/src/calc.ts` [2]; `r/tests/../src/calc.ts` [0] allowed; `r/src/../tests/../calc.ts` [0] allowed; `link/src/calc.ts` via symlink [1] ValueError fail-open; relative `src/calc.ts` [1] ValueError; `r/src/calc.TS` [0]; `src/test_utils.ts`, `src/app.test.utils.ts`, `src/calc_spec.ts` [0] (inherited classification); nested repo with HEAD `green: x` [0] (defensible); detached HEAD [2]; unborn [2]; `package.json`, `vite.config.ts`, `test/server.ts`, `README.md` [0].
- Every step-3 red fails only its test for the intended behaviour; greens OK; pins pass on first run. Mutations (start allowed, `is_production` removed, test allowed, outside git -> 2) all caught; pin evidence reproduces.

## Findings
- [major] `tdd-guard:20-25`: no path normalisation; `..` bypasses the guard.
- [major] `tdd-guard:25`: symlinked or case-different paths fail open with a traceback (ValueError, exit 1).
- [minor] `tdd-guard:17-24`: other unexpected input shapes crash into fail-open with a traceback.
- [minor] only Write/Edit/MultiEdit are guarded (Bash, NotebookEdit not); not listed in Known limits.
- [minor] `SKILL.md:9`: hook path assumes the skill lives at `$CLAUDE_PROJECT_DIR/.claude/skills/tdd-deep-modules`; elsewhere `sh` exits 127 (non-blocking); undocumented.
- [minor] `protocol._is_code`: suffix check is case-sensitive (`calc.TS`).
- [minor] `protocol._is_test`: generous name heuristics (`src/test_utils.ts`, `src/app.test.utils.ts`).
- [nit] green 4378202 rewrote the module into `main()` and changed the `git log` cwd; the restructure belonged in a refactor.
- [nit] some reds fail on a crash rather than a behavioural assertion (acceptable).

## Deviation
Reasonable and correctly implemented; tested; documented weak spot (behaviour smuggled into a refactor).

## Deep-module assessment
Thin CLI delegating policy to `tddcore.protocol`; the allowed phases are hard-coded in the CLI instead of derived from protocol (small duplication). Path resolution is the wrong part and belongs in this layer.

VERDICT: FAIL
