# Marco – Rückweg von der Rechnung in den Abrechnungslauf (#1464)

Persona: Marco, 38, Handy 390 × 844, Touch. Persona-App auf http://localhost:3300 (Demodaten), nur angeschaut, nichts gespeichert, keine Abrechnung erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f25d49a8-d120-5c7a-b446-9d1f9eb66d23/scratchpad/marco-1464-back/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, nach «Abrechnungen erstellen» auf der Rechnung | Ich lande nicht in der Vorschau, sondern in Schritt 3 «Heizprofil und Verwaltungspauschale», ganz oben auf der Seite. Bis «Weiter» muss ich auf dem Handy rund viereinhalb Bildschirmhöhen scrollen (die Seite ist 3751 px hoch). In der Vorschau ist «Hauswart» danach wieder zugeklappt, und ich muss die Position erneut suchen. Die Meldung erklärt das zwar («Mit «Weiter» berechnet Dwello die Vorschau neu …»), aber wer mehrere Rechnungen prüfen will, macht diesen Umweg bei jeder Rechnung. |
| P-2 | Minor | Rechnung → «Rechnung bearbeiten» → «Abbrechen» | Nach diesem Abstecher zeigt die Rechnungsseite oben nur noch «Rechnungen», der Rückweg «Abrechnungen erstellen» ist weg. Über das Menü (Nebenkostenabrechnungen → Abrechnungen erstellen) kommen meine Angaben zwar wieder, aber darauf muss ich erst kommen. |

## Beobachtungen

- Der Rückweg auf der Rechnungsseite ist gut zu finden: Als Erstes oben steht der Link «Abrechnungen erstellen ›» (48 px hoch, gut zu tippen). Klar ist mir, dass er zum Erstellen der Abrechnungen führt. Dass er zu *meinem angefangenen* Lauf und nicht zu einem neuen führt, sehe ich aber erst nach dem Tippen. Auf dem Screenshot `07-invoice-top.png` steht darunter «Hauswartung Meier GmbH» zweimal, einmal klein als Brotkrümel, einmal als Titel.
- Meine Angaben bleiben erhalten. Der Test mit geänderten Werten (Heizprofil «Heizung Bergregion», Verwaltungspauschale 2.5 %) zeigt nach der Rückkehr dieselben Werte, die Vorschau danach dieselben Beträge (Total CHF 19’190.60, davon Mieter CHF 14’087.21, davon tragen Sie CHF 5’103.39). Gebäude und Abrechnungsperiode sind als «(erledigt)» abgehakt.
- Die Meldung «Angaben wiederhergestellt» ist verständlich: Sie sagt, wann ich zuletzt bearbeitet habe, dass nichts gespeichert ist und dass «Weiter» die Vorschau neu berechnet. «Angaben verwerfen» fragt vor dem Löschen nach («Angaben verwerfen? Ihre Angaben werden gelöscht.»). Gut so, denn der Knopf steht gross direkt in der Meldung. In der Vorschau steht die Meldung weiterhin oben, dann ohne den Satz zu «Weiter».
- Die Adresse bleibt `…/statements/generate?schritt=3&from=invoice`, auch wenn ich schon in Schritt 4 bin (sehe ich nur in der Adresszeile).
- Die Kostenabstimmung geht auf: Hauswart CHF 3’680.00 = 4 Rechnungen à CHF 920.00. Alle 19 Rechnungen der Periode verteilen sich auf die acht Positionen (1+4+4+4+2+2+1+1). «Rechnungen anzeigen» wird nach dem Tippen zu «Rechnungen ausblenden».
- Die Rechnungsseite selbst zeigt unter «In Abrechnungen enthalten» die vier bestehenden Abrechnungen 2025 (drei Entwürfe, eine überfällig). Das hilft beim Abgleichen.
- «Anzahl Abrechnungen 0» in der Vorschau: Für Musterhaus Zentrum 2025 haben alle Mietverträge schon eine Abrechnung. Die Vorschau sagt das unten auch und bietet «Abrechnungen von Musterhaus Zentrum ansehen» an.
- Bei 2.5 % statt 3 % bleibt die Verwaltungspauschale im Total bei CHF 422.63. Das passt zum Hinweis «Ein eigener Satz im Mietvertrag geht vor», fällt aber auf.
- Rechnungsliste: Vom Brotkrümel «Rechnungen» auf der Rechnung komme ich zur ungefilterten Liste zurück (84 Rechnungen, Seite 1). Meine Filter (Musterhaus Zentrum, Hauswart, 2025) sind weg.

## Aufgabe geschafft: teilweise

Rückweg von einer umlagefähigen Rechnung: ja. Die Zeile «Nicht umlagefähige Rechnungen» gibt es in der Vorschau nicht, deshalb ist dieser Teil nicht geprüft (siehe «Nicht geprüft»).

## Aufwand

Etwa 20 Minuten, 17 Skriptläufe. Pro Rechnung kostet der Weg Vorschau → Rechnung → zurück → Vorschau etwa 8 Tipp- bzw. Scrollschritte (Position aufklappen, Rechnung tippen, «Abrechnungen erstellen», lange scrollen, «Weiter», zur Position scrollen, wieder aufklappen).

## Ablauf

- **Zurück von der Rechnung:** Ich erwartete die Vorschau, wo ich war, mit «Hauswart» aufgeklappt. Ich landete in Schritt 3 von 5 «Heizprofil und Verwaltungspauschale», oben auf der Seite, mit der Meldung «Angaben wiederhergestellt» (`08-back-viewport.png`). Der Fokus liegt auf der Schrittüberschrift.
- **Wieder in der Vorschau:** Ich erwartete die Position «Hauswart» offen oder in Sicht. Die Seite stand oben bei der Schrittliste, «Hauswart» war zugeklappt (`09-preview-again.png`).
- **Rechnung bearbeiten → Abbrechen:** Ich erwartete weiterhin «Abrechnungen erstellen» oben. Dort stand nur «Rechnungen».
- **Dieselbe Rechnung über Menü → Rechnungen:** Erwartet und gesehen: Der Brotkrümel lautet «Rechnungen» und führt zur Liste. Einen Weg zum Abrechnungslauf gibt es dort nicht, das ist richtig so. Dass die Filter der Liste nicht erhalten bleiben, hatte ich nicht erwartet.

## Vorschläge

- **P-1:** Abrechnungen erstellen → Weiter → Musterhaus Zentrum → Weiter → Weiter (Vorschau) → bei «Hauswart» «Rechnungen anzeigen» → erste Rechnung tippen → oben «Abrechnungen erstellen» tippen. Hilfreich wäre: direkt in Schritt 4 «Vorschau» landen (neu berechnet, mit dem Hinweis), bei der Position, von der ich kam, mit ihren Rechnungen offen. Geht das nicht, dann wenigsten in Schritt 3 den «Weiter»-Knopf zuerst zeigen bzw. dorthin scrollen.
- **P-2:** Wie P-1 bis zur Rechnung → «Rechnung bearbeiten» → «Abbrechen». Hilfreich wäre: den Rückweg zum Abrechnungslauf über Bearbeiten und Abbrechen (und nach dem Speichern) mitgeben, damit oben wieder «Abrechnungen erstellen» steht.

## Nicht geprüft

- **Nicht umlagefähige Rechnungen:** In der Vorschau von Musterhaus Zentrum 2025 gibt es diese Zeile nicht. Probiert habe ich auch Alpenblick 2025 und Seepark Residenz 2025 (nur angeschaut): keine solche Zeile. Alle 19 Rechnungen von Musterhaus Zentrum 2025 stehen in umlagefähigen Positionen. Den Rückweg von einer nicht umlagefähigen Rechnung konnte ich deshalb nicht prüfen.
- Speichern nach «Rechnung bearbeiten» und der Rückweg danach: ausgelassen, weil ich nichts speichern sollte.
