# language: de
@navigation
Funktionalität: Navigation
  Als Liegenschaftsverwalter
  möchte ich von jeder Seite aus die Bereiche von Dwello erreichen
  damit ich ohne Umwege dorthin komme, wo ich arbeite

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf der Gebäudeliste

  Szenariogrundriss: Bereich über die Hauptnavigation öffnen
    Wenn der Liegenschaftsverwalter in der Hauptnavigation "<Bereich>" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Bereich                 | Seite                   |
      | Übersicht               | Übersicht               |
      | Gebäude                 | Gebäude                 |
      | Wohnungen               | Wohnungen               |
      | Mieter                  | Mieter                  |
      | Mietverträge            | Mietverträge            |
      | Rechnungen              | Rechnungen              |
      | Nebenkostenabrechnungen | Nebenkostenabrechnungen |
      | Dokumente               | Dokumente               |
      | Einstellungen           | Einstellungen           |
      | Kategorien              | Kategorien              |
      | Verteilschlüssel        | Verteilschlüssel        |
      | Heizprofile             | Heizprofile             |
      | Hilfe                   | Hilfe                   |

  Szenario: Über das Logo zur Übersicht
    Wenn der Liegenschaftsverwalter das Logo wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"

  Szenario: Das Browser-Tab zeigt das Dwello-Symbol
    Dann zeigt das Browser-Tab das Dwello-Symbol

  Szenario: Einstellungen über das Benutzermenü öffnen
    Wenn der Liegenschaftsverwalter im Benutzermenü die Einstellungen wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Einstellungen"

  Szenariogrundriss: Rechtliche Hinweise in der Fusszeile öffnen
    Wenn der Liegenschaftsverwalter in der Fusszeile "<Link>" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "<Link>"

    Beispiele:
      | Link                |
      | Datenschutz         |
      | Nutzungsbedingungen |

  Szenario: Nur der aktuelle Bereich ist markiert
    Wenn der Liegenschaftsverwalter in der Hauptnavigation "Heizprofile" wählt
    Dann ist in der Hauptnavigation nur "Heizprofile" markiert

  Szenario: Die Fusszeile zeigt die Version der App
    Dann zeigt die Fusszeile die Version "1.4.0"

  # #519: ein unerwarteter Fehler beim Laden heisst in der Sprache der Seite, nicht «Internal Error» wie bei SvelteKit
  Szenario: Die Fehlerseite nennt einen unerwarteten Fehler in Worten
    Angenommen der Liegenschaftsverwalter öffnet eine Seite, die es nicht gibt
    Wenn der Liegenschaftsverwalter von dort zur Übersicht wechselt, deren Daten nicht geladen werden können
    Dann sagt die Fehlerseite "Ein unerwarteter Fehler ist aufgetreten."

  # Eine Kennung, die keine sein kann, ist wie eine unbekannte: die Seite gibt es nicht, kein Fehler beim Laden
  Szenariogrundriss: Eine Seite mit ungültiger Kennung gibt es nicht
    Wenn der Liegenschaftsverwalter die Seite "<Pfad>" öffnet
    Dann sagt die Fehlerseite "Diese Seite gibt es nicht."

    Beispiele:
      | Pfad                               |
      | /buildings/abc                     |
      | /buildings/abc/edit                |
      | /apartments/abc                    |
      | /apartments/abc/edit               |
      | /tenants/abc                       |
      | /tenants/abc/edit                  |
      | /contracts/abc                     |
      | /contracts/abc/edit                |
      | /invoices/abc                      |
      | /invoices/upload                   |
      | /invoices/abc/edit                 |
      | /statements/abc                    |
      | /statements/abc/edit               |
      | /config/categories/abc/edit        |
      | /config/distribution-keys/abc/edit |
      | /config/heating-profiles/abc       |
      | /config/heating-profiles/abc/edit  |
