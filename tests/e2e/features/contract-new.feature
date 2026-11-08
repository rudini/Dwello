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

  # #453 (#328): beim Wechsel zu Dwello erfasst der Liegenschaftsverwalter laufende Mietverträge; was schon ausserhalb von
  # Dwello abgerechnet ist, trägt er gleich im Assistenten ein
  Szenario: Der Hinweis zum Vertragsbeginn in der Vergangenheit nennt «Abgerechnet bis»
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter den Vertragsbeginn "2020-01-01" einträgt
    Dann sieht der Liegenschaftsverwalter beim Vertragsbeginn die Warnung "Sind die Nebenkosten schon ausserhalb von Dwello abgerechnet, tragen Sie unten «Abgerechnet bis» ein."

  Szenario: «Abgerechnet bis» im neuen Mietvertrag eintragen
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2020-01-01" für "950" Franken bis "2024-12-31" abgerechnet bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Abgerechnet bis" mit "Dienstag, 31. Dezember 2024"
    Wenn der Liegenschaftsverwalter den Mietvertrag speichert
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Wenn der Liegenschaftsverwalter den Mietvertrag von "Anna Keller" ansieht
    Dann zeigt der Mietvertrag «Abgerechnet bis» "31.12.2024"

  # #453 (#328): mit einem Vertragsbeginn ab heute ist noch nichts abgerechnet
  Szenario: Bei einem künftigen Vertragsbeginn fragt der Assistent nicht nach «Abgerechnet bis»
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter den Vertragsbeginn "2099-01-01" einträgt
    Dann fragt der Assistent nach dem Vertragsbeginn, aber nicht nach «Abgerechnet bis»

  # #453 (#337): eine Abrechnung entsteht erst nach dem Ende ihrer Periode; ein Datum vor dem Vertragsbeginn wirkt nicht
  Szenario: «Abgerechnet bis» in der Zukunft im neuen Mietvertrag
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter ab dem Vertragsbeginn "2020-01-01" einträgt, dass die Nebenkosten bis "2099-12-31" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Abgerechnet bis kann nicht in der Zukunft liegen. Tragen Sie den letzten Tag der letzten Abrechnung ein, die ausserhalb von Dwello erstellt wurde."

  Szenario: «Abgerechnet bis» vor dem Vertragsbeginn im neuen Mietvertrag
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter ab dem Vertragsbeginn "2020-01-01" einträgt, dass die Nebenkosten bis "2019-12-31" ausserhalb von Dwello abgerechnet sind
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Abgerechnet bis liegt vor dem Vertragsbeginn 01.01.2020. Lassen Sie das Feld leer, wenn für diesen Mietvertrag noch nichts ausserhalb von Dwello abgerechnet ist."

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
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Dann erfährt der Liegenschaftsverwalter, dass "Anna Keller" einen Mietvertrag ohne Vertragsende für die Wohnung "2.02" hat

  Szenario: Vom Hinweis zum laufenden Mietvertrag
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und "Anna Keller" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter den laufenden Mietvertrag im Hinweis öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Anna Keller"

  # Ohne die Mietverträge der Wohnung ist unbekannt, ab wann sie frei ist (#143)
  Szenario: Mietverträge der Wohnung lassen sich nicht laden
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Dann sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"

  Szenario: Die Prüfung nennt die nicht geladenen Mietverträge
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann sieht der Liegenschaftsverwalter in der Prüfung den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist"

  # #665 (Persona Sven B-13): wer mit der Tastatur zum Feld kommt, hört den Hinweis mit dem Feld
  Szenario: Die Wohnungsauswahl nennt die nicht geladenen Mietverträge
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Dann liest ein Screenreader bei der Wohnungsauswahl den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist" vor
    Und liest ein Screenreader bei der Wohnungsauswahl den Hinweis "Die anderen Mietverträge dieser Wohnung liessen sich nicht laden." vor

  # #669 (Persona Sven P-3): der Screenreader sagt den Hinweis, nicht den Namen der Schaltfläche dazu
  Szenario: Der angekündigte Hinweis bei der Wohnungsauswahl endet nicht mit «Erneut versuchen»
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Dann kündigt ein Screenreader bei der Wohnung den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist" ohne "Erneut versuchen" an

  # #669 (Persona Helga P-2): ohne Vertragsbeginn ist noch nichts zu prüfen
  Szenario: Die Meldung nach dem Laden bei der Wohnungsauswahl sagt nur, dass die Mietverträge geladen sind
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann bestätigt Dwello das Laden mit "Die Mietverträge der Wohnung sind geladen."

  # #669 (Personas Sven S-2, Helga H-3, fach-review V-5): eine Wohnung, die sich als nicht verfügbar zeigt, bleibt nicht gewählt
  Szenario: Nach dem Laden hebt Dwello die Wahl einer nicht verfügbaren Wohnung auf
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann warnt Dwello nach dem Laden mit "Die Mietverträge der Wohnung sind geladen. Die gewählte Wohnung ist nicht verfügbar; Dwello hat die Auswahl aufgehoben."
    Und ist im Mietvertrag keine Wohnung gewählt

  # #1153 (Personas Sven S-7, Helga H-6): nach dem Aufheben bleibt im Schritt stehen, welche Wohnung welcher Mietvertrag sperrt
  Szenario: Nach dem Aufheben der Wahl nennt der Schritt die Wohnung und ihren Mietvertrag
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Und der Liegenschaftsverwalter die Warnung schliesst
    Dann steht im Schritt «Wohnung» der Hinweis "Wohnung 2.01 · Ahornhof ist nicht verfügbar"
    Und erklärt der Hinweis im Schritt «Wohnung» "Für diese Wohnung ist ein unbefristeter Mietvertrag erfasst, der nicht gekündigt ist. Dwello hat die Auswahl darum aufgehoben. Ist dieser Mietvertrag gekündigt oder ein Vertragsende vereinbart, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung."
    Und bietet der Hinweis im Schritt «Wohnung» den Link "Zum Mietvertrag von Bruno Meier"

  # #1158 (Personas Sven P-1, Helga): nach «Meldung schliessen» steht der Fokus wieder dort, wo er vor der Meldung stand
  @wip
  Szenario: Nach «Meldung schliessen» steht der Fokus wieder auf dem Schritt «Wohnung»
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Und der Liegenschaftsverwalter die Warnung mit der Tastatur schliesst
    Dann steht der Fokus wieder auf dem Schritt «Wohnung»

  # #1158 (Personas Sven P-3, Helga): der Hinweis auf den eigenen Mietvertrag des Mieters wartet, bis der Schritt eine Wohnung hat
  @wip
  Szenario: Nach dem Aufheben der Wahl steht im Schritt nur der Hinweis auf die nicht verfügbare Wohnung
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und "Anna Keller" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann steht im Schritt «Wohnung» der Hinweis "Wohnung 2.01 · Ahornhof ist nicht verfügbar"
    Und zeigt der Schritt «Wohnung» keinen Hinweis auf einen Mietvertrag von "Anna Keller"

  Szenario: Der Hinweis auf die nicht verfügbare Wohnung öffnet ihren Mietvertrag
    Angenommen der Mieter "Bruno Meier" existiert
    Und der Mieter "Carla Rossi" existiert
    Und "Carla Rossi" mietete die Wohnung "2.01" von "2020-01-01" bis "2024-03-31" für "850" Franken
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Und der Liegenschaftsverwalter in der Auswahl die Wohnung "2.01" wählt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Und der Liegenschaftsverwalter im Hinweis im Schritt «Wohnung» den Mietvertrag öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von "Bruno Meier"

  # #669 (Persona Helga P-2): mit einem Vertragsbeginn sagt die Meldung, ob sich der Zeitraum überschneidet
  Szenario: Die Meldung nach dem Laden beim Vertragsbeginn sagt, dass sich nichts überschneidet
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter den Vertragsbeginn "2027-01-01" einträgt
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann bestätigt Dwello das Laden mit "Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit keinem davon."

  # #669 (Persona Helga H-1, fach-reviewer V-7): in der Prüfung bleibt der Kasten zur Überschneidung stehen, wenn die Meldung geht
  Szenario: Nach dem Laden zeigt die Prüfung den Kasten zur Überschneidung
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Und die Mietverträge der Wohnung "2.01" sich wieder laden lassen
    Und der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt
    Dann warnt Dwello nach dem Laden mit "Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit einem davon. Welcher es ist, steht im Hinweis «Zeitraum überschneidet sich»."
    Und steht in der Prüfung der Hinweis «Zeitraum überschneidet sich» mit "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (seit 01.04.2024, unbefristet)."
    Und steht in der Prüfung der Hinweis «Zeitraum überschneidet sich» mit "Den Vertragsbeginn und das Vertragsende ändern Sie im Schritt 3 «Vertragsdauer», die Wohnung im Schritt 2 «Wohnung»."

  Szenario: Der Vertragsbeginn nennt die nicht geladenen Mietverträge
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Dann liest ein Screenreader beim Vertragsbeginn den Hinweis "Dwello prüft beim Speichern, ob die Wohnung frei ist" vor
    Und liest ein Screenreader beim Vertragsbeginn den Hinweis "Die anderen Mietverträge dieser Wohnung liessen sich nicht laden." vor

  # #668 (Persona Helga H15-9): Wohnung und Gebäude stehen mit «·» wie auf der Seite des Mietvertrags
  Szenario: Die Wohnungsauswahl schreibt die Wohnung wie die Seite des Mietvertrags
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Dann steht bei der Wohnung "2.01" in der Auswahl "Wohnung 2.01 · Ahornhof"

  # #668 (Persona Helga H15-9)
  Szenario: Die Prüfung schreibt die Wohnung wie die Seite des Mietvertrags
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit "180" Franken Akonto bis zur Prüfung erfasst
    Dann zeigt die Prüfung "Wohnung" mit "Wohnung 2.01 · Ahornhof"

  # Ohne ihre Mietverträge sieht die Wohnung nicht wie eine freie aus (#151, Dr. Weber W-01)
  Szenario: Wohnung mit nicht geladenen Mietverträgen ist nicht geprüft
    Angenommen die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" wählt
    Dann steht bei der Wohnung "2.01" in der Auswahl "(nicht geprüft)"

  # #667 (Dr. Weber W-03, W-04): ohne die Mietverträge der Wohnung prüft erst das Speichern; die Ablehnung nennt den
  # anderen Mietvertrag und rät, was bei ihm hilft; der Hinweis, dass Dwello beim Speichern prüft, ist dann erledigt
  Szenario: Die Ablehnung nennt den laufenden Mietvertrag ohne Vertragsende
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2024-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken vermietet
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (seit 01.04.2024, unbefristet). Endet der andere Mietvertrag vor dem 01.01.2027, weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung."
    Und sieht der Liegenschaftsverwalter in der Prüfung keinen Hinweis mehr

  Szenario: Die Ablehnung rät zu einem Vertragsbeginn nach dem früheren Mietvertrag
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" befristet von "2024-04-01" bis "2027-03-31" für "900" Franken mit "100" Franken Akonto
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken vermietet
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (01.04.2024 – 31.03.2027, befristet). Der Vertragsbeginn muss nach dem 31.03.2027 liegen. Prüfen Sie ihn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie das Vertragsende des anderen Mietvertrags."

  Szenario: Die Ablehnung rät zu einem Vertragsende vor dem späteren Mietvertrag
    Angenommen der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.01" seit "2027-04-01" für "900" Franken
    Und die Mietverträge der Wohnung "2.01" lassen sich nicht laden
    Und der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken vermietet
    Dann sieht der Liegenschaftsverwalter die Ablehnung "Der Zeitraum überschneidet sich mit dem Mietvertrag von Bruno Meier (ab 01.04.2027, unbefristet). Ist im unterschriebenen Mietvertrag ein Vertragsende vor dem 01.04.2027 vereinbart, wählen Sie «Befristet» mit diesem Vertragsende. Sonst prüfen Sie den Vertragsbeginn des anderen Mietvertrags."

  # #667 (Dr. Weber W-08): die Warnung steht einmal im Kasten; das Feld sagt nur, was zu tun ist
  Szenario: Die Warnung zum Vertragsbeginn in der Vergangenheit steht nur einmal
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Und der Liegenschaftsverwalter den Vertragsbeginn "2020-01-01" einträgt
    Und der Liegenschaftsverwalter weitergeht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Stimmt der Vertragsbeginn, klicken Sie nochmals auf «Weiter»."
    Und steht im Assistenten "liegt in der Vergangenheit" nur einmal

  # #667 (Dr. Weber W-10): auf einem breiten Bildschirm stehen die Namen der Schritte ganz
  Szenario: Die Schrittanzeige trennt keinen Namen eines Schritts
    Angenommen das Browserfenster ist 1440 auf 900 Pixel gross
    Dann bricht die Schrittanzeige keinen Namen eines Schritts mitten im Wort um

  # #1179 (Helga P-2): auf einem schmalen Bildschirm stehen alle Schritte mit Namen untereinander
  Szenario: Auf einem schmalen Bildschirm nennt die Schrittanzeige alle Schritte
    Angenommen das Browserfenster ist 390 auf 844 Pixel gross
    Wenn der Liegenschaftsverwalter den Mieter "Anna Keller" und die Wohnung "2.01" wählt
    Dann nennt die Schrittanzeige untereinander die Schritte
      | Mieter        |
      | Wohnung       |
      | Vertragsdauer |
      | Miete         |
      | Prüfen        |
    Und zeigt die Schrittanzeige beim aktuellen Schritt den Namen "Vertragsdauer"
    Und bricht die Schrittanzeige keinen Namen eines Schritts mitten im Wort um
    Und scrollt die Seite nicht seitwärts

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

  # #447 (Entscheid in #402, Punkt 2): ein eigener Satz von 0 % heisst dasselbe wie «Nein»; damit der Mietvertrag als
  # Mietvertrag ohne vereinbarte Verwaltungspauschale erscheint, nimmt Dwello den Satz 0 % nicht an
  Szenario: Eigener Satz von 0 % wird abgelehnt
    Wenn der Liegenschaftsverwalter "Anna Keller" die Wohnung "2.01" ab "2027-01-01" für "950" Franken mit einer Verwaltungspauschale von "0" % bis zur Prüfung erfasst
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein»."

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
  Szenario: Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter ein Akonto von "150" Franken einträgt
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "40" Franken einträgt
    Und der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann warnt das Formular "Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt."
    Und ist der Hinweis ohne vereinbarte Nebenkosten eine Warnung

  # persona Helga 429 P-1: deckt die Pauschale alle Nebenkosten, sind keine Häkchen richtig und kein Grund für eine Warnung
  Szenario: Mit Nebenkostenpauschale und ohne angekreuzte Nebenkosten warnt das Formular nicht
    Angenommen der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung "2.01"
    Wenn der Liegenschaftsverwalter für "Anna Keller" ab "2027-01-01" bis zur Miete weitergeht
    Und der Liegenschaftsverwalter eine Nebenkostenpauschale von "120" Franken einträgt
    Und der Liegenschaftsverwalter alle Nebenkosten abwählt
    Dann weist das Formular ohne Warnung darauf hin, dass keine Nebenkosten vereinbart sind
