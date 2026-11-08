# Code-Review 686-1 (Slice #686, Runde 1), Bereich 8b39f96..8671329

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/statements/[id]/+page.server.ts:35-40` | Die neue Funktion `paymentDeadlineDays` liest `data.payment_deadline_days` direkt aus der Antwort von `/api/v1/config`. Für diese Antwort gibt es schon den Mapper `toSettings` in `src/lib/server/settings.ts:36` (Feld `paymentDeadlineDays`), den `config/+page.server.ts` verwendet. CLAUDE.md, «One mapper per response»: Die zweite Ladefunktion soll den vorhandenen Mapper verwenden und das Feld nicht selbst lesen (ponytail `reuse:`). |
| C-2 | Minor | `src/routes/statements/[id]/PdfAction.svelte:50-54` | `generating = false` steht vor `await update()`. Während die Abrechnung neu lädt, ist «PDF erstellen» wieder aktiv, ohne Busy-Anzeige und ohne Toast. Ein zweiter Klick sendet `?/generatePdf` noch einmal. Die übrigen Formulare der Seite beenden den Busy-Zustand erst nach `update()` (`Correction.svelte:108-111`, `SendDialog.svelte:70-73`). |
| C-3 | Minor | `backend/src/__tests__/statement-pdf-render.test.ts:952-953` | Der Kommentar sagt, der Wortlaut warte noch auf fach-reviewer (`docs/reviews/686-wording.md`). Das stimmt nicht mehr: Der Wortlaut ist durch `docs/reviews/686-1-fach-review.md` freigegeben und in 8671329 übernommen. |
| C-4 | Minor | `src/routes/statements/[id]/+page.server.ts:36-39`, `PaymentPanel.svelte:85` | Kein Test deckt den Fall «die Einstellungen laden nicht» ab: fetch schlägt fehl, `!ok`, ein Wert ≤ 0 oder ein nicht numerischer Wert. Kein Test zeigt auch, dass ein Entwurf ohne `deadlineDays` keinen Hilfetext zeigt. Der Lade-Test (`statement-actions.test.ts:319-336`) prüft nur den Erfolgsfall mit 45, der DOM-Test (`statement-pages.dom.test.ts:1671-1686`) nur «Entwurf mit 45 Tagen» und «versendet». |

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet; ich habe keinen davon ausgeführt: `statement-detail.feature` (135), a11y- und Sprachzeilen (12), PDF-pg- und Render-Tests (236), `vitest --changed` (952), lint, check, backend type-check, fitness, fallow, Prettier.
- Die Rot-Läufe habe ich nur durch Lesen beurteilt. DOM-Test Schritt 2: der alte Pfad `/invoices` liefert 4, der neue 3. Neue BFF-Route und neue Action: die Imports fehlen ohne die Änderung. Formular-Test: ohne die Änderung gibt es kein `form`. Szenario Schritt 2: die Rechnung ist vom 15.01.2025, die alte Zählung nach Datum ergibt für 2024 also 0. Hilfetext: ohne die Änderung gibt es keine Testid. Gesehen habe ich die Rot-Läufe nicht.
- «PDF erstellen» ohne JavaScript (der eigentliche Fehler O-2): kein Szenario. Die Begründung «No scenario» in fac7f62 stimmt: `tests/e2e/screenplay/interactions.ts:13` wartet auf `body[data-hydrated]`. Den nativen POST-Pfad (Neuladen der Seite, Fehler im Banner `form-error` in `+page.svelte:230`) zeigt nur der Code, kein Test.
- Zeilennummern des Spec-Change: Im HEAD stehen die beiden geänderten Zeilen auf `statement-detail.feature:656` und `:870`. Der Aufrufer, der Commit-Text und der Fachreview nennen 657 und 871. Inhaltlich sind es dieselben Zeilen.
- `Spec change approved: #686` im Pull-Request-Text: Einen Pull Request gibt es noch nicht. Die Angabe steht bisher nur im Commit-Text von 8671329.

Geprüft:
- Spec-Change: Ausser den beiden genehmigten Zeilen ändert sich keine Zeile eines Szenarios ohne `@wip`. Die neuen Szenarien sind frei. `invoicesCannotBeCounted` folgt nur der verschobenen Route; die Prüfung von #738 bleibt gleich streng.
- Schritt 2 zählt `for-statement` mit derselben Filterung wie die Vorschau (`isValidUtilityCost`). Ein Fehler des Backends wird über `call` zu 500, Schritt 2 sagt dann, dass die Zählung fehlschlug (#738).
- Form-Action `generatePdf`: XSRF/CSRF und BFF folgen dem Muster der übrigen Actions. Ablehnungen werden wie bisher übersetzt (`PDF_FAILED`, `backendMessage`), es gibt keinen Redirect. Der Download-Link mit `list` zur Seite `/documents/refused` ist unverändert. Der alte Proxy hat keinen Nutzer mehr, `docs/api-specification.md` ist nachgeführt.
- Zusätzlicher Config-Request: Er läuft parallel zu den anderen Requests, ein Fehler zeigt nur keinen Hilfetext.
- `ratchet.json`: Der Eintrag in `display` ist legitim. Die Bedingung prüft nur den Statuswert, wie die bestehenden `status === 'draft'`-Einträge, und die Meldung von fitness (`tools/fitness/fitness.ts:75`) schreibt diesen Weg selbst vor. Die Fachregel (`datedToday`) bleibt im Backend. Das ist kein Umgehen des Gates.
- Weiter geprüft: Wortlaut aller vier Sprachen gleich wie im Fachreview (inkl. U+00A0), alle vier `messages/*.json`, Contract `invoices-for-statement.json` mit pg-Test, Screenplay-Schichten, `statement-detail default` (ein Entwurf) in a11y und Sprachen, Tokens, keine fremden Änderungen.
