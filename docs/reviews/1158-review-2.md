# Code-Review #1158, Runde 2 (Abschluss, a9a51fe..6efc4e3, Merge a41102f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1

Geprüft: Zu C-1 prüft ui-layout-parts.dom.test.ts:332 jetzt `document.activeElement` gegen `document.querySelector('h1')`. Fehlt der Fallback `h1[tabindex="-1"]` (ToastRegion.svelte:78), landet der Fokus auf `body`, und der Test wird eindeutig rot. ToastRegion rendert kein eigenes `h1`, also trifft der Selektor nur das eingefügte Element. Der Delta enthält sonst keinen Code. Der Merge a41102f fügt nur die zwei Dateien unter docs/reviews hinzu und hat keinen Konflikt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, auf 6efc4e3: `bunx vitest run src/__tests__/ui-layout-parts.dom.test.ts` (29 bestanden).
- Vom Aufrufer gemeldet, auf a9a51fe: lint, check, fitness, backend type-check, `vitest --changed` (731 bestanden), E2E Chromium contract-new und contract-edit (130 bestanden), axe- und Sprachzeilen von contract-new (42 bestanden).
- Ob der geänderte Test ohne den Fallback tatsächlich rot wird: Ich habe ihn nicht laufen lassen. Die Aussage stützt sich auf das Lesen von ToastRegion.svelte:60-79 und auf den Testaufbau (Zeilen 326-333).
- Die offenen Punkte aus Runde 1 gelten weiter, ausser C-1: `Spec change approved: #1158` im noch fehlenden Pull Request, und der Ausdruck in contracts-retry.steps.ts:101.
