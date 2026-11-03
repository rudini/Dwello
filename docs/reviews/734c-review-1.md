# Code-Review 734c, Runde 1 (Delta 8bd27f0e2..4e985255a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `URL.canParse` gibt es seit Node 19.9 / 18.17, also auch unter `engines.node >=20.0.0` (package.json:85, README.md:43). Verhalten gleich wie vorher: ungültiger oder leerer Referer bzw. `back` ergibt `null` (`canParse('')` ist false; `path !== null` entspricht `query.has('back')`); Herkunfts- und `//`-Prüfung unverändert. Kein `URL.parse` mehr im App-Code (nur noch im Kommentar statement.ts:261). Der neue Test löscht `URL.parse` und wäre am Basis-Commit mit TypeError in `pdfRefusal` rot; er stellt `URL.parse` in `afterEach` wieder her. Ungültige URL (`http%3A%2F%2F%5B`) und fehlender Referer sind schon durch bestehende Tests in pdf-refusal.test.ts abgedeckt. Kein Text, kein Szenario, kein Vertrag betroffen; nichts im Diff ohne Bezug zur Anforderung.

Low aus dem Fallback-Review (`back=` leer oder `back=%3Ffoo` führt auf /documents/refused selbst): Ablehnen ist vertretbar. Dahin kommt man nur über eine von Hand gebaute Adresse (`pdfRefusal` setzt `back` immer auf einen Pfad), es bleibt dieselbe Herkunft und schadet nicht. Kein Einwand.

## Nicht bestätigt

- bun run lint, bun run check, vitest pdf-refusal, statement-endpoints, statement-list-load (42): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Rot-Lauf des neuen Tests ohne die Änderung: nur durch Lesen beurteilt (der Basis-Code ruft `URL.parse` direkt auf).
