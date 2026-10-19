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
    Wenn der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "2 Rechnungen erstellt"
    Und verlinkt Dwello die erstellte Rechnung von "Elektro Blitz" vom "31.03.2026"
    Wenn der Liegenschaftsverwalter die Rechnungen nach dem Gebäude "Seeblick" filtert
    Dann die Rechnungsliste enthält genau 3 Rechnung
    Wenn der Liegenschaftsverwalter die Rechnung von "Elektro Blitz" ansieht
    Dann öffnet der Beleg die PDF-Rechnung von "Elektro Blitz"

  # Ohne Grafikkarte liest die KI eine Datei über eine Minute lang (#419); die KI-Ersatzattrappe liest «… Langsam» nach 35 s
  Szenario: Dwello wartet auf eine KI, die zum Lesen länger als eine halbe Minute braucht
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz Langsam" hochlädt
    Dann schlägt die KI nach dem langen Lesen für die Rechnung von "Elektro Blitz Langsam" den Betrag "1250.00" vor

  Szenario: Eine Datei, die weder PDF noch Bild ist, blockiert die anderen nicht
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" und die Word-Datei "notizen.docx" hochlädt
    Dann sagt die Datei "notizen.docx" "Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut."
    Wenn der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "1 Rechnung erstellt"

  Szenario: Dwello sagt, was nach dem Lesen zu tun ist, und meldet eine entfernte Datei
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" und die Word-Datei "notizen.docx" hochlädt
    Dann meldet Dwello "2 von 2 Dateien gelesen. Bitte prüfen: 1. Nicht möglich: 1."
    Wenn der Liegenschaftsverwalter die Datei "notizen.docx" entfernt
    Dann meldet Dwello "notizen.docx entfernt."

  Szenario: Eine hochgeladene Datei gross ansehen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Und der Liegenschaftsverwalter die Datei von "Elektro Blitz" gross ansieht
    Dann zeigt ein neuer Tab die Datei als PDF

  Szenario: Rechnung ohne KI aus einer Datei erfassen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt, während die KI nicht verfügbar ist
    Dann sagt die Datei von "Elektro Blitz" "Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus."
    Und sagt die Datei von "Elektro Blitz" "Füllen Sie aus: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung."
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
    Dann sagt die Datei von "Sammelscan" "Diese Datei enthält mehrere Rechnungen. Laden Sie jede Rechnung als eigene Datei hoch, oder erfassen Sie jede mit «Rechnung erfassen» und fügen Sie diese Datei danach auf ihrer Seite mit «Beleg hinzufügen» an."
    Und ist die Datei von "Sammelscan" nicht zum Erstellen ausgewählt

  # Die KI-Ersatzattrappe erkennt am Rechnungssteller, was auf der Rechnung steht (backend/scripts/llm-stub.ts)
  # #455: eine kurze Zeile mit dem abgezogenen und dem vorgeschlagenen Betrag, die Regel als Hilfetext darunter
  Szenario: Schlussrechnung mit abgezogenen Akontorechnungen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Schlussrechnung" hochlädt
    Dann sagt die Datei von "Werke Schlussrechnung" "Auf der Rechnung sind Akontorechnungen von CHF 1’000.00 abgezogen. Als Betrag ist das Total vor dem Abzug vorgeschlagen: CHF 1’250.00."
    Und erklärt der Hinweis zu den Akontorechnungen von "Werke Schlussrechnung" "Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen». Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen». Sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist. Ergibt das 0, erfassen Sie die Schlussrechnung nicht. Ergibt es weniger als 0, erfassen Sie sie auch nicht: Verringern Sie den Betrag der abgerechneten Akontorechnungen um den Unterschied, und berichtigen Sie die Abrechnungen mit ihnen."

  # #455: eine Akontorechnung allein zählt sonst mit der Schlussrechnung doppelt (Art. 257b Abs. 1 OR)
  Szenario: Eine Akontorechnung ist nicht zum Erstellen ausgewählt
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Akontorechnung" hochlädt
    Dann sagt die Datei von "Werke Akontorechnung" "Das ist eine Akontorechnung: ein Vorschuss, den der Rechnungssteller später mit der Schlussrechnung abrechnet. Erfassen Sie in der Regel nur die Schlussrechnung mit dem Total. Kommt sie erst nach der Abrechnung dieser Periode, setzen Sie das Häkchen bei «Diese Rechnung erstellen» und erfassen Sie die Akontorechnung; ziehen Sie ihren Betrag dann von der Schlussrechnung ab."
    Und ist die Datei von "Werke Akontorechnung" nicht zum Erstellen ausgewählt
    Und sagt die Datei von "Werke Akontorechnung" nicht "Wählen Sie eine Kategorie."

  # #455: kommt die Schlussrechnung erst nach der Abrechnung, erfasst der Liegenschaftsverwalter die Akontorechnung selbst
  Szenario: Eine ausgewählte Akontorechnung erstellen
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Akontorechnung" hochlädt
    Und der Liegenschaftsverwalter die Datei von "Werke Akontorechnung" zum Erstellen auswählt
    Dann sagt die Datei von "Werke Akontorechnung" "Wählen Sie eine Kategorie."
    Wenn der Liegenschaftsverwalter bei der Datei von "Werke Akontorechnung" die Kategorie "Allgemeinstrom" wählt
    Und der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "1 Rechnung erstellt"

  Szenario: Rechnung mit Kosten, die nicht umlagefähig sind
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Lift Service und Reparatur" hochlädt
    Dann sagt die Datei von "Lift Service und Reparatur" "Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen."
    Und ist die Datei von "Lift Service und Reparatur" nicht zum Erstellen ausgewählt
    Wenn der Liegenschaftsverwalter bei der Datei von "Lift Service und Reparatur" die Kategorie "Reparaturen" wählt
    Dann sagt die Datei von "Lift Service und Reparatur" nicht "nicht umlagefähig sind"

  Szenario: Eine Gutschrift ist nicht zum Erstellen ausgewählt
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Gutschrift" hochlädt
    Dann sagt die Datei von "Werke Gutschrift" "Das ist eine Gutschrift. Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung, zu der sie gehört, um die Gutschrift: hier in ihrer Zeile oder, wenn sie schon erfasst ist, mit «Rechnung bearbeiten». Bewahren Sie die Gutschrift mit der Originalrechnung auf."
    Und ist die Datei von "Werke Gutschrift" nicht zum Erstellen ausgewählt
    Und sagt die Datei von "Werke Gutschrift" nicht "Wählen Sie eine Kategorie."

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

  Szenario: Unsichere und nicht gefundene Angaben werden getrennt genannt
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Dann sagt die Datei von "Elektro Blitz" "Prüfen Sie: Rechnungsdatum."
    Und sagt die Datei von "Elektro Blitz" "Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum."
    Und erklärt Dwello "Dwello speichert die Datei jeder erstellten Rechnung als Beleg. Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht."

  Szenario: Nur vollständige Rechnungen werden gezählt und erstellt
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnungen von "Elektro Blitz" und "Werke Schlussrechnung" hochlädt
    Dann sagt die Datei von "Werke Schlussrechnung" "Wählen Sie eine Kategorie."
    Und bietet Dwello "1 Rechnung erstellen (1 unvollständig)" an
    Wenn der Liegenschaftsverwalter die Rechnungen erstellt
    Dann sagt Dwello "1 Rechnung erstellt"
    Und nennt Dwello die Datei von "Werke Schlussrechnung" als noch offen
    Wenn der Liegenschaftsverwalter das Hochladen abbrechen will
    Dann fragt Dwello zurück "Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren."

  Szenario: Die KI antwortet nichts Lesbares
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt, während die KI nichts Lesbares antwortet
    Dann sagt die Datei von "Elektro Blitz" "Die KI hat keine lesbare Antwort gegeben. Wählen Sie «Erneut versuchen» oder füllen Sie die Felder aus."

  Szenario: Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Werke Schlussrechnung" hochlädt
    Und der Liegenschaftsverwalter bei der Datei von "Werke Schlussrechnung" die Kategorie "Allgemeinstrom" wählt
    Und der Liegenschaftsverwalter die Rechnungen erstellt
    Und der Liegenschaftsverwalter die Rechnung von "Werke Schlussrechnung" ansieht
    Dann steht beim Betrag der Rechnung "Auf dem Beleg sind Akontorechnungen von CHF 1’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug, weniger die Akontorechnungen, die schon abgerechnet sind."
    Und erinnert der Beleg nicht an abgezogene Akontorechnungen

  # #455 (#268): der Dateiknopf des Browsers spricht die Sprache des Browsers, nicht die von Dwello
  Szenario: Die Dateien werden in der Sprache von Dwello ausgewählt
    Wenn der Liegenschaftsverwalter das Hochladen von Rechnungen öffnet
    Dann bietet der Dialog die Dateien mit "Dateien auswählen" zur Auswahl an

  # #455 (#268): Escape schliesst die offene Auswahl der Kategorie, nicht das Hochladen
  Szenario: Escape in der Auswahl der Kategorie bricht das Hochladen nicht ab
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Und der Liegenschaftsverwalter die Auswahl der Kategorie bei der Datei von "Elektro Blitz" mit Escape schliesst
    Dann fragt Dwello nicht, ob das Hochladen abgebrochen werden soll

  # #455 (#268): die Rechnungen derselben Kategorie im Gebäude geben den Verteilschlüssel vor, nicht ein leerer Standard
  Szenario: Der Verteilschlüssel der Rechnungen derselben Kategorie wird vorgeschlagen
    Angenommen "EW Winterthur" stellt dem Gebäude "Seeblick" "300.00" Franken für "Allgemeinstrom Q4" in der Kategorie "Allgemeinstrom" in Rechnung
    Wenn der Liegenschaftsverwalter für das Gebäude "Seeblick" die PDF-Rechnung von "Elektro Blitz" hochlädt
    Dann schlägt Dwello bei der Datei von "Elektro Blitz" den Verteilschlüssel "Pro Fläche (m²)" vor
