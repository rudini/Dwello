# Code-Review #788 Punkt 5b, Runde 2 (Delta 925bb6c9..c47b3d6e)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|---|---|---|
| C-1 | Minor | Behoben. Das JSDoc zu «Abgerechnet bis» steht wieder direkt über `checkBilledUntil` (`backend/src/services/contract.service.ts:337-340`), das von `checkEnd` über `checkEnd`. |
| C-2 | Minor | Behoben. `contract.service.ts:524-525` prüft das gesendete Ende, sonst das gespeicherte. Die Bestätigung wird nur verlangt, wenn ein neues Ende gesendet wird. Der neue pg-Test (`contract-end-refusals.pg.test.ts:36-44`) schlägt ohne die Änderung fehl: Der alte Zweig `if (data.endDate)` übersprang die Prüfung, und ohne Abrechnung lehnt keine andere Prüfung ab. |
| C-3 | Minor | Behoben. Der Aktionstest `contract-actions.test.ts:374-383` hält fest, dass das Verhalten gleich bleibt. Auf dem Basis-Commit c49eff6d liefert `contractEndError` bei einem Formular ohne gültigen Tag denselben Text `contracts_end_missing`. Ein Rotlauf ist also nicht nötig, und die Commit-Nachricht sagt das. |
| C-4 | Minor | Offen, nicht behoben. Das ist vertretbar: Der Fall ist ein seltener Randfall, und das Neuladen der Seite hilft. Für den Merge muss er nicht behoben werden, er bleibt als Minor im Bericht. |

## Neue Befunde im Delta

Keine.

Geprüft: ob C-2 eine Speicherung ablehnt, die vorher galt.
- PUT ohne `endDate` bei einem gespeicherten Ende vor heute: `unconfirmed` ist `false`, weil `data.endDate === undefined`. Geprüft wird nur Ende < Beginn, und das hält bei gültigen Daten. Keine neue Ablehnung.
- Beginn verschoben bei einem Vertrag ohne Ende: `endDate` ist `null`, `checkEnd` läuft nicht.
- Ende entfernt (`endDate: null`): `checkEnd` läuft nicht.
- Gesendetes Ende gleich dem gespeicherten, das vor heute liegt: keine Bestätigung nötig, wie vorher.
- `startDate: ''`: `newDates` macht daraus `undefined`, es bleibt der gespeicherte Beginn.
- Die Formate sind vergleichbar: `date()` von Drizzle liefert Strings im Format `YYYY-MM-DD`, die Route verlangt `format: 'date'`.

Neu abgelehnt wird nur ein gespeicherter Vertrag mit Ende vor dem Beginn. Ihn kann ausschliesslich ein direkter `POST` an die API anlegen, denn `createContract` prüft Ende < Beginn nicht. Das BFF lehnt beim Erfassen schon ab (`contract-form.ts:118`). Eine solche Ablehnung trifft also schon ungültige Daten, und «Bearbeiten» schickt das Ende immer mit, sodass sich der Vertrag korrigieren lässt. Das gilt hier nicht als Befund.

## Nicht bestätigt

- Backend `bun test` (1590) und backend type-check: vom Aufrufer gemeldet. Den neuen pg-Test habe ich nur gelesen, nicht ausgeführt, weil der Review-Worktree ohne Datenbanklauf bleibt.
- `bunx vitest run` (3641) und lint: vom Aufrufer gemeldet. Mein erneuter Lauf von `bunx vitest run src/__tests__/contract-actions.test.ts` im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab, weil dort keine Abhängigkeiten installiert sind. Dass der neue Test `calls` als leer prüft, habe ich nur durch Lesen bestätigt.
- `bun run fitness` und die Commit-Hooks: vom Aufrufer gemeldet.
