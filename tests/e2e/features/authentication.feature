# language: de
@authentication
Funktionalität: Anmeldung
  Als Liegenschaftsverwalter
  möchte ich mich mit meinem Konto mit Passwort oder meinem Google-Konto anmelden
  damit nur ich die Daten meiner Liegenschaften sehe

  Szenario: Anmeldeseite bietet die eingerichteten Anbieter an
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann kann sich der Besucher mit "Google" anmelden
    Aber nicht mit "Microsoft"

  # #458 (#347): wer Dwello selbst betreibt, hat keinen Vertragspartner, dem er etwas akzeptieren könnte
  Szenario: Die Anmeldeseite verlangt keine Zustimmung zu den Nutzungsbedingungen
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann liest der Besucher unter den Anbietern "Was Dwello leistet und wofür Sie verantwortlich sind, steht in den Nutzungsbedingungen."
    Und liest der Besucher unter den Anbietern nicht "akzeptieren"

  Szenario: Ohne Anmeldung keine Daten
    Wenn ein Besucher die überfälligen Abrechnungen aufruft
    Dann ist der Besucher auf der Seite "Anmelden"

  Szenario: Anmeldung mit Google beginnen
    Angenommen ein Besucher hat die überfälligen Abrechnungen aufgerufen
    Wenn der Besucher sich mit "Google" anmeldet
    Dann leitet Dwello den Besucher zur Anmeldung bei Google weiter

  Szenario: Anmeldung bei Google abgebrochen
    Wenn Google den Besucher nach einer abgebrochenen Anmeldung zurückschickt
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher den Hinweis "Die Anmeldung wurde abgebrochen."

  Szenario: Abgelaufene Sitzung
    Angenommen die Sitzung des Liegenschaftsverwalters ist abgelaufen
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Anmelden"

  Szenario: Sitzung eines Kontos ohne Zugang
    Angenommen ein Besucher hat eine Sitzung mit einem Konto ohne Zugang zu Dwello
    Wenn der Besucher die Übersicht öffnet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher den Hinweis "Dieses Konto hat keinen Zugang zu Dwello. Melden Sie sich mit dem Konto an, das für Dwello eingerichtet ist."

  Szenario: Angemeldet mit eigenem Namen
    Wenn der Liegenschaftsverwalter die Übersicht öffnet
    Dann sieht der Liegenschaftsverwalter seinen Namen "Vera Verwalter" in der Kopfzeile

  Szenario: Angemeldete brauchen die Anmeldeseite nicht
    Wenn der Liegenschaftsverwalter die Anmeldeseite öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"

  Szenario: Abmelden
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter sich abmeldet
    Dann ist der Liegenschaftsverwalter auf der Seite "Anmelden"
    Und führt die Übersicht den Liegenschaftsverwalter wieder zur Anmeldung

  Szenario: Anmeldung ohne dauerhaften Zugriff auf das Google-Konto
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher sich mit "Google" anmeldet
    Dann bittet Dwello Google nicht um dauerhaften Zugriff auf das Konto

  # Helga 51 P-1: wer mit dem falschen Google-Konto angemeldet ist, kommt sonst immer wieder zur gleichen Meldung
  Szenario: Bei Google das Konto wählen
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher sich mit "Google" anmeldet
    Dann lässt Dwello den Besucher bei Google das Konto wählen

  # #576: ein Konto mit Passwort (E-Mail-Adresse und Passwort), ohne Google
  Szenario: Anmeldeseite bietet Passwort und Google an
    Angenommen ein Konto mit Passwort ist eingerichtet
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann kann sich der Besucher mit E-Mail-Adresse und Passwort anmelden
    Und kann sich der Besucher mit "Google" anmelden

  Szenario: Anmeldung mit Passwort
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher sich mit der E-Mail-Adresse und dem Passwort des Kontos anmeldet
    Dann ist der Besucher auf der Seite "Übersicht"

  Szenario: Anmeldung mit falschem Passwort
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher sich mit der E-Mail-Adresse des Kontos und einem falschen Passwort anmeldet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher den Hinweis "E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut."
    # Persona Helga 576 P-1: die Meldung ist im Blick und wird vorgelesen; das falsche Passwort steht nicht mehr im Feld
    Und steht der Fokus auf dem Hinweis
    Und ist das Feld "Passwort" leer

  # Personas Marco und Sven 576 P-1: leere Felder sind kein Fehler beim Prüfen
  Szenario: Anmeldung mit Passwort ohne Eingabe
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher sich ohne E-Mail-Adresse und Passwort anmeldet
    Dann sieht der Besucher den Hinweis "E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut."

  # 5 Fehlversuche sperren die Anmeldung für 15 Minuten; der Befehl im Container hebt die Sperre auf
  Szenario: Nach fünf Fehlversuchen ist die Anmeldung gesperrt
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und der Besucher hat sich fünfmal mit einem falschen Passwort angemeldet
    Wenn der Besucher sich mit der E-Mail-Adresse und dem Passwort des Kontos anmeldet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher einen Hinweis, der mit "Nach mehreren Fehlversuchen ist die Anmeldung gesperrt bis" beginnt

  # fach-review 576 V-1: ein Fehler beim Prüfen zählt nicht als Fehlversuch und meldet kein falsches Passwort
  Szenario: Anmeldung mit Passwort fehlgeschlagen
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und ein Besucher hat die Anmeldeseite geöffnet
    Und die Anmeldung mit Passwort schlägt fehl
    Wenn der Besucher sich mit der E-Mail-Adresse und dem Passwort des Kontos anmeldet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher den Hinweis "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut."

  Szenario: Abmelden nach der Anmeldung mit Passwort
    Angenommen ein Konto mit Passwort ist eingerichtet
    Und ein Besucher hat die Anmeldeseite geöffnet
    Und der Besucher hat sich mit der E-Mail-Adresse und dem Passwort des Kontos angemeldet
    Wenn der Besucher sich abmeldet
    Dann ist der Besucher auf der Seite "Anmelden"
