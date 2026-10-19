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
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken vermietet
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von "Anna Keller" gespeichert ist
    Und der Mietvertrag von "Anna Keller" ist in der Liste auffindbar

  Szenario: Vor dem Speichern alle Angaben prüfen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Mieter" mit "Anna Keller"
    Und zeigt die Prüfung "Wohnung" mit "2.01"
    Und zeigt die Prüfung "Vertragsbeginn" mit "Freitag, 1. Januar 2027"
    Und zeigt die Prüfung "Vertragsende" mit "Unbefristet"
    Und zeigt die Prüfung "Akonto" mit "CHF 180.00"
    Und zeigt die Prüfung "Monatlich total" mit "CHF 1’130.00"

  Szenario: Vertragsbeginn in der Vergangenheit bestätigen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2020-01-01" für "950" Franken vermietet und den Vertragsbeginn bestätigt
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Anna Keller" ist in der Liste auffindbar

  Szenario: Ohne Mieter geht es nicht weiter
    Wenn der Liegenschaftsverwalter ohne Angaben weitergeht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie einen Mieter aus."

  Szenario: Nettomiete fehlt
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" ohne Nettomiete vermieten will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich."

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

  # B-16 (#156): wer «Beenden» beim alten Mietvertrag vergessen hat, erfährt es vor der Prüfung
  Szenario: Mieter hat noch einen Mietvertrag ohne Vertragsende
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und "Anna Keller" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Dann erfährt der Liegenschaftsverwalter, dass "Anna Keller" einen Mietvertrag ohne Vertragsende für die Wohnung "2.02" hat

  Szenario: Vom Hinweis zum laufenden Mietvertrag
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und "Anna Keller" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter den laufenden Mietvertrag im Hinweis öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  # Ohne die Mietverträge der Wohnung ist unbekannt, ab wann sie frei ist (#143)
  Szenario: Mietverträge der Wohnung lassen sich nicht laden
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Dann sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Überschneidung noch nicht geprüft"

  Szenario: Die Prüfung nennt die nicht geladenen Mietverträge
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann sieht der Liegenschaftsverwalter in der Prüfung den Hinweis "Überschneidung noch nicht geprüft"

  # Ohne ihre Mietverträge sieht die Wohnung nicht wie eine freie aus (#151, Dr. Weber W-01)
  Szenario: Wohnung mit nicht geladenen Mietverträgen ist nicht geprüft
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Dann steht bei der Wohnung "2.01" in der Auswahl "(nicht geprüft)"

  # #57: «Entwurf» heisst nur der Abrechnungsstatus; die Eingaben im Assistenten sind «Ihre Angaben»
  Szenario: Angefangener Mietvertrag ist noch nicht gespeichert
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Dann erfährt der Liegenschaftsverwalter, dass seine Angaben nur in diesem Browser aufbewahrt und noch nicht gespeichert sind

  Szenario: Angefangenen Mietvertrag später fortsetzen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet
    Dann sieht der Liegenschaftsverwalter, dass seine Angaben wiederhergestellt sind
    Und sagt der Hinweis auf die wiederhergestellten Angaben "Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert."
    Und ist im Mietvertrag der Mieter "Anna Keller" gewählt

  Szenario: Angaben verwerfen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet
    Und der Liegenschaftsverwalter seine Angaben verwirft
    Dann ist im Mietvertrag kein Mieter gewählt

  Szenario: Neuen Mieter direkt im Mietvertrag erfassen
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter zum Schritt "Mieter" zurückgeht
    Und der Liegenschaftsverwalter im Mietvertrag den neuen Mieter "Peter Brunner" erfasst
    Dann ist im Mietvertrag der Mieter "Peter Brunner" gewählt
    Und der Liegenschaftsverwalter weitergeht
    Und ist im Mietvertrag die Wohnung "2.01" gewählt

  # P-17 (#144): die vorgewählte Wohnung bleibt auf dem Umweg über einen neuen Mieter
  Szenario: Vorgewählte Wohnung bleibt beim Erfassen eines neuen Mieters
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter im Mietvertrag den neuen Mieter "Peter Brunner" erfasst
    Und der Liegenschaftsverwalter weitergeht
    Dann ist im Mietvertrag die Wohnung "2.01" gewählt

  # P-17 (#144): die Beträge des letzten Mietvertrags der Wohnung sind vorgeschlagen und änderbar
  Szenario: Beträge des letzten Mietvertrags der Wohnung übernehmen
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.01" von "2024-01-01" bis "2025-12-31" für "900" Franken mit "150" Franken Akonto
    Und der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann schlägt der Schritt "Miete" die Nettomiete "900.00" und das Akonto "150.00" aus dem letzten Mietvertrag der Wohnung vor

  Szenario: Erfassung abbrechen
    Wenn der Liegenschaftsverwalter die Bearbeitung abbricht
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste

  # #89: ob im Mietvertrag eine Verwaltungspauschale vereinbart ist, wählt der Liegenschaftsverwalter bei jedem neuen
  # Mietvertrag selbst; Dwello schlägt nichts vor
  Szenario: Ohne Angabe zur Verwaltungspauschale geht es nicht weiter
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken ohne Angabe zur Verwaltungspauschale vermieten will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist."

  Szenario: Verwaltungspauschale mit eigenem Satz prüfen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit einer Verwaltungspauschale von "4" % bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Verwaltungspauschale" mit "Vereinbart, 4 %"

  # #77: eine neue Verwaltungspauschale während der Mietdauer ist eine einseitige Vertragsänderung (Art. 269d Abs. 1
  # und 3 OR): Formular, Begründung, mindestens zehn Tage vor Beginn der Kündigungsfrist, nächstmöglicher Kündigungstermin
  Szenario: Hilfe zu einer neuen Verwaltungspauschale während der Mietdauer
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann erfährt der Liegenschaftsverwalter, dass er eine neue Verwaltungspauschale mindestens zehn Tage vor Beginn der Kündigungsfrist begründet mitteilt

  # #91: ein neuer Mietvertrag beginnt mit allen umlagefähigen Kategorien; nur vereinbarte Nebenkosten darf der
  # Liegenschaftsverwalter abrechnen (Art. 257a Abs. 2 OR)
  Szenario: Ein neuer Mietvertrag vereinbart alle umlagefähigen Nebenkosten
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Vereinbarte Nebenkosten" mit "Heizung"
    Und zeigt die Prüfung "Vereinbarte Nebenkosten" mit "Lift"
    Aber zeigt die Prüfung "Vereinbarte Nebenkosten" ohne "Verwaltung"

  Szenario: Nicht vereinbarte Nebenkosten beim neuen Mietvertrag weglassen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken ohne die Nebenkosten "Lift" bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Vereinbarte Nebenkosten" mit "Heizung"
    Aber zeigt die Prüfung "Vereinbarte Nebenkosten" ohne "Lift"

  # #66: nur im Mietvertrag vereinbarte Nebenkosten darf der Liegenschaftsverwalter abrechnen (Art. 257a Abs. 2 OR)
  Szenario: Die Hilfe zum Akonto nennt die vereinbarten Nebenkosten
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann erfährt der Liegenschaftsverwalter, dass das Akonto ein Vorschuss für die im Mietvertrag vereinbarten Nebenkosten ist

  # #66: ohne Akonto bezahlt der Mieter meist eine Nebenkostenpauschale, oder es sind keine Nebenkosten vereinbart
  Szenario: Ohne Akonto erfährt der Liegenschaftsverwalter, was für Nebenkostenpauschale und vereinbarte Nebenkosten gilt
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann erfährt der Liegenschaftsverwalter, dass der Mieter ohne Akonto meist eine Nebenkostenpauschale bezahlt
    Und erfährt der Liegenschaftsverwalter, dass er sonst alle Häkchen bei «Vereinbarte Nebenkosten» entfernt
    Und erfährt der Liegenschaftsverwalter, dass vereinbarte Nebenkosten ohne Akonto ganz mit der Nebenkostenabrechnung bezahlt werden

  # #429: die Nebenkostenpauschale zählt im Monatlich total und wird nie abgerechnet
  Szenario: Mietvertrag mit Nebenkostenpauschale prüfen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "120" Franken Nebenkostenpauschale bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Nebenkostenpauschale" mit "CHF 120.00"
    Und zeigt die Prüfung "Monatlich total" mit "CHF 1’070.00"

  # #429 (fach-review V-2): auch die Nebenkostenpauschale des letzten Mietvertrags ist vorgeschlagen (#144)
  Szenario: Nebenkostenpauschale des letzten Mietvertrags übernehmen
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.01" von "2024-01-01" bis "2025-12-31" für "900" Franken mit "0" Franken Akonto
    Und der Mietvertrag von "Bruno Meier" hat "80" Franken Nebenkostenpauschale
    Und der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann schlägt der Schritt "Miete" die Nebenkostenpauschale "80.00" aus dem letzten Mietvertrag der Wohnung vor

  # #429: ohne Akonto sagt der Hinweis, wo die Nebenkostenpauschale steht; mit Pauschale und Häkchen warnt das Formular,
  # dass Dwello die angekreuzten Nebenkosten trotzdem abrechnet
  Szenario: Mit Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Dann erfährt der Liegenschaftsverwalter, wo er eine Nebenkostenpauschale einträgt
    Wenn der Liegenschaftsverwalter eine Nebenkostenpauschale von "120" Franken einträgt
    Dann warnt das Formular, dass Dwello die angekreuzten Nebenkosten trotzdem abrechnet

  # #432 (Dr. Weber 429 P-1): auch mit Akonto rechnet Dwello alle angekreuzten Nebenkosten ab, auch die der Pauschale
  Szenario: Mit Akonto und Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter ein Akonto von "200" Franken einträgt
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "50" Franken einträgt
    Dann warnt das Formular zur Nebenkostenpauschale "Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt."

  # #432 (Helga 432 P-1): mit Akonto sind einige Häkchen richtig; die Warnung gilt nur, solange alle angekreuzt sind
  Szenario: Mit Akonto verschwindet die Warnung zur Nebenkostenpauschale, sobald eine Nebenkosten abgewählt ist
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter ein Akonto von "200" Franken einträgt
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "50" Franken einträgt
    Dann warnt das Formular zur Nebenkostenpauschale "Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt."
    Wenn der Liegenschaftsverwalter eine der Nebenkosten abwählt
    Dann warnt das Formular nicht mehr zur Nebenkostenpauschale

  # #444 (Helga 432 P-2): mit Akonto und ohne Häkchen rechnet Dwello dem Mieter keine Nebenkosten ab
  @wip
  Szenario: Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter ein Akonto von "150" Franken einträgt
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "40" Franken einträgt
    Und der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann warnt das Formular "Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt."

  # persona Helga 429 P-1: deckt die Pauschale alle Nebenkosten, sind keine Häkchen richtig und kein Grund für eine Warnung
  Szenario: Mit Nebenkostenpauschale und ohne angekreuzte Nebenkosten warnt das Formular nicht
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "120" Franken einträgt
    Und der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann weist das Formular ohne Warnung darauf hin, dass keine Nebenkosten vereinbart sind
