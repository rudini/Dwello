# Workflow notes: issue #788

| Rule | What happened | Proposed change |
| --- | --- | --- |
| skill `slice-review`, "2. The prompt" (report name `<slice>-review-<n>.md`) | Part 5 of #788 reused the slice name `p5a` of the earlier point 5a. Copying the new report into `docs/reviews/` overwrote the existing `p5a-review-1.md`; it was restored before the commit, and the new reports were filed as `p5ae2-*`. | Say that the slice name must not exist in `docs/reviews/` yet (`ls docs/reviews/<slice>-*` before the first round), or name reports by issue and part (`issue-788-5a-review-1.md`). |
| `CLAUDE.md`, "Done means" of an issue that asks for «the next measurement (`tools/arch-baseline/run.sh`)» | The script rewrites about 40 tracked files in `tools/arch-baseline/out/` (the phase 0 snapshot). Only the one number was needed; the files were restored with `git restore` and the number went into `docs/architecture/fitness-functions.md`. | Say in the script's header or in `docs/architecture/baseline.md` whether a later measurement commits `out/` (a new snapshot) or only reports the numbers, and write to a scratch directory (`ARCH_OUT=…`) when it only reports. |
