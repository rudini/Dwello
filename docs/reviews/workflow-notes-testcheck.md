# Workflow notes: testcheck (request without issue)

| Rule | What happened | Proposed change |
|---|---|---|
| Skill `commit-gates`, the hooks' command match (`git commit`/`git push` anywhere in the command) | Two Bash commands that only wrote files (a heredoc with the new hook script, a test with a command string) contained the words and were blocked by fallow before anything ran; the files had to be written with the Write tool instead. | One line in `commit-gates`: write a file whose text contains `git commit` or `git push` with Write/Edit, not with a heredoc in Bash. |
| Fallow gate, CRAP estimated from export references | The measuring scripts of `tools/testcheck/eval/` are run by hand and imported by no test, so fallow estimates their coverage at 0 % and flags every function from cyclomatic 5 on; small helpers had to be split only to pass the gate. | Exclude evaluation scripts (`tools/*/eval/**`) from the complexity gate in `.fallowrc.json`, or say in `commit-gates` that such scripts need functions below cyclomatic 5. |

Decided (product owner, 2026-10-26): both proposals accepted; the `commit-gates` line was added, and `tools/*/eval/**` is excluded from the complexity gate (`health.ignore` in `.fallowrc.json`).
