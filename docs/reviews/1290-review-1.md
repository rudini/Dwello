# Code-Review #1290, Runde 1, `git diff e3a0a5b 761d9b3`

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Ponytail-Review: Lean already. Ship.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend-Type-Check, `bunx vitest run` (4605 Tests), E2E `tenant-documents.feature` auf Chromium (27 bestanden), Axe- und Sprachzeilen `tenant-detail upload-busy` (2 bestanden), Prettier auf der neuen Datei.
- Vom Aufrufer gemeldet: die Rotläufe (Szenario zuerst am fehlenden Element im Negativschritt, dann an der leeren Live-Region; Pin-Test mit geändertem Text). Durch Lesen bestätigt, dass beide Schritte ohne Änderung scheitern (ohne `tenant-document-upload-busy-note` findet `Text.of` kein Element; ohne Text bleibt die Region leer) und der Pin-Test ohne die vier Schlüssel scheitert.
- Wie ein Screenreader die zwei gleichzeitig gefüllten `role="status"`-Regionen («Bitte warten …» im Button, neuer Satz) ansagt (beide oder nur eine), lässt sich durch Lesen nicht bestätigen; angesehen: `src/lib/ui/Button.svelte:125-127`, `TenantDocumentUpload.svelte:160-166`.

Geprüft: Komponente (Live-Region vor dem Text vorhanden, Text nur während `uploading`, nach Erfolg und Fehler leer, `mt-2` im 8-px-Raster, keine Roh-Farben), Wortlaut in allen vier `messages/*.json` gleich `docs/reviews/1290-fachreview-1.md` und im Test gepinnt, Szenario ohne `@wip` mit positivem Anker vor der Negativprüfung, Schritte nur über Questions, Target mit `data-testid` in kebab-case, `screens.json`-Bedeutung von `upload-busy` ergänzt (Zeilen in `accessibility.feature`/`sprachen-bildschirme.feature` bestehen, die Fixture `tests/e2e/tasks/accessibility.ts:440` wartet auf den Busy-Status, der im selben Render den Satz zeigt), kein bestehendes Szenario geändert, nichts Fremdes im Diff, Commit-Betreffe konform.
