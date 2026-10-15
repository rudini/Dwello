# Fachreview #208, Runde 2 (Umsetzung)

Gegenstand: `git diff c91aa8e 0d49b67` im Worktree `review-208-fach2` (Commit `0d49b67`). Geprüft wurden:
- D-2: `handleMidYearMoves` in `backend/src/services/prorating.service.ts:208-209`;
- D-3: die Spalten `position_rental_days` und `billed_days`, `daysOf` in `calculation.service.ts:140-151`, `timeShare` und `sharesNote` in `pdf.service.ts`, `sharesNoteDays` in de/fr/it/en;
- Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md:145`;
- die Szenarien in `tests/e2e/features/statement-detail.feature:190-218` und die Tests in `statement-pdf.pg.test.ts` und `prorating.pg.test.ts`.

Quellen:
- `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md`;
- Fedlex-Filestore: VMWG SR 221.213.11, Fassung 20251001; OR SR 220, neueste Fassung im Filestore 20270701. Die URLs habe ich über den SPARQL-Endpunkt `fedlex.data.admin.ch` gefunden, `mmx search` führte zur Fedlex-Seite der VMWG.

Vorbericht: `docs/reviews/issue-208-fachreview-1.md`.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Nit | Die Erläuterung trennt die Fälle des Zeitanteils einmal mit «;» und einmal mit «,». Wenn beide Zusätze stehen, liest sich der Heizkosten-Teil wie ein Teil des Leistungszeitraum-Falls (alle vier Sprachen). |
| V-2 | Verwalter | Nit | Der neue Satz in Regel 5 sagt «Position» und «Periode». Die Glossarbegriffe heissen «Abrechnungsposition» und «Abrechnungsperiode». |
| V-3 | Verwalter | Nit | Die Daten des Leistungszeitraums stehen nicht im PDF. Woher y kommt (z. B. die 62), sieht der Mieter erst in den Belegen. Optionaler Punkt aus F-1, weiterhin offen. |
| V-4 | Verwalter | Nit | Im französischen PDF steht vor «;» und «:» ein normales Leerzeichen und kein geschütztes. Das gab es schon vor der Änderung; der neue Text folgt nur dem bestehenden Muster. |

Kein Blocker, kein Major. Die Befunde der Runde 1 sind erledigt, ausser F-3 (#75) und F-8 (#226), die als offene Arbeit weitergeführt werden (siehe «Bestätigt»).

## Befunde

### V-1 (Nit): Satzzeichen zwischen den Fällen des Zeitanteils

**Beleg.**
- `pdf.service.ts:87-89`: Die Erläuterung setzt sich aus `sharesNote` und den Zusätzen `sharesNoteDays` und `sharesNoteHeating` zusammen.
- Mit beiden Zusätzen ergibt das auf Deutsch: «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode, bei Heizkosten der Anteil nach dem Heizprofil.»
- Beide Zusätze erscheinen zusammen bei einem Ein- oder Auszug, wenn das Heizprofil gilt und es eine Rechnung mit Leistungszeitraum gibt.
- fr (`:156-157`), it (`:224-225`) und en (`:292-293`) sind gleich gebaut.

**Warum.** Nach Regel 5 gilt das Heizprofil auch für eine Heizkostenrechnung mit Leistungszeitraum. Inhaltlich ist der Satz also nicht falsch. Wegen des Kommas wirkt «bei Heizkosten …» aber wie eine Unterregel des Leistungszeitraum-Falls statt wie ein dritter, gleichrangiger Fall.

**Korrektur.** In allen vier Sprachen `sharesNoteHeating` mit «; » beginnen lassen (fr « ; »), z. B. de «; bei Heizkosten der Anteil nach dem Heizprofil». `statement-pdf-render.test.ts:72` prüft nur «bei Heizkosten der Anteil nach dem Heizprofil» ohne das Satzzeichen davor und bleibt deshalb grün.

### V-2 (Nit): Begriffe im neuen Satz von Regel 5

**Beleg.** `docs/nebenkostenabrechnung-anforderungen.md:145`: «y sind die Tage, die die Rechnungen der Position in der Periode abrechnen … Eine Position aus Rechnungen über verschiedene Tage …». Im Glossar stehen «Abrechnungsposition» (`UBIQUITOUS_LANGUAGE.md:130`) und «Abrechnungsperiode» (`:129`).

**Warum.** Die Kurzform «Periode» verwendet Regel 5 schon vorher, ebenso das Dokument «Position» (`:43`, `:68`). Die Bedeutung ist also eindeutig. Für eine neue Regel wäre der Glossarbegriff trotzdem sauberer.

**Korrektur.** «der Abrechnungsposition» und «Eine Abrechnungsposition aus Rechnungen …» schreiben. «Periode» kann bleiben wie im übrigen Text der Regel.

### V-3 (Nit): Der Leistungszeitraum steht nicht im PDF

**Beleg.**
- In D-3 druckt das PDF «Hauswart … 31/62 Tage 303.26» und die Erläuterung «… von dessen Tagen in der Periode».
- Die Kopfzeile nennt «47 Mietstage von 92 Tagen».
- Die Daten 01.07.–30.09.2025 der Rechnung erscheinen nirgends.

**Warum.** Die Erläuterung sagt jetzt richtig, was y ist; damit ist F-1 erledigt. Nachrechnen kann der Mieter die 62 aber erst mit dem Beleg. Das ist zulässig: Art. 257b Abs. 2 OR (Fedlex, verbatim) lautet: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Für eine nachvollziehbare Abrechnung (Thema 2, `:39`, unsicher-B) wäre es aber besser, den Zeitraum zu drucken.

**Korrektur (offene Arbeit).** Den Leistungszeitraum bei einer Position mit einer einzigen Rechnung in der Zeile nennen (z. B. «Hauswart (01.07.–30.09.2025)»), oder in #226 bei der Belegliste mitlösen. Vorschlag: als Ergänzung in #226 aufnehmen; ein eigenes Issue braucht es nicht.

### V-4 (Nit): Geschütztes Leerzeichen vor «;» und «:» im französischen PDF

**Beleg.**
- `pdf.service.ts:155-156`: Vor « : » und « ; » steht das Byte 0x20.
- Die Datei enthält kein einziges U+00A0 (`grep -c` ergibt 0).
- `docs/design/i18n-begriffe.md:5` verlangt U+00A0 nur innerhalb von Guillemets. Der neue Text verletzt die Vorgabe also nicht.

**Warum.** Nach französischer Typografie steht vor «;» und «:» ein geschütztes Leerzeichen. Ein normales Leerzeichen erlaubt pdfkit, die Zeile davor umzubrechen, sodass «;» am Zeilenanfang steht. Das gab es schon vor der Änderung, und es betrifft alle französischen PDF-Texte.

**Korrektur.** Nicht in #208. Als Zeile in `docs/design/offene-punkte.md` (Usability) aufnehmen, oder in #83, falls es dort um die französische Typografie geht.

## Bestätigt

### Die Befunde der Runde 1

- **F-1 (Major) erledigt.** `sharesNoteDays` erklärt den Bruch einer Rechnung mit Leistungszeitraum: de «Ihre Mietstage darin von dessen Tagen in der Periode».
  - Der Zusatz erscheint nur, wenn eine Zeile nach Tagen geteilt ist und ihr Nenner von den Tagen der Abrechnungsperiode abweicht (`pdf.service.ts:623`).
  - Das ist die richtige Bedingung: Ist y gleich der Zahl der Tage der Abrechnungsperiode, deckt die Rechnung die ganze Periode ab, und x ist gleich den Mietstage. Dann genügt der erste Satz.
  - Die Erläuterung widerspricht der Zeile nicht mehr.
  - Geprüft wird das im Szenario `statement-detail.feature:218` und im Test `statement-pdf.pg.test.ts:113-115`.
- **F-2 erledigt.** Das Beispiel ist der Mietvertrag 15.06.–31.07.2025. Die Mietstage sind 16 + 31 = 47, im Leistungszeitraum innerhalb der Periode (01.07.–31.07.) sind es 31. Erwartet wird «31/62 Tage» (`feature:217`, Test `:110`). Eine Umsetzung, die Mietstage/abgerechnete Tage druckt, ergäbe «47/62 Tage» und fiele durch.
- **F-3 als offene Arbeit weitergeführt.** Die drei vorgeschlagenen Begriffe stehen als Kommentar in #75 (offen). Der Marker `TODO(fachlich prüfen, #75)` steht in `schema.ts:408`. Die Spaltennamen folgen dem Vorschlag (`position_rental_days`, nicht `rented_days`).
- **F-4 erledigt.** Das D-2-Szenario prüft den Hinweis nach Art. 8 Abs. 1 VMWG (`feature:203`); der pg-Test prüft ihn ebenfalls (`:103`).
  - Art. 8 Abs. 1 VMWG (Fedlex, Fassung 01.10.2025, verbatim): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.»
- **F-5 erledigt.** Zwei Tests decken es ab:
  - `statement-pdf.pg.test.ts:79-83`: Einzug am 01.07. in der Jahresperiode, durch `generateStatement` bis zum PDF. Erwartet werden «41.50 %» und die Monatsanteile; die Teilperiode behält also Prozent und Heizprofil.
  - Neu `prorating.pg.test.ts:126-140` (C-1): die Teilung durch die Anteile der Periode.
- **F-6 erledigt.** Für eine Zeile nach dem Heizprofil bleibt `shareDays = noDays` (`calculation.service.ts:314`, gesetzt nur im Zweig nach Tagen `:339`), und `timeShare` prüft `byProfile` zuerst (`pdf.service.ts:437`). Eine Zeile nach dem Heizprofil druckt also nie gespeicherte Tage.
- **F-7 erledigt.** Regel 5 beschreibt jetzt den Druck als «x/y Tage»: den Nenner y, den Mietvertrag über die ganze Periode ohne Heizprofil-Hinweis und Prozent bei gemischten Rechnungen und beim Heizprofil. Das stimmt mit dem Code überein (`daysOf`, `timeShare`). Zum Wortlaut siehe V-2.
- **F-8 als offene Arbeit weitergeführt** in #226 (offen). Der Test `statement-pdf.pg.test.ts:118-133` sichert ab, dass in diesem Fall Prozent gedruckt wird und der Zusatz fehlt.

### D-2 (Regel 5): Ein Mietvertrag über die ganze Periode trägt die Heizkosten nach Tagen

- **Code.** `prorating.service.ts:209` gibt `{ byDays: true }` zurück, wenn der effektive Beginn ≤ Periodenbeginn und das effektive Ende ≥ Periodenende ist. Weil `effectiveStart = max(Vertragsbeginn, Periodenbeginn)` ist, heisst das: Vertragsbeginn ≤ Periodenbeginn und Vertragsende leer oder ≥ Periodenende. Das ist genau die Bedingung «kein Ein- oder Auszug» aus Regel 5 (`:145`, verbatim): «Kosten einer Heizkosten-Kategorie werden für einen Mietvertrag, der nur einen Teil der Periode läuft (Ein- oder Auszug), nach dem Heizprofil … verteilt».
- **PDF.** `heatingOf` (`statement-pdf.service.ts`) ruft dieselbe Funktion mit den Mietdaten der Periode auf. Die Rechnung und das PDF treffen also dieselbe Entscheidung.
- **Hilfetext.** `statements_heating_help` («Verteilt die Heizkosten bei einem Mieterwechsel auf die Monate») passt jetzt zum Code.
- **Nachgerechnet:**
  - Jahr 2024 (Schaltjahr), ganz gemietet: 366/366 = 1. Das ergibt denselben Betrag wie vorher mit dem Heizprofil (100 %). Das Szenario erwartet «366/366 Tage».
  - Periode 01.07.–31.12.2025, ganz gemietet: 184/184. Das ergibt 600.00 × 1 = 600.00 (Test `:101`).
  - Randfall Mieterwechsel: A bis 30.06., B ab 01.07. Beide Verträge laufen nur einen Teil der Periode und bleiben beim Heizprofil, unverändert.
  - Einzug am 01.10. in der Periode Juli–Dezember, Heizprofil Mittelland: 40.5 / 41.5 = 0.975904. Bei Heizkosten von 10 000 ergibt das 9759.04 (Test C-1). Selbst nachgerechnet: Oktober 10 + November 13.5 + Dezember 17 = 40.5; Juli 0 + August 0 + September 1 + 40.5 = 41.5.
  - Randfall 0: Heizkosten 0.00 ergeben nach Tagen wie nach dem Heizprofil 0.00.
- **Ältere Abrechnung**, deren PDF neu erzeugt wird: gespeichert ist ein Zeitanteil von 1.0, Tage sind keine gespeichert, und `heatingOf` meldet jetzt «nach Tagen». `timeShare` druckt dann «Mietstage/Tage der Periode» = 1, passend zum Betrag.

### D-3: «x/y Tage» mit y = die Tage, die die Rechnungen der Position in der Periode abrechnen

- **Code.**
  - `daysOf` speichert x und y nur, wenn alle Rechnungen der Gruppe dieselben Tage abrechnen; `inPeriod` ist bereits auf die Periode zugeschnitten.
  - x ist die Schnittmenge des Mietvertrags mit diesen Tagen; `days()` begrenzt das nach unten auf 0.
  - Ohne Leistungszeitraum ist y die Zahl der Tage der Abrechnungsperiode. Das gilt auch für den Tankbestand (`fuel-stock.service.ts:98`).
  - Wenn alle Rechnungen dieselben Tage abrechnen, ist der gewichtete `rentalShare` gleich x/y. Der gedruckte Bruch passt also zum Betrag.
- **Nachgerechnet:**
  - Hauswart 900.00, Leistungszeitraum 01.07.–30.09.2025 (92 Tage), Periode 01.06.–31.08.2025: in der Periode 62 Tage. Kosten der Liegenschaft: 900 × 62/92 = 606.5217, also CHF 606.52. Mieter 15.06.–31.07.: 31/62, also 606.52 × 31/62 = 303.26. Der Test (`:110`) erwartet «606.52 606.52 31/62 Tage 303.26».
  - Ohne Leistungszeitraum: Hauswart 1'200.00 bei 184/365, also 1200 × 184 / 365 = 604.93 (Test `:130`). y ist gleich den Tagen der Periode, deshalb erscheint kein Zusatz in der Erläuterung.
  - Randfall 0: Mietvertrag 01.06.–30.06. und die Rechnung über 01.07.–30.09. ergeben «0/62 Tage», Betrag 0.00. Das ist richtig und nachvollziehbar.
  - Randfall Gutschrift: Eine Gutschrift von −600.00 über dieselben Tage ergibt dieselbe Gruppe und einen Gesamtbetrag von 300.00. Der Bruch 31/62 bleibt, 300 × 31/62 = 150.00. Ergeben Rechnung und Gutschrift zusammen 0 (`rentalShare` = 0), druckt das PDF «31/62 Tage» bei einem Wohnungsanteil von 0.00 und einem Betrag von 0.00. Das geht auf.
  - Randfall Mieterwechsel in der Periode: Jahresperiode, Hauswart 900.00 über 01.04.–30.09. (183 Tage), A bis 30.06., B ab 01.07. A: 91/183, also 447.54; B: 92/183, also 452.46. Zusammen 900.00 = Wohnungsanteil. Beide PDFs zeigen den Zusatz, weil 183 ≠ 365.
  - Gemischte Rechnungen (Test `:118`): Juni 600.00 über 01.06.–30.06. und der Hauswart oben. Der Mieter trägt 600 × 16/30 = 320.00 plus 303.26, zusammen 623.26 von 1'206.52 = 51.66 %. Mit dem gedruckten Prozentwert käme der Mieter auf 1206.52 × 0.5166 = 623.29, also 3 Rappen Differenz. Das ist der in #226 erfasste Mangel; #208 behebt ihn nicht.

### Wortlaut von `sharesNoteDays` in vier Sprachen

Geprüft gegen `UBIQUITOUS_LANGUAGE.md` und `docs/design/i18n-begriffe.md` (Tabelle, Zeilen 9-73):

| Sprache | Text | Begriffe |
|---|---|---|
| de | «; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode» | Rechnung, Leistungszeitraum (`:58`), Mietstage (`:137`): Glossar. «dessen» bezieht sich auf den Leistungszeitraum. «Ihre Mietstage darin» ist richtig, weil Mietstage per Definition in der Abrechnungsperiode liegen. |
| fr | « ; pour une facture avec période de prestation, vos jours de location compris dans celle-ci sur ses jours dans la période» | facture, jours de location (i18n-Tabelle), période de prestation (wie `messages/fr.json`, 7 Stellen, und `sharesNote`). «sur» wie in `tenancyLine` («jours sur»). «celle-ci» bezieht sich auf die zuletzt genannte période de prestation. |
| it | «; per una fattura con periodo di prestazione, i suoi giorni di locazione nel periodo di prestazione sui giorni di tale periodo compresi nel periodo di conteggio» | fattura, giorni di locazione, periodo di conteggio (i18n-Tabelle), periodo di prestazione (wie `messages/it.json`). Lei-Form («i suoi»), «su» wie in `tenancyLine`. Lang, aber eindeutig. |
| en | «; for an invoice with a service period, your days rented within it out of its days in the period» | invoice, days rented (i18n-Tabelle), service period (wie `messages/en.json`). |

Ergebnis: Alle vier Fassungen geben Regel 5 richtig wieder und verwenden die festgelegten Begriffe. Offen ist nur V-1 (Satzzeichen).

Lücke, die schon vor der Änderung bestand: «Leistungszeitraum» hat in `i18n-begriffe.md` keine Zeile. Die Übersetzungen kommen aus dem PDF und `messages/*.json` und sind dort einheitlich. Vorschlag: die Zeile «Leistungszeitraum | période de prestation | periodo di prestazione | service period» in `i18n-begriffe.md` nachtragen, als Teil von #75 oder #83. Das ist kein Glossar-Edit, weil `i18n-begriffe.md` nicht das Glossar ist.

### Mietrecht

- **Art. 257b Abs. 1 OR** (Fedlex, verbatim): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Die Änderung verteilt keine anderen Kosten und keinen anderen Gesamtbetrag. D-2 lässt die Beträge gleich (100 % = y/y), D-3 ändert nur die Darstellung.
- **Art. 8 Abs. 2 VMWG** (Fedlex, verbatim): «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Der Hinweis auf die Belegeinsicht bleibt (Test `:154-159`).
- Dass bei einem Mietvertrag über die ganze Periode kein Heizprofil-Hinweis gedruckt wird, ist zulässig; die Begründung steht in Runde 1, mit derselben Einschränkung (unsicher, siehe unten).

### Szenarien

- `statement-detail.feature:190-203` (D-2) und `:205-218` (D-3) verwenden nur Glossarbegriffe: Liegenschaftsverwalter, Mieter, Mietvertrag, Nebenkostenabrechnung, Heizprofil, Mietstage, Leistungszeitraum, Rechnung.
- «Hauswart» ist eine Kategorie der Testdaten; «Periode» steht kurz für Abrechnungsperiode, wie in Regel 5.
- Die Zahlen der Kommentare stimmen: 31 der 62 Tage; 366/366 für 2024.

## Nicht bestätigt

- **PDF in fr/it/en:** Ich habe die Strings in `pdf.service.ts` gelesen und zusammengesetzt, aber kein PDF in diesen Sprachen erzeugt. Ein Bash-Aufruf im Worktree-Backend wurde verweigert, und die App auf :3300 habe ich nicht benutzt. Getestet ist nur die deutsche Fassung (`statement-pdf.pg.test.ts:114`). Einen Test, der prüft, dass alle vier Übersetzungen dieselben Schlüssel haben, habe ich in `backend/src/__tests__` nicht gefunden. Die vier Schlüssel `sharesNoteDays` sind vorhanden.
- **Bruch statt Prozent als Pflicht:** Für «nachvollziehbar» (Thema 2) und den Bruch (Thema 6) gibt es keinen Fedlex-Wortlaut. Die Quellen der Anforderungen sind unsicher-B. Gesucht habe ich in VMWG Art. 4-8 und OR Art. 257a-257b (Filestore-Text) und mit `mmx search "VMWG Art. 8 detaillierte Abrechnung Heizungskosten fedlex"`.
- **Ob das Heizprofil eine «Aufteilung» im Sinne von Art. 8 Abs. 1 VMWG ist,** sodass bei einem Mietvertrag über die ganze Periode darauf hingewiesen werden müsste: **unsicher**. Ich habe keine Norm und keinen Entscheid gefunden; es bleibt bei der Auslegung aus Runde 1.
- **Fassung des OR:** Der Filestore lieferte als neueste Fassung die vom 01.07.2027. Der Wortlaut von Art. 257b stimmt mit dem in Runde 1 zitierten überein. Ob dieser Wortlaut heute (15.10.2026) in Kraft ist, habe ich nicht an einer gültigen Fassung geprüft. Weil er gleich lautet, ändert das nichts am Ergebnis.
- **Praxis «Teil eines Leistungszeitraums nach Tagen auf eine Teilperiode»:** Für nicht verbrauchsabhängige Kosten gibt es keine Schweizer Primärquelle (`docs/nebenkostenabrechnung-anforderungen.md`, Unsicherheit 7). #208 ändert daran nichts.
- **E2E und Testläufe:** Ich habe weder die Szenarien noch die pg-Tests ausgeführt. Dass sie grün sind, übernehme ich aus dem Plan (`implementation_plan.md`, Session 12, «Checks»).
