# Workflow rules review: issue #208

Task: the statement PDF printed a percentage where the Zeitanteil is a ratio of days (a contract over the whole period with a heating profile, an invoice with a Leistungszeitraum); it now prints «x/y Tage» from days stored per position.

## Findings

1. **The domain review before implementing paid off.**
   - Rule: `CLAUDE.md`, Workflow 1 (fach-reviewer on the `@wip` scenario before production code).
   - What happened: round 1 found that the new fraction contradicted the PDF's own explanation (F-1, Major) and that the example could not tell the two day counts apart (F-2). Both would have reached the tenant. No change needed.

2. **A persona and the data check look at the same PDF from two sides, but only one of them may generate PDFs in other languages.**
   - Rule: `CLAUDE.md`, Workflow 5; `.claude/agents/daten-pruefer.md`.
   - What happened: the data check could not sign in to the app (signing its own session JWT was refused) and so could not check fr/it/en PDFs or the web page; the persona could. The new note text exists in four languages, but only German was seen in a PDF.
   - Proposed change: say in Workflow 5 that a change to PDF texts in several languages names one persona run per language that changed (or one run that generates each language), since the data check has no session.

3. **A finding that asks for a decision on behaviour versus documentation has no rule.**
   - Rule: `CLAUDE.md`, Workflow 6 and 7.
   - What happened: the data check's D-1 said the code and the new rule 5 text disagree and «someone has to decide». I changed the rule text to the code's behaviour (the fraction is right) instead of asking, because the text was written in this task. The rules say what to do with a finding that contradicts a decision of the issue, but not with one where the task's own new documentation and its code disagree.
   - Proposed change: in Workflow 6, a finding where this task's own documentation and its code disagree is fixed on the side that is wrong, without a product decision, unless the issue decided it.

4. **Commit subjects longer than 50 characters are easy to write and cost a blocked command each.**
   - Rule: `CLAUDE.md`, "Conventions: Commits" and the commit subject gate.
   - What happened: three of my commits in this session were blocked at 51 to 54 characters. The gate works; the cost is a retry each. No change proposed beyond noting it.

5. **`persona-kit.mjs` path with a capital letter** (as in `workflow-rules-review-issue-159.md`, finding 1): Dr. Weber patched the copy again.
