# Persona-Review: Marco, Landing Page (Website)

Persona: Marco, 38, berufstätig, fast nur auf dem Handy, wenig Zeit. Gerät: Mobile 390 × 844, Touch (Tippen).
Seite: http://localhost:3310/index.html (statisch), geöffnet mit `persona-kit.mjs`, `open({ viewport: 'mobile' })`.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-landing/`.
Nichts gespeichert.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Kopfzeile, Handy | Auf 390 px gibt es kein Menü und keinen Sprachwechsel oben: Nur Logo und «Installieren». Die Links Funktionen, Datenschutz, Open Source, Fragen und DE/FR/IT/EN sind ausgeblendet (0 × 0 px). FAQ und Sprache erreiche ich nur über den Fuss, nach rund 24 400 px (etwa 29 Bildschirme). |
| P-2 | Major | Hero und «Installieren» | Der einzige Weg zum Start ist eine Installation mit Terminal, git, Docker, 16 GB Arbeitsspeicher und einem Google-OAuth-Schlüssel. Auf dem Handy kann ich nichts davon. Dass ich ohne Technik nur die Demo habe (oder jemanden brauche), steht erst in der FAQ ganz unten. |
| P-3 | Minor | Hero, Startbefehl | «Kopieren» im Hero kopiert nur `docker compose -f docker-compose.prod.yml up -d`. Ohne `git clone` und `.env` läuft der Befehl nicht. Er sieht aber aus wie «der eine Befehl». |
| P-4 | Minor | Installieren, «Eigener PC» | «Zeitaufwand: rund 15 Minuten», aber den Google-OAuth-Schlüssel, den ich «einmal einrichten» muss, nennen die vier Schritte gar nicht. Er steht erst im gelben Kasten darunter, ohne Anleitung. |
| P-5 | Minor | ganze Seite | Die Seite ist sehr lang (rund 29 Handy-Bildschirme). Zahlen und Funktionen kommen zwei- bis dreimal (Kennzahlen, Funktionskacheln, «Einfach zu bedienen», Roadmap). Ich habe bei «Was in Dwello steckt» aufgehört zu lesen. |
| P-6 | Minor | «So sieht Dwello aus» | Die Bilder aus der App sind Desktop-Screenshots, auf 356 px verkleinert (Original 2000 px breit). Auf dem Handy kann ich darin nichts lesen, und beim Antippen wird nichts grösser. |
| P-7 | Minor | Hero, Installieren, Fuss | Kleine Tippziele: «Kopieren» ist 36 px hoch, die Links im Fuss 19 px hoch mit rund 31 px Abstand. Die Seite verspricht selbst «48 px grosse Schaltflächen». |
| P-8 | Minor | ganze Seite | Viele Fachwörter ohne Erklärung: Docker, Terminal, OAuth-Schlüssel, Ollama, MCP, WCAG 2.2 AA, axe, AGPL, NAS, SSH, Tailscale, Caddy, GWR, SIX-Standard. |
| P-9 | Nit | Fuss, «Wissen» | «Nebenkosten abrechnen», «Verteilschlüssel» und «QR-Rechnung» springen alle zu derselben Stelle (#funktionen). Ich habe je eine eigene Erklärung erwartet. |
| P-10 | Nit | Installieren, Terminal-Kasten | Die Befehle werden am rechten Rand abgeschnitten (`git clone https://github.com/rudini/Dw…`). Lesen kann ich sie nur, wenn ich im Kasten seitlich wische. Die Seite selbst scrollt nicht seitlich. |

## Fragebogen

### A. Erster Eindruck (erster Bildschirm, 10 Sekunden)

1. **Was ist Dwello?** Ein Gratis-Programm, das mir die Nebenkostenabrechnung für meine Mietwohnungen macht: Rechnungen hinein, Abrechnung mit QR-Rechnung hinaus. Es läuft irgendwie «bei mir auf dem Server». (Hero)
2. **Für wen? Fühle ich mich angesprochen?** Note 4. «Für private Vermieterinnen und Vermieter» und «bis 50 Wohnungen» passen genau auf mich. Abzug: «Ihr Server.» in Blau und der Docker-Befehl darunter sagen mir eher, dass es für Leute mit Technik ist. (Hero)
3. **Was als Nächstes anklicken?** «Demo ansehen». «Installieren» kann ich auf dem Handy sowieso nicht, und ich will zuerst sehen, ob es mir Zeit spart. (Hero-Knöpfe)
4. **Vertrauenswürdig und seriös?** Note 4. Ruhig, sauber, keine Werbung, Schweizer Bezug. Abzug: Wer dahinter steht, sehe ich erst im Impressum ganz unten (eine Privatperson). (Hero, Fuss)

### B. Verständlichkeit

5. **Texte ohne Nachschlagen verständlich?** Note 3. Die Sätze zu Abrechnung, Verteilschlüssel und QR-Rechnung verstehe ich. Unklar: «Docker», «Terminal», «OAuth-Schlüssel», «Ollama», «MCP» / «Model Context Protocol», «WCAG 2.2 AA», «axe», «AGPL», «NAS», «SSH», «Tailscale», «Caddy», «GWR». «Open Source» kenne ich ungefähr. (Kennzahlen, Installieren, Funktionskacheln, Open Source)
6. **Was gibt es heute, was ist geplant?** Note 4. Die Schilder «Verfügbar» und «Geplant» sind klar, und die Roadmap trennt es noch einmal. Der grosse MCP-Abschnitt mitten auf der Seite wirkt aber wie eine fertige Funktion, bis ich das kleine «Geplant · MCP» bemerke. (Was in Dwello steckt, MCP, Roadmap)
7. **Zeigen die Bilder die Arbeit?** Note 2. Auf dem Handy sind die App-Screenshots winzig, ich lese keine Zeile darin, und vergrössern kann ich sie nicht. Am meisten sagen mir das Handy-Bild der Übersicht und der QR-Zahlteil. (So sieht Dwello aus, Einfach zu bedienen)

### C. Nutzen und Bedenken

8. **Welches Problem löst es?** Die jährliche Nebenkostenabrechnung ohne Excel: Rechnungen sammeln, richtig verteilen, tagesgenau bei Mieterwechsel, PDF mit QR-Zahlteil an die Mieter. **Nicht gelöst:** dass ich es einfach auf dem Handy öffne und loslege. Ich muss es zuerst irgendwo installieren. Erwartet hätte ich eine App oder ein Konto zum Anmelden. (Vier Schritte, Installieren)
9. **Was überzeugt am meisten?** Gratis ohne Abo, «Hinweis auf fehlende Rechnungen» und dass die Mieter mit dem Handy per QR zahlen und ich sehe, wer offen ist. (Rechnungen und KI, Swiss QR-Rechnung)
10. **Bedenken, beantwortet?** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?»). Installation: beantwortet, aber die Antwort lautet «Terminal oder jemand, der das kann». Für mich heisst das: vorerst nicht. Hilfe: nur «Idee oder Fehler melden» auf GitHub, keine Anlaufstelle für Laien. Rechtssicherheit: FAQ sagt ehrlich «ersetzt keine Rechtsberatung». Offen bleibt: Wer hilft mir, wenn mein PC kaputtgeht, und wo sind dann meine Daten? Ein Backup erwähnt die Seite nicht. (FAQ, Installieren, Open Source)
11. **Datenschutz und «gratis» glaubwürdig?** Note 4. Kein Abo, AGPL und «bei Ihnen gespeichert» passen zusammen. Die Seite lädt auch nichts von fremden Servern. Abzug: «Heute noch mit Google-Anmeldung» passt nicht ganz zu «nichts geht an uns» und «ohne Konto», auch wenn es kein Konto bei Dwello ist. (Datenschutz, gelber Kasten bei Installieren)

### D. Weg zum Start

12. **Weiss ich, wie ich anfange?** Note 2. So habe ich es verstanden: am PC Docker Desktop installieren, ein Terminal öffnen, vier Befehle hineinkopieren, eine Datei mit «meiner E-Mail und Schlüsseln» ausfüllen, irgendwo bei Google einen OAuth-Schlüssel einrichten, 6 GB herunterladen, dann im Browser http://localhost:3000 öffnen. Wie der Google-Teil geht und was in die `.env` gehört, steht nirgends. (Installieren)
13. **Traue ich mir die Installation zu?** Nein, nicht nebenbei auf dem Handy. Am PC vielleicht an einem Wochenende, eher mit meinem Schwager, der IT macht. «Dwello läuft nur, wenn Ihr PC an ist» heisst zudem: auf dem Handy nutze ich es nur mit Homeserver, und das ist noch eine Stufe schwieriger (SSH, VPN, Tailscale). (Installieren, Tabs)
14. **Gefunden, was ich suchte?** Note 2. Oben gibt es kein Menü. FAQ, Sprachwechsel, Impressum und Datenschutzerklärung habe ich erst im Fuss nach langem Wischen gefunden. Dort funktionieren sie: FR wechselt die Seite, Impressum und Datenschutzerklärung öffnen und passen aufs Handy. (Kopfzeile, Fuss)

### E. Bedienung und Darstellung (Handy, Touch)

15. **Lesbar und bedienbar?** Note 4. Schrift gross genug, guter Kontrast, kein seitliches Scrollen der Seite (scrollWidth 390). Tabs und FAQ-Fragen lassen sich gut antippen (FAQ-Zeilen 64 bis 83 px hoch), und «Kopieren» meldet «Kopiert». Abzug: kleine Fuss-Links und «Kopieren» (36 px), abgeschnittene Befehle im Terminal-Kasten, unlesbare Screenshots. (ganze Seite)
16. **Länge?** Zu lang für mich. Der erste Bildschirm sagt das Wichtigste in 10 Sekunden, das ist gut. Ab den Kennzahlen («609 automatische Prüf-Szenarien», «0 Verstösse gegen WCAG») wird es Technik für Entwickler. Aufgehört habe ich bei «Was in Dwello steckt». Danach bin ich nur noch mit dem Knopf «Installieren» und über den Fuss zur FAQ gesprungen.

### F. Gesamturteil

17. **Würde ich es ausprobieren?** Note 3. Die Demo ja, sofort. Selbst installieren erst, wenn es den Installer in einem Schritt ohne Google gibt (#497) oder mir jemand hilft.
18. **Einer Bekannten empfehlen?** Note 2. Einer Bekannten in meiner Lage nur, wenn sie jemanden mit Technik kennt. Sonst bleibt sie bei der Installation stecken.
19. **Die eine Sache zuerst ändern:** Auf dem Handy oben ehrlich sagen, was ich brauche: «Ausprobieren ohne Installation: Demo» als Hauptweg für Leute wie mich, und «Installieren braucht einen PC und etwas Technik» direkt daneben, statt eines Docker-Befehls im ersten Bildschirm.

## Beobachtungen

- Die Seite lädt in rund 0,4 s, alle Anfragen gehen nur an localhost:3310 (keine fremden Server, keine Schriften von aussen). Das passt zu «Kein Tracking».
- Der Knopf «Installieren» in der Kopfzeile bleibt beim Scrollen oben stehen und springt beim Antippen zuverlässig zum Abschnitt «Installieren».
- Die Tabs «Eigener PC», «Homeserver / NAS» und «Server in der Cloud» lassen sich antippen, und der Inhalt wechselt. «Kopieren» im Tab kopiert alle Befehle ohne die Kommentarzeilen.
- Die FAQ-Fragen klappen beim Antippen auf, die erste ist schon offen.
- Die Unterseite Datenschutzerklärung hat oben einen Sprachwechsel (DE/FR/IT/EN), die Startseite auf dem Handy nicht.
- Ein Kennzahlen-Block beginnt mit «0 Verstösse gegen WCAG 2.2 AA» und «609 automatische Prüf-Szenarien». Das sagt Marco nichts.
- Im Abschnitt «In der Sprache der Mieter» heisst das Beispiel «Marco Bernasconi». Ich habe kurz gestutzt, ob ich gemeint bin.

## Aufgabe geschafft: ja

Erster Bildschirm, ganze Seite, Installieren mit allen drei Tabs, FAQ, Sprachwechsel, Impressum und Datenschutzerklärung angeschaut. Den Fragebogen habe ich ausgefüllt.

## Aufwand

Rund 15 Minuten. Etwa 35 Schritte: 29 Bildschirme gewischt, 1 × «Installieren» oben, 3 Tabs, 2 × «Kopieren», 5 FAQ-Fragen, FR, Impressum, Datenschutzerklärung.

## Ablauf

1. **Seite öffnen.** Erwartet: in Sekunden klar, was es ist. Gesehen: Titel «Ihre Liegenschaft. Ihre Daten. Ihr Server.», ein Satz zur Nebenkostenabrechnung, Knöpfe «Dwello installieren» und «Demo ansehen», darunter ein Terminal-Kasten mit `$ docker compose -f docker-…` (abgeschnitten) und «Kopieren», darunter «Kostenlos, ohne Abo …». Den Zweck verstehe ich sofort, der Docker-Kasten schreckt mich ab.
2. **Menü suchen.** Erwartet: ein Menü-Symbol oben rechts. Gesehen: nur Logo und «Installieren», kein Menü, keine Sprache.
3. **Nach unten wischen.** Erwartet: Bilder der App, wie es geht. Gesehen: kleine Desktop-Screenshot der Übersicht, dann Kennzahlen (CHF 0.–, 4 Sprachen, 0 WCAG-Verstösse, 609 Szenarien, 100 %), dann «Vier Schritte. Einmal im Jahr. Ohne Excel.» als vier Karten. Die vier Schritte sind für mich der beste Teil.
4. **Weiter wischen** durch «So sieht Dwello aus»: Rechnungen und KI, Abrechnung, Verteilschlüssel mit Formel `0.7 * {area} / …`, Heizprofil, QR-Rechnung, Gebäude. Erwartet: Bilder, die ich lesen kann. Gesehen: Screenshots, die zu klein zum Lesen sind. Die Formel ist mir zu technisch.
5. **«Was in Dwello steckt».** Ich sah 13 Karten «Verfügbar» und 2 «Geplant». Hier habe ich aufgehört, Wort für Wort zu lesen.
6. **Datenschutz** (dunkelblauer Abschnitt mit Haus-Grafik) und **MCP** (Chat-Beispiel). Erwartet: kurz und klar. Gesehen: Datenschutz verständlich. Den MCP-Teil habe ich nicht verstanden und erst spät als «Geplant» erkannt.
7. **«Installieren» oben antippen.** Erwartet: Sprung zur Anleitung. Gesehen: Sprung zu «Läuft dort, wo Sie es wollen.» mit Tabs und einem schwarzen Terminal-Kasten, dessen Zeilen rechts abgeschnitten sind.
8. **Tabs antippen.** «Homeserver / NAS» zeigte SSH, VPN und Tailscale, «Server in der Cloud» Linux-Server, eigene Domain und Caddy. Erwartet: eine Variante für Laien. Gesehen: drei Varianten, alle mit Terminal.
9. **«Kopieren» im Tab.** Gesehen: Der Knopf zeigt «Kopiert», und alle Befehle sind in der Zwischenablage. Funktioniert. Danach habe ich «Kopieren» im Hero getestet: Dort ist nur der `docker compose`-Befehl in der Zwischenablage.
10. **Gelber Kasten «Heute noch mit Google-Anmeldung».** Erwartet: eine Anleitung. Gesehen: nur der Hinweis, dass ich einmal einen OAuth-Schlüssel einrichte, und ein Link auf GitHub-Issue #497.
11. **FAQ** (über den Fuss «Häufige Fragen» bzw. #faq). Alle sechs Fragen aufgetippt. Die Antworten sind kurz und ehrlich. «Brauche ich technische Kenntnisse?» bestätigt: Terminal oder Hilfe nötig. «Kann ich Dwello ausprobieren?» nennt die Demo. Das hätte ich ganz oben gebraucht.
12. **Fuss: FR, Impressum, Datenschutzerklärung.** FR zeigt «Votre immeuble. Vos données. Votre serveur.». Impressum (Roger Rudin, info@dwello.ch, Hosting Infomaniak) und Datenschutzerklärung («keine Cookies») öffnen und passen aufs Handy.

## Verwirrung

- «Ihr Server.»: Ich habe keinen Server. Ist mein Laptop gemeint?
- «Docker», «Terminal», «.env», «OAuth-Schlüssel», «Ollama», «qwen3-vl:8b-instruct»: alles unbekannt.
- «MCP», «Model Context Protocol», `dwello.next_steps()`: unklar, wofür ich das brauche.
- «0 Verstösse gegen WCAG 2.2 AA», «609 automatische Prüf-Szenarien», «axe»: Das ist für Entwickler, nicht für mich.
- «AGPL-3.0», «proprietär»: nur ungefähr verstanden.
- «GWR», «SIX-Standard», «Heizprofil»: Den GWR erklärt die Seite («eidgenössisches Gebäude- und Wohnungsregister»), SIX nicht.
- «Ohne Konto bei uns» neben «mit Ihrem Google-Konto anmelden»: Das wirkt zuerst widersprüchlich.

## Fehlerrisiken

- Wer im Hero «Kopieren» antippt und den Befehl im Terminal einfügt, bekommt einen Fehler, weil `git clone` und `.env` fehlen (P-3).
- Wer «15 Minuten» glaubt, steckt danach beim Google-OAuth-Schlüssel ohne Anleitung fest (P-4).
- Wer auf dem Handy die Sprache wechseln will, findet keinen Sprachwechsel oben und gibt vielleicht auf (P-1).
- Die abgeschnittenen Befehle im Terminal-Kasten verleiten zum Abtippen statt Kopieren, mit Tippfehlern (P-10).

## Vorschläge

- **P-1:** Auf 390 px die Seite öffnen und oben nach Menü oder Sprache suchen: Es gibt nur Logo und «Installieren». Hilfreich wäre ein Menüknopf mit Funktionen, Datenschutz, Installieren, Fragen und dem Sprachwechsel, oder wenigstens der Sprachwechsel und «Fragen» in der Kopfzeile.
- **P-2:** Auf dem Handy den ersten Bildschirm lesen. Der Hauptknopf ist «Dwello installieren», daneben steht ein Docker-Befehl. Hilfreich: Auf dem Handy die Demo als ersten Weg zeigen («Ohne Installation ausprobieren») und einen Satz wie «Zum Installieren brauchen Sie einen PC und etwas Erfahrung mit dem Terminal» neben den Knopf. Den Docker-Kasten in den Abschnitt «Installieren» verschieben.
- **P-3:** Hero, «Kopieren» antippen und die Zwischenablage ansehen: nur `docker compose -f docker-compose.prod.yml up -d`. Hilfreich: entweder alle Schritte kopieren oder den Kasten mit «Schritt 3 von 4, Anleitung unten» beschriften bzw. weglassen (siehe P-2).
- **P-4:** Abschnitt «Installieren», Tab «Eigener PC»: Die Schritte 1 bis 4 und «rund 15 Minuten» stehen dort, der OAuth-Schlüssel erst im gelben Kasten darunter. Hilfreich: den Google-Schritt als eigenen Schritt mit Link zu einer Anleitung aufführen und die Zeitangabe danach richten.
- **P-5:** Die Seite ganz durchwischen: rund 29 Bildschirme. Hilfreich: die Kennzahlen-Zeilen zu WCAG und Prüf-Szenarien auf dem Handy weglassen oder nach unten verschieben, die Funktionskacheln einklappen («Alle 15 Funktionen zeigen») und die doppelte Roadmap («Geplant» in den Kacheln und im Roadmap-Abschnitt) zusammenlegen.
- **P-6:** Bei «So sieht Dwello aus» ein Bild antippen: Es passiert nichts, und der Text darin ist unlesbar. Hilfreich: Handy-Screenshots der App verwenden (wie beim Bild im Abschnitt «Einfach zu bedienen») oder einen Ausschnitt in Lesegrösse, oder beim Antippen vergrössern.
- **P-7:** Hero-«Kopieren» (36 px hoch) und die Fuss-Links (19 px hoch, rund 31 px Abstand) antippen. Hilfreich: Tippziele von mindestens 48 px Höhe, wie die Seite es für die App verspricht.
- **P-8:** Die Seite ohne Vorwissen lesen. Hilfreich: Fachwörter beim ersten Auftreten in einem Halbsatz erklären («Docker, ein Programm, das Dwello startet») oder in den Installationsteil verschieben. WCAG, axe und MCP oben weglassen.
- **P-9:** Im Fuss unter «Wissen» die drei Links antippen: Alle landen bei #funktionen. Hilfreich: auf die passenden Abschnitte springen (Nebenkostenabrechnung, Verteilschlüssel, Swiss QR-Rechnung) oder die Rubrik weglassen, bis es eigene Seiten gibt.
- **P-10:** Abschnitt «Installieren», Terminal-Kasten auf 390 px: Zeilen wie `git clone https://github.com/rudini/Dw…` sind abgeschnitten. Hilfreich: lange Befehle auf dem Handy umbrechen oder einen Hinweis «seitlich wischen» zeigen.

## Nicht geprüft

- **Demo (demo.dwello.ch):** In dieser Umgebung nicht erreichbar (DNS-Fehler). Ob sie auf dem Handy taugt, konnte ich nicht beurteilen. Das ist kein Befund zur Seite.
- **Links zu GitHub (Quellcode, Issues):** externe Seiten, nicht geöffnet.
- **Die Installation selbst:** nicht ausgeführt. Das ist nicht Marcos Aufgabe und auf dem Handy nicht möglich.
- **Die Sprachversionen IT und EN** und die FR-Seite über den ersten Bildschirm hinaus: nicht durchgelesen.
- **Dunkelmodus der Website:** nicht geprüft, das Handy war hell eingestellt.
