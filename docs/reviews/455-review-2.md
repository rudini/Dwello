# Code-Review #455 (mit #481, #482, #483), Runde 2

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w9-review-455-code-2` (detached, 5ffce594). Bereich: `git diff cd08fd80 5ffce594 -- . ':!docs/reviews' ':!docs/design/personas'` (Commits e3cb329e, 5ffce594). Vorheriger Bericht: `docs/reviews/455-review-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | src/lib/ui/Dialog.svelte:86 | Offen. Der Aufrufer hat es mit Begründung nicht geändert. Die Triage liegt beim Aufrufer. |

Im Delta gibt es keine neuen Befunde.

## Status der IDs aus Runde 1
- **C-1 (Major): behoben.** `grep -n "@wip" tests/e2e/features/invoice*.feature` findet auf 5ffce594 nichts mehr. Alle zwölf Tags sind entfernt (invoices.feature, invoice-detail.feature, invoice-edit.feature, invoice-new.feature). Die zwei Szenarien, die auf der Basis schon aktiv liefen, laufen wieder mit.
- **C-2 (Major): behoben.** Neu ist das Szenario «Der Verteilschlüssel der Rechnungen derselben Kategorie wird vorgeschlagen» (tests/e2e/features/invoices.feature:503-508).
  - Der Seed legt die Rechnung mit «Per Area (m²)» an (tests/e2e/fixtures/backend.ts:100). Der Stand-in ordnet «Elektro Blitz» «Allgemeinstrom» zu (backend/scripts/llm-stub.ts:141).
  - Die Question `proposedKey` gibt den Text der gewählten Option zurück (`Value.chosenIn`, tests/e2e/questions/invoice-upload.ts:56). `sees` fragt mit `expect.poll` nach, bis der Vorschlag kommt.
  - Der Step ruft nur einen Task und eine Question auf. Damit gelten die Screenplay-Schichten.
  - Rot auf der Basis: Laut Aufrufer zeigte die Basis dort «Verteilschlüssel auswählen». Das passt zum Code der Basis: Der Standard-Schlüssel ist leer.
  - Offen bleibt der Hinweis aus Runde 1: Für den Upload-Link vor der Hydration braucht der Pull Request noch `No scenario: <reason>` (siehe «Nicht bestätigt»).
- **C-3 (Minor): offen.** Der Aufrufer hat es nicht geändert und gibt einen Grund an. Dialog.svelte gehört nicht zum Delta.
- **C-4 (Minor): behoben.** In src/lib/ui/FileInput.svelte:50 ist `aria-hidden` weg.
  - Der Knopf ist damit ein zweites `<label for>`. Field.svelte:57 hat ebenfalls ein `<label for>`.
  - Der zugängliche Name verbindet beide Labels. Das Icon bleibt `aria-hidden` (Icon.svelte:19).
  - Der DOM-Test invoice-upload-dialog.dom.test.ts:364 hätte vorher fehlgeschlagen, denn `closest` trifft das Element selbst.
- **C-5 (Minor): behoben.** invoices.test.ts:229-233 prüft zwei Fälle:
  - Die Abrechnungen aus dem Vertrag `invoice-statements.json` werden weitergegeben.
  - Eine Antwort ohne `statements` gibt `[]`.

  Der Test fällt, wenn `statements` in `statementPeriods` fehlt (src/lib/server/invoice.ts:110). Eine gescheiterte Anfrage endet im selben Fall `{}` wie eine Antwort ohne Feld. Einen eigenen Test braucht sie deshalb nicht.
- **C-6 (Minor): behoben.** Es gibt den neuen Vertrag `tests/contracts/invoice-list.json`.
  - backend/src/__tests__/api-contracts.pg.test.ts:132 prüft ihn mit `drift` gegen `GET /invoices`. Dabei vergleicht `drift` das erste Element der Liste.
  - Der DOM-Test baut seine Antwort aus diesem Vertrag (invoice-upload-dialog.dom.test.ts:383).
- **C-7 (Minor): behoben.** Die Glossarzeilen «Akontorechnung» und «Schlussrechnung» (UBIQUITOUS_LANGUAGE.md:81-82) entsprechen wörtlich dem Entscheid «Option C» in #455. Diesen Text hat der Product Owner gegeben. «Abgerechnet (Rechnung)» ist unverändert, wie entschieden.

## Bestätigt (Code und Test)
- **De-Texte gegen #455 «Decided», Wort für Wort.** Das Skript hat die Texte mit dem Body von `gh api repos/rudini/Dwello/issues/455` verglichen. Folgende Texte stimmen genau überein:
  - `invoices_upload_deducted_rule` (Upload-Regel Option C);
  - `invoices_beleg_deducted_rule` (Regel für die Rechnungsseite und «Rechnung bearbeiten»);
  - `invoices_beleg_deducted` («… abgezogen. Der Betrag ist das Total vor dem Abzug.»);
  - der letzte Satz von `invoices_upload_advance_invoice` (V-19);
  - der Anfang von `invoices_delete_billed_text` («Löschen Sie nur falsch erfasste Rechnungen oder Akontorechnungen, die eine Schlussrechnung ersetzt.»);
  - beide Glossarzeilen.

  Unverändert und weiter passend sind `invoices_upload_deducted` und der Satz in `invoices_service_period_years`.
- **Eine Regel für Rechnungsseite und Bearbeiten.** Beide Orte zeigen `DeductedHint` mit `invoices_beleg_deducted_rule`. Der Text «auf ihrer Seite» ersetzt V-14 ausdrücklich, wie der Eintrag zu Option C sagt.
- **Kein Rest der alten Regel.** Ich habe nach «nach der Abrechnungsperiode beginn», «weniger die Akontorechnungen», «erfassen Sie die Schlussrechnung nicht», «ziehen Sie ihren Betrag» und «abgerechneten Akontorechnung» gesucht, in `*.json`, `*.md`, `*.ts`, `*.svelte` und `*.feature` (ohne docs/reviews, docs/archive und personas). Es gibt keinen Treffer.
- **fr/it/en.** Die Regeln und der Satz der Akontorechnung entsprechen dem Abschnitt «Option C» in `docs/reviews/455-fachreview-3.md`. Bei fr weicht nur der Leerraum ab (geschütztes Leerzeichen vor «»/:). Der Löschtext ist in allen vier Sprachen nachgeführt, mit den Begriffen von i18n-begriffe.md:44.
- **Tests der Texte.** Die DOM- und Unit-Tests (invoice-pages.dom.test.ts:368, :868, :1084; invoice-upload-dialog.dom.test.ts:351; invoice-upload.test.ts:111) und die Szenarien (invoice-detail.feature:133-134, invoice-edit.feature:26-27, invoices.feature:113-120, :188) prüfen die neuen Wortlaute. Auf e3cb329e schlagen sie fehl.
- **V-15 (neueste Rechnung mit Schlüssel).** `keyFor` holt 20 Rechnungen und nimmt die erste mit Schlüssel (InvoiceUploadDialog.svelte:58-70).
  - Das Backend sortiert neueste zuerst (backend/src/services/invoice.service.ts:157).
  - Der DOM-Test (invoice-upload-dialog.dom.test.ts:380-403) legt eine neueste Rechnung ohne Schlüssel vor eine mit `k2`. Mit dem alten `limit=1`/`[0]` wäre er rot.
  - Die Grenze von 20 Rechnungen ist im Code als bewusste Vereinfachung vermerkt.
- **Screenplay.** Es gibt neu ein Target (`belegDistributionKey`), eine Question (`proposedKey`, Wert als Text), einen Task (`openBelegOnce`) und einen Step. Der Step ruft nur einen Task und eine Question auf und hat kein `expect`. Das Feature beschreibt, was gilt, nicht wie es bedient wird.
- **Sicherheit.** Es gibt keine neuen Wege. `GET /api/invoices` läuft wie bisher über den Proxy mit Session.
- **Einfachheit (ponytail-review).** Im Delta ist nichts unbenutzt, und es gibt keine Kopie eines bestehenden Helfers. Lean already.
- **Unbeteiligtes.** Im Delta gibt es nichts, das nicht zu #455 gehört. Die Umformatierung in InvoiceFacts.svelte:46-48 betrifft eine Zeile, die diese Änderung selbst hinzugefügt hat.

## Nicht bestätigt
- **Vom Aufrufer gemeldet, nicht selbst wiederholt:**
  - `bun run lint`, `bun run check`, `bunx fallow audit`;
  - vitest von invoice-upload, invoice-upload-dialog, invoice-pages, invoices und i18n;
  - Backend: `api-contracts.pg`, `statement-invoices.pg`, `llm-extraction`;
  - E2E: 110 grün, 38 axe- und Sprachzeilen;
  - Rot der Szenarien auf dem Basis-Build und auf e3cb329e.

  Mein Versuch `bunx vitest run` auf vier Dateien im Worktree bricht ab: `Cannot find package 'vitest'`. Der Worktree hat keine eigenen `node_modules`, und der Zugriff auf `/home/user/Dwello/node_modules` ist gesperrt. Deshalb habe ich auch keinen Backend-Test gestartet.
- **`cd backend && bun run type-check`:** Der Aufrufer meldet für 5ffce594 keinen Lauf.
- **#481 und #483:** Ihr Abschnitt «Decided» nennt noch Option A (#481) und die alte Glossarzeile mit «ohne Akontorechnungen, die schon abgerechnet sind» (#483). Der Eintrag zu Option C in #455 ersetzt beides ausdrücklich. Im Code ist das richtig umgesetzt. Bevor der Pull Request sie mit `Fixes` schliesst, sollten die beiden Issues einen Hinweis auf diesen Ersatz bekommen. Ob das geschehen ist, habe ich nicht geprüft.
- **`No scenario: <reason>` für den Upload-Link vor der Hydration** (Hinweis zu C-2 in Runde 1): Das gehört in den Pull Request und ist noch nicht vorhanden.
- **`bun run llm:eval` vor und nach der Prompt-Änderung:** Der Prompt liegt nicht im Delta. Der Stand aus Runde 1 gilt weiter: Der Pull Request muss Modell und Werte nennen.
