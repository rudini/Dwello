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
| Verwaltungspauschale without a Verteilschlüssel | statement wizard step 3, calculation | Glossary: percentage of the Nebenkosten der Liegenschaft, equal per Wohnung without a key. Since review B (MR-M1, IV-M3) without a key it is the percentage of the tenant's own Nebenkosten; with a key unchanged. |
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
- ~~The statement does not store the Verteilschlüssel of the Verwaltungspauschale~~ – stored since migration 0004 (`management_fee_distribution_key_id`), with the Heizprofil (`heating_profile_id`); statements created before have neither.
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
- Verwaltungspauschale: one rate and key per generation run; contracts with different rates need separate runs (help text). The guideline of 3 % follows the glossary; sources name 3 to 5 % – TODO(fachlich prüfen).
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
- The management fee without a key is a percentage of the subtotal (the tenant's own costs), the glossary describes a percentage of the building's costs shared by apartment (review D, DIV-10) – TODO(fachlich prüfen); the PDF says which base it used.
- A draft's PDF shows the statement as if sent today; marking it as sent dates it to that day (Swiss time) with the full payment deadline, never a shorter one, and discards an older PDF (review D2 round 2, DIV2-01, CD2-2). A deadline set shorter than the configured days is therefore extended when sending; a later one stays. The send dialog asks to deliver the PDF on the day it is marked. A statement already sent keeps its date and deadline; a paid statement printed again has no payment part.
- Statements created before migration 0011 print "–" for Wohnungsanteil and Zeitanteil, and the key's fraction from the building's apartments as they are now (later statements keep the values they were created with, `key_values`, CD2-3).
- Review D2 round 2, left low: a month split by a tenant change shows its share without the days it was counted for (DIV2-06); the request for the IBAN on a refund names only the postal address (DMR2-02, with DMR-09); the QR code ends with the empty optional «Rechnungsinformationen» after `EPD` as its 32nd element, no further line break (DDP2-4, as the existing test of the element count); Italian category names such as «Portiere» are master data (DIV2-08); «Wohnung EG, EG» in the demo data repeats number and floor (DIV2-08).
- Not in the PDF yet (D1 proposals): several tenants of one contract as recipients, Akonto per month when it changed in the period (only the total is printed), a list of receipts, the previous year per category.
- QR-bill v2.4 (from 14.11.2026): no change needed for CHF bills according to the research (D1R-07); to check with the SIX guidelines – TODO(fachlich prüfen).


## Session 11 – review round 8 and persona run (R3-review)

- Reminders are German for every tenant (R8-04); the reminder letter names the QR reference with a QR-IBAN but has no payment part.
- After saving an invoice for a period already billed, the list shows no hint; the hint is on the invoice and the statement (R8-07). The wizard and the invoice say «Tankbestand», the building page «Brennstoff im Tank oder Lager» (R8-08) – TODO(fachlich prüfen). The empty preview keeps «Weiter» and the totals (R8-09). English key names without unit, US and UK spelling mixed (R8-11). Creditor house number in the street field of the QR code (R8-13, allowed).
- Demo data: stored PDFs of paid statements are made after paying; `paid_amount` empty; no invoice with a service period across the year end (R8-12, DP8-F2, DP8-F3).
- Statements: no date «Versendet am» to choose, the app dates the statement on the day it is marked (by design); the stored PDF of a statement is made again after it is paid (no unchangeable archive of the PDF as sent) – TODO(fachlich prüfen).
- Persona run session 11, left medium: existing statements are not shown in step 2 of the wizard (Anna); the restored-draft notice stays after creating statements, the heating profile help is long, the fee is preset to the setting's 3 %, an invoice recorded from a wizard warning has no category preset (Marco); tenancy period, key fraction and heating profile only in the PDF, the app's «Anteil» rounds differently, the chimney sweep is shared by the heating profile (Dr. Weber); no error summary, «Abbrechen» before «Weiter» in step 1, the Akonto notice is not linked to its field (Sven).
- Round 4 (R3-review): a payment date long before the statement is accepted (no lower bound) and the backend answers an invalid calendar date with its raw error (R4-N4); downloading a draft's PDF on a later day dates the draft anew (by design: the PDF is what goes out), an old PDF without a configured IBAN is delivered as it is (R4-N6); the design guard has no examples for blur (R4-N7); the overview shows payment deadlines 30 days ahead, also when the setting gives more days (R4-N10).
- Sven, rerun: the focus in the paid dialog starts on «Abbrechen», before the date field; the dialog's description is its whole content; the wizard's error stands after the long help text; «-5» as an amount gets the general amount text.
- Round 5: «überfällig» in the backend (statements, contracts, tenants) is computed in server time (UTC), up to two hours behind the Swiss day (R5-4); a 2nd reminder can follow the 1st at once, the reminder's own deadline is not stored (R5-8) – TODO(fachlich prüfen).
- Sven, second rerun: in the paid dialog the confirm button comes before the date field in the tab order, the dialog's description is its whole content, only «Dieses Datum gibt es nicht» is announced on its own (the other date errors through the field's description); once the list's button did not react after several Enter presses (not reproduced).
- Round 7: on a desktop, the date error shown when the field is left makes the centred dialog taller; the confirm button moves down and the first click misses it (R7-F2, probably Sven-N12). Anchoring dialogs at the top or reserving the error line would avoid it.
