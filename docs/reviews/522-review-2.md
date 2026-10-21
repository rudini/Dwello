# Review #522, Runde 2 (Schlussrunde, 68ab4a0..fb99d3f)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|---|---|---|
| C-1 | Minor | Bleibt offen und steht weiter im Bericht von Runde 1, wie der Aufrufer angibt. Das Delta berührt den Fall nicht. |
| C-2 | Minor | Behoben. Der neue Helfer `ticked(agreed, categories)` (src/lib/contract-form.ts:197-198) enthält die Regel jetzt allein. `contractBody` (:193), `agreedNames` (:200-201) und `flatRateNotice` (src/lib/contract-wizard.ts:114) rufen ihn auf. `isAgreed`/`noneTicked` in AgreedCategories.svelte:22-24 sind Prüfungen pro Kästchen und waren nicht Teil des Befunds. |

## Neue Befunde im Delta

Keine.

Geprüft: Das Delta ändert das Verhalten nicht. Der Filter ist derselbe (`agreed?.includes(id) ?? true` über die angezeigten Kategorien), und die Reihenfolge der IDs im Body bleibt die der angezeigten Liste. `ticked` wird zwar nach `contractBody` deklariert, aber erst beim Aufruf gelesen, deshalb gibt es kein TDZ-Problem. Die lokale Variable `ticked` in `flatRateNotice` heisst jetzt `count`, damit verdeckt sie den Import nicht. Die Commit-Nachricht nennt «No behaviour change», deshalb braucht es keinen roten Test. Das Delta enthält keine fremden Änderungen.

## Nicht bestätigt

- `bun run check`, `bun run lint`, `contract-wizard.dom.test.ts` und `contract-edit.dom.test.ts`: vom Aufrufer gemeldet, nicht wiederholt. Wiederholt habe ich `bunx vitest run src/__tests__/contract-form.test.ts src/__tests__/contract-wizard.test.ts`: 54 bestanden.
- Dass auf `main` nichts Neues liegt: vom Aufrufer gemeldet, nicht geprüft.
