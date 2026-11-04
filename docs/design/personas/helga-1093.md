# Helga – Dokument in zwei Tabs löschen und herunterladen (#1093)

Desktop 1440 × 900, Zoom 150 %, Maus. App: http://localhost:3300 (Persona-Stack, Version 0.107.0+501-g20e6b12a7). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1093/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | «Dokument nicht gefunden» (`/documents/refused`) | Der Text sagt «Laden Sie die Seite neu.» Ich habe genau das getan (Neu laden im Browser): Es kam wieder dieselbe Seite «Dokument nicht gefunden». Gemeint ist offenbar die Mieterseite, und die erreiche ich nur über «Zurück». Der Rat führt mich im Kreis. |
| P-2 | Minor | «Dokument nicht gefunden» → «Zurück» → Mieterseite | Nach «Zurück» steht die Mieterseite ganz oben (Kontaktdaten). Ich war unten bei «Dokumente». Ich muss wieder hinunterscrollen, um zu sehen, dass das Übergabeprotokoll weg ist. Es gibt auch keinen Hinweis, dass ein anderes Fenster es gelöscht hat. |

## Beobachtungen

- Die Bestätigung beim Löschen ist gut: «Dokument löschen?» mit «Dokument «Übergabeprotokoll Wohnung B2» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.» und den Knöpfen «Abbrechen» und «Dokument löschen». So weiss ich, was passiert.
- Nach dem Löschen in Tab 1 erscheint unten rechts die Meldung «Dokument «Übergabeprotokoll Wohnung B2» gelöscht», und unter «Dokumente» steht «Noch keine Dokumente.» Klar.
- Tab 2 zeigte das Dokument weiter mit «Datei herunterladen», ohne Hinweis. Das erwarte ich bei einem alten Fenster auch nicht anders.
- Die Seite «Dokument nicht gefunden» selbst ist ruhig und verständlich: grosses Haus-Symbol mit Warndreieck, grosse Überschrift, ein Satz, ein blauer Knopf «Zurück» (48 px hoch, gut zu treffen). Ich bin nicht erschrocken. Die Seite ersetzt aber die Mieterseite im selben Tab; es ist kein neues Fenster aufgegangen und kein Download gestartet.
- Der Satz sagt nicht, warum es das Dokument nicht mehr gibt. «Es wurde gelöscht, vielleicht in einem anderen Fenster» hätte mir sofort erklärt, was passiert ist. Ich wusste es nur, weil ich es selbst gerade getan hatte.
- Auch der «Zurück»-Pfeil des Browsers bringt mich auf die Mieterseite, ebenfalls ganz oben.
- Die Seite «Dokumente» (über das Menü, unter «Nebenkosten») zeigt «Noch keine Dokumente» und darunter «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» Das gelöschte Übergabeprotokoll ist dort also auch weg, das passt. Der einzige Knopf heisst aber «Zu den Nebenkostenabrechnungen»; zurück zu Herrn Bernasconi komme ich nur über das Menü → «Mieter» → «Marco Bernasconi» (drei Klicks). Ein Weg zurück zur Mieterseite fehlt auf dieser Seite.
- Der Einleitungstext der Seite «Dokumente» ist sehr lang (Markieren als versendet, Zahlungsfrist, Datum des PDFs). Für eine leere Liste habe ich das nicht verstanden und auch nicht gebraucht. Dass dort auch Nebenkostenabrechnungen stehen sollen, obwohl die Übersicht 7 Abrechnungen im Entwurf meldet und die Liste leer ist, hat mich verwirrt.
- Dass «Dokumente» im Menü unter «Nebenkosten» steht, hätte ich nicht vermutet; ich habe Mieterdokumente bei den Mietern gesucht.
- Beim allerersten Versuch habe ich auf der Übersicht «Mieter erfassen» erwischt statt die Mieterliste (der erste Link mit «Mieter» im Namen). Die Liste fand ich dann über das Menü.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, rund 20 Schritte (Mieterliste suchen, zwei Tabs öffnen, Löschen mit Bestätigung, Herunterladen im zweiten Tab, Neu laden, Zurück, Browser-Zurück, Menü, Dokumente).

## Ablauf

- Übersicht, Link «Mieter …»: erwartet die Mieterliste; gesehen das Formular «Neuer Mieter». Danach über «Menü öffnen» → «Mieter».
- Tab 2, «Datei herunterladen» beim gelöschten Dokument: erwartet eine Meldung auf der Mieterseite oder einen Hinweis, dass das Dokument gelöscht wurde; gesehen eine eigene Seite «Dokument nicht gefunden – Das Dokument gibt es nicht mehr. Laden Sie die Seite neu.» mit «Zurück» (Bildschirmfoto `09-nach-download-page1.png`).
- Seite neu geladen, wie empfohlen: erwartet die Mieterseite ohne das Dokument; gesehen wieder «Dokument nicht gefunden».
- «Zurück» geklickt: erwartet die Mieterseite an der Stelle «Dokumente»; gesehen die Mieterseite ganz oben, «Dokumente» erst nach dem Hinunterscrollen mit «Noch keine Dokumente.»
- Menü → «Dokumente»: erwartet die Dokumente meiner Mieter; gesehen «Noch keine Dokumente» und nur der Knopf «Zu den Nebenkostenabrechnungen» (Bildschirmfoto `12-dokumente.png`).

## Vorschläge

- **P-1:** Mieter «Marco Bernasconi» in zwei Tabs öffnen, in Tab 1 «Löschen: Übergabeprotokoll Wohnung B2» → «Dokument löschen», in Tab 2 «Datei herunterladen» klicken, dann im Browser neu laden: es erscheint wieder «Dokument nicht gefunden». Hilfreich: ein Satz, der zum Knopf passt, etwa «Das Dokument wurde gelöscht, vielleicht in einem anderen Fenster. Gehen Sie zurück, um die aktuelle Liste zu sehen.»
- **P-2:** Wie P-1, dann «Zurück» klicken: die Mieterseite steht oben. Hilfreich: zurück zum Abschnitt «Dokumente» springen (oder dort eine kurze Meldung zeigen, dass das Dokument nicht mehr da ist).

## Nicht geprüft

- Herunterladen eines inzwischen gelöschten Dokuments direkt aus der Liste «Dokumente» (wohin «Zurück» dann führt): Herr Bernasconis Übergabeprotokoll war das einzige Dokument und schon gelöscht, die Liste war leer; ein weiteres Dokument zu löschen gehörte nicht zu meiner Aufgabe.
- Zoom 200 %: nicht verlangt, nicht versucht.
