# Helga, Runde b16: Umzug im selben Haus (Mietvertrag beenden, neuer Mietvertrag)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichproben bei 200 %), Maus. Deutsche Oberfläche, persona-App auf http://localhost:3300. Gespeichert nur im Gebäude «Musterhaus Zentrum».
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/4a7c6673-41aa-588f-b826-4de1712d5e24/scratchpad/helga-b16/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag Hans Müller (alt), «Nächste Schritte», und «Mietvertrag bearbeiten» | Auch nachdem der neue Mietvertrag für die Wohnung 2.02 gespeichert ist, bieten beide Seiten weiter «Neuen Mietvertrag für Hans Müller erfassen» an. Kein Wort davon, dass es den neuen Mietvertrag schon gibt. Ich weiss nicht, ob ich fertig bin, und könnte einen zweiten erfassen. |
| P-2 | Minor | Mietvertrag Hans Müller (alt), «Nächste Schritte» | «Für die Schlussabrechnung braucht es die neue Adresse des Mieters» und die Schaltfläche «Neue Adresse eintragen» stehen auch beim Umzug im selben Haus da. Hans wohnt danach an derselben Bahnhofstrasse 42, nur in einer anderen Wohnung. Muss ich da etwas eintragen? Die Seite sagt es nicht. |
| P-3 | Minor | «Mietvertrag bearbeiten» (alter Mietvertrag), Kasten «Mieter und Wohnung» | Der Text ist sehr lang (vier Absätze). Er spricht von Erben, Geschäftsräumen, Gerichten und Ehegatten, nichts davon betrifft mich. Der Satz «Endet dieser Mietvertrag früher als hier erfasst, ändern Sie zuerst unten unter «Vertragsdauer» das Vertragsende» ist mir unklar: Zuerst vor was? |
| P-4 | Nit | Assistent «Neuer Mietvertrag», Schritt 2, Hinweis «… hat einen Mietvertrag ohne Vertragsende» | Der Hinweis schickt mich zum alten Mietvertrag. Er sagt aber nicht, wie ich danach zurückkomme. Über «Neuen Mietvertrag für Anna Schmidt erfassen» beginnt der Assistent wieder bei Schritt 1, obwohl vorher «Entwurf gespeichert» stand. |
| P-5 | Nit | «Mietvertrag bearbeiten» (alter Mietvertrag), gelber Kasten oben | «Laufender Mietvertrag … Bei Mietanpassungen sollten Sie die gesetzlichen Kündigungsfristen beachten» steht auch bei einem gekündigten Mietvertrag. Für mich passt das nicht zum Umzug; ich habe kurz gedacht, ich hätte bei der Kündigung etwas falsch gemacht. |

## Beobachtungen

- Der Dialog «Mietvertrag von …, beenden?» öffnet bei 150 % und 200 % schon nach unten gescrollt, der Titel ist oben abgeschnitten (bei 200 % ganz ausserhalb). Mit dem Mausrad nach oben sehe ich ihn wieder (Bild `21-dialog-zoom2.png`, `05b-dialog-viewport.png`).
- Nach dem Beenden gibt es eine klare Meldung: «Der Mietvertrag von Hans Müller endet am 31.01.2027. Die nächsten Schritte sehen Sie oben auf der Seite.» Und oben steht wirklich der Kasten «Nächste Schritte» mit «Neuen Mietvertrag für Hans Müller erfassen». Das hat mir sehr geholfen (`06-nach-beenden-viewport.png`).
- Im Assistenten ist Hans Müller nach diesem Link schon gewählt. In der Wohnungsliste steht 1.01 als «verfügbar ab 01.02.2027». Gut.
- Die Wohnung 2.02 war bis zum 31.01.2027 frei. Nach meinem Speichern steht sie bei Anna in der Liste als «nicht verfügbar», die Wohnung 1.01 dagegen als «verfügbar ab 01.02.2027». Das ist für mich verständlich, aber nicht gleich gemacht.
- Die Liste der freien Wohnungen beginnt mit «Wohnung OG2 - Alpenblick», dann kommt Musterhaus Zentrum, dann Seepark. Nach welcher Ordnung, sehe ich nicht.
- Auf der Gebäudeseite stehen jetzt «Vermietet bis 31.01.2027» (1.01) und «Wiedervermietet ab 01.02.2027» (2.02). «Wiedervermietet» für eine Wohnung, die vorher leer war, klingt für mich seltsam, aber die Erklärung «Was bedeutet der Mietstatus?» steht gleich darunter.
- Bei «Vertragsende» steht «Unbefristet, gekündigt auf den 31.01.2027». Zuerst habe ich gestutzt (unbefristet und doch ein Ende?), dann aber verstanden.
- Nach «Mietvertrag speichern» lande ich in der Liste aller Mietverträge, nicht beim neuen Mietvertrag. Die Meldung «Mietvertrag von Hans Müller gespeichert» kommt. Hans Müller steht zweimal in der Liste; dank «Wohnung 2.02 … Künftig ab 01.02.2027» kann ich die beiden auseinanderhalten.
- Für die Miete der neuen Wohnung bekomme ich keinen Vorschlag. Ich habe 1250.00 / 180.00 (Hans) und 1100.00 / 160.00 (Anna) erfunden, weil die Aufgabe keine Beträge nennt.

## Aufgabe geschafft: ja

Alle drei Aufgaben geschafft: Hans Müller beendet auf den 31.01.2027, neuer Mietvertrag Wohnung 2.02 ab 01.02.2027 gespeichert. Anna Schmidt beendet auf den 28.02.2027, neuer Mietvertrag Wohnung 3.02 ab 01.03.2027 gespeichert. Die Seite «Bearbeiten» des alten Mietvertrags habe ich gelesen und grösstenteils verstanden.

## Aufwand

Etwa 25 Minuten. Aufgabe 1: 9 Schritte (Übersicht → Gebäude → Wohnung 1.01 → Mietvertrag → Beenden → Datum → Nächste Schritte → Assistent 5 Schritte → Speichern). Aufgabe 2: 12 Schritte (Mietverträge → Mietvertrag erfassen → Mieterin → Hinweis → Link zum alten Mietvertrag → Beenden → Datum → Nächste Schritte → Assistent von vorne → Speichern). Aufgabe 3: 1 Seite lesen, etwa 3 Minuten.

## Ablauf

1. **Übersicht.** Erwartet: einen Weg zu Hans Müller. Gesehen: «Häufige Arbeiten» mit «Mietvertrag erfassen», aber nichts zu Kündigung oder Umzug. Ich bin über «Gebäude auf einen Blick» → «Musterhaus Zentrum» gegangen.
2. **Gebäude → Wohnung 1.01.** Erwartet: Hans Müller sehen. Gesehen: «Aktueller Mieter Hans Müller, Mietvertrag seit 01.03.2021» und unten «Mietvertrag von Hans Müller». Gut.
3. **Mietvertrag von Hans Müller.** Erwartet: etwas wie «Kündigen». Gesehen: «Bearbeiten», «Beenden», «Löschen». «Beenden» habe ich als Kündigung verstanden.
4. **Dialog «beenden?».** Erwartet: ein Datum. Gesehen: «Vertragsende – Der letzte Tag des Mietverhältnisses, also der Kündigungstermin …», dazu ein Hinweis auf 3 Monate Kündigungsfrist und «Ein neuer Mietvertrag kann am Tag danach beginnen». Das hat mir gesagt: 31.01.2027 eintragen, weil der Umzug am 01.02. ist. Den Titel des Dialogs sah ich zuerst nicht, er war oben abgeschnitten.
5. **Nach dem Beenden.** Erwartet: eine Bestätigung. Gesehen: grüne Meldung und den Kasten «Nächste Schritte» mit drei Schaltflächen: «Nachmieter erfassen», «Neuen Mietvertrag für Hans Müller erfassen», «Neue Adresse eintragen». Die mittlere war genau, was ich brauchte. Bei «Neue Adresse eintragen» war ich unsicher (P-2).
6. **Assistent, Schritt 1–5.** Erwartet: dass Hans Müller schon gewählt ist. Gesehen: ja. Wohnung 2.02 gewählt, Vertragsbeginn 01.02.2027 (darunter «Montag, 1. Februar 2027», das beruhigt), unbefristet, Miete erfunden, Prüfen, «Mietvertrag speichern». Gespeichert, Meldung kam.
7. **Zurück beim alten Mietvertrag.** Erwartet: einen Hinweis «Neuer Mietvertrag erfasst» oder dass der Kasten verschwindet. Gesehen: derselbe Kasten mit «Neuen Mietvertrag für Hans Müller erfassen» wie vorher (P-1).
8. **Aufgabe 2: Mietverträge → Mietvertrag erfassen → Anna Schmidt → Weiter.** Erwartet: dass Dwello merkt, dass Anna schon eine Wohnung hat. Gesehen: blauer Hinweis «Anna Schmidt hat einen Mietvertrag ohne Vertragsende … Zieht Anna Schmidt in eine andere Wohnung um, beenden Sie diesen Mietvertrag auf seiner Seite mit «Beenden». Mietet Anna Schmidt beide Wohnungen, machen Sie hier weiter.» und ein Link «Zum Mietvertrag für die Wohnung 1.02». Sehr verständlich.
9. **Link → Beenden → 28.02.2027.** Gleich wie bei Hans. Danach «Neuen Mietvertrag für Anna Schmidt erfassen» geklickt. Erwartet: zurück bei Schritt 2. Gesehen: wieder Schritt 1, Anna aber schon gewählt (P-4). Bei Schritt 2 war der Hinweis jetzt weg, und 1.02 stand als «verfügbar ab 01.03.2027» da. Das hat mir gezeigt, dass das Beenden geklappt hat.
10. **Wohnung 3.02, 01.03.2027, Miete, Speichern.** Gespeichert, Meldung kam.
11. **Aufgabe 3: «Bearbeiten» beim alten Mietvertrag von Hans.** Gesehen: «Mieter und Wohnung lassen sich nicht ändern. Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.02.2027. Bei einem Wechsel der Wohnung erfassen Sie einen neuen Mietvertrag für die andere Wohnung.» Das verstehe ich: Ich darf hier nicht einfach die Wohnung auf 2.02 ändern, sondern brauche einen neuen Mietvertrag. Das habe ich ja gemacht. Dann folgen zwei Absätze über Fehler, Tod, Geschäftsräume und Gerichte, die ich nicht brauche (P-3), und wieder der Link «Neuen Mietvertrag für Hans Müller erfassen», obwohl es ihn schon gibt (P-1). Unten ist «Unbefristet, gekündigt auf den 31.01.2027» gewählt, das Vertragsende 31.01.2027 ist da. Das stimmt.

## Verwirrung

- «Beenden» statt «Kündigen»: Ich habe es richtig erraten, und der Dialog erklärt es mit «also der Kündigungstermin».
- «Neue Adresse des Mieters» beim Umzug im selben Haus (P-2).
- «Nachmieter» kannte ich, aber bei Hans' Umzug war kurz nicht klar, ob *er* jetzt sein eigener Nachmieter ist. Die Schaltfläche «Neuen Mietvertrag für Hans Müller erfassen» daneben hat das geklärt.
- «Wiedervermietet» für die bisher leere 2.02.
- «Endet dieser Mietvertrag früher als hier erfasst …» (P-3).
- «Unbefristet, gekündigt auf den …»: zuerst widersprüchlich.

## Fehlerrisiken

- Zweiter, doppelter Mietvertrag für Hans Müller oder Anna Schmidt über den weiter angebotenen Link (P-1). Die Wohnung 2.02 ist danach gesperrt, aber eine andere freie Wohnung (z. B. OG2 Alpenblick) könnte ich versehentlich wählen.
- Beim Hinweis in Schritt 2 könnte jemand «machen Sie hier weiter» überlesen und ohne Beenden weitermachen. Dann hätte Anna zwei laufende Mietverträge. Der Hinweis ist aber deutlich.
- Unnötiges Ändern der Adresse beim Mieter, der nur innerhalb des Hauses umzieht (P-2).
- Mit dem abgeschnittenen Dialogtitel sieht man nicht sofort, welcher Mietvertrag beendet wird.

## Vorschläge

- **P-1:** Mietvertrag 1.01 von Hans Müller beenden (31.01.2027), über «Neuen Mietvertrag für Hans Müller erfassen» einen Mietvertrag für 2.02 ab 01.02.2027 speichern, dann den alten Mietvertrag und seine Seite «Bearbeiten» öffnen. Hilfreich: Gibt es für den Mieter einen künftigen Mietvertrag ab dem Tag nach dem Vertragsende, statt der Schaltfläche einen Satz wie «Neuer Mietvertrag erfasst: Wohnung 2.02 ab 01.02.2027» mit Link zeigen.
- **P-2:** wie P-1, Kasten «Nächste Schritte». Hilfreich: Hat der Mieter einen neuen Mietvertrag im Bestand, den Adress-Satz weglassen oder erklären («Zieht der Mieter in eine Ihrer Wohnungen um, müssen Sie keine Adresse eintragen»).
- **P-3:** «Bearbeiten» bei einem laufenden Mietvertrag öffnen. Hilfreich: die Sonderfälle (Tod, Übertragung, Gericht) zuklappen oder kürzen und den Satz «Endet dieser Mietvertrag früher …» so schreiben, dass klar ist, wann man was zuerst tut.
- **P-4:** Mietverträge → Mietvertrag erfassen → Anna Schmidt → Weiter → Link zum alten Mietvertrag → Beenden → «Neuen Mietvertrag für Anna Schmidt erfassen». Hilfreich: im Hinweis sagen «Danach kommen Sie mit «Neuen Mietvertrag für … erfassen» hierher zurück», oder den Assistenten bei Schritt 2 fortsetzen.
- **P-5:** «Bearbeiten» bei einem gekündigten Mietvertrag öffnen. Hilfreich: Bei einem gekündigten Mietvertrag den Satz zu Mietanpassungen weglassen oder auf die Kündigung eingehen.

## Nicht geprüft

- Was passiert, wenn ich den Hinweis in Schritt 2 übergehe und für Anna ohne Beenden einen zweiten Mietvertrag speichere: Ich wollte keinen falschen Datensatz hinterlassen.
- Ob ein zweiter Mietvertrag für Hans Müller in einer anderen Wohnung über den weiter angebotenen Link (P-1) gespeichert würde: Er wäre in einem anderen Gebäude gelandet (die freien Wohnungen in Musterhaus Zentrum waren belegt), dort darf ich nicht speichern.
- «Neue Adresse eintragen» habe ich nicht geöffnet und nichts beim Mieter geändert.
- Die Seite «Bearbeiten» habe ich nur bei 150 % ganz angesehen, bei 200 % nur den Dialog «beenden?».
- Andere Sprachen und Handy: nicht Teil von Helgas Aufgabe.
