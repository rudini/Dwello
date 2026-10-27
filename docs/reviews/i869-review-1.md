# Code-Review #869, Runde 1 (6bd3a770, `git diff origin/main 6bd3a770`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `src/routes/+layout.svelte:55-59` gegen `@sveltejs/kit` 2.70.3 `src/runtime/client/client.js` gelesen: `initialize()` erzeugt die Root-Komponente mit `sync: false` (onMount-Effekte laufen in einer Microtask), danach `await Promise.resolve()`, Rückkehr aus `_hydrate` und `_start_router()` am Ende von `start()`, also alles Microtasks derselben Aufgabe; `setTimeout` läuft erst, wenn diese abgearbeitet sind, damit hört der Router bei gesetzter Markierung zu. Die Markierung wird nur von `tests/e2e/screenplay/interactions.ts` (`Navigate.to`, `reload`, `releaseScripts`, `Click.toReload`) und `tests/e2e/targets/accessibility.ts` gelesen; eine spätere Markierung macht keinen dieser Waits zu früh, und `toWithScriptsHeldBack` wartet bewusst nicht darauf. Die App selbst (CSS, Komponenten) liest `data-hydrated` nicht; `src/lib/server/statement.ts:245` setzt die Markierung im PDF-HTML statisch und ist nicht betroffen. Die Fragen des Szenarios «Suche ohne Treffer» pollen bereits (`Actor.sees` = `expect.poll`), die Ursache lag beim verlorenen Absenden, nicht beim Lesen; so passt der Fix zur Anforderung. Neuer DOM-Test `src/__tests__/layout-hydrated.dom.test.ts` erneut ausgeführt: grün; beim Lesen schlägt er ohne die Änderung fehl (`show()` ruft `flushSync`, onMount hätte die Markierung sofort gesetzt, `toBeUndefined` wäre rot). `No scenario` im Commit begründet (keine für den Liegenschaftsverwalter sichtbare Änderung; das bestehende Szenario ohne `@wip` deckt den Ablauf ab). Keine UI-Texte, keine Messages, kein Backend, keine Änderung unter `tests/e2e/`, nichts Fremdes im Diff; `implementation_plan.md` führt die Session wie vorgesehen. Ponytail-review: Lean already. Ship.

## Nicht bestätigt

- Dass das Szenario «Suche ohne Treffer» in Firefox wiederholt besteht (Kriterium von #869): in diesem Container kein Firefox, E2E darf ich nicht starten; hängt am CI-Lauf (Firefox-Shard) nach dem Push.
- Die Probe auf dem E2E-Stack (Klick beim Erscheinen der Markierung geht über den Router, `__data.json`, 5 von 5) ist nicht committet; nur aus Aufrufer-Angabe und Commit-Text bekannt.
- Dass der neue Test vor dem Fix rot war: nicht nachgestellt, nur durch Lesen beurteilt (siehe oben).
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run` für `public-pages-layout.dom.test.ts`, `language-switcher.dom.test.ts`, `tokens.test.ts`, Prettier auf neuen und geänderten Zeilen, laufende Chromium-E2E-Suite (Ergebnis offen). Selbst erneut ausgeführt: nur `layout-hydrated.dom.test.ts` (1 Test grün).
