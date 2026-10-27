# Review #674, Runde 2 (Delta 5cc18bed..ef5d8fb5)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde |

Geschlossen: C-1

Geprüft: `backend/src/__tests__/pdf-translations.test.ts:30-33`: Kommentar und beide Codezeilen schreiben jetzt die Escape-Sequenz ` `; im Dateiinhalt gibt es kein Byte C2 A0 mehr (grep, `cat -A`). Die Semantik ist unverändert: `replaceAll('\\u00a0', ' ')` ersetzt die sechs Quelltextzeichen durch das echte U+00A0, und der Regex prüft auf U+00A0. `bun test src/__tests__/pdf-translations.test.ts` habe ich auf ef5d8fb5 erneut ausgeführt: 4 pass.

## Nicht bestätigt

- Mutation (`« {profile}` mit normalem Leerzeichen im fr-Block) lässt den Test scheitern: vom Aufrufer gemeldet, nicht wiederholt (dafür müsste ich eine Datei ändern). Aus dem Code gelesen ist das plausibel, denn das normale Leerzeichen erfüllt `(?! )` nicht.
- Prettier auf der Datei: vom Aufrufer gemeldet.
