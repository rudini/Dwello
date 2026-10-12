# Stage 3 report: does tdd-deep-modules produce deeper modules?

Date: 2026-10-12. Protocol: `README.md`. Every number below comes from `harness/stage3 tables` and `harness/stage3 gate` over `results/` (the tables are reproduced in full at the end); nothing was entered by hand. Raw values only, no significance claims: with 3 runs per fixture and arm, none would be warranted.

## Result

- **The stage-3 criterion is not met.** The gate requires, for each of the 6 fixtures, that the skill arm is rated deeper than baseline in a majority of its runs and shallower in none. Over all 17 reviewed main-phase groups the skill arm was rated deeper than baseline in 13, equal in 2 and shallower in 2. The two losses fall on two visible fixtures: `box-office-holds` (slot r3) and `opening-hours-parser` (slot r1). In addition, `holdout-a` has only 2 of its 3 groups, because the canon arm produced no valid run in slot r2 within the 5 allowed attempts. The gate therefore prints `STAGE3: FAIL`.
- **tdd_replay accepted every arm-3 run** (all 24 attempts, the 20 valid ones included, pilot and hold-outs included), and the skill was loaded in every arm-3 attempt.
- **Against plain Canon TDD the skill is not shown to be better: attribution is unproven.** Skill vs canon over all 17 groups: 10 deeper, 2 equal, 5 shallower. Canon beat the skill in a majority of runs in `holdout-b` (1/0/2) and tied it on `holdout-a` (1/0/1). What separates the TDD arms from baseline is visible; what the skill adds beyond test-first work is not.
- Effort differs a lot. Summed over all finished attempts, baseline cost 7.82 USD, canon 31.38 USD and the skill 39.84 USD. Skill runs made 884 commits against canon's 331 and baseline's 21.

## Per fixture (main phase, final comparisons per group; wins/ties/losses for the skill)

| fixture | kind | groups | skill vs baseline | skill vs canon | criterion |
|---|---|---|---|---|---|
| box-office-holds | visible, stateful | 3 | 2/0/1 | 2/1/0 | not met (one loss) |
| checkout-rounding-bug | visible, bug fix | 3 | 2/1/0 | 3/0/0 | met |
| expense-policy-review | visible, multi-module | 3 | 3/0/0 | 2/0/1 | met |
| opening-hours-parser | visible, parsing | 3 | 2/0/1 | 1/1/1 | not met (one loss) |
| holdout-a | hold-out, multi-module | 2 of 3 | 2/0/0 | 1/0/1 | incomplete (slot r2: no valid canon run in 5 attempts) |
| holdout-b | hold-out, stateful | 3 | 2/1/0 | 1/0/2 | met |

## Per arm

| arm | attempts | valid | invalid attempts and causes | cost USD | turns | minutes | commits |
|---|---|---|---|---|---|---|---|
| baseline | 21 | 20 | 1: hidden tests (holdout-a ambiguity) | 7.82 | 250 | 35 | 21 |
| canon | 30 | 19 | 11: hidden tests (holdout-a ambiguity) | 31.38 | 2634 | 128 | 331 |
| skill | 24 | 20 | 4: 2 not committed (harness defect), 1 escape signal (`ps`), 1 hidden tests (holdout-a ambiguity) | 39.84 | 2531 | 158 | 884 |

Mean reviewer scores are not given; the per-reviewer scores of every group are in the tables below.

## Review rounds per step

| step | content | rounds | outcome |
|---|---|---|---|
| 14 | fixtures (by a separate agent), harness, protocol | 6 | Rounds 1-3 FAIL, and the work stopped after round 3 as the rule requires. The user then ordered a new review cycle: rounds 4-5 FAIL, round 6 PASS. The main issues were isolation of the sessions, a reviewer rubric copied from the skill, selection through reruns, and false positives of the escape check. |
| 15 | pilot (2 fixtures x 3 arms) | 1 | PASS |
| 16 | main phase, 4 visible fixtures | 1 | PASS |
| 17 | hold-out phase, this report, final gate | see `evidence/reviews/step-17-*` | |

## Failure cases

- **Harness defect, arm 3 only (2 attempts).** The skill copy in the run repositories lacked the skill's `.gitignore`. A session's own `tdd_replay` left an untracked `__pycache__`, so two complete arm-3 runs (`main-box-office-holds-skill-r3-a1`, `main-checkout-rounding-bug-skill-r1-a1`; hidden tests all green, replay ACCEPT) counted as "not committed".
  - The `.gitignore` was added after the first main attempts (commit 1ad43d0). Their slots were rerun mechanically under the pre-fixed rule; the replacement was not chosen by depth.
  - The rerun `box-office-holds` r3 is one of the two groups in which the skill lost to baseline.
  - In 10 of the 12 first-attempt arm-3 runs, `.pyc` files from that defect are committed in the arms' histories. They are not production code and never reached reviewers or the replay.
- **Escape signal (1 attempt).** `main-opening-hours-parser-skill-r2-a1` ran `ps` to look for a hung test process. `ps` was a signal before any run, so the run is invalid; its slot was rerun.
- **Ambiguous hold-out assertion (13 attempts).** In `holdout-a`, the task text says the first problem from the top is reported. It does not settle whether `ORDER 1` followed by the invalid line `RICE x0` is an invalid item at line 2 (the hidden test's reading) or an order without items at line 1. 13 attempts read it the second way: canon 11 of 13, baseline 1 of 4, skill 1 of 4.
  - The hidden test was not changed: a verifier is never weakened.
  - During the hold-out phase, before the third attempts' results were known, the attempt cap of 5 per slot was added (README amendment), so rerunning would not select runs by this reading. Canon slot r2 stayed invalid after 5 attempts, and `holdout-a` has 2 reviewed groups.
  - The reading may correlate with parser structure: a line-by-line validator reports line 2, while an order-grouping parser reports line 1. So the reviewed canon runs in `holdout-a` are a selected sample.
- **Protocol deviations.**
  - The step-14 round-1 reviewer named abstract categories of the hold-outs in its report. The experimenter saw those words, but no task text, tests or code, before the final run.
  - Twice the cloud worker restarted, and a background batch was relaunched. No run was lost or duplicated: the pilot's records all start at the relaunch.

## Limits of the metric

- **Reviewers:** LLM sessions of the same model as the arms, rating depth from 1 to 10 under Ousterhout's definition. Ratings are coarse:
  - One implementation's scores across reviewers differ by 0 points in 24 cases, 1 point in 25 and 2 points in 2.
  - 9 of 19 groups needed a third reviewer.
  - Many comparisons hinge on a single point, so "shallower in none" is fragile.
- **Pilot control:** the control copy was byte-identical to the baseline, and reviewers recognised it. Its delta of 0 only shows that identical text gets identical scores; the spread above is the real consistency evidence.
- **Position:** letters were assigned randomly but ended up uneven. The skill was labelled C 21 times and A 7 times. Label C scored on average +0.13 above its reviewer's mean and B -0.15, so a small position effect in the skill's favour cannot be ruled out.
- **What depth is judged on:** the fixtures fix the public entry point.
  - Most solutions are one production file (all arms; the bug-fix fixture's closure includes the unchanged starter modules), so depth is judged at function and type level within one module, not across modules.
  - The "multi-module" fixtures did not lead any arm to split into several modules.
- **depth_report favours the skill arm by construction:** that arm is told to run it and fix its findings, and in the pilot it read the tool's source. Its findings are plausibility signals and are not cited as evidence of depth.
- **Isolation is a tripwire, not a barrier,** against a session that sets out to escape. The network is reachable by re-adding the proxy by hand; a filtering proxy was refused by the environment's safety classifier. Claude Code's credentials stay readable inside the sandbox. No escape was found in any transcript; the one signal was a `ps` call.
- **Sample size:** 3 runs per fixture and arm, one model, small tasks of 150-400 reference lines. The comparison does not generalise beyond that.

## Raw values

The following is the output of `harness/stage3 tables` (also in `results/TABLES.md`).

### Runs (every attempt)

| run | valid | reasons | hidden pass/fail | own tests | commits | turns | cost USD | minutes | production files | size | surface | depth_report findings | replay |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| main-box-office-holds-baseline-r1-a1 | yes | - | 22/0 | 11 | 1 | 10 | 0.39 | 1.8 | 1 | 157 | 11 | 1 | - |
| main-box-office-holds-baseline-r2-a1 | yes | - | 22/0 | 16 | 1 | 9 | 0.32 | 1.3 | 1 | 169 | 11 | 1 | - |
| main-box-office-holds-baseline-r3-a1 | yes | - | 22/0 | 12 | 1 | 11 | 0.35 | 2.1 | 1 | 161 | 11 | 1 | - |
| main-box-office-holds-canon-r1-a1 | yes | - | 22/0 | 37 | 14 | 78 | 0.91 | 3.5 | 1 | 150 | 11 | 1 | - |
| main-box-office-holds-canon-r2-a1 | yes | - | 22/0 | 42 | 10 | 85 | 1.05 | 4.5 | 1 | 143 | 11 | 1 | - |
| main-box-office-holds-canon-r3-a1 | yes | - | 22/0 | 35 | 14 | 83 | 0.98 | 3.6 | 1 | 148 | 11 | 1 | - |
| main-box-office-holds-skill-r1-a1 | yes | - | 22/0 | 21 | 48 | 137 | 1.84 | 6.3 | 1 | 131 | 11 | 1 | ACCEPT |
| main-box-office-holds-skill-r2-a1 | yes | - | 22/0 | 21 | 47 | 142 | 1.83 | 6.1 | 1 | 128 | 11 | 1 | ACCEPT |
| main-box-office-holds-skill-r3-a1 | no | not committed | 22/0 | 18 | 39 | 123 | 1.54 | 5.1 | 1 | 127 | 11 | 1 | ACCEPT |
| main-box-office-holds-skill-r3-a2 | yes | - | 22/0 | 24 | 52 | 146 | 1.87 | 6.0 | 1 | 126 | 11 | 1 | ACCEPT |
| main-checkout-rounding-bug-baseline-r1-a1 | yes | - | 16/0 | 13 | 1 | 14 | 0.32 | 1.7 | 5 | 160 | 34 | 6 | - |
| main-checkout-rounding-bug-baseline-r2-a1 | yes | - | 16/0 | 15 | 1 | 22 | 0.41 | 1.6 | 5 | 162 | 34 | 6 | - |
| main-checkout-rounding-bug-baseline-r3-a1 | yes | - | 16/0 | 13 | 1 | 16 | 0.33 | 1.2 | 5 | 163 | 34 | 6 | - |
| main-checkout-rounding-bug-canon-r1-a1 | yes | - | 16/0 | 18 | 7 | 65 | 0.68 | 2.6 | 5 | 164 | 34 | 6 | - |
| main-checkout-rounding-bug-canon-r2-a1 | yes | - | 16/0 | 18 | 2 | 58 | 0.61 | 2.3 | 5 | 163 | 37 | 5 | - |
| main-checkout-rounding-bug-canon-r3-a1 | yes | - | 16/0 | 18 | 7 | 59 | 0.61 | 2.4 | 5 | 159 | 34 | 6 | - |
| main-checkout-rounding-bug-skill-r1-a1 | no | not committed | 16/0 | 14 | 20 | 72 | 1.00 | 3.7 | 5 | 152 | 27 | 6 | ACCEPT |
| main-checkout-rounding-bug-skill-r1-a2 | yes | - | 16/0 | 13 | 17 | 61 | 0.87 | 3.2 | 5 | 160 | 29 | 6 | ACCEPT |
| main-checkout-rounding-bug-skill-r2-a1 | yes | - | 16/0 | 12 | 15 | 60 | 0.86 | 3.1 | 5 | 157 | 33 | 6 | ACCEPT |
| main-checkout-rounding-bug-skill-r3-a1 | yes | - | 16/0 | 15 | 21 | 90 | 1.29 | 4.5 | 4 | 153 | 22 | 5 | ACCEPT |
| main-expense-policy-review-baseline-r1-a1 | yes | - | 16/0 | 6 | 1 | 10 | 0.39 | 1.8 | 1 | 177 | 13 | 1 | - |
| main-expense-policy-review-baseline-r2-a1 | yes | - | 16/0 | 10 | 1 | 8 | 0.39 | 1.7 | 1 | 203 | 13 | 2 | - |
| main-expense-policy-review-baseline-r3-a1 | yes | - | 16/0 | 4 | 1 | 11 | 0.39 | 1.8 | 1 | 181 | 13 | 1 | - |
| main-expense-policy-review-canon-r1-a1 | yes | - | 16/0 | 67 | 3 | 108 | 1.38 | 5.2 | 1 | 164 | 13 | 2 | - |
| main-expense-policy-review-canon-r2-a1 | yes | - | 16/0 | 28 | 26 | 145 | 1.66 | 6.1 | 1 | 172 | 13 | 1 | - |
| main-expense-policy-review-canon-r3-a1 | yes | - | 16/0 | 24 | 20 | 94 | 1.16 | 4.3 | 1 | 169 | 13 | 1 | - |
| main-expense-policy-review-skill-r1-a1 | yes | - | 16/0 | 19 | 42 | 133 | 2.09 | 7.2 | 1 | 167 | 13 | 1 | ACCEPT |
| main-expense-policy-review-skill-r2-a1 | yes | - | 16/0 | 21 | 46 | 149 | 2.21 | 7.2 | 1 | 146 | 13 | 1 | ACCEPT |
| main-expense-policy-review-skill-r3-a1 | yes | - | 16/0 | 20 | 45 | 135 | 1.89 | 6.7 | 1 | 145 | 13 | 1 | ACCEPT |
| main-holdout-a-baseline-r1-a1 | no | hidden tests fail | 15/1 | 5 | 1 | 14 | 0.38 | 1.6 | 1 | 147 | 10 | 1 | - |
| main-holdout-a-baseline-r1-a2 | yes | - | 16/0 | 6 | 1 | 16 | 0.46 | 1.9 | 1 | 143 | 10 | 1 | - |
| main-holdout-a-baseline-r2-a1 | yes | - | 16/0 | 4 | 1 | 12 | 0.40 | 1.7 | 1 | 125 | 10 | 1 | - |
| main-holdout-a-baseline-r3-a1 | yes | - | 16/0 | 5 | 1 | 13 | 0.34 | 1.7 | 1 | 127 | 10 | 1 | - |
| main-holdout-a-canon-r1-a1 | no | hidden tests fail | 15/1 | 31 | 14 | 78 | 0.97 | 3.8 | 1 | 132 | 10 | 1 | - |
| main-holdout-a-canon-r1-a2 | no | hidden tests fail | 15/1 | 37 | 7 | 86 | 1.15 | 4.3 | 1 | 125 | 10 | 1 | - |
| main-holdout-a-canon-r1-a3 | yes | - | 16/0 | 46 | 7 | 108 | 1.28 | 4.8 | 1 | 125 | 10 | 1 | - |
| main-holdout-a-canon-r2-a1 | no | hidden tests fail | 15/1 | 37 | 4 | 80 | 0.99 | 3.8 | 1 | 133 | 10 | 1 | - |
| main-holdout-a-canon-r2-a2 | no | hidden tests fail | 15/1 | 39 | 10 | 114 | 1.28 | 4.6 | 1 | 127 | 10 | 1 | - |
| main-holdout-a-canon-r2-a3 | no | hidden tests fail | 15/1 | 33 | 16 | 70 | 0.92 | 3.6 | 1 | 129 | 10 | 1 | - |
| main-holdout-a-canon-r2-a4 | no | hidden tests fail | 15/1 | 39 | 6 | 109 | 1.25 | 4.6 | 1 | 130 | 10 | 1 | - |
| main-holdout-a-canon-r2-a5 | no | hidden tests fail | 15/1 | 29 | 16 | 71 | 0.87 | 3.5 | 1 | 121 | 10 | 1 | - |
| main-holdout-a-canon-r3-a1 | no | hidden tests fail | 15/1 | 36 | 19 | 115 | 1.27 | 4.8 | 1 | 128 | 10 | 1 | - |
| main-holdout-a-canon-r3-a2 | no | hidden tests fail | 15/1 | 34 | 11 | 87 | 1.06 | 4.2 | 1 | 130 | 10 | 1 | - |
| main-holdout-a-canon-r3-a3 | no | hidden tests fail | 15/1 | 44 | 5 | 84 | 1.10 | 4.2 | 1 | 124 | 10 | 1 | - |
| main-holdout-a-canon-r3-a4 | no | hidden tests fail | 15/1 | 34 | 14 | 95 | 1.07 | 4.1 | 1 | 133 | 10 | 1 | - |
| main-holdout-a-canon-r3-a5 | yes | - | 16/0 | 35 | 14 | 73 | 0.92 | 3.6 | 1 | 120 | 10 | 1 | - |
| main-holdout-a-skill-r1-a1 | yes | - | 16/0 | 15 | 32 | 111 | 1.73 | 6.3 | 1 | 120 | 10 | 1 | ACCEPT |
| main-holdout-a-skill-r2-a1 | yes | - | 16/0 | 14 | 29 | 88 | 1.26 | 6.3 | 1 | 112 | 10 | 1 | ACCEPT |
| main-holdout-a-skill-r3-a1 | no | hidden tests fail | 15/1 | 15 | 34 | 101 | 1.37 | 5.1 | 1 | 119 | 10 | 1 | ACCEPT |
| main-holdout-a-skill-r3-a2 | yes | - | 16/0 | 14 | 31 | 104 | 1.58 | 5.6 | 1 | 112 | 10 | 1 | ACCEPT |
| main-holdout-b-baseline-r1-a1 | yes | - | 13/0 | 5 | 1 | 10 | 0.24 | 1.1 | 1 | 119 | 10 | 1 | - |
| main-holdout-b-baseline-r2-a1 | yes | - | 13/0 | 10 | 1 | 9 | 0.25 | 1.0 | 1 | 136 | 10 | 1 | - |
| main-holdout-b-baseline-r3-a1 | yes | - | 13/0 | 8 | 1 | 10 | 0.29 | 1.2 | 1 | 120 | 10 | 1 | - |
| main-holdout-b-canon-r1-a1 | yes | - | 13/0 | 32 | 7 | 83 | 0.89 | 3.3 | 1 | 136 | 10 | 1 | - |
| main-holdout-b-canon-r2-a1 | yes | - | 13/0 | 19 | 14 | 92 | 0.95 | 3.7 | 1 | 119 | 10 | 1 | - |
| main-holdout-b-canon-r3-a1 | yes | - | 13/0 | 25 | 7 | 75 | 0.81 | 3.5 | 1 | 118 | 10 | 1 | - |
| main-holdout-b-skill-r1-a1 | yes | - | 13/0 | 18 | 39 | 111 | 1.46 | 6.2 | 1 | 121 | 10 | 1 | ACCEPT |
| main-holdout-b-skill-r2-a1 | yes | - | 13/0 | 18 | 39 | 122 | 1.64 | 5.6 | 1 | 134 | 10 | 1 | ACCEPT |
| main-holdout-b-skill-r3-a1 | yes | - | 13/0 | 19 | 40 | 120 | 1.69 | 5.8 | 1 | 122 | 10 | 1 | ACCEPT |
| main-opening-hours-parser-baseline-r1-a1 | yes | - | 20/0 | 35 | 1 | 9 | 0.43 | 1.9 | 1 | 193 | 10 | 1 | - |
| main-opening-hours-parser-baseline-r2-a1 | yes | - | 20/0 | 7 | 1 | 10 | 0.38 | 1.8 | 1 | 182 | 10 | 1 | - |
| main-opening-hours-parser-baseline-r3-a1 | yes | - | 20/0 | 7 | 1 | 14 | 0.44 | 1.9 | 1 | 184 | 10 | 1 | - |
| main-opening-hours-parser-canon-r1-a1 | yes | - | 20/0 | 24 | 4 | 84 | 1.04 | 7.4 | 1 | 193 | 10 | 1 | - |
| main-opening-hours-parser-canon-r2-a1 | yes | - | 20/0 | 75 | 16 | 81 | 1.04 | 5.8 | 1 | 169 | 10 | 1 | - |
| main-opening-hours-parser-canon-r3-a1 | yes | - | 20/0 | 79 | 15 | 82 | 1.15 | 6.2 | 1 | 144 | 10 | 1 | - |
| main-opening-hours-parser-skill-r1-a1 | yes | - | 20/0 | 17 | 38 | 2 | 1.78 | 13.8 | 1 | 129 | 10 | 1 | ACCEPT |
| main-opening-hours-parser-skill-r2-a1 | no | foreign reference | 20/0 | 20 | 43 | 2 | 2.17 | 14.9 | 1 | 114 | 10 | 1 | ACCEPT |
| main-opening-hours-parser-skill-r2-a2 | yes | - | 20/0 | 17 | 36 | 112 | 1.82 | 7.7 | 1 | 154 | 10 | 1 | ACCEPT |
| main-opening-hours-parser-skill-r3-a1 | yes | - | 20/0 | 23 | 48 | 152 | 2.34 | 8.1 | 1 | 135 | 10 | 1 | ACCEPT |
| pilot-expense-policy-review-baseline-r1-a1 | yes | - | 16/0 | 6 | 1 | 12 | 0.45 | 1.9 | 1 | 197 | 13 | 1 | - |
| pilot-expense-policy-review-canon-r1-a1 | yes | - | 16/0 | 24 | 7 | 124 | 1.48 | 6.1 | 1 | 186 | 13 | 1 | - |
| pilot-expense-policy-review-skill-r1-a1 | yes | - | 16/0 | 22 | 47 | 141 | 1.87 | 7.5 | 1 | 154 | 13 | 1 | ACCEPT |
| pilot-opening-hours-parser-baseline-r1-a1 | yes | - | 20/0 | 44 | 1 | 10 | 0.48 | 2.0 | 1 | 202 | 10 | 1 | - |
| pilot-opening-hours-parser-canon-r1-a1 | yes | - | 20/0 | 21 | 15 | 68 | 0.86 | 3.3 | 1 | 144 | 10 | 1 | - |
| pilot-opening-hours-parser-skill-r1-a1 | yes | - | 20/0 | 17 | 36 | 117 | 1.82 | 6.4 | 1 | 125 | 10 | 1 | ACCEPT |

### Reviewed groups, phase main

| group | reviewer | baseline | canon | skill | control | skill vs baseline | skill vs canon |
|---|---|---|---|---|---|---|---|
| main-box-office-holds-r1 | 1 | 6 | 7 | 7 | - | | |
| main-box-office-holds-r1 | 2 | 7 | 6 | 7 | - | | |
| main-box-office-holds-r1 | 3 | 6 | 6 | 7 | - | | |
| main-box-office-holds-r1 | final | | | | | +1 | +1 |
| main-box-office-holds-r2 | 1 | 6 | 7 | 7 | - | | |
| main-box-office-holds-r2 | 2 | 6 | 7 | 7 | - | | |
| main-box-office-holds-r2 | final | | | | | +1 | +0 |
| main-box-office-holds-r3 | 1 | 7 | 6 | 7 | - | | |
| main-box-office-holds-r3 | 2 | 7 | 6 | 6 | - | | |
| main-box-office-holds-r3 | 3 | 7 | 5 | 6 | - | | |
| main-box-office-holds-r3 | final | | | | | -1 | +1 |
| main-checkout-rounding-bug-r1 | 1 | 6 | 6 | 7 | - | | |
| main-checkout-rounding-bug-r1 | 2 | 5 | 5 | 6 | - | | |
| main-checkout-rounding-bug-r1 | final | | | | | +1 | +1 |
| main-checkout-rounding-bug-r2 | 1 | 5 | 5 | 7 | - | | |
| main-checkout-rounding-bug-r2 | 2 | 5 | 5 | 7 | - | | |
| main-checkout-rounding-bug-r2 | final | | | | | +1 | +1 |
| main-checkout-rounding-bug-r3 | 1 | 6 | 5 | 7 | - | | |
| main-checkout-rounding-bug-r3 | 2 | 6 | 5 | 6 | - | | |
| main-checkout-rounding-bug-r3 | 3 | 7 | 6 | 6 | - | | |
| main-checkout-rounding-bug-r3 | final | | | | | +0 | +1 |
| main-expense-policy-review-r1 | 1 | 4 | 5 | 7 | - | | |
| main-expense-policy-review-r1 | 2 | 4 | 6 | 7 | - | | |
| main-expense-policy-review-r1 | final | | | | | +1 | +1 |
| main-expense-policy-review-r2 | 1 | 4 | 8 | 6 | - | | |
| main-expense-policy-review-r2 | 2 | 4 | 7 | 7 | - | | |
| main-expense-policy-review-r2 | 3 | 4 | 8 | 7 | - | | |
| main-expense-policy-review-r2 | final | | | | | +1 | -1 |
| main-expense-policy-review-r3 | 1 | 3 | 5 | 7 | - | | |
| main-expense-policy-review-r3 | 2 | 3 | 6 | 8 | - | | |
| main-expense-policy-review-r3 | final | | | | | +1 | +1 |
| main-holdout-a-r1 | 1 | 6 | 7 | 6 | - | | |
| main-holdout-a-r1 | 2 | 5 | 7 | 6 | - | | |
| main-holdout-a-r1 | 3 | 6 | 8 | 8 | - | | |
| main-holdout-a-r1 | final | | | | | +1 | -1 |
| main-holdout-a-r3 | 1 | 6 | 5 | 7 | - | | |
| main-holdout-a-r3 | 2 | 7 | 7 | 8 | - | | |
| main-holdout-a-r3 | final | | | | | +1 | +1 |
| main-holdout-b-r1 | 1 | 6 | 7 | 7 | - | | |
| main-holdout-b-r1 | 2 | 6 | 8 | 7 | - | | |
| main-holdout-b-r1 | 3 | 5 | 7 | 6 | - | | |
| main-holdout-b-r1 | final | | | | | +1 | -1 |
| main-holdout-b-r2 | 1 | 6 | 7 | 8 | - | | |
| main-holdout-b-r2 | 2 | 6 | 7 | 8 | - | | |
| main-holdout-b-r2 | final | | | | | +1 | +1 |
| main-holdout-b-r3 | 1 | 6 | 7 | 6 | - | | |
| main-holdout-b-r3 | 2 | 6 | 7 | 6 | - | | |
| main-holdout-b-r3 | final | | | | | +0 | -1 |
| main-opening-hours-parser-r1 | 1 | 7 | 7 | 6 | - | | |
| main-opening-hours-parser-r1 | 2 | 7 | 7 | 6 | - | | |
| main-opening-hours-parser-r1 | final | | | | | -1 | -1 |
| main-opening-hours-parser-r2 | 1 | 6 | 7 | 6 | - | | |
| main-opening-hours-parser-r2 | 2 | 6 | 7 | 7 | - | | |
| main-opening-hours-parser-r2 | 3 | 5 | 7 | 7 | - | | |
| main-opening-hours-parser-r2 | final | | | | | +1 | +0 |
| main-opening-hours-parser-r3 | 1 | 6 | 6 | 8 | - | | |
| main-opening-hours-parser-r3 | 2 | 6 | 7 | 8 | - | | |
| main-opening-hours-parser-r3 | final | | | | | +1 | +1 |

### Per fixture (main phase): skill vs baseline and vs canon, wins/ties/losses

| fixture | kind | skill vs baseline | skill vs canon | deeper than baseline in a majority, never shallower |
|---|---|---|---|---|
| box-office-holds | fixtures/stateful | 2/0/1 | 2/1/0 | no |
| checkout-rounding-bug | fixtures/bugfix | 2/1/0 | 3/0/0 | yes |
| expense-policy-review | fixtures/multi-module | 3/0/0 | 2/0/1 | yes |
| holdout-a | holdout/multi-module | 2/0/0 | 1/0/1 | yes |
| holdout-b | holdout/stateful | 2/1/0 | 1/0/2 | yes |
| opening-hours-parser | fixtures/parsing | 2/0/1 | 1/1/1 | no |

All main groups: skill vs baseline 13/2/2, skill vs canon 10/2/5 (wins/ties/losses).

### Reviewed groups, phase pilot

| group | reviewer | baseline | canon | skill | control | skill vs baseline | skill vs canon |
|---|---|---|---|---|---|---|---|
| pilot-expense-policy-review-r1 | 1 | 4 | 7 | 6 | 4 | | |
| pilot-expense-policy-review-r1 | 2 | 5 | 7 | 7 | 5 | | |
| pilot-expense-policy-review-r1 | 3 | 4 | 7 | 6 | 4 | | |
| pilot-expense-policy-review-r1 | final | | | | | +1 | -1 |
| pilot-opening-hours-parser-r1 | 1 | 6 | 7 | 8 | 6 | | |
| pilot-opening-hours-parser-r1 | 2 | 7 | 8 | 8 | 7 | | |
| pilot-opening-hours-parser-r1 | 3 | 6 | 7 | 7 | 6 | | |
| pilot-opening-hours-parser-r1 | final | | | | | +1 | +0 |

### Per arm, all finished attempts of all phases (sums; validity counts per arm)

| arm | attempts | valid | cost USD | turns | minutes | commits | own tests passing | production files per valid main run |
|---|---|---|---|---|---|---|---|---|
| baseline | 21 | 20 | 7.82 | 250 | 35 | 21 | 242 | 1, 5 |
| canon | 30 | 19 | 31.38 | 2634 | 128 | 331 | 1060 | 1, 5 |
| skill | 24 | 20 | 39.84 | 2531 | 158 | 884 | 427 | 1, 4, 5 |

### Reviewer statistics

- Groups with a third reviewer (disagreement on a comparison): 9 of 19.
- main: spread (max - min) of one implementation's scores across its reviewers: 0: 24, 1: 25, 2: 2 implementations.
- pilot: spread (max - min) of one implementation's scores across its reviewers: 0: 1, 1: 5 implementations.
- Letters per arm (all reviews): baseline A 19, B 15, C 12, D 1; canon A 18, B 14, C 14, D 1; control:baseline A 3, B 1, D 2; skill A 7, B 17, C 21, D 2
- Mean deviation of a label's score from its reviewer's mean: A +0.02 (n=47), B -0.15 (n=47), C +0.13 (n=47), D -0.04 (n=6)
