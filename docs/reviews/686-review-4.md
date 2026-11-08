# Code-Review 686, Runde 4 (Abschluss), a6bd8f9^..a6bd8f9

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `generateStatementPdf` (`src/lib/server/statement-actions.ts:121-126`) fängt die abgewiesene Anfrage ab und gibt `{status: 500, message: m.statements_pdf_failed()}`; die Aktion `generatePdf` (`src/routes/statements/[id]/+page.server.ts:108-111`) macht daraus `fail(500, {actionError})`. Der neue Test (`src/__tests__/statement-actions.test.ts:173-189`) wirft ohne die Änderung «TypeError: fetch failed» statt aufzulösen, ist also ohne den Fix rot, und prüft den Text als Wert. Der Text steht in allen vier `messages/*.json`. Client: `PdfAction.svelte` zeigt bei `result.type === 'failure'` `String(result.data.actionError)` als Fehler-Toast, also denselben allgemeinen Satz wie zuvor beim strukturierten 500 des Proxys. Hinweis: Mit JavaScript hätte auch die nicht abgefangene Ausnahme (`result.type === 'error'`) schon den Toast `m.statements_pdf_failed()` gezeigt. Sichtbar ändert der Fix damit vor allem den Weg ohne JavaScript (vorher eine Fehlerseite, jetzt die Seite mit der Ablehnung) und die Server-Ausnahme. Der Diff ist minimal, es bleibt kein ungenutzter Code zurück, und nichts Fremdes ist dabei.

## Nicht bestätigt

- Vom Aufrufer gemeldet: die 48 Tests der Datei laufen grün, ebenso lint, check und fitness (nicht ausgeführt, das Worktree hat keine `node_modules`).
- Ein E2E-Szenario für ein nicht erreichbares Backend fehlt. Der E2E-Stack kann diesen Zustand kaum herstellen, und gegenüber `main` (Proxy mit 500) ändert sich das Verhalten nicht. Ob der Pull-Request-Text `No scenario: <reason>` dafür nennt, habe ich nicht geprüft (PR-Text nicht gelesen).
- Den Weg ohne JavaScript (Anzeige von `form.actionError` auf der Seite) habe ich nicht verfolgt, weil er ausserhalb dieses Diffs liegt.
