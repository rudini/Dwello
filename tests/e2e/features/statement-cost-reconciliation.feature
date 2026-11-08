# language: de
@statements
Funktionalität: Kostenabstimmung in der Vorschau
  Als Liegenschaftsverwalter
  möchte ich vor dem Erstellen der Abrechnungen sehen, welchen Teil der Kosten des Gebäudes die Mieter tragen
  damit ich prüfen kann, ob die Abrechnungen alle Rechnungen verteilen, und weiss, was ich selbst trage

  # #1126 (PO 05.11.2026): eine Kostenabstimmung je Gebäude, pro Abrechnungsposition; Titel und Texte nach Fachreview
  # 1126-1; die Positionen in der Reihenfolge der Abrechnung. Lindenhof 2024 (366 Tage): Eva Frei 91 Mietstage,
  # Leerstand im April 30 Tage, Marc Huber 245 Mietstage
  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.01"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietete die Wohnung "3.01" von "2024-01-01" bis "2024-03-31" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "3.01" seit "2024-05-01" für "980" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  # Hauswart 1'200.00: Eva 91/366 = 298.36, Marc 245/366 = 803.28, Leerstand 98.36. Allgemeinstrom 366.00: Eva 91.00;
  # Marc hat Allgemeinstrom nicht vereinbart, Leerstand und Marcs Tage 275.00
  Szenario: Die Vorschau stimmt die Kosten des Gebäudes mit den Abrechnungen ab
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Allgemeinstrom" über "366" Franken vom "2024-10-15"
    Und im Mietvertrag von "Marc Huber" ist "Allgemeinstrom" nicht vereinbart
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann zeigt die Kostenabstimmung der Vorschau für "Lindenhof":
      | Position       | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
      | Allgemeinstrom | CHF 366.00          | CHF 91.00    | CHF 275.00       |
      | Hauswart       | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
      | Total          | CHF 1’566.00        | CHF 1’192.64 | CHF 373.36       |
    Und erklärt die Kostenabstimmung der Vorschau für "Lindenhof" "Sie tragen den Anteil für Leerstand, für Kategorien, die ein Mietvertrag nicht oder erst ab einem späteren Tag vereinbart, und für Tage, die ausserhalb von Dwello abgerechnet sind. Auch Nebenkosten, die ein Mieter pauschal bezahlt, sind in Ihrem Anteil enthalten. Weil jeder Anteil auf Rappen gerundet ist, kann «davon tragen Sie» einige Rappen höher oder tiefer sein."

  # Die Pauschale gehört nicht zu den Kosten des Gebäudes: 3 % von 298.36 = 8.95 und von 803.28 = 24.10
  Szenario: Die Vorschau nennt die Verwaltungspauschale neben der Kostenabstimmung
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit 3 % Verwaltungspauschale öffnet
    Dann zeigt die Kostenabstimmung der Vorschau für "Lindenhof":
      | Position | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
      | Hauswart | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
      | Total    | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
    Und nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Verwaltungspauschale (bezahlen die Mieter zusätzlich zu «davon Mieter», sie steht Ihnen zu)" mit "CHF 33.05"

  Szenario: Die Vorschau nennt die nicht umlagefähigen Rechnungen neben der Kostenabstimmung
    Angenommen im Gebäude "Lindenhof" gibt es eine nicht umlagefähige Rechnung der Kategorie "Reparaturen" über "500" Franken vom "2024-08-20"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Nicht umlagefähige Rechnungen (tragen Sie ganz)" mit "CHF 500.00"
    Und nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Total" mit "CHF 1’200.00"

  # Ohne Pauschale und ohne nicht umlagefähige Rechnungen erscheinen ihre Zeilen nicht (Anker: die Totalzeile); der
  # Assistent schlägt eine Pauschale vor, darum 0 %
  Szenario: Die Vorschau zeigt keine Zeilen mit CHF 0.00 neben der Kostenabstimmung
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Total" mit "CHF 1’200.00"
    Aber nennt die Kostenabstimmung der Vorschau für "Lindenhof" nicht "Verwaltungspauschale"
    Und nennt die Kostenabstimmung der Vorschau für "Lindenhof" nicht "Nicht umlagefähige"

  # Ein Gebäude ohne umlagefähige Rechnungen: nur der Hinweis «Keine Rechnungen erfasst», keine Tabelle
  Szenario: Ohne umlagefähige Rechnungen zeigt die Vorschau keine Kostenabstimmung
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "1.01" seit "2024-01-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Birkenhof" öffnet
    Dann nennt die Vorschau bei den Rechnungen von "Birkenhof" "Keine Rechnungen erfasst"
    Aber zeigt die Vorschau keine Kostenabstimmung für "Birkenhof"

  # #1126 «Empty» (code review 1126-2 C-1, 1126-3 C-5): ohne umlagefähige Rechnungen keine Tabelle, die nicht
  # umlagefähigen Rechnungen trotzdem
  Szenario: Ohne umlagefähige Rechnungen nennt die Vorschau die nicht umlagefähigen Rechnungen
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "1.01" seit "2024-01-01" für "900" Franken
    Und im Gebäude "Birkenhof" gibt es eine nicht umlagefähige Rechnung der Kategorie "Reparaturen" über "500" Franken vom "2024-08-20"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Birkenhof" öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Birkenhof" "Nicht umlagefähige Rechnungen (tragen Sie ganz)" mit "CHF 500.00"
    Aber nennt die Kostenabstimmung der Vorschau für "Birkenhof" nicht "Total"

  # #1126 (PO): rechnet der Lauf nur die übrigen Mietverträge ab, zählen die schon erstellten Abrechnungen mit
  Szenario: Die Kostenabstimmung der Vorschau zählt die schon erstellten Abrechnungen der Periode mit
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann zeigt die Kostenabstimmung der Vorschau für "Lindenhof":
      | Position | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
      | Hauswart | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
      | Total    | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |

  # #1138 (PO 06.11.2026): ein Satz unter der Tabelle nennt die Position mit Tankbestand; Heizung 1'000.00 +
  # Anfangsbestand 600.00 − Endbestand 100.00 = 1'500.00
  Szenario: Die Kostenabstimmung der Vorschau nennt den Tankbestand einer Position
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-06-15"
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Heizung" mit "CHF 1’500.00"
    Und erklärt die Kostenabstimmung der Vorschau für "Lindenhof" den Tankbestand mit "In «Heizung» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 600.00, Endbestand CHF 100.00."

  Szenario: Ohne Tankbestand nennt die Kostenabstimmung der Vorschau keinen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Lindenhof" "Total" mit "CHF 1’200.00"
    Aber nennt die Kostenabstimmung der Vorschau für "Lindenhof" nicht "Tankbestand"

  # #1138 (PO 06.11.2026): Wohnung 3.01 ist im April 2024 30 Tage ohne Mietvertrag
  Szenario: Die Kostenabstimmung der Vorschau nennt die Wohnungen mit Leerstand
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann erklärt die Kostenabstimmung der Vorschau für "Lindenhof" den Leerstand mit "Leerstand in dieser Abrechnungsperiode: Wohnung 3.01 (30 Tage)."

  Szenario: Ohne Leerstand nennt die Kostenabstimmung der Vorschau keinen
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "1.01" seit "2024-01-01" für "900" Franken
    Und im Gebäude "Birkenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Birkenhof" öffnet
    Dann nennt die Kostenabstimmung der Vorschau für "Birkenhof" "Total" mit "CHF 1’200.00"
    Aber nennt die Kostenabstimmung der Vorschau für "Birkenhof" nicht "Leerstand in dieser"
