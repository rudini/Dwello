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

  # Erneut erstellen ergänzt nur: ein Mietvertrag mit einer Abrechnung dieser Periode erhält keine zweite
  @api
  Szenario: Abrechnungen erneut erstellen ergänzt nur die fehlenden
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Dann wurde 1 Nebenkostenabrechnung erstellt

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
    Dann kostet die Abrechnung von "Eva Frei" "CHF 449.35"
    Und kostet die Abrechnung von "Marc Huber" "CHF 543.40"

  # Abgerechnet werden die Kosten der Periode: massgebend ist der Zeitraum der Leistung (Art. 257b OR)
  @api
  Szenario: Eine Rechnung gilt für ihren Leistungszeitraum, nicht für ihr Rechnungsdatum
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-01-15" für die Zeit vom "2024-10-01" bis "2024-12-31"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann kostet die Abrechnung von "Marc Huber" "CHF 927.00"
    Und kostet die Abrechnung von "Eva Frei" "CHF 0.00"

  # Eine Abrechnungsperiode nur aus Monaten mit 0 % im Heizprofil (Mittelland: Juni bis August): die Heizkosten gehen nach Mietstagen wie jede andere
  # Rechnung, mit ihrem Leistungszeitraum (#137). 900 Franken für Juli bis September: 900 × 62/92 = 606.52 in der Periode,
  # die Hälfte für die Wohnung (303.26), davon 48 der 62 Tage: 234.78, plus 3 % Verwaltungspauschale (7.04)
  @api
  Szenario: Heizkosten einer Periode ohne Heizanteil gelten für ihren Leistungszeitraum
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-07-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "900" Franken vom "2024-10-05" für die Zeit vom "2024-07-01" bis "2024-09-30"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen vom "2024-06-01" bis "2024-08-31" für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" öffnet
    Dann kostet die Abrechnung von "Lea Graf" "CHF 241.82"

  # Abgerechnet wird das verbrauchte Heizöl: Anfangsbestand + Einkauf − Endbestand, hier 600 + 1000 − 100 = 1500 Franken,
  # verteilt nach dem Heizprofil mit Warmwasser (Mai–Dezember 53.5 %, Januar–März 37.2 %) plus 3 % Verwaltungspauschale
  Szenario: Heizöl wird nach Verbrauch abgerechnet, nicht nach Einkauf
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-06-15"
    Wenn der Liegenschaftsverwalter für das Gebäude "Lindenhof" den Tankbestand vom "2023-12-31" mit "600" Franken erfasst
    Und der Liegenschaftsverwalter für das Gebäude "Lindenhof" den Tankbestand vom "2024-12-31" mit "100" Franken erfasst
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Und der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung + Warmwasser" öffnet
    Dann kostet die Abrechnung von "Marc Huber" "CHF 826.58"
    Und kostet die Abrechnung von "Eva Frei" "CHF 574.74"

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
    Dann warnt das Rechnungsformular, dass das Rechnungsdatum nicht in der Abrechnungsperiode "01.01.2024 – 31.12.2024" liegt
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

  # Jede Kategorie mit Kosten im Vorjahr wird mit dem gleichen Zeitraum im Vorjahr verglichen
  Szenario: Hinweis auf fehlende Rechnungen einer Kategorie
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2023-10-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "460" Franken vom "2023-03-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "475" Franken vom "2023-12-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "470" Franken vom "2024-06-30"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Kaminfeger": "Keine Rechnung in dieser Kategorie erfasst"
    Und meldet die Prüfung der Kategorien für "Kaltwasser": "Rechnung für das 2. Halbjahr fehlt"
    Wenn der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."

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

  Szenario: Ein gewähltes Gebäude gibt es nicht mehr
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter das Gebäude "Ahornhof" für die Abrechnungen wählt
    Und das Gebäude "Ahornhof" wird inzwischen gelöscht
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Dann sagt der wiederhergestellte Entwurf "Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt 2 «Gebäude»."

  Szenario: Schon abgerechnete Mietverträge zeigen sich bei der Wahl der Gebäude
    Angenommen für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Dann nennt die Wahl für "Lindenhof" "Von 2 Mietverträgen in dieser Abrechnungsperiode hat 1 schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt."

  Szenario: Erstellte Abrechnungen anzeigen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Nach dem Erstellen die Entwürfe der Abrechnungsperiode anzeigen
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietete die Wohnung "3.02" von "2023-01-01" bis "2023-12-31" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2023
    Und der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode "01.01.2024 – 31.12.2024" zeigt
    Und sieht der Liegenschaftsverwalter die Abrechnung 2024 von "Marc Huber"
    Aber nicht die Abrechnung 2023 von "Lea Graf"

  Szenario: Zurück zur Abrechnungsliste
    Wenn der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Weitere Abrechnungen erstellen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" erstellt
    Wenn der Liegenschaftsverwalter weitere Abrechnungen erstellen will
    Dann beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode

  # A-10: wer eine Abrechnung neu erstellt, erhält Heizprofil und Verwaltungspauschale der übrigen Abrechnungen
  Szenario: Neue Abrechnung übernimmt die Einstellungen der Periode
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
    Dann schlägt der Assistent das Heizprofil "Winter" vor

  # #89: hat keine Abrechnung der Periode den Satz des Laufs, kommt nur das Heizprofil von den übrigen Abrechnungen
  Szenario: Neue Abrechnung übernimmt das Heizprofil, die Verwaltungspauschale kommt aus den Einstellungen
    Angenommen es gibt das Heizprofil "Winter"
    Und im Mietvertrag von "Eva Frei" ist keine Verwaltungspauschale vereinbart
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
    Dann schlägt der Assistent das Heizprofil "Winter" vor
    Und sagt der Assistent "Das Heizprofil ist wie bei den übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt, die Verwaltungspauschale kommt aus den Einstellungen."
