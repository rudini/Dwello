# Sven – Dokumente beim Mieter hochladen (upload174)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, Zoom 100 %, nur Tastatur; beurteilt nach dem Accessibility-Tree (Rolle, Name, Beschreibung, Live-Regionen, Fokus), ausgelesen per `readOut` und CDP.
Mieter: Laura Keller (Gebäude Alpenblick, Wohnung EG), `/tenants/a0000001-0001-0001-0001-000000000008`.
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/sven-upload174/` (s1–s9.mjs, 01–07*.png).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mieter Laura Keller, Karte «Dokumente», Formular «Dokument hochladen» | Wird die Word-Datei abgelehnt (oder fehlt die Datei), sagt der Screenreader nichts zum Fehler. Die Live-Regionen melden nur «Laura Keller - Dwello», der Fokus bleibt auf `<body>`. Der Fehlertext steht als gewöhnlicher Absatz unter «Datei» und ist nur über die Beschreibung des Dateifelds hörbar. Danach landet Tab im Fussbereich («Datenschutz»). Ich halte den Upload womöglich für gelungen. |
| P-2 | Major | dito, gestörte Verbindung (POST `?/upload` → 500) | Bei der gestörten Verbindung höre ich gar nichts: Beide Live-Regionen bleiben leer, auch nach 3 s, und der Fokus bleibt auf `<body>`. Der Text «Das Dokument wurde nicht gespeichert. Laden Sie die Datei erneut hoch.» steht nur still im Formular. |
| P-3 | Minor | dito, während des Sendens | Beim Senden wird der Knopf zu «Bitte warten …» [disabled]. Dabei verliert er den Fokus, und dieser fällt auf `<body>`. Dass gesendet wird, wird nicht angesagt (kein `aria-busy`, keine Statusmeldung). Nach dem Senden steht der Fokus nicht mehr im Formular. |
| P-4 | Minor | dito, nach Erfolg (Hochladen und Löschen) | Nach dem Hochladen und nach dem Löschen springt der Fokus auf die Überschrift «Laura Keller» (h1) ganz oben, und die assertive Region sagt «Laura Keller - Dwello» wie bei einem Seitenwechsel. Um das neue Dokument zu prüfen, muss ich mich wieder durch Kontaktdaten, Miete und Mietverträge bewegen. Die Statusmeldung selbst («Dokument «Mietvertrag unterschrieben» hochgeladen» bzw. «… gelöscht») ist gut. |
| P-5 | Nit | dito, Fehler bei gestörter Verbindung | «Laden Sie die Datei erneut hoch» klingt so, als müsste ich die Datei neu auswählen. Das Dateifeld meldet aber weiterhin «Uebergabeprotokoll.pdf», und ein erneuter Druck auf «Dokument hochladen» genügte. Ausserdem sagt der Text nicht, was passiert ist (z. B. die Verbindung). |

## Beobachtungen

- Das Dateifeld wird als «Datei, Schaltfläche» angesagt, mit dem Wert «No file chosen». Das ist der Text des Browsers (Chromium im Test auf Englisch), nicht Dwellos. In einem deutschen Chrome käme «Keine ausgewählt».
- Der Auswahldialog filtert auf `.pdf,.jpg,.jpeg,.png`. Die Word-Datei konnte ich nur über «Alle Dateien» wählen. Das ist gut so, denn die Ablehnung durch Dwello greift trotzdem.
- Gut: Dateifeld und Titelfeld haben eine korrekt verknüpfte Hilfe (`aria-describedby`). Nach einem Fehler wird das Dateifeld `invalid=true`, und der Fehlertext hängt an seiner Beschreibung. Der Titel «Meine Notizen» bzw. «Übergabeprotokoll Einzug» und die gewählte Datei bleiben nach dem Fehler erhalten.
- Gut: Der Löschknopf heisst eindeutig «Löschen: Mietvertrag unterschrieben». Der Dialog ist `role=dialog`, `aria-modal=true` und heisst «Dokument löschen?». Seine Beschreibung lautet «Mietvertrag unterschrieben wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.». Der Fokus beginnt auf «Abbrechen», Tab bleibt im Dialog gefangen, und Escape schliesst ihn und bringt den Fokus zurück auf «Löschen: Mietvertrag unterschrieben».
- Der PDF-Link heisst «PDF Mietvertrag unterschrieben». Er ist verständlich, aber es wird nicht gesagt, ob er in einem neuen Fenster oder als Download öffnet (nicht geöffnet).
- Der Dokumenttitel und «Hochgeladen am 14.10.2026» sind zwei lose Absätze im Listeneintrag. Das ist hörbar, aber ohne Überschrift oder Link pro Dokument kann ich nicht schnell von Dokument zu Dokument springen (nur per Listeneintrag).
- Senden ohne Datei: Dort zeigt sich das gleiche Muster wie bei P-1. Der Text «Wählen Sie eine Datei aus.» erscheint still, der Fokus bleibt auf `<body>`, und angesagt wird nur «Laura Keller - Dwello».

## Aufgabe geschafft: ja

Ich habe das PDF abgelegt, die Word-Datei wurde abgelehnt, und den zweiten Versuch habe ich mit der gestörten Verbindung gemacht. Den Mietvertrag habe ich wieder gelöscht. Die Fehler hätte ich als echter Screenreader-Nutzer aber nur durch Zufall bemerkt (P-1, P-2).

## Aufwand

Etwa 15 Minuten, 9 Skripte. Vom Seitenanfang braucht es zum Dateifeld: Tab, Enter auf «Zum Inhalt springen» und dann 8 Tabs. Hochladen braucht 3 Tasten plus die Dateiauswahl. Zum Löschen braucht es 11 Tabs ab dem Sprunglink, dann Enter, Tab und Enter.

## Ablauf

1. **Seite Laura Keller öffnen.** Erwartet: eine Überschrift und die Karte «Dokumente» mit dem Formular. Gesehen: h1 «Laura Keller», h2 «Dokumente» mit «Noch keine Dokumente.», h3 «Dokument hochladen» und darin «Datei» (Schaltfläche), Hilfe «PDF, JPG oder PNG, höchstens 10 MB. Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.», «Titel (optional)» mit Hilfe «Ohne Titel heisst das Dokument wie die Datei.» und der Knopf «Dokument hochladen». Die Reihenfolge ist logisch. (01-laura.png)
2. **PDF wählen.** Erwartet: dass der Dateiname nach der Auswahl angesagt wird. Gesehen: Mit Leertaste öffnet sich der Dialog. Danach steht der Fokus wieder auf «Datei», Wert «Mietvertrag-unterschrieben.pdf». Das passt.
3. **Titel eingeben und hochladen.** Erwartet: dass Dwello den Erfolg meldet und der Fokus in der Nähe bleibt. Gesehen: Beim Senden fällt der Fokus auf `<body>` (P-3). Nach etwa 1 s sagt die assertive Region «Laura Keller - Dwello», die Statusregion «Dokument «Mietvertrag unterschrieben» hochgeladen», und der Fokus steht auf h1 (P-4). In der Liste stehen «Mietvertrag unterschrieben», «Hochgeladen am 14.10.2026», der Link «PDF Mietvertrag unterschrieben» und «Löschen: Mietvertrag unterschrieben». (02-after-upload.png)
4. **Notizen.docx ablegen, Titel «Meine Notizen».** Erwartet: eine angesagte Fehlermeldung, die sagt, dass Word nicht geht und was ich tun soll, und dass der Fokus zum Dateifeld geht. Gesehen: Angesagt wurde nur «Laura Keller - Dwello», die Statusregion blieb leer und der Fokus auf `<body>`, auch nach 1,5 s (P-1). Erst als ich mit Shift+Tab zum Dateifeld ging, hörte ich «Datei, Schaltfläche, ungültig, … Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.». Der Text selbst ist klar und hilfreich. Der Titel blieb erhalten. (03-docx.png)
5. **Uebergabeprotokoll.pdf ablegen, Titel «Übergabeprotokoll Einzug», bei gestörter Verbindung.** Erwartet: eine Ansage wie «Nicht gespeichert, Verbindung prüfen, erneut versuchen», und dass der Titel erhalten bleibt. Gesehen: Während des Wartens hiess der Knopf «Bitte warten …» und war deaktiviert, angesagt wurde das nicht. Nach dem Fehler blieben beide Live-Regionen leer und der Fokus auf `<body>`, auch nach 3 s (P-2). Tab ab dort führte zu «Datenschutz» im Fussbereich. Das Dateifeld ist `invalid` und hat in der Beschreibung «Das Dokument wurde nicht gespeichert. Laden Sie die Datei erneut hoch.». Der Titel «Übergabeprotokoll Einzug» und die Datei blieben erhalten. (04-failure.png; 05-during.png zeigt den Zustand während des Sendens)
6. **Erneut senden, als die Verbindung wieder da war.** Erwartet: dass ich die Datei neu wählen muss, so wie es der Text sagt. Gesehen: Ein Druck auf «Dokument hochladen» genügte, das Dokument wurde gespeichert (P-5). Dieses zusätzliche Dokument habe ich in Schritt 8 wieder gelöscht.
7. **Mietvertrag löschen.** Erwartet: eine Bestätigung mit der Folge und danach eine Meldung. Gesehen: Dialog «Dokument löschen?» mit der Beschreibung «Mietvertrag unterschrieben wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.». Der Fokus steht auf «Abbrechen», und Tab wechselt nur zwischen «Abbrechen» und «Dokument löschen». Escape bringt mich zurück auf den Löschknopf, gut. Nach «Dokument löschen» meldet die Statusregion «Dokument «Mietvertrag unterschrieben» gelöscht» und der Fokus springt auf h1 (P-4). (06-dialog.png, 07-deleted.png)
8. **Aufräumen.** Das von mir angelegte «Übergabeprotokoll Einzug» habe ich gleich gelöscht. Die Karte zeigt wieder «Noch keine Dokumente.».

## Verwirrung

- Nach jedem Absenden höre ich «Laura Keller - Dwello», als hätte ich eine neue Seite geöffnet. Beim Erfolg kommt danach eine Meldung, beim Fehler nicht. Dass der Fehlerfall still bleibt, ist das Verwirrendste (P-1, P-2).
- «Laden Sie die Datei erneut hoch»: Muss ich die Datei neu wählen oder nur nochmals senden? (P-5)
- Begriffe: «Betreibungsauszüge» und «Ausweiskopien» in der Hilfe sind verständlich. Keine weiteren unklaren Begriffe.

## Fehlerrisiken

- Ich verlasse die Seite im Glauben, die Word-Notizen oder das PDF bei gestörter Verbindung seien abgelegt, weil keine Fehlermeldung angesagt wird (P-1, P-2).
- Nach einem Fehler steht der Fokus auf `<body>`, und Tab führt in den Fussbereich. Ich verliere die Orientierung und finde das Formular nur über die Überschriftennavigation wieder.
- Beim zweiten Versuch wähle ich die Datei womöglich unnötig neu (P-5). Das ist harmlos, kostet aber Zeit.

## Vorschläge

- **P-1** Reproduktion: Laura Keller öffnen, Tab zum Dateifeld, Leertaste, Notizen.docx wählen, Tab, Titel tippen, Tab, Enter. Danach ist keine Fehleransage zu hören, der Fokus steht auf `<body>`. Was helfen würde: nach einem abgelehnten Upload den Fokus auf das Dateifeld setzen (dann wird der Fehler über die Beschreibung vorgelesen), oder den Fehlertext zusätzlich in eine Live-Region (`role=alert`) geben. Ausserdem keine Seitentitel-Ansage, wenn die Seite gleich bleibt.
- **P-2** Reproduktion: wie oben, aber mit PDF und dem POST `/tenants/<id>?/upload` mit Status 500 ohne Body beantwortet. Danach ist nichts zu hören, Live-Regionen leer, Fokus auf `<body>`. Was helfen würde: dasselbe wie bei P-1, Fokus auf das Dateifeld oder eine Alert-Ansage des Fehlers.
- **P-3** Reproduktion: Senden mit einer verzögerten Antwort, der Knopf wird «Bitte warten …» und deaktiviert, und der Fokus fällt auf `<body>`. Was helfen würde: den Knopf statt `disabled` mit `aria-disabled` und `aria-busy` markieren, damit er den Fokus behält, oder «Dokument wird hochgeladen …» in der Statusregion melden.
- **P-4** Reproduktion: erfolgreich hochladen oder löschen. Der Fokus geht auf h1, und «Laura Keller - Dwello» wird angesagt. Was helfen würde: den Fokus in der Karte «Dokumente» lassen (z. B. auf deren Überschrift oder auf das neue Dokument; nach dem Löschen auf die Liste), die Statusmeldung beibehalten und die Seitentitel-Ansage weglassen.
- **P-5** Reproduktion: Fehlerfall wie P-2, dann einfach nochmals «Dokument hochladen» drücken, und es gelingt. Was helfen würde: ein Text, der sagt, was passiert ist und was zu tun ist, z. B. «Das Dokument wurde nicht gespeichert, weil die Verbindung unterbrochen war. Prüfen Sie die Verbindung und wählen Sie ‹Dokument hochladen› erneut.»

## Nicht geprüft

- Ein echter Screenreader (NVDA/JAWS/VoiceOver): Ich habe nur den Accessibility-Tree und die Live-Regionen ausgelesen. Ob ein Screenreader die polite-Statusmeldung nach der assertiven Seitentitel-Ansage wirklich vorliest, ist nicht belegt.
- Die zu grosse Datei (Scan-gross.pdf, über 10 MB) und das JPG gehörten nicht zur Aufgabe.
- Das Öffnen des PDF-Links (Download oder neues Fenster) habe ich nicht geprüft.
- Andere Sprachen (fr/it/en) habe ich nicht geprüft.
