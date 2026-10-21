# language: de
@einrichtung @wip
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
    Dann ist der Besucher auf der Seite "Übersicht"
    Und zeigt die Kopfzeile die E-Mail-Adresse des neuen Kontos

  Szenario: Einrichtung mit falschem Einrichtungscode
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit einem falschen Einrichtungscode ein Konto mit Passwort anlegt
    Dann sieht der Besucher in der Einrichtung den Hinweis "Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers (docker logs dwello-backend). Geben Sie ihn erneut ein."

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
    Dann ist der Besucher auf der Seite "Datenschutzerklärung"

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
    Dann zeigt die Übersicht den Hinweis "Das KI-Modell wird geladen: 40 %"
    Und sagt der Hinweis, dass der Liegenschaftsverwalter Rechnungen bis dahin von Hand erfasst
