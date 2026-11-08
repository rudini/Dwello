# Helga – Neuer Mietvertrag, Schritt «Wohnung», Mietverträge von 1.02 nicht geladen (#1264)

Desktop 1440 × 900, Zoom 150 % und 200 %, Maus. Nur angeschaut, nichts gespeichert. Für den Fehler habe ich vor dem Öffnen der Seite nur `GET /api/contracts?apartmentId=aaaa1111-1111-1111-1111-222222222222` mit Status 500 ohne Inhalt beantworten lassen, vor «Erneut versuchen» habe ich das wieder aufgehoben.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 2 «Wohnung», nach «Erneut versuchen» | Die Einblendung «Die Mietverträge der Wohnung sind geladen. Die gewählte Wohnung ist nicht verfügbar; Dwello hat die Auswahl aufgehoben.» erscheint rechts genau über dem Feld. Bei 200 % verdeckt sie die Hälfte vom Hilfetext und vom Feld «Wohnung», bei 150 % auch den Titel vom gelben Hinweis zu 1.02. Nach etwa 9 Sekunden ist sie weg. Ich lese langsam, da war sie schon verschwunden. Der gelbe Hinweis sagt aber dasselbe. |
| P-2 | Minor | Schritt 2 «Wohnung», die beiden Hinweise | Beide Hinweise sagen «Mietvertrag ohne Vertragsende» und schicken mich zu «Enddatum erfassen», das ist gleich. Den Mietvertrag, der im Weg ist, benennen sie aber verschieden. Bei 1.02 heisst der Link «Zum Mietvertrag von Anna Schmidt», also nach der Mieterin. Bei Hans Müller heisst er «Zum Mietvertrag für die Wohnung 1.01», also nach der Wohnung. Auch die Wohnung steht einmal als «1.02 · Musterhaus Zentrum» und einmal als «1.01 (Musterhaus Zentrum)» da. Im Text vom 1.02-Hinweis steht nur «ein Mietvertrag», wessen Vertrag das ist, sehe ich erst am Link. |
| P-3 | Minor | Schritt 2 «Wohnung», Hilfetext unter dem Feld | Der Hilfetext sagt «Wohnungen mit einem unbefristeten Mietvertrag, der nicht gekündigt ist, sind mit «nicht verfügbar» markiert». Die Hinweise darunter sagen «Mietvertrag ohne Vertragsende». Ich weiss nicht sicher, ob «unbefristet, nicht gekündigt» und «ohne Vertragsende» dasselbe sind. |
| P-4 | Minor | Schritt 2 «Wohnung», gelber Hinweis nach Wahl von 1.02 | «Die anderen Mietverträge dieser Wohnung liessen sich nicht laden.» Welche «anderen»? Ich habe ja noch gar keinen. Ich habe zuerst gedacht, es geht um einen ersten Vertrag, der geladen wurde. |

## Beobachtungen

- Die Markierung von 1.02 kann ich bei 150 % und 200 % gut lesen. In der Liste steht «(nicht geprüft) Wohnung 1.02 · Musterhaus Zentrum, 4.5 Zimmer, 92 m²», die Markierung steht vorne. Ist 1.02 gewählt, schneidet das geschlossene Feld bei 150 % das Ende ab («… 4.5 Zimmer, 9»), «(nicht geprüft)» sieht man aber noch. Das ist gut so.
- «nicht verfügbar» steht hinten am Eintrag, «nicht geprüft» vorne. Mich hat das nicht gestört, es fällt aber auf.
- Der Hilfetext erklärt «nicht geprüft» deutlich: «lassen sich wählen, obwohl Dwello ihre Mietverträge nicht laden konnte. Ob die gewählte Wohnung frei ist, prüft Dwello beim Speichern.» Ich wusste, dass ich 1.02 wählen darf. Nach dem erfolgreichen Nachladen fällt dieser Satz weg, und 1.02 rückt unter die nicht verfügbaren Wohnungen.
- 1.02 war wählbar. Danach kamen ein gelber Hinweis «Dwello prüft beim Speichern, ob die Wohnung frei ist» und der Knopf «Erneut versuchen». Vor der Wahl gab es keinen Hinweis und keinen Knopf.
- Den Hinweis zu Hans Müllers eigenem Mietvertrag (Wohnung 1.01) habe ich schon gesehen, als ich 1.02 gewählt hatte, nicht erst bei 2.02. Nach «Erneut versuchen» war er mit der Auswahl weg, bei 2.02 kam er wieder. Den 1.02-Hinweis und den Hans-Müller-Hinweis sehe ich nie zusammen. Vergleichen konnte ich sie nur nacheinander.
- Was zu tun ist, sagen beide klar. Bei 1.02: Vertragsende eintragen oder eine andere Wohnung wählen. Bei Hans Müller: bei einem Umzug beenden, sonst hier weitermachen.
- Bei 200 % füllt die Schrittanzeige (fünf Zeilen untereinander) fast den ganzen Bildschirm. Zum Feld muss ich scrollen. Nach «Erneut versuchen» springt der Fokus auf die Überschrift «Wohnung».
- Die gelben Hinweise liegen bei 150 % unter dem sichtbaren Bereich. Nach der Wahl von 1.02 habe ich nur den oberen Rand gesehen und musste scrollen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, je Zoomstufe rund 6 Schritte: Mieter wählen, «Weiter», Liste öffnen, 1.02 wählen, «Erneut versuchen», 2.02 wählen.

## Ablauf

- Hans-Müller-Hinweis: Erwartet hatte ich ihn erst bei 2.02. Gesehen habe ich ihn schon bei der Wahl von 1.02, über dem Feld.
- «Erneut versuchen»: Erwartet hatte ich, dass ich die Meldung in Ruhe lesen kann. Gesehen habe ich eine Einblendung, die das Feld und den Hilfetext halb verdeckt und von selbst verschwindet (P-1).
- Vergleich der Hinweise: Erwartet hatte ich, dass der störende Mietvertrag gleich benannt wird. Gesehen habe ich einmal den Namen der Mieterin und einmal die Wohnung (P-2).

## Vorschläge

- **P-1:** Mietvertrag erfassen, Hans Müller, «Weiter», 1.02 wählen (Vertrags-Abfrage von 1.02 mit 500 beantwortet), Fehler aufheben, «Erneut versuchen», bei 150 % und 200 %. Hilfreich wäre eine Einblendung, die nicht über dem Feld liegt, oder gar keine, weil der gelbe Hinweis am Feld schon alles sagt. Sonst soll sie wenigstens stehen bleiben, bis ich sie schliesse.
- **P-2:** Gleicher Weg wie oben, danach 2.02 wählen und die beiden Hinweise vergleichen. Hilfreich wäre, den Vertrag in beiden Hinweisen gleich zu benennen, z. B. «Zum Mietvertrag von Anna Schmidt (Wohnung 1.02)» und «Zum Mietvertrag von Hans Müller (Wohnung 1.01)». Den Namen der Mieterin würde ich auch in den Text vom 1.02-Hinweis schreiben.
- **P-3:** Hilfetext unter dem Feld «Wohnung» lesen. Hilfreich wäre im Hilfetext dasselbe Wort wie in den Hinweisen: «Wohnungen mit einem Mietvertrag ohne Vertragsende sind mit «nicht verfügbar» markiert …».
- **P-4:** 1.02 wählen, solange ihre Mietverträge nicht geladen werden. Hilfreich wäre z. B. «Dwello konnte die Mietverträge dieser Wohnung nicht laden.», ohne «anderen».

## Nicht geprüft

- Speichern mit 1.02 im Zustand «nicht geprüft»: nicht gemacht, ich soll nur schauen. Deshalb weiss ich nicht, was Dwello beim Speichern meldet.
- «Erneut versuchen» bei weiterhin gestörter Abfrage: nicht verlangt, nicht versucht.
- Die Links in den Hinweisen habe ich nicht geöffnet, damit ich den Assistenten nicht verlasse.
- Wie die native Auswahlliste aufgeklappt aussieht: Der kopflose Browser zeigt sie nicht im Bild. Die Einträge und welche davon gesperrt sind, habe ich aus der Liste selbst gelesen.

Bilder und Skripte liegen in `/tmp/claude-0/-home-user-Dwello/99fa5fcd-dce7-52ad-b019-80df0bfcf111/scratchpad/helga-1264/`.
