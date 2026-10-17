# Code-Review Merge bf177ef (main in W10c, #363), Runde 2

Gegenstand: `git show bf177ef --cc`, `git diff bf177ef^1 bf177ef`, Worktree `review-w10c-merge2`. Main brachte #120 (W2e, berichtigte Abrechnung, Migration 0018_statement_correction.sql) und #160 (Wortsuche).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement.service.ts:621-651, src/routes/statements/[id]/+page.server.ts:80 | «Berichtigte Abrechnung erstellen» ruft `generateStatement` direkt auf. Die Frage nach unbeantworteten Kategorien (Schritt «Einstellungen») und der Hinweis auf nicht vereinbarte Nebenkosten fallen weg. Kosten einer unbeantworteten Kategorie fehlen in der Berichtigung ohne Hinweis |
| C-2 | Minor | backend/src/__tests__/statement-correction.pg.test.ts | Kein Test zeigt, dass eine berichtigte Abrechnung nur vereinbarte Kategorien abrechnet und `agreed_category_ids` und den vereinbarten Tankbestand speichert. Laut Code stimmt es (siehe unten), aber nur über den gemeinsamen Pfad `generateStatement` |
| C-3 | Nit | docs/archive/implementation-plan-verlauf.md (Session W10c, «Files changed») | Nennt noch `backend/migrations/0018_contract_categories.sql`; der Slice-1-Punkt derselben Session sagt schon 0019 |
| C-4 | Nit | backend/src/db/migrate.ts:29-35 | Eine lokale Datenbank, die den alten Branch-Stand `0018_contract_categories.sql` angewendet hat, bricht jetzt mit «Migrationen, die es nicht mehr gibt» ab und muss mit `db:reset` neu aufgesetzt werden. Das gilt nur für Entwicklungsdatenbanken (die Migration war nie auf main). Ein Hinweis in der PR-Beschreibung reicht |

## C-1 (Major): Die Berichtigung umgeht die Frage nach unbeantworteten Kategorien

**Warum falsch:** Die Regel von #91 (Fachreview W10c-2, Entscheid 3; `docs/data-model.md`, contract_categories) lautet: Eine Kategorie ohne Zeile ist noch nicht beantwortet, sie wird nicht abgerechnet, «and the statement wizard asks when it has costs in the period». Das Szenario «Ohne Antwort geht der Assistent nicht weiter» in `statement-agreed-costs.feature` macht daraus eine harte Bedingung. Das Backend erzwingt die Regel nicht: `/statements/generate` rechnet Unbeantwortetes einfach nicht ab. Nur der Assistent fragt (`src/routes/api/statements/agreements/+server.ts` -> `agreementsInPeriod`).

Main bringt einen zweiten Weg zu einem Entwurf: `correctStatement` (Knopf `statement-create-correction-button` -> Action `?/correct` -> `POST /statements/:id/correction`). Dieser Weg erzeugt den Entwurf ohne Assistent. Das trifft gerade den typischen Grund einer Berichtigung: Eine Rechnung wurde vergessen und jetzt nachgetragen. Ist ihre Kategorie für den Mietvertrag unbeantwortet, fehlt sie in der Berichtigung. Unbeantwortet ist eine Kategorie zum Beispiel, wenn sie neu oder erst später umlagefähig ist, oder bei einem migrierten Vertrag, wenn ihre Rechnung erst nach der Migration erfasst wurde.

Kein Hinweis zeigt diese Lücke. `AgreedCosts.svelte` und `AgreementQuestion.svelte` gibt es nur im Assistenten. `changedInvoices` filtert über `agreedIn` mit den gespeicherten `agreedCategoryIds`, also meldet auch der Entwurf «Rechnung geändert» nicht. Das PDF sagt dann «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: …» und lässt eine Kategorie weg, die der Vermieter nie als nicht vereinbart angegeben hat.

Der Abrechnungslauf derselben Periode (der andere Weg zur Berichtigung, `openReplaced`) fragt dagegen. Die beiden Wege zur selben berichtigten Abrechnung verhalten sich also verschieden. Das Problem entsteht erst durch den Merge: Keine Seite allein hat es.

**So zeigt man den Fehler** (`*.pg.test.ts`):
1. Einen Mietvertrag anlegen. Danach eine neue umlagefähige Kategorie K anlegen, sie hat keine Zeile in `contract_categories`.
2. Abrechnung für 2024 erzeugen, versenden, `replaceStatement`.
3. Eine Rechnung von K mit Datum in 2024 erfassen.
4. `correctStatement(id)` aufrufen.

Ergebnis: Ein Entwurf ohne Position K, ohne Ablehnung und ohne Hinweis. `agreementsInPeriod` liefert für denselben Vertrag und dieselbe Periode `{ categoryId: K, agreed: null }`. Im UI (E2E): Rechnung K nachtragen, «Abrechnung berichtigen», «Berichtigte Abrechnung erstellen». Der Entwurf zeigt K nicht, und es kommt keine Frage.

**Mögliche Lösungen** (Produktentscheid, ob es eine Ablehnung oder eine Frage wird):
- `correctStatement` lehnt mit einem codierten Fehler ab (z. B. `STATEMENT_AGREEMENTS_OPEN` mit `backend_<code>` in allen vier Sprachen), solange `agreementsInPeriod` ein `agreed: null` liefert. Die Meldung schickt zum Abrechnungslauf oder zum Mietvertrag.
- Oder der Knopf führt in den Assistenten der Periode.

Weil #120 den direkten Knopf entschieden hat, gehört die Wahl eventuell unter «Blocked on me».

## Bestätigt beim Lesen

- **Konflikt `schema.ts`:** `primaryKey` (Branch) und `type AnyPgColumn` (main) sind importiert. `agreedCategoryIds`, `replacesId` und `priorPayments` sind alle in `utilityStatements`. `contractCategories` mit `primaryKey` ist unverändert.
- **Konflikt `statement-pdf.service.ts` (`toPdfData`):** `agreedCosts` (Branch) und der `replaces`-Spread (main) sind beide da. `pdf.service.ts` rendert beide (`agreedCosts` Zeile 859, `replacesNote` Zeile 580).
- **Konflikt `implementation-plan-verlauf.md`:** Die Sessions W4e und W10c stehen beide da.
- **Korrekturpfad rechnet nach Vereinbarung ab:** `correctStatement` ruft `generateStatement` auf, dieses `calculateStatement` und dann `calculateStatementForContract`. Dort filtert Zeile 319-320 nach `agreedCategoryIds(contractId)`. `generateStatement` speichert `agreedCategoryIds: calculation.agreedCategoryIds` und `fuelStock: agreedStock(...)` (nur bei vereinbarter Tank-Kategorie) neben `replacesId` und `priorPayments`. Der Heizanteil kommt aus den gefilterten `invoiceGroups` (`heatingOfRun`, Zeile 331). Die PDF-Zeile `agreedCosts` folgt `statement.agreedCategoryIds` und damit derselben Regel. Abgedeckt nur über die Tests von `generateStatement`, siehe C-2.
- **`changedInvoices` / `invoiceStatements`:** Der Merge hat in `statement-invoices.service.ts` nichts verändert. Beide wenden `agreedIn` je Abrechnung an, auch auf eine berichtigte (sie hat `agreedCategoryIds`). Eine ersetzte Abrechnung von vor #91 (`null`) zählt weiter jede Kategorie, wie zuvor. Dass ersetzte Abrechnungen in `invoiceStatements` mitzählen, war schon auf main so und kommt nicht vom Merge.
- **Migrationsreihenfolge:** `migrate.ts` sortiert nach Dateiname und führt nach Name Buch. Eine installierte Datenbank von main (bis 0018_statement_correction) bekommt 0019 als einzige ausstehende Migration. 0019 liest nur `utility_statements` und `utility_statement_line_items`, nicht die Spalten von 0018. Ersetzte Abrechnungen zählen dort wie jede andere als «abgerechnet», was fachlich stimmt. Der Filter in `migrations.pg.test.ts` (`< '0019_contract_categories.sql'`) nimmt 0018_statement_correction in den Vorher-Stand auf. `docs/data-model.md` nennt `0019` und `0003 … 0019`.
- **`contract.service.ts` (main, `ne(status, 'replaced')`):** Kein Konflikt mit der Vereinbarungslogik des Branchs.

## Nicht bestätigt

- **Checks des Aufrufers, vom Aufrufer gemeldet, nicht selbst wiederholt:** Backend type-check; `bun run test` (886 grün, Abdeckung 94.6 %); `bunx vitest run` (2888 grün); lint; check. Der volle E2E-Lauf war beim Review noch nicht fertig.
- **C-1 nur durch Lesen gezeigt:** Gelesen habe ich `statement.service.ts`, `agreed-category.service.ts`, `routes/statements.ts`, `src/routes/statements/[id]/+page.server.ts` und `Correction.svelte`. Gegen eine Datenbank geprüft habe ich es nicht, denn Backend-Tests waren nicht erlaubt.
- **Ob der Produktentscheid in #120 oder #363 die direkte Berichtigung bei unbeantworteten Kategorien schon regelt:** Die Issues habe ich nicht gelesen, nur `docs/anforderungen-vertragsende.md` A-11 und `docs/reviews/w10c-fachreview-2.md`.
- **Die übrigen Dateien von main** (Suche #160, Personas, Dokus): Ich habe sie nur auf Konflikte mit W10c durchgesehen und nicht neu geprüft. Main hat sie schon reviewt.
