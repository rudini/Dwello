# language: de
@contracts
Funktionalität: Mietvertrag bearbeiten
  Als Liegenschaftsverwalter
  möchte ich Mietzins und Vertragsdaten anpassen
  damit Mietzinserhöhungen und Korrekturen im Mietvertrag stehen

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"

  Szenario: Mietzins anpassen
    Wenn der Liegenschaftsverwalter den Mietzins auf "980" Franken ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist
    Und sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 980.00"

  Szenario: Mietzins fehlt
    Wenn der Liegenschaftsverwalter den Mietzins leert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich"

  Szenario: Mietzins in Schweizer Schreibweise
    Wenn der Liegenschaftsverwalter den Mietzins auf "1'450" Franken ändert
    Dann sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 1’450.00"

  Szenario: Bearbeitung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  # Ein Tippfehler im Jahr soll den Mietvertrag nicht rückwirkend beenden
  Szenario: Vergangenes Vertragsende verlangt eine Bestätigung
    Wenn der Liegenschaftsverwalter das Vertragsende "2025-03-31" speichern will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende."

  Szenario: Vergangenes Vertragsende bestätigen
    Wenn der Liegenschaftsverwalter das Vertragsende "2025-03-31" speichert und die Folge bestätigt
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und endet der Mietvertrag am "31.03.2025"

  # Die Abrechnung 2025 enthält schon Mietstage bis Ende Jahr
  Szenario: Vertragsende vor dem Ende einer Abrechnung
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter das Vertragsende "2025-03-31" speichert und die Folge bestätigt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu."
