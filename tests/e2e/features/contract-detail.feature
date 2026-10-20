# language: de
@contracts
Funktionalität: Mietvertragsdetail
  Als Liegenschaftsverwalter
  möchte ich einen Mietvertrag mit Mieter, Wohnung und Mietzins sehen
  damit ich Auskunft geben und den Vertrag verwalten kann

  Grundlage:
    Angenommen das Gebäude "Ahornhof" in "Winterthur" existiert
    Und im Gebäude "Ahornhof" gibt es die leere Wohnung "2.01"
    Und der Mieter "Anna Keller" existiert
    Und "Anna Keller" mietet die Wohnung "2.01" seit "2024-04-01" für "950" Franken

  Szenario: Mietvertrag anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann sieht der Liegenschaftsverwalter die Wohnung "2.01" im Mietvertrag
    Und sieht der Liegenschaftsverwalter den monatlichen Mietzins "CHF 950.00"

  Szenario: Mietvertrag beenden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag beendet
    Dann endet der Mietvertrag heute

  # Der Mieter kündigt auf einen späteren Termin: der Vertrag läuft bis dahin weiter
  Szenario: Mietvertrag auf ein künftiges Datum beenden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-12-31" beendet
    Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.12.2099"
    Und hat der Mietvertrag den Status "Laufend"

  # Die Kündigung wird oft erst nach dem Auszug erfasst
  Szenario: Mietvertrag auf ein vergangenes Datum beenden
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beendet und die Folge bestätigt
    Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.03.2025"
    Und hat der Mietvertrag den Status "Beendet"
    # A-6 (#115): ein gekündigter Mietvertrag läuft nicht stillschweigend weiter
    Und fragt der Mietvertrag nicht, ob der Mieter noch in der Wohnung wohnt

  Szenario: Vergangenes Vertragsende ohne Bestätigung
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beenden will
    Dann meldet der Dialog "Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende."
    Und ist der Mietvertrag unbefristet

  # Bei 150 % Zoom ist das Fenster nur 600 Pixel hoch
  Szenario: Dialog im kleinen Fenster
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Und das Browserfenster ist 960 auf 600 Pixel gross
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beenden will
    Dann kann der Liegenschaftsverwalter den Mietvertrag im Dialog beenden

  # Die Abrechnung 2025 enthält schon Mietstage bis Ende Jahr
  Szenario: Vertragsende vor dem Ende einer Abrechnung
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beendet und die Folge bestätigt
    Dann meldet der Dialog "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."
    Und ist der Mietvertrag unbefristet

  Szenario: Künftiger Mietvertrag
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2099-11-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Dann hat der Mietvertrag den Status "Künftig"

  # A-7 (#116): ein begonnener Mietvertrag wird nur gelöscht, wenn der Liegenschaftsverwalter den Irrtum bestätigt
  Szenario: Laufender Mietvertrag wird nur mit Bestätigung gelöscht
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will, ohne den Irrtum zu bestätigen
    Dann meldet der Dialog "Bitte bestätigen Sie, dass dieser Mietvertrag irrtümlich erfasst wurde, oder brechen Sie ab."
    Und ist der Mietvertrag unbefristet

  Szenario: Irrtümlich erfassten Mietvertrag löschen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2024-04-01" für "950" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löscht und bestätigt, dass er irrtümlich erfasst wurde
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Bruno Meier" ist nicht mehr auffindbar

  # Die Abrechnung braucht seine Mietstage: er bleibt
  Szenario: Mietvertrag mit Abrechnung kann nicht gelöscht werden
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Dann nennt der Dialog "Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in:"
    Und nennt der Dialog "Löschen Sie zuerst die Entwürfe, danach lässt sich der Mietvertrag löschen."
    Und kann der Liegenschaftsverwalter das Löschen nicht bestätigen
    Und ist der Mietvertrag unbefristet

  # Irrtümlich erfasst, noch nicht begonnen: er hat keine Mietstage
  Szenario: Künftigen Mietvertrag löschen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietet die Wohnung "2.02" seit "2099-11-01" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löscht
    Dann ist der Liegenschaftsverwalter auf der Mietvertragsliste
    Und der Mietvertrag von "Bruno Meier" ist nicht mehr auffindbar

  Szenario: Zur Bearbeitung des Mietvertrags wechseln
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Mietvertrag bearbeiten"

  Szenario: Mieter öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mieter öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Anna Keller"

  Szenario: Wohnung öffnen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Wohnung des Mietvertrags öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Wohnung 2.01"

  Szenario: Nebenkostenabrechnungen des Mietvertrags anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Nebenkostenabrechnungen des Mietvertrags anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Nebenkostenabrechnungen"

  Szenario: Rechnungen des Gebäudes anzeigen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Rechnungen des Gebäudes anzeigt
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnungen"

  Szenario: E-Mail an den Mieter schreiben
    Angenommen "Anna Keller" hat eine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" eine E-Mail schreiben

  Szenario: Mieter ohne E-Mail-Adresse
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" keine E-Mail schreiben

  Szenario: Mieter anrufen
    Angenommen "Anna Keller" hat die Telefonnummer "+41 52 123 45 67"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann kann der Liegenschaftsverwalter "Anna Keller" unter "+41 52 123 45 67" anrufen

  Szenario: Gekündigter Mietvertrag bleibt unbefristet
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beendet
    Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.03.2099"
    Wenn der Liegenschaftsverwalter den Mietvertrag bearbeiten will
    Dann zeigt die Vertragsdauer "Unbefristet, gekündigt auf den 31.03.2099"
    Und nennt die Mietvertragsliste den Mietvertrag von "Anna Keller" "gekündigt"

  Szenario: Befristeter Mietvertrag
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2099-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Dann zeigt der Mietvertrag "Befristet bis 31.12.2099"

  # A-4: nach der Kündigung zeigt der Mietvertrag, was jetzt zu tun ist
  Szenario: Nächste Schritte nach der Kündigung
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beendet
    Und der Liegenschaftsverwalter den nächsten Schritt "Nachmieter erfassen" wählt
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mietvertrag"
    Und gilt der neue Mietvertrag für die Wohnung "2.01"

  # A-5 (#114): nach dem Vertragsende fehlt die neue Adresse oft noch; der Schritt bleibt, solange die Adresse die der Wohnung ist
  Szenario: Nach dem Vertragsende bleibt der Schritt zur neuen Adresse
    Angenommen der Mietvertrag von "Anna Keller" ist auf den "2024-12-31" gekündigt
    Und die Korrespondenzadresse von "Anna Keller" ist noch die Adresse des Gebäudes "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann bitten die nächsten Schritte, die neue Adresse von "Anna Keller" einzutragen: "Dorthin geht die Nebenkostenabrechnung."
    Wenn der Liegenschaftsverwalter den nächsten Schritt "Neue Adresse eintragen" wählt
    Dann ist der Liegenschaftsverwalter auf der Bearbeitungsseite von "Anna Keller"

  # F-23 (#155): beim Tod des Mieters geht der Mietvertrag auf die Erben über, «Beenden» sagt es (Fachreview W10 M-1)
  Szenario: Beenden nennt den Tod des Mieters
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag beenden will
    Dann erfährt der Liegenschaftsverwalter im Dialog «Mietvertrag beenden», dass der Mietvertrag beim Tod des Mieters weiterläuft

  # A-3 (#112): aus dem Eingang der Kündigung weist der Dialog auf eine zu kurze Kündigungsfrist hin, ohne zu sperren
  Szenario: Kündigung mit zu kurzer Frist
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beenden will und die Kündigung am "2099-02-15" erhalten hat
    Dann weist der Dialog darauf hin, dass zwischen Eingang und Vertragsende weniger als 3 Monate liegen
    Wenn der Liegenschaftsverwalter den Mietvertrag trotzdem beendet
    Dann zeigt der Mietvertrag "Unbefristet, gekündigt auf den 31.03.2099"
    Und zeigt der Mietvertrag die Kündigung als erhalten am "15.02.2099"

  Szenario: Kündigung mit genügend Frist
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beenden will und die Kündigung am "2098-12-15" erhalten hat
    Dann zeigt der Dialog keinen Hinweis auf die Frist

  # B-16 (#156): wer innerhalb des Hauses umzieht, braucht einen neuen Mietvertrag
  Szenario: Neuer Mietvertrag für denselben Mieter nach der Kündigung
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2099-03-31" beendet
    Und der Liegenschaftsverwalter als nächsten Schritt einen neuen Mietvertrag für "Anna Keller" erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neuer Mietvertrag"
    Und ist im Mietvertrag der Mieter "Anna Keller" gewählt

  # A-10: die Ablehnung führt zum Entwurf und bietet den Weg über das Löschen an
  Szenario: Abgelehnter Entwurf ist verlinkt
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beendet und die Folge bestätigt
    Und der Liegenschaftsverwalter den genannten Entwurf öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2025 von "Anna Keller"

  Szenario: Entwurf löschen und Mietvertrag beenden
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2025-03-31" beendet und die Folge bestätigt
    Und der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag beendet
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" und 2025
    Und endet der Mietvertrag von "Anna Keller" am "31.03.2025"
    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"

  # #141: lehnt das Backend das Vertragsende trotzdem ab, bleibt der Entwurf erhalten
  Szenario: Abgelehntes Vertragsende behält den Entwurf
    Angenommen für "Anna Keller" gibt es die Abrechnung 2024 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2024-06-30" beendet und die Folge bestätigt
    Dann meldet der Dialog "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."
    Und für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Wenn der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag beendet
    Dann meldet der Dialog "Löschen Sie zuerst die Entwürfe und erstellen Sie die Nebenkostenabrechnungen danach neu."
    Und ist der Mietvertrag unbefristet
    Und findet die Abrechnungsliste die Abrechnung 2024 von "Anna Keller"

  # A-10: Mietstage in der letzten Abrechnungsperiode ohne Abrechnung
  Szenario: Fehlende Abrechnung am Mietvertrag
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die fehlende Abrechnung des letzten Jahres erstellen will
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" und das letzte Jahr

  # Eine Lücke in einer älteren Abrechnungsperiode zeigt sich auch, wenn die letzte abgerechnet ist (#142)
  Szenario: Fehlende Abrechnung einer älteren Periode am Mietvertrag
    Angenommen "Anna Keller" hat die Abrechnung des letzten Jahres für das Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann meldet der Mietvertrag die fehlende Abrechnung 2024
    Und meldet der Mietvertrag keine fehlende Abrechnung des letzten Jahres
    Und erfährt der Liegenschaftsverwalter, dass er eine ausserhalb von Dwello abgerechnete Periode mit «Abgerechnet bis» einträgt

  # #133: eine Periode, die bis «Abgerechnet bis» endet, ist ausserhalb von Dwello abgerechnet und fehlt nicht
  Szenario: Ausserhalb von Dwello abgerechnete Perioden fehlen nicht
    Angenommen der Mietvertrag von "Anna Keller" ist bis Ende des letzten Jahres ausserhalb von Dwello abgerechnet
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann zeigt der Mietvertrag «Abgerechnet bis» am Ende des letzten Jahres
    Und meldet der Mietvertrag keine fehlende Abrechnung

  # #199: eine Abrechnung, die die Periode teilweise abdeckt, zählt; es fehlen nur die Mietstage ohne Abrechnung.
  # #408 Punkt 2: Tage, die keine Abrechnung des Gebäudes abdeckt, rechnet eine kurze Abrechnungsperiode ab
  Szenario: Teilweise abgerechnete Periode am Mietvertrag
    Angenommen für "Anna Keller" gibt es die Abrechnung vom "2024-04-01" bis "2024-09-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann meldet der Mietvertrag die fehlende Abrechnung "01.10.2024 – 31.12.2024"
    Und erfährt der Liegenschaftsverwalter, dass es für diese Tage noch keine Abrechnung gibt
    Und bietet der Mietvertrag für die Tage ab "2024-10-01" "Kurze Abrechnungsperiode 01.10.2024 – 31.12.2024 abrechnen" an
    # #486: die Abrechnungsperiode kann im Mietvertrag stehen
    Und rät der Mietvertrag "Sehen Sie in den Mietverträgen nach (oft bei den Nebenkosten), ob dort eine Abrechnungsperiode steht. Dann gilt diese, bis die Mieter einer Änderung schriftlich zustimmen. Ohne Zustimmung teilen Sie die Änderung begründet mit dem amtlichen Formular mit, mindestens zehn Tage vor Beginn der Kündigungsfrist. Sie gilt frühestens ab dem nächstmöglichen Kündigungstermin (Art. 269d OR). Bis dahin rechnen Sie nach der Abrechnungsperiode im Mietvertrag ab."
    # Fachreview 2 V-9: «Abgerechnet bis» würde die bestehende Abrechnung ändern
    Und nennt der Mietvertrag «Abgerechnet bis» nicht als Ausweg

  Szenario: Kurze Abrechnungsperiode am Mietvertrag abrechnen
    Angenommen für "Anna Keller" gibt es die Abrechnung vom "2024-04-01" bis "2024-09-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die fehlende Abrechnung ab "2024-10-01" erstellen will
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" vom "2024-10-01" bis "2024-12-31"

  # #408 Punkt 2: Tage in der Periode einer bestehenden Abrechnung des Gebäudes rechnet genau diese Periode ab,
  # die übrigen Tage eine kurze Abrechnungsperiode für alle Mietverträge des Gebäudes
  Szenario: Fehlende Tage in der Abrechnungsperiode eines anderen Mietvertrags
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Ben Meier" existiert
    Und "Ben Meier" mietete die Wohnung "2.02" von "2023-07-01" bis "2024-06-30" für "900" Franken
    Und für "Ben Meier" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann meldet der Mietvertrag die fehlende Abrechnung "01.04.2024 – 30.06.2024"
    Und meldet der Mietvertrag die fehlende Abrechnung "01.07.2024 – 31.12.2024"
    Und bietet der Mietvertrag für die Tage ab "2024-04-01" "Abrechnungsperiode 01.07.2023 – 30.06.2024 wählen" an
    Und bietet der Mietvertrag für die Tage ab "2024-07-01" "Kurze Abrechnungsperiode 01.07.2024 – 31.12.2024 abrechnen" an

  Szenario: Von fehlenden Tagen zur Abrechnungsperiode eines anderen Mietvertrags
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Ben Meier" existiert
    Und "Ben Meier" mietete die Wohnung "2.02" von "2023-07-01" bis "2024-06-30" für "900" Franken
    Und für "Ben Meier" gibt es die Abrechnung vom "2023-07-01" bis "2024-06-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die fehlende Abrechnung ab "2024-04-01" erstellen will
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" vom "2023-07-01" bis "2024-06-30"

  # #211: der Hinweis führt zu den Rechnungen des Gebäudes in der fehlenden Periode; #454 (#408 Punkt 1): gefiltert nach
  # der Abrechnungsperiode, wie eine Abrechnung sie nimmt
  @wip
  Szenario: Rechnungen der fehlenden Periode anzeigen
    Angenommen für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Rechnungen der fehlenden Abrechnung 2024 anzeigt
    Dann zeigt die Rechnungsliste die Rechnungen der Abrechnungsperiode vom "2024-01-01" bis "2024-12-31" im Gebäude "Ahornhof"

  # #454 (#408 Punkt 1): für einen Teil der Periode genau die fehlenden Tage
  @wip
  Szenario: Rechnungen der fehlenden Tage anzeigen
    Angenommen für "Anna Keller" gibt es die Abrechnung vom "2024-04-01" bis "2024-09-30" im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Dann bietet der Mietvertrag für die Tage ab "2024-10-01" die Rechnungen "Rechnungen für 01.10.2024 – 31.12.2024 ansehen" an
    Wenn der Liegenschaftsverwalter die Rechnungen der fehlenden Tage ab "2024-10-01" anzeigt
    Dann zeigt die Rechnungsliste die Rechnungen der Abrechnungsperiode vom "2024-10-01" bis "2024-12-31" im Gebäude "Ahornhof"

  Szenario: Abrechnungen eines Mietvertrags anzeigen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Ben Meier" existiert
    Und "Ben Meier" mietet die Wohnung "2.02" seit "2024-04-01" für "900" Franken
    Und für "Anna Keller" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und für "Ben Meier" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter die Nebenkostenabrechnungen des Mietvertrags anzeigt
    Dann erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen des Mietvertrags von "Anna Keller" in der Wohnung "2.01" zeigt
    Und sieht der Liegenschaftsverwalter die Abrechnung 2025 von "Anna Keller"
    Aber nicht die Abrechnung 2025 von "Ben Meier"
    Und zählt die Liste 1 Entwurf

  # A-8 (#117): der Löschdialog eines beendeten Mietvertrags führt zu seinen Abrechnungen
  Szenario: Löschdialog eines beendeten Mietvertrags nennt seine Abrechnungen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2018-01-01" bis "2025-12-31" für "900" Franken
    Und für "Bruno Meier" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Dann nennt der Dialog "Dieser Mietvertrag kann nicht gelöscht werden. Seine Mietstage sind abgerechnet in:"
    Und verlinkt der Dialog die Abrechnung 2025 von "Bruno Meier"

  Szenario: Abrechnung aus dem Löschdialog öffnen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2018-01-01" bis "2025-12-31" für "900" Franken
    Und für "Bruno Meier" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Und der Liegenschaftsverwalter im Dialog die Abrechnung 2025 von "Bruno Meier" öffnet
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung 2025 von "Bruno Meier"

  Szenario: Löschdialog eines beendeten Mietvertrags ohne Abrechnung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2018-01-01" bis "2021-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag löschen will
    Dann nennt der Dialog "Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung."

  # A-6 (#115): nach dem Ende eines befristeten Mietvertrags fragt der Mietvertrag, ob der Mieter noch in der Wohnung
  # wohnt; dann läuft er unbefristet weiter (Art. 266 Abs. 2 OR)
  Szenario: Befristeten Mietvertrag unbefristet weiterführen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt
    Dann ist der Mietvertrag unbefristet
    Und hat der Mietvertrag den Status "Laufend"

  # #457 (#410 Punkt 3): wer den Mietzins nach dem Vertragsende länger annimmt, hat den Mietvertrag meist schon fortgesetzt
  Szenario: Der Hinweis nach dem Vertragsende nennt die stillschweigende Fortsetzung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Dann sagt der Hinweis zum abgelaufenen Mietvertrag "Haben Sie den Mietzins nach dem Vertragsende längere Zeit angenommen, läuft der Mietvertrag meist schon unbefristet weiter und endet nur mit einer Kündigung."

  Szenario: Mieter ist nach dem befristeten Mietvertrag ausgezogen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-12-31" für "900" Franken
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter bestätigt, dass der Mieter ausgezogen ist
    Dann zeigt der Mietvertrag "Befristet bis 31.12.2025"
    Und fragt der Mietvertrag nicht mehr, ob der Mieter noch in der Wohnung wohnt

  # Die Abrechnung 2025 rechnet die Mietstage nur bis zum Vertragsende
  Szenario: Unbefristet weiterführen nach einem Entwurf bis zum Vertragsende
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-06-30" für "900" Franken
    Und für "Bruno Meier" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt
    Dann meldet der Mietvertrag "Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen."
    Und zeigt der Mietvertrag "Befristet bis 30.06.2025"

  Szenario: Entwurf löschen und Mietvertrag unbefristet weiterführen
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-06-30" für "900" Franken
    Und für "Bruno Meier" gibt es die Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt
    Und der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag unbefristet weiterführt
    Dann ist der Liegenschaftsverwalter im Abrechnungsassistenten für das Gebäude "Ahornhof" und 2025
    Und ist der Mietvertrag von "Bruno Meier" unbefristet
    Und findet die Abrechnungsliste keine Abrechnung 2025 von "Bruno Meier"

  # Eine versendete Abrechnung ändert Dwello nicht: der Mietvertrag läuft erst unbefristet weiter, wenn sie ersetzt ist
  # (#120, #358)
  Szenario: Unbefristet weiterführen nach einer versendeten Abrechnung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-06-30" für "900" Franken
    Und für "Bruno Meier" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt
    Dann meldet der Mietvertrag "Berichtigen Sie zuerst jede dieser Abrechnungen."
    Und zeigt der Mietvertrag "Befristet bis 30.06.2025"

  Szenario: Unbefristet weiterführen nach dem Berichtigen der Abrechnung
    Angenommen im Gebäude "Ahornhof" gibt es die leere Wohnung "2.02"
    Und der Mieter "Bruno Meier" existiert
    Und "Bruno Meier" mietete die Wohnung "2.02" von "2024-01-01" bis "2025-06-30" für "900" Franken
    Und für "Bruno Meier" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Und die Abrechnung 2025 von "Bruno Meier" ist ersetzt
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Bruno Meier"
    Wenn der Liegenschaftsverwalter den Mietvertrag unbefristet weiterführt
    Dann ist der Mietvertrag unbefristet

  # #464 (Entscheid zu F-13): ein später eingetragenes Akonto lässt sich löschen; das bisherige gilt dann weiter
  Szenario: Ein späteres Akonto löschen
    Angenommen der Mietvertrag von "Anna Keller" hat "150" Franken Akonto
    Und der Mietvertrag von "Anna Keller" hat ab "2025-07-01" "200" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter das Akonto "CHF 200.00" löscht
    Dann zeigt der Mietvertrag das Monatlich total "CHF 1’100.00"
    Und bestätigt Dwello "Akonto ab 01.07.2025 gelöscht"

  # #464 (Fachreview 464-2 V-6): ein Akonto, das eine erstellte Abrechnung zählt, bleibt, bis sie berichtigt ist
  Szenario: Ein Akonto, das eine Abrechnung zählt, lässt sich nicht löschen
    Angenommen der Mietvertrag von "Anna Keller" hat "150" Franken Akonto
    Und der Mietvertrag von "Anna Keller" hat ab "2025-07-01" "200" Franken Akonto
    Und für "Anna Keller" gibt es die versendete Abrechnung 2025 im Gebäude "Ahornhof"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter das Akonto "CHF 200.00" löscht
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Das Akonto ab 01.07.2025 zählt in der Abrechnung"

  # #464 (Code-Review 464-2 C-10, C-11): ein Vertragsende vor einem späteren Akonto nennt dieses Akonto
  Szenario: Mietvertrag vor einem späteren Akonto beenden
    Angenommen der Mietvertrag von "Anna Keller" hat ab "2099-01-01" "200" Franken Akonto
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mietvertrags von "Anna Keller"
    Wenn der Liegenschaftsverwalter den Mietvertrag auf den "2098-12-31" beendet
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Ab 01.01.2099 gilt ein anderes Akonto. Löschen Sie zuerst dieses Akonto, oder wählen Sie ein späteres Vertragsende."
