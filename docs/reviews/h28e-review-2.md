# Review H-28 (#717) Gebäudeformular, Runde 2 (Abschlussrunde, 178ea3968 gegen 1c361e7f3)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Keine Blocker oder Major.

## Status der IDs aus Runde 1 (docs/reviews/h28e-review-1.md)

- J-1 (Minor): bleibt offen, wie vom Aufrufer begründet. Das Delta ändert `floor` nicht (backend/src/services/building-fields.ts:50, :54 prüft weiterhin nur, ob das Feld leer ist).
- J-2 (Minor): erledigt. backend/src/services/building-fields.ts:20-21, :26-27 (`required('…', { code: '…' })`) und :49-52 (`{ key: '…', code: '…' }`) treffen jetzt den Zweig `\bcode: '([A-Z][A-Z0-9_]+)'` der Regex in src/__tests__/backend-codes.test.ts:8. Nachgeprüft: Ich habe dieselbe Regex mit `node -e` auf die Datei angewendet. Auf 1c361e7f3 findet sie 5 Codes, auf 178ea3968 alle 13, also auch die 8 bisher fehlenden `BUILDING_NAME/ADDRESS/CITY/CANTON_REQUIRED` und `APARTMENT_NUMBER/FLOOR/AREA/ROOMS_REQUIRED`. Für jeden der 13 gibt es `backend_<code>` in de, fr, it und en. Der Kommentar in Zeile 16 enthält `'…'` und erzeugt deshalb keinen Scheintreffer. Fehlt künftig eine Meldung, wird der Test damit rot.
- J-3 (Minor): erledigt. docs/api-specification.md:26 nennt alle 13 Codes, dieselben, die der Code enthält. Dazu kommen `causes` mit `params.field` und der Schlüssel `apartments.<index>.<field>`, passend zur Tabellenzeile :58.

Geprüft: Das Refactoring ändert kein Verhalten (gleiche Codes, gleiche Felder, gleiche Reihenfolge, nur die Form der Argumente ist anders). Ponytail: nichts Ungenutztes. Nichts im Diff hat keinen Bezug zur Anforderung.

## Nicht bestätigt

- backend `bun test building-fields.test.ts` (14 pass): vom Aufrufer gemeldet.
- backend type-check: vom Aufrufer gemeldet.
- `bunx vitest run backend-codes.test.ts` (2 passed): vom Aufrufer gemeldet. Nicht erneut ausgeführt, durch die Regex-Prüfung oben gestützt.
- lint und Prettier auf den geänderten Zeilen: nicht gemeldet und nicht ausgeführt.
