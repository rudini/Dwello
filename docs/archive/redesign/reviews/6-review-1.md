# Stage 6 – review 1 (statement wizard, send confirmation) and personas

Reviewer: independent general-purpose agent, read-only, live at 390 px and 1440 px (`9878022..15c0ec5`). Personas: all five (`personas/*-6.md`).

Code review verdict: 0 Blockers, 4 Majors, 11 Minors. Personas: Helga partly (stopped safely at step 5 – no 2025 invoices), Marco yes (after recording an invoice), Dr. Weber partly (would not send the draft yet), Anna partly, Sven yes (keyboard only).

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| R1 | Review | Major | The confirmation for missing invoices stayed ticked for the next preview. | Reset on every new preview; scenario "Eine Bestätigung gilt nur für ihre Vorschau". |
| R2 | Review | Major | A preview with 0 statements still led to "0 Entwürfe erstellen". | Step 4 stops with "Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude." DOM test. |
| R3 | Review | Major | A failed "Entwürfe erstellen" wiped the preview. | Preview and invoices kept in component state; the server answer is handled in the `enhance` callback. |
| R4 | Review, Anna, Dr. Weber | Major | Invoices covering only part of the period were not flagged. | Hint (no confirmation) when more than three months at the start or end of the period have no invoice; TODO(fachlich prüfen) on the rule. Unit + DOM test. |
| M1 | Marco | Major | No warning when statements for the building and period already exist. | The preview counts them per building (`statements?buildingId&periodStart&periodEnd`); a warning with a link to the drafts and the same confirmation as missing invoices. Unit + DOM test. |
| A1 | Anna | Major | The overview dropped the "erstellen" task as soon as one building had statements. | The task names every rented building without statements for the last period. Loader test. |
| S1 | Sven, Review | Major/Minor | The missing confirmation was not read out; the step 2 error stayed after choosing a building; no busy state while the preview loads; wrong busy text. | `Checkbox` gets `error` (`aria-invalid` + `aria-describedby`); any input clears the step's errors; "Weiter" shows "Vorschau wird berechnet …", the final button "Entwürfe werden erstellt …"; focus moves to the step heading after the server answer. DOM tests. |
| R8 | Review | Minor | "1 Nebenkostenabrechnungen". | Singular. DOM test. |
| R10 | Review | Minor | Server error stayed visible on other steps. | Shown until the user moves on. |
| R11 | Review | Minor | "PDF ansehen" showed JSON when the PDF could not be made. | A German sentence in the tab. Endpoint test. |
| R12 | Review | Minor | No confirmation and lost focus after "Als versendet markieren". | Toast "Abrechnung als versendet markiert", focus on the page heading. |
| R13 | Review | Minor | "keine Adresse erfasst" for a missing e-mail address. | "keine E-Mail-Adresse erfasst" / "keine Postadresse erfasst". DOM test. |
| R14/15 | Review | Minor | Sequential loads; building id not encoded. | `Promise.all`; `encodeURIComponent`. |

## Deliberately not changed in stage 6

- R9 (draft restore drops deleted buildings silently): rare; listed in `offene-punkte.md`.
- English category and heating profile names, empty "Verteilschlüssel" column, "Verwaltungsgebühr" vs. "Verwaltungspauschale" on the statement detail, "Mietstagen", US date format in native date fields, wide tables on phones (statement and invoice lists), invoice date default and "back to the wizard" from the invoice form: stage 7 screens (persona backlog).
- PDF content (tenant address, inspection note, refund method, distribution key) and proof of delivery: backend, outside the UI scope (`offene-punkte.md`).
- "Abrechnungen erstellen" is not a main navigation item: it is reached from the overview task, the statement list and the quick actions; a second entry would duplicate "Nebenkostenabrechnungen". Recheck with the stage 9 personas.

Checks after the fixes: unit 942, lint/check/fallow clean, E2E 378 passed incl. axe (0 violations), backend 462.
