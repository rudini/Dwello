# language: de
Funktionalität: Öffentliche Demo
  Als Besucher der öffentlichen Demo
  möchte ich wissen, dass alle Besucher dieselben Daten sehen und jede Nacht alles zurückgesetzt wird,
  damit ich keine echten Daten von Mietern eingebe

  # Die Demo ist eine eigene Instanz des E2E-Stacks mit DEMO=on (playwright.config.ts)

  Szenario: Hinweis auf der Anmeldeseite der Demo
    Wenn ein Besucher die Anmeldeseite der Demo öffnet
    Dann sagt der Demo-Hinweis dem Besucher, dass alle Besucher dieselben Daten sehen und jede Nacht alles zurückgesetzt wird

  Szenario: Hinweis in der Demo nach der Anmeldung
    Wenn der Liegenschaftsverwalter die Übersicht der Demo öffnet
    Dann sagt der Demo-Hinweis dem Liegenschaftsverwalter, dass alle Besucher dieselben Daten sehen und jede Nacht alles zurückgesetzt wird

  Szenario: Datenschutzerklärung der Demo
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der Demo liest
    Dann erfährt der Liegenschaftsverwalter unter "Öffentliche Demo", dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und andere Besucher seinen Namen und seine E-Mail-Adresse nicht sehen

  # #458 (#330): in der Demo erfasst der Betreiber alle Daten
  Szenario: In der Demo ist der Betreiber für alle Daten verantwortlich
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der Demo liest
    Dann nennt die Datenschutzerklärung unter "Öffentliche Demo" "In der Demo ist der Betreiber für alle Daten verantwortlich."

  Szenario: Nutzungsbedingungen der Demo
    Wenn der Liegenschaftsverwalter die Nutzungsbedingungen der Demo liest
    Dann erfährt der Liegenschaftsverwalter unter "Öffentliche Demo", dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und er keine echten Daten eingeben soll

  Szenario: Kein Demo-Hinweis in einer eigenen Installation
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher keinen Demo-Hinweis

  # #675: auf der Anmeldeseite der ganze Hinweis, in der App eine Zeile mit einem Link zur Hilfe
  Szenario: Der Hinweis auf der Anmeldeseite sagt, was Besucher ausprobieren dürfen und wie sie mit echten Daten beginnen
    Wenn ein Besucher die Anmeldeseite der Demo öffnet
    Dann sagt der Demo-Hinweis dem Besucher, dass er alles ausprobieren darf und für echte Daten eine eigene Installation braucht
    Und nennt der Demo-Hinweis dem Besucher für eine eigene Installation den Kontakt "betrieb@muster-hosting.ch"

  Szenario: In der App steht der Demo-Hinweis in einer Zeile
    Wenn der Liegenschaftsverwalter die Übersicht der Demo öffnet
    Dann zeigt der Demo-Hinweis nur eine Zeile mit dem Link "Mehr zur Demo"

  Szenario: Vom Demo-Hinweis in der App zur Hilfe
    Angenommen der Liegenschaftsverwalter ist auf der Übersicht der Demo
    Wenn der Liegenschaftsverwalter im Demo-Hinweis "Mehr zur Demo" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Hilfe"

  Szenario: Die Hilfe der Demo erklärt die Demo vollständig
    Wenn der Liegenschaftsverwalter die Hilfe der Demo liest
    Dann erklärt die Hilfe unter "Öffentliche Demo" "Alle Besucher sehen und ändern dieselben Daten."
    Und erklärt die Hilfe unter "Öffentliche Demo" "Geben Sie deshalb nur erfundene Daten ein"
    Und erklärt die Hilfe unter "Öffentliche Demo" "Probieren Sie alles aus"
    Und erklärt die Hilfe unter "Öffentliche Demo" "Laden Sie nur erfundene Rechnungen und Dokumente hoch."
    Und erklärt die Hilfe unter "Öffentliche Demo" "keinen eigenen API-Schlüssel"
    Und erklärt die Hilfe unter "Öffentliche Demo" "eigene Installation"
    Und erklärt die Hilfe unter "Öffentliche Demo" "Betreiber dieser Demo: betrieb@muster-hosting.ch"
