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

  # #378: fehlt die neue Rechnung in schon erstellten Abrechnungen, sagt Dwello nach dem Speichern, was zu tun ist
  Szenario: Rechnung einer schon abgerechneten Periode erfassen
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Wenn der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "450.00" Franken für "Treppenhausreinigung Q1" im Gebäude "Seeblick" in der Kategorie "Hauswart" erfasst
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und warnt die Rechnung "gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon"
    Und warnt die Rechnung "Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung."

  Szenario: Nicht umlagefähige Kategorie wählen
    Wenn der Liegenschaftsverwalter die Kategorie "Reparaturen" wählt
    Dann ist die Rechnung nicht als umlagefähig markiert
    Und erklärt das Formular "Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein."
    Und weist ein Hinweis darauf hin, dass die Kosten nicht auf die Mieter umgelegt werden können

  Szenario: Pflichtangaben fehlen
    Wenn der Liegenschaftsverwalter die Rechnung ohne Angaben speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie ein Gebäude."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen Rechnungssteller ein."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine Beschreibung ein."
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen gültigen Betrag ein."

  # Datum als TT.MM.JJJJ, unabhängig von der Sprache des Browsers; die Punkte setzt das Feld selbst, getippte Punkte zählen nicht doppelt
  Szenario: Rechnungsdatum als TT.MM.JJJJ eintippen
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "31122025" eintippt
    Dann zeigt das Feld Rechnungsdatum "31.12.2025"
    Und steht unter dem Rechnungsdatum "Mittwoch, 31. Dezember 2025"
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "15.01.2026" eintippt
    Dann zeigt das Feld Rechnungsdatum "15.01.2026"
    Wenn der Liegenschaftsverwalter als Rechnungsdatum "30022025" eintippt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Dieses Datum gibt es nicht"

  # #451 (Fachreview M-1): eine Lieferung von Heizmaterial in den Tank zählt ganz in der Abrechnungsperiode ihres
  # Lieferdatums, des Endes ihres Leistungszeitraums; der Satz steht bei einer Brennstoff-Kategorie (Code-Review C-2)
  Szenario: Der Leistungszeitraum erklärt die Lieferung von Heizmaterial
    Wenn der Liegenschaftsverwalter die Kategorie "Heizung" wählt
    Dann erklärt das Formular beim Leistungszeitraum "Tragen Sie als Beginn und als Ende den Tag der Lieferung ein. Die Lieferung zählt dann ganz in der Abrechnungsperiode dieses Tages, auch wenn die Rechnung erst später kommt."

  # Kosten, die nur alle paar Jahre anfallen, verteilt der Leistungszeitraum über diese Jahre (#254)
  Szenario: Der Leistungszeitraum erklärt Kosten über mehrere Jahre
    Dann erklärt das Formular beim Leistungszeitraum "Kosten, die nur alle paar Jahre anfallen, verteilen Sie mit dem Leistungszeitraum über diese Jahre."

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Rechnungsliste
