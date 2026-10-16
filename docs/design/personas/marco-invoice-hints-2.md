# Marco – Hinweise zu Rechnungen im Abrechnungsassistenten (Handy), Lauf 2

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 mit Demodaten. Nur angeschaut, nichts erstellt und nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/527f7d77-0112-5cce-90a1-4063e5ce2c7e/scratchpad/marco-invoice-hints-2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Vorschau (Schritt 4), Hinweis «Rechnungen kurz nach der Abrechnungsperiode» → «Rechnung bearbeiten» | Der Hinweis nennt «Heizöl Oberland AG, 25.08.2025, CHF 4’880.00» und sagt: «Gehört eine davon zu dieser Abrechnungsperiode, erfassen Sie ihren Leistungszeitraum.» Tippe ich darauf, steht beim Leistungszeitraum: «Nicht für Lieferungen von Heizöl …: Deren Verbrauch zählt über den Tankbestand des Gebäudes.» Die beiden Texte widersprechen sich. Ich weiss nicht, was ich tun soll. |
| P-2 | Minor | Rechnung bearbeiten → zurück zum Assistenten | Es gibt keinen Weg zurück in den Assistenten. «Abbrechen» führt zur Rechnung (Detailseite), nicht in den Assistenten. Mit der Zurück-Taste des Browsers lande ich bei Schritt 1 von 5, nicht bei der Vorschau. Meine Angaben sind noch da, aber ich muss 3-mal «Weiter» tippen und wieder bis zu den Hinweisen scrollen. |
| P-3 | Minor | Vorschau, Hinweis «Rechnungen ohne Leistungszeitraum» | Der Text ist auf dem Handy 13 Zeilen lang, bevor die erste Rechnung kommt. Zusammen mit dem Tankbestand-Hinweis darüber ist die Vorschau etwa 4100 px hoch, also rund 5 Bildschirme. Die Rechnungen, um die es geht, sehe ich erst nach zweimaligem Scrollen. |
| P-4 | Nit | Vorschau, beide Hinweise | Die Titel «Rechnungen ohne Leistungszeitraum» und «Rechnungen kurz nach der Abrechnungsperiode» sind fett, aber keine Überschriften (im Accessibility-Baum nur «paragraph»). Unter «Möglicherweise fehlen Rechnungen» gilt dasselbe. Für mich auf dem Handy ist das kein Problem, aber man kann damit nicht von Hinweis zu Hinweis springen. |

## Beobachtungen

- Kein seitliches Scrollen: In Schritt 2, in Schritt 4 und auf «Rechnung bearbeiten» ist `scrollWidth` = 390.
- Die Rechnungen sind gut zu treffen. Jeder Link ist 48 px hoch und 232 px breit, mit 8 px Abstand zum nächsten. Die Schrift ist 16 px gross, die Links sind unterstrichen, und im Text stehen Lieferant, Datum und Betrag. Sie umbrechen auf zwei Zeilen (Screenshot `07-hint2-viewport.png`), lassen sich aber trotzdem gut lesen.
- Die blauen Info-Kästen heben sich gut vom gelben Tankbestand-Hinweis ab. Jeder hat ein Info-Symbol und einen eigenen Titel. Es hängt also nicht nur an der Farbe.
- Beim ersten Hinweis passt nicht jede Rechnung: «Winterdienst Oberland, 31.03.2025» hat die Beschreibung «Schneeräumung Januar bis März 2025», liegt also ganz in der Periode. Der Text sagt zwar nur «Gilt eine für mehr als diese Abrechnungsperiode …», aber ich musste die Rechnung zuerst öffnen, um das zu merken.
- Nach der Rückkehr zeigt der Assistent «Entwurf wiederhergestellt – Ihre Angaben … sind wieder da». Das hat mich beruhigt: Periode und Gebäude Alpenblick waren noch gewählt.
- Die Rechnung öffnet sich direkt zum Bearbeiten und nicht zuerst in der Detailansicht. Das finde ich praktisch. Der Satz «Bestehende Abrechnungen ändern sich dadurch nicht» oben auf der Seite beruhigt.
- Im Feld «Leistungszeitraum» steht gleich ein Beispiel. Die Felder liegen aber weit unten (etwa 1,5 Bildschirme nach dem Seitenanfang).

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 3 Skripte. Bis zur Vorschau: Menü, «Nebenkostenabrechnungen», «Abrechnungen erstellen», zwei Daten, Weiter, Alpenblick, Weiter, Weiter (etwa 9 Tipp-Aktionen). Dann zweimal scrollen bis zu den Rechnungen. Zurück vom Bearbeiten: Browser-Zurück plus 3-mal «Weiter» plus Scrollen.

## Ablauf

1. Menü → «Nebenkostenabrechnungen» → «Abrechnungen erstellen». Erwartet: Assistent. Gesehen: Schritt 1 von 5 (`02-step1.png`). Ok.
2. 01.01.2025 und 30.06.2025 eingetippt, «Weiter». Gesehen: Schritt 2 mit «Alpenblick … 3 Rechnungen in der Abrechnungsperiode, 3 Wohnungen» (`03-step2.png`). Ok.
3. Alpenblick angetippt, «Weiter», «Weiter». Erwartet: Vorschau mit zwei Hinweisen. Gesehen (`05-step4.png`, ganze Seite): 2 Abrechnungen, CHF 1’079.86. Dann ein gelber Kasten «Möglicherweise fehlen Rechnungen» zum fehlenden Tankbestand und danach die zwei blauen Kästen:
   - «Rechnungen ohne Leistungszeitraum» mit Winterdienst Oberland (31.03.2025, CHF 920.00), BKW Energie AG (30.06.2025, CHF 182.60) und Gemeinde Interlaken (30.06.2025, CHF 470.00);
   - «Rechnungen kurz nach der Abrechnungsperiode» mit Heizöl Oberland AG (25.08.2025, CHF 4’880.00).
   Erwartung erfüllt.
4. Lesbarkeit geprüft (`06-hint1-viewport.png`, `07-hint2-viewport.png`): Schrift gross genug, guter Kontrast. Der erste Text ist aber lang (P-3).
5. «Heizöl Oberland AG» angetippt. Erwartet: die Rechnung, wo ich den Leistungszeitraum eintrage. Gesehen: «Rechnung bearbeiten» für Heizöl Oberland AG. Der Hilfetext beim Leistungszeitraum sagt aber, dass er für Heizöl nicht gilt (`08-invoice-edit.png`, P-1).
6. Mit der Zurück-Taste des Browsers zurück. Erwartet: wieder die Vorschau an der gleichen Stelle. Gesehen: Schritt 1 von 5 mit «Entwurf wiederhergestellt» (`09-after-back.png`). Nach 3-mal «Weiter» war ich wieder in der Vorschau, und die Hinweise waren wieder da (P-2).
7. Nochmals mit «Winterdienst Oberland» versucht (`10-winterdienst-edit.png`) und dort «Abbrechen» getippt. Erwartet: zurück in den Assistenten. Gesehen: die Detailseite der Rechnung «Winterdienst Oberland» (`12-invoice-detail.png`) ohne Link zum Assistenten. Zurück käme ich nur über Menü → Nebenkostenabrechnungen → Abrechnungen erstellen.
8. Nichts gespeichert: «Änderungen speichern» war ausgegraut, ich habe nichts geändert.

## Verwirrung

- Heizöl: Soll ich jetzt einen Leistungszeitraum eintragen (so der Hinweis) oder nicht (so das Formular)? Und hat der Tankbestand-Hinweis oben mit dieser Rechnung zu tun? Der Zusammenhang wird nirgends erklärt.
- «Rechnungen kurz nach der Abrechnungsperiode»: Was heisst «kurz»? Der 25.08.2025 liegt fast zwei Monate nach dem 30.06.2025. Das ist für mich nicht «kurz».
- «Zählen mit dem ganzen Betrag»: Ich habe verstanden, dass es um die Verteilung auf das Halbjahr geht. Das Wort «zählen» ist aber etwas vage.

## Fehlerrisiken

- P-1: Folge ich dem Hinweis und trage bei der Heizöl-Lieferung 01.01.2025 – 30.06.2025 ein, fällt dann (vermutlich) ein Teil der CHF 4’880.00 in diese Abrechnung, obwohl das Heizöl über den Tankbestand abgerechnet werden müsste. Das kann die Mieter zu viel kosten.
- P-2: Wer nach dem Bearbeiten «Abbrechen» tippt, findet den Assistenten nicht mehr und bricht vielleicht ganz ab. Wer den Weg zurück zu mühsam findet, erstellt die Abrechnung vielleicht, ohne die anderen Rechnungen zu prüfen.

## Vorschläge

- **P-1**
  - Reproduktion: Handy 390 px → Abrechnungen erstellen → 01.01.2025 – 30.06.2025 → Alpenblick → Weiter → Weiter → im Kasten «Rechnungen kurz nach der Abrechnungsperiode» auf «Heizöl Oberland AG» tippen → Hilfetext beim Leistungszeitraum lesen.
  - Hilfreich: Brennstoff-Lieferungen (Heizöl, Gas, Pellets, Holz) in diesem Hinweis weglassen oder mit einem eigenen Satz zum Tankbestand verlinken, statt zum Leistungszeitraum. Das ist eine fachliche Frage (fach-reviewer).
- **P-2**
  - Reproduktion: wie oben, eine Rechnung antippen, dann «Abbrechen» oder die Zurück-Taste des Browsers.
  - Hilfreich: Kommt man aus dem Assistenten, auf «Rechnung bearbeiten» einen Link «Zurück zur Vorschau» anbieten. «Abbrechen» und «Speichern» sollten zurück in die Vorschau führen, bei der Rechnungsliste.
- **P-3**
  - Reproduktion: Vorschau wie oben, auf dem Handy bis zum Kasten «Rechnungen ohne Leistungszeitraum» scrollen.
  - Hilfreich: Einen kurzen ersten Satz voranstellen, zum Beispiel «Diese Rechnungen zählen ganz zu diesem Halbjahr. Gilt eine für länger, erfassen Sie ihren Leistungszeitraum.», die Rechnungen gleich darunter zeigen und die Erklärung dahinter.
- **P-4**
  - Reproduktion: Vorschau wie oben, Accessibility-Baum lesen: Die Titel der Hinweise sind «paragraph».
  - Hilfreich: Die Titel als Überschriften auszeichnen (Ebene 4 unter «Vorschau»).

## Nicht geprüft

- Speichern eines Leistungszeitraums und ob der Hinweis danach verschwindet: Das war laut Auftrag nicht erlaubt.
- Abrechnungen erstellen (Schritt 5): Das war ausdrücklich nicht Teil der Aufgabe.
- Andere Gebäude und andere Perioden.
- Dunkler Modus.
- Andere Sprachen: Die Sprache ist am Konto gespeichert, und andere Personas laufen gleichzeitig.
