# Code-Review #1166, Runde 2 und Abschlussrunde (319f284..4f0cc70, Merge b009e7e)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | src/routes/config/+page.svelte:224-225 | Noch offen: `accountHolderName` hat `error` und zusätzlich `invalidBy={namedBy('accountHolderName')}`, deshalb steht `accountHolderName-error` zweimal in `aria-describedby` (`Field.svelte:81`) |

Geschlossen: C-1, C-2, C-4, C-5, C-6

- C-1: `account-holder-missing` (`tests/e2e/tasks/accessibility.ts:298-304`) trägt die IBAN ein und leert Name, PLZ und Ort. Hat ein paralleles Szenario einen Kontoinhaber gespeichert, ist das Häkchen schon weg; `Uncheck` ändert dann nichts. Die BFF sendet die leeren Felder, und `creditorMissing` (`backend/src/services/config.service.ts:206-218`) liest `changes[key] = ''` vor dem gespeicherten Wert. Mit `separateHolder` gibt es also immer `ACCOUNT_HOLDER_MISSING`. `setMultipleConfig` schreibt bei einem Fehler nichts (`:285-288`). Weil `Wait.until` `.first()` nimmt (`screenplay/interactions.ts:133`), stört eine zweite Fehlermeldung `formErrors` nicht.
- C-2: `text.startsWith(`${absender}\n`)` würde rot, wenn der Kopf der Mahnung auf «Erika Muster» wechselte.
- C-4: Der Schritt ist umbenannt. Die alte Formulierung und `settingsError` kommen nirgends mehr vor. Das Szenario ist neu in diesem PR, darum gibt es keine Spezifikationsänderung.
- C-5, C-6: Das Delta nutzt `saveSettings` und `formErrors` wieder, die Fixture `accountOf(iban)` an beiden Stellen. Der Body des PUT bleibt gleich.

Geprüft: Alle sechs Dateien des Delta sind gelesen. Der Merge b009e7e übernimmt README.md und `docs/archive/implementation-plan-verlauf.md` unverändert vom main-Elternteil 5ca8178 (`git diff b009e7e^2 b009e7e -- README.md docs/archive` ist leer). Er enthält keinen App-Code aus einer Konfliktlösung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, auf 4f0cc70: `bun run lint`, `bun run check`, Backend `bun test src/__tests__/reminders.pg.test.ts -t Kontoinhaber`, E2E chromium `-g "Bildschirm ohne .* config |Kontoinhaber"` (13 bestanden). Auf 319f284: lint, check, fitness, Backend type-check, `vitest --changed` (557), Backend-Tests der berührten Services (459), E2E von settings, statement-detail und statement-reminder (177). Nicht selbst ausgeführt.
- Dass der Text des Mahnungs-PDF mit dem Firmennamen und einem Zeilenumbruch beginnt, habe ich nur aus dem gemeldeten grünen Lauf geschlossen. Die Textextraktion in `reminderPdf` habe ich nicht nachgelesen.
- Aus Runde 1 weiter offen und nicht Teil dieses Delta: Ob die Datenschutzerklärung den Kontoinhaber als Empfänger von Daten im PDF nennen muss (`messages/de.json`, `privacy_mail_*`). Das gehört zum `fach-reviewer`.
