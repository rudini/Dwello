# #685: proposed wording for P-1 and P-3 (for fach-reviewer)

All texts are in `backend/src/services/pdf.service.ts`, `const translations`. Line numbers are those on `w-685` before the change. In the source, every space before «%», «:», «;», «»» and after «« in French is U+00A0 (` `), as in the keys next to it; the tables show it as a normal space. The failing tests that pin this wording: `backend/src/__tests__/statement-pdf-render.test.ts` (P-1: «verweist auf %s im Satz zu den Heizkosten …»; P-3: «nennt auf %s die Monate des Mietverhältnisses als Anteile im Heizprofil», «nennt auf %s auf Seite 2 die abgerechneten Monate …»), `statement-pdf.pg.test.ts` and the `@wip` scenario «Das PDF erklärt den Zeitanteil der Heizkosten mit dem Heizprofil und seinem Abschnitt» (`tests/e2e/features/statement-detail.feature`).

## P-1: the heating sentence points to «Heiz- und Warmwasserkosten»

The pointer is copied from `sharesNoteFuel` (de 157, fr 295, it 433, en 571), the same form in each language. Only the pointer is new.

### `sharesNoteHeating`

| Lang (line) | Current | Proposed |
| --- | --- | --- |
| de 155 | Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil. | Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil (siehe Heiz- und Warmwasserkosten). |
| fr 293 | Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage. | Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage (voir « Frais de chauffage et d’eau chaude »). |
| it 431 | Per le spese di riscaldamento la quota temporale è la quota secondo il profilo di riscaldamento. | Per le spese di riscaldamento la quota temporale è la quota secondo il profilo di riscaldamento (vedi spese di riscaldamento e acqua calda). |
| en 569 | For heating costs, the time share is the share under the heating profile. | For heating costs, the time share is the share under the heating profile (see ‘Heating and hot water costs’). |

### `sharesNoteHeatingParts` (only the first clause changes; the rest stays as it is)

| Lang (line) | Current | Proposed |
| --- | --- | --- |
| de 156 | Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil; bei einer Rechnung mit Leistungszeitraum … | Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil (siehe Heiz- und Warmwasserkosten); bei einer Rechnung mit Leistungszeitraum … |
| fr 294 | … la part selon le profil de chauffage ; pour une facture avec période de prestation … | … la part selon le profil de chauffage (voir « Frais de chauffage et d’eau chaude ») ; pour une facture avec période de prestation … |
| it 432 | … la quota secondo il profilo di riscaldamento; per una fattura con periodo di prestazione … | … la quota secondo il profilo di riscaldamento (vedi spese di riscaldamento e acqua calda); per una fattura con periodo di prestazione … |
| en 570 | … the share under the heating profile; for an invoice with a service period … | … the share under the heating profile (see ‘Heating and hot water costs’); for an invoice with a service period … |

Question for fach-reviewer (existed before, also in `sharesNoteFuel` and `partProfileRun`): the Italian pointer writes the section in lowercase without quotes, while the heading is «Spese di riscaldamento e acqua calda» (it 434). French and English quote it. Change all three Italian pointers to «(vedi «Spese di riscaldamento e acqua calda»)», or keep them as they are?

## P-3: the months' shares say they are shares of the heating profile

The parenthesis follows `UBIQUITOUS_LANGUAGE.md` line 150 (Monatsanteil: «die zwölf Monatsanteile ergeben 100 %»). The verbs come from the keys next to it: «zusammen» (de 156), «totalisent» (fr `heatingPeriodSums` 236), «totalizzano» (it 374), «total» (en 512). «Heizprofil» per `docs/design/i18n-begriffe.md` line 77: profil de chauffage / profilo di riscaldamento / heating profile. «Monatsanteil» alone would be imprecise, because a month the tenancy covers in part is shown reduced (UL line 151).

### `heatingMonths`

| Lang (line) | Current | Proposed |
| --- | --- | --- |
| de 95 | Anteile der Monate Ihres Mietverhältnisses: {months} | Anteile der Monate Ihres Mietverhältnisses im Heizprofil (die zwölf Monate ergeben zusammen 100 %): {months} |
| fr 234 | Parts des mois de votre bail : {months} | Parts des mois de votre bail selon le profil de chauffage (les douze mois totalisent 100 %) : {months} |
| it 372 | Quote dei mesi del suo rapporto di locazione: {months} | Quote dei mesi del suo rapporto di locazione secondo il profilo di riscaldamento (i dodici mesi totalizzano 100 %): {months} |
| en 510 | Monthly shares during your tenancy: {months} | Monthly shares in the heating profile during your tenancy (the twelve months total 100 %): {months} |

### `heatingMonthsBilled` (with «Abgerechnet bis»)

| Lang (line) | Current | Proposed |
| --- | --- | --- |
| de 96 | Anteile der abgerechneten Monate Ihres Mietverhältnisses: {months} | Anteile der abgerechneten Monate Ihres Mietverhältnisses im Heizprofil (die zwölf Monate ergeben zusammen 100 %): {months} |
| fr 235 | Parts des mois de votre bail compris dans ce décompte : {months} | Parts des mois de votre bail compris dans ce décompte, selon le profil de chauffage (les douze mois totalisent 100 %) : {months} |
| it 373 | Quote dei mesi conteggiati del suo rapporto di locazione: {months} | Quote dei mesi conteggiati del suo rapporto di locazione secondo il profilo di riscaldamento (i dodici mesi totalizzano 100 %): {months} |
| en 511 | Monthly shares of the months of your tenancy covered by this statement: {months} | Monthly shares in the heating profile of the months of your tenancy covered by this statement (the twelve months total 100 %): {months} |

Left as they are (they already name the heating profile): `partProfile`/`partProfileBilled` (de 112/113, fr 250/251, it 388/389, en 526/527) and `heatingPeriodMonths` (de 98). Question for fach-reviewer: do these need the same parenthesis?

Example as printed (de, Eva Frei, January to March): «Anteile der Monate Ihres Mietverhältnisses im Heizprofil (die zwölf Monate ergeben zusammen 100 %): Jan 18.00 %, Feb 14.00 %, Mär 11.00 %».
