# language: de
@distribution-keys
Funktionalität: Verteilschlüssel
  Als Liegenschaftsverwalter
  möchte ich eigene Verteilschlüssel mit Formeln festlegen
  damit Kosten fair auf die Wohnungen eines Gebäudes verteilt werden

  Grundlage:
    Angenommen es gibt den Verteilschlüssel "Fläche und Zimmer" mit der Formel "{area} * 0.7 + {rooms} * 0.3"

  Szenario: Formel mit Beispielwohnungen testen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{area}" testet
    Dann trägt die Beispielwohnung mit "50 m², 2 Zimmer" "14.49%" der Kosten

  Szenario: Verteilschlüssel erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Nach Zimmern" mit der Formel "{rooms}" erfasst
    Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"
    Und verteilt der Verteilschlüssel "Nach Zimmern" nach der Formel "{rooms}"

  Szenario: Formel mit unbekannter Variable
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Nach Personen" mit der Formel "{persons}" erfasst
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Formel ist ungültig: Unbekannte Variable {persons}."

  # #128: der englische Text der Rechenbibliothek stand mitten in der deutschen Meldung
  Szenario: Formel, die sich nicht berechnen lässt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche doppelt" mit der Formel "{area} 2" erfasst
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /, %), die Klammern und die Variablen {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}."

  Szenario: Formel anpassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel des Verteilschlüssels "Fläche und Zimmer" auf "{area} * 0.5 + {rooms} * 0.5" ändert
    Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"
    Und verteilt der Verteilschlüssel "Fläche und Zimmer" nach der Formel "{area} * 0.5 + {rooms} * 0.5"

  Szenario: Bearbeitung abbrechen
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Verteilschlüssels "Fläche und Zimmer"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"

  Szenario: Verteilschlüssel löschen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" löscht
    Dann sieht der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" nicht mehr

  Szenario: Verteilschlüssel mit Rechnungen bleiben erhalten
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und eine Rechnung des Gebäudes "Seeblick" wird nach dem Verteilschlüssel "Fläche und Zimmer" verteilt
    Und der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Dann wird 1 Rechnung nach dem Verteilschlüssel "Fläche und Zimmer" verteilt
    Und kann der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" nicht löschen

  Szenario: Vordefinierte Verteilschlüssel bleiben unverändert
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Dann kann der Liegenschaftsverwalter den Verteilschlüssel "Pro Fläche (m²)" weder bearbeiten noch löschen
