# Code-Review #643, Runde 3 (Abschlussrunde: 9532e73..2df5afb und Merge 733d2ae)

## Status der offenen IDs aus Runde 2

| ID  | Schwere | Status | Beleg |
| --- | --- | --- | --- |
| C-3 | Minor | behoben | check-issues.mjs:148: Ein Block nur aus `Beispiele:` gibt jetzt `undefined` zurück, ohne in den Tag-Zweig zu fallen. Der neue Fall im Test `lässt neue Zeilen und Blöcke unter Beispiele durch` (check-issues.test.ts:193-197) baut mit `specRepo(tagged, outlineFirst)` genau die Lage aus Runde 2 nach. Mit dem Code von 9532e73 ist er rot: Der Tag-Zweig meldet ein Szenario ohne `@wip`, exit 1. Das habe ich gelesen, nicht selbst laufen lassen |

## Neue Befunde im Delta

| ID  | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| C-4 | Minor | tools/open-work/check-issues.mjs:148 | Der Fix lässt jetzt einen Tag durch, der am Ende der Einfügung steht und damit zum Szenario darunter gehört, sobald davor ein neuer `Beispiele:`-Block steht. Nachgestellt im Scratchpad (`rv3-repro`): Szenariogrundriss O mit Beispielen, danach Szenario «Danach» ohne `@wip`. Eingefügt wird `Beispiele:` / `\| name \|` / `\| Hof \|` / leer / `@api` direkt vor `Szenario: Danach`. Auf 2df5afb und 733d2ae ergibt das exit 0, auf 9532e73 meldet die Prüfung `a.feature:10 «Danach» changes the specification` (exit 1). Für einen neuen `@api`-Tag allein meldet die Prüfung «Danach» weiterhin, so wie Runde 2 es als regelkonform festgehalten hat. `@wip` an dieser Stelle fängt weiterhin die Namensprüfung (`scenarios(HEAD)` mit `wip`). Den Fall deckt kein Test ab. Beheben liesse er sich, indem die Tag-Zeilen nach der letzten Zeile des Inhalts weiter `spec[after + 1]` zugeordnet werden |

## Nicht bestätigt

- Die Checks des Aufrufers habe ich nicht erneut ausgeführt, sie sind vom Aufrufer gemeldet: vitest von `open-work.test.ts`, `check-issues.test.ts`, `readme.test.ts`, `workflows.test.ts` und `commit-msg-gate.test.ts` (52 bestanden), `bun run lint`, `bun run check`, Backend `type-check`, Prettier, Commit-Hooks. Auch den Rotlauf des neuen C-3-Falls auf 9532e73 kenne ich nur aus der Meldung des Aufrufers und aus dem Lesen des Codes. Selbst ausgeführt habe ich nur `check-issues.mjs` (HEAD und 9532e73) gegen Repositories im Scratchpad, ohne `GITHUB_TOKEN`.

Geprüft: Merge 733d2ae (`--remerge-diff`): CLAUDE.md «When to ask» behält den Punkt dieses Zweigs zu Szenarien ohne `@wip` und übernimmt von main `needs-decision`. Der Kopfkommentar von check-issues.mjs behält beide Sätze. Im Diff 2c6c7e6..733d2ae steht in keiner hinzugefügten Zeile mehr `entscheiden` (CLAUDE.md Workflow 1, Freigabeprüfung und ihre Meldung, Test). Ein Tag, der durch eine Leerzeile vom Szenario getrennt ist, wird weiterhin gemeldet. ponytail: nichts zu kürzen.
