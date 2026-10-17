# Fachreview #71 (F-13, Option B), Runde 2

Gegenstand: Worktree `review-71-fach2`, detached bei 5ef0f20, Delta `git diff c491eeb 5ef0f20`. Geprüft habe ich die Antworten auf `docs/reviews/71-fachreview-1.md`. Grundlage waren `calculation.service.ts` (`byProfile`, `sharedByInvoices`, `shareOfGroup`), `pdf.service.ts` (`partLine`, `heatingNote`, `sharesNote`, neue Texte in vier Sprachen), `statement-pdf.service.ts` (`runDetailsOf`, `heatingOf`), `prorating.service.ts` (`handleMidYearMoves`), `heating-profile.service.ts` (`calculateHeatingShare`), die neuen Tests, `statement-detail.feature`, Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md`, `docs/data-model.md`, `docs/design/i18n-begriffe.md` sowie die Issues #335, #336 und #237 (Kommentar).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-4 | Mietrecht | Major | Hat keine Heizrechnung einen Anteil nach Heizprofil, sondern nur Rechnungen nach Mietstagen (0-%-Rückfall), druckt der Heizungsabschnitt den Tage-Anteil als «… % der Heizkosten Ihrer Wohnung», und die Erläuterung sagt «Zeitanteil = Anteil nach Heizprofil» |
| V-9 | Verwalter | Nit | fr «aucun» und it «nessuno» passen nicht zu «parts» und «quote» (weiblich) |
| V-10 | Verwalter | Nit | it «la sua quota figura sotto la voce» liest sich in der Lei-Form als «Ihr Anteil» |
| V-11 | Verwalter | Nit | In `sharesNoteHeatingParts` steht «0 %» mit normalem Leerzeichen, sonst steht ` ` |
| V-12 | Verwalter | Nit | Regel 5: «Eine schon versendete Abrechnung behält ihre Anteile (offen: #335); ohne Heizprofil …» verbindet zwei Sätze, die nichts miteinander zu tun haben |
| V-13 | Verwalter | Nit | #335 nennt für die Gegenrichtung «620.00 instead of 100.00». Nach der neuen Regel trägt der Vermieter 50.00 |

Stand der Befunde aus Runde 1:

| ID | Stand |
|---|---|
| M-1 | Behoben. Der Satz ist eingeschränkt, `heatingOf` nimmt den Anteil des Laufs, ein Render-Test und eine Zeile im Szenario sind da. Ein Rest bleibt, siehe M-4 |
| M-2 | An #335 übergeben (`fachlich`, `entscheiden`, offen), Regel 5 verweist darauf. Bleibt bis zum Entscheid offen (Fehler im Issue-Text: V-13) |
| M-3 | Behoben. `sharesNoteHeatingParts` übernimmt den Vorschlag wörtlich, in vier Sprachen |
| V-1 | Behoben. Regel 5 nennt die Lesart. Der PDF-Kopf nimmt `partBeyond` bis `{amount}`, nachgerechnet unten |
| V-2 | Behoben. `tankCategories` kommt aus `listFuelStocks(buildingId)`, also aus jeder Ablesung. Es gibt einen Test ohne Endbestand |
| V-3 | In Regel 5 festgehalten («kleine Monatsanteile geben dagegen den ganzen Anteil …»). Die Hilfe ist unverändert. Das ist vertretbar, und der Rest steht in Runde 1 |
| V-4 | Nicht geändert. Bleibt Minor im Bericht von Runde 1 |
| V-5 | Fälle (a)–(d) sind in `heating-distribution.pg.test.ts` abgedeckt, das PDF in `statement-pdf-render.test.ts`. Der Fall aus M-4 fehlt |
| V-6 | Kommentar auf #237 vorhanden (2026-10-17), mit dem Beispiel 520.00 gegen 0.00 |
| V-7 | #336 ist offen (`fachlich`, `entscheiden`) und übernimmt die Vorschläge wörtlich. `TODO(fachlich prüfen, #336)` steht an `partProfile` (`pdf.service.ts:174`) |
| V-8 | Behoben: «Anteile der Monate Ihres Mietverhältnisses darin», einheitlich mit Doppelpunkt. Die Abhängigkeit von #256 ist für den Pull Request vorgemerkt |

## Bestätigt

**Rechnung (`byProfile`, `sharedByInvoices`).** Je Rechnung gilt: Anteil = gerundet(Σ Monatsanteile des Mieters in den Tagen der Rechnung / Σ Monatsanteile dieser Tage × 100). Beide Summen kommen aus `calculateHeatingShare` mit Monatswerten, die auf zwei Stellen gerundet sind. Das sind dieselben Werte, die `monthSum` druckt, also lässt sich jeder Anteil nachrechnen (#232). Die Position nimmt Σ Betrag × Anteil / Σ Betrag. Nachgerechnet mit Heizprofil «Winter», Wohnungsanteil 100 %:

- **Szenario (Eva Jan–Mär, Marc ab Mai), Rechnung Q1 1'000.00 und Jahresrechnung 1'000.00:**
  - Marc: 1'000.00 × 0.00 % + 1'000.00 × 52.00 % = 520.00, also 26.00 %.
  - Eva: 1'000.00 + 430.00 = 1'430.00.
  - Der Vermieter trägt für den April 1'000.00 × 5 % = 50.00.
  - Zusammen 2'000.00. Das stimmt mit `statement-detail.feature` überein.
- **Randfall Monatsmitte (Eva bis 14.03., Marc ab 15.03.):**
  - Q1-Rechnung: März Marc 11 × 17/31 = 6.03, also 6.03 / 43.00 = 14.02 %, CHF 140.20. Eva 36.97 / 43.00 = 85.98 %, CHF 859.80.
  - Jahresrechnung (Anteil des Laufs, Periode 100 %): Marc 63.03 %, CHF 630.30. Eva 36.97 %, CHF 369.70.
  - Zusammen 770.50 + 1'229.50 = 2'000.00.
- **Randfall Gutschrift, mit Gesamtsumme ungleich null:** Jahresrechnung 1'000.00, Gutschrift Q1 −200.00, Σ 800.00.
  - Marc: 520.00 + (−200.00 × 0 %) = 520.00, also 65.00 %, CHF 520.00.
  - Eva: 430.00 − 200.00 = 230.00.
  - Leerstand 50.00. Zusammen 800.00.
  - Die Formel hält auch mit einer Gutschrift. Eine Gesamtsumme 0 bleibt bei #237 (V-6).
- **0-%-Rückfall (Test «teilt eine Rechnung, deren Monate im Heizprofil 0 % haben»):** Mieter ab Juli.
  - 920.00 × 62/92 = 620.00.
  - Jahresrechnung: Jul–Dez 0 + 0 + 2 + 8 + 14 + 26 = 50 %, also 500.00.
  - Zusammen 1'120.00. Das stimmt mit dem Test überein.
- **V-1, Leistungszeitraum über das Periodenende:** Fernwärme 01.10.2023–31.03.2024, CHF 1'820.00.
  - `inPeriod` schneidet den Leistungszeitraum auf 01.01.–31.03.2024 zu: 1'820.00 × 91/183 = 905.03.
  - Mieter Jan–Mär: 43/43 = 100 %, also 905.03. Das stimmt mit dem Test überein.
  - Ein Mieter ab 01.03.: 11 / 43 = 25.58 %, also 231.51.
  - Die PDF-Zeile «Leistungszeitraum 01.10.2023 – 31.03.2024 (Rechnung CHF 1'820.00), davon 01.01.2024 – 31.03.2024: CHF 905.03, Anteile der Monate im Heizprofil: …» entsteht richtig. `text.indexOf('{amount}')` trifft in `partBeyond` nicht `{wholeAmount}`, weil die Platzhalter auf Gross- und Kleinschreibung achten.
- **Konsistenz Lauf und Rechnung ohne Leistungszeitraum:** Für eine Rechnung ohne Leistungszeitraum ist der Divisor in `byProfile` die ganze Periode. Das ist dieselbe Teilung wie in `handleMidYearMoves` (`prorating.service.ts:219–223`), also auch bei einem Heizprofil mit 99.9 % (±0,1 zugelassen). Deshalb stimmen der Prozentwert im Satz des Heizungsabschnitts und «Ohne Leistungszeitraum: …, Anteil nach Heizprofil: 52.00 %» überein.
- **Mietvertrag über die ganze Periode:** `handleMidYearMoves` gibt `wholePeriod` zurück, `byRunProfile` gibt `null`, also werden die Kosten wie bisher nach Tagen geteilt. Die Regel greift nur bei Ein- oder Auszug, wie in #71 entschieden.

**Tank (#257, V-2).** Eine Kategorie mit irgendeiner Ablesung des Gebäudes behält das Heizprofil über die ganze Periode (`calculation.service.ts:92`, `109`). Regel 5 und `data-model.md` sagen dasselbe. Das gibt Art. 5 Abs. 2 lit. a VMWG wieder (Fedlex, Fassung 1.10.2025): «a. die Brennstoffe und die Energie, die verbraucht wurden;». Der Wortlaut ist in Runde 1 zitiert.

**Texte M-1 und M-3, vier Sprachen, gegen `docs/design/i18n-begriffe.md`.** Diese Begriffe sind richtig gebraucht:
- Leistungszeitraum: période de prestation, periodo di prestazione, service period.
- Heizprofil: profil de chauffage, profilo di riscaldamento, heating profile.
- Abrechnungsposition: poste du décompte, voce del conteggio, statement line.
- Mietstage: jours de location, giorni di locazione, days rented.
- Zeitanteil: part temporelle, quota temporale, time share.

Der Verweis «(voir frais de chauffage et d’eau chaude)», «(vedi spese di riscaldamento e acqua calda)», «(see heating and hot water costs)» folgt `heatingSection`. «Parts des mois de votre bail», «Quote dei mesi della sua locazione» und «Shares of the months of your tenancy» folgen dem bestehenden `heatingMonths`. Kleinigkeiten unter V-9 bis V-11.

**Regel 5 und `data-model.md`** beschreiben, was der Code tut: Normierung je Rechnung, gedruckte Monatswerte, Teil über die Periode nach Tagen, 0-%-Rückfall, Sprung bei kleinen Monatsanteilen, Tank-Ausnahme, gespeichertes `invoice_parts[].profile` und den Hinweis auf #335. Die Beispielzeilen in Regel 5 entsprechen `partProfile` und `partProfileRun` wörtlich.

**Satz M-1, wenn alle Heizrechnungen einen Leistungszeitraum haben** (z. B. vier Quartalsrechnungen): Der Satz nennt dann einen Prozentwert «für eine Rechnung ohne Leistungszeitraum», die es nicht gibt. Das folgt meinem Vorschlag aus Runde 1 und ist nicht falsch, denn der Satz ist bedingt formuliert. Ich führe es nicht als Befund.

## Befunde

### M-4 (Major): Heizungsabschnitt nach Mietstagen, aber als Heizprofil-Anteil gedruckt

**Beleg:**
- `calculation.service.ts:51`: Haben die Tage einer Rechnung im Heizprofil zusammen 0 %, bekommt ihr Teil kein `profile` und wird nach Mietstagen geteilt.
- `statement-pdf.service.ts:179`: `heatingLine` ist die erste Heizposition, deren Teile kein `profile` haben. Das trifft auch eine Position, deren Teile alle nach Mietstagen geteilt sind. Dann gilt `percent = lineShare × 100` (`:146`), also der Tage-Anteil.
- `pdf.service.ts:303`: `ownProfileDays` ist nur wahr, wenn ein Teil ein `profile` hat. Sonst druckt das PDF `heatingNote` («… der Heizkosten Ihrer Wohnung in der Abrechnungsperiode») und `sharesNoteHeating` («Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.»).

**Nachgerechnet:**
- Heizprofil «Winter», Periode 2024. Einzige Heizrechnung: Leistungszeitraum 01.06.–31.08.2024, CHF 920.00 (Revision, Wartungsabo oder eine Rechnung, aus der die KI einen Sommerzeitraum liest, V-4). Mieter ab 01.07.2024.
  - Die Abrechnungsposition rechnet richtig: 62/92 = 67.39 %, CHF 620.00.
  - Das PDF sagt «Heizkosten nach Heizprofil «Winter»: 67.39 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode».
  - Darunter steht «Anteile der Monate Ihres Mietverhältnisses: Jul 0.00 %, Aug 0.00 %, Sep 2.00 %, Okt 8.00 %, Nov 14.00 %, Dez 26.00 %», zusammen 50 %. Die Erläuterung nennt den Zeitanteil «Anteil nach dem Heizprofil».
- Zweiter Wert, Mieter ab 15.07.: 48/92 = 52.17 % gegen die gedruckten Monate (Jul 0.00 % …) mit einer Summe von 50 %.
- Mischfall mit zwei Heizkategorien (z. B. «Heizung» mit Jahres- und Quartalsrechnung, «Heizungsservice» nur mit dem Sommerzeitraum): `heatingNoteParts` erscheint, aber mit dem Tage-Anteil der Service-Position als «… % für eine Rechnung ohne Leistungszeitraum». Das hängt davon ab, welche Position zuerst steht.
- Vor dem Delta wurde eine solche Rechnung über die ganze Periode nach Heizprofil geteilt. Der Widerspruch ist also neu.

**Warum falsch:** Es ist derselbe Fehler wie M-1. Der Mieter liest zwei Anteile, die sich widersprechen, und eine Erläuterung, die für seine Position nicht gilt. Art. 8 Abs. 1 VMWG (Fedlex, Fassung 1.10.2025): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Eine Aufteilung, die einen falschen Satz nennt, ist keine nachvollziehbare detaillierte Aufteilung. Regel 5 (#137) verlangt für eine Teilung nach Mietstagen ausdrücklich «die Abrechnung zeigt die Mietstage und keinen Heizprofil-Hinweis».

**Lösung:**
- In `runDetailsOf` jede Heizposition mit `invoiceParts` überspringen, nicht nur eine mit `profile`. Dann nimmt `heatingOf` immer den Anteil des Laufs (`stored.percent`).
- `ownProfileDays` wahr setzen, sobald eine Heizposition (`byProfile`) `invoiceParts` hat. Im Beispiel steht dann «… 50.00 % für eine Rechnung ohne Leistungszeitraum. Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; …», und `sharesNoteHeatingParts` erklärt den 0-%-Fall mit den Mietstagen.
- Strenger nach #137 wäre: Hat der Lauf ausschliesslich Heizrechnungen mit 0 % in ihren Tagen, entfällt der Heizprofil-Hinweis ganz. Die erste Variante genügt aber.
- Dazu ein Test (Render oder `statement-pdf.pg.test.ts`) mit nur einer Sommer-Heizrechnung und Einzug am 01.07.: Erwartet werden 620.00 und der eingeschränkte Satz mit 50.00 %.

### V-9 (Nit): Geschlecht von «aucun» und «nessuno»

**Beleg:** `pdf.service.ts`, `partProfileNone`: fr «aucun», it «nessuno». Eingesetzt wird das Wort in «Parts des mois de votre bail dans cette période : aucun» und «Quote dei mesi della sua locazione in tale periodo: nessuno». «parts» und «quote» sind weiblich.

**Lösung:** fr «aucune», it «nessuna».

### V-10 (Nit): it «la sua quota»

**Beleg:** it `heatingNoteParts`: «…; la sua quota figura sotto la voce del conteggio.» In der Lei-Form liest sich «sua» als «Ihr» (vgl. `partShare` it: «La sua quota»). Gemeint ist der Anteil der Rechnung. Das Französische ist eindeutig, weil es «vous»/«votre» braucht.

**Lösung:** «…; la quota di tale fattura figura sotto la voce del conteggio.» Das deutsche «ihr Anteil» ist eindeutig und bleibt.

### V-11 (Nit): «0 %» ohne geschütztes Leerzeichen

**Beleg:** `sharesNoteHeatingParts` (de, fr, it, en) schreibt «0 %» mit normalem Leerzeichen. `partProfile` und `heatingPeriodMonths` schreiben ` %`. In der Erläuterung kann «0» am Zeilenende und «%» am Anfang der nächsten Zeile stehen.

**Lösung:** In den vier Texten `0 %` schreiben.

### V-12 (Nit): Satzverbindung in Regel 5

**Beleg:** `docs/nebenkostenabrechnung-anforderungen.md`, Regel 5: «Eine schon versendete Abrechnung behält ihre Anteile (offen: #335); ohne Heizprofil auch die Heizkosten nach Tagen, ebenso wenn …». Der zweite Teil gehört zum Satz «… nach dem Heizprofil verteilt, alle anderen nach Tagen».

**Lösung:** Den Satz zu #335 ans Ende des Heizteils stellen und den zweiten Teil als eigenen Satz beginnen: «Ohne Heizprofil werden auch die Heizkosten nach Tagen geteilt, ebenso …».

### V-13 (Nit): Zahl in #335

**Beleg:** In #335 steht: «The other way round (Eva old 860.00, Marc new 520.00) the landlord bears 620.00 instead of 100.00 (April vacancy).» Nach der neuen Regel trägt der Vermieter nur 1'000.00 × 5 % = 50.00, denn die Q1-Rechnung hat keinen April. 100.00 ist der Wert nach der alten Regel. In meinem Bericht aus Runde 1 steht richtig «620.00 statt 50.00».

**Lösung:** Im Issue «instead of 50.00 (April vacancy of the yearly invoice)» schreiben.

## Fehlende Begriffe

Es gibt keine neuen. Die Vorschläge zu «Anteil nach Heizprofil» und «Zeitanteil» liegen in #336.

## Nicht bestätigt

- **M-4 ist aus dem Code abgeleitet und nicht ausgeführt.** Der Review-Worktree darf keine neuen Testdateien bekommen. Ich habe `runDetailsOf`, `heatingOf`, `heatingLines`, `sharesNote` und `byProfile` nachgelesen, aber kein PDF mit nur einer Sommer-Heizrechnung erzeugt. Den Beweis liefert der vorgeschlagene Test.
- **Zeitzone:** `toDate(day)` liest ISO-Tage als UTC, `calculateHeatingShare` rechnet mit lokalen Monatsgrenzen. Das ist dasselbe Muster wie bisher in `handleMidYearMoves` und damit nicht Gegenstand des Deltas. Unter `Europe/Zurich` habe ich es nur für den 31. Januar überschlagen (31 Tage, richtig), nicht systematisch.
- **Ausgeführte Tests:** Die neuen Tests in `heating-distribution.pg.test.ts` und `statement-pdf-render.test.ts` habe ich gelesen und ihre Erwartungen nachgerechnet (oben), aber nicht laufen lassen.
- **Praxis von Option B:** Unverändert **unsicher** wie in Runde 1. Ich habe keine Schweizer Quelle für die Normierung je Rechnung über ihren Leistungszeitraum gefunden.
- **Fedlex:** Art. 5 und 8 VMWG stammen aus der in Runde 1 gespeicherten Fassung 1.10.2025 (`/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/fedlex71/vmwg-20251001.html`). Ich habe sie nicht neu abgerufen.
