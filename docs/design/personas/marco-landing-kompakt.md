# Persona-Review: Marco, Landing Page gekürzt (Website)

Persona: Marco, 38, berufstätig, fast nur auf dem Handy, wenig Zeit. Gerät: Mobile 390 × 844, Touch (Tippen).
Seite: http://localhost:3310/index.html (statisch), geöffnet mit `persona-kit.mjs`, `open({ viewport: 'mobile' })`.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/1fcd03a4-dbbc-58c9-880c-20c065d35c71/scratchpad/marco-landing-kompakt/`.
Nichts gespeichert.

Aufgabe: In zehn Minuten auf dem Handy herausfinden, ob Dwello meine jährliche Nebenkostenabrechnung einfacher macht, was es kostet und was ich tun muss, um anzufangen. Danach beurteilen, ob die Seite jetzt kurz genug ist, ob sich noch etwas wiederholt und ob mir etwas für die Entscheidung fehlt. Bezug: mein früherer Befund P-5 in `marco-landing.md` (rund 29 Handy-Bildschirme, Zahlen und Funktionen zwei- bis dreimal).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | ganze Seite | Deutlich kürzer, aber immer noch lang: 17 598 px, also rund 21 Handy-Bildschirme (vorher rund 29). Meine drei Fragen beantwortet der erste Bildschirm fast ganz. Danach folgen noch 13 Abschnitte, darunter «Einfach zu bedienen», Open Source und eine Roadmap mit 5 Punkten. |
| P-2 | Minor | Hero, «Installieren», FAQ | Der Satz «Einrichten muss jemand, der sich mit Computern auskennt; Updates und Datensicherungen macht diese Person» steht dreimal fast wörtlich: im Kleintext unter den Hero-Knöpfen, in der Einleitung von «Installieren» und in der FAQ «Brauche ich technische Kenntnisse?». Dazu kommt ein vierter Hinweis im Schlussabschnitt («lassen Sie Dwello einrichten»). |
| P-3 | Minor | Hero, Kennzahlen, Open Source, FAQ | «Gratis» kommt fünfmal: Schild «Open Source · Gratis», «Kostenlos und ohne Abo» im Hero, Kennzahl «CHF 0.– ohne Abo und ohne Werbung», «0.– CHF pro Jahr» mit «kein Premium-Abo» bei Open Source, FAQ «Kostet Dwello wirklich nichts?». Nur die FAQ sagt etwas Neues (Strom, Server, Porto, externe KI). |
| P-4 | Nit | mehrere Abschnitte | Kleinere Doppelungen: vier Sprachen (Kennzahl, Kachel «Vier Sprachen», Schritt 4, Abrechnungs-Text), Belege bleiben lokal (Hero, «Lokale KI mit Ollama, ohne Cloud», Datenschutz «Belege bleiben im Haus»), Installer #497 (gelber Kasten bei «Installieren» und Roadmap), Versand per E-Mail oder Brief (Schritt 4 und Kachel), «Übersicht mit nächstem Schritt» (Einleitung der vier Schritte, Kachel, «Einfach zu bedienen»). |
| P-5 | Nit | Menü, «Installieren», Schluss, Fuss | Für denselben Weg stehen vier Namen: Menü «Einrichten», Abschnittsschild «Installieren», Knopf «So kommen Sie zu Dwello», Knopf «Dwello einrichten lassen», Fusslink «Anleitung zum Einrichten». Ich musste kurz prüfen, ob «So kommen Sie zu Dwello» und «Einrichten» an dieselbe Stelle führen (ja, beide #installieren). |
| P-6 | Minor | Hero, «Installieren», FAQ | Für meine Entscheidung fehlt: (a) was ich tue, wenn ich niemanden habe, der Computer kann (gibt es jemanden, den ich dafür bezahlen kann, und was kostet das ungefähr?), und (b) ein klarer Satz, ob ich die Abrechnung dann auf dem Handy machen kann. Bei «Eigener PC» steht nur «Dwello läuft nur, wenn Ihr PC an ist. Für den Zugriff vom Handy eignet sich ein Homeserver», weiter unten aber «Ganz auf dem Handy: Jede Seite passt aufs Handy». |

## Beobachtungen

- Neu und gut: oben rechts gibt es «Menü» (83 × 48 px). Es klappt auf mit Funktionen, Einrichten, Datenschutz, Open Source, Fragen, Impressum und dem Sprachwechsel Deutsch, Français, Italiano, English, alle 48 px hoch. «Fragen» springt zur FAQ, und das Menü schliesst sich danach. Mein früherer P-1 ist damit erledigt.
- Neu und gut: Der Docker-Befehl ist aus dem ersten Bildschirm verschwunden. Oben stehen «Demo ansehen» und «So kommen Sie zu Dwello», darunter ehrlich «Einrichten muss Dwello jemand, der sich mit Computern auskennt». Die Zeitangabe heisst jetzt «rund eine Stunde, mit der Google-Anmeldung», und Datensicherungen werden erwähnt.
- «Was in Dwello steckt» hat noch 7 Kacheln statt 15, die «Geplant»-Kacheln sind weg, Geplantes steht nur noch in der Roadmap. Die Kennzahlen zu WCAG und Prüf-Szenarien sind weg.
- Der Abschnitt «Einfach zu bedienen» zeigt «48 px», «7 : 1» und «390 px» als grosse Zahlen. Das ist Entwicklersprache. Die Seite selbst hält «48 px» nicht überall: «Kopieren» im Terminal-Kasten ist 36 px hoch, die Fusslinks 19 px, die Issue-Links (#497 usw.) 20 bis 23 px. Das war schon mein früherer P-7.
- Das App-Bild direkt unter dem Hero ist ein verkleinerter Desktop-Screenshot (2000 px breit, auf 356 px gezeigt), dessen Text ich nicht lesen kann. Das Handy-Bild der Übersicht ist in der Seite vorhanden, wird auf 390 px aber nicht gezeigt (0 × 0 px). Gerade auf dem Handy hätte es mir am meisten gesagt. Beim PDF-Bild lese ich Titel und «Nachzahlung CHF 215.80», die Tabelle darunter nicht.
- «Anleitung zum Weitergeben (Englisch)» führt auf GitHub. Dass sie nur Englisch ist, steht ehrlich dran. Für meinen Schwager wäre das in Ordnung, für eine ältere Bekannte eher nicht.
- Die Seite lädt in rund 0,6 s. Alle Anfragen gehen an localhost:3310, es gibt keine fremden Server. Die Seite scrollt nicht seitlich (scrollWidth 390).
- Die FAQ hat sechs Fragen, jede Zeile ist 64 bis 83 px hoch und gut zu treffen. Die Antworten sind kurz und beantworten genau meine Fragen (Kosten, Anzahl Wohnungen, KI-Fehler, Rechtsprüfung, Demo).

## Aufgabe geschafft: ja

Nutzen, Kosten und Weg zum Start habe ich gefunden. Länge und Wiederholungen habe ich beurteilt.

- **Nutzen:** Ja. Rechnungen hineinziehen, die KI liest sie, Abrechnung tagesgenau für das ganze Gebäude mit Abzug des Akontos, PDF mit QR-Rechnung, Hinweis auf fehlende Rechnungen. Das spart mir das Excel.
- **Kosten:** CHF 0, kein Abo. Ich bezahle höchstens Strom oder Server, Porto und eine externe KI, falls ich eine nutze. Nicht genannt ist, was mich die Person kostet, die es einrichtet (P-6).
- **Start:** Ich lasse es von jemandem einrichten, der sich mit Computern auskennt (rund eine Stunde), und gebe ihm die englische Anleitung. Danach arbeite ich im Browser. Ausprobieren kann ich vorher die Demo.

## Aufwand

Rund 8 Minuten, etwa 25 Schritte: erster Bildschirm lesen, «Menü» auf- und zuklappen, «Fragen» antippen, 5 FAQ-Fragen aufklappen, «So kommen Sie zu Dwello» antippen, Tab «Homeserver / NAS» antippen, dann die ganze Seite von oben bis unten durchwischen (rund 21 Bildschirme).

## Ablauf

1. **Seite öffnen.** Erwartet: in 10 Sekunden klar, was es ist. Gesehen: «Ihre Nebenkostenabrechnung, einfacher gemacht.», ein Absatz «Rechnungen hineinziehen, Abrechnung prüfen, mit QR-Rechnung versenden», Knöpfe «Demo ansehen» und «So kommen Sie zu Dwello», darunter «Kostenlos und ohne Abo. Einrichten muss Dwello jemand, der sich mit Computern auskennt …». Kein Terminal mehr. Viel besser als beim letzten Mal.
2. **«Menü» antippen.** Erwartet: Menü mit Sprache. Gesehen: ein Kasten mit sechs Links und den vier Sprachen (Screenshot `03-menu.png`).
3. **«Fragen» antippen.** Erwartet: Sprung zur FAQ. Gesehen: die Seite springt zu «Häufige Fragen.», die erste Frage ist offen, das Menü schliesst sich.
4. **Alle FAQ-Fragen aufklappen.** Erwartet: Antworten zu Kosten und Einstieg. Gesehen: «Ja. Dwello ist Open Source und kostenlos …», «bis zu 50 Wohnungen», «Nichts, ohne dass Sie es bestätigen», «Nein, nicht von einer Anwältin …», «Ja. Die Demo auf demo.dwello.ch …». Damit hatte ich meine Antworten nach rund 3 Minuten.
5. **Zurück nach oben, «So kommen Sie zu Dwello» antippen.** Erwartet: was ich konkret tun muss. Gesehen: «Einrichten lassen, dann im Browser arbeiten.» Der Text sagt, wer es macht (Familie, Bekannte, IT-Dienst), wie lange es dauert (rund eine Stunde) und wer Updates und Datensicherungen macht. Darunter folgen der Knopf «Anleitung zum Weitergeben (Englisch)», drei Tabs und ein Terminal-Kasten (`06-install.png`). Ich habe den Satz zur Einrichtung hier zum zweiten Mal gelesen (P-2).
6. **Tab «Homeserver / NAS».** Erwartet: wie ich vom Handy aus arbeite. Gesehen: SSH, eigene Domain mit HTTPS, VPN oder Tailscale. Das ist für meinen Helfer. Für mich bleibt offen, ob die einfache Variante «Eigener PC» auf dem Handy reicht (P-6).
7. **Ganze Seite von oben durchwischen.** Erwartet: kürzer als letztes Mal, jedes Thema einmal. Gesehen: rund 21 Bildschirme. Die vier Schritte sind wieder der beste Teil. «So sieht Dwello aus» hat drei Themen mit Bildern, das PDF-Bild ist halbwegs lesbar (`09-pdf-bild.png`). «Was in Dwello steckt» ist mit 7 Kacheln schnell gelesen. Ab «Datenschutz» habe ich nur noch überflogen, weil sich vieles wiederholt: Gratis (P-3), lokale KI, Sprachen, Installer #497 (P-4).
8. **Schluss und Fuss.** Gesehen: «Die nächste Abrechnung machen Sie mit Dwello.» mit «Demo ansehen» und «Dwello einrichten lassen», darunter der Fuss mit drei Spalten Links und DE/FR/IT/EN. Der Schluss ist eine gute Zusammenfassung.

## Verwirrung

- «Installieren», «Einrichten», «So kommen Sie zu Dwello», «Dwello einrichten lassen»: vier Namen für einen Weg (P-5).
- «Die Software läuft bei Ihnen» und «Dwello läuft nur, wenn Ihr PC an ist» neben «Ganz auf dem Handy»: Kann ich nun auf dem Handy abrechnen oder nicht? (P-6)
- «48 px», «7 : 1», «390 px»: Die Zahlen sagen mir nichts, die Sätze daneben schon.
- Noch unbekannt, aber jetzt im Teil für den Helfer und damit nicht mehr störend: Docker, Terminal, SSH, Tailscale, Ollama, OAuth-Schlüssel.
- «MCP-Server» in der Roadmap: Ich weiss immer noch nicht, was das ist. Es stört aber nicht mehr, weil es nur noch als geplanter Punkt dasteht.
- «Heizprofil»: Die Seite erklärt es («Im Januar zählt ein Mietstag mehr als im Sommer»). Gut.

## Fehlerrisiken

- Wer niemanden mit Computerkenntnissen kennt, liest dreimal «jemand, der sich auskennt», findet aber keinen nächsten Schritt und gibt auf (P-2, P-6).
- Wer «Eigener PC» einrichten lässt und dann auf dem Handy arbeiten will, merkt erst danach, dass das nur mit Homeserver geht (P-6).
- Wer wegen der Wiederholungen nur noch überfliegt, übersieht den einzigen neuen Satz zu Kosten (Strom, Porto, externe KI) in der FAQ (P-3).

## Vorschläge

- **P-1:** Die Seite auf 390 px von oben bis unten durchwischen: rund 21 Bildschirme. Hilfreich: den Abschnitt «Einfach zu bedienen» auf dem Handy weglassen oder auf einen Satz kürzen (die vier Schritte und die FAQ sagen dasselbe), die Kennzahlen unter dem Hero streichen (alle vier Zahlen stehen auch anderswo) und die Roadmap auf die zwei Punkte kürzen, die mich betreffen (Installer, Export), mit Link zu den übrigen.
- **P-2:** Hero-Kleintext, Einleitung «Installieren» und FAQ «Brauche ich technische Kenntnisse?» nacheinander lesen: derselbe Satz dreimal. Hilfreich: im Hero nur einen kurzen Halbsatz («Einrichten lassen, dann einfach im Browser arbeiten») und die ausführliche Fassung nur bei «Installieren». Die FAQ-Antwort kann auf diesen Abschnitt verweisen.
- **P-3:** Hero, Kennzahlen, Open Source und FAQ lesen: «gratis, ohne Abo» kommt fünfmal. Hilfreich: Kennzahl «CHF 0.–» und «0.– CHF pro Jahr» im Open-Source-Teil weglassen. Den neuen Inhalt der FAQ (Strom, Server, Porto, externe KI) als einen Satz neben «Kostenlos und ohne Abo» im Hero setzen.
- **P-4:** Die Seite durchlesen und Themen zählen (Sprachen, lokale KI, #497, Versand, Übersicht). Hilfreich: jedes Thema an einer Stelle, zum Beispiel die Kachel «Vier Sprachen» streichen, weil die Kennzahl und Schritt 4 das schon sagen, und «Versand per E-Mail oder Brief» nur bei Schritt 4 nennen.
- **P-5:** Im Menü «Einrichten» antippen, dann oben «So kommen Sie zu Dwello», dann im Schluss «Dwello einrichten lassen»: Alles führt zu einem Abschnitt mit dem Schild «Installieren». Hilfreich: ein Wort für alles, am besten «Einrichten» (das Schild «Installieren» umbenennen).
- **P-6:** Hero, «Installieren» (Tab «Eigener PC», «Gut zu wissen») und FAQ nach «Wer hilft mir, wenn ich niemanden kenne?» und «Geht das dann auf dem Handy?» absuchen: keine Antwort. Hilfreich: eine FAQ «Ich kenne niemanden, der Dwello einrichten kann» (was ein IT-Dienst ungefähr kostet oder wo man Hilfe findet) und bei «Eigener PC» klar: «Mit dieser Variante arbeiten Sie am PC; auf dem Handy nur mit Homeserver oder Server in der Cloud».

## Nicht geprüft

- **Demo (demo.dwello.ch):** Ich habe den Link nicht geöffnet, er führt auf eine externe Seite. Beim letzten Mal war sie in dieser Umgebung nicht erreichbar.
- **Anleitung zum Weitergeben und andere GitHub-Links:** externe Seiten, nicht geöffnet.
- **«Kopieren»:** nicht erneut getestet. Es ging nicht um die Kürzung.
- **FR, IT, EN:** nicht durchgelesen. Ob dort dieselben Kürzungen gemacht wurden, habe ich nicht geprüft.
- **Dunkelmodus:** nicht geprüft, das Handy war hell eingestellt.
