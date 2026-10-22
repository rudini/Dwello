# language: de
@wip
Funktionalität: KI in den Einstellungen wählen
  Als Liegenschaftsverwalter
  möchte ich im Browser wählen, welche KI meine Rechnungen liest
  damit ich dafür keine Einstellungsdatei bearbeiten und Dwello nicht neu starten muss

  # #580: auf der eingerichteten frischen Installation, deren Betreiber die KI nicht festgelegt hat; die KI-Ersatzattrappe
  # steht für den Anbieter (backend/scripts/llm-stub.ts). Der Anbieter ist hier ein Name, nicht die Adresse: die
  # Datenschutzerklärung nennt, wer die Rechnungen erhält.

  Szenario: Von den Einstellungen zur KI
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter der frischen Installation in den Einstellungen die KI öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "KI"

  Szenario: Einen Anbieter der KI wählen
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter den Anbieter "Muster KI AG" in "Deutschland" mit geprüftem Datenschutz speichert
    Dann sieht der Liegenschaftsverwalter bei der KI die Meldung "Die KI-Einstellung ist gespeichert. Die nächste Rechnung verwendet sie."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Muster KI AG (Deutschland)"

  Szenario: Der API-Schlüssel bleibt nach dem Speichern auf dem Server
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter die KI der frischen Installation öffnet
    Dann ist das Feld für den API-Schlüssel leer
    Und sagt die KI "Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten."

  Szenario: Keine KI wählen
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter "Keine KI" speichert
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Rechnungen und Kategorien werden nicht von einer KI bearbeitet."
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Muster KI AG"

  Szenario: Zur lokalen KI zurückkehren
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Und das KI-Modell ist zu 40 % geladen
    Wenn der Liegenschaftsverwalter "Lokale KI" speichert
    Dann sagt die KI "Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Die KI läuft auf dem Server des Betreibers"

  # Ohne Bestätigung, Anbieter oder Land nennt die Datenschutzerklärung nicht, wer die Rechnungen erhält (Art. 19 DSG)
  Szenariogrundriss: Ein Anbieter ohne <Angabe> wird nicht gespeichert
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter einen Anbieter der KI ohne <Angabe> speichert
    Dann sieht der Liegenschaftsverwalter bei der KI den Fehler "<Fehler>"
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Muster KI AG"

    Beispiele:
      | Angabe                 | Fehler                                                                                              |
      | Bestätigung            | Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.                             |
      | Namen des Anbieters    | Geben Sie den Namen des Anbieters an. Die Datenschutzerklärung nennt ihn.                           |
      | Land                   | Geben Sie das Land an, in dem der Anbieter die Daten bearbeitet. Die Datenschutzerklärung nennt es. |

  Szenariogrundriss: Die Verbindung zur KI prüfen
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter die Verbindung zu einem Anbieter mit <Fall> prüft
    Dann sagt die Prüfung der Verbindung "<Ergebnis>"

    Beispiele:
      | Fall                         | Ergebnis                                                                                                                     |
      | gültigem Schlüssel           | Die Verbindung steht, und das Modell liest Rechnungsbilder.                                                                  |
      | falschem Schlüssel           | Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein. |
      | unerreichbarer Adresse       | Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.                     |
      | einem Modell ohne Bilder     | Das Modell liest keine Bilder. Wählen Sie ein Modell, das Bilder liest; sonst kann Dwello hochgeladene Rechnungen nicht auslesen. |

  # Setzt der Betreiber die KI mit Umgebungsvariablen (wie auf der Demo), gilt seine Einstellung
  Szenario: Die vom Betreiber festgelegte KI
    Wenn der Liegenschaftsverwalter die KI öffnet
    Dann sagt die KI "Vom Betreiber festgelegt. Diese Einstellung lässt sich hier nicht ändern; wenden Sie sich an den Betreiber."
    Und zeigt die KI die Adresse "http://127.0.0.1:2527/v1"
    Und kann der Liegenschaftsverwalter die KI nicht speichern
