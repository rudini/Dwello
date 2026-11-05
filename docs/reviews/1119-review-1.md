# Code-Review #1119, Runde 1 (3cddafce9..8a7392313)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `withSeedHint` (tests/e2e/fixtures/screens.ts:91-98) erkennt genau die Beispiele, die der frühe Ausstieg von `seedFor` (Zeile 105) ohne Datensätze zurückgibt; der Rückgabezweig mit Datensätzen (Zeile 366-373) setzt `building` immer aus `ids.building`. `lookAt` (tests/e2e/tasks/accessibility.ts:914-919) hüllt nur den Schritt ein, der den Zustand erreicht, nicht axe- oder Sprachbefunde; die Aufteilung in zwei `attemptsTo` ändert die Reihenfolge nicht. `every-wizard-step` bleibt ohne Hinweis, steht aber in der Liste und bekommt immer Datensätze. Die Meldung behält den ursprünglichen Fehlertext und `cause`; bei Zuständen ohne Datensätze, die aus anderem Grund scheitern (z. B. `login-error`), stimmt sie dank «if it needs some» trotzdem. Beide Unit-Tests werden ohne die Funktion rot, der zweite auch, wenn die Prüfung auf `building` fehlt (immer einhüllen). Screenplay-Schichten: Fixture-Helfer in einem Task, keine Locators in Steps. Keine UI-Texte, keine Features, kein Vertrag und kein Bildschirm betroffen; nichts ohne Bezug zur Anforderung. Ponytail: nichts zu streichen.

## Nicht bestätigt

- Abweichung vom Issue: Laut «Done means» von #1119 soll die Zeile «at once … instead of timing out» scheitern. Jetzt scheitert sie weiterhin am 10-s-Aktions-Timeout, nur mit Hinweis (die Meldung endet auf «Timeout 10000ms exceeded»). Die Begründung (ob ein Zustand Datensätze braucht, zeigt sich erst im Schritt) hält im Code: `seedFor` kennt die Bedürfnisse eines Zustands ohne Ids nur über die Liste. Ob das als «Detail, das die Aufgabe nicht ändert» gilt, entscheidet nicht dieses Review. In jedem Fall muss der Pull Request die Abweichung nennen (CLAUDE.md, «Coding guidelines»). Gesucht in: Issue-Text per REST-API, Commit-Nachricht 8a7392313 (die Abweichung steht dort nicht).
- `No scenario: <reason>` für das reine Test-Tooling: steht nicht in der Commit-Nachricht; gehört in den Text des Pull Requests (nicht vorhanden).
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run tests/unit/screens-seed-hint.test.ts` (2 bestanden, vorher rot mit «withSeedHint is not a function»), E2E mit der von Hand gekürzten Liste (Meldung wie beschrieben) und mit wiederhergestellter Liste (6 bestanden, chromium).
