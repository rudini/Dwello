# language: de
@einrichtung
Funktionalität: Einrichtung beim ersten Aufruf
  Als Liegenschaftsverwalter
  möchte ich Dwello nach der Installation im Browser einrichten
  damit ich keine Einstellungsdatei bearbeiten und keinen Schlüssel eintippen muss

  # #577: auf einer frischen Installation (ohne Konto mit Passwort, ohne Anbieter wie Google). Der Einrichtungscode
  # steht im Protokoll des Servers, damit niemand sonst, der den Server zuerst erreicht, das Konto anlegt.

  Szenario: Der erste Aufruf führt zur Einrichtung
    Angenommen Dwello ist frisch installiert
    Wenn ein Besucher Dwello öffnet
    Dann ist der Besucher auf der Seite "Dwello einrichten"

  Szenario: Dwello mit dem Einrichtungscode einrichten
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt
    Und der Besucher richtet die Sicherung ein
    Dann ist der Besucher auf der Seite "Übersicht"
    Und zeigt die Kopfzeile die E-Mail-Adresse des neuen Kontos

  Szenario: Einrichtung mit falschem Einrichtungscode
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit einem falschen Einrichtungscode ein Konto mit Passwort anlegt
    Dann sieht der Besucher in der Einrichtung den Hinweis "Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers mit dem Befehl docker logs dwello-backend; es gilt der zuletzt angezeigte Code. Geben Sie ihn erneut ein."
    # Persona Sven 577 P-1: nach einem falschen Code ist nur der Code neu einzugeben
    Und stehen in der Einrichtung die Passwörter noch da

  # Fachreview 577 V-4: die Fehlzustände der Einrichtung
  Szenario: Einrichtung mit zwei verschiedenen Passwörtern
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher das Passwort bei der Einrichtung zweimal verschieden eingibt
    Dann sieht der Besucher in der Einrichtung den Hinweis "Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein."

  Szenario: Einrichtung mit einem zu kurzen Passwort
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher bei der Einrichtung das Passwort "kurz" wählt
    Dann sieht der Besucher in der Einrichtung den Hinweis "Das Passwort ist zu kurz. Wählen Sie eines mit mindestens 8 Zeichen, am besten ein langes, das Sie sonst nirgends verwenden."

  Szenario: Nach der Einrichtung führt Dwello zur Anmeldung
    Angenommen Dwello ist eingerichtet
    Wenn ein Besucher Dwello öffnet
    Dann ist der Besucher auf der Seite "Anmelden"

  Szenario: Die Einrichtung lässt sich nur einmal öffnen
    Angenommen Dwello ist eingerichtet
    Wenn ein Besucher die Einrichtung öffnet
    Dann ist der Besucher auf der Seite "Anmelden"

  Szenario: Von der Einrichtung zur Datenschutzerklärung
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher in der Einrichtung die Datenschutzerklärung öffnet
    Dann ist der Besucher auf der Seite "Datenschutz"

  # Fachreview 577 R-1: wer das Konto anlegt, liest vorher, was mit E-Mail-Adresse und Passwort geschieht (Art. 19 DSG)
  Szenario: Die Datenschutzerklärung erklärt bei der Einrichtung das Konto mit Passwort
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher in der Einrichtung die Datenschutzerklärung öffnet
    Dann nennt die Datenschutzerklärung unter "Anmeldung" "das Konto legen Sie bei der Einrichtung von Dwello an"

  Szenario: Von der Einrichtung zu den Nutzungsbedingungen
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher in der Einrichtung die Nutzungsbedingungen öffnet
    Dann ist der Besucher auf der Seite "Nutzungsbedingungen"

  # Das KI-Modell lädt nach dem ersten Start im Hintergrund (rund 6 GB); bis dahin erfasst der Liegenschaftsverwalter Rechnungen von Hand
  Szenario: Die Übersicht zeigt, wie weit das KI-Modell geladen ist
    Angenommen Dwello ist eingerichtet
    Und das KI-Modell ist zu 40 % geladen
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann zeigt die Übersicht den Hinweis "Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand."

  # Codereview 577 C-3: auf der leeren Installation des Stacks scheitert der Download
  Szenario: Die Übersicht sagt, wenn das KI-Modell nicht geladen werden konnte
    Wenn der Liegenschaftsverwalter die Übersicht einer Installation öffnet, deren KI-Modell nicht geladen werden konnte
    Dann zeigt die Übersicht den Hinweis "Das KI-Modell konnte nicht geladen werden. Erfassen Sie Rechnungen von Hand. Dwello versucht es erneut, wenn der Betreiber Dwello neu startet; betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung."

  # #620: bei der Einrichtung nur «Lokale KI» oder «Später entscheiden»; einen Anbieter wählt der Liegenschaftsverwalter
  # danach unter «Einstellungen» › «KI»
  Szenario: Bei der Einrichtung die KI auf später verschieben
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt und die KI später wählt
    Und der Besucher richtet die Sicherung ein
    Dann zeigt die Übersicht nach der Einrichtung den Hinweis "Es ist «Keine KI» gewählt. Sie erfassen Rechnungen von Hand. Eine KI wählen Sie unter «Einstellungen» › «KI»."
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Rechnungen und Kategorien werden nicht von einer KI bearbeitet."

  Szenario: Bei der Einrichtung die lokale KI wählen
    Angenommen Dwello ist frisch installiert
    Und das KI-Modell ist zu 40 % geladen
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt und die lokale KI wählt
    Und der Besucher richtet die Sicherung ein
    Dann zeigt die Übersicht nach der Einrichtung den Hinweis "Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand."

  Szenario: Von der Übersicht zur KI
    Angenommen Dwello ist eingerichtet
    Und in der frischen Installation ist keine KI gewählt
    Wenn der Liegenschaftsverwalter in der Übersicht der frischen Installation die KI öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "KI"
