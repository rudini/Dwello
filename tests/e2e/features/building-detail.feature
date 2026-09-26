# language: de
@buildings
Funktionalität: Gebäudedetail
  Als Liegenschaftsverwalter
  möchte ich ein Gebäude mit seinen Wohnungen sehen
  damit ich Stammdaten und Belegung im Blick habe

  Grundlage:
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert

  Szenario: Wohnungen des Gebäudes anzeigen
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Dann sieht der Liegenschaftsverwalter die Wohnung "1.01" mit dem Status "Leer"

  Szenario: Gebäude löschen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude löscht
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste
    Und das Gebäude "Birkenhof" ist nicht mehr in der Liste

  Szenario: Gebäude mit Wohnungen kann nicht gelöscht werden
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude löscht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Dieses Gebäude kann nicht gelöscht werden"

  Szenario: Über den Breadcrumb zur Gebäudeliste
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter im Breadcrumb "Gebäude" wählt
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste

  Szenario: Zur Bearbeitung des Gebäudes wechseln
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Gebäude bearbeiten"

  Szenario: Wohnung hinzufügen
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter eine Wohnung hinzufügen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Wohnung"

  Szenario: Erste Wohnung erstellen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter die erste Wohnung erstellen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Wohnung"

  Szenario: Wohnung öffnen
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter die Wohnung "1.01" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 1.01"
