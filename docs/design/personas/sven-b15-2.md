# Persona-Lauf Sven, Slice b15, Runde 2 (Mieter und Wohnung als Text, #152)

Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, 100 %. Beurteilt habe ich den Accessibility-Tree (`readOut`) und nach jedem Tab das fokussierte Element mit Name, Rolle, Ziel und `aria-describedby`.

Geprüft habe ich nur das, was seit Runde 1 geändert wurde (Commit 5f97d8b), und meine Befunde S-1, S-2 und S-5 aus `sven-b15.md`.

Mietverträge (nur diese beiden, Helga läuft parallel):
- Hans Müller, `/contracts/b0000001-0001-0001-0001-000000000001`, unbefristet, ohne Vertragsende.
- Kevin Fischer, `/contracts/b0000001-0001-0001-0001-000000000099`, «Unbefristet, gekündigt auf den 28.02.2021».

Ich habe nichts gespeichert und nichts beendet oder gelöscht.

## Aufgabe geschafft: ja

## Aufwand

- Etwa 4 Minuten für beide Mietverträge.
- Je Mietvertrag: Von der Seite des Mietvertrags sind es 19 Tabs bis «Bearbeiten» (Sprunglink, Kopfzeile, 13 Links der Navigation, Brotkrümel), dann Enter.
- Auf «Mietvertrag bearbeiten» sind es 20 Tabs bis «Zur Seite des Mietvertrags», mit «Zum Inhalt springen» 3 Tabs.

## Stand der Befunde aus Runde 1

| ID | Schwere (R1) | Stand | Beleg |
|---|---|---|---|
| S-1 | Major | behoben | Unter der H1 steht jetzt bei beiden Mietverträgen: «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Das widerspricht der Hilfe unter «Mieter und Wohnung» nicht mehr. |
| S-2 | Minor | behoben | Bei Hans Müller (ohne Vertragsende) sagt die Hilfe: «Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» Danach folgt der Link «Zur Seite des Mietvertrags», und dort ist die Schaltfläche «Beenden» die zweite Aktion nach «Bearbeiten». Der Weg ist genannt und erreichbar, eine Verwechslung mit «Befristet» ist nicht mehr naheliegend. Bei Kevin Fischer (mit Vertragsende) sagt die Hilfe: «… erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag.» Seine Seite hat folgerichtig kein «Beenden» mehr. |
| S-5 | Nit | behoben | Wert unter «Wohnung»: «Wohnung 1.01 · Musterhaus Zentrum», dasselbe Trennzeichen wie auf der Seite des Mietvertrags. |

Nicht noch einmal geprüft habe ich S-3, S-4, S-6 und S-7. Laut Auftrag waren sie nicht Teil dieser Runde, und am Accessibility-Tree sehe ich dazu keine Änderung: H1 und Seitentitel heissen weiter nur «Mietvertrag bearbeiten» (S-4), die Radios lesen die Erklärung weiterhin als Teil des Namens vor (S-7).

## Ablauf

| Schritt | Erwartet | Gesehen (gehört) |
|---|---|---|
| 1. Seite des Mietvertrags von Hans Müller, Tab bis «Bearbeiten», Enter | Seite «Mietvertrag bearbeiten» | Titel «Mietvertrag bearbeiten - Dwello», Fokus auf `body`, der nächste Tab geht auf «Zum Inhalt springen». In Ordnung. |
| 2. Einleitung unter der H1 lesen | Kein Versprechen mehr, dass Mieter und Wohnung änderbar sind | «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» Danach «Laufender Mietvertrag» mit dem Hinweis zu den Kündigungsfristen. Stimmig. |
| 3. Mit H zu «Mieter und Wohnung», weiterlesen | Begriff/Wert-Paare, dann die Hilfe zum Mieterwechsel | «Mieter: Hans Müller», «Wohnung: Wohnung 1.01 · Musterhaus Zentrum». Dann zwei Absätze: (1) «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden» und erfassen danach einen neuen.» (2) «Haben Sie den falschen Mieter oder die falsche Wohnung gewählt und hat der Mietvertrag noch nicht begonnen, löschen Sie ihn auf seiner Seite und erfassen ihn neu.» Danach der Link «Zur Seite des Mietvertrags». Klar und gut in einzelne Sätze geteilt. |
| 4. Fokusreihenfolge mit Tab | Der neue Link kommt nach dem Brotkrümel und vor «Vertragsbeginn», also in Lesereihenfolge | Tab 18 «Mietverträge», Tab 19 «Mietvertrag von Hans Müller» (Brotkrümel), Tab 20 «Zur Seite des Mietvertrags», danach «Vertragsbeginn». Die Reihenfolge entspricht dem Lesefluss. |
| 5. Linkname | Der Name sagt, wohin der Link führt | «Zur Seite des Mietvertrags» ist im Zusammenhang gelesen eindeutig. In der Linkliste des Screenreaders (ohne Zusammenhang) steht er neben dem Brotkrümel «Mietvertrag von Hans Müller» und «Abbrechen». Alle drei führen auf dieselbe Seite, aber nur der neue Link nennt keinen Mieter (siehe N-2). |
| 6. Enter auf dem Link | Seite des Mietvertrags, «Beenden» leicht zu finden | Titel «Mietvertrag - Hans Müller - Dwello», H1 «Mietvertrag von Hans Müller». Die Aktionen kommen direkt nach der H1: «Bearbeiten», «Beenden», «Löschen». Der Fokus liegt nach dem Laden auf `body`, also wie bei jedem Seitenwechsel. Gut. |
| 7. Dasselbe bei Kevin Fischer | Andere Hilfe, weil er schon ein Vertragsende hat | Einleitung wie bei Hans. Hilfe (1): «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel oder einem Wechsel der Wohnung erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag.» Hilfe (2) und der Link wie oben. Das Vertragsende selbst (28.02.2021) höre ich erst weiter unten, im Abschnitt «Vertragsdauer» (siehe N-1). Fokusreihenfolge gleich wie bei Hans: Tab 20 ist der Link. |
| 8. Link bei Kevin Fischer folgen | Eine Seite, auf der ich den neuen Mietvertrag erfassen kann | Seite «Mietvertrag - Kevin Fischer - Dwello» mit den Aktionen «Bearbeiten» und «Löschen», unter «Vertragsdauer» «Beendet» und «Unbefristet, gekündigt auf den 28.02.2021». Eine Aktion zum Erfassen eines neuen Mietvertrags gibt es dort nicht. Für den nächsten Schritt aus der Hilfe bringt mich der Link nicht weiter (siehe N-1). |
| 9. Zusatzprobe: Nettomiete bei Hans auf 1499.00 ändern, dann den Link «Zur Seite des Mietvertrags» | Eine Rückfrage, ob ich die Änderung verwerfen will | Keine Rückfrage: Die Seite wechselt sofort, die Änderung ist ohne Meldung weg. Gespeichert wurde nichts. «Abbrechen» verhält sich vermutlich gleich und das ist wohl nicht neu. Neu ist aber, dass jetzt ein Link mitten im Formular, vor den Feldern, die Seite verlässt (siehe N-3). |

Screenshots (nur im Scratchpad): `hans-edit.png` zeigt bei Hans Müller unter «Mieter und Wohnung» zwei Zeilen Begriff/Wert, darunter zwei Hilfeabsätze und den unterstrichenen Link «Zur Seite des Mietvertrags», dann «Vertragsdauer». `kevin-edit.png` zeigt dasselbe Panel bei Kevin Fischer mit dem Hilfetext zum Tag nach dem Vertragsende. `*-after.png` zeigen die Seite des Mietvertrags nach dem Link.

## Verwirrung

- Bei Kevin Fischer: «ab dem Tag nach dem Vertragsende». Welches Datum das ist, sagt der Satz nicht. Ich muss weiterlesen bis «Vertragsende 28.02.2021» und selbst den 01.03.2021 ausrechnen.
- Wo ich bei Kevin Fischer den neuen Mietvertrag erfasse, sagt die Hilfe nicht. Der Link darunter führt auf eine Seite, auf der das nicht geht. Ich müsste über die Navigation «Mietverträge» gehen und dort die Aktion zum Erfassen suchen.

## Fehlerrisiken

- Bei Kevin Fischer könnte ich einen neuen Mietvertrag mit falschem Beginn erfassen (zum Beispiel am 28.02. statt am 01.03.), weil die Hilfe das Datum nicht nennt. Das ist gering, weil das Vertragsende auf derselben Seite steht.
- Wer im Bearbeiten-Formular schon Werte geändert hat und dann dem neuen Link folgt, verliert die Änderungen ohne Rückfrage (N-3).

## Neue Befunde

| ID | Schwere | Bildschirm | Befund und Beleg | Vorschlag |
|---|---|---|---|---|
| N-1 | Minor | Mietvertrag bearbeiten, Panel «Mieter und Wohnung», Mietvertrag mit Vertragsende (Kevin Fischer) | Die Hilfe sagt «erfassen Sie ab dem Tag nach dem Vertragsende einen neuen Mietvertrag», nennt aber weder das Datum noch den Weg. Der einzige Link führt zu «Zur Seite des Mietvertrags», und dort gibt es nur «Bearbeiten» und «Löschen», kein Erfassen. Reproduktion: `/contracts/b0000001-0001-0001-0001-000000000099`, 19 Tabs bis «Bearbeiten», Enter, H bis «Mieter und Wohnung», lesen, mit Tab zu «Zur Seite des Mietvertrags», Enter. Die Aktionen der Seite anhören. | Das Datum in den Satz schreiben («ab dem 01.03.2021») und bei einem Mietvertrag mit Vertragsende auf «Neuen Mietvertrag erfassen» verlinken statt auf die Seite des Mietvertrags (falls möglich mit vorgewählter Wohnung). |
| N-2 | Nit | Mietvertrag bearbeiten, Panel «Mieter und Wohnung» | Linkname «Zur Seite des Mietvertrags» ohne Mieter. In der Linkliste stehen drei Links zur selben Seite («Mietvertrag von Hans Müller», «Zur Seite des Mietvertrags», «Abbrechen»), nur der neue Link sagt nicht, um welchen Mietvertrag es geht. Reproduktion: Schritt 4 und 5 oben. | Zum Beispiel «Zur Seite des Mietvertrags von Hans Müller», oder ein Linkname mit der Aktion, die man dort ausführt («Mietvertrag beenden»). |
| N-3 | Minor | Mietvertrag bearbeiten | Ungespeicherte Änderungen gehen beim neuen Link ohne Rückfrage verloren. Reproduktion: bei Hans Müller «Nettomiete pro Monat» auf 1499.00 setzen, mit Shift+Tab zurück zum Link «Zur Seite des Mietvertrags», Enter: Die Seite wechselt sofort, es gibt keine Rückfrage und keine Meldung. Für «Abbrechen» gilt das wohl schon länger, ich habe es hier nicht noch einmal geprüft. | Vor dem Verlassen mit ungespeicherten Änderungen fragen, oder dem Link «(Änderungen werden nicht gespeichert)» als Beschreibung mitgeben. |

Was gut ist: Die Hilfe hängt vom Mietvertrag ab und ist in zwei kurze Absätze geteilt. Den Mieterwechsel erklärt sie mit dem Namen der echten Schaltfläche «Beenden». Der Link steht in der Lesereihenfolge direkt nach der Hilfe, er hat in der Tab-Reihenfolge seinen richtigen Platz, und es gibt keine leeren Tab-Stopps. Einleitung und Hilfe widersprechen sich nicht mehr.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): Ich habe den Accessibility-Tree und die zugänglichen Namen beurteilt, nicht die tatsächliche Sprachausgabe.
- «Beenden» bei Hans Müller und das Erfassen eines neuen Mietvertrags für Kevin Fischers Wohnung habe ich nicht ausgeführt, weil beides die gemeinsame Datenbank verändert und Helga parallel läuft.
- Der Mietvertrag, der noch nicht begonnen hat (Absatz 2 der Hilfe, «löschen … und erfassen ihn neu»): Für keinen der beiden freigegebenen Mietverträge trifft das zu.
- S-3, S-4, S-6 und S-7 aus Runde 1: laut Auftrag nicht in dieser Runde.
