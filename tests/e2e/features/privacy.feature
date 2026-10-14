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

  Szenario: KI-Kategorisierung auf dem Server des Betreibers
    Dann erfährt der Liegenschaftsverwalter unter "Weitergabe an Dritte", dass Rechnungsdaten für die KI-Kategorisierung den Server nicht verlassen

  Szenario: Ungespeicherte Eingaben bleiben als Entwurf im Browser
    Dann erfährt der Liegenschaftsverwalter unter "Welche Daten Dwello speichert", dass ungespeicherte Eingaben bis zum Speichern, Verwerfen oder Abmelden als Entwurf in diesem Browser bleiben

  Szenario: Anmeldung nur über die eingerichteten Anbieter
    Dann nennt die Datenschutzerklärung unter "Anmeldung" "Google"
    Und nennt die Datenschutzerklärung unter "Anmeldung" nicht "Microsoft"

  Szenario: Dienste Dritter, die der Browser aufruft
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "CARTO"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "OpenPLZ"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Google Maps"
    Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" nicht "Google Fonts"

  Szenario: Alle Cookies, die Dwello setzt
    Dann nennt die Datenschutzerklärung unter "Cookies" "dwello_session"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_xsrf"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_oauth_state"
    Und nennt die Datenschutzerklärung unter "Cookies" "dwello_login"
    Und nennt die Datenschutzerklärung unter "Cookies" "PARAGLIDE_LOCALE"
