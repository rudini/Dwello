# Persona-Review: Dr. Weber, Warnung Pauschale und angekreuzte Nebenkosten (#432)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: Persona-Stack http://localhost:3300 (Demodaten, Deutsch). Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-432/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag und Mietvertrag bearbeiten, Pauschale ohne Akonto | Ohne Akonto stehen zwei Kästen untereinander, die sich widersprechen. «Kein Akonto» sagt «Sonst entfernen Sie … alle Häkchen». Die Pauschale-Warnung direkt darunter sagt «Entfernen Sie das Häkchen bei den Nebenkosten, die die Pauschale abdeckt». Welcher Satz gilt? Das ist mein früherer Befund weber-429 P-2. Durch die neue Warnung tritt er jetzt auch beim Bearbeiten auf. |
| P-2 | Nit | Beide Formulare, Warnung «Nebenkostenpauschale und angekreuzte Nebenkosten» | Die Warnung bleibt sichtbar, auch wenn ein gemischter Mietvertrag richtig erfasst ist (die von der Pauschale abgedeckten Nebenkosten sind abgewählt). Sie verschwindet erst, wenn alle Häkchen weg sind. Ein sorgfältiger Vermieter sieht am Bildschirm nicht, ob er es jetzt richtig gemacht hat. In der Fassung ohne Akonto klingt «Dwello rechnet ihm trotzdem alle angekreuzten Nebenkosten ab» weiter nach einem Fehler (weber-429 P-4). In der Fassung mit Akonto ist das «trotzdem» weg. |

## Beobachtungen

- **P-1 aus weber-429 ist behoben.** Ich habe «Mietvertrag bearbeiten» von Thomas Weber geöffnet (Akonto 200.00 bleibt), 50 in die Nebenkostenpauschale getippt und die Nebenkosten angekreuzt gelassen. Sofort erscheint unter dem Feld ein gelber Hinweiskasten mit Warnsymbol (Screenshot 02). Der Text ist derselbe wie im Assistenten. «Monatlich total» springt auf CHF 1’450.00 (1’200 + 200 + 50). Das habe ich nachgerechnet, es stimmt. Im Accessibility-Baum ist der Kasten ein `status`, ein Screenreader liest ihn also vor.
- Der Wortlaut mit Akonto lautet: «Dieser Mieter bezahlt ein Akonto und eine Nebenkostenpauschale. Dwello rechnet ihm alle angekreuzten Nebenkosten mit der Nebenkostenabrechnung ab, die Pauschale nicht. Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt. Sonst bezahlt er die Nebenkosten, die die Pauschale abdeckt, doppelt.»
  - Rechtlich ist das richtig, auch für einen korrekt erfassten gemischten Mietvertrag. Die Pauschale wird nicht abgerechnet (Art. 4 Abs. 2 VMWG). Akontobeiträge werden mit den tatsächlichen Kosten der vereinbarten Nebenkosten verrechnet (Art. 257b OR, Art. 4 Abs. 1 VMWG). Die Folge «doppelt» ist zutreffend. Der Mieter könnte das zu viel Bezahlte zurückfordern.
  - «für die der Mieter Akonto bezahlt» ist juristisch etwas eng. Das Akonto ist ein Vorschuss auf alle abzurechnenden Nebenkosten, nicht auf einzelne Positionen. Gemeint ist aber erkennbar «die abgerechnet werden», und mit einem Akonto im Mietvertrag läuft das auf dasselbe hinaus. Ich führe das nicht als Befund.
  - Der Satz «Sonst … doppelt» ist bedingt formuliert. Für einen richtig erfassten gemischten Mietvertrag behauptet er also nichts Falsches. Er bleibt nur stehen (P-2).
- Wortlaut ohne Akonto: «Dieser Mieter bezahlt eine Nebenkostenpauschale. Dwello rechnet ihm trotzdem alle angekreuzten Nebenkosten ab. Entfernen Sie das Häkchen bei den Nebenkosten, die die Pauschale abdeckt.» Der Inhalt ist korrekt. Zum «trotzdem» siehe P-2.
- Bearbeiten und Assistent zeigen dieselben Texte unter denselben Bedingungen. Bei Akonto mit Pauschale und allen Häkchen erscheint die Warnung, auch nach dem Abwählen einiger Häkchen. Ohne Akonto erscheint die zweite Fassung. Mit Pauschale und ohne jedes Häkchen verschwindet die Warnung. Dafür kommt «Keine Nebenkosten vereinbart … Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.» Das ist schlüssig.
- Im Schritt «Prüfen» des Assistenten stehen Akonto CHF 150.00, Nebenkostenpauschale CHF 40.00, Vereinbarte Nebenkosten ohne Hauswart, Gartenpflege und Kehricht und Monatlich total CHF 1’490.00 (1’300 + 150 + 40). Nachgerechnet, stimmt. Einen Hinweis auf die Kombination gibt es dort nicht. Das ist nach dem Abwählen auch nicht nötig.
- Der Hilfetext am Feld «Nebenkostenpauschale pro Monat» ist unverändert. Ein Hinweis auf den Dreijahresdurchschnitt (Art. 4 Abs. 2 VMWG) und beim Bearbeiten auf das amtliche Formular (Art. 269d OR) fehlt weiterhin (weber-429 P-3). Das war nicht Teil dieser Änderung.

## Aufgabe geschafft: ja

Ich habe alle verlangten Fälle durchgespielt, im Bearbeiten-Formular und im Assistenten (Hans Müller, Wohnung 2.02 Musterhaus Zentrum, Beginn 01.01.2027). Nichts gespeichert.

## Aufwand

Etwa 10 Minuten, 7 Skriptläufe. Bearbeiten: 3 Schritte (öffnen, Pauschale tippen, Häkchen ändern). Assistent: 4 Schritte bis «Miete», dann 3 Varianten und «Prüfen».

## Ablauf

1. **Bearbeiten öffnen.** Erwartet: Akonto 200.00, Pauschale leer. Gesehen: Akonto 200.00, Pauschale 0.00, alle 12 Nebenkosten angekreuzt, total CHF 1’400.00 (Screenshot 01).
2. **Pauschale 50 eintragen, Häkchen stehen lassen.** Erwartet: eine Warnung wie im Assistenten. Gesehen: Die Warnung (Fassung mit Akonto) steht direkt unter dem Feld, total CHF 1’450.00 (Screenshot 02). P-1 aus weber-429 ist beantwortet.
3. **Hauswart und Kehricht abwählen** (gemischter Mietvertrag, die Pauschale deckt diese zwei). Erwartet: Die Warnung verschwindet oder wird zur Bestätigung. Gesehen: Sie bleibt unverändert (Screenshot 03, P-2).
4. **Alle Häkchen abwählen.** Gesehen: Die Warnung ist weg, dafür erscheint «Keine Nebenkosten vereinbart» (Screenshot 04). Richtig.
5. **Akonto leeren, Pauschale 50, alle Häkchen** (neu geladen). Gesehen: «Kein Akonto» mit «Sonst entfernen Sie … alle Häkchen» und darunter die Pauschale-Warnung mit «Entfernen Sie das Häkchen bei den Nebenkosten, die die Pauschale abdeckt» (Screenshot 05, P-1). Abgebrochen, nichts gespeichert.
6. **Assistent bis «Miete».** Gesehen: Ohne Eingabe steht «Kein Akonto» schon da (Screenshot 20). Nettomiete 1’300.00 eingetragen.
7. **Fall Akonto mit Pauschale:** Akonto 150, Pauschale 40, alle Häkchen. Gesehen: dieselbe Warnung wie beim Bearbeiten, total CHF 1’490.00 (Screenshot 21).
8. **Fall Akonto mit Pauschale, nur einige Häkchen:** Hauswart, Gartenpflege und Kehricht abgewählt. Gesehen: Die Warnung bleibt (Screenshot 23, P-2).
9. **Fall Pauschale ohne Akonto:** Akonto geleert, zuerst mit einigen, dann mit allen Häkchen. Gesehen: in beiden Fällen «Kein Akonto» und die Warnung in der Fassung ohne Akonto (Screenshots 22-B1, 22-B2, P-1 und P-2). Total CHF 1’340.00, stimmt.
10. **«Prüfen»** mit Akonto 150, Pauschale 40 und 9 Häkchen: Die Werte stimmen (Screenshot 24). «Mietvertrag speichern» nicht gedrückt.

## Verwirrung

- Ohne Akonto lese ich zwei Anweisungen untereinander: «alle Häkchen» entfernen und nur «das Häkchen bei den Nebenkosten, die die Pauschale abdeckt» entfernen. Erst wer beide Kästen ganz liest, versteht, dass der zweite für den Pauschale-Fall gilt.
- Nach dem richtigen Abwählen frage ich mich, ob die Warnung noch etwas von mir will. Der Kasten sieht gleich aus wie vorher.

## Fehlerrisiken

- Die Doppelbelastung aus weber-429 P-1 ist jetzt in beiden Formularen gut abgesichert.
- Wer ohne Akonto dem Satz «Sonst entfernen Sie … alle Häkchen» folgt, obwohl nur ein Teil der Nebenkosten pauschal ist, rechnet die übrigen vereinbarten Nebenkosten nie ab (P-1). Der Schaden trifft den Vermieter, nicht den Mieter.
- Eine dauernd sichtbare Warnung bei korrekter Eingabe gewöhnt ans Wegschauen (P-2).

## Vorschläge

- **P-1:** «Neuer Mietvertrag» > Schritt «Miete» (oder «Mietvertrag bearbeiten») > Akonto leer lassen > Pauschale 40 eintragen. Hilfreich wäre: Ist eine Pauschale eingetragen, entfallen im Kasten «Kein Akonto» die Sätze «Sonst entfernen Sie … alle Häkchen» und «Bezahlt der Mieter eine Nebenkostenpauschale, tragen Sie sie … ein». Oder der Kasten wird nach Fällen gegliedert, wie in weber-429 P-2 vorgeschlagen.
- **P-2:** Akonto 150, Pauschale 40 > Hauswart, Gartenpflege, Kehricht abwählen. Die Warnung bleibt. Hilfreich wäre eine neutrale Formulierung, die auch zur richtigen Eingabe passt. Etwa ohne Akonto: «Dwello rechnet die angekreuzten Nebenkosten ab, die Pauschale nicht. Prüfen Sie, dass keine angekreuzte Nebenkosten von der Pauschale abgedeckt ist.» Oder ein Kasten in neutralem Stil statt Warnstil, sobald mindestens ein Häkchen entfernt wurde.

## Nicht geprüft

- Ob «Änderungen speichern» mit Pauschale und allen Häkchen eine Rückfrage zeigt, und ob die Seite des Mietvertrags danach einen Hinweis zeigt: Ich sollte nicht speichern.
- Ob eine neue Abrechnung die von der Pauschale abgedeckten Nebenkosten tatsächlich weglässt: Dafür hätte ich speichern und eine Abrechnung erstellen müssen.
- Andere Sprachen, mobile Ansicht und Tastaturbedienung gehören nicht zur Persona.
