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

  # Code-Review W10c S3 C-1: wer den Mietvertrag nur speichert, beantwortet die Frage nicht
  Szenario: Eine offene Frage bleibt nach dem Bearbeiten des Mietvertrags offen
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietzins auf "980" Franken ändert
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist
    Und der Liegenschaftsverwalter die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale öffnet
    Dann fragt der Assistent, ob "Treppenhausreinigung" im Mietvertrag von "Anna Keller" vereinbart ist

  # Code-Review W10c C-1: ohne die Prüfung entstünden Abrechnungen ohne die neue Kategorie, ohne dass jemand fragt
  Szenario: Die vereinbarten Nebenkosten lassen sich nicht prüfen
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und das Prüfen der vereinbarten Nebenkosten ist gestört
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter weitergeht
    Dann meldet der Assistent bei den vereinbarten Nebenkosten "Dwello konnte nicht prüfen, ob die Mietverträge alle Nebenkosten dieser Periode vereinbaren."
    Und bleibt der Assistent beim Schritt mit der Verwaltungspauschale

  # #439: «Weiter» ohne fertige Prüfung bleibt nicht stumm
  Szenario: Weitergehen ohne geprüfte Mietverträge sagt, worauf der Assistent wartet
    Angenommen es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und das Prüfen der vereinbarten Nebenkosten ist gestört
    Und der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen 2024 für das Gebäude "Rosenhof" mit 0 % Verwaltungspauschale geöffnet
    Wenn der Liegenschaftsverwalter weitergeht
    Dann erklärt der Assistent "Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat."

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

  # Fachreview W10c Runde 2 M-1: eine Rechnung ohne Kategorie vereinbart kein Mietvertrag (#382)
  Szenario: Neben einer Rechnung ohne Kategorie nennt das PDF keine vereinbarten Nebenkosten
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und im Gebäude "Rosenhof" gibt es eine Rechnung ohne Kategorie über "120" Franken vom "2024-06-30"
    Und für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter das PDF der Abrechnung erstellt
    Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt
    Dann steht im PDF "Nicht kategorisiert"
    Aber steht im PDF nicht "vereinbarten Nebenkosten"

  # Merge-Review W10c-2 C-1: die berichtigte Abrechnung (#120) entsteht ohne den Assistenten, der nach offenen
  # Kategorien fragt; sie entsteht erst, wenn die Frage beantwortet ist
  Szenario: Keine berichtigte Abrechnung, solange eine Kategorie nicht beantwortet ist
    Angenommen für "Anna Keller" im Gebäude "Rosenhof" gibt es die Nebenkostenabrechnung 2024
    Und die Abrechnung 2024 von "Anna Keller" ist versendet
    Und die Abrechnung 2024 von "Anna Keller" ist ersetzt
    Und es gibt die umlagefähige Kategorie "Treppenhausreinigung"
    Und im Gebäude "Rosenhof" gibt es eine Rechnung der eigenen Kategorie "Treppenhausreinigung" über "200" Franken vom "2024-05-31"
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"
    Wenn der Liegenschaftsverwalter die berichtigte Abrechnung erstellt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Beim Mietvertrag ist noch nicht angegeben, ob diese Nebenkosten vereinbart sind"
    Und hat die Abrechnung den Status "Ersetzt"
