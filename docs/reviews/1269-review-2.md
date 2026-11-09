# Review #1269, Abschlussrunde 1 (49baef4b..5f0cb266)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

Keine Befunde, keine Blocker, keine Majors. C-1 aus `docs/reviews/1269-review-1.md` (Minor) betrifft diesen Delta nicht und bleibt im früheren Bericht.

Geprüft: Ziel-Tip statt Merge-Base (`git show "origin/$BASE_REF:$script"`). Der Pull Request kann `origin/<base>` genauso wenig ändern wie die Merge-Base, die Absicht des Issues («so the pull request cannot switch it off») ist also erfüllt. Zusätzlich laufen ältere offene Pull Requests beim nächsten Lauf mit dem aktuellen Skript. `fetch-depth: 0` (ci.yml:171) holt den Zielbranch; das Skript importiert nur `node:child_process` und läuft deshalb auch aus `$RUNNER_TEMP`. Der Vergleich läuft weiter gegen `from` = Merge-Base (check-issues.mjs:65), der Kommentar «a ratchet against the merge base» stimmt also noch. Kommentare in ci.yml und im Skript passen zum Code. Der Wiring-Test prüft die neue Zeile. Parser: Die Werte werden ganz übernommen. Leere Einträge (Komma am Ende) fallen über `key &&` weg. Mehrzeilige Blöcke gehen durch `trim()`. Ein Ausdruck, ein fehlender oder ein nicht lesbarer Wert ergibt NaN und wird damit rot (fails closed). Gehobene Werte bleiben grün (Test «gehobene Untergrenze»). Alle drei neuen Fälle (`60e-1`, `60 - 1`, `60 * 0.9`) hätte die alte Regex `([\d.]+)` als 60 gelesen, sie wären also ohne den Fix grün gewesen. Im Diff ist nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `bunx vitest run tools/open-work tools/deepcheck/test src/__tests__/open-work.test.ts`, die Rot-Läufe der neuen Tests (drei Ausdrucksformen, Wiring-Test vor der Änderung an ci.yml) und die Commit-Hooks.
- Ob «Open work» in der Branch-Protection von `main` ein Pflicht-Check ist, steht nicht im Repository (wie in Runde 1).
- Steht in einer Untergrenzen-Datei später ein Kommentar im Block (z. B. `branches: 60, // …`), liest der Parser den nächsten Schlüssel falsch, und die Prüfung wird rot, obwohl nichts gesunken ist. Die heutigen Dateien (vitest.config.ts:57, backend/scripts/coverage-check.ts:6) haben keinen solchen Kommentar. Der Fehler wäre ein sicheres Rot, keine Lücke, deshalb kein Befund.
