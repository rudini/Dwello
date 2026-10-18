# Persona-Review: Marco, Runde w1b

Persona: Marco, 38, auf dem Handy (390 × 844, Touch), wenig Zeit. Oberflächensprache Deutsch.
Aufgabe (nur ansehen, nichts speichern): Nebenkostenabrechnung 2025 von Sarah Meier (Seepark Residenz) öffnen; herausfinden, für welche Zeit abgerechnet wird, wie der Betrag jeder Kostenposition zustande kommt (Wohnungsanteil, Zeitanteil) und wie die Summe heisst; von einer Kostenposition aus eine Rechnung öffnen und zur Abrechnung zurückkehren.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/marco-w1b/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-22222222-2025-0002, Position Heizung | Zeitanteil steht bei Heizung als «55.80 %», bei allen anderen Positionen als «181/365 Tage». Nirgends steht, warum Heizung anders gerechnet wird; die Zeile «Heizprofil: Heizung + Warmwasser» steht losgelöst unter der Liste, ohne Bezug zur Heizung. Ich kann den Betrag CHF 588.39 nicht nachvollziehen. |
| P-2 | Minor | Abrechnung, Kopf | Im Kopf steht «Abrechnungsperiode 01.01.2025 – 31.12.2025», in der Liste stand für Sarah Meier «01.01.2025 – 30.06.2025, 181 Mietstage». Für welche Zeit Sarah wirklich zahlt, finde ich auf der Abrechnung erst ganz unten unter «Mieter und Wohnung». |
| P-3 | Minor | Abrechnung, Kostenpositionen | «Wohnungsanteil» ist ein Frankenbetrag, «Anteil» eine Prozentzahl. Ohne Hilfetext ist nicht klar, dass «Anteil» = Wohnungsanteil × Zeitanteil, bezogen auf die Kosten des Gebäudes, ist und dass «Betrag» = Wohnungsanteil × Zeitanteil. |
| P-4 | Minor | Abrechnung, Summenblock | Die Summe heisst «Ihre Nebenkosten». Ich bin der Vermieter; «Ihre» klingt, als wären es meine Kosten. Dasselbe bei «Ihr Mietverhältnis in dieser Periode». |
| P-5 | Minor | Rechnung (von der Abrechnung geöffnet) | Auf der Rechnung gibt es keinen Weg zurück zur Abrechnung; die Brotkrümelnavigation führt zu «Rechnungen». Zurück kam ich nur mit der Zurück-Geste des Browsers. Ausserdem heisst der Link «Fernwärme Q1 2025», die Seite aber «ewl Energie Wasser Luzern»; kurz dachte ich, ich sei falsch. |
| P-6 | Nit | Abrechnung, Kostenpositionen | Der Kategoriename bricht mitten im Wort um («TV/Kabelanschl» / «uss»). Die Prozentzahlen bei «Anteil» haben mal eine («12.4 %», «14.3 %»), mal zwei Nachkommastellen («12.71 %»). |

## Beobachtungen

- Der Titel der Liste bricht auf dem Handy mitten im Wort um: «Nebenkostenabrechnun» / «gen» (Screenshot 03-statements.png).
- Kein seitliches Scrollen auf Liste, Abrechnung und Rechnung (Seitenbreite 390 px).
- Die Rechnungs-Links in der Abrechnung sind 48 px hoch und gut zu treffen.
- Mit der Zurück-Geste lande ich wieder genau bei der Heizung (Scrollposition 1575 px vorher und nachher). Das ist angenehm.
- Ich habe nachgerechnet: Die Beträge stimmen (z. B. TV: 228.00 × 181/365 = 113.06; Summe der Positionen 1’415.51; 3 % = 42.47; Total 1’457.98; minus Akonto 1’320.00 = 137.98, gerundet 138.00).
- Der Summenblock ist gut lesbar: Zwischensumme, Verwaltungspauschale, «Ihre Nebenkosten» fett, Akonto, Rundung, «Saldo: Nachzahlung» fett.

## Aufgabe geschafft: teilweise

Zeitraum, Summe und der Weg zur Rechnung und zurück: ja. Wie der Betrag zustande kommt: bei vier Positionen ja, bei Heizung nein (P-1).

## Aufwand

Etwa 4 Minuten, 5 Taps (Menü, Nebenkostenabrechnungen, Sarah Meier, Fernwärme Q1 2025, Zurück) und viel Scrollen (die Abrechnung ist auf dem Handy etwa 5100 px lang).

## Ablauf

1. **Start (Übersicht).** Erwartet: ein Weg zu den Abrechnungen. Gesehen: Menü-Knopf oben links; die Übersicht selbst hat «Entwürfe ansehen». Ich nehme das Menü.
2. **Menü öffnen.** Erwartet: Eintrag «Nebenkostenabrechnungen». Gesehen: unter «Nebenkosten» der Eintrag «Nebenkostenabrechnungen». Getippt.
3. **Liste der Abrechnungen.** Erwartet: Sarah Meier finden. Gesehen: 17 Abrechnungen, Sarah Meier als dritte: «Seepark Residenz, Wohnung A2, 01.01.2025 – 30.06.2025, 181 Mietstage, Nachzahlung CHF 138.00, Entwurf». Schon hier sehe ich, dass sie nur ein halbes Jahr gewohnt hat. Gut.
4. **Abrechnung öffnen.** Erwartet: die gleiche Zeit oben. Gesehen: «Abrechnungsperiode 01.01.2025 – 31.12.2025». Kurze Verwirrung (P-2); das ganze Jahr ist die Periode des Gebäudes, die 181 Tage stehen erst ganz unten.
5. **Kostenaufstellung lesen.** Erwartet: pro Position, wie der Betrag entsteht. Gesehen: pro Karte Kategorie, Verteilschlüssel, Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Anteil, Betrag und darunter die Rechnungen. Bei TV, Hauswart, Kaltwasser, Allgemeinstrom ist der Zeitanteil «181/365 Tage», damit konnte ich rechnen. Bei Heizung «55.80 %» ohne Erklärung (P-1). «Anteil» musste ich erst nachrechnen (P-3).
6. **Summe finden.** Erwartet: eine klare Endzahl. Gesehen: «Zwischensumme CHF 1’415.51», dann «Ihre Nebenkosten CHF 1’457.98» (fett), am Ende «Saldo: Nachzahlung CHF 138.00» (fett). Die Summe der Nebenkosten heisst «Ihre Nebenkosten» (P-4).
7. **Rechnung öffnen.** Unter Heizung «Fernwärme Q1 2025» angetippt. Erwartet: die Rechnung. Gesehen: Seite «ewl Energie Wasser Luzern», darunter «Fernwärme Q1 2025», Betrag CHF 1’520.00, Kategorie Heizung. Passt, aber der Titel ist ein anderer als der Link (P-5).
8. **Zurück zur Abrechnung.** Erwartet: ein Link «Zur Abrechnung». Gesehen: nur «Rechnungen» in der Brotkrümelnavigation (führt zur Rechnungsliste, ausprobiert). Mit der Zurück-Geste des Browsers war ich wieder auf der Abrechnung, an derselben Stelle.

## Verwirrung

- «Abrechnungsperiode» (ganzes Jahr) gegenüber den Mietstagen von Sarah (halbes Jahr).
- «Zeitanteil» einmal als Tage, einmal als Prozent.
- «Heizprofil»: was das ist und was es mit der Heizung zu tun hat, steht nirgends.
- «Wohnungsanteil» (CHF) gegenüber «Anteil» (%).
- «Ihre Nebenkosten» und «Ihr Mietverhältnis»: wer ist «Ihr»?

## Fehlerrisiken

- Wer den Heizungs-Zeitanteil nicht versteht, kann einer Mieterin auf Nachfrage nicht erklären, warum ihre Heizkosten höher sind als 181/365 (55.80 % statt 49.6 %), und hält die Abrechnung womöglich für falsch.
- Wer nur den Kopf liest, könnte glauben, Sarah werde für das ganze Jahr belastet.
- Wer von der Rechnung über die Brotkrümel «Rechnungen» zurückgeht, landet in der Rechnungsliste und muss die Abrechnung neu suchen.

## Vorschläge

- **P-1:** Abrechnung von Sarah Meier öffnen, zur Karte «Heizung» scrollen: Zeitanteil «55.80 %». Hilfe: einen Satz direkt beim Zeitanteil der Heizung, z. B. dass er nach dem Heizprofil gewichtet ist (Wintermonate zählen mehr), und die Zeile «Heizprofil» in die Heizungskarte verschieben.
- **P-2:** Liste öffnen (Zeile zeigt 01.01.–30.06.2025), Abrechnung öffnen (Kopf zeigt 01.01.–31.12.2025). Hilfe: im Kopf zusätzlich die Mietstage von Sarah zeigen («abgerechnet: 01.01.2025 – 30.06.2025, 181 Mietstage»).
- **P-3:** Eine beliebige Karte ansehen. Hilfe: kurzer sichtbarer Text oberhalb der Karten: «Betrag = Wohnungsanteil × Zeitanteil. Anteil = Betrag im Verhältnis zu den Kosten des Gebäudes.»
- **P-4:** Summenblock ansehen. Hilfe: neutral formulieren («Nebenkosten der Mieterin/des Mieters», «Mietverhältnis in dieser Periode»), wenn die Seite für den Vermieter ist.
- **P-5:** In der Abrechnung «Fernwärme Q1 2025» antippen, auf der Rechnung zurück suchen. Hilfe: auf der Rechnung, wenn sie von einer Abrechnung kommt, einen Link «Zurück zur Abrechnung NK-…» oder einen Abschnitt «In Abrechnungen verwendet».
- **P-6:** Karte TV/Kabelanschluss ansehen. Hilfe: Kategoriewert nicht mitten im Wort trennen (z. B. Wert unter die Bezeichnung statt daneben); Prozentzahlen mit gleich vielen Nachkommastellen.

## Nicht geprüft

- PDF der Abrechnung (nicht Teil der Aufgabe).
- Dunkler Modus und andere Sprachen (Aufgabe: Deutsch).
- Andere Abrechnungen (z. B. Nina Brunner, ab 01.07.2025), ob der Heizungs-Zeitanteil dort ebenso erscheint.
- Speichern, «Als versendet markieren», «Abrechnung löschen»: Aufgabe war nur ansehen.
