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
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Nettomiete ist erforderlich."

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
    Und zeigt der Mietvertrag "Befristet bis 31.03.2025"

  # Die Abrechnung 2025 enthält schon Mietstage bis Ende Jahr
  Szenario: Vertragsende vor dem Ende einer Abrechnung
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter das Vertragsende "2025-03-31" speichert und die Folge bestätigt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."

  # Die Abrechnung 2025 rechnet ab dem 01.01.2025: ein späterer Vertragsbeginn änderte ihre Mietstage
  Szenario: Vertragsbeginn nach dem Beginn einer Abrechnung
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter den Vertragsbeginn "2025-05-01" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."

  # #133: die Abrechnung 2025 rechnet ab dem 01.01.2025; «Abgerechnet bis» darin änderte ihre Mietstage
  Szenario: «Abgerechnet bis» nach dem Beginn einer Abrechnung
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2025-06-30" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."

  # #120, #358: eine versendete Abrechnung sperrt das Datum, bis sie ersetzt ist
  Szenario: Vertragsbeginn nach dem Beginn einer versendeten Abrechnung
    Angenommen für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter den Vertragsbeginn "2025-05-01" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Stimmt es, berichtigen Sie zuerst jede dieser Abrechnungen."

  Szenario: Vertragsbeginn nach dem Berichtigen der Abrechnung ändern
    Angenommen für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Und die Abrechnung 2025 von "Anna Keller" ist ersetzt
    Wenn der Liegenschaftsverwalter den Vertragsbeginn "2025-05-01" speichert
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und beginnt der Mietvertrag von "Anna Keller" laut Liste seit "01.05.2025"

  # Ohne die Mietverträge der Wohnung ist eine Überschneidung nicht auszuschliessen (#143)
  Szenario: Mietverträge der Wohnung lassen sich nicht laden
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Dann sieht der Liegenschaftsverwalter bei der Wohnung den Hinweis "Überschneidung noch nicht geprüft"
    Und sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung."

  # Statt die Seite neu zu laden, bleibt die Eingabe erhalten (#151)
  Szenario: Mietverträge der Wohnung erneut laden
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Nettomiete "980" einträgt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann ist die Nettomiete "980" noch eingetragen
    Und sieht der Liegenschaftsverwalter bei der Wohnung keinen Hinweis mehr
    Und sieht der Liegenschaftsverwalter beim Vertragsbeginn keinen Hinweis mehr

  Szenario: Mietverträge der Wohnung lassen sich auch beim zweiten Mal nicht laden
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Mietverträge der Wohnung erneut zu laden versucht
    Dann meldet Dwello den Fehler "Die Mietverträge der Wohnung konnten wieder nicht geladen werden."

  # Eine Kündigung lässt sich nur gemeinsam oder durch die Schlichtungsbehörde oder ein Gericht aufheben
  Szenario: Kündigung aufheben
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Dann erfährt der Liegenschaftsverwalter bei «Kündigung aufheben», wann sich eine Kündigung aufheben lässt
    Wenn der Liegenschaftsverwalter die Kündigung aufhebt
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und ist der Mietvertrag unbefristet

  # A-10: auch unter «Bearbeiten» führt der Weg über das Löschen des Entwurfs
  Szenario: Entwurf löschen und Mietvertrag speichern
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter den Vertragsbeginn "2025-05-01" speichert
    Und der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag speichert
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" und 2025
    Und beginnt der Mietvertrag von "Anna Keller" laut Liste seit "01.05.2025"
    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"

  # #133 (Fachreview V-10): deckt «Abgerechnet bis» die ganze Periode des Entwurfs ab, entsteht keine neue Abrechnung
  Szenario: Entwurf löschen, den «Abgerechnet bis» ganz abdeckt
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2025-12-31" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung."
    Wenn der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag speichert
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und zeigt der Mietvertrag «Abgerechnet bis» "31.12.2025"
    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"

  # B-15 (#152): ein Mieterwechsel oder ein Wechsel der Wohnung ist ein neuer Mietvertrag
  Szenario: Mieter und Wohnung stehen im Mietvertrag fest
    Dann nennt der Mietvertrag den Mieter "Anna Keller" und die Wohnung "2.01"
    Und kann der Liegenschaftsverwalter Mieter und Wohnung nicht ändern
    Und erfährt der Liegenschaftsverwalter, dass er bei einem Mieterwechsel einen neuen Mietvertrag erfasst

  # #89: bestehende Mietverträge haben keine vereinbarte Verwaltungspauschale, bis der Liegenschaftsverwalter nachträgt,
  # was im unterschriebenen Mietvertrag steht; eine neue Pauschale braucht das amtliche Formular (Art. 269d Abs. 3 OR)
  Szenario: Vereinbarte Verwaltungspauschale nachtragen
    Angenommen im Mietvertrag von "Anna Keller" ist keine Verwaltungspauschale vereinbart
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter einträgt, dass im Mietvertrag die Verwaltungspauschale zum Satz des Abrechnungslaufs vereinbart ist
    Dann zeigt der Mietvertrag bei der Verwaltungspauschale "Vereinbart, Satz des Abrechnungslaufs"

  # #133: vor dem Wechsel zu Dwello hat der Liegenschaftsverwalter die Nebenkosten selbst abgerechnet
  Szenario: Ausserhalb von Dwello abgerechnete Zeit eintragen
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2025-12-31" ausserhalb von Dwello abgerechnet sind
    Dann zeigt der Mietvertrag «Abgerechnet bis» "31.12.2025"

  Szenario: Hilfe zu «Abgerechnet bis»
    Dann erfährt der Liegenschaftsverwalter, dass Dwello die Nebenkosten erst ab dem Tag nach «Abgerechnet bis» abrechnet

  # F-23 (#155): beim Tod des Mieters geht der Mietvertrag auf die Erben über, er endet nicht
  Szenario: Beim Tod des Mieters läuft der Mietvertrag weiter
    Dann erfährt der Liegenschaftsverwalter, dass der Mietvertrag beim Tod des Mieters weiterläuft
    Und erfährt der Liegenschaftsverwalter, dass er die Adresse der Erben als Korrespondenzadresse einträgt

  # B-16 (#156): der neue Mietvertrag desselben Mieters beginnt frühestens am Tag nach dem Vertragsende
  Szenario: Neuer Mietvertrag nach dem Vertragsende
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2099-03-31" gekündigt
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter aus dem Mietvertrag einen neuen Mietvertrag erfassen will
    Dann ist im Mietvertrag der Mieter "Anna Keller" gewählt
    Und schlägt der neue Mietvertrag den Vertragsbeginn "2099-04-01" vor

  # #91: die vereinbarten Nebenkosten stehen beim Mietvertrag; nicht vereinbarte rechnet Dwello nicht ab
  Szenario: Nebenkosten als nicht vereinbart eintragen
    Wenn der Liegenschaftsverwalter einträgt, dass im Mietvertrag "Lift" nicht vereinbart ist
    Dann nennt der Mietvertrag die vereinbarten Nebenkosten "Heizung"
    Aber nicht die Nebenkosten "Lift"

  # Persona Marco W10c P-1: ohne Häkchen rechnet Dwello keine Nebenkosten ab, das soll nicht unbemerkt geschehen
  Szenario: Das Formular warnt, wenn keine Nebenkosten vereinbart sind
    Wenn der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann warnt das Formular "Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab."

  # #66: eine Mietzinserhöhung folgt Art. 269d OR, nicht nur den Kündigungsfristen
  Szenario: Der laufende Mietvertrag nennt die Regeln einer Mietzinserhöhung
    Dann erfährt der Liegenschaftsverwalter, dass eine Mietzinserhöhung das amtliche Formular braucht und frühestens auf den nächsten Kündigungstermin gilt

  # #66, #76: ein befristeter Mietvertrag hat vor seinem Ende keinen Kündigungstermin
  Szenario: Der laufende befristete Mietvertrag nennt die Regel einer Mietzinserhöhung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "2.02" befristet von "2024-01-01" bis "2099-12-31" für "900" Franken mit "20" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Lea Graf"
    Dann erfährt der Liegenschaftsverwalter, dass bei einem befristeten Mietvertrag eine Mietzinserhöhung erst nach dem Vertragsende möglich ist
