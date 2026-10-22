# Code-Review #626, Runde 1 (a4e7fe2..8d6984e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/invoices/UploadFiles.svelte:9, messages/de.json:1021 | Sobald ein Gebäude gewählt ist, sagt derselbe Dialog unter dem neuen Satz «Es ist «Keine KI» gewählt: Sie geben die Angaben selbst ein …» weiterhin «Ausgewählte Dateien liest die KI sofort aus.» (`invoices_upload_files_help`, alle vier Sprachen). Der Widerspruch, den #626 beheben soll, steht damit im Dialog selbst. |
| C-2 | Minor | src/lib/server/ki-settings.ts:39 | `.catch(() => false)` in `kiOff` ist ungetestet: Ohne den Catch würde ein Fehler von `GET /ki-settings` die ganze Rechnungsliste in den Fehlerzweig von `+page.server.ts` schicken. Kein Test lässt die Antwort scheitern und erwartet die Liste mit `kiOff: false`. |

## C-1 (Major)

**Warum falsch:** Nach «Done means» von #626 sagt der Dialog bei «Keine KI», «dass keine KI die Dateien liest und was stattdessen geschieht». `UploadFiles.svelte:9` zeigt bei gewähltem Gebäude `m.invoices_upload_files_help()`: «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.» Dieser Text hängt nicht von `kiOff` ab. In einer Installation mit Gebäuden liest der Liegenschaftsverwalter also nach der Wahl des Gebäudes zwei widersprüchliche Aussagen im selben Dialog. Das ist dasselbe Problem, das Persona Anna gemeldet hat (zuvor Übersicht gegen Dialog). Die Änderung macht den Widerspruch sichtbarer: Der neue Satz sagt ausdrücklich, dass niemand die Dateien liest.

**So zeigt man es:** In der frischen Installation gibt es kein Gebäude. Darum sieht weder das Szenario «Rechnungen hochladen, wenn keine KI gewählt ist» noch der a11y-Zustand `upload-ki-none` den Hilfetext. Ein DOM-Test in `invoice-upload-dialog.dom.test.ts` zeigt den Fehler: `kiOff: true`, ein Gebäude wählen, dann erwarten, dass der Hilfetext der Dateiauswahl nicht «liest die KI» sagt. Mit dem heutigen Code schlägt er fehl.

**Hinweis zur Triage:** Der Entscheid in #626 schreibt nur den ersten Satz vor. Ein neuer Hilfetext für «Keine KI» (z. B. ohne den letzten Satz) ist ein Text, den der Entscheid nicht nennt. Ob er unter die vorhandene Entscheidung fällt oder einen Produktentscheid braucht, entscheidet der Aufrufer.

## Nicht bestätigt

- lint, check, vitest voll (3667 grün; beide neuen Tests zuerst rot), fallow audit, E2E chromium «KI in den Einstellungen» und die Zeilen invoices / dashboard `ki-none` / `upload-ki-none` in accessibility und Sprachen: alles vom Aufrufer gemeldet, nicht wiederholt.
- Ob die Zeile `upload-ki-none` in fr/it/en ohne Deutsch durchläuft, habe ich nur an den Texten in `messages/*.json` gelesen (Begriffe passen zu `ki_settings_none` und `ki_none_title`); den Lauf habe ich nicht gesehen.

Geprüft: Betreiber-Aus ergibt `mode: 'none'` (backend/src/services/ki-settings.service.ts:86-91), also greift `kiOff` auch dort. Rot der neuen Tests aus dem Code gelesen (wip-Commit a00c535 setzt die testid, der Text war noch der alte). Die Aufräumlogik des Fixture `frisch` stellt die lokale KI wieder her. Screenplay-Schichten, Kontrakt `ki-settings.json`, screens.json mit stateMeanings und beide Features sind vorhanden. Mapper: `kiOff` liegt in `src/lib/server/ki-settings.ts`; den Inline-Read im Dashboard gab es schon vorher. ponytail-review: nichts zu kürzen.
