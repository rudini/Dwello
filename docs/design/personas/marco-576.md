# Marco – Slice 576: Anmelden mit E-Mail-Adresse und Passwort (Handy)

Persona: Marco, 38, Handy 390 × 844, Touch. Abgemeldet gestartet (Session-Cookie des Persona-Kits gelöscht), App unter http://localhost:3300. Nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Anmelden (leer abgeschickt) | Tippe ich ohne Eingaben auf «Anmelden», kommt nur «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.» Die Meldung sagt nicht, was fehlt (E-Mail-Adresse und Passwort eingeben). Erneut versuchen bringt mir so nichts. |
| P-2 | Minor | Anmelden (falsches Passwort) | Nach dem falschen Passwort bleibt die Seite unten beim Knopf stehen. Die Fehlermeldung steht über den Feldern und ist nur halb im Bild; der Fokus liegt auf der Seite statt auf einem Feld. Die Felder sind nicht als fehlerhaft markiert. |
| P-3 | Nit | Anmelden (falsches Passwort) | Das falsche Passwort bleibt als Punkte im Feld stehen. Auf dem Handy tippe ich sonst leicht dahinter weiter und bekomme den Fehler gleich nochmals. |

## Beobachtungen

- Die Felder für E-Mail-Adresse und Passwort sind 292 × 48 px, die Knöpfe «Anmelden» und «Mit Google anmelden» ebenfalls 292 × 48 px. Mit dem Daumen gut zu treffen.
- Das E-Mail-Feld hat `type=email` und `autocomplete=username`, das Passwortfeld hat `type=password` und `autocomplete=current-password`. Das Handy zeigt also die E-Mail-Tastatur mit «@», und der Passwortmanager kann ausfüllen.
- Nichts scrollt seitwärts: Die Seite ist vor dem Anmelden, mit der Fehlermeldung und auf der Übersicht danach 390 px breit.
- Die Meldung zum falschen Passwort ist klar: «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.» Sie hat die Rolle `alert`, und die E-Mail-Adresse bleibt stehen.
- Der Hilfetext zu «Passwort vergessen?» steht zwischen der Bezeichnung «Passwort» und dem Feld und ist vier Zeilen lang. Das Feld rutscht dadurch auf dem Startbildschirm weit nach unten: Der Knopf «Anmelden» ist ohne Scrollen gerade noch sichtbar (bei etwa 795–841 px von 844 px). Den Satz «Der Betreiber Ihrer Dwello-Installation setzt es mit einem Befehl zurück» verstehe ich als Vermieter nicht: Wer ist der Betreiber, bin das ich?
- Der Begriff «Konto mit Passwort» aus der Anforderung kommt auf der Seite nicht vor. Es gibt nur «E-Mail-Adresse», «Passwort» und «Mit Google anmelden». Für mich ist das klar genug.
- Mit offener Bildschirmtastatur (Höhe auf 500 px simuliert, Passwortfeld angetippt) bleibt der Knopf «Anmelden» sichtbar (290–338 px).
- Nach dem Anmelden lande ich auf `/dashboard` («Übersicht»), obwohl die Adresse `redirectTo=/` enthielt. Das ist für mich der richtige Ort.
- Cookies nach dem Anmelden: `dwello_session` (HttpOnly, SameSite=Lax), `dwello_xsrf` und `PARAGLIDE_LOCALE`. Abgeschickt wurde jedes Mal per POST an `/login?/password`, also an die eigene App. Ein anderer Server wurde dabei nicht aufgerufen.
- In der Fusszeile steht «Version unbekannt». Das gilt für den Persona-Build.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 s reine Bedienzeit. Ich habe einmal leer abgeschickt, einmal mit falschem Passwort (Dwello-Test-2025) und einmal mit richtigem Passwort: 3 Absendungen, 1 falsches Passwort. Zusammen etwa 8 Taps und zwei Eingaben.

## Ablauf

1. **`/` geöffnet, abgemeldet.** Erwartet: Anmeldeseite. Gesehen: Weiterleitung auf `/login?redirectTo=%2F`. Ich sehe ein Haus-Bild, «Anmelden», den Erklärsatz, die Felder E-Mail-Adresse und Passwort, «Anmelden» und darunter «Mit Google anmelden» (Screenshot 01-start.png). Die Bezeichnungen stehen über den Feldern.
2. **Ohne Eingabe auf «Anmelden» getippt.** Erwartet: ein Hinweis, dass E-Mail-Adresse und Passwort fehlen. Gesehen: ein roter Kasten mit «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.» (02-leer.png). Der Browser hat nicht selbst geprüft, die Felder sind nicht als Pflichtfeld markiert. → P-1
3. **E-Mail-Adresse angetippt, marco@dwello.test eingegeben, dann das Passwortfeld angetippt und ein falsches Passwort eingegeben, «Anmelden» angetippt.** Erwartet: eine klare Meldung, die Felder bleiben ausgefüllt. Gesehen: Die Meldung ist klar, die E-Mail-Adresse bleibt stehen. Die Seite bleibt aber unten, die Meldung ist oben angeschnitten (03b-falsch-viewport.png), der Fokus liegt nicht in einem Feld, und das falsche Passwort steht noch im Feld. → P-2, P-3
4. **Passwortfeld geleert, Dwello-Test-2026 eingegeben, «Anmelden» angetippt.** Erwartet: Übersicht. Gesehen: `/dashboard` mit «Übersicht» und «Als Nächstes zu tun» (04-angemeldet.png). Die Seite ist 390 px breit.

## Verwirrung

- «Betreiber Ihrer Dwello-Installation» und «Installationsanleitung»: Als Vermieter weiss ich nicht, ob ich das selbst bin oder wen ich fragen soll.
- «die bei der Einrichtung festgelegt wurden»: Ich weiss nicht mehr, welche Einrichtung gemeint ist.
- «Die Anmeldung ist fehlgeschlagen» beim leeren Absenden: Ich weiss nicht, was ich falsch gemacht habe.

## Fehlerrisiken

- Das falsche Passwort bleibt im Feld stehen. Wer dahinter weitertippt, scheitert erneut (P-3).
- Nach einem Fehler wird nicht zur Meldung gescrollt und der Fokus nicht gesetzt. Auf dem Handy kann ich die Meldung übersehen und denke, es sei nichts passiert (P-2).

## Vorschläge

- **P-1:** So zeigen Sie es: Seite `/login` auf dem Handy öffnen, ohne Eingaben auf «Anmelden» tippen. Das würde helfen: beim Feld stehen lassen, was fehlt, z. B. «Geben Sie Ihre E-Mail-Adresse ein.» / «Geben Sie Ihr Passwort ein.», oder die Felder als Pflichtfelder markieren.
- **P-2:** So zeigen Sie es: E-Mail-Adresse und ein falsches Passwort eingeben, «Anmelden» antippen. Die Meldung steht oben angeschnitten, der Fokus liegt auf der Seite. Das würde helfen: nach dem Fehler die Meldung ins Bild scrollen und den Fokus ins Passwortfeld setzen, das Feld dabei als fehlerhaft markieren (`aria-invalid`).
- **P-3:** So zeigen Sie es: Gleich wie bei P-2. Das falsche Passwort steht danach noch im Feld. Das würde helfen: das Passwortfeld nach einem Fehler leeren, die E-Mail-Adresse stehen lassen.

## Nicht geprüft

- Echte Handy-Tastatur: Headless-Chromium zeigt keine Bildschirmtastatur. Die Tastaturart habe ich am Feldtyp `email` abgelesen, die offene Tastatur nur mit einem kleineren Viewport simuliert.
- «Mit Google anmelden»: nicht angetippt, das gehörte nicht zur Aufgabe und braucht ein Google-Konto.
- Mehr als ein falsches Passwort: Ich habe nur eines probiert, gemäss Aufgabe höchstens drei. Ob nach mehreren Fehlversuchen gesperrt wird, weiss ich daher nicht.
- Andere Sprachen und Dunkelmodus: nicht Teil der Aufgabe.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-576/` (01-start.png, 02-leer.png, 03-falsch.png, 03b-falsch-viewport.png, 04-angemeldet.png, 05-tastatur-offen.png, s1–s3.mjs).
