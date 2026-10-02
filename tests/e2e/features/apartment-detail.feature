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
    Und kostet die Wohnung monatlich "CHF 950.00" brutto
    Und hat die Wohnung den Status "Vermietet"

  Szenario: Alle Mietverträge der Wohnung
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Dann enthält die Vertragshistorie die Mietverträge von "Beat Huber" und "Eva Graf"

  Szenario: Leere Wohnung
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.02"
    Dann ist die Wohnung nicht vermietet
    Und hat die Wohnung den Status "Leer"

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

  Szenario: Über den Breadcrumb zur Wohnungsliste
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Wenn der Liegenschaftsverwalter im Breadcrumb "Wohnungen" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnungen"

  Szenario: Über den Breadcrumb zum Gebäude
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "3.01"
    Wenn der Liegenschaftsverwalter im Breadcrumb "Lindenhof" wählt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lindenhof"
