# language: de
@documents
Funktionalität: Dokumente
  Als Liegenschaftsverwalter
  möchte ich sehen, welche Briefe noch zu versenden sind
  damit ich sie ausdrucke, verschicke und als versendet festhalte

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und für "Anna Keller" im Gebäude "Ahornhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und "Anna Keller" wünscht Korrespondenz per Brief
    Und "Anna Keller" hat für die Abrechnung 2024 bereits eine Zahlungserinnerung erhalten
    Und der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten

  Szenario: Brief liegt zum Versand bereit
    Dann ist die "Zahlungserinnerung" an "Anna Keller" zu versenden

  Szenario: Brief als versendet markieren
    Wenn der Liegenschaftsverwalter die "Zahlungserinnerung" an "Anna Keller" als versendet markiert
    Dann ist die "Zahlungserinnerung" an "Anna Keller" nicht mehr zu versenden
