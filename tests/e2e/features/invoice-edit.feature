# language: de
@invoices
Funktionalität: Rechnung bearbeiten
  Als Liegenschaftsverwalter
  möchte ich erfasste Rechnungen korrigieren
  damit die Nebenkostenabrechnung mit den richtigen Kosten rechnet

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter bearbeitet die Rechnung von "Hauswart Huber"

  Szenario: Betrag korrigieren
    Wenn der Liegenschaftsverwalter den Betrag auf "480.00" Franken korrigiert
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter den Betrag "CHF 480.00"

  Szenario: Rechnung einer nicht umlagefähigen Kategorie zuordnen
    Wenn der Liegenschaftsverwalter die Rechnung der Kategorie "Reparaturen" zuordnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter die Kategorie "Reparaturen" und den Verteilschlüssel "Pro Fläche (m²)"
    Und ist die Rechnung nicht umlagefähig

  Szenario: Rechnungssteller fehlt
    Wenn der Liegenschaftsverwalter die Rechnung ohne Rechnungssteller speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen Lieferanten ein"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Über den Breadcrumb zur Rechnung
    Wenn der Liegenschaftsverwalter im Breadcrumb "Hauswart Huber" wählt
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
