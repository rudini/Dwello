# Review #654, Runde 2 (d01c439b..944a9c5a, Abschlussrunde vor dem Push)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, Prettier auf DeleteContract.svelte und der rote Lauf des neuen Tests vor der Korrektur. Den roten Lauf habe ich nur durch Lesen beurteilt. Mit d01c439b wird `mistakeError` beim Abhaken nicht geleert. `corrected` behält danach den Text, und ohne `submit` bleibt `shown` `undefined`. Dann gibt es kein `form-error`, und der Test schlägt fehl.
- Selbst ausgeführt auf 944a9c5a: `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts src/__tests__/ui-choices.dom.test.ts` mit 78 bestandenen Tests.

Geprüft: alle vier geänderten Dateien des Deltas. Die Korrektur in DeleteContract.svelte:104-111 geht so: Abhaken leert `mistakeError`, der `$effect` in `sent-error.svelte.ts` setzt `corrected` zurück, und die nächste Prüfung zeigt den Fehler wieder. Das Muster ist dasselbe wie in PastEndConfirm. Die beiden Kommentare (C-2, C-3) stimmen jetzt. Die übrigen Dateien des Bereichs sind Review- und Persona-Berichte und der Plan.
