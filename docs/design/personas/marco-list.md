# Marco, Abrechnungsliste auf dem Handy (list)

Persona: Marco, 38, Handy 390 × 844, Touch. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/2d6e0557-c7a1-50fc-8e2b-2c19ae995e43/scratchpad/marco-list/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Liste → Detail | Die Liste zeigt für Sarah Meier «01.01.2025 – 30.06.2025» und für Nina Brunner «01.07.2025 – 31.12.2025». Tippe ich die Zeile an, steht oben auf der Detailseite «Abrechnungsperiode 01.01.2025 – 31.12.2025». Ich weiss dann nicht mehr, welche Angabe stimmt. Erst ganz unten unter «Mieter und Wohnung» steht «181 Mietstage» bzw. «184 Mietstage». |
| P-2 | Minor | Liste | Der Seitentitel bricht auf 390 px mitten im Wort um: «Nebenkostenabrechnun / gen» (ohne Trennstrich). |
| P-3 | Nit | Liste | Eine Teilperiode (Einzug oder Auszug) sieht genau gleich aus wie ein ganzes Jahr. Dass Nina und Sarah nur ein halbes Jahr bezahlen, sehe ich nur, wenn ich die Daten genau lese. |

## Beobachtungen

- Ganze Zeile antippbar: Ich habe auf «Rückerstattung CHF 93.85» getippt, nicht auf den Namen, und bin trotzdem auf Ninas Abrechnung gelandet. Gut.
- Grössen der Tippziele in der Liste: Namenslink 324 × 48 px, «PDF» 111 × 48 px, «PDF noch nicht erstellt» 171 × 48 px, Statuskacheln 171 × 92 px. Alles gut zu treffen.
- Kein seitliches Scrollen: `scrollWidth` war 390 auf der Liste, auf der nach Seepark gefilterten Liste, auf Seite 2 und auf der Detailseite.
- Für den Gebäudefilter muss ich nach der Auswahl noch «Suchen» antippen. Auf dem Handy erwarte ich, dass die Liste nach der Auswahl gleich filtert.
- Es gibt keinen Filter nach Jahr. Mit «Seepark Residenz» sehe ich 7 Abrechnungen, 2025 und 2024 gemischt. Die 2025er stehen oben, deshalb ging es trotzdem.
- Auf der Detailseite bricht «TV/Kabelanschluss» in der Kostenaufstellung mitten im Wort um («TV/Kabelanschl / uss»). Das ist nicht die Liste.
- Während meines Laufs zeigte Anna Schmidt NK-11111111-2025-0002 in der Liste zuerst «PDF». Ein paar Minuten später stand dort «PDF noch nicht erstellt», und die Detailseite hatte «PDF erstellen». Vermutlich hat eine andere Persona diese Abrechnung geändert. Darum ist das kein Befund. Danach passten Liste und Detailseite zusammen.
- Die Links auf «PDF» zeigen in der Liste auf `/api/statements/<id>/pdf`, auf der Detailseite auf `/statements/<id>/pdf`. Für mich ist das egal, ich sehe es nur im Hintergrund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten, etwa 9 Tipps: Menü, «Nebenkostenabrechnungen», Gebäude «Seepark Residenz» wählen, «Suchen», scrollen und lesen. Dann zurück zur ganzen Liste, scrollen bis «PDF noch nicht erstellt» und antippen. Auf der Detailseite «PDF erstellen» gefunden.

## Ablauf

1. **Übersicht → Menü.** Erwartet: ein Menüpunkt «Abrechnungen». Gesehen: Das Menü (☰) hat unter «Nebenkosten» den Punkt «Nebenkostenabrechnungen». Ich habe zuerst «Abrechnungen» gesucht, ihn aber schnell gefunden.
2. **Liste.** Erwartet: eine Liste der Abrechnungen. Gesehen: Titel «Nebenkostenabrechnun-gen», mitten im Wort umgebrochen (P-2). Darunter «Abrechnungen erstellen», vier Statuskacheln (7 Entwurf, 1 Versendet, 9 Bezahlt, 0 Überfällig), Suche und Gebäudefilter. Die Liste beginnt erst unterhalb des ersten Bildschirms. 17 Abrechnungen auf 2 Seiten.
3. **Filter Seepark Residenz.** Erwartet: Nach der Auswahl filtert die Liste. Gesehen: Erst nach «Suchen» kommen 7 Abrechnungen (4 aus 2025, 3 aus 2024) und «Filter zurücksetzen».
4. **Nina Brunner und Sarah Meier.** Erwartet: Ich sehe, für welche Zeit jede abgerechnet wird. Gesehen: Jede Karte zeigt Name, Abrechnungsnummer, «Seepark Residenz, Wohnung A2», die Zeit, den Saldo und den Status.
   - Nina Brunner NK-22222222-2025-0003: **01.07.2025 – 31.12.2025**, Rückerstattung CHF 93.85, Entwurf.
   - Sarah Meier NK-22222222-2025-0002: **01.01.2025 – 30.06.2025**, Nachzahlung CHF 138.00, Entwurf.

   Das passt zu Einzug und Auszug. Gut lesbar, normale Schriftgrösse.
5. **Zur Kontrolle Ninas Abrechnung geöffnet** (Tipp auf den Betrag). Erwartet: dieselbe Zeit wie in der Liste. Gesehen: Oben steht «Abrechnungsperiode 01.01.2025 – 31.12.2025», weit unten «184 Mietstage». Bei Sarah ist es gleich: oben das ganze Jahr, unten «181 Mietstage» (P-1). Ich musste nachrechnen, um zu sehen, dass die Liste stimmt.
6. **Abrechnung ohne PDF suchen.** Erwartet: Eine Zeile zeigt, dass noch kein PDF da ist. Gesehen: Bei Anna Schmidt NK-11111111-2025-0002 steht statt «PDF» der unterstrichene Link «PDF noch nicht erstellt» (Screenshot `12-list-pdf-missing.png`: die Karte mit grauem Badge «Entwurf» und diesem Link darunter). Alle anderen Zeilen zeigen «PDF» mit Download-Symbol. Klar unterscheidbar.
7. **«PDF noch nicht erstellt» angetippt.** Erwartet: Ich komme dorthin, wo ich das PDF erstellen kann. Gesehen: Die Detailseite von Anna Schmidts Abrechnung, oben gleich unter dem Titel der Knopf «PDF erstellen» (182 × 48 px), darunter «Als versendet markieren» (Screenshot `13-anna-detail-top.png`). Ich habe nicht gedrückt, weil ich nur schaue.
8. **Seite 2** geprüft: nur bezahlte 2024er-Abrechnungen, alle mit «PDF», kein seitliches Scrollen.

## Verwirrung

- «Abrechnungsperiode» auf der Detailseite und die Zeit in der Liste widersprechen sich für mich (P-1). Ich verstehe nicht, ob «Abrechnungsperiode» das Jahr des Gebäudes meint oder die Zeit der Mieterin.
- «Mietstage» erklärt die Teilperiode, steht aber ganz unten und ohne Daten.
- Im Menü heisst es «Nebenkostenabrechnungen», auf der Übersicht und auf dem Knopf «Abrechnungen». Das ist kein grosses Problem.

## Fehlerrisiken

- Ich könnte wegen der Detailseite meinen, Sarah werde fürs ganze Jahr belastet, und beim Mieter nachfragen oder die Abrechnung löschen und neu erstellen (P-1).
- Ohne Jahresfilter könnte ich auf einem kleinen Bildschirm eine 2024er-Abrechnung mit einer 2025er verwechseln. Die Abrechnungsnummer und die Daten helfen, man muss aber genau lesen.

## Vorschläge

- **P-1:** Liste öffnen, «Seepark Residenz» filtern, «Sarah Meier NK-22222222-2025-0002» antippen. Oben steht «Abrechnungsperiode 01.01.2025 – 31.12.2025», in der Liste aber «01.01.2025 – 30.06.2025». Was helfen würde: Auf der Detailseite oben dieselbe Zeit wie in der Liste zeigen, z. B. «Abgerechnet: 01.01.2025 – 30.06.2025 (181 Mietstage) · Abrechnungsperiode 01.01.2025 – 31.12.2025». Oder die Mietstage neben die Periode stellen.
- **P-2:** Liste auf 390 px öffnen, der Titel bricht als «Nebenkostenabrechnun / gen» um. Was helfen würde: Silbentrennung (`hyphens: auto` mit `lang="de"`) oder auf dem Handy ein kürzerer Titel «Abrechnungen».
- **P-3:** Liste, Zeilen von Nina Brunner und Thomas Weber vergleichen: Beide Zeiten sehen gleich aus. Was helfen würde: ein kurzer Zusatz bei einer Teilperiode, z. B. «Einzug 01.07.2025» oder «Teil des Jahres».

## Nicht geprüft

- «PDF erstellen» und die PDF-Links nicht angetippt: Ich soll nur schauen, und ein Tipp könnte ein PDF erzeugen, also speichern. Was beim Tipp auf «PDF» in der Liste passiert (Download, Ansicht), habe ich darum nicht gesehen.
- Dunkler Modus, andere Sprachen und Querformat habe ich nicht geprüft.
- Der Leerzustand (kein Treffer bei Suche oder Filter) gehörte nicht zur Aufgabe.
