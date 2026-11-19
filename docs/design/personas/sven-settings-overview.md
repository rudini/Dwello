# Sven – Einstellungen (Übersicht) und «Absender und Konto», nur Tastatur und Screenreader

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt nach dem Accessibility-Tree.
Stand vor dem Lauf (vom Aufrufer per SQL gesetzt): IBAN gespeichert, Firmenname und Ort fehlen. Nichts gespeichert, nichts umgeschaltet, kein Export gestartet.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen | Die Meldung «Es fehlen Angaben zur Firmenadresse.» ist nicht mit dem Link «Absender und Konto» verbunden (kein `aria-describedby`). Mit Tab höre ich nur «Absender und Konto, Link». Die Meldung höre ich nur, wenn ich im Lesemodus nach dem Link weiterlese. Dasselbe gilt für die Erklärung unter jedem Link. |
| P-2 | Minor | Einstellungen | «Es fehlen Angaben zur Firmenadresse.» sagt nicht, welche Angaben fehlen. Für mich gehört der Firmenname auch nicht zur «Adresse». Erst auf der nächsten Seite erfahre ich «Name, PLZ und Ort». Die PLZ ist dort aber schon ausgefüllt. |
| P-3 | Minor | Absender und Konto | Das Feld «IBAN» wird als «ungültig» angesagt, obwohl die IBAN stimmt. Als Fehler kommt dieselbe Meldung wie bei Firmenname und Ort. Ich habe zuerst gedacht, meine IBAN sei falsch, und hätte sie fast neu eingetippt. |
| P-4 | Minor | Einstellungen | Kontrollkästchen «Täglich nach neuen Versionen suchen»: Neben dem Kästchen gibt es keinen Knopf «Speichern». Die Beschreibung sagt nicht, ob schon die Leertaste die Einstellung sofort ändert. Beim Erkunden könnte ich so aus Versehen eine Einstellung umschalten, die für die ganze App gilt. |

## Beobachtungen

- Benutzermenü: Der Knopf heisst «Vera Verwalter Benutzermenü» und meldet «erweitert» / «reduziert». Nach Enter bleibt der Fokus auf dem Knopf. Pfeil nach unten führt zu «Einstellungen», dann zu «Abmelden». Ohne Pfeiltaste wüsste ich nicht, dass es weitergeht. Mit Tab wäre ich danach aber auch auf «Einstellungen» gelandet. Kein Hindernis.
- Nach dem Öffnen von «Einstellungen» liegt der Fokus auf dem Seitenanfang (body). Angesagt wird «Einstellungen - Dwello», und der Seitentitel stimmt. Das ist in Ordnung.
- Die Überschriften sind sauber gestuft: H1 «Einstellungen», danach drei H2 als Gruppen: «Ihre Angaben», «Abrechnung», «Daten und Sicherheit». Jede Gruppe ist eine Liste mit 1, 3 und 3 Einträgen. Jeder Eintrag hat einen Link und darunter einen Erklärungssatz. Die Linknamen sind eindeutig, und Kategorien, Verteilschlüssel und Heizprofile heissen gleich wie in der Hauptnavigation.
- Das Kontrollkästchen «Täglich nach neuen Versionen suchen» wird als Kontrollkästchen angesagt (nicht als Schalter), ist aktiviert und hat einen richtigen Namen. Die Beschreibung (GitHub, IP-Adresse, was beim Ausschalten passiert) ist per `aria-describedby` verbunden und wird beim Fokus vorgelesen. Es steht unter der H2 «Daten und Sicherheit», hat aber keine eigene Überschrift. Mit der Überschriften-Taste springe ich darüber hinweg, von «Daten und Sicherheit» direkt zu «Alle Daten exportieren». Nicht umgeschaltet.
- «Alle Daten exportieren» hat eine H3 (unter «Daten und Sicherheit», passt) und danach einen Knopf mit demselben Namen. Die Beschreibung (ZIP, Excel, daten.json, Mieterdaten sicher aufbewahren) ist mit dem Knopf verbunden und wird beim Fokus vorgelesen. Sehr gut. Nicht ausgelöst.
- In der Hauptnavigation trägt «Einstellungen» `aria-current="page"`.
- Auf «Absender und Konto» landet der Fokus direkt im Feld «Firmenname». Das passiert über den Link und auch beim direkten Aufruf der Adresse. Angesagt werden «Absender und Konto - Dwello» (Live-Region) und dann «Firmenname, Eingabe, ungültig, Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort. Beispiel: Muster Immobilien AG». Für die Aufgabe ist das praktisch. Die H1, den Einleitungssatz und den Abschnitt «Absender» überspringe ich dabei aber. Dass ich auf einer Seite mit Fristen, Pauschale und Vorschlägen bin, merke ich erst beim Weitertabben. Ob die beiden Ansagen sich überschneiden, hängt vom Screenreader ab.
- Das Feld «Ort» meldet ebenfalls «ungültig» und denselben Satz. Die PLZ ist ausgefüllt und nicht als ungültig markiert. Keines der Felder ist als «erforderlich» markiert. Dass Firmenname und Ort jetzt Pflicht sind, erfahre ich nur aus dem Fehlersatz.
- Die Meldung unter der IBAN wird im Lesemodus doppelt vorgelesen: in der Hilfe der IBAN («Mit einer IBAN braucht es Firmenname, PLZ und Ort») und gleich darauf als Fehlersatz («… die Firmenadresse. Erfassen Sie Name, PLZ und Ort.»). Die zwei Fassungen sind verschieden formuliert.
- Die Brotkrümelnavigation heisst «Brotkrümelnavigation» und enthält den Link «Einstellungen» und das Element «Absender und Konto» mit `aria-current="page"`. Vom Feld Firmenname aus erreiche ich den Link mit einmal Shift+Tab. Der Name ist klar. Dass der Fokus hinter der Brotkrümelnavigation startet, ist kein Problem, solange man rückwärts tabbt.
- Die Felder haben alle Labels über dem Feld, Beispiele und Hilfetexte sind verbunden. Die Erklärtexte (Verwaltungspauschale, Fristen) sind lang, aber verständlich.
- «Einstellungen speichern» nicht gedrückt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 6 Durchläufe. Übersicht: 4× Tab, Enter, Pfeil runter, Enter. Dann 30 Tab-Schritte durch die Seite. Absender: 20× Tab bis zum Link, Enter, 14 Tab-Schritte vorwärts, 6 rückwärts.

## Ablauf

- Benutzermenü geöffnet. Erwartet: Fokus springt in das Menü. Gesehen: Fokus bleibt auf dem Knopf, erst Pfeil nach unten geht zu «Einstellungen».
- Mit Tab auf «Absender und Konto». Erwartet: Link mit Hinweis auf die fehlenden Angaben. Gesehen: nur «Absender und Konto, Link» (P-1).
- Meldung im Lesemodus gelesen. Erwartet: welche Felder fehlen. Gesehen: «Es fehlen Angaben zur Firmenadresse.» (P-2).
- Seite «Absender und Konto» geöffnet. Erwartet: Fokus auf der Überschrift oder am Seitenanfang. Gesehen: Fokus direkt im Feld «Firmenname», ungültig, mit Fehlersatz.
- Tab zur IBAN. Erwartet: IBAN in Ordnung, weil sie gespeichert ist. Gesehen: «IBAN, ungültig» mit dem Fehlersatz zur Firmenadresse (P-3).
- Kontrollkästchen Versionssuche fokussiert. Erwartet: Hinweis, ob und wie die Änderung gespeichert wird. Gesehen: kein Hinweis und kein Speichern-Knopf in der Nähe (P-4).

## Vorschläge

- **P-1:** /config öffnen, mit Tab auf «Absender und Konto». Angesagt wird nur der Linkname. Hilfe: Die Meldung über die fehlenden Angaben (und die Erklärung) per `aria-describedby` mit dem Link verbinden, damit sie beim Fokus mitkommt.
- **P-2:** Mit IBAN, ohne Firmenname und Ort, /config öffnen. Hilfe: Die fehlenden Felder nennen, z. B. «Es fehlen Firmenname und Ort für die QR-Rechnung.», oder eine Formulierung, die den Namen mit einschliesst («Angaben zum Absender»).
- **P-3:** Mit IBAN, ohne Firmenname und Ort, /config/sender öffnen und zur IBAN tabben. Angesagt wird «ungültig». Hilfe: Die IBAN nicht als ungültig markieren, wenn sie selbst stimmt. Der Fehler gehört an Firmenname und Ort. Bei der IBAN reicht der Hinweis in der Hilfe.
- **P-4:** /config öffnen und zum Kontrollkästchen tabben. Hilfe: In der Beschreibung sagen, dass die Änderung sofort gilt, z. B. «Die Änderung wird sofort gespeichert.». Nach dem Umschalten eine Statusmeldung geben. Die Status-Region ist schon da, angesehen habe ich sie wegen des Verbots nicht.

## Nicht geprüft

- Was nach dem Umschalten der Versionssuche angesagt wird: Laut Aufgabe nicht umschalten.
- Der Export und seine Ansagen: Laut Aufgabe nicht starten.
- Fehlermeldungen nach «Einstellungen speichern»: Laut Aufgabe nicht speichern.
- Echte Screenreader-Ausgabe (NVDA/JAWS), etwa ob sich die Live-Region mit dem Seitentitel und die Fokus-Ansage beim Öffnen von «Absender und Konto» überschneiden. Beurteilt habe ich nur nach dem Accessibility-Tree und `aria-describedby`.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/48924d67-1049-5133-b716-46d184d677e3/scratchpad/sven-settings-overview/` (01-menu.png Benutzermenü offen; 02-config.png Übersicht mit roter Warnzeile und Dreieck-Symbol unter «Absender und Konto»; 03-sender.png Formular).
