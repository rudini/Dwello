# Dr. Weber – Verwaltungspauschale pro Mietvertrag (Issue 89)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Persona-App auf http://localhost:3300 mit Demodaten, gespeichert nur im Gebäude «Alpenblick». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/dr-weber-issue-89/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Verwaltungspauschale | Der Hilfetext «Üblich sind bis 3 %, höchstens 10 %» liest sich wie eine gesetzliche Obergrenze. OR und VMWG nennen keine 10 %. Erlaubt sind die Kosten nach Aufwand oder nach üblichen Ansätzen (Art. 4 Abs. 3 VMWG), und 10 % wären kaum «üblich». Ein Laie hält 10 % so für zulässig. |
| P-2 | Minor | Assistent Schritt 3, Eingabe 12 | Gleichzeitig erscheinen die Ablehnung («von 0 bis 10») und die Warnung «Über dem üblichen Richtwert … Prüfen Sie, ob der Mehraufwand begründet ist». Die Warnung lässt glauben, ein begründeter Mehraufwand erlaube 12 %. Dwello lehnt aber trotzdem ab. Die Grenze von 10 % nennt der Hilfetext im Assistenten nicht, erst die Fehlermeldung nach «Weiter». |
| P-3 | Minor | Abrechnung Kevin Fischer (Bildschirm) | Dort steht «Verwaltungspauschale 0 % der Zwischensumme CHF 0.00», ohne Grund. Der Assistent sagt dagegen «Ohne vereinbarte Verwaltungspauschale enthält die Abrechnung keine», und das PDF zeigt richtigerweise keine Zeile. Die Ansicht widerspricht also dem Assistenten und dem PDF, und dass die Pauschale «nicht vereinbart» ist, steht nirgends. |
| P-4 | Nit | Assistent Schritt 4 (Vorschau) | Die Vorschau nennt nur den Satz des Laufs («3 % … Ein eigener Satz im Mietvertrag geht vor»). Sie zeigt aber nicht, welcher Mietvertrag welchen Satz und welchen Betrag bekommt. Pro Mietvertrag steht nur «Kosten», und dass die Pauschale darin enthalten ist, sehe ich nicht. |

## Beobachtungen

- Die Mietverträge und der Assistent stimmen überein: Laura Keller hat «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs», Kevin Fischer «Nicht vereinbart». Im Assistenten erscheint in Schritt 3 nur Kevin Fischer unter «Ohne vereinbarte Verwaltungspauschale», mit Link auf seinen Mietvertrag. Das entspricht Art. 257a Abs. 2 OR, gut gelöst.
- Der Hilfetext im Bearbeitungsformular des Mietvertrags ist vorbildlich: drei Varianten («Ja, zum Satz des Abrechnungslaufs», «Ja, mit eigenem Satz», «Nein»), dazu der Hinweis auf das amtliche Formular für eine neue Pauschale während der Mietdauer (Art. 269d OR). Das ist rechtlich zutreffend.
- Im PDF von Laura Keller steht «Verwaltungspauschale: 3 % der Zwischensumme von CHF 2'068.77 … 62.06». Das ist transparent und nachrechenbar. Auf welcher Grundlage die Pauschale verrechnet wird (z. B. «gemäss Mietvertrag»), steht nicht da. Ein Mieter könnte danach fragen.
- Die Begriffe wechseln: Einstellungen und Assistent sprechen von den «eigenen Nebenkosten jedes Mieters», Bildschirm und PDF von der «Zwischensumme». Gemeint ist offenbar dasselbe, nämlich der Anteil des Mieters ohne den Leerstand.
- Bei Laura Keller hat «Allgemeinstrom» einen Anteil von 28.23 %, die anderen Positionen 28.24 %, obwohl der Schlüssel jedes Mal 72/255 m² ist. Das ist offenbar ein Rundungseffekt der Anzeige, der Betrag 106.98 stimmt.
- Dezimalkomma und Dezimalpunkt («2,5» und «2.5») akzeptiert der Assistent beide.
- Abgelehnte Eingaben (30 in den Einstellungen, 12 im Assistenten) bleiben im Feld stehen und sind rot markiert, der Fokus springt ins Feld. Gespeichert wird nichts: Nach dem Neuladen stehen in den Einstellungen wieder 3.

## Aufgabe geschafft: ja

## Aufwand

Rund 25 Minuten. Erstellen im Assistenten: 5 Schritte plus 1 Bestätigung («Die Abrechnungen trotzdem erstellen») plus «Entwürfe erstellen». Danach 2 Abrechnungen, 2 PDFs, 2 Mietverträge, das Bearbeitungsformular eines Mietvertrags und die Einstellungen geöffnet.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die fehlende Abrechnung 2025. Gesehen: «Noch nicht abgerechnet: Alpenblick» mit «Abrechnungen erstellen». Stimmt.
2. **Mietverträge Alpenblick geöffnet.** Laura Keller (Wohnung EG, seit 01.11.2022): «Verwaltungspauschale: Vereinbart, Satz des Abrechnungslaufs». Kevin Fischer (Wohnung OG1, seit 01.05.2021): «Nicht vereinbart». OG2 steht leer.
3. **Assistent, Schritt 1.** Vorgeschlagen ist 01.01.2025 – 31.12.2025, wie erwartet.
4. **Schritt 2.** «Alpenblick … 6 Rechnungen in der Abrechnungsperiode, 3 Wohnungen» gewählt.
5. **Schritt 3 «Heizprofil und Verwaltungspauschale».** Erwartet: Satz 3 % und ein Hinweis, für wen er gilt. Gesehen: vorgeschlagen 3. Der Hilfetext lautet «Prozentsatz der eigenen Nebenkosten jedes Mieters, für dessen Mietvertrag eine Verwaltungspauschale vereinbart ist. Üblich sind bis 3 %. Steht im Mietvertrag ein eigener Satz, gilt dieser. Ohne vereinbarte Verwaltungspauschale enthält die Abrechnung keine.» Darunter steht der Kasten «Ohne vereinbarte Verwaltungspauschale … Ihre Abrechnungen enthalten keine Pauschale (0 %). Steht im Mietvertrag eine, tragen Sie sie dort nach.» mit dem Link «Kevin Fischer, Wohnung OG1». Das passt zu den Mietverträgen.
6. **Schritt 3 mit 12.** Erwartet: Ablehnung oder eine deutliche Warnung. Gesehen: Sofort erscheint «Über dem üblichen Richtwert – … Prüfen Sie, ob der Mehraufwand begründet ist.» Nach «Weiter» kommt zusätzlich «Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.», und der Assistent bleibt in Schritt 3. Beide Meldungen stehen untereinander (P-2).
7. **Schritt 3 zurück auf 3, Schritt 4 Vorschau.** Gesehen: «Anzahl Abrechnungen 2», «Kosten aller Abrechnungen CHF 4’946.67» und «Verwaltungspauschale: 3 % der eigenen Nebenkosten jedes Mieters mit vereinbarter Verwaltungspauschale. Ein eigener Satz im Mietvertrag geht vor.» Dazu die Warnung «Möglicherweise fehlen Rechnungen» (Kaminfeger fehlt ganz, Kaltwasser fehlt im 2. Halbjahr). Pro Mietvertrag: Keller «Kosten CHF 2’130.83, Rückerstattung CHF 149.15», Fischer «Kosten CHF 2’815.84, Rückerstattung CHF 184.15». Die Pauschale pro Mietvertrag ist nicht ausgewiesen (P-4).
8. **Bestätigung und Schritt 5.** «Die Abrechnungen trotzdem erstellen» angekreuzt, dann «Entwürfe erstellen». Ergebnis: «2 Nebenkostenabrechnungen sind als Entwurf erstellt.» (NK-33333333-2025-0001 Keller, -0002 Fischer).
9. **Abrechnung Keller nachgerechnet.**
   - Positionen: Schneeräumung 367.06, Kaltwasser 132.71, Allgemeinstrom 106.98, Heizung 1’462.02, zusammen 2’068.77. Das stimmt.
   - Der Schlüssel 72/255 m² ergibt 28.235 %, die Beträge stimmen. Heizung: 1’792.00 + 4’880.00 − 1’494.00 = 5’178.00, davon 72/255 = 1’462.02.
   - Verwaltungspauschale: 3 % × 2’068.77 = 62.063, also CHF 62.06. Stimmt.
   - Gesamt 2’130.83, Akonto 12 × 190 = 2’280.00, Rückerstattung 149.17, auf 5 Rappen gerundet 149.15. Stimmt.
10. **Abrechnung Fischer nachgerechnet.** Positionen zusammen 2’815.84 (98/255 = 38.43 %). Pauschale 0, wie es sein muss, weil sie nicht vereinbart ist. Akonto 12 × 250 = 3’000.00, Rückerstattung 184.16, gerundet 184.15. Stimmt. Auf dem Bildschirm steht aber «0 % der Zwischensumme CHF 0.00» (P-3).
11. **PDFs.** «PDF erstellen», dann «PDF herunterladen».
    - Keller, 2 Seiten: Zeile «Verwaltungspauschale: 3 % der Zwischensumme von CHF 2'068.77 … 62.06», dazu die Hinweise zu Art. 257b Abs. 2 OR und Art. 8 Abs. 1 und 2 VMWG. Der Screenshot zeigt eine saubere Kostenübersicht mit Zwischensumme, Pauschale, «Ihre Nebenkosten» und Rundung.
    - Fischer: keine Zeile für die Pauschale, nach der Zwischensumme direkt «Ihre Nebenkosten 2'815.84». So ist es richtig.
12. **Rechtliche Beurteilung der Beträge.**
    - Keller: 3 % auf ihren Anteil an den Nebenkosten inklusive Heizung, also CHF 62.06. Das liegt im üblichen Rahmen (Art. 4 Abs. 3 VMWG) und ist vertraglich vereinbart (Art. 257a Abs. 2 OR). Plausibel und zulässig.
    - Fischer: Ohne Vereinbarung wird keine Pauschale verrechnet. Das ist richtig.
    - Der Anteil der leeren Wohnung OG2 trägt der Vermieter, und die Pauschale wird darauf nicht erhoben. Das ist korrekt.
13. **Einstellungen mit 30.** Erwartet: Ablehnung. Gesehen: Nach «Einstellungen speichern» kommt die Fehlermeldung «Bitte geben Sie einen Prozentsatz von 0 bis 10 …». Das Feld zeigt weiter 30 und ist rot, der Fokus liegt im Feld. Nach dem Neuladen stehen wieder 3. Der Tippfehler wird also abgefangen. Gut.

## Verwirrung

- «eigene Nebenkosten» (Einstellungen, Assistent) und «Zwischensumme» (Abrechnung, PDF) sind zwei Wörter für dieselbe Basis.
- «Satz des Abrechnungslaufs»: Was ein «Abrechnungslauf» ist, steht nirgends. Gemeint ist offenbar der Durchgang durch den Assistenten.
- «höchstens 10 %»: Es ist nicht klar, ob das eine Regel von Dwello ist oder eine gesetzliche Grenze (P-1).
- «Richtwert von 3 %» und «Mehraufwand begründet»: Begründet gegenüber wem? Und was folgt daraus, wenn Dwello über 10 % ohnehin ablehnt (P-2)?

## Fehlerrisiken

- Ein Laie setzt im Vertrauen auf «höchstens 10 %» einen Satz von 8–10 %. Ein Mieter kann das anfechten, weil es nicht «üblich» ist (P-1).
- Beim Durchsehen der Entwürfe hält der Vermieter die Zeile «0 %» bei Fischer für einen Fehler und trägt im Mietvertrag eine Pauschale nach, die nicht vereinbart ist (P-3).
- In der Vorschau sieht der Vermieter vor dem Erstellen nicht, welcher Mietvertrag eine Pauschale erhält. Ein falsch erfasster Mietvertrag fällt erst in der einzelnen Abrechnung auf (P-4). Die Liste «Ohne vereinbarte Verwaltungspauschale» in Schritt 3 mindert das Risiko.

## Vorschläge

- **P-1:** Einstellungen öffnen und den Hilfetext unter «Verwaltungspauschale in %» lesen. Hilfreich wäre, die 10 % als Grenze von Dwello zu kennzeichnen, z. B. «Dwello nimmt höchstens 10 % an; zulässig ist nur, was üblich ist oder Ihrem Aufwand entspricht (Art. 4 Abs. 3 VMWG).»
- **P-2:** Assistent bis Schritt 3, «12» eingeben, dann «Weiter». Bei einem Wert über 10 die Warnung zum Richtwert nicht zeigen, sondern nur die Ablehnung. Die Grenze von 10 % gehört schon in den Hilfetext des Assistenten.
- **P-3:** Abrechnung NK-33333333-2025-0002 (Kevin Fischer) öffnen. Bei einem Mietvertrag ohne vereinbarte Pauschale die Zeile weglassen, wie im PDF, oder «Keine Verwaltungspauschale (im Mietvertrag nicht vereinbart)» schreiben.
- **P-4:** Assistent bis Schritt 4. Pro Mietvertrag die Pauschale ausweisen, z. B. «Verwaltungspauschale 3 %: CHF 62.06» bei Keller und «keine (nicht vereinbart)» bei Fischer.

## Nicht geprüft

- Ein Mietvertrag mit «Ja, mit eigenem Satz»: Alpenblick hat keinen. Einen Mietvertrag zu ändern gehörte nicht zur Aufgabe, darum habe ich das Formular nur angesehen und nicht gespeichert. Ob der eigene Satz Vorrang vor dem Satz des Laufs hat, ist also nicht belegt.
- Einen Satz von 10 % habe ich nicht gespeichert, weil er sich auf die gemeinsamen Einstellungen auswirkt. Geprüft habe ich nur die Ablehnung von 30.
- Die QR-Rechnung: Beide Abrechnungen ergeben eine Rückerstattung, darum gibt es keinen Einzahlungsschein.
- Die Beträge im Detail (Rechnungen, Abgrenzung, fehlende Kaminfeger-Rechnung) sind Sache von `daten-pruefer`. Ich habe nur die Rechnung im Dokument nachvollzogen.
- Andere Sprachen als Deutsch.
