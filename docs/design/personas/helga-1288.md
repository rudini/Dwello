# Helga – Neuer Mietvertrag: Wohnung «nicht geprüft», Erneut versuchen und Hinweis zum eigenen Mietvertrag (#1288)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % und 200 % Browser-Zoom, Maus. Nur angeschaut, nichts gespeichert.
Simulierter Fehler: jede Anfrage an `/api/contracts?apartmentId=aaaa1111-1111-1111-1111-222222222222` (Wohnung 1.02 · Musterhaus Zentrum) antwortet mit HTTP 500, von Anfang an im Browser umgeleitet, danach die Seite neu geladen. Vor «Erneut versuchen» habe ich den Fehler abgestellt.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/30a45a1c-32ba-5a74-a23e-9c76549c5cc9/scratchpad/helga-1288/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Schritt 2 «Wohnung», nach «Erneut versuchen» (200 %, teils 150 %) | Nach «Erneut versuchen» sehe ich bei 200 % nur noch das leere Feld «Wohnung wählen». Der Hinweis «Wohnung 1.02 · Musterhaus Zentrum ist nicht verfügbar», der erklärt, warum meine Auswahl weg ist, liegt unterhalb des sichtbaren Bereichs. Bei 150 % steht nur die Überschrift ganz unten am Rand, der Text ist abgeschnitten. Gleichzeitig verschwindet oben der blaue Hinweis zu Hans Müller, und alles springt nach oben. Zuerst dachte ich, meine Auswahl sei einfach verloren gegangen. |
| P-2 | Minor | Schritt 2 «Wohnung», beide Hinweise | Die beiden Links heissen nicht gleich. Beim aufgehobenen Hinweis steht nur «Zum Mietvertrag von Anna Schmidt», beim Hinweis zu Hans Müller dagegen «Zum Mietvertrag von Hans Müller für Wohnung 1.01 · Musterhaus Zentrum». Die Wohnung selbst schreiben beide gleich («Wohnung 1.0x · Musterhaus Zentrum»), aber nur einer der beiden Links nennt sie. |
| P-3 | Minor | Schritt 2 «Wohnung», Hinweis zu Hans Müller | Im Text «Zieht Hans Müller um, endet dieser Mietvertrag nicht von selbst. Ist er gekündigt … tragen Sie das Vertragsende auf seiner Seite … ein» habe ich «er» und «seiner Seite» zuerst auf Hans Müller bezogen, also auf die Mieter-Seite. Der Hinweis zur aufgehobenen Wohnung schreibt klar «Ist dieser Mietvertrag gekündigt». Die beiden Hinweise erklären denselben Schritt also verschieden deutlich. |
| P-4 | Minor | Schritt 2 «Wohnung», nach Wahl von 1.02 (200 %, 150 %) | Sobald ich 1.02 wähle, erscheint der blaue Hinweis zu Hans Müller **über** dem Feld und schiebt das Feld, die gelbe Warnung «Dwello prüft beim Speichern, ob die Wohnung frei ist» und den Knopf «Erneut versuchen» aus dem Bild. Bei 200 % sehe ich danach nur den blauen Kasten. Die Warnung zu meiner gerade gewählten Wohnung muss ich erst suchen. Etwas überdeckt wird dabei nicht, es wird nur weggeschoben. |

## Beobachtungen

- Überdeckt wird nichts: Weder bei 150 % noch bei 200 % liegt etwas über dem Feld, dem Hilfetext oder den Hinweisen. Die oben klebende Kopfzeile verdeckt nur Inhalt, den ich ohnehin weggescrollt habe. Auf den ganzseitigen Bildschirmfotos steht diese Kopfzeile mitten im Bild. Das kommt vom Fotografieren, nicht von der Seite.
- In der Liste steht «(nicht geprüft)» **vor** dem Wohnungsnamen, «(nicht verfügbar)» aber **hinter** den Quadratmetern. Das ist uneinheitlich, ich habe es aber gefunden.
- Bei 150 % ist der gewählte Eintrag im Feld abgeschnitten: «(nicht geprüft) Wohnung 1.02 · Musterhaus Zentrum, 4.5 Zimmer, 9…». Wichtig ist das nicht, weil die Wohnung vorne steht.
- Der Hilfetext unter «Wohnung» erklärt «nicht geprüft» gut. Nach dem erfolgreichen «Erneut versuchen» fällt dieser Satz wieder weg, das passt.
- Die gelbe Warnung nennt die Wohnung nicht («dieser Wohnung»), sie steht aber direkt unter dem Feld mit 1.02. Verstanden habe ich: Dwello konnte nicht nachsehen, prüft es aber beim Speichern, und meine Eingaben bleiben erhalten.
- Der Hinweis zur aufgehobenen Wohnung nennt die Wohnung in der Überschrift, die Mieterin Anna Schmidt aber nur im Link. Ich habe trotzdem verstanden, dass Anna Schmidt dort wohnt und ich eine andere Wohnung wählen soll.
- Nach jedem Wechsel steht der Fokus auf der Schrittüberschrift «Wohnung».
- Bevor ich eine Wohnung wähle, zeigt Schritt 2 keinen Hinweis zu Hans Müller. Er erscheint erst, wenn ich eine Wohnung gewählt habe (1.02 oder 2.02), und er verschwindet, sobald die Auswahl aufgehoben ist.
- Mit 2.02 führt «Weiter» ohne Probleme zu Schritt 3 «Vertragsdauer».

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 12 Schritte pro Zoomstufe: Seite öffnen, Hans Müller, Weiter, 1.02, Warnung suchen, Erneut versuchen, Grund suchen, 2.02, Hinweis lesen, Weiter. Pro Zoomstufe musste ich zweimal zusätzlich scrollen.

## Ablauf

- **1.02 gewählt (200 %).** Erwartet: Unter dem Feld sehe ich, dass die Wohnung «nicht geprüft» ist. Gesehen: Ein blauer Kasten zu Hans Müller schiebt sich über das Feld, Feld und gelbe Warnung sind aus dem Bild. Erst nach dem Scrollen sehe ich die Warnung und «Erneut versuchen» (P-4).
- **«Erneut versuchen» geklickt (200 %).** Erwartet: Dwello sagt mir an der Stelle, an der ich bin, was jetzt mit 1.02 ist. Gesehen: Das Feld zeigt plötzlich «Wohnung wählen», der blaue Kasten ist weg, und die Erklärung «Wohnung 1.02 · Musterhaus Zentrum ist nicht verfügbar … Dwello hat die Auswahl darum aufgehoben» steht unterhalb des Bildschirms. Nach dem Scrollen habe ich sie gefunden und verstanden (P-1).
- **Hinweis zu Hans Müller mit 2.02.** Erwartet: Er ist gleich aufgebaut wie der gelbe Hinweis zu 1.02. Gesehen: Die Wohnung ist gleich geschrieben, der Link aber anders benannt (P-2), und «er» / «seiner Seite» ist weniger klar (P-3). Verstanden habe ich: Mietet Hans Müller beide Wohnungen, mache ich weiter; zieht er um, trage ich zuerst das Vertragsende von 1.01 ein.

## Vorschläge

- **P-1:** Bei 200 % zu /contracts/new gehen (500 auf `/api/contracts?apartmentId=aaaa1111-…-222222222222`), Hans Müller wählen, Weiter, 1.02 wählen, den Fehler abstellen, «Erneut versuchen». Dann ist der Hinweis unterhalb des Bildschirms. Helfen würde, den Hinweis nach dem Aufheben ins Bild zu holen oder den Fokus darauf zu setzen. Oder man stellt ihn über das Feld, wo vorher der blaue Kasten stand, damit nichts springt.
- **P-2:** Mit denselben Schritten 1.02 aufheben lassen und danach 2.02 wählen, dann die beiden Links vergleichen. Helfen würde, beide Links gleich zu bauen: «Zum Mietvertrag von Anna Schmidt für Wohnung 1.02 · Musterhaus Zentrum», oder beide kurz.
- **P-3:** Hans Müller und 2.02 wählen und den blauen Hinweis lesen. Helfen würde «Ist dieser Mietvertrag gekündigt … tragen Sie das Vertragsende auf der Seite des Mietvertrags mit «Enddatum erfassen» ein», wie im Hinweis zur aufgehobenen Wohnung.
- **P-4:** Bei 200 % Hans Müller, Weiter, 1.02 wählen. Helfen würde, die gelbe Warnung zur gewählten Wohnung nach der Auswahl ins Bild zu holen, oder den blauen Kasten zu Hans Müller nicht über das Feld zu schieben, das ich gerade benutze (zum Beispiel darunter oder schon vor der Auswahl).

## Nicht geprüft

- Gespeichert habe ich nichts (Auftrag: nur schauen). Ob Dwello beim Speichern mit einer «nicht geprüften» Wohnung wirklich ablehnt, habe ich daher nicht gesehen.
- Dunkler Modus, andere Sprachen und Mobilansicht gehörten nicht zur Aufgabe.
- Die Links «Zum Mietvertrag von …» habe ich nicht angeklickt, damit der Assistent nicht verlassen wird.
