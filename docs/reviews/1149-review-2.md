# Code-Review #1149, Runde 2 (fb88ed7ed, Delta zu e294cff7c)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | keine offenen oder neuen Befunde |

Geschlossen: C-1, C-2

- C-1: `TenantRow.svelte:27` nimmt jetzt den Wert, den der Load schon gemappt hat (`+page.server.ts:41-43`, «Wohnung 2.01» bzw. «Appartement 3.01» laut `tenants-i18n.test.ts:46`), und hängt nur « · Gebäude» an. «Wohnung» steht damit einmal da, in jeder Sprache. Der Import von `apartmentName` ist weg, es bleibt kein ungenutzter Code zurück.
- C-2: Der Test gibt der Zeile wieder die Form, die der Load liefert (`'Wohnung 2.01'`, gleich wie `öffnet den Mieter über seinen Namen`). Er erwartet `toContain('Wohnung 2.01 · Ahornhof')` und `not.toContain('Wohnung Wohnung')`. Beim Lesen geprüft, ob er ohne die Änderung rot wird: Gegen e294cff7c wird `not.toContain` rot, weil die Zeile «Wohnung Wohnung 2.01 · …» zeigt. Gegen die Basis wird `toContain` rot, weil die Zeile «Wohnung 2.01 - Ahornhof» zeigt.

Ponytail: Der Diff ist schon schlank, es gibt nichts zu kürzen.

## Nicht bestätigt

- `tenant-list.test.ts` und `tenants-i18n.test.ts` (13 grün): vom Aufrufer gemeldet.
- Dass der Test gegen e294cff7c rot war: vom Aufrufer gemeldet, durch Lesen des Codes nachvollzogen.
- `bun run lint`, `bun run check`: vom Aufrufer gemeldet.
- E2E `tenants.feature` (8 grün), Axe- und Sprachzeilen `tenants` (6 grün): vom Aufrufer gemeldet.

Geprüft: Der E2E-Schritt (`${apartment} · `) und sein Kommentar stimmen mit der neuen Ausgabe überein. Der Diff ändert ausser `docs/reviews` nur die zwei Dateien des Fixes.
