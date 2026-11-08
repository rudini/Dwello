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

  # #670 (Persona Marco P-5): die Überschrift nennt die gezeigten Wohnungen und die Seite, nicht erst unter der Liste
  Szenario: Die Überschrift nennt die gezeigten Wohnungen und die Seite
    Angenommen im Gebäude "Ahornhof" gibt es 11 weitere leere Wohnungen
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann steht über der Wohnungsliste "Wohnungen 1–12 von 13, Seite 1 von 2"
    Wenn der Liegenschaftsverwalter zur nächsten Seite blättert
    Dann steht über der Wohnungsliste "Wohnung 13 von 13, Seite 2 von 2"

  # #670 (Persona Marco P-6): die Wohnungsliste ist nach dem Gebäudenamen geordnet, der Gebäudefilter auch
  Szenario: Der Gebäudefilter nennt die Gebäude in der Reihenfolge der Wohnungsliste
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann nennt der Gebäudefilter das Gebäude "Ahornhof" vor dem Gebäude "Birkenhof"

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

  # #662 (Sven in #682): eine Wahl im Filter gilt sofort, ohne «Suchen»; der Fokus bleibt im Filter
  Szenario: Eine Wahl im Filter zeigt die Liste sofort und bietet an, die Filter zurückzusetzen
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "3.01"
    Und der Liegenschaftsverwalter ist auf der Wohnungsliste
    Wenn der Liegenschaftsverwalter im Filter "Gebäude" "Ahornhof" wählt
    Dann die Wohnungsliste enthält genau 2 Wohnungen
    Und bleibt der Fokus im Filter "Gebäude"
    Und sagt die Seite das Ergebnis "2 Wohnungen" an
    Wenn der Liegenschaftsverwalter die leeren Wohnungen wählt, ohne zu suchen
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung
    Und bietet die Seite nur einmal an, die Filter zurückzusetzen
    Wenn der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann bietet die Seite nur einmal an, die Filter zurückzusetzen

  Szenario: Wohnungssuche ohne Treffer
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Gibt es nicht" sucht
    Dann sieht der Liegenschaftsverwalter in der Wohnungsliste den Hinweis "Keine Wohnungen gefunden"

  # Wohnungsnummern ohne die Buchstaben a bis f: sonst passen sie in die Hex-Ziffern der Testnamen
  # #160, #373: jedes Wort muss zur Wohnungsnummer, zum Gebäudenamen oder zur Adresse des Gebäudes passen
  Szenario: Wohnungen wortweise nach Gebäude, Adresse und Wohnungsnummer suchen
    Angenommen das Gebäude "Seepark" an der "Seestrasse 5" in "Uster" existiert
    Und im Gebäude "Seepark" gibt es die leere Wohnung "H1"
    Und im Gebäude "Seepark" gibt es die leere Wohnung "H2"
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Seepark H1" sucht
    Dann ist die Wohnung "H1" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Wohnung Seestrasse 5 H2" sucht
    Dann ist die Wohnung "H2" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung

  # #461 (#376): die Karte nennt die Wohnung auf Französisch «Appartement 2.01»
  Szenario: Die Wohnungssuche übergeht das Wort für Wohnung in jeder Sprache
    Wenn der Liegenschaftsverwalter im Gebäude "Ahornhof" nach der Wohnung "appartement 2.01" sucht
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung

  Szenario: Wohnungssuche ohne Treffer nennt den Suchbegriff
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Ahornhof 9.99" sucht
    Dann sieht der Liegenschaftsverwalter in der Wohnungsliste den Hinweis "Keine Wohnung passt zu «Ahornhof 9.99». Gesucht wird in Wohnungsnummer, Gebäudename, Strasse und Ort."

  Szenario: Die Wohnungssuche sagt, wonach sie sucht
    Dann erfährt der Liegenschaftsverwalter bei der Wohnungssuche "Suchen Sie nach Wohnungsnummer, Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel Gebäudename und Wohnungsnummer."

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

  # #681: jede Bewegung innerhalb der Liste bringt den Fokus zum Ergebnis, wie eine Suche
  Szenario: Nach dem Zurücksetzen der Filter steht der Fokus auf dem Ergebnis
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Gibt es nicht" sucht
    Und der Liegenschaftsverwalter wieder alle Wohnungen anzeigt
    Dann steht der Fokus auf dem Ergebnis der Liste

  Szenario: Nach dem Zurückgehen im Browser steht der Fokus auf dem Ergebnis
    Wenn der Liegenschaftsverwalter nach Wohnungen mit "Gibt es nicht" sucht
    Und der Liegenschaftsverwalter wieder alle Wohnungen anzeigt
    Und der Liegenschaftsverwalter im Browser zurückgeht
    Dann steht der Fokus auf dem Ergebnis "Keine Wohnungen gefunden"

  # #664 (Persona Helga M4, review K-4): mit einem Nachmieter ab dem Tag danach steht «Vermietet»; der Auszug und ab
  # wann die Schlussabrechnung erstellt werden kann, stehen dabei, bis die Abrechnungsperiode des Vertragsendes endet
  Szenario: Die Wohnungsliste nennt den Auszug bis zum Ende seiner Abrechnungsperiode
    Angenommen der Mieter "Sarah Meier" existiert
    Und "Sarah Meier" mietet die Wohnung "2.01" seit "2021-08-01" bis heute für "1200" Franken
    Und der Mieter "Nina Brunner" existiert
    Und "Nina Brunner" mietet die Wohnung "2.01" ab morgen für "1250" Franken
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Vermietet"
    Und nennt die Wohnungsliste bei der Wohnung "2.01" den Auszug von "Sarah Meier" heute mit der Schlussabrechnung nach dem Ende des Jahres

  # #664: nach dem Ende der Abrechnungsperiode und solange die Schlussabrechnung fehlt, ist sie fällig
  Szenario: Die Wohnungsliste nennt die fällige Schlussabrechnung
    Angenommen der Mieter "Sarah Meier" existiert
    Und "Sarah Meier" mietet die Wohnung "2.01" seit "2021-08-01" für "1200" Franken
    Und der Mietvertrag von "Sarah Meier" ist auf den "2025-06-30" gekündigt
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann nennt die Wohnungsliste bei der Wohnung "2.01" "Auszug von Sarah Meier am 30.06.2025, Schlussabrechnung fällig"

  Szenario: Mit der Schlussabrechnung nennt die Wohnungsliste den Auszug nicht mehr
    Angenommen der Mieter "Sarah Meier" existiert
    Und "Sarah Meier" mietet die Wohnung "2.01" seit "2021-08-01" für "1200" Franken
    Und der Mietvertrag von "Sarah Meier" ist auf den "2025-06-30" gekündigt
    Und für "Sarah Meier" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2025
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer seit 01.07.2025"
    Und nennt die Wohnungsliste bei der Wohnung "2.01" keinen Auszug

  # #664 (Fachreview 664-1 M-1): nach einem befristeten Vertragsende ohne «Auszug bestätigt» ist der Auszug offen
  Szenario: Ohne bestätigten Auszug nennt die Wohnungsliste keinen Auszug
    Angenommen der Mieter "Sarah Meier" existiert
    Und "Sarah Meier" mietete die Wohnung "2.01" befristet von "2021-08-01" bis "2025-06-30" für "1200" Franken mit "100" Franken Akonto
    Wenn der Liegenschaftsverwalter die Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer seit 01.07.2025"
    Und nennt die Wohnungsliste bei der Wohnung "2.01" keinen Auszug

  # #1311 (Decided, Fachreview 1311-1 V-6): die aufgehobene Wohnung ist nicht leer, der Statusfilter «Aufgehoben» zeigt sie
  Szenario: Die aufgehobene Wohnung steht nicht unter den leeren Wohnungen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.03"
    Und die Wohnung "2.03" ist aufgehoben ab "2025-07-01"
    Wenn der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.01" "Leer"
    Und die Wohnungsliste enthält genau 1 Wohnung
    Wenn der Liegenschaftsverwalter nur die aufgehobenen Wohnungen im Gebäude "Ahornhof" anzeigt
    Dann ist die Wohnung "2.03" "Aufgehoben seit 01.07.2025"
    Und die Wohnungsliste enthält genau 1 Wohnung
