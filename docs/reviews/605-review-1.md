# Code-Review #605, Runde 1 (9e19d11..954a436)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/dashboard/+page.server.ts:180-181, 211 | `once` behebt nur die eine Hälfte des Rennens. Die zwei Lesevorgänge bleiben getrennt. Verschiebt sich eine Zahlungsfrist von der Zukunft in die Vergangenheit (wie in der Screens-Fixture), nachdem `status=overdue` gelesen wurde und bevor `status=sent` gelesen wird, steht die Abrechnung in keiner der beiden Listen: Zahlungsfrist und Mahnungs-Zählung fehlen dann auf der Übersicht. Ein einziger Lesevorgang `statements?status=open&limit=…` (Backend `statusCondition`: `open` = `status = 'sent'`, also überfällig und versendet zusammen, in einer Abfrage) schliesst Duplikat und Lücke zugleich aus und macht `once` und eine Anfrage überflüssig. Die Reihenfolge von `dueStatements` spielt keine Rolle: `overviewDeadlines` sortiert nach Tagen, `workTasks` zählt nur. Das Limit wäre dann 100 statt 2 × 100 (oder `limit=200`). |

## Ursache

Bestätigt. `statusCondition` (backend/src/services/statement.service.ts:114-127) teilt `sent` beim Lesen nach `paymentDeadline < swissToday()` auf. Die zwei Aufrufe von `list()` in `Promise.all` laufen als eigene Abfragen. Wenn sich die Zahlungsfrist zwischen den beiden Abfragen ändert, kommt dieselbe id zweimal in `dueStatements` und daraus zweimal in die Zahlungsfristen. Damit ist der Schlüssel `kind + id` in DeadlineList.svelte:22 doppelt. Der Ausbau bestätigt ausserdem einen Folgefehler, den `once` mitbehebt: `workTasks` (src/lib/overview.ts:230-232) zieht beim Doppel dieselbe Abrechnung zweimal von `statementCounts.overdue` ab.

Andere Quellen doppelter Schlüssel auf der Übersicht habe ich nicht gefunden:
- Vertragsende: eine einzige Abfrage `contracts?status=active`.
- Aufgaben-ids `successor-`, `fixed-term-`: stammen aus der einzigen Abfrage `contracts?limit=1000`.
- `old-address-`: per Map dedupliziert.
- `former-documents-`: per Set dedupliziert.
- `correct-`: eine Liste aus `outdatedStatements()`.
- TaskCard-Links: aus einer Map.

## Test

Der neue Ladetest (dashboard.test.ts:231-244) wäre ohne den Fix rot. Die Zahlungsfrist im Test ist 45 Tage (`tests/contracts/config.json`, laut Kommentar im Test). Damit fällt auch das Duplikat 2026-11-09 (30 Tage) in das Fenster, und das Ergebnis wäre `['2026-09-28', '2026-11-09']`. «No scenario: Rennen zwischen zwei Lesevorgängen» ist stichhaltig.

Geprüft: Diff (2 Dateien) vollständig gelesen; Ursache im Backend-Filter; alle `#each`-Schlüssel der Übersicht; Texte, Tokens und E2E sind nicht betroffen.

## Nicht bestätigt

- Dashboard-Tests (31), lint, check, dashboard.feature chromium + api (50): vom Aufrufer gemeldet. Den Rerun mit `bunx vitest run src/__tests__/dashboard.test.ts` hat die Deny-Regel auf `/home/user/Dwello/node_modules` verhindert, das `node_modules` des Worktrees verweist dorthin.
- Ob der Firefox-Lauf von sprachen-bildschirme.feature «dashboard default» jetzt stabil ist: nicht ausgeführt (E2E ist ausgeschlossen). Die Aussage stützt sich nur auf das Lesen des Codes.
