# Code-Review #999, Slice 999b, Runde 1

Worktree `/tmp/scratchpad/review-999b-code-reviewer` (db8696d), Bereich `96b70b3..db8696d^1` ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`, `docs/design/personas`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/routes/statements/[id]/MetadataCard.svelte:102-108` | Der Fix von 999-1 C-3 ändert einen entschiedenen Text. #999, «Decided» vom 01.11.2026, M-1, legt für die Schlusszahlung nach Teilzahlungen «Zahlung über {amount}» fest. Bei einer Rückerstattung steht dort jetzt «Zurückerstattet: …». Dafür gibt es weder einen Entscheid des Product Owners noch eine Runde von `fach-reviewer` |
| C-2 | Major | `src/routes/statements/[id]/MetadataCard.svelte:104`, `tests/e2e/features/statement-detail.feature` | Die neue Verlaufszeile der Schlusszahlung einer Rückerstattung sieht der Benutzer. Es gibt aber kein Szenario dafür und in 7c9cf72 kein `No scenario: <reason>`. Abgedeckt ist sie nur durch den DOM-Test `statement-pages.dom.test.ts:2350` |
| C-3 | Minor | `backend/src/services/statement.service.ts:816`, `tests/contracts/statement-payment-reset.json:38`, `tests/contracts/statement.json:85` | Die API liefert in `payments[]` neu das Feld `recordedAt`, die Verträge zeigen es nicht. CLAUDE.md, Gotchas: «Changing an API response means updating its contract». `drift` meldet keine zusätzlichen Felder, darum bleibt der Vertragstest trotzdem grün |
| C-4 | Minor | `tests/e2e/features/statement-detail.feature:315-327` | Laut Kommentar soll das Szenario «Seitenkopf … auf dem Handy» zeigen, dass vier Aktionen auf 390 px passen. Es prüft aber nicht, dass Mahnung und «Zahlung zurücksetzen» überhaupt angezeigt werden. Fehlt eine davon (`StatusActions.svelte:32`, `owes`/`waiting`), bleibt es grün und prüft weniger, als es sagt |

## C-1 (Major)

Warum: `gh api repos/rudini/Dwello/issues/999` zeigt unter «Decided (product owner)», 01.11.2026, M-1: «the Verlauf also names the final payment with its amount («Zahlung über {amount}»), only when part payments before it are recorded». Diese Regel macht keine Ausnahme für Rückerstattungen. Vor 7c9cf72 entsprach der Code ihr wörtlich. Jetzt hat `refund` Vorrang vor `paidOn && index === payments.length - 1`. Die Schlusszahlung einer Rückerstattung heisst damit `statements_history_part_refund` «Zurückerstattet: …».

Das frühere Review 999-1 C-3 hält selbst fest, dass weder die Fachreview noch #999 diesen Fall entschieden hat. Antwort 4 der Fachreview ist eine Empfehlung für die Teilzahlungen («Teilzahlung über» liest sich als Eingang), kein Entscheid über die Schlusszahlung. CLAUDE.md, «When to ask» und «Coding guidelines», sagt dazu: «any other change to a decided text or value is mine».

So zeigt es sich: Man vergleicht #999 Z. 10 mit dem neuen DOM-Test `statement-pages.dom.test.ts:2359`. Der Test erwartet `Zurückerstattet: CHF 70.00 05.02.2025` statt `Zahlung über CHF 70.00 05.02.2025`.

Abhilfe: Den Fall im Entscheid von #999 festhalten lassen und bis dahin unter «Blocked on me» führen. Wenn der Product Owner nichts ändern will, die Änderung von C-3 zurücknehmen und den Befund 999-1 C-3 als offenen Punkt behandeln.

## C-2 (Major)

Warum: CLAUDE.md, Workflow 1, verlangt für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario ohne `@wip` oder ein `No scenario: <reason>`. Ein Grund nach `tests/e2e/CLAUDE.md`, «No scenario», ist nicht genannt. Dass der E2E-Stack keine Rückerstattung bilden kann, die in Teilen bezahlt ist, ist nicht belegt: Die Schritte für einen negativen Saldo und für Teilzahlungen gibt es schon. Antwort 4 der Fachreview («ein Szenario braucht es nicht») hebt die Regel aus CLAUDE.md nicht auf.

So zeigt es sich: Man nimmt in `MetadataCard.svelte` den Zweig `refund ?` für die letzte Zeile wieder heraus. Alle Szenarien bleiben grün, nur der DOM-Test wird rot.

Abhilfe: Ein Szenario zum Verlauf einer Rückerstattung, die in Teilen bezahlt ist (nach dem Entscheid zu C-1). Oder ein `No scenario: <reason>` mit einem tragfähigen Grund im Pull Request.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend `type-check`. Die Backend-Tests statement-lock, api-contracts, audit-log, statement-carry-over, reminders (251), data-export und dashboard* (36). `vitest --changed origin/main` (922). Die Regeltests mit audit-log-page, statement-part-payment und statement-actions (1138). E2E chromium statement-detail (133) und audit-log. Die Axe- und Sprachzeilen statement-part-paid-detail und statement-paid-detail (12). Prettier auf den neuen Dateien.
- Das Rot habe ich nur durch Lesen beurteilt:
  - Der pg-Test `statement-lock.pg.test.ts:296` ist ohne 769886b rot, weil `paymentRecordedAt` nach dem ersten Zurücksetzen `null` ist und `pdfBlob` deshalb bleibt.
  - Das Szenario «Nach dem Zurücksetzen aller Teilzahlungen …» scheitert ohne den Fix am Schritt «das PDF der Abrechnung erstellt»: Weil `pdfGeneratedAt` bleibt, zeigt `PdfAction.svelte` nur «Herunterladen». Das ist ein Scheitern am fehlenden Verhalten.
  - Der Protokollschritt (`statement-detail.steps.ts:507`) sucht den Text exakt (`audit-log.ts:6`). Mit `audit_payment_reset` statt `audit_payment_reset_amount` wird er rot.
  - Den DOM-Test zu 999-1 C-3 macht der alte Code rot («Zahlung über CHF 70.00»).
- `Spec change approved: #999`: Der Entscheid in #999 (Z. 9) genehmigt die Spec-Änderung des Szenarios «Zahlung zurücksetzen» allgemein. Die neuen Protokollzeilen prüfen strenger als vorher. Den Text des Pull Requests gibt es noch nicht.
- C-2 aus 999-1 (`openAmount`): Kein Test zeigt einen Unterschied. `openAmount` gibt den Betrag ohne Vorzeichen zurück (`src/lib/statement.ts:58`), die Anzeige bei Rückerstattungen bleibt also gleich.

Hinweise des Implementierers und Persona:
- Eine Teilzahlung von vor #999 hat kein `recordedAt` und behält die Zeit der zurückgesetzten Zahlung: in Ordnung. Ein anderer Zeitpunkt ist nicht bekannt. Der Fehler bleibt nur für ein PDF, das zwischen zwei solchen alten Zahlungen erstellt wurde, und der Kommentar sagt das. Ungenau ist dagegen `docs/data-model.md:323` («sets payment_recorded_at to the recordedAt of the payment that stays»): Den Fall ohne `recordedAt` nennt die Zeile nicht.
- `Payment.recordedAt?` im JSONB ohne Migration: in Ordnung. Das Feld ist optional, und `data-export.service.ts:539` sowie `src/lib/server/statement.ts:142` übernehmen nur `date` und `amount`. Weder im Export noch im Client kommt `recordedAt` an.
- P-1/D-2 (Reihenfolge im Verlauf) offen lassen: Die Begründung trägt nur noch zur Hälfte. Seit 769886b haben Zahlungen eine Zeit, ein Zurücksetzen hat aber nur `resetOn` (Tag). Eine richtige Reihenfolge bräuchte also zusätzlich eine Zeit je Zurücksetzen. Als Minor darf D-2 im Bericht bleiben.

Geprüft: der D-1-Fix in `recordPayment` und `resetPayment` mit beiden Pfaden (gespeichertes PDF und neues PDF «Zu versenden»), 999-1 C-4, die Screenplay-Schichten der neuen Schritte, keine neuen Texte und Bildschirme.
