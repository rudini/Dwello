# Sven: Filter-Auswahlfelder wenden sofort an (#662)

Ich bin Sven, blind, mit Screenreader und nur mit der Tastatur unterwegs (Desktop 1440 × 900). Ich habe alles über den Accessibility-Tree beurteilt. Gespeichert habe ich nichts, ich habe nur gefiltert.

Aufgabe: Rechnungen nach Gebäude, Kategorie und Jahr filtern, danach Wohnungen nach Gebäude und Mietstatus. Die Auswahlfelder habe ich mit den Pfeiltasten geändert.

| ID  | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| S-1 | Major | Rechnungen, Wohnungen (Suche und Filter) | Nach einer Änderung im Auswahlfeld wird nichts über das Ergebnis angesagt. Die beiden `status`-Bereiche im Formular bleiben leer. Ob 8, 1 oder «Keine Rechnungen gefunden» herauskommt, erfahre ich nur, wenn ich das Feld verlasse und die Überschrift der Liste suche. |
| S-2 | Minor | Rechnungen, Wohnungen | Jeder Druck auf eine Pfeiltaste lädt die Liste neu und legt einen eigenen Eintrag im Browserverlauf an. Wenn ich in «Kategorie» zu «Schädlingsbekämpfung» will, sind das 20 Ladevorgänge. «Zurück» geht danach jede Zwischenauswahl einzeln durch, statt zur Seite vor dem Filtern. |
| S-3 | Minor | Rechnungen, Wohnungen | Bei der ersten Änderung eines Auswahlfelds auf einer Seite sagt die Seite «Rechnungen - Dwello» bzw. «Wohnungen - Dwello» an (assertive). Das unterbricht die Ansage der gewählten Option und klingt wie ein Seitenwechsel. Bei späteren Änderungen kommt nichts mehr. |
| S-4 | Minor | Rechnungen, Jahr mit leerem Ergebnis (`?year=2021`) | Steht nur ein Jahr ohne Rechnungen im Filter, kommt der leere Zustand «Für 2021 sind noch keine Rechnungen erfasst». Dort gibt es kein «Filter zurücksetzen», weder als Knopf im Formular noch als Link, obwohl ein Filter in der Adresse steht. Nach «Suchen» springt Tab direkt zu «Rechnung erfassen». |

## Beobachtungen

- Der Fokus bleibt bei jeder Änderung im Auswahlfeld. Der Tree meldet danach immer noch `combobox "Gebäude"` usw. mit der neuen Option als `[selected]`. Das ist gut. Ich kann mit den Pfeilen weitergehen und erreiche jede Option.
- Auch bei schnellen Tastendrücken (20 × Pfeil runter ohne Pause, 6 × im Abstand von 250 ms) stimmen am Ende der gewählte Wert, die Adresse und die Liste überein. Nichts springt auf eine ältere Auswahl zurück.
- Die Suche nach Anfangsbuchstaben funktioniert: «Hau» in «Kategorie» landet bei «Hauswart». Das sind 2 Ladevorgänge statt 8 Pfeildrücke.
- Mit Alt+Pfeil runter öffne ich die Liste. Dann lösen die Pfeiltasten nichts aus, erst Enter wendet an (1 Ladevorgang). Das wissen aber nicht alle Screenreader-Nutzer.
- Text, den ich in «Suche» getippt, aber nicht gesendet hatte («Hauswart»), wurde beim Wechsel des Gebäudes mitgeschickt (`?search=Hauswart&building=…`). Der Text blieb im Feld stehen. So war es angekündigt.
- «Filter zurücksetzen» erscheint als Knopf nach «Suchen», sobald ein Auswahlfeld etwas gesetzt hat. Nach Enter steht der Fokus auf der Überschrift der Liste, zum Beispiel «Rechnungen 1–20 von 83, Seite 1 von 5». Da höre ich die Anzahl. Genau das fehlt beim Ändern eines Auswahlfelds (S-1).
- Bei 0 Treffern («Keine Rechnungen gefunden», «Keine Wohnungen gefunden») gibt es statt des Knopfs einen Link «Filter zurücksetzen» unter dem Hinweis. Er ist per Tab nach «Suchen» erreichbar.
- Beim Durchgehen mit den Pfeilen komme ich an leeren Zwischenständen vorbei, zum Beispiel «Vermietet ab …» bei Seepark Residenz oder Jahr 2026. Da hört man nichts davon, aber die Seite baut sich jedes Mal um.
- Die Gebäude stehen nicht überall in derselben Reihenfolge: bei Rechnungen Alpenblick, Seepark Residenz, Musterhaus Zentrum, bei Wohnungen alphabetisch. Zu Seepark Residenz brauche ich deshalb einmal 2 Pfeildrücke, einmal 3.
- Die Überschrift der Liste hat zwei Formen: «14 Rechnungen», wenn alles auf eine Seite passt, sonst «Rechnungen 1–20 von 30, Seite 1 von 2».
- Mit Fokus im Auswahlfeld löste Alt+Pfeil links kein «Zurück» aus. Ich habe das über den Verlauf des Browsers geprüft.

## Aufgabe geschafft: ja

Rechnungen: Seepark Residenz, Hauswart, 2025 mit Suche «Hauswart» ergab «4 Rechnungen». Wohnungen: Seepark Residenz, Leer ergab «1 Wohnung» (Wohnung B1). Die Anzahl habe ich jeweils nur gefunden, weil ich danach die Überschrift gesucht habe.

## Aufwand

Etwa 25 Minuten, 11 Skriptläufe. Rechnungen: 21 Tabs bis «Gebäude» (der ganze Seitenkopf und die Navigation kommen vorher), dann 2 Pfeile, 1 Tab, «Hau» tippen, 2 Tabs, 2 Pfeile, also 7 Ladevorgänge. Wohnungen: 3 Pfeile, 1 Tab, 3 Pfeile, also 6 Ladevorgänge.

## Ablauf

1. Rechnungen, «Gebäude», Pfeil runter. Erwartet: Die Liste wird gefiltert und ich höre, wie viele Rechnungen es sind. Gesehen: Die Liste wurde neu geladen, der Fokus blieb im Feld, aber angesagt wurde nur «Rechnungen - Dwello». Eine Anzahl kam nicht.
2. Weitere Pfeildrücke. Erwartet: Wenigstens die neue Anzahl wird angesagt. Gesehen: Jedes Mal ein Ladevorgang, keine Ansage.
3. Nach drei Pfeildrücken «Zurück». Erwartet: Ich lande wieder auf der Liste ohne Filter. Gesehen: Jede Zwischenauswahl war ein eigener Verlaufseintrag (Verlauf von 2 auf 5 Einträge).
4. Jahr 2021 (End). Erwartet: «Filter zurücksetzen», wie bei den anderen Filtern. Gesehen: «Für 2021 sind noch keine Rechnungen erfasst» und nur «Rechnung erfassen».

## Vorschläge

- **S-1:** Rechnungen öffnen, mit Tab zu «Gebäude», Pfeil runter, dann den Tree lesen: Die `status`-Bereiche im Formular sind leer, und den Fokus behält das Feld. Nach dem Laden sollte der vorhandene `status` die Überschrift der Liste ansagen, also «8 Rechnungen» oder «Keine Rechnungen gefunden» (polite, damit die Option zuerst kommt). Der Fokus bleibt dabei im Feld.
- **S-2:** Rechnungen, «Kategorie», 20 × Pfeil runter: 20 Anfragen `__data.json`, und der Verlauf wächst um 20 Einträge. Die Adresse sollte beim sofortigen Anwenden ersetzt werden statt einen Eintrag anzuhängen. Ausserdem würde ein kurzes Warten nach dem letzten Tastendruck helfen, bevor geladen wird (etwa eine halbe Sekunde). Dann laden schnelle Pfeildrücke nur einmal.
- **S-3:** Wohnungen öffnen, mit Tab zu «Gebäude», Pfeil runter: Der assertive Bereich am Seitenende bekommt «Wohnungen - Dwello». Bei einer Filteränderung auf derselben Seite sollte der Seitentitel nicht angesagt werden, sondern nur das Ergebnis (siehe S-1).
- **S-4:** Rechnungen, «Jahr», End (2021): Der leere Zustand hat keinen Weg zurück. Hier sollte «Filter zurücksetzen» stehen wie bei «Keine Rechnungen gefunden», mindestens als Knopf im Formular.

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver) lief nicht. Was angesagt wird, habe ich aus dem Accessibility-Tree und aus den Änderungen in den Live-Regionen geschlossen (MutationObserver auf `aria-live`, `role=status`, `role=alert`). Ob ein Screenreader die Option vor oder nach «Rechnungen - Dwello» spricht, konnte ich nicht hören.
- Die native Auswahlliste nach Alt+Pfeil runter wird im Headless-Chromium nicht gezeichnet. Die Tastendrücke kamen trotzdem an (keine Ladevorgänge bis Enter). Wie sie in Firefox oder Safari aussieht, habe ich nicht geprüft.
- Mieter, Mietverträge und Abrechnungen waren nicht Teil meiner Aufgabe. Dort habe ich nicht gefiltert.
- Ein langsames Netz habe ich nicht simuliert. Die Ladevorgänge waren lokal schnell, deshalb habe ich keine Ladeanzeige während des Wechsels gesehen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-662/` (01-rechnungen.png bis 07-wohnungen-gefiltert.png). Der Screenshot 04-jahr-2021-leer.png zeigt den leeren Jahreszustand ohne «Filter zurücksetzen», 07-wohnungen-gefiltert.png die Liste mit «1 Wohnung» und dem Knopf «Filter zurücksetzen» unter «Suchen».

## Runde 2

Geprüft auf w-662 bei 6202bf9, wieder nur mit Tastatur und Accessibility-Tree (Desktop 1440 × 900). Seiten: Rechnungen, Wohnungen und neu Mietverträge. Gespeichert habe ich nichts.

### Stand der Befunde aus Runde 1

| ID  | Schwere | Stand | Was ich gesehen habe |
| --- | --- | --- | --- |
| S-1 | Major | behoben | Nach jeder Änderung im Auswahlfeld bekommt der `status`-Bereich im Formular die Überschrift der Liste, polite: «14 Rechnungen», «Rechnungen 1–20 von 30, Seite 1 von 2», «3 Wohnungen», «1 Wohnung», «2 Mietverträge», «1 Mietvertrag». Bei 0 Treffern kommt «Keine Rechnungen gefunden», «Keine Wohnungen gefunden» oder «Keine Mietverträge gefunden», im Jahr ohne Rechnungen «Für 2021 sind noch keine Rechnungen erfasst». Der Fokus bleibt im Feld. |
| S-2 | Minor | behoben | Der Verlauf wächst beim Filtern nicht mehr: Bei Rechnungen blieb er nach 2 + 3 + 12 Pfeildrücken und End bei 3 Einträgen, bei Wohnungen und Mietverträgen nach je 6 Pfeildrücken auch. Ein «Zurück» führt direkt zur Übersicht, von der ich gekommen war. Geladen wird aber weiterhin bei jedem Pfeildruck (siehe S-5). |
| S-3 | Minor | offen (war nicht Teil der Korrektur) | Komme ich über die Navigation auf die Liste, wird bei einer Filteränderung kein Seitentitel mehr angesagt. Lade ich die Seite direkt (Adresse, Neuladen), sagt die erste Änderung im Auswahlfeld wieder assertive «Rechnungen - Dwello», «Wohnungen - Dwello» bzw. «Mietverträge - Dwello» an. Danach kommt die Anzahl, polite. Ab der zweiten Änderung kommt nur noch die Anzahl. |
| S-4 | Minor | behoben | `?year=2021` allein: Unter «Für 2021 sind noch keine Rechnungen erfasst» und «Rechnung erfassen» steht jetzt der Link «Filter zurücksetzen» (3 Tabs nach dem Feld «Jahr»). Enter führt zu `/invoices`, der Fokus steht auf «Rechnungen 1–20 von 83, Seite 1 von 5». Der Screenshot 02-jahr-2021-leer.png zeigt beide Links unter dem Hinweis. |

### Neue Befunde

| ID  | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| S-5 | Minor | Rechnungen, Wohnungen, Mietverträge (Auswahlfelder) | Jeder Pfeildruck lädt die Liste noch einzeln und schreibt sein Ergebnis in den `status`-Bereich. Bei 6 schnellen Pfeildrücken in «Kategorie» (100 ms Abstand) gab es 6 Ladevorgänge. Im `status` standen nacheinander «Keine Rechnungen gefunden», «2 Rechnungen» und zurück «Keine Rechnungen gefunden», «2 Rechnungen», «8 Rechnungen». Ein Screenreader, der polite-Ansagen in eine Warteschlange stellt, liest mir so Ergebnisse von Optionen vor, an denen ich nur vorbeigegangen bin. Wenn ich nicht bis zum Schluss zuhöre, kann ich «Keine Rechnungen gefunden» für das Ergebnis meiner Auswahl halten. |

### Beobachtungen (Runde 2)

- Mietverträge verhält sich wie die anderen Listen: «Gebäude» und «Vertragsstatus» wenden sofort an, die Anzahl wird angesagt, der Verlauf bleibt gleich, «Zurück» führt zur Übersicht. Ein Suchfeld gibt es hier nicht.
- «Filter zurücksetzen» ist bei Wohnungen (mit Treffern) ein Knopf, bei Mietverträgen an derselben Stelle ein Link. Bei 0 Treffern ist es überall ein Link unter dem Hinweis. Beides erreiche ich mit 3 Tabs nach dem letzten Auswahlfeld, und danach steht der Fokus auf der Überschrift der Liste. Mich hat das nicht gestört. Mit der Linkliste des Screenreaders finde ich den Knopf aber nicht.
- Ungesendeter Suchtext geht verloren, wie angekündigt: Bei «Hauswart» in der Adresse habe ich «Strom» ins Suchfeld getippt und dann das Gebäude gewechselt. Gesucht wurde weiter nach «Hauswart», und das Feld zeigte wieder «Hauswart». Ein geleertes, ungesendetes Feld kam ebenfalls mit «Hauswart» zurück. Das ist folgerichtig, wird aber nicht angesagt. Gemerkt habe ich es nur, weil ich zum Feld zurückgegangen bin.
- Die Gebäude stehen weiterhin nicht überall in derselben Reihenfolge: Bei Rechnungen und Mietverträgen kommt Musterhaus Zentrum zuletzt, bei Wohnungen ist die Liste alphabetisch.
- Der `status`-Bereich wird vor jeder neuen Ansage kurz geleert ("" und dann der Text). Das ist ein üblicher Weg, damit gleicher Text wieder angesagt wird.

### Aufgabe geschafft (Runde 2): ja

Rechnungen: Seepark Residenz, Hauswart ergab «8 Rechnungen», mit Jahr 2021 kam «Keine Rechnungen gefunden». Wohnungen: Seepark Residenz, Leer ergab «1 Wohnung». Mietverträge: Musterhaus Zentrum, Beendete Mietverträge ergab «1 Mietvertrag» (Kevin Fischer). Die Anzahl habe ich jedes Mal direkt im Auswahlfeld gehört, ohne die Überschrift zu suchen.

### Aufwand (Runde 2)

Etwa 15 Minuten, 8 Skriptläufe (2 davon wegen meiner eigenen Tab-Zählung wiederholt). Pro Liste: Tabs bis «Gebäude», 3 Pfeile, 1 Tab, 3 Pfeile.

### Ablauf (Runde 2)

1. Rechnungen direkt geladen, «Jahr», End. Erwartet: nur die Ansage des Ergebnisses. Gesehen: zuerst assertive «Rechnungen - Dwello», danach polite «Für 2021 sind noch keine Rechnungen erfasst» (S-3, wie bei Wohnungen und Mietverträgen).
2. Rechnungen, «Kategorie», 6 schnelle Pfeildrücke. Erwartet: eine Ansage für die Option, bei der ich stehen bleibe. Gesehen: 6 Ladevorgänge und mehrere Ansagen für Zwischenstände (S-5).
3. «Filter zurücksetzen» bei Mietverträgen. Erwartet: ein Knopf wie bei Wohnungen. Gesehen: ein Link mit demselben Namen. Funktioniert gleich.

### Vorschläge (Runde 2)

- **S-3:** `/apartments` direkt öffnen, mit Tab zu «Gebäude», Pfeil runter. Der assertive Bereich am Seitenende bekommt «Wohnungen - Dwello». Bleibt die Seite gleich und ändert sich nur die Abfrage, sollte der Seitentitel nicht angesagt werden, auch bei der ersten Änderung nach einem direkten Aufruf.
- **S-5:** `/invoices`, Tab zu «Kategorie», 6 × Pfeil runter mit 100 ms Abstand, dabei den `status` im Formular beobachten: 6 Anfragen `__data.json`, mehrere Ansagen. Hilfreich wäre ein kurzes Warten nach dem letzten Tastendruck (etwa 300 bis 500 ms) vor dem Laden. Dann gibt es nur einen Ladevorgang und eine Ansage für die Option, bei der ich stehen bleibe. Mindestens sollte nur das Ergebnis der zuletzt gewählten Option in den `status` geschrieben werden.

### Nicht geprüft (Runde 2)

- Wieder kein echter Screenreader. Die Ansagen habe ich aus Änderungen in den Live-Regionen geschlossen (MutationObserver). Ob NVDA oder VoiceOver die Zwischenstände von S-5 wirklich alle vorlesen oder nur den letzten, konnte ich nicht hören.
- Mieter und Nebenkostenabrechnungen habe ich nicht gefiltert, sie waren nicht Teil der Aufgabe.
- Langsames Netz nicht simuliert. Ob bei einer langsamen Antwort eine ältere Antwort eine neuere im `status` überschreibt, weiss ich daher nicht. Lokal stimmten am Ende Auswahl, Adresse, Liste und Ansage überein.

Skripte und Screenshots von Runde 2: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-662-2/` (r1.mjs bis r5.mjs, 01-rechnungen-jahr-end.png, 02-jahr-2021-leer.png, wohnungen-gefiltert.png, vertraege-gefiltert.png).
