# language: de
@legal
Funktionalität: Nutzungsbedingungen
  Als Liegenschaftsverwalter
  möchte ich die Bedingungen für die Nutzung von Dwello kennen
  damit ich weiss, wofür ich selbst verantwortlich bin

  Grundlage:
    Angenommen der Liegenschaftsverwalter liest die Nutzungsbedingungen

  Szenariogrundriss: Bedingungen nachlesen
    Dann sieht der Liegenschaftsverwalter den Abschnitt "<Abschnitt>"

    Beispiele:
      | Abschnitt                     |
      | Zweck                         |
      | Verantwortung für Abrechnungen |
      | Verfügbarkeit                 |

  Szenario: Betreiber der Installation
    Dann erfährt der Liegenschaftsverwalter unter "Verfügbarkeit", dass "Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich" die Installation betreibt und unter "betrieb@muster-hosting.ch" erreichbar ist

  # #458 (#347): der Vermieter, der Dwello selbst betreibt, hat keinen Vertragspartner
  Szenario: Die Hinweise ersetzen keinen Vertrag
    Dann nennen die Nutzungsbedingungen unter "Zweck" "Diese Hinweise ersetzen keinen Vertrag. Betreibt ein Anbieter Dwello für Sie, gelten die Vereinbarungen mit ihm."
    # Persona Dr. Weber 458 P-5, Fachprüfung 458-2 D (Art. 9 DSG)
    Und nennen die Nutzungsbedingungen unter "Zweck" "Schliessen Sie mit einem solchen Anbieter eine Vereinbarung über die Auftragsbearbeitung ab"

  Szenario: Hilfe zum Informieren der Mieter
    Dann nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "Sie können Ihren Mietern dazu die Abschnitte «Verantwortlich», «Welche Daten Dwello speichert», «Aufbewahrung» und «Weitergabe an Dritte» der Datenschutzerklärung weitergeben."
    Und nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "Nennen Sie dabei Ihren Namen und wie Ihre Mieter Sie erreichen, und sagen Sie dazu, dass mit «Sie» dort der Vermieter gemeint ist (Art. 19 Abs. 2 DSG)."
    # Persona Helga 458 P-1 und Dr. Weber 458 P-3, Fachprüfung 458-2 B und C: wann und wie, und der Export
    Und nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "Geben Sie diese Angaben Ihren Mietern, wenn Sie ihre Daten erhalten, meist beim Abschluss des Mietvertrags, auf Papier oder per E-Mail."
    Und nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "laden Sie sie auf seiner Seite mit «Daten exportieren» herunter"

  # Persona Helga 458 P-1: jeder weiterzugebende Abschnitt ist einen Link entfernt
  Szenario: Von den Nutzungsbedingungen zu einem Abschnitt der Datenschutzerklärung
    Wenn der Liegenschaftsverwalter in den Nutzungsbedingungen den Abschnitt "Verantwortlich" der Datenschutzerklärung wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Datenschutz"

  Szenario: Stand der Nutzungsbedingungen
    Dann nennt die Seite den Stand "20. Oktober 2026"
