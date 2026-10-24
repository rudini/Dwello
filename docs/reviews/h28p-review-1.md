# Review h28p-1: Behebung von C-1 (h28o-review-1), Range e4cdc63e4..1acc3dccf

## Status der offenen IDs aus h28o-review-1

- C-1: behoben. Die Route gibt `refusal('ADVANCE_DAY_INVALID', 'validFrom must be a real day')` zurück (`backend/src/routes/contracts.ts:271`). `backendMessage()` zeigt damit `backend_advance_day_invalid`. Der Text ist in allen vier `messages/*.json` zeichengenau gleich wie `contracts_save_failed` (Zeile 758 und 2069 verglichen).

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/api-contracts.pg.test.ts:668-669 | Der neue Test steht zwischen dem Kommentar `// #464: a later Akonto the 2024 draft counts, entered before the draft …` und dem Test, den dieser Kommentar beschreibt. Der #464-Kommentar steht jetzt über dem Test für einen Tag, den es nicht gibt, und beschreibt ihn falsch. Dem Test zu #464 (`…eines gezählten Akontos…`) fehlt sein Kommentar. Der neue Block gehört über die #464-Zeile. |

Kein Blocker, kein Major.

Geprüft: Alle zehn Dateien des Diffs gelesen.
- Der BFF-Test `contract-actions.test.ts:586` schlägt ohne die Änderung fehl: Ohne `code` liefert `backendMessage` den Text `body.error` («validFrom must be a real day»).
- Der Vertrag ist neu, und `api-contracts.pg.test.ts` prüft ihn gegen die echte API. `backend-codes.test.ts` findet `refusal('ADVANCE_DAY_INVALID'` und verlangt `backend_advance_day_invalid`.
- Die API-Spezifikation nennt den Code.
- Die neue JSON-Datei ist Prettier-sauber.
- Die Regex im BFF lässt `2024-02-30` durch, deshalb erreicht der Fall das Backend.
- Was der Verwalter sieht, ändert sich nicht. Es braucht also kein Szenario und keinen a11y-Eintrag.
- Der Diff enthält nichts, was nicht zum Auftrag gehört.

## Nicht bestätigt

- `contract-actions.test.ts` und `backend-codes.test.ts` (52 pass): vom Aufrufer gemeldet, nicht erneut ausgeführt. Rot vor der Änderung nur durch Lesen beurteilt.
- `contract-advance.pg.test.ts` und `api-contracts.pg.test.ts` (94 pass): vom Aufrufer gemeldet. Backend-Tests laut Auftrag nicht ausgeführt.
- `bun run lint`, `bun run check`, Backend-Type-Check: vom Aufrufer gemeldet.
