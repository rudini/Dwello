# Stage 3: does the skill produce deeper modules?

A three-arm comparison on small tasks, rated blind. All numbers in `results/` and `REPORT.md` come from `harness/stage3`; nothing is entered by hand.

## Material

- `FIXTURES.md`: the fixture format. `fixtures/` holds the 4 visible tasks, `holdout/` the 2 hold-out tasks. A separate subagent wrote all six and validated them (starter green, hidden tests red on the starter, green on the reference). The experimenter does not open `holdout/` before the final run; the harness copies it mechanically.
- `arms/`: what each arm is told in front of the task text. The task text (`task.md`) and the closing paragraph (`arms/common.md`) are identical for all arms.
  1. `baseline`: nothing.
  2. `canon`: Kent Beck's Canon TDD in five steps (`canon-tdd.md`).
  3. `skill`: "Use the tdd-deep-modules skill for this task." The run repository holds a copy of the skill (SKILL.md, references, scripts without their tests) under `.claude/skills/`, so Claude Code loads it with its hook; arms 1 and 2 get no `.claude/` directory.

## Isolation

Every session (arm or reviewer) is a fresh headless Claude Code session (`claude -p`, model fixed in the harness) inside its own mount namespace (`harness/sandbox.sh`, run with `unshare -m`): its directory is mounted at `/workspace`, and tmpfs mounts hide `/home/user` (the Dwello checkout with `evals/` and `evidence/`), the session scratchpad (all other runs, review views and results) and other sessions' transcripts. So no path, `git -C`, `bun -e` or `find /` reaches another run, a hidden test or a reference solution; this was checked by listing those directories inside the sandbox (empty). There is no Dwello `CLAUDE.md`, no project skill or hook except arm 3's copy of the skill, and no parent-session identity (the harness drops those variables). All arms get the same tools: edits only inside `/workspace`, Bash only for `bun`, `bunx`, `git`, `ls`, `mkdir` and the skill's scripts, the `Skill` tool, no web, no subagents, no artifacts or messaging. Each run's full transcript is kept (`results/runs/<id>.stream.jsonl.gz`); tool calls that name a place outside the sandbox are listed in `foreign_references` and printed by the gate (they could not read anything).

## A run (`harness/stage3 run <fixture> <arm> <run-id>`)

Run ids are `<phase>-<fixture>-<arm>-r<slot>-a<attempt>`. Nothing is overwritten: an existing run id is refused.

1. Copy `starter/` (plus the skill for arm 3) into a new repository and commit it as `start`.
2. Start the sandboxed session with preamble + task + closing paragraph.
3. Measure the final working tree: the arm's own `bun test`; the hidden tests (`hidden/` copied to `__acceptance__/`, `bun test ./__acceptance__`); the production files, i.e. the import closure of the modules the hidden tests import (test helpers that only tests import are not production); `depth_report` over them; for arm 3 whether the `Skill` tool loaded tdd-deep-modules, and `tdd_replay start..HEAD` with the skill's locked scripts.
4. Keep `results/runs/<id>.json`, a git bundle and a tarball of the final tree.

A run is invalid when its hidden tests fail, or (arm 3) when the skill was never loaded, so the treatment was not given. An invalid run stays in `results/` as a failure case and its slot is run again with the next attempt number. The gate uses, per fixture, arm and slot, the first valid attempt and nothing else, and requires `tdd_replay` ACCEPT for every valid arm-3 run in `results/`, reviewed or not.

## Blind review (`harness/stage3 review <group> <fixture> baseline=.. canon=.. skill=..`)

One group (`<phase>-<fixture>-r<slot>`) = one fixture and one slot, i.e. the first valid run of each arm. Two reviewers, each a fresh sandboxed session without Bash, edits or skills, get `TASK.md` and the three implementations' production code under random letters (a new shuffle per reviewer). Tests, Markdown, `.claude/`, git history and comments are removed; each file is reprinted by the TypeScript printer, so layout and comments cannot reveal the arm. The rubric is Ousterhout's definition only (a deep module's interface is small and simple compared with the functionality and design decisions it hides; a shallow module's interface is about as complex as what it does), without the skill's own checklist, so reviewers do not score conformance to what arm 3 is told. Each reviewer scores module depth from 1 to 10 per implementation. The harness turns scores into two comparisons: skill vs baseline and skill vs canon (+1 deeper, 0 equal, -1 shallower). If the two reviewers differ on either comparison, a third reviewer (new shuffle) rates the group and the majority of the three decides; without a majority the comparison is 0. A group whose disagreement has no complete third review counts as not reviewed. Reviews are never overwritten; a review that crashed or gave no complete scores is repeated as `<group>.<attempt>`, and the gate uses the first complete attempt and lists all.

Pilot groups add a control: the baseline implementation appears twice under different letters. The gate prints each pilot reviewer's control delta; a delta above 1 marks the reviewer UNRELIABLE, and then the rubric is revised and the pilot reviews repeated before the main runs.

## Plan

1. Pilot: 2 visible fixtures x 3 arms x 1 run, reviewed with the control. Checks the harness end to end and the reviewers' consistency.
2. Main: 4 visible fixtures x 3 arms x 3 runs (fresh runs, pilot runs are not reused).
3. Hold-out: 2 hold-out fixtures x 3 arms x 3 runs, opened only now.
4. `harness/stage3 gate` prints every group's raw scores and the per-fixture tallies, then `STAGE3: PASS` only when: every group reviews the first valid attempt of each arm's slot; `tdd_replay` accepted every valid arm-3 run; for each of the 6 fixtures, all 3 run groups were reviewed, the skill was rated deeper than baseline in a majority of them and shallower in none; the latest review of each stage-3 step (14-17) ends in `VERDICT: PASS`; `REPORT.md` exists. It also prints whether attribution to the skill over plain TDD is supported (skill deeper than canon in a majority of each fixture's runs) or unproven. That line is reported, not gated.

Every step ends with the review gate: a fresh read-only reviewer, every blocker or major finding fixed, a new reviewer verifies; after 3 failed rounds the work stops.
