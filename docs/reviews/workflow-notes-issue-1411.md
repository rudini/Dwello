# Workflow notes: #1411 (apply the workflow review of 9 November 2026)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, «When to ask» (gate files), and #1411's «Where» | Point 10 names only a sentence in `CLAUDE.md`, but CI (`tools/open-work/check-issues.mjs`) enforces the gate rule, so the sentence alone would have contradicted CI. The exemption went into the check as well; code review 1411-1 C-1 (Major) found the first version too wide, which cost a second round. | When a collected review proposes an exception to a rule that CI enforces, it names the check that enforces it as a place, so the decision covers both and the narrow form is in the proposal. |
| `CLAUDE.md`, Workflow 2 (a test seen red) with a test that spawns a CLI that writes | The red run of the new `--update without --base` test ran the old CLI, which rewrote `tools/fitness/ratchet.json` in the working tree; the file had to be restored by hand. | Skill `tdd`: a test that spawns a command which writes files in the repository runs its red run against a copy (a worktree in the scratchpad) or checks `git status` after it. |
