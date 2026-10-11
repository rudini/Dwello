# Review D2, Runde 1 – PDF der Nebenkostenabrechnung

Vier unabhängige Prüfungen auf Commit 6888bf2: Code-Review (CD, mit PDFs aus Demo- und Randfalldaten), Fachreview Immobilienverwalter/Treuhänder (DIV, 9 PDFs in de/fr/it/en), Fachreview Mietrecht (DMR, dazu Runde 2 des Recherche-Dokuments D1R2), Datenprüfer (DDP: alle 17 Demo-PDFs mit eigenem Skript nachgerechnet, QR-Codes dekodiert; alle Beträge genau, 1 Rappen Rundungsfrage DDP-3).

Kein Finding kritisch. Hoch waren der fehlende Bruch des Verteilschlüssels (drei Prüfer), der rätoromanische Zahlteil, überlappende Zeilen im Zahlteil und die Tankherleitung aus späteren Ständen. Jede Behandlung mit einem Test, der vorher scheiterte (`statement-pdf-render.test.ts`, `statement-pdf.pg.test.ts`, `statement-pdf-data.test.ts`).

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| DIV-01, DMR-01, DDP-2 | hoch | Verteilschlüssel ohne Einheiten: Wohnungsanteil nicht nachrechenbar | je Zeile «75.50 / 492.50 m²», «1 / 6 Wohnungen», «Zimmer»; gemischter Schlüssel als Prozent der Liegenschaftskosten |
| DMR-02, CD-5 | hoch / mittel | Zahlteil auf Rätoromanisch (SIX: de/fr/it/en) | Zahlteil bei `rm` deutsch |
| CD-1 | hoch | lange Werte überlappen im Zahlteil | Zeilen rücken mit ihrer Höhe vor |
| CD-2 | hoch | Tankherleitung aus den Ständen beim Drucken; zwei Positionen derselben Kategorie | Stände mit der Abrechnung gespeichert (`fuel_stock`, Migration 0011); Rechnungen = alle Positionen der Kategorie − Veränderung |
| CD-3, DMR-03 | mittel | «Zusätzliche Informationen» übersetzt, QR-Code deutsch | gedruckt wird die Mitteilung aus dem QR-Code |
| CD-4 | mittel | «Zahlbar durch» ohne Adresse, QR-Code ohne Debitor | nur mit Name, PLZ und Ort, wie im QR-Code |
| CD-6, DIV-06, DDP-6 | mittel / niedrig | Tabellenkopf fehlt auf Folgeseiten; Linie vor Summe allein; Tankblock und Hinweise zerrissen | Kopf wiederholt; Linie mit ihrer Zeile; Heizungsblock und Hinweise bleiben zusammen |
| CD-7 | mittel | Saldo 0 als «Nachzahlung … mit dem Zahlteil» | «Ausgeglichen … Sie müssen nichts bezahlen.» |
| CD-8 | mittel | Zeichen ausserhalb Windows-1252 verstümmelt | nächstliegende Buchstaben («Łukasz» → «Lukasz»); Schrift einbetten offen |
| DIV-03, DMR-10 | mittel / niedrig | Heizprofil-Anteil ohne Herleitung | Monate des Mietverhältnisses mit ihren Anteilen; Quelle der Tabelle offen |
| DIV-04 | mittel | Kosten Liegenschaft nach Leistungszeitraum nicht erklärt; Bestandssatz auch bei Fernwärme | Fussnote «eine Rechnung mit Leistungszeitraum zählt mit den Tagen …»; Bestandssatz nur mit Tank |
| DIV-05, DMR-06, D1R2-06 | mittel / niedrig | Rückerstattung ohne Termin, «falls wir sie nicht kennen» | «Wir überweisen Ihnen den Betrag bis {Frist}. Teilen Sie uns dafür Ihre IBAN mit, falls Sie das noch nicht getan haben.» |
| DIV-07, DMR-05 | mittel | Zahlungsfrist ab Erstellung des Entwurfs; bezahlte Abrechnung mit Zahlteil | PDF eines Entwurfs datiert auf heute mit voller Frist (nie kürzer); bezahlt: «Bezahlt am …», kein Zahlteil |
| DDP-1, CD-12 | mittel / niedrig | Zeitanteil gerundet, Taschenrechner-Probe 1 Rappen daneben | Zeitanteil als «181/365 Tage», Heizprofil in Prozent (zwei Stellen) |
| DMR-08 | niedrig | «Heizkosten» statt Heiz- und Warmwasserkosten, Bevollmächtigte fehlen | «… der Heiz- und Warmwasserkosten (Art. 8 Abs. 1 VMWG)», «Sie oder eine bevollmächtigte Person …», Bestand Abs. 2 |
| DDP-4 | niedrig | «Ihrer Nebenkosten» für die Zwischensumme | «3 % der Zwischensumme von CHF …» |
| DDP-5 | niedrig | QR-Referenz von links gruppiert | von rechts (SIX) |
| DDP-7 | niedrig | uneinheitliche Prozente | zwei Stellen |
| DMR-12 | niedrig | QR-Bild 166 px, Module ungleich | 10 Pixel je Modul; Hausnummer und Land offen |
| CD-9 | niedrig | lange Absenderzeile überdeckt die Linie | gekürzt mit «…» |
| CD-10 | niedrig | tote Übersetzungen, `sharePercentage` | entfernt |
| CD-11 | niedrig | schwache Tests, Szenario @wip | Tests für Zusatzinfo, Kopf, Saldo 0, rm, Debitor, bezahlt; Szenario ohne @wip nach grünem Lauf |
| DIV-11, DIV-12, DIV-13, DMR-11 | niedrig | Sprache fr/it/en | fr: « … » mit Leerschlag, « : », Sätze umformuliert; it: «La sua quota», Formulierungen; en: Gross-/Kleinschreibung; Profilnamen («Altipiano») sind Stammdaten, offen |
| DIV-14 | niedrig | «Ihre Mietdauer» missverständlich, kein Briefrahmen | «Ihr Mietverhältnis in dieser Periode»; Briefrahmen offen |
| DDP-3 | niedrig | doppelte Rundung gegen das Dokument | Regel im Dokument angepasst (Wohnungsanteil gerundet × Zeitanteil) |
| DIV-02, DMR-07, DIV-08, DMR-09, DIV-09, DIV-10, CD-13 | niedrig/mittel | Liter, Kontakt, Akonto je Monat, Pauschale-Basis, Abweichungen vom Vorschlag | offene Punkte (`offene-punkte.md`, step D2) |
| D1R2-01 … 05 | niedrig | Dokument: Datum v2.4, Quelle «Fachwissen», Leerstand, 4C.24/2002, 6c | korrigiert |
