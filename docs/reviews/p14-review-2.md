# Code-Review P-14 (#110), Runde 2 (Schlussrunde, nur Delta)

Worktree: `review-p14-code2`, Commit 5e45936, Bereich `git diff 3431569 5e45936` (1 Commit, 7 Dateien, alle gelesen).

Ergebnis: **keine Blocker, keine Major.** 1 Nit.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Nit | `implementation_plan.md:19` | «Checks before push; workflow review; archive session» ist abgehakt, aber die Session steht noch im Plan und ist nicht im Archiv. `bun run lint`/`check` liefen laut Aufrufer vor diesem Delta, nicht darauf. Den Haken erst setzen, wenn die Session archiviert ist und die Prüfungen auf dem letzten Commit gelaufen sind. |

## Delta gegen die Befunde aus Runde 1

- **C-1** (`tests/e2e/screenplay/interactions.ts:180`): `configurable: true` ist gesetzt. Ein zweites `Browser.preferLanguages` im selben Szenario definiert `navigator.languages` jetzt neu und wirft nicht mehr. Behoben.
- **C-3** (`src/hooks.server.ts:47-48`): `Vary: Accept-Language` hängt jetzt ohne Bedingung an jeder Antwort, die durch `resolve` läuft. Die Antworten aus `session` (`redirectTo`, 401-`json`) gehen nicht durch dieses `resolve` und bekommen den Kopf nicht. Sie hängen auch nicht von der Sprache ab, das ist also richtig. Ich habe nachgeprüft, ob eine Antwort unveränderliche Header haben kann: In `src` gibt keine Route eine Antwort von `fetch()` direkt zurück, und es gibt kein `Response.redirect`/`Response.error` (grep nach `Response.(redirect|error|json)`, `return fetch(`). `file-proxy.ts:5` und `api-proxy.ts` bauen jeweils eine neue `Response`. `append` kann also nicht werfen. Der Kommentar passt zum Code. Der Unit-Test «sagt Zwischenspeichern …» (`i18n.test.ts:87-89`) deckt das weiter ab. Behoben.
- **C-4** (`interactions.ts:178`): Jetzt steht `route.fallback({ headers })` da. Andere Handler, die vorher registriert wurden (z. B. `toWithScriptsHeldBack` mit `continue()`), bekommen die geänderte Kopfzeile. Zwei Dinge bleiben wie vorher: Ein Handler, der später registriert wird und `continue()` aufruft, läuft zuerst und übergeht die Kopfzeile. Und `FailRequests.noLonger` (`unrouteAll`) hebt sie auf. Heute kombiniert kein Szenario diese Fälle. Kein neuer Befund.
- **C-2, C-5**: bleiben unverändert, wie angekündigt (Minor/Nit aus Runde 1).

Ponytail-Review des Delta: `hooks.server.ts` ist eine Zeile kürzer, sonst ist nichts zu kürzen. `net: 0 lines possible.`

Übriges Delta: Persona-Berichte (`docs/design/personas/anna-p14.md`, `weber-p14.md`), `docs/reviews/p14-review-1.md`, `docs/reviews/workflow-notes-issue-110.md`, Plan. Das sind nur Dokumente und Workflow-Dateien, sie ändern kein Verhalten. Jede Datei gehört zur Anforderung. Was die Personas gefunden haben (Anna P-1/P-2, die französische Einzahl «9 Loué», Dr. Webers Notiz zur italienischen Höflichkeitsform), ordnet der Aufrufer selbst ein. Hier ist es nicht zu bewerten.

Pflichtpunkte: Das Delta enthält keine neuen Texte, Bildschirme oder Szenarien. Die Layer der Steps sind unverändert (die Änderung liegt nur in der Interaktion). Nichts gehört nicht zur Anforderung.

Rote Tests: Das Delta bringt keinen neuen Test. Ohne C-3 ist der Vary-Test weiter rot (unverändert). C-1 und C-4 sind Robustheit, und kein Szenario zeigt sie heute. Ein roter Test lässt sich für sie also nicht verlangen.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/i18n.test.ts`, 18 bestanden. `bunx eslint --max-warnings 0 src/hooks.server.ts tests/e2e/screenplay/interactions.ts`, ohne Befund. Das volle `bun run lint` habe ich nicht ausgeführt, nur die beiden geänderten Code-Dateien.
- `bun run check`, `cd backend && bun run type-check`: nicht ausgeführt, nicht für 5e45936 gemeldet.
- `bun run test:e2e -- --project=chromium tests/e2e/features/sprachen.feature tests/e2e/features/privacy.feature` (32 bestanden): vom Aufrufer gemeldet.
- Wie Playwright `fallback`-Overrides mit einem `continue()` eines älteren Handlers verbindet, habe ich nicht im Paket nachgelesen (`node_modules` ist gesperrt). Ich stütze mich auf das dokumentierte Verhalten.
