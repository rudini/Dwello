# Code-Review Slice 1093e, Runde 1 (`5b0372d45..6ffe70932`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: `src/routes/documents/refused/+page.server.ts` (einzige geänderte Datei). `of` liest `gone`, `deleted` und `listOfGone` (`src/lib/server/statement.ts:252`, ein einfaches Objekt) nur über `Object.hasOwn`; ein leerer Code ergibt `undefined`. `backendMessage` (`src/lib/backend-error.ts`, `messageOf`) ist für solche Codes sicher: Es nimmt nur `^[A-Z][A-Z0-9_]+$` an (`__proto__`, `constructor` und `toString` fallen durch) und schlägt dann `backend_<code klein>` im Paraglide-Modul nach, in dem keine geerbten Namen dieser Form vorkommen. `SETTINGS_CODES.includes` ist unkritisch. Der Test «zeigt die Fehlerseite auch mit einem Code, den Dwello nicht kennt» schlägt ohne `of` fehl: `gone['constructor']()` ergibt `{}` statt des Titels, und `gone['__proto__']()` wirft einen Fehler. Commit-Betreff ist konform. Im Diff gibt es nichts, das nicht zur Anforderung gehört. Das Szenario ist durch #1093 abgedeckt: Es handelt sich um einen Robustheits-Fix ohne sichtbares Verhalten für gültige Codes.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run fitness` (AP2 ohne Fehler) und `bunx vitest run src/__tests__/pdf-refusal.test.ts` sind vom Aufrufer gemeldet, nicht selbst ausgeführt.
