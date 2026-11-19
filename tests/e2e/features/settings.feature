# language: de
@config
Funktionalität: Einstellungen
  Als Liegenschaftsverwalter
  möchte ich die Angaben meiner Verwaltung hinterlegen
  damit Abrechnungen und Mahnungen den richtigen Absender und die richtige IBAN tragen

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen

  Szenariogrundriss: Stammdaten öffnen
    Wenn der Liegenschaftsverwalter die Stammdaten "<Stammdaten>" öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "<Seite>"

    Beispiele:
      | Stammdaten       | Seite            |
      | Kategorien       | Kategorien       |
      | Heizprofile      | Heizprofile      |
      | Verteilschlüssel | Verteilschlüssel |

  # Protokoll (#357, Entscheid in #111): Änderungen und Anmeldungen mit Datum, unter den Einstellungen; die Einträge
  # bleiben, bis der Liegenschaftsverwalter sie löscht. Die übrigen Einträge prüfen audit-log.pg.test.ts und
  # auth-routes.test.ts: die Anmeldung läuft hier nicht über Google, die Verwaltungspauschale gilt für alle parallel
  # laufenden Szenarien, und das Zurücksetzen einer Zahlung und das Berichtigen einer Abrechnung schreiben denselben
  # Eintrag wie die übrigen Änderungen.
  Szenario: Protokoll öffnen
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Protokoll"

  # #951 (Persona Dr. Weber 817 P-6): die Beschreibung nennt auch den Wechsel der KI, die Zugangsschlüssel für
  # KI-Programme und deren Abrufe; den Text des leeren Protokolls prüft audit-log-page.dom.test.ts, denn parallel
  # laufende Szenarien füllen das Protokoll. Wortlaut nach Fachprüfung 951-1 F-1
  Szenario: Das Protokoll nennt die Zugangsschlüssel und die Abrufe von KI-Programmen
    Dann erklären die Einstellungen beim Protokoll "Anmeldungen, Änderungen, die Ihre Abrechnungen beeinflussen, Wechsel der KI, Zugangsschlüssel für KI-Programme und Abrufe dieser Programme, mit Datum"
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann erklärt die Seite "Protokoll" "Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen, mit Datum und Uhrzeit. Dazu jeder Wechsel der KI, das Erstellen, Widerrufen und Ablaufen eines Zugangsschlüssels für KI-Programme und jeder Abruf eines KI-Programms. Die Einträge bleiben, bis Sie sie löschen."

  # #746: jede Anmeldung schreibt einen Eintrag; das Protokoll zeigt die neuesten 50, die älteren auf weiteren Seiten
  Szenario: Ältere Einträge des Protokolls auf weiteren Seiten finden
    Angenommen das Protokoll hat aus dem Jahr 2001 den Eintrag zum Zugangsschlüssel "Altschlüssel" und 50 neuere
    Wenn der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt die erste Seite des Protokolls "Zugangsschlüssel «Altschlüssel» erstellt" nicht
    Wenn der Liegenschaftsverwalter zur letzten Seite des Protokolls blättert
    Dann nennt das Protokoll "Zugangsschlüssel «Altschlüssel» erstellt"

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


  # #1456 (Entscheid des Product Owners, 18. und 19.11.2026): «Einstellungen» ist eine Übersicht mit drei Gruppen; das
  # Formular steht auf der Seite «Absender und Konto» (settings-sender.feature)
  Szenario: Die Einstellungen zeigen drei Gruppen und kein Formular
    Dann nennen die Einstellungen in der Gruppe "Ihre Angaben" nur "Absender und Konto"
    Und nennen die Einstellungen in der Gruppe "Abrechnung" nur "Kategorien, Verteilschlüssel, Heizprofile"
    Und nennen die Einstellungen in der Gruppe "Daten und Sicherheit" nur "KI, Zugangsschlüssel für KI-Programme, Protokoll, Updates, Alle Daten exportieren"
    Und fragen die Einstellungen nicht nach der Zahlungsfrist
    Und lässt sich in den Einstellungen nur "Alle Daten exportieren" auslösen

  Szenario: Die Einstellungen sagen, was unter «Absender und Konto» steht
    Dann erklären die Einstellungen bei «Absender und Konto» "Absender, Konto, Fristen, Bezeichnungen und Vorschläge für Ihre Abrechnungen"
    Und melden die Einstellungen bei «Absender und Konto» keine fehlenden Angaben

  Szenario: Absender und Konto öffnen
    Wenn der Liegenschaftsverwalter in den Einstellungen «Absender und Konto» öffnet
    Dann ist der Liegenschaftsverwalter auf der Seite "Absender und Konto"

  # Die Einstellungen gelten für alle parallel laufenden Szenarien: die Szenarien mit fehlenden Angaben laufen auf einer
  # eigenen Installation. Beide Sätze zusammen prüft settings-overview.test.ts
  @frische-installation
  Szenario: Die Einstellungen melden eine IBAN ohne Firmenadresse beim Link zu «Absender und Konto»
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" ohne Firmenname, PLZ und Ort hinterlegt
    Und der Liegenschaftsverwalter ist auf den Einstellungen
    Dann melden die Einstellungen bei «Absender und Konto» "Es fehlen Angaben zur Firmenadresse."

  @frische-installation
  Szenario: Die Einstellungen melden einen unvollständigen Kontoinhaber beim Link zu «Absender und Konto»
    Angenommen das Konto der IBAN "CH93 0076 2011 6238 5295 7" gehört "Erika Muster", "Seeweg 5", "6003 Luzern"
    Und in den Einstellungen fehlt inzwischen "Ort des Kontoinhabers"
    Und der Liegenschaftsverwalter ist auf den Einstellungen
    Dann melden die Einstellungen bei «Absender und Konto» "Es fehlen Angaben zum Kontoinhaber."

  # #1456: der Schalter aus #1453 steht in «Daten und Sicherheit» und speichert sofort. Die Einstellung gilt für alle
  # parallel laufenden Szenarien: das Szenario schaltet auf der frischen Installation um (wie aktualisierung.feature)
  Szenario: Die Suche nach neuen Versionen speichert beim Umschalten
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter in den Einstellungen der frischen Installation die Suche nach neuen Versionen ausschaltet
    Dann bestätigen die Einstellungen beim Schalter "Gespeichert. Dwello sucht nicht mehr nach neuen Versionen."
    Wenn der Liegenschaftsverwalter in den Einstellungen die Suche nach neuen Versionen wieder einschaltet
    Dann bestätigen die Einstellungen beim Schalter "Gespeichert. Dwello sucht täglich nach neuen Versionen."

  # #1456 (Entscheid des Product Owners, 19.11.2026): der Hilfetext sagt, dass der Schalter ohne «Speichern» speichert
  @wip
  Szenario: Der Schalter für die Suche nach neuen Versionen sagt, dass er sofort speichert
    Angenommen Dwello ist eingerichtet und die Sicherung auch
    Wenn der Liegenschaftsverwalter die Einstellungen der frischen Installation öffnet
    Dann erklärt die Einstellung "Täglich nach neuen Versionen suchen" "Der Schalter speichert, sobald Sie ihn umlegen."
