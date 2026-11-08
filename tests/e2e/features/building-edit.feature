# language: de
@buildings
Funktionalität: Gebäude bearbeiten
  Als Liegenschaftsverwalter
  möchte ich die Stammdaten eines Gebäudes korrigieren
  damit Abrechnungen und Verträge auf korrekten Daten beruhen

  Grundlage:
    Angenommen das Gebäude "Eichenhof" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite von "Eichenhof"

  Szenario: Baujahr ändern
    Wenn der Liegenschaftsverwalter das Baujahr auf "1972" ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
    Und sieht der Liegenschaftsverwalter das Baujahr "1972"

  # Der Abrechnungsassistent fragt dann nicht mehr nach dem Tankbestand (#72)
  Szenario: Festhalten, dass das Gebäude keinen Tank hat
    Wenn der Liegenschaftsverwalter festhält, dass das Gebäude keinen Tank hat oder der Tank stillgelegt ist
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
    Und nennt die Gebäudeseite zum Tank "Keiner oder stillgelegt"

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ auf "84" ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben."

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"

  # #1088: bis zur ersten Abrechnung des Gebäudes lässt sich die Abrechnungsperiode ändern
  Szenario: Die Abrechnungsperiode vor der ersten Abrechnung ändern
    Wenn der Liegenschaftsverwalter die Abrechnungsperiode auf "November – Oktober" ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Eichenhof"
    Und nennt die Gebäudeseite die Abrechnungsperiode "November – Oktober"

  # #1088: ab der ersten Abrechnung bleibt die Abrechnungsperiode fest, das Feld sagt warum
  Szenario: Ab der ersten Abrechnung bleibt die Abrechnungsperiode fest
    Angenommen im Gebäude "Eichenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietete die Wohnung "1.01" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Und für "Lea Graf" gibt es die Abrechnung vom "2024-01-01" bis "2024-12-31" im Gebäude "Eichenhof"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite von "Eichenhof"
    Dann lässt das Formular die Abrechnungsperiode nicht ändern
    Und sagt das Formular zur Abrechnungsperiode "Für Eichenhof gibt es schon Abrechnungen. Die Abrechnungsperiode bleibt darum fest."

  # #1088: die Seite war offen, als die erste Abrechnung entstand (z.B. in einem zweiten Tab)
  Szenario: Die Abrechnungsperiode ändern, nachdem inzwischen eine Abrechnung entstanden ist
    Angenommen im Gebäude "Eichenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietete die Wohnung "1.01" von "2024-01-01" bis "2024-12-31" für "900" Franken
    Und für "Lea Graf" gibt es die Abrechnung vom "2024-01-01" bis "2024-12-31" im Gebäude "Eichenhof"
    Wenn der Liegenschaftsverwalter die Abrechnungsperiode auf "Juli – Juni" ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Für dieses Gebäude gibt es inzwischen Abrechnungen. Die Abrechnungsperiode bleibt darum fest. Laden Sie die Seite neu."

  # #1201: jedes Textfeld nimmt höchstens so viele Zeichen, wie die Datenbank speichert; das Feld sagt, was zu tun ist,
  # statt eines allgemeinen Fehlers beim Speichern, und Dwello kürzt nichts (wie #743)
  Szenario: Bei einem zu langen Gebäudenamen sagt Dwello, was zu tun ist
    Wenn der Liegenschaftsverwalter bei "Gebäudename" einen Text von 256 Zeichen speichert
    Dann steht bei "Gebäudename" die Fehlermeldung "Höchstens 255 Zeichen, Sie haben 256 eingegeben. Kürzen Sie den Text."
    Und steht bei "Gebäudename" noch der Text von 256 Zeichen
