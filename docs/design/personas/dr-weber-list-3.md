# Dr. Weber – Abrechnungsliste, Runde 3 (list-3)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus, 100 %.
Aufgabe (Nachprüfung von P-1 aus `dr-weber-list-2.md`): In der Liste «Nebenkostenabrechnungen» die Abrechnungen 2025 von Sarah Meier (Auszug 30.06.2025) und Nina Brunner (Einzug 01.07.2025), Seepark Residenz, ansehen und beide öffnen. Ist aus der Liste klar, für welche Tage jede Mieterin abgerechnet wird, ohne Verwechslung mit der Abrechnungsperiode? Stimmt die Detailseite mit der Liste überein?
App: http://localhost:3300, Demodaten. Nur angesehen, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/2d6e0557-c7a1-50fc-8e2b-2c19ae995e43/scratchpad/dr-weber-list-3/`

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nebenkostenabrechnungen (Liste) | Der Zeitraum in der Zeile hat weiterhin keine eigene Beschriftung («Mietzeit» o. ä.). Dass «01.07.2025 – 31.12.2025, 184 Mietstage» die Mietzeit und nicht die Abrechnungsperiode ist, erschliesst sich nur aus dem angehängten Wort «Mietstage». Für mich reicht das jetzt, eine Verwechslung ist aber nicht ganz ausgeschlossen («Periode 2. Halbjahr, darin 184 Mietstage»). |
| P-2 | Nit | Liste und Detailseite | Die Reihenfolge ist umgekehrt: Liste «01.01.2025 – 30.06.2025, 181 Mietstage», Detailseite «181 Mietstage (01.01.2025 – 30.06.2025)». Inhaltlich identisch, beim Abgleichen stolpert man kurz. |

## Beobachtungen

- Alle Zeilen der Liste tragen jetzt die Mietstage: 2025 mit ganzem Jahr «365 Mietstage», 2024 «366 Mietstage». Das habe ich nachgerechnet: 2024 ist ein Schaltjahr, also korrekt. Gerade weil auch die ganzjährigen Zeilen «365 Mietstage» zeigen, wird der Zeitraum durchgehend als Mietzeit lesbar, nicht als Periode.
- Die Liste zeigt die Abrechnungsperiode selbst gar nicht mehr. Wer wissen will, ob Sarah Meier und Nina Brunner in derselben Periode 2025 abgerechnet wurden, liest das nur aus der Abrechnungsnummer (…-2025-…) oder auf der Detailseite. Für mich ausreichend.
- Auf der Detailseite steht der Untertitel «Abrechnungsperiode 01.01.2025 – 31.12.2025» und unten in «Mieter und Wohnung» «Mietstage in der Abrechnungsperiode: 181 Mietstage (01.01.2025 – 30.06.2025)». Die beiden Angaben widersprechen sich nicht mehr, weil die zweite ausdrücklich als Teil der Periode bezeichnet ist.
- Die Mietzeit steht auf der Detailseite weit unten rechts in der schmalen Spalte, umbrochen auf zwei Zeilen. Oben, neben der Abrechnungsperiode, sieht man von der Mietzeit nichts. Wer nur den Kopf liest, sieht bei Sarah Meier ein ganzes Jahr.
- Der Vorschlag aus Runde 2 («Mietzeit … neben den Mietstagen auf der Detailseite») ist umgesetzt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten, 4 Schritte: Liste über die Navigation öffnen, beide Zeilen lesen und mit den übrigen vergleichen, Sarah Meier öffnen, Nina Brunner öffnen.

## Ablauf

1. **Liste öffnen** über «Nebenkostenabrechnungen» in der linken Navigation. Erwartet: die Liste mit 17 Abrechnungen. Gesehen (`01-liste.png`): wie erwartet, Seite 1 von 2, die Seepark-Zeilen oben.
2. **Zeilen lesen.** Erwartet: einen erkennbaren Unterschied zwischen Mietzeit und Abrechnungsperiode. Gesehen: Nina Brunner «Seepark Residenz, Wohnung A2 / 01.07.2025 – 31.12.2025, 184 Mietstage», Sarah Meier «… / 01.01.2025 – 30.06.2025, 181 Mietstage» (`02-zeile-sarah.png`, `02-zeile-nina.png`); alle anderen 2025er Zeilen «01.01.2025 – 31.12.2025, 365 Mietstage». Das Wort «Mietstage» direkt hinter dem Zeitraum hat mich diesmal sofort an die Mietzeit denken lassen. Nachgerechnet: 1.1.–30.6.2025 = 181 Tage, 1.7.–31.12.2025 = 184 Tage, zusammen 365. Passt.
3. **Sarah Meier öffnen** (`03-sarah-oben.png`, `04-sarah-ganz.png`). Erwartet: dieselben Daten wie in der Liste. Gesehen: Untertitel «Sarah Meier, Seepark Residenz, Wohnung A2 · Abrechnungsperiode 01.01.2025 – 31.12.2025»; in «Mieter und Wohnung» «Mietstage in der Abrechnungsperiode 181 Mietstage (01.01.2025 – 30.06.2025)». Stimmt mit der Liste überein.
4. **Nina Brunner öffnen** (`03-nina-oben.png`, `04-nina-ganz.png`). Gesehen: Abrechnungsperiode 01.01.2025 – 31.12.2025, «184 Mietstage (01.07.2025 – 31.12.2025)». Stimmt mit der Liste überein. Plausibilität: Die Anteile von Nina Brunner (z. B. Hauswart 12.92 %) liegen leicht über denen von Sarah Meier (12.71 %), entsprechend 184 zu 181 Tagen; Heizung ist bei Sarah höher (14.3 % zu 11.33 %), was zu einem Winterhalbjahr passt. Die Beträge im Einzelnen habe ich nicht nachgerechnet.

## Verwirrung

- Der Zeitraum in der Listenzeile steht noch ohne Bezeichnung. Ich verstehe ihn wegen «… Mietstage» richtig, aber ein Wort wie «Mietzeit» davor würde jedes Nachdenken ersparen (P-1).
- «Mietstage» ist ein klarer Begriff. «Mietstage in der Abrechnungsperiode» auf der Detailseite erklärt zudem, worauf sich die Tage beziehen.

## Fehlerrisiken

- Gering. Wer die Liste nur überfliegt, könnte «01.07.2025 – 31.12.2025» noch als Halbjahresperiode lesen; spätestens die Detailseite klärt das.
- Auf der Detailseite steht im Kopf nur die volle Periode; wer nur den Kopf liest, übersieht den Teilzeitraum unten rechts.

## Vorschläge

- **P-1**: Reproduktion: «Nebenkostenabrechnungen» öffnen, Zeilen «Sarah Meier NK-22222222-2025-0002» und «Nina Brunner NK-22222222-2025-0003» lesen. Hilfreich: «Mietzeit 01.07.2025 – 31.12.2025 (184 Mietstage)» als Text in der Zeile.
- **P-2**: Reproduktion: Zeile Sarah Meier lesen, dann die Abrechnung öffnen und «Mieter und Wohnung» lesen. Hilfreich: auf beiden Seiten dieselbe Reihenfolge, z. B. überall «01.01.2025 – 30.06.2025 (181 Mietstage)».

## Nicht geprüft

- Das PDF der beiden Abrechnungen habe ich nicht geöffnet; ob dort die Mietzeit ebenso steht, bleibt offen (nicht Teil der Aufgabe).
- Die Beträge im Einzelnen habe ich nicht nachgerechnet, das ist Sache des Daten-Prüfers.
- Seite 2 der Liste, Mobilansicht, andere Sprachen und dunkles Erscheinungsbild: nicht Teil der Aufgabe.
