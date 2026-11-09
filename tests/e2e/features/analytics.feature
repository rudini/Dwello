# language: de
@analytics
Funktionalität: Auswertungen
  Als Liegenschaftsverwalter
  möchte ich je Gebäude und Kalenderjahr den vereinbarten Mietertrag und die Kosten sehen, die ich selbst trage
  damit ich die Steuererklärung ausfüllen oder der Treuhand die Zahlen geben kann

  # #1409 (PO 09.11.2026, Fachreview 1409-2 und 1409-3): Kalenderjahr; Mietertrag nach den Mietverträgen (Nettomiete,
  # Zusatzmiete, Nebenkostenpauschale), angebrochene Monate tageweise, ohne Akonto und Verwaltungspauschale; Kosten, die
  # der Vermieter trägt: nicht umlagefähige Rechnungen nach Rechnungsdatum ohne Hypothekarzinsen, und «davon tragen
  # Sie» der Kostenabstimmung der Abrechnungsperiode, die im Jahr endet. Seeblick 2025 (365 Tage, je 70 m²):
  # Nettomiete Anna 12 × 1'500 = 18'000.00, Ben ab 16.03. 16/31 × 1'240 = 640.00 + 9 × 1'240 = 11'160.00;
  # Pauschale 16/31 × 50 = 25.81 + 9 × 50 = 450.00. Hauswart 1'200: Anna 600.00, Ben 600 × 291/365 = 478.36, Leerstand
  # 1.02 (74 Tage) 121.64. Heizung 3'640 für 01.10.2025–31.03.2026: in der Periode 2025 3'640 × 92/182 = 1'840.00, für
  # Ben nicht vereinbart: Anna 920.00, Vermieter 920.00. Die Reparatur über 450 vom 10.01.2026 zählt 2026, Hypothekarzinsen
  # und der Hauswart von 2024 nie; Annas 3 % Verwaltungspauschale (45.60) nicht im Mietertrag.
  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.02"
    Und der Mieter "Anna Meier" existiert
    Und "Anna Meier" mietet die Wohnung "1.01" seit "2024-01-01" für "1500" Franken mit "200" Franken Akonto
    Und der Mieter "Ben Keller" existiert
    Und "Ben Keller" mietet die Wohnung "1.02" seit "2025-03-16" für "1240" Franken
    Und der Mietvertrag von "Ben Keller" hat "50" Franken Nebenkostenpauschale
    Und im Mietvertrag von "Ben Keller" ist "Heizung" nicht vereinbart
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Hauswart" über "1200" Franken vom "2025-06-30"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Heizung" über "3640" Franken vom "2026-01-15" für die Zeit vom "2025-10-01" bis "2026-03-31"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Reparaturen" über "800" Franken vom "2025-08-20"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Reparaturen" über "450" Franken vom "2026-01-10" für die Zeit vom "2025-12-01" bis "2025-12-15"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Hypothekarzinsen" über "4200" Franken vom "2025-06-30"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Wertvermehrende Investitionen" über "15000" Franken vom "2025-09-10"
    Und im Gebäude "Seeblick" gibt es eine Rechnung der Kategorie "Hauswart" über "999" Franken vom "2024-12-31"

  Szenario: Der Liegenschaftsverwalter sieht den Jahresbericht eines Gebäudes
    Angenommen für "Anna Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025 mit 3 % Verwaltungspauschale
    Und für "Ben Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025
    Und die Abrechnung 2025 von "Anna Meier" ist versendet
    Und die Abrechnung 2025 von "Ben Keller" ist versendet
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" öffnet
    Dann zeigt der Jahresbericht den Mietertrag:
      | Position             | Betrag        |
      | Nettomiete           | CHF 29’800.00 |
      | Zusatzmiete          | CHF 0.00      |
      | Nebenkostenpauschale | CHF 475.81    |
      | Total Mietertrag     | CHF 30’275.81 |
    Und zeigt der Jahresbericht die Kosten:
      | Position                                        | Betrag        |
      | Heizung                                         | CHF 920.00    |
      | Hauswart                                        | CHF 121.64    |
      | Total Nebenkosten, die Sie tragen               | CHF 1’041.64  |
      | Reparaturen                                     | CHF 800.00    |
      | Total Unterhalt und Verwaltung                  | CHF 800.00    |
      | Total Kosten ohne wertvermehrende Investitionen | CHF 1’841.64  |
      | Wertvermehrende Investitionen                   | CHF 15’000.00 |
      | Total wertvermehrende Investitionen             | CHF 15’000.00 |
    Und erklärt der Jahresbericht zum Mietertrag "Das sind die Beträge, die die Mietverträge für dieses Jahr vereinbaren; angebrochene Monate zählen nach Tagen. Dwello prüft nicht, ob die Mieter sie bezahlt haben: Vergleichen Sie sie mit Ihren Kontoauszügen. Akontobeiträge, Nachzahlungen und Rückerstattungen sind nicht enthalten: Sie decken die Nebenkosten, die die Mieter tragen, und diese zeigt der Bericht nicht. Auch die Verwaltungspauschale ist nicht enthalten: Sie steht in den Nebenkostenabrechnungen, nicht als fester Betrag im Mietvertrag. Haben Sie die Nettomiete, die Zusatzmiete oder die Nebenkostenpauschale geändert, rechnet Dwello für das ganze Jahr mit dem heutigen Betrag."
    Und erklärt der Jahresbericht zu den Kosten "Das sind die nicht umlagefähigen Rechnungen und der Teil der Nebenkosten, den die Abrechnungen nicht den Mietern belasten. Jede nicht umlagefähige Rechnung zählt ganz im Jahr ihres Rechnungsdatums, auch wenn ihr Leistungszeitraum in ein anderes Jahr reicht. Hypothekarzinsen zeigt der Bericht nicht; erfassen Sie auch andere Finanzierungskosten in der Kategorie «Hypothekarzinsen». Enthält eine Rechnung wertvermehrende Arbeiten, erfassen Sie diesen Teil als eigene Rechnung der Kategorie «Wertvermehrende Investitionen». Ob Sie diese effektiven Kosten oder einen Pauschalabzug geltend machen, entscheiden Sie in der Steuererklärung."
    Und nennt der Jahresbericht "Ihr Anteil an den Nebenkosten der Abrechnungsperiode 01.01.2025 – 31.12.2025, wie ihn die Kostenabstimmung unter «Berichte» zeigt: was die Abrechnungen nicht den Mietern belasten, etwa bei Leerstand oder für Nebenkosten, die ein Mieter pauschal bezahlt. Weil jeder Anteil auf Rappen gerundet ist, kann eine Kategorie einige Rappen zeigen, auch mit Minus."

  Szenario: Der Jahresbericht sagt, wenn die Abrechnungen der Periode fehlen
    Wenn der Liegenschaftsverwalter den Jahresbericht 2026 des Gebäudes "Seeblick" öffnet
    Dann zeigt der Jahresbericht die Kosten:
      | Position                                        | Betrag     |
      | Reparaturen                                     | CHF 450.00 |
      | Total Unterhalt und Verwaltung                  | CHF 450.00 |
    Und nennt der Jahresbericht "Für die Abrechnungsperiode 01.01.2026 – 31.12.2026 gibt es noch keine Abrechnungen. Ihr Anteil an den Nebenkosten ist deshalb nicht enthalten. Erstellen Sie die Abrechnungen und öffnen Sie den Bericht dann erneut."

  Szenario: Der Jahresbericht als CSV hat dieselben Zahlen
    Angenommen für "Anna Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025
    Und für "Ben Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" als CSV herunterlädt
    Dann ist die heruntergeladene Datei der Jahresbericht 2025 von "Seeblick" als "csv"
    Und enthält die CSV-Datei des Jahresberichts die Zeilen:
      | Position                                        | Betrag   |
      | Nettomiete                                      | 29800.00 |
      | Total Mietertrag                                | 30275.81 |
      | Heizung                                         | 920.00   |
      | Total Nebenkosten, die Sie tragen               | 1041.64  |
      | Total Unterhalt und Verwaltung                  | 800.00   |
      | Total Kosten ohne wertvermehrende Investitionen | 1841.64  |
      | Total wertvermehrende Investitionen             | 15000.00 |

  Szenario: Der Jahresbericht als PDF hat dieselben Zahlen
    Angenommen für "Anna Meier" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025
    Und für "Ben Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung 2025
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" als PDF herunterlädt
    Dann ist die heruntergeladene Datei der Jahresbericht 2025 von "Seeblick" als "pdf"
    Und enthält das PDF des Jahresberichts "Total Mietertrag CHF 30’275.81"
    Und enthält das PDF des Jahresberichts "Heizung CHF 920.00"
    Und enthält das PDF des Jahresberichts "Total Kosten ohne wertvermehrende Investitionen CHF 1’841.64"
    Und enthält das PDF des Jahresberichts "Dwello prüft nicht, ob die Mieter sie bezahlt haben"
    Und enthält das PDF des Jahresberichts "Abrechnungsperiode 01.01.2025 – 31.12.2025"

  # Personas Helga P-1, Sven P-3, Marco P-5 (1409-2): eine Datei gehört zum angezeigten Bericht, nicht zur neuen Wahl
  Szenario: Der Jahresbericht bietet die Dateien erst für den angezeigten Bericht an
    Angenommen das Gebäude "Bergsicht" in "Winterthur" existiert
    Wenn der Liegenschaftsverwalter den Jahresbericht 2025 des Gebäudes "Seeblick" öffnet
    Und der Liegenschaftsverwalter für den Jahresbericht das Gebäude "Bergsicht" wählt
    Dann heisst der angezeigte Jahresbericht "Jahresbericht Seeblick 2025"
    Aber bietet der Jahresbericht keine Datei zum Herunterladen an
