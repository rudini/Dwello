# language: de
@contracts
Funktionalität: Mietvertragsliste
  Als Liegenschaftsverwalter
  möchte ich alle Mietverträge überblicken
  damit ich weiss, welche Wohnungen an wen vermietet sind

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Mietvertragsliste

  Szenario: Mietvertrag wird in der Liste angezeigt
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "AKTIV"

  Szenario: Mietverträge nach Mieter suchen
    Wenn der Liegenschaftsverwalter nach dem Mieter "Anna Keller" sucht
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "AKTIV"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  Szenario: Mietverträge nach Gebäude filtern
    Wenn der Liegenschaftsverwalter die Mietverträge nach dem Gebäude "Ahornhof" filtert
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "AKTIV"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  Szenario: Beendete Mietverträge anzeigen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter die beendeten Mietverträge im Gebäude "Ahornhof" anzeigt
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Bruno Meier" mit dem Status "Beendet"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  Szenario: Zur Erfassung eines neuen Mietvertrags wechseln
    Wenn der Liegenschaftsverwalter einen neuen Mietvertrag erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mietvertrag"

  Szenario: Mietvertrag ansehen
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" ansieht
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  Szenario: Mietvertrag aus der Liste bearbeiten
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Mietvertrag bearbeiten"
