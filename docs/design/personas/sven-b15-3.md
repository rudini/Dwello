# Persona-Lauf Sven, Slice b15, Runde 3 (Endstand nach dem Zusammenführen mit dem B-13-Fix)

Ich bin Sven, 45, blind. Ich arbeite mit Screenreader und nur mit der Tastatur. Desktop 1440 × 900, 100 %. Beurteilt habe ich den Accessibility-Tree (`readOut`), nach jedem Tab das fokussierte Element (Name, Rolle, Wert, `aria-describedby`) und mit einem MutationObserver jede Textänderung in `role=status`, `role=alert` und `aria-live`, also das, was ein Screenreader ansagen würde.

Ich habe nur den Mietvertrag von Hans Müller benutzt (`/contracts/b0000001-0001-0001-0001-000000000001/edit`), weil Helga parallel läuft. Gespeichert habe ich nichts: Der Auftrag nennt kein Gebäude zum Speichern.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, Fehlerzustand | Die Meldungen «… konnten wieder nicht geladen werden» bleiben nach dem erfolgreichen Laden stehen und stapeln sich: Nach 3 Fehlversuchen und einem Erfolg stehen 3 gleiche `alert` im Baum, auch nach 16 bis 26 Sekunden noch. Sie widersprechen dem Zustand «geladen». |
| P-2 | Minor | Mietvertrag bearbeiten, Feld «Vertragsbeginn» im Fehlerzustand | Der Hinweis «Überschneidung noch nicht geprüft. Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.» steht unter dem Feld, ist aber nicht in seinem `aria-describedby`. Im Fokus höre ich nur Hilfe und Wochentag, den Hinweis nicht. |
| P-3 | Nit | Mietvertrag bearbeiten, Panel «Mieter und Wohnung» | Die Schaltfläche «Erneut versuchen» liegt in der `status`-Region. Beim Laden wird deshalb der ganze Block samt dem Wort «Erneut versuchen» als eine lange Ansage vorgelesen (etwa 50 Wörter). |
| P-4 | Nit | Mietvertrag bearbeiten, Fehlermeldung (Toast) | «Meldung schliessen» ist erst der allerletzte Tab-Stopp nach dem Fussbereich. Das ist vertretbar, ein Wegräumen per Tastatur ist also möglich, aber mühsam, wenn sich die Meldungen stapeln (P-1). |

Aus Runde 2 behoben: N-2. Der Link heisst jetzt «Zur Seite des Mietvertrags von Hans Müller». N-1 (Mietvertrag mit Vertragsende) und N-3 (keine Rückfrage beim Verlassen) habe ich nicht noch einmal geprüft: Der Mietvertrag von Kevin Fischer war für mich nicht freigegeben.

## Aufgabe geschafft: ja

## Aufwand

- Etwa 6 Minuten, 4 Läufe: Normalfall, Fehlerzustand, Erneut versuchen (fehlschlagend, dann erfolgreich), Meldungen.
- Bis «Erneut versuchen» sind es 20 Tabs von oben, mit «Zum Inhalt springen» 4. Von «Nettomiete pro Monat» sind es 5 Mal Shift+Tab.

## Ablauf

### 1. Normalfall

| Schritt | Erwartet | Gesehen (gehört) |
|---|---|---|
| Seite öffnen | Titel und H1 | «Mietvertrag bearbeiten - Dwello», H1 «Mietvertrag bearbeiten», darunter «Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.» |
| Mieter und Wohnung | Als Text, nicht als Feld | H2 «Mieter und Wohnung», «Mieter: Hans Müller», «Wohnung: Wohnung 1.01 · Musterhaus Zentrum». Dann die zwei Hilfeabsätze (Beenden, Löschen) wie in Runde 2. Gut. |
| Link | Nennt den Mietvertrag | «Zur Seite des Mietvertrags von Hans Müller». N-2 ist damit behoben. |
| Fokusreihenfolge | Lesereihenfolge | Tab 18 «Mietverträge», 19 «Mietvertrag von Hans Müller», 20 der Link, 21 «Vertragsbeginn» (Beschreibung: «Erster Tag des Mietverhältnisses. Format TT.MM.JJJJ. Beispiel: 31.12.2026 \| Montag, 1. März 2021»), 22 Kalender, 23 Radio «Unbefristet», 24 bis 26 die Beträge mit Hilfe als Beschreibung, 27 «Abbrechen», 28 «Änderungen speichern». Es gibt keine leeren Tab-Stopps. Gut. |

### 2. Fehlerzustand (`/api/contracts?apartmentId=*` antwortet mit 500)

| Schritt | Erwartet | Gesehen (gehört) |
|---|---|---|
| Seite öffnen | Ein Hinweis unter «Mieter und Wohnung», dass die Mietverträge nicht geladen wurden | Direkt nach der Wohnung erscheint eine `status`-Region und wird höflich angesagt: «Überschneidung noch nicht geprüft. Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten. Beim Speichern prüft Dwello in jedem Fall, ob sich der Zeitraum mit einem anderen Mietvertrag dieser Wohnung überschneidet. Erneut versuchen». Was passiert ist, was ich tun kann und dass meine Eingaben bleiben: alles drin, beruhigend. Die Ansage ist lang und endet mit dem Schaltflächennamen (P-3). |
| Unter dem Vertragsbeginn | Hinweis, dass die Überschneidung fehlt | Im Baum stehen nach dem Wochentag «Überschneidung noch nicht geprüft» und «Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.». Im Fokus auf «Vertragsbeginn» höre ich das aber nicht, `aria-describedby` enthält nur Hilfe und Wochentag (P-2). |
| Fokusreihenfolge | «Erneut versuchen» in Lesereihenfolge | Tab 20 ist «Erneut versuchen», vor dem Link zur Seite des Mietvertrags. Richtig. |
| Nettomiete eingeben | | Tab 25 «Nettomiete pro Monat», Strg+A, «1499.00». Das Total wird zu CHF 1’839.00. |
| Shift+Tab ×5 zu «Erneut versuchen», Enter (Anfrage scheitert weiter) | Der Fokus bleibt auf der Schaltfläche, eine Ansage meldet den erneuten Fehler | Der Fokus bleibt auf «Erneut versuchen» (nach 50, 300 und 1500 ms geprüft). Sofort kommt ein `alert`: «Die Mietverträge der Wohnung konnten wieder nicht geladen werden. Versuchen Sie es später erneut; Ihre Eingaben bleiben erhalten.» Das «wieder» macht klar, dass mein Klick angekommen ist. Sehr gut. Der Screenshot zeigt die Meldung als roten Toast rechts mit einem X, der Hinweis im Panel bleibt unverändert. |
| Noch zweimal Enter | Jedes Mal eine Ansage | Jedes Mal kommt ein neues `alert` mit demselben Text, also wird es auch wiederholt angesagt. Die alten Meldungen bleiben aber stehen (P-1). |
| Route entfernen, Enter auf «Erneut versuchen» | Der Fokus geht auf den Vertragsbeginn, eine Ansage meldet den Erfolg | Nach 50 ms liegt der Fokus auf «Vertragsbeginn», Wert 01.03.2021, mit Hilfe und Wochentag als Beschreibung. Der Hinweis im Panel und der unter dem Datum sind weg. Etwa 500 ms später kommt höflich (`status`): «Die Mietverträge der Wohnung sind geladen.» Die Fokusansage kommt zuerst, die Erfolgsmeldung danach, sie überlagern sich also nicht. Der Fokus auf dem Vertragsbeginn ist sinnvoll, weil dort die Überschneidung nun geprüft wird. Die Erfolgsmeldung verschwindet nach rund 5 Sekunden. |
| Nettomiete prüfen | 1499.00 bleibt | «Nettomiete pro Monat» hat den Wert 1499.00. Die Eingabe bleibt erhalten, wie versprochen. |
| Weiter mit Tab und Shift+Tab | Normale Reihenfolge | Shift+Tab geht auf den Link zur Seite des Mietvertrags, Tab auf den Kalender. «Erneut versuchen» ist aus der Reihenfolge verschwunden, es bleibt kein toter Tab-Stopp. |
| Danach im Baum | Keine Fehlermeldung mehr | Die `alert`-Meldungen «… wieder nicht geladen …» stehen weiter am Ende der Seite, 3 Stück nach 3 Fehlversuchen, auch nach 16 Sekunden noch. Nach einem einzelnen Fehlversuch steht die eine Meldung auch nach 26 Sekunden noch (P-1). |
| Meldung schliessen | Per Tastatur erreichbar | Die Schaltfläche «Meldung schliessen» ist der letzte Tab-Stopp nach «Nutzungsbedingungen» (P-4). |

Screenshots (nur im Scratchpad): `r3-normal.png` zeigt den Normalfall. `r3-fail-load.png` zeigt den gelben Hinweis «Überschneidung noch nicht geprüft» mit der Schaltfläche «Erneut versuchen» unter «Mieter», einen zweiten kurzen gelben Hinweis unter dem Vertragsbeginn. `r3-retry1.png` zeigt dazu den Fokusrahmen auf «Erneut versuchen», rechts den roten Toast mit X über dem zweiten Hinweis und die Nettomiete 1499.00. `r3-retry2.png` zeigt die Seite ohne gelbe Hinweise.

## Verwirrung

- «Überschneidung noch nicht geprüft»: Was sich womit überschneidet, erklärt erst der zweite Satz. Für mich als Hörer geht es, weil alles in einer Ansage kommt.
- «siehe oben bei der Wohnung» unter dem Datum ist für mich ein brauchbarer Wegweiser (H oder Shift+Tab), aber ich höre ihn nur beim Lesen, nicht im Fokus (P-2).
- Nach dem Erfolg finde ich am Seitenende immer noch «konnten wieder nicht geladen werden». Wenn ich die Seite mit dem virtuellen Cursor durchlese, weiss ich nicht mehr, welcher Zustand gilt (P-1).

## Fehlerrisiken

- Wer beim Fehler direkt zum Datum springt und es ändert, erfährt im Fokus nicht, dass die Überschneidung nicht geprüft ist (P-2). Das Risiko ist gering, weil Dwello beim Speichern ohnehin prüft und das im Panel auch sagt.
- Die stehengebliebenen Fehlermeldungen könnten mich dazu bringen, «Erneut versuchen» zu suchen, das es nicht mehr gibt, oder den Vorgang abzubrechen (P-1).

## Vorschläge

- **P-1:** Reproduktion: Route auf 500 setzen, Seite öffnen, 20 Tabs, dreimal Enter, Route entfernen, Enter, nach 10 s `readOut`: 3 Mal `alert` «… wieder nicht geladen …». Hilfreich wäre: die Fehlermeldung beim nächsten Versuch ersetzen statt eine weitere hinzufügen, und beim Erfolg die offenen Fehlermeldungen dieser Anfrage schliessen. Oder die Fehlermeldung nach einiger Zeit ausblenden, wie die Erfolgsmeldung.
- **P-2:** Reproduktion: Route auf 500, Seite öffnen, Tab bis «Vertragsbeginn» (Tab 22 im Fehlerzustand), die Beschreibung anhören: nur Hilfe und Wochentag. Hilfreich wäre: die ID des Hinweises unter dem Datum in das `aria-describedby` des Felds aufnehmen.
- **P-3:** Reproduktion: Route auf 500, Seite öffnen, die erste Ansage anhören. Hilfreich wäre: nur Titel und ersten Satz als Live-Region ansagen und die Schaltfläche ausserhalb der `status`-Region platzieren.
- **P-4:** Reproduktion: nach einem Fehlversuch mit Tab bis ans Ende, «Meldung schliessen» ist der letzte Stopp. Es genügt, P-1 zu beheben. Sonst Escape zum Schliessen anbieten.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): Ich habe Baum, Fokus und Live-Regionen beurteilt, nicht die tatsächliche Sprachausgabe und auch nicht, ob die Ansage nach 500 ms von einer laufenden Fokusansage abgeschnitten wird.
- Speichern im Fehlerzustand (die Prüfung beim Speichern): Der Auftrag nennt kein Gebäude zum Speichern, und Helga läuft parallel.
- N-1 und N-3 aus Runde 2 sowie der Mietvertrag von Kevin Fischer: Der war für diesen Lauf nicht freigegeben.
- Eine langsame Antwort (Ladezustand während «Erneut versuchen», etwa `aria-busy` oder ein deaktivierter Knopf): Die Antworten kamen sofort, das war nicht Teil des Auftrags.
