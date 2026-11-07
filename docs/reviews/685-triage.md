# Triage #685: statement PDF explanations of heating and time shares

Read-only triage on `w-685` (fresh from `origin/main`). Source report: `docs/design/personas/weber-issue-208.md`, deleted in `c893731`; read with `git show c893731^:docs/design/personas/weber-issue-208.md` (P-1 line 12, P-3 line 14, observations lines 20–24).

**Where the PDF texts live:** not in `messages/*.json`. They are in `backend/src/services/pdf.service.ts`, `const translations` (line 36), one block per language: de from line 37, fr from line 176, it from line 314, en from line 452 (offset fr +138 except where noted). Each key below is at the same place in each block (de line n, fr n+138, it n+276, en n+414).

## Summary

| Point | Still holds | Fix | Product-owner decision |
| --- | --- | --- | --- |
| P-1 heating sentence has no pointer to the section | yes | add «(siehe Heiz- und Warmwasserkosten)» in 2 keys × 4 languages | no (wording only; fach-reviewer) |
| P-3 «Anteile der Monate …» does not say of what | yes | add «im Heizprofil (alle zwölf Monate zusammen 100 %)» in 2 keys × 4 languages | no (wording only; fach-reviewer) |
| French tenancy line (#325) | no: fixed | none | — (#325 closed, completed by PR #516) |
| No Zeitanteil column on the detail page | no: fixed | none | — |
| «12.6 %» next to «12.92 %» on the detail page | yes | `toFixed(2)` in 2 places | small one: recommended 2 decimals, as in the PDF |
| Totals and explanation on page 2, apart from the table | partly | see options | yes |
| #249 «Kosten Liegenschaft» | no: fixed | none | — (#249 closed, completed by PR #377; 0 hits for «Liegenschaft» in `pdf.service.ts`) |

## P-1: heating sentence without pointer to «Heiz- und Warmwasserkosten»: holds

The text was reworded since #208, but the pointer is still missing. `sharesNote` (de line 148) gets `{heating}` from `sharesNote()` (line 1182 ff., line 1192) = `sharesNoteHeating` or `sharesNoteHeatingParts`:

| Key | de (line) | Current text |
| --- | --- | --- |
| sharesNoteHeating | 155 | « Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.» |
| | fr 293 | « Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage.» |
| | it 431 | « Per le spese di riscaldamento la quota temporale è la quota secondo il profilo di riscaldamento.» |
| | en 569 | « For heating costs, the time share is the share under the heating profile.» |
| sharesNoteHeatingParts | 156 | « Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil; bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin. Haben diese Monate …» |
| | fr 294, it 432, en 570 | same structure: «… la part selon le profil de chauffage ; …», «… la quota secondo il profilo di riscaldamento; …», «… the share under the heating profile; …» |

The pointer pattern already exists, with a different form per language: `sharesNoteFuel` (de 157 «(siehe Heiz- und Warmwasserkosten)», fr 295 «(voir « Frais de chauffage et d’eau chaude »)», it 433 «(vedi spese di riscaldamento e acqua calda)», en 571 «(see ‘Heating and hot water costs’)»), and the same in `partProfileRun` (de 114, fr 252, it 390, en 528).

**Smallest fix:** add the same pointer right after «Heizprofil» in both keys:
- de: «… der Anteil nach dem Heizprofil (siehe Heiz- und Warmwasserkosten).» / «… nach dem Heizprofil (siehe Heiz- und Warmwasserkosten); bei einer Rechnung …»
- fr: «… la part selon le profil de chauffage (voir « Frais de chauffage et d’eau chaude »).»
- it: «… la quota secondo il profilo di riscaldamento (vedi spese di riscaldamento e acqua calda).»
- en: «… the share under the heating profile (see ‘Heating and hot water costs’).»

Check this in a render test: `byProfile` items imply `data.heating`, so the section is printed (`heatingSection`, line 1243, returns early without `data.heating`). Test in `backend/src/__tests__/statement-pdf-render.test.ts`; also check which existing tests and scenarios pin the current sentence.

Side note for fach-reviewer (existed before): the Italian pointer writes the section name in lowercase with no quotes. The section heading is «Spese di riscaldamento e acqua calda» (it 434). French uses guillemets and English quotes.

## P-3: «Anteile der Monate Ihres Mietverhältnisses» does not say of what: holds

`heatingLines()` (line 1220 ff., line 1229) prints the following under the heating note:

| Key | Line | Current text |
| --- | --- | --- |
| heatingMonths | de 95 | «Anteile der Monate Ihres Mietverhältnisses: {months}» |
| | fr 234 | «Parts des mois de votre bail : {months}» |
| | it 372 | «Quote dei mesi del suo rapporto di locazione: {months}» |
| | en 510 | «Monthly shares during your tenancy: {months}» |
| heatingMonthsBilled | de 96 | «Anteile der abgerechneten Monate Ihres Mietverhältnisses: {months}» |
| | fr 235 / it 373 / en 511 | «Parts des mois de votre bail compris dans ce décompte : …» / «Quote dei mesi conteggiati del suo rapporto di locazione: …» / «Monthly shares of the months of your tenancy covered by this statement: …» |

By contrast, `partProfile` (de 112) already says «Anteile der Monate im Heizprofil». `UBIQUITOUS_LANGUAGE.md` line 150 defines the Monatsanteil: the twelve monthly shares make 100 %. A month the tenancy only partly covers is shown reduced (line 151), so «Monatsanteil» alone would be imprecise.

**Smallest fix (proposed wording, for fach-reviewer):**
- de: «Anteile der Monate Ihres Mietverhältnisses im Heizprofil (alle zwölf Monate zusammen 100 %): {months}»; Billed: «Anteile der abgerechneten Monate Ihres Mietverhältnisses im Heizprofil (alle zwölf Monate zusammen 100 %): {months}»
- fr: «Parts des mois de votre bail dans le profil de chauffage (les douze mois font ensemble 100 %) : {months}»; Billed: «Parts des mois de votre bail compris dans ce décompte, dans le profil de chauffage (les douze mois font ensemble 100 %) : {months}»
- it: «Quote dei mesi del suo rapporto di locazione nel profilo di riscaldamento (i dodici mesi insieme fanno 100 %): {months}»; Billed: «Quote dei mesi conteggiati del suo rapporto di locazione nel profilo di riscaldamento (i dodici mesi insieme fanno 100 %): {months}»
- en: «Monthly shares of your tenancy in the heating profile (all twelve months together 100 %): {months}»; Billed: «Monthly shares in the heating profile of the months of your tenancy covered by this statement (all twelve months together 100 %): {months}»

Optional, for fach-reviewer to decide: whether `partProfile`/`partProfileBilled` (de 112/113) and `heatingPeriodMonths` (de 98) need the same parenthetical. They already name «im Heizprofil».

## French tenancy line (#325): fixed

#325 is closed (completed, PR #516). The current text: `tenancyLine` fr 262 «Votre bail pendant cette période : {start} – {end} ({days} jours de location sur {total})» and `tenancyBilledLine` fr 263, reworded. The reworded line no longer has the «Décompté jusqu’au {date} ; ce décompte …» of the #325 proposal.

I scanned the fr block (lines 176–313) for «:», «;» and «»» without a non-breaking space before them, and for «« » without one after it. I found no violation. `colon` fr 187 = « : ». `agreedCosts` fr 303 uses a literal U+00A0. This matches `docs/design/i18n-begriffe.md` line 5 (guillemets with a non-breaking space inside). Nothing left to do.

## Zeitanteil column on the detail page: fixed

`src/routes/statements/[id]/CostTable.svelte` line 119 has the column `m.statements_time_share()` («Zeitanteil» / «Part temporelle» / «Quota temporale» / «Time share»). The cards show it at lines 145–146 and the table through `timeShare()` (lines 96–112: «x/y Tage» or «{percent} nach Heizprofil»). The detail page is `+page.svelte`, and the table lives in `CostTable.svelte`.

## Percent precision mix: holds

- The Zeitanteil column uses `percent()` with `toFixed(2)` (CostTable.svelte line 95).
- The combined column «Anteil» (`statements_share`: Anteil / Part / Quota / Share, messages/*.json line 1445) prints `{item.percentage} %` raw at CostTable.svelte lines 148 (card) and 166 (table). The mapper rounds it to a number (`src/lib/server/statement.ts` line 28: `Math.round(… * 100) / 100`), so 12.60 shows as «12.6 %» and 26.00 as «26 %».

**Smallest fix:** `{item.percentage.toFixed(2)} %` at lines 148 and 166. This needs a DOM test seen red first (e.g. in `src/__tests__/statement-pages.dom.test.ts`, a contract-backed line item with a percentage like 12.6). I grepped the feature files and found no scenario that pins a 0/1-decimal «Anteil».

**Decision (small, product owner):**
1. **Recommended:** always 2 decimals, as the PDF (`heatingLines` line 1224) and the Zeitanteil column already do.
2. 1 decimal everywhere in the app. This would differ from the PDF the tenant gets.
3. Drop trailing zeros everywhere, including the Zeitanteil column. Inconsistent with the PDF.

## Totals and explanation on page 2: partly holds

`costTable()` (lines 1012–1058):
- The subtotal-to-Saldo block is kept together (lines 1025–1031, `room()` line 780 moves the whole block). If it does not fit, it starts on page 2, apart from the table rows. No table row is pulled along, and the header is not repeated above the totals.
- The explanation `sharesNote` has its own `room()` check (lines 1052–1055), so it can move to the next page on its own, apart from the totals as well.

The reported case (Schmidt: table ends on page 1 with free space, totals and note on page 2) follows from the block height. I did not render it here (needs the demo database). Whether it still occurs with today's demo data is unconfirmed.

**Decision (product owner), options:**
1. **Recommended:** keep the last table row(s) with the totals. Before the totals, if the block does not fit, move the last position(s) along and repeat the table header (`tableHeader` already serves as the `header` callback of `row`/`room`). Then page 2 starts with header, rows, totals. Small change in `costTable()`.
2. Keep the explanation with the totals too: one `room()` for totals plus note height. This makes the moved block bigger, so page 1 has even more empty space.
3. Leave it as it is. The totals already stay together (#226 era), and the note stays below them.

Options 1 and 2 can be combined. Each needs a render test (page count / page of «Zwischensumme») seen red.

## #249: closed

Closed as completed by PR #377 («PDF says Gebäude»). `grep -c Liegenschaft backend/src/services/pdf.service.ts` = 0; fr 183 has «Coûts de l’immeuble».

## Not checked

Open GitHub issues on the same topic (out of scope for this triage). Rendering a real PDF (no demo database started).
