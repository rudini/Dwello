# language: de
@dashboard
Funktionalität: Übersicht
  Als Liegenschaftsverwalter
  möchte ich auf einen Blick sehen, was jetzt zu tun ist und welche Fristen anstehen
  damit ich nichts verpasse, auch wenn ich die App nur selten öffne

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.02"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken

  Szenario: Belegung pro Gebäude
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann ist das Gebäude "Seeblick" zu "50.0%" belegt
    Und sind im Gebäude "Seeblick" "1/2" Wohnungen vermietet

  Szenario: Gebäude aus der Belegung öffnen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter in der Belegung das Gebäude "Seeblick" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Seeblick"

  Szenariogrundriss: Kennzahl öffnen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Kennzahl "<Kennzahl>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Kennzahl  | Seite     |
      | Gebäude   | Gebäude   |
      | Wohnungen | Wohnungen |

  Szenariogrundriss: Gefilterte Kennzahl öffnen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Kennzahl "<Kennzahl>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"
    Und die Liste zeigt nur "<Status>"

    Beispiele:
      | Kennzahl            | Seite                   | Status          |
      | Vermietet           | Wohnungen               | Vermietet       |
      | Wiedervermietet     | Wohnungen               | Wiedervermietet |
      | Leer                | Wohnungen               | Leer            |
      | Gesperrt            | Wohnungen               | Gesperrt        |
      | Überfällige Beträge | Nebenkostenabrechnungen | Überfällig      |

  Szenariogrundriss: Abrechnungen nach Status öffnen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Abrechnungen "<Status>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und die Liste zeigt nur "<Status>"

    Beispiele:
      | Status     |
      | Entwürfe   |
      | Versendet  |
      | Bezahlt    |
      | Überfällig |

  Szenariogrundriss: Häufige Arbeit direkt beginnen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Schnellaktion "<Schnellaktion>" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Schnellaktion          | Seite                  |
      | Mieter erfassen        | Neuer Mieter           |
      | Mietvertrag erfassen   | Neuer Mietvertrag      |
      | Rechnung erfassen      | Neue Rechnung          |
      | Abrechnungen erstellen | Abrechnungen erstellen |

  Szenario: Überfällige Abrechnung als nächste Aufgabe
    Angenommen "Anna Keller" hat eine versendete Abrechnung, deren Zahlungsfrist seit 5 Tagen abgelaufen ist
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Überfällige Abrechnungen prüfen"
    Und die Frist "Zahlungsfrist Anna Keller" ist "seit 5 Tagen abgelaufen"

  Szenario: Aufgabe führt zu den betroffenen Abrechnungen
    Angenommen "Anna Keller" hat eine versendete Abrechnung, deren Zahlungsfrist seit 5 Tagen abgelaufen ist
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Aufgabe "Überfällige Abrechnungen prüfen" beginnt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und die Liste zeigt nur "Überfällig"

  Szenario: Entwürfe als Aufgabe
    Angenommen "Anna Keller" hat eine Abrechnung im Entwurf
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Abrechnungen prüfen und versenden"

  Szenario: Bevorstehende Zahlungsfrist
    Angenommen "Anna Keller" hat eine versendete Abrechnung, deren Zahlungsfrist in 10 Tagen abläuft
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann ist die Frist "Zahlungsfrist Anna Keller" "in 10 Tagen"

  Szenario: Bevorstehendes Vertragsende
    Angenommen der Mietvertrag von "Anna Keller" endet in 30 Tagen
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann ist die Frist "Vertragsende Anna Keller" "in 30 Tagen"
