# language: de
@i18n
Funktionalität: Sprache der Oberfläche
  Als Liegenschaftsverwalter in der Romandie, im Tessin oder ohne Deutschkenntnisse
  möchte ich Dwello auf Deutsch, Französisch, Italienisch oder Englisch bedienen
  damit ich jeden Schritt verstehe

  Szenario: Ohne Wahl ist Dwello deutsch, auch wenn der Browser Englisch will
    Angenommen der Browser des Liegenschaftsverwalters bevorzugt Englisch
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Dann ist die Seite auf "Deutsch"

  Szenario: Sprache in der Kopfzeile wechseln und auf der Seite bleiben
    Angenommen der Liegenschaftsverwalter liest die Hilfe
    Wenn der Liegenschaftsverwalter die Sprache "Français" wählt
    Dann ist der Liegenschaftsverwalter noch auf der Seite "/help"
    Und ist die Seite auf "Français"
    Und heisst die Seite "Aide - Dwello"

  Szenario: Die Wahl bleibt nach Neuladen und neuer Anmeldung
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Und der Liegenschaftsverwalter die Sprache "Italiano" wählt
    Wenn der Liegenschaftsverwalter die Seite neu lädt
    Dann ist die Seite auf "Italiano"
    Wenn der Liegenschaftsverwalter sich abmeldet
    Und der Liegenschaftsverwalter sich wieder anmeldet
    Dann ist die Seite auf "Italiano"

  Szenariogrundriss: Sprache auf der Anmeldeseite wechseln
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher die Sprache "<Sprache>" wählt
    Dann ist die Seite auf "<Sprache>"
    Und heisst die Seite "<Titel>"

    Beispiele:
      | Sprache  | Titel                  |
      | Français | Se connecter - Dwello  |
      | Italiano | Accedere - Dwello      |
      | English  | Sign in - Dwello       |

  Szenario: Sprache auf der Fehlerseite wechseln
    Angenommen der Liegenschaftsverwalter öffnet eine Seite, die es nicht gibt
    Wenn der Liegenschaftsverwalter die Sprache "English" wählt
    Dann ist der Liegenschaftsverwalter noch auf der Seite "/gibt-es-nicht"
    Und ist die Seite auf "English"
    Und heisst die Seite "Error - Dwello"
