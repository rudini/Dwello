# Review #788 Teil 1, Runde 2 (Delta ccfab9ed..1b8d6ceb)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | behoben | `src/routes/contracts/[id]/+page.server.ts:365`: `backendMessage(body?.code ? body : null, m.contracts_delete_failed())`. Test `src/__tests__/contract-actions.test.ts:529-536` (404 ohne Code → «Mietvertrag konnte nicht gelöscht werden.»). Der Test ist auf ccfab9ed rot, weil `backendMessage` dort `body.error` = «Contract not found» liefert. |
| C-2 | Major | behoben | `tests/e2e/features/contract-detail.feature:104-112`, ohne `@wip`. Auf der Basis zeigte der alte BFF-Check (GET → Beginn 2024 → 400) `contracts_delete_mistake_unconfirmed` («Bitte bestätigen Sie …»), also einen anderen Text. Damit ist das Szenario dort rot. |
| C-3 | Minor | behoben | `contract-actions.test.ts:503, 539, 549`: Kein Test gibt mehr eine GET-Antwort zurück. Das DELETE antwortet mit 204 bzw. 409. |

## Neue Befunde im Delta

Keine.

Zu den Fragen des Auftrags:
- **Verdeckt die Regel `body?.code` eine Ablehnung mit Code, oder zeigt sie eine ohne Code?** Nein. Mit Code kann `DELETE /contracts/:id` nur drei Ablehnungen liefern: `CONTRACT_HAS_STATEMENTS` und `CONTRACT_STARTED` (`backend/src/services/contract.service.ts:528, 530`) sowie `NOT_FOUND`/`VALIDATION_ERROR` aus dem globalen `onError` (`backend/src/app.ts:64-72`). Alle haben weiterhin `body.code` und eine Meldung `backend_*` in `messages/de.json:1489-1490, 1778-1779`. Ohne Code bleiben nur zwei Antworten: 404 «Contract not found» (`contract.service.ts:520`) und ein 500 ohne JSON. Beide zeigen jetzt `contracts_delete_failed`, nie den Text des Backends. Auch ein unbekannter Code geht weiter an `backendMessage` und landet dort beim bisherigen Rückfall.
- **Isolation:** Das Szenario legt Wohnung, Mieter und Mietvertrag selbst an. Die Namen bekommen das Suffix von `seed.names`. Es stützt sich auf keine Daten eines anderen Szenarios und auf kein Datum, das mit heute wandert: Der Beginn ist fest auf 2099-11-01 bzw. 2024-04-01 gesetzt. Kein `FailRequests`, keine globalen Datensätze.
- **Screenplay:** Das Szenario benutzt nur Schritte, die es schon gibt. `beginnt danach am` (`tests/e2e/steps/statement-detail.steps.ts:455`) ruft `seed.contractStart` auf, also `PUT` über das Backend (`tests/e2e/fixtures/backend.ts:384-386`). `löscht` und `meldet der Dialog` arbeiten mit Task und Question (`tests/e2e/steps/contract-detail.steps.ts:127, 181`). Kein Schritt wurde geändert.
- **Navigationsszenario:** Nicht nötig. Es gibt weder eine neue Seite noch einen neuen Weg. Der Text erscheint im bestehenden Löschdialog an derselben Stelle wie andere Ablehnungen, und das Szenario bleibt auf der Detailseite.

Geprüft: Diff aller drei Dateien und Commit-Text gelesen, Aktion in ihrem Umfeld gelesen, `backendMessage` (`src/lib/backend-error.ts:42-53`), Route und Service des Backends, die vier Übersetzungen von `backend_contract_started` (`messages/*.json:1779`).

## Nicht bestätigt

- bunx vitest run (3645), bun run lint, bun run check, E2E contract-detail.feature mit Chromium und API (56): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Den roten Lauf des Szenarios als `@wip` gegen den alten BFF-Check meldet der Aufrufer. Durch Lesen bestätigt ist nur, dass die Basis einen anderen Text zeigt (siehe C-2). Dass `PUT /contracts/:id` den Beginn ohne Ablehnung in die Vergangenheit legt, zeigt nur der gemeldete grüne Lauf. Die Validierung von PUT habe ich nicht gelesen.
- `tests/a11y/screens.json` hat für den Löschdialog nur `delete-unconfirmed` (Zeile 33). Es fehlt ein Zustand für den Dialog eines künftigen Mietvertrags mit Ablehnung. Diesen Zustand gab es schon vor der Änderung (z. B. Mietvertrag inzwischen gelöscht → `contracts_delete_failed`), und er hat keine eigenen Bedienelemente. Deshalb ist er hier kein Befund. Ob ihn ein bestehendes Issue erfasst, habe ich nicht geprüft.
