# Workflow notes: #837 cycle 4a (categories, distribution keys, heating profiles)

| Rule | What happened | Proposed change |
|---|---|---|
| skill `slice-review`, 1 «Worktree» (`node_modules` linked into the worktree) | Both `code-reviewer` rounds could not run `bunx vitest run`: the link points to `/home/user/Dwello/node_modules`, which a deny rule blocks for reviewers. Every check stayed «reported by the caller». | Either let reviewers run the test commands through the link (allow executing, keep reading denied), or drop the link from step 1 and say that the reviewer relies on the checks the prompt names. |
| `tools/fitness/fitness.ts`, literal-set check | As in `workflow-notes-issue-837-c2.md`: the `Pick` key union `'id' \| 'name' \| 'nameDE'` in two BFF mapper input types counted as a value list in three files. Worked around by deriving both from the invoice's embedded category and key. | As there. |
| ADR 0005 «misst vorher und nachher» | As in `workflow-notes-issue-837-c2.md`: the CSVs in `tools/arch-baseline/out/` were reverted by hand after each of four measuring runs. | As there. |
