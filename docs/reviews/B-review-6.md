# Review B, Runde 6

Vier unabhängige Prüfungen auf Commit c95fd55: Code-Review (CR6), Fachreview Immobilienverwalter/Treuhänder (IV6, Ablauf Nachzügler → Entwurf löschen → neu erstellen in einer eigenen Testliegenschaft), Fachreview Mietrecht (MR6), Datenprüfer (DP6: alle 17 Demo-Abrechnungen und 30 Sommer-Vorschauen mit eigenem Skript nachgerechnet, alle genau; Prüfung auf fehlende Rechnungen 2025 wie erwartet).

Kein Finding kritisch oder hoch. Alle Findings der Runde 5 behoben oder begründet offen. Das Übergehen von Mietverträgen mit Abrechnung verschiebt keine Kosten auf andere Mieter (MR6, Verteilung über alle Wohnungen). Jede Behandlung mit einem Test, der vorher scheiterte.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR6-2, MR6-1, IV6-2 | mittel | Texte verlangen eine berichtigte Abrechnung, die Dwello für versendete Abrechnungen nicht erstellen kann | Texte: «Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello …» (Nachzügler, Bearbeiten, Löschen); offener Punkt «Berichtigung versendeter Abrechnungen» |
| CR6-1, IV6-4 | mittel / niedrig | Leere Vorschau, wenn alle Mietverträge schon eine Abrechnung haben: ohne Anleitung, Fehlertext weist in die falsche Richtung | Hinweis «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …» mit Link je Gebäude; Fehlertext ergänzt (DOM-Test) |
| IV6-1, MR6-3 | mittel / niedrig | Hilfetext Heizprofil: «Zähler» ohne Bezug (Strom, Kaltwasser) | «Zähler für Heizung oder Warmwasser oder Heizkostenverteiler …», «die Zähler für Heizung oder Warmwasser in der Wohnung abgelesen» |
| IV6-3 | niedrig | Versendete Abrechnung zeigt später erfasste Rechnungen nicht | Hinweis für alle Abrechnungen; bei versendeten «Berichtigen Sie die Abrechnung ausserhalb von Dwello gegenüber dem Mieter.» |
| MR6-5 | niedrig | Löschdialog: Rückzahlung nicht erwähnt | «… und zahlen zu viel Bezahltes zurück» |
| MR6-4, IV6-8 | niedrig | Tank-Texte nur für Öl (Liter) | «Menge im Tank oder Lager mal Preis pro Einheit (Liter, kg oder Ster)»; Leistungszeitraum: «Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz» |
| IV6-7 | niedrig | Tankbestand löschen ohne Anleitung für Entwürfe | Löschdialog: «Löschen Sie danach die Entwürfe dieser Periode und erstellen Sie die Abrechnungen erneut.» |
| IV6-9 | niedrig | Akonto-Erhöhung bei beendetem Mietvertrag vorgeschlagen | bei Auszug in der Periode nur die Abweichung, keine Erhöhung (Unit-Test) |
| CR6-3 | niedrig | `.gitignore` traf den Symlink `backend/node_modules` nicht (c95fd55 hatte ihn eingecheckt, a002d24 entfernt) | Muster ohne Schrägstrich |
| IV6-6 | niedrig | Nummer eines gelöschten Entwurfs wird wieder vergeben | offener Punkt (nur Entwürfe; eine Sequenz wäre belastbar) |
| MR6-2 | niedrig | Nachzügler ohne Leistungszeitraum landet still in der nächsten Periode | offener Punkt |
| MR6-6 | niedrig | Erneut erstellen kann andere Einstellungen bringen | offener Punkt |
| IV6-5, IV6-10 | niedrig | Vorschau zählt veraltete Entwürfe nicht; ausserhalb abgerechnete Wohnung erhält bei jedem Lauf wieder einen Entwurf | offene Punkte |
| DP6-1, DP6-2 | niedrig | Teilperiode ohne Leistungszeitraum; Vorschau ohne Tankbestand zeigt nicht, dass der Einkauf zählt | offene Punkte (die Prüfung meldet fehlende Stände mit Bestätigung) |
| CR6-4, CR6-5, DP6-3, DP6-4 | Info | doppelte Abfrage der Abrechnungen; Wechsel der Periode; Tank-Frage bei Fernwärme; Testliegenschaft eines Prüfers in der Demo-DB | ohne Änderung; die Demo-DB wird neu geladen |
