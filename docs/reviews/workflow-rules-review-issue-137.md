# Workflow rules review: issue #137

Task: bug #137, «PDF says «nach Heizprofil» when heating costs were shared by days». The fix lets the calculation report when it shared heating costs by Mietstage, and the PDF follows it. Reviewed against `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, the skills, the agents, the hooks and the documents they make binding.

## Findings

### W-1: No rule on whether personas review a PDF-only change

- **Rule:** `CLAUDE.md`, Workflow step 5: «UI changed, or what a screen shows changed (also through a backend change): subagent `persona`».
- **What happened:**
  - #137 changes only what the statement PDF prints. A PDF is not a screen, but a landlord and a tenant read it.
  - I ran `daten-pruefer` (PDFs) and `fach-reviewer` (domain rules), and no persona.
- **Proposed change:** say whether a PDF counts as «what a screen shows». For example: «a change to what a PDF prints: persona Dr. Weber (claims with legal weight) when its texts change; otherwise `daten-pruefer` covers it».

### W-2: The step «Und steht im PDF nicht …» needs a positive anchor, but the rule does not say which

- **Rule:** `tests/e2e/CLAUDE.md`, Rules, «Negative checks» need a positive anchor first.
- **What happened:**
  - The scenario's negative check («steht im PDF nicht "Heizprofil"») follows the positive check «48/92 Tage».
  - The domain review showed that my first negative check («nach Heizprofil») missed the general note «nach dem Heizprofil». A negative check on a phrase can pass while a variant of the phrase is still there.
- **Proposed change:** add to the rule: «a negative check names the shortest word that every wrong variant contains (e.g. "Heizprofil", not "nach Heizprofil")».

### W-3: The fallow CRAP gate again shaped the code

- **Rule:** `CLAUDE.md`, Gotchas, «Fallow gate».
- **What happened:**
  - One ternary added to `costTable` in `pdf.service.ts` raised its estimated CRAP from below 30 to 31.6.
  - The note moved into its own function `sharesNote`.
  - Same finding as W-1 in `docs/reviews/workflow-rules-review-issue-135.md`.
- **Proposed change:** as there: say how to treat an estimated CRAP finding.
