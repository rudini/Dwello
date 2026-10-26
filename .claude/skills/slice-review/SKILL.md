---
name: slice-review
description: How to run the reviewer subagents of a Dwello slice (code-reviewer, fach-reviewer, daten-pruefer, persona) - worktree, prompt, report path, triage. Load before starting any reviewer subagent (CLAUDE.md, Workflow steps 1, 4 to 7), or when the user says "slice-review", "review the slice" or "run the reviewers".
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
- native read (a `general-purpose` subagent reading fr, it or en as a native speaker, when an issue asks for one): the keys it reads; it returns only the keys it changes, as rows `key | old | new`, and lists keys with a placeholder or ICU escape (`{area}`, an escaped brace) in a table of their own, so they are pasted by hand. Run it before the step-1 `fach-reviewer` closes, so legal-text changes of the read go into that round, not an extra one.
- `persona`: the persona, a task on what the change touches (never the code), that the app runs on :3300, the building of the demo data it may save in only when its task needs saving, and for a failure state or blocking demo records the request to fail or the SQL you ran (`docs/design/personas/README.md`, "Running a review").

For a re-review give only the delta, the open finding IDs and the previous report. Then keep working in your tree while it runs, but do not amend or rebase the reviewed commits.

## 3. Triage

1. Copy each report from your scratchpad to `docs/reviews/` under the same name.
2. Judge and fix the findings (`CLAUDE.md`, Workflow 6):
   - Every report gives severity (Blocker / Major / Minor) and evidence (file:line or reproduction steps). Check the evidence before acting; reject a finding with a reason when it does not hold.
   - A fix that changes behavior (a help or error text the user sees included) gets a failing test first. A wording fix of a translation that a reviewer named and checked needs none, also when it answers a persona finding: the report is the evidence. Any other fixed persona finding is closed by a test that shows it (scenario or lower layer, red before the fix).
   - A persona runs again only when a fix adds a text or screen state it has not seen, and then only the personas whose finding the fix answers, with a task on just the screens of that finding.
   - Persona "Beobachtungen": check each on the base commit. One the change caused or made more visible (the persona met it in its task on this change) is a finding of the slice; the others stay in the persona's report. A Minor that two or more personas meet in the same place becomes an issue.
   - Rounds (`CLAUDE.md`, Workflow 7): a round is one run of one reviewer on one slice; fixes of feature-review Blockers/Majors form a new slice, fixes of Minors/Nits get no round of their own (the closing round of skill `pull-request` reviews them). What stays open when the task ends: `CLAUDE.md`, "Done means".
3. The plan checklist gets one item per review round that names its report; the findings and their status stay out of the plan. Rejected findings and their reasons go under "Found" in the closing report. Findings of different reviewers with one cause are one fix and one test.
4. Remove the worktree: `git worktree remove <path>` (no `--force`: the links are ignored).

When a reviewer stops without a review (no worktree named, app not reachable), fix the cause and start it once more; when `git worktree remove` refuses, look at `git -C <path> status` and remove only what you created. A second failure of either goes under "Blocked on me".

## 4. Hand-over

A session without the Agent tool (a worker of a coordinator) prepares each prompt as in 2 and sends it to the session that started it, one message per reviewer, with these fields: reviewer, requirement, worktree (created by the worker as in 1), range with the pathspec of skill `pull-request`, checks run and their result, report path, round number and the open IDs. The starting session runs the reviewer and answers with the report path; triage (3) stays with the worker.

Done when every report is in `docs/reviews/` (personas: `docs/design/personas/`), every Blocker/Major is fixed, rejected with a reason or under "Blocked on me", and the worktrees of this round are removed.
