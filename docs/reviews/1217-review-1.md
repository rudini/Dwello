# Code-Review #1217, Runde 1 (origin/main..3edf7cf)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Alle 10 geänderten Dateien gelesen. Ein Skript hat jede geänderte Zeile in `messages/{de,fr,it,en}.json` mit `origin/main` verglichen: Nach dem Ersetzen von U+00A0 durch ein Leerzeichen und dem Entfernen von U+2060 ist jede gleich. Die Schlüsselmenge ist unverändert. Rechtstexte (`privacy_*`, `terms_*`) ändern sich also nur im Leerraum, und das Datum «Stand» bleibt (`src/routes/privacy/+page.svelte:173`, `src/routes/terms/+page.svelte:54` sind nicht im Diff). Neu hinzugekommen ist nur ein U+2060, in `it` `contracts_notice_received_help` («266l–⁠266o»). Ein eigener Scan aller vier Dateien nach Art./Abs./Absatz/Ziff./Bst./al./cpv./para./let./lett./ch./n./No., Gesetzeskürzeln (OR, CO, DSG, LPD, FADP, VMWG, OBLF, OLAL, ZGB, SchKG …), SR/RS und «(2)(d)» fand keinen Verweis mehr mit gewöhnlichem Leerzeichen. Ausnahme sind nur Konjunktionen zwischen zwei Verweisen («und»/«bis»/«et»/«à»/«e»/«and»/«to»), und die sind bewusst erlaubt. Das Muster trifft auf die heutigen Texte nicht falsch: Prozent-, Datums- und Bereichsangaben wie «7 bis 90 Tage» bleiben unberührt. Der Test liest jetzt alle vier Dateien (`languages` = alle Dateien in `messages/`). Mit den Texten von `origin/main` würde er rot, denn die 22 geänderten Schlüssel pro Sprache enthalten dort Treffer. Der Wegfall des Wächters `checked.length > 15` lässt keine Lücke, weil kein Filter mehr leer laufen kann. Die neun angepassten DOM-Erwartungen entsprechen den neuen Texten. Die E2E-Textfragen normalisieren mit `\s+` (`tests/e2e/screenplay/questions.ts:17`, deckt U+00A0 ab). Die Schritte in `app-frame.steps.ts:213-262` und `invoice-form.steps.ts:124` mit «Art. …» halten deshalb ohne Änderung. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- `bunx vitest run` (221 Dateien, grün; vorher 9 DOM-Fehler), Rot-Lauf des i18n-Tests in allen 4 Sprachen, `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, Prettier auf neuen Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Ob die Szenarien mit diesen Texten grün bleiben (`terms.feature:31`, `help.feature:73`, `invoice-new.feature:33`, `privacy.feature`): Ich habe sie nur gelesen, und zwar über die Normalisierung in `tests/e2e/screenplay/questions.ts:17`. Es lief kein E2E-Lauf.
- Ob der Zeilenumbruch im Browser wirklich so ausfällt: Das lässt sich nur am gerenderten Text zeigen. Geprüft habe ich nur die Zeichen in `messages/*.json`.
