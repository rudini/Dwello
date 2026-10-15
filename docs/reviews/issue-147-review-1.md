# Code-Review #147, Runde 1 (Commit 50c6658 auf 3fa1e2a)

Geprüft im Worktree `review-147-code`, alle 7 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | implementation_plan.md:9-16 | Plan ohne `Skills: tdd, ponytail, ponytail-review` und ohne `Test red: …`-Zeile für die drei neuen Tests (`contract-new-load.test.ts:41`, `:52`); Checkliste nicht abgehakt, obwohl Test und Fix im Commit sind. |
| C-2 | Minor | src/routes/contracts/new/+page.server.ts:32-39 | `.catch(() => [])` verwirft den Netzwerkfehler; das Log zeigt dann nur `undefined undefined`. Vorher wurde der Fehler selbst geloggt; die Diagnose ist schlechter als vor dem Fix. |
| C-3 | Nit | src/routes/contracts/new/+page.server.ts:40 | Immer Status 500, während die übrigen Loader den Backend-Status weitergeben (`contracts/[id]/edit/+page.server.ts:22`, `config/categories/+page.server.ts:10`); ein 403 vom Backend zeigt so nicht `error_403`. Vertretbar. |
| C-4 | Nit | messages/de.json:642 | Der Text nennt immer «Mieter und Wohnungen», auch wenn nur eine der beiden Listen fehlt. Ein Text für beide ist die einfachere Lösung; nur zur Kenntnis. |

Keine Blocker, keine Major.

## Bestätigt

- **Behauptung des Implementierers (#152):** stimmt. `src/routes/contracts/[id]/edit/+page.server.ts:14-38` lädt nur `/api/v1/contracts/:id` und bildet Mieter und Wohnung aus dem Vertrag (Zeile 25-31); im Edit-Ordner gibt es keinen weiteren `fetch`. Dass das so gewollt ist, belegen `contract-edit-load.test.ts:11` und das Archiv (`docs/archive/implementation-plan-verlauf.md:5405`). Die Lücke gibt es also nur auf `contracts/new`, und dort ist sie behoben.
- **Ladefehler statt leerer Auswahl:** `new/+page.server.ts:34-41` wirft `error(500, m.contracts_choices_load_failed())`, wenn eine der beiden Antworten nicht ok ist oder `fetch` wirft. `src/routes/+error.svelte:11-14` zeigt bei 500 `page.error.message` mit dem Hinweis «erneut versuchen», also dieselbe Fehlerseite wie bei einem fehlgeschlagenen Vertragsladen (`contracts_load_failed`, ebenfalls über `error(...)`).
- **Tests auf der unteren Ebene:** Es gibt Tests mit fehlgeschlagener Mieter- und mit fehlgeschlagener Wohnungs-Antwort (`it.each`, `contract-new-load.test.ts:41-50`) und einen für eine Netzwerk-Exception (`:52-57`). Mit dem alten Code (`return { tenants: [], apartments: [] }`) wären sie rot. Erneut ausgeführt: `bunx vitest run src/__tests__/contract-new-load.test.ts`, 5/5 grün.
- **Texte:** Der neue Schlüssel steht in allen vier `messages/*.json` (Zeile 642), wird verwendet und ist sinnvoll übersetzt.
- **Kein Szenario:** Begründung im Plan (Zeile 9) gemäss CLAUDE.md Workflow 1 (Fehler nur zwischen Load-Funktion und Backend). Keine neue UI-Zustand: Die Fehlerseite ist bereits `server-error` in `tests/a11y/screens.json:50`.
- **Umfang:** Der Diff betrifft nur die Anforderung. Das Entfernen von `try/catch` ändert nur die Einrückung des unveränderten Mapping-Codes.

## Nicht bestätigt

- `bun run test:coverage` (152 Dateien, 2447 Tests, Coverage-Grenzen), `bun run lint`, `bun run check`, Backend `bun run test` und `bun run type-check`, `bun run deepcheck:audit`: vom Aufrufer gemeldet, nicht erneut ausgeführt (ausser der einen Testdatei oben).
- Die Historie von #152 im Worktree ist flach (`git log` zeigt nur 3fa1e2a); die Behauptung ist aus dem aktuellen Code, den Tests und dem Archiv belegt, nicht aus dem Commit von #152.
