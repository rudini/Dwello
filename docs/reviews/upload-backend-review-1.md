# Code-Review #217, Slice 1 (Backend), Runde 1

Worktree: `review-backend-code` (f63afb6), Bereich `git diff 90631a2 f63afb6` (30 Dateien, alle gelesen).
Grundlage: Issue #217 («Decided (product owner)», «Done means»), `docs/reviews/upload-fachreview-1.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/config/llm.ts:317-320 | `date()` wirft bei einem ungültigen Monat (z. B. `2026-31-03`, `2026-13-01`) einen `RangeError`, statt `null` zu liefern. `extractInvoice` fängt den Fehler und verwirft den ganzen Vorschlag: Die Antwort ist 503 `KI_UNAVAILABLE`. |
| C-2 | Minor | .env.example:65 | Dort steht noch `# LLM_MODEL=qwen2.5:3b`. Alle anderen Stellen nennen jetzt `qwen2.5vl:7b`. |
| C-3 | Minor | backend/src/__tests__/llm-extraction.test.ts | Diese Fälle haben keinen Test: `ANSWERED_AS` (unsicherer Betrag über `totalAmount`, unsicheres Ende über `servicePeriodStart`), ein Leistungszeitraum mit Ende vor Beginn, `/extract` mit `LLM_ENABLED=false`, `PUT /:id/beleg` auf eine unbekannte Rechnung (404) und `GET /:id/beleg` ohne Beleg (404). Wenn man `ANSWERED_AS` entfernt, bleiben alle Tests grün. |
| C-4 | Minor | backend/src/routes/invoices.ts:141-147 | `/extract` gibt den Code `KI_UNAVAILABLE` zurück, auch wenn das Modell zwar antwortet, aber kein JSON liefert. Die Meldung `backend_ki_unavailable` spricht von einer «passenden Kategorie», das Issue verlangt aber «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.». Ein eigener Code (z. B. `KI_NOT_READ`) würde verhindern, dass das Frontend mit `backendMessage()` den falschen Text zeigt. |
| C-5 | Minor | backend/src/routes/invoices.ts:200; backend/src/services/invoice.service.ts:275 | Der 404 von `GET /:id/beleg` ist eine Ablehnung ohne Code. `setBeleg` prüft die Datei vor der Rechnung: Eine unbekannte Rechnung mit falscher Datei gibt deshalb 400 statt 404. |
| C-6 | Minor | backend/src/services/invoice.service.ts:256 | Rechnung und Beleg werden ohne gemeinsame Transaktion gespeichert. Scheitert das Speichern des Belegs, bleibt die Rechnung ohne Beleg bestehen, die Antwort ist aber 400. Ein erneuter Versuch erzeugt dann ein Duplikat. |
| C-7 | Minor | implementation_plan.md:14-29 | Die Zeile `Skills: tdd, ponytail, ponytail-review` fehlt. Der Plan nennt eine neue Zeile in `docs/design/offene-punkte.md` zu `swiss-today.pg.test.ts`, die Datei enthält sie aber nicht (grep `swiss-today`: kein Treffer). |
| C-8 | Nit | docs/tech-stack.md:80 | Der Kasten im Diagramm ist um 2 Zeichen verschoben (`- qwen2.5vl:7b` hat dieselbe Auffüllung wie der kürzere alte Name). |
| C-9 | Nit | backend/src/config/llm.ts:317 | `date()` macht dasselbe wie `isRealDate` (`backend/src/routes/real-date.ts`). Für die Korrektur von C-1 eine gemeinsame Funktion verwenden, die nicht wirft. |
| C-10 | Nit | backend/src/config/llm.ts:321, 354 | `toFixed(2)` rundet binär (100.005 ergibt "100.00"), `roundToRappen` gibt es schon. `invoiceCount: "2"` (als String) wird zu 1, und der Hinweis auf mehrere Rechnungen geht verloren. |
| C-11 | Nit | backend/src/routes/invoices.ts:151 | `fileName` in `/extract` hat keine `maxLength`. Ob `buildingId` existiert, wird nicht geprüft (ein unbekanntes Gebäude ergibt still `duplicateOf: null`). |

## Blocker/Major

### C-1: Ein ungültiges Datum in der KI-Antwort verwirft den ganzen Vorschlag

Fehler: `date()` ruft `new Date(iso).toISOString()` auf. Das passiert nur, wenn das Muster `^\d{4}-\d{2}-\d{2}$` passt, also auch bei `2026-13-01` oder `2026-31-03`. Für diese Werte ist `new Date(...)` ein «Invalid Date», und `toISOString()` wirft `RangeError: Invalid Date`. Der `try` in `parseExtractionResponse` umfasst nur `JSON.parse`. Der Fehler geht also nach `extractInvoice` (`llm.service.ts`, `catch` → `null`), und `/extract` antwortet 503 `KI_UNAVAILABLE`.

Warum das falsch ist: Die Datumsfelder sind dafür gedacht, unlesbare Angaben einzeln auf `null` zu setzen («Fehlt eine Angabe, setze null»; der Test «verwirft Angaben, die keine Daten … sind»). Ein Bildmodell, das Schweizer Daten («31.03.2026») liest, vertauscht Tag und Monat leicht. Dann verliert der Liegenschaftsverwalter wegen eines einzigen falschen Felds alle Vorschläge (Rechnungssteller, Betrag, Kategorie, Duplikatprüfung). Zusätzlich bekommt er die falsche Meldung, die KI sei nicht verfügbar. Das widerspricht «Done means»: «A file that cannot be read … shows what happened».

So lässt sich der Fehler zeigen (in diesem Review in Bun 1.4.2 ausgeführt):

```ts
parseExtractionResponse(JSON.stringify({ invoiceDate: '2026-13-01', totalAmount: 5 }))
// -> wirft RangeError: Invalid Date (erwartet: fields.invoiceDate === null, amount '5.00')
```

Mit `2026-00-10` passiert dasselbe. `2026-02-30` und `2026-04-31` liefern dagegen korrekt `null`. Der bestehende Test prüft nur `2026-02-30` und bleibt deshalb grün.

Behebung: zuerst einen Test im Fall «verwirft Angaben …» mit `dueDate: '2026-13-01'`, der rot wird. Dann `date()` so schreiben, dass es nicht wirft (z. B. `Number.isNaN(new Date(iso).getTime())` prüfen, bevor `toISOString` aufgerufen wird), am besten zusammen mit `isRealDate` (C-9).

## Bestätigt (Code und Test)

- Tabelle `invoice_documents` (ein Beleg pro Rechnung, `ON DELETE CASCADE`) und Entfernen von `invoices.invoice_pdf` in Migration, Schema und `docs/data-model.md`. Es gibt keine Verweise mehr auf `invoicePdf`. Getestet in `invoice-beleg.pg.test.ts` («wird mit der Rechnung gelöscht»).
- `POST /invoices` mit `beleg`: Die Datei wird vor dem Speichern geprüft (`checkedFile`, dieselbe Prüfung wie bei Mieterdokumenten, Magic Bytes, 10 MB). Eine Ablehnung trägt einen Code, die Meldungen `backend_document_*` gibt es schon. `GET /:id/beleg` (Header über `fileResponse`, gemeinsam mit den Dokumenten) und `PUT /:id/beleg` mit Hinzufügen und Ersetzen sind getestet.
- `beleg: { fileName, mimeType } | null` in Detail und Liste, ohne den Inhalt. Vertrag `invoice.json` ist nachgeführt.
- `POST /invoices/extract`: Seiten als Bilder an die KI, Kategorie über den bestehenden Prompt, Duplikat über Rechnungssteller und Rechnungsnummer (Gross-/Kleinschreibung und Leerzeichen egal) im Gebäude, KI nicht erreichbar ergibt 503. Getestet in `invoice-extraction.pg.test.ts`, Vertrag in `invoice-extraction.json` und `api-contracts.pg.test.ts`.
- Prompt nach V-1, V-2, V-5, V-7 und M-1 (Total vor Abzügen, `deductedAmount`, `documentType`, `nonAllocableItems`, alle Positionen, kein Fälligkeitsdatum aus «innert 30 Tagen», Schweizer Zahlformat). Der Parser ist mit festen Antworten getestet (`llm-extraction.test.ts`).
- Standardmodell `qwen2.5vl:7b` in Konfiguration, Compose-Dateien, README (OpenRouter mit dem Hinweis auf die USA), PRD und tech-stack. Ausnahme: C-2.
- Der E2E-Ersatz für die KI antwortet beim Auslesen nach dem Dateinamen und kategorisiert nur die Rechnungssteller der Upload-Szenarien. Die anderen Szenarien sehen weiterhin keine KI (`/models` antwortet 503).
- E2E: Der Schritt ruft jetzt den Task `openBelegOfInvoice` auf statt direkt `DownloadFrom(belegLink)`. Damit gilt die Screenplay-Schichtregel.
- Die drei neuen Testdateien habe ich erneut laufen lassen: 12 bestanden, 0 fehlgeschlagen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht von mir wiederholt: `cd backend && bun run test` (627 bestanden, 1 Fehler in `swiss-today.pg.test.ts`, laut Aufrufer auch auf origin/main), `bun run type-check`, `bun run lint`, `bun run deepcheck:audit`, `api-contracts.pg.test.ts`.
- Nicht gelaufen: Frontend-Coverage und Check, E2E. Die @wip-Szenarien sind laut Aufrufer noch rot, das Frontend folgt in Slice 2.
- `bun run llm:eval` vorher und nachher mit dem Standardmodell: Das Modell wechselt und betrifft damit auch `proposeAllocability`. Der Plan meldet den Lauf als blockiert (`Refs #217`).
- Ob `qwen2.5vl:7b` mit `LLM_TIMEOUT=30000` drei Seiten und danach die Kategorisierung rechtzeitig schafft (zwei Aufrufe nacheinander): nicht messbar, kein Modell verfügbar. Siehe «Stop and ask» im Issue.
- Belange, die nach dem Issue zum Frontend gehören und nicht Teil dieses Slices sind: Dialog, höchstens 20 Dateien, Warnung bei abgerechneten Rechnungen (M-3; das BFF hat `billedIn` in `src/lib/server/invoice.ts`), Hinweise zu Mahnung, Gutschrift und Abzug, Kategorie als Pflichtfeld, Datenschutzerklärung, `messages/*.json`, `tests/a11y`, PDF-Seiten im Browser rendern (R-5).
- Grösse der Anfragen: Bun nimmt standardmässig bis 128 MB an, ein Beleg von 10 MB ist in Base64 etwa 13,4 MB. Die Grenze des BFF ist erst in Slice 2 zu sehen.
