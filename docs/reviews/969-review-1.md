# Code-Review #969, Runde 1 (f4260ca..806fbe4, Worktree /tmp/claude/review-969-code)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `src/lib/server/documents.ts:11-15` | `localTitle` kennt `pdf_before_change` nicht: Mieterdetail und «Dokumente» zeigen den gespeicherten Titel in der Sprache des Mieters, nicht in der UI-Sprache. In fr/it/en steht bei einem deutschsprachigen Mieter «Nebenkostenabrechnung, PDF vor der Änderung». |
| C-2 | Major | `src/routes/statements/[id]/MetadataCard.svelte:74` | `kept = delivery ? [] : pdfBeforeChange`: Nach «Erneut per Brief zustellen» (V-3) gibt es ein Dokument `statement`. Der Verlauf bietet die eben abgelegte Kopie dann nicht mehr an. Laut Entscheid nennt der Verlauf sie aber. Kein Test deckt diesen Weg in der UI. |
| C-3 | Major | `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` (nicht geändert) | Die neuen Varianten fehlen in allen drei Dateien: der Verlauf mit den Links «PDF vor der Änderung herunterladen» und dem Hilfesatz, der Hinweis `statements_pdf_before_change_in_history` und die Dokumentzeile ohne Versandstatus. |
| C-4 | Minor | `backend/src/services/document.service.ts:186` | `markDocumentSent` (über `markDocumentPosted`, `PUT /documents/:id/sent`) schliesst nur `upload` aus. Eine Kopie lässt sich über die API als versendet markieren. Danach zählt `sendingsOf` sie als Versand (`status === 'sent'`), und die Zeile zeigt «Versendet». Die UI bietet das nicht an. |
| C-5 | Minor | `backend/src/services/statement-send.service.ts:145` | Das Zurückrollen der Kopie, wenn das PDF beim erneuten Zustellen nicht entsteht, hat keinen Test. Der Test «lässt die Abrechnung unverändert …» (`statement-mail.pg.test.ts:339`) versendet mit Dokument, also entsteht dort keine Kopie. |
| C-6 | Minor | `backend/src/__tests__/statement-carry-over.pg.test.ts:477` | Der Test «legt bei einer Abrechnung mit Dokument des Versands keine Kopie ab» ist auch auf dem Basis-Commit grün. Keine Commit-Nachricht nennt ihn als Test, der bestehendes Verhalten festhält (CLAUDE.md, Workflow 2). |
| C-7 | Minor | `backend/src/services/delivery.ts:47` | `reuse:` Die Bereinigung des Dateinamens kopiert `fileNameOf` (`statement-send.service.ts:70`). |
| C-8 | Minor | `backend/src/services/delivery.ts:11-21` | Die neue Funktion steht zwischen dem Kommentar zu `sinceDelivery` (#534 M-1) und `sinceDelivery`. Der Kommentar steht jetzt über `keepPdfBeforeChange` und beschreibt sie falsch. |
| C-9 | Minor | `docs/api-specification.md:293,299`, `docs/data-model.md:414`, `backend/src/db/schema.ts:605-606` | Die Dokumentation fehlt: `pdfBeforeChange` ist in `GET /statements/:id` nicht beschrieben, die Ablage vor dem Verwerfen bei `PUT` auch nicht. Die Liste der Dokumenttypen nennt `pdf_before_change` nicht. «null for an upload» stimmt nicht mehr. |

## C-1 (Major): Titel der Kopie nicht in der UI-Sprache

`loadDocuments` ersetzt den Titel durch `localTitle`. Diese Funktion kennt `reminder`, `statement` und `new_pdf` und nimmt sonst `document.title`. Den Titel schreibt `keepPdfBeforeChange` in der Sprache des Mieters (`pdfBeforeChangeTitle(statement.language)`). `TenantDocumentRow.svelte` und `DocumentItem.svelte` zeigen also bei UI fr/it/en mit einem deutschsprachigen Mieter einen deutschen Text. Damit sind die Regel «jeder UI-Text in vier Sprachen» und die Prüfung «fr/it/en zeigen kein Deutsch» verletzt.

So zeigt man den Fehler: ein DOM-Test von `localTitle` bzw. `loadDocuments` mit `type: 'pdf_before_change'`, `title: 'Nebenkostenabrechnung, PDF vor der Änderung'` und Sprache `fr` erwartet «Décompte des charges, PDF avant la modification». Heute kommt der deutsche Titel zurück. Fix: ein Eintrag `pdf_before_change` mit einem `documents_*`-Key in allen vier `messages/*.json`, die Texte aus der Fachreview-Tabelle (`pdfBeforeChangeTitle`).

## C-2 (Major): Nach dem erneuten Zustellen verschwindet die Kopie aus dem Verlauf

`redeliverByLetter` legt die Kopie ab (Zeile 141) und dann über `storeLetter` ein Dokument `statement`, per Brief, versendet. `+page.server.ts:44` macht daraus `delivery`. `MetadataCard` setzt deshalb `kept = []`. Der Link «PDF vor der Änderung herunterladen» und der Hilfesatz fehlen. Die Kopie liegt dann nur noch unter «Dokumente». Gerade an der Abrechnung soll der Verwalter sie laut Entscheid A im Verlauf finden. V-3 schreibt die Ablage für genau diesen Weg vor. Der pg-Test `statement-mail.pg.test.ts:298` prüft nur das Dokument.

So zeigt man den Fehler: ein DOM-Test mit `delivery: { channel: 'letter', … }` und `pdfBeforeChange: [{ id: 'kept-1', … }]` erwartet `statement-history-pdf-before-change`. Heute fehlt der Link. Wie sich die Verlaufszeilen in diesem Fall ordnen («PDF erstellt» nimmt heute `delivery.sentAt`), muss mit dem Fix entschieden werden. Steht das nicht in V-2, braucht es einen Fachentscheid.

## C-3 (Major): Neue Bildschirmzustände fehlen in a11y und Sprachen

CLAUDE.md, «Process»: Jede Variante mit eigenen Bedienelementen kommt nach `tests/a11y/screens.json` (mit `stateMeanings`), nach `accessibility.feature` und nach `sprachen-bildschirme.feature`. Der Diff berührt keine dieser Dateien. Neu sind der Verlauf ohne Dokument des Versands mit den Kopie-Buttons (einer oder mehrere, mit Datum) und dem Hilfesatz, der else-Zweig im Hinweis `statement-pdf-changed` (`+page.svelte:215-218`) und die Dokumentzeilen ohne Badge. Die Sprachprüfung hätte C-1 gefunden.

So zeigt man den Fehler: `grep -n "pdf-before-change\|before_change" tests/a11y/screens.json tests/e2e/features/accessibility.feature tests/e2e/features/sprachen-bildschirme.feature` findet nichts.

## Nicht bestätigt

- Diese Prüfungen hat nur der Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness` (0 Zyklen), pg statement-carry-over (60), statement-mail, tenant-export (11), drei DOM-Dateien (266; jeder neue Test ohne seinen Code rot), open-work, E2E chromium statement-detail + documents + tenant-detail + statement-redeliver (140 grün; neues Szenario als @wip am fehlenden Link rot).
- #966 `toldDeadline`: Die Funktion ist auf diesem Stand nicht vorhanden (Basis ohne PR #992). Ob sie `pdf_before_change` übergeht, ist nicht geprüft. Für den Merge mit #992 bleibt das offen.
- `POST /statements/:id/generate-pdf` überschreibt das PDF einer Abrechnung, die kein Entwurf ist, ohne eine Kopie abzulegen. Erreichbar ist das nur über die API, denn die UI bietet den Knopf nur ohne PDF an (Fachreview «Nicht bestätigt»). Ich habe es nicht weiter verfolgt.
- `keepPdfBeforeChange` läuft in `updateStatement` ausserhalb einer Transaktion vor dem Update. Schlägt das Update fehl, bleibt die Kopie trotzdem liegen. Einen Weg, der so fehlschlägt, habe ich nicht gefunden.

Geprüft: Zählungen und SQL zu Dokumenten mit `status` null und Typ `pdf_before_change`, nämlich `to_send`-Zählung/Übersicht/Dashboard (nur `status = 'to_send'`), Mahnstufen (`statement.service.ts:66-84`, nur `reminder`), `notToSend` (nur `reminder`/`new_pdf`), `sinceDelivery` und `keepNewPdf` (nur `statement`), `deleteDocument` und das Löschen eines Mieters (nur `upload`), `/documents/:id/pdf` (jeder Typ). Keines behandelt die Kopie falsch, ausser C-4. Ausserdem: `sendingsOf` (Kopie nicht im `sent`-Filter; Reihenfolge nach `createdAt` aufsteigend), Export (`asc` + `reverse` ergibt die erste Kopie), Rücksetzen der Zahlung nur bei `paidPdf`, Entwurf ausgenommen, Vertrag `statement.json`, Texte in vier Sprachen wie in der Fachreview, Szenario ohne `@wip` und rot ohne Link, Screenplay-Schichten, Marker #994.
