# Code-Review Slice 750, Runde 1 (`git diff origin/main 540fd94`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/screenplay/interactions.ts:18-21 | Die Konsole wird nur an `error.message` angehängt; Playwright setzt bei seinen API-Fehlern `error.stack` schon fest, und der Reporter zeigt die Meldung aus dem `stack`. Im Bericht der axe-Zeile fehlt die Konsole dann wahrscheinlich, also gerade das, was die Anforderung verlangt. |
| C-2 | Minor | tests/unit/hydration-console.test.ts:16,27-30 | Der Fake wirft ein frisches `new Error`, dessen `stack` noch niemand gelesen hat, und der Test prüft nur `message`. Darum kann er C-1 nicht zeigen. |

## C-1 (Major): Die Konsole erreicht den Bericht wohl nicht

Warum es falsch ist: In V8 wird `error.stack` beim ersten Lesen fest. Danach ändert eine neue `message` den `stack` nicht mehr. Lokal mit node nachgeprüft:
- Ohne vorheriges Lesen enthält `stack` den angehängten Text: `["Error: Timeout","Browser console:"]`.
- Nach `e.stack = e.stack` fehlt er: `["Error: Timeout","    at [eval]:1:9"]`.

Playwrights Client (`channelOwner._wrapApiCall`) setzt bei einem fehlgeschlagenen Aufruf wie `locator.waitFor` ausdrücklich `e.stack = e.message + stackFrames`. Der Test-Runner gibt `{ message, stack }` weiter. `formatError` im Reporter nimmt die Meldung aus `prepareErrorStack(stack)`, das sind die Zeilen vor dem ersten `    at `. Der Timeout im Bericht zeigt also den alten Text ohne «Browser console:». Damit fehlt der Kern von «record the browser console … into the report».

So zeigt man, dass es fehlschlägt:
- Im Unit-Test wirft der Fake einen Fehler mit vorab gesetztem Stack, wie Playwright ihn liefert (`const e = new Error('locator.waitFor: Timeout 10000ms exceeded.'); e.stack = e.stack;`). Der Test prüft dann `failure.stack` auf die Konsolenzeilen. Mit dem jetzigen Code wird er rot.
- In E2E lässt man eine Seite nicht hydrieren und liest die Fehlermeldung im list- oder HTML-Reporter.

Behebung: `stack` mit anpassen, so wie Playwrights `rewriteErrorMessage` es tut, etwa `error.stack = error.stack?.replace(original, error.message)`. Oder einen neuen Fehler mit dem ganzen Text werfen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`
  - `bunx vitest run tests/unit/hydration-console.test.ts src/__tests__/e2e-screenplay-lint.test.ts` (62 bestanden, neuer Test vorher rot)
  - Prettier
  - E2E `--grep @a11y -g dashboard` (79 bestanden)
  - Commit-Hooks
- C-1 stützt sich auf zwei Dinge:
  - das node-Verhalten oben, selbst geprüft;
  - Playwrights Quelltext (`_wrapApiCall`, `formatError`/`prepareErrorStack`), aus der Kenntnis der Bibliothek. Im Worktree gibt es keine `node_modules`, gelesen habe ich ihn darum nicht.
  
  Kein gemeldeter Lauf hatte einen Hydrierungs-Timeout, also hat niemand die Meldung im Bericht wirklich gesehen.

Geprüft: Alle vier Aufrufer von `hydrated` sind umgestellt, und `Navigate.to` deckt die axe-Zeilen ab (tests/e2e/tasks/accessibility.ts:1009). Die Listener aus mehreren `BrowseTheWeb` auf derselben Seite (tests/e2e/fixtures/test.ts:29,37,43) schreiben je in ein eigenes Array, ohne Doppel. Den Import von `Page` zu entfernen ist nötig, weil er sonst ungenutzt bliebe. Ohne die Änderung schlägt der Test fehl. «No scenario» passt, weil sich nur Test-Werkzeug ändert. Ponytail findet nichts Ungenutztes und keine Kopie eines Helpers.
