# Review #142, Runde 2 – Delta 600edda..e9c6d53

Geprüft: `git diff 600edda..e9c6d53` im Worktree `review-142-code2` (detached auf e9c6d53). Gelesen habe ich alle 19 geänderten Dateien: die drei Persona-Berichte, den Bericht der Runde 1, den Plan, die vier `messages/*.json`, die drei Unit- bzw. DOM-Tests, `MissingStatement.svelte`, `screens.json`, `tests/contracts/README.md`, beide Features und `tests/e2e/tasks/accessibility.ts`. Dazu habe ich gelesen:
- `src/lib/ui/Button.svelte`
- `src/routes/contracts/[id]/+page.server.ts` (`missingStatements`)
- `tests/contracts/contract.json` und `period-statements.json`
- `tests/e2e/fixtures/screens.ts` (Seed)
- `tests/e2e/targets/accessibility.ts` (`shown`) und `targets/contract-detail.ts`
- `src/lib/server/statement-generation.ts` (`generateStatements`)
- `backend/src/services/statement.service.ts` (`generateStatement`), `calculation.service.ts` (`generateStatementNumber`) und `fuel-stock.service.ts`
- `docs/design/design-decisions.md` (D18/D19)

Kein Blocker, kein Major.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-8 | Minor | `src/routes/contracts/[id]/MissingStatement.svelte:41`, `src/__tests__/contract-detail-page.dom.test.ts:247` | Bei mehreren Perioden heisst der sichtbare Knopf nur noch «2025», ohne Verb. Das widerspricht «verbs on buttons» (CLAUDE.md «Design-Regeln», Copy; `design-decisions.md` D18/D19). Marco schlug in P-2 ausdrücklich kürzere Texte vor, aber «solange das Verb bleibt» (`marco-issue-142.md:52`). Das Verb steht jetzt nur im `aria-label`. Wer die Seite sieht, hat einen Knopf «2025» mit Rechner-Symbol. Die Abweichung von der Regel ist im Plan nicht als Entscheid festgehalten. Ein Vorschlag mit Verb: «2025 erstellen» bzw. «Erstellen: 2025», so knapp wie möglich. Oder die Abweichung als Entscheid festhalten. |
| C-9 | Minor | `messages/de.json:1291` (und fr/it/en) | «Erfassen Sie zuerst die Rechnungen der Periode; die Reihenfolge spielt keine Rolle.» Direkt nach «zuerst» bezieht man «die Reihenfolge» auf Rechnungen und Abrechnungen. Dann widerspricht der zweite Satzteil dem ersten. Gemeint ist die Reihenfolge der Perioden (Anna P-3, Marco P-3). Vorschlag: «… ; mit welcher Periode Sie beginnen, spielt keine Rolle.» Dasselbe gilt in fr/it/en. Inhaltlich stimmt die Aussage, siehe «Bestätigt». |
| C-10 | Minor | `messages/de.json:1289` | Die Persona-Befunde Helga P-2/P-3 und Anna P-4 (ganzes Gebäude; zuerst die Rechnungen erfassen) gelten auch, wenn nur eine Periode fehlt. Der Plan zeigt sie als behoben, aber nur der Text für mehrere Perioden (`contracts_statements_missing_text`) wurde ergänzt. `contracts_statement_missing_text` sagt weiterhin nur «Erstellen Sie sie im Assistenten.», und der Knopf führt auch dort in den Assistenten für das ganze Gebäude. |
| C-11 | Minor | `implementation_plan.md:77-79` | Die Persona-Fixes ändern Verhalten, das man sieht: einen neuen Text, Knopftexte und `aria-label`. Im Plan fehlt dafür eine Zeile `Test red: …` (Workflow 6: «A fix that changes behavior … gets a failing test first»). Ausserdem bringt der Fix einen Text und eine Knopfform, die die Personas noch nicht gesehen haben. Workflow 6 verlangt dafür eine weitere Persona-Runde, und im Plan steht dafür kein Punkt. |
| C-12 | Nit | `tests/e2e/tasks/accessibility.ts:151-153` | `'missing-statements'` wurde zwischen den Kommentar von `'end-dialog-refused'` («the 2025 draft already bills …») und dessen Eintrag eingefügt. Dieser Kommentar steht jetzt über dem falschen Zustand. |

## Blocker/Major

Keine.

## Status der Befunde aus Runde 1

- **C-1, behoben.** Der Test baut die Antworten aus `tests/contracts/contract.json` (`building.id` = `b1`, das passt zum erwarteten `href`) und aus `period-statements.json`. Die README nennt jetzt `?contractId=…`.
- **C-2, behoben.** Der Fake filtert nach `contractId` und gibt ohne den Parameter alles zurück. Die Abrechnung `c0` für das letzte Jahr würde dieses Jahr als abgerechnet zählen, wenn `contractId=` in `+page.server.ts:77` fehlte. Der Test «nennt jede abgelaufene Periode …» würde dann rot. Das habe ich aus dem Code geschlossen und nicht ausgeführt.
- **C-3, behoben.** Der Zustand `missing-statements` steht in `screens.json` (Zustand und Bedeutung), in `accessibility.feature:81` und in `sprachen-bildschirme.feature:82`. Der Task wartet auf `contract-missing-statement`; fehlt der Zustand im Seed, schlägt die Zeile deshalb fehl, statt still zu bestehen. Der Seed (Anna ab 2015, Abrechnungen 2024/2025) passt zur Beschreibung. Den Zustand mit einer einzigen fehlenden Periode besucht axe weiterhin nicht. Sein Markup hat sich im Delta nicht geändert (nur die wirkungslose `variant`-Zeile ist weg).
- **C-4, behoben.** Die Zeile `variant` ist entfernt; der Standard `secondary` bleibt.
- **C-5, abgelehnt.** Die Begründung trägt: `start_date` ist `notNull`.
- **C-6:** an #199 übergeben. Das Issue selbst habe ich nicht gelesen.
- **C-7, behoben.** Der Test steht jetzt in einem eigenen `describe` «Abgelaufene Abrechnungsperioden».

## Bestätigt

- **Kurze Knöpfe mit vollem Namen:** Sichtbar ist `periodOf(period)`, das `aria-label` heisst «Abrechnungen {period} erstellen» (`Button.svelte` reicht `ariaLabel` an `<a>` weiter). Der sichtbare Text steckt im zugänglichen Namen (Label in Name). Der DOM-Test prüft Text, `aria-label` und `href`. Bei nur einer Periode gibt es kein `aria-label`, und der Text ist wie bisher `dashboard_create_statements`.
- **Neuer Text in vier Sprachen:** de/fr/it/en sind geändert, die Anrede formell (Sie/vous/Lei). Der Schlüssel `contracts_statement_create` steht jetzt im Plural, passend zu `dashboard_create_statements`.
- **Inhalt des Textes:**
  - «Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes» stimmt. `generateStatements` (`statement-generation.ts:111-124`) erstellt für jeden Mietvertrag des Gebäudes in der Periode eine Abrechnung.
  - «die Reihenfolge spielt keine Rolle» stimmt für die Perioden: Die Nummer hängt am Jahr des Periodenendes (`generateStatementNumber`), und der Tankbestand an den Ablesungen am Tag vor bzw. am Ende der Periode (`fuel-stock.service.ts:38`). Beides hängt nicht an einer früheren Abrechnung.
  - Die Abhängigkeit vom Vorjahr in `invoice-completeness.service.ts` betrifft Rechnungen, nicht Abrechnungen.
- **E2E:** Die Szenarien sprechen den Knopf über `data-testid` an (`targets/contract-detail.ts:41-42`), nicht über seinen Text. Der geänderte Knopftext bricht deshalb kein Szenario.
- **O-27:** Die Zeile in `offene-punkte.md` hat das Format der Tabelle und fasst die drei «Beobachtungen» zusammen.
- **Formatierung:** Prettier meldet auf den vier geänderten Code- und Testdateien keine Abweichung.
- **Selbst wiederholt:** `bunx vitest run` auf `contract-actions.test.ts`, `contract-detail-page.dom.test.ts` und `settings.test.ts` ergibt 75 passed.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** lint 0, check 0, `deepcheck:audit` still, fallow sauber, `test:coverage` 2434 passed, E2E `contract-detail.feature` chromium + api 28 passed, axe- und Sprachzeilen von contract-detail 14 passed.
- **Rot von C-2:** Dass der Test ohne `contractId=` rot wird, habe ich nur aus dem Code geschlossen. Ich habe ihn nicht ausgeführt, weil ich keine Datei ändern darf.
- **Kurze Knöpfe auf dem Handy:** Wie die Knöpfe bei 390 px nebeneinander aussehen, besonders Perioden über den Jahreswechsel («01.07.2024 – 30.06.2025»), habe ich nicht gesehen. Die axe-Läufe decken nur Kalenderjahre ab.
- **Offener Persona-Major P-1:** Dass der Product Owner «ab Vertragsbeginn» beibehält und den Fall in #133 aufnimmt, habe ich nicht im Issue geprüft. Ebenso nicht geprüft habe ich #199 (C-6) und #211.
