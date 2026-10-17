# Code-Review Slice 66b (#66, #388), Runde 1

Geprüft: `git diff aa882117 7d8d2796` im Worktree `review-66b-code` (detached auf 7d8d2796). Alle 19 geänderten Dateien gelesen. Dazu die Abschnitte «Decided (product owner)» von #66 und #388 (`gh api`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/lib/statement-wizard.ts:239`, `implementation_plan.md:11` | Der Marker `TODO(fachlich prüfen, #388)` steht noch in `akontoHint`, obwohl #388 jetzt umgesetzt ist. Ein PR mit «Fixes #388» scheitert in CI an `tools/open-work/check-issues.mjs:32`. Der Plan meldet den Marker als entfernt. |
| C-2 | Minor | `src/__tests__/contract-edit.dom.test.ts:162-165` | `afterEnd` ist jetzt der ganze lange Satz. Damit prüfen die Zeilen «unbefristet» und «gekündigt» mit `not.toContain(afterEnd)` weniger streng. Ein Hinweis, der nur «erst nach dem Vertragsende möglich» enthält, käme bei ihnen jetzt durch. Für die positive Prüfung den langen Satz behalten und für die negative den alten kurzen Teil nehmen. |
| C-3 | Nit | `src/__tests__/contracts-i18n.test.ts:70`, `src/__tests__/contract-edit.dom.test.ts:162` | Die eigenen Zeilen sind nicht nach Prettier formatiert (`bunx prettier <file> \| diff`: Umbruch vor dem String bzw. vor dem Regex). |
| C-4 | Nit | `tests/e2e/features/contract-new.feature:172-174` | Der Kommentar sagt «der Hinweis hält nicht auf», aber das Szenario prüft das nicht. Der Titel «erklärt das Formular» beschreibt die UI und nicht, was der Liegenschaftsverwalter will. Vorschlag: «Ohne Akonto erfährt der Liegenschaftsverwalter, was für die Nebenkosten gilt». |
| C-5 | Nit | `messages/en.json:665` | Das Label steht in “Agreed utility costs”. Die Texte daneben in en.json (`contracts_agreed_costs_help`, `contracts_parties_fixed_open`) setzen Labels und Zitate in «…». |
| C-6 | Nit | `messages/it.json:665` | «tolga tutte le spunte» weicht von den Texten daneben zum selben Bedienelement ab: «Tolga la selezione» und «Se non seleziona alcuna categoria» (`it.json:759-760`). |

Ponytail-Review: Der Diff besteht aus Texten, einem Kommentar, Tests und Steps. Die drei neuen Then-Steps lesen dieselbe Question, je mit einem eigenen fachlichen Satz. Das ist so gewollt. Nichts zu kürzen ausser C-1 (der veraltete Marker). Kürzbar: −1 Zeile.

## C-1 (Major): der Marker zu #388 in `akontoHint` ist noch da

**Warum falsch.** #388 «Done means»: «The related `TODO(fachlich prüfen, #n)` markers point to that issue or are removed». Laut #388, «Where», gehört `src/lib/statement-wizard.ts` (`akontoHint`) dazu. Der Diff entfernt nur den Marker in `ContractForm.svelte`. In `statement-wizard.ts:239` steht weiter:

```
// TODO(fachlich prüfen, #388): the befristet text does not name the official form a raise still needs
```

Das stimmt nach dieser Änderung inhaltlich nicht mehr, denn `statements_akonto_raise_fixed_term` nennt das Formular jetzt. Der Plan meldet den Punkt trotzdem als erledigt («`TODO(fachlich prüfen, #388)` removed», `implementation_plan.md:11`).

**Nachweis.** `grep -rn "TODO(fachlich prüfen, #388)" src` findet `src/lib/statement-wizard.ts:239`. Der PR soll laut Aufrufer «Fixes #388» sagen. Dann meldet `tools/open-work/check-issues.mjs:32` in CI: «This pull request closes #388, but markers still name it». Der Merge ist so blockiert.

**Behebung.** Den Kommentar entfernen oder auf die Regel umschreiben, z. B. «#388: the befristet text names the official form too». Der Plan stimmt danach wieder.

## Bestätigt

- `contracts_no_advance_text` (de) entspricht wörtlich dem beschlossenen Text in #66. fr/it/en geben ihn vollständig wieder. Ins Französische ist er mit geschützten Leerzeichen in « … » und vor « : » übersetzt (geprüft mit `od -c`), mit «décompte» (V-5). en sagt «provides for no utility costs» (V-6).
- Den Satz aus #388 haben alle vier Sprachen an `statements_akonto_raise_fixed_term` und `contracts_running_text_fixed_term` angehängt, wörtlich wie in #388 (fr/it/en wie Option A). `statements_finding_new_fixed_term` bleibt unverändert, wie #388 es beschreibt.
- «unten bei «Vereinbarte Nebenkosten»» stimmt: In `RentStep.svelte:72-119` steht `AgreedCategories` unter dem Hinweis. Das Label `contracts_agreed_costs_label` passt in allen vier Sprachen zum Text.
- Glossar `UBIQUITOUS_LANGUAGE.md:51`: Die Zeile «Nebenkostenpauschale» übernimmt M-1 (vereinbart, Mischfall) und M-3 («abstellen»). Die Zeile in `i18n-begriffe.md:66` hat ❓ für fr/it (V-7, #342).
- Tests: Ohne die neuen Texte schlagen alle neuen oder geänderten Prüfungen fehl, nämlich die Unit-Tests `contract-wizard.test.ts:72-78`, `contracts-i18n.test.ts:70`, `statement-wizard.test.ts:399-401`, der DOM-Test `contract-edit.dom.test.ts:162` (befristet, positiv) und die E2E-Steps `contract-form.steps.ts:477-505`. Der Grund: Alle prüfen Sätze, die es in den alten Texten nicht gab. Die drei Szenarien haben kein `@wip`.
- E2E-Schichten: Die Steps rufen nur Questions auf (`noAdvanceNoticeText`, `runningContractEditHintText`). Die Question ist `Text.of(target)`, der Target nutzt `getByTestId('advance-payment-notice')`. Die Questions geben den Text selbst zurück.
- Kein neuer Bildschirm und kein neuer UI-Zustand, nur geänderte Texte in bestehenden Hinweisen. Darum gibt es keine Pflicht für `screens.json` und die Features zu a11y und Sprachen.
- Im Diff steht nichts, was nicht zur Anforderung gehört. Einzige Code-Änderung ist ein Kommentar in `ContractForm.svelte:232-233`. Tokens, Komponenten, Sicherheit und Contracts sind nicht betroffen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, vitest (661 Tests: statement-wizard, statement-wizard.dom, contract-wizard, contract-wizard.dom, contracts-i18n, contract-edit.dom, i18n, open-work, contract-rent-labels, design-guard), Backend `statement-pdf-render.test.ts`, E2E chromium (contract-new, contract-edit, statement-generate: 122) und die axe- und Sprachzeilen (136): vom Aufrufer gemeldet, nicht neu ausgeführt.
- Dass die Szenarien rot waren, bevor sich die Texte änderten: vom Aufrufer gemeldet. Ich habe es nur am Code nachvollzogen (siehe «Bestätigt»).
- Ob axe den Zustand «Mietvertrag ohne Akonto» im Wizard und den Hinweis zum befristeten laufenden Mietvertrag mit dem längeren Text abdeckt: In `tests/a11y/screens.json` habe ich keinen eigenen Zustand für einen der beiden gefunden (gesucht nach «advance», «Akonto», «contract-edit»). Ob `every-wizard-step` das Akonto leer lässt, habe ich nicht nachgesehen. Das Problem bestand schon vorher und die Änderung führt es nicht ein.
- Die Rechtsaussagen im Glossar und in den Hinweisen (Art. 257a OR, Art. 4 VMWG, Art. 269d OR) habe ich nicht selbst geprüft. Grundlage ist das Fach-Review `docs/reviews/66b-fachreview-1.md`. M-2 und M-4 sind laut Aufrufer in #410 vermerkt, #410 habe ich nicht geöffnet.
