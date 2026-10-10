# language: de
@categories
Funktionalität: Kostenkategorien
  Als Liegenschaftsverwalter
  möchte ich die Kostenkategorien pflegen
  damit Rechnungen richtig eingeordnet und nur umlagefähige Kosten abgerechnet werden

  Grundlage:
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"

  Szenario: Nur umlagefähige Kategorien anzeigen
    Angenommen es gibt die nicht umlagefähige Kategorie "Dachsanierung"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter nur die umlagefähigen Kategorien anzeigt
    Dann sieht der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung"
    Aber nicht die Kategorie "Dachsanierung"

  Szenario: Kategorie erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die nicht umlagefähige Kategorie "Fassadenreinigung" erfasst
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  Szenario: Name ist schon vergeben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die umlagefähige Kategorie "Treppenhausreinigung" erfasst
    Dann erfährt der Liegenschaftsverwalter, dass es die Kategorie "Treppenhausreinigung" schon gibt

  Szenario: Kategorie bearbeiten
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" als nicht umlagefähig speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Treppenhausreinigung" nicht umlagefähig

  Szenario: Bearbeitung abbrechen
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie "Treppenhausreinigung"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"

  Szenario: Kategorie löschen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Wenn der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" löscht
    Dann sieht der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" nicht mehr

  Szenario: Kategorien mit Rechnungen bleiben erhalten
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und eine Rechnung des Gebäudes "Seeblick" ist der Kategorie "Treppenhausreinigung" zugeordnet
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann wird die Kategorie "Treppenhausreinigung" von 1 Rechnung verwendet
    Und kann der Liegenschaftsverwalter die Kategorie "Treppenhausreinigung" nicht löschen
