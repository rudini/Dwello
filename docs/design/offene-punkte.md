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
