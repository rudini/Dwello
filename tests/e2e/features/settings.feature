# language: de
@config
Funktionalität: Einstellungen
  Als Liegenschaftsverwalter
  möchte ich die Angaben meiner Verwaltung hinterlegen
  damit Abrechnungen und Mahnungen den richtigen Absender und die richtige IBAN tragen

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen

  # P-2 (#87): Zahlungsfrist und Mahnfrist als Vorgabewerte. Nur dieses Szenario speichert das ganze Formular: die
  # Einstellungen gelten für alle parallel laufenden Szenarien, und ein leeres Feld setzt den Wert zurück
  Szenario: Absender und Fristen hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname           | Muster Immobilien AG  |
      | Adresse              | Bahnhofstrasse 1      |
      | PLZ                  | 8001                  |
      | Ort                  | Zürich                |
      | IBAN                 | CH9300762011623852957 |
      | Zahlungsfrist (Tage) | 30                    |
      | Mahnfrist (Tage)     | 14                    |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und sind die Zahlungsfrist "30" und die Mahnfrist "14" hinterlegt

  Szenario: Ungültige IBAN
    Wenn der Liegenschaftsverwalter die IBAN "DE89 3704 0044 0532 0130 00" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine gültige Schweizer IBAN ein"

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ "80" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben"

  Szenario: Fristen sind erklärt
    Dann erklärt die Einstellung "Zahlungsfrist (Tage)" "Wie viele Tage nach dem Versand der Mieter eine Nachzahlung bezahlt oder Sie eine Rückerstattung überweisen. Erlaubt sind 7 bis 90 Tage, Vorgabe: 30 Tage. Gilt für Abrechnungen, die Sie ab jetzt versenden; die Frist einer einzelnen Abrechnung ändern Sie dort mit «Frist und Bemerkungen bearbeiten»."
    Und erklärt die Einstellung "Mahnfrist (Tage)" "Wie viele Tage nach der Zahlungsfrist einer Nachzahlung die Übersicht eine Mahnung vorschlägt. Erlaubt sind 7 bis 60 Tage, Vorgabe: 14 Tage. Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist, und mahnen können Sie ab dann. Nach einer Mahnung schlägt die Übersicht die nächste vor, sobald die Frist in dieser Mahnung abgelaufen ist."

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

  # Rückerstattung (#69)
  Szenario: Die Einstellungen sagen, wer eine Rückerstattung überweist
    Dann erklären die Einstellungen bei der IBAN "Eine Rückerstattung überweisen Sie selbst bis zur Zahlungsfrist auf das Konto des Mieters"
