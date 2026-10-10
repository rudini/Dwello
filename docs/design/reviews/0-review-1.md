# Stage 0 – review 1

Reviewer: independent Plan agent, read-only, fresh context. Input: brief, glossary, CLAUDE.md, the stage 0 documents, `ci.yml`, `tests/ui-screenshots/*`, the source.

Verdict: analysis largely accurate (route inventory complete, CI summary correct, label bug confirmed); three Majors.

## Findings and resolution

| # | Severity | Finding | Resolution |
|---|---|---|---|
| 1 | Major | The swapped Zusatzmiete/Akonto labels also appear on the contract detail page; `MonthlyCostsCard` maps them correctly, so the same contract reads differently. | Added to barrier 2 and the term table; `progress.md` plans the fix for the wizard (stage 5) and the detail page (stage 7). |
| 2 | Major | `screens.json` lacked most dialog, empty, error, validation and feature states; state names undefined; `?status=paid` as "empty" is fragile. | `screens.json` now defines every state name (`stateMeanings`) and lists dialog/empty/validation/feature/shell states per screen; true empty states are checked against an empty database before seeding instead of a filter. |
| 3 | Major | Term table missed deviations (Aconto spelling, Mietzins (brutto), Periode, Akontobeiträge, Liegenschaft, Mietbeginn/Einzug am, Geschoss, Wohnfläche, Zimmer as label, Belegt/Leerstand, Aktive/Beendete Verträge, dashboard finance terms, i18n source). | All added to section 6 with locations and actions. |
| 4 | Minor | "Nettomiete, Akonto … used correctly" contradicted the table. | Qualified. |
| 5 | Minor | CI summary missed the skip on docs-only pushes and `cancel-in-progress`. | Added. |
| 6 | Minor | `progress.md` phrased the label fix as done. | Reworded as planned. |
| 7 | Minor | Draft PR missing, stage not closed. | Draft PR rudini/Dwello#32 created; stage closed with this report. |
| 8 | Minor | Section 9 duplicated the screen list. | Now references `screens.json` only. |

No finding deliberately left open. One round was sufficient (documentation-only changes).
