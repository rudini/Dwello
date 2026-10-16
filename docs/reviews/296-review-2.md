# Review #296, Runde 2 (Delta 90e8393..d2de64c)

Worktree: `/tmp/claude-0/-home-user-Dwello/e15917e2-7c43-5793-a424-48cbe5ea53b1/scratchpad/review-296-close`

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. C-1, C-2 und C-3 aus Runde 1 sind behoben (siehe unten). |

Keine Blocker, keine Major.

## Geprüft und bestätigt

- **C-1 behoben:** `initialContractValues` (src/lib/contract-form.ts:36-40) übernimmt `?start=` nur noch, wenn `impossible(start)` nicht gilt, sonst `''`. Alle Aufrufer profitieren: `ContractForm.svelte:46`, `ContractWizard.svelte:65,215` und `startValues` (contract-wizard.ts:162). In `startValues` fällt ein verworfener URL-Beginn über `fromUrl.startDate || values.startDate` auf den Entwurf zurück; danach schlägt `suggestedStartDate` für dieselbe Wohnung (frei ab 2100) ebenfalls nichts vor. Damit zeigt der Assistent auf keinem der beiden Wege einen Beginn, den «Weiter» ablehnt.
- **Test rot ohne Änderung:** `contract-form.test.ts:46-51` erwartet `''` für `start=2100-01-01`; der alte Code gab `'2100-01-01'` zurück, der Test wäre also rot. Die zweite Erwartung (`2026-04-01` bleibt) sichert, dass ein gültiger Beginn weiter übernommen wird. Unterste mögliche Schicht (reine Funktion).
- **C-2 behoben:** `impossibleYear` liegt jetzt neben `impossible` in `contract-form.ts:26-28`; `contract-wizard.ts` und `statement-wizard.ts` importieren beides von dort, `contracts-i18n.test.ts` ist angepasst. Keine weiteren Importe von `impossibleYear` aus `contract-wizard` (grep über `src`). `m` wird in `contract-form.ts` schon vorher importiert und in `contract-wizard.ts` weiter verwendet. Kein Zyklus: `contract-form.ts` importiert nichts aus `contract-wizard.ts`.
- **C-3 behoben:** doppelte Leerzeile in `implementation_plan.md` entfernt; der Plan nennt Runde 1 und den neuen Punkt, «Checks» bleibt offen (passt zum Stand vor dem Abschluss).
- **`docs/reviews/296-review-1.md`:** gehört zum Ablauf des Skills `slice-review` (Schritt «Copy each report … to `docs/reviews/`»), also nicht fremd im Diff.
- **Texte, i18n, Tokens, a11y, Sicherheit, API:** Delta ändert keinen Text, kein Markup, keine API und keinen Bildschirmzustand; keine Einträge in `messages/*.json`, `screens.json` oder Features nötig. `No scenario` bleibt wie im Issue begründet.
- **Formatierung:** `bunx prettier` auf `contract-form.ts`, `contract-form.test.ts`, `contracts-i18n.test.ts` ergibt keine Abweichung.
- **ponytail-review:** Nichts zu streichen. Die Änderung in `initialContractValues` ist eine Zeile plus lokale Variable; die Verschiebung von `impossibleYear` kürzt `statement-wizard.ts` um einen Import.

## Nicht bestätigt

- Selbst erneut ausgeführt im Worktree: `bunx vitest run src/__tests__/contract-form.test.ts src/__tests__/contracts-i18n.test.ts src/__tests__/contract-wizard.test.ts src/__tests__/statement-wizard.test.ts`, 69/69 grün.
- `bun run lint`, `bun run check`, volle `bunx vitest run` (158 Dateien, 2702 Tests) auf d2de64c: vom Aufrufer gemeldet.
- Backend-Type-Check (Backend im Delta unverändert) und E2E-Zeilen Axe/Sprachen der Vertragsbildschirme auf 90e8393: vom Aufrufer gemeldet, nicht ausgeführt (E2E ist mir untersagt); das Delta ändert keine E2E-Daten.
- Dass der neue Test vor dem Fix rot war: vom Aufrufer gemeldet; durch Lesen bestätigt, nicht ausgeführt.
