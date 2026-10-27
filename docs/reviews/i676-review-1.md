# Review #676, Runde 1 (d5e78889..5d85fbb9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Abweichung beurteilt und angenommen: Statt eines Layout-Tests bei 390 px und eines Szenarios gibt es einen DOM-Test auf die Klasse plus `No scenario: <reason>` im Plan. Die Begründung stimmt: `playwright.config.ts:56` legt `APP_VERSION: 'v1.4.0'` fest, und `vite.config.ts:12` backt diesen Wert beim Build ein. Eine lange Entwicklungsversion lässt sich in E2E also nur mit einem zweiten Build oder einer Spec-Änderung erzeugen. jsdom kennt kein Layout. Für eine Klassenprüfung auf `whitespace-nowrap` gibt es einen Präzedenzfall (`src/__tests__/statement-pages.dom.test.ts:1289`). Der neue Test schlägt ohne die Änderung fehl, weil der Span auf d5e78889 keine Klasse hat. Mit `nowrap` bleiben alle vier Übersetzungen von `footer_version` und `footer_version_unknown` kurz genug, sodass bei 390 px kein seitliches Scrollen entsteht.

Geprüft: Footer.svelte (nur die Klasse kommt dazu, die Klasse ist eine Tailwind-Utility ohne Rohwert), shell.dom.test.ts (Testtitel deutsch, prüft, was er sagt), Commit-Subject, keine fremden Änderungen, keine neuen Texte oder Zustände (screens.json und messages nicht betroffen).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/shell.dom.test.ts src/__tests__/design-guard.test.ts src/__tests__/tokens.test.ts` und Prettier: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Das echte Layout bei 390 px mit `APP_VERSION=0.12.0+123-gabcdef1` habe ich nicht gesehen. Es steht noch aus beim Persona-Lauf Marco.
- Ob der Pull-Request-Text `No scenario: <reason>` enthält (`check-issues.mjs`), lässt sich erst am Pull Request prüfen. Ich habe nur den Plan angesehen (`implementation_plan.md:14`).
