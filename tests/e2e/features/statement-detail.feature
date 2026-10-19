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

  # #71: eine Heizkostenrechnung mit Leistungszeitraum zählt nur die Monate des Heizprofils darin, auf 100 % gebracht.
  # 1000 Franken für Januar bis März: Eva Frei (Januar bis März) trägt 43 / 43 = 100 % davon, Marc Huber (ab Mai)
  # nichts. Mit der Rechnung über das ganze Jahr (Eva 43 %, Marc 52 %): (430 + 1000) / 2000 = 71.5 %, 520 / 2000 = 26 %
  @api
  Szenariogrundriss: Heizkosten einer Rechnung mit Leistungszeitraum nach den Monaten des Heizprofils darin
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "<Mieter>" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "<Mieter>"
    Dann trägt "<Mieter>" <Anteil> % der Heizkosten, also "<Betrag>"

    Beispiele:
      | Mieter     | Anteil | Betrag       |
      | Eva Frei   | 71.5   | CHF 1'430.00 |
      | Marc Huber | 26     | CHF 520.00   |

  Szenario: Abrechnung versenden
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann hat die Abrechnung den Status "Versendet"

  # A-5 (#114): nach dem Auszug ginge die Abrechnung an die verlassene Wohnung; die Warnung sperrt den Versand nicht
  Szenario: Abrechnung an einen ausgezogenen Mieter mit alter Adresse
    Angenommen die Korrespondenzadresse von "Eva Frei" ist noch die Adresse des Gebäudes "Lindenhof"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann warnt die Detailseite der Abrechnung, dass "Eva Frei" ausgezogen ist: "Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein."
    Wenn der Liegenschaftsverwalter die Abrechnung als versendet markieren will
    Dann warnt die Bestätigung, dass "Eva Frei" ausgezogen ist: "Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein."
    Wenn der Liegenschaftsverwalter den Versand trotzdem bestätigt
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

  # Festgehalten wird der eingegebene Tag, frühestens das Abrechnungsdatum (beim Versenden der Tag des Versands, #138)
  Szenario: Zahlungseingang mit Datum festhalten
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am Tag des Versands bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"
    Und nennt der Verlauf "Bezahlt" am Tag des Versands

  # #403 (4): ein Mieter darf früher zahlen; ein Datum vor dem Abrechnungsdatum gilt erst nach der Bestätigung
  @wip
  Szenario: Zahlungseingang vor dem Abrechnungsdatum bestätigen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am "2025-01-15" bezahlt markiert
    Dann fragt Dwello, ob das Zahlungsdatum vor dem Abrechnungsdatum vom Tag des Versands trotzdem gilt
    Und hat die Abrechnung den Status "Versendet"
    Wenn der Liegenschaftsverwalter das frühere Zahlungsdatum bestätigt
    Dann hat die Abrechnung den Status "Bezahlt"
    Und nennt der Verlauf "Bezahlt" am "15.01.2025"

  # #403 (4): vor dem Ende der Abrechnungsperiode kann die Zahlung nicht für diese Abrechnung sein
  @wip
  Szenario: Kein Zahlungseingang vor dem Ende der Abrechnungsperiode
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am "2024-12-30" bezahlt markiert
    Dann meldet das Feld «Bezahlt am» "Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein."
    Und hat die Abrechnung den Status "Versendet"

  Szenario: Kein Zahlungseingang in der Zukunft
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am "2099-01-01" bezahlt markiert
    Dann meldet das Feld «Bezahlt am» "Das Zahlungsdatum liegt in der Zukunft."
    Und hat die Abrechnung den Status "Versendet"

  # #92: eine Zahlung auf der falschen Abrechnung oder mit falschem Datum lässt sich zurücksetzen; der Verlauf hält das
  # Zurücksetzen mit dem Datum der zurückgesetzten Zahlung fest
  Szenario: Zahlung zurücksetzen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Zahlung zurücksetzt
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf das Zurücksetzen der Zahlung vom Tag des Versands
    Wenn der Liegenschaftsverwalter die Abrechnung als am Tag des Versands bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"

  # #92 (Persona Dr. Weber P-1): das PDF des Versands nennt keine Zahlung; es bleibt nach dem Zurücksetzen, mit seinem
  # Eintrag im Verlauf
  Szenario: Zahlung zurücksetzen behält das PDF des Versands
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Zahlung zurücksetzt
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf "PDF erstellt" am Tag des Versands

  # #92: in einem zweiten Fenster wurde die Zahlung schon zurückgesetzt; die Seite ist veraltet
  Szenario: Zahlung zurücksetzen, die inzwischen schon zurückgesetzt ist
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und die Zahlung der Abrechnung 2024 von "Eva Frei" ist inzwischen zurückgesetzt
    Wenn der Liegenschaftsverwalter die Zahlung zurücksetzt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Abrechnung ist nicht als bezahlt erfasst. Laden Sie die Seite neu."

  # #92: nach Ablauf der Zahlungsfrist ist die Abrechnung nach dem Zurücksetzen wieder überfällig
  Szenario: Zahlung einer Abrechnung mit abgelaufener Zahlungsfrist zurücksetzen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Zahlungsfrist der Abrechnung 2024 von "Eva Frei" ist abgelaufen
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Zahlung zurücksetzt
    Dann hat die Abrechnung den Status "Überfällig"

  # #92: die Bestätigung nennt die Folge, bevor etwas geändert wird
  Szenario: Vor dem Zurücksetzen der Zahlung die Folge bestätigen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Zahlung zurücksetzen will
    Dann sagt die Bestätigung, dass die Abrechnung wieder als nicht bezahlt gilt und das Zahlungsdatum gelöscht wird
    Und hat die Abrechnung den Status "Bezahlt"

  # Drei Aktionen im Seitenkopf (PDF, Mahnung, Bezahlt) brechen unter den Titel um, statt ihn zusammenzudrücken
  Szenario: Seitentitel einer versendeten Abrechnung im schmalen Fenster
    Angenommen das Browserfenster ist 1024 Pixel breit
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann ist der Seitentitel lesbar
    Und scrollt die Seite nicht seitwärts

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

  # Eine Korrespondenzadresse im Ausland: das Land steht allein auf der letzten Zeile des Adressfelds und als Ländercode
  # vor der PLZ im Zahlteil der QR-Rechnung, den die Nachzahlung braucht (ohne Akonto) (#102)
  Szenario: Abrechnung an eine Korrespondenzadresse im Ausland
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und die Korrespondenzadresse von "Eva Frei" ist "Marktstätte 3", "78462 Konstanz" in "Deutschland"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Marktstätte 3 78462 Konstanz DEUTSCHLAND"
    Und steht im PDF "DE-78462 Konstanz"
    Wenn der Liegenschaftsverwalter die Abrechnung als versendet markieren will
    Dann nennt die Bestätigung die Korrespondenzadresse "Marktstätte 3, 78462 Konstanz, Deutschland"

  # Ohne Korrespondenzadresse des Mieters hat der Zahlteil ein leeres Feld mit Eckmarken, in das der Mieter Name und
  # Adresse schreibt (SIX, Implementation Guidelines QR-Rechnung v2.4, Zahlteil und Empfangsschein) (#78)
  Szenario: Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" ist keine Korrespondenzadresse erfasst
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Zahlbar durch (Name/Adresse)"

  # Persona W3c (Anna P-1): das PDF eines Entwurfs nennt die Korrespondenzadresse, wie sie jetzt ist, auch wenn es vor
  # der neuen Adresse schon einmal erstellt wurde
  Szenario: Das PDF eines Entwurfs nennt die neue Korrespondenzadresse
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und die Korrespondenzadresse von "Eva Frei" ist "Marktstätte 3", "78462 Konstanz" in "Deutschland"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Marktstätte 3 78462 Konstanz DEUTSCHLAND"

  # Review C-16: am selben Tag versendet, trägt das versendete PDF die Korrespondenzadresse beim Versand
  Szenario: Das versendete PDF nennt die neue Korrespondenzadresse
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und die Korrespondenzadresse von "Eva Frei" ist "Marktstätte 3", "78462 Konstanz" in "Deutschland"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Marktstätte 3 78462 Konstanz DEUTSCHLAND"

  # TODO(fachlich prüfen, #294): «Abrechnungsnummer» steht im Glossar; die Hilfetexte folgen
  # Die Datei heisst wie die Abrechnungsnummer auf dem PDF, damit der Liegenschaftsverwalter die Dateien unterscheidet (#101)
  Szenario: Das PDF heisst wie die Abrechnungsnummer
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann heisst die Datei wie die Abrechnungsnummer, mit der Endung ".pdf"

  # Ein zweiter Tab mit einer Abrechnung, die inzwischen gelöscht ist: ein Satz statt technischer Daten
  Szenario: PDF einer inzwischen gelöschten Abrechnung anfordern
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und die Abrechnung 2024 von "Eva Frei" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung anfordert
    Dann liest der Liegenschaftsverwalter "Abrechnung nicht gefunden."
    Wenn der Liegenschaftsverwalter von dort zu den Nebenkostenabrechnungen zurückkehrt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  # Der Mieter prüft die Abrechnung nach: Verteilschlüssel und Anteile je Position, Heizöl nach Verbrauch
  # (Art. 5 VMWG), Recht auf Belegeinsicht und detaillierte Heizkostenabrechnung (Art. 257b OR, Art. 8 VMWG)
  # #249: das PDF sagt «Gebäude» wie die App
  Szenario: Das PDF erklärt die Verteilung und den Heizölverbrauch
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Pro Fläche (m²) 70.00 / 70.00 m²"
    Und steht im PDF "Kosten des Gebäudes"
    Und steht im PDF nicht "Liegenschaft"
    Und steht im PDF "Anfangsbestand am 31.12.2023 CHF 600.00"
    Und steht im PDF "Verbrauch CHF 1'500.00"
    Und steht im PDF "Seite 1 von"
    Und steht im PDF "können die Belege einsehen"
    Und steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"

  # Eine Abrechnungsperiode nur aus Monaten mit 0 % im Heizprofil (Sommer): die Heizkosten werden nach Mietstagen
  # verteilt; der Hinweis auf die detaillierte Heizkostenabrechnung bleibt (Art. 8 Abs. 1 VMWG)
  Szenario: Heizkosten stehen im PDF nach Mietstagen, wenn die Monate der Periode im Heizprofil 0 % haben
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-07-15" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung vom "2024-06-01" bis "2024-08-31" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "48/92 Tage"
    Und steht im PDF nicht "Heizprofil"
    Und steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"

  # Regel 5: nach dem Heizprofil nur bei Ein- oder Auszug; wer die ganze Periode mietet, trägt die Heizkosten nach
  # Mietstagen, die er im PDF nachrechnen kann (#208, D-2)
  Szenario: Heizkosten eines Mietvertrags über die ganze Periode stehen im PDF nach Mietstagen
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2023-01-01" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "366/366 Tage"
    Und steht im PDF nicht "Heizprofil"
    Und steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"

  # Eine Rechnung mit Leistungszeitraum zählt mit ihren Tagen in der Periode: Hauswart Juli bis September in der Periode
  # Juni bis August, Mietvertrag 15. Juni bis 31. Juli: 31 der 62 Tage, als Bruch nachrechenbar (#208, D-3; Thema 6)
  Szenario: Eine Rechnung mit Leistungszeitraum steht im PDF mit ihren Tagen in der Periode
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietete die Wohnung "3.02" von "2025-06-15" bis "2025-07-31" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung vom "2025-06-01" bis "2025-08-31" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "31/62 Tage"
    Und steht im PDF "Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum."

  # Ein eigenes Heizprofil lässt sich nach dem Erstellen der Abrechnung ändern; das PDF zeigt den Anteil und die Monate,
  # mit denen die Abrechnung gerechnet ist: Januar bis März im «Winter» 18 + 14 + 11 = 43 % (#209)
  Szenario: PDF zeigt den Anteil nach dem Heizprofil, mit dem die Abrechnung erstellt wurde
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
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
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "43.00 % der Heizkosten"
    Und steht im PDF "Jan 18.00 %, Feb 14.00 %, Mär 11.00 %"
    Und steht im PDF "43.00 % 430.00"

  # Eine Periode kürzer als ein Jahr: der Mieter trägt seine Monate von denen der Periode, Januar bis März im «Winter»
  # 18 + 14 + 11 = 43 % von 18 + 14 + 11 + 5 + 2 + 0 = 50 %, also 86 %; das PDF nennt die Monate beider Summen und
  # die Teilung (#229, F-6; #232, F-7)
  Szenario: PDF nennt bei einer Periode unter einem Jahr die Monatsanteile und die Teilung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung vom "2024-01-01" bis "2024-06-30" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "86.00 % der Heizkosten"
    Und steht im PDF "Jan 18.00 %, Feb 14.00 %, Mär 11.00 %"
    Und steht im PDF "zusammen 43.00 %. Anteile der Monate der Abrechnungsperiode im Heizprofil: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %, Apr 5.00 %, Mai 2.00 %, Jun 0.00 %; zusammen 50.00 %. Anteil nach Heizprofil: 43.00 % / 50.00 % = 86.00 %."

  # Einzug am 5. Januar, Periode Januar bis Juni: Januar 18 % × 27/31 = 15.68 %, zusammen 47.68 % von 50.00 %; der
  # Anteil folgt aus den gedruckten Monaten, 47.68 / 50.00 = 95.36 %, also CHF 953.60 (aus den ungerundeten Monaten
  # wären es 95.35 % und CHF 953.55) (#232)
  Szenario: PDF rechnet den Anteil nach dem Heizprofil aus den gedruckten Monatsanteilen
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "1.01" seit "2024-01-05" für "900" Franken
    Und für "Lea Graf" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung vom "2024-01-01" bis "2024-06-30" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "95.36 % der Heizkosten"
    Und steht im PDF "Jan 15.68 %, Feb 14.00 %"
    Und steht im PDF "Anteil nach Heizprofil: 47.68 % / 50.00 % = 95.36 %."
    Und steht im PDF "95.36 % 953.60"

  # #71: unter den Heizkosten steht jede Rechnung mit ihrem Anteil nach Heizprofil; eine mit Leistungszeitraum mit den
  # Monaten des Heizprofils darin, den Monaten des Mieters darin und der Teilung (nachrechenbar wie #232). Marc Huber
  # (ab Mai) trägt nichts von Januar bis März und 52 % der Rechnung über das ganze Jahr; der Satz zum Heizprofil gilt
  # nur für die Rechnung ohne Leistungszeitraum (Fachreview 1, M-1)
  Szenario: PDF nennt bei Heizkosten mit Leistungszeitraum die Monate des Heizprofils jeder Rechnung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Leistungszeitraum 01.01.2024 – 31.03.2024: CHF 1'000.00, Anteile der Monate im Heizprofil: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 %. Anteile der Monate Ihres Mietverhältnisses darin: keine; zusammen 0.00 %. Anteil nach Heizprofil: 0.00 % / 43.00 % = 0.00 %"
    Und steht im PDF "Ohne Leistungszeitraum: CHF 1'000.00, Anteil nach Heizprofil: 52.00 % (siehe Heiz- und Warmwasserkosten)"
    Und steht im PDF "Heizkosten nach Heizprofil «Winter"
    Und steht im PDF "»: 52.00 % für eine Rechnung ohne Leistungszeitraum. Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition."
    Und steht im PDF "Ihr Anteil: 2'000.00 × (1'000.00 × 0.00 % + 1'000.00 × 52.00 %) / 2'000.00 = 520.00"

  # Zwei Hauswart-Rechnungen über verschiedene Leistungszeiträume, Einzug am 15. August: der Zeitanteil ist nach den
  # Beträgen gewichtet, (600 × 0/91 + 1200 × 47/92) / 1800 = 34.06 % (der Mittelwert der Brüche wäre 25.54 %); das PDF
  # nennt jede Rechnung mit ihren Tagen und die Berechnung, die zu Ihrem Anteil führt: 900.00 × (…) / 1'800.00 = 306.52
  # (#226; Beschriftung und Erläuterung #241)
  Szenario: PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2025-07-05" für die Zeit vom "2025-04-01" bis "2025-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"
    Und steht im PDF "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1'200.00, Ihre Mietstage 47 von 92 Tagen"
    Und steht im PDF "Ihr Anteil: 900.00 × (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52"
    Und steht im PDF "Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum. Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter. Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position."

  # Unter einer Position über verschiedene Tage nennt eine Zeile ihre Rechnung, wo Daten und Betrag sie keinem Beleg
  # zuordnen: eine Rechnung ohne Leistungszeitraum (ihre Daten sind die der Abrechnungsperiode) und zwei Rechnungen
  # über denselben Leistungszeitraum und Betrag; die Rechnung über April bis Juni ist eindeutig und bleibt ohne
  # (#236, V-8 von #226; Fachreview W11 V-1, V-4)
  Szenario: PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "765" Franken vom "2025-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2025-07-05" für die Zeit vom "2025-04-01" bis "2025-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-10-06" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode (Rechnung «Hauswart 2025-09-30»)"
    Und steht im PDF "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen (Rechnung «Hauswart 2025-10-05»)"
    Und steht im PDF "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen (Rechnung «Hauswart 2025-10-06»)"
    Und steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"
    Und steht im PDF nicht "Hauswart 2025-07-05"

  # Heizkosten ohne Heizprofil nach Tagen: eine Lieferung über einen Leistungszeitraum und die Veränderung des Tankbestands
  # (600 - 100 = 500); die Zeile des Tankbestands ist keine Rechnung und heisst so (#239)
  Szenario: PDF nennt die Veränderung des Tankbestands unter den Heizkosten als solche
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "900" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2025-12-31" Heizöl für "100" Franken im Tank
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, Ihre Mietstage 139 von 365 Tagen"

  Szenario: PDF in der Sprache des Mieters
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und die Korrespondenz an "Eva Frei" ist auf "Französisch"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann trägt das PDF den Titel "Décompte des charges"

  # #351: ein schon auf Deutsch erstelltes PDF eines Entwurfs bleibt nicht in der alten Sprache, auch am selben Tag
  Szenario: PDF eines Entwurfs folgt der geänderten Sprache des Mieters
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und die Korrespondenz an "Eva Frei" ist auf "Französisch"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann trägt das PDF den Titel "Décompte des charges"

  # #105: vor dem Erstellen sagt die Abrechnung, in welcher Sprache das PDF entsteht
  Szenario: Abrechnung nennt die Sprache ihres PDFs
    Angenommen die Korrespondenz an "Eva Frei" ist auf "Französisch"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Abrechnung "PDF auf Französisch"

  # A-10: wer neu abrechnet, sieht, welches Heizprofil die Abrechnung verwendet
  Szenario: Abrechnung nennt ihr Heizprofil
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Abrechnung das Heizprofil "Winter"

  # #229 (F-7): ein eigenes Heizprofil lässt sich umbenennen; die Abrechnung nennt es, wie sie es gespeichert hat
  Szenario: Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und das Heizprofil "Winter" heisst danach "Sommer"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Abrechnung das Heizprofil "Winter"

  # #247: Regel 5, wer die ganze Periode mietet, trägt die Heizkosten nach Mietstagen; die Abrechnung nennt das gewählte
  # Heizprofil mit dem Grund, warum es nicht angewendet wurde, und mit dem Namen beim Erstellen
  Szenario: Abrechnung nennt ihr Heizprofil als nicht angewendet bei einem Mietvertrag über die ganze Periode
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-01-01" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und das Heizprofil "Winter" heisst danach "Sommer"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Dann nennt die Abrechnung das Heizprofil "Winter" als nicht angewendet: "Mietvertrag über die ganze Periode"

  # #247: eine Periode nur aus Monaten mit 0 % im Heizprofil (Sommer) teilt die Heizkosten nach Mietstagen
  Szenario: Abrechnung nennt ihr Heizprofil als nicht angewendet, wenn die Monate der Periode 0 % haben
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-07-15" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung vom "2024-06-01" bis "2024-08-31" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Dann nennt die Abrechnung das Heizprofil "Winter" als nicht angewendet: "die Monate der Abrechnungsperiode haben im Heizprofil zusammen 0 %"

  # #229 (Rundung): Einzug am 22. Februar, Februar 13.9 × 7/28 = 3.475 % genau zwischen zwei Hundertsteln, gerundet
  # 3.48 % (#232); Erläuterung und Position im PDF nennen denselben Wert
  Szenario: PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Heizprofil "Halbwert" verteilt die Heizkosten so:
      | Monat     | Anteil |
      | Januar    | 18.6   |
      | Februar   | 13.9   |
      | März      | 11.2   |
      | April     | 6.1    |
      | Mai       | 2.3    |
      | Juni      | 0      |
      | Juli      | 0      |
      | August    | 0.08   |
      | September | 1.8    |
      | Oktober   | 7.7    |
      | November  | 13.4   |
      | Dezember  | 24.92  |
    Und im Gebäude "Lindenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2025
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-02-22" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Halbwert"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "70.98 % der Heizkosten"
    Und steht im PDF "500.00 70.98 %"

  # #104: die Detailseite zeigt dieselben Angaben wie das PDF: die Mietstage der Abrechnung als Daten
  Szenario: Abrechnung nennt das Mietverhältnis in der Periode
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Abrechnung das Mietverhältnis "Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.03.2024"

  # #104: eine einzige Wohnung trägt die ganzen Kosten (Wohnungsanteil 732.00); Eva Frei mietete 91 der 366 Tage,
  # 732.00 × 91/366 = 182.00; die Summe heisst wie im PDF
  Szenario: Kostenposition nennt Wohnungsanteil und Zeitanteil wie das PDF
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Position "Hauswart" den Wohnungsanteil "CHF 732.00", den Zeitanteil "91/366 Tage" und den Betrag "CHF 182.00"
    Und heisst die Summe der Kosten der Abrechnung "Ihre Nebenkosten"

  # Persona Marco P-1: der Zeitanteil der Heizkosten ist der Anteil nach dem Heizprofil (Januar bis März: 18 + 14 + 11 = 43 %)
  Szenario: Kostenposition nennt den Zeitanteil der Heizkosten nach dem Heizprofil
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Position "Heizung" den Wohnungsanteil "CHF 1’000.00", den Zeitanteil "43.00 % nach Heizprofil" und den Betrag "CHF 430.00"

  # #104: wer die ganze Periode mietet, trägt jeden Tag, auch bei Rechnungen über verschiedene Leistungszeiträume: wie im PDF
  # «366/366 Tage» (zwei gleich grosse Wohnungen: Wohnungsanteil 900.00 von 1’800.00)
  Szenario: Kostenposition nennt bei einem Mietvertrag über die ganze Periode den Zeitanteil in Tagen
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2023-01-01" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2024-07-05" für die Zeit vom "2024-04-01" bis "2024-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2024-10-05" für die Zeit vom "2024-07-01" bis "2024-09-30"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Dann nennt die Position "Hauswart" den Wohnungsanteil "CHF 900.00", den Zeitanteil "366/366 Tage" und den Betrag "CHF 900.00"

  # #104 und #240: unter einer Position mit Rechnungen über verschiedene Tage steht jede Rechnung mit ihren Tagen und die
  # Berechnung, wie im PDF (zwei gleich grosse Wohnungen: Wohnungsanteil 900.00 von 1’800.00)
  Szenario: Kostenposition nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2025-07-05" für die Zeit vom "2025-04-01" bis "2025-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Dann nennt die Position "Hauswart" die Rechnung "Hauswart 2025-07-05" mit "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"
    Und nennt die Position "Hauswart" die Rechnung "Hauswart 2025-10-05" mit "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1’200.00, Ihre Mietstage 47 von 92 Tagen"
    Und nennt die Position "Hauswart" "Ihr Anteil: 900.00 × (600.00 × 0/91 + 1’200.00 × 47/92) / 1’800.00 = 306.52"

  # #104: jede Kostenposition führt zu den Rechnungen, die sie abrechnet
  Szenario: Rechnung einer Kostenposition öffnen
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Rechnung "Hauswart 2024-12-31" der Position "Hauswart" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung "Hauswart 2024-12-31"

  # #96: die Abrechnung kennt die Rechnungen, die sie abrechnet; eine Rechnung der Periode, die danach erfasst wurde,
  # fehlt darin
  Szenario: Abrechnung weist auf eine danach erfasste Rechnung hin
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht."

  # #338: ein Entwurf wird mit den Rechnungen von jetzt neu berechnet und behält seine Nummer
  Szenario: Entwurf neu berechnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter den Entwurf neu berechnet
    Dann bestätigt Dwello "Der Entwurf ist neu berechnet. Er rechnet die Rechnungen ab, wie sie jetzt sind."
    Und nennt die Position "Hauswart" "Hauswart 2024-12-31"
    Und weist die Abrechnung auf keine geänderten Rechnungen hin

  # #96: eine danach geänderte Rechnung zählt wie eine neue
  Szenario: Abrechnung weist auf eine danach geänderte Rechnung hin
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Rechnung "Hauswart 2024-12-31" kostet danach "800" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht."

  Szenario: Kein Hinweis, solange die Rechnungen der Periode unverändert sind
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann hat die Abrechnung den Status "Entwurf"
    Und weist die Abrechnung auf keine geänderten Rechnungen hin

  # #120, #358 (A-11): eine versendete Abrechnung wird ersetzt und bleibt unverändert; die berichtigte Abrechnung
  # bekommt eine neue Nummer und nennt die ersetzte
  Szenario: Versendete Abrechnung berichtigen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigt
    Dann bestätigt Dwello "Die Abrechnung ist ersetzt."
    Und hat die Abrechnung den Status "Ersetzt"
    Wenn der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann hat die Abrechnung den Status "Entwurf"
    Und nennt die Abrechnung, dass sie die Abrechnung 2024 von "Eva Frei" ersetzt

  # #120: die Bestätigung nennt die Folge und die Verjährung, bevor etwas geändert wird
  Szenario: Vor dem Berichtigen die Folge bestätigen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigen will
    Dann sagt die Bestätigung, dass die Abrechnung ersetzt wird und unverändert bleibt
    Und nennt die Bestätigung die Verjährung nach fünf Jahren
    Und hat die Abrechnung den Status "Versendet"

  # #120: eine später erfasste Rechnung wird mit der berichtigten Abrechnung nachverlangt; bezahlt sind 430.00 + 3 %
  # Verwaltungspauschale = 442.90. Neu: 430.00 + 182.00 (Hauswart 732.00 × 91/366) + 3 % = 630.36, abzüglich 442.90
  # = 187.46, auf 5 Rappen zugunsten des Mieters 187.45
  Szenario: Berichtigte Abrechnung rechnet die Zahlung an
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigt
    Und der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann rechnet die Abrechnung "CHF 442.90" als bereits bezahlt an
    Und beträgt der Saldo der Abrechnung "CHF 187.45"

  # #403 (5): der Mieter hat auf die versendete Abrechnung 200.00 überwiesen, ein Teilbetrag. Neu: 630.36 (wie oben),
  # abzüglich 200.00 = 430.36, auf 5 Rappen zugunsten des Mieters 430.35
  @wip
  Szenario: Berichtigte Abrechnung rechnet eine Teilzahlung an
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigt, auf die schon "200.00" Franken bezahlt sind
    Und der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann rechnet die Abrechnung "CHF 200.00" als bereits bezahlt an
    Und beträgt der Saldo der Abrechnung "CHF 430.35"

  # #403 (5): ohne Eingabe gilt 0.00; eine bezahlte Abrechnung nennt ihren Betrag schon selbst
  @wip
  Szenario: Vor dem Berichtigen nach dem bereits Bezahlten fragen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigen will
    Dann steht in der Bestätigung bei «Bereits bezahlt» "0.00"
    Und erklärt die Bestätigung «Bereits bezahlt» mit "Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag."

  @wip
  Szenario: Eine bezahlte Abrechnung berichtigen, ohne nach dem bereits Bezahlten zu fragen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigen will
    Dann nennt die Bestätigung die Verjährung nach fünf Jahren
    Und fragt die Bestätigung nicht nach dem bereits Bezahlten

  # #120: die ersetzte Abrechnung wird nicht mehr gemahnt (auch nach Ablauf der Zahlungsfrist), nicht bezahlt, nicht
  # bearbeitet und nicht noch einmal ersetzt
  Szenario: Ersetzte Abrechnung bleibt unverändert
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Zahlungsfrist der Abrechnung 2024 von "Eva Frei" ist abgelaufen
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann hat die Abrechnung den Status "Ersetzt"
    Und bietet die Detailseite weder Zahlung noch Mahnung noch Bearbeitung noch Berichtigung der Abrechnung an
    Und sagt die Abrechnung "Diese Abrechnung ist ersetzt und gilt nicht mehr."
    Und nennt die Abrechnung keine Zahlungsfrist
    Und weist die Abrechnung auf keine geänderten Rechnungen hin

  Szenario: Von der ersetzten Abrechnung zum Mietvertrag wechseln
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist ersetzt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter den Mietvertrag der ersetzten Abrechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Eva Frei"

  # Persona Anna I4: der Mieter zog erst 2025 ein; die versendete Abrechnung 2024 ist ersetzt, eine berichtigte gibt es
  # nicht (Fachreview W2e V-5)
  Szenario: Keine berichtigte Abrechnung ohne Mietstage in der Periode
    Angenommen für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist ersetzt
    Und der Mietvertrag von "Marc Huber" beginnt danach am "2025-05-01"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Teilen Sie dem Mieter mit, dass die Abrechnung"
    Und hat die Abrechnung den Status "Ersetzt"

  Szenario: Von der ersetzten Abrechnung zur berichtigten wechseln
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die berichtigte Abrechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der berichtigten Abrechnung 2024 von "Eva Frei"

  Szenario: Von der berichtigten Abrechnung zur ersetzten wechseln
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Und der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die ersetzte Abrechnung öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Eva Frei"

  # #120, Fachreview W2e V-2: der Mieter hat die ersetzte Abrechnung mit ihrem Zahlteil noch; das PDF sagt, dass sie
  # nicht mehr gilt, und rechnet die 442.90 an, die darauf bezahlt sind
  Szenario: PDF der berichtigten Abrechnung nennt die ersetzte und das schon Bezahlte
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Und der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "gilt nicht mehr. Bezahlen Sie nur noch den Saldo dieser Abrechnung."
    Und steht im PDF "bereits bezahlt CHF 442.90"
    Und steht im PDF "Nachzahlung 187.45"

  # #403 (5): die Teilzahlung auf die ersetzte Abrechnung steht im PDF der berichtigten als «Bereits bezahlt auf NK-…»
  @wip
  Szenario: PDF der berichtigten Abrechnung nennt die Teilzahlung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt, auf sie sind "200.00" Franken bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF, dass auf die Abrechnung 2024 von "Eva Frei" bereits "200.00" bezahlt sind

  # #403 (6): eine geänderte Bemerkung verwirft das gespeicherte PDF; das neue PDF druckt sie
  @wip
  Szenario: Eine geänderte Bemerkung steht im PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Ratenzahlung bis Ende März vereinbart"

  # #403 (6): der Mieter erfährt den Grund der Berichtigung aus der Bemerkung; ein eigenes Feld gibt es nicht
  @wip
  Szenario: Bei einer berichtigten Abrechnung rät die Bemerkung, den Grund der Berichtigung zu nennen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Dann erklärt die Bearbeitungsseite die Bemerkung mit "Schreiben Sie hier, warum Sie die Abrechnung berichtigen. Die Bemerkung steht im PDF."
