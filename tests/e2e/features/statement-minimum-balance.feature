# language: de
@statements @wip
Funktionalität: Kleiner Saldo unter CHF 5
  Als Liegenschaftsverwalter
  möchte ich einen Saldo unter CHF 5 weder einfordern noch auszahlen
  damit der Mieter für ein paar Franken weder einzahlen noch seine IBAN schicken muss (#94)

  # Kein Zahlteil, keine Bitte um die IBAN, nichts wird auf die nächste Abrechnung übertragen
  Grundlage:
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "100" Franken Akonto
    Und im Mietvertrag von "Anna Keller" ist keine Verwaltungspauschale vereinbart

  # Nebenkosten 1'203.00 – Akonto 12 × 100.00 = Nachzahlung 3.00
  Szenario: Kleine Nachzahlung wird nicht eingefordert
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Nachzahlung CHF 3.00"
    Und steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir fordern ihn nicht ein."
    Und steht im PDF nicht "Zahlteil"

  # Nebenkosten 1'197.00 – Akonto 12 × 100.00 = Rückerstattung 3.00
  Szenario: Kleine Rückerstattung wird nicht ausbezahlt
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1197" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Rückerstattung CHF 3.00"
    Und steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir zahlen ihn nicht aus."
    Und steht im PDF nicht "IBAN mit"

  # Nichts zu bezahlen und nichts zu mahnen: die Abrechnung ist mit dem Versand erledigt
  Szenario: Kleiner Saldo ist mit dem Versand erledigt
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1203" Franken für 2024
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Abrechnung versendet
    Dann hat die Abrechnung den Status "Bezahlt"
    Und sagt die Zahlung der Abrechnung "Der Betrag ist kleiner als CHF 5.00. Sie fordern ihn nicht ein."
    Und bietet die Abrechnung keine Mahnung an

  # Ab CHF 5.00 gilt der Saldo wie bisher: Zahlteil im PDF, offen bis zur Zahlung
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
      | 1195.05  | Bezahlt   |
      | 1195     | Versendet |
