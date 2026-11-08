# Code-Review #1148, Runde 2 (Abschluss, Delta 40ec9bb..5598073; Stand 763ddfc)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-2 | Minor | src/routes/contracts/ContractForm.svelte:226-232 | Weiter offen (Minor aus Runde 1, bleibt im Bericht): Toast `contracts_agreement_withdrawn_toast` ungetestet. |
| C-3 | Minor | src/routes/contracts/[id]/NextSteps.svelte:27-30 | Weiter offen (Minor aus Runde 1): `contracts_next_steps_text_agreement_successor` ungetestet. |
| C-4 | Minor | src/routes/contracts/[id]/+page.svelte:284-298 | Weiter offen (Minor aus Runde 1): Fehlen von `contracts_end_notice_hint` bei Aufhebungsvereinbarung ungetestet. |
| C-5 | Minor | backend/src/services/contract.service.ts:543-548 | Weiter offen (Minor aus Runde 1): `byAgreement: true` ohne Kündigung bzw. `noticeReceivedOn` bei Aufhebungsvereinbarung verletzt den CHECK statt einer codierten Ablehnung. |

Geschlossen: C-1, C-6, C-7

Keine neuen Befunde, keine Blocker, keine Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, Backend `type-check` und `bunx vitest run` (4556 bestanden) auf dem Merge-Ergebnis. Ebenfalls gemeldet: Der neue Test in `contract-form.test.ts` war rot, als die Zeile in `contract-form.ts` entfernt war. Laut Lesen schlägt er ohne die Zeile fehl, weil `byAgreement` dann fehlt. Er schlägt auch fehl, wenn das Flag nur bei `true` gesendet wird, weil die erste Erwartung `byAgreement: false` verlangt. Ausgeführt habe ich ihn nicht.
- E2E auf dem letzten Stand («150 on the final commit», laut Archiv): vom Aufrufer gemeldet, nicht nachgeprüft.
- Den Merge von `origin/main` (7c7364d) und die Persona-Berichte habe ich wie verlangt nicht geprüft.

Geprüft: C-1-Test gegen `contractBody` (`src/lib/contract-form.ts:172`). C-6: Doku von PUT und `CONTRACT_OVERLAP` gegen `contract.service.ts:262, :546, :548` und `routes/contracts.ts:83`. C-7: Regel 1 und 2 gegen den Absatz «Umgesetzt». Archiv `docs/archive/sessions/1148.md`: Es nennt die Session richtig (Reviews, C-1/C-6/C-7 behoben in 5598073, C-2 bis C-5 bleiben, #1277/#1278, Merge, Push nach dem Archiv).
