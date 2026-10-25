# Review p5ae2, Runde 2 (Abschlussrunde, Delta 8b6a9ffd..037ab30a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/__tests__/contract-detail-page.dom.test.ts:893, 903, 906 | **Erledigt.** s2 erwartet jetzt «NK-2025-0002 (Entwurf)». Die neue Abrechnung s4 mit `overdue` erwartet den Rückfall «NK-2022-0004 (versendet)». Damit ist jeder Zweig von `labels`/`statusOf` in `DeleteContract.svelte:35-40` abgesichert. Fällt der Rückfall weg oder werden Labels vertauscht, schlägt der Test fehl. |

Keine neuen Befunde. Keine Blocker und keine Major.

Geprüft: Das Delta ändert nur die Testdatei (5+/1-). Die Commit-Nachricht sagt, dass der Test bestehendes Verhalten festhält. Das stimmt: An `DeleteContract.svelte` hat sich nichts geändert, und das Verhalten war schon auf der Basis da. Ein Bugfix ist es nicht.

## Nicht bestätigt

- `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts` mit 66 bestandenen Tests: vom Aufrufer gemeldet, nicht erneut ausgeführt.
