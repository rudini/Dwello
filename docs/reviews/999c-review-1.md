# Code-Review #999, Slice 999c, Runde 1

Worktree `/tmp/scratchpad/review-999c-code-reviewer` (04e1c53), Bereich `04e1c53~1..04e1c53` ohne `docs/reviews`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `tests/e2e/steps/statement-detail.steps.ts:938` | Der Kommentar sagt «the four actions of the header are all there». Der Schritt prüft aber nur zwei davon, Mahnung und «Zahlung zurücksetzen», nicht PDF und «Bezahlt». Damit verspricht der Kommentar mehr, als der Schritt prüft. Das war der Kern von 999b C-4 |

Keine Blocker oder Majors.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - auf 04e1c53: `bun run lint`, `bun run check`, api-contracts.pg (100), statement-pages.dom (230), E2E chromium `-g "Handy|Zahlung zurücksetzen|Teilzahlung|in Teilen"` (18);
  - auf db8696d: fitness, type-check, `vitest --changed` (927), Regeltests (582), Backend statement-lock/api-contracts/audit-log (144), E2E statement-detail und audit-log (133), Prettier auf den neuen Dateien.
- Rot nur durch Lesen beurteilt:
  - Der neue Schritt zu C-4 hält Verhalten fest, das schon da ist. Die Commit-Message sagt «pins kept behaviour». Auf der Basis zeigt `StatusActions.svelte:32-40` beide Knöpfe bei `overdue`, `owes`, `!waiting` und `partPaid`. Es ist kein Bugfix. Das Szenario fehlt auf `origin/main`, die neue Zeile ist darum keine Spec-Änderung.
  - Vertrag C-3: `drift` meldet einen Schlüssel aus dem Vertrag, der in der Antwort fehlt. Die behaltene Teilzahlung im Test (`api-contracts.pg.test.ts:977-985`) wurde mit `recordPayment` erfasst. Sie trägt deshalb `recordedAt` (`statement.service.ts:816`).
- Den Entscheid M-1 in #999 habe ich nicht selbst nachgelesen. Ich stütze mich auf das Zitat in `docs/reviews/999b-review-1.md`.

Geprüft: `MetadataCard.svelte` ist genau wieder auf dem Stand vor 7c9cf72 (`git diff 7c9cf72~1 04e1c53` ist leer). Die Teilzahlung einer Rückerstattung bleibt durch `statement-pages.dom.test.ts:2334` abgedeckt. Die neue Question `reminderOffers` hält die Screenplay-Schichten ein. Es gibt keine neuen Texte und keine neuen Bildschirme.
