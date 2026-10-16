---
name: slice-review
description: How to run the reviewer subagents of a Dwello slice (code-reviewer, fach-reviewer, daten-pruefer, persona) - worktree, prompt, report path, plan line, triage. Load before starting any reviewer subagent (CLAUDE.md, Workflow steps 1, 4 to 6), or when the user says "slice-review", "review the slice" or "run the reviewers".
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

- `code-reviewer`: the worktree, the commit range (`git diff <base> <commit>`), the checks you ran on that commit with their exit codes, not only the passed counts (a check run before a later change, run again).
- `fach-reviewer`: the worktree and the subject: the `@wip` scenario before implementation, or the diff and the screens it changes.
- `daten-pruefer`: the worktree, the change, the affected records, and that the app is running.
- `persona`: the persona, a task on what the change touches (never the code), that the app runs on :3300, the building of the demo data it may save in only when its task needs saving, and for a failure state the request to fail or the SQL you ran (`CLAUDE.md`, Workflow 5).

For a re-review give only the delta, the open finding IDs and the previous report. Then keep working in your tree while it runs, but do not amend or rebase the reviewed commits.

## 3. Triage

1. Copy each report from your scratchpad to `docs/reviews/` under the same name.
2. Judge and fix the findings as `CLAUDE.md`, Workflow 6 says.
3. Add one line per reviewer and round to the latest `## Session` of `implementation_plan.md`:
   `<reviewer> round <n> (<report path>): open <ID (severity)>, fixed <IDs>, rejected <ID: reason>`
   The findings stay in the report. A finding fixed in a later round changes its status in the line of the round that raised it. Findings of different reviewers with one cause are one fix and one test: each line names the finding that holds it (`= P-1`).
4. Remove the worktree: `git worktree remove <path>` (no `--force`: the links are ignored).

When a reviewer stops without a review (no worktree named, app not reachable), fix the cause and start it once more; when `git worktree remove` refuses, look at `git -C <path> status` and remove only what you created. A second failure of either goes under "Blocked on me".

Done when every report is in `docs/reviews/` (personas: `docs/design/personas/`), every finding has a status in its round's plan line, and the worktrees of this round are removed.
