# Code-Review 1128, Runde 2 (Delta 0812a6eff..db0627147)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | (aus Runde 1, unverändert) | Name in einer anderen Sprache erfasst: offen wie vom Aufrufer genannt |

Geschlossen: C-1

Geprüft: `focusSavedRow` (src/lib/focus-after-action.ts:65-72) lässt jetzt Links in `nav` aus. Das gilt für das Hauptmenü (Navigation.svelte:9, MobileNav.svelte:72) und den Breadcrumb (PageHeader.svelte:22). Der einzige Aufrufer ist src/routes/config/SaveForm.svelte:60, und dessen Listen stehen nicht in `nav`. Der neue Test (focus-after-action.dom.test.ts:120-127) stellt einen gleich benannten Menülink vor die Liste. Beim Lesen zeigt sich: Ohne den Filter findet die Namenssuche zuerst `/hilfe`, der Test schlägt also ohne die Änderung fehl. Das Diff berührt nichts ausserhalb der Anforderung.

## Nicht bestätigt

- bun run lint bestanden, vom Aufrufer gemeldet
- bunx vitest run src/__tests__/focus-after-action.dom.test.ts, 11 bestanden, vom Aufrufer gemeldet
- Neuer Test vor dem Fix rot gesehen, vom Aufrufer gemeldet (beim Lesen plausibel, siehe oben)
- Der Bericht der Runde 1 (docs/reviews/1128-review-1.md) liegt nicht im Worktree. Was C-1 und C-2 sind, stammt daher aus der Beschreibung des Aufrufers.
