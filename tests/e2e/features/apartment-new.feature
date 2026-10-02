# language: de
@apartments
Funktionalität: Neue Wohnung
  Als Liegenschaftsverwalter
  möchte ich die Wohnungen meiner Gebäude erfassen
  damit ich sie vermieten und abrechnen kann

  Grundlage:
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"

  Szenario: Wohnung erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"
    Wenn der Liegenschaftsverwalter im Gebäude "Birkenhof" folgende Wohnung erfasst:
      | Nummer    | 2.01 |
      | Stockwerk | 2    |
      | Fläche    | 68   |
      | Zimmer    | 2.5  |
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"
    Und hat die Wohnung den Status "Leer"
    Und hat die Wohnung "2.5" Zimmer und "68 m²" im Stockwerk "2. OG"

  Szenario: Wohnung im Gebäude erfassen
    Angenommen der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude "Birkenhof"
    Wenn der Liegenschaftsverwalter folgende Wohnung erfasst:
      | Nummer    | 0.01 |
      | Stockwerk | 0    |
      | Fläche    | 45   |
      | Zimmer    | 1.5  |
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 0.01"
    Und gehört die Wohnung zum Gebäude "Birkenhof"

  Szenario: Pflichtangaben fehlen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"
    Wenn der Liegenschaftsverwalter die Wohnung ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie ein Gebäude aus"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Wohnungsnummer ist erforderlich"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Fläche ist erforderlich"

  Szenario: Wohnungsnummer ist im Gebäude schon vergeben
    Angenommen der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude "Birkenhof"
    Wenn der Liegenschaftsverwalter die Wohnungsnummer "1.01" eingibt
    Dann warnt das Formular, dass die Wohnungsnummer "1.01" vergeben ist
    Wenn der Liegenschaftsverwalter folgende Wohnung erfasst:
      | Nummer    | 1.01 |
      | Stockwerk | 1    |
      | Fläche    | 70   |
      | Zimmer    | 3.5  |
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Wohnungsnummer 1.01 existiert bereits in diesem Gebäude."

  Szenario: Erfassen abbrechen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnungen"

  Szenario: Erfassen im Gebäude abbrechen
    Angenommen der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude "Birkenhof"
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Birkenhof"

  Szenario: Über den Breadcrumb zur Wohnungsliste
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"
    Wenn der Liegenschaftsverwalter im Breadcrumb "Wohnungen" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnungen"

  Szenario: Über den Breadcrumb zum Gebäude
    Angenommen der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude "Birkenhof"
    Wenn der Liegenschaftsverwalter im Breadcrumb "Birkenhof" wählt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Birkenhof"
