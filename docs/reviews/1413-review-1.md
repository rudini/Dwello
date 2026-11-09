# Code-Review 1413, Runde 1 (e0520649)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle vier Dateien des Diffs; die sechs Listen mit `Pagination`/`ResultList` (`grep` in `src/routes`: apartments, buildings, contracts, invoices, statements, tenants, dazu audit-log) haben je einen `paged`-Zustand in `tests/a11y/screens.json` und eine Zeile in beiden Features, keine Zeile für Folgeseiten; `stateMeanings.paged` besteht schon (Z. 6). Fünf Listen lesen `?pageSize` (`src/routes/{apartments,buildings,tenants,contracts,invoices}/+page.server.ts`), Statements fest 10 (`src/routes/statements/+page.server.ts:85`), und `seedFor` legt mehr als 10 Abrechnungen an (Anna, Bruno, Carla, Jana, Kai, Lea …). Der Zustand `paged` wartet auf `on.nextPageLink` (`tests/e2e/tasks/accessibility.ts:283`), eine nicht blätternde Liste lässt die Zeile also rot werden. Audit-Log: `paged`/`paged-older` bekommen weiter nur die 50 alten Einträge (`tests/e2e/fixtures/screens.ts:122`); `pagedList` nimmt den Audit-Log aus (Z. 147), sein früher Return bleibt. `Pagination.svelte` zeigt bei `pageSize=1` dieselben Bedienelemente wie bei der Standardgrösse. `statements-period` blättert nicht (Entwürfe 2025 < 10), braucht also keine Zeile. Die Commit-Message nennt die Zeilen als Festhalten bestehenden Verhaltens. Auf der Basis blättern die Listen schon, und es ist kein Bugfix: kein Rot-Lauf nötig. Weder App-Code noch Texte geändert, also keine Änderungen an `messages/*.json` oder Contracts nötig.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx playwright test --project=chromium -g "paged"` (16 bestanden), `bunx vitest run tests/unit/a11y-screens.test.ts tests/unit/i18n-screens.test.ts` (5 bestanden), `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, Backend-Type-Check. Nichts davon selbst ausgeführt.
- Ob die erste Seite der Rechnungsliste in fr/it/en bei `pageSize=1` keinen deutschen Text zeigt (z. B. eine Rechnungsbeschreibung aus `seedFor`): nur über den gemeldeten Lauf belegt, nicht durch Lesen geprüft.
