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

  Szenario: Nur leere Wohnungen anzeigen
    Wenn der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung

  Szenario: Neue Wohnung erfassen
    Wenn der Liegenschaftsverwalter eine neue Wohnung erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Wohnung"

  Szenario: Wohnung öffnen
    Angenommen der Liegenschaftsverwalter zeigt die Wohnungen im Gebäude "Ahornhof" an
    Wenn der Liegenschaftsverwalter die Wohnung "2.01" aus der Liste öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"
