# language: de
@contracts
Funktionalität: Mietvertragsdetail
  Als Liegenschaftsverwalter
  möchte ich einen Mietvertrag mit Mieter, Wohnung und Mietzins sehen
  damit ich Auskunft geben und den Vertrag verwalten kann

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken

  Szenario: Mietvertrag anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann sieht der Liegenschaftsverwalter die Wohnung "2.01" im Mietvertrag
    Und sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 950.00"

  Szenario: Mietvertrag beenden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag beendet
    Dann endet der Mietvertrag heute

  # Der Mieter kündigt auf einen späteren Termin: der Vertrag läuft bis dahin weiter
  Szenario: Mietvertrag auf ein künftiges Datum beenden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-12-31" beendet
    Dann endet der Mietvertrag am "31.12.2099"
    Und hat der Mietvertrag den Status "Laufend"

  Szenario: Vertragsende in der Vergangenheit
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2024-01-31" beenden will
    Dann meldet der Dialog "Das Vertragsende kann nicht vor heute liegen."
    Und ist der Mietvertrag unbefristet

  Szenario: Künftiger Mietvertrag
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2099-11-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Dann hat der Mietvertrag den Status "Künftig"

  Szenario: Aktiver Mietvertrag kann nicht gelöscht werden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Dann kann der Liegenschaftsverwalter das Löschen nicht bestätigen

  # Gekündigt, aber noch laufend: gelöscht werden kann er erst nach dem Vertragsende
  Szenario: Laufender Mietvertrag mit künftigem Vertragsende kann nicht gelöscht werden
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2099-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Dann kann der Liegenschaftsverwalter das Löschen nicht bestätigen

  Szenario: Beendeten Mietvertrag löschen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löscht
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Bruno Meier" ist nicht mehr auffindbar

  Szenario: Zur Bearbeitung des Mietvertrags wechseln
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Mietvertrag bearbeiten"

  Szenario: Mieter öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mieter öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"

  Szenario: Wohnung öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Wohnung des Mietvertrags öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"

  Szenario: Nebenkostenabrechnungen des Mietvertrags anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Nebenkostenabrechnungen des Mietvertrags anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Rechnungen des Gebäudes anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Rechnungen des Gebäudes anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnungen"

  Szenario: E-Mail an den Mieter schreiben
    Angenommen "Anna Keller" hat eine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" eine E-Mail schreiben

  Szenario: Mieter ohne E-Mail-Adresse
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" keine E-Mail schreiben

  Szenario: Mieter anrufen
    Angenommen "Anna Keller" hat die Telefonnummer "+41 52 123 45 67"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" unter "+41 52 123 45 67" anrufen
