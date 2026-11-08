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

  # #1258: die drei Absagen beim Löschen sind gleich gebaut: Titel, Grund, was zu tun ist
  Szenario: Gebäude mit Wohnungen kann nicht gelöscht werden
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude löschen will
    Dann heisst der Dialog "Gebäude kann nicht gelöscht werden"
    Und nennt der Dialog "Es enthält noch Wohnungen."
    Und nennt der Dialog "Löschen Sie zuerst seine Wohnungen. Danach lässt sich das Gebäude löschen."
    Und nennt der Dialog "Eine Wohnung mit Mietverträgen bleibt erhalten und mit ihr das Gebäude."
    Und bietet der Dialog nur "Schliessen" an

  Szenario: Zur Bearbeitung des Gebäudes wechseln
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter das Gebäude bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Gebäude bearbeiten"

  Szenario: Rechnungen eines Gebäudes öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter die Rechnungen des Gebäudes öffnet
    Dann zeigt die Rechnungsliste die Rechnungen im Gebäude "Birkenhof"

  Szenario: Vom Gebäude aus eine Wohnung erfassen
    Angenommen im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter eine Wohnung erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Wohnung"

  Szenario: Vom Gebäude aus die erste Wohnung erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Wenn der Liegenschaftsverwalter die erste Wohnung erfassen will
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

  # #566: Safaris eigene Prüfung hielt das Formular am versteckten Kalender an, die Seite nannte nichts
  Szenario: Ein Tankbestand ohne Stichtag nennt den fehlenden Stichtag
    Wenn der Liegenschaftsverwalter für das Gebäude "Birkenhof" einen Tankbestand mit "500" Franken speichert, nachdem er den Stichtag "2024-12-31" eingegeben und wieder gelöscht hat
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie den Stichtag ein."

  # Nur eine Kategorie für Brennstoff hat einen Tankbestand (#100); ein Heizungsservice und der Kaminfeger werden
  # wie Heizkosten verteilt, sind aber kein Brennstoff
  Szenario: Der Tankbestand bietet nur Kategorien für Brennstoff an
    Angenommen es gibt die umlagefähige Heizkosten-Kategorie "Heizungsservice"
    Dann bietet der Tankbestand des Gebäudes "Birkenhof" die Kategorie "Heizung" an
    Aber weder die Kategorie "Heizungsservice" noch die Kategorie "Kaminfeger"

  # #1098: seit #1088 hat jedes Gebäude seine Abrechnungsperiode; die Hilfe zum Tankbestand nennt ihren letzten Tag als
  # Stichtag, nicht immer den 31.12., und das Beispiel im Feld folgt ihr (Personas Helga und Dr. Weber P-3 in #1088,
  # Fachreview 1098-1 V-1)
  Szenariogrundriss: Die Hilfe zum Tankbestand nennt den letzten Tag der Abrechnungsperiode des Gebäudes
    Angenommen das Gebäude "Birkenhof" rechnet <Periode> ab
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Dann nennt die Hilfe zum Tankbestand den Stichtag "<Stichtag>"
    Aber nicht den Stichtag "<anderer Stichtag>"
    Und nennt das Beispiel beim Stichtag den Tag "<Stichtag>"

    Beispiele:
      | Periode                  | Stichtag | anderer Stichtag |
      | im Kalenderjahr          | 31.12.   | 30.06.           |
      | von Juli bis Juni        | 30.06.   | 31.12.           |
      | von November bis Oktober | 31.10.   | 31.12.           |

  # #1103: Hilfe und Beispiel beim Stichtag nennen denselben Tag, das Ende der zuletzt abgelaufenen Abrechnungsperiode
  # (Personas Helga und Dr. Weber P-1 in #1098; Fachreview 1103-1 V-1: nicht in der Zukunft, nicht älter als ein Jahr)
  Szenariogrundriss: Die Hilfe zum Tankbestand und das Beispiel beim Stichtag nennen denselben Stichtag
    Angenommen das Gebäude "Birkenhof" rechnet <Periode> ab
    Und der Liegenschaftsverwalter ist auf der Detailseite von "Birkenhof"
    Dann nennen das Beispiel beim Stichtag und die Hilfe zum Tankbestand den "<Ende>" der zuletzt abgelaufenen Abrechnungsperiode

    Beispiele:
      | Periode                  | Ende   |
      | im Kalenderjahr          | 31.12. |
      | von Juli bis Juni        | 30.06. |
      | von November bis Oktober | 31.10. |
