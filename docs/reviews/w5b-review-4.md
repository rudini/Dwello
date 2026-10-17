# Review 4 (w5b): Merge d6ab1d17 und Folgecommit e8eb5c45

Geprüft im Worktree `review-w5b-merge` (detached auf e8eb5c45), gegen beide Eltern: Branch 08719500 und main 78aa4860.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. Beide Seiten bleiben erhalten. |

## Bestätigt durch Lesen

- `src/lib/server/category.ts` (Konfliktdatei): Gegenüber dem Branch kommen nur die Teile von main dazu (`error`-Import, `localName`-Import, `agreeableCategories()`). Gegenüber main kommen nur die Teile des Branches dazu (`BACKEND`/`API`, `kiEnabled()`). `agreeableCategories()` nutzt `API` (= `${BACKEND}/categories`), die URL `…/api/v1/categories?limit=100` ist also gleich wie auf main. Weder ein Import fehlt noch ist einer doppelt.
- `backend/src/services/category.service.ts` `updateCategory`: Der Schlüsselschutz des Branches (#166, `name` fällt bei `type = 'predefined'` weg) steht vor der Transaktion. Darin stehen die `before`-Abfrage von main, das Ausschliessen der Rechnungen mit `returning` und `recordAudit('category_allocability_changed', …)` (#357) unverändert. Das Audit liest `name` aus der gespeicherten Zeile, bei einer vordefinierten Kategorie also den unveränderten Schlüssel; das ist richtig. Bei einer unbekannten ID ist `stored` undefiniert, dann gilt `data = changes`, und `before.allocable` wird nur gelesen, wenn `category` existiert. Kein neuer Absturz.
- `deleteCategory`: Die Sperre `CATEGORY_PREDEFINED` des Branches steht vor den Prüfungen von main (Rechnungen, Tankbestände). Diese sind unverändert.
- Migrationen: Der Branch bringt keine eigene Migration mit, deshalb gibt es keinen Nummernkonflikt mit main (0012–0022).
- e8eb5c45: Der Test von main «erklärt die Übersetzungen und die Reihenfolge» bekommt `data: { kiEnabled: true }`, wie die anderen Tests der neuen Kategorie auf dem Branch. An der Aussage des Tests ändert sich nichts. Ohne `data` würde die Seite des Branches (`data.kiEnabled`) beim Rendern abstürzen. Die Korrektur ist also nötig und minimal.
- `audit-log.pg.test.ts` (main) ändert nur `isAllowedUtilityCost` und benennt keine vordefinierte Kategorie um. Der Schlüsselschutz bricht ihn also nicht.

## Nicht bestätigt

- Alle Prüfungen auf e8eb5c45 sind «vom Aufrufer gemeldet» und wurden nicht neu ausgeführt (Auftrag: keine Tests; node_modules gesperrt): `bun run lint`, `bun run check`, backend `bun run type-check`, backend `bun run test` (928 bestanden), `bunx vitest run` (2964, nach e8eb5c45 die vier Kategorie-Dateien erneut mit 83 bestanden).
- Laut Aufrufer liefen nach dem Merge keine E2E-Szenarien (`categories.feature`, Szenarien von #91 und #357). Das Zusammenspiel im Browser ist deshalb nur durch Lesen bestätigt.
