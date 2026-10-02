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

  Szenario: Neuen Mieter erfassen
    Wenn der Liegenschaftsverwalter einen neuen Mieter erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mieter"

  Szenario: Mieter öffnen
    Angenommen der Liegenschaftsverwalter sucht den Mieter "Hans Müller"
    Wenn der Liegenschaftsverwalter den Mieter "Hans Müller" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Hans Müller"
