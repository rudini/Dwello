# Marco – Brenner-Service als Rechnung erfassen und in der Vorschau wiederfinden (#1469)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack http://localhost:3300, Demodaten. Gespeichert nur in «Musterhaus Zentrum» (eine Rechnung: Brenner Service GmbH, CHF 450.00).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/97de64da-cebf-5507-bd93-a79a29388482/scratchpad/marco-1469/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neue Rechnung | Der Hilfetext zum Leistungszeitraum wechselt erst auf die Heizöl-/Tank-Erklärung, wenn ich die Kategorie «Heizung» wähle. Die Kategorie steht auf dem Handy aber weit unten, nach Betrag, Rechnungssteller und Beschreibung. Beim Ausfüllen der Daten hatte ich den allgemeinen Text vor mir; der Text, der für meine Heizungsrechnung gilt, ist danach weit über mir aufgetaucht, und ich habe ihn nur gesehen, weil ich zurückgescrollt habe. Bei einer echten Öllieferung hätte ich so den Zeitraum falsch eingetragen (über mehrere Tage statt nur am Liefertag). |
| P-2 | Minor | Abrechnungen erstellen, Schritt 4 Vorschau, Position Heizung, «Rechnungen anzeigen» | Die Vorschau sagt nirgends, dass die Brenner-Rechnung **nicht als Lieferung in den Tank** zählt; der Hinweis von der Detailseite fehlt hier. In der Liste steht sie direkt **unter** «minus Endbestand», mit derselben Zeile «ganz in dieser Periode» wie die Öllieferung. Auf den ersten Blick fragte ich mich, ob die 450 Franken auch abgezogen werden. Erst mit dem Taschenrechner (2’650.00 + 6’565.00 − 2’257.20 + 450.00 = 7’407.80) war klar, dass sie dazukommen. |

## Beobachtungen

- Auf der Detailseite überdeckte die Meldung «Rechnung von Brenner Service GmbH gespeichert» kurz den Text im gelben Kasten «Abrechnungen nicht aktuell». Sie lässt sich schliessen; gestört hat sie mich nicht.
- Im Feld Gebäude ist «Musterhaus Zentrum – Bahnhofst…» abgeschnitten. Das ist harmlos, der Name ist erkennbar.
- Auf der Detailseite stehen unter dem Leistungszeitraum zwei Sätze: «Nur die Tage in der Abrechnungsperiode zählen.» und «Zählt mit den Tagen ihres Leistungszeitraums, nicht als Lieferung in den Tank.» Sie sagen fast dasselbe zweimal. Ein Satz würde reichen.
- Der gelbe Kasten «Abrechnungen nicht aktuell» ist auf dem Handy sehr lang (Verjährung, Art. 128 OR …). Für mich war nur der erste Absatz mit dem Link wichtig.
- Schritt 2 im Assistenten: Musterhaus Zentrum hat «Keine neue Abrechnung: Alle Mietverträge haben schon eine.», lässt sich aber trotzdem anhaken und bis zur Vorschau durchklicken. In der Vorschau steht dann «Anzahl Abrechnungen 0», und «Weiter» bleibt aktiv. Für diese Aufgabe war das sogar praktisch, weil ich so die Kostenabstimmung sehen konnte.
- Die Vorschau zeigt sauber an, welche Entwürfe veraltet sind (Maria Rossi, Pierre Dubois, Anna Schmidt: «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … erfasst»), jeweils mit Link. Das finde ich gut.
- In Schritt 4 gibt es kein «Abbrechen», nur «Zurück» und «Weiter» (in Schritt 1 gibt es eines). Ich bin über den Breadcrumb «Nebenkostenabrechnungen» hinaus, ohne Rückfrage. Als ich wiederkam, stand «Angaben wiederhergestellt» mit «Angaben verwerfen» da, allerdings bei Schritt 3, nicht bei Schritt 4.
- Auf keiner der besuchten Seiten musste ich seitwärts scrollen (scrollWidth 390, kein Element ragt über den Rand).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Taps/Eingaben: Rechnung erfassen etwa 12, Detailseite lesen, Assistent bis Vorschau 5, Heizung aufklappen 1, verlassen 1.

## Ablauf

- **Neue Rechnung, Leistungszeitraum:** Ich erwartete einen Hinweis, wie ich einen Jahresservice bei Ölheizung eintrage. Zuerst sah ich nur den allgemeinen Text (Quartal, Jahr). Der Text zu Heizöl, Tank und «Tankrevision ist keine Lieferung» erschien erst nach der Wahl von «Heizung», oberhalb meiner Position (P-1).
- **Detailseite:** Ich erwartete nur die gespeicherten Daten. Oben sah ich zusätzlich «Abrechnungen nicht aktuell» für 2025, weil es schon Entwürfe gibt. Das war unerwartet, aber richtig und verständlich. Zur Frage, wie die Rechnung zählt: «Leistungszeitraum 01.01.2025 – 31.12.2025 / Nur die Tage in der Abrechnungsperiode zählen. / Zählt mit den Tagen ihres Leistungszeitraums, nicht als Lieferung in den Tank.» Das verstehe ich ohne Hilfe: Der Service ist kein Öl, er geht mit allen 365 Tagen ganz ins Jahr 2025 und landet bei «Heizung», Verteilschlüssel 70 % Fläche / 30 % Einheit, umlagefähig (Wartung nach Art. 5 VMWG).
- **Assistent Schritt 2:** Ich erwartete, Musterhaus Zentrum normal wählen zu können. Dort stand aber «Keine neue Abrechnung: Alle Mietverträge haben schon eine». Ich habe trotzdem angehakt, und es ging weiter.
- **Vorschau, Hinweise:** Ich erwartete den Satz «nicht als Lieferung in den Tank» auch hier. Er wird nicht angezeigt. Angezeigt werden «In «Heizung» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 2’650.00, Endbestand CHF 2’257.20.», der Leerstand (2.02 und 3.02, je 365 Tage) und die veralteten Entwürfe. Die Brenner-Rechnung steht unter «minus Endbestand» (P-2). Was ich tun würde: die drei Entwürfe über die Links öffnen und dort «Neu berechnen» tippen, damit die 450 Franken drin sind. Es passt alles auf den Handybildschirm: Die Karten stehen untereinander, und die Beträge sind rechtsbündig gut lesbar.

## Vorschläge

- **P-1:** So reproduzieren: Auf dem Handy «Rechnung erfassen» öffnen, Gebäude und Daten eingeben, dann ganz unten Kategorie «Heizung» wählen. Der Text beim Leistungszeitraum oben ändert sich unbemerkt. Was helfen würde: die Kategorie vor den Leistungszeitraum stellen, oder bei der Kategorie selbst kurz sagen «Bei Heizöl, Gas, Pellets: Leistungszeitraum = Liefertag, siehe oben».
- **P-2:** So reproduzieren: Abrechnungen erstellen → 2025 → Musterhaus Zentrum → Weiter bis Vorschau → bei «Heizung» «Rechnungen anzeigen». Was helfen würde: Anfangsbestand, Lieferungen und Endbestand als einen Block zeigen, die übrigen Heizungsrechnungen (Service) als eigenen Block darunter, zum Beispiel «Weitere Heizkosten, keine Lieferung in den Tank». Statt «ganz in dieser Periode» wäre «365 von 365 Tagen» klarer, damit man den Unterschied zur Lieferung sieht.

## Nicht geprüft

- Schritt 5 «Erstellen» und das Erstellen selbst: Die Aufgabe verbietet es, ich bin in Schritt 4 stehen geblieben.
- «Neu berechnen» der veralteten Entwürfe: Das hätte Daten ausserhalb meiner Aufgabe verändert.
- Eine echte Heizöllieferung mit Liefertag habe ich nicht erfasst, weil die Aufgabe nur den Service vorsah. Wie eine Rechnung mit einem Leistungszeitraum über das Jahresende (z. B. 01.07.2025 – 30.06.2026) in der Vorschau erscheint, also ob dort der Hinweis «nicht als Lieferung in den Tank» kommt, habe ich deshalb nicht gesehen.
