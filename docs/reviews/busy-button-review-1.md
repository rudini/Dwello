# Code-Review #1182 «Busy-Button bei 150 % Zoom lesbar», Runde 1

Range: `git diff 75b78a9 a675d40` (Worktree `review-busy-button-code-reviewer`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geprüft: `Button.svelte` ändert nur den Busy-Look (`bg-sunken text-ink-muted border-line-strong cursor-progress`, kein Hover, keine Opazität, wie im Entscheid). `disabled:`-Klassen bleiben. Die entfernten `aria-disabled:`-Klassen hatten nur den Busy-Fall gestylt, weil `aria-disabled` nur bei `busy` gesetzt wird (Z. 109). Keine Stelle in `src` übergibt `busy` und `disabled` zusammen, also gibt es keinen Fall, in dem `disabled:opacity-60` zusätzlich greift. `tokens.test.ts:37` sichert ink-muted auf sunken ≥ 7:1. Der DOM-Test deckt alle fünf Varianten ab und ist auf der Basis rot (Varianten-Hintergrund, `aria-disabled:opacity-60`). Das Szenario prüft hell/dunkel per `emulateMedia`, passend zu `prefers-color-scheme` in `src/styles/tokens.css`. Kontrast- und Farbschritt zeigen Rot auf der Basis (Opazität bzw. Variantenfarbe). Die Questions geben Werte zurück (Zahl, Token-Name). Die Steps rufen nur Tasks und Questions auf. Das Feature sagt, was gewollt ist, nicht wie. Es gibt keine neuen Texte, keinen neuen Bildschirmzustand und keine unverwandten Änderungen; `token-referenz.md` ist nachgeführt. Ponytail: Die Luminanzformel in `Colour.contrastOf` doppelt `tokens.test.ts`, läuft aber im Browser-Kontext (`evaluate`) und lässt sich dort nicht importieren. Das ist kein Befund.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run` für ui-button/design-guard/tokens/e2e-screenplay-lint (617 grün), E2E `tenant-documents.feature` (19 grün), axe- und Sprachzeilen `busy-dialog-open` (2 grün), die Rot-Läufe (2.7:1 / 3.57:1, accent-soft, DOM-Test für alle fünf Varianten).
- Ob Chromium `backgroundColor` als `rgb(...)` liefert, sodass `Colour.backgroundOf` den Hex-Wert des Tokens trifft, habe ich nur gelesen, nicht ausgeführt. Belegt ist es durch den gemeldeten grünen Lauf.
