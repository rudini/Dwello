# Sven, Runde b1: Abrechnungsseite, Versand per E-Mail, unbekannte Adressen

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Tree (`readOut`) und am Fokus nach jedem Tastendruck. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/4dd0156e-1aed-5051-adcf-2875bdf30b99/scratchpad/sven-b1/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fehlerseite «Diese Seite gibt es nicht.» | «Zurück» tut beim ersten Drücken scheinbar nichts, wenn ich vorher «Zum Inhalt springen» benutzt habe: Der Sprunglink legt `#main-content` als eigenen Verlaufseintrag an, «Zurück» springt nur dorthin zurück. Der Fokus bleibt auf «Zurück», angesagt wird nichts. Erst beim zweiten Drücken komme ich auf die vorherige Seite. |
| P-2 | Minor | Dialog «Abrechnung per E-Mail senden», während des Sendens | Nach «Per E-Mail senden» geht der Fokus auf den Dialog selbst. Der Screenreader liest dann noch einmal den Titel und die lange Beschreibung vor. «Wird gesendet …» steht nur auf dem deaktivierten Knopf und wird mir nicht angesagt. |
| P-3 | Nit | Abrechnungsdetail, zwischen «Status: Entwurf» und «Kostenaufstellung» | Zwei leere `status`-Elemente stehen im Accessibility-Tree. Sie haben keinen Inhalt, sind nicht fokussierbar und werden beim Lesen wohl übersprungen. Sie haben also keinen sichtbaren Zweck, sind aber auch kein Hindernis. |
| P-4 | Nit | Fehlerseite (404) | Der Seitentitel heisst nur «Fehler - Dwello», nicht «Seite nicht gefunden». Das ist auch das Erste, was die Seitenansage beim Laden sagt. Erst die Überschrift sagt, was los ist. |

## Beobachtungen

- Abrechnungsdetail: Zwischen Status und Kostenaufstellung ist nichts fokussierbar. Die Tab-Folge nach dem Sprunglink lautet: Brotkrümel «Nebenkostenabrechnungen», «PDF herunterladen», «Per E-Mail senden», Region «Abrechnungspositionen», danach die Rechnungslinks in der Tabelle. Die Region ist fokussierbar und hat einen Zweck, denn die Tabelle ist bei 1440 px um rund 22 px breiter als ihr Rahmen (horizontal scrollbar).
- Der Name «Abrechnungspositionen» kommt dreimal direkt hintereinander: als Region, als Tabelle und als Tabellenbeschriftung. Davor kommt noch die Überschrift «Kostenaufstellung». Das ist etwas viel Gerede.
- Nach dem Öffnen einer Abrechnung aus der Liste liegt der Fokus auf `body`, und angesagt wird der Seitentitel «Abrechnung NK-22222222-2025-0004 - Dwello». Der Mietername steht nicht im Titel, erst im Absatz unter der Überschrift.
- Der Bestätigungsdialog ist sauber: `aria-modal`, Titel und Beschreibung verknüpft, der Fokus startet auf «Abbrechen» und bleibt im Dialog gefangen (Tab und Shift+Tab kreisen über «Per E-Mail senden», «PDF ansehen (öffnet in neuem Tab)» und «Abbrechen»). Empfänger und Korrespondenzkanal mit Adresse werden vorgelesen.
- Ich habe einen Fehler beim Senden simuliert (Antwort 500 ohne Inhalt, bei Nina Brunner, nichts gespeichert). Dann landete ich auf einer Fehlerseite mit der Überschrift «Unexpected end of JSON input». Das ist ein technischer englischer Text, und ich weiss nicht, ob die Abrechnung versendet wurde. Der Auftrag hat danach nicht gefragt; eine echte Fehlerantwort des Servers sieht vielleicht anders aus.
- Im Fuss steht «Version unbekannt».
- Auf der 404-Seite fehlt nichts: Kopfzeile, Hauptnavigation, Hauptbereich und Fuss sind da, ein leeres `status` steht ausserhalb des Hauptbereichs.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 17 Skriptläufe. Zur Abrechnung brauchte ich 11 Tabs zum Menüpunkt «Nebenkostenabrechnungen» und dann 26 Tabs bis zu «Marco Bernasconi». Die Suche hätte das abgekürzt, ich habe sie aber nicht benutzt. Ohne Sprunglink brauche ich auf der 404-Seite 18 Tabs bis «Zurück».

## Ablauf

1. **Liste öffnen.** Erwartet: Menüpunkt in der Hauptnavigation. Gesehen: «Nebenkostenabrechnungen» ist der 11. Tab-Halt, Enter öffnet die Liste mit dem Titel «Nebenkostenabrechnungen - Dwello». Jede Zeile ist ein Link mit Mietername und Nummer, zum Beispiel «Marco Bernasconi NK-22222222-2025-0004». Gut.
2. **Abrechnung öffnen.** Erwartet: Detailseite mit Überschrift. Gesehen: h1 «Abrechnung NK-22222222-2025-0004», darunter «Marco Bernasconi, Seepark Residenz, Wohnung B2 · Abrechnungsperiode 01.01.2025 – 31.12.2025», dann «PDF herunterladen», «Per E-Mail senden», «Status: Entwurf», zwei leere `status` (P-3), die Überschrift «Kostenaufstellung» und die Tabelle. Beim Tabben kein leerer Halt.
3. **Senden starten.** Erwartet: ein Dialog, der sagt, was passiert. Gesehen: Der Dialog «Abrechnung per E-Mail senden» erklärt Versand, Ablage unter «Dokumente», Datum und Zahlungsfrist. Der Fokus steht auf «Abbrechen». Gut.
4. **Senden bestätigen** (Tab auf «Per E-Mail senden», Enter). Erwartet: eine Ansage, dass gesendet wird, und danach eine Ansage des Ergebnisses. Gesehen: Während des Sendens springt der Fokus auf den Dialog-Container und der Knopf heisst «Wird gesendet …», ohne dass das angesagt wird (P-2). Nach etwa 0,9 s schliesst der Dialog, und der Fokus steht auf der h1 «Abrechnung NK-22222222-2025-0004». Gleichzeitig erscheint in einem höflichen `status` (ausserhalb des Hauptbereichs) die Meldung «Abrechnung per E-Mail versendet». Sie bleibt etwa 8 s stehen und ist im Screenshot oben rechts als grüne Meldung mit Schliessen-Knopf zu sehen. Danach steht auf der Seite «Status: Versendet», statt «Per E-Mail senden» gibt es «Als bezahlt markieren», und im Verlauf steht «Versendet 19.10.2026». Die Meldung sagt also, was passiert ist. An wen gesendet wurde, sagt sie nicht, das stand aber im Dialog.
5. **/statements/abc in die Adresszeile.** Erwartet: «nicht gefunden» und ein Weg zurück. Gesehen: HTTP 404, Titel «Fehler - Dwello» (P-4), h1 «Diese Seite gibt es nicht.», «Prüfen Sie die Adresse oder gehen Sie zur Übersicht.», die Knöpfe «Zurück» und «Zur Übersicht». Nach dem Sprunglink sind das die ersten beiden Halte. «Zur Übersicht» führt sofort zur Übersicht. «Zurück» braucht nach dem Sprunglink zwei Anläufe (P-1), ohne Sprunglink klappt es beim ersten Mal.
6. **/tenants/upload.** Gleiche Seite, gleiches Verhalten. In einem neuen Tab ohne Verlauf tut «Zurück» nichts, «Zur Übersicht» funktioniert. Gleich verhalten sich /gibtsnicht und eine gültig aussehende, aber unbekannte Abrechnungs-ID.

## Verwirrung

- Bei «Zurück» auf der 404-Seite war ich unsicher: Ich drücke den Knopf und höre nichts, der Fokus bleibt auf «Zurück». Ich dachte erst, der Knopf sei kaputt.
- Während des Sendens wurde mir der ganze Dialogtext noch einmal vorgelesen. Kurz dachte ich, der Dialog sei neu aufgegangen.
- Der Begriff «Korrespondenzkanal» im Dialog ist verständlich, weil die E-Mail-Adresse dahinter steht.

## Fehlerrisiken

- Die Erfolgsmeldung verschwindet nach etwa 8 s und lässt sich nicht noch einmal abrufen. Wer sie verpasst, findet das Ergebnis über «Status: Versendet» und den Verlauf. Das reicht, ist aber nicht naheliegend.
- Weil ich «Wird gesendet …» nicht höre, könnte ich mehrmals Enter drücken. Das passiert aber nicht, denn der Knopf ist während des Sendens deaktiviert.
- Wenn das Senden auf einen leeren Serverfehler läuft, lande ich auf der englischen Fehlerseite und weiss nicht, ob die Mail weg ist (siehe Beobachtungen).

## Vorschläge

- **P-1:** Eine Abrechnung öffnen, dann /statements/abc eingeben, Tab, Enter auf «Zum Inhalt springen», Tab auf «Zurück», Enter: Die Seite bleibt, die Adresse ist jetzt /statements/abc ohne `#main-content`. Erst ein zweites Enter führt zurück. Hilfreich wäre ein Sprunglink, der den Fokus setzt, ohne einen Verlaufseintrag anzulegen. Oder «Zurück» überspringt Einträge mit derselben Seite.
- **P-2:** Abrechnung im Status Entwurf öffnen, «Per E-Mail senden», im Dialog Tab, Enter: Der Fokus geht auf den Dialog, und die Beschreibung wird erneut gelesen. Hilfreich wäre, den Fokus auf dem deaktivierten Knopf zu lassen oder «Wird gesendet …» über ein `status` anzusagen.
- **P-3:** Eine beliebige Abrechnung öffnen und den Accessibility-Tree nach «Status: …» lesen: Es folgen zwei leere `status`. Eine Live-Region ohne Inhalt schadet kaum. Falls sie nur Platzhalter für Hinweise sind, wäre es ordentlicher, eine einzige zu haben oder sie nur bei Bedarf als Live-Region zu führen.
- **P-4:** /statements/abc öffnen und den Seitentitel lesen. Hilfreich wäre ein Titel wie «Seite nicht gefunden - Dwello».

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver): Ich habe nur den Accessibility-Tree und die Live-Regionen gelesen. Ob die höfliche Erfolgsmeldung nach der Ansage der fokussierten h1 wirklich vorgelesen wird, ist ein Schluss, keine Beobachtung.
- Ein abgelehnter Mailversand (Ergebnis eines aussenstehenden Dienstes): Dafür hätte der Aufrufer Daten setzen müssen.
- Gespeichert habe ich nur in «Seepark Residenz»: Marco Bernasconi (NK-22222222-2025-0004, Auftrag) und zusätzlich Thomas Weber (NK-22222222-2025-0001). Bei Thomas Weber wollte ich die Lebensdauer und den Ort der Erfolgsmeldung messen. Beide stehen jetzt auf «Versendet». Den Senden-Fehler bei Nina Brunner habe ich nur im Browser simuliert; er hat nichts gespeichert.
