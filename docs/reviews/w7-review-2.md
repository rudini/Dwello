# Code-Review W7, Runde 2: Delta b466c69..ca3f3ba

Worktree: `review-w7-code2` (ca3f3ba). Geprüft habe ich `git show ca3f3ba` ohne `docs/design/personas` und `docs/reviews`. Der Merge 81f8c52 ändert nur `docs/archive/implementation-plan-verlauf.md`, `docs/design/offene-punkte.md` und `tests/e2e/tasks/accessibility.ts` aus origin/main und gehört nicht zum Slice, deshalb habe ich ihn übersprungen. Alle 15 geänderten Dateien des Commits habe ich gelesen, als Hintergrund dazu `docs/reviews/w7-fachreview-2.md` (V-3, V-11, V-12).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | tests/e2e/features/contract-detail.feature:184-186 | «Dann meldet der Dialog "Sie können den Entwurf unten löschen …"» wartet über `actor.sees` (expect.poll) auf die erste Ablehnung. Erst danach legt der Seed die Abrechnung 2025 an. Der Wettlauf ist weg |
| C-2 | erledigt | src/routes/contracts/ContractForm.svelte:165 | Der Kommentar nennt jetzt den richtigen Grund für den Vorabcheck |
| C-3 | erledigt | src/routes/contracts/ContractForm.svelte:173 | Die Zeile ist Prettier-sauber |
| C-7 | erledigt | tests/e2e/steps/contract-detail.steps.ts:94 | Der Schritt verwendet `deleteContract`. Das Duplikat ist entfernt |
| C-8 | erledigt | tests/e2e/steps/contract-detail.steps.ts | Der doppelte Schritt ist entfernt. Das Szenario verwendet den bestehenden Given-Schritt |
| C-9 | erledigt | backend/src/services/contract.service.ts:306 | Der Default `q = db` ist entfernt |
| C-12 | erledigt | messages/de.json:1373-1374 | Der holprige Satz ist ersetzt |
| C-13 | Minor | tests/e2e/features/contract-detail.feature:87, src/routes/contracts/[id]/DeleteContract.svelte:72-83 | Die sichtbare Änderung aus V-3 und V-11 belegen nur DOM-Tests: der Status je Abrechnung, der Weg «Entwürfe löschen» bzw. «versendet/bezahlt bleibt» und der Text mit Vertragsende statt «Beenden». Das Szenario «Mietvertrag mit Abrechnung kann nicht gelöscht werden» prüft nur den Satzanfang vor `{numbers}`. Ohne die Änderung bleibt es grün. Eine zusätzliche Zeile wie `Und nennt der Dialog "Löschen Sie zuerst die Entwürfe, danach lässt sich der Mietvertrag löschen."` würde den Weg zeigen. Der Seed legt einen Entwurf an. Minor, weil das Dialogverhalten (#116) schon ein Szenario hat und die neuen Varianten nur den Wortlaut betreffen |
| C-14 | Minor | tests/a11y/screens.json:244-274, tests/e2e/fixtures/screens.ts:63,67 | Die Sprach- und axe-Zeilen zeigen die Variante «nur Entwürfe» (Annas Abrechnungen 2024 und 2025 sind Entwürfe) und die Variante mit Vertragsende (Doras Kündigung setzt `endDate`). `contracts_delete_billed_locked` erscheint dagegen auf keinem Bildschirm, den die Zeilen öffnen. Der Text steht in allen vier Sprachen. Eine Prüfung «fr/it/en ohne Deutsch» gibt es für diese Variante aber nicht |
| C-15 | Nit | src/routes/contracts/[id]/DeleteContract.svelte:32-38, src/lib/contract-status.ts:123 | ponytail `reuse:` Die Zuordnung `paid` → `contracts_billed_paid`, sonst `contracts_billed_sent` gibt es schon in `billedDaysError`. Das Element `statementNumber (status)` wird jetzt an zwei Stellen gebaut. Der Helfer `listed()` daneben gäbe auch «A, B und C» statt einer reinen Kommaliste |
| C-16 | Nit | DeleteContract.svelte:34 (messages/*.json:380) | `statements_status_draft` ist ein Statuslabel mit grossem Anfangsbuchstaben. In en/fr/it entsteht daraus «NK-1 (paid), NK-2 (Draft)» bzw. «(payé) … (Brouillon)», also gemischte Gross- und Kleinschreibung. Auf Deutsch stimmt es («bezahlt», «Entwurf») |
| C-17 | Nit | src/__tests__/contract-detail-page.dom.test.ts:615-617 | Eigene Zeilen nicht Prettier-sauber: `bunx prettier` bricht den Aufruf `open(...)` auf mehrere Zeilen um |
| C-18 | Nit | tests/e2e/features/contract-detail.feature:185 | `Und für "Anna Keller" gibt es die Abrechnung 2025 …` steht direkt unter `Dann` und liest sich als Prüfung, ist aber ein Seed. Lesbarer wäre `Und inzwischen gibt es …` mit demselben Schritttext. Das wäre ein Alias, kein zweiter Schritt, oder ein eigenes `Angenommen` vor dem zweiten `Wenn` |
| C-19 | Nit | messages/de.json:1374 | «Löschen Sie zuerst die Entwürfe» steht auch bei genau einem Entwurf in der Mehrzahl (wie im Szenario mit der Abrechnung 2025). V-3 hatte die feste Mehrzahl bemängelt. Das bewertet `fach-reviewer` |
| C-4, C-5, C-6, C-10, C-11 | Minor/Nit | siehe Runde 1 | Vom Aufrufer begründet zurückgestellt. Durch das Delta unverändert |

Kein Blocker, kein Major offen.

## Bestätigt

- **C-1:** `Then('meldet der Dialog {string}')` (`steps/contract-detail.steps.ts:143`) fragt `Visibility.of(contractEndError(message))` über `actor.sees` ab. Das ist `expect.poll` (`screenplay/actor.ts:48`). Der Seed-Schritt läuft also erst, wenn die Ablehnung mit dem Angebot zu sehen ist. Das zweite «meldet der Dialog» filtert nach seinem eigenen Text, eine stehengebliebene erste Meldung täuscht es nicht.
- **V-3:** `load` reicht `{ statementNumber, status }` weiter (`+page.server.ts:152-155`). Die Status im Schema sind nur `draft`, `sent` und `paid` (`backend/src/db/schema.ts:387`), «überfällig» wird berechnet. `statusOf` deckt damit alle Fälle ab. `locked` wählt den Text für versendete oder bezahlte Abrechnungen, sobald eine davon nicht `draft` ist. Belegt durch die DOM-Tests «nennt die Abrechnungen mit Status …» (gemischt, mit «Klären Sie …») und «führt bei Entwürfen allein …», dazu `contract-actions.test.ts:135-137`. Der Vertrag `tests/contracts/period-statements.json` hat `status` bekommen. `api-contracts.pg.test.ts:317-319` prüft ihn mit `drift` gegen die echte API.
- **V-11:** `endDate` wird von `+page.svelte:233` übergeben. Mit Ende erscheint `contracts_delete_real_tenancy_ended`, das gilt auch für befristete und gekündigte Mietverträge, bei denen die Seite keinen Knopf «Beenden» zeigt. Belegt im DOM-Test, auch mit `not.toContain('«Beenden»')`.
- **V-12:** «Hat {name} …» in de.json. fr/it/en sind unverändert und waren schon zeitneutral.
- **Texte:** Die vier neuen Schlüssel (`contracts_delete_billed`, `_billed_drafts`, `_billed_locked`, `_real_tenancy_ended`) stehen in allen vier messages-Dateien, mit denselben Platzhaltern. `contracts_billed_paid`, `contracts_billed_sent` und `statements_status_draft` gibt es schon in allen vier.
- **Rote Tests:** Alle drei neuen bzw. geänderten DOM-Tests und der Action-Test schlagen ohne die Änderung fehl: alter Text, fehlende Schlüssel, `string[]` statt Objekten. Das geänderte Szenario in Z. 87 prüft den neuen Satzanfang.
- **Design:** Im Dialog kommt nur ein `<p>` dazu, ohne Klassen.
- **Nichts Fremdes** im Commit. `implementation_plan.md` nennt die Reviewrunden.
- Die beiden Vitest-Dateien habe ich selbst erneut ausgeführt: `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts src/__tests__/contract-actions.test.ts`, 67 bestanden.

## Nicht bestätigt

- Lint, check, backend type-check, die pg-Tests contract-end und contract-delete, die Vitest-Dateien contract-edit.dom, i18n, backend-codes und open-work, E2E contract-detail.feature und contract-edit.feature (43), die axe- und Sprachzeilen von contract-detail und contract-detail-notice (20) und den fallow-Audit hat der Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt.
- `api-contracts.pg.test.ts` mit dem neuen Feld `status` in `period-statements.json`: Der Aufrufer meldet diesen Test nicht als gelaufen. Dass `GET /statements?periodStart…` `status` liefert, habe ich nur aus dem Schema abgeleitet. Ausgeführt habe ich den Test nicht (er braucht PostgreSQL und das Backend).
- Ob die Liste der Abrechnungen einer Periode im BFF (`statements` in `load`) alle Status liefert, also auch versendete und bezahlte, habe ich im Backend-Filter nicht nachgelesen. Die Frage ist aus V-3 der Fachreview übernommen.
