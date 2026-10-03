# language: de
@statements
Funktionalität: Nebenkostenabrechnungen erstellen
  Als Liegenschaftsverwalter
  möchte ich die Abrechnungen einer Periode für ganze Gebäude erstellen
  damit jeder Mieter die Nebenkosten seiner Mietdauer erhält

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.01"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietete die Wohnung "3.01" von "2024-01-01" bis "2024-03-31" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "3.01" seit "2024-05-01" für "980" Franken
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  Szenario: Vorschau bei Mieterwechsel mit Leerstand
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann enthält die Vorschau die Abrechnung von "Eva Frei"
    Und enthält die Vorschau die Abrechnung von "Marc Huber"
    Und die Vorschau enthält genau 2 Abrechnungen

  Szenario: Abrechnungen bei Mieterwechsel mit Leerstand erstellen
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Dann wurden 2 Nebenkostenabrechnungen erstellt

  Szenario: Erhöhte Verwaltungspauschale gilt für alle Mieter der Liegenschaft
    Angenommen das Heizprofil "Winter" verteilt die Heizkosten so:
      | Monat     | Anteil |
      | Januar    | 18     |
      | Februar   | 14     |
      | März      | 11     |
      | April     | 5      |
      | Mai       | 2      |
      | Juni      | 0      |
      | Juli      | 0      |
      | August    | 0      |
      | September | 2      |
      | Oktober   | 8      |
      | November  | 14     |
      | Dezember  | 26     |
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 4.5 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Eva Frei" "CHF 449.35"
    Und kostet die Abrechnung von "Marc Huber" "CHF 543.40"

  Szenario: Hinweis bei Verwaltungspauschale über dem Richtwert
    Wenn der Liegenschaftsverwalter die Verwaltungspauschale auf 4.5 % setzt
    Dann sieht der Liegenschaftsverwalter den Hinweis, dass die Verwaltungspauschale über dem üblichen Richtwert liegt

  Szenario: Mietverträge ausserhalb der Periode werden nicht abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2023 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Vorschau, dass es in der Periode keine Mietverträge gibt

  Szenario: Erstellte Abrechnungen anzeigen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Zurück zur Abrechnungsliste
    Wenn der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Weitere Abrechnungen erstellen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Wenn der Liegenschaftsverwalter weitere Abrechnungen erstellen will
    Dann beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode
