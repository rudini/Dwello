# Code-Review 2 (Delta): Dokumente zu einem Mieter hochladen (#174)

Geprüft: Worktree `review-upload-code-2` (Commit `80445d4`), Delta `622052b..80445d4` (ein Commit, `fix(tenants): apply upload review round 1`). Grundlage: Runde 1 (`docs/reviews/upload-review-1.md`), Triage im Plan (Session 37), Persona-Berichte `docs/design/personas/*-upload174.md`, `docs/reviews/upload-fachreview-2.md`, `CLAUDE.md`. Alle 34 geänderten Dateien gelesen (Persona- und Fachberichte auf ihre Befundtabellen hin, da sie nur Eingabe der Korrekturen sind).

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | behoben | `tests/contracts/documents.json`, `document-not-deletable.json`; geprüft in `backend/src/__tests__/api-contracts.pg.test.ts:171-189`; gelesen in `tenant-detail-page.dom.test.ts:62`, `documents.dom.test.ts:75`, `tenant-documents.test.ts:83`. Fehlt `mimeType` in der Antwort, meldet `drift` jetzt `.data[0].mimeType: fehlt` |
| C-2 | Major | behoben | `TenantDocumentUpload.svelte:49,60` ruft `focusFirstError` in allen drei Zweigen (zu gross, `failure`, `error`); DOM-Tests prüfen `activeElement` für zu gross und gescheiterten Request (`tenant-detail-page.dom.test.ts:200,246`) |
| C-3 | Minor | behoben | `document.service.ts:101-104` (`DOCUMENT_TITLE_TOO_LONG {max}`, Dateiname vorne gekürzt, `TENANT_NOT_FOUND` 404); `tenant-documents.pg.test.ts:126-140`; Meldungen in allen vier Sprachen, `backend-codes.test.ts` grün. Rest siehe C-10 |
| C-4 | Minor | offene Arbeit | O-17 in `docs/design/offene-punkte.md`, Inhalt deckt den Befund |
| C-5 | Minor | behoben | `markDocumentSent` mit `ne(documents.type, 'upload')`, Route 404; `tenant-documents.pg.test.ts:119-123` |
| C-6 | Nit | behoben | `documents.ts:61-63` maskiert `'()*` (die einzigen Zeichen, die `encodeURIComponent` stehen lässt und attr-char nicht erlaubt) und `\`; Test `tenant-documents.pg.test.ts:142-147` |
| C-7 | Nit | abgelehnt, Begründung angenommen | Jede Upload-Aktion wird von einer wiederholten Frage gefolgt |
| C-8 | Nit | behoben | `deleteOpen` startet `false` (`TenantDocumentsCard.svelte:24`) |
| C-9 | Nit | behoben (ohne Test, siehe C-11) | `src/lib/server/documents.ts:51` |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-10 | Minor | `src/routes/tenants/[id]/TenantDocumentUpload.svelte:74`, `:89-96` | Die neue Ablehnung `DOCUMENT_TITLE_TOO_LONG` erscheint am Feld «Datei», das als ungültig markiert wird und den Fokus bekommt; das Feld «Titel», um das es geht, bleibt unmarkiert. Kein `maxlength` am Titel, das die Ablehnung im Browser verhindern würde |
| C-11 | Nit | `src/__tests__/tenant-documents.test.ts:77-81` | Die Kodierung der `id` (C-9) hat keinen Test (die Tests senden nur `d1`); der Plan sagt «each with a test shown red first» |
| C-12 | Nit | `backend/src/services/document.service.ts:104` | `fileName.slice(-255)` schneidet in UTF-16-Einheiten und kann ein Surrogatpaar (Emoji im Namen) halbieren; der gespeicherte Name beginnt dann mit U+FFFD |
| C-13 | Minor | `implementation_plan.md:38` | Plan-Notizen der Korrektur-Slice unvollständig: keine `Skills:`-Zeile für diese Slice, und kein `Test red:` für die neuen Tests «bietet jede Datei mit einem Knopf …», «sagt bei einem Mieter mit Mietverträgen …», «verspricht unter «Zu versenden» nur Briefe», «kodiert den Dateinamen … RFC 5987», den neuen Vertragstest und den Fokus nach dem Hochladen und Löschen |
| C-14 | Nit | `messages/en.json:1328` | «This tenant no longer exists. It was probably deleted …»: «It» für eine Person; besser «They were probably deleted» oder «The tenant was probably deleted» |

Keine Blocker, keine Major.

Zur Prüfung festgehalten, ohne Befund:
- Fokus nach dem Löschen: `ActionDialog` ruft nach `update()` `open = false; onsuccess()`; der Fokus-Cleanup von `Dialog` (zurück zum Opener) läuft im `tick()` vor `list?.focus()` und trifft einen schon entfernten Knopf, also gewinnt die Liste (`TenantDocumentsCard.svelte:65-70`). Der DOM-Test zeigt das.
- Download als `Button` mit `href`: ein `<a>` mit 48 px, `aria-label` beginnt mit dem sichtbaren Text (Label-in-Name); E2E-Target `documents.ts:21` nutzt nur die Testid.
- Der Leerzustand unter «Zu versenden» (`documents/+page.svelte:31-36`) und der Löschdialog bei Mietverträgen und Uploads (`tenants/[id]/+page.svelte:21,80-83`) haben DOM-Tests; Texte in allen vier Sprachen. Der Dialog und `/documents?status=to_send` sind bestehende Bildschirmzustände, kein neuer Eintrag in `screens.json` nötig.
- Geänderte Texte im Feature (`tenant-documents.feature:47,54`) folgen nur den geänderten Meldungen; keine neue Strenge oder weggefallene Prüfung.

## Nicht bestätigt

- **Checks des Aufrufers**, vom Aufrufer gemeldet und nicht wiederholt: `bun run lint`, `bun run check`, `bun run test:coverage` (2367 Tests), Backend-Test (569, 91,9 %) und `type-check`, `deepcheck:audit`, `fallow audit`, E2E chromium+api der genannten Features (49), a11y- und Sprachzeilen (20).
- **Selbst wiederholt**, grün: `bunx vitest run` mit `tenant-documents.test.ts`, `tenant-detail-page.dom.test.ts`, `documents.dom.test.ts`, `help-page.dom.test.ts`, `backend-codes.test.ts` (39 Tests); `bun test src/__tests__/tenant-documents.pg.test.ts src/__tests__/api-contracts.pg.test.ts` im Backend (29 Tests).
- **Rot vor der Korrektur**: dass die neuen Tests vor dem Code rot waren, steht nur teilweise im Plan (siehe C-13); nicht nachvollzogen.
- **Vertragstest `documents.json`**: `drift` vergleicht nur das erste Listenelement, und die später eingefügte Mahnung steht zuerst (neueste zuerst). Der Upload-Beispieldatensatz wird also gegen die Mahnung geprüft. Weil beide dieselben Felder haben und `null` nicht geprüft wird, erkennt der Test trotzdem ein fehlendes Feld; ein Upload-spezifischer Typfehler bliebe unbemerkt. Kein Befund, nur Grenze der Prüfung.
- **Fokus im echten Browser** (Screenreader-Ansage nach dem Fokus auf das Dateifeld, Sichtbarkeit des Fokus auf der Liste mit `tabindex="-1"`): nur im DOM-Test (jsdom) geprüft, kein E2E/Persona-Lauf erlaubt.
- **Glossar F-1** (Product Owner) bleibt offen, nicht Teil dieses Reviews.
