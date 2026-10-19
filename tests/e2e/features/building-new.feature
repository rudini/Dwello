# language: de
@buildings
Funktionalität: Neues Gebäude erfassen
  Als Liegenschaftsverwalter
  möchte ich neue Gebäude erfassen
  damit ich ihre Wohnungen und Mietverträge verwalten kann

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neues Gebäude"

  Szenario: Gebäude erfassen
    Wenn der Liegenschaftsverwalter folgendes Gebäude erfasst:
      | Name    | Rosengarten |
      | Adresse | Rosenweg 5  |
      | PLZ     | 8400        |
      | Ort     | Winterthur  |
      | Kanton  | ZH          |
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Rosengarten"
    Und sieht der Liegenschaftsverwalter die Adresse "Rosenweg 5, 8400 Winterthur"

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter das Gebäude ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Adresse ist erforderlich."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Gebäudename ist erforderlich."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Kanton ist erforderlich."

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste

  # Gebäuderegister (#479): die Adresse aus dem eidgenössischen Gebäude- und Wohnungsregister wählen,
  # Gebäude und Wohnungen in einem Schritt erstellen (im Test ein Stand-in des Registers)
  @wip
  Szenario: Gebäude mit seinen Wohnungen aus dem Gebäuderegister erfassen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Und der Liegenschaftsverwalter das Gebäude mit seinen Wohnungen erstellt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenweg 155"
    Und zeigt die Gebäudeseite 3 Wohnungen
    Und zeigt die Gebäudeseite die Wohnung "101" mit "3 Zimmer" und "75 m²"
    Und zeigt die Gebäudeseite die Wohnung "201" mit "4 Zimmer" und "98 m²"

  @wip
  Szenario: Das Gebäuderegister füllt die Angaben zum Gebäude aus
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Dann schlägt die Erfassung folgende Angaben zum Gebäude vor:
      | Name      | Lindenweg 155    |
      | Adresse   | Lindenweg 155    |
      | PLZ       | 8400             |
      | Ort       | Winterthur       |
      | Kanton    | ZH               |
      | Gebäudetyp | Mehrfamilienhaus |
      | Baujahr   | 1965             |

  @wip
  Szenario: Die Erfassung zeigt nur bestehende Wohnungen und solche im Bau
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Dann schlägt die Erfassung die Wohnungen "101, 102, 201" vor

  @wip
  Szenario: Die Zimmeranzahl aus dem Gebäuderegister prüfen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Dann schlägt die Erfassung für die Wohnung "101" die Zimmeranzahl "3" vor
    Und erfährt der Liegenschaftsverwalter bei der Zimmeranzahl "Im Register ohne halbe Zimmer: bitte prüfen"

  @wip
  Szenario: Eine Wohnung nicht übernehmen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Und der Liegenschaftsverwalter die Wohnung "102" nicht übernimmt
    Und der Liegenschaftsverwalter das Gebäude mit seinen Wohnungen erstellt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenweg 155"
    Und zeigt die Gebäudeseite 2 Wohnungen

  @wip
  Szenario: Was es heisst, eine Wohnung nicht zu übernehmen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Dann erfährt der Liegenschaftsverwalter bei den Wohnungen "Nicht übernommene Wohnungen erfasst Dwello nicht. Die Verteilschlüssel verteilen die Kosten dann nur auf die übrigen Wohnungen."

  @wip
  Szenario: Angaben ergänzen, die im Gebäuderegister fehlen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Birkenweg 7" wählt
    Und der Liegenschaftsverwalter das Gebäude mit seinen Wohnungen erstellt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Fläche ist erforderlich."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Stockwerk ist erforderlich."
    Wenn der Liegenschaftsverwalter bei der Wohnung "2" die Fläche "64" und das Stockwerk "1. OG" ergänzt
    Und der Liegenschaftsverwalter das Gebäude mit seinen Wohnungen erstellt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Birkenweg 7"
    Und zeigt die Gebäudeseite die Wohnung "2" mit "2 Zimmer" und "64 m²"

  @wip
  Szenario: Die Erfassung nennt, was im Gebäuderegister fehlt
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Birkenweg 7" wählt
    Dann erfährt der Liegenschaftsverwalter bei der Wohnung "2", dass im Gebäuderegister "Fläche, Stockwerk" fehlen

  @wip
  Szenario: Eine fehlende Wohnungsnummer aus Stockwerk und Lage vorschlagen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Birkenweg 7" wählt
    Dann schlägt die Erfassung die Wohnungen "2. OG Links, 2" vor

  @wip
  Szenario: Gleiche Wohnungsnummern an zwei Eingängen
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Eschenweg 500" wählt
    Dann schlägt die Erfassung die Wohnungen "500-101, 502-101" vor

  @wip
  Szenario: Im Gebäuderegister sind keine Wohnungen erfasst
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Ahornweg 1" wählt
    Dann sieht der Liegenschaftsverwalter bei der Erfassung den Hinweis "Im Gebäuderegister sind keine Wohnungen erfasst. Erfassen Sie die Wohnungen nach dem Speichern."
    Und schlägt die Erfassung den Gebäudenamen "Ahornweg 1" vor

  @wip
  Szenario: Keine Adresse im Gebäuderegister gefunden
    Wenn der Liegenschaftsverwalter im Gebäuderegister nach "Nirgendweg 3" sucht
    Dann sieht der Liegenschaftsverwalter bei der Erfassung den Hinweis "Keine Adresse gefunden. Prüfen Sie Strasse, Hausnummer und Ort oder erfassen Sie das Gebäude von Hand."

  @wip
  Szenario: Das Gebäuderegister ist nicht erreichbar
    Angenommen das Gebäuderegister ist nicht erreichbar
    Wenn der Liegenschaftsverwalter im Gebäuderegister nach "Lindenweg 155" sucht
    Dann sieht der Liegenschaftsverwalter bei der Erfassung den Hinweis "Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später."

  @wip
  Szenario: Die Adresse ist schon als Gebäude erfasst
    Angenommen das Gebäude "Lindenhof" an der Adresse "Lindenweg 155" in "Winterthur" existiert
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Dann sieht der Liegenschaftsverwalter bei der Erfassung den Hinweis "Diese Adresse ist schon als Gebäude «Lindenhof» erfasst."

  @wip
  Szenario: Zum schon erfassten Gebäude wechseln
    Angenommen das Gebäude "Lindenhof" an der Adresse "Lindenweg 155" in "Winterthur" existiert
    Wenn der Liegenschaftsverwalter im Gebäuderegister die Adresse "Lindenweg 155" wählt
    Und der Liegenschaftsverwalter das schon erfasste Gebäude öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenhof"
