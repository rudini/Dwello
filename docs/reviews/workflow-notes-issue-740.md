# Workflow notes: issue #740

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1, «Scenarios are the specification» | The product owner decided the sidebar from 768 px; as a consequence the axe state `mobile-menu-open` (a step behind a non-`@wip` row of `accessibility.feature`) can no longer open the drawer on the tablet viewport (820 px) and now checks one view less. The decision did not name the row, so the task wrote the consequence into the issue's «Decided (product owner)» itself and cites `Spec change approved: #740`. | Say whether a decision whose direct consequence is a narrower step counts as approval, or whether the task stops and asks for the row to be named. |
| `CLAUDE.md`, Workflow 5 and `docs/test-pyramid.md` | Moving the sidebar breakpoint shrank the content at 768–1023 px by 320 px; viewport breakpoints in components (`sm:grid-cols-2` in `RunSummary.svelte`) assume the content as wide as the window, and only the full E2E run found the one that overflowed. | Name a full E2E run (or the no-sideways-scroll scenarios at 768 and 960 px) as an affected check when a change alters the width of the content area. |
