# Code-Review 461, Runde 5 (CI-Fix O-41)

Delta: `git diff edf350fc d71d3ded` (1 Commit `d71d3ded fix(buildings): keep a typed search term`), Worktree `review-461-code5`.
Gelesen: alle 4 geänderten Dateien, dazu `src/routes/{apartments,tenants,contracts,statements,invoices}/+page.svelte`, `ApartmentFilters.svelte`, `TenantFilters.svelte`, `StatementSearch.svelte`, `tests/e2e/tasks/buildings.ts`, `buildings.feature`, `buildings-pages.dom.test.ts` (Testnamen), Merge #494 (`86f13870`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde im Delta. |

## Prüfung der Punkte des Aufrufers

- **Ursache:** Auf der Basis war `searchTerm = $derived($page.url.searchParams.get('search') || '')` ein überschriebener (gebundener) `$derived`. Jede Meldung des `$page`-Stores ist ein neues Objekt, also rechnet der Derived neu, erhält `''` und überschreibt den getippten Wert. Der neue Test setzt den Store auf ein neues Objekt mit derselben Adresse. Beim Lesen ist er auf der Basis für `/buildings` rot und für die anderen Listen grün:
  - Wohnungen und Rechnungen: `$state(untrack(...))` bzw. `{#key $page.url.search}`.
  - Mieter und Verträge: einseitiges `value={filters.search}` mit unverändertem String.
  Das bestätigt den Mechanismus. Welche Store-Meldung ohne neue Adresse in Firefox auf CI kam, ist nicht belegt (siehe «Nicht bestätigt»).
- **Fix:** `query = $derived($page.url.search)` ist ein String. Svelte 5 gibt einen gleichen Wert nicht weiter, also rechnen `searchTerm`, `cityFilter` und `filtered` nur bei einer neuen Adresse neu.
  - Stadtfilter: gleicher Pfad über `param('city')`.
  - «Filter zurücksetzen» (`clearFilters`): setzt beide Felder selbst auf `''`, auch wenn `/buildings` schon die Adresse ist. Der EmptyState-Link `/buildings` ändert die Adresse.
  - «Zurück»/#159: Die Adresse ändert sich. Die bestehenden Tests «ist leer …» und «zeigt nach «Zurück» …» decken das weiter ab.
  - Pagination: `url={$page.url}` ist unverändert, der Seitenwechsel ändert `query`. Abgedeckt durch «blättert mit der Suche zur nächsten Seite».
- **Niedrigste Ebene:** Der DOM-Test in `list-filters.dom.test.ts:63-73` zeigt den Fehler direkt (Store-Meldung ohne Adresswechsel, Feldwert). Er läuft für alle fünf Listen und schützt damit auch die anderen gegen denselben Rückfall. Das bestehende Szenario «Suche ohne Treffer» (`buildings.feature:28`, ohne `@wip`) ist die Akzeptanz. Ein neues Szenario ist nicht nötig, weil das Verhalten gleich bleibt und nur der zeitweilige Fehler wegfällt.
- **Dasselbe Muster anderswo:** Gesucht wurde mit `grep` nach `$page.url` in `src/routes`. `statements/StatementSearch.svelte:27` bindet `term = $derived(search)` ebenfalls. `search` ist dort aber ein String-`$derived` (`statements/+page.svelte:26`) und gibt einen gleichen Wert nicht weiter, also ist die Liste nicht betroffen. Sie fehlt in `lists` des Tests, das ist aber kein Befund des Deltas. Andere gebundene `$derived` auf `$page` gibt es nicht. `tenants/new`, `ContractWizard` und `ContractForm` lesen nur einmal (`untrack`) oder sind nicht gebunden.
- **PR #494 (`86f13870`):** Die PR ändert `src/routes/buildings/+page.svelte` ebenfalls, aber nur Import und Ergebnisblock (`Pagination` → `ResultList`), nicht den Skriptteil mit den Filtern. `git merge-tree d71d3ded 86f13870` merged die Datei automatisch ohne Konflikt. Es entsteht keine doppelte Lösung, weil `ResultList` die Filter nicht berührt.
- **Doku:** Die Zeile O-41 ist aus `offene-punkte.md` entfernt und im Verlauf archiviert. Der Text stimmt mit Code und Test überein. Die Commit-Betreffzeile entspricht der Konvention.

## Nicht bestätigt

- lint, check sowie `bunx vitest run src/__tests__/list-filters.dom.test.ts src/__tests__/buildings-pages.dom.test.ts` (47/47): vom Aufrufer gemeldet. Mein Wiederholungslauf scheiterte mit `ERR_MODULE_NOT_FOUND`, weil der Worktree keine eigenen `node_modules` hat. Das Rot des neuen Tests auf der Basis ist nur durch Lesen beurteilt, nicht ausgeführt.
- Welche `$page`-Meldung ohne neue Adresse den CI-Fehler in Firefox auslöste (Run 39385274329), ist nicht belegt. Es gibt kein `invalidate`/`replaceState` in `src/routes/+layout.svelte` oder `src/lib`. Vermutlich kommt die Meldung von SvelteKit selbst, etwa nach der Hydration. Ob das Szenario jetzt stabil ist, zeigt erst CI.
- Zum Merge von main: `git merge-tree d71d3ded 86f13870` meldet Konflikte in `messages/{en,fr,it}.json` und `docs/design/i18n-begriffe.md`. Sie stammen aus früheren Commits der PR #514, nicht aus diesem Delta, und sind hier nicht beurteilt.
