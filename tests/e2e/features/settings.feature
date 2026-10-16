# language: de
@config
Funktionalität: Einstellungen
  Als Liegenschaftsverwalter
  möchte ich die Angaben meiner Verwaltung hinterlegen
  damit Abrechnungen und Mahnungen den richtigen Absender und die richtige IBAN tragen

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen

  Szenario: Absender hinterlegen
    Wenn der Liegenschaftsverwalter folgenden Absender speichert:
      | Firmenname | Muster Immobilien AG       |
      | Adresse    | Bahnhofstrasse 1           |
      | PLZ        | 8001                       |
      | Ort        | Zürich                     |
      | IBAN       | CH9300762011623852957      |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt

  Szenario: Ungültige IBAN
    Wenn der Liegenschaftsverwalter die IBAN "DE89 3704 0044 0532 0130 00" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine gültige Schweizer IBAN ein"

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ "80" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben"

  # P-2 (#87): Vorgaben für neue Abrechnungen und für die Übersicht; gespeichert werden die Vorgabewerte, denn
  # die Einstellungen gelten für alle parallel laufenden Szenarien
  @wip
  Szenario: Zahlungsfrist und Mahnfrist hinterlegen
    Wenn der Liegenschaftsverwalter folgende Fristen speichert:
      | Zahlungsfrist (Tage) | 30 |
      | Mahnfrist (Tage)     | 14 |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die Zahlungsfrist "30" und die Mahnfrist "14" hinterlegt

  @wip
  Szenario: Fristen sind erklärt
    Dann erklärt das Feld "Zahlungsfrist (Tage)" "Anzahl Tage nach dem Versand, bis zu der der Mieter die Abrechnung bezahlen muss. Gilt für neu versendete Abrechnungen; die Übersicht zeigt jede offene Zahlungsfrist innerhalb dieser Tage."
    Und erklärt das Feld "Mahnfrist (Tage)" "Anzahl Tage nach Ablauf der Zahlungsfrist, bis die Übersicht eine Mahnung vorschlägt. Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist."

  @wip
  Szenariogrundriss: Frist ausserhalb des erlaubten Bereichs
    Wenn der Liegenschaftsverwalter die <Frist> "<Tage>" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "<Meldung>"

    Beispiele:
      | Frist         | Tage | Meldung                                                       |
      | Zahlungsfrist | 5    | Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.            |
      | Mahnfrist     | 61   | Geben Sie für die Mahnfrist 7 bis 60 Tage ein.                |

  Szenariogrundriss: Stammdaten öffnen
    Wenn der Liegenschaftsverwalter die Stammdaten "<Stammdaten>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Stammdaten       | Seite            |
      | Kategorien       | Kategorien       |
      | Heizprofile      | Heizprofile      |
      | Verteilschlüssel | Verteilschlüssel |
