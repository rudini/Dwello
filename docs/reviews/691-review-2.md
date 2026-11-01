# Review #691, Runde 2 (Abschlussrunde, 391baa6e0..4e78020a6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2

Geprüft: beide geänderten Dateien gelesen. Der Kommentar in CostTable.svelte:128 nennt jetzt auch die gestapelte Variante. Der DOM-Test (statement-pages.dom.test.ts:2389-2392) prüft die Karten, dass die Liste kein `md:hidden` trägt und dass der Tabellen-Wrapper kein `md:block` hat. Ohne `stacked` würde der Test also rot, weil CostTable.svelte:16 dann `md:hidden` und `hidden md:block` setzt. Keine Änderungen ohne Bezug.

## Nicht bestätigt

- `bun run lint`, `bunx vitest run src/__tests__/statement-pages.dom.test.ts` (225 passed): vom Aufrufer gemeldet.
- Rot-Lauf des geänderten Tests ohne `stacked` auf der Bearbeitungsseite: vom Aufrufer gemeldet. Beim Lesen ist er plausibel (siehe oben).
