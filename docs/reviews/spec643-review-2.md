# Code-Review #643, Runde 2 (Delta d58bbf7..9532e73)

## Status der offenen IDs aus Runde 1

| ID  | Schwere | Status | Beleg |
| --- | --- | --- | --- |
| C-1 | Major | behoben | `insertedInto` (check-issues.mjs:144-150) ordnet `-N,0`-Hunks dem Szenario von Basiszeile N zu. Der Test `meldet einen eingefügten Schritt …` deckt Grundlage, Szenariogrundriss und Tabellenzeile in einem Schritt ab. Ohne den Fix wäre er rot (vorher meldete eine reine Einfügung nichts) |
| C-2 | Minor | behoben | Die Fixture hat jetzt `Grundlage:` und `Szenariogrundriss` mit `Beispiele:`. Die Zuordnung zum Kopf prüft die Erwartung `:1 «Funktionalität und Grundlage»`, die neue Beispiele-Zeile und der neue Block sind getestet |

## Neue Befunde im Delta

| ID  | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| C-3 | Minor | tools/open-work/check-issues.mjs:149 | Ein neuer `Beispiele:`-Block mit Tag-Zeile (z. B. `@wip` über `Beispiele:`) läuft durch `examplesOnly`, danach greift aber der Tag-Zweig (`first < 0 && lead.some(@)`). Er gibt `spec[after + 1]` zurück, also das nächste Szenario. Nachgestellt im Scratchpad: Szenariogrundriss O mit Beispielen, danach Szenario B ohne `@wip`. Wird nach den Beispielen von O ein Block `@wip`/`Beispiele:`/`\| n \|`/`\| b \|` eingefügt, meldet die Prüfung `a.feature:11 «B» changes the specification` mit exit 1. Gemeldet wird das falsche Szenario, und zwar für eine Ergänzung, die frei sein sollte. In `tests/e2e/features` gibt es heute keinen getaggten `Beispiele:`-Block |

## Nicht bestätigt

- Die vom Aufrufer gemeldeten Checks wurden nicht erneut ausgeführt: lint, check, Backend type-check, Prettier, Commit-Hooks, vitest von `open-work`, `readme`, `workflows` und `commit-msg-gate`, der Lauf über origin/main~30..origin/main. Nur `tools/open-work/check-issues.test.ts` habe ich selbst ausgeführt: 12 bestanden.
- Rotläufe nur gelesen: Der Test `lässt neue Zeilen und Blöcke unter Beispiele durch` kann gegen d58bbf7 nicht rot werden, weil Einfügungen damals nie zählten. Er wehrt False Positives des neuen Codes ab. Seinen Rotlauf gegen einen Zwischenstand ohne Block-Erkennung nennt nur der Aufrufer.
- Wie git Einfügungen verschiebt, habe ich nur an Stichproben geprüft (Scratchpad `r2-slide`): neues Szenario nach, vor und am Ende eines geschützten Szenarios mit gleicher letzter Schrittzeile, kopiertes Szenario, neues `@wip`-Szenario mit Kommentar. Alle exit 0. Ein neues `@api`-Tag an einem geschützten Szenario meldet dieses Szenario, was zur Regel passt.

Geprüft: Hunk-Parsing (`+M,k`, Standardwert 1), Zeilen-Slice aus HEAD, Kommentar- und Leerzeilen-Filter, `examplesOnly` (Aufwärtslauf über `|`-Zeilen, Datentabelle eines Schritts nicht frei), Plan-Häkchen; ponytail: nichts zu kürzen.
