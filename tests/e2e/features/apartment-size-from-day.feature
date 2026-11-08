# language: de
@apartments @wip
Funktionalität: Fläche und Zimmeranzahl ab einem Tag
  Als Liegenschaftsverwalter
  möchte ich erfassen, ab welchem Tag eine Wohnung nach einem Umbau eine andere Fläche und Zimmeranzahl hat
  damit die Abrechnungen bis zum Tag davor mit den bisherigen Werten und ab dem Tag mit den neuen rechnen

  # #1301: 4.01 wird ab 01.07.2025 durch einen Umbau grösser
  Szenario: Die neue Fläche ab einem Tag erfassen
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter ab "2025-07-01" die Fläche "140" und die Zimmeranzahl "5.5" speichert
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 4.01"
    Und hat die Wohnung "5.5" Zimmer und "140 m²" im Stockwerk "1. OG"
    Und hatte die Wohnung bis "30.06.2025" "70 m²" und "3.5" Zimmer

  Szenario: Neue Werte gelten erst nach dem Tag der letzten Änderung
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und die Wohnung "4.01" hat ab "2025-07-01" "140" m² und "5.5" Zimmer
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter ab "2025-03-01" die Fläche "150" und die Zimmeranzahl "6" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Fläche und die Zimmeranzahl gelten bereits ab 01.07.2025 neu. Neue Werte können erst ab einem späteren Tag gelten. Wählen Sie einen Tag nach dem 01.07.2025, oder lassen Sie das Feld leer, um die heutigen Werte zu korrigieren."

  Szenario: Ein Tag ohne neue Werte wird nicht gespeichert
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter ab "2025-07-01" die Fläche "70" und die Zimmeranzahl "3.5" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Fläche und Zimmeranzahl sind unverändert. Ändern Sie die Fläche oder die Zimmeranzahl, oder lassen Sie das Feld leer."

  # Das Beispiel aus #1301: drei Wohnungen zu 70 m², 1.03 wird ab 01.07.2025 mit 1.02 zusammengelegt (1.02 hat dann
  # 140 m²). Hauswart (nach Fläche) 3'000.00 über 2025: bis 30.06. (181 Tage) teilen drei Wohnungen 1'487.67 zu je
  # 70 / 210 m², je 495.89; ab 01.07. (184 Tage) teilen zwei Wohnungen 1'512.33: 1.01 70 / 210 m² = 504.11, 1.02
  # 140 / 210 m² = 1'008.22. Eva Frei zahlt 1'000.00, Marc Huber 1'504.11, Sie tragen 495.89 (1.03 bis 30.06.)
  @api
  Szenario: Bis zum Tag davor rechnet die Abrechnung mit der bisherigen Fläche, ab dem Tag mit der neuen
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "1.02" seit "2024-01-01" für "980" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und die Wohnung "1.02" hat ab "2025-07-01" "140" m² und "5.5" Zimmer
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2025 für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Eva Frei" "CHF 1’000.00"
    Und kostet die Abrechnung von "Marc Huber" "CHF 1’504.11"

  # Vorher gilt die bisherige Fläche ganz (2024: je 1'000.00), ab dem Tag die neue (2026: 140 / 210 m² = 2'000.00)
  @api
  Szenariogrundriss: Vor und ab dem Tag gilt die bisherige oder die neue Fläche
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "1.02" seit "2024-01-01" für "980" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und die Wohnung "1.02" hat ab "2025-07-01" "140" m² und "5.5" Zimmer
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "<Rechnungsdatum>"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen <Periode> für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Marc Huber" "<Betrag>"

    Beispiele:
      | Periode | Rechnungsdatum | Betrag       |
      | 2024    | 2024-12-31     | CHF 1’000.00 |
      | 2026    | 2026-12-31     | CHF 2’000.00 |

  Szenario: Das PDF zeigt die Rechnung mit der bisherigen und der neuen Fläche
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "1.02" seit "2024-01-01" für "980" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und die Wohnung "1.02" hat ab "2025-07-01" "140" m² und "5.5" Zimmer
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Wohnung 1.02 hat ab 01.07.2025 140.00 m² und 5.5 Zimmer, bis zum 30.06.2025 70.00 m² und 3.5 Zimmer."
    Und steht im PDF "01.01.2025 – 30.06.2025, 3 Wohnungen: 70.00 / 210.00 m² × CHF 1'487.67 = CHF 495.89 × 181/181 Tage = CHF 495.89"
    Und steht im PDF "01.07.2025 – 31.12.2025, 2 Wohnungen: 140.00 / 210.00 m² × CHF 1'512.33 = CHF 1'008.22 × 184/184 Tage = CHF 1'008.22"

  Szenario: Die Abrechnung nennt die Wohnung mit der neuen Fläche
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und die Wohnung "1.02" hat ab "2025-07-01" "105" m² und "4.5" Zimmer
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Eva Frei"
    Dann nennt die Detailseite der Abrechnung "Wohnung 1.02 hat ab 01.07.2025 eine andere Fläche oder Zimmeranzahl. Abrechnungspositionen mit Kosten vor und ab diesem Tag sind je Zeitraum gerechnet; die Zeilen dazu stehen im PDF."
