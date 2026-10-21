# Fachreview #576, Runde 1 (Schritt 1, vor der Umsetzung)

Gegenstand: `git diff fef00fd 9dfdaf1 -- tests/e2e/features` (Worktree `review-576-fach`, 9dfdaf1) und die geplanten Texte aus dem Auftrag. Rollen: Rechtstexte (DSG), Verwalter (Wortlaut, Design-Regeln). Mietrecht ist nicht betroffen.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Major | Der Hinweis zu http nennt nur das Passwort. Über http gehen aber alle Daten unverschlüsselt durchs Netz, auch die der Mieter, und ebenso das Sitzungs-Cookie. |
| R-2 | Rechtstexte | Major | Für ein Konto mit Passwort ohne Google fehlt ein Text: `privacy_login_1` «Die Anmeldung erfolgt über {providers}» hat dann eine leere Liste. Kein Szenario und kein geplanter Test deckt diesen Zustand ab. |
| V-1 | Verwalter | Major | Der Zustand «Fehler beim Prüfen des Passworts» (Backend antwortet 500) hat kein Szenario. «Done means» verlangt die Fehlerzustände nach `tests/e2e/CLAUDE.md`, und dieser Zustand lässt sich mit `FailRequests` herstellen. |
| V-2 | Verwalter | Major | `login_unavailable_text` «Bitte hinterlegen Sie die OAuth-Zugangsdaten für Google oder Microsoft.» schickt einen Selbsthoster ohne Konto zu Google, obwohl das Konto mit Passwort jetzt der Standard ist. |
| R-3 | Rechtstexte | Minor | «nur als Hash, aus dem sich das Passwort nicht zurückgewinnen lässt» ist zu stark: Ein schwaches Passwort lässt sich aus dem Hash durch Ausprobieren finden. «Hash» ist zudem Fachjargon. Wortlaut unten, Schritt in `app-frame.steps.ts:110` anpassen. |
| R-4 | Rechtstexte | Minor | Wie lange Fehlversuche und Sperre gespeichert bleiben, sagt der Text nicht (Art. 6 Abs. 4 DSG). Ergänzen: «bis zur nächsten erfolgreichen Anmeldung bzw. bis die Sperre abläuft». Die Umsetzung muss das auch so tun. |
| R-5 | Rechtstexte | Minor | Es ist offen, ob Fehlversuche und Sperren mit der eingegebenen E-Mail-Adresse ins Protokoll des Servers gehen. Falls ja, muss `privacy_login_log` das nennen. Falls nein, muss der Plan das festhalten. |
| R-6 | Rechtstexte | Minor | `audit_privacy` «jede Anmeldung mit dem gewählten Anbieter» passt nicht zu «Anmeldung mit Passwort». Neu: «… mit dem gewählten Anbieter oder mit Passwort (ohne Namen und E-Mail-Adresse)». privacy.feature:37 entsprechend anpassen. |
| R-7 | Rechtstexte | Minor | `privacy_cookies_5` sagt, ohne «dwello_oauth_state» und «dwello_login» sei keine Anmeldung möglich. Bei der Anmeldung mit Passwort stimmt das nur, wenn diese Cookies dort auch gesetzt werden. Den Text an die Umsetzung anpassen, ein neues Cookie unter «Cookies» nennen (Art. 45c FMG). |
| V-3 | Verwalter | Minor | Den Fall «Abmelden» nach einer Anmeldung mit Passwort deckt kein Szenario ab, obwohl «Done means» ihn aufzählt. Ein Szenario ergänzen oder begründen, warum «Abmelden» (authentication.feature:51) denselben Weg prüft. |
| V-4 | Verwalter | Minor | Der Text «Die Person, die Dwello eingerichtet hat» umschreibt den Glossarbegriff **Betreiber** (der auch eine Firma sein kann). Der Vermieter, der selbst betreibt, erfährt nicht, wo der Befehl steht. Wortlaut unten. |
| V-5 | Verwalter | Minor | «gesperrt bis {time} Uhr»: Die Uhrzeit muss in Europe/Zurich gerechnet werden, nicht in der Zeitzone des Containers (oft UTC). Ein Test auf unterer Ebene sollte 15 Minuten und die Zeitzone festhalten, denn das Szenario prüft nur den Satzanfang. |
| V-6 | Verwalter | Minor | Die gleiche Meldung bei falscher Adresse soll verbergen, welche Adressen ein Konto haben. Das hält nur, wenn auch eine unbekannte Adresse nach fünf Versuchen die Sperrmeldung zeigt (oder keine Adresse je eine). Sonst verrät die Sperre das Konto. Entscheiden und in einem Test auf unterer Ebene festhalten. |
| V-7 | Verwalter | Minor | Neue Zustände der Anmeldeseite fehlen in `tests/a11y/screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` (Formular mit Passwort, falsches Passwort, Sperre). Heute stehen dort nur `default`, `login-error`, `login-not-allowed`, `demo`. |
| V-8 | Verwalter | Minor | Den Einleitungstext von authentication.feature:4–6 «mit meinem Google- oder Microsoft-Konto» an das Konto mit Passwort anpassen. |
| V-9 | Verwalter | Minor | Der Begriff fehlt im Glossar: Die Szenarien sagen «lokales Konto», `UBIQUITOUS_LANGUAGE.md` kennt weder dieses Konto noch die Sperre. Ein Vorschlag steht unten (Issue `fachlich`, `entscheiden`). |

## Belege und Korrektur (Blocker/Major)

### R-1: Der Hinweis zu http ist unvollständig

- Geplanter Text: «Diese Verbindung ist nicht verschlüsselt: Ihr Passwort geht ungeschützt durchs Netz. …»
- Art. 8 Abs. 1 DSG: «Der Verantwortliche und der Auftragsbearbeiter gewährleisten durch geeignete technische und organisatorische Massnahmen eine dem Risiko angemessene Datensicherheit.»
- Art. 3 Abs. 2 Bst. c DSV: Es sind Massnahmen zu treffen, damit «unbefugte Personen bei der Bekanntgabe von Personendaten oder beim Transport von Datenträgern Personendaten nicht lesen, kopieren, verändern, löschen oder vernichten können (Transportkontrolle)».

Der Product Owner hat entschieden, dass http erlaubt bleibt. Der Hinweis ist damit die einzige Massnahme, die den Betreiber warnt. Er nennt aber nur das Passwort, obwohl jede Seite danach Mieterdaten unverschlüsselt überträgt und das Sitzungs-Cookie mitgelesen werden kann. Der Vermieter, der für diese Daten verantwortlich ist, unterschätzt so das Risiko.

Vorschlag:

> «Diese Verbindung ist nicht verschlüsselt: Ihr Passwort und alle Daten, auch die Ihrer Mieter, gehen ungeschützt durchs Netz. Lassen Sie Dwello mit HTTPS einrichten oder nutzen Sie es nur über ein VPN.»

### R-2: Die Datenschutzerklärung für «nur Konto mit Passwort»

- `src/routes/privacy/+page.svelte:109–113` setzt `data.providers` in `privacy_login_1` ein. Ohne Google ist die Liste leer, und der Text lautet «Die Anmeldung erfolgt über .».
- «Done means» verlangt: «privacy statement updated (no Google when local)».
- Art. 19 Abs. 2 DSG: Mitzuteilen sind die Informationen, die «erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist».
- Der E2E-Stack hat Google immer eingerichtet (`playwright.config.ts:32`). Das neue privacy-Szenario prüft also nur den Fall «beides».

Korrektur: Den Abschnitt aufteilen. Für den Fall «nur Passwort» braucht es einen DOM-Test auf unterer Ebene mit `No scenario: E2E hat immer Google eingerichtet`. Er prüft, dass weder «Google» noch der Satz zu `privacy_login_google` erscheint.

Vorschlag:

> - `privacy_login_local_1` (nur mit Konto): «Sie melden sich mit E-Mail-Adresse und Passwort an. Dwello speichert dafür Ihre E-Mail-Adresse und das Passwort nur in umgerechneter Form (Hash): Daraus lässt sich das Passwort nicht zurückrechnen, nur durch Ausprobieren erraten. Wählen Sie deshalb ein langes Passwort, das Sie sonst nirgends verwenden. Dazu speichert Dwello die Zahl der Fehlversuche bis zur nächsten erfolgreichen Anmeldung und eine allfällige Sperre, bis sie abläuft.» (deckt R-3 und R-4 ab)
> - `privacy_login_1` nur, wenn ein Anbieter eingerichtet ist. Mit Konto beginnt er mit «Auch über {providers} können Sie sich anmelden.» Der Satz «Passwörter sieht Dwello nie» bleibt dabei, aber eingeschränkt auf «Ihr Passwort beim Anbieter sieht Dwello nie.» Damit ist der Satz in beiden Fällen wahr, und es braucht keine Bedingung.
> - `privacy_login_log`: «… mit der Kennung des Kontos und, ausser bei der Abmeldung, der E-Mail-Adresse …», dazu der Satz aus R-5, falls Fehlversuche protokolliert werden.

### V-1: Fehlerzustand der Anmeldung mit Passwort

- `tests/e2e/CLAUDE.md:80`: «A state that only a failing request produces is reached by answering that one endpoint with an error status at the browser boundary».
- In «Done means» von #576 steht: «the failure states per `tests/e2e/CLAUDE.md`».
- Die Formularaktion des Passworts ist eine Anfrage, die der Browser selbst schickt. `FailRequests.to('/login', { '/<action>': '' })` kann sie also herstellen.

Vorschlag:

```
Szenario: Anmeldung mit Passwort fehlgeschlagen
  Angenommen ein lokales Konto ist eingerichtet
  Und die Anmeldung mit Passwort schlägt fehl
  Und ein Besucher hat die Anmeldeseite geöffnet
  Wenn der Besucher sich mit der E-Mail-Adresse und dem Passwort des Kontos anmeldet
  Dann ist der Besucher auf der Seite "Anmelden"
  Und sieht der Besucher den Hinweis "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut."
```

Diese Meldung darf weder ein falsches Passwort noch eine Sperre melden, und der Fehlversuch darf nicht zählen. Ein Test auf unterer Ebene sollte das festhalten.

### V-2: Anmeldeseite ohne jede Anmeldung

- `messages/de.json:133` `login_unavailable_text`: «Bitte hinterlegen Sie die OAuth-Zugangsdaten für Google oder Microsoft.»
- Entscheid in #576: «A local account with e-mail and password (Argon2) is the default for self-hosting». Bis #577 legt ein Befehl im Backend-Container das Konto an.

Nach der Installation ist das genau der Bildschirm, den ein Selbsthoster zuerst sieht. Der Text verweist auf den Weg, der nicht mehr der Standard ist.

Vorschlag:

> «Legen Sie ein Konto mit E-Mail-Adresse und Passwort an, wie in der Installationsanleitung beschrieben. Wer Google nutzen will, hinterlegt stattdessen die Zugangsdaten für Google.»

Dazu ein DOM-Test, weil der E2E-Stack immer Google eingerichtet hat. Diesen Text in alle vier Sprachen übernehmen.

## Wortlaut zu den Minors

- **V-4**, Hilfe beim Passwort: «Passwort vergessen? Der Betreiber Ihrer Dwello-Installation setzt es mit einem Befehl zurück. Betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung.»
- **V-4**, Sperre: «Nach mehreren Fehlversuchen ist die Anmeldung gesperrt bis {time} Uhr. Versuchen Sie es danach erneut, oder lassen Sie die Sperre vom Betreiber Ihrer Dwello-Installation aufheben.»

## Fehlende Begriffe (Issue `fachlich`, `entscheiden`)

- **Konto mit Passwort**: Zugang zu einer Dwello-Installation mit E-Mail-Adresse und Passwort. Der Betreiber legt es mit einem Befehl auf dem Server an und setzt es damit zurück (bis #577). Dwello speichert das Passwort nur als Argon2id-Hash. Nicht zu verwechseln mit der Anmeldung über einen Anbieter (Google). Code: neue Tabelle aus #576. Die Szenarien sagen dafür «lokales Konto». Entweder diesen Begriff aufnehmen oder die Szenarien angleichen.
- **Sperre (Anmeldung)**: Nach 5 Fehlversuchen ist die Anmeldung mit Passwort 15 Minuten gesperrt. Die Anmeldeseite nennt die Uhrzeit, bis zu der die Sperre gilt. Der Befehl hebt sie auf, eine erfolgreiche Anmeldung setzt die Zahl der Fehlversuche zurück.

## Nicht bestätigt

- Ob Fehlversuche und Sperren ins Protokoll des Servers gehen, mit welchen Feldern, und ob der Logger die IP-Adresse festhält (R-5). Nachgesehen in `src/lib/server/login-flow.ts:60–80` und `src/lib/server/error-handler.ts:202–211`: Heute protokolliert nur der OAuth-Weg. Den Weg mit Passwort gibt es noch nicht.
- Welchen Namen die Kopfzeile bei einem Konto mit Passwort zeigt, und ob Dwello dafür einen Namen speichert. Dann muss die Datenschutzerklärung ihn nennen. Weder #576 noch die Szenarien sagen etwas dazu.
- Ob die Anmeldung mit Passwort ein Cookie setzt (R-7). Nachgesehen in `src/lib/server/jwt-config.ts:66–79`.
- Dass die Anmeldung über `http://` mit `COOKIE_SECURE` funktioniert, ist Umsetzung und Installationsanleitung, nicht Fachprüfung. `cookieConfig.secure` folgt nur `COOKIE_SECURE`.
- Nicht prüfbar mit dem E2E-Stack und deshalb auf unterer Ebene: der Befehl zum Zurücksetzen (neues Passwort, alte Sitzungen enden, Sperre aufgehoben), der Wechsel zwischen lokal und Google ohne Datenverlust, der Hinweis zu http und der Eintrag «Anmeldung mit Passwort» im Protokoll (kein bestehendes Szenario prüft Anmeldungen unter «Einstellungen»). Der Plan sollte diese Tests mit Namen nennen.

Geprüft: Art. 19 Abs. 1–2 DSG und Art. 6 Abs. 3–4 DSG (Wortlaut Fedlex, SR 235.1, Stand 2025-07-07); Art. 8 DSG und Art. 3 DSV (SR 235.11, Stand 2025-12-01); Verantwortlicher für die Anmeldung ist der Betreiber (Glossar, Zeile 244–245); Meldung zum falschen Passwort (sagt, was geschah und was zu tun ist, Sie-Form, ss); Einleitungstext mit Konto; Protokoll-Eintrag «Anmeldung mit Passwort»; die Szenarien für Anmeldung, falsches Passwort und Sperre (das richtige Passwort wird während der Sperre abgelehnt) decken «Done means» bis auf V-1, V-3 und R-2 ab; Sperre 5 Fehlversuche/15 Minuten und das Risiko, dass jemand den Vermieter aussperrt, sind vom Product Owner entschieden.
