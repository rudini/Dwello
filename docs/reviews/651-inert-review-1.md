# Review 651-inert, Runde 1 (fbee44c8..81e78fdc)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/steps/app-frame.steps.ts:413 | Der neue #651-Schritt steht zwischen dem Kommentar `// #657: «Hilfe» stands at the top of the menu …` und dem #657-Schritt `nennt das Menü zuerst`; der #657-Kommentar beschreibt jetzt den falschen Schritt. Der #651-Block gehört über den #657-Kommentar oder hinter den #657-Schritt. |

Keine Blocker/Major.

Geprüft: alle fünf geänderten Dateien; Szenario (Grundlage «auf der Gebäudeliste», 390 px, Menü offen) prüft das Verhalten auf `main` (`makeInert` in `src/lib/ui/MobileNav.svelte:19`, `src/lib/inert.ts`), Commit-Message nennt es als beibehaltenes Verhalten (Workflow 2), kein Bugfix; Screenplay-Schichten eingehalten (Schritt ruft nur die Frage auf, Frage über Target `mobileNav`); die Frage antwortet mit Werten (Liste der erreichbaren Teile, `[]` bei vollständig inert; fehlender Dialog ergibt `null` und schlägt fehl), `sees` pollt per `expect.poll`, also kein Rennen mit dem Effekt, der `inert` setzt; der Toast-Bereich ohne Toast enthält keine erfassten Elemente; ohne `makeInert` liefert die Frage nach dem Lesen Kopfbereich, Sprunglink, Menü-Knopf und `main` und fällt damit rot; keine UI-Texte, kein neuer Bildschirmzustand, keine API-Änderung, kein bestehender Schritt geändert; nichts ohne Bezug zur Anforderung.

## Nicht bestätigt

- Szenario grün in chromium (`bun run test:e2e -- --project=chromium -g "Hinter dem offenen Menü"`): vom Aufrufer gemeldet.
- Rot-Lauf ohne `makeInert(modal)`: vom Aufrufer gemeldet; nach dem Lesen von `ReachableAround` (tests/e2e/screenplay/questions.ts:134-150) plausibel.
- `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main` (auch `--structure`), `bunx vitest run --changed origin/main`, Commit-Hooks: vom Aufrufer gemeldet.
- Andere Browser-Projekte als chromium (firefox/webkit, falls konfiguriert): nicht gelaufen, nicht gemeldet.
