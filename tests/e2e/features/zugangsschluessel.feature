# language: de
Funktionalität: Zugangsschlüssel für KI-Programme
  Als Liegenschaftsverwalter
  möchte ich einem KI-Programm meiner Wahl Lesezugriff auf meine Daten geben
  damit es mir Fragen zu meinen Liegenschaften beantworten kann

  # #817: ein Schlüssel läuft nach 90 Tagen ab; dass ein abgelaufener Schlüssel abgelehnt wird und ins Protokoll kommt,
  # prüft access-key.pg.test.ts, denn ein Szenario kann keinen Schlüssel 90 Tage altern lassen.
  @wip
  Szenario: Zugangsschlüssel öffnen
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen
    Wenn der Liegenschaftsverwalter die Zugangsschlüssel für KI-Programme öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Zugangsschlüssel für KI-Programme"

  @wip
  Szenario: Zugangsschlüssel erstellen und nur einmal sehen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Zugangsschlüssel für KI-Programme"
    Wenn der Liegenschaftsverwalter den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Dann zeigt Dwello den neuen Zugangsschlüssel mit dem Hinweis "Kopieren Sie den Schlüssel jetzt. Dwello zeigt ihn nur dieses eine Mal."
    Wenn der Liegenschaftsverwalter den neuen Zugangsschlüssel schliesst
    Dann zeigt Dwello den neuen Zugangsschlüssel nicht mehr
    Und nennt die Liste der Zugangsschlüssel "Claude Desktop Büro", erstellt heute, noch nie benutzt, läuft in 90 Tagen ab
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt das Protokoll mit heutigem Datum "Zugangsschlüssel «Claude Desktop Büro» erstellt"

  @wip
  Szenario: Ein KI-Programm liest die Gebäude
    Angenommen das Gebäude "Lindenhof" in "Bern" existiert
    Und der Liegenschaftsverwalter hat den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Wenn ein KI-Programm mit dem Zugangsschlüssel "Claude Desktop Büro" die Gebäude abfragt
    Dann erhält das KI-Programm das Gebäude "Lindenhof"
    Und nennt die Liste der Zugangsschlüssel "Claude Desktop Büro" heute zuletzt benutzt
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt das Protokoll mit heutigem Datum "KI-Programm mit Zugangsschlüssel «Claude Desktop Büro»: Gebäude abgefragt"

  @wip
  Szenario: Zugangsschlüssel widerrufen
    Angenommen der Liegenschaftsverwalter hat den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Wenn der Liegenschaftsverwalter den Zugangsschlüssel "Claude Desktop Büro" widerrufen will
    Dann warnt Dwello vor dem Widerrufen "Ein KI-Programm mit dem Zugangsschlüssel «Claude Desktop Büro» erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen."
    Wenn der Liegenschaftsverwalter das Widerrufen bestätigt
    Dann nennt die Liste der Zugangsschlüssel "Claude Desktop Büro" nicht mehr
    Und erhält ein KI-Programm mit dem Zugangsschlüssel "Claude Desktop Büro" keine Daten mehr
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt das Protokoll mit heutigem Datum "Zugangsschlüssel «Claude Desktop Büro» widerrufen"
