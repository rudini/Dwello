# language: de
@statements
Funktionalität: Abrechnung bearbeiten
  Als Liegenschaftsverwalter
  möchte ich Zahlungsfrist und Bemerkungen einer Abrechnung anpassen
  damit ich Absprachen mit dem Mieter festhalten kann, ohne die berechneten Kosten zu verändern

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und für "Anna Keller" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Anna Keller"

  Szenario: Zahlungsfrist und Bemerkung festhalten
    Wenn der Liegenschaftsverwalter die Zahlungsfrist auf "2025-03-31" verlängert mit der Bemerkung "Ratenzahlung vereinbart"
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Und die Abrechnung ist zahlbar bis "31.03.2025"
    Und die Abrechnung enthält die Bemerkung "Ratenzahlung vereinbart"

  Szenario: Berechnete Kosten werden nur durch Neuerstellen korrigiert
    Dann sieht der Liegenschaftsverwalter, dass Kosten durch Neuerstellen der Abrechnung korrigiert werden

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Anna Keller"
