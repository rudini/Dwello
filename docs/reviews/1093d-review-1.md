# Code-Review 1093d, Runde 1 (`c94a59548..d62182106`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | src/__tests__/documents.test.ts:118 | Der bestehende Test «liefert das PDF eines Dokuments zum Herunterladen» erwartet `content-type: application/pdf` von `GET /documents/[id]/pdf`; die Route liefert jetzt `application/octet-stream`. Der Test ist rot, CI (Unit-Suite) wird rot. |
| C-2 | Minor | src/__tests__/pdf-refusal.test.ts:184 | Der Inline-Test («wird als Beleg im Browser mit seiner Art angezeigt») pinnt gehaltenes Verhalten (schon auf c94a59548 grün, vgl. `invoice-upload-endpoints.test.ts:117`), aber die Commit-Nachricht von d62182106 sagt das nicht (CLAUDE.md, Workflow 2); im PR-Text oder in der nächsten Commit-Nachricht nachtragen. |

## C-1 (Blocker)

`src/routes/documents/[id]/pdf/+server.ts` ruft `proxyFile` ohne `inline` auf, also gilt neu `'content-type': 'application/octet-stream'` (`src/lib/server/file-proxy.ts:18`). `src/__tests__/documents.test.ts:106-121` ruft genau diese Route mit einer Backend-Antwort `content-type: application/pdf` auf und prüft in Zeile 118 `toBe('application/pdf')`. Nachweis: `bunx vitest run src/__tests__/documents.test.ts` auf d62182106 schlägt fehl (Erwartet `application/pdf`, erhalten `application/octet-stream`). Der Aufrufer hat nur `pdf-refusal.test.ts` laufen lassen; `bunx vitest run --changed` hätte ihn gefunden, da der Test die geänderte Route importiert. Behebung: die Erwartung in Zeile 118 auf `application/octet-stream` ändern (kein Szenario, daher keine Spec-Freigabe nötig); der neue Test in `pdf-refusal.test.ts` (Zeilen 166-182) deckt dann dasselbe ab und kann entfallen oder bleiben.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/pdf-refusal.test.ts` (Octet-Stream-Test zuerst rot gesehen), E2E Chromium der Features tenant-documents, documents, invoice-detail und statement-detail (167 bestanden).
- WebKit-Verhalten (Szenario «Ein Foto als Dokument hochladen», Schritt «öffnet das Dokument "Ausweiskopie" die JPG-Datei "ausweis.jpg"»): nur durch den nächsten All-Browser-CI-Lauf zu bestätigen.
- Mobile Safari (iOS) bei einem PDF-Dokument: vorher `application/pdf` + `attachment`, jetzt `application/octet-stream` + `attachment` mit Dateinamen `.pdf`. Ob iOS dadurch statt einer Vorschau nur «Herunterladen» anbietet, ist ohne Gerät nicht prüfbar; Desktop-Browser speichern in beiden Fällen.

Geprüft: alle `proxyFile`-Aufrufer (nur die zwei geänderten Routen); Links auf `/documents/{id}/pdf` (TenantDocumentRow, DocumentItem, MarkedSentNotice, MetadataCard) bleiben Downloads, da das Backend immer `attachment` mit Dateinamen sendet (`backend/src/routes/file-response.ts:10`); keine E2E-Frage liest den content-type dieser Route (`DownloadFrom`/`DownloadedFile` nutzen Dateiname und Bytes, `statement-detail.steps.ts:304` die ersten Bytes); Beleg-Route inline unverändert (`invoice-upload-endpoints.test.ts:117`); der neue Octet-Stream-Test ist ohne die Änderung rot (vorher `image/jpeg`).
