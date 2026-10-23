# Anna – Landing Page, Runde «warm»

Persona: Anna, 29, vermietet zum ersten Mal eine Wohnung und kommt nach Monaten wieder, ohne sich an etwas zu erinnern. Desktop 1440 × 900 mit Maus, dazu der erste Bildschirm und beide Animationen auf dem Handy (390 × 844, Touch). Seite: `http://localhost:3310/index.html` (Deutsch), kurz `http://localhost:3310/fr/index.html`. Nichts gespeichert, kein Login.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/3c9dac53-14ca-581f-8cfc-25c133ff3cbc/scratchpad/anna-landing-warm/`.

Frühere Berichte zum Vergleich: `anna-landing-2.md` (Fragen 1–19) und `anna-landing-bilder.md` (Fragen 20–24).

## Befunde (was auf der Landing Page noch geändert werden sollte)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | «Rechnungen und KI», Animation «Ablauf abspielen» | Die Animation hört beim gelben «Bitte prüfen» auf. Der dritte Schritt links («Sie prüfen die Angaben und bestätigen») kommt nicht vor: kein Bestätigen, keine fertige Rechnung, und ich erfahre nicht, *warum* ich das Datum prüfen soll. Die drei nummerierten Schritte links leuchten während der Animation nicht mit, also verbinde ich Bild und Text nicht. Gerade das «Sie entscheiden» aus der Überschrift sehe ich in der Bewegung nicht. |
| P-2 | Minor | Erster Bildschirm (Desktop), Brief und QR-Zahlteil | «Ihre Mieter bekommen einen Brief wie diesen»: der Brief ist auf dem Desktop rund 210 Pixel breit, ich kann darauf nichts lesen, auch nicht «Nachzahlung CHF 215.80». Es gibt keine sichtbare Bildunterschrift und kein Vergrössern. Ich sehe «ein Blatt mit QR-Code», mehr nicht. Auf dem Handy ist der Brief über die ganze Breite und fast lesbar. |
| P-3 | Minor | «Verteilschlüssel und Heizprofile», Animation «Verteilung abspielen» | Die Überschrift heisst «Gerecht verteilt, auch im Winter», die Animation zeigt aber nur den einfachsten Fall: CHF 1'690.00 Lift, sechs gleiche Kästchen à 281.67. Wie es nach Fläche aussieht oder was das Heizprofil im Winter macht (das, was ich nicht verstehe), zeigt sie nicht. Und vor dem Klick steht das Endbild schon da; ich habe zuerst gar nicht gemerkt, dass da noch etwas passiert. |
| P-4 | Minor | «Einrichten lassen, dann im Browser arbeiten.», aufgeklappt «Für die Person, die einrichtet: die Befehle» | Der Satz «Bei der Einrichtung wird ein Konto mit E-Mail-Adresse und Passwort angelegt» ist für *mich* wichtig (damit melde ich mich später an), steht aber im zugeklappten Teil für die Technikerin, zwischen den Befehlen. Wessen E-Mail-Adresse, und wer das Passwort kennt, sagt er nicht (meine frühere Frage zum Google-Konto, jetzt zum Passwort). |
| P-5 | Nit | «So sieht Dwello aus» | Das Bildschirmfoto der Übersicht mit «Als Nächstes zu tun» ist weg. Der Text sagt «Die Übersicht sagt Ihnen, was als Nächstes zu tun ist»; genau das hätte ich als Wiederkehrerin gern gesehen. |
| P-6 | Nit | «Rechnungen und KI», Desktop | Rechts neben der Überschrift ist rund 200 Pixel leerer Platz, dann erst der Knopf «Ablauf abspielen» und die Karte. Es sieht aus, als fehle dort ein Bild. |

## Beobachtungen

- **Nichts bewegt sich von selbst.** Beim Laden, nach 3 Sekunden Warten und nach dem Durchscrollen aller 13 Bildschirme lief keine einzige Animation (`document.getAnimations()` = 0). Beide Animationen starten erst auf Klick, laufen einmal (Ablauf rund 5 s, Verteilung rund 3,5 s) und enden mit dem Knopf «Nochmals abspielen». «Anhalten» hält wirklich an (der Knopf heisst dann «Weiter abspielen», nichts läuft mehr), «Weiter abspielen» macht weiter. Mit «Bewegung reduzieren» sind beide Knöpfe ausgeblendet und das Endbild steht still da.
- **Kürzer:** Desktop jetzt rund 10 600 Pixel (vorher rund 16 000), Handy rund 15 900 (vorher rund 26 000). «Einrichten» beginnt auf dem Desktop bei rund 5 300 Pixel, also nach etwa sechs Bildschirmen.
- **Akonto steht jetzt da:** «Gebäude erfassen» nennt «Mietverträge mit den vereinbarten Nebenkosten und dem Akonto», «Abrechnungen erstellen» sagt «Dwello zieht das vereinbarte Akonto ab». Das war mein Befund P-2 aus Runde 2; erledigt.
- **Google nicht mehr Pflicht:** Der gelbe Kasten «Heute noch mit Google-Anmeldung» ist weg; stattdessen Konto mit Passwort, Google wahlweise. Passt jetzt zu «nichts geht an uns».
- **Technik versteckt:** Terminal, Tabs PC/NAS/Cloud und «16 GB Arbeitsspeicher» sind hinter «Für die Person, die einrichtet: die Befehle» zugeklappt. Mein früherer P-4 (welche Variante) und P-5 (Terminal erschreckt) sind damit für mich gelöst: es ist sichtbar nicht meine Aufgabe.
- **Fachwörter:** «Heizprofil» («Im Januar zählt ein Mietstag mehr als im Sommer») und «Umlagefähig» («Kosten, die Sie nicht auf die Mieter umlegen dürfen») sind jetzt erklärt. Unerklärt bleiben «Akonto», «Leistungszeitraum», «Mietstage», «Ollama», «OpenAI-kompatible KI», «NAS», «AGPL», «MCP-Server» (Roadmap).
- **Vier Namen für einen Ort** (früher P-6), unverändert: Menü «Einrichten», Hero «So kommen Sie zu Dwello», Abschnittsmarke «Installieren», Schluss «Dwello einrichten lassen».
- **Rundung in der Verteilung:** 6 × CHF 281.67 ergibt CHF 1'690.02, nicht 1'690.00. Mir ist das beim Nachrechnen aufgefallen; ein Halbsatz («gerundet») würde mein Misstrauen gar nicht erst wecken.
- **Anleitung jetzt erreichbar:** «Anleitung zum Weitergeben (Englisch)» öffnet GitHub (`docs/installation.md`, Titel lädt), in meiner Umgebung ohne Gestaltung; sie ist weiterhin nur englisch.
- **Demo verlangt Google:** «Demo ansehen» führt auf `demo.dwello.ch/login` mit dem gelben Hinweis «Öffentliche Demo» und nur «Mit Google anmelden». Die FAQ sagt «Kann ich Dwello ausprobieren, ohne etwas zu installieren? Ja.», dass ich dafür ein Google-Konto brauche, steht auf der Landing Page nicht (die Demo selbst ist nicht Teil dieser Änderung).
- **Netz:** Die Seite lädt nur von `localhost:3310`.
- **Französisch, erster Bildschirm:** sagt dasselbe wie der deutsche: «Votre décompte des charges, en plus simple.», gleicher Satz mit «Vos locataires reçoivent une lettre comme celle-ci», Knöpfe «Voir la démo» und «Comment obtenir Dwello», gleicher Hinweis zur Einrichtung. Der Brief ist ein französischer («Décompte des charges», Pierre Dubois, CHF 142.35) statt Hans Müller mit CHF 215.80; das finde ich richtig. Die Animationsknöpfe heissen «Lire le déroulement» und «Lire la répartition». Auf 1440 Pixel bricht die französische Navigation zweizeilig um («Protection des données», «Open Source», und «Voir la démo» im Knopf), das sieht unruhig aus.
- **Werkzeug:** Der gemeinsame Browser-Shim unter `/root/.cache/pw-shim` zeigt auf `chrome-linux` statt `chrome-linux64` und startet nicht; ich habe für meine Läufe einen eigenen Shim im Scratchpad gesetzt (`PLAYWRIGHT_BROWSERS_PATH`), ohne etwas Gemeinsames zu ändern.

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Ein kostenloses Programm, das mir die Nebenkostenabrechnung macht, und am Ende bekommen meine Mieter einen Brief mit Einzahlungsschein (QR) wie den rechts. (Hero)
2. **Für wen, angesprochen? 5/5 (wie Runde 2).** «Ihre Nebenkostenabrechnung, einfacher gemacht» und «für private Vermieterinnen und Vermieter»: das bin ich. Der Brief rechts zeigt mir sofort, *was am Ende herauskommt*, nicht ein Programmfenster, das ich nicht kenne.
3. **Was als Nächstes?** «So kommen Sie zu Dwello», weil ich wissen will, ob ich das hinbekomme; gleich danach «Demo ansehen». Den Brief hätte ich gern angeklickt, um ihn zu lesen, aber das geht nicht (P-2).
4. **Vertrauenswürdig? 4/5 (wie Runde 2).** Ein echter Schweizer Zahlteil mit QR-Code wirkt seriöser als die frühere Übersicht. Abzug wie damals: wer dahintersteht, sehe ich erst ganz unten («© 2026 Roger Rudin», Impressum), und den Brief kann ich nicht lesen.

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? 4/5 (vorher 3).** Besser, weil die Technik zugeklappt ist, «Einfach zu bedienen» ohne Pixel und Kontrastzahlen auskommt und Heizprofil und umlagefähig jetzt erklärt sind. Unklar bleiben «Akonto», «Leistungszeitraum», «Mietstage», «Ollama», «OpenAI-kompatible KI», «NAS», «AGPL», «MCP-Server».
6. **Heute vs. geplant? 4/5 (vorher 5).** Die grünen «Verfügbar»-Marken und die Legende sind weg. Jetzt muss ich schliessen: was oben steht, gibt es; was unter «Roadmap – Was als Nächstes kommt» steht, ist geplant. Das ist eindeutig, aber die Roadmap steht ganz am Schluss nach den Fragen, wo ich fast nicht mehr hinschaue, und «Ein Installer in einem Schritt ist geplant» versteckt sich im Technikteil.
7. **Bilder zeigen die Arbeit? 4/5 (wie Runde 2).** Die zwei Animationen und das Bild der Abrechnung von Hans Müller zeigen die Arbeit besser als Standbilder. Abzug: der Brief im ersten Bildschirm ist auf dem Desktop zu klein (P-2), und die Übersicht «Als Nächstes zu tun» fehlt (P-5).

### C. Nutzen und Bedenken

8. **Welches Problem gelöst?** Ich muss nicht in Excel rechnen, wie viel Lift oder Heizung auf jede Wohnung fällt; Dwello zieht das Akonto ab und schickt einen Brief mit QR-Zahlteil. **Nicht gelöst, erwartet:** nichts Grosses mehr; die Lücke von Runde 2 (Akonto, was ich bereitlegen muss) ist im Abschnitt «Vier Schritte» jetzt beantwortet.
9. **Was überzeugt am meisten?** Der Brief im ersten Bildschirm und der Satz in «Abrechnungen erstellen»: «Dwello zieht das vereinbarte Akonto ab; fehlende Zahlungen regeln Sie ausserhalb der Abrechnung.» Das ist genau die Frage, die ich hatte.
10. **Bedenken?** Kosten, Datenschutz, Recht: wie in Runde 2 beantwortet (FAQ, Abschnitt Datenschutz). Installation: klarer, weil der Technikteil zu ist und «Updates und regelmässige Datensicherungen macht diese Person; die Anleitung beschreibt sie» dasteht. Offen: mit welcher E-Mail und welchem Passwort ich mich anmelde (P-4), dass die Anleitung englisch ist, und dass die Demo ein Google-Konto verlangt.
11. **Glaube ich Datenschutz und «gratis»? 5/5 (vorher 4).** Mein Abzug war, dass ich mich bei Google anmelden musste; jetzt gibt es ein eigenes Konto mit Passwort, Google nur wenn ich will. «Gratis heisst bei Dwello: offen, ohne Haken» mit «kein Premium-Abo» glaube ich.

### D. Weg zum Start

12. **Weiss ich, wie anfangen? 4/5 (wie Runde 2).** So verstehe ich es: (1) Demo ansehen. (2) Jemanden aus Familie oder Bekanntenkreis bitten und ihm die Anleitung geben; rund eine Stunde. (3) Einmal zu Beginn: Gebäude, Wohnungen, Mieter, Mietverträge mit Nebenkosten und Akonto. (4) Januar bis Dezember: Rechnungen hochladen, sobald sie kommen. (5) Im neuen Jahr: Abrechnungen erstellen. (6) Gleich danach: prüfen und versenden. Die Monatsangaben machen das Jahr greifbar. Abzug, weil die Anleitung englisch ist und ich nicht weiss, mit welchem Konto ich mich nach der Einrichtung anmelde (P-4).
13. **Installation selbst?** Nein, mein Cousin aus der Informatik. Ich traue mich jetzt aber eher, ihn zu fragen, weil die Seite mir die Befehle nicht mehr vor die Nase hält und klar sagt, dass er auch die Updates und Sicherungen macht.
14. **Gefunden, was gesucht? 4/5 (wie Runde 2).** Navigation, Sprachen, Impressum und Datenschutzerklärung sind da, die Anleitung lädt jetzt. Abzug wie damals für die vier Namen desselben Abschnitts.

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? 4/5 (wie Runde 2).** Grosse Schrift, grosse Knöpfe, auf dem Handy kein seitliches Scrollen (Breite 390), der Befehlsblock schneidet nicht mehr ab, weil er zu ist. Die Animationsknöpfe sind gut zu treffen. Abzug für den winzigen Brief auf dem Desktop (P-2).
16. **Länge?** Jetzt passend. Ich habe bis zu den «Häufigen Fragen» gelesen; Open Source und Roadmap danach nur überflogen. Vorher hatte ich bei den Funktionskacheln aufgehört.

### F. Gesamturteil

17. **Ausprobieren? 4/5 (wie Runde 2).** Ja, erst die Demo, dann mit meinem Cousin. Abzug, weil der Start weiter von einer zweiten Person abhängt (das ist ehrlich, aber so).
18. **Empfehlen? 4/5 (wie Runde 2).** Einer Bekannten mit einer Wohnung und jemandem mit Computerkenntnissen: ja.
19. **Erste Änderung:** Die Animation «Ablauf abspielen» bis zum Ende zeigen: nach «Bitte prüfen» ein kurzer Satz, warum (zum Beispiel «Datum unsicher gelesen»), dann «Bestätigen» und «Rechnung erstellt», und dabei links Schritt 1, 2, 3 mitleuchten lassen (P-1). Dann sehe ich, dass ich entscheide.

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? 4/5 (vorher 2 im Bilder-Bericht, 3 in Runde 2).** Wärmer: der Brief statt Programmfenster, die Strichzeichnung Haus → Abrechnung → Briefumschlag, «Ihr Vermieterjahr» mit Monaten, Hans Müller und Maria Rossi mit Namen, kein schwarzes Terminal, keine Pixelzahlen mehr. Kühl wirken noch der grosse dunkelblaue Datenschutz-Block und die riesige «0.–» bei Open Source; Menschen kommen nur als Namen vor, das reicht mir aber.
21. **Fehlen Bilder?** Nein, keine Fotos nötig. Die Kombination Brief + Zeichnung + zwei Animationen trifft, was ich im Bilder-Bericht wollte. Was mir noch helfen würde: das Bild der Übersicht «Als Nächstes zu tun» (P-5) und der Brief so gross, dass ich ihn lesen kann (P-2). Stockfotos würden weiterhin nicht helfen.
22. **Wo würde eine Animation etwas erklären?** Zwei meiner Wünsche sind umgesetzt («Rechnungen per Drag & Drop» und die Liftverteilung). Was ich verstanden habe: *Ablauf*: eine Rechnung fliegt hinein, nacheinander füllen sich Rechnungssteller «Wasserversorgung Zürich», Betrag CHF 930.00, Datum 31.03.2025 und Kategorie «Kaltwasser», am Schluss erscheint beim Datum «Bitte prüfen». Die KI liest also für mich, und ich soll etwas kontrollieren; was und wie, bleibt offen (P-1). *Verteilung*: der Lift mit CHF 1'690.00 erscheint als Balken, darunter kommen nacheinander sechs Wohnungen mit je 281.67, am Schluss ist 1.01 (Hans Müller) hervorgehoben. Ich habe verstanden: «pro Einheit» heisst jede Wohnung gleich viel. Noch erklären würde eine Animation: dieselbe Verteilung nach Fläche (grosse Wohnung trägt mehr) und das Heizprofil im Winter (P-3), und im Abschnitt «Eine Abrechnung, die jede Zahl erklärt» der QR-Zahlteil, der auf «bezahlt» springt.
23. **Wo würde Bewegung stören?** Es hat sich nichts von selbst bewegt, so ist es richtig. Die zwei Animationen sind kurz, halten auf «Anhalten» an und laufen nur einmal. Stören würde Bewegung weiterhin im ersten Bildschirm, im Datenschutz-Block, in den Fragen und bei einer selbst startenden Wiederholung.
24. **Drei Ideen für mehr Wärme:** (1) Den Brief im ersten Bildschirm lesbar machen oder mit einer Bildunterschrift «Hans Müller zahlt für 2025 CHF 215.80 nach, mit diesem Einzahlungsschein» versehen. (2) Die Ablauf-Animation mit dem Bestätigen enden lassen, mit einem Satz in Ich-Form: «Sie sehen, was die KI gelesen hat, und bestätigen.» (3) Im Abschnitt «Einrichten» einen kleinen Kasten «Das macht Ihre Helferin / Das machen Sie» mit dem Satz, mit welcher E-Mail und welchem Passwort Sie sich danach anmelden.

## «Kann ich das überhaupt?» – früher beantwortet?

Ja, etwas früher und vor allem ruhiger. Der Satz «Die Einrichtung macht einmal jemand, der sich mit Computern auskennt» stand schon in Runde 2 im ersten Bildschirm. Neu ist: Die Seite ist ein Drittel kürzer, ich komme nach sechs statt etwa neun Bildschirmen zu «Einrichten lassen, dann im Browser arbeiten.», und dort erschreckt mich kein Terminal mehr. Die Monate in «Vier Schritte» und der Brief zeigen mir vorher schon, dass meine eigene Arbeit überschaubar ist.

## Aufgabe geschafft: ja

Fragebogen 1–24 beantwortet, beide Animationen gespielt, angehalten und weiter abgespielt, auf Desktop und Handy, Französisch kurz verglichen.

## Aufwand

Rund 20 Minuten, etwa 16 Schritte: erster Bildschirm, 13 Bildschirme scrollen, Ablauf abspielen / anhalten / weiter, Verteilung abspielen, Technikteil aufklappen, sechs FAQ öffnen, Anleitung und Demo öffnen, Handy erster und zweiter Bildschirm, beide Animationen auf dem Handy, Französisch erster Bildschirm.

## Ablauf

1. **Erster Bildschirm Desktop** (`01-desktop-first.png`). Erwartet: worum es geht. Gesehen: Titel «Ihre Nebenkostenabrechnung, einfacher gemacht.», Text «Ihre Mieter bekommen einen Brief wie diesen», rechts ein Briefblatt und ein QR-Zahlteil, darunter «Demo ansehen», «So kommen Sie zu Dwello» und der Satz zur Einrichtung. Klar; der Brief ist aber zu klein zum Lesen (`03-hero-brief.png`).
2. **Ihr Vermieterjahr** (`101-scroll.png`). Erwartet: wie das Jahr aussieht. Gesehen: Zeichnung Haus → Blatt → Umschlag, vier Karten mit «Einmal, zu Beginn», «Januar bis Dezember», «Im neuen Jahr», «Gleich danach»; Akonto und Hans Müller / Maria Rossi genannt. Genau, was ich mir gewünscht hatte.
3. **So sieht Dwello aus / Rechnungen und KI** (`102-scroll.png`, `20-ablauf-vorher.png`). Erwartet: ein Bild des Uploads. Gesehen: drei nummerierte Schritte, rechts Knopf «Ablauf abspielen» über einer Karte mit dem Endzustand; darüber leerer Platz (P-6).
4. **Ablauf abspielen** (`21-ablauf-*.png`, `22-ablauf-strip.png`, `23-ablauf-links.png`). Erwartet: Rechnung rein, KI liest, ich bestätige. Gesehen: Knopf wird «Anhalten», Beleg gleitet herein, Felder füllen sich nacheinander, am Ende «Bitte prüfen» beim Datum, Knopf «Nochmals abspielen». Kein Bestätigen, Schritte links leuchten nicht mit (P-1).
5. **Anhalten** (`24-ablauf-pausiert.png`). Erwartet: es bleibt stehen. Gesehen: nach «Anhalten» steht «Wasserversorgung Zürich» halb eingeblendet still, Knopf «Weiter abspielen»; danach läuft es zu Ende.
6. **Abrechnung** (`104-scroll.png`). Gesehen: Bildschirmfoto der Abrechnung mit Lift CHF 1'690.00 / 281.67, Text mit Hans Müller CHF 215.80, Art. 257a OR, Rundung auf 5 Rappen. Verständlich.
7. **Verteilung abspielen** (`30-verteilung-vorher.png`, `32-verteilung-strip.png`). Erwartet: wie sich Kosten aufteilen. Gesehen: vorher steht das Endbild schon; nach Klick verschwindet es, der Balken «Lift CHF 1'690.00» erscheint, dann nacheinander sechs Kästchen à 281.67, 1.01 hervorgehoben. Verstanden, aber nur der Fall «pro Einheit» (P-3).
8. **Was in Dwello steckt** (`105-`, `106-scroll.png`). Gesehen: vier Kacheln (Dunkelmodus, Mietverträge, Dokumente, Gebäuderegister). Kurz, gut.
9. **Einrichten** (`106-`, `107-scroll.png`, `40-einrichten-offen.png`). Erwartet: was ich tun muss. Gesehen: «Einrichten lassen, dann im Browser arbeiten.», wer es macht, eine Stunde, Updates und Sicherungen macht die Person, Knopf «Anleitung zum Weitergeben (Englisch)», darunter zugeklappt «Für die Person, die einrichtet: die Befehle +». Aufgeklappt: Tabs, Terminal, «Ideal für den Start», «Anmeldung mit Passwort» (P-4).
10. **Datenschutz, Einfach zu bedienen** (`107-`, `108-scroll.png`). Gesehen: dunkler Block mit fünf Punkten; danach vier Punkte ohne Zahlen («Grosse Schaltflächen», «Lesbar bei Sonne und im Dunkeln» …). Gut lesbar.
11. **Fragen** (`109-scroll.png`). Alle sechs aufgeklappt; kurze, klare Antworten.
12. **Open Source, Roadmap, Schluss** (`110-` bis `113-scroll.png`). Gesehen: «0.– CHF pro Jahr», AGPL, Roadmap mit fünf Punkten, Schluss «Die nächste Abrechnung machen Sie mit Dwello.»
13. **Anleitung und Demo** (`70-anleitung.png`, `71-demo.png`). Anleitung öffnet GitHub (englisch, ohne Gestaltung in meiner Umgebung); Demo zeigt die Anmeldung mit «Mit Google anmelden».
14. **Handy** (`50-mobile-first.png`, `51-mobile-second.png`). Erster Bildschirm: Titel, Text, beide Knöpfe, Einrichtungssatz; der Brief kommt im zweiten Bildschirm, gross und fast lesbar, darunter der QR-Zahlteil. Kein seitliches Scrollen.
15. **Animationen auf dem Handy** (`52-mobile-ablauf-ende.png`, `53-`, `54-mobile-verteilung-*.png`). Beide per Tippen gestartet, beide laufen und enden gleich wie auf dem Desktop; die sechs Kästchen passen in eine Reihe.
16. **Französisch** (`60-fr-first.png`). Gleiche Aussage, französischer Brief (Pierre Dubois, CHF 142.35); Navigation bricht zweizeilig um.

## Verwirrung

- «Bitte prüfen» am Ende der Animation: was soll ich am Datum prüfen, und wie geht es weiter?
- «Verteilung abspielen»: das Bild steht schon da, bevor ich klicke; ich dachte zuerst, der Knopf tue nichts.
- «Gerecht verteilt, auch im Winter» und dann sechs gleiche Beträge: wo ist der Winter?
- «Bei der Einrichtung wird ein Konto mit E-Mail-Adresse und Passwort angelegt»: meine Adresse oder die meines Cousins?
- «Akonto», «Leistungszeitraum», «Mietstage»: ohne Erklärung auf der Seite.
- «Einrichten», «Installieren», «So kommen Sie zu Dwello», «Dwello einrichten lassen»: ein Ort, vier Namen.
- 6 × 281.67 = 1'690.02: wohin gehen die zwei Rappen?

## Fehlerrisiken

- Ich glaube nach der Ablauf-Animation, die KI erstelle die Rechnung allein, weil das Bestätigen nicht gezeigt wird.
- Mein Cousin legt das Konto mit seiner E-Mail-Adresse an, weil die Seite mir nicht sagt, dass es meines sein soll; zieht er weg, komme ich nicht hinein (befürchtet, nicht geprüft).
- Ich klicke «Demo ansehen», sehe nur «Mit Google anmelden» und gebe auf, weil ich kein Google-Konto will.

## Vorschläge

- **P-1:** Desktop, `index.html` → «Rechnungen und KI» → «Ablauf abspielen», bis «Nochmals abspielen» warten. Hilft: nach «Bitte prüfen» ein Satz, was unsicher ist, dann ein Bestätigen und «Rechnung erstellt»; Schritte 1–3 links im Takt hervorheben.
- **P-2:** Desktop 1440 × 900, erster Bildschirm, Brief rechts. Hilft: Brief grösser oder anklickbar zum Vergrössern, oder eine sichtbare Bildunterschrift «Abrechnung 2025 von Hans Müller: Nachzahlung CHF 215.80, mit QR-Zahlteil».
- **P-3:** «Verteilschlüssel und Heizprofile» → «Verteilung abspielen». Hilft: vor dem Klick einen Ausgangszustand zeigen (nur der Liftbalken), und eine zweite Runde «nach Fläche» oder «Heizung im Januar», damit die Überschrift stimmt.
- **P-4:** «Einrichten» → «Für die Person, die einrichtet: die Befehle» aufklappen → Absatz «Anmeldung mit Passwort». Hilft: den Satz ausserhalb des zugeklappten Teils in den Text für mich, mit «Ihre E-Mail-Adresse, Ihr Passwort».
- **P-5:** «So sieht Dwello aus». Hilft: das Bild der Übersicht mit «Als Nächstes zu tun» wieder zeigen, zum Satz «Die Übersicht sagt Ihnen, was als Nächstes zu tun ist».
- **P-6:** Desktop, «Rechnungen und KI», rechte Spalte. Hilft: Knopf und Karte oben neben der Überschrift ausrichten.

## Nicht geprüft

- Die Anleitung inhaltlich: GitHub lädt in meiner Umgebung ohne Gestaltung, und sie ist englisch; ich beurteile nur die Seite.
- Die Demo nach der Anmeldung: sie verlangt Google, das habe ich nicht.
- Italienisch, Englisch, Dunkelmodus der Seite: nicht Teil der Aufgabe.
- Französisch nur der erste Bildschirm und die Knopfnamen, nicht die ganze Seite.
- Bildschirmleser und Tastatur: nicht meine Eingabeart (Sven); mir fiel nur auf, dass das Statusfeld der Seite während der Animationen leer bleibt.
