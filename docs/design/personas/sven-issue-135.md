# Persona-Review Sven, Issue #135: Schritt 2 «Gebäude» im Assistenten «Abrechnungen erstellen»

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, Zoom 100 %. Beurteilt nach dem Accessibility-Tree (zugänglicher Name, Beschreibung, Zustand des fokussierten Elements, Live-Regionen) und nach der Tab-Reihenfolge.
App: Persona-App http://localhost:3300 mit Demodaten. Ich habe nichts gespeichert (siehe «Beobachtungen» zum automatischen Entwurf).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/sven-issue-135/`.

## Befunde (nur die Änderung)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der neue Satz steckt ganz im zugänglichen Namen der Checkbox (rund 190 Zeichen), nicht in einer Beschreibung. Bei jedem Tab und Shift+Tab und in der Formularfeld-Liste höre ich alles am Stück; der wichtige Satz kommt erst an dritter Stelle, ohne Satzzeichen an die Rechnungszahl gehängt, und danach folgt noch «4 Wohnungen». |
| P-2 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Solange die Zahl lädt, fehlt der Satz ohne jeden Hinweis, und wenn er kommt, wird nichts angesagt. Ein Gebäude ohne Satz klingt dann gleich wie Alpenblick (noch keine Abrechnung). Wer schnell durchtabbt, verpasst die Information. |

## Beobachtungen

- Positiv: Der Satz selbst ist klar und nennt die Folge («Für dieses Gebäude entsteht keine neue.»). Die Zahl der Mietverträge stimmt mit den Demodaten überein (Seepark Residenz und Musterhaus Zentrum: «Alle 4 Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt.»; Alpenblick: kein Satz).
- Positiv: Tab-Reihenfolge in Schritt 2 stimmt (Alle Gebäude, die Gebäude der Reihe nach, Zurück, Weiter; rückwärts genauso). Der Fokus bleibt auf der Checkbox, wenn der Satz nachlädt. Die Checkbox lässt sich mit der Leertaste wählen, Zustand «checked» wird gemeldet, die Live-Region meldet «1 von 3 gewählt».
- Nach «Weiter» springt der Fokus auf die Überschrift des neuen Schritts («Schritt 2 von 5: Gebäude», danach «Schritt 3 von 5: …»). Gut.
- Ich konnte Seepark Residenz allein wählen (für das Gebäude entsteht laut Satz keine Abrechnung) und mit «Weiter» in Schritt 3 gehen, ohne weiteren Hinweis. Ob die Vorschau in Schritt 4 das sagt, habe ich nicht geprüft.
- Im Accessibility-Tree steht nach jeder Checkbox der ganze Label-Text noch einmal als Text-Knoten. Im Lesemodus eines Screenreaders könnte ich den langen Text so zweimal hören; mit dem neuen Satz wird das länger. Ob das schon vorher so war, habe ich nicht verglichen.
- Beim Wählen per Leertaste erschien in einer Statusmeldung «Entwurf gespeichert, 14:20». Der Assistent speichert seinen Stand offenbar selbst; ich habe nichts bewusst gespeichert.
- Beim ersten Durchlauf stand ein Gebäude «Anna Testhaus» (0 Wohnungen) in der Liste, beim nächsten nicht mehr. Das stammt wohl von einer anderen Persona; ich habe es nicht gezählt.
- Beim Laden von `/statements/generate` steht der Fokus auf dem Dokument, nicht auf der Überschrift (vor der Änderung nicht verglichen).
- Visuell (Screenshot `03-schritt2-geladen.png`): In der Schrittleiste sind die Wörter mitten im Wort umgebrochen («Abrechnun / gsperiode», «Verwaltung / spauschale»).

## Aufgabe geschafft

Ja. Ich bin nur mit der Tastatur in Schritt 2 gelangt (Abrechnungsperiode 01.01.2025 bis 31.12.2025 war vorgeschlagen) und habe alle Checkboxen abgehört.

## Aufwand

Etwa 10 Minuten in 5 Durchläufen. Von der Übersicht bis Schritt 2 brauchte ich 32 Tastendrücke: Tab über die Hauptnavigation bis zum Link «Abrechnungen erstellen» der Übersicht, Enter, dann rund 10 Tabs in Schritt 1 bis «Weiter», Enter.

## Ablauf

1. **Übersicht, Tab bis «Abrechnungen erstellen».** Erwartet: ein Link mit diesem Namen. Gesehen: Link «Abrechnungen erstellen» in der Übersicht (Tab 19), nach Enter Seite «Abrechnungen erstellen - Dwello».
2. **Schritt 1.** Erwartet: die vorgeschlagene Abrechnungsperiode 2025. Gesehen: «Beginn» 01.01.2025 und «Ende» 31.12.2025, je mit ausgeschriebenem Datum darunter. Tab bis «Weiter», Enter.
3. **Schritt 2, Fokus.** Erwartet: Fokus auf der Überschrift des Schritts. Gesehen: heading «Schritt 2 von 5: Gebäude». Gut.
4. **Tab auf «Alle Gebäude».** Gesehen: checkbox «Alle Gebäude», nicht angekreuzt. Daneben «0 von 3 gewählt» (Live-Region).
5. **Tab auf Alpenblick.** Erwartet: kein Hinweis zu bestehenden Abrechnungen. Gesehen: checkbox «Alpenblick Bergstrasse 8, 3800 Interlaken 6 Rechnungen in der Abrechnungsperiode 3 Wohnungen». Keine Beschreibung. Stimmt.
6. **Tab auf Seepark Residenz.** Erwartet: Name des Gebäudes, dann ein Hinweis, dass alle Mietverträge schon eine Abrechnung haben, am liebsten als Beschreibung nach einer kurzen Pause. Gesehen: der ganze Inhalt als Name: «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode Alle 4 Mietverträge haben schon eine Abrechnung, die in diese Abrechnungsperiode fällt. Für dieses Gebäude entsteht keine neue. 4 Wohnungen». Beschreibung: keine. Der Inhalt stimmt, aber ich muss mir 30 Wörter anhören, bis ich weiss, ob ich das Gebäude wählen soll. Zwischen «Abrechnungsperiode» und «Alle» fehlt eine Pause; «4 Wohnungen» am Ende klingt, als gehöre es zum Satz davor.
7. **Tab auf Musterhaus Zentrum.** Gesehen: gleicher Aufbau, «19 Rechnungen … Alle 4 Mietverträge haben schon eine Abrechnung … 6 Wohnungen». Hier heisst es «4 Mietverträge» und «6 Wohnungen» direkt hintereinander. Beim Hören musste ich überlegen, welche Zahl was bedeutet.
8. **Shift+Tab zurück.** Gleiche Reihenfolge rückwärts, gleiche Namen. Bei jedem Wechsel hört man den langen Namen wieder ganz.
9. **Langsames Laden (die Anfrage nach den Abrechnungen um 5 s verzögert).** Erwartet: ein Hinweis «wird geladen» oder eine Ansage, wenn die Zahl da ist. Gesehen: Während des Ladens heisst Seepark Residenz nur «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode 4 Wohnungen»: genau wie ein Gebäude ohne Abrechnungen. Als die Daten kamen, änderte sich der Name still. Die Live-Regionen blieben unverändert («0 von 3 gewählt»). Mit verzögerter Rechnungsanfrage verhält sich die Rechnungszahl gleich (fehlt still); die Änderung folgt also einem bestehenden Muster.
10. **Seepark Residenz mit Leertaste wählen, dann Weiter.** Erwartet: vielleicht ein Hinweis, dass für diese Wahl nichts entsteht. Gesehen: «checked», Live-Region «1 von 3 gewählt», «Entwurf gespeichert, 14:20». Mit «Weiter» kam ich ohne Hinweis zu Schritt 3; der Fokus stand auf der Überschrift von Schritt 3.

Screenshots: `01-schritt1.png` (Schritt 1 mit 2025), `02-schritt2-sofort.png` und `03-schritt2-geladen.png` (Schritt 2: Karten Seepark Residenz und Musterhaus Zentrum mit dem zweizeiligen Satz unter der Rechnungszahl, «4 Wohnungen» bzw. «6 Wohnungen» rechts; Alpenblick ohne Satz), `04-seepark-gewaehlt.png`, `05-nach-weiter-seepark.png`, `06-laedt.png` (Schritt 2 während des Ladens, ohne Satz und ohne Ladehinweis).

## Verwirrung

- «… die in diese Abrechnungsperiode fällt»: verständlich. Beim Hören war mir aber nicht sofort klar, ob «keine neue» die Abrechnung oder den Mietvertrag meint. Erst beim zweiten Hören habe ich verstanden: keine neue Abrechnung.
- Zwei Zahlen direkt hintereinander, «4 Mietverträge» und «6 Wohnungen»: Weil «Wohnungen» ganz am Schluss des Namens steht, hört man es leicht als Teil des Hinweises.
- Fehlt der Satz, heisst das «noch keine Abrechnung» oder «noch nicht geladen». Hören kann ich den Unterschied nicht.

## Fehlerrisiken

- Wer schnell durchtabbt, bevor die Daten da sind, oder den langen Namen nach dem Gebäudenamen abbricht (das mache ich oft), hört den Hinweis nicht. Dann wählt er ein Gebäude, für das nichts entsteht, und wundert sich später über eine leere Vorschau oder fehlende Entwürfe.
- In der Formularfeld-Liste des Screenreaders sind die Einträge so lang, dass man die Gebäude schlecht unterscheiden und durchsuchen kann.

## Vorschläge

- **P-1:** Reproduktion: Übersicht › «Abrechnungen erstellen» › Schritt 1 mit 2025 › «Weiter» › Tab bis «Seepark Residenz». Der zugängliche Name umfasst rund 190 Zeichen, eine Beschreibung gibt es nicht. Hilfreich: Den Namen auf Gebäudename und Adresse kürzen und Rechnungszahl, Abrechnungshinweis und Wohnungszahl über `aria-describedby` als Beschreibung anhängen. Der Screenreader liest sie nach einer Pause, und ich kann sie überspringen. Die Teile als eigene Sätze mit Punkt trennen. Den Abrechnungshinweis direkt nach dem Namen nennen, weil er über die Wahl entscheidet.
- **P-2:** Reproduktion: die Anfrage `**/api/statements/billed**` verzögern (hier 5 s), Schritt 2 öffnen, sofort Tab bis «Seepark Residenz»: kein Satz, kein Ladehinweis, und keine Ansage, wenn er kommt. Hilfreich: während des Ladens einen kurzen Text in der Karte, zum Beispiel «Bestehende Abrechnungen werden geprüft …», und nach dem Laden eine höfliche Live-Ansage, wenn mindestens ein Gebäude betroffen ist, etwa «Für 2 Gebäude entstehen keine neuen Abrechnungen.».

## Nicht geprüft

- Einen echten Screenreader (NVDA, VoiceOver) habe ich nicht benutzt. Beurteilt habe ich nach dem Accessibility-Tree von Chromium. Wie oft der Label-Text im Lesemodus wirklich vorgelesen wird, ist deshalb offen.
- Ein Gebäude, bei dem nur ein Teil der Mietverträge schon eine Abrechnung hat: Die Demodaten von 2025 haben keines, und die Aufgabe nannte keinen Fall dafür.
- Was passiert, wenn die Anfrage nach den bestehenden Abrechnungen fehlschlägt: Der Auftrag nannte sie nicht als Fehlerfall.
- Die Vorschau und das Erstellen (Schritte 4 und 5) mit nur Seepark Residenz gewählt: Ich sollte nichts speichern.
