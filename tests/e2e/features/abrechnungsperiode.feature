# language: de
@config @frische-installation
Funktionalität: Wechsel der Abrechnungsperiode
  Als Liegenschaftsverwalter
  möchte ich beim Wechsel der Abrechnungsperiode erfahren, welche Mieter ihm zustimmen müssen,
  damit ich ihre Zustimmung einhole, bevor die neue Abrechnungsperiode beginnt

  # #1036 (Option 1): die Abrechnungsperiode gilt für alle Szenarien; wer sie wechselt, tut das in der frischen
  # Installation (@frische-installation), die er für sich hat. Der Wechsel geschieht heute: welche Abrechnungsperioden
  # wechseln, hängt vom Datum ab (tests/e2e/fixtures/dates.ts), die kurze Abrechnungsperiode läuft an jedem Tag noch
  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken

  # nur wer in der kurzen Abrechnungsperiode Miettage hat, muss zustimmen
  Szenario: Nach dem Wechsel der Abrechnungsperiode nennen die Einstellungen die Mietverträge mit ihrem Brief zur Zustimmung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Ben Meier" existiert
    Und "Ben Meier" mietete die Wohnung "2.02" von "2024-04-01" bis "2024-12-31" für "900" Franken
    Wenn der Liegenschaftsverwalter die Abrechnungsperiode wechselt, während die kurze Abrechnungsperiode noch läuft
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und sagen die Einstellungen, wann die neue Abrechnungsperiode beginnt
    # Fachreview 1036-1 V-3: Mieter und Wohnung
    Und nennen die Einstellungen den Mietvertrag von "Anna Keller" in der Wohnung "2.01" mit dem Brief zur Zustimmung
    Und nennen die Einstellungen den Mietvertrag von "Ben Meier" nicht

  # Fachreview 1036-1 V-1: bei manchen Wechseln ist die kurze Abrechnungsperiode am Tag des Wechsels schon beendet und
  # die neue Abrechnungsperiode hat schon begonnen; dann kommt der Brief jetzt
  Szenario: Nach einem Wechsel, dessen kurze Abrechnungsperiode schon beendet ist, sagen die Einstellungen, dass die neue Abrechnungsperiode schon begonnen hat
    Wenn der Liegenschaftsverwalter die Abrechnungsperiode wechselt, nachdem die kurze Abrechnungsperiode schon beendet ist
    Dann sagen die Einstellungen, dass die neue Abrechnungsperiode schon begonnen hat
    Und nennen die Einstellungen den Mietvertrag von "Anna Keller" in der Wohnung "2.01" mit dem Brief zur Zustimmung

  # die Zustimmung wird eingeholt, bevor die neue Abrechnungsperiode beginnt, nicht erst nach der kurzen
  Szenario: Während die kurze Abrechnungsperiode läuft, bietet der Mietvertrag den Brief zur Zustimmung an
    Angenommen die Abrechnungsperiode hat heute gewechselt, und die kurze Abrechnungsperiode läuft noch
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Brief für die Zustimmung zur neuen Abrechnungsperiode herunterlädt
    Dann steht im PDF "Zustimmung zu einer neuen Abrechnungsperiode"
    Und nennt der Brief die kurze Abrechnungsperiode, die noch läuft

  Szenario: Ohne Wechsel der Abrechnungsperiode nennen die Einstellungen keinen Mietvertrag zur Zustimmung
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen
    Wenn der Liegenschaftsverwalter die Zahlungsfrist "30" speichert
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nennen die Einstellungen keinen Mietvertrag zur Zustimmung
