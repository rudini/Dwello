# Review i712, Runde 2 (Delta 8e1ddf49..fcebbfe1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde |

Geschlossen: C-1

Geprüft: `eslint.config.js:48-54` (Template-Schlüssel über `:has(TemplateElement[value.raw=…])`, eingebunden in den Selektor in Zeile 160 samt `:not(:has(> SpreadElement))`); der neue Fall in `src/__tests__/backend-response-lint.test.ts:19-22` scheitert ohne die Änderung (ein Template-Schlüssel hat kein `key.value`). `bunx vitest run src/__tests__/backend-response-lint.test.ts` selbst erneut ausgeführt: 5 bestanden.

## Nicht bestätigt

- `bun run lint` und Prettier auf den geänderten Dateien: vom Aufrufer gemeldet.
- Der rote Lauf des Template-Falls: vom Aufrufer gemeldet; durch Lesen bestätigt, dass ihn die alte Regel nicht erfasst.
