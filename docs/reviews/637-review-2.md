# Code-Review #637, Runde 2 (Abschluss, 43f259c0..f6f78ae8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/tasks/accessibility.ts:151-152 | **Behoben.** `restoreDraft` wartet jetzt zusätzlich mit `Wait.forCount(agreementsLoading, 0)`, bis der sichtbare Satz `step-loading` verschwunden ist (targets/statement-generate.ts:145, `filter({ visible: true })`; die Klasse `invisible` blendet ihn aus, StatementWizard.svelte:284-291). Kein falsch grünes Warten vor Ladebeginn: `step` wird in `onMount` gesetzt, und BuildingStep.svelte:32 bzw. FeeNotAgreed.svelte:23 setzen `loading = true` im selben Svelte-Flush, in dem auch `draftRestored` erscheint. In den anderen Assistenten gibt es kein `step-loading`, dort ist die Wartebedingung sofort erfüllt. `draft-discard-dialog` (Zeile 582) profitiert ebenfalls. |

Keine neuen Befunde im Delta.

Geprüft: Der Delta-Diff (eine Datei, 3+/1-) enthält nur die Behebung von C-1. Es gibt keine Locator-Zugriffe ausserhalb der Targets, nichts Fremdes und keine neuen Texte oder Bildschirme. Die Commit-Nachricht hält die Konventionen ein.

## Nicht bestätigt

- lint, `bun run check` (0 Fehler), E2E `accessibility.feature -g "draft-restored" --repeat-each 4` chromium (8 grün): vom Aufrufer gemeldet, nicht erneut ausgeführt; E2E darf ich nicht starten.
- Ob das Warten den Rest-Wettlauf auf dem Desktop in CI tatsächlich schliesst, ist nur aus dem Code abgeleitet (Svelte-Flush-Reihenfolge onMount -> Effekt in BuildingStep/FeeNotAgreed) und nicht gemessen.
