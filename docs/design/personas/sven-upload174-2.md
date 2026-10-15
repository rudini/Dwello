# Sven – Dokumente beim Mieter hochladen, Runde 2 (upload174-2)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, Zoom 100 %, nur Tastatur. Ich beurteile nach dem Accessibility-Tree (Rolle, Name, Beschreibung, Live-Regionen, Fokus), ausgelesen per `readOut` und CDP. Die Live-Regionen habe ich zusätzlich mit einem MutationObserver mitgeschrieben, damit ich auch sehe, wenn derselbe Text noch einmal gesetzt wird.
Mieter: Laura Keller (Gebäude Alpenblick, Wohnung EG), `/tenants/a0000001-0001-0001-0001-000000000008`.
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/sven-upload174-2/` (run.mjs, raw2.mjs, raw.mjs, check.mjs; pdf.png, docx.png, fail.png, retry.png, dialog.png, deleted-*.png, final.png).
Runde 1: `docs/design/personas/sven-upload174.md`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – (behoben) | Mieter Laura Keller, Formular «Dokument hochladen», Word-Datei | Hält nicht mehr. Nach dem Absenden geht der Fokus aufs Dateifeld: «Datei, Schaltfläche, Notizen.docx, ungültig», und die Beschreibung endet mit «Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.» Datei und Titel «Meine Notizen» bleiben erhalten. |
| P-2 | – (behoben) | dito, gestörte Verbindung (POST `?/upload` → 500 ohne Body) | Hält nicht mehr. Nach etwa 0,7 s steht der Fokus auf dem Dateifeld, `invalid=true`, Beschreibung endet mit «Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».» Datei und Titel bleiben erhalten. |
| P-4 | Minor (hält teilweise) | dito, nach Erfolg (Hochladen und Löschen) | Der Fokus springt nicht mehr auf h1, sondern auf den Hauptbereich (`main`, ohne Namen). Das nächste Tab führt ganz nach oben zum Brotkrumen-Link «Mieter», dann «Bearbeiten». Um das neue Dokument zu prüfen, muss ich wieder durch die ganze Seite. Ausserdem wird nach jedem Absenden (Erfolg, Löschen, Fehler) die assertive Region neu mit «Laura Keller - Dwello» befüllt, also wie bei einem Seitenwechsel angesagt. Die Statusmeldungen «Dokument «…» hochgeladen» bzw. «… gelöscht» kommen gut. |
| P-5 | – (behoben) | dito, Fehlertext bei gestörter Verbindung | Hält nicht mehr. Der Text sagt jetzt, was passiert ist («weil Dwello nicht geantwortet hat») und was zu tun ist («Wählen Sie noch einmal «Dokument hochladen»»). Zweimal Tab und Enter auf «Dokument hochladen» genügte, das Dokument wurde gespeichert. |
| P-6 | Minor | dito, Fehler bei gestörter Verbindung | Neu durch die Korrektur: Der Fokus steht auf dem Dateifeld, und ich höre «Wählen Sie noch einmal «Dokument hochladen»». Drücke ich sofort Enter, öffnet sich nicht das Hochladen, sondern der Dateiauswahldialog des Dateifelds. Brach ich ihn ab, war die Datei weg (Wert «No file chosen»). Der Knopf «Dokument hochladen» liegt zwei Tabs weiter, hinter dem Titelfeld. |
| P-7 | Minor | dito, alle Fehler | Der Fehler steht am Ende einer langen Beschreibung. Nach dem Fokussprung höre ich zuerst «Datei, Schaltfläche, …, ungültig», dann rund 20 Wörter Hilfetext («PDF, JPG oder PNG, höchstens 10 MB. Löschen Sie Ausweiskopien und Betreibungsauszüge …») und erst danach den Fehler. Gleichzeitig wird assertiv «Laura Keller - Dwello» angesagt (siehe P-4). Ob ein echter Screenreader die Fokusansage dabei unterbricht, konnte ich nicht prüfen. |

## Beobachtungen

- Während des Sendens fällt der Fokus weiterhin kurz auf `<body>`. Bei der gestörten Verbindung war er nach 0,1 s und 0,3 s auf `<body>`, erst danach auf dem Dateifeld. Angesagt wird das Senden nicht (Runde 1, P-3; nicht Teil dieser Aufgabe).
- Der Download-Link heisst jetzt «Datei herunterladen: Mietvertrag unterschrieben». Das ist klarer als in Runde 1.
- Die Hilfe zum Titel lautet jetzt «Ohne Titel heisst das Dokument wie die Datei, ohne Endung.». Gut.
- Der Löschdialog ist unverändert gut: Der Fokus beginnt auf «Abbrechen», Tab führt zu «Dokument löschen», und der Name des Löschknopfs nennt das Dokument.
- Drückte ich gleich nach dem Laden der Seite (vor dem vollständigen Laden der Skripte) auf «Dokument hochladen», lud die Seite neu, und der Fokus stand danach auf dem Dateifeld statt auf `main`. Das Verhalten nach Erfolg ist also nicht immer gleich. Gefunden habe ich das nur zufällig im ersten Durchlauf.
- Für die gestörte Verbindung gibt es keine Meldung in einer Live-Region. Hörbar ist der Fehler nur über die Fokusansage des Dateifelds. Das reicht, solange der Fokussprung angesagt wird.
- Das Dateifeld meldet «No file chosen». Das ist der Text des englischen Test-Chromiums, nicht Dwellos.
- Der ganzseitige Screenshot fail.png zeigt die Kopfzeile «Dwello» mitten in der Seite. Das liegt an der fixierten Kopfzeile beim Screenshot und war beim Bedienen nicht zu sehen.

## Aufgabe geschafft: ja

Ich habe das PDF abgelegt, die Word-Datei wurde abgelehnt, das PDF bei gestörter Verbindung wurde nicht gespeichert, und ich habe es danach erfolgreich wiederholt. Den Mietvertrag habe ich am Schluss gelöscht. Beide Fehler habe ich diesmal sofort gehört.

## Aufwand

Etwa 12 Minuten, 6 Skripte (zum Teil mehrfach ausgeführt). Hochladen: Tab, Enter auf den Sprunglink, 8 Tabs zum Dateifeld, Leertaste, Datei wählen, Tab, Titel, Tab, Enter. Löschen: Sprunglink, rund 11 Tabs, Enter, Tab, Enter.

## Ablauf

1. **PDF ablegen** (Mietvertrag-unterschrieben.pdf, Titel «Mietvertrag unterschrieben»). Erwartet: eine Erfolgsmeldung, und der Fokus bleibt beim Formular oder beim neuen Dokument. Gesehen: Das Dokument wurde gespeichert, und die Statusregion meldete «Dokument «Mietvertrag unterschrieben» hochgeladen». In diesem ersten Durchlauf hatte ich sehr schnell nach dem Laden gesendet, die Seite lud neu, und der Fokus stand danach auf dem Dateifeld («No file chosen»). Beim Wiederholen mit normalem Tempo («Mietvertrag Zweitkopie», später gelöscht) war die Meldung dieselbe, der Fokus stand aber auf `main` ohne Namen, und die assertive Region wurde neu mit «Laura Keller - Dwello» befüllt (P-4). (pdf.png)
2. **Word-Notizen ablegen** (Notizen.docx, Titel «Meine Notizen»). Erwartet: eine angesagte Ablehnung und der Fokus beim Dateifeld. Gesehen: Nach 0,1 s stand der Fokus auf «Datei, Schaltfläche, Notizen.docx, ungültig». Die Beschreibung lautete: Hilfetext, danach «Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.» Der Titel blieb erhalten. P-1 ist behoben. Zusätzlich gab es die assertive Seitentitel-Ansage (P-4, P-7). (docx.png)
3. **PDF bei gestörter Verbindung** (Titel «Mietvertrag Kopie», POST `?/upload` mit 500 ohne Body beantwortet). Erwartet: eine hörbare Fehlermeldung, die Ursache und Abhilfe nennt, und dass Datei und Titel erhalten bleiben. Gesehen: Kurz lag der Fokus auf `<body>`, nach etwa 0,7 s auf dem Dateifeld, `invalid=true`, mit «Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».» Die Datei «Mietvertrag-unterschrieben.pdf» und der Titel blieben erhalten. P-2 und P-5 sind behoben. Der Bildschirm zeigt das Dateifeld rot umrandet und darunter den Fehlertext in Rot mit Warnsymbol. (fail.png)
4. **Wiederholen, ohne gestörte Verbindung.** Beim ersten Versuch drückte ich, wie der Text sagt, sofort Enter. Der Fokus stand aber auf dem Dateifeld: Es öffnete sich die Dateiauswahl, und danach war die Datei weg (P-6). Im zweiten Durchlauf ging ich mit Tab, Tab zu «Dokument hochladen» und drückte Enter. Die Statusregion meldete «Dokument «Mietvertrag Kopie» hochgeladen», der Fokus lag auf `main` (P-4). (retry.png)
5. **Löschen.** Erwartet: eine Bestätigung, eine Meldung und danach der Fokus in der Nähe der Liste. Gesehen: Der Dialog begann auf «Abbrechen», mit Tab kam ich zu «Dokument löschen», Enter. Die Statusregion meldete «Dokument «Mietvertrag unterschrieben» gelöscht», die assertive Region wurde wieder mit «Laura Keller - Dwello» befüllt, und der Fokus lag auf `main`. Das nächste Tab führte zu «Mieter» (Brotkrumen ganz oben), dann zu «Bearbeiten» (P-4). Die Liste zeigt «Noch keine Dokumente.». (dialog.png, deleted-unterschrieben.png)
6. **Aufräumen.** Meine zusätzlichen Dokumente «Mietvertrag Zweitkopie», «Mietvertrag Kopie» und «Mietvertrag Test» (aus der Prüfung der Live-Regionen) habe ich ebenfalls gelöscht. Am Ende steht bei Laura Keller «Noch keine Dokumente.». (final.png)

## Verwirrung

- «Wählen Sie noch einmal «Dokument hochladen»», während ich auf dem Dateifeld stehe: Das Wort «wählen» und der Fokus auf «Datei, Schaltfläche» passen nicht zusammen (P-6).
- Nach Erfolg und nach dem Löschen höre ich «Hauptbereich» und den Seitentitel, als wäre ich auf einer neuen Seite. Wo das neue Dokument steht, muss ich selbst suchen (P-4).
- Unklare Begriffe: keine.

## Fehlerrisiken

- Nach der gestörten Verbindung drücke ich Enter auf dem Dateifeld, breche die Dateiauswahl ab und verliere die Datei (P-6). Senden ohne Datei bringt dann «Wählen Sie eine Datei aus.», das ist also behebbar, kostet aber Zeit.
- Die assertive Ansage «Laura Keller - Dwello» könnte die Fehleransage am Dateifeld überlagern, dann bliebe der Fehler wieder stumm (P-7). Am Accessibility-Tree allein lässt sich das nicht entscheiden.

## Vorschläge

- **P-4** Reproduktion: Laura Keller öffnen, 1–2 s warten, ein PDF hochladen oder ein Dokument löschen. Danach steht der Fokus auf `main`, Tab führt zu «Mieter», und die assertive Region wird mit «Laura Keller - Dwello» neu befüllt. Was helfen würde: den Fokus nach dem Hochladen auf das neue Dokument in der Liste oder auf die Überschrift «Dokumente» setzen, nach dem Löschen auf die Liste oder die Überschrift «Dokumente», und bei Formularaktionen auf derselben Seite keine Seitentitel-Ansage machen.
- **P-6** Reproduktion: Upload mit gestörter Verbindung (POST `?/upload` → 500), dann sofort Enter. Es öffnet sich die Dateiauswahl, und nach dem Abbrechen ist die Datei weg. Was helfen würde: bei einem Fehler, der nicht an der Datei liegt (Verbindung), den Fokus auf «Dokument hochladen» setzen oder den Fehlertext neben den Knopf stellen, oder im Text sagen, wo der Knopf ist («Gehen Sie mit Tab zu …» ist zu technisch; besser den Fokus gleich auf den Knopf).
- **P-7** Reproduktion: Word-Datei oder gestörte Verbindung wie oben, dann die Fokusansage des Dateifelds anhören. Der Fehler kommt erst nach dem ganzen Hilfetext. Was helfen würde: in `aria-describedby` die Fehler-ID vor die Hilfe-ID stellen, damit der Fehler zuerst gelesen wird, und die Seitentitel-Ansage weglassen (wie bei P-4).

## Nicht geprüft

- Ein echter Screenreader (NVDA/JAWS/VoiceOver): Ich habe nur den Accessibility-Tree und die Mutationen der Live-Regionen ausgelesen. Ob die assertive Ansage die Fokusansage verdrängt (P-7), ist nicht belegt.
- Ob Dwello die Word-Datei schon im Browser oder erst auf dem Server ablehnt: Die assertive Region wurde auch hier neu befüllt, das spricht für einen Weg über den Server, belegt ist es nicht.
- Andere Sprachen (fr/it/en), die zu grosse Datei und das JPG gehörten nicht zur Aufgabe.
- Das Öffnen des Download-Links habe ich nicht geprüft.
