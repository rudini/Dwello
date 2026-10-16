# Code-Review W4b (Runde 3, letzte Runde, zugleich Abschlussreview vor dem Push)

Geprüft: `git diff cdfdc23 b4682dc` im Worktree `review-w4b-code3` (detached auf b4682dc). Alle 12 geänderten Dateien gelesen. Dazu gelesen: `updateStatementStatus` und `resetPayment` (statement.service.ts:448-517), `demo-data.ts:50-57`, Mapper `toStatement` (src/lib/server/statement.ts), `tests/e2e/questions/form.ts`, `common.steps.ts:32-34`, Task `resetPayment` (tests/e2e/tasks/statement-detail.ts:59), `backend_statement_not_paid` in allen vier `messages/*.json`, `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | erledigt | backend/src/services/statement.service.ts:483, :506-507 | Verworfen wird nur ein PDF mit `pdfGeneratedAt >= paymentRecordedAt`; `paymentRecordedAt` wird bei jedem Wechsel auf `paid` gesetzt (auch Saldo 0 beim Versand, `settled`) und beim Zurücksetzen gelöscht. Demodaten: PDF vor `updateStatementStatus(…'paid')` erstellt (demo-data.ts:55-56), bleibt also. Neuer pg-Test (PDF am selben Tag vor dem Erfassen) wäre mit der alten Regel rot (`madeOnDay >= paidDate`) |
| C-12 | erledigt | tests/e2e/features/statement-detail.feature:113-124 | Szenario «Zahlung zurücksetzen behält das PDF des Versands»: PDF vor der Zahlung, alles am selben Tag; mit der alten Regel wäre das PDF samt Verlaufszeile «PDF erstellt» weg, also rot |
| C-13 | erledigt | statement-detail.feature:126-134, implementation_plan.md:13 | Szenario für die Ablehnung auf veralteter Seite; Plan-Begründung angepasst |
| C-14 | erledigt | tests/e2e/steps/statement-detail.steps.ts:135 | Leerzeile entfernt |
| C-15 | erledigt | statement.service.ts:506 | Tagesvergleich entfällt mit der neuen Regel |
| C-10 | Nit | tests/e2e/features/statement-detail.feature:89 | aus Runde 1, unverändert offen |
| C-16 | Minor | statement.service.ts:507; migrations/0007:4-5 | Bei `payment_recorded_at` NULL (vor der Migration bezahlt) bleibt jedes PDF, auch eines, das als bezahlt erstellt wurde und «Bezahlt am …» nennt (statement-pdf.service.ts:136). Für diese Altfälle wäre die vorige Regel (PDF-Tag >= `paidDate`) die vorsichtigere Rückfallregel (im Zweifel neu erstellen statt ein Bezahlt-PDF stehen lassen). Der NULL-Zweig hat keinen Test. Vom Aufrufer bewusst so beschrieben; nur bei Abrechnungen relevant, die vor dem Deploy bezahlt und danach als bezahlt neu als PDF erstellt wurden |
| C-17 | Minor | tests/e2e/steps/statement-detail.steps.ts:255-257 | Neuer Schritt «meldet die Detailseite der Abrechnung {string}» dupliziert `common.steps.ts:32` «sieht der Liegenschaftsverwalter die Fehlermeldung {string}» (gleiche Frage `errorMessageShown`). Ponytail `reuse:` den bestehenden Schritt verwenden, Schritt und Import löschen. Die Frage antwortet ja/nein statt mit dem gezeigten Text (bestehendes Muster, nicht neu eingeführt) |
| C-18 | Nit | statement.service.ts:483 | Dass auch die automatische Zahlung bei Saldo 0 `payment_recorded_at` setzt, folgt aus demselben Ausdruck, hat aber keinen eigenen Test |

Ponytail-Review des Deltas: `statement-detail.steps.ts:L255-257: reuse: Schritt dupliziert common.steps.ts:32. Den bestehenden Schritt im Szenario verwenden.` Sonst nichts; `net: -5 lines possible.`

Keine Blocker, keine Majors offen.

## Bestätigt

- C-11: Regel nach Zeitpunkt des Erfassens; alle Wege auf `paid` laufen über `updateStatementStatus` (grep `'paid'` in backend/src: nur dort und demo-data über dieselbe Funktion). `paymentRecordedAt` gelangt nicht zum Client: `toStatement` mappt Felder einzeln; der Contract-Drift prüft nur die Felder der Datei.
- Bestehende pg-Tests passen zur neuen Regel: «behält das PDF, das vor der Zahlung erstellt wurde» (PDF gestern, nach dem Erfassen gesetzt, < `paymentRecordedAt`), «verwirft das PDF, das die Zahlung bestätigt» (PDF nach dem Erfassen, `>=`).
- Migration 0007 laut Aufrufer nicht auf main; Bearbeitung an Ort ist damit zulässig (`backend/CLAUDE.md` verbietet nur angewandte Migrationen). Schema, `docs/data-model.md`, `docs/api-specification.md` stimmen mit dem Code überein.
- Szenario C-13: der Text «Die Abrechnung ist nicht als bezahlt erfasst. Laden Sie die Seite neu.» ist `backend_statement_not_paid` in de; Schlüssel in allen vier Dateien. Kein neuer UI-Text im Delta.
- Features ohne UI-Wörter («klickt», «Button»); Schritte rufen nur Tasks, Fragen und `seed`.
- Formatierung: Prettier meldet für die geänderten Code-Dateien keine Abweichung.
- Nichts im Delta ohne Bezug zur Anforderung; `docs/reviews/w4b-review-2.md` und `w4b-datenpruefung-1.md` sind Berichte der Runde (D-1 der Datenprüfung ist mit C-11 erledigt).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt: `bun run lint`, `bun run check`, Backend type-check, `bunx vitest run` (2640), pg-Tests statement-lock, api-contracts, dashboard, demo-data (60), E2E chromium+api `statement-detail.feature` (41), axe- und Sprachzeilen statement-sent-detail und statement-paid-detail (12), volle E2E (781) auf 7e13aaa (nicht auf b4682dc).
- Rotlauf der beiden neuen Szenarien vom Aufrufer gemeldet. Für «Zahlung zurücksetzen, die inzwischen schon zurückgesetzt ist» ändert der Delta keinen App-Code (kein Diff in `src/`, `messages/`); das Szenario wäre also schon auf cdfdc23 grün und kann nur durch Herausnehmen des Codes rot gesehen worden sein. Das Szenario selbst prüft den Code-Text statt des allgemeinen Fehlertexts und ist damit aussagekräftig.
- Ob die Fehlermeldung der Ablehnung auf der Detailseite als eigener Zustand in `tests/a11y/screens.json` gehört: nicht durch den Delta eingeführt (Ablehnung und Anzeige bestanden schon), nicht geprüft.
- pg-Tests nicht selbst ausgeführt (würde `dwello_test` neu anlegen); Präzision `timestamp` (µs) gegenüber JS (ms) und die Gleichheit im Fall «PDF in derselben Millisekunde» nur durch Lesen beurteilt (beide Spalten gleich gemappt, `>=` verwirft im Zweifel).
