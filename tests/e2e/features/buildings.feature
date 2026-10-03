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

  Szenario: Gebäude nach Namen suchen
    Wenn der Liegenschaftsverwalter nach "Lindenhof" sucht
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste
    Und die Liste enthält genau 1 Gebäude

  Szenario: Suche ohne Treffer
    Wenn der Liegenschaftsverwalter nach "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter den Hinweis "Keine Gebäude gefunden"

  Szenario: Gebäude nach Stadt filtern
    Wenn der Liegenschaftsverwalter die Gebäude nach der Stadt "Winterthur" filtert
    Dann sieht der Liegenschaftsverwalter das Gebäude "Lindenhof" in der Liste

  Szenario: Zur Erfassung eines neuen Gebäudes wechseln
    Wenn der Liegenschaftsverwalter ein neues Gebäude erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neues Gebäude"

  Szenario: Gebäude öffnen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenhof"

  Szenario: Route zum Gebäude planen
    Dann führt die Route in Google Maps von der Liste zu "Lindenhof" an "Testweg 1, 8400 Winterthur"
