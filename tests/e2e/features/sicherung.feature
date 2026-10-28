# language: de
@einrichtung @wip
Funktionalität: Sicherung einrichten
  Als Liegenschaftsverwalter
  möchte ich, dass Dwello meine Daten jeden Tag verschlüsselt sichert
  damit nach einem Defekt oder einem missglückten Update nichts verloren ist

  # #718: Dwello sichert erst, wenn der Liegenschaftsverwalter den Wiederherstellungscode erneut eingegeben hat (A8).
  # Die frische Installation des Stacks hat einen Ordner für die Sicherung; ohne ihn (wie in der Entwicklung) gibt es
  # nichts einzurichten.

  Szenario: Nach der Einrichtung führt Dwello zur Sicherung
    Angenommen Dwello ist frisch installiert
    Und ein Besucher hat die Einrichtung geöffnet
    Wenn der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt
    Dann ist der Besucher auf der Seite "Sicherung einrichten"

  Szenario: Ohne eingerichtete Sicherung führt jede Seite zur Sicherung
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Sicherung einrichten"

  Szenario: Die Sicherung zeigt den Wiederherstellungscode und erklärt ihn
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Wenn der Liegenschaftsverwalter die Sicherung einrichtet
    Dann zeigt die Sicherung einen Wiederherstellungscode aus 6 Gruppen zu 4 Zeichen
    Und erklärt die Sicherung "Dwello sichert Ihre Daten jeden Tag verschlüsselt. Lesen kann eine Sicherung nur, wer diesen Wiederherstellungscode kennt. Ohne ihn lässt sich nach einem Defekt nichts wiederherstellen, auch nicht von der Person, die Dwello betreut."

  Szenario: Der Wiederherstellungscode bleibt beim erneuten Öffnen derselbe
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter die Sicherung erneut öffnet
    Dann zeigt die Sicherung denselben Wiederherstellungscode

  Szenario: Das Notfallblatt mit dem Wiederherstellungscode herunterladen
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter das Notfallblatt herunterlädt
    Dann enthält das Notfallblatt den angezeigten Wiederherstellungscode
    Und enthält das Notfallblatt "Geben Sie dieses Blatt der Person, die Dwello betreut. Mit dem Code stellt sie den letzten Stand Ihrer Daten wieder her."
    Und enthält das Notfallblatt "Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung: https://github.com/rudini/Dwello/blob/main/docs/installation.md"

  Szenario: Den Wiederherstellungscode bestätigen
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter den angezeigten Wiederherstellungscode erneut eingibt und die Sicherung startet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"
    Und bestätigt die Übersicht "Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag."

  Szenario: Nach der Bestätigung führt Dwello nicht mehr zur Sicherung
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"

  Szenario: Den Wiederherstellungscode falsch eingeben
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter einen anderen Wiederherstellungscode eingibt und die Sicherung startet
    Dann sieht der Liegenschaftsverwalter bei der Sicherung den Hinweis "Der Code stimmt nicht mit dem angezeigten überein. Geben Sie ihn so ein, wie er oben und auf dem Notfallblatt steht; Bindestriche und Kleinbuchstaben spielen keine Rolle."
    Und ist der Liegenschaftsverwalter auf der Seite "Sicherung einrichten"

  # Fachbegriffe sichtbar erklärt, nicht als Tooltip (CLAUDE.md, Design-Regeln)
  Szenario: Die Sicherung erklärt, wo die Sicherungen liegen
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Wenn der Liegenschaftsverwalter die Sicherung einrichtet
    Dann erklärt die Sicherung "Die Sicherungen liegen auf dem Server von Dwello im Ordner «backups». Dwello behält die letzten 7 täglichen und je eine pro Monat während 12 Monaten. Damit sie einen Defekt des Servers überstehen, kopiert die Person, die Dwello betreut, den Ordner regelmässig auf ein anderes Gerät."

  Szenario: Die Datenschutzerklärung nennt die Sicherung
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    Dann nennt die Datenschutzerklärung unter "Aufbewahrung" "Dwello sichert alle Daten jeden Tag verschlüsselt und behält die Sicherungen bis zu 12 Monate. Gelöschte oder anonymisierte Daten bleiben so lange in den älteren Sicherungen; lesen kann sie nur, wer den Wiederherstellungscode kennt."

  Szenario: Von der Sicherung zur Datenschutzerklärung
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter bei der Sicherung die Datenschutzerklärung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Datenschutz"
