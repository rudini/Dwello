# Review A, Runde 1 – Seed-Daten und PDF-Inhalt

Unabhängiger Reviewer (frischer Kontext) auf Commit 884eed3. Er hat die Tests laufen lassen, die Demo-Daten in eine eigene Datenbank geladen, Müller 2024, den Mieterwechsel Seepark A2 2025 und Weber 2024 mit einem eigenen Skript nachgerechnet (Abweichung höchstens 1 Rappen Rundungsreihenfolge) und PDFs in Deutsch, Französisch und Italienisch gerendert und angesehen.

| # | Schwere | Finding | Status |
|---|---|---|---|
| H1 | hoch | QR-Rechnung: «Zahlbar durch» nur Name, «Zahlbar an» ohne Strasse; QR-Code enthält die Adressen | behoben: Adressblöcke wie im QR-Code, Test `statement-pdf.pg.test.ts` |
| M1 | mittel | Kein Regressionstest für 11 → 2 Seiten | behoben: Test zählt die Seiten; Gegenprobe ohne Fix ergibt 11 |
| M2 | mittel | Verwaltungspauschale ohne Grundlage, liest sich als 3 % der Mieterkosten | behoben: «3 % von CHF …, verteilt nach …/gleichmässig pro Wohnung»; der Schlüssel wird neu gespeichert (Migration 0004) |
| M3 | mittel | Mieterwechsel: eigene Mietdauer und Heizprofil fehlen im PDF | behoben: «Ihre Mietdauer … (n Mietstage)», Heizhinweis mit Profil und Prozent; Heizprofil wird gespeichert |
| M4 | mittel | Offene Punkte zu A nicht nachgeführt; englische Beschreibungen der Stammdaten | behoben: `offene-punkte.md` nachgeführt, Migration 0005 (deutsche Beschreibungen); Belegeinsicht und Rückerstattungsweg ausdrücklich Schritt D2 |
| M5 | mittel | Demo-Abrechnungen nur für einzelne Mietverträge eines Gebäudes | behoben: je Gebäude und Jahr alle Mietverträge (17 Abrechnungen), Test |
| N1 | niedrig | Rechenfehler 1'431.08 im Protokoll | behoben: 1'431.09 mit Einzelpositionen |
| N2 | niedrig | Akonto vorher/nachher unvollständig | behoben: alle Verträge aufgeführt |
| N3 | niedrig | Saldobereich im Protokoll falsch | behoben: aus allen 17 Abrechnungen |
| N4 | niedrig | `tests/contracts/statement.json` ohne Mieteradresse | begründet offen: die Verträge enthalten nur Felder, die das Frontend liest (README); das Frontend liest die Adresse nicht |
| N5 | niedrig | Entfernte tote Funktionen gehören nicht zur Aufgabe | begründet offen: das Fallow-Gate verlangt es für geänderte Dateien (CLAUDE.md «Fallow gate») |
| N6 | niedrig | Formular bietet keine Knöpfe für die Summen-Bausteine | begründet offen: die Hilfe erklärt sie mit Beispiel; acht Knöpfe überfordern Laien, vier Summen braucht kaum jemand |
| N7 | niedrig | Quelle der Heizprofile nicht vom Auftraggeber | behoben: Beschreibung nennt die gelieferte Tabelle |
| N8 | niedrig | «Nur Warmwasser» 8.50 statt 8.49 | behoben: Kommentar zur Rundung in der Migration |
| N9 | niedrig | Lange Leerstände, Seepark-Fernwärme mit Warmwasser | behoben: Leerstand als D14 dokumentiert; Seepark rechnet mit «Heizung + Warmwasser» |
| N10 | niedrig | Liegenschaft ohne PLZ und Ort | behoben |
| N11 | niedrig | «Kosten Liegenschaft» statt Glossar «Nebenkosten der Liegenschaft» | begründet offen: der Spaltenkopf passt im heutigen Layout nicht; die Neugestaltung (D2) verwendet den Glossarbegriff |
