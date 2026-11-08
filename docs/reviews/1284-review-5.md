# Code-Review 1284, Runde 5 (Abschlussrunde, `13f7c8b..69c86c5`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine neuen Befunde |

Geschlossen: C-1

Geprüft: `ApartmentForm.svelte:68-69` ruft `focusFirstError(formElement)` (bereits importiert, Z. 12) vor `cancel()`; dieser Helfer fokussiert das erste Feld mit `aria-invalid="true"`, hier `#discontinuedFrom`. Den DOM-Test (`apartment-form.dom.test.ts:160-175`) habe ich gelesen: Er wäre ohne den Aufruf rot, weil der Fokus nach dem `blur` des Felds auf `body` liegt. `settle()` wartet lange genug für den Tick und das Timeout im Helfer. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bun run lint` sauber, `bun run check` 0 Fehler, `apartment-form.dom.test.ts` 11 bestanden: vom Aufrufer gemeldet, nicht selbst ausgeführt.
