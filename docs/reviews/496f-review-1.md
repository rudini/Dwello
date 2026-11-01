# Code-Review 496f, Runde 1 (3074ea7~1..3074ea7)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `src/routes/config/export/+server.ts` (415 vor dem Backend-Aufruf bei jedem Content-Type ausser `application/x-www-form-urlencoded`/`multipart/form-data`, auch bei fehlendem; Grossschreibung oder ein Suffix wie `multipart/form-data-x` kann ein Browser von fremden Seiten nicht ohne Preflight senden, eine Lücke entsteht also nicht); `src/__tests__/data-export.test.ts` (der neue Test schlägt ohne die Prüfung fehl: dann gäbe es keine Ablehnung und `calls` wäre nicht leer; die zwei bestehenden Aufrufe bekommen den Formular-Request des Buttons); das Formular in `src/routes/config/+page.svelte:100` sendet urlencoded und bleibt gültig; keine neuen Texte, Bildschirme oder Selektoren; der Diff ist so kurz wie möglich.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `src/__tests__/data-export.test.ts` 8 bestanden (neuer Test vorher rot), `bun run fitness`, `bun run check`, ESLint und Prettier sauber, E2E chromium datenexport 9 bestanden.
- Die Prämisse des Fallback-Reviews, dass die Origin-Prüfung von SvelteKit `text/plain` durchlässt: ohne `node_modules` nicht nachprüfbar (gesperrt ist `@sveltejs/kit@2.70.3`, `bun.lock:385`). Soweit ich mich erinnere, zählt `is_form_content_type` in Kit 2 auch `text/plain` dazu. Dann wäre die Begründung in der Commit-Nachricht ungenau. Der Fix hält trotzdem, weil er auch einen POST ohne Content-Type abweist, und der Kommentar im Code stimmt so oder so.
- Kein Szenario: Die 415-Antwort erreicht nur ein Request von aussen, nicht die Oberfläche. Der Unit-Test ist dafür die unterste Schicht, die das zeigen kann.
