# Marco, Landing Page: Wirkung, Bilder und Animationen

Persona: Marco, 38, angestellt, fast nur am Handy, wenig Zeit. Viewport mobil 390 × 844, Touch.
Seite: `http://localhost:3310/index.html` (statisch), Fragen 20–24 aus `landing-fragebogen.md`, Abschnitt «Zusatz: Wirkung, Bilder und Animationen».
Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-landing-bilder/` (`run.mjs`, `links.mjs`, `00-first.png` bis `31-scroll.png`, `full.png`).

## Messwerte (was ich am Handy mitgebracht habe)

- Seite geladen in rund 170 ms (lokal, kein echtes Mobilnetz).
- Gesamte Seite rund 890 KB: HTML 77 KB, eine Schrift (Inter, 48 KB, vom eigenen Server), 12 Bilder im WebP-Format zwischen 35 und 97 KB.
- Alle Anfragen gingen an `localhost:3310`, also keine Anfrage an fremde Server.
- Gleich beim Öffnen lädt das Handy vier Bilder: das Desktop-Bild der Übersicht hell und dunkel und das Handy-Bild der Übersicht hell und dunkel, zusammen rund 290 KB. Sichtbar ist davon nur eines, das Desktop-Bild hell. Die anderen drei laden umsonst (die dunklen) oder zu früh (das Handy-Bild steht erst viel weiter unten).
- Die Seite ist am Handy 24 864 px hoch, das sind rund 30 Bildschirme. Allein «Funktionen» ist rund 6 700 px lang (8 Bildschirme), «Was in Dwello steckt» rund 3 500 px.
- Laufende Animationen: keine (`document.getAnimations()` = 0). Kein seitliches Scrollen (Breite 390).

## Fragebogen

**20. Warm oder kühl? Note: 2 von 5 (eher kühl).**
Der erste Bildschirm (`00-first.png`) ist sauber und ruhig: weisser Grund, dunkles Petrolblau, ein Häuschen als Logo, grosse Schrift «Ihre Liegenschaft. Ihre Daten. Ihr Server.» Das liest sich wie ein IT-Produkt, nicht wie etwas für mich als Vermieter mit einem Mehrfamilienhaus. Kühl machen es vor allem: das Wort «Server» schon in der Überschrift, die Zahlenreihen («CHF 0.–», «4», «50», «0», später «48 px», «1», «7 : 1»), Begriffe wie WCAG 2.2 AA, Mobile first, MCP, Docker, 16 GB Arbeitsspeicher, und dass alle Bilder Bildschirmfotos von Tabellen und Formularen sind. Die ganze Seite ist eine lange Reihe gleich aussehender Karten mit Icon, Titel und Häkchen «Verfügbar». Warm wirken die wenigen Sätze, die von mir reden: «Vier Schritte. Einmal im Jahr. Ohne Excel.», «Für Menschen, die das nur ein paar Mal im Jahr machen.» und ganz unten «Im Frühling ist die Abrechnung schnell gemacht.» Das ist der Ton, den ich mir öfter wünschen würde.

**21. Fehlen Bilder von Menschen, Häusern, Alltag? Note, ob die Bildschirmfotos reichen: 3 von 5.**
Fotos von lächelnden Menschen brauche ich nicht, Stockfotos würde ich sofort als Werbung abtun. Die Bildschirmfotos helfen, weil ich sehe, dass es die App wirklich gibt. Aber am Handy kann ich sie kaum lesen: Oben im Hero steht das Desktop-Bild der Übersicht (`01-scroll.png`), die Schrift darin ist winzig, obwohl es ein Handy-Bild gibt, das erst bei «Barrierefrei» kommt (`24-scroll.png`) und dort sehr gut lesbar ist. Das Gleiche bei «Rechnungen hochladen» (`05-scroll.png`) und der Kostenaufstellung (`06-scroll.png`): Ich erkenne «da ist ein Formular», mehr nicht. Was mir helfen würde: ein einfaches Bild eines Mehrfamilienhauses mit Wohnungen, das zeigt, wie Kosten auf die Wohnungen gehen; ein Bild der fertigen Abrechnung mit QR-Zahlteil am Anfang (das gibt es, `pdf-page-1` und `pdf-qr-part`, aber erst weit unten); Handy-Bildschirmfotos statt Desktop-Bildschirmfotos am Handy. Die Strichzeichnung «Ein Haus mit einem Server darin» (`17-scroll.png`) ist die einzige Zeichnung und passt im Stil, sie ist aber das technischste Motiv der ganzen Seite.

**22. Wo würde eine Animation etwas erklären?**
- «Vier Schritte. Einmal im Jahr. Ohne Excel.» (`#ablauf`): eine kurze, einmal ablaufende Bildfolge, wie aus einem PDF-Beleg eine Zeile in der Abrechnung und daraus ein QR-Einzahlungsschein wird. Das ist die Kernaussage, und die vier Karten erklären sie heute nur mit Text.
- «Rechnungen per Drag & Drop» (`#funktionen`): Am Handy gibt es kein Drag & Drop. Eine kurze Abfolge «Datei wählen, KI liest Betrag und Datum, gelber Hinweis ‹Bitte prüfen›» würde zeigen, was ich am Handy tatsächlich tue.
- «Gerecht verteilt, auch im Winter.» (`#funktionen`): wie ein Betrag (z. B. Heizung CHF 6 000) nach Fläche auf drei Wohnungen aufgeteilt wird, Balken wachsen von der Summe in die Wohnungen. Das Heizprofil-Bild (`08-scroll.png`) zeigt Monatsbalken, aber nicht, was das für meinen Mieter bedeutet.
- «Ihre Mieter zahlen mit dem Handy» (`#funktionen`): Zahlung kommt rein, die Zeile wechselt von «offen» auf «bezahlt». Höchstens zwei Schritte.

**23. Wo würde Bewegung stören?**
- Im ersten Bildschirm: Dort will ich in 10 Sekunden wissen, was das ist. Ein Video oder ein Karussell würde mich bremsen und Daten kosten.
- In «Was in Dwello steckt» (15 Karten) und in «Was als Nächstes kommt»: einfliegende oder aufblendende Karten beim Scrollen machen eine sowieso schon sehr lange Seite noch zäher.
- Bei den Datenschutz-Punkten und der Installationsanleitung: Das muss ruhig und lesbar sein, Bewegung wirkt dort unseriös.
- Alles, was automatisch und in Schleife läuft (Videos, GIFs, Zähler, die hochzählen «CHF 0.–»). Ein Video im Hero würde die 890 KB schnell vervielfachen; auf Mobilnetz im Zug würde ich abbrechen.

**24. Meine drei besten Ideen für mehr Wärme ohne Verlust an Klarheit**
1. Ein Beispiel durchziehen: «Musterhaus Zentrum, 3 Wohnungen, Herr Müller zahlt CHF 215.80 nach». Die Demo-Namen stehen schon in den Bildern; wenn der Text oben eine kleine Geschichte daraus macht (ein Vermieter, ein Haus, ein Jahr), fühle ich mich gemeint, nicht ein Systemadministrator.
2. Eine einfache Strichzeichnung im Stil des «Haus mit Server», aber mit dem, was mich interessiert: ein Haus mit drei Wohnungen, aus dem Kosten in die Wohnungen fliessen, und ein Briefumschlag mit QR-Schein. Gleiche Farben, kein Foto, schnell geladen (SVG).
3. Am Handy Handy-Bilder zeigen und die Seite kürzen: Das Handy-Bild der Übersicht nach oben in den Hero, die Bildschirmfotos zuschneiden auf das, was der Text sagt (die eine Zeile «Bitte prüfen», den QR-Zahlteil), und die Technikangaben (px, Kontrast, WCAG, MCP, GB) unter «Für Fachleute» zuklappen. Weniger Technik vorne macht die Seite von selbst wärmer.

## Ideen

| Abschnitt der Seite | Idee (Bild oder Animation) | Was sie erklären würde | Priorität |
|---|---|---|---|
| Hero (erster Bildschirm) | Bild: am Handy das Handy-Bildschirmfoto der Übersicht statt des Desktop-Fotos; nur das passende Bild laden | Dass Dwello am Handy wirklich lesbar ist; spart rund 200 KB beim Öffnen | hoch |
| «Vier Schritte. Einmal im Jahr.» (`#ablauf`) | Animation, einmal ablaufend, mit Pause-Knopf und abgeschaltet bei «Bewegung reduzieren»: Beleg wird zur Zeile in der Abrechnung, daraus der QR-Einzahlungsschein | Den ganzen Ablauf in 5 Sekunden, ohne die vier Karten zu lesen | hoch |
| «Gerecht verteilt, auch im Winter.» | Bild (SVG-Zeichnung): Haus mit drei Wohnungen, ein Betrag teilt sich nach Fläche auf; optional als kurze Animation, wenn der Abschnitt sichtbar wird | Was ein Verteilschlüssel ist, ohne das Wort zu kennen | hoch |
| «Eine Abrechnung, die jede Zahl erklärt.» | Bild: zugeschnittener Ausschnitt einer einzigen Zeile der Kostenaufstellung (Lift, Pro Einheit, 365/365 Tage, CHF 281.67) statt der ganzen breiten Tabelle | Wie Dwello eine Zahl herleitet; am Handy lesbar | mittel |
| «Rechnungen per Drag & Drop» | Animation in drei Bildern: Datei wählen, KI füllt Betrag und Datum, Hinweis «Bitte prüfen»; dazu am Handy «Datei wählen» statt «Drag & Drop» im Text | Was ich am Handy tue und dass ich die KI kontrolliere | mittel |
| «Ihre Mieter zahlen mit dem Handy» | Bild: QR-Zahlteil (gibt es schon) weiter nach oben, daneben eine Zeile «offen» → «bezahlt» als kleine Zustandsänderung | Dass ich sehe, wer bezahlt hat | mittel |
| «Nach dem Schweizer Datenschutzgesetz gebaut.» | Bild: das Haus mit Server behalten, aber mit Belegen und Mieterordnern statt Serverschubladen | Daten bleiben bei mir, ohne Technik-Motiv | tief |
| «Was in Dwello steckt.» | Keine neuen Bilder; stattdessen zuklappen oder auf 6 Karten kürzen | Weniger Scrollen, die Seite wirkt weniger wie ein Datenblatt | mittel |
| Schluss «Die nächste Abrechnung machen Sie mit Dwello.» | Bild: kleine Zeichnung Kalender «Frühling» mit Haken | Den warmen Satz «Im Frühling ist die Abrechnung schnell gemacht» sichtbar machen | tief |

## Was stören würde

- Stockfotos von Menschen oder Häusern: wirkt wie Werbung, kostet Daten, erklärt nichts.
- Ein Video oder Karussell im ersten Bildschirm, Autoplay jeder Art, Schleifen-GIFs.
- Einblenden oder Einfliegen jeder Karte beim Scrollen, besonders in «Was in Dwello steckt» und «Was als Nächstes kommt».
- Hochzählende Zahlen (CHF 0.–, 4 Sprachen, 50 Wohnungen) und Parallax-Effekte.
- Animationen, die beim Öffnen sofort laden, statt erst wenn der Abschnitt sichtbar ist, und alles, was die Seite über rund 1 MB bringt.
- Eingebettete Videos von fremden Plattformen (verstossen gegen «keine Anfragen nach aussen» und würden die Datenschutz-Aussage «Kein Tracking» untergraben).
- Verläufe, Leuchteffekte, Emoji statt Icons: würde die heute ruhige, seriöse Wirkung kaputtmachen.

## Nicht geprüft

- Echtes Mobilnetz: Ich habe lokal gemessen (170 ms); wie lange die rund 890 KB über 3G/4G im Zug dauern, habe ich nicht gedrosselt gemessen.
- Dunkelmodus und Systemeinstellung «Bewegung reduzieren»: nicht umgeschaltet, weil es heute keine Animationen gibt und die Fragen den hellen Eindruck betreffen.
- Die Sprachversionen fr/it/en: nicht Teil der Aufgabe.
- Die Links «Demo ansehen» (`https://demo.dwello.ch/dashboard`) und «Quellcode auf GitHub»: nicht geöffnet, weil sie zu externen Seiten führen und die Aufgabe nur die statische Seite umfasst.
- Den Inhalt der FAQ-Antworten habe ich nicht aufgeklappt; für die Fragen 20–24 nicht nötig.
