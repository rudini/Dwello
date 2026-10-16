# language: de
@apartments
Funktionalität: Wohnungsliste
  Als Liegenschaftsverwalter
  möchte ich die Wohnungen meiner Gebäude mit ihrer Belegung sehen
  damit ich Leerstände erkenne

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.02" seit "2014-01-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Wohnungsliste

  Szenario: Wohnungen eines Gebäudes mit Belegung
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer"
    Und ist die Wohnung "2.02" "Vermietet"
    Und die Wohnungsliste enthält genau 2 Wohnungen

  # F-4 (#58): «Vermietet ab» statt «Wiedervermietet»
  Szenario: Künftig vermietete Wohnung
    Angenommen der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietet die Wohnung "2.01" seit "2099-11-01" für "900" Franken
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Vermietet ab 01.11.2099"

  Szenario: Nur leere Wohnungen anzeigen
    Wenn der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung

  Szenario: Wohnungen nach Gebäude und Wohnungsnummer suchen
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Ahornhof" sucht
    Dann die Wohnungsliste enthält genau 2 Wohnungen
    Wenn der Liegenschaftsverwalter im Gebäude "Ahornhof" nach der Wohnung "2.01" sucht
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung

  Szenario: Wohnungssuche ohne Treffer
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter in der Wohnungsliste den Hinweis "Keine Wohnungen gefunden"

  Szenario: Filter nach dem Zurücksetzen leer
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Gibt es nicht" sucht
    Und der Liegenschaftsverwalter wieder alle Wohnungen anzeigt
    Dann zeigt die Wohnungsliste wieder Wohnungen
    Und die Wohnungssuche ist leer

  Szenario: Neue Wohnung erfassen
    Wenn der Liegenschaftsverwalter eine neue Wohnung erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Wohnung"

  Szenario: Wohnung öffnen
    Angenommen der Liegenschaftsverwalter zeigt die Wohnungen im Gebäude "Ahornhof" an
    Wenn der Liegenschaftsverwalter die Wohnung "2.01" aus der Liste öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"
