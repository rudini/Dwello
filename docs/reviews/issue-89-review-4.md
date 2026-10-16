# Code-Review #124, #89, #60 (Verwaltungspauschale), Abschluss Runde 4 (Re-Review C-11)

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-89-close3` (detached c04d7de). Geprüft habe ich `git diff 60727ad c04d7de` (ein Commit, c04d7de, 12 Dateien) gegen den Vorbericht `docs/reviews/issue-89-review-3.md`. Alle geänderten Dateien habe ich gelesen. Dazu kamen `PresetNotice.svelte` (ganz), `+page.server.ts:25-85`, `contract-detail.steps.ts:205-220` (Seed-Step `seed.managementFee`), `tests/e2e/fixtures/backend.ts:150-160`, `contract.service.ts:280-290`, `messages/de.json:1443-1446` und `tests/e2e/targets/accessibility.ts:36`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | erledigt | `tests/e2e/features/statement-generate.feature:207-214` | Das neue Szenario schaltet die Vereinbarung bei Eva Frei vor dem Anlegen ihrer Abrechnung ab. Damit gibt es eine Abrechnung der Periode (`other`), aber keine zum Satz des Laufs (`runRate` fehlt). Der Hinweis-Schritt prüft den Text `statements_preset_profile_from_statements`. Auf 7d81829 hätte `fromStatements` false geliefert, also `statements_preset_from_settings`. Der Schritt wäre dort rot, wie der Aufrufer meldet. |
| C-13 | erledigt | `backend/src/__tests__/management-fee.pg.test.ts:181-193` | Der POST sendet jetzt `managementFeePercent: '4'` ohne `managementFeeAgreed` und erwartet `null`. Mit `agreed !== false` in `feeRate` (`contract.service.ts:285-286`) ergäbe `undefined !== false` den Wert true, der Satz 4 bliebe und der Test wäre rot. |
| C-7 | erledigt | `management-fee.pg.test.ts:220` | Mit `cat -A` geprüft: Die Zeile beginnt jetzt mit einem Tab. |
| C-14 | erledigt | `contract.service.ts:288-291` | Die Leerzeile zwischen JSDoc und `createContract` ist entfernt. |
| C-15 | erledigt | `+page.server.ts:42` | Der Kommentar stimmt jetzt: Das Heizprofil kommt aus irgendeiner Abrechnung der Periode, wie vor #89. |
| C-16 | erledigt | `PresetNotice.svelte:16`, `StatementWizard.svelte:43`, `+page.svelte:24` | `feeFromSettings` ist in allen drei Typen Pflicht. `load` setzt es immer. |
| C-12 | Minor (bleibt) | `tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts` | Wie berichtet. Das neue Szenario zeigt den dritten Hinweis nur auf Deutsch. Für fr/it/en stützt er sich weiterhin nur auf die i18n-Tests der JSON-Dateien. |
| C-17 | Nit | `tests/e2e/targets/statement-generate.ts:62-63` | `wizardPresetNotice` zeigt auf dieselbe `data-testid` wie `wizardPreset` in `tests/e2e/targets/accessibility.ts:36`. Ein Target mehr ist harmlos, aber die beiden könnten eines sein. |
| C-18 | Nit | `tests/e2e/questions/statement-generate.ts:7`, `steps/statement-generate.steps.ts:9` | Die neuen Importe stehen mitten in der sonst alphabetischen Liste. Die Reihenfolge ist rein kosmetisch, und lint ist grün. |

ponytail-review: Der Delta ist knapp. Ein Step, eine Question und ein Target decken den neuen Fall ab. Einzige Kürzung wäre C-17 (−2 Zeilen, wenn das Target aus `accessibility.ts` wiederverwendet würde, was aber über Feature-Grenzen hinweg koppelt). `net: -2 lines possible.`

## Bestätigt durch Code und Test

- **C-11, Fachlogik:** `seed.managementFee(tenant, false)` (`contract-detail.steps.ts:210-212`) läuft vor dem Seed der Abrechnung. Die Abrechnung speichert also den Satz eines nicht vereinbarten Mietvertrags. In `chosen()` (`+page.server.ts:43-48`) findet `runRate` deshalb keine Abrechnung, `other` ist aber gesetzt. Damit gilt `fromStatements: true` und `feeFromSettings: true`, und `PresetNotice.svelte:32-36` zeigt `statements_preset_profile_from_statements`. Der erwartete Text im Szenario ist der erste Satz dieses Schlüssels in `messages/de.json:1446`, wortgleich.
- **C-11, Screenplay:** Der Step ruft nur die Question `presetNoticeText` (`Text.of(wizardPresetNotice)`) auf, nicht die Seite. Die Question gibt den Text selbst zurück, also zeigt ein Fehler, was der Assistent sagt. `toContain` statt `toBe` ist vertretbar, weil das Alert auch den Titel und den Satz «Prüfen Sie beides …» enthält. Dasselbe Muster gibt es in `apartment-detail.steps.ts:52`. Der Szenario-Text sagt, was der Liegenschaftsverwalter sieht, nicht wie er klickt. Der Satz «sagt der Assistent {string}» ist eindeutig (`grep` in `tests/e2e/steps`: ein Treffer). Kein `@wip`.
- **Hinweis des Aufrufers zum Profil-Schritt:** Er stimmt. «Winter» ist das einzige Profil des Szenarios, und der Assistent wählt es sowieso vor. Den Rückschritt fängt der Hinweis-Schritt ab. Das reicht, weil `defaultHeatingProfileId` und `fromStatements` beide an `pick.other` hängen (`+page.server.ts:73-80`). Ein Rückschritt beim Profil ändert also auch den Hinweis.
- **Plan:** `docs/archive/implementation-plan-verlauf.md` hat die Runde 3 abgehakt und einen offenen Punkt «Closing re-review of the C-11 fix, PR». Die Angaben zu C-7 stimmen jetzt.
- **Nichts Fremdes im Diff:** Der Commit enthält nur die Review-Fixes, den Bericht `issue-89-review-3.md` und den Plan.

## Nicht bestätigt

- **Checks des Aufrufers:** Alle sind nur «vom Aufrufer gemeldet»: `bun run check`, `bun run lint`, die DOM- und Unit-Tests statement-generate-actions und statement-wizard (60), `cd backend && bun run type-check`, management-fee pg (12) und E2E statement-generate, statement-management-fee, contract-new (63, chromium + api). Selbst ausgeführt habe ich keinen, weil der Delta nur Tests, Typen, einen Kommentar und eine Leerzeile ändert und ich keinen der Läufe anzweifle.
- **Rotphasen:** Das Rot des Hinweis-Schritts auf 7d81829 und das Rot von C-13 mit `agreed !== false` habe ich aus dem Code abgeleitet, nicht durch einen Lauf.
