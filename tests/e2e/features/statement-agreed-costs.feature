# language: de
@statements
Funktionalität: Nur vereinbarte Nebenkosten abrechnen
  Als Liegenschaftsverwalter
  möchte ich jedem Mieter nur die Nebenkosten abrechnen, die sein Mietvertrag vorsieht
  damit er nur bezahlt, was er schuldet (Art. 257a Abs. 2 OR)

  # #91: jeder Mietvertrag hält die vereinbarten Nebenkosten; ein neuer beginnt mit allen umlagefähigen Kategorien.
  # Heizkosten nach Fläche: 250 und 750 Franken, Lift nach Fläche: 100 und 300 Franken
  Grundlage:
    Angenommen das Gebäude "Rosenhof" in "Winterthur" existiert
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.01" mit 50 m²
    Und im Gebäude "Rosenhof" gibt es die leere Wohnung "1.02" mit 150 m²
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken
    Und der Mieter "Beat Huber" existiert
    Und "Beat Huber" mietet die Wohnung "1.02" seit "2020-01-01" für "1900" Franken
    Und im Gebäude "Rosenhof" gibt es eine Heizkostenrechnung über "1000" Franken für 2024
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der Kategorie "Lift" über "400" Franken vom "2024-06-30"
    Und der Liegenschaftsverwalter ist auf der Seite zum Erstellen von Abrechnungen

  @api
  Szenario: Nicht vereinbarte Nebenkosten kommen nicht in die Abrechnung
    Angenommen im Mietvertrag von "Anna Keller" ist "Lift" nicht vereinbart
    Wenn der Liegenschaftsverwalter die Vorschau der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale öffnet
    Dann kostet die Abrechnung von "Anna Keller" "CHF 250.00"
    Und kostet die Abrechnung von "Beat Huber" "CHF 1’050.00"

  # Eine Kategorie, die es beim Erfassen des Mietvertrags noch nicht gab, ist nicht vereinbart, bis der
  # Liegenschaftsverwalter es angibt
  Szenario: Der Assistent fragt nach einer Kategorie, die für den Mietvertrag neu ist
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Wenn der Liegenschaftsverwalter die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale öffnet
    Dann fragt der Assistent, ob "Treppenhausreinigung" im Mietvertrag von "Anna Keller" vereinbart ist
    Und fragt der Assistent, ob "Treppenhausreinigung" im Mietvertrag von "Beat Huber" vereinbart ist

  Szenario: Ohne Antwort geht der Assistent nicht weiter
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter weitergeht
    Dann meldet die Frage zum Mietvertrag von "Anna Keller" "Bitte wählen Sie, ob diese Nebenkosten im Mietvertrag vereinbart sind."
    Und bleibt der Assistent beim Schritt mit der Verwaltungspauschale

  # Treppenhausreinigung nach Fläche: 50 und 150 Franken
  Szenario: Die Antwort gilt für die Abrechnung
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter angibt, dass "Treppenhausreinigung" im Mietvertrag von "Anna Keller" vereinbart ist
    Und der Liegenschaftsverwalter angibt, dass "Treppenhausreinigung" im Mietvertrag von "Beat Huber" nicht vereinbart ist
    Und der Liegenschaftsverwalter weitergeht
    Dann kostet die Abrechnung von "Anna Keller" "CHF 400.00"
    Und kostet die Abrechnung von "Beat Huber" "CHF 1’050.00"

  @wip
  Szenario: Die Antwort bleibt beim Mietvertrag
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter angibt, dass "Treppenhausreinigung" im Mietvertrag von "Anna Keller" nicht vereinbart ist
    Und der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" öffnet
    Dann nennt der Mietvertrag die vereinbarten Nebenkosten "Lift"
    Aber nicht die Nebenkosten "Treppenhausreinigung"

  Szenario: Der Assistent nennt nicht vereinbarte Nebenkosten der Periode, statt wieder zu fragen
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und im Mietvertrag von "Anna Keller" ist "Treppenhausreinigung" nicht vereinbart
    Und im Mietvertrag von "Beat Huber" ist "Treppenhausreinigung" vereinbart
    Wenn der Liegenschaftsverwalter die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale öffnet
    Dann nennt der Assistent "Treppenhausreinigung" im Mietvertrag von "Anna Keller" als nicht vereinbart
    Und fragt der Assistent nicht, ob Nebenkosten vereinbart sind

  Szenario: Mietvertrag mit nicht vereinbarten Nebenkosten öffnen
    Angenommen im Mietvertrag von "Anna Keller" ist "Lift" nicht vereinbart
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" mit nicht vereinbarten Nebenkosten öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  Szenario: Die Antwort lässt sich nicht speichern
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Und das Speichern der Antworten zum Mietvertrag von "Anna Keller" ist gestört
    Wenn der Liegenschaftsverwalter angibt, dass "Treppenhausreinigung" im Mietvertrag von "Anna Keller" vereinbart ist
    Dann meldet die Frage zum Mietvertrag von "Anna Keller" "Ihre Antwort wurde nicht gespeichert. Bitte versuchen Sie es nochmals."

  # M-2 der Fachreview: das PDF nennt die vereinbarten Kategorien, die es abrechnet, nicht jede angekreuzte
  Szenario: Das PDF nennt die vereinbarten Nebenkosten
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Mietvertrag von "Anna Keller" ist "Lift" nicht vereinbart
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Heizung."
    Aber steht im PDF nicht "Lift"
