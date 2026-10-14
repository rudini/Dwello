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

  Szenario: Eigene Kategorie mit gleichem englischem Namen zeigt ihre Beschreibung
    Angenommen es gibt die eigene Kategorie "Internet" mit gleichem englischem Namen und der Beschreibung "Glasfaseranschluss im Keller"
    Und der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann sieht der Liegenschaftsverwalter bei der Kategorie "Internet" die Beschreibung "Glasfaseranschluss im Keller"

  Szenario: Vordefinierte Kategorien, deren Kosten der Vermieter trägt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Kategorien"
    Dann ist die vordefinierte Kategorie "Schädlingsbekämpfung" nicht umlagefähig
    Und ist die vordefinierte Kategorie "Feuerlöscher-Wartung" nicht umlagefähig

  @wip
  Szenario: KI schlägt vor, ob eine neue Kategorie umlagefähig ist
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie "Dachsanierung" umlagefähig ist
    Dann schlägt die KI vor, die Kategorie als nicht umlagefähig zu erfassen
    Und begründet die KI ihren Vorschlag mit "Art. 257a"

  @wip
  Szenario: Liegenschaftsverwalter übersteuert den Vorschlag der KI
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Und die KI hat geprüft, ob die Kategorie "Fassadenreinigung" umlagefähig ist
    Wenn der Liegenschaftsverwalter die Kategorie trotzdem als nicht umlagefähig speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Kategorien"
    Und ist die Kategorie "Fassadenreinigung" nicht umlagefähig

  @wip
  Szenario: Neue Kategorie ohne Wahl der Umlagefähigkeit
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"
    Wenn der Liegenschaftsverwalter die Kategorie "Fassadenreinigung" speichert, ohne zu wählen, ob sie umlagefähig ist
    Dann erfährt der Liegenschaftsverwalter, dass er wählen muss, ob die Kosten umlagefähig sind
