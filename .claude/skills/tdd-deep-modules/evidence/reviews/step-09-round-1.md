# Review: Stage 2b step 09 (two-tier suite), round 1 (commit 610cd02)

Reviewer report (content as returned, condensed formatting).

## Summary
Most of the change is solid. The whole suite passes (209 tests). Each green passes the whole suite and changes only production files. Every red fails on an assertion for the right reason, the three pins hold against the recorded mutations, and the refactor 736f2b5 keeps behaviour. Dwello's `test:fast` passes without PostgreSQL. The tier rules for single-step cases (fast by default, `--suite full`, a green after a full red, a refactor on full, a missing or duplicate trailer, a final commit on fast or failing) all work and are tested.

FAIL, because two bad histories get ACCEPTED by `tdd_replay`:
1. In a range with several tasks, only the last commit of the range must run the full suite. A task can end with a green on the fast suite that breaks a database test, and the range is accepted ("the final commit of every task" is not met).
2. A red or a `test:` commit can edit `scripts["test:fast"]` to drop an existing test from the fast tier; a later green on the fast suite can then break that test and is accepted (a green that skips a test that ran in its tier before). Removed tests are only computed from the full runs.

## Commands
- Clone at 610cd02, whole suite: Ran 209 tests, OK (145 s).
- Reds (one fresh clone per commit, `tests.test_tiers` + modified module): each fails with exactly the new test on an assertion for the right reason (6fa98d2 "2 fail", d5b96ff `--suite full` ignored, 70d2772/4f7032c accepted step, f9dbc3e tier not run, cc44d0e message missing, 26eae9c/161b88a ACCEPT where REJECT expected, 3b8ab45 message only). Exception: a81080a fails 2 tests (the new one, and the existing usage test edited in the same red).
- Greens/pins/refactor (14 commits): whole suite OK at each (197 -> 209); greens touch only `tdd-step`, `tddcore/*.py`; pins pass on their first commit.
- Mutations redone at 610cd02: default tier fast->full, refactor rule off, replay `if removed:` off, green-after-full-red rule off: each FAILED (failures=1).
- Attacks (throwaway bun repos, bun 1.4.2):
  - A4 multi-task range (test, red fast, green fast breaking `sum.pg.test.ts`, test, red fast, green full repairing it): REPLAY: ACCEPT.
  - A5c red adds `mul.test.ts` and appends `--path-ignore-patterns=calc.test.ts` to `test:fast`; green on fast breaks `add`; refactor on full repairs: REPLAY: ACCEPT (control without the `test:fast` edit: REJECT).
  - A3 duplicate trailers rejected ("says fast,full"); a `TDD-Suite` line only in the body rejected ("says nothing").
  - A16 fast tier `bun test ./src`: same ids as full, good history ACCEPT.
  - S1 `tdd-step`: `red sums --suite full` and `red --suite=full sums` run fast and are refused with a misleading reason; `refactor tidy --suite fast` commits as `refactor: tidy --suite fast`; proper forms work.
- Dwello: `bun test --path-ignore-patterns='**/*.pg.test.ts'` 240 pass with PostgreSQL down; `suite.run(clone, "fast")` bun 0 of 240 failed, vitest 6 of 1300 failed (`form-selects.dom.test.ts`, caused by the reviewer's symlinked node_modules); `"full"` gives 46 errors outside tests (no database), as expected.
- SKILL.md 96 lines; original repo untouched; /tmp clones removed.

## Findings
- **[major]** scripts/tddcore/replay.py:53 — only the range's last commit is held to the full suite, not the last commit of every task (attack A4 ACCEPT); contradicts the requirement, SKILL.md:62 and DESIGN.md:115. Fix: treat the commit before each `test:` commit that follows a green/refactor as a task end and apply the same full/pass check there, or redefine and document what a task is.
- **[major]** scripts/tddcore/replay.py:103 — a green that skips a test is accepted when an earlier red or `test:` commit changes `scripts["test:fast"]` (attack A5c ACCEPT). Fix: compare tier runs (a test that ran in the previous fast run must still run in this fast run), or reject a commit whose fast tier loses test ids unless it runs on full. Add a test for each.
- **[minor]** scripts/tdd-step:57 — `--suite` only recognised right after the phase; elsewhere it becomes message text (`refactor tidy --suite fast` commits). Fix: reject other `--` arguments with exit 2 and usage.
- **[minor]** TDD history a81080a — the red fails more than its new test (old usage assertion edited in the same red). Note the exception.
- **[minor]** scripts/tdd-step:56 — the CLI holds tier rules (default tier per phase, tier vocabulary duplicated in `replay._judge`). Fix: `TIERS` and `default_tier(phase)` in `protocol`.
- **[nit]** replay.py:107 — "red's new test is not in the fast suite" changes no verdict (already rejected by other rules); message-only rule, say so.
- **[nit]** replay.py:20 — `Verdict.suite` default `"full"` unused; drop it.
- **[nit]** DESIGN.md:13 — interface table lacks `Verdict.suite`.
- **[nit]** docs/test-pyramid.md:102 — does not mention `bun run test:fast`.
- **[nit]** DESIGN.md (Tiers) — "no network" is loose (`mail.test.ts` binds localhost); say "no external network".

VERDICT: FAIL
