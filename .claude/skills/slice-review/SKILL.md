---
name: slice-review
description: How to run the reviewer subagents of a Dwello slice (code-reviewer, fach-reviewer, daten-pruefer, persona) - worktree, prompt, report path, triage. Load before starting any reviewer subagent (CLAUDE.md, Workflow steps 1, 4 to 6), or when the user says "slice-review", "review the slice" or "run the reviewers".
---

# Slice review

`CLAUDE.md`, Workflow 1 and 4 to 7, decides when a reviewer runs, which ones apply, what it needs before it starts, how findings are judged and when to stop. This skill is how to run one.

## 1. Worktree

`code-reviewer`, `fach-reviewer` and `daten-pruefer` each get their own worktree of the commit they review, a local commit on your branch (`<scratchpad>` is your scratchpad directory):

```bash
git worktree add --detach <scratchpad>/review-<slice>-<reviewer> <commit>
ln -s "$PWD/node_modules" <scratchpad>/review-<slice>-<reviewer>/node_modules
ln -s "$PWD/backend/node_modules" <scratchpad>/review-<slice>-<reviewer>/backend/node_modules
```

Personas get no worktree, only the running app (`docs/design/tools/persona-stack.sh`). Reading `node_modules` is denied to you and to reviewers: read a dependency through `node -e "import('<package>')…"` or a test.

## 2. The prompt

Every prompt names the requirement (the scenario, the issue's "Done means", or the request in its words) and the report path. Reviewers in a worktree write it to your scratchpad: `<slice>-review-<n>.md` (`code-reviewer`), `<slice>-fachreview-<n>.md` (`fach-reviewer`), `<slice>-datenpruefung-<n>.md` (`daten-pruefer`); personas write `docs/design/personas/<persona>-<slice>.md` themselves. Add per agent:

- `code-reviewer`: the worktree, the commit range (`git diff <base> <commit>`), the checks you ran on that commit and whether they passed (a check run before a later change, run again).
- `fach-reviewer`: the worktree and the subject: the `@wip` scenario before implementation, or the diff and the screens it changes.
- `daten-pruefer`: the worktree, the change, the affected records, and that the app is running.
- `persona`: the persona, a task on what the change touches (never the code), that the app runs on :3300, the building of the demo data it may save in only when its task needs saving, and for a failure state or blocking demo records the request to fail or the SQL you ran (`docs/design/personas/README.md`, "Running a review").

For a re-review give only the delta, the open finding IDs and the previous report. Then keep working in your tree while it runs, but do not amend or rebase the reviewed commits.

## 3. Triage

1. Copy each report from your scratchpad to `docs/reviews/` under the same name.
2. Judge and fix the findings (`CLAUDE.md`, Workflow 6):
   - Every report gives severity (Blocker / Major / Minor / Nit) and evidence (file:line or reproduction steps). Check the evidence before acting; reject a finding with a reason when it does not hold.
   - A fix that changes behavior (a help or error text the user sees included) gets a failing test first. A wording fix of a translation that a reviewer named and checked needs none, also when it answers a persona finding: the report is the evidence. Any other fixed persona finding is closed by a test that shows it (scenario or lower layer, red before the fix).
   - A persona runs again only when a fix adds a text or screen state it has not seen, and then only the personas whose finding the fix answers, with a task on just that text or state.
   - Persona "Beobachtungen": check each on the base commit. One the change caused or made more visible is a finding of the slice; the others stay in the persona's report.
   - Rounds: a round is one run of one reviewer on one slice, at most three per slice; a Blocker/Major still open after the third goes under "Blocked on me". Only a fix that answers a Blocker/Major gets a re-review (the delta, the open finding IDs, the previous report). Fixes of feature-review findings form a new slice. Minor/Nit fixes wait for the closing round before the push (skill `pull-request`).
   - Open when the task ends: a Blocker/Major that needs a product decision (it contradicts what the issue decided) or existed before the change (it shows on the base commit too, and the change does not make it more visible or contradictory) goes under "Blocked on me" and becomes open work (`CLAUDE.md`, "Open work"). A Minor/Nit is fixed when the fix is trivial; otherwise it stays in its report, with no issue or row.
3. The plan checklist gets one item per review round that names its report; the findings and their status stay out of the plan. Say in the commit that answers a round which findings it rejects and why. Findings of different reviewers with one cause are one fix and one test.
4. Remove the worktree: `git worktree remove <path>` (no `--force`: the links are ignored).

When a reviewer stops without a review (no worktree named, app not reachable), fix the cause and start it once more; when `git worktree remove` refuses, look at `git -C <path> status` and remove only what you created. A second failure of either goes under "Blocked on me".

Done when every report is in `docs/reviews/` (personas: `docs/design/personas/`), every Blocker/Major is fixed, rejected with a reason or under "Blocked on me", and the worktrees of this round are removed.
