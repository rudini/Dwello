# Helga – Übersicht, Kachel «Gebäude und Wohnungen» (#731)

Desktop 1440 × 900, Zoom 150 % und 200 %, Maus. Demo-Daten, nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/d036809c-2108-59cb-a640-e365e2306855/scratchpad/helga-731/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht, Kachel «Gebäude und Wohnungen» | Die Erklärung zu «Gesperrt» sagt «Sie haben die Wohnung von Hand gesperrt …», aber nicht, wo man das tut oder wieder aufhebt. Ich habe mich gefragt: «Habe ich das gemacht? Wo denn?» Erst auf der Liste «Wohnungen» (mit Treffern) steht «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.» |
| P-2 | Minor | Wohnungen, Filter «Gesperrt» ohne Treffer (nach Klick auf «0 Gesperrt») | Die Seite zeigt nur «Keine Wohnungen gefunden – Keine Wohnung passt zu Ihrer Suche. Wählen Sie andere Filter oder zeigen Sie alle Wohnungen.» Das klingt, als hätte ich falsch gesucht. Dabei bestätigt die Seite nur, dass keine Wohnung gesperrt ist. Der Abschnitt «Was bedeutet der Mietstatus?», den die Liste mit Treffern hat, fehlt hier. |
| P-3 | Minor | Übersicht, Kachel «Gebäude und Wohnungen» | Dass man die Zahlen anklicken kann, sehe ich erst, wenn die Maus darüber ist: Dann wird das Feld grau hinterlegt und der Mauszeiger zur Hand. Ohne Maus darüber sehen sie aus wie gewöhnlicher Text (kein Pfeil, keine Unterstreichung). Fast hätte ich nicht gemerkt, dass ich «Gesperrt» öffnen kann. |

## Beobachtungen

- Die Kachel ist gut lesbar, bei 150 % und auch bei 200 %. Die Zahlen sind gross, die Erklärungen stehen direkt darunter, kein Tooltip, nichts quer zu scrollen (Seite ist bei beiden Zoomstufen nicht breiter als das Fenster).
- «Vermietet ab …» habe ich mit der Erklärung verstanden: Ein Vertrag für später ist schon unterschrieben. Die drei Punkte im Namen wirken aber unfertig, als fehle ein Datum. In der Kachel steht nirgends, ab wann.
- Meine Zahlen gehen auf: 9 Vermietet + 0 Vermietet ab … + 4 Leer + 0 Gesperrt = 13 Wohnungen. Bei mir ist also keine Wohnung «Vermietet ab …» und keine «Gesperrt». Das konnte ich direkt auf der Übersicht ablesen, ohne die Seite zu verlassen.
- Bei «Leer» steht in der Kachel keine Erklärung. Weiter unten steht bei den Gebäuden «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» Ob das auch für eine gesperrte Wohnung gilt, sagt mir die Seite nicht.
- Auf der gefilterten Seite gibt es keinen Link «Zurück zur Übersicht». Mit dem Zurück-Knopf des Browsers kam ich aber genau wieder an dieselbe Stelle der Übersicht, nicht oben an den Anfang. Das war angenehm.
- Die Klickfläche von «0 Gesperrt» ist gross (72 px hoch), gut für mich mit der Maus.

## Aufgabe geschafft: ja

Die Erklärungen auf der Übersicht reichen mir, um zu verstehen, was die beiden Wörter bedeuten und dass bei mir keine Wohnung so ist. Wie ich eine Wohnung sperre, steht dort nicht (P-1).

## Aufwand

Etwa 6 Minuten, 5 Schritte: Übersicht öffnen, zur Kachel scrollen, Erklärungen lesen, «0 Gesperrt» anklicken, zurück.

## Ablauf

- **Zahl «0 Gesperrt» suchen.** Erwartet: einen Knopf oder Link zum Öffnen. Gesehen: nur Zahl und Wort, erst beim Darüberfahren grau hinterlegt (P-3).
- **«0 Gesperrt» öffnen.** Erwartet: «Keine Wohnung ist gesperrt» und kurz, was gesperrt heisst. Gesehen: «Keine Wohnungen gefunden … Wählen Sie andere Filter», mit Knopf «Filter zurücksetzen» (P-2).
- **Zurück.** Erwartet: wieder oben auf der Übersicht anfangen zu müssen. Gesehen: Die Übersicht stand wieder bei der Kachel. Das war besser als erwartet.

## Vorschläge

- **P-1:** Übersicht öffnen und zur Kachel «Gebäude und Wohnungen» scrollen, dann die Erklärung zu «Gesperrt» lesen. Hilfreich wäre ein Halbsatz wie auf der Liste «Wohnungen»: «Gesperrt setzen und aufheben Sie beim Bearbeiten der Wohnung.»
- **P-2:** Auf der Übersicht «0 Gesperrt» anklicken (`/apartments?status=reserved`). Bei einem leeren Statusfilter wäre «Keine Wohnung ist gesperrt.» hilfreich, dazu der Abschnitt «Was bedeutet der Mietstatus?» wie auf der Liste mit Treffern, statt der Aufforderung, andere Filter zu wählen.
- **P-3:** Auf der Übersicht die Kachel ansehen, ohne die Maus darüber. Ein kleiner Pfeil oder ein unterstrichenes Wort bei den Zahlen würde zeigen, dass man sie öffnen kann.

## Nicht geprüft

- Wie die Kachel aussieht, wenn eine Wohnung wirklich «Vermietet ab …» oder «Gesperrt» ist. Die Demo-Daten haben keine solche Wohnung, und ich sollte nichts speichern.
- Dunkler Modus und andere Sprachen: Sie gehörten nicht zur Aufgabe.
