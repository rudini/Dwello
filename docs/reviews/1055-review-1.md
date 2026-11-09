# Review #1055, Runde 1 (b28e9040..8bbb5439)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | docs/architecture/fitness-functions.md:18 | In der Spalte «Aktueller Wert» von `unstable-dependency` steht weiterhin «4 am 01.11.2026». Nach dem Diff ist es 1 (data-export, beabsichtigt). Andere Zeilen führen den Wert bei einem Abbau nach (z. B. `literal-set`: «8 Listen (13 am 23.10.2026; …)»), diese Zeile nicht. |

Keine Blocker oder Major.

Geprüft: Alle sechs geänderten Dateien sind gelesen. `localSessionHolds` und `distributionKeyExists` sind wörtlich und privat verschoben. Ausser in `docs/archive/` gibt es keine weiteren Aufrufer oder Importe (grep über backend, src, tests, tools, docs). Die beiden neuen Abfragen in utility-validation verhalten sich wie vorher: gleiche Reihenfolge `sortOrder, name`, keine Pagination (vorher `limit: null`), unbekannte Kategorie → `undefined` → nicht umlagefähig. Bestehende Tests decken die Pfade ab (local-account.pg.test.ts:238/254/270, utility-validation «unbekannte Kategorie», utility-rules). Die Ratchet-Einträge sind entfernt, data-export ist mit Begründung erfasst. Es gibt keine UI-Texte, Contracts oder E2E-Dateien und keine fachfremden Änderungen. Ponytail: nichts zu streichen. «No scenario: internal refactoring» trägt, und es kommen keine neuen Tests hinzu, die rot sein müssten.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run fitness -- --base origin/main` (vorher rot mit 3 Befunden, danach grün mit 1), backend type-check, bun test (local-account, setup, backup-new-code, utility-rules, utility-validation, whole-lists, error-codes, api-contracts, distribution-key-admin, config/auth; 492 pass), vitest tools/fitness, deepcheck fallow test, open-work test (58 pass), lint, check, Prettier.
- Ob die Layer-Regeln von fitness/deepcheck einen direkten Zugriff von `backend/src/middleware/auth.ts` auf `db/connection` und `db/schema` erlauben: Gelesen habe ich nur die Meldung in `tools/fitness/fitness.ts:133-135`. Ausgeführt habe ich nichts, die Bestätigung beruht auf dem gemeldeten grünen Fitness-Lauf.
- Einen Test für `default_distribution_key_id` mit einer unbekannten ID habe ich nicht gefunden (grep in `backend/src/__tests__`). Der Code ist unverändert verschoben, darum ist das kein Befund dieses Diffs.
