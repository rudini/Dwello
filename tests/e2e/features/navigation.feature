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
      | Bereich         | Seite                   |
      | Dashboard       | Dashboard               |
      | Gebäude         | Gebäude                 |
      | Wohnungen       | Wohnungen               |
      | Mieter          | Mieter                  |
      | Verträge        | Mietverträge            |
      | Rechnungen      | Rechnungen              |
      | Abrechnungen    | Nebenkostenabrechnungen |
      | Dokumente       | Dokumente               |
      | Konfiguration   | Einstellungen           |
      | Hilfe & Support | Hilfe                   |

  Szenario: Über das Logo zum Dashboard
    Wenn der Liegenschaftsverwalter das Logo wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Dashboard"

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
