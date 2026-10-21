# Marco – Landing Page, Runde 2

Persona: Marco, 38, angestellt, fast nur auf dem Handy, wenig Zeit. Gerät: Handy 390 × 844, Touch (persona-kit `open({ viewport: 'mobile' })`), Seite `http://localhost:3310/index.html`, dazu `it/index.html` über den Sprachwechsel im Menü. Nichts gespeichert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-landing-2/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Kopfzeile, Menü (Handy) | Nach dem Tippen auf einen Menüpunkt («Einrichten», «Fragen») springt die Seite zwar zum Abschnitt, aber das Menü bleibt offen und verdeckt die Überschrift und den Anfang des Abschnitts. Tippen ausserhalb schliesst es auch nicht; ich muss noch einmal auf «Menü» tippen. |
| P-2 | Minor | Erster Abschnitt, Bild unter den Knöpfen | Das erste Bild ist die Desktop-Übersicht, auf 356 px verkleinert: Schrift nicht lesbar, ich sehe nur graue Kästchen. Das Handy-Bildschirmfoto der App kommt erst ganz unten bei «Einfach zu bedienen». |
| P-3 | Minor | Ganze Seite | Sehr lang: rund 25'900 px, etwa 31 Bildschirmhöhen. Ab «Alles auf einen Blick» (lange Liste mit 15 Karten) habe ich nur noch gescrollt, nicht mehr gelesen. |
| P-4 | Nit | Fusszeile, Sprachwahl, Installationsblock | Kleine Tippziele: Links in der Fusszeile 19 px hoch, DE/FR/IT/EN unten 38 px, «Kopieren» 36 px. Die Seite wirbt selbst mit «48 px Grosse Schaltflächen». |

## Fragebogen

### A. Erster Eindruck (erster Bildschirm, ca. 8 Sekunden)

1. **Was ist Dwello?** Ein Gratis-Programm, das mir die Nebenkostenabrechnung für meine Mietwohnungen macht: Rechnungen rein, prüfen, mit QR-Rechnung verschicken. (Titel «Ihre Nebenkostenabrechnung, einfacher gemacht.» und der Absatz darunter.)
2. **Für wen? Angesprochen? 5/5.** «für private Vermieterinnen und Vermieter» steht im ersten Satz, und der Titel nennt genau die Arbeit, die ich jedes Jahr vor mir herschiebe. Das trifft mich.
3. **Was als Nächstes anklicken?** «Demo ansehen», weil es der dunkle Hauptknopf ist und ich erst sehen will, ob es auf dem Handy taugt, bevor ich jemanden zum Installieren frage.
4. **Vertrauenswürdig und seriös? 4/5.** Ruhig, sauber, keine Werbung, Schweizer Bezug («Für die Schweiz», QR-Rechnung). Ein Punkt Abzug, weil ich auf dem ersten Bildschirm weder ein Bild der App noch ein Gesicht oder einen Absender sehe; erst ganz unten steht «© 2026 Roger Rudin».

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? 4/5.** Die Vermieter-Teile verstehe ich sofort (Verteilschlüssel, Heizprofil, Mietstage, Lift-Beispiel mit CHF 281.67). Unklar oder nur «Technik für den Helfer»: «Ollama», «OpenAI-kompatible KI», «MCP / Model Context Protocol», «Docker Desktop», «NAS», «AGPL-3.0-or-later», «axe», «WCAG 2.2 AA», «7 : 1». «Open Source» verstehe ich ungefähr, der Abschnitt «Gratis heisst bei Dwello: offen, ohne Haken» erklärt es ordentlich.
6. **Heute vs. geplant? 5/5.** Die Karten in «Alles auf einen Blick» sind klar mit «Verfügbar» oder «Geplant» beschriftet (als Wort, nicht nur Farbe), MCP hat «Geplant · MCP» und das Chat-Beispiel ist als «Entwurf» markiert, die Roadmap hat Issue-Nummern.
7. **Zeigen die Bilder die Arbeit? 3/5.** Die Bilder zum Hochladen, zur Abrechnung, zum PDF mit QR-Zahlteil und zum Gebäuderegister zeigen echte Bildschirme, aber auf dem Handy sind alle Desktop-Bilder so klein, dass ich nichts lesen kann (Bild 10-c: Dialog «Rechnungen hochladen», Text winzig). Wie es auf meinem Handy aussieht, sehe ich nur einmal, ganz unten.

### C. Nutzen und Bedenken

8. **Welches Problem gelöst, welches nicht?** Gelöst: Belege sammeln übers Jahr, Abrechnung tagesgenau beim Mieterwechsel, QR-Rechnung und Mahnungen, Mieter in ihrer Sprache. Nicht gelöst und erwartet: Dass ich es einfach auf dem Handy oder im Browser starte, ohne dass jemand einen Server aufsetzt. Auch Mietzinse (nicht Nebenkosten) und Steuerauswertungen fehlen noch («Berichte und Auswertungen» ist geplant).
9. **Was überzeugt am meisten?** Das konkrete Beispiel: Hans Müller, Wohnung 1.01, zahlt CHF 215.80 nach, und der Lift von CHF 1'690.00 wird auf sechs Wohnungen zu je CHF 281.67 verteilt. Dazu «Die KI liest … Erst wenn Sie bestätigen, wird die Rechnung erstellt.»
10. **Bedenken? Beantwortet?** Kosten: beantwortet (CHF 0.–, FAQ «Kostet Dwello wirklich nichts?» nennt Server, Strom, Porto). Datenschutz: beantwortet (Abschnitt Datenschutz, «Kein Tracking»). Installation: ehrlich beantwortet, aber das ist mein grösstes Bedenken: Ich brauche jemanden, rund eine Stunde, 16 GB Arbeitsspeicher, Docker, ein Google-Konto. Und «Dwello läuft nur, wenn Ihr PC an ist. Für den Zugriff vom Handy eignet sich ein Homeserver.» Das heisst für mich: Handy geht nur mit Zusatzaufwand. Hilfe: Wer hilft bei Problemen? Nur «Idee oder Fehler melden» auf GitHub; das ist nichts für mich. Rechtssicherheit: FAQ «Ist Dwello rechtlich geprüft?» sagt ehrlich, dass es keine Rechtsberatung ersetzt, und nennt HEV und Schlichtungsbehörde. Gut.
11. **Datenschutz und «gratis» glaubhaft? 4/5.** Glaubhaft, weil die Seite auch sagt, was doch nach aussen geht (Google-Anmeldung, Gebäuderegister, E-Mails, externe KI auf Wunsch) und warum es gratis ist (AGPL). Beim Laden der Seite wurde tatsächlich nur `localhost:3310` angefragt, keine fremden Server. Ein Punkt Abzug, weil ich mich mit Google anmelden muss, was zu «nichts geht an uns» etwas quer steht, auch wenn es erklärt ist.

### D. Weg zum Start

12. **Wissen Sie, wie anfangen? 4/5.** So verstanden: 1. Demo auf demo.dwello.ch ansehen (ohne Installation, wird jede Nacht zurückgesetzt). 2. Jemandem, der sich auskennt, die «Anleitung zum Weitergeben» schicken. 3. Diese Person richtet es in rund einer Stunde ein (PC, NAS oder Cloud). 4. Ich melde mich mit Google an, erfasse mein Gebäude über die Adresse und lade Rechnungen hoch. Der Schlussabschnitt «Die nächste Abrechnung machen Sie mit Dwello» fasst das gut zusammen.
13. **Installation selbst?** Nein. Ich sehe `git clone`, `docker compose` und `ollama pull`; das gebe ich meinem Schwager, der in der IT arbeitet. Die Anleitung ist nur auf Englisch («Anleitung zum Weitergeben (Englisch)»); für ihn kein Problem, aber gut, dass es dransteht.
14. **Gefunden, was gesucht? 4/5.** Menü mit Funktionen, Datenschutz, Einrichten, Open Source, Fragen, Impressum und Sprachwahl ist gut; Impressum und Datenschutzerklärung auch in der Fusszeile, beide Seiten laden. Abzug, weil das Menü nach dem Tippen offen bleibt und den Abschnitt verdeckt (P-1).

### E. Bedienung und Darstellung (Handy, Touch)

15. **Lesbar und bedienbar? 4/5.** Text gross genug und kontrastreich, Knöpfe oben gross und gut zu treffen, kein seitliches Scrollen bei 390 px (Seitenbreite 390, nur der Befehlsblock scrollt in sich, was dort richtig ist). Abzug für das offen bleibende Menü (P-1), die unlesbar kleinen Desktop-Bilder (P-2) und die kleinen Fusszeilen-Links (P-4).
16. **Länge?** Zu lang für mich. Gelesen habe ich bis zur Verteilschlüssel-Karte mit dem Lift; die Liste «Alles auf einen Blick» und Datenschutz habe ich überflogen, wieder gelesen erst bei «Installieren» und in den Fragen.

### F. Gesamturteil

17. **Ausprobieren? 4/5.** Die Demo sofort, weil sie nichts kostet und nichts installiert. Ob ich es danach einrichten lasse, hängt davon ab, ob mein Schwager eine Stunde hat und ob ich es dann auch unterwegs auf dem Handy nutzen kann.
18. **Empfehlen? 4/5.** Einem Kollegen mit zwei, drei Wohnungen, der einen IT-Menschen in der Familie hat: ja. Ohne so jemanden eher nicht.
19. **Die eine Sache zuerst ändern:** Das Menü nach dem Tippen auf einen Punkt schliessen (P-1). Gleich danach: auf dem Handy oben ein Handy-Bildschirmfoto der App zeigen statt der winzigen Desktop-Übersicht (P-2).

### Zusatz: Wirkung, Bilder, Animationen

20. **Warm oder kühl? 3/5.** Eher sachlich-kühl: weiss, grau, petrol, viel Text, Zahlen-Kacheln («48 px», «7 : 1»), ein schwarzes Terminal. Wärmer wirken die Beispiele mit Hans Müller und Marco Bernasconi und die kleine Strichzeichnung Haus → Abrechnung → Mieterin bei «Ihr Vermieterjahr».
21. **Fehlen Bilder?** Fotos von Menschen brauche ich nicht. Mir fehlen Handy-Bildschirme der App (Hochladen, Abrechnung) statt verkleinerter Desktop-Bilder, und vielleicht ein echtes Mehrfamilienhaus als Bild zu «Gebäude erfassen». Stockfotos von lachenden Vermietern würden mich eher misstrauisch machen.
22. **Wo würde Animation erklären?** «Rechnungen und KI»: eine kurze Abfolge Rechnung reinziehen → Felder füllen sich → «Bitte prüfen» → bestätigen (die drei Schritte stehen schon als Text da). «Verteilschlüssel»: die sechs Kästchen 1.01 bis 3.02, die sich die CHF 1'690.00 aufteilen. «Ihr Vermieterjahr»: die Pfeile Haus → Blatt → Mieterin nacheinander einblenden.
23. **Wo würde Bewegung stören?** Im ersten Bildschirm, in der langen Funktionsliste und im Installationsblock. Auch nichts, das automatisch läuft und mein Datenvolumen frisst; die Seite lädt jetzt in rund 0.1 s und hat keine laufenden Animationen, das soll so bleiben.
24. **Drei Ideen für mehr Wärme:** 1. Oben ein Handy mit der Dwello-Übersicht zeigen, mit dem Satz «Was als Nächstes zu tun ist» lesbar. 2. Eine kurze Geschichte einer Vermieterin («Frau X, zwei Wohnungen in Luzern, früher Excel, jetzt 30 Minuten im Frühling») statt der Zahlen-Kacheln «48 px» und «7 : 1». 3. Die Strichzeichnungen (wie bei «Ihr Vermieterjahr») auch bei Datenschutz und Installieren verwenden, damit die Technik-Abschnitte freundlicher wirken.

## Beobachtungen

- Sprachwechsel im Menü auf «Italiano» funktioniert: `it/index.html`, Sprache `it-CH`, erster Bildschirm vollständig italienisch («Il Suo conteggio spese accessorie, più semplice.», «Vedere la demo», «Come avere Dwello»), Menü heisst «Menu», kein deutsches Wort gefunden, keine seitliche Scrollbar. Der Hinweis unter den Knöpfen ist auf Italienisch etwas holprig: «Poi lavora con Dwello senza conoscenze tecniche» (wer ist «lavora»? gemeint ist «Lei»).
- Die Sprachwahl im Menü markiert die aktuelle Sprache («Deutsch» hinterlegt), gut.
- «Demo ansehen» zeigt auf `https://demo.dwello.ch/dashboard`; die Seite sagt in der FAQ, dass die Demo jede Nacht zurückgesetzt wird. Ob ich mich dort mit Google anmelden muss, steht nirgends.
- Die Zahl «4 Sprachen» und «50 Wohnungen» oben ist klar; «0 Daten gehen an uns» liest sich zuerst seltsam («0 / Daten gehen an uns»).
- Die Kästchen 1.01 bis 3.02 beim Lift-Beispiel sehen aus wie Knöpfe, sind aber keine; ich habe draufgetippt und es passierte nichts.
- Das Chat-Beispiel bei MCP hat eine Zeile mit `dwello.next_steps() · dwello.deadlin…`, die abgeschnitten ist und seitlich scrollt; für mich Technik ohne Nutzen.
- «Anleitung zum Weitergeben (Englisch)» und «Dwello einrichten lassen» passen zur Botschaft «jemand richtet es für Sie ein», das ist ehrlich und hilft.
- Beim Laden der Seite gingen Anfragen nur an `localhost:3310`. Cookies im Browser waren nur die des Test-Werkzeugs (`dwello_session`, `dwello_xsrf`), keine von der Website.

## Aufgabe geschafft

ja

## Aufwand

Rund 20 Minuten, 6 Durchgänge: erster Bildschirm, ganze Seite gelesen, Menü und «Einrichten», Menü und «Fragen» mit allen sechs Fragen aufgeklappt, Sprachwechsel auf Italienisch, gezielte Bildschirme bei 10 Abschnitten.

## Ablauf

1. Seite öffnen. Erwartet: sofort sehen, was es ist. Gesehen: Titel «Ihre Nebenkostenabrechnung, einfacher gemacht.», Absatz, zwei Knöpfe; kein Bild im ersten Bildschirm (Bild 01). In unter 10 Sekunden klar.
2. Seitliches Scrollen bei 390 px. Erwartet: keins. Gesehen: Seitenbreite 390 = Fensterbreite; nur der Befehlsblock bei «Installieren» ist in sich scrollbar.
3. Nach unten scrollen. Erwartet: Bilder der App. Gesehen: Desktop-Übersicht klein und unlesbar (Bild 10-a), dann Kacheln CHF 0.–/4/50/0, «Vier Schritte. Einmal im Jahr. Ohne Excel.» mit Strichzeichnung (Bild 10-b), danach Abschnitte mit verkleinerten Desktop-Bildern.
4. «Menü» antippen. Erwartet: Liste der Abschnitte. Gesehen: Menü mit sechs Punkten und Sprachwahl Deutsch/Français/Italiano/English (Bild 03). Gut.
5. «Einrichten» antippen. Erwartet: Menü geht zu, ich sehe «Installieren». Gesehen: Seite springt, aber das Menü bleibt offen und verdeckt Überschrift und Text (Bild 04). Gleiches bei «Fragen» (Bild 06); Tippen auf freie Fläche schliesst es nicht.
6. FAQ aufklappen. Erwartet: kurze Antworten. Gesehen: sechs Fragen mit «+», Antworten kurz und verständlich.
7. Menü → «Italiano». Erwartet: italienische Seite. Gesehen: `it/index.html`, alles Italienisch (Bild 05).
8. Installationsabschnitt. Erwartet: Wie lange, was brauche ich. Gesehen: «rund eine Stunde», drei Varianten (Eigener PC, Homeserver / NAS, Server in der Cloud), Terminal-Befehle, «Sie brauchen Docker Desktop, ein Google-Konto und 16 GB Arbeitsspeicher» (Bild 10-h).
9. Vergleichstabelle Dwello vs. typisches Abo. Erwartet: lesbar auf dem Handy. Gesehen: drei Spalten, passt in die Breite (Bild 10-k).
10. Fusszeile. Erwartet: Impressum, Datenschutz. Gesehen: vorhanden, beide Seiten laden; Links eng und klein (Bild 10-n).

## Verwirrung

- «MCP», «Model Context Protocol», `dwello.next_steps()`: Ich weiss nicht, was ich damit soll; dass es «Geplant» ist, ist aber klar.
- «Ollama», «OpenAI-kompatible KI», «Docker», «NAS»: für meinen Helfer, nicht für mich.
- «AGPL-3.0-or-later», «axe», «WCAG 2.2 AA», «7 : 1»: sagt mir nichts, der Satz daneben erklärt es zum Teil.
- «Dwello läuft bei Ihnen» und gleichzeitig «Anmeldung bei Google»: Ich musste zweimal lesen, warum Google dabei ist.
- «Heizprofil», «Mietstage», «Verteilschlüssel»: durch die Beispiele verständlich.

## Fehlerrisiken

- Ich tippe im Menü auf einen Punkt, sehe weiter das Menü und meine, der Link habe nicht funktioniert; ich tippe nochmals oder gebe auf (P-1).
- Ich gehe davon aus, dass ich Dwello wie eine App auf dem Handy nutzen kann, und merke erst nach der Installation, dass der PC laufen muss oder ein Homeserver nötig ist. Die Seite sagt es, aber nur in einer Box bei «Eigener PC».
- Ich tippe auf die Wohnungskästchen beim Lift-Beispiel, weil sie wie Knöpfe aussehen.

## Vorschläge

- **P-1:** Handy 390 × 844 → «Menü» antippen → «Einrichten» antippen. Die Seite springt zu «Installieren», das Menü bleibt offen und deckt Überschrift und ersten Absatz ab; Tippen auf freie Fläche schliesst es nicht. Hilft: Menü beim Tippen auf einen Link und beim Tippen ausserhalb schliessen.
- **P-2:** Handy → Seite öffnen → einmal scrollen: unter den Knöpfen erscheint die Desktop-Übersicht, nicht lesbar. Hilft: auf schmalen Bildschirmen das Handy-Bildschirmfoto (das unten bei «Einfach zu bedienen» schon da ist) an dieser Stelle zeigen; bei den anderen Abschnitten einen lesbaren Ausschnitt statt des ganzen Desktop-Bildes.
- **P-3:** Handy → ganz nach unten scrollen: rund 31 Bildschirmhöhen. Hilft: die Liste «Alles auf einen Blick» auf dem Handy kürzen (z. B. die ersten sechs zeigen, Rest aufklappbar) und die Technik-Kacheln «48 px / 1 / 7 : 1 / 390 px» zusammenfassen.
- **P-4:** Handy → Fusszeile: Links 19 px hoch, Sprachwahl 38 px; Installationsblock «Kopieren» 36 px. Hilft: Tippfläche auf mindestens 48 px vergrössern (Zeilenhöhe oder Polsterung), wie es die Seite selbst verspricht.

## Nicht geprüft

- Die Demo auf `demo.dwello.ch`: aus dieser Umgebung nicht erreichbar bzw. nicht Teil der statischen Seite; ob dort eine Anmeldung nötig ist, weiss ich nicht.
- Die Installationsanleitung auf GitHub und die Issue-Links: externe Seiten, nicht geöffnet.
- Inhalt von Impressum und Datenschutzerklärung: nur geprüft, dass die Seiten laden.
- Dunkelmodus, französische und englische Seite: nicht Teil meines Auftrags; Italienisch nur erster Bildschirm und Breite.
- «Kopieren» im Befehlsblock: nicht angetippt, die Zwischenablage zeigt das Testwerkzeug nicht verlässlich.
