# language: de
@einrichtung
Funktionalität: Dwello aktualisieren
  Als Liegenschaftsverwalter
  möchte ich erfahren, dass es eine neue Version von Dwello gibt, und sie selbst einspielen
  damit meine Installation ohne technische Hilfe aktuell bleibt

  # Nicht hier (#1453, No scenario): dass danach die neue Version läuft (eine Version, die der E2E-Build nicht hat:
  # backend/src/__tests__/updater.test.ts), die Variante ohne Update-Dienst und die feste Version (der Start des Backends:
  # backend/src/__tests__/update.pg.test.ts) und der Satz nach 15 Minuten (die Uhr des Browsers: ein DOM-Test).
  # #1453: die frische Installation des Stacks fragt einen Stand-in nach der neuesten Version und lässt ihn das Update
  # ausführen (backend/scripts/update-stub.ts); ihr Frontend hat die Version 1.4.0 (playwright.config.ts)

  Szenario: Nach der Anmeldung erfährt der Liegenschaftsverwalter von einer neuen Version
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann sagt der Hinweis zur neuen Version "Dwello 1.5.0 ist verfügbar (Sie haben 1.4.0). Das Update dauert einige Minuten; Ihre Daten bleiben erhalten."
    Und führt «Was ist neu?» zu den Versionshinweisen von Dwello 1.5.0

  Szenario: Ohne neue Version meldet Dwello nichts
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"
    Und meldet Dwello keine neue Version

  Szenario: «Später» blendet den Hinweis bis zur nächsten Anmeldung aus
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und der Liegenschaftsverwalter hat die Übersicht der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update auf später verschiebt
    Und der Liegenschaftsverwalter die Mieter der frischen Installation öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Mieter"
    Und meldet Dwello keine neue Version
    Wenn der Liegenschaftsverwalter sich bei der frischen Installation wieder anmeldet
    Dann sagt der Hinweis zur neuen Version "Dwello 1.5.0 ist verfügbar (Sie haben 1.4.0)."

  Szenario: Vor dem Update warnt Dwello, dass ungespeicherte Eingaben verloren gehen
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update starten will
    Dann fragt Dwello vor dem Update "Eingaben auf dieser Seite, die Sie noch nicht gespeichert haben, gehen verloren."

  Szenario: Das Update zeigt seinen Schritt und führt zurück auf die Seite, auf der es begann
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update bestätigt
    Dann zeigt das Update den Schritt "Herunterladen"
    Und ist der Liegenschaftsverwalter nach dem Update wieder auf der Seite "Mieter"

  Szenario: Wer das Update abbricht, bleibt auf der Seite
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update starten will, es aber abbricht
    Dann ist der Liegenschaftsverwalter auf der Seite "Mieter"
    Und sagt der Hinweis zur neuen Version "Dwello 1.5.0 ist verfügbar (Sie haben 1.4.0)."
    Und läuft kein Update

  Szenario: Ohne eingerichtete Sicherung startet kein Update
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und Dwello 1.5.0 ist erschienen
    Wenn der Liegenschaftsverwalter die Sicherung der frischen Installation öffnet
    Dann sagt der Hinweis zur neuen Version "Vor dem Update sichert Dwello Ihre Daten. Dafür muss die Sicherung eingerichtet sein."
    Und kann der Liegenschaftsverwalter das Update nicht starten

  Szenario: Der Hinweis ohne Sicherung führt zur Sicherung
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und Dwello 1.5.0 ist erschienen
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter dem Hinweis zur Sicherung folgt
    Dann steht der Liegenschaftsverwalter beim Wiederherstellungscode

  Szenario: Ein fehlgeschlagenes Update lässt die bisherige Version laufen
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und das Update auf Dwello 1.5.0 wird fehlschlagen
    Und der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update bestätigt
    Dann meldet das Update "Das Update hat nicht geklappt. Dwello läuft weiter in Version 1.4.0."

  Szenario: Hat das fehlgeschlagene Update die Datenbank schon geändert, braucht es die Wiederherstellung
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Und das Update auf Dwello 1.5.0 wird fehlschlagen, nachdem es die Datenbank geändert hat
    Und der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet
    Wenn der Liegenschaftsverwalter das Update bestätigt
    Dann meldet das Update "Die neue Version hatte die Datenbank schon geändert, darum kann die bisherige Version nicht mehr starten."

  Szenario: Ohne die tägliche Suche nach neuen Versionen meldet Dwello keine
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und Dwello 1.5.0 ist erschienen
    Wenn der Liegenschaftsverwalter in den Einstellungen der frischen Installation die Suche nach neuen Versionen ausschaltet
    Und der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"
    Und meldet Dwello keine neue Version
