# Code-Review: Umbenennung Bruttomiete -> Monatlich total (#62, Option B)

Worktree: `review-rename-code` (detached, ae722ad), Diff `git diff 5f427ee ae722ad` (1 Commit, 12 Dateien, +27/-27).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/questions/apartment-detail.ts:19, tests/e2e/steps/apartment-detail.steps.ts:11,50-51, tests/e2e/targets/apartment-detail.ts:9, tests/e2e/features/apartment-detail.feature:19 | Dieselbe Summe heisst in den E2E-Tests weiter «brutto»: Question `grossMonthlyRent`, Target-Beschreibung «Monatliche Kosten brutto», Schritt «kostet die Wohnung monatlich {string} brutto». «Brutto» steht nicht mehr im Glossar. Die Issue nennt nur die vier Namen, deshalb nicht blockierend. Vorschlag: Question/Target umbenennen (verhaltensfrei); den Szenariotext ändern oder ein Issue dafür eröffnen. |
| C-2 | Nit | src/__tests__/apartment.test.ts:180 | Durch das längere `monthlyTotal(` ist die Zeile nicht mehr Prettier-sauber (`bunx prettier … \| diff` bricht sie um). Die eigene Zeile formatieren. |

ponytail-review: Schon schlank, so ausliefern. net: -0 lines possible.

## Blocker/Major

Keine.

## Geprüft und bestätigt

- Anforderung: `grossRent` -> `monthlyTotal` (Funktion, contract-history.ts:10), `rentBrutto` -> `monthlyTotal` (ContractHistory, types.ts:100; contract-history.ts:21), `totalBrutto` -> `monthlyTotal` (MonthlyCosts, types.ts:113; apartment.ts:68), Testname «Bruttomiete» -> «Monatlich total» (apartment.test.ts:177). Alle Aufrufer umbenannt (apartment.ts, tenants/[id]/+page.server.ts, ContractHistory.svelte, MonthlyCostsCard.svelte, TenantContracts.svelte, vier Testdateien). Grep über `src`, `tests`, `backend/src` findet keinen Rest von `grossRent|rentBrutto|totalBrutto|Bruttomiete` (nur die E2E-Reste aus C-1).
- Verhaltensfrei: Die Rechnung (`baseRent + additionalRent + monthlyAdvancePayment`) ist unverändert. Keine Backend-API-Felder betroffen, daher bleibt `tests/contracts` unverändert (richtig so). Keine UI-Texte, keine `messages/*.json`, keine neuen Bildschirme oder Zustände, also keine a11y-/Sprachen-Pflichten.
- Kommentar in contract-history.ts:9: «additional costs» -> «additional rent» entspricht dem Glossar (Zusatzmiete).
- Kein Szenario nötig («No scenario: internal names only»): bei einer reinen Umbenennung schlüssig. Rote Tests sind bei einer verhaltensfreien Umbenennung nicht gefordert, die bestehenden Tests decken die Summe ab (apartment.test.ts:177-182, Detail- und Verlaufswerte).
- Nichts Fachfremdes im Diff; implementation_plan.md: nur der Plan-Haken für #62.
- Commit-Betreff `chore(contracts): rename grossRent to monthlyTotal`: 50 Zeichen, gültiger Scope.

## Nicht bestätigt

- `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht neu ausgeführt.
- `bunx vitest run` von `buildings-pages.dom.test.ts`: vom Aufrufer gemeldet. Neu ausgeführt und grün (84/84): `apartment.test.ts`, `tenant-detail.test.ts`, `apartments-pages.dom.test.ts`, `tenant-detail-page.dom.test.ts`.
- E2E (apartment-detail.feature, Mieterdetail) nicht ausgeführt (für Reviewer verboten). Die geänderten Svelte-Dateien lesen nur das umbenannte Feld, `data-testid` ist unverändert.
- Der Glossar-Eintrag (UBIQUITOUS_LANGUAGE.md:51) ist laut Aufrufer Sache des Product Owners und liegt nicht im Diff. Ich habe nur gelesen, dass er «Monatlich total» ohne Vergleich mit der Bruttomiete definiert.
