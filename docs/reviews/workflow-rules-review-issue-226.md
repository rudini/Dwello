# Workflow rules review: issue #226

Task: the statement PDF lists, under a position whose invoices bill different days, each invoice with its days and the calculation that weighs them, so the tenant can recompute the Zeitanteil; the note under the table explains it.

## Findings

1. **A scenario the domain review changed before implementing is not seen red again.**
   - Rule: `CLAUDE.md`, Workflow 1 («Watch it fail for the right reason … `Scenario red: <assertion>`»; fach-reviewer «before implementing»; «Fix its findings before the first test turns green»).
   - What happened: the scenario was red at «900.00, 0/91 Tage»; the domain review (V-2) changed its amounts to 600/1'200 and added a formula line. I changed it and went on to implement; the new expectations never ran red in E2E (code review C-4). The same lines were red at the pg layer, so nothing was lost, but the rule does not say whether a scenario changed by the review needs a second red run.
   - Proposed change: in Workflow 1, after fixing the fach-reviewer's findings on the `@wip` scenario, run it once more and note the new failing line.

2. **The PDF text reader decodes differently under Node and Bun.**
   - Rule: `docs/test-pyramid.md` (E2E and backend tests share `backend/src/__tests__/helpers/pdf-text.ts`); `tests/e2e/CLAUDE.md`.
   - What happened: `TextDecoder('windows-1252')` is Windows-1252 in Bun but Latin-1 in Node, which runs Playwright; «–» read as U+0096 in E2E only. No scenario had checked a dash in a PDF before, so it showed only now, as a red scenario after the code was done. Fixed with a table in the helper.
   - Proposed change: a test of the helper that runs under Node too (a vitest unit test next to the E2E questions), or a note in `docs/test-pyramid.md` that helpers shared by E2E run under Node.

3. **Four reviewers reported one gap; the rules have no place to say so.**
   - Rule: skill `slice-review`, "Triage" (one plan line per reviewer and round).
   - What happened: the note under the table did not explain the invoice lines: Dr. Weber P-1 (Major), fach-reviewer V-9, code review C-3, data check D-1. The plan lines name the shared fix with «= P-1» by judgement. Same point as `workflow-rules-review-issue-159.md`, finding 3.
   - Proposed change: as there: findings of different reviewers with one cause share one fix and one test; each plan line names the finding that holds it.

4. **The data check after the persona worked; the rule still says «in parallel».**
   - Rule: `CLAUDE.md`, Workflow 5.
   - What happened: following `workflow-rules-review-issue-229.md`, finding 2, I started `daten-pruefer` after Dr. Weber had created the statement; it recomputed it in one round without waiting. Deleting the demo draft by SQL before the persona started (finding 1 there) was again needed and worked.
   - Proposed change: as in that review (both points).

5. **The stop hook asks to commit and push at every pause.**
   - Rule: `CLAUDE.md`, Workflow 9 («A stop hook outside this repo … does not override step 4 or this step»).
   - What happened: the hook fired at each wait for a reviewer; to stop it I committed red tests and a persona report as separate local commits (`f3e73c00`, `4e18ec6e`) before their slice was done. Harmless, since nothing is pushed, but the history has commits that are red on purpose.
   - Proposed change: say in Workflow 4 whether a red test may be committed alone before its slice (it shows the red in the history), or that the hook's commit request is to be ignored like its push request.
