<!-- Persona run K2 on 0e3db29; screenshots stayed in the session's scratchpad -->

# Persona-Test K2: Anna trägt einen vergessenen Auszug nach

## Setup

- Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück zu Dwello, ordentlich, will jedes Wort verstehen.
- Fenster 1024 × 768 (Desktop-Chromium, angemeldet als «Vera Verwalter»), Sprache Deutsch, Demo-Daten.
- Datum im Test: Montag, 12.10.2026.
- Arbeitsbereich: nur Gebäude «Musterhaus Zentrum». Andere Tester arbeiteten gleichzeitig in anderen Gebäuden (in der Übersicht tauchten deren Änderungen auf, z. B. «Nachmieter für Wohnung B2 suchen»).
- Bedienung nur über die Oberfläche (Klicks, Eingaben, Bildschirmleser-Baum); kein Quellcode gelesen.

## Aufgaben

1. «Anna Schmidt aus der Wohnung 1.02 ist schon am 31.03.2025 ausgezogen, ich habe vergessen, es einzutragen. Tragen Sie es ein.»
2. «Erstellen Sie danach die Abrechnung 2025 für Anna Schmidt neu und prüfen Sie, ob sie stimmt (Zeitraum, Heizprofil, Verwaltungspauschale).»
3. «Steht die Wohnung 1.02 jetzt leer? Was sagt Dwello, was ich tun soll?»

### Weg durch die App

1. Übersicht → «Musterhaus Zentrum» → «Wohnung 1.02» (Vermietet, Aktueller Mieter Anna Schmidt) → «Mietvertrag von Anna Schmidt».
2. Mietvertragsseite: Knöpfe «Bearbeiten», «Beenden», «Löschen». Anna wählt **«Beenden»**, weil das Wort genau zu ihrem Anliegen passt («sie ist ausgezogen, der Vertrag ist zu Ende»). «Bearbeiten» wirkte riskanter: Ein Blick in das Formular (ohne Speichern) zeigt Mieter- und Wohnungsauswahl mit allen Mietern und Wohnungen aller Gebäude, da kann man aus Versehen etwas Falsches ändern.
3. Dialog «Mietvertrag von Anna Schmidt, Wohnung 1.02, beenden?»: Vertragsende 31.03.2025 eingetippt. Dwello zeigt «Montag, 31. März 2025», warnt «liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr» und verlangt das Kästchen «Der Mietvertrag endete am 31.03.2025.» mit der Folge «Seit dem 01.04.2025 gilt die Wohnung als nicht vermietet … Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.» Ohne Kästchen: «Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.»
4. Mit Kästchen auf «Mietvertrag beenden»: abgelehnt. Im Dialog erscheint rot «Das hat nicht geklappt – Die Nebenkostenabrechnung NK-11111111-2025-0002 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» Darunter (erst nach Scrollen im Dialog sichtbar) ein Link «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen», der Satz «Der Entwurf NK-11111111-2025-0002 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» und der Knopf «Entwurf löschen und Mietvertrag beenden».
5. Anna öffnet zuerst den Entwurf (in neuem Durchgang): Anna Schmidt, Wohnung 1.02, 01.01.–31.12.2025, 365 Mietstage, Heizprofil «Heizung Mittelland», Verwaltungspauschale 3 %, Saldo Rückerstattung CHF 6.50. Sie notiert sich Heizprofil und Pauschale.
6. Zurück, Dialog erneut ausgefüllt, «Entwurf löschen und Mietvertrag beenden». Dwello springt direkt in «Abrechnungen erstellen», Schritt 3 von 5, mit der Meldung «Entwurf NK-11111111-2025-0002 gelöscht. Der Mietvertrag von Anna Schmidt endet am 31.03.2025. Erstellen Sie jetzt die Nebenkostenabrechnung neu.» Schritt 3 zeigt «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2025 – 31.12.2025» und «Heizprofil und Verwaltungspauschale sind wie die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt.» Vorgewählt: Heizung Mittelland, 3 %, gleich wie im gelöschten Entwurf.
7. Schritt 4 «Vorschau»: Abrechnungsperiode 01.01.2025 – 31.12.2025, Anzahl Abrechnungen 1, Kosten CHF 1’169.48; gelber Hinweis «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue.» und Pflicht-Kästchen «Die Abrechnungen trotzdem erstellen». Liste: nur «Anna Schmidt, Wohnung 1.02, Kosten CHF 1’169.48, Nachzahlung CHF 269.50, Kosten CHF 269.48 (30 %) über dem Akonto».
8. Kästchen gesetzt, Schritt 5 «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.», «Entwürfe erstellen» → «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
9. Neue Abrechnung über die Mietvertragsseite gesucht («Dazu gehört → Nebenkostenabrechnungen»): Die Liste zeigt alle 17 Abrechnungen aller Gebäude, nicht nur die von Anna Schmidt. Anna findet ihre trotzdem zuoberst: NK-11111111-2025-0005.
10. Abrechnung NK-11111111-2025-0005 geprüft, «PDF erstellen» geklickt und das PDF gelesen.
11. Wohnung 1.02, Mietvertrag, Gebäude und Übersicht nachher angeschaut.

### Prüfung der neuen Abrechnung (Aufgabe 2)

| Punkt | Bildschirm | PDF | Stimmt? |
|---|---|---|---|
| Zeitraum Mieterin | Kopf: «Abrechnungsperiode 01.01.2025 – 31.12.2025»; unten «90 Mietstage» | «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.03.2025 (90 Mietstage von 365 Tagen)», Spalte «Zeitanteil 90/365 Tage» | ja, aber nur im PDF sofort lesbar |
| Heizprofil | Heizung Mittelland | Jan 17.50 %, Feb 14.50 %, Mär 13.50 % = 45.50 % | ja |
| Verwaltungspauschale | 3 % der Zwischensumme, CHF 34.06 | gleich | ja (3 % von 1’135.42) |
| Akonto | − CHF 900.00 | – 900.00 | ja (3 × CHF 300) |
| Anteile | Lift/Kehricht 4.11 % (16.67 % × 90/365), Fläche 4.61 %, Heizung 8.22 % | gleich | ja |
| Kaminfeger | Verteilschlüssel «Pro Fläche (m²)», Anteil **8.5 %** statt 4.61 % | Zeitanteil 45.50 % (wie Heizung) | rechnerisch nach Heizprofil, aber am Bildschirm unerklärt |
| Saldo | Nachzahlung CHF 269.50, Zahlungsfrist 11.11.2026 | gleich | ja |

## Geänderte Daten

Alles im Gebäude «Musterhaus Zentrum», Wohnung 1.02, Mieterin Anna Schmidt (Name vor jeder Änderung geprüft):

1. **Mietvertrag von Anna Schmidt** (`b0000001-0001-0001-0001-000000000002`): über «Beenden» Vertragsende 31.03.2025 gesetzt (vorher unbefristet, laufend). Jetzt «Unbefristet, gekündigt auf den 31.03.2025», Status «Beendet».
2. **Gelöscht:** Entwurf NK-11111111-2025-0002 (Anna Schmidt, 2025, Rückerstattung CHF 6.50), durch «Entwurf löschen und Mietvertrag beenden».
3. **Erstellt:** Entwurf NK-11111111-2025-0005 (Anna Schmidt, Wohnung 1.02, Periode 2025, 90 Mietstage, Heizung Mittelland, 3 %, Nachzahlung CHF 269.50), über den Assistenten «Abrechnungen erstellen» (nur diese eine Abrechnung entstand).
4. **PDF erstellt** für NK-11111111-2025-0005 («PDF erstellen»).

Nichts versendet, nichts in anderen Gebäuden geändert. Das Formular «Mietvertrag bearbeiten» wurde nur angeschaut, nicht gespeichert.

## Aufgabe geschafft

| Aufgabe | Ergebnis | Begründung |
|---|---|---|
| 1. Auszug eintragen | **ja** | «Beenden» führt sicher durch; die Ablehnung wegen des Entwurfs bietet die Lösung gleich mit an. Der Lösungsknopf liegt aber unter dem sichtbaren Bereich des Dialogs. |
| 2. Abrechnung neu erstellen und prüfen | **ja** (mit Umweg) | Dwello leitet direkt in den Assistenten mit den richtigen Einstellungen; Ergebnis stimmt. Der Zeitraum 01.01.–31.03.2025 steht aber nur im PDF; am Bildschirm muss Anna aus «90 Mietstage» rückrechnen. Die Liste über «Dazu gehört → Nebenkostenabrechnungen» war nicht gefiltert. |
| 3. Steht die Wohnung leer, was tun? | **teilweise** | Wohnung zeigt «Leer», Übersicht «Nachmieter für Wohnung 1.02 suchen». Aber Dwello sagt nicht, *seit wann* sie leer ist (seit 01.04.2025, über 18 Monate) und was das kostet; der Satz «endet am 31.03.2025» steht in der Gegenwart, und das Gebäude fehlt im Titel. |

## Aufwand

- Etwa 25 Klicks/Eingaben, 11 Bildschirme, rund 15 Minuten in Anna-Tempo (mit Lesen aller Hilfetexte).
- Zweimal den Beenden-Dialog ausgefüllt (einmal abgebrochen, um den Entwurf zuerst anzuschauen).
- Einmal im Dialog nach unten scrollen müssen, um den Lösungsknopf zu finden.
- Einmal die gefundene Abrechnung in einer ungefilterten Liste mit 17 Einträgen suchen.

## Laut gedacht

- «Ausgezogen – es gibt einen Knopf ‹Beenden›. Den nehme ich, ‹Bearbeiten› klingt nach allem Möglichen.»
- «‹Der letzte Tag des Mietverhältnisses, also der Kündigungstermin … auch wenn der Mieter früher auszieht.› Hm, sie ist am 31.03. ausgezogen. War das auch der Kündigungstermin? Ich nehme mal an, ja.»
- «Gut, dass Dwello das Jahr nachfragt und mir sagt, was ab dem 01.04.2025 gilt. ‹Die Nebenkosten dieser Zeit trägt der Vermieter› – also ich. Okay.»
- «‹Das hat nicht geklappt.› Oh nein, was habe ich falsch gemacht? … Ach so, ein Entwurf. ‹Löschen Sie zuerst den Entwurf› – muss ich jetzt woanders hin?» (Erst nach Scrollen:) «Ah, da unten ist ja ein Knopf, der beides macht.»
- «Was ist in diesem Entwurf drin? Wenn ich ihn lösche, sind dann meine Einstellungen weg? Ich schaue ihn lieber zuerst an.»
- «Nach dem Klick bin ich plötzlich bei ‹Abrechnungen erstellen›, Schritt 3. Wo sind Schritt 1 und 2? Ah, ‹Gewählt: Musterhaus Zentrum, 2025›. Und ‹wie die übrigen Abrechnungen eingestellt› – Heizung Mittelland, 3 %, genau wie vorher. Super.»
- «‹Es gibt schon Abrechnungen› und ich soll ‹trotzdem erstellen› ankreuzen? Mache ich etwas Verbotenes? Werden die anderen drei doppelt? … Unten steht nur Anna Schmidt, also wohl nicht.»
- «‹Entwurf gespeichert, 19:37›? Ich habe doch noch nichts erstellt. Welcher Entwurf?»
- «Die neue Abrechnung sagt oben ‹01.01.2025 – 31.12.2025›. Sie wohnte doch nur bis Ende März! … Unten ‹90 Mietstage›, und im PDF steht es richtig. Puh.»
- «Warum ist Kaminfeger 8.5 % und Hauswart 4.61 %, wenn beide ‹Pro Fläche› sind?»
- «Die alte hiess 0002, die neue 0005. Fehlen jetzt 0003 und 0004?» (Nein, das sind andere Mieter.)
- «Übersicht: ‹Nachmieter für Wohnung 1.02 suchen. Der Mietvertrag … endet am 31.03.2025.› Endet? Der ist doch längst vorbei. Und welche 1.02 – ich habe mehrere Gebäude.»

## Verwirrung inkl. Begriffe

Begriffe, die Anna nicht (sicher) versteht:

- **Kündigungstermin** (Hilfetext Vertragsende): Unterschied zu Auszugsdatum unklar.
- **Akonto**, **Akontobeiträge** (Wohnung, Mietvertrag, Abrechnung): ohne Erklärung am Feld.
- **Zusatzmiete** (Wohnung, Mietvertrag): was gehört dazu?
- **Heizprofil**: Hilfetext ist sehr lang (Zählerstände, Heizkostenverteiler, ausserhalb von Dwello abrechnen); Anna liest ihn zweimal und ist danach unsicher, ob Dwello für sie überhaupt taugt.
- **Verwaltungspauschale … der eigenen Nebenkosten jedes Mieters**: «eigene Nebenkosten» unklar.
- **Mietstage**: verständlich, aber kein Datum dazu.
- **Verteilschlüssel «Heizung (Fläche 70% / Einheit 30%)»**: «Einheit» heisst hier Wohnung, wird nicht gesagt.
- **«Entwurf»** doppelt belegt: Abrechnung im Status Entwurf und «Entwurf gespeichert, 19:37» im Assistenten (gespeicherte Eingaben).
- **«trotzdem»** im Pflicht-Kästchen klingt nach Regelverstoss, obwohl es genau der Weg ist, den Dwello vorgeschlagen hat.
- **«gekündigt auf den 31.03.2025»** auf dem Mietvertrag: Anna hat nichts gekündigt, sie hat einen Auszug eingetragen.

## Fehlerrisiken

- Lösungsknopf «Entwurf löschen und Mietvertrag beenden» liegt bei 1024 × 768 unter der roten Meldung ausserhalb des sichtbaren Dialogbereichs; wer nur die Meldung liest («Löschen Sie zuerst den Entwurf»), bricht ab und sucht die Abrechnung selbst.
- Vor dem Löschen sagt Dwello nicht, dass Frist und Bemerkungen des Entwurfs verloren gehen und welches Heizprofil / welche Pauschale er hatte; nur der Link zum Öffnen hilft.
- Die Mietvertragsseite verlinkt «Nebenkostenabrechnungen» mit `?contract=…`, die Liste zeigt aber alle Abrechnungen aller Gebäude, ohne Hinweis und ohne «Filter zurücksetzen». Anna könnte die falsche Abrechnung (z. B. eine andere Anna oder ein anderes Jahr) öffnen und versenden.
- Neue Abrechnung zeigt im Kopf und in der Liste 01.01.–31.12.2025; Anna könnte glauben, sie sei falsch, und sie erneut löschen.
- «Bearbeiten» des Mietvertrags hätte Mieter und Wohnung (aller Gebäude) änderbar gemacht; ein falscher Klick im Auswahlfeld verschiebt den Vertrag.
- Die Leerstandszeit 01.04.–31.12.2025 kostet die Vermieterin Geld; Dwello sagt das nur im Beenden-Dialog, danach nirgends mehr (Wohnung, Übersicht, Vorschau nur «Den Anteil leerer Wohnungen trägt der Vermieter»).

## Vorschläge

### Blocker

Keine. Alle Aufgaben liessen sich ohne fremde Hilfe abschliessen.

### Major

- **M1 – Lösungsknopf im Ablehnungsdialog nicht sichtbar.** Wo: Mietvertrag → «Beenden» → «Mietvertrag beenden» bei bestehendem Entwurf, 1024 × 768. Gezeigt: rote Box «Das hat nicht geklappt … Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» am unteren Dialogrand; Link, Folgetext und Knopf «Entwurf löschen und Mietvertrag beenden» erst nach Scrollen. Vorschlag: Nach der Ablehnung Fokus/Scroll auf den neuen Knopf; Meldung nicht als Fehler («Das hat nicht geklappt»), sondern als Hinweis mit Weg formulieren, z. B. «Für diesen Mietvertrag gibt es schon einen Abrechnungsentwurf 2025. Dwello löscht ihn und führt Sie danach zur neuen Abrechnung.»
- **M2 – Filter «contract» in der Abrechnungsliste wird ignoriert.** Wo: Mietvertrag von Anna Schmidt → «Dazu gehört» → «Nebenkostenabrechnungen» (`/statements?contract=b0000001-…-000000000002`). Gezeigt: «17 Abrechnungen» aller Gebäude und Mieter, Statuszähler 7/1/9/0 wie ungefiltert, kein «Filter zurücksetzen». Erwartet: nur die Abrechnungen dieses Mietvertrags (2024 und 2025 von Anna Schmidt).
- **M3 – Zeitraum der Mieterin fehlt am Bildschirm.** Wo: Abrechnung NK-11111111-2025-0005 (Kopf «Abrechnungsperiode 01.01.2025 – 31.12.2025», unten «90 Mietstage») und Abrechnungsliste («Wohnung 1.02 01.01.2025 – 31.12.2025»); ebenso Vorschau im Assistenten (pro Mietvertrag nur Kosten, kein Zeitraum). Das PDF sagt es richtig: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.03.2025 (90 Mietstage von 365 Tagen)». Vorschlag: Diesen Satz auch auf der Detailseite, in der Liste und in «Abrechnungen pro Mietvertrag» der Vorschau zeigen.
- **M4 – Leerstand nach dem nachgetragenen Auszug wird kaum erklärt.** Wo: Übersicht «Nachmieter für Wohnung 1.02 suchen – Der Mietvertrag von Anna Schmidt endet am 31.03.2025.»; Wohnung 1.02 «Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden.» Fehlt: «seit 01.04.2025 leer», Gebäudename im Titel, Vergangenheitsform («endete»), Hinweis, dass die Nebenkosten der Leerzeit die Vermieterin trägt. Vorschlag: «Wohnung 1.02 (Musterhaus Zentrum) steht seit 01.04.2025 leer. Suchen Sie einen Nachmieter …».

### Minor

- **m1 – Folge von «Entwurf löschen …» nur halb erklärt.** Wo: Beenden-Dialog nach der Ablehnung. Gezeigt: «Der Entwurf NK-11111111-2025-0002 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.» Fehlt: dass Dwello direkt in den Assistenten führt, dass Heizprofil und Pauschale übernommen werden und dass Frist/Bemerkungen des Entwurfs verloren gehen.
- **m2 – Pflicht-Kästchen «Die Abrechnungen trotzdem erstellen».** Wo: Assistent Schritt 4, nach dem Sprung aus dem Beenden-Dialog. Gezeigt: gelbe Warnung «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen» und Fehlermeldung ohne Kästchen. Für Anna wirkt der von Dwello selbst vorgeschlagene Weg wie ein Regelverstoss. Vorschlag: Wenn nur fehlende Abrechnungen entstehen, Text wie «Für 3 Mietverträge gibt es schon Abrechnungen; sie bleiben unverändert. Neu erstellt wird nur: Anna Schmidt.» ohne Pflicht-Kästchen.
- **m3 – «Entwurf gespeichert, 19:37» im Assistenten.** Wo: Schritt 5 «Erstellen», vor dem Klick auf «Entwürfe erstellen». Doppelte Bedeutung von «Entwurf» (gespeicherte Eingaben vs. Abrechnungsentwurf); die Uhrzeit weicht zudem von «Erstellt 12.10.2026, 21:37» auf der Abrechnung ab (vermutlich Browser-Zeitzone UTC im Test, bitte prüfen).
- **m4 – Kaminfeger-Anteil unerklärt.** Wo: Abrechnung NK-11111111-2025-0005, Tabelle «Abrechnungspositionen». Gezeigt: «Kaminfeger, Pro Fläche (m²), 8.5 %» neben «Hauswart, Pro Fläche (m²), 4.61 %». Am Bildschirm fehlt, dass Kaminfeger nach Heizprofil (45.50 %) zeitlich verteilt wird; im PDF steht es als Zeitanteil 45.50 %. Vorschlag: Spalte «Zeitanteil» wie im PDF auch am Bildschirm.
- **m5 – Neue Abrechnung ohne PDF, alter Entwurf hatte eines.** Wo: NK-11111111-2025-0005 direkt nach dem Erstellen: Knopf «PDF erstellen», in der Liste kein PDF-Link; der gelöschte Entwurf hatte «PDF erstellt» zur gleichen Minute wie «Erstellt». Uneinheitlich; Anna wusste nicht, ob sie etwas vergessen hatte.
- **m6 – «gekündigt auf den 31.03.2025».** Wo: Mietvertrag nach dem Beenden, «Vertragsende: Unbefristet, gekündigt auf den 31.03.2025»; Wohnung «01.06.2022 – 31.03.2025, gekündigt». Anna hat einen Auszug eingetragen, keine Kündigung. Wort und Hilfetext «also der Kündigungstermin» im Dialog sollten Auszug und Kündigungstermin klar unterscheiden.
- **m7 – Nach dem Sprung in den Assistenten verdeckt die Erfolgsmeldung den Hinweis «Gewählt: …».** Wo: Schritt 3 bei 1024 × 768; die Meldung «Entwurf NK-11111111-2025-0002 gelöscht …» liegt über dem blauen Info-Kasten.
- **m8 – Abrechnungsnummer springt von 0002 auf 0005.** Wo: Liste und Detail. Anna fragt sich, ob 0003/0004 fehlen. Kurzer Hinweis beim Löschen/Neu-Erstellen («Die neue Abrechnung bekommt eine neue Nummer») würde helfen.
- **m9 – Begriffe ohne Hilfe am Feld:** «Akonto», «Zusatzmiete», «Akontobeiträge», «eigene Nebenkosten», «Einheit» im Verteilschlüssel (Wohnung, Mietvertrag, Assistent Schritt 3, Abrechnung).
- **m10 – Heizprofil-Hilfetext zu lang.** Wo: Assistent Schritt 3. Ein Absatz mit Zählerständen, Heizkostenverteilern und «ausserhalb von Dwello»; Anna fühlt sich verunsichert. Vorschlag: Kurzsatz plus aufklappbare Details oder Hilfe-Seite.
