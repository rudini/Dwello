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

  Szenario: Hilfe zum Informieren der Mieter
    Dann nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "Sie können Ihren Mietern dazu die Abschnitte «Verantwortlich», «Welche Daten Dwello speichert», «Aufbewahrung» und «Weitergabe an Dritte» der Datenschutzerklärung weitergeben."
    Und nennen die Nutzungsbedingungen unter "Verantwortung für Abrechnungen" "Nennen Sie dabei Ihren Namen und wie Ihre Mieter Sie erreichen, und sagen Sie dazu, dass mit «Sie» dort der Vermieter gemeint ist (Art. 19 Abs. 2 DSG)."

  Szenario: Stand der Nutzungsbedingungen
    Dann nennt die Seite den Stand "19. Oktober 2026"
