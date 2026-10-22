# Dr. Weber – Slice 577 (Einrichtung mit Einrichtungscode, KI-Modell-Download)

Frische Installation unter http://localhost:3324, abgemeldet gestartet (Cookies gelöscht), Desktop 1440 × 900, Maus. Einrichtungscode aus dem Serverprotokoll (`grep Einrichtungscode …` anstelle von `docker logs dwello-backend`): `JXZQ-SV24`. Zwei falsche Codes versucht, danach eingerichtet mit weber@dwello.test. Ausser der Einrichtung nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einrichtung | Die Sperre nach 5 falschen Codes für 15 Minuten steht nirgends: weder im Hilfetext zum Einrichtungscode noch in der Fehlermeldung nach einem falschen Code, und die Meldung sagt nicht, wie viele Versuche bleiben. |
| P-2 | Minor | Datenschutzerklärung | Unter «Weitergabe an Dritte» fehlt beim Ollama-Download, was bei Google steht: ob die USA einen angemessenen Datenschutz haben oder welche Garantien gelten, und ein Link zur Datenschutzerklärung von Ollama. Bei einer Installation zuhause ist die IP-Adresse des Servers meine eigene. |
| P-3 | Minor | Datenschutzerklärung | Die Texte zum Konto widersprechen sich: «Sie melden sich mit E-Mail-Adresse und Passwort an», aber das Protokoll hält «jede Anmeldung mit dem gewählten Anbieter oder mit Passwort» fest, unter «Cookies» heisst es «über einen Anbieter wie Google auch nicht ohne dwello_oauth_state und dwello_login», und «Ausser den hier und unter «Anmeldung» genannten Diensten» verweist auf einen Abschnitt, der keinen Dienst mehr nennt. |
| P-4 | Minor | Datenschutzerklärung | Zum Einrichtungscode steht nichts: dass er im Protokoll des Servers steht, ob falsche Codes (mit der eingetippten E-Mail-Adresse?) festgehalten werden und was Dwello für die Sperre speichert. Bei den Fehlversuchen der Anmeldung steht das genau beschrieben. |
| P-5 | Minor | Übersicht | Der KI-Hinweis sagt «Bis es geladen ist, erfassen Sie Rechnungen von Hand», aber dieselbe Seite bietet «Rechnungen hochladen» an, und der Dialog dort sagt ohne Einschränkung «Die KI liest die Angaben aus». Was in der Zwischenzeit genau nicht geht (das Auslesen, auch der Kategorie-Vorschlag?), bleibt offen. |
| P-6 | Nit | Übersicht | Der Hinweis «Das KI-Modell wird geladen: 40 %.» sagt nicht, wie gross der Download ist (rund 6 GB steht nur in der Datenschutzerklärung), woher er kommt und ob die Zahl von selbst weiterläuft. Nach 8 Sekunden und einem Neuladen stand weiter 40 %. |
| P-7 | Nit | Einrichtung | Der Befehl `docker logs dwello-backend` ist nicht als Befehl abgesetzt und bricht im Hilfetext und in der Fehlermeldung am Bindestrich um («dwello-» / «backend»). Wer abtippt, setzt leicht ein Leerzeichen. Die Fehlermeldung wiederholt dazu den Hilfetext fast wörtlich. |

## Beobachtungen

- Auf der Einrichtungsseite steht nichts zum Download des KI-Modells, obwohl er gleich nach der Einrichtung beginnt. Davon erfahre ich nur, wenn ich die Datenschutzerklärung lese.
- Die Datenschutzerklärung erklärt das Konto, das ich gleich anlege, im Abschnitt «Anmeldung» schon richtig: Das Konto wird bei der Einrichtung angelegt, das Passwort wird nur als Hash gespeichert, dazu die Fehlversuche und die Sperre, und die Kopfzeile zeigt die E-Mail-Adresse. Das passt zur Seite («Mindestens 8 Zeichen, am besten ein langes Passwort, das Sie sonst nirgends verwenden»).
- Die Cookies im Browser nach der Einrichtung passen zur Datenschutzerklärung: `dwello_session` (HttpOnly) und `dwello_xsrf` laufen 7 Tage, `PARAGLIDE_LOCALE` läuft rund 400 Tage. Bei der Einrichtung hat der Browser nur localhost:3324 aufgerufen, keinen fremden Server.
- Im Protokoll unter «Einstellungen» zählt die Einrichtung als «Anmeldung mit Passwort». Das passt zu «Danach sind Sie angemeldet».
- Im Serverprotokoll fand ich nach den zwei falschen Codes keinen Eintrag dazu. Der Code blieb nach den Fehlversuchen derselbe.
- Nach einem Fehler bleiben Code und E-Mail-Adresse stehen, die Passwortfelder werden geleert. Das finde ich richtig. Der Fokus lag danach auf keinem Feld und auch nicht auf der Meldung, sondern auf einem DIV.
- Nach der Einrichtung leitet `/setup` zur Übersicht weiter. Man kann also keine zweite Einrichtung starten.
- Wie man ein vergessenes Passwort zurücksetzt, steht nur auf der Anmeldeseite («Der Betreiber … setzt es mit einem Befehl zurück»), nicht auf der Einrichtungsseite, wo ich das Passwort festlege.
- In der Fusszeile steht «Version unbekannt».
- Wegen «Der Betreiber dieser Dwello-Installation hat seinen Namen und seine Adresse noch nicht hinterlegt» fehlt auf einer frischen Installation ein Verantwortlicher. Das kommt erwartungsgemäss vor, für die Weitergabe an Mieter ist es aber heikel.
- «Anbieter» steht für zwei Dinge: für den Dienstleister, der Dwello betreibt, und für den Anmeldedienst (Google).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, davon gut 10 Minuten Lesen (Einrichtungsseite, Datenschutzerklärung, Nutzungsbedingungen, Hilfe). Dazu kamen sieben Schritte: Seite öffnen, Datenschutzerklärung lesen, Passwörter absichtlich ungleich eingeben, zwei falsche Codes eingeben, richtig einrichten, Übersicht beurteilen. Die Einrichtung selbst dauerte unter einer Minute.

## Ablauf

1. **http://localhost:3324/ öffnen.** Erwartet: eine Einrichtungsseite. Gesehen: Weiterleitung über `/login` nach `/setup`, «Dwello einrichten» mit den Feldern Einrichtungscode, E-Mail-Adresse, Passwort und Passwort wiederholen, jedes Label über dem Feld und mit Hilfetext. Wo der Code steht, ist erklärt. Zur Sperre und zum Modell-Download steht nichts (P-1, Beobachtung). Screenshot `01-start.png`: eine ruhige Karte mit Haus-Illustration, der Befehl bricht um (P-7).
2. **Datenschutzerklärung über den Link der Seite.** Erwartet: Konto, Passwort, Code und Download erklärt. Gesehen: Konto und Passwort sind gut erklärt. Der Download steht unter «Weitergabe an Dritte» mit Ollama Inc., USA, rund 6 GB, IP-Adresse und Modellname. Bei Ollama fehlen Angemessenheit und Link (P-2), daneben stehen Restsätze zum Anbieter-Login (P-3), und zum Einrichtungscode steht nichts (P-4). Nutzungsbedingungen und Hilfe sagen zum Thema nichts Widersprüchliches. Die Hilfe erklärt die Einrichtung gar nicht.
3. **Code richtig eingeben, Passwörter ungleich.** Erwartet: eine Meldung, kein Fehlversuch. Gesehen: «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.» Code und E-Mail-Adresse blieben stehen (`05-mismatch.png`).
4. **Falscher Code `JXZQ-SV42` (Zahlendreher).** Erwartet: eine Meldung mit den verbleibenden Versuchen oder einem Hinweis auf die Sperre. Gesehen: eine rote Meldung mit Symbol, «Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers … Geben Sie ihn erneut ein.», ohne Zahl und ohne Sperre (`06-wrong1.png`, P-1).
5. **Zweiter falscher Code `ABCD-1234`.** Erwartet: wieder eine Meldung, vielleicht jetzt eine Warnung. Gesehen: dieselbe Meldung (`07-wrong2.png`).
6. **Richtiger Code `JXZQ-SV24`, weber@dwello.test, gleiches Passwort zweimal.** Erwartet: angemeldet auf der Übersicht. Gesehen: `/dashboard`, die Kopfzeile zeigt weber@dwello.test (`08-after-setup.png`).
7. **KI-Hinweis beurteilen.** Erwartet: Fortschritt, Grund und was ich in der Zwischenzeit tun kann. Gesehen: ein blauer Info-Kasten über «Als Nächstes zu tun» mit «Das KI-Modell wird geladen: 40 %.» und «Bis es geladen ist, erfassen Sie Rechnungen von Hand.» Das ist knapp und verständlich, und die Schweizer Schreibweise «40 %» stimmt. Es fehlen Grösse und Herkunft, und «Rechnungen hochladen» wird trotzdem angeboten (P-5, P-6). Nach dem Neuladen stand weiter 40 % (`09-dashboard-reload.png`).
8. **Gegenprobe ohne Speichern.** Abmelden und mit dem neuen Passwort anmelden ging. `/setup` leitet zur Übersicht weiter. Der Upload-Dialog (`11-upload.png`) sagt nichts davon, dass die KI noch nicht bereit ist.

## Verwirrung

- «Es gilt der zuletzt angezeigte Code»: Wann zeigt der Server einen neuen an? Bei jedem Neustart? Nach der Sperre? Das steht nicht da.
- «Von Hand erfassen»: Heisst das nur ohne Hochladen, oder auch ohne Kategorie-Vorschlag?
- «Anbieter» meint einmal den Betreiber-Dienstleister und einmal Google als Anmeldedienst.
- Der Abschnitt «Anmeldung» wird als Ort genannter Dienste zitiert, nennt aber keinen.

## Fehlerrisiken

- Wer den Befehl abtippt und den umgebrochenen Bindestrich als Trennung liest, findet den Code nicht und probiert womöglich herum. Ohne Ankündigung der Sperre tappt man so in die 15 Minuten.
- Wer «Rechnungen hochladen» während des Downloads benützt, erwartet Ausgelesenes und bekommt vermutlich nichts. Das habe ich nicht geprüft, weil ich nicht speichern durfte.
- Wer Mietern die Abschnitte der Datenschutzerklärung weitergibt (so empfehlen es die Nutzungsbedingungen), gibt ihnen die Restsätze zum Google-Login und den Ollama-Absatz ohne Angaben zur Angemessenheit mit.

## Vorschläge

- **P-1:** `/setup` öffnen, einen falschen Code eingeben. Die Meldung nennt keine Sperre. Hilfe: Im Hilfetext ergänzen «Nach 5 falschen Codes ist die Einrichtung 15 Minuten gesperrt.» und in der Meldung die verbleibenden Versuche nennen.
- **P-2:** `/privacy`, «Weitergabe an Dritte», der Absatz zu Ollama. Hilfe: angeben, ob Ollama Inc. nach dem Swiss-U.S. Data Privacy Framework zertifiziert ist oder auf welcher Grundlage die Daten in die USA gehen (Art. 16 DSG), und wie bei swisstopo und Google die Datenschutzerklärung von Ollama verlinken.
- **P-3:** `/privacy`, die Abschnitte «Welche Daten Dwello speichert», «Weitergabe an Dritte» (letzter Satz) und «Cookies» (letzter Satz). Hilfe: die Sätze zum Anbieter-Login streichen oder auf das Passwort umstellen und den Verweis auf «Anmeldung» berichtigen.
- **P-4:** `/privacy`, «Anmeldung». Hilfe: einen Satz zur Einrichtung ergänzen, etwa dass der Einrichtungscode im Protokoll des Servers steht, ob falsche Codes festgehalten werden und dass sie die Einrichtung 15 Minuten sperren.
- **P-5:** Nach der Einrichtung die Übersicht öffnen. Der Hinweis sagt «von Hand», «Häufige Arbeiten» bietet «Rechnungen hochladen» an, und der Dialog verspricht das Auslesen. Hilfe: im Hinweis sagen, was nicht geht («Hochladen und Auslesen sind erst danach möglich»), und den Upload-Dialog solange mit demselben Hinweis versehen.
- **P-6:** Übersicht während des Downloads. Hilfe: «Dwello lädt das KI-Modell (rund 6 GB) bei Ollama herunter: 40 %.» und ein Satz, ob sich die Anzeige von selbst aktualisiert.
- **P-7:** `/setup`, der Hilfetext zum Einrichtungscode. Hilfe: den Befehl als Code ohne Umbruch setzen und die Fehlermeldung auf «Der Einrichtungscode stimmt nicht. Prüfen Sie ihn und geben Sie ihn erneut ein.» kürzen.

## Nicht geprüft

- Die Sperre nach 5 falschen Codes: Ich durfte höchstens zwei falsche Codes eingeben, den Sperrtext habe ich deshalb nicht gesehen.
- Ob der Fortschritt von selbst weiterläuft und was die Übersicht nach dem Download zeigt: Der Stand blieb bei 40 %, vermutlich ein fester Wert des Testaufbaus.
- Ob Hochladen und Erfassen während des Downloads wirklich funktionieren: Ausser der Einrichtung durfte ich nichts speichern.
- Welche Server der Backend-Server für den Download aufruft: Ich sehe nur die Anfragen des Browsers.
- Die anderen Sprachen und die mobile Ansicht.
