# Marco – Nebenkostenabrechnungen 2025 Alpenblick, Kostenabstimmung (Runde 1126)

Profil: Marco, 38, Handy 390 × 844, Touch. Gespeichert nur im Gebäude «Alpenblick» (2 Entwürfe 2025 erstellt).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/51543c6c-ac44-5d42-b15b-9b485e791c31/scratchpad/marco-1126/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker | Hauptmenü, Benutzermenü, alle Seiten | «Berichte» ist nirgends verlinkt. Im Menü (Übersicht … Heizprofile, Hilfe), im Benutzermenü, auf «Nebenkostenabrechnungen», auf der Abrechnung, beim Gebäude, auf der Übersicht und in der Hilfe gibt es keinen Link auf die Berichte (auch am Desktop nicht). Die Seite gibt es nur, wenn man die Adresse `/reports` von Hand eintippt. Ich hätte die Kostenabstimmung nach dem Erstellen nie wiedergefunden. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 4 «Vorschau», Kostenabstimmung (gleich im Bericht) | «Kosten des Gebäudes» bei Heizung ist CHF 5’178.00, die einzige Heizungsrechnung 2025 (Heizöl Oberland AG) kostet aber CHF 4’880.00. Total der Kostenabstimmung CHF 7’326.90, Summe der 6 Rechnungen CHF 7’028.90. Die Kostenabstimmung sagt nicht, dass der Tankbestand (Anfangsbestand + Einkauf − Endbestand) mitzählt. Ich musste beim Gebäude unter «Tankbestand» selber nachrechnen (1’792 + 4’880 − 1’494 = 5’178), bis ich glaubte, dass nichts falsch ist. Meine Frage «werden alle Rechnungskosten weitergegeben?» liess sich nicht direkt mit den Rechnungen vergleichen. |
| P-3 | Minor | Kostenabstimmung (Vorschau und Bericht) | Der Erklärtext unter der Tabelle zählt alle möglichen Gründe für «davon tragen Sie» auf (Leerstand, Kategorien nicht vereinbart, Tage ausserhalb Dwello, Pauschale), sagt aber nicht, welcher hier gilt. Dass meine CHF 2’442.29 genau ein Drittel sind, weil Wohnung OG2 leer ist, musste ich mir selber zusammenreimen (der Hinweis zur leeren Wohnung steht nur auf der Übersicht). |
| P-4 | Minor | Bericht «Kostenabstimmung Alpenblick, 01.01.2025 – 31.12.2025» | Auf dem Handy wird der Titel mitten im Gebäudenamen getrennt: «Kostenabstimmung Al-/penblick, 01.01.2025 – 31.12.2025». Sieht aus wie ein Tippfehler im Namen. |

## Beobachtungen

- Vorschau und Bericht zeigen dieselben Zahlen, Zeile für Zeile: Schneeräumung 1’300.00 / 866.67 / 433.33, Allgemeinstrom 378.90 / 252.60 / 126.30, Kaltwasser 470.00 / 313.34 / 156.66, Heizung 5’178.00 / 3’452.00 / 1’726.00, Total 7’326.90 / 4’884.61 / 2’442.29, Verwaltungspauschale CHF 62.06. Mieter + ich ergibt in jeder Zeile genau die Kosten des Gebäudes.
- Der Bericht sagt am Ende «2 Abrechnungen sind noch Entwürfe. Sie zählen schon mit, sind aber noch nicht versendet.» Gut, so wusste ich, dass es meine eben erstellten Entwürfe sind.
- Die Karten pro Position passen gut aufs Handy, nichts scrollt seitwärts (Seitenbreite immer 390 px). Die Total-Karte sieht aber genau gleich aus wie die anderen; beim schnellen Scrollen habe ich sie fast für eine weitere Kategorie gehalten.
- «Verwaltungspauschale (bezahlen die Mieter zusätzlich)» steht unter dem Total. Ich war kurz unsicher, ob die CHF 62.06 im «davon Mieter» schon drin sind. Nachgerechnet: nein (Laura Keller 2’130.83 − 62.06 + Kevin Fischer 2’815.84 = 4’884.61).
- Rückerstattungen: Akonto 2’280.00 − Kosten 2’130.83 = 149.17, angezeigt CHF 149.20; 3’000.00 − 2’815.84 = 184.16, angezeigt CHF 184.20. Hat mich zuerst stutzig gemacht; die Erklärung (auf 5 Rappen zugunsten des Mieters gerundet) fand ich nur in der Hilfe, nicht bei der Vorschau.
- Schritt 2 «Gebäude»: unter der Überschrift «Gebäude» ist ein grosser leerer Bereich, bevor «Alle Gebäude» kommt. Der Satz «‹Alle Gebäude› lässt 2 Gebäude aus …» steht über der Liste, während «Keine neue Abrechnung: Alle Mietverträge haben schon eine.» bei den Gebäuden selbst steht; der zweite reicht.
- Schritt 3: Der Satz «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht über «Weiter», der Hinweis «Ohne vereinbarte Verwaltungspauschale» (Kevin Fischer) kommt aber erst unter den Knöpfen. Auf dem Handy scrollt man da normalerweise nicht mehr hin. Der lange gelbe Text zu Zählern und Heizkostenverteilern ist auf dem Handy ein sehr langer Block.
- Schritt 4: Ohne Häkchen «Die Abrechnungen trotzdem erstellen» springt «Weiter» zum Häkchen und zeigt rot «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Klar.
- Nach dem Erstellen verschwindet «2025» bei Alpenblick aus «Noch nicht abgerechnet» auf der Übersicht. Gut.
- Die Liste unter «Berichte» zeigt pro Zeile nur Gebäude und Periode, keine Zahl; Alpenblick 2025 stand zuoberst, also leicht zu finden, sobald man die Seite einmal hat.

## Aufgabe geschafft: teilweise

Vorschau gelesen und Entwürfe erstellt: ja. Die Kostenabstimmung «unter Berichte» wiederfinden: nein, nur über die eingetippte Adresse `/reports` (siehe P-1). Dort stimmt sie mit der Vorschau überein.

## Aufwand

Ca. 15 Minuten. Erstellen: 9 Taps (Übersicht → Abrechnungen erstellen → Weiter → Alpenblick → Weiter → Weiter → Häkchen → Weiter → Entwürfe erstellen), dazu ein Ausflug zu den Rechnungen und zum Gebäude (Tankbestand), um die Heizkosten zu verstehen. Berichte suchen: 3 erfolglose Versuche (Hauptmenü, Benutzermenü, Seiten Nebenkostenabrechnungen / Abrechnung / Gebäude / Hilfe), dann Adresse von Hand.

## Ablauf

- Schritt 4 Vorschau, Kostenabstimmung. Erwartet: Kosten des Gebäudes = Summe meiner 6 Rechnungen. Gesehen: CHF 7’326.90 statt CHF 7’028.90, Heizung CHF 5’178.00 statt der Rechnung über CHF 4’880.00, ohne Erklärung (P-2).
- Schritt 4, Abrechnungen pro Mietvertrag. Erwartet: Rückerstattung = Akonto − Kosten. Gesehen: jeweils 3–4 Rappen mehr, ohne Hinweis.
- Nach dem Erstellen, «Berichte» suchen. Erwartet: ein Menüpunkt «Berichte» (oder ein Link bei der Abrechnung, beim Gebäude oder auf der Erfolgsmeldung). Gesehen: kein Link nirgends; die Erfolgsmeldung bietet nur «Entwürfe ansehen», «Alle als ZIP herunterladen», «Weitere Abrechnungen erstellen» (P-1).
- Bericht geöffnet. Erwartet: Titel mit Gebäudenamen in einem Stück. Gesehen: «Al-penblick» getrennt (P-4).

## Vorschläge

- **P-1:** Handy, Übersicht → Menü öffnen: Liste endet mit «Hilfe», kein «Berichte». Benutzermenü: nur E-Mail, Einstellungen, Abmelden. Hilfe: «Berichte» einen Menüpunkt geben (z. B. in der Gruppe «Nebenkosten»), und von der Erfolgsmeldung nach «Entwürfe erstellen» sowie von der Abrechnung oder dem Gebäude direkt auf die passende Kostenabstimmung verlinken.
- **P-2:** Abrechnungen erstellen → 2025 → Alpenblick → Weiter → Weiter → Kostenabstimmung, Zeile Heizung, mit den Rechnungen von Alpenblick 2025 vergleichen. Hilfe: bei Positionen mit Tankbestand eine Zeile «davon Rechnungen CHF 4’880.00, Tankbestand +298.00» oder ein Satz «Heizung: Anfangsbestand + Einkauf − Endbestand (siehe Tankbestand beim Gebäude)».
- **P-3:** Gleiche Stelle, Text unter dem Total. Hilfe: den tatsächlichen Grund nennen, z. B. «Wohnung OG2 war das ganze Jahr leer».
- **P-4:** Berichte → «Alpenblick, 01.01.2025 – 31.12.2025» auf 390 px. Hilfe: keine automatische Silbentrennung im Titel, lieber ganzes Wort umbrechen.

## Nicht geprüft

- Den Bericht nach dem Versenden einer Abrechnung (ob der Hinweis zu Entwürfen verschwindet): Versenden gehört nicht zur Aufgabe.
- Andere Gebäude und Perioden in den Berichten nur in der Liste angesehen, nicht geöffnet (nicht mein Gebäude).
- Ob «Berichte» an einem Ort erreichbar ist, den ich nicht kenne: gesucht in Hauptmenü, Benutzermenü, Übersicht, Nebenkostenabrechnungen, Abrechnung Kevin Fischer, Gebäude Alpenblick, Rechnungen, Dokumente, Hilfe, Einstellungen, jeweils Handy und Desktop (Links mit «report» in der Adresse: keine).
