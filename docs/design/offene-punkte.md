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
