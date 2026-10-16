# language: de
@tenants
Funktionalität: Neuer Mieter
  Als Liegenschaftsverwalter
  möchte ich neue Mieter mit ihrem Korrespondenzweg erfassen
  damit Mahnungen und Schreiben sie erreichen

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Neuer Mieter"

  Szenario: Mieter mit Korrespondenz per E-Mail erfassen
    Wenn der Liegenschaftsverwalter den Mieter "Lea Graf" mit Korrespondenz per E-Mail erfasst
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lea Graf"
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass "Lea Graf" gespeichert ist
    Und "Lea Graf" erhält Korrespondenz "Per E-Mail"

  # Die Adresse des Mieters heisst Korrespondenzadresse: dorthin geht die Post, nach dem Auszug nicht mehr die Wohnung (#68)
  @wip
  Szenario: Die Korrespondenzadresse sagt, wohin die Post geht
    Dann erklärt die Seite bei der Korrespondenzadresse "Hierhin gehen Abrechnungen und Mahnungen; nach dem Auszug die neue Adresse eintragen"

  Szenario: Name ist erforderlich
    Wenn der Liegenschaftsverwalter den Mieter ohne Namen erfassen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nachname ist erforderlich"

  Szenario: Erfassen abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Mieterliste
