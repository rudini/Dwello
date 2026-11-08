# Code-Review 690, Runde 5 (Abschlussrunde nach den Fixes)

Bereich: `git diff 5a5f610 2b8b3a8` (ohne Reports, Personas, Plan, Archiv), Commit 2b8b3a8 `chore(tests): add Kontoinhaber scenarios of #690`.

Geschlossen: C-6, C-7.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Minor | `tests/e2e/fixtures/backend.ts:368-373` (mit `:349-358`) | Die drei neuen Szenarien hinterlassen auf der frischen Installation die Firmenadresse: Der Schritt «das Konto der IBAN … gehört …» (`seed.accountHolder`) speichert über `accountOf` `company_name`, `company_address`, `company_postal_code` und `company_city`. `withoutSetting` entfernt danach nur die IBAN, und im PLZ-Szenario setzt es `company_postal_code` auf den Wert, den das Szenario selbst gespeichert hat. Kein Restore entfernt die Firmenadresse. `tests/e2e/CLAUDE.md` (Global records) verlangt aber, dass der Datensatz wiederhergestellt wird. Das bestehende Szenario mit `ibanWithoutCompanyAddress` räumt dagegen alles ab. Heute bricht dadurch kein Szenario, denn `ibanWithoutCompanyAddress` und der a11y-Zustand `creditor-missing` löschen Name, PLZ und Ort selbst. Ein späteres Szenario auf der frischen Installation, das eine leere Firmenadresse erwartet, hinge aber von der Reihenfolge ab |

## Nicht bestätigt

- Lint, check, type-check, Unit-Tests, fitness, fallow, Prettier und E2E 58 bestanden: vom Aufrufer gemeldet.
- Der rote Lauf der drei Szenarien mit dem Produktionscode von 8b4baa6: vom Aufrufer gemeldet. Durch Lesen ist er plausibel. Auf der Basis erwarten (1) und (2) den alten Text «Für den Zahlteil fehlt die Firmenadresse …», `pdfRefusalText` prüft mit `toBe` und `creditorWarningText` mit `toContain`. (3) bekommt dort gar keine Warnung, weil `creditorOf` bei einem vollständigen Kontoinhaber nichts ablehnt.
- Dass `DELETE config/account_holder_city` bzw. `company_postal_code` neben einer gespeicherten IBAN nicht abgelehnt wird, habe ich nur gelesen: `removeConfig` prüft nichts, `creditorMissing` greift nur, wenn `iban` im Body steht. Ebenso habe ich nur gelesen, dass die Restores der Reihe nach (FIFO) ohne `iban` im Body laufen und deshalb nicht an `IBAN_COMPANY_ADDRESS_MISSING` scheitern.

Geprüft: Die neuen Szenarien tragen `@frische-installation`. `seed` läuft für sie innerhalb von `withLock('installation')` (`fixtures/test.ts:73-82`), und der neue Schritt bricht ohne den Tag ab. Der Kontoinhaber wird über `restoreAccountHolder` zurückgesetzt und die IBAN entfernt. Der Feature-Diff fügt nur Zeilen an, keine bestehende Zeile ändert sich. Die Schritttexte decken sich mit dem, was die Schritte prüfen. Die API-Spezifikation nennt `ACCOUNT_HOLDER_MISSING` bei PDF, generate-pdf, Versand, Mahnung und «als versandt» und stimmt mit `qr-bill.service.ts:338-341` überein.
