# Workflow notes: finish main runs, five shards, browser cache

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, Gotchas, "Branches" (`git switch -C <branch> origin/main`) | The command sets the branch's upstream to `origin/main`: a bare `git push` would have gone to `main`, and the stop hook counted 41 "unpushed" commits against a stale `origin/<branch>` ref left from the earlier, merged pull request. Fixed by hand with `git branch --unset-upstream` and deleting the stale ref. | `git switch -C <branch> --no-track origin/main`, and `git fetch --prune` in the same step. |
| Shard sizes in `ci.yml` (no rule) | The shard counts were chosen once by test count; finding the imbalance needed a full local timing run (30 min) and a simulation with `playwright test --list --shard`. | Keep the timing recipe next to the matrix in `docs/test-pyramid.md`, so the next re-balance reuses it. |
