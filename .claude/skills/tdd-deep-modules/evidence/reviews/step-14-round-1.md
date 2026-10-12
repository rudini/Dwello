# Review: Stage 3 step 14 (harness, protocol, fixtures), round 1 (commits b0a3e5a..e5d46c6)

Reviewer report (content as returned, condensed formatting).

## Summary
The skeleton is sound: identical task text, model, timeout and permission flags for every arm; hidden tests copied in mechanically and decide validity; reviewers get stripped production code under fresh random letters per reviewer, no Bash, no history; third reviewer on disagreement; gate logic matches the stated PASS conditions. `validate` passes; all six fixtures are deterministic and every hidden assertion checked follows from its task.md; kinds and interacting-module coverage meet the requirements. Three problems undermine the measurement: (1) isolation is not enforced: an arm session can read the Dwello checkout including `evals/stage3` (hidden tests, reference solutions) through the allowed `git -C <abs>` and `bun -e`, demonstrated; the README claims otherwise and the gate never looks at `outside_paths`; (2) the reviewer rubric copies the skill's own checklist ("exported helpers ... (classitis)" is the skill's extension of Ousterhout), so reviewers score conformance to what arm 3 is told to optimise; (3) nothing prevents cherry-picking: results and reviews are overwritten on rerun, and the gate cannot tell whether only the first valid attempt per slot was reviewed. Plus a likely bias against the TDD arms: neutral-named test-support files count as production code.

## Commands
- `harness/stage3 validate` (STAGE3_WORK/RESULTS in scratchpad/review14): all 6 ok, FIXTURES: OK (box-office 1/0, 0/22, 23/0; checkout 6/0, 4/12, 22/0; expense 1/0, 0/16, 17/0; opening-hours 1/0, 0/20, 21/0; holdout-a 1/0, 0/16, 17/0; holdout-b 1/0, 0/13, 14/0).
- `harness/stage3 gate --phase smoke` on smoke-results: smoke-g row, STAGE3: FAIL exit 1 (expected); `gate --phase pilot` without pilot groups: empty, exit 0.
- Smoke-skill transcript: the Skill call was denied (run predates a6bcc76, which added Skill to --allowedTools); the arm tried `find / ... -name tdd-deep-modules`, read SKILL.md by hand, worked without the hook; `outside_paths` was [] despite `find /`.
- Own headless probes with the arm flags: (a) Skill now loads the skill; (b) after loading, a production Write is blocked by tdd-guard; (c) `Read /home/user/Dwello/CLAUDE.md` denied, `ls ../../` blocked, `git -C /home/user/Dwello log -1` succeeded, `bun -e readdirSync(.../evals/stage3)` succeeded.
- Checked every hidden assertion of all 6 fixtures against task.md by hand incl. arithmetic; grepped for nondeterminism (only a deterministic `Date.UTC` in one reference).

## Findings
- **[major]** harness/stage3:31-37, README.md:15, harness/stage3:331-392 — arms are not isolated from `evals/` (`git -C`, `bun -e` reads demonstrated; hidden tests, references, other runs and review bundles exposed); run path names the checkout; `outside_paths` misses relative paths and `/`; the gate ignores `outside_paths` and denials. Fix: run each arm where the checkout and other runs are invisible (namespace/bubblewrap), neutral WORK path, gate on foreign paths, correct the README.
- **[major]** harness/stage3:50-57 — reviewer rubric paraphrases the skill's checklist (SKILL.md:77-80, references/depth.md:9-17), biasing toward arm 3. Fix: neutral Ousterhout definition, drop the enumerated symptoms, note it in the README.
- **[major]** harness/stage3:141-143, 221, 245-247, 275, 331-367 — selective reruns and re-reviews are undetectable (run dirs, run JSON and rev files overwritten; gate only checks reviewed runs). Fix: refuse overwrites, attempt files; gate requires the first valid attempt per fixture x arm x slot, replay ACCEPT for every valid arm-3 run in results, and reports all review attempts.
- **[major]** harness/stage3:119-126 — production files chosen by name, not reachability: neutral-named test helpers (builders, fake clocks) count as production and are shown to reviewers and depth_report, biased against the TDD arms. Fix: production = transitive import closure of the entry modules the hidden tests import.
- **[minor]** harness/stage3:303-310, 288-300 — a disagreement without a complete rev3 silently yields 0 (a hidden loss reads as a tie); stale rev3 on re-review. Fix: gate fails such a group; clear stale rev3.
- **[minor]** harness/stage3:337-340 — gate does not check that a group's three runs are distinct, of their arms, of the same fixture, not pilot runs.
- **[minor]** README.md:30, harness/stage3:368-370 — pilot control collected but never evaluated. Fix: print control delta per reviewer, flag UNRELIABLE when > 1, state the consequence.
- **[minor]** harness/stage3:33-37, 192-195 — arm 3's treatment not verified per run. Fix: record a successful Skill launch, gate requires it; rerun the smoke.
- **[minor]** harness/stage3:33 — arms keep side-channel tools (Task/Agent, Workflow, Artifact, SendMessage, Cron*, PushNotification). Fix: disallow identically for every arm.
- **[minor]** harness/stage3:201 — run directory named after the run id (incl. the arm), visible as cwd. Fix: opaque directories.
- **[minor]** fixtures/box-office-holds/meta.json:1 — `interacting_modules: true` for a single-module task. Fix: false, or have validate check coverage.
- **[nit]** fixtures/checkout-rounding-bug/task.md:204 — percent-discount rounding defined only by the starter's Math.round. Fix: state it in the task.
- **[nit]** harness/stage3:349-356 — control score printed as `c`, same letter as canon.

Hold-outs: consistent with their task texts, deterministic, design open; no issue. (The reviewer named abstract categories of the hold-outs in its report; see the response.)

VERDICT: FAIL
