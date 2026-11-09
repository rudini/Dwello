# Anna – Protokoll mit mehreren Seiten (#746)

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück. Desktop 1440 × 900, Maus; Seite 2 zusätzlich auf dem Handy (390 × 844) angesehen. Nur geschaut, nichts gespeichert oder gelöscht.

Aufgabe: Wer hat sich wann bei meinem Dwello angemeldet, vom allerersten Eintrag an? Den ältesten Eintrag im Protokoll finden.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Protokoll, Seite 1 (oben) | Oben steht nicht, dass nur ein Teil der Einträge gezeigt wird und dass die neuesten zuoberst stehen. Der Einleitungstext sagt sogar «Die Einträge bleiben, bis Sie sie löschen», und darunter kommt eine lange Liste. Dass es eine zweite Seite gibt, sehe ich erst ganz unten, nach 50 Einträgen («Seite 1 von 2»). Hätte ich nicht bis ganz unten gescrollt, hätte ich den 12.06.2026 für meine erste Anmeldung gehalten. |
| P-2 | Minor | Protokoll, Seitenwechsel unten | Die Knöpfe heissen «Nächste Seite» und «Vorherige Seite». Sie sagen nicht, ob es dort ältere oder neuere Einträge gibt. Dass «Nächste Seite» zu den älteren Einträgen führt, habe ich nur an den Daten gemerkt, nachdem ich geklickt hatte. |

## Beobachtungen

- Die Reihenfolge ist richtig: Die neuesten Einträge stehen zuoberst (06.11.2026, 09:22), auf Seite 1 sind es 50 Einträge, auf Seite 2 noch 10. Der älteste ist **13.05.2026, 05:22, «Anmeldung mit Google»**, der letzte Eintrag auf Seite 2.
- Nirgends steht, wie viele Einträge es insgesamt gibt (zum Beispiel «60 Einträge»). Nur «Seite 1 von 2».
- Der Text «Seite 1 von 2» steht auf Seite 1 links (der Knopf rechts), auf Seite 2 rechts (der Knopf links). Er springt von einer Seite auf die andere. Das hat mich nicht gestört, ist aber etwas unruhig.
- Nach «Nächste Seite» beginnt Seite 2 oben bei der Überschrift. Gut, ich muss nicht suchen. In der Adresse steht `?page=2`, der Titel im Browser bleibt «Protokoll - Dwello» (er nennt die Seite nicht).
- Neben jedem der 50 Einträge steht ein roter Knopf «Löschen». Beim Durchscrollen habe ich darauf geachtet, keinen zu treffen; das ist nicht neu mit dieser Änderung.
- Auf dem Handy (390 px) passen die Knöpfe und «Seite 2 von 2» nebeneinander, es gibt kein seitliches Scrollen.
- In der Übersicht von «Einstellungen» heisst der Bereich «Protokoll» mit einem guten Hilfetext («Anmeldungen, Änderungen … mit Datum»). Den Weg habe ich sofort gefunden.

## Aufgabe geschafft: ja

Der älteste Eintrag ist 13.05.2026, 05:22, Anmeldung mit Google (Seite 2 von 2, ganz unten).

## Aufwand

Etwa 4 Minuten. Schritte: Übersicht → Seitenleiste «Einstellungen» → Link «Protokoll» → 50 Einträge bis ganz unten scrollen → «Nächste Seite» → 10 Einträge bis ganz unten scrollen. 3 Klicks und 2-mal lange scrollen.

## Ablauf

- Protokoll geöffnet. Erwartet: ein Hinweis, ob alles da ist oder nur die letzten Einträge, und in welcher Reihenfolge. Gesehen: nur der allgemeine Einleitungstext («Die Einträge bleiben, bis Sie sie löschen») und direkt die Liste, zuoberst der 06.11.2026. Dass es nur ein Teil ist, war oben nicht zu sehen (Screenshot `03b-viewport.png`: Kopf und die ersten fünf Einträge, kein Hinweis auf Seiten).
- Ganz unten auf Seite 1. Erwartet: das Ende des Protokolls. Gesehen: der letzte Eintrag 12.06.2026, darunter «Seite 1 von 2» und rechts ein umrandeter Knopf «Nächste Seite» (`04-bottom-p1.png`). Erst da war klar, dass es weitergeht.
- «Nächste Seite» geklickt. Erwartet: unklar, ob ältere oder neuere Einträge kommen. Gesehen: ältere Einträge, 09.06.2026 bis 13.05.2026, unten «Vorherige Seite» und «Seite 2 von 2» (`05-p2-full.png`).

## Vorschläge

- **P-1:** Einstellungen → Protokoll öffnen (mit mehr als 50 Einträgen). Oben bei der Liste steht nichts über Teilmenge oder Reihenfolge. Hilfreich wäre ein kurzer Satz direkt über der Liste, zum Beispiel «Die neuesten Einträge stehen zuoberst. Ältere Einträge finden Sie auf den nächsten Seiten.» oder «Einträge 1–50 von 60, die neuesten zuerst». Ein Hinweis auf die Seiten auch oben (nicht nur unten) würde das lange Scrollen ersparen.
- **P-2:** Auf Seite 1 bis unten scrollen. Der Knopf heisst «Nächste Seite». Hilfreich wäre ein Name, der die Richtung sagt: «Ältere Einträge» und auf Seite 2 «Neuere Einträge».

## Nicht geprüft

- Was passiert, wenn ich auf Seite 2 einen Eintrag lösche (ob ich auf Seite 2 bleibe und die Zählung stimmt): Ich sollte nichts löschen, weil eine andere Persona dieselben Daten ansieht.
- Mehr als zwei Seiten: Es gab nur 60 Einträge, also zwei Seiten. Ob es bei vielen Seiten einen Sprung zur letzten Seite gibt (zum ältesten Eintrag direkt), konnte ich nicht sehen.
- Eine Seitenzahl, die es nicht gibt (z. B. von Hand `?page=5` in der Adresse): Das würde ich als Nutzerin nicht tun, darum nicht versucht.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/4648d2d9-f67a-523e-be64-fb96373c5762/scratchpad/anna-746/`.
