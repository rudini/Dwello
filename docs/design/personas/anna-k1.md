<!-- Persona run K1 on fc88fcf; screenshots stayed in the session's scratchpad -->

# Persona-Test K1: Anna, 29 – Vergessenes Vertragsende nachtragen, Abrechnung 2025 neu erstellen

**Persona:** Anna, 29, vermietet zum ersten Mal, öffnet Dwello nach Monaten wieder, ordnungsliebend, will jedes Wort verstehen. Fenster 1024 × 768 (Kit mit `viewport: 'desktop'` geöffnet, danach mit `page.setViewportSize` auf 1024 × 768 gesetzt). Heute: Montag, 12.10.2026. Nur Gebäude «Musterhaus Zentrum».

**Aufgaben:**

1. «Anna Schmidt aus der Wohnung 1.02 ist schon am 31.03.2025 ausgezogen, ich habe vergessen, es einzutragen. Tragen Sie es ein.»
2. «Erstellen Sie die Abrechnung 2025 für Anna Schmidt neu und prüfen Sie, ob sie stimmt.»

**Geänderte Daten:**

- Mietvertrag Anna Schmidt (Wohnung 1.02, Musterhaus Zentrum): über «Beenden» mit Vertragsende 31.03.2025 beendet (Kästchen «Der Mietvertrag endete am 31.03.2025.» bestätigt). Jetzt «Beendet», «Unbefristet, gekündigt auf den 31.03.2025»; in der Liste «01.06.2022 – 31.03.2025, gekündigt».
- Nebenkostenabrechnung **NK-11111111-2025-0002** (Entwurf, Anna Schmidt, 365 Mietstage, Rückerstattung CHF 6.50) über «Entwurf löschen und Mietvertrag beenden» **gelöscht**.
- Neue Nebenkostenabrechnung **NK-11111111-2025-0005** (Entwurf, Anna Schmidt, 01.01.2025 – 31.12.2025, 90 Mietstage, Heizprofil Heizung Mittelland, Verwaltungspauschale 3 %, Nachzahlung CHF 269.50) im Assistenten erstellt. Nicht versendet, kein PDF erstellt.
- Der Assistent «Abrechnungen erstellen» hat seinen Stand für Musterhaus Zentrum / 2025 gespeichert («Entwurf gespeichert»).
- Andere Gebäude, Verträge und Abrechnungen nicht verändert.

## Aufgabe geschafft

- **Aufgabe 1: Ja, mit einem Umweg.** Anna gibt im Dialog «Beenden» 31.03.2025 ein, bestätigt das Kästchen und erhält die Ablehnung. Sie versteht, *dass* ein Entwurf im Weg ist, aber nicht genau *warum* (M1). Sie öffnet zuerst den verlinkten Entwurf, um zu sehen, wem er gehört; dabei verliert sie den Dialog samt Eingaben (m2). Dort sieht sie «365 Mietstage» und versteht: «Die Abrechnung rechnet das ganze Jahr, das stimmt ja nicht mehr.» Zurück im Vertrag gibt sie alles nochmals ein und traut sich dann, «Entwurf löschen und Mietvertrag beenden» zu klicken, weil der Entwurf noch nicht versendet ist und der Text sagt, sie solle ihn danach neu erstellen.
- **Aufgabe 2: Ja, aber prüfen kann sie nur teilweise.** Der Assistent öffnet direkt mit Musterhaus Zentrum, 2025, Heizung Mittelland und 3 % (wie bei den anderen Abrechnungen). Dass sie hier richtig ist und was schon gewählt ist, steht auf dem Bildschirm aber nicht (M2). In der Vorschau stockt sie beim gelben Kasten «Es gibt schon Abrechnungen» und dem Pflicht-Kästchen «Die Abrechnungen trotzdem erstellen» (M3). Der neue Entwurf zeigt «90 Mietstage»; Anna rechnet 31 + 28 + 31 = 90 nach und ist zufrieden. Dass die Abrechnung nur bis 31.03.2025 geht, steht aber nirgends als Datum, oben steht weiter «Abrechnungsperiode 01.01.2025 – 31.12.2025» (m4). Das Heizprofil sieht sie mit Namen, kann aber nicht nachvollziehen, warum Heizung 8.22 % und Kaminfeger 8.5 % sind, während die anderen Flächenkosten 4.61 % haben (M4). Die Spalte «Betrag» ist bei 1024 px abgeschnitten (M5).

## Aufwand

- Aufgabe 1: «Mietverträge» → «Anna Schmidt» → «Beenden» → Datum tippen → Kästchen → «Mietvertrag beenden» (Ablehnung) → Link zum Entwurf (Dialog weg) → Browser zurück → «Beenden» → Datum → Kästchen → «Mietvertrag beenden» (wieder Ablehnung) → «Entwurf löschen und Mietvertrag beenden». Rund 14 Aktionen, gut 4 Minuten, davon viel Lesen im langen Dialog (er passt bei 768 px nicht ins Fenster, Titel oben abgeschnitten).
- Aufgabe 2: Assistent ist schon offen (Schritt 3) → zur Kontrolle «Zurück» (Schritt 2, Musterhaus Zentrum angehakt) → «Weiter» → «Weiter» → Vorschau, «Weiter» ohne Kästchen (Fehlermeldung) → Kästchen → «Weiter» → «Entwürfe erstellen» → über den Mietvertrag, «Dazu gehört» → «Nebenkostenabrechnungen» → NK-11111111-2025-0005. Rund 12 Aktionen, etwa 4 Minuten, plus 3 Minuten Nachrechnen.
- Gesamt rund 26 Aktionen, etwa 11 Minuten.

## Laut gedacht

1. *Übersicht.* Es geht um einen Auszug, also um den Mietvertrag. Links «Mietverträge». Anna Schmidt, Wohnung 1.02, «seit 01.06.2022, unbefristet, Laufend». Laufend stimmt nicht mehr. Draufklicken.
2. *Vertragsseite.* «Bearbeiten», «Beenden», «Löschen». Sie ist ausgezogen, also «Beenden».
3. *Dialog.* «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin.» Ich weiss nur, dass sie am 31.03.2025 raus ist; ich nehme an, das war auch der Termin. 31.03.2025 eingetippt, «Montag, 31. März 2025» erscheint. Darunter fett: «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr.» Ja, 2025 ist richtig, das ist ja mein Fehler. Kästchen «Der Mietvertrag endete am 31.03.2025.» Der Satz «Die Nebenkosten dieser Zeit trägt der Vermieter» – oh, also zahle ich seit April 2025 die Nebenkosten der leeren Wohnung. Gut zu wissen. Der Dialog ist so lang, dass der Titel oben aus dem Bild rutscht; ich muss im Dialog scrollen, um «Mietvertrag beenden» zu finden.
4. *Ablehnung.* Unter dem Kästchen erscheinen ein Link «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen», der Satz «Der Entwurf NK-11111111-2025-0002 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und ein roter Knopf «Entwurf löschen und Mietvertrag beenden». Erst darunter der rote Kasten «Das hat nicht geklappt – Die Nebenkostenabrechnung NK-11111111-2025-0002 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet.» Ich lese von oben nach unten: zuerst steht da «wird gelöscht» und ein roter Löschknopf, und ich weiss noch gar nicht warum. Erst im Kasten unten kommt der Grund. Und «mit den bisherigen Vertragsdaten berechnet» – was heisst das? Dass sie das ganze Jahr bezahlt? Wessen Abrechnung ist NK-…-0002 überhaupt?
5. Ausserdem steht unten immer noch der blaue Hauptknopf «Mietvertrag beenden». Soll ich den nochmals drücken? Im Kasten steht «Löschen Sie zuerst den Entwurf» – also muss ich das selbst irgendwo tun, oder macht es der rote Knopf? Ich lese zweimal, dann ist es klar: der rote Knopf macht beides.
6. *Link geöffnet.* Ich will sehen, was ich lösche. Die Seite wechselt, der Dialog ist weg. Abrechnung NK-11111111-2025-0002: «Anna Schmidt, Musterhaus Zentrum, Wohnung 1.02», Entwurf, «365 Mietstage», Rückerstattung CHF 6.50. Aha, die rechnet das ganze Jahr. Das ist falsch, die darf weg. Sie ist nicht versendet, also hat Frau Schmidt nichts bekommen. Rechts in der Tabelle ist die Spalte mit den Beträgen abgeschnitten («C…»).
7. *Zurück zum Vertrag.* Alles nochmals: «Beenden», Datum, Kästchen, «Mietvertrag beenden», gleiche Ablehnung. Jetzt traue ich mich: «Entwurf löschen und Mietvertrag beenden». Keine zweite Rückfrage, aber der Satz stand ja da.
8. *Assistent.* Plötzlich bin ich in «Abrechnungen erstellen», «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Keine Meldung, dass der Vertrag beendet und der Entwurf gelöscht ist. Ist das jetzt passiert? Und für welches Gebäude, welches Jahr? Die Schritte 1 und 2 sind nur zwei grüne Häkchen ohne Text. Ich klicke «Zurück»: Schritt 2, «Musterhaus Zentrum» angehakt, «1 von 3 gewählt». Gut. Das Jahr sehe ich erst in der Vorschau.
9. *Heizprofil.* Ein langer Hilfetext (Zählerstände, Heizkostenverteiler, ausserhalb von Dwello abrechnen). Ich verstehe die Hälfte. Gewählt ist «Heizung Mittelland (100%)», das Balkendiagramm zeigt Januar bis März 17.5 / 14.5 / 13.5 %. Vorher stand bei der alten Abrechnung auch «Heizung Mittelland», also passt es. Verwaltungspauschale 3, wie vorher. Ich ändere nichts. Dass diese Werte von den anderen Abrechnungen 2025 übernommen sind, sagt mir niemand, ich vermute es nur.
10. *Vorschau.* «Anzahl Abrechnungen 1», Anna Schmidt, Wohnung 1.02, Nachzahlung CHF 269.50, «Kosten CHF 269.48 (30 %) über dem Akonto.» 30 % mehr – erschrecke ich. Bisher bekam sie CHF 6.50 zurück, jetzt zahlt sie nach? Ah, Januar bis März ist ja Heizsaison. Vermutlich.
11. Gelber Kasten: «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen.» Und ein Kästchen «Die Abrechnungen trotzdem erstellen». Trotzdem? Mache ich etwas Doppeltes? Ich habe doch eben gelöscht. Zuerst «Weiter» ohne Kästchen: «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Unten steht nur Anna Schmidt, also kann nichts Doppeltes passieren. Kästchen, «Weiter».
12. *Schritt 5.* «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt. Es wird nichts verschickt.» Beruhigend. Darunter «Entwurf gespeichert, 17:48» – welcher Entwurf, die Abrechnung? Und auf der Uhr ist es fast 20 Uhr. «Entwürfe erstellen» → «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
13. *Prüfen.* Ich gehe über den Mietvertrag, «Dazu gehört» → «Nebenkostenabrechnungen». Es kommen alle 18 Abrechnungen, nicht nur die von Frau Schmidt; zum Glück steht ihre zuoberst. NK-11111111-2025-0005.
14. *Neuer Entwurf.* Oben: «Abrechnungsperiode 01.01.2025 – 31.12.2025». Hm, sollte nicht bis 31.03. stehen? Rechts unten: «Mietstage in der Abrechnungsperiode 90 Mietstage». Ich rechne: Januar 31, Februar 28, März 31 = 90. Stimmt. Akonto − CHF 900.00 = 3 × 300. Stimmt.
15. Anteile: Lift und Kehricht 4.11 %, Hauswart, Kaltwasser usw. 4.61 % – das ist ungefähr ein Viertel von früher (16.67 / 18.68 %), passt zu drei Monaten. Heizung 8.22 %, Kaminfeger 8.5 %. Warum ist Kaminfeger doppelt so hoch wie Hauswart, wo doch beide «Pro Fläche (m²)» heissen? Darunter steht «Heizprofil: Heizung Mittelland», aber nicht, wie viel davon auf Januar bis März fällt. Ich vermute, es kommt vom Heizprofil (17.5 + 14.5 + 13.5 = 45.5 % aus dem Diagramm im Assistenten), aber das musste ich mir zusammensuchen. Beim Kaminfeger bin ich mir nicht sicher, ob das ein Fehler ist.
16. Die Beträge der einzelnen Zeilen sehe ich nicht, die Spalte ist rechts abgeschnitten. Erst als ich die Tabelle seitlich verschiebe, kommen sie. Gesamt CHF 1’169.48, Nachzahlung CHF 269.50. Ich glaube, sie stimmt. Ganz sicher bin ich nur bei Tagen und Akonto.

**Versteht Anna die Ablehnung?** Teilweise. Sie versteht «da ist ein Entwurf im Weg, den muss ich löschen». Den eigentlichen Grund (der Entwurf rechnet Mietstage nach dem 31.03.2025) erschliesst sie erst auf der Abrechnungsseite aus «365 Mietstage». Die Reihenfolge (Löschknopf vor der Begründung) und der weiterhin angebotene Knopf «Mietvertrag beenden» verwirren sie.

**Traut sie sich, den Entwurf zu löschen?** Ja, nach einem Kontrollblick in den Entwurf. Entscheidend: «Entwurf» (nicht versendet) und «Erstellen Sie die Nebenkostenabrechnung danach neu.»

**Ergibt der Assistent Sinn?** Ja, sobald sie verstanden hat, wo sie ist. Gebäude, Jahr, Heizprofil und Pauschale sind richtig vorgewählt, aber nicht als «für Sie vorbereitet» erklärt. Der Hinweis «Es gibt schon Abrechnungen … trotzdem erstellen» passt nicht zu ihrer Lage und macht sie unsicher.

**Kann sie Tage und Heizprofil prüfen?** Tage: ja, über «90 Mietstage» und Nachrechnen; ein Datum «bis 31.03.2025» fehlt. Heizprofil: nur den Namen; wie es die Heizkosten auf Januar bis März verteilt, sieht sie auf der Abrechnung nicht.

## Befunde

### Blocker

Keine.

### Major

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Dialog «Mietvertrag von Anna Schmidt, Wohnung 1.02, beenden?» nach «Mietvertrag beenden» | Reihenfolge von oben: Link «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen», «Der Entwurf NK-11111111-2025-0002 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.», roter Knopf «Entwurf löschen und Mietvertrag beenden», erst darunter «Das hat nicht geklappt – … wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf …». Anna sieht den Löschknopf vor dem Grund; «bisherige Vertragsdaten» sagt nicht, was falsch wäre; «Löschen Sie zuerst» klingt nach einem eigenen Schritt; der Hauptknopf «Mietvertrag beenden» bleibt aktiv und führt nur zur selben Ablehnung. Die Nummer nennt keinen Mieter. | Begründung zuerst und konkret: «Der Entwurf der Abrechnung 2025 von Anna Schmidt (NK-11111111-2025-0002) rechnet Mietstage bis 31.12.2025. Nach dem 31.03.2025 wären sie falsch.» Dann Link, dann Folge, dann der rote Knopf. «Mietvertrag beenden» in diesem Zustand ausblenden oder sperren. |
| M2 | Assistent «Abrechnungen erstellen», Schritt 3, direkt nach «Entwurf löschen und Mietvertrag beenden» | Keine Bestätigung, dass der Vertrag beendet und der Entwurf gelöscht ist, kein Hinweis, warum der Assistent offen ist. Schritte 1 und 2 sind nur Häkchen ohne sichtbaren Text; Gebäude und Jahr sieht Anna erst über «Zurück» bzw. in der Vorschau. Dass Heizprofil und Pauschale von den anderen Abrechnungen 2025 übernommen sind, steht nirgends. | Hinweis oben: «Der Mietvertrag von Anna Schmidt endet am 31.03.2025. Der Entwurf NK-…-0002 ist gelöscht. Erstellen Sie die Abrechnung 2025 für Musterhaus Zentrum jetzt neu. Heizprofil und Verwaltungspauschale sind von den übrigen Abrechnungen 2025 übernommen.» Erledigte Schritte mit Wert beschriften («2025», «Musterhaus Zentrum»). |
| M3 | Assistent, Schritt 4 «Vorschau» | Gelber Kasten «Es gibt schon Abrechnungen – Für Musterhaus Zentrum gibt es in dieser Abrechnungsperiode schon 3 Nebenkostenabrechnungen.» und Pflicht-Kästchen «Die Abrechnungen trotzdem erstellen». Anna kam genau, um die fehlende zu ergänzen; «trotzdem» lässt sie fürchten, etwas doppelt zu erstellen. | In diesem Fall (nur fehlende Abrechnungen werden erstellt) kein Kästchen; neutral: «3 Mietverträge haben schon eine Abrechnung 2025 und bleiben unverändert. Neu erstellt wird nur: Anna Schmidt.» |
| M4 | Abrechnung NK-11111111-2025-0005, Kostenaufstellung | «Heizprofil: Heizung Mittelland» steht nur als Name. Heizung «8.22 %» und Kaminfeger «Pro Fläche (m²) … 8.5 %» neben Hauswart «Pro Fläche (m²) … 4.61 %». Anna kann nicht sehen, dass Januar–März 45.5 % der Heizkosten tragen, und hält den Kaminfeger-Anteil für einen möglichen Fehler (gleicher Schlüssel, doppelter Anteil). | Unter «Heizprofil» die Rechnung zeigen: «Heizung Mittelland: 01.01.–31.03.2025 = 45.5 % der Heizkosten». Bei Positionen, die nach Heizprofil verteilt werden, den Verteilschlüssel so beschriften («Pro Fläche (m²), nach Heizprofil»). |
| M5 | Abrechnungsseite (alter und neuer Entwurf), 1024 × 768 | Die Tabelle «Abrechnungspositionen» ist breiter als ihre Karte; die Spalte «Betrag» ist abgeschnitten («C…», «CH…») und nur durch seitliches Verschieben der Tabelle sichtbar. Gerade die Beträge braucht Anna zum Prüfen. | Tabelle ohne seitliches Scrollen: «Kosten des Gebäudes» und «Anteil» in eine Zelle stapeln oder die Seitenleiste («Mieter und Wohnung») bei dieser Breite unter die Tabelle stellen. |

### Minor

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Dialog «… beenden?» mit Vertragsende in der Vergangenheit, 768 px hoch | Mit Kästchen und Hinweisen ist der Dialog höher als das Fenster; der Titel rutscht oben weg, die Knöpfe liegen unter dem Rand. (Wie I4 m1, jetzt beim vergangenen Datum.) | Hilfetexte kürzen oder einklappen; Knopfzeile im Dialog fixieren. |
| m2 | Dialog, Link «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen» | Der Link ersetzt die Seite; Dialog, Datum und Kästchen sind danach weg und müssen neu eingegeben werden. | Link in neuem Tab öffnen oder die wichtigsten Angaben des Entwurfs (Mieter, Mietstage, Status) direkt im Dialog zeigen. |
| m3 | Mietvertrag Anna Schmidt, «Dazu gehört» → «Nebenkostenabrechnungen» | Die Adresse enthält `?contract=…`, die Liste zeigt aber alle «18 Abrechnungen» aller Mieter. | Liste auf diesen Mietvertrag filtern und den Filter sichtbar machen («Abrechnungen von Anna Schmidt»). |
| m4 | Abrechnung NK-11111111-2025-0005, Kopf | Oben «Abrechnungsperiode 01.01.2025 – 31.12.2025», die Mietdauer 01.01.–31.03.2025 steht nirgends als Datum; nur «90 Mietstage» klein in der Seitenleiste. Anna muss nachrechnen. | Zusätzlich «Mietdauer in der Periode: 01.01.2025 – 31.03.2025 (90 Tage)» im Kopf. |
| m5 | Assistent, Schritt 5 | «Entwurf gespeichert, 17:48» – «Entwurf» heisst hier der Stand des Assistenten, sonst eine Abrechnung. Die Uhrzeit ist UTC (Verlauf der Abrechnung zeigt 19:49). | «Eingaben gespeichert, 19:48» in Ortszeit. |
| m6 | Assistent, Vorschau | «Kosten CHF 269.48 (30 %) über dem Akonto.» erschreckt Anna, ohne Erklärung, dass Januar–März Heizmonate sind. | Bei Teilperioden ergänzen: «Höher, weil die Mietdauer in der Heizsaison liegt (45.5 % der Heizkosten).» |
| m7 | Liste «Mietverträge», Filter | Die Auswahlfelder sind bei 1024 px abgeschnitten («Alle Geb», «Alle Mietv»). | Filter umbrechen lassen oder breitere Felder. |

## Was gut ist

- Das Kästchen «Der Mietvertrag endete am 31.03.2025.» mit «Prüfen Sie das Jahr» und der Folge («Die Nebenkosten dieser Zeit trägt der Vermieter …») passt genau zu Annas Lage.
- Dwello beendet den Vertrag nicht still und lässt die falsche Abrechnung nicht stehen; ein Knopf erledigt Löschen und Beenden zusammen, die Folge ist vorher ausgeschrieben.
- Der Assistent öffnet mit dem richtigen Gebäude, Jahr, Heizprofil und Pauschale; Anna musste nichts wählen.
- Schritt 5 beruhigt: «Es wird nichts verschickt.»
- Der neue Entwurf stimmt bei Tagen (90) und Akonto (CHF 900.00), das Heizprofil ist auf der Abrechnung genannt.
- Die Vertragsseite zeigte zwischendurch «Abrechnung 2025 fehlt … Abrechnungen erstellen»; nach dem Erstellen ist der Hinweis weg. «Nächste Schritte» (Nachmieter, neue Adresse) helfen.
- Liste «Mietverträge» zeigt den Vertrag jetzt als «01.06.2022 – 31.03.2025, gekündigt» (J1 M1 hier nicht mehr beobachtet).

## Vergleich zu J1

| J1 | Jetzt (K1) |
|---|---|
| M1: Liste zeigte gekündigten Vertrag als «befristet» | **Behoben** für diesen Fall: «01.06.2022 – 31.03.2025, gekündigt», gleich wie die Vertragsseite. |
| I4 m1 / J1: Dialog bei 768 px zu hoch | **Weiterhin** bei vergangenem Datum (m1). |
| – | **Neu geprüft:** Ablehnung wegen Entwurf, «Entwurf löschen und Mietvertrag beenden», Assistent mit Vorauswahl, Heizprofil auf der Abrechnung. Ablauf funktioniert; Verständlichkeit der Ablehnung (M1), Orientierung im Assistenten (M2, M3) und Prüfbarkeit der Abrechnung (M4, M5) sind die Schwachstellen. |
