# Workflow notes: issue #1257

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/personas/README.md`, "Which personas" («a change that adds a screen or flow gets every persona») | One delete button with its two dialogs on an existing page counted as a new flow, so all five personas ran. Dr. Weber, Helga and Marco met the same paragraph; Anna's Major was about the existing building dialog. | Say whether a new action on an existing screen is a "flow". E.g. «a new dialog on an existing screen: the two personas that fit it best, plus Marco». |
| `CLAUDE.md`, Workflow 7, with skill `pull-request`, "Before each push" 2 | As in `workflow-notes-issue-710.md`. Here the closing round's two Minor fixes touched only tests (pin a reviewed text; reuse a target). Each was seen red, and still they needed one more round before the push. | A closing round's Minor fixes that change only tests, each seen red, ride without a round of their own. |
| `tools/fitness` `bff-decision` (anchored regex in the BFF) | A UUID check on the posted building id, only to choose the redirect, was flagged as a business decision. I worked around it by encoding the id instead of adding a `technical` exception. | Name «a value only used to build a redirect» in the fix text: encode it, no check needed. |
