# Workflow notes: issue #790

| Rule | What happened | Proposed change |
| --- | --- | --- |
| None (security alerts) | The issue asks to fix or dismiss the open CodeQL and Dependabot alerts, but a session gets 403 on both alert APIs. Worked around with a local CodeQL run (bundle download, about 1.4 GB in the scratchpad, same 33 findings) and `bun audit`. | Name the way in a skill (e.g. `issue-work`): CodeQL alerts come as `nfr:security` issues from `security-alerts.yml`; to see the current state, a local `codeql database analyze` with the `*-code-scanning.qls` suites, and `bun audit` in the root and `backend/`. |
| `tests/e2e/CLAUDE.md`, "if E2E cannot start a browser … run it again" | The shim of `.claude/hooks/session-start.sh` pointed at paths the image no longer has; a full run (2 h limit) failed in every scenario, and running again would have failed the same way (#792). | Say what to check first: `ls -L $PLAYWRIGHT_BROWSERS_PATH/*/*/chrome*`; and start a long E2E run only after one feature file passed. |
| `.claude/hooks/commit-msg-gate.mjs` (commit subject) | A 57-character subject passed the hook because the commit used `git commit -F -` (heredoc); only the code review caught it (790b C-2). The hook says commits without `-m` pass unchecked. | Check `-F -` heredoc messages too, or say in `commit-gates` to commit with `-m` so the gate sees the subject. |
