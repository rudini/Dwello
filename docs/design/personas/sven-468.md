# Sven – #468: «Weiter» wartet, während ein Schritt lädt

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt am Accessibility-Baum (Playwright `ariaSnapshot`, Fokus über `document.activeElement`, Ansagen über einen MutationObserver auf `role=status`/`aria-live`). Persona-App auf :3300 mit Demodaten, nichts gespeichert (die Assistenten halten ihren Stand nur im Browser; ich habe nie «Erstellen» oder «Speichern» gedrückt).

Verzögerung: Ich habe die Antworten im Browser zurückgehalten, einmal mit festen 4 s (`page.route`, wie vorgegeben), und für die genaue Beobachtung mit einer Sperre, die ich von Hand freigebe:
- `/api/contracts?apartmentId=…`
- `/api/invoices?…` und `/api/statements/billed?…`
- `/api/statements/agreements?…`

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/e9211292-8906-5267-a76e-82d2c2cdf877/scratchpad/sven-468/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | alle drei gesperrten Schritte | Die gesperrte Schaltfläche «Bitte warten …» ist echt `disabled` und fällt aus der Tab-Reihenfolge. Mit Tab höre ich sie nie: Nach «Zurück» springt der Fokus direkt zu «Datenschutz» im Fussbereich. Ich weiss nicht, wo «Weiter» geblieben ist. |
| P-2 | Minor | «Abrechnungen erstellen», Schritt 2 «Gebäude» | Während die Rechnungszahl und «Schon abgerechnet» laden, gibt es keinen Statustext. Das einzige Zeichen ist die Schaltfläche «Bitte warten …», und die erreiche ich mit Tab nicht (P-1). Ich merke also gar nicht, dass gewartet wird, und auch nicht warum. |
| P-3 | Minor | «Neuer Mietvertrag», Schritt 2; «Abrechnungen erstellen», Schritt 3 | Die Wartetexte («Es wird geprüft, welche Wohnungen frei sind …», «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …») kommen zusammen mit ihrer `status`-Region ins Dokument. Gängige Screenreader sagen so etwas meist nicht an. Ich finde sie nur, wenn ich nach der Überschrift mit den Pfeiltasten weiterlese. |
| P-4 | Minor | alle drei Schritte | Das Ende des Wartens wird nicht angesagt. Aus «Bitte warten …» wird still «Weiter», die Wartetexte verschwinden still. Ob ich weiterkann, weiss ich nur, wenn ich wieder hinsuche. |
| P-5 | Minor | «Abrechnungen erstellen», Schritt 3 (auch Schritt 2) | Drücke ich während des Wartens Enter im Feld «Verwaltungspauschale in %», im «Heizprofil» oder auf einem Gebäude, passiert gar nichts: keine Ansage, keine Meldung. Eine Sekunde nach dem Laden bringt mich das gleiche Enter im gleichen Feld zu Schritt 4. Ohne Rückmeldung denke ich zuerst, dass Enter nicht geht. |
| P-6 | Nit | «Abrechnungen erstellen», Schritt 3 | Der Wartetext steht ganz am Ende des Schritts, nach dem Hinweis «Ohne vereinbarte Verwaltungspauschale» mit seinem Link. Beim Lesen von oben komme ich erst nach Heizprofil, Monatsanteilen, Pauschale und Hinweis dorthin. |

Keinen Blocker und keinen Major gefunden. Was #468 verspricht, stimmt: In allen drei Schritten heisst die Schaltfläche während des Wartens «Bitte warten …», ist gesperrt (`disabled`, `aria-busy="true"`) und heisst danach wieder «Weiter» (mit festen 4 s nachgeprüft: nach 0,3 s gesperrt, nach 4,8 s frei). Ein vorzeitiges Weitergehen war in keinem der drei Schritte möglich.

## Beobachtungen

- Den Fokus setzt die App bei jedem Schrittwechsel sauber auf die Überschrift «Schritt n von 5: …». So weiss ich immer, wo ich bin. Während des Wartens bleibt er dort. Kommen die Daten an, springt er nicht weg: Er blieb auf der Überschrift, im Feld oder auf «Zurück», je nachdem, wo ich gerade war.
- «Neuer Mietvertrag»: Die Verträge aller Wohnungen werden schon beim Öffnen von Schritt 1 geladen (13 Anfragen nach etwa 0,7 s). Die Sperre in Schritt 2 sieht nur, wer Schritt 1 schneller erledigt, als das Laden dauert. In meinem ersten Versuch mit 4 s Verzögerung war ich zu langsam und habe gar keine Sperre erlebt.
- «Neuer Mietvertrag», Schritt 2: Während des Wartens gibt es kein Auswahlfeld «Wohnung», nur den Wartetext. Das ist ehrlich, aber mit Tab finde ich im ganzen Schritt nur «Zurück».
- Bei acht von zehn Demo-Mietern meldet sich nach dem Laden der Hinweis «… hat einen Mietvertrag ohne Vertragsende» über eine schon vorhandene Statusregion. Dieser Hinweis wird angesagt und verrät mir nebenbei, dass das Laden fertig ist. Bei Sarah Meier, die keinen Vertrag hat, kommt nach dem Laden gar keine Ansage (zu P-4).
- «Abrechnungen erstellen», Schritt 2: Die Kontrollkästchen der Gebäude lassen sich während des Wartens bedienen. Ich habe Alpenblick angekreuzt, bevor «6 Rechnungen in der Abrechnungsperiode» und die «schon abgerechnet»-Beschreibungen da waren. Nach dem Laden war «Alle Gebäude» plötzlich angekreuzt (bei «1 von 3 gewählt»), weil «Alle Gebäude» die abgerechneten Gebäude auslässt. Das stimmt, kam aber unangekündigt.
- Den Hinweis «Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung …» hängt die App den abgerechneten Gebäuden als Beschreibung an (`aria-describedby`). Er ist im Baum also da, wenn auch nicht als eigener Absatz (der sichtbare Text ist `aria-hidden`). Für mich ist das gut.
- «Abrechnungen erstellen», Schritt 3: Der Hinweis «Ohne vereinbarte Verwaltungspauschale» (Kevin Fischer, Wohnung OG1) stand schon da, während `/api/statements/agreements` noch zurückgehalten wurde. Wartet der Schritt vielleicht auch auf diesen Hinweis, hat er ihn aus einer anderen Antwort?
- Nach jedem Seitenwechsel per Link (Übersicht → Assistent) liegt der Fokus auf `body`, nicht auf dem Seitentitel. Angesagt wird «Neuer Mietvertrag - Dwello» über eine Live-Region. Das gab es schon vor dieser Änderung.

## Aufgabe geschafft: ja

Beide Assistenten bis zu den verlangten Schritten durchlaufen («Neuer Mietvertrag» bis «Wohnung» und weiter bis «Vertragsdauer»; «Abrechnungen erstellen» 2025, Alpenblick, bis Schritt 3 und versuchsweise bis «Vorschau»). Jede Sperre habe ich beobachtet.

## Aufwand

Etwa 25 Minuten, 12 Durchläufe. Bis zur Sperre: «Mietvertrag erfassen» erreichte ich von der Übersicht mit 23 × Tab, danach je etwa 5 Tasten pro Schritt.

## Ablauf

1. **Übersicht → «Mietvertrag erfassen»** (23 × Tab, Enter). Erwartet: Fokus am Seitenanfang oder auf der Überschrift. Gesehen: Fokus auf `body`, angesagt «Neuer Mietvertrag - Dwello». In Ordnung.
2. **Schritt 1 «Mieter»**: Tab ins Auswahlfeld «Mieter», Pfeil nach unten, Tab zu «Weiter», Enter. Erwartet: Schritt 2. Gesehen: Fokus auf «Schritt 2 von 5: Wohnung».
3. **Schritt 2 «Wohnung», gesperrt.** Erwartet: ein Hinweis, dass geladen wird, und eine gesperrte, aber auffindbare Schaltfläche. Gesehen: Unter der Überschrift ein `status` «Es wird geprüft, welche Wohnungen frei sind …» (beim Einfügen sehr wahrscheinlich nicht angesagt, P-3). Kein Auswahlfeld. `button "Bitte warten …" [disabled]`. Tab ab der Überschrift: «Zurück» → «Datenschutz» → «Nutzungsbedingungen» → Seitenanfang (P-1). Enter auf der Überschrift: nichts. «Zurück» geht zu Schritt 1, und «Weiter» dort führt wieder in den gesperrten Schritt 2.
4. **Laden fertig.** Erwartet: eine Ansage wie «Wohnungen geladen» oder die Möglichkeit, «Weiter» zu finden. Gesehen: Das Auswahlfeld «Wohnung» erscheint, die Schaltfläche heisst still wieder «Weiter», der Fokus bleibt auf der Überschrift. Angesagt wird nur der Mietvertrags-Hinweis, bei Sarah Meier gar nichts (P-4). Tab → Hinweis-Link → «Wohnung» → … → «Weiter», Enter → «Schritt 3 von 5: Vertragsdauer».
5. **Übersicht → «Abrechnungen erstellen»**: Schritt 1 schlägt 01.01.2025 bis 31.12.2025 vor. Tab zu «Weiter», Enter.
6. **Schritt 2 «Gebäude», gesperrt.** Erwartet: ein Wartetext wie in den anderen Schritten. Gesehen: Fokus auf «Schritt 2 von 5: Gebäude», die vier Kontrollkästchen sind da und bedienbar, aber ohne Rechnungszahl. Kein Statustext, nur `button "Bitte warten …" [disabled]`, den Tab überspringt (P-2, P-1). Leertaste auf Alpenblick: angesagt «1 von 3 gewählt». Enter auf dem Kontrollkästchen: nichts, keine Ansage (P-5).
7. **Laden fertig.** Gesehen: Die Gebäude bekommen «… Rechnungen in der Abrechnungsperiode», Seepark Residenz und Musterhaus Zentrum ihre «schon abgerechnet»-Beschreibung, «Alle Gebäude» ist jetzt angekreuzt. Nichts davon wird angesagt (P-4). Der Fokus blieb auf «Zurück», ein Tab weiter liegt «Weiter».
8. **Schritt 3 «Heizprofil und Verwaltungspauschale», gesperrt.** Erwartet: Wartetext nahe der Überschrift. Gesehen: Fokus auf der Überschrift. Der `status` «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …» steht ganz unten im Schritt (P-6) und wird beim Erscheinen kaum angesagt (P-3). Tab: «Heizprofil» → «Verwaltungspauschale in %» → «Kevin Fischer, Wohnung OG1» → «Zurück» → Fussbereich (P-1). Enter im Feld «Verwaltungspauschale in %»: nichts, keine Meldung, Feld nicht ungültig. Enter im «Heizprofil»: ebenso nichts (P-5).
9. **Laden fertig.** Gesehen: Der Wartetext verschwindet still, «Weiter» ist frei, der Fokus bleibt im Feld (P-4). Dasselbe Enter im Feld führt jetzt zu «Schritt 4 von 5: Vorschau». Dort habe ich aufgehört und nichts erstellt.

## Verwirrung

- «Bitte warten …» sagt nicht, worauf ich warte. In zwei Schritten erklärt es ein Statustext, in Schritt 2 der Abrechnungen nicht (P-2).
- Die fehlende Schaltfläche in der Tab-Reihenfolge: Als Screenreader-Nutzer schliesse ich daraus zuerst «Dieser Schritt hat kein Weiter» oder «Ich habe etwas übersehen», nicht «Ich muss warten» (P-1).
- Ein stilles Enter: Dass Enter im Feld sonst weiterführt, lerne ich in den Assistenten schnell. Gerade deshalb verwirrt mich ein Enter ohne Folge und ohne Grund (P-5).
- Unklare Begriffe sind mir in den geprüften Texten keine aufgefallen. «Verwaltungspauschale» und «Heizprofil» sind am Feld erklärt.

## Fehlerrisiken

- In Schritt 2 der Abrechnungen kann ich Gebäude wählen, bevor ich weiss, dass sie schon abgerechnet sind. Erstellt wird dann zwar nichts dafür, aber das merke ich erst später.
- Wer durch P-1 die Seite verlässt, um «Weiter» zu suchen (Tab läuft in den Fussbereich und in die Hauptnavigation), landet leicht auf einem Link und verlässt den Assistenten. Der Stand bleibt zwar im Browser, aber man ist raus.
- Kein Risiko, falsche Daten zu speichern: Die Sperre selbst hält dicht.

## Vorschläge

- **P-1** (alle drei Schritte). Reproduktion: `/api/contracts?apartmentId=…` um 4 s verzögern, Mieter wählen, «Weiter», dann ab der Überschrift Tab drücken. Fokus: «Zurück» → «Datenschutz». Hilfreich: die Schaltfläche während des Wartens mit `aria-disabled="true"` statt `disabled` in der Tab-Reihenfolge lassen und das Absenden im Code abfangen. Dann hört man «Bitte warten …, nicht verfügbar». Noch besser: den Wartetext per `aria-describedby` an die Schaltfläche hängen.
- **P-2** (Abrechnungen, Schritt 2). Reproduktion: `/api/invoices?…` und `/api/statements/billed?…` verzögern, in Schritt 1 «Weiter». Im Baum steht kein Statustext. Hilfreich: ein Wartetext wie in den anderen Schritten, etwa «Dwello zählt die Rechnungen und prüft, welche Gebäude schon abgerechnet sind …».
- **P-3** (Mietvertrag Schritt 2, Abrechnungen Schritt 3). Reproduktion wie oben. Ein MutationObserver zeigt: Die `status`-Region wird mit ihrem Text zusammen eingefügt. Hilfreich: Die Statusregion steht schon leer im Schritt, und erst danach kommt der Text hinein. Oder ein gemeinsamer Ansage-Bereich des Assistenten, den es beim Schrittwechsel schon gibt.
- **P-4** (alle drei). Reproduktion: Verzögerung freigeben und den Fokus nicht bewegen. Nichts wird angesagt (bei «Neuer Mietvertrag» mit Sarah Meier gut zu sehen). Hilfreich: im gleichen Statusbereich kurz «Geladen. Sie können weiter.» ansagen, oder den Wartetext durch einen kurzen Fertig-Text ersetzen, statt ihn zu entfernen.
- **P-5** (Abrechnungen Schritt 3 und 2). Reproduktion: `/api/statements/agreements?…` verzögern, in Schritt 3 ins Feld «Verwaltungspauschale in %» und Enter. Nichts passiert. Hilfreich: Enter während des Wartens sagt den Wartetext an (z. B. «Bitte warten: Dwello prüft noch …») oder geht nach dem Laden von selbst weiter.
- **P-6** (Abrechnungen Schritt 3). Reproduktion wie P-5, Baum von oben lesen. Hilfreich: den Wartetext direkt unter die Schrittüberschrift oder neben die Schaltfläche setzen.

## Nicht geprüft

- Echte Screenreader (NVDA, JAWS, VoiceOver): Ob Statusregionen angesagt werden, die samt Text eingefügt werden, habe ich nur aus dem DOM-Verlauf und dem üblichen Verhalten geschlossen, nicht abgehört.
- Ob `aria-busy` an der Schaltfläche von einem Screenreader vorgelesen wird: Der Playwright-Baum zeigt es nicht, im DOM steht es.
- Fehlschlagende Anfragen (500 statt Verzögerung) waren nicht Teil der Aufgabe.
- Andere Sprachen, Mobile und Zoom: nicht Teil von Svens Profil für diese Aufgabe.
- Weiter als bis «Vorschau»: nichts erstellt, wie verlangt.
