# language: de
@invoices
Funktionalität: Rechnungsdetail
  Als Liegenschaftsverwalter
  möchte ich eine Rechnung im Detail sehen
  damit ich prüfen kann, wie sie in der Nebenkostenabrechnung verteilt wird

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Rechnungsdetails anzeigen
    Dann sieht der Liegenschaftsverwalter den Betrag "CHF 450.00"
    Und sieht der Liegenschaftsverwalter die Kategorie "Hauswart" und den Verteilschlüssel "Pro Fläche (m²)"
    Und ist die Rechnung umlagefähig

  Szenario: Nicht umlagefähige Rechnung
    Angenommen "Dachdecker Meier" stellt dem Gebäude "Seeblick" "3200.00" Franken für "Dachreparatur" in der Kategorie "Reparaturen" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Dachdecker Meier"
    Dann ist die Rechnung nicht umlagefähig
    Und erklärt ein Hinweis, dass die Kosten nach Mietrecht nicht auf die Mieter umlegbar sind

  Szenario: Neu kategorisieren ohne laufende KI
    Wenn der Liegenschaftsverwalter die Rechnung neu kategorisieren lässt
    Dann erfährt der Liegenschaftsverwalter, dass die KI nicht erreichbar ist oder keine passende Kategorie geliefert hat
    Und sieht der Liegenschaftsverwalter die Kategorie "Hauswart" und den Verteilschlüssel "Pro Fläche (m²)"

  Szenario: Rechnung löschen
    Wenn der Liegenschaftsverwalter die Rechnung löscht
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
    Und die Rechnung von "Hauswart Huber" ist nicht mehr auffindbar

  Szenario: Rechnung bearbeiten
    Wenn der Liegenschaftsverwalter die Rechnung bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"

  Szenario: Zum Gebäude wechseln
    Wenn der Liegenschaftsverwalter das Gebäude der Rechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeblick"

  @wip
  Szenario: Beleg einer Rechnung anzeigen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann öffnet der Beleg die PDF-Datei "huber-q1.pdf"

  @wip
  Szenario: Beleg ersetzen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter den Beleg durch das Foto "huber-q1.jpg" ersetzt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"

  @wip
  Szenario: Beleg zu einer erfassten Rechnung hochladen
    Wenn der Liegenschaftsverwalter den Beleg durch das Foto "huber-q1.jpg" ersetzt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"

  @wip
  Szenario: Rechnung mit Beleg löschen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung löschen will
    Dann sagt die Bestätigung zum Löschen der Rechnung "Der Beleg wird ebenfalls gelöscht."
