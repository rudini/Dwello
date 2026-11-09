# Code-Review #1314, Runde 1 (81585d76..71becae9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle 12 geänderten Dateien. Beide Hinweis-Links (`InvoiceHint.svelte:22`, `PreviewChecks.svelte:181`) führen auf `?schritt=3&from=invoice`. «Rechnung erfassen» (`PreviewChecks.svelte:107`) bleibt auf `?schritt=3`, mit dem alten Banner (bestehender DOM-Test «Zurück vom Erfassen einer Rechnung»). `localPath` lässt die Adresse mit `&from=invoice` durch, und Speichern wie Abbrechen kehren zu `returnTo` zurück (bestehender Test in `invoice-pages.dom.test.ts:1218`). `fromInvoice` wird nur beim Wiederherstellen eines Entwurfs gesetzt, das Banner bleibt sonst verborgen. Die vier Texte stehen in allen vier `messages/*.json`, ohne «neue Rechnung». Der neue DOM-Test, die angepassten href-Erwartungen und das Szenario (Abbrechen, Schritt-Überschrift, Bannertext als Wert über `Text.of`) schlagen ohne die Änderung fehl. Die Screenplay-Schichten sind eingehalten, und das Szenario enthält keine UI-Wörter. Es gibt keinen geänderten Schritt eines Szenarios ohne `@wip`. Für `screens.json` und die a11y-/Sprachen-Features braucht es keine neue Zeile: Es ist dieselbe Hinweis-Box mit denselben Bedienelementen, nur ein anderer Text, und schon `statements_resume` hatte keine Zeile. Ponytail: kein ungenutzter Code und keine Kopie eines bestehenden Helpers.

## Nicht bestätigt

- vom Aufrufer gemeldet: lint, check, fitness `--base origin/main`, vitest vollständig (4766), E2E chromium `statement-generate.feature` und `invoice-edit.feature` (124). Ebenfalls vom Aufrufer gemeldet: Das neue Szenario und der DOM-Test waren vor der Änderung am Bannertext rot. Ich habe keine Tests ausgeführt.
- Die Rückkehr nach «Änderungen speichern» hat kein eigenes E2E-Szenario. Nur Abbrechen ist abgedeckt. Durch Lesen bestätigt: Beide Wege nutzen dasselbe `returnTo` (`src/routes/invoices/[id]/edit/+page.svelte:60`).
- Die Bemerkung im Issue, dass der Toast «gespeichert» «Angaben verwerfen» halb verdeckt, setzt der Diff nicht um. Ob dafür ein Issue existiert, bevor der Pull Request #1314 schliesst, habe ich nicht geprüft (CLAUDE.md, «Open work»).
