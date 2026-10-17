# Code-Review #66, Runde 3 (Abschluss vor dem Push): cb6ce6e2..31b03463 und Merge 5156efe2

Worktree: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/review-66-code3` (detached 5156efe2). Gelesen: alle 8 Dateien aus `git diff cb6ce6e2 31b03463`, dazu der Merge mit `git show 5156efe2 --stat`, `git diff 31b03463 5156efe2 -- <Dateien von #66>` und `git diff 83994214 5156efe2` (Merge-Ergebnis gegen main).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | `docs/reviews/66-fachreview-3.md` («Nicht bestätigt», 2. Punkt) | Der Bericht sagt, «Abgerechnet bis» (#133) sei «noch nicht umgesetzt». Es ist schon umgesetzt: `backend/src/db/schema.ts:127` (`billed_until`), `src/lib/contract-status.ts` (`billingStart`, `billsIn`), `calculation.service.ts:443`. Satz 1 stimmt damit trotzdem: Dwello rechnet ab dem Tag nach «Abgerechnet bis», also auch dann nur für die «Zeit, die noch nicht abgerechnet ist». Am Code ist nichts zu tun. Der Bericht bleibt, wie er ist. |

Keine Blocker, keine Majors.

## Delta cb6ce6e2..31b03463

- **C-2 aus Runde 2 (Plan) ist behoben.** Die Session liegt jetzt im Archiv (`docs/archive/implementation-plan-verlauf.md`, Session W15). Jede Review-Runde hat einen eigenen Punkt mit ihrem Bericht (Code 1/2, Fach 1/2/3, Personas Runde 1/2). Der P-1-Fix steht drin, ebenso der Workflow-Hinweis. `implementation_plan.md` enthält keine Session mehr. Der Punkt «Hint for a contract without Akonto» ist abgehakt, sagt aber offen «not built … question to the product owner in #66». Das passt zu `Refs #66`.
- **C-3 aus Runde 2 (Testname) ist behoben.** `src/__tests__/contract-edit.dom.test.ts:154` heisst jetzt «weist auf einen laufenden Mietvertrag hin» und passt damit zu der Assertion, die nur «Laufender Mietvertrag» prüft.
- Berichte `docs/reviews/66-review-2.md`, `66-fachreview-3.md`, `docs/design/personas/{weber,helga}-66.md` (Runde 2) und `workflow-notes-issue-66.md` liegen dort, wo die Skill `slice-review` sie verlangt.
- Ponytail: Das Delta besteht aus Doku und einer Umbenennung. Es bringt keinen Code und nichts, was nicht zur Aufgabe gehört. Schlank, ausliefern.

## Merge 5156efe2

- Gegen main (`git diff 83994214 5156efe2 --stat`) bleiben genau die 23 Dateien von #66. Der Merge hat nichts von main verloren und nichts Fremdes hinzugefügt.
- In `messages/*.json` hat main nur `ui_draft_discard*` und `statements_*` geändert. Die Schlüssel von #66 (`contracts_running_text`, `contracts_running_text_fixed_term`, `contracts_advance_help`) sind in allen vier Sprachen unverändert (de/fr/it/en Z. 685, 686, 744).
- `contract-wizard.dom.test.ts`: main fügt die Bestätigung beim Verwerfen hinzu (`draft-discard-confirm`, #201). Das betrifft einen anderen Test. Die Assertion von #66 zur Akonto-Hilfe (Z. 153) bleibt.
- `tests/e2e/tasks/contract-form.ts` (`discardDraft` mit Bestätigung) und `src/lib/contract-status.ts` (`billingStart` herausgelöst) kommen von main. Sie berühren die Steps und Texte von #66 nicht.
- Konflikt im Archiv: Beide Sessions (#204 von main, W15 von #66) sind vollständig drin, ohne Konfliktmarker.
- Neu ausgeführt: `bunx vitest run src/__tests__/contract-edit.dom.test.ts src/__tests__/contract-wizard.dom.test.ts` auf 5156efe2, 82 bestanden.

## C-1 aus Runde 2 (Major): Antwort angenommen

Ich nehme die Antwort aus `66-fachreview-3.md` an:
- **Satz 3 betrifft nur die Nettomiete.** «Mietzinserhöhung» meint laut Glossar die Nettomiete (`UBIQUITOUS_LANGUAGE.md:48`, «Auch: Mietzins»). Die Nettomiete kommt in keiner Abrechnung vor: `baseRent`/`base_rent` lesen in `backend/src/services` nur `tenant.service.ts`, `apartment.service.ts` und `contract.service.ts`, nicht aber `calculation.service.ts` oder `statement.service.ts` (grep). Für die Nettomiete ist der Rat richtig und schadet nicht.
- **Der Akonto-Fehler bestand schon vorher.** Das Akonto wird rückwirkend mit einem einzigen Betrag gerechnet (`calculation.service.ts:408-413`). Das war schon auf dem Basis-Commit so. Der alte Text («gelten sofort», «Kündigungsfristen beachten») hat genauso dazu geführt, das Akonto am Stichtag einzutragen, hat die Rückwirkung aber verschwiegen. Der neue Satz 1 legt sie offen. Der Fehler wird also nicht widersprüchlicher. Er wird nur ehrlich sichtbar.
- **Bis #90 gibt es keinen richtigen Zeitpunkt, das Akonto einzutragen.** Darum würde ein eigener Akonto-Satz den Fehler nur verkleinern, nicht beheben.
- **#90 hält beide Fälle fest.** Geprüft mit `gh api repos/rudini/Dwello/issues/90/comments`: V-1 bzw. C-1 (Rückwirkung) und V-6 (berichtigte Abrechnung).

Damit fällt C-1 unter «existed before» aus `CLAUDE.md`, «Done means». Was bleibt, steht als Minor in den Berichten: V-6 und Weber P-8 (ob «Mietzinserhöhung» auch das Akonto meint).

## Nicht bestätigt

- **Weber P-7 (Major, Persona Runde 2)**, `docs/design/personas/weber-66.md:77`. Er hat dieselbe Ursache wie C-1 aus Runde 2, also gilt dieselbe Begründung. Im Repo steht aber keine Triage dazu. Laut `slice-review`, «Triage» 3, gehört sie unter «Found» in den Abschlussbericht des Aufrufers, und den sehe ich nicht. Der Aufrufer sollte P-7 dort mit dieser Begründung als «existed before» bzw. #90 führen.
- **Checks, die der Aufrufer gemeldet hat** (vom Aufrufer gemeldet, nicht wiederholt): `bun run lint`, `bun run check`, Backend type-check, vitest auf contracts-i18n, i18n, open-work, design-guard und ui-i18n.dom, E2E `contract-new.feature` und `contract-edit.feature` sowie die axe- und Sprachzeilen. Selbst ausgeführt habe ich nur contract-edit.dom und contract-wizard.dom (siehe oben).
- **Fach- und i18n-Minors und -Nits** aus Runde 3 (V-6, V-7, V-8) und die Persona-Minors (Helga P-1 Rest, P-6; Weber P-8, P-9): nicht umgesetzt. Nach «Done means» dürfen sie in ihren Berichten bleiben. Eine Textänderung bräuchte eine vierte Fach-Runde, deshalb sind sie nicht trivial.
