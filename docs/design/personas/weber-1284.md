# Dr. Weber – #1284 «Aufgehobene Wohnung»

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Demodaten). Gespeichert nur in Alpenblick: «Aufgehoben ab» 01.07.2025 bei Wohnung 2.01, zwei Entwürfe 2025 (NK-33333333-2025-0001 Laura Keller, Wohnung 0.01; NK-33333333-2025-0002 Kevin Fischer, Wohnung 1.01), das PDF zu 0001. Heizprofil wie vorgeschlagen «Heizung + Warmwasser», Verwaltungspauschale wie vorgeschlagen 3 % (gilt nur für Laura Keller; bei Kevin Fischer ist keine vereinbart). Die Entwürfe sind nicht versendet und bleiben für die Datenprüfung stehen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung (Seite), Kostenaufstellung | Unter «Heizprofil» steht «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)». Das Heizprofil wurde aber angewendet: Das PDF teilt die Heizkosten nach Heizprofil auf, 55.80 % vor dem 01.07.2025 und 44.20 % ab dem 01.07.2025. Seite und PDF widersprechen sich. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 3 (Heizprofil) | Laut Hilfetext «verteilt [das Heizprofil] die Heizkosten bei einem Mieterwechsel auf die Monate». Dass es jetzt auch bestimmt, welchen Teil der Heizkosten ich für die aufgehobene Wohnung trage, steht nirgends. Weil hier beide Mietverträge über das ganze Jahr laufen, hielt ich die Wahl des Profils für bedeutungslos. Das Profil verschiebt aber den Anteil des Vermieters. Für Interlaken wäre «Heizung Bergregion» vielleicht passender gewesen. |
| P-3 | Minor | Wohnung bearbeiten, Hilfetext «Aufgehoben ab»; PDF-Erklärung | Die Texte sagen nicht, dass Rechnungen ohne Leistungszeitraum nach Tagen auf die Zeit vor und ab dem Stichtag verteilt werden. Beispiel: «Wasser und Abwasser H1 2025» (CHF 470.00) wird zu 184/365 dem zweiten Halbjahr zugerechnet, also der Zeit ohne Wohnung 2.01. «Schneeräumung Januar bis März» (CHF 920.00) und «Schneeräumung Dezember» (CHF 380.00) werden zusammen nach Tagen verteilt. Ich trage so für Wohnung 2.01 CHF 214.89 Schneeräumung und CHF 77.69 Kaltwasser. Nach den Leistungszeiten der Rechnungen wären es etwa CHF 306.67 und CHF 156.67. Die Differenz von rund CHF 170 bezahlen die beiden Mieter. Ein Hinweis «Erfassen Sie bei Rechnungen den Leistungszeitraum, sonst …» fehlt am Feld und in der Vorschau. |
| P-4 | Minor | Wohnung bearbeiten, Hilfetext «Aufgehoben ab» | «Abrechnungen ab diesem Tag rechnen ohne sie» verschweigt die Folge, die der Löschdialog offen nennt: Ab diesem Tag tragen die übrigen Mieter die Kosten des Gebäudes allein, im Fall eines geheizten Gemeinschaftsraums also auch dessen Heizung. Das ist nur richtig, wenn der Raum allen Mietern dient. Bei einem Umbau zum eigenen Büro oder zu einer Gewerbefläche müsste ich seinen Anteil selbst tragen (Art. 7 Abs. 1 VMWG sinngemäss; Art. 257a OR). Den Hinweis darauf vermisse ich. |
| P-5 | Minor | Wohnung bearbeiten, Hilfetext; PDF | «Bis zum Tag davor zählt sie in den Abrechnungen mit, und ihren Anteil tragen Sie.» und im PDF «ihren Anteil trägt der Vermieter» sind ohne Bedingung formuliert. Das stimmt nur, wenn die Wohnung bis zum Umbau leer stand. War sie bis zum Tag davor vermietet, trägt der Mieter seinen Anteil, und das PDF an die übrigen Mieter wäre in diesem Punkt falsch. Nicht ausprobiert (siehe «Nicht geprüft»). |
| P-6 | Minor | Wohnung 2.01 (Detail), Gebäude Alpenblick | Nach dem Speichern von «Aufgehoben ab 01.07.2025» zeigt die Wohnung weiter «Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden», dazu den Knopf «Mietvertrag erfassen». Das Gebäude meldet «3, davon 2 vermietet und 1 leer», die Liste «Wohnung 2.01 … Leer». Wer nach Monaten wiederkommt, kann eine Wohnung vermieten wollen, die es nicht mehr gibt. |
| P-7 | Minor | Wohnung 2.01, Löschdialog (nach dem Aufheben) | Der Dialog rät weiter: «Gibt es sie nach einem Umbau nicht mehr, … erfassen Sie … im Feld «Aufgehoben ab» den Tag». Dabei ist der Tag schon erfasst. Es fehlt die Warnung, die jetzt nötig wäre: Wer die aufgehobene Wohnung löscht, verliert auch die Zeit bis zum 30.06.2025. Die Mieter tragen dann bei jeder neuen oder neu berechneten Abrechnung auch den Anteil, der vorher meiner war. |
| P-8 | Minor | PDF, Erklärung über der Kostenübersicht | «Unter den betroffenen Abrechnungspositionen steht die Rechnung je Zeitraum.» Ein Mieter liest «Rechnung» als Rechnung eines Lieferanten. Gemeint ist die Berechnung. Ausserdem steht nicht da, wie die Kosten des Gebäudes je Zeitraum entstehen (CHF 644.66 = 1’300.00 × 181/365). Aus dem PDF allein lässt sich das nur erraten (siehe «Ablauf»). |

## Beobachtungen

- Die PDF-Erklärung «Wohnung 2.01 gibt es ab 01.07.2025 nicht mehr. Bis zum 30.06.2025 zählt sie im Verteilschlüssel mit; ihren Anteil trägt der Vermieter.» ist für eine leerstehende Wohnung richtig und entspricht Art. 7 Abs. 1 VMWG. Gut ist auch, dass die Zeilen je Zeitraum die Wohnungszahl nennen («3 Wohnungen: 72.00 / 255.00 m²», «2 Wohnungen: 72.00 / 170.00 m²»).
- Mit dem Löschdialog vor dem Aufheben bin ich zufrieden: Er unterscheidet «irrtümlich erfasst», «steht nur leer» und «nach einem Umbau» und nennt die Folge für die Mieter.
- Die Notiz auf der Abrechnungsseite («Wohnung 2.01 gibt es ab 01.07.2025 nicht mehr. Abrechnungspositionen mit Kosten vor und ab diesem Tag sind je Zeitraum gerechnet; die Zeilen dazu stehen im PDF.») ist knapp und richtig. Auf der Seite selbst sehe ich je Position aber nur eine Zeile, prüfen kann ich nur im PDF.
- In der Vorschau erklärt der Text unter der Kostenabstimmung, was ich trage («Leerstand, Kategorien …, Tage ausserhalb von Dwello, Pauschalen»). Die aufgehobene Wohnung nennt er nicht. Ich kann den Teil nur zuordnen, weil 2.01 vorher leer war.
- In der Vorschau und auf der Abrechnungsseite heisst eine Spalte «Wohnungsanteil», zeigt aber einen Frankenbetrag. «Zeitanteil» zeigt auf der Seite «365/365 Tage», im PDF «100.00 %». Das ist nicht falsch, aber uneinheitlich (unabhängig von #1284).
- In Schritt 2 zeigt Alpenblick «3 Wohnungen», in Schritt 5 «2 Nebenkostenabrechnungen». Das ist richtig, eine Erklärung, warum es nur zwei sind, fehlt jedoch.
- Die Vorschau warnt zu Recht: Für Kaminfeger fehlt eine Rechnung, beim Kaltwasser die des 2. Halbjahrs. Ich habe die Abrechnungen trotzdem erstellt, wie es die Aufgabe verlangt.
- Rechtlich zur Verwaltungspauschale: Im PDF steht «Die Verwaltungspauschale ist im Mietvertrag vereinbart. Sie gilt den Aufwand für das Erstellen dieser Abrechnung ab (Art. 4 Abs. 3 VMWG).» Das ist vertretbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten, rund 20 Schritte: Wohnung ansehen, Löschdialog lesen, «Aufgehoben ab» erfassen, Assistent in 5 Schritten, Rechnungen nachschlagen, Abrechnungsseite ansehen, PDF erstellen, herunterladen und nachrechnen.

## Ablauf

- Wohnung 2.01 nach dem Speichern. Erwartet: Mietstatus «Aufgehoben ab 01.07.2025», kein Angebot zum Vermieten. Gesehen: «Aufgehoben ab 01.07.2025» steht als zusätzliche Angabe da, der Status bleibt aber «Leer … kann vermietet werden», mit «Mietvertrag erfassen» (P-6).
- Löschdialog nach dem Aufheben. Erwartet: Er weiss, dass die Wohnung aufgehoben ist, und warnt vor dem Verlust des ersten Halbjahrs. Gesehen: derselbe Text wie vorher, mit dem Rat, «Aufgehoben ab» zu erfassen (P-7).
- Schritt 3, Heizprofil. Erwartet: Bei Verträgen über das ganze Jahr spielt das Profil keine Rolle. Gesehen im PDF: Das Profil teilt die Heizkosten vor und ab dem 01.07. auf (P-2), während die Abrechnungsseite «nicht angewendet» sagt (P-1).
- Kostenabstimmung in der Vorschau, von Hand nachgerechnet. Erwartet: Der Anteil des Vermieters entspricht dem Anteil von 2.01 nach den Leistungszeiten der Rechnungen. Gesehen: Er entspricht dem Anteil nach Tagen. Schneeräumung 1’300.00 × 181/365 / 3 = 214.89, Allgemeinstrom 378.90 × 181/365 / 3 = 62.63, Kaltwasser 470.00 × 181/365 / 3 = 77.69, Heizung 5’178.00 × 55.8 % / 3 = 963.11 (angezeigt 963.10; ein Rappen Rundung, wie der Text in der Vorschau ankündigt). Total 1’318.31 stimmt. Die Rechnungen tragen aber Hinweise auf die Leistungszeit («H1 2025», «Januar bis März»), die die Verteilung nach Tagen nicht berücksichtigt (P-3).
- PDF NK-33333333-2025-0001, Zeile für Zeile nachgerechnet. Alle Beträge folgen aus den gedruckten Zahlen, gerundet auf Rappen:
  - Schneeräumung: 72.00/255.00 × 644.66 = 182.02; 72.00/170.00 × 655.34 = 277.56; Summe 459.58 ✓.
  - Allgemeinstrom: 72/255 × 187.89 = 53.05; 72/170 × 191.01 = 80.90; Summe 133.95 ✓.
  - Kaltwasser: 72/255 × 233.07 = 65.81; 72/170 × 236.93 = 100.35; Summe 166.16 ✓.
  - Heizung: 5’178.00 × 55.80 % = 2’889.32 und × 44.20 % = 2’288.68 ✓; 72/255 × 2’889.32 = 815.81; 72/170 × 2’288.68 = 969.32; Summe 1’785.13 ✓. Heizkosten nach Verbrauch: 1’792.00 + 4’880.00 − 1’494.00 = 5’178.00 ✓.
  - Zwischensumme 2’544.82 ✓, Verwaltungspauschale 3 % = 76.34 ✓, Nebenkosten 2’621.16 ✓, Akonto 12 × 190.00 = 2’280.00 ✓, Nachzahlung 341.16, gerundet 341.15 ✓. Der QR-Zahlteil zeigt CHF 341.15 ✓.
  - Erwartet hatte ich, dass die Kosten des Gebäudes je Zeitraum (644.66 / 655.34) aus gedruckten Zahlen folgen. Gesehen: Sie stehen ohne Herleitung im PDF. Erst durch Probieren fand ich 1’300.00 × 181/365. Bei Kaltwasser widerspricht das der Rechnung «H1 2025» (P-3, P-8).
- Screenshot des PDF Seite 1: Briefkopf, Nachzahlungsbox CHF 341.15, darunter die zweizeilige Erklärung zu Wohnung 2.01 und die Kostenübersicht mit je zwei kleinen grauen Zeilen pro Position. Gut lesbar.

## Vorschläge

- **P-1:** Assistent mit Alpenblick 2025 durchlaufen, wobei 2.01 ab 01.07.2025 aufgehoben ist, Abrechnung 0001 öffnen und «Heizprofil» lesen. Hilfreich: «Heizung + Warmwasser (angewendet für die Aufteilung vor und ab 01.07.2025)» oder der Wegfall von «nicht angewendet», wenn eine Wohnung in der Periode aufgehoben wurde.
- **P-2:** Assistent, Schritt 3, mit einem Gebäude, in dem eine Wohnung in der Periode aufgehoben wird. Hilfreich: ein Satz im Hilfetext, etwa «Auch wenn eine Wohnung in der Abrechnungsperiode aufgehoben wird, teilt das Heizprofil die Heizkosten auf die Zeit davor und danach auf; davon hängt Ihr Anteil ab.»
- **P-3:** Wohnung 2.01 bearbeiten und den Hilfetext lesen, danach die Vorschau. Hilfreich: Am Feld und in der Vorschau steht «Rechnungen ohne Leistungszeitraum verteilt Dwello nach Tagen auf die Zeit vor und ab diesem Tag. Erfassen Sie bei Rechnungen für einen Teil des Jahres (z. B. 1. Halbjahr) den Leistungszeitraum.» Noch besser: In der Vorschau werden Rechnungen ohne Leistungszeitraum im betroffenen Gebäude aufgelistet.
- **P-4:** Hilfetext «Aufgehoben ab» lesen. Hilfreich: «Ab diesem Tag tragen die übrigen Mieter die Kosten des Gebäudes allein. Nutzen Sie den Raum selbst oder vermieten Sie ihn anders, z. B. als Büro, tragen Sie seinen Anteil weiterhin; Dwello rechnet das nicht.»
- **P-5:** Hilfetext und PDF-Erklärung. Hilfreich: «ihren Anteil tragen Sie, soweit sie leer stand; war sie vermietet, trägt ihn der Mieter bis zum Ende seines Mietvertrags». Das PDF folgt dem tatsächlichen Fall.
- **P-6:** Nach dem Speichern von «Aufgehoben ab» Wohnung 2.01 und Gebäude Alpenblick ansehen. Hilfreich: Ein eigener Status «Aufgehoben ab 01.07.2025», kein «kann vermietet werden», kein «Mietvertrag erfassen» für die Zeit ab dem Stichtag, und in der Gebäudezählung ist die Wohnung nicht als leer gezählt.
- **P-7:** Bei einer aufgehobenen Wohnung «Löschen» klicken. Hilfreich: ein eigener Text, z. B. «Wohnung 2.01 ist ab 01.07.2025 aufgehoben. Löschen Sie sie nicht: Sonst zählt sie auch vor diesem Tag nicht mehr, und die Mieter tragen in jeder neuen oder neu berechneten Abrechnung ihren Anteil.»
- **P-8:** PDF 0001, Absatz über der Kostenübersicht. Hilfreich: «… steht die Berechnung je Zeitraum. Die Kosten des Gebäudes sind nach Tagen auf die Zeiträume verteilt (Rechnungen mit Leistungszeitraum nach diesem), die Heizkosten nach Heizprofil.» Zusätzlich gehört in die Zeile der Zeitraum mit dem Faktor, z. B. «CHF 1’300.00 × 181/365 = CHF 644.66».

## Nicht geprüft

- Ob ein bei Rechnungen erfasster Leistungszeitraum (z. B. 01.01.–30.06.2025 beim Wasser) die Kosten ganz dem Zeitraum vor dem Stichtag zuordnet. Dazu hätte ich Rechnungen ändern und neu berechnen müssen. Das hätte die Entwürfe verändert, die für die Datenprüfung stehen bleiben sollen. Geprüft habe ich nur, dass das Rechnungsformular das Feld «Leistungszeitraum (optional)» anbietet.
- Eine aufgehobene Wohnung, die bis zum Tag davor vermietet war (P-5). Dafür hätte ich einen Mietvertrag für 2.01 erfassen müssen, was die Daten für die Datenprüfung verändert hätte.
- Löschen der aufgehobenen Wohnung: Ich habe den Dialog nur gelesen und mit «Abbrechen» verlassen.
- Das PDF zu Kevin Fischer (0002) habe ich nicht erstellt, seine Abrechnungsseite nur aufgerufen. Nach der Vorschau stimmt die Summe der Mieteranteile: 2’621.16 + 3’463.77 = 6’084.93 = 6’008.59 + 76.34 Pauschale.
- Andere Heizprofile (Bergregion) habe ich nicht verglichen, um keine zweiten Entwürfe zu erzeugen.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/68aac57b-89dc-5db4-991a-d8f9dcf9ab09/scratchpad/weber-1284/` (PDF und Textauszug unter `pdf/`).
