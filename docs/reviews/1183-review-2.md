# Review #1183, Runde 2 (Delta db4d1aa..77b6e45)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: reine Umbenennung (similarity 100 %) von `src/lib/ui/save-on-enter.ts` nach `src/lib/save-on-enter.ts`, beide Importe angepasst (`src/routes/config/SaveForm.svelte:10`, `src/routes/config/ki/+page.svelte:7`); in `src`, `tests`, `tools` verweist nichts mehr auf den alten Pfad. `tools/fitness/ratchet.json` bleibt unverändert, die Grenze von fe:ui wurde also nicht gelockert; der Helfer liegt jetzt neben anderen `$lib`-Helfern auf oberster Ebene wie `focus-after-action`. Das Verhalten ist unverändert, darum ist kein neuer Test nötig. Ein Verweis auf den alten Pfad steht nur noch in `docs/reviews/1183-review-1.md` und `docs/archive/sessions/1183.md`; beides sind Protokolle, nicht Teil des Deltas.

## Nicht bestätigt

- `bun run fitness`, `bun run lint`, `bun run check`, vitest ki-settings-page, categories-page und design-guard (596 passed) auf 77b6e45: vom Aufrufer gemeldet.
- Backend type-check, `vitest --changed origin/main`, open-work und Prettier auf hinzugefügten Dateien auf db4d1aa: vom Aufrufer gemeldet.
- Der Merge db4d1aa ohne Konflikte: nicht gegen origin/main nachgeprüft; nur das genannte Delta gelesen.
