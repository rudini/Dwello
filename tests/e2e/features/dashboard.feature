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

  # F-1 (#55): nur «x/y vermietet», ohne Anteil in Prozent
  Szenario: Belegung pro Gebäude
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann sind im Gebäude "Seeblick" "1/2" Wohnungen vermietet
    Und nennt die Belegung von "Seeblick" keinen Anteil in Prozent
    # Persona Anna P-1: auch eine nie vermietete leere Wohnung wird genannt
    Und nennt die Belegung von "Seeblick" "Wohnung 1.02 leer"
    Und erklärt die Belegung "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."

  # F-4 (#58): dieselben Worte wie Gebäudekarten und Wohnungsseiten
  Szenario: Künftig vermietete Wohnung in der Belegung
    Angenommen der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietet die Wohnung "1.02" seit "2099-11-01" für "900" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Belegung von "Seeblick" "1 vermietet ab 01.11.2099"

  # P-18 (#145): seit wann die Wohnung leer ist und wer ihre Nebenkosten trägt
  Szenario: Leere Wohnung in der Belegung
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2019-01-01" bis "2024-03-31" für "800" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Belegung von "Seeblick" "Wohnung 1.02 leer seit 01.04.2024"
    Und erklärt die Belegung "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."

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
      | Vermietet ab …      | Wohnungen               | Vermietet ab …  |
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

  # F-10a (#64): eine Mahnung schlägt die Übersicht erst nach der Mahnfrist vor (Vorgabe 14 Tage nach der Zahlungsfrist);
  # dass sie es vorher nicht tut, prüft src/__tests__/overview.test.ts: die Aufgabe zählt auch die Abrechnungen
  # parallel laufender Szenarien
  Szenario: Überfällige Abrechnung als nächste Aufgabe
    Angenommen "Anna Keller" hat eine versendete Abrechnung, deren Zahlungsfrist seit 15 Tagen abgelaufen ist
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Überfällige Abrechnungen prüfen"
    Und die Frist "Zahlungsfrist Anna Keller" ist "seit 15 Tagen abgelaufen"

  Szenario: Aufgabe führt zu den betroffenen Abrechnungen
    Angenommen "Anna Keller" hat eine versendete Abrechnung, deren Zahlungsfrist seit 15 Tagen abgelaufen ist
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
    Und "Bruno Meier" hat die Abrechnungen der letzten beiden Jahre für das Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" das Gebäude "Seeblick", aber nicht das Gebäude "Ahornhof"

  # #211: die Erinnerung prüft jede abgelaufene Abrechnungsperiode seit dem Vertragsbeginn, nicht nur die letzte
  @wip
  Szenario: Erinnerung nennt eine ältere Periode ohne Abrechnung
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.01" von "2023-01-01" bis "2023-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" für das Gebäude "Ahornhof" die Periode "2023"

  # #199: eine Abrechnung, die die Periode teilweise abdeckt, zählt; es fehlen nur die Tage ohne Abrechnung
  @wip
  Szenario: Erinnerung nennt nur die Tage ohne Abrechnung
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.01" von "2023-01-01" bis "2023-12-31" für "900" Franken
    Und für "Bruno Meier" gibt es die Abrechnung vom "2022-07-01" bis "2023-06-30" im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Aufgabe "Nebenkostenabrechnungen erstellen" für das Gebäude "Ahornhof" die Periode "01.07.2023 – 31.12.2023"

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

  # A-5 (#114): solange der Entwurf an die verlassene Wohnung ginge, steht die neue Adresse als Aufgabe da
  Szenario: Alte Adresse eines ausgezogenen Mieters als Aufgabe
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2024-06-30" für "900" Franken
    Und der Mietvertrag von "Bruno Meier" ist auf den "2024-06-30" gekündigt
    Und die Korrespondenzadresse von "Bruno Meier" ist noch die Adresse des Gebäudes "Seeblick"
    Und für "Bruno Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Neue Adresse eintragen" für "Bruno Meier"

  # A-5 mit A-6 (#114, #115): nach einem vereinbarten Ende ist der Mieter vielleicht geblieben; die Übersicht fragt
  # danach, statt eine neue Adresse zu verlangen
  Szenario: Abgelaufener befristeter Mietvertrag ohne bestätigten Auszug verlangt keine neue Adresse
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "1.02" von "2024-01-01" bis "2024-06-30" für "900" Franken
    Und die Korrespondenzadresse von "Bruno Meier" ist noch die Adresse des Gebäudes "Seeblick"
    Und für "Bruno Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann nennt die Übersicht die Aufgabe "Befristeten Mietvertrag prüfen" für "Bruno Meier"
    Und nennt die Übersicht keine Aufgabe "Neue Adresse eintragen" für "Bruno Meier"

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
