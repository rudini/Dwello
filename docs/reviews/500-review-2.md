# Code-Review #500, Runde 2 (Abschluss, e214aa7..67a3584, backend/src)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): behoben.** `namedByFloor` in `backend/src/services/pdf.service.ts:665-666` lässt das Stockwerk nur weg, wenn die Nummer bei einem Stockwerk über Boden nicht auch mit dem Namen des gleich tiefen Untergeschosses beginnt. Für «1° piano interrato» auf Stockwerk 1 ergibt das false, das Stockwerk «1° piano» bleibt also stehen. Die Testzeile `['it', '1° piano interrato', 1, …, 1° piano, 82.00']` (`statement-pdf-render.test.ts:98`) zeigt das. Laut Commit-Nachricht war sie vor dem Fix rot, und das passt zum alten Regex, der hier true lieferte. Gegengeprüft: «1° piano interrato» auf −1 bleibt weggelassen (floor > 0 greift nicht), «1° piano» auf 1 ebenfalls. In `FLOORS` gibt es keine weitere Präfix-Überschneidung zwischen den Namen über und unter Boden: de «1. OG»/«1. UG», fr «1er étage»/«1er sous-sol», en «1st floor»/«basement», «1. OG» gegen «11. OG».
- **C-2 (Minor): behoben.** Testzeilen kamen hinzu für «EG, links» und «EG-1» auf Stockwerk 0 sowie für «1-OG» auf Stockwerk 1 (`statement-pdf-render.test.ts:94-96`). Ohne `,`/`-` im Lookahead würden «EG, links» und «EG-1» als «…, EG, 82.00 m²» gedruckt. Beide Zeilen schlagen dann fehl. Ohne Escaping würde «1.\s*OG» auf «1-OG» passen und das Stockwerk entfallen. Dann schlägt die Zeile «1-OG» fehl. Beide Teile des Regex sind damit belegt.

Geprüft: Den Aufrufer `addresses` (Zeile 721) mit dem neuen Aufruf `namedByFloor(number, floor, language)`. Ausserdem, dass `formatFloor(-floor, lang)` für jede Sprache einen gültigen Namen liefert. Im Bereich `backend/src` ist sonst nichts geändert, kein UI-Text, keine API-Antwort und kein Vertrag.

## Nicht bestätigt

- `bun test src/__tests__/statement-pdf-render.test.ts` (133), backend type-check und lint auf 67a3584: vom Aufrufer gemeldet, nicht selbst ausgeführt (laut Auftrag).
- Rotlauf der italienischen Zeile vor dem Fix: nur aus der Commit-Nachricht 67a3584 und durch Lesen des alten Regex bestätigt, nicht ausgeführt.
