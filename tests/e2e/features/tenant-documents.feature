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
    Dann warnt Dwello bei «Datei», dass die Datei "Uebergabeprotokoll.pdf" heute schon als Dokument "Uebergabeprotokoll" hochgeladen wurde
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" als "Uebergabeprotokoll" hochlädt
    Dann liegen beim Mieter 2 Dokumente "Uebergabeprotokoll"

  # #677 (V-3): nur die Dokumente dieses Mieters zählen
  Szenario: Eine gleich benannte Datei eines anderen Mieters löst keine Warnung aus
    Angenommen der Mieter "Beat Huber" existiert
    Und "Beat Huber" hat das hochgeladene Dokument "Uebergabeprotokoll"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" zum Hochladen wählt
    Dann nennt Dwello bei «Datei» die gewählte Datei "Uebergabeprotokoll.pdf" ohne Warnung

  # #677 (Entscheid 9, Persona Sven P-3): während Dwello sendet, bleibt der Fokus auf der Schaltfläche, und Dwello sagt es an
  Szenario: Während des Hochladens bleibt der Fokus auf «Dokument hochladen»
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Hochladen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann sagt Dwello bei «Dokument hochladen» "Bitte warten …" an, und der Fokus bleibt dort

  # #1182 (Persona Helga P-11): bei 150 % Zoom war ein arbeitender Knopf so blass, dass «Bitte warten …» kaum lesbar war
  Szenariogrundriss: Während des Hochladens ist «Dokument hochladen» gut lesbar und sieht gesperrt aus (<Darstellung>)
    Angenommen der Liegenschaftsverwalter sieht Dwello in der Darstellung "<Darstellung>"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Hochladen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann hebt sich "Bitte warten …" bei «Dokument hochladen» mindestens 4.5:1 vom Hintergrund ab
    Und «Dokument hochladen» ist ausgegraut

    Beispiele:
      | Darstellung |
      | hell        |
      | dunkel      |

  # #1262 (Persona Sven P-3, Helga): eine Änderung während des Hochladens käme nicht mehr mit
  Szenario: Während des Hochladens lassen sich Datei und Titel nicht ändern
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Hochladen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann sagt Dwello bei «Dokument hochladen» "Bitte warten …" an, und der Fokus bleibt dort
    Und sind «Datei» und «Titel» gesperrt, auch für einen Screenreader
    Und sehen «Datei» und «Titel» ausgegraut aus

  # #1262: nach dem Fehler sind die Felder wieder frei und halten, was gewählt war
  Szenario: Nach einem gescheiterten Hochladen lassen sich Datei und Titel wieder ändern
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und das Hochladen von Dokumenten zu "Lea Frei" ist gestört
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann sieht der Liegenschaftsverwalter die Fehlermeldung "Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen»."
    Und lassen sich «Datei» und «Titel» wieder ändern
    Und nennt Dwello bei «Datei» die gewählte Datei "betreibung.pdf" ohne Warnung
    Und steht als Titel des Dokuments weiterhin "Betreibungsauszug"

  # #677 (Entscheid 10, Persona Sven P-3): im Dialog bleibt der Fokus auf der Bestätigung
  Szenario: Während des Löschens bleibt der Fokus auf der Bestätigung im Dialog
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Löschen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will
    Und der Liegenschaftsverwalter das Löschen bestätigt
    Dann sagt Dwello bei «Dokument löschen» "Bitte warten …" an, und der Fokus bleibt dort

  # #1209 (Persona Helga P-1): ein arbeitender Knopf sieht auf den ersten Blick gesperrt aus
  Szenario: Während des Hochladens zeigt «Dokument hochladen» ein Fortschrittszeichen
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Hochladen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochladen will
    Dann zeigt «Dokument hochladen» mit "Bitte warten …" ein Fortschrittszeichen

  # #1209 (Persona Helga P-2): neben dem arbeitenden Knopf sieht «Abbrechen» aus wie sonst, ein Klick darauf tut nichts;
  # #1261 (Helga P-1, Sven P-1): ein Satz sagt, warum, auch dem Screenreader
  Szenario: Während des Löschens sieht «Abbrechen» aus wie sonst und tut nichts
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Ausweiskopie"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und Dwello antwortet beim Löschen von Dokumenten zu "Lea Frei" noch nicht
    Wenn der Liegenschaftsverwalter das Dokument "Ausweiskopie" löschen will
    Dann sagt der Dialog vor dem Bestätigen noch nicht "Dwello führt die Aktion gerade aus. Abbrechen ist nicht mehr möglich."
    Wenn der Liegenschaftsverwalter das Löschen bestätigt
    Dann hebt sich «Abbrechen» im Dialog mindestens 4.5:1 vom Hintergrund ab, während Dwello "Bitte warten …" ansagt
    Und sagt der Dialog während des Löschens "Dwello führt die Aktion gerade aus. Abbrechen ist nicht mehr möglich."
    Und liest ein Screenreader «Abbrechen» als nicht verfügbar vor, mit dem Satz "Dwello führt die Aktion gerade aus. Abbrechen ist nicht mehr möglich."
    Wenn der Liegenschaftsverwalter im Dialog «Abbrechen» drückt
    Dann sagt Dwello bei «Dokument löschen» "Bitte warten …" an, und der Fokus bleibt dort

  # #677 (Persona Sven P-7): der Fehler kommt vor der Hilfe, sonst geht er am Ende einer langen Hilfe unter
  Szenario: Ein Screenreader liest bei «Datei» zuerst den Fehler
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter das Dokument "Notizen" ohne Datei hochladen will
    Dann liest ein Screenreader bei «Datei» zuerst den Fehler "Wählen Sie eine Datei aus." und danach den Hinweis "PDF, JPG oder PNG, höchstens 10 MB." vor

  # #1181 (Helga H-1, Sven S-4): zwei Dokumente mit demselben Titel lassen sich unterscheiden, auch beim Löschen
  Szenario: Zwei Dokumente mit demselben Titel tragen eine Nummer
    Angenommen "Lea Frei" hat das hochgeladene Dokument "Uebergabeprotokoll"
    Und der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Wenn der Liegenschaftsverwalter die PDF-Datei "Uebergabeprotokoll.pdf" ohne Titel hochlädt
    Dann heissen die Dokumente beim Mieter "Uebergabeprotokoll (1 von 2)" und "Uebergabeprotokoll (2 von 2)", auch auf ihren Schaltflächen
    Wenn der Liegenschaftsverwalter das Dokument "Uebergabeprotokoll (2 von 2)" löschen will
    Dann sagt die Bestätigung "Dokument «Uebergabeprotokoll (2 von 2)» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen."

  # #1173 (Sven 2 P-4): eine Aktion, die auf der Seite bleibt, sagt nur ihr Ergebnis an, nicht noch einmal den Seitentitel
  Szenario: Nach dem Hochladen sagt der Screenreader nur die Bestätigung an
    Angenommen der Liegenschaftsverwalter ist auf der Detailseite des Mieters "Lea Frei"
    Und ein Screenreader hört mit
    Wenn der Liegenschaftsverwalter die PDF-Datei "betreibung.pdf" als "Betreibungsauszug" hochlädt
    Dann liegt beim Mieter das Dokument "Betreibungsauszug", heute hochgeladen
    Und sagt der Screenreader "Dokument «Betreibungsauszug» hochgeladen" an
    Aber sagt der Screenreader den Seitentitel nicht noch einmal an

  # #1173: ein Wechsel auf eine andere Seite sagt deren Titel weiterhin an, einmal
  Szenario: Beim Öffnen eines Mieters sagt der Screenreader seinen Seitentitel an
    Angenommen der Liegenschaftsverwalter ist auf der Mieterliste
    Und der Liegenschaftsverwalter den Mieter "Lea Frei" sucht
    Und ein Screenreader hört mit
    Wenn der Liegenschaftsverwalter den Mieter "Lea Frei" öffnet
    Dann sagt der Screenreader nur den Seitentitel des Mieters "Lea Frei" an
