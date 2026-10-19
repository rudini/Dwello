# language: de
@invoices
Funktionalität: Rechnung bearbeiten
  Als Liegenschaftsverwalter
  möchte ich erfasste Rechnungen korrigieren
  damit die Nebenkostenabrechnung mit den richtigen Kosten rechnet

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter bearbeitet die Rechnung von "Hauswart Huber"

  # Wer eine schon abgerechnete Rechnung ändert, verschiebt Kosten: die Abrechnungen stimmen nicht mehr
  Szenario: Warnung beim Bearbeiten einer schon abgerechneten Rechnung
    Angenommen im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "1500" Franken
    Und für "Anna Keller" im Gebäude "Seeblick" gibt es die Nebenkostenabrechnung des laufenden Jahres
    Wenn der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" bearbeitet
    Dann warnt das Formular, dass es mit dieser Rechnung schon Abrechnungen gibt

  # #455 (#268): wer den Betrag ändert, sieht den Hinweis auf die abgezogenen Akontorechnungen beim Betrag
  @wip
  Szenario: Hinweis auf abgezogene Akontorechnungen beim Bearbeiten
    Angenommen "Werke Luzern" stellt dem Gebäude "Seeblick" "1250.00" Franken für "Allgemeinstrom Q1" in der Kategorie "Allgemeinstrom" in Rechnung, auf dem Beleg sind Akontorechnungen von "1000.00" Franken abgezogen
    Wenn der Liegenschaftsverwalter die Rechnung von "Werke Luzern" bearbeitet
    Dann steht im Formular beim Betrag "Auf dem Beleg sind Akontorechnungen von CHF 1’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug."
    Und erklärt der Hinweis im Formular beim Betrag "Prüfen Sie, dass sie nur einmal zählen: Die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist. Ergibt das 0, erfassen Sie die Schlussrechnung nicht. Ergibt es weniger als 0, erfassen Sie sie auch nicht: Verringern Sie den Betrag einer abgerechneten Akontorechnung um den Unterschied, und berichtigen Sie die Abrechnungen mit ihr."

  Szenario: Betrag korrigieren
    Wenn der Liegenschaftsverwalter den Betrag auf "480.00" Franken korrigiert
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter den Betrag "CHF 480.00"

  Szenario: Rechnung einer nicht umlagefähigen Kategorie zuordnen
    Wenn der Liegenschaftsverwalter die Rechnung der Kategorie "Reparaturen" zuordnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter die Kategorie "Reparaturen" und den Verteilschlüssel "Pro Fläche (m²)"
    Und ist die Rechnung nicht umlagefähig

  Szenario: Rechnung einer nicht umlagefähigen Kategorie lässt sich nicht als umlagefähig markieren
    Wenn der Liegenschaftsverwalter die Kategorie "Reparaturen" wählt
    Dann lässt sich die Rechnung nicht als umlagefähig markieren

  Szenario: Kategorie der KI mit Begründung überschreiben
    Angenommen die KI hat die Kategorie der Rechnung von "Hauswart Huber" vorgeschlagen
    Und der Liegenschaftsverwalter bearbeitet die Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnung mit dem Grund "Reparatur, keine Wartung" der Kategorie "Reparaturen" zuordnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter den Grund "Reparatur, keine Wartung" für die Änderung der KI-Kategorie

  Szenario: Rechnungssteller fehlt
    Wenn der Liegenschaftsverwalter die Rechnung ohne Rechnungssteller speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie einen Rechnungssteller ein."

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Rechnungsnummer korrigieren
    Angenommen die Rechnung von "Hauswart Huber" hat die Rechnungsnummer "R-1001"
    Und der Liegenschaftsverwalter bearbeitet die Rechnung von "Hauswart Huber"
    Wenn der Liegenschaftsverwalter die Rechnungsnummer auf "R-1002" korrigiert
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"
    Und sieht der Liegenschaftsverwalter die Rechnungsnummer "R-1002"
