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
