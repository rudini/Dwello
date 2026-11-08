# Marco – Slice 741: fehlende Abrechnungen im Mietvertrag (Alpenblick)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Nur angeschaut, nichts gespeichert.
Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/a7583b18-3e12-520b-9eed-bd8dc7d4e159/scratchpad/marco-741/`

| ID | Schwere | Screen | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Laura Keller, Hinweis «3 Abrechnungen fehlen» | Der Text sagt «Beginnen Sie mit der ältesten Periode», die Knöpfe stehen aber neueste zuerst: «2025 abrechnen», dann 2023, dann 2022. Der erste und auffälligste Knopf ist genau der, mit dem ich nicht beginnen soll. Ich hätte ohne genaues Lesen auf 2025 getippt. |
| P-2 | Minor | Hinweis fehlende Abrechnung (Kevin und Laura) | Der Text sagt «erfassen Sie zuerst die Rechnungen», aber pro Periode steht zuerst der umrandete Knopf «… abrechnen» und erst darunter der schwächere Link «Rechnungen … ansehen». Für 2022 gibt es bei Alpenblick keine einzige Rechnung, trotzdem führt «2022 abrechnen» direkt in den Assistenten (Schritt 3 von 5), und dort warnt nichts davor. Die Reihenfolge der Bedienelemente widerspricht dem Text. |
| P-3 | Minor | Mietvertrag Laura Keller | Mit drei fehlenden Perioden ist der Hinweis sechs Bedienelemente lang. Der eigentliche Mietvertrag («Mieter») beginnt erst bei rund 1240 px, also etwa anderthalb Bildschirme weiter unten; «Vertragsdauer» und Miete erst nach gut zwei Bildschirmen. Bei Kevin (eine Periode) beginnt «Mieter» bei rund 950 px, gerade unter dem ersten Bildschirm. |
| P-4 | Minor | Mietvertrag Kevin Fischer | Unter den Vertragsdaten steht «Abgerechnet bis 31.12.2023», obwohl Dwello die Abrechnung 2024 (bezahlt) schon hat. Der Hinweis oben sagt, ich solle beim Bearbeiten «Abgerechnet bis» eintragen. Ich weiss nicht, ob ich den Wert jetzt auf 2024 ändern muss oder ob er falsch ist. |
| P-5 | Minor | Hinweis, Knopfbeschriftung | Bei Kevin heisst der Knopf «Abrechnungen erstellen» (Mehrzahl, ohne Jahr), bei Laura «2025 abrechnen». Für das Gleiche gibt es zwei Wörter, und bei Kevin sehe ich am Knopf nicht, welches Jahr er abrechnet. |

## Beobachtungen

- Die Liste der Mietverträge zeigt «Abrechnung fehlt» als Badge mit Symbol. Mit dem Filter «Gebäude: Alpenblick» und «Suchen» sah ich sofort nur meine 2 Verträge (Screenshot `02-filter-alpenblick.png`, gescrollt: beide Karten mit dem Badge «Abrechnung fehlt»). Das war gut.
- Die Überschriften sind klar: «Abrechnung 2025 fehlt» (Kevin), «3 Abrechnungen fehlen» (Laura). Welche drei es sind, sehe ich bei Laura aber erst an den Knöpfen; der Text nennt die Jahre nicht.
- Bei Laura fehlen 2022, 2023 und 2025, nicht aber 2024. Warum, erfahre ich erst über «Nebenkostenabrechnungen» ganz unten auf der Seite: Dort ist die Abrechnung 2024 bezahlt. Ohne diesen Umweg hätte ich gedacht, 2024 sei vergessen gegangen.
- Laura ist erst seit 01.11.2022 eingezogen; dass «2022 abrechnen» nur zwei Monate betrifft, steht nirgends. Das hat mich nicht gestört, aber ich habe kurz gezögert.
- «erfassen Sie zuerst ihre Rechnungen»: Das kleine «ihre» (der Periode) habe ich zuerst als vergessenes grosses «Ihre» gelesen.
- Der Satz «Schon ausserhalb von Dwello abgerechnet? …» ist hilfreich, aber bei Laura fehlt die Zeile «Abgerechnet bis» in den Vertragsdaten ganz, bei Kevin ist sie da. Ich sehe also nicht, wo ich den Wert finde, bevor ich auf «Bearbeiten» tippe.
- «Rechnungen 2022 ansehen» öffnet die Rechnungen mit dem Gebäude Alpenblick und dem Satz «Rechnungen von Alpenblick, die in die Abrechnungsperiode 01.01.2022 – 31.12.2022 fallen …». Das Ergebnis steht aber erst nach dem ganzen Filterformular (rund 1060 px), und das Feld «Jahr» zeigt dabei «Alle Jahre». Bei 0 Treffern steht «Keine Rechnungen gefunden. Versuchen Sie es mit anderen Filtern.» und «Filter zurücksetzen» (Screenshot `12-laura-rechnungen2022-leer.png`). Hier müsste ich ja Rechnungen erfassen und nicht die Filter ändern.
- Der Assistent öffnet sich über «Abrechnungen erstellen» bzw. «2022 abrechnen» direkt bei Schritt 3 von 5 mit «Gewählt: Alpenblick, Abrechnungsperiode …». Das spart mir Schritte. Bei Kevin stand oben kurz «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …».
- Mit «Zurück» im Browser kam ich jedes Mal oben auf den Mietvertrag zurück. Keine Seite scrollte seitlich, alle Knöpfe im Hinweis sind mindestens 48 px hoch.

## Aufgabe geschafft: ja

Kevin: Ich würde zuerst auf «Rechnungen 2025 ansehen» tippen und prüfen, ob alle Rechnungen 2025 da sind (6 Rechnungen, CHF 7’028.90 ergibt sich daraus; z. B. Heizöl, Strom, Wasser, Schneeräumung). Danach würde ich «Abrechnungen erstellen» antippen. Laura: Ich würde mit 2022 beginnen, weil der Text «mit der ältesten Periode» sagt. Für die Rechnungen einer Periode tippe ich auf «Rechnungen 2022 ansehen»; dort sind für 2022 keine Rechnungen, also müsste ich sie zuerst erfassen. Bis zum Mietvertrag selbst muss ich bei Laura etwa anderthalb Bildschirme scrollen, bis zu den Vertragsdaten gut zwei.

## Aufwand

Etwa 15 Minuten, rund 20 Schritte (Liste, Filter, zwei Verträge, sechs Links angetippt und zurück).

## Ablauf

- Laura, Hinweis: Ich erwartete, dass der erste Knopf die älteste Periode ist, weil der Text das so sagt. Ich sah zuerst «2025 abrechnen» (Screenshot `05-laura-v1.png`: unter dem Text der erste Knopf «2025 abrechnen»; `05-laura-v2.png`: darunter 2023 und 2022).
- Laura, «Rechnungen 2022 ansehen»: Ich erwartete eine Liste der Rechnungen 2022. Ich sah zuerst nur Knöpfe und Filter (`10-laura-rechnungen2022.png`) und nach dem Scrollen «Keine Rechnungen gefunden» mit «Filter zurücksetzen» (`12-laura-rechnungen2022-leer.png`).
- Laura, «2022 abrechnen»: Ich erwartete nach dem Text einen Hinweis, dass 2022 keine Rechnungen hat. Ich sah den Assistenten bei Schritt 3 von 5 ohne Hinweis darauf (`09-laura-2022.png`).
- Kevin, Vertragsdaten: Ich erwartete «Abgerechnet bis 31.12.2024», weil 2024 abgerechnet ist. Ich sah «31.12.2023» (`04-kevin-full.png`); die Abrechnung 2024 fand ich unter «Nebenkostenabrechnungen» (`08-kevin-abrechnungen.png`: NK-33333333-2024-0002, Bezahlt).
- Laura, fehlende Jahre: Ich erwartete, dass auch 2024 fehlt (Lücke zwischen 2023 und 2025). Erst `11-laura-abrechnungen.png` zeigte die bezahlte Abrechnung 2024.

## Vorschläge

- **P-1:** `/contracts` → Gebäude «Alpenblick» → Suchen → «Laura Keller». Im Hinweis stehen die Knöpfe in der Reihenfolge 2025, 2023, 2022. Ordnen Sie die Perioden von alt nach neu, sodass der erste Knopf «2022 abrechnen» ist, oder heben Sie nur die älteste Periode als Knopf hervor.
- **P-2:** Gleicher Vertrag, «2022 abrechnen» antippen: Der Assistent startet, obwohl 2022 keine Rechnungen hat. Stellen Sie «Rechnungen … ansehen» vor den Knopf «… abrechnen», wie es der Text verlangt, oder sagen Sie neben der Periode, wie viele Rechnungen schon erfasst sind (z. B. «0 Rechnungen erfasst»).
- **P-3:** Laura-Vertrag auf 390 × 844 öffnen und bis zu «Mieter» scrollen. Zeigen Sie die Perioden kompakter (z. B. eine Zeile pro Jahr mit zwei kurzen Links) oder nur die älteste mit Knöpfen und die anderen als Liste.
- **P-4:** `/contracts` → «Kevin Fischer» (Alpenblick OG1) → Vertragsdaten «Abgerechnet bis 31.12.2023», unter «Nebenkostenabrechnungen» ist 2024 bezahlt. Sagen Sie in einem Hilfetext am Feld, dass «Abgerechnet bis» nur für Abrechnungen ausserhalb von Dwello gilt, oder zeigen Sie die letzte abgerechnete Periode einschliesslich der Dwello-Abrechnungen.
- **P-5:** Kevin-Vertrag: Der Knopf heisst «Abrechnungen erstellen». Beschriften Sie ihn wie bei Laura mit dem Jahr («2025 abrechnen»).

## Nicht geprüft

- Den Assistenten habe ich nicht abgeschlossen und nichts gespeichert (so verlangt). Ob Dwello das Abrechnen von 2025 vor 2022 zulässt oder verhindert, habe ich deshalb nicht gesehen.
- Den Weg über «Bearbeiten» zu «Abgerechnet bis» habe ich nicht geöffnet, weil ich dort nichts ändern sollte.
- Den Dunkelmodus und andere Sprachen habe ich nicht angeschaut.
