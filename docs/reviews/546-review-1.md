# Code-Review #546, Slice 1, Runde 1

Worktree: /tmp/scratchpad/review-546-code-reviewer (d4e5087), Bereich `98d04e0..d4e5087` ohne `docs/reviews`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement.service.ts:616, backend/src/__tests__/statement-invoices.pg.test.ts:460-472 | Die Regel für den Kostensatz (`declineCosts`) hat keinen Test, der sie zeigt. Der von V-3 verlangte Fall «Unterschied ≤ 0 ohne Kostensatz (V-1/M-1)» fehlt auf jeder Schicht. |
| C-2 | Minor | backend/src/services/statement.service.ts:615 | V-4 verlangt die Erklärung zu CHF 5, wenn eine der beiden Seiten unter CHF 5 liegt. `belowMinimum` prüft nur den neuen Saldo. Deshalb bleibt gerade der Fall aus V-4 ohne Erklärung, bei dem der bisherige Saldo 3.00 ist: «Nachzahlung von CHF 50.00 statt CHF 3.00». |
| C-3 | Minor | src/lib/server/statement.ts:167-170 | `import type { Recalculated }` steht zwischen dem JSDoc und `laterChanges`. Der Kommentar gehört damit zum Import und nicht mehr zur Funktion. Der Import gehört zu den anderen am Dateianfang (Zeilen 1-9). |

## C-1: Kostensatz ohne Test

- `recalculation()` liefert `declineCosts: after >= before && Number(difference) > 0 ? difference : null`. Das ist die Regel aus V-1/M-1, die in diesem Diff neu ist: kein Kostensatz bei einem Unterschied ≤ 0. Ein Beispiel ist 4.00 → 3.00: Beide Seiten zählen als 0, also gilt `raises`, und der Unterschied ist −1.00.
- Der pg-Test liest nur `balance`, `difference` und `belowMinimum`, nicht `declineCosts`. Die Unit-Tests setzen `declineCosts: null` fest, und `recalculatedText` liest das Feld gar nicht. Das E2E-Szenario prüft nur den positiven Fall 187.45.
- So zeigt sich der Fehler: In `statement.service.ts:616` die Bedingung `&& Number(difference) > 0` streichen, oder `difference` statt `null` liefern. Alle neuen Tests bleiben grün. Die Bestätigung zeigt dann beim bestehenden Fall 4.00 → 3.00 (`statement-invoices.pg.test.ts:520 ff.`) «Den Unterschied von CHF -1.00 tragen Sie selbst.», und bei gleichem Saldo «CHF 0.00». Genau diese Fehler sollte V-1 verhindern.
- Lösung: Im pg-Test «erlaubt «Nicht berichtigen», wenn beide Saldi unter CHF 5 liegen» `recalculated.declineCosts` auf `null` prüfen. Im neuen pg-Test `declineCosts` auf den Unterschied prüfen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run --changed origin/main` (1106 bestanden), Backend `statement-invoices.pg` und `api-contracts.pg` (143 bestanden), E2E chromium mit den Szenarien zu «berichtigen» (15 bestanden).
- Ob die Fixture des a11y-Zustands `decline-dialog` (`tests/a11y/screens.json:59`, :703) einen Unterschied > 0 hat und axe damit den neuen Absatz prüft, habe ich nicht nachgesehen. Der Absatz ist ein reines `<p>` ohne Bedienelement, deshalb gibt es keinen neuen Zustand.
- Die Rotphasen habe ich nur durch Lesen beurteilt. Ohne `recalculated` scheitert der pg-Test beim Destrukturieren. Die Unit-Tests scheitern ohne Funktionsrumpf. Das Szenario scheitert ohne die Texte.

Geprüft: Vertrag `tests/contracts/statement-changed-invoices.json`. Mapper und `statement-actions.test.ts`. Wording und Platzierung gemäss der Wording-Tabelle der Fachreview in allen vier `messages/*.json`. V-2: Der Unterschied ist der rohe Saldo neu minus bisher. V-5: der Szenariotitel. Der Satz fällt weg, wenn sich die Abrechnung nicht neu berechnen lässt (`check` null). Die Screenplay-Schichten der neuen Schritte, Task und Question halten sich an die Regeln. Fitness Ä4: Das Frontend wählt nur die Worte nach dem Vorzeichen.
