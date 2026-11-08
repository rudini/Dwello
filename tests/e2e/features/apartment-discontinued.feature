# language: de
@apartments
Funktionalität: Aufgehobene Wohnung
  Als Liegenschaftsverwalter
  möchte ich erfassen, ab welchem Tag es eine Wohnung nach einem Umbau nicht mehr gibt
  damit sie bis zum Tag davor nach Tagen in den Abrechnungen zählt und ich ihren Anteil trage

  # #1284: drei gleich grosse Wohnungen, 1.03 steht leer und ist ab 01.07.2025 aufgehoben (zu einem Gemeinschaftsraum umgebaut)
  Szenario: Die aufgehobene Wohnung erfassen
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter die Wohnung ab "2025-07-01" aufhebt
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 4.01"
    Und ist die Wohnung aufgehoben ab "01.07.2025"

  Szenario: Eine Wohnung mit laufendem Mietvertrag lässt sich nicht aufheben
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "4.01" seit "2020-01-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Wenn der Liegenschaftsverwalter die Wohnung ab "2025-07-01" aufhebt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Wohnung kann nicht ab 01.07.2025 aufgehoben werden: Der Mietvertrag mit Anna Keller endet nicht vor diesem Tag. Erfassen Sie zuerst ein Vertragsende vor dem 01.07.2025, oder wählen Sie einen späteren Tag." zum Mietvertrag von "Anna Keller"

  # Hauswart 3'000.00 über 2025 (365 Tage): bis 30.06. (181 Tage) teilen drei Wohnungen 1'487.67, je 495.89;
  # ab 01.07. (184 Tage) teilen zwei Wohnungen 1'512.33, je 756.17 (jede Zeile rechnet mit den Beträgen, die sie
  # druckt, Fachreview 1284-1 V-3). Eva Frei zahlt 1'252.06, Sie tragen 495.88
  @api
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
    Dann kostet die Abrechnung von "Eva Frei" "CHF 1’252.06"
    Und kostet die Abrechnung von "Marc Huber" "CHF 1’252.06"

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
      | Hauswart | CHF 3’000.00        | CHF 2’504.12 | CHF 495.88       |
      | Total    | CHF 3’000.00        | CHF 2’504.12 | CHF 495.88       |

  # Vorher zählt sie ganz (2024: je 1'000.00), ab dem Tag nicht mehr (2026: je 1'500.00)
  @api
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

  # Fachreview 1284-1 V-2, V-3, V-7: das PDF rechnet je Zeitraum mit den Beträgen, die es druckt
  Szenario: Das PDF zeigt die Rechnung vor und ab dem Tag
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.02"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Wohnung 1.03 gibt es ab 01.07.2025 nicht mehr. Bis zum 30.06.2025 zählt sie im Verteilschlüssel mit; solange sie leer steht, trägt der Vermieter ihren Anteil. Ab 01.07.2025 werden die Nebenkosten des Gebäudes nur noch auf die übrigen Wohnungen verteilt."
    Und steht im PDF "je Zeitraum, siehe unten"
    Und steht im PDF "01.01.2025 – 30.06.2025, 3 Wohnungen: 70.00 / 210.00 m² × CHF 1'487.67 = CHF 495.89 × 181/181 Tage = CHF 495.89"
    Und steht im PDF "01.07.2025 – 31.12.2025, 2 Wohnungen: 70.00 / 140.00 m² × CHF 1'512.33 = CHF 756.17 × 184/184 Tage = CHF 756.17"

  Szenario: Die Abrechnung nennt die aufgehobene Wohnung
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "1.03"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietet die Wohnung "1.01" seit "2024-01-01" für "950" Franken
    Und die Wohnung "1.03" ist aufgehoben ab "2025-07-01"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "3000" Franken vom "2025-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Eva Frei"
    Dann nennt die Detailseite der Abrechnung "Wohnung 1.03 gibt es ab 01.07.2025 nicht mehr. Abrechnungspositionen mit Kosten vor und ab diesem Tag sind je Zeitraum gerechnet; die Zeilen dazu stehen im PDF."

  # Code-Review 1284-2 C-1: ein Mietvertrag der aufgehobenen Wohnung endet spätestens am Tag davor
  Szenario: Ein Mietvertrag endet spätestens am Tag vor der Aufhebung
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietete die Wohnung "4.01" von "2020-01-01" bis "2099-03-31" für "950" Franken
    Und die Wohnung "4.01" ist aufgehoben ab "2099-07-01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter das Vertragsende "2099-12-31" speichern will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Wohnung 4.01 gibt es ab 01.07.2099 nicht mehr. Ein Mietvertrag dieser Wohnung muss spätestens am 30.06.2099 enden. Stimmt der Tag nicht, ändern Sie ihn bei der Wohnung unter «Bearbeiten»."

  # #1311 (Decided): ab dem Tag gibt es die Wohnung nicht mehr; sie ist weder leer noch vermietbar
  Szenario: Ab dem Tag ist die Wohnung aufgehoben, nicht leer
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und die Wohnung "4.01" ist aufgehoben ab "2025-07-01"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "4.01"
    Dann hat die Wohnung den Status "Aufgehoben seit 01.07.2025"
    Und erklärt die Wohnungsseite beim Mietstatus "Die Wohnung gibt es ab dem Tag unter «Aufgehoben ab» nicht mehr; ab diesem Tag kann sie nicht vermietet werden."
    Und bietet die Wohnungsseite keinen neuen Mietvertrag an

  # #1311, Code-Review 1311-1 C-2: den Mietstatus der aufgehobenen Wohnung ändern Sie nicht von Hand
  Szenario: Der Mietstatus der aufgehobenen Wohnung lässt sich nicht von Hand ändern
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und die Wohnung "4.01" ist aufgehoben ab "2025-07-01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Dann kann der Liegenschaftsverwalter den Status "Aufgehoben seit 01.07.2025" nicht von Hand ändern

  # #1311: vor dem Tag steht die Wohnung noch leer
  Szenario: Vor dem Tag steht die aufgehobene Wohnung noch leer
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und die Wohnung "4.01" ist aufgehoben ab "2099-07-01"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Wohnung "4.01"
    Dann hat die Wohnung den Status "Leer"

  # #1311: das Gebäude zählt die aufgehobene Wohnung nicht als leer
  Szenario: Die Gebäudekarte zählt die aufgehobene Wohnung nicht als leer
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.02"
    Und die Wohnung "4.01" ist aufgehoben ab "2025-07-01"
    Und der Liegenschaftsverwalter ist auf der Gebäudeliste
    Dann nennt die Karte des Gebäudes "Erlenhof" "1 leer"
    Und nennt die Karte des Gebäudes "Erlenhof" "1 aufgehoben"

  # #1312 (Decided): die Hilfe nennt, wann Sie den Anteil tragen und wer ab dem Tag die Kosten teilt
  Szenario: Die Hilfe zu «Aufgehoben ab» nennt, wann Sie den Anteil tragen
    Angenommen das Gebäude "Erlenhof" in "Winterthur" existiert
    Und im Gebäude "Erlenhof" gibt es die leere Wohnung "4.01"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung "4.01"
    Dann erklärt die Bearbeitungsseite der Wohnung zu «Aufgehoben ab» "Bis zum Tag davor zählt sie in den Abrechnungen mit. Solange sie leer steht, tragen Sie ihren Anteil. Ab diesem Tag verteilt Dwello die Nebenkosten des Gebäudes nur noch auf die übrigen Wohnungen."
    Und erklärt die Bearbeitungsseite der Wohnung zu «Aufgehoben ab» "Nutzen Sie die Räume danach selbst, zum Beispiel als Büro, lassen Sie das Feld leer und wählen Sie den Mietstatus «Gesperrt»: Ihren Anteil an den Nebenkosten tragen dann weiterhin Sie, nicht die übrigen Mieter."
