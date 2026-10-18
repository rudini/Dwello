# Fachreview #222, Runde 1: Hinweis auf abgezogene Akontorechnungen

Gegenstand: Worktree `review-222-fach`, Commit `ba3079ec` (`git diff HEAD~1 HEAD`): `@wip`-Szenario «Schlussrechnung mit abgezogenen Akontorechnungen» (`tests/e2e/features/invoices.feature:106-109`) und Plan `implementation_plan.md` (Session #222): entschiedener Text `invoices_upload_deducted` in de/fr/it/en, Zeile «Akontorechnung (eines Rechnungsstellers)» in `docs/design/i18n-begriffe.md`. Verglichen mit `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `invoices_beleg_deducted` (`messages/*.json:856`), Issue #222 («Decided (product owner)», Kommentare).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Glossar «Akontorechnung» kennt nur einen Weg (Total der Leistungen, Akontorechnungen nicht zusätzlich); der entschiedene Hinweis nennt zwei. Glossar und UI-Text widersprechen sich. |
| V-2 | Verwalter / Mietrecht | Major | Zweiter Weg («Betrag nach dem Abzug») führt bei einem Guthaben oder Null in der Schlussrechnung in eine Sackgasse (Betrag muss > 0 sein) und verleitet zum Erfassen des Guthabens als positiven Betrag. |
| V-3 | Verwalter | Minor | Die beiden Wege sind nur gleichwertig, wenn alle Rechnungen in dieselbe Abrechnungsperiode fallen; mit Leistungszeitraum oder über die Periodengrenze verteilen sie verschieden. |
| V-4 | Verwalter | Minor | «Help texts follow in all four languages»: In `i18n-begriffe.md` fehlen neben «Akontorechnung» auch «Auslesen» und «Mahnung eines Rechnungsstellers». |
| V-5 | Verwalter | Minor | `help_invoices_1` «erfassen Sie jede Rechnung eines Rechnungsstellers» widerspricht den neuen Glossarregeln zu Gutschrift und Akontorechnung. |
| V-6 | Verwalter | Nit | «die Akontorechnungen» setzt voraus, dass jeder Abzug eine Akontorechnung ist; die KI meldet auch Anzahlungen und Teilzahlungen. |
| V-7 | Verwalter | Nit | Code-Kommentar im KI-Stand-in spricht von «Akonto payments» statt von Akontorechnungen. |

## Befunde

### V-1 (Major): Glossar und Hinweis widersprechen sich

- Belege: `UBIQUITOUS_LANGUAGE.md:71`: «Akontorechnung (eines Rechnungsstellers) | Teilrechnung eines Rechnungsstellers über einen Vorschuss auf seine Leistungen; die Schlussrechnung zieht sie ab. **In Dwello wird die Schlussrechnung mit dem Total der Leistungen erfasst, die Akontorechnungen nicht zusätzlich.**» Das Szenario (`invoices.feature:109`) und der entschiedene Text sagen dagegen: «Haben Sie die Akontorechnungen schon erfasst, tragen Sie den Betrag nach dem Abzug ein». Der Text erlaubt also ausdrücklich, die Akontorechnungen zu erfassen, was das Glossar ausschliesst.
- Warum falsch: Das Glossar ist die einzige Quelle für Fachbegriffe und Regeln (CLAUDE.md, «Domain terms»). Ein Liegenschaftsverwalter, der den Begriff im Glossar nachliest, bekommt eine andere Regel als im Dialog. Der Hinweis wurde am 2026-10-16 neu entschieden (P-1 aus #233, V-9 aus `233-fachreview-2.md`), der Glossareintrag folgte noch dem alten Text aus #217.
- Korrektur: Der Produktverantwortliche passt den zweiten Satz im Glossar an (die Umsetzung darf das Glossar nicht ändern). Vorschlag: «Sie dürfen nur einmal zählen: Entweder wird die Schlussrechnung mit dem Total der Leistungen erfasst und die Akontorechnungen nicht, oder die Akontorechnungen werden erfasst und die Schlussrechnung mit dem Betrag nach dem Abzug.» Ins Plan-Item «Blocked on me» aufnehmen (CLAUDE.md, Design-Regeln: Glossaränderung durch den Produktverantwortlichen vor dem Merge). Den Text nicht ändern: Er ist entschieden.

### V-2 (Major): Guthaben oder Null nach dem Abzug

- Belege: `src/lib/invoice.ts:50`: `if (!(parseFloat(plainAmount(invoice.amount)) > 0)) errors.amount = m.invoices_error_amount();`, Meldung «Bitte geben Sie einen gültigen Betrag ein» (`messages/de.json:692`). Der Hinweis sagt ohne Einschränkung: «tragen Sie den Betrag nach dem Abzug ein».
- Nachgerechnet (Total T, abgezogene Akontorechnungen A):
  1. T = 1’250.00, A = 1’000.00 (Wert der KI-Attrappe, `backend/scripts/llm-stub.ts:111,123`): Weg 1 = 1’250.00; Weg 2 = 1’000.00 + 250.00 = 1’250.00. Gleich, korrekt.
  2. Randfall Guthaben, T = 800.00, A = 1’000.00 (bei Strom- und Wasserschlussrechnungen der Werke häufig, weil Akonti grosszügig angesetzt sind): Weg 1 = 800.00, korrekt. Weg 2 verlangt −200.00; Dwello lehnt das ab. Gibt der Liegenschaftsverwalter stattdessen das auf der Schlussrechnung gedruckte «Guthaben CHF 200.00» positiv ein, sind es 1’000.00 + 200.00 = 1’200.00, also 400.00 (50 %) zu viel.
  3. Randfall Null, T = A = 1’000.00: Weg 2 verlangt 0.00, Dwello lehnt ab; der Liegenschaftsverwalter erfährt nicht, dass er die Schlussrechnung dann gar nicht erfassen soll.
- Warum falsch: Der neue Text führt den zweiten Weg ein; bei einem Guthaben verweist er auf eine Eingabe, die Dwello ablehnt, und die naheliegende Ausweichlösung macht die Nebenkosten zu hoch. Nebenkosten sind nach Art. 257b Abs. 1 OR «die tatsächlichen Aufwendungen des Vermieters»; mehr darf die Abrechnung nicht verteilen (**unsicher**: Wortlaut nur aus Sekundärquellen (justement.ch, gerichte-zh.ch über `mmx search`), Fedlex lädt ohne JavaScript nicht). Im Glossar steht der passende Weg schon: Eine Gutschrift wird «vom Betrag der zugehörigen Rechnung» abgezogen (`UBIQUITOUS_LANGUAGE.md:70`).
- Korrektur (braucht einen Entscheid des Produktverantwortlichen, weil der Text entschieden ist; als `entscheiden`-Issue, wenn nicht in #222 gelöst): entweder einen Satz anhängen, z.B. de «Bleibt nach dem Abzug ein Guthaben, ziehen Sie es von einer Akontorechnung ab, wie eine Gutschrift.» (fr «S’il reste un avoir après la déduction, déduisez-le d’une facture d’acompte, comme une note de crédit.»; it «Se dopo la deduzione resta un credito, lo deduca da una fattura d’acconto, come una nota di credito.»; en «If a credit remains after the deduction, deduct it from an advance invoice, like a credit note.»), oder bei `deductedAmount ≥ totalAmount` nur den ersten Weg nennen (Total vor dem Abzug, Akontorechnungen nicht erfassen). Jede Variante mit eigenem Szenario (Attrappe mit Abzug ≥ Total).

### V-3 (Minor): Die beiden Wege verteilen über die Perioden verschieden

- Belege: `backend/src/services/invoice.service.ts:504-517` (`inPeriod`): Ohne Leistungszeitraum zählt eine Rechnung ganz in der Periode ihres Rechnungsdatums, mit Leistungszeitraum anteilig nach Tagen; `messages/de.json:86`: «Das Rechnungsdatum bestimmt, in welche Abrechnungsperiode eine Rechnung fällt.»
- Nachgerechnet, Abrechnungsperiode Kalenderjahr 2025, Werke ablesen per 30.9.: Schlussrechnung T = 1’300.00, Leistungszeitraum 1.10.2024–30.9.2025 (365 Tage, davon 273 in 2025), vier Akontorechnungen à 250.00 mit Datum in 2025, ohne Leistungszeitraum.
  - Weg 1: 1’300.00 × 273/365 = 972.33 in 2025.
  - Weg 2: 1’000.00 (ganz in 2025) + 300.00 × 273/365 = 224.38, zusammen 1’224.38 in 2025.
  - Unterschied 252.05. Auch bei einem Mieterwechsel teilen sich die Kosten anders auf, weil die Akontorechnungen ohne Leistungszeitraum über die ganze Periode zählen.
- Warum ein Problem: Der Hinweis stellt die beiden Wege als gleichwertig dar («sonst zählen sie doppelt»). Gleich ist nur das Total über alle Perioden; welcher Teil in welche Abrechnung kommt, hängt vom Weg ab. In der Praxis erfasst ein Verwalter die Schlussrechnung (Verbrauch mit Ablesezeitraum) als Kosten und die Akonti als Zahlungen an die Werke, also Weg 1.
- Korrektur: Im Glossar (V-1) Weg 1 als Regelfall nennen und Weg 2 als Ausweg, wenn die Akontorechnungen schon erfasst sind; beim zweiten Weg den Leistungszeitraum der Schlussrechnung auch auf den Akontorechnungen eintragen. Kein Szenario nötig, solange der Text gleich bleibt; sonst als `fachlich`-Issue.

### V-4 (Minor): Übersetzungen der übrigen #222-Begriffe fehlen in `i18n-begriffe.md`

- Belege: `docs/design/i18n-begriffe.md:31-45` hat Rechnung, Beleg, Gutschrift, Mahngebühr/Verzugszins und Konfidenz («fiabilité ❓», «affidabilità ❓», noch #83), aber keine Zeilen für «Auslesen» und «Mahnung eines Rechnungsstellers», obwohl die UI beide verwendet: `help_invoices_4`/`invoices_upload_purpose` («liest … aus»: fr «lit», it «legge», en «reads»), `invoices_upload_reminder` (fr «rappel», it «sollecito», en «payment reminder»). «Done means» von #222: «help texts follow in all four languages» gilt für alle entschiedenen Einträge, nicht nur für «Akontorechnung».
- Korrektur: neben der geplanten Zeile zwei weitere Zeilen. Vorschlag (die Texte verwenden diese Wörter schon, keine Änderung in `messages/*.json`):
  - «Auslesen (eines Belegs durch die KI)» | lire (les indications) | leggere (i dati) | read (the details)
  - «Mahnung eines Rechnungsstellers» | rappel (d’un émetteur de facture) | sollecito (di un emittente della fattura) | payment reminder (from an invoice issuer)
  Ohne diese Zeilen bleibt «Done means» offen. Vom Wortlaut her muss der Produktverantwortliche das nicht entscheiden, es sind die bestehenden UI-Wörter.

### V-5 (Minor): Hilfetext «jede Rechnung» passt nicht zu den neuen Glossarregeln

- Belege: `messages/de.json:70` `help_invoices_1`: «Unter «Rechnungen» erfassen Sie jede Rechnung eines Rechnungsstellers mit Datum, Betrag und Gebäude.» (fr/it/en gleich). Glossar: Gutschrift «Dwello erfasst sie nicht als eigene Rechnung» (`UBIQUITOUS_LANGUAGE.md:70`), Akontorechnungen zählen nur einmal (`:71`), Mahngebühren keine Nebenkosten (`:72`).
- Warum ein Problem: Die Hilfe ist der einzige Ort ausserhalb des Hochladens, an dem der Liegenschaftsverwalter diese Regeln findet. Wer Rechnungen von Hand erfasst, sieht die Hinweise beim Hochladen nie und erfasst Akontorechnungen und Schlussrechnung brutto (doppelt).
- Korrektur: Ist das Teil von «help texts follow»? Das entscheidet der Aufrufer, sonst als `fachlich`-Issue. Vorschlag für einen zusätzlichen Absatz `help_invoices_5`: de «Gutschriften und Akontorechnungen sind keine eigenen Kosten: Ziehen Sie eine Gutschrift vom Betrag ihrer Rechnung ab, und erfassen Sie eine Schlussrechnung mit dem Total vor dem Abzug, ohne die Akontorechnungen.»; fr «Les notes de crédit et les factures d’acompte ne sont pas des coûts à part : déduisez une note de crédit du montant de sa facture, et saisissez une facture finale avec le total avant la déduction, sans les factures d’acompte.»; it «Le note di credito e le fatture d’acconto non sono costi a sé: deduca una nota di credito dall’importo della sua fattura e registri una fattura finale con il totale prima della deduzione, senza le fatture d’acconto.»; en «Credit notes and advance invoices are not separate costs: deduct a credit note from the amount of its invoice, and enter a final invoice with the total before the deduction, without the advance invoices.» (Der Begriff «Schlussrechnung» fehlt im Glossar; er steht nur in der Definition von «Akontorechnung».)

### V-6 (Nit): «die Akontorechnungen» für jeden Abzug

- Belege: `backend/src/config/llm.ts:272`: «deductedAmount: Summe der abgezogenen, bereits bezahlten Beträge (Akontozahlungen, Anzahlungen, Teilrechnungen)». Der Hinweis nennt den Abzug zuerst richtig allgemein («bereits bezahlte Beträge»), danach mit bestimmtem Artikel «die Akontorechnungen».
- Warum: Bei einer Anzahlung ohne eigene Rechnung (z.B. beim Heizöl) gibt es keine Akontorechnung. Der Satz greift dann nicht, schadet aber auch nicht: Der vorgeschlagene Bruttobetrag ist der richtige.
- Korrektur: keine nötig, der Text ist entschieden. Nur notiert.

### V-7 (Nit): Wortwahl im Kommentar der KI-Attrappe

- Belege: `backend/scripts/llm-stub.ts:105`: ««Werke Schlussrechnung» deducts Akonto payments».
- Warum: «Akonto» ist im Glossar der Vorschuss des Mieters (`UBIQUITOUS_LANGUAGE.md:50`); dasselbe Missverständnis hat #222 im UI-Text behoben.
- Korrektur: «deducts advance invoices (Akontorechnungen)», wenn die Datei ohnehin angefasst wird. Den Prompt in `llm.ts:272` nicht ändern: Er beschreibt, was auf der Rechnung steht, und eine Änderung verlangt `llm:eval`.

## Bestätigt

- Der Szenariotext (`invoices.feature:109`) stimmt Wort für Wort mit dem entschiedenen de-Text in #222 überein. Der Betrag «CHF 1’000.00» passt zu `deductedAmount: 1000` der Attrappe. «Vorgeschlagen ist das Total vor dem Abzug» passt zum Prompt (`llm.ts:271` «totalAmount … vor dem Abzug bereits bezahlter Beträge») und zum Vorschlag 1’250.00 der Attrappe.
- Begriffe im Szenario: «Liegenschaftsverwalter», «Gebäude», «Rechnung», «Akontorechnungen» stehen im Glossar; «Datei» für noch nicht gespeicherte Dateien ist in #222 entschieden; «Schlussrechnung» kommt nur in der Glossardefinition von «Akontorechnung» vor (siehe V-5).
- Übersetzungen: facture d’acompte / fattura d’acconto / advance invoice sind übliche Fachwörter, heben sich vom Mieter-Akonto (acompte / acconto / advance payment, `i18n-begriffe.md:32`) ab und stehen schon so in `invoices_beleg_deducted` (`messages/{fr,it,en}.json:856`). Der Plan übernimmt die entschiedenen Texte mit typografischem Apostroph (U+2019) wie die übrigen Texte.
- Mit `invoices_beleg_deducted` («Ist der Betrag das Total vor dem Abzug, dürfen die Akontorechnungen nicht zusätzlich erfasst sein.») passt der neue Hinweis zusammen: Beide lassen beide Wege zu und verwenden dasselbe Wort in allen vier Sprachen.
- Keine Code-Markierung nennt mehr #222 (`grep -rn "#222" src backend/src backend/scripts backend/migrations tests messages`: leer). Die Markierung, die der Kommentar vom 12:31 noch erwähnt, ist weg; `Fixes #222` scheitert nicht an `check-issues.mjs`.
- Mietrecht: Der Hinweis soll Doppelzählungen verhindern und damit Nebenkosten über den tatsächlichen Aufwendungen. Rechtlich ist an dieser Absicht nichts zu beanstanden (Art. 257b Abs. 1 OR, Wortlaut **unsicher**, siehe unten). Der Mieter erfährt aus dem Text nichts, er geht nur an den Liegenschaftsverwalter.

## Fehlende Begriffe (für ein Issue, Labels `fachlich`, `entscheiden`)

- Zweiter Satz von «Akontorechnung (eines Rechnungsstellers)» an den entschiedenen Hinweis anpassen (Vorschlag unter V-1).
- «Schlussrechnung (eines Rechnungsstellers)»: «Rechnung eines Rechnungsstellers über das Total seiner Leistungen eines Zeitraums, von dem sie die Akontorechnungen abzieht.» (fr facture finale, it fattura finale, en final invoice), wenn V-5 umgesetzt wird.
- «Auslesen» und «Mahnung eines Rechnungsstellers» in `i18n-begriffe.md` (V-4; kein Entscheid nötig, die UI-Wörter gibt es schon).

## Nicht bestätigt

- Wortlaut von Art. 257b Abs. 1 OR: Fedlex (`https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_257_b`) liefert ohne JavaScript nur einen Hinweis zum Browser. Mit `mmx search` nur Sekundärquellen gefunden (justement.ch, gerichte-zh.ch, mieterverband.ch): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …». Deshalb **unsicher**.
- Wie Verwalter in der Praxis Werke-Akonti buchen (V-3: Schlussrechnung als Kosten, Akonti als Zahlung): Erfahrung aus der Rolle, keine Quelle in `docs/nebenkostenabrechnung-anforderungen.md` (dort nur das Mieter-Akonto, Zeilen 38–43, 79–81).
- Ob «help texts follow» in #222 auch den Hilfeabsatz nach V-5 meint: Issue und Kommentare nennen nur `invoices_upload_deducted` und `i18n-begriffe.md`. Die Frage bleibt dem Aufrufer bzw. dem Produktverantwortlichen.
- Ob der Dialog mit dem Hinweis in `tests/a11y/screens.json` / `sprachen-bildschirme.feature` für fr/it/en erfasst ist: nicht geprüft (kein Fachthema, Sache von `code-reviewer`).
- `docs/anforderungen-vertragsende.md` enthält nichts zu Rechnungen von Rechnungsstellern; für dieses Thema nicht relevant.
