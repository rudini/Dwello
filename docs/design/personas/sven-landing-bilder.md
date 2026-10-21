# Sven: Landing Page, Wirkung, Bilder und Animationen

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Seite: `http://localhost:3310/index.html` (statisch, Deutsch), Desktop 1440 × 900, beurteilt am Accessibility-Tree (`readOut`) und mit Tab, Enter und Pfeiltasten. Nichts gespeichert. Skripte und Bildschirmfoto: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-landing-bilder/` (`run.mjs`, `run2.mjs`, `run3.mjs`, `tree.txt`, `tabs.json`, `facts.json`, `01-seite.png`).

Aufgabe geschafft: ja (Fragen 20–24 beantwortet).
Aufwand: rund 15 Minuten, 3 Durchgänge: ganzen Baum vorlesen lassen, 60 Mal Tab, gezielt Sprunglink, Ankerlinks, Fragen-Akkordeon, Reiter und «Kopieren» bedient, einmal mit «Bewegung reduzieren».

## Fragebogen

**20. Warm oder kühl? Note 3 (von 1 = kühl bis 5 = warm).**
Die Sätze sind oft warm, die Dinge, die mir zwischen den Sätzen vorgelesen werden, sind kühl. Warm wirken auf mich «Ihr Vermieterjahr», «Für Menschen, die das nur ein paar Mal im Jahr machen», «jemand aus der Familie, eine Bekannte oder Ihr IT-Dienst», «Marco Bernasconi in Luzern bekommt seine Abrechnung auf Italienisch» und der Schluss «Im Frühling ist die Abrechnung schnell gemacht»: Da höre ich einen Menschen, der mit mir redet. Kühl wird es, weil mir die Bildtexte (Alt-Texte) den Bildschirm inventarisieren statt zu sagen, was ich davon habe: «Abrechnung NK-11111111-2025-0001 für Hans Müller …» liest mein Screenreader Ziffer für Ziffer, im Abschnitt «Verteilschlüssel und Heizprofile» kommt nach dem Bild noch einmal «0.7 Stern geschweifte Klammer area …» als Code. Dazu Zahlenkacheln wie «48 px Grosse Schaltflächen», «7 : 1 Kontrast für Hilfetexte», «390 px Ganz auf dem Handy», ein ganzer Terminalblock im Abschnitt «Installieren» und Links, die nur «#497», «#495», «#496», «#498» heissen. Das klingt nach Entwicklerseite, nicht nach Vermieterin.

**21. Fehlen Bilder (Menschen, Häuser, Alltag), oder reichen die Bildschirmfotos?**
Mir fehlt kein Bild, mir fehlt in manchen Alt-Texten der Sinn. Bilder sind für mich genau so warm wie ihr Alt-Text. Die Bildschirmfotos reichen, wenn ihr Text sagt, was es mir bringt («Dwello hat die Rechnung gelesen und bittet Sie nur, das Datum zu prüfen») statt was im Dialog steht. Gut gemacht ist, dass die Dunkel- und Handy-Varianten `alt=""` haben: Ich höre jedes Bild nur einmal. Das einzige Bild, das kein Bildschirmfoto ist, «Ein Haus mit einem Server darin» im Abschnitt «Datenschutz», ist mir das liebste, weil es eine Aussage hat (Ihre Daten bleiben im Haus); der Text dürfte das noch sagen. Ein Foto einer Vermieterin am Küchentisch hilft mir nur, wenn der Alt-Text eine Aussage trägt; ein Stimmungsfoto mit «Lächelnde Frau am Laptop» wäre Lärm, eines mit `alt=""` stört nicht, gibt mir aber auch nichts. Nicht helfen würden mir: Stockfotos ohne Aussage, Bildkarussells, Text im Bild, Diagramme ohne Text daneben.

**22. Wo würde eine Animation etwas erklären?**
Für mich erklärt eine Animation nur über ihre Textfassung; die braucht es also so oder so. Wo eine Animation den Sehenden etwas erklärt und die Textfassung auch mir hilft:
- «Rechnungen und KI»: der Weg PDF hineinziehen, KI liest, Hinweis, bestätigen. Als nummerierte Schritte im Text ist das für mich schon fast da.
- «Verteilschlüssel und Heizprofile»: wie aus einer Rechnung der Anteil einer Wohnung wird. Hier hätte ich am liebsten ein ausgerechnetes Beispiel in Worten statt der Formel mit `{area_total}`.
- «Vier Schritte. Einmal im Jahr.»: das Vermieterjahr als Zeitstrahl.
- «Swiss QR-Rechnung und Mahnwesen»: vom PDF zum bezahlten Betrag.

**23. Wo würde Bewegung stören, ablenken oder die Seite langsamer machen?**
- Ganz oben beim Titel «Ihre Liegenschaft. Ihre Daten. Ihr Server.»: ein Video oder eine Schleife, die von selbst läuft, kostet Ladezeit und spricht im schlimmsten Fall in meinen Screenreader hinein.
- Die Zahlenliste unter dem ersten Bild («CHF 0.–», «4 Sprachen», «50 Wohnungen», «0 Daten»): hochzählende Zahlen lese ich halbfertig vor («0 Sprachen»).
- Das Gesprächsbeispiel im Abschnitt «Fragen Sie Ihre Liegenschaft einfach.»: eine Tipp-Animation mit Live-Region würde mir jeden Buchstaben ansagen; ohne Live-Region erfahre ich nicht, wann sie fertig ist.
- Einblenden beim Scrollen überall: Ich scrolle nicht, ich springe mit Überschriften. Text, der erst beim Hineinscrollen sichtbar wird, ist für mich je nach Umsetzung leer oder verschwindet unter dem Cursor.
- Alles, was den Fokus bewegt oder neuen Inhalt vor meinen Cursor schiebt (Karussell, automatisch wechselnde Reiter im Abschnitt «Installieren»).

**24. Drei beste Ideen, damit die Seite wärmer wirkt, ohne an Klarheit zu verlieren.**
1. Alt-Texte erzählen die Wirkung statt die Bildschirmteile aufzuzählen, ohne Laufnummern wie «NK-11111111-2025-0001» (Abschnitte «Rechnungen und KI», «Nebenkostenabrechnung», «Swiss QR-Rechnung»).
2. Ein kleines Rechenbeispiel in Worten im Abschnitt «Verteilschlüssel und Heizprofile»: «Der Lift kostet im Jahr CHF 1'200. Wohnung 1.01 hat 85 von 340 m², also zahlt sie CHF 300.» Das ist warm, weil es nach meinem Alltag klingt, und erklärt mehr als jede Animation.
3. Eine Person mit Namen durch die vier Schritte führen, wie es mit «Marco Bernasconi» schon einmal gelingt: «Frau Keller erfasst im Januar ihr Haus, lädt übers Jahr die Rechnungen hoch und schickt im März die Abrechnungen.» Links nach ihrem Inhalt benennen («Installer in einem Schritt, Diskussion auf GitHub» statt «#497»).

## Ideen

| Abschnitt | Idee | Was sie erklärt | Priorität |
|---|---|---|---|
| Rechnungen und KI | Alt-Text des Upload-Bilds als Wirkung formulieren, dazu die vier Schritte als nummerierte Liste; eine allfällige Animation dazu nur mit Start auf Knopfdruck | Was ich tun muss und was die KI mir abnimmt | hoch |
| Verteilschlüssel und Heizprofile | Ausgerechnetes Beispiel in Worten statt (oder vor) der Formel mit `{area}`; Heizprofil als kurze Tabelle Januar bis Dezember | Wie die Kosten auf Wohnungen verteilt werden | hoch |
| Vier Schritte. Einmal im Jahr. | Eine Vermieterin mit Namen geht durchs Jahr (Monate nennen) | Wann im Jahr ich was tue | mittel |
| Nebenkostenabrechnung / Swiss QR-Rechnung | Alt-Texte ohne Laufnummer, mit der Aussage «Herr Müller sieht, wofür er CHF 215.80 nachzahlt» | Was mein Mieter bekommt | mittel |
| Datenschutz | Alt-Text des Hausbilds um die Aussage ergänzen: «Ihre Daten bleiben bei Ihnen im Haus» | Wo die Daten liegen | mittel |
| Roadmap, Installieren | Links nach Inhalt benennen statt «#497» | Wohin der Link führt | mittel |
| Einfach zu bedienen | Zahlenkacheln als ganze Sätze vorlesbar machen («Schaltflächen sind mindestens 48 Pixel hoch») | Was «48 px» und «7 : 1» für mich heissen | tief |
| Fragen Sie Ihre Liegenschaft einfach. | Gesprächsbeispiel statisch lassen, keine Tipp-Animation | Wie ein Gespräch mit dem Assistenten aussähe | tief |

## Bedingungen für Animationen

Damit neue Bilder oder Bewegung mich nicht ausschliessen:

1. **Textfassung zuerst (WCAG 1.1.1, 1.2.x):** Was eine Animation erklärt, steht auch als Text auf der Seite, im DOM ohne Animation, nicht erst nach dem Abspielen. Ein Video hat Untertitel und eine Audiodeskription oder ein Transkript direkt darunter. Rein schmückende Bewegung hat `alt=""` oder `aria-hidden="true"` und keinen Namen.
2. **Kein Autoplay, oder anhalten können (WCAG 2.2.2):** Bewegung, die von selbst startet und länger als 5 Sekunden läuft, hat einen sichtbaren, per Tab erreichbaren Knopf «Animation anhalten» mit deutschem Namen, der vor der Animation im Tab-Ablauf kommt. Lieber: Start nur auf Knopfdruck.
3. **`prefers-reduced-motion` respektieren (WCAG 2.3.3):** Mit «Bewegung reduzieren» läuft nichts, auch kein Einblenden beim Scrollen und keine Parallaxe. Das sanfte Scrollen der Ankerlinks tut das heute schon richtig (mit «reduzieren» springt die Seite sofort, ohne läuft sie über rund 0.5 Sekunden).
4. **Kein Blinken (WCAG 2.3.1):** höchstens dreimal pro Sekunde.
5. **Fokus und Lesecursor bleiben, wo ich sie hinsetze:** keine Animation verschiebt den Fokus, wechselt Reiter oder Folien selbst, oder fügt Inhalt vor meiner Position ein. Kein `aria-live` für Bewegung; eine Live-Region nur für ein Ergebnis, das ich ausgelöst habe.
6. **Kein Inhalt hinter Scroll-Effekten:** Text ist ohne JavaScript und ohne Scrollen vorhanden (nicht `opacity: 0` bis zum Hineinscrollen), sonst springe ich mit der Überschriftentaste ins Leere.
7. **Ladezeit:** Bewegtbild lädt erst auf Knopfdruck oder träge (`loading="lazy"` wie die heutigen Bildschirmfotos), nicht im ersten Bildschirm.
8. **Steuerung bedienbar:** Play/Pause per Enter und Leertaste, Zustand angesagt («Animation anhalten» / «Animation abspielen» oder `aria-pressed`).

## Beobachtungen

- Heute bewegt sich nichts: nach dem Durchscrollen der ganzen Seite meldet der Browser keine laufenden Animationen, es gibt kein Video, kein Canvas, kein Karussell. Für mich ist das der beste Ausgangspunkt.
- Der Sprunglink «Zum Inhalt springen» ist der erste Tab-Halt und setzt den Fokus auf den Hauptinhalt; der nächste Tab landet auf «Demo ansehen». Gut.
- Alle Inhaltsbilder haben sinnvolle Alt-Texte; die Doppel-Varianten (dunkel, Handy) sind korrekt stumm.
- Die Fragen unter «Häufige Fragen» sagen «aufgeklappt» bzw. «zugeklappt» richtig an, im Namen hängt aber das Zeichen «+» bzw. «–» an («Kostet Dwello wirklich nichts? plus»).
- Im Gesprächsbeispiel («Fragen Sie Ihre Liegenschaft einfach.») ist ein Bereich per Tab erreichbar, der keinen Namen und keine Rolle hat; ich höre nur «dwello.next_steps() · dwello.deadlines(days: 14)». Ebenso die Terminalblöcke im Abschnitt «Installieren»: erreichbar, aber ohne Namen.
- Listeneinträge mit Titel und Erklärung laufen beim Vorlesen ohne Pause ineinander: «Lokale KI mit Ollama, ohne Cloud Ihre Belege verlassen den Server nicht.»
- Die kleinen Oberzeilen über den Überschriften («Ihr Vermieterjahr», «So sieht Dwello aus») sind blosser Text vor der Überschrift; mit der Überschriftentaste höre ich sie nicht. Gerade sie tragen die warmen Wörter.
- Die Reiter «Wo soll Dwello laufen?» lassen sich mit Pfeiltasten wechseln, der Zustand wird angesagt. Nach «Kopieren» sagt die Statusmeldung nur «Markiert» (im kopflosen Browser war die Zwischenablage vermutlich gesperrt; nicht weiter beurteilt).
- Nach einem Ankerlink im Menü (z. B. «Funktionen») steht der Fokus auf der Seite selbst, nicht auf der Überschrift des Abschnitts; der nächste Tab geht aber an der richtigen Stelle weiter.

## Verwirrung

- «MCP», «Ollama», «OpenAI-kompatibel», «AGPL-3.0-or-later», «SIX-Standard», «GWR» und die Platzhalter `{area}` / `{units_total}` in der Formel: vorgelesen klingen sie technischer als geschrieben.
- «#497» als Linkname: Ich weiss nicht, wohin er führt.

## Fehlerrisiken

- Wer neue Bilder einbaut und den Alt-Text vom Bildschirm abschreibt, macht die Seite für mich kühler statt wärmer.
- Wer Einblenden beim Scrollen einbaut, riskiert Abschnitte, die für mich leer sind.

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver): beurteilt habe ich den Accessibility-Tree von Chromium, nicht die tatsächliche Ansage und Betonung.
- Die Sprachversionen fr/it/en und die Unterseiten (Impressum, Datenschutzerklärung, Markenhandbuch): nicht Teil der Zusatzfragen.
- Die Demo auf demo.dwello.ch und GitHub: externe Seiten.
- Das Kopieren in die Zwischenablage: der kopflose Browser gibt sie nicht frei, deshalb kein Urteil über «Markiert».
- Animationen selbst: Es gibt heute keine, die Bedingungen oben sind deshalb Anforderungen, keine Prüfergebnisse.
