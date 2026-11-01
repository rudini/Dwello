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

  # #403 (2): ohne Akonto und ohne Kosten ist der Saldo 0.00; mit dem Versand ist die Abrechnung erledigt. Der Entwurf
  # von Anna Keller passt nicht zum Filter
  Szenario: Nur erledigte Abrechnungen anzeigen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Nina Brunner" existiert
    Und "Nina Brunner" mietet die Wohnung "2.02" seit "2024-01-01" für "1200" Franken mit "0" Franken Akonto
    Und für "Nina Brunner" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Nina Brunner" ist versendet
    Wenn der Liegenschaftsverwalter nur die erledigten Abrechnungen im Gebäude "Ahornhof" anzeigt
    Dann sieht der Liegenschaftsverwalter die Abrechnung von "Nina Brunner" mit dem Status "Erledigt"
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

  Szenario: PDF einer inzwischen gelöschten Abrechnung aus der Liste anfordern
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude "Ahornhof" an
    Und die Abrechnung 2024 von "Anna Keller" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter in der Liste das PDF der Abrechnung 2024 von "Anna Keller" anfordert
    Dann liest der Liegenschaftsverwalter "Abrechnung nicht gefunden."

  Szenario: Abrechnung eines Mieters, der während der Abrechnungsperiode eingezogen ist
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Nina Brunner" existiert
    Und "Nina Brunner" mietet die Wohnung "2.02" seit "2024-07-01" für "1200" Franken mit "180" Franken Akonto
    Und für "Nina Brunner" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Abrechnungen von "Nina Brunner" sucht
    Dann zeigt die Abrechnungsliste bei der Abrechnung von "Nina Brunner" "01.07.2024 – 31.12.2024, 184 Mietstage"
    Aber die Abrechnungsliste zeigt bei der Abrechnung von "Nina Brunner" nicht "01.01.2024"

  Szenario: Entwurf ohne PDF in der Liste
    Wenn der Liegenschaftsverwalter die Abrechnungen von "Anna Keller" sucht
    Dann zeigt die Abrechnungsliste bei der Abrechnung von "Anna Keller" "PDF noch nicht erstellt"

  Szenario: Vom fehlenden PDF zur Abrechnung
    Angenommen der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude "Ahornhof" an
    Wenn der Liegenschaftsverwalter beim fehlenden PDF der Abrechnung 2024 von "Anna Keller" weitergeht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Anna Keller"

  # #679: nach dem Löschen eines Entwurfs zurück zur Liste, wie sie vorher gefiltert war
  Szenario: Nach dem Löschen eines Entwurfs behält die Liste ihren Filter
    Wenn der Liegenschaftsverwalter nur die Entwürfe im Gebäude "Ahornhof" anzeigt
    Und der Liegenschaftsverwalter die Abrechnung 2024 von "Anna Keller" öffnet
    Und der Liegenschaftsverwalter die Abrechnung löscht
    Dann zeigt die Abrechnungsliste nur die Entwürfe im Gebäude "Ahornhof"

  # #679: der Browser zeigt keine gespeicherte Seite einer Abrechnung, die es nicht mehr gibt
  Szenario: Ein gelöschter Entwurf erscheint nach Zurück im Browser nicht mehr
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Und der Liegenschaftsverwalter ist auf der Abrechnungsliste
    Und die Abrechnung 2024 von "Anna Keller" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter im Browser zurückgeht
    Dann sagt die Fehlerseite "Diese Seite gibt es nicht."
