# Helga – Verwaltungspauschale im Mietvertrag (Runde 447)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 mit Demodaten. Gespeichert nur im Gebäude «Alpenblick» (Mietvertrag Laura Keller, Wohnung EG).
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-447/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, Feld «Eigener Satz in %» | Bei 12 % sagt Dwello nur «von 0,01 bis 10», aber nicht warum, und nicht, was ich tun soll, wenn im unterschriebenen Vertrag wirklich mehr als 10 % steht. Die Hilfe sagt dagegen, ein höherer Satz als 3 % sei möglich, wenn er dem Aufwand entspricht; von einer Grenze bei 10 % steht dort nichts. |
| P-2 | Nit | Mietvertrag bearbeiten, Feld «Eigener Satz in %» | Das Feld hat keinen Hilfetext. Den erlaubten Bereich (0,01 bis 10) und ein Beispiel erfahre ich erst aus der Fehlermeldung, nachdem ich gespeichert habe. |
| P-3 | Nit | Hilfe, «Begriffe kurz erklärt», Verwaltungspauschale | Die Wörter «Abgeltung» und «VMWG» sind für mich schwer. Was «VMWG» heisst, wird nicht erklärt. |

## Beobachtungen

- Bei 0 % sagt Dwello sehr gut, was los ist und was ich tun soll: «Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein».» Die Meldung steht rot direkt unter dem Feld, mit einem Ausrufezeichen-Symbol. Das Feld ist rot umrandet, und die Seite springt zum Feld. Das habe ich sofort verstanden.
- Nach dem Speichern mit «Nein» kam ich auf die Seite des Mietvertrags. Unten rechts stand grün «Mietvertrag von Laura Keller gespeichert». Dort steht jetzt «Verwaltungspauschale: Nicht vereinbart». Das passt zum Vertrag.
- Auf der Seite des Mietvertrags steht «Verwaltungspauschale» unter der Überschrift «Vertragsdauer». Dort hätte ich sie nicht gesucht; sie gehört für mich eher zum Geld («Miete pro Monat») oder zu den Nebenkosten.
- Der Hilfetext über der Auswahl ist lang (sechs Sätze inkl. amtliches Formular und Art. 269d OR). Der wichtige erste Teil («Steht nichts dazu, wählen Sie «Nein»») ist aber klar. Dass «0 %» gleich «nichts dazu» ist, sagt mir der Hilfetext nicht, erst die Fehlermeldung.
- Beim ersten Öffnen war «Ja, zum Satz des Abrechnungslaufs» schon gewählt (Demodaten). Das Wort «Abrechnungslauf» kenne ich nicht.
- «Hilfe» finde ich im Menü ganz unten unter «Einstellungen und Hilfe». Bei 150 % musste ich im Menü dafür nach unten scrollen.
- Das Menü legt bei 150 % einen grauen Schleier über die Seite; solange es offen ist, kann ich auf der Seite nichts anklicken. Das ist normal, ich musste es aber erst schliessen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 10 Schritte: Menü, Mietverträge, «Bearbeiten» bei Laura Keller, eigener Satz 0 eingeben, speichern (abgelehnt), «Nein» wählen, speichern (gelungen), nochmals bearbeiten, 12 eingeben, speichern (abgelehnt), Menü, Hilfe, nach unten zu «Begriffe kurz erklärt».

## Ablauf

1. **Übersicht → Menü → Mietverträge.** Erwartet: Liste meiner Verträge. Gesehen: 11 Mietverträge, Laura Keller mit «Wohnung EG · Alpenblick» und einem Link «Bearbeiten». Gut.
2. **«Bearbeiten» bei Laura Keller.** Erwartet: Formular mit den Vertragsdaten. Gesehen: «Mietvertrag bearbeiten», viel Text oben, weiter unten «Verwaltungspauschale» mit drei grossen Auswahlfeldern; gewählt war «Ja, zum Satz des Abrechnungslaufs».
3. **Im Vertrag steht «0 %».** Ich lese: «Steht dort ein Prozentsatz, wählen Sie «Ja, mit eigenem Satz» und tragen ihn ein.» 0 % ist für mich ein Prozentsatz, also wähle ich «Ja, mit eigenem Satz». Es erscheint das Feld «Eigener Satz in %» (ohne Erklärung). Ich tippe 0 und klicke «Änderungen speichern».
   Erwartet: gespeichert oder eine Frage. Gesehen: Die Seite bleibt, springt zum Feld, rot: «Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein».» Klar, was passiert ist und was zu tun ist (Bild `07-zero-after-save.png`).
4. **«Nein» wählen, speichern.** Erwartet: gespeichert. Gesehen: Seite des Mietvertrags, grüne Meldung «Mietvertrag von Laura Keller gespeichert», «Verwaltungspauschale: Nicht vereinbart» (Bild `09-saved.png`).
5. **Ich meine, ich habe mich vertippt: eigener Satz 12 %.** Wieder «Bearbeiten», «Ja, mit eigenem Satz», 12, speichern.
   Erwartet: Hinweis, dass das viel ist, oder gespeichert. Gesehen: rot unter dem Feld «Bitte geben Sie einen Prozentsatz von 0,01 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.» Nichts wurde gespeichert, auf der Seite des Mietvertrags steht weiter «Nicht vereinbart» (Bild `10-zwoelf-after-save.png`). Ich weiss, was ich eintippen darf, aber nicht, warum höchstens 10 und was ich tun soll, wenn mein Vertrag wirklich 12 % sagt.
6. **Menü → Hilfe → «Begriffe kurz erklärt».** Erwartet: kurze Erklärung. Gesehen: «Die Abgeltung Ihres Aufwands für die Nebenkostenabrechnung: ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Nur zulässig, wenn im Mietvertrag vereinbart; das tragen Sie beim Mietvertrag ein. Üblich sind bis 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen (Art. 4 Absatz 3 VMWG). Den Satz wählen Sie beim Erstellen der Abrechnungen, ausser der Mietvertrag nennt einen eigenen.»
   Verstanden: Das ist eine Entschädigung für meine Arbeit mit der Abrechnung, nur wenn es im Vertrag steht, üblich sind bis 3 %. Ja, das verstehe ich. Bei Laura Keller ist «Nein» also richtig.

## Verwirrung

- «0 %» ist für mich ein Prozentsatz. Der Hilfetext schickt mich deshalb zuerst zum falschen Knopf. Die Fehlermeldung hat es dann gut aufgefangen.
- 10 % als Obergrenze im Formular, «bis 3 % üblich, höher wenn begründet» in der Hilfe: Wo genau liegt nun die Grenze?
- «Abrechnungslauf», «Abgeltung», «VMWG»: Wörter, die ich nicht kenne.
- Warum die Verwaltungspauschale auf der Vertragsseite unter «Vertragsdauer» steht.

## Fehlerrisiken

- Wer im Vertrag mehr als 10 % hat, bleibt ohne Rat stecken und wählt vielleicht aus Verlegenheit «Ja, zum Satz des Abrechnungslaufs» oder tippt 10 ein, obwohl der Vertrag etwas anderes sagt.
- Wer die Fehlermeldung bei 0 % nicht liest, könnte auf «Ja, zum Satz des Abrechnungslaufs» ausweichen und dem Mieter dann eine Pauschale verrechnen, die der Vertrag ausschliesst.

## Vorschläge

- **P-1:** Laura Keller bearbeiten → «Ja, mit eigenem Satz» → 12 → «Änderungen speichern». Hilfreich: in der Meldung sagen, warum höchstens 10 % gehen und was bei einem höheren Vertragssatz zu tun ist (z. B. «Üblich sind bis 3 %. Mehr als 10 % kann Dwello nicht abrechnen; lassen Sie sich beraten.»). Und die Hilfe unter «Begriffe kurz erklärt» um dieselbe Grenze ergänzen, damit beide dasselbe sagen.
- **P-2:** Laura Keller bearbeiten → «Ja, mit eigenem Satz»: Unter «Eigener Satz in %» einen kurzen Hilfetext zeigen, bevor ich tippe, z. B. «Der Satz aus dem Mietvertrag, 0,01 bis 10. Beispiel: 3». Im Hilfetext über der Auswahl ergänzen: «Steht dort 0 %, wählen Sie «Nein».»
- **P-3:** Hilfe → «Begriffe kurz erklärt» → Verwaltungspauschale: «Abgeltung» durch «Entschädigung» ersetzen und «VMWG» einmal ausschreiben (Verordnung über die Miete und Pacht von Wohn- und Geschäftsräumen).

## Nicht geprüft

- 200 % Zoom: nur 150 % geprüft.
- «Mietvertrag erfassen» mit Verwaltungspauschale: nicht Teil der Aufgabe, ich wollte keine neuen Verträge anlegen.
- Ob die Grenze bei 12 % im Browser oder erst vom Server geprüft wird: für mich nicht sichtbar, das Ergebnis war dasselbe.
- Wie sich «Nein» später beim Erstellen der Abrechnung zeigt: nicht Teil der Aufgabe.
