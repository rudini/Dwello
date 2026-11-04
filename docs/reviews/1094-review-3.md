# Code-Review #1094, Abschluss-Runde (cf70f7e99..7aa0ad4e6)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `SendDialog.svelte:20,135` hängt `&list=…` wie `PdfAction.svelte:33` (URLSearchParams-kodiert) an den `?ansehen`-Link; `+page.svelte:358` reicht `list` aus `afterNavigate` (Z. 72–75) weiter; `pdf/+server.ts` gibt `request` an `pdfRefusal` (`statement.ts:263–275`), das `list` unabhängig von `view` nur mit Präfix `/statements?` übernimmt, ungefilterte Liste (`/statements`) wird harmlos verworfen; die Referer-Regel greift beim gelöschten Datensatz nicht (Referer ist die Detailseite, nicht `/statements`), daher wirkt `list` auch im neuen Tab. Neuer DOM-Test (`statement-pages.dom.test.ts:1585–1596`) wäre ohne die Änderung rot (href war `/statements/s1/pdf?ansehen`), der bestehende Test Z. 1580 sichert den Fall ohne Liste. Keine neuen Texte, Tokens, testids oder API-Antworten; nichts Fremdes im Diff; ponytail-review: kürzeste Form, nichts Ungenutztes. Szenario: das Verhalten gehört zu #1094 auf dem noch nicht gemergten Branch, das Szenario «Von der Fehlerseite eines PDF der Detailseite zurück zur gefilterten Liste» (`statements.feature:141`) deckt den gemeinsamen Serverpfad; den Einstieg über den Versand-Dialog zeigt der DOM-Test auf der tiefsten Schicht.

## Nicht bestätigt

- `bunx vitest run src/__tests__/statement-pages.dom.test.ts src/__tests__/pdf-refusal.test.ts` (251 grün, neuer Test rot gesehen), `bun run lint`, `bun run check`, Prettier auf den geänderten Zeilen: vom Aufrufer gemeldet.
- Kein E2E-Lauf über den Link `send-pdf-view` bis zur Fehlerseite (kein Step nutzt `sendPdfLink` für diesen Fall, `tests/e2e/targets/statement-detail.ts:68`); das Verhalten im neuen Tab ist nur durch Lesen von `pdfRefusal` und DOM-Test belegt.
