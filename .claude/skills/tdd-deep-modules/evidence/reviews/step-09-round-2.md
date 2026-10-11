# Review: Stage 2b step 09 (two-tier suite), round 2 (commit e214749)

Reviewer report (content as returned, condensed formatting).

## Summary
Both round-1 majors are fixed: A4 and A5c (and a variant where a `test:` commit narrows `test:fast`) are now rejected; good multi-task histories, ranges starting mid-task and mixed packages with and without `test:fast` are still accepted. Whole suite 217 OK; each fix red fails on an assertion for the right reason; each green passes the whole suite and touches only production files; refactor 481a9a1 keeps behaviour.

FAIL: the new task-end rule (a task ends at any green or refactor followed by a `test:` commit, and at the end of the range) rejects two histories that follow SKILL.md literally and that `tdd-step` accepts step by step: (1) the design note committed with `tdd-step test "design note"` as the last commit of the range runs fast and is rejected; (2) a test-list line added mid-task and committed with `tdd-step test` turns the fast green before it into a task end, which is rejected.

## Commands
- Clone of e214749, whole suite: 217 OK (216 s). Under load the commit signer failed and fixture commits exited 128 (100+ errors); later runs with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=commit.gpgsign GIT_CONFIG_VALUE_0=false`; not caused by the change.
- Fix reds 739f82d, a9766bd, f3ab15d each fail only their new test on an assertion; greens d733af0 (215 OK, replay.py only), 11c67b4 (216 OK, replay.py only), ddfc3d0 (217 OK, tdd-step only); refactor 481a9a1 217 OK, no test changed.
- Attacks (bun 1.4.2): accepted controls: two tasks each ending in a full refactor, a range starting at a green, one package with `test:fast` and one without, `test --suite full "design note"` at the end. Rejected as expected: a fast green whose production code skips a `.pg` test, a refactor narrowing `test:fast`, `tdd-step red sums --suite full`, `--suite=full sums`, `tidy --suite fast` (exit 2).
- SKILL.md 98 lines; original repo clean; clones removed.

## Round-1 findings
- [major] only the range end held to full: fixed (A4 rejected at the first green). Remaining gap: a second task without a `test:` commit merges with the first (A4'), documented.
- [major] `test:fast` edit hides a test: fixed (A5c rejected at the red; also in a `test:` commit or a refactor).
- [minor] stray `--suite`: fixed. [minor] red a81080a: recorded, accepted. [minor] tier rules in the CLI: fixed. [nits]: all fixed.

## New findings
- **[major]** replay.py:53-59 with SKILL.md:91 — the task-end rule runs on the range's last commit even when it is a `test:` commit; SKILL.md section 6 commits the design note with `tdd-step test "design note"` (fast), so test, red, green, refactor (full), test "design note" is rejected. Fix: judge the task end on the last green or refactor before trailing `test:` commits, or have section 6 say `--suite full`; add a test.
- **[major]** replay.py:56-57 with SKILL.md:53/63 — any `test:` commit after a green ends a task; SKILL.md section 3 adds list lines mid-task with `tdd-step test`, so test, red, green (fast), test "add a line", red, green, refactor (full), all made with the real `tdd-step`, rejects the first green. Fix: `tdd-step test` refuses when HEAD is a green or refactor not run full and passing, or SKILL.md says every `test:` commit ends the task and mid-task list edits ride in the next red; add a test.
- **[minor]** DESIGN.md:116 — a task that starts with a red merges with the one before (A4' accepted); state in SKILL.md section 3 that every task begins with its own `tdd-step test` commit.
- **[minor]** DESIGN.md:115 — within a task, a full refactor that makes a test broken by a fast green pass again changes behaviour and is accepted; flag "refactor turns failing tests green" or keep the limit documented.
- **[nit]** replay.py:66-68 — mid-range task ends get "the final commit must ..." messages.
- **[nit]** references/tooling.md:41 — says the trailer's tier plus the full suite are run; the code always runs both tiers. DESIGN.md:55 "never from its subject or trailers" contradicts how phase and tier are read.
- **[nit]** replay.py:148-149 — vitest packages run the identical command twice per replayed commit; reuse or document.
- **[nit]** tdd-step — a message whose first word starts with `--` exits 2; mention it.
- **[nit]** fixture.py:15-17 — fixture repos inherit the global `commit.gpgsign`; set it false per fixture repo.

VERDICT: FAIL
