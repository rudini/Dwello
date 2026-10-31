# Helga – Slice 718c: Neuer Wiederherstellungscode

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Seite auch bei 200 %), Maus. Angemeldet ohne Persona-Kit-Cookie mit `helga@dwello.test`. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-718c/`.

Aufgabe: Ich finde mein Notfallblatt nicht mehr. In Dwello herausfinden, was zu tun ist, einen neuen Code erstellen (zuerst einmal ein falsches Passwort), das neue Notfallblatt herunterladen und lesen, den neuen Code bestätigen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Wiederherstellungscode, Schritt 2 (Code angezeigt) und Notfallblatt | Dass der neue Code erst nach «Neuen Code bestätigen» gilt und bis dahin weiter mit dem alten (bei mir verlorenen) Code gesichert wird, steht nirgends vor der Bestätigung. Das Notfallblatt sagt nur «gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben», ohne dieses Datum. Höre ich nach dem Ausdrucken auf, liegt ein Blatt im Ordner, das nichts öffnet, und Dwello erinnert mich nirgends daran (weder in «Einstellungen» noch in der Übersicht). So kann ich den Zugang zu meinen Sicherungen verlieren, ohne es zu merken. |
| P-2 | Minor | Neuer Wiederherstellungscode, Schritt 1 | Der Text oben spricht für Leute, die das alte Blatt noch haben («Bewahren Sie das alte Notfallblatt bis dahin auf»). Mein Fall, wie auf der Karte in «Einstellungen» genannt, ist aber, dass ich es *verloren* habe. Was das für mich heisst, sagt mir niemand: Die bisherigen Sicherungen kann ich selbst nicht mehr öffnen, und ein Finder des Blattes kann sie noch bis zu 12 Monate lesen. Erst nach längerem Nachdenken habe ich das aus «Wer das alte Notfallblatt hat, kann diese Sicherungen … lesen» herausgelesen. Auch «Sicherungen von vorher» steht da, bevor es überhaupt einen neuen Code gibt («vorher» als was?). |
| P-3 | Minor | Neuer Wiederherstellungscode, nach dem Bestätigen | Nach der grünen Meldung «Der neue Wiederherstellungscode gilt ab jetzt …» steht wieder das Passwortfeld mit dem Hauptknopf «Neuen Code erstellen» da, und es gibt keinen Weg zurück zu «Einstellungen» oder zur Übersicht. Ich dachte zuerst, ich müsse noch einmal etwas tun. Ein weiterer Klick würde einen dritten Code machen, und das frisch gedruckte Blatt wäre bald wieder «das alte». |
| P-4 | Minor | Einstellungen, Karte «Neuer Wiederherstellungscode» (150 %) | Titel und Beschreibung ragen rechts etwa 19 px über den Rand der Karte hinaus (Karte bis x≈350, Text bis x≈369 CSS-px). Das sieht kaputt aus. Bei 200 % ist es in Ordnung (eine Spalte). |
| P-5 | Minor | Neuer Wiederherstellungscode, falsches Passwort | Nach «Das Passwort stimmt nicht …» bleibt das falsche Passwort als Punkte im Feld stehen. Ich sehe nicht, was ich getippt habe, und muss es erst selbst löschen. Wenn ich einfach weitertippe, hängt mein richtiges Passwort hinten an und ist wieder falsch. |

## Beobachtungen

- Den Weg gefunden habe ich gut: Benutzermenü › «Einstellungen» › Abschnitt «Sicherung». Die Beschreibung «etwa wenn Sie das Notfallblatt verloren haben» trifft genau meinen Fall.
- Das Symbol der Karte ist ein Zahnrad, dasselbe wie bei «Zugangsschlüssel für KI-Programme». Ein Schlüssel oder Blatt würde mir mehr sagen.
- Die Seite «Neuer Wiederherstellungscode» hat keinen Link zurück zu «Einstellungen». Ich musste über das Menü gehen.
- Das falsche Passwort: Die rote Meldung ist klar und sagt, was zu tun ist. Das gefällt mir.
- Der Code steht gross und gut lesbar da. Der Hinweis «Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle» stimmt: Klein und mit Leerzeichen getippt wurde der Code angenommen.
- Ein Tippfehler im Code ergibt eine klare rote Meldung; der Code bleibt angezeigt, und ich kann neu tippen.
- Lade ich die Seite neu, bevor ich bestätige, ist derselbe Code wieder da. Gut, wenn ich zuerst zum Drucker muss.
- Notfallblatt (PDF, eine Seite, «Notfallblatt-Dwello.pdf»): Code gross, «Code erstellt am 30.10.2026», «Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter», Adresse der Installation, wo die Sicherungen liegen, was im Notfall zu tun ist, Link zur Installationsanleitung. Der Fliesstext ist für mich auf Papier eher klein. Dass ich das alte Blatt nicht mehr habe, berücksichtigt das Blatt nicht («beide Blätter weiter»).
- Nach dem Bestätigen leitet die Adresse des Notfallblatts kommentarlos auf die Übersicht um (z. B. über die Browser-Chronik). Eine kurze Erklärung wäre freundlicher.
- Erst die grüne Meldung nach dem Bestätigen sagt, dass Dwello «gleich eine erste Sicherung» mit dem neuen Code macht. Das hat mich beruhigt; vorher hätte ich es gern gewusst (siehe P-1).
- Bei 200 % hat die Seite in allen Schritten keine waagrechte Bildlaufleiste, alles gut lesbar.

## Aufgabe geschafft: ja

Neuer Code erstellt, Blatt heruntergeladen und gelesen, Code bestätigt (grüne Meldung). Was das alte und das neue Blatt jeweils können, habe ich am Ende verstanden, aber erst nach dem Lesen des PDFs und der Erfolgsmeldung, nicht aus der Seite vorher (P-1, P-2).

## Aufwand

Rund 20 Minuten, etwa 12 Schritte (Anmelden, Menü, Einstellungen, Karte, falsches Passwort, richtiges Passwort, PDF herunterladen und lesen, Tippfehler im Code, Code bestätigen, Prüfung bei 200 %).

## Ablauf

- Einstellungen, Karte im Abschnitt «Sicherung» (150 %): erwartet war eine ordentliche Karte wie die anderen. Gesehen: Titel und Beschreibung laufen rechts über den Kartenrand (P-4).
- Seite öffnen: erwartet war «Sie haben Ihr Blatt verloren? So geht es weiter». Gesehen: ein Text über «Sicherungen von vorher» und das Aufbewahren des alten Blattes, das ich nicht mehr habe (P-2).
- Falsches Passwort: erwartet war ein leeres Feld zum neu Eingeben. Gesehen: klare Fehlermeldung, aber das falsche Passwort steht noch im Feld (P-5).
- Code angezeigt: erwartet war ein Satz, ob der Code schon gilt. Gesehen wurde nur, dass er nach dem Bestätigen nicht mehr angezeigt wird; ob bis dahin noch mit dem alten Code gesichert wird, stand nirgends (P-1).
- Notfallblatt: erwartet war das Datum, ab dem es gilt. Gesehen: nur das Erstelldatum und «ab dem Tag, an dem Sie ihn in Dwello bestätigt haben» (P-1).
- Nach dem Bestätigen: erwartet war «Fertig» mit einem Weg zurück. Gesehen: grüne Meldung, darunter wieder Passwortfeld und «Neuen Code erstellen» (P-3).
- Zum Prüfen von P-1 habe ich danach noch einmal einen Code erstellt und *nicht* bestätigt: weder «Einstellungen» noch die Übersicht zeigen einen Hinweis auf den offenen Code.

## Vorschläge

- **P-1:** Anmelden, Einstellungen › «Neuer Wiederherstellungscode», Passwort eingeben, «Neuen Code erstellen», PDF herunterladen, Seite verlassen; danach Einstellungen und Übersicht ansehen. Hilfreich wäre im Schritt 2 ein Satz wie «Bis Sie bestätigen, sichert Dwello weiter mit dem alten Code; das neue Blatt gilt erst nach dem Bestätigen». Dazu gehört ein Hinweis in Einstellungen oder in der Übersicht, solange ein erstellter Code nicht bestätigt ist. Ausserdem sollte das Notfallblatt das Bestätigungsdatum tragen oder den Satz zum Bestätigen auffälliger machen.
- **P-2:** Einstellungen › «Neuer Wiederherstellungscode» öffnen und den Text oben lesen. Helfen würden zwei kurze Fälle: «Haben Sie das alte Blatt noch: aufbewahren bis …» und «Haben Sie es verloren: Die bisherigen Sicherungen lassen sich ohne das alte Blatt nicht mehr öffnen; wer es findet, kann sie bis zu 12 Monate lesen. Ab der ersten Sicherung mit dem neuen Code sind Ihre Daten wieder geschützt.» Statt «von vorher» wäre «bisherigen» klarer.
- **P-3:** Code bestätigen. Nach der Erfolgsmeldung sollte das Passwortformular verschwinden oder nachrangig sein, und ein Knopf «Zurück zu den Einstellungen» sollte erscheinen.
- **P-4:** Bei 1440 × 900 und 150 % Zoom die Einstellungen öffnen, Abschnitt «Sicherung». Der Text sollte in der Karte umbrechen, wie bei «Zugangsschlüssel für KI-Programme».
- **P-5:** Falsches Passwort eingeben und «Neuen Code erstellen» klicken. Das Feld sollte nach der Fehlermeldung leer sein.

## Nicht geprüft

- Ob sich Sicherungen tatsächlich mit dem alten oder dem neuen Code öffnen lassen: Das geht nur auf dem Server, nicht als Benutzerin in Dwello.
- Wie das alte Notfallblatt aussah: Ich habe es nicht (so die Aufgabe), daher konnte ich es nicht mit dem neuen vergleichen.
- Ob ein erstellter, nicht bestätigter Code nach einer neuen Anmeldung noch angezeigt wird. Ich habe nur das Neuladen in derselben Sitzung geprüft (der Code blieb). Hinweis: Am Ende meines Laufs ist für `helga@dwello.test` ein zweiter Code erstellt und **nicht** bestätigt (zum Prüfen von P-1); gültig ist der bestätigte Code vom ersten Durchgang.
- Ein ausgedrucktes Blatt auf Papier: Ich habe das PDF als Text und als Bild bei 60 dpi gelesen.

## Triage (caller)

- P-1 (Major): fixed with fach review 718c-2 V-1: the page now says «Bestätigen Sie den neuen Code innerhalb von 30 Minuten, sonst verfällt er und der bisherige Code gilt weiter.», and a late confirmation says the code expired.
- P-4: fixed (the card text wraps).
- P-2, P-3, P-5: stay as Minors.
