# Review A, Runde 2 – Nachprüfung von 771622f

Der Reviewer bestätigt H1, M1–M5 als behoben (Nachrechnung Meier/Brunner mit «Heizung + Warmwasser», Adressblöcke gegen den QR-Inhalt geprüft, PDFs DE/FR/IT angesehen) und die Begründungen für N4, N5, N6, N11.

| # | Schwere | Finding | Status |
|---|---|---|---|
| M-1 | mittel | Teiljahr: Pauschale lässt sich nicht nachrechnen (Proration nach Mietstagen nicht genannt) | behoben: «…, für Ihre 184 von 365 Tagen», Test in `statement-pdf.pg.test.ts` |
| n1 | niedrig | FR/IT/EN: «(365 Durée de location (jours))» | behoben: eigene Einheit pro Sprache |
| n2 | niedrig | Ruhezone unter dem QR-Code knapp, Zahlteil nicht 105 mm hoch | begründet offen: der Zahlteil wird in D2 nach SIX neu gebaut |
| n3 | niedrig | Alte Abrechnungen ohne gespeicherten Schlüssel; Heizprozent aus dem aktuellen Profil | begründet offen: vor der ersten Installation gibt es keine alten Abrechnungen; in D2 wird geprüft, ob der Heizanteil auf der Abrechnung gespeichert wird |
| n4 | niedrig | Beispiel P9 passt nicht zur Demo | behoben |
| n5 | niedrig | Verweis auf noch nicht vorhandenes Dokument | behoben (Verweis auf Schritt D1) |
| n6 | niedrig | Bereits committete Migration 0003 nachträglich geändert | begründet offen: beide Commits liegen unveröffentlicht auf demselben Branch; die Testdatenbanken entstehen neu aus den Migrationen; künftig neue Migration |
