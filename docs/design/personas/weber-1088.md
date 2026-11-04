# Dr. Weber – Abrechnungsperiode pro Gebäude (#1088)

Desktop 1440 × 900, Maus, Persona-App auf :3300 (Demodaten und das vorbereitete Gebäude «Lindenhof»). Nichts erstellt, nichts gespeichert: Der einzige Aufruf, der kein GET war, ist `POST /statements/generate?/preview` (die Vorschau).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der Hinweis bei Lindenhof sagt nur «wählen Sie im ersten Schritt eine Abrechnungsperiode von Juli bis Juni». Welche Periode noch fehlt (01.07.2025 – 30.06.2026 usw.), steht nicht da. Einen Knopf, der die Periode übernimmt, gibt es nicht. Ich muss zurückgehen und beide Daten von Hand eintippen. Schritt 1 sagt mir auch nicht, dass es im Bestand Gebäude mit einer anderen Periode gibt. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Lindenhof ist für die Periode 2025 gesperrt, trägt aber die orange Warnung «Keine Rechnungen in der Abrechnungsperiode erfasst». Die Warnung betrifft eine Periode, die für dieses Gebäude gar nicht gilt. Sie lässt vermuten, dass Rechnungen fehlen. Dazu kommt «0 von 5 gewählt»: Die Zahl rechnet die gesperrten Gebäude mit. Der Satz «‹Alle Gebäude› lässt 2 Gebäude aus …» nennt nur die schon abgerechneten Gebäude, nicht die beiden mit einer anderen Abrechnungsperiode. |
| P-3 | Minor | Gebäude Lindenhof, Abschnitt «Tankbestand» | Der Hilfetext rechnet fest mit dem Kalenderjahr: «am 31.12.», «Endbestand 2024 und Anfangsbestand 2025», «Lesen Sie erst Anfang Januar ab, erfassen Sie den Wert trotzdem per 31.12.». Lindenhof rechnet aber bis zum 30.06. ab. Wer dem Text folgt, erfasst den Stichtag falsch. |
| P-4 | Minor | Gebäude bearbeiten, Feld «Abrechnungsperiode» | Zur Wahl stehen nur «Kalenderjahr», «Juli – Juni» und «November – Oktober». Steht im Mietvertrag eine andere Periode (z. B. Oktober – September oder Mai – April), sagt die Hilfe nicht, was zu tun ist. Ebenso fehlt ein Hinweis für den Fall, dass die Mietverträge im selben Gebäude verschiedene Perioden haben. Die Gefahr: Man wählt die «ähnlichste» Option, und die Abrechnung weicht vom Vertrag ab. |

## Beobachtungen

- **Schritt 1 (Vorschlag):** Dwello schlägt 01.01.2025 – 31.12.2025 vor. Der Text lautet «Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode, die die meisten Gebäude haben.» Das stimmt: Drei von vier Demogebäuden rechnen im Kalenderjahr ab, und 2025 ist abgelaufen. Auch die Wochentage stimmen (Mittwoch, 1. Januar 2025; Mittwoch, 31. Dezember 2025; Dienstag, 1. Juli 2025; Dienstag, 30. Juni 2026). Nachdem ich die Daten geändert hatte, stand der Satz «Vorgeschlagen ist …» weiter da, obwohl das nicht mehr der Vorschlag war.
- **Gegenprobe:** Mit 01.07.2025 – 30.06.2026 zeigen die drei Kalenderjahr-Gebäude den Satz «… rechnet im Kalenderjahr ab … von Januar bis Dezember». Mit 01.07.2025 – 31.05.2026 und mit 01.08.2025 – 31.07.2026 bleibt Lindenhof richtigerweise gesperrt. Mit 01.07.2024 – 30.06.2025 ist es wählbar. Bei 01.07.2025 – 31.05.2026 wirkt «von Juli bis Juni» knapp, weil der Beginn ja schon im Juli liegt. «vom 1. Juli bis 30. Juni» wäre eindeutiger.
- **Vorschau Lindenhof 01.07.2025 – 30.06.2026:** 1 Abrechnung für Paul Brunner, 365 Mietstage. Das stimmt, denn in diesem Zeitraum gibt es keinen 29. Februar. Akonto CHF 2’160.00 = 12 × CHF 180.00 stimmt mit dem Vertrag überein. Die Warnung «Rechnungen fehlen» ist verständlich und sagt, was zu tun ist.
- **Mietvertrag Paul Brunner:** Unter «3 Abrechnungen fehlen» stehen 01.07.2025 – 30.06.2026, 01.07.2024 – 30.06.2025 und 01.07.2023 – 30.06.2024. Das passt zum Vertragsbeginn 01.07.2023 und zur Periode des Gebäudes. Die laufende Periode 2026/27 fehlt zu Recht. Der Knopf «01.07.2024 – 30.06.2025 abrechnen» öffnet den Assistenten direkt in Schritt 3 mit «Gewählt: Lindenhof, Abrechnungsperiode 01.07.2024 – 30.06.2025». Das ist sehr gut. Das Dashboard nennt dieselben drei Perioden.
- Im Mietvertrag steht «Vereinbarte Nebenkosten: Keine», trotzdem ist ein Akonto von CHF 180.00 vereinbart, und Dwello würde abrechnen. Nach Art. 257a Abs. 2 OR schuldet der Mieter nur besonders vereinbarte Nebenkosten. Für eine vorsichtige Vermieterin ist das ein Widerspruch. Er kommt vermutlich aus den vorbereiteten Daten und ist nicht Teil der Änderung.
- **Gebäude Lindenhof:** Unter «Angaben zum Gebäude» steht «Abrechnungsperiode: Juli – Juni». Die Gebäudeliste zeigt die Periode nicht.
- **Hilfe beim Bearbeiten, rechtlich:** «Wählen Sie den, der in den Mietverträgen steht (oft bei den Nebenkosten). Ab der ersten Abrechnung des Gebäudes bleibt er fest.» Das ist vernünftig. Massgebend ist die Vereinbarung im Mietvertrag (Art. 257a/257b OR). Alle Optionen umfassen 12 Monate, das passt zur jährlichen Abrechnung (Art. 4 Abs. 1 VMWG). Dass die Periode nach der ersten Abrechnung fest bleibt, ist vorsichtig und richtig. Bei Alpenblick ist das Feld gesperrt mit «Für Alpenblick gibt es schon Abrechnungen. Die Abrechnungsperiode bleibt darum fest.» Was zu tun ist, wenn die Periode falsch erfasst wurde oder ein neuer Vertrag sie ändert, steht dort nicht.
- **Kopfzeile des Assistenten:** Die Schrittnamen sind unschön getrennt («Abrech-nungsperi-ode», «Verwal-tungspau-schale»).
- In der Liste sah ich das Gebäude «Rosengarten» (0 Wohnungen, Juli – Juni). Es stammt nicht von mir, darum habe ich es nicht bewertet.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, rund 30 Bedienschritte (9 Skriptläufe).

## Ablauf

- **Schritt 2, Lindenhof bei der Periode 2025:**
  - Erwartet: Ein Hinweis mit der konkreten Periode, die noch fehlt, oder ein Knopf, der sie übernimmt.
  - Gesehen: Nur «Juli bis Juni» und die Bitte, zurückzugehen. Dazu die irreführende Warnung «Keine Rechnungen …» (P-1, P-2).
- **Zurück zu Schritt 1:**
  - Erwartet: Ein Hinweis auf die Periode Juli – Juni.
  - Gesehen: Weiterhin «Vorgeschlagen ist …» und keine Angabe zu anderen Perioden. Die Daten musste ich selbst eintippen.
- **Gebäude Lindenhof:**
  - Erwartet: Die Texte zum Tankbestand passen zur Periode Juli – Juni.
  - Gesehen: 31.12. und Anfang Januar fest vorgegeben (P-3).

## Vorschläge

- **P-1:**
  - Reproduktion: «Nebenkostenabrechnungen» → «Abrechnungen erstellen» → Vorschlag 01.01.2025 – 31.12.2025 → «Weiter». Die Karte Lindenhof ist gesperrt.
  - Was helfen würde: In den Hinweis die konkrete letzte abgelaufene Periode schreiben («z. B. 01.07.2025 – 30.06.2026»), am besten mit einem Knopf «Diese Periode wählen», der Schritt 1 ausfüllt. Alternativ in Schritt 1 erwähnen, dass Gebäude mit einer anderen Periode gesondert abgerechnet werden.
- **P-2:**
  - Reproduktion: wie bei P-1.
  - Was helfen würde: Bei gesperrten Gebäuden die Rechnungs-Warnung weglassen. «x von 3 wählbar» zählen. Den Satz zu «Alle Gebäude» um die Gebäude mit einer anderen Periode ergänzen.
- **P-3:**
  - Reproduktion: «Gebäude» → «Lindenhof» → Abschnitt «Tankbestand».
  - Was helfen würde: Den Text aus der Periode des Gebäudes ableiten («am 30.06.», «Lesen Sie erst Anfang Juli ab …»).
- **P-4:**
  - Reproduktion: «Gebäude» → «Lindenhof» → «Bearbeiten» → Feld «Abrechnungsperiode».
  - Was helfen würde: Ein Satz, was bei einer anderen Periode im Vertrag oder bei verschiedenen Perioden im Gebäude zu tun ist (z. B. ausserhalb von Dwello abrechnen). Oder weitere Startmonate anbieten.

## Nicht geprüft

- Erstellen und das PDF einer Juli–Juni-Abrechnung: laut Auftrag nichts erstellt.
- Speichern einer geänderten Abrechnungsperiode: laut Auftrag nichts gespeichert.
- Ob der Assistent bei einem Gebäude mit Tank in einer Juli–Juni-Periode nach dem Bestand per 30.06. fragt: Lindenhof hat keinen Tank, und ich durfte nichts erfassen.
