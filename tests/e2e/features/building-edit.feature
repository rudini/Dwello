# language: de
@buildings
Funktionalität: Gebäude bearbeiten
  Als Liegenschaftsverwalter
  möchte ich die Stammdaten eines Gebäudes korrigieren
  damit Abrechnungen und Verträge auf korrekten Daten beruhen

  Grundlage:
    Angenommen das Gebäude "Eichenhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite von "Eichenhof"

  Szenario: Baujahr ändern
    Wenn der Liegenschaftsverwalter das Baujahr auf "1972" ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
    Und sieht der Liegenschaftsverwalter das Baujahr "1972"

  # Der Abrechnungsassistent fragt dann nicht mehr nach dem Tankbestand (#72)
  @wip
  Szenario: Festhalten, dass das Gebäude keinen Tank hat
    Wenn der Liegenschaftsverwalter festhält, dass das Gebäude keinen Tank hat oder der Tank stillgelegt ist
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
    Und nennt die Gebäudeseite zum Tank "Kein Tank oder Tank stillgelegt"

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ auf "84" ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
