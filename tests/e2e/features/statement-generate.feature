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

  # Alle fünf Schritte des Assistenten passen auch auf Tablet und kleinen Laptop
  Szenariogrundriss: Schritte des Assistenten in einem schmalen Fenster
    Angenommen das Browserfenster ist <Breite> Pixel breit
    Dann ist der Seitentitel lesbar
    Und scrollt die Seite nicht seitwärts

    Beispiele:
      | Breite |
      | 768    |
      | 1024   |

  @api
  Szenario: Vorschau bei Mieterwechsel mit Leerstand
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann enthält die Vorschau die Abrechnung von "Eva Frei"
    Und enthält die Vorschau die Abrechnung von "Marc Huber"
    Und die Vorschau enthält genau 2 Abrechnungen

  @api
  Szenario: Abrechnungen bei Mieterwechsel mit Leerstand erstellen
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Dann wurden 2 Nebenkostenabrechnungen erstellt

  @api
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
    Dann kostet die Abrechnung von "Eva Frei" "CHF 441.19"
    Und kostet die Abrechnung von "Marc Huber" "CHF 550.12"

  Szenario: Hinweis bei Verwaltungspauschale über dem Richtwert
    Wenn der Liegenschaftsverwalter für das Gebäude "Lindenhof" die Verwaltungspauschale auf 4.5 % setzt
    Dann sieht der Liegenschaftsverwalter den Hinweis, dass die Verwaltungspauschale über dem üblichen Richtwert liegt

  @api
  Szenario: Mietverträge ausserhalb der Periode werden nicht abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2023 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Vorschau, dass es in der Periode keine Mietverträge gibt

  Szenario: Warnung, wenn für ein Gebäude keine Rechnungen erfasst sind
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann warnt die Vorschau, dass für "Lindenhof" in der Abrechnungsperiode keine Rechnungen erfasst sind
    Wenn der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."

  Szenario: Eine Rechnung aus der Warnung ausserhalb der Abrechnungsperiode fällt auf
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter aus der Warnung eine Rechnung erfassen will
    Dann ist das Rechnungsdatum leer, damit es bewusst gewählt wird
    Wenn der Liegenschaftsverwalter das Rechnungsdatum "2025-01-10" einträgt
    Dann warnt das Rechnungsformular, dass das Rechnungsdatum nicht in der Abrechnungsperiode "1.1.2024 – 31.12.2024" liegt
    Wenn der Liegenschaftsverwalter das Rechnungsdatum "2024-11-15" einträgt
    Dann warnt das Rechnungsformular nicht vor dem Rechnungsdatum

  Szenario: Eine Bestätigung gilt nur für ihre Vorschau
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter bestätigt, dass die Abrechnungen trotzdem erstellt werden sollen
    Und der Liegenschaftsverwalter die Vorschau neu berechnen lässt
    Und der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."

  Szenario: Vorschau nennt die erfassten Rechnungen
    Angenommen im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung
    Und warnt die Vorschau nicht vor fehlenden Rechnungen

  Szenario: Vor dem Erstellen ist klar, dass nichts verschickt wird
    Angenommen im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter zum Erstellen weitergeht
    Dann erfährt der Liegenschaftsverwalter, dass die Abrechnungen als Entwurf entstehen und nichts verschickt wird

  Szenario: Angefangene Abrechnungen später fortsetzen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" für die Abrechnungen wählt
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Dann sieht der Liegenschaftsverwalter, dass sein Entwurf wiederhergestellt ist
    Wenn der Liegenschaftsverwalter weitergeht
    Dann ist für die Abrechnungen das Gebäude "Lindenhof" gewählt

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
