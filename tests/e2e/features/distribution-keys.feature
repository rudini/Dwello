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

  # #678 (entschieden): die Eingabetaste speichert, «Formel testen» läuft nur auf Wunsch
  Szenario: Die Eingabetaste speichert den Verteilschlüssel
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Nach Zimmern" mit der Formel "{rooms}" mit der Eingabetaste speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"
    Und verteilt der Verteilschlüssel "Nach Zimmern" nach der Formel "{rooms}"

  # #461 (#345, 3b): ein eigener Verteilschlüssel bekommt seinen Namen auf Französisch, Italienisch und Englisch
  Szenario: Eigener Verteilschlüssel mit französischem Namen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Nach Volumen" mit der Formel "{volume}" und dem französischen Namen "Selon le volume" erfasst
    Dann ist der Liegenschaftsverwalter auf der Seite "Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Sprache "Français" wählt
    Dann zeigt die Seite "Verteilschlüssel" den Verteilschlüssel "Selon le volume"

  # #678 (Persona Marco): wie die Liste nennt die Bestätigung den Verteilschlüssel in der Sprache der Oberfläche
  Szenario: Die Bestätigung nennt den Verteilschlüssel in der Sprache der Oberfläche
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Sprache "Français" wählt
    Und der Liegenschaftsverwalter den Verteilschlüssel "Nach Volumen" mit der Formel "{volume}" und dem französischen Namen "Selon le volume" erfasst
    Dann nennt die Bestätigung den Verteilschlüssel "Selon le volume"

  # #655: die Ablehnung steht am Feld Name, wie bei den Kategorien
  Szenario: Name ist schon vergeben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" noch einmal erfasst
    Dann erfährt der Liegenschaftsverwalter beim Namen, dass es den Verteilschlüssel "Fläche und Zimmer" schon gibt

  # #737: die Ablehnung steht am Feld Formel, in einem Satz und mit dem Wort «Baustein» wie auf der Seite
  Szenario: Formel mit unbekanntem Baustein
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Nach Personen" mit der Formel "{persons}" erfasst
    Dann erfährt der Liegenschaftsverwalter bei der Formel "Unbekannter Baustein {persons}. Erlaubt sind {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}."

  # #737: ohne «%», das die Seite nicht erklärt, und ohne die Einleitung «Die Formel ist ungültig:»
  Szenario: Gespeicherte Formel, die sich nicht berechnen lässt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche doppelt" mit der Formel "{area} 2" erfasst
    Dann erfährt der Liegenschaftsverwalter bei der Formel "Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /), die Klammern und die Bausteine {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}."

  # #737: ein Fehler, der von den Werten abhängt, steht einmal, nicht pro Beispielwohnung, mit Ursache und nächstem Schritt (Persona Helga P-1)
  Szenario: Formel testen, die für eine Wohnung keine Zahl ergibt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{area} / ({units} - 1)" testet
    Dann zeigt der Test nur den Fehler "Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht."

  # #737 (Persona Helga P-2): auch ein negativer Wert sagt seine Ursache und was zu prüfen ist
  Szenario: Formel testen, die für eine Wohnung einen negativen Wert ergibt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{area} - 100" testet
    Dann zeigt der Test nur den Fehler "Für eine Wohnung ergibt die Formel einen negativen Wert, meist weil sie dort zu viel abzieht. Prüfen Sie, was nach «-» steht."

  # #737: «Formel testen» und das Speichern prüfen mit denselben vier Beispielwohnungen wie die Tabelle;
  # die Formel teilt nur bei 80 m² durch null, einer Fläche, die keine Beispielwohnung hat
  Szenario: Der Test prüft mit den Beispielwohnungen seiner Tabelle
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "1 / (({area} - 80) * ({area} - 80))" testet
    Dann trägt die Beispielwohnung mit "50 m², 2 Zimmer" "2.51%" der Kosten

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

  # #452 Punkt 7 (#379): jede Rechnung braucht einen Verteilschlüssel
  Szenario: Die Seite sagt, dass jede Rechnung einen Verteilschlüssel hat
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Dann erklärt die Seite "Verteilschlüssel" "Jede Rechnung hat einen Verteilschlüssel; Sie wählen ihn beim Erfassen der Rechnung."
