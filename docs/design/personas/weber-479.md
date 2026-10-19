# Dr. Weber – Adresssuche im Gebäuderegister (#479)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/weber-479/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neues Gebäude | Die Adresssuche im Persona-Stack findet nichts: jede Suche endet mit «Das Gebäuderegister ist gerade nicht erreichbar» (`/api/addresses` antwortet 502 `{"error":"unreachable"}`), dreimal mit verschiedenen Adressen. Vom selben Rechner antwortet `api3.geo.admin.ch` per curl mit 200. Die Vorschläge (Gebäudetyp, Baujahr, Wohnungen) konnte ich deshalb gar nicht beurteilen. Vermutlich liegt es an der Umgebung (der Server geht nicht über den Proxy). Bestätigt ist das nicht. |
| P-2 | Minor | Neues Gebäude / Datenschutz | Bei langsamem Tippen (400 ms pro Taste) schickt der Browser für jeden Buchstaben eine eigene Suche: 22 Anfragen von «Se» bis «Seebahnstrasse 155 Zürich». Die Datenschutzerklärung spricht von «dem eingegebenen Suchbegriff» (Einzahl). Als Leser verstehe ich darunter eine Abfrage, nicht jeden Zwischenstand meiner Eingabe. |
| P-3 | Minor | Neues Gebäude | Beim Kanton steht «Wird mit der Adresssuche ausgefüllt.». Ist das Register nicht erreichbar und erfasse ich von Hand, stimmt das nicht mehr. Dann muss ich den Kanton selbst wählen, und der Hinweis sagt mir das nicht. |
| P-4 | Nit | Datenschutz | Der Link «Datenschutzerklärung von swisstopo» führt auf `https://www.swisstopo.admin.ch/en/legal-framework`: eine englische Seite «legal framework», keine deutschsprachige Datenschutzerklärung. Die Links zu Google führen dagegen direkt auf die Datenschutzerklärung. |

## Beobachtungen

- Im Browser geht die Suche nur an `http://localhost:3300/api/addresses?q=…`. Eine Anfrage an geo.admin.ch macht der Browser nicht. Damit stimmt die Aussage «über den Server von Dwello … die IP-Adresse des Servers, nicht die des Browsers», soweit ich das sehen kann.
- Am Suchfeld selbst steht nicht, dass die Eingabe an swisstopo geht. Das steht nur in der Datenschutzerklärung. Ich würde es mir dort wünschen, wo ich tippe, etwa als Satz im Hilfetext.
- Die Fehlermeldung ist ein gelber Hinweis mit Warndreieck direkt unter dem Suchfeld (Screenshot `see-a-list.png`). Sie erscheint im Barrierefreiheitsbaum als gewöhnlicher Absatz, und die vorhandene Statusregion der Seite bleibt leer. Ein Screenreader würde die Meldung also wohl nicht ansagen (das prüft besser Sven).
- Bei 502 (Register nicht erreichbar) und bei 500 (von mir erzwungen) erscheint derselbe Text. Für den Nutzer ist das richtig so: in beiden Fällen kann er von Hand weiterarbeiten.
- Die Seite oben sagt klar, was ohne Treffer passiert: «Ohne Treffer erfassen Sie die Angaben von Hand und legen die Wohnungen danach an.» Das finde ich gut.
- Der Button in der Gebäudeliste heisst «Gebäude erfassen», die Seite dahinter «Neues Gebäude». Gefunden habe ich sie trotzdem sofort.

## Aufgabe geschafft: teilweise

- Teil 1 (Vorschläge beurteilen): **nein**, gescheitert am Schritt «Treffer erscheinen». Das Register war bei drei Versuchen nicht erreichbar (P-1).
- Teil 2 (Datenschutz): ja.
- Teil 3 (Fehlerfall 500): ja.

## Aufwand

Etwa 15 Minuten, 8 Durchläufe: Gebäudeliste, «Neues Gebäude», drei Suchen, Datenschutz, Fehlerfall mit Erfassung von Hand.

## Ablauf

1. **Gebäude → «Gebäude erfassen».** Erwartet: ein Formular mit Adresssuche. Gesehen: «Neues Gebäude» mit Einleitung, Feld «Adresse suchen (optional)», Hilfetext mit GWR und Beispiel «Seebahnstrasse 155 Zürich», darunter die Felder für die Erfassung von Hand (`02-new.png`).
2. **«Bernstrasse 10, 3005 Bern» eingetippt.** Erwartet: Trefferliste mit dem Gebäude, danach Gebäudetyp, Baujahr und Wohnungen. Gesehen: nach kurzer Zeit «Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.», keine Treffer. In der Netzwerkanfrage: 502 `{"error":"unreachable"}`.
3. **«Seebahnstrasse 155 Zürich».** Erwartet: Treffer. Gesehen: dasselbe wie in Schritt 2 (`see-a-list.png`).
4. **Dritter Versuch «Bernstrasse 10 Bern».** Gesehen: wieder 502 und dieselbe Meldung. Damit habe ich nach drei Versuchen aufgehört. Gegenprobe: curl auf `api3.geo.admin.ch` vom selben Rechner antwortet mit 200.
5. **Fusszeile → «Datenschutz», Abschnitt «Weitergabe an Dritte».** Erwartet: wer was bekommt. Gesehen: «Die Adresssuche … fragt über den Server von Dwello das eidgenössische Gebäude- und Wohnungsregister (GWR) des Bundesamts für Statistik ab, das … swisstopo auf geo.admin.ch bereitstellt (Schweiz). swisstopo erhält dabei den eingegebenen Suchbegriff und die Nummer des gewählten Gebäudes im Register sowie die IP-Adresse des Servers, nicht die des Browsers.» Mein Urteil: Empfänger (swisstopo), Registerhalter (BFS), Land (Schweiz) und Datenarten sind genannt. Der Weg über den Server stimmt mit dem überein, was der Browser tatsächlich anfragt. Unklar bleibt nur, dass jeder Zwischenstand der Eingabe einzeln übermittelt wird (P-2). Den Schlusssatz «Ausser den hier … genannten Diensten erhält niemand Daten» habe ich nicht widerlegt gefunden.
6. **Fehlerfall: `**/api/addresses**` im Browser auf 500 gesetzt, langsam «Seebahnstrasse 155 Zürich» getippt.** Erwartet: eine verständliche Meldung und ein Weg weiter. Gesehen: dieselbe gelbe Meldung wie oben (`20-fail500.png`). Sie sagt, was passiert ist und was ich tun kann. Dabei gingen 22 Anfragen hinaus, eine pro Buchstabe (P-2).
7. **Von Hand erfasst:** Strasse, PLZ und Ort lassen sich ohne Weiteres ausfüllen (`21-manual.png`). Der Kanton-Hinweis «Wird mit der Adresssuche ausgefüllt.» steht weiter da, obwohl die Suche nicht ging (P-3). Nicht gespeichert.

## Verwirrung

- «Gebäuderegister» (Einleitung) und «eidgenössisches Gebäude- und Wohnungsregister (GWR)» (Hilfetext) sind dasselbe. Verstanden habe ich es, aber zwei Namen für eine Sache lassen mich kurz zögern.
- «Nummer des gewählten Gebäudes im Register» meint wohl den EGID. Für mich ist das verständlich genug.
- «Gebäude erfassen» (Liste) und «Neues Gebäude» (Seite) sind zwei Namen für denselben Weg. Das hat mich nur leicht irritiert.

## Fehlerrisiken

- Ist das Register auch im Betrieb nicht erreichbar (wie hier), sieht der Verwalter die versprochene Übernahme der Wohnungen nie. Er muss alle Wohnungen einzeln anlegen, ohne zu erfahren, ob das Problem bei ihm oder bei Dwello liegt.
- Kanton von Hand: Wer dem Hinweis «Wird mit der Adresssuche ausgefüllt» glaubt, lässt «Kanton wählen» stehen und wundert sich dann über die Meldung beim Speichern (Speichern nicht geprüft).
- Datenschutz: Ein vorsichtiger Verwalter, der nur «den Suchbegriff» erwartet, gibt vielleicht eine Adresse ein, die er gar nicht übermitteln wollte. Die Teile davon sind dann schon draussen, bevor er fertig getippt hat.

## Vorschläge

- **P-1:** Reproduktion: Persona-Stack starten, «Neues Gebäude» öffnen, «Seebahnstrasse 155 Zürich» eintippen, und es kommt 502 «unreachable». Prüfen, ob der Backend-Server im Stack `HTTPS_PROXY` und das CA-Bundle verwendet. Danach die Persona-Runde für Teil 1 wiederholen. Wenn es an der Umgebung liegt, im Persona-README vermerken, wie der Stack das echte Register erreicht.
- **P-2:** Reproduktion: Suchfeld, langsam tippen (etwa 400 ms pro Taste), die Netzwerkanfragen zeigen eine pro Buchstabe. Hilfreich wäre ein längeres Warten nach dem letzten Tastendruck und eine Mindestlänge (etwa Strasse und Hausnummer). Oder die Datenschutzerklärung sagt ehrlich: «die Eingabe, auch während Sie tippen».
- **P-3:** Reproduktion: Suche schlägt fehl (500 erzwingen), der Kanton-Hinweis bleibt «Wird mit der Adresssuche ausgefüllt.». Besser wäre ein Text wie «Wird mit der Adresssuche ausgefüllt; ohne Treffer wählen Sie ihn hier.»
- **P-4:** Reproduktion: Datenschutz → «Datenschutzerklärung von swisstopo», es öffnet sich die englische Seite «legal framework». Besser auf die deutsche Datenschutzerklärung von swisstopo bzw. geo.admin.ch verlinken.

## Nicht geprüft

- Die Vorschläge zu Gebäudetyp, Baujahr, Wohnungsnummern, Stockwerk, Fläche und Zimmeranzahl sowie die Hinweise nach der Auswahl eines Treffers: Das Register war vom Server aus nicht erreichbar (P-1), es gab also nie einen Treffer.
- Ob beim Auswählen eines Treffers tatsächlich nur die Gebäudenummer an swisstopo geht (zweiter Teil der Datenschutzaussage): Es gab nichts zum Auswählen.
- Was der Server von Dwello an geo.admin.ch weitergibt: Diese Anfrage sehe ich im Browser nicht. Die Aussage zur Server-IP kann ich nur von der Browserseite her bestätigen.
- Speichern: laut Auftrag nicht.
