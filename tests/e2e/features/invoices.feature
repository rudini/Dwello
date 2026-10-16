# language: de
@invoices
Funktionalität: Rechnungsliste
  Als Liegenschaftsverwalter
  möchte ich alle Rechnungen überblicken
  damit ich sehe, welche Kosten in die Nebenkostenabrechnung einfliessen

  Grundlage:
    Angenommen das Gebäude "Seeblick" in "Winterthur" existiert
    Und "Hauswart Huber" stellt dem Gebäude "Seeblick" "450.00" Franken für "Treppenhausreinigung Q1" in der Kategorie "Hauswart" in Rechnung
    Und der Liegenschaftsverwalter ist auf der Rechnungsliste

  Szenario: Rechnungen nach Rechnungssteller suchen
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "CHF 450.00" in der Kategorie "Hauswart"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Rechnungen nach Gebäude filtern
    Wenn der Liegenschaftsverwalter die Rechnungen nach dem Gebäude "Seeblick" filtert
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" über "CHF 450.00" in der Kategorie "Hauswart"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Rechnungen eines Jahres anzeigen
    Angenommen im Gebäude "Seeblick" gibt es eine Heizkostenrechnung über "3600.00" Franken für 2024
    Und im Gebäude "Seeblick" gibt es eine Heizkostenrechnung über "4100.00" Franken für 2025
    Wenn der Liegenschaftsverwalter die Rechnungen des Jahres 2024 im Gebäude "Seeblick" anzeigt
    Dann die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Nicht umlagefähige Rechnungen anzeigen
    Angenommen "Dachdecker Meier" stellt dem Gebäude "Seeblick" "3200.00" Franken für "Dachreparatur" in der Kategorie "Reparaturen" in Rechnung
    Wenn der Liegenschaftsverwalter die nicht umlagefähigen Rechnungen im Gebäude "Seeblick" anzeigt
    Dann sieht der Liegenschaftsverwalter die Rechnung von "Dachdecker Meier" über "CHF 3’200.00" in der Kategorie "Reparaturen"
    Und die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Manuell kategorisierte Rechnung
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Dann ist die Rechnung von "Hauswart Huber" als "Manuell" kategorisiert

  Szenario: Zur Erfassung einer neuen Rechnung wechseln
    Wenn der Liegenschaftsverwalter eine neue Rechnung erfassen will
    Dann ist der Liegenschaftsverwalter auf der Seite "Neue Rechnung"

  Szenario: Rechnung ansehen
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Und der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" ansieht
    Dann ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von "Hauswart Huber"

  Szenario: Rechnung aus der Liste bearbeiten
    Wenn der Liegenschaftsverwalter nach dem Rechnungssteller "Hauswart Huber" sucht
    Und der Liegenschaftsverwalter die Rechnung von "Hauswart Huber" bearbeiten will
    Dann ist der Liegenschaftsverwalter auf der Seite "Rechnung bearbeiten"

  Szenario: Mehrere Rechnungen hochladen und erstellen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" und das Foto der Rechnung von "Gartenbau Grün" hochlädt
    Dann erinnert Dwello daran, die Originalrechnungen aufzubewahren
    Und schlägt die KI für die Rechnung von "Elektro Blitz" den Betrag "1250.00", die Rechnungsnummer "R-1001" und die Kategorie "Allgemeinstrom" vor
    Und ist bei der Rechnung von "Elektro Blitz" das Rechnungsdatum als unsicher markiert
    Und sagt die Datei von "Elektro Blitz" "Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum."
    Wenn der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "2 Rechnungen erstellt"
    Wenn der Liegenschaftsverwalter die Rechnungen nach dem Gebäude "Seeblick" filtert
    Dann die Rechnungsliste enthält genau 3 Rechnung
    Wenn der Liegenschaftsverwalter die Rechnung von "Elektro Blitz" ansieht
    Dann öffnet der Beleg die PDF-Rechnung von "Elektro Blitz"

  Szenario: Eine Datei, die weder PDF noch Bild ist, blockiert die anderen nicht
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" und die Word-Datei "notizen.docx" hochlädt
    Dann sagt die Datei "notizen.docx" "Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut."
    Wenn der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "1 Rechnung erstellt"

  Szenario: Rechnung ohne KI aus einer Datei erfassen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt, während die KI nicht verfügbar ist
    Dann sagt die Datei von "Elektro Blitz" "Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus."
    Wenn der Liegenschaftsverwalter bei der Datei den Rechnungssteller "Elektro Blitz", die Beschreibung "Treppenhauslicht", den Betrag "180.00" und das Rechnungsdatum "2026-03-31" erfasst
    Und der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt die Datei von "Elektro Blitz" "Wählen Sie eine Kategorie."
    Wenn der Liegenschaftsverwalter bei der Datei von "Elektro Blitz" die Kategorie "Allgemeinstrom" wählt
    Und der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "1 Rechnung erstellt"

  Szenario: Eine schon erfasste Rechnung wird nicht doppelt erstellt
    Angenommen die Rechnung von "Hauswart Huber" hat die Rechnungsnummer "R-1001"
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Hauswart Huber" hochlädt
    Dann sagt die Datei von "Hauswart Huber" "Diese Rechnung ist schon erfasst."
    Und ist die Datei von "Hauswart Huber" nicht zum Erstellen ausgewählt

  Szenario: Eine Datei mit mehreren Rechnungen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Sammelscan" hochlädt
    Dann sagt die Datei von "Sammelscan" "Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch."
    Und ist die Datei von "Sammelscan" nicht zum Erstellen ausgewählt

  # Die KI-Ersatzattrappe erkennt am Rechnungssteller, was auf der Rechnung steht (backend/scripts/llm-stub.ts)
  Szenario: Schlussrechnung mit abgezogenen Akontozahlungen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Schlussrechnung" hochlädt
    Dann sagt die Datei von "Werke Schlussrechnung" "Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt."

  Szenario: Rechnung mit Kosten, die nicht umlagefähig sind
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Lift Service und Reparatur" hochlädt
    Dann sagt die Datei von "Lift Service und Reparatur" "Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen."
    Und ist die Datei von "Lift Service und Reparatur" nicht zum Erstellen ausgewählt

  Szenario: Eine Gutschrift ist nicht zum Erstellen ausgewählt
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Gutschrift" hochlädt
    Dann sagt die Datei von "Werke Gutschrift" "Das ist eine Gutschrift. Ziehen Sie sie vom Betrag der Rechnung ab, zu der sie gehört."
    Und ist die Datei von "Werke Gutschrift" nicht zum Erstellen ausgewählt

  Szenario: Hochladen abbrechen verwirft die Dateien
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Und der Liegenschaftsverwalter das Hochladen abbrechen will
    Dann fragt Dwello zurück "Hochgeladene Dateien und Ihre Eingaben gehen verloren."
    Wenn der Liegenschaftsverwalter das Abbrechen bestätigt
    Und der Liegenschaftsverwalter die Rechnungen nach dem Gebäude "Seeblick" filtert
    Dann die Rechnungsliste enthält genau 1 Rechnung

  Szenario: Das Auslesen einer Datei scheitert
    Angenommen das Auslesen von Dateien ist gestört
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Dann sagt die Datei von "Elektro Blitz" "Die Datei wurde nicht gelesen, weil Dwello nicht geantwortet hat. Wählen Sie «Erneut versuchen» oder füllen Sie die Felder aus."

  Szenario: Das Erstellen scheitert
    Angenommen das Erstellen von Rechnungen ist gestört
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Und der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt die Datei von "Elektro Blitz" "Die Rechnung wurde nicht erstellt, weil Dwello nicht geantwortet hat. Versuchen Sie es noch einmal."
