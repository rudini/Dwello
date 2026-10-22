# language: de
@wip
Funktionalität: KI in den Einstellungen wählen
  Als Liegenschaftsverwalter
  möchte ich im Browser wählen, welche KI meine Rechnungen liest
  damit ich dafür keine Einstellungsdatei bearbeiten und Dwello nicht neu starten muss

  # #580: auf der eingerichteten frischen Installation, deren Betreiber die KI nicht festgelegt hat; die KI-Ersatzattrappe
  # steht für den Anbieter (backend/scripts/llm-stub.ts). Der Anbieter ist hier ein Name, nicht die Adresse: die
  # Datenschutzerklärung nennt, wer die Rechnungen erhält, auch wenn die Adresse im eigenen Netz liegt.

  Szenario: Von den Einstellungen zur KI
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter der frischen Installation in den Einstellungen die KI öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "KI"

  Szenario: Einen Anbieter der KI wählen
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter den Anbieter "Muster KI AG" in "Deutschland" mit geprüftem Datenschutz speichert
    Dann sieht der Liegenschaftsverwalter auf der Seite "KI" die Meldung "Die KI-Einstellung ist gespeichert. Die nächste Rechnung verwendet sie."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Muster KI AG (Deutschland)"

  # Fachreview 580 F-4: wer wann welche Rechnungen erhielt, bleibt für die Auskunft nach Art. 25 DSG nachvollziehbar
  Szenario: Der Wechsel der KI steht im Protokoll
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter den Anbieter "Muster KI AG" in "Deutschland" mit geprüftem Datenschutz speichert
    Und der Liegenschaftsverwalter das Protokoll der frischen Installation öffnet
    Dann nennt das Protokoll mit heutigem Datum "KI gewählt: Muster KI AG (Deutschland)"

  Szenario: Der API-Schlüssel bleibt nach dem Speichern auf dem Server
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter die KI der frischen Installation öffnet
    Dann ist das Feld für den API-Schlüssel leer
    Und sagt die Seite "KI" "Ein API-Schlüssel ist gespeichert. Lassen Sie das Feld leer, um ihn zu behalten."

  Szenario: Keine KI wählen
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter "Keine KI" speichert
    Und der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Rechnungen und Kategorien werden nicht von einer KI bearbeitet."
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Muster KI AG"

  Szenario: Zur lokalen KI zurückkehren
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Und das KI-Modell ist zu 40 % geladen
    Wenn der Liegenschaftsverwalter "Lokale KI" speichert
    Dann sagt die Seite "KI" "Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Die KI läuft auf dem Server des Betreibers"

  # Fachreview 580 F-5: auf der leeren Installation des Stacks scheitert der Download; die Seite sagt, was zu tun ist
  Szenario: Die Seite KI sagt, wenn das KI-Modell nicht geladen werden konnte
    Wenn der Liegenschaftsverwalter die KI einer Installation öffnet, deren KI-Modell nicht geladen werden konnte
    Dann sagt die Seite "KI" "Das KI-Modell konnte nicht geladen werden. Prüfen Sie, ob der Server das Internet erreicht und rund 6 GB Speicherplatz frei hat, und laden Sie es erneut herunter. Betreibt jemand anderes Dwello, wenden Sie sich an den Betreiber."
    Und kann der Liegenschaftsverwalter das KI-Modell erneut herunterladen

  # Fachreview 580-2 F-5: der Liegenschaftsverwalter startet den Download selbst und sieht, wie weit er ist
  Szenario: Das KI-Modell erneut herunterladen
    Angenommen Dwello ist eingerichtet
    Und das Herunterladen des KI-Modells ist gescheitert
    Und das KI-Modell ist zu 40 % geladen
    Wenn der Liegenschaftsverwalter auf der Seite "KI" das KI-Modell erneut herunterlädt
    Dann sagt die Seite "KI" "Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand."

  # Auf einer Installation ohne lokale KI (Installationsanleitung, Abschnitt 6) antwortet niemand
  Szenario: Die lokale KI antwortet nicht
    Angenommen Dwello ist eingerichtet
    Und die lokale KI antwortet nicht
    Wenn der Liegenschaftsverwalter "Lokale KI" speichert
    Dann sagt die Seite "KI" "Die lokale KI antwortet nicht. Läuft Dwello mit Docker, startet der Betreiber sie mit der Installationsanleitung; sonst wählen Sie einen Anbieter oder keine KI."

  # Ohne Bestätigung, Anbieter oder Land nennt die Datenschutzerklärung nicht, wer die Rechnungen erhält (Art. 19 DSG)
  Szenariogrundriss: Ein Anbieter ohne <Angabe> wird nicht gespeichert
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter einen Anbieter der KI ohne <Angabe> speichert
    Dann sieht der Liegenschaftsverwalter auf der Seite "KI" den Fehler "<Fehler>"
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Muster KI AG"

    Beispiele:
      | Angabe              | Fehler                                                                                                  |
      | Bestätigung         | Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.                                 |
      | Namen des Anbieters | Geben Sie den Namen des Anbieters an. Die Datenschutzerklärung nennt ihn.                               |
      | Land                | Geben Sie das Land an, in dem der Anbieter die Daten bearbeitet. Die Datenschutzerklärung nennt es.     |
      | Adresse             | Geben Sie die Adresse der KI an, die Ihnen der Anbieter nennt, zum Beispiel https://api.anbieter.ch/v1. |
      | Modell              | Geben Sie das Modell an. Wählen Sie eines, das Bilder liest.                                            |

  # Fachreview 580 F-2: die drei Punkte gelten für einen bestimmten Anbieter; jedes Speichern verlangt sie neu
  Szenario: Ein geänderter Anbieter braucht die Bestätigung erneut
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter den Anbieter "Andere KI AG" in "Frankreich" ohne Bestätigung speichert
    Dann sieht der Liegenschaftsverwalter auf der Seite "KI" den Fehler "Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Muster KI AG (Deutschland)"

  # Fachreview 580 F-13: der gespeicherte Schlüssel geht nie an eine andere Adresse
  Szenario: Eine neue Adresse braucht den API-Schlüssel erneut
    Angenommen Dwello ist eingerichtet
    Und der Anbieter "Muster KI AG" in "Deutschland" ist gespeichert
    Wenn der Liegenschaftsverwalter für den Anbieter eine neue Adresse ohne API-Schlüssel speichert
    Dann sieht der Liegenschaftsverwalter auf der Seite "KI" den Fehler "Geben Sie den API-Schlüssel erneut ein. Dwello schickt den gespeicherten Schlüssel nicht an eine andere Adresse."

  # Fachreview 580 F-3: die Prüfung schickt nur ein festes Testbild und einen festen Text, nie erfasste Daten
  Szenariogrundriss: Die Verbindung zur KI prüfen
    Angenommen Dwello ist eingerichtet
    Wenn der Liegenschaftsverwalter die Verbindung zu einem Anbieter mit <Fall> prüft
    Dann sagt die Prüfung der Verbindung "<Ergebnis>"

    Beispiele:
      | Fall                     | Ergebnis                                                                                                                          |
      | gültigem Schlüssel       | Die Verbindung steht, und das Modell liest Rechnungsbilder.                                                                       |
      | falschem Schlüssel       | Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.      |
      | unerreichbarer Adresse   | Unter dieser Adresse antwortet keine KI. Prüfen Sie die Adresse und ob der Server das Internet erreicht.                          |
      | einem Modell ohne Bilder | Das Modell liest keine Bilder. Wählen Sie ein Modell, das Bilder liest; sonst kann Dwello hochgeladene Rechnungen nicht auslesen. |

  # Setzt der Betreiber eine der Variablen LLM_BASE_URL, LLM_API_KEY, LLM_MODEL, LLM_PROVIDER, LLM_PROVIDER_COUNTRY oder
  # LLM_ENABLED (wie auf der Demo und im Stack), gilt seine Einstellung; die Seite zeigt sie ohne den Schlüssel
  Szenario: Die vom Betreiber festgelegte KI
    Wenn der Liegenschaftsverwalter die KI öffnet
    Dann sagt die Seite "KI" "Vom Betreiber in der Einstellungsdatei festgelegt. Betreiben Sie Dwello selbst, ändern Sie die KI dort; sonst wenden Sie sich an den Betreiber."
    Und zeigt die Seite "KI" die Adresse "http://127.0.0.1:2527/v1"
    Und kann der Liegenschaftsverwalter die KI nicht speichern
