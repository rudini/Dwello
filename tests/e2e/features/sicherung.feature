# language: de
@einrichtung
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
    # Fachreview 718b V-2: das Blatt nicht in den Downloads desselben Computers lassen
    Und erklärt die Sicherung "Drucken Sie das Notfallblatt aus und bewahren Sie es getrennt von diesem Computer an einem sicheren Ort auf, etwa bei Ihren Mietverträgen."
    # Persona helga-718b P-1: wer den Code nur abtippt, muss wissen, dass Dwello ihn danach nicht mehr zeigt
    Und erklärt die Sicherung "Sobald Sie die Sicherung starten, zeigt Dwello den Code nicht mehr an, und das Notfallblatt lässt sich nicht mehr herunterladen."

  Szenario: Der Wiederherstellungscode bleibt beim erneuten Öffnen derselbe
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter die Sicherung erneut öffnet
    Dann zeigt die Sicherung denselben Wiederherstellungscode

  # Fachreview 718b-3 V-4: die Kopie auf dem anderen Gerät legt die betreuende Person an, Dwello weiss nicht, ob es sie gibt
  Szenario: Das Notfallblatt mit dem Wiederherstellungscode herunterladen
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter das Notfallblatt herunterlädt
    Dann enthält das Notfallblatt den angezeigten Wiederherstellungscode
    # Fachreview 718b V-2, V-3, V-5: Datum, Webadresse und Ort der Sicherungen, wie in #718 entschieden
    Und enthält das Notfallblatt das Datum von heute
    Und enthält das Notfallblatt die Adresse, unter der der Liegenschaftsverwalter Dwello öffnet
    Und enthält das Notfallblatt "Die Sicherungen liegen auf dem Server dieser Dwello-Installation im Ordner «backups» und in der Kopie, die die Person, die Dwello betreut, regelmässig auf einem anderen Gerät ablegen soll."
    Und enthält das Notfallblatt "Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut. Mit dem Code stellt sie den Stand der letzten Sicherung wieder her; was Sie danach erfasst haben, fehlt."
    Und enthält das Notfallblatt "Bewahren Sie dieses Blatt getrennt von Ihrem Computer an einem sicheren Ort auf."
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

  # O1: gelingt einen Tag lang keine Sicherung, erfährt es der Liegenschaftsverwalter beim nächsten Besuch
  Szenario: Ohne Sicherung seit mehr als einem Tag warnt die Übersicht
    Angenommen Dwello ist eingerichtet, konnte aber seit 2 Tagen keine Sicherung erstellen
    Wenn der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet
    Dann warnt die Übersicht "Dwello konnte seit {vor 2 Tagen} keine Sicherung erstellen. Ihre Daten sind nicht gesichert. Melden Sie sich bei der Person, die Dwello betreut."
    Und warnt die Übersicht "Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung."

  # Fachreview 718b R-3: nach der Bestätigung kennt Dwello den Code nicht mehr, darum zeigt es ihn auch nicht mehr
  Szenario: Nach der Bestätigung zeigt Dwello den Wiederherstellungscode nicht mehr
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter die Sicherung der frischen Installation öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Übersicht"

  Szenario: Den Wiederherstellungscode falsch eingeben
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter einen anderen Wiederherstellungscode eingibt und die Sicherung startet
    Dann sieht der Liegenschaftsverwalter bei der Sicherung den Hinweis "Der Code stimmt nicht mit dem angezeigten überein. Geben Sie ihn so ein, wie er oben und auf dem Notfallblatt steht; Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle."
    Und ist der Liegenschaftsverwalter auf der Seite "Sicherung einrichten"

  # Fachbegriffe sichtbar erklärt, nicht als Tooltip (CLAUDE.md, Design-Regeln)
  Szenario: Die Sicherung erklärt, wo die Sicherungen liegen
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Wenn der Liegenschaftsverwalter die Sicherung einrichtet
    # Fachreview 718b V-1: die Kopie ist eine Pflicht, kein Versprechen; wer Dwello selbst betreut, findet das Vorgehen
    Dann erklärt die Sicherung "Die Sicherungen liegen auf dem Server dieser Dwello-Installation im Ordner «backups». Dwello behält die letzten 7 täglichen und je eine pro Monat während 12 Monaten. Damit sie einen Defekt des Servers überstehen, muss die Person, die Dwello betreut, den Ordner regelmässig auf ein anderes Gerät kopieren. Fragen Sie sie, ob sie das tut."
    Und erklärt die Sicherung "Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung."
    Und verweist die Sicherung auf die Installationsanleitung "https://github.com/rudini/Dwello/blob/main/docs/installation.md"

  # Fachreview 718b-3 R-1: die 12 Monate gelten für den Ordner auf dem Server, nicht für die Kopie des Betreibers
  Szenario: Die Datenschutzerklärung nennt die Sicherung
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter die Datenschutzerklärung der frischen Installation liest
    # Fachreview 718b R-1, R-2: Zweck, Dauer, was nach einer Wiederherstellung zu tun ist, und wo die Kopie liegt (Art. 6, 19 DSG)
    Dann nennt die Datenschutzerklärung unter "Aufbewahrung" "Damit Ihre Daten einen Defekt oder ein missglücktes Update überstehen, sichert Dwello sie jeden Tag verschlüsselt, mit Belegen und Dokumenten, und behält die Sicherungen auf diesem Server bis zu 12 Monate; ältere löscht Dwello selbst. Was Sie löschen oder anonymisieren, bleibt in den Sicherungen von vorher, bis Dwello diese löscht, höchstens 12 Monate; wie lange die Kopie auf dem anderen Gerät ältere Sicherungen behält, erfahren Sie beim Betreiber. Lesen kann die Sicherungen nur, wer den Wiederherstellungscode kennt. Stellt der Betreiber eine Sicherung wieder her, sind Daten, die Sie nach ihr gelöscht oder anonymisiert haben, wieder da: Löschen oder anonymisieren Sie sie dann erneut."
    Und nennt die Datenschutzerklärung unter "Welche Daten Dwello speichert" "Dazu legt Dwello jeden Tag eine verschlüsselte Sicherung im Ordner «backups» auf diesem Server ab. Der Betreiber kopiert sie auf ein anderes Gerät, etwa in einen Cloud-Speicher; wo und in welchem Land diese Kopie liegt, erfahren Sie beim Betreiber. Wer die Kopie aufbewahrt, kann sie ohne den Wiederherstellungscode nicht lesen."

  Szenario: Von der Sicherung zur Datenschutzerklärung
    Angenommen Dwello ist eingerichtet, die Sicherung aber noch nicht
    Und der Liegenschaftsverwalter hat die Sicherung geöffnet
    Wenn der Liegenschaftsverwalter bei der Sicherung die Datenschutzerklärung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Datenschutz"
    # Persona weber-718b P-1: wer vor der Bestätigung nachliest, findet die Sicherung schon dort
    Und nennt die Datenschutzerklärung unter "Welche Daten Dwello speichert" "Dazu legt Dwello jeden Tag eine verschlüsselte Sicherung"

  # Fachreview 718c-1: V-1 (gleich nach der Bestätigung eine Sicherung mit dem neuen Code), V-3 bis V-5 (Wortlaut)
  # #718, Teil 3: ein neuer Wiederherstellungscode in den Einstellungen, erst nach erneuter Anmeldung (mit Passwort:
  # das Passwort erneut eingeben; mit Google: erneut mit Google anmelden). Die Sicherungen von vorher bleiben mit dem
  # alten Code lesbar (A8).
  Szenario: Von den Einstellungen zur Sicherung
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Wenn der Liegenschaftsverwalter in den Einstellungen die Sicherung öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Wiederherstellungscode"

  Szenario: Ein neuer Wiederherstellungscode verlangt das Passwort erneut
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Wenn der Liegenschaftsverwalter die Seite für einen neuen Wiederherstellungscode öffnet
    Dann erklärt die Seite für einen neuen Wiederherstellungscode "Die Sicherungen von vorher lassen sich weiterhin nur mit dem alten Code lesen. Dwello löscht sie nach und nach, die letzte nach höchstens 12 Monaten. Bewahren Sie das alte Notfallblatt bis dahin auf; fragen Sie die Person, die Dwello betreut, ob ihre Kopie Sicherungen länger behält. Wer das alte Notfallblatt hat, kann diese Sicherungen bis dahin ebenfalls lesen."
    Und erklärt die Seite für einen neuen Wiederherstellungscode "Geben Sie Ihr Passwort erneut ein. So kann nur, wer das Passwort kennt, einen neuen Code erstellen."
    Und zeigt die Seite für einen neuen Wiederherstellungscode noch keinen Code

  Szenario: Mit dem Passwort einen neuen Wiederherstellungscode erstellen
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Wenn der Liegenschaftsverwalter mit seinem Passwort einen neuen Wiederherstellungscode erstellt
    Dann zeigt die Sicherung einen Wiederherstellungscode aus 6 Gruppen zu 4 Zeichen
    Und erklärt die Sicherung "Sobald Sie den neuen Code bestätigen, zeigt Dwello ihn nicht mehr an, und das Notfallblatt lässt sich nicht mehr herunterladen. Drucken Sie das neue Notfallblatt aus und bewahren Sie es getrennt von diesem Computer an einem sicheren Ort auf, etwa bei Ihren Mietverträgen."

  Szenario: Mit einem falschen Passwort entsteht kein neuer Wiederherstellungscode
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Wenn der Liegenschaftsverwalter mit einem falschen Passwort einen neuen Wiederherstellungscode erstellt
    Dann sieht der Liegenschaftsverwalter bei der Sicherung den Hinweis "Das Passwort stimmt nicht. Geben Sie das Passwort ein, mit dem Sie sich anmelden."
    Und zeigt die Seite für einen neuen Wiederherstellungscode noch keinen Code

  Szenario: Das Notfallblatt mit dem neuen Wiederherstellungscode herunterladen
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Und der Liegenschaftsverwalter hat mit seinem Passwort einen neuen Wiederherstellungscode erstellt
    Wenn der Liegenschaftsverwalter das Notfallblatt herunterlädt
    Dann enthält das Notfallblatt den angezeigten Wiederherstellungscode
    # Fachreview 718c V-5: nach dem Wechsel gibt es zwei Blätter
    Und enthält das Notfallblatt "Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter."

  Szenario: Den neuen Wiederherstellungscode bestätigen
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Und der Liegenschaftsverwalter hat mit seinem Passwort einen neuen Wiederherstellungscode erstellt
    Wenn der Liegenschaftsverwalter den angezeigten Wiederherstellungscode erneut eingibt und den neuen Code bestätigt
    Dann bestätigt die Seite für einen neuen Wiederherstellungscode "Der neue Wiederherstellungscode gilt ab jetzt. Dwello erstellt gleich eine erste Sicherung mit ihm und sichert Ihre Daten ab jetzt jeden Tag mit ihm."
    Und zeigt die Seite für einen neuen Wiederherstellungscode noch keinen Code

  Szenario: Den neuen Wiederherstellungscode falsch eingeben
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet
    Und der Liegenschaftsverwalter hat mit seinem Passwort einen neuen Wiederherstellungscode erstellt
    Wenn der Liegenschaftsverwalter einen anderen Wiederherstellungscode eingibt und den neuen Code bestätigt
    Dann sieht der Liegenschaftsverwalter bei der Sicherung den Hinweis "Der Code stimmt nicht mit dem angezeigten überein. Geben Sie ihn so ein, wie er oben und auf dem Notfallblatt steht; Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle."

  # Mit Google angemeldet: die Anmeldung muss frisch sein (höchstens 10 Minuten); sonst führt die Seite zu Google
  Szenario: Mit Google angemeldet verlangt ein neuer Wiederherstellungscode eine neue Anmeldung bei Google
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Und der Liegenschaftsverwalter hat sich in der frischen Installation vor einer Stunde mit Google angemeldet
    Wenn der Liegenschaftsverwalter die Seite für einen neuen Wiederherstellungscode öffnet
    Dann erklärt die Seite für einen neuen Wiederherstellungscode "Melden Sie sich erneut mit Google an. So kann nur, wer Zugang zu Ihrem Google-Konto hat, einen neuen Code erstellen."
    Und führt die Seite für einen neuen Wiederherstellungscode zur erneuten Anmeldung mit Google
    Und zeigt die Seite für einen neuen Wiederherstellungscode noch keinen Code
