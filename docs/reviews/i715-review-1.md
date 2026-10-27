# Review #715, Runde 1 (4b0850d1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: beide geänderten Dateien vollständig gelesen; `Promise.all` lehnt ab, sobald ein `fetch` wirft, und der `.catch` gibt `[]` zurück, also fehlen beide Antworten zusammen oder keine, und `if (tenantsRes)` deckt beide ab; bei einer Antwort mit Fehlerstatus (it.each-Fälle) läuft die Statuszeile weiter genau einmal; der neue Test schlägt beim Lesen ohne die Änderung fehl (der `.catch` loggt, dann die alte Statuszeile `undefined undefined`, also 2 Aufrufe); `No scenario` in der Commit-Nachricht stimmt (nur das Server-Log ändert sich, die Fehlermeldung für den Liegenschaftsverwalter bleibt gleich); keine UI-Texte, kein neuer Bildschirm, kein API-Vertrag betroffen; `(#715)` in Kommentaren ist kein `TODO(fachlich prüfen, …)`-Marker (`tools/open-work/check-issues.mjs:27`); ponytail-review: Lean already. Ship.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Prettier auf den geänderten Dateien: vom Aufrufer gemeldet.
- Roter Lauf des neuen Tests vor dem Fix: vom Aufrufer gemeldet; beim Lesen bestätigt, nicht erneut ausgeführt.
- `bunx vitest run src/__tests__/contract-new-load.test.ts`: im Worktree erneut ausgeführt, 9 grün.
