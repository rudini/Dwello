# language: de
@reports
Funktionalität: Berichte
  Als Liegenschaftsverwalter
  möchte ich nach dem Erstellen der Abrechnungen nachlesen, welchen Teil der Kosten des Gebäudes die Mieter tragen
  damit ich weiss, was ich selbst trage, und Rechnungen finde, die keine Abrechnung enthält

  # #1126 (PO 05.11.2026): die gültigen Abrechnungen einer Periode gegen die heutigen Rechnungen, je Gebäude.
  # Lindenhof 2024 (366 Tage): Eva Frei 91 Mietstage, Leerstand im April 30 Tage, Marc Huber 245 Mietstage;
  # Hauswart 1'200.00: Eva 298.36, Marc 803.28, Leerstand 98.36
  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.01"
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietete die Wohnung "3.01" von "2024-01-01" bis "2024-03-31" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "3.01" seit "2024-05-01" für "980" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2024-12-31"

  @wip
  Szenario: Die Berichte nennen jede Periode eines Gebäudes mit Abrechnungen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Berichte öffnet
    Dann nennen die Berichte die Kostenabstimmung "Lindenhof, 01.01.2024 – 31.12.2024"

  @wip
  Szenario: Kostenabstimmung einer Periode öffnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist in den Berichten
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann ist der Liegenschaftsverwalter auf der Kostenabstimmung 2024 von "Lindenhof"

  @wip
  Szenario: Die Kostenabstimmung zählt die erstellten Abrechnungen der Periode
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann zeigt die Kostenabstimmung der Berichte:
      | Position | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
      | Hauswart | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
      | Total    | CHF 1’200.00        | CHF 1’101.64 | CHF 98.36        |
    Und erklärt die Kostenabstimmung der Berichte "Sie tragen den Anteil für Leerstand, für Mietverträge, die eine Kategorie nicht vereinbaren, und für Tage, die ausserhalb von Dwello abgerechnet sind."
    Aber nennt die Kostenabstimmung der Berichte keinen Hinweis

  # Marcs Mietvertrag hat noch keine Abrechnung: sein Anteil steht in «davon tragen Sie», ein Hinweis sagt es
  @wip
  Szenario: Die Kostenabstimmung nennt Mietverträge ohne Abrechnung
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 298.36" und "CHF 901.64"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Mietvertrag hat für diese Periode noch keine Abrechnung. Sein Anteil ist in «davon tragen Sie» enthalten."

  @wip
  Szenario: Die Kostenabstimmung nennt die Abrechnungen im Entwurf
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Total" mit "CHF 1’200.00", "CHF 1’101.64" und "CHF 98.36"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Abrechnung ist noch ein Entwurf."

  # Die ersetzte Abrechnung von Eva zählt nicht; ohne berichtigte hat ihr Mietvertrag keine gültige Abrechnung
  @wip
  Szenario: Eine ersetzte Abrechnung zählt in der Kostenabstimmung nicht
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 803.28" und "CHF 396.72"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Mietvertrag hat für diese Periode noch keine Abrechnung. Sein Anteil ist in «davon tragen Sie» enthalten."

  # Eine Rechnung, die nach dem Erstellen erfasst wird, enthält keine gültige Abrechnung: Hauswart 1'500.00,
  # die Mieter weiter 1'101.64
  @wip
  Szenario: Die Kostenabstimmung nennt Rechnungen, die keine Abrechnung enthält
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-11-30"
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’500.00", "CHF 1’101.64" und "CHF 398.36"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "Diese Rechnungen enthält noch keine gültige Abrechnung, weil sie später erfasst oder geändert wurden: Hauswart 2024-11-30. Erstellen Sie berichtigte Abrechnungen, wenn die Mieter sie bezahlen sollen."

  @wip
  Szenario: Rechnung öffnen, die keine Abrechnung enthält
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-11-30"
    Und der Liegenschaftsverwalter ist auf der Kostenabstimmung 2024 von "Lindenhof"
    Wenn der Liegenschaftsverwalter in der Kostenabstimmung die Rechnung "Hauswart 2024-11-30" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung "Hauswart 2024-11-30"
