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
    Und erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst

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

  Szenario: Beleg einer Rechnung anzeigen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann öffnet der Beleg die PDF-Datei "huber-q1.pdf"

  Szenario: Beleg ersetzen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann erklärt der Beleg "Wählen Sie die neue Datei und dann «Beleg ersetzen»."
    Wenn der Liegenschaftsverwalter den Beleg durch das Foto "huber-q1.jpg" ersetzt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"

  Szenario: Beleg zu einer erfassten Rechnung hinzufügen
    Wenn der Liegenschaftsverwalter das Foto "huber-q1.jpg" als Beleg hinzufügt
    Dann öffnet der Beleg die JPG-Datei "huber-q1.jpg"
    Und erinnert Dwello daran, die Originalrechnung aufzubewahren

  Szenario: Warnung beim Ersetzen des Belegs einer abgerechneten Rechnung
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann warnt der Beleg "Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen."

  # #96: eine abgerechnete Rechnung, die danach geändert wurde, steht in den Abrechnungen mit ihrem früheren Stand
  Szenario: Warnung bei einer nach der Abrechnung geänderten Rechnung
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und die Rechnung von "Hauswart Huber" kostet danach "480.00" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Dann warnt die Rechnung "gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon"

  # #378: von der Warnung zu den Abrechnungen, die neu zu erstellen oder zu berichtigen sind
  Szenario: Von der Warnung zu den Abrechnungen der Periode
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und die Rechnung von "Hauswart Huber" kostet danach "480.00" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Abrechnungen ohne diese Rechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode des laufenden Jahres zeigt

  Szenario: Rechnung mit Beleg löschen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung löschen will
    Dann sagt die Bestätigung zum Löschen der Rechnung "Der Beleg wird ebenfalls gelöscht."

  Szenario: Abgerechnete Rechnung mit Beleg löschen
    Angenommen die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Und der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung löschen will
    Dann rät die Bestätigung zum Löschen der Rechnung "Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen."
