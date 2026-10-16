# Fach-Review Workflow 1: @wip-Szenarien #96 und #104 (Commit 00a419d)

Gegenstand: `git diff 00a419d~1 00a419d` (statement-detail.feature Z. 385–450, invoice-detail.feature Z. 68–77) und die vorgeschlagenen Texte aus dem Auftrag. Worktree: `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/review-s1-fach`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Hinweistexte für versendete Abrechnungen kennen nur die Nachforderung; mit #96 zählen auch gelöschte und gesenkte Rechnungen, also Rückerstattungen an den Mieter |
| V-1 | Verwalter | Major | Die «Veränderung Tankbestand» ist Teil der Heizkosten-Position, aber keine Rechnung: Verknüpfung, Links, Teilzeilen und Hinweis berücksichtigen sie nicht |
| V-2 | Verwalter | Minor | Titel «Abrechnung nicht mehr aktuell» verspricht mehr, als geprüft wird (nur Rechnungen) |
| V-3 | Verwalter | Minor | Bei einer geänderten Rechnung stehen «Rechnung schon abgerechnet» und «Nicht in den Abrechnungen» gleichzeitig da; Titel und Folgetext («dann ist sie dabei») passen nicht |
| V-4 | Verwalter | Minor | Hinweis zählt auch Änderungen, die den Betrag des Mieters nicht ändern (Rechnung ohne Mietstage), und verlangt dann bei versendeten Abrechnungen eine Berichtigung |
| V-5 | Verwalter | Minor | Spalte «Anteil» (%) neben «Wohnungsanteil» und «Zeitanteil»: drei «Anteile», das PDF hat diese Spalte nicht |
| V-6 | Verwalter | Minor | «Ihr Mietverhältnis …» / «Ihre Nebenkosten» auf der Seite des Vermieters (entschieden in #104; zur Bestätigung) |
| V-7 | Verwalter | Minor | «Ihre Nebenkosten» (mit Verwaltungspauschale) neben dem Glossarbegriff «Eigene Nebenkosten» (= Zwischensumme, ohne); kein Glossarbegriff für die Summe mit Pauschale; Szenario prüft nur das Label |
| V-8 | Verwalter | Minor | Rechnungslinks nur mit der Beschreibung benannt; Beschreibungen wiederholen sich |
| V-9 | Verwalter | Minor | Hinweis nennt nur eine Zahl, nicht welche Rechnungen |
| M-2 | Mietrecht | Minor | Nachträglich nicht umlagefähig gemachte Rechnung: Rechnungsseite warnt heute gar nicht (`isValidUtilityCost === false` → keine Warnung); Fall ohne Test/Szenario |
| V-10 | Verwalter | Nit | «Mietverhältnis» kein Glossarbegriff; Detailseite lässt «von 366 Tagen» weg |
| V-11 | Verwalter | Nit | Szenarien sagen «Kostenposition»/«Position», Glossar «Abrechnungsposition» |
| V-12 | Verwalter | Nit | Nur `partLine` im Szenario; Detailseite braucht alle Teilzeilen-Varianten des PDFs |
| V-13 | Verwalter | Nit | PRD Z. 540 beschreibt noch den Zeitstempel-Hinweis |

Bestätigt (keine Befunde): Rechenwerte der drei Szenarien (siehe «Nachgerechnet»), Zeitanteil-Format «91/366 Tage» = PDF `days`, Teilzeilen- und «Ihr Anteil»-Format = PDF `partLine`/`partShare`, «Ihr Mietverhältnis in dieser Periode: … – …» = PDF `tenancyLine` (ohne Klammer), «Ihre Nebenkosten» = PDF `yourCosts` = `totalCosts` (heute «Gesamtkosten», gleicher Betrag), «Wohnungsanteil» und «Zeitanteil» gemäss Glossar Z. 124 und 160, Links zu den Rechnungen unterstützen die Belegeinsicht (Art. 257b Abs. 2 OR), Zählregel «geänderte Rechnung zählt wie neue» gemäss #96.

## Nachgerechnet

- Szenario «Wohnungsanteil und Zeitanteil»: Lindenhof hat nur 3.01 (Grundlage) → Wohnungsanteil 732.00. Rechnung ohne Leistungszeitraum → abgerechnete Tage = 366 (2024 Schaltjahr). Eva Frei 01.01.–31.03.2024 = 31 + 29 + 31 = 91 Tage. 732.00 × 91/366 = 182.00 (732/366 = 2 genau). Bestätigt.
- Szenario «verschiedene Leistungszeiträume»: 3.01 und 3.02 je 70 m² (`seed.apartment` Standard `area = '70'`, tests/e2e/fixtures/backend.ts:121) → Wohnungsanteil 900.00 von 1'800.00. 01.04.–30.06.2025 = 30 + 31 + 30 = 91 Tage, Lea Graf ab 15.08.2025 → 0 Mietstage (Randfall null). 01.07.–30.09.2025 = 31 + 31 + 30 = 92 Tage, Mietstage 17 (15.–31.08.) + 30 = 47. 900 × (600 × 0/91 + 1200 × 47/92) / 1800 = 900 × 613.0435 / 1800 = 306.5217 → 306.52. Bestätigt; entspricht `rentalShare` (calculation.service.ts:136–143): Mieteranteil = Wohnungsanteil × Σ(Betrag × Tage/Gesamttage) / Kosten.
- Grundlage-Heizkosten (1000, 2024) liegen nicht in der Periode 2025: Szenario 3 hat keine Heizposition. Bestätigt.
- Szenario «Mietverhältnis in der Periode»: Vertrag Eva Frei 2024-01-01 bis 2024-03-31 (Grundlage Z. 28) → «01.01.2024 – 31.03.2024». Bestätigt.
- Hinweis-Szenarien: neue Rechnung nach der Abrechnung → 1; Betrag 732 → 800 → 1; unverändert → kein Hinweis. Entspricht #96 «Decided».

## Befunde

### M-1 (Mietrecht, Major): Versendete Abrechnung kennt nur die Nachforderung

**Beleg:** `messages/de.json:980` (`statements_later_sent`): «… Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. Ob Sie die Kosten noch nachverlangen können, ist nicht in jedem Fall sicher …»; gleich `invoices_missed_text` (Z. 754). Der Vorschlag lässt diese Sätze unverändert, zählt aber neu auch «gelöscht», «nicht mehr umlagefähig», «Leistungszeitraum aus der Periode verschoben» und gesenkte Beträge.

Art. 257b Abs. 1 OR (Fedlex, Fassung 1.10.2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»

Art. 62 Abs. 1 OR (Fedlex): «Wer in ungerechtfertigter Weise aus dem Vermögen eines andern bereichert worden ist, hat die Bereicherung zurückzuerstatten.»

**Warum falsch:** Fällt eine abgerechnete Rechnung weg oder sinkt sie, hat die versendete Abrechnung mehr als die tatsächlichen Aufwendungen verlangt. Der Text spricht dann nur vom Nachverlangen und lässt offen, dass der Mieter zu viel bezahlt hat oder zu viel bezahlen soll. Für einen unerfahrenen Vermieter liest sich das so, als müsse er nur handeln, wenn er mehr verlangen will.

**Korrektur:** Den Text für versendete Abrechnungen in beide Richtungen fassen, z. B. «Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello: Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. Ist der Betrag zu hoch, erstatten Sie ihm die Differenz zurück. Ob Sie zusätzliche Kosten noch nachverlangen können, ist nicht in jedem Fall sicher: Lassen Sie sich im Zweifel beraten.» Gilt für `statements_later_sent` und `invoices_missed_text`. Ein Szenario oder ein Unit-Test für den Fall «gelöschte Rechnung, versendete Abrechnung». Ob die Rückforderung des Mieters vertraglich (Saldo) oder aus Bereicherung (Art. 62 ff. OR) begründet ist, ist **unsicher** (docs/nebenkostenabrechnung-anforderungen.md Z. 78, 160); die Rückzahlungspflicht selbst folgt aus Art. 257b Abs. 1 OR.

### V-1 (Verwalter, Major): Veränderung Tankbestand in der Position

**Beleg:** `backend/src/services/fuel-stock.service.ts:72–99`: Die Veränderung Tankbestand geht als zusätzlicher Posten (`id: 'fuel-stock-<Periodenende>'`, `description: 'Veränderung Tankbestand'`) in die Gruppe der Heizkosten (calculation.service.ts:300) und als Teilzeile `partStock` ins PDF (pdf.service.ts:79, 685). Glossar Z. 138: Die Veränderung Tankbestand zählt zusammen mit den Lieferungen zu den Heizkosten (Art. 5 Abs. 2 lit. a VMWG). Art. 5 Abs. 2 VMWG (Fedlex): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden; …»

**Warum falsch:** #96 und der Plan sprechen nur von «invoice ids». Die Heizposition eines Gebäudes mit Tank enthält aber einen Betrag, der keine Rechnung ist:
- Die Summe der verlinkten Rechnungen ergibt dann nicht die «Kosten des Gebäudes» der Position. Der Vermieter kann die Position nicht nachvollziehen, obwohl das PDF die Zeile zeigt.
- Ein nachträglich geänderter Anfangs- oder Endbestand ändert die Heizkosten, aber der Hinweis zählt ihn nicht («nicht mehr aktuell» bleibt aus).
- Eine Verknüpfungstabelle mit Fremdschlüssel auf `invoices` kann `fuel-stock-…` nicht speichern.

**Korrektur:** In #96 festhalten, dass eine Abrechnungsposition ihre Rechnungen und gegebenenfalls die Veränderung Tankbestand (Betrag, Stichtage) speichert. Auf der Detailseite steht die Veränderung Tankbestand ohne Link mit dem Text `partStock` wie im PDF. Ein geänderter Tankbestand zählt im Hinweis wie eine geänderte Rechnung (dann passt der Text «Rechnung … geändert» nicht, siehe V-2) oder wird ausdrücklich ausgeschlossen und als offene Arbeit erfasst (#132 betrifft dieselbe Frage). Mindestens ein Test mit Tankbestand.

### V-2 (Verwalter, Minor): Titel «Abrechnung nicht mehr aktuell»

**Beleg:** Vorschlag Titel; geprüft werden nur die Rechnungen der Periode (#96 «Decided»).

**Warum falsch:** Eine Abrechnung wird auch durch andere Änderungen falsch: Fläche der Wohnung, Formel eines Verteilschlüssels, Tankbestand (V-1). Die Vertragsdaten sind ausgenommen, weil das Backend Änderungen ablehnt, die abgerechnete Tage verschieben (docs/anforderungen-vertragsende.md Z. 86). Diese Fälle prüft der Hinweis nicht. Der Titel sagt «nicht mehr aktuell», wenn eine Rechnung sich änderte. Fehlt der Hinweis, schliesst der Vermieter, die Abrechnung sei aktuell, obwohl der Hinweis das nicht geprüft hat.

**Korrektur:** Einen Titel wählen, der sagt, was geprüft wird, z. B. «Rechnungen seit der Abrechnung geändert». Der Satz «… wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht» ist fachlich richtig und verständlich; «gelöscht» deckt «nicht mehr umlagefähig» und «Leistungszeitraum verschoben» nicht wörtlich ab, «geändert» aber schon. Kann so bleiben.

### V-3 (Verwalter, Minor): Zwei widersprüchliche Warnungen an der geänderten Rechnung

**Beleg:** invoice-detail.feature Z. 68–77; Vorschlag: «Rechnung schon abgerechnet» bleibt für Abrechnungen, die die Rechnung in irgendeinem Stand enthalten. Für die geänderte Rechnung erscheinen damit `invoices_billed_title` «Rechnung schon abgerechnet» und `invoices_missed_title` «Nicht in den Abrechnungen» zusammen. `invoices_missed_text` (de.json:754): «… erstellen Sie die Abrechnungen erneut, dann ist sie dabei.»

**Warum falsch:** «Nicht in den Abrechnungen» widerspricht «schon abgerechnet» über derselben Rechnung. «dann ist sie dabei» passt nur zur fehlenden Rechnung, nicht zur geänderten.

**Korrektur:** Titel ändern, z. B. «Abrechnungen nicht aktuell» (hier zutreffend, weil es nur um diese Rechnung geht). Folgetext: «… erstellen Sie die Abrechnungen erneut, dann rechnen sie die Rechnung so ab, wie sie jetzt ist.» Der vorgeschlagene Periodensatz «… gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon» ist richtig; verständlicher wäre «… oder mit ihren Angaben vor der letzten Änderung». Das Szenario sollte auch prüfen, ob «Rechnung schon abgerechnet» erscheint oder nicht, damit die Kombination festgelegt ist. Hilfreich für die Berichtigung: den abgerechneten Betrag nennen («abgerechnet mit CHF 450.00»). Die Verknüpfung speichert ihn ja.

### V-4 (Verwalter, Minor): Zählung ohne Auswirkung auf den Mieter

**Beleg:** Szenario Z. 410–411: Die Rechnung 01.04.–30.06.2025 hat für Lea Graf 0 Mietstage. Der Mieteranteil hängt nur von den Rechnungen mit Mietstagen ab: Wohnungsanteil × Σ(Betrag × Mietstage/Tage) / Kosten = Schlüsselanteil × Σ(Betrag × Mietstage/Tage), calculation.service.ts:136–143, 356. Gegenrechnung: Rechnung 600 → 900 ändert 306.52 nicht (0/91). Bei Heizkosten nach Heizprofil ändert dagegen jede Rechnung den Betrag.

**Warum falsch:** Nach dem Vorschlag zählt eine solche Rechnung. Bei einer versendeten Abrechnung sagt der Text dann «Schicken Sie dem Mieter eine berichtigte Abrechnung», obwohl sich nur «Kosten des Gebäudes» und «Wohnungsanteil» ändern, nicht der Betrag des Mieters. In der Praxis verschickt ein Verwalter dafür keine Berichtigung.

**Korrektur:** Entweder nur Rechnungen zählen, deren Tage Mietstage des Vertrags enthalten oder die nach Heizprofil verteilt werden. Oder den Hinweis zweistufig fassen («ändert Ihren Betrag» / «ändert nur die Kosten des Gebäudes»). Das berührt die Entscheidung in #96 («counts like a new one») nicht, aber den Umfang «invoices of the period». Deshalb: Produktentscheid, Issue mit `fachlich`, `entscheiden`.

### V-5 (Verwalter, Minor): Spalte «Anteil» neben Wohnungsanteil und Zeitanteil

**Beleg:** CostTable.svelte:25, `statements_share` «Anteil» = `tenantShare / totalBuildingAmount` (statement.service.ts:358), in Szenario 2 also 182.00/732.00 = 24.86 %. Das PDF hat statt dessen den Bruch des Verteilschlüssels unter dem Schlüssel (`keyShare`, pdf.service.ts:352, 635) und keine Prozentspalte.

**Warum falsch:** «Wohnungsanteil CHF 732.00 | Zeitanteil 91/366 Tage | Anteil 24.86 % | Betrag CHF 182.00»: Ein Laie kann «Anteil» nicht vom Wohnungs- und Zeitanteil unterscheiden und findet den Wert nicht im PDF. Das widerspricht dem Ziel von #104 (gleiche Angaben wie das PDF).

**Korrektur:** «Anteil» (%) streichen und wie im PDF den Bruch des Verteilschlüssels unter dem Verteilschlüssel zeigen («70 / 140 m²»). Wenn die Prozentspalte bleiben soll, eindeutig benennen: «Anteil an den Kosten des Gebäudes». Begriff fehlt im Glossar (siehe «Fehlende Begriffe»).

### V-6 (Verwalter, Minor): Mieteranrede auf der Seite des Vermieters

**Beleg:** #104 «Decided»: «Ihr Mietverhältnis in dieser Periode», «Ihre Nebenkosten». Die Seite ist für den Liegenschaftsverwalter; die App spricht ihn sonst mit «Sie» als Vermieter an (z. B. «Löschen Sie ihn …» im selben Hinweis). Die Liste zeigt seit #288 «01.07.2025 – 31.12.2025, 184 Mietstage» ohne «Ihr».

**Warum problematisch:** Auf derselben Seite meint «Sie» den Vermieter («Löschen Sie ihn») und «Ihre Nebenkosten» den Mieter. Der Vermieter trägt selbst Nebenkosten (Leerstand April in Lindenhof, Grundlage Z. 31), «Ihre Nebenkosten» kann er als seine lesen.

**Korrektur (Produktentscheid, entschieden in #104):** Entweder dabei bleiben und den Block als Ansicht des Mieters kennzeichnen (z. B. Zwischentitel «So steht es in der Abrechnung an den Mieter»), oder auf der Seite «Nebenkosten des Mieters» / «Mietverhältnis in der Abrechnungsperiode» zeigen und nur im PDF «Ihr/Ihre». Wenn das gewünscht ist: Rückfrage an den Product Owner. Sonst kein Handlungsbedarf.

### V-7 (Verwalter, Minor): «Ihre Nebenkosten» und «Eigene Nebenkosten»

**Beleg:** Glossar Z. 153: «Eigene Nebenkosten: Summe der Mieteranteile …, vor der Verwaltungspauschale. Auf der Abrechnung: „Zwischensumme“.» «Ihre Nebenkosten» im PDF = `totalCosts` inkl. Verwaltungspauschale (pdf.service.ts:657). Szenario Z. 400: «heisst die Summe der Kosten der Abrechnung "Ihre Nebenkosten"».

**Warum problematisch:** «Eigene» und «Ihre» Nebenkosten klingen gleich, meinen aber zwei verschiedene Summen. Das Glossar hat keinen Begriff für die Summe mit Pauschale (in der Definition «Saldo» heisst sie «Kostenanteil inklusive Verwaltungspauschale»). «Summe der Kosten» im Szenario könnte auch die Zwischensumme meinen, und das Szenario prüft keinen Betrag.

**Korrektur:** Glossarbegriff vorschlagen (siehe unten). Im Szenario den Betrag mitprüfen, z. B. «heisst die Summe mit Verwaltungspauschale "Ihre Nebenkosten" und beträgt "CHF …"».

### V-8 (Verwalter, Minor): Linkname der Rechnung

**Beleg:** Vorschlag: Links «named by the invoice description»; Szenario Z. 410, 418 «Hauswart 2025-07-05». Beschreibungen kommen vom Vermieter oder von der KI und wiederholen sich (Grundlage invoice-detail: «Treppenhausreinigung Q1» jedes Jahr, mehrere Quartalsrechnungen «Hauswart»).

**Warum problematisch:** Gleich benannte Links unter einer Position sind nicht unterscheidbar (auch für Screenreader).

**Korrektur:** Den Link nach Rechnungssteller und Rechnungsdatum benennen, mit Betrag, z. B. «Hauswart Huber, 05.07.2025, CHF 600.00», oder die Beschreibung um Datum und Betrag ergänzen.

### V-9 (Verwalter, Minor): Hinweis nennt keine Rechnungen

**Beleg:** `statements_later_one/_many`: nur eine Zahl.

**Warum problematisch:** Bei einer versendeten Abrechnung muss der Vermieter die berichtigte Abrechnung ausserhalb von Dwello erstellen. Dafür muss er wissen, welche Rechnung neu, geändert oder gelöscht ist. Mit der gespeicherten Verknüpfung ist das jetzt möglich.

**Korrektur:** Unter dem Satz die gezählten Rechnungen auflisten (Link; bei gelöschten Name und abgerechneter Betrag ohne Link). Kann als eigenes Issue folgen.

### M-2 (Mietrecht, Minor): Nachträglich nicht umlagefähige Rechnung

**Beleg:** `src/lib/server/invoice.ts:115`: `if (invoice.isValidUtilityCost === false) return { billedIn: [], missedIn: [] };`. Art. 257a Abs. 2 OR (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»

**Warum problematisch:** Wird eine abgerechnete Rechnung nicht umlagefähig gemacht, hat die Abrechnung dem Mieter Kosten belastet, die er nicht schuldet. Die Rechnungsseite warnt heute dann gar nicht. Der Vorschlag («hält die Rechnung in irgendeinem Stand») deckt den Fall ab, aber nur, wenn diese Abkürzung entfällt.

**Korrektur:** Unit- oder pg-Test: abgerechnete Rechnung → nicht umlagefähig → «Rechnung schon abgerechnet» und der Hinweis an der Abrechnung erscheinen.

### V-10 (Nit): «Mietverhältnis» und «von … Tagen»

Glossar kennt «Mietvertrag», «Mietstage», nicht «Mietverhältnis» (nur in der Definition von «Vertragsbeginn», Z. 36). Das PDF zeigt «(91 Mietstage von 366 Tagen)» (pdf.service.ts:84), die Detailseite nur «91 Mietstage». Vorschlag: eine Zeile wie in der Liste, «01.01.2024 – 31.03.2024, 91 Mietstage von 366 Tagen», damit der Zeitanteil «91/366 Tage» nachvollziehbar ist.

### V-11 (Nit): «Kostenposition»

Szenariotitel Z. 395, 403, 413 und Steps «die Position» statt «Abrechnungsposition» (Glossar Z. 151; das PDF sagt in `sharesNoteParts` «Abrechnungsposition»). Die Feature-Beschreibung (Z. 5) sagt schon «Kostenpositionen». In den Szenarien den Glossarbegriff verwenden.

### V-12 (Nit): Varianten der Teilzeilen

Das Szenario deckt nur `partLine` ab. Die Detailseite muss wie das PDF auch `partNoPeriod`, `partBeyond` (Rechnung über die Periode hinaus, mit Gesamtbetrag) und `partStock` (V-1) zeigen. Sonst stimmt die Summe unter der Position nicht mit der Rechnung überein. Ein Unit- oder DOM-Test je Variante genügt.

### V-13 (Nit): PRD

`docs/PRD-Dwello.md:540`: «a draft names invoices recorded after it was created». Mit #96 nachführen: «… names invoices of the period that are new, changed or no longer billed since it was created».

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

1. **Kostenanteil** (oder «Nebenkosten des Mieters»): «Eigene Nebenkosten plus Verwaltungspauschale; im PDF und auf der Abrechnungsdetailseite «Ihre Nebenkosten». Davon werden die geleisteten Akontobeiträge abgezogen.» Code: `total_costs`. Grenzt «Ihre Nebenkosten» von «Eigene Nebenkosten» (Zwischensumme) ab.
2. **Mietverhältnis in der Abrechnungsperiode**: «Die Tage vom Vertragsbeginn bis zum Vertragsende, soweit sie in der Abrechnungsperiode liegen; im PDF «Ihr Mietverhältnis in dieser Periode». Ihre Anzahl sind die Mietstage.» Code: `rental_start`, `rental_end`.
3. **Abgerechnete Rechnungen (einer Abrechnungsposition)**: «Die Rechnungen und gegebenenfalls die Veränderung Tankbestand, die eine Abrechnungsposition abrechnet, mit Betrag und abgerechneten Tagen zum Zeitpunkt der Abrechnung. Grundlage für den Hinweis auf geänderte Rechnungen und für «Rechnung schon abgerechnet».» Code: neue Verknüpfung (#96).
4. Falls die Prozentspalte bleibt (V-5): **Anteil an den Kosten des Gebäudes**: «Mieteranteil geteilt durch die Kosten des Gebäudes einer Abrechnungsposition, in Prozent.» Code: `share_percentage`.

## Nicht bestätigt

- **Welcher Betrag gespeichert wird:** «billed amounts» in #96. Fachlich richtig ist der Betrag in der Periode (`inPeriod.amount`, nach einer Gutschrift und nur der Teil im Leistungszeitraum innerhalb der Periode), nicht der Rechnungsbetrag. Ob eine Änderung von `deductedAmount` (schema.ts:283, Beleg-Auswertung #233) den abgerechneten Betrag ändert, habe ich nicht geprüft (gesucht: calculation.service.ts, schema.ts).
- **Rechtsgrundlage der Rückforderung des Mieters** (vertraglicher Saldo oder Art. 62 ff. OR): **unsicher**, siehe docs/nebenkostenabrechnung-anforderungen.md Z. 78 und 160. Die Fedlex-Wortlaute von Art. 62, 63 und 67 OR habe ich gelesen, aber keine Rechtsprechung zur Abgrenzung.
- **Ob «Ihre Nebenkosten» auf der Vermieterseite missverständlich ist** (V-6), ist eine Einschätzung aus der Praxis. Gestützt ist sie nur durch die Anrede im selben Hinweis, nicht durch eine Quelle.
- **docs/anforderungen-vertragsende.md:** nur nach «Abrechnung» und «Mietstage» durchsucht, nicht vollständig gelesen. Relevant: Z. 86 (Vertragsdaten, die abgerechnete Tage ändern, lehnt das Backend ab; in V-2 berücksichtigt) und A-11 / #120 (versendete Abrechnung korrigieren; M-1 sollte zu #120 passen).
- **Fedlex:** OR in der Fassung vom 1.10.2026, VMWG in der Fassung vom 1.10.2025 (Dateien über den SPARQL-Endpunkt von fedlex.data.admin.ch geladen). Zitiert: Art. 257a, 257b, 62 OR; Art. 5 Abs. 2 lit. a VMWG. Art. 8 VMWG geprüft: keine Vorgabe zur Detailseite.
- **Steps** «kostet danach», «nennt die Position …», «meldet die Abrechnung keine geänderten Rechnungen» existieren noch nicht (erwartet in Workflow 1). Ob sie die Texte genau prüfen, kann ich erst nach der Umsetzung beurteilen.
