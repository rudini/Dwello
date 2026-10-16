# language: de
@buildings
Funktionalität: Gebäudeliste
  Als Liegenschaftsverwalter
  möchte ich alle meine Gebäude überblicken
  damit ich schnell das richtige Gebäude finde

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Gebäudeliste

  Szenario: Gebäude wird in der Liste angezeigt
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste

  # F-4 (#58): dieselben Worte wie Übersicht und Wohnungsseiten
  Szenario: Künftig vermietete Wohnung auf der Gebäudekarte
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietet die Wohnung "1.01" seit "2099-11-01" für "900" Franken
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Dann nennt die Karte des Gebäudes "Lindenhof" "1 vermietet ab 01.11.2099"

  Szenario: Gebäude nach Namen suchen
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste
    Und die Liste enthält genau 1 Gebäude

  Szenario: Suche ohne Treffer
    Wenn der Liegenschaftsverwalter nach "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter den Hinweis "Keine Gebäude gefunden"

  Szenario: Gebäude nach Ort filtern
    Wenn der Liegenschaftsverwalter die Gebäude nach dem Ort "Winterthur" filtert
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste

  Szenario: Zur Erfassung eines neuen Gebäudes wechseln
    Wenn der Liegenschaftsverwalter ein neues Gebäude erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neues Gebäude"

  Szenario: Gebäude öffnen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenhof"

  Szenario: Route zum Gebäude planen
    Dann führt die Route in Google Maps von der Liste zu "Lindenhof" an "Testweg 1, 8400 Winterthur"
