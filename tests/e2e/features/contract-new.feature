# language: de
@contracts
Funktionalität: Neuen Mietvertrag erfassen
  Als Liegenschaftsverwalter
  möchte ich einen Mietvertrag Schritt für Schritt erfassen
  damit Mietzins und Nebenkosten dem richtigen Mieter zugeordnet werden

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"

  Szenario: Unbefristeten Mietvertrag erfassen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2025-01-01" für "950" Franken vermietet
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist
    Und der Mietvertrag von "Anna Keller" ist in der Liste auffindbar

  Szenario: Vor dem Speichern alle Angaben prüfen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2025-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Mieter" mit "Anna Keller"
    Und zeigt die Prüfung "Wohnung" mit "2.01"
    Und zeigt die Prüfung "Vertragsbeginn" mit "Mittwoch, 1. Januar 2025"
    Und zeigt die Prüfung "Vertragsende" mit "Unbefristet"
    Und zeigt die Prüfung "Akonto" mit "CHF 180.00"
    Und zeigt die Prüfung "Monatlich total" mit "CHF 1’130.00"

  Szenario: Ohne Mieter geht es nicht weiter
    Wenn der Liegenschaftsverwalter ohne Angaben weitergeht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie einen Mieter aus"

  Szenario: Nettomiete fehlt
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2025-01-01" ohne Nettomiete vermieten will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich"

  Szenario: Zurück verliert keine Angaben
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter zum Schritt "Mieter" zurückgeht
    Dann ist im Mietvertrag der Mieter "Anna Keller" gewählt

  Szenario: Vermietete Wohnung ist nicht verfügbar
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Dann kann der Liegenschaftsverwalter die Wohnung "2.02" nicht auswählen

  Szenario: Angefangenen Mietvertrag später fortsetzen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet
    Dann sieht der Liegenschaftsverwalter, dass sein Entwurf wiederhergestellt ist
    Und ist im Mietvertrag der Mieter "Anna Keller" gewählt

  Szenario: Entwurf verwerfen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet
    Und der Liegenschaftsverwalter den Entwurf verwirft
    Dann ist im Mietvertrag kein Mieter gewählt

  Szenario: Neuen Mieter direkt im Mietvertrag erfassen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter zum Schritt "Mieter" zurückgeht
    Und der Liegenschaftsverwalter im Mietvertrag den neuen Mieter "Peter Brunner" erfasst
    Dann ist im Mietvertrag der Mieter "Peter Brunner" gewählt
    Und der Liegenschaftsverwalter weitergeht
    Und ist im Mietvertrag die Wohnung "2.01" gewählt

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
