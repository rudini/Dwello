# Fachreview #509, Runde 2 (Commit 381c7c7, Delta seit 6cfaf87)

Vorbericht: `docs/reviews/509-fachreview-1.md`.

## Status der offenen IDs

| ID | Status | Beleg |
|----|--------|-------|
| M-1 | geschlossen | `pdf.service.ts:1017-1018` (`noRunShare`) und `:1111-1112` (`heatingNoteKey`): Die Kurzform erscheint nur, wenn jede `byProfile`-Position Rechnungszeilen hat und keine davon `noPeriod` ist. Sonst bleiben Prozentwert und Monatszeile. Der Test `statement-pdf-render.test.ts:743-748` (Warmwasser ohne Rechnungszeilen) hält das fest. Nachgerechnet: 500 × 52 % = 260.00; Monate Mai–Dez 2 + 0 + 0 + 0 + 2 + 8 + 14 + 26 = 52 %. |
| V-1 | geschlossen | Die Erwartungen in `statement-pdf-render.test.ts:731,737` verwenden normale Leerzeichen. Die Negativprüfungen greifen jetzt. |
| V-2 | geschlossen | `statement-detail.feature:273`. |
| V-3 | geschlossen | `statement-pdf-render.test.ts:727`: Q1 1'000 × 0 % + Q2 1'000 × 40 % = 400. 400 / 2'000 = 20 %, also `periodShare` 0.2 und `tenantShare` 400. Q2: Mai 2 + Jun 0 = 2 %, Apr 3 + Mai 2 + Jun 0 = 5 %, 2 / 5 = 40 %. |
| V-4 | geschlossen | eigener Schlüssel `heatingNoteOwn` (`pdf.service.ts:88,208,327,446`). In fr und it steht nach dem Doppelpunkt ein Kleinbuchstabe. |

## Neue Befunde im Delta

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-2 | Mietrecht | Minor | Eine Heizrechnung, die nach Tagen geteilt wird, weil ihre Monate im Heizprofil 0 % haben (Fall aus #71, `statement-pdf.pg.test.ts:430-445`), verliert die Monatszeile. Bisher zeigte sie Jul und Aug mit 0.00 %. Jetzt zeigt das PDF keinen Monatswert mehr, der die Bedingung «zusammen 0 %» aus `sharesNoteHeatingParts` belegt. Juni fehlte schon vorher, die Lücke bestand also schon. Fix (eigenes Issue genügt): Bei einer solchen Rechnungszeile die Monate im Heizprofil mit «zusammen 0.00 %» nennen. |
| V-5 | Verwalter | Minor | Der Testname in `statement-pdf.pg.test.ts:430` lautet noch «… den Anteil nach Heizprofil des Laufs». Seit #509 nennt das PDF diesen Anteil nicht mehr. Fix: den Namen umbenennen, z. B. «… nennt keinen Anteil des Laufs, wenn keine Rechnung ohne Leistungszeitraum ist». |

Zum Fall aus #71, den der Auftrag nennt: Die neue Erwartung ist nach dem Issue richtig. Das Issue sagt unter «Done means»: «otherwise the sentence says only how invoices with a Leistungszeitraum count». Die einzige Heizrechnung hat einen Leistungszeitraum (01.06.–31.08.2025). Der alte Satz «40.00 % für eine Rechnung ohne Leistungszeitraum» bezog sich auf keine Rechnung. Die Rechnungszeile «Ihre Mietstage 62 von 92 Tagen» stimmt: 920 × 62 / 92 = 620.00. Die Ausnahme nach Tagen erklärt weiterhin `sharesNoteHeatingParts`. Offen bleibt nur M-2.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- Das E2E-Szenario `statement-detail.feature:258-273` ohne `@wip` habe ich nicht laufen lassen, weil es den ganzen Stack braucht. Gelaufen sind `statement-pdf-render.test.ts` (138 grün) und `statement-pdf.pg.test.ts -t Heizanteil` (11 grün), beide im Review-Worktree.
- Art. 8 VMWG: Der Wortlaut ist weiterhin nur über die Reviews aus Runde 1 belegt (siehe dort). Die Begründung von M-2 ist deshalb **unsicher** im strengen Sinn.

Geprüft: `noRunShare` und `heatingNoteKey` für alle drei Zweige (ohne eigene Rechnungszeilen, Mischfall, nur Rechnungen mit Leistungszeitraum), `periodSums` unverändert gegenüber vorher, Wortlaut von `heatingNoteOwn` in de/fr/it/en.
