# Stage 7 – review 1 (remaining screens) and personas

Reviewer: independent general-purpose agent, read-only, live at 390, 768, 1024 and 1440 px (`dcc5eee..2d20713`). Personas: all five (`personas/*-7.md`).

Code review verdict: 0 Blockers, 6 Majors, 14 Minors. Personas: Helga yes, Sven yes (keyboard only), Marco partly (set the category by hand after the KI categorization failed), Anna partly on purpose (stopped before creating 2025 statements without invoices), Dr. Weber would not send the statement (PDF content and the seeded 70/30 formula – backend/seed).

Fixes in three packages (F1 statements/invoices, F2 Mietstatus, F3 focus and toasts), merged as 02decfb, 4a79ffe and 52b9f64; E2E 386 passed incl. axe (0 violations, new state `statements mark-paid-dialog`).

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| R1 | Review, Marco | Major | Statement detail: the cost table widened the page (sideways scrolling at 390 and 1024 px). | Grid children `min-w-0`; the table scrolls inside its own box. (F1) |
| R2 | Review, Anna | Major | Invoice rows: "Bearbeiten" stuck out of the card, the page scrolled sideways even at 1440 px. | Rows stacked below 1280 px, fixed columns from `xl`, action column never shrinks. (F1) |
| R3 | Review, Anna | Major | Statement rows: same overflow with "PDF" and "Bezahlt". | Same layout. (F1) |
| R4 | Review, Marco, Anna | Major | "Nebenkostenabrechnungen" could not wrap at 390 px. | `PageHeader` h1 `hyphens-auto break-words`, wrapper `min-w-0`. (F1) |
| R5 | Review, Sven | Major | Focus fell to `<body>` after a failed save; errors not announced. | Shared `focusFirstError` (`src/lib/ui/focus-error.ts`) in every create/edit form and both wizards; focuses the first invalid field or the form alert. DOM tests. (F3) |
| R6 | Review, Anna, Dr. Weber | Major | English seed descriptions of predefined categories. | Hidden in the list (predefined derived from `name !== nameDE`); also in the statement wizard's heating profile step. (F1) |
| R7 | Review, Helga, Sven | Major | Contract history on the apartment page: "1.11.2026 - heute" for a future contract; amount not labelled. | `contractPeriod()` (en dash, never "heute"), "monatlich total". (F2) |
| H1 | Helga, Sven, Anna | Major | A relet apartment had three different statuses ("Wiedervermietet", "Vermietet ab …", "derzeit nicht vermietet") and was missing from the building figures. | "Wiedervermietet ab 1.11.2026" everywhere, panel "Künftiger Mieter" with name and date, "Mietvertrag erfassen" secondary; building figures count wiedervermietet and gesperrt ("6, davon 4 vermietet, 1 wiedervermietet und 1 leer"); clearer status help. (F2) |
| A1 | Anna | Major | Overview "0 Wiedervermietet / 4 Leer" did not match the lists. | Not a defect: the overview and the list use the same backend status (backend test), Anna read the overview before another tester created the contract in the shared database. |
| S1 | Sven | Major | Success toasts not heard (region inserted already filled, gone after 3–5 s). | Empty `role="status"` region from the start, text inserted after the navigation; success 8 s, errors until closed. DOM tests. (F3) |
| M1 | Marco | Major | Failed categorization read "Kategorisierung ausstehend" after reload; list badge "Ausstehend" ambiguous. | "Nicht kategorisiert – bitte Kategorie wählen", list badge "Kategorie fehlt" (the backend categorizes while saving, nothing runs later). (F1) |
| M2 | Marco | Major | A category chosen by hand left the Verteilschlüssel empty without a hint. | Help text "Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt." – TODO(fachlich prüfen). No automatic assignment (business logic). (F1) |
| A2 | Anna | Major | "Rechnung erfassen" from the statement wizard defaulted to today, outside the Abrechnungsperiode. | The link carries the period; the invoice form warns when the Rechnungsdatum lies outside it. Scenario "Eine Rechnung aus der Warnung ausserhalb der Abrechnungsperiode fällt auf". (F1) |
| A3 | Anna, review #9 | Major/Minor | "Bezahlt" button looked like the status badge. | "Als bezahlt markieren". (F1) |
| R8 | Review | Minor | `markPaid()` without error handling or confirmation. | try/finally, error in the dialog, toast. (F1) |
| R10 | Review | Minor | Contract delete dialog suggested statements are kept. | "Ein Mietvertrag mit Nebenkostenabrechnungen kann nicht gelöscht werden." (F2) |
| R11 | Review | Minor | "Abrechnung löschen" offered for sent/paid statements. | Only for drafts; the axe `action-error` state posts the refused delete directly. (F1) |
| R12 | Review | Minor | "Lieferanten" in an error, field named "Rechnungssteller". | "Rechnungssteller". (F1) |
| R13 | Review | Minor | Four filter implementations. | Partly: statements and apartments use `EarlySelect` in a GET form; the rest stays for stage 8's clean-up (works, tested). |
| R14 | Review | Minor | Four near-identical dialog-with-form wrappers. | Deferred to stage 8 (consolidation without behaviour change). |
| R15 | Review | Minor | Two "today"s for the Vertragsstatus. | Loaders pass `today`; contract history uses the local date. (F2) |
| R16 | Review | Minor | Mark-paid dialog not an axe state. | State `statements mark-paid-dialog`. (F1) |
| R17 | Review | Minor | Migrated routes still import restyled `$lib/components/*`. | Stage 8 moves or deletes the folder. |
| R18 | Review | Minor | No "Künftige Mietverträge" filter. | Added. (F2) |
| R19 | Review | Minor | Building delete blocked only after confirming. | Reason shown when the dialog opens, confirm disabled. (F2) |
| R20 | Review, Marco | Minor | Active category filter looked like a primary button; invoice edit without toast or trim; amount "480". | Soft accent style; toast and trim; two decimals. (F1) |
| S2–S6 | Sven, Anna | Minor | Name conflict not at the field; focus after delete; dialog background not inert; link texts without the record; mobile menu state; apartment title without building; tenant with only a future contract "Keine laufende Miete"; alarming "Leer" icon. | Category name conflict at the field; focus to the h1 after a confirmation; `inert` background; "Mietvertrag Wohnung 1.01", "Mietvertrag von …", "Route planen zu …"; `aria-expanded`; "Wohnung 2.02, Musterhaus Zentrum"; "Mietvertrag ab …"; open-door icon. (F2, F3) |

## Deliberately not changed in stage 7

- PDF content (English category names, no Verteilschlüssel column, fee base, tenant address, file name), the seeded "70 % / 30 %" formula, implausible seeded Heizprofile, heating-oil stock: backend or seed data (`offene-punkte.md`).
- Payment date, undo of "Bezahlt", "Bezahlt" in the Verlauf, "Mahnung senden" before the deadline: product decisions (`offene-punkte.md`).
- "Wiedervermietet" stays the glossary term (Helga would prefer "Vermietet ab"); tenants with only a future contract stay "Aktiv" as the glossary defines.

Checks after the fixes: unit 1256 (coverage 89 % statements, 75 % branches), lint, check, fallow clean, E2E 386 passed incl. axe, no backend or CI change in stage 7.
