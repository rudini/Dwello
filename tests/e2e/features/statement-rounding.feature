# language: de
@statements @api
Funktionalität: Saldo auf 5 Rappen runden
  Als Liegenschaftsverwalter
  möchte ich, dass der Saldo einer Abrechnung auf 5 Rappen gerundet ist, nur zugunsten des Mieters
  damit der Mieter einen Betrag erhält, den er bar oder per QR-Rechnung genau bezahlen kann, und nie mehr bezahlt als die tatsächlichen Kosten

  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01" mit 50 m²
    Und der Mieter "Anna Keller" existiert
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1001" Franken für 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  # Nebenkosten 1001.00 + 3 % = 1031.03; die Positionen bleiben auf den Rappen genau. Akonto 12 × 20 = 240.00:
  # 791.03 → 791.00; 12 × 90 = 1080.00: −48.97 → −49.00; 12 × 85.92 = 1031.04: −0.01 → −0.05
  Szenariogrundriss: Eine Nachzahlung wird ab-, eine Rückerstattung aufgerundet
    Angenommen "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "<Akonto>" Franken Akonto
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Anna Keller" "CHF 1’031.03"
    Und beträgt der Saldo von "Anna Keller" "<Saldo>"

    Beispiele:
      | Akonto | Saldo                    |
      | 20     | Nachzahlung CHF 791.00   |
      | 90     | Rückerstattung CHF 49.00 |
      | 85.92  | Rückerstattung CHF 0.05  |

  # (1001.00 + 4.00) + 3 % = 1035.15; Akonto 12 × 86.26 = 1035.12; Saldo 0.03 → 0.00
  Szenario: Eine Nachzahlung unter 5 Rappen wird nicht verlangt
    Angenommen im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "4" Franken für 2024
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "86.26" Franken Akonto
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Anna Keller" "CHF 1’035.15"
    Und beträgt der Saldo von "Anna Keller" "Ausgeglichen CHF 0.00"
