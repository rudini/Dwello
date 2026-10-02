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

  Szenario: Nicht umlagefähige Kategorie wählen
    Wenn der Liegenschaftsverwalter die Kategorie "Reparaturen" wählt
    Dann ist die Rechnung nicht als umlagefähig markiert
    Und weist ein Hinweis darauf hin, dass die Kosten nicht auf die Mieter umgelegt werden können

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter die Rechnung ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie ein Gebäude"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen Lieferanten ein"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine Beschreibung ein"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen gültigen Betrag ein"

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste

  Szenario: Über den Breadcrumb zur Rechnungsliste
    Wenn der Liegenschaftsverwalter im Breadcrumb "Rechnungen" wählt
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
