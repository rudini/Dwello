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

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ auf "84" ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"

  Szenario: Über den Breadcrumb zur Gebäudeliste
    Wenn der Liegenschaftsverwalter im Breadcrumb "Gebäude" wählt
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste

  Szenario: Über den Breadcrumb zum Gebäude
    Wenn der Liegenschaftsverwalter im Breadcrumb "Eichenhof" wählt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
