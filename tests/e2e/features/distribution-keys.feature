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

  # #689: die Liste sagt, in welchen Sprachen ein eigener Verteilschlüssel übersetzt ist, ohne die Namen zu nennen
  Szenario: Die Liste zeigt, ob ein eigener Verteilschlüssel übersetzt ist
    Angenommen es gibt den Verteilschlüssel "Nach Volumen" mit der Formel "{volume}" und Namen auf Französisch und Englisch
    Und der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Dann steht beim Verteilschlüssel "Nach Volumen" "Übersetzt: FR, EN"
    Und steht beim Verteilschlüssel "Fläche und Zimmer" "Keine Übersetzung"
    Aber steht beim vordefinierten Verteilschlüssel "Pro Fläche (m²)" nichts zur Übersetzung

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

  # #737: ohne «%», das die Seite nicht erklärt, und ohne die Einleitung «Die Formel ist ungültig:»; #1200 (entschieden): nennt die Stelle
  Szenario: Gespeicherte Formel, die sich nicht berechnen lässt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche doppelt" mit der Formel "{area} 2" erfasst
    Dann erfährt der Liegenschaftsverwalter bei der Formel "Bei «{area} 2» fehlt ein Rechenzeichen zwischen zwei Werten. Setzen Sie +, -, * oder / dazwischen."

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

  # #737 (Fachprüfung 737-2 V-3): auch null für alle Wohnungen sagt, was zu prüfen ist
  Szenario: Formel testen, die für alle Wohnungen null ergibt
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{units} - 1" testet
    Dann zeigt der Test nur den Fehler "Die Formel ergibt für alle Wohnungen null, so lassen sich keine Anteile berechnen. Prüfen Sie, ob sie mit 0 malnimmt oder {units} - 1 enthält ({units} ist für jede Wohnung 1)."

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

  # #1395 (Fachreview 1395-1 M-1): eine geänderte Formel gilt für alle Abrechnungsperioden, auch für versendete Abrechnungen
  Szenario: Beim Bearbeiten erklärt die Formel, dass sie für alle Abrechnungsperioden gilt
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Verteilschlüssels "Fläche und Zimmer"
    Dann erklärt die Bearbeitungsseite des Verteilschlüssels zur Formel "Ändern Sie die Formel nur, um einen Fehler zu korrigieren. Die neue Formel gilt dann für alle Abrechnungsperioden: Entwürfe rechnen nach «Neu berechnen» mit ihr, und versendete Abrechnungen, deren Saldo oder Position sich dadurch ändert, schlägt Dwello Ihnen zum Berichtigen vor."

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

  # #1255: eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat; ohne ihren Verteilschlüssel stünde eine Abrechnungsposition im neu erstellten PDF anders da
  Szenario: Verteilschlüssel in einer Abrechnung bleiben erhalten
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und im Gebäude "Seeblick" gibt es eine Rechnung vom "2025-03-31", die nach dem Verteilschlüssel "Fläche und Zimmer" verteilt wird
    Und für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Seeblick"
    Und die Rechnung "Fläche und Zimmer 2025-03-31" ist danach gelöscht
    Und der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" löscht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Der Verteilschlüssel steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Verteilschlüsseln. Steht der Verteilschlüssel nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich der Verteilschlüssel löschen."
    Und zeigt die Seite "Verteilschlüssel" den Verteilschlüssel "Fläche und Zimmer"

  # #1201: der Name eines Verteilschlüssels hat höchstens 100 Zeichen, wie in der Datenbank
  Szenario: Bei einem zu langen Namen eines Verteilschlüssels sagt Dwello, was zu tun ist
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Verteilschlüssels "Fläche und Zimmer"
    Wenn der Liegenschaftsverwalter bei "Name" einen Text von 101 Zeichen speichert
    Dann steht bei "Name" die Fehlermeldung "Höchstens 100 Zeichen, Sie haben 101 eingegeben. Kürzen Sie den Text."
    Und steht bei "Name" noch der Text von 101 Zeichen

  # #1200 (Persona Helga, #128): die Summen des Gebäudes lassen sich wie die Bausteine per Knopf einfügen
  Szenario: Eine Summe des Gebäudes in die Formel übernehmen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{area} / " eingibt
    Und der Liegenschaftsverwalter die Summe "{area_total}" einfügt
    Dann steht in der Formel "{area} / {area_total}"

  # #1200: ein Fehler im Aufbau der Formel nennt die Stelle, an der sie bricht
  Szenario: Gespeicherte Formel mit offener Klammer
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Gemischt" mit der Formel "0.7 * ({area} / {area_total} + 0.3" erfasst
    Dann erfährt der Liegenschaftsverwalter bei der Formel "Die Klammer am Anfang von «({area} / {area_total} + 0.3» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll."

  # #1200: auch der Test nennt die Stelle
  Szenario: Formel testen mit zwei Rechenzeichen hintereinander
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter die Formel "{area} * / {rooms}" testet
    Dann zeigt der Test nur den Fehler "Bei «{area} * / {rooms}» folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen."

  # #1200: der vergebene Name sagt, was zu tun ist, und verdeckt den Fehler der Formel nicht
  Szenario: Vergebener Name und fehlerhafte Formel beim selben Speichern
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Verteilschlüssel "Fläche und Zimmer" noch einmal mit der Formel "({area}" erfasst
    Dann erfährt der Liegenschaftsverwalter beim Namen "Ein Verteilschlüssel mit dem Namen «Fläche und Zimmer» existiert bereits. Wählen Sie einen anderen Namen."
    Und erfährt der Liegenschaftsverwalter bei der Formel "Die Klammer am Anfang von «({area}» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll."

  # #1200 (Persona Helga P-1): nach dem Übernehmen eines Bausteins schreibt der Liegenschaftsverwalter in der Formel weiter
  Szenario: Nach einem Baustein in der Formel weiterschreiben
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Verteilschlüssel"
    Wenn der Liegenschaftsverwalter den Baustein "{rooms}" übernimmt
    Und der Liegenschaftsverwalter " * 2" weiterschreibt
    Dann steht in der Formel "{area}{rooms} * 2"

  # #698: ein Begriff aus der Hilfe wird am Feld mit demselben Text erklärt
  Szenario: Die Seite «Verteilschlüssel» erklärt den Verteilschlüssel wie die Hilfe
    Angenommen der Liegenschaftsverwalter hat in der Hilfe gelesen, was "Verteilschlüssel" heisst
    Und der Liegenschaftsverwalter ist auf der Seite "Verteilschlüssel"
    Dann beginnt die Hilfe zu "der Seite «Verteilschlüssel»" mit der Erklärung aus der Hilfe
