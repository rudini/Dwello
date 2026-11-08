# Code-Review #690, Runde 1 (a46bf5c..89ba506)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/statements/[id]/+page.server.ts:81-84 (mit backend/src/routes/config.ts:27) | Die Detailseite warnt nach der Regel der Speicherung (`creditorMissing`), der Zahlteil prüft aber den Kreditor `config.accountHolder ?? Firmenadresse` (qr-bill.service.ts:347-349, statement-pdf.service.ts:31). Ist ein vollständiger Kontoinhaber gespeichert und fehlt nur die Firmenadresse (z. B. nach `PUT /config/company_name` leer), meldet `creditorMissing` `IBAN_COMPANY_ADDRESS_MISSING`. Die Seite warnt dann «Für den Zahlteil fehlt die Firmenadresse», obwohl PDF und Mahnung mit Zahlteil erzeugt werden. Selten erreichbar, weil die Speicherung mit IBAN die Firmenadresse verlangt. |
| C-2 | Minor | tests/contracts/statements.json:36, tests/contracts/statement-updated.json:33 | `paymentOf` liefert `paymentPart` jetzt auch in `GET /statements` und in der Antwort von `PUT /:id`. Nachgeführt ist nur `statement.json`; die beiden Verträge dieser Antworten beschreiben sie nicht mehr vollständig (CLAUDE.md, Gotchas «API contracts»). `drift` merkt das nicht, weil es nur die Schlüssel des Vertrags prüft. |
| C-3 | Minor | tests/e2e/tasks/accessibility.ts:981-984 | `FRESH_APP` in `useLanguage` bewirkt nichts. Playwright legt Cookies nach Domain und Pfad ab, nicht nach Port: der Cookie für `http://localhost:3100` gilt schon für `localhost:3106`. Deshalb bestanden die Zeilen `backup-links` und `ki-*` der Installation (vorher schon in sprachen-bildschirme.feature) die Sprachprüfung bereits vorher. Der geänderte Kommentar «… and the fresh installation (#690) show» behauptet eine Wirkung, die die Zeile nicht hat. |

Keine Blocker, keine Major.

Geprüft: `paymentPart` ist gleichwertig mit `owed` im PDF. Abgeglichen sind `minimumOf` (carried, waived), `paidDate` nur bei `paid` und `settled`; `settled` entsteht nur bei 0.00 oder unter CHF 5 ohne Schlussabrechnung (statement.service.ts:762-763). Mahnungen gibt es nur bei überfälligen und `claimed` Abrechnungen.
Geprüft wurden ausserdem:
- der Vertrag `config-creditor-missing.json` mit seinem Test, auch `config.json`;
- die Meldungen in allen vier Sprachen;
- Zeilen in screens.json, accessibility.feature und sprachen-bildschirme.feature;
- Szenarien und Schritte: nur Zeilen ergänzt, kein Schritt eines Szenarios ohne `@wip` prüft weniger;
- `frisch` auf `inTurnOnFresh` umgestellt, ohne Änderung des Verhaltens;
- der Fixture-Ablauf: der Lock wird vor der Grundlage genommen, weil `verwalter` von `seed` abhängt;
- Rot ohne die Änderung für die neuen Unit-, DOM- und pg-Tests und die Szenarien;
- die Commit-Nachricht 8477df9 zum Szenario der Fehlerseite (#734), dessen testid `pdf-refusal-settings` es auf dem Basis-Commit schon gibt;
- die Screenplay-Schichten.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, backend type-check;
  - vitest komplett (4347);
  - backend `config.pg`, `api-contracts.pg`, `statement-payment`, `statement-invoices.pg`, `statement-carry-over.pg`;
  - E2E `settings.feature` und `statement-detail.feature` (163) samt den neuen Zeilen für axe und Sprachen;
  - fitness, fallow, Prettier.
- Gemeinsamer Lauf mit den übrigen Features der frischen Installation (`einrichtung`, `sicherung`, `ki-einstellungen` und die Zeilen `backup-*` und `ki-*` von axe und Sprachen): gemeldet sind nur `settings` und `statement-detail`. Zum Aufräumen gelesen:
  - `freshInstallation.cleanUp` und `testData.cleanUp`;
  - die Restores entfernen `iban` und `company_address`;
  - die Entwürfe gehen über die API weg;
  - `purgeStatements` läuft gegen `dwello_e2e`, nicht gegen `_fresh`: harmlos, solange die Szenarien auf der frischen Installation keine Abrechnung versenden.
- Lock und Laufzeit: `withLock` übernimmt einen Lock nach 60 s (settings-lock.ts, `STALE_MS`), ohne die mtime zu erneuern. Die neuen Szenarien halten den Lock `installation` über das ganze Szenario, mit Grundlage, Abrechnung, PDF und bei axe 6 Ansichten der Detailseite. Ob eines davon auf CI 60 s überschreitet und damit ein paralleles Szenario der Installation hereinlässt, ist ohne Laufzeiten nicht zu sehen. Für die bisherigen Halter (`frisch`, `inTurn`) gilt dasselbe. Ein Szenario mit `@frische-installation`, das auch `frisch` oder einen Zustand von `inTurn` auf FRESH_APP nutzt, würde den Lock verschachtelt nehmen. Das ist heute nicht der Fall.
