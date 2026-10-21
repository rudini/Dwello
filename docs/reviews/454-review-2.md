# Code-Review #454, Runde 2 (Re-Review)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-454-code` (a96fc0a0), Delta `git diff 5dde9bb9 a96fc0a0` ohne `docs/reviews` und `docs/design/personas` (fa464b46, 808aab46, cff869b2, a96fc0a0). Vorbericht: `docs/reviews/454-review-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | behoben | `CORRECTED` enthält jetzt `overdue` (statement-invoices.service.ts:67). Der pg-Test «ist auch bei einer überfälligen Abrechnung fällig» ist ohne den Fix rot. Das Szenario «Überfällige Abrechnung mit danach erfasster Rechnung als Aufgabe» (dashboard.feature:144–149) hat kein `@wip`, und sein Schritt existiert (dashboard.steps.ts:52). |
| C-2 | behoben | `statement-changed-invoices.json` enthält `correctionDeclinable` und `correctionLowers`. `invoice-list-period.json` ist neu, wird in api-contracts.pg geprüft und von `invoices.test.ts` gelesen. |
| C-3 | behoben | Die Kommentare stehen wieder über ihren Funktionen (backend.ts, tasks/ und targets/statement-detail.ts). |
| C-4 | behoben | `statement-actions.test.ts` hat den Aufruf und die Ablehnung mit Vertrag `statement-correction-not-due.json`. Der zugehörige Vertragstest steht in api-contracts.pg. |
| C-5 | behoben | Die Seite nutzt dieselbe Regex wie der Loader (`+page.server.ts:19`). Der DOM-Test mit `2025-13` ist ohne den Fix rot. |
| C-6 | behoben | `statement-unaffected-detail/unaffected` und `statement-declined-detail/declined` stehen in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature`. Die Daten kommen aus `correctionStates` in fixtures/screens.ts. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Minor | docs/api-specification.md:246, 248 | Die API-Spezifikation ist nicht nachgeführt. Bei `changed-invoices` fehlt `correctionLowers`, und `correctionDue` gilt dort nur für «a sent, paid or settled statement». Seit C-1 gehört `overdue` dazu. Bei `decline-correction` fehlt der neue Code `STATEMENT_CORRECTION_NOT_RECALCULABLE`. |
| C-8 | Major | src/routes/statements/[id]/LaterChanges.svelte:55–60; tests/e2e/features/ | Zwei sichtbare Verhaltensänderungen haben kein Szenario: die Schaltfläche «Abrechnung berichtigen» im Hinweis (Persona P-1) und der Satz `statements_later_lowers`, wenn die Neuberechnung den Saldo senkt (V-32). Ein `No scenario: <reason>` gibt es auch nicht. |
| C-9 | Minor | tests/a11y/screens.json; tests/e2e/fixtures/screens.ts:25–42 | Den Zustand «Saldo würde sinken» mit dem neuen Satz `statements_later_lowers` zeigt kein Bildschirmzustand. Deshalb prüft kein Sprachlauf, ob fr/it/en dort kein Deutsch zeigen, und kein axe-Lauf prüft den zweiten Absatz im Alert. Die neue Schaltfläche im Hinweis ist dagegen abgedeckt, weil `statement-sent-detail/default` (Bruno 2025, überfällig, mit später erfasster Rechnung) sie jetzt zeigt. Es kommt kein neues Bedienelement dazu, deshalb Minor (wie C-6). |
| C-10 | Minor | src/__tests__/statement-pages.dom.test.ts:673–676, 684–687 | «bietet im Hinweis kein Berichtigen an, wenn es nichts ändert» und «warnt, solange das Berichtigen fällig ist» bestehen schon auf 5dde9bb9. Dort gibt es den Knopf nicht, und der Ton ist immer `caution`. Sie waren also nie rot. Die Commit-Nachricht von cff869b2 nennt sie nicht als Pins von bestehendem Verhalten (CLAUDE.md, Workflow 2). |

## C-8 (Major): keine Szenarien für «Abrechnung berichtigen» im Hinweis und den Satz zum sinkenden Saldo

**Warum falsch:** CLAUDE.md, Workflow 1, verlangt für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario ohne `@wip` oder ein `No scenario: <reason>`. Das gilt auch für den Fix eines Persona- oder Fach-Befunds. cff869b2 fügt dem Hinweis eine Bedienung hinzu: Der Liegenschaftsverwalter öffnet die Berichtigung direkt aus dem Hinweis. a96fc0a0 zeigt einen neuen Satz, der erklärt, warum «Nicht berichtigen» fehlt. Beides prüfen nur DOM-Tests mit gesetzten Props (`correctionLowers: true` von Hand). Ob das Backend `correctionLowers` in einem echten Fall liefert (gelöschte Rechnung, V-35) und die Seite den Satz dann zeigt, prüft keine Schicht über den Bausteinen hinweg. Der pg-Test prüft nur das Feld.

**So zeigt man den Fehler:** `grep -rn "tiefere Nachzahlung\|later-correct\|aus dem Hinweis" tests/e2e` findet nichts. Nimmt man in `LaterChanges.svelte` die Zeilen 55–60 heraus (Satz und Knopf), bleibt jedes Szenario grün. Fix: ein Szenario in `dashboard.feature` oder `statement-detail.feature`, in dem eine abgerechnete Rechnung gelöscht wird. Dann zeigt die Abrechnung «… eine tiefere Nachzahlung oder eine höhere Rückerstattung …», bietet «Nicht berichtigen» nicht an, und «Abrechnung berichtigen» aus dem Hinweis öffnet die Bestätigung. Alternativ ein begründetes `No scenario`.

## Ponytail-Review (Delta)

- Das Delta ist knapp. `correctionLowers`, `invoice-list-period.json` und `statement-correction-not-due.json` werden alle genutzt. Den Vorschlag `{#if grouped}…{:else}` aus Runde 1 hat das Delta übernommen. Es bleibt kein ungenutzter Code zurück.

net: 0 lines possible.

## Geprüft und in Ordnung

- `declineCorrection`: Ist die Abrechnung nicht neu berechenbar (`!result`), kommt die Ablehnung jetzt mit eigenem Code vor `LOWERS_BALANCE`. Status 409 kommt aus `correctionStatus`. Die UI bietet den Knopf in diesem Fall nicht an (`correctionDeclinable` false), die Ablehnung kommt also nur bei einer veralteten Seite. Der Text `backend_statement_correction_not_recalculable` steht in allen vier Sprachen. `result` geht weiter nicht an den Client (Route entfernt es).
- `recalculation`: `lowers` und `raises` schliessen sich aus. Bleibt der Saldo gleich und ändert sich nur ein Anteil, ist keins von beiden gesetzt. Das ist V-30, wartet auf den Product Owner und wird hier nicht gemeldet.
- `LaterChanges`: Knopf «Abrechnung berichtigen» (secondary) und «Nicht berichtigen» (ghost) erscheinen nur bei `status !== 'draft' && correctionDue`. Ersetzte Abrechnungen sind aussen ausgeschlossen. `oncorrect` öffnet dieselbe Bestätigung wie `MoreActions`. Ton `info` nur ohne fällige Aufgabe. Die Knöpfe sind 48 px hoch (`min-h-12`) und nutzen nur Tokens. `design-guard` ist grün.
- Messages: geänderte und neue Schlüssel (`backend_statement_correction_lowers_balance`, `…_not_recalculable`, `statements_later_lowers`) stehen in allen vier Dateien.
- BFF `laterChanges` reicht `correctionLowers` weiter. Die Load-Tests sind angepasst.
- Rote Tests: Der C-1-pg-Test, das Szenario C-1, der C-5-DOM-Test, die P-1-Positivprüfung, P-7 `info`, der V-32-Satz, V-35 (`correctionLowers`) und V-31 (neuer Code) scheitern alle ohne die Änderung. Die Tests von C-4 scheitern ohne die Action (sie ist auf dem Basis-Commit vorhanden, aber ohne Test). Ausnahme: C-10.
- Seed `correctionStates`: Mia (ausgezogen 30.06.) trägt nichts von der Rechnung Okt.–Dez., Noras Saldo steigt. `declineCorrection` geht über die API. Die E2E-Schichten bleiben eingehalten (Tasks warten mit `Wait.until`, kein direkter Seitenzugriff in Steps).

## Nicht bestätigt

- `bun run lint`, `bun run check`, fallow auf cff869b2: vom Aufrufer gemeldet. Auf a96fc0a0 nicht gelaufen. Ich habe sie nicht wiederholt.
- `cd backend && bun run type-check`: weder vom Aufrufer gemeldet noch von mir gelaufen.
- Selbst gelaufen auf a96fc0a0: `statement-invoices.pg.test.ts` (41 grün, `dwello_test_r454e`), dazu vitest `statement-pages.dom`, `statement-actions`, `invoices`, `invoice-pages.dom` (318 grün) sowie `design-guard` und `i18n*` (489 grün).
- `api-contracts.pg.test.ts` (neue Verträge `invoice-list-period`, `statement-correction-not-due`): vom Aufrufer gemeldet (auf cff869b2), nicht wiederholt.
- E2E (accessibility, sprachen-bildschirme, dashboard, invoices): vom Aufrufer gemeldet, grün auf 808aab46. cff869b2 und a96fc0a0 ändern danach den Hinweis (neuer Knopf, Ton, Satz) in den Zuständen `statement-sent-detail/*`, `unaffected` und `declined`. Ob axe dort und die Sprachläufe weiter grün sind, ist auf dem geprüften Commit nicht belegt. E2E habe ich gemäss Auftrag nicht gestartet.
- Ob die neuen Zustände `unaffected`/`declined` mit dem zusätzlichen Gebäude «Rebhof» im gemeinsamen Seed andere Bildschirmzustände ändern (Übersicht, Listen): nur über den gemeldeten grünen Lauf auf 808aab46. Gelesen habe ich `tests/e2e/fixtures/screens.ts:25–42, 213, 239–240`.
