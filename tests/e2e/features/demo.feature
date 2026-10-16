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

  @wip
  Szenario: Nutzungsbedingungen der Demo
    Wenn der Liegenschaftsverwalter die Nutzungsbedingungen der Demo liest
    Dann erfährt der Liegenschaftsverwalter unter "Öffentliche Demo", dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und er keine echten Daten eingeben soll

  Szenario: Kein Demo-Hinweis in einer eigenen Installation
    Wenn ein Besucher die Anmeldeseite öffnet
    Dann ist der Besucher auf der Seite "Anmelden"
    Und sieht der Besucher keinen Demo-Hinweis
