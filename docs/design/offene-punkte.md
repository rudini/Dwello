# Open points

Items the redesign could not or deliberately did not resolve. Each with reason and suggested owner.

## Glossary proposals (TODO(fachlich prüfen))

`UBIQUITOUS_LANGUAGE.md` is not edited by the redesign. Terms or explanations the UI needs that the glossary lacks:

| Proposal | Used where | Why needed |
|---|---|---|
| Sum of Nettomiete + Zusatzmiete + Akonto per month (today "Total Bruttomiete") | rental contract wizard, contract detail | Landlords want to see what the tenant pays per month in total; the glossary has no term. Interim label: "Monatlich total". |
| Share of rented apartments (today "Belegungsrate") | dashboard | Not defined; interim wording "x von y Wohnungen vermietet". |
| UI label for the settings area ("Einstellungen" vs. "Konfiguration") | navigation, settings page | The glossary heading is "Konfiguration"; the page title is "Einstellungen". Interim: "Einstellungen". |
| Date by which a refund is paid out | statement detail and edit ("Rückerstattung bis") | Zahlungsfrist covers what the tenant pays; for a refund the glossary has no word. |
| Explanations of Mietstatus Leer and Gesperrt | apartment list legend, apartment page, status field | The glossary names both states without explaining them; the UI explains them in plain words (`statusHelp`). |
| "Wiedervermietet" for a flat that was empty before | apartments, buildings, overview | Personas read "wieder" as "again"; "Vermietet ab …" was asked for. The UI shows "Wiedervermietet ab <Datum>" and explains it. |
| Equal split per Wohnung for an invoice without Verteilschlüssel | invoice form and detail, statement lines ("Gleichmässig pro Wohnung") | The glossary states the equal split only for the Verwaltungspauschale; the calculation applies it to every line without a key. |
| "Entwurf" for the browser-saved wizard input | both wizards ("Entwurf gespeichert") | Same word as the Abrechnung status "Entwurf"; "Zwischenstand" would separate them. |
| Explanations of Unbefristet/Befristet, Akonto examples, Mahnung steps, Heizprofil and Mietstage in plain words | contract wizard, help page | Explanations beyond the glossary definitions, written for first-time landlords. |
| What follows the 3rd Mahnung | Mahnung dialog | "Klären Sie das weitere Vorgehen direkt mit dem Mieter" – Betreibung etc. are outside Dwello. |
| Leistungszeitraum (period an invoice bills) | invoice form and detail, statement calculation | Glossary: "Das Rechnungsdatum bestimmt, in welche Periode eine Rechnung fällt". Since review B (MR-H1, IV-H1) a Leistungszeitraum, when given, decides instead (Art. 257b OR: costs of the period); without one the Rechnungsdatum still decides. |
| Tankbestand, Stichtag (heating oil in the tank on a reading day) | building page "Heizöl im Tank", statement calculation | Heating oil counts by consumption: stock at the start + purchases − stock at the end (review B, IV-K1, MR-H2). The glossary has no term. |
| Verwaltungspauschale as a percentage of the tenant's own Nebenkosten | statement wizard step 3, calculation, PDF | Glossary: percentage of the Nebenkosten der Liegenschaft, equal per Wohnung. Decided (product owner, session 12, source: Mieterinnen- und Mieterverband, «Merkblatt zulässige und unzulässige Nebenkosten» 2026: «fester Prozentsatz der Nebenkosten», which the tenant checks on the own statement): always the percentage of the tenant's own Nebenkosten; the choice of a key was removed with its column (no installation exists yet; the migrations were merged into 0001 and 0002). The glossary should say so in «Verwaltungspauschale», «Verteilschlüssel» (no key for the fee) and «Abrechnungslauf» (no fee key). |
| Vordefinierte Heizprofile without "Nur Warmwasser" | statement wizard step 3, heating profiles | The glossary lists "Nur Warmwasser"; removed in migration 0010 (no Swiss table for hot water only, separate Warmwasser is shared by days). |
| "Heizkosten nach dem Heizprofil verteilen" as a property of a Kategorie | category form, heating profile distribution | Which categories the Heizprofil distributes was read from the category name; now a checkbox at the category (review B, IV-H2); separate Warmwasser is shared by days (MR2-M5). |

Every place in the code is marked `TODO(fachlich prüfen)` (`grep -rn "TODO(fachlich prüfen)" src`, 23 places in the app code at the end of the redesign); the sections below give the context per stage.

## CI / ui-screenshots

- The brief names `.github/workflows/cy.yml`; the job lives in `.github/workflows/ci.yml`. Not changed.
- Suggestion for the job: also capture a mobile viewport (390×844) and dark mode, and dialog/wizard states, which the current job cannot reach (it shoots routes only).

## Runtime dependencies outside the design system

- The building map (Leaflet) loads OpenStreetMap tiles and the address search calls openplz.api at runtime. These are functional features, not fonts/icons; kept unchanged.

## Accessibility check coverage

- ~~The states "empty" and "first-use" cannot be produced in the shared E2E database~~ – they run on a second, empty instance of the E2E stack (backend 3103 on `dwello_e2e_empty`, the same frontend build on 3102); every listed state is now part of the axe check (108 examples).
- ~~Dark mode is only switched on in stage 8~~ – done in stage 8 (531a70c): dark mode follows the system; the axe check covers every state light and dark.

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
- Date fields are Swiss text fields TT.MM.JJJJ (`DateInput`, session 11 step C) with the date in words below; the calendar button opens the browser's own picker, whose screen-reader use was not checked (review C, CC-9).
- "Entwurf" is used for the wizard's browser draft ("Entwurf gespeichert", "Entwurf verwerfen") and is the glossary's name of the Abrechnung status `draft`. Plan D15 asks for the wording; both meanings meet in stage 6 – TODO(fachlich prüfen) whether a different word ("Zwischenstand") is clearer.
- The explanations of "Unbefristet" ("läuft, bis er gekündigt wird") and "Befristet" ("endet an einem festen Tag, ohne Kündigung") and the Akonto examples "(Heizung, Wasser usw.)" are not from the glossary – TODO(fachlich prüfen).
- If loading the contracts of an apartment fails, the wizard treats the apartment as free (as the old form did). The backend still refuses an overlapping contract on save, with a German message in the wizard.
- From the "Prüfen" step, "Ändern" leads back to a step; the user then goes through the later steps with "Weiter" again (steps after the current one are not clickable in the Stepper). A "Zurück zur Prüfung" shortcut would save clicks.

## Statement findings from the stage 5 personas (for stage 6/7 and outside UI scope)

- Statements can be generated for a period without any invoices (CHF 0.00 costs, full Akonto refund) without a warning (Anna, Marco: Blocker) – plausibility check in the stage 6 wizard (plan D16).
- ~~Invoices covering only part of the period produce a full-year statement without a hint~~ – the check per category (step B) names the missing quarter, half-year or month against the year before. Original note: (Dr. Weber: Blocker) – stage 6 plausibility check if it can be derived from existing data; otherwise TODO(fachlich prüfen).
- "Verwaltungsgebühr (3 %)" shows the tenant's share of 3 % of the building total, which cannot be traced from the label (Dr. Weber) – the PDF now names the base and the key ("3 % von CHF 18'835.20, gleichmässig pro Wohnung"); the statement detail in the UI does not yet.
- ~~The PDF has no tenant address~~ (step A). The reference to the right to inspect receipts and the refund method are part of the PDF redesign (step D2; requirements will be collected in step D1).
- ~~Category names in English in the PDF~~ – the PDF names categories in the tenant's language (`docs/seed-daten-aenderungen.md` P2); the UI already shows the German names.
- An invoice's date defaults to today, so last year's invoices land in the wrong year (Marco) – stage 7 invoice form hint.

## Statement wizard and sending (stage 6)

- "Versenden" only records the status "Versendet"; Dwello does not deliver statements by e-mail or post. The confirmation says so. Whether a real e-mail dispatch is wanted is a product decision (backend) – TODO(fachlich prüfen).
- "PDF ansehen" creates the PDF when it does not exist yet (the backend stores it); viewing therefore has a side effect. Acceptable because a statement cannot be delivered without its PDF.
- The plausibility check looks at invoices dated in the Abrechnungsperiode (as the calculation does). It flags buildings without any invoice; it does not judge whether a period is covered completely (one oil delivery per year is normal) – the preview names count and date range so the user can judge. Since step B the preview compares every category with the same dates one year earlier (missing category, gap in the rhythm, deviation over 25 % and CHF 100) and each statement's costs with its Akonto (over 30 %) – thresholds TODO(fachlich prüfen).
- Restoring a statement wizard draft drops buildings or heating profiles deleted meanwhile without a notice (the contract wizard says so). Rare; worth a sentence later.
- The "partly covered" hint uses a fixed 90-day rule – TODO(fachlich prüfen). Since step B it only appears when there is no year before to compare with.

## Stage 7 – help, legal, coming-soon pages

- Privacy page: the sentence about wizard drafts kept in the browser – legal wording TODO(fachlich prüfen).
- Help page wording beyond the glossary: Heizprofil ("teilt die Heizkosten nach Monaten statt nach Tagen auf"), Mietstage ("bezahlt nur den Anteil seiner Mietstage"), Abrechnungsperiode described as "das Jahr …", Mahnung ("höchstens eine 2. und eine 3. Mahnung") – TODO(fachlich prüfen).
- The Zahlungsfrist cannot be set in the settings; the help does not point there.
- No central help-text registry yet (plan section 7); the term explanations live in `src/routes/help/Glossary.svelte`.

## Stage 7 – buildings and apartments (package A)

- Explanations of Mietstatus Leer and Gesperrt (`statusHelp` in `src/lib/apartment.ts`) go beyond the glossary, which names them only – TODO(fachlich prüfen). The backend does not prevent a Mietvertrag on a gesperrte Wohnung.
- The building map never appears: no route stores coordinates (form, address search, demo data). `BuildingMiniMap` shows on the building page once coordinates exist.
- The search box on the apartment list has no effect (the backend ignores `search`) – existing gap, kept.
- Scenario names "Wohnung hinzufügen" / "Erste Wohnung erstellen" are unchanged although the buttons read "Wohnung erfassen".

## Stage 7 – tenants and contracts (package B)

- "Monatlich total" (Nettomiete + Zusatzmiete + Akonto) has no glossary term; used in the contract list and detail, the tenant rental panel and the apartment page – TODO(fachlich prüfen).
- Notice in the contract edit form "Bei Mietanpassungen sollten Sie die gesetzlichen Kündigungsfristen beachten" is existing copy with a legal claim – TODO(fachlich prüfen).
- The E2E step "sieht den monatlichen Mietzins" reads the monthly total, while the glossary defines Mietzins as Nettomiete. Equal in the scenarios (no Akonto); wording of the step is wrong.
- A contract that has not started and has no end date offers "Beenden", which would set an end before its start; it also cannot be deleted (deleting needs an end date). Pre-existing behaviour.
- "Mietvertrag beenden" sets the Vertragsende to today; by the backend's rule a contract still runs on its last day, so the status stays "Laufend" until tomorrow. The scenario now checks the end date instead of the status. Whether "beenden" should mean "today was the last day" is a product question – TODO(fachlich prüfen).
- When the backend refuses to delete a contract, the BFF shows only the generic "Mietvertrag konnte nicht gelöscht werden."
- Default Korrespondenzkanal for a new tenant is now Brief (glossary and plan D15a); before, the form preselected E-Mail.

## Stage 7 – invoices, statements, documents (package C)

- "Rückerstattung bis" (date by which a refund is paid) has no glossary term – TODO(fachlich prüfen).
- After the 3rd Mahnung the dialog says "Klären Sie das weitere Vorgehen direkt mit dem Mieter"; what follows (e.g. Betreibung) is outside Dwello – TODO(fachlich prüfen).
- Line items without a Verteilschlüssel show "Gleichmässig pro Wohnung" (the calculation's fallback); the glossary states this only for the Verwaltungspauschale – TODO(fachlich prüfen).
- ~~The statement does not store the Verteilschlüssel of the Verwaltungspauschale~~ – stored since migration 0004 (`management_fee_distribution_key_id`), with the Heizprofil (`heating_profile_id`); statements created before have neither. The fee's key was removed again in session 12 (the fee is always a percentage of the tenant's own costs).
- The contract detail links to `/statements?contract=`, but the statement list ignores that filter (pre-existing).
- ~~`src/lib/i18n/locales/de.json` still contains "Verwaltungsgebühr"~~ – removed with the unused svelte-i18n setup in stage 8 (531a70c).
- The Rechnungsdatum still defaults to today (the E2E step does not fill the date); help text and the date in words reduce the risk of booking into the wrong year.
- The statement cost table still scrolls sideways on phones (shared `Table`).

## Stage 7 – settings (package D)

- ~~The predefined key "Heizung (Fläche 70% / Einheit 30%)" does not split 70/30~~ – formula `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` with the new building sums (migration 0003, `docs/seed-daten-aenderungen.md` S1). Glossary proposal: the glossary still names the old formula.
- ~~Descriptions of predefined heating profiles, distribution keys and categories are English~~ – German since migrations 0003 and 0005. The UI still hides descriptions of predefined records; showing them is a small UI follow-up.
- Help texts of the settings live in `src/routes/config/help.ts`; no central help-text registry exists yet.
- IBAN help ("Konto, auf das Ihre Mieter Nachzahlungen überweisen; es steht auf der QR-Rechnung"), the Reihenfolge help and the "Übersetzungen" section have no glossary basis – TODO(fachlich prüfen).
- The a11y states `categories delete-dialog` and `distribution-keys delete-dialog` open the first delete button; if that record already has invoices the button is disabled (pre-existing, works with the seed data).

## Stage 7 – review and persona round (fixes F1–F3)

- An invoice without Verteilschlüssel is split equally per apartment (calculation fallback); the invoice form now says so – TODO(fachlich prüfen), the glossary states it only for the Verwaltungspauschale.
- Categories have no "predefined" flag; the BFF derives it from `name !== nameDE` (seeded categories keep an English key) to hide English seed descriptions. A renamed own category also counts as predefined and loses its description in the list. A real flag (backend) would be cleaner.
- Invoice and statement rows stack below 1280 px; side-by-side columns at 1024 px (with sidebar) would need a design decision.
- Mark-paid dialog: the payment date is always today; no "Zahlung zurücksetzen"; payment not listed under "Verlauf" (Marco) – backend/product decisions.
- "Mahnung senden" is offered before the Zahlungsfrist has passed (Anna) – product decision.
- Statement detail does not name the Heizprofil used, statement lines do not link their invoices (Dr. Weber) – the Heizprofil is now stored and named in the PDF; the UI detail and invoice links are still open.
- ~~Heizprofile values look implausible and name no source (Dr. Weber)~~ – Swiss table «Anteilmässige Belastung» / «Mieterwechsel: So werden die Heizkosten verteilt» (migration 0003, `docs/seed-daten-aenderungen.md` S2–S6). Open: July 1.0 % of the Bergregion column looks like a misprint – to be confirmed.
- A heating-oil delivery is booked as the heating cost of the year without opening/closing stock (Dr. Weber) – calculation/backend, TODO(fachlich prüfen).
- Name conflicts of heating profiles and distribution keys are shown as a form error, not at the Name field (categories now are).
- Toast timing for screen readers (500 ms after navigation) needs a manual check with NVDA/VoiceOver; the mobile drawer uses `aria-modal` without `inert`.
- The PDF file name is a UUID, not the statement number (Dr. Weber) – backend.
- No invoice filter by period or year (Anna).
- "Entwurf" names both a statement draft and the browser-saved wizard input ("Entwurf gespeichert") – known glossary gap (see stage 5).

## Stage 7 – review round 2 and persona re-runs

- One future tenancy carries three glossary terms: Vertragsstatus "Künftig", Mietstatus "Wiedervermietet (ab …)", Mieter "Aktiv". Helga and Sven read "Wiedervermietet" as "rented again" for a flat that was empty, and "Aktiv" for someone not yet moved in. All three are glossary terms; renaming needs a glossary decision – TODO(fachlich prüfen).
- The overview bar says "1 ab 1.11.2026" while building cards say "1 wiedervermietet" – wording check together with the point above.
- An own category that is renamed, or whose English name equals its German one, counts as predefined; its description is hidden in the list. A predefined flag in the backend would be exact.
- Errors of `Checkbox` and `RadioGroup` stay until the next submit (fields built on `Field` hide them once changed).
- "Filter zurücksetzen" links on contracts and tenants do not move focus to the results (they are links, not a search).
- No error summary at the top of forms; detail-page actions ("Bearbeiten", "Löschen", "Beenden") do not name the record in their accessible name.
- The invoice form opened from the statement wizard still defaults to today's date (the period notice warns at once).

## Stage 8 – remnant search and review

- Step names in the wizards hyphenate with `hyphens-auto`; Chromium without a German hyphenation dictionary (the headless test browser) breaks long words without a hyphen at `xl` ("Vertragsda/uer"). Real browsers load the dictionary; dropping `break-words` would let "Verwaltungspauschale" widen the page instead.
- `src/app.html` links `favicon.png`, but the project has no `static/` folder (pre-existing broken link). An icon in the new design is a small follow-up.
- The invoice edit form shows the backend's reason after a failed save ("Fehler beim Speichern: …"); backend messages can be English. Other screens show a fixed German sentence.
- Historical material of the old design stays in the repository but is not part of the app: `screens/*/code.html` (original HTML mockups with Material Symbols and Google Fonts) and `CLAUDE.md.backup`. They can be deleted when nobody needs them for reference.
- `docs/PRD-Dwello.md` still describes svelte-i18n as the planned translation library (product vision, not changed).
- `tests/exploratory-test.ts` (manual script, not in CI) uses a CSS class selector for the heating profile sum.


## Stage 9 – final review and final persona round

- Native date fields show the order of the browser's system locale ("mm/dd/yyyy" in the English headless test browser, "dd.mm.yyyy" on Swiss systems). Every date is repeated in words below its field ("Sonntag, 1. November 2026"); a custom date field would replace a well-supported native control and is not planned.
- ~~The statement wizard counts the invoices per building only with the preview~~ – step 2 now names the utility invoices of each building in the Abrechnungsperiode (089ecfe).
- ~~The overview task "Nebenkostenabrechnungen erstellen" offers no way to the invoices~~ – a text link "Rechnungen 2025 ansehen" beside its one action (089ecfe).
- ~~The invoice list has no filter by year~~ – filter "Jahr" (year of the Rechnungsdatum, 089ecfe). A filter by an Abrechnungsperiode across the turn of the year is not offered; such periods link to all invoices.
- ~~The invoice form opened from the statement wizard defaults to today~~ – it starts without a date there, so the date is chosen on purpose (089ecfe).
- ~~The axe list has no states for the server error page, a visible toast, a statement without positions and `submit-empty` on edit forms~~ – added (0c237df): `error-server`, `saved-toast`, `statement-empty-detail`, `submit-cleared` on every edit form; 100 examples, 0 violations.
- Small layout points from the final review: ~~statement list columns shift when a row has a "PDF" link~~ and ~~"66.7%" without a space~~ fixed (0c237df); open: the Verlauf labels do not align, a success toast can cover list content on phones. The tenant row's "Wohnung … - Gebäude" matches the contract wizard's apartment choice and stays.
- ~~The help glossary does not explain Umlagefähig, Nachzahlung/Rückerstattung, Wiedervermietet and Gesperrt~~ – added from the glossary definitions (0c237df). "Mietstage" is the glossary term (several personas read "Mietstagen" as a typo).
- The tenant form does not say whether the address is the current one or the address of the rented flat (Helga) – TODO(fachlich prüfen), Korrespondenzadresse.

## Final round b (re-runs of Anna and Marco)

- ~~Which invoices of a period are missing is not checked~~ – step B (`backend/src/services/invoice-completeness.service.ts`). Before: the wizard counts invoices per building and flags none or a partly covered period. A comparison by category would be new calculation logic – TODO(fachlich prüfen), backend.
- After draft statements exist, the overview's "prüfen und versenden" task does not repeat that a draft rests on few invoices; the warning is in the wizard and the statement detail shows its positions.
- The warning "Rechnungen nur für einen Teil der Periode" has no "Rechnung erfassen" link of its own; one confirmation covers all warnings of a preview.
- "Entwürfe ansehen" after creating lists all drafts, not only those of the run; new drafts have no PDF until "PDF ansehen" creates it.
- The "Manuell" badge on invoices is not explained in the help; "Entwurf" names both the wizard's saved input and the statement status (glossary table).


## Session 11 – step B (missing invoices, domain model)

- Tankbestand: readings count only on the exact days (the day before the period, its last day); a missing one is reported in the wizard with a confirmation, the statement then bills the purchases. A building with heating costs but no reading at all gets the question "Heizen Sie mit Öl, Flüssiggas, Pellets oder Holz?" (no confirmation), in every run also for district heating (review B, DP4-I3, IV4-5): a property "no tank" at the building would silence it – TODO(fachlich prüfen). A building whose last reading lies before the period counts as tank retired and gets no hint (IV4-6): a reading forgotten for a whole year goes unnoticed. A building with tank consumption but no invoice in the period is still listed as "Keine Rechnungen erfasst" (IV4-2, rare). Readings are a value in CHF; the help text asks for litres × price of the last delivery; litres and other valuation methods (average price, FIFO) are not recorded – TODO(fachlich prüfen), Art. 8 Abs. 2 VMWG (information on opening and closing stock) to be read on Fedlex.
- Warmwasser billed on its own is shared by days at a tenant change (migration 0009); heating and hot water from one system stay in Heizung with the profile "Heizung + Warmwasser" – TODO(fachlich prüfen) (review B, MR2-M5).
- The heating profile applies to all heating costs of a group, also to an invoice with a Leistungszeitraum of one quarter (review B, CR2-N2) – TODO(fachlich prüfen). Interim meter readings at a tenant change and a consumption-based heating cost statement (VHKA, meters in the flats) are not supported; the help text says to bill such flats or buildings outside Dwello (review B, MR4-1) – TODO(fachlich prüfen), cantonal energy law.
- Verwaltungspauschale: one rate per generation run; a contract with another rate: delete its draft and create it again with that rate (help text). The guideline of 3 % follows the glossary; sources name 3 to 5 %, the MV leaflet 2026 at most 3 % – TODO(fachlich prüfen).
- Whether billing by Rechnungsdatum (without a Leistungszeitraum) is admissible when done consistently is not settled – TODO(fachlich prüfen); the help text asks for the Leistungszeitraum on invoices for a period.
- Tankbestand readings in the future are accepted (review B, IV3-6): the hint on a missing or negative stock catches typos when the period is billed; readings on other days than a period end are kept but not used.
- A negative consumption is computed over the whole category of the tank, including other heating invoices such as burner service (IV3-9); such invoices can hide a typo – TODO(fachlich prüfen).
- The predefined heating profile "Nur Warmwasser" is removed (migration 0010, decision of the product owner after research: no Swiss table exists for hot water only; separate Warmwasser is shared by days since 0009, and as the profile of a run it spread heating costs evenly). Glossary proposal: "Vordefinierte Heizprofile" still lists "Nur Warmwasser"; explain when "Heizung + Warmwasser" fits (one system for both). A separate hot water tank cannot hold a Tankbestand (only heating cost categories).
- Migration 0009 assigns existing readings to the category named 'Heating' (CR3-11); migration 0010 sets the heating profile of statements that used «Nur Warmwasser» to NULL, so a PDF made again lacks the profile line (CR4-9, MR4-5). Both harmless before the first installation.
- The warnings "Rechnung schon abgerechnet" / "Nicht in den Abrechnungen" compare the invoice's recording time with the statements' creation time and use the invoice's current values (review B, CR4-7); a reliable link would be the invoice ids of each statement position. The chimney sweep is excluded from the tank categories by its internal name 'Chimney Sweep' (CR4-2); the name can be edited and own heating categories stay selectable (CR5-4, IV5-7): a property "fuel" at the category would be reliable. A fixed-term contract has no termination date before its end: the Akonto hint and the hint on new costs do not say so (MR4-4, MR5-2) – TODO(fachlich prüfen). Whether costs can still be claimed after a statement was sent is not settled (MR5-3) – TODO(fachlich prüfen). The note in the PDF that the tenant may ask for a detailed heating cost statement and see the receipts (Art. 8 Abs. 1 VMWG, MR4-6) is part of step D2.
- Check for missing invoices: a supplier changing from monthly to quarterly invoices is reported as gaps (IV2-10); a deviation caused by a Leistungszeitraum spanning two periods is not explained (IV2-9). Both are hints with a confirmation, refinement is a follow-up.
- Akonto as "paid" instead of "agreed" (IV-H3): the glossary defines Geleistete Akontobeiträge as the sum of the monthly amounts; recording payments and a history of Akonto changes are new features – open product decision.
- Agreed categories per contract (IV-H4): a new category in a period is flagged with the question whether it is agreed in the lease; a full model of agreed Nebenkosten per contract is not built.
- Generating statements again creates drafts only for contracts without a statement in the period (review B, IV5-2): to recalculate a draft, delete it and run the wizard again. A statement's hint on invoices recorded after it was created counts new invoices only, not changed ones (IV5-1; the edit page warns about those).
- A Tankbestand whose category is no longer allocable keeps its category preselected although it is not in the choice (CR5-2, rare). A category that is not allocable with one oil invoice marked allocable bills the purchase, not the consumption (MR5, Art. 5 Abs. 2 lit. a VMWG) – TODO(fachlich prüfen). Glossary proposal: "Vorrat" (Art. 8 Abs. 2 VMWG) for wood and pellets instead of "Tankbestand" (MR5-I3).
- Preview of a running period still asks to confirm the missing closing stock on the last day (IV5-4); the warning above it says to create the statements after the period. In a period with 0 % in the heating profile the PDF still says "nach Heizprofil" although the costs were shared by days (CR5-6, rare).
- Berichtigung versendeter Abrechnungen (review B, CR6-2, MR6-1, IV6-2): a sent statement cannot be deleted or set back to draft, and the wizard skips its contract; the texts say to correct it outside Dwello. A supplementary statement (Nachtragsabrechnung) or the tenant's share of a late invoice per contract would be the product answer – TODO(fachlich prüfen). Statement numbers of deleted drafts are given again (IV6-6); a sequence would never reuse one.
- An invoice for the previous period recorded without a Leistungszeitraum falls into the next period without a hint (MR6-2); a hint for invoice dates shortly after a period end would catch it. Creating drafts again may use other settings than the first run (MR6-6); a contract billed outside Dwello gets a new draft in every run (IV6-10); the preview counts existing statements but not outdated drafts (IV6-5). In a period under a year an invoice without a Leistungszeitraum counts in full (DP6-1); a preview without Tankbestand readings bills the purchases and only the check per category says so (DP6-2).

## Session 11 – step D2 (statement PDF)

- The PDF follows `docs/nebenkostenabrechnung-anforderungen.md`; no legal text was read on Fedlex (all sources «unsicher»). Before the first installation: read Art. 257a/257b, 269d, 270b OR and Art. 4–8 VMWG on Fedlex – TODO(fachlich prüfen).
- Glossary proposals: "Zeitanteil" (share of the period: days rented or heating profile), "Anfangsbestand"/"Endbestand"/"Heizmaterial" (Art. 8 Abs. 2 VMWG: Vorrat), "Empfangsschein"/"Zahlteil" (SIX) – TODO(fachlich prüfen).
- The PDF has no Romansh translation: for a Romansh tenant the whole PDF is German, the tenant form says so (half-translated sentences read badly, review D2 round 2, DMR2-01). A translation needs a native speaker; the payment part stays German, as SIX provides no Romansh (D1R-01, DMR-02, DMR-04) – TODO(fachlich prüfen).
- The tank block uses the readings stored with the statement (migration 0011, `fuel_stock`); the invoices are the category's positions less the change. Readings are values in CHF without litres, delivery dates or the valuation method (review D, DIV-02, DMR-07) – TODO(fachlich prüfen), data model.
- Not in the PDF (review D): the source of the heating profile's monthly shares (DMR-10); phone and e-mail of the landlord (no configuration for them, DMR-09); a letter frame with place, salutation and greeting (DIV-14); the Akonto as months × amount (DIV-09); a separate house number and the debtor's country in the QR code (DMR-12); fonts are the PDF standard fonts, characters outside Windows-1252 are printed as their nearest letters (CD-8; embedding Liberation Sans would print them all).
- ~~The management fee without a key is a percentage of the subtotal, the glossary describes a percentage of the building's costs (review D, DIV-10)~~ – decided in session 12: always a percentage of the tenant's own costs (subtotal); see the glossary proposals above.
- A draft's PDF shows the statement as if sent today; marking it as sent dates it to that day (Swiss time) with the full payment deadline, never a shorter one, and discards an older PDF (review D2 round 2, DIV2-01, CD2-2). A deadline set shorter than the configured days is therefore extended when sending; a later one stays. The send dialog asks to deliver the PDF on the day it is marked. A statement already sent keeps its date and deadline; a paid statement printed again has no payment part.
- Statements created before migration 0011 print "–" for Wohnungsanteil and Zeitanteil, and the key's fraction from the building's apartments as they are now (later statements keep the values they were created with, `key_values`, CD2-3).
- Review D2 round 2, left low: a month split by a tenant change shows its share without the days it was counted for (DIV2-06); the request for the IBAN on a refund names only the postal address (DMR2-02, with DMR-09); the QR code ends with the empty optional «Rechnungsinformationen» after `EPD` as its 32nd element, no further line break (DDP2-4, as the existing test of the element count); Italian category names such as «Portiere» are master data (DIV2-08); «Wohnung EG, EG» in the demo data repeats number and floor (DIV2-08).
- Not in the PDF yet (D1 proposals): several tenants of one contract as recipients, Akonto per month when it changed in the period (only the total is printed), a list of receipts, the previous year per category.
- QR-bill v2.4 (from 14.11.2026): no change needed for CHF bills according to the research (D1R-07); to check with the SIX guidelines – TODO(fachlich prüfen).


## Session 11 – review round 8 and persona run (R3-review)

- Reminders are German for every tenant (R8-04); the reminder letter names the QR reference with a QR-IBAN but has no payment part.
- After saving an invoice for a period already billed, the list shows no hint; the hint is on the invoice and the statement (R8-07). The wizard and the invoice say «Tankbestand», the building page «Brennstoff im Tank oder Lager» (R8-08) – TODO(fachlich prüfen). The empty preview keeps «Weiter» and the totals (R8-09). English key names without unit, US and UK spelling mixed (R8-11). Creditor house number in the street field of the QR code (R8-13, allowed).
- Demo data: `paid_amount` empty; no invoice with a service period across the year end (R8-12, DP8-F2, DP8-F3).
- Statements: no date «Versendet am» to choose, the app dates the statement on the day it is marked (by design). Marking a statement as paid keeps the stored PDF as sent; only a change of date or payment deadline discards it.
- Persona run session 11, left medium: existing statements are not shown in step 2 of the wizard (Anna); the restored-draft notice stays after creating statements, the heating profile help is long, the fee is preset to the setting's 3 %, an invoice recorded from a wizard warning has no category preset (Marco); tenancy period, key fraction and heating profile only in the PDF, the app's «Anteil» rounds differently, the chimney sweep is shared by the heating profile (Dr. Weber); no error summary, «Abbrechen» before «Weiter» in step 1, the Akonto notice is not linked to its field (Sven).
- Round 4 (R3-review): a payment date long before the statement is accepted (no lower bound) and the backend answers an invalid calendar date with its raw error (R4-N4); downloading a draft's PDF on a later day dates the draft anew (by design: the PDF is what goes out), an old PDF without a configured IBAN is delivered as it is (R4-N6); the design guard has no examples for blur (R4-N7); the overview shows payment deadlines 30 days ahead, also when the setting gives more days (R4-N10).
- Sven, rerun: the focus in the paid dialog starts on «Abbrechen», before the date field; the dialog's description is its whole content; the wizard's error stands after the long help text; «-5» as an amount gets the general amount text.
- Round 5: «überfällig» in the backend (statements, contracts, tenants) is computed in server time (UTC), up to two hours behind the Swiss day (R5-4); a 2nd reminder can follow the 1st at once, the reminder's own deadline is not stored (R5-8) – TODO(fachlich prüfen).
- Sven, second rerun: in the paid dialog the confirm button comes before the date field in the tab order, the dialog's description is its whole content, only «Dieses Datum gibt es nicht» is announced on its own (the other date errors through the field's description); once the list's button did not react after several Enter presses (not reproduced).
- Round 7: on a desktop, the date error shown when the field is left makes the centred dialog taller; the confirm button moves down and the first click misses it (R7-F2, probably Sven-N12). Anchoring dialogs at the top or reserving the error line would avoid it.

## Session 12 – Verwaltungspauschale of the tenant's own costs (review F)

- A contract that agrees another basis for the fee (e.g. 3 % of the heating costs only) or a separately agreed fee for the heating administration (Art. 5 Abs. 2 lit. i VMWG) cannot be entered; the wizard asks to delete such a contract's draft and create it again with another rate, which only fits a different rate, not a different basis (review F, V-2, M-2). Rate and basis per Mietvertrag would be the product answer – TODO(fachlich prüfen). The Mietvertrag also has no field saying whether a fee is agreed (persona Marco F).
- The fee rate has no upper limit at the API; a rate of 1000 % or more fails with a database error (review F, F-11, existed before). Wizard and settings take at most two decimals («2,555» is refused, review F, R3-6).
- `prorateCosts` is now only used by its own tests (review F, F-9); left as it is, fallow does not flag it.
- Left low (review F round 3, persona Sven F2): a rate typed with a comma shows with a point after going back from the preview (R3-7; Swiss amounts use the point too); a rate above 3 % that is already set when step 3 opens is shown but not announced (R3-8; announced as soon as it is typed); the wizard says «eigene Nebenkosten», the statement and PDF «Zwischensumme» for the same base (R3-10; the PDF names the amount, so it can be checked); no confirmation for a rate above 3 % (the hint stays visible); the error is read after the help text, «Entwurf gespeichert» also for an invalid rate and the long heating profile help (Sven, existed before).

## Session 12 – Saldo to 5 Rappen (review G)

- Glossary proposal: «Saldo» should say «auf 5 Rappen gerundet» (help text and PDF do) – TODO(fachlich prüfen). Rounding to 5 Rappen is common for the final amount but not required (SIX allows any amount with two decimals); whether rounding up to 2 Rappen against the tenant fits Art. 257a OR (actual costs) is not settled – TODO(fachlich prüfen), unsicher.
- Left low (review G): the Akonto hint in the wizard names the exact difference next to the rounded Saldo (G-10; it compares costs with Akonto, not the Saldo); `paid_amount` is never written, so the dashboard's «paid this month» is always 0 (G-11, existed before, not displayed).
- A Saldo of 0 is settled once sent (status «Bezahlt» on the day it is marked as sent), so it never becomes «Überfällig» (final review, V-1).
- Left low (final round H, persona Dr. Weber F2): a Nachzahlung or Rückerstattung of CHF 0.05 still gets a payment part or the request for an IBAN; a minimum amount is a product decision (V-2). The detail page says «Gesamtkosten» where the PDF says «Ihre Nebenkosten» (V-5, existed before). `prorateCosts` is only used by its tests; the deepcheck work of session 12 kept it as one of the three exports of `prorating.service.ts` (H-3). The commit subject of bebb4cd is 52 characters (H-4; history is not rewritten, fixable at squash-merge). The preview fee test takes the default rate; the typed rate is covered by the scenario «Die Vorschau nennt die Verwaltungspauschale» (H-8). The wizard's heating profile preset, the «Anteil» column rounding and «Entwurf gespeichert» existed before (Dr. Weber F2).


## Session 13 – UI in four languages

- Terms marked ❓ in `docs/design/i18n-begriffe.md` are not settled: «umlagefähig» (imputable / addebitabile / allocable), «Abrechnungslauf», «Konfidenz», «Wiedervermietet» in English – TODO(fachlich prüfen). No native speaker has read the French, Italian or English texts yet.
- The privacy page says fonts and symbols come from Google Fonts; the app bundles them (design rule: no external fonts). The German wording was kept unchanged; the statement should be corrected – TODO(fachlich prüfen).
- The scenario «Bevorstehendes Vertragsende» (dashboard.feature) fails when run shortly after midnight Swiss time: the step counts 30 days in UTC, the app in Swiss time (seen on `main` before this work).
- The privacy page names only the session and XSRF cookies; the language choice adds `PARAGLIDE_LOCALE` (readable by JavaScript, no personal data) and `dwello_login` existed before. German wording kept; the statement should be completed – TODO(fachlich prüfen) (review i18n-1, R1-7).
- «Zahlungserinnerung oder Mahnung» reads redundantly in fr/it/en («rappel de paiement ou un rappel»), because the term table gives «Mahnung» = rappel/sollecito/reminder; a distinct word for the 2nd/3rd level (fr «sommation», it «diffida»?) would read better – TODO(fachlich prüfen) (R1-8).
- Header at 390 px fits with about 7 px to spare (menu, logo, language, user menu); at 360 px it would overflow. On the login page the language row above the centred card makes the page scroll by about 64 px (R1-3, R1-4).
- The Paraglide options (project, outdir, strategy) are repeated in `vite.config.ts`, `vitest.config.ts` and the `i18n` script (R1-9).
- Backend error codes (step B): terms chosen without a native check – «Monatsanteile» (parts mensuelles / quote mensili / monthly shares), the formula sample apartments («Petit appartement (50 m², 2 pièces)»…), «als Standard hinterlegt» (défini par défaut / impostato come predefinito), «gemahnt werden» (faire l’objet d’un rappel / essere sollecitati / be reminded) – TODO(fachlich prüfen). `FORMULA_NOT_COMPUTABLE` shows the JavaScript engine's English detail and `HEATING_PROFILE_SHARE_NEGATIVE` the English month key, as the backend sends them.
- The statement PDF downloads (`/pdf`, `/pdf/base64`) answer «Statement not found» without a code, because the PDF service stays unchanged; a user only meets it with a deleted statement in an old tab (review i18n-B, B-3).
- Step 3 terms chosen without a native check – TODO(fachlich prüfen): «Monatlich total» (Total mensuel / Totale mensile / Monthly total, German already marked), «Per Brief / Per E-Mail» (Par lettre / Per lettera / By letter), «Einzug am» (Emménagement le / Trasloco il / Moving in on), «Keine laufende Miete» (Aucune location en cours / Nessuna locazione in corso / No current rental), «Ehemalige Mieter» (Anciens locataires / Ex inquilini / Former tenants), Rätoromanisch (Romanche / Romancio / Romansh). French and Italian tenant toasts add «Locataire»/«Inquilino» for gender agreement; «Mietvertrag {apartment}» gives a capital mid-phrase in fr/it.
- Document titles are stored by the backend; reminder titles are shown in the UI language from type and level (step 5; the feedback right after sending a reminder follows in step 6); other document titles are shown as stored.
- Step 4 terms chosen without a native check – TODO(fachlich prüfen): «Dazu gehört» (Éléments liés / Elementi collegati / Related), «Mietverhältnis» (bail / locazione / tenancy), «Kündigung, Kündigungsfristen» (résiliation, délais de résiliation légaux / disdetta, termini di disdetta legali / termination, statutory notice periods), «Prüfen» as a step (Vérification / Verifica / Review), «verrechnet» for the Akonto (imputée dans le décompte des charges / compensato con il conteggio spese accessorie / offset in the utility cost statement). The contract forms still recognise the overlap refusal by its English text (`/overlap/i`), because an existing DOM test fakes the refusal without a code; the shown text is the frontend's own, translated.
- Step 5 terms chosen without a native check – TODO(fachlich prüfen): «Leistungszeitraum» (période de prestation / periodo di prestazione / service period; not in the glossary), «Umlagefähigkeit» (imputabilité / addebitabilità / allocability), «schon abgerechnet» (déjà décomptée / già conteggiata / already billed), «Übernehmen» for the AI suggestion (Accepter / Accettare / Accept), «Erfasst» (Saisie / Registrata / Recorded), OR in fr/it/en as «CO». The AI's free-text reasoning on the invoice is shown as the model wrote it (language of the prompt). The invoice edit page now shows an empty category list instead of an error page when the category call fails, as the new-invoice page already did.
- Step 6 terms chosen without a native check – TODO(fachlich prüfen): «Nachzahlung» in running text reads awkwardly with the term table («Le locataire paie le montant à payer de {amount}», «L’inquilino paga l’importo dovuto di {amount}»); «Rückerstattung bis» (remboursement jusqu’au / rimborso entro il / refund by); quarters and half-years in the year-on-year check (fr «le trimestre 1», it «il 1° trimestre», en «quarter 1»); «Lauf» for the Abrechnungslauf (cet établissement / questo allestimento / this run); «Gemahnt am» (Rappel envoyé le / Sollecitato il / Reminded on); «Kostenaufstellung» (Aperçu des coûts / Riepilogo costi / Cost overview, as the PDF).
- Statement texts that still come raw from the backend: SMTP transport errors stored as `deliveryError` (no code), PDF generation errors such as «Invalid IBAN: …» in the toast «PDF konnte nicht erstellt werden: {reason}», and the generic fallbacks «Calculation failed» / «Statement generation failed» in the wizard's server-error alert; the BFF's own «PDF not available» answers a failed download link.
- The statement PDF's download file name stays «abrechnung-{id}.pdf» in every UI language; year-on-year findings are ordered by their German category name (backend) (review i18n-6).
- Step 7 terms chosen without a native check – TODO(fachlich prüfen): «Baustein» of a formula (élément / elemento / building block), «Vordefiniert» (prédéfinie/prédéfini by gender / predefinita/predefinito / predefined), «Monatsanteile» (parts mensuelles / quote mensili / monthly shares), «Stammdaten» (données de base / dati di base / master data), «Berichte/Auswertungen» (Rapports/Analyses, Rapporti/Analisi, Reports/Analytics), example company «Muster Immobilien AG» (Immobilier Modèle SA / Immobili Modello SA / Sample Properties Ltd), gallery-only terms (compteur, ordures, envoi). The category form labels the German name «Nom (allemand)» etc.; its example stays German («Treppenhausreinigung») because the field holds the German name.
- Backend texts: the German refusal for a negative monthly share embeds the English month key («Der Anteil für january …», pre-existing); the UI renders it from code and params in the UI language, so users see the month name. Elysia schema refusals (422, e.g. a name over 100 characters) carry no code or text; the UI shows the translated generic «… konnte nicht gespeichert werden».
- German copy issues found by the German native read (all existed before this work; German wording kept unchanged as required): singular texts with plural pronouns (`dashboard_task_letters_text_one`, `dashboard_task_drafts_text_one`), «Tankbestand am … und am … fehlen», «für die Kleine Wohnung», «den Januar und den Februar und den März», straight quotes in name-taken messages, «Fribourg» among German canton names, «2,5» with comma, mixed final periods in field errors, «bis» twice in `help_tenants_3`, «Lieferant» vs «Rechnungssteller» – see `docs/design/reviews/i18n-native-de.md` – TODO(fachlich prüfen).
- Native reads (subagents, not human speakers) left points: fr – gender of «Le locataire {name} …» toasts, «3.5 pièces» (Swiss point kept by decision), plural for 0 in apartment counts, «le trimestre {number}», «viré/versé», «Zurich» example; it – «danno insieme 100 %», progress labels without «in corso», «Zurigo» example; en – «allocable» vs «chargeable to tenants» (term table, see ❓), «e.g.»/«for example» mix, «the management», space before «…»/«%». Term table ❓: readers suggest fr «série de décomptes» or no noun for Abrechnungslauf, fr «répercutable/à la charge du locataire» and it «a carico dell’inquilino» for umlagefähig, it «grado di certezza» for Konfidenz – TODO(fachlich prüfen). Details: `docs/design/reviews/i18n-native-fr-it-en.md`.
- Save toast on the category edit form names the German name field («Catégorie «Hauswart» enregistrée») while lists show the local name (review i18n-7, 7-4).
- Persona Anna (i18n, French, 390 px): the mobile menu needs scrolling to reach «Hilfe/Aide» (852 px content in 780 px, the same in German and French, existed before); the glossary has no entry point of its own (section at the end of the help page); counters read «7 Brouillon» (status label after a number, also «7 Entwurf» in German); statement numbers start with «NK-» (data); the language is stored per browser (cookie, as decided), not per account. Fixed: the screen-reader step label of the statement wizard now uses the per-language colon spacing.
- Persona Helga (i18n, German, zoom 1.5): no blocker or major. The tenant form's «Sprache» (language of the tenant's statement) can now be confused with the screen language in the header; a label like «Sprache der Abrechnung» would help, but changes the German wording – decision needed. She first looked for the screen language under «Einstellungen». Other minors (step label under the sticky header, toast over the filter, address meaning) existed before.
- Persona Marco (i18n, Italian, 390 px): no blocker; his major (the long heating-profile help before the dropdown hides the warning about meters) existed before (persona runs of session 11). Caused by the translation: the closed heating-profile dropdown cuts «Riscaldamento + acqua calda (100%)» at 390 px (the Italian master-data name is longer than the German one; the open list shows it whole) – a shorter `name_it` or dropping the share suffix on phones would need a decision. Existed before: «Bozza salvata, 10:07» uses the browser's time zone while the statement shows Swiss time; «Bozza/Entwurf» for both the wizard's saved input and draft statements; «NK-» prefix of statement numbers (data).
- Persona Dr. Weber (i18n, French, desktop): no blocker. Majors, all existing before this work and needing a decision: (1) the terms and privacy pages require sign-in, yet the login page links to the terms (`hooks.server.ts` public paths, unchanged as required); (2) the privacy notice is inaccurate (Google Fonts, «Google oder Microsoft» when only Google is set up, cookie list without the language cookie, no controller, right of access, retention or Resend's country) – German wording kept; (3) the help does not say that «Mahnungen» are not the formal notice under Art. 257d OR before a termination for arrears – TODO(fachlich prüfen); (4) the app does not say that a PDF is in the tenant's language when it differs from the UI language. Minors: names differ between app and PDF («Coûts totaux» vs «Vos frais accessoires», «Part» as % vs CHF), «frais de gestion» vs «frais administratifs» (OBLF), no French elision before vowel names («de Alpenblick»), a few colons and «%» without non-breaking space where the code joins a name and a text; demo-data oddities (sent before created).
- Persona Sven (i18n, English, keyboard and screen reader): language control reached by Tab, announced «Sprache: Deutsch», opens with Enter, options by Tab, current one marked, Escape returns focus; wizard fully operable in English. Minors on the switcher: arrow keys do not move between options; after choosing a language the page reloads and focus starts at the top of the page without a confirmation; a key press before hydration does nothing. Switching language mid-wizard restores the draft at step 1 (the reload). Major, existing before and needing a decision: terms, privacy and help redirect to sign-in when signed out (same as Dr. Weber).
- Decided by the user (goal check): help, privacy and terms are public now; the persona majors that existed before this work (mobile menu height, glossary entry point, long heating help on phones, Art. 257d OR hint, PDF language not named) stay open; the closed heating-profile choice shows «(100%)» only in German.
- Persona reruns after the follow-up (`sven-i18n-2.md`, `weber-i18n-2.md`): help, privacy and terms open signed out in English and French, switching keeps the page, margins fine at 1440 and 390 px, no German. Fixed: Dr. Weber's major (signed-out help, privacy and terms were dead ends) – they now link to «Anmelden» and show the footer with privacy and terms. Minors left open: focus starts at the top after a language switch without an announcement; the user menu has no arrow keys; the sign-in page itself links only to the terms (privacy via the terms page's footer); the terms call the role both «la gérance/the management» and «le gérant/the property manager»; «Chaque décompte devrait être vérifié» reads weak for a responsibility clause; «Décompte des charges» beside «frais accessoires» (CO 257a/b) and «Loyer supplémentaire», «66.7 %» with a point (Swiss number format kept by decision) – TODO(fachlich prüfen); the signed-out text column sits left in the wide frame, as signed in.
