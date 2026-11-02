# Marco – Slice 738: Gebäude wählen in «Abrechnungen erstellen» (Handy)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Nichts gespeichert.
Aufgabe: «Ich will schnell die Nebenkostenabrechnungen für letztes Jahr anfangen und die Gebäude wählen.»
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-738/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 2 «Gebäude», Gebäudekarten | Die Karten sind nicht gleich aufgebaut: Bei «Alpenblick» und «Seepark Residenz» steht «3 Wohnungen» / «4 Wohnungen» rechts neben der Adresse und quetscht sie auf drei Zeilen («Bergstrasse 8, / 3800 / Interlaken», «Seepark / Residenz»); bei «Musterhaus Zentrum» (und im Normalfall bei allen) rutscht die Anzahl Wohnungen unter die Karte, ganz links unter das Kästchen statt unter den Namen. Beim schnellen Überfliegen suche ich die Zahl jedes Mal an einer anderen Stelle. Nichts ragt aber heraus, kein seitliches Scrollen. |
| P-2 | Minor | Schritt 2 «Gebäude», Fehlerzustand | Die Meldung sagt zweimal «Laden Sie die Seite neu.» in einem fetten Block. Lade ich neu, lande ich wieder in Schritt 1 «Abrechnungsperiode» statt in Schritt 2; ich muss erneut «Weiter» tippen. Ausserdem kann ich ohne die Angabe «schon abgerechnet» einfach Gebäude wählen und weiter zu Schritt 3, ohne dass mir das nochmals gesagt wird. |
| P-3 | Minor | Schritt 2 «Gebäude», Karten bereits abgerechneter Gebäude | In «Seepark Residenz» und «Musterhaus Zentrum» steht je derselbe neunzeilige fette Text («Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung … Versendete Abrechnungen lassen sich nicht neu berechnen.»). Eine Karte wird so fast so hoch wie ein halber Bildschirm; die drei Gebäude brauchen auf dem Handy rund anderthalb Bildschirme. Die Kurzinfo oben («‹Alle Gebäude› lässt 2 Gebäude aus …») hätte mir gereicht. |

## Beobachtungen

- Seitenbreite bei 390 px: `scrollWidth` = 390, kein Element in `main` ragt rechts oder links hinaus, in beiden Zuständen. Name, Adresse, «n Rechnungen in der Abrechnungsperiode» und «n Wohnungen» sind in jeder Karte vollständig sichtbar, nichts abgeschnitten.
- Unter der Überschrift «Gebäude» ist eine leere Fläche von gut 100 px, bevor «Alle Gebäude» kommt. Dort steht unsichtbar ein Ladehinweis («Dwello zählt die Rechnungen …»), der seinen Platz auch nach dem Laden behält. Auf dem Handy wirkt das wie ein Loch.
- «Rechnungen in der Abrechnungsperiode» bricht in der Karte auf zwei Zeilen um («6 Rechnungen in der / Abrechnungsperiode»); lesbar, aber lang.
- Im Fehlerzustand fehlt die Rechnungszeile in den Karten ganz, die Meldung oben erklärt das. Die Meldung ist verständlich: ich weiss, was fehlt (Anzahl Rechnungen, ob schon abgerechnet) und was ich tun soll (neu laden).
- Im Ganzseiten-Screenshot steht der feste Kopf (Dwello-Leiste) mitten über dem Titel; das ist eine Eigenheit des Screenshots, beim Scrollen im Bildschirmausschnitt sitzt der Kopf korrekt oben.
- Schritt 3 beginnt mit einem sehr langen Erklärtext zu Heizprofil und Zählern; nicht Teil dieser Aufgabe.
- Lade ich in Schritt 3 neu, bleibe ich in Schritt 3; in Schritt 2 neu laden führt zurück zu Schritt 1 (siehe P-2).

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, je Durchgang 3 Schritte (Seite öffnen, «Weiter», Gebäude antippen), plus Neuladen im Fehlerzustand.

## Ablauf

- Schritt 2 öffnen (Normalfall). Erwartet: kompakte Liste mit drei Gebäudekarten direkt unter der Überschrift. Gesehen: erst eine leere Fläche unter «Gebäude», dann zwei der drei Karten mit je neun Zeilen fettem Text, Wohnungszahl links unter dem Kästchen (Screenshot `n-02-step2.png`).
- Schritt 2 mit fehlschlagenden Anfragen (`/api/invoices?…isValidUtilityCost=true` und `/api/statements/billed` mit 500). Erwartet: Karten gleich aufgebaut, nur ohne Rechnungszahl. Gesehen: brauner fetter Hinweis oben (verständlich), aber die Karten wechseln das Layout, Wohnungszahl teils rechts neben der Adresse, Adresse dreizeilig (Screenshots `f-02-step2.png`, `f-03-viewport.png`).
- «Laden Sie die Seite neu» befolgt (Anfragen danach wieder erfolgreich). Erwartet: wieder in Schritt 2, jetzt mit Zahlen. Gesehen: zurück in Schritt 1 «Abrechnungsperiode» (`f-07-reload-ok.png`); erst nach erneutem «Weiter» Schritt 2.
- Im Fehlerzustand «Alpenblick» gewählt und «Weiter». Erwartet: vielleicht ein Hinweis, dass Dwello nicht prüfen konnte, ob schon abgerechnet ist. Gesehen: direkt Schritt 3, kein Hinweis.

## Vorschläge

- **P-1:** Handy 390 px, `/statements/generate`, «Weiter»; Karten vergleichen (im Fehlerzustand deutlicher). Hilfreich: «n Wohnungen» immer an derselben Stelle, unter dem Namen und der Adresse in derselben Spalte wie der Text, nie daneben.
- **P-2:** Beide Anfragen mit 500 fehlschlagen lassen, Schritt 2 öffnen, neu laden. Hilfreich: die zwei Fehler in einem Satz zusammenfassen mit nur einem «Laden Sie die Seite neu» (oder einem Knopf «Erneut laden», der in Schritt 2 bleibt); beim Neuladen in Schritt 2 bleiben.
- **P-3:** Normalfall, Schritt 2. Hilfreich: in der Karte nur eine kurze Zeile («Schon abgerechnet: es entsteht keine neue Abrechnung»), der lange Erklärtext einmal oben bei «Alle Gebäude» statt in jeder Karte, und nicht fett.

## Nicht geprüft

- Speichern bzw. Erstellen der Entwürfe: laut Auftrag nichts gespeichert.
- Nur eine der beiden Anfragen fehlschlagen lassen: nicht verlangt, nicht probiert.
- Querformat und andere Handygrössen als 390 × 844.
