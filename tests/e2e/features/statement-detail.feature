# language: de
@statements
Funktionalität: Abrechnungsdetail
  Als Liegenschaftsverwalter
  möchte ich eine Nebenkostenabrechnung mit allen Kostenpositionen sehen und weiterbearbeiten
  damit ich sie dem Mieter zustellen und den Zahlungseingang festhalten kann

  Grundlage:
    Angenommen das Gebäude "Lindenhof" in "Winterthur" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.01"
    Und das Heizprofil "Winter" verteilt die Heizkosten so:
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
    Und der Mieter "Eva Frei" existiert
    Und "Eva Frei" mietete die Wohnung "3.01" von "2024-01-01" bis "2024-03-31" für "950" Franken
    Und der Mieter "Marc Huber" existiert
    Und "Marc Huber" mietet die Wohnung "3.01" seit "2024-05-01" für "980" Franken

  # Leerstand im April: die 5 % des Heizprofils trägt der Vermieter
  @api
  Szenariogrundriss: Heizkosten bei Mieterwechsel mit Leerstand
    Angenommen für "<Mieter>" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "<Mieter>"
    Dann trägt "<Mieter>" <Anteil> % der Heizkosten, also "<Betrag>"

    Beispiele:
      | Mieter     | Anteil | Betrag     |
      | Eva Frei   | 43     | CHF 430.00 |
      | Marc Huber | 52     | CHF 520.00 |

  # Der Anteil ist der Teil der Gebäudekosten, den der Mieter trägt: zwei gleich grosse Wohnungen, ein ganzes Jahr
  @api
  Szenario: Anteil an den Heizkosten des Gebäudes
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-01-01" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Dann trägt "Lea Graf" 50 % der Heizkosten, also "CHF 500.00"

  Szenario: Abrechnung versenden
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann hat die Abrechnung den Status "Versendet"

  Szenario: Vor dem Versand Empfänger und PDF prüfen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als versendet markieren will
    Dann nennt die Bestätigung den Empfänger "Eva Frei" mit dem Korrespondenzkanal "Per Brief"
    Und sagt die Bestätigung, dass Dwello die Abrechnung nicht selbst verschickt
    Und bietet die Bestätigung das PDF der Abrechnung zum Ansehen an

  Szenario: Zahlungseingang festhalten
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"

  Szenario: Entwurf löschen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung löscht
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"
    Und die Abrechnung 2024 von "Eva Frei" ist nicht mehr auffindbar

  Szenario: Versendete Abrechnung kann nicht gelöscht werden
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann hat die Abrechnung den Status "Versendet"
    Und bietet die Detailseite das Löschen der Abrechnung nicht an

  Szenario: Zur Bearbeitung der Abrechnung wechseln
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"

  Szenario: Mieter öffnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter den Mieter der Abrechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eva Frei"

  Szenario: Wohnung öffnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Wohnung der Abrechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 3.01"

  Szenario: Zurück zur Abrechnungsliste
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter zur Abrechnungsliste zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: PDF erstellen und herunterladen
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann erhält der Liegenschaftsverwalter die Abrechnung als PDF

  Szenario: PDF in der Sprache des Mieters
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und die Korrespondenz an "Eva Frei" ist auf "Französisch"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann trägt das PDF den Titel "Décompte des charges"
