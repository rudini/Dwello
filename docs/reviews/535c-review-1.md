# Code-Review 535c, Runde 1 (Schlussrunde vor dem Push)

Bereich: `git diff c1d0a25 22a4573` (1 Commit, `fix(invoices): rest link in a new tab while open`), Worktree `/tmp/scratchpad/review-535c-code-reviewer`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `UploadResult.svelte` setzt `target="_blank"`, `rel="noopener noreferrer"` und den sichtbaren Zusatz `ui_opens_new_tab` nur bei `open.length > 0`, so wie `src/lib/ui/Button.svelte` (Z. 63, 88); `open` ist im Dialog `stillOpen` = alle noch offenen Zeilen (`InvoiceUploadDialog.svelte:86, 260`), auf der Liste (`+page.svelte:68`) leer, also gleicher Tab; `ui_opens_new_tab` steht in allen vier `messages/*.json` (Z. 202); der neue DOM-Test schlägt ohne die Änderung fehl (`target`/`rel` wären `null`, Text ohne Zusatz) und prüft den Wert selbst; die Zeile `upload-mixed-rest` (Datei noch offen) zeigt jetzt die Variante mit neuem Tab und läuft in `accessibility.feature` und `sprachen-bildschirme.feature`; das Szenario «Nach dem Erstellen nennt Dwello den Rest …» (eine Datei, keine offen) und sein Step (`recordRestHref` = `/invoices/new`) bleiben unverändert; `min-h-12` bleibt; nichts Unbezogenes im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts` (57 bestanden), E2E chromium: Szenario «Nach dem Erstellen nennt Dwello den Rest …» sowie axe- und Sprachzeile `upload-mixed-rest` (3 bestanden).
- Der rote Lauf des neuen DOM-Tests ist nur durch Lesen beurteilt (siehe oben), nicht ausgeführt.
- Kein E2E-Szenario prüft den neuen Tab selbst (im Dialog mit offener Datei); der DOM-Test zeigt das auf der tiefsten Schicht, das Verhalten ist eine Nachbesserung innerhalb von #535 (nicht auf `main`), dessen Szenario besteht. Deshalb kein Befund.
