# Fachreview #71, Runde 3 (Fix von M-4)

Worktree `review-71-fach3`, detached auf f8ef41c, Delta `git diff 5ef0f20 f8ef41c`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-14 | Verwalter | Nit | Regel 5: Nach dem Aufteilen in zwei Sätze (V-12) beginnt der neue Satz «Ohne Heizprofil auch die Heizkosten nach Tagen, …» ohne Verb |

Es gibt keinen neuen Blocker und keinen neuen Major.

## Stand der Befunde aus Runde 2

| ID | Stand |
|---|---|
| M-4 | **Behoben**, Nachrechnung unten |
| V-9 | Behoben: fr «aucune», it «nessuna», auch im Render-Test |
| V-10 | Behoben: it «la quota di tale fattura figura sotto la voce del conteggio» |
| V-11 | Behoben: `sharesNoteHeatingParts` hat in allen vier Sprachen ` %` |
| V-12 | Behoben: «… behält ihre Anteile (offen: #335).» steht jetzt als eigener Satz. Folge: V-14 |
| V-13 | Nicht im Delta, also ausserhalb dieser Runde. Bleibt Nit im Bericht von Runde 2 (Text von #335) |
| P-3 (Persona) | Behoben. Der neue Satz ist in vier Sprachen verständlich und passt zu Regel 5 («Haben die Tage einer Rechnung im Heizprofil zusammen 0 %, wird sie nach den Mietstagen darin geteilt») |
| C-1 | Fachlich bestätigt, siehe unten |
| P-1 → #339 | Die Übergabe ist richtig, siehe unten |

## M-4: Bestätigung

**Beleg:**
- `backend/src/services/statement-pdf.service.ts:179`: `heatingLine` ist jetzt die erste Heizposition **ohne** `invoiceParts`. Hat jede Heizposition `invoiceParts`, bleibt `lineShare` undefiniert und `heatingOf` (`:145`) nimmt `stored.percent`, also den Anteil des Laufs.
- `backend/src/services/pdf.service.ts:724`: `ownProfileDays` ist wahr, sobald eine Position `byProfile` ist und `invoiceParts` hat, auch wenn kein Teil ein `profile` hat. Damit erscheinen `heatingNoteParts` und `sharesNoteHeatingParts`.
- `invoiceParts` auf einer Heizposition mit `byProfile` kommen nur aus `sharedByInvoices` mit Heizprofil (`calculation.service.ts:191`). Bei `byDays` des Laufs gibt es kein `run.heating`, also ist `byProfile` falsch und #137 gilt unverändert: Mietstage, kein Heizprofil-Hinweis.

**Nachgerechnet** (Testfall `statement-pdf.pg.test.ts:371`):
- Eine Rechnung über CHF 920.00 mit Leistungszeitraum 01.06.–31.08.2025, Einzug 01.07.2025: 62/92 × 920.00 = **620.00**. Der Test erwartet «Ihre Mietstage 62 von 92 Tagen».
- Zweiter Wert, Einzug 15.07.: 48/92 × 920.00 = 480.00 (`partShare` = `days / total`).
- Randfall, Einzug 01.09.: 0 Tage, also 0.00. Unter der Position steht die Rechnung mit «0 von 92 Tagen».
- Satz zum Heizprofil: Anteil des Laufs im geänderten Profil, Juli bis Dezember 0 + 0 + 0 + 30 + 5 + 5 = **40.00 %**, «für eine Rechnung ohne Leistungszeitraum». Der Tage-Anteil 67.39 % erscheint nicht mehr als Anteil nach Heizprofil (`not.toContain('67.39 % der Heizkosten')`).
- Mischfall aus Runde 2 («Heizung» nur über die ganze Periode, «Heizungsservice» nur Sommer): `heatingLine` ist jetzt «Heizung», deren `periodShare` gleich `heating.percentage / 100` ist (`calculation.service.ts:220`), also der Anteil des Laufs. Er hängt nicht mehr von der Reihenfolge ab.

Gibt es gar keine Rechnung ohne Leistungszeitraum, nennt der Satz trotzdem «40.00 % für eine Rechnung ohne Leistungszeitraum». Er trifft dann auf keine Rechnung zu, sagt aber nichts Falsches. Das ist die in Runde 2 als ausreichend angenommene Variante. Die strengere Variante nach #137 (kein Heizprofil-Hinweis) bleibt eine Option und ist kein Befund.

Rechtlich: Art. 8 Abs. 1 VMWG (Fedlex, SR 221.213.11): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, …». Position, Rechnungszeile und Erläuterung widersprechen sich nicht mehr. Die Aufteilung ist nachvollziehbar.

## C-1: Heizposition, die zusammen null ergibt

`calculation.service.ts:190`: Bei `totalAmount === 0` gilt `periodShare 0` und `noDays`, wie bei der Teilung nach Tagen (`rentalShare` gibt 0, `daysOf` gibt `noDays`). Im PDF zeigt `timeShare` (`pdf.service.ts:497`) dann «0.00 %», der Anteil ist 0.00, und es steht keine Rechnung darunter. Das entspricht Regel 5 («ergeben die Rechnungen zusammen null, nennt es sie nicht»). Vor dem Delta listete das PDF die Rechnungen mit Anteilen, die zusammen nicht null ergeben (V-6 / #237). Jetzt ist das konsistent. Die Frage, ob eine Gutschrift ohne Leistungszeitraum neben einer Rechnung Jan–Mär den Mieter entlasten müsste, bleibt in #237 offen.

Das Refactoring (`partOf`) ändert nichts am Ergebnis. `fuelStock` kommt jetzt auch in die Teile nach Heizprofil. Rechnungen einer Tankkategorie erreichen `byProfile` aber nie (`ownDays` schliesst `tankCategories` aus, `:212`).

## P-1 / #339: Einordnung

Die Rechnung widerspricht dem Entscheid von #71 nicht, sie ist seine Folge. #71 «Decided (product owner)», Option B: «for a heating-cost invoice with a Leistungszeitraum, only the Heizprofil's months inside that Leistungszeitraum count». Die Rechnungen ohne Leistungszeitraum zählen nach Regel 5 «die Monate der ganzen Periode».

Nachgerechnet mit den Zahlen aus #339:
- Meier: (2'705 × 55.80 % + 1'410 × 0 %) / 4'115 = 1'509.39 / 4'115 = **36.68 %**
- Brunner: (2'705 × 44.20 % + 1'410 × 100 %) / 4'115 = 2'605.61 / 4'115 = **63.32 %**
- Summe 100 %. Die Zahlen des Issues stimmen.

Die Verzerrung entsteht, weil Quartalsrechnungen Q1–Q3 ohne Leistungszeitraum erfasst sind. Sind es tatsächlich Jahreskosten (z. B. Grundgebühr) neben einer Q4-Rechnung, ist das Ergebnis richtig. Das kann Dwello nicht unterscheiden. Ein `entscheiden`-Issue ist daher richtig.

Verwaltersicht zu den Optionen (keine Entscheidung): Nach Art. 257b Abs. 1 OR (Fedlex: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen …») sollten Kosten dem Zeitraum folgen, in dem sie anfallen. Option B (nur Demodaten) löst das für echte Vermieter nicht. Ein Hinweis im Abrechnungslauf (A oder C) liegt näher an der Praxis. Er passt auch zum vorhandenen Hinweis auf Rechnungen ohne Leistungszeitraum (`statement-generate.feature`). Das ist ein Kommentar für #339, kein Befund in diesem Pull Request.

## V-14 (Nit): Satz ohne Verb in Regel 5

**Beleg:** `docs/nebenkostenabrechnung-anforderungen.md:145`, Regel 5: «Eine schon versendete Abrechnung behält ihre Anteile (offen: #335). Ohne Heizprofil auch die Heizkosten nach Tagen, ebenso wenn …». Früher hing der zweite Teil am Semikolon und war schon elliptisch. Jetzt fehlt dem Satz das Verb.

**Lösung:** «Ohne Heizprofil werden auch die Heizkosten nach Tagen verteilt, ebenso wenn …».

## Nicht bestätigt

- Die Tests habe ich nicht selbst ausgeführt. `bun test` im Worktree scheitert, weil `node_modules` auf den Arbeitsbaum des Aufrufers zeigt (Zugriff gesperrt). Die erwarteten Werte im Test (620.00, 62 von 92, 40.00 %) habe ich von Hand nachgerechnet. Das Profil «40 % ab Juli» habe ich aus dem Kommentar im Test übernommen, nicht aus der Testdatenbank.
- fr/it/en des neuen Satzes (P-3) habe ich sprachlich gelesen. `docs/design/i18n-begriffe.md` habe ich dafür nicht erneut geprüft, weil die Begriffe dieselben sind wie in Runde 2.
- Art. 257b Abs. 1 OR ist nur bis «… mit dem Gebrauch zusammenhängen» belegt (Fedlex-Snippet über `mmx search`). Den Rest des Absatzes zitiere ich nicht.
