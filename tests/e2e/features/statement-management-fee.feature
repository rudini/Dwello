# language: de
@statements
Funktionalität: Verwaltungspauschale berechnen
  Als Liegenschaftsverwalter
  möchte ich die Verwaltungspauschale als Prozentsatz der eigenen Nebenkosten jedes Mieters berechnen
  damit jeder Mieter den Satz auf seiner Abrechnung nachprüfen kann

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

  # Heizkosten nach Fläche: 250 und 750 Franken, dazu je 3 % davon
  @api
  Szenario: Pauschale in Prozent der eigenen Nebenkosten
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Anna Keller" "CHF 257.50"
    Und kostet die Abrechnung von "Beat Huber" "CHF 772.50"

  Szenario: Der Assistent fragt nicht nach einer Verteilung der Pauschale
    Wenn der Liegenschaftsverwalter für das Gebäude "Rosenhof" die Verwaltungspauschale auf 3 % setzt
    Dann erklärt der Assistent, dass die Verwaltungspauschale ein Prozentsatz der eigenen Nebenkosten jedes Mieters ist
    Und bietet der Assistent keine Verteilung der Verwaltungspauschale an
