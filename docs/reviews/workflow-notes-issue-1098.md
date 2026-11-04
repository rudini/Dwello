# Workflow notes, issue #1098

## Note 1: persona reports land in the main checkout, not the worktree

Both persona agents (Helga, Dr. Weber) wrote their reports to `/home/user/Dwello/docs/design/personas/` although the task ran in the worktree `/home/user/w-1071`; the stop hook then reported untracked files in the main checkout. The reports were moved by hand. The persona prompt of skill `slice-review` names no absolute path for the report; naming the worktree's path (`<worktree>/docs/design/personas/<persona>-<slice>.md`) in the prompt would prevent it.

## Note 2: a Minor left open became a red main

Code review 1088-5 C-10 (the proposal scenario relied on the calendar year being the majority across parallel scenarios) stayed open as a Minor in #1101; on main it failed in Firefox (#1102) and needed a scenario change with the product owner's approval. A Minor that breaks the isolation rule of `tests/e2e/CLAUDE.md` is a red run waiting to happen, not a cosmetic point.
