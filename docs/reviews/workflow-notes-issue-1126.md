# Workflow notes: #1126 (Kostenabstimmung)

| Rule | What happened | Proposed change |
|---|---|---|
| Skill `grill-me`, step 1 (decisions to list) | The interview settled what «Berichte» shows but not how the landlord gets there. «Berichte» had no menu item (it was a coming-soon page), so all five personas failed to find the new page, and the menu item came only in the feature review, one more slice and review round. | In step 1, for a new or newly filled screen, list «how the landlord reaches it (menu, links from which pages)» as a decision to ask. |
| `CLAUDE.md`, "Before marking anything complete" (`bun run fitness`) and skill `slice-review`, 2 (checks named to `code-reviewer`) | `bun run fitness` ran first after the frontend slice and again after the merge of `main`; each time it forced a move (route into another file, components into another module, types into `backend/src/api/`), and each move needed its own commit and review round. | Run `bun run fitness` with lint before committing each slice, and name it in the checks handed to `code-reviewer`. |
