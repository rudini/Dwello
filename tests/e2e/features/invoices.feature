# language: de
@invoices
Funktionalität: Rechnungsliste
  Als Liegenschaftsverwalter
  möchte ich alle Rechnungen überblicken
  damit ich sehe, welche Kosten in die Nebenkostenabrechnung einfliessen

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Rechnungsliste

  Szenario: Rechnungen nach Rechnungssteller suchen
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "CHF 450.00" in der Kategorie "Hauswart"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Rechnungen nach Gebäude filtern
    Wenn der Liegenschaftsverwalter die Rechnungen nach dem Gebäude "Seeblick" filtert
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "CHF 450.00" in der Kategorie "Hauswart"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Rechnungen eines Jahres anzeigen
    Angenommen im Gebäude "Seeblick" gibt es eine Heizkostenrechnung über "3600.00" Franken für 2024
    Und im Gebäude "Seeblick" gibt es eine Heizkostenrechnung über "4100.00" Franken für 2025
    Wenn der Liegenschaftsverwalter die Rechnungen des Jahres 2024 im Gebäude "Seeblick" anzeigt
    Dann die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Nicht umlagefähige Rechnungen anzeigen
    Angenommen "Dachdecker Meier" stellt dem Gebäude "Seeblick" "3200.00" Franken für "Dachreparatur" in der Kategorie "Reparaturen" in Rechnung
    Wenn der Liegenschaftsverwalter die nicht umlagefähigen Rechnungen im Gebäude "Seeblick" anzeigt
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Dachdecker Meier" über "CHF 3’200.00" in der Kategorie "Reparaturen"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Manuell kategorisierte Rechnung
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Dann ist die Rechnung von "Hauswart Huber" als "Manuell" kategorisiert

  Szenario: Zur Erfassung einer neuen Rechnung wechseln
    Wenn der Liegenschaftsverwalter eine neue Rechnung erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Rechnung"

  Szenario: Rechnung ansehen
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Und der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" ansieht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Rechnung aus der Liste bearbeiten
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Und der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"
