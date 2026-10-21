# Sven: Hauptzeile der Dwello-Website (landing-claim)

Desktop 1440 × 900, nur Tastatur, beurteilt über den Accessibility-Baum (`readOut`). Reihenfolge: B, A, C. Nichts gespeichert. Skripte und Bäume: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-landing-claim/`.

Was vor und nach der Überschrift kommt, ist in allen drei Varianten gleich (Diff der Bäume: nur die h1 unterscheidet sich). Davor: «Zum Inhalt springen», Logo-Link «Dwello, zur Startseite», Hauptnavigation (5 Links), Sprachnavigation (DE/FR/IT/EN), «Demo ansehen», dann im Hauptbereich der Text «Open Source · Gratis · Für die Schweiz». Danach: der Absatz «Dwello macht die Nebenkostenabrechnung für private Vermieterinnen und Vermieter. …», dann «Demo ansehen» und «So kommen Sie zu Dwello». Der Sprunglink springt korrekt in den Hauptbereich; das nächste Tab landet auf «Demo ansehen». Mit der Überschriften-Taste lande ich direkt auf der h1.

Das `<span>` in der h1 hört man nicht: Der Screenreader liest jede Variante als eine einzige Überschrift ohne Bruch. Gut so.

## Varianten

| Variante | h1, wie vorgelesen | angesprochen (1–5) | Wirkung (1 kalt – 5 warm) | Bemerkung |
| --- | --- | --- | --- | --- |
| B | «Überschrift Ebene 1: Ihre Nebenkostenabrechnung, ohne Excel und ohne Abo.» | 5 | 4 | Sagt sofort, was Dwello ist (ein Werkzeug für die Nebenkostenabrechnung) und was wegfällt. Das Komma gibt eine natürliche Atempause, danach zwei gleich gebaute Teile «ohne … und ohne …»: klingt wie gesprochen. «Ohne Abo» passt zu «Gratis» direkt davor; dafür höre ich «ohne Abo» kurz danach noch zweimal (Absatz «Kostenlos und ohne Abo», Liste «CHF 0.– ohne Abo») und «Ohne Excel» in der ersten h2 wieder. |
| A | «Überschrift Ebene 1: Ihre Nebenkostenabrechnung, einfach gemacht.» | 4 | 3 | Was Dwello ist, ist ebenso klar. «Einfach gemacht» ist aber eine Floskel: Das sagt jede Software, ich erfahre nichts. Kurz, flüssig, das Komma sitzt gut; endet etwas flach. |
| C | «Überschrift Ebene 1: Ihre Liegenschaft. Ihre Abrechnung. Ganz einfach.» | 3 | 3 | Drei Sätze, drei Punkte: Der Screenreader macht drei volle Pausen, das klingt abgehackt, wie ein Werbespot. Welche «Abrechnung» gemeint ist, erfahre ich erst im Absatz danach. Der Rhythmus wiederholt sich in der ersten h2 («Vier Schritte. Einmal im Jahr. Ohne Excel.»), so wirkt die Seite beim Durchspringen der Überschriften eintönig. «Liegenschaft» spricht mich als Eigentümer an, das ist der einzige warme Punkt. |

## Rangfolge

1. **B**: Die einzige Zeile, die mir beim ersten Hören einen konkreten Grund nennt, weiterzuhören.
2. **A**: Klar, was es ist, aber «einfach gemacht» verspricht nichts Bestimmtes.
3. **C**: Drei Pausen ohne Inhalt, und das Wort «Nebenkosten» fehlt in der Überschrift.

Ändern würde ich in B kein Wort der h1. Ich würde aber die erste h2 «Vier Schritte. Einmal im Jahr. Ohne Excel.» anpassen, damit «Ohne Excel» beim Springen durch die Überschriften nicht gleich zweimal kommt.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): Betonung und Pausenlänge habe ich aus dem Accessibility-Baum und der Zeichensetzung abgeleitet, nicht gehört.
- Die Seiten auf FR/IT/EN: nicht Teil der Aufgabe.
- Mobile Ansicht: nicht Teil der Aufgabe.
