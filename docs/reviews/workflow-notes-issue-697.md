# Workflow notes: issue #697

| Rule | What happened in this task | Proposed change |
|------|----------------------------|-----------------|
| `CLAUDE.md`, "Before marking anything complete" (Prettier on added files) and Gotchas, "Formatting" | `tests/ui-screenshots/` and `playwright.screenshots.config.ts` are in `.prettierignore`: `prettier --check` and `--write` skip them silently ("All matched files use Prettier code style!"), so a new file there is never formatted or checked. Formatted by hand with `--ignore-path /dev/null`. | Name in "Formatting" that files under `.prettierignore` are skipped, or drop the CI tooling folders from `.prettierignore` when they are already clean. |
