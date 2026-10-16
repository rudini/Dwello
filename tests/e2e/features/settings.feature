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
