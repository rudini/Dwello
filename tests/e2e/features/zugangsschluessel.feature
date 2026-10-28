# language: de
Funktionalität: Zugangsschlüssel für KI-Programme
  Als Liegenschaftsverwalter
  möchte ich einem KI-Programm meiner Wahl Lesezugriff auf meine Daten geben
  damit es mir Fragen zu meinen Liegenschaften beantworten kann

  # #817: ein Schlüssel gilt bis zum Kalendertag 90 Tage nach dem Erstellen. Dass ein abgelaufener Schlüssel abgelehnt
  # wird und mit dem Zeitpunkt des Ablaufs ins Protokoll kommt, auch ohne Abruf (Fachprüfung 817-1 V-1), prüft
  # access-key.pg.test.ts, denn ein Szenario kann keinen Schlüssel 90 Tage altern lassen.
  Szenario: Zugangsschlüssel öffnen
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen
    Wenn der Liegenschaftsverwalter die Zugangsschlüssel für KI-Programme öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Zugangsschlüssel für KI-Programme"

  Szenario: Zugangsschlüssel erstellen und nur einmal sehen
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Zugangsschlüssel für KI-Programme"
    Wenn der Liegenschaftsverwalter den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Dann zeigt Dwello den neuen Zugangsschlüssel mit dem Hinweis "Kopieren Sie den Schlüssel jetzt. Dwello zeigt ihn nur dieses eine Mal."
    Und warnt Dwello beim neuen Zugangsschlüssel "Wer den Schlüssel hat, kann Ihre Daten lesen. Tragen Sie ihn in den Einstellungen des KI-Programms ein, nicht in eine Nachricht an das Programm oder an andere. Ist er in falsche Hände geraten, widerrufen Sie ihn."
    Wenn der Liegenschaftsverwalter den neuen Zugangsschlüssel schliesst
    Dann zeigt Dwello den neuen Zugangsschlüssel nicht mehr
    Und nennt die Liste der Zugangsschlüssel "Claude Desktop Büro", erstellt heute, noch nie benutzt, läuft in 90 Tagen ab
    Wenn der Liegenschaftsverwalter im Protokoll nachsieht
    Dann nennt das Protokoll mit heutigem Datum "Zugangsschlüssel «Claude Desktop Büro» erstellt"

  Szenario: Ein KI-Programm liest die Gebäude
    Angenommen das Gebäude "Lindenhof" in "Bern" existiert
    Und der Liegenschaftsverwalter hat den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Wenn ein KI-Programm mit dem Zugangsschlüssel "Claude Desktop Büro" die Gebäude abfragt
    Dann erhält das KI-Programm das Gebäude "Lindenhof"
    Und nennt die Liste der Zugangsschlüssel "Claude Desktop Büro" heute zuletzt benutzt
    Wenn der Liegenschaftsverwalter im Protokoll nachsieht
    Dann nennt das Protokoll mit heutigem Datum "KI-Programm mit Zugangsschlüssel «Claude Desktop Büro»: Gebäude abgefragt"

  Szenario: Zugangsschlüssel widerrufen
    Angenommen der Liegenschaftsverwalter hat den Zugangsschlüssel "Claude Desktop Büro" erstellt
    Wenn der Liegenschaftsverwalter den Zugangsschlüssel "Claude Desktop Büro" widerrufen will
    Dann warnt Dwello vor dem Widerrufen "Ein KI-Programm mit dem Zugangsschlüssel «Claude Desktop Büro» erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen."
    Wenn der Liegenschaftsverwalter das Widerrufen bestätigt
    Dann nennt die Liste der Zugangsschlüssel "Claude Desktop Büro" nicht mehr
    Und erhält ein KI-Programm mit dem Zugangsschlüssel "Claude Desktop Büro" keine Daten mehr
    Wenn der Liegenschaftsverwalter im Protokoll nachsieht
    Dann nennt das Protokoll mit heutigem Datum "Zugangsschlüssel «Claude Desktop Büro» widerrufen"
