# language: de
@statements
Funktionalität: Versendete Abrechnung erneut per Brief zustellen
  Als Liegenschaftsverwalter
  möchte ich eine versendete Abrechnung, die den Mieter nicht erreicht hat, erneut per Brief zustellen
  damit sie ab dem Tag des Briefs datiert ist, die Zahlungsfrist ab dann zählt und der Verlauf beide Wege nennt

  # #534 (Fachreview 449-1 M-1, Option A): eine E-Mail kommt als unzustellbar zurück; die Abrechnung erreicht den Mieter
  # erst mit dem Brief (Art. 4 Abs. 1 VMWG)
  Grundlage:
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Nora Beispiel" existiert
    Und "Nora Beispiel" mietet die Wohnung "1.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und im Gebäude "Birkenhof" gibt es eine Heizkostenrechnung über "4000" Franken für 2024
    Und für "Nora Beispiel" im Gebäude "Birkenhof" gibt es die Nebenkostenabrechnung 2024
    Und "Nora Beispiel" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Und der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Und hat die Abrechnung den Status "Versendet"

  # Fachreview 534-1 V-1: die E-Mail ging vor 40 Tagen hinaus, ihre Zahlungsfrist ist abgelaufen; der Brief datiert
  # die Abrechnung auf heute und rechnet die Zahlungsfrist ab heute
  Szenario: Eine per E-Mail versendete Abrechnung erneut per Brief zustellen
    Angenommen die Abrechnung 2024 von "Nora Beispiel" ging vor 40 Tagen hinaus
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Und hat die Abrechnung den Status "Überfällig"
    Wenn der Liegenschaftsverwalter die Abrechnung erneut per Brief zustellt
    Dann hat die Abrechnung den Status "Versendet"
    Und ist die Zahlungsfrist 30 Tage nach dem Tag des Versands
    Und nennt der Verlauf "Erneut versendet per Brief" am heutigen Tag
    Und nennt der Verlauf den Versand per E-Mail an "Nora Beispiel" vor 40 Tagen

  # Fachreview 534-1 M-1 (Entscheid in #534): eine Mahnung von vor dem Brief zählt nicht mehr; eine noch zu versendende
  # geht nicht mehr hinaus
  Szenario: Nach dem erneuten Zustellen geht eine frühere Mahnung nicht mehr hinaus
    Angenommen die Abrechnung 2024 von "Nora Beispiel" ging vor 40 Tagen hinaus
    Und "Nora Beispiel" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Und der Liegenschaftsverwalter eine Mahnung sendet
    Und die Abrechnung führt die "Zahlungserinnerung" als "Zu versenden"
    Wenn der Liegenschaftsverwalter die Abrechnung erneut per Brief zustellt
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Dann ist die "Zahlungserinnerung" an "Nora Beispiel" nicht mehr zu versenden

  Szenario: Vor dem erneuten Zustellen die Folge bestätigen
    Wenn der Liegenschaftsverwalter die Abrechnung erneut per Brief zustellen will
    Dann erklärt die Bestätigung des erneuten Zustellens "Dwello datiert die Abrechnung auf heute. Die Zahlungsfrist ist so viele Tage danach, wie in den Einstellungen festgelegt; eine spätere Zahlungsfrist bleibt. Mahnen können Sie erst nach der neuen Zahlungsfrist. Drucken Sie danach das PDF aus und schicken Sie es dem Mieter heute per Post."

  Szenario: Eine bezahlte Abrechnung lässt sich nicht erneut zustellen
    Angenommen die Abrechnung 2024 von "Nora Beispiel" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Dann hat die Abrechnung den Status "Bezahlt"
    Und bietet die Abrechnung kein erneutes Zustellen an
