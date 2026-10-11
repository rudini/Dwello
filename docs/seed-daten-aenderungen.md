# Seed-Daten und Stammdaten: Änderungen mit Begründung

Prüfung der Demo-Daten (`backend/demo/demo-data.sql`, `backend/src/db/demo-data.ts`) und der Stammdaten (`backend/migrations/0002_stammdaten.sql`, korrigiert durch `0003_stammdaten_korrektur.sql`) auf Plausibilität und Konsistenz. Stand: Oktober 2026.

Bestehende Entwicklungsdatenbanken brauchen `bun run db:reset && bun run db:demo`, weil die Rechnungen der Demo-Daten neue IDs haben (das Laden ergänzt nur, es löscht nichts).

## Stammdaten (Migration 0003, gilt für jede Installation)

| # | Vorher | Nachher | Begründung |
|---|---|---|---|
| S1 | Verteilschlüssel «Heizung (Fläche 70 % / Einheit 30 %)» mit Formel `0.7 * {area} + 0.3 * {units}` | `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` | Der Anteil einer Wohnung ist «Wert ÷ Summe aller Werte». Mit `{units}` = 1 pro Wohnung ging der 30-%-Teil fast unter (Beispiel 80/40/30 m²: grosse Wohnung 53.2 % statt 47.3 %). Neue Formel-Bausteine `{area_total}`, `{rooms_total}`, `{volume_total}`, `{units_total}` (Summen des Gebäudes) machen beide Teile genau 70 % und 30 %. Die Formel-Hilfe in den Einstellungen erklärt sie. |
| S2 | Heizprofil «Heizung Mittelland»: Jan 28, Feb 14, Mär 11, Apr 5, Mai–Aug 0, Sep 2, Okt 8, Nov 14, Dez 18 % | Jan 17.5, Feb 14.5, Mär 13.5, Apr 9.5, Mai 3.5, Jun–Aug 0, Sep 1.0, Okt 10.0, Nov 13.5, Dez 17.0 % | Schweizer Tabelle «Anteilmässige Belastung in Prozenten» (Heizung ohne Warmwasser) aus den Mietvertragsformularen von mietrecht.ch / Mieterverband; vom Auftraggeber mit der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» bestätigt. Der Januar mit 28 % war unplausibel (Dezember nur 18 %). |
| S3 | «Heizung + Warmwasser»: Jan 14, Feb 12, Mär 10, Apr 6, Mai 3, Jun–Aug 2, Sep 4, Okt 8, Nov 12, Dez 25 % | Jan 13.6, Feb 12.1, Mär 11.5, Apr 9.3, Mai 5.6, Jun 3.7, Jul 3.7, Aug 3.6, Sep 3.7, Okt 9.5, Nov 10.7, Dez 13.0 % | Gleiche Tabelle, Spalte «mit Warmwasser». Dezember 25 % war unplausibel. |
| S4 | «Heizung Bergregion»: Jan 16, Feb 14, Mär 12, Apr 8, Mai 4, Jun 1, Jul 0, Aug 1, Sep 4, Okt 10, Nov 14, Dez 16 % | Jan 14.0, Feb 11.5, Mär 11.5, Apr 9.0, Mai 7.0, Jun 4.5, Jul 1.0, Aug 4.0, Sep 5.5, Okt 8.5, Nov 10.5, Dez 13.0 % | Tabelle «Mieterwechsel: So werden die Heizkosten verteilt», Spalte Bergregion (vom Auftraggeber geliefert). **Zu bestätigen:** Juli 1.0 % zwischen Juni 4.5 % und August 4.0 % wirkt wie ein Druckfehler; übernommen wie gedruckt. |
| S5 | «Heizung Tessin»: Jan 30, Feb 16, Mär 12, Apr 4, Mai–Sep 0, Okt 6, Nov 14, Dez 18 % | Jan 21.5, Feb 17.0, Mär 15.5, Apr 5.0, Mai–Sep 0, Okt 6.0, Nov 15.0, Dez 20.0 % | Gleiche Tabelle, Spalte Tessin. |
| S6 | «Nur Warmwasser»: 8.5 % in 8 Monaten, 8.0 % in 4 Monaten (Februar 8.5 %) | Anteil nach Kalendertagen: Monate mit 31 Tagen 8.49–8.50 %, 30 Tagen 8.22 %, Februar 7.67 % | Warmwasser hängt nicht von den Heizgradtagen ab (HEV Schweiz); eine Schweizer Monatstabelle gibt es nicht. Verteilung nach Tagen ist die neutrale Annahme. Später entfernt (Migration 0010): separates Warmwasser wird ohne Profil nach Tagen verteilt (0009), und als Heizprofil eines Laufs verteilte «Nur Warmwasser» die Heizkosten gleichmässig über das Jahr. |
| S7 | Beschreibungen der Heizprofile englisch, ohne Quelle | Deutsch, mit Quelle | Dr. Weber (Persona) vermisste die Herkunft der Werte. |
| S8 | Beschreibungen der vordefinierten Kategorien und Verteilschlüssel englisch | Deutsch (Migration 0005) | Deutsche Oberfläche; die Oberfläche blendet sie bei vordefinierten Einträgen noch aus (offener Punkt). |

Alle Profile ergeben weiterhin genau 100 % (`heating-profiles.pg.test.ts`).

## Demo-Daten

| # | Vorher | Nachher | Begründung |
|---|---|---|---|
| D1 | 14 Rechnungen, nur 2024 und lückenhaft: Heizöl nur im Januar, Wasser, Allgemeinstrom, Lift und Hauswart nur Q1, Kehricht nur H1; Seepark nur Q1 | 83 Rechnungen für 2024 und 2025 im Rhythmus der Lieferanten: Wasser, Strom, Hauswart quartalsweise; Fernwärme quartalsweise; Kehricht, Allgemeinstrom (Seepark, Alpenblick) halbjährlich; Heizöl, Lift-Abo, Kaminfeger, Kabelanschluss jährlich; Gartenpflege Frühjahr/Herbst; Schneeräumung im Winter | Eine Jahresabrechnung auf Kosten eines Quartals verteilte viel zu wenig (Musterhaus 2024: 10'200 statt rund 18'800 Franken) und jeder Mieter bekam scheinbar Geld zurück. |
| D2 | Rechnungsdaten mitten in der Periode und «Heizöl Winter 2023/24» im April 2024 | Datiert am Ende des abgerechneten Zeitraums (31.03., 30.06., 30.09., 31.12.) | Das Rechnungsdatum bestimmt die Abrechnungsperiode (Glossar). Eine Q4-Rechnung vom Januar fiele ins Folgejahr. |
| D3 | Lieferanten teils unrealistisch («Stadtwerke Zürich» liefert Heizöl, «EWZ» Allgemeinstrom, Rechnungsnummern INV-…) | Heizöl Brunner AG, ewz, Wasserversorgung Zürich, ERZ Entsorgung + Recycling Zürich, ewl Energie Wasser Luzern, BKW Energie AG, Gemeinde Interlaken; Nummern pro Gebäude und Jahr (MZ-2024-001 …) | Glaubwürdige Beispiele für Personas und Präsentation. |
| D4 | Verteilschlüssel: fast alles «Pro Einheit» | Heizung Musterhaus nach 70/30, übrige Heizung, Wasser, Strom, Hauswart, Garten, Schnee, Kaminfeger nach Fläche; Lift, Kehricht, Kabelanschluss pro Einheit | Übliche Schweizer Praxis: verbrauchsnahe Kosten nach Fläche, Abonnemente pro Wohnung. Zeigt alle vordefinierten Schlüssel ausser «Pro Zimmer». |
| D5 | Akonto ohne Bezug zu den Kosten. Musterhaus: 1.01 (75.5 m²) 120, 1.02 (92 m²) 160, 2.01 (85 m²) 220, 3.01 (120 m²) 350; Seepark: A1 (68 m²) 150, A2 (82 m²) 200, B2 (95 m²) 230; Alpenblick: EG (72 m²) 180, OG1 (98 m²) 250 | Musterhaus 240, 300, 270, 350; Seepark 200, 220 (neue Mieterin A2 ab 07.2025: 240), 260; Alpenblick 190, 250 – rund CHF 2.60 bis 3.20 pro m² und Monat | Mit vollständigen Rechnungen ergeben sich realistische Salden: Nachzahlungen 35.69 bis 238.12, Rückerstattungen 6.48 bis 171.67 Franken (alle 17 Demo-Abrechnungen, Stand nach Review B Runde 2) statt Rückerstattung von 80 % des Akontos. |
| D6 | Mieter ohne Postadresse | Adresse der gemieteten Wohnung; Sarah Meier nach dem Auszug Hirschmattstrasse 21, Luzern | Ohne Adresse fehlten im PDF der Empfänger und auf der QR-Rechnung «Zahlbar durch» (Art. 257b OR verlangt eine nachvollziehbare Abrechnung an den Mieter). |
| D7 | Alle Mieter Korrespondenzkanal E-Mail | Hans Müller, Maria Rossi, Kevin Fischer per Brief | Glossar: Brief ist der Standard; beide Kanäle kommen vor. |
| D8 | Kein Mieterwechsel in der Abrechnungsperiode | Seepark A2: Sarah Meier bis 30.06.2025, neue Mieterin Nina Brunner ab 01.07.2025 | Zeigt Teilperiode und Heizkosten nach Heizprofil bei Mieterwechsel (Glossar: jeder Mietvertrag erhält eine eigene Abrechnung). |
| D9 | 3 Abrechnungen 2024, einzelne Mietverträge eines Gebäudes, Abrechnungsdatum «heute» (z. B. 10.10.2026) | 17 Abrechnungen, je Gebäude und Jahr alle Mietverträge (ein Abrechnungslauf): 2024 alle drei Gebäude, Abrechnungsdatum 14.04.2025, bezahlt; 2025 Musterhaus (eine versendet, drei Entwürfe) und Seepark (vier Entwürfe inkl. Mieterwechsel), Abrechnungsdatum 28.09.2026; Zahlungsfrist immer 30 Tage | Eine Abrechnung für 2024 vom Oktober 2026 ist unrealistisch; ein halb abgerechnetes Gebäude verwirrt in der Vorführung. |
| D10 | Abrechnungen ohne Heizprofil | Musterhaus und Alpenblick mit «Heizung Mittelland» (Ölheizung, nördlich der Alpen), Seepark mit «Heizung + Warmwasser» (die Fernwärme erwärmt auch das Wasser) | Beim Mieterwechsel verteilt das Heizprofil die Heizkosten nach Monaten statt nach Tagen. |
| D11 | Gebäude ohne Gebäudetyp und Baujahr | Mehrfamilienhaus, Baujahr 1968, 2009, 1987 | Felder der Gebäudeseite sind gefüllt. |
| D12 | Notiz englisch («Previous tenant - moved out») | «Vormieter, ausgezogen per 28.02.2021» | Deutsche Oberfläche. |
| D13 | Alpenblick 2025 vollständig wie 2024 | Ohne Kaminfeger 2025 und ohne Wasser 2. Halbjahr 2025 | Absichtliche Lücke: die Prüfung auf fehlende Rechnungen (Schritt B) hat etwas zu zeigen. Für Alpenblick 2025 gibt es deshalb noch keine Abrechnung. |
| D14 | – | Wohnungen 2.02 und 3.02 (Musterhaus) und B1 (Seepark), OG2 (Alpenblick) bleiben leer | Bewusster Leerstand: zeigt, dass der Vermieter die Kosten leerer Wohnungen trägt (Glossar, Proration). |
| D15 | Heizöl nach Einkauf | Tankbestände (Wert in CHF am 31.12.) für Musterhaus Zentrum (2'120.00 / 2'650.00 / 2'257.20) und Alpenblick (1'536.00 / 1'792.00 / 1'494.00, je Liter × Preis der letzten Lieferung) | Heizkosten sind der Verbrauch (Review B, IV-K1, DP2-M2). Alpenblick 2024: 4'864.00 statt 5'120.00; Keller 2'247.66 (Rückerstattung 32.34), Fischer 3'059.31 (Nachzahlung 59.31). |
| D16 | Fernwärme Q4 mit Rechnungsdatum 31.12. | Rechnungsdatum 20.01. des Folgejahres, Leistungszeitraum 01.10.–31.12. (Seepark 2024 und 2025) | Realistischer Rechnungseingang; zeigt den Leistungszeitraum (DP2-N3). Beträge und Abrechnungen unverändert. |

## Backend und PDF-Inhalt

| # | Vorher | Nachher | Begründung |
|---|---|---|---|
| P1 | PDF ohne Adresse des Mieters («Unknown Tenant», wenn der Name fehlte) | Name und Postadresse aus dem Mieterdatensatz | D6; keine erfundenen Platzhalter. |
| P2 | Kategorien englisch («Heating», «Cold Water», «Caretaker») | In der Sprache des Mieters (`name_de/fr/it/en`), Rätoromanisch deutsch | Die Abrechnungsposition speichert den internen englischen Namen. |
| P3 | Datum «1.1.2024» (vom Server-Locale abhängig) | Immer TT.MM.JJJJ («01.01.2024») | Schweizer Datumsformat, unabhängig vom Server. |
| P4 | Beträge über `toLocaleString('de-CH')` (Tausendertrennung je nach ICU-Version mit typografischem Apostroph) | Eigene Formatierung «1'234.50» | Fest definiertes Schweizer Format. |
| P5 | «Mietdauer (Tage)», «Verwaltungskosten», «Gebäudekosten», «Geleistete Akonto-Zahlungen» | «Mietstage», «Verwaltungspauschale», «Kosten Liegenschaft», «Geleistete Akontobeiträge» | Begriffe aus `UBIQUITOUS_LANGUAGE.md`. |
| P6 | Ein PDF mit Nachzahlung hatte 11 Seiten: jede Zeile des Zahlteils landete auf einer neuen Seite | 2 Seiten (Test `statement-pdf.pg.test.ts`) | Der Zahlteil liegt im unteren Seitenrand; pdfkit brach deshalb jede Zeile um. Das ganze Layout wird in Schritt D2 neu gestaltet. |
| P7 | Empfangsschein und Zahlteil: «Zahlbar an» ohne Strasse, «Zahlbar durch» nur mit Namen | «Konto / Zahlbar an» mit IBAN, Name, Strasse, PLZ Ort; «Zahlbar durch» mit Name, Strasse, PLZ Ort; Betrag unter dem QR-Code | Die lesbaren Angaben der QR-Rechnung müssen denen im QR-Code entsprechen (SIX Style Guide). |
| P8 | «Verwaltungspauschale (3.0%)» unter der Zwischensumme des Mieters | Ohne Verteilschlüssel «3 % Ihrer Nebenkosten von CHF …»; mit Schlüssel «3 % von CHF … (Nebenkosten der Liegenschaft), verteilt nach …» | Seit Review B (MR-M1, IV-M3) ist die Pauschale ohne Schlüssel ein Prozentsatz der eigenen Nebenkosten; zuerst (Schritt A) war sie gleichmässig pro Wohnung. Seit Session 12 immer der eigenen Nebenkosten; den Text mit Schlüssel drucken nur noch ältere Abrechnungen. |
| P9 | Nur «Mietstage: 181» | «Ihre Mietdauer: 01.01.2025 – 30.06.2025 (181 Mietstage)» und «Heizkosten nach Heizprofil «Heizung + Warmwasser»: 55.8 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode» (Sarah Meier 2025; bis Review B Runde 3 «der Jahreskosten») | Beim Mieterwechsel kann der Mieter seinen Anteil sonst nicht nachvollziehen. |
| P10 | Die Abrechnung speicherte weder Heizprofil noch Verteilschlüssel der Verwaltungspauschale | Gespeichert (Migration 0004: `heating_profile_id`, `management_fee_distribution_key_id`) | Grundlage für P8 und P9; ältere Abrechnungen haben die Angaben nicht und drucken «gleichmässig pro Wohnung» bzw. keinen Heizhinweis. |
| P11 | Liegenschaft im PDF ohne PLZ und Ort | Mit PLZ und Ort | Vollständige Objektangabe. |
| P12 | Teiljahr mit Verteilschlüssel: «Verwaltungspauschale: 3 % von CHF 10'646.30 …» ohne Hinweis, dass nur die Mietstage zählen | «…, für Ihre 181 von 365 Tagen» | Sonst lässt sich der Betrag nicht nachrechnen. Ohne Schlüssel (Demodaten) gilt der Prozentsatz der eigenen Nebenkosten: Meier 2025 42.47. |
| P13 | FR/IT/EN: «(365 Durée de location (jours))» | «(365 jours)», «(365 giorni)», «(365 days)» | Lesbare Einheit statt wiederholter Feldbezeichnung. |

## Nachgerechnet (Musterhaus Zentrum 2024, Hans Müller, Wohnung 1.01, 75.5 m², ganzes Jahr)

Stand nach Schritt B (Heizöl nach Verbrauch, Verwaltungspauschale auf den eigenen Nebenkosten):

- Heizöl nach Verbrauch: Anfangsbestand 31.12.2023 2'120.00 + Einkauf 6'890.00 − Endbestand 31.12.2024 2'650.00 = 6'360.00
- Nebenkosten der Liegenschaft: 6'360.00 + 320.00 + 3'760.00 + 755.20 + 3'600.00 + 1'650.00 + 900.00 + 960.00 = 18'305.20
- Heizung 70/30: 6'360 × (0.7 × 75.5 / 492.5 + 0.3 / 6) = 1'000.49
- Nach Fläche (Kaminfeger, Wasser, Strom, Hauswart, Garten = 9'335.20): × 75.5 / 492.5 = 49.06 + 576.41 + 115.77 + 551.88 + 137.97 = 1'431.09 (je Position einzeln auf Rappen gerundet)
- Pro Einheit (Lift, Kehricht = 2'610.00): ÷ 6 = 435.00
- Zwischensumme 1'000.49 + 1'431.09 + 435.00 = 2'866.58; Verwaltungspauschale 3 % davon = 86.00
- Total 2'952.58, Akonto 12 × 240 = 2'880.00, Nachzahlung 72.58 (entspricht der erzeugten Abrechnung)

Vorher (Schritt A): Heizöl nach Einkauf 6'890.00 und Verwaltungspauschale 3 % der Liegenschaftskosten ÷ 6 Wohnungen = 94.18, Total 3'044.13, Nachzahlung 164.13. Gründe: Findings IV-K1/MR-H2 und MR-M1/IV-M3 in `docs/reviews/B-review-1.md`.
