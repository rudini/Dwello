# Review 721c, Runde 1 (Abschlussrunde)

Bereich: `git diff 01aac3cb4 97f209eb1 -- . ':!docs/reviews'` (nur `src/__tests__/csp.test.ts`, +6 Zeilen)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geschlossen: C-1 (aus docs/reviews/721-review-1.md)

Geprüft: Der neue Test prüft `style-src` und `img-src` genau mit den Werten aus `svelte.config.js:27-28`. Der Kommentar trifft zu: `src/lib/ui/ProgressBar.svelte:15` (`style:width`) und `src/lib/file-pages.ts:15,32` (`toDataURL('image/jpeg')`). Der Titel sagt, was der Test prüft. Die Commit-Message nennt den Test als Pin für Verhalten, das 01aac3cb4 schon zeigt; laut Workflow 2 braucht er deshalb keinen Rot-Lauf. Es ist kein Bugfix, und die Basis enthält die Werte bereits. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- vitest `csp.test.ts` (3 bestanden) und Prettier auf der Datei: vom Aufrufer gemeldet, nicht selbst ausgeführt (kein `node_modules` im Worktree).
- pdf.js unter der CSP: Laut Aufrufer wurden auf dem Persona-Build zwei PDFs ohne CSP-Verletzung gelesen; es gab nur pdf.js-Warnungen zu `wasmUrl`. Das ist vom Aufrufer gemeldet, ich habe es nicht nachgeprüft. Kein automatisierter Test deckt es ab.
- `blob:` in `img-src` wird gepinnt, aber der Kommentar begründet es nicht. Einen Nutzer von `blob:`-Bildern in `src/` habe ich nicht gesucht. Das ändert nichts am Test, weil der Test nur den bestehenden Wert festhält.
