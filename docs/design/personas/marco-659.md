# Marco – #659, Abrechnungs-Assistent Schritt 3 (Heizprofil und Verwaltungspauschale)

Smartphone 390 × 844, Touch. Gebäude Alpenblick, Abrechnungsperiode 01.01.–31.12.2025. Nur angeschaut, nichts gespeichert; der Entwurf im Browser ist verworfen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 3, Hinweis «Zähler und Heizkostenverteiler in den Wohnungen» | Der Hinweis ist auf dem Handy ein Block von etwa 18 Zeilen in einer schmalen Spalte und mischt zwei Fälle mit verschiedenen Anweisungen: abgelesene Zähler beim Mieterwechsel («Abrechnung dieser Wohnung ausserhalb erstellen und die Entwürfe aller Mietverträge dieser Wohnung löschen») und Zähler oder Heizkostenverteiler im Gebäude («Abrechnungen ausserhalb erstellen»). Ich musste ihn zweimal lesen. Im ersten Fall ist unklar, ob ich jetzt weitermachen und die Entwürfe danach löschen soll, denn in Schritt 3 gibt es noch keine Entwürfe. Und was heisst «auch wenn Sie die Abrechnungen später neu erstellen»? |
| P-2 | Minor | Schritt 3, Knöpfe | Der Hinweis sagt bei Zählern im Gebäude: «Erstellen Sie die Abrechnungen dann ausserhalb von Dwello». In Schritt 3 gibt es aber nur «Weiter» und «Zurück», «Abbrechen» gibt es nur in Schritt 1. Wer jetzt aufhören will, muss über das Menü weg und weiss nicht, ob dabei etwas gespeichert wird. Dazu kommt «müssen Sie meist nach Verbrauch abrechnen»: Wegen dem «meist» bleibe ich unsicher, ob es mich betrifft. |
| P-3 | Minor | Schritt 3, Auswahl Heizprofil | Die Kurzhilfe sagt «wählen Sie das Profil, das Ihre Mietverträge vorsehen». In meinen Verträgen steht kein Profil, und was ich dann wählen soll, steht nirgends. Vorgewählt ist «Heizung + Warmwasser (100%)», obwohl das Gebäude in Interlaken liegt und es «Heizung Bergregion» gibt. Worin sich «Heizung + Warmwasser» von den Regionen unterscheidet, steht nirgends. Ich hätte die Vorwahl einfach gelassen. |

## Beobachtungen

- **Fällt der Hinweis auf?** Halb. Nach «Weiter» springt die Seite etwas nach unten. Im ersten Bild sind die Kurzhilfe und die Auswahl voll zu sehen, vom Hinweis aber nur der obere Rand der beigen Box ganz unten. Ich bin aber gezwungen, daran vorbeizuscrollen, denn «Weiter» steht weit unten, nach dem Monatsdiagramm und der Verwaltungspauschale. Mit beiger Box, linkem Balken und Warndreieck ist er beim Scrollen kaum zu übersehen. Er steht allerdings unter der Auswahl, nicht davor. Weil schon ein Profil vorgewählt ist, «wähle» ich eigentlich gar nicht, bevor ich ihn sehe.
- Unter der Kartenüberschrift «Heizprofil und Verwaltungspauschale» ist eine leere Fläche von etwa 100 px. Ohne sie wäre der Hinweis schon im ersten Bild zu lesen.
- Wechsle ich das Profil (Bergregion), bleibt der Hinweis stehen. «Weiter» ist immer aktiv, der Hinweis muss also nicht bestätigt werden.
- «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht über den Knöpfen. Gemeint ist die Box «Ohne vereinbarte Verwaltungspauschale» (Kevin Fischer, Wohnung OG1) unter den Knöpfen, nicht der Zähler-Hinweis. Beim ersten Lesen dachte ich, der Zähler-Hinweis sei gemeint.
- In Schritt 3 stehen die Knöpfe «Weiter» oben und «Zurück» darunter, auf ganzer Breite. Gut mit dem Daumen zu treffen.
- Beim Verlassen über das Menü kam keine Rückfrage. Auf «Abrechnungen erstellen» kam ich wieder zu Schritt 3, mit der Meldung «Angaben wiederhergestellt» und dem Knopf «Angaben verwerfen». Dieser fragt nach («Angaben verwerfen? Ihre Angaben werden gelöscht.»). Danach beginnt der Assistent wieder bei Schritt 1, und der Entwurf ist aus dem Browser verschwunden.
- Laut Netzwerk hat die Seite während des ganzen Ablaufs keine POST-, PUT- oder DELETE-Anfrage geschickt. Es wurde also nichts gespeichert.
- Der Menüknopf (☰) hat keinen sichtbaren Text. Für mich mit Touch war das egal.
- Seitliches Scrollen gab es keines (Breite 390).

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Durchläufe. Bis Schritt 3 braucht es 5 Taps: Menü, Nebenkostenabrechnungen, Abrechnungen erstellen, Weiter, Alpenblick, Weiter. Den Hinweis zu lesen und zu verstehen dauerte etwa 2 Minuten.

## Ablauf

- Schritt 3 geöffnet. Erwartet: Der Hinweis zu Zählern steht über der Auswahl oder ist gleich zu sehen. Gesehen: Er steht unter der Auswahl, im ersten Bild ist nur der Rand der Box zu sehen. Ein Profil ist schon vorgewählt.
- Kurzhilfe gelesen. Erwartet: Sie sagt, welches Profil ich nehmen soll. Gesehen: Ich soll nehmen, was der Mietvertrag vorsieht, aber in meinem steht keins.
- Hinweis gelesen. Erwartet: Eine klare Anweisung, z. B. «Hat Ihr Gebäude Zähler, brechen Sie hier ab». Gesehen: Zwei Fälle in einem Absatz. Für den ersten Fall soll ich Entwürfe löschen, die es noch nicht gibt. Einen Knopf zum Abbrechen gibt es in diesem Schritt nicht.
- Über das Menü weg. Erwartet: Eine Rückfrage wegen nicht gespeicherter Angaben. Gesehen: Keine Rückfrage. Beim Zurückkommen waren die Angaben wieder da und liessen sich verwerfen.

## Vorschläge

- **P-1:** Handy, Abrechnungen erstellen → Periode 2025 → Alpenblick → Weiter, zum Hinweis scrollen. Hilfreich wären zwei kurze Punkte statt eines Absatzes: «Zähler oder Heizkostenverteiler in den Wohnungen: Erstellen Sie die Abrechnungen ausserhalb von Dwello.» und «Zähler beim Mieterwechsel abgelesen: Erstellen Sie die Abrechnung, löschen Sie danach die Entwürfe dieser Wohnung und rechnen Sie sie ausserhalb ab.» Die Reihenfolge müsste ausdrücklich dastehen, und der Satzteil «auch wenn Sie … später neu erstellen» müsste klarer werden oder weg.
- **P-2:** Gleicher Weg. In Schritt 3 einen Knopf «Abbrechen» anbieten, wie in Schritt 1, oder im Hinweis sagen, wie man aufhört («Brechen Sie dann hier ab»). Das «meist» erklären (wann nicht?) oder streichen.
- **P-3:** Gleicher Weg, Auswahl Heizprofil öffnen. Hilfreich wäre ein Satz für den Fall ohne Profil im Mietvertrag (z. B. «Steht keins im Mietvertrag, wählen Sie das Profil Ihrer Region»), dazu eine kurze Erklärung, wofür «Heizung + Warmwasser» gedacht ist.

## Nicht geprüft

- Weitere Gebäude: Seepark Residenz und Musterhaus Zentrum lassen sich für 2025 nicht wählen («Alle Mietverträge haben schon eine»). Geprüft habe ich nur Alpenblick.
- Schritt 4 und 5 sowie das Erstellen: laut Auftrag nicht. Dass der Hinweis bis zum Schluss wirkt, habe ich nicht verfolgt.
- Ob sich das Monatsdiagramm beim Profilwechsel ändert: Ich habe nach dem Wechsel nur festgehalten, dass der Hinweis stehen bleibt.
- Dunkelmodus und andere Sprachen: nicht Teil des Auftrags.
