# Fachreview Glossar #243, Runde 1

Gegenstand: `git diff 047d704~1 047d704 -- UBIQUITOUS_LANGUAGE.md` (Worktree `review-g243-fach`, detached bei 047d704). Anforderung: Issue #243, Abschnitt «Decided (product owner)». Geprüft wird nur, ob der Wortlaut die Entscheide richtig wiedergibt, nicht die Entscheide selbst. Die neuen Einträge übernehmen den Wortlaut aus #243 wörtlich. Die Befunde betreffen deshalb Stellen, an denen dieser Wortlaut vom Code oder von anderen Glossareinträgen abweicht.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | «Anteil nach Heizprofil»: angebrochene Monate zählen im Code nach Tagen, der Eintrag rechnet mit ganzen Monatsanteilen; «gerundete Monatsanteile» widerspricht «Monatsanteil» |
| V-2 | Verwalter | Major (schon auf dem Basis-Commit) | «Saldo» / «Rundung auf 5 Rappen»: «nur zugunsten des Mieters» ist nicht umgesetzt (#79 offen, Code rundet kaufmännisch), ohne «geplant (#79)»; die neuen Sätze bauen darauf auf |
| V-3 | Verwalter | Minor | «Abgerechnete Tage» gilt je Rechnung, `billed_days` und «Mietstage der Position» je Abrechnungsposition; bei Rechnungen über verschiedene Tage gibt es keine abgerechneten Tage der Position |
| V-4 | Verwalter | Minor | «Zeitanteil»: gewichtet wird mit den Beträgen in der Abrechnungsperiode, nicht mit den Rechnungsbeträgen |
| V-5 | Verwalter | Minor | «Hinweis auf fehlende Abrechnungen»: Der Teil «oder seit ‹abgerechnet bis›» ist geplant (#133), aber nicht so markiert |
| V-6 | Verwalter | Minor | «Zeitanteil»: Heizkosten mit Heizprofil werden nicht immer nach dem Heizprofil verteilt (Sommerperiode: nach Tagen) |
| V-7 | Verwalter | Nit | Spalte Code bei «Anteil nach Heizprofil»: `heating_share` ist ein JSON-Feld der Abrechnung; an der Position steht der Wert in `period_share` |
| V-8 | Verwalter | Nit | «Mietzeit» ist kein Glossarbegriff; das PDF sagt «Monate Ihres Mietverhältnisses» |
| V-9 | Verwalter | Nit | «Mietstage der Position»: «Mietstage» ist eine Anzahl; «die Mietstage, die … fallen» passt nicht dazu |
| V-10 | Verwalter | Nit | «Rundung auf 5 Rappen»: «vom Betrag aus gesehen» ist ohne Regel und Beispiel nicht nachvollziehbar |
| V-11 | Verwalter | Nit | «Hinweis auf fehlende Abrechnungen»: «Warnung, welche …» lässt sich als Relativsatz lesen |
| V-12 | Verwalter | Nit | «Monatsanteil»: Dwello lässt ±0.1 Prozentpunkte Abweichung von 100 % zu |

Keine Befunde im Bereich Mietrecht (M) und keine im Bereich Rechtstexte (R): Der Gegenstand ist kein Rechtstext.

---

## Befunde im Einzelnen

### V-1 (Major) Anteil nach Heizprofil: angebrochene Monate und «gerundete Monatsanteile»

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:133`: Monatsanteil = «Prozent eines Monats im Heizprofil», Schema `january_pct` … `december_pct`. Diese Felder sind `decimal(5,2)` (`backend/src/db/schema.ts:213-224`), haben also schon zwei Stellen.
- `UBIQUITOUS_LANGUAGE.md:134`: «Summe der Monatsanteile der Mietzeit geteilt durch die Summe der Monatsanteile der Abrechnungsperiode (aus den gerundeten Monatsanteilen: geplant, #232).»
- `backend/src/services/heating-profile.service.ts:365-369`: `proratedPct = (monthPct * daysInPeriod) / daysInMonth`. Ein angebrochener Monat zählt nur mit dem Anteil seiner Tage. `prorating.service.ts:213-217`: Mieter-Summe / Perioden-Summe × 100.
- #232 («Problem») meint mit «gerundet» genau diese Tagesanteile der angebrochenen Monate, die das PDF auf zwei Stellen gerundet druckt (Einzug am 05.01.: 47.68 / 50.00). `calculation.service.ts:432` rundet die `months` auf zwei Stellen, und das PDF druckt sie als «Anteile der Monate Ihres Mietverhältnisses» (`pdf.service.ts:67`, `699`).

**Nachgerechnet** (Beispielprofil Jan 20, Feb 18, Mär 15, Apr 10, Mai 5, Jun–Sep 0, Okt 7, Nov 12, Dez 13 = 100 %; Periode 01.01.–31.12.2025):
- Auszug am 15.03. Code: 20 + 18 + 15 × 15/31 = 45.2581 → 45.26 %, bei CHF 1000.00 Wohnungsanteil also CHF 452.58. Nach dem Glossar zählt der März entweder ganz (53 %, CHF 530.00) oder gar nicht (38 %, CHF 380.00). Keines von beiden ist richtig.
- Einzug am 01.07. (Monatsgrenze): Code und Glossar ergeben beide 7 + 12 + 13 = 32 %.
- Grenzfall Mietzeit 01.06.–31.08.: Code und Glossar ergeben beide 0 %.

**Warum falsch.** Ein Heizprofil wirkt nur bei Ein- oder Auszug (`prorating.service.ts:208`). Wechselt der Mieter mitten im Monat (vorzeitige Rückgabe, Ersatzmieter), kommt mit der Definition ein anderer Betrag heraus als in der Abrechnung. Ausserdem sind die Monatsanteile nach Zeile 133 schon zweistellig gespeichert. «Aus den gerundeten Monatsanteilen» sagt nach dieser Definition also nichts aus. Gerundet werden die Tagesanteile der angebrochenen Monate.

**Behebung** (Wortlaut für den Product Owner, Issue mit den Labels `fachlich` und `entscheiden`): «Summe der Monatsanteile über die Mietstage geteilt durch die Summe der Monatsanteile über die Abrechnungsperiode; ein angebrochener Monat zählt mit dem Teil seiner Tage (Monatsanteil × Tage / Tage des Monats). Gerechnet aus diesen Monatswerten, auf zwei Stellen gerundet wie im PDF: geplant, #232.»

### V-2 (Major, schon auf dem Basis-Commit) Saldo und Rundung: «zugunsten des Mieters» ist nicht umgesetzt

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:156-157`: «gerundet auf 5 Rappen zugunsten des Mieters» und «Gerundet wird nur zugunsten des Mieters: eine Nachzahlung ab-, eine Rückerstattung aufgerundet.» Die Spalte Code nennt `balance` bzw. «Berechnung», ohne «geplant».
- `backend/src/services/pdf-format.ts:17-20`: `roundTo5Rappen` rundet kaufmännisch (`Math.round(|x| × 20) / 20`). `calculation.service.ts:249-250` verwendet diese Funktion für den Saldo.
- `backend/src/__tests__/statement-pdf-data.test.ts:106`, `110`: `roundTo5Rappen(791.03) = 791.05` (Nachzahlung aufgerundet) und `roundTo5Rappen(-48.97) = -48.95` (Rückerstattung abgerundet).
- `tests/e2e/features/statement-rounding.feature:16`: «Nachzahlung und Rückerstattung kaufmännisch auf 5 Rappen». `docs/nebenkostenabrechnung-anforderungen.md:148`: «kaufmännisch auf 5 Rappen gerundet, um höchstens 2 Rappen».
- Issue #79 ist offen; Option B ist dort entschieden, aber nicht umgesetzt.

**Nachgerechnet.** Saldo vor Rundung +0.03: Heute ergibt das +0.05, also Nachzahlung und Zahlteil. Nach dem Glossar ergibt es 0.00, also keine Zahlung. Saldo vor Rundung −0.01: Heute 0.00, nach dem Glossar −0.05 (Rückerstattung). Der neue Satz «Saldo 0.00: keine Zahlung, kein Zahlteil» stimmt in beiden Regeln (`pdf.service.ts:515`, `850-852`). Nur der Bereich, aus dem 0.00 entsteht, ist verschieden: heute −0.02 bis +0.02, nach #79 0.00 bis +0.04. Die Begründung von #243 («since #79 it is always ≤ 0») gilt erst, wenn #79 umgesetzt ist.

**Warum falsch.** Das Glossar beschreibt eine Rechenregel, die die App noch nicht hat, ohne sie als geplant zu markieren. Die Anforderungen und das Szenario sagen das Gegenteil. Die Glossarzeilen zeigen das schon auf 047d704~1. Nach CLAUDE.md Workflow 7 ist das deshalb offene Arbeit und kein Blocker dieser Änderung.

**Behebung.** Spalte Code von «Saldo» und «Rundung auf 5 Rappen» um «Rundung zugunsten des Mieters: geplant (#79)» ergänzen, so wie bei #232 in Zeile 134. Alternativ #79 umsetzen. Den Punkt in #79 vermerken (kein neues Issue).

### V-3 (Minor) Abgerechnete Tage: je Rechnung oder je Position

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:158` definiert die Tage, «die eine Rechnung … abrechnet», und nennt das Feld `billed_days`.
- `UBIQUITOUS_LANGUAGE.md:159` spricht von den «abgerechneten Tagen einer Abrechnungsposition».
- `backend/src/db/schema.ts:435-439`: `billed_days` und `position_rental_days` stehen in `utility_statement_line_items`, also an der Position. `calculation.service.ts:150-161`: Beide Felder werden nur gefüllt, wenn jede Rechnung der Position dieselben Tage abrechnet. Sonst sind sie `null`, und die Tage stehen je Rechnung in `invoice_parts`. Mietet der Mieter die ganze Periode, gibt es auch kein `invoice_parts`.
- Bestätigt ist die Definition je Rechnung (`invoice.service.ts:507-517`): ohne Leistungszeitraum die ganze Periode, sonst der Leistungszeitraum begrenzt auf die Periode. Ein Tankbestand zählt wie eine Rechnung ohne Leistungszeitraum (`fuel-stock.service.ts:98`).

**Warum falsch.** «Abgerechnete Tage einer Abrechnungsposition» ist nicht definiert, wenn die Rechnungen der Position verschiedene Tage abrechnen. Genau dann gilt die Gewichtung in «Zeitanteil».

**Behebung.** «Abgerechnete Tage» ergänzen: «Rechnen alle Rechnungen einer Abrechnungsposition dieselben Tage ab, sind das die abgerechneten Tage der Position (`billed_days`); sonst gelten sie je Rechnung (`invoice_parts`).» «Mietstage der Position» entsprechend: «… der abgerechneten Tage einer Rechnung oder Abrechnungsposition».

### V-4 (Minor) Zeitanteil: Gewichtung mit den Beträgen in der Periode

**Beleg.** `UBIQUITOUS_LANGUAGE.md:160`: «bei mehreren Rechnungen nach ihren Beträgen gewichtet». `calculation.service.ts:118` und `134-142` gewichten mit `inPeriod.amount`. Das ist der Teil des Rechnungsbetrags, der auf die abgerechneten Tage fällt (`invoice.service.ts:516`). `docs/nebenkostenabrechnung-anforderungen.md:145` sagt «ihrem Betrag dafür».

**Nachgerechnet** (Periode 2025, 365 Tage, Einzug am 01.07.):
- Rechnung A ohne Leistungszeitraum, CHF 1000.00: 184/365.
- Rechnung B mit Leistungszeitraum 01.10.2024–30.09.2025, CHF 1200.00: 273 Tage in der Periode, darauf entfallen CHF 897.53. Mietstage darin: 92.
- Code: (1000.00 × 184/365 + 897.53 × 92/273) / 1897.53 = 806.58 / 1897.53 = 42.51 %.
- Gewichtet mit dem Rechnungsbetrag: (504.11 + 1200 × 92/273) / 2200 = 908.51 / 2200 = 41.30 %.
- Grenzfall: Ergeben die Rechnungen zusammen 0.00 (Gutschrift), ist der Zeitanteil 0 (`calculation.service.ts:136`).

**Behebung.** «… nach ihren Beträgen für die abgerechneten Tage gewichtet».

### V-5 (Minor) Hinweis auf fehlende Abrechnungen: «abgerechnet bis» ist geplant

**Beleg.** `UBIQUITOUS_LANGUAGE.md:46`, Spalte Code «—». «Abgerechnet bis» hat in Zeile 47 den Vermerk «geplant (#133)», und #133 ist offen. `src/routes/contracts/[id]/+page.server.ts:68-85` zählt ab Vertragsbeginn und kennt kein «abgerechnet bis». Bestätigt ist: Es zählen beendete Abrechnungsperioden mit Mietstagen ohne Abrechnung, die neueste zuerst. Gezeigt werden sie auf der Seite des Mietvertrags (`MissingStatement.svelte`). Das Dashboard weicht davon ab (#211, offen).

**Behebung.** «(oder seit «Abgerechnet bis»: geplant, #133)». Zusätzlich die Schreibweise des Begriffs angleichen: grosses «A» wie in Zeile 47.

### V-6 (Minor, Wortlaut schon auf dem Basis-Commit) Zeitanteil: Heizprofil nicht in jedem Fall

**Beleg.** `UBIQUITOUS_LANGUAGE.md:160`: «Heizkosten mit Heizprofil im Abrechnungslauf: der Anteil nach Heizprofil.» `prorating.service.ts:208` und `214`: Ein Mietvertrag über die ganze Periode und eine Periode, deren Monate im Heizprofil zusammen 0 % haben, werden nach Tagen verteilt (`byDays`), samt Leistungszeitraum (`calculation.service.ts:330-352`; Anforderungen Regel 5, Zeile 145). Für die ganze Periode ergibt das dasselbe (1). Bei einer Sommerperiode mit Mieterwechsel ergibt es ein anderes Ergebnis.

**Behebung.** «Heizkosten mit Heizprofil im Abrechnungslauf bei Ein- oder Auszug: der Anteil nach Heizprofil, ausser die Monate der Abrechnungsperiode haben darin zusammen 0 % (dann nach Tagen).»

### V-7 (Nit) Spalte Code bei «Anteil nach Heizprofil»

**Beleg.** `schema.ts:336-342`, `376`: `utility_statements.heating_share` ist JSON, entweder `{ byDays: true }` oder `{ percent, months, periodPercent, names }`. `percent` ist in Prozent, auf zwei Stellen. Der Wert, mit dem die Position rechnet, ist `period_share` (0–1, `calculation.service.ts:344`, `365`). #243 nennt «utility_statements.heating_share».

**Behebung.** «`utility_statements.heating_share` (`percent`); an der Abrechnungsposition `period_share`».

### V-8 (Nit) «Mietzeit»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:134` verwendet «Mietzeit». Das Wort ist kein Glossarbegriff (kein Eintrag gefunden). Das PDF sagt «Anteile der Monate Ihres Mietverhältnisses» (`pdf.service.ts:67`).

**Behebung.** Im Glossar «über die Mietstage» schreiben (siehe Vorschlag in V-1).

### V-9 (Nit) «Mietstage der Position» als Anzahl

**Beleg.** «Mietstage» ist nach Zeile 162 eine «Anzahl Tage». Zeile 159 sagt «Die Mietstage, die in die abgerechneten Tage … fallen». Eine Anzahl fällt nicht in Tage. Die Rechnung im Code ist richtig (`calculation.service.ts:127-128`: Schnitt von Mietzeit und abgerechneten Tagen).

**Behebung.** «Anzahl der Tage, an denen der Mietvertrag läuft, innerhalb der abgerechneten Tage einer Abrechnungsposition.»

### V-10 (Nit) Rundung «vom Betrag aus gesehen»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:157`. Der Code `pdf.service.ts:521-526` stimmt mit dem Wortlaut überein: Das Vorzeichen ergibt sich aus |Saldo| − |Saldo vor Rundung|. Nachgerechnet:
- heute Rückerstattung −48.97 → −48.95: «– 0.02»
- heute Nachzahlung 791.03 → 791.05: «+ 0.02»
- nach #79 Rückerstattung −48.97 → −49.00: «+ 0.03»
- Saldo +0.02 → 0.00: «– 0.02»

**Behebung** (optional): «Im PDF mit + oder – vom gezeigten Betrag aus: + wenn er durch die Rundung grösser wird» (Wortlaut wie in den Anforderungen, Zeile 148).

### V-11 (Nit) «Warnung, welche …»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:46`. Der Satz lässt sich als Relativsatz zu «Warnung» lesen.

**Behebung.** «Warnung, die die beendeten Abrechnungsperioden nennt, in denen der Mietvertrag Mietstage, aber keine Abrechnung hat …». Das nennt auch die Bedingung «mit Mietstagen» aus `+page.server.ts:73-75`.

### V-12 (Nit) Monatsanteile ergeben 100 %

**Beleg.** `heating-profile.service.ts:142-144`: Toleranz 0.1. `docs/nebenkostenabrechnung-anforderungen.md:146`: «±0,1 Prozentpunkte». Der Glossareintrag (Zeile 133) und der Hilfetext `messages/de.json:1271` sagen nur «100 %». Das ist für Vermieter ausreichend.

**Behebung.** Freiwillig «(auf ±0.1 Prozentpunkte genau)» ergänzen.

---

## Bestätigt

- **Abgerechnete Tage** (Wortlaut je Rechnung): `invoice.service.ts:504-517`. Beispiel: Leistungszeitraum 01.10.2024–30.09.2025 in der Periode 2025 ergibt 273 Tage; ohne Leistungszeitraum 365 Tage.
- **Mietstage der Position** (Rechnung): `calculation.service.ts:127-128`, `152-153`. Beispiel: Einzug am 01.07. bei 273 abgerechneten Tagen ergibt 92 Tage. Bei einem Mietvertrag über die ganze Periode sind sie gleich den abgerechneten Tagen; der Zeitanteil ist 1.
- **Zeitanteil** (Grundformel): `calculation.service.ts:134-142`, `351-353`; Mieteranteil = Wohnungsanteil × Zeitanteil, gerundet auf Rappen.
- **Monatsanteil**: Schema `schema.ts:213-224`, Prüfung auf 100 % und nicht negativ `heating-profile.service.ts:122-160`. Der Begriff wird in der UI gleich verwendet (`messages/de.json:429`, `432`, `1154`, `1271`, `1274`).
- **Anteil nach Heizprofil** für Ein- und Auszug an Monatsgrenzen: `prorating.service.ts:213-217` (Beispiel: Einzug am 01.07. ergibt 32 %).
- **Saldo 0.00: keine Zahlung, kein Zahlteil**: `pdf.service.ts:515` (Text «Sie müssen nichts bezahlen und erhalten nichts zurück»), `528` (Bezeichnung «Ausgeglichen»), `850-852` (kein Zahlteil bei Saldo ≤ 0).
- **Rundung im PDF vom Betrag aus gesehen**: `pdf.service.ts:521-528`, `625-628`; entspricht `docs/nebenkostenabrechnung-anforderungen.md:148`.
- **Hinweis auf fehlende Abrechnungen** ab Vertragsbeginn: `src/routes/contracts/[id]/+page.server.ts:68-85`, `MissingStatement.svelte`. Rechtlicher Hintergrund (Fedlex, VMWG, Suchtreffer auf https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» (Art. 4 Abs. 1 VMWG; Artikelnummer siehe «Nicht bestätigt»).
- **Entfernte Marker** `TODO(fachlich prüfen, #75)` in `schema.ts` und `pdf.service.ts`: «Zeitanteil», «Abgerechnete Tage», «Mietstage der Position» und «Heizmaterial» stehen jetzt im Glossar (Zeilen 136, 158-160). Das Entfernen ist fachlich gedeckt.
- Fedlex Art. 257b Abs. 1 OR (Suchtreffer auf https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de, gekürzt): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die …». Die Glossarregel «nur zugunsten des Mieters» hält diese Grenze ein. Die heutige kaufmännische Rundung ist Gegenstand von #79 und wird hier nicht beurteilt.

## Fehlende Begriffe

Keine neuen. Die Wortlaut-Vorschläge zu V-1, V-3, V-4 und V-6 ändern Entscheide aus #243 bzw. Glossarzeilen. Sie gehören in ein Issue (Labels `fachlich`, `entscheiden`) oder als Kommentar in #232 (V-1) bzw. #79 (V-2).

## Nicht bestätigt

- **Wortlaut von Art. 257b Abs. 1 OR und Art. 4 Abs. 1 VMWG vollständig:** Fedlex liefert ohne JavaScript keinen Text (WebFetch auf `/eli/cc/27/317_321_377/de` gab nur den Browserhinweis). Die Zitate stammen aus den Fedlex-Snippets von `mmx search`. Art. 257b Abs. 1 ist dort abgeschnitten. Beim VMWG-Zitat steht die Artikelnummer nicht im Snippet. Die Zuordnung zu Art. 4 Abs. 1 ist **unsicher**.
- **Eigene Nachrechnung mit dem Code:** Ein Lauf von `calculateHeatingShare` war nicht möglich, weil `node_modules` des Worktrees auf den Arbeitsbaum des Aufrufers zeigt und gesperrt ist. Die Werte in V-1 und V-4 sind von Hand nach `heating-profile.service.ts:338-379` und `calculation.service.ts:134-142` gerechnet. Für V-1 stützt sie das Beispiel aus #232 (Einzug am 05.01.: 47.68 statt 50.00).
- **Keine Fedlex-Norm** zur Verteilung der Heizkosten nach Monatsanteilen bei Mieterwechsel und zur tagesgenauen Verteilung gefunden. Die Anforderungen (Zeilen 67-68, 161) führen das als unsicher-B bzw. unsicher-C. Hier wurde nur die Übereinstimmung von Glossar und Code geprüft.
