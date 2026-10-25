# Review 813, Runde 2 (Delta 8c94555..3849c88)

## Status der offenen IDs

| ID | Schwere | Datei:Zeile | Status |
|----|---------|-------------|--------|
| C-1 | Major | tools/arch-baseline/layers.json:39-40 | Behoben. `bff:auth` steht jetzt vor `bff:endpoint/$1`. Alle fünf `src/routes/auth/{callback,login,logout,me,refresh}/+server.ts` sind wieder `bff:auth`. `health/+server.ts` bleibt `bff:endpoint/health` und `api/*` bleibt `bff:api/*`. Der neue Test (lib.test.ts:12-14) schlägt auf 8c94555 beim Lesen fehl (dort `bff:endpoint/auth`). §6 in fitness-functions.md:102 nennt die Ausnahme jetzt. |
| C-2 | Minor | tools/arch-baseline/lib.test.ts:16-21 | Behoben. `toEqual` prüft jetzt auch `module: 'backend/demo'`. Ohne die Modulregel wäre das Modul `db:demo-data` und der Test rot. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: Rot-Lauf beider Tests vor dem Fix, Fitness grün mit unveränderten Werten, Modulgraph 650 Kanten ohne `bff:endpoint/auth`, Lint, Prettier auf dem Test, Commit-Hooks.
- Erneut ausgeführt: `bunx vitest run tools/arch-baseline`, 6 bestanden. `classify` für die Auth-Endpunkte, `health`, `api/tenants` und `demo-data.ts` ergibt die erwarteten Module.

Geprüft: Diff vollständig gelesen (layers.json, lib.test.ts, fitness-functions.md §6).
