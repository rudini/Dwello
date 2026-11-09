# Review #1396, Runde 1 (1b126546 gegen origin/main)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/fitness/fitness.ts:576-579 | Der Weg eines Hinweises in die Job-Zusammenfassung (Filter `!f.hint` aus `errors`, Hinweiszeilen unter der Tabelle) steht im `import.meta.main`-Block und hat keinen Test; der Unit-Test zeigt nur das Feld `hint`, nicht dass der Hinweis in `GITHUB_STEP_SUMMARY` steht und nicht rot macht. |

Keine Blocker, keine Major.

## Nicht bestätigt

- `bunx vitest run tools/fitness/fitness.test.ts` (51 grün, neuer Test vorher rot), Regeldatei-Tests (116 grün), eslint, Prettier-Diff, `bun run lint`, `bun run fitness -- --base origin/main --structure` (0 Fehler mit voller Historie): vom Aufrufer gemeldet.
- Ausgabe der Hinweiszeilen in einem echten CI-Lauf (`.github/workflows/ci.yml:256` ruft `--structure --format github` auf): nur gelesen, nicht ausgeführt.

Geprüft: Grenze «mehr als 1 Punkt» (`Math.round((before - after) * 100) <= 100` macht 1,0 zum Hinweis, auch bei Gleitkommarest 87,1 → 86,1, den der zweite Test abdeckt und der ohne die Rundung rot wäre); Test 1,5 rot / 0,5 Hinweis; zweiter Test ohne die Änderung rot (kein `hint`); Neue-Datei-, Health- und XS-Checks unverändert; CLAUDE.md nennt `bun run fitness -- --base origin/main --structure`; fitness-functions.md nennt die Toleranz mit #1396; `Finding` sonst nirgends ausserhalb von fitness.ts verwendet; ponytail-review ohne Befund.
