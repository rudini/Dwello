# Helga: eigenen Verteilschlüssel mit Formel anlegen

Persona: Helga, 68 · Desktop 1440 × 900, Zoom 150 % (Stichprobe 200 %), Maus · App: Persona-Stack http://localhost:3300 (Demodaten)
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/67c7d583-cf55-529a-b2b5-cc16e5582f4d/scratchpad/helga-formula-form/`

Aufgabe: «Ich möchte einen eigenen Verteilschlüssel anlegen, der die Kosten zu 70 % nach Wohnfläche und zu 30 % gleichmässig auf alle Wohnungen verteilt. Ich baue die Formel mit den Knöpfen zusammen, teste sie und speichere sie unter dem Namen «Pro Fläche (m²)».» Dazu Fehlerfälle: fehlende schliessende Klammer, zwei Rechenzeichen hintereinander («{area} * / 2»), «{area} 2», jeweils mit «Formel testen» und mit Speichern.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Verteilschlüssel, Formel | Nach einem Klick auf einen Baustein-Knopf bleibt die Schreibmarke nicht im Formelfeld, der Knopf behält den Fokus. Tippe ich danach « / » weiter, löst jede Leertaste den Knopf noch einmal aus: aus meinem Aufbau wurde «{area}0.7 * {area}{area}{area}{area_total}{area_total}…». Ich sah nur, dass die Formel kaputt ist, nicht warum. |
| P-2 | Minor | Neuer Verteilschlüssel, Formel | Das Formelfeld ist schon mit «{area}» gefüllt (als echter Inhalt, kein grauer Beispieltext). Ich habe hineingeklickt und «0.7 * » getippt, daraus wurde «{area}0.7 * ». Der Test fand den Fehler, aber ich musste erst merken, dass ich das Feld leeren muss. |
| P-3 | Minor | Neuer Verteilschlüssel, Formel | Die Baustein-Knöpfe hängen den Baustein immer ans Ende an, auch wenn die Schreibmarke vorne oder in der Mitte steht (Schreibmarke an den Anfang, Klick auf «{rooms}» ergab «{area}{rooms}»). Einen vergessenen Baustein in der Mitte einzufügen geht mit den Knöpfen nicht. |
| P-4 | Minor | Neuer Verteilschlüssel, Testergebnis | Nach «Formel testen» bleibt die Tabelle mit den Anteilen stehen, auch wenn ich die Formel danach ändere. Ich hatte «{area}» getestet (Tabelle 14.49 % … 34.78 %), dann « * / 2» angehängt: die alte, gute Tabelle stand weiter da, als wäre die neue Formel in Ordnung. |

## Beobachtungen

- Der Weg ist gut zu finden: Seitenleiste «Einstellungen», dort «Stammdaten» → «Verteilschlüssel» (zusätzlich direkt in der Seitenleiste), oben der Knopf «Verteilschlüssel erfassen».
- Die Fehlermeldungen beim Testen und beim Speichern sind klar und sagen, was zu tun ist; genau das wollte ich:
  - fehlende Klammer: «Die Klammer am Anfang von «({area} / {area_total} + 0.3» wird nicht geschlossen. Setzen Sie «)» dort, wo sie enden soll.»
  - «{area} * / 2»: «… folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen.»
  - «{area} 2»: «… fehlt ein Rechenzeichen zwischen zwei Werten. Setzen Sie +, -, * oder / dazwischen.»
  - leere Formel: «Bitte geben Sie eine Formel ein.»
  Beim Test erscheinen sie in einem roten Kasten «Der Test hat einen Fehler gefunden» unter dem Knopf; beim Speichern bleibt die Seite offen, die Meldung steht rot direkt unter dem Formelfeld, das Feld ist als fehlerhaft markiert und hat den Fokus, meine Eingaben bleiben erhalten. Nichts wurde gespeichert.
- Der Name «Pro Fläche (m²)» aus meiner Aufgabe ist schon vergeben (vordefinierter Schlüssel nach Fläche). Dwello lehnt ab: «Ein Verteilschlüssel mit dem Namen «Pro Fläche (m²)» existiert bereits. Wählen Sie einen anderen Namen.», Namensfeld markiert und fokussiert. Verständlich; ich habe «Fläche 70 % und gleich 30 %» genommen.
- Dass es mit «Heizung (Fläche 70 % / Einheit 30 %)» schon einen vordefinierten Schlüssel mit genau meiner Formel gibt, sagt mir das Formular nicht; ich hätte ihn gar nicht anlegen müssen. Aufgefallen ist es mir erst in der Liste.
- Für + - * / und Klammern gibt es keine Knöpfe, nur für Bausteine; die muss ich tippen. Der Hilfetext über dem Feld sagt das («rechnen Sie mit + - * / und Klammern»).
- Das Formelfeld ist einzeilig; meine lange Formel war darin abgeschnitten, das Ende sah ich nur durch Scrollen im Feld.
- Testergebnis für die richtige Formel: «So würden die Kosten auf vier Beispielwohnungen verteilt», 50 m² 17.64 %, 75 m² 22.72 %, 100 m² 27.79 %, 120 m² 31.85 %. Nachgerechnet stimmt das (z. B. 0.7 × 50/345 + 0.3/4 = 17.64 %). Dass es Beispielwohnungen sind und nicht meine, steht in der Überschrift. Die Prozentzahlen stehen ohne Leerzeichen vor «%» (17.64%), sonst in Dwello «70 %».
- Nach dem Speichern: zurück in der Liste, Meldung «Verteilschlüssel «Fläche 70 % und gleich 30 %» gespeichert», mein Schlüssel steht oben mit Beschreibung, Formel, «Eigener Verteilschlüssel», «0 Rechnungen» und «Löschen».
- Bei 200 % Zoom passt die Seite ohne seitliches Scrollen, Schrift gross genug.
- «Wohnfläche in m²», «Anzahl Wohnungen im Gebäude» neben den englischen Bausteinnamen helfen; die Namen in geschweiften Klammern selbst («{units_total}») sind für mich fremd, aber durch die Erklärung daneben verständlich.

## Aufgabe geschafft: teilweise

Der Schlüssel mit der gewünschten Formel ist gespeichert, aber nicht unter dem Namen «Pro Fläche (m²)», weil dieser Name vergeben ist (Dwello lehnt das zu Recht ab). Alle Fehlerfälle wurden beim Testen und beim Speichern abgefangen und erklärt.

## Aufwand

Etwa 15 Minuten, rund 35 Schritte (zwei Anläufe zum Aufbau der Formel mit den Knöpfen, vier Fehlerfälle je mit Test und Speichern, ein abgelehnter und ein erfolgreicher Speicherversuch).

## Ablauf

- Formelfeld anklicken und «0.7 * » tippen. Erwartet: leeres Feld, darin «0.7 * ». Gesehen: «{area}0.7 * », das Feld war schon mit «{area}» gefüllt (P-2).
- Knopf «{area}» klicken, dann « / » weitertippen. Erwartet: «… {area} / ». Gesehen: «{area}{area}{area}», die Leertasten haben den Knopf erneut gedrückt (P-1). Am Ende stand eine unbrauchbare Formel da; «Formel testen» meldete «Bei «{area}0.7 *» fehlt ein Rechenzeichen …», nannte aber nur die erste Stelle.
- Zweiter Anlauf: Feld geleert, vor jedem Tippen wieder ins Feld geklickt. So entstand die richtige Formel «0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}».
- Schreibmarke an den Anfang gesetzt, «{rooms}» geklickt. Erwartet: Baustein vorne. Gesehen: hinten angehängt (P-3).
- Nach erfolgreichem Test die Formel kaputt gemacht. Erwartet: Testergebnis verschwindet oder wird als veraltet markiert. Gesehen: alte Tabelle bleibt (P-4).
- Speichern unter «Pro Fläche (m²)». Erwartet: gespeichert. Gesehen: Ablehnung, Name existiert bereits.

## Vorschläge

- **P-1:** «Neuer Verteilschlüssel» öffnen, ins Formelfeld klicken, «0.7 * » tippen, Knopf «{area}» klicken, sofort « / » tippen. Hilfreich: nach dem Klick auf einen Baustein-Knopf die Schreibmarke ins Formelfeld zurücksetzen (hinter den eingefügten Baustein), damit man direkt weitertippen kann.
- **P-2:** «Neuer Verteilschlüssel» öffnen, ins Formelfeld klicken und tippen. Hilfreich: Feld leer lassen (das Beispiel «{area}» als grauen Platzhalter oder im Hilfetext zeigen) oder den Inhalt beim ersten Klick markieren.
- **P-3:** Formel «{area}» stehen lassen, Schreibmarke an den Anfang, Knopf «{rooms}» klicken. Hilfreich: Baustein an der Schreibmarke einfügen bzw. die markierte Stelle ersetzen.
- **P-4:** «{area}» eingeben, «Formel testen», danach « * / 2» anhängen. Hilfreich: Testergebnis beim Ändern der Formel ausblenden oder mit «Formel geändert, bitte erneut testen» kennzeichnen.

## Nicht geprüft

- Wie der neue Schlüssel bei einer Rechnung oder in einer Nebenkostenabrechnung wirkt: nicht Teil der Aufgabe, keine Rechnung zugeordnet.
- Bearbeiten und Löschen des eigenen Schlüssels und die Übersetzungsfelder: nicht Teil der Aufgabe; nur gesehen, dass «Löschen» angeboten wird.
- Fehler beim Speichern durch einen ausgefallenen Server: nicht verlangt, nicht simuliert.
- Zwei zusätzliche Speicherversuche mit gültiger Formel unter vergebenem Namen habe ich nicht gemacht; einer zeigte die Ablehnung eindeutig.
