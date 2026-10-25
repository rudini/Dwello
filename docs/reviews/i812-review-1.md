# Review i812, Runde 1 (3944357..284bc27)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle 9 geänderten Dateien gelesen. `src/lib/navigation.ts` → `src/lib/ui/navigation.ts` ist ein reiner Umzug (98 % Ähnlichkeit, nur der Import von `IconName` ist jetzt `./icons`). `layers.json:46` ordnet `src/lib/ui/.*` dem Modul `fe:ui` zu, also gibt es keine Kante zwischen `fe:lib/navigation` und `fe:ui` mehr. Nach `$lib/navigation` sucht kein Import mehr in `src`, `tests` oder `docs` (ausser Archiv und Reviews). Die Treffer in `tools/arch-baseline/out/*.csv` sind die eingecheckten Rohdaten der Baseline; `fitness.ts:331` misst in einem temporären Verzeichnis. Die Fixtures `fitness.test.ts:82` und `graph.test.ts:33` hängen nicht von `ratchet.json` ab. `ratchet.json` → `moduleCycles: []`, die Liste wird nur kürzer. Die Zeile in `fitness-functions.md:113` §6 sagt «Zyklen 1 → 0». Der Kommentar in `help/+page.svelte:10` nennt den neuen Pfad. Kein UI-Text, keine Verhaltensänderung, `No scenario` steht in der Commit-Nachricht. Der rote Nachweis ist der Fitness-Gate. Ponytail: nichts zu kürzen. Die Diff ist minimal: 9 Zeilen kommen dazu, 14 fallen weg.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run fitness` (Zyklen 0, rot ohne Umzug), Vitest auf design-guard, tokens, tools/fitness und tools/arch-baseline, `prettier --check` und `cd backend && bun run type-check`: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Selbst neu ausgeführt und grün: `bunx vitest run` auf app-frame.dom, help-page.dom und shell.dom (3 Dateien, 23 Tests).
