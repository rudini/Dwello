# language: de
@statements
Funktionalität: Mahnungen
  Als Liegenschaftsverwalter
  möchte ich unbezahlte Abrechnungen mahnen
  damit der Mieter auf dem vereinbarten Weg erinnert wird und die Mahnung in den Dokumenten liegt

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und im Gebäude "Ahornhof" gibt es eine Heizkostenrechnung über "4000" Franken für 2024
    Und für "Anna Keller" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und die Zahlungsfrist der Abrechnung 2024 von "Anna Keller" ist abgelaufen

  # Vor Ablauf der Frist ist eine Mahnung verfrüht: ein falscher Tipp, und der Mieter erhält sie
  Szenario: Keine Mahnung vor Ablauf der Zahlungsfrist
    Angenommen die Zahlungsfrist der Abrechnung 2024 von "Anna Keller" läuft noch
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann bietet die Abrechnung keine Mahnung an

  Szenario: Zahlungserinnerung per E-Mail
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann meldet die Abrechnung "Das Dokument «Zahlungserinnerung» wurde per E-Mail versendet."
    Und hat "Anna Keller" per E-Mail "Zahlungserinnerung" mit PDF erhalten
    Und die Abrechnung führt die "Zahlungserinnerung" als "Versendet"

  Szenario: Mahnung per Brief
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann meldet die Abrechnung "Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» als Brief zum Ausdrucken bereit."
    Und die Abrechnung führt die "Zahlungserinnerung" als "Zu versenden"

  # #106: die Mahnung folgt der Sprache des Mieters wie das PDF der Abrechnung
  Szenario: Zahlungserinnerung in der Sprache des Mieters
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail
    Und die Korrespondenz an "Anna Keller" ist auf "Französisch"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann hat "Anna Keller" per E-Mail "Rappel de paiement" mit PDF erhalten
    # die Oberfläche des Liegenschaftsverwalters bleibt in seiner Sprache
    Und meldet die Abrechnung "Das Dokument «Zahlungserinnerung» wurde per E-Mail versendet."
    Und die Abrechnung führt die "Zahlungserinnerung" als "Versendet"

  # Jede Mahnung setzt eine neue Zahlungsfrist; die nächste Mahnstufe erst ab dem Tag danach (#107).
  # Dass sie danach möglich ist, prüft reminders.pg.test.ts: die Uhr des Backends lässt sich hier nicht vorstellen.
  Szenario: Nächste Mahnung erst nach der Zahlungsfrist der letzten
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann führt die Abrechnung die "Zahlungserinnerung" mit der Zahlungsfrist in 10 Tagen
    Und bietet die Abrechnung keine Mahnung an
    Und nennt die Abrechnung die nächste Mahnung ab dem Tag in 11 Tagen
    Und nennt die Liste der Abrechnungen bei "Anna Keller" die nächste Mahnung ab dem Tag in 11 Tagen

  # Die E-Mail kam nicht an, der Verwalter hat den Brief ausgedruckt und per Post geschickt (#194)
  Szenario: Nach gescheiterter E-Mail per Post versendete Mahnung gilt als Brief
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail an eine Adresse, die der Mailserver abweist
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Und der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" in den Dokumenten als versendet markiert
    Dann ist die "Zahlungserinnerung" an "Anna Keller" per Brief versendet festgehalten

  # #108: jede Mahnung trägt einen Zahlteil für den offenen Saldo, mit der Referenz der Abrechnung
  # (die Referenz gibt es nur mit einer QR-IBAN, die IBAN gilt für alle Szenarien: geprüft in reminders.pg.test.ts)
  Szenario: Zahlungserinnerung mit Zahlteil für den offenen Saldo
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und "Anna Keller" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Und der Liegenschaftsverwalter das PDF der "Zahlungserinnerung" an "Anna Keller" in den Dokumenten herunterlädt
    Dann steht im PDF "Empfangsschein"
    Und steht im PDF "Zahlteil"
    Und steht im PDF "Zahlbar durch"
    Und steht im PDF "Währung Betrag CHF 2 320.00"

  # #449 (Entscheid in #404, Punkt 4): der Liegenschaftsverwalter weiss vor dem Senden, in welcher Sprache die Mahnung ist
  Szenario: Die Mahnung nennt vor dem Senden ihre Sprache
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und die Korrespondenz an "Anna Keller" ist auf "Französisch"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung senden will
    Dann sagt die Mahnung vor dem Senden "Dwello erstellt die Zahlungserinnerung auf Französisch als PDF"

  # #449 (Punkt 6, #283): Kanal E-Mail ohne Adresse; die Mahnung entsteht als Brief unter «Dokumente»
  Szenario: Die Mahnung sagt vor dem Senden, dass die E-Mail-Adresse fehlt
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung senden will
    Dann sagt die Mahnung vor dem Senden, dass für "Anna Keller" keine E-Mail-Adresse erfasst ist

  # #449 (Persona Dr. Weber P-1, P-2; Entscheid A): ohne Adresse wird keine E-Mail versucht, die Mahnung ist ein Brief
  Szenario: Ohne E-Mail-Adresse entsteht die Mahnung als Brief
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann meldet die Abrechnung "Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» als Brief zum Ausdrucken bereit."
    Und ist die "Zahlungserinnerung" an "Anna Keller" per Brief zu versenden

  # #449 (Punkt 3, #322; Entscheid V-2 A): bezahlt, bevor der Brief zur Post ging; der Brief bleibt unter «Dokumente»,
  # zählt aber nicht mehr als «Zu versenden»
  Szenario: Eine Mahnung nach der Zahlung geht nicht mehr hinaus
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und die Abrechnung 2024 von "Anna Keller" ist bezahlt
    Wenn der Liegenschaftsverwalter alle Dokumente ansieht
    Dann führen die Dokumente die "Zahlungserinnerung" an "Anna Keller" als "Nicht mehr versenden: Abrechnung bezahlt"
    Und ist die "Zahlungserinnerung" an "Anna Keller" nicht mehr bei den zu versendenden Dokumenten

  # #449 (Punkt 3): bezahlt, während die Liste «Zu versenden» offen war; Markieren lehnt Dwello ab
  Szenario: Eine Mahnung einer inzwischen bezahlten Abrechnung lässt sich nicht als versendet markieren
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Und die Abrechnung 2024 von "Anna Keller" ist bezahlt
    Wenn der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" als versendet markiert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab."

  # #449 (Entscheid V-4): eine ersetzte Abrechnung wird nicht gemahnt (Glossar «Ersetzt»)
  Szenario: Eine Mahnung einer ersetzten Abrechnung lässt sich nicht als versendet markieren
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Und die Abrechnung 2024 von "Anna Keller" ist ersetzt
    Wenn der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" als versendet markiert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Abrechnung ist durch eine berichtigte Abrechnung ersetzt. Schicken Sie diese Mahnung nicht mehr ab."

  # #545: ein Mahnbrief zählt erst, wenn er zur Post ging; vorher nennt Dwello weder sein Datum noch eine Frist ab ihm
  @wip
  Szenario: Ein Mahnbrief zählt erst ab dem Versand
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann nennt die Abrechnung keine letzte Mahnung
    Und sagt die Abrechnung, dass die Mahnung noch zu versenden ist
    Und sagt die Liste der Abrechnungen bei "Anna Keller", dass die Mahnung noch zu versenden ist

  # #545: beim Markieren erstellt Dwello den Brief neu, mit der Zahlungsfrist ab diesem Tag (#193)
  @wip
  Szenario: Ein versendeter Mahnbrief zählt ab dem Tag des Versands
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Wenn der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" in den Dokumenten als versendet markiert
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann nennt die Abrechnung die letzte Mahnung von heute
    Und nennt die Abrechnung die nächste Mahnung ab dem Tag in 11 Tagen

  # #545: bezahlt, bevor der Brief zur Post ging: er war nie eine Mahnung an den Mieter
  @wip
  Szenario: Eine bezahlte Abrechnung nennt keinen Mahnbrief, der nie zur Post ging
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und die Abrechnung 2024 von "Anna Keller" ist bezahlt
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann nennt die Abrechnung keine letzte Mahnung
