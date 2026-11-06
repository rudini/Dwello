# Sven, Runde 669: Mietvertrag ändern und neu erfassen, wenn die anderen Mietverträge der Wohnung nicht laden

Ich bin Sven, 45, blind. Ich arbeite nur mit Tastatur und Screenreader; beurteilt habe ich, was der Accessibility-Baum zeigt und was in den Live-Regionen (status, alert) ankommt. Desktop 1440 × 900, für Aufgabe 3 Mobil 390 × 844. Die Anfrage `GET /api/contracts?apartmentId=…` habe ich vor dem Öffnen der Seite mit 500 scheitern lassen: beim Laden und beim ersten «Erneut versuchen», beim zweiten durchgelassen. Ich habe nur geschaut; Ausnahme siehe Beobachtung N-9.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| S-1 | Major | alle drei Orte (Bearbeiten, Assistent Schritt 2/3/5) | Die Erfolgsmeldung verschwindet nach etwa 8 Sekunden von selbst, auch wenn der Fokus gerade auf «Meldung schliessen» steht. Danach liegt der Fokus auf `body`, der Screenreader sagt nichts mehr. Vom Feld, auf dem der Fokus nach dem Erfolg landet, bis zu «Meldung schliessen» brauche ich rund 25 Tabs: Mit Screenreader-Tempo erreiche ich den Knopf nie, bevor die Meldung weg ist. |
| S-2 | Major | Neuer Mietvertrag, Schritt 2 «Wohnung» | Ich wähle bei «nicht geprüft» die erste Wohnung (EG Alpenblick). Nach dem erfolgreichen «Erneut versuchen» heisst es nur «Die Mietverträge der Wohnung sind geladen.», der Fokus springt auf die Überschrift. Meine Wahl ist jetzt «(nicht verfügbar)» und deaktiviert, bleibt aber ausgewählt. Gesagt wird mir das nicht, und mit «Weiter» komme ich ohne Hinweis in Schritt 3. Erst nach dem Vertragsbeginn erfahre ich dort, dass sich der Zeitraum überschneidet. |
| S-3 | Minor | Bearbeiten und Assistent | Der Hinweis «Dwello prüft beim Speichern, ob die Wohnung frei ist / Die anderen Mietverträge dieser Wohnung liessen sich nicht laden. Ihre Eingaben bleiben erhalten.» endet nicht mit dem Knopfnamen und nennt «Erneut versuchen» gar nicht. Der Knopf steht ausserhalb der Status-Region. Ich höre also, dass etwas fehlt, aber nicht, was ich tun kann. |
| S-4 | Minor | Bearbeiten und Assistent | Nach dem ersten erneuten Fehlschlag bleiben zwei Meldungen übereinander stehen: der Status-Hinweis «…liessen sich nicht laden» und ein Alert «Die Mietverträge der Wohnung konnten wieder nicht geladen werden. Versuchen Sie es später erneut; Ihre Eingaben bleiben erhalten.». Der Alert sagt «später», trotzdem bleibt der Knopf «Erneut versuchen» da. Scheitert auch der dritte Versuch, ändert sich der Alert-Text nicht: Ich drücke Enter und höre nichts, weder «wird geladen» noch einen neuen Fehler. |
| S-5 | Minor | Neuer Mietvertrag, Schritt 3 «Vertragsdauer» | Die Erfolgsmeldung lautet «…Der Zeitraum überschneidet sich mit einem davon. Welcher es ist, steht im Hinweis «Zeitraum überschneidet sich».». Der Fokus springt aber auf die Überschrift «Schritt 3 von 5». Der Hinweis ist keine Überschrift und keine Live-Region und steht nach der Radiogruppe «Vertragsdauer». Ich finde ihn nur, wenn ich den ganzen Schritt Zeile für Zeile lese. Die Meldung sagt nicht, wo der Hinweis steht. |
| S-6 | Minor | Mobil 390 px, Menü offen | Ist das Menü offen, liegt die Erfolgsmeldung ausserhalb des modalen Dialogs. Sie ist nicht inert, aber per Tab nicht erreichbar (die Fokusfalle ist richtig) und optisch vom Menü verdeckt. Wenn ich das Menü mit Escape schliesse, ist die Meldung wegen S-1 meist schon verschwunden. |

## Beobachtungen

- N-1: Wenn die Anfrage gelingt, verschwinden Hinweis und Alert vollständig, es stapelt sich nichts. Zurück bleibt nur die eine Erfolgsmeldung. Das ist gut.
- N-2: «Meldung schliessen» steht in der Tab-Reihenfolge an der verlangten Stelle: auf der Bearbeiten-Seite nach «Änderungen speichern» und vor «Datenschutz», im Assistenten nach «Weiter» bzw. «Mietvertrag speichern». Die Erfolgsmeldung ist eine `status`-Region. Der Knopf liegt in der Region, also wird je nach Screenreader «Meldung schliessen» am Ende mitgelesen. Der Fehlerhinweis endet dagegen nicht mit dem Knopfnamen (S-3).
- N-3: Vom Seitenanfang aus finde ich Hinweis und Knopf schnell. Auf der Bearbeiten-Seite: «Zum Inhalt springen», dann zwei Tabs durch die Brotkrümel, beim dritten bin ich auf «Erneut versuchen». Im Assistenten, Schritt 2: ein Tab nach der Auswahl «Wohnung». In Schritt 3 und 5 steht der Knopf gleich nach Vertragsbeginn bzw. unter dem Einleitungstext. Der Hinweis selbst hat keine Überschrift, mit der Überschriften-Navigation springe ich also nicht hin.
- N-4: Nach dem Erfolg geht der Fokus auf der Bearbeiten-Seite ins Feld «Vertragsbeginn», im Assistenten auf die Schritt-Überschrift. Er geht nicht verloren, aber die beiden Orte verhalten sich unterschiedlich.
- N-5: Was die Erfolgsmeldung sagt: Bearbeiten: «Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit keinem davon.» Schritt 2: «Die Mietverträge der Wohnung sind geladen.» Schritt 3 (mit Überschneidung): siehe S-5. Schritt 5 «Prüfen»: wie beim Bearbeiten, «…mit keinem davon.». Danach kann ich mit «Mietvertrag speichern» weiter, die Meldung ist klar.
- N-6: In Schritt 2 heisst bei fehlgeschlagener Anfrage jede Option «… (nicht geprüft)». Was «nicht geprüft» bedeutet, erfahre ich erst nach der Auswahl, wenn der Hinweis erscheint.
- N-7: Auf der Bearbeiten-Seite ist der Hinweis eine Status-Region und wird angesagt. In Schritt 3 und 5 des Assistenten steht er als gewöhnlicher Absatz da und wird nicht angesagt. Weil der Fokus auf der Schritt-Überschrift steht, lese ich ihn aber gleich danach.
- N-8: Der Assistent lädt beim Öffnen die Mietverträge aller 13 Wohnungen (13 Anfragen). Auch «Erneut versuchen» lädt alle 13 neu, nicht nur die gewählte Wohnung.
- N-9: Ein Fehler von mir: In einem Testlauf habe ich nach dem Verschwinden der Meldung weiter getabbt und Enter gedrückt, während der Fokus im Feld «Nebenkostenpauschale» stand. Damit wurde das Formular abgeschickt und der Mietvertrag von Nina Brunner ohne Änderung gespeichert (danach war ich auf seiner Seite). Bestätigt hat Dwello das nur mit dem Seitenwechsel. Enter in einem Betragsfeld speichert also sofort.
- N-10: Mobil gibt «Menü öffnen» den Fokus an «Menü schliessen». Tab und Shift+Tab bleiben im Menü, Escape schliesst es und gibt den Fokus an «Menü öffnen» zurück. Der Hauptinhalt ist dann inert. Das funktioniert richtig.

## Aufgabe geschafft: teilweise

Ich konnte bearbeiten und den Assistenten bis «Prüfen» durchgehen und alles anhören. Die Erfolgsmeldung schliessen konnte ich mit Screenreader-Tempo aber nicht (S-1), und in Schritt 2 hätte mich die Meldung beinahe mit einer vermieteten Wohnung weitergeschickt (S-2).

## Aufwand

Etwa 30 Minuten, rund 20 Durchläufe. Pro Ort jeweils: Seite laden, zwei Fehlversuche, ein Erfolg.

## Ablauf

- Bearbeiten, Erfolg nach dem 2. «Erneut versuchen». Erwartet: Die Meldung bleibt, bis ich sie schliesse. Gesehen: Nach etwa 8 s ist sie weg, auch mit Fokus auf «Meldung schliessen»; der Fokus fällt auf `body` (S-1).
- Bearbeiten, Fehlerhinweis beim Laden. Erwartet: Die Ansage endet mit «Erneut versuchen». Gesehen: Sie endet mit «Ihre Eingaben bleiben erhalten.»; der Knopf liegt ausserhalb (S-3).
- Dritter Fehlschlag (Zusatzversuch). Erwartet: Ich höre eine neue Rückmeldung. Gesehen: Stille, der Alert-Text bleibt gleich (S-4).
- Assistent, Schritt 2, Erfolg. Erwartet: Mir wird gesagt, dass meine gewählte Wohnung nun «nicht verfügbar» ist. Gesehen: nur «geladen», und «Weiter» lässt mich durch (S-2).
- Assistent, Schritt 3, Erfolg mit Überschneidung. Erwartet: Der Fokus geht zum Hinweis oder die Meldung sagt, wo er steht. Gesehen: Der Fokus liegt auf der Überschrift, der Hinweis steht weiter unten ohne Überschrift (S-5).
- Mobil, Menü offen mit Erfolgsmeldung. Erwartet: Die Meldung ist nach dem Schliessen des Menüs noch da. Gesehen: Sie ist verdeckt und nach dem Schliessen des Menüs verschwunden (S-6).

## Vorschläge

- S-1: Reproduzieren: Bearbeiten-Seite von Nina Brunner, Anfrage zweimal scheitern lassen, zweimal «Erneut versuchen», Fokus auf «Meldung schliessen», 10 s warten. Was helfen würde: Die Meldung bleibt stehen, solange sie den Fokus hat, oder ganz bis zum Schliessen bzw. zur nächsten Aktion. Wenn sie doch verschwindet, geht der Fokus an ein sinnvolles Element zurück.
- S-2: Reproduzieren: Neuer Mietvertrag, Mieter Sarah Meier, Anfrage scheitern lassen, in Schritt 2 «Wohnung EG – Alpenblick (nicht geprüft)» wählen, zweimal «Erneut versuchen» (beim zweiten gelingt die Anfrage). Was helfen würde: Eine Erfolgsmeldung, die sagt «Wohnung EG ist vermietet. Wählen Sie eine andere Wohnung.», die Auswahl zurückgesetzt oder der Fokus in der Auswahl, und «Weiter» lässt eine nicht verfügbare Wohnung nicht durch.
- S-3: Reproduzieren: Bearbeiten-Seite mit scheiternder Anfrage öffnen und den Status anhören. Was helfen würde: «… Wählen Sie «Erneut versuchen».» am Ende des Hinweises, oder den Knopf mit `aria-describedby` an den Hinweis binden.
- S-4: Reproduzieren: wie S-1, aber dreimal scheitern lassen. Was helfen würde: Nur eine Meldung zeigen, nämlich den Alert, der den Status ersetzt. Während des Ladens eine Ansage wie «Wird geladen …», und bei jedem Fehlschlag eine erneute Ansage. Den Text auf «Versuchen Sie es nochmals oder später» abstimmen.
- S-5: Reproduzieren: wie S-2, mit Vertragsbeginn 01.12.2026, und den Fehler erst in Schritt 3 auflösen. Was helfen würde: Den Fokus auf den Hinweis «Zeitraum überschneidet sich» setzen oder ihn als Überschrift auszeichnen und in der Meldung «unter Vertragsdauer» sagen.
- S-6: Reproduzieren: 390 px, Bearbeiten-Seite, Erfolg auslösen und sofort «Menü öffnen». Was helfen würde: S-1 beheben, also die Meldung stehen lassen, oder den Zeitgeber anhalten, solange das Menü offen ist.

## Nicht geprüft

- Einen echten Screenreader (NVDA, VoiceOver) habe ich nicht benutzt. Was angesagt wird, habe ich aus dem Accessibility-Baum und den Änderungen der Live-Regionen abgeleitet (MutationObserver-Protokoll). Ob «Meldung schliessen» in der Status-Region mitgelesen wird, hängt vom Screenreader ab.
- «Mietvertrag speichern» im Assistenten habe ich nicht gedrückt, weil ich nur schauen sollte. Was beim Speichern ohne geladene Mietverträge passiert, ist darum ungeprüft.
- Ob «Weiter» in Schritt 3 bei einer Überschneidung sperrt, habe ich nicht geprüft.
- Zoom und Mobil im Assistenten habe ich nicht geprüft, das Menü nur auf der Bearbeiten-Seite.
