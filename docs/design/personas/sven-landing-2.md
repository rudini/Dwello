# Sven, Landing Page Runde 2 (Tastatur und Screenreader)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, `keyboardOnly`, zusätzlich einmal Mobile 390 × 844 für das Menü. Beurteilt nach dem Accessibility-Tree (`readOut`) und dem Fokus. Seite: http://localhost:3310/index.html (statisch, Deutsch). Nichts gespeichert.

Skripte, Baum-Auszüge und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-landing-2/` (`tree-desktop.txt`, `tab-desktop.txt`, `tabs-tree.txt`, `faq-tree.txt`, `tree-mobile-open.txt`, `08-after-link-viewport.png` u. a.).

## Befunde (nur was auf der Landing Page noch geändert werden sollte)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mobil, Menü | Nach Wahl eines Menülinks (z. B. «Funktionen») bleibt das Menü offen; es liegt über dem Ziel und verdeckt dessen Anfang. Wer mit Tastatur und Augen arbeitet, sieht den Abschnitt nicht, zu dem er gesprungen ist; ich selbst lande per Shift+Tab wieder in den Menülinks statt im Inhalt. |
| P-2 | Minor | Mobil, Menü | Escape schliesst das Menü nicht, weder vom Knopf «Menü» noch von einem Link darin. Schliessen geht nur mit Enter/Leertaste auf «Menü». |
| P-3 | Minor | «Was in Dwello steckt», «Was als Nächstes kommt» | Der Status «Verfügbar» oder «Geplant» steht vor der Überschrift jeder Karte. Wenn ich mit der Überschriften-Taste springe, höre ich «MCP-Server für KI-Assistenten» und «Alle Daten exportieren» ohne «Geplant» und halte sie für vorhanden. |
| P-4 | Minor | Roadmap, Einrichten | Die Issue-Links heissen alle «Issue 49x auf GitHub». In der Linkliste weiss ich nicht, zu welchem Vorhaben welcher gehört; der sichtbare Text ist «#497», der Name weicht davon ab (Sprachsteuerung). |
| P-5 | Minor | Beispiel KI-Assistent, Einrichten | Tabstopps ohne Rolle und Namen: das Beispielgespräch (`div`, auf Desktop nicht einmal scrollbar) und die drei Befehlsblöcke (`pre`). Der Fokus landet in «etwas», der Screenreader sagt nicht, was es ist. |
| P-6 | Minor | Kopf (Desktop) und Fusszeile | Sprachlinks heissen nur «DE», «FR», «IT», «EN»; vorgelesen als Buchstaben. Im mobilen Menü stehen sie ausgeschrieben («Deutsch», «Français» …), so wäre es auch hier gut. |
| P-7 | Nit | Merkmal-Listen (Rechnungen, Abrechnung, QR, Gebäude, Datenschutz, MCP) | Titel und Erklärung laufen ohne Pause zusammen: «Lokale KI mit Ollama, ohne Cloud Ihre Belege verlassen …», «Art. 257a OR Abgerechnet werden …». |
| P-8 | Nit | Häufige Fragen | Das Zeichen «+» bzw. «–» wird bei jeder Frage mitgelesen («Kostet Dwello wirklich nichts? plus»); der Zustand «zugeklappt/aufgeklappt» kommt ohnehin vom Element. |

## Beobachtungen

- Skip-Link «Zum Inhalt springen» ist der erste Tabstopp, sichtbar mit 3 px Rahmen, und setzt den Fokus wirklich auf `main` (tabindex −1); der nächste Tab ist «Demo ansehen» im Hero. Sehr gut.
- Landmarks sauber: banner, navigation «Hauptnavigation», navigation «Sprache», main, contentinfo mit navigation «Sprache wählen», dazu eine leere `status`-Region für das Kopieren. Die Abschnitte in `main` sind keine benannten Regionen; die Überschriften reichen mir dafür.
- Überschriften: genau eine h1 («Ihre Nebenkostenabrechnung, einfacher gemacht.»), dann h2 je Abschnitt, h3 darunter, keine Sprünge. Die Fusszeile hat h2 «Produkt», «Loslegen», «Community».
- Die zwei neuen Zeichnungen sind `role="img"` mit Namen («Vom Gebäude über die Abrechnung zur Mieterin», «Ein Haus mit einem Server darin»); die 53 Symbol-Icons sind `aria-hidden`. Bildschirmfotos haben lange, inhaltliche Alt-Texte (z. B. «Die Abrechnung 2025 von Hans Müller … Lift und Allgemeinstrom …»), die mir wirklich etwas erzählen.
- Upload-Schritte sind eine geordnete Liste (`ol`) mit Namen «So kommt eine Rechnung in Dwello», drei Einträge. Genau richtig.
- Das Verteilbeispiel steht als normaler Absatz: «Der Lift im Musterhaus Zentrum kostet CHF 1'690.00 im Jahr. Pro Einheit verteilt, trägt jede der sechs Wohnungen CHF 281.67». Vorlesbar, ohne Grafik nötig.
- Tabs «Wo soll Dwello laufen?»: echtes tablist, Pfeiltasten links/rechts mit Umlauf, Pos1/Ende, nur der gewählte Tab im Tab-Ablauf, Panel nach dem Tab benannt. Vorbildlich.
- «Kopieren» meldet über die Status-Region «Kopiert». Ohne Zwischenablage-Recht meldet es nur «Markiert» und der Knopf heisst danach «Markiert»; was ich dann tun soll (Strg+C), sagt es nicht.
- Die Vergleichstabelle hat caption und Spaltenköpfe; die Tabelle im KI-Beispiel hat keine Köpfe, ist aber als «Erfundenes Beispiel» betitelt.
- Fokus wird nirgends von der klebenden Kopfzeile verdeckt (vorwärts und rückwärts geprüft). Smooth Scrolling schaltet bei «weniger Bewegung» ab. Keine Animationen auf der Seite.
- Der Logo-Link «Dwello, zur Startseite» springt auf `#top`, also auf `main`, nicht auf den Seitenanfang. Stört mich nicht, der Name verspricht aber etwas anderes.
- Vor einigen Überschriften stehen Texte, die ich beim Springen verpasse: «0.– CHF pro Jahr» vor «Gratis heisst bei Dwello …», die Kategorien («Rechnungen und KI» usw.). Diese sind aber nur Zusatz.
- Die Befehle werden mit «$» und «#» vorgelesen; für die Person, die einrichtet, ist das in Ordnung.

## Fragebogen

### A. Erster Eindruck

Für mich ist «der erste Bildschirm» das, was ich nach dem Laden höre: Skip-Link, Kopf mit zwei Navigationen, «Demo ansehen», dann `main` mit Kategorie-Zeile, h1, Einleitung, zwei Links, Hinweis zur Einrichtung, Bild der Übersicht und vier Kennzahlen.

1. **Was ist Dwello?** Eine kostenlose Software, mit der ich als privater Vermieter in der Schweiz meine Nebenkostenabrechnung mache, die bei mir läuft und Rechnungen per KI liest. Die h1 und der erste Absatz sagen das in zwei Sätzen; die Landmarks davor sind kurz genug, dass ich schnell dort bin.
2. **Für wen? (4)** «für private Vermieterinnen und Vermieter» steht im ersten Absatz und in der Kennzahl «50 Wohnungen». Ich fühle mich angesprochen; ob Dwello selbst barrierefrei ist, erfahre ich aber erst weit unten («Barrierefrei nach WCAG 2.2 AA»), das wäre für mich der wichtigste Satz.
3. **Als Nächstes:** «So kommen Sie zu Dwello», weil der Absatz darunter sagt, dass jemand die Einrichtung machen muss, und ich wissen will, wer und wie. «Demo ansehen» würde ich danach probieren.
4. **Vertrauenswürdig? (4)** Klare Struktur, eine h1, keine Werbung, Impressum und Datenschutzerklärung im Fuss, Quellcode verlinkt. Abzug, weil der Kopf mich mit «DE FR IT EN» als Buchstabenfolge begrüsst.

### B. Verständlichkeit

5. **Texte verständlich? (4)** Kurze Sätze, gut vorlesbar. Unklar bzw. Fachwort: «MCP», «Ollama», «OpenAI-kompatibel», «Docker», «SSH», «AGPL», «Issue», «Heizprofil»; für meine Rolle als Nutzer muss ich die meisten nicht verstehen, und die Seite sagt das auch.
6. **Heute vs. geplant? (3)** Linear gelesen eindeutig («Verfügbar»/«Geplant» vor jeder Karte, MCP-Abschnitt beginnt mit «Geplant · MCP» und sagt «Geplant ist, dass …»). Beim Springen über Überschriften verliere ich den Status, weil er vor der Überschrift steht (P-3).
7. **Zeigen die Bilder die Arbeit? (4)** Ich sehe sie nicht, aber die Alt-Texte beschreiben den Inhalt konkret (Dialog «Rechnungen hochladen» mit Hinweis auf das Rechnungsdatum, Abrechnung von Hans Müller mit Nachzahlung CHF 215.80). Die Zeichnungen sind knapp und richtig benannt.

### C. Nutzen und Bedenken

8. **Problem gelöst:** Rechnungen sammeln, Kosten verteilen, Abrechnung mit QR-Rechnung erstellen und versenden, auch Mahnungen. Nicht gelöst: die Installation selbst, und ob ich die App mit Screenreader bedienen kann, steht nur als Versprechen.
9. **Am meisten überzeugt:** «Barrierefrei nach WCAG 2.2 AA … Jede Ansicht wird mit axe geprüft … Ohne Ausnahmen» und dass die Seite selbst das sauber vorlebt (Skip-Link, Tabs, Überschriften).
10. **Bedenken:** Ob die App auch mit echtem Screenreader und nicht nur mit axe geprüft ist; die FAQ beantwortet Kosten, Anzahl Wohnungen, KI-Fehler, Rechtssicherheit, Demo, aber nichts zur Bedienung mit Screenreader. Installation ist klar beantwortet: jemand anderes macht sie.
11. **Datenschutz und gratis glaubhaft? (4)** Konkret benannt, was nach aussen geht (Google-Anmeldung, Gebäuderegister, E-Mails, optional externe KI), Vergleichstabelle und Lizenz. Das Fehlen von Tracking habe ich im Netzwerk nicht geprüft.

### D. Weg zum Start

12. **Wie anfangen? (4)** 1. Demo ansehen. 2. Jemanden mit Computerkenntnissen bitten, ihm den Link «Anleitung zum Weitergeben (Englisch)» geben. 3. Diese Person wählt eigener PC, NAS oder Cloud und richtet in rund einer Stunde ein, mit Google-Konto. 4. Ich arbeite danach im Browser.
13. **Installation selbst?** Technisch traue ich mir die Befehle zu, sie sind per Tastatur kopierbar. Den Google-Schlüssel anzulegen würde ich mit meiner Assistenz oder einem Bekannten machen.
14. **Gefunden? (4)** Hauptnavigation, Sprachwahl, Impressum und Datenschutzerklärung im Fuss, FAQ über «Fragen». Abzug für die Sprachlinks als Abkürzungen (P-6) und für die Issue-Links ohne Thema (P-4).

### E. Bedienung und Darstellung

15. **Bedienbar mit Tastatur und Screenreader? (4)** 52 Tabstopps auf Desktop in logischer Reihenfolge, sichtbarer Fokusrahmen überall, nichts verdeckt, Tabs und FAQ nach Lehrbuch. Abzüge: zwei Arten Tabstopps ohne Namen (P-5) und das mobile Menü, das offen bleibt und nicht auf Escape reagiert (P-1, P-2).
16. **Länge:** Lang, aber dank Überschriften gut springbar. Linear gehört habe ich bis zur FAQ; die 15 Funktionskarten habe ich nur noch über die Überschriften überflogen.

### F. Gesamturteil

17. **Ausprobieren? (4)** Ja, die Demo zuerst, gerade weil die Seite zeigt, dass jemand Barrierefreiheit ernst nimmt.
18. **Einer Bekannten empfehlen? (4)** Ja, mit dem Hinweis, dass jemand die Einrichtung übernehmen muss.
19. **Als Erstes ändern:** Den Status «Verfügbar/Geplant» in oder nach die Kartenüberschrift setzen (P-3), damit auch Überschriften-Springer die Roadmap nicht mit dem Bestand verwechseln.

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? (3)** Die Sprache ist freundlich («Ihr Vermieterjahr», «Sie entscheiden»), die vielen Zahlen und Fachwörter weiter unten (Docker, SSH, AGPL) machen es technischer. Farben kann ich nicht beurteilen.
21. **Bilder:** Für mich zählen die Alt-Texte. Die beiden Zeichnungen mit kurzen, sinnvollen Namen sind gut; Bilder von Menschen bräuchte ich nicht, sie wären nur dann gut, wenn ihr Alt-Text etwas Konkretes sagt und nicht nur «glückliche Vermieterin».
22. **Animation, wo sie erklären würde:** Für Sehende vielleicht beim Upload («Rechnungen per Drag & Drop») und bei der Kostenverteilung (Lift CHF 1'690.00 auf sechs Wohnungen). Für mich muss es dann dieselbe Information als Text geben, wie heute die geordnete Liste und der Absatz zum Lift.
23. **Wo Bewegung stören würde:** Alles, was sich selbst bewegt oder Live-Regionen auslöst, unterbricht meinen Screenreader; besonders im Hero und bei den Tabs. Wenn Bewegung kommt, dann nur auf Knopfdruck und mit «weniger Bewegung» aus, wie heute das Smooth Scrolling.
24. **Drei Ideen für mehr Wärme:** (1) Eine kurze Stimme einer Vermieterin als Zitat mit Namen und Ort, als echter Text, nicht als Bild. (2) Die Barrierefreiheit früher und persönlicher erwähnen («Auch mit Screenreader bedienbar»), das fühlt sich für mich einladend an. (3) Fachwörter im Einrichten-Teil mit einem Halbsatz erklären, so wie es die App bei jedem Feld verspricht.

## Aufgabe geschafft: ja

Fragebogen 1–24 beantwortet; Skip-Link, Landmarks, Überschriften, Zeichnungen, Upload-Liste, Verteilbeispiel, Linknamen, FAQ, Tabs und mobiles Menü per Tastatur geprüft.

## Aufwand

Rund 25 Minuten, 8 Skripte: Baum und Tab-Reihenfolge Desktop (52 Tabstopps), Skip-Link und Attribute, Navigation/Tabs/Kopieren/FAQ, Fokusverdeckung vor- und rückwärts, mobiles Menü (zwei Durchgänge), Bewegung und Scroll-Container.

## Ablauf

1. **Seite laden, Baum lesen.** Erwartet: Skip-Link, Landmarks, eine h1. Gesehen: genau so; Titel «Dwello – Open Source für Vermieter», `lang="de-CH"`.
2. **Skip-Link mit Enter.** Erwartet: Fokus im Inhalt. Gesehen: Fokus auf `main`, nächster Tab «Demo ansehen» im Hero.
3. **Durch die Seite tabben.** Erwartet: nur Bedienelemente, mit Namen. Gesehen: Kopf (12 Stopps), Hero (2), dann ein namenloser Stopp im KI-Beispiel (P-5), Anleitung, Tab «Eigener PC», «Kopieren», ein namenloser Befehlsblock (P-5), Issue-Links (P-4), sechs FAQ-Fragen, Schluss-Links, Fuss. Fokusrahmen überall sichtbar.
4. **Hauptnavigation «Fragen».** Erwartet: Sprung zur FAQ. Gesehen: `#faq`, nächster Tab ist die erste Frage.
5. **Tabs.** Erwartet: Pfeiltasten. Gesehen: rechts/links mit Umlauf, Pos1/Ende, Panel wechselt mit, Name des Panels passt.
6. **Kopieren.** Erwartet: Rückmeldung. Gesehen: Status «Kopiert»; ohne Zwischenablage-Recht «Markiert».
7. **FAQ.** Erwartet: auf- und zuklappen per Enter und Leertaste. Gesehen: funktioniert; «+»/«–» wird mitgelesen (P-8).
8. **Rückwärts mit Shift+Tab.** Erwartet: kein Fokus unter der Kopfzeile. Gesehen: nie verdeckt.
9. **Mobil, Menü öffnen.** Erwartet: Knopf mit Zustand. Gesehen: «Menü» ist der dritte Tabstopp (Element `details/summary`, Zustand wird als zugeklappt/aufgeklappt gemeldet); Enter und Leertaste öffnen; danach folgen sinnvoll sechs Links (inkl. Impressum) und vier ausgeschriebene Sprachen, dann der Hero.
10. **Mobil, Menü schliessen.** Erwartet: Escape schliesst und Fokus zurück auf «Menü». Gesehen: Escape tut nichts (P-2); nur Enter/Leertaste auf «Menü» schliesst.
11. **Mobil, Menülink «Funktionen».** Erwartet: Menü schliesst, Abschnitt sichtbar. Gesehen: Sprung zu `#funktionen`, Menü bleibt offen und deckt Kategorie und Überschrift «Rechnungen per Drag & Drop …» teilweise ab (Bildschirmfoto `08-after-link-viewport.png`: weisses Menü-Panel von 64 bis 435 px über dem Inhalt) (P-1). Auch beim Wegtabben aus dem offenen Menü bleibt es offen.

## Verwirrung

- «DE FR IT EN» im Kopf: als Buchstaben vorgelesen, im Fuss nochmals.
- «Issue 497 auf GitHub»: «Issue» ist Englisch und ohne Thema; sichtbar steht «#497».
- «MCP», «Ollama», «OpenAI-kompatibel», «AGPL-3.0-or-later», «SSH», «Tailscale»: ohne Erklärung; für mich als Nutzer aber laut Seite nicht nötig.
- «Markiert» nach «Kopieren» (nur ohne Zwischenablage): sagt nicht, was ich tun soll.
- Karten-Status vor der Überschrift: beim Springen fehlt «Geplant».

## Fehlerrisiken

- Wer per Überschrift navigiert, hält MCP-Server und Export für vorhanden (P-3).
- Auf dem Handy mit Tastatur oder Schaltersteuerung verdeckt das offene Menü das Sprungziel; man glaubt, der Link habe nichts getan (P-1).
- Namenlose Tabstopps lassen mich glauben, ich sei in einem Eingabefeld oder Fehler (P-5).

## Vorschläge

- **P-1:** Mobil (390 × 844), Tab bis «Menü», Enter, Tab auf «Funktionen», Enter. Das Menü bleibt offen über dem Abschnitt. Hilfe: Menü beim Wählen eines Links schliessen (und beim Verlassen des Menüs mit Tab).
- **P-2:** Mobil, Menü öffnen, Escape (auf «Menü» oder einem Link darin). Nichts passiert. Hilfe: Escape schliesst das Menü und setzt den Fokus auf «Menü».
- **P-3:** Desktop, Abschnitt «Was in Dwello steckt.», mit der Überschriften-Taste von Karte zu Karte. «Alle Daten exportieren» und «MCP-Server für KI-Assistenten» klingen vorhanden. Hilfe: Status nach der Überschrift im DOM oder als Teil des Überschriftennamens («MCP-Server für KI-Assistenten, geplant»); dasselbe in der Roadmap.
- **P-4:** Desktop, Linkliste des Screenreaders öffnen: viermal «Issue 49x auf GitHub» ohne Thema. Hilfe: Namen mit Thema und sichtbarem Text, z. B. «#497, Installer in einem Schritt, auf GitHub»; oder sichtbarer Text, der den Namen enthält.
- **P-5:** Desktop, Tab nach «So kommen Sie zu Dwello»: Fokus auf dem Beispielgespräch ohne Rolle und Namen; im Einrichten-Teil nach «Kopieren» Fokus auf dem Befehlsblock ohne Namen. Hilfe: Beispielgespräch nur fokussierbar machen, wenn es scrollt, und dann `role="region"` mit Namen («Erfundenes Beispiel: Gespräch mit KI-Assistent»); Befehlsblöcke mit Namen wie «Befehle für Eigener PC».
- **P-6:** Desktop, Kopf und Fuss: Sprachlinks «DE», «FR» … Hilfe: Namen ausgeschrieben wie im mobilen Menü (sichtbar kurz lassen, Name z. B. «DE, Deutsch»).
- **P-7:** Abschnitt «Rechnungen per Drag & Drop», Liste darunter linear lesen. Hilfe: Titel als eigenes Element mit Satzende oder Doppelpunkt, damit der Screenreader eine Pause macht.
- **P-8:** FAQ, Fragen durchtabben: «plus»/«Strich» wird gelesen. Hilfe: Zeichen `aria-hidden` oder nur per CSS-Hintergrund.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): beurteilt habe ich nur den Accessibility-Tree von Chromium; ob CSS-Zeichen und `details` genau so angesagt werden, ist abgeleitet.
- Die Sprachversionen fr/it/en, Impressum, Datenschutzerklärung und Markenhandbuch: nicht Teil der Aufgabe.
- Die externe Demo (demo.dwello.ch) und die GitHub-Links: ausserhalb der statischen Seite, nicht geöffnet.
- Netzwerkanfragen und Cookies («Kein Tracking»): nicht nachgemessen.
- Farben und Kontrast: als blinder Nutzer nicht beurteilbar; dafür sind andere Personas und axe da.
