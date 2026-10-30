# Marco – Slice 718c: Neuer Wiederherstellungscode auf dem Handy

Persona: Marco, 38, Handy 390 × 844, Touch. Angemeldet als `marco@dwello.test` (ohne Persona-Kit-Cookie, über «Anmelden»). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-718c/`.

Aufgabe: Das Notfallblatt ist weg. Schnell auf dem Handy einen neuen Wiederherstellungscode erstellen, das neue Notfallblatt herunterladen und den Code bestätigen (vom Bildschirm kopiert).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Wiederherstellungscode, Schritt «Code anzeigen» | Kopieren vom Handy ist mühsam: Langes Drücken auf den Code markiert nur einen Block zwischen zwei Bindestrichen (Test: «X4X7»). Für den ganzen Code muss ich die Markierung über zwei Zeilen ziehen. Eine Schaltfläche «Code kopieren» fehlt. Mit dem kopierten Block kam «Der Code stimmt nicht …». |
| P-2 | Minor | Neuer Wiederherstellungscode, Einstieg (Passwort) | Der Einleitungstext ist für jemanden geschrieben, der das alte Blatt noch hat («Bewahren Sie das alte Notfallblatt bis dahin auf»). Ich habe es ja weggeworfen. Was das für mich heisst (z. B. «Haben Sie es nicht mehr, …»), steht nirgends, und auch nicht, dass ein Finder des alten Blatts die alten Sicherungen lesen kann. Ausserdem steht nicht da, was jetzt der Reihe nach kommt (Passwort → Code → Notfallblatt → bestätigen). |
| P-3 | Minor | Neuer Wiederherstellungscode, Schritt «Code anzeigen», nach einer Unterbrechung | Nach einer Unterbrechung zeigt die Seite denselben Code wieder an (gut). Es steht aber nur «innerhalb von 30 Minuten» da, ohne Uhrzeit, bis wann. Wie viel Zeit mir noch bleibt, sehe ich nicht. Die Karte in «Einstellungen» zeigt auch nicht an, dass noch ein Code auf die Bestätigung wartet. |
| P-4 | Minor | Neuer Wiederherstellungscode, Schritt «Code anzeigen» | Der Text sagt «Drucken Sie das neue Notfallblatt aus und bewahren Sie es getrennt von diesem Computer …». Ich bin auf dem Handy und kann hier nicht drucken. Was ich mit dem PDF auf dem Handy tun soll (z. B. später ausdrucken, nicht nur auf dem Handy lassen), steht nicht da. |
| P-5 | Minor | Neuer Wiederherstellungscode, nach «Neuen Code bestätigen» | Nach der Bestätigung kommt die grüne Meldung. Gleich darunter steht wieder das Passwortfeld mit «Neuen Code erstellen» als einzige Schaltfläche. Ein «Fertig» oder «Zurück zu den Einstellungen» fehlt. Ich war kurz unsicher, ob ich noch etwas tun muss, und hätte beinahe nochmals einen Code erstellt. |

## Beobachtungen

- Auf der Anmeldeseite verweist «Passwort vergessen?» auf den Betreiber. Der Wiederherstellungscode kommt dort nicht vor, und das ist so in Ordnung.
- Die Übersicht und der Einleitungssatz von «Einstellungen» («Absender für Abrechnungen und Mahnungen, Vorschläge … und die Stammdaten») erwähnen die Sicherung nicht. Ich habe die Karte trotzdem nach einmaligem Scrollen gefunden. Sie steht als dritter Abschnitt «Sicherung» und ist eindeutig beschriftet. Die ganze Karte ist antippbar (auch ein Tipp auf den Beschreibungstext öffnet die Seite).
- Das Symbol der Karte «Neuer Wiederherstellungscode» ist dasselbe Zahnrad wie bei «Zugangsschlüssel für KI-Programme».
- Bei leerem Passwortfeld heisst die Meldung «Das Passwort stimmt nicht.». Ich hatte gar keines eingegeben, «Geben Sie Ihr Passwort ein» wäre treffender. Beim falschen Passwort ist die Meldung klar, und das Feld bleibt gefüllt.
- Der Code ist bei 390 px gut lesbar: gross und fett, umbrochen an einem Bindestrich auf zwei Zeilen. Auf keinem Schritt lässt sich die Seite seitwärts schieben (scrollWidth 390). Schaltflächen und Felder sind 48 px hoch.
- Das Eingabefeld für den Code hat die Rechtschreibprüfung an (spellcheck). Auf einem echten Handy könnte die Autokorrektur beim Abtippen Blöcke wie «BUTF» verändern. Nicht geprüft, weil der Browser hier keine Autokorrektur hat.
- Nach dem Erstellen springt der Fokus auf den Code. Das Notfallblatt und das Bestätigungsfeld liegen unterhalb des ersten Bildschirms. Ich muss scrollen, finde sie aber in der richtigen Reihenfolge.
- Notfallblatt-PDF (1 Seite A4, Dateiname «Notfallblatt-Dwello.pdf», derselbe wie beim alten Blatt): Titel, Code, «Code erstellt am 30.10.2026. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.», Hinweis auf ältere Sicherungen («geben Sie im Notfall beide Blätter weiter»), Adresse der Installation, Ablageort der Sicherungen, was im Notfall zu tun ist, Link zur Installationsanleitung und «getrennt von Ihrem Computer aufbewahren». Klar und knapp. Das Bestätigungsdatum steht nicht drauf, weil ich das PDF vor der Bestätigung lade. Das Erstellungsdatum genügt mir aber.
- Öffne ich nach der Bestätigung den Download-Link nochmals (etwa über die Download-Liste des Handys), lande ich ohne Erklärung auf der Übersicht.
- Wird die Seite nach der Bestätigung neu geladen, zeigt sie nur noch das Passwortformular, die Erfolgsmeldung ist weg. Das ist erwartbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten reine Bedienung. 14 Schritte: Anmelden (3), Benutzermenü → Einstellungen → Karte (3), Passwort eingeben → erstellen (2), Notfallblatt herunterladen (1), Code markieren und kopieren (2, der erste Versuch markierte nur einen Block), einfügen → bestätigen (2), Erfolgsmeldung lesen (1). Dazu kam ein Fehlversuch mit falschem Passwort und einer mit einem Teil-Code.

## Ablauf

- Seite «Neuer Wiederherstellungscode» öffnen. Erwartet: ein kurzer Satz, was jetzt passiert, für jemanden ohne altes Blatt. Gesehen: ein langer Absatz über alte Sicherungen und das Aufbewahren des alten Blatts, das ich nicht mehr habe (P-2).
- Leeres Passwort absenden. Erwartet: «Geben Sie Ihr Passwort ein». Gesehen: «Das Passwort stimmt nicht. …»
- Code vom Bildschirm kopieren (langes Drücken). Erwartet: der ganze Code ist markiert oder es gibt eine Kopier-Schaltfläche. Gesehen: nur «X4X7» markiert. Dieser Block, eingefügt, ergab «Der Code stimmt nicht mit dem angezeigten überein …» (P-1). Erst die Markierung über den ganzen Absatz ergab «MK3C-RTM4-BUTF-Y5VF-X4X7-E7EP», und der wurde angenommen.
- Unterbrechung (Seite verlassen, später in einem neuen Browserfenster über die Übersicht → Einstellungen zurück). Erwartet: ein Hinweis, dass noch ein Code offen ist und bis wann. Gesehen: Die Übersicht und die Karte zeigen nichts an. Erst auf der Seite steht derselbe Code wieder, ohne Uhrzeit für das Ende der 30 Minuten (P-3).
- Text zum Notfallblatt auf dem Handy. Erwartet: was ich auf dem Handy damit tue. Gesehen: «Drucken Sie … aus … getrennt von diesem Computer» (P-4).
- Nach «Neuen Code bestätigen». Erwartet: Abschluss mit Weg zurück. Gesehen: grüne Meldung, darunter erneut das Passwortfeld mit «Neuen Code erstellen» (P-5).

## Vorschläge

- **P-1:** Einstellungen → «Neuer Wiederherstellungscode» → Passwort → «Neuen Code erstellen». Auf dem Handy lange auf den Code drücken: Nur ein Block ist markiert. Hilfreich wäre eine Schaltfläche «Code kopieren» neben dem Code, oder ein Code, der mit einem Tipp ganz markiert wird.
- **P-2:** Einstellungen → «Neuer Wiederherstellungscode». Hilfreich wäre ein Satz für den Fall ohne altes Blatt (was mit den alten Sicherungen geschieht und dass ein Finder des Blatts sie lesen könnte) und eine kurze Schrittfolge: «1. Passwort, 2. Code und Notfallblatt, 3. Code bestätigen».
- **P-3:** Code erstellen, Seite verlassen, über Einstellungen zurückkehren. Hilfreich wäre «Bestätigen Sie bis 11:16 Uhr» statt nur «innerhalb von 30 Minuten» und auf der Karte in «Einstellungen» ein Hinweis «Neuer Code wartet auf Bestätigung».
- **P-4:** Schritt «Code anzeigen» auf dem Handy. Hilfreich wäre ein Text, der auch für das Handy passt, z. B. «Speichern Sie das PDF und drucken Sie es aus; bewahren Sie es getrennt von Ihren Geräten auf.»
- **P-5:** Code bestätigen. Hilfreich wäre, das Erstellformular nach der Bestätigung auszublenden und stattdessen «Zurück zu den Einstellungen» anzubieten.

## Nicht geprüft

- Das Verfallen nach 30 Minuten: Ich habe nicht 30 Minuten gewartet. Geprüft habe ich nur die Rückkehr kurz nach dem Erstellen (derselbe Code wird wieder angezeigt).
- Ein zweites «Neuen Code erstellen», während ein Code noch auf die Bestätigung wartet: Das habe ich bewusst nicht versucht, um keinen offenen Code zu hinterlassen.
- Echtes Kopieren und Einfügen über die Zwischenablage eines Handys, die Autokorrektur und die Ansicht des PDFs im Handy-Viewer: In Headless-Chromium habe ich die Markierung per Doppel- und Dreifachtipp nachgestellt und den markierten Text eingefügt. Das PDF habe ich mit pdftotext gelesen und als Bild gerendert.
- Dunkelmodus: nicht angeschaut.

## Triage (caller)

- P-1 to P-5 (Minor): stay. P-2 and P-5 were met by Helga and Dr. Weber too: #957, #956. P-1 (copy button) is in #947.
