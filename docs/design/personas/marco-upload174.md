# Persona Marco – Dokument-Upload beim Mieter (upload174)

Marco, 38, Handy 390 × 844, Touch. Aufgabe: Foto der Ausweiskopie (IMG_2041.jpg) bei Marco Bernasconi (Seepark Residenz) ablegen, ohne Titel; danach das vorhandene Übergabeprotokoll öffnen; zum Schluss unter «Dokumente» im Menü nachsehen, ob die Ausweiskopie dort ist und ob ich etwas versenden muss.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/marco-upload174/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mieter-Detail, Karte «Dokumente» | Der Link zum Öffnen eines Dokuments heisst nur «PDF» bzw. «JPG», ist 31 × 24 px klein (unter 48 px) und steht 16 px neben dem roten «Löschen». Er öffnet nicht, sondern lädt herunter. Ich habe zuerst nicht gemerkt, dass «PDF» der Weg zum Öffnen ist. |
| P-2 | Minor | Mieter-Detail, Upload-Formular | Ohne Titel heisst das Dokument «IMG_2041». Auf dem Handy heissen alle Fotos so. In der Liste erkenne ich später nicht, dass das die Ausweiskopie ist. Der Hilfetext sagt es zwar ehrlich, schlägt aber keinen Titel vor und warnt nicht. |
| P-3 | Minor | Dokumente, Filter «Zu versenden» (leer) | Der Leerzustand sagt: «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» Mein hochgeladenes Foto erscheint dort aber nicht, nur unter «Alle». Der Text lässt mich glauben, ich müsse die Ausweiskopie versenden, oder etwas sei schiefgelaufen. Der Knopf «Zu den Nebenkostenabrechnungen» passt nicht zur Frage. |
| P-4 | Minor | Mieter-Detail nach dem Hochladen | Nach dem Hochladen springt die Seite ganz nach oben (Fokus auf «Marco Bernasconi»). Das neue Dokument liegt rund 1600 px weiter unten, ausser Sicht. Nur die Meldung «Dokument «IMG_2041» hochgeladen» bestätigt es. |
| P-5 | Nit | Mieter-Detail, Upload-Formular | Dieselbe Datei lässt sich ohne Hinweis ein zweites Mal hochladen. Danach stehen zwei gleich benannte «IMG_2041» untereinander. |
| P-6 | Nit | Dokumente, «Alle» | Bei den Einträgen steht nicht, ob sie versendet werden müssen. Ob ich etwas versenden muss, erfahre ich nur, wenn ich auf «Zu versenden» tippe. |

## Beobachtungen

- Das Dateifeld zeigt «Choose File / No file chosen» auf Englisch. Das ist wohl das native Feld des Test-Chromium, trotz Sprache de-CH. Auf einem echten Schweizer Handy steht dort vermutlich Deutsch. Nicht sicher.
- Wenn ich sehr früh tippe, bevor die Seite fertig geladen ist, passiert bei «Löschen» nichts (beim ersten Versuch kam kein Dialog). Das Hochladen klappte in diesem frühen Zustand trotzdem, die Adresse zeigte danach aber «…?/upload» und es kam keine Meldung.
- Der Löschdialog ist gut: «Dokument löschen? IMG_2041 wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.» mit «Abbrechen» / «Dokument löschen».
- In der Liste «Dokumente» steht ein Eintrag «Mietvertrag unterschrieben» zu Laura Keller, heute hochgeladen. Er stammt nicht von mir (eine andere Persona), ich habe ihn nicht angefasst.
- Kein Scrollen zur Seite bei 390 px, weder auf der Mieterseite noch unter «Dokumente».

## Aufgabe geschafft: ja

## Aufwand

Etwa 3–4 Minuten als Nutzer, 11 Schritte: Menü → Mieter → Marco Bernasconi → nach unten scrollen → (Fehlversuch ohne Datei) → Datei wählen → Hochladen → «PDF» beim Übergabeprotokoll → Menü → Dokumente → «Zu versenden».

## Ablauf

1. **Übersicht → Menü.** Erwartet: einen Menüpunkt für Mieter. Gesehen: Das Menü zeigt «Mieter» unter «Verwalten» und «Dokumente» unter «Nebenkosten». Dass «Dokumente» unter «Nebenkosten» steht, wundert mich ein bisschen, aber ich finde es.
2. **Mieter → Marco Bernasconi.** Erwartet: die Liste mit ihm. Gesehen: Er steht zuoberst, «Wohnung B2 - Seepark Residenz, Aktiv». Ein Tippen auf den Namen öffnet seine Seite.
3. **Mieterseite.** Erwartet: irgendwo «Dokumente». Gesehen (Screenshot 04): Die Karte «Dokumente» liegt ganz unten, nach Kontaktdaten, Aktuelle Miete und Mietverträge. Darin: «Übergabeprotokoll Wohnung B2, Hochgeladen am 30.06.2023», darunter ein kleiner Link «PDF» und das rote «Löschen». Darunter der Teil «Dokument hochladen» mit Datei, dem Hinweis «PDF, JPG oder PNG, höchstens 10 MB. Löschen Sie Ausweiskopien und Betreibungsauszüge, sobald Sie sie nicht mehr brauchen.», «Titel (optional)» mit «Ohne Titel heisst das Dokument wie die Datei.» und dem Knopf «Dokument hochladen». Der Hinweis zu Ausweiskopien passt genau zu meinem Fall, gut.
4. **Zu schnell auf «Dokument hochladen» getippt, ohne Datei.** Erwartet: einen Hinweis. Gesehen (Screenshot 05): Das Dateifeld wird rot umrandet, darunter «Wählen Sie eine Datei aus.». Klar.
5. **Datei wählen (IMG_2041.jpg aus der Galerie), Titel leer lassen, «Dokument hochladen».** Erwartet: Bestätigung und das Foto in der Liste. Gesehen: Meldung unten «Dokument «IMG_2041» hochgeladen», die Seite springt aber nach oben (Screenshot 12). Nach dem Hinunterscrollen steht «IMG_2041, Hochgeladen am 14.10.2026» mit Link «JPG» zuoberst in der Karte (Screenshot 07). Die Endung «.jpg» ist weg, das ist ok. Als «Ausweiskopie» würde ich es in einem Jahr aber nicht wiedererkennen.
6. **Übergabeprotokoll öffnen.** Erwartet: einen Knopf «Öffnen» oder «Ansehen». Gesehen: nur das unterstrichene «PDF». Ich musste kurz überlegen, ob das die Dateiart ist oder ein Link. Das Ziel ist winzig (31 × 24 px), daneben das rote «Löschen». Beim Tippen wird «Uebergabeprotokoll-B2.pdf» heruntergeladen, nicht angezeigt. Auf dem Handy landet es dann im Download-Ordner.
7. **Menü → Dokumente.** Erwartet: alle Dokumente, auch meine Ausweiskopie. Gesehen (Screenshot 10): Einleitung «Mahnungen und andere Schreiben an Mieter sowie Dokumente, die Sie zu Mietern hochgeladen haben. Drucken Sie Briefe, die noch zu versenden sind, …», Filter «Alle» / «Zu versenden». Unter «Alle» steht «IMG_2041 – Zu Marco Bernasconi, hochgeladen am 14.10.2026» mit einem grossen Knopf «Datei herunterladen». Hier sind die Knöpfe gross, auf der Mieterseite nicht.
8. **Muss ich etwas versenden?** Erwartet: einen klaren Hinweis beim Eintrag. Gesehen: Beim Eintrag steht nichts dazu. Unter «Zu versenden» steht (Screenshot 11) «Keine Briefe zu versenden». Darunter aber: «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» Das widerspricht dem, was ich sehe: Mein Dokument erscheint dort ja nicht. Ich schliesse daraus: Nichts zu versenden. Ganz sicher bin ich aber nicht.
9. **Zusatzprüfung:** Dieselbe Datei habe ich ein zweites Mal hochgeladen. Kein Hinweis, zwei gleiche «IMG_2041». Das zweite habe ich über «Löschen» → Dialog → «Dokument löschen» wieder entfernt. Meldung: «Dokument «IMG_2041» gelöscht». Mein erstes Exemplar bleibt stehen.

## Verwirrung

- «PDF» / «JPG» als Linktext: Das ist die Dateiart, keine Tätigkeit. Ich erwarte ein Verb («Öffnen», «Herunterladen»), so wie unter «Dokumente» («Datei herunterladen»).
- «Zu versenden» bei Dokumenten, die ich selbst hochgeladen habe: Der Leertext sagt, hochgeladene Dokumente erscheinen dort. Ich verstehe nicht, ob eine Ausweiskopie verschickt werden soll.
- «Dokumente» im Menü unter «Nebenkosten»: Eine Ausweiskopie hat mit Nebenkosten nichts zu tun.

## Fehlerrisiken

- Kleiner «PDF»-Link direkt neben «Löschen»: Mit dem Daumen trifft man leicht das Falsche. Der Löschdialog fängt das ab.
- Mehrere Fotos ohne Titel heissen alle «IMG_…». Damit löscht man später leicht das falsche Dokument, oder vergisst eine Ausweiskopie, die man laut Hinweis löschen sollte.
- Doppelte Uploads bleiben unbemerkt, weil die Seite nach oben springt.

## Vorschläge

- **P-1:** Mieterseite Marco Bernasconi → Karte «Dokumente» → Link «PDF» beim Übergabeprotokoll antippen. Hilfreich wäre ein Knopf mit Verb, mindestens 48 px hoch, wie unter «Dokumente» («Datei herunterladen» oder «Öffnen»). Die Dateiart kann als Text daneben stehen. Mehr Abstand zu «Löschen».
- **P-2:** Foto «IMG_2041.jpg» ohne Titel hochladen → in der Liste steht «IMG_2041». Hilfreich wäre ein Hinweis beim Titel wie «Zum Beispiel: Ausweiskopie. Fotos vom Handy heissen sonst IMG_…», oder ein Titel als Pflichtfeld, wenn der Dateiname nach Kamera aussieht.
- **P-3:** Menü → Dokumente → «Zu versenden» (leer). Der Leertext sollte nur sagen, was wirklich dort erscheint, z. B. «Hier erscheinen Mahnungen und Briefe, die Sie noch per Post schicken müssen. Hochgeladene Dokumente müssen Sie nicht versenden.». Ein passender Knopf oder keiner statt «Zu den Nebenkostenabrechnungen».
- **P-4:** Mieterseite → Datei wählen → «Dokument hochladen». Danach steht die Seite oben. Hilfreich: auf der Karte «Dokumente» bleiben oder dorthin scrollen, Fokus auf das neue Dokument.
- **P-5:** Dieselbe Datei zweimal hochladen → zwei gleiche Einträge. Hilfreich: Hinweis «Ein Dokument mit diesem Namen gibt es schon».
- **P-6:** Menü → Dokumente → «Alle». Hilfreich: bei hochgeladenen Dokumenten «Nicht zu versenden» oder «Hochgeladen», bei Briefen «Zu versenden», als Text, nicht nur als Farbe.

## Nicht geprüft

- Wie ein echtes Handy (iOS/Android) das heruntergeladene PDF oder JPG anzeigt. Im Test-Browser kam nur ein Download, keine Vorschau.
- Hochladen einer zu grossen Datei oder eines falschen Formats: Das war nicht Teil der Aufgabe.
- Ein Upload, bei dem der Server einen Fehler meldet: Der Aufrufer hat keinen fehlschlagenden Request genannt.
