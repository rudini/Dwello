# Code-Review #137, Runde 1: Heizkosten nach Mietstagen im PDF

Geprüft: `git diff 25ce827..cbbaafa` (6fda8bc Szenario, cbbaafa Fix) im Worktree `review-137-code` (detached auf cbbaafa). Alle 12 geänderten Dateien gelesen, dazu `calculation.service.ts` (Aufrufer von `handleMidYearMoves`), `statement-pdf.service.ts` (`runDetailsOf`, `generateStatementPdf`), `pdf.service.ts` (`timeShare`, `heatingLines`, `heatingSection`, `notes`), `statement-pdf.pg.test.ts` und `docs/reviews/issue-137-fachreview-1.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | backend/src/services/statement-pdf.service.ts:145 | Die Verdrahtung `if (byDays) return {}` in `heatingOf` ist nur durch das E2E-Szenario abgedeckt. Ohne diese Zeile bleiben `prorating.pg.test.ts`, `statement-pdf-data.test.ts` (bekommt `run` direkt) und `statement-pdf-render.test.ts` (bekommt `StatementPDFData` direkt) grün. Die tiefste Schicht, die den Fehler als Ganzes zeigt, ist `statement-pdf.pg.test.ts`. Dort gibt es mit «nennt bei einer Periode unter einem Jahr den Anteil …» (Z. 85–99) schon das Muster: eine Sommerperiode erzeugen, `generateStatementPdf`, dann «Tage» prüfen und dass «Heizprofil» fehlt. |
| C-2 | Nit | backend/src/__tests__/statement-pdf-render.test.ts:56–57 | Der neue `describe` steht zwischen dem Kommentar «Der Saldo ist auf 5 Rappen gerundet; …» und dem Block «Rundung des Saldos im PDF», zu dem dieser Kommentar gehört. Er trennt auch `const due` von seiner Verwendung. Besser direkt nach «PDF einer Rückerstattung» (vor `const due`). |

Keine Blocker, keine Majors.

## Bestätigt

- **Mietstage statt Profil, die Entscheidung fällt in der Berechnung:** `handleMidYearMoves` liefert `byDays: true` im 0-%-Zweig (prorating.service.ts:237–239) und ohne Profil (Z. 212, 222), sonst `false` (Z. 242). `heatingOf` ruft dieselbe Funktion mit denselben Perioden wie `calculation.service.ts:302`. Bei `byDays` liefert es keine `heating`-Daten (statement-pdf.service.ts:145). `lineItemOf` setzt `byProfile` nur bei gesetztem `run.heating` (Z. 89, 119). Damit zeigt `timeShare` (pdf.service.ts:431) «48/92 Tage». Test: `prorating.pg.test.ts` («sagt, dass es nach Tagen geteilt hat …», dazu `byDays: false` im Profilfall), `statement-pdf-data.test.ts` («nennt die Heizkosten nach Heizprofil nur, wenn …»), Szenario `statement-detail.feature:177`.
- **Eine Zeile nach Profil bleibt unverändert:** Mit gefundenem Profil und einer Periode mit Profilanteil > 0 ist `run.heating` gesetzt, wie bisher. `byProfile` = Heizkostenzeile, wie bisher mit `heatingProfileId`. Der Profilabschnitt bleibt gleich. Die bestehenden Tests in `statement-pdf.pg.test.ts` decken das ab (Z. 79–83, 85–99) und laufen laut Aufrufer grün. Der Render-Test «erklärt den Zeitanteil … nach dem Heizprofil» sichert den Satz im Hinweis ab.
- **Hinweis nach Art. 8 Abs. 1 VMWG folgt der Heizkostenzeile (M-1, M-2):** pdf.service.ts:674 prüft `data.fuel` oder eine Zeile mit `heating`. Mit Profil ist `data.heating` nur gesetzt, wenn `hasHeating` gilt, es geht also kein Fall verloren. Test: Render-Test (Zeile mit `heating` ohne `data.heating`, deckt auch M-2 ab) und der letzte Schritt des Szenarios.
- **Der allgemeine Hinweis verliert seinen Heizkosten-Satz (V-1):** `sharesNote` (pdf.service.ts:614–617). `sharesNoteHeating` steht in allen vier Sprachen (de/fr/it/en; `rm` ist wie bisher ausgeschlossen). Test: Render-Test (`not.toContain('Heizprofil')`) und Szenario.
- **Regel 5** in `docs/nebenkostenabrechnung-anforderungen.md` ist nachgeführt.
- **Szenario:** ohne `@wip`; laut Plan rot mit «48/92 Tage». Die Negativprüfung hat zuerst einen positiven Anker («48/92 Tage»). Die Schritte rufen nur `seed` und die Frage `downloadedPdfText` über `verwalter.sees`, keine Locators. Das Heizprofil «Winter» mit 0 % von Juni bis August kommt aus der `Grundlage`. Die Formulierung sagt, was der Verwalter will, nicht wie.
- **Plan:** `Scenario red`, eine `Test red`-Zeile für jeden der drei neuen Tests, `Skills: tdd, ponytail, ponytail-review`; nur die aktuelle Session.
- **Konventionen:** keine UI-Texte (die PDF-Texte liegen in den Backend-Übersetzungen, vierfach), keine Änderung an der API-Antwort (`byDays` bleibt intern), keine fachfremden Änderungen. Alle geänderten Dateien sind Prettier-sauber (`bunx prettier <f> | diff`).
- **Einfachheit:** Der Parameter `statement` in `lineItemOf` ist durch `byProfile` ersetzt, es bleibt nichts Ungenutztes. Das Feld `heating` auf `LineItem` braucht es für M-2.

## Nicht bestätigt

- lint, check, deepcheck:audit, fallow, test:coverage (2432), Backend-Tests (611), type-check und E2E `statement-detail.feature` (chromium + api, 24 passed): vom Aufrufer gemeldet, nicht neu ausgeführt. Die Backend-Tests brauchen die Test-Datenbank, E2E ist ausgeschlossen.
- Die im Plan genannten Rot-Meldungen der drei Tests und des Szenarios habe ich nicht nachgestellt, nur gegen den Code auf 25ce827 plausibilisiert: `byProfile` kam dort aus `statement.heatingProfileId`, `byDays` fehlte, und der Satz stand immer im Hinweis.
- Ob das PDF nach einer späteren Änderung eines eigenen Heizprofils noch zur gespeicherten Abrechnung passt (`heatingOf` rechnet mit dem aktuellen Profil neu): Das gab es schon vorher, #137 ändert es nicht.
