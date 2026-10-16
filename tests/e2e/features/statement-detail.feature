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

  # Das Geld kam vor einigen Tagen: festgehalten wird der Tag des Eingangs, nicht der Tag des Erfassens
  Szenario: Zahlungseingang mit Datum festhalten
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am "2026-01-05" bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"
    Und nennt der Verlauf "Bezahlt" am "05.01.2026"

  Szenario: Kein Zahlungseingang in der Zukunft
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und die Abrechnung 2024 von "Eva Frei" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter die Abrechnung als am "2099-01-01" bezahlt markiert
    Dann meldet das Feld «Bezahlt am» "Das Zahlungsdatum liegt in der Zukunft."
    Und hat die Abrechnung den Status "Versendet"

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
  Szenario: Das PDF erklärt die Verteilung und den Heizölverbrauch
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Lindenhof" war am "2023-12-31" Heizöl für "600" Franken im Tank
    Und im Gebäude "Lindenhof" war am "2024-12-31" Heizöl für "100" Franken im Tank
    Und für "Marc Huber" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Marc Huber"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Pro Fläche (m²) 70.00 / 70.00 m²"
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
    Und steht im PDF "Ihre Mietstage darin von dessen Tagen in der Periode"

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
  # 18 + 14 + 11 = 43 % von 18 + 14 + 11 + 5 + 2 + 0 = 50 %, also 86 %; das PDF nennt beide Summen (#229, F-6)
  Szenario: PDF nennt bei einer Periode unter einem Jahr die Summen der Monatsanteile
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung vom "2024-01-01" bis "2024-06-30" mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "86.00 % der Heizkosten"
    Und steht im PDF "Jan 18.00 %, Feb 14.00 %, Mär 11.00 %"
    Und steht im PDF "zusammen 43.00 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 50.00 %"

  Szenario: PDF in der Sprache des Mieters
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und die Korrespondenz an "Eva Frei" ist auf "Französisch"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann trägt das PDF den Titel "Décompte des charges"

  # A-10: wer neu abrechnet, sieht, welches Heizprofil die Abrechnung verwendet
  Szenario: Abrechnung nennt ihr Heizprofil
    Angenommen für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Abrechnung das Heizprofil "Winter"
