# Helga, 68: Wirkung, Bilder und Animationen der Website (landing-bilder)

Seite: http://localhost:3310/index.html, Desktop 1440 × 900 bei 150 % Zoom, Maus. Ich habe die ganze Seite von oben bis unten durchgescrollt (rund 20 000 Pixel, 34 Bildschirmhöhen), nichts gespeichert. Die Seite lädt nur von localhost:3310; ich habe keine Anfrage an einen anderen Server gesehen. Animationen liefen keine (`document.getAnimations()` war leer); nur das Scrollen ist weich (`scroll-behavior: smooth`).

## Fragebogen

**20. Warm oder kühl? Note 2 von 5.**
Gleich zuoberst steht in riesigen Buchstaben «Ihre Liegenschaft. Ihre Daten. Ihr Server.», und gerade das Wort «Server» ist blau hervorgehoben. Bei «Server» denke ich an meinen Neffen und seine blinkenden Kästchen, nicht an meine Wohnung. Auf dem ersten Bildschirm gibt es nur Text, zwei Knöpfe und einen grauen Hintergrund, kein Bild. Danach folgen Karten mit dünnen Strichsymbolen, Bildschirmfotos voller Tabellen, Formeln wie `0.7 * {area} / {area_total}`, ein PDF mit winziger Schrift, eine Datenschutz-Fläche in Dunkelblau, ein Terminal mit `git clone` und `docker compose`, eine Vergleichstabelle. Alles ist ordentlich und gut lesbar, aber es wirkt wie ein Prospekt für Fachleute. Warm sind ein paar Sätze: «Für Menschen, die das nur ein paar Mal im Jahr machen», «Dwello ist nicht für Profis gebaut, sondern für Sie», «Im Frühling ist die Abrechnung schnell gemacht». Diese Sätze stehen aber weit unten, und die meisten Leute lesen nicht so weit.

**21. Fehlen Bilder? Ja, ein paar.**
Die Bildschirmfotos der App helfen mir, weil ich sehe, wie es später aussieht. Das Handy neben dem Bildschirm oben finde ich gut. Aber sie zeigen fast nur Listen und Zahlen. Auf dem ersten Bildschirmfoto steht ausgerechnet «Noch nicht abgerechnet: … Musterhaus Zentrum (2023, 2022, 2021, 2020, 2019, 2018)». Das macht mir eher Angst: Sieht so mein Rückstand aus? Was mir fehlt:
- Hilfreich: ein ruhiges Foto oder eine Zeichnung von einem gewöhnlichen Schweizer Mehrfamilienhaus, wie meines eines ist, damit ich weiss: Das ist für Leute wie mich. Auch eine Szene am Küchentisch mit einem Stapel Rechnungen und einem Laptop, also genau die Arbeit, um die es geht.
- Hilfreich: ein Bild «vorher / nachher»: die Schuhschachtel voller Belege, daneben die fertige Abrechnung mit dem Einzahlungsschein.
- Hilfreich: ein Bild, das zeigt, was die Mieterin bekommt (der Brief mit QR-Zahlteil im Briefkasten oder auf dem Handy). Das PDF ist schon da, aber so klein, dass ich es nicht lesen kann.
- Nicht hilfreich: Fotos von lachenden Models mit Schlüssel in der Hand, Bilder vom Rechenzentrum oder Kabeln, Grafiken mit Robotern für die «KI». Das wäre Werbung, nicht Erklärung.

**22. Wo würde eine Animation etwas erklären?**
- «Rechnungen und KI»: wie eine PDF-Rechnung in das Fenster gezogen wird und danach Betrag, Datum und Kategorie in den Feldern erscheinen, mit dem gelben Hinweis «Bitte prüfen». Den Satz «Rechnungen per Drag & Drop» verstehe ich ohne Bild nicht; das Wort «Drag & Drop» kenne ich nicht.
- «Verteilschlüssel und Heizprofile»: wie die Kosten eines Hauses auf die Wohnungen aufgeteilt werden, etwa eine Heizrechnung von CHF 6 957.80, die sich in sechs Stücke nach Fläche teilt. Die Formel mit geschweiften Klammern sagt mir gar nichts; ein Bild, das sich Schritt für Schritt aufbaut, schon.
- «Nebenkostenabrechnung», tagesgenau bei Mieterwechsel: ein Kalenderbalken, auf dem der alte Mieter bis Ende März und die neue Mieterin ab April je ihren Teil bekommen.
- «Ihr Vermieterjahr» (vier Schritte): ein ruhiger Ablauf, der die Schritte nacheinander hervorhebt, wenn ich draufklicke, damit ich sehe, was einmal, was laufend und was einmal im Jahr passiert.

**23. Wo würde Bewegung stören?**
Alles, was sich von selbst bewegt, während ich lese: Texte, die beim Scrollen hereinfliegen, wechselnde Bilder im Kopfteil, sich drehende Zahlen bei «CHF 0.–» oder «50 Wohnungen», ein Video, das von selbst losgeht. Ich lese langsam und mit Zoom; wenn sich etwas verschiebt, verliere ich die Zeile. Auch das Terminal sollte nicht «tippen», das ist für die Person, die einrichtet, und für mich nur Lärm. Bei der Datenschutz-Fläche und den Häufigen Fragen braucht es keine Bewegung. Und die Seite soll nicht langsamer laden: Ich habe eine alte Leitung zuhause.

**24. Meine drei besten Ideen**
1. Der erste Bildschirm spricht mich als Vermieterin an, nicht den Server: eine Überschrift wie «Ihre Nebenkostenabrechnung, ohne Excel und ohne Abo» und daneben ein Bild von einem gewöhnlichen Mehrfamilienhaus oder vom Küchentisch mit Belegen. Das Versprechen «Ihre Daten bleiben bei Ihnen» darf in der Zeile darunter stehen.
2. Eine kurze Animation, die nur auf Knopfdruck startet, zum Hochladen einer Rechnung und eine zum Verteilen der Kosten. Beide zeigen echte Zahlen aus der Demo, mit einem Satz Erklärung darunter und einem Knopf «Anhalten».
3. Die warmen Sätze nach oben holen («Für Menschen, die das nur ein paar Mal im Jahr machen») und zum ersten Bildschirmfoto eines nehmen, das ruhig wirkt (eine fertige Abrechnung oder der Brief an die Mieterin), nicht eine lange Liste mit unerledigten Jahren.

## Ideen

| Abschnitt der Seite | Idee (Bild oder Animation) | Was es erklären würde | Priorität |
|---|---|---|---|
| Kopfteil (erster Bildschirm) | Bild: einfache Strichzeichnung oder echtes Foto eines Schweizer Mehrfamilienhauses mit 4 bis 6 Wohnungen, lokal ausgeliefert | Für wen Dwello ist: private Vermieterinnen mit einem Haus, nicht Verwaltungen | hoch |
| Rechnungen und KI | Animation auf Knopfdruck: PDF wird ins Fenster gezogen, Felder füllen sich, gelber Prüfhinweis erscheint, «Diese Rechnung erstellen» wird angeklickt | Was «Drag & Drop» heisst und dass ich am Schluss bestätige | hoch |
| Verteilschlüssel und Heizprofile | Animation Schritt für Schritt (mit Weiter-Knopf): ein Rechnungsbetrag teilt sich nach Fläche auf die Wohnungen; danach die Heizkosten nach Monaten | Was ein Verteilschlüssel ist, ohne Formel | hoch |
| Ihr Vermieterjahr | Bild: Jahresband Januar bis Dezember, auf dem die vier Schritte stehen (Gebäude einmalig, Rechnungen laufend, Abrechnung im Frühling) | Wann im Jahr ich was tun muss | mittel |
| Nebenkostenabrechnung | Bild: Kalenderbalken mit Mieterwechsel am 1. April, Anteile in Tagen | «Tagesgenau bei Mieterwechsel» | mittel |
| Swiss QR-Rechnung | Bild: der fertige Brief mit QR-Zahlteil, gross genug zum Lesen, daneben ein Handy, das ihn scannt | Was meine Mieterin bekommt und wie sie zahlt | mittel |
| Gleich nach dem Kopfteil (So sieht Dwello aus) | Bild austauschen: statt der Übersicht mit den Jahren 2018–2023 «noch nicht abgerechnet» eine ruhige Übersicht oder eine fertige Abrechnung | Dass Dwello Ordnung schafft, nicht Rückstand zeigt | mittel |
| Installieren | Bild: zwei Personen (ich und mein Neffe), Pfeil «einmal einrichten», dann nur noch ich am Laptop | Wer was macht; dass ich das Terminal nicht brauche | mittel |
| Datenschutz | Das vorhandene Haus mit Server darin ergänzen: Pfeile, die zeigen, was nach aussen geht (Google-Anmeldung, Adresssuche, E-Mail an Mieter) und was im Haus bleibt | Den langen Absatz über Daten als Bild | tief |
| Einfach zu bedienen | Bild: ein grosses Bildschirmfoto eines Feldes mit Hilfetext darunter («jedes Feld erklärt seinen Begriff») | Dass mir die App die Wörter erklärt | tief |

Alle Ideen: keine Farbverläufe, kein Leuchten, keine Emojis; Bilder und Animationen auf dem eigenen Server, keine eingebetteten Videos von fremden Seiten. Animationen nur auf Knopfdruck, mit Anhalten, und bei «Bewegung reduzieren» im Gerät nur als stehende Bildfolge.

## Was stören würde

- Bewegung, die von selbst startet: einfliegende Texte beim Scrollen, Bilderkarussell im Kopfteil, hochzählende Zahlen, ein Video ohne Knopfdruck.
- Ein tippendes Terminal oder sonst Technik-Animationen.
- Stockfotos von glücklichen Menschen, die nichts mit Nebenkosten zu tun haben; Roboter oder Gehirne für die «KI».
- Grosse Bilddateien, die die Seite langsam machen, oder Bilder und Videos, die von fremden Servern geladen werden (das widerspräche auch «Kein Tracking»).
- Bildschirmfotos, die noch kleiner werden als das PDF jetzt: Bilder sollen etwas zeigen, das ich lesen kann.

## Beobachtungen

- Das PDF-Bild der Abrechnung und das Bild vom QR-Zahlteil sind bei 150 % so klein, dass ich die Zahlen nicht lesen kann; nur die Bildbeschreibung sagt mir, dass es um CHF 215.80 geht.
- Das Bild vom Dialog «Rechnungen hochladen» ist unten abgeschnitten: die Knöpfe «Abbrechen» und «1 Rechnung erstellen» sind nur halb zu sehen.
- In der Schlussfläche («Die nächste Abrechnung machen Sie mit Dwello.») steht ein grosses, blasses Haus-Symbol im Hintergrund. Es ist das einzige Bild, das warm wirkt, erklärt aber nichts.
- Die Hauszeichnung mit dem Server im Datenschutz-Teil ist das einzige Bild auf der Seite, das nicht aus der App stammt. Sie gefällt mir, steht aber auf Dunkelblau, wo sie eher ernst als freundlich wirkt.
- Bei meinen Bildschirmfotos während des weichen Scrollens lag die Kopfleiste manchmal ein Stück tiefer. Wenn ich gewartet habe, sass sie oben (Position 0). Das liegt an meinen Bildschirmfotos, nicht an der Seite.

## Aufgabe geschafft

ja

## Aufwand

Etwa 15 Minuten, rund 8 Schritte: Seite öffnen, ganze Seite in 34 Bildschirmhöhen durchscrollen, Texte lesen, Bilder und Symbole zählen, die Hauszeichnung im Datenschutz-Teil einzeln anschauen, mit dem Mausrad scrollen, um Bewegung beim Scrollen zu prüfen.

## Ablauf

1. Seite öffnen. Erwartet: ein Haus oder ein Mensch, der mir sagt «das ist für Sie». Gesehen: grosse schwarze Schrift, «Ihr Server.» in Blau, zwei Knöpfe, kein Bild.
2. Weiter nach unten. Erwartet: ein Bild der App. Gesehen: die Übersicht auf Bildschirm und Handy, mit der langen Liste «Noch nicht abgerechnet …».
3. «Ihr Vermieterjahr». Erwartet: eine Erklärung, wann ich was mache. Gesehen: vier weisse Karten mit Strichsymbolen, klar, aber trocken.
4. Rechnungen, Abrechnung, Verteilschlüssel, QR-Rechnung, Gebäude. Erwartet: zu jeder Funktion ein Bild, das sie erklärt. Gesehen: Bildschirmfotos mit kleiner Schrift, eine Formel in Programmierschrift, ein kaum lesbares PDF.
5. Funktionsliste (16 Karten). Gesehen: viele gleiche Karten mit grünen «Verfügbar»-Schildern. Ab der zehnten habe ich nur noch überflogen.
6. Datenschutz. Gesehen: dunkelblaue Fläche, eine Strichzeichnung «Haus mit Server darin». Das einzige Bild, das ein Gefühl zeigt.
7. KI-Assistent, Installieren, Einfach zu bedienen, Vergleich, Roadmap, Häufige Fragen, Schluss. Gesehen: ein Chatfenster, ein Terminal mit Befehlen, Zahlen wie «48 px» und «7 : 1». Erst hier stehen die warmen Sätze für mich.
8. Mit dem Mausrad gescrollt. Erwartet: keine Überraschungen. Gesehen: nichts bewegt sich von selbst, gut.

## Verwirrung

- «Server», «Ollama», «OpenAI-kompatible KI», «NAS», «Hoster», «MCP», «Docker», «AGPL»: lauter Wörter, die ich nicht kenne und die die Seite kühl machen.
- «Drag & Drop»: ohne Bild weiss ich nicht, was gemeint ist.
- «48 px», «7 : 1 Kontrast», «390 px», «WCAG 2.2 AA», «axe»: Das ist für Fachleute. Für mich hiesse es einfach «grosse Knöpfe, gut lesbare Schrift».
- Die Formel `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` schreckt mich ab.

## Fehlerrisiken

- Wer nur den ersten Bildschirm sieht, liest «Ihr Server» und denkt: Das ist nichts für mich. Dann geht die Person weg, bevor sie liest, dass die Einrichtung jemand anderes übernimmt.
- Das erste App-Bild mit «2018, 2019, 2020 … noch nicht abgerechnet» kann wirken, als müsse man sofort sechs Jahre nachholen.

## Vorschläge

Diese Aufgabe hat keine Änderung zum Bewerten genannt; deshalb gibt es keine Befundtabelle und keine Befunde. Die Vorschläge stehen unter «Ideen» und Frage 24.

## Nicht geprüft

- 200 % Zoom und Handyansicht: Die Aufgabe nannte nur 150 % Desktop.
- Dunkelmodus der Website: nicht umgestellt; die dunklen Bildvarianten (`*-dark.webp`) habe ich nicht gesehen.
- Ob die Seite «Bewegung reduzieren» im Gerät beachtet (zum Beispiel beim weichen Scrollen): kann ich als Nutzerin nicht einstellen und habe es nicht ausprobiert.
- Die Antworten in den Häufigen Fragen (ausser der ersten), das Menü und die Sprachen FR/IT/EN: nicht aufgeklappt, weil die Aufgabe nach Wirkung und Bildern fragt.
- Die Ladezeit auf einer langsamen Leitung: nicht gemessen.
