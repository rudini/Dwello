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
      | Berichte                | Berichte                |
      | Auswertungen            | Auswertungen            |
      | Einstellungen           | Einstellungen           |
      | Kategorien              | Kategorien              |
      | Verteilschlüssel        | Verteilschlüssel        |
      | Heizprofile             | Heizprofile             |
      | Hilfe                   | Hilfe                   |

  # #661: im schmalen Fenster öffnet das Menü dieselben Bereiche wie die Hauptnavigation
  Szenariogrundriss: Bereich über das Menü im schmalen Fenster öffnen
    Angenommen das Browserfenster ist 390 Pixel breit
    Wenn der Liegenschaftsverwalter im Menü "<Bereich>" wählt
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
      | Berichte                | Berichte                |
      | Auswertungen            | Auswertungen            |
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

  Szenario: Eine Verknüpfung auf dem Startbildschirm zeigt das Dwello-Symbol
    Dann bietet die Seite das Dwello-Symbol für den Startbildschirm an

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

  # #656: das Benutzermenü geht mit den Tasten wie die Sprachwahl
  Szenario: Im Benutzermenü führen die Pfeiltasten von Eintrag zu Eintrag
    Wenn der Liegenschaftsverwalter das Benutzermenü mit der Taste "ArrowDown" öffnet
    Dann steht der Fokus im Benutzermenü auf "Einstellungen"
    Wenn der Liegenschaftsverwalter im Benutzermenü die Taste "End" drückt
    Dann steht der Fokus im Benutzermenü auf "Abmelden"
    Wenn der Liegenschaftsverwalter im Benutzermenü die Taste "ArrowDown" drückt
    Dann steht der Fokus im Benutzermenü auf "Einstellungen"

  # #656
  Szenariogrundriss: Die Fusszeile markiert die rechtliche Seite, die offen ist
    Wenn der Liegenschaftsverwalter in der Fusszeile "<Link>" wählt
    Dann ist in der Fusszeile nur "<Link>" als aktuelle Seite markiert

    Beispiele:
      | Link                |
      | Datenschutz         |
      | Nutzungsbedingungen |

  # #651 (Fallback-Review von #1115): ein Tablet quer gedreht schliesst das offene Menü; der Fokus geht nicht verloren
  Szenario: Wird das Fenster mit offenem Menü breit, steht der Fokus auf dem aktuellen Bereich
    Angenommen das Browserfenster ist 390 Pixel breit
    Und der Liegenschaftsverwalter hat das Menü geöffnet
    Wenn das Browserfenster 1280 Pixel breit wird
    Dann steht der Fokus in der Hauptnavigation auf "Gebäude"

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

  # #740: ein Laptop mit 1280 Pixeln bei 150 % Zoom zeigt 853 Pixel; die Hauptnavigation bleibt sichtbar, ohne Menü
  Szenario: Bereich über die Hauptnavigation bei 150 % Zoom öffnen
    Angenommen das Browserfenster ist 853 Pixel breit
    Wenn der Liegenschaftsverwalter in der Hauptnavigation "Mietverträge" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Mietverträge"

  # #657 (Decided): 360 Pixel ist die schmalste Breite; bis dahin ragt nichts aus der Kopfzeile
  Szenario: Die Kopfzeile passt in ein 360 Pixel schmales Fenster
    Angenommen das Browserfenster ist 360 Pixel breit
    Dann scrollt die Seite nicht seitwärts

  # #651: solange das Menü offen ist, bleiben Tastatur und Bildschirmleser darin; die Seite dahinter ist unerreichbar
  Szenario: Hinter dem offenen Menü ist die Seite nicht erreichbar
    Angenommen das Browserfenster ist 390 Pixel breit
    Und der Liegenschaftsverwalter hat das Menü geöffnet
    Dann nennt das Menü zuerst "Hilfe"
    Und erreichen Tastatur und Bildschirmleser ausserhalb des Menüs nichts

  # #657 (Decided): «Hilfe» steht zuoberst im Menü, ohne Scrollen sichtbar; die Hauptnavigation bleibt, wie sie ist
  Szenario: Im Menü steht «Hilfe» zuoberst
    Angenommen das Browserfenster ist 390 auf 844 Pixel gross
    Und der Liegenschaftsverwalter hat das Menü geöffnet
    Dann nennt das Menü zuerst "Hilfe"
    Und sieht der Liegenschaftsverwalter "Hilfe" im Menü, ohne zu scrollen
