# language: de
@contracts
Funktionalität: Neuen Mietvertrag erfassen
  Als Liegenschaftsverwalter
  möchte ich Mietverträge erfassen
  damit Mietzins und Nebenkosten dem richtigen Mieter zugeordnet werden

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"

  Szenario: Unbefristeten Mietvertrag erfassen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2025-01-01" für "950" Franken vermietet
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Anna Keller" ist in der Liste auffindbar

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter den Mietvertrag ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie einen Mieter aus"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie eine Wohnung aus"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich"

  Szenario: Vermietete Wohnung ist nicht verfügbar
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Dann kann der Liegenschaftsverwalter die Wohnung "2.02" nicht auswählen

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
