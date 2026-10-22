# Helga, 68: Dwello einrichten und KI wählen (Runde 620)

Frische Installation unter http://localhost:3310, abgemeldet gestartet. Desktop 1440 × 900 bei 150 % Zoom (Einrichtungsseite auch bei 200 %), Maus. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-620/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht (Hinweis «Das KI-Modell wird geladen») | Die Anzeige blieb über 80 Sekunden bei 40 % stehen und hat sich nie selbst erneuert (auch nach dem Neuladen 40 %). Es steht nicht da, ob ich warten muss, die Seite offen lassen muss, wie lange es etwa dauert oder was ich tun soll, falls es stehen bleibt. Ich weiss nicht, ob es vorwärtsgeht oder hängt. |
| P-2 | Minor | Einrichtung, Wahl «Lokale KI auf diesem Server» | «Braucht rund 16 GB Arbeitsspeicher»: Ich weiss nicht, wie viel mein Computer hat, und es steht nicht da, was passiert, wenn es zu wenig ist. Ich kann nicht entscheiden, ob die Wahl für mich geht. |
| P-3 | Minor | Einrichtung, Wahl «Später entscheiden» | Der Text nennt «eine KI eines Anbieters», sagt aber nicht, dass dabei die Rechnungen samt Namen und Adressen aus dem Haus gehen. Das steht erst unter «Einstellungen» › «KI». Wer «Später entscheiden» wählt, weiss nicht, worauf er sich später einlässt. |
| P-4 | Nit | Einrichtung, Wahl «Lokale KI auf diesem Server» | «Server» und «auf diesem Server» sagen mir nichts. Mein Neffe hat Dwello auf dem Computer bei mir zu Hause eingerichtet; dass das «der Server» ist, musste ich raten. |
| P-5 | Nit | Einrichtung, Wahl «Lokale KI auf diesem Server» | «Rechnungen und Kategorien verlassen den Server nicht»: Was mit «Kategorien» gemeint ist, weiss ich hier noch nicht. «KI-Modell» ist ein weiteres neues Wort ohne Erklärung. |

## Beobachtungen

- Die Vorauswahl «Lokale KI auf diesem Server» passt zu dem, was mein Neffe gesagt hat («die Daten sollen möglichst zu Hause bleiben»). Ich habe sie gelassen.
- Die Einrichtungsseite ist bei 150 % und 200 % gut lesbar, nichts wird abgeschnitten, kein seitliches Scrollen (Seitenbreite 720 bei 720 Fenster bei 200 %). Die beiden Wahlfelder sind grosse Kästen mit Rahmen, gut mit der Maus zu treffen.
- Die Frage «Welche KI soll Rechnungen lesen?» ist verständlich: Ich begreife, dass ein Programm meine Rechnungen lesen soll. Was «KI» heisst, steht aber nirgends ausgeschrieben («künstliche Intelligenz»); ich kenne das Wort nur aus der Zeitung.
- Auf der Einrichtungsseite gibt es nur zwei Wahlen; unter «Einstellungen» › «KI» sind es drei («Lokale KI», «KI eines Anbieters», «Keine KI»). Dort ist der Text zur Anbieter-KI deutlich («gehen an den Anbieter, auch Namen und Adressen darin»). So deutlich hätte ich es gern schon bei der Einrichtung gelesen.
- Der Hilfetext zum Einrichtungscode verlangt «docker logs dwello-backend» auf dem Server. Das hätte ich ohne den Neffen nicht gekonnt; ich hatte den Code zum Glück von ihm.
- Der Satz «Bis es geladen ist, erfassen Sie Rechnungen von Hand» ist klar: Ich kann sofort weiterarbeiten. Das hat mich beruhigt.
- Der gleiche Lade-Hinweis steht auch unter «Einstellungen» › «KI» unter dem Knopf «KI speichern».
- Netzwerk (über die Seite gelesen): Die Einrichtung ruft nur `localhost:3310` auf (GET/POST `/setup`, dann `/dashboard`); Cookies `dwello_session` (HttpOnly), `dwello_xsrf`, `PARAGLIDE_LOCALE`. Während ich die Übersicht 60 Sekunden offen hatte, fragte die Seite nichts nach, deshalb blieb die Prozentzahl stehen.
- Ob der Download wirklich hängt oder in dieser Testumgebung nur nicht weiterkommt (kein Internet für 6 GB?), kann ich nicht beurteilen.

## Aufgabe geschafft: ja

Konto angelegt (helga@dwello.test), lokale KI gewählt, angemeldet auf der Übersicht gelandet. Ob ich auf die KI warten muss, ist mir aber nur halb klar (P-1).

## Aufwand

Etwa 5 Minuten, 9 Schritte: Seite öffnen, Hilfe ansehen, Code, E-Mail, Passwort zweimal eingeben, Wahl lesen, «Dwello einrichten», Übersicht lesen und eine Minute warten, unter «Einstellungen» › «KI» nachsehen.

## Ablauf

1. **Adresse öffnen.** Erwartet: eine Begrüssung. Gesehen: «Dwello einrichten» mit Haus-Bild, kurze Erklärung «Legen Sie das Konto mit Passwort an …». Gut.
2. **Hilfe angeschaut.** Erwartet: etwas zur KI. Gesehen: Die Hilfe erwähnt die KI nur beim Hochladen von Rechnungen, nichts zur Wahl lokal oder Anbieter.
3. **Code, E-Mail, Passwort eingegeben.** Erwartet: einfache Felder. Gesehen: Beschriftungen über den Feldern, Hinweis zur Passwortlänge. Problemlos (Bildschirmfoto `03-filled.png`).
4. **KI-Frage gelesen.** Erwartet: eine Erklärung, was die KI tut und wohin meine Daten gehen. Gesehen: «Lokale KI auf diesem Server» (vorgewählt) mit «verlassen den Server nicht», 16 GB Arbeitsspeicher, 6 GB Download; «Später entscheiden» mit «erfassen Sie Rechnungen von Hand». «Verlassen den Server nicht» habe ich als «bleibt zu Hause» verstanden, also passt das zum Rat des Neffen. Die 16 GB konnte ich nicht beurteilen (P-2), «Server» musste ich raten (P-4).
5. **«Dwello einrichten» geklickt.** Erwartet: Bestätigung. Gesehen: Direkt die Übersicht, oben meine E-Mail-Adresse. Gut.
6. **Übersicht gelesen.** Erwartet: ob die KI bereit ist. Gesehen: hellblauer Kasten mit Info-Zeichen «Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand.» und ein Balken (`04-after-setup.png`). Darunter «Erstes Gebäude erfassen» als nächster Schritt. Verstanden: Es lädt noch, ich kann trotzdem anfangen.
7. **Gewartet (20 s, neu geladen; dann 60 s ohne Neuladen).** Erwartet: dass die Zahl steigt oder der Kasten verschwindet. Gesehen: immer 40 % (`05-overview-later.png`). Ich weiss nicht, ob ich etwas falsch gemacht habe (P-1).
8. **Unter «Einstellungen» › «KI» nachgesehen.** Gesehen: drei Wahlen, «Lokale KI» ausgewählt, gleicher Lade-Hinweis mit 40 % (`08-settings-ki.png`). Hier erst lese ich, dass bei einem Anbieter Namen und Adressen weggehen (P-3).

## Verwirrung

- **KI:** nirgends ausgeschrieben; aus «Rechnungen lesen» habe ich erraten, was gemeint ist.
- **Lokale KI / Server:** «lokal» hätte ich als «hier bei mir» verstanden, «Server» nicht. Zusammen ergibt es Sinn, wenn man weiss, dass Dwello bei einem selbst läuft.
- **Später entscheiden:** klar, dass ich dann Rechnungen von Hand erfasse. Unklar, was «KI eines Anbieters» ist und was es für meine Daten bedeutet.
- **Arbeitsspeicher, KI-Modell, 6 GB:** Fachwörter, die ich nicht einordnen kann.
- **Kategorien:** auf der Einrichtungsseite noch nicht erklärt.
- **40 % ohne Bewegung:** Muss ich das Fenster offen lassen? Muss ich den Neffen anrufen?

## Fehlerrisiken

- Wer zu wenig Arbeitsspeicher hat, wählt trotzdem die vorgewählte lokale KI, weil er die 16 GB nicht prüfen kann, und wartet dann vielleicht vergeblich (P-2, P-1).
- Wer «Später entscheiden» wählt und später unter «Einstellungen» schnell «KI eines Anbieters» anklickt, merkt es vielleicht erst dort, dass seine Daten das Haus verlassen (P-3).
- Wer den Ladebalken stehen sieht, schliesst vielleicht den Browser oder schaltet den Computer aus, weil nicht steht, dass das Laden auf dem Server weiterläuft (P-1).

## Vorschläge

- **P-1:** Einrichten mit «Lokale KI», auf der Übersicht warten. Hilfreich: ein Satz wie «Das dauert je nach Internet eine Weile. Sie müssen nichts tun und können Dwello schliessen.»; die Anzeige von selbst nachführen; wenn sich längere Zeit nichts bewegt, sagen, was zu tun ist (z. B. «Fragen Sie die Person, die Dwello eingerichtet hat» oder «Unter Einstellungen › KI eine andere Wahl treffen»).
- **P-2:** Einrichtungsseite, erste Wahl lesen. Hilfreich: sagen, was passiert, wenn der Computer zu wenig Arbeitsspeicher hat, oder wer das prüfen kann («Fragen Sie im Zweifel die Person, die Dwello installiert hat»).
- **P-3:** Einrichtungsseite, zweite Wahl lesen. Hilfreich: ein halber Satz wie bei den Einstellungen, z. B. «Bei einer KI eines Anbieters gehen Rechnungen mit Namen und Adressen an diesen Anbieter.»
- **P-4:** Einrichtungsseite, erste Wahl. Hilfreich: «auf diesem Server» kurz erklären, etwa «auf dem Computer, auf dem Dwello läuft».
- **P-5:** Einrichtungsseite, erste Wahl. Hilfreich: «Kategorien» kurz umschreiben (z. B. «die Kostenarten, nach denen Sie Rechnungen einordnen», wie es unter «Einstellungen» steht).

## Nicht geprüft

- Wie die Übersicht aussieht, wenn das KI-Modell fertig geladen ist oder das Laden scheitert: Es blieb in meiner Zeit bei 40 %.
- Die Wahl «Später entscheiden» bis zum Ende: Die Installation lässt sich nur einmal einrichten, ich habe die lokale KI gewählt.
- Fehlermeldungen der Einrichtung (falscher Code, Passwörter verschieden): nicht Teil der Aufgabe.
- Rechnungen hochladen mit der KI: Das Modell war nicht geladen.
