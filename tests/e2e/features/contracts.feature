# language: de
@contracts
Funktionalität: Mietvertragsliste
  Als Liegenschaftsverwalter
  möchte ich alle Mietverträge überblicken
  damit ich weiss, welche Wohnungen an wen vermietet sind

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Mietvertragsliste

  Szenario: Mietvertrag wird in der Liste angezeigt
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "Laufend"

  Szenario: Mietverträge nach Mieter suchen
    Wenn der Liegenschaftsverwalter nach dem Mieter "Anna Keller" sucht
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "Laufend"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  Szenario: Mietverträge nach Gebäude filtern
    Wenn der Liegenschaftsverwalter die Mietverträge nach dem Gebäude "Ahornhof" filtert
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit dem Status "Laufend"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  # #662: eine Wahl im Filter gilt sofort, ohne «Suchen»; ein nicht gesuchter Text gilt nicht und weicht der Suche (#680)
  Szenario: Eine Wahl im Filter zeigt die Mietverträge sofort, ohne den nicht gesuchten Text
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2014-01-01" bis "2019-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter nach dem Mieter "Bruno Meier" sucht
    Und der Liegenschaftsverwalter "Anna Keller" in die Suche eingibt
    Und der Liegenschaftsverwalter im Filter "Vertragsstatus" "Beendete Mietverträge" wählt
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Bruno Meier" mit dem Status "Beendet"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag
    Und zeigt die Suche "Bruno Meier"
    Und bleibt der Fokus im Filter "Vertragsstatus"

  # #682: wie die Wohnungsliste (#670) nennt die Überschrift die gezeigten Mietverträge und die Seite
  Szenario: Die Überschrift nennt die gezeigten Mietverträge und die Seite
    Angenommen im Gebäude "Ahornhof" gibt es 12 weitere vermietete Wohnungen
    Wenn der Liegenschaftsverwalter die Mietverträge nach dem Gebäude "Ahornhof" filtert
    Dann steht über der Mietvertragsliste "Mietverträge 1–12 von 13, Seite 1 von 2"
    Wenn der Liegenschaftsverwalter zur nächsten Seite blättert
    Dann steht über der Mietvertragsliste "Mietvertrag 13 von 13, Seite 2 von 2"

  Szenario: Beendete Mietverträge anzeigen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter die beendeten Mietverträge im Gebäude "Ahornhof" anzeigt
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Bruno Meier" mit dem Status "Beendet"
    Und die Mietvertragsliste enthält genau 1 Mietvertrag

  Szenario: Künftiger Mietvertrag beginnt an seinem Vertragsbeginn
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2099-11-01" für "900" Franken
    Wenn der Liegenschaftsverwalter nach dem Mieter "Bruno Meier" sucht
    Dann sieht der Liegenschaftsverwalter den Mietvertrag von "Bruno Meier" mit dem Status "Künftig"
    Und beginnt der Mietvertrag von "Bruno Meier" laut Liste am "01.11.2099"

  Szenario: Nettomiete und monatliches Total getrennt
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2024-01-01" für "900" Franken mit "150" Franken Akonto
    Wenn der Liegenschaftsverwalter nach dem Mieter "Bruno Meier" sucht
    Dann nennt die Mietvertragsliste für "Bruno Meier" die Nettomiete "CHF 900.00" und monatlich total "CHF 1’050.00"

  Szenario: Zur Erfassung eines neuen Mietvertrags wechseln
    Wenn der Liegenschaftsverwalter einen neuen Mietvertrag erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mietvertrag"

  Szenario: Mietvertrag ansehen
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" ansieht
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  # #211: die Liste zeigt, welchem Mietvertrag eine Abrechnung fehlt, ohne jeden Vertrag zu öffnen
  Szenario: Mietvertragsliste zeigt eine fehlende Abrechnung
    Dann zeigt die Mietvertragsliste beim Mietvertrag von "Anna Keller" "Abrechnung fehlt"

  Szenario: Abgerechneter Mietvertrag ohne Hinweis in der Liste
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Ben Meier" existiert
    Und "Ben Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Und für "Ben Meier" gibt es die Abrechnung 2024 im Gebäude "Ahornhof"
    Dann zeigt die Mietvertragsliste beim Mietvertrag von "Ben Meier" keine fehlende Abrechnung

  # #133: «Abgerechnet bis» deckt die beendeten Perioden ab
  Szenario: Ausserhalb von Dwello abgerechneter Mietvertrag ohne Hinweis in der Liste
    Angenommen der Mietvertrag von "Anna Keller" ist bis Ende des letzten Jahres ausserhalb von Dwello abgerechnet
    Dann zeigt die Mietvertragsliste beim Mietvertrag von "Anna Keller" keine fehlende Abrechnung

  # #652: die Zeile ist der eine Link zum Mietvertrag, «Bearbeiten» steht auf dessen Detailseite
  Szenario: Eine Zeile der Mietvertragsliste hat nur einen Link
    Dann führt die Zeile des Mietvertrags von "Anna Keller" nur mit dem Link "Anna Keller" weiter

  # #658 (Decided): Filter und Zeilen richten sich nach der Breite ihres Bereichs, nicht des Fensters; nichts ist abgeschnitten
  Szenariogrundriss: Die Mietvertragsliste zeigt bei jeder Breite alles ganz
    Angenommen das Browserfenster ist <Breite> Pixel breit
    Und der Liegenschaftsverwalter ist auf der Mietvertragsliste
    Dann zeigt die Seite nichts abgeschnitten

    Beispiele:
      | Breite |
      | 853    |
      | 1024   |
      | 1280   |
      | 1440   |
