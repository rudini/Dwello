# Code-Review W10, Runde 3 (abschliessende Runde vor dem Push), #156/#155

Worktree: `review-w10-code3`, detached auf `c2848ef`. Geprüftes Delta: `git diff 552536c c2848ef` (die Vorgängerrunden decken den App-Code bis `552536c` ab).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

## Geprüft

- `messages/en.json:629`, `:631` (`contracts_parties_fixed_by_law`, `contracts_end_death`): nur die Wortstellung «enter, under «Address» on the tenant, …» ist geändert; damit ist Runde-2-Nit C-3 erledigt. Die genannten Labels stimmen mit der UI überein: «Address» ist `m.buildings_address()` (`src/routes/tenants/TenantFormFields.svelte:92`, `TenantContactCard.svelte:50`), «Email» ist `tenants_email`. Der Inhalt deckt sich mit `de.json:629/631`. Alle vier `messages/*.json` sind gültiges JSON. Kein Test prüft den englischen Wortlaut (grep in `src`, `tests`), also bricht kein Test an der Änderung.
- Merge `c2848ef` (Eltern `ee65a3a`, `8486d9e` = origin/main): `git diff 8486d9e c2848ef` enthält nur die Dateien dieses Slices. `git diff ee65a3a c2848ef` enthält nur Änderungen von main (Session O-34, `offene-punkte.md`, `o34-review-1.md`, `workflow-notes-o34.md`, `tests/e2e/tasks/accessibility.ts`). `accessibility.ts` stimmt also mit main überein. In `docs/archive/implementation-plan-verlauf.md` stehen beide Sessions, und es sind keine Konfliktmarker übrig.
- `implementation_plan.md`: Die Session ist entfernt, Kopf und Einleitung sind unverändert. Im Archiv sind alle Punkte abgehakt, dazu kommt der Punkt «Workflow note: …» (passt zu CLAUDE.md, Workflow 8).
- `docs/reviews/workflow-notes-issue-156.md`: Das ist reine Dokumentation und betrifft kein Verhalten. Der Text stimmt mit den geschilderten Abläufen überein (Hinweis in `OpenContracts.svelte`, Schlüsselnamen aus #152).
- Ebenfalls im Delta, ohne Befund: neue Review- und Persona-Berichte (`w10-review-2.md`, `w10-fachreview-3.md`, `weber-f23-2.md`). Es gibt keine Änderung ohne Bezug zur Anforderung.

## Nicht bestätigt

- Lint, `check`, Backend-Type-Check, vitest (open-work, commit-msg-gate, contract-*, design-guard, 533 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt. Ich halte sie für unbedenklich, weil sich am Code nur ein Text in `en.json` geändert hat.
- E2E (Vertrags-Features, axe- und Sprachzeilen, 110 passed): vom Aufrufer gemeldet, und zwar auf `552536c`, nicht auf `c2848ef`. Die Zeilen mit englischem Text liefen also auf dem alten Wortlaut. Nach dem Merge ist `tests/e2e/tasks/accessibility.ts` neu von main, und dazu lief kein E2E auf dem gemergten Stand. Ein Risiko sehe ich kaum: Die Änderung betrifft nur die Upload-Zustände und wurde auf main geprüft. CI deckt den Rest ab.
