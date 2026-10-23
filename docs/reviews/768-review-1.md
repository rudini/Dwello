# Code-Review #768, Runde 1 (2ebcd9ac2..58edb0424)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
| -- | ------- | ----------- | ------ |
| – | – | – | Keine Befunde. |

Geprüft: alle drei geänderten Dateien gelesen.
- Die Sortierung `invoiceDate, createdAt, id` in `invoice.service.ts:610` gibt bei gleichen Daten jedes Mal dieselbe Reihenfolge. `createdAt` ist `defaultNow()` mit Mikrosekunden, und die beiden `insertInvoice` in `agreed-from.pg.test.ts:38-39` laufen als getrennte Autocommit-Anweisungen. Hauswart steht damit sicher vor Lift, wie es `:100` erwartet.
- Die Positionen kommen in dieser Reihenfolge aus `calculation.service.ts:355` (Schleife ab etwa `:384`). Gespeichert werden sie mit `sortOrder` (`statement.service.ts:510`) und mit `orderBy(sortOrder)` gelesen (`:323`). Der Satz im PDF (`statement-pdf.service.ts:141f`) ist damit stabil.
- Reihenfolge der Erfassung als Tie-Break: Sie ändert sich beim Bearbeiten einer Rechnung nicht, weil `createdAt` gleich bleibt. Die Rechnungsliste (`invoice.service.ts:168-170`) und `:268` brechen Gleichstände schon so (dort absteigend). `id` greift nur bei gleichem `createdAt`, also bei Einfügen in derselben Transaktion. Dann ist die Reihenfolge nicht die der Erfassung, bleibt aber stabil.
- Weitere Aufrufer von `getInvoicesForStatement`: `invoice-completeness.service.ts:199, :292`, `agreed-category.service.ts:106`, `statement-invoices.service.ts:41, :180` und die Route `invoices.ts:188`. Keiner verlässt sich auf die alte Reihenfolge: Sie filtern, suchen mit `find` oder fassen zusammen, und die Route liefert nur die Reihenfolge innerhalb eines Datums anders. Ein Vertrag in `tests/contracts` ist nicht betroffen, weil sich die Form der Antwort nicht ändert.
- Den gleichen Gleichstand gibt es schon vor dieser Änderung an zwei Stellen, die der Diff nicht berührt:
  - `fuel-stock.service.ts:62`: `orderBy(desc(invoiceDate)).limit(1)` wählt den Verteilschlüssel der neuesten Rechnung. Bei zwei Rechnungen vom selben Tag mit verschiedenen Schlüsseln ist die Wahl zufällig.
  - `invoice-completeness.service.ts:286`: nur nach `invoiceDate` sortiert.

  Beides ist kein Befund dieses Slices. Es wäre ein eigenes Issue, wenn es gewollt ist.
- Robustheit des Tests: Die Periode 2024 enthält nur die beiden neuen Rechnungen, denn alle Rechnungen aus `beforeAll` sind 2025/2026 datiert, und ihre Leistungszeiträume beginnen frühestens am 2025-10-01. `createdAt` ist explizit gesetzt, der Test ist also auch grün deterministisch. Rot ohne den Fix (beim Lesen): Die Rechnung mit dem späteren `createdAt` wird zuerst eingefügt, steht also im Heap vorn. Das deckt sich mit dem gemeldeten roten Lauf. `afterAll` räumt die Rechnungen über `buildingId` weg.
- Konventionen: Die Commit-Nachricht ist korrekt. Der Fix ändert keinen Text, keine UI und keinen API-Vertrag. Die Begründung für «No scenario» trägt: Die Speicherreihenfolge von PostgreSQL lässt sich im E2E-Stack nicht erzwingen, der pg-Test zeigt das Verhalten auf der tiefsten Schicht. Ponytail: minimaler Diff, nichts Ungenutztes.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (Backend-Tests auf Wunsch des Aufrufers nicht gestartet):
  - roter Lauf des neuen Tests vor dem Fix, grüner danach
  - `cd backend && bun run test` (1525 pass, Coverage-Floor)
  - `bun run type-check`, `bun run lint`, `bun run check`
  - `bunx fallow audit`
- Ob der Fix den roten CI-Lauf 40003782997 von `agreed-from.pg.test.ts:100` dauerhaft behebt, nur aus dem Code geschlossen (`agreed-from.pg.test.ts:38-39`, `calculation.service.ts`, `statement.service.ts:320-323`). Den CI-Lauf selbst habe ich nicht angesehen.
