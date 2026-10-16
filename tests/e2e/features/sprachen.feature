# language: de
@i18n
Funktionalität: Sprache der Oberfläche
  Als Liegenschaftsverwalter in der Romandie, im Tessin oder ohne Deutschkenntnisse
  möchte ich Dwello auf Deutsch, Französisch, Italienisch oder Englisch bedienen
  damit ich jeden Schritt verstehe

  Szenario: Ohne Wahl zeigt die Anmeldeseite die Sprache des Browsers
    Angenommen der Browser des Besuchers bevorzugt Französisch
    Und ein Besucher hat die Anmeldeseite geöffnet
    Dann ist die Seite auf "Français"
    Und heisst die Seite "Se connecter - Dwello"

  Szenario: Ohne Wahl folgt auch die Übersicht der Sprache des Browsers
    Angenommen der Browser des Liegenschaftsverwalters bevorzugt Englisch
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Dann ist die Seite auf "English"

  Szenario: Ohne Wahl ist Dwello deutsch, wenn der Browser keine der vier Sprachen will
    Angenommen der Browser des Liegenschaftsverwalters bevorzugt Spanisch
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Dann ist die Seite auf "Deutsch"

  Szenario: Die Sprache des ersten Besuchs bleibt, auch wenn der Browser später eine andere bevorzugt
    Angenommen der Browser des Liegenschaftsverwalters bevorzugt Englisch
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Und der Browser des Liegenschaftsverwalters bevorzugt Französisch
    Wenn der Liegenschaftsverwalter die Seite neu lädt
    Dann ist die Seite auf "English"

  Szenario: Die gewählte Sprache gilt vor der Sprache des Browsers
    Angenommen der Browser des Liegenschaftsverwalters bevorzugt Englisch
    Und der Liegenschaftsverwalter öffnet die Übersicht
    Und der Liegenschaftsverwalter die Sprache "Italiano" wählt
    Wenn der Liegenschaftsverwalter die Seite neu lädt
    Dann ist die Seite auf "Italiano"

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

  Szenariogrundriss: Hilfe, Datenschutz und Nutzungsbedingungen ohne Anmeldung lesen und die Sprache wechseln
    Angenommen ein Besucher hat die Seite "<Seite>" geöffnet
    Wenn der Besucher die Sprache "English" wählt
    Dann ist der Besucher noch auf der Seite "<Seite>"
    Und ist die Seite auf "English"
    Und heisst die Seite "<Titel>"

    Beispiele:
      | Seite    | Titel                 |
      | /help    | Help - Dwello         |
      | /privacy | Privacy - Dwello      |
      | /terms   | Terms of use - Dwello |

  Szenario: Die Nutzungsbedingungen von der Anmeldeseite aus lesen
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher den Link zu den Nutzungsbedingungen öffnet
    Dann ist der Besucher auf der Seite "Nutzungsbedingungen"

  @wip
  Szenario: Die Datenschutzerklärung von der Anmeldeseite aus lesen
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher den Link zur Datenschutzerklärung öffnet
    Dann ist der Besucher auf der Seite "Datenschutz"

  Szenario: Von den Nutzungsbedingungen zurück zur Anmeldung
    Angenommen ein Besucher hat die Seite "/terms" geöffnet
    Wenn der Besucher den Link zur Anmeldung öffnet
    Dann ist der Besucher auf der Seite "Anmelden"

  Szenario: Nach dem Abmelden zeigt der Datenschutz niemanden als angemeldet
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn der Liegenschaftsverwalter sich abmeldet
    Und der Liegenschaftsverwalter in der Fusszeile "Datenschutz" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Datenschutz"
    Und zeigt die Seite kein Benutzermenü

  Szenario: Nach abgelaufener Anmeldung zeigt der Datenschutz niemanden als angemeldet
    Angenommen der Liegenschaftsverwalter öffnet die Übersicht
    Wenn die Anmeldung des Liegenschaftsverwalters abläuft
    Und der Liegenschaftsverwalter in der Fusszeile "Datenschutz" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Datenschutz"
    Und zeigt die Seite kein Benutzermenü

  Szenario: Die Hilfe von der Anmeldeseite aus lesen
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher den Link zur Hilfe öffnet
    Dann ist der Besucher auf der Seite "Hilfe"

  Szenario: Den Datenschutz von der Anmeldeseite aus lesen
    Angenommen ein Besucher hat die Anmeldeseite geöffnet
    Wenn der Besucher in der Fusszeile "Datenschutz" wählt
    Dann ist der Besucher auf der Seite "Datenschutz"
