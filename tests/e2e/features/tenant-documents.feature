# language: de
@tenants
Funktionalität: Dokumente eines Mieters
  Als Liegenschaftsverwalter
  möchte ich Unterlagen eines Mieters, etwa das Übergabeprotokoll oder einen Betreibungsauszug, in Dwello ablegen
  damit ich sie beim Mieter wiederfinde

  Grundlage:
    Angenommen der Mieter "Lea Frei" existiert

  Szenario: Liegenschaftsverwalter lädt ein Dokument zu einem Mieter hoch
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochlädt
    Dann liegt beim Mieter das Dokument "Betreibungsauszug", heute hochgeladen
    Und hat das Dokument "Betreibungsauszug" keinen Versandstatus
    Und öffnet das Dokument "Betreibungsauszug" die PDF-Datei "betreibung.pdf"

  Szenario: Ohne Titel heisst das Dokument wie die Datei
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" ohne Titel hochlädt
    Dann liegt beim Mieter das Dokument "Uebergabeprotokoll", heute hochgeladen

  Szenario: Ein Foto als Dokument hochladen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter das Foto "ausweis.jpg" als "Ausweiskopie" hochlädt
    Dann liegt beim Mieter das Dokument "Ausweiskopie", heute hochgeladen
    Und öffnet das Dokument "Ausweiskopie" die JPG-Datei "ausweis.jpg"

  Szenario: Eine zu grosse Datei wird abgelehnt
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter eine PDF-Datei mit 11 MB als "Scan Mietvertrag" hochladen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Die Datei ist grösser als 10 MB. Wählen Sie eine kleinere Datei oder verkleinern Sie den Scan."
    Und steht als Titel des Dokuments weiterhin "Scan Mietvertrag"
    Und liegen beim Mieter noch keine Dokumente

  Szenario: Eine Datei, die weder PDF noch Bild ist, wird abgelehnt
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die Word-Datei "notizen.docx" als "Notizen" hochladen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut."
    Und steht als Titel des Dokuments weiterhin "Notizen"
    Und liegen beim Mieter noch keine Dokumente

  Szenario: Das Hochladen scheitert
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und das Hochladen von Dokumenten zu "Lea Frei" ist gestört
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen»."
    Und steht als Titel des Dokuments weiterhin "Betreibungsauszug"

  Szenario: Liegenschaftsverwalter löscht ein hochgeladenes Dokument
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will
    Dann sagt die Bestätigung "Dokument «Ausweiskopie» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen."
    Wenn der Liegenschaftsverwalter das Löschen bestätigt
    Dann liegen beim Mieter noch keine Dokumente

  # #852: eine Ablehnung ohne Code zeigt den Satz der Seite, nie den englischen Text des Backends
  Szenario: Ein inzwischen gelöschtes Dokument löschen
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und das Dokument "Ausweiskopie" von "Lea Frei" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will
    Und der Liegenschaftsverwalter das Löschen bestätigt
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Das Dokument gibt es nicht mehr. Laden Sie die Seite neu."

  Szenario: Mieter mit hochgeladenen Dokumenten löschen
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter den Mieter löschen will
    Dann sagt die Bestätigung, dass "Lea Frei" zusammen mit den hochgeladenen Dokumenten endgültig gelöscht wird
    Wenn der Liegenschaftsverwalter das Löschen bestätigt
    Dann findet der Liegenschaftsverwalter den Mieter "Lea Frei" nicht mehr

  # #1093: eine abgelehnte Datei zeigt die Fehlerseite der App, keinen Download
  Szenario: Ein inzwischen gelöschtes Dokument herunterladen
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und das Dokument "Ausweiskopie" von "Lea Frei" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" herunterladen will
    Dann liest der Liegenschaftsverwalter auf der Fehlerseite "Dieses Dokument gibt es nicht mehr. Wahrscheinlich wurde es gelöscht."

  # #1093: zurück zum Mieter, dessen Seite es noch gibt
  Szenario: Von der Fehlerseite eines Dokuments zurück zum Mieter
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und das Dokument "Ausweiskopie" von "Lea Frei" wurde inzwischen gelöscht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" herunterladen will
    Und der Liegenschaftsverwalter die Fehlerseite verlässt
    Dann ist der Liegenschaftsverwalter auf der Detailseite von "Lea Frei"

  # #677 (Helga P-3, Marco P-5): zwei Dokumente aus derselben Datei unterscheiden sich in der Uhrzeit
  Szenario: Ein hochgeladenes Dokument nennt seine Datei und die Uhrzeit
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochlädt
    Dann nennt das Dokument "Betreibungsauszug" die Datei "betreibung.pdf" und die Uhrzeit, zu der es heute hochgeladen wurde

  # #677 (Helga P-3, Marco P-5): Dwello warnt vor dem zweiten Hochladen einer Datei, verhindert es aber nicht
  Szenario: Vor dem zweiten Hochladen einer Datei warnt Dwello
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Uebergabeprotokoll"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" zum Hochladen wählt
    Dann warnt Dwello beim Feld «Datei», dass die Datei "Uebergabeprotokoll.pdf" heute schon als Dokument "Uebergabeprotokoll" hochgeladen wurde
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" als "Uebergabeprotokoll" hochlädt
    Dann liegen beim Mieter 2 Dokumente "Uebergabeprotokoll"

  # #677 (V-3): nur die Dokumente dieses Mieters zählen
  Szenario: Eine gleich benannte Datei eines anderen Mieters löst keine Warnung aus
    Angenommen der Mieter "Beat Huber" existiert
    Und "Beat Huber" hat das hochgeladene Dokument "Uebergabeprotokoll"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" zum Hochladen wählt
    Dann nennt das Feld «Datei» die gewählte Datei "Uebergabeprotokoll.pdf" ohne Warnung

  # #677 (Entscheid 9, Persona Sven P-3): während Dwello sendet, bleibt der Fokus auf der Schaltfläche, und Dwello sagt es an
  Szenario: Während des Hochladens bleibt der Fokus auf «Dokument hochladen»
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Hochladen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann sagt Dwello bei «Dokument hochladen» "Bitte warten …" an, und der Fokus bleibt dort

  # #677 (Entscheid 10, Persona Sven P-3): im Dialog bleibt der Fokus auf der Bestätigung
  Szenario: Während des Löschens bleibt der Fokus auf der Bestätigung im Dialog
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Löschen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will
    Und der Liegenschaftsverwalter das Löschen bestätigt
    Dann sagt Dwello bei «Dokument löschen» "Bitte warten …" an, und der Fokus bleibt dort

  # #677 (Persona Sven P-7): der Fehler kommt vor der Hilfe, sonst geht er am Ende einer langen Hilfe unter
  Szenario: Ein Screenreader liest beim Feld «Datei» zuerst den Fehler
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter das Dokument "Notizen" ohne Datei hochladen will
    Dann liest ein Screenreader beim Feld «Datei» zuerst den Fehler "Wählen Sie eine Datei aus." und danach den Hinweis "PDF, JPG oder PNG, höchstens 10 MB." vor
