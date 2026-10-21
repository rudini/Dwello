# Sven – Landing Page (öffentliche Website)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt nach dem Accessibility-Baum (`readOut`) und dem fokussierten Element. Seite: `http://localhost:3310/index.html` (statisch, Deutsch), kurz auch `fr/index.html`. Nichts gespeichert.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-landing/` (`s1.mjs` bis `s5.mjs`, `tree.txt`, `01-start.png` bis `09-dark-focus.png`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abschnitt MCP («Geplant · MCP») | Die Überschrift «Fragen Sie Ihre Liegenschaft einfach.» ist eine h3 direkt unter der h2 «Nach dem Schweizer Datenschutzgesetz gebaut.». In der Überschriftenliste gehört der geplante MCP-Teil damit scheinbar zum Datenschutz, obwohl es ein eigener Abschnitt ist (`#mcp`, Fusszeilen-Link «KI und MCP»). |
| P-2 | Minor | Abschnitt MCP, Chat-Beispiel | Das Chat-Beispiel wird als normaler Inhalt vorgelesen: Text «KI-Assistent mit Dwello verbunden Entwurf Was muss ich …», dann eine Tabelle mit «Zahlungsfrist Hans Müller … CHF 215.80». Die Beschriftung «Entwurf: Gespräch mit einem KI-Assistenten über Dwello» steht auf einem `div` ohne Rolle und kommt im Baum nicht an. Ich höre nicht, dass das eine erfundene Illustration einer geplanten Funktion ist. |
| P-3 | Nit | Hero, MCP, Installieren | Drei Tab-Stopps ohne Rolle und Namen: der Startbefehl (`code`), die Zeile «dwello.next_steps() · dwello.deadlines(days: 14)» im Chat und der Befehlsblock im Reiter. Auf 1440 px scrollen sie nicht. Ich lande dort, höre nur Code und weiss nicht, was ich da tun kann. |
| P-4 | Minor | Installieren, Roadmap | Links heissen nur «#497», «#495», «#496», «#498». Der Screenreader sagt «Link Raute 497». In der Linkliste weiss ich nicht, wohin sie führen (GitHub-Issue zu welchem Thema). |
| P-5 | Nit | Häufige Fragen | Bei jeder Frage wird das Zeichen «+» bzw. «–» mitgelesen («Kostet Dwello wirklich nichts? Plus, reduziert»), zusätzlich zum korrekt gemeldeten Zustand «erweitert/reduziert». |
| P-6 | Nit | Kopfzeile und Fusszeile, Sprachwahl | Die Sprachlinks heissen «DE», «FR», «IT», «EN». Sie sind korrekt mit `lang` und `hreflang` ausgezeichnet, und «DE» ist als aktuelle Seite markiert, aber ein Kürzel ist kein Sprachname: «Deutsch», «Français», «Italiano», «English» wären eindeutig. |
| P-7 | Minor | Hero, «Kopieren» | Nach Enter auf «Kopieren» meldet die Statuszeile nur «Markiert», und der Knopf heisst danach auch «Markiert». Was ist markiert, und was soll ich jetzt tun (Ctrl+C)? (Im Testbrowser ohne Zugriff auf die Zwischenablage, siehe «Nicht geprüft».) |
| P-8 | Nit | Fusszeile, «Wissen» | «Nebenkosten abrechnen», «Verteilschlüssel» und «QR-Rechnung» führen alle zum selben Ziel `#funktionen`. Drei Links mit drei Namen lassen drei Stellen erwarten. |
| P-9 | Nit | Mehrere Abschnitte (Listen mit Vorteilen, Kennzahlen) | Titel und Erklärung eines Listenpunkts werden ohne Pause als ein Satz gelesen: «Lokale KI mit Ollama, ohne Cloud Ihre Belege verlassen den Server nicht», «48 px Grosse Schaltflächen», «7 : 1 Kontrast für Hilfetexte». Am Ende von «Installieren» geht der Satz direkt in die Abschnittsmarke über: «… geplant (#497). Einfach zu bedienen». |

## Fragebogen

**A. Erster Eindruck** (statt des ersten Bildschirms: was der Screenreader zuerst ansagt)

Zuerst kommen: Link «Zum Inhalt springen», Banner mit «Dwello, zur Startseite», Navigation «Hauptnavigation» (fünf Links), Navigation «Sprache» (DE, FR, IT, EN), Link «Installieren», dann Hauptbereich mit der Marke «Open Source · Gratis · Für die Schweiz» und der h1 «Ihre Liegenschaft. Ihre Daten. Ihr Server.».

1. **Was ist Dwello?** Eine kostenlose Software, mit der ich als privater Vermieter die Nebenkostenabrechnung auf meinem eigenen Rechner mache, mit QR-Rechnung, und eine KI liest dabei die Belege. Die h1 allein sagt das nicht, erst der Absatz danach.
2. **Für wen? Angesprochen? 4/5.** Der erste Absatz sagt «für private Vermieterinnen und Vermieter». Das bin ich. Die h1 «Ihre Liegenschaft. Ihre Daten. Ihr Server.» klingt aber mehr nach Technik als nach Abrechnung.
3. **Was als Nächstes?** «Demo ansehen». Ohne Installation will ich zuerst hören, ob die App selbst mit Screenreader geht. «Dwello installieren» springt nur zum Abschnitt weiter unten.
4. **Vertrauenswürdig? 4/5.** Die Struktur ist sauber: Sprunglink, benannte Navigationen, eine h1, Fusszeile mit Impressum und Datenschutzerklärung. Die Kennzahl «0 Verstösse gegen WCAG 2.2 AA» macht mich neugierig. Auf dieser Seite hält sie im Wesentlichen.

**B. Verständlichkeit**

5. **Texte ohne Nachschlagen? 3/5.** Die Fliesstexte sind kurz und klar. Unklar oder technisch: «Docker», «docker compose -f docker-compose.prod.yml up -d», «Ollama», «OpenAI-kompatibel», «MCP» / «Model Context Protocol», «OAuth-Schlüssel», «SSH», «AGPL», «axe», «WCAG 2.2 AA» (mir zufällig bekannt, anderen Vermietern kaum). Gesprochen werden die Befehlsblöcke zu langen Zeichenketten mit «Dollar» und «Raute».
6. **Heute oder geplant? 4/5.** Im Abschnitt «Was in Dwello steckt.» hat jede Karte als Text «Verfügbar» oder «Geplant» vor der Überschrift, nicht nur als Farbe. Das ist gut. Abzug: Das MCP-Chatbeispiel klingt wie echte Daten (P-2), und es hängt in der Überschriftenstruktur unter Datenschutz (P-1).
7. **Bilder und Screenshots? 4/5.** Die Alternativtexte der Screenshots sind konkret: «Dialog Rechnungen hochladen: Gebäude Musterhaus Zentrum gewählt, eine Datei gelesen, mit dem Hinweis, das Rechnungsdatum zu prüfen», «Seite 1 der Nebenkostenabrechnung von Hans Müller: Nachzahlung CHF 215.80 …», «QR-Zahlteil mit Schweizerkreuz, Konto, Referenz und Betrag CHF 215.80». Damit stelle ich mir die Arbeit vor. Ob die App selbst gut vorliest, zeigen sie natürlich nicht.

**C. Nutzen und Bedenken**

8. **Welches Problem gelöst?** Die jährliche Nebenkostenabrechnung mit Verteilung, Mieterwechsel und QR-Zahlteil, in der Sprache der Mieter. Was ich erwartet hätte und nicht finde: ein Satz, ob die App selbst mit Screenreader bedienbar ist. Die Seite sagt «Jede Ansicht wird mit axe geprüft». Das ist eine Maschinenprüfung, kein Test mit Screenreader.
9. **Was überzeugt am meisten?** Dass Daten und Belege bei mir bleiben, und die Antwort in den FAQ «Was passiert, wenn die KI eine Rechnung falsch liest?»: «Nichts, ohne dass Sie es bestätigen.»
10. **Bedenken?** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?»). Rechtssicherheit: beantwortet, ehrlich mit Verweis auf Hauseigentümerverband und Schlichtungsbehörde. Installation: Die FAQ «Brauche ich technische Kenntnisse?» sagt offen, dass ich Befehle im Terminal eingeben muss. Offen bleibt: Wer hilft mir, und ist die Google-Anmeldung (Abschnitt «Installieren», «Heute noch mit Google-Anmeldung») mit Screenreader machbar? Barrierefreiheit der App für Blinde ist nicht beantwortet.
11. **Datenschutz und «gratis» glaubhaft? 4/5.** Abschnitt «Nach dem Schweizer Datenschutzgesetz gebaut.» und die Vergleichstabelle im Abschnitt Open Source sind konkret. Die Tabelle ist sauber vorgelesen, mit Beschriftung und Spaltenköpfen. Zwischen «CHF 0.–», AGPL und «Kein Tracking» finde ich keinen Widerspruch.

**D. Weg zum Start**

12. **Wie anfangen? 3/5.** So habe ich es verstanden: Im Abschnitt «Installieren» den Ort wählen (Reiter «Eigener PC», «Homeserver / NAS», «Server in der Cloud»), dann 1. Dwello mit git herunterladen, 2. `.env` kopieren, 3. mit Docker starten, 4. das KI-Modell laden (ca. 6 GB). Dazu einmal einen Google-OAuth-Schlüssel einrichten. Was in der `.env` stehen muss, sagt die Seite nur mit «Ihre E-Mail, Schlüssel».
13. **Installation zutrauen?** Das Terminal kann ich. Die Google-OAuth-Einrichtung in der Google-Konsole ist mit Screenreader mühsam. Dafür bräuchte ich einen sehenden Bekannten oder jemanden aus der Community (Link «Idee oder Fehler melden» auf GitHub).
14. **Gefunden, was gesucht? 4/5.** Navigation, Sprachwahl, Impressum und Datenschutzerklärung sind über die Landmarks schnell erreichbar: Banner, zwei benannte Navigationen, Fusszeile mit zweiter Sprachnavigation «Sprache wählen». Abzug für die Kürzel «DE/FR» (P-6) und die drei «Wissen»-Links mit demselben Ziel (P-8).

**E. Bedienung und Darstellung**

15. **Bedienbar mit Tastatur und Screenreader? 4/5.** Gut: Der Sprunglink ist der erste Tab-Stopp und setzt den Fokus auf `main`. Der Fokusrahmen ist überall gleich (3 px, mit Abstand), auch auf dem dunklen Primärknopf und im Dunkelmodus (hellorange). Die sticky Kopfzeile verdeckt beim Rückwärts-Tabben keinen Fokus. Die Reiter «Wo soll Dwello laufen?» folgen dem Muster: nur der aktive Reiter im Tab-Weg, Pfeiltasten mit Umlauf, Pos1/Ende. Die FAQ sind native Aufklapper, Enter und Leertaste gehen, der Zustand wird angesagt. Abzug: Tab-Stopps ohne Zweck (P-3), «Raute 497» (P-4), «Markiert» (P-7), mitgelesene Plus/Minus-Zeichen (P-5).
16. **Länge?** Lang: 56 Tab-Stopps bis zum Ende, über 40 Überschriften. Mit der Überschriftennavigation geht es. Ich habe mich bei «Was in Dwello steckt.» (15 Karten nacheinander) durchgeskippt und erst bei «Installieren» wieder genau gelesen.

**F. Gesamturteil**

17. **Ausprobieren? 3/5.** Erst die Demo, und nur wenn die App so sauber vorliest wie diese Seite. Installation und Google-Anmeldung schrecken mich etwas ab.
18. **Einer Bekannten empfehlen? 3/5.** Einer sehenden, technisch geübten Vermieterin ja. Einer blinden Bekannten erst, wenn ich die App selbst geprüft habe.
19. **Als Erstes ändern:** Das MCP-Chatbeispiel als Illustration kennzeichnen und als eigenen Abschnitt mit h2 auszeichnen (P-1, P-2). Gleich danach die Links «#497» usw. sprechend benennen (P-4).

## Beobachtungen

- Seitensprache `de-CH`, Titel «Dwello – Open Source für Vermieter»; die französische Seite hat `fr-CH` und übersetzte Namen für Landmarks und Sprunglink («Aller au contenu», «Navigation principale», «Langue»).
- Die Kopfzeile enthält zweimal «Installieren» (Navigation und Knopf), beide mit demselben Ziel. Doppelt, aber nicht störend.
- Nach Enter auf einen Ankerlink der Navigation («Funktionen») bleibt `document.activeElement` auf `body`; der nächste Tab geht aber an der richtigen Stelle weiter. Für mich in Ordnung.
- «Demo ansehen» führt auf eine andere Website (`demo.dwello.ch`). Weder der Linkname noch ein Hinweis sagen das. Er öffnet aber im selben Tab, das ist gut.
- Das Bild «Ein Haus mit einem Server darin» im Datenschutz-Abschnitt ist reine Dekoration und könnte leer sein.
- Die Legende «Verfügbar heute in Dwello Geplant auf der Roadmap» wird als ein Text ohne Struktur gelesen.
- `html` hat `scroll-behavior: smooth`. Ob es bei «Bewegung reduzieren» abgeschaltet wird, habe ich nicht geprüft.
- Am Ende des Baums steht eine leere Statusregion (`#copy-status`); sie stört nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, 5 Skripte: einmal den ganzen Tab-Weg (56 Stopps) und den vollständigen Baum, dann gezielt Sprunglink, Ankernavigation, Kopieren, Reiter, FAQ, Rückwärts-Tabben unter der sticky Kopfzeile, französische Seite, Dunkelmodus.

## Ablauf

1. **Seite öffnen, Baum lesen.** Erwartet: Sprunglink, Landmarks, eine h1. Gesehen: genau das, «Zum Inhalt springen», banner, «Hauptnavigation», «Sprache», main, h1, contentinfo.
2. **Tab 1, Enter auf «Zum Inhalt springen».** Erwartet: Fokus im Inhalt. Gesehen: Fokus auf `main` (`tabindex=-1`), nächster Tab auf «Dwello installieren». Gut.
3. **Durch die Kopfzeile tabben.** Erwartet: Navigation, Sprache, Aktion. Gesehen: «Dwello, zur Startseite», fünf Navigationslinks, DE/FR/IT/EN (DE mit `aria-current=page`), «Installieren». Fokusrahmen sichtbar (Screenshot `02-tab1.png`).
4. **Hero.** Erwartet: zwei Links, Kopieren-Knopf. Gesehen: «Dwello installieren», «Demo ansehen», dann ein Tab-Stopp auf dem Befehl selbst (nur Code, keine Rolle; P-3), dann «Kopieren». Der Fokusrahmen am dunklen Knopf ist mit Abstand klar sichtbar (`03-focus-cta.png`).
5. **Enter auf «Kopieren».** Erwartet: «Kopiert». Gesehen: Statusmeldung «Markiert», Knopftext wechselt zu «Markiert» (P-7).
6. **Weiter tabben.** Erwartet: nächster Halt bei «Installieren». Gesehen: Halt auf «dwello.next_steps() · dwello.deadlines(days: 14)» mitten im Chat-Beispiel (Screenshot `05-focus-tool.png`: die Zeile ist blau umrandet, darüber «KI-Assistent mit Dwello verbunden», Plakette «Entwurf»). Der Baum liest das Gespräch und die Tabelle «Zahlungsfrist Hans Müller … CHF 215.80» wie echte Daten, unter der h2 Datenschutz (P-1, P-2).
7. **Reiter «Wo soll Dwello laufen?».** Erwartet: Pfeiltasten wechseln. Gesehen: Pfeil rechts wechselt Reiter und Panel, von «Server in der Cloud» zurück zu «Eigener PC», Pos1 und Ende gehen, das Panel heisst wie der Reiter. Gut.
8. **Im Panel.** Gesehen: «Kopieren», dann Tab-Stopp auf dem ganzen Befehlsblock (P-3), dann Link «#497» (P-4).
9. **Open Source, Roadmap.** Erwartet: sprechende Links. Gesehen: «Quellcode auf GitHub», «Idee oder Fehler melden» gut; Vergleichstabelle mit Caption und Spaltenköpfen gut; Roadmap-Links nur «#497», «#495», «#496», «#498» (P-4).
10. **FAQ.** Erwartet: Aufklapper mit Zustand. Gesehen: sechs Aufklapper, der erste offen, Enter und Leertaste schalten um, «erweitert» und «reduziert» werden gemeldet; das Zeichen «+» oder «–» wird als Teil des Namens mitgelesen (P-5; `07-faq.png`).
11. **Fusszeile.** Gesehen: Überschriften «Produkt», «Loslegen», «Wissen», «Community» (h2) mit Linklisten; drei «Wissen»-Links auf `#funktionen` (P-8); Impressum, Datenschutzerklärung, Lizenz, zweite Sprachnavigation. Nach dem letzten Link geht der Fokus kurz auf `body` und dann wieder auf den Sprunglink.
12. **Rückwärts von der Fusszeile bis oben (Shift+Tab, 45 Schritte).** Erwartet: kein Fokus unter der sticky Kopfzeile. Gesehen: keiner verdeckt.
13. **Ankerlink «Funktionen».** Gesehen: Seite springt zu `#funktionen`, der nächste Tab geht im Abschnitt danach weiter.
14. **Französische Seite, Dunkelmodus.** Gesehen: `lang=fr-CH`, Landmarks übersetzt; im Dunkelmodus ist der Fokusrahmen hellorange auf fast schwarzem Grund (`09-dark-focus.png`), gut sichtbar.

## Verwirrung

- «Markiert» nach «Kopieren»: Ich weiss nicht, ob etwas in der Zwischenablage ist.
- «Raute 497»: ein Link ohne Ziel im Namen.
- Das MCP-Gespräch mit «Hans Müller» und «28.10.2026»: echte Funktion, Demo oder Bild? Erst die Marke «Geplant · MCP» davor und das mitgelesene Wort «Entwurf» lassen es erraten.
- Begriffe: «Docker», «Ollama», «OpenAI-kompatibel», «MCP», «OAuth-Schlüssel», «SSH», «AGPL», «axe».
- «7 : 1 Kontrast für Hilfetexte» und «48 px Grosse Schaltflächen» klingen vorgelesen wie Satzfetzen.

## Fehlerrisiken

- Ein Screenreader-Nutzer hält das MCP-Beispiel für eine heute nutzbare Funktion oder für echte Daten (P-2).
- Wer nach «Kopieren» nur «Markiert» hört, fügt im Terminal womöglich nichts oder etwas anderes ein (P-7).
- Wer per Überschriftenliste den Datenschutz liest, liest den geplanten MCP-Teil als Teil der Datenschutzzusagen (P-1).

## Vorschläge

- **P-1:** Seite öffnen, Überschriftenliste aufrufen (z. B. NVDA H oder Elemente-Liste): Nach h2 «Nach dem Schweizer Datenschutzgesetz gebaut.» folgt h3 «Fragen Sie Ihre Liegenschaft einfach.». Hilft: die Überschrift im Abschnitt `#mcp` als h2 auszeichnen, wie bei den anderen Abschnitten.
- **P-2:** Bis zum Abschnitt MCP lesen. Das Chat-Beispiel wird mit Tabelle als normaler Inhalt gelesen; `aria-label` auf dem `div` ohne Rolle kommt nicht an. Hilft: das Beispiel als `figure` mit sichtbarer oder vorgelesener Beschriftung auszeichnen («Beispiel einer geplanten Funktion: Gespräch mit einem KI-Assistenten, erfundene Daten») oder ihm eine Rolle (`role="img"`/`group`) geben, damit die Beschriftung angesagt wird.
- **P-3:** Von «Demo ansehen» einmal Tab drücken: Fokus auf `code#hero-cmd` ohne Rolle und Namen; gleich bei «dwello.next_steps()…» im Chat und beim `pre` im Reiter-Panel. Hilft: `tabindex="0"` nur setzen, wenn der Block tatsächlich scrollt, und dann mit Rolle `region` und Namen («Befehl, waagrecht scrollbar»); die Zeile im Chat braucht gar keinen Tab-Stopp.
- **P-4:** Im Abschnitt Installieren oder Roadmap auf den Link «#497» tabben: angesagt wird «Link Raute 497». Hilft: ein sprechender Name, z. B. «Issue 497 auf GitHub: Installer in einem Schritt» (sichtbar oder als zugänglicher Name, der mit dem sichtbaren «#497» beginnt).
- **P-5:** Auf eine FAQ-Frage tabben: «Kostet Dwello wirklich nichts? Plus/Strich, reduziert/erweitert». Hilft: das Zeichen per CSS mit leerem Alternativtext ausgeben (`content: "+" / ""`) oder als `aria-hidden`-Element.
- **P-6:** In der Kopfzeile auf «FR» tabben: angesagt wird «FR». Hilft: zugänglicher Name in der jeweiligen Sprache («Français»), sichtbar darf das Kürzel bleiben, wenn der Name mit ihm beginnt oder es enthält, z. B. `aria-label="FR, Français"`.
- **P-7:** Im Hero auf «Kopieren» tabben, Enter: die Statusmeldung lautet «Markiert». Hilft: im Erfolgsfall «Befehl kopiert», wenn die Zwischenablage nicht geht, «Befehl markiert. Kopieren Sie ihn mit Ctrl+C.»; der Knopf behält seinen Namen.
- **P-8:** In der Fusszeile die drei «Wissen»-Links nacheinander öffnen: alle führen zu `#funktionen`. Hilft: auf die passenden Unterabschnitte verlinken (Abrechnung, Verteilschlüssel, QR-Rechnung) oder die Liste kürzen.
- **P-9:** Die Vorteilslisten unter «Rechnungen per Drag & Drop…» oder «Für Menschen, die das nur ein paar Mal im Jahr machen.» vorlesen lassen. Hilft: Titel und Erklärung als eigene Elemente mit Satzzeichen oder Doppelpunkt trennen (z. B. «Lokale KI mit Ollama, ohne Cloud: Ihre Belege …»), «7 : 1» als «Kontrast 7 zu 1» vorlesbar machen und den Satz «… geplant (#497).» als eigenen Absatz von der folgenden Abschnittsmarke trennen.

## Nicht geprüft

- Echter Screenreader (NVDA, JAWS, VoiceOver). Ich habe nur den Accessibility-Baum von Chromium gelesen; wie «#497», «+» oder «7 : 1» genau gesprochen werden, hängt vom Screenreader ab.
- Kopieren mit echter Zwischenablage. Im Testbrowser ohne Rechte darauf kam «Markiert»; ob ein normaler Browser «Kopiert» meldet, weiss ich nicht.
- Die Demo (`demo.dwello.ch`), Impressum, Datenschutzerklärung und das Markenhandbuch: ausserhalb der Aufgabe bzw. externe Seite.
- Die Sprachversionen IT und EN; FR nur der Anfang.
- `prefers-reduced-motion` beim sanften Scrollen.
