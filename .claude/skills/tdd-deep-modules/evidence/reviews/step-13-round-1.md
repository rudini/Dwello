# Review: Stage 2b step 13 (depth check defers to deepcheck), round 1 (commit 6faa8f49)

Reviewer report (content as returned, condensed formatting).

## Summary
Mechanically sound: red cd04f242 fails exactly the new test on an `assertIn`; green 6faa8f49 passes the suites, `skill_lint` OK, SKILL.md 98 lines, `verify_all` STAGE2B: PASS with the lock intact. The added sentence contains one false claim and one overstatement.

## Commands
- cd04f242: 45 tests, 1 failure (`'`bun run deepcheck:audit`' not found`). 6faa8f49: 45 OK; `skill_lint` OK; 98 lines; `sha256sum --check` exit 0; `verify_all` STAGE2B: PASS. Diff fa4b3399..6faa8f49: SKILL.md (+1/-1), test_skill_md.py (+7).
- Read tools/deepcheck/README.md, `.claude/hooks/deepcheck-gate.sh`, `.claude/settings.json`; no active git hooks. The hook's regex does not match `scripts/tdd-step green "x"`; `scripts/tdd-step:89` commits through a subprocess.

## Findings
- **[major]** SKILL.md:75 — "also run by a hook before every commit" is false here: the gate is a PreToolUse hook on the Bash command text; `tdd-step` commits through a subprocess, so the hook fires only on `git push` (and CI runs it). Fix: say so, or drop the clause.
- **[major]** SKILL.md:75 — "`depth_report` then only adds the swarm" understates: deepcheck also has no "untested" metric and no several-tiny-classes-in-one-file classitis. Fix: "still adds what deepcheck does not check, above all the swarm (and untested modules)".
- **[minor]** SKILL.md:75 — tied to refactor only, while Dwello's CLAUDE.md runs `deepcheck:audit` after each implementation step; it judges changes against HEAD, so it must run before the `tdd-step` commit. Fix: "after each green and refactor, before `tdd-step` commits".
- **[nit]** "its verdict wins" vs "prompts, not verdicts" (references/depth.md, deepcheck README); say "its gate result wins".
- **[nit]** the test does not pin the hook clause.

VERDICT: FAIL
