# Review 1366, Runde 2 (Delta c0e415f..a0e81b7)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1

Geprüft: Der Schlüssel `${item.categoryId ?? item.id}/${item.distributionKeyId ?? item.id}` steht in beiden each-Blöcken (CostTable.svelte:135, :164). Er ist eindeutig für Positionen mit gelöschter Kategorie oder gelöschtem Schlüssel und bleibt beim Neuberechnen gleich, solange beide Ids gesetzt sind. Der neue DOM-Test (zwei Positionen `null/k1`) wirft mit dem Schlüssel aus Runde 1 `each_key_duplicate` (vitest läuft im Dev-Modus) und ist damit rot. Der Neuberechnungstest gibt den Positionen jetzt `distributionKeyId`; das ist nötig, weil die gemeinsame Fixture (src/__tests__/helpers/statement.ts:55–69) keine hat und der Rückfall auf die Id sonst neue Schlüssel ergäbe. Mit dem Schlüssel `item.id` bleibt der Test rot. Der Kommentar stimmt, und das Delta enthält nichts ausserhalb von C-1.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, vitest cost-table.svelte.dom (2) und statement-pages.dom (278 zusammen), E2E WebKit «Nach dem Neuberechnen bleibt der Liegenschaftsverwalter, wo er war» 4/4. Ebenfalls gemeldet: beide Rotläufe (der neue Test mit dem Schlüssel aus Runde 1, der Neuberechnungstest mit `item.id`). Diese habe ich nur durch Lesen nachvollzogen.
