# Sven – Abrechnungen erstellen, Schritt 3: Prüfung der vereinbarten Nebenkosten fällt aus oder lädt (Runde 439)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, Zoom 100 %, bewertet über den Accessibility-Baum (`readOut`), den Fokus (`document.activeElement`) und einen Mitschnitt aller Änderungen in Live-Regionen (`role=alert`, `role=status`, `aria-live`). Nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/sven-439/` (`run.mjs fail|delay`, `run2.mjs`, `run3.mjs`, Protokolle `fail.log`, `delay.log`).

Fehlschlag simuliert per Playwright-Route auf `**/api/statements/agreements**`: einmal `500`, einmal 8 s Verzögerung und danach die echte Antwort. Die Seite ruft beim Wechsel auf Schritt 3 genau diese Anfrage auf: `GET /api/statements/agreements?buildingIds=3333…&periodStart=2025-01-01&periodEnd=2025-12-31`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Schritt 3, Prüfung fehlgeschlagen, nach «Weiter» | Nach «Weiter» kündigt der Screenreader nur «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» an. Dass die Prüfung **fehlgeschlagen** ist und dass ich «Erneut versuchen» wählen soll, sagt dieser Satz nicht. Für mich klingt er, als würde Dwello noch prüfen, also warte ich. Der Grund steht in einem anderen Alert, der beim Öffnen des Schritts kam, im selben Moment, in dem der Fokus auf die Überschrift springt. Gut möglich, dass ich ihn nie gehört habe. Der Fokus bleibt auf «Weiter». |
| P-2 | Major | Schritt 3, «Erneut versuchen» | Drücke ich «Erneut versuchen», verliert der Fokus seinen Platz und landet auf `body`. Das passiert bei erneutem Fehler und bei Erfolg. Der Knopf wird entfernt und neu gebaut. Mein Screenreader hat dann keinen Ort mehr, und es wird kein Ergebnis angesagt. |
| P-3 | Major | Schritt 3, Prüfung lädt (8 s), nach «Weiter» | Wenn die Prüfung fertig ist, wird nichts angesagt. Der Alert «Es geht erst weiter …» und der Status «Dwello prüft …» verschwinden still. Ich erfahre nicht, wann ich «Weiter» noch einmal drücken kann. Ich muss immer wieder «Weiter» drücken, um es herauszufinden. |
| P-4 | Minor | Schritt 3, «Weiter» mehrmals gedrückt | Drücke ich «Weiter» ein zweites Mal, bleibt derselbe Alert-Knoten mit demselben Text stehen. Es wird also nichts angesagt, und für mich passiert scheinbar nichts. |
| P-5 | Minor | Schritt 3, Prüfung erfolgreich nach «Erneut versuchen» | Bei Erfolg wird nichts angesagt (kein «Mietverträge geprüft» o. ä.). Die Fehlerbox verschwindet einfach. Siehe auch P-2: Der Fokus liegt danach auf `body`. |

## Beobachtungen

- Die Fehlerbox selbst ist gut: `role=alert`, Titel «Vereinbarte Nebenkosten nicht geprüft», Text «Dwello konnte nicht prüfen, ob die Mietverträge alle Nebenkosten dieser Periode vereinbaren. Ohne diese Prüfung geht es nicht weiter. Wählen Sie «Erneut versuchen».», und der Knopf «Erneut versuchen» steht direkt darin. Wenn ich die Box finde, weiss ich, was passiert ist und was ich tun soll.
- Der Hinweis nach «Weiter» steht im DOM direkt vor «Zurück»/«Weiter». Mit zweimal Umschalt+Tab komme ich von «Weiter» auf «Erneut versuchen». Das findet man, aber nur wenn man weiss, dass es den Knopf gibt.
- «Weiter» hat weder `aria-describedby` auf den Hinweis noch `aria-disabled`. Er bleibt ein normaler Absenden-Knopf.
- Beim Laden steht im Schritt `role=status` mit «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …». Beim ersten Öffnen kommt er zusammen mit dem ganzen Schritt in den Baum, also schon mit Text gefüllt. Ob ein Screenreader das ansagt, ist unsicher, zumal der Fokus gleichzeitig auf die Überschrift geht. Nach «Erneut versuchen» kommt der Status einzeln dazu und wird wahrscheinlich angesagt.
- Im Fehlerfall steht nach «Weiter» der Satz «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» sichtbar unter der roten Box. Er bleibt auch nach einem weiteren fehlgeschlagenen «Erneut versuchen» stehen. Nach einem erfolgreichen Versuch verschwindet er.
- Im Fall mit Verzögerung führt «Weiter» nach dem Laden ohne Weiteres zu «Schritt 4 von 5: Vorschau». Der Fokus liegt auf der Überschrift, und es kommt die Ansage «Vorschau wird berechnet …». Das ist gut.
- Beim Schrittwechsel geht der Fokus jedes Mal auf die h2 «Schritt n von 5: …». Das ist gut. Die Schritte 1 und 2 gingen per Tastatur problemlos: 24 Tab zu «Weiter» in Schritt 1, Leertaste auf der Checkbox «Alpenblick», die Ansage «1 von 3 gewählt» (polite).
- Ein Screenshot (`fail-04-after-weiter.png`) zeigt die rote Box mit Knopf, darunter fett den Satz «Es geht erst weiter …». Dass die Kopfzeile mitten im Bild erscheint, kommt vom Ganzseiten-Screenshot (sticky header) und ist kein Befund.

## Aufgabe geschafft: ja

Schritt 3 erreicht, «Weiter» in beiden Fällen gedrückt, Ansagen und Fokus beurteilt.

## Aufwand

Etwa 15 Minuten, 5 Skriptläufe. Bis Schritt 3: 24 Tab + Enter, 2 Tab + Leertaste, 4 Tab + Enter. Auf Schritt 3 bis «Weiter»: 6 Tab im Fehlerfall, 5 Tab beim Laden.

## Ablauf

1. **/statements/generate öffnen.** Erwartet: Assistent mit Schritt 1. Gesehen: h1 «Abrechnungen erstellen», «Schritt 1 von 5: Abrechnungsperiode», Beginn 01.01.2025, Ende 31.12.2025 schon vorausgefüllt. Ich musste nichts ändern.
2. **Tab zu «Weiter», Enter.** Erwartet: Schritt 2, Fokus dort. Gesehen: Fokus auf h2 «Schritt 2 von 5: Gebäude».
3. **Tab zur Checkbox «Alpenblick», Leertaste.** Erwartet: angekreuzt, Ansage. Gesehen: checked, polite «1 von 3 gewählt».
4. **Tab zu «Weiter», Enter (Route 500).** Erwartet: Schritt 3, dort ein Hinweis, dass die Prüfung nicht ging. Gesehen: Fokus auf h2 «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Etwa 50 ms später wird der Alert «Vereinbarte Nebenkosten nicht geprüft …» eingefügt. Er konkurriert mit der Ansage der Überschrift.
5. **Tab durch Schritt 3.** Gesehen: Heizprofil (Combobox) → Verwaltungspauschale in % → Link «Kevin Fischer, Wohnung OG1» → «Erneut versuchen» → «Zurück» → «Weiter».
6. **«Weiter» drücken (Fehlerfall).** Erwartet: Der Assistent bleibt stehen und sagt mir, dass die Prüfung fehlgeschlagen ist und ich «Erneut versuchen» wählen soll, am besten mit dem Fokus auf der Fehlerbox oder dem Knopf. Gesehen: neuer `role=alert` «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.», der Fokus bleibt auf «Weiter». Den Grund und die Lösung höre ich hier nicht (P-1).
7. **«Weiter» noch einmal.** Erwartet: wieder eine Ansage. Gesehen: nichts, gleicher Knoten, gleicher Text (P-4).
8. **Umschalt+Tab ×2 zu «Erneut versuchen», Enter (weiter 500).** Erwartet: Ansage «prüft …», dann wieder der Fehler, Fokus auf dem Knopf. Gesehen: Status «Dwello prüft …», dann wieder der Alert mit dem Fehler, aber der Fokus liegt auf `body` (P-2).
9. **Dasselbe mit erfolgreicher Antwort.** Erwartet: Ansage «geprüft», Fokus sinnvoll. Gesehen: Status «Dwello prüft …», dann verschwindet die Box ohne Ansage, Fokus auf `body`. Der nächste Tab landet auf «Zurück» (P-2, P-5).
10. **Neuer Lauf, Route 8 s Verzögerung, bis Schritt 3.** Gesehen: Fokus auf h2. Im Baum steht `status` «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …», es gibt keinen «Erneut versuchen».
11. **«Weiter» während des Ladens.** Erwartet: «Dwello prüft noch, bitte warten. Ich sage Bescheid.» Gesehen: Alert «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.», Fokus auf «Weiter». Zusammen mit dem Status daneben ist das hier verständlich.
12. **Warten, bis die Antwort da ist (etwa 8 s).** Erwartet: Ansage, dass die Prüfung fertig ist und es weitergeht. Gesehen: Status und Alert verschwinden still, es wird nichts angesagt (P-3).
13. **«Weiter» erneut.** Gesehen: Schritt 4 «Vorschau», Fokus auf h2, Ansage «Vorschau wird berechnet …».

## Verwirrung

- «Es geht erst weiter, wenn Dwello die Mietverträge geprüft hat.» bedeutet im Fehlerfall und beim Laden dasselbe. Beim Laden stimmt es. Beim Fehler führt es mich in die Irre, denn die Prüfung läuft gar nicht mehr, und von allein geht es nie weiter.
- Titel «Vereinbarte Nebenkosten nicht geprüft» und Text «… ob die Mietverträge alle Nebenkosten dieser Periode vereinbaren»: Ich verstehe, dass Dwello etwas prüfen wollte. Warum das für meine Abrechnung wichtig ist, sagt der Text nicht. Für diese Runde ist das kein Befund.

## Fehlerrisiken

- Ich warte im Fehlerfall endlos, weil die Ansage nach «Weiter» nach «läuft noch» klingt (P-1).
- Nach «Erneut versuchen» liegt der Fokus auf `body`. Je nach Screenreader springt der virtuelle Cursor an den Anfang der Seite, und ich muss den Schritt neu durchsuchen (P-2).
- Beim Laden drücke ich «Weiter» immer wieder, um herauszufinden, ob die Prüfung fertig ist (P-3, P-4).

## Vorschläge

- **P-1:** Bis Schritt 3 gehen, `/api/statements/agreements` mit 500 beantworten, «Weiter» drücken. Hilfreich: Im Fehlerfall sollte nach «Weiter» ein Text kommen, der den Grund und die Lösung nennt, z. B. «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen».». Oder der Fokus geht auf «Erneut versuchen» bzw. auf den Titel der Fehlerbox. Der Text «Es geht erst weiter, wenn …» passt nur zum Laden.
- **P-2:** Wie P-1, dann Umschalt+Tab ×2, Enter auf «Erneut versuchen». Hilfreich: Den Knopf beim Neuversuch stehen lassen oder den Fokus gezielt setzen. Bei erneutem Fehler zurück auf «Erneut versuchen», bei Erfolg auf «Weiter» oder die Schrittüberschrift.
- **P-3:** Bis Schritt 3 gehen, die Anfrage um 8 s verzögern, sofort «Weiter» drücken und warten. Hilfreich: Wenn die Prüfung nach einem blockierten «Weiter» fertig wird, eine polite Ansage wie «Mietverträge geprüft. Sie können weiter.». Oder nach einem «Weiter», das wegen des Ladens blockiert war, automatisch weitergehen.
- **P-4:** Im Fehlerfall oder beim Laden «Weiter» zweimal drücken. Hilfreich: Den Hinweis bei jedem blockierten «Weiter» neu ansagen, also den Knoten neu einfügen oder den Text kurz leeren und neu setzen.
- **P-5:** Wie P-2, aber diesmal mit erfolgreicher Antwort. Hilfreich: Eine kurze Statusansage, dass die Prüfung erfolgreich war.

## Nicht geprüft

- Einen echten Screenreader (NVDA, JAWS, VoiceOver) habe ich nicht verwendet. Was angesagt wird, schliesse ich aus dem Accessibility-Baum und den Änderungen in Live-Regionen. Ob der Alert beim Öffnen von Schritt 3 neben der Fokusansage der Überschrift tatsächlich gesprochen wird, kann ich deshalb nicht sicher sagen.
- Andere Sprachen, Mobilgerät und Zoom waren nicht Teil der Aufgabe.
- Wie es weitergeht, wenn die Prüfung erfolgreich ist und dabei Mietverträge findet, die nicht alle Nebenkosten vereinbaren: Mit «Alpenblick» kam dazu kein Hinweis, und es war nicht Teil der Aufgabe.
