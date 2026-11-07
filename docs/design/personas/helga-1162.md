# Helga – Statusfilter der Nebenkostenabrechnungen (#1162)

Persona: Helga, 68. Desktop 1440 × 900 mit 150 % Zoom, zum Vergleich auch 200 %. Bedienung mit der Maus. Ich habe nur geschaut und nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nebenkostenabrechnungen, gefiltert | Über der Liste steht kein Satz, der den gewählten Status nennt. Dort steht nur «7 Abrechnungen» bzw. «9 Abrechnungen». Bei 200 % sehe ich nach dem Klick die gefilterte Liste nicht. Sie fängt erst zwei Bildschirme weiter unten an (Überschrift bei etwa 935 px, Fenster 450 px hoch). Wenn ich bis zur Liste scrolle, ist die markierte Kachel nicht mehr zu sehen. Dann sagt mir nur noch das Abzeichen «Entwurf» in jeder einzelnen Zeile, dass gefiltert ist. |
| P-2 | Minor | Nebenkostenabrechnungen, Kachel mit 0 (z. B. «Versendet») | Bei 150 % ist unter der Suchzeile nach dem Klick nur leere Fläche zu sehen. Der Hinweis «Keine Abrechnungen gefunden» steht unterhalb des sichtbaren Bereichs. Ich dachte zuerst, die Seite lädt noch. Der Hinweis lautet «Versuchen Sie, Ihre Filter anzupassen.» und sagt nicht, dass es einfach keine versendeten Abrechnungen gibt. |
| P-3 | Minor | Nebenkostenabrechnungen, gefiltert | Für dasselbe gibt es zwei Wörter: auf der Kachel «Filter aufheben», neben «Suchen» «Filter zurücksetzen». Beim leeren Ergebnis steht «Filter zurücksetzen» sogar ein zweites Mal als Schaltfläche. Ich war unsicher, ob «aufheben» und «zurücksetzen» etwas anderes bewirken. (Beide führen auf dieselbe Seite.) |

## Beobachtungen

- Bei 150 % sitzt die gewählte Kachel gut sichtbar oben. Sie ist hellblau hinterlegt, hat einen dunkleren Rand, ein Häkchen und den Text «Filter aufheben». So wusste ich sofort, welcher Status gewählt ist. Die Markierung hängt nicht nur an der Farbe, das ist gut.
- Die Seite springt nach keinem Klick weg. Bei 150 % bleibt sie jedes Mal ganz oben stehen, bei 200 % dort, wo ich gerade war. Auch der zweite Klick auf dieselbe Kachel zeigt wieder alle 17 Abrechnungen, und die Markierung ist weg. Das hat mich nicht verwirrt.
- Die gewählte Kachel wird höher, weil «Filter aufheben» bei 150 % auf zwei Zeilen umbricht. Deshalb rutschen die Suchfelder um etwa eine Zeile nach unten, und das Suchfeld wird schmaler, weil rechts «Filter zurücksetzen» dazukommt. Ein kleiner Ruck, aber nicht störend.
- Nach dem Aufheben behält die Kachel einen dunkelgrauen Rand (Fokus), etwa bei «Bezahlt» oder «Überfällig». Einen Moment lang habe ich gedacht, sie sei noch ausgewählt. Am fehlenden Häkchen habe ich dann gesehen, dass sie es nicht ist.
- Dass die Kacheln anklickbar sind, sieht man ihnen vor dem ersten Klick nicht an. Sie sehen aus wie reine Zahlen. Weil die Aufgabe es sagte, habe ich es trotzdem versucht.
- Bei 150 % ist die Seitennavigation nur über «Menü öffnen» (☰) erreichbar. Den Link «Nebenkostenabrechnungen» habe ich dort gefunden.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 12 Klicks: Menü, Nebenkostenabrechnungen, Entwurf, Bezahlt, Bezahlt nochmals, Versendet, Überfällig, Überfällig nochmals, dazu Scrollen bei 200 %.

## Ablauf

- **Klick auf «Versendet» (0) bei 150 %.** Erwartet: ein Hinweis «keine Abrechnungen» gleich unter den Kacheln. Gesehen: Kachel markiert, darunter die Suchzeile und dann leere Fläche. Der Hinweis kam erst nach dem Scrollen (P-2).
- **Klick auf «Entwurf» bei 200 %.** Erwartet: die gefilterte Liste oder wenigstens ihr Anfang. Gesehen: nur die markierte Kachel und die Kacheln daneben. Die Liste «7 Abrechnungen» liegt zwei Bildschirme tiefer. Dort steht nicht, dass es nur die Entwürfe sind (P-1).
- **Erwartet: ein Satz über der Liste wie «Nur Entwürfe».** Gesehen: kein solcher Satz, nur «7 Abrechnungen» (P-1).

## Vorschläge

- **P-1:** Bei 200 % /statements öffnen, die Kachel «Entwurf» anklicken und nach unten zur Liste scrollen. Über der Liste steht «7 Abrechnungen», der Status wird nicht genannt. Hilfreich wäre die Überschrift «7 Abrechnungen im Status Entwurf» oder ein Satz über der Liste: «Es werden nur Abrechnungen im Status Entwurf angezeigt.» mit dem Link zum Aufheben gleich daneben.
- **P-2:** Bei 150 % /statements öffnen und auf «Versendet» klicken. Der Hinweis auf das leere Ergebnis liegt unter dem sichtbaren Bereich. Hilfreich wäre ein kurzer Satz gleich unter der Suchzeile, zum Beispiel: «Keine Abrechnungen im Status Versendet.» Auch weniger Abstand oder ein kleineres Bild darüber würden helfen. Ausserdem sollte der Text den Status nennen statt «Versuchen Sie, Ihre Filter anzupassen.».
- **P-3:** Eine Kachel wählen. Auf der Kachel steht «Filter aufheben», neben «Suchen» steht «Filter zurücksetzen». Hilfreich wäre ein einziges Wort für dasselbe, oder ein Unterschied, der sich erklärt (Kachel: «Status-Filter aufheben», Link: «Alle Filter zurücksetzen»).

## Nicht geprüft

- Das Zusammenspiel von Statusfilter und Suche bzw. Gebäudeauswahl. Die Aufgabe nannte nur die Kacheln.
- Die zweite Seite der Liste (17 Abrechnungen, «Nächste Seite») zusammen mit einem Filter.
- Die Kachel «Erledigt» (0) habe ich nicht einzeln angeklickt. Ich erwarte dort dasselbe wie bei «Versendet».

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1162/`
