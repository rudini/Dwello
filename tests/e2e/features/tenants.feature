# language: de
@tenants
Funktionalität: Mieterliste
  Als Liegenschaftsverwalter
  möchte ich meine Mieter finden
  damit ich ihre Kontaktdaten und Wohnung nachschlagen kann

  Grundlage:
    Angenommen der Mieter "Hans Müller" existiert
    Und der Liegenschaftsverwalter ist auf der Mieterliste

  Szenario: Mieter suchen
    Wenn der Liegenschaftsverwalter den Mieter "Hans Müller" sucht
    Dann sieht der Liegenschaftsverwalter den Mieter "Hans Müller"
    Und die Mieterliste enthält genau 1 Mieter

  Szenario: Aktuelle Wohnung des Mieters
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und "Hans Müller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken
    Wenn der Liegenschaftsverwalter den Mieter "Hans Müller" sucht
    Dann wohnt "Hans Müller" laut Mieterliste in der Wohnung "2.01"

  Szenario: Ehemalige Mieter anzeigen
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und "Hans Müller" mietete die Wohnung "2.01" von "2014-01-01" bis "2019-12-31" für "950" Franken
    Wenn der Liegenschaftsverwalter die ehemaligen Mieter mit dem Namen "Hans Müller" sucht
    Dann sieht der Liegenschaftsverwalter den Mieter "Hans Müller" als ehemaligen Mieter
    Wenn der Liegenschaftsverwalter die aktiven Mieter mit dem Namen "Hans Müller" sucht
    Dann die Mieterliste enthält genau 0 Mieter

  Szenario: Aktiver Mieter
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und "Hans Müller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken
    Wenn der Liegenschaftsverwalter die aktiven Mieter mit dem Namen "Hans Müller" sucht
    Dann sieht der Liegenschaftsverwalter den Mieter "Hans Müller" als aktiven Mieter

  # F-4 (#58): wer erst einzieht, ist «Künftig», nicht «Aktiv»
  Szenario: Künftiger Mieter
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und "Hans Müller" mietet die Wohnung "2.01" seit "2099-01-01" für "950" Franken
    Wenn der Liegenschaftsverwalter die künftigen Mieter mit dem Namen "Hans Müller" sucht
    Dann sieht der Liegenschaftsverwalter den Mieter "Hans Müller" als künftigen Mieter
    Wenn der Liegenschaftsverwalter die aktiven Mieter mit dem Namen "Hans Müller" sucht
    Dann die Mieterliste enthält genau 0 Mieter

  Szenario: Neuen Mieter erfassen
    Wenn der Liegenschaftsverwalter einen neuen Mieter erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mieter"

  Szenario: Mieter öffnen
    Angenommen der Liegenschaftsverwalter sucht den Mieter "Hans Müller"
    Wenn der Liegenschaftsverwalter den Mieter "Hans Müller" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Hans Müller"

  # #435: Recht auf Datenherausgabe (Art. 28 DSG): alles, was Dwello über den Mieter hält, in einem Download,
  # ohne Daten anderer Mieter (Art. 26 und 29 DSG; Fachreview docs/reviews/435-fachreview-1.md)
  Szenario: Daten eines Mieters exportieren
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und "Hans Müller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken
    Und "Hans Müller" hat eine versendete Abrechnung, deren Zahlungsfrist seit 10 Tagen abgelaufen ist
    Und die PDF dieser Abrechnung von "Hans Müller" liegt vor
    Und "Hans Müller" hat für diese Abrechnung eine Zahlungserinnerung erhalten
    Und "Hans Müller" hat das hochgeladene Dokument "Übergabeprotokoll"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" hat das hochgeladene Dokument "Kündigung"
    Wenn der Liegenschaftsverwalter die Daten von "Hans Müller" exportiert
    Dann enthält der Export Name und Kontaktdaten, den Mietvertrag, die Abrechnung und die Zahlungserinnerung von "Hans Müller"
    Und enthält der Export das Dokument "Übergabeprotokoll", das PDF der Abrechnung und die Zahlungserinnerung von "Hans Müller"
    Und enthält der Export keine Daten von "Anna Keller"
