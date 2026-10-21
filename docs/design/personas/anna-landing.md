# Anna – Landing Page (Fragebogen)

Persona: Anna, 29, vermietet zum ersten Mal eine Wohnung und hat gerade von Dwello gehört. Frage: Hilft mir Dwello bei meiner ersten Nebenkostenabrechnung, und wie fange ich an?
Seite: `http://localhost:3310/index.html` (statisch), Desktop 1440 × 900 mit Maus; erster Bildschirm und Installationsteil zusätzlich auf dem Handy (390 × 844, Touch). Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-landing/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Installieren (alle drei Varianten) | Nach den vier Befehlen fehlt der Weg weiter: «richten dafür einmal einen OAuth-Schlüssel ein» und «Ihre E-Mail, Schlüssel» in `.env` werden nirgends erklärt und nirgends verlinkt. Ich weiss nicht, was ich in die Datei schreiben muss, und käme ohne Hilfe nicht bis zur Anmeldung. |
| P-2 | Major | Erster Bildschirm | Der hervorgehobene Befehl `docker compose -f docker-compose.prod.yml up -d` mit «Kopieren» ist nur Schritt 3 von 4. Allein eingefügt funktioniert er nicht (vorher fehlen das Herunterladen und die `.env`). Er ist das Erste, was ich kopieren würde. |
| P-3 | Minor | Erster Bildschirm, Kennzahlen darunter | Die Seite spricht zuerst von «Ihr Server», «Open Source», einem Terminal-Befehl, «WCAG 2.2 AA» und «609 automatische Prüf-Szenarien». Als Vermieterin ohne Server fühle ich mich in den ersten 10 Sekunden nicht gemeint. Dass auch ein normaler PC reicht, steht erst ganz unten im Abschnitt Installieren. |
| P-4 | Minor | Installieren, «Sie brauchen» | Es steht nirgends, ob mein Laptop reicht und was ich tun kann, wenn ich keine 16 GB Arbeitsspeicher habe. Den Hinweis auf eine externe KI gibt es nur in der Variante «Homeserver / NAS». |
| P-5 | Minor | Ganze Seite | Es gibt keinen Weg für Leute, die nicht selbst installieren können: kein Hinweis «Lassen Sie sich helfen» und keine Kontaktadresse ausser im Impressum. Die FAQ sagt nur «oder Sie kennen jemanden, der das kann». |
| P-6 | Nit | Handy, Kopfzeile | Auf dem Handy fehlen die Navigation und der Sprachwechsel oben. DE/FR/IT/EN stehen erst ganz unten in der Fusszeile. |

## Fragebogen

### A. Erster Eindruck (erster Bildschirm, 10 Sekunden)

1. **Was ist Dwello?** «Ein Gratis-Programm, das Nebenkostenabrechnungen für private Vermieter macht. Ich muss es aber selbst auf einem Server installieren.» (Titel und Lead im ersten Bildschirm.)
2. **Für wen? Note 3.** Im Lead steht «für private Vermieterinnen und Vermieter»: Das bin ich. Der grosse Titel «Ihre Liegenschaft. Ihre Daten. Ihr Server.» und der schwarze Befehl darunter sagen mir aber: Das ist für Leute, die einen Server haben. Ich habe keinen.
3. **Nächster Klick:** «Demo ansehen». Ich will zuerst sehen, ob ich das verstehe, bevor ich etwas installiere. «Dwello installieren» klingt nach Arbeit, die ich mir noch nicht zutraue.
4. **Vertrauenswürdig? Note 4.** Die Seite ist ruhig, ohne Werbung und ohne bunte Effekte, und darunter ist ein echtes Bild der App zu sehen. Das Abzeichen «Open Source · Gratis» macht mich eher misstrauisch, bis ich weiter unten lese, warum es gratis ist.

### B. Verständlichkeit

5. **Ohne Nachschlagen verständlich? Note 2.** Die Abschnitte über Abrechnung, Mieterwechsel und QR-Rechnung verstehe ich. Unklar waren mir: «Docker», «Terminal», «git clone», «.env», «OAuth-Schlüssel», «Ollama», «OpenAI-kompatible KI», «MCP / Model Context Protocol», «NAS», «SSH», «Tailscale», «Caddy», «HTTPS», «WCAG 2.2 AA», «axe», «AGPL», «Heizprofil», «Verteilschlüssel als Formel» (`0.7 * {area} / {area_total} …`) und «Art. 28 DSG». Bei «umlagefähig» habe ich kurz überlegt, der Satz darunter hat es erklärt.
6. **Heute vorhanden oder geplant? Note 5.** Im Abschnitt «Was in Dwello steckt» steht bei jeder Karte «Verfügbar» oder «Geplant», mit Legende. Dazu gibt es die Roadmap und beim MCP «Geplant · MCP». Das ist klar.
7. **Zeigen die Bilder die Arbeit? Note 4.** Die Bilder kommen aus der echten App (Übersicht, Rechnung hochladen mit «Bitte prüfen», Abrechnung mit Kostenaufstellung). So sehe ich, wie es aussehen wird. Einige Ausschnitte sind knapp abgeschnitten: Beim Rechnungsbild sind die unteren Schaltflächen halb weg, beim Abrechnungsbild ragen «PDF herunterladen» und «Als bezahlt markieren» oben aus dem Rahmen.

### C. Nutzen und Bedenken

8. **Welches Problem löst es?** Die Abrechnung selbst: Rechnungen sammeln, richtig auf die Wohnung verteilen, ein PDF mit QR-Einzahlungsschein machen. Gut finde ich auch, dass Dwello merkt, wenn eine Rechnung vom letzten Jahr fehlt. **Was fehlt:** eine Anleitung, wie meine *erste* Abrechnung abläuft, vor allem was ich im Mietvertrag nachsehen muss. Und eine Antwort darauf, ob ich das mitten im Jahr anfangen kann, wenn mir die Rechnungen vom Januar fehlen.
9. **Was überzeugt am meisten?** «Vier Schritte. Einmal im Jahr. Ohne Excel.» und «Die Übersicht sagt Ihnen, was als Nächstes zu tun ist, und jedes Feld erklärt seinen Begriff». Genau das brauche ich, weil ich nach ein paar Monaten alles wieder vergessen habe. Auch «Erst wenn Sie bestätigen, wird die Rechnung erstellt» beruhigt mich.
10. **Bedenken:** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?», Abschnitt Open Source). Datenschutz: beantwortet (Abschnitt Datenschutz). Rechtssicherheit: beantwortet, ehrlich (FAQ: «Eine Rechtsberatung ersetzt das nicht», Hinweis auf Hauseigentümerverband und Schlichtungsbehörde). **Installation: nicht beantwortet.** Wie es nach den Befehlen weitergeht (OAuth, `.env`), steht nirgends. **Hilfe:** Es gibt nur «Idee oder Fehler melden» auf GitHub. Dort würde ich als Laie keine Frage stellen. Auch ob meine Daten bei einem Defekt am PC verloren sind (Sicherung), sagt die Seite nicht.
11. **Glaubwürdig (Datenschutz, gratis)? Note 4.** Die Erklärung mit der offenen Lizenz und der Vergleich mit den Abos sind nachvollziehbar, und die Datenschutzerklärung der Website sagt «keine Cookies». Eine kleine Restunsicherheit bleibt: Warum macht jemand das gratis? Im Impressum steht eine Einzelperson.

### D. Weg zum Start

12. **Weiss ich, wie ich anfange? Note 2.** So habe ich es verstanden: Docker Desktop installieren, ein Terminal öffnen, vier Befehle kopieren, rund 15 Minuten warten, dann `http://localhost:3000` im Browser öffnen. Unterwegs muss ich irgendwo eine E-Mail und einen Google-«OAuth-Schlüssel» eintragen. Wo und wie, weiss ich nicht. Danach: Gebäude erfassen, Rechnungen hochladen, im Frühling abrechnen (Abschluss «Die nächste Abrechnung machen Sie mit Dwello»).
13. **Traue ich mir die Installation zu?** Nein, nicht allein. Die Befehle könnte ich kopieren, aber beim OAuth-Schlüssel und bei der `.env` würde ich steckenbleiben. Ich würde meinen Bruder oder einen IT-Bekannten fragen. Die FAQ «Brauche ich technische Kenntnisse?» sagt mir das ehrlich, das schätze ich.
14. **Gefunden, was ich suchte? Note 4.** Auf dem Desktop sind Navigation und DE/FR/IT/EN oben, Impressum und Datenschutzerklärung unten. Beides öffnet sich und ist verständlich geschrieben. Auf dem Handy fehlen oben die Navigation und der Sprachwechsel (P-6). Eine Anleitung nach der Installation habe ich nicht gefunden (P-1).

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? Note 4.** Die Schrift ist gross genug (Fliesstext 18 px), der Kontrast gut, auf dem Handy gibt es kein seitliches Scrollen. «Kopieren» kopiert den Befehl wirklich und zeigt «Kopiert». Auf dem Handy werden die Befehle im schwarzen Kasten rechts abgeschnitten, man kann im Kasten wischen. Die Links in der Fusszeile sind klein und stehen eng beieinander (rund 19 px hoch).
16. **Länge?** Zu lang für mich: Die Seite ist auf dem Desktop etwa 16 Bildschirme lang. Bei «Verteilschlüssel und Heizprofile» mit der Formel habe ich aufgehört, richtig zu lesen, und bin über «Installieren» in der Kopfzeile direkt zur Installation gesprungen. Danach habe ich die FAQ gelesen, MCP und Roadmap habe ich übersprungen.

### F. Gesamturteil

17. **Würde ich es ausprobieren? Note 3.** Die Demo sofort, ja. Selbst installieren erst, wenn mir jemand hilft oder eine Schritt-für-Schritt-Anleitung bis zur ersten Anmeldung da ist.
18. **Einer Bekannten empfehlen? Note 3.** Einer Bekannten mit IT-Kenntnissen ja. Einer wie mir würde ich sagen: «Schau dir die Demo an, aber für die Installation brauchst du Hilfe.»
19. **Was zuerst ändern:** Eine verlinkte Anleitung «Von der Installation bis zur ersten Anmeldung» (inklusive Google-OAuth und `.env`) direkt im Abschnitt Installieren. Im ersten Bildschirm sollte nicht ein einzelner Befehl stehen, der allein nicht funktioniert, sondern ein Satz wie «Läuft auch auf Ihrem PC – in rund 15 Minuten».

## Beobachtungen

- Ohne Zugriff auf die Zwischenablage zeigt der Kopierknopf «Markiert» statt «Kopiert». Mit Berechtigung zeigt er «Kopiert». Das ist so gewollt und für mich verständlich.
- Die Website lädt nur von ihrem eigenen Server (bei meinem Besuch nur `localhost:3310`). Das passt zu «lädt nichts von fremden Servern».
- Die Fusszeilen-Links «Nebenkosten abrechnen», «Verteilschlüssel» und «QR-Rechnung» unter «Wissen» führen alle nur zu `#funktionen`. Ich hatte dort Erklärseiten erwartet.
- Die FAQ «Kostet Dwello wirklich nichts?» ist beim Laden schon offen, die anderen Fragen sind zu. Das ist gut, weil diese Frage die wichtigste ist.
- Unter dem MCP-Beispiel steht «Entwurf». Zusammen mit «Geplant · MCP» ist klar, dass es das noch nicht gibt.

## Aufgabe geschafft: teilweise

Ob Dwello mir bei der ersten Nebenkostenabrechnung hilft, beantwortet die Seite: ja. Wie ich anfange, nur bis zum letzten Installationsbefehl. Den Schritt «OAuth-Schlüssel einrichten / `.env` ausfüllen» konnte ich nicht nachvollziehen, die Seite erklärt ihn nicht und verlinkt keine Anleitung (P-1).

## Aufwand

Rund 15 Minuten, etwa 12 Schritte: erster Bildschirm, Scrollen durch die ganze Seite, drei Reiter unter Installieren, Kopieren, sechs FAQ-Fragen, Impressum, Datenschutzerklärung, Versuch mit «Demo ansehen», auf dem Handy erster Bildschirm und Installieren über die Kopfzeile.

## Ablauf

1. **Erster Bildschirm, Desktop** (`01-desktop-first.png`). Erwartet: «Was ist das, ist es für mich?». Gesehen: grosser Titel «Ihre Liegenschaft. Ihre Daten. Ihr Server.», ein Lead über die Nebenkostenabrechnung, zwei Knöpfe («Dwello installieren», «Demo ansehen»), ein schwarzer Befehlskasten mit «Kopieren» und darunter «Kostenlos, ohne Abo …». Unten schaut die Übersicht der App hervor. Den Zweck habe ich verstanden, das Wort «Server» hat mich verunsichert.
2. **Scrollen: Kennzahlen.** Erwartet: was es mir bringt. Gesehen: «CHF 0.–», «4 Sprachen», «0 Verstösse gegen WCAG 2.2 AA», «609 automatische Prüf-Szenarien». Die letzten beiden sagen mir nichts.
3. **«Vier Schritte. Einmal im Jahr.»** Erwartet: den Ablauf. Gesehen: genau das, mit Einmalig / Laufend / Einmal im Jahr / Fertig. Der beste Abschnitt für mich.
4. **Bilder und Funktionen** (`03-desktop-funktionen.png`). Erwartet: Bilder der App. Gesehen: Rechnung hochladen mit Hinweis «Bitte prüfen», Abrechnung mit Kostenaufstellung, Art. 257a OR, Heizprofil, QR-Rechnung, Gebäuderegister. Bei der Formel für den Verteilschlüssel habe ich abgeschaltet. Die Bildausschnitte sind teils knapp abgeschnitten.
5. **«Was in Dwello steckt».** Erwartet: was es heute gibt. Gesehen: Karten mit «Verfügbar» und «Geplant». Klar.
6. **Datenschutz und MCP** (`04-desktop-datenschutz.png`). Den Datenschutz habe ich gelesen und verstanden. MCP habe ich übersprungen, das Wort kenne ich nicht.
7. **Installieren, Reiter «Eigener PC»** (`05-desktop-installieren.png`). Erwartet: eine Anleitung für Laien. Gesehen: vier Terminal-Befehle, rechts «Sie brauchen: Docker Desktop und 16 GB», «Rund 15 Minuten», darunter der gelbe Hinweis «Heute noch mit Google-Anmeldung … OAuth-Schlüssel». Weder zu Docker Desktop noch zum OAuth-Schlüssel gibt es einen Link oder eine Erklärung, nur `#497` führt zu GitHub.
8. **Reiter «Homeserver / NAS» und «Server in der Cloud»** (`05-desktop-install-*.png`). Erwartet: Unterschiede. Gesehen: ähnliche Befehle, Begriffe wie SSH, Tailscale, Caddy. Nur hier steht, dass man ohne starke Hardware eine externe KI einträgt.
9. **Kopieren im ersten Bildschirm.** Erwartet: «Kopiert». Gesehen: «Kopiert», in der Zwischenablage nur `docker compose -f docker-compose.prod.yml up -d`, also nur einer der vier Schritte (P-2).
10. **FAQ** (`06-desktop-faq-open.png`). Alle sechs Fragen geöffnet. Die Antworten sind ehrlich und kurz. «Brauche ich technische Kenntnisse?» bestätigt: Für die Installation ja.
11. **Impressum und Datenschutzerklärung** (`07-impressum.html.png`, `07-datenschutz.html.png`). Beide Seiten sind vorhanden, in einfacher Sprache, mit Rechtshinweis «ersetzt keine Rechtsberatung».
12. **«Demo ansehen»** (`https://demo.dwello.ch/dashboard`). Erwartet: die Demo. Gesehen: In meiner Umgebung ist die Seite nicht erreichbar (Verbindung abgelehnt), siehe «Nicht geprüft».
13. **Handy, erster Bildschirm** (`10-mobile-first.png`). Kopfzeile nur mit Logo und «Installieren», der Titel in drei Zeilen, die Knöpfe untereinander, der Befehl abgeschnitten mit «Kopieren». Kein seitliches Scrollen (Breite 390 px).
14. **Handy, «Installieren» in der Kopfzeile angetippt** (`11-mobile-install.png`, `12-mobile-install2.png`). Springt richtig zum Abschnitt. Die Reiter stehen untereinander, die Befehle sind im schwarzen Kasten abgeschnitten (darin wischbar). Die Karten «Sie brauchen …» und der Google-Hinweis sind gut lesbar.

## Verwirrung

- «Ihr Server»: Ich habe keinen. Dass «Eigener PC» reicht, steht erst unter Installieren.
- «Docker», «Terminal», «git clone», «.env», «SSH», «NAS», «Tailscale», «Caddy», «HTTPS»: Technik ohne Erklärung.
- «OAuth-Schlüssel einrichten»: das grösste Rätsel. Wo, bei wem, wie lange?
- «Ollama», «OpenAI-kompatible KI», «qwen3-vl:8b-instruct»: Welche KI das ist, ist mir egal, aber ich weiss nicht, ob ich etwas wählen muss.
- «MCP», «Model Context Protocol», «dwello.next_steps()».
- «WCAG 2.2 AA», «axe», «609 Prüf-Szenarien»: klingt gründlich, sagt mir aber nichts.
- «Heizprofil», «Verteilschlüssel als Formel»: Fachlich vermutlich wichtig, aber die Formel schreckt ab.
- «AGPL-3.0», «Open Source»: Die Erklärung im Abschnitt «Gratis heisst bei Dwello» hilft.

## Fehlerrisiken

- Ich kopiere den Befehl aus dem ersten Bildschirm, füge ihn ein und bekomme eine Fehlermeldung, weil die Datei fehlt. Dann denke ich, Dwello funktioniert nicht (P-2).
- Ich installiere alles, öffne `localhost:3000` und komme wegen der fehlenden OAuth-Einrichtung nicht hinein. Dann gebe ich auf (P-1).
- Ich habe einen Laptop mit 8 GB und lade 6 GB KI-Modell herunter, das dann nicht läuft (P-4).
- Ich glaube «100 % Ihrer Daten bleiben auf Ihrem Server», mache aber keine Sicherung. Wenn der PC kaputtgeht, ist alles weg. Die Seite erwähnt Sicherungen nicht.

## Vorschläge

- **P-1:** Reproduktion: Installieren → Reiter «Eigener PC» → gelber Hinweis «Heute noch mit Google-Anmeldung» lesen → einen Link zur Anleitung suchen. Es gibt nur `#497` (GitHub-Issue). Was helfen würde: ein Link «Schritt-für-Schritt-Anleitung» unter den Befehlen. Er sollte erklären, was in die `.env` gehört (welche E-Mail, welche Schlüssel) und wie man den Google-OAuth-Schlüssel anlegt, mit Bildern, bis zur ersten Anmeldung.
- **P-2:** Reproduktion: erster Bildschirm → «Kopieren» → in der Zwischenablage steht nur `docker compose -f docker-compose.prod.yml up -d`. Was helfen würde: den Befehlskasten im ersten Bildschirm weglassen oder durch «In rund 15 Minuten auf Ihrem PC, Anleitung ansehen» ersetzen. Oder dort alle Schritte zeigen, aber nicht einen einzelnen Befehl, der allein nicht läuft.
- **P-3:** Reproduktion: Seite öffnen, 10 Sekunden auf den ersten Bildschirm schauen. Was helfen würde: im Titel oder im Abzeichen auch die Vermieterin ansprechen, etwa «Ihre Nebenkostenabrechnung, einfach gemacht», und «Ihr Server» als Satz erklären («auf Ihrem eigenen PC»). Die Kennzahlen zu WCAG und Prüf-Szenarien weiter nach unten schieben oder in Alltagssprache sagen («geprüft für Handy und grosse Schrift»).
- **P-4:** Reproduktion: Installieren → «Eigener PC» → «Sie brauchen: … 16 GB». Was helfen würde: ein Satz «Weniger Arbeitsspeicher? Dann nutzen Sie eine externe KI, so geht's», wie bei «Homeserver / NAS», und wie ich herausfinde, wie viel Speicher mein PC hat.
- **P-5:** Reproduktion: Seite nach «Hilfe» oder «Kontakt» durchsuchen. Es gibt nur GitHub-Links und die E-Mail im Impressum. Was helfen würde: eine FAQ «Ich kann nicht selbst installieren, was nun?» mit einem konkreten Weg (Kontakt-E-Mail, Hinweis auf eine Person mit IT-Kenntnissen, Checkliste zum Weitergeben).
- **P-6:** Reproduktion: Handy 390 px, Seite öffnen. Oben gibt es nur Logo und «Installieren». Was helfen würde: den Sprachwechsel (DE/FR/IT/EN) oder ein Menü auch auf dem Handy in der Kopfzeile.

## Nicht geprüft

- **Demo (`https://demo.dwello.ch/dashboard`):** Aus meiner Umgebung nicht erreichbar (`ERR_TUNNEL_CONNECTION_FAILED`). Ob die Demo hält, was die Seite verspricht, habe ich nicht gesehen.
- **GitHub-Links** (Quellcode, Issues #495–#498, Lizenz): nicht geöffnet. Als Anna würde ich sie höchstens bei #497 anklicken.
- **Sprachversionen FR/IT/EN und Markenhandbuch:** nicht Teil meiner Aufgabe.
- **Installation selbst:** nicht ausgeführt, die Aufgabe beurteilt nur die Seite.
- **Dunkelmodus:** Die Seite lief im hellen Modus, den dunklen habe ich nicht angesehen.
