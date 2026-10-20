# Helga, Slice 199: Wechsel der Abrechnungsperiode auf «Juli bis Juni»

Desktop 1440 × 900, Zoom 150 %, Maus. Gebäude zum Speichern: «Musterhaus Zentrum». Sprache Deutsch.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-199/`.

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Hans Müller (auch Übersicht) | Dwello teilt die Vergangenheit neu im Rhythmus «Juli bis Juni» ein, obwohl ich erst jetzt, nach den Abrechnungen 2025, umgestellt habe. Es bietet «Kurze Abrechnungsperiode 01.07.2023 – 31.12.2023 abrechnen» und «01.07.2022 – 30.06.2023 abrechnen» an. Früher galt aber das Kalenderjahr: 2023 hätte ich vom 01.01. bis 31.12.2023 abrechnen müssen. Wenn ich den Knöpfen folge, entstehen Abrechnungen für Perioden, die nie gegolten haben. |
| P-2 | Minor | Assistent, Schritt 2 «Gebäude» | Auf der Karte «Musterhaus Zentrum» steht «10 Rechnungen in der Abrechnungsperiode». Diese Zahl gilt für die vorgeschlagene Periode 01.07.2025 – 30.06.2026, nicht für die kurze Periode 01.01.2026 – 30.06.2026, die der Link darunter anbietet. In der Vorschau steht dann «Keine Rechnungen erfasst». Zuerst dachte ich, die Rechnungen seien da. |
| P-3 | Minor | Schritt 2 und Mietvertrag | «Steht die Abrechnungsperiode in Ihren Mietverträgen, informieren Sie die Mieter über den Wechsel.» Ich weiss nicht, wie ich das prüfe und was ich den Mietern schreiben soll. Es gibt weder einen Link noch eine Vorlage. |
| P-4 | Nit | Mietvertrag Hans Müller | Bei den Perioden Juli bis Juni heisst der Link nur «Rechnungen ansehen» und zeigt alle Rechnungen des Gebäudes, ohne Filter nach Periode. Dreimal steht derselbe Link (`/invoices?building=…`). Bei den anderen Perioden heisst er «Rechnungen 2026 ansehen» bzw. «Rechnungen 2023 ansehen». |

## Beobachtungen

- Übersicht: Der Kasten «Nächster Schritt» zählt für Musterhaus Zentrum acht Perioden auf, bis zurück zu 01.07.2017 – 30.06.2018. Für alle drei Gebäude ist das ein langer Datumsblock in einem einzigen Absatz. Ich habe zuerst nicht gesehen, dass nur «01.01.2026 – 30.06.2026» neu ist (Screenshot `01-dashboard.png`).
- In der Liste «Mietverträge» haben alle 11 Mietverträge die Marke «Abrechnung fehlt», auch die beendeten. Ich sehe dort nicht, welche wirklich dringend ist.
- Schritt 2 hilft gut. Das Kästchen von Musterhaus Zentrum lässt sich nicht anklicken. Der Text erklärt, warum: Die gewählte Periode überschneidet sich mit den Abrechnungen 2025, und ich soll die übrigen Tage in einer kurzen Periode abrechnen. Der Link «Kurze Abrechnungsperiode 01.01.2026 – 30.06.2026 abrechnen» springt direkt zu Schritt 3 und zeigt «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2026 – 30.06.2026». So wusste ich, wo ich bin.
- Vorschau: «Kosten CHF 1’620.00 (100 %) unter dem Akonto» ist für mich schwer zu lesen. Die Kosten sind CHF 0.00, gemeint ist wohl: «CHF 1’620.00 weniger als das Akonto».
- Vorschau: Der Text beim Heizprofil in Schritt 3 ist sehr lang (Zähler, Heizkostenverteiler, Entwürfe löschen). Bei 150 % muss ich viel scrollen.
- Ohne Häkchen bei «Die Abrechnungen trotzdem erstellen» bleibt «Weiter» auf der Seite. Darunter steht dann «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Das ist klar.
- Schritt 5 sagt deutlich «Es wird nichts verschickt». Das hat mich beruhigt.
- Das Wort «Mietstage» (auf dem Mietvertrag und in der Liste der Abrechnungen) kenne ich nicht, ich kenne nur «Miettage».

## Aufgabe geschafft: ja

Für Musterhaus Zentrum sind 4 Entwürfe für 01.01.2026 – 30.06.2026 entstanden (Pierre Dubois, Anna Schmidt, Hans Müller, Maria Rossi; Hans Müller: NK-11111111-2026-0003, 181 Mietstage, Rückerstattung CHF 1’440.00). Nichts wurde versendet. Weil es für 2026 keine Rechnungen des Gebäudes gibt, habe ich «Die Abrechnungen trotzdem erstellen» bestätigt. Die älteren «fehlenden» Perioden (P-1) habe ich bewusst nicht abgerechnet.

## Aufwand

Etwa 25 Minuten, rund 15 Schritte: Übersicht, Assistent Schritt 1 bis 5, Mietvertrag, Rechnungen 2026, Liste der Abrechnungen von Hans Müller.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die fehlende Abrechnung. Gesehen: «Noch nicht abgerechnet» mit einer langen Liste von Perioden pro Gebäude. Für Musterhaus Zentrum steht zuerst 01.01.2026 – 30.06.2026, danach sieben ältere Perioden.
2. **«Abrechnungen erstellen», Schritt 1.** Erwartet: die neue Periode. Gesehen: Beginn 01.07.2025, Ende 30.06.2026, mit «Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen.» Die ausgeschriebenen Daten unter den Feldern («Dienstag, 1. Juli 2025») sind gut lesbar.
3. **Schritt 2.** Erwartet: Ich kann Musterhaus Zentrum ankreuzen. Gesehen: Die Karte ist grau und lässt sich nicht wählen. Darunter steht der Hinweis auf die Abrechnungen 2025 und der Link zur kurzen Periode. Zuerst war ich unsicher, dann aber erleichtert, weil der Text sagt, was zu tun ist. Unklar blieb «10 Rechnungen» (P-2) und der Satz über die Mietverträge (P-3).
4. **Mietvertrag Hans Müller.** Erwartet: «1 Abrechnung fehlt» (2026). Gesehen: «5 Abrechnungen fehlen» mit fünf Knöpfen, darunter 01.07.2023 – 31.12.2023 und drei ganze Perioden Juli bis Juni (2020 – 2023). Hier bin ich erschrocken: Habe ich jahrelang etwas vergessen, und dann noch in einem anderen Rhythmus? (P-1). Der Knopf «Kurze Abrechnungsperiode 01.01.2026 – 30.06.2026 abrechnen» öffnet den Assistenten direkt in Schritt 3 für Musterhaus Zentrum.
5. **Schritt 3.** Heizprofil «Heizung + Warmwasser» und 3 % Verwaltungspauschale übernommen.
6. **Schritt 4, Vorschau.** Erwartet: Kosten aus 10 Rechnungen. Gesehen: «Keine Rechnungen erfasst» in Rot, die Warnungen «Rechnungen fehlen» und «Tankbestand am 30.06.2026 fehlt», 4 Abrechnungen mit vollem Akonto zurück. Mit «Rechnungen 2026 ansehen» auf der Übersicht habe ich nachgeschaut: Für 2026 gibt es nur eine Rechnung, und die gehört zu Seepark Residenz. Ich habe «Die Abrechnungen trotzdem erstellen» angekreuzt.
7. **Schritt 5.** «Es werden 4 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt.» Ich habe auf «Entwürfe erstellen» geklickt. Ergebnis: «4 Nebenkostenabrechnungen sind als Entwurf erstellt.» mit «Entwürfe ansehen».
8. **Mietvertrag danach.** Jetzt steht dort «4 Abrechnungen fehlen», 2026 ist weg. In der Übersicht fehlt die Periode 2026 bei Musterhaus Zentrum, und es sind 11 statt 7 Entwürfe.

## Verwirrung

- «Kurze Abrechnungsperiode» ist verständlich, weil das Datum dabei steht.
- Was heisst es, wenn die Abrechnungsperiode «in Ihren Mietverträgen steht»? (P-3)
- «Mietstage», «Tankbestand», «Heizprofil»: Ohne Erklärung musste ich die Begriffe raten. Der Tankbestand wird immerhin erklärt.
- Ich habe nicht verstanden, warum Dwello mir 2023 als «Juli bis Dezember» anbietet, obwohl ich damals noch das Kalenderjahr hatte (P-1).

## Fehlerrisiken

- P-1: Eine unsichere Vermieterin folgt den Knöpfen und erstellt Abrechnungen für 01.07.2022 – 30.06.2023 und 01.07.2023 – 31.12.2023. Diese Perioden passen zu keinem früheren Abrechnungsrhythmus. Der Text sagt sogar «mit welcher Periode Sie beginnen, spielt keine Rolle».
- P-2: Wer «10 Rechnungen» liest und die Warnung in der Vorschau übersieht, bestätigt Abrechnungen ohne Kosten. Dann erhalten die Mieter das ganze Akonto zurück.

## Vorschläge

- **P-1.** Reproduktion: Einstellungen auf «Juli bis Juni» (bereits gesetzt), Mietverträge → «Hans Müller» → Kasten «5 Abrechnungen fehlen». Was helfen würde: Vor dem Wechsel und vor der ersten Abrechnung im neuen Rhythmus zählt Dwello die fehlenden Zeiten im alten Rhythmus (Kalenderjahr) auf, also «2023 abrechnen» statt der Teile von Juli bis Juni. Mindestens sollte ein Satz sagen, dass die neue Periode erst ab dem Wechsel gilt.
- **P-2.** Reproduktion: Übersicht → «Abrechnungen erstellen» → «Weiter» → Karte «Musterhaus Zentrum». Was helfen würde: bei gesperrter Karte die Rechnungen der kurzen Periode zählen («0 Rechnungen vom 01.01.2026 bis 30.06.2026») oder die Zahl ausdrücklich auf die gewählte Periode beziehen.
- **P-3.** Reproduktion: wie P-2, Satz unter dem Link. Was helfen würde: ein kurzer Hilfetext, wo im Mietvertrag die Periode steht und was die Mieter erfahren müssen (z. B. ein Mustersatz für den Brief).
- **P-4.** Reproduktion: Mietvertrag Hans Müller, Links neben «01.07.2022 – 30.06.2023 abrechnen». Was helfen würde: den Link auf die Periode filtern und mit Datum benennen, zum Beispiel «Rechnungen 01.07.2022 – 30.06.2023 ansehen».

## Nicht geprüft

- Die erstellten Entwürfe und ihre PDFs habe ich nicht geöffnet. Laut Aufgabe sollte ich nichts versenden, und die Beträge prüft der Daten-Prüfer.
- Die Einstellungen selbst habe ich nicht angesehen, denn der Wechsel war schon gespeichert.
- Zoom 200 % habe ich nicht geprüft, nur 150 %.
- Die Knöpfe für ältere Perioden (P-1) habe ich nicht ausgeführt, um keine falschen Entwürfe zu erzeugen.
- In «Seepark Residenz» und «Alpenblick» habe ich nichts gespeichert, denn diese Gebäude gehören nicht zu meiner Aufgabe.
