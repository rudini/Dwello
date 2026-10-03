# language: de
@dashboard
Funktionalität: Dashboard
  Als Liegenschaftsverwalter
  möchte ich auf einen Blick sehen, wie es um meine Liegenschaften steht
  damit ich weiss, wo ich handeln muss

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.02"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken

  Szenario: Belegung pro Gebäude
    Wenn der Liegenschaftsverwalter das Dashboard öffnet
    Dann ist das Gebäude "Seeblick" zu "50.0%" belegt
    Und sind im Gebäude "Seeblick" "1/2" Wohnungen vermietet

  Szenario: Gebäude aus der Belegung öffnen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter in der Belegung das Gebäude "Seeblick" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeblick"

  Szenariogrundriss: Kennzahl öffnen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Kennzahl "<Kennzahl>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Kennzahl  | Seite     |
      | Gebäude   | Gebäude   |
      | Wohnungen | Wohnungen |

  Szenariogrundriss: Gefilterte Kennzahl öffnen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Kennzahl "<Kennzahl>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"
    Und die Liste zeigt nur "<Status>"

    Beispiele:
      | Kennzahl         | Seite                   | Status          |
      | Vermietet        | Wohnungen               | Vermietet       |
      | Wiedervermietet  | Wohnungen               | Wiedervermietet |
      | Leer             | Wohnungen               | Leer            |
      | Gesperrt         | Wohnungen               | Gesperrt        |
      | Davon überfällig | Nebenkostenabrechnungen | Überfällig      |

  Szenariogrundriss: Abrechnungen nach Status öffnen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Abrechnungen "<Status>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und die Liste zeigt nur "<Status>"

    Beispiele:
      | Status     |
      | Entwürfe   |
      | Versendet  |
      | Bezahlt    |
      | Überfällig |

  Szenariogrundriss: Schnellaktion wählen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter die Schnellaktion "<Schnellaktion>" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Schnellaktion          | Seite                  |
      | Gebäude hinzufügen     | Neues Gebäude          |
      | Mieter hinzufügen      | Neuer Mieter           |
      | Rechnung erfassen      | Neue Rechnung          |
      | Abrechnungen erstellen | Abrechnungen erstellen |

  Szenariogrundriss: Aktion in der Kopfzeile wählen
    Angenommen der Liegenschaftsverwalter öffnet das Dashboard
    Wenn der Liegenschaftsverwalter oben die Aktion "<Aktion>" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Aktion                 | Seite                  |
      | Rechnung erfassen      | Neue Rechnung          |
      | Abrechnungen erstellen | Abrechnungen erstellen |
