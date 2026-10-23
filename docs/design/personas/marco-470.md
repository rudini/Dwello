# Marco – #470: «Weiter» bleibt beim Entsperren an seinem Platz

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 mit Demodaten (`dwello_persona`). Nichts gespeichert: «Entwürfe erstellen» in Schritt 5 nicht gedrückt. Fragen zu vereinbarten Nebenkosten gab es in den Demodaten keine, also auch nichts beantwortet. Das Häkchen «Die Abrechnungen trotzdem erstellen» in Schritt 4 habe ich einmal gesetzt, um Schritt 5 anzusehen. Es bleibt nur im Browser und wird nicht gespeichert.
Langsame Verbindung nachgestellt: jede Antwort von `/api/statements/billed` und `/api/statements/agreements` 4 s verzögert (Playwright `page.route`, Verzögerung, kein Fehler). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/marco-470/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 3 «Heizprofil und Verwaltungspauschale» | Der Hinweis «Ohne vereinbarte Verwaltungspauschale» mit «Kevin Fischer, Wohnung OG1» steht jetzt unter «Weiter» und «Zurück». Am Handy wische ich, bis «Weiter» auftaucht, und tippe. Den Hinweis sehe ich so gar nicht, bei normaler Geschwindigkeit ist nicht einmal sein Anfang im Bild. Die Vorschau in Schritt 4 wiederholt ihn nicht («3 % … jedes Mieters mit vereinbarter Verwaltungspauschale»). Dass für Kevin Fischer keine Pauschale abgerechnet wird, erfahre ich also nie. |
| P-2 | Nit | Abrechnungen erstellen, Schritte 2 und 3 | Der Wartetext ist nur grauer Fliesstext mit «…» («Dwello zählt die Rechnungen …», «Dwello prüft, ob die Mietverträge …»), ohne Ladezeichen. Ich habe ihn verstanden, er fällt aber zwischen den anderen Erklärtexten wenig auf. |

Die eigentliche Korrektur funktioniert: In beiden Schritten trifft mein Tipp beim Entsperren «Weiter», und es wird nichts anderes angetippt (Details unter «Ablauf»).

## Beobachtungen

- **Position von «Weiter» vor und nach dem Entsperren (Bildschirmkoordinate, nachdem ich zum Knopf gewischt habe):**
  - Schritt 2: gesperrt y = 600, entsperrt y = 600. Auf der Seite rutscht der Knopf von 1391 auf 2179, weil darüber Rechnungszahlen und Hinweise erscheinen. Die Seite scrollt aber mit (scrollY 791 → 1579), deshalb bleibt er unter meinem Finger.
  - Schritt 3: gesperrt y = 600, entsperrt y = 600. Auf der Seite geht er von 2478 auf 2382, scrollY von 1878 auf 1782.
- Das Mitscrollen funktioniert auch, wenn ich die Scroll-Verankerung des Browsers abschalte (`overflow-anchor: none`, wie bei Safari ohne Verankerung): gleiche Werte. Es hängt also nicht nur an Chromium.
- **Dauertippen** (alle ~0,33 s auf die Stelle des Knopfs, durch das Entsperren hindurch): In Schritt 2 trafen 11 Tipps «Bitte warten …» (nichts passiert), der 12. traf «Weiter» und brachte mich zu Schritt 3. Die nächsten Tipps landeten dort auf dem Fliesstext zum Heizprofil, harmlos. In Schritt 3 trafen 7 Tipps den gesperrten Knopf, der 8. «Weiter» (Schritt 4), danach landeten sie auf der Zahl «2» bei «Anzahl Abrechnungen». Kein Gebäude angehakt, kein Link geöffnet, kein Seitenwechsel aus dem Assistenten. Die Probleme P-1 und P-2 aus #468 kommen nicht mehr vor.
- Ich kann während des Ladens schon ein Gebäude anhaken (Alpenblick, im ersten Bild sichtbar). Wählt man so ein schon abgerechnetes Gebäude, erscheint der Hinweis «Alle Mietverträge … haben schon eine Abrechnung» später oben ausserhalb des Bildes, während ich unten bei «Weiter» bin. Mit Alpenblick nicht relevant, nur bemerkt.
- Schritt 2, «Weiter» ohne gewähltes Gebäude: Die Seite springt hoch zur Gebäudeliste (Screenshot `s2-4-after-tap.png`: «Gebäude», «Alle Gebäude», Alpenblick, Seepark). Die Meldung «Bitte wählen Sie mindestens ein Gebäude.» steht aber ganz unten über «Weiter» und ist nicht im Bild. Ich sehe nur, dass ich nach oben geworfen wurde, nicht warum. Gehört nicht zu #470.
- Der Assistent hat jetzt 5 Schritte (Schritt 5 «Erstellen» mit «Entwürfe erstellen»). In Schritt 4 geht «Weiter» erst, wenn «Die Abrechnungen trotzdem erstellen» angehakt ist. Sonst steht «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Das ist klar.
- Der gesperrte Knopf ist hellgrau-blau mit «Bitte warten …» (`single-s3-2-locked.png`), der entsperrte kräftig blau. Der Unterschied ist gut zu sehen.

## Aufgabe geschafft: ja

Abrechnungen erstellen geöffnet, 01.01.2025–31.12.2025 (vorgeschlagen), Schritt 2 mit Alpenblick, Schritt 3, mit 4 s Verzögerung jeweils beim Entsperren auf den Knopf getippt. Ohne Verzögerung bis Schritt 5 angesehen, nicht gespeichert. «Weiter» mit offenen Fragen konnte ich nicht ausprobieren: Es gab keine Fragen (siehe «Nicht geprüft»).

## Aufwand

Etwa 20 Minuten. Pro Durchgang: 1 × «Weiter» (Schritt 1), 1 Häkchen, 2 × «Weiter» mit je rund 4 s Warten. Bis Schritt 5 dazu 1 Häkchen und 1 × «Weiter». Durchgänge: 1 × Einzeltipp beim Entsperren, 2 × Dauertippen (mit und ohne Scroll-Verankerung), 1 × Einzeltipp ohne Verankerung, mehrere schnelle Durchgänge ohne Verzögerung (auch mit den Perioden 2023, 2024 und 2026, um Fragen zu finden).

## Ablauf

1. **Schritt 1 «Abrechnungsperiode»:** Erwartet war das Vorjahr. Gesehen: 1. Januar 2025 bis 31. Dezember 2025 vorbelegt, «Weiter» unter dem Bildrand (y = 1142). Getippt.
2. **Schritt 2 «Gebäude», erstes Bild:** Erwartet hatte ich einen Hinweis aufs Laden. Gesehen (`s2-1-first-view.png`): «Schritt 2 von 5: Gebäude», Karte «Gebäude», darunter «Dwello zählt die Rechnungen und prüft die bestehenden Abrechnungen der Gebäude …» (y = 462), «Alle Gebäude 0 von 3 gewählt», Alpenblick. Ich sehe ohne Wischen, dass noch etwas läuft. «Bitte warten …» liegt bei y = 1209, nicht im Bild.
3. **Alpenblick angehakt, nach unten gewischt:** «Bitte warten …» bei y = 600, gesperrt. Tippen bewirkt nichts.
4. **Entsperren nach ca. 4 s, sofort auf dieselbe Stelle getippt:** Erwartet hatte ich nach #468, dass mir etwas unter den Finger rutscht. Gesehen (`single-s2-3-unlock.png`): «Weiter» steht genau dort, wo «Bitte warten …» war. Darüber liegt jetzt das Ende der Karte Musterhaus Zentrum mit dem langen Hinweis «schon eine Abrechnung». Der Tipp hat «Weiter» getroffen, Schritt 3 öffnet sich.
5. **Schritt 3 «Heizprofil und Verwaltungspauschale», erstes Bild** (`single-s3-1-first-view.png`): Überschrift, darunter «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …» (y = 478), dann «Heizprofil» mit langem Text. Das Laden ist ohne Wischen zu sehen. «Bitte warten …» bei y = 2328.
6. **Nach unten gewischt** (`single-s3-2-locked.png`): Verwaltungspauschale «3», «Noch nicht gespeichert …», grauer Knopf «Bitte warten …», «Zurück», Fusszeile.
7. **Entsperren, sofort getippt** (`single-s3-3-unlock.png`): «Weiter» bleibt bei y = 600. Neu ragt unter «Zurück» der Anfang eines blauen Kastens ins Bild: «Ohne vereinbarte Verwaltungspauschale – Bei diesen Mietverträgen ist keine …». Mein Tipp trifft «Weiter», Schritt 4 «Vorschau» öffnet sich. Den Kasten habe ich nur aus dem Augenwinkel gesehen und nicht gelesen.
8. **Dasselbe bei normaler Geschwindigkeit** (`fast-s3-weiter-at-bottom.png`): Ich wische, bis «Weiter» unten im Bild ist (y ≈ 780). Vom Hinweis ist nichts zu sehen, er liegt unter «Zurück». Erwartet hatte ich, dass ein Hinweis vor der Entscheidung kommt. Ich tippe «Weiter» und bin in der Vorschau, ohne zu wissen, dass Kevin Fischer keine Pauschale bezahlt.
9. **Ganzer Schritt 3** (`fast-s3-full.png`): Reihenfolge Heizprofil, Verwaltungspauschale, «Noch nicht gespeichert», «Weiter», «Zurück», dann der Kasten «Ohne vereinbarte Verwaltungspauschale. Bei diesen Mietverträgen ist keine Verwaltungspauschale vereinbart (Angabe beim Mietvertrag). Ihre Abrechnungen enthalten keine Pauschale (0 %). Steht im Mietvertrag eine, tragen Sie sie dort nach.» mit dem Link «Kevin Fischer, Wohnung OG1». Fragen zu vereinbarten Nebenkosten gab es keine (auch nicht mit Seepark und Musterhaus, nicht für 2023, 2024 und 01.01.–30.09.2026).
10. **Schritt 4 «Vorschau»:** 2 Abrechnungen, CHF 4’946.67, «Möglicherweise fehlen Rechnungen» (Kaminfeger, Kaltwasser 2. Halbjahr). Zur Verwaltungspauschale steht nur «3 % der eigenen Nebenkosten jedes Mieters mit vereinbarter Verwaltungspauschale». Ohne Häkchen gibt «Weiter» eine verständliche Meldung.
11. **Schritt 5 «Erstellen»:** «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt.», Knopf «Entwürfe erstellen». Hier aufgehört.

## Verwirrung

- Nach dem Entsperren steht über «Weiter» plötzlich anderer Inhalt als vorher (in Schritt 2 das Ende der Musterhaus-Karte statt der Gebäudeliste). Ich merke nicht, dass oben etwas Neues erschienen ist. Mit meiner Wahl Alpenblick schadet das nicht.
- Inhalt unter «Weiter» und «Zurück» erwarte ich am Handy nicht. Dort kommt normalerweise nur noch die Fusszeile. Der Kasten wirkt dort wie ein Nachtrag, nicht wie etwas, das ich vor dem Weitergehen lesen soll.
- «Bitte warten …» sagt nicht, worauf ich warte. Weil der Satz «Dwello prüft …» jetzt oben im ersten Bild steht, ist es aber verständlich.

## Fehlerrisiken

- P-1: Ein Mietvertrag ohne eingetragene Verwaltungspauschale wird ohne Pauschale abgerechnet, und ich merke es am Handy nicht. Wenn ich die Pauschale nur vergessen habe einzutragen, entgeht mir Geld. In der Demo wären das bei Kevin Fischer etwa 3 % von CHF 2’815.84. Korrigieren kann ich das nur mit «Neu berechnen» vor dem Versand, und auch das nur, wenn ich davon weiss.
- Wenn es Fragen zu vereinbarten Nebenkosten gibt und sie wie der Hinweis unter «Weiter» stehen, gilt dasselbe Risiko. Ob «Weiter» dann sperrt oder durchlässt, konnte ich nicht prüfen.

## Vorschläge

- **P-1:** Abrechnungen erstellen, 2025, Weiter, nur Alpenblick, Weiter. In Schritt 3 nach unten wischen, bis «Weiter» erscheint: Der Hinweis «Ohne vereinbarte Verwaltungspauschale» ist nicht im Bild, «Weiter» führt ohne ihn in die Vorschau. Hilfreich wäre eins davon:
  - In der Vorschau (Schritt 4) bei «Verwaltungspauschale» einen Satz zeigen wie «Ohne Pauschale: Kevin Fischer, Wohnung OG1». Dann kommt die Information vor dem Erstellen sicher noch.
  - Oder in Schritt 3 über «Weiter» einen kurzen Satz einfügen, Platz reserviert ab Beginn des Ladens, damit nichts springt («1 Mietvertrag ohne Verwaltungspauschale, siehe unten»).
  - Oder der Hinweis kommt bei der Verwaltungspauschale über dem Feld und hält seinen Platz schon während des Ladens frei.
- **P-2:** Abrechnungen erstellen mit verzögerten Antworten, Schritt 2 und 3 ansehen. Ein kleines Ladezeichen vor «Dwello zählt …»/«Dwello prüft …» würde zeigen, dass es kein normaler Erklärtext ist.

## Nicht geprüft

- **Fragen zu vereinbarten Nebenkosten** und «Weiter» bei offenen Fragen: In den Demodaten liefert `/api/statements/agreements` für alle drei Gebäude und die Perioden 2023, 2024, 2025 und 01.01.–30.09.2026 eine leere Liste (in den Netzwerkanfragen nachgesehen). Die Fragen erscheinen nie. Dafür müsste der Aufrufer einen Mietvertrag ohne vereinbarte Nebenkosten bereitstellen (SQL in `dwello_persona`). Wo die Fragen stehen, ob man sie ohne Wischen sieht und ob «Weiter» bei offenen Fragen sperrt, bleibt offen.
- Echtes iPhone/Safari und ein echter Daumen: Ich habe nur Chromium mit Touch-Emulation verwendet und Safari ohne Scroll-Verankerung mit `overflow-anchor: none` nachgestellt. Ob Safari das Mitscrollen der Seite gleich ausführt, ist nicht geprüft.
- Fehlschlag statt Verzögerung, Dunkelmodus, Querformat, andere Sprachen: nicht Teil der Aufgabe.
- Speichern («Entwürfe erstellen»): ausdrücklich nicht erlaubt.
