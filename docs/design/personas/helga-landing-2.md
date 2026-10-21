# Helga – Landing Page, Runde 2

Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, braucht grosse Schrift, ist bei Fachwörtern unsicher. Desktop 1440 × 900 bei 150 % Zoom (einmal 200 %), Maus.
Aufgabe: die überarbeitete öffentliche Website (http://localhost:3310/index.html) mit dem Fragebogen `landing-fragebogen.md` beurteilen, Fragen 1–24. Nichts gespeichert.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-landing-2/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Kopfzeile, «Menü» | Das aufgeklappte Menü bleibt offen, nachdem ich einen Eintrag gewählt habe; es bedeckt dann die Mitte des Abschnitts, zu dem ich springen wollte. Escape und ein Klick daneben schliessen es auch nicht; nur ein zweiter Klick auf «Menü». |
| P-2 | Minor | Abschnitt «Einfach zu bedienen» | Die grossen Zahlen «48 px», «7 : 1», «390 px» sagen mir nichts. Gerade der Abschnitt, der mich ansprechen soll, redet in Technik. |
| P-3 | Minor | Ganze Seite, Fachwörter | Viele Wörter ohne Erklärung: Open Source, Ollama, OpenAI-kompatible KI, NAS, Hoster, Docker Desktop, Terminal, AGPL, WCAG, axe, Drag & Drop, GWR, MCP. Die Hauptsätze verstehe ich, die Kleingedruckten nicht. |
| P-4 | Minor | Erster Bildschirm | Rechts neben der Überschrift ist bei 150 % eine leere graue Fläche. Kein Bild, kein Haus, keine App: die Seite wirkt beim Öffnen kühl und leer. |
| P-5 | Minor | «Installieren» | Die Anleitung für meinen Helfer ist nur auf Englisch («Anleitung zum Weitergeben (Englisch)»), und für die Anmeldung braucht es ein Google-Konto. Wer mir hilft, ist vielleicht mein Neffe, aber ich möchte selbst mitlesen können. |
| P-6 | Minor | Zahlenleiste unter dem Einstieg | «50 – Wohnungen: für private Vermieterinnen und Vermieter» lese ich zuerst als «Dwello hat 50 Wohnungen». Gemeint ist wohl «bis 50 Wohnungen». |
| P-7 | Nit | «Roadmap», «Installieren» | Die Nummern «#497», «#495» usw. sind für mich Rätsel. |
| P-8 | Nit | Bildschirmfotos «Verteilschlüssel und Heizprofile» | In den App-Bildern ist die Schrift sehr klein (Formeln wie `{units}`); ich kann sie auch bei 150 % nicht lesen. Die Bildunterschriften darunter helfen. |

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Ein Computerprogramm, das mir die Nebenkostenabrechnung für meine Mieter macht, gratis und für die Schweiz. (Einstieg: Überschrift «Ihre Nebenkostenabrechnung, einfacher gemacht.»)
2. **Für wen? (4/5)** «für private Vermieterinnen und Vermieter» steht gleich im ersten Satz, das bin ich. Ein Punkt Abzug, weil «KI», «Belege auf Ihrem eigenen Rechner» und «Anbieter Ihrer Wahl» schon im ersten Absatz nach Technik klingen.
3. **Was als Nächstes?** «So kommen Sie zu Dwello», weil ich zuerst wissen will, ob ich das überhaupt kann. «Demo ansehen» kommt danach; was eine Demo ist, ahne ich.
4. **Vertrauenswürdig? (4/5)** Ruhig, gross geschrieben, keine blinkende Werbung, «Gratis» ohne Ausrufezeichen. Ein Gesicht oder ein Name, wer dahintersteht, fehlt mir auf dem ersten Bildschirm.

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? (3/5)** Die Überschriften und die «Vier Schritte»-Karten verstehe ich gut («Gebäude erfassen», «Rechnungen hochladen», «Im Frühling: Abrechnungen erstellen»). Unklar: Open Source, KI/Ollama, «OpenAI-kompatible KI», NAS, Hoster, Docker, Terminal, AGPL, WCAG, axe, MCP, GWR, «Drag & Drop», «umlagefähig», «Verteilschlüssel», «Heizprofil» (das letzte wird wenigstens mit Januar und Sommer erklärt).
6. **Heute oder geplant? (5/5)** Das ist jetzt klar: In «Alles auf einen Blick» steht auf jeder Karte «Verfügbar» oder «Geplant», der MCP-Abschnitt heisst «Geplant · MCP» und die «Roadmap» sagt bei jedem Punkt «Geplant».
7. **Zeigen die Bilder die Arbeit? (4/5)** Die Bilder aus der App («Übersicht» mit «Als Nächstes zu tun», die Wohnungen aus dem Gebäuderegister mit grossen Feldern) zeigen mir, wie es aussieht, und dass es aufgeräumt ist. Bei den Verteilschlüsseln ist die Schrift in den Bildern zu klein für mich.

### C. Nutzen und Bedenken

8. **Welches Problem?** Die Abrechnung einmal im Jahr, die ich heute mit Taschenrechner und Angst vor Fehlern mache; und dass die Mieter mit QR-Rechnung zahlen können. Nicht gelöst: Jemand muss es mir einrichten und ab und zu pflegen. Ich hatte ein Programm erwartet, das ich einfach im Internet öffne.
9. **Was überzeugt am meisten?** Das Beispiel «Hans Müller in der Wohnung 1.01 … zahlt für 2025 CHF 215.80 nach» und der Satz «Erst wenn Sie bestätigen, wird die Rechnung erstellt»: Das Programm entscheidet nicht über meinen Kopf hinweg. Auch «Beträge unter CHF 5 werden nicht sofort gefordert» klingt fair.
10. **Bedenken?** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?»: Strom und Porto). Datenschutz: beantwortet (Abschnitt «Datenschutz», «Kein Tracking»). Installation: ehrlich beantwortet («Einrichten muss Dwello jemand, der sich mit Computern auskennt», «rund eine Stunde»). Hilfe: offen, es gibt nur «Fehler melden» auf GitHub und im Impressum eine E-Mail; kein Telefon, niemand, den ich für die Einrichtung bezahlen könnte. Rechtssicherheit: beantwortet (FAQ «Ist Dwello rechtlich geprüft?», Verweis auf Hauseigentümerverband und Schlichtungsbehörde), das gefällt mir.
11. **Datenschutz und «gratis» glaubhaft? (4/5)** Die Vergleichstabelle «Dwello im Vergleich zu typischen Verwaltungs-Abos» und «Es gibt kein Premium-Abo» machen es glaubhaft. Dass etwas ganz gratis ist, ohne dass jemand daran verdient, kann ich mir trotzdem schwer vorstellen.

### D. Weg zum Start

12. **Wie anfangen? (4/5)** So habe ich es verstanden: 1. Demo ansehen. 2. Jemanden bitten, Dwello auf meinem PC einzurichten, und ihm die Anleitung geben. 3. Mein Gebäude mit Adresse erfassen. 4. Rechnungen hochladen, wenn sie kommen. 5. Im Frühling abrechnen. Der Schlussblock «Die nächste Abrechnung machen Sie mit Dwello» sagt das fast genau so.
13. **Installation selbst?** Nein. Die schwarze «Terminal»-Box mit «git clone» und «docker compose» ist für mich wie eine fremde Sprache. Ich würde meinen Neffen fragen. Gut ist, dass die Seite das ausdrücklich so vorsieht. Die Anleitung ist aber auf Englisch (P-5).
14. **Gefunden, was ich suchte? (4/5)** Das «Menü» oben rechts ist gross und deutlich beschriftet, darin Funktionen, Datenschutz, Einrichten, Open Source, Fragen, Impressum und die vier Sprachen. Impressum und Datenschutzerklärung sind in klarem Deutsch. Abzug, weil das Menü offen bleibt (P-1).

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? (4/5)** Bei 150 % und 200 % ist die Schrift gross und dunkel genug, nichts muss seitlich geschoben werden, die Knöpfe sind gross. Abzug für das offene Menü (P-1) und die kleine Schrift in den App-Bildern (P-8).
16. **Länge?** Zu lang für mich. Bei 150 % habe ich rund 14 Bildschirme gescrollt. Gelesen habe ich gern bis «Nebenkostenabrechnung»; bei «Verteilschlüssel und Heizprofile» und «Alles auf einen Blick» (16 Karten) habe ich nur noch überflogen und bin dann zu «Installieren» und «Häufige Fragen» gesprungen.

### F. Gesamturteil

17. **Ausprobieren? (3/5)** Die Demo ja, sofort. Einrichten lassen nur, wenn mein Neffe Zeit hat; allein traue ich mich nicht.
18. **Einer Bekannten empfehlen? (3/5)** Einer Bekannten mit computerkundigen Kindern ja; einer, die allein ist, eher nicht, weil die Einrichtung eine Hürde bleibt.
19. **Das eine, was ich ändern würde:** Das Menü soll sich schliessen, sobald ich etwas darin gewählt habe (P-1). Gleich danach: «Einfach zu bedienen» in Alltagssprache statt in Pixeln (P-2).

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? (3/5)** Eher sachlich-kühl: grau-blaue Farben, viel Weiss und Grau, eine leere rechte Hälfte auf dem ersten Bildschirm. Wärmer machen es die Sätze («Ihr Vermieterjahr», «Im Frühling ist die Abrechnung schnell gemacht») und die kleine Zeichnung Haus → Blatt → Person mit Brief.
21. **Bilder?** Die Bildschirmfotos der App reichen mir, um zu sehen, wie es geht. Was mir fehlt: oben ein Bild, das mein Leben zeigt, ein gewöhnliches Mehrfamilienhaus oder eine ältere Frau am Küchentisch mit einem Ordner Rechnungen. Keine gestellten Bürobilder mit jungen Leuten in Anzügen, das bin nicht ich.
22. **Wo würde Animation erklären?** «Rechnungen und KI»: wie eine Rechnung hineingezogen wird und die Angaben erscheinen (die drei Schritte stehen schon als Liste da). «Verteilschlüssel und Heizprofile»: wie die CHF 1'690.00 für den Lift auf die sechs Wohnungen aufgeteilt werden.
23. **Wo würde Bewegung stören?** Im ersten Bildschirm und überall, wo ich lese: Dinge, die beim Scrollen hereinfliegen, machen mich nervös. Auch kein Video, das von selbst läuft. Eine Animation nur, wenn ich sie selbst starte.
24. **Drei Ideen für mehr Wärme:**
    1. Rechts neben der Überschrift ein ruhiges Bild: ein Schweizer Mehrfamilienhaus oder die Übersicht der App, statt der leeren Fläche.
    2. Ein Satz mit Gesicht, wer Dwello macht und warum (heute nur «Roger Rudin, Schweiz» im Impressum).
    3. Der Abschnitt «Einfach zu bedienen» mit Sätzen statt Zahlen, z. B. «Grosse Knöpfe», «Gut lesbar, auch für ältere Augen», «Funktioniert auf dem Handy».

## Beobachtungen

- Die Kopfzeile ist beim Scrollen immer sichtbar, mit «Menü» und «Demo ansehen». Das gibt Halt.
- In den Bildschirmfotos während des Scrollens lag die Kopfzeile kurz tiefer; nach dem Ende des Scrollens stand sie richtig oben (gemessen: oben bei 0). Kein Befund.
- Die Seite lädt nichts von fremden Servern (nur localhost:3310) und zeigt keine Fehler in der Konsole; das passt zu «Kein Tracking».
- Bei 200 % wird die Überschrift einzeilig, nichts ragt seitlich hinaus (Seitenbreite = Fensterbreite, 720 px).
- Die häufigen Fragen klappen sich mit «+» auf; die erste ist schon offen. Die Antworten sind kurz und verständlich.
- Die gelbe Box «Heute noch mit Google-Anmeldung» ist ehrlich, aber für mich ein Grund zu zögern.

## Aufgabe geschafft: ja

Alle 24 Fragen beantwortet; die Demo und die Anleitung auf GitHub waren aus der Sandbox nicht erreichbar (siehe «Nicht geprüft»).

## Aufwand

Etwa 25 Minuten, rund 30 Schritte: erster Bildschirm, Durchscrollen in 14 Bildschirmen, Menü bei 150 % und 200 %, Sprung zu «Einrichten» und «Fragen», alle sechs Fragen aufgeklappt, Impressum, Datenschutzerklärung, zwei externe Links versucht.

## Ablauf

| Schritt | Erwartet | Gesehen |
|---|---|---|
| Seite öffnen, 150 % | Worum geht es, mit einem Bild | Grosse Überschrift «Ihre Nebenkostenabrechnung, einfacher gemacht.», Absatz, zwei Knöpfe; rechts leer, kein Bild (`01-first-screen.png`). |
| Scrollen zu «So kommen Sie zu Dwello» | Was kostet es, was brauche ich | «Kostenlos und ohne Abo. Einrichten muss Dwello jemand, der sich mit Computern auskennt.» Darunter grosse App-Bilder, Computer und Handy (`scroll-00.png`). Klar und ehrlich. |
| «Ihr Vermieterjahr» | Ablauf | Zeichnung Haus → Blatt → Person mit Brief, vier Karten mit Zeitpunkt (`scroll-01.png`). Am besten verständlich auf der ganzen Seite. |
| «Rechnungen und KI», «Nebenkostenabrechnung» | Wie es geht | Drei nummerierte Schritte, Häkchenliste, Beispiel Hans Müller CHF 215.80 (`scroll-02/03.png`). Gut, aber «Ollama» und «OpenAI-kompatibel» verstehe ich nicht. |
| «Verteilschlüssel und Heizprofile» | Was ein Verteilschlüssel ist | Beispiel Lift CHF 1'690.00 / 6 = CHF 281.67 hilft; die App-Bilder sind zu klein beschriftet (`scroll-04.png`). |
| «Alles auf einen Blick» | Was es heute kann | 16 Karten, jede mit «Verfügbar» oder «Geplant». Klar, aber lang. |
| «Datenschutz» (dunkler Block) | Wo meine Daten sind | «Sie bleiben auf Ihrem Server, nichts geht an uns.» Gut lesbar, hell auf dunkelblau (`scroll-08.png`). |
| «Installieren» | Was mein Helfer tun muss | Schwarze Terminal-Box mit Befehlen, «Sie brauchen: Docker Desktop, ein Google-Konto und 16 GB Arbeitsspeicher», gelbe Google-Box (`07-installieren-terminal.png`, `scroll-10.png`). Für mich unverständlich, für den Helfer wohl richtig. |
| FAQ aufklappen | Antworten | Alle sechs aufgeklappt, alle klar und kurz. |
| Menü öffnen, «Fragen» wählen (200 %) | Menü schliesst sich, ich lande bei den Fragen | Ich lande bei den Fragen, aber das Menü bleibt offen und deckt den Text ab (`14-zoom200-after-menulink.png`). Escape und Klick daneben helfen nicht. → P-1 |
| Menü → Impressum | Wer steckt dahinter | Roger Rudin, Schweiz, info@dwello.ch, Hosting Infomaniak Genf; klare Sprache (`08-impressum.png`). |
| Datenschutzerklärung | Kurz und klar | «Kurz gesagt»: keine Cookies, nichts von fremden Servern, Daten in der Schweiz (`09-datenschutz.png`). Sehr gut. |
| «Demo ansehen», «Anleitung zum Weitergeben» | Demo bzw. Anleitung öffnet sich | Beide aus der Sandbox nicht erreichbar (Netzwerkfehler). |
| 200 % Zoom | Alles noch da | Überschrift einzeilig, Text gross, nichts seitlich abgeschnitten (`11-zoom200-first.png`). |

## Verwirrung

- «Open Source» steht ganz oben im Abzeichen und im Menü, wird aber erst weit unten erklärt («Der ganze Quellcode ist öffentlich»). Was «Quellcode» ist, weiss ich trotzdem nicht.
- «Demo» und «Demodaten»: ich vermute, dass ich da herumklicken darf, ohne etwas kaputtzumachen. Erst die letzte Frage in der FAQ sagt «wird jede Nacht zurückgesetzt».
- «Die KI liest Ihre Belege auf Ihrem eigenen Rechner oder … bei einem Anbieter Ihrer Wahl»: welcher Anbieter? Muss ich einen wählen?
- «NAS», «Homeserver», «Hoster», «Server in der Cloud» (Reiter bei «Installieren»): ich weiss nicht, was davon ich habe.
- «umlagefähig», «Verteilschlüssel», «Heizprofil», «Leistungszeitraum»: Fachwörter, die die Seite zum Teil mit Beispielen erklärt.
- «#497»: sieht aus wie eine Hausnummer.

## Fehlerrisiken

- Mit offenem Menü über dem Text (P-1) könnte ich glauben, die Seite sei hängen geblieben, und sie schliessen.
- Ich könnte «Kopieren» bei der Terminal-Box drücken und nicht wissen, was ich damit soll.
- Ich könnte «50 Wohnungen» falsch lesen (P-6) und meinen, Dwello sei nur für grosse Häuser.
- Wer die englische Anleitung nicht liest, richtet vielleicht falsch ein, und ich merke es nicht.

## Vorschläge

- **P-1:** 150 % oder 200 %, oben rechts «Menü» klicken, «Fragen» wählen: Die Seite springt zu «Häufige Fragen», das Menü bleibt offen und deckt die Mitte ab; Escape oder Klick daneben schliessen es nicht. Hilfreich: Das Menü schliesst sich beim Wählen eines Eintrags, bei Escape und beim Klick daneben.
- **P-2:** Zum Abschnitt «Einfach zu bedienen» scrollen. Hilfreich: statt «48 px», «7 : 1», «390 px» Alltagswörter als Hauptzeile («Grosse Knöpfe», «Gut lesbarer Text», «Auch auf dem Handy»), die Zahlen höchstens klein darunter.
- **P-3:** Seite durchlesen. Hilfreich: im Haupttext Fachwörter weglassen oder einmal mit einem halben Satz erklären (z. B. «Open Source: Der Bauplan des Programms ist öffentlich, jeder darf ihn prüfen»); Technikwörter wie Docker, NAS, Terminal nur im Abschnitt für den Helfer.
- **P-4:** Seite bei 150 % öffnen. Hilfreich: rechts neben der Überschrift ein ruhiges Bild (die Übersicht der App oder ein Haus).
- **P-5:** Bei «Installieren» den Link «Anleitung zum Weitergeben (Englisch)» lesen. Hilfreich: eine deutsche Fassung oder wenigstens eine kurze deutsche Zusammenfassung für mich, was mein Helfer tun wird und was er von mir braucht.
- **P-6:** Zahlenleiste unter dem Einstieg. Hilfreich: «bis 50 Wohnungen».
- **P-7:** «Roadmap»: Hilfreich: statt «#497» z. B. «Mitreden auf GitHub».
- **P-8:** «Verteilschlüssel und Heizprofile»: Hilfreich: Ausschnitt grösser zeigen oder das Bild anklickbar vergrössern.

## Nicht geprüft

- «Demo ansehen» (https://demo.dwello.ch/dashboard): aus der Sandbox nicht erreichbar (Netzwerkfehler), deshalb weiss ich nicht, was mich dort erwartet.
- «Anleitung zum Weitergeben (Englisch)» und alle GitHub-Links: aus der Sandbox nicht erreichbar.
- Die Sprachversionen fr/it/en: nicht geöffnet, ich lese nur Deutsch.
- Der Knopf «Kopieren» und die Reiter «Homeserver / NAS», «Server in der Cloud»: nicht angeklickt, das ist Sache meines Helfers.
- Dunkelmodus: nicht eingestellt.
