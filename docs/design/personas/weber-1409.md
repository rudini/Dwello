# Persona-Review: Dr. Weber – Jahresbericht unter «Auswertungen» (1409)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Aufgabe: Jahresbericht 2025 von «Musterhaus Zentrum» vor der Steuererklärung prüfen (Plausibilität, Übereinstimmung mit Mietverträgen, Rechnungen und Kostenabstimmung, Erklärungen, PDF für die Treuhand). Ausserdem den Bericht von «Alpenblick» 2025 ansehen. Nur angesehen, nichts gespeichert.

Scripts, Screenshots und Downloads: `/tmp/claude-0/-home-user-Dwello/a6e6bb96-96f2-5195-b173-cbbf1ed94f91/scratchpad/weber-1409/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Navigation / alle Seiten | Die Seite «Auswertungen» ist nirgends verlinkt: nicht im Menü, nicht in der Übersicht, nicht unter «Berichte», nicht beim Gebäude, nicht in der Hilfe. Ich habe sie nur gefunden, weil ich Adressen ausprobiert habe (`/analytics`). |
| P-2 | Major | Auswertungen, Alpenblick 2025 (Seite, PDF, CSV) | Ohne Abrechnungen 2025 steht als Ergebnis «Total Kosten ohne wertvermehrende Investitionen CHF 0.00». Alpenblick hat 2025 eine leere Wohnung (2.01) und Rechnungen über CHF 7’028.90; mein Anteil ist also sicher nicht null, sondern nur noch nicht ermittelt. Ein fett gedrucktes Total von CHF 0.00 in einem PDF für die Treuhand liest sich als «keine Kosten». Der Hinweis darüber ist richtig, aber das Total widerspricht ihm. |
| P-3 | Minor | Auswertungen, Musterhaus Zentrum 2025 (Seite, PDF) | Der Bericht sagt nur, die Kostenabstimmung «hat Hinweise», nicht welche. Dort steht: 3 Abrechnungen (Maria Rossi, Pierre Dubois, Anna Schmidt) sind noch Entwürfe. Auf der Seite gibt es keinen Link zur Kostenabstimmung; ich musste unter «Berichte» selbst suchen. |
| P-4 | Minor | PDF Jahresbericht | Das PDF richtet sich an mich und nicht an die Treuhand: «Prüfen Sie sie unter «Berichte», bevor Sie die Zahlen weitergeben», «Erstellen Sie die Abrechnungen und öffnen Sie den Bericht dann erneut», «erfassen Sie … in der Kategorie …». Es fehlen ein Erstellungsdatum, der Name der Eigentümerin oder des Eigentümers und ein Hinweis, dass die Zahlen auf Entwürfen beruhen. So kann ich das PDF nicht ohne Begleitbrief weitergeben. |
| P-5 | Minor | Auswertungen, Musterhaus Zentrum 2025 | Gibt es im Jahr keine nicht umlagefähigen Rechnungen, fehlt der ganze Block (2024 heisst er «Total Unterhalt und Verwaltung»). Eine Zeile «keine» fehlt. Die Treuhand fragt sicher nach, ob Gebäudeversicherung, Liegenschaftssteuer oder Unterhalt vergessen wurden oder ob es sie nicht gab. |
| P-6 | Minor | Auswertungen, Erklärung Mietertrag | Die Verwaltungspauschale ist «nicht enthalten», weil sie in den Abrechnungen steht. Für die Steuer ist sie aber Ertrag. Die Kostenabstimmung kennt den Betrag (Musterhaus Zentrum 2025: CHF 422.63), der Bericht nennt ihn nicht. Ich muss ihn selbst zusammensuchen und kann ihn leicht vergessen. |

## Beobachtungen

- Nachgerechnet, Musterhaus Zentrum 2025: Nettomiete 1’650 + 1’850 + 1’450 + 2’400 = 7’350 × 12 = CHF 88’200 ✓. Zusatzmiete 0 + 120 + 100 + 150 = 370 × 12 = CHF 4’440 ✓. Die Wohnungen 2.02 und 3.02 standen leer und haben richtigerweise keinen Ertrag.
- Nachgerechnet, Alpenblick 2025: Nettomiete 1’350 + 1’800 = 3’150 × 12 = CHF 37’800 ✓. Zusatzmiete 50 + 120 = 170 × 12 = CHF 2’040 ✓.
- Kosten, Musterhaus Zentrum 2025: Jede Kategorie und das Total CHF 5’103.39 stimmen auf den Rappen mit der Spalte «davon tragen Sie» der Kostenabstimmung überein. Die Kosten des Gebäudes in der Kostenabstimmung habe ich mit der Rechnungsliste nachgerechnet: Allgemeinstrom 762.80, Kaltwasser 3’840, Hauswart 3’680, Kehricht 990, Gartenpflege 935, Lift 1’690, Kaminfeger 335 ✓. Heizung 6’957.80 = Heizöl 6’565 + Tankbestand (2’650.00 − 2’257.20) ✓.
- Der Jahresbericht sagt nicht, dass die Heizung die Veränderung des Tankbestands enthält. Das steht nur in der Kostenabstimmung. Der Treuhand fällt auf, dass die Heizölrechnung (CHF 6’565) nicht zum Heizungsbetrag passt.
- Der Satz «kann eine Kategorie einige Rappen zeigen, auch mit Minus» liest sich holprig. Gemeint ist wohl: Bei Kategorien ohne Leerstand können Rundungsdifferenzen von wenigen Rappen entstehen, auch negative.
- Musterhaus Zentrum 2024 (zum Vergleich): Die nicht umlagefähige Reparatur Boiler (CHF 2’350, Rechnungsdatum 20.02.2024) steht richtig im Jahr ihres Rechnungsdatums unter «Reparaturen / Total Unterhalt und Verwaltung». Total CHF 7’215.30 = 4’865.30 + 2’350 ✓.
- Die Jahresauswahl hängt vom Gebäude ab (Alpenblick 2021–2026, Musterhaus Zentrum 2018–2026). Das laufende Jahr 2026 ist auswählbar, ohne Hinweis, dass es noch nicht abgeschlossen ist.
- Die Seite öffnet ohne Auswahl gleich mit Alpenblick 2025. Wer «Bericht anzeigen» übersieht, prüft womöglich das falsche Gebäude.
- Die CSV hat UTF-8 mit BOM, Semikolon und Dezimalpunkt. Die Hinweistexte stehen als eigene Zeilen in der Spalte «Position» ohne Betrag. Für Excel geht das, maschinell auswerten lässt es sich schlecht.
- Die Adresse `/reports/annual` liefert «Ein unerwarteter Fehler ist aufgetreten» (500) statt «Diese Seite gibt es nicht». Darauf bin ich nur beim Suchen der Seite gestossen.
- Bei 390 px Breite scrollt die Seite nicht seitwärts.
- Ausserhalb der Aufgabe: Die Mietverträge zeigen «Abrechnung 2023 fehlt» bzw. «… 2022/2023 fehlen», obwohl es für 2024/2025 Kostenabstimmungen gibt. Bei Wohnung 1.01 Musterhaus Zentrum steht «Auszug von Kevin Fischer am 28.02.2021, Schlussabrechnung fällig».

## Aufgabe geschafft: teilweise

Den Bericht von Musterhaus Zentrum 2025 konnte ich vollständig prüfen. Die Zahlen sind plausibel und stimmen mit Mietverträgen, Rechnungen und Kostenabstimmung überein. Gefunden habe ich die Seite aber nur über die Adresse (P-1). Das PDF würde ich so nicht an die Treuhand geben (P-2, P-4).

## Aufwand

Etwa 25 Minuten, rund 18 Schritte (Seite suchen 4, Berichte ansehen 3, Kostenabstimmung 1, Mietverträge 7, Rechnungen 3, Downloads 1).

## Ablauf

- Seite «Auswertungen» aufrufen. Erwartet: Eintrag im Menü, wohl unter «Nebenkosten» bei «Berichte». Gesehen: kein Eintrag, auch keiner in der Übersicht, unter «Berichte» oder in der Hilfe. Gefunden erst unter `/analytics`, nachdem `/evaluations`, `/auswertungen` und `/reports/annual` nicht gingen.
- Alpenblick 2025, Kosten. Erwartet: kein Total oder «noch nicht ermittelt», solange keine Abrechnungen bestehen. Gesehen: «Total Kosten ohne wertvermehrende Investitionen CHF 0.00», fett, auch im PDF und in der CSV.
- Musterhaus Zentrum 2025, Hinweise. Erwartet: welche Hinweise und ein Link dorthin. Gesehen: nur «hat Hinweise … Prüfen Sie sie unter «Berichte»», ohne Link.
- PDF. Erwartet: ein Dokument für Dritte mit Datum, Eigentümer und klarem Vorbehalt bei Entwürfen. Gesehen: Wortlaut der Bildschirmseite mit App-Anweisungen an mich, ohne Datum und Eigentümer (Screenshot: eine A4-Seite mit Titel «Jahresbericht 2025», Adresse, Zeitraum, zwei Tabellen, sauber gesetzt).

## Vorschläge

- **P-1:** Menü öffnen und «Auswertungen» suchen. Hilfreich: ein Menüeintrag, z. B. unter «Nebenkosten» neben «Berichte» (oder «Berichte» und «Auswertungen» zusammenführen), und ein Link aus der Übersicht zu Jahresbeginn.
- **P-2:** `/analytics?building=<Alpenblick>&year=2025` öffnen, dann PDF herunterladen. Hilfreich: Ohne Abrechnungen statt «CHF 0.00» schreiben «nicht ermittelt» oder das Total weglassen. Oder ein Total nur der nicht umlagefähigen Rechnungen mit dem ausdrücklichen Vermerk «ohne Ihren Anteil an den Nebenkosten», und im PDF ein deutlicher Vorbehalt.
- **P-3:** Musterhaus Zentrum 2025 anzeigen. Hilfreich: die Hinweise nennen («3 Abrechnungen sind noch Entwürfe: …») und ein Link «Kostenabstimmung öffnen».
- **P-4:** PDF Musterhaus Zentrum 2025 herunterladen. Hilfreich: «Erstellt am …», Name der Verwalterin bzw. des Verwalters, ein sachlicher Vorbehalt für Dritte («Die Nebenkosten beruhen auf 3 Abrechnungsentwürfen») statt Anweisungen zur Bedienung von Dwello.
- **P-5:** Musterhaus Zentrum 2025 anzeigen und mit 2024 vergleichen. Hilfreich: Block «Unterhalt und Verwaltung» immer zeigen, mit «Keine nicht umlagefähigen Rechnungen in 2025» bzw. CHF 0.00.
- **P-6:** Musterhaus Zentrum 2025 anzeigen, die Erklärung zur Verwaltungspauschale lesen und mit der Kostenabstimmung vergleichen. Hilfreich: die Verwaltungspauschale aus den Abrechnungen der Periode als eigene Zeile beim Ertrag (mit Hinweis auf die Abrechnungsperiode) oder zumindest den Betrag im Hinweis nennen.

## Nicht geprüft

- Gebäude, deren Abrechnungsperiode kein Kalenderjahr ist, und mit geänderten Mieten während des Jahres: Die Demodaten haben keine. Ändern hätte Speichern bedeutet, und das war nicht erlaubt.
- Ob Nebenkostenpauschalen richtig als Ertrag zählen: Alle Verträge haben CHF 0.00.
- Seepark Residenz (Mieterwechsel 2025 auf Wohnung A2, «angebrochene Monate nach Tagen»): nicht Teil der Aufgabe, nicht angesehen.
- Andere Sprachen und Dark Mode: nicht angesehen.
