# Code-Review 1236, Runde 2 (Abschlussrunde, Delta e84032c..150cd9f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1 (Teil `?page=…`; den Teil `?building=foo` lässt der Aufrufer bewusst so, wie in der Anforderung beschrieben)

Geprüft: In `src/routes/statements/+page.server.ts:84` ergibt `Math.max(1, parseInt(… ?? '') || 1)` für `0`, `-3`, `abc` und einen fehlenden Parameter jeweils Seite 1, also `offset=0`. `backendQuery`, die Umleitung auf die letzte Seite und das zurückgegebene `page` bekommen denselben Wert. Die drei neuen Fälle in `src/__tests__/statement-list-load.test.ts:111` schlagen beim Lesen auf der Basis fehl, denn dort hiess es `offset=-10`, `offset=-40` und `offset=NaN`. Die Antwort kommt aus dem Contract `tests/contracts/statements.json`. Die umformatierten Zeilen 94–97 stammen aus e84032c auf diesem Branch, es sind also eigene Zeilen. Ponytail: Die Änderung ist eine Zeile, nichts bleibt ungenutzt. Ein neues Szenario braucht es nicht: Das Verhalten zeigt sich nur an einer von Hand gebauten Adresse, und der Unit-Test hält es auf der niedrigsten Ebene fest.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run src/__tests__/statement-list-load.test.ts` (22 bestanden), der rote Lauf der drei neuen Fälle vor der Code-Änderung, `bun run lint` und `bun run check` vor diesem Delta (laufen laut Aufrufer erneut).
- Dass `origin/main` schon eingemischt ist: Im Worktree ist `origin/main` (ed4f826) Vorfahre von HEAD, ob er aktuell ist, habe ich nicht geprüft.
