# Fach-Review #226, Runde 2 (Feature-Review nach der Umsetzung)

Gegenstand: `git diff fee5c0e9 cf49fa58` (Commit cf49fa58). Geprüft wurde, was das PDF jetzt druckt: eine Zeile je Rechnung unter einer Abrechnungsposition über verschiedene Tage, die Formelzeile, Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md`, `docs/data-model.md` und Migration 0005.
Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-fach2`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-9 | Verwalter | Minor | Die Erläuterung unter der Tabelle (`sharesNote`, alle vier Sprachen) sagt bei einer Position mit Rechnungszeilen weiterhin «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode». Das ergäbe 139/365 = 38.08 %. Die Position zeigt 34.06 %, und die Zeilen zeigen 0/91 und 47/92. Die Erläuterung widerspricht so der Formel. |
| V-10 | Verwalter | Minor | Die Veränderung des Tankbestands ist eine Pseudo-Rechnung über die ganze Periode (`fuel-stock.service.ts:82-99`). In einer Heizkosten-Position nach Tagen erscheint sie als Rechnungszeile, nicht unterscheidbar von einer Rechnung (Glossar: Rechnung = «Beleg eines Dienstleisters»). Bei der Belegeinsicht gibt es dazu keinen Beleg. |
| V-11 | Verwalter | Nit | Regel 5, der Kommentar im Szenario und der Kommentar zu `partLines` nennen die Formel «die Rechnung, die den Anteil … gewichtet». «Rechnung» ist im Glossar ein Beleg; im selben Satz steht «jede Rechnung» im Sinn von Beleg. |
| V-12 | Verwalter | Nit | Kein Test zeigt eine Rechnung ohne Leistungszeitraum in einer gemischten Position (Rest von V-7). Der Test zum Mieter über die ganze Periode prüft nicht, dass keine Rechnungszeilen erscheinen. |

Mietrecht: kein Befund (Begründung unter «Bestätigt»).

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| V-1 (Major) | **behoben**, mit einem Rest in V-9 | `pdf.service.ts:632-639` (`partLines`): Die Formelzeile «(600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 34.06 %» steht direkt unter den Rechnungszeilen. Das ist die zweite Variante aus Runde 1. Wie die Zeilen den Zeitanteil ergeben, liest der Mieter jetzt ab. Die Erläuterung blieb unverändert und ist jetzt widersprüchlich: V-9. |
| V-2 | **behoben** | `statement-detail.feature:266-267`: 600 / 1'200. Der gewichtete Anteil ist 34.06 %, der Mittelwert der Brüche 25.54 %, die Summe der Tage 47/183 = 25.68 %. Das Szenario unterscheidet die drei Rechenwege, und es prüft das Tausendertrennzeichen («1'200.00»). |
| V-4 | **behoben** (Hinweis in V-9) | Mit den Brüchen der Formel geht «Ihr Anteil» auf den Rappen auf (Rechnung unten). Nur mit dem gerundeten Prozentwert weicht er weiterhin um einige Rappen ab. Das PDF sagt nicht, dass mit der Klammer gerechnet wird; das gehört in die Behebung von V-9. |
| V-5 | **behoben** | Regel 5 (Anforderungen Zeile 145) nennt die Zeilen und die Formel. Der Mieter über die ganze Periode behält «x/x Tage» (`calculation.service.ts:155` mit `wholePeriod`, `pdf.service.ts:446-447`). Der C-5-Test mit 1'810 / 1'840 steht in `statement-pdf.pg.test.ts:222-236`. |
| V-6 | **teilweise behoben**, Rest in #237 | Bei Summe null erscheinen keine Zeilen (`calculation.service.ts:155`, Test `statement-pdf.pg.test.ts:238-251`). #237 nennt die Summe null und Anteile über 100 %. Ein negativer Zeitanteil (Gutschrift grösser als die Rechnung) ist ein weiterer Fall derselben Ursache; er ist von #237 sinngemäss gedeckt («no share above 100 % without an explanation»). |
| V-7 | **behoben** (Rest in V-12) | Die Zeilen sind grau (`COLORS.muted`), stehen eingerückt in der Kategorienspalte (`pdf.service.ts:641-648`) und werden beim Seitenumbruch mit ihrer Position zusammen umgebrochen (`room(doc, top, parts.length * 11 + 20, header)`, Zeile 599; Render-Test `statement-pdf-render.test.ts:259-266`). Gedruckt wird je Rechnung, wie in Runde 1 empfohlen. |
| V-3, V-8 | offen in #236 | Das Issue beschreibt beides richtig, mit «Done means». |

## Bestätigt

**Formel nachgerechnet** (`rentalShare`, `calculation.service.ts:131-141`; `rentedIn` und `days`, Zeilen 125 und 148-149):

1. **Szenario Lea Graf**, Einzug 15.08.2025, bis 31.12.2025, 139 Mietstage.
   - Q2: 01.04.–30.06. = 91 Tage, gemietet `max(0, …)` = 0.
   - Q3: 01.07.–30.09. = 92 Tage, gemietet 15.08.–30.09. = 47.
   - 600 × 0/91 + 1'200 × 47/92 = 613.0435; / 1'800 = 0.340580, gespeichert 0.3406 (DECIMAL(8,4)), gedruckt «34.06 %». Stimmt.
2. **Wohnungsanteil 900.00** (zwei Wohnungen gleichmässig, wie im Render-Test).
   - Ihr Anteil = round(900 × 0.340580) = 306.52.
   - Mit der Klammer: 900 × 613.0435 / 1'800 = 306.52.
   - Mit dem Prozentwert: 900 × 0.3406 = 306.54, also 2 Rappen Abweichung (V-4, V-9).
3. **Grenzfall Ein- und Auszug in einer Teilperiode** (`statement-pdf.pg.test.ts:201-219`): 600 × 16/30 + 606.52 × 31/62 = 320.00 + 303.26 = 623.26; / 1'206.52 = 0.516577, gedruckt «51.66 %».
   - Bei 100 % Wohnungsanteil (70/70 m²) ist Ihr Anteil 623.26.
   - Die Summe der Zeilen (600.00 + 606.52) ist «Kosten Liegenschaft» 1'206.52.
4. **Grenzfall C-5** (`:222-236`): 1'810 × 0/181 + 1'840 × 139/184 = 1'390; / 3'650 = 0.380822 = 139/365.
   - Gedruckt werden «38.08 %» und die Zeilen, nicht «139/365 Tage».
   - Das ist richtig, denn die Tage der Periode sind nicht der Nenner der Rechnungen.
5. **Grenzfall Mieterwechsel**: Ein Vormieter vom 01.01. bis 14.08.2025 erhielte (600 × 91/91 + 1'200 × 45/92) / 1'800 = (600 + 586.96) / 1'800 = 65.94 %.
   - Zusammen mit 34.06 % ergibt das 100 %. Kein Tag wird doppelt oder gar nicht verrechnet.
   - Bei seinem Auszug am 14.08. ist er kein Mieter über die ganze Periode, er bekommt also eigene Zeilen («600.00, 91/91 Tage», «1'200.00, 45/92 Tage»).
6. **Grenzfall Gutschrift mit Summe null** (`:238-251`): Es erscheinen keine Zeilen. Der Rückfall in `timeShare` druckt «0.00 %» (0 ist nicht 139/365). Das ist widerspruchsfrei; der Rest liegt in #237.
7. **Grenzfall Mieter über die ganze Periode**: `daysOf` gibt keine Teile zurück. `timeShare` vergleicht 1 mit `rentalDays/periodDays` = 1 und druckt «92/92 Tage» (`:254-270`). Das entspricht Regel 5.

**Beträge in den Zeilen.** Gedruckt wird der Betrag in der Periode, auf Rappen gerundet (`invoice.service.ts:429`). Derselbe Wert geht in `group.totalAmount` und in `rentalShare` ein (`calculation.service.ts:117-118`). Darum ist die Summe der Zeilen gleich «Kosten Liegenschaft», und der Nenner der Formel (`formatCHF(item.totalAmount)`) ist dieselbe Spalte.

**Sprachen.** Die Rechnungszeilen verwenden `t.days`: «{days}/{total} Tage / jours / giorni / days» (`pdf.service.ts:76`, `:145`, `:214`, `:283`; Render-Test fr/it/en, `statement-pdf-render.test.ts:249-257`). Die Formelzeile besteht nur aus Zahlen und ist in allen vier Sprachen gleich. Datum und Betragsformat entsprechen `tenancyLine`.

**Begriffe.** Verwendet werden «Tage», «Mietstage», «Leistungszeitraum» und «Kosten Liegenschaft» (Glossar `UBIQUITOUS_LANGUAGE.md:58`, `:137`). «Zeitanteil» fehlt im Glossar; das ist bereits in #75 entschieden (Option A, Eintrag durch den Product Owner). Ein neuer Begriff wird nicht eingeführt.

**Regel 5 / Datenmodell / Migration.**
- Regel 5 (Anforderungen Zeile 145) beschreibt das Verhalten so, wie der Code es umsetzt: Zeilen mit Datum, Betrag und Tagen, die Formel, die Ausnahme für die ganze Periode, keine Zeilen bei Summe null und den Fall «zufällig Mietstage / Tage der Periode».
- `docs/data-model.md:301`, `:305` und der Kommentar der Migration 0005 nennen dieselben Ausnahmen. Ältere Abrechnungen behalten `invoice_parts` NULL und den bisherigen Druck.
- Der Fall Heizprofil wird ebenfalls erfasst: `shareDays` bleibt `noDays`, `daysOf` wird nicht aufgerufen (`calculation.service.ts:342-353`).

**Gesetz (Fedlex, Wortlaut).** Geprüft in der Fedlex-Filestore-HTML: OR in der Fassung vom 01.10.2026, VMWG in der Fassung vom 01.10.2025.
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- Art. 5 Abs. 2 Bst. a VMWG: Darunter fallen «die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden».
- Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»

Die Zeilen verrechnen nur die tatsächlichen Aufwendungen in der Zeit, in der der Mieter gemietet hat. Leerstand und Tage vor dem Einzug trägt der Vermieter (Regel 4). Für den Mieter ist nichts unzulässig, und die Darstellung erleichtert die Belegeinsicht. Keine Norm schreibt eine Form vor.

## Befunde

### V-9 (Minor): Erläuterung zum Zeitanteil widerspricht der Formelzeile

**Beleg:**
- `pdf.service.ts:89`: «… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode{days}{heating}.»
- `pdf.service.ts:653`: `otherDays` setzt `item.shareDays` voraus. Eine Position mit `invoiceParts` hat keine `shareDays`, darum fehlt auch der Zusatz `sharesNoteDays`.
- Der Test schreibt das sogar fest: `statement-pdf.pg.test.ts:216`, `expect(mixed).not.toContain('Ihre Mietstage darin')`.
- fr/it/en gleich (`:158`, `:227`, `:296`).

**Warum falsch:**
- Hat das PDF nur gewichtete Positionen (wie im Szenario: Hauswart, Heizkosten 2024 nicht in der Periode), erklärt die Erläuterung den Zeitanteil als «Ihre Mietstage in der Abrechnungsperiode». Für Lea Graf wären das 139/365 = 38.08 %.
- Gleichzeitig zeigt die Position 34.06 %, und die Zeilen zeigen «0/91 Tage» und «47/92 Tage», also gerade nicht die Abrechnungsperiode.
- Ein Laie hat zwei Erklärungen mit zwei Ergebnissen vor sich. Anforderungen Zeile 39 verlangt einen «nachvollziehbar» ausgewiesenen Anteil.
- Ausserdem steht nirgends, dass «Ihr Anteil» = Wohnungsanteil × Klammer / Kosten Liegenschaft ist (306.52) und nicht Wohnungsanteil × 34.06 % (306.54) (V-4).

**Behebung:**
- `otherDays` auch bei `item.invoiceParts` setzen. Der vorhandene Zusatz passt auf jede Zeile («bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode»).
- Dazu ein Satz, nur wenn eine Position Rechnungszeilen hat. Vorschlag:
  - de: «; bei Rechnungen über verschiedene Tage nach ihren Beträgen gewichtet (Berechnung unter der Abrechnungsposition; Ihr Anteil ist der Wohnungsanteil mal diese Berechnung, der Prozentwert ist gerundet)»
  - fr: « ; pour des factures sur des jours différents, pondérée selon leurs montants (calcul sous la position ; votre part est la part du logement multipliée par ce calcul, le pourcentage est arrondi) »
  - it: «; per fatture su giorni diversi, ponderata secondo i loro importi (calcolo sotto la posizione; la sua quota è la quota appartamento moltiplicata per questo calcolo, la percentuale è arrotondata)»
  - en: «; for invoices over different days, weighted by their amounts (calculation below the position; your share is the apartment share times this calculation, the percentage is rounded)»
  - Begriffe und Typografie (fr: Leerzeichen U+00A0) nach `docs/design/i18n-begriffe.md` prüfen.
- Die Erwartung `not.toContain('Ihre Mietstage darin')` in `statement-pdf.pg.test.ts:216` umkehren, sodass sie zuerst rot ist.

### V-10 (Minor): Veränderung des Tankbestands erscheint als Rechnungszeile

**Beleg:**
- `fuel-stock.service.ts:82-99`: Die Veränderung des Tankbestands kommt als zusätzliche «Rechnung» der Heizkosten-Kategorie in die Gruppe, mit `inPeriod: { start: periodStart, end: periodEnd, amount: opening − closing }`.
- `calculation.service.ts:156-162` übernimmt jede Rechnung der Gruppe in `invoiceParts`, ohne `isFuelStock` zu unterscheiden.
- Das geschieht, wenn eine Heizkosten-Position nach Tagen geteilt wird (Abrechnungslauf ohne Heizprofil, oder Monate der Periode mit 0 % im Heizprofil; `calculation.service.ts:332-342`) und die Gruppe eine Rechnung mit Leistungszeitraum enthält. Beispiel: eine periodische Revision der Heizungsanlage (Art. 5 Abs. 2 Bst. e VMWG) über einen anderen Zeitraum, dazu der Tankbestand.
- Die Zeile lautet dann etwa «01.01.2025 – 31.12.2025: −300.00, 139/365 Tage».

**Warum falsch:**
- Das Glossar definiert Rechnung als «Beleg eines Dienstleisters» (`UBIQUITOUS_LANGUAGE.md:54`). Zur Veränderung des Tankbestands gibt es keinen solchen Beleg. Massgeblich sind der Anfangs- und Endbestand (Art. 8 Abs. 2 VMWG, oben), die das PDF im Abschnitt Heizmaterial bereits ausweist.
- Bei der Belegeinsicht sucht der Mieter vergeblich eine Rechnung über diesen Betrag. Ist der Betrag negativ (Bestand gestiegen), sieht die Zeile wie eine Gutschrift aus.
- Rechnerisch ist die Zeile richtig: Der Verbrauch gehört nach Art. 5 Abs. 2 Bst. a VMWG zu den anrechenbaren Kosten.

**Behebung:**
- Die Zeile des Tankbestands beschriften, z. B. «Veränderung Tankbestand 01.01.2025 – 31.12.2025: −300.00, 139/365 Tage».
- Dazu in `InvoicePart` ein Merkmal speichern (z. B. `stock: true`) und den Text in allen vier Sprachen ergänzen.
- «Tankbestand» steht im Glossar (`:116`). Für die «Veränderung» wäre ein Begriff zu entscheiden (siehe «Fehlende Begriffe»).
- Ein Test (pg) mit Tankbestand und einer Heizkosten-Rechnung mit Leistungszeitraum ohne Heizprofil.
- Wenn das nicht in #226 gehört: als Issue erfassen (Label `fachlich`), mit Verweis auf #236, das dieselbe Zuordnung zum Beleg behandelt.

### V-11 (Nit): «Rechnung» für die Formel

**Beleg:**
- Anforderungen Zeile 145: «… und die Rechnung, die den Anteil nach den Beträgen gewichtet …».
- `statement-detail.feature:259-260`: «das PDF nennt jede Rechnung mit ihren Tagen und die Rechnung, die den Zeitanteil ergibt».

**Warum falsch:** «Rechnung» ist ein Begriff im Glossar (Beleg). Im selben Satz meint er einmal den Beleg, einmal die Formel.

**Behebung:** «die Berechnung, die …». «Berechnung» wird im Glossar als Wort schon so verwendet (`UBIQUITOUS_LANGUAGE.md:106-107`, Spalte «Berechnung»).

### V-12 (Nit): Testlücken

**Beleg:**
- Rechnung ohne Leistungszeitraum in einer gemischten Position: kein Test (V-7, letzter Punkt). Sie erscheint als Zeile über die ganze Periode (`invoice.service.ts:426`); das ist richtig.
- `statement-pdf.pg.test.ts:254-270` prüft «92/92 Tage», aber nicht, dass keine Rechnungszeile («/30 Tage») gedruckt wird.

**Behebung:** In den bestehenden Tests je eine Erwartung ergänzen. Das Verhalten ist richtig; es geht nur um den Schutz vor Regressionen.

## Fehlende Begriffe

- «Zeitanteil»: offen in #75 (entschieden, Option A). Kein neues Issue.
- Nur falls V-10 umgesetzt wird: **Veränderung Tankbestand**, Vorschlag: «Anfangsbestand minus Endbestand des Tankbestands einer Abrechnungsperiode; zählt in der Nebenkostenabrechnung wie eine Rechnung der Heizkosten über die ganze Periode.» fr «variation du stock de combustible», it «variazione della scorta di combustibile», en «change in fuel stock» (gegen `docs/design/i18n-begriffe.md` prüfen). Issue mit den Labels `fachlich` und `entscheiden`. Der Code nennt sie schon so (`description: 'Veränderung Tankbestand'`, `fuel-stock.service.ts:85`).
- «Berechnung» (V-11) ist ein gewöhnliches Wort, kein Fachbegriff. Kein Issue.

## Nicht bestätigt

- **E2E-Lauf:** Ob das Szenario `statement-detail.feature:261-274` grün ist, habe ich nicht geprüft; laut Plan ist der Punkt «Checks» noch offen. Die Grundlage (`:8-29`) enthält für 2025 keine weitere Hauswart-Rechnung in «Lindenhof». Demo-Daten im E2E-Stack habe ich nicht geprüft.
- **V-10 im Lauf:** Den Fall habe ich nur aus dem Code abgeleitet und nicht mit einer Datenbank durchgespielt. Offen ist auch, ob eine Rechnung wie eine Revision mit Leistungszeitraum in der Praxis in derselben Kategorie wie das Heizöl liegt; das hängt von der Kategorisierung ab.
- **Rechtliche Pflicht zur Gewichtung nach Betrag:** Wie in Runde 1 auf Fedlex nicht gefunden (OR Art. 257a, 257b; VMWG Art. 4, 5, 8). Die Gewichtung folgt aus der Periodengerechtigkeit (Anforderungen Zeile 30). **unsicher.**
- **Texte fr/it/en in V-9:** Die Vorschläge habe ich nicht gegen `docs/design/i18n-begriffe.md` geprüft.
- **Fliesskomma bei Summe null:** `group.totalAmount === 0` (`calculation.service.ts:133`, `:155`) vergleicht eine Fliesskomma-Summe. Bei Beträgen wie 0.10 + 0.20 − 0.30 ist sie nicht genau null. Dann würden Zeilen mit einem extremen Prozentwert gedruckt. Das bestand schon vorher (`rentalShare`), betrifft aber #237 und gehört dort hin; nicht mit Daten nachgestellt.
