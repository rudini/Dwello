# language: de
@tenants
Funktionalität: Mieter bearbeiten
  Als Liegenschaftsverwalter
  möchte ich festlegen, wie ein Mieter Mahnungen und andere Schreiben erhält
  damit sie ihn per E-Mail oder per Brief erreichen

  Grundlage:
    Angenommen der Mieter "Anna Keller" existiert
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mieters "Anna Keller"

  @wip
  Szenario: Korrespondenz per Brief festlegen
    Wenn der Liegenschaftsverwalter die Korrespondenz per Brief an "Ahornweg 3", "8400 Winterthur" festlegt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
    Und "Anna Keller" erhält Korrespondenz "Per Brief"
    Und die Korrespondenzadresse von "Anna Keller" ist "Ahornweg 3, 8400 Winterthur"

  # Ein Mieter, der ins Ausland zieht: die Korrespondenzadresse hat ein Land, ohne Angabe die Schweiz (#102)
  @wip
  Szenario: Korrespondenzadresse im Ausland festlegen
    Wenn der Liegenschaftsverwalter die Korrespondenz per Brief an "Marktstätte 3", "78462 Konstanz" in "Deutschland" festlegt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
    Und die Korrespondenzadresse von "Anna Keller" ist "Marktstätte 3, 78462 Konstanz, Deutschland"

  Szenario: Sprache der Korrespondenz festlegen
    Angenommen "Anna Keller" wünscht Korrespondenz per Brief
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mieters "Anna Keller"
    Wenn der Liegenschaftsverwalter die Sprache "Französisch" festlegt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
    Und "Anna Keller" erhält Korrespondenz auf "Französisch"

  Szenario: Korrespondenz per E-Mail braucht eine E-Mail-Adresse
    Wenn der Liegenschaftsverwalter die Korrespondenz per E-Mail festlegt, ohne E-Mail-Adresse
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Für die Korrespondenz per E-Mail ist eine E-Mail-Adresse erforderlich"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"
