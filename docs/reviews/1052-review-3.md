# Review #1052 Teil 2 (pdf.service.ts), Commit 3f0489bd (Basis c8e4147f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/pdf.service.ts:258 | Der Datei fehlt jetzt der Zeilenumbruch am Ende (`\ No newline at end of file` im Diff, auf c8e4147f war er vorhanden). Das ist eine Formatänderung ohne Bezug zur Aufteilung, und Prettier würde sie zurücknehmen. |

Keine Blocker, keine Major.

Geprüft: Ich habe die Zeilen der alten Datei pdf.service.ts mit den Zeilen der sechs neuen Dateien verglichen, ohne Leerraum und sortiert. Gleich sind alle Zeilen ausser Imports, Kopfkommentaren und dem neuen `export` vor bisher privaten Deklarationen. Der Code ist also wörtlich verschoben. Ein Zyklus zwischen layout, balance, cost-table, heating, payment-part und service besteht nicht. Die Aufrufer (reminder-pdf, emergency-sheet, statement-send, backup, reminder.service) importieren jetzt aus den neuen Modulen. statement-pdf.service und statement-pdf-render.test bekommen `Language` und `StatementPDFData` weiter über die Re-Exports. Jeder neue Export wird ausserhalb seiner Datei benutzt. Die Kommentare zu `owed` in statement-payment(.test).ts nennen weiterhin den richtigen Ort. statements.ts hat auf der Basis 507 nicht leere Zeilen bei einer Ratchet-Grenze von 506, jetzt 504, und das stimmt mit ratchet.json überein. Die Ratchet-Einträge pdf.service.ts und be:services/reminder fallen weg. Die Regex PDF_SOURCES deckt pdf.service, pdf-*.ts, qr-bill.service und pdf-texts/{de,fr,it,en} ab, aber keine `*.test.ts`. Der neue Test in ui-screenshot-routes.test.ts wäre auf der Basis rot gewesen (pdf-layout und andere fehlten in der Liste). Für das Refactoring braucht es kein Szenario, weil sich kein sichtbares Verhalten ändert. Die Liste der Bildschirme und die Nachrichten (messages) bleiben unberührt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: backend type-check; lint; check; fitness mit 0 Fehlern; `bun test` statement-pdf-render, statement-pdf-data, statement-payment sowie die Tests zu reminder, emergency, send und pdf (381 bestanden); die pg-Tests statement-pdf, billed-until, agreed-from, agreed-categories, reminder und send (164 bestanden); vitest tests/unit, tools/fitness, tools/arch-baseline und open-work (293); Prettier auf den neuen Dateien; der Vergleich der Inhalts-Streams von 16 gerenderten PDFs (main gegen Split).
- Dass `fitness --update` ausser den drei geänderten Einträgen nichts weiter senken müsste (etwa ce von be:services/statement), habe ich nur am Diff von ratchet.json gelesen, nicht nachgemessen.
- Die rote Ausführung des neuen Tests in ui-screenshot-routes.test.ts habe ich nur durch Lesen beurteilt.
