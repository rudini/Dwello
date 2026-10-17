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
      | Verantwortlich              |
      | Welche Daten Dwello speichert |
      | Aufbewahrung                |
      | Anmeldung                   |
      | Weitergabe an Dritte        |
      | Cookies                     |

  Szenario: KI auf dem Server des Betreibers
    Dann erfährt der Liegenschaftsverwalter unter "Weitergabe an Dritte", dass Rechnungen und neue Kategorien für die KI den Server nicht verlassen

  @wip
  Szenario: Ungespeicherte Angaben bleiben nur im Browser
    Dann erfährt der Liegenschaftsverwalter unter "Welche Daten Dwello speichert", dass ungespeicherte Angaben bis zum Speichern, Verwerfen oder Abmelden nur in diesem Browser bleiben

  Szenario: Hochgeladene Dokumente der Mieter
    Dann erfährt der Liegenschaftsverwalter unter "Welche Daten Dwello speichert", dass Dwello die zu Mietern hochgeladenen Dokumente speichert

  Szenario: Anmeldungen im Protokoll des Servers
    Dann erfährt der Liegenschaftsverwalter unter "Anmeldung", dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird

  # Protokoll unter den Einstellungen (#357, Fachprüfung R-1, R-2): Zweck, Inhalt und Aufbewahrung, getrennt vom Protokoll des Servers
  Szenario: Anmeldungen und Änderungen im Protokoll unter den Einstellungen
    Dann nennt die Datenschutzerklärung unter "Welche Daten Dwello speichert" "jede Anmeldung mit dem gewählten Anbieter (ohne Namen und E-Mail-Adresse)"
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

  Szenario: Der Betreiber ist verantwortlich
    Dann nennt die Datenschutzerklärung unter "Verantwortlich" "Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich"
    Und nennt die Datenschutzerklärung unter "Verantwortlich" "betrieb@muster-hosting.ch"
    Und erklärt die Datenschutzerklärung unter "Verantwortlich", wer der Betreiber ist

  Szenario: Auskunft über die eigenen Daten
    Dann erfährt der Liegenschaftsverwalter unter "Verantwortlich", dass jede Person beim Betreiber Auskunft über ihre Daten verlangen kann

  Szenario: Wie lange Dwello Daten aufbewahrt
    Dann erfährt der Liegenschaftsverwalter unter "Aufbewahrung", dass Dwello nichts von selbst löscht und wer zur Buchführung verpflichtet ist, Geschäftsbücher und Buchungsbelege 10 Jahre aufbewahrt

  Szenario: Was Google bei der Anmeldung erfährt
    Dann nennt die Datenschutzerklärung unter "Anmeldung" "Google" in "USA" mit seiner Datenschutzerklärung "https://policies.google.com/privacy"
    Und erfährt der Liegenschaftsverwalter unter "Anmeldung", dass Google erfährt, wann und von welcher IP-Adresse diese Installation genutzt wird

  Szenario: Dwello übernimmt kein Profilbild
    Dann nennt die Datenschutzerklärung unter "Anmeldung" "E-Mail-Adresse"
    Und nennt die Datenschutzerklärung unter "Anmeldung" nicht "Profilbild"

  Szenario: Wozu das Protokoll des Servers dient
    Dann erfährt der Liegenschaftsverwalter unter "Anmeldung", dass nur der Betreiber das Protokoll des Servers zur Sicherheit und Fehlersuche liest und selbst bestimmt, wie lange es aufbewahrt wird

  Szenario: E-Mails über den Mailserver, den der Betreiber eingerichtet hat
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "über den Mailserver zugestellt, den der Betreiber eingerichtet hat"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Resend"

  Szenario: Länder und Datenschutzerklärungen der Dienste, die der Browser aufruft
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "OpenPLZ" in "Deutschland" mit seiner Datenschutzerklärung "https://legal.stueber.de/privacy.php"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Google Maps" in "USA" mit seiner Datenschutzerklärung "https://policies.google.com/privacy"

  Szenario: Wie lange die Anmeldung gilt
    Dann erfährt der Liegenschaftsverwalter unter "Cookies", dass "dwello_session" und "dwello_xsrf" 7 Tage gelten

  Szenario: Cookies im Browser ablehnen
    Dann erfährt der Liegenschaftsverwalter unter "Cookies", dass er Cookies im Browser ablehnen kann, sich dann aber nicht anmelden kann
