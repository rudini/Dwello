# language: de
@apartments
Funktionalität: Wohnungsdetail
  Als Liegenschaftsverwalter
  möchte ich eine Wohnung mit ihrem Mieter, den monatlichen Kosten und allen Mietverträgen sehen
  damit ich Auskunft über die Wohnung geben kann

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.01"
    Und der Mieter "Eva Graf" existiert
    Und "Eva Graf" mietete die Wohnung "3.01" von "2018-01-01" bis "2022-03-31" für "750" Franken
    Und der Mieter "Beat Huber" existiert
    Und "Beat Huber" mietet die Wohnung "3.01" seit "2022-04-01" für "800" Franken mit "150" Franken Akonto

  Szenario: Aktueller Mieter und monatliche Kosten
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann wohnt "Beat Huber" in der Wohnung
    Und beträgt das Monatlich total der Wohnung "CHF 950.00"
    Und hat die Wohnung den Status "Vermietet"

  Szenario: Alle Mietverträge der Wohnung
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann enthält die Vertragshistorie die Mietverträge von "Beat Huber" und "Eva Graf"

  Szenario: Leere Wohnung
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.02"
    Dann ist die Wohnung nicht vermietet
    Und hat die Wohnung den Status "Leer"
    Und erklärt die Wohnungsseite beim Mietstatus "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."

  # F-4 (#58): «Vermietet ab», auch wenn die Wohnung vorher leer war
  Szenario: Wohnung mit künftigem Mieter
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietet die Wohnung "3.02" seit "2099-11-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.02"
    Dann hat die Wohnung den Status "Vermietet ab 01.11.2099"
    Und zieht "Carla Rossi" am "01.11.2099" in die Wohnung ein

  Szenario: Wohnung bearbeiten
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Wenn der Liegenschaftsverwalter die Wohnung bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 3.01 bearbeiten"

  Szenario: Profil des Mieters öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Wenn der Liegenschaftsverwalter das Profil des Mieters öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Beat Huber"

  Szenario: Mietvertrag aus der Historie öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Eva Graf" aus der Historie öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Eva Graf"

  Szenario: E-Mail an den aktuellen Mieter schreiben
    Angenommen "Beat Huber" hat eine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann kann der Liegenschaftsverwalter "Beat Huber" eine E-Mail schreiben

  # A-4: die Kündigungszeit ist sichtbar, nicht erst der Leerstand
  Szenario: Wohnung mit gekündigtem Mietvertrag
    Angenommen der Mietvertrag von "Beat Huber" ist auf den "2099-03-31" gekündigt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann hat die Wohnung den Status "Vermietet bis 31.03.2099"

  # P-18 (#145): seit wann die Wohnung leer ist und wer ihre Nebenkosten trägt
  Szenario: Leere Wohnung nach dem Auszug
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietete die Wohnung "3.02" von "2019-01-01" bis "2024-03-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.02"
    Dann hat die Wohnung den Status "Leer seit 01.04.2024"
    Und erklärt die Wohnungsseite beim Mietstatus "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."

  # A-8 (#117): ein beendeter Mietvertrag ist die Historie der Wohnung, kein Duplikat
  Szenario: Früherer Mietvertrag auf der Wohnungsseite
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann steht der Mietvertrag von "Beat Huber" über den früheren Mietverträgen
    Und steht der Mietvertrag von "Eva Graf" unter "Frühere Mietverträge"
    Und erklärt der Mietvertrag von "Eva Graf" "Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage."

  # #429: die Nebenkostenpauschale zählt in den monatlichen Kosten der Wohnung
  @wip
  Szenario: Monatliche Kosten mit Nebenkostenpauschale
    Angenommen der Mietvertrag von "Beat Huber" hat "100" Franken Nebenkostenpauschale
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann beträgt das Monatlich total der Wohnung "CHF 1’050.00"
