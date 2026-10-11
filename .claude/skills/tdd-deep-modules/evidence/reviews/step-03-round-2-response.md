# Step 03, round 2: response to findings

| Finding | Severity | Fix |
|---|---|---|
| N1 path/root mismatch fails open (macOS letter case) | major | 69f563d -> 6f9ee74: the repo-relative path comes from git (`git rev-parse --show-prefix` in the nearest existing directory) plus the resolved remainder; no string comparison with the toplevel is left, so no `relative_to` against git's spelling can raise. Tested with a git wrapper that reports the toplevel in upper case (like the reviewer's simulation). |
| N2 git failures silently allowed | minor | e4340e5 -> af2d20b: only "not a git repository" passes silently; other git failures (e.g. dubious ownership) print `tdd-guard: cannot check <file>: <reason>` and exit 1 (visible, non-blocking) |
| N3 hardlinks | minor | documented |
| N4 root `.resolve()` untested | nit | gone (toplevel no longer used) |
| N5 `_is_code` change without a violations()-level test | nit | 207c808 pin through `tdd-step red`, mutation killed |
| N6 subtests in reds | nit | acknowledged |
| N7 phase from the subject only | nit | documented |
| `production_may_follow` hard-codes ("green", "refactor") | assessment | kept: those are the phases whose commits may contain production code per `violations` (red forbids it, test forbids code); the phase order still comes from the table |
