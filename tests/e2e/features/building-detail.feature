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

  Szenario: Die Detailseite zeigt die Adresse als Text ohne Karte
    Angenommen für das Gebäude "Birkenhof" sind Koordinaten erfasst
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Dann sieht der Liegenschaftsverwalter die Adresse "Testweg 1, 8400 Winterthur (ZH)"
    Und sieht der Liegenschaftsverwalter keine Karte des Gebäudes

  Szenario: Gebäude löschen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude löscht
    Dann ist der Liegenschaftsverwalter auf der Gebäudeliste
    Und das Gebäude "Birkenhof" ist nicht mehr in der Liste

  Szenario: Gebäude mit Wohnungen kann nicht gelöscht werden
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude löschen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Dieses Gebäude kann nicht gelöscht werden"
    Und kann der Liegenschaftsverwalter das Löschen nicht bestätigen

  Szenario: Zur Bearbeitung des Gebäudes wechseln
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Gebäude bearbeiten"

  Szenario: Rechnungen eines Gebäudes öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter die Rechnungen des Gebäudes öffnet
    Dann zeigt die Rechnungsliste die Rechnungen im Gebäude "Birkenhof"

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

  # Wizard und Rechnung sagen «Tankbestand»; der Abschnitt der Gebäudeseite heisst gleich (#75)
  Szenario: Der Abschnitt zum Heizmaterial heisst Tankbestand
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Dann heisst der Abschnitt zum Heizmaterial auf der Gebäudeseite "Tankbestand"

  # Nur eine Kategorie für Brennstoff hat einen Tankbestand (#100); ein Heizungsservice und der Kaminfeger werden
  # wie Heizkosten verteilt, sind aber kein Brennstoff
  Szenario: Der Tankbestand bietet nur Kategorien für Brennstoff an
    Angenommen es gibt die umlagefähige Heizkosten-Kategorie "Heizungsservice"
    Dann bietet der Tankbestand des Gebäudes "Birkenhof" die Kategorie "Heizung" an
    Aber weder die Kategorie "Heizungsservice" noch die Kategorie "Kaminfeger"
