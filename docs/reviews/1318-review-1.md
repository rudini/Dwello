# Code-Review #1318, Runde 1 (e4a45a6..9a95965)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/api-specification.md:28 | Die API-Beschreibung nennt weiter `TEXT_TOO_LONG {field, max}`. Seit 9a95965 schickt das Backend auch `length` (backend/src/services/text-length.ts:15, tests/contracts/*-text-too-long.json), deshalb stimmt die Doku nicht mehr. Ergänzen: `{field, max, length}`. |

Geprüft: Der Wortlaut in allen vier `messages/*.json` entspricht Entscheidung und Fachreview (docs/reviews/1318-fachreview-1.md) Wort für Wort, und src/__tests__/backend-error.test.ts hält ihn fest. `length` zählt Codepoints, so wie PostgreSQL; der neue Fall mit 31 × «𝄞» in text-length.test.ts ist ohne die Änderung rot. Es gibt nur eine Stelle, die TEXT_TOO_LONG erzeugt (text-length.ts:15), also kann `{length}` nirgends fehlen. Die 4 Contracts und die pg-Tests sind nachgeführt. Die 8 Szenarien ändern nur den erwarteten Text, Step-Definitionen sind nicht berührt, und 40cdd2a trägt `Spec change approved: #1318`. Die Rechnungsmeldung `invoices_error_too_long` (#743) und ihre Tests sind unverändert (invoices.test.ts:493, invoice-upload-dialog.dom.test.ts:401). Die übrigen DOM-Tests mit dem alten Text übergeben ihn als Prop und rendern ihn nicht aus dem Backend. Es gibt keinen neuen Bildschirmzustand. Ponytail: kein ungenutzter Code und keine Kopie eines Helpers.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht selbst laufen lassen: bun run lint, bun run check, backend type-check, die genannten vitest-Dateien (171 grün), die Backend-Tests text-length / setup / category-allocability / api-contracts (152 grün) und die 8 E2E-Szenarien auf chromium (13 grün). Ebenso vom Aufrufer gemeldet: der Rot-Lauf vor der Umsetzung.
- Ob `bun run fitness` und der Prettier-Check auf docs/reviews/1318-fachreview-1.md (neue Datei) durchlaufen, ist nicht gemeldet und nicht geprüft.
