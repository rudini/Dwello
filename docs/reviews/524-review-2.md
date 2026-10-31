# Code-Review 524-2: Das versendete PDF bleibt im Verlauf (#524), Abschlussrunde

Bereich: `git diff e37e361 d4bff5c -- . ':!docs/reviews' ':!docs/design/personas'` im Worktree `/tmp/claude/main-review-524-cr2` (d4bff5c). Vorheriger Bericht: `docs/reviews/524-review-1.md`.

Geschlossen: C-1, C-5, C-6.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | `backend/src/services/statement.service.ts:682-686` | Bleibt offen und ist im Delta unverändert. `pdfChangeOf` vergleicht mit dem Wert vor diesem Speichern, nicht mit dem Wert beim Versand. |
| C-3 | Minor | `src/routes/statements/[id]/+page.svelte:210-214` | Bleibt offen und ist im Delta unverändert. Der Hinweis hängt an `?pdf-change=` und bleibt nach «PDF erstellen» und nach dem Neuladen stehen. Persona P-1 ist als #968 erfasst (offen, `needs-decision`). |
| C-4 | Minor | `src/routes/statements/[id]/edit/+page.server.ts:36-37` | Bleibt offen und ist im Delta unverändert. Die Weiterleitung mit `?pdf-change=` und das Lesen in `load` haben keinen Unit-Test, und kein Frontend-Test liest den Vertrag `statement-updated.json`. |
| C-7 | Minor | `src/routes/statements/[id]/+page.svelte:151-153` | Die Korrektur von C-1 (`Object.hasOwn`) ändert, was ein Verwalter sieht: Bei `?pdf-change=toString` erscheint kein Hinweis mehr mit «[object …]». Kein Test zeigt das. `statement-pages.dom.test.ts:1802-1818` prüft nur `refund_by` und `notes`. CLAUDE.md, Workflow 6, verlangt für eine Korrektur, die Verhalten ändert, zuerst einen roten Test. Abhilfe: Ein DOM-Fall mit `pdfChange: 'toString'` erwartet, dass `statement-pdf-changed` fehlt. Auf e37e361 würde er rot. |
| C-8 | Minor | `tests/e2e/fixtures/backend.ts:384-387` | Die neue Methode `deliverByLetter` steht zwischen dem Kommentar «`which`: the key of the statement, «Berichtigte Abrechnung» …» und `sendStatement`, zu der dieser Kommentar gehört. Der Kommentar steht jetzt über einer Methode ohne Parameter `which`, sagt dort also etwas Falsches, und `sendStatement` hat keinen Kommentar mehr. |

Keine Blocker, keine Major.

Ponytail-Review des Deltas: Es bleibt nichts zu kürzen. Der Wrapper `<div>` um den Button verhindert, dass der Button im Panel auf die volle Breite gestreckt wird.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: eslint auf den geänderten Dateien; `bun run check`; `bun run fitness` (exit 0); `bunx vitest run --changed origin/main` (727 pass); `bunx vitest run src/__tests__/statement-pages.dom.test.ts` (198 pass); axe- und Sprachzeilen `-g "statement-sent-detail |statement-reminded-detail "` (18 pass).
- Wirkung der geänderten Testdaten auf andere Bildschirme: `seedFor` (`tests/e2e/fixtures/screens.ts:81-117`) legt die Daten für jeden Bildschirm mit einer Id in der Adresse an. Jetzt setzt es für alle diese Bildschirme die IBAN und legt den Brief-Dokument von Bruno 2025 an. Ausgeführt wurden nur die Zeilen von `statement-sent-detail` und `statement-reminded-detail`. `documents` `marked-sent` (Query `?letter={remindedLetter}`, `accessibility.feature:239`, `sprachen-bildschirme.feature:240`) führt dadurch einen Dokument mehr in der Liste. Diese Zeile hat niemand ausgeführt. Laut grep zeigt nur `src/routes/config/+page.svelte` die IBAN, und `/config` erhält keine Testdaten. Ein anderes Bild durch die IBAN erwarte ich deshalb nicht.
- `Button` mit `href` rendert `<a data-testid={testid}>` (`src/lib/ui/Button.svelte:79-84`). Die Question `sentPdfHref` und der DOM-Test (`statement-pages.dom.test.ts:1797`) greifen deshalb weiter. Laufen sehen habe ich das nicht.
- #968 und #969 per REST geprüft: beide offen, `needs-decision` (mit `product` bzw. `domain`). Ob P-1 und P-2 über die Entscheidung von #524 hinausgehen, habe ich nicht am Issue-Text von #524 geprüft.

Geprüft: alle 5 geänderten Dateien des Deltas; dass `statement-reminded-detail` (Bruno 2024, `sendStatement` über den Status) weiter ohne Dokument bleibt; dass die Zahlungsfrist nach `deliverByLetter` weiter überfällig gesetzt wird; dass das Icon `document-download` existiert; dass die API-Zeile `pdfChange` richtig beschreibt; keine Texte und keine Szenarien geändert.
