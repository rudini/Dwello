# Code-Review 1236, Runde 3 (Schlussrunde Fallback, Commit 7876916)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `backendJson` (`src/routes/statements/+page.server.ts:80`) wandelt einen nicht lesbaren JSON-Body über `.catch(() => error(502, …))` in denselben 502 mit «Die Abrechnungen konnten nicht geladen werden.» wie die übrigen gescheiterten Ladevorgänge (Anforderung 1); der neue Fall «kein JSON liefert» (`src/__tests__/statement-list-load.test.ts:144`) scheitert ohne den Fix am `SyntaxError` statt am 502, also rot ohne die Änderung. Der Fall «die Gebäude nicht liefert» (Zeile 134–142) lässt nur den Gebäude-Request scheitern; die Abrechnungen beantwortet er mit Statuszahlen ohne `total`, die Seite 1 bleibt ohne Redirect bestehen, sodass der Test nur am Gebäude-Request rot wird, wenn man ihn ohne `backendJson` laufen lässt (Anforderung 4). Die Zurückweisungen halten: (2) `?page=2abc` öffnet nach `parseInt` die Seite 2. Das ist eine echte Seite, und keine Regel und kein Szenario verlangen etwas anderes. (3) Der Diff ändert weder Fehlerbildschirm noch Texte. Ein BFF-zu-Backend-Fehler lässt sich im E2E-Stack nicht erzeugen (`tests/e2e/CLAUDE.md`, «No scenario»); die Lücke ist in `docs/reviews/workflow-notes-issue-1236.md` vermerkt. Der Diff berührt keine neuen Texte, keine `messages/*.json`, keine Verträge, kein E2E und nichts ausserhalb der Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/statement-list-load.test.ts` (24 bestanden, Rotläufe beider neuer Fälle), `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht selbst ausgeführt (keine `node_modules` im Worktree).
- Prettier-Sauberkeit der neuen Zeilen im Test: nicht geprüft (bestehende Datei, CI prüft nur hinzugefügte Dateien).
