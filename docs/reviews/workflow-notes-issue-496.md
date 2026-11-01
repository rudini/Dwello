# Workflow notes: issue #496

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 6 and 7 (a fix of a text needs a reviewed wording; three rounds per reviewer) | Each fix round of the README added sentences no wording table held, so each needed another fach-reviewer round; the third round found new gaps in the sentences of the second, and one Minor (496c C-3) stays because no round is left. Generated help text (README) grew with every round. | Ask the fach-reviewer for the full README wording in its first step-5 round, not per finding, so later rounds only check, not write. |
| `tests/e2e/CLAUDE.md`, "Run" | A download with a non-ASCII name is called «download» by Chromium in this container unless `LANG=C.UTF-8`; the persona stack and local E2E needed it set by hand. | Name the locale in "Run" and in `persona-stack.sh`. |
