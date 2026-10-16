# language: de
@help
Funktionalität: Hilfe
  Als Liegenschaftsverwalter
  möchte ich nachlesen, wie die wichtigsten Abläufe in Dwello funktionieren
  damit ich die Nebenkosten ohne Rückfragen abrechnen kann

  Grundlage:
    Angenommen der Liegenschaftsverwalter liest die Hilfe

  Szenariogrundriss: Anleitung zu einem Ablauf
    Dann sieht der Liegenschaftsverwalter den Abschnitt "<Abschnitt>"

    Beispiele:
      | Abschnitt                          |
      | Gebäude und Wohnungen erfassen     |
      | Mieter und Mietverträge verwalten  |
      | Rechnungen erfassen                |
      | Nebenkostenabrechnungen erstellen  |
      | Zahlungen und Mahnungen            |
      | Begriffe kurz erklärt              |

  Szenario: Die Hilfe nennt das Hochladen mehrerer Rechnungen
    Dann erklärt die Hilfe unter "Rechnungen erfassen" "Mehrere Rechnungen auf einmal: Wählen Sie unter «Rechnungen» «Rechnungen hochladen». Die KI liest die Dateien aus, und Sie prüfen die Angaben, bevor Dwello die Rechnungen erstellt."

  # #59: drei Mahnungen von Dwello erlauben keine Kündigung wegen Zahlungsrückstand
  Szenario: Die Hilfe grenzt die Mahnung von der Mahnung nach Art. 257d OR ab
    Dann erklärt die Hilfe unter "Zahlungen und Mahnungen" "Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR."
    Und erklärt die Hilfe unter "Zahlungen und Mahnungen" "Lassen Sie sich beraten."
