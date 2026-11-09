# Review i1252, Runde 1 (origin/main..4f9ac121)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/ci/axe-shards.test.ts:20, :57-62 | `select()` setzt `ui` selbst (`ui=${ui}`) und schneidet nur die Zeilen ab `echo "shards=` aus. Die geänderten Zeilen, die `ui` bestimmen (Vorgabe `ui=true` in ci.yml:60 für main, Nacht und `workflow_dispatch`; die Berechnung im Pull-Request-Block in ci.yml:66-68, jetzt vor der Matrix), prüft kein Test. Der Fall «main und nächtlicher Lauf» belegt also nur «bei ui=true vier Shards», nicht dass main `ui=true` bekommt. Würde die Berechnung wieder hinter die Matrix rutschen (z. B. hinter den Docs-only-Ausstieg), liefen auf jedem Pull Request wieder vier axe-Runner, und alle Tests blieben grün. |

## Nicht bestätigt

- Die Läufe von `bunx vitest run tools/ci` (mit dem neuen Test, Rot seiner zwei neuen Tests gegen ci.yml von origin/main), `tools/deepcheck/test/workflows.test.ts`, `tools/open-work`, `tools/testcheck/test/wiring.test.ts`, `tools/review-report`, `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, Backend-Type-Check, Prettier auf der neuen Datei und YAML-Parse: vom Aufrufer gemeldet.
- Dass im Ruleset von main nur «Accessibility (axe)» Pflicht ist und die Checks «Accessibility (axe) (n/4)» nicht: Das ist eine Repository-Einstellung ausserhalb des Diffs. `gh api repos/rudini/Dwello/rules/branches/main` gab keine Pflicht-Checks zurück, also nicht bestätigt.
- Wie GitHub Actions eine `include`-Matrix ohne axe-Einträge abarbeitet: aus dem Code geschlossen (es bleiben immer E2E-Einträge, die Matrix ist also nie leer), nicht in einem Lauf gesehen.

Geprüft: Shell/jq im Job `changes` (`ui` steht vor beiden Ausstiegen; `--argjson ui` bekommt immer `true`/`false`; der Docs-only-Pfad setzt app=false, e2e-tests wird übersprungen). `e2e-results` mit SHARDS=0: bei Erfolg von e2e-tests, bei einem fehlgeschlagenen E2E-Shard (API zählt 0 = 0) und bei übersprungenem e2e-tests (app=false) endet er mit 0, auch unter `bash -e`. Die Ausgabe `ui` liest niemand mehr (grep in .github, tools, docs, src, tests). Die Regex-Prüfungen in docker-paths.test.ts:63 und e2e-areas.test.ts:121 passen weiter. Die Testtitel stimmen mit dem überein, was die Tests prüfen. Der Commit nennt die festgehaltenen Fälle als bestehendes Verhalten. docs/test-pyramid.md ist nachgeführt. Ponytail-review: kein ungenutzter Code, keine Kopie eines bestehenden Helfers.
