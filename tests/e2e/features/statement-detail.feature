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
    Dann nennt die Abrechnung "Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.03.2024"

  # #104: eine einzige Wohnung trägt die ganzen Kosten (Wohnungsanteil 732.00); Eva Frei mietete 91 der 366 Tage,
  # 732.00 × 91/366 = 182.00; die Summe heisst wie im PDF
  Szenario: Kostenposition nennt Wohnungsanteil und Zeitanteil wie das PDF
    Angenommen im Gebäude "Lindenhof" gibt es eine Rechnung der Kategorie "Hauswart" über "732" Franken vom "2024-12-31"
    Und für "Eva Frei" im Gebäude "Lindenhof" gibt es die Nebenkostenabrechnung 2024 mit dem Heizprofil "Winter"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Eva Frei"
    Dann nennt die Position "Hauswart" den Wohnungsanteil "CHF 732.00", den Zeitanteil "91/366 Tage" und den Betrag "CHF 182.00"
    Und heisst die Summe der Kosten der Abrechnung "Ihre Nebenkosten"

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
