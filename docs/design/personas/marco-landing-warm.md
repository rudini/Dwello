# Marco – Landing Page, überarbeitet («wärmer»)

Persona: Marco, 38, angestellt, fast nur auf dem Handy, wenig Zeit. Gerät: Handy 390 × 844, Touch (persona-kit `open({ viewport: 'mobile' })`, Tippen mit `tap()`), Seite `http://localhost:3310/index.html` (Deutsch). Keine Anmeldung, nichts gespeichert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/3c9dac53-14ca-581f-8cfc-25c133ff3cbc/scratchpad/marco-landing-warm/`.

Aufgabe: die überarbeitete Website beurteilen (Brief mit QR-Zahlteil oben, keine Kennzahlen-Leiste mehr, zwei Animationen auf Knopfdruck, Befehle hinter «Für die Person, die einrichtet: die Befehle», «Einfach zu bedienen» ohne Technik-Zahlen, Open Source und Roadmap nach den Fragen, Menü mit «Fragen» vor «Open Source»), den Fragebogen 1–24 beantworten, Seitenhöhe und geladene Bytes messen und mit `marco-landing-2.md` und `marco-landing-kompakt.md` vergleichen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Erster Bildschirm | Auf meinem Handy ist der Brief nicht im ersten Bildschirm. Der Absatz endet mit «Ihre Mieter bekommen einen Brief wie diesen.», aber bis 844 px sehe ich nur Titel, Text, zwei Knöpfe und den Kleintext. Vom Brief ist ganz unten nur eine dünne Kante zu sehen, er beginnt bei 841 px. Erst nach einem Wischen sehe ich ihn. |
| P-2 | Minor | «Rechnungen und KI», Animation «Ablauf abspielen» | Die Animation zeigt nur, wie sich die Felder füllen (Rechnungssteller, Betrag, Datum mit «Bitte prüfen», Kategorie). Wie die Rechnung hineingezogen und am Schluss bestätigt wird, sehe ich nicht, obwohl die Liste 1–2–3 darüber genau diese Schritte nennt. Die Liste steht rund 360 px über dem Knopf, ist beim Abspielen nicht mehr im Bild und reagiert nicht mit. |
| P-3 | Minor | «Einrichten lassen, dann im Browser arbeiten.» (Installieren) | Der Satz, der für mich am wichtigsten ist, steht jetzt hinter dem Aufklapper für den Helfer: «Gut zu wissen: Dwello läuft nur, wenn Ihr PC an ist. Für den Zugriff vom Handy eignet sich ein Homeserver.» Offen sichtbar steht weiter unten dagegen «Ganz auf dem Handy: Jede Seite passt aufs Handy». Ohne Aufklappen glaube ich also, dass es auf dem Handy in jedem Fall geht. |
| P-4 | Nit | «Gerecht verteilt, auch im Winter.», Animation «Verteilung abspielen» | Die sechs Kästchen 1.01 bis 3.02 erscheinen nacheinander mit je 281.67, und am Schluss wird 1.01 umrandet. Der Balken «Lift CHF 1'690.00» bleibt aber gleich, das Teilen selbst sieht man nicht. Warum 1.01 hervorgehoben wird, steht nur im Satz darüber («auch die Wohnung 1.01 von Hans Müller»). Verstanden habe ich es trotzdem. |

## Beobachtungen

- **Nichts bewegt sich von selbst.** Vor dem Tippen laufen auf der Seite keine Animationen: Die Liste der laufenden Animationen im Browser war leer, und zwei Bildschirmfotos im Abstand von 3 s waren gleich, vor dem Abspielen wie danach. Ohne Tippen zeigen beide Karten schon den Endzustand, ich verpasse also nichts, wenn ich nicht tippe.
- **Ablauf abspielen:** Nach dem Tippen wird die Karte leer, dann füllen sich in rund 4 s nacheinander «Wasserversorgung Zürich», «CHF 930.00», «31.03.2025» mit dem gelben Schild «Bitte prüfen» und «Kaltwasser». Der Knopf heisst dabei «Anhalten», danach «Nochmals abspielen». Antippen von «Anhalten» hält die Animation an, der Knopf heisst dann «Weiter abspielen» und spielt sie zu Ende. So habe ich verstanden: Die KI liest die Rechnung und sagt mir, was ich prüfen soll.
- **Verteilung abspielen:** Das läuft rund 2,5 s, Knöpfe und Pausieren funktionieren gleich. So habe ich verstanden: Die CHF 1'690.00 für den Lift werden auf sechs Wohnungen zu je CHF 281.67 verteilt.
- **Lesbarkeit der Karten auf dem Handy:** Beide Karten sind gut lesbar. Die Rechnungskarte hat fette Werte in normaler Schriftgrösse, die Kästchen zeigen 281.67 in 14 px und passen zu sechst in eine Zeile, ohne seitliches Scrollen. Beide Knöpfe sind 48 px hoch. Die Kästchen sehen nicht mehr wie Knöpfe aus, das war in Runde 2 noch so.
- **Menü:** Der Knopf «Menü» ist 83 × 48 px gross. Darin stehen Funktionen, Einrichten, Datenschutz, Fragen, Open Source, Impressum und Deutsch/Français/Italiano/English, alle 48 px hoch, «Deutsch» ist markiert. Nach dem Tippen auf «Fragen», «Open Source», «Einrichten» oder «Funktionen» scrollt die Seite weich zum Abschnitt, das Menü geht zu und die Überschrift steht unter der Kopfzeile. Tippen auf eine freie Fläche schliesst das Menü auch. Mein P-1 aus Runde 2 ist damit erledigt.
- **Seitlich:** Die Seite ist 390 px breit (scrollWidth 390), auch mit aufgeklappten Befehlen. Nur die Befehlszeilen im schwarzen Kasten sind in sich breiter, und das ist dort in Ordnung.
- **Brief im Hero:** Nach einem Wischen kann ich «Nebenkostenabrechnung 01.01.2025 – 31.12.2025», «Nachzahlung CHF 215.80» und den Kasten mit dem Zahltext lesen, die Kostentabelle ist zu klein. Den QR-Zahlteil erkenne ich als Einzahlungsschein mit QR-Code und «CHF 215.80». Das ist viel besser als die winzige Desktop-Übersicht von früher (mein P-2 aus Runde 2).
- **Das eine Bild der App** bei «Eine Abrechnung, die jede Zahl erklärt.» ist immer noch ein verkleinerter Desktop-Bildschirm, die Tabelle ist unlesbar. Titel und «Abrechnung NK-11111111-2025-0001» gehen.
- **Befehle versteckt:** Der Aufklapper «Für die Person, die einrichtet: die Befehle +» ist 358 × 48 px gross. Erst darin stehen die Tabs, `git clone`, `docker compose` und die Kästchen «Sie brauchen», «Zeitaufwand» und «Gut zu wissen». Für mich als Nicht-Techniker ist der Abschnitt jetzt viel ruhiger (siehe aber P-3).
- **«Einfach zu bedienen»** hat keine «48 px», «7 : 1» und «390 px» mehr, nur noch Sätze wie «Grosse Schaltflächen: Gut zu treffen, mit dem Finger und mit der Maus.» Das verstehe ich.
- **Reihenfolge:** Die Fragen kommen jetzt vor Open Source und Roadmap, so finde ich die Antworten früher. Die erste Frage, «Brauche ich technische Kenntnisse?», ist schon offen.
- **Kleine Tippziele (wie früher):** Die Links in der Fusszeile sind 19 px hoch, DE/FR/IT/EN unten 38 px, «Kopieren» 36 px, die Roadmap-Links 26 px und «#579» 20 px.
- **Wiederholungen (aus «kompakt»):** Der Hinweis «jemand, der sich mit Computern auskennt» steht noch dreimal: im Kleintext im Hero, bei «Installieren» und in der ersten Frage. «Gratis» kommt im Schild, im Hero, bei «0.– CHF pro Jahr» und in der Frage vor. Die Kennzahl-Leiste ist weg, deshalb ist es weniger als vorher.
- **Fachwörter, die noch offen sichtbar sind:** «Drag & Drop», «Lokale KI mit Ollama», «OpenAI-kompatible KI» (Rechnungen und KI), «AGPL-3.0-or-later» (Open Source) und «MCP-Server» (Roadmap).
- **Netzwerk:** Alle Anfragen gingen nur an `localhost:3310`, es gibt keine fremden Server. Das Laden dauerte bis zum load-Ereignis rund 0,16 s.

## Messung

- **Seitenhöhe:** 15 922 px, also 18,9 Bildschirme zu 844 px. Zum Vergleich: In Runde 2 waren es rund 25 900 px (31 Bildschirme), in «kompakt» 17 598 px (21 Bildschirme).
- **Erste Ansicht** (Seite geladen, nicht gescrollt): 4 Anfragen mit zusammen 254 378 Bytes (rund 248 KiB). Davon `index.html` mit 70 192 Bytes, `shots/pdf-page-1.webp` mit 75 314, `shots/pdf-qr-part.webp` mit 60 616 und `fonts/inter-latin.woff2` mit 48 256. Der Server komprimiert nicht, die Bytes sind also die übertragene Menge. Der QR-Zahlteil wird gleich mitgeladen, obwohl er erst bei rund 1 366 px steht.
- **Ganze Seite durchgewischt:** Dazu kommt noch `shots/statement-light.webp` mit 53 132 Bytes. Das macht 5 Anfragen und 307 510 Bytes (rund 300 KiB). Die Animationen brauchen keine eigene Datei.

## Fragebogen

### A. Erster Eindruck (erster Bildschirm, ca. 8 Sekunden)

1. **Was ist Dwello?** Ein Gratis-Programm, das mir die Nebenkostenabrechnung macht: Rechnungen hineinziehen, prüfen und den Mietern einen Brief mit QR-Rechnung schicken. (Hero: Titel «Ihre Nebenkostenabrechnung, einfacher gemacht.» und der Absatz darunter.)
2. **Für wen? Angesprochen? 5/5.** Gleich wie in Runde 2. «für private Vermieterinnen und Vermieter» steht im ersten Satz, und der Titel ist genau meine Jahresaufgabe.
3. **Was als Nächstes anklicken?** Zuerst wische ich einmal, weil der Satz «einen Brief wie diesen» mich neugierig macht und der Brief noch nicht im Bild ist (P-1). Danach tippe ich auf «Demo ansehen», den dunklen Hauptknopf.
4. **Vertrauenswürdig und seriös? 5/5** (vorher 4). Der echte Brief mit «Nachzahlung CHF 215.80» und dem Schweizer QR-Zahlteil wirkt wie ein Schreiben, das ich selber verschicken würde. Das überzeugt mehr als die frühere Übersicht der App. Einen Absender gibt es zwar erst in der Fusszeile, aber das stört mich nicht mehr.

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? 4/5** (gleich). Die Befehle und die Technik-Zahlen sind aus dem Blick, und «Einfach zu bedienen» spricht jetzt Alltagssprache. Offen sichtbar bleiben aber «Drag & Drop», «Ollama» und «OpenAI-kompatible KI» bei «Rechnungen und KI», dazu «AGPL-3.0-or-later» und «MCP-Server» weiter unten.
6. **Heute oder geplant? 5/5** (gleich). «Was in Dwello steckt» zeigt nur, was es gibt, und «Was als Nächstes kommt.» sagt klar «Diese Punkte sind geplant». Das ist sauber getrennt.
7. **Zeigen die Bilder die Arbeit? 4/5** (vorher 3). Der Brief und die zwei Animationskarten sind in Handygrösse lesbar und zeigen echte Werte (Wasserversorgung Zürich, CHF 930.00, Lift 281.67). Abzug, weil das einzige Bild der App bei «Eine Abrechnung, die jede Zahl erklärt.» noch eine unlesbare Desktop-Tabelle ist.

### C. Nutzen und Bedenken

8. **Welches Problem gelöst, welches nicht?** Gelöst: Belege übers Jahr sammeln, die KI liest sie, tagesgenaue Abrechnung, ein Brief mit QR-Rechnung in der Sprache des Mieters, dazu Mahnungen. Nicht gelöst und erwartet: Dass ich es ohne Helfer starte und sicher unterwegs auf dem Handy nutzen kann. Berichte für die Steuer sind erst geplant.
9. **Was überzeugt am meisten?** Der Brief oben, genau so ginge er an Hans Müller. Dazu die Verteilung des Lifts in sechs Kästchen, die ich auf einen Blick nachrechnen kann.
10. **Bedenken? Beantwortet?** Kosten: beantwortet, in der Frage «Kostet Dwello wirklich nichts?» (Server oder Strom, Porto, eine externe KI). Datenschutz: beantwortet («Kein Tracking», «nichts geht an uns», die Liste, was trotzdem nach aussen geht). Installation: ehrlich beantwortet, jemand braucht rund eine Stunde. Ob ich danach auf dem Handy arbeiten kann, steht nur noch im aufgeklappten Teil (P-3). Hilfe: Wen ich frage, wenn ich niemanden habe, sagt die Seite weiterhin nicht. Rechtssicherheit: Die Frage «Ist Dwello rechtlich geprüft?» ist ehrlich und nennt HEV und Schlichtungsbehörde.
11. **Datenschutz und «gratis» glaubhaft? 4/5** (gleich). Die Seite sagt offen, was doch nach aussen geht, und die Seite selbst lädt nur von ihrem eigenen Server. Abzug wie früher wegen der Google-Anmeldung, die zu «nichts geht an uns» etwas quer steht.

### D. Weg zum Start

12. **Wissen Sie, wie anfangen? 4/5** (gleich). So habe ich es verstanden: 1. die Demo ansehen, 2. jemandem die «Anleitung zum Weitergeben (Englisch)» geben, 3. diese Person richtet es in rund einer Stunde ein, 4. ich erfasse das Gebäude und lade das Jahr über Rechnungen hoch, 5. im neuen Jahr erstelle ich die Abrechnung und verschicke sie. Abzug, weil ich nicht weiss, welche Variante ich wählen muss, damit es auf dem Handy geht (P-3).
13. **Installation selbst?** Nein. Ich gebe den Link und den Aufklapper «Für die Person, die einrichtet: die Befehle» meinem Schwager. Dass ich die Befehle jetzt nicht sehen muss, ist angenehm.
14. **Gefunden, was gesucht? 5/5** (vorher 4). Das Menü geht nach dem Tippen zu, springt sauber zum Abschnitt, und die Reihenfolge Fragen vor Open Source passt zur Seite. Sprachwahl, Impressum und Datenschutzerklärung sind da.

### E. Bedienung und Darstellung (Handy, Touch)

15. **Lesbar und bedienbar? 4/5** (gleich). Die Schrift ist gross und kontrastreich, die Knöpfe haben 48 px, nichts scrollt seitlich, und die Animationskarten sind gut lesbar. Abzug für die kleinen Fusszeilen-Links (19 px), die Sprachkürzel unten (38 px) und die kleine Tabelle im Brief und im Bild der App.
16. **Länge?** Passender: 18,9 Bildschirme statt 31 und 21. Wirklich gelesen habe ich bis zur Verteilung des Lifts. «Was in Dwello steckt», «Datenschutz» und «Einfach zu bedienen» habe ich überflogen, die Fragen wieder gelesen. Open Source und Roadmap habe ich nur noch angeschaut, und das ist richtig so, weil sie jetzt am Schluss stehen.

### F. Gesamturteil

17. **Ausprobieren? 4/5** (gleich). Die Demo sofort. Ob ich Dwello einrichten lasse, hängt weiter am Helfer und an der Frage, ob es dann auf dem Handy geht.
18. **Empfehlen? 4/5** (gleich). Einem Kollegen mit ein paar Wohnungen und einem IT-Menschen in der Familie: ja.
19. **Die eine Sache zuerst ändern:** Den Handy-Hinweis aus dem Aufklapper holen und als Satz in die Einleitung von «Installieren» setzen (P-3). Gleich danach: den Brief auf dem Handy so weit nach oben holen, dass er im ersten Bildschirm anfängt (P-1).

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? 4/5** (vorher 3). Wärmer, weil oben ein echter Brief an einen Menschen steht und keine Zahlen-Kacheln mehr da sind. Die Strichzeichnungen Haus → Blatt → Briefumschlag und das Haus mit dem Server beim Datenschutz wirken freundlich. Etwas kühl bleiben das viele Grau-Weiss und der dunkle Datenschutz-Block.
21. **Fehlen Bilder?** Nein. Menschenfotos brauche ich weiter nicht. Der Brief und die zwei Karten zeigen genau, was ich wissen will. Hilfreich wäre noch ein Handy-Bildschirm der App statt des verkleinerten Desktop-Bilds bei der Abrechnung. Stockfotos würden mich misstrauisch machen.
22. **Wo würde Animation erklären?** Bei «Rechnungen und KI» und «Gerecht verteilt, auch im Winter.» gibt es sie jetzt, genau dort, wo ich sie in Runde 2 vorgeschlagen hatte. Bei den Rechnungen fehlen der Anfang (hineinziehen) und das Ende (bestätigen) (P-2), bei der Verteilung das sichtbare Teilen (P-4). Eine dritte Stelle wäre «Vier Schritte. Einmal im Jahr.»: Haus → Blatt → Brief nacheinander, ebenfalls nur auf Knopfdruck.
23. **Wo würde Bewegung stören?** Im ersten Bildschirm, im Installationsteil und in den Fragen. So wie es jetzt ist, stört nichts: Nichts läuft von allein, jede Animation dauert nur 2,5 bis 4 s und lässt sich anhalten, und sie kostet keine zusätzlichen Bytes.
24. **Drei Ideen für mehr Wärme:** 1. Den Brief auf dem Handy in den ersten Bildschirm holen, etwa den oberen Teil mit «Nachzahlung CHF 215.80» gleich unter dem Titel (P-1). 2. Eine kurze Geschichte einer Vermieterin in zwei Sätzen bei «Vier Schritte», zum Beispiel «zwei Wohnungen in Luzern, früher Excel, jetzt 30 Minuten im Frühling». 3. Am Ende der Rechnungs-Animation ein grüner Haken mit «Bestätigt»: Damit wirkt die Karte wie mein eigener Erfolg und nicht wie ein Formular (P-2).

### Vergleich mit früheren Noten (`marco-landing-2.md`; `marco-landing-kompakt.md` hatte keine Noten)

- **Frage 4: von 4 auf 5.** Der echte Brief mit QR-Zahlteil ersetzt die unlesbare Desktop-Übersicht und wirkt seriös und schweizerisch.
- **Frage 7: von 3 auf 4.** Brief und Animationskarten sind auf dem Handy lesbar. Ein Desktop-Bild bleibt unlesbar.
- **Frage 14: von 4 auf 5.** Das Menü bleibt nicht mehr offen und verdeckt nichts mehr (früher P-1).
- **Frage 20: von 3 auf 4.** Statt Kennzahlen («48 px», «7 : 1») gibt es Brief, Zeichnungen und Beispiele mit Namen.
- Alle anderen Noten sind gleich geblieben.

## Aufgabe geschafft

ja

## Aufwand

Rund 25 Minuten, 8 Durchgänge: Messung der ersten Ansicht, 19 Bildschirme durchgewischt, beide Animationen je einmal ganz abgespielt (dazu der Ruhe-Vergleich vorher und nachher), «Ablauf abspielen» mitten im Lauf angehalten und weiter abgespielt, Aufklapper «die Befehle» geöffnet, das Menü mit vier Sprüngen und dem Tippen ausserhalb geprüft, Tippgrössen gemessen.

## Ablauf

1. **Seite öffnen.** Erwartet: den Brief mit QR-Zahlteil im ersten Bildschirm. Gesehen: das Schild «Open Source · Gratis · Für die Schweiz», den Titel, einen Absatz, «Demo ansehen», «So kommen Sie zu Dwello» und den Kleintext. Vom Brief nur die oberste Kante am unteren Rand (P-1). Was Dwello ist, war trotzdem in unter 10 Sekunden klar.
2. **Einmal wischen.** Erwartet: den Brief. Gesehen: Seite 1 der Abrechnung von Hans Müller (Titel und «Nachzahlung CHF 215.80» lesbar, Tabelle nicht) und darunter den QR-Zahlteil als eigenes Bild.
3. **Weiter wischen.** Erwartet: wie die Arbeit abläuft. Gesehen: «Vier Schritte. Einmal im Jahr. Ohne Excel.» mit der Strichzeichnung Haus → Blatt → Brief und vier Karten mit Zeitangaben («Einmal, zu Beginn», «Januar bis Dezember», «Im neuen Jahr», «Gleich danach»). Kein Kennzahlen-Balken mehr. Gut.
4. **«Ablauf abspielen» antippen.** Erwartet: zu sehen, wie eine Rechnung in Dwello kommt. Gesehen: Die Karte leert sich, die Felder füllen sich nacheinander, «Bitte prüfen» erscheint beim Datum, nach rund 4 s ist alles fertig, und der Knopf heisst «Nochmals abspielen». Ohne Hineinziehen und ohne Bestätigen (P-2).
5. **Nochmals abspielen, nach 1 s «Anhalten».** Erwartet: Stopp. Gesehen: Der Lauf bleibt stehen, und der Knopf heisst «Weiter abspielen». Nach dem Tippen läuft er zu Ende.
6. **«Verteilung abspielen» antippen.** Erwartet: dass sich CHF 1'690.00 auf sechs Wohnungen aufteilen. Gesehen: Die Kästchen 1.01 bis 3.02 erscheinen in rund 2,5 s nacheinander mit 281.67, am Schluss ist 1.01 umrandet, und der Balken «Lift» bleibt gleich (P-4).
7. **Ruhe prüfen.** Erwartet: dass nichts von selbst läuft. Gesehen: Vor dem Tippen und nach dem Ende war 3 s lang nichts in Bewegung, und der Browser meldete keine laufenden Animationen.
8. **Zu «Einrichten lassen, dann im Browser arbeiten.»** Erwartet: was ich tun muss, ohne Befehle. Gesehen: einen Absatz für den Helfer, «Anleitung zum Weitergeben (Englisch)» und den Aufklapper «Für die Person, die einrichtet: die Befehle +». Nach dem Aufklappen: Tabs, Terminal und «Gut zu wissen: Dwello läuft nur, wenn Ihr PC an ist …» (P-3).
9. **Datenschutz, «Einfach zu bedienen», Fragen.** Erwartet: kurz und verständlich. Gesehen: das Haus mit dem Server als Zeichnung, «Kein Tracking» und vier Sätze ohne Technik-Zahlen. Bei den Fragen ist die erste schon offen, die anderen sind mit 64 bis 83 px hohen Zeilen gut zu treffen.
10. **Open Source, Roadmap, Schluss, Fusszeile.** Gesehen: «0.– CHF pro Jahr», fünf geplante Punkte, den Schlussblock mit «Demo ansehen» und «Dwello einrichten lassen» und die Fusszeile mit kleinen Links.
11. **Menü.** Erwartet: dass es aufgeht, springt und wieder zugeht. Gesehen: Genau so. Bei «Fragen», «Open Source», «Einrichten» und «Funktionen» steht die Überschrift jeweils direkt unter der Kopfzeile. Tippen ausserhalb schliesst das Menü.
12. **Seitlich.** Erwartet: kein seitliches Scrollen. Gesehen: Die Seite ist 390 px breit, auch beim Wischen zur Seite bewegt sie sich nicht.

## Verwirrung

- «Ihre Mieter bekommen einen Brief wie diesen.»: Welchen Brief? Auf dem ersten Bildschirm sehe ich keinen (P-1).
- «Ganz auf dem Handy» neben dem versteckten «Dwello läuft nur, wenn Ihr PC an ist»: Geht es nun auf dem Handy oder nicht? (P-3)
- In der Rechnungs-Animation erscheint «Bitte prüfen», aber nichts zeigt, wie ich prüfe oder bestätige (P-2).
- «Drag & Drop», «Ollama», «OpenAI-kompatible KI», «AGPL-3.0-or-later», «MCP-Server»: Diese Wörter sind für den Helfer, stehen aber offen da.
- «Heizprofil», «Verteilschlüssel», «Akonto»: Durch die Sätze und das Lift-Beispiel verständlich.

## Fehlerrisiken

- Ich lasse «Eigener PC» einrichten, weil dort «Ideal für den Start» steht, und merke erst danach, dass ich vom Handy aus nicht darauf komme (P-3).
- Ich halte die Rechnungs-Animation für den ganzen Ablauf und meine, die KI erstelle die Rechnung selbst. Der Text sagt das Gegenteil («Erst wenn Sie bestätigen …»), aber die Animation zeigt es nicht (P-2).
- Ich lese «einen Brief wie diesen», finde ihn nicht sofort und überspringe ihn beim schnellen Wischen (P-1). Das Risiko ist klein, weil er gleich danach kommt.

## Vorschläge

- **P-1:** Handy 390 × 844 → Seite öffnen, nicht scrollen. Man sieht Titel, Absatz, zwei Knöpfe und den Kleintext, der Brief beginnt erst bei 841 px. Hilft: auf schmalen Bildschirmen den oberen Teil des Briefs (bis «Nachzahlung CHF 215.80») direkt unter dem Titel zeigen oder den Kleintext unter den Knöpfen kürzen, damit der Brief ins Bild rückt. Sonst «wie diesen» ersetzen durch «einen Brief wie unten».
- **P-2:** Handy → zu «Rechnungen und KI» wischen → «Ablauf abspielen» antippen. Nur die Felder füllen sich, die Liste 1–2–3 steht ausserhalb des Bildes. Hilft: Die Animation mit «Rechnung gleitet in die Karte» beginnen und mit «Bestätigt» (Haken) enden. Dazu während des Laufs die Schritte 1, 2 und 3 als Text in der Karte zeigen oder die Liste direkt über den Knopf stellen.
- **P-3:** Handy → «Menü» → «Einrichten». Offen sichtbar ist nichts zur Handy-Nutzung, erst «Für die Person, die einrichtet: die Befehle +» zeigt «Dwello läuft nur, wenn Ihr PC an ist. Für den Zugriff vom Handy eignet sich ein Homeserver.» Hilft: einen Satz in der sichtbaren Einleitung, etwa «Wollen Sie auch vom Handy aus arbeiten, sagen Sie das der Person: Dann braucht es einen Homeserver oder Server statt des eigenen PCs.»
- **P-4:** Handy → zu «Gerecht verteilt» wischen → «Verteilung abspielen». Die Kästchen erscheinen, aber der Balken mit CHF 1'690.00 ändert sich nicht. Hilft: «÷ 6» zwischen Balken und Kästchen zeigen oder den Betrag im Balken beim Verteilen bis 0 herunterzählen lassen und an 1.01 kurz «Hans Müller» anschreiben.

## Nicht geprüft

- **Die Demo auf `demo.dwello.ch` und die GitHub-Links** (Anleitung, Issues, Quellcode): Das sind externe Seiten, sie sind nicht Teil der statischen Website und wurden nicht geöffnet.
- **«Kopieren» im Befehlskasten:** nicht angetippt. Die Zwischenablage zeigt das Testwerkzeug nicht verlässlich.
- **Einstellung «Bewegung reduzieren» des Handys:** Mein Handy hat sie aus. Ob die Animationen sie beachten, habe ich nicht geprüft.
- **Dunkelmodus und FR/IT/EN:** nicht Teil meines Auftrags.
- **Was ein Screenreader während der Animation ansagt:** nicht meine Eingabeart (Sven).
- **Ein echtes Mobilnetz:** Die Bytes sind von localhost gemessen, die Ladezeit über ein Mobilnetz ist geschätzt, nicht gemessen.
