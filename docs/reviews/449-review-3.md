# Code-Review #449 (mit #491), Runde 3: nur die Fixes

Worktree `w5-review-449-code3`, detached `753dc7e4`. Delta: `git diff 94d75768 753dc7e4 -- . ':!docs/reviews'` (15 Dateien, alle gelesen). Dazu habe ich `94d75768` (nur die Migration umbenannt und `docs/data-model.md`) und den Merge `236c154c` angesehen; `--remerge-diff` ist leer.

## Status der offenen IDs aus 449-review-2.md

| ID | Status | Beleg |
|---|---|---|
| C-8 | geschlossen | `statement-send.feature:42-44`: Der neue Schritt «bietet die Detailseite der Abrechnung den Versand als "Als versendet markieren" an» liest die Beschriftung von `statement-send-button` als Wert (`Text.of(sendStatementButton)`, `toBe`). Nimmt man `+page.svelte:69` zurück, heisst der Knopf «Per E-Mail senden», und der Schritt schlägt fehl. Der Wenn-Schritt ist jetzt neutral («die Abrechnung versenden will»). Der alte Schritt «per E-Mail senden will» wird in `:21` weiter gebraucht, er bleibt also nicht ungenutzt zurück. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-9 | Minor | `messages/fr.json:1297` | «Imprimez-le depuis cette page.» schickt den Verwalter auf «diese Seite», also auf die Detailseite, wo der Dialog offen ist. Der PO-Entscheid (Helga P-1) und de/it/en sagen «dort», also unter «Dokumente» («Drucken Sie sie dort aus.», «Lo stampi da lì.», «Print it from there.»). Der Satz davor nennt « Documents », die Leserin bezieht «cette page» aber auf die Seite, die sie vor sich hat. Damit wäre die Reihenfolge, die der Entscheid festlegt, im Französischen wieder offen. Vorschlag: «Imprimez-le à partir de là.» Sonst ist der Text richtig gesetzt: U+00A0 innerhalb von « Documents », kein `: ; ? ! %`, «Marquez … comme envoyé» passt zu «Marquer comme envoyé» (`i18n-begriffe.md:137`), «remettez» passt zu `statements_send_text_2`. Auch it («Segni … come inviato», «recapita», «Documenti» ohne Leerzeichen) und en («Mark … as sent», «Documents») stimmen mit den Begriffen und #405 überein. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Weber P-1/P-2 (Entscheid A):** `reminder.service.ts:136` setzt `byEmail = channel === 'email' && !!email`. Ohne Adresse wird das Dokument mit `channel: 'letter'` und `to_send` angelegt, ohne `deliveryError`, und es wird keine E-Mail versucht (`:153`). `deliverByEmail` verlangt jetzt eine `string`. `ReminderFeedback.svelte:18-20` zeigt deshalb `statements_reminder_letter`, die Meldung für einen Brief, wie es der Entscheid will. `TENANT_NO_EMAIL` bleibt in `DELIVERY_ERRORS` (`document.service.ts:47`), damit alte Datensätze ihren Code behalten. Das deckt der pg-Test mit gespeichertem Text ab (`reminders.pg.test.ts:205-211`). Rot: Auf der Basis legte `sendReminder` das Dokument mit `channel: 'email'` und `TENANT_NO_EMAIL` an, also scheitern der pg-Test `:196-203` und das Szenario `statement-reminder.feature:97-103` (Meldung «nicht zugestellt» statt «als Brief zum Ausdrucken bereit»). Der Dialog vor dem Senden (`statements_reminder_no_email`) beschreibt das neue Verhalten schon.
- **Test und Szenario «nach gescheiterter E-Mail per Post»:** Der pg-Test `:438-450` stellt das Dokument einer abgewiesenen E-Mail per `db.update` nach. Das Szenario `statement-reminder.feature:63` nutzt den vorhandenen Schritt mit der Adresse, die der Mailserver abweist (`statement-send.steps.ts:13`). Die Strenge bleibt dieselbe.
- **Helga P-1:** Der deutsche Text entspricht wörtlich dem Entscheid in #449. Der DOM-Test (`statement-pages.dom.test.ts:1215-1218`) und der Schritt in `statement-detail.feature:92` fragen den Text des Dialogs als Wert ab (`toContain`). Beide sind auf der Basis rot, weil dort der alte Text steht. Der Text steht in allen vier `messages/*.json`.
- **Weber P-3/P-4 (Entscheid B):** Issue #545 ist offen und trägt `fachlich` und `entscheiden`. Im Code ist dazu nichts geändert.
- **`api-specification.md:266`** beschreibt das neue Verhalten richtig.
- **Screenplay:** Die neuen Schritte rufen nur Tasks und Questions auf (`openDocuments`, `documentFor`, `sendButtonLabel`, `sendConfirmation`). Die Features beschreiben, was der Verwalter will, nicht wie er klickt.
- **Neue Bildschirmzustände:** keine. Die Meldung «als Brief zum Ausdrucken bereit» und der Briefdialog gab es schon, deshalb ändern sich `screens.json` und die a11y- und Sprach-Features nicht. Den Fall Carla (E-Mail ohne Adresse) setzt `tests/e2e/fixtures/screens.ts:74-77` schon auf.
- **Nichts Fremdes im Delta.**
- **Migration `94d75768`:** Es ist nur eine Umbenennung. Der pg-Lauf meldet «30 Migrationen».

## Nicht bestätigt

- Selbst neu laufen lassen: `bun test src/__tests__/reminders.pg.test.ts` (mit `TEST_DATABASE_URL=…/dwello_test_r449e`): 41 grün. `bunx vitest run src/__tests__/statement-pages.dom.test.ts`: 167 grün.
- Vom Aufrufer gemeldet, nicht neu laufen lassen: lint, check, type-check. Der ganze vitest-Lauf (3 Tool-Tests mit Timeout, allein grün). `statement-mail.pg` und `api-contracts.pg`. E2E auf 8 Features (205 grün). Die Axe- und Sprachzeilen (26 grün). Laut Auftrag habe ich kein E2E gestartet.
- Die roten Läufe des neuen Szenarios und der Schritte habe ich nur durch Lesen des Codes auf `94d75768` beurteilt, nicht ausgeführt.
- Ob `fach-reviewer` die neuen fr/it/en-Texte geprüft hat, habe ich nicht gefunden. Unter `docs/reviews/` gibt es dazu nur `449-fachreview-1/2.md`, beide älter als der Entscheid zu Helga P-1.
