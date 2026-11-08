# Code-Review #697, Runde 2 (ea26370..42577ff)

Geschlossen: C-1, C-2

Keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: vitest `tests/unit/ui-screenshot-shots.test.ts` (6 bestanden, der neue Test vorher rot), Prettier, der lokale Lauf des Screenshot-Jobs mit `/contracts/new`, `/statements/generate` und `/invoices` gegen `main` (7 bestanden, Unterschiede nur in der Version in der Fusszeile). Lint und Check aus Runde 1 werden laut Aufrufer vor dem Push wiederholt. Nach dem Lesen ist der neue Unit-Test auf ea26370 rot: Der alte Filter gibt beide `upload-*`-Zustände zurück.
- Ob `page.clock.setFixedTime` in der Playwright-Version des Repos mit `context.newPage()` vor dem ersten `goto` greift, und ob ein Zustand auf eine fortlaufende Uhr angewiesen ist. Gelesen: Den Zeitpunkt des Entwurfs setzen nur `ContractWizard.svelte:192` und `StatementWizard.svelte:167`, mit `new Date()` im Browser. Das ist jetzt auf beiden Branches derselbe `now`. `setFixedTime` lässt Timer weiterlaufen. In `src/lib` und `src/routes` steht `Date.now()` nur im Servercode (`auth.ts`, `backup.ts`). Ohne `node_modules` nicht ausgeführt.
- Ob das Issue #697 das Auslassen von `upload-dialog` neben `upload-discard-dialog` nachträgt (Hinweis aus Runde 1). Das Issue habe ich nicht gelesen.

Geprüft: Der neue Filter (`startsWith('upload-')`) trifft in screens.json nur `upload-dialog` und `upload-discard-dialog`. Kein anderer Bildschirm hat einen Zustand mit «dialog», der mit `upload-` beginnt. Das Auslassen wurde aus dem Spec in `statesOf` verschoben, ohne Rest. Es gibt einen `now` pro Zustands-Test für beide Kontexte, und `locale` wird an `newContext` übergeben. `docs/reviews/697-review-1.md` folgt dem Ablageort der übrigen Reviews. ponytail-review ohne Befund.
