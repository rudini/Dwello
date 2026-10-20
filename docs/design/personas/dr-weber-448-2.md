# Persona-Review Dr. Weber – Slice 448, Runde 2 (Berichtigen-Bestätigung und «Erledigt»)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Demo-Daten). Nur angesehen, nichts gespeichert, die Berichtigung nicht bestätigt. Geprüft habe ich meine Befunde P-1 und P-2 aus `dr-weber-448.md`.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/dr-weber-448-2/`.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| P-1 | Minor | Abrechnung berichtigen (Bestätigung), Abrechnung 2024 | Behoben bis auf einen Rest. Die Bestätigung behandelt jetzt beide Fälle: Bei einer versendeten nächsten Abrechnung zählt der Übertrag als «Bereits verrechnet», «der Mieter bezahlt oder erhält ihn nicht doppelt». Bei einem Entwurf «entfernt Dwello den Übertrag sofort aus dem Entwurf», und die berichtigte Abrechnung rechnet den ganzen Saldo ab. Meine Frage «doppelt oder gar nicht» ist damit beantwortet. Rest: Der Text ist allgemein («Enthält eine …», «Enthält ein Entwurf …»). Welcher Fall hier gilt und welche Abrechnung betroffen ist (z. B. NK-22222222-2025-0001), muss ich selbst herausfinden. In diesem Lauf enthält der Entwurf 2025 gar keinen Übertrag (Rückerstattung CHF 34.60), es gilt also keiner der beiden Fälle. Das sagt die Bestätigung nicht. |
| P-2 | – (behoben) | Hilfe, Abrechnungsliste | Die Hilfe erklärt «Erledigt» unter «Begriffe kurz erklärt» klar und grenzt es von «Bezahlt» ab. In der Liste unterscheidet sich der Status sichtbar: «Erledigt» grau mit Info-Symbol (i), «Bezahlt» grün mit Häkchen. Den Unterschied tragen also Symbol und Wort, nicht nur die Farbe. Beim Status selbst (Liste, Filter, Abrechnung) steht kein erklärender Satz. In der Abrechnung erklärt die Karte «Zahlung» den Fall aber. |

## Beobachtungen

- Hilfetext «Erledigt», wörtlich: «Status einer versendeten Abrechnung, auf die keine Zahlung folgt: Der Saldo ist 0.00, oder er ist kleiner als CHF 5.00 und wird mit der nächsten Abrechnung desselben Mietvertrags verrechnet (Übertrag). Ein übertragener Betrag ist damit noch nicht bezahlt: Der Mieter bezahlt oder erhält ihn mit der nächsten Abrechnung. Eine erledigte Abrechnung hat kein Zahlungsdatum und wird nicht gemahnt. «Bezahlt» heisst dagegen, dass Sie eine Zahlung erfasst haben.» Das ist genau die Abgrenzung, die mir gefehlt hat. Juristisch sauber ist auch: «damit noch nicht bezahlt».
- Der Eintrag «Saldo» in der Hilfe verwendet jetzt «verrechnet» und «Übertrag» zusammen. Damit sind die zwei Wörter verbunden, die mich in Runde 1 verwirrt haben.
- Der Begriff «Bereits verrechnet» steht weiterhin nur in der Bestätigung, nicht in der Hilfe. Die Bestätigung erklärt ihn aber im selben Satz («nicht doppelt»). Das genügt mir.
- Die Bestätigung sagt nicht, ob beim Entfernen des Übertrags auch ein bereits erstelltes PDF des Entwurfs verworfen wird. Der Entwurf 2025 hat hier ein PDF («PDF erstellt 20.10.2026»). Die Bestätigung «Entwurf neu berechnen» aus Runde 1 sagt das ausdrücklich, diese hier nicht.
- Der Satz «Ist der Saldo der berichtigten Abrechnung wieder kleiner als CHF 5.00, berechnen Sie den Entwurf neu, nachdem Sie die berichtigte Abrechnung versendet haben» ist klar und gibt die Reihenfolge vor. Ein Hinweis darauf erscheint später nicht von selbst. Das konnte ich ohne Bestätigen nicht prüfen.
- Die Bestätigung ist lang (ein Absatz mit fünf Sätzen, dann drei weitere Absätze), passt aber ohne Scrollen in den Dialog. Die Warnung «Das lässt sich nicht rückgängig machen.» ist fett. Der Bestätigungsknopf ist rot und mit «Abrechnung berichtigen» beschriftet. «Abbrechen» hat den Dialog geschlossen, die Abrechnung blieb «Erledigt».
- Die Karte «Zahlung» in der Abrechnung 2024 sagt weiterhin nur «Er wird mit der nächsten Abrechnung verrechnet.», ohne die Nummer (mein P-4 aus Runde 1, nicht Teil dieser Aufgabe).

## Aufgabe geschafft: ja

## Aufwand

Etwa 8 Minuten, 7 Schritte (Liste, Filter Erledigt, Filter Bezahlt, Abrechnung 2024, Bestätigung lesen und abbrechen, Entwurf 2025 ansehen, Hilfe lesen).

## Ablauf

1. **Abrechnungsliste.** Erwartet: dieselben Zahlen wie in Runde 1. Gesehen: Entwurf 7, Versendet 1, Bezahlt 8, Erledigt 1, Überfällig 0.
2. **Filter «Erledigt».** Erwartet: Thomas Weber 2024, dazu vielleicht ein erklärender Satz. Gesehen: eine Zeile «Thomas Weber, NK-22222222-2024-0001, Rückerstattung CHF 3.00», Status grau mit (i)-Symbol «Erledigt», rechts «PDF noch nicht erstellt». Kein erklärender Satz in der Liste. Ein Tooltip ist auch nicht vorhanden, das Element hat keinen Titel.
3. **Filter «Bezahlt».** Erwartet: ein anderes Aussehen. Gesehen: acht Zeilen, Status grün umrandet mit Häkchen «Bezahlt». Deutlich anders als «Erledigt», auch ohne Farbe am Symbol erkennbar.
4. **Abrechnung 2024.** Gesehen: «Status: Erledigt» (grau, (i)), Saldo «Rückerstattung CHF 3.00», Zahlung «Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.», Verlauf Erstellt und Versendet 14.04.2025.
5. **«Abrechnung berichtigen» geöffnet und bis zum Ende gelesen.** Erwartet: eine Antwort darauf, was mit einem Übertrag im Entwurf geschieht. Gesehen: beide Fälle sind beschrieben (siehe P-1), dazu was danach zu tun ist, der Hinweis «nicht rückgängig» und die Verjährung (Art. 128 Ziff. 1 OR, zurückhaltend formuliert). Der Dialog nennt nur die eigene Nummer, nicht die betroffene Folgeabrechnung. «Abbrechen» gewählt.
6. **Entwurf 2025 angesehen, um herauszufinden, welcher Fall gilt.** Gesehen: Rückerstattung CHF 34.60, keine Übertragszeile, Verlauf «Erstellt», «PDF erstellt». Der Entwurf enthält den Übertrag hier also nicht (die Datenbank ist neu, ich habe in dieser Runde nicht neu berechnet). Diesen Fall erwähnt die Bestätigung nicht ausdrücklich. Er ergibt sich daraus, dass keiner der beiden «Enthält …»-Sätze zutrifft.
7. **Hilfe, «Begriffe kurz erklärt».** Erwartet: ein Eintrag «Erledigt». Gesehen: ein Eintrag «Erledigt» zwischen «Saldo» und «Zahlungsfrist», mit Abgrenzung zu «Bezahlt» (Wortlaut unter Beobachtungen).

## Verwirrung

- Welcher der beschriebenen Fälle für meine Abrechnung gilt, muss ich durch einen Blick in die Abrechnung 2025 selbst klären (P-1, Rest).
- «verrechnet» und «Übertrag»: jetzt durch die Hilfe verbunden, auf dem Bildschirm der Abrechnung 2024 aber weiterhin nur «verrechnet».

## Fehlerrisiken

- Ich bestätige die Berichtigung, Dwello entfernt den Übertrag sofort aus dem Entwurf 2025, und ich versende die berichtigte Abrechnung nicht oder erst spät. Dann steckt der Betrag bis dahin in keiner versendeten Abrechnung. Die Bestätigung sagt «Senden Sie sie dem Mieter», das mildert das Risiko.
- Ein bereits erstelltes PDF des Entwurfs könnte noch den alten Übertrag zeigen, falls es beim Entfernen nicht verworfen wird. Das konnte ich nicht prüfen, die Bestätigung sagt nichts dazu.

## Vorschläge

- **P-1:** Seepark Residenz, NK-22222222-2024-0001, «Abrechnung berichtigen». Hilfreich wäre, statt beider Bedingungssätze nur den zutreffenden Fall mit der Nummer anzuzeigen, z. B. «Der Entwurf NK-22222222-2025-0001 enthält den Saldo als Übertrag. Dwello entfernt ihn dort sofort und verwirft dessen PDF.» Enthält keine Abrechnung den Übertrag, genügt der Satz «Keine andere Abrechnung enthält diesen Saldo.».
- **P-2:** Keiner mehr nötig. Wünschenswert, aber nicht nötig: ein kurzer Hilfesatz beim Status in der Abrechnung, etwa «Erledigt: Es fliesst kein Geld. Der Saldo wird übertragen.».

## Nicht geprüft

- Was nach dem Bestätigen der Berichtigung tatsächlich mit dem Entwurf 2025 und dessen PDF geschieht: Die Aufgabe sagt, nicht bestätigen. Ausserdem enthält der Entwurf in diesem Lauf keinen Übertrag. Den Fall «Übertrag im Entwurf» konnte ich nur am Text prüfen, nicht am Verhalten.
- Den Fall «versendete nächste Abrechnung enthält den Übertrag»: In den Demo-Daten nicht vorhanden.
- Dunkelmodus und andere Sprachen: nicht Teil der Aufgabe.
