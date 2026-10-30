# Sven, Slice 718b: Dwello einrichten und Sicherung einrichten (frische Installation, :3310)

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum. Gestartet abgemeldet, ohne Persona-Kit-Cookie. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/sven-718b/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Sicherung einrichten (Fehler) | Wenn ich einen falschen Code bestätige, bleibt das Feld «Wiederherstellungscode erneut eingeben» ohne `aria-invalid` und ist nicht mit der Fehlermeldung verbunden (`aria-describedby` zeigt nur auf den Hilfetext). Gehe ich mit Tab von der Meldung zurück ins Feld, höre ich nur Beschriftung und Hilfetext, aber nicht, dass der Inhalt falsch ist. |
| P-2 | Minor | Sicherung einrichten (leeres Feld) | Drücke ich «Sicherung starten» mit leerem Feld, sagt Dwello «Der Code stimmt nicht mit dem angezeigten überein …». Ich habe aber gar nichts eingegeben. Das lässt mich an einen Tippfehler denken statt an ein leeres Feld. |
| P-3 | Minor | Übersicht (Bestätigung) | Nach dem richtigen Code lande ich auf der Übersicht. Angesagt wird nur der Seitentitel «Übersicht - Dwello». Die Bestätigung «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» ist ein normaler Absatz, keine Statusmeldung, und der Fokus steht auf dem Seitenanfang. Ob es geklappt hat, erfahre ich erst, wenn ich die Seite selbst lese. Sie steht immerhin gleich unter der Überschrift. |
| P-4 | Minor | Notfallblatt (PDF) | Das PDF ist nicht getaggt (`pdfinfo`: «Tagged: no»), hat keine Überschriftenstruktur und keine Dokumentsprache. Der Text lässt sich in der richtigen Reihenfolge herauslesen, aber ein Screenreader weiss nicht, dass das Blatt deutsch ist, und kann nicht von Überschrift zu Überschrift springen. |

## Beobachtungen

- Nach «Dwello einrichten» führt Dwello direkt zu «Sicherung einrichten» (URL `/backup`, Titel «Sicherung einrichten - Dwello», der Titel wird über die Live-Region angesagt). So hatte ich es erwartet.
- Der Wiederherstellungscode ist ein eigener Absatz direkt unter dem Absatz «Ihr Wiederherstellungscode»: `CEF3-8WRY-JD9S-MDRY-YH4W-SZVP`. Im Lesemodus kann ich ihn Zeichen für Zeichen durchgehen. Er besteht aus 6 Vierergruppen mit Bindestrichen und enthält keine leicht verwechselbaren Zeichen (kein 0/O, kein 1/I/L). Ich konnte ihn fehlerfrei notieren. Die Beschriftung «Ihr Wiederherstellungscode» ist nicht programmatisch mit dem Code verbunden (keine Überschrift, kein Label). Beim Lesen von oben nach unten stört das nicht, beim Springen per Überschrift finde ich den Code aber nicht.
- Der Code bleibt beim Neuladen der Seite gleich. Das ist gut, denn Code und Notfallblatt stimmen überein.
- Die Tab-Reihenfolge auf «Sicherung einrichten» ist logisch: Sprunglink, Kopfzeile, die ganze Navigation (14 Links), dann «Notfallblatt herunterladen (PDF)», das Eingabefeld, «Sicherung starten». Mit «Zum Inhalt springen» komme ich nach einem Tab direkt zum PDF-Link.
- Die Hauptnavigation ist schon vor der Sicherung voll da. Ich hätte die Seite also verlassen können. Ich habe das nicht ausprobiert.
- Das Feld hat ein gutes Label und einen Hilfetext über `aria-describedby`: «Damit ist sicher, dass Sie den Code haben. Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle.» Diese Zusage stimmt: Ich habe den Code klein und mit Leerzeichen statt Bindestrichen eingegeben (`cef3 8wry jd9s mdry yh4w szvp`), und Dwello hat ihn angenommen.
- Fehlerfall: Die Meldung ist ein `role="alert"` mit `tabindex="-1"` und bekommt den Fokus. Sie wird also angesagt und steht direkt über dem Feld. Ein Tab führt zurück ins Feld. Mein falscher Code steht noch darin, ich kann ihn verbessern. Die Meldung sagt, was zu tun ist. Das finde ich sinnvoll.
- Das Feld ist nur über `aria-required` als Pflichtfeld markiert. Der Browser prüft also nicht vorher, und auch ein leeres Feld wird abgeschickt (siehe P-2).
- Nach dem Download des Notfallblatts bleibt der Fokus auf dem Link. Die Datei heisst «Notfallblatt-Dwello.pdf», Titel «Notfallblatt Dwello». Der Text ist klar: Code, Erstellungsdatum 28.10.2026, Adresse der Installation, wo die Sicherungen liegen, was im Notfall zu tun ist, Link zur Installationsanleitung. Der Satz «Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben» ist verständlich.
- Auf dem Blatt steht als Adresse `http://localhost:3310`. Das ist in dieser Testinstallation so zu erwarten.
- Rufe ich `/backup` nach der Bestätigung noch einmal auf, leitet Dwello mich auf die Übersicht weiter, und die Bestätigung erscheint dort nicht mehr. Dabei gibt es keine Ansage, warum ich auf der Übersicht lande.
- Einrichtung: Die Reihenfolge der Felder ist logisch (Einrichtungscode, E-Mail, Passwort, Passwort wiederholen, KI-Wahl als Radiogruppe mit Legende, Knopf). Alles hat ein Label. Danach war ich angemeldet als «sven@dwello.test».

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 7 Durchgänge. Ich habe rund 45 Tasten gedrückt: Einrichtung 9 Tabs und Eingaben, Sicherung je etwa 3 bis 4 Tabs pro Versuch, 1 leerer, 1 falscher und 1 richtiger Versuch.

## Ablauf

- **Leeres Feld abgeschickt** (eigentlich wollte ich nur den Fokus prüfen). Erwartet: «Geben Sie den Code ein» oder eine Pflichtfeld-Meldung. Gesehen: «Der Code stimmt nicht mit dem angezeigten überein …», der Fokus springt auf die Meldung (P-2). Danach ging meine Eingabe ins Leere, weil der Fokus noch auf der Meldung stand und nicht im Feld. Das habe ich erst gemerkt, als ich mit Tab ins Feld zurückging.
- **Falscher Code** (`…-SZVQ`), Enter. Erwartet: Meldung angesagt, Feld als ungültig markiert. Gesehen: Die Meldung wird angesagt und bekommt den Fokus, das Feld ist aber nicht als ungültig markiert und nicht mit der Meldung verbunden (P-1).
- **Richtiger Code**, «Sicherung starten». Erwartet: eine angesagte Bestätigung. Gesehen: Weiterleitung auf `/dashboard?backup=confirmed`, angesagt wird nur «Übersicht - Dwello», die Bestätigung ist ein stiller Absatz (P-3). Im Screenshot `05-overview.png` steht sie als grüner Hinweis mit Häkchen gleich unter dem Einleitungssatz, über dem Hinweis «Das KI-Modell wird geladen: 40 %».
- **Notfallblatt geöffnet**. Erwartet: ein barrierefreies PDF. Gesehen: Der Text ist lesbar, aber das PDF ist nicht getaggt und hat keine Sprache (P-4).

## Vorschläge

- **P-1:** `/backup`, ins Feld `CEF3-8WRY-JD9S-MDRY-YH4W-SZVQ` (ein Zeichen falsch) eingeben, Enter, dann Tab zurück ins Feld. Am Feld fehlen `aria-invalid="true"` und ein Verweis auf die Meldung. Hilfreich wäre, beides zu setzen, solange die Meldung steht: `aria-describedby` auf Hilfetext und Meldung.
- **P-2:** `/backup`, mit Tab ins Feld, leer lassen, Enter. Hilfreich wäre eine eigene Meldung für das leere Feld, etwa «Geben Sie den Wiederherstellungscode ein, wie er oben steht.»
- **P-3:** Richtigen Code eingeben, «Sicherung starten». Hilfreich wäre, die Bestätigung als `role="status"` anzusagen oder den Fokus auf sie zu setzen, damit ich ohne Suchen höre, dass es geklappt hat.
- **P-4:** «Notfallblatt herunterladen (PDF)», die Datei mit `pdfinfo` prüfen: «Tagged: no». Hilfreich wäre ein getaggtes PDF mit Dokumentsprache Deutsch und einer Überschrift für «Wiederherstellungscode». Den Code könnte man zusätzlich in Gruppen vorlesbar machen.

## Nicht geprüft

- Was passiert, wenn ich «Sicherung einrichten» verlasse, ohne zu bestätigen (Erinnerung in der Übersicht?). Die Einrichtung geht nur einmal, und nach der Bestätigung lässt sich der Zustand davor nicht mehr erreichen. Versucht habe ich nur, `/backup` nach der Bestätigung noch einmal aufzurufen: Dwello leitet dann auf die Übersicht weiter.
- Wie ein echter Screenreader (NVDA, VoiceOver) den Code beim normalen Vorlesen ausspricht («CEF3» als Wort oder als einzelne Zeichen). Ich habe nur den Accessibility-Baum. Zeichenweise ist der Code darin klar.
- Das Ausdrucken des PDFs. Ich habe nur seinen Text gelesen.

## Triage (caller)

- P-1 to P-4 (Minor): stay. P-1 needs an id on `Alert` for `aria-describedby`, P-3 a status role for the confirmation; neither is trivial in this slice.
