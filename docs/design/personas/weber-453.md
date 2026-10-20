# Dr. Weber – «Abgerechnet bis» an zwei Mietverträgen in Alpenblick, Abrechnung 2025 (Runde 453)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 (Version 0.65.3+3-gfdd72b0d), Gebäude «Alpenblick». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-453/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung NK-33333333-2024-0001 / -0002 (Status «Ersetzt») | Der Weg, den die Ablehnung beim Speichern von «Abgerechnet bis» vorgibt («berichtigen Sie zuerst»), endet in einer Sackgasse: «Berichtigte Abrechnung erstellen» scheitert, beide 2024-Abrechnungen bleiben «Ersetzt» mit dem Text «Was der Mieter noch bezahlt oder zurückerhält, steht in der berichtigten Abrechnung», die es nie geben wird. Dass die Mieterin CHF 32.35 schuldet, steht nur in einer Fehlermeldung, die beim nächsten Laden verschwindet; weder Mietvertrag noch Übersicht erinnern daran. |
| P-2 | Minor | Abrechnung 2024 ersetzt, Fehlermeldung | «Der Mietvertrag hat in dieser Abrechnungsperiode keine Mietstage mehr» ist sachlich falsch: Laura Keller hatte 2024 366 Mietstage; sie sind nur ausserhalb von Dwello abgerechnet («Abgerechnet bis 30.06.2025»). |
| P-3 | Minor | Mietvertrag bearbeiten, Ablehnung beim Speichern | Die Ablehnung nennt die bezahlte Abrechnung 2024, sagt aber nicht, was sie bedeutet: dass 2024 dann doppelt abgerechnet wäre (in Dwello und ausserhalb), und dass nach dem Berichtigen keine berichtigte Abrechnung entsteht, sondern die Rückerstattung zurückgefordert werden muss. «jede dieser Abrechnungen» bei nur einer genannten Abrechnung. |
| P-4 | Minor | Abrechnung NK-33333333-2025-0001 (Detail) und Liste | Die Seite sagt «Ihr Mietverhältnis in dieser Periode: 01.07.2025 – 31.12.2025, 184 Mietstage». Das PDF sagt richtig «01.01.2025 – 31.12.2025 … diese Abrechnung umfasst 01.07.2025 – 31.12.2025». Bildschirm und PDF widersprechen sich, und der Bildschirm erwähnt «Abgerechnet bis» nicht. |
| P-5 | Nit | PDF Abrechnung 2025, Legende unter der Kostenübersicht | «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode»: Der Zeitanteil sind hier die 184 abgerechneten Tage, nicht die 365 Mietstage, die der Kopf des PDFs nennt. |
| P-6 | Nit | Mietvertrag Laura Keller, Hinweis «Abrechnung 2025 fehlt» | Der Hinweis fordert weiter auf «Tragen Sie … «Abgerechnet bis» ein», obwohl 30.06.2025 schon eingetragen ist. Er sagt nicht, dass 2025 ab 01.07.2025 abzurechnen ist. |

## Beobachtungen

- Die Meldungen zu einem Datum in der Zukunft und vor dem Vertragsbeginn sind gut (siehe Ablauf). Sie erscheinen erst nach «Änderungen speichern», nicht beim Verlassen des Feldes, obwohl der Wochentag schon beim Verlassen erscheint. Das ist mir recht, da der Fokus danach im Feld steht.
- Rundung: 159.36 wird «auf 5 Rappen gerundet» zu 159.40 (+0.04). Kaufmännisch wären es 159.35. Offenbar wird zugunsten der Mieterin aufgerundet (2024: 32.34 → 32.35). Das steht nirgends.
- PDF, Hinweise: «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Schneeräumung, Kaltwasser, Allgemeinstrom, Heizung.» Im Mietvertrag sind aber 12 Nebenkosten vereinbart. Der Satz liest sich so, als seien nur diese vier vereinbart; gemeint sind die abgerechneten.
- Fehlende Rechnungen 2025 (Kaminfeger, Kaltwasser 2. Halbjahr): Die Vorschau warnt klar und verlangt eine Bestätigung. Für die Mieterin ist im PDF nicht erkennbar, dass «Kaltwasser 470.00» nur das 1. Halbjahr ist, das zeitanteilig auf ihr 2. Halbjahr verteilt wird. Doppelt abgerechnet ist das nicht (es ist ein Verteilen nach Tagen), aber Kosten des 2. Halbjahrs fehlen.
- Heizprofil: Der Assistent nahm «Heizung + Warmwasser»; in der Abrechnung 2024 stand «Heizung Mittelland». Für Interlaken hätte ich «Bergregion» erwartet. Ich habe den Vorschlag ohne Nachfrage stehen lassen, wie ein eiliger Vermieter es täte.
- Das Ausgangsszenario (vor Dwello bis 30.06.2025 abgerechnet) widerspricht den Demodaten: In Dwello gibt es bezahlte Abrechnungen 2024 für beide. Dwello hat das zu Recht nicht stillschweigend übernommen.
- Nach dem Speichern verschwanden die fehlenden Perioden 2021–2023 bei beiden Mietverträgen, und Alpenblick fehlt in der Übersicht unter «Noch nicht abgerechnet». Das ist folgerichtig.

## Aufgabe geschafft: ja

Beide Daten sind gespeichert (nach dem Berichtigen der Abrechnungen 2024). Die Abrechnung 2025 ist erstellt, das PDF erstellt und geprüft. Die Abrechnungen 2024 hängen danach im Status «Ersetzt» (P-1).

## Aufwand

Etwa 25 Minuten und rund 20 Schritte: 2 Mietverträge bearbeitet (6 Speicherversuche), 2 Abrechnungen berichtigt, Assistent in 3 Schritten, PDF und Nachrechnen.

## Ablauf

1. **Mietvertrag Laura Keller öffnen.** Erwartet: «Abgerechnet bis» beim Bearbeiten. Gesehen: Die Vertragsseite zeigt «3 Abrechnungen fehlen» (2025, 2023, 2022) und verweist auf «Abgerechnet bis». Gut geführt.
2. **Bearbeiten, Feld «Abgerechnet bis (optional)».** Der Hilfetext ist lang, aber präzise: letzter Tag der letzten externen Abrechnung, mit Beispiel, und Dwello zählt Mietstage und Akonto erst ab dem Tag danach. Das genügt mir.
3. **31.12.2026 (Zukunft).** Erwartet: Ablehnung. Gesehen nach dem Speichern, rot unter dem Feld, Feld markiert und fokussiert: «Abgerechnet bis kann nicht in der Zukunft liegen. Tragen Sie den letzten Tag der letzten Abrechnung ein, die ausserhalb von Dwello erstellt wurde.» Klar, mit Handlungsanweisung (Screenshot `05-future.png`).
4. **30.06.2022 und 31.10.2022 (vor dem Vertragsbeginn 01.11.2022).** Gesehen: «Abgerechnet bis liegt vor dem Vertragsbeginn 01.11.2022. Lassen Sie das Feld leer, wenn für diesen Mietvertrag noch nichts ausserhalb von Dwello abgerechnet ist.» Gut: Die Meldung nennt das Datum zum Vergleich und den richtigen Ausweg.
5. **30.06.2025 (richtig).** Erwartet: gespeichert. Gesehen: Ablehnung oben im Formular: «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-33333333-2024-0001 (bezahlt) wurde mit den bisherigen Vertragsdaten berechnet. … Stimmt es, berichtigen Sie zuerst jede dieser Abrechnungen.» Fachlich richtig, denn 2024 wäre sonst doppelt abgerechnet. Die Meldung sagt das aber nicht so (P-3). Bei Kevin Fischer (31.12.2025) gleich mit NK-…-2024-0002.
6. **Abrechnung 2024 berichtigen.** Der Dialog erklärt: Die bisherige bleibt erhalten, die berichtigte rechnet die zurückerstatteten CHF 32.35 an, nicht rückgängig zu machen. Bestätigt. Status «Ersetzt», Hinweis «korrigieren Sie jetzt die Vertragsdaten, erstellen Sie danach die berichtigte Abrechnung».
7. **«Abgerechnet bis» erneut speichern.** Bei beiden gespeichert. Die Vertragsseite zeigt «Abgerechnet bis 30.06.2025» bzw. «31.12.2025». Bei Laura bleibt «Abrechnung 2025 fehlt» (P-6), bei Kevin kein Hinweis mehr. Kein Hinweis auf die offene berichtigte Abrechnung 2024.
8. **Berichtigte Abrechnung 2024 (Laura) erstellen.** Erwartet: eine Abrechnung mit 0 Tagen oder eine Erklärung. Gesehen: «Das hat nicht geklappt. Der Mietvertrag hat in dieser Abrechnungsperiode keine Mietstage mehr. Darum gibt es keine berichtigte Abrechnung. Der Mieter schuldet Ihnen die CHF 32.35 …» (P-1, P-2; Screenshot `19-berichtigt-2024.png`). Die Abrechnung bleibt «Ersetzt», und die Seite verspricht weiter eine berichtigte Abrechnung. Bei Kevin habe ich es nicht wiederholt.
9. **Assistent 2025 für Alpenblick.** Der Link «2025 abrechnen» führt direkt zu Schritt 3 (Heizprofil, Verwaltungspauschale 3 %). Vorschau: «Anzahl Abrechnungen 1», Laura Keller «01.07.2025 – 31.12.2025, 184 Mietstage, Akonto CHF 1’140.00 / Abgerechnet bis 30.06.2025 (am Mietvertrag): Mietstage und Akonto ab 01.07.2025 / Kosten CHF 980.64 / Rückerstattung CHF 159.40». Kevin Fischer: «Abgerechnet bis 31.12.2025 (am Mietvertrag). Für diese Abrechnungsperiode erstellt Dwello für diesen Mietvertrag keine Abrechnung.» Das ist genau die Erklärung, die ich wollte. Auch der Satz zum Total («Den Anteil … der Tage, die ausserhalb von Dwello abgerechnet sind, enthält das Total nicht») ist gut. Die Warnung zu fehlenden Rechnungen habe ich bestätigt, danach «Entwürfe erstellen»: 1 Entwurf.
10. **Entwurf prüfen und nachrechnen.**
    - Tage: 01.07.–31.12.2025 = 31+31+30+31+30+31 = 184 von 365. Stimmt.
    - Akonto: 6 × CHF 190 = CHF 1’140. Stimmt; Januar bis Juni sind nicht angerechnet, richtig.
    - Fläche: 72 / (72+98+85 = 255) = 28.235 %.
    - Schneeräumung: 1’300 × 28.235 % = 367.06 × 184/365 = 185.04.
    - Kaltwasser: 470 → 132.71 → 66.90.
    - Allgemeinstrom: 378.90 → 106.98 → 53.93.
    - Heizung: Anfangsbestand 1’792 + Einkauf 4’880 − Endbestand 1’494 = 5’178 → 1’462.02 × (Jul 3.7 + Aug 3.6 + Sep 3.7 + Okt 9.5 + Nov 10.7 + Dez 13.0 = 44.2 %) = 646.21.
    - Zwischensumme 952.08, Verwaltungspauschale 3 % 28.56, total 980.64. Saldo 159.36, gerundet 159.40 (siehe Beobachtungen).
    - Alles stimmt.
11. **PDF erstellen und als Laura Keller lesen.** Kopf: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025. Ihre Nebenkosten und Akontobeiträge bis 30.06.2025 sind mit einer früheren Abrechnung abgerechnet. Diese Abrechnung umfasst 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen).» Zahlungsbox: «Akontobeiträge ab 01.07.2025 CHF 1'140.00». Heizseite: «Anteile der abgerechneten Monate Ihres Mietverhältnisses: Jul … Dez». Als Mieterin verstehe ich, dass die frühere Abrechnung bis 30.06.2025 ging und diese ab 01.07.2025 gilt. Die Akontozahlungen Januar bis Juni sind nicht doppelt angerechnet und gehen nicht verloren, weil sie in der früheren Abrechnung stecken. Welche frühere Abrechnung (Datum, Absender) gemeint ist, sagt das PDF nicht; das genügt mir trotzdem. Kleine Unstimmigkeit in der Legende (P-5).

## Verwirrung

- «Ersetzt» ohne Nachfolger: Was gilt jetzt für 2024, und wo ist festgehalten, dass Laura 32.35 schuldet? (P-1)
- «keine Mietstage mehr»: Ich dachte zuerst, Dwello habe den Mietvertrag verkürzt (P-2).
- Detailseite gegenüber PDF: Ist Lauras Mietverhältnis ab 01.07.2025 oder ab 01.01.2025? (P-4)
- «Mietstage» wird für zwei Dinge gebraucht: die Tage des Mietverhältnisses und die abgerechneten Tage.
- «Abgerechnet bis» als Begriff ist mit dem Hilfetext verständlich.

## Fehlerrisiken

- Ein Vermieter, der die Ablehnung in Schritt 5 nicht versteht, berichtigt die bezahlte Abrechnung 2024. Danach hängt sie ohne Nachfolger, und die Rückforderung von CHF 32.35 (bei Kevin 29.80) geht vergessen.
- Wer umgekehrt zuerst «Berichtigte Abrechnung erstellen» klickt und dann das Datum einträgt, dreht sich im Kreis. Die Reihenfolge steht nur im Dialog.
- Wer die Detailseite statt des PDFs liest, glaubt ein falsches Mietbeginn-Datum (P-4).
- Die Heizprofil-Vorgabe wird leicht übernommen, ohne sie zu prüfen.

## Vorschläge

- **P-1:** Reproduktion: Laura Keller, «Mietvertrag bearbeiten», «Abgerechnet bis» 30.06.2025 → Ablehnung; NK-33333333-2024-0001 «Abrechnung berichtigen»; Datum speichern; «Berichtigte Abrechnung erstellen». Hilfreich wäre:
  - Die ersetzte Abrechnung erhält einen Endzustand, z. B. «Ersetzt, ausserhalb von Dwello abgerechnet», mit dem dauerhaften Text «Rückforderung CHF 32.35 an Laura Keller».
  - Alternativ erstellt Dwello eine berichtigte Abrechnung mit 0 Tagen, die die 32.35 zurückfordert (mit QR-Rechnung).
  - Bis dahin sollen Mietvertrag und Übersicht die offene Berichtigung zeigen.
- **P-2:** Gleicher Weg. Text etwa: «Alle Mietstage dieser Periode sind ausserhalb von Dwello abgerechnet (Abgerechnet bis 30.06.2025). Darum gibt es keine berichtigte Abrechnung. …»
- **P-3:** Gleicher Weg, Schritt 5. Text etwa: «Für 2024 gibt es schon die bezahlte Abrechnung NK-…-0001 in Dwello. Mit Abgerechnet bis 30.06.2025 wäre 2024 doppelt abgerechnet. Ist 2024 wirklich ausserhalb abgerechnet, berichtigen Sie NK-…-0001; Dwello erstellt dann keine neue Abrechnung, und die Rückerstattung von CHF 32.35 fordern Sie zurück.» Singular und Plural nach Anzahl.
- **P-4:** Abrechnung NK-33333333-2025-0001 öffnen, Abschnitt «Mietstage in der Abrechnungsperiode». Den Wortlaut des PDFs übernehmen: Mietverhältnis 01.01.–31.12.2025, abgerechnet ab 01.07.2025 (184 Tage), wegen «Abgerechnet bis 30.06.2025». In der Liste «184 abgerechnete Tage».
- **P-5:** PDF S. 1, Legende. «Zeitanteil: Ihre abgerechneten Tage in der Abrechnungsperiode».
- **P-6:** Mietvertrag Laura Keller nach dem Speichern. Bei gesetztem «Abgerechnet bis» statt der Aufforderung: «Abgerechnet bis 30.06.2025: Dwello rechnet 2025 ab 01.07.2025 ab.»

## Nicht geprüft

- Die berichtigte Abrechnung 2024 für Kevin Fischer habe ich nicht erstellt (gleiches Verhalten erwartet wie bei Laura).
- Den Versand per E-Mail und das ZIP habe ich nicht geprüft, sie gehören nicht zur Aufgabe.
- Andere Sprachen habe ich nicht geprüft.
- Die Beträge auf Rappen prüft `daten-pruefer`; meine Nachrechnung oben stimmt mit Dwello überein.
- Die Rundungsregel (aufrunden zugunsten der Mieterin?) konnte ich als Benutzerin nicht klären.
