# Open points

Items the redesign could not or deliberately did not resolve. Each with reason and suggested owner.

## Glossary proposals (TODO(fachlich prüfen))

`UBIQUITOUS_LANGUAGE.md` is not edited by the redesign. Terms or explanations the UI needs that the glossary lacks:

| Proposal | Used where | Why needed |
|---|---|---|
| Sum of Nettomiete + Zusatzmiete + Akonto per month (today "Total Bruttomiete") | rental contract wizard, contract detail | Landlords want to see what the tenant pays per month in total; the glossary has no term. Interim label: "Monatlich total". |
| Share of rented apartments (today "Belegungsrate") | dashboard | Not defined; interim wording "x von y Wohnungen vermietet". |
| UI label for the settings area ("Einstellungen" vs. "Konfiguration") | navigation, settings page | The glossary heading is "Konfiguration"; the page title is "Einstellungen". Interim: "Einstellungen". |

## CI / ui-screenshots

- The brief names `.github/workflows/cy.yml`; the job lives in `.github/workflows/ci.yml`. Not changed.
- Suggestion for the job: also capture a mobile viewport (390×844) and dark mode, and dialog/wizard states, which the current job cannot reach (it shoots routes only).

## Runtime dependencies outside the design system

- The building map (Leaflet) loads OpenStreetMap tiles and the address search calls openplz.api at runtime. These are functional features, not fonts/icons; kept unchanged.

## Accessibility check coverage

- The states "empty" (no records at all) and "first-use" (no buildings) cannot be produced in the shared E2E database, which parallel scenarios fill. They are covered by DOM tests of the empty/first-use branches plus the browser axe check of the same `EmptyState`/task components in other states. A dedicated empty database for the axe run would close this gap (needs a second backend in the Playwright stack).
- Dark mode is only switched on in stage 8 (all screens on tokens); the axe check adds the dark variants then.

## Privacy

- Wizard drafts (rental contract, statement run) are kept in the browser's `localStorage` until saved, discarded or logout. They contain names and amounts (personal data under the DSG) on the device the user works on. Acceptable for a single-user installation; worth a sentence in the privacy page – TODO(fachlich prüfen).

## Overview task rules

- Time windows for deadlines on the overview (Zahlungsfrist within 14 days, Vertragsende within 60 days) and the suggestion to create the statements for the last Abrechnungsperiode are UX choices without glossary or legal basis – TODO(fachlich prüfen).
- The task "Nebenkostenabrechnungen erstellen" appears when the last ended Abrechnungsperiode (from the setting) has no Nebenkostenabrechnung yet and at least one apartment is rented. It does not check whether a rental contract actually overlapped that period. TODO(fachlich prüfen): is a reminder right after the period's end too early (invoices arrive months later)?
- Overdue Nebenkostenabrechnungen: the overview counts a statement as overdue from the day after its Zahlungsfrist and suggests checking the payment first ("prüfen"), a Mahnung only as the second step. Whether a Mahnfrist or grace period is customary is TODO(fachlich prüfen).

## Bugs found outside the UI scope (not changed: backend)

- The apartment list's search box has no effect: the BFF passes `search`, but `backend/src/routes/apartments.ts` does not accept a `search` query parameter. Either implement the search in the backend or remove the box from the UI. The axe check uses the building filter for the apartment list's "filtered-empty" state.

## Persona wishes that need data-model changes (not done)

- Anrede (Herr/Frau) for tenants, for letters (Helga, stage 4). Needs a new tenant field – data models must not change in the redesign.

## Rental contract wizard (stage 5)

- Contracts saved before this redesign with the old form may have the Akonto in `additional_rent` and the parking fee in `monthly_advance_payment` (the old labels were swapped). The redesign does not migrate data; worth checking existing contracts once – TODO(fachlich prüfen).
- The Akonto notice ("Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung.") follows the glossary definition; whether a contract without Akonto needs further hints (e.g. on legal requirements) is TODO(fachlich prüfen).
- The native date field shows the browser's date format; the wizard repeats each date in words. A Swiss text date field (TT.MM.JJJJ) would need its own parsing and is not built.
- "Entwurf" is used for the wizard's browser draft ("Entwurf gespeichert", "Entwurf verwerfen") and is the glossary's name of the Abrechnung status `draft`. Plan D15 asks for the wording; both meanings meet in stage 6 – TODO(fachlich prüfen) whether a different word ("Zwischenstand") is clearer.
- The explanations of "Unbefristet" ("läuft, bis er gekündigt wird") and "Befristet" ("endet an einem festen Tag, ohne Kündigung") and the Akonto examples "(Heizung, Wasser usw.)" are not from the glossary – TODO(fachlich prüfen).
- If loading the contracts of an apartment fails, the wizard treats the apartment as free (as the old form did). The backend still refuses an overlapping contract on save, with a German message in the wizard.
- From the "Prüfen" step, "Ändern" leads back to a step; the user then goes through the later steps with "Weiter" again (steps after the current one are not clickable in the Stepper). A "Zurück zur Prüfung" shortcut would save clicks.

## Statement findings from the stage 5 personas (for stage 6/7 and outside UI scope)

- Statements can be generated for a period without any invoices (CHF 0.00 costs, full Akonto refund) without a warning (Anna, Marco: Blocker) – plausibility check in the stage 6 wizard (plan D16).
- Invoices covering only part of the period (e.g. only Q1) produce a full-year statement without a hint (Dr. Weber: Blocker) – stage 6 plausibility check if it can be derived from existing data; otherwise TODO(fachlich prüfen).
- "Verwaltungsgebühr (3 %)" shows the tenant's share of 3 % of the building total, which cannot be traced from the label (Dr. Weber) – stage 6/7 statement detail: name the base of the fee.
- The PDF has no tenant address, no reference to the right to inspect receipts and no refund method (Dr. Weber). The PDF is generated by the backend – outside the UI scope; TODO(fachlich prüfen).
- Category and heating profile names in English ("Heating", "Caretaker") come from the stored demo data; seed data must not be changed. Display translation or renaming in the settings – stage 7 decision.
- An invoice's date defaults to today, so last year's invoices land in the wrong year (Marco) – stage 7 invoice form hint.

## Statement wizard and sending (stage 6)

- "Versenden" only records the status "Versendet"; Dwello does not deliver statements by e-mail or post. The confirmation says so. Whether a real e-mail dispatch is wanted is a product decision (backend) – TODO(fachlich prüfen).
- "PDF ansehen" creates the PDF when it does not exist yet (the backend stores it); viewing therefore has a side effect. Acceptable because a statement cannot be delivered without its PDF.
- The plausibility check looks at invoices dated in the Abrechnungsperiode (as the calculation does). It flags buildings without any invoice; it does not judge whether a period is covered completely (one oil delivery per year is normal) – the preview names count and date range so the user can judge. TODO(fachlich prüfen) whether stronger checks are wanted.
