# Workflow rules review: issue #229

Task: follow-ups of #209: the PDF of a period under a year names both sums of the Heizprofil months, older statements print no months that no longer fit, the detail page names the stored profile, note and heating line show one rounded value.

## Findings

1. **A persona cannot reach a state the demo data blocks, and may not unblock it.**
   - Rule: `CLAUDE.md`, Workflow 5 («give each persona that needs to save its own building … say in its task that saving … is part of it»; «the SQL that writes it into `dwello_persona`, which you run before starting the persona» only for an outside service's result).
   - What happened: Dr. Weber was to create statements for 01.01.–30.09.2025 in «Seepark Residenz», but the demo drafts 2025 overlap that period; deleting them was refused by the permission check, so the first run ended without a review. I deleted the four drafts by SQL in `dwello_persona` and ran the persona again.
   - Proposed change: in Workflow 5, allow SQL in `dwello_persona` before a persona starts also to clear the demo records that block the persona's task (not only for an outside service's result), and name it in the task.

2. **The data check waits on another reviewer's records.**
   - Rule: `CLAUDE.md`, Workflow 5 (`daten-pruefer` and personas run in parallel).
   - What happened: the data check's case (a period under a year with a move) existed only once the persona had created it; run in parallel, the data check waited 27 minutes for records that never came and had to be told to stop. It ran again after the persona.
   - Proposed change: when the data check needs records a persona creates, run it after that persona; say so in Workflow 5 or in the skill `slice-review`.

3. **Visible text changes in the PDF are easy to make without a red test.**
   - Rule: `CLAUDE.md`, Workflow 6 («A fix that changes behavior (a changed help or error text the user sees included) gets a failing test first»).
   - What happened: the English wording fix (V-2) changed only a string; code review found it untested (C-12). The four-language PDF strings live in `pdf.service.ts`, not in `messages/*.json`, so the checks for message keys do not cover them.
   - Proposed change: a render test per language for every PDF string that is not in `messages/*.json`, or move the PDF strings into a structure a test can list.
