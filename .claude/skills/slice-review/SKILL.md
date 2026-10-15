---
name: slice-review
description: How to run the reviewer subagents of a Dwello slice (code-reviewer, fach-reviewer, daten-pruefer, persona) - worktree, prompt, report path, plan line, triage. Load before starting any reviewer subagent (CLAUDE.md, Workflow steps 1, 4 to 6), or when the user says "slice-review", "review the slice" or "run the reviewers".
---

# Slice review

`CLAUDE.md`, Workflow 1 and 4 to 7, decides when a reviewer runs, which ones apply, when to re-review and when to stop. This skill is how to run one.

## 1. Before you start a reviewer

1. The commit to review is a local commit on your branch, and lint, the affected tests and `bun run deepcheck:audit` are clean on it. A check you ran before a later change, run again.
2. `code-reviewer`, `fach-reviewer` and `daten-pruefer` each get their own worktree of that commit (`<scratchpad>` is your scratchpad directory):

   ```bash
   git worktree add --detach <scratchpad>/review-<slice>-<reviewer> <commit>
   ln -s "$PWD/node_modules" <scratchpad>/review-<slice>-<reviewer>/node_modules
   ln -s "$PWD/backend/node_modules" <scratchpad>/review-<slice>-<reviewer>/backend/node_modules
   ```

   Personas get no worktree, only the running app (`docs/design/tools/persona-stack.sh`).
3. Reading `node_modules` is denied to you and to reviewers: read a dependency through `node -e "import('<package>')…"` or a test.

## 2. The prompt

Name in each reviewer's prompt:

- the requirement: the scenario, the issue's "Done means", or the request in its words;
- the commit range (`git diff <base> <commit>`); for a re-review only the delta, the open finding IDs and the previous report;
- the worktree path (personas: that the app runs on :3300, and the building they may save in);
- the checks you ran on that commit, with their results;
- the report path in your scratchpad: `<slice>-review-<n>.md` (`code-reviewer`), `<slice>-fachreview-<n>.md` (`fach-reviewer`), `<slice>-datenpruefung-<n>.md` (`daten-pruefer`); personas write `docs/design/personas/<persona>-<slice>.md` themselves.

Then keep working in your tree while it runs, but do not amend or rebase the reviewed commits.

## 3. Triage

1. Copy each report from your scratchpad to `docs/reviews/` under the same name.
2. Check each finding's evidence before acting on it; reject one that does not hold, with the reason.
3. Fix per `CLAUDE.md`, Workflow 6: a fix that changes behavior (a text the user sees included) gets a failing test first, noted as `Test red: <test> – <message>`.
4. Add one line per reviewer and round to the latest `## Session` of `implementation_plan.md`:
   `<reviewer> round <n> (<report path>): open <ID (severity)>, fixed <IDs>, rejected <ID: reason>`
   The findings stay in the report. A finding fixed in a later round changes its status in the line of the round that raised it.
5. Remove the worktree: `git worktree remove <path>` (no `--force`: the links are ignored).

Done when every report is in `docs/reviews/` (personas: `docs/design/personas/`), every finding has a status in its round's plan line, and the worktrees of this round are removed.
