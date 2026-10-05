# language: de
@statements
Funktionalität: Nebenkostenabrechnungen
  Als Liegenschaftsverwalter
  möchte ich alle Nebenkostenabrechnungen überblicken
  damit ich weiss, welche versendet, bezahlt oder überfällig sind

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und für "Anna Keller" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Abrechnungsliste

  Szenario: Abrechnungen eines Gebäudes anzeigen
    Wenn der Liegenschaftsverwalter die Abrechnungen im Gebäude "Ahornhof" anzeigt
    Dann sieht der Liegenschaftsverwalter die Abrechnung von "Anna Keller" mit dem Status "Entwurf"

  Szenario: Gebäude wählen, bevor die Liste fertig geladen ist
    Wenn der Liegenschaftsverwalter das Gebäude "Ahornhof" wählt, bevor die Abrechnungsliste fertig geladen ist, und sucht
    Dann sieht der Liegenschaftsverwalter die Abrechnung von "Anna Keller" mit dem Status "Entwurf"

  Szenario: Abrechnungen eines Mieters suchen
    Wenn der Liegenschaftsverwalter die Abrechnungen von "Anna Keller" sucht
    Dann sieht der Liegenschaftsverwalter die Abrechnung 2024 von "Anna Keller"
    Und die Abrechnungsliste enthält genau 1 Abrechnung

  Szenario: Weitere Abrechnungen auf der nächsten Seite
    Angenommen für "Anna Keller" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnungen 2014 bis 2023
    Wenn der Liegenschaftsverwalter die Abrechnungen von "Anna Keller" sucht
    Und der Liegenschaftsverwalter zur nächsten Seite blättert
    Dann sieht der Liegenschaftsverwalter die Abrechnung 2024 von "Anna Keller"

  Szenario: Nur Entwürfe anzeigen
    Wenn der Liegenschaftsverwalter nur die Entwürfe im Gebäude "Ahornhof" anzeigt
    Dann sieht der Liegenschaftsverwalter die Abrechnung von "Anna Keller" mit dem Status "Entwurf"
    Und die Abrechnungsliste enthält genau 1 Abrechnung

  Szenario: Abrechnungen erstellen
    Wenn der Liegenschaftsverwalter neue Abrechnungen erstellen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Abrechnungen erstellen"

  Szenario: Abrechnung öffnen
    Angenommen der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude "Ahornhof" an
    Wenn der Liegenschaftsverwalter die Abrechnung 2024 von "Anna Keller" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Anna Keller"

  Szenario: PDF einer Abrechnung herunterladen
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude "Ahornhof" an
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung 2024 von "Anna Keller" herunterlädt
    Dann erhält der Liegenschaftsverwalter die Abrechnung als PDF
