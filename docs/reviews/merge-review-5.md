# Merge-Review 5: 9ace8b9 (origin/main in claude/w3c-korrespondenzadresse-68-102-191-114)

Geprüft im Worktree `review-merge-5` (detached auf 9ace8b9) mit `git show 9ace8b9 --remerge-diff` und den Dateien im Merge-Stand.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `backend/src/__tests__/reminders.pg.test.ts:437` | Neu durch den Merge zusammengeführt: der Zahlteil der Mahnung (main, #108) für einen Mieter mit Korrespondenzadresse im Ausland (#102). Das Verhalten stimmt aufgrund der Struktur (siehe unten), aber kein Test zeigt «DE-78462 Konstanz» bzw. das Schuldnerland im Zahlteil einer Mahnung. Getestet ist das nur für die Abrechnung (`statement-pdf-render.test.ts:140`, `statement-detail.feature:232`) und für den Adressblock der Mahnung (`reminder-pdf.test.ts:23-26`) |
| C-2 | Nit | `src/routes/dashboard/+page.server.ts:143` | Die aufgelöste Destrukturierung mit 10 Namen ist länger als die Prettier-Zeilenbreite. `bunx prettier … \| diff` zeigt, dass die Zeilen 143-159 umgebrochen werden müssten. Die Branch-Seite war an dieser Stelle Prettier-sauber (CLAUDE.md: nur die eigenen Zeilen formatieren) |

Keine Blocker, keine Majors.

## Bestätigt

- **`reminder-pdf.ts`**: Die Imports beider Seiten sind vorhanden (`addPaymentPart`, `Language`, `QRBillConfig` von main, `countryLine` von diesem Branch). `lines()` hängt `countryLine(a.country)` weiterhin an den Empfänger-Adressblock an. Der Zahlteil der Mahnung läuft über `addPaymentPart`, `generateQRBillForStatement` und `paymentPart`, also über denselben Code wie die Abrechnung. Den Mieter dafür liefert `reminder.service.ts:96` (`{ ...statement, tenant }`), und zwar aus `getTenant`, dessen `tenantFields` das Feld `country` enthalten (`tenant.service.ts:65`). Damit werden `debtorCountry` (`qr-bill.service.ts:360`) und die Ortszeile `qrTown(…, debtorCountry)` (`pdf.service.ts:858`) genauso gebildet wie im PDF der Abrechnung. Der Adressblock steht an fester Position (y 140) und der Text beginnt fest bei y 215/245. Die zusätzliche Länderzeile verschiebt den Brief also nicht in den Zahlteil, und die Prüfung «eine Seite» (`reminders.pg.test.ts`) bleibt gültig.
- **`settings.ts`**: Die IBAN-Regel CH/LI (#191) steht in der `RULES`-Tabelle von main, mit Regex `^(CH|LI)\d{7}[A-Z0-9]{12}$`, MOD-97 und `m.settings_error_iban`. Das ist gleichwertig mit der alten Funktion des Branches: Eine leere Eingabe wird nicht geprüft, das kommt aus dem Filter `s[field] &&`. Die Regeln von main für Zahlungs- und Mahnfrist sind erhalten. `settings.test.ts` deckt LI ab (Zeile 200) und ebenso die Fristen (157-168).
- **`dashboard/+page.server.ts`**: In der Destrukturierung steht `stored` an Position 9 und `drafts` an Position 10. Das passt zur `Promise.all`-Liste, in der `config` vor `list(…status=draft…)` steht. `stored` speist `paymentDeadlineDays`/`reminderAfterDays`, `drafts` speist `oldAddresses(drafts)`.
- **`dashboard.test.ts` / `overview.test.ts`**: Beide Seiten sind enthalten: der `config.json`-Import und die Antwort `/config` von main, die Draft-Liste für A-5 vom Branch, `oldAddresses: []` sowie `paymentDeadlineDays`/`reminderAfterDays`.
- **`statement-generate.steps.ts`**: Der A-5-Schritt ist korrekt geschlossen (`}` `);`), die Tankbestand-Schritte von main folgen vollständig. Kein Schritttext kollidiert mit «warnt die Vorschau, dass die Abrechnungsperiode noch läuft» oder «… dass für {string} …».
- **`implementation-plan-verlauf.md`**: Die Session des Branches steht nach den Sessions von main (W8b, W6c), und der Migrationsname ist dort auf `0016_tenant_country.sql` aktualisiert.
- **Migration**: Es gibt `0015_building_no_tank.sql` (main) und `0016_tenant_country.sql`, beide ein unabhängiges `ALTER TABLE … ADD COLUMN`. Außerhalb historischer Review-Berichte (`docs/reviews/merge-review-2..4.md`) nennt keine Datei mehr `0015_tenant_country`. `migrations.pg.test.ts:73` filtert nur `< 0012_…`.
- Es sind keine Konfliktmarker übrig (`git grep` ohne `*.md`), und der Worktree ist sauber.
- Neu ausgeführt: `bunx vitest run src/__tests__/dashboard.test.ts src/__tests__/overview.test.ts src/__tests__/settings.test.ts`, 47 Tests bestanden.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-Type-Check, `bunx vitest run` (2803), `tests/unit` (177), Backend `bun test` (811): vom Aufrufer gemeldet.
- Den vollständigen E2E-Lauf (vom Aufrufer gemeldet als laufend) habe ich nicht gestartet, ein Ergebnis liegt nicht vor. Das betrifft vor allem `statement-generate.feature` (A-5 und Tankbestand) und `statement-reminder.feature` mit dem Zahlteil.
- Den Zahlteil einer Mahnung an einen Mieter im Ausland habe ich nicht gerendert, nur den Code-Pfad gelesen (C-1).
