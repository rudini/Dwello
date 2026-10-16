# language: de
@authentication
Funktionalität: Anmeldung
  Als Liegenschaftsverwalter
  möchte ich mich mit meinem Google- oder Microsoft-Konto anmelden
  damit nur ich die Daten meiner Liegenschaften sehe

  Szenario: Anmeldeseite bietet die eingerichteten Anbieter an
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann kann sich der Besucher mit "Google" anmelden
    Aber nicht mit "Microsoft"

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

  @wip
  Szenario: Anmeldung ohne dauerhaften Zugriff auf das Google-Konto
    Angenommen ein Besucher hat die überfälligen Abrechnungen aufgerufen
    Wenn der Besucher sich mit "Google" anmeldet
    Dann bittet Dwello Google nicht um dauerhaften Zugriff auf das Konto
