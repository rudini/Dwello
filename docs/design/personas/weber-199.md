# Persona-Review Dr. Weber, Slice 199: Wechsel der Abrechnungsperiode auf Juli – Juni

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus, Deutsch.
Lage: Einstellung «Abrechnungsperiode» steht auf «Juli – Juni» (in den Einstellungen so geprüft), die Abrechnungen 2025 (01.01.2025 – 31.12.2025) für Seepark Residenz bestehen als Entwürfe. Nichts gespeichert, nichts erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-199/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Assistent Schritt 2 «Gebäude» (Karte Seepark Residenz), Seite Mietvertrag Thomas Weber | «Steht die Abrechnungsperiode in Ihren Mietverträgen, informieren Sie die Mieter über den Wechsel.» Rechtlich zu schwach: steht die Periode im Mietvertrag, ist der Wechsel eine Vertragsänderung. Dafür braucht es die Zustimmung des Mieters oder eine einseitige Vertragsänderung auf dem amtlichen Formular mit Frist und Termin (Art. 269d OR). Nur «informieren» ist anfechtbar. Ohne gültige Änderung gilt weiter die vereinbarte Periode. |
| P-2 | Major | Seite Mietvertrag Thomas Weber («4 Abrechnungen fehlen»), auch Übersicht | Dwello legt die neue Periode Juli – Juni auch über die Vergangenheit. Für die Lücke 01.04.2022 – 31.12.2023 bietet es «01.07.2021 – 30.06.2022 abrechnen», «01.07.2022 – 30.06.2023 abrechnen» und «Kurze Abrechnungsperiode 01.07.2023 – 31.12.2023» an. Die bestehenden Abrechnungen 2024 und 2025 laufen aber nach Kalenderjahr: damals galt das Kalenderjahr. Ein Wechsel wirkt nicht rückwirkend. Direkt darunter steht der Hinweis zum Wechsel, als gelte er auch für diese alten Perioden. |
| P-3 | Minor | Assistent Schritt 2 → Schritt 4 «Vorschau» | Für 01.01.2026 – 30.06.2026 zeigt Schritt 2 bei Seepark «1 Rechnung in der Abrechnungsperiode». Die Vorschau sagt danach «Keine Rechnungen erfasst / Rechnungen fehlen». Die eine Rechnung ist «Fernwärme Q4 2025» (Rechnungsdatum 20.01.2026), und die steckt schon in der Abrechnung 2025. Bei 01.07.2025 – 30.06.2026 zählt die gesperrte Karte «7 Rechnungen», alle schon 2025 abgerechnet. |
| P-4 | Minor | Assistent Schritt 3 und 4 nach dem Link «Kurze Abrechnungsperiode … abrechnen» | Der Link springt direkt zu Schritt 3. In der Vorschau, also kurz vor dem Erstellen der kurzen Periode, steht kein Hinweis zum Wechsel und zu den Mietverträgen mehr. Wählt man 01.01.2026 – 30.06.2026 von Hand, kommt der Hinweis gar nie. |
| P-5 | Nit | Assistent Schritt 2, Karte Seepark | «Für Seepark Residenz gibt es schon Abrechnungen für 2025.» «2025» ist nach dem Wechsel mehrdeutig (Kalenderjahr oder 2025/26?). Besser die Periode nennen: «für 01.01.2025 – 31.12.2025». |
| P-6 | Nit | Seite Mietvertrag Thomas Weber | «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab; für 01.01.2026 – 30.06.2026, 01.07.2023 – 31.12.2023 gibt es noch keine Abrechnung.» Der Text sagt «eine» Abrechnung und «der» Abrechnungsperiode, nennt aber zwei Perioden. Welche Abrechnung welche Periode teilweise abdeckt, bleibt offen. |

## Beobachtungen

- Positiv: Die volle Periode 01.07.2025 – 30.06.2026 lässt sich für Seepark nicht wählen (Kästchen gesperrt, Karte grau). Das verhindert eine doppelte Abrechnung von Juli bis Dezember 2025. Den Grund nennt die Karte, die kurze Periode wird als Link angeboten. Sachlich stimmt das.
- Eine kurze Periode von 6 Monaten als Übergang ist zulässig (abgerechnet werden muss mindestens jährlich). Auch die Akonto-Beträge der Vorschau stimmen: Thomas Weber 6 × CHF 200 = CHF 1'200, Marco Bernasconi 6 × 260 = 1'560, Nina Brunner 6 × 240 = 1'440.
- Der Hinweis zu den Mietverträgen steht unter jeder gesperrten Gebäudekarte als lose Zeile ausserhalb der Karte. Er gehört optisch weder zur Karte darüber noch zur Karte darunter (Screenshot 04-step2-full.png).
- Im Barrierefreiheitsbaum von Schritt 2 erscheint der Satz «Für Seepark Residenz gibt es schon Abrechnungen …» nicht als eigener Text, nur das gesperrte Kästchen. Vielleicht hängt er als Beschreibung am Kästchen; das habe ich nicht geprüft (Sven).
- In der Fortschrittsleiste wird «Abrechnungsperiode» mitten im Wort umbrochen («Abrechnun / gsperiode»), «Verwaltungspauschale» ebenso («Verwaltung / spauschale»), bei 1440 px.
- Vorschau der kurzen Periode 01.07.2023 – 31.12.2023: Unter «Rechnungen kurz nach der Abrechnungsperiode» steht «Kabelanschluss 2024», ausgestellt am 31.01.2024. Die Rechnung gehört laut Beschreibung zu 2024 und ist in der Abrechnung 2024 enthalten. Wer ihr wie vorgeschlagen einen Leistungszeitraum gibt, riskiert eine Doppelverrechnung.
- Gebäudeseite «Tankbestand»: Der Text nennt weiter den 31.12. als Stichtag. Nach dem Wechsel wäre der 30.06. der passende Tag. Für Seepark (Fernwärme) ist das ohne Belang.
- Die Übersicht listet bei «Noch nicht abgerechnet» für Seepark dieselben rückwirkend geschnittenen Perioden wie die Vertragsseite (siehe P-2).

## Aufgabe geschafft: ja

Alle verlangten Stellen angesehen, den Links bis zur Vorschau gefolgt, nichts erstellt.

## Aufwand

Etwa 20 Minuten, 11 Durchläufe (Übersicht, Einstellungen, Schritt 1 und 2 für beide Perioden, Link zur kurzen Periode, Schritt 3, Vorschau, zurück zu Schritt 2, Rechnungen 2025/2026, Vertragsseite, Abrechnungsliste, Abrechnung 2025 von Thomas Weber, Vorschauen der drei alten Perioden).

## Ablauf

1. **Einstellungen.** Erwartet: «Juli – Juni» gewählt. Gesehen: so ist es. Der Hilfetext sagt «Vorgeschlagen wird jeweils die letzte abgelaufene Periode.»
2. **Assistent Schritt 1.** Erwartet: 01.07.2025 – 30.06.2026 vorgeschlagen. Gesehen: genau das, mit Wochentagen. Stimmt (heute ist der 19.10.2026).
3. **Schritt 2, Periode 01.07.2025 – 30.06.2026.** Erwartet: Dwello merkt die Überschneidung mit 2025. Gesehen: Seepark und Musterhaus gesperrt, Text «gibt es schon Abrechnungen für 2025 … Rechnen Sie die übrigen Tage in einer kurzen Abrechnungsperiode 01.01.2026 – 30.06.2026 ab.», Link und Hinweis zu den Mietverträgen. Sachlich gut, nur der Hinweis ist rechtlich zu kurz (P-1). Die Zahl «7 Rechnungen» weckt den Eindruck, es gebe etwas abzurechnen (P-3).
4. **Schritt 2, Periode 01.01.2026 – 30.06.2026 (zum Vergleich von Hand).** Erwartet: Seepark wählbar, Hinweis zum Wechsel wieder da. Gesehen: wählbar, «1 Rechnung in der Abrechnungsperiode», kein Hinweis zu den Mietverträgen (P-4).
5. **Link «Kurze Abrechnungsperiode 01.01.2026 – 30.06.2026 abrechnen».** Erwartet: Schritt 2 mit Seepark gewählt. Gesehen: direkter Sprung zu Schritt 3, «Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2026 – 30.06.2026». Praktisch, aber Schritt 2 mit dem Hinweis wird übersprungen.
6. **Vorschau.** Erwartet: die eine Rechnung aus Schritt 2. Gesehen: «Keine Rechnungen erfasst», Warnung «Rechnungen fehlen», 3 Abrechnungen, nur Rückerstattungen des ganzen Akontos. Widerspricht Schritt 2 (P-3). Nachgeprüft: «Fernwärme Q4 2025» steht in der Abrechnung NK-22222222-2025-0001 von Thomas Weber, die Vorschau hat also recht.
7. **Seite Mietvertrag Thomas Weber.** Erwartet: ein Hinweis auf die kurze Periode 2026. Gesehen: «4 Abrechnungen fehlen» mit vier Schaltflächen, drei davon in die Vergangenheit, im neuen Juli-Juni-Raster, obwohl die Abrechnungen 2024/2025 nach Kalenderjahr laufen (P-2). Darunter der Hinweis zum Wechsel (P-1). Vertragsbeginn 01.04.2022: dass 2022 und 2023 fehlen, stimmt an sich. Abgerechnet gehört das aber nach der damals geltenden Periode (Kalenderjahr).
8. **Vorschauen 01.07.2021 – 30.06.2022, 01.07.2022 – 30.06.2023, 01.07.2023 – 31.12.2023.** Erwartet: zumindest eine Warnung, dass damals eine andere Periode galt. Gesehen: normale Vorschau, keine Rechnungen, nur Rückerstattungen (z. B. Thomas Weber CHF 600 für 2021/22, CHF 2'400 für 2022/23), kein Wort zum Periodenwechsel.

## Verwirrung

- «Abrechnungen für 2025»: Kalenderjahr oder Abrechnungsjahr 2025/26? Nach dem Wechsel ist das nicht mehr eindeutig.
- «informieren Sie die Mieter»: Wie? Ein Brief? Das amtliche Formular? Reicht das? Für mich als vorsichtigen Vermieter ist die wichtigste Frage offen.
- «Eine bestehende Abrechnung deckt nur einen Teil der Abrechnungsperiode ab»: Welche Abrechnung, welche Periode?
- Warum Dwello «1 Rechnung» zählt und die Vorschau «keine» meldet, musste ich in der Rechnungsliste und in der Abrechnung 2025 nachsuchen.

## Fehlerrisiken

- Ein Vermieter folgt P-1 wörtlich, schreibt seinen Mietern eine formlose Mitteilung und rechnet ab Juli im neuen Rhythmus ab. Ficht ein Mieter das an, gilt die alte Periode weiter, und die Abrechnungen sind falsch abgegrenzt.
- Ein Vermieter rechnet die Lücke 2022/2023 über die angebotenen Schaltflächen im Juli-Juni-Raster ab (P-2). Dann stimmen die Perioden weder mit dem Vertrag noch mit den Abrechnungen 2024/2025 überein. Für die halbe Periode 01.07.2021 – 30.06.2022 ist das besonders heikel.
- Wegen der «1 Rechnung» in Schritt 2 hält man die kurze Periode für vollständig erfasst und bestätigt die Warnung der Vorschau mit «Die Abrechnungen trotzdem erstellen». Ergebnis: Abrechnungen ganz ohne Kosten.
- Der Vorschlag, der Rechnung «Kabelanschluss 2024» einen Leistungszeitraum in 2023 zu geben, kann zu einer Doppelverrechnung führen (Beobachtung).

## Vorschläge

- **P-1:** Assistent → Periode 01.07.2025 – 30.06.2026 → Schritt 2, Karte Seepark; oder Mietvertrag Thomas Weber. Hilfreich wäre ein Text wie: «Steht die Abrechnungsperiode in Ihren Mietverträgen, dürfen Sie sie nur mit Zustimmung der Mieter ändern oder mit dem amtlichen Formular für Vertragsänderungen, unter Einhaltung der Kündigungsfrist. Bis dahin gilt die vereinbarte Periode.» Fachlich prüfen lassen.
- **P-2:** Mietvertrag Thomas Weber öffnen und den Block «4 Abrechnungen fehlen» ansehen. Hilfreich wäre: Perioden vor dem Wechsel im bisherigen Rhythmus vorschlagen (hier 01.04.2022 – 31.12.2022 und 01.01.2023 – 31.12.2023), angelehnt an die bestehenden Abrechnungen. Oder zumindest ein Hinweis, dass ein Wechsel nicht rückwirkend gilt. Den Hinweis zum Wechsel nur zur Übergangsperiode setzen, nicht unter die alten Perioden.
- **P-3:** Assistent → 01.01.2026 – 30.06.2026 → Schritt 2 («1 Rechnung») → Weiter → Vorschau («Keine Rechnungen erfasst»). Hilfreich wäre: in Schritt 2 gleich zählen wie in der Vorschau (Leistungszeitraum vor Rechnungsdatum) oder abgerechnete Rechnungen nicht mitzählen. Bei der gesperrten Karte die Zahl weglassen.
- **P-4:** Schritt 2 → Link «Kurze Abrechnungsperiode … abrechnen» → Schritt 3 → Vorschau. Hilfreich wäre: den Hinweis zum Wechsel auch in der Vorschau der Übergangsperiode zeigen.
- **P-5:** Schritt 2, Karte Seepark. «… gibt es schon Abrechnungen für 01.01.2025 – 31.12.2025.»
- **P-6:** Mietvertrag Thomas Weber. Je Periode einen Satz, z. B. «01.01.2026 – 30.06.2026: Die Abrechnung 01.01.2025 – 31.12.2025 deckt nur den Anfang der Periode 01.07.2025 – 30.06.2026 ab.»

## Nicht geprüft

- Erstellen und das PDF einer kurzen Periode: kein Gebäude zum Speichern zugeteilt, laut Auftrag nichts erstellt.
- Ob und wie die Mietvertragsmaske eine vereinbarte Abrechnungsperiode erfasst: Dort habe ich kein solches Feld gesehen (nur die Detailseite angeschaut, die Bearbeitungsmaske nicht geöffnet). Ob Dwello also wissen kann, ob die Periode im Vertrag steht, bleibt offen.
- Andere Sprachen, Mobilansicht, Tastatur und Screenreader: nicht meine Rolle.
- Musterhaus Zentrum und Alpenblick nur am Rand gesehen (Helga speichert dort parallel).
