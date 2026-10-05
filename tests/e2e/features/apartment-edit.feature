# language: de
@apartments
Funktionalität: Wohnung bearbeiten
  Als Liegenschaftsverwalter
  möchte ich die Angaben einer Wohnung korrigieren
  damit Flächen und Zimmer für die Abrechnungen stimmen

  Grundlage:
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.02"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"

  Szenario: Fläche korrigieren
    Wenn der Liegenschaftsverwalter die Fläche auf "74.5" ändert
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 4.01"
    Und hat die Wohnung "3.5" Zimmer und "74.5 m²" im Stockwerk "1. OG"

  Szenario: Wohnung sperren
    Wenn der Liegenschaftsverwalter die Wohnung sperrt
    Dann hat die Wohnung den Status "Gesperrt"

  Szenario: Vermietet ergibt sich aus dem Mietvertrag
    Angenommen der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "4.02" seit "2020-01-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.02"
    Dann kann der Liegenschaftsverwalter den Status "Vermietet" nicht von Hand ändern

  Szenario: Wohnungsnummer ist im Gebäude schon vergeben
    Wenn der Liegenschaftsverwalter die Wohnungsnummer auf "4.02" ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Wohnungsnummer 4.02 existiert bereits in diesem Gebäude."

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 4.01"
