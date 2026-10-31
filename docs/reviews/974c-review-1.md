# Review 974c, Runde 1 (6fe5ddd99..7dc79ca77, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/fitness/file-contains.ts:5,10 | Ist der längste Text nur 1 Zeichen lang, wird `keep` 0, und `window.slice(-0)` gibt das ganze Fenster zurück statt keines Zeichens. Der Übertrag wächst dann mit jedem Stück bis zur ganzen Datei, und genau das sollte das stückweise Lesen verhindern. Bei leerem `texts` tritt dasselbe mit `-Infinity` auf. In `restore-check.ts` kommt das nicht vor, weil `'CREATE TABLE'` immer dabei ist (keep ≥ 11). Die exportierte Hilfsfunktion hält das zugesagte «max length - 1» an dieser Grenze aber nicht ein. Abhilfe: `keep ? window.slice(-keep) : ''`. |

Geprüft: C-1 bis C-3 aus 974-review-1 sind umgesetzt. Die Hochrechnung in R1 passt zu den Messungen: 1,2 → 2,8 GB, 24 → 97 s, Exponent ≈ 1,64, Grenze ≈ 5,6 GB, «rund 5 GB» ist vorsichtig gerundet. Test 1 schlägt ohne den Übertrag fehl (Stücke `xxxxxxCR`/`EATE TAB`/`LExx`). Test 2 prüft den negativen Fall. `tools/**/*.test.ts` ist in vitest eingebunden. `restore-check.ts` hat keinen toten Import mehr. `r1-benchmark.ts` löscht `dir` am Ende. Das Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt
- vitest file-contains.test.ts (2 Tests), die Mutationsprüfung ohne Übertrag, `bun run lint`, `bun run check`, `bun run fitness` und der kleine Lauf von `bun run fitness:r1` ohne verbleibendes /tmp/r1-benchmark-*: vom Aufrufer gemeldet, nicht selbst ausgeführt.
