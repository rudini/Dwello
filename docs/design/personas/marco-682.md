# Marco – Listen, Suche und Filter (#682)

Persona: Marco, 38, Smartphone 390 × 844, Touch, wenig Zeit. App: Persona-Stack auf :3300 (Branch w-682), Demodaten. Nichts gespeichert (kein Gebäude zugeteilt, die Aufgabe ist nur Suchen).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| M-1 | Minor | Gebäude (Suche) | Die Hilfe sagt «Suchen Sie nach Name oder Adresse des Gebäudes.», aber die Adresse so, wie sie auf der Karte steht («Seeweg 15, 6003 Luzern»), findet nichts, und die PLZ «6003» allein auch nicht (weder in «Suche» noch in «Ort»). Nur Strasse, Hausnummer und Ort einzeln funktionieren. Wer eine Adresse aus einem Brief einfügt, landet bei «Keine Gebäude gefunden» und glaubt, das Gebäude fehle. |

## Beobachtungen

- Die neuen Rahmen um Suche und Filter sehen auf allen sechs Listen gleich aus (weisse Fläche mit Rand). Gut: Ich sehe sofort, wo der Filter aufhört und die Liste anfängt.
- Kein «(optional)» mehr bei den Feldern. Liest sich ruhiger.
- Die Überschrift «Rechnungen 21–40 von 83, Seite 2 von 5» sagt mir genau, wo ich bin. Auf dem Handy bricht sie in zwei Zeilen um, stört aber nicht. Bei einer einzigen Seite steht kurz «6 Rechnungen», auch gut.
- Nach «Suchen» und nach «Nächste Seite» springt die Seite zur Listenüberschrift. Das spart mir das Scrollen über den langen Rechnungsfilter (etwa ein ganzer Bildschirm hoch).
- Leere Suche: Es gibt genau einen Knopf «Filter zurücksetzen» (im Leerzustand), im Formular keinen zweiten. Mit Treffern und Filter in der Adresse steht «Filter zurücksetzen» unter «Suchen»; ohne Filter fehlt er. So wie angekündigt.
- «Filter zurücksetzen» auf Abrechnungen nimmt auch den Status (Kachel) weg, nicht nur Suche und Gebäude. Für mich richtig, aber nicht vorher erkennbar.
- Bei Abrechnungen mit nur Status-Kachel «Überfällig» gibt es zwei Wege zum Aufheben: «Filter aufheben» in der Kachel und «Filter zurücksetzen» im Formular. Hat mich nicht gestört.
- «Offene» Abrechnungen gibt es nicht als ein Filter. Ich musste wissen, dass «Versendet» und «Überfällig» zusammen offen bedeuten, und beide nacheinander antippen; kombinieren geht nicht. Die Kacheln behalten das gewählte Gebäude, das ist gut. Nach «Suchen» springt die Seite zur Liste, die Kacheln sind dann oben ausser Sicht.
- Blättern: Nur «Vorherige Seite» / «Nächste Seite», nur unten. Bei 20 Rechnungen pro Seite ist eine Seite auf dem Handy rund 6700 px lang; für jede Seite scrolle ich ganz nach unten. Zur letzten Seite brauche ich vier Mal scrollen und tippen. Das hat mich am meisten Zeit gekostet.
- Seitengrösse je Liste verschieden: Wohnungen 12, Rechnungen 20, Abrechnungen 10.
- Leerzustände sind unterschiedlich formuliert: Wohnungen nennt meinen Suchbegriff und wo gesucht wird, Rechnungen «Versuchen Sie es mit anderen Filtern.», Abrechnungen «Versuchen Sie, Ihre Filter anzupassen.», Gebäude «… oder zeigen Sie alle Gebäude.», aber der Knopf heisst dann «Filter zurücksetzen», obwohl ich nur gesucht hatte. Auf Gebäude steht der Leerzustand in einem Rahmen, auf Rechnungen nicht.
- Das Ergebnis «6 Rechnungen» nennt nicht, wofür (Alpenblick, 2025); das sehe ich nur oben in den Feldern.
- Kein seitliches Scrollen bei 390 px auf allen sechs Listen.

## Aufgabe geschafft: ja

## Aufwand

Rund 12 Minuten. Rechnungen Alpenblick 2025: 3 Eingaben (Gebäude, Jahr, «Suchen»). Offene Abrechnungen Musterhaus Zentrum: Gebäude, «Suchen», hochscrollen, «Überfällig», «Versendet» (5 Schritte). Gebäude nach Strasse: 2 Schritte («Seeweg», «Suchen»). Leere Suche und zurücksetzen: 3 Schritte. Blättern bis Seite 4 von 5: 3 × ganz nach unten scrollen und tippen.

## Ablauf

- Gebäude: Ich erwartete, dass «Seeweg 15, 6003 Luzern» (so wie auf der Karte) das Gebäude findet. Gesehen: «Keine Gebäude gefunden». Auch «6003» allein nicht, «Seeweg» und «Luzern» schon (M-1).
- Abrechnungen: Ich erwartete einen Filter «Offen». Gesehen: nur Kacheln je Status; ich musste «Versendet» (0) und «Überfällig» (1) einzeln ansehen.
- Rechnungen blättern: Ich erwartete, eine Seite direkt wählen zu können oder den Wechsel auch oben zu finden. Gesehen: nur «Nächste Seite» ganz unten nach rund 20 Karten.

## Vorschläge

- M-1: `/buildings` öffnen, in «Suche» «Seeweg 15, 6003 Luzern» oder «6003» eingeben, «Suchen» tippen: «Keine Gebäude gefunden». Hilfreich: Die Suche auch über die PLZ und über die Adresse mit Komma laufen lassen (Wörter einzeln suchen, wie auf Wohnungen beschrieben). Sonst die Hilfe genauer machen, z. B. «Name, Strasse oder Ort».

## Nicht geprüft

- Dunkelmodus und andere Sprachen: nicht Teil von Marcos Aufgabe.
- Ein langes Gebäude-Blättern: Die Demodaten haben nur 3 Gebäude, die Seitenüberschrift mit «von … Seite» habe ich deshalb auf Rechnungen, Abrechnungen und Wohnungen geprüft.
- Mieter und Mietverträge haben nur eine Seite (10 bzw. 11 Einträge); dort habe ich nur Filter, Hilfe und Leerzustand gesehen.
