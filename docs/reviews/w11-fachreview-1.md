# Fachreview W11, Runde 1: Szenario «PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden» (#236, Rest nach #241)

Geprüfter Stand: Worktree `review-w11-fach`, Commit 498381d. Gegenstand: `tests/e2e/features/statement-detail.feature:423-442` und der vorgeschlagene PDF-Wortlaut (Präfix «Rechnung «{Beschreibung}» – …» nur bei sonst gleichen Zeilen einer Position).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Regel «nur bei sonst gleichen Zeilen» behebt den Fall von Dr. Weber (P-1) nicht: Dort ist die Zeile «Ohne Leistungszeitraum» die einzige ihrer Art, bekäme also keinen Namen. Sie lässt sich weiterhin nur durch Ausschluss einem Beleg zuordnen. |
| V-2 | Verwalter | Major | Die Beschreibung ist als Merkmal unzuverlässig: Sie ist Freitext, bei Rechnungen derselben Position oft gleich («Hauswartung»), kann lang sein und steht nicht zwingend wörtlich auf dem Beleg. Rechnungsdatum (Pflichtfeld, steht auf jedem Beleg) und Rechnungsnummer eignen sich besser. |
| V-3 | Verwalter | Minor | Der Wortlaut «Rechnung «…» – Ohne Leistungszeitraum» hat in allen vier Sprachen nach dem Gedankenstrich einen Grossbuchstaben («Ohne», «Sans», «Senza», «Without»). Zudem steht ein zweiter Gedankenstrich neben dem der Datumsspanne. |
| V-4 | Verwalter | Minor | Das Szenario kann den kritischen Fall nicht zeigen: Die Testdaten setzen die Beschreibung auf «{Kategorie} {Datum}», also steckt das Datum schon in der Beschreibung. Es fehlen zwei Fälle: Rechnungen mit gleicher Beschreibung und der Fall von Dr. Weber (eine einzige Zeile ohne Leistungszeitraum). |
| M-1 | Mietrecht | Nit | Art. 257b Abs. 2 OR verlangt nicht, dass die Abrechnung die Rechnungen nennt. Das Merkmal erleichtert aber die Belegeinsicht. Die Änderung ist zulässig und sinnvoll, kein Rechtsmangel. |

## V-1 (Major): Die Regel verfehlt den Fall, der sie ausgelöst hat

**Beleg.**
- `docs/design/personas/dr-weber-241.md:11` (P-1): «Alle vier Rechnungen kosten CHF 765.00. Q1, Q2 und Q4 kann ich über den Leistungszeitraum einem Beleg zuordnen, die Zeile «Ohne Leistungszeitraum» nur durch Ausschluss.»
- Ebenda `:77`: «Was helfen würde: in jeder Zeile Rechnungsdatum und Rechnungsnummer, zum Beispiel «Rechnung SR-2025-… vom 30.09.2025, ohne Leistungszeitraum: CHF 765.00, …».»
- Vorgeschlagene Regel: Ein Präfix bekommt nur eine Zeile, deren Text (Daten, Leistungszeitraum, Betrag, Tage) gleich ist wie der einer anderen Zeile derselben Position.

**Warum falsch.** Bei Dr. Weber haben drei Zeilen einen eigenen Leistungszeitraum, und nur eine Zeile ist «Ohne Leistungszeitraum». Ihr Text gleicht keiner anderen Zeile, also bleibt sie ohne Namen, und P-1 bleibt offen. Die Anforderung «where the dates and amount alone do not tell it from another» meint fachlich einen anderen **Beleg**, keine andere Zeile: Der Mieter legt die Zeilen neben die Belege (Art. 257b Abs. 2 OR). Eine Zeile ohne Leistungszeitraum druckt kein Datum der Rechnung. Ihre Daten sind die der Abrechnungsperiode, und ihr Betrag passt hier zu vier Belegen.

Fachlich kommt hinzu: Ohne Leistungszeitraum entscheidet das Rechnungsdatum, in welche Abrechnungsperiode die Rechnung fällt (`backend/src/db/schema.ts:258`: «without it the Rechnungsdatum decides the Abrechnungsperiode»). Gerade dieses Datum muss der Mieter sehen, um die Zuordnung zur Periode zu prüfen, etwa bei einer Rechnung vom Januar des Folgejahres. In der Praxis führt ein Treuhänder zu jedem Beleg Datum, Lieferant und Betrag auf (Belegliste).

**Korrektur.**
1. Eine Zeile «Ohne Leistungszeitraum» nennt **immer** ihr Rechnungsdatum (siehe V-3 für den Wortlaut). Damit ist auch die Frage des Aufrufers beantwortet: ja, immer, aber mit dem Rechnungsdatum.
2. Sind zwei Zeilen einer Position danach noch gleich (gleiches Rechnungsdatum, oder gleicher Leistungszeitraum mit gleichem Betrag), kommt die Rechnungsnummer dazu, wenn erfasst, sonst der Rechnungssteller. Die bisherige Regel «nur wo sonst gleich» bleibt also als zweite Stufe bestehen.
3. Zeilen mit eigenem Leistungszeitraum und eindeutigem Text bleiben unverändert, wie vorgeschlagen.
4. Die Zeile «Veränderung Tankbestand» bekommt nie einen Namen. Das ist richtig: Sie ist keine Rechnung (#239), und ihre Daten sind die Stichtage des Tankbestands.

## V-2 (Major): Beschreibung statt Rechnungsdatum oder Rechnungsnummer

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:68`: Beschreibung = «Beschreibung der erbrachten Leistung auf der Rechnung». `:62` Rechnungsnummer = «Nummer der Rechnung beim Lieferanten». `:63` Rechnungsdatum = «Datum der Rechnungsstellung».
- `backend/src/db/schema.ts:247-257`: `invoice_number` ist nullable, `description` ist `text` NOT NULL ohne Längengrenze, `invoice_date` ist NOT NULL.
- `UBIQUITOUS_LANGUAGE.md:106` (Auslesen): Die KI liest die Beschreibung aus. Die Werte sind Vorschläge, der Text ist also nicht wörtlich der des Belegs.
- `tests/e2e/fixtures/screens.ts:59`: realistische Beschreibung «Treppenhausreinigung Q1»; `tests/e2e/fixtures/backend.ts:364`: Testbeschreibung `${categoryName} ${date}`.

**Warum falsch.**
- Ein Liegenschaftsverwalter mit vier Hauswart-Rechnungen schreibt oft viermal «Hauswartung» oder übernimmt den KI-Vorschlag. Dann sind auch die Präfixe gleich, und die Zeilen bleiben ununterscheidbar. Die Regel behebt das Problem dann nur scheinbar.
- Die Beschreibung ist ungekürzter Freitext. Bei einer langen KI-Beschreibung (Leistungsliste) wird die Zeile unter der Position mehrzeilig. Ausserdem rendert die Standardschrift Helvetica im PDF (`pdf.service.ts:621`, `:709`) Zeichen ausserhalb von WinAnsi nicht.
- Dass der Rechnungssteller bei allen Rechnungen einer Position oft derselbe ist, stimmt. Als Hauptmerkmal ist er darum zu Recht verworfen.
- Das Rechnungsdatum ist Pflicht, steht auf jedem Beleg, ist kurz und in allen Sprachen gleich formatiert. Die Rechnungsnummer ist das eindeutigste Merkmal, fehlt aber oft. Beides schlägt Dr. Weber selbst vor (`dr-weber-241.md:77`).

**Korrektur.** Als Merkmal das Rechnungsdatum nehmen; reicht es nicht, die Rechnungsnummer (falls erfasst), sonst den Rechnungssteller. Die Beschreibung höchstens als letzte Stufe und gekürzt. Für neue Abrechnungen dazu `invoiceDate` (und gegebenenfalls `invoiceNumber`) in `invoice_parts` speichern. Bereits gespeicherte Abrechnungen behalten ihre Zeilen. Das ist richtig: Das PDF einer versendeten Abrechnung darf sich nicht still ändern.

## V-3 (Minor): Wortlaut in vier Sprachen

**Beleg.**
- Vorschlag DE «Rechnung «Hauswart 2025-03-31» – Ohne Leistungszeitraum: …», FR «Facture « … » – Sans période de prestation : …», IT «Fattura «…» – Senza periodo di prestazione: …», EN «Invoice “…” – Without a service period: …».
- Bestehende Vorlagen `backend/src/services/pdf.service.ts:77-80`, `:154-157`, `:231-234`, `:308-311`.
- Begriffe `docs/design/i18n-begriffe.md:38` (facture / fattura / invoice), `:44` (date de facture / data della fattura / invoice date), `:62` (période de prestation / periodo di prestazione / service period); Stil `:5` (französische Guillemets mit geschütztem Leerzeichen, Italienisch und Deutsch ohne).

**Warum falsch.**
- Nach einem Gedankenstrich mitten im Satz schreibt man in Französisch, Italienisch und Englisch klein, ebenso im Deutschen beim Adjektiv/der Präposition «ohne». «Ohne», «Sans», «Senza» und «Without» sind hier grossgeschrieben, weil die Vorlage `partNoPeriod` vorne angehängt wird.
- Bei Zeilen mit Leistungszeitraum steht danach ein zweiter Gedankenstrich in der Datumsspanne («– Leistungszeitraum 01.07.2025 – 30.09.2025»). Zwei Striche mit verschiedener Bedeutung in einer Zeile sind schwer zu lesen.
- Die Begriffe selbst (Rechnung/facture/fattura/invoice) stimmen mit dem Glossar überein, ebenso die Guillemets in FR.

**Korrektur.** Eigene Vorlagen mit Komma statt Gedankenstrich und kleinem Anfang:
- DE `partNoPeriod`: «Rechnung vom {date}, ohne Leistungszeitraum{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen der Abrechnungsperiode»
- FR: «Facture du {date}, sans période de prestation{colon}CHF {amount}, vos jours de location {days} sur {total} jours de la période de décompte»
- IT: «Fattura del {date}, senza periodo di prestazione{colon}CHF {amount}, i suoi giorni di locazione {days} su {total} giorni del periodo di conteggio»
- EN: «Invoice dated {date}, without a service period{colon}CHF {amount}, your days rented {days} of {total} days of the billing period»

Zweite Stufe (nur bei sonst gleichen Zeilen), vorangestellt mit Komma: DE «Rechnung Nr. {number} vom {date}, …» / FR «Facture n° {number} du {date}, …» / IT «Fattura n. {number} del {date}, …» / EN «Invoice no. {number} dated {date}, …». Ohne Rechnungsnummer: DE «Rechnung von {Rechnungssteller} vom {date}, …» (FR «Facture de {émetteur} du …», IT «Fattura di {emittente} del …», EN «Invoice from {issuer} dated …»).

## V-4 (Minor): Das Szenario deckt den Fall nicht ab

**Beleg.** `statement-detail.feature:432-433` legt zwei Rechnungen ohne Leistungszeitraum an. Die Testdaten geben ihnen die Beschreibungen «Hauswart 2025-03-31» und «Hauswart 2025-09-30» (`tests/e2e/fixtures/backend.ts:364`), und `:439-440` prüft genau diese Texte.

**Warum falsch.** Die Beschreibung enthält das Datum schon. Das Szenario wäre auch grün, wenn die Beschreibungen in der Praxis gleich wären, und dann wären die Zeilen nicht unterscheidbar (V-2). Den Fall von Dr. Weber mit nur einer Zeile ohne Leistungszeitraum prüft es gar nicht (V-1).

**Korrektur.** Nach V-1 und V-2 sollte das Szenario prüfen:
- eine einzelne Zeile ohne Leistungszeitraum neben Zeilen mit Leistungszeitraum über denselben Betrag: Sie nennt «Rechnung vom 31.03.2025, ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode»;
- die Zeile mit eigenem Leistungszeitraum bleibt unverändert, wie in `:441-442`.

Für die zweite Stufe (gleiches Rechnungsdatum und gleicher Betrag) genügt ein Unit-Test in `statement-pdf-render.test.ts`.

Nachgerechnet (Einzug 15.08.2025, Periode 2025):
- 17 + 30 + 31 + 30 + 31 = 139 Mietstage von 365 (`:439-440`), richtig.
- Leistungszeitraum 01.07.–30.09.2025 = 92 Tage, davon gemietet 17 + 30 = 47 (`:441`), richtig.
- Zeitanteil der Position: (765 × 139/365 + 765 × 139/365 + 1'200 × 47/92) / 2'730 = (291.33 + 291.33 + 613.04) / 2'730 = 43.80 %.
- Randfall Mieter über die ganze Periode: `invoice_parts` bleibt null (`calculation.service.ts:155`), es gibt keine Zeilen und keine Namen. Das ist richtig.
- Randfall Summe 0: ebenso keine Zeilen.

## M-1 (Nit): Art. 257b OR

**Beleg (Fedlex, SR 220, Fassung 01.01.2025, verbatim).** Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Abs. 1 beginnt: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters …»

**Bewertung.** Eine Pflicht, jede Rechnung in der Abrechnung einzeln zu bezeichnen, steht nicht im Gesetz. Das Einsichtsrecht ist aber nur dann praktisch wirksam, wenn der Mieter Zeile und Beleg zusammenbringt. Das Rechnungsdatum (V-1) dient genau dem und zeigt zugleich, warum eine Rechnung ohne Leistungszeitraum in diese Periode fällt (tatsächliche Aufwendungen der Periode). Kein Änderungsbedarf über V-1 bis V-3 hinaus.

## Fehlende Begriffe

Keine. «Rechnung», «Rechnungsdatum», «Rechnungsnummer», «Rechnungssteller», «Leistungszeitraum» stehen in `UBIQUITOUS_LANGUAGE.md:60-64`, mit Übersetzungen in `docs/design/i18n-begriffe.md:38-44, 62`. Eine Belegnummer (interne Nummerierung der Belege, wie Treuhänder sie führen) wäre das eindeutigste Merkmal, ist aber kein Begriff des Glossars. Ich schlage sie nicht vor, weil das Rechnungsdatum mit der Rechnungsnummer genügt.

## Nicht bestätigt

- **Nachvollziehbarkeit:** Dass eine Nebenkostenabrechnung nach der Rechtsprechung «nachvollziehbar» sein muss und deshalb Belegmerkmale nennen sollte, habe ich auf Fedlex nicht gefunden. Es ist Lehre bzw. Praxis, keine Gesetzesnorm: **unsicher**. Gesucht mit `mmx search` und im OR-Text auf Fedlex (Art. 257a–257b).
- **Art. 8 Abs. 2 VMWG:** Nur aus früheren Reviews im Repo zitiert (`docs/reviews/issue-208-fachreview-1.md:131`), in dieser Runde nicht selbst auf Fedlex nachgelesen: **unsicher**. Für diesen Befund trägt er nichts Zusätzliches bei.
- **Zeichen im PDF:** Ob Freitext mit Zeichen ausserhalb von WinAnsi im PDF tatsächlich falsch dargestellt wird, habe ich nicht ausprobiert, nur aus `doc.font('Helvetica')` (`pdf.service.ts:709`) abgeleitet.
- **Reihenfolge der Zeilen:** In welcher Reihenfolge die Rechnungszeilen erscheinen (`getInvoicesForStatement`), habe ich nicht geprüft. Eine Sortierung nach Rechnungsdatum würde die Zuordnung zusätzlich erleichtern.
