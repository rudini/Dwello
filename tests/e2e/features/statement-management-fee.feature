# language: de
@statements @api
Funktionalität: Verwaltungspauschale verteilen
  Als Liegenschaftsverwalter
  möchte ich die Verwaltungspauschale der Liegenschaft nach einem Verteilschlüssel auf die Wohnungen verteilen
  damit jeder Mieter den Anteil trägt, den sein Mietvertrag vorsieht

  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01" mit 50 m²
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.02" mit 150 m²
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken
    Und der Mieter "Beat Huber" existiert
    Und "Beat Huber" mietet die Wohnung "1.02" seit "2020-01-01" für "1900" Franken
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  Szenariogrundriss: Pauschale in Prozent der Nebenkosten der Liegenschaft, verteilt nach Schlüssel
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale nach dem Verteilschlüssel "<Schlüssel>" öffnet
    Dann kostet die Abrechnung von "Anna Keller" "<Anna Keller>"
    Und kostet die Abrechnung von "Beat Huber" "<Beat Huber>"

    Beispiele:
      | Schlüssel       | Anna Keller | Beat Huber |
      | Pro Einheit     | CHF 265.00  | CHF 765.00 |
      | Pro Fläche (m²) | CHF 257.50  | CHF 772.50 |
