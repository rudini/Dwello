# Code-Review 659, Runde 3 (CI-Fix, Delta 67996c3..85e38b6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Das Delta ändert nur `messages/fr.json`, die Schlüssel `statements_heating_help` und `statements_heating_meters`. Vor «;», «%» und den beiden «:» steht jetzt U+00A0, vor keinem dieser Zeichen bleibt ein normales Leerzeichen. Per Skript nachgeprüft: `help` (bis zum letzten «. ») + " " + `meters` + " " + `help` (letzter Satz) ergibt Byte für Byte `statements_heating_help` aus fr.json am Merge-Base 0a73289. Der Wortlaut bleibt also unverändert, wie vom Product Owner entschieden.

## Nicht bestätigt
- `bunx vitest run` (alle Unit-Tests, 4121 grün, darunter `src/__tests__/i18n.test.ts`): vom Aufrufer gemeldet, nicht selbst ausgeführt.
