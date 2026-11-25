# Marco – Holz als zweiter Brennstoff (Musterhaus Zentrum, Abrechnungen 2025)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Nur angeschaut, nichts gespeichert.
Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/3efecb5d-a00f-5e1e-a65b-e3d5bb52406c/scratchpad/marco-1478/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnung «Brennholz Buche, 6 Ster, geliefert 30.09.2025» | Die Seite zeigt «Leistungszeitraum 30.09.2025 – 30.09.2025» und darunter «Nur die Tage in der Abrechnungsperiode zählen.» Ich lese daraus: Das Holz zählt nur an einem Tag. Dass die Lieferung als Brennstoff über das ganze Jahr zählt, steht nirgends. Bei der Heizöl-Rechnung steht dagegen «Zählt als Lieferung in den Tank». Beim Holz fehlt so ein Satz. |
| P-2 | Minor | Abrechnung Anna Schmidt / Pierre Dubois, Position «Holz» | Die Position «Holz» sieht aus wie jede andere Kostenposition (Verteilschlüssel, Kosten des Gebäudes, Zeitanteil 365/365 Tage). Kein Hinweis, dass Holz ein Brennstoff ist und neben dem Öl verrechnet wird. Ich sehe nur, dass es eine eigene Karte ist und den gleichen Schlüssel «Heizung (Fläche 70 % / Einheit 30 %)» hat wie das Öl. |
| P-3 | Minor | Rechnungen der Kategorie «Holz» | Bei der Heizöl-Rechnung erklärt ein Text unter «Umlagefähig», warum Brennstoff anrechenbar ist (Art. 5/6 VMWG). Bei beiden Holz-Rechnungen steht nur «Umlagefähig» ohne Erklärung. Ich weiss also nicht, ob Holz rechtlich gleich behandelt wird wie Öl. |

## Beobachtungen

- Die Position «Holz» ist leicht zu finden. Sie steht in beiden Entwürfen direkt unter «Heizung». Gebäudekosten CHF 1’384.00 = 1’200.00 + 184.00. Anteil bei Anna Schmidt 18.08 % = CHF 250.17, bei Pierre Dubois 17.08 % = CHF 236.40, der gleiche Anteil wie bei «Heizung». Dass Holz vom Öl getrennt ist, sehe ich an der eigenen Karte. «Veränderung Tankbestand» (CHF 392.80) steht nur beim Öl.
- Die Reinigung des Holzofens kommt von «Kaminfeger Russ AG», liegt aber unter «Holz». Gleich darunter gibt es eine eigene Position «Kaminfeger» mit Schlüssel «Pro Fläche (m²)». Ohne Erklärung frage ich mich, ob die Reinigung in der falschen Kategorie ist. Die Beschreibung der Kategorie («Brennholz für den Holzofen … und Reinigung des Holzofens durch den Kaminfeger») sehe ich nirgends in der App, nur in der Datenbank.
- Rechnung der Ofenreinigung: «Leistungszeitraum 01.07.2025 – 31.12.2025, Nur die Tage in der Abrechnungsperiode zählen». Das ist verständlich.
- Die Holz-Rechnung zeigt keinen Hinweis «Bestimmt, in welche Abrechnungsperiode die Rechnung fällt» und keine Rechnungsnummer. Die Öl-Rechnung zeigt beides. Die beiden Rechnungsseiten sehen also unterschiedlich aus, obwohl beide Brennstoff sind.
- Im Formular «Rechnung bearbeiten» (nur angeschaut) erklärt die Hilfe zum Leistungszeitraum Quartale und Jahre. Was man bei einer Brennstofflieferung eintragen soll, steht dort nicht.
- Der Brotkrumen auf der Rechnungsseite führt zu «Rechnungen», nicht zurück zur Abrechnung. Zurück komme ich über «In Abrechnungen enthalten» oder mit der Zurück-Geste. Mit der Zurück-Geste lande ich wieder bei der Holz-Karte (Scrollposition bleibt).
- Die Abrechnungsseite ist auf dem Handy sehr lang: Die Holz-Karte liegt etwa 4’200 px weit unten. Eine Sprungmarke zur Kostenaufstellung habe ich nicht gefunden.
- In der Liste der Entwürfe hat der Link auf die Abrechnung und der PDF-Link beide den Mieternamen im Namen.

## Aufgabe geschafft: teilweise

Beide Entwürfe, die Position «Holz», die zwei Rechnungen und die Rechnungsseite der Holzlieferung habe ich gefunden. Alles ist bei 390 px lesbar: kein seitliches Scrollen (scrollWidth 390 auf allen besuchten Seiten), alle Links und Buttons sind mindestens 48 px hoch. Nicht verstanden habe ich, dass die Holzlieferung über das ganze Jahr zählt (P-1). Dass Holz vom Öl getrennt ist, habe ich nur an der eigenen Karte erkannt.

## Aufwand

Etwa 12 Minuten, rund 14 Schritte (Dashboard → «Entwürfe ansehen» → Anna Schmidt → bis «Holz» scrollen → Rechnung Holz → zurück → Pierre Dubois → Holz → Rechnung Holz, Rechnung Ofenreinigung, zum Vergleich Rechnung Heizöl, Formular «Rechnung bearbeiten» nur angesehen).

## Ablauf

- Abrechnung, Karte «Holz». Erwartet: ein kurzer Hinweis, dass Holz ein Brennstoff ist und neben dem Öl verrechnet wird. Gesehen: dieselben Zeilen wie bei jeder anderen Kategorie, kein Hinweis (Screenshot `06-holz-viewport2.png`: Karte «Holz» unter der Öl-Karte, die zwei Rechnungen als Links mit Betrag).
- Rechnung «Brennholz Buche». Erwartet: ein Satz wie beim Öl, also dass die Lieferung als Brennstoff zählt, und zwar über die ganze Abrechnungsperiode. Gesehen: «Leistungszeitraum 30.09.2025 – 30.09.2025 / Nur die Tage in der Abrechnungsperiode zählen.» Das lese ich als «zählt nur einen Tag» (Screenshot `08-rechnung-holz-oben.png`).
- Rechnung «Reinigung Holzofen». Erwartet: Kategorie «Kaminfeger». Gesehen: Kategorie «Holz», ohne Begründung.
- Statt eines Menüpunkts für Kategorien habe ich `/categories` direkt aufgerufen. Erwartet: eine Erklärung der Kategorie «Holz». Gesehen: «Diese Seite gibt es nicht.»

## Vorschläge

- **P-1:** «Entwürfe ansehen» → Anna Schmidt → Link «Brennholz Buche, 6 Ster, geliefert 30.09.2025». Bei einer Rechnung einer Brennstoff-Kategorie hilft ein Satz wie beim Öl, zum Beispiel: «Zählt als Brennstofflieferung: Die Kosten zählen für die ganze Abrechnungsperiode, nicht nur am Liefertag.» Der Satz «Nur die Tage in der Abrechnungsperiode zählen» sollte bei einem eintägigen Leistungszeitraum nicht stehen oder anders lauten.
- **P-2:** Abrechnung → Karte «Holz». Eine Zeile unter dem Kategorienamen, zum Beispiel «Brennstoff, getrennt vom Heizöl, mit dem Heizungs-Schlüssel verteilt».
- **P-3:** Rechnung Holz → «Kategorisierung». Die Erklärung zur Umlagefähigkeit wie bei «Heizung» zeigen, oder einen kurzen Text, warum Brennholz anrechenbar ist.

## Nicht geprüft

- Wie eine Holzlieferung bei einem Mieter zählt, der nur einen Teil des Jahres wohnt: In Musterhaus Zentrum haben beide Entwürfe 365/365 Tage. Ob der Betrag über das Jahr verteilt wird oder nur am Liefertag zählt, kann ich deshalb an den Zahlen nicht unterscheiden.
- Das PDF der Abrechnung: Laut Aufgabe ging es nur um die Seite, deshalb nicht geöffnet.
- Gespeichert oder neu berechnet habe ich nichts (die Aufgabe war nur anschauen). Das Formular «Rechnung bearbeiten» habe ich nur geöffnet und nicht abgeschickt.
