# Sven, #678: Enter in neuer Kategorie und neuem Verteilschlüssel

Persona: Sven, 45, blind, nur Tastatur, beurteilt am Accessibility-Baum. Desktop 1440 × 900, Zoom 100 %.
App: http://localhost:3300 (Persona-Stack, Demodaten, Build von w-678). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-678/`.
Was ich als «angesagt» bezeichne: Text, der in einer Live-Region (`status`, `alert`) erscheint, und das Element, das den Fokus bekommt, samt Name und Beschreibung.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| S-1 | Minor | Neuer Verteilschlüssel | Enter in «Formel» mit ungültiger Formel speichert (richtig), aber nach der Ablehnung landet der Fokus auf der Fehlermeldung oben, nicht im Feld «Formel»; das Feld ist nicht als ungültig markiert und nicht mit der Meldung verbunden. Bei der Kategorie springt der Fokus dagegen direkt in die fehlerhafte Auswahl. Ich muss mit Tab über «Name» und «Beschreibung» zurück zur Formel. |

Frühere Befunde aus #678:

- **P-5 (Enter startet die KI-Prüfung): behoben.** Enter in «Name» schickt das Formular zum Speichern (Netzwerk: `POST …/new?/save`), nicht zur KI-Prüfung.
- **P-11 (Zurücknehmen des Vorschlags nach Namensänderung nicht angesagt): behoben.** Beim ersten Tastendruck im Namen nach der Prüfung erscheint in der Statusregion: «Name oder Beschreibung haben sich seit der Prüfung geändert. Dwello hat die Wahl der KI zurückgenommen. Wählen Sie selbst oder lassen Sie die KI nochmals prüfen.» Die vorgewählte Option ist danach wirklich abgewählt.

## Beobachtungen

- N-1: Nach jedem Absenden (Speichern mit Fehler, erste KI-Prüfung, Formel testen) sagt eine *assertive* Region den Seitentitel an («Neue Kategorie - Dwello», «Neuer Verteilschlüssel - Dwello»), obwohl ich die Seite nicht verlassen habe. Kurz danach folgt der Fokus- oder Statustext. Ein Screenreader liest also zuerst den Titel und wird dann unterbrochen. Gestört hat es mich nicht, aber es ist unnötiges Rauschen. Bei der zweiten KI-Prüfung auf derselben Seite kam der Titel nicht mehr.
- N-2: Enter ohne Wahl bei «Umlagefähig»: Der Fokus springt auf die Option «Umlagefähig». Ihre Beschreibung beginnt mit der Meldung «Wählen Sie, ob die Kosten umlagefähig sind. Sind Sie unsicher, wählen Sie «Von der KI prüfen lassen».», die Gruppe ist als ungültig markiert und der eingegebene Name bleibt stehen. Gut gelöst.
- N-3: Enter mit gewählter Option speichert, der Fokus steht danach in der Liste auf dem Link der neuen Kategorie und der Status sagt «Kategorie «…» gespeichert». Beim Verteilschlüssel genauso, auch mit Enter in «Name» und in «Englisch (optional)».
- N-4: Habe ich selbst gewählt («Nicht umlagefähig») und schlägt die KI anders vor, wird angesagt «Die KI sieht es anders als Sie. Ihre Wahl bleibt: «Nicht umlagefähig».» Nach einer Änderung von Name oder Beschreibung: «… Ihre Wahl bleibt. Lassen Sie die KI bei Bedarf nochmals prüfen.» Die Ansage kommt einmal, nicht bei jedem Tastendruck.
- N-5: Während der KI-Prüfung werden «Bitte warten …» und «Die KI prüft die Kategorie …» angesagt, danach der Vorschlag samt Begründung. Der Fokus bleibt auf dem Knopf.
- N-6: In der Fehlermeldung zur Formel steht bei den Rechenzeichen auch «%», die Hilfe über dem Feld nennt nur «+ - * /». Was «%» tut, erfahre ich nirgends.
- N-7: Bis zum Feld «Name» sind es rund 20 Tab-Schritte durch die Navigation. Der Link «Zum Inhalt springen» ist da, so geht es schneller.
- N-8: Enter in «Beschreibung» der Kategorie (mehrzeiliges Feld) macht einen Zeilenumbruch und schickt nichts ab. Das erwarte ich so.
- N-9: Löschen per Tastatur: Der Dialog öffnet sich mit dem Fokus auf «Abbrechen» und nennt die Folgen. Mit Tab und Enter auf «Löschen» wird die Löschung ausgeführt, angesagt wird «… gelöscht».

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 9 Durchläufe per Skript. Die Kategorie (Enter mit Wahl) war mit etwa 24 Tastendrücken angelegt: Tabs bis «Name», Eingabe, Tab, Leertaste, Shift+Tab, Enter.

## Ablauf

- Erwartet: Nach Enter ohne Wahl bleibe ich im Feld und höre den Fehler. Gesehen: Zuerst wird der Seitentitel angesagt, dann springt der Fokus auf die Option «Umlagefähig» und deren Beschreibung nennt den Fehler (N-1, N-2). Brauchbar, aber anders als erwartet.
- Erwartet: Nach Enter in «Formel» mit «{area} +» springt der Fokus in die Formel und ich höre den Fehler. Gesehen: Die Alert-Meldung «Verteilschlüssel wurde nicht gespeichert – Die Formel ist ungültig: …» wird angesagt und bekommt den Fokus. Das Feld «Formel» ist weder ungültig markiert noch mit der Meldung verbunden; der nächste Tab führt zu «Name» (S-1).

## Vorschläge

- S-1: «Verteilschlüssel erfassen» öffnen, Name «Test» eingeben, Tab bis «Formel», Inhalt durch `{area} +` ersetzen, Enter. Der Fokus steht auf der Meldung oben, Tab führt zu «Name». Hilfreich wäre, wie bei der Kategorie: den Fokus ins Feld «Formel» setzen, das Feld als ungültig markieren (`aria-invalid`) und die Meldung als Beschreibung des Felds anhängen.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): Ich habe Live-Regionen und Fokus im Browser mitgeschrieben; die Reihenfolge, in der ein Screenreader liest, wenn eine assertive und eine polite Ansage oder ein Fokuswechsel zusammenfallen (N-1), habe ich nur abgeleitet.
- Eine KI-Prüfung ohne Vorschlag («nicht sicher») und eine fehlgeschlagene KI-Prüfung: Nicht verlangt, und es war kein Name bekannt, bei dem der KI-Ersatz unsicher antwortet.
- Bearbeiten bestehender Kategorien oder Verteilschlüssel: Nicht verlangt; keine Demodaten verändert.

Aufgeräumt: Kategorie «Sven Testkategorie B» und die Verteilschlüssel «Sven Schlüssel Formel», «Sven Schlüssel Name» und «Sven Schlüssel Englisch» habe ich per Tastatur wieder gelöscht und danach kontrolliert, dass keiner mehr in den Listen steht.
