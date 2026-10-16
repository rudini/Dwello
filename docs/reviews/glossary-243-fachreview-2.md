# Fachreview Glossar #243, Runde 2 (Delta)

Gegenstand: `git diff 047d704 a500396 -- UBIQUITOUS_LANGUAGE.md` (Worktree `review-g243-fach2`, detached bei a500396). Geprüft wird nur, ob V-1 bis V-12 aus Runde 1 (`docs/reviews/glossary-243-fachreview-1.md`) richtig umgesetzt sind und ob das Delta neue Probleme bringt. Die Formeln habe ich mit `heating-profile.service.ts`, `prorating.service.ts`, `calculation.service.ts`, `invoice.service.ts` und `pdf.service.ts` abgeglichen.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-13 | Verwalter | Nit | «Anteil nach Heizprofil»: «über die Mietstage» behandelt eine Anzahl als Zeitraum, dasselbe Problem wie bei V-9; der Wortlaut stammt aus meinem eigenen Vorschlag in V-1 |
| V-14 | Verwalter | Nit | «Mietstage der Position»: In der Spalte Code fehlt `invoice_parts` (`days`) für den Fall «je Rechnung» |
| V-15 | Verwalter | Nit | «Abgerechnete Tage»: Bei einem Mietvertrag über die ganze Periode oder bei einer Summe von 0.00 werden «sonst je Rechnung (`invoice_parts`)» nicht gespeichert |

Kein Blocker und kein Major. Keine Befunde im Bereich Mietrecht (M) und keine im Bereich Rechtstexte (R).

## Stand der Befunde aus Runde 1

| ID | Stand | Beleg |
|----|-------|-------|
| V-1 | behoben | `UBIQUITOUS_LANGUAGE.md:134` entspricht `heating-profile.service.ts:365-369` (`monthPct × daysInPeriod / daysInMonth`) und `prorating.service.ts:213-217` (Mieter / Periode × 100). Die Rundung ist als geplant (#232) markiert. Nachgerechnet mit dem Profil aus Runde 1: Auszug am 15.03. ergibt 20 + 18 + 15 × 15/31 = 45.26 %, und das Glossar ergibt jetzt denselben Wert. Einzug am 01.07. ergibt 32 %. Mietzeit 01.06.–31.08. ergibt 0 %. Den Wortlaut betrifft V-13. |
| V-2 | behoben | Die Spalte Code nennt jetzt bei «Saldo» und «Rundung auf 5 Rappen» «geplant (#79)» (Zeilen 156-157). Das passt zu `pdf-format.ts:17-20` (heute kaufmännisch gerundet). |
| V-3 | behoben, siehe V-15 | Zeile 158 entspricht `calculation.service.ts:150-161` (`billed_days`, wenn alle Rechnungen dieselben Tage abrechnen, sonst `invoice_parts`). |
| V-4 | behoben | Zeile 160 sagt jetzt «nach ihren Beträgen für die abgerechneten Tage». Das entspricht `calculation.service.ts:118` und `134-142` (`inPeriod.amount`). Das Beispiel aus Runde 1 ergibt 42.51 %. |
| V-5 | behoben | Zeile 46 markiert «seit ‹Abgerechnet bis›» als geplant (#133), mit grossem «A» wie in Zeile 47. |
| V-6 | behoben | Zeile 160 sagt «bei Ein- oder Auszug … ausser die Monate der Abrechnungsperiode haben darin zusammen 0 % (dann nach Tagen)». Das entspricht `prorating.service.ts:208` (Mietvertrag über die ganze Periode: `byDays`) und `:214` (`period.percentage <= 0`: `byDays`), dazu `calculation.service.ts:330-352`. Nicht im Glossar steht der technische Fall «Heizprofil nicht gefunden: nach Tagen» (`prorating.service.ts:200`). Das braucht das Glossar nicht. |
| V-7 | behoben | Zeile 134: `utility_statements.heating_share` (`percent`) und `period_share` an der Position (`calculation.service.ts:344`, `365`). |
| V-8 | behoben | «Mietzeit» kommt im Glossar nicht mehr vor. |
| V-9 | behoben | Zeile 159 sagt jetzt «Anzahl der Tage, an denen der Mietvertrag läuft, innerhalb der abgerechneten Tage …». Das entspricht `calculation.service.ts:127-128` (`rentedIn`). |
| V-10 | behoben | Zeile 157 sagt «+, wenn er durch die Rundung grösser wird». Das entspricht `pdf.service.ts:523-526` (Vorzeichen aus \|Saldo\| − \|Saldo vor Rundung\|). Nachgerechnet: −48.97 → −48.95 ergibt «– 0.02», 791.03 → 791.05 ergibt «+ 0.02». |
| V-11 | behoben | Zeile 46 lautet jetzt «Warnung, die die beendeten Abrechnungsperioden nennt, in denen der Mietvertrag Mietstage, aber keine Abrechnung hat». Das entspricht `src/routes/contracts/[id]/+page.server.ts:69-85` (`rentDaysIn`, ohne Abrechnung, ab Vertragsbeginn). |
| V-12 | behoben | Zeile 133 sagt «auf ±0.1 Prozentpunkte genau». Das entspricht `heating-profile.service.ts:142-144` und `docs/nebenkostenabrechnung-anforderungen.md:146`. |

## Neue Befunde

### V-13 (Nit) «über die Mietstage»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:134` sagt «Summe der Monatsanteile über die Mietstage». Nach Zeile 162 sind «Mietstage» eine «Anzahl Tage». V-9 hat dieselbe Lesart an Zeile 159 behoben. Der Wortlaut stammt aus meinem Vorschlag in V-1. Rechnerisch ist der Satz richtig.

**Behebung.** «Summe der Monatsanteile über die Tage, an denen der Mietvertrag in der Abrechnungsperiode läuft, geteilt durch …». Damit lautet die Stelle wie Zeile 159. Wenn die Änderung den vom Product Owner bestätigten Wortlaut berührt, kommt sie als Kommentar in #232 oder #243.

### V-14 (Nit) Spalte Code bei «Mietstage der Position»

**Beleg.** Zeile 159 definiert den Begriff jetzt auch «je Rechnung». Die Spalte Code nennt aber nur `position_rental_days`. Rechnen die Rechnungen einer Position verschiedene Tage ab, ist `position_rental_days` `null`, und die Tage stehen in `invoice_parts[].days` (`calculation.service.ts:152-161`, `schema.ts:437-439`).

**Behebung.** In der Spalte Code «`position_rental_days`, je Rechnung `invoice_parts` (`days`)» schreiben, so wie in Zeile 158.

### V-15 (Nit) «sonst je Rechnung (`invoice_parts`)» gilt nicht immer

**Beleg.** `calculation.service.ts:154`: Läuft der Mietvertrag über die ganze Periode (`wholePeriod`) oder ergeben die Rechnungen zusammen 0.00, ist auch `invoice_parts` `null`. Die Definition «je Rechnung» bleibt dann richtig, nur ist kein Feld gespeichert. Der Zeitanteil ist in diesen Fällen 1 bzw. 0 (`calculation.service.ts:136`). Für Vermieter ist das unerheblich.

**Behebung** (freiwillig). In der Spalte Code «`invoice_parts` (nicht gespeichert bei einem Mietvertrag über die ganze Periode)» schreiben, oder den Befund verwerfen.

## Nicht bestätigt

- **Nachrechnung mit dem Code selbst:** wie in Runde 1 von Hand gerechnet, nach `heating-profile.service.ts:338-379`, `prorating.service.ts:195-218` und `calculation.service.ts:127-162`. Ich habe den Code nicht ausgeführt, weil ich den Worktree nicht ändern soll und `node_modules` nicht nutzbar ist.
- **Fedlex:** Das Delta bringt keine neue Rechtsaussage. Die offenen Punkte aus Runde 1 gelten unverändert: Der Wortlaut von Art. 257b Abs. 1 OR ist im Snippet abgeschnitten, und die Zuordnung des VMWG-Zitats zu Art. 4 Abs. 1 ist **unsicher**.
