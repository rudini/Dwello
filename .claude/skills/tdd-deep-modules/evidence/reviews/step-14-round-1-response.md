# Response to step 14 (stage 3 harness, protocol, fixtures), round 1

- [major] isolation: every session (arms and reviewers) now runs in its own mount namespace (`harness/sandbox.sh` under `unshare -m`): its directory is bound to `/workspace`, tmpfs hides `/home/user`, the session scratchpad (all runs, views, results) and `/root/.claude/projects` + `shell-snapshots`. Verified by listing those inside the sandbox (all empty, `git -C /home/user/Dwello` fails, `bun -e existsSync(.../evals)` is false). `outside_paths` is replaced by `foreign_references` (also `/`, `..`, Dwello, evals, stage3); the gate prints them per run and review. They do not fail the gate: with the namespace nothing is readable, so an attempt is a reported behaviour, not a leak. README corrected.
- [major] rubric: neutral Ousterhout definition only (interface small/simple vs functionality and decisions hidden; shallow = interface about as complex as what it does); the enumerated symptoms are gone; README states why.
- [major] cherry-picking: run ids `<phase>-<fixture>-<arm>-r<slot>-a<attempt>` and groups `<phase>-<fixture>-r<slot>[.<attempt>]` are parsed; existing runs, run dirs, review groups and stream files are refused; the gate takes the first valid attempt per fixture x arm x slot, fails a group reviewing anything else, requires replay ACCEPT for every valid arm-3 run in results, lists every invalid run and every review attempt, uses the first complete review attempt.
- [major] production files: now the transitive relative-import closure of the modules the hidden tests import (from, import(), bare import, require; .js->.ts and index resolution).
- [minor] rev3: a disagreeing group without a complete rev3 counts as not reviewed (gate fails it); no overwrite, so no stale rev3.
- [minor] group checks: three distinct recorded runs of the phase, arm/fixture/slot match, same runs for every reviewer.
- [minor] control: gate prints each pilot reviewer's control delta and UNRELIABLE above 1; README: then the rubric is revised and pilot reviews repeated before main.
- [minor] treatment check: `skill_loaded` (a successful Skill tool_result for tdd-deep-modules); an arm-3 run without it is invalid (treatment not given), decided before any real run; smoke rerun with the new harness (see round 2).
- [minor] side channels: Agent, Task, Workflow, Artifact, SendMessage, Cron*, PushNotification, ScheduleWakeup, RemoteTrigger, Monitor, WebFetch, WebSearch disallowed identically for arms (and reviewers, who also lose Bash, Edit, Write, Skill).
- [minor] opaque directories: every session sees `/workspace`; the run id appears nowhere inside it; git identity neutral ("Developer").
- [minor] box-office meta: `interacting_modules` false; `validate` now checks kinds, >= 2 visible interacting fixtures and 2 hold-outs.
- [nit] checkout task: percent-discount rounding stated ("rounded to the nearest cent (halves up)").
- [nit] control letter is now `k`.
- Protocol note: this round's reviewer named abstract categories of the hold-outs in its report despite the instruction; the experimenter has thereby seen those words (no content, task text or tests). Recorded as a deviation for the final report.
