# language: de
@contracts
Funktionalität: Mietvertrag bearbeiten
  Als Liegenschaftsverwalter
  möchte ich Mietzins und Vertragsdaten anpassen
  damit Mietzinserhöhungen und Korrekturen im Mietvertrag stehen

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"

  Szenario: Mietzins anpassen
    Wenn der Liegenschaftsverwalter den Mietzins auf "980" Franken ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist
    Und sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 980.00"

  Szenario: Mietzins fehlt
    Wenn der Liegenschaftsverwalter den Mietzins leert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich"

  Szenario: Mietzins in Schweizer Schreibweise
    Wenn der Liegenschaftsverwalter den Mietzins auf "1'450" Franken ändert
    Dann sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 1’450.00"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
