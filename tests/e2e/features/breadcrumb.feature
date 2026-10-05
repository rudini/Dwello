# language: de
@navigation
Funktionalität: Breadcrumb
  Als Liegenschaftsverwalter
  möchte ich über den Breadcrumb eine Ebene zurück
  damit ich ohne Umweg zur übergeordneten Seite komme

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "4.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "4.01" seit "2024-04-01" für "950" Franken
    Und "Hauswart Huber" stellt dem Gebäude "Lindenhof" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung

  Szenariogrundriss: Über den Breadcrumb zur übergeordneten Seite
    Angenommen der Liegenschaftsverwalter <Ausgangslage>
    Wenn der Liegenschaftsverwalter im Breadcrumb "<Breadcrumb>" wählt
    Dann ist der Liegenschaftsverwalter auf <Ziel>

    Beispiele:
      | Ausgangslage                                                   | Breadcrumb     | Ziel                                               |
      | ist auf der Detailseite von "Lindenhof"                        | Gebäude        | der Gebäudeliste                                   |
      | ist auf der Bearbeitungsseite von "Lindenhof"                  | Gebäude        | der Gebäudeliste                                   |
      | ist auf der Bearbeitungsseite von "Lindenhof"                  | Lindenhof      | der Detailseite von "Lindenhof"                    |
      | ist auf der Seite "Neues Gebäude"                              | Gebäude        | der Gebäudeliste                                   |
      | ist auf der Detailseite der Wohnung "4.01"                     | Wohnungen      | der Seite "Wohnungen"                              |
      | ist auf der Detailseite der Wohnung "4.01"                     | Lindenhof      | der Detailseite von "Lindenhof"                    |
      | ist auf der Bearbeitungsseite der Wohnung "4.01"               | Wohnungen      | der Seite "Wohnungen"                              |
      | ist auf der Bearbeitungsseite der Wohnung "4.01"               | Wohnung 4.01   | der Seite "Wohnung 4.01"                           |
      | ist auf der Seite "Neue Wohnung"                               | Wohnungen      | der Seite "Wohnungen"                              |
      | erfasst eine neue Wohnung im Gebäude "Lindenhof"               | Lindenhof      | der Detailseite von "Lindenhof"                    |
      | ist auf der Detailseite des Mieters "Anna Keller"              | Mieter         | der Mieterliste                                    |
      | ist auf der Bearbeitungsseite des Mieters "Anna Keller"        | Mieter         | der Mieterliste                                    |
      | ist auf der Bearbeitungsseite des Mieters "Anna Keller"        | Anna Keller    | der Detailseite von "Anna Keller"                  |
      | ist auf der Seite "Neuer Mieter"                               | Mieter         | der Mieterliste                                    |
      | ist auf der Detailseite des Mietvertrags von "Anna Keller"     | Mietverträge   | der Mietvertragsliste                              |
      | ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller" | Mietverträge | der Mietvertragsliste                              |
      | ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller" | Vertrag      | der Detailseite des Mietvertrags von "Anna Keller" |
      | ist auf der Seite "Neuer Mietvertrag"                          | Mietverträge   | der Mietvertragsliste                              |
      | ist auf der Detailseite der Rechnung von "Hauswart Huber"      | Rechnungen     | der Rechnungsliste                                 |
      | bearbeitet die Rechnung von "Hauswart Huber"                   | Hauswart Huber | der Detailseite der Rechnung von "Hauswart Huber"  |
      | ist auf der Seite "Neue Rechnung"                              | Rechnungen     | der Rechnungsliste                                 |
      | ist auf der Seite "Heizprofile"                                | Einstellungen  | der Seite "Einstellungen"                          |
