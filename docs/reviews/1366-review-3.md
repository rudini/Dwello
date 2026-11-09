# Review 1366, Runde 3 (Delta ef630c7..5da3633)

Keine offenen und keine neuen Befunde.

Geschlossen: keine offenen IDs aus Runde 2.

Geprüft: `keyed` (CostTable.svelte:23–29) ergänzt den Schlüssel aus Runde 2 um die Zahl der früheren Positionen mit demselben Paar. Beide each-Blöcken verwenden ihn (:145, :174). Der Schlüssel ist damit auch dann eindeutig, wenn über POST /statements/:id/line-items zwei Positionen mit demselben Paar gespeichert wurden. Beim Neuberechnen bleibt er gleich, weil das Backend die Positionen nach `sortOrder` liefert (statement.service.ts:200, :320). Der neue DOM-Test (zwei Positionen `c1/k1`) würde mit dem Schlüssel aus Runde 2 `each_key_duplicate` werfen und ist damit rot. Er prüft Karten und Tabellenzeilen. Der gekürzte Template-Kommentar stimmt, und das Delta enthält nichts ausserhalb des Befunds.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, vitest cost-table.svelte.dom (3) und statement-pages.dom (279 zusammen), E2E WebKit «Nach dem Neuberechnen bleibt der Liegenschaftsverwalter, wo er war» 4/4. Ebenfalls vom Aufrufer gemeldet: der Rotlauf des neuen Tests mit dem Schlüssel aus Runde 2. Diesen habe ich nur durch Lesen nachvollzogen.
