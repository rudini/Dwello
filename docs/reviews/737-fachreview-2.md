# Fach-Review #737, Schritt 1, Runde 1 des Slice «737 P-1» (Commit 837ac99)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Das Szenario «Formel testen, die für eine Wohnung keine Zahl ergibt» (tests/e2e/features/distribution-keys.feature:63–66) und die Texte (de.json:552, 554) widersprechen dem Entscheid in #737: Es fehlen Ursache und nächster Schritt, und «Die Formel …: Die Formel …» steht doppelt da. |
| V-2 | Verwalter | Minor | Den negativen Wert prüft kein Szenario, obwohl der Entscheid ihn ausdrücklich nennt (P-2). Lösung: ein neues Szenario oder eine Examples-Zeile mit `{area} - 100` und dem Text `backend_formula_negative` aus der Tabelle unten. |
| V-3 | Verwalter | Minor | `backend_formula_all_zero` (de.json:556) nennt die Ursache, aber keinen nächsten Schritt. Der Fehler hängt von den Werten ab und fällt damit unter den Entscheid. Ein Anfänger macht ihn leicht, zum Beispiel mit `{units} - 1` (bei jeder Beispielwohnung 0) oder `{area} * 0`. Lösung: den Text aus der Tabelle übernehmen. |

## V-1 (Major)

- Beleg: feature:66 erwartet «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel ergibt keine gültige Zahl.». Zusammengesetzt wird das aus `backend_formula_apartment_failed` («Die Formel kann für eine Wohnung nicht berechnet werden: {reason}», de.json:554) und `backend_formula_not_a_number` (de.json:552). Der Entscheid in #737 verlangt dagegen «Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.».
- Warum falsch: Die Szenarien sind die Spezifikation. Die heutige Zeile würde den abgelehnten Text festschreiben. Das Szenario ist nur auf dem Branch (b88425c), nicht auf `main`, und lässt sich deshalb ohne `Spec change approved` ändern.
- Lösung mit den wenigsten geänderten Schlüsseln, ohne neuen Code und ohne Änderung im Backend oder am API-Vertrag:
  1. `backend_formula_apartment_failed` wird in allen vier Sprachen zu `{reason}`. Das Backend liefert weiterhin `FORMULA_APARTMENT_FAILED` mit `params.reason`, und `backendMessage` setzt den Grund ein (src/lib/backend-error.ts:33–36).
  2. `backend_formula_not_a_number` enthält den ganzen Satz des Product Owners.
  3. Der zweite mögliche Grund, `backend_formula_value_missing`, bleibt unverändert. Er kann nicht auftreten: Unbekannte Bausteine weist schon `parseFormula` ab, `withTotals` (formula.service.ts:244–254) ergänzt `volume`, `units` und alle Summen, und `area` und `rooms` sind `notNull` (backend/src/db/schema.ts:67–68). Das gilt auch für die echten Wohnungen in `calculateBuildingDistribution`.
  4. Die feature:66 sowie die Tests src/__tests__/backend-error.test.ts:34,56 und src/__tests__/formula-test-result.dom.test.ts:9 erwarten den neuen Satz. Die eigenen deutschen Texte des Backends (formula.service.ts:217, 280, 291, 304; geprüft in formula-codes.test.ts:39 und formula.service.test.ts:285) sollten zum neuen Wortlaut passen, die Oberfläche zeigt sie aber nicht.
- Nachgerechnet: `{area} / ({units} - 1)`: Bei 50 m² ergibt sich 50 / 0 = Infinity, also `FORMULA_NOT_A_NUMBER` bei der ersten Beispielwohnung, und der Text steht einmal. Wenn die Wohnungen verschiedene Fehler haben, entscheidet die erste: Bei `({area} - 75) / ({area} - 100)` ergibt 50 m² 0.5, 75 m² 0, 100 m² 25/0, also «keine Zahl». 0/0 ergibt NaN, ebenfalls «keine Zahl», und dafür stimmt «meist … durch null» auch. Eine wörtliche `/ 0` weist schon `FORMULA_DIVISION_BY_ZERO` ab (formula.service.ts:153). `{area} - 100`: Bei 50 m² ergibt sich −50, also `FORMULA_NEGATIVE`. `{units} - 1`: Alle Wohnungen ergeben 0, also `FORMULA_ALL_ZERO`.

## Texte

Die Zeichen sind wie in den Dateien escaped. Im Französischen steht in « … » innen je ein U+00A0, im Italienischen und Englischen stehen «» ohne Leerzeichen, wie bei `backend_formula_invalid_characters`.

| key | de | fr | it | en |
|---|---|---|---|---|
| backend_formula_apartment_failed | `{reason}` | `{reason}` | `{reason}` | `{reason}` |
| backend_formula_not_a_number | `Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.` | `Pour un appartement, la formule ne donne pas de nombre, généralement parce qu’elle y divise par zéro. Vérifiez ce qui se trouve après « / ».` | `Per un appartamento la formula non dà un numero, di solito perché lì divide per zero. Verifichi cosa c’è dopo «/».` | `For one apartment the formula gives no number, usually because it divides by zero there. Check what comes after «/».` |
| backend_formula_negative | `Für eine Wohnung ergibt die Formel einen negativen Wert, meist weil sie dort zu viel abzieht. Prüfen Sie, was nach «-» steht.` | `Pour un appartement, la formule donne une valeur négative, généralement parce qu’elle y soustrait trop. Vérifiez ce qui se trouve après « - ».` | `Per un appartamento la formula dà un valore negativo, di solito perché lì sottrae troppo. Verifichi cosa c’è dopo «-».` | `For one apartment the formula gives a negative value, usually because it subtracts too much there. Check what comes after «-».` |
| backend_formula_all_zero (V-3) | `Die Formel ergibt für alle Wohnungen null, so lassen sich keine Anteile berechnen. Prüfen Sie, ob sie mit 0 malnimmt oder \\{units\\} - 1 enthält (\\{units\\} ist für jede Wohnung 1).` | `La formule donne zéro pour tous les appartements, aucune part ne peut donc être calculée. Vérifiez si elle multiplie par 0 ou contient \\{units\\} - 1 (\\{units\\} vaut 1 pour chaque appartement).` | `La formula dà zero per tutti gli appartamenti, quindi non è possibile calcolare le quote. Verifichi se moltiplica per 0 o contiene \\{units\\} - 1 (\\{units\\} vale 1 per ogni appartamento).` | `The formula gives zero for all apartments, so no shares can be calculated. Check whether it multiplies by 0 or contains \\{units\\} - 1 (\\{units\\} is 1 for every apartment).` |

In der fr-Spalte: In `« / »` und `« - »` steht zwischen Guillemet und Zeichen je ein U+00A0, also `« / »` und `« - »`. Vor «:» steht in keinem dieser Texte ein Zeichen.

## Nicht bestätigt

- Ausserhalb von #737, nur im Code gelesen und schon auf `main` vorhanden: Scheitert ein eigener Verteilschlüssel in einer echten Nebenkostenabrechnung, verteilt `calculation.service.ts:263–269` die Kosten ohne Hinweis zu gleichen Teilen («Fallback to equal distribution»). Dann wird nicht nach dem vereinbarten Schlüssel abgerechnet, und der Liegenschaftsverwalter erfährt es nicht. Seit #737 wird beim Speichern nur noch mit den vier Beispielwohnungen geprüft, die alle ganze Zimmer haben. Eine Formel wie `1 / ({rooms} - 3.5)` wird also gespeichert und scheitert erst an einer echten 3.5-Zimmer-Wohnung. Ob ein Issue dazu besteht, habe ich nicht geprüft. Ob das Verhalten mietrechtlich unzulässig ist, ist **unsicher**, denn ich habe keine Fedlex-Stelle abgerufen. Vorschlag an den Aufrufer: Issue suchen oder eröffnen (`domain`).
- Wie die Texte im Browser aussehen (Umbruch bei 390 px, U+00A0 im Französischen), habe ich nicht ausgeführt.

Geprüft: Die Texte folgen dem Entscheid: einmal angezeigt, ohne Beispielwohnung, ohne `%`. «Baustein» wird nicht gebraucht. «/», «-» und «mal» passen zu `keys_calculate_text` und `keys_formula_help`, «\{units\} ist für jede Wohnung 1» passt zu `keys_var_units`. Unter dem Titel «Der Test hat einen Fehler gefunden» wiederholt sich nichts mehr. «Für eine Wohnung» steht auch, wenn alle Beispielwohnungen scheitern (feature:66), wie vom Product Owner entschieden. Mietrecht und Rechtstexte sind nicht betroffen, es geht nur um Meldungen zu Formeln.
