# Sven – Suche, Filter und Fokus nach Navigationen in den Listen (Issue 159)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, Zoom 100 %, nur Tastatur, beurteilt über den Accessibility-Baum (`ariaSnapshot`) und das fokussierte Element (`document.activeElement`). Nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/sven-issue-159/` (`flow.mjs`, `extra.mjs`, `extra2.mjs`, `extra3.mjs`; Screenshots `a01…a09`, `b01…b09`, `r01…r09`, `x01…x07`, `y01…y10`, `z01…z03`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnungen, Gebäude (leere Liste) | Der Link «Filter zurücksetzen» in der leeren Liste setzt den Fokus an den Seitenanfang (body). Der gleichnamige Knopf im Suchformular setzt ihn dagegen auf die Überschrift «13 Wohnungen». Ich höre nach dem Link nur «Wohnungen - Dwello», also denselben Seitentitel wie vorher, und weiss nicht, dass die Liste wieder voll ist. |
| P-2 | Minor | Wohnungen, Gebäude, Rechnungen | Nach Zurück und Vorwärts im Browser steht der Fokus am Seitenanfang. Angesagt wird nur der Seitentitel, nicht die Anzahl Treffer und nicht, welche Suche gilt. Die Felder stimmen dabei (siehe unten). Ich muss aber selbst zur Ergebnis-Überschrift springen, um zu merken, was gerade angezeigt wird. |
| P-3 | Minor | Wohnungen, Rechnungen (Seitenwechsel) | Nach «Nächste Seite» steht der Fokus am Seitenanfang, angesagt wird nur der Seitentitel. Nach einer Suche landet der Fokus dagegen auf der Ergebnis-Überschrift. «Seite 2 von 5» finde ich erst, wenn ich wieder bis ans Listenende gehe. |
| P-4 | Minor | Rechnungen (leere Liste) | Die leere Liste bietet keinen Weg zurück, der nach der Meldung kommt. Es gibt nur den Knopf «Filter zurücksetzen» im Formular vor der Überschrift. Der Text sagt «Versuchen Sie es mit anderen Filtern.». Mit Tab vorwärts ab «Keine Rechnungen gefunden» brauchte ich 28 Tabs (einmal rund um die Seite), bis ich den Knopf erreichte. Bei Wohnungen und Gebäude folgt der Link direkt nach der Meldung (1 Tab). |

Was gut ist, und das war der Kern meiner Aufgabe: **Das Suchfeld und die Filter zeigen in jedem geprüften Zustand genau das, was die Liste zeigt.** Das gilt nach einer Suche, nach dem Zurücksetzen (Link und Knopf), nach Zurück und Vorwärts (auch zwei- und dreimal zurück), nach dem Seitenwechsel und nach dem Neuladen. Es gilt für alle Felder: Suche, Gebäude, Mietstatus, Ort, Kategorie, Umlagefähigkeit, Jahr. Nach einer Suche mit Enter und nach dem Knopf «Filter zurücksetzen» landet der Fokus jedes Mal auf der Ergebnis-Überschrift («1 Wohnung», «8 Rechnungen», «Keine Gebäude gefunden»). Das ist genau, was ich brauche.

## Beobachtungen

- Die Überschrift mit der Anzahl («13 Wohnungen», «3 Gebäude») ist Ebene 2, und jede einzelne Wohnung oder jedes Gebäude darunter ist ebenfalls Ebene 2. In der Überschriften-Liste meines Screenreaders stehen sie gleichrangig nebeneinander. Ebene 3 für die Einträge wäre logischer.
- Wohnungen und Gebäude legen das Suchformular in einen «search»-Bereich (Landmark). Bei Rechnungen fehlt dieser Bereich, dort finde ich das Formular nicht über die Landmark-Navigation.
- Der Bereich «search» hat keinen Namen. Bei nur einem Suchbereich pro Seite ist das verkraftbar.
- Vom Seitenanfang bis zum Suchfeld sind es 19 Tabs (Sprunglink, Kopfzeile, ganze Hauptnavigation). Der Sprunglink «Zum Inhalt springen» hilft, aber nach jedem Seitenwechsel, Zurück oder Zurücksetzen per Link fange ich wieder oben an.
- Die Ansage bei jeder Navigation ist nur der Seitentitel («Wohnungen - Dwello»). Der Titel ändert sich mit Suche oder Filter nicht. Ein Titel wie «Wohnungen: Suche „A1“ – 1 Wohnung» würde mir nach Zurück und Vorwärts viel sagen.
- In der leeren Liste von Wohnungen und Gebäuden gibt es zweimal «Filter zurücksetzen»: einmal als Knopf im Formular und einmal als Link in der Meldung. Gleicher Name, aber unterschiedliches Verhalten beim Fokus (P-1).
- Wenn ich bei Rechnungen nur einen Filter ändere, ohne «Suchen» zu drücken, erscheint schon der Knopf «Filter zurücksetzen», obwohl die Liste noch ungefiltert ist. Das hat mich nicht gestört, es fiel mir nur auf.
- Enter auf einer geschlossenen Auswahlliste (Jahr) öffnete im Browser das Aufklappmenü, statt die Suche abzuschicken. Das ist Browser-Verhalten. Abgeschickt habe ich mit «Suchen».
- Jeder Filter heisst «… (optional)». Das ist korrekt, aber bei fünf Filtern höre ich «optional» fünfmal.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten. Pro Liste rund 9 Schritte (öffnen über die Navigation, 3 Suchen, Zurücksetzen, 2× Zurück, Vorwärts), dazu Zusatzschritte: Filter per Auswahlliste, Seitenwechsel, Ort-Filter, Neuladen. Insgesamt etwa 45 Navigationen.

## Ablauf

Einstieg jeweils über die Übersicht: 7 Tabs bis «Wohnungen» in der Hauptnavigation, Enter.

### Wohnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Wohnungen öffnen | Seitentitel wird angesagt | «Wohnungen - Dwello» angesagt, Fokus am Seitenanfang. 19 Tabs bis «Suche (optional)». Felder leer bzw. «Alle Gebäude», «Alle». |
| «Gibt es nicht» + Enter | Hinweis, dass nichts gefunden wurde, Fokus dort | Fokus auf Überschrift «Keine Wohnungen gefunden», danach Text «Keine Wohnung passt zu Ihrer Suche. Wählen Sie andere Filter oder zeigen Sie alle Wohnungen.». Suchfeld zeigt «Gibt es nicht». Stimmt. |
| Tab, dann Link «Filter zurücksetzen» | Liste wieder voll, Fokus auf Ergebnis-Überschrift wie nach der Suche | Liste voll (13 Wohnungen), alle Felder leer. Stimmt. **Fokus aber am Seitenanfang**, angesagt nur «Wohnungen - Dwello» (P-1). 20× Shift+Tab zurück bis zum Suchfeld. |
| «1.01» + Enter | 1 Treffer, Fokus auf Anzahl | Fokus auf «1 Wohnung», Feld «1.01». Stimmt. |
| «A1» + Enter | 1 Treffer | Fokus auf «1 Wohnung», Liste «Wohnung A1», Feld «A1». Stimmt. |
| Zurück (Alt+Links) | Liste und Feld zeigen «1.01» | Liste «Wohnung 1.01», Feld «1.01». Stimmt. Fokus am Seitenanfang, Ansage nur Titel (P-2). |
| Vorwärts (Alt+Rechts) | «A1» | Liste und Feld «A1». Stimmt. Fokus am Seitenanfang. |
| Noch zweimal bzw. dreimal zurück | volle Liste, dann «Gibt es nicht» | Volle Liste mit leerem Feld, dann leere Liste mit Feld «Gibt es nicht». Stimmt. |
| Zusatz: Gebäude «Seepark Residenz» + Mietstatus «Vermietet» mit Pfeiltasten, «Suchen» | Auswahl wirkt erst nach «Suchen» | Erst nach «Suchen» gefiltert. Fokus auf «3 Wohnungen», beide Auswahllisten zeigen die Wahl. |
| Zusatz: Knopf «Filter zurücksetzen» | volle Liste | Fokus auf «13 Wohnungen». Gut. Zurück/Vorwärts danach: Auswahllisten zeigen jeweils richtig «Seepark Residenz/Vermietet» bzw. «Alle». |
| Zusatz: «Nächste Seite» | Fokus auf Liste oder Seitenangabe | Seite 2, Fokus am Seitenanfang, Ansage nur Titel (P-3). Zurück: Seite 1, Felder stimmen. |

### Gebäude

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Öffnen | Titel | «Gebäude - Dwello», 19 Tabs bis zur Suche. |
| «Gibt es nicht» + Enter | leere Liste | Fokus auf «Keine Gebäude gefunden», Feld stimmt. |
| Link «Filter zurücksetzen» (1 Tab) | volle Liste, Fokus auf Anzahl | Volle Liste, Felder leer. Fokus am Seitenanfang (P-1). |
| «Seepark» + Enter, dann «Alpenblick» + Enter | je 1 Treffer | Fokus jeweils auf «1 Gebäude», Feld stimmt. |
| Zurück, Vorwärts, 2× und 3× zurück | Felder folgen der Liste | Jedes Mal stimmen Feld und Liste («Seepark», «Alpenblick», leer, «Gibt es nicht»). Fokus jedes Mal am Seitenanfang (P-2). |
| Zusatz: Ort «Luzern», dann «Zürich», zurück, neu laden | Ort-Feld folgt | Ort-Feld zeigt jeweils den Ort der Liste, auch nach dem Neuladen. |

### Rechnungen

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Öffnen | Titel | «Rechnungen - Dwello», 83 Rechnungen, Seite 1 von 5, 19 Tabs bis zur Suche. Das Suchfeld hat die Hilfe «Rechnungssteller oder Beschreibung» richtig angehängt. |
| «Gibt es nicht» + Enter | leere Liste, ein Weg zurück danach | Fokus auf «Keine Rechnungen gefunden», Text «Versuchen Sie es mit anderen Filtern.». Danach kommt kein Link. 28 Tabs vorwärts (einmal rund um die Seite) bis zum Knopf «Filter zurücksetzen» vor der Überschrift (P-4). |
| Knopf «Filter zurücksetzen» | volle Liste | Fokus auf «83 Rechnungen», alle Felder auf «Alle…». Gut. |
| «ewz» + Enter, «BKW» + Enter | Treffer | «8 Rechnungen» bzw. «4 Rechnungen», Fokus darauf, Feld stimmt. |
| Zurück, Vorwärts, 2× und 3× zurück | Felder folgen | Stimmt jedes Mal. Fokus am Seitenanfang (P-2). |
| Zusatz: Umlagefähigkeit «Nicht umlagefähig» + Jahr «2025», «Suchen» | Filter wirken | Leere Liste, beide Auswahllisten zeigen die Wahl. Zurück: alle auf «Alle». Vorwärts: wieder «Nicht umlagefähig/2025». |
| Zusatz: «Nächste Seite» (65 Tabs von oben) | Fokus auf Liste | Seite 2 von 5, Fokus am Seitenanfang (P-3). Zurück: Seite 1, Felder stimmen. |
| Zusatz: «nicht abgeschickt» getippt, ohne Enter zurück | Feld zeigt die Suche der vorherigen Liste | Feld zeigt «ewz», Liste 8 Rechnungen. Stimmt, kein Rest meiner Eingabe. |

## Verwirrung

- Nach dem Link «Filter zurücksetzen» und nach Zurück höre ich denselben Titel wie vorher. Ob überhaupt etwas passiert ist, merke ich erst über die Überschriften-Navigation.
- Zwei Bedienelemente mit demselben Namen «Filter zurücksetzen» (Knopf und Link) verhalten sich unterschiedlich.
- Bei Rechnungen sagt die leere Liste nicht, wo ich die Filter zurücksetzen kann. Bei Wohnungen heisst es «oder zeigen Sie alle Wohnungen» mit Link.
- Unklare Fachbegriffe waren in diesem Ablauf keine dabei.

## Fehlerrisiken

- Nach Zurück im Browser könnte ich glauben, die Liste sei ungefiltert, weil nur der Seitentitel kommt. Die Felder stimmen zwar, aber ich lese sie erst, wenn ich hinnavigiere.
- In der leeren Rechnungsliste kann ich mit Tab vorwärts lange herumirren und am Ende in der Hauptnavigation landen, bevor ich den Knopf finde.

## Vorschläge

- **P-1:** Reproduktion: Wohnungen → Suche «Gibt es nicht» + Enter → Tab → Enter auf Link «Filter zurücksetzen». Ergebnis: Fokus auf body, Ansage «Wohnungen - Dwello». Gleich bei Gebäude. Hilfreich wäre, wenn der Fokus wie beim Knopf auf die Ergebnis-Überschrift («13 Wohnungen») gesetzt wird.
- **P-2:** Reproduktion: Wohnungen → «1.01» + Enter → «A1» + Enter → Zurück im Browser. Ergebnis: Fokus auf body, Ansage nur Titel. Hilfreich wäre, den Fokus auch nach Zurück und Vorwärts auf die Ergebnis-Überschrift zu setzen (oder sie anzusagen), oder die Suche und die Anzahl in den Seitentitel zu nehmen.
- **P-3:** Reproduktion: Rechnungen → Tab bis «Nächste Seite» → Enter. Ergebnis: Fokus auf body. Hilfreich wäre der Fokus auf der Ergebnis-Überschrift, die dann auch die Seite nennt (z. B. «83 Rechnungen, Seite 2 von 5»).
- **P-4:** Reproduktion: Rechnungen → «Gibt es nicht» + Enter → Tab vorwärts. Ergebnis: kein Weg zurück nach der Meldung, 28 Tabs bis zum Knopf. Hilfreich wäre derselbe Aufbau wie bei Wohnungen: ein Link «Filter zurücksetzen» direkt nach dem Text, und im Text der Hinweis, dass man alle Rechnungen zeigen kann.

## Nicht geprüft

- **Echtes Alt+Links und Alt+Rechts:** Im kopflosen Chromium des Persona-Kits löst die Tastenkombination keine Browser-Navigation aus, die Seite blieb stehen. Ich habe die Zurück- und Vorwärts-Funktion des Browsers stattdessen direkt aufgerufen (`page.goBack()`/`goForward()`). Das ist dieselbe Navigation, aber nicht über die Tastatur ausgelöst.
- **Was ein echter Screenreader (NVDA, VoiceOver) wirklich vorliest:** Ich habe den Accessibility-Baum, das fokussierte Element und die Änderungen der Live-Regionen gelesen. Die Live-Region sagte bei jeder Navigation nur den Seitentitel. Ob ein Screenreader einen gleichbleibenden Titel erneut vorliest, hängt vom Programm ab.
- Andere Listen (Mieter, Mietverträge, Abrechnungen) waren nicht Teil der Aufgabe.
- Mobile Ansicht und Zoom nicht geprüft (nicht mein Profil).
