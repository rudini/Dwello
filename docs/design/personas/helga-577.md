# Helga, 68: «Dwello einrichten» (Issue #577)

Frische Installation http://localhost:3321 ohne Konto, Desktop 1440 × 900 bei 150 % Zoom, Maus. Ich habe abgemeldet begonnen (Cookies gelöscht). Skripte und Bildschirmfotos liegen in `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-577/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dwello einrichten, nach einem Fehler | Die Fehlermeldung steht nur als roter Kasten über dem Formular. Das betroffene Feld (Passwort) ist weder markiert noch hat es die Meldung bei sich (kein roter Rahmen, kein `aria-invalid`, kein Text am Feld). Ich muss selbst herausfinden, welches Feld gemeint ist. |
| P-2 | Minor | Dwello einrichten, nach einem Fehler | Nach jedem Fehler sind beide Passwortfelder leer, Code und E-Mail-Adresse bleiben stehen. Die Meldung sagt das nicht. Bei der Meldung «zu kurz» steht nicht, dass ich das Passwort in beiden Feldern neu eingeben muss. |
| P-3 | Minor | Dwello einrichten, Hilfetext Einrichtungscode | Der Befehl «docker logs dwello-backend» steht mitten im Satz und ist nicht als Befehl hervorgehoben. Bei 150 % bricht er am Bindestrich um («dwello-» / «backend»). Wer ihn abtippt wie ich, setzt dort leicht ein Leerzeichen oder lässt den Bindestrich weg. |
| P-4 | Nit | Übersicht nach dem Einrichten | Nach dem Einrichten lande ich direkt auf der Übersicht. Es gibt keinen Satz wie «Dwello ist eingerichtet, Sie sind angemeldet». Dass es geklappt hat, sehe ich nur an meiner E-Mail-Adresse oben rechts im Benutzermenü. |

## Beobachtungen

- Die Seite heisst «Dwello einrichten», der Knopf auch. Der Einleitungssatz «Legen Sie das Konto mit Passwort an, mit dem Sie sich bei Dwello anmelden. Danach sind Sie angemeldet.» ist kurz und verständlich.
- Die Bezeichnungen stehen über den Feldern und sind gross genug. Die Felder und der Knopf sind bei 150 % gut zu treffen. Es gibt nichts, was seitwärts scrollt.
- Der Hilfetext beim Passwort («Mindestens 8 Zeichen, am besten ein langes Passwort, das Sie sonst nirgends verwenden.») sagt schon vor dem ersten Versuch, was gilt. Die Meldung «zu kurz» wiederholt das. Gut.
- Beim Einrichtungscode ist mir «Protokoll des Servers» fremd, aber mein Neffe hatte genau das gesagt, deshalb habe ich es gefunden. Es fehlt ein Hinweis, wie der Code aussieht (zum Beispiel «8 Zeichen mit Bindestrich, wie Y5Q3-9SGA») und ob Gross- und Kleinschreibung zählt.
- Die E-Mail-Adresse hat keinen Hilfetext. Ich wusste nicht, ob Dwello mir daran Mails schickt oder ob sie nur zum Anmelden dient.
- Die Logzeile war gut lesbar: «[setup] Einrichtungscode: Y5Q3-9SGA (Dwello einrichten: die Adresse von Dwello im Browser öffnen)».
- Nach dem Einrichten führt `/setup` angemeldet zur Übersicht und abgemeldet zur Anmeldeseite. Man kann die Einrichtung also nicht ein zweites Mal machen. (Mein zweites Browserfenster hatte keine Sprache eingestellt, deshalb war die Anmeldeseite auf Englisch. Das kam von meinem Test, nicht von Dwello.)
- Die Seite hat nur mit localhost:3321 gesprochen. Nach dem Einrichten gibt es die Cookies `dwello_session` (HTTPOnly), `dwello_xsrf` und `PARAGLIDE_LOCALE`.
- Zum Testwerkzeug: Das Sitzungs-Cookie des persona-kit gilt für den ganzen Host localhost und nicht nur für Port 3300. Darum zeigte mein allererster Aufruf (noch mit diesem Cookie) auf der frischen Installation die Übersicht als «Vera Verwalter» statt der Einrichtung. Erst ohne Cookies kam «Dwello einrichten». Das ist kein Befund an Dwello, aber wer das Werkzeug benutzt, sollte es wissen.
- In der Fusszeile steht «Version unbekannt». Auf der Übersicht steht «Das KI-Modell wird geladen: 40 %». Das kommt vom Stand-in.

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten, 3 Abschickversuche (zu kurz, ungleich, richtig). Insgesamt rund 15 Schritte (Seite öffnen, Log lesen, 4 Felder × 3 Versuche, dabei Passwörter zweimal neu eingeben).

## Ablauf

1. Ich öffne http://localhost:3321 abgemeldet. Erwartet habe ich eine Seite, die mir sagt, was ich tun soll. Gesehen habe ich eine Weiterleitung auf `/setup` mit dem Titel «Dwello einrichten» und vier Feldern: Einrichtungscode (mit Hilfetext zum Server-Protokoll), E-Mail-Adresse, Passwort (mit Hilfetext zu den 8 Zeichen) und Passwort wiederholen. Darunter der Knopf «Dwello einrichten» und Hinweise auf die Nutzungsbedingungen und die Datenschutzerklärung (Bild `02-start-signedout.png`).
2. Die Seite sagt, der Code steht im Log, also schaue ich nach und finde Y5Q3-9SGA. Erwartet hatte ich einen Code, gesehen habe ich genau eine klare Zeile.
3. Erster Versuch mit dem Code, helga@dwello.test und dem Passwort «kurz» in beiden Feldern. Erwartet habe ich eine Meldung, dass das Passwort zu kurz ist. Gesehen habe ich oben einen roten Kasten mit Symbol: «Das Passwort ist zu kurz. Wählen Sie eines mit mindestens 8 Zeichen, am besten ein langes, das Sie sonst nirgends verwenden.» Der Fokus liegt auf diesem Kasten. Code und E-Mail-Adresse sind noch da, beide Passwortfelder sind leer, und am Feld selbst ist nichts markiert (Bild `03-kurz.png`, siehe P-1, P-2).
4. Zweiter Versuch mit «Rosengarten1957» und «Rosengarten1958». Erwartet habe ich die Meldung, dass die Passwörter verschieden sind. Gesehen habe ich: «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.» Die Meldung ist klar und sagt, was zu tun ist. Wieder sind beide Passwortfelder leer (Bild `04-ungleich.png`).
5. Dritter Versuch mit dem gleichen langen Passwort in beiden Feldern. Erwartet habe ich, danach angemeldet zu sein. Gesehen habe ich die Übersicht mit «Erstes Gebäude erfassen» als nächstem Schritt. Im Benutzermenü steht helga@dwello.test mit «Abmelden» (Bild `05-nach-einrichten.png`). Eine Bestätigung fehlt (P-4).
6. Danach habe ich `/setup` nochmals aufgerufen. Angemeldet kam ich auf die Übersicht, abgemeldet auf die Anmeldeseite.

## Verwirrung

- «Einrichtungscode»: Das Wort verstehe ich. Wo ich ihn finde, verstehe ich nur dank meinem Neffen («Protokoll des Servers», «docker logs …»). Allein hätte ich nicht gewusst, was ein Server-Protokoll ist und wo ich den Befehl eingeben soll.
- «Es gilt der zuletzt angezeigte Code»: Das deutet an, dass es mehrere Codes geben kann. Warum, wird nicht gesagt. Ich hatte nur einen.
- Nach dem Fehler habe ich mich kurz gefragt, ob mein Passwort verloren ist oder ob ich etwas falsch gelöscht habe, weil die Felder plötzlich leer waren.

## Fehlerrisiken

- Den Befehl falsch abtippen, wegen des Umbruchs am Bindestrich (P-3).
- Nach der Meldung nur das zweite Passwortfeld neu ausfüllen, weil man nicht merkt, dass beide geleert wurden (P-2). Dann folgt gleich die nächste Fehlermeldung.
- Den Code falsch abtippen (0/O, 5/S) und nach wenigen Versuchen gesperrt sein. Das habe ich nicht ausprobiert, siehe «Nicht geprüft».

## Vorschläge

- **P-1:** `/setup` öffnen, ein Passwort «kurz» zweimal eingeben, abschicken. Dann steht nur oben der rote Kasten. Hilfreich wäre die Meldung zusätzlich direkt beim Feld Passwort (bzw. bei «Passwort wiederholen», wenn die Passwörter ungleich sind), mit markiertem Feld und `aria-invalid`.
- **P-2:** wie P-1. Danach sind beide Passwortfelder leer. Hilfreich wäre ein Satz in der Meldung, etwa «Geben Sie das Passwort in beiden Feldern neu ein.», oder den Fokus gleich ins Feld Passwort setzen.
- **P-3:** `/setup` bei 150 % ansehen: Der Befehl bricht als «dwello-» / «backend» um. Hilfreich wäre der Befehl auf einer eigenen Zeile, in Schreibmaschinenschrift und ohne Umbruch, vielleicht mit einem Knopf «Befehl kopieren».
- **P-4:** Dwello richtig einrichten. Man landet ohne Rückmeldung auf der Übersicht. Hilfreich wäre ein kurzer Hinweis oben auf der Übersicht: «Dwello ist eingerichtet. Sie sind als helga@dwello.test angemeldet.»

## Nicht geprüft

- Einen falschen Einrichtungscode habe ich nicht eingegeben (die Aufgabe erlaubte höchstens zwei, nötig war keiner). Darum habe ich auch die Meldung bei einem falschen Code und die Sperre nach 5 Versuchen nicht gesehen.
- 200 % Zoom, den dunklen Modus und andere Sprachen habe ich nicht geprüft, das war nicht Teil der Aufgabe.
- Die Seite «Hilfe» und die verlinkten Rechtstexte habe ich nicht geöffnet.
- Ob eine ungültige E-Mail-Adresse abgewiesen wird, habe ich nicht geprüft: Ich wollte nichts ausser der Einrichtung speichern und keine weiteren Versuche brauchen.
