# Dr. Weber – Slice `update` (#1453)

Frische Installation Dwello 1.4.0 auf http://localhost:3300, Desktop 1440 × 900, Maus. Abgemeldet ohne Persona-Kit-Cookie gestartet, mit landlord@dwello.test und Passwort angemeldet. Ein Platzhalter meldet Dwello 1.5.0. Ich habe weder die Einstellungen gespeichert noch ein Update gestartet. Die Sicherung habe ich eingerichtet, weil Dwello mich nach der Anmeldung zu «Sicherung einrichten» geschickt hat.

Meine Frage: Was schickt Dwello wohin, bevor ich irgendetwas zustimme?

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hinweis «Neue Version verfügbar» und Bestätigung «Dwello jetzt aktualisieren?» | Der Hinweis sagt ohne Einschränkung «Ihre Daten bleiben erhalten», und die Bestätigung spricht nur von «einige Minuten». Laut `update_failed_restore` kann es aber so ausgehen: Dwello ist nicht nutzbar, bis die betreuende Person die Sicherung wiederhergestellt hat, und dafür braucht es das Notfallblatt. Davon steht vor dem Klick auf «Jetzt aktualisieren» nichts. Ich hätte das Update gestartet, ohne das Notfallblatt bereitzulegen. |
| P-2 | Minor | Bestätigung «Dwello jetzt aktualisieren?» | «Dwello lädt Version 1.5.0 herunter» sagt nicht, woher. Dass der Server die Version bei GitHub (USA) holt, steht nur in der Datenschutzerklärung. Genau in dem Moment, in dem ich zustimme, erfahre ich also nicht, wohin der Server sich verbindet. |
| P-3 | Minor | Einstellungen › Updates (Hilfetext) | Der Hilfetext nennt nur die tägliche Anfrage. Dass «Aktualisieren» die Version ebenfalls bei GitHub herunterlädt und die Angaben in die USA gehen, steht nur in der Datenschutzerklärung, und von hier führt kein Link dorthin. Wer nur die Einstellungen liest, bekommt ein unvollständiges Bild. |
| P-4 | Minor | Einstellungen › Updates (Hilfetext) | «Updates spielt dann die Person, die Dwello betreut, selbst ein»: Bei einer eigenen Installation bin ich diese Person. Anders als auf der Seite «Sicherung einrichten» fehlt hier ein Satz wie «Betreuen Sie Dwello selbst, …» mit Verweis auf die Installationsanleitung. Ich wüsste nicht, wie ich nach dem Ausschalten an Updates komme. |
| P-5 | Minor | Hinweis «Neue Version verfügbar» | «Was ist neu?» öffnet https://github.com/rudini/Dwello/releases/tag/v1.5.0 in einem neuen Tab (`target=_blank`). Weder der Linktext noch der Name im Barrierefreiheitsbaum zeigt, dass der Link Dwello verlässt und zu GitHub führt. Die Datenschutzerklärung sagt zu Recht, dass GitHub die IP-Adresse des Browsers erst beim Klick erhält, aber am Link selbst erkenne ich nicht, dass ich gerade diesen Klick mache. |

## Beobachtungen

- Die Datenschutzerklärung (Abschnitt «Weitergabe an Dritte») ist der vollständigste Text. Sie sagt, wer: GitHub, Inc., USA. Sie sagt, wann: einmal am Tag, beim «Aktualisieren» und bei «Was ist neu?». Sie sagt, von welchem Gerät: Server oder Browser. Sie nennt, was nicht übermittelt wird, die Grundlage Swiss-U.S. DPF, wie man die Suche ausschaltet («Einstellungen» › «Updates») und verlinkt die Datenschutzerklärung von GitHub. Den Pfad «Einstellungen» › «Updates» habe ich so gefunden, er stimmt (Adresse /config, Überschrift «Updates»).
- Ob die Anfrage tatsächlich nur einmal am Tag und auch beim Start des Servers kommt, und ob sie ausser der IP-Adresse noch etwas mitschickt (etwa die eigene Versionsnummer im User-Agent), sagt keiner der Texte. Aus dem Browser kann ich das nicht prüfen. Juristisch würde ich gern lesen, ob GitHub die installierte Version erfährt.
- Cookie für «Später»: Es heisst `dwello_update_later`, ist HttpOnly, SameSite=Lax und läuft nach 7,00 Tagen ab. Der Wert ist ein Zeitstempel. Der Klick schickt nur `POST /api/update/later` an Dwello selbst. Der Hinweis verschwindet auf allen Seiten und auch nach dem Neuladen. Nach «Abmelden» ist das Cookie gelöscht, und nach der neuen Anmeldung erscheint der Hinweis wieder. Das deckt sich mit der Datenschutzerklärung («bis zur nächsten Anmeldung oder Abmeldung, höchstens 7 Tage»). Ob «nur technisch notwendige Cookies» auf ein Cookie passt, das nur einen Hinweis ausblendet, kann man streiten, es ist aber offengelegt.
- Während meines ganzen Durchgangs hat der Browser keine einzige Anfrage an einen fremden Server geschickt. Den Link «Was ist neu?» habe ich bewusst nicht angeklickt.
- «Stand: 18. November 2026» ist das heutige Datum und damit plausibel für eine geänderte Erklärung.
- Vor dem Einrichten der Sicherung lautete der Hinweis anders: «Vor dem Update sichert Dwello Ihre Daten. Dafür muss die Sicherung eingerichtet sein.» Statt «Aktualisieren» stand dort der Link «Richten Sie zuerst die Sicherung ein». Das finde ich gut und nachvollziehbar.
- In der Bestätigung heisst es: «Eingaben auf dieser Seite, die Sie noch nicht gespeichert haben, gehen verloren». Laut Datenschutzerklärung bewahrt der Browser Angaben in «Mietvertrag erfassen» und «Abrechnungen erstellen» auf. Ob diese das Update überleben, habe ich nicht geprüft. Der Satz klingt strenger als die Erklärung.
- Nach «Später» springt der Fokus auf `<body>`. Mit der Maus stört mich das nicht, bei einer Tastatur-Bedienung wohl schon.
- Mit dem Abschnitt «Anmeldung» nennt die Erklärung «Ausser den hier und unter «Anmeldung» genannten Diensten …». In dieser Installation (nur Passwort) nennt «Anmeldung» aber keinen Dienst, und unter «Cookies» stehen trotzdem `dwello_oauth_state` und `dwello_login` für Google. Das hat mit dem Update nichts zu tun.
- Die Ausfalltexte (`update_failed*`) habe ich in docs/reviews/update-fachreview-1.md gelesen. `update_failed` und `update_failed_backup` sind klar und ehrlich («Es wurde nichts geändert»). `update_failed_restore` ist ehrlich, aber hart. Darum gehört sein Kern als Vorwarnung in die Bestätigung (P-1). Bei `update_failed_log` muss ein Verwalter, der Dwello selbst betreibt, sich «bei der Person, die Dwello betreut» melden, also bei sich selbst. Auch hier fehlt ein Verweis auf die Installationsanleitung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten und 8 Skriptläufe: Anmeldung, Sicherung einrichten, Hinweis, Bestätigung öffnen und abbrechen, Einstellungen, Datenschutzerklärung, «Später» mit Ab- und Wiederanmeldung, Ausfalltexte lesen.

## Ablauf

- Anmeldung. Erwartet: Übersicht mit dem Hinweis auf die neue Version. Gesehen: Weiterleitung auf /backup («Sicherung einrichten»), der Hinweis oben ohne «Aktualisieren». Ich habe die Sicherung eingerichtet, danach stand «Aktualisieren» da.
- Bestätigung. Erwartet: Woher geladen wird und was im schlimmsten Fall passiert. Gesehen: «Dwello lädt Version 1.5.0 herunter, sichert Ihre Daten und startet neu. Das dauert einige Minuten; so lange können Sie Dwello nicht nutzen.» Weder Quelle noch Risiko werden genannt (P-1, P-2). «Abbrechen» schliesst den Dialog, ohne eine Anfrage zu schicken.
- Einstellungen über /settings aufgerufen. Erwartet: die Einstellungsseite. Gesehen: «Diese Seite gibt es nicht.» Über die Navigation gelangte ich auf /config. Das ist nur meine eigene Annahme gewesen und kein Befund.
- Einstellungen › Updates. Erwartet: dieselbe Vollständigkeit wie in der Datenschutzerklärung. Gesehen: nur die tägliche Anfrage, kein Download, keine USA-Übermittlung, kein Link (P-3, P-4).

## Vorschläge

- **P-1:** Anmelden, Sicherung eingerichtet, «Aktualisieren» wählen. Die Bestätigung um einen Satz ergänzen, etwa: «Geht dabei etwas schief, kann Dwello bis zur Wiederherstellung der Sicherung nicht nutzbar sein. Legen Sie Ihr Notfallblatt bereit.» Im Hinweis «Ihre Daten bleiben erhalten» abschwächen, etwa zu «Dwello sichert Ihre Daten vorher».
- **P-2:** Bestätigung öffnen. Statt «lädt Version 1.5.0 herunter» besser «lädt Version 1.5.0 bei GitHub herunter», dazu ein Link «Was dabei übermittelt wird: Datenschutzerklärung».
- **P-3:** Einstellungen › Updates lesen. Ergänzen: «Wählen Sie «Aktualisieren», lädt der Server die neue Version ebenfalls bei GitHub herunter. Die Angaben können in die USA gelangen.» Dazu ein Link zur Datenschutzerklärung, wie auf der Seite «Sicherung einrichten».
- **P-4:** Einstellungen › Updates lesen. Einen Satz ergänzen wie «Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung», mit Link. Dasselbe gilt sinngemäss für `update_failed_log`.
- **P-5:** Hinweis auf der Übersicht. Den Link «Was ist neu? (GitHub, neues Fenster)» nennen oder ein Symbol für externe Links mit zugänglichem Namen anbringen.

## Nicht geprüft

- **Anfragen des Servers an GitHub:** Ich sehe nur die Anfragen des Browsers, keine von Server zu Server. Ob und wann der Server GitHub fragt und was er dabei mitschickt, konnte ich deshalb nicht beobachten. Die Netzwerkanfragen des Browsers habe ich bei allen Schritten mitgeschrieben: keine ging an einen fremden Server.
- **Suche ausschalten:** Das Ausschalten und die Wirkung davon (kein Hinweis mehr) habe ich nicht geprüft, weil ich laut Auftrag nicht speichern durfte.
- **Update selbst und Ausfalltexte im Bildschirm:** Laut Auftrag habe ich kein Update gestartet. Die Ausfalltexte habe ich nur in der Tabelle des Fachreviews gelesen.
- **«Was ist neu?»:** Den Link habe ich bewusst nicht geöffnet, um keine Anfrage an GitHub auszulösen. Ziel und `target` habe ich aus dem Link ausgelesen.
- **Andere Sprachen:** Ich habe nur Deutsch geprüft.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/8ac6f8d2-3518-57bf-ba01-5c6f20138566/scratchpad/weber-update/ (03-after-backup.png Übersicht mit Hinweis, 05-confirm.png Bestätigungsdialog, 08-updates-section.png Abschnitt Updates, 09-privacy.png Datenschutzerklärung).
