# Stage 6 – review 2 and persona re-runs

Reviewer: independent general-purpose agent, live at 390 and 1440 px (`15c0ec5..39eac9f`), failures and sends faked in the browser. Re-runs: Anna (`personas/anna-6b.md`), Sven (`personas/sven-6b.md`).

Verdict: all round 1 Majors fixed and confirmed live; 0 Blockers, 0 Majors, 9 Minors – stage 6 can be closed. Fixed anyway, because cheap:

| # | Source | Finding | Resolution |
|---|---|---|---|
| 1 | Review | Statements whose period only overlaps the chosen one were not counted. | The BFF loads the building's statements and counts every overlapping period. Unit test. |
| 2 | Review | The link in the warning listed only drafts. | One link per building to its statements (`/statements?building=…`). DOM test. |
| 3 | Review | An empty preview still offered the invoice checks. | Checks only when there are statements to create. DOM test. |
| 4 | Review, Sven | Focus lost while the server works and after a failure; "wird berechnet" not announced. | Status line (`role="status"`) says "Vorschau wird berechnet …" / "Entwürfe werden erstellt …"; after a failure focus goes to the step heading. DOM tests (with a captured `enhance` callback). |
| 5 | Review | The enhance flow had no tests. | The DOM tests now play the server's answer: success leads to the preview, a failure keeps it. |
| 6 | Review | One failed request named every building in the overview task. | No task when the statements cannot be loaded. |
| 7 | Review | Fragile focus handoff after "Als versendet markieren". | Focus moves after the dialog has returned it. |
| 8 | Review | The partial-period hint came after the confirmation. | Hint above the checkbox. |
| 9 | Review | "Korrespondenzweg" instead of the glossary's "Korrespondenzkanal". | Renamed (dialog, scenario). |
| S2 | Sven | The warnings were not tied to the checkbox that confirms them. | `Checkbox` takes `describedby`; the warnings are read with it. DOM test. |
| A2 | Anna | Step 5 did not repeat that statements without invoices distribute CHF 0.00. | The confirmed warning is repeated before "Entwürfe erstellen". DOM test. |

Not changed (stage 7): overview task leads to the wizard although invoices come first, invoice count per building in step 2 (Anna); statement list links that do not name their statement, heating profile chart without values for screen readers (Sven).

Checks: unit 946, lint/check/fallow clean, E2E 378 passed incl. axe.
