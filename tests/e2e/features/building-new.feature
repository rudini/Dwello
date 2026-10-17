# language: de
@buildings
Funktionalität: Neues Gebäude erfassen
  Als Liegenschaftsverwalter
  möchte ich neue Gebäude erfassen
  damit ich ihre Wohnungen und Mietverträge verwalten kann

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Gebäude"

  Szenario: Gebäude erfassen
    Wenn der Liegenschaftsverwalter folgendes Gebäude erfasst:
      | Name    | Rosengarten |
      | Adresse | Rosenweg 5  |
      | PLZ     | 8400        |
      | Ort     | Winterthur  |
      | Kanton  | ZH          |
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Rosengarten"
    Und sieht der Liegenschaftsverwalter die Adresse "Rosenweg 5, 8400 Winterthur"

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter das Gebäude ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Adresse ist erforderlich."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Gebäudename ist erforderlich."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Kanton ist erforderlich."

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste
