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

  Szenario: Die Hilfe sagt, wo ein angefangener Mietvertrag bleibt
    Dann erklärt die Hilfe unter "Mieter und Mietverträge verwalten" "Erst «Mietvertrag speichern» im letzten Schritt legt den Mietvertrag an. Bis Sie speichern, Ihre Angaben verwerfen oder sich abmelden, bewahrt Dwello sie nur in diesem Browser auf."

  Szenario: Die Hilfe nennt das Hochladen mehrerer Rechnungen
    Dann erklärt die Hilfe unter "Rechnungen erfassen" "Mehrere Rechnungen auf einmal: Wählen Sie unter «Rechnungen» «Rechnungen hochladen». Die KI liest die Dateien aus, und Sie prüfen die Angaben, bevor Dwello die Rechnungen erstellt."

  # Kosten über mehrere Jahre (#254)
  Szenario: Die Hilfe erklärt Kosten über mehrere Jahre
    Dann erklärt die Hilfe unter "Rechnungen erfassen" "Kosten, die nur alle paar Jahre anfallen, verteilen Sie mit dem Leistungszeitraum über diese Jahre."

  # Begriffe zum Mietvertrag und zur KI-Kategorie (#109); Abrechnungsperiode wie im Glossar (#67); Fachreview (#69);
  # «bis 3 %» und der Saldo einer berichtigten Abrechnung wie im Glossar (#447, Entscheid in #402)
  Szenariogrundriss: Die Hilfe erklärt den Begriff "<Begriff>"
    Dann erklärt die Hilfe den Begriff "<Begriff>" mit "<Erklärung>"

    Beispiele:
      | Begriff                 | Erklärung                                                       |
      | Befristet / Unbefristet | endet ohne Kündigung am vereinbarten Vertragsende               |
      | Kündigungstermin        | Tag, auf den ein unbefristeter Mietvertrag gekündigt werden kann |
      | Kündigungsfrist         | Zeit zwischen dem Eingang der Kündigung und dem Kündigungstermin |
      | Manuell überschrieben   | «Manuell»                                                       |
      | Abrechnungsperiode      | Ohne Leistungszeitraum bestimmt das Rechnungsdatum, in welche Abrechnungsperiode eine Rechnung fällt. |
      | Umlagefähig             | Bezahlen muss der Mieter diese Kosten nur, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt. |
      | Mahnung                 | erst nach einer eigenen schriftlichen Zahlungsfrist von mindestens 30 Tagen |
      | Verwaltungspauschale    | Üblich sind bis 3 %                                             |
      | Saldo                   | bei einer berichtigten Abrechnung zusätzlich minus, was er auf die ersetzten Abrechnungen schon bezahlt hat |

    # #448 (personas dr-weber-448 P-2, anna-448 P-4): «Erledigt» ist keine Zahlung; der Saldo zählt den Übertrag
    Beispiele:
      | Begriff  | Erklärung                                                  |
      | Erledigt | Ein übertragener Betrag ist damit noch nicht bezahlt       |
      | Saldo    | plus eine übertragene Nachzahlung bzw. minus eine übertragene Rückerstattung der vorherigen Abrechnung |

  # Inhaltsverzeichnis (#109)
  Szenario: Die Hilfe führt vom Inhalt direkt zu den Begriffen
    Angenommen das Browserfenster ist 390 Pixel breit
    Wenn der Liegenschaftsverwalter im Inhalt der Hilfe "Begriffe kurz erklärt" wählt
    Dann sieht der Liegenschaftsverwalter die Begriffe der Hilfe unter ihrer eigenen Adresse
    Und scrollt die Seite nicht seitwärts

  # #59: drei Mahnungen von Dwello erlauben keine Kündigung wegen Zahlungsrückstand
  Szenario: Die Hilfe grenzt die Mahnung von der Zahlungsfrist mit Kündigungsandrohung ab
    Dann erklärt die Hilfe unter "Zahlungen und Mahnungen" "Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR."
    Und erklärt die Hilfe unter "Zahlungen und Mahnungen" "Lassen Sie sich beraten."
