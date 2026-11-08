# Code-Review 1202, Runde 2 (5b5404b..0e367ee, Delta zu Runde 1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1, C-2

## Nicht bestätigt

- `bun run check`, `bun run lint`, `bunx vitest run src/__tests__/config-page.dom.test.ts` (6 passed), `bun run test:e2e -- --project=chromium tests/e2e/features/settings.feature` (31 passed), fitness, backend type-check, design-guard, open-work und Commit-Hooks: vom Aufrufer gemeldet.
- Das Rot des neuen Szenarios unter `@wip` vor der Korrektur (Expected "", Received "Erika Muster"): vom Aufrufer gemeldet. Beim Lesen wird es ohne die Korrektur rot: `holder` behält die Werte aus der Grundlage, und `ist kein eigener Kontoinhaber mehr hinterlegt` (`tests/e2e/steps/settings.steps.ts:167-171`) entfernt das Häkchen und erwartet leere Felder. Das bestehende Szenario «Den Absender wieder als Kontoinhaber angeben» öffnet die Seite vorher neu und konnte den Fehler deshalb nicht zeigen.
- Dass `update()` nach einem erfolgreichen Speichern `data.settings` neu lädt, bevor `Object.assign` läuft: nach SvelteKit-Standard (`invalidateAll` bei `success`) angenommen, nicht ausgeführt.

Geprüft: C-1: «Hans Beispiel», «Rainweg 7», «3011», «Bern» kommen sonst in `tests/e2e` und den Seed-Daten nicht vor. C-2: Das Zurücksetzen läuft nur bei `result.type === 'success'`. Das ist nur `{ saved: true }`, denn Ablehnungen kommen als `fail()` (`src/lib/server/settings.ts:75-79`), und die Eingaben bleiben dann erhalten. Das neue Szenario ist mit `@einstellungen-global` isoliert und legt seine Daten selbst an. Kein neuer UI-Text und kein neuer Bildschirmzustand. Das Delta enthält nichts, was mit der Anforderung nichts zu tun hat.
