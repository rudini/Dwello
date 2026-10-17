# Workflow notes: e-mail statements (#86)

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/tools/persona-stack.sh` (and `docs/design/personas/README.md`, "Running a review": a refused mail is set up by SQL) | The stack pointed the backend at SMTP 2525 but set no `MAIL_FROM` and started no mail catcher: every e-mail, reminders included, failed as «not set up», so no persona could see a sent e-mail. Fixed in this task (the stack sets `MAIL_FROM` and starts the catcher when 2525 is free). | None beyond the fix; the README could say that mail goes to the catcher on :2526. |
| `CLAUDE.md` Workflow 1 (no green test before `fach-reviewer` reports) vs. skill `tdd` | As in `workflow-notes-issue-131.md`: the pg, BFF, DOM and a11y tests were written red in bulk while the domain review ran. | As there. |
| Issue «Done means» worded for a decision issue (#86: «decision recorded … or an implementation issue created») | The coordinator said to treat the decision as the requirement; the issue's own finish line would have been met without code. | Decision template: once a decision is recorded and implemented in the same issue, its «Done means» names the implementation, or the decision issue is closed and an implementation issue opened as the template says. |
| Stop hook `~/.claude/stop-hook-git-check.sh` | As in earlier notes: asked five times to commit and push while reviewers ran. | As there. |
