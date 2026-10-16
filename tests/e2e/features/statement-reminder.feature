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
    Dann meldet die Abrechnung "Zahlungserinnerung wurde per E-Mail versendet."
    Und "Anna Keller" hat die Zahlungserinnerung per E-Mail mit PDF erhalten
    Und die Abrechnung führt die "Zahlungserinnerung" als "Versendet"

  Szenario: Mahnung per Brief
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann meldet die Abrechnung "Zahlungserinnerung liegt als Brief zum Ausdrucken in den Dokumenten bereit."
    Und die Abrechnung führt die "Zahlungserinnerung" als "Zu versenden"

  # Jede Mahnung setzt eine neue Zahlungsfrist; die nächste Mahnstufe erst ab dem Tag danach (#107).
  # Dass sie danach möglich ist, prüft reminders.pg.test.ts: die Uhr des Backends lässt sich hier nicht vorstellen.
  @wip
  Szenario: Nächste Mahnung erst nach der Zahlungsfrist der letzten
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Dann führt die Abrechnung die "Zahlungserinnerung" mit der Zahlungsfrist in 10 Tagen
    Und bietet die Abrechnung keine Mahnung an
    Und nennt die Abrechnung die nächste Mahnung ab dem Tag in 11 Tagen
    Und nennt die Liste der Abrechnungen bei "Anna Keller" die nächste Mahnung ab dem Tag in 11 Tagen

  # Die E-Mail kam nicht an, der Verwalter hat den Brief ausgedruckt und per Post geschickt (#194)
  @wip
  Szenario: Nach gescheiterter E-Mail per Post versendete Mahnung gilt als Brief
    Angenommen "Anna Keller" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Und der Liegenschaftsverwalter eine Mahnung sendet
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten
    Wenn der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" als versendet markiert
    Dann ist die "Zahlungserinnerung" an "Anna Keller" per Brief versendet festgehalten
