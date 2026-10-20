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

  # #447 (Entscheid in #402, Punkt 2): auch beim Bearbeiten heisst ein eigener Satz von 0 % «Nein»
  Szenario: Eigener Satz von 0 % wird beim Bearbeiten abgelehnt
    Angenommen der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter einträgt, dass im Mietvertrag die Verwaltungspauschale mit einem eigenen Satz von "0" % vereinbart ist
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein»."

  # #133: vor dem Wechsel zu Dwello hat der Liegenschaftsverwalter die Nebenkosten selbst abgerechnet
  Szenario: Ausserhalb von Dwello abgerechnete Zeit eintragen
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2025-12-31" ausserhalb von Dwello abgerechnet sind
    Dann zeigt der Mietvertrag «Abgerechnet bis» "31.12.2025"

  # #453 (#337): eine Abrechnung entsteht erst nach dem Ende ihrer Periode; ein Datum vor dem Vertragsbeginn wirkt nicht
  Szenario: «Abgerechnet bis» in der Zukunft
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2099-12-31" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Abgerechnet bis kann nicht in der Zukunft liegen. Tragen Sie den letzten Tag der letzten Abrechnung ein, die ausserhalb von Dwello erstellt wurde."

  Szenario: «Abgerechnet bis» vor dem Vertragsbeginn
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2024-03-31" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Abgerechnet bis liegt vor dem Vertragsbeginn 01.04.2024. Lassen Sie das Feld leer, wenn für diesen Mietvertrag noch nichts ausserhalb von Dwello abgerechnet ist."

  # #499: eine Periode mit einer versendeten Dwello-Abrechnung ist nicht ausserhalb von Dwello abgerechnet; der Weg über
  # das Berichtigen endete in einer Sackgasse (Persona Dr. Weber 453 P-1)
  @wip
  Szenario: «Abgerechnet bis» über eine versendete Abrechnung
    Angenommen für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2025-06-30" ausserhalb von Dwello abgerechnet sind
    Dann sagt das Feld «Abgerechnet bis» "«Abgerechnet bis» kann nur Tage ohne Dwello-Abrechnung decken. Tragen Sie höchstens den Tag vor dem Beginn dieser Abrechnung ein: 31.12.2024."
    Und nennt das Feld «Abgerechnet bis» die Abrechnung 2025 von "Anna Keller"
    Aber rät die Fehlermeldung nicht zum Berichtigen

  @wip
  Szenario: «Abgerechnet bis» bis zum Tag vor einer versendeten Abrechnung
    Angenommen für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis "2024-12-31" ausserhalb von Dwello abgerechnet sind
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und zeigt der Mietvertrag «Abgerechnet bis» "31.12.2024"

  # #480: auch ein Mietvertrag, der bis «Abgerechnet bis» endet, erhält keine Abrechnung
  Szenario: Hilfe zu «Abgerechnet bis»
    Dann erfährt der Liegenschaftsverwalter, dass Dwello die Nebenkosten erst ab dem Tag nach «Abgerechnet bis» abrechnet
    Und erfährt der Liegenschaftsverwalter, dass Dwello keine Abrechnung erstellt, wenn der Mietvertrag bis «Abgerechnet bis» endet

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
  # Persona Helga 66b P-2: bei einer Nebenkostenpauschale bleiben die Häkchen leer (#66)
  Szenario: Das Formular warnt, wenn keine Nebenkosten vereinbart sind
    Wenn der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann warnt das Formular "Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab."
    Und warnt das Formular "Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer."

  # #66: eine Mietzinserhöhung folgt Art. 269d OR, nicht nur den Kündigungsfristen
  Szenario: Der laufende Mietvertrag nennt die Regeln einer Mietzinserhöhung
    Dann erfährt der Liegenschaftsverwalter, dass eine Mietzinserhöhung das amtliche Formular braucht und frühestens auf den nächsten Kündigungstermin gilt

  # #66, #76: ein befristeter Mietvertrag hat vor seinem Ende keinen Kündigungstermin; #388: auch eine vorgesehene
  # Erhöhung braucht das amtliche Formular
  Szenario: Der laufende befristete Mietvertrag nennt die Regel einer Mietzinserhöhung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Lea Graf" existiert
    Und "Lea Graf" mietet die Wohnung "2.02" befristet von "2024-01-01" bis "2099-12-31" für "900" Franken mit "20" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Lea Graf"
    Dann erfährt der Liegenschaftsverwalter, dass bei einem befristeten Mietvertrag eine Mietzinserhöhung erst nach dem Vertragsende möglich ist
    Und erfährt der Liegenschaftsverwalter, dass er eine Erhöhung begründet und mit dem amtlichen Formular mitteilt

  # #429: die Nebenkostenpauschale steht beim Mietvertrag und zählt im Monatlich total
  Szenario: Nebenkostenpauschale nachtragen
    Wenn der Liegenschaftsverwalter die Nebenkostenpauschale auf "120" Franken setzt
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und zeigt der Mietvertrag die Nebenkostenpauschale "CHF 120.00"
    Und zeigt der Mietvertrag das Monatlich total "CHF 1’070.00"

  # #464: ein neues Akonto gilt ab einem Datum; das bisherige bleibt für die Zeit davor
  Szenario: Akonto ab einem Datum ändern
    Angenommen der Mietvertrag von "Anna Keller" hat "150" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter das Akonto ab "2025-07-01" auf "200" Franken ändert
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"
    Und zeigt der Mietvertrag das Akonto "CHF 150.00" vom "01.04.2024" bis "30.06.2025"
    Und zeigt der Mietvertrag das Akonto "CHF 200.00" ab "01.07.2025"

  # #464 (#90): das Akonto zählt als vereinbart, nicht als bezahlt; eine Erhöhung braucht das amtliche Formular
  Szenario: Die Hilfe zum Akonto nennt, wie Dwello es abrechnet
    Dann erfährt der Liegenschaftsverwalter, dass Dwello das vereinbarte Akonto abrechnet und fehlende Zahlungen ausserhalb von Dwello geregelt werden
    Und erfährt der Liegenschaftsverwalter, dass eine Erhöhung des Akontos das amtliche Formular braucht

  # #464 (F-3): ein neues Akonto darf eine schon erstellte Abrechnung nicht stillschweigend ändern
  Szenario: Akonto in einer schon abgerechneten Zeit
    Angenommen für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter das Akonto ab "2025-07-01" auf "200" Franken ändert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Gilt das neue Akonto schon ab 01.07.2025, berichtigen Sie zuerst diese Abrechnung. Gilt es erst später, wählen Sie ein «Gültig ab» ab 01.01.2026."

  # #464 (Persona Helga 464-2 P-1): das Formular nennt die Akonto-Beträge, die schon eingetragen sind
  Szenario: Das Formular nennt die eingetragenen Akonto-Beträge
    Angenommen der Mietvertrag von "Anna Keller" hat "150" Franken Akonto
    Und der Mietvertrag von "Anna Keller" hat ab "2099-01-01" "200" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Dann zeigt der Mietvertrag das Akonto "CHF 150.00" vom "01.04.2024" bis "31.12.2098"
    Und zeigt der Mietvertrag das Akonto "CHF 200.00" ab "01.01.2099"

  # #464 (Fachreview 464-3 V-12): ein «Gültig ab» am neuen Vertragsbeginn korrigiert das erste Akonto
  Szenario: Vertragsbeginn und erstes Akonto zusammen korrigieren
    Angenommen der Mietvertrag von "Anna Keller" hat "150" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Vertragsbeginn "2024-03-15" mit "180" Franken Akonto ab "2024-03-15" speichert
    Dann zeigt der Mietvertrag das Monatlich total "CHF 1’130.00"
