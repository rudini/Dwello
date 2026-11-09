# Review #700, Runde 1 (2e967b09..4141ac6a)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

## Zu den Fragen des Aufrufers

- **93/86/94/92 statt 80:** richtig. Das Issue sagt "raise the floors … until they reach the target": 80 ist die Untergrenze, nicht die Zahl, bei der man aufhört. `docs/test-pyramid.md:56` («today's coverage, rounded down to whole percent») ist die Regel für den Floor, und die Entscheidung im Issue erlaubt jede Anhebung («only raising, never lowering»). Bei 80 würde ein Rückgang um bis zu 13 Punkte unbemerkt bleiben; das widerspricht dem Zweck des Floors.
- **Abstand von 0,57 bis 0,76 Punkten:** Ich sehe kein Risiko für zufällig rote Läufe. CI (`.github/workflows/ci.yml:308-310`) führt dasselbe `bun run test:coverage` über alle Tests aus, ohne Sharding und ohne Pfadfilter. In `src`, `tests/mocks` und `vitest.config.ts` gibt es kein `skipIf`, kein `runIf` und keine Abhängigkeit von `process.env.CI`. Damit fallen v8-Werte bei gleichem Code lokal und in CI gleich aus. Rot wird ein Lauf nur, wenn eine spätere Änderung ungetesteten Code hinzufügt. Genau das soll der Floor melden, und die Doku sieht diesen Abstand für das Abrunden auf ganze Prozent vor (wie im Backend mit 82/85).

Geprüft: Beide geänderten Dateien sind gelesen. Der Hinweis auf #700 und der dann leere Abschnitt «Open» sind entfernt, und ausser `docs/archive` und `docs/reviews` verweist nichts mehr darauf. Der neue Satz in `docs/test-pyramid.md:56` stimmt: Die Backend-Werte stimmen mit `backend/scripts/coverage-check.ts:6` überein (82/85), die Frontend-Werte mit `vitest.config.ts:57`. Der Kommentar in `vitest.config.ts:56` («the goal is 80 %») stimmt weiterhin. Die Floors werden nur angehoben, nicht gesenkt; das passt zur Gate-Regel in `tools/open-work/check-issues`, die eine Senkung ablehnt. Die alten Werte in `tools/open-work/check-issues.test.ts:272` sind eine Fixture und hängen nicht an der Konfiguration. Die Commit-Betreffzeile hat 44 Zeichen und hält Conventional Commits ein. Im Diff ist nichts, was nicht zur Anforderung gehört. Es ist kein Szenario nötig, weil kein Verhalten der App sich ändert. ponytail-review ergibt keinen Befund.

## Nicht bestätigt

- `bun run test:coverage` auf 4141ac6a besteht mit 93,57/86,65/94,63/92,76 %: vom Aufrufer gemeldet. Ich habe es nicht selbst ausgeführt (der Worktree hat kein `node_modules`). Im CI-Log von main (Run 42604930326, Job 129125551812 «Unit tests», success) wollte ich die Zeile «All files» nachsehen, aber `gh run view --log` lieferte keinen Inhalt. Die Messwerte sind darum durch keine zweite Quelle bestätigt.
- «Gate change approved: #700» und «No scenario: coverage configuration» im PR-Text: angekündigt, aber noch nicht vorhanden. Erst der CI-Gate-Check auf dem Pull Request zeigt, ob das stimmt.
