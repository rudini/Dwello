# Review #1071, Runde 2, Delta e6f60ce00..96cea140a

Keine offenen Befunde.

Geschlossen: C-1

## Nicht bestätigt

- `bun run lint` und `bun run check` sauber, Prettier ohne Diff auf `tests/e2e/screenplay/questions.ts`: vom Aufrufer gemeldet.
- Szenario «Die Wahl der Gebäude passt in ein schmales Fenster» grün in Chromium; mit dem Repro aus C-1 (`min-w-0`, `whitespace-nowrap`, längere Adresse) rot (297 px), ohne den Range-Teil grün: vom Aufrufer gemeldet. Beim Lesen stimmig: `Range.selectNodeContents(box)` + `getClientRects()` liefert die Zeilenrechtecke der Text-Nodes, auch wo der Text über sein gestrecktes Element hinausläuft.
- Grün in Firefox und WebKit: nicht geprüft, lokal nicht installiert, erst CI zeigt es (`Range.getClientRects` ist Standard-DOM, ein Abweichen ist beim Lesen nicht erkennbar).

Geprüft: Delta in `tests/e2e/screenplay/questions.ts:89-94` gelesen; einziger Nutzer `buildingCardReachingOut` (`tests/e2e/questions/statement-generate.ts:196`, Step `statement-generate.steps.ts:786`); der versteckte Zähl-Span (`hidden`, `BuildingChoice.svelte:124`) liefert keine Rechtecke, kein `sr-only`/`truncate` in der Karte, also kein falsches Rot; die Messung prüft gegenüber Runde 1 mehr, nicht weniger.
