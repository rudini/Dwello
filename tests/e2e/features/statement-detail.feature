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
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
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
    Und sagt die Bestätigung vor dem Versand "Markieren Sie die Abrechnung am Tag, an dem Sie sie zustellen, als versendet. Dwello legt sie dann unter «Dokumente» ab. Drucken Sie sie dort aus."
    Und bietet die Bestätigung das PDF der Abrechnung zum Ansehen an

  Szenario: Zahlungseingang festhalten
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"

  # #959 (A): ein kleinerer bezahlter Betrag lässt die Abrechnung offen, mit dem Rest fällig (Art. 69, 85 OR)
  Szenario: Eine Teilzahlung lässt die Abrechnung mit dem Rest offen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter eine Zahlung von "10.00" Franken festhält
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt das Panel Zahlung "Bezahlt: CHF 10.00, offen: CHF 432.90"

  # #959: eine Teilzahlung wird als solche bestätigt, die Mahnung verlangt den Rest (Personas Helga, Dr. Weber 959 P-1, P-2)
  Szenario: Nach einer Teilzahlung mahnt der Liegenschaftsverwalter den Rest
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Zahlungsfrist der Abrechnung 2024 von "Eva Frei" ist abgelaufen
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter eine Zahlung von "10.00" Franken festhält
    Dann bestätigt Dwello die Zahlung mit "Teilzahlung für Abrechnung"
    Wenn der Liegenschaftsverwalter eine Mahnung senden will
    Dann nennt die Mahnung vor dem Senden als geschuldet "CHF 432.90"

  # #523, #959 (A): der Betrag am Feld ist, was für diese Abrechnung eingegangen ist; ein Teil lässt sie offen (Art. 69, 86 OR); Rückerstattung im DOM-Test
  Szenario: Der Zahlungseingang sagt, was bei einer Teilzahlung gilt
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als bezahlt markieren will
    Dann sagt die Frage «Als bezahlt markieren» "Was an diesem Tag für diese Abrechnung eingegangen ist. Hat der Mieter erst einen Teil überwiesen, geben Sie diesen Betrag ein. Die Abrechnung bleibt dann mit dem Rest offen."

  # Festgehalten wird der eingegebene Tag, frühestens das Abrechnungsdatum (beim Versenden der Tag des Versands, #138)
  Szenario: Zahlungseingang mit Datum festhalten
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am Tag des Versands bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"
    Und nennt der Verlauf "Bezahlt" am Tag des Versands

  # #403 (4): ein Mieter darf früher zahlen; ein Datum vor dem Abrechnungsdatum gilt erst nach der Bestätigung
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

  # Leere Bereiche für spätere Meldungen lassen keine Lücke über der Kostenaufstellung
  Szenario: Die Kostenaufstellung folgt im üblichen Abstand auf den Status
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann folgt die Kostenaufstellung im üblichen Abstand auf den Status

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

  # #509 (Persona Dr. Weber P-8): hat jede Heizkostenrechnung ihren Leistungszeitraum, nennt das PDF keinen Anteil für
  # eine Rechnung ohne Leistungszeitraum; die Rechnung von 2024 aus der Grundlage zählt 2025 nicht, Lea Graf
  # mietet ab Februar (nicht die ganze Periode: sonst nach Tagen)
  Szenario: Das PDF nennt keinen Heizkostenanteil für eine fehlende Rechnung ohne Leistungszeitraum
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-02-01" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2025-04-10" für die Zeit vom "2025-01-01" bis "2025-03-31"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition."
    Und steht im PDF nicht "ohne Leistungszeitraum"
    Und steht im PDF nicht "Anteile der Monate Ihres Mietverhältnisses:"

  # #453 (#325): mit «Abgerechnet bis» in der Periode sagt das PDF, was schon abgerechnet ist und ab wann das Akonto
  # zählt; 01.03. bis 31.03.2024 = 31 Mietstage von 366 Tagen
  Szenario: Das PDF nennt, was vor «Abgerechnet bis» schon abgerechnet ist
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und der Mietvertrag von "Eva Frei" hat "120" Franken Akonto
    Und der Mietvertrag von "Eva Frei" ist bis "2024-02-29" ausserhalb von Dwello abgerechnet
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.03.2024. Ihre Nebenkosten und Akontobeiträge bis 29.02.2024 sind mit einer früheren Abrechnung abgerechnet. Diese Abrechnung umfasst 01.03.2024 – 31.03.2024 (31 Mietstage von 366 Tagen)."
    Und steht im PDF "Akontobeiträge ab 01.03.2024"

  # #511 (Persona Dr. Weber 461, P-2): neben den vereinbarten Nebenkosten nennt das PDF auch die Verwaltungspauschale
  # als vereinbart, sonst liest der Mieter sie als nicht geschuldet; ohne Pauschale kein solcher Satz
  Szenario: Das PDF nennt die Verwaltungspauschale als vereinbart
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Die Verwaltungspauschale ist im Mietvertrag vereinbart"

  Szenario: Ohne vereinbarte Verwaltungspauschale nennt das PDF keine
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Mietvertrag von "Eva Frei" ist keine Verwaltungspauschale vereinbart
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten"
    Und steht im PDF nicht "Verwaltungspauschale ist im Mietvertrag vereinbart"

  # #465 (#103, DIV-14): das PDF ist ein Brief an den Mieter: Ort und Datum, Anrede wie die Mahnung (#88, #449) und Gruss
  Szenario: Das PDF der Abrechnung ist ein Brief an den Mieter
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Guten Tag Eva Frei"
    Und steht im PDF "Freundliche Grüsse"

  # #465 (#103, DMR-10): eine Position nach Heizprofil nennt die Quelle seiner Monatsanteile; ein eigenes Profil ohne
  # Beschreibung sagt, dass es das eigene des Vermieters ist
  Szenario: Das PDF nennt die Quelle der Monatsanteile eines eigenen Heizprofils
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Quelle der Monatsanteile: Eigenes Profil des Vermieters"

  # #465 (#103, CD-8): jedes Zeichen steht im PDF so, wie es erfasst ist
  Szenario: Das PDF druckt einen Namen mit Sonderzeichen unverändert
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und der Mieter "Łukasz Dragoș" existiert
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und "Łukasz Dragoș" mietet die Wohnung "3.02" seit "2024-01-01" für "900" Franken
    Und für "Łukasz Dragoș" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Łukasz Dragoș"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Guten Tag Łukasz Dragoș"

  # #465 (#103, DMR-09): Telefon und E-Mail der Verwaltung stehen im Kopf des PDF. Eine globale Einstellung: jedes
  # Szenario hinterlegt dieselben Angaben, wie bei der IBAN (O-34)
  Szenario: Das PDF nennt Telefon und E-Mail der Verwaltung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und die Verwaltung hat das Telefon "044 123 45 67" und die E-Mail "info@muster-immobilien.ch" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Telefon 044 123 45 67"
    Und steht im PDF "info@muster-immobilien.ch"

  # #597 (Fachreview 500-1 V-5): das erste Untergeschoss heisst im PDF «UG» ohne Zahl; heisst die Wohnung so, steht es
  # einmal
  Szenario: Das PDF nennt eine Wohnung im Untergeschoss beim Namen des Stockwerks
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "UG" im Stockwerk -1
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "UG" seit "2024-01-01" für "900" Franken
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Wohnung UG, 70.00 m²"
    Und steht im PDF nicht "1. UG"

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
  # wären es 95.35 % und CHF 953.55) (#232); der angebrochene Januar steht mit seinem Bruch, und die Erläuterung sagt,
  # dass der Prozentwert gerundet ist (#451, Punkt 3)
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
    Und steht im PDF "Jan 15.68 % (18.00 % × 27/31 Tage), Feb 14.00 %"
    Und steht im PDF "Anteil nach Heizprofil: 47.68 % / 50.00 % = 95.36 %."
    Und steht im PDF "95.36 % 953.60"
    Und steht im PDF "Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Der Prozentwert ist gerundet. Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil."

  # #71: unter den Heizkosten steht jede Rechnung mit ihrem Anteil nach Heizprofil; eine mit Leistungszeitraum mit den
  # Monaten des Heizprofils darin, den Monaten des Mieters darin und der Teilung (nachrechenbar wie #232). Marc Huber
  # (ab Mai) trägt nichts von Januar bis März und 52 % der Rechnung über das ganze Jahr; der Satz zum Heizprofil gilt
  # nur für die Rechnung ohne Leistungszeitraum (Fachreview 1, M-1); die Berechnung nennt den Zeitanteil, die Rechnung
  # ohne Leistungszeitraum sagt, dass sie für die ganze Periode gilt, und heisst nach ihrem Rechnungsdatum (#451, Punkt 3)
  Szenario: PDF nennt bei Heizkosten mit Leistungszeitraum die Monate des Heizprofils jeder Rechnung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Leistungszeitraum 01.01.2024 – 31.03.2024: CHF 1'000.00, Anteile der Monate im Heizprofil: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 %. Anteile der Monate Ihres Mietverhältnisses darin: keine; zusammen 0.00 %. Anteil nach Heizprofil: 0.00 % / 43.00 % = 0.00 %"
    Und steht im PDF "Rechnung vom 30.06.2024 ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode: CHF 1'000.00, Anteil nach Heizprofil: 52.00 % (siehe Heiz- und Warmwasserkosten)"
    Und steht im PDF "Heizkosten nach Heizprofil «Winter"
    Und steht im PDF "»: 52.00 % für eine Rechnung ohne Leistungszeitraum. Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition."
    Und steht im PDF "Ihr Anteil: 2'000.00 × Zeitanteil (1'000.00 × 0.00 % + 1'000.00 × 52.00 %) / 2'000.00 = 520.00"

  # Zwei Hauswart-Rechnungen über verschiedene Leistungszeiträume, Einzug am 15. August: der Zeitanteil ist nach den
  # Beträgen gewichtet, (600 × 0/91 + 1200 × 47/92) / 1800 = 34.06 % (der Mittelwert der Brüche wäre 25.54 %); das PDF
  # nennt jede Rechnung mit ihren Tagen und die Berechnung, die zu Ihrem Anteil führt: 900.00 × (…) / 1'800.00 = 306.52
  # (#226; Beschriftung und Erläuterung #241; «Zeitanteil» in der Berechnung #451, Punkt 3)
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
    Und steht im PDF "Ihr Anteil: 900.00 × Zeitanteil (600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 306.52"
    Und steht im PDF "Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum. Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter. Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position."

  # Unter einer Position über verschiedene Tage nennt eine Zeile ihre Rechnung, wo Daten und Betrag sie keinem Beleg
  # zuordnen: eine Rechnung ohne Leistungszeitraum (sie gilt für die ganze Abrechnungsperiode) und zwei Rechnungen über
  # denselben Leistungszeitraum und Betrag; die Rechnung über April bis Juni ist eindeutig und bleibt ohne (#236). Die
  # Zeile beginnt mit Rechnungsdatum und Rechnungsnummer wie auf dem Beleg, nicht mit der Beschreibung (#451, Punkt 3, V-8)
  Szenario: PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "765" Franken vom "2025-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2025-07-05" für die Zeit vom "2025-04-01" bis "2025-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-10-05" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2025-10-06" für die Zeit vom "2025-07-01" bis "2025-09-30"
    Und die Rechnung "Hauswart 2025-10-05" hat die Rechnungsnummer "4711"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Rechnung vom 30.09.2025 ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode: CHF 765.00, Ihre Mietstage 139 von 365 Tagen"
    Und steht im PDF "Rechnung vom 05.10.2025 (Nr. 4711), Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen"
    Und steht im PDF "Rechnung vom 06.10.2025, Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen"
    Und steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"
    Und steht im PDF nicht "Hauswart 2025"
    Und steht im PDF nicht "vom 05.07.2025"

  # Ein Leistungszeitraum über das Ende der Periode hinaus: die Rechnung nennt ihre Tage und die Tage in der Periode,
  # 765.00 × 92/123 = 572.20; davon trägt Lea Graf (ab 15. August) alle 92 Tage (#451, Punkt 3)
  Szenario: PDF nennt bei einem Leistungszeitraum über die Periode hinaus die Tage der Rechnung und die Tage in der Periode
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2025-08-15" für "900" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "600" Franken vom "2025-07-05" für die Zeit vom "2025-04-01" bis "2025-06-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "765" Franken vom "2025-10-01" für die Zeit vom "2025-10-01" bis "2026-01-31"
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2025 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Lea Graf"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Leistungszeitraum 01.10.2025 – 31.01.2026 (Rechnung CHF 765.00 für 123 Tage), davon 01.10.2025 – 31.12.2025 (92 Tage): CHF 572.20, Ihre Mietstage 92 von 92 Tagen"

  # Heizkosten ohne Heizprofil nach Tagen, mit Tank: abgerechnet wird der Verbrauch der ganzen Periode, 600 + 900 - 100
  # = 1'400; auch die Lieferung mit Leistungszeitraum Juli bis September zählt nach den Mietstagen der Periode, 139 von
  # 365 Tagen (#451, Punkt 2; #257)
  Szenario: Heizöl aus dem Tank steht im PDF nach den Mietstagen der Periode, auch mit Leistungszeitraum der Lieferung
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
    Dann steht im PDF "Verbrauch CHF 1'400.00"
    Und steht im PDF "1'400.00 700.00 139/365 Tage 266.58"
    Und steht im PDF nicht "Leistungszeitraum 01.07.2025"

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

  # #280: eine Abrechnung ohne Heizkosten wendet kein Heizprofil an und nennt keines, auch im PDF (#451, Punkt 8)
  Szenario: Abrechnung ohne Heizkosten nennt kein Heizprofil
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "1.01" seit "2024-05-01" für "900" Franken
    Und für "Lea Graf" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Lea Graf"
    Dann nennt die Abrechnung das Mietverhältnis "Ihr Mietverhältnis in dieser Periode: 01.05.2024 – 31.12.2024"
    Und nennt die Abrechnung kein Heizprofil
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Hauswart"
    Und steht im PDF nicht "Heizprofil"

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
  # Berechnung wie im PDF; die Zeile heisst nach der Beschreibung der Rechnung (#451, V-12; zwei gleich grosse
  # Wohnungen: Wohnungsanteil 900.00 von 1’800.00)
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

  # #451, Persona Dr. Weber P-1 (bestand seit #71): die Berechnung unter den Heizkosten nach Heizprofil rechnet mit dem
  # Anteil nach Heizprofil jeder Rechnung, wie das PDF: Marc Huber (ab Mai) trägt nichts von Januar bis März und 52 % der
  # Rechnung über das ganze Jahr
  Szenario: Kostenposition rechnet Heizkosten nach Heizprofil mit dem Anteil nach Heizprofil wie das PDF
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Dann nennt die Position "Heizung" "Ihr Anteil: 2’000.00 × (1’000.00 × 0.00 % + 1’000.00 × 52.00 %) / 2’000.00 = 520.00"

  # #507 (Persona Dr. Weber P-7 von #451): jede Rechnung unter den Heizkosten nach Heizprofil nennt ihren Anteil nach
  # Heizprofil wie das PDF, nicht die Mietstage: Marc Huber (ab Mai) trägt nichts von Januar bis März und 52 % der
  # Rechnung ohne Leistungszeitraum
  Szenario: Kostenposition nennt bei Heizkosten nach Heizprofil den Anteil jeder Rechnung wie das PDF
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "1000" Franken vom "2024-04-10" für die Zeit vom "2024-01-01" bis "2024-03-31"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Dann nennt die Position "Heizung" die Rechnung "Heizung 2024-04-10" mit "Leistungszeitraum 01.01.2024 – 31.03.2024: CHF 1’000.00, Anteil nach Heizprofil: 0.00 %"
    Und nennt die Position "Heizung" die Rechnung "Heizöl 2024" mit "Ohne Leistungszeitraum: CHF 1’000.00, Anteil nach Heizprofil: 52.00 %"
    Und nennt die Position "Heizung" nicht "Mietstage"

  # #104: jede Kostenposition führt zu den Rechnungen, die sie abrechnet
  Szenario: Rechnung einer Kostenposition öffnen
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Rechnung "Hauswart 2024-12-31" der Position "Hauswart" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung "Hauswart 2024-12-31"

  # #528 (Persona Dr. Weber, 452 P-1): eine Kategorie mit zwei Verteilschlüsseln steht in zwei Positionen; der Entwurf
  # sagt es und nennt die Rechnung, deren Verteilschlüssel von dem der grösseren Position abweicht (Entscheid des Product
  # Owners: nur ein Hinweis, keine Bestätigung)
  Szenario: Der Entwurf nennt die Rechnung mit einem anderen Verteilschlüssel derselben Kategorie
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann sagt der Entwurf, dass "Hauswart" mit verschiedenen Verteilschlüsseln abgerechnet wird
    Und nennt der Hinweis auf verschiedene Verteilschlüssel die Rechnung "Hauswart 2024-12-31" mit "Pro Einheit"
    Und nennt der Hinweis auf verschiedene Verteilschlüssel die Rechnung "Hauswart 2024-09-30" nicht

  Szenario: Rechnung mit einem anderen Verteilschlüssel öffnen
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter im Hinweis auf verschiedene Verteilschlüssel die Rechnung "Hauswart 2024-12-31" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung "Hauswart 2024-12-31"

  Szenario: Die Frage vor dem Neuberechnen nennt die Rechnung mit einem anderen Verteilschlüssel
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter «Neu berechnen» wählt
    Dann nennt die Frage vor dem Neuberechnen die Rechnung "Hauswart 2024-12-31" mit "Pro Einheit"

  # #528 (Fachreview 528-1 V-1): die Frage nennt nur Rechnungen, deren Verteilschlüssel jetzt noch abweicht
  Szenario: Die Frage vor dem Neuberechnen nennt eine Rechnung nicht mehr, deren Verteilschlüssel geändert ist
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Rechnung von "Hauswart 2024-12-31" wird nach dem Verteilschlüssel "Pro Fläche (m²)" verteilt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter «Neu berechnen» wählt
    Dann nennt die Frage vor dem Neuberechnen keine Rechnung mit einem anderen Verteilschlüssel

  # #528 (Persona Dr. Weber 528 P-1, Code-Review 528-2 C-11): der Entwurf folgt seinen Positionen, wie seine Kostenaufstellung;
  # erst die Frage vor dem Neuberechnen nennt eine Rechnung, deren Verteilschlüssel seit dem Erstellen abweicht
  Szenario: Der Entwurf nennt eine danach geänderte Rechnung erst in der Frage vor dem Neuberechnen
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Rechnung von "Hauswart 2024-12-31" wird nach dem Verteilschlüssel "Pro Einheit" verteilt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann sagt der Entwurf nicht, dass eine Kategorie mit verschiedenen Verteilschlüsseln abgerechnet wird
    Wenn der Liegenschaftsverwalter «Neu berechnen» wählt
    Dann nennt die Frage vor dem Neuberechnen die Rechnung "Hauswart 2024-12-31" mit "Pro Einheit"

  # #528: im PDF trägt die Position mit dem abweichenden Verteilschlüssel den Namen ihrer Rechnung, damit der Mieter die
  # beiden Positionen der Kategorie auseinanderhält
  Szenario: Das PDF nennt die Rechnung der Position mit einem anderen Verteilschlüssel
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "900" Franken vom "2024-09-30"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-12-31" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Hauswart (Hauswart 2024-12-31) Pro Einheit"
    Und steht im PDF nicht "Hauswart (Hauswart 2024-09-30)"

  # #96: die Abrechnung kennt die Rechnungen, die sie abrechnet; eine Rechnung der Periode, die danach erfasst wurde,
  # fehlt darin
  Szenario: Abrechnung weist auf eine danach erfasste Rechnung hin
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht."

  # #547 (Personas Anna P-3, Dr. Weber P-2 von #454): der Versand eines nicht aktuellen Entwurfs sagt das zuerst und bietet
  # «Neu berechnen» an; versenden bleibt möglich
  Szenario: Der Versand eines nicht aktuellen Entwurfs rät zum Neu berechnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als versendet markieren will
    Dann sagt die Bestätigung vor dem Versand "Dieser Entwurf ist nicht aktuell"
    Und sagt die Bestätigung vor dem Versand "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Berechnen Sie ihn neu, bevor Sie ihn zustellen."
    Wenn der Liegenschaftsverwalter den Entwurf aus der Bestätigung neu berechnet
    Dann bestätigt Dwello "Der Entwurf ist neu berechnet. Er rechnet mit den Rechnungen und dem Tankbestand, wie sie jetzt sind."

  # #609 (Persona Dr. Weber P-1 von #503): das PDF eines Entwurfs entsteht bei jedem Öffnen neu; der Verlauf behauptet
  # keines, das sich vielleicht nicht mehr öffnen lässt
  Szenario: Der Verlauf eines Entwurfs nennt kein erstelltes PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt der Verlauf "Erstellt" am heutigen Tag
    Und nennt der Verlauf nicht "PDF erstellt"

  # #338: ein Entwurf wird mit den Rechnungen von jetzt neu berechnet und behält seine Nummer
  Szenario: Entwurf neu berechnen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter den Entwurf neu berechnet
    Dann bestätigt Dwello "Der Entwurf ist neu berechnet. Er rechnet mit den Rechnungen und dem Tankbestand, wie sie jetzt sind."
    Und nennt die Position "Hauswart" "Hauswart 2024-12-31"
    Und weist die Abrechnung auf keine geänderten Rechnungen hin

  # #452 Punkt 4 (#382): Dwello prüft die Vereinbarung über die Kategorie; «Neu berechnen» wartet darauf
  Szenario: Kein Neuberechnen, solange eine umlagefähige Rechnung keine Kategorie hat
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und im Gebäude "Lindenhof" gibt es eine umlagefähige Rechnung ohne Kategorie über "120" Franken vom "2024-06-30"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter den Entwurf neu berechnet
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "berechnen Sie den Entwurf dann neu"

  # #96: eine danach geänderte Rechnung zählt wie eine neue
  Szenario: Abrechnung weist auf eine danach geänderte Rechnung hin
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Rechnung "Hauswart 2024-12-31" kostet danach "800" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht."

  # #454 (#408 Punkt 8, #307): ein danach geänderter Tankbestand der Periode zählt wie eine geänderte Rechnung: der
  # Verbrauch bestimmt die Heizkosten (Art. 5 Abs. 2 lit. a VMWG)
  Szenario: Entwurf weist auf einen danach geänderten Tankbestand hin
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Tankbestand vom "2024-12-31" im Gebäude "Lindenhof" ist danach "200" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde der Tankbestand der Abrechnungsperiode geändert."
    Und nennt der Hinweis auf Änderungen seit dem Erstellen den Titel "Tankbestand seit der Abrechnung geändert"

  # PO 2026-10-20 (Fachreview 454-1 E-2): auch andere Stichtage oder Werte mit demselben Verbrauch, denn das PDF druckt
  # Anfangs- und Endbestand
  Szenario: Entwurf weist auf einen danach geänderten Tankbestand mit demselben Verbrauch hin
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Tankbestand vom "2023-12-31" im Gebäude "Lindenhof" ist danach "700" Franken
    Und der Tankbestand vom "2024-12-31" im Gebäude "Lindenhof" ist danach "200" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde der Tankbestand der Abrechnungsperiode geändert."

  # Fachreview 454-1 V-8: Rechnungen und Tankbestand in einem Satz
  Szenario: Entwurf weist auf danach geänderte Rechnungen und Tankbestand hin
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Tankbestand vom "2024-12-31" im Gebäude "Lindenhof" ist danach "200" Franken
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "300" Franken vom "2024-06-15"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert."
    Und nennt der Hinweis auf Änderungen seit dem Erstellen den Titel "Rechnungen und Tankbestand seit der Abrechnung geändert"

  Szenario: Versendete Abrechnung weist auf einen danach geänderten Tankbestand hin
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Tankbestand vom "2024-12-31" im Gebäude "Lindenhof" ist danach "200" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "Seit dem Erstellen dieser Abrechnung wurde der Tankbestand der Abrechnungsperiode geändert."

  # code review 454-2 C-8: senkt die Neuberechnung den Saldo (eine doppelt erfasste Rechnung gelöscht), sagt die
  # Abrechnung warum «Nicht berichtigen» fehlt (Fachreview 454-3 V-32) und führt aus dem Hinweis zum Berichtigen
  # (Persona Anna 454 P-1)
  Szenario: Versendete Abrechnung mit danach gelöschter Rechnung berichtigen
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Rechnung "Hauswart 2024-12-31" ist danach gelöscht
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann weist die Abrechnung darauf hin: "eine tiefere Nachzahlung oder eine höhere Rückerstattung. Berichtigen Sie die Abrechnung, sonst verlangen Sie mehr als die tatsächlichen Kosten."
    Und bietet die Abrechnung «Nicht berichtigen» nicht mehr an
    Wenn der Liegenschaftsverwalter die Abrechnung aus dem Hinweis berichtigen will
    Dann sagt die Bestätigung, dass die Abrechnung ersetzt wird und unverändert bleibt

  # ein Tankbestand, der seit dem Erstellen gleich blieb, gibt keinen Hinweis (Fachreview 454-1 V-5, V-15)
  Szenario: Kein Hinweis, wenn der Tankbestand der Periode unverändert ist
    Angenommen im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann hat die Abrechnung den Status "Entwurf"
    Und weist die Abrechnung auf keine Änderung seit dem Erstellen hin

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

  # #447, Fachreview V-1: in einer Kette rechnet die berichtigte Abrechnung alles an, was auf die ersetzten Abrechnungen
  # geflossen ist. Lea Graf erhielt mit 200 Franken Akonto im Monat eine Rückerstattung, die Nachzahlung der
  # berichtigten Abrechnung (Hauswart) ist kleiner: netto hat der Vermieter zurückerstattet
  Szenario: Vor dem Berichtigen einer Kette nennt die Bestätigung, was insgesamt zurückerstattet ist
    Angenommen im Gebäude "Lindenhof" gibt es die leere Wohnung "3.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "3.02" seit "2024-01-01" für "1200" Franken mit "200" Franken Akonto
    Und für "Lea Graf" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Lea Graf" ist versendet
    Und die Abrechnung 2024 von "Lea Graf" ist bezahlt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und die Abrechnung 2024 von "Lea Graf" ist berichtigt
    Und die berichtigte Abrechnung 2024 von "Lea Graf" ist versendet und bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung 2024 von "Lea Graf"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigen will
    Dann sagt die Bestätigung, dass die berichtigte Abrechnung anrechnet, was der Liegenschaftsverwalter auf diese und die ersetzten Abrechnungen insgesamt zurückerstattet hat

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
  Szenario: Vor dem Berichtigen nach dem bereits Bezahlten fragen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigen will
    Dann steht in der Bestätigung bei «Bereits bezahlt» "0.00"
    Und erklärt die Bestätigung «Bereits bezahlt» mit "Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag."
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

  # #452 Punkt 7 (#379): eine alte Rechnung ohne Verteilschlüssel verteilt Dwello gleichmässig pro Wohnung, wie «Pro Einheit»
  Szenario: Das PDF nennt bei einer Rechnung ohne Verteilschlüssel «Pro Einheit»
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "400" Franken vom "2024-06-30"
    Und die Rechnung der Kategorie "Hauswart" vom "2024-06-30" hat keinen Verteilschlüssel
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Pro Einheit 1 / 1 Wohnungen 400.00 400.00"

  # #770: zwei Lieferungen für den Tank vom selben Tag mit verschiedenen Verteilschlüsseln; die Veränderung Tankbestand
  # (500 Franken: Anfangsbestand − Endbestand) wird nach dem Schlüssel der zuletzt erfassten verteilt (#890); die
  # Position mit dem anderen Verteilschlüssel als die grössere nennt ihre Rechnung (#528)
  Szenario: Das PDF nennt für die Veränderung Tankbestand den Verteilschlüssel der zuletzt erfassten Rechnung vom selben Tag
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Heizung" über "500" Franken vom "2024-10-15"
    Und im Gebäude "Lindenhof" gibt es danach eine Rechnung der Kategorie "Heizung" über "500" Franken vom "2024-10-15" nach dem Verteilschlüssel "Pro Einheit"
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Heizung (Heizung 2024-10-15) Pro Einheit 1 / 1 Wohnungen 1'000.00"

  # #403 (5): die Teilzahlung auf die ersetzte Abrechnung steht im PDF der berichtigten als «Bereits bezahlt auf NK-…»
  Szenario: PDF der berichtigten Abrechnung nennt die Teilzahlung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt, auf sie sind "200.00" Franken bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF, dass auf die Abrechnung 2024 von "Eva Frei" bereits "200.00" bezahlt sind

  # #403 (6): eine geänderte Bemerkung verwirft das gespeicherte PDF; das neu erstellte druckt sie
  Szenario: Eine geänderte Bemerkung steht im PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Und der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Ratenzahlung bis Ende März vereinbart"

  # #524 (A, B; Fachreview 524-1): das versendete PDF bleibt unter «Dokumente», der Verlauf nennt es und ein neues PDF;
  # nach dem Speichern sagt Dwello, was nur im neuen PDF steht
  Szenario: Nach einer neuen Bemerkung bleibt das versendete PDF, und Dwello rät, das neue zu senden
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Dann rät die Abrechnung "Die neue Bemerkung steht nur im neuen PDF. Soll der Mieter sie lesen, senden Sie ihm das neue PDF. Das versendete PDF finden Sie im Verlauf."
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Dann nennt der Verlauf nach dem Versand ein neues PDF
    Wenn der Liegenschaftsverwalter das versendete PDF im Verlauf herunterlädt
    Dann steht im PDF nicht "Ratenzahlung bis Ende März vereinbart"

  # #969 (A): eine vor #449 versendete Abrechnung hat kein Dokument des Versands; ihr gespeichertes PDF ist die einzige
  # Kopie und bleibt vor der Änderung als «PDF vor der Änderung» im Verlauf (Persona Dr. Weber 524 P-2)
  Szenario: Vor der Änderung einer Abrechnung ohne Dokument des Versands bleibt ihr PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Dann bietet der Verlauf das PDF vor der Änderung an
    Wenn der Liegenschaftsverwalter das PDF vor der Änderung im Verlauf herunterlädt
    Dann steht im PDF nicht "Ratenzahlung bis Ende März vereinbart"

  # #968 (Option A): das neue PDF nach einer Änderung liegt unter «Dokumente» zum Versand bereit, bis der
  # Liegenschaftsverwalter es als versendet markiert; die Abrechnung nennt es bis dann als noch zu versenden
  Szenario: Nach einer Änderung liegt das neue PDF zum Versand bereit
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Dann nennt die Abrechnung das neue PDF als noch zu versenden
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Dann ist die "Nebenkostenabrechnung, neues PDF" an "Eva Frei" zu versenden

  Szenario: Das neue PDF als versendet markieren
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Wenn der Liegenschaftsverwalter das neue PDF als versendet markiert
    Dann nennt der Verlauf "Neues PDF versendet per Brief" am heutigen Tag
    Und nennt die Abrechnung das neue PDF nicht mehr als noch zu versenden

  # #968 (Persona Dr. Weber 534-2 P-1, Code-Review 534close-1 C-2): der Verlauf wächst nur; das PDF des Versands bleibt
  # nach einer Änderung, das neue PDF kommt danach
  Szenario: Nach einer Änderung nennt der Verlauf das PDF des Versands und das neue PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Dann nennt der Verlauf zuerst das PDF des Versands, dann den Versand und dann das neue PDF

  # Fachreview 534-1 V-3 (Entscheid in #968): nach der Zahlung geht das neue PDF nicht mehr hinaus
  Szenario: Ein neues PDF einer inzwischen bezahlten Abrechnung geht nicht mehr hinaus
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter nur die Bemerkung "Ratenzahlung bis Ende März vereinbart" festhält
    Und die Abrechnung 2024 von "Eva Frei" ist bezahlt
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Dann ist die "Nebenkostenabrechnung, neues PDF" an "Eva Frei" nicht mehr zu versenden

  # #524: eine neue Zahlungsfrist kennt der Mieter erst aus dem neuen PDF
  Szenario: Nach einer neuen Zahlungsfrist rät Dwello, das neue PDF zu senden
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Und der Liegenschaftsverwalter die Abrechnung versendet
    Und hat die Abrechnung den Status "Versendet"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Zahlungsfrist auf "2026-12-31" verlängert mit der Bemerkung ""
    Dann rät die Abrechnung "Im versendeten PDF steht die bisherige Zahlungsfrist. Damit der Mieter die neue kennt, senden Sie ihm das neue PDF. Das versendete PDF finden Sie im Verlauf."

  # #524: ohne Änderung nach dem Versand gilt das versendete PDF; der Verlauf bietet es an
  Szenario: Ohne Änderung nach dem Versand rät Dwello kein neues PDF
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann rät die Abrechnung kein neues PDF
    Und bietet der Verlauf das versendete PDF an

  # #403 (6): der Mieter erfährt den Grund der Berichtigung aus der Bemerkung; ein eigenes Feld gibt es nicht
  Szenario: Bei einer berichtigten Abrechnung rät die Bemerkung, den Grund der Berichtigung zu nennen
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und die Abrechnung 2024 von "Eva Frei" ist berichtigt
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der berichtigten Abrechnung 2024 von "Eva Frei"
    Dann erklärt die Bearbeitungsseite die Bemerkung mit "Schreiben Sie hier, warum Sie die Abrechnung berichtigen. Die Bemerkung steht im PDF, das der Mieter erhält."

  # #464: die berichtigte Abrechnung rechnet mit dem Akonto, das in der Periode galt, nicht mit dem heutigen;
  # Marc Huber Mai und Juni 2 × 50.00, Juli bis Dezember 6 × 80.00 = 580.00 (ab 2025 gilt 100.00)
  Szenario: Berichtigte Abrechnung rechnet mit dem damaligen Akonto
    Angenommen der Mietvertrag von "Marc Huber" hat "50" Franken Akonto
    Und der Mietvertrag von "Marc Huber" hat ab "2024-07-01" "80" Franken Akonto
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und der Mietvertrag von "Marc Huber" hat ab "2025-01-01" "100" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter die Abrechnung berichtigt
    Und der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann zieht die Abrechnung "CHF 580.00" Akontobeiträge ab

  # #464 (F-4, Option A): weicht das Akonto der berichtigten Abrechnung von dem der ersetzten ab, sagt Dwello es;
  # die ersetzte zählte 8 × 50.00 = 400.00, das Akonto ist inzwischen ab Vertragsbeginn 80.00: 8 × 80.00 = 640.00
  Szenario: Die berichtigte Abrechnung nennt ein anderes Akonto als die ersetzte
    Angenommen der Mietvertrag von "Marc Huber" hat "50" Franken Akonto
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Marc Huber" ist versendet
    Und die Abrechnung 2024 von "Marc Huber" ist ersetzt
    Und der Mietvertrag von "Marc Huber" hat "80" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann warnt die berichtigte Abrechnung, dass ihre Akontobeiträge "CHF 640.00" anders sind als die "CHF 400.00" der ersetzten Abrechnung 2024 von "Marc Huber"

  # #464 (#103): das PDF nennt das Akonto als Monate mal Betrag, eine Zeile pro Betrag mit ihrem Zeitraum, und sagt,
  # dass das vereinbarte Akonto abgezogen ist (Fachreview F-6, F-7, F-9; #477)
  Szenario: Das PDF nennt das Akonto als Monate mal Betrag
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und der Mietvertrag von "Marc Huber" hat "50" Franken Akonto
    Und der Mietvertrag von "Marc Huber" hat ab "2024-07-01" "80" Franken Akonto
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und für die Abrechnung 2024 von "Marc Huber" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Akontobeiträge – 580.00"
    Und steht im PDF "2 Monate × CHF 50.00 (01.05.2024 – 30.06.2024) 100.00"
    Und steht im PDF "6 Monate × CHF 80.00 (01.07.2024 – 31.12.2024) 480.00"
    Und steht im PDF "Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind."
    # #477 (Entscheid Product Owner 2026-10-19): die Zeile heisst «Akontobeiträge», nicht «Geleistete …»
    Und steht im PDF nicht "Geleistete"
