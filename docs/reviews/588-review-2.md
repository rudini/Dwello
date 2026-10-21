# Code-Review #588, Runde 2 (Abschluss, 689e360..50d81c2)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): erledigt.** Der Fake `fetchWith` in `src/__tests__/statement-generation.test.ts:663–665` liefert die Heizprofile jetzt wie das Backend: höchstens `limit` Einträge, ohne Parameter 100. Der neue Test in Zeile 711–716 baut 150 Profile (hp1 bis hp150). Die Abrechnung liegt auf `hp120`, also an Index 119. Erwartet wird `profile: { used: 'Eintrag 120', run: 'Heizung Mittelland' }`. Beim Lesen bestätigt: Mit `limit=100` in `statement-generation.ts:380` fehlt hp120 in der Liste, und `used` wäre nicht «Eintrag 120». Der Test ist also ohne den Fix rot. Die übrigen Tests im `describe` bleiben gültig, weil sie höchstens 2 Profile übergeben.

Geprüft: Der Delta-Diff ändert nur diese Testdatei. Er enthält keinen Produktionscode, keine UI-Texte und nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe sie nicht selbst wiederholt: `bunx vitest run src/__tests__/statement-generation.test.ts` (56 grün); der neue Test rot mit `limit=100`; `bun run lint`; der Merge von `main` ohne neue Commits.
