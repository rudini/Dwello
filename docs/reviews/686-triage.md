# Triage #686: usability pass of the statement screens and PDF heating wording

Read-only triage on `w-686` at `a46bf5c` (origin/main, after #685). Nothing changed in the app.

## Source report

`docs/design/personas/weber-issue-229-2.md` was deleted in `c893731` ("docs(config): delete analysed review reports",
2026-10-26). Read with `git show c893731^:docs/design/personas/weber-issue-229-2.md`: P-3 on line 14, P-4 on line 15,
observations on lines 19 to 24, suggested texts on lines 62 and 63. History before `ebc0708` is squashed, so the report
cannot be dated against the code changes.

## Points

| # | Point | Still holds | PO decision | fach-reviewer |
|---|---|---|---|---|
| P-3 | Heating «Zeitanteil» on page 1 does not point to page 2 | No (#685) | No | No |
| P-4 | «Heizkosten Ihrer Wohnung» vs «Wohnungsanteil» | Yes | No | Yes |
| P-4b | Section «Heiz- und Warmwasserkosten» vs category «Heizung» | Yes, by design | Yes | Yes, if changed |
| O-1 | Step 2: 12 invoices, step 4: 11 | Yes, reproduced in the demo data | No | No |
| O-2 | First click on «PDF erstellen» does nothing | Yes (before hydration) | No | No |
| O-3 | Detail page 21.41 % is not in the PDF | No | No | No |
| O-4 | «Liegenschaft» in the PDF | No (#249) | No | No |
| O-5 | Detail page: Mietstage but no move-out date | No | No | No |
| O-6 | A draft already has a Zahlungsfrist | Yes | Yes | No (UI text) |

### P-3: heating time share points to its derivation (fixed)

- `backend/src/services/pdf-texts/de.ts:120` `sharesNoteHeating`: «Bei Heizkosten ist der Zeitanteil der Anteil nach dem
  Heizprofil (siehe Heiz- und Warmwasserkosten).» (`:121` is the same for invoices with a Leistungszeitraum, `:79`
  `partProfileRun` too). Added in `379a795` (#685).
- The cell still prints the percentage (`pdf.service.ts:200-206`, `timeShare`: `formatShare` for `byProfile`), which is
  correct: the share by profile is not a number of days.
- The report suggested «auf Seite 2». A page number breaks when the layout moves. The section name is a printed heading.
- **Fix:** none. Close as done by #685.

### P-4: «Heizkosten Ihrer Wohnung» is the «Wohnungsanteil» (holds)

- `de.ts:57` `heatingNote`: «Heizkosten nach Heizprofil «{profile}»: {percent} % der Heizkosten Ihrer Wohnung in der
  Abrechnungsperiode». The column is `de.ts:68` `apartmentShareColumn` «Wohnungsanteil», and `sharesNote` (`de.ts:113`)
  defines it as «der Anteil Ihrer Wohnung an den Kosten des Gebäudes nach dem Verteilschlüssel».
- Same in `fr.ts:57`, `it.ts:57`, `en.ts:57` («frais de chauffage de votre logement», «spese di riscaldamento del suo
  appartamento», «your apartment’s heating costs»).
- **Smallest fix:** name the column's term in `heatingNote` in all four languages, e.g. «{percent} % Ihres
  Wohnungsanteils an den Heizkosten der Abrechnungsperiode» (fr «de la part du logement aux frais de chauffage», it «della
  quota appartamento delle spese di riscaldamento», en «of the apartment share of the heating costs»). The report's
  version with the amount («(CHF 693.16)») needs the sum of every heating position, so there is one more value to compute
  and test. Leave it out unless fach-reviewer asks for it.
- **fach-reviewer:** yes, PDF wording in four languages. Ask it for the whole text in its first round.

### P-4b: section «Heiz- und Warmwasserkosten», category «Heizung» (by design)

- `de.ts:123` `heatingSection` «Heiz- und Warmwasserkosten». It is the legal term (`de.ts:136` `noteHeating`, Art. 8
  Abs. 1 VMWG), and #685 just made `sharesNoteHeating` point to it.
- «Heizung» is the landlord's category (demo: `backend/demo/demo-data.sql:166`). `UBIQUITOUS_LANGUAGE.md:97` defines
  «Heizkosten (Kategorie)» as excluding separately billed hot water. The profile «Heizung + Warmwasser» covers both in the
  demo.
- **Decision (product owner):**
  1. **Recommended:** keep the heading. It is the VMWG term, and #685 just pointed to it. Close P-4b.
  2. Rename to «Heizkosten» when no hot-water category is billed. That is a branch in the heading and in every pointer
     to it, and it needs fach-reviewer.

### O-1: step 2 counts 12 invoices, the preview 11 (holds, reproduced)

- Step 2: `src/routes/statements/generate/BuildingStep.svelte:47-52` counts `/invoices` by **Rechnungsdatum**
  (`backend/src/services/invoice.service.ts:128-134`), text `messages/de.json:1552` «{count} Rechnungen in der
  Abrechnungsperiode».
- Step 4: `src/lib/server/statement-generation.ts:285-289` counts `invoices/for-statement`, **by Leistungszeitraum,
  otherwise by date**.
- Demo cause: `backend/demo/demo-data.sql:218-219` moves «Fernwärme Q4 2024» to 2025-01-20 with the Leistungszeitraum
  2024-10-01 to 2024-12-31. Step 2 counts it for 01.01.–30.09.2025, the statement does not. In the other direction, an
  invoice dated after the period with a Leistungszeitraum in it is missing from step 2.
- **Smallest fix:** step 2 counts by the statement's rule, e.g. one `invoices/for-statement/{id}?periodStart&periodEnd`
  call per building instead of the `/invoices` list. Under 50 apartments means few buildings. This is a bug fix: a
  `@wip` scenario first (the wizard step 2 count equals the preview count for a building with a January invoice for Q4),
  plus a lower-layer test.

### O-2: first click on «PDF erstellen» does nothing (holds)

- `src/routes/statements/[id]/PdfAction.svelte:39-45`: a `Button` with only `onclick={ongenerate}`, and
  `+page.svelte:142-167` runs `fetch`. Before hydration the click has no handler and no form, so nothing happens and
  nothing is said.
- **Smallest fix:** make it a `<form method="POST" action="?/generatePdf" use:enhance>` with an action next to the
  others in `src/routes/statements/[id]/+page.server.ts:55`, so it works before hydration (the page's other actions do
  this already). Bug: a reproducing test (DOM: the button sits in a form with that action) and a scenario. A click before
  hydration is hard to time in E2E, so `No scenario: <reason>` may apply (`tests/e2e/CLAUDE.md`).

### O-3: detail page 21.41 % (fixed)

- `src/routes/statements/[id]/CostTable.svelte:117-120, 164-167` now shows «Wohnungsanteil» and «Zeitanteil». The heating
  share reads «83.53 % nach Heizprofil» (`messages/de.json:1475`). Both match the PDF columns.
- Left: the derivation of the months appears only in the PDF. The detail page shows the profile name
  (`CostTable.svelte:180-184`). Not asked here. Leave it.
- **Fix:** none.

### O-4: «Liegenschaft» (fixed)

- `de.ts:6` «Gebäude», `de.ts:9` «Kosten des Gebäudes». No «Liegenschaft» in `pdf-texts/` or `pdf.service.ts`. #249 is
  closed.

### O-5: move-out date on the detail page (fixed)

- `src/routes/statements/[id]/PartiesPanel.svelte:43-52`: «Ihr Mietverhältnis in dieser Periode: {start} – {end}»
  (`messages/de.json:1477`) above «{days} Mietstage».
- **Fix:** none.

### O-6: a draft already shows a Zahlungsfrist (holds)

- A draft gets `statementDate + payment_deadline_days` when it is created
  (`backend/src/services/statement.service.ts:536-540`). The PDF of a draft and the sending move it to at least today
  plus that many days (`datedToday`, `statement.service.ts:724-728`, used at `statement-pdf.service.ts:330` and
  `statement.service.ts:758`).
- The detail page shows it as «Zahlungsfrist» with no hint (`src/routes/statements/[id]/PaymentPanel.svelte:41-45`).
- **Decision (product owner):**
  1. **Recommended:** keep the date on a draft and add help text under it, e.g. «Gilt ab dem Versand. Versenden Sie
     später, verschiebt Dwello sie auf {n} Tage nach dem Versanddatum.» It is a UI text in four languages, and the
     landlord sees the date the PDF would print.
  2. Hide the Zahlungsfrist on a draft. The draft PDF still prints one, so the screen and the PDF would disagree.
  3. Leave it as it is.

## Issues

There is no open duplicate (REST search for «hydrat», «Zahlungsfrist Entwurf», «Rechnungen Schritt 2»). O-1 and O-2 are
bugs that can be fixed within #686, or split out with the label `bug`.
