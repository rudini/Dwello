# Code-Review #1257, Runde 4 (Abschlussrunde, Delta 51c7121..fd37ea1)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Geschlossen: C-3 (gleichzeitig erfasster Mietvertrag geht nicht mehr durch die Kaskade verloren).

Geprüft: `deleteApartment` (backend/src/services/apartment.service.ts:279-298): `FOR UPDATE` auf der Wohnung kollidiert mit dem `FOR KEY SHARE` der FK-Prüfung eines Mietvertrag-Inserts; in READ COMMITTED sieht die nächste Abfrage den inzwischen festgeschriebenen Vertrag, umgekehrt scheitert der spätere Insert am FK (wie schon auf der Basis). Ohne die Sperre wartet das alte `DELETE` auf denselben Lock und kaskadiert danach, also ist der neue pg-Test auf der Basis rot. Er kann nicht fälschlich rot werden; ohne Sperre wäre er nur dann fälschlich grün, wenn das Löschen nicht innerhalb von 300 ms bei der DB ankommt (Pool 20). Seine Aufräumreihenfolge stimmt (`unshift` vor `rental.remove`, Verträge vor Mieter und Wohnung). Die neue Reihenfolge in helpers/rental.ts stimmt (fremde Verträge, eigener Vertrag, Mieter, Wohnung, Gebäude). Ponytail: kein ungenutzter Code, keine Kopie eines Helfers (`.returning()`/`result.length` fiel sauber weg). Die Ablehnung von Punkt 2 der Fallback-Review trägt: Laut tests/e2e/CLAUDE.md, «Failure states» erreicht FailRequests kein `fail()` einer Action, und der DOM-Test in src/__tests__/apartments-pages.dom.test.ts:301 deckt den Zustand ab.

## Nicht bestätigt

- Backend `type-check` und die ganze Backend-Suite `bun run test` (2103 bestanden, Coverage 97.3 % Zeilen) auf fd37ea1: vom Aufrufer gemeldet.
- Grünes CI auf 51c7121: vom Aufrufer gemeldet.
- Roter Lauf des neuen pg-Tests vor der Änderung: vom Aufrufer gemeldet, nur durch Lesen geprüft (siehe oben).
