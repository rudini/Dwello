# Review B, Runde 5

Drei unabhängige Prüfungen auf Commit a2c4ce7: Code-Review (CR5), Fachreview Immobilienverwalter/Treuhänder (IV5, in der laufenden App mit Playwright), Fachreview Mietrecht (MR5). Der Datenprüfer rechnet in Runde 6 nach, weil diese Runde die Verteilung nur umbaut (Sommerperiode mit `calculateDaysBetween`, gleiche Werte).

Kein Finding ist kritisch oder hoch. Alle Findings der Runde 4 sind behoben oder begründet offen; teilweise behoben waren IV4-1/MR4-8 (Nachzügler) und MR4-7 (Holz), jetzt vollständig (CR5-1, IV5-1, IV5-2, CR5-3). Jede Behandlung hat einen Test, der vorher scheiterte.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR5-1 | mittel | Hinweis «Nicht in den Abrechnungen» verschwindet, sobald es in der Periode auch neue Abrechnungen gibt; alte Entwürfe ohne die Rechnung bleiben | `statementPeriods`: eine Periode kann in beiden Listen stehen (Unit-Test) |
| IV5-2 | mittel | «Entwürfe erstellen Sie neu» führt zu doppelten Abrechnungen, der Assistent erstellt auch für Mietverträge mit Abrechnung (auch versendet) neue Entwürfe | Der Assistent übergeht Mietverträge, die in der Periode schon eine Abrechnung haben (`contractsInPeriod`, API-Treiber ebenso); Szenario «Abrechnungen erneut erstellen ergänzt nur die fehlenden» (@api). Texte: «Löschen Sie die Entwürfe dieser Periode und erstellen Sie die Abrechnungen erneut» (Nachzügler, Bearbeiten, Löschen); Vorschau: «Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue …» |
| IV5-1 | mittel | Hinweis nur auf Rechnungsdetail und -bearbeitung; der Entwurf zeigt nichts und lässt sich versenden | Der Entwurf zeigt «Rechnungen fehlen im Entwurf: Seit dem Erstellen dieses Entwurfs wurden n Rechnungen für die Abrechnungsperiode erfasst …» (`laterInvoices` in `statements/[id]/+page.server.ts`, DOM- und Load-Test). Dabei behoben: `buildingId` der Abrechnung war immer leer (`toStatement` las `apartment.buildingId`, die API liefert `building.id`; Vertrag `statement.json` ergänzt) |
| IV5-3, MR5-I1 | niedrig / Info | Löschdialog erwähnt die Entwürfe nicht | «Die Entwürfe enthalten sie weiter: Löschen Sie danach die Entwürfe und erstellen Sie die Abrechnungen erneut.» |
| IV5-4 | niedrig | Vorschau: Warnung laufende Periode ohne Handlungsanweisung; Stichtag in der Zukunft verlangt | Satz «Erstellen Sie die Abrechnungen erst nach dem Ende der Periode.» ergänzt; Hinweis zum fehlenden Endbestand bleibt (die Warnung sagt, warum), offen |
| IV5-5, MR5-1 | niedrig | «löschen Sie ihren Entwurf»: bei Mieterwechsel zwei Entwürfe; neu erstellte entstehen wieder | «… löschen Sie die Entwürfe aller Mietverträge dieser Wohnung, auch wenn Sie die Abrechnungen später neu erstellen.» |
| IV5-6 | niedrig | Heizkostenverteiler nicht als Zähler erkannt | «Zähler oder Heizkostenverteiler (kleine Geräte an den Heizkörpern)» |
| MR5-2 | niedrig | Text «Neu» setzt wie der Akonto-Hinweis einen Kündigungstermin voraus (befristeter Vertrag) | TODO und offener Punkt auf beide Texte erweitert |
| MR5-3, CR5-10 | niedrig / Info | Nachzügler-Hinweis sagt nicht, was zu tun ist | «Für versendete Abrechnungen schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. Nehmen Sie die Kosten nicht in die Abrechnung der nächsten Periode. … Lassen Sie sich im Zweifel beraten.» (TODO fachlich prüfen bleibt) |
| MR5-4 | niedrig | Flüssiggas im Tank; «Gas» schliesst es aus | «Öl, Flüssiggas, Pellets oder Holz» / «Fernwärme, Erdgas aus der Leitung oder Wärmepumpe» |
| CR5-2 | niedrig | Stände einer nicht mehr umlagefähigen Kategorie ohne Kategorienamen | BFF nennt die Kategorie jedes Stands aus allen Kategorien (`categoryName`, Test); Vorauswahl einer nicht mehr wählbaren Kategorie offen (selten, Verwalter ändert die Kategorie selbst) |
| CR5-3 | niedrig | Gebäude-Panel nennt nur Öl und Pellets | Titel «Brennstoff im Tank oder Lager», «Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen.» |
| CR5-4, IV5-7 | niedrig / Info | Kaminfeger über den internen Namen ausgeschlossen; eigene Heizkategorien wählbar | offener Punkt (Eigenschaft «Brennstoff» an der Kategorie) |
| CR5-5 | niedrig | Zweig `tank` in `findingText` tot | entfernt |
| CR5-6 | niedrig | Tageszweig dupliziert `calculateDaysBetween`; Test erkennt nur Anteil 1 | `calculateDaysBetween`; Test mit Einzug in der Sommerperiode (62/92 Tage); PDF-Text «nach Heizprofil» für diesen Fall offen (selten) |
| CR5-7 | niedrig | Neue Zustände nicht im axe-Check | Bildschirme `invoice-billed-detail` (mit Löschdialog), `invoice-billed-edit`, `invoice-late-detail`, Zustand `tank-question`; der Entwurf (`statement-detail`) zeigt jetzt den Hinweis auf später erfasste Rechnungen. Ladefehler der Kategorien auf der Gebäudeseite nicht im Check: braucht ein ausfallendes Backend, gleiches `Alert` wie geprüfte Zustände |
| CR5-8 | Info | Jahr der Abrechnung lokal, Rechnungsdatum UTC | Schritt nimmt das Jahr in UTC; doppelter Schrittrumpf bleibt (zwei Wortlaute für Grundlage und Handlung) |
| CR5-9 | Info | Umformatierungen in nicht betroffenen Zeilen | in dieser Runde nur geänderte Zeilen formatiert |
| MR5-I2, MR5-I3 | Info | Kündigungsandrohung (Art. 269d Abs. 2 lit. c OR); «Vorrat» statt «Tankbestand» | ausreichend bzw. Glossar-Vorschlag «Vorrat» in den offenen Punkten |
| MR5 (Randfall) | Info | Kategorie nicht umlagefähig, einzelne Öl-Rechnung umlagefähig markiert: Einkauf statt Verbrauch | offener Punkt |
