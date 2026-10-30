# Dr. Weber – Slice 718c: Neuer Wiederherstellungscode

Persona: Dr. Weber, 52, liest alles, prüft Plausibilität. Desktop 1440 × 900, Maus. App auf http://localhost:3310, abgemeldet gestartet ohne Persona-Kit-Cookie, Anmeldung mit `weber@dwello.test`. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/weber-718c/`.

Auftrag: Ein früherer Mieter hat vielleicht mein Notfallblatt gesehen. Ich will vor dem Ersetzen verstehen, was mit den alten Sicherungen geschieht, wer sie wie lange lesen kann, wofür der neue Code gilt und was die 30 Minuten bedeuten. Danach den Code erstellen (einmal mit falschem Passwort), das neue Notfallblatt herunterladen und als Dokument für meine Akten prüfen, den Code bestätigen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Notfallblatt (PDF), Bestätigung | Das Blatt sagt «Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben», nennt diesen Tag aber nicht (es lässt sich nur vor der Bestätigung herunterladen). Auch die Bestätigung nennt kein Datum, und im «Protokoll» steht kein Eintrag. Zudem widerspricht «ab dem Tag» der Seite («gilt ab jetzt»): eine Sicherung, die am selben Tag vor der Bestätigung lief, ist noch mit dem alten Code verschlüsselt. Als Akte sagt mir das Blatt nicht, welche Sicherungen es öffnet. |
| P-2 | Minor | «Neuer Wiederherstellungscode», Einleitung | Für meinen Anlass (jemand hat das alte Blatt gesehen) beantwortet die Seite die Kernfrage nicht: Schützt mich der Wechsel? Sie sagt nur, wer das alte Blatt hat, kann die alten Sicherungen bis zu 12 Monate lesen. Sie sagt nicht, dass er dazu auch an die Sicherungsdateien kommen muss (das steht nur auf dem Notfallblatt), und nicht, ob und wie ich die alten Sicherungen früher löschen lassen kann, um das Fenster zu schliessen. |
| P-3 | Minor | Karte in «Einstellungen» / Seite | Die Karte nennt als Anlass «etwa wenn Sie das Notfallblatt verloren haben», die Seite verlangt dann «Bewahren Sie das alte Notfallblatt bis dahin auf». Für den genannten Anlass ist das unmöglich, und die Seite sagt nicht, was dann gilt: die alten Sicherungen kann ich selbst nicht mehr öffnen, der Finder schon. |
| P-4 | Minor | Notfallblatt (PDF) | «Ältere Sicherungen öffnet das Notfallblatt von vorher; geben Sie im Notfall beide Blätter weiter» – ohne Frist. Die Seite sagt, die letzte alte Sicherung ist nach höchstens 12 Monaten gelöscht. Auf dem Blatt fehlt, bis wann das alte Blatt nötig ist und welches Blatt (Datum) es ersetzt. Wer nur die Akte liest, bewahrt das alte Blatt unbegrenzt auf, also auch das Risiko. |
| P-5 | Minor | Schritt «Code anzeigen» / Notfallblatt | Die 30 Minuten haben keine Uhrzeit («bis 11:15»). Das heruntergeladene Blatt eines nie bestätigten, verfallenen Codes sieht genau gleich aus wie ein gültiges. Wer ausdruckt, die Bestätigung vergisst und das alte Blatt wegwirft, hat ein wertloses Blatt in den Akten. |
| P-6 | Minor | Notfallblatt-Link nach der Bestätigung | Ein erneuter Aufruf des Download-Links (zweiter Tab, Lesezeichen) nach der Bestätigung führt ohne ein Wort auf die «Übersicht». Ich hätte gedacht, etwas sei schiefgegangen; die Seite sagt zwar vorher, dass das Blatt dann nicht mehr herunterladbar ist, der Link selbst erklärt es nicht. |

## Beobachtungen

- Falsches Passwort: klare Meldung «Das Passwort stimmt nicht. Geben Sie das Passwort ein, mit dem Sie sich anmelden.», der Fokus geht auf die Meldung. Das falsche Passwort bleibt (maskiert) im Feld stehen; ich muss es selbst löschen.
- Der Hinweis «Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle» stimmt: `7duf 5s9a t353 dgt3 mxxd h98p` wurde angenommen. Ein Tippfehler im letzten Zeichen wurde mit verständlicher Meldung abgelehnt.
- Im Schritt mit dem angezeigten Code steht oben weiter «Die Sicherungen von vorher …». Vor der Bestätigung ist «vorher» doppeldeutig (vor dem Erstellen oder vor dem Bestätigen?).
- Die Seite sagt nicht, ob der Wiederherstellungscode ausser für die Sicherungen noch etwas kann (etwa Zugang zu Dwello). Für meine Risikobeurteilung wäre ein Satz «Der Code öffnet nur Sicherungsdateien, er meldet niemanden an» beruhigend, falls das so ist.
- Nach der Bestätigung steht sofort wieder das Formular «Neuen Code erstellen» unter der Erfolgsmeldung; ein Neuladen von `?confirmed` zeigt die Erfolgsmeldung erneut.
- Das «Protokoll» verzeichnet Anmeldung und KI-Wahl, aber nicht den Wechsel des Wiederherstellungscodes – für einen sicherheitsrelevanten Vorgang würde ich einen Eintrag erwarten.
- Die «Hilfe» enthält nichts zu Wiederherstellungscode, Notfallblatt oder Sicherung.
- Notfallblatt: eine A4-Seite, klar gegliedert, Code gross gedruckt, Ablageort der Sicherungen und Vorgehen im Notfall genannt; «Ihre Dwello-Installation: http://localhost:3310» ist der Testaufbau. Das PDF ist nicht getaggt.
- Seite und Blatt sind sonst konsistent: beide empfehlen getrennte Aufbewahrung vom Computer; der Code auf Blatt und Bildschirm ist identisch.

## Aufgabe geschafft

ja

## Aufwand

Etwa 6 Minuten, 14 Schritte (Anmelden, Einstellungen, Karte, falsches Passwort, richtiges Passwort, Neuladen, Download, falscher Code, Bestätigen, Nachkontrollen Link/Protokoll/Hilfe).

## Ablauf

- Karte in «Einstellungen»: erwartet, dass auch «jemand hat das Blatt gesehen» als Anlass genannt ist; gesehen nur «verloren» (P-3).
- Seite, Einleitung: erwartet eine Antwort, ob der Wechsel mich gegenüber dem früheren Mieter schützt und was ich mit den alten Sicherungen tun kann; gesehen nur, dass er sie bis zu 12 Monate lesen kann (P-2).
- Code angezeigt: erwartet eine Uhrzeit, bis wann ich bestätigen muss; gesehen nur «innerhalb von 30 Minuten» (P-5).
- Notfallblatt: erwartet das Datum, ab dem der Code gilt, und einen Verweis auf das ersetzte Blatt; gesehen «ab dem Tag, an dem Sie ihn bestätigt haben» ohne Datum und «Notfallblatt von vorher» ohne Frist (P-1, P-4).
- Bestätigung: erwartet Datum und Uhrzeit der Bestätigung zum Notieren auf dem Blatt; gesehen «gilt ab jetzt» ohne Datum, kein Protokolleintrag (P-1).
- Download-Link nach Bestätigung: erwartet eine Erklärung; gelandet wortlos auf der «Übersicht» (P-6).

## Vorschläge

- **P-1:** Code erstellen, Notfallblatt herunterladen, bestätigen. Auf dem Blatt fehlt das Gültigkeitsdatum, in der Bestätigung und im Protokoll ebenfalls. Hilfe: auf dem Blatt ein Feld «Bestätigt am: ________ (bitte eintragen)» und in der Bestätigungsmeldung Datum und Uhrzeit nennen («Der neue Code gilt seit 30.10.2026, 11:45»); den Satz präzisieren auf «für die Sicherungen nach der Bestätigung»; einen Protokolleintrag schreiben.
- **P-2:** Einstellungen › Neuer Wiederherstellungscode lesen. Hilfe: ein Satz, dass zum Lesen auch die Sicherungsdateien nötig sind (Server, Kopie der betreuenden Person), und dass man die betreuende Person bitten kann, die alten Sicherungen früher zu löschen, wenn jemand Unbefugtes das alte Blatt gesehen hat – mit dem ehrlichen Preis (dann gibt es keine ältere Sicherung mehr).
- **P-3:** Karte lesen, dann die Seite. Hilfe: auf der Seite einen Satz für den Fall «Notfallblatt verloren»: die alten Sicherungen lassen sich ohne das alte Blatt nicht mehr öffnen; ab der Bestätigung sind die neuen geschützt.
- **P-4:** Notfallblatt herunterladen und lesen. Hilfe: «Ältere Sicherungen öffnet das Notfallblatt vom [Datum des alten Codes]; Sie brauchen es bis [Datum + 12 Monate].»
- **P-5:** Neuen Code erstellen und den Schritt mit dem Code lesen. Hilfe: «Bestätigen Sie bis 11:15 Uhr»; auf dem Blatt «Gilt erst, wenn Sie ihn in Dwello bestätigt haben» deutlich oben.
- **P-6:** Code bestätigen, dann `/backup/sheet` erneut aufrufen. Hilfe: auf «Neuer Wiederherstellungscode» zurückführen mit einer Meldung «Das Notfallblatt lässt sich nach der Bestätigung nicht mehr herunterladen. Haben Sie es nicht, erstellen Sie einen neuen Code.»

## Nicht geprüft

- Den Ablauf der 30 Minuten (Verfall des Codes und dass der alte weiter gilt): hätte 30 Minuten Warten verlangt; nicht abgewartet.
- Ob Dwello «gleich eine erste Sicherung» mit dem neuen Code erstellt und die alten nach 12 Monaten löscht: die Oberfläche zeigt keine Liste der Sicherungen; ich habe nur Seite, Protokoll und Hilfe angesehen.
- Ob das alte Notfallblatt die alten Sicherungen wirklich öffnet: ich habe kein altes Blatt und keinen Zugriff auf den Ordner «backups» als Benutzer.

## Triage (caller)

- P-1 to P-6 (Minor): stay. P-1 and P-4 are wording the fach-reviewer decided in 718c-1 V-5 (the sheet is made before the confirmation, so it cannot name its date); P-3 and P-5 touch the same texts.
