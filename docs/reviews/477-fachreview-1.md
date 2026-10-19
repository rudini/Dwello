# Fachreview #477, Runde 1: «Geleistete Akontobeiträge» wird «Akontobeiträge»

Gegenstand: @wip-Szenario «Das PDF nennt die Akontobeiträge, nicht die geleisteten» (`tests/e2e/features/statement-detail.feature:810-821`) und der Textvorschlag des Aufrufers. Geprüft im Worktree `review-477-fach`, Commit dc8466c1 (detached, nur gelesen).

## Ergebnis

Den Entscheid trage ich mit. Die vier Wörter passen (de «Akontobeiträge», fr «Acomptes», it «Acconti», en «Advance payments»). Sie passen auch zu `docs/design/i18n-begriffe.md:37`: Singular «Akonto / acompte / acconto / advance payment», Plural für die Summe. Das Szenario rechnet richtig und wird an der richtigen Stelle rot. Offen sind drei Dinge: Die Glossarzeile steht im geprüften Commit noch nicht da. Zwei weitere Hilfetexte und mehrere Dokumente brauchen das alte Wort nach dem Entscheid falsch. Die Seitenzeile prüft kein Test.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Im geprüften Commit heisst die Glossarzeile noch «Geleistete Akontobeiträge»; Definition und Zeilen 48, 161 und 175 sagen «geleistete». Code und Glossar widersprechen sich, bis der Product Owner sie ändert. |
| V-2 | Verwalter | Minor | `contracts_agreed_costs_none_text_advance` (messages/*.json:796) soll «alle Akontobeiträge» sagen: Erstattet wird das vereinbarte Akonto, nicht das bezahlte. Texte unten. |
| V-3 | Verwalter | Minor | `contracts_billed_until_help` (:1677) sagt «geleistete Akontobeiträge» / «acomptes versés» / «acconti versati» / «advance payments made». Wort streichen, Texte unten. |
| V-4 | Verwalter | Minor | Die Zeile auf der Abrechnungsseite (`CostTable.svelte:175`, `statements_advance_paid`) prüfen weder das Szenario noch ein DOM-Test. Einen Schritt oder einen DOM-Test mit «Akontobeiträge» ergänzen. |
| V-5 | Verwalter | Minor | Das bestehende Szenario `statement-detail.feature:833` erwartet «Geleistete Akontobeiträge – 580.00» und wird nach der Änderung rot. Auf «Akontobeiträge – 580.00» ändern. Kürzer: «Und steht im PDF nicht "Geleistete"» dort anhängen und das neue Szenario weglassen (gleiche Vorbedingungen). |
| V-6 | Verwalter | Minor | `docs/nebenkostenabrechnung-anforderungen.md` sagt noch das alte Wort: Zeile 136 («Im PDF gelten die Glossarbegriffe: … Geleistete Akontobeiträge»), 149 («minus geleistete Akontobeiträge») und 131. Zeile 43 («geleistete Akontozahlungen abziehen») widerspricht dem Entscheid von #464. Texte unten. |
| V-7 | Verwalter | Minor | `docs/design/i18n-begriffe.md:38` muss neu lauten: «Akontobeiträge \| acomptes \| acconti \| advance payments». |
| V-8 | Verwalter | Nit | Backend-Tests erwarten den alten Text: `statement-pdf.pg.test.ts:65`, `statement-pdf-render.test.ts:549` und `:586`. Ebenso der Zielname in `tests/e2e/targets/statement-detail.ts:96`, der Kommentar in `statement-generate.feature:153` und `docs/data-model.md:304`. Mitändern. |
| V-9 | Verwalter | Nit | Der Schlüssel `statements_advance_paid` sagt «paid». Wahlweise in `statements_advance_payments` umbenennen; das ist kein Muss, die Oberfläche sieht den Schlüssel nicht. |
| M-1 | Mietrecht | Minor | Den Entscheid trägt nur der PDF-Hinweis `noteAdvance` (pdf.service.ts:52 und die anderen Sprachen): Nicht bezahlte Akontobeiträge regelt der Vermieter ausserhalb der Abrechnung. Er muss im PDF bleiben (Szenario :836 prüft ihn); nicht mit dem Label zusammen streichen. |

## Belege und Korrektur (Major)

### V-1: Glossarzeile fehlt im geprüften Commit

- **Beleg:** `UBIQUITOUS_LANGUAGE.md:174` im Commit dc8466c1: «**Geleistete Akontobeiträge** | Summe der monatlichen Vorauszahlungen des Mieters während seiner Mietstage in der Abrechnungsperiode.» Das alte Wort steht auch in Zeile 48 («zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach»), 161 («Vergleicht geleistete Akontobeiträge mit dem effektiven Kostenanteil») und 175 (Saldo: «minus geleistete Akontobeiträge»). Dass die Zeile die Änderung des Product Owners ist, steht im Issue #477 unter «Decided (product owner)». Im geprüften Commit ist sie noch nicht da. Vielleicht steht sie schon in deinem Arbeitsbaum; den habe ich nicht gelesen.
- **Warum falsch:** CLAUDE.md erlaubt nur Begriffe aus `UBIQUITOUS_LANGUAGE.md`, und der Code bekommt für diesen Begriff keinen Marker. Ohne die Glossaränderung führt die App einen Begriff, den das Glossar nicht kennt. Die Definition «Vorauszahlungen des Mieters» sagt zudem weiter «bezahlt», also genau das, was der Entscheid aufhebt.
- **Korrektur (nur der Product Owner, das Glossar bearbeite ich nicht):** Vorschlag
  - Zeile 174: «**Akontobeiträge** | Summe des im Mietvertrag vereinbarten Akontos während der Mietstage in der Abrechnungsperiode, jeder Betrag für die Monate, in denen er galt; ein angebrochener Monat nach Tagen. Dwello zieht das vereinbarte Akonto ab, nicht das bezahlte; fehlende Zahlungen regelt der Vermieter ausserhalb der Abrechnung. | `total_advance_payments`»
  - Zeile 48: «… zählen Mietstage und Akontobeiträge erst ab dem Tag danach.»
  - Zeile 161: «Vergleicht die Akontobeiträge mit dem effektiven Kostenanteil.»
  - Zeile 175: «Kostenanteil inklusive Verwaltungspauschale minus Akontobeiträge; …»
  - Bis diese Zeilen im Branch stehen, gehört V-1 unter «Blocked on me». Ein neues Issue braucht es nicht: #477 deckt das schon ab, mit den Labels `fachlich` und `entscheiden`.

## Texte in vier Sprachen

| Stelle | de | fr | it | en |
|---|---|---|---|---|
| `statements_advance_paid` (Seite) und PDF `advancePayments` (pdf.service.ts:47, 148, 248, 348; Kostentabelle und Ergebnisbox) | Akontobeiträge | Acomptes | Acconti | Advance payments |
| `glossary_balance_text` (:108), nur das Teilstück | «… samt Verwaltungspauschale minus seine Akontobeiträge, auf 5 Rappen gerundet, …» | «… frais de gestion compris, moins ses acomptes, arrondie à 5 centimes, …» | «… spese di gestione comprese, meno i suoi acconti, arrotondata a 5 centesimi, …» | «… including the management fee, minus their advance payments, rounded to 5 centimes, …» |
| `contracts_agreed_costs_none_text_advance` (:796), der dritte Satz (V-2) | «Mit der Nebenkostenabrechnung erstatten Sie ihm alle Akontobeiträge zurück.» | «Avec le décompte des charges, vous lui remboursez tous ses acomptes.» | «Con il conteggio spese accessorie gli rimborsa tutti gli acconti.» | «With the utility cost statement, you refund them all their advance payments.» |
| `contracts_billed_until_help` (:1677), der letzte Satz (V-3) | «Reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage und Akontobeiträge erst ab dem Tag danach.» | «Si une période de décompte va au-delà, les jours de location et les acomptes ne comptent qu’à partir du jour suivant.» | «Se un periodo di conteggio va oltre, i giorni di locazione e gli acconti contano solo a partire dal giorno successivo.» | «If a billing period reaches beyond it, the days rented and the advance payments count only from the day after.» |
| `i18n-begriffe.md:38` (V-7) | Akontobeiträge | acomptes | acconti | advance payments |

Zu :796, deiner offenen Frage: Ändern. Ohne Häkchen kostet die Abrechnung CHF 0.00 und zieht die Akontobeiträge nach Mietvertrag ab. Der Mieter bekommt also das vereinbarte Akonto zurück, nicht das bezahlte. Mit «geleisteten» stünde hier derselbe Widerspruch, den der Entscheid beseitigt. Dass ein Mieter vielleicht nicht alles bezahlt hat, sagt der PDF-Hinweis `noteAdvance`.

Ergebnisbox: Mit dem neuen Label lautet sie «Ihre Nebenkosten CHF … – Akontobeiträge CHF …» (pdf.service.ts:715). Das liest sich gut, und `balancedNote` sagt schon «Ihre Akontobeiträge». Ein eigenes Label für die Box braucht es nicht.

V-6, Vorschläge für `docs/nebenkostenabrechnung-anforderungen.md`:
- Zeile 43: «**Akonto und Saldo**: die im Mietvertrag vereinbarten Akontobeiträge abziehen (Dwello, #464, #477; nicht bezahlte regelt der Vermieter ausserhalb der Abrechnung), Saldo als Nachzahlung oder Guthaben ausweisen. …»
- Zeile 131: «Nur das Total der Akontobeiträge drucken, …»
- Zeile 136: «Akontobeiträge» statt «Geleistete Akontobeiträge».
- Zeile 149: «minus Akontobeiträge».

## Szenario

- Rechnung nachgeprüft. Fall 1: Marc Huber ab 01.05.2024, CHF 50.00, Periode 2024 → 8 × 50.00 = 400.00, stimmt mit «Akontobeiträge – 400.00» überein. Fall 2, Wechsel mitten in der Periode (Szenario :823): 2 × 50.00 + 6 × 80.00 = 100.00 + 480.00 = 580.00. Fall 3, angebrochener Monat (statement-pdf-render.test.ts:586): 16/31 × 120.00 = 61.935, also 61.94; dazu 9 × 120.00 = 1'080.00, zusammen 1'141.94. Fall 4, Grenzfall ohne Kosten (:796): Saldo = −Akontobeiträge, eine Rückerstattung in Höhe des vereinbarten Akontos. Das stützt V-2.
- Der Schritt `steht im PDF "Akontobeiträge – 400.00"` ist schon mit dem alten Text grün, weil er nur auf einen Teil der Zeile prüft (`toContain`, statement-detail.steps.ts:270). Rot wird das Szenario erst bei `steht im PDF nicht "Geleistete"`, und das genügt: Dieses Wort käme auf der Abrechnung sonst nirgends vor. Es fängt die Kostentabelle und die Ergebnisbox zugleich.
- Das Szenario prüft nur das deutsche PDF. Die Labels in fr, it und en sollte ein Test in `statement-pdf-render.test.ts` festhalten. Die Seite deckt V-4 ab.

## Andere Stellen, die ich durchsucht habe

- Mahnungen (`reminder-letter.ts`, `reminder-pdf.ts`): kein Akonto-Label. «geleistet» kommt nur in «Haben Sie die Zahlung bereits geleistet» vor (reminder-letter.ts:41), und das ist richtig.
- Datenexport des Mieters (`tenant-export.service.ts:65, 120`): nur die englischen Schlüssel `advancePayments` und `totalAdvancePayments`, ohne deutsche Labels. Es ist nichts zu ändern.
- E-Mail beim Versand (`statement-send.service.ts`): kein Akonto-Text.
- Andere Texte in `messages/*.json` mit «Akonto»: Die Zeilen 423–432, 583, 688, 709f., 767–781, 1075f., 1120–1124, 1293f., 1317, 1347 und 1626 sagen «Akonto» oder «Akontobeiträge» ohne «geleistet» und bleiben, wie sie sind. In fr und it steht «versés» bzw. «versati» nur in :108, :796, :1221 und :1677; «payés» und «pagati» in anderen Texten meinen Rechnungen oder Abrechnungen.

## Nicht bestätigt

- Dass der Vermieter das vereinbarte statt des bezahlten Akontos abziehen darf, steht in keinem Gesetzesartikel, den ich gefunden habe. Art. 4 Abs. 1 VMWG (Fedlex SR 221.213.11) sagt nur: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Dass nicht bezahltes Akonto eine eigene Forderung bleibt, stützt Art. 257d Abs. 1 OR (Fedlex SR 220): «Ist der Mieter nach der Übernahme der Sache mit der Zahlung fälliger Mietzinse oder Nebenkosten im Rückstand, so kann ihm der Vermieter …». Die Abzugsregel selbst ist **unsicher**; Dwello stützt sie auf die Entscheide in #464 und #477 und auf den PDF-Hinweis. Gesucht mit `mmx search` (VMWG Art. 4, OR Art. 257a, OR Art. 257d).
- Art. 257a Abs. 1 OR («Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen») habe ich nur bei justement.ch gefunden, nicht auf Fedlex. Für diesen Befund braucht es den Artikel nicht.
- Was in der Praxis auf Abrechnungen steht («Akontozahlungen», «Acomptes versés» bzw. «acomptes de charges», «acconti spese accessorie»), habe ich nicht mit einer Quelle nachgeprüft; das ist Erfahrungswissen. «Acomptes» und «Acconti» allein passen in die Tabelle neben «Vos frais accessoires» bzw. «Le sue spese accessorie».
- `UBIQUITOUS_LANGUAGE.md` habe ich nur im geprüften Commit gelesen, nicht in deinem Arbeitsbaum (V-1).
