# Dr. Weber – Schrittanzeige im Assistenten «Abrechnungen erstellen» (#1146)

Desktop 1440 × 900 und 1280 × 800, Maus. Nur angesehen, nichts erstellt. Gebäude: Alpenblick (Seepark Residenz und Musterhaus Zentrum lassen sich für 2025 nicht wählen, weil alle Mietverträge schon eine Abrechnung haben). Heizprofil «Heizung Bergregion», Verwaltungspauschale 2.5 %.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 3 (1440 und 1280) | In der Schrittanzeige werden die Angaben der erledigten Schritte mitten im Wort umbrochen: «01.01.20 / 25 – / 31.12.20 / 25» über vier Zeilen und «Alpenbli / ck». Ein Datum, das so zerrissen ist, lese ich nicht mehr als Datum; ich musste es im Kopf zusammensetzen. |
| P-2 | Minor | Schritte 2–5 | Die Abrechnungsperiode steht auch ohne Wortbruch auf drei Zeilen: «01.01.2025 / – / 31.12.2025». Der Gedankenstrich steht allein in einer Zeile. |
| P-3 | Minor | Schritte 4 und 5 | Der erledigte Schritt 3 «Heizprofil und Verwaltungspauschale» zeigt nur «Heizung Bergregion». Die gewählte Verwaltungspauschale (2.5 %) fehlt, obwohl sie zu genau diesem Schritt gehört. Ich habe einen Moment gezweifelt, ob mein Wert übernommen wurde. |
| P-4 | Minor | Schritt 5 | Der erledigte Schritt 4 «Vorschau» zeigt nur ein Häkchen ohne Text. Ich sehe nicht, wohin dieses Häkchen führt; erst beim Darüberfahren erkenne ich eine Schaltfläche, aber nicht wofür. |
| P-5 | Minor | Alle Schritte mit erledigten Schritten | Bei erledigten Schritten ersetzt der gewählte Wert den Namen des Schritts (statt «Abrechnungsperiode» nur das Datum, statt «Gebäude» nur «Alpenblick»). Die Namen der Schritte erfahre ich nur am Anfang, solange noch nichts erledigt ist. |
| P-6 | Minor | Schritt 1 bis 3 | Die noch kommenden Schritte zeigen nur die Ziffern 3, 4, 5 ohne Namen. Nur in Schritt 1 wusste ich nicht, was nach «Abrechnungsperiode» kommt; die Namen der späteren Schritte sehe ich erst, wenn ich dort bin. |
| P-7 | Minor | Rücksprung über die Schrittanzeige | Springe ich von Schritt 5 über die Anzeige zurück zu «Gebäude», sind die Schritte 3 und 4 wieder als offen (nur Ziffer) dargestellt, obwohl Heizprofil und Pauschale noch gespeichert sind. Ich kann nicht direkt wieder nach vorn springen und muss mit «Weiter» jeden Schritt erneut durchgehen. |

## Beobachtungen

- Der aktuelle Schritt ist gut zu erkennen: «Schritt n von 5: …» über dem Balken, der Fortschrittsbalken und die gefüllte Ziffer mit fettem Namen. Das ist eindeutig.
- Erledigte Schritte haben ein grünes Häkchen; beim Darüberfahren erhalten sie einen hellen Hintergrund und den Handzeiger. Das Zurückspringen funktionierte auf Anhieb (Schritt 5 → Gebäude, Schritt 3 → Abrechnungsperiode), meine Angaben (Alpenblick, Bergregion, 2.5) blieben erhalten.
- Die Darstellung bei 1280 × 800 ist identisch mit 1440 × 900; es gibt kein seitliches Scrollen.
- Schritt 2: Unter der Überschrift «Gebäude» ist ein auffällig grosser leerer Abstand.
- Schritt 2 nach dem Rücksprung: «Alle Gebäude» ist angehakt, obwohl «1 von 3 gewählt» steht. Mit dem Hinweis, dass «Alle Gebäude» zwei Gebäude auslässt, ist es erklärbar, aber zuerst irritierend.
- Schritt 3: Im Diagramm «Anteil der Heizkosten pro Monat» brechen Werte wie «13.6 / %» und «10.7 / %» um, das Prozentzeichen steht allein.
- Schritt 3: «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht über den Knöpfen, der Hinweis zu «Ohne vereinbarte Verwaltungspauschale» erst unter «Weiter». Leicht zu übersehen.
- Schritt 4: Ohne das Häkchen «Die Abrechnungen trotzdem erstellen» geht «Weiter» nicht; das war wegen der Hinweise zu fehlenden Rechnungen (Kaminfeger, Kaltwasser 2. Halbjahr) nachvollziehbar.
- Schritt 5 fasst Periode, Gebäude, Heizprofil und Pauschale sauber zusammen und sagt, dass 2 Entwürfe entstehen und nichts verschickt wird. Gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 12 Schritte pro Durchgang (2 Durchgänge mit beiden Fenstergrössen, dazu Rücksprünge zu Schritt 2 und 1).

## Ablauf

- Schritt 2: erwartet «✓ Abrechnungsperiode 01.01.2025 – 31.12.2025» auf einer Zeile; gesehen nur das Datum über drei Zeilen, der Gedankenstrich allein.
- Schritt 3: erwartet lesbare Angaben der erledigten Schritte; gesehen «01.01.20 / 25 – / 31.12.20 / 25» und «Alpenbli / ck».
- Schritt 4: erwartet bei Schritt 3 «Heizung Bergregion, 2.5 %»; gesehen nur «Heizung Bergregion».
- Schritt 5: erwartet bei Schritt 4 «Vorschau»; gesehen ein Häkchen ohne Text.
- Rücksprung von Schritt 5 zu «Gebäude»: erwartet, dass die Schritte 3 und 4 als erledigt sichtbar bleiben; gesehen nur noch Ziffern 3, 4, 5.

## Vorschläge

- **P-1:** Abrechnungen erstellen → Weiter → Alpenblick wählen → Weiter. In der Schrittanzeige stehen das Datum und «Alpenblick» mitten im Wort umbrochen (1440 und 1280). Hilfreich: Wörter und Daten nie innerhalb umbrechen; dem aktiven langen Namen «Heizprofil und Verwaltungspauschale» nicht so viel Breite geben, dass die erledigten Schritte zusammengedrückt werden, oder die Angaben in einer eigenen Zeile unter der Anzeige zeigen.
- **P-2:** Abrechnungen erstellen → Weiter. Hilfreich: den Zeitraum ohne Umbruch um den Gedankenstrich oder kompakt in zwei Zeilen («01.01.2025 –» / «31.12.2025»).
- **P-3:** Bis Schritt 4 gehen, Pauschale 2.5 eingeben. Hilfreich: «Heizung Bergregion, 2.5 %» zeigen.
- **P-4:** Bis Schritt 5 gehen. Hilfreich: «Vorschau» als Text neben dem Häkchen.
- **P-5:** Bis Schritt 3 gehen. Hilfreich: den Namen des Schritts klein über dem gewählten Wert behalten («Abrechnungsperiode» / «01.01.2025 – 31.12.2025»).
- **P-6:** Assistent öffnen. Hilfreich: die Namen der kommenden Schritte gedämpft neben den Ziffern zeigen.
- **P-7:** Bis Schritt 5 gehen, in der Anzeige «Alpenblick» klicken. Hilfreich: Schritte mit noch gültigen Angaben als erledigt und anklickbar lassen, solange sich nichts geändert hat, oder sagen, dass sie neu bestätigt werden müssen.

## Nicht geprüft

- Die Schrittanzeige mit mehreren gewählten Gebäuden: in der Abrechnungsperiode 2025 liessen sich nur Alpenblick wählen; eine andere Periode habe ich nicht versucht, weil die Aufgabe den Vorschlag vorgab.
- «Entwürfe erstellen» habe ich bewusst nicht gedrückt (nur ansehen).
- Rücksprung über die Anzeige von Schritt 5 direkt zu Schritt 3 oder 4 habe ich nicht einzeln geprüft, nur zu Schritt 2 und (von Schritt 3) zu Schritt 1.
