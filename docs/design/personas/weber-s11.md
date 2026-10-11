<!-- Persona run session 11 (steps A–D) on 7890141; screenshots stayed in the session's scratchpad, not in the repository -->

# Persona-Lauf Dr. Weber, 52 (Desktop): Abrechnungen 2025 prüfen

**Aufgabe geschafft:** teilweise bis weitgehend. Alle Zahlen, die ich nachgerechnet habe, stimmen auf den Rappen, und der Zahlteil ist formal korrekt. Abgezogen habe ich, weil die Webansicht die Verwaltungspauschale anders beschreibt als das PDF, weil die Rechnungsliste beim Blättern eine Rechnung verschluckt und weil mein Lauf am Ende abbrach: Die App unter :3300 war ab etwa der 30. Minute nicht mehr erreichbar (ERR_CONNECTION_REFUSED).

**Aufwand:** etwa 35 Minuten und etwa 40 Seitenaufrufe: 8 Abrechnungen 2025 im Web, 6 PDFs (5× 2025, 1× 2024), Rechnungslisten 2024/2025/2026, Gebäude, Heizprofile, Einstellungen, Assistent bis Schritt 4. Nachgerechnet habe ich mit Python als Taschenrechner. Den QR-Code habe ich mit OpenCV dekodiert.

Hinweis: Während meines Laufs haben andere Personas Daten geändert. Hans Müller 2025 ist jetzt «Bezahlt am 11.10.2026», und es gibt neue Entwürfe für Alpenblick 2025. Ich habe nichts versendet, gelöscht oder erstellt. Nur über die Persona-API habe ich die PDFs neu erzeugt.

## Was ich nachgerechnet habe

| Prüfung | Rechnung | Ergebnis |
|---|---|---|
| Fläche Musterhaus | 75.5+92+85+65+120+55 = 492.5 m², leere Wohnungen zählen mit | ✓ (Leerstand trägt der Vermieter, so steht es im Assistenten) |
| Wohnungsanteil 1.01 Fläche | 75.5 / 492.5 = 15.33 % → Hauswart 3'680 × 0.1533 = 564.14 | ✓ |
| Heizschlüssel 70/30 (1.01) | 0.7×15.33 % + 0.3×16.67 % = 15.73 % → 6'957.80 × 0.1573 = 1'094.53 | ✓ |
| Heizschlüssel 70/30 (3.01, Rossi) | 0.7×24.37 % + 0.3×16.67 % = 22.06 % → 1'534.60 | ✓ |
| Heizöl aus Tank 2025 | 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80 | ✓, ebenso 2024: 2'120 + 6'890 − 2'650 = 6'360 |
| Plausibilität Tank | 6'400 l für 6'565 → 1.026 CHF/l; Endbestand ≈ 2'200 l | plausibel |
| Kostensummen Musterhaus 2025 | Hauswart 4×920, Wasser 930+960+1'010+940, Strom 198.70+171.20+162.80+230.10, Garten 540+395, Kehricht 2×495 | ✓ alle |
| Seepark Heizung mit Leistungszeitraum | 1'520 + 790 + 395 + 1'410 (Q4 2025, Rechnung vom 20.01.2026) = 4'115; Q4 2024 (Rechnung 20.01.2025) korrekt ausgeschlossen | ✓, das gefällt mir |
| Zeitanteil A2 (Mieterwechsel) | Meier 181/365 + Brunner 184/365 = 365 Tage; 82/320 × 181/365 = 12.71 % | ✓ |
| Heizprofil A2 | Jan–Jun 13.6+12.1+11.5+9.3+5.6+3.7 = 55.8 %; Rest 44.2 %; 1'054.47 × 55.8 % = 588.39 | ✓, die beiden Teile ergeben zusammen 100 % |
| Akonto A2 | 6 × 220 = 1'320 (Meier); 6 × 240 = 1'440 (Brunner) | plausibel |
| Verwaltungspauschale | 3 % × 1'415.51 = 42.47 (Meier); 3 % × 3'005.65 = 90.17 (Müller) | ✓ nach PDF-Formel (siehe Finding 1) |
| Saldo | 3'095.82 − 2'880 = 215.82; 1'346.13 − 1'440 = −93.87 | ✓ |
| Abrechnung 2024 Müller (bezahlt) | Summe der Positionen 2'866.58, 3 % = 86.00, Saldo 72.58; 366 Tage (Schaltjahr) korrekt | ✓ |
| QR-Rechnung | IBAN-Prüfziffer ok; QR-IBAN (IID 31999) mit QRR-Referenz; Referenz-Prüfziffer Modulo 10 rekursiv ok (Meier, Rossi); dekodierter Inhalt: SPC/0200, strukturierte Adressen (S), Betrag 137.98, Zahler mit neuer Adresse nach Auszug | ✓ formal korrekt |
| Rückerstattung | Kein Zahlteil, dafür der Text «Teilen Sie uns Ihre IBAN mit» | ✓ richtig |

## Was half

- **PDF:** Die Spalten Kosten Liegenschaft → Wohnungsanteil → Zeitanteil → Ihr Anteil, dazu der Bruch darunter (82.00 / 320.00 m², «70 % × … + 30 % × 1/6»). So konnte ich jede Zeile ohne Rückfrage nachrechnen. Diese Abrechnung würde ich als Mieterin akzeptieren.
- **Heizöl:** Die Tankrechnung (Anfangsbestand + Rechnungen − Endbestand) steht auf Seite 2, mit dem Hinweis auf Art. 8 Abs. 2 VMWG.
- **Mieterwechsel:** «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)», dazu die Monatsanteile des Heizprofils einzeln aufgeführt.
- **Hinweise:** Belegeinsicht nach Art. 257b Abs. 2 OR und detaillierte Heizkostenabrechnung nach Art. 8 VMWG.
- **Assistent Schritt 3:** Er sagt ehrlich, was Dwello nicht kann (Zählerstände, Heizkostenverteiler → ausserhalb von Dwello abrechnen). Er warnt auch, die Pauschale nur zu verlangen, wenn sie im Mietvertrag vereinbart ist.
- **Gebäude:** Die Hilfe zum Tankbestand ist ausführlich und verständlich.

## Findings

### 1. Hoch: Webansicht und PDF beschreiben die Verwaltungspauschale widersprüchlich
- Web (Abrechnungsdetail): «3 % der Nebenkosten der Liegenschaft, Anteil dieser Wohnung für 181 Mietstage». Bild: `03-mueller-versendet.png`, `07-meier-A2.png`
- PDF: «Verwaltungspauschale: 3 % der Zwischensumme von CHF 1'415.51». Bild: `pdf/meier25-1.png`
- Gerechnet wird nach dem PDF: 3 % × 1'415.51 = 42.47. Nach dem Webtext wären es 3 % × 10'646.30 × 25.625 % × 181/365 = 40.58.
- Ich habe hier lange gezögert. Wenn ein Mieter beide Texte sieht, beanstandet er die Abrechnung als nicht nachvollziehbar. Der Webtext muss die tatsächlich angewendete Methode nennen. Der Assistent bietet beide Methoden an («Nach den eigenen Nebenkosten» bzw. «Verteilschlüssel»), siehe `17-wiz-step3.png`.

### 2. Hoch: Die Rechnungsliste verschluckt beim Blättern eine Rechnung und zeigt eine andere doppelt
- Filter Jahr 2025 (40 Rechnungen, 2 Seiten): «ewz Allgemeinstrom Q2 2025, CHF 171.20» fehlt auf beiden Seiten. «Gemeinde Interlaken Wasser und Abwasser H1 2025, CHF 470.00» erscheint dafür zweimal (Ende Seite 1, Anfang Seite 2). Zweimal reproduziert.
- Mit Filter Gebäude + Kategorie ist sie da, und für Alpenblick gibt es tatsächlich nur eine Wasserrechnung H1.
- Beim Abgleich «Summe der Rechnungen = Kosten Liegenschaft» kam ich für Allgemeinstrom Musterhaus zuerst auf 591.60 statt 762.80 und hielt die Abrechnung für falsch. Umgekehrt hätte ich eine Doppelerfassung vermutet und die Rechnung womöglich gelöscht. Bild: `05-invoices-2025.png`. Vermutlich ist die Sortierung bei gleichem Datum (30.06.2025) nicht stabil.

### 3. Mittel: Die Webansicht zeigt beim Mieterwechsel den eigenen Abrechnungszeitraum nicht
- Liste und Detail zeigen bei Meier und Brunner (A2) je «01.01.2025 – 31.12.2025». Bild: `02-statements.png`, `08-brunner-A2.png`
- Erst das PDF nennt «01.01.2025 – 30.06.2025». Im Web steht nur «181 Mietstage». Ich musste nachzählen, wer welche Hälfte hat.

### 4. Mittel: «Pro Fläche (m²)» bei Heizung, aber ein anderer Anteil als bei den übrigen Flächenpositionen
- Meier: Heizung 14.3 %, Hauswart 12.71 %, beide «Pro Fläche (m²)». Die Webansicht erklärt den Unterschied nicht, weder Heizprofil noch Monatsanteile. Bild: `07-meier-A2.png`
- Das PDF erklärt es, die Webansicht nicht. Als Prüferin vermutete ich zuerst einen Fehler.

### 5. Mittel: Die Prozente in der Spalte «Anteil» der Webansicht sind uneinheitlich gerundet
- Rossi: Hauswart 24.37 %, Kaminfeger 24.36 % bei gleichem Schlüssel (120/492.5 = 24.365 %). Meier: «12.4 %» neben «12.71 %».
- Jemand, der nachrechnet, fragt: «Warum zwei verschiedene Sätze bei demselben Schlüssel?» Besser wäre der Bruch wie im PDF oder einheitlich 2 Nachkommastellen.

### 6. Mittel: «Kaminfeger» läuft beim Zeitanteil unter Heizkosten (Heizprofil, «100.00 %»), die Fussnote nennt aber nur «bei Heizkosten»
- Bild: `pdf/mueller25-1.png`. Bei ganzjährigen Mietern hat das keine Folgen. Beim Mieterwechsel wäre es nicht nachvollziehbar, weshalb Kaminfeger nach Monaten statt nach Tagen verteilt wird.

### 7. Mittel: «Mahnung senden» erscheint schon vor Ablauf der Zahlungsfrist
- Müller (versendet, Frist 28.10.2026, heute 11.10.2026). Bild: `03-mueller-versendet.png`. Eine Mahnung vor Fälligkeit ist rechtlich heikel. Den Knopf würde ich erst nach Ablauf der Frist zeigen oder mit einem Warnhinweis versehen.

### 8. Mittel: Ein neu erzeugtes PDF ersetzt den versendeten Stand
- Das PDF von Müller 2025 trägt nach dem Neu-Erzeugen «Bezahlt am 11.10.2026. Vielen Dank.» statt des Zahlteils. Bild: `pdf/mueller25-1.png`. Gut für die Quittung. Juristisch will ich aber das Dokument, das der Mieter tatsächlich erhalten hat, unverändert aufbewahren. Der Verlauf zeigt zudem nur «Erstellt / PDF erstellt», kein «Versendet am …».

### 9. Niedrig: Der Verlauf passt nicht zum Abrechnungsdatum
- Abrechnungsdatum 28.09.2026, Verlauf «Erstellt 11.10.2026». Das liegt vermutlich an den Demodaten, verunsichert aber.

### 10. Niedrig: Die Vorschau im Assistenten nennt «15 Rechnungen vom 31.01.2025 bis 31.12.2025»
- Darin ist eine Rechnung vom 20.01.2026 enthalten (Fernwärme Q4 2025, über den Leistungszeitraum). Bild: `18-wiz-step4.png`. Die Angabe sollte sich auf den Leistungszeitraum beziehen oder es so sagen.

### 11. Niedrig: Das Heizprofil «Heizung Bergregion» ist unplausibel
- Juli 1 %, August 4 %. Bild: `11-heizprofile.png`. Ich vermute einen Tippfehler.

### 12. Niedrig: Die Begriffe «Heizprofil» und «Wohnungsanteil» stehen ohne Erklärung in der Webansicht
- Im PDF sind sie mit einer Fussnote erklärt.

## Unverständliche oder unsichere Begriffe
- **«Verwaltungspauschale … Anteil dieser Wohnung für 365 Mietstage»:** Was ist hier der Anteil? Die Formulierung widerspricht dem PDF (Finding 1).
- **«Heizprofil «Heizung + Warmwasser»»:** Bei Seepark gibt es Fernwärme, für Musterhaus gilt «Heizung Mittelland». Warum unterschiedlich? Das hängt vom Assistenten-Lauf ab und ist auf der Abrechnung nicht begründet.
- **«Wiedervermietet»:** Erst die Hilfe am Gebäude erklärt es. Danach klar.
- **«Zeitanteil 100.00 %» statt «365/365 Tage» bei Heizung und Kaminfeger:** zwei Darstellungen für dasselbe.

## Würde ich als Mieter etwas beanstanden?
- Die Beträge stimmen. Beanstanden würde ich nur, dass Web und PDF die Pauschale verschieden beschreiben.
- Kaltwasser wird nach Fläche verteilt. Das ist zulässig, wenn es keine Zähler gibt. Ich würde fragen, ob Wohnungszähler vorhanden sind.
- Ob «Hauswart» nur die Nebenkosten-Anteile enthält (keine Reparaturen und keine Verwaltung), kann ich nur über die Belegeinsicht prüfen. Der Hinweis darauf ist vorhanden.

## Fehlerrisiken für den Verwalter
- Wegen Finding 2 falscher Abgleich der Rechnungssummen: Rechnungen werden doppelt erfasst oder fälschlich gelöscht.
- Am Gebäude stehen bei den Tankbeständen 31.12.2023/2024 «Löschen»-Knöpfe ohne Hinweis, dass bezahlte Abrechnungen 2024 darauf beruhen. Bild: `04-musterhaus.png`.
- Mahnung vor Fälligkeit (Finding 7).

## Verbesserungsvorschläge
1. Den Text der Verwaltungspauschale im Web aus derselben Quelle wie im PDF erzeugen: «3 % von CHF 1'415.51».
2. Die Rechnungsliste stabil sortieren (Datum, dann ID), damit beim Blättern nichts fehlt und nichts doppelt erscheint.
3. Im Web bei Mieterwechsel «Ihr Mietverhältnis: 01.01.–30.06.2025» zeigen und in der Liste diesen Zeitraum statt der ganzen Periode.
4. Web-Kostenaufstellung wie im PDF: Bruch (82/320 m²) und Zeitanteil bzw. Heizprofil-Prozent anzeigen.
5. «Mahnung senden» erst nach Ablauf der Zahlungsfrist anbieten.
6. Das versendete PDF unveränderlich archivieren und «Versendet am» im Verlauf zeigen.
7. Beim Löschen eines Tankbestands warnen, wenn Abrechnungen darauf beruhen.

## Bilder
Alle unter `/tmp/claude-0/-home-user-Dwello/3830787a-c41f-50a2-b0fc-165f8b7dfd23/scratchpad/personas/weber/`:
01-dashboard, 02-statements, 03-mueller-versendet, 04-musterhaus, 05-invoices-2025, 06-seepark, 07-meier-A2, 08-brunner-A2, 10-dubois, 11-heizprofile, 12-config, 13-generate, 14-invoice-fw-q4-2025, 15–18 Assistent (Schritte 2–4).
PDFs, Texte und Seitenbilder (100 dpi) unter `pdf/`: mueller25, meier25, brunner25, rossi25, schmidt25, mueller24.
