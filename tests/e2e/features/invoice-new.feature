# language: de
@invoices
Funktionalität: Neue Rechnung erfassen
  Als Liegenschaftsverwalter
  möchte ich Rechnungen erfassen
  damit die Kosten in der Nebenkostenabrechnung auf die Mieter verteilt werden

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und der Liegenschaftsverwalter ist auf der Seite "Neue Rechnung"

  Szenario: Rechnung erfassen
    Wenn der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "450.00" Franken für "Treppenhausreinigung Q1" im Gebäude "Seeblick" in der Kategorie "Hauswart" erfasst
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
    Und die Rechnung von "Hauswart Huber" über "CHF 450.00" in der Kategorie "Hauswart" ist auffindbar

  @wip
  Szenario: Nicht umlagefähige Kategorie wählen
    Wenn der Liegenschaftsverwalter die Kategorie "Reparaturen" wählt
    Dann ist die Rechnung nicht als umlagefähig markiert
    Und erklärt das Formular "Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein."
    Und weist ein Hinweis darauf hin, dass die Kosten nicht auf die Mieter umgelegt werden können

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter die Rechnung ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie ein Gebäude"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen Rechnungssteller ein"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine Beschreibung ein"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen gültigen Betrag ein"

  # Datum als TT.MM.JJJJ, unabhängig von der Sprache des Browsers; die Punkte setzt das Feld selbst, getippte Punkte zählen nicht doppelt
  Szenario: Rechnungsdatum als TT.MM.JJJJ eintippen
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "31122025" eintippt
    Dann zeigt das Feld Rechnungsdatum "31.12.2025"
    Und steht unter dem Rechnungsdatum "Mittwoch, 31. Dezember 2025"
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "15.01.2026" eintippt
    Dann zeigt das Feld Rechnungsdatum "15.01.2026"
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "30022025" eintippt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Dieses Datum gibt es nicht"

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
