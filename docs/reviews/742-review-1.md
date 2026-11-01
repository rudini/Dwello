# Code-Review #742, Runde 1 (2caeda718..52f052e4d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:122-126 | Fällt die Zahl auf 0, nennt die Statuszeile sie nicht. Wählt der Liegenschaftsverwalter die letzte fertige Zeile ab (`invoice-upload-row-select`, im Issue «chosen or refused»), lässt die Zeile «Bereit zum Erstellen» einfach weg. Der Screenreader hört dann nur «Bitte prüfen: 1.», während der Button «0 Rechnungen erstellen» heisst und gesperrt ist (Z. 255). Kein Test auf irgendeiner Ebene ändert die Auswahl und prüft die Statuszeile. Die DOM-Tests (src/__tests__/invoice-upload-dialog.dom.test.ts:323, 768) prüfen nur den Zustand nach dem Lesen, das Szenario (invoices.feature:111-114) nur den Wechsel von 0 auf 1. |

Keine Blocker, keine Majors.

Geprüft:
- Kein Szenario ohne `@wip` wurde geändert. Die übrigen Prüfungen mit `meldet Dwello` (invoices.feature:106, 234; ki-einstellungen.feature:59) haben nur unvollständige Zeilen: bei 106 kein Verteilschlüssel, bei 234 leere Felder nach gescheitertem Lesen, bei 59 «Keine KI» mit leeren Feldern. Der Step vergleicht mit `toBe` (invoice-upload.steps.ts:315-317).
- Das neue Szenario und die zwei geänderten DOM-Erwartungen schlagen ohne die Änderung fehl (genauer Vergleich).
- `complete` wurde nur vor `status` verschoben, Kommentar mitgenommen; das Verhalten bleibt gleich.
- Der Text steht in allen vier `messages/*.json`. fr «À créer» und it «Da creare» folgen der Form der Nachbarn («À vérifier», «Da verificare») und dem Button «Créer/Creare … factures/fatture». Die Begriffe passen zu `i18n-begriffe.md`.
- Gesprächigkeit: Die polite Live-Region spricht nur bei geändertem Text. Neu kommt das hinzu, wenn eine Zeile beim Tippen fertig oder wieder unfertig wird. Beim Erstellen zählt die Zeile Schritt für Schritt herunter, das taten die Zähler «Bitte prüfen» schon vorher. Das bleibt im Rahmen der Anforderung.
- Kein neuer Bildschirm und kein neuer Zustand, daher keine neuen Zeilen in screens.json, accessibility.feature oder sprachen-bildschirme.feature. Die Commit-Nachricht ist gültig, keine fremden Änderungen im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet: Das Szenario war als `@wip` rot (erhalten «Bitte prüfen: 1.»), dann grün. Ausserdem `bunx vitest run --changed origin/main` (672 bestanden), `playwright invoices.feature ki-einstellungen.feature` (59 bestanden), die axe- und Sprachzeilen der fünf Upload-Bildschirme (10 bestanden), `bun run lint` und `bun run check`.
- Ob «Bitte prüfen: 1. Bereit zum Erstellen: 1.» für einen Screenreader-Nutzer nach zwei Dateien klingt, weil dieselbe Zeile in beiden Zählern steht. Das ist eine Frage der Wortwahl und gehört in die geplante Runde der Persona Sven, nicht in dieses Review.
- Issue #742 über die REST-API gelesen. Den Bericht von Persona Sven P-11 (#217) habe ich nicht eingesehen.

## Triage

- C-1 (Minor): stays in this report. Naming «Bereit zum Erstellen: 0.» whenever nothing is complete would change the exact status that three non-`@wip` scenarios check (invoices.feature:106, :234, ki-einstellungen.feature:59), which needs a product-owner decision; naming it only after a row was complete before needs extra state. Not trivial. The disabled button «0 Rechnungen erstellen» still says it.
