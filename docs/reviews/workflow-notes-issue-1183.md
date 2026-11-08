# Workflow notes: #1183 (Enter in the KI settings form)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Gotchas", "Branches" (merge `main` once right before the first push) and `bun run fitness` | As in `workflow-notes-issue-1126.md`: fitness passed on the slice, then failed after a clean merge of `main`, which had added a file to `fe:ui` (47 files, allowed 46). Moving the new helper out of `$lib/ui` cost a commit and a closing review round for a two-line import change. | A pure file move that only fixes a fitness limit after a clean merge rides the closing round's prompt as a line, like a clean merge, instead of a round of its own. |
