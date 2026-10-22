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
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Dann wurden 2 Nebenkostenabrechnungen erstellt

  # Erneut erstellen ergänzt nur: ein Mietvertrag mit einer Abrechnung dieser Periode erhält keine zweite
  @api
  Szenario: Abrechnungen erneut erstellen ergänzt nur die fehlenden
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Dann wurde 1 Nebenkostenabrechnung erstellt

  # #120, #358: eine ersetzte Abrechnung zählt nicht als Abrechnung der Periode; der Lauf erstellt ihre berichtigte
  @api
  Szenario: Der Abrechnungslauf rechnet einen Mietvertrag mit ersetzter Abrechnung wieder ab
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
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

  # Kosten, die nur alle paar Jahre anfallen, zählen jedes Jahr mit ihrem Teil (#254): der Boiler wird am 01.04.2026 entkalkt,
  # das nächste Mal in 5 Jahren; von 500 Franken über 1'826 Tage zählen 275 Tage in 2026 (75.30) und 365 Tage in 2027 (99.95)
  @api
  Szenariogrundriss: Eine Rechnung über mehrere Jahre zählt in jeder Periode mit ihrem Teil
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Warmwasser" über "500" Franken vom "2026-04-01" für die Zeit vom "2026-04-01" bis "2031-03-31"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen <Periode> für das Gebäude "Lindenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Marc Huber" "<Betrag>"

    Beispiele:
      | Periode | Betrag    |
      | 2026    | CHF 75.30 |
      | 2027    | CHF 99.95 |

  # Das PDF eines Entwurfs kann schon weitergegeben sein: die Abrechnungsnummer eines gelöschten Entwurfs wird nicht
  # wieder vergeben, sie bleibt eine Lücke (#97). Eva Frei erhält -0001, Marc Huber -0002, nach dem Löschen -0003.
  Szenario: Die Abrechnungsnummer eines gelöschten Entwurfs wird nicht wieder vergeben
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Marc Huber" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Und der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann endet die Abrechnungsnummer von "Marc Huber" auf "-2024-0003"
    Und endet die Abrechnungsnummer von "Eva Frei" auf "-2024-0001"

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

  # #133: bis «Abgerechnet bis» sind die Nebenkosten ausserhalb von Dwello abgerechnet; eine Periode, die bis dahin
  # endet, erhält keine Abrechnung
  @api
  Szenario: Ein ausserhalb von Dwello abgerechneter Mietvertrag erhält keine Abrechnung
    Angenommen der Mietvertrag von "Marc Huber" ist bis "2024-12-31" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann enthält die Vorschau die Abrechnung von "Eva Frei"
    Und die Vorschau enthält genau 1 Abrechnung

  # #133: reicht die Abrechnungsperiode über «Abgerechnet bis» hinaus, zählen Mietstage und Akontobeiträge
  # erst ab dem Tag danach. Hauswart 732.00 für 366 Tage = 2.00 pro Tag; Eva Frei vom 01.03. bis 31.03.2024: 31 Tage
  # = 62.00 + 3 % = 63.86, Akonto nur für März 120.00; Marc Huber bleibt bei 245 Tagen = 490.00 + 3 % = 504.70
  @api
  Szenario: Nach «Abgerechnet bis» zählen Mietstage und Akonto ab dem Tag danach
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31" für die Zeit vom "2024-01-01" bis "2024-12-31"
    Und der Mietvertrag von "Eva Frei" hat "120" Franken Akonto
    Und der Mietvertrag von "Eva Frei" ist bis "2024-02-29" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann kostet die Abrechnung von "Eva Frei" "CHF 63.86"
    Und beträgt der Saldo von "Eva Frei" "Rückerstattung CHF 56.15"
    Und kostet die Abrechnung von "Marc Huber" "CHF 504.70"

  # #453 (#327): vor dem Erstellen prüft der Liegenschaftsverwalter, ob «Abgerechnet bis» wirkt: jede Zeile nennt die
  # abgerechneten Tage und das Akonto, Eva Frei 01.03. bis 31.03.2024 = 31 Mietstage, Akonto 1 Monat × 120.00
  Szenario: Die Vorschau nennt Mietstage und Akonto ab dem Tag nach «Abgerechnet bis»
    Angenommen der Mietvertrag von "Eva Frei" hat "120" Franken Akonto
    Und der Mietvertrag von "Eva Frei" ist bis "2024-02-29" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau bei "Eva Frei" "01.03.2024 – 31.03.2024, 31 Mietstage, Akonto CHF 120.00"
    Und nennt die Vorschau bei "Eva Frei" "Abgerechnet bis 29.02.2024 (am Mietvertrag): Mietstage und Akonto ab 01.03.2024"
    Und nennt die Vorschau bei "Marc Huber" "01.05.2024 – 31.12.2024, 245 Mietstage"
    Aber nennt die Vorschau bei "Marc Huber" nicht "Abgerechnet"
    Und sagt die Vorschau zum Total "Den Anteil leerer Wohnungen und der Tage, die ausserhalb von Dwello abgerechnet sind, enthält das Total nicht."

  # #453 (#327): ein übergangener Mietvertrag fällt nicht still aus der Vorschau
  Szenario: Die Vorschau nennt einen Mietvertrag, den «Abgerechnet bis» ganz abdeckt
    Angenommen der Mietvertrag von "Marc Huber" ist bis "2024-12-31" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau den übergangenen Mietvertrag von "Marc Huber": "Abgerechnet bis 31.12.2024 (am Mietvertrag). Für diese Abrechnungsperiode erstellt Dwello für diesen Mietvertrag keine Abrechnung."

  Szenario: Von der Vorschau zum übergangenen Mietvertrag
    Angenommen der Mietvertrag von "Marc Huber" ist bis "2024-12-31" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter in der Vorschau den übergangenen Mietvertrag von "Marc Huber" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Marc Huber"

  # #453 (#327): sind alle übergangen, stimmt «keine Mietverträge» nicht
  Szenario: Alle Mietverträge des Gebäudes sind ausserhalb von Dwello abgerechnet
    Angenommen der Mietvertrag von "Eva Frei" ist bis "2024-12-31" ausserhalb von Dwello abgerechnet
    Und der Mietvertrag von "Marc Huber" ist bis "2024-12-31" ausserhalb von Dwello abgerechnet
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann sagt die leere Vorschau zu "Lindenhof" "Alle Mietverträge von Lindenhof sind in dieser Abrechnungsperiode schon ausserhalb von Dwello abgerechnet («Abgerechnet bis» am Mietvertrag)."
    Und nennt die Vorschau den übergangenen Mietvertrag von "Eva Frei": "Abgerechnet bis 31.12.2024 (am Mietvertrag)."

  # #429: die Nebenkostenpauschale wird nicht abgerechnet, nur das Akonto. Hauswart 732.00 für 366 Tage = 2.00 pro Tag;
  # Marc Huber 245 Tage = 490.00 + 3 % = 504.70, Akonto 8 Monate × 50.00 = 400.00, Saldo 104.70
  @api
  Szenario: Die Nebenkostenpauschale zählt nicht in der Abrechnung
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31" für die Zeit vom "2024-01-01" bis "2024-12-31"
    Und der Mietvertrag von "Marc Huber" hat "50" Franken Akonto
    Und der Mietvertrag von "Marc Huber" hat "100" Franken Nebenkostenpauschale
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann kostet die Abrechnung von "Marc Huber" "CHF 504.70"
    Und beträgt der Saldo von "Marc Huber" "Nachzahlung CHF 104.70"

  # A-5 (#114): schon beim Erstellen fällt auf, dass die Abrechnung an die verlassene Wohnung ginge
  Szenario: Vorschau warnt vor der alten Adresse eines ausgezogenen Mieters
    Angenommen die Korrespondenzadresse von "Eva Frei" ist noch die Adresse des Gebäudes "Lindenhof"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann warnt die Vorschau, dass "Eva Frei" ausgezogen ist: "Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein."

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

  # #251: schon abgerechnete Mietverträge erhalten keine neue Abrechnung; das allein ist kein Befund
  Szenario: Bestehende Abrechnungen allein verlangen keine Bestätigung
    Angenommen im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau die bestehenden Abrechnungen von "Lindenhof"
    Wenn der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann erfährt der Liegenschaftsverwalter, dass die Abrechnungen als Entwurf entstehen und nichts verschickt wird

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

  # #65: ohne Vorjahr zum Vergleich kein Hinweis auf Monate ohne Rechnung; eine Rechnung im Jahr kann vollständig sein
  Szenario: Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2024-03-15"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung
    Und weist die Vorschau nicht auf Monate ohne Rechnung hin

  # Jede Kategorie mit Kosten im Vorjahr wird mit dem gleichen Zeitraum im Vorjahr verglichen
  Szenario: Hinweis auf fehlende Rechnungen einer Kategorie
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2023-10-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "460" Franken vom "2023-03-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "475" Franken vom "2023-12-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "470" Franken vom "2024-06-30"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Kaminfeger": "Keine Rechnung in dieser Kategorie erfasst"
    Und meldet die Prüfung der Kategorien für "Kaltwasser": "Die Rechnung für das 2. Halbjahr fehlt"
    Wenn der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."

  # #130 (#409 Punkt 1): ein Rechnungssteller wechselt auf einen gröberen, regelmässigen Rhythmus; die Summe bleibt gleich
  Szenario: Kein Hinweis, wenn der Rechnungssteller von monatlich auf vierteljährlich wechselt
    Angenommen im Gebäude "Lindenhof" gibt es im Jahr 2023 jeden Monat eine Rechnung der Kategorie "Kaltwasser" über "100" Franken
    Und im Gebäude "Lindenhof" gibt es im Jahr 2024 jedes Quartal eine Rechnung der Kategorie "Kaltwasser" über "300" Franken
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann enthält die Vorschau die Abrechnung von "Marc Huber"
    Und meldet die Prüfung der Kategorien nichts für "Kaltwasser"
    Und verlangt die Vorschau keine Bestätigung

  Szenario: Hinweis auf eine Rechnung, die nur teilweise zählt
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "1000" Franken vom "2023-01-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "1200" Franken vom "2025-06-30" für die Zeit vom "2024-07-01" bis "2025-06-30"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Kaltwasser": "1 Rechnung zählt nur teilweise: ihr Leistungszeitraum reicht über die Abrechnungsperiode hinaus."

  # #76: ein befristeter Mietvertrag hat vor seinem Ende keinen Kündigungstermin, auf den Akonto oder neue Nebenkosten
  # steigen könnten; ein unbefristeter behält den Hinweis auf den nächsten Kündigungstermin
  # #388: auch eine Erhöhung, die der Mietvertrag vorsieht, braucht das amtliche Formular
  Szenario: Hinweise zu Akonto und neuen Nebenkosten bei einem befristeten Mietvertrag
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" befristet von "2024-01-01" bis "2099-12-31" für "900" Franken mit "20" Franken Akonto
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2023-01-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "2000" Franken vom "2024-06-30"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann rät die Vorschau für "Lea Graf": "Prüfen Sie, ob Sie das Akonto erhöhen. Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig."
    Und meldet die Prüfung der Kategorien für "Kaltwasser": "frühestens auf den nächsten Kündigungstermin"
    Und meldet die Prüfung der Kategorien für "Kaltwasser": "Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor."

  Szenario: Hinweis auf eine Rechnung ohne Leistungszeitraum kurz nach der Abrechnungsperiode
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "470" Franken vom "2024-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2025-01-20"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt der Hinweis auf Rechnungen nach der Abrechnungsperiode die Rechnung vom "20.01.2025" über "290.00"
    Und verlangt die Vorschau keine Bestätigung

  # Heizöl zählt über den Tankbestand, nicht über einen Leistungszeitraum
  Szenario: Heizöl für den Tank steht nicht im Hinweis auf Rechnungen nach der Abrechnungsperiode
    Angenommen im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "800" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "3000" Franken vom "2025-01-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2025-01-20"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt der Hinweis auf Rechnungen nach der Abrechnungsperiode die Rechnung vom "20.01.2025" über "290.00"
    Und nennt der Hinweis auf Rechnungen nach der Abrechnungsperiode keine Rechnung vom "15.01.2025"

  # Den Endbestand einer laufenden Periode kann es noch nicht geben: sein Stichtag liegt nach heute (#136);
  # der Tankbestand vor 200 Tagen ist ihr Anfangsbestand;
  # die Warnung zur laufenden Periode rät, die Abrechnungen erst nach ihrem Ende zu erstellen
  Szenario: Laufende Periode verlangt keinen Endbestand
    Angenommen im Gebäude "Lindenhof" war vor 200 Tagen Heizöl für "800" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken von heute
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen von vor 199 Tagen bis in 30 Tagen für das Gebäude "Lindenhof" öffnet
    Dann warnt die Vorschau, dass die Abrechnungsperiode noch läuft
    Und nennt die Prüfung der Kategorien keinen fehlenden Tankbestand
    Und verlangt die Vorschau keine Bestätigung

  # Ein Gebäude mit früheren Tankbeständen braucht auch für diese Periode Anfangs- und Endbestand (#72)
  Szenario: Ein vergessener Tankbestand fällt auf
    Angenommen im Gebäude "Lindenhof" war am "2022-12-31" Heizöl für "800" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Heizung": "Die Tankbestände am 31.12.2023 und am 31.12.2024 fehlen."
    Wenn der Liegenschaftsverwalter ohne Bestätigung zum Erstellen weitergehen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen."

  Szenario: Ein stillgelegter Tank braucht keinen Tankbestand mehr
    Angenommen im Gebäude "Lindenhof" war am "2022-12-31" Heizöl für "800" Franken im Tank
    Und das Gebäude "Lindenhof" hat keinen Tank oder der Tank ist stillgelegt
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung
    Und verlangt die Vorschau keine Bestätigung

  # Die Eigenschaft gilt nur für Perioden ohne Tankbestand; im Jahr der Stilllegung zählt der Verbrauch noch (#72)
  Szenario: Im Jahr der Stilllegung braucht es noch den Endbestand
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "800" Franken im Tank
    Und das Gebäude "Lindenhof" hat keinen Tank oder der Tank ist stillgelegt
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Heizung": "Der Tankbestand am 31.12.2024 fehlt."

  # Der Endbestand 0 des Stilllegungsjahres ist der Anfangsbestand des nächsten Jahres (fach-review V-11)
  Szenario: Nach dem Jahr der Stilllegung braucht es keinen Tankbestand mehr
    Angenommen im Gebäude "Lindenhof" war am "2022-12-31" Heizöl für "800" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "0.00" Franken im Tank
    Und das Gebäude "Lindenhof" hat keinen Tank oder der Tank ist stillgelegt
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung
    Und verlangt die Vorschau keine Bestätigung

  Szenario: Ohne Tank fragt die Vorschau nicht nach dem Heizmaterial
    Angenommen das Gebäude "Lindenhof" hat keinen Tank oder der Tank ist stillgelegt
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann nennt die Vorschau für "Lindenhof" 1 erfasste Rechnung
    Und fragt die Vorschau nicht nach dem Heizmaterial

  Szenario: Von der Frage nach dem Heizmaterial zum Gebäude ohne Tank
    Angenommen im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter aus der Frage nach dem Heizmaterial festhalten will, dass "Lindenhof" keinen Tank hat
    Dann ist der Liegenschaftsverwalter auf der Seite "Gebäude bearbeiten"

  # Plausibilität der Tankbestände: ein Hinweis, keine Bestätigung (#73); 100 + 500 − 900 = −300
  Szenario: Hinweis auf einen Endbestand über Anfangsbestand und Einkauf
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "100" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "900" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "500" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Heizung": "Der Endbestand ist CHF 300.00 höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände und ob eine Lieferung fehlt oder ihre Rechnung erst nach dem Ende der Periode datiert ist."
    Und verlangt die Vorschau keine Bestätigung

  # Verbrauch 500 + 2000 − 500 = 2000 gegen 500 + 1000 − 500 = 1000 im Vorjahr: mehr als 25 % und mindestens CHF 100 (#73, #65)
  Szenario: Hinweis auf einen Verbrauch, der stark vom Vorjahr abweicht
    Angenommen im Gebäude "Lindenhof" war am "2022-12-31" Heizöl für "500" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "500" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "500" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2023-02-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "2000" Franken vom "2024-02-15"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann meldet die Prüfung der Kategorien für "Heizung": "Verbrauch CHF 2’000.00, 100 % mehr als im Vorjahr (CHF 1’000.00). Prüfen Sie die Tankbestände."
    Und verlangt die Vorschau keine Bestätigung

  Szenario: Von einer Rechnung nach der Abrechnungsperiode zur Rechnung
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaminfeger" über "290" Franken vom "2025-01-20"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter die Rechnung vom "20.01.2025" aus dem Hinweis bearbeitet
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"

  Szenario: Hinweis auf Rechnungen ohne Leistungszeitraum in einer Abrechnungsperiode unter einem Jahr
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Lift" über "1200" Franken vom "2024-02-15"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Kaltwasser" über "300" Franken vom "2024-03-31" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen vom "2024-01-01" bis "2024-06-30" für das Gebäude "Lindenhof" öffnet
    Dann nennt der Hinweis auf Rechnungen ohne Leistungszeitraum die Rechnung vom "15.02.2024" über "1’200.00"
    Und nennt der Hinweis auf Rechnungen ohne Leistungszeitraum keine Rechnung vom "31.03.2024"
    Und verlangt die Vorschau keine Bestätigung

  Szenario: Von einer Rechnung ohne Leistungszeitraum zur Rechnung
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Lift" über "1200" Franken vom "2024-02-15"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen vom "2024-01-01" bis "2024-06-30" für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter die Rechnung vom "15.02.2024" aus dem Hinweis bearbeitet
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"

  Szenario: Vor dem Erstellen ist klar, dass nichts verschickt wird
    Angenommen im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Und der Liegenschaftsverwalter zum Erstellen weitergeht
    Dann erfährt der Liegenschaftsverwalter, dass die Abrechnungen als Entwurf entstehen und nichts verschickt wird

  # #57: «Entwurf» heisst nur der Abrechnungsstatus; die Eingaben im Assistenten sind «Ihre Angaben»
  Szenario: Angefangene Abrechnungen sind noch nicht gespeichert
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" für die Abrechnungen wählt
    Dann erfährt der Liegenschaftsverwalter, dass seine Angaben nur in diesem Browser aufbewahrt und noch nicht gespeichert sind

  # #201: der Assistent öffnet im Schritt, in dem der Liegenschaftsverwalter aufgehört hat
  Szenario: Angefangene Abrechnungen später fortsetzen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" für die Abrechnungen wählt
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Dann sieht der Liegenschaftsverwalter, dass seine Angaben wiederhergestellt sind
    Und sagt der Hinweis auf die wiederhergestellten Angaben "Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert."
    Und ist der Assistent im Schritt "Gebäude"
    Und ist für die Abrechnungen das Gebäude "Lindenhof" gewählt

  Szenario: Angaben verwerfen fragt zuerst
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" für die Abrechnungen wählt
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Und der Liegenschaftsverwalter seine Angaben verwerfen will
    Dann fragt der Assistent zuerst "Ihre Angaben werden gelöscht."
    Wenn der Liegenschaftsverwalter das Verwerfen bestätigt
    Dann beginnt der Liegenschaftsverwalter wieder mit der Wahl der Periode

  Szenario: Den Hinweis auf wiederhergestellte Angaben schliessen
    Wenn der Liegenschaftsverwalter das Gebäude "Lindenhof" für die Abrechnungen wählt
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Und der Liegenschaftsverwalter den Hinweis auf seine wiederhergestellten Angaben schliesst
    Dann ist für die Abrechnungen das Gebäude "Lindenhof" gewählt
    Und sieht der Liegenschaftsverwalter keinen Hinweis auf wiederhergestellte Angaben

  Szenario: Ein gewähltes Gebäude gibt es nicht mehr
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter das Gebäude "Ahornhof" für die Abrechnungen wählt
    Und das Gebäude "Ahornhof" wird inzwischen gelöscht
    Und der Liegenschaftsverwalter die Seite zum Erstellen von Abrechnungen später wieder öffnet
    Dann sagt der Hinweis auf die wiederhergestellten Angaben "Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt 2 «Gebäude»."

  Szenario: Schon abgerechnete Mietverträge zeigen sich bei der Wahl der Gebäude
    Angenommen für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Dann nennt die Wahl für "Lindenhof" "Von 2 Mietverträgen in dieser Abrechnungsperiode hat 1 schon eine Abrechnung für diese Abrechnungsperiode. Einen Entwurf berechnen Sie auf seiner Seite mit «Neu berechnen» neu. Versendete Abrechnungen lassen sich nicht neu berechnen."

  # #201: «Alle Gebäude» wählt nur Gebäude, für die eine neue Abrechnung entsteht
  Szenario: Alle Gebäude lässt schon abgerechnete Gebäude aus
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Dann nennt die Wahl für "Lindenhof" "Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung für diese Abrechnungsperiode. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt. Einen Entwurf berechnen Sie auf seiner Seite mit «Neu berechnen» neu. Versendete Abrechnungen lassen sich nicht neu berechnen."
    Wenn der Liegenschaftsverwalter alle Gebäude wählt
    Dann ist für die Abrechnungen das Gebäude "Ahornhof" gewählt
    Aber nicht das Gebäude "Lindenhof"
    Und sagt die Wahl der Gebäude, dass «Alle Gebäude» die Gebäude auslässt, deren Mietverträge alle schon eine Abrechnung haben

  # #199, #408 Punkt 2: eine Abrechnungsperiode pro Tag und Gebäude; eine Periode, die eine bestehende des Gebäudes
  # schneidet, ohne gleich zu sein, ist für das Gebäude nicht wählbar, sonst verteilt Dwello eine Rechnung über 100 %
  Szenario: Eine Abrechnungsperiode, die eine bestehende schneidet, lässt sich nicht wählen
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Und für "Marc Huber" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Dann nennt die Wahl für "Lindenhof" "Für Lindenhof gibt es schon Abrechnungen für 01.07.2023 – 30.06.2024. Die gewählte Abrechnungsperiode überschneidet sich damit. Rechnen Sie die übrigen Tage in einer kurzen Abrechnungsperiode 01.07.2024 – 31.12.2024 ab."
    Und lässt sich das Gebäude "Lindenhof" für diese Abrechnungsperiode nicht wählen

  # Tage eines Mietvertrags in der Periode einer bestehenden Abrechnung des Gebäudes rechnet genau diese Periode ab
  Szenario: Die Wahl nennt die bestehende Abrechnungsperiode für Mietverträge ohne Abrechnung
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Dann nennt die Wahl für "Lindenhof" "Für Lindenhof gibt es schon eine Abrechnung für 01.07.2023 – 30.06.2024. Die gewählte Abrechnungsperiode überschneidet sich damit. Rechnen Sie Mietverträge ohne Abrechnung in der Abrechnungsperiode 01.07.2023 – 30.06.2024 ab. Rechnen Sie die übrigen Tage in einer kurzen Abrechnungsperiode 01.07.2024 – 31.12.2024 ab."

  Szenario: Von der Wahl der Gebäude zur bestehenden Abrechnungsperiode
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Und der Liegenschaftsverwalter für "Lindenhof" die Abrechnungsperiode ab "2023-07-01" wählt
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Lindenhof" vom "2023-07-01" bis "2024-06-30"

  Szenario: Von der Wahl der Gebäude zur kurzen Abrechnungsperiode
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Und für "Marc Huber" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2024 wählen will
    Und der Liegenschaftsverwalter für "Lindenhof" die Abrechnungsperiode ab "2024-07-01" wählt
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Lindenhof" vom "2024-07-01" bis "2024-12-31"

  # Beispiel des Fachreviews zu #408: die Rechnung vom 15.11.2024 liegt nur in der kurzen Abrechnungsperiode und
  # zählt dort einmal ganz (Marc 184 von 184 Tagen, dazu 3 % Verwaltungspauschale); den Nachweis «nicht über 100 %»
  # über beide Perioden trägt backend/src/__tests__/statement-period-overlap.pg.test.ts
  @api
  Szenario: Die kurze Abrechnungsperiode rechnet eine Rechnung nur in ihrer Periode ab
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Und für "Marc Huber" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1000" Franken vom "2024-11-15"
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen vom "2024-07-01" bis "2024-12-31" für das Gebäude "Lindenhof" öffnet
    Dann enthält die Vorschau die Abrechnung von "Marc Huber"
    Und die Vorschau enthält genau 1 Abrechnung
    Und kostet die Abrechnung von "Marc Huber" "CHF 1'030.00"

  # Fachreview 199-1 V-2: liegt eine bestehende Abrechnungsperiode ganz im Lauf, sind die übrigen Tage zwei Stücke,
  # jedes eine eigene kurze Abrechnungsperiode
  Szenario: Ein Lauf, der eine bestehende Abrechnungsperiode ganz enthält, bietet zwei kurze Abrechnungsperioden an
    Angenommen für "Marc Huber" gibt es die Abrechnung vom "2024-10-01" bis "2024-12-31" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen vom "2024-07-01" bis "2025-06-30" wählen will
    Dann nennt die Wahl für "Lindenhof" "Für Lindenhof gibt es schon eine Abrechnung für 01.10.2024 – 31.12.2024. Die gewählte Abrechnungsperiode überschneidet sich damit. Rechnen Sie die übrigen Tage in kurzen Abrechnungsperioden ab: 01.07.2024 – 30.09.2024, 01.01.2025 – 30.06.2025."

  # Fachreview 199-1 V-3: in den übrigen Tagen ist die Wohnung leer; dafür gibt es nichts abzurechnen
  Szenario: Die Wahl sagt, wenn in den übrigen Tagen kein Mietvertrag Mietstage hat
    Angenommen für "Eva Frei" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Und für "Marc Huber" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Lindenhof"
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen 2023 wählen will
    Dann nennt die Wahl für "Lindenhof" "Für Lindenhof gibt es schon Abrechnungen für 01.07.2023 – 30.06.2024. Die gewählte Abrechnungsperiode überschneidet sich damit. In den übrigen Tagen hat kein Mietvertrag Mietstage; dafür ist nichts abzurechnen."

  # «Alle Gebäude» wählt kein Gebäude, dessen bestehende Abrechnungsperiode die gewählte schneidet (#199)
  Szenario: Alle Gebäude lässt ein Gebäude mit überschneidender Abrechnungsperiode aus
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Gebäude für die Abrechnungen vom "2024-07-01" bis "2025-06-30" wählen will
    Und der Liegenschaftsverwalter alle Gebäude wählt
    Dann ist für die Abrechnungen das Gebäude "Ahornhof" gewählt
    Aber nicht das Gebäude "Lindenhof"

  Szenario: Erstellte Abrechnungen anzeigen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Nach dem Erstellen die Entwürfe der Abrechnungsperiode anzeigen
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietete die Wohnung "3.02" von "2023-01-01" bis "2023-12-31" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2023
    Und der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen anzeigt
    Dann erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode "01.01.2024 – 31.12.2024" zeigt
    Und sieht der Liegenschaftsverwalter die Abrechnung 2024 von "Marc Huber"
    Aber nicht die Abrechnung 2023 von "Lea Graf"

  # #356: ein Lauf als eine Datei, z.B. um alle Abrechnungen auf einmal zu drucken; frühere Abrechnungen gehören nicht dazu
  Szenario: Alle Abrechnungen eines Laufs als ZIP herunterladen
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen als ZIP herunterlädt
    Dann enthält die ZIP-Datei nur das PDF der Abrechnung 2024 von "Marc Huber", benannt nach ihrer Abrechnungsnummer

  # Eine Abrechnung des Laufs ist inzwischen gelöscht (z.B. in einem zweiten Tab): ein Satz statt einer kaputten Datei
  Szenario: ZIP eines Laufs mit einer inzwischen gelöschten Abrechnung anfordern
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
    Und die Abrechnung 2024 von "Marc Huber" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter die erstellten Abrechnungen als ZIP anfordert
    Dann liest der Liegenschaftsverwalter "Abrechnung nicht gefunden."
    Wenn der Liegenschaftsverwalter von dort zu den Nebenkostenabrechnungen zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Zurück zur Abrechnungsliste
    Wenn der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Weitere Abrechnungen erstellen
    Angenommen der Liegenschaftsverwalter hat die Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" erstellt
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

  # #132: ein neuer Lauf behält die bestehenden Entwürfe; die Vorschau nennt einen Entwurf, der eine danach erfasste
  # Rechnung nicht enthält (gespeicherte Rechnungen der Positionen, #96)
  Szenario: Vorschau nennt einen Entwurf, dem eine danach erfasste Rechnung fehlt
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht."
    Und sagt die Vorschau "Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe."

  # #454 (#408 Punkt 8), Fachreview 454-2 V-19: ein danach geänderter Tankbestand zählt wie eine geänderte Rechnung
  Szenario: Vorschau nennt einen Entwurf mit danach geändertem Tankbestand
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und der Tankbestand vom "2024-12-31" im Gebäude "Lindenhof" ist danach "200" Franken
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Seit dem Erstellen dieses Entwurfs wurde der Tankbestand der Abrechnungsperiode geändert."

  # #132: der übliche Fall nach einer nachträglichen Rechnung: alle Mietverträge haben schon einen Entwurf
  Szenario: Vorschau ohne neue Abrechnung nennt einen Entwurf, dem eine danach erfasste Rechnung fehlt
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht."

  # #132: Abrechnungen derselben Periode mit verschiedenen Einstellungen fallen vor dem Erstellen auf
  Szenario: Vorschau nennt eine Abrechnung mit einem anderen Heizprofil
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Erstellt mit dem Heizprofil «Winter», die neuen Abrechnungen mit «Heizung Mittelland»."
    Und sagt die Vorschau "Damit alle Abrechnungen dieser Abrechnungsperiode gleich gerechnet sind, wählen Sie im Schritt 3 «Heizprofil und Verwaltungspauschale» dasselbe Heizprofil und denselben Satz wie bei den bestehenden Abrechnungen."

  # Persona Dr. Weber P-2: wer die ganze Periode mietet, trägt die Heizkosten nach Mietstagen (#247); ein anderes
  # Heizprofil ändert an seiner Abrechnung nichts
  Szenario: Vorschau nennt kein anderes Heizprofil bei einer Abrechnung über die ganze Periode
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-01-01" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Heizung Mittelland" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau "Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe."
    Aber zur Abrechnung 2024 von "Lea Graf" sagt die Vorschau nichts

  # Fachreview V-1: ein eigenes Heizprofil lässt sich nach dem Erstellen ändern, die Abrechnung behält die Anteile von damals
  Szenario: Vorschau nennt eine Abrechnung, deren Heizprofil danach bearbeitet wurde
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und das Heizprofil "Winter" verteilt die Heizkosten danach so:
      | Monat     | Anteil |
      | Januar    | 30     |
      | Februar   | 20     |
      | März      | 10     |
      | April     | 5      |
      | Mai       | 2      |
      | Juni      | 0      |
      | Juli      | 0      |
      | August    | 0      |
      | September | 2      |
      | Oktober   | 6      |
      | November  | 10     |
      | Dezember  | 15     |
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Das Heizprofil «Winter» wurde nach dem Erstellen dieser Abrechnung bearbeitet. Die Abrechnung rechnet mit den Monatsanteilen von damals."

  Szenario: Vorschau nennt eine Abrechnung mit einer anderen Verwaltungspauschale
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 4.5 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Eva Frei" "Erstellt mit 3 % Verwaltungspauschale, die neuen Abrechnungen mit 4.5 %."

  Szenario: Vorschau nennt eine unveränderte Abrechnung mit denselben Einstellungen nicht
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau "Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe."
    Aber zur Abrechnung 2024 von "Eva Frei" sagt die Vorschau nichts

  Szenario: Von der Vorschau zu einem Entwurf, dem Rechnungen fehlen
    Angenommen es gibt das Heizprofil "Winter"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Und der Liegenschaftsverwalter in der Vorschau die Abrechnung 2024 von "Eva Frei" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Eva Frei"

  # #119: sind die übrigen Abrechnungen der Periode verschieden eingestellt, gibt es keine Vorlage: beides kommt aus den Einstellungen
  Szenario: Übrige Abrechnungen der Periode mit verschiedenen Heizprofilen
    Angenommen es gibt das Heizprofil "Winter"
    Und es gibt das Heizprofil "Sommer"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Sommer"
    Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
    Dann sagt der Assistent "Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt. Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen."

  # #387 (#406 Punkt 7): beim Mieterwechsel gilt das Heizprofil der Abrechnung derselben Wohnung, auch wenn die übrigen
  # Abrechnungen der Periode verschieden eingestellt sind; so tragen Vor- und Nachmieter zusammen 100 % der Heizkosten
  Szenario: Beim Mieterwechsel das Heizprofil der Abrechnung derselben Wohnung
    Angenommen es gibt das Heizprofil "Winter"
    Und es gibt das Heizprofil "Sommer"
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Roth" existiert
    Und "Lea Roth" mietet die Wohnung "3.02" seit "2023-01-01" für "900" Franken
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für "Lea Roth" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Sommer"
    Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
    Dann schlägt der Assistent das Heizprofil "Winter" vor
    Und sagt der Assistent "Beim Mieterwechsel ist das Heizprofil wie bei der bestehenden Nebenkostenabrechnung derselben Wohnung eingestellt, die Verwaltungspauschale kommt aus den Einstellungen. Prüfen Sie beides und gehen Sie weiter zur Vorschau."

  # Fachreview 387-1 V-1: eine ersetzte Abrechnung zählt nicht als Abrechnung der Periode, auch nicht für das Heizprofil
  Szenario: Eine ersetzte Abrechnung gibt kein Heizprofil vor
    Angenommen es gibt das Heizprofil "Winter"
    Und es gibt das Heizprofil "Sommer"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Sommer"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Wenn der Liegenschaftsverwalter den Assistenten für das Gebäude "Lindenhof" und 2024 öffnet
    Dann schlägt der Assistent das Heizprofil "Sommer" vor

  # #464: jedes Akonto zählt für die Monate, in denen es galt. Hauswart 732.00 für 366 Tage = 2.00 pro Tag;
  # Marc Huber 245 Tage = 490.00 + 3 % = 504.70; Akonto Mai und Juni 2 × 50.00, Juli bis Dezember 6 × 80.00 = 580.00
  @api
  Szenario: Akonto ändert sich während der Abrechnungsperiode
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31" für die Zeit vom "2024-01-01" bis "2024-12-31"
    Und der Mietvertrag von "Marc Huber" hat "50" Franken Akonto
    Und der Mietvertrag von "Marc Huber" hat ab "2024-07-01" "80" Franken Akonto
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" öffnet
    Dann kostet die Abrechnung von "Marc Huber" "CHF 504.70"
    Und beträgt der Saldo von "Marc Huber" "Rückerstattung CHF 75.30"

  # #335 (#451, Punkt 5): Marc Hubers Abrechnung ist versendet, bevor die Heizrechnung für Januar bis März ihren
  # Leistungszeitraum hatte; sie rechnet die Heizkosten über die ganze Periode nach dem Heizprofil. Eva Freis neue
  # Abrechnung rechnet die Monate im Leistungszeitraum: zusammen können beide mehr als die Heizkosten der Wohnung tragen
  Szenario: Vorschau weist auf eine versendete Abrechnung derselben Wohnung nach der alten Regel hin
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Rechnung "Heizung 2024-04-10" gilt danach für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau zur Abrechnung 2024 von "Marc Huber" "ist schon versendet. Sie verteilt die Heizkosten noch über die ganze Abrechnungsperiode, nicht nach dem Leistungszeitraum der Heizrechnungen. Prüfen Sie, ob beide Abrechnungen zusammen mehr als die Heizkosten der Wohnung verrechnen. Wenn ja, erstellen Sie für"

  # #335 (#451, Punkt 5): hatte die Heizrechnung ihren Leistungszeitraum schon beim Erstellen, rechnet die versendete
  # Abrechnung die Monate darin; kein Hinweis
  Szenario: Kein Hinweis auf die alte Regel, wenn die versendete Abrechnung die Monate im Leistungszeitraum rechnet
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt die Vorschau "Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe."
    Aber zur Abrechnung 2024 von "Marc Huber" sagt die Vorschau nichts

  # #339 (#451, Punkt 6): bei einem Mieterwechsel mit Heizprofil zählt eine Heizrechnung mit Leistungszeitraum nur die
  # Monate darin, eine ohne über die ganze Periode; die Vorschau nennt die Heizrechnungen ohne, wenn andere derselben
  # Kategorie einen haben
  Szenario: Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum neben solchen mit
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1520" Franken vom "2024-03-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1410" Franken vom "2025-01-05" für die Zeit vom "2024-10-01" bis "2024-12-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Dann sagt der Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum "Diese Rechnungen der Kategorie «Heizung» haben keinen Leistungszeitraum, andere derselben Kategorie schon. Tragen Sie bei jeder den Leistungszeitraum ein, damit jeder Mieter die Kosten seiner Monate trägt. Gilt eine Rechnung für die ganze Abrechnungsperiode, tragen Sie die Abrechnungsperiode als Leistungszeitraum ein."
    Und nennt der Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum die Rechnung vom "31.03.2024" über "1’520.00"
    Und nennt der Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum keine Rechnung vom "05.01.2025"
    Und nennt der Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum keine Rechnung vom "31.12.2024"

  Szenario: Von einer Rechnung der Heizkosten ohne Leistungszeitraum zur Rechnung
    Angenommen es gibt das Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1520" Franken vom "2024-03-31"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1410" Franken vom "2025-01-05" für die Zeit vom "2024-10-01" bis "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Lindenhof" mit dem Heizprofil "Winter" und 3 % Verwaltungspauschale öffnet
    Und der Liegenschaftsverwalter die Rechnung vom "31.03.2024" aus dem Hinweis bearbeitet
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"
