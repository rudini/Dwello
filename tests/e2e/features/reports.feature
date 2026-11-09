# language: de
@reports
Funktionalität: Berichte
  Als Liegenschaftsverwalter
  möchte ich nach dem Erstellen der Abrechnungen nachlesen, welchen Teil der Kosten des Gebäudes die Mieter tragen
  damit ich weiss, was ich selbst trage, und Abrechnungen finde, die nicht aktuell sind

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

  Szenario: Die Berichte nennen jede Periode eines Gebäudes mit Abrechnungen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Berichte öffnet
    Dann nennen die Berichte die Kostenabstimmung "Lindenhof, 01.01.2024 – 31.12.2024"

  Szenario: Kostenabstimmung einer Periode öffnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist in den Berichten
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann ist der Liegenschaftsverwalter auf der Kostenabstimmung 2024 von "Lindenhof"

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
    Und erklärt die Kostenabstimmung der Berichte "Sie tragen den Anteil für Leerstand, für Kategorien, die ein Mietvertrag nicht oder erst ab einem späteren Tag vereinbart, und für Tage, die ausserhalb von Dwello abgerechnet sind. Auch Nebenkosten, die ein Mieter pauschal bezahlt, sind in Ihrem Anteil enthalten. Weil jeder Anteil auf Rappen gerundet ist, kann «davon tragen Sie» einige Rappen höher oder tiefer sein."
    Aber nennt die Kostenabstimmung der Berichte keinen Hinweis

  # Marcs Mietvertrag hat noch keine Abrechnung: sein Anteil steht in «davon tragen Sie», ein Hinweis sagt es
  Szenario: Die Kostenabstimmung nennt Mietverträge ohne Abrechnung
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 298.36" und "CHF 901.64"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Mietvertrag hat für diese Abrechnungsperiode noch keine Abrechnung. Sein Anteil ist in «davon tragen Sie» enthalten."

  # #1126 (PO 05.11.2026 zu Persona Sven 1126 P-2): der Hinweis nennt die Mieter der Entwürfe mit Link
  Szenario: Die Kostenabstimmung nennt die Abrechnungen im Entwurf
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Total" mit "CHF 1’200.00", "CHF 1’101.64" und "CHF 98.36"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Abrechnung ist noch ein Entwurf. Sie zählt schon mit, ist aber noch nicht versendet:"
    Und nennt der Hinweis zu den Entwürfen die Abrechnung von "Marc Huber"

  # Die ersetzte Abrechnung von Eva zählt nicht; ohne berichtigte hat ihr Mietvertrag keine gültige Abrechnung
  Szenario: Eine ersetzte Abrechnung zählt in der Kostenabstimmung nicht
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 803.28" und "CHF 396.72"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "1 Mietvertrag hat für diese Abrechnungsperiode noch keine Abrechnung. Sein Anteil ist in «davon tragen Sie» enthalten."

  # #1126 (PO 05.11.2026 zu Fachreview 1126-1 V-4): die berichtigte Abrechnung zählt statt der ersetzten (sonst 1'400.00)
  Szenario: Die berichtigte Abrechnung zählt in der Kostenabstimmung
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 1’101.64" und "CHF 98.36"

  # #1126 (PO 05.11.2026 zu Fachreview 1126-1 M-1, V-1): eine Rechnung, die nach dem Erstellen erfasst wird, macht
  # beide Abrechnungen nicht aktuell: Hauswart 1'500.00, die Mieter weiter 1'101.64
  Szenario: Die Kostenabstimmung nennt Abrechnungen, die nicht aktuell sind
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-11-30"
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’500.00", "CHF 1’101.64" und "CHF 398.36"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "2 Abrechnungen dieser Abrechnungsperiode sind nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht, der Tankbestand geändert oder bei einem Entwurf eine Wohnung oder ein Verteilschlüssel so geändert, dass «Neu berechnen» ein anderes Ergebnis ergäbe. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen:"

  # #1328 (Entscheid PO): auch ein Entwurf, den eine danach geänderte Wohnung anders verteilen liesse
  Szenario: Die Kostenabstimmung nennt einen Entwurf nach einer geänderten Wohnung als nicht aktuell
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Wohnung "3.02" hat danach "140" m² und "3.5" Zimmer
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte den Hinweis "1 Abrechnung dieser Abrechnungsperiode ist nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht, der Tankbestand geändert oder bei einem Entwurf eine Wohnung oder ein Verteilschlüssel so geändert, dass «Neu berechnen» ein anderes Ergebnis ergäbe."

  # Fachreview 1126-1 M-1: nach dem Löschen einer Rechnung verrechnen die Abrechnungen mehr als die Kosten des Gebäudes;
  # Hauswart 1'500.00 beim Erstellen: Eva 372.95, Marc 1'004.10 = 1'377.05 gegen 1'200.00
  Szenario: Die Kostenabstimmung zeigt, wenn die Abrechnungen mehr verrechnen als die Kosten des Gebäudes
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-11-30"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Rechnung "Hauswart 2024-11-30" ist danach gelöscht
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann nennt die Kostenabstimmung der Berichte "Hauswart" mit "CHF 1’200.00", "CHF 1’377.05" und "CHF -177.05"
    Und nennt die Kostenabstimmung der Berichte den Hinweis "2 Abrechnungen dieser Abrechnungsperiode sind nicht aktuell"

  Szenario: Abrechnung öffnen, die nicht aktuell ist
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-11-30"
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Und der Liegenschaftsverwalter in der Kostenabstimmung die Abrechnung von "Eva Frei" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Eva Frei"

  # #1138 (PO 06.11.2026): die Sätze zum Tankbestand und zum Leerstand stehen auch in den Berichten
  Szenario: Die Kostenabstimmung der Berichte nennt den Tankbestand einer Position
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-06-15"
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann erklärt die Kostenabstimmung der Berichte den Tankbestand mit "In «Heizung» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 600.00, Endbestand CHF 100.00."

  Szenario: Die Kostenabstimmung der Berichte nennt die Wohnungen mit Leerstand
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024
    Wenn der Liegenschaftsverwalter die Kostenabstimmung 2024 von "Lindenhof" öffnet
    Dann erklärt die Kostenabstimmung der Berichte den Leerstand mit "Leerstand in dieser Abrechnungsperiode: Wohnung 3.01 (30 Tage)."
