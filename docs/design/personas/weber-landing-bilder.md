# Dr. Weber: Landing Page, Wirkung, Bilder und Animationen

Persona: Dr. Weber, 52, liest alles, rechnet nach. Desktop 1440 × 900, Maus. Seite: `http://localhost:3310/index.html` (statisch), ganz gelesen, Fragen der Häufigen Fragen aufgeklappt. Nichts gespeichert. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/weber-landing-bilder/`.

Was ich technisch festgestellt habe: Die Seite lädt nur von `localhost:3310`, keine fremden Server. Sie hat keine laufende Animation (`document.getAnimations()` leer), nur Übergänge, die bei «Bewegung reduzieren» abgeschaltet werden. Bilder: 17 Bildschirmfotos aus der App (hell und dunkel), zwei PDF-Ausschnitte, keine Fotos von Menschen oder Häusern.

## Fragebogen

**20. Warm oder kühl? Note 2 (eher kühl, sachlich).**
Die Seite ist weiss-grau mit einem dunklen Petrol, viel Text, Bildschirmfotos von Tabellen, Terminal-Befehle im Abschnitt «Installieren». Das wirkt wie ein gut gemachtes Behördenformular: korrekt, aber ohne einen Menschen darin. Mich stört das nicht, im Gegenteil: Die nüchterne Art macht die Aussagen im Abschnitt «Nebenkostenabrechnung» (Art. 257a OR, «Dwello ersetzt keine Rechtsberatung») glaubwürdig. Kühl wird es vor allem dort, wo die Seite technisch spricht (Formel mit `{area_total}`, `docker compose`, «MCP»), nicht wegen fehlender Fotos. Warm sind schon heute die Sätze «Ihr Vermieterjahr» und «Einmal einrichten lassen ... jemand aus der Familie».

**21. Fehlen Bilder von Menschen, Häusern, Alltag? Nein, die Bildschirmfotos reichen, aber sie sind zu klein zum Nachrechnen.**
Ein Foto einer lächelnden Vermieterin vor einem Mehrfamilienhaus würde mir nichts erklären und ich wüsste, dass es gekauft ist. Die Seite verspricht selbst: «Alle Bilder auf dieser Seite stammen aus der echten App mit den Demodaten»; dieses Versprechen ist mehr wert als jedes Stimmungsbild. Was mir fehlt, ist Lesbarkeit: In der Kostenaufstellung (Abschnitt «Nebenkostenabrechnung») ist die Schrift im Bild etwa 9 Pixel hoch; ich habe Lift CHF 1'690.00 × 16.67 % = CHF 281.67 und Allgemeinstrom CHF 762.80 × 15.33 % = CHF 116.94 nachgerechnet, beides stimmt, aber nur mit Mühe. Die PDF-Seite im Abschnitt «Swiss QR-Rechnung» ist in dieser Grösse gar nicht lesbar. Hilfreich wären Bilder, die eine einzelne Zeile vergrössert und erklärt zeigen (siehe «Ideen»), und eine schematische Zeichnung, wohin Daten fliessen.

**22. Wo würde eine Animation etwas erklären?**
- «Nebenkostenabrechnung»: wie aus den Kosten des Gebäudes über Verteilschlüssel und Mietstage der Betrag einer Wohnung wird, Schritt für Schritt, vom Leser weitergeklickt.
- «Verteilschlüssel und Heizprofile»: die Formel 0.7 × Fläche + 0.3 × Einheiten mit eingesetzten Zahlen; beim Heizprofil, warum ein Auszug Ende April mehr Heizkosten trägt als ein Drittel des Jahres.
- «Rechnungen und KI»: der Weg PDF → gelesene Felder → Hinweis «Datum prüfen» → erst nach Bestätigung erstellt. Gerade der Bestätigungsschritt beruhigt mich.
- «Datenschutz»: welche Daten den Server verlassen (Google-Anmeldung, Gebäuderegister, E-Mails, wahlweise externe KI) und welche nicht. Das darf ein stehendes Schema sein.

**23. Wo würde Bewegung stören?**
Überall, wo Zahlen stehen, die ich prüfen will: hochzählende Kennzahlen («CHF 0.–», «50 Wohnungen», «0 Daten gehen an uns»), Beträge, die sich in der Kostenaufstellung aufbauen, Texte, die erst beim Scrollen einblenden (ich lese langsam und will nicht warten), Parallax-Effekte und ein Video, das von selbst startet. In der Vergleichstabelle Dwello gegen «Typisches Abo» und im Abschnitt «Installieren» hat Bewegung nichts zu suchen. Jede Animation muss anhaltbar sein, «Bewegung reduzieren» beachten und ohne fremde Server laufen (kein YouTube, kein Animations-Dienst).

**24. Meine drei besten Ideen für mehr Wärme ohne Verlust an Klarheit**
1. Ein durchgerechnetes Beispiel mit Namen aus den Demodaten: «Hans Müller, Wohnung 1.01, Musterhaus Zentrum: so entstehen seine CHF 215.80 Nachzahlung», als vergrösserter, beschrifteter Ausschnitt der Abrechnung. Ein konkreter Mensch mit einer konkreten Zahl ist wärmer als jedes Foto und gleichzeitig prüfbar.
2. Der Abschnitt «Ihr Vermieterjahr» als Jahresleiste (Januar bis Dezember): wann Rechnungen kommen, wann abgerechnet wird, wann die Zahlungsfrist läuft. Das zeigt den Alltag einer Vermieterin ohne gestellte Bilder.
3. Ein ruhiges Schema «Ihr Server, Ihre Daten» im Abschnitt «Datenschutz»: ein Haus mit dem Server darin, wenige beschriftete Pfeile nach aussen. Wer vorsichtig ist wie ich, fasst damit Vertrauen, und es ist eine Zeichnung mit Funktion, keine Dekoration.

## Ideen

| Abschnitt der Seite | Idee (Bild oder Animation) | Was sie erklärt | Priorität |
|---|---|---|---|
| Nebenkostenabrechnung | Bild: eine Zeile der Kostenaufstellung (Lift) vergrössert, mit Beschriftung: CHF 1'690.00 Kosten des Gebäudes ÷ 6 Einheiten × 365/365 Tage = CHF 281.67 | Wie jede Zahl zustande kommt; macht «eine Abrechnung, die jede Zahl erklärt» nachprüfbar | hoch |
| Nebenkostenabrechnung | Animation in Schritten, vom Leser weitergeklickt (nicht automatisch): Gebäudekosten als Balken → Aufteilung auf die Wohnungen → bei Mieterwechsel Aufteilung nach Tagen auf die bisherige und die neue Mieterin, Leerstand beim Vermieter | Tagesgenaue Verteilung und dass der Vermieter den Leerstand trägt | hoch |
| Datenschutz | Bild: Schema mit Ihrem Server in der Mitte, beschriftete Pfeile nur zu Google-Anmeldung, Gebäuderegister des Bundes, E-Mail an Mieter und (gestrichelt, wahlweise) externe KI; «an uns: nichts» | Welche Daten das Haus verlassen, und welche nicht | hoch |
| Verteilschlüssel und Heizprofile | Bild: die Formel 0.7 × Fläche/Fläche total + 0.3 × Einheiten/Einheiten total mit eingesetzten Demowerten und Ergebnis in Prozent | Was die Formel mit `{area}` und `{units_total}` bedeutet, ohne Programmiersprache | hoch |
| Verteilschlüssel und Heizprofile | Animation, vom Leser bedient: Auszugsdatum auf der Monatsleiste des Heizprofils verschieben, Anteil läuft mit (z. B. Januar bis April 46.5 % statt 33 % linear) | Warum «im Januar ein Mietstag mehr zählt als im Juli» | mittel |
| Nebenkostenabrechnung | Bild: kleines Beispiel zur Rundung, Saldo CHF 3.40 wird nicht gefordert, sondern auf die nächste Abrechnung übertragen | Die Regel «Beträge unter CHF 5» | mittel |
| Rechnungen und KI | Kurze Bildfolge oder Animation mit Start-Knopf: PDF hineinziehen → Felder gelesen → Hinweis «Rechnungsdatum prüfen» → Bestätigen → Rechnung erstellt | Dass die KI nur vorschlägt und nichts ohne Bestätigung entsteht | mittel |
| Rechnungen und KI | Bild: der Hinweis auf eine fehlende Wasserrechnung, wie er in der App erscheint | Die Aussage «Dwello erwartet, was letztes Jahr kam» | mittel |
| Ihr Vermieterjahr | Bild: Jahresleiste Januar bis Dezember mit den vier Schritten an ihrem Zeitpunkt | Wann im Jahr was zu tun ist; macht den Alltag greifbar | mittel |
| Swiss QR-Rechnung und Mahnwesen | Bild: PDF-Seite 1 grösser oder als Ausschnitt mit dem Kasten «Nachzahlung CHF 215.80», derselbe Betrag im QR-Zahlteil markiert | Dass Abrechnung und Zahlteil denselben Betrag tragen | mittel |
| Swiss QR-Rechnung und Mahnwesen | Bild: Ablauf Abrechnung → Zahlungserinnerung → 2. Mahnung → 3. Mahnung mit den Fristen | Was bei ausbleibender Zahlung geschieht | tief |
| Installieren | Bild: zwei Spalten «Einmal: Ihre Helferin richtet ein» / «Jedes Jahr: Sie arbeiten im Browser» | Arbeitsteilung, nimmt die Angst vor dem Terminal | tief |
| Einfach zu bedienen | Bild: eine echte Hilfe am Feld aus der App (Begriff mit Erklärung darunter) | Die Aussage «jedes Feld erklärt seinen Begriff» belegt statt behauptet | tief |

## Was stören würde

- Stockfotos von Menschen, Schlüsselübergaben oder Häusern: Die Demohäuser sind erfunden, ein Foto würde etwas Echtes vortäuschen und widerspräche dem Satz «Alle Bilder ... stammen aus der echten App».
- Erfundene Kundenstimmen («Hans M., Vermieter in Zürich: ...»), Sternebewertungen, Nutzerzahlen oder Siegel wie «rechtssicher». Die Seite sagt richtig «Dwello ersetzt keine Rechtsberatung»; ein Siegel würde dem widersprechen.
- Hochzählende Kennzahlen, Zahlen, die sich in Tabellen aufbauen, Einblenden beim Scrollen, Parallax, Video mit Autostart, Endlosschleifen neben Text.
- Eingebettete Videos oder Animationen von fremden Servern (YouTube, Animations-Bibliotheken über CDN): würde das Versprechen «Kein Tracking» untergraben.
- Verläufe, Leuchteffekte, Emoji als Symbole, Illustrationen ohne Aussage (Häuschen mit Herz).

Weitere Beobachtungen ohne Bewertung:
- Im Bildschirmfoto der Abrechnung (Abschnitt «Nebenkostenabrechnung») steht zwischen «Status: Versendet» und «Kostenaufstellung» eine grosse leere Fläche; die Tabelle beginnt erst in der unteren Bildhälfte, auf dem ersten Bildschirm sieht man nur die Kopfzeile.
- Abschnitt «Verteilschlüssel und Heizprofile»: Der Text vergleicht Januar mit Juli, die Bildunterschrift Januar 13.6 % mit August 3.6 %. Beides stimmt mit dem Diagramm (Juli 3.7 %), aber ein einheitliches Paar wäre leichter nachzuprüfen. Die zwölf Monatsanteile ergeben zusammen 100.0 %, nachgerechnet.
- Die Bildunterschrift der Formel zeigt `{area}` und `{units_total}` in Programmschreibweise; für mich verständlich, für eine Laiin kühl.

## Nicht geprüft

- Dunkelmodus, Handy-Ansicht und die Sprachfassungen FR/IT/EN: nicht Teil dieser Aufgabe; mein Viewport ist Desktop.
- Die Demo (`demo.dwello.ch`) und die Anleitung auf GitHub: externe Ziele, nicht geöffnet.
- Wie meine Ideen tatsächlich wirken: sie sind Vorschläge, keine gebauten Entwürfe. Ob eine vom Leser bediente Animation ohne externe Bibliothek und barrierefrei umsetzbar ist, kann ich als Leserin nicht beurteilen.
