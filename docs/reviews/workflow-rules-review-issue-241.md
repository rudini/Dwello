# Workflow rules review: issue #241

Task: the statement PDF labels the invoice lines under a position over different days, ends the calculation at «Ihr Anteil» and explains it in short sentences; the same pull request names the change of the Tankbestand (#239). Before it: the related-issue check the product owner asked for in the chat, which left #237 waiting and closed the decision issues #227 and #240.

## Findings

1. **A decided text can be wrong for cases its example does not show.**
   - Rule: `CLAUDE.md`, "Coding guidelines" («any other change to a text or value the issue decided needs the product owner first»); skill `grill-me`.
   - What happened: #241 decided the label «Leistungszeitraum» for every invoice line; the domain review before implementing (V-1, Major) showed it false for an invoice without Leistungszeitraum and one reaching beyond the period. I asked in the chat; the product owner decided both cases (and V-2, V-6 to V-8) in one round. The rule worked, but the error was in the decision, which no review checked.
   - Proposed change: in `grill-me`, before writing «Decided (product owner)», check each decided text against the cases the code produces (here `inPeriod`), or run `fach-reviewer` on the proposed texts.

2. **«One pull request per issue» and «fix a Major the change makes worse» pull apart.**
   - Rule: `CLAUDE.md`, Workflow 8 (one pull request per issue) and Workflow 7 (a Blocker/Major of the change is fixed before done).
   - What happened: code review C-1 (Major) found the change of the Tankbestand newly labelled «Leistungszeitraum»; its fix is the decided text of #239. I fixed it here and the pull request closes #239 too, rather than merging #241 with an open Major.
   - Proposed change: say in Workflow 8 that a Major whose fix is another ready issue's decided text is fixed in the same pull request, which then closes both.

3. **An issue written from a review finding can describe a state the app cannot reach.**
   - Rule: `.github/ISSUE_TEMPLATE/task.md` ("Problem": what is wrong today, with evidence).
   - What happened: #237 (from domain review V-6 of #226) asks to handle credits as invoices; the invoice form refuses a negative amount and the upload tells the landlord to subtract a Gutschrift. Found only when starting it; it now waits for the product owner.
   - Proposed change: the template's "Problem" names how a landlord reaches the state (the screen or data that produces it), or says that only the API does.

4. **Row numbers in `docs/design/offene-punkte.md` collide across branches.**
   - Rule: `CLAUDE.md`, "Open work".
   - What happened: O-31 was added and removed on the #226 branch, and #233 had meanwhile added its own O-31 and O-32 on main; my new row first took O-31, then O-32, both taken. `open-work.test.ts` does not check for duplicate IDs.
   - Proposed change: a test that row IDs in `offene-punkte.md` are unique, and the rule to take the next number after merging `origin/main`.

5. **The data check after the persona and SQL before the persona worked again** (as in `workflow-rules-review-issue-226.md`, finding 4); no new proposal.
