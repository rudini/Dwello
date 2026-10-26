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
