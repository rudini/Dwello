# Fach-Review #444, Runde 1 (vor der Umsetzung)

Gegenstand: das @wip-Szenario «Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular» (`tests/e2e/features/contract-new.feature:222-230`), der DOM-Test `src/__tests__/agreed-categories.dom.test.ts:63-71` und der vorgeschlagene Text `contracts_agreed_costs_none_advance`. Worktree `review-444-fach` (Scratchpad), Commit ac118888.

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Wird der Akonto-Absatz an den bestehenden Text angehängt, steht im selben Hinweis «Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.» und gleich danach «Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt.» Das ist genau der Fall von Helga (Akonto und Pauschale). Mit einem Akonto ist eine Variante nötig, die den Text ersetzt (wie `contracts_flat_rate_warning_text_advance` bei #432), statt einen Absatz anzuhängen. |
| V-2 | Verwalter | Minor | Formulierung: «verrechnet Dwello es mit keinen Nebenkosten» ist holprig. «mit der Abrechnung» sollte «mit der Nebenkostenabrechnung» heissen. Was zurückerstattet wird, sind die «geleisteten Akontobeiträge» (Glossar Z. 174), nicht «es». Wortlaut siehe Empfehlung. |
| V-3 | Verwalter | Minor | Abdeckung: Das Szenario und der DOM-Test prüfen nur Akonto mit Pauschale. Ungeprüft bleiben: Akonto ohne Pauschale (Ton war schon `caution`, neu kommt der Akonto-Satz dazu) und die Gegenprobe ohne Akonto (kein Akonto-Satz, der Pauschale-Satz bleibt). Fix: ein DOM-Fall `boxes([], false, true)` und eine Erwartung `not.toContain` für den Akonto-Satz in `boxes([], true, false)`. |
| M-1 | Mietrecht | Nit | «ganz zurück» stimmt für den Normalfall (nachgerechnet, siehe unten), mit zwei Ausnahmen, die es schon vorher gab: (a) Eine umlagefähige Rechnung ohne Kategorie rechnet Dwello heute auch ohne Vereinbarung ab (`calculation.service.ts:376-379`). #407 Punkt 4 ist entschieden (Lauf sperren), aber noch nicht umgesetzt. (b) Ein Saldo unter CHF 5 wird nicht ausbezahlt (#94, `pdf-format.ts:23`). Das «ganz» kann bleiben. |
| V-4 | Verwalter | Nit | Der Schritt «Prüfen» zeigt weiterhin «Akonto CHF 150.00» neben «Vereinbarte Nebenkosten: Keine» ohne Hinweis (Issue #444, «Problem»). Der Produktverantwortliche hat nur Option 1 (Hinweis bei den Häkchen) entschieden. Das ist ausserhalb des Gegenstands und nur vermerkt. |

Keine Blocker.

### V-1 (Major)

- **Beleg:** `messages/de.json`, `contracts_agreed_costs_none_text`, letzter Satz: «Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.» Vorgeschlagen ist ein zweiter Absatz mit dem Satz «Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt.» Das Szenario `contract-new.feature:227-230` gibt Akonto 150 und Pauschale 40 ein. Glossar `UBIQUITOUS_LANGUAGE.md:52` (Nebenkostenpauschale): «Zahlt der Mieter alle Nebenkosten pauschal, hat sein Mietvertrag in Dwello kein Akonto und kein Häkchen.»
- **Warum falsch:** Streng logisch widersprechen sich die Sätze nicht: Wer ein Akonto bezahlt, bezahlt nicht *alle* Nebenkosten pauschal. Ein unerfahrener Vermieter (Zielgruppe) mit Akonto *und* Pauschale liest aber zwei Anweisungen: «leer lassen» und «ankreuzen». Helga hat die Häkchen beinahe genau so entfernt (Helga 432 P-2). Der erste Absatz bestätigt ihr den Fehler, den die Warnung verhindern soll. Mit einem Akonto passt der Pauschale-Satz nach dem Glossar nie.
- **Fix:** Ist ein Akonto erfasst, zeigt der Hinweis statt `contracts_agreed_costs_none_text` eine Variante `contracts_agreed_costs_none_text_advance` (Wortlaut unten). Ihr fehlt der Pauschale-Satz. Ohne Akonto bleibt der heutige Text unverändert. `contract-edit.feature:169-172` bleibt grün: Der Mietvertrag der Grundlage hat Akonto 0 (`tests/e2e/fixtures/backend.ts:172`). Der vom Szenario geprüfte Satz bleibt wörtlich gleich. Der Entscheid #444 («with a sentence about the Akonto») ist damit erfüllt.

## Empfohlener Wortlaut

Titel unverändert: `contracts_agreed_costs_none_title` «Keine Nebenkosten vereinbart» (passt, bestätigt). Ton `caution`, sobald das Akonto > 0 ist, mit oder ohne Pauschale.

Neuer Schlüssel `contracts_agreed_costs_none_text_advance`. Er ersetzt `contracts_agreed_costs_none_text`, solange ein Akonto erfasst ist:

- **de:** «Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab. Er bezahlt aber ein Akonto. Mit der Nebenkostenabrechnung erstatten Sie ihm alle geleisteten Akontobeiträge zurück. Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt.»
- **fr:** «Si aucune case n’est cochée, Dwello ne décompte aucuns frais accessoires à ce locataire. Or il paie un acompte. Avec le décompte des charges, vous lui remboursez tous les acomptes versés. Cochez les frais accessoires pour lesquels le locataire paie un acompte.»
- **it:** «Se non seleziona alcuna categoria, Dwello non conteggia spese accessorie a questo inquilino. L’inquilino paga però un acconto. Con il conteggio spese accessorie gli rimborsa tutti gli acconti versati. Selezioni le spese accessorie per le quali l’inquilino paga un acconto.»
- **en:** «With no box ticked, Dwello bills this tenant no utility costs. But the tenant pays an advance payment. With the utility cost statement, you refund them all advance payments made. Tick the utility costs the tenant pays an advance payment for.»

Herkunft der Begriffe: `docs/design/i18n-begriffe.md`, Z. 37 (Akonto: acompte / acconto / advance payment), Z. 38 (Geleistete Akontobeiträge: acomptes versés / acconti versati / advance payments made), Z. 66/67 (frais accessoires, décompte des charges / conteggio spese accessorie / utility cost statement) und Z. 78 (Rückerstattung: remboursement / rimborso / refund). Satz 1 ist wörtlich aus `contracts_agreed_costs_none_text` in der jeweiligen Sprache übernommen. Satz 4 folgt dem Satz «Lassen Sie nur die Nebenkosten angekreuzt, für die der Mieter Akonto bezahlt.» aus #432 (`contracts_flat_rate_warning_text_advance`, «pour lesquels le locataire paie un acompte», «per le quali l’inquilino paga un acconto», «the tenant pays an advance payment for»).

Die Assertion im Szenario («Kreuzen Sie die Nebenkosten an, für die der Mieter Akonto bezahlt.») bleibt gleich. Den Wortlaut bestätigt noch der Produktverantwortliche (Entscheid #444).

Bewusst **nicht** empfohlen ist der Rat «Sind keine Nebenkosten vereinbart, löschen Sie das Akonto»: Die geleisteten Akontobeiträge berechnet Dwello aus dem Akonto des Mietvertrags (`calculation.service.ts:444-450`). Löscht der Vermieter beim Bearbeiten das Akonto, das der Mieter bezahlt hat, fehlt die Rückerstattung in der Nebenkostenabrechnung.

## Antworten auf die Fragen

1. **Erstattet Dwello das Akonto ohne vereinbarte Nebenkosten ganz zurück?** Ja, im Normalfall. `calculateStatementForContract` filtert die Rechnungsgruppen auf die vereinbarten Kategorien (`calculation.service.ts:378-379`). Ohne Häkchen bleiben keine Positionen übrig (Ausnahme: M-1 (a)), die Zwischensumme ist 0 und die Verwaltungspauschale beträgt x % von 0 = 0 (`:441-443`). Die geleisteten Akontobeiträge werden trotzdem berechnet (`:444-450`), und der Saldo ist `0 − Akonto` (`:453`), also negativ, das heisst eine Rückerstattung (Glossar Z. 175). Die Abrechnung kommt ohne vereinbarte Kategorien in den Lauf: `contractsInPeriod` filtert nicht nach Vereinbarung (`statement-generation.ts:100-102`), `contractAgreements` meldet sie nur im Schritt «Einstellungen» (`:127-145`).
2. **Im Recht?** Ja. Ohne besondere Vereinbarung schuldet der Mieter keine Nebenkosten (Art. 257a Abs. 2 OR). Die Abrechnung (Art. 4 Abs. 1 VMWG) stellt dem Akonto also null Kosten gegenüber, und der Vermieter muss alles zurückgeben. Art. 257b OR regelt nur, welche Kosten Nebenkosten sind (Abs. 1) und die Belegeinsicht (Abs. 2). Der Satz zur Rückerstattung stützt sich nicht darauf. Er widerspricht ihm aber auch nicht.
3. **Widerspruch zum Pauschale-Satz?** Logisch nicht, im Lesefluss ja. Siehe V-1, behoben mit der Variante, die den Text ersetzt.

## Nachgerechnet (Saldo ohne vereinbarte Nebenkosten)

Gerechnet mit `calculateTotalAdvancePayments` und `calculateBalance` aus dem Worktree (Bun, Kosten 0):

| Akonto/Monat | Mietstage | Geleistete Akontobeiträge | Saldo | Bedeutung |
|---|---|---|---|---|
| 150 | 1.1.–31.12.2027 | 1’800.00 | −1’800.00 | Rückerstattung des ganzen Akontos |
| 150 | 16.3.–31.12.2027 (Mieterwechsel) | 1’427.42 (16/31 + 9 Monate) | −1’427.45 | ganz zurück, auf 5 Rappen zugunsten des Mieters gerundet (Glossar Z. 175) |
| 0 | 1.1.–31.12.2027 | 0.00 | 0.00 | kein Akonto, also gilt die Variante nicht: Text ohne Akonto, Ton wie heute |
| 150 | 31.12.2027 (1 Tag) | 4.84 | −4.85 | unter dem Mindestbetrag (#94): keine Auszahlung (M-1 b) |

## Bestätigt

- **Art. 257a Abs. 2 OR** (Fedlex, Fassung 1.10.2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Damit sind «Ohne Häkchen rechnet Dwello … keine Nebenkosten ab» und die volle Rückerstattung belegt.
- **Art. 257b OR** (Fedlex, Fassung 1.10.2026), Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- **Art. 4 VMWG** (Fedlex, Fassung 1.10.2025), Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Abs. 2: «Erhebt er sie pauschal, muss er auf Durchschnittswerte dreier Jahre abstellen.» Ein Akonto ist ein Vorschuss auf eine Abrechnung. Ohne Häkchen gibt es nichts abzurechnen, mit oder ohne Pauschale. Deshalb ist `caution` auch mit Pauschale richtig.
- **Begriffe** Akonto (Glossar Z. 51), Nebenkostenpauschale (Z. 52), Vereinbarte Nebenkosten (Z. 55), Geleistete Akontobeiträge (Z. 174), Saldo/Rückerstattung (Z. 175): im Szenario und im empfohlenen Text richtig verwendet.
- **Ton `caution` mit Akonto, auch mit Pauschale:** passt zum Glossar Z. 52 (alles pauschal heisst kein Akonto). Er widerspricht dem Szenario Helga 429 P-1 (`contract-new.feature:232-238`, nur Pauschale, Ton `info`) nicht, denn dort ist kein Akonto erfasst.
- **Szenario:** Die Schritte und die Assertion passen zum Entscheid. Der DOM-Test prüft Ton und Satz.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- **Rückforderung durch den Mieter ausserhalb der Abrechnung** (Art. 62 Abs. 2 OR, Fedlex: «… wenn jemand ohne jeden gültigen Grund … eine Zuwendung erhalten hat»; Art. 63 Abs. 1 OR, Irrtum bei freiwilliger Zahlung einer Nichtschuld): Ob das Bereicherungsrecht auf Akontozahlungen ohne Nebenkostenvereinbarung anwendbar ist, habe ich nicht geprüft: **unsicher**. Der empfohlene Text stützt sich nicht darauf, sondern nur auf die Abrechnung.
- **Fall «Akonto im Mietvertrag, aber keine Nebenkosten einzeln aufgezählt»** (nur ein Akontobetrag ohne Liste): wie in der Praxis zurückabgewickelt wird, nicht recherchiert: **unsicher**. Der Text gibt hier bewusst keinen Rat (siehe oben, kein «Akonto löschen»).
- **Umsetzungsstand #407 Punkt 4** (Lauf sperren bei Rechnungen ohne Kategorie): Im Worktree fand ich weder «Rechnungen ohne Kategorie» in `messages/` noch in `src/` oder `backend/src` (nur in einem Test). Ich gehe davon aus, dass der Punkt nicht umgesetzt ist.
- Gesucht: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Z. 102, 121), `docs/reviews/432-fachreview-1.md`, `messages/*.json`, `src/routes/contracts/AgreedCategories.svelte`, `src/routes/contracts/new/RentStep.svelte`, `src/lib/server/statement-generation.ts`, `backend/src/services/{calculation,agreed-category,invoice,pdf-format}.service.ts`, `tests/e2e/features/contract-{new,edit}.feature`, `tests/e2e/steps/agreed-costs.steps.ts`, `tests/e2e/fixtures/backend.ts`, Issues #382, #407, #444 (GitHub API). Fedlex-Wortlaut über die Filestore-HTML (OR Fassung 20261001, VMWG Fassung 20251001), gefunden über den Fedlex-SPARQL-Endpunkt und `mmx search`.
