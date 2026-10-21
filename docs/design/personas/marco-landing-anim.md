# Marco – zwei Animationen auf der Dwello-Website (Handy)

Persona: Marco, 38, fast nur am Handy, wenig Zeit. Viewport 390 × 844, Touch (persona-kit `open({ viewport: 'mobile' })`), statische Seite http://localhost:3310/index.html und /it/index.html. Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-landing-anim/` (`run.mjs`, `run2.mjs`, `run3.mjs`, `de-*.png`, `it-*.png`).

**Mein Urteil (1–5):**

| Frage | Note |
|---|---|
| Erklärt es schnell etwas? | 4 |
| Lohnt sich das Tippen? | 3 |
| Lesbar am Handy? | 4 |
| Wirkt die Seite jetzt wärmer? (1 = kühl, 5 = warm) | 3 |

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Beide Animationen | Vor dem Tippen steht schon das Endbild da (ausgefüllte Rechnung mit «Bitte prüfen», sechs Kacheln mit 281.67). Wer das Bild schon sieht, merkt nicht, dass Tippen noch etwas zeigt; nach dem Abspielen sieht es wieder gleich aus. |
| P-2 | Minor | «Rechnungen per Drag & Drop» | Ein Ziehen sehe ich nicht: Das Dokument blendet sich nur ein und rutscht ein paar Pixel nach unten, dann erscheinen die Felder. Schritt 3 «Sie prüfen die Angaben und bestätigen» kommt in der Animation nicht vor (sie hört bei «Bitte prüfen» auf), und die nummerierten Schritte darüber werden beim Abspielen nicht hervorgehoben. |
| P-3 | Minor | «Gerecht verteilt, auch im Winter.» | Die Animation zeigt nur, wie der Lift gleichmässig pro Einheit verteilt wird. Den Teil «im Winter» (Heizprofil, Januar zählt mehr als der Sommer), den die Überschrift verspricht, zeigt sie nicht. |
| P-4 | Nit | «Gerecht verteilt, auch im Winter.» | Die Beträge in den Kacheln (281.67) sind 14 px, normales Gewicht, grau (rgb 63,74,84) auf hellgrau, in Kacheln von gut 55 px Breite. Ich kann sie lesen, aber nur, wenn ich genau hinschaue. |

## Beobachtungen

- Kein seitliches Scrollen: `scrollWidth` war beim Laden, nach 1 s, nach 2,5 s und am Ende immer 390 (de und it).
- Der Knopf funktioniert so, wie ich es erwarte: «Ablauf abspielen» bzw. «Verteilung abspielen» → «Anhalten» → «Weiter abspielen» → am Ende «Nochmals abspielen». Beim Anhalten bleibt das Bild wirklich stehen (Screenshot nach 1,5 s Pause: gleich wie davor, «Kaltwasser» halb eingeblendet). Weiter abspielen und nochmals abspielen klappen.
- Beim Tippen auf den Knopf springt die Seite so, dass die Animation oberhalb des Knopfes ganz sichtbar ist. Gut, ich muss nicht selbst scrollen.
- Texte in der Rechnungs-Animation: Beschriftungen 13 px, Werte 16 px fett, dunkle Schrift auf hellem Grund. Gut lesbar. «31.03.2025» ist braun und hat «Bitte prüfen» als Text-Abzeichen daneben, die Farbe ist also nicht die einzige Information.
- «Wasserversorgung Zürich» füllt die Kartenbreite fast ganz aus (Text endet bei etwa 362 px, Karte bei 374 px). Bei einem längeren Namen würde der Text umbrechen oder abgeschnitten.
- Wohnung 1.01 (Hans Müller) bekommt am Ende einen dickeren blauen Rahmen und eine blaue Nummer; der Text darüber nennt sie auch beim Namen.
- Mit «Bewegung reduzieren» (reduced motion) sind die Abspiel-Knöpfe weg, der erste Knopf auf der Seite ist dann «Kopieren». Das Endbild bleibt stehen. Finde ich vernünftig.
- Screenreader: Der Inhalt der Animation ist `aria-hidden`, nur der Knopf ist in der Figur zu hören; der Text daneben erklärt dasselbe. Das habe ich nur am Baum gesehen, nicht weiter geprüft.
- Italienisch: Die Knöpfe heissen «Riprodurre lo svolgimento» / «Riprodurre la ripartizione», dann «Pausa» und «Riprodurre di nuovo». Die Felder sind übersetzt («Emittente della fattura», «Importo», «Data», «Categoria», «Da verificare», «Acqua fredda», «Ascensore»). Ich sehe kein Deutsch ausser dem Firmennamen «Wasserversorgung Zürich» und «Musterhaus Zentrum», das sind Namen. Für mich als Deutschschweizer klingt der Infinitiv auf dem Knopf etwas steif, ob das so passt, kann ich nicht beurteilen. Auch auf Italienisch kein seitliches Scrollen, nichts abgeschnitten («Da verificare» passt neben das Datum).

## Aufgabe geschafft

Ja.

## Aufwand

Etwa 15 Minuten, 5 Skriptläufe (de dreimal, it einmal, ein Lauf für Einzelbilder), rund 25 Screenshots angeschaut.

## Ablauf

1. **Seite öffnen (de).** Erwartet: normale Landingpage. Gesehen: lädt, Breite 390, kein seitliches Scrollen.
2. **Abschnitt «Rechnungen per Drag & Drop» suchen.** Erwartet: ein Bild, das ich antippe. Gesehen: drei nummerierte Schritte, darunter eine Karte mit Dokument-Symbol und ausgefüllten Feldern (Wasserversorgung Zürich, CHF 930.00, 31.03.2025 mit «Bitte prüfen», Kaltwasser), darunter der Knopf «Ablauf abspielen» (`de-c1-before.png`). Ich dachte zuerst, das ist ein fertiges Bild (P-1).
3. **Tippen.** Erwartet: eine Rechnung wird hineingezogen. Gesehen: Die Felder leeren sich, das Dokument blendet sich blass ein und rutscht leicht nach unten (`de-c1-f1.png`, `de-c1-f3.png`). Nach 1 s erscheint «Wasserversorgung Zürich» halb durchsichtig (`de-a1-1s.png`), nach 2,5 s stehen Betrag und Datum, «Kaltwasser» wird gerade eingeblendet (`de-a1-2_5s.png`). Am Ende steht «Bitte prüfen» neben dem Datum, der Knopf heisst «Nochmals abspielen» (`de-a1-end.png`). Kein Ziehen, kein Bestätigen (P-2).
4. **Anhalten und weiter.** Erwartet: Bild bleibt stehen. Gesehen: «Weiter abspielen», Bild steht still (`de-a1-paused2.png`); weiter abspielen läuft bis zum Ende.
5. **Nochmals abspielen.** Erwartet: von vorne. Gesehen: von vorne, Knopf wieder «Anhalten» (`de-a1-replay.png`).
6. **Abschnitt «Gerecht verteilt, auch im Winter.»** Erwartet: etwas zu Heizkosten im Winter. Gesehen: Balken «Lift CHF 1'690.00», darunter sechs Kacheln 1.01 bis 3.02 mit je 281.67, 1.01 schon hervorgehoben, Knopf «Verteilung abspielen» (`de-a1-0-before.png`, oben im Bild).
7. **Tippen.** Gesehen: Die Kacheln verschwinden (`de-b2-700ms.png`), nach 1 s ist nur 1.01 da, blass (`de-a2-1s.png`), nach 2,5 s alle sechs (`de-a2-2_5s.png`), am Ende ist 1.01 blau umrandet (`de-a2-end.png`). Gleich wie vorher. Winter kommt nicht vor (P-3). Beträge klein und grau (P-4).
8. **Anhalten, weiter, nochmals.** Wie bei der ersten Animation, alles funktioniert.
9. **Italienische Seite, beide einmal abspielen.** Gesehen: gleicher Ablauf, Texte italienisch, «Pausa» beim Laufen, am Ende «Riprodurre di nuovo» (`it-b1-1s.png`, `it-b1-end.png`, `it-b2-end.png`). Breite 390.

## Verwirrung

- Ich habe beim ersten Hinsehen nicht gemerkt, dass die Karte eine Animation ist, weil sie schon fertig dasteht. Erst der Knopf darunter hat es verraten.
- «Drag & Drop» in der Überschrift, aber ich sehe kein Ziehen. Am Handy ziehe ich ohnehin keine Dateien, dort wäre «Hochladen» das Wort, das ich kenne.
- «auch im Winter» und dann ein Lift: Da habe ich etwas zu Heizkosten erwartet.

## Fehlerrisiken

- Wer nur das Standbild ansieht, verpasst die Animation (P-1); das ist harmlos, aber dann bringt sie nichts.
- Ein längerer Rechnungssteller-Name in einer anderen Sprache oder bei einem anderen Beispiel würde an der rechten Kartenkante anstossen.

## Vorschläge

- **P-1:** Seite öffnen, zu «Rechnungen per Drag & Drop» bzw. «Gerecht verteilt» scrollen: Das Endbild ist schon da. Hilfreich: im Ruhezustand den Anfang zeigen (leere Felder, eine noch nicht verteilte Lift-Rechnung) oder einen Satz neben dem Knopf, was das Abspielen zeigt.
- **P-2:** «Ablauf abspielen» tippen und die ersten 1,2 s verfolgen. Hilfreich: das Dokument sichtbar von aussen in die Karte bewegen und am Schluss einen kurzen Schritt «Bestätigt» zeigen; die gerade laufende Nummer 1/2/3 oben hervorheben, dann passen Liste und Bild zusammen.
- **P-3:** «Verteilung abspielen» tippen. Hilfreich: entweder ein zweiter Teil mit Heizkosten über die Monate (Januar mehr als Juli) oder die Überschrift so lassen und die Animation als «Beispiel: Lift pro Einheit» beschriften.
- **P-4:** Kacheln am Ende ansehen. Hilfreich: Beträge dunkler (Textfarbe wie die Wohnungsnummer) oder 16 px.

## Nicht geprüft

- Dunkler Modus: nicht verlangt, nicht angesehen.
- Französisch und Englisch: nur de und it laut Auftrag.
- Echtes Gerät, echte Wischgesten und Geschwindigkeit: nur Chromium mit Handy-Emulation; ob die Animation auf einem älteren Handy ruckelt, kann ich nicht sagen.
- Querformat und grössere Schrift am Handy: nicht verlangt.
- Was ein echter Screenreader ansagt: nur den Barrierefreiheitsbaum gelesen.
