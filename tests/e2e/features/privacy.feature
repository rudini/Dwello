# language: de
@legal
Funktionalität: Datenschutz
  Als Liegenschaftsverwalter
  möchte ich wissen, welche Daten Dwello speichert und an wen sie gehen
  damit ich meine Mieter korrekt über die Bearbeitung ihrer Daten informieren kann

  Grundlage:
    Angenommen der Liegenschaftsverwalter liest die Datenschutzerklärung

  Szenariogrundriss: Auskunft zur Datenbearbeitung
    Dann sieht der Liegenschaftsverwalter den Abschnitt "<Abschnitt>"

    Beispiele:
      | Abschnitt                   |
      | Welche Daten Dwello speichert |
      | Anmeldung                   |
      | Weitergabe an Dritte        |
      | Cookies                     |

  Szenario: KI auf dem Server des Betreibers
    Dann erfährt der Liegenschaftsverwalter unter "Weitergabe an Dritte", dass Rechnungen und neue Kategorien für die KI den Server nicht verlassen

  Szenario: Ungespeicherte Eingaben bleiben als Entwurf im Browser
    Dann erfährt der Liegenschaftsverwalter unter "Welche Daten Dwello speichert", dass ungespeicherte Eingaben bis zum Speichern, Verwerfen oder Abmelden als Entwurf in diesem Browser bleiben

  Szenario: Hochgeladene Dokumente der Mieter
    Dann erfährt der Liegenschaftsverwalter unter "Welche Daten Dwello speichert", dass Dwello die zu Mietern hochgeladenen Dokumente speichert

  Szenario: Anmeldungen im Protokoll des Servers
    Dann erfährt der Liegenschaftsverwalter unter "Anmeldung", dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird

  # Protokoll unter den Einstellungen (#357, Fachprüfung R-1, R-2): Zweck, Inhalt und Aufbewahrung, getrennt vom Protokoll des Servers
  Szenario: Anmeldungen und Änderungen im Protokoll unter den Einstellungen
    Dann nennt die Datenschutzerklärung unter "Welche Daten Dwello speichert" "jede Anmeldung mit dem gewählten Anbieter (ohne Name und E-Mail-Adresse)"
    Und nennt die Datenschutzerklärung unter "Welche Daten Dwello speichert" "Die Einträge bleiben, auch wenn Sie die Rechnung löschen, bis Sie sie im Protokoll löschen."

  Szenario: Anmeldung nur über die eingerichteten Anbieter
    Dann nennt die Datenschutzerklärung unter "Anmeldung" "Google"
    Und nennt die Datenschutzerklärung unter "Anmeldung" nicht "Microsoft"

  Szenario: Dienste Dritter, die der Browser aufruft
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "CARTO"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "OpenPLZ"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Google Maps"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Google Fonts"

  Szenario: Alle Cookies, die Dwello setzt
    Dann nennt die Datenschutzerklärung unter "Cookies" "dwello_session"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_xsrf"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_oauth_state"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_login"
    Und nennt die Datenschutzerklärung unter "Cookies" "PARAGLIDE_LOCALE"

  Szenario: Die Datenschutzerklärung spricht wie Dwello von der KI
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "KI"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Sprachmodell"
