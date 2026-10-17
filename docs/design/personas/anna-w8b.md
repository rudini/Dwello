# Anna – Tankbestand in der Vorschau (Runde w8b)

Persona: Anna, 29, zum ersten Mal Vermieterin, nach Monaten wieder in Dwello. Desktop 1440 × 900, Maus (zur Kontrolle einmal Mobile 390 × 844). Persona-Stack auf http://localhost:3300, Demodaten. Gespeichert habe ich nur im Gebäude «Alpenblick».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/57f5a1ca-407e-5441-98f4-66ca786359d9/scratchpad/anna-w8b/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau» (Alpenblick 2025, Endbestand 14’940.00) | Der Hinweis zum negativen Verbrauch steht in einem Kasten, der ihn verharmlost. Überschrift «Kosten im Vergleich zum Vorjahr» (gibt es noch andere Hinweise: «Möglicherweise fehlen Rechnungen»), darunter: «Ein Hinweis heisst nicht, dass etwas falsch ist: Vielleicht kommt die Rechnung später, oder der Lieferant rechnet anders ab.» Ein negativer Verbrauch ist aber sicher falsch. Ohne Bestätigung komme ich mit «Weiter» direkt zu «Entwürfe erstellen», obwohl die Vorschau «Kosten aller Abrechnungen CHF-3’563.17» zeigt und Kosten pro Mieter von CHF-1’460.27 und CHF-2’102.90. Auf Schritt 5 steht dazu nichts mehr. |
| P-2 | Minor | Schritt 4 «Vorschau», wenn auch andere Hinweise da sind | Der Tankbestand-Hinweis steht im selben Kasten wie «Kaminfeger: Keine Rechnung …» und «Kaltwasser: Rechnung für das 2. Halbjahr fehlt …». Der Kasten endet mit «Erfassen Sie fehlende Rechnungen – oder bestätigen Sie unten, dass alles stimmt.» und «Die Abrechnungen trotzdem erstellen». Ich hätte gedacht, dass ich mit dem Häkchen auch den Tankbestand als richtig bestätige. |
| P-3 | Minor | Schritt 4 «Vorschau», Hinweis Heizung | «Heizung: Der Endbestand ist CHF 8’268.00 höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände …»: Der Hinweis nennt weder den Stichtag noch den erfassten Wert (31.12.2025, CHF 14’940.00) oder die Werte von Anfangsbestand und Einkauf. Welcher Wert falsch ist, muss ich selbst ausrechnen. |
| P-4 | Minor | Link «Tankbestände prüfen» → Gebäudeseite Alpenblick | Der Link öffnet die Gebäudeseite oben. Der Abschnitt «Brennstoff im Tank oder Lager» liegt weit unten (etwa 1480 px, ausserhalb der ersten Bildschirmhöhe). Es gibt keinen Weg zurück zur Vorschau: Mit «Zurück» im Browser beginnt der Assistent wieder bei «Schritt 1 von 5» (die Auswahl bleibt, aber ich muss dreimal «Weiter» klicken). «Rechnung erfassen» hat dagegen einen Rücksprung (`returnTo`). |
| P-5 | Minor | Schritt 4 «Vorschau», «Abrechnungen pro Mietvertrag» | Bei jedem Mieter steht «Kosten CHF 3’740.27 (164 %) unter dem Akonto. Fehlen Rechnungen?». Die Ursache ist aber der Tankbestand, nicht fehlende Rechnungen. Negative Kosten («Kosten CHF-1’460.27») stehen ohne Erklärung da. |
| P-6 | Nit | Schritt 4 «Vorschau» | Negative Beträge sind als «CHF-3’563.17» / «CHF-1’460.27» geschrieben, also ohne Leerzeichen und mit dem Minus am «CHF». Leicht zu übersehen. |
| P-7 | Nit | Schritt 1 und 4, Musterhaus Zentrum 2026 | «Periode läuft noch» erklärt Akonto und fehlende Rechnungen, sagt aber nichts zum Tankbestand: Für 2026 fehlt der Endbestand 31.12.2026 noch, und das wäre für ein Gebäude mit Tankbestand gut zu wissen. |

## Beobachtungen

- Aufgabe 1: Die Vorschau 2026 für Musterhaus Zentrum fragt nicht nach einem Tankbestand per 31.12.2026 und verlangt deswegen auch keine Bestätigung. Den Tankbestand erwähnt sie gar nicht. Bestätigen musste ich nur wegen «Rechnungen fehlen» (für 2026 sind in Musterhaus keine Rechnungen erfasst): «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.»
- Vorschau 2026, Musterhaus: «Kosten CHF 0.00» bei allen vier Mietern. Der Anfangsbestand von CHF 2’257.20 (31.12.2025) zählt also offenbar nicht. Warum, weiss ich als Anna nicht. Das ist aber eher eine Fachfrage.
- Auf der Gebäudeseite speichert Dwello CHF 14’940.00 ohne jede Rückfrage, obwohl die Vorjahre bei CHF 1’536.00 und CHF 1’792.00 liegen (zehnmal so viel). Es kommt nur «Bestand gespeichert.».
- Der Lösch-Dialog ist gut: «Bestand vom 31.12.2025 löschen?», dazu was mit Abrechnungen passiert, die an diesem Tag enden oder am Tag danach beginnen.
- Es gibt keine Möglichkeit, einen Bestand zu bearbeiten. Einen Tippfehler korrigiere ich nur mit Löschen und neu Erfassen. Das ging, ist aber umständlich.
- Rundung: «Rückerstattung CHF 3’740.25» und daneben «Kosten CHF 3’740.27 … unter dem Akonto». Die 2 Rappen Unterschied kommen wohl von der Rappenrundung, sie fallen aber auf.
- «Entwurf gespeichert, 22:34» erscheint im Assistenten. Komme ich zurück, steht trotzdem Schritt 1 da. Was dieser «Entwurf» ist, bleibt unklar; ich könnte ihn auch mit den Abrechnungs-Entwürfen verwechseln.
- Auf Mobile (390 px) scrollt die Vorschau mit dem Hinweis nicht seitwärts.
- Nach der Korrektur auf 1494.00 ist der Hinweis weg. Die Vorschau zeigt «Kosten aller Abrechnungen CHF 5’669.75», Laura Keller «Nachzahlung CHF 170.15», Kevin Fischer «Nachzahlung CHF 219.60», und «Weiter» führt ohne Bestätigung zu «Entwürfe erstellen».

## Aufgabe geschafft: ja

Beide Aufgaben sind erledigt. Entwürfe habe ich keine erstellt.

## Aufwand

Etwa 20 Minuten, 13 Skriptläufe. Aufgabe 1: 4 Assistentenschritte. Aufgabe 2: zweimal Löschen und neu Erfassen, 2 Rechnungen erfasst (siehe unten), 5 Vorschauen.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, was als Nächstes zu tun ist. Gesehen: «Nebenkostenabrechnungen erstellen. Die Abrechnungsperiode 01.01.2025 – 31.12.2025 ist abgelaufen. Noch nicht abgerechnet: Alpenblick.» Gut.
2. **Abrechnungen erstellen, Schritt 1, Periode 01.01.2026–31.12.2026.** Erwartet: eine Warnung, dass 2026 noch läuft. Gesehen: «Periode läuft noch. Die Abrechnungsperiode ist noch nicht zu Ende. Die Abrechnungen zählen das Akonto aller Monate, auch der noch nicht bezahlten, und Rechnungen bis zum Ende der Periode fehlen noch. Erstellen Sie die Abrechnungen erst nach dem Ende der Periode.» Klar. (Mein erstes `fill()` hat das Datum nicht übernommen, beim Tippen ging es.)
3. **Schritt 2, Musterhaus Zentrum, Schritt 3 unverändert, Schritt 4 Vorschau.** Erwartet: vielleicht eine Frage nach dem Tankbestand 31.12.2026. Gesehen: keine. Nur «Periode läuft noch» und «Rechnungen fehlen» samt Bestätigungs-Häkchen. «Weiter» ohne Häkchen bleibt mit «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» auf Schritt 4 stehen. Danach habe ich abgebrochen.
4. **Gebäude Alpenblick.** Gesehen: 31.12.2023 CHF 1’536.00, 31.12.2024 CHF 1’792.00, 31.12.2025 CHF 1’494.00. 31.12.2025 gelöscht (Dialog siehe oben), dann 31.12.2025 mit 14940.00 erfasst. Erwartet: vielleicht eine Rückfrage. Gesehen: nur «Bestand gespeichert.».
5. **Vorschau 2025 Alpenblick (Tippfehler, erster Versuch).** Gesehen: der Heizungs-Hinweis (siehe P-3) im Kasten «Möglicherweise fehlen Rechnungen», zusammen mit Kaminfeger und Kaltwasser, und ein Bestätigungs-Häkchen. Ob das Häkchen wegen des Tankbestands oder wegen der Rechnungen nötig ist, sah ich nicht. Mit dem korrekten Wert 1494.00 kamen Kaminfeger und Kaltwasser ebenfalls, also stammte das Häkchen von ihnen.
6. **Zum Trennen 2 Rechnungen in Alpenblick erfasst:** «Kaminfeger Zurbuchen», 15.10.2025, CHF 290.00, Kaminfeger; «Gemeindewerke Interlaken», 31.12.2025, Leistungszeitraum 01.07.–31.12.2025, CHF 640.00, Kaltwasser. Danach Vorschau mit 1494.00: kein Hinweis, «Weiter» führt direkt zu Schritt 5.
7. **Tippfehler noch einmal (14940.00), Vorschau 2025.** Gesehen: nur der Kasten «Kosten im Vergleich zum Vorjahr» mit dem Heizungs-Hinweis, kein Häkchen. «Weiter» führt direkt zu «Schritt 5 von 5: Erstellen. Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt.» Wie gewünscht ohne Bestätigung, aber mit negativen Kosten (P-1). Screenshot `19-typo-isolated-preview.png`: gelber Kasten mit Warndreieck, darunter bei beiden Mietern ein gelbes «Fehlen Rechnungen?».
8. **«Tankbestände prüfen».** Erwartet: Ich lande beim Abschnitt Tankbestände. Gesehen: Die Gebäudeseite ist oben geöffnet, der Abschnitt nicht sichtbar. «Zurück» im Browser führt zu Schritt 1 (P-4).
9. **Korrektur auf 1494.00, Vorschau 2025.** Gesehen: kein Hinweis mehr, Nachzahlungen statt Rückerstattungen, keine Bestätigung nötig.

## Verwirrung

- «Kosten im Vergleich zum Vorjahr»: Der Tankbestand-Hinweis vergleicht nichts mit dem Vorjahr, er rechnet nur innerhalb von 2025.
- «Ein Hinweis heisst nicht, dass etwas falsch ist»: Beim Tankbestand ist ein negativer Verbrauch aber sicher falsch. Das widerspricht sich.
- «Endbestand», «Anfangsbestand», «Einkauf»: Auf der Gebäudeseite erklärt (dort steht die Formel «Anfangsbestand + Einkauf − Endbestand»), in der Vorschau nicht. Ohne Zahlen weiss ich nicht, welcher Einkauf gemeint ist.
- «Entwurf gespeichert» im Assistenten gegenüber «Entwürfe erstellen» am Schluss: zwei Bedeutungen von «Entwurf».

## Fehlerrisiken

- Nach dem «Ein Hinweis heisst nicht, dass etwas falsch ist» klicke ich «Weiter» und «Entwürfe erstellen» und habe dann Abrechnungen mit negativen Heizkosten. Prüfe ich die Entwürfe später nicht genau, gehen sie so an die Mieter.
- Mit anderen Hinweisen zusammen setze ich das Häkchen «Die Abrechnungen trotzdem erstellen» und glaube, damit sei auch der Tankbestand erledigt.
- Die Mieter-Hinweise «Fehlen Rechnungen?» schicken mich zur Rechnungssuche, obwohl die Ursache der Tankbestand ist.
- Beim Erfassen gibt es keine Plausibilitätsprüfung, also bemerke ich einen Tippfehler erst in der Vorschau.

## Vorschläge

- **P-1.** Reproduktion: Alpenblick, Bestand 31.12.2025 löschen, 31.12.2025 mit 14940.00 erfassen, dazu Rechnungen für Kaminfeger und Kaltwasser 2025 erfassen. Dann Abrechnungen erstellen, Periode 2025, Alpenblick, Vorschau. Hilfreich: Den negativen Verbrauch als eigenen Kasten mit eigener Überschrift zeigen, etwa «Tankbestand prüfen», ohne den Satz «Ein Hinweis heisst nicht, dass etwas falsch ist». Er sollte klar sagen, dass die Abrechnungen so negative Heizkosten hätten. Auf Schritt 5 den Hinweis noch einmal zeigen.
- **P-2.** Reproduktion wie P-1, ohne die zwei Rechnungen. Hilfreich: der Tankbestand-Hinweis getrennt vom Kasten «Möglicherweise fehlen Rechnungen», oder ein Satz beim Häkchen, dass es nur fehlende Rechnungen bestätigt.
- **P-3.** Reproduktion wie P-1. Hilfreich: die Zahlen nennen, etwa «Anfangsbestand 31.12.2024: CHF 1’792.00, Einkauf 2025: CHF 4’880.00, Endbestand 31.12.2025: CHF 14’940.00. Prüfen Sie vor allem den Endbestand vom 31.12.2025.»
- **P-4.** Reproduktion: Vorschau wie P-1, «Tankbestände prüfen» klicken, dann «Zurück» im Browser. Hilfreich: Der Link springt direkt zum Abschnitt «Brennstoff im Tank oder Lager», und die Gebäudeseite bietet einen Rücksprung zur Vorschau (wie `returnTo` bei «Rechnung erfassen»).
- **P-5.** Reproduktion wie P-1, Liste «Abrechnungen pro Mietvertrag». Hilfreich: Bei negativem Verbrauch statt «Fehlen Rechnungen?» auf den Tankbestand verweisen.
- **P-6.** Hilfreich: «CHF −3’563.17» mit Leerzeichen und echtem Minuszeichen schreiben.
- **P-7.** Reproduktion: Abrechnungen erstellen, Periode 01.01.2026–31.12.2026, Musterhaus Zentrum, Vorschau. Hilfreich: Hat ein Gebäude Tankbestände, ein Satz bei «Periode läuft noch», etwa «Den Tankbestand per 31.12.2026 erfassen Sie nach dem Ende der Periode.»

## Nicht geprüft

- Entwürfe mit falschem Tankbestand erstellen, also Schritt 5 «Entwürfe erstellen» abschliessen: nicht ausgeführt, damit in Alpenblick keine falschen Entwürfe zurückbleiben.
- Vorschau 2026 für Alpenblick: nicht angesehen, die Aufgabe nannte Musterhaus Zentrum.
- Andere Sprachen und Dark Mode: nicht Teil der Aufgabe.
- Ob CHF 0.00 Heizkosten in Musterhaus 2026 (ohne Endbestand) fachlich stimmen: eine Fachfrage, nicht für Anna.

Hinweis zu den Daten: In Alpenblick sind 2 Rechnungen von mir dazugekommen (Kaminfeger Zurbuchen CHF 290.00, Gemeindewerke Interlaken CHF 640.00). Der Bestand vom 31.12.2025 ist wieder CHF 1’494.00, aber als neuer Eintrag.
