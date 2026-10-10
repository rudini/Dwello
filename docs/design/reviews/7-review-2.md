# Stage 7 – review 2 and persona re-runs

Reviewer: independent general-purpose agent, read-only, live at 390–1440 px (`a3921b7..8eb513e`, the round 1 fixes). Personas re-run after the fixes: Helga, Sven, Marco (`personas/*-7b.md`).

Code review verdict: 1 Blocker, 1 Major, 7 Minors; round 1 resolutions verified except R1 (partly), R4 (caused the Blocker) and R6 (partly). Personas: Helga yes (no Blocker or Major), Sven yes (4 Majors), Marco yes (no sideways scrolling anywhere; 2 Majors).

Fixes (round 3 of 3) in two packages, merged as 2cf2dd9 (layout) and 4053818 (accessibility); E2E 389 passed incl. axe and three new layout scenarios (page title readable and no sideways scrolling at 1024 px, wizard steps at 768/1024 px).

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| B1 | Review | Blocker | R4 regression: with 2–3 header actions the h1 shrank to 0–145 px (one letter per line) at 768–1280 px. | Header row wraps, the title keeps an 18rem basis, actions drop below. DOM test + scenario "Seitentitel einer versendeten Abrechnung im schmalen Fenster". |
| B2 | Review | Major | The 5-step Stepper widened the page at 768/1024 px. | Step names visible from `xl`, read by screen readers always; scenario outline at 768/1024 px. |
| B3 | Review | Minor | Long tenant e-mail widened the statement page at 1024 px. | `min-w-0 break-all`. |
| B4 | Review | Minor | "Renovation" still showed its English description. | Predefined = English key or German name differing from the key (covers every seeded row); the edit form says the list hides those descriptions. |
| B5 | Review | Minor | The toast region became inert behind a dialog. | Excluded from `inert`, above the backdrop. |
| B6 | Review | Minor | A failing count fetch emptied the whole building/tenant list. | Falls back to empty counts. |
| B7 | Review, Helga | Minor | Overview bars left out wiedervermietete Wohnungen. | "4/6 vermietet, 1 ab 1.11.2026". |
| B8 | Review | Minor | Toast reading time started before the toast was shown. | Timer starts when it becomes visible. |
| B9 | Review | Minor | E2E coverage of the server's refusal to delete a sent statement only via the axe state. | Kept as is: the button is no longer offered; the refusal stays covered by the `action-error` state. |
| S1 | Sven | Major | Deleting a tenant was silent. | Toasts after every delete (tenant, contract, invoice, statement; buildings and settings already had them). |
| S2 | Sven | Major | Corrected fields stayed announced as invalid; channel switch left address errors. | `Field` hides its error once the field changes (shown again on the next submit); channel change clears the address errors. |
| S3 | Sven | Major | After filtering a list, focus jumped to the top; the result count was not announced. | After a filter submit focus moves to the result count heading (all six lists; apartments and buildings got one). |
| S4 | Sven, Helga | Major/Minor | "Künftig", "Wiedervermietet", "Aktiv" for one future tenancy. | Not changed: all three are glossary terms for different things (Vertragsstatus, Mietstatus, Mieter); the help explains them. `offene-punkte.md`. |
| M1 | Marco | Major | On phones the cost table hid the amounts behind a swipe. | Cost lines as cards below `md`; no wrapping of "15.33 %" or "− CHF …". |
| M2 | Marco | Major | "Neu kategorisieren" without visible progress; error 600 px above. | Busy label "Wird kategorisiert …", error directly below the button and focused. |
| M3 | Marco | Major | Invoice form from the wizard still defaults to today. | Kept: the period notice appears at once and disappears with a date in the period; changing the default is a product decision. |
| M4 | Marco | Minor | "Verteilschlüssel: Nicht zugewiesen" sounded like an error. | "Keiner – die Kosten werden gleichmässig pro Wohnung verteilt" (TODO(fachlich prüfen)). |
| M5 | Marco | Minor | 24 px breadcrumb links. | 48 px targets. |
| M6 | Marco | Minor | Category list empty until a building is chosen. | Not reproducible: categories do not depend on the building; a failed request at load is the likely cause. |
| C1 | Own check | Minor | Apartments and buildings showed their count twice (subtitle and new heading). | The subtitle describes the page; the count stays in the results heading. |

## Deliberately not changed

- Error summary at the top of forms, action names on detail pages ("Bearbeiten" without the record), focus after link navigation: Minors, the errors are tied to their fields and focus moves to the first one.
- "Mahnung senden" before the Zahlungsfrist, payment date and undo of "Bezahlt", invoice date default: product decisions (`offene-punkte.md`).
- Errors of `Checkbox` and `RadioGroup` stay until the next submit.

Checks: unit 1288, lint, check, fallow clean, E2E 389 passed incl. axe (0 violations).
