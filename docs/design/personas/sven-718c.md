# Sven, Slice 718c: Neuer Wiederherstellungscode

Persona: Sven, 45, blind, nur Tastatur und Screenreader (beurteilt am Accessibility-Tree). Desktop 1440 × 900, Zoom 100 %.
App: zweite Instanz auf http://localhost:3310, abgemeldet gestartet ohne Persona-Kit-Cookie, Anmeldung mit `sven@dwello.test`. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/sven-718c/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Wiederherstellungscode, nach «Neuen Code erstellen» | Nach dem richtigen Passwort liegt der Fokus auf `body`, die Statusmeldung bleibt leer. Ich höre nichts. Dass jetzt ein Code da ist, merke ich erst, wenn ich mit Tab durch 17 Navigationslinks gehe oder die Seite von oben lese. |
| P-2 | Major | Neuer Wiederherstellungscode, nach «Neuen Code bestätigen» | Auch die Bestätigung wird nicht angesagt: Der Fokus fällt auf `body`, die Statusmeldung bleibt leer. Der Satz «Der neue Wiederherstellungscode gilt ab jetzt …» ist ein gewöhnlicher Absatz. Gleich danach steht wieder «Passwort» und «Neuen Code erstellen». Für mich klingt das wie die Startseite, also so, als hätte das Bestätigen nicht geklappt. |
| P-3 | Minor | Neuer Wiederherstellungscode, Schritt mit dem Code | «Ihr Wiederherstellungscode» ist ein loser Absatz ohne Überschrift und ohne Verbindung zum Code-Absatz. Mit der Überschriftennavigation (H) finde ich nur die h1. Den Code (`SKT6-UF4Y-FWGB-T6PN-92RK-KK2C`) muss ich im Lesemodus suchen, bevor ich ihn Zeichen für Zeichen lesen kann. |
| P-4 | Minor | Neuer Wiederherstellungscode, Fehler beim Passwort und beim Code | Die Fehler werden gut angesagt (`role=alert`, der Fokus springt auf die Meldung). Das Feld selbst bekommt aber kein `aria-invalid` und keinen Verweis auf die Meldung. Der falsche Wert bleibt stehen. Gehe ich mit Tab zurück ins Feld, höre ich nur «Passwort» bzw. «Wiederherstellungscode erneut eingeben», ohne Hinweis auf den Fehler. |
| P-5 | Minor | Neuer Wiederherstellungscode, Start | Das Passwortfeld ist nicht mit dem Satz «Geben Sie Ihr Passwort erneut ein. So kann nur, wer das Passwort kennt …» verbunden (kein `aria-describedby`). Mit Tab höre ich nur «Passwort, geschützt». Ohne Lesen der Seite weiss ich nicht, warum hier noch einmal das Passwort verlangt wird. |
| P-6 | Minor | Notfallblatt (PDF) | Das PDF ist nicht getaggt (`pdfinfo`: «Tagged: no»), eine Dokumentsprache gibt es auch nicht. Mein Screenreader liest es ohne Struktur und mit englischer Aussprache. Die Textreihenfolge stimmt (pdftotext). |
| P-7 | Minor | Neuer Wiederherstellungscode, Start | Der erste Satz der Seite lautet «Die Sicherungen von vorher lassen sich weiterhin nur mit dem alten Code lesen …». Er erklärt eine Folge, bevor gesagt wird, was die Seite tut: Ein neuer Code ersetzt den alten für alle künftigen Sicherungen. Beim Vorlesen von oben weiss ich zuerst nicht, auf welches «vorher» sich der Satz bezieht. |

## Beobachtungen

- Der Link in «Einstellungen» ist gut zu finden. Er steht unter der h2 «Sicherung» und heisst «Neuer Wiederherstellungscode», mit Tab ist er der 22. Halt. Die Beschreibung darunter («Erstellen Sie einen neuen Wiederherstellungscode, etwa wenn Sie das Notfallblatt verloren haben.») ist nicht mit dem Link verbunden. Mit Tab höre ich sie nicht. Bei den anderen Einträgen der Seite ist das genauso.
- Der Einleitungssatz der Seite «Einstellungen» nennt die Sicherung nicht («Absender für Abrechnungen und Mahnungen, Vorschläge … und die Stammdaten.»).
- Nach jedem Seitenwechsel liegt der Fokus auf `body`. Der Seitentitel wird über die Live-Region angesagt («Neuer Wiederherstellungscode - Dwello»). Mit «Zum Inhalt springen» komme ich schnell in den Inhalt.
- Die Fehlermeldungen sind klar und sagen, was zu tun ist: «Das Passwort stimmt nicht. Geben Sie das Passwort ein, mit dem Sie sich anmelden.» und «Der Code stimmt nicht mit dem angezeigten überein. Geben Sie ihn so ein, …; Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle.» Nach der Meldung führt mich ein Tab direkt ins Feld.
- Die Bestätigung nimmt den Code wie versprochen in Kleinbuchstaben und mit Leerzeichen statt Bindestrichen an (`skt6 uf4y fwgb t6pn 92rk kk2c`).
- Der Code enthält keine leicht verwechselbaren Zeichen wie 0/O oder 1/I. Zeichenweise gelesen ist er eindeutig.
- Lade ich die Seite neu, bevor ich bestätigt habe, zeigt sie denselben Code noch einmal. Ich verliere also nichts, wenn der Browser zugeht.
- «Notfallblatt herunterladen (PDF)» ist ein Link. Enter lädt die Datei `Notfallblatt-Dwello.pdf` herunter, der Fokus bleibt auf dem Link. Gut.
- PDF-Text (eine Seite A4): Titel «Notfallblatt Dwello», «Wiederherstellungscode», der Code, «Code erstellt am 30.10.2026. Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.», «Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter.», die Adresse der Installation, wo die Sicherungen liegen, was im Notfall zu tun ist, der Link zur Installationsanleitung und «Bewahren Sie dieses Blatt getrennt von Ihrem Computer an einem sicheren Ort auf.» Der Code im PDF stimmt mit dem auf der Seite überein.
- Rufe ich `/backup/sheet` nach der Bestätigung direkt auf, leitet die App ohne Meldung auf die Übersicht um. Das ist kein Teil meiner Aufgabe, aber ich hätte einen Hinweis erwartet, warum es das Blatt nicht mehr gibt.
- Die Seite hat keinen Link zurück zu «Einstellungen». Für mich kein Problem, die Navigation reicht.

## Aufgabe geschafft: ja

Den Code habe ich erstellt, gelesen, das Notfallblatt heruntergeladen und den Code bestätigt. An den zwei wichtigsten Stellen (Code erstellt, Code bestätigt) wusste ich aber nur deshalb Bescheid, weil ich die Seite von oben neu gelesen habe (P-1, P-2).

## Aufwand

Etwa 12 Minuten, 9 Durchgänge. Etwa 22 Tabs bis zum Link in «Einstellungen», 18 bis zum Passwortfeld, je ein Fehlversuch bei Passwort und Code.

## Ablauf

- Richtiges Passwort, Enter. Erwartet: Eine Ansage wie «Neuer Code erstellt» und der Fokus auf dem Code oder einer Überschrift. Gesehen: Der Fokus liegt auf `body`, die Statusmeldung ist leer. Erst beim Lesen von oben fand ich «Ihr Wiederherstellungscode» und den Code (Screenshot 06-code-shown.png: grosser Code in fetter Schrift, darunter der Link zum PDF und das Bestätigungsfeld).
- Code beim zweiten Versuch richtig eingegeben, Enter. Erwartet: Eine angesagte Erfolgsmeldung und eine Seite, die nach Abschluss klingt. Gesehen: Der Fokus liegt auf `body`, keine Ansage. Die URL ist jetzt `?confirmed`, die Seite zeigt wieder Passwortfeld und «Neuen Code erstellen». Die Erfolgsmeldung steht als einfacher Absatz dazwischen (Screenshot 09-confirmed.png).
- Falsches Passwort und falscher Code. Erwartet: Fehler angesagt, Feld als fehlerhaft markiert. Gesehen: Fehler angesagt, der Fokus liegt auf der Meldung. Das Feld ist nicht als fehlerhaft markiert, der falsche Wert bleibt stehen (P-4).
- Das PDF. Erwartet: Ein getaggtes Dokument auf Deutsch. Gesehen: Nicht getaggt, ohne Sprache (P-6).

## Vorschläge

- **P-1:** Anmelden, «Einstellungen» › «Neuer Wiederherstellungscode», Passwort eingeben, Enter. Danach den Fokus auf «Ihr Wiederherstellungscode» setzen (als Überschrift mit `tabindex="-1"`) oder den neuen Zustand über die Statusmeldung ansagen, etwa «Neuer Code erstellt. Lesen Sie ihn, laden Sie das Notfallblatt herunter und bestätigen Sie den Code.»
- **P-2:** Weiter wie bei P-1, den Code eingeben, Enter. Die Erfolgsmeldung als `role=status` oder als fokussierte Meldung ausgeben, mit dem Fokus darauf. Nach der Bestätigung entweder nicht gleich wieder das Formular «Neuen Code erstellen» zeigen, oder die Meldung klar davon trennen (eigene Überschrift, z. B. «Neuer Code bestätigt»).
- **P-3:** Weiter wie bei P-1. «Ihr Wiederherstellungscode» als h2, den Code darunter mit ihm verbinden (z. B. als `figure`/`group` mit `aria-labelledby`). Dann finde ich ihn mit H und kann ihn gleich zeichenweise lesen.
- **P-4:** Falsches Passwort bzw. falschen Code senden, dann mit Tab ins Feld. Das Feld mit `aria-invalid="true"` markieren und per `aria-describedby` mit der Fehlermeldung verbinden. Beim Code bleibt der Hilfetext dabei verbunden.
- **P-5:** Seite öffnen, mit Tab ins Passwortfeld. Den Satz «Geben Sie Ihr Passwort erneut ein …» per `aria-describedby` mit dem Feld verbinden, so wie beim Codefeld (`backup-code-help`).
- **P-6:** Notfallblatt herunterladen, `pdfinfo` zeigt «Tagged: no». Das PDF mit Tags ausgeben (PDFKit `tagged: true`, Überschriften und Absätze als Struktur) und die Sprache `de-CH` setzen.
- **P-7:** Seite öffnen und von oben vorlesen lassen. Mit einem Satz beginnen, der sagt, was passiert («Ein neuer Code ersetzt den alten für alle Sicherungen ab der Bestätigung.»). Danach erst die Folgen für die alten Sicherungen.

## Nicht geprüft

- Ansagen eines echten Screenreaders (NVDA/JAWS/VoiceOver): Ich habe nur den Accessibility-Tree, `document.activeElement` und die Live-Regionen ausgelesen. Ob die Live-Region mit dem Seitentitel nach `?confirmed` den gleichen Titel noch einmal ansagt, kann ich so nicht feststellen.
- Ob die erste Sicherung mit dem neuen Code wirklich läuft («Dwello erstellt gleich eine erste Sicherung»): Die Oberfläche zeigt dafür nichts an, das Server-Dateisystem prüfe ich als Persona nicht.
- Ob der alte Code nach der Bestätigung die älteren Sicherungen noch öffnet: Ohne Zugang zum Server nicht prüfbar.

## Triage (caller)

- P-1, P-2 (Major): fixed. After «Neuen Code erstellen» the focus goes to the new code, after the confirmation to the confirmation (scenario lines, seen red).
- P-3 to P-7 (Minor): stay.
