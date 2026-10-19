# language: de
@statements
Funktionalität: Saldo unter CHF 5
  Als Liegenschaftsverwalter
  möchte ich einen Saldo unter CHF 5 mit der nächsten Abrechnung verrechnen
  damit der Mieter für ein paar Franken weder einzahlen noch seine IBAN schicken muss und nichts verloren geht (#403)

  # #403: weder Zahlteil noch Bitte um die IBAN; der Saldo wird mit der nächsten Abrechnung desselben Mietvertrags
  # verrechnet (Übertrag). Abrechnungen, die nach #94 versendet wurden, behalten ihr PDF; eine erlassene Nachzahlung
  # bleibt erlassen, eine einbehaltene Rückerstattung wird übertragen (No scenario: Dwello versendet keine solche mehr;
  # statement-carry-over.pg.test.ts, statement-pages.dom.test.ts)
  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "100" Franken Akonto
    Und im Mietvertrag von "Anna Keller" ist keine Verwaltungspauschale vereinbart

  # Nebenkosten 1'203.00 – Akonto 12 × 100.00 = Nachzahlung 3.00; das PDF, das der Mieter mit dem Versand erhält
  Szenario: Kleine Nachzahlung wird mit der nächsten Abrechnung verrechnet
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Nachzahlung CHF 3.00"
    Und steht im PDF "Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung; Sie müssen jetzt nichts bezahlen."
    Und steht im PDF nicht "Zahlteil"
    Und steht im PDF nicht "verzichten"

  # Nebenkosten 1'197.00 – Akonto 12 × 100.00 = Rückerstattung 3.00 (Art. 257b Abs. 1 und Art. 115 OR: verrechnet,
  # nicht erlassen)
  Szenario: Kleine Rückerstattung wird mit der nächsten Abrechnung verrechnet
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Rückerstattung CHF 3.00"
    Und steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung."
    Und steht im PDF nicht "IBAN mit"
    Und steht im PDF nicht "nicht aus"

  # Keine Zahlung: die Abrechnung ist mit dem Versand «Erledigt», nicht «Bezahlt»; sie hat kein Zahlungsdatum
  Szenariogrundriss: Saldo unter CHF 5 ist mit dem Versand erledigt
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "<Rechnung>" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann hat die Abrechnung den Status "Erledigt"
    Und sagt die Zahlung der Abrechnung "<Zahlung>"

    Beispiele:
      | Rechnung | Zahlung                                                                              |
      | 1203     | Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet. |
      | 1197     | Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet. |
      | 1200     | Es ist nichts zu bezahlen.                                                           |

  # #403 (3): eine erledigte Abrechnung wird nicht gemahnt, auch nach Ablauf der Zahlungsfrist, und hat keine Zahlung,
  # die sich zurücksetzen liesse
  Szenario: Erledigte Abrechnung bietet weder Mahnung noch Zurücksetzen der Zahlung an
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und die Zahlungsfrist der Abrechnung 2024 von "Anna Keller" ist abgelaufen
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann hat die Abrechnung den Status "Erledigt"
    Und bietet die Abrechnung keine Mahnung an
    Und bietet die Abrechnung kein Zurücksetzen der Zahlung an

  # 2024: Rückerstattung 3.00, übertragen. 2025: Nebenkosten 1'250.00 – Akonto 1'200.00 = 50.00, minus Übertrag 3.00
  # = Nachzahlung 47.00
  Szenario: Die nächste Abrechnung verrechnet eine übertragene Rückerstattung
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1250" Franken für 2025
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2025
    Und für die Abrechnung 2025 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Anna Keller"
    Dann zieht die Abrechnung den Übertrag "CHF 3.00" aus der Abrechnung 2024 von "Anna Keller" ab
    Und beträgt der Saldo der Abrechnung "CHF 47.00"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF der Übertrag "CHF 3.00" aus der Abrechnung 2024 von "Anna Keller"
    Und steht im PDF "Nachzahlung CHF 47.00"

  # 2024: Nachzahlung 3.00, übertragen. 2025: Nebenkosten 1'250.02 – Akonto 1'200.00 = 50.02, plus Übertrag 3.00
  # = 53.02, als Summe auf 5 Rappen gerundet: Nachzahlung 53.00
  Szenario: Die nächste Abrechnung rechnet eine übertragene Nachzahlung dazu
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1250.02" Franken für 2025
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2025
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2025 von "Anna Keller"
    Dann zählt die Abrechnung den Übertrag "CHF 3.00" aus der Abrechnung 2024 von "Anna Keller" dazu
    Und beträgt der Saldo der Abrechnung "CHF 53.00"

  # #403: endet der Mietvertrag in der Abrechnungsperiode (Schlussabrechnung), gilt kein Mindestbetrag: auch 3.00
  # wird eingefordert, mit Zahlteil
  Szenario: Die Schlussabrechnung fordert auch eine kleine Nachzahlung ein
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und der Mietvertrag von "Anna Keller" endet am "2024-12-31"
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann hat die Abrechnung den Status "Versendet"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Nachzahlung CHF 3.00"
    Und steht im PDF "Zahlteil"
    Und steht im PDF nicht "verrechnet"

  # Auch eine kleine Rückerstattung zahlt der Vermieter mit der Schlussabrechnung aus
  Szenario: Die Schlussabrechnung zahlt auch eine kleine Rückerstattung aus
    Angenommen der Mietvertrag von "Anna Keller" endet am "2024-12-31"
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann hat die Abrechnung den Status "Versendet"
    Wenn der Liegenschaftsverwalter die Abrechnung als bezahlt markiert
    Dann hat die Abrechnung den Status "Bezahlt"

  # 2023: Nachzahlung 3.00, übertragen. Die Schlussabrechnung 2024 (Vertragsende 31.12.2024) rechnet ihn ein:
  # 1'201.00 – 1'200.00 + 3.00 = Nachzahlung 4.00, ohne Mindestbetrag eingefordert
  Szenario: Die Schlussabrechnung rechnet den Übertrag der letzten Abrechnung ein
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2023
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2023
    Und die Abrechnung 2023 von "Anna Keller" ist versendet
    Und der Mietvertrag von "Anna Keller" endet am "2024-12-31"
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1201" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann zählt die Abrechnung den Übertrag "CHF 3.00" aus der Abrechnung 2023 von "Anna Keller" dazu
    Und beträgt der Saldo der Abrechnung "CHF 4.00"
    Und hat die Abrechnung den Status "Versendet"

  # Ohne Zahlung gibt es keine Frist (Persona Marco P-1); eine Bemerkung lässt sich weiter festhalten
  Szenario: Bei einem Saldo unter CHF 5 hält der Liegenschaftsverwalter nur eine Bemerkung fest
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung 2024 von "Anna Keller"
    Dann fragt die Bearbeitungsseite nur nach einer Bemerkung
    Wenn der Liegenschaftsverwalter nur die Bemerkung "Mieterin zieht Ende Jahr aus" festhält
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Und die Abrechnung enthält die Bemerkung "Mieterin zieht Ende Jahr aus"

  # Verglichen wird der gerundete Saldo: 5.02 und –4.98 sind gerundet CHF 5.00 und bleiben offen
  Szenariogrundriss: Saldo an der Grenze von CHF 5
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "<Rechnung>" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann hat die Abrechnung den Status "<Status>"

    Beispiele:
      | Rechnung | Status    |
      | 1204.95  | Erledigt  |
      | 1205     | Versendet |
      | 1205.02  | Versendet |
      | 1195.05  | Erledigt  |
      | 1195     | Versendet |
      | 1195.02  | Versendet |
