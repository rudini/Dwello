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
    Dann ist das Gebäude "Seeblick" zu "50.0 %" belegt
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

  Szenario: Erinnerung bleibt nach dem Auszug des letzten Mieters
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" ist im letzten Jahr aus der Wohnung "2.01" ausgezogen
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" das Gebäude "Ahornhof"

  Szenario: Erinnerung endet mit der Abrechnung jedes Mietvertrags der Periode
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" ist im letzten Jahr aus der Wohnung "2.01" ausgezogen
    Und "Bruno Meier" hat die Abrechnung des letzten Jahres für das Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" das Gebäude "Seeblick", aber nicht das Gebäude "Ahornhof"

  # Eine Abrechnung im Gebäude genügt nicht: jeder Mietvertrag der Periode braucht seine eigene
  Szenario: Erinnerung bleibt, bis jeder Mietvertrag der Periode abgerechnet ist
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und der Mieter "Carla Huber" existiert
    Und "Bruno Meier" ist im letzten Jahr aus der Wohnung "2.01" ausgezogen
    Und "Carla Huber" ist im letzten Jahr aus der Wohnung "2.02" ausgezogen
    Und "Bruno Meier" hat die Abrechnung des letzten Jahres für das Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" das Gebäude "Ahornhof"

  # A-4: in der Kündigungszeit ist ein Nachmieter zu suchen; die Frist «Vertragsende» nennt den Vertrag nicht zweimal
  Szenario: Gekündigter Mietvertrag in der Übersicht
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Nachmieter für Wohnung 1.01 suchen" für "Anna Keller"

  Szenario: Gekündigter Mietvertrag kurz vor dem Ende
    Angenommen der Mietvertrag von "Anna Keller" ist in 30 Tagen gekündigt
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Nachmieter für Wohnung 1.01 suchen" für "Anna Keller"
    Und nennt die Übersicht keine Frist "Vertragsende Anna Keller"

  Szenario: Nachmieter erfasst
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "1.01" seit "2099-04-01" für "950" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht keine Aufgabe für den Mietvertrag von "Anna Keller"

  Szenario: Rechnungen von der Übersicht aus hochladen
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Schnellaktion "Rechnungen hochladen" wählt
    Dann kann der Liegenschaftsverwalter das Gebäude und die Dateien der Rechnungen wählen

  # A-6 (#115): nach einem abgelaufenen befristeten Mietvertrag ohne Nachmieter fragt die Übersicht, ob der Mieter
  # noch in der Wohnung wohnt (Art. 266 Abs. 2 OR)
  Szenario: Abgelaufener befristeter Mietvertrag ohne Nachmieter
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Befristeten Mietvertrag prüfen" für "Bruno Meier"

  Szenario: Aufgabe führt zum abgelaufenen befristeten Mietvertrag
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter die Aufgabe "Befristeten Mietvertrag prüfen" für "Bruno Meier" beginnt
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Bruno Meier"

  Szenario: Abgelaufener befristeter Mietvertrag mit Nachmieter
    Angenommen der Mieter "Bruno Meier" existiert
    Und der Mieter "Carla Huber" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und "Carla Huber" mietet die Wohnung "1.02" seit "2026-01-01" für "950" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht keine Aufgabe für den Mietvertrag von "Bruno Meier"

  Szenario: Mieter nach dem befristeten Mietvertrag ausgezogen
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und der Liegenschaftsverwalter hat bestätigt, dass "Bruno Meier" ausgezogen ist
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht keine Aufgabe für den Mietvertrag von "Bruno Meier"

  # gekündigte Mietverträge laufen nicht stillschweigend weiter: nur die Suche nach einem Nachmieter
  Szenario: Abgelaufener gekündigter Mietvertrag
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2025-12-31" gekündigt
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Nachmieter für Wohnung 1.01 suchen" für "Anna Keller"
    Aber nicht die Aufgabe "Befristeten Mietvertrag prüfen" für "Anna Keller"
