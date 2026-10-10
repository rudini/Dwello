# Stage 9 – final review and final persona round

Final reviewer: independent general-purpose agent, read-only, against the Definition of Done of `docs/REDESIGN_BRIEF.md` (HEAD 832d9a7), live in light/dark and desktop/mobile. Personas: all five with the brief's tasks (`personas/*-final.md`).

## Definition of Done (reviewer's verdict, then the state after the fixes)

| # | Item | Reviewer | After the fixes |
|---|---|---|---|
| 1 | Only new tokens and components, no remnants | met | met |
| 2 | Build, lint, typecheck, tests green; new logic via /tdd | partly (CI unit run on c4bb7d4 failed: unhandled map rejection) | met: fixed in 832d9a7 (CI green), unit 1292, E2E 389 |
| 3 | Axe in CI, all screens and states, 0 violations, no blanket exceptions | partly (gaps: error page, visible toast, empty statement detail, edit-form submit-empty) | met for every route and listed state; the named extra states are listed in `offene-punkte.md` |
| 4 | Domain terms from the glossary | met | met |
| 5 | Review report per stage, Blockers/Majors fixed or justified | partly (no stage 9 report, status table stale) | met: this report, status table updated |
| 6 | All 5 personas complete their task in the final run | partly (2 reports pending) | met: Helga, Marco, Dr. Weber, Sven and Anna completed their task |
| 7 | Both wizards end-to-end | met | met |
| 8 | Overview with tasks and deadlines; ≥ 8 illustrations, one icon set | met (10 motifs in 17 route files, Lucide) | met |
| 9 | No hard-coded colours/spacing, ≥ 16 px, ≥ 44 px, no forbidden patterns | met | met |
| 10 | docs/design and CLAUDE.md "Design-Regeln" | met | met |
| 11 | Committed, pushed, clean tree, draft PR, ui-screenshots passed for the latest commit | not verifiable during the review | see `progress.md`, stage 9 log |

## Findings and resolution

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| F1 | Review, Dr. Weber | Major | Cost table on the statement detail hid the "Betrag" column at 1280/1440 px. | The cost breakdown takes the full width (DOM test). |
| F2 | Review | Major | Unit tests exited 1 in CI (map created after the component was gone). | `destroyed` guard, test reproduces it (832d9a7). |
| F3 | Review | Major | Stage 9 report and status table missing. | Written. |
| H1 | Helga | Major | Apartment choice in the contract wizard without rooms or area. | "Wohnung 2.02 - Musterhaus Zentrum, 2.5 Zimmer, 65 m²" (unit and loader tests). |
| H2, A, M | Helga, Anna, Marco | Major/Minor | Native date field shows "mm/dd/yyyy" in the test browser. | Not changed: the browser draws its own date field after the system locale (Swiss systems show dd.mm.yyyy); every date is repeated in words below the field. `offene-punkte.md`. |
| M1 | Marco, Anna | Major/Minor | Back from "Rechnung erfassen" the statement wizard started at step 1. | Returns to the step before the preview, so one "Weiter" calculates the preview with the new invoice (DOM test). |
| M2 | Marco | Major | The missing-invoice warning only appears in step 4. | Kept: the invoices are counted with the preview the server calculates; the overview task already says to record the invoices first. `offene-punkte.md`. |
| M3 | Marco | Major | "Kosten aller Abrechnungen" smaller than the invoices without explanation. | "Den Anteil leerer Wohnungen trägt der Vermieter; er ist in diesem Betrag nicht enthalten." (glossary: Vermieter, Proration). |
| S1 | Sven | Major | Year 12025 also announced "liegt in der Vergangenheit". | No past-date notice for an impossible year (unit test). |
| S2 | Sven | Major | "… ändern" in the review moved focus to the step heading. | Focus goes to the field to change (DOM test). |
| S3 | Sven | Major | "Mieter erfasst" and "Entwurf wiederhergestellt" were not announced. | The notice takes the focus when the wizard opens (DOM test). |
| A1 | Anna | Major | Overview task says to record invoices first but offers only "Abrechnungen erstellen". | Kept: one action per task (D14); the wizard's preview lists the invoices per building and links "Rechnung erfassen". `offene-punkte.md`. |
| A2 | Anna | Major | No year filter on the invoice list. | Feature beyond the redesign; `offene-punkte.md`. |
| A3 | Anna, Marco | Major/Minor | Invoice form from the wizard defaults to today. | Kept (product decision); the period notice warns at once. `offene-punkte.md`. |
| W1 | Dr. Weber | Major | PDF content, partly covered 2024 invoices, implausible Heizprofile. | Backend and seed data (`offene-punkte.md`); the screens let him trace every number. |
| R5 | Review, Dr. Weber | Minor | "Die Pauschale wird so … verteilt" had no reference. | "Nach diesem Verteilschlüssel wird die Pauschale auf die Wohnungen verteilt; jeder Mieter trägt den Teil seiner Mietstage." |
| R6 | Review | Minor | Statement without positions showed an empty table. | "Keine Abrechnungspositionen: Für diese Abrechnungsperiode waren keine Rechnungen erfasst." |
| – | Review, personas | Minor | Statement list column alignment, Verlauf alignment, dashboard percent spacing, tenant row separator, mobile toast covering content, step-name hyphenation, "Mietstagen" read as a typo, help glossary without Umlagefähig/Nachzahlung/Wiedervermietet/Gesperrt. | Listed in `offene-punkte.md` ("Mietstage" is the glossary term). |

Checks after the fixes: unit 1292, coverage 89 % statements / 76 % branches (exit 0), lint, check, fallow clean, E2E 389 passed incl. axe light and dark.
