# Review D2, Runde 2 – PDF der Nebenkostenabrechnung

Vier unabhängige Prüfungen auf Commit aaa6544:
- **Code-Review (CD2):** mit PDFs aus Demo- und Randfalldaten, alter gegen neuer QR-Payload in 24 Fällen.
- **Fachreview Immobilienverwalter/Treuhänder (DIV2) und Mietrecht/QR-Rechnung (DMR2):** 12 PDFs in de, fr, it, en und rm.
- **Datenprüfer (DDP2):** alle 17 Demo-PDFs mit eigenem Skript aus der Datenbank nachgerechnet, QR-Codes dekodiert. Alle Beträge sind genau.

Kein Finding ist kritisch. Hoch waren:
- die Demodaten, deren Datum beim Laden überschrieben wurde (drei Prüfer);
- der gemischte Schlüssel, der sich aus einem gerundeten Prozentwert nicht nachrechnen liess.

Jede Behandlung hat einen Test, der vorher scheiterte.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CD2-1, DDP2-1, DIV2-02 | hoch | Demodaten: das PDF eines Entwurfs datierte versendete und bezahlte Abrechnungen auf den Ladetag (bezahlt 17 Monate vor dem Datum) | Demodaten versenden zuerst, setzen dann Datum und Frist von damals und erzeugen erst danach das PDF; Test für Datum und `paid_date > statement_date`; Zeitgrenze des Hooks 60 s (CD2-8) |
| DDP2-2, DIV2-04 | hoch / niedrig | gemischter Schlüssel nur als «15.73 %», nicht auf den Rappen nachrechenbar; auf Englisch ohne Gewichtung | als Rechnung gedruckt: «70 % × 75.50 / 492.50 m² + 30 % × 1 / 6 Wohnungen», in jeder Sprache; nur wenn die Gewichte 100 % ergeben, sonst bleibt der Prozentwert |
| DIV2-01, CD2-2 | mittel | Datum und Frist ab dem Erstellen des PDF, nicht ab dem Versand; Frist sofort abgelaufen und «überfällig» | «Als versendet markieren» datiert auf den Versandtag mit voller Frist (eine spätere bleibt) und verwirft ein älteres PDF; Dialog: «Die Zahlungsfrist läuft ab dem Tag, an dem Sie die Abrechnung als versendet markieren …»; Datum in Schweizer Zeit; gespeichert erst nach dem Rendern; Test für «spätere Frist bleibt». Eine kürzere, bewusst gesetzte Frist wird beim Versand verlängert (begründet offen, `offene-punkte.md`) |
| CD2-3 | mittel | Bruch des Schlüssels aus den aktuellen Wohnungen, Betrag aus der Erstellung | Fläche, Wohnungen und Zimmer mit der Abrechnung gespeichert (`key_values`, Migration 0011); ältere Abrechnungen nehmen die aktuellen |
| DMR2-01 | mittel | Rätoromanisch halb rätoromanisch, halb deutsch | das ganze PDF deutsch, bis alles übersetzt ist; Hinweis im Mieterformular bei der Sprache |
| CD2-4 | mittel (Test) | Test für den wiederholten Tabellenkopf prüfte nichts | zählt «Kategorie Verteilschlüssel» je Seite |
| CD2-5 | mittel | lange Kategorie im Tankblock überdeckte die nächste Zeile | Zeilen rücken mit ihrer Höhe vor, Blockhöhe daraus |
| CD2-6, DIV2-03 | niedrig | bezahlte Rückerstattung: «Bezahlt am … Vielen Dank.» | «Überwiesen am …» in allen Sprachen |
| CD2-7 | niedrig | Summenblock zerrissen, Saldo allein auf der nächsten Seite | Zwischensumme bis Saldo bleiben zusammen; Test mit 10 bis 20 Positionen |
| CD2-9 | niedrig | `fuel_stock` in die bestehende Migration 0011 nachgetragen | 0011 lag nur auf dem Arbeitszweig; Test- und D2-Datenbanken neu erstellt, `key_values` ebenfalls in 0011, vor dem Merge |
| CD2-10, DDP2-3, DIV2-06 | niedrig | Monatsanteile «Dez 13 %» neben «Okt 9.5 %» | zwei Stellen; Tage eines geteilten Monats offen |
| DIV2-05 | niedrig | Mitteilung im QR-Code deutsch auf fr/it/en | «{Titel} {Nummer}» in der Sprache des PDF, gedruckt wie im QR-Code |
| DIV2-07 | niedrig | Fussnote «die Rechnungen» widerspricht dem Tank | mit Tank: «Kosten Liegenschaft bei Heizmaterial aus dem Tank: der Verbrauch (siehe Heiz- und Warmwasserkosten).» |
| DIV2-08 | niedrig | fr «d’ici au», «dans cette période» | «jusqu’au», «pendant la période»; «Portiere» und «EG, EG» sind Stammdaten (offen) |
| DDP2-4 | niedrig | QR-Daten enden auf `EPD\n` | begründet offen: das ist das leere letzte Element «Rechnungsinformationen» (32 Elemente, wie der bestehende Test), kein Zeilenumbruch danach |
| DMR2-02 | niedrig | IBAN erbeten, nur Postadresse | offen mit DMR-09 (Kontakt in der Konfiguration) |
| Lint | – | ungenutzter Import `StatementForQRBill` | entfernt |

Daneben: Szenario «overlap-warning» im Barrierefreiheitstest wartet auf den Vorschlag des Vertragsbeginns, bevor es tippt (ein Lauf zeigte «01.01.210001.01.2020»).
