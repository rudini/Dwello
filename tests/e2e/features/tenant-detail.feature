# language: de
@tenants
Funktionalität: Mieterdetail
  Als Liegenschaftsverwalter
  möchte ich einen Mieter mit seiner Wohnung, seiner Miete und allen Mietverträgen sehen
  damit ich Auskunft geben und den Mieter verwalten kann

  Grundlage:
    Angenommen das Gebäude "Ulmenhof" in "Winterthur" existiert
    Und im Gebäude "Ulmenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Ulmenhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Lea Frei" existiert

  Szenario: Aktuelle Miete
    Angenommen "Lea Frei" mietete die Wohnung "1.01" von "2015-01-01" bis "2019-12-31" für "700" Franken
    Und "Lea Frei" mietet die Wohnung "2.01" seit "2020-01-01" für "800" Franken mit "150" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Dann mietet der Mieter die Wohnung "2.01" für "CHF 950.00" im Monat
    Und enthält die Vertragshistorie die Wohnungen "2.01" und "1.01"

  Szenario: Bevorstehender Einzug
    Angenommen "Lea Frei" mietet die Wohnung "2.01" seit "2099-11-01" für "800" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Dann zieht der Mieter am "1.11.2099" in die Wohnung "2.01" ein

  Szenario: Mieter ohne Mietvertrag löschen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter den Mieter löscht
    Dann ist der Liegenschaftsverwalter auf der Mieterliste
    Und findet der Liegenschaftsverwalter den Mieter "Lea Frei" nicht mehr

  Szenario: Mieter mit Mietverträgen bleibt erhalten
    Angenommen "Lea Frei" mietete die Wohnung "1.01" von "2015-01-01" bis "2019-12-31" für "700" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter den Mieter löschen will
    Dann kann der Liegenschaftsverwalter das Löschen nicht bestätigen

  Szenario: Mieter bearbeiten
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter den Mieter bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Bearbeitungsseite von "Lea Frei"

  Szenario: Neuen Mietvertrag für den Mieter erfassen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter einen Mietvertrag für den Mieter erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mietvertrag"

  Szenario: Wohnung des Mieters öffnen
    Angenommen "Lea Frei" mietet die Wohnung "2.01" seit "2020-01-01" für "800" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die Wohnung des Mieters öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"

  Szenario: Mietvertrag aus der Historie öffnen
    Angenommen "Lea Frei" mietete die Wohnung "1.01" von "2015-01-01" bis "2019-12-31" für "700" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter den Mietvertrag der Wohnung "1.01" aus der Historie öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Lea Frei"

  Szenario: E-Mail an den Mieter schreiben
    Angenommen "Lea Frei" hat eine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Dann kann der Liegenschaftsverwalter "Lea Frei" eine E-Mail schreiben

  Szenario: Mieter ohne E-Mail-Adresse
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Dann kann der Liegenschaftsverwalter "Lea Frei" keine E-Mail schreiben
