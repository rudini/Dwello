# Marco – #479 «Neues Gebäude» mit Gebäuderegister (Handy 390 × 844, Touch)

Aufgabe: Das Gebäude «Saumackerstrasse 20, 8048 Zürich» mit allen Wohnungen über «Neues Gebäude» so schnell wie möglich erfassen und speichern; prüfen, ob die Liste der Wohnungen auf dem Handy funktioniert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker (Umgebung, nicht bestätigt als App-Fehler) | Neues Gebäude, Adresse suchen | Jede Suche endet mit «Das Gebäuderegister ist gerade nicht erreichbar.» (`/api/addresses` antwortet 502 `{"error":"unreachable"}`); keine Treffer, also auch keine Wohnungsliste. Die Übernahme der Wohnungen konnte ich nicht prüfen. |

## Beobachtungen

- Der Knopf auf der Gebäudeliste heisst «Gebäude erfassen», nicht «Neues Gebäude». Erst die Seite selbst heisst «Neues Gebäude». Ich habe ihn trotzdem sofort gefunden.
- Der Einleitungstext oben und der Hilfetext beim Suchfeld sagen fast dasselbe zweimal. Auf dem Handy ist das viel Lesen, bevor ich tippen kann.
- Die Fehlermeldung ist gut: ein gelber Kasten direkt unter dem Suchfeld, klare Worte, sie sagt, was ich tun kann (von Hand erfassen oder später versuchen). Sie verschwindet nicht von selbst und drängt sich nicht vor.
- Alle Felder und Knöpfe sind 48 px hoch. Nur das Häkchen «Kein Tank oder Tank stillgelegt» ist 24 px, das Label daneben kann man aber antippen.
- Kein seitliches Scrollen (Seitenbreite 390 = Fensterbreite), weder auf dem Formular noch auf der Gebäudeseite danach.
- Bei der Suche wird der Anfang meiner Eingabe abgeschnitten («‹aumackerstrasse 20 8048»), weil das Feld mit Lupe und × schmal ist. Normal für ein Handy, aber ich sehe nicht mehr, was ich am Anfang getippt habe.
- Der Weg von Hand funktioniert: Gebäude gespeichert, die Gebäudeseite zeigt «Noch keine Wohnungen» und «Wohnung erfassen». Die Wohnungen müsste ich jetzt alle einzeln anlegen. Genau das sollte die Änderung mir ersparen.

## Aufgabe geschafft: nein

Gescheitert am Schritt «Adresse suchen und Treffer wählen» (4 Versuche mit «Saumackerstrasse 20 Zürich», «Saumackerstrasse 20», «Saumackerstrasse 20 8048 Zürich» und dem Beispiel aus dem Hilfetext «Seebahnstrasse 155 Zürich», alle 502). Ersatzweise habe ich das Gebäude von Hand gespeichert, ohne Wohnungen.

## Aufwand

Etwa 3 Minuten. Liste → «Gebäude erfassen» → Suche tippen (Fehlermeldung nach rund 1–2 s) → 4 Felder von Hand, Kanton und Gebäudetyp wählen → «Gebäude erfassen»: 9 Schritte bis zum gespeicherten Gebäude, 0 Wohnungen.

## Ablauf

1. **Gebäudeliste** (`/buildings`). Erwartet: ein Knopf «Neues Gebäude». Gesehen: «Gebäude erfassen» oben, darunter die 3 Demo-Gebäude. Getippt.
2. **Neues Gebäude** (`/buildings/new`). Erwartet: zuerst ein Suchfeld. Gesehen: zuerst «Gebäudename», dann der Abschnitt «Adresse» mit «Adresse suchen (optional)» und langem Hilfetext, darunter die Felder für die Handeingabe. Gut: der Text verspricht, dass Dwello das Gebäude und seine Wohnungen übernimmt.
3. **Suche «Saumackerstrasse 20 Zürich»**. Erwartet: eine Trefferliste unter dem Feld. Gesehen: gelber Kasten «Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.» (Screenshot `05-error-viewport.png`). Im Netzwerk: `GET /api/addresses?q=…` → 502 `{"error":"unreachable"}`.
4. **Drei weitere Versuche** mit anderen Schreibweisen und dem Beispiel aus dem Hilfetext: jedes Mal dieselbe Meldung, 502.
5. **Von Hand erfasst**: Name «Saumackerstrasse 20», Strasse, PLZ 8048, Ort Zürich, Kanton Zürich (ZH), Mehrfamilienhaus. «Gebäude erfassen» getippt. Erwartet: Gebäudeseite. Gesehen: Gebäudeseite «Saumackerstrasse 20», Adresse «Saumackerstrasse 20, 8048 Zürich (ZH)», «Wohnungen 0», «Noch keine Wohnungen», Knopf «Wohnung erfassen» (Screenshot `07-after-save.png`).

## Verwirrung

- «Gebäude erfassen» (Liste) und «Neues Gebäude» (Seite) sind zwei Namen für denselben Weg; der Knopf unten auf dem Formular heisst wieder «Gebäude erfassen».
- «GWR» und «eidgenössisches Gebäude- und Wohnungsregister» kenne ich nicht, aber der Text erklärt, was es bringt; das reicht mir.
- Das Suchfeld heisst «(optional)», obwohl es laut Einleitung der schnelle Weg ist. Ich war kurz unsicher, ob ich zuerst oben den Namen ausfüllen muss.

## Fehlerrisiken

- Fällt das Register aus, legt ein Vermieter das Gebäude von Hand an und merkt erst auf der Gebäudeseite, dass die Wohnungen fehlen. Die Meldung sagt das nicht ausdrücklich («Wohnungen legen Sie danach an» steht nur oben in der Einleitung).
- Wer die Suche später wiederholen möchte, findet auf der Gebäudeseite keinen Weg, die Wohnungen nachträglich aus dem Register zu holen (soweit ich sehe).

## Vorschläge

- **P-1**: Reproduktion: `/buildings/new` auf dem Persona-Stack, im Feld «Adresse suchen» «Saumackerstrasse 20 Zürich» tippen → 502 `unreachable`. Mein Shell erreicht `api3.geo.admin.ch` (HTTP 200), aber der Proxy der Umgebung meldet zur Zeit meiner Suchen abgelehnte Verbindungen zu `www.swisstopo.admin.ch:443` (403 auf CONNECT). Ob der Server dorthin geht oder den Proxy gar nicht nutzt, kann ich von aussen nicht sehen. Was helfen würde: prüfen, welche Adresse der Server für die Suche aufruft und ob er in dieser Umgebung durch den Proxy hinauskommt, dann den Lauf wiederholen. Ist es nur die Umgebung, ist P-1 kein App-Fehler; die Fehlermeldung selbst ist gut.

## Nicht geprüft

- Die Trefferliste der Adresssuche, die Übernahme des Gebäudes, die Liste der Wohnungen aus dem Register auf dem Handy (seitliches Scrollen, Grösse der Bedienelemente) und das Speichern mit allen Wohnungen: das Register war vom Persona-Stack aus nie erreichbar.
- Ich habe das von Hand angelegte Gebäude «Saumackerstrasse 20» (ohne Wohnungen) stehen lassen. Ein neuer Lauf sollte zuerst dieses Gebäude löschen oder einen frischen Stack verwenden, damit es kein doppeltes Gebäude gibt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/marco-479/`.

---

# Runde 2 (frische Datenbank, Register erreichbar)

Aufgabe wie oben. Diesmal antwortet das Gebäuderegister; P-1 aus Runde 1 tritt nicht mehr auf (`/api/addresses` → 200).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-2 | Minor | Neues Gebäude, Wohnungen aus dem Gebäuderegister | Die Wohnungen stehen in einer unsortierten Reihenfolge: «Wohnung 2, 1, 102, 101, 202, 201, 302, 301». Auf der Gebäudeseite nach dem Speichern sind sie richtig nach Stockwerk und Nummer sortiert. Beim Prüfen auf dem Handy suche ich so «Wohnung 1» an zweiter Stelle. |
| P-3 | Minor | Neues Gebäude, nach Wahl des Treffers | Nach dem Antippen des Treffers sehe ich nirgends, wie viele Wohnungen gefunden wurden. Die Liste beginnt rund 2000 px weiter unten, unter «Weitere Angaben» und dem langen Tank-Text; im Blickfeld bleibt nur der blaue Kasten «Das Gebäuderegister enthält nur Wohnungen …». Ob überhaupt Wohnungen kamen, merke ich erst beim Scrollen. Auch der Knopf «Gebäude und Wohnungen erstellen» nennt keine Zahl, und er ändert sich nicht, wenn ich eine Wohnung abwähle. |
| P-4 | Minor | Neues Gebäude, Wohnungskarte | Das Feld «Fläche» zeigt nur «56» bzw. «76» ohne Einheit und ohne Hilfetext. Ich nehme an, das sind m² (die Gebäudeseite zeigt danach «56 m²»), aber im Formular steht es nicht. |
| P-5 | Minor | Neues Gebäude, ganze Seite | Mit 8 Wohnungen wird die Seite auf dem Handy etwa 7650 px lang; jede Karte ist rund 560 px hoch (Häkchen, Nummer, Stockwerk, Fläche, Zimmer, alle untereinander). Bis zum Speichern-Knopf muss ich etwa neun Bildschirmhöhen wischen. Es gibt keine kompakte Übersicht («8 Wohnungen: EG 2, 1.–3. OG je 2»), die ich nur bei Bedarf aufklappe. |

## Beobachtungen (Runde 2)

- Kein seitliches Scrollen: Seitenbreite 390 = Fensterbreite, vor und nach der Trefferwahl und auf der Gebäudeseite nach dem Speichern. Kein Element ragt über den rechten Rand.
- Alle Felder, Auswahllisten und Knöpfe sind mindestens 48 px hoch (Speichern-Knopf 68 px, zweizeilig). Das Häkchen «Wohnung übernehmen» selbst ist 24 × 24 px, aber die ganze Zeile mit dem Text ist 274 × 48 px gross und schaltet es um; ich habe auf den Text getippt, das ging zuverlässig.
- Eine abgewählte Wohnung bleibt sichtbar, ihre Felder werden grau und gesperrt (Screenshot `11-unchecked-card.png`). Das ist klar; ich sehe, was ich weglasse.
- Der Treffer in der Vorschlagsliste ist 306 × 64 px gross, gut zu treffen.
- Die Übernahme füllt alles: Gebäudename «Saumackerstrasse 20», Strasse, PLZ 8048, Ort Zürich, Kanton Zürich (ZH), Gebäudetyp Mehrfamilienhaus, Baujahr 1933. Ich musste nichts von Hand eintippen ausser der Suche.
- Die Hinweise über der Liste («Prüfen Sie die Angaben … können veraltet sein» und «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt … ihren Anteil tragen Sie») sind verständlich. Der zweite Satz ist für mich wichtig: ich hätte sonst die selbst bewohnte Wohnung weggelassen.
- «Im Register ohne halbe Zimmer: bitte prüfen» bei jeder Zimmeranzahl: Ich verstehe es erst beim zweiten Lesen (eine 3½-Zimmer-Wohnung steht als 3 drin). Ein Beispiel «3½ statt 3» würde helfen.
- Alle 8 Häkchen heissen für den Screenreader gleich «Wohnung übernehmen»; die Karte (fieldset) heisst aber «Wohnung 2» usw. Für mich mit Touch kein Problem, nur notiert.
- Nach dem Speichern: Gebäudeseite «Saumackerstrasse 20» mit Meldung «Gebäude «Saumackerstrasse 20» gespeichert», «Wohnungen 8, davon 0 vermietet und 8 leer», nach Stockwerk gruppiert (EG: 1, 2; 1. OG: 101, 102; …), je «2 Zimmer 56 m²» bzw. «3 Zimmer 76 m²», alle «Leer».
- Im Suchfeld steht nach der Wahl «Saumackerstrasse 20, 80…», abgeschnitten wegen Lupe und ×; stört nicht, die Felder darunter zeigen die volle Adresse.

## Aufgabe geschafft: ja

Gebäude «Saumackerstrasse 20, 8048 Zürich» mit allen 8 Wohnungen in einem Schritt gespeichert (POST `/buildings/new` → Gebäudeseite `/buildings/09c0e68f-…`).

## Aufwand

4 Antipper plus Tippen der Suche: «Gebäude erfassen» → Suchfeld → «Saumackerstrasse 20 8048» tippen → Treffer → (runterwischen, etwa neun Bildschirmhöhen) → «Gebäude und Wohnungen erstellen». Im Skript knapp 5 s; als Mensch schätze ich gut eine Minute, fast nur Wischen und kurz Prüfen der Karten. Treffer erschienen ca. 1–2 s nach dem Tippen, die Wohnungen nach dem Antippen des Treffers ebenfalls in 1–2 s.

## Ablauf (Runde 2)

1. **Gebäudeliste.** Erwartet: Knopf zum Anlegen. Gesehen: «Gebäude erfassen», 3 Demo-Gebäude. Getippt.
2. **Neues Gebäude.** Erwartet: Suchfeld. Gesehen: wie in Runde 1, «Adresse suchen (optional)» unter «Gebäudename».
3. **Suche «Saumackerstrasse 20 8048».** Erwartet: Trefferliste. Gesehen: ein Treffer «Saumackerstrasse 20 / 8048 Zürich (ZH)» direkt unter dem Feld (`03-hits.png`).
4. **Treffer angetippt.** Erwartet: Felder gefüllt und eine Liste der Wohnungen, am besten mit Anzahl. Gesehen: Felder gefüllt, blauer Hinweis «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros … als eigene Wohnung.» (`04b-viewport.png`). Von den Wohnungen sah ich zunächst nichts (P-3).
5. **Runtergewischt.** Gesehen: Abschnitt «Wohnungen aus dem Gebäuderegister» mit 8 Karten, jede mit Häkchen «Wohnung übernehmen» (angehakt), Wohnungsnummer, Stockwerk, Fläche, Zimmeranzahl (`08-list-viewport.png`, `09-list-viewport2.png`). Reihenfolge 2, 1, 102, 101 … (P-2), Fläche ohne Einheit (P-4).
6. **Probe: ein Häkchen ab- und wieder angehakt** (über den Text getippt). Erwartet: Karte wird ausgeschlossen. Gesehen: Felder grau und gesperrt; wieder angehakt aktiv.
7. **«Gebäude und Wohnungen erstellen»** ganz unten (`10-bottom.png`). Erwartet: Gebäudeseite mit 8 Wohnungen. Gesehen: genau das, mit Erfolgsmeldung (`07b-saved-viewport.png`).

## Verwirrung (Runde 2)

- Ich wusste nach der Trefferwahl nicht, ob Wohnungen gekommen sind (P-3).
- «Fläche» ohne Einheit (P-4).
- «Im Register ohne halbe Zimmer: bitte prüfen» – kurz, aber erst beim zweiten Lesen klar.
- Der Knopf heisst jetzt «Gebäude und Wohnungen erstellen», vorher und auf der Liste «Gebäude erfassen»: «erstellen» und «erfassen» für dasselbe.

## Fehlerrisiken (Runde 2)

- Wer schnell ist (wie ich), wischt an 8 Karten vorbei und speichert, ohne die veralteten Registerangaben zu prüfen; die Zimmerzahl ist laut Hinweis bei 3½-Zimmer-Wohnungen falsch und landet so in Dwello. Eine kompaktere Liste würde das Prüfen eher fördern als neun Bildschirme Formular.
- Durch die unsortierte Reihenfolge (P-2) übersieht man leicht, dass eine Wohnung fehlt oder doppelt ist.

## Vorschläge (Runde 2)

- **P-2**: `/buildings/new` auf dem Handy, «Saumackerstrasse 20 8048» suchen, Treffer wählen, zur Liste wischen: Reihenfolge 2, 1, 102, 101, 202, 201, 302, 301. Hilfe: dieselbe Sortierung wie auf der Gebäudeseite (Stockwerk, dann Nummer).
- **P-3**: wie P-2, nach dem Antippen des Treffers im Blickfeld bleiben. Hilfe: direkt beim Treffer oder im blauen Kasten «8 Wohnungen gefunden, unten prüfen» mit Sprung zur Liste; im Knopf die Zahl der angehakten Wohnungen («Gebäude und 8 Wohnungen erstellen»).
- **P-4**: wie P-2, eine Karte ansehen. Hilfe: «Fläche in m²» als Label oder «m²» neben dem Feld, wie auf der Gebäudeseite.
- **P-5**: wie P-2, bis zum Speichern-Knopf wischen (ca. 7650 px Seite). Hilfe: Fläche und Zimmer nebeneinander, oder pro Wohnung eine einzeilige Zusammenfassung («Wohnung 1 · EG · 76 m² · 3 Zimmer»), die man zum Ändern aufklappt.

## Nicht geprüft (Runde 2)

- Ein Gebäude mit Läden oder Büros, ein Treffer ohne Wohnungen und ein Fehler des Registers in dieser Runde (in Runde 1 gesehen).
- Ändern einer Registerangabe vor dem Speichern (z. B. 3 → 3½ Zimmer) und Prüfung, ob die Änderung gespeichert wird: ich habe alles so übernommen, wie es kam.
- Dunkelmodus und Querformat.
- Ich habe genau ein Gebäude gespeichert («Saumackerstrasse 20», 8 Wohnungen); die Demo-Gebäude habe ich nicht angefasst. Zwei vorherige Durchläufe brachen vor dem Speichern ab.

Skripte und Screenshots Runde 2: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/marco-479-r2/`.
