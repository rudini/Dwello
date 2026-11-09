# Persona-Review: Dr. Weber, Kostenaufstellung und Listen (#658)

Persona: Dr. Weber, 52, Desktop 1440 × 900 mit Maus; zusätzlich 1920 × 1080 und 1280 × 800. App: Persona-Stack http://localhost:3300 (Demodaten). Nichts gespeichert.

Geprüfte Abrechnung: NK-22222222-2024-0002, Sarah Meier, Seepark Residenz, Wohnung A2, Periode 01.01.2024 – 31.12.2024, Status «Bezahlt» (Versendet am 14.04.2025). In der Liste gibt es keine Abrechnung mit Status «Versendet» (Zähler 0); ich habe deshalb eine versendete und inzwischen bezahlte Abrechnung genommen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung, Kostenaufstellung, 1440 × 900 und 1280 × 800 | Bei 1440 px (meinem normalen Bildschirm) und bei 1280 px erscheint die Kostenaufstellung nicht als Tabelle, sondern als sechs untereinander gestapelte Karten mit je sieben Zeilen «Bezeichnung links, Wert rechts». Die Tabelle mit Spalten erscheint erst ab etwa 1480 px Fensterbreite. Deshalb kann ich die Positionen nicht Spalte für Spalte vergleichen (z. B. alle «Anteil»-Werte untereinander). Die Seite ist 4757 px hoch statt 3617 px bei 1920 px. Die Tabelle bräuchte bei 1480 px nur 1028 px Breite, bei 1440 px stehen 990 px zur Verfügung. |
| P-2 | Minor | Abrechnung, Kostenaufstellung (alle Grössen) | Die Spalte «Anteil» lässt sich nicht nachrechnen. Hauswart: CHF 3’000.00 × 25.63 % = CHF 768.90, angezeigt sind CHF 768.75 (also 25.625 %). Bei Kaltwasser steht mit demselben Verteilschlüssel «Pro Fläche (m²)» für dieselbe Wohnung 25.62 %, bei allen anderen Positionen 25.63 %. Für mich sieht das nach zwei verschiedenen Flächenanteilen aus. Die m²-Werte von Wohnung und Gebäude fehlen, also kann ich den Anteil nicht prüfen. |
| P-3 | Minor | Abrechnung, Rechnungen unter einer Position | Unter Gartenpflege steht der Link «Gartenpflege Jahresabonnement 07/2024–06/2025» mit «CHF 368.00». Die Rechnung selbst lautet auf CHF 730.00, Leistungszeitraum 01.07.2024 – 30.06.2025. Dass 368.00 der Teil für die Tage in der Periode ist (184/365), steht nur auf der Rechnungsseite («Nur die Tage in der Abrechnungsperiode zählen.»), in der Kostenaufstellung nicht. Dort heisst die Spalte «Kosten des Gebäudes» CHF 368.00 und der Zeitanteil «184/184 Tage». Wer von der Position zur Rechnung geht, findet einen anderen Betrag und hält die Abrechnung leicht für falsch. |
| P-4 | Minor | Rechnungsliste, 1280 × 800 | Bei 1280 px wird jede Rechnung zur Karte mit sechs Zeilen. Der Betrag steht linksbündig unter der Kategorie statt in einer rechtsbündigen Spalte. Die Seite wird 6255 px hoch (bei 1300 px noch 3695 px, bei 1440 px 2995 px). Beträge kann ich nicht mehr Zeile für Zeile vergleichen, und die erste Rechnung liegt unterhalb des sichtbaren Bereichs. |
| P-5 | Minor | Abrechnungsliste, 1280 × 800 | Bei 1280 px steht der Betrag nicht mehr in einer rechtsbündigen Spalte, sondern gleich hinter «Nachzahlung» bzw. «Rückerstattung». Weil die Bezeichnungen verschieden lang sind, beginnen die Beträge an verschiedenen Stellen. Unter 1360 px wird die Liste so zum Stapel (3429 px Seitenhöhe statt 2145 px). |

## Beobachtungen

- Nirgends wird seitlich gescrollt: Bei 1920, 1440 und 1280 px ist die Seitenbreite gleich der Fensterbreite, bei Kostenaufstellung, Abrechnungsliste und Rechnungsliste. Abgeschnittene Texte oder «…» habe ich nicht gefunden.
- Bei 1920 px (und ab etwa 1480 px) ist die Kostenaufstellung eine saubere Tabelle mit den Spalten Kategorie, Verteilschlüssel, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Anteil, Betrag. Die Beträge stehen rechtsbündig, «Betrag» ist fett. So hatte ich mir das vorgestellt.
- Nachgerechnet: TV/Kabelanschluss CHF 912.00 × 25.00 % × 366/366 = CHF 228.00 stimmt. Summe der Beträge = CHF 2’774.95, 3 % Verwaltungspauschale = CHF 83.25, Nebenkosten CHF 2’858.20 − Akonto CHF 2’640.00 = CHF 218.20. Das stimmt mit dem Saldo und mit dem Betrag in der Liste überein.
- Die Rechnungen unter einer Position addieren sich zu «Kosten des Gebäudes» (Hauswart 4 × 750 = 3’000, Heizung 1’480 + 820 + 410 + 1’350 = 4’060, Kaltwasser 2’015, Allgemeinstrom 496.30). Die Summe muss ich aber selbst bilden. Die Rechnungsbeträge stehen auch in der Tabellenansicht linksbündig unter dem Rechnungsnamen und nicht in der Spalte «Kosten des Gebäudes». Jede Rechnung braucht zwei Zeilen, deshalb ist die Kostenaufstellung auch bei 1920 px sehr lang.
- «Wohnungsanteil» und «Betrag» sind in allen sechs Positionen gleich, weil der Zeitanteil überall voll ist. Wozu es zwei Spalten gibt, merke ich in diesem Fall nicht.
- Die Links zu den Rechnungen funktionieren. Die Rechnungsseite zeigt unter «In Abrechnungen enthalten» auch diese Abrechnung, so finde ich den Weg zurück. Ihre Brotkrümelnavigation führt aber zu «Rechnungen» und nicht zur Abrechnung zurück. Mit «Zurück» im Browser lande ich wieder oben auf der Abrechnung und muss erneut zur Position scrollen.
- Fachlich: Die Gartenpflege-Rechnung (07/2024–06/2025) erscheint unter «In Abrechnungen enthalten» in den Abrechnungen 2024 und 2025. Das ist vermutlich richtig, weil jeweils nur die Tage der Periode zählen, aber für den Laien nicht selbsterklärend.
- Rechnungsliste bei 1440 px: Das Filterfeld «Jahr» rutscht allein in eine zweite Zeile. Die Liste selbst ist gut lesbar, die Beträge stehen in einer rechtsbündigen Spalte.
- Bei 1280 px bricht der Titel der Abrechnung um («Abrechnung NK-» / «22222222-2024-0002»), mitten in der Abrechnungsnummer.
- Kein Status «Versendet» in den Demodaten: Den Status konnte ich nur über eine bezahlte Abrechnung prüfen (Verlauf zeigt «Versendet 14.04.2025»).

## Aufgabe geschafft: teilweise

Alle Werte sind ohne seitliches Scrollen lesbar, und ich komme von den Positionen zu den Rechnungen. Bei meiner Bildschirmgrösse 1440 px fehlt aber die Tabelle (P-1). Einen Anteil konnte ich nicht exakt nachrechnen (P-2).

## Aufwand

Etwa 25 Minuten, 9 Durchgänge: Liste öffnen, Abrechnung öffnen, drei Fenstergrössen, Breiten-Suche für den Wechsel zur Tabelle, Rechnung öffnen und zurück, Listen bei drei Grössen.

## Ablauf

- Liste der Abrechnungen: Ich erwartete versendete Abrechnungen. Der Filter «Versendet» zeigte 0, die versendeten sind alle «Bezahlt» oder «Überfällig».
- Kostenaufstellung bei 1440 px: Ich erwartete eine Tabelle mit Spalten und sah sechs gestapelte Karten. Die erste Position allein ist 338 px hoch, die Liste 2908 px.
- Kostenaufstellung bei 1920 px: wie erwartet eine Tabelle. Bei 1280 px wieder Karten, und schon die erste Karte füllt den sichtbaren Bereich.
- Nachrechnen Hauswart: Ich erwartete 3’000 × 25.63 % = 768.90, sah aber 768.75.
- Link «Gartenpflege Jahresabonnement»: Ich erwartete den Rechnungsbetrag CHF 368.00 wiederzufinden, die Rechnung lautet aber auf CHF 730.00.
- Zurück im Browser: Ich erwartete, wieder bei der Position Gartenpflege zu stehen, landete aber am Seitenanfang (scrollY 0).
- Rechnungsliste bei 1280 px: Ich erwartete eine Betragsspalte wie bei 1440 px und sah Karten mit linksbündigem Betrag; die Seite ist mehr als doppelt so hoch.
- Abrechnungsliste bei 1280 px: Ich erwartete eine Betragsspalte wie bei 1440 px; der Betrag steht direkt hinter der Bezeichnung.

## Vorschläge

- **P-1:** Fenster 1440 × 900, /statements, «Sarah Meier NK-22222222-2024-0002» öffnen, «Kostenaufstellung» ansehen: Karten statt Tabelle; ab etwa 1480 px Tabelle. Hilfreich: Die Tabelle schon ab einer Inhaltsbreite von etwa 960 px zeigen, z. B. mit schmaleren Spalten oder zweizeiligen Kopfzellen wie «Kosten des / Gebäudes», die bei 1500 px schon umbrechen. Mindestens bei 1440 px, besser auch bei 1280 px.
- **P-2:** In derselben Abrechnung Hauswart (25.63 %, CHF 3’000.00, CHF 768.75) und Kaltwasser (25.62 %) vergleichen. Hilfreich: Den Anteil so genau zeigen, dass das Nachrechnen aufgeht (z. B. 25.625 %), oder als Bruch «82 m² von 320 m²». Bei gleichem Schlüssel überall denselben Wert zeigen.
- **P-3:** In derselben Abrechnung unter Gartenpflege den Link öffnen: Rechnung CHF 730.00, in der Abrechnung CHF 368.00. Hilfreich: Am Rechnungslink «CHF 368.00 von CHF 730.00 (184 von 365 Tagen in der Periode)» o. ä. zeigen.
- **P-4:** Fenster 1280 × 800, /invoices: Karten mit linksbündigem Betrag, 6255 px Seitenhöhe. Hilfreich: Die Zeilen mit rechtsbündiger Betragsspalte wie bei 1440 px auch bei 1280 px beibehalten (genug Platz: rund 880 px Inhaltsbreite).
- **P-5:** Fenster 1280 × 800, /statements: Betrag direkt hinter «Nachzahlung»/«Rückerstattung». Hilfreich: Den Betrag in einer eigenen rechtsbündigen Spalte halten.

## Nicht geprüft

- Eine Abrechnung mit Status «Versendet» (nicht bezahlt): Die Demodaten haben keine (Filter «Versendet» zeigt 0). Ich habe eine bezahlte Abrechnung genommen.
- Eine Position mit unvollständigem Zeitanteil des Mieters (Wohnungsanteil ≠ Betrag): In der geprüften Abrechnung gab es keine. NK-22222222-2025-0003 (Nina Brunner, 184 Mietstage) wäre ein Kandidat, war aber nicht Teil meiner Aufgabe «versendet».
- Das PDF der Abrechnung habe ich nicht geöffnet.
- Den Dunkelmodus habe ich nicht angesehen.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/ba9a3a73-5b8c-5662-9110-5665ba186b50/scratchpad/weber-658/
