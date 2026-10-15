# Code-Review 1: Dokumente zu einem Mieter hochladen (#174)

Geprüft: Worktree `review-upload-code` (Commit `0ffdd30`), Bereich `8ec20d5..0ffdd30` (Szenarien `55bfcbf`, `61dbb43`; Umsetzung `0ffdd30`). Grundlage: Issue #174 («Decided (product owner)», «Done means»), `docs/reviews/upload-scenarios-fachreview-1.md`, `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/design/token-referenz.md`. Alle 53 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | `tests/contracts/` (fehlt), `src/__tests__/tenant-documents.test.ts:82`, `src/__tests__/tenant-detail-page.dom.test.ts:60-71` | Kein API-Vertrag für die geänderte Antwort von `GET /documents` (`mimeType`, `channel`/`status` nullable) und für `DELETE /documents/:id` (409 `DOCUMENT_NOT_DELETABLE`); «Done means» verlangt ihn ausdrücklich |
| C-2 | Major | `src/routes/tenants/[id]/TenantDocumentUpload.svelte:35-58` | Eine Ablehnung des Hochladens (zu gross, falsche Art, gescheiterter Request) bekommt keinen Fokus und wird nicht vorgelesen: `focusFirstError` fehlt, anders als in allen anderen Formularen |
| C-3 | Minor | `backend/src/routes/documents.ts:46`, `backend/src/services/document.service.ts:100-101` | Titel oder Dateiname über 255 Zeichen und ein unbekannter Mieter enden in einem 500 (DB-Fehler) statt in einer codierten Ablehnung; die Oberfläche rät dann «Laden Sie die Datei erneut hoch», was nicht hilft |
| C-4 | Minor | `Dockerfile:51` | `BODY_SIZE_LIMIT=11M` gilt in adapter-node für jede Route, auch für `/auth/*` und Requests ohne Sitzung; das Issue sagt unter «Stop and ask», das zu klären, wenn es andere Endpunkte betrifft. Weder im Plan noch in `docs/design/offene-punkte.md` festgehalten |
| C-5 | Minor | `backend/src/services/document.service.ts:124-130` | `PUT /documents/:id/sent` setzt auch bei einem hochgeladenen Dokument `status = 'sent'`; ein Upload bekäme so einen Versandstatus (entgegen «channel and status NULL for uploads») |
| C-6 | Nit | `backend/src/routes/documents.ts:63-65` | `encodeURIComponent` lässt `'`, `(`, `)`, `*` stehen, die in `filename*` (RFC 5987, attr-char) nicht erlaubt sind; `\` bleibt im Quoted-String der ASCII-Variante unmaskiert |
| C-7 | Nit | `tests/e2e/tasks/tenant-documents.ts:34-39` | Task `uploadDocument` wartet nicht auf den Zustand, zu dem das Hochladen führt (Liste oder Meldung); funktioniert nur, weil stets eine Frage mit Retry folgt (in `accessibility.ts` wird das Warten nachgeholt) |
| C-8 | Nit | `src/routes/tenants/[id]/TenantDocumentsCard.svelte:23-24` | `deleteOpen` startet offen bei `form.deleteError`, `deleting` ist dann aber leer: der Dialog würde « wird endgültig gelöscht» ohne Titel zeigen und `id=''` senden. Über die Oberfläche praktisch nicht erreichbar (Löschen braucht JavaScript), also eher unnötiger Code |
| C-9 | Nit | `src/lib/server/documents.ts:51` | Die `id` aus dem Formular geht ungeprüft und ohne `encodeURIComponent` in die Backend-URL (`../tenants/<id>` würde zu `DELETE /api/v1/tenants/<id>` normalisiert). Nur mit eigener Sitzung und XSRF-Token möglich, daher kein echtes Risiko, aber leicht zu schliessen |

## Blocker/Major

### C-1 (Major): API-Verträge für `GET /documents` und `DELETE /documents/:id` fehlen

Warum falsch: «Done means» von #174: «API contract in `tests/contracts/` for the changed `GET /documents` response and the new endpoints». Neu dazugekommen sind nur `document-uploaded.json` und `document-refused.json` (beide `POST /tenants/:id/documents`). `CLAUDE.md`, Gotchas «API contracts»: «A frontend test that reads a backend response takes it from `tests/contracts/*.json` … (add a contract when there is none) … Changing an API response means updating its contract.» Die Antwort von `GET /documents` hat sich geändert (`mimeType` neu, `channel`/`status` jetzt `null` möglich). Die Frontend-Tests bauen diese Antwort aber von Hand nach: `tenant-detail-page.dom.test.ts:60-71` (`mimeType: 'image/jpeg'`, `channel: null`), `documents.dom.test.ts` (Fixture `letter({ type: 'upload', … })`) und `tenant-documents.test.ts:82` (409-Ablehnung von `DELETE /documents/:id` als Inline-Objekt).

So zeigt es sich: Im Backend `mimeType: documents.mimeType` aus `summary` (`document.service.ts:26`) entfernen oder umbenennen. `api-contracts.pg.test.ts` schlägt nicht an (kein Vertrag), `tenant-documents.pg.test.ts` prüft nur den Header von `/pdf`, die DOM-Tests nutzen ihre eigenen Fixtures. Alle Tests bleiben grün, auf der Mieterseite heisst der Link eines Fotos dann wieder «PDF» (`TenantDocumentRow.svelte:51`, Fallback `?? 'PDF'`).

Korrektur: `tests/contracts/documents.json` (Liste mit einer Mahnung und einem Upload) und `document-not-deletable.json` anlegen, beide in `api-contracts.pg.test.ts` gegen das echte API prüfen und in `tenant-documents.test.ts` bzw. den Seiten-/DOM-Tests aus dem Vertrag lesen; README der Verträge ergänzen.

### C-2 (Major): Ablehnung beim Hochladen ist für Screenreader und Tastatur nicht wahrnehmbar

Warum falsch: Nach «Dokument hochladen» bleibt der Fokus auf dem Knopf. Die Meldung von `Field` (`src/lib/ui/Field.svelte:62-70`) ist kein Live-Bereich und kein `role="alert"`; sie wird nur über `aria-describedby` am Dateifeld verbunden. Das Dateifeld bekommt den Fokus aber nicht. Die anderen Formulare der App lösen das mit `focusFirstError` (`src/lib/ui/focus-error.ts`, eingesetzt z.B. in `src/routes/tenants/TenantForm.svelte:41`, `src/routes/buildings/BuildingForm.svelte:55`; `docs/design/token-referenz.md:63` nennt es als Teil der Formular-Bausteine). Betroffen sind alle drei Ablehnungen, die «Done means» verlangt: zu gross (Prüfung im Browser, `TenantDocumentUpload.svelte:38-40`), falsche Art (Antwort `failure` nach `update`), gescheiterter Request (`result.type === 'error'`, Zeile 46-48). Eine Person mit Screenreader hört nach dem Absenden nichts; sie weiss nicht, dass nichts gespeichert wurde. axe sieht das nicht, deshalb sind die a11y-Zeilen grün.

So zeigt es sich: DOM-Test wie «lehnt eine Datei über 10 MB ab, bevor sie gesendet wird» (`tenant-detail-page.dom.test.ts`) und danach `expect(document.activeElement).toBe(byTestId('tenant-document-file-input'))`: schlägt fehl (`activeElement` ist `body`). Ebenso nach einer `failure`- und einer `error`-Antwort.

Korrektur: In allen drei Zweigen `focusFirstError(uploadForm)` aufrufen (das Dateifeld hat dann `aria-invalid="true"`), mit je einem DOM-Test, der zuerst rot ist.

## Nicht bestätigt

- **Checks des Aufrufers**, vom Aufrufer gemeldet und nicht wiederholt: `bun run lint`, `bun run check`, `bun run test:coverage`, `cd backend && bun run test` und `bun run type-check`, `bun run deepcheck:audit`, `bunx fallow audit`, E2E (chromium+api) der genannten Features, a11y- und Sprachzeilen von tenant-detail, documents, privacy.
- **Selbst wiederholt** (grün, 38 Tests): `bunx vitest run src/__tests__/tenant-documents.test.ts src/__tests__/tenant-detail-page.dom.test.ts src/__tests__/documents.dom.test.ts src/__tests__/documents.test.ts src/__tests__/help-page.dom.test.ts`.
- **C-3** nur aus dem Code abgeleitet (`varchar(255)` in `0001_schema.sql`, kein `maxLength` im Elysia-Schema, kein Abfangen von FK-Fehlern); nicht gegen die Datenbank ausgeführt, um `dwello_test` nicht neben anderen Läufen neu anzulegen.
- **Scenario red** der Szenarien steht im Plan (`implementation_plan.md`, Session 35); dass sie aus dem richtigen Grund rot waren, konnte ich nicht nachvollziehen (kein E2E-Lauf erlaubt).
- **Glossar** (Fachreview F-1, offen beim Product Owner): «Hochgeladenes Dokument» und der erweiterte Begriff «Dokument» stehen noch nicht in `UBIQUITOUS_LANGUAGE.md`; Texte und Schritte verwenden sie schon. Nicht als Befund geführt, weil der Aufrufer es dem Product Owner zugewiesen hat; vor dem Merge unter «Blocked on me».
- **Fachreview F-7** schlägt vor, eine automatische Frist/Löschung nach Mietende als offene Arbeit zu erfassen (Issue `fachlich`, `entscheiden`); im Plan steht dazu nichts. Gehört in die Triage des Aufrufers.
- **Rechtstext**: `privacy_stored_1` (alle vier Sprachen) geändert; ein Fachreview des geänderten Texts im Feature-Review (Workflow 5) steht im Plan noch offen. Übersetzungen fr/it/en nur auf Vollständigkeit und Sie/vous/Lei-Form gelesen, nicht fachlich geprüft.
- **Grösse 10–11 MB ohne JavaScript**: der Weg über die BFF (multipart unter 11 MiB, Base64-JSON von ca. 14 MB ans Backend, Bun-Standardgrenze 128 MB) ist plausibel und durch `tenant-documents.pg.test.ts` am Backend belegt; der Weg durch adapter-node ohne JavaScript ist nicht getestet (bekannte, bewusste Entscheidung).
- **Entfernte Prüfung «active contract» in `deleteTenant`**: Verhalten bleibt gleich (jeder Vertrag sperrt weiterhin), nur der Fehlertext ändert sich; `api-specification.md:83` stimmt weiterhin. Kein Leser des alten Texts gefunden (`grep` in `src`, `backend/src`, `tests`).
