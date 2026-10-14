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
    Dann zeigt die Fusszeile "Version 1.4.0"
