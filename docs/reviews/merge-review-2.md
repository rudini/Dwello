# Review Merge-Commit 926da71 (Slice «merge-2»)

Worktree `review-merge-2`, detached auf `926da71` (Eltern `8e08408` Branch, `a235fdb` main). Gelesen: `git show 926da71 --remerge-diff` vollständig, also jede Konfliktauflösung der 17 Dateien, die Umbenennung der Migration und die drei Doku- und Testkorrekturen C-8 bis C-10. Ausserdem gelesen: `backend/src/services/old-address.ts`, `0013_contract_moved_out.sql`, `migrate.ts`, `migrations.pg.test.ts`, die `movedOut`-Stellen im Backend, `src/routes/dashboard/+page.server.ts`, `src/routes/contracts/[id]/+page.server.ts`, `old-address.pg.test.ts`, `dashboard.feature` (A-5 und A-6), `docs/anforderungen-vertragsende.md` (A-5 und A-6), `docs/reviews/closing-review-3.md` und `backend/CLAUDE.md` (Migrationen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `backend/src/services/old-address.ts:11-23`, `src/routes/dashboard/+page.server.ts:105-127` | Ein abgelaufener befristeter Mietvertrag ohne «Mieter ist ausgezogen» gilt für A-5 als «ausgezogen». Für A-6 heisst derselbe Zustand aber «wohnt der Mieter vielleicht noch dort?». Hat der Mieter die Adresse des Gebäudes und einen Entwurf, zeigt Dwello zwei Aussagen, die sich widersprechen |
| C-2 | Nit | `docs/archive/implementation-plan-verlauf.md:889-890` | Zwischen der Zeile «Files: …» der Session W1b (main) und «## Session: Korrespondenzadresse …» fehlt die Leerzeile |
| C-3 | Nit | `backend/migrations/0015_tenant_country.sql` | Die Umbenennung ist zulässig, denn die Datei war nie auf `main` (`backend/CLAUDE.md:27`). Eine lokale Dev-Datenbank dieses Branches, die `0013_tenant_country.sql` schon angewendet hat, verweigert aber den Start mit «Migrationen, die es nicht mehr gibt» und braucht `bun run db:reset`. Das ist erwartet und nur einen Hinweis im PR wert |

ponytail-review: Die Auflösungen übernehmen beide Seiten ohne eigenen Code. In `contracts/[id]/+page.server.ts` verwendet `nextStepsDue` jetzt main's `successorAfter` und kopiert dessen Abfrage nicht. Eine Zeile weniger ginge nicht. Lean already.

## C-1 (Major): A-5 hält einen Mieter für ausgezogen, nach dessen Verbleib A-6 erst fragt

**Warum falsch.** `oldAddress` (A-5) gilt so: «Vertragsende vor heute, kein laufender Mietvertrag des Mieters, Adresse = Gebäude». `terminated` und `moved_out` prüft die Regel nicht. A-6 (`expired` in `dashboard/+page.server.ts:113-127`, `fixedTermCheckDue` in `contracts/[id]/+page.server.ts:82-87`) behandelt einen nicht gekündigten Vertrag mit Ende vor heute, ohne späteren Vertrag und ohne `movedOut` dagegen als offen: Der Mieter wohnt vielleicht noch dort, und der Vertrag läuft nach Art. 266 Abs. 2 OR unbefristet weiter. Ein Mieter, der geblieben ist, hat fast immer die Adresse des Gebäudes. Vor dem Merge gab es diesen Zustand auf dem Branch nicht. Er entsteht durch den Merge. Für den Verwalter ergibt sich damit gleichzeitig:
- In der Übersicht steht «Neue Adresse eintragen» für X (A-5) und «Befristeten Mietvertrag prüfen» für X (A-6).
- Die Detailseite und der Dialog «Als versendet markieren» des Entwurfs sagen «X ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.» (`statements_old_address`). Dasselbe sagt die Vorschau im Assistenten.
- Die Seite des Mietvertrags fragt «Wohnt X noch in der Wohnung …? Dann läuft der Mietvertrag unbefristet weiter.» (`contracts_fixed_term_question`).

Wer der Warnung folgt, trägt bei einem Mieter, der geblieben ist, womöglich eine falsche «neue» Adresse ein, oder er bestätigt ohne Prüfung «Mieter ist ausgezogen».

**Wie man es zeigt.** Die bestehenden Tests stellen genau diesen Zustand her und prüfen nur je eine Seite:
- `tests/e2e/features/dashboard.feature:170-176` («Alte Adresse eines ausgezogenen Mieters als Aufgabe»): «Bruno Meier mietete … von 2024-01-01 bis 2024-06-30» ist derselbe Schritt, mit dem die A-6-Szenarien (`:182-185`) einen befristeten Vertrag anlegen. In diesem Szenario zeigt die Übersicht also auch «Befristeten Mietvertrag prüfen» für Bruno Meier. Ergänzt man `Und nennt die Übersicht keine Aufgabe "Befristeten Mietvertrag prüfen" für "Bruno Meier"`, wird das Szenario rot. Das habe ich nur durch Lesen erschlossen, nicht ausgeführt.
- `backend/src/__tests__/old-address.pg.test.ts:31` legt mit `createRental(…, { endDate: '2024-03-31' })` einen nicht gekündigten Vertrag ohne `movedOut` an und erwartet `oldAddress === true` (`:53`).

**Lösung (Vorschlag, fachlich zu bestätigen).** In `old-address.ts` zusätzlich `and (c.terminated or c.moved_out)` verlangen: A-5 warnt erst, wenn der Auszug feststeht, also nach einer Kündigung oder wenn «Mieter ist ausgezogen» bestätigt ist. Danach sind diese Tests anzupassen: ein pg-Test «warnt nicht nach einem abgelaufenen befristeten Mietvertrag ohne Bestätigung des Auszugs», das Szenario in `dashboard.feature` (Kündigung oder Bestätigung als Voraussetzung, dazu ein Negativfall), `statement-generate.feature:122` und `statement-detail.feature:60`, je nach ihren Voraussetzungen. Die Regel «Ausgezogen heisst …» steht als umgesetzt in `docs/anforderungen-vertragsende.md:173`. Wenn #114 sie so entschieden hat, braucht es vor der Änderung einen Entscheid des Product Owners (dann unter «Blocked on me»).

## Bestätigt

- `backend/src/routes/statements.ts`: Beide Importe sind da (`changeStatementStatus` und `changedInvoices`).
- `src/lib/overview.ts`: Die Reihenfolge ist Arbeitsaufgaben, Adresse, Nachmieter, befristet, wie verlangt. `overview.test.ts` enthält den A-5- und den A-6-Test, und der Default des Inputs kennt beide Felder.
- `src/routes/contracts/[id]/+page.server.ts`: `nextStepsDue` behält nach dem Vertragsende den Adressschritt, solange `oldAddress` gilt (`{ successor: false, ended: true }`). Vorher gibt es `{ successor, ended: false }` über main's `successorAfter`. `fixedTermCheckDue` ist unverändert, und `ContractDetailsData` hat beide Felder. Getestet in `contract-actions.test.ts:58-91` und `:513`.
- `dashboard/+page.server.ts`: `oldAddresses` und `expiredContracts` stehen beide im Input.
- `statements/[id]/+page.server.ts`: `countryName` ist da. `StatementWithDetails` fällt wie auf main weg, und `bun run check` ist laut Aufrufer sauber.
- `statement-actions.test.ts`: Der Ländertest (#102) und der Test zu #96 sind da, der alte Test zu den Nachzüglern fehlt wie auf main.
- a11y: `statement-old-address-detail` (default, send-dialog) und `statement-parts-detail` (default) stehen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- `tests/e2e/fixtures/screens.ts`: Ida und Kurt (Bergsicht 2.04 und 2.05, gekündigt, Adresse des Gebäudes) und Gina (Talblick 3.01, befristet, ohne Adresse des Gebäudes) kollidieren nicht. Ida und Kurt sind gekündigt und bekommen deshalb keine A-6-Aufgabe. Ginas Vertrag erzeugt keine A-5-Warnung, deshalb zeigt kein a11y-Bildschirm C-1. Die Schlüssel `movedOutContract`, `oldAddressStatement` und `expiredContract` sind gesetzt.
- E2E-Importe (questions, steps, targets): Beide Seiten sind vollständig, Lint ist laut Aufrufer sauber.
- `docs/anforderungen-vertragsende.md`: A-5 und A-6 sind beide «umgesetzt».
- Migration: `migrate.ts` sortiert nach Dateinamen. `0013_contract_moved_out`, `0014_line_item_invoices` und `0015_tenant_country` hängen nicht voneinander ab. `migrations.pg.test.ts` filtert nur `< 0012_…`. Der alte Name kommt nur noch in `docs/reviews/closing-review-1.md` vor, einem historischen Bericht.
- C-8: `docs/api-specification.md:227` nennt jetzt, dass `POST /:id/generate-pdf` das gespeicherte PDF mit heutigen Daten neu erstellt (D-1).
- C-9: Der Testname lautet «… mit Saldo 0».
- C-10: Im Archiv sind Runde 3, die abschliessenden Reviews 1 bis 3, `anna-w3c-2.md` und `w3c-datenpruefung-2.md` eingetragen. Alle genannten Berichte gibt es.
- Neu ausgeführt: `bunx vitest run` mit `overview.test.ts`, `statement-actions.test.ts`, `contract-actions.test.ts` und `contract-detail-page.dom.test.ts`: 129 bestanden.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bun run lint`, `bun run check`, Backend `type-check`, `bunx vitest run` komplett (2788) und `tests/unit` (177), Backend `bun test` (792). Den vollständigen E2E-Lauf (chromium + api) meldet der Aufrufer als noch laufend; ich kenne sein Ergebnis nicht.
- C-1 habe ich nur durch Lesen von `old-address.ts`, `dashboard/+page.server.ts`, `dashboard.feature:170-185` und `old-address.pg.test.ts:31` belegt, nicht mit einem Lauf. Dass der Schritt «mietete … von … bis …» einen nicht gekündigten Vertrag anlegt, schliesse ich daraus, dass die A-6-Szenarien ihn so verwenden. Seinen Code habe ich nicht gelesen.
- Ob #114 die Regel «Ausgezogen heisst …» als Entscheid des Product Owners festgelegt hat, habe ich nicht geprüft (Issue nicht gelesen).
- Den Rest des Merge-Deltas (Änderungen von main ohne Konflikt, 109 Dateien) habe ich nicht neu geprüft. Er ist auf main reviewt worden.
