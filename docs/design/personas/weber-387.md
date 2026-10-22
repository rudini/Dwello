# Dr. Weber, Slice 387: Heizprofil beim Nachholen einer Abrechnung nach Mieterwechsel

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Persona-Stack, Demo-Daten, `dwello_persona`). Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/weber-387/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Assistent «Abrechnungen erstellen», Schritt 3 (vom Mietvertrag aus) | Der Hinweis sagt nur «wie bei der bestehenden Nebenkostenabrechnung derselben Wohnung eingestellt», nennt aber weder die Abrechnung (NK-22222222-2025-0002, Sarah Meier) noch das Heizprofil. Ob die Vorbelegung stimmt, sehe ich erst in der Vorschau oder auf einer anderen Seite. |
| P-2 | Minor | Assistent, Schritt 3 | Wähle ich ein anderes Heizprofil (Heizung Tessin), steht der Hinweis «Beim Mieterwechsel ist das Heizprofil wie bei der bestehenden … eingestellt» unverändert da. Er stimmt dann nicht mehr. Auch nach «Zurück» aus der Vorschau steht er noch da, obwohl Tessin gewählt bleibt. |
| P-3 | Nit | Assistent, Schritt 4 «Es gibt schon Abrechnungen» | Die Warnung verlangt: «Damit alle Abrechnungen dieser Abrechnungsperiode gleich gerechnet sind, wählen Sie … dasselbe Heizprofil … wie bei den bestehenden Abrechnungen». Die bestehenden Abrechnungen haben aber verschiedene Heizprofile: Weber hat «Heizung Tessin», Meier und Bernasconi haben «Heizung + Warmwasser». Was heisst dann «dasselbe»? |

## Beobachtungen

- Die Vorbelegung stimmt. Vom Mietvertrag Brunner aus springt der Assistent direkt zu Schritt 3 und wählt «Heizung + Warmwasser». Das ist das Heizprofil von Meiers Abrechnung derselben Wohnung, nicht «Heizung Tessin» von Webers Abrechnung im Nachbarwohnung A1. Das gefällt mir.
- In der Vorschau mit «Heizung + Warmwasser» steht keine Warnung zu Webers Tessin-Abrechnung. Das ist richtig: Bei Weber wurde das Heizprofil nicht angewendet («nicht angewendet: Mietvertrag über die ganze Periode»).
- Wähle ich als Gegenprobe «Heizung Tessin», nennt die Vorschau Meiers Abrechnung mit Nummer und beiden Heizprofilen. Das ist klar.
- In diesen Demo-Daten ändert das Heizprofil am Ergebnis nichts. Die Fernwärme-Rechnungen sind quartalsweise. Der Mieterwechsel am 30.06./01.07. fällt genau auf eine Quartalsgrenze, also ist jeder Leistungszeitraum zu 100 % oder 0 % einer Mieterin zugeordnet. Mit Tessin hätte Brunner in der Vorschau ebenfalls CHF 1'342.47 bezahlt und CHF 97.55 zurückerhalten. Die ganze Warnung ist in diesem Fall also fachlich folgenlos. Ob die Vorbelegung eine falsche Summe verhindert, konnte ich hier nicht sehen (siehe «Nicht geprüft»).
- Spalte «Zeitanteil» bei Heizung: Dort stehen 43.86 % (Brunner) und 56.14 % (Meier). Das sind keine Tage, sondern Kostenanteile nach Heizprofil. Erklärt wird das erst in der Fussnote des PDFs («Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil»). Auf der Seite des Entwurfs fehlt diese Erklärung.
- Die Schrittanzeige trennt Wörter mitten drin: «Abrechnun / gsperiode», «Verwaltung / spauschale» (Screenshot `22-wiz-land.png`).
- Am Kopf des Entwurfs steht «Abrechnungsperiode 01.01.2025 – 31.12.2025», obwohl Brunner erst ab 01.07. mietet. Ihr Mietverhältnis steht weiter unten und im PDF gleich unter dem Titel. Das passt so.
- Der Hinweis «Abrechnung 2025 fehlt» auf dem Mietvertrag führt mit «Abrechnungen erstellen» direkt richtig in den Assistenten. Nach dem Erstellen ist der Hinweis weg.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, rund 30 Schritte (Vorbereitung: 3 Löschungen, 1 Assistentenlauf; Hauptaufgabe: Mietvertrag, Assistent Schritt 3–5, Entwurf, PDF). Zusätzlich ein Gegenprobe-Lauf mit Tessin: Dafür habe ich den Entwurf NK-…-0007 gelöscht und danach als NK-22222222-2025-0008 neu erstellt.

## Ablauf

1. **Abrechnungsliste Seepark.** Erwartet: 4 Entwürfe 2025. Gesehen: Weber (0001), Meier (0002), Brunner (0003), Bernasconi (0004), alle Entwurf. Meier und Brunner zeigen unter Heizung pro Quartal «Anteil nach Heizprofil» 100 % bzw. 0 %; Heizprofil «Heizung + Warmwasser».
2. **Entwurf Weber löschen.** Erwartet: Bestätigung mit Folge. Gesehen: Dialog «Die Abrechnung NK-22222222-2025-0001 von Thomas Weber wird gelöscht. Das lässt sich nicht rückgängig machen.», danach zurück zur Liste. Gut.
3. **Entwurf Brunner (0003) löschen.** Ebenso, ohne Probleme.
4. **Assistent mit Seepark, Heizprofil «Heizung Tessin».** Schritt 2 sagt: «Von 4 Mietverträgen … haben 2 schon eine Abrechnung». Schritt 3 zeigt die Monatsbalken von Tessin (Mai–Sep 0 %). Die Vorschau warnt: «NK-22222222-2025-0002, Sarah Meier: Erstellt mit dem Heizprofil «Heizung + Warmwasser», die neuen Abrechnungen mit «Heizung Tessin».» Es entstehen 2 Entwürfe (Weber 0006, Brunner 0005).
5. **Brunners neuen Entwurf 0005 löschen.** Ohne Probleme. Stand jetzt: Weber hat Tessin, Meier und Bernasconi haben «Heizung + Warmwasser», Brunner hat keine Abrechnung.
6. **Mietvertrag Brunner.** Erwartet: Hinweis auf die fehlende Abrechnung. Gesehen: «Abrechnung 2025 fehlt» mit Erklärung und dem Knopf «Abrechnungen erstellen».
7. **Knopf geklickt.** Erwartet: Assistent für Seepark 2025. Gesehen: direkt Schritt 3, Info-Kasten «Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025. Beim Mieterwechsel ist das Heizprofil wie bei der bestehenden Nebenkostenabrechnung derselben Wohnung eingestellt, die Verwaltungspauschale kommt aus den Einstellungen. Prüfen Sie beides …». Vorgewählt ist «Heizung + Warmwasser (100%)». Ich musste selbst schliessen, dass «bestehende Abrechnung derselben Wohnung» Meiers Abrechnung meint (P-1).
8. **Vertraue ich dem Vorschlag?** Meier und Brunner sollen mit demselben Profil gerechnet werden, sonst gehen Heizkosten verloren oder werden doppelt verrechnet. Der Vorschlag ist also richtig, und Webers abweichendes Profil spielt hier keine Rolle.
9. **Vorschau.** 1 Abrechnung, Brunner, 184 Mietstage, Akonto CHF 1'440.00, Kosten CHF 1'342.47, Rückerstattung CHF 97.55. Heizprofil «Heizung + Warmwasser». Keine Heizprofil-Warnung.
10. **Erstellen.** «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
11. **Entwurf prüfen und nachrechnen.** Heizung: Wohnungsanteil CHF 1'054.47 (82/320 m² von CHF 4'115.00). Brunner hat 1'054.47 × (395 + 1'410) / 4'115 = CHF 462.53. Meier hat 1'054.47 × (1'520 + 790) / 4'115 = CHF 591.94. Zusammen ergibt das CHF 1'054.47, also den ganzen Heizkostenanteil von A2. Die Zeile «Heizprofil: Heizung + Warmwasser» steht auf der Seite.
12. **PDF.** «PDF erstellen» erzeugt es. Die Kostenübersicht zeigt pro Leistungszeitraum die Monatsanteile des Heizprofils, zum Beispiel «33.20 % / 33.20 % = 100.00 %». Der Abschnitt «Heiz- und Warmwasserkosten» lautet: «Heizkosten nach Heizprofil «Heizung + Warmwasser» …». Den Hinweis auf Art. 8 Abs. 1 VMWG gibt es. Saldo Rückerstattung CHF 97.55, gleich wie in der Vorschau.
13. **Gegenprobe** (Entwurf gelöscht, nicht gespeichert): Vom Mietvertrag aus auf «Heizung Tessin» umgestellt. Der Hinweis in Schritt 3 blieb unverändert (P-2). Die Vorschau warnte korrekt mit Meiers Abrechnung. Die Summe blieb gleich (siehe Beobachtungen). Dann neu mit dem Vorschlag erstellt: NK-22222222-2025-0008, «Heizung + Warmwasser», CHF 462.53 Heizung, Rückerstattung CHF 97.55.

## Verwirrung

- «bestehende Nebenkostenabrechnung derselben Wohnung»: Welche denn? Hier gibt es nur eine (Meier). Gäbe es zwei Vormieter mit verschiedenen Profilen, wüsste ich nicht, welche gemeint ist.
- Den Text «dasselbe Heizprofil … wie bei den bestehenden Abrechnungen» kann ich nicht befolgen, wenn die bestehenden Abrechnungen unter sich verschieden sind (P-3).
- «Zeitanteil» in Prozent bei Heizung neben «184/365 Tage» bei den anderen Positionen: Das sieht aus wie ein Rechenfehler, bis man die PDF-Fussnote liest.
- Der lange Hilfetext zum Heizprofil (Zählerstände, Heizkostenverteiler, Entwürfe aller Mietverträge löschen) ist sorgfältig. Er ist aber ein einziger Absatz mit fünf Anweisungen.

## Fehlerrisiken

- Wer in Schritt 3 das Profil ändert, sieht oben weiterhin, es sei «wie bei der bestehenden» eingestellt. Wer die Vorschau überfliegt, erstellt dann womöglich eine Abrechnung mit einem anderen Profil als die Vormieterin. Bei Rechnungen, deren Leistungszeitraum über den Mieterwechsel geht, summieren sich die beiden Anteile dann nicht mehr auf 100 %.
- Die Warnung in der Vorschau ist der einzige Schutz. Erstellen bleibt ohne Bestätigung möglich.

## Vorschläge

- **P-1:** Schritte: Seepark 2025, Entwurf Brunner fehlt, Meiers Entwurf hat «Heizung + Warmwasser». Mietvertrag Brunner öffnen, «Abrechnungen erstellen» klicken, Schritt 3 erscheint. Hilfreich wäre ein Hinweis mit Namen, Nummer und Profil, etwa «Eingestellt ist «Heizung + Warmwasser» wie bei NK-22222222-2025-0002 von Sarah Meier (Wohnung A2).»
- **P-2:** Gleiche Schritte, dann im Feld Heizprofil «Heizung Tessin» wählen. Der Hinweis bleibt gleich. Hilfreich: Der Hinweis passt sich an, etwa «Sie haben ein anderes Heizprofil gewählt als bei der Abrechnung von Sarah Meier». Oder er verschwindet bei Abweichung, und die Warnung der Vorschau erscheint gleich in Schritt 3.
- **P-3:** Zustand wie oben (Weber Tessin, Meier «Heizung + Warmwasser»). Mit Tessin weiter zur Vorschau, dann «Es gibt schon Abrechnungen» lesen. Hilfreich: die Aufforderung auf die genannten Abrechnungen derselben Wohnung beziehen, etwa «wählen Sie dasselbe Heizprofil wie bei der Abrechnung der Vormieterin dieser Wohnung».

## Nicht geprüft

- Ein Fall, in dem das Heizprofil die Summe wirklich verändert, also eine Heizrechnung, deren Leistungszeitraum über den Mieterwechsel geht. In Seepark sind alle Fernwärme-Rechnungen quartalsweise. Rechnungen erfassen gehörte nicht zur Aufgabe.
- Den Fall mit zwei bestehenden Abrechnungen derselben Wohnung mit verschiedenen Profilen. Dafür hätte ich auch Meiers Entwurf neu erstellen müssen, und das war nicht Teil der Aufgabe.
- Den E-Mail-Versand. Der Entwurf sollte Entwurf bleiben.
- Andere Sprachen und mobile Ansicht: nicht Teil meines Profils.
