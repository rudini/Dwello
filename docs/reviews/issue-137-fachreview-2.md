# Fachreview #137, Runde 2: Heizkosten einer Periode ohne Heizanteil mit Leistungszeitraum

Gegenstand: Worktree `review-137-fach2`, Commit `b6c63c0` (enthält `3976b25` «apply #137 review round 1», `f6bd25a` «apply #137 review round 2» und einen Merge von `main`). Geprüft wurden die Änderung nach der Datenprüfung (D-1), die neue Fassung von Regel 5, das neue `@api`-Szenario «Heizkosten einer Periode ohne Heizanteil gelten für ihren Leistungszeitraum» und der Stand der Befunde aus Runde 1.

Grundlagen:
- `UBIQUITOUS_LANGUAGE.md`
- `docs/nebenkostenabrechnung-anforderungen.md`
- VMWG (SR 221.213.11), Fedlex-Fassung vom 1.10.2025, in dieser Runde neu abgerufen: `https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001/de/html/fedlex-data-admin-ch-eli-cc-1990-835_835_835-20251001-de-html.html`
- OR (SR 220), Fedlex-Fassung vom 1.1.2025, Wortlaut wie in Runde 1

Die Issues #207 (Begriff), #208 (D-2, D-3) und #209 (aktuelles Profil) sind offene Arbeit. Ich erwähne sie hier nicht erneut als Befunde.

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-7 | Verwalter | Nit | Im neuen Szenario heisst das Heizprofil «Sommer ohne Heizung». Es ist aber ein Ganzjahresprofil (gleiche Werte wie «Winter»). Der Name legt nahe, das Profil gelte nur für den Sommer. |
| V-8 | Verwalter | Nit | Der Rechenkommentar über dem Szenario sagt nicht, warum der Wohnungsanteil «die Hälfte» ist (zwei Wohnungen mit je 70 m², Verteilschlüssel «Pro Fläche»). |

Keine neuen Blocker und keine neuen Major-Befunde. Alle Major-Befunde aus Runde 1 sind behoben (siehe «Stand der Befunde aus Runde 1»).

## Prüfung der Änderung

### Regel 5, neue Fassung

Der Wortlaut (`docs/nebenkostenabrechnung-anforderungen.md:145`):

> «… ohne Heizprofil auch die Heizkosten nach Tagen, ebenso wenn die Monate der Periode im Heizprofil zusammen 0 % haben (z. B. eine Sommerperiode): dann wie jede andere Rechnung, mit ihrem Leistungszeitraum; die Abrechnung zeigt die Mietstage und keinen Heizprofil-Hinweis …»

**Stimmt mit dem Code überein.**
- `backend/src/services/calculation.service.ts:300-320`: Liefert `handleMidYearMoves` den Wert `byDays: true`, gilt `periodShare = rentalShare(group, overlapStart, overlapEnd)`. Das ist derselbe Zweig wie für jede andere Rechnung. Ohne Heizprofil gilt dasselbe (`heatingResult` ist `null`).
- `backend/src/services/prorating.service.ts:200, 211`: Ohne Profil oder bei `period.percentage <= 0` wird nur noch `{ byDays: true }` zurückgegeben. Die zweite Rechnung nach Tagen der Periode (die Ursache von D-1) ist entfernt.
- `rentalShare` (`calculation.service.ts:127-135`) rechnet je Rechnung: Betrag × (Mietstage im Leistungszeitraum ∩ Periode) / (Tage des Leistungszeitraums in der Periode). Das entspricht dem ersten Satz von Regel 5.

**Stimmt mit dem Gesetz überein, soweit es etwas regelt.**
- Art. 5 Abs. 1 VMWG (Fedlex): «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.»
  - Abgerechnet wird nur der Teil der Rechnung, der in die Periode fällt (Regel 1). Er wird ohne Aufschlag auf die Mieter und den Leerstand verteilt.
  - Die Summe der Anteile ist höchstens der Wohnungsanteil (siehe Nachrechnung, Mieterwechsel).
- Art. 7 Abs. 1 VMWG (Fedlex): «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.»
  - Im Szenario trägt der Vermieter die 14 leeren Tage vom 01.07. bis 14.07. (14/62 von CHF 303.26 = CHF 68.48).
  - Den Juni trägt niemand, weil die Rechnung ihn nicht abrechnet. Das ist richtig: Der Juni-Leerstand verursacht aus dieser Rechnung keine Kosten.
- Art. 8 Abs. 1 VMWG (Fedlex): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.»
  - Der Hinweis hängt jetzt an jeder Heizkosten-Position (`pdf.service.ts:674`: `data.lineItems.some((item) => item.heating)`).
  - Er bleibt deshalb auch bei einer Verteilung nach Tagen.
- Art. 4 Abs. 1 VMWG (Fedlex): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Die kurze Periode 01.06.–31.08. ist damit zulässig (wie Runde 1, V-6).
- Wie die Heizkosten bei einem Mieterwechsel aufzuteilen sind, regeln weder Art. 4–8 VMWG noch Art. 257a/257b OR (siehe «Nicht bestätigt»).

**Ein Satzteil stimmt nur für Rechnungen ohne Leistungszeitraum.**
- «die Abrechnung zeigt die Mietstage» gilt nur ohne Leistungszeitraum.
- Mit Leistungszeitraum druckt das PDF einen Prozentsatz (`pdf.service.ts:431`: «Tage» nur, wenn `periodShare` gleich Mietstage / Tage der Periode ist).
- Das ist D-3 und bereits in #208 erfasst. Kein neuer Befund.

**Begriffe.**
- «Leistungszeitraum» (Glossar Z. 58), «Heizprofil», «Mietstage» (Z. 137), «Wohnungsanteil» (Z. 107) und «Verwaltungspauschale» (Z. 133) sind Glossarbegriffe und richtig verwendet.
- «Sommerperiode» und «Periode ohne Heizanteil» behandelt #207.

### Nachrechnung des Szenarios (`tests/e2e/features/statement-generate.feature:77-102`)

**Ausgangslage aus dem Code und den Fixtures:**
- Gebäude «Lindenhof» mit den Wohnungen 3.01 und 3.02, je 70 m² (`tests/e2e/fixtures/backend.ts:115`, Vorgabe `area = '70'`).
- Rechnung mit Verteilschlüssel «Per Area (m²)» (`backend.ts:72`).
- Kategorie «Heizung» = `Heating`, `is_heating_cost = true` (`backend/migrations/0002_stammdaten.sql:15`).
- Verwaltungspauschale nach Vorgabe 3 %, wie im bestehenden Szenario «… Leistungszeitraum, nicht für ihr Rechnungsdatum» (900 → 927.00).
- Das Heizprofil hat im Juni, Juli und August je 0 %. Die Periode 01.06.–31.08.2024 hat damit zusammen 0 %, und es gilt der Zweig nach Tagen.

**Rechnung:**

| Schritt | Rechnung | Ergebnis |
|---|---|---|
| Tage des Leistungszeitraums | 01.07.–30.09.2024 = 31 + 31 + 30 | 92 |
| davon in der Periode | 01.07.–31.08.2024 = 31 + 31 | 62 |
| Kosten Liegenschaft in der Periode (Regel 1) | 900 × 62/92 = 606.5217 | 606.52 |
| Wohnungsanteil (70/140 m²) | 606.5217 / 2 = 303.2609 | 303.26 |
| Mietstage von Lea Graf im Leistungszeitraum ∩ Periode | 15.07.–31.08.2024 = 17 + 31 | 48 |
| Ihr Anteil | 303.26 × 48/62 = 234.7819 | 234.78 |
| Verwaltungspauschale 3 % | 234.78 × 0.03 = 7.0434 | 7.04 |
| **Total** | 234.78 + 7.04 | **241.82** |

Der Erwartungswert «CHF 241.82» stimmt.

**Der Test kann rot werden.** Mit dem alten Code (Tage der Periode statt des Leistungszeitraums) wäre das Ergebnis 303.26 × 48/92 = 158.22, plus 4.75 Verwaltungspauschale, also CHF 162.97. Das Szenario unterscheidet also den Fehler D-1 vom richtigen Verhalten.

**Zweites Beispiel: Mieterwechsel mitten im Leistungszeitraum (Randfall).**
- Angenommen, ein Vormieter A wohnt vom 01.06. bis 14.07. in 3.02.
- Seine Tage im Leistungszeitraum ∩ Periode: 01.07.–14.07. = 14. Sein Anteil: 303.26 × 14/62 = 68.4768, also 68.48.
- Zusammen mit Lea Graf: 68.48 + 234.78 = 303.26, genau der Wohnungsanteil.
- Den Juni trägt A nicht, weil die Rechnung ihn nicht abrechnet. Nach dem alten Code hätte A 44/92 getragen, also 145.04.

**Drittes Beispiel: ganze Periode gemietet.** 303.26 × 62/62 = 303.26.

**Randfall Gutschrift.** Eine Rechnung über −900 mit demselben Leistungszeitraum hebt die Gruppe auf null auf. `rentalShare` gibt dann 0 zurück (`calculation.service.ts:129`). Ihr Anteil ist 0. Das ist richtig, weil die Gutschrift den gleichen Zeitraum betrifft.

### Bestehende Szenarien nach der Änderung

- `statement-detail.feature:175-189` («… nach Mietstagen, wenn die Monate der Periode im Heizprofil 0 % haben»): Die Heizöl-Rechnung vom 30.06.2024 hat keinen Leistungszeitraum. `rentalShare` ergibt damit 48/92 = 0.5217 und 500 × 0.5217… = 260.87. Das PDF druckt weiter «48/92 Tage». Die Erwartungen stimmen.
- `prorating.pg.test.ts:112-138`: Die Tests prüfen jetzt nur noch `{ byDays: true }`. Den Betrag nach Tagen prüfen `heating-distribution.pg.test.ts` und das Szenario. Für die Fachlichkeit genügt das.

## Stand der Befunde aus Runde 1

| ID | Schwere | Stand | Beleg |
|---|---|---|---|
| M-1 | Major | behoben | `pdf.service.ts:674`: Der Art.-8-Hinweis hängt an `item.heating`. Das Szenario prüft ihn (`statement-detail.feature:189`). |
| M-2 | Major | behoben | Gleiche Bedingung wie M-1. Der Hinweis erscheint auch ohne Heizprofil und ohne Tankbestand, sobald eine Heizkosten-Position da ist (`statement-pdf.service.ts:89`, `heating` unabhängig vom Profil). |
| V-1 | Minor | behoben | `pdf.service.ts:614-615`: `sharesNoteHeating` nur, wenn eine Position `byProfile` ist. Gilt in allen vier Sprachen (Z. 88, 155, 222, 289). Das Szenario prüft `nicht "Heizprofil"` (`statement-detail.feature:188`). |
| V-2 | Minor | behoben | Regel 5 nennt die Ausnahme (siehe oben). |
| V-3 | Minor | behoben, Rest in #207 | Der Szenariotitel `statement-detail.feature:177` verwendet «Mietstage» und «Heizprofil». «Sommer» steht nur noch als Erläuterung in Klammern. Der fehlende Begriff ist in #207. |
| V-4 | Nit | offen, unverändert | Den Sprung zwischen einer Periode ganz ohne Heizanteil und einer mit einem Heizmonat gibt es weiter. Er gilt jetzt auch für Rechnungen mit Leistungszeitraum. Beispiel: Periode 01.05.–31.08., gleiche Rechnung, Einzug 15.07. ergibt Ihr Anteil 0, weil die Mietmonate im Profil 0 % haben. Gesetzlich nicht geregelt. Für #137 keine Korrektur. |
| V-5 | Nit | offen, unverändert | Im PDF-Szenario steht weiter ein Heizöl-Einkauf statt eines Verbrauchs. Keine Korrektur nötig. |
| V-6 | Nit | offen, unverändert | Kurze Periode, die «Abrechnung 2024» heisst. Zulässig nach Art. 4 Abs. 1 VMWG. Keine Korrektur nötig. |

## Befunde

### V-7 (Nit, Verwalter): Name des Heizprofils im neuen Szenario

**Beleg.** `statement-generate.feature:82`: `das Heizprofil "Sommer ohne Heizung" verteilt die Heizkosten so:`. Die Tabelle verteilt über das ganze Jahr (Januar 18 % … Dezember 26 %). Sie ist gleich wie «Winter» in Z. 47-60.

**Warum erwähnt.** Ein Heizprofil gilt im Glossar für zwölf Monate (Regel 6: «Zwölf Monatsanteile, zusammen 100 %»). Der Name lässt einen Leser glauben, das Profil selbst sei die Ursache und nicht die Wahl der Periode. Der Test bleibt richtig.

**Korrektur.** Den Namen so wählen, dass er das Profil beschreibt und nicht die Periode, z. B. «Winter» wie im Szenario darüber oder «Mittelland ohne Sommerheizung».

### V-8 (Nit, Verwalter): Grund für «die Hälfte» im Rechenkommentar

**Beleg.** `statement-generate.feature:78-79`: «… 606.52 in der Periode, die Hälfte für die Wohnung (303.26) …».

**Warum erwähnt.** Die Hälfte folgt daraus, dass die Wohnungen 3.01 und 3.02 je 70 m² haben (Vorgabe in der Fixture) und der Verteilschlüssel «Pro Fläche» gilt. Das Szenario sagt keines von beiden. Wer nachrechnet, muss es in `backend.ts:72, 115` suchen.

**Korrektur.** Im Kommentar ergänzen: «… die Hälfte für die Wohnung (Pro Fläche, 70 von 140 m²: 303.26) …».

## Fehlende Begriffe

Keine neuen. «Periode ohne Heizanteil» und «Sommerperiode» sind in #207.

## Nicht bestätigt

- **Aufteilung von Heizkosten nach Tagen, wenn das Profil einer Periode 0 % ergibt:** Art. 4–8 VMWG (Fedlex, Stand 1.10.2025, in dieser Runde erneut gelesen) und Art. 257a/257b OR (Fedlex, Stand 1.1.2025) regeln nicht, wie Heizkosten bei einem Mieterwechsel zwischen Mietern und Leerstand aufgeteilt werden. Dass in der Praxis in diesem Fall nach Tagen verteilt wird, habe ich nicht belegt gefunden. Die Regel ist **unsicher** (Praxis), aber nicht gesetzwidrig: Sie verteilt nur tatsächliche Kosten (Art. 5 Abs. 1 VMWG), und den Leerstand trägt der Vermieter (Art. 7 Abs. 1 VMWG).
- **Heizkosten über Monate mit 0 % im Profil:** Im Szenario rechnet eine Heizungsrechnung Juli bis September ab. Regel 1 verteilt sie nach Tagen auf die Periode (62/92), obwohl das Profil Juli und August mit 0 % führt und nur dem September Heizbedarf zuschreibt. Bei fixen Kosten wie Grundgebühr, Wartung oder Revision (Art. 5 Abs. 2 lit. d/e VMWG) ist eine Verteilung nach Tagen üblich. Bei Energiekosten wäre eine Verteilung nach dem Profil genauer. Die Frage, ob das Heizprofil auch die Zuordnung einer Rechnung mit Leistungszeitraum zur Periode bestimmen soll, gehört zu #71. Eine Rechtsgrundlage habe ich nicht gefunden. Deshalb kein Befund.
- **«Die Abrechnung zeigt die Mietstage» bei Rechnungen mit Leistungszeitraum:** Das PDF zeigt dann einen Prozentsatz. Das ist D-3 in #208. Im PDF habe ich es in dieser Runde nicht erneut erzeugt.
- **Standardsatz der Verwaltungspauschale 3 %:** Ich habe ihn nur aus dem bestehenden Szenario abgeleitet (900 → 927.00), nicht aus dem Code des Konfigurationsdienstes (`backend/src/services/config.service.ts`) gelesen.
- **Fassung des OR:** Ich habe die Fassung vom 1.1.2025 verwendet und nicht geprüft, ob es eine neuere gibt. Art. 257a/257b sind seit Langem unverändert.
- **Szenario nicht ausgeführt:** Die Beträge habe ich von Hand nachgerechnet. Das Szenario habe ich nicht laufen lassen.
