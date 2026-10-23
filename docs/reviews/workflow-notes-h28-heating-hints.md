# Workflow notes: H-28 #16 and heating hints

| Rule | What happened | Proposed change |
|---|---|---|
| `.claude/hooks/commit-msg-gate.mjs` (skill `commit-gates`, "Commit subject") | The gate checks `git commit -m` only. A commit made with `git commit -F -` (heredoc) passed with a 51-character subject and was blocked only at `git push`; rewording the unpushed commit needed a history rewrite, which the session's permissions refused, so the commits went to a new branch by cherry-pick (PR #646). | Let the gate also read the subject of `-F <file>` / `-F -` (or check `HEAD`'s subject in a post-commit step), so the block comes at commit time, when a new `git commit -m` fixes it. |
