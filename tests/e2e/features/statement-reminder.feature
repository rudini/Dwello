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

  Szenario: Zweite Mahnung
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter eine Mahnung sendet
    Dann meldet die Abrechnung "2. Mahnung liegt als Brief zum Ausdrucken in den Dokumenten bereit."
