# Marco – Schrittanzeige in «Neuer Mietvertrag» und «Abrechnungen erstellen» (Handy, #1179)

Persona: Marco, 38, Handy 390 × 844, Touch. Nur angeschaut, nichts gespeichert (kein Mietvertrag, keine Abrechnungen erstellt).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schrittanzeige | Erledigte Schritte zeigen nur «✓ Mieter», «✓ Wohnung», «✓ Vertragsdauer», nicht was ich gewählt habe (Marco Bernasconi, Wohnung OG2, 01.01.2027). Im Abrechnungs-Assistenten steht der gewählte Wert darunter. Ich musste mir selbst merken, welche Wohnung ich genommen habe. |
| P-2 | Minor | Beide Assistenten, Schrittanzeige nach Sprung zurück | Springe ich über die Anzeige zu einem früheren Schritt, verlieren alle späteren Schritte ihr Häkchen und sind nicht mehr antippbar, obwohl meine Angaben erhalten bleiben. Vom Mietvertrag-Schritt «Mieter» zurück zu «Miete» musste ich dreimal «Weiter» tippen. |
| P-3 | Minor | Beide Assistenten, Schritt 1 | Die Schrittanzeige (Zeile «Schritt x von 5», Balken und fünf Zeilen untereinander) braucht rund 350 px. Auf Schritt 1 sehe ich beim Öffnen kein einziges Eingabefeld, nur Titel, Einleitung und die Liste; die Karte mit dem Formular beginnt am unteren Bildschirmrand. Ab Schritt 2 scrollt die Seite selbst, aber die Liste nimmt auch dann noch das obere Drittel ein. |

## Beobachtungen

- Abrechnungs-Assistent: Die Werte unter den erledigten Schritten sind gut. «01.01.2025 – 31.12.2025», «Alpenblick, Seepark Residenz, Musterhaus Zentrum» (sauber an der Wortgrenze umbrochen), «Heizung Bergregion». Unter «Heizprofil und Verwaltungspauschale» steht aber nur das Heizprofil, nicht die 3 % Verwaltungspauschale.
- Nirgends abgeschnitten, kein Umbruch mitten im Wort, kein seitliches Scrollen (Seitenbreite immer 390 px). «Schritt 3 von 5: Heizprofil und Verwaltungspauschale» bricht auf zwei Zeilen um, gut lesbar.
- Aktueller Schritt klar erkennbar (gefülltes Kästchen mit Zahl, fett), kommende Schritte als Rahmen mit Zahl, erledigte grün mit Häkchen in Linkfarbe. Welcher als Nächstes kommt, ist eindeutig.
- Die erledigten Schritte sind 48 px hoch und gut zu treffen. Dass man sie antippen kann, sieht man nur an der blauen Linkfarbe; ein Hinweis wie «zum Ändern antippen» fehlt, ich habe es eher ausprobiert.
- Nach «Weiter» scrollt die Seite so, dass die Schrittanzeige oben steht. In der Vorschau lag der erste erledigte Schritt («Abrechnungsperiode») halb unter der festen Kopfleiste.
- Zeile «Schritt x von 5» plus Balken plus Liste sagen dreimal dasselbe; auf dem Handy wäre eine Zeile davon genug.
- Gebäude-Schritt nach dem Zurückspringen: «Alle Gebäude» war angehakt, daneben «1 von 3 gewählt». Unter der Überschrift «Gebäude» war eine grosse leere Fläche. Nicht Teil der Schrittanzeige.
- Brotkrümel im Abrechnungs-Assistenten bricht nach «Nebenkostenabrechnungen ›» um, «Abrechnungen erstellen» steht allein auf der nächsten Zeile.
- Vorschau mit drei Gebäuden zeigt «Anzahl Abrechnungen 2»; vermutlich wegen schon vorhandener Abrechnungen, nicht geprüft.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Tipp-/Auswahlschritte über beide Assistenten (inkl. Wiederholungen).

## Ablauf

- Mietvertrag, Schritt 1 geöffnet. Erwartet: Mieter-Auswahl sichtbar. Gesehen: nur Titel, Einleitung, Schrittanzeige; das Feld erst nach Scrollen.
- Mietvertrag, Schritt 3/4. Erwartet: unter «✓ Mieter» der Name, unter «✓ Wohnung» die Wohnung. Gesehen: nur das Schrittwort mit Häkchen.
- Mietvertrag, von Schritt 4 auf «Mieter» getippt. Erwartet: zurück zu Mieter, die Schritte 2 und 3 bleiben erledigt und ich kann direkt zu «Miete» zurück. Gesehen: 2 bis 5 wieder als offene Nummern, nicht antippbar; Mieter, Wohnung und Datum waren noch da, ich musste aber dreimal «Weiter» tippen.
- Abrechnungen, von Vorschau auf «Gebäude» getippt. Erwartet: «Heizprofil» bleibt erledigt. Gesehen: nur «Abrechnungsperiode» noch erledigt; das Heizprofil «Heizung Bergregion» blieb beim Weitergehen aber gewählt.
- Abrechnungen, Vorschau. Erwartet: unter «Heizprofil und Verwaltungspauschale» beide Werte. Gesehen: nur «Heizung Bergregion».

## Vorschläge

- **P-1:** Neuer Mietvertrag, Mieter «Marco Bernasconi» wählen, Weiter, Wohnung «OG2 · Alpenblick» wählen, Weiter. Die Schrittanzeige zeigt «✓ Mieter», «✓ Wohnung» ohne Namen. Hilfe: wie im Abrechnungs-Assistenten den gewählten Wert unter den Schrittnamen setzen (Mietername, «Wohnung OG2 · Alpenblick», Vertragsbeginn).
- **P-2:** Mietvertrag bis Schritt 4 «Miete» ausfüllen, in der Anzeige «Mieter» antippen. Schritte 2 und 3 haben kein Häkchen mehr. Gleich im Abrechnungs-Assistenten: Vorschau, «Gebäude» antippen, «Heizprofil» verliert das Häkchen. Hilfe: Schritte, deren Angaben noch gültig sind, erledigt und antippbar lassen, damit man nach einer Korrektur direkt zurück springen kann.
- **P-3:** Beide Assistenten auf 390 × 844 öffnen. Auf Schritt 1 ist kein Feld sichtbar. Hilfe: auf dem Handy die Liste kompakter machen (z. B. nur «Schritt 1 von 5: Mieter» mit Balken und die Liste ausklappbar, oder die Schritte in einer Zeile) und die Einleitung kürzen, damit das erste Feld ohne Scrollen sichtbar ist.

## Nicht geprüft

- Speichern bzw. Schritt 5 («Prüfen» / «Erstellen»): laut Auftrag nichts speichern.
- Dunkelmodus, andere Sprachen: nicht Teil der Aufgabe.
- Echte Touch-Gesten wie Wischen; ich habe nur getippt und Auswahllisten benutzt.
