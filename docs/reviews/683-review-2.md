# Code-Review #683, Runde 2 (cad2db96d..ff13fe1bb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/config/categories/CategoryReason.svelte:55-61 | Nur noch der zweite Teil ist offen. Die Bezeichnung «Begründung» (`category-reason-label`) ist weiterhin nur durch das E2E-Szenario abgedeckt. `categories-page.dom.test.ts` prüft sie nicht. Die Prop `describedby` ist jetzt durch einen DOM-Test abgedeckt. |

Keine Blocker oder Major.

Geprüft: Der einzige geänderte Code ist der neue Test in `src/__tests__/ui-choices.dom.test.ts:133-146`. Er prüft das `aria-describedby` des `fieldset` exakt als «duration-help reason». Damit zeigt er die Reihenfolge Hilfe vor weiterem Text, wie sie `describedBy` in `RadioGroup.svelte:37-41` bildet. Ohne `describedby` in dieser Liste schlägt er fehl. Der deutsche Titel sagt, was der Test prüft. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run src/__tests__/ui-choices.dom.test.ts` (11 bestanden), der rote Lauf ohne `describedby` und Prettier auf den neuen Zeilen: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Den Fall Fehler plus Hilfe plus `describedby` (Reihenfolge `duration-error duration-help reason`) prüft kein Test. Gelesen habe ich ihn nur im Code (`RadioGroup.svelte:37-41`). Er ist korrekt.
