# Abschliessendes Review, Runde 2 (Slice «closing»)

Worktree `review-closing-2`, detached auf `1a936d2`. Delta `git diff e05b62b 1a936d2` (ein Commit). Alle Dateien vollständig gelesen, dazu `updateStatementStatus` und `resetPayment` (`statement.service.ts:461-530`), `generateStatementPdf`/`getStatementPdf` (`statement-pdf.service.ts:246-316`), die Route `PUT /:id/status`, `SendDialog.svelte`, `+page.svelte` (Bedingungen `status === 'draft'`), `tests/a11y/screens.json:436-441`, beide Bildschirm-Features und `docs/api-specification.md:202,225`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | `backend/src/services/statement-pdf.service.ts:310-316` | Der Versand erstellt das PDF jetzt sofort. Der pg-Test «erstellt das PDF beim Versand» wäre vorher an `pdfGeneratedAt` (null) und an der Adresse («Spaeterweg 3» statt «Versandweg 2») rot gewesen. Das Szenario ohne den Schritt «erstellt» wäre vorher am fehlenden Download-Link gescheitert. Bestätigt |
| C-2 | Nit (offen) | `tests/e2e/fixtures/screens.ts:93-94` | Unverändert: «the next steps of **his** ended contract». Bei Gina müsste es «her» heissen |
| C-3 | Minor | `backend/src/services/statement-pdf.service.ts:314`, `statement.service.ts:487-494` | Bei einem Saldo von 0 setzt der Versand den Status direkt auf `paid` (`settled`) und verwirft das PDF (`sentToday`). Weil `statement?.status === 'sent'` dann falsch ist, entsteht das PDF nicht beim Versand. Das Problem von C-1 bleibt in diesem Fall bestehen: Das PDF fehlt nach dem Versand, und beim ersten Abruf nimmt es spätere Änderungen auf. Vorschlag: die Bedingung auf den verlangten Status `status === 'sent'` stellen statt auf den Status danach |
| C-4 | Minor | `backend/src/services/statement-pdf.service.ts:314` | Der Rückfall «Status bleibt versendet, wenn das PDF jetzt scheitert» ist nicht getestet. Ohne `.catch` würde z. B. eine ungültige IBAN (`IBAN_INVALID` wird geworfen, `qr-bill.service.ts:329`) den bereits gespeicherten Versand mit 400 beantworten. Ich habe keinen Test gefunden, der mit ungültiger IBAN oder einem Renderfehler versendet (`grep IBAN_INVALID` in `backend/src/__tests__`, `tests/e2e/features`). Ausserdem wird der Fehler ohne Log verschluckt, anders als bei `pdfFailure` (Zeile 22: «anything else logged») |
| C-5 | Minor | `docs/api-specification.md:225` | Die Spezifikation sagt noch: «sending discards the stored PDF, so the PDF as sent is made on its first request after sending». Seit dem Delta entsteht das PDF beim Versand, und der erste Abruf ist nur noch der Rückfall. Das sollte auch bei `PUT /:id/status` (Zeile 202) stehen |
| C-6 | Nit | `backend/src/services/statement-pdf.service.ts:312-315` | `PUT /:id/status` antwortet mit der Abrechnung vor der PDF-Erstellung, also mit `pdfGeneratedAt: null`, obwohl das PDF schon gespeichert ist. Die Seite lädt nach dem Versand neu (`update()` in `SendDialog.svelte`) und ist deshalb nicht betroffen. Die API-Antwort widerspricht aber dem gespeicherten Zustand |
| C-7 | Minor | `src/routes/statements/[id]/PartiesPanel.svelte` (unverändert), `docs/design/personas/anna-w3c.md:12,68` | P-2 nennt auch, dass unter «Mieter und Wohnung» nur die Adresse der Wohnung steht und nicht die Korrespondenzadresse. Der Vorschlag nennt sie ebenfalls. Das Delta behebt den Kern, nämlich die fehlende Warnung. Diesen Teil behandelt es nicht, und es begründet auch nicht, warum er wegfällt. Entweder umsetzen oder in der Triage begründet ablehnen |

ponytail-review (Delta): `OldAddressWarning.svelte` legt Seite und Dialog zusammen, statt das Alert zu kopieren. `SendDialog` ist um 13 Zeilen kürzer. `changeStatementStatus` umgeht mit wenigen Zeilen den Import-Zyklus zwischen `statement.service` und `statement-pdf.service`. Lean already. Ship. net: -0 lines possible (die Fixes von C-3 und C-4 ändern nur Bedingung und Log).

## Bestätigt

- Anna P-2: Die Detailseite eines Entwurfs warnt jetzt vor der alten Adresse (`+page.svelte:154`, Bedingung `status === 'draft' && oldAddress` in `OldAddressWarning.svelte:10`), mit Link auf `/tenants/{id}/edit`. Der DOM-Test «warnt auf der Seite eines Entwurfs …» war vorher rot, weil es `statement-old-address` nicht gab. «… einer versendeten Abrechnung nicht mehr» wird rot, wenn man `status === 'draft'` entfernt. Der neue Schritt im Szenario «Versand trotz alter Adresse» (`statement-detail.feature:64`) wäre ohne das Element auf der Seite rot gewesen und hat kein `@wip`.
- Im Dialog gilt jetzt zusätzlich `status === 'draft'`. Das ändert nichts, weil die Schaltfläche zum Versand nur bei Entwürfen erscheint (`+page.svelte:159,193`). Der bestehende DOM-Test zum Dialog (Standardstatus Entwurf) bleibt gültig.
- Texte: Es gibt keine neuen Texte. `statements_old_address` und `contracts_next_address` stehen in allen vier `messages/*.json`.
- Bildschirm: Der Zustand ist der bestehende `statement-old-address-detail` `default` (Gina, Entwurf) in `screens.json`, `accessibility.feature:139` und `sprachen-bildschirme.feature:140`. Es braucht keine neue Zeile.
- Screenplay: Der Schritt ruft nur die Question `oldAddressWarningText` auf (`Text.of`, sie liefert den Text). Das Target liegt in `targets/`, `data-testid` ist kebab-case mit Kontext. Das Feature formuliert fachlich.
- Der pg-Test setzt den Status vor den `expect` zurück. Die Transitionen (`draft → sent` nur einmal) verhindern, dass ein zweiter Versand das PDF wie versendet überschreibt.
- `bunx prettier <datei> | diff` zeigt bei allen acht Code-Dateien des Deltas keine Abweichung. Nichts im Delta hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- Neu ausgeführt: `bunx vitest run src/__tests__/statement-pages.dom.test.ts`, 87 bestanden.
- Vom Aufrufer gemeldet, nicht neu ausgeführt: Backend `bun test` (769) und `type-check`, `bun run lint`, `bun run check`, E2E chromium und api für statement-detail, statements, statement-reminder und dashboard (96), die a11y- und Sprachzeilen statement-detail und statement-old-address-detail (10). Laut Aufrufer liefen die a11y- und Sprachzeilen vor dem Refactoring in die Komponente. Im Delta gibt es nur einen Commit, deshalb kann ich nicht sehen, welcher Stand geprüft wurde. Backend-Tests und E2E schreiben in Datenbanken oder bauen, das darf ich nicht starten.
- Dass der pg-Test vorher rot war, habe ich nur aus dem Code geschlossen (C-9 verwarf das PDF beim Versand).
- C-3 habe ich aus dem Code gelesen, nicht mit einem Lauf gezeigt.
- Für P-2 habe ich den Persona-Bericht `docs/design/personas/anna-w3c.md` gelesen, aber keinen neuen Persona-Lauf gemacht.
