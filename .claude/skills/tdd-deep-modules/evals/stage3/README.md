# Stage 3: does the skill produce deeper modules?

A three-arm comparison on small tasks, rated blind. All numbers in `results/` and `REPORT.md` come from `harness/stage3`; nothing is entered by hand.

## Material

- `FIXTURES.md`: the fixture format. `fixtures/` holds the 4 visible tasks, `holdout/` the 2 hold-out tasks. A separate subagent wrote all six and validated them (starter green, hidden tests red on the starter, green on the reference). The experimenter does not open `holdout/` before the final run; the harness copies it mechanically.
- `arms/`: what each arm is told in front of the task text. The task text (`task.md`) and the closing paragraph (`arms/common.md`) are identical for all arms.
  1. `baseline`: nothing.
  2. `canon`: Kent Beck's Canon TDD in five steps (`canon-tdd.md`).
  3. `skill`: "Use the tdd-deep-modules skill for this task." The run repository holds a copy of the skill (SKILL.md, references, scripts without their tests) under `.claude/skills/`, so Claude Code loads it with its hook; arms 1 and 2 get no `.claude/` directory.

## Isolation

Every run is a fresh headless Claude Code session (`claude -p`, model fixed in the harness) started in its own git repository under the scratchpad, outside the Dwello checkout: no Dwello `CLAUDE.md`, no project skills or hooks, no parent-session identity (the harness drops those variables). All arms get the same tool permissions: edits and reads only inside the run directory (Claude Code's default for a headless session; nobody can approve more), Bash only for `bun`, `bunx`, `git`, `ls`, `mkdir` and the skill's scripts; no web access. So an arm cannot read `evals/`, `evidence/` or another run. Each run's full transcript is kept (`results/runs/<id>.stream.jsonl.gz`) and every absolute path in its tool calls outside its own directory is listed in `outside_paths`.

## A run (`harness/stage3 run <fixture> <arm> <run-id>`)

1. Copy `starter/` (plus the skill for arm 3) into a new repository and commit it as `start`.
2. Start the session with preamble + task + closing paragraph.
3. Measure the final working tree: the arm's own `bun test`; the hidden tests (`hidden/` copied to `__acceptance__/`, `bun test ./__acceptance__`); `depth_report` over every production file; for arm 3 `tdd_replay start..HEAD` with the skill's locked scripts.
4. Keep `results/runs/<id>.json`, a git bundle and a tarball of the final tree.

A run whose hidden tests fail is invalid: it stays in `results/` as a failure case and the same slot is run again (`-a2`, `-a3`, ...).

## Blind review (`harness/stage3 review <group> <fixture> baseline=.. canon=.. skill=..`)

One group = one fixture and one run index, i.e. one valid run per arm. Two reviewers, each a fresh headless session that can only read its own directory and has no Bash, get `TASK.md` and the three implementations' production code under random letters (a new shuffle per reviewer). Tests, Markdown, `.claude/`, git history and comments are removed; each file is reprinted by the TypeScript printer, so layout and comments cannot reveal the arm. Each reviewer scores module depth (Ousterhout) from 1 to 10 per implementation. The harness turns scores into two comparisons: skill vs baseline and skill vs canon (+1 deeper, 0 equal, -1 shallower). If the two reviewers differ on either comparison, a third reviewer (new shuffle) rates the group and the majority decides; without a majority the comparison is 0.

Pilot groups add a control: the baseline implementation appears twice under different letters. A reviewer who scores the two copies more than one point apart is unreliable.

## Plan

1. Pilot: 2 visible fixtures x 3 arms x 1 run, reviewed with the control. Checks the harness end to end and the reviewers' consistency.
2. Main: 4 visible fixtures x 3 arms x 3 runs (fresh runs, pilot runs are not reused).
3. Hold-out: 2 hold-out fixtures x 3 arms x 3 runs, opened only now.
4. `harness/stage3 gate` prints every group's raw scores and the per-fixture tallies, then `STAGE3: PASS` only when: every reviewed run passed its hidden tests; `tdd_replay` accepted every reviewed arm-3 run; for each of the 6 fixtures, all 3 run groups were reviewed, the skill was rated deeper than baseline in a majority of them and shallower in none; the latest review of each stage-3 step (14-17) ends in `VERDICT: PASS`; `REPORT.md` exists. It also prints whether attribution to the skill over plain TDD is supported (skill deeper than canon in a majority of each fixture's runs) or unproven. That line is reported, not gated.

Every step ends with the review gate: a fresh read-only reviewer, every blocker or major finding fixed, a new reviewer verifies; after 3 failed rounds the work stops.
