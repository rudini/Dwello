# Persona-Review: Dr. Weber – Neue Mieterin Claudia Steiner und ihre Nebenkostenabrechnung 2025 (#1470)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus.
App: Persona-Stack http://localhost:3300 (Demodaten). Gespeichert habe ich nur in «Musterhaus Zentrum».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/1050036a-1394-59ea-a01a-2a53c78f1ce6/scratchpad/weber-1470/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | PDF der Abrechnung NK-11111111-2025-0005, Seite 1, unter «Heizung» | Die zweite Zeile unter Heizung nennt keinen Beleg. Sie beginnt direkt mit «Leistungszeitraum 01.07.2025 – 31.12.2025: CHF 368.00, …». Rechnungsdatum (31.12.2025), Rechnungsnummer (MZ-2025-1470), Lieferant (Tankservice Huber GmbH) und Beschreibung («Brennerservice Juli–Dezember 2025») fehlen. Die Zeile darüber nennt dagegen «Rechnung vom 22.09.2025 (Nr. MZ-2025-010)». Bei der Belegeinsicht kann Frau Steiner die CHF 368.00 nur über den Betrag einer Rechnung zuordnen. |
| P-2 | Minor | PDF, Seite 1, unter «Heizung» | Die Zeilen der Belege laufen ohne Absatz, Aufzählungszeichen oder Leerzeile ineinander. Wo die Öllieferung aufhört und der Brennerservice anfängt, sieht man nur am Wort «Leistungszeitraum» mitten im Fliesstext (siehe Bild der Seite 1). |
| P-3 | Minor | PDF, Seite 1, Formel unter «Heizung» | «Ihr Anteil: 888.62 × Zeitanteil (6'565.00 × 38.87 % + 368.00 × 87.94 %) / 6'933.00 = 368.55». Das Wort «Zeitanteil» steht mitten in der Formel und liest sich wie ein weiterer Faktor. Auf der Seite steht die Formel ohne dieses Wort. Das Ergebnis stimmt, aber beim Nachrechnen stolpert man. |
| P-4 | Minor | PDF, Zeile zur Öllieferung, und Fussnote | Frau Steiner liest, dass die Lieferung vom 22.09.2025 «für die ganze Abrechnungsperiode» gilt und dass eine Lieferung in den Tank «über die ganze Abrechnungsperiode» zählt. Warum das zulässig ist, steht nirgends: Abgerechnet wird der Einkauf statt des Verbrauchs, weil ich bestätigt habe, dass der Tank am Anfang und am Ende gleich voll war, und Tankbestände sind nicht erfasst. Wer bei der Belegeinsicht eine Lieferung von 6'400 Litern im September sieht, fragt mit Recht, ob davon im Dezember noch etwas im Tank war. Die App hat mich gewarnt: «Abrechnen dürfen Sie aber nur den Verbrauch». Die Abrechnung erklärt der Mieterin diese Annahme nicht. |
| P-5 | Minor | Seite der Abrechnung, Position «Heizung» | Die Seite zeigt beim Brennerservice nur «Anteil nach Heizprofil: 87.94 %». Die Monatsanteile, aus denen der Wert kommt (Jul–Dez zusammen 44.20 %, ihre Monate 38.87 %), stehen nur im PDF. Unten steht zwar der Name des Heizprofils «Heizung + Warmwasser», aber ohne seine Prozente. Allein von der Seite aus kann ich 38.87 % und 87.94 % nicht nachrechnen. |
| P-6 | Minor | Seite der Abrechnung im Vergleich zum PDF, Position «Heizung» | Die Belege heissen auf der Seite und im PDF verschieden. Auf der Seite heissen sie «Heizöl EL, 6'400 Liter» und «Brennerservice Juli–Dezember 2025», je mit Link auf die Rechnung, aber ohne Datum und Nummer. Im PDF heisst der eine «Rechnung vom 22.09.2025 (Nr. MZ-2025-010)», der andere hat gar keinen Namen (P-1). Wenn ich das PDF neben die Seite lege, muss ich die Zeilen über ihre Beträge zuordnen. |

## Beobachtungen

- **Die Heizkosten sind plausibel.** Ich habe nachgerechnet:
  - Wohnungsanteil: 6'933.00 × (70 % × 55/492.5 + 30 % × 1/6) = 888.62 ✓
  - Heizprofil «Heizung + Warmwasser» ab 15.08.: 3.6 % × 17/31 = 1.97 %, dazu 3.7 + 9.5 + 10.7 + 13.0 ergibt 38.87 % ✓
  - Anteil am Brennerservice: 38.87 / 44.20 = 87.94 % ✓. Mit ungerundeten Werten käme ich auf 87.95 %; das PDF rechnet ausdrücklich mit den gerundeten Werten.
  - Ihr Anteil: 888.62 × (6'565 × 38.87 % + 368 × 87.94 %) / 6'933 = 368.55 ✓

  Für 4½ Monate in der Heizsaison auf 55 m² sind CHF 368.55 von CHF 6'933 einleuchtend: etwa 41 % des Jahresanteils der Wohnung, obwohl es nur 38 % der Tage sind. Das liegt an den Wintermonaten. Mit dem PDF kann ich jede Zahl unter «Heizung» nachrechnen.
- **Zeitanteil 41.47 %:** Unter «Zeitanteil» steht bei Heizung ein gemischter Wert. 888.62 × 41.47 % ergibt 368.51, nicht 368.55. Die Fussnote im PDF erklärt das («Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position»). Auf der Seite fehlt diese Erklärung.
- **Akonto:** Auf der Seite steht nur «Akontobeiträge − CHF 818.71». Im PDF ist es sauber aufgeschlüsselt (17/31 × 180.00 + 4 × 180.00). Die Kosten rechnet Dwello dagegen nach 139/365 Tagen ab, die Akontobeiträge nach Monaten. Das ist ein anderes Verfahren, aber nachvollziehbar.
- **Vorschau im Assistenten:** Dort steht «Nachzahlung CHF 154.85», direkt darunter aber «Kosten CHF 154.87 (19 %) über dem Akonto». Die 2 Rappen erklärt erst die Seite der Abrechnung («Rundung auf 5 Rappen»).
- **Hinweis zum Tankbestand (Schritt 4):** Er ist klar und rechtlich richtig: «Bestätigen Sie nur, wenn der Tank am Anfang und am Ende gleich voll war.» Das Kästchen dazu heisst aber nur «Die Abrechnungen trotzdem erstellen». Es nennt nicht, was ich bestätige, und gilt zugleich für den Hinweis «Es gibt schon Abrechnungen».
- **Hinweis in Schritt 5:** Dort steht nur noch «Möglicherweise fehlen Rechnungen … Fehlt eine Rechnung, fehlen ihre Kosten». Dass ich den Einkauf statt des Verbrauchs abrechne, steht dort nicht mehr. Dabei war das der eigentliche Punkt.
- **Tankbestand auf der Gebäudeseite:** Erfasst ist nur ein Bestand per 31.12.2023 (CHF 2'120.00). Der Hinweis nennt richtig 31.12.2024 und 31.12.2025 als fehlend.
- **Bestehende Entwürfe in Schritt 4:** Zu den Entwürfen der anderen Mieter steht «… und der Tankbestand wurde geändert». Ich habe keinen Tankbestand geändert, und auf der Gebäudeseite sehe ich keinen neuen. Die Rechnung «Brennerservice» wurde laut ihrer Seite heute um 16:33 erfasst, also nicht von mir. Diese Entwürfe habe ich nicht angefasst.
- **Verwaltungspauschale:** Laut Auftrag sollte ich sie wählen, «wie die App vorschlägt». Die App wählt aber nichts vor. Ohne Wahl kommt beim «Weiter» der Fehler «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.». Ich habe «Ja, zum Satz des Abrechnungslaufs» gewählt. Im Lauf schlug die App 3 % vor, und diesen Satz habe ich übernommen.
- **Heizprofil:** Vorgewählt war «Heizung + Warmwasser», nicht «Heizung Mittelland» (das Gebäude steht in Zürich). Ich habe die Vorwahl gelassen. Der Hilfetext «wählen Sie das Profil, das Ihre Mietverträge vorsehen» hilft bei einem Vertrag nicht weiter, der dazu nichts sagt.
- **Vertragsbeginn in der Vergangenheit:** Die Rückfrage «Der Vertragsbeginn Freitag, 15. August 2025 liegt in der Vergangenheit. Stimmt das Datum?» ist klar und war schnell bestätigt.
- **Abrechnung anlegen:** Dass nur ihre Abrechnung entsteht, sagt der Assistent deutlich: «4 von 5 Mietverträgen haben schon eine Abrechnung; nur der übrige wird abgerechnet.» und «Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe.»
- **Hinweise im PDF:** Die Hinweise zu Belegeinsicht (Art. 257b Abs. 2 OR), Art. 8 Abs. 1 VMWG und zur Quelle der Monatsanteile (Mieterverband) gefallen mir.

## Aufgabe geschafft: ja

Ich habe die Mieterin und den Mietvertrag erfasst (unbefristet ab 15.08.2025, Nettomiete CHF 1'450, Akonto CHF 180, Verwaltungspauschale zum Satz des Abrechnungslaufs). Danach habe ich ihre Abrechnung NK-11111111-2025-0005 als Entwurf erstellt (Nachzahlung CHF 154.85) und die Seite und das PDF geprüft.

## Aufwand

Etwa 12 Minuten, rund 30 Schritte: Mieterin 1 Formular, Mietvertrag 5 Schritte, Abrechnung 5 Schritte, dazu Seite, PDF und zwei Rechnungsseiten.

## Ablauf

- **Mietvertrag, Schritt 4:** Erwartet hatte ich eine vorgeschlagene Verwaltungspauschale. Gesehen habe ich keine Vorwahl und nach «Weiter» die Fehlermeldung «Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.».
- **Mietvertrag gespeichert:** Erwartet hatte ich eine Bestätigung. Gesehen habe ich die Liste der Mietverträge mit «Claudia Steiner … Laufend, Abrechnung fehlt», aber im Hauptbereich keinen Text wie «gespeichert».
- **Abrechnung, Schritt 4:** Erwartet hatte ich eine Bestätigung «Tank am Anfang und Ende gleich voll». Gesehen habe ich das Kästchen «Die Abrechnungen trotzdem erstellen». Ohne Häkchen bleibt man auf dem Schritt.
- **Abrechnung, Schritt 5:** Erwartet hatte ich, dass der Hinweis zum Tankbestand wiederholt wird. Gesehen habe ich nur «Möglicherweise fehlen Rechnungen» mit dem Text über fehlende Rechnungen.
- **PDF unter «Heizung»:** Erwartet hatte ich zu jedem Beleg Datum und Nummer. Gesehen habe ich das nur bei der Öllieferung. Der Brennerservice steht ohne Beleg da (P-1).
- **Seite der Abrechnung:** Erwartet hatte ich, die 87.94 % dort nachrechnen zu können. Gesehen habe ich nur den Endwert (P-5).

## Vorschläge

- **P-1:** Mietvertrag und Abrechnung wie oben anlegen und das PDF öffnen. Die zweite Zeile unter Heizung beginnt mit «Leistungszeitraum 01.07.2025 – 31.12.2025: CHF 368.00». Hilfreich wäre, jede Zeile gleich zu beginnen, also auch hier «Rechnung vom 31.12.2025 (Nr. MZ-2025-1470), Leistungszeitraum …». Ideal wären zusätzlich der Lieferant oder die Beschreibung, wie es die Vorschau zeigt («Tankservice Huber GmbH, Rechnung vom 31.12.2025»).
- **P-2:** Im PDF unter Heizung beginnt jeder Beleg mitten im Text. Hilfreich wäre ein eigener Absatz pro Beleg, zum Beispiel mit Aufzählungszeichen oder etwas Abstand, und die Formel «Ihr Anteil …» abgesetzt darunter.
- **P-3:** Formelzeile im PDF. Hilfreich wäre, «Zeitanteil» aus der Formel zu nehmen wie auf der Seite oder es als Klammer zu schreiben: «888.62 × (…) / 6'933.00 = 368.55 (Zeitanteil 41.47 %)».
- **P-4:** Im PDF bei der Zeile zur Öllieferung oder in der Fussnote. Hilfreich wäre ein Satz wie: «Der Tank war am Anfang und am Ende der Abrechnungsperiode gleich voll; der Einkauf entspricht deshalb dem Verbrauch.» Er sollte nur dort stehen, wo der Vermieter das im Assistenten bestätigt hat.
- **P-5:** Seite der Abrechnung, Position Heizung, Brennerservice. Hilfreich wäre dieselbe Aufschlüsselung der Monate wie im PDF oder ein aufklappbarer Text dazu. Zudem sollten die Monatsanteile des Heizprofils auch auf der Seite stehen, nicht nur sein Name.
- **P-6:** Seite und PDF nebeneinander legen. Hilfreich wäre, dass beide denselben Belegnamen zeigen, also Datum, Nummer und Beschreibung, auf der Seite neben dem Link.

## Nicht geprüft

- Den Versand («Als versendet markieren») habe ich nicht geprüft. Das war nicht Teil des Auftrags, und ein Entwurf lässt sich danach nicht mehr neu berechnen.
- Ich habe keinen Tankbestand erfasst. Laut Auftrag habe ich ihn nicht notiert.
- Ein anderes Heizprofil als die Vorwahl («Heizung Mittelland») habe ich nicht ausprobiert. Ein zweiter Entwurf für dieselbe Mieterin war nicht vorgesehen.
- Die Abrechnungen der anderen Mieter habe ich nicht geöffnet. Sie sind nicht von mir.
- Die PDF-Seiten 2–3 habe ich als Text gelesen, nicht als Bild. Seite 1 habe ich als Bild angesehen.
