# Review i837c4c, Runde 1 (0f193c0c..1a0193a0, #857 / #837 Zyklus 4c)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tools/fitness/fitness.ts:110, tools/fitness/fitness.test.ts:108 | Die neue Weiche `b.includes('backend/')` wählt zwischen den beiden Meldungen, aber nur der Zweig «layer direction» ist geprüft. Der bestehende Test (Z. 94–109) prüft beim Backend-Import nur den Dateipfad, und den nennen beide Meldungen. Wird die Bedingung durch `false` ersetzt (immer die Schichtmeldung, auch bei einem Laufzeitimport ins Backend), bleiben alle 30 Tests grün. Behebung: im bestehenden Test `toContain('across the HTTP boundary')` ergänzen. |

Keine Blocker und keine Major.

## Nicht bestätigt

- `bun run check` (svelte-check 0 Fehler), `bun run lint`, die ganze Frontend-Suite (3694 Tests) und `bun tools/fitness/fitness.ts --base origin/main`: vom Aufrufer gemeldet.
- Rot der zwei neuen Fitness-Tests: vom Aufrufer gemeldet. Beim Lesen plausibel: Das Prädikat mit der alten Regel allein liefert für die Kanten FE → BFF und Shared → FE (`type_only = yes`) `false`, und die Meldung «against the layer direction» gab es vorher nicht.
- Nachweiszeile in `fitness-functions.md` §3 (zwei Importe gepflanzt, 2 Befunde): vom Aufrufer gemeldet, nicht nachgestellt, weil das Dateien im Worktree ändern würde.
- Nachgelaufen: `bunx vitest run tools/fitness/fitness.test.ts src/__tests__/dashboard-page.test.ts src/__tests__/audit-log-page.dom.test.ts`, alles grün. `src/__tests__/form-selects.dom.test.ts` (enthält den Test für DefaultsSection) bricht im Review-Worktree in allen 6 Tests mit «Cannot find module …/node_modules/.ssr-*/…» ab. Ursache ist die Umgebung: Der Hydrate-Helfer schreibt in `node_modules`, und das ist hier gesperrt. Kein Befund der Änderung, aber hier nicht bestätigt (vom Aufrufer in der ganzen Suite als grün gemeldet).
- §6-Verlaufszeile «FE → BFF 17 → 0»: 17 Komponentendateien auf 4dcd0d89 (vor Zyklus 4a) mit `git grep` gezählt, nicht mit `02-imports.ts`. «Shared → FE 1 → 0»: Die Kante `src/lib/types.ts → ./invoice` (LatestKey) gibt es auf 294f77f6 und 086ede7d noch, auf 4dcd0d89 nicht mehr. Sie fiel also mit #862 weg und nicht in 4a–4c. Die Zeile nennt den Zeitraum ungenau, die Zahl stimmt.

Geprüft: alle 14 Dateien des Diffs. `02-imports.ts` mit `ARCH_OUT` im Scratchpad nachgerechnet: 0 Dateikanten FE → BFF und Shared → FE, 0 Modulkanten `fe:* → bff:*` und `shared:* → fe:*`. Auf dem Basis-Commit gab es genau 6 Komponentenimporte von BFF-Dateien, jetzt keinen mehr. `PageData` deckt `settings`, `entries`, `buildingOccupancy` und `kiModel` aus den Load-Funktionen. `KiModel` steht in `src/lib/types.ts`, der Mapper und `Settings` bleiben in `src/lib/server`. Die nicht mehr exportierten Typen (`DashboardData`, `OverviewData`, `AuditEntry`) nutzt keine andere Datei mehr. `import type` ins Backend bleibt erlaubt. Kein Verhalten geändert, keine UI-Texte, keine fachfremden Änderungen. Ponytail: «Lean already. Ship.»
