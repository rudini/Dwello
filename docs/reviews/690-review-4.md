# Code-Review 690, Runde 4 (Abschlussrunde vor dem Push)

Bereich: `git diff 8b4baa6 5a5f610` (ohne Reports, Personas, Plan, Archiv), Commit 5a5f610 `fix(statements): name whose address is missing`.

Geschlossen: C-5 (Fokus nach der Navigation per `afterNavigate`; der Schritt «steht der Fokus in den Einstellungen auf "Firmenname"» steht im Szenario «Von der Warnung zur fehlenden Firmenadresse zu den Einstellungen», das auf `main` noch nicht existiert und deshalb frei ist).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Major | `tests/e2e/features/statement-detail.feature:1541-1572` | W-1 und W-2 ändern, was der Liegenschaftsverwalter sieht, ohne Szenario und ohne `No scenario: <reason>` |
| C-7 | Minor | `docs/api-specification.md:36,310,319,320,338,344` | Die Ablehnungslisten von PDF, Versand, Mahnung und «als versandt» nennen nur `CREDITOR_ADDRESS_MISSING` (Firmenadresse). Seit W-1 lehnen dieselben Endpunkte bei einem unvollständigen eigenen Kontoinhaber mit `ACCOUNT_HOLDER_MISSING` ab (`qr-bill.service.ts:341`). Zeile 36 beschreibt `CREDITOR_ADDRESS_MISSING` weiter als «Firmenadresse fehlt», auch wenn ein Kontoinhaber erfasst ist |

## C-6 (Major): keine Szenarien für W-1 und W-2

**Warum falsch:** `CLAUDE.md` (Workflow 1 und «Always check») verlangt für jede Verhaltensänderung, die ein Benutzer sieht, ein Szenario ohne `@wip`. Der Diff ändert drei sichtbare Dinge:
1. W-1: Fehlt beim eigenen Kontoinhaber Name, PLZ oder Ort, nennen die Fehlerseite des PDF und die Warnung auf der Detailseite jetzt den Kontoinhaber («Mit einer IBAN braucht es den Kontoinhaber. …») statt die Firmenadresse. Das war ein Fehler, den der Benutzer sah.
2. W-1: Die Fehlerseite führt in diesem Fall jetzt zu den Einstellungen (`documents/refused/+page.server.ts:6-11`).
3. W-2: Ist der Kontoinhaber vollständig und fehlt die Adresse des Absenders, warnt die Detailseite jetzt («Mit einer IBAN braucht es die Firmenadresse. …»). Vorher kam keine Warnung (Weber-690, Zustand 2).

Der Feature-Diff fügt nur den Fokus-Schritt für C-5 an. Alle Szenarien zu #690 (`statement-detail.feature:1541-1572`) richten nur die Firmenadresse ohne Kontoinhaber ein (`… ohne Firmenname, PLZ und Ort hinterlegt`). Die Fälle sind tiefer getestet (`qr-bill.service.test.ts`, `config.pg.test.ts`, `statement-endpoints.test.ts`, `statement-pages.dom.test.ts`). Der E2E-Stack kann sie aber auch erzeugen: `@frische-installation` gibt es schon, und das Speichern eines eigenen Kontoinhabers gibt es in `settings.feature:78-100` schon. Deshalb trägt `No scenario` hier nicht, und weder der Commit noch der Plan nennt einen Grund.

**So zeigt man es:** Neue `@frische-installation`-Szenarien schreiben, die zuerst rot laufen müssen: (a) IBAN mit eigenem Kontoinhaber ohne Ort, PDF anfordern: die Fehlerseite liest «Mit einer IBAN braucht es den Kontoinhaber. …» und führt zu den Einstellungen; (b) dasselbe auf der Detailseite: die Warnung nennt den Kontoinhaber; (c) vollständiger Kontoinhaber, Absender ohne PLZ: die Detailseite warnt mit «Mit einer IBAN braucht es die Firmenadresse. …». Auf 8b4baa6 scheitern (a) und (b) am Text und (c) an der fehlenden Warnung.

## Nicht bestätigt

- Lint, check, type-check, vitest 4352, Backend 352, fitness, fallow, Prettier, E2E 71 bestanden: vom Aufrufer gemeldet. Den roten Lauf des neuen Fokus-Schritts (er erhielt `null`) meldet ebenfalls nur der Aufrufer.
- Type-check von `qr-bill.service.ts:359-360`: `const { creditor, refused } = creditorOf(config)` übergibt `refused` (Typ `… | undefined`) an `CodedError(code: string, …)`. Ob TypeScript das nach `if (!creditor)` eingrenzt, konnte ich ohne `node_modules` nicht prüfen. Das grüne type-check ist vom Aufrufer gemeldet.
- Den Entscheid des Product Owners zu W-2 in #690 habe ich nicht auf GitHub nachgelesen. Ich habe ihn aus der Beschreibung des Aufrufers, der Commit-Nachricht und `docs/design/personas/weber-690.md:83` genommen.
- Wie `afterNavigate` und `afterNavigate` im Root-Layout zusammenspielen, habe ich nur durch Lesen beurteilt. Das Layout fokussiert nur bei Listennavigation (`+layout.svelte:62-69`), auf `/config` stört es also nicht. Bei einer Navigation auf derselben Seite (z. B. Sprachwechsel) springt der Fokus wieder auf das erste fehlende Feld. Das habe ich nicht ausprobiert.

Geprüft: die Speicherregel ist unverändert (`config.service.ts` nicht im Diff), die Verträge `config.json` und `config-creditor-missing.json` sind auf `paymentPartWarning` umgestellt, `creditorAddressMissing` ist ganz entfernt und `creditorOf` nicht mehr exportiert, der Text kommt über `backendMessage` aus vorhandenen Meldungen in allen vier Sprachen, und jeder neue oder geänderte Test schlägt ohne die Änderung fehl.
