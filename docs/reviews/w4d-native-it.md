# Native read (Italian, Ticino): statement PDF, reminder letters, e-mails (#84, Option B)

Reviewer: native Italian speaker from Ticino, Swiss rental practice. Read: rendered samples (`pdf-sample.txt`, `letters-sample.txt`, sections «it …») and all Italian source strings (`pdf.service.ts` `it:` block and `FLOORS`, `statement-pdf.service.ts` `UNITS`, `reminder-letter.ts` `it:` block), against `docs/design/i18n-begriffe.md`. No file changed.

Overall: the Italian is correct, readable and in the right register (formal «Lei», lowercase «le/suo» in running text, CHF, Swiss legal citations «art. … cpv. … CO / OLAL»). The QR-bill labels match the SIX Italian wording. No Major finding. The findings below are idiomatic polish and two small consistency issues.

## Findings (source strings)

| ID | Severity | File / key | Current text | Proposed text | Reason |
|---|---|---|---|---|---|
| IT-1 | Minor | `reminder-letter.ts` `it.openings[2]` | `` `Nonostante due solleciti, il ${s} non è ancora stato pagato. La preghiamo di saldare l’importo immediatamente, altrimenti dovremo avviare ulteriori provvedimenti.` `` | `` `Nonostante il promemoria e il sollecito, il ${s} risulta tuttora non pagato. Le chiediamo di saldare l’importo senza indugio, altrimenti dovremo adottare ulteriori provvedimenti.` `` | (a) The tenant received a «promemoria di pagamento» and a «2° sollecito», not two «solleciti»; the term table separates the two, so «due solleciti» contradicts the letters he holds. (b) «non è ancora stato pagato» repeats level 2 word for word; level 3 needs the «noch immer» escalation («risulta tuttora non pagato»). (c) «avviare provvedimenti» is not an Italian collocation: one «adotta/prende provvedimenti». (d) «immediatamente» sounds abrupt in a letter; «senza indugio» is the usual formula. (e) «La preghiamo» is repeated in the next paragraph («La preghiamo di versare…»); «Le chiediamo» avoids it. |
| IT-2 | Minor | `pdf.service.ts` `it.payBy` | `La preghiamo di pagare l’importo entro il {date} con la sezione pagamento.` | `La preghiamo di pagare l’importo entro il {date} tramite la sezione pagamento.` | «pagare con la sezione pagamento» is a calque of «mit dem Zahlteil»; in Italian one pays «tramite/mediante» a payment slip. |
| IT-3 | Minor | `pdf.service.ts` `it.payNoDate` | `La preghiamo di pagare l’importo con la sezione pagamento.` | `La preghiamo di pagare l’importo tramite la sezione pagamento.` | Same as IT-2. |
| IT-4 | Minor | `pdf.service.ts` `it.notes` | `Avvertenze` | `Osservazioni` | «Avvertenze» reads as «warnings/cautions» (as on a medicine leaflet); for neutral notes that inform the tenant of his rights («Hinweise») a Ticinese form says «Osservazioni». |
| IT-5 | Minor | `pdf.service.ts` `it.balanced` | `Saldato` | `In pareggio` | «Saldato» means «paid in full» and suggests the tenant already paid something. The meaning is «Ausgeglichen» (costs = advance payments, nothing to pay or refund): «In pareggio». |
| IT-6 | Minor | `pdf.service.ts` `it.sharesNoteFuel` | `Costi immobile per il combustibile in cisterna: il consumo (vedi costi di riscaldamento e acqua calda).` | `Costi immobile per il combustibile in cisterna: il consumo (vedi spese di riscaldamento e acqua calda).` | The cross-reference must quote the section heading as printed: `heatingSection` is «Spese di riscaldamento e acqua calda». |
| IT-7 | Minor | `pdf.service.ts` `it.sharesNoteParts` | ` Se una voce del conteggio comprende fatture su giorni diversi, il calcolo figura sotto.` | ` Se una voce del conteggio comprende fatture relative a giorni diversi, il calcolo è riportato sotto la voce.` | «fatture su giorni diversi» is a calque of «über verschiedene Tage» and is unclear; «relative a» is the Italian. «figura sotto» dangles; «è riportato sotto la voce» matches `sharesNoteRounded` («calcolo sotto la voce»). |
| IT-8 | Nit | `pdf.service.ts` `it.tenancyLine` | `La sua locazione in questo periodo: {start} – {end} ({days} giorni su {total})` | `Il suo rapporto di locazione in questo periodo: {start} – {end} ({days} giorni su {total})` | «Mietverhältnis» is «rapporto di locazione» (CO 253 ss., Italian text). «La sua locazione» is understandable but loose. |
| IT-9 | Nit | `pdf.service.ts` `it.rounding` | `Arrotondamento` | `Arrotondamento a 5 centesimi` | de/fr/en print «… auf 5 Rappen / à 5 centimes / to 5 centimes» on this row; Italian alone drops it. |
| IT-10 | Nit | `pdf.service.ts` `it.balancedNote` | `Le sue spese accessorie e i suoi acconti sono uguali. Non deve pagare nulla.` | `Le sue spese accessorie corrispondono ai suoi acconti. Non deve pagare nulla.` | «sono uguali» is flat for amounts; «corrispondono» is the idiomatic way to say two amounts match. |
| IT-11 | Nit | `pdf.service.ts` `it.balancedRounded` | `Dopo l’arrotondamento a 5 centesimi non deve pagare nulla e non riceve nulla.` | `Dopo l’arrotondamento a 5 centesimi non deve pagare nulla né riceve alcun rimborso.` | «non … nulla e non riceve nulla» sounds mechanical; «né riceve alcun rimborso» uses the PDF term «rimborso». |

## Checked and fine (no change)

- Title, «N. conteggio», «Data del conteggio», «Riepilogo costi», «Chiave di riparto», «Quota appartamento», «Quota temporale», «La sua quota», «Spese di gestione», «Acconti versati», «Importo dovuto», «Rimborso», «Pagina x di y»: correct and as in the term table.
- QR-bill part («Ricevuta», «Sezione pagamento», «Conto / Pagabile a», «Riferimento», «Informazioni supplementari», «Pagabile da», «Valuta», «Importo», «Punto di accettazione», «Da staccare prima del versamento»): matches the SIX Italian labels.
- Legal notes `noteReceipts`, `noteHeating`, `noteStock`: correct, OLAL is the right Italian abbreviation of VMWG. «Lei» there is capitalised only because it starts the sentence; running text uses lowercase «le/suo/da lei» consistently.
- `refundBy`/`refundNoDate`/`refundPaidOn` («bonificare»), `refundAccount`, `paidOn`, `fuel*`, `heating*`, `months`, `partNoPeriod`/`partBeyond`/`partStock`/`partLine`: fine.
- `FLOORS.it` («pianterreno», «2° piano», «1° piano interrato») and `UNITS` («appartamenti», «locali»): idiomatic in Ticino.
- Letters level 1 and 2, `amount`, `payBy`, `reference`, `alreadyPaid` («non tenga conto della presente»), `closing` («Cordiali saluti»), subjects and file names: idiomatic and consistent with the PDF («conteggio spese accessorie», «Importo dovuto»).
- Salutation «Gentile Anna Keller,»: the app holds no gender or title, so «Gentile signora Keller» cannot be built; «Gentile» + full name is the accepted form in Swiss Italian automated correspondence (banks, insurers). Better than «Buongiorno» in a dunning letter. No change.

## Master data (`backend/migrations/0002_stammdaten.sql`, `name_it`; a change needs a new migration)

| ID | Severity | Row (`name`) | Current `name_it` | Proposed | Reason |
|---|---|---|---|---|---|
| IT-M1 | Minor | `Caretaker` | `Portiere` | `Custode` | In Ticino the «Hauswart» of an apartment building is the «custode»; «portiere» is a doorman / concierge at a lobby desk (and the football goalkeeper). Swiss Italian rental texts use «servizio di custodia / custode». |
| IT-M2 | Nit | `Garden Maintenance` | `Manutenzione giardino` | `Cura del giardino` | «Gartenpflege» is «cura del giardino»; «manutenzione» is the binding term for «Wartung» (servicing) and may blur that distinction. Optional. |
| IT-M3 | Nit | `Building Insurance` | `Assicurazione edificio` | `Assicurazione dello stabile` | «stabile» is the Swiss Italian word in insurance contexts; not shown to tenants as an allocable cost, so optional. |

Others fine: Riscaldamento, Acqua calda, Acqua fredda, Acque reflue, Elettricità parti comuni, Ascensore, Sgombero neve, Rifiuti, TV/Cavo, Spazzacamino, Riparazioni, Imposta immobiliare, Interessi ipotecari, Amministrazione, Ristrutturazione, Investimenti di valorizzazione, Controllo dei parassiti, Manutenzione estintori; keys Per unità, Per superficie (m²), Per locali, Riscaldamento (superficie 70% / unità 30%); heating profiles incl. «Riscaldamento Ticino», «Riscaldamento Altipiano», «Riscaldamento Montagna».

## Note on the sample (not a translation finding)

The Italian sample PDF prints the category «Hauswart» and the key «Pro Fläche (m²)» in German. `statement-pdf.service.ts` line 53 falls back to `name_de` when `name_it` is empty, so the sample's fixture probably used records without Italian names (the seeded rows have them: «Portiere», «Per superficie (m²)»). Could not confirm from the sample alone; worth checking that the sample generator uses seeded master data, since a landlord-created category without `name_it` would print German on an Italian PDF.
