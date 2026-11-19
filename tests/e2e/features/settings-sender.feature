# language: de
@config
Funktionalität: Absender und Konto
  Als Liegenschaftsverwalter
  möchte ich Absender, Konto, Fristen und Vorschläge an einem Ort hinterlegen
  damit Abrechnungen und Mahnungen den richtigen Absender und die richtige IBAN tragen

  # #1456: das Formular der Einstellungen steht auf einer eigenen Seite; die Szenarien kommen unverändert aus
  # settings.feature, nur die Seite, die sie öffnen, ist neu
  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf der Seite "Absender und Konto"

  # P-2 (#87): Zahlungsfrist und Mahnfrist als Vorgabewerte. Nur dieses Szenario speichert das ganze Formular: die
  # Einstellungen gelten für alle parallel laufenden Szenarien, und ein leeres Feld setzt den Wert zurück.
  # @einstellungen-global: wer die IBAN speichert und nachliest, hat die Einstellungen für sich (O-34)
  @einstellungen-global
  Szenario: Absender und Fristen hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname           | Muster Immobilien AG      |
      | Adresse              | Bahnhofstrasse 1          |
      | PLZ                  | 8001                      |
      | Ort                  | Zürich                    |
      | Telefon              | 044 123 45 67             |
      | E-Mail               | info@muster-immobilien.ch |
      | IBAN                 | CH9300762011623852957     |
      | Zahlungsfrist (Tage) | 30                        |
      | Mahnfrist (Tage)     | 14                        |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und sind die Zahlungsfrist "30" und die Mahnfrist "14" hinterlegt

  # #465 (#103, DMR-09): Telefon und E-Mail für den Kopf des PDF, beide freiwillig; dieselben Angaben wie überall (O-34)
  @einstellungen-global
  Szenario: Telefon und E-Mail der Verwaltung hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Telefon | 044 123 45 67             |
      | E-Mail  | info@muster-immobilien.ch |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen sind das Telefon "044 123 45 67" und die E-Mail "info@muster-immobilien.ch" hinterlegt

  Szenario: Ungültige E-Mail der Verwaltung
    Wenn der Liegenschaftsverwalter die E-Mail "info@muster" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine gültige E-Mail-Adresse ein."

  Szenario: Ungültige IBAN
    Wenn der Liegenschaftsverwalter die IBAN "DE89 3704 0044 0532 0130 00" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein."

  # Die QR-Rechnung nimmt Konten in der Schweiz und in Liechtenstein an, die Einstellungen auch (#191)
  @einstellungen-global
  Szenario: IBAN aus Liechtenstein hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname | Muster Immobilien AG       |
      | PLZ        | 8001                       |
      | Ort        | Zürich                     |
      | IBAN       | LI21 0881 0000 2324 013A A |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die IBAN "LI21 0881 0000 2324 013A A" hinterlegt

  # #450 (Entscheid in #404, Punkt 8): der Zahlteil nennt den Liegenschaftsverwalter als Zahlungsempfänger, nie
  # einen erfundenen. Die Seite speichert dabei nichts
  Szenario: IBAN ohne Firmenadresse
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname |                            |
      | PLZ        |                            |
      | Ort        |                            |
      | IBAN       | CH93 0076 2011 6238 5295 7 |
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort."
    Und kennzeichnen die Einstellungen Firmenname, PLZ und Ort als fehlend

  # #1166: der Zahlteil nennt unter «Konto / Zahlbar an» den Kontoinhaber der IBAN (SIX); ohne eigene Angaben ist es der
  # Absender. Die Einstellungen gelten für alle parallel laufenden Szenarien: wer den Kontoinhaber speichert oder
  # nachliest, hat sie für sich, und der Kontoinhaber wird danach wieder auf den Absender gesetzt
  @einstellungen-global
  Szenario: Ohne eigene Angaben ist der Absender der Kontoinhaber
    Dann ist in den Einstellungen angegeben, dass der Kontoinhaber der Absender ist
    Und fragen die Einstellungen nicht nach einem eigenen Kontoinhaber

  @einstellungen-global
  Szenario: Eigenen Kontoinhaber hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen mit eigenem Kontoinhaber speichert:
      | Firmenname                | Muster Immobilien AG       |
      | PLZ                       | 8001                       |
      | Ort                       | Zürich                     |
      | IBAN                      | CH93 0076 2011 6238 5295 7 |
      | Name des Kontoinhabers    | Erika Muster               |
      | Adresse des Kontoinhabers | Seeweg 5                   |
      | PLZ des Kontoinhabers     | 6003                       |
      | Ort des Kontoinhabers     | Luzern                     |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist der Kontoinhaber "Erika Muster", "Seeweg 5", "6003" "Luzern" hinterlegt

  # #1166: mit IBAN braucht ein eigener Kontoinhaber Name, PLZ und Ort, die Strasse ist freiwillig. Die Seite speichert
  # dabei nichts
  Szenario: Eigener Kontoinhaber ohne Name, PLZ und Ort
    Wenn der Liegenschaftsverwalter folgende Einstellungen mit eigenem Kontoinhaber speichert:
      | IBAN                   | CH93 0076 2011 6238 5295 7 |
      | Name des Kontoinhabers |                            |
      | PLZ des Kontoinhabers  |                            |
      | Ort des Kontoinhabers  |                            |
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Mit einer IBAN braucht es den Kontoinhaber. Erfassen Sie Name, PLZ und Ort des Kontoinhabers oder setzen Sie das Häkchen bei «Kontoinhaber ist der Absender»."
    Und kennzeichnen die Einstellungen Name, PLZ und Ort des Kontoinhabers als fehlend

  # #1166: wer den Absender wieder als Kontoinhaber angibt, löscht die Angaben des eigenen Kontoinhabers
  @einstellungen-global
  Szenario: Den Absender wieder als Kontoinhaber angeben
    Angenommen das Konto der IBAN "CH93 0076 2011 6238 5295 7" gehört "Erika Muster", "Seeweg 5", "6003 Luzern"
    Wenn der Liegenschaftsverwalter in den Einstellungen den Absender als Kontoinhaber angibt und speichert
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist angegeben, dass der Kontoinhaber der Absender ist
    Und ist kein eigener Kontoinhaber mehr hinterlegt

  # #1175 (Personas Marco P-3 und Helga in #1166): die Felder des Kontoinhabers zeigen Beispiele wie die des Absenders,
  # und die Strasse ist als freiwillig bezeichnet; es wird nichts gespeichert
  Szenario: Die Angaben zum Kontoinhaber zeigen Beispiele
    Wenn der Liegenschaftsverwalter in den Einstellungen einen eigenen Kontoinhaber angibt
    Dann erklärt die Einstellung "Name des Kontoinhabers" "Beispiel: Anna Keller"
    Und erklärt die Einstellung "Adresse des Kontoinhabers" "Beispiel: Bahnhofstrasse 1"
    Und erklärt die Einstellung "PLZ des Kontoinhabers" "Beispiel: 8001"
    Und erklärt die Einstellung "Ort des Kontoinhabers" "Beispiel: Zürich"
    Und heisst die Einstellung "Adresse des Kontoinhabers" "Strasse und Hausnummer (optional)"

  # #1202 (Personas Marco P-1 und Helga P-2 in #1175): wer das Häkchen setzt und wieder entfernt, findet die eingegebenen
  # Angaben zum Kontoinhaber wieder; es wird nichts gespeichert
  Szenario: Die eingegebenen Angaben zum Kontoinhaber bleiben bis zum Speichern erhalten
    Wenn der Liegenschaftsverwalter in den Einstellungen einen eigenen Kontoinhaber angibt
    Und folgende Angaben zum Kontoinhaber eingibt:
      | Name des Kontoinhabers    | Hans Beispiel |
      | Adresse des Kontoinhabers | Rainweg 7     |
      | PLZ des Kontoinhabers     | 3011          |
      | Ort des Kontoinhabers     | Bern          |
    Und den Absender wieder als Kontoinhaber angibt, ohne zu speichern
    Und doch einen eigenen Kontoinhaber angibt
    Dann zeigen die Einstellungen den Kontoinhaber "Hans Beispiel", "Rainweg 7", "3011" "Bern"

  # #1202 (Codereview 1202-1 C-2): gespeichert mit dem Absender als Kontoinhaber, sind die Angaben auch ohne erneutes
  # Öffnen gelöscht
  @einstellungen-global
  Szenario: Gespeichert mit dem Absender als Kontoinhaber, kommen die gelöschten Angaben nicht zurück
    Angenommen das Konto der IBAN "CH93 0076 2011 6238 5295 7" gehört "Erika Muster", "Seeweg 5", "6003 Luzern"
    Wenn der Liegenschaftsverwalter in den Einstellungen den Absender als Kontoinhaber angibt und speichert
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und ist kein eigener Kontoinhaber mehr hinterlegt

  # #1175 (Persona Marco P-2): auch beim Absender ist die Strasse freiwillig (#450), wie beim Kontoinhaber
  Szenario: Die Strasse des Absenders ist als freiwillig bezeichnet
    Dann heisst die Einstellung "Adresse" "Strasse und Hausnummer (optional)"

  # #490 (Entscheid des Product Owners): die Hilfe sagt es vor dem Speichern
  Szenario: Die Einstellungen sagen, was eine IBAN braucht
    Dann erklären die Einstellungen bei der IBAN "Mit einer IBAN braucht es Firmenname, PLZ und Ort."

  Szenario: Ungültige PLZ
    Wenn der Liegenschaftsverwalter die PLZ "80" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "PLZ muss 4 Ziffern haben."

  Szenario: Fristen sind erklärt
    Dann erklärt die Einstellung "Zahlungsfrist (Tage)" "Wie viele Tage nach dem Versand der Mieter eine Nachzahlung bezahlt oder Sie eine Rückerstattung überweisen. Erlaubt sind 7 bis 90 Tage, Vorgabe: 30 Tage. Gilt für Abrechnungen, die Sie ab jetzt versenden; die Frist einer einzelnen Abrechnung ändern Sie dort mit «Frist und Bemerkungen bearbeiten»."
    Und erklärt die Einstellung "Mahnfrist (Tage)" "Wie viele Tage nach der Zahlungsfrist einer Nachzahlung die Übersicht eine Mahnung vorschlägt. Erlaubt sind 7 bis 60 Tage, Vorgabe: 14 Tage. Überfällig ist die Abrechnung schon ab dem Tag nach der Zahlungsfrist, und mahnen können Sie ab dann. Nach einer Mahnung schlägt die Übersicht die nächste vor, sobald die Frist in dieser Mahnung abgelaufen ist."

  Szenariogrundriss: Frist ausserhalb des erlaubten Bereichs
    Wenn der Liegenschaftsverwalter die <Frist> "<Tage>" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "<Meldung>"

    Beispiele:
      | Frist         | Tage | Meldung                                                       |
      | Zahlungsfrist | 5    | Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.            |
      | Mahnfrist     | 61   | Geben Sie für die Mahnfrist 7 bis 60 Tage ein.                |

  # Rückerstattung (#69)
  Szenario: Die Einstellungen sagen, wer eine Rückerstattung überweist
    Dann erklären die Einstellungen bei der IBAN "Eine Rückerstattung überweisen Sie selbst bis zur Zahlungsfrist auf das Konto des Mieters"

  # #1088: die Abrechnungsperiode steht beim Gebäude; die Einstellungen haben keine mehr
  Szenario: Die Einstellungen bieten keine Abrechnungsperiode an
    Dann bieten die Einstellungen keine Abrechnungsperiode an

  # #690, Punkt 1 (Persona Helga 450): eine IBAN, deren Firmenadresse unvollständig gespeichert ist (vor #450), zeigt
  # die Seite schon beim Öffnen, mit dem Text der abgelehnten Speicherung. Die Einstellungen gelten für alle parallel
  # laufenden Szenarien: das Szenario läuft auf einer eigenen Installation
  @frische-installation
  Szenario: Eine IBAN ohne Firmenadresse ist schon beim Öffnen gekennzeichnet
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" ohne Firmenname, PLZ und Ort hinterlegt
    Wenn der Liegenschaftsverwalter die Einstellungen erneut öffnet
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort."
    Und kennzeichnen die Einstellungen Firmenname, PLZ und Ort als fehlend
    Und steht der Fokus in den Einstellungen auf "Firmenname"

  # #690, Punkt 3 (Persona Helga 450): eine abgelehnte Speicherung speichert nichts, auch nicht die anderen Felder,
  # und die Seite sagt es. Abgelehnt speichert sie nichts: das Szenario braucht die Einstellungen nicht für sich
  Szenario: Eine abgelehnte Speicherung sagt, dass nichts gespeichert wurde
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | PLZ       | 84 |
      | Mahnfrist | 20 |
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Einstellungen wurden nicht gespeichert"
    Und sieht der Liegenschaftsverwalter die Fehlermeldung "Keine Änderung wurde gespeichert, auch nicht in den anderen Feldern."

  # #1298 (Entscheid des Product Owners; Personas Marco und Helga in #1202): die Hilfe beim Häkchen sagt vor dem
  # Speichern, dass ein eigener Kontoinhaber gelöscht wird; es wird nichts gespeichert
  Szenario: Die Einstellungen sagen, dass das Häkchen einen eigenen Kontoinhaber löscht
    Dann erklärt die Einstellung "Kontoinhaber ist der Absender" "Mit Häkchen löscht Speichern einen eigenen Kontoinhaber."

  # #1298 (Entscheid des Product Owners; Persona Marco in #1202): die Bestätigung nennt auch das Konto mit dem Kontoinhaber
  @einstellungen-global
  Szenario: Die Bestätigung nennt das Konto mit dem Kontoinhaber
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname | Muster Immobilien AG       |
      | PLZ        | 8001                       |
      | Ort        | Zürich                     |
      | IBAN       | CH93 0076 2011 6238 5295 7 |
    Dann bestätigen die Einstellungen "Absender, Konto mit Kontoinhaber, Verwaltungspauschale, Fristen und Vorschläge gespeichert."

  # #698: ein Begriff aus der Hilfe wird am Feld mit demselben Text erklärt
  Szenario: Die Einstellung «Verwaltungspauschale» erklärt den Begriff wie die Hilfe
    Angenommen der Liegenschaftsverwalter hat in der Hilfe gelesen, was "Verwaltungspauschale" heisst
    Und der Liegenschaftsverwalter ist auf der Seite "Absender und Konto"
    Dann beginnt die Hilfe zu "der Einstellung «Verwaltungspauschale»" mit der Erklärung aus der Hilfe
