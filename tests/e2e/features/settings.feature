# language: de
@config
Funktionalität: Einstellungen
  Als Liegenschaftsverwalter
  möchte ich die Angaben meiner Verwaltung hinterlegen
  damit Abrechnungen und Mahnungen den richtigen Absender und die richtige IBAN tragen

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen

  # P-2 (#87): Zahlungsfrist und Mahnfrist als Vorgabewerte. Nur dieses Szenario speichert das ganze Formular: die
  # Einstellungen gelten für alle parallel laufenden Szenarien, und ein leeres Feld setzt den Wert zurück
  Szenario: Absender und Fristen hinterlegen
    Wenn der Liegenschaftsverwalter folgende Einstellungen speichert:
      | Firmenname           | Muster Immobilien AG  |
      | Adresse              | Bahnhofstrasse 1      |
      | PLZ                  | 8001                  |
      | Ort                  | Zürich                |
      | IBAN                 | CH9300762011623852957 |
      | Zahlungsfrist (Tage) | 30                    |
      | Mahnfrist (Tage)     | 14                    |
    Dann bestätigt die Seite, dass die Einstellungen gespeichert sind
    Und nach erneutem Öffnen der Einstellungen ist die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und sind die Zahlungsfrist "30" und die Mahnfrist "14" hinterlegt

  Szenario: Ungültige IBAN
    Wenn der Liegenschaftsverwalter die IBAN "DE89 3704 0044 0532 0130 00" speichert
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein."

  # Die QR-Rechnung nimmt Konten in der Schweiz und in Liechtenstein an, die Einstellungen auch (#191)
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

  Szenariogrundriss: Stammdaten öffnen
    Wenn der Liegenschaftsverwalter die Stammdaten "<Stammdaten>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Stammdaten       | Seite            |
      | Kategorien       | Kategorien       |
      | Heizprofile      | Heizprofile      |
      | Verteilschlüssel | Verteilschlüssel |

  # Rückerstattung (#69)
  Szenario: Die Einstellungen sagen, wer eine Rückerstattung überweist
    Dann erklären die Einstellungen bei der IBAN "Eine Rückerstattung überweisen Sie selbst bis zur Zahlungsfrist auf das Konto des Mieters"

  # Protokoll (#357, Entscheid in #111): Änderungen und Anmeldungen mit Datum, unter den Einstellungen; die Einträge
  # bleiben, bis der Liegenschaftsverwalter sie löscht. Die übrigen Einträge prüfen audit-log.pg.test.ts und
  # auth-routes.test.ts: die Anmeldung läuft hier nicht über Google, die Verwaltungspauschale gilt für alle parallel
  # laufenden Szenarien, und das Zurücksetzen einer Zahlung und das Berichtigen einer Abrechnung schreiben denselben
  # Eintrag wie die übrigen Änderungen.
  # TODO(fachlich prüfen, #370): «Protokoll» steht im Glossar; die Hilfetexte folgen
  Szenario: Protokoll öffnen
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Protokoll"

  Szenario: Änderungen im Protokoll sehen
    Angenommen es gibt die umlagefähige Kategorie "Gartenpflege Nord"
    Und die Kategorie "Gartenpflege Nord" ist inzwischen nicht umlagefähig
    Und das Gebäude "Lindenhof" in "Bern" existiert
    Und "Hauswart Meier" stellt dem Gebäude "Lindenhof" "450.00" Franken für "Treppenhausreinigung" in der Kategorie "Hauswart" in Rechnung
    Und die Rechnung von "Hauswart Meier" ist vom "2026-03-31"
    Und die Rechnung von "Hauswart Meier" ist inzwischen als nicht umlagefähig markiert
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt das Protokoll mit heutigem Datum "Kategorie «Gartenpflege Nord»: von umlagefähig auf nicht umlagefähig geändert"
    Und nennt das Protokoll mit heutigem Datum "Rechnung «Treppenhausreinigung» von Hauswart Meier vom 31.03.2026 über CHF 450.00 (Lindenhof): als nicht umlagefähig markiert"

  Szenario: Eintrag im Protokoll löschen
    Angenommen es gibt die umlagefähige Kategorie "Gartenpflege Süd"
    Und die Kategorie "Gartenpflege Süd" ist inzwischen nicht umlagefähig
    Und der Liegenschaftsverwalter ist auf der Seite "Protokoll"
    Wenn der Liegenschaftsverwalter den Eintrag "Kategorie «Gartenpflege Süd»: von umlagefähig auf nicht umlagefähig geändert" löschen will
    Dann warnt das Protokoll, der Eintrag von heute "wird endgültig aus dem Protokoll gelöscht: Kategorie «Gartenpflege Süd»: von umlagefähig auf nicht umlagefähig geändert. Gelöscht wird nur der Eintrag, nicht was er festhält. Das lässt sich nicht rückgängig machen."
    Wenn der Liegenschaftsverwalter das Löschen bestätigt
    Dann nennt das Protokoll "Kategorie «Gartenpflege Süd»: von umlagefähig auf nicht umlagefähig geändert" nicht mehr

  # Code-Review C-1: in einem anderen Tab (oder in der Demo von einem anderen Besucher) schon gelöscht
  Szenario: Eintrag löschen, der inzwischen schon gelöscht ist
    Angenommen es gibt die umlagefähige Kategorie "Gartenpflege West"
    Und die Kategorie "Gartenpflege West" ist inzwischen nicht umlagefähig
    Und der Liegenschaftsverwalter ist auf der Seite "Protokoll"
    Und der Liegenschaftsverwalter den Eintrag "Kategorie «Gartenpflege West»: von umlagefähig auf nicht umlagefähig geändert" löschen will
    Und der Eintrag zur Kategorie "Gartenpflege West" ist inzwischen anderswo gelöscht
    Wenn der Liegenschaftsverwalter das Löschen bestätigt
    Dann nennt das Protokoll "Kategorie «Gartenpflege West»: von umlagefähig auf nicht umlagefähig geändert" nicht mehr
