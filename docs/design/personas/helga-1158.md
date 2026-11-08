# Helga – #1158: Wohnung wählen, wenn die Mietverträge nicht geladen werden können

Desktop 1440 × 900, Zoom 150 % und 200 %, Maus. Nur angeschaut, kein Mietvertrag gespeichert.
Fehler simuliert: nur `GET /api/contracts?apartmentId=aaaa1111-1111-1111-1111-222222222222` (Wohnung 1.02) antwortete mit 500 ohne Daten, bis kurz vor «Erneut versuchen». Die Anfragen der anderen Wohnungen liefen normal (im Netzwerk gesehen: genau zwei Anfragen auf 1.02, die erste abgefangen, die zweite durchgelassen).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 2 «Wohnung», nach «Erneut versuchen» | Die Meldung unten rechts liegt über dem Feld «Wohnung» und über dem Anfang des Hinweises («Wohnung 1.02 · M…»). Bei 200 % ist der Hinweis zu 1.02 sogar ganz unterhalb des Bildschirms; ich sehe nur die Meldung und ein leeres Feld «Wohnung wählen». |
| P-2 | Minor | Schritt 2, Meldung nach «Erneut versuchen» | Die Meldung ist bei 150 % fünf Zeilen lang, bei 200 % auch fünf Zeilen in grosser Schrift, und verschwindet nach etwa 9 Sekunden von selbst. Ich lese langsam; beim ersten Mal war sie weg, bevor ich fertig war. |
| P-3 | Minor | Schritt 2, Hinweise zu 1.02 und zu Hans Müller | Für dieselbe Sache stehen drei Wörter: «unbefristeter Mietvertrag, der nicht gekündigt ist» (Hinweis 1.02), «ohne Vertragsende» (Hinweis Hans Müller) und der Knopf «Enddatum erfassen». Ich war nicht sicher, ob «unbefristet» und «ohne Vertragsende» dasselbe ist. |
| P-4 | Minor | Schritt 2, Auswahlfeld während des Fehlers | Im Feld steht «Wohnung 1.02 · Musterhaus Zentrum, 4.5 Zimmer, 92 m² (nicht gep» – der Zusatz ist bei 150 % abgeschnitten. Was «nicht geprüft» heisst, steht nirgends beim Feld; erst der gelbe Kasten darunter erklärt es. |

## Beobachtungen

- Der gelbe Kasten während des Fehlers ist gut: «Dwello prüft beim Speichern, ob die Wohnung frei ist» und «Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten.» Ich habe verstanden: Es hat nicht geklappt, aber nichts ist verloren, und ich kann «Erneut versuchen» drücken. Der Knopf steht direkt darunter.
- Meldung und Hinweis nach dem Neuladen sagen dasselbe: Meldung «Die Mietverträge der Wohnung sind geladen. Die gewählte Wohnung ist nicht verfügbar; Dwello hat die Auswahl aufgehoben.», Hinweis «Wohnung 1.02 · Musterhaus Zentrum ist nicht verfügbar … Dwello hat die Auswahl darum aufgehoben.» Kein Widerspruch. Die Meldung nennt die Wohnung aber nicht; erst der Hinweis sagt «1.02».
- Welcher Mietvertrag blockiert, ist klar: der Link «Zum Mietvertrag von Anna Schmidt». Was ich tun soll, auch: Vertragsende mit «Enddatum erfassen» eintragen oder eine andere Wohnung wählen. Der Hinweis ist mit fünf Zeilen aber lang.
- 1.02 rutscht nach dem Neuladen in der Liste nach unten zu den «nicht verfügbar»-Wohnungen. Das passt.
- Nach «Meldung schliessen» blieb ich in Schritt 2, an derselben Stelle der Seite (Feld «Wohnung wählen» sichtbar, Hinweis zu 1.02 darunter). Der Fokus lag schon nach «Erneut versuchen» auf der Überschrift «Schritt 2 von 5: Wohnung». Ich war nicht verloren.
- Während des Fehlers standen drei Kästen gleichzeitig da: der blaue zu Hans Müller, der gelbe zum Ladefehler und der Knopf. Das ist viel, aber die Farben helfen.
- Hinweis zu Hans Müller (nach Wahl von 2.02): «Für Hans Müller ist ein Mietvertrag für die Wohnung 1.01 (Musterhaus Zentrum) ohne Vertragsende erfasst. Zieht Hans Müller in eine andere Wohnung um, beenden Sie diesen Mietvertrag … Mietet Hans Müller beide Wohnungen, machen Sie hier weiter.» Das habe ich verstanden; die zwei Fälle sind klar getrennt. Der Link «Zum Mietvertrag für die Wohnung 1.01» öffnet im selben Fenster; ich hätte Angst, meine Eingaben zu verlieren (der Satz «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf» beruhigt etwas).
- Der blaue Hinweis erscheint über dem Feld. Nach Wahl von 2.02 rutscht das Feld bei 150 % nach unten aus dem Bild; ich sah meine Wahl nicht mehr, ohne zu scrollen.
- Bei 200 % stehen die Schritte untereinander und die Seitenleiste wird zum Menüknopf; das Feld «Wohnung» ist erst nach Scrollen sichtbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 9 Schritte (Mieter wählen, Weiter, 1.02 wählen, Fehler lesen, Erneut versuchen, Meldung lesen, Meldung schliessen, 2.02 wählen, Hinweis lesen), je bei 150 % und 200 %.

## Ablauf

- «Erneut versuchen» gedrückt. Erwartet: der gelbe Kasten verschwindet und ich lese direkt daneben, was jetzt gilt. Gesehen: eine Meldung unten rechts legt sich über das Feld und den Anfang des neuen Hinweises; bei 200 % ist der Hinweis zu 1.02 gar nicht im Bild (P-1).
- Meldung gelesen. Erwartet: sie bleibt, bis ich sie schliesse. Gesehen: nach etwa 9 Sekunden war sie weg (P-2).
- Hinweis zu 1.02 gelesen. Erwartet: dieselben Wörter wie beim Hinweis zu Hans Müller. Gesehen: «unbefristet, nicht gekündigt» statt «ohne Vertragsende» (P-3).
- 1.02 gewählt, während der Fehler lief. Erwartet: die ganze Wohnungsbezeichnung im Feld. Gesehen: «(nicht gep» abgeschnitten (P-4).

## Vorschläge

- **P-1:** Hans Müller wählen, Weiter, 1.02 wählen (Anfrage auf 1.02 mit 500), Anfrage freigeben, «Erneut versuchen» bei 150 % und 200 %. Hilfreich: die Meldung nicht über das Feld legen (z. B. nur den Hinweis im Schritt zeigen und den Fokus oder die Ansicht auf den Hinweis zu 1.02 setzen statt auf die Schritt-Überschrift).
- **P-2:** wie P-1, dann warten. Hilfreich: die Meldung stehen lassen, bis man sie schliesst, oder sie ganz weglassen, weil der Hinweis im Schritt dasselbe sagt.
- **P-3:** wie P-1, dann 2.02 wählen und beide Hinweise vergleichen. Hilfreich: in beiden Hinweisen dasselbe Wort, z. B. «Mietvertrag ohne Vertragsende», und «Enddatum erfassen» dazu passend erklären.
- **P-4:** Hans Müller, Weiter, 1.02 wählen bei 150 % mit Fehler. Hilfreich: den Zusatz kürzer oder vorne in der Bezeichnung, und im gelben Kasten sagen, dass «nicht geprüft» dieser Zustand ist.

## Nicht geprüft

- Den Link «Zum Mietvertrag von Anna Schmidt» und «Zum Mietvertrag für die Wohnung 1.01» nicht geöffnet (nur Ziel gelesen: Mietvertragsseite im selben Fenster), weil ich nichts ändern sollte.
- Nicht gespeichert und nicht weiter als Schritt 2 gegangen; ob Dwello beim Speichern wirklich prüft, habe ich darum nicht gesehen.
- Ob die Meldung beim Daraufzeigen mit der Maus stehen bleibt, nicht ausprobiert.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/ea210803-f492-5563-8860-5765f89f4613/scratchpad/helga-1158/` (v1.5-*, v2-* Bildschirmausschnitte; z1.5-* ganze Seite).
