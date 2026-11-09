# Code-Review #1375, Runde 1 (f75f26ff..b5b09639)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, Backend-`type-check`, `bunx vitest run` (4881 bestanden), E2E `-g "Zahlungseingang direkt aus der Liste"` (chromium).
- Rot der neuen Tests nur durch Lesen beurteilt: `statement-endpoints.test.ts:92-108` (403 ohne Header, kein Backend-Aufruf) schlägt auf der Basis fehl, weil der Handler ohne Prüfung `markStatementPaid` aufruft; `statement-pages.dom.test.ts:431-448` schlägt ohne den neuen Header fehl (`[null]`). Das neue Szenario hält laut Commit-Nachricht bestehendes Verhalten fest; die Basis zeigt es (die Route prüfte nichts), und es ist kein Bugfix, deshalb braucht es keinen Rotlauf.
- `tools/arch-baseline/out/imports-file.csv:1087,2404` nennt noch die gelöschte Route `send-reminder/+server.ts`. Das ist eine erzeugte Gate-Datei unter `tools/`. Ob ein Gate sie mit dem Code abgleicht, habe ich nicht geprüft; laut Aufrufer ist `fitness` grün.

Geprüft: beide Handler aus der Anforderung (mark-paid prüft `validateXsrfToken` vor dem Lesen des Body; send-reminder hat keinen Aufrufer mehr, `sendStatementReminder` bleibt für die Form-Action `?/remind` in `src/routes/statements/[id]/+page.server.ts:130` in Gebrauch, `reminder-paid-refused.json` für `documents.test.ts` und `reminders.pg.test.ts`), das XSRF-Cookie ist lesbar (`httpOnly: false`), keine weiteren Aufrufer von mark-paid ausser der Liste, eine 403 zeigt im Dialog den allgemeinen Satz `statements_mark_paid_failed`, keine neuen Texte oder Bildschirmzustände, Screenplay-Schichten (Step → Task → Targets; Task wie `markStatementPaid` in `tasks/statement-detail.ts:75`, die Frage `listedStatement` ist ein Text-Wert), «Bezahlt» kommt vor der Zahlung nicht im Zeilentext vor, Grundlage von `statements.feature`, ponytail-review: schlank genug, nichts zu kürzen.
