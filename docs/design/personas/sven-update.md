# Sven – Update auf eine neue Version (#1453)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt über den Accessibility-Baum und die Fokusreihenfolge. Frische Installation Dwello 1.4.0, Anmeldung mit Konto mit Passwort, Stand-in meldet 1.5.0.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/8ac6f8d2-3518-57bf-ba01-5c6f20138566/scratchpad/sven-update/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hinweis «Neue Version verfügbar» (z. B. «Mieter») | Nach «Später» landet der Fokus auf dem Dokument (body), der Hinweis verschwindet ohne Ansage. Ich höre nichts und weiss nicht, wo ich bin; der nächste Tab springt auf «Dwello» im Kopfbereich. |
| P-2 | Minor | Dialog «Das Update hat nicht geklappt» | Nach «Schliessen» landet der Fokus auf dem Dokument (body) statt zurück auf «Aktualisieren» im Hinweis. Ich muss mich von oben neu orientieren. |
| P-3 | Minor | Dialog «Das Update hat nicht geklappt» | Escape schliesst den Dialog nicht (im Bestätigungsdialog geht es). Uneinheitlich; ich habe zuerst gedacht, die Tastatur reagiert nicht. |
| P-4 | Minor | Dialog «Dwello wird … aktualisiert» und «Das Update hat nicht geklappt» | Kein geschlossener Fokuskreis: Im Fortschrittsdialog führt Tab vom Titel aus auf das Dokument (body), im Fehlerdialog wechselt Tab zwischen «Schliessen» und dem Dokument (body). Die Seite dahinter ist zwar gesperrt (inert), aber ich höre bei jedem zweiten Tab nichts. |
| P-5 | Minor | Hinweis «Neue Version verfügbar» | Der Link «Was ist neu?» öffnet einen neuen Tab (target=_blank), ohne dass Name oder Beschreibung das sagen. Der Zurück-Befehl funktioniert dort nicht, ich verliere den Faden. |
| P-6 | Minor | Hinweis «Neue Version verfügbar» | Der Hinweis steht in keinem Landmark (keine Region, kein Banner) und hat keine Überschrift. Mit Landmark- oder Überschriften-Navigation finde ich ihn nicht; «Zum Inhalt springen» überspringt ihn. Nur wer ganz oben zu lesen oder zu tabben beginnt, trifft ihn. |
| P-7 | Minor | Dialog «Das Update hat nicht geklappt» | «Das Update hat nicht geklappt» höre ich zweimal kurz hintereinander: einmal als Name des Dialogs beim Fokus auf «Schliessen», dann als erster Satz der Warnung (alert). |

## Beobachtungen

- Der Hinweis ist gut erreichbar: nach «Zum Inhalt springen» sind «Was ist neu?», «Aktualisieren» und «Später» die Tab-Stopps 2 bis 4, vor dem Kopfbereich. Der Text ist klar: «Dwello 1.5.0 ist verfügbar (Sie haben 1.4.0). Das Update dauert einige Minuten; Ihre Daten bleiben erhalten.»
- Bestätigungsdialog «Dwello jetzt aktualisieren?»: role=dialog, aria-modal, Name aus der Überschrift, Beschreibung verknüpft (aria-describedby). Erster Fokus auf «Abbrechen» (sicher). Tab kreist sauber zwischen «Abbrechen» und «Jetzt aktualisieren». Escape schliesst ihn, Fokus zurück auf «Aktualisieren». Der Text sagt die echte Folge: Download, Sicherung, Neustart, einige Minuten nicht nutzbar, ungespeicherte Eingaben gehen verloren. Sehr gut.
- Fortschrittsdialog: Fokus auf der Überschrift «Dwello wird auf Version 1.5.0 aktualisiert» (tabindex=-1). Fortschrittsbalken mit Name «Schritt n von 3: …» und Wert 1–3 von 3, Liste mit «(läuft)/(erledigt)/(folgt)», dazu ein Status-Bereich, der jeden Schritt meldet («Schritt 2 von 3: Sichern», «Schritt 3 von 3: Neu starten»). Die Seite dahinter (main, Navigation) ist inert, ich komme nicht hin. Gut so.
- Risiko: Der Status-Bereich mit «Schritt 1 von 3: Herunterladen» entsteht zusammen mit dem Dialog bereits gefüllt. Manche Screenreader lesen einen Live-Bereich, der mit Inhalt eingefügt wird, nicht vor. Schritt 1 höre ich dann nur, wenn ich weiterlese.
- Der Fortschrittsdialog hat keine verknüpfte Beschreibung; den Satz «Das dauert einige Minuten. Danach sehen Sie wieder die Seite, auf der Sie waren.» höre ich nur beim Weiterlesen.
- Nach dem (gestellten) erfolgreichen Update lädt die Seite «Mieter» neu, Fokus auf dem Dokument, Titel «Mieter - Dwello». Keine Ansage, dass das Update fertig ist; mit dem Stand-in bleibt die Version 1.4.0 und der Hinweis kommt wieder, das ist der Stand-in.
- Fehlerdialog: Fokus springt auf «Schliessen», die Meldung ist ein alert und wird angesagt: «Das Update hat nicht geklappt. Dwello läuft weiter in Version 1.4.0. Die Ursache steht im Protokoll des Servers. Melden Sie sich bei der Person, die Dwello betreut; sie kann es dort nachlesen.» Verständlich. Als Privatvermieter, der Dwello vielleicht selbst betreibt, frage ich mich, wer «die Person, die Dwello betreut» ist; ein Hinweis auf die Installationsanleitung (wie auf der Sicherungsseite) fehlt hier. Ob die Sicherung vor dem Fehler gemacht wurde, sagt die Meldung nicht (die Liste zeigte «Sichern (erledigt)»).
- Nach «Später» ist der Hinweis auch auf anderen Seiten und nach Neuladen weg; nach einer neuen Anmeldung kommt er wieder. «Später» sagt nicht, wann er wiederkommt.
- Im Accessibility-Baum stehen nach jedem Knopf leere «status»-Bereiche; stört nicht, ist aber Rauschen beim Lesen mit Pfeiltasten.
- Nach der Anmeldung führte Dwello zuerst auf «Sicherung einrichten» (/backup); dort stand im Hinweis statt «Aktualisieren» der Link «Richten Sie zuerst die Sicherung ein». Kurz danach war die Sicherung (durch jemand anderen auf derselben Installation) eingerichtet, und der Hinweis bot «Aktualisieren» an.
- Nach dem Anmelden und nach jeder Navigation über das Menü liegt der Fokus auf dem Dokument (body); das ist nicht neu in dieser Änderung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Durchläufe (Anmelden und Navigieren je rund 15 Tastendrücke; Hinweis bis «Aktualisieren» 3 Tabs, Bestätigen 1 Tab + Enter).

## Ablauf

- Fortschrittsdialog, Tab drücken. Erwartet: Fokus bleibt im Dialog (Titel oder nichts passiert). Gesehen: Fokus auf dem Dokument (body), Ansage leer.
- Fehlerdialog, Escape. Erwartet: Dialog schliesst wie der Bestätigungsdialog. Gesehen: nichts, Fokus bleibt auf «Schliessen».
- Fehlerdialog, Tab. Erwartet: Fokus bleibt auf «Schliessen». Gesehen: jeder zweite Tab auf dem Dokument (body).
- Fehlerdialog, «Schliessen». Erwartet: Fokus zurück auf «Aktualisieren» im Hinweis. Gesehen: Fokus auf dem Dokument (body); der Hinweis steht wieder da.
- «Später». Erwartet: kurze Bestätigung oder Fokus auf den Seitenanfang/Hauptinhalt. Gesehen: Fokus auf dem Dokument (body), keine Ansage; nächster Tab auf «Dwello».
- «Was ist neu?» (nur geprüft, nicht gefolgt). Erwartet: Link auf die Versionshinweise, Hinweis falls neues Fenster. Gesehen: Ziel https://github.com/rudini/Dwello/releases/tag/v1.5.0 (passt), öffnet aber in neuem Tab ohne Ansage.

## Vorschläge

- **P-1:** Anmelden, «Mieter» öffnen, Tab bis «Später», Enter, Fokus prüfen. Hilfe: Fokus nach dem Ausblenden auf ein sinnvolles Ziel setzen (z. B. Hauptinhalt oder Überschrift der Seite) und kurz ansagen «Hinweis ausgeblendet; er erscheint bei der nächsten Anmeldung wieder».
- **P-2:** Stand-in auf `outcome=failed`, «Mieter», «Aktualisieren», «Jetzt aktualisieren», warten bis Fehlerdialog, Enter auf «Schliessen», Fokus prüfen. Hilfe: Fokus zurück auf «Aktualisieren» (den auslösenden Knopf), wie beim Bestätigungsdialog.
- **P-3:** wie P-2, statt Enter Escape drücken. Hilfe: Escape schliesst den Fehlerdialog wie «Schliessen». Im Fortschrittsdialog darf Escape ruhig nichts tun.
- **P-4:** Fortschrittsdialog: einmal Tab; Fehlerdialog: mehrmals Tab. Hilfe: Fokus im Dialog halten (Tab im Fortschrittsdialog ohne Wirkung bzw. auf dem Titel lassen, im Fehlerdialog auf «Schliessen» kreisen), etwa mit einem nativen modalen `dialog` oder einer Fokusfalle.
- **P-5:** Tab auf «Was ist neu?» und Name anhören. Hilfe: im Namen oder als sichtbarer Zusatz «(öffnet in neuem Tab)», oder im selben Tab öffnen.
- **P-6:** Auf «Mieter» Landmark- und Überschriftenliste aufrufen: der Hinweis fehlt. Hilfe: den Hinweis als benannte Region (z. B. «Neue Version») auszeichnen oder ihm eine Überschrift geben.
- **P-7:** wie P-2, Ansage beim Erscheinen des Fehlerdialogs anhören. Hilfe: im Alert-Text den ersten Satz weglassen (die Überschrift sagt ihn schon) oder die Überschrift anders formulieren, z. B. Titel «Update nicht möglich», Text ab «Dwello läuft weiter in Version 1.4.0».

## Nicht geprüft

- «Was ist neu?» nicht gefolgt (Auftrag); nur Ziel und Attribute gelesen.
- Ob ein echter Screenreader (NVDA, JAWS, VoiceOver) den Status von Schritt 1 tatsächlich vorliest: nur DOM-Änderungen der Live-Bereiche aufgezeichnet, keinen echten Screenreader verwendet.
- Ein echtes erfolgreiches Update (Version 1.5.0 danach, Ansage nach dem Neustart): mit dem Stand-in nicht möglich, der lädt nur die Seite neu und bleibt bei 1.4.0.
- Die Einrichtung der Sicherung per Tastatur über den Link «Richten Sie zuerst die Sicherung ein»: Zwischen meinem zweiten und dritten Durchlauf hatte jemand anderes die Sicherung auf derselben Installation eingerichtet; ich habe den Link nur im Baum gesehen, nicht bedient.
- Der Stand-in steht nach meinen Tests wieder auf `outcome=done`.
