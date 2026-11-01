# Code-Review Runde 2: Strukturbericht nach Structure101 (2fd9fa1dd..0e7cd4ac3)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | tools/arch-baseline/structure.ts:424-426 | Weiterhin offen aus Runde 1 (vom Aufrufer als nicht trivial stehen gelassen): Das Inline-Skript, das bei einem Hash-Wechsel die Moduldetails öffnet, hat keinen Test. |

Geschlossen: C-1, C-2, C-3

Keine neuen Befunde im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (45 Tests), eslint, prettier, die Audits von testcheck, deepcheck und fallow, der Lauf von `structure.ts` gegen einen Ausgabeordner mit leerer `fallow-gaps.json` sowie die Rot-Läufe der beiden neuen Tests.
- Für die CLI-Änderung (C-2) gibt es keinen automatisierten Test. Belegt ist sie nur durch den gemeldeten Handlauf (structure.ts:434-442).
- Weiter offen, aber nicht Teil des Deltas: Eine leere `fallow-health.json` lässt `JSON.parse` weiterhin werfen (structure.ts:441, structure-history.sh:37). Das bestand schon auf dem Basis-Commit 6050c389d.

Geprüft: `routeFolder` (structure.ts:121-123) nimmt nur Paare im selben Ordner unter `src/routes/` aus. Pfade ausserhalb vergleicht es als ganze Pfade, und die sind in einem Paar immer verschieden. Der Framework-Test (structure.test.ts:357-366) bleibt grün. Der neue Geschwistertest (structure.test.ts:369-375) wäre mit dem alten `folder()` rot (0 statt 1). Für den Ce-Test (structure.test.ts:378-384) habe ich nachgerechnet: over(16/15) = 0.0625, also 10 von 160 Zeilen = 6.3 %. Ohne den Ce-Teil gäbe er `fat: 'green'` und XS 0 und wäre damit rot. `optionalJson` liefert bei fehlender oder leerer Datei `undefined`. Der Doku-Satz in `fitness-functions.md:43` und der Berichtstext (structure.ts:407) entsprechen jetzt dem Code. Ponytail-review: nichts ungenutzt, keine kopierte Hilfsfunktion.
