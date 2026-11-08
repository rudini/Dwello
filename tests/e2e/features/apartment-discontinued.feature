# language: de
@apartments
Funktionalität: Aufgehobene Wohnung
  Als Liegenschaftsverwalter
  möchte ich erfassen, ab welchem Tag es eine Wohnung nach einem Umbau nicht mehr gibt
  damit sie bis zum Tag davor nach Tagen in den Abrechnungen zählt und ich ihren Anteil trage

  # #1284: drei gleich grosse Wohnungen, 1.03 steht leer und ist ab 01.07.2025 aufgehoben (mit 1.02 zusammengelegt)
  @wip
  Szenario: Die aufgehobene Wohnung erfassen
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter die Wohnung ab "2025-07-01" aufhebt
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 4.01"
    Und ist die Wohnung aufgehoben ab "01.07.2025"

  @wip
  Szenario: Eine Wohnung mit laufendem Mietvertrag lässt sich nicht aufheben
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "4.01" seit "2020-01-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter die Wohnung ab "2025-07-01" aufhebt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "TEXT FOLGT (fach-reviewer)"

  # Hauswart 3'000.00 über 2025 (365 Tage): bis 30.06. (181 Tage) teilen drei Wohnungen 1'487.67, je 495.89;
  # ab 01.07. (184 Tage) teilen zwei Wohnungen 1'512.33, je 756.16. Eva Frei zahlt 1'252.05, Sie tragen 495.90
  @api @wip
  Szenario: Bis zum Tag davor zählt die aufgehobene Wohnung nach Tagen
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "1.02" seit "2024-01-01" für "980" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2025 für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Eva Frei" "CHF 1’252.05"
    Und kostet die Abrechnung von "Marc Huber" "CHF 1’252.05"

  @wip
  Szenario: Den Anteil der aufgehobenen Wohnung tragen Sie
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "1.02" seit "2024-01-01" für "980" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2025 für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann zeigt die Kostenabstimmung der Vorschau für "Lindenhof":
      | Position | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
      | Hauswart | CHF 3’000.00        | CHF 2’504.10 | CHF 495.90       |
      | Total    | CHF 3’000.00        | CHF 2’504.10 | CHF 495.90       |

  # Vorher zählt sie ganz (2024: je 1'000.00), ab dem Tag nicht mehr (2026: je 1'500.00)
  @api @wip
  Szenariogrundriss: Vor und ab dem Tag zählt die aufgehobene Wohnung ganz oder gar nicht
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "<Rechnungsdatum>"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen <Periode> für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Eva Frei" "<Betrag>"

    Beispiele:
      | Periode | Rechnungsdatum | Betrag       |
      | 2024    | 2024-12-31     | CHF 1’000.00 |
      | 2026    | 2026-12-31     | CHF 1’500.00 |
