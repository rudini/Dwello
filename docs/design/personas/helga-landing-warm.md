# Helga: Landing Page, Runde «warm»

Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, braucht grosse Schrift, ist bei Fachwörtern unsicher. Desktop 1440 × 900 bei 150 % Zoom (dazu 200 %), Maus.
Aufgabe: die überarbeitete öffentliche Website (http://localhost:3310/index.html, Deutsch) mit dem Fragebogen `landing-fragebogen.md` beurteilen, Fragen 1–24, beide Animationen selbst abspielen. Keine Anmeldung, nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/3c9dac53-14ca-581f-8cfc-25c133ff3cbc/scratchpad/helga-landing-warm/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Erster Bildschirm | Der Satz sagt «Ihre Mieter bekommen einen Brief wie diesen.», aber bei 150 % sehe ich den Brief nicht: Unten schaut nur ein weisser Rand heraus. Bei 200 % nicht einmal der. Erst nach einmal Scrollen ist der Brief da. Ich habe zuerst gesucht, welcher Brief gemeint ist. |
| P-2 | Minor | Brief mit Zahlteil unter dem Einstieg | Die Schrift im Brief ist auch bei 150 % und 200 % zu klein für mich: Die Kostenübersicht (Lift, Allgemeinstrom …) und der kleine Text im Kasten «Nachzahlung» kann ich nicht lesen. Ein Klick auf den Brief vergrössert ihn nicht. Den Zahlteil daneben kann ich gerade noch lesen. |
| P-3 | Minor | «Verteilschlüssel und Heizprofile», «Verteilung abspielen», 200 % | Bei 200 % steht der Knopf «Verteilung abspielen» am unteren Rand des Bildschirms; die Kästchen, die sich bewegen, sind darunter, ausserhalb des Bildes. Ich drücke, sehe nichts geschehen, und wenn ich hinunterscrolle, ist alles schon fertig. |
| P-4 | Nit | «Rechnungen und KI», «Ablauf abspielen» | Der Ablauf hört bei «Bitte prüfen» auf. Schritt 3 der Liste darüber, «Sie prüfen die Angaben und bestätigen», sehe ich nicht: kein Bestätigen, kein «fertig». Die Liste 1–2–3 darüber bleibt still und zeigt nicht mit, welcher Schritt gerade läuft. |
| P-5 | Nit | «Installieren», «Für die Person, die einrichtet: die Befehle» | Hinter diesem Knopf steht auch etwas für mich: «Anmeldung mit Passwort … Wer will, meldet sich stattdessen mit dem Google-Konto an». Das hat mich beim letzten Mal am meisten gestört (Google-Konto nötig). Jetzt ist die gute Nachricht dort versteckt, wo ich nicht hineinschaue. |

## Beobachtungen

- Das Menü schliesst sich jetzt, sobald ich einen Eintrag wähle (früher P-1 in `helga-landing-2.md`). Ich lande bei «Häufige Fragen», die Kopfzeile steht danach oben. Während die Seite hinunterrutscht, rutscht die Kopfzeile kurz mit (Bildschirmfoto nach 0,9 Sekunden); nach 2,5 Sekunden steht sie oben (gemessen: oben bei 0). Kein Befund.
- «Einfach zu bedienen» spricht jetzt meine Sprache: «Grosse Schaltflächen», «Eine Hauptaktion pro Seite», «Lesbar bei Sonne und im Dunkeln», «Ganz auf dem Handy». Keine Pixel mehr. Mein früherer Wunsch ist erfüllt.
- Die Zahlenleiste mit «50 Wohnungen» ist weg; das Missverständnis von damals ist damit weg.
- Die vier Schritte tragen jetzt einen Zeitpunkt: «Einmal, zu Beginn», «Januar bis Dezember», «Im neuen Jahr», «Gleich danach». Das hilft mir, mein Jahr zu sehen. Echte Monate sind es nur bei «Januar bis Dezember»; bei «Im neuen Jahr» frage ich mich: Januar? März?
- Die schwarze Befehlsbox ist zu. Ich sehe zuerst nur, wer einrichtet und wie lange es dauert, dann zwei Knöpfe. Das beruhigt mich sehr.
- Die Anleitung zum Weitergeben ist weiterhin nur auf Englisch, und eine Antwort auf «Wer hilft mir, wenn etwas nicht geht?» gibt es noch nicht (wie in den beiden früheren Berichten).
- «Was in Dwello steckt» hat nur noch vier Kärtchen mit Neuem (Dunkelmodus, Mietverträge, Dokumente, Gebäuderegister). Die Schilder «Verfügbar» und «Geplant» sind weg; was geplant ist, steht jetzt nur noch unter «Roadmap».
- Open Source und Roadmap stehen jetzt nach den Fragen. Bis zu den Fragen bleibe ich bei mir; danach kommt der Teil für Computerleute. Das passt.
- Die Seite holt nichts von fremden Servern (nur localhost:3310), und in der Konsole steht kein Fehler.
- Von selbst bewegt sich nichts: Ich habe auf jedem Bildschirm nach dem Scrollen 1,5 Sekunden gewartet, und beide Animationen 3 Sekunden lang angeschaut, ohne zu drücken. Nichts hat sich verändert.
- Anhalten funktioniert: Nach «Anhalten» steht alles still (3 Sekunden geprüft), der Knopf heisst dann «Weiter abspielen». Am Ende heisst er «Nochmals abspielen»; es läuft nur einmal.
- Bei 150 % ist die Seite etwa 21 Bildschirme lang, bei 200 % etwa 29 (beim letzten Mal 24 und 33). Seitlich schieben muss ich nichts.

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Ein Programm, das mir die Nebenkostenabrechnung macht und meinen Mietern einen Brief mit Einzahlungsschein schickt, gratis, für die Schweiz. (Einstieg: «Ihre Nebenkostenabrechnung, einfacher gemacht.» und «Rechnungen hineinziehen, Abrechnung prüfen, mit QR-Rechnung versenden.»)
2. **Für wen? (5/5)** «für private Vermieterinnen und Vermieter» und gleich darunter «für die Arbeit mit Dwello brauchen Sie keine technischen Kenntnisse». Das bin ich. Vorher 4: Damals standen schon im ersten Absatz «KI», «eigener Rechner» und «Anbieter Ihrer Wahl»; jetzt nicht mehr.
3. **Was als Nächstes?** Ich würde zuerst hinunterscrollen, weil oben «einen Brief wie diesen» steht und ich den Brief sehen will (P-1). Danach «So kommen Sie zu Dwello», weil ich wissen will, wer mir das einrichtet.
4. **Vertrauenswürdig? (4/5)** Ruhig, grosse Schrift, keine Werbung, «Kostenlos und ohne Abo» sachlich gesagt. Wie beim letzten Mal fehlt mir auf dem ersten Bildschirm ein Gesicht oder ein Name, wer dahintersteht. Der Einzahlungsschein gleich darunter wirkt seriös: So einen bekomme ich auch von der Gemeinde.

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? (4/5)** Besser als beim letzten Mal (3): Der Einstieg, die vier Schritte und «Einfach zu bedienen» sind jetzt in Alltagssprache, und die Befehle sind weggeklappt. Unklar bleiben: Drag & Drop, Ollama, OpenAI-kompatible KI, NAS, Hoster, ZIP, «Art. 28 DSG», AGPL, Quellcode, Issue, MCP-Server, CSV und JSON, «umlagefähig», «Akonto», «Heizprofil».
6. **Heute oder geplant? (4/5)** Unter «Roadmap» steht klar «Diese Punkte sind geplant». Vorher 5: Damals stand auf jedem Kärtchen «Verfügbar» oder «Geplant»; jetzt muss ich selbst schliessen, dass alles oberhalb der Roadmap schon geht.
7. **Zeigen die Bilder die Arbeit? (4/5)** Der Brief mit Zahlteil zeigt mir endlich, was am Ende herauskommt, und die zwei Animationen zeigen die Arbeit dazwischen. Abzug, weil ich im Brief die kleine Schrift nicht lesen kann (P-2). Die Verteilung beim Lift sehe ich jetzt in grossen Kästchen statt in kleinen App-Bildern; das ist viel besser als beim letzten Mal.

### C. Nutzen und Bedenken

8. **Welches Problem?** Die Abrechnung einmal im Jahr und der Einzahlungsschein für jeden Mieter, ohne Excel und ohne Angst, mich zu verrechnen. Nicht gelöst, wie beim letzten Mal: Jemand muss es einrichten und pflegen; einfach im Internet öffnen kann ich es nicht.
9. **Was überzeugt am meisten?** Der Brief an Hans Müller mit «Nachzahlung CHF 215.80» und dem Zahlteil daneben (Einstieg): So sieht das aus, was meine Mieter bekommen. Dazu bei «Rechnungen und KI» das kleine Schild «Bitte prüfen» in der Animation: Dwello sagt mir, wo ich hinschauen soll.
10. **Bedenken?** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?»: Server oder Strom, Porto). Datenschutz: beantwortet (Abschnitt «Datenschutz», «Kein Tracking»). Installation: ehrlich beantwortet («rund eine Stunde», jemand aus der Familie oder IT-Dienst). Rechtssicherheit: beantwortet (FAQ «Ist Dwello rechtlich geprüft?»: «Nein», Hauseigentümerverband, Schlichtungsbehörde). Offen bleibt Hilfe: Wer hilft mir, wenn etwas nicht geht? Nur «Idee oder Fehler melden» auf GitHub. Und die Anleitung ist englisch.
11. **Datenschutz und «gratis» glaubhaft? (4/5)** «Es gibt kein Premium-Abo … keine Funktion, die später kostenpflichtig wird» (Open Source) und «Wir erfahren nicht, dass Sie Dwello nutzen» (Datenschutz) glaube ich. Dass jemand das ganz ohne Geld macht, kann ich mir weiterhin schwer vorstellen. Gleiche Note wie beim letzten Mal.

### D. Weg zum Start

12. **Wie anfangen? (4/5)** So habe ich es verstanden: 1. Demo ansehen. 2. Meinen Neffen bitten, Dwello einzurichten, und ihm die Anleitung geben. 3. Einmal zu Beginn mein Gebäude, die Wohnungen und Mieter erfassen. 4. Das Jahr über die Rechnungen hineinziehen. 5. Im neuen Jahr abrechnen und gleich danach versenden. Der Schlussblock «Die nächste Abrechnung machen Sie mit Dwello» sagt es genau so. Abzug wie beim letzten Mal für die englische Anleitung.
13. **Installation selbst?** Nein, ich würde meinen Neffen fragen. Neu ist: Die Seite macht mir keine Angst mehr, weil die Befehle hinter «Für die Person, die einrichtet: die Befehle» zugeklappt sind. Ich weiss, dass dieser Knopf nicht für mich ist.
14. **Gefunden, was ich suchte? (5/5)** «Menü» oben rechts ist gross, darin Funktionen, Einrichten, Datenschutz, Fragen, Open Source, Impressum und die Sprachen; unten in der Fusszeile Impressum, Datenschutzerklärung und DE FR IT EN. Vorher 4, weil das Menü offen blieb; jetzt schliesst es sich, sobald ich etwas wähle.

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? (4/5)** Bei 150 % und 200 % ist die Schrift gross und dunkel genug, die Knöpfe sind gross, nichts muss seitlich geschoben werden, das Menü geht wieder zu. Abzug für die kleine Schrift im Brief (P-2) und dafür, dass ich bei 200 % die Verteilung nicht sehe, während sie läuft (P-3). Gleiche Note wie beim letzten Mal, aus anderen Gründen.
16. **Länge?** Für mich noch etwas lang, aber besser: Bei 150 % etwa 21 Bildschirme. Gelesen habe ich diesmal bis «Häufige Fragen», weil «Installieren» jetzt kurz ist und «Einfach zu bedienen» mich anspricht. «Open Source» und «Roadmap» am Schluss habe ich nur überflogen; das ist für Computerleute, und es stört nicht, weil es am Ende steht.

### F. Gesamturteil

17. **Ausprobieren? (4/5)** Vorher 3. Der Brief zeigt mir, was am Schluss herauskommt, und die Seite schreckt mich nicht mehr mit schwarzen Befehlen. Die Demo sofort, einrichten lassen, sobald mein Neffe Zeit hat.
18. **Einer Bekannten empfehlen? (3/5)** Gleich wie beim letzten Mal: einer Bekannten mit computerkundigen Kindern ja; einer, die allein ist, eher nicht, weil die Einrichtung eine Hürde bleibt und niemand sagt, wer später hilft.
19. **Das eine, was ich ändern würde:** Den Brief so zeigen, dass ich ihn auf dem ersten Bildschirm sehe und die wichtige Zeile lesen kann, zum Beispiel «Nachzahlung CHF 215.80» gross daneben, oder den Brief beim Anklicken vergrössern (P-1, P-2).

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? (4/5)** Wärmer als beim letzten Mal (3). Warm machen es der Brief an Hans Müller mit dem Einzahlungsschein, die Namen (Hans Müller, Maria Rossi) und der Satz «Dwello ist nicht für Profis gebaut, sondern für Sie». Kühl bleiben die grau-blauen Farben, der dunkelblaue Block «Datenschutz» und dass nirgends ein Mensch zu sehen ist.
21. **Bilder?** Der Brief ist das Bild, das mir gefehlt hat: etwas aus meinem Alltag, nicht aus dem Computer. Ein Foto von einem gewöhnlichen Mehrfamilienhaus würde mir noch gefallen, oder ein Foto von der Person, die Dwello macht. Keine gestellten Bilder mit jungen Leuten im Büro.
22. **Wo würde Animation erklären?** Die zwei, die es jetzt gibt, sind an der richtigen Stelle. «Ablauf abspielen» (Rechnungen und KI): Ich habe verstanden, dass ein Blatt hereinkommt und Dwello nacheinander Rechnungssteller, Betrag, Datum und Kategorie hinschreibt, und dass beim Datum «Bitte prüfen» erscheint; da soll ich nachschauen. Das Bestätigen am Schluss fehlt mir (P-4). «Verteilung abspielen» (Verteilschlüssel und Heizprofile): Ich habe verstanden, dass die CHF 1'690.00 für den Lift auf sechs Wohnungen in gleiche Teile von 281.67 gehen und dass 1.01 die Wohnung von Hans Müller ist. Noch helfen würde eine Animation beim Heizprofil (dass ein Januartag mehr zählt als ein Sommertag) und bei «Tagesgenau bei Mieterwechsel» (jemand zieht im Juni aus).
23. **Wo würde Bewegung stören?** Diesmal hat sich nichts bewegt, ohne dass ich gedrückt habe, und jede Animation lief nur einmal und liess sich anhalten. Genau so möchte ich es. Stören würde es mich im ersten Bildschirm und beim Brief, und wenn eine Animation von selbst wieder anfängt.
24. **Drei Ideen für mehr Wärme:**
    1. Den Brief auf dem ersten Bildschirm neben die Überschrift stellen, mit der lesbaren Zeile «Hans Müller zahlt CHF 215.80 nach» (P-1, P-2).
    2. Ein Satz mit Gesicht: wer Dwello macht und warum (heute nur «© 2026 Roger Rudin» in der Fusszeile und im Impressum).
    3. Eine kurze FAQ «Wer hilft mir, wenn etwas nicht geht?» und die Anleitung auf Deutsch: Hilfe wirkt für mich wärmer als jede Farbe.

## Aufgabe geschafft: ja

Alle 24 Fragen beantwortet, beide Animationen abgespielt, angehalten, weiter und nochmals abgespielt.

## Aufwand

Etwa 20 Minuten, rund 25 Schritte: erster Bildschirm bei 150 %, Durchscrollen in 24 Bildfolgen, Brief angeklickt, «Ablauf abspielen» (abspielen, anhalten, weiter, nochmals), «Verteilung abspielen» (abspielen, anhalten, weiter), Menü → «Fragen», alle sechs Fragen aufgeklappt, «Für die Person, die einrichtet: die Befehle» aufgeklappt, Impressum und Datenschutzerklärung aufgerufen, 200 % mit beiden Animationen.

## Ablauf

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Seite öffnen, 150 %, erster Bildschirm | Worum geht es, mit einem Bild | Überschrift, Satz mit «einen Brief wie diesen», zwei Knöpfe, der Satz zur Einrichtung. Rechts der Überschrift leer, unten nur der weisse Rand des Briefs (`z150-00-first.png`). → P-1 |
| Einmal scrollen | Der Brief | Links Seite 1 der Abrechnung von Hans Müller, rechts der Zahlteil mit QR-Code und Schweizerkreuz, CHF 215.80 (`z150-01.png`). Zahlteil gerade lesbar, die Tabelle im Brief nicht. → P-2 |
| Brief anklicken | Er wird grösser | Nichts geschieht (`b-letter-click.png`). |
| «Ihr Vermieterjahr» | Ablauf übers Jahr | Zeichnung Haus → Blatt → Brief, vier Kärtchen mit «Einmal, zu Beginn», «Januar bis Dezember», «Im neuen Jahr», «Gleich danach» (`z150-02/03.png`). Gut. |
| «Rechnungen und KI», ohne zu drücken | Ein Bild | Kasten mit Wasserversorgung Zürich, CHF 930.00, 31.03.2025 «Bitte prüfen», Kaltwasser; bewegt sich nicht (3 Sekunden gewartet). |
| «Ablauf abspielen» drücken | Ein kurzer Film | Der Kasten wird leer, das Blatt rutscht leicht herein, dann erscheinen nacheinander Wasserversorgung Zürich, CHF 930.00, 31.03.2025, Kaltwasser, zuletzt «Bitte prüfen» (`a1-01` bis `a1-09.png`); nach gut 5 Sekunden fertig, Knopf «Nochmals abspielen». Die Liste 1–2–3 darüber bleibt still, Bestätigen kommt nicht vor. → P-4 |
| «Nochmals abspielen», dann «Anhalten» | Es bleibt stehen | Bleibt stehen, Knopf «Weiter abspielen» (`a1-paused.png`); «Weiter abspielen» spielt zu Ende. |
| «Nebenkostenabrechnung» | Wie die Abrechnung aussieht | App-Bild der Abrechnung NK-11111111-2025-0001 mit Lift CHF 281.67 (`z150-08.png`), gut lesbar. |
| «Verteilschlüssel und Heizprofile», «Verteilung abspielen» | Sehen, wie der Lift verteilt wird | Balken «Lift CHF 1'690.00», darunter erscheinen nacheinander sechs Kästchen 1.01 bis 3.02 mit je 281.67, am Schluss ist 1.01 hervorgehoben (`a2-00` bis `a2-07.png`); nach gut 3 Sekunden fertig. Anhalten funktioniert. |
| «Was in Dwello steckt» | Kurz | Vier Kärtchen, alles neu für mich (`z150-11.png`). |
| «Installieren» | Was mein Helfer tun muss | Wer, wie lange, «Anleitung zum Weitergeben (Englisch)», darunter der Knopf «Für die Person, die einrichtet: die Befehle» (`z150-12.png`). Nichts Schwarzes. |
| Befehle aufklappen | Etwas für den Helfer | Reiter Eigener PC / Homeserver / NAS / Server in der Cloud, schwarze Terminal-Box, darunter «Anmeldung mit Passwort … Google-Konto … wer will» (`b-befehle-open.png`). → P-5 |
| «Datenschutz», «Einfach zu bedienen» | Klar | Datenschutz wie bekannt; «Einfach zu bedienen» jetzt mit Alltagswörtern (`z150-16.png`). |
| Alle Fragen aufklappen | Antworten | Sechs kurze, ehrliche Antworten. |
| Menü → «Fragen» | Menü geht zu, ich lande bei den Fragen | Genau so; Kopfzeile nach dem Rutschen oben (`b-menu-after-link-2500.png`). |
| Impressum, Datenschutzerklärung | Seiten öffnen sich | Beide öffnen sich mit ihrer Überschrift. |
| 200 %, erster Bildschirm | Alles grösser | Überschrift und Knöpfe gross, vom Brief nichts zu sehen (`z200-00-first.png`); der Brief steht erst auf dem zweiten Bildschirm, immer noch klein beschriftet (`z200-01.png`). |
| 200 %, «Verteilung abspielen» | Die Verteilung sehen | Der Knopf steht unten am Rand, die Kästchen darunter ausserhalb des Bildes; nach dem Drücken sehe ich nur, dass der Knopf «Nochmals abspielen» heisst (`z200-verteilung.png`). → P-3 |
| 200 %, «Ablauf abspielen» | Den Ablauf sehen | Knopf und Kasten passen zusammen auf den Bildschirm, alles gut sichtbar (`z200-ablauf.png`). |

## Verwirrung

- «einen Brief wie diesen»: welchen? Auf dem ersten Bildschirm ist keiner (P-1).
- «QR-Rechnung», «Zahlteil», «Swiss QR-Rechnung», «QR-Zahlteil», «Empfangsschein»: Ich glaube, das ist alles der neue Einzahlungsschein. Das Wort «Einzahlungsschein», das ich kenne, steht nirgends.
- «Im neuen Jahr»: Wann genau? Januar oder erst, wenn alle Rechnungen da sind?
- «Ablauf abspielen»: Vor dem Drücken steht das Ergebnis schon da, deshalb dachte ich zuerst, das sei ein Bild, und der Knopf mache einen Film auf.
- «Drag & Drop» in der Überschrift von «Rechnungen und KI»; gleich darunter steht «Ziehen Sie …», das verstehe ich.
- «Gelesen auf Ihrem eigenen Rechner» und weiter unten «Ihr Server», «Ihr NAS», «Hoster»: Ist das dasselbe? Ich habe nur einen Laptop.
- «Open Source», «Quellcode», «AGPL», «Issue», «MCP-Server», «CSV und JSON»: weiterhin für Computerleute; jetzt aber am Schluss.

## Fehlerrisiken

- Bei 200 % drücke ich «Verteilung abspielen», sehe nichts und meine, es gehe nicht (P-3).
- Der Knopf wird nach dem Drücken schmaler («Ablauf abspielen» → «Anhalten»). Wer weit rechts auf den Knopf geklickt hat, steht mit der Maus danach neben dem Knopf und trifft «Anhalten» nicht. Ich habe in die Mitte geklickt, da ging es.
- Ich könnte meinen, Dwello brauche weiterhin ein Google-Konto, weil «Anleitung zum Weitergeben» und der Datenschutz-Abschnitt Google erwähnen und die gute Nachricht zugeklappt ist (P-5).
- Ich könnte meinen, die Abrechnung sei mit «Bitte prüfen» schon fertig, weil der Ablauf beim Prüfen aufhört (P-4).

## Vorschläge

- **P-1:** Seite bei 150 % oder 200 % öffnen, nicht scrollen: Der Satz spricht von einem Brief, der nicht zu sehen ist. Hilfreich: den Brief rechts neben die Überschrift stellen oder so weit hochziehen, dass er auf dem ersten Bildschirm ganz oder zum grossen Teil sichtbar ist; sonst den Satz ändern («… einen Brief wie den unten»).
- **P-2:** Einmal scrollen und versuchen, die Kostenübersicht im Brief zu lesen; den Brief anklicken. Hilfreich: Der Brief vergrössert sich beim Anklicken, oder die wichtigsten Zeilen («Nachzahlung CHF 215.80», «Bitte bezahlen Sie den Betrag bis 28.10.2026») stehen gross als Text daneben.
- **P-3:** Bei 200 % zu «Verteilschlüssel und Heizprofile» scrollen, bis «Verteilung abspielen» am unteren Rand steht, und drücken. Hilfreich: Den Knopf unter den Kästchen statt darüber stellen, oder die Seite beim Drücken so weit schieben, dass Knopf und Kästchen zusammen sichtbar sind.
- **P-4:** Bei «Rechnungen und KI» «Ablauf abspielen» drücken und bis zum Schluss warten. Hilfreich: Am Ende ein «Bestätigt» oder ein Häkchen, und die Zahl 1, 2, 3 in der Liste darüber leuchtet mit, solange der Schritt läuft.
- **P-5:** Bei «Installieren» den Knopf «Für die Person, die einrichtet: die Befehle» aufklappen und bis unter die Terminal-Box lesen. Hilfreich: Den Satz «Sie melden sich mit E-Mail und Passwort an; ein Google-Konto ist nicht nötig» in den offenen Absatz über den Knöpfen setzen.

## Nicht geprüft

- «Demo ansehen» (https://demo.dwello.ch/dashboard), die englische Anleitung und alle GitHub-Links: Seiten ausserhalb der statischen Website unter localhost:3310; die Aufgabe galt der Landing Page.
- Die Sprachversionen fr/it/en: Ich beurteile nur die deutsche Seite.
- Der Knopf «Kopieren» und die Reiter «Homeserver / NAS» und «Server in der Cloud»: nicht angeklickt, das ist Sache meines Helfers.
- Der Dunkelmodus und die Einstellung «Bewegung reduzieren» meines Computers: nicht eingestellt; ich weiss nicht, wie man das macht.
- Den Inhalt von Impressum und Datenschutzerklärung habe ich diesmal nicht gelesen, nur geprüft, dass sie sich öffnen; sie waren nicht Teil der Änderung.
