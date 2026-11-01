# language: de
@config
Funktionalität: Alle Daten exportieren
  Als Liegenschaftsverwalter
  möchte ich jederzeit alle meine Daten in einer Datei herunterladen
  damit ich sie in Excel lesen und zu einem anderen Programm mitnehmen kann

  # #496 (Entscheid des Product Owners, 31.10.2026): eine ZIP-Datei unter den Einstellungen mit einer Datendatei (JSON,
  # vollständig, mit den Beziehungen), einer Tabelle (CSV, UTF-8, Strichpunkt) je Art von Daten, den Belegen als Dateien
  # und einer Anleitung README.txt; das Protokoll gehört dazu, Gelöschtes nicht; der Export kommt ins Protokoll; die
  # Dateinamen in der Sprache der Oberfläche. Kein Import. Wortlaut und Namen: Entwurf docs/reviews/496-entwurf.md mit
  # der Fachprüfung docs/reviews/496-fachreview-1.md. Der Export enthält auch die Daten parallel laufender Szenarien: die Schritte suchen die eigenen
  # Datensätze, sie zählen nicht. Kein Szenario für einen misslungenen Export: der Download ist eine Antwort des Servers
  # ohne Seite, ein Fehler zwischen BFF und Backend («No scenario», tests/e2e/CLAUDE.md); den prüft ein Test darunter.

  Grundlage:
    Angenommen der Liegenschaftsverwalter ist auf den Einstellungen

  Szenario: Die Einstellungen erklären den Export
    Dann erklären die Einstellungen beim Export "Eine ZIP-Datei mit allen Daten, die Sie in Dwello erfasst haben, mit Belegen, Dokumenten, Abrechnungen und dem Protokoll. Die Tabellen öffnen Sie mit Excel; die Datei «daten.json» kann ein anderes Programm einlesen. Was Sie gelöscht haben, ist nicht dabei. Die Datei enthält die Daten Ihrer Mieter: Bewahren Sie sie sicher auf und löschen Sie sie, wenn Sie sie nicht mehr brauchen."

  Szenario: Alle Daten unter den Einstellungen exportieren
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und im Gebäude "Seeblick" gibt es die leere Wohnung "1.01"
    Und der Mieter "Hans Müller" existiert
    Und "Hans Müller" mietet die Wohnung "1.01" seit "2020-01-01" für "900" Franken
    Und "Hauswart Meier" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung" in der Kategorie "Hauswart" in Rechnung
    Und die Rechnung von "Hauswart Meier" hat den Beleg "meier-q1.pdf"
    Wenn der Liegenschaftsverwalter alle Daten exportiert
    Dann heisst der Export "Dwello-Daten" mit dem Datum von heute
    Und enthält der Export die Anleitung, die Datendatei und je eine Tabelle:
      | README.txt                      |
      | daten.json                      |
      | tabellen/gebäude.csv            |
      | tabellen/wohnungen.csv          |
      | tabellen/mieter.csv             |
      | tabellen/mietverträge.csv       |
      | tabellen/akonto.csv             |
      | tabellen/vereinbarte-nebenkosten.csv |
      | tabellen/rechnungen.csv         |
      | tabellen/belege.csv             |
      | tabellen/tankbestände.csv       |
      | tabellen/abrechnungen.csv       |
      | tabellen/abrechnungspositionen.csv |
      | tabellen/zahlungen.csv          |
      | tabellen/dokumente.csv          |
      | tabellen/kategorien.csv         |
      | tabellen/verteilschlüssel.csv   |
      | tabellen/heizprofile.csv        |
      | tabellen/protokoll.csv          |
      | tabellen/einstellungen.csv      |
    Und nennt die Datendatei des Exports beim Gebäude "Seeblick" die Wohnung "1.01" mit dem Mietvertrag von "Hans Müller"
    Und führt die Tabelle "tabellen/wohnungen.csv" des Exports die Wohnung "1.01" im Gebäude "Seeblick" mit "Vermietet" in der Spalte "Mietstatus"
    Und nennt die Datendatei des Exports beim Gebäude "Seeblick" die Rechnung von "Hauswart Meier" mit ihrem Beleg "meier-q1.pdf"
    Und enthält der Export den Beleg "meier-q1.pdf" der Rechnung von "Hauswart Meier" im Ordner "belege" als PDF

  Szenario: Die Tabellen des Exports öffnen sich in Excel
    Angenommen das Gebäude "Seeblick" in "Zürich" existiert
    Wenn der Liegenschaftsverwalter alle Daten exportiert
    Dann ist die Tabelle "tabellen/gebäude.csv" des Exports als UTF-8 für Excel gekennzeichnet
    Und führt die Tabelle "tabellen/gebäude.csv" des Exports das Gebäude "Seeblick" mit "Zürich" in der Spalte "Ort", durch Strichpunkte getrennt

  Szenariogrundriss: Die Dateinamen des Exports in der Sprache der Oberfläche
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Meier" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung" in der Kategorie "Hauswart" in Rechnung
    Und die Rechnung von "Hauswart Meier" hat den Beleg "meier-q1.pdf"
    Wenn der Liegenschaftsverwalter die Sprache "<Sprache>" wählt
    Und der Liegenschaftsverwalter alle Daten exportiert
    Dann heisst der Export "<Export>" mit dem Datum von heute
    Und enthält der Export die Anleitung, die Datendatei und je eine Tabelle:
      | README.txt   |
      | <Datendatei> |
      | <Tabelle>    |
    Und enthält der Export den Beleg "meier-q1.pdf" der Rechnung von "Hauswart Meier" im Ordner "<Belege>" als PDF

    Beispiele:
      | Sprache  | Export         | Datendatei   | Tabelle               | Belege                   |
      | Français | Dwello-Données | données.json | tableaux/immeubles.csv | pièces-justificatives    |
      | Italiano | Dwello-Dati    | dati.json    | tabelle/immobili.csv  | giustificativi           |
      | English  | Dwello-Data    | data.json    | tables/buildings.csv  | supporting-documents     |

  Szenario: Das Protokoll gehört zum Export
    Angenommen es gibt die umlagefähige Kategorie "Gartenpflege Ost"
    Und die Kategorie "Gartenpflege Ost" ist inzwischen nicht umlagefähig
    Wenn der Liegenschaftsverwalter alle Daten exportiert
    Dann nennt die Tabelle "tabellen/protokoll.csv" des Exports in der Spalte "Eintrag" "Kategorie «Gartenpflege Ost»: von umlagefähig auf nicht umlagefähig geändert"

  Szenario: Der Export steht im Protokoll
    Angenommen der Liegenschaftsverwalter hat gezählt, wie oft das Protokoll heute "Alle Daten exportiert" nennt
    Wenn der Liegenschaftsverwalter alle Daten exportiert
    Und der Liegenschaftsverwalter das Protokoll öffnet
    Dann nennt das Protokoll heute öfter "Alle Daten exportiert" als vor dem Export

  Szenario: Gelöschte Daten sind nicht im Export
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Meier" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung" in der Kategorie "Hauswart" in Rechnung
    Und die Rechnung von "Hauswart Meier" hat den Beleg "meier-q1.pdf"
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "120.00" Franken für "Gartenpflege" in der Kategorie "Hauswart" in Rechnung
    Und die Rechnung von "Hauswart Huber" hat den Beleg "huber-q1.pdf"
    Und die Rechnung von "Hauswart Huber" ist inzwischen gelöscht
    Wenn der Liegenschaftsverwalter alle Daten exportiert
    Dann nennt die Datendatei des Exports beim Gebäude "Seeblick" die Rechnung von "Hauswart Meier" mit ihrem Beleg "meier-q1.pdf"
    Und nennt die Datendatei des Exports beim Gebäude "Seeblick" keine Rechnung von "Hauswart Huber"
    Und führt die Tabelle "tabellen/rechnungen.csv" des Exports keine Rechnung von "Hauswart Huber"
    Und enthält der Ordner "belege" des Exports keinen Beleg der Rechnung von "Hauswart Huber"
