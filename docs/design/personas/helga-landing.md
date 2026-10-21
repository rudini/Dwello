# Helga – Landing Page (öffentliche Website)

Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, braucht grosse Schrift, unsicher bei Fachbegriffen. Desktop 1440 × 900 mit 150 % Zoom (einmal 200 %), Maus. Seite: `http://localhost:3310/index.html` (statisch), dazu `impressum.html` und `datenschutz.html`. Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-landing/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Erster Bildschirm (Hero) | Die Seite verspricht «für Menschen ohne Vorkenntnisse», aber der Weg zum Start ist ein Terminal-Befehl (`docker compose …`), schon im ersten Bildschirm. Dass ich dafür jemanden brauche, der das kann, steht nur zugeklappt im FAQ. |
| P-2 | Major | Installieren | Die Installation verlangt Git, Docker, eine `.env`-Datei, 16 GB Arbeitsspeicher und einen «OAuth-Schlüssel» bei Google. Niemand erklärt mir, was das ist oder wer mir dabei hilft. Für mich ist hier Schluss. |
| P-3 | Major | Kennzahlen-Leiste, «Was in Dwello steckt», «Einfach zu bedienen» | Viele Wörter aus der Technik, die ich nicht verstehe: WCAG 2.2 AA, Prüf-Szenarien, axe, Mobile first, Drag & Drop, Ollama, OpenAI-kompatibel, NAS, SSH, MCP, CSV/JSON, AGPL, Issue, «#497», 48 px, 7 : 1. Ausgerechnet der Abschnitt «Klare Wörter statt Fachjargon» ist voll mit Pixel- und Kontrastzahlen. |
| P-4 | Minor | Kopfzeile bei 150 % und 200 % Zoom | Mit meiner Vergrösserung zeigt die Kopfzeile nur «Dwello» und «Installieren». Das Menü (Funktionen, Datenschutz, Fragen) und die Sprachwahl sind weg, und es gibt auch keinen Menü-Knopf. Impressum und Datenschutz finde ich erst ganz unten, nach etwa 33 Bildschirmen. |
| P-5 | Minor | Ganze Seite | Die Seite ist sehr lang (bei 150 % etwa 33 Bildschirme). Die Antwort auf meine wichtigste Frage («Kann ich das überhaupt?») steht im FAQ fast am Schluss. |
| P-6 | Minor | Fusszeile, Spalte «Wissen» | «Nebenkosten abrechnen», «Verteilschlüssel» und «QR-Rechnung» klingen nach Erklärungen. Alle drei springen aber nur zu «Funktionen» zurück. |
| P-7 | Nit | «Rechnungen und KI», Bild des Hochladens | Im Bild der App steht «Choose Files / No file chosen» auf Englisch, mitten in der deutschen Seite. |
| P-8 | Nit | Kleine Texte | Badges, Zeitangaben auf den Karten («Einmalig», «Laufend») und die Sprachwahl sind 14 px gross, die Kennzahlen-Texte 15 px. Bei 150 % geht es noch, angenehm ist es nicht. |

## Fragebogen

### A. Erster Eindruck (erster Bildschirm, 10 Sekunden)

1. **Was ist Dwello?** Ein Computerprogramm, das mir die Nebenkostenabrechnung für meine Wohnung macht, gratis. (Hero: «Dwello macht die Nebenkostenabrechnung für private Vermieterinnen und Vermieter.»)
2. **Für wen? Angesprochen? – 3/5.** «Private Vermieterinnen und Vermieter»: Das bin ich, das spricht mich an. Aber gleich daneben stehen «Ihr Server», «Open Source» und eine schwarze Zeile mit `docker compose -f …`. Ich habe keinen Server, und da dachte ich: Das ist wohl für Computerleute.
3. **Was als Nächstes anklicken?** «Demo ansehen». Ich will zuerst schauen, bevor ich etwas installiere. «Installieren» traue ich mich nicht, und der Befehl darunter macht mir eher Angst.
4. **Vertrauenswürdig? – 4/5.** Ruhig, sauber, grosse Schrift, keine blinkende Werbung, «Für die Schweiz». Das wirkt seriös. Abzug, weil ich auf den ersten Blick nicht sehe, wer dahintersteht. Den Namen und das Impressum finde ich erst ganz unten.

### B. Verständlichkeit

5. **Texte verständlich? – 2/5.** Die Sätze sind kurz und freundlich, das schätze ich. Unklar waren mir: Open Source, Server, KI (geht noch), Docker, Terminal, Drag & Drop, WCAG 2.2 AA, Prüf-Szenarien, axe, Mobile first, Ollama, OpenAI-kompatibel, NAS, SSH, Tailscale, VPN, OAuth-Schlüssel, `.env`, MCP / Model Context Protocol, CSV und JSON, AGPL-3.0, Issue und «#497», «Markenhandbuch». Von den Mietbegriffen verstehe ich die meisten: Nebenkosten, Verteilschlüssel einigermassen, «Heizprofil» und «Mietstage» erst nach zweimal Lesen. «Umlagefähig» ist gut erklärt.
6. **Was gibt es schon, was ist geplant? – 4/5.** Bei «Was in Dwello steckt» stehen grüne «Verfügbar»- und gestrichelte «Geplant»-Schilder, darüber eine Legende. Das ist klar. Den MCP-Abschnitt mit dem Chat-Fenster habe ich zuerst für etwas Fertiges gehalten. Das kleine Schild «Geplant · MCP» habe ich übersehen.
7. **Zeigen die Bilder die Arbeit? – 4/5.** Die Bilder der Übersicht, der Abrechnung, des Gebäuderegisters und der QR-Rechnung zeigen gut, wie es aussieht. Die Wohnungsfelder «Wohnungsnummer, Stockwerk, Fläche» sind beruhigend einfach. Die PDF- und QR-Bilder sind bei mir so klein, dass ich nichts lesen kann. Beim Hochladen steht im Bild englisch «Choose Files».

### C. Nutzen und Bedenken

8. **Welches Problem löst es?** Die jährliche Nebenkostenabrechnung: Ich müsste nicht mehr rechnen und könnte den Einzahlungsschein mit QR-Code gleich mitschicken. Dass es mich warnt, wenn eine Rechnung fehlt, gefällt mir. Erwartet hätte ich ein Wort dazu, ob es eine einfache Mietzins-Übersicht gibt (wer hat bezahlt?). Die «Mahnungen» decken das teilweise ab. Und ich hätte einen Weg ohne Installation erwartet, etwa ein Konto im Internet.
9. **Was überzeugt am meisten?** «Dwello rechnet so, wie es das Mietrecht verlangt», «Nur was der Vertrag erlaubt (Art. 257a OR)» und «Auf 5 Rappen gerundet, zugunsten der Mieter». Das klingt korrekt und fair. Dazu, dass es nichts kostet und es kein Abo gibt.
10. **Bedenken?** Erstens: Kann ich das installieren? Das FAQ sagt ehrlich «oder Sie kennen jemanden, der das kann», aber das steht zugeklappt ganz unten. Zweitens: Wer hilft mir, wenn etwas nicht geht? Es gibt nur «Fehler melden» auf GitHub, das kenne ich nicht, und im Impressum eine E-Mail-Adresse. Drittens die Rechtssicherheit: Das FAQ «Ist Dwello rechtlich geprüft?» beantwortet sie ehrlich (ersetzt keine Rechtsberatung, Hauseigentümerverband). Das finde ich gut. Viertens: Ich brauche ein Google-Konto. Das steht erst im gelben Kasten bei der Installation.
11. **Datenschutz und «gratis» glaubhaft? – 4/5.** «Gratis» glaube ich: Es ist mehrfach erklärt, ohne Abo, und der Vergleich mit den Abos ist verständlich. Den Datenschutz glaube ich auch, die Datenschutzerklärung der Website ist klar («keine Cookies», Hoster in Genf). Einen Punkt Abzug gibt es, weil ich «Ihr Server» nicht einschätzen kann. Wenn mein Neffe das bei sich einrichtet, liegen die Daten dann bei ihm?

### D. Weg zum Start

12. **Wissen Sie, wie Sie anfangen? – 2/5.** Verstanden habe ich: Ich wähle «Eigener PC», öffne ein «Terminal», tippe vier Befehle ab (herunterladen, Einstellungen, starten, KI laden), warte etwa 15 Minuten und brauche Docker Desktop und 16 GB Speicher. Dann melde ich mich mit Google an, nachdem ich einen «OAuth-Schlüssel» eingerichtet habe. Was ein Terminal ist, wo ich es finde, was in die Einstellungen gehört und wie das mit Google geht, steht nicht da.
13. **Installation zutrauen?** Nein. Ich bräuchte meinen Neffen oder den Computerladen im Dorf. Die Seite sagt nicht, wen ich fragen kann, und es gibt keine Anleitung zum Ausdrucken, die ich jemandem mitgeben könnte.
14. **Gefunden, was gesucht? – 3/5.** Der Knopf «Dwello installieren» springt richtig zum Abschnitt Installieren. Impressum und Datenschutzerklärung habe ich gefunden, aber erst nach langem Scrollen ganz unten. Das Menü oben fehlt bei meiner Vergrösserung, ebenso die Sprachwahl (die ist unten). Die Links unter «Wissen» führen nicht zu Erklärungen.

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? – 4/5.** Die grossen Überschriften und der Fliesstext lassen sich bei 150 % und 200 % gut lesen. Die Knöpfe sind gross, nichts rutscht seitlich weg (bei 200 % passt die Seite in die Breite). Die Kästchen-Texte unter den Häkchen und die kleinen Schilder sind eher klein, und die Bilder der App sind bei mir zum Lesen zu klein.
16. **Länge?** Zu lang. Bis «Gebäude erfassen in zwei Minuten» habe ich gelesen, bei «Was in Dwello steckt» mit den vielen Karten nur noch überflogen. Den MCP-Teil und den Vergleich habe ich übersprungen. Wieder genau gelesen habe ich das FAQ, weil ich Antworten gesucht habe.

### F. Gesamturteil

17. **Ausprobieren? – 2/5.** Die Demo würde ich anschauen. Installieren würde ich es nur, wenn mir jemand hilft. Die Seite macht mir Lust darauf, lässt mich aber beim Anfangen allein.
18. **Einer Bekannten empfehlen? – 2/5.** Einer Bekannten in meiner Lage nur mit dem Satz «aber dein Sohn muss es dir einrichten».
19. **Das Eine, das ich zuerst ändern würde:** Gleich oben ehrlich sagen, was man zum Anfangen braucht, nämlich jemanden, der es auf dem Computer einrichtet. Und die schwarze Befehlszeile aus dem ersten Bildschirm nehmen.

## Beobachtungen

- Der erste Bildschirm hat zwei klare Knöpfe, «Dwello installieren» und «Demo ansehen». Darunter folgt eine Befehlszeile mit «Kopieren». Danach steht «Kostenlos, ohne Abo und ohne Konto bei uns. Für Liegenschaften bis 50 Wohnungen.» Das ist ein guter, beruhigender Satz, steht aber erst unter dem Befehl.
- Die Kennzahlen-Leiste (CHF 0.–, 4 Sprachen, 0 Verstösse gegen WCAG, 609 Prüf-Szenarien, 100 %) sagt mir nur bei «CHF 0.–» und «100 % Ihrer Daten» etwas.
- «Vier Schritte. Einmal im Jahr. Ohne Excel.» Die vier Karten (Gebäude erfassen, Rechnungen hochladen, Abrechnungen erstellen, Prüfen und versenden) sind der verständlichste Teil der Seite.
- Das FAQ ist gut und ehrlich formuliert. Die erste Frage ist aufgeklappt, die übrigen öffnen sich mit «+».
- Impressum: Betreiber Roger Rudin, E-Mail info@dwello.ch, Hoster Infomaniak in Genf. Der Hinweis «Es ersetzt keine Rechtsberatung. Prüfen Sie Ihre Abrechnungen, bevor Sie sie versenden.» ist klar.
- Die Datenschutzerklärung beginnt mit «Kurz gesagt» in vier Punkten. Das hat mir sehr geholfen, das ist gut gemacht.
- Bei den Installationsarten «Homeserver / NAS» und «Server in der Cloud» stehen noch mehr Fachwörter (SSH, Synology, Unraid, Tailscale, Caddy, Domain).
- Im Chat-Bild des MCP-Abschnitts stehen Programmzeilen (`dwello.next_steps()`). Das ist für mich nur Zeichensalat.

## Aufgabe geschafft: ja

Den Fragebogen konnte ich ganz ausfüllen. Die Aufgabe, mit Dwello anzufangen, hätte ich als Helga selbst nicht geschafft (siehe P-1, P-2).

## Aufwand

Etwa 25 Minuten, 8 Skript-Schritte: erster Bildschirm, ganze Seite in 36 Bildschirmen durchscrollen, FAQ aufklappen, Installationsarten umschalten, «Dwello installieren» anklicken, Impressum, Datenschutzerklärung, Ansicht bei 200 %.

## Ablauf

1. **Erster Bildschirm (150 %).** Erwartet: Was ist es, für wen, wie fange ich an. Gesehen: Grosse Überschrift «Ihre Liegenschaft. Ihre Daten. Ihr Server.», ein Satz zur Nebenkostenabrechnung, zwei Knöpfe und eine schwarze Befehlszeile `docker compose -f docker-compose.prod.yml up -d` mit «Kopieren». Kein Menü oben. Was es ist, war nach 10 Sekunden klar. «Ihr Server» und die Befehlszeile haben mich verunsichert.
2. **Scrollen: Kennzahlen.** Erwartet: Preis, Aufwand. Gesehen: CHF 0.–, dazu WCAG und Prüf-Szenarien. Nur der Preis hat mir etwas gesagt.
3. **«Ihr Vermieterjahr».** Erwartet: Wie läuft das ab? Gesehen: vier verständliche Schritte. Das war gut.
4. **«So sieht Dwello aus» mit den Bildern.** Erwartet: Bilder der App. Gesehen: echte Bilder mit erfundenen Daten. Hilfreich, aber die PDF- und QR-Bilder sind zu klein zum Lesen, und im Upload-Bild steht «Choose Files».
5. **«Was in Dwello steckt».** Erwartet: eine Liste. Gesehen: 16 Karten mit «Verfügbar» und «Geplant». Die Unterscheidung ist klar, aber es waren zu viele Karten, ab hier habe ich nur noch überflogen.
6. **Datenschutz und MCP.** Erwartet: Wo liegen meine Daten? Gesehen: Datenschutz klar. Den MCP-Teil habe ich nicht verstanden, «Geplant» habe ich erst beim zweiten Hinsehen bemerkt.
7. **Klick auf «Dwello installieren».** Erwartet: eine Anleitung Schritt für Schritt oder ein Download-Knopf. Gesehen: Die Seite springt zu «Läuft dort, wo Sie es wollen.» mit drei Reitern und einem schwarzen Terminal mit vier Befehlen, dazu der gelbe Hinweis «Heute noch mit Google-Anmeldung … OAuth-Schlüssel». Für mich ist das nicht zu schaffen.
8. **FAQ.** Erwartet: Antworten auf «Schaffe ich das?». Gesehen: «Brauche ich technische Kenntnisse?» mit der ehrlichen Antwort «… oder Sie kennen jemanden, der das kann.» Gut, aber zu spät auf der Seite.
9. **Impressum und Datenschutzerklärung** (Fusszeile). Erwartet: Wer steht dahinter? Gesehen: beide klar und kurz. Gefunden habe ich sie erst ganz unten.
10. **200 % Zoom.** Erwartet: Alles grösser, nichts abgeschnitten. Gesehen: Die Seite passt in die Breite, Text und Knöpfe sind gut lesbar. Das Menü oben fehlt weiterhin, die Seite ist dafür noch länger (etwa 47 Bildschirme).

## Verwirrung

- «Ihr Server»: Habe ich einen? Muss ich einen kaufen?
- «Open Source», «AGPL-3.0», «Quellcode»: Klingt nach Programmierern. Dass es «gratis und offen» heisst, steht erst weit unten.
- «Docker», «Terminal», «git clone», «.env», «SSH», «NAS», «OAuth-Schlüssel»: unbekannt, nirgends erklärt.
- «WCAG 2.2 AA», «axe», «Prüf-Szenarien», «Mobile first», «48 px», «7 : 1»: Ich weiss nicht, was mir das bringt.
- «KI», «Ollama», «OpenAI-kompatible KI», «MCP»: «KI liest Belege» verstehe ich, die Namen dahinter nicht.
- «Issue», «#497»: Was bedeutet die Nummer?
- «Heizprofil», «Mietstage», «Verteilschlüssel als Formel» mit `{area}`: halb verstanden.
- «Markenhandbuch» in der Fusszeile: Wozu brauche ich das?

## Fehlerrisiken

- Ich kopiere den Befehl aus dem ersten Bildschirm, ohne die Schritte davor (herunterladen, Einstellungen) zu kennen, und er funktioniert nicht. Dann denke ich, ich hätte etwas kaputt gemacht.
- Ich erwarte nach «Dwello installieren» einen Download und gebe auf, wenn ich nur Befehle sehe.
- Ich halte das Chat-Fenster im MCP-Teil für eine fertige Funktion.
- Ich übersehe, dass ich ein Google-Konto brauche, bis ich mitten in der Einrichtung bin.

## Vorschläge

- **P-1:** Seite öffnen, 150 %: Die Befehlszeile steht im ersten Bildschirm. Was hülfe: Die Befehlszeile aus dem Hero nehmen und dort einen Satz wie «Zum Einrichten brauchen Sie einmal jemanden, der sich mit Computern auskennt; danach bedienen Sie Dwello selbst.» Die FAQ-Antwort «Brauche ich technische Kenntnisse?» näher nach oben holen oder im Hero verlinken.
- **P-2:** Auf «Dwello installieren» klicken: Es kommen Terminal-Befehle und der Google-OAuth-Hinweis. Was hülfe: Über den Reitern ein Kasten «Für Ihre Helferin oder Ihren Helfer», mit einer Anleitung zum Ausdrucken oder Weitergeben (Link), und ein Satz, was die Vermieterin selbst danach tut. Die Voraussetzungen (Google-Konto, 16 GB Speicher) in Alltagssprache vor die Befehle setzen.
- **P-3:** Kennzahlen-Leiste, «Was in Dwello steckt» und «Einfach zu bedienen» lesen. Was hülfe: Den Nutzen statt der Norm nennen («Geprüft für Menschen mit Sehschwäche und Bildschirmleser» statt «0 Verstösse gegen WCAG 2.2 AA»; «Grosse Knöpfe» statt «48 px»), die Technik-Kennzahlen (609 Prüf-Szenarien) nach unten oder in den Open-Source-Teil schieben und Fachwörter wie NAS, SSH, Ollama und MCP beim ersten Vorkommen in einem Halbsatz erklären.
- **P-4:** Mit 150 % oder 200 % Zoom öffnen: Oben stehen nur Logo und «Installieren». Was hülfe: Ein Menü-Knopf mit den Abschnitten, darunter Impressum und Datenschutz, und die Sprachwahl auch oben, solange die Breite nicht reicht.
- **P-5:** Die ganze Seite durchscrollen: etwa 33 Bildschirme bei 150 %. Was hülfe: «Was in Dwello steckt» kürzen oder zuklappen, den MCP-Abschnitt (nur geplant) kürzer machen und das FAQ weiter nach oben stellen.
- **P-6:** In der Fusszeile bei «Wissen» auf «Verteilschlüssel» klicken: Die Seite springt zu «Funktionen». Was hülfe: Zum passenden Abschnitt verlinken (Verteilschlüssel und Heizprofile, QR-Rechnung) oder die Spalte nicht «Wissen» nennen.
- **P-7:** Abschnitt «Rechnungen und KI», Bild «Rechnungen hochladen»: Dort steht «Choose Files / No file chosen». Was hülfe: Den Screenshot in einem deutsch eingestellten Browser neu aufnehmen.
- **P-8:** Schilder und Kennzahlen-Texte (14 bis 15 px) bei 150 % lesen. Was hülfe: Diese Texte mindestens so gross wie den Fliesstext setzen.

## Nicht geprüft

- **«Demo ansehen»** (`https://demo.dwello.ch/dashboard`): Die Adresse war aus dieser Umgebung nicht erreichbar (Verbindung abgelehnt), die Demo selbst habe ich also nicht gesehen.
- **Rückmeldung von «Kopieren»:** Der Knopf blieb nach dem Klick auf «Kopieren», eine Meldung habe ich nicht gesehen. Im automatischen Browser ist die Zwischenablage womöglich gesperrt, deshalb ist das kein Befund.
- **Externe Links:** GitHub, Issues und die Lizenz habe ich nicht geöffnet (ausserhalb der Website).
- **Sprachversionen FR/IT/EN, Dunkelmodus, Handy:** nicht Helgas Gerät und nicht ihre Sprache.
- **Markenhandbuch** (`brand.html`): nicht geöffnet, für Helga nicht relevant.
