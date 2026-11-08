# Review i845, Runde 2 (Delta `db886e34..f445b328`, ohne `docs/reviews`)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | docs/test-pyramid.md:102 | Der Umbau des Satzes hat die Klammer aufgelöst: «… `always` or `fullRunOnly` and 12 everywhere else, with every browser (#834) …» hängt die 12 Shards jetzt an den Satz über `e2e-areas.test.ts`. So liest es sich, als prüfe der Test «12 everywhere else». Vorher stand der Einschub in Klammern, und «and 12 everywhere else» gehörte zu «in 5 shards on pull requests». Ausserdem nennt die Liste der ausgenommenen Dateien `.claude/` und `*.md` ausserhalb von `docs/` nicht |
| C-5 | Minor | tests/e2e/areas.json:22-188 | Ein Bereich wählt nur seine eigenen Features. Szenarien anderer Bereiche, die seine Seiten über die URL öffnen und dort prüfen, laufen nicht mit. Der Import-Test sieht solche Abhängigkeiten nicht, und weder `about` noch `docs/test-pyramid.md` nennen diese Restlücke. Belege: `statement-send.steps.ts:86-87` öffnet `/tenants/{id}` und liest die Korrespondenz (Bereich tenants). `contract-detail.steps.ts:289-290` prüft den Filter der Rechnungsliste mit `building=` (Bereich invoices). `tenant-detail.steps.ts:3` nutzt `questions/apartment-detail`, und die Statement-Detailseite lädt das versendete PDF über `src/routes/documents/[id]/pdf/+server.ts` (Bereich documents). Eine Änderung an `src/routes/tenants/[id]/+page.svelte` wählt deshalb `statement-send.feature` nicht aus. In den genannten Fällen prüft der eigene Bereich dieselbe Stelle meist mit, darum nur Minor; zu wenig gewählte Szenarien zeigen sich erst auf `main` |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - vitest `tools/ci/e2e-areas.test.ts` (27 grün)
  - die neuen Testzeilen rot gegen die alte `areas.json` (8 rot)
  - lint, prettier, testcheck-Audit
- Den Text von #845 (ob der Entscheid zu wenig gewählte Szenarien, die erst `main` fängt, ausdrücklich in Kauf nimmt) konnte ich nicht lesen: `gh issue view 845` gab nichts aus. Davon hängt ab, ob C-5 nur dokumentiert oder per Feature-Zuordnung behoben werden muss.

Geprüft: Den Import-Scan habe ich im Scratchpad nachgebaut, mit derselben Regex und Auflösung. Er findet keine Lecks und keine übergangenen Ziele. Ungelöst bleiben nur die erzeugten `$lib/paraglide/*`.

Die Regex erfasst die Importformen, die im Repo vorkommen:
- `import x from`, `import type`
- `export … from`
- `import './x'`, dynamisches `import('…')`
- mehrzeilige Importe
- `<script>`-Blöcke in Svelte (es wird der ganze Text gelesen)

Weitere Importwege nutzt das Repo nicht:
- andere Aliase: `svelte.config.js` kennt nur `$lib`; `@/` aus `backend/tsconfig.json` wird nirgends genutzt
- `import.meta.glob`, sowie `?raw`- oder `?url`-Importe eigener Dateien

Importeure ausserhalb von `src`, `backend/src` und `tests/e2e` (Root-Konfigurationen, `backend/demo`, `backend/scripts`, `tests/a11y`) importieren weder Bereichs- noch ausgenommene Dateien.

Die Lookaheads schliessen die geteilten Komponenten richtig aus. Die neuen `it.each`-Zeilen hätten gegen die alte Zuordnung rot gezeigt.

Ein Mangel ohne heutige Wirkung (darum kein Befund): Hat eine Datei ein gleichnamiges Verzeichnis neben sich, löst `imports()` auf das Verzeichnis statt auf die `.ts`-Datei auf, z. B. `$lib/statement` zu `src/lib/statement`.
