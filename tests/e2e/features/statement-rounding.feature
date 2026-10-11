# language: de
@statements @api
Funktionalität: Saldo auf 5 Rappen runden
  Als Liegenschaftsverwalter
  möchte ich, dass der Saldo einer Abrechnung auf 5 Rappen gerundet ist
  damit der Mieter einen Betrag erhält, den er bar oder per QR-Rechnung genau bezahlen kann

  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01" mit 50 m²
    Und der Mieter "Anna Keller" existiert
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1001" Franken für 2024
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  # Nebenkosten 1001.00 + 3 % = 1031.03; die Positionen bleiben auf den Rappen genau
  Szenariogrundriss: Nachzahlung und Rückerstattung kaufmännisch auf 5 Rappen
    Angenommen "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken mit "<Akonto>" Franken Akonto
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 3 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Anna Keller" "CHF 1’031.03"
    Und beträgt der Saldo von "Anna Keller" "<Saldo>"

    Beispiele:
      | Akonto | Saldo                    |
      | 20     | Nachzahlung CHF 791.05   |
      | 90     | Rückerstattung CHF 48.95 |
