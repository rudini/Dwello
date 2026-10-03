# language: de
@tenants
Funktionalität: Mieter bearbeiten
  Als Liegenschaftsverwalter
  möchte ich festlegen, wie ein Mieter Mahnungen und andere Schreiben erhält
  damit sie ihn per E-Mail oder per Brief erreichen

  Grundlage:
    Angenommen der Mieter "Anna Keller" existiert
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mieters "Anna Keller"

  Szenario: Korrespondenz per Brief festlegen
    Wenn der Liegenschaftsverwalter die Korrespondenz per Brief an "Ahornweg 3", "8400 Winterthur" festlegt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
    Und "Anna Keller" erhält Korrespondenz "Per Brief"

  Szenario: Korrespondenz per E-Mail braucht eine E-Mail-Adresse
    Wenn der Liegenschaftsverwalter die Korrespondenz per E-Mail festlegt, ohne E-Mail-Adresse
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Für die Korrespondenz per E-Mail ist eine E-Mail-Adresse erforderlich"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"

  Szenario: Über den Breadcrumb zur Mieterliste
    Wenn der Liegenschaftsverwalter im Breadcrumb "Mieter" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Mieter"

  Szenario: Über den Breadcrumb zum Mieter
    Wenn der Liegenschaftsverwalter im Breadcrumb "Anna Keller" wählt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
