# Dr. Weber – Pellets ohne Tankbestand (Seepark Residenz)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Demodaten). Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c886409d-428b-57e9-8b50-0b7fc9169d0e/scratchpad/dr-weber-1480/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Gebäude bearbeiten (Hilfetext «Kein Tank oder Tank stillgelegt»), Abrechnung (Detail und PDF) | Der Einkauf wird ohne jeden Vorbehalt als Verbrauch abgerechnet. Art. 5 Abs. 2 lit. a VMWG spricht aber von Brennstoffen, «die verbraucht wurden». Weder der Hilfetext noch die Abrechnung sagen, dass das nur vertretbar ist, wenn das Lager am Ende der Periode etwa so voll ist wie am Anfang, oder leer. Konkret zahlt Sarah Meier (ausgezogen am 30.06.2025) 55.80 % ihres Wohnungsanteils an einer Lieferung vom 05.10.2025, die am 31.12. womöglich noch grösstenteils im Lager liegt. Damit ist die Abrechnung anfechtbar (OR 257a/b: tatsächliche Aufwendungen). Wahrscheinlich braucht es dazu einen Produktentscheid. |
| P-2 | Minor | Gebäudeseite Seepark Residenz | Nach dem Häkchen «Kein Tank oder Tank stillgelegt» (Anzeige: «Tank: Keiner oder stillgelegt») zeigt dieselbe Seite weiterhin das Formular «Tankbestand». Sein Hilfetext lautet: «Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen … Erfassen Sie dafür am letzten Tag jeder Abrechnungsperiode … den Wert im Tank oder Lager». Bei einem Pelletgebäude widerspricht das der eben getroffenen Einstellung und verleitet dazu, doch einen Bestand zu erfassen. |
| P-3 | Minor | Rechnung (Detail) | Bei der Pelletrechnung steht: «Für dieses Gebäude ist kein Tankbestand erfasst; abgerechnet wird der Einkauf.» Das liest sich, als hätte ich eine Eingabe vergessen. Es ist aber eine bewusste Einstellung («Kein Tank oder Tank stillgelegt»), und der Satz verweist nicht auf sie. |
| P-4 | Minor | Abrechnung Detailseite (Meier, Brunner) | Die Pelletzeile sagt nur: «Lieferung von Heizmaterial, gilt für die ganze Abrechnungsperiode: CHF 1’200.00, Anteil nach Heizprofil: 55.80 %». Warum (kein Tank, Einkauf = Verbrauch), steht auf der Detailseite nirgends, nur im PDF, und dort mitten im langen Absatz zu «Kosten des Gebäudes». Die erste Frage von Frau Meier, warum sie für eine Lieferung nach ihrem Auszug zahlt, beantwortet keine der beiden Seiten direkt. |
| P-5 | Minor | PDF (Meier, Brunner) | Die Pelletzeile nennt «Rechnung vom 10.10.2025», aber nicht den Liefertag 05.10.2025, obwohl die Regel am Liefertag hängt («Abrechnungsperiode ihres Liefertags»). Auch der Lieferant und die Beschreibung fehlen. Ein Mieter kann die Lieferung so nur mit Belegeinsicht zuordnen. |
| P-6 | Minor | Gebäude bearbeiten / Neue Rechnung | Der Hilfetext am Häkchen sagt, jede Lieferung zähle «über die ganze Abrechnungsperiode ihres Liefertags». Wie ich den Liefertag bei der Rechnung angebe, sagt er nicht. Das Formular «Neue Rechnung» sagt beim Leistungszeitraum das Gegenteil: «Dann zählen nur die Tage, die in die Abrechnungsperiode fallen». Einen Hinweis auf Lieferungen gibt es dort nicht. Dass ein eintägiger Leistungszeitraum als Lieferung gilt und ein mehrtägiger nicht, erfahre ich erst aus dem PDF. |

## Beobachtungen

- Der Hilfetext zu Aufgabe 1 ist im Kern klar: Lieferungen zählen über die ganze Periode ihres Liefertags, abgerechnet wird der Einkauf. Unklar bleibt für mich «Im Jahr der Stilllegung erfassen Sie zuerst … den Endbestand …, auch wenn er 0 ist, und setzen dann das Häkchen». Für Seepark war nie ein Tankbestand erfasst, und Dwello liess mich das Häkchen ohne Endbestand und ohne Rückfrage setzen. Ob ich damit etwas versäumt habe, sagt mir niemand.
- Der Dialog «Entwurf neu berechnen» und der Hinweis «Rechnungen seit der Abrechnung geändert» nennen beide «dem Tankbestand», obwohl das Gebäude keinen Tank hat. Das ist allgemeiner Text, stört aber bei genauem Lesen.
- Mein erster Klick auf «Rechnung speichern» kam unmittelbar nach dem Laden der Seite. Das Formular war danach leer, mit der Meldung «Bitte wählen Sie ein Gebäude.», und es wurde keine Rechnung gespeichert. Mit kurzem Warten nach dem Laden ging es. Wahrscheinlich war die Seite noch nicht fertig geladen (Hydration). Ein schneller Nutzer verliert so alle Eingaben.
- Als Verteilschlüssel war bei Heizung «Pro Fläche (m²)» vorgeschlagen, wie bei den bisherigen Fernwärmerechnungen. Es gibt auch «Heizung (Fläche 70 % / Einheit 30 %)». Ich habe den Vorschlag übernommen.
- In den Demodaten heizt Seepark Residenz 2025 das ganze Jahr mit Fernwärme (Q1–Q4) und jetzt zusätzlich mit Pellets. Das passt nicht zu meiner Geschichte, liegt aber an den Demodaten.
- «Neu berechnen» gibt es nur pro Entwurf. Ich musste vier Entwürfe einzeln neu berechnen.
- Nachgerechnet (alles stimmt):
  - Heizprofil «Heizung + Warmwasser»: Jan–Jun = 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 = 55.80 %; Jul–Dez = 44.20 %. Zusammen 100 %, die Lieferung wird also für A2 ganz verteilt.
  - Wohnungsanteil A2 = 82 / 320 m² = 25.625 %, also 5’315.00 × 25.625 % = 1’361.97.
  - Meier: 1’361.97 × (1’520 + 790 + 1’200 × 55.80 %) / 5’315 = 763.52. Pelletanteil 171.58.
  - Brunner: 1’361.97 × (395 + 1’410 + 1’200 × 44.20 %) / 5’315 = 598.45. Pelletanteil 135.91.
  - 171.58 + 135.91 = 307.49 gegenüber 1’200 × 25.625 % = 307.50 (1 Rappen Rundung).
  - Saldo Meier: vorher Nachzahlung 237.15, jetzt 413.90; Differenz 176.75 = 171.58 + 3 % Verwaltungspauschale.
  - Saldo Brunner: vorher Rückerstattung 97.55, jetzt Nachzahlung 42.45; Differenz 140.00 = 135.91 + 3 %.
- Das PDF erwähnt keinen Tank, den es nicht gibt: «Für das Gebäude ist kein Tank erfasst, oder der Tank ist stillgelegt.» Für den Mieter ist «erfasst» allerdings Fachsprache der Software.
- Der Heizungsblock im PDF ist sehr dicht: eine Zeile pro Rechnung mit Monatsanteilen, in kleiner Schrift. Er ist korrekt, aber für einen Mieter anstrengend.
- Den Entwurf von Nina Brunner habe ich versehentlich zweimal neu berechnet. Ergebnis gleich, keine Wirkung.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, rund 16 Schritte (Gebäude bearbeiten und speichern, Rechnung erfassen mit zwei Speicherversuchen, Rechnung ansehen, Abrechnungsliste, vier Entwürfe neu berechnen, zwei PDFs erstellen und herunterladen, Heizprofil nachschlagen).

## Ablauf

- Gebäudeseite: Ich erwartete, das Häkchen «kein Tank» dort zu finden, wo «Tankbestand» steht. Es steht aber nur unter «Bearbeiten». Nach dem Speichern erwartete ich, dass der Bereich «Tankbestand» verschwindet oder einen Hinweis zeigt. Er blieb unverändert, mit Erfassungsanleitung für Pellets (P-2).
- Neue Rechnung: Ich erwartete einen Hinweis, wie eine Pelletlieferung einzutragen ist. Der Hilfetext zum Leistungszeitraum spricht nur von Tagen in der Periode (P-6).
- Erster Speicherversuch: Ich erwartete die gespeicherte Rechnung. Ich sah ein leeres Formular mit «Bitte wählen Sie ein Gebäude.» (Beobachtungen).
- Rechnungsdetail: Ich erwartete einen Hinweis auf die Einstellung «kein Tank». Ich sah «kein Tankbestand erfasst» (P-3). Gut war der Hinweis «Abrechnungen nicht aktuell» mit Link und Anleitung.
- Abrechnungsdetail Meier: Ich erwartete eine Begründung, warum eine Lieferung nach ihrem Auszug bei ihr anteilig zählt. Ich sah nur «gilt für die ganze Abrechnungsperiode» (P-4).
- PDF: Ich erwartete den Liefertag 05.10.2025 bei der Zeile. Ich sah «Rechnung vom 10.10.2025» (P-5).

## Vorschläge

- **P-1:** Seepark Residenz → Bearbeiten → «Kein Tank oder Tank stillgelegt» setzen. Pelletrechnung mit Liefertag 05.10.2025 erfassen und die Entwürfe 2025 neu berechnen. Meier (bis 30.06.) trägt 55.80 % der Oktoberlieferung, ohne dass jemand prüft, ob die Pellets 2025 verbraucht wurden.
  - Was helfen würde: Im Hilfetext am Häkchen sagen, dass Einkauf statt Verbrauch nur vertretbar ist, wenn das Lager am Periodenende etwa gleich voll ist wie am Anfang (oder leer). Sonst sollte der Bestand gezählt werden.
  - Alternativ in der Abrechnung offenlegen, dass ohne Bestandsaufnahme abgerechnet wird. Fachlich vom fach-reviewer klären lassen (Art. 5 Abs. 2 lit. a VMWG «verbraucht»).
- **P-2:** Häkchen setzen, Gebäudeseite ansehen: Der Bereich «Tankbestand» erscheint unverändert.
  - Was helfen würde: Den Bereich bei «kein Tank» ausblenden. Oder ihn durch einen Satz ersetzen: «Für dieses Gebäude wird kein Tankbestand geführt; Lieferungen werden als Einkauf abgerechnet. Ändern unter Bearbeiten.»
- **P-3:** Pelletrechnung öffnen, Leistungszeitraum ansehen.
  - Was helfen würde: «Dieses Gebäude hat keinen Tank, oder der Tank ist stillgelegt (siehe Gebäude); abgerechnet wird der Einkauf.»
- **P-4:** Abrechnung Sarah Meier öffnen, Kategorie Heizung ansehen.
  - Was helfen würde: Unter der Pelletzeile ein Satz wie im PDF: «Kein Tank oder Tank stillgelegt: Die Lieferung zählt als Verbrauch der ganzen Abrechnungsperiode und wird nach Heizprofil auf Ihre Mietmonate verteilt, auch wenn sie nach Ihrem Auszug geliefert wurde.» Im PDF diesen Satz direkt unter die Pelletzeile setzen, nicht in den allgemeinen Absatz.
- **P-5:** PDF der Abrechnung Meier oder Brunner, Heizungsblock.
  - Was helfen würde: «Lieferung von Heizmaterial vom 05.10.2025 (Rechnung vom 10.10.2025, Pellets Zentralschweiz AG)».
- **P-6:** Gebäude bearbeiten, Hilfetext lesen, dann Neue Rechnung, Hilfetext Leistungszeitraum.
  - Was helfen würde: Im Hilfetext am Häkchen ergänzen: «Tragen Sie bei der Rechnung den Liefertag als Leistungszeitraum ein (Beginn und Ende gleich), sonst gilt das Rechnungsdatum.» Beim Leistungszeitraum der Rechnung einen Satz zu Lieferungen von Heizmaterial in Gebäuden ohne Tank.

## Nicht geprüft

- Ob eine Pelletrechnung ganz ohne Leistungszeitraum (nur Rechnungsdatum) ebenfalls als Lieferung zählt. Die Aufgabe gab den eintägigen Leistungszeitraum vor, und eine zweite Rechnung hätte die Daten für die Datenprüfung verändert.
- Eine neu erstellte Abrechnung über «Abrechnungen erstellen». Für 2025 gab es schon Entwürfe; die App bot «Neu berechnen» an, das habe ich verwendet.
- Versand und QR-Zahlteil im Detail. Nicht Teil der Aufgabe; die Entwürfe sollen für die Datenprüfung so bleiben.

Hinterlassene Datensätze in Seepark Residenz:
- Gebäude mit «Kein Tank oder Tank stillgelegt».
- Rechnung `3633ae9e-abb8-45f5-a06f-d286ed9130fa`: Pellets Zentralschweiz AG, CHF 1’200.00, Heizung, Pro Fläche, umlagefähig, Leistungszeitraum 05.10.2025–05.10.2025.
- Die vier Entwürfe 2025 neu berechnet.
- PDFs erstellt für NK-22222222-2025-0002 (Meier) und NK-22222222-2025-0003 (Brunner).
