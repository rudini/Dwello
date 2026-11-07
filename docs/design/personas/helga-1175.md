# Helga – Kontoinhaber in den Einstellungen (#1175)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (auch 200 %), Maus.
Aufgabe: In «Einstellungen», Block «Konto», das Häkchen «Kontoinhaber ist der Absender» entfernen (das Konto gehört meinem Sohn) und prüfen, ob ich verstehe, was in jedes Feld gehört und was ich ausfüllen muss. Nicht gespeichert (globale Einstellung).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Block «Konto» | Der Hilfetext der IBAN sagt weiter «Mit einer IBAN braucht es Firmenname, PLZ und Ort», der Text beim Häkchen sagt «Mit einer IBAN braucht es dann Name, PLZ und Ort des Kontoinhabers». Ohne Häkchen weiss ich nicht, ob jetzt beides nötig ist (meine Adresse oben und die meines Sohnes) oder nur noch die des Sohnes. |
| P-2 | Minor | Einstellungen, Block «Konto» | Setze ich das Häkchen aus Versehen wieder, verschwinden die Felder. Entferne ich es erneut, sind Name, PLZ und Ort, die ich schon eingetippt hatte, leer. Es gibt keinen Hinweis darauf. |

## Beobachtungen

- Den Weg zu «Einstellungen» fand ich im Menü unter meinem Namen oben rechts. Bei 150 % gibt es oben keine Navigation mehr, nur das Menüsymbol und meinen Namen.
- Nach dem Entfernen des Häkchens erscheinen unter dem Zwischentitel «Kontoinhaber» vier Felder: «Name des Kontoinhabers», «Strasse und Hausnummer (optional)», «PLZ», «Ort». Was hineingehört, habe ich verstanden: Name und Adresse meines Sohnes. Das Beispiel «Anna Keller» zeigt, dass Vor- und Nachname gemeint sind.
- Pflichtfelder: Nur die Strasse ist mit «(optional)» bezeichnet. Dass die anderen drei nötig sind, habe ich aus dem Text beim Häkchen geschlossen («braucht es dann Name, PLZ und Ort des Kontoinhabers»). Ein Sternchen oder «Pflichtfeld» gibt es nicht. Mit dem Text ging es aber.
- Oben im Block «Absender» heisst dasselbe «Freiwillig.» im Hilfetext (Telefon, E-Mail), hier «(optional)» beim Feldnamen. Zwei Wörter für dasselbe. Ältere Leute kennen «freiwillig» besser als «optional».
- Es steht nicht, ob der Name genau so geschrieben sein muss wie bei der Bank. Das hätte ich gern gewusst, weil ich nicht weiss, ob mein Sohn das Konto mit zweitem Vornamen führt.
- Der Zwischentitel «Kontoinhaber» ist kaum grösser als die Feldnamen. Bei 150 % ist er trotzdem gut zu sehen. Die Felder «PLZ» und «Ort» heissen gleich wie die im Absender-Block, durch den Zwischentitel war für mich trotzdem klar, wohin sie gehören. (Technisch: Im Accessibility-Tree ist «Kontoinhaber» keine Überschrift, und es gibt zwei Textfelder mit dem Namen «PLZ» und zwei mit «Ort».)
- Bei 200 % ist alles gut lesbar und nichts muss seitlich gescrollt werden (gemessen: 0 px). Der Text beim Häkchen ist lang (fünf Zeilen bei 150 %), aber verständlich.
- Lasse ich das Namensfeld leer und gehe mit Tab weiter, kommt keine Meldung. Fehler würde man vermutlich erst beim Speichern sehen, und gespeichert habe ich nicht.
- Technisch, ausserhalb der Aufgabe: Die Felder «Telefon» und «E-Mail» haben `aria-required="true"`, obwohl im Text «Freiwillig» steht.

## Aufgabe geschafft: ja

Ich habe verstanden, was in jedes Feld gehört und welche ich ausfüllen muss. Unsicher blieb ich nur wegen des IBAN-Textes (P-1).

## Aufwand

Etwa 10 Minuten, 6 Schritte (Übersicht, Benutzermenü, Einstellungen, zum Block «Konto» scrollen, Häkchen entfernen, Felder lesen; dazu ein Test mit 200 % und mit erneutem Häkchen).

## Ablauf

- Einstellungen öffnen: Ich erwartete einen Link «Einstellungen» oben in der Leiste. Gesehen: Bei 150 % ist er im Menü unter meinem Namen (Vera Verwalter).
- Häkchen entfernen: Ich erwartete, dass dann nur noch die Angaben des Kontoinhabers verlangt werden. Gesehen: Der IBAN-Text darüber verlangt weiter «Firmenname, PLZ und Ort» (P-1).
- Häkchen wieder setzen und erneut entfernen: Ich erwartete, dass meine Eingaben (Name «Thomas Beispiel», PLZ 3011, Ort Bern) noch da sind. Gesehen: Die Felder waren leer (P-2).

## Vorschläge

- **P-1:** Einstellungen → Block «Konto» → «Kontoinhaber ist der Absender» abwählen → den Hilfetext der IBAN lesen. Hilfreich wäre, wenn der IBAN-Text sagt, was bei abgewähltem Häkchen gilt, etwa: «Mit einer IBAN braucht es Name, PLZ und Ort des Kontoinhabers.» Ein anderer Weg: Der Satz zu den Pflichtangaben steht nur an einer Stelle. Wenn der Absender (Firmenname, PLZ, Ort) trotzdem nötig bleibt, sollte das ausdrücklich dastehen («Der Absender bleibt nötig für den Kopf der Abrechnung»).
- **P-2:** Häkchen abwählen → Name, PLZ und Ort eintippen → Häkchen setzen → Häkchen wieder abwählen → die Felder sind leer. Hilfreich wäre, die Eingaben zu behalten, solange die Seite offen ist, oder einen Hinweis zu zeigen, dass sie beim Setzen des Häkchens verworfen werden.

## Nicht geprüft

- Speichern und die Fehlermeldungen beim Speichern mit leeren Pflichtfeldern: Laut Auftrag sollte ich nicht speichern, weil die Einstellungen für die ganze App gelten und eine andere Persona gleichzeitig dieselbe Seite benutzt.
- Wie der Kontoinhaber auf der QR-Rechnung oder im PDF erscheint: Dafür hätte ich speichern und eine Abrechnung erzeugen müssen.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/5d7f70d4-0be2-5903-a4e8-3a73471da3fb/scratchpad/helga-1175/` (02/03/04 = Block «Konto» bei 150 % vor und nach dem Abwählen, 05/06 = 200 %).
