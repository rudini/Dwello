# Code-Review 524-1: Das versendete PDF bleibt im Verlauf (#524)

Bereich: `git diff c086727 e37e361 -- . ':!docs/reviews'` im Worktree `/tmp/claude/main-review-524-cr` (e37e361).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `src/routes/statements/[id]/+page.svelte:146-151` | `pdfChanged` ist ein Objektliteral mit Prototyp: `?pdf-change=toString` oder `?pdf-change=constructor` findet `Object.prototype.toString` bzw. `Object`, und der Hinweis zeigt «[object Undefined]» bzw. «[object Object]» als Titel. Der Kommentar «anything else shows nothing» stimmt also nicht. Abhilfe: `Object.hasOwn(pdfChanged, data.pdfChange)` prüfen oder `Object.create(null)` verwenden. |
| C-2 | Minor | `backend/src/services/statement.service.ts:682-686` | `pdfChangeOf` vergleicht mit dem Wert vor diesem Speichern, nicht mit dem Wert beim Versand. Fachreview V-5 nennt diesen Fall ausdrücklich. Wer nach dem Versand eine Bemerkung oder Zahlungsfrist wieder auf den versendeten Wert zurücksetzt, bekommt «Die neue Bemerkung steht nur im neuen PDF» bzw. «… die bisherige Zahlungsfrist», obwohl das versendete PDF genau diesen Wert zeigt. Ebenso meldet das Löschen der Bemerkung «Die neue Bemerkung …, Soll der Mieter sie lesen», obwohl es keine neue Bemerkung gibt. Ein Test deckt beide Fälle nicht ab. |
| C-3 | Minor | `src/routes/statements/[id]/+page.svelte:208-212` | Der Hinweis hängt an `?pdf-change=` in der URL. Nach «PDF erstellen» (`generatePdf`, clientseitig, ohne Navigation) und nach jedem Neuladen sagt er weiter «erstellen Sie das neue PDF», auch wenn der Verlauf schon «Neues PDF erstellt» zeigt. V-2 will einen Hinweis nur nach dem Speichern. Szenario 1 erstellt das PDF, prüft danach aber nicht, ob der Hinweis noch steht. |
| C-4 | Minor | `src/routes/statements/[id]/edit/+page.server.ts:36-37` | Die neue Weiterleitung mit `?pdf-change=` hat keinen Test auf der untersten Ebene. `statement-edit-actions.test.ts` prüft nur `location: '/statements/s1'` mit der Antwort `{}`. Auch dass `load` `pdfChange` aus der URL liest (`+page.server.ts:46`), prüft kein Unit-Test. Das neue `tests/contracts/statement-updated.json` liest kein Frontend-Test (Gotcha «API contracts»). Die Kette ist nur über E2E belegt. |
| C-5 | Minor | `src/routes/statements/[id]/MetadataCard.svelte:84-86` | «Versendetes PDF herunterladen» ist ein eigenständiger Link unter der `dl` (`text-ink underline`), keine `Button href` aus `src/lib/ui`, und damit unter 48 px hoch (Design-Regeln «controls at least 48 px high»). Der Download des aktuellen PDF in `PdfAction.svelte:30` nutzt `Button href`. |
| C-6 | Minor | `docs/api-specification.md:298` (nicht geändert) | `PUT /statements/:id` liefert neu `pdfChange` (`notes`, `deadline`, `refund_by` oder `null`). Die Zeile beschreibt die Antwort weiter nur als «→ statement». |

Keine Blocker, keine Major.

Ponytail-Review: nichts zu kürzen, der Diff ist bereits schlank. Netto: 0 Zeilen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: backend type-check; `bun test statement.routes.pg.test.ts api-contracts.pg.test.ts` (112 pass, neuer Route-Test zuerst rot); `bun run lint`; `bun run check`; `bun run fitness`; `bunx vitest run --changed origin/main` (727 pass, die zwei neuen DOM-Tests zuerst rot); E2E Chromium statement-detail.feature und statement-edit.feature `-g "PDF|Bemerkung|Zahlungsfrist|Verlauf|versenden"` (48 pass); die neuen Szenarien `--repeat-each=4` (8 pass); axe und Sprache `statement-reminded-detail pdf-changed` (2 pass).
- Ob die neuen Szenarien rot waren: Ich habe es nur durch Lesen beurteilt. Auf c086727 fehlen der Link `statement-history-sent-pdf`, der Hinweis `statement-pdf-changed` und die Zeile «Neues PDF erstellt`, also schlägt jedes der drei Szenarien an einem Then fehl. Die Route-, Vertrags- und DOM-Tests scheitern auf der Basis an `pdfChange` bzw. am fehlenden Link oder Hinweis.
- Ob die Ausgaben von `sees(...)` mehrzeilig sind: Ich habe es nicht ausgeführt. `nennt der Verlauf nach dem Versand ein neues PDF` prüft mit `/Versendet.*Neues PDF erstellt/`, und `.` trifft keinen Zeilenumbruch. Laut Aufrufer läuft der Schritt grün.
- Issue #965: per REST geprüft, offen, Labels `domain` und `needs-decision`. #966 habe ich nicht geprüft.
- `sendStatement` (`tests/e2e/tasks/statement-detail.ts:56`) wartet nicht auf den Status, das bestand schon vorher. Die neuen Szenarien umgehen es mit dem Schritt `hat die Abrechnung den Status "Versendet"`. Die Task ist nicht Teil des Diffs.

Geprüft: alle 24 geänderten Dateien; die Texte in allen vier `messages/*.json`; screens.json mit `stateMeanings` sowie accessibility.feature und sprachen-bildschirme.feature; die Screenplay-Schichten (Steps rufen nur Tasks und Questions auf); Negativprüfungen mit Anker (`paymentSummary`, PDF-Parser); Reihenfolge von `pdfGeneratedAt` und `sentAt` beim Versand per E-Mail und per Brief (PDF vor dem Dokument, also kein falsches «Neues PDF erstellt»); V-1 (bei Frist und Bemerkung gilt die Fassung zur Frist), V-3, V-4, V-6, V-7 und M-1; keine geänderten Szenarien ohne `@wip`; nichts ausserhalb der Anforderung.
