# language: de
@analytics
Funktionalität: Auswertungen
  Als Liegenschaftsverwalter
  möchte ich je Gebäude und Kalenderjahr die vereinbarten Mieteinnahmen und die Kosten sehen
  damit ich die Steuererklärung ausfüllen oder der Treuhand die Zahlen geben kann

  # #1409 (PO 09.11.2026): Kalenderjahr; Mieteinnahmen nach den Mietverträgen, angebrochene Monate tageweise, nicht mit
  # den Zahlungen geprüft; nur effektive Kosten, in drei Gruppen. Seeblick 2025:
  # Anna Meier das ganze Jahr: Nettomiete 12 × 1'500 = 18'000.00, Akonto 12 × 200 = 2'400.00.
  # Ben Keller ab 16.03.2025: März 16/31 × 1'240 = 640.00 und 16/31 × 50 = 25.81, April–Dezember 9 × 1'240 = 11'160.00
  # und 9 × 50 = 450.00. Nettomiete 29'800.00, Nebenkostenpauschale 475.81.
  # Heizung 3'640 für 01.10.2025–31.03.2026 (182 Tage): 2025 zählen 92 Tage, 3'640 × 92 / 182 = 1'840.00.
  # Die Hauswart-Rechnung von 2024 zählt nicht.
  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.02"
    Und der Mieter "Anna Meier" existiert
    Und "Anna Meier" mietet die Wohnung "1.01" seit "2024-01-01" für "1500" Franken mit "200" Franken Akonto
    Und der Mieter "Ben Keller" existiert
    Und "Ben Keller" mietet die Wohnung "1.02" seit "2025-03-16" für "1240" Franken
    Und der Mietvertrag von "Ben Keller" hat "50" Franken Nebenkostenpauschale
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2025-06-30"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Heizung" über "3640" Franken vom "2026-01-15" für die Zeit vom "2025-10-01" bis "2026-03-31"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Reparaturen" über "800" Franken vom "2025-08-20"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Wertvermehrende Investitionen" über "15000" Franken vom "2025-09-10"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Hauswart" über "999" Franken vom "2024-12-31"

  @wip
  Szenario: Der Liegenschaftsverwalter sieht den Jahresbericht eines Gebäudes
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" öffnet
    Dann zeigt der Jahresbericht die Mieteinnahmen:
      | Position             | Betrag        |
      | Nettomiete           | CHF 29’800.00 |
      | Zusatzmiete          | CHF 0.00      |
      | Akonto               | CHF 2’400.00  |
      | Nebenkostenpauschale | CHF 475.81    |
      | Total Mieteinnahmen  | CHF 32’675.81 |
    Und zeigt der Jahresbericht die Kosten:
      | Kategorie                     | Betrag        |
      | Heizung                       | CHF 1’840.00  |
      | Hauswart                      | CHF 1’200.00  |
      | Total Nebenkosten             | CHF 3’040.00  |
      | Reparaturen                   | CHF 800.00    |
      | Total Unterhalt               | CHF 800.00    |
      | Wertvermehrende Investitionen | CHF 15’000.00 |
      | Total wertvermehrend          | CHF 15’000.00 |
      | Total Kosten                  | CHF 18’840.00 |
    Und erklärt der Jahresbericht zu den Mieteinnahmen "Das sind die Beträge, die die Mietverträge für dieses Jahr vereinbaren, für angebrochene Monate tageweise. Dwello prüft nicht, ob die Mieter sie bezahlt haben; vergleichen Sie sie mit Ihren Kontoauszügen."
    Und erklärt der Jahresbericht zu den Kosten "Das sind die Rechnungen dieses Jahres. Reicht der Leistungszeitraum einer Rechnung über das Jahr hinaus, zählt nur der Anteil der Tage in diesem Jahr; ohne Leistungszeitraum zählt das Rechnungsdatum. Ob Sie in der Steuererklärung diese effektiven Kosten oder einen Pauschalabzug geltend machen, entscheiden Sie dort."

  @wip
  Szenario: Der Jahresbericht als CSV hat dieselben Zahlen
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" als CSV herunterlädt
    Dann ist die heruntergeladene Datei der Jahresbericht 2025 von "Seeblick" als "csv"
    Und enthält die CSV-Datei des Jahresberichts die Zeilen:
      | Position                      | Betrag   |
      | Nettomiete                    | 29800.00 |
      | Total Mieteinnahmen           | 32675.81 |
      | Heizung                       | 1840.00  |
      | Total Nebenkosten             | 3040.00  |
      | Total Unterhalt               | 800.00   |
      | Total wertvermehrend          | 15000.00 |
      | Total Kosten                  | 18840.00 |

  @wip
  Szenario: Der Jahresbericht als PDF hat dieselben Zahlen
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" als PDF herunterlädt
    Dann ist die heruntergeladene Datei der Jahresbericht 2025 von "Seeblick" als "pdf"
    Und enthält das PDF des Jahresberichts "Total Mieteinnahmen CHF 32’675.81"
    Und enthält das PDF des Jahresberichts "Heizung CHF 1’840.00"
    Und enthält das PDF des Jahresberichts "Total Kosten CHF 18’840.00"
    Und enthält das PDF des Jahresberichts "Dwello prüft nicht, ob die Mieter sie bezahlt haben"
