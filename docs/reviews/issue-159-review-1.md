# Code-Review issue-159, Runde 1

Geprüft: `git diff 1d871ef 07fd48f` (ein Commit `07fd48f fix(components): list filters follow the URL`) im Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-159-code`. Alle 11 geänderten Dateien gelesen, dazu `ApartmentFilters.svelte`, `InvoiceSearch.svelte`, `tenants/+page.svelte`, `contracts/+page.svelte`, `StatementSearch.svelte`, `EmptyState.svelte`, `+layout.svelte` (afterNavigate, Fokus), `src/lib/list-url.ts` (`isListSearch`), `tests/e2e/screenplay/questions.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/apartments/+page.svelte:34, src/routes/invoices/+page.svelte:41 | `{#key $page.url.search}` setzt das Formular nur bei geänderter Query neu auf. Eine Navigation auf dieselbe Adresse (auf `/apartments` «Ahorn» tippen ohne «Suchen», dann in der Navigation «Wohnungen» wählen) lädt die Liste neu, das Feld zeigt weiter «Ahorn» bei ungefilterter Liste. Bei Gebäuden (writable `$derived`, Neuberechnung bei jeder `$page`-Änderung) wird es geleert: die Listen verhalten sich verschieden. Bestand schon vor der Änderung; die Anforderung sagt «exactly the filters of the list shown». |
| C-2 | Nit | tests/e2e/steps/apartment-list.steps.ts:64-70 | Die neue `Given`-Definition «sucht nach Wohnungen mit {string}» hat denselben Körper wie die bestehende `When`-Definition «nach Wohnungen mit {string} sucht»: zwei Formulierungen für dieselbe Aufgabe. Hinnehmbar, weil das Szenario die Suche als Ausgangslage braucht. |

Keine Blocker, keine Major.

## Bestätigt

- Wohnungen: `{#key $page.url.search}` um `ApartmentFilters` baut das Formular bei jeder Änderung der Query neu aus der URL auf (Link «Filter zurücksetzen» im leeren Ergebnis, Zurück/Vorwärts, Seitenwechsel). `ApartmentFilters` hält ein Objekt in `$state` mit `bind:value={filters.search}`; ein writable `$derived` würde dort nicht tief reaktiv. Der Neuaufbau ist also die kleinste passende Lösung. Abgedeckt durch die DOM-Tests (Suche leer, Suche nach «Zurück», Status nach «Filter zurücksetzen») und das Szenario «Filter nach dem Zurücksetzen leer» (ohne `@wip`; im Plan rot vermerkt: Expected "" Received "Gibt es nicht").
- Gebäude: `searchTerm` und `cityFilter` als writable `$derived` (wie `StatementSearch`). Getipptes bleibt bis zur nächsten Änderung von `$page`; das Layout ruft kein `invalidate` auf, die 50-Minuten-Token-Erneuerung ändert `$page` nicht. Abgedeckt durch die DOM-Tests (`describe.each`, `/buildings`).
- Rechnungen: gleicher Neuaufbau um `InvoiceSearch`; abgedeckt durch die DOM-Tests. Die Erweiterung über das «Where» des Issues hinaus deckt sich mit «Done means» («any list») und ist im Plan begründet.
- Mieter, Verträge: zeigen ihre Felder aus `$derived` über `$page` (`value=`); beide nutzen `$app/stores`, das der Test mockt. Die Tests treffen also den echten Weg und waren laut Plan schon vor der Änderung grün.
- Fokus: Nach «Suchen» und «Filter zurücksetzen» (`goto` mit geänderter Query) setzt `afterNavigate` im Layout den Fokus auf `[data-results]`. Dass das Formular neu aufgebaut wird, kostet dort keinen Fokus.
- E2E: Der Schritt ruft nur Tasks und Questions auf. `showAllApartments` wartet auf `url.search === ''`. Die positive Prüfung «zeigt die Wohnungsliste wieder Wohnungen» kommt vor der Wertprüfung. `apartmentSearchTerm` liefert den Wert selbst (`Value.of`). Das Feature beschreibt das Ziel, nicht die Bedienung. Die neue `data-testid` `apartments-show-all` ist kebab-case mit Kontext, und `EmptyState` hatte `actionTestid` schon.
- Keine neuen Texte, keine neuen Bildschirme oder Zustände (screens.json und a11y-Features nicht betroffen), keine API-Änderung (keine Contracts), keine Token- oder Design-Änderung.
- Plan: Session enthält `Scenario red`, `Test red` und `Skills: tdd, ponytail, ponytail-review`. Code-Review, Persona, Workflow-Review und PR sind offen, wie es zum Stand passt.
- `offene-punkte.md`: U-31 (Beobachtungen aus dem Issue-Kommentar, älter als die Änderung) und H-27 (Testfehler, auch auf `main`) sind Pflichteinträge für gefundene, nicht behobene Punkte, also keine Änderungen ohne Bezug zur Aufgabe.

## Nicht bestätigt

- `bunx vitest run src/__tests__/list-filters.dom.test.ts`: selbst erneut ausgeführt, 11/11 grün. Rot vor der Änderung nicht selbst gezeigt: Der Basis-Code lässt sich ohne Dateiänderung nicht laufen lassen. Massgebend sind die Rot-Meldungen im Plan.
- Vom Aufrufer gemeldet: `bun run test:coverage` (153 Dateien, 2458 Tests, Untergrenzen eingehalten), `bun run lint`, `bun run check`, Backend `bun run type-check`, `bun run deepcheck:audit`, E2E chromium apartments/buildings/invoices/tenants/contracts (38 bestanden, neues Szenario ohne Fix rot), Backend `bun run test` (615 bestanden; der eine Fehler in `swiss-today.pg.test.ts` tritt laut Aufrufer zur gleichen Uhrzeit auch auf `main` auf).
- Zurück/Vorwärts und Seitenwechsel im echten Browser: nur durch den DOM-Test belegt (gemockter `page`-Store). Das Issue verlangt E2E nur für das Wohnungs-Szenario.
