# language: de
@statements
Funktionalität: Saldo unter CHF 5
  Als Liegenschaftsverwalter
  möchte ich einen Saldo unter CHF 5 weder einfordern noch auszahlen
  damit der Mieter für ein paar Franken weder einzahlen noch seine IBAN schicken muss (#94)

  # Kein Zahlteil, keine Bitte um die IBAN, nichts wird auf die nächste Abrechnung übertragen
  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "100" Franken Akonto
    Und im Mietvertrag von "Anna Keller" ist keine Verwaltungspauschale vereinbart

  # Nebenkosten 1'203.00 – Akonto 12 × 100.00 = Nachzahlung 3.00; das PDF, das der Mieter mit dem Versand erhält
  Szenario: Kleine Nachzahlung wird nicht eingefordert
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Nachzahlung CHF 3.00"
    Und steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir verzichten darauf; Sie müssen nichts bezahlen."
    Und steht im PDF nicht "Zahlteil"
    Und steht im PDF nicht "Bezahlt am"

  # Nebenkosten 1'197.00 – Akonto 12 × 100.00 = Rückerstattung 3.00
  Szenario: Kleine Rückerstattung wird nicht ausbezahlt
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und für die Abrechnung 2024 von "Anna Keller" gibt es ein PDF
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Rückerstattung CHF 3.00"
    Und steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus."
    Und steht im PDF nicht "IBAN mit"
    Und steht im PDF nicht "Überwiesen am"

  # Nichts zu bezahlen: die Abrechnung ist mit dem Versand erledigt (eine Mahnung lehnt das Backend ab, reminders.pg.test.ts)
  Szenariogrundriss: Saldo unter CHF 5 ist mit dem Versand erledigt
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "<Rechnung>" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann hat die Abrechnung den Status "Bezahlt"
    Und sagt die Zahlung der Abrechnung "<Zahlung>"

    Beispiele:
      | Rechnung | Zahlung                                                        |
      | 1203     | Der Betrag ist kleiner als CHF 5.00. Sie verzichten darauf.    |
      | 1197     | Der Betrag ist kleiner als CHF 5.00. Sie zahlen ihn nicht aus. |

  # Verglichen wird der gerundete Saldo: 5.02 und –4.98 sind gerundet CHF 5.00 und bleiben offen
  Szenariogrundriss: Saldo an der Grenze von CHF 5
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "<Rechnung>" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann hat die Abrechnung den Status "<Status>"

    Beispiele:
      | Rechnung | Status    |
      | 1204.95  | Bezahlt   |
      | 1205     | Versendet |
      | 1205.02  | Versendet |
      | 1195.05  | Bezahlt   |
      | 1195     | Versendet |
      | 1195.02  | Versendet |
