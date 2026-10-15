# Workflow rules review: issue #135

Task: bug #135, «Statement wizard hides dropped draft values and existing statements». The fix names dropped draft values in the restored notice and shows the existing statements per building in step 2. Reviewed against `CLAUDE.md`, `tests/e2e/CLAUDE.md`, the skills, the agents, the hooks and the documents they make binding.

## Findings

### W-1: The fallow CRAP gate on Svelte templates shapes component design

- **Rule:** `CLAUDE.md`, Gotchas, «Fallow gate». Its guidance is to fix the reported finding, not work around it.
- **What happened:**
  - Two small template branches in `StatementWizard.svelte` pushed its template from below 30 to an estimated CRAP of 43.1, and after one rework to 31.6. The commit was blocked both times.
  - To pass, the loop moved into the shared `DraftNotice.svelte` as a `notes` prop.
  - Later, `BuildingChoice.svelte` hit 43.1 for one `aria-describedby` expression and a class ternary.
  - fallow's CRAP for templates is «estimated from export references», not measured, so a template already covered by DOM tests still scores as partly covered.
- **Proposed change:** say in the Gotchas how to treat a template finding:
  - for example, run `fallow health --coverage` with the Vitest coverage file before reworking;
  - or name the accepted ways out: moving expressions into `$derived`, or moving a loop into a child component.

### W-2: It is not stated which commit the check results given to a reviewer must come from

- **Rule:** `CLAUDE.md`, Workflow step 4: «plus the results of the checks you ran».
- **What happened:**
  - I gave `code-reviewer` a coverage result from the commit before a late refactor, together with E2E results from the reviewed commit.
  - The reviewer found an unhandled error that made `test:coverage` fail on the reviewed commit (finding C-1, a Blocker).
- **Proposed change:** add «on the reviewed commit; rerun after any change since» to step 4.

### W-3: Any text fix triggers a full persona round

- **Rule:** `CLAUDE.md`, Workflow step 6: «the persona runs again only when the fix adds a text or screen state it has not seen».
- **What happened:**
  - Every Minor or Nit fix to wording or layout added a text that the persona had not seen.
  - All four personas therefore ran a second round, which cost about as much as the first.
- **Proposed change:**
  - Let a round 2 cover only the personas whose finding changed a text they rate.
  - Or let one persona confirm text-only fixes for the others.

### W-4: Commit gate and chained edits

- **Rule:** `CLAUDE.md`, Gotchas: «Never chain edits and a `git commit` … in one Bash command».
- **What happened:**
  - A plan edit chained before `git commit` was dropped when the commit subject gate refused a subject of 53 characters.
  - The same thing happened in #128 (`docs/reviews/workflow-rules-review-issue-128.md`).
- **Proposed change:** have the gate print the subject length limit before it blocks the command, or check the subject with a separate dry-run command (for example `node .claude/hooks/commit-msg-gate.mjs --check "<subject>"`).

### W-5: The reviewer prompt does not ask whether a scenario's records are tied to today's date

- **Rule:** `tests/e2e/CLAUDE.md`, Rules, «Isolation». It does not mention dates.
- **What happened:**
  - The new axe state `buildings-billed` used the period the wizard suggests, which moves with today's date.
  - The seeded statements are fixed to 2025.
  - The code reviewer found it (C-2, a Major); the fix enters 2025.
- **Proposed change:** add a rule that axe states and scenarios enter periods and dates that match their seeded records, never the app's defaults that depend on today.
