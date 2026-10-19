# Code-Review #439, Runde 2 (Delta 778c21c9..dd42b948)

Worktree: `review-439-code2` (detached auf dd42b948). Gelesen: alle geänderten Dateien des Deltas, dazu `AgreedCosts.svelte`, `AgreementQuestion.svelte`, `WizardNav.svelte`, `Button.svelte`, `FailRequests` in `tests/e2e/screenplay/interactions.ts`, die Steps in `agreed-costs.steps.ts`.

## Status der IDs aus Runde 1

| ID | Status |
|----|--------|
| C-1 | erledigt (d7932d45) |
| C-2 | bestand schon vorher, bleibt offen wie gemeldet |
| C-3 | abgelehnt, Begründung trägt (`error` ist dieselbe Prop wie bei `AgreementQuestion`) |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | `src/routes/statements/generate/StatementWizard.svelte:121-124`, `tests/e2e/features/statement-agreed-costs.feature:100-109` | Das automatische Weitergehen nach erfolgreichem «Erneut versuchen» hat weder ein Szenario noch einen DOM-Test. Der neue Text verspricht es aber («Gelingt die Prüfung, geht es weiter»). |
| C-5 | Minor | `messages/*.json` (`statements_agreements_wait`, `statements_agreements_wait_failed`) | Beide Texte versprechen «geht weiter». Lädt die Prüfung aber mit offenen Fragen, hält der Assistent bei den Fragen an (Fehler `statements_agreement_error`). Nach dem Beantworten muss der Liegenschaftsverwalter wieder selbst «Weiter» wählen, weil `onchange` → `edited()` die `errors` leert. Der Text verspricht also mehr, als der Assistent tut. |

## C-4 (Major)

**Warum falsch:** Das Delta bringt eine Verhaltensänderung, die Nutzer sehen: Nach einem «Weiter», das blockiert war, sendet der Assistent selbst ab, sobald die Prüfung fertig ist. Das gilt in zwei Fällen: wenn die Prüfung noch lädt, und wenn sie fehlgeschlagen ist und dann «Erneut versuchen» gelingt. Den zweiten Fall nennt der neue Fehlertext ausdrücklich. Abgedeckt ist nur der Lade-Fall, und zwar durch einen DOM-Test (`statement-wizard.dom.test.ts`, «geht nach «Weiter» während der Prüfung weiter …»). Das geänderte Szenario «Die vereinbarten Nebenkosten lassen sich nicht prüfen» prüft nur den Text, nicht das Weitergehen. Nach `CLAUDE.md` (Workflow 1) braucht eine sichtbare Verhaltensänderung ein Szenario ohne `@wip`. Der E2E-Stack kann den Zustand herstellen: `FailRequests.noLonger` hebt die Störung auf (siehe `contractsLoadAgain` in `tests/e2e/tasks/contract-form.ts:60`). Danach führt «Erneut versuchen» zur Vorschau. Der Lade-Fall selbst ist in E2E nicht erreichbar, ohne Daten zu erfinden. Der DOM-Test reicht dafür.

**Wie zeigen, dass es fehlschlägt:** Das bestehende Szenario um diese Schritte erweitern: «Wenn das Prüfen der vereinbarten Nebenkosten wieder geht und der Liegenschaftsverwalter die Prüfung erneut versucht, Dann zeigt der Assistent die Vorschau». Heute fehlen diese Schritte. Nimmt man den `$effect` heraus, bleibt der Assistent stumm bei Schritt 3, und nur der eine DOM-Test zum Lade-Fall schlägt fehl. Das gegebene Versprechen für den Fehlerfall prüft kein Test.

## Geprüft ohne Befund

- **Schleifen und doppeltes Absenden:** `requestSubmit` → `submitStep` berechnet `errors` neu. Weil `agreementsBlocking` nun false ist, wird `errors = {}` und `busy = true`. Danach greift der Effekt nicht mehr. Scheitert der Server, setzt `answered` `busy = false` und lässt `errors` leer: keine Schleife. Während `busy` ist «Weiter» belegt (`WizardNav`, `Button {busy}`).
- **Nach dem Beantworten von Fragen:** Die Radios liegen im Formular. `onchange`/`oninput` → `edited()` leert `errors` synchron, bevor der Effekt läuft. Es gibt also kein ungewolltes Absenden nach einer Antwort. Wählt jemand «Weiter», während die letzte Antwort noch gespeichert wird, geht der Assistent nach dem Speichern weiter. Auf dem Basis-Commit blieb er dort stumm stehen. Das ist plausibel gewollt.
- **«Erneut versuchen»:** `Button` hat standardmässig `type="button"`, sendet also nicht ab und löst kein `input` aus. `errors.agreements` bleibt stehen, bis die Prüfung fertig ist. Das ist so gewollt.
- **Rückkehr zu Schritt 3 mit altem `errors.agreements`:** `goTo` leert `errors` nicht. Schritt 3 erreicht man aber nur über ein Absenden in Schritt 2 (berechnet `errors` neu), über «Zurück» aus Schritt 4 (davor lief ein erfolgreiches Absenden mit `errors = {}`) oder über `restoredStep` beim Mount (`errors = {}`). Ein ungewolltes Absenden finde ich auf keinem dieser Wege.
- **Tests rot ohne Änderung (gelesen):** Ohne den Effekt bleibt `wizard-status` im neuen DOM-Test leer, er schlägt also fehl. Die zwei geänderten Erwartungen (`agreed-costs.dom.test.ts:107`, Feature Zeile 109) schlagen mit den alten Texten fehl.
- **i18n:** Den neuen Schlüssel und den geänderten Text gibt es in allen vier `messages/*.json`, ohne Deutsch in fr/it/en. Der Zustand `agreements-failed` in `tests/a11y/screens.json` wählt «Weiter», er zeigt also den neuen Fehlertext für axe und die Sprachenprüfung.
- **Design/Tokens:** Am Markup ändert sich nichts ausser dem Text.
- **Ponytail:** Der Diff ist schlank (ein Effekt, eine Bedingung im Template). Lean already.
- **U-40** (Fokus nach «Erneut versuchen»): Das Verhalten besteht laut Sven-Bericht schon auf dem Basis-Commit. Das Delta ändert es nicht, also ist der Eintrag in `offene-punkte.md` folgerichtig.

## Nicht bestätigt

- `bun run lint`, `bun run check`, E2E chromium `-g "vereinbarten Nebenkosten|agreements-failed|agreed-costs"` (22 passed): vom Aufrufer gemeldet.
- Dass die drei geänderten Tests zuerst rot waren: vom Aufrufer gemeldet. Nach dem Lesen schlagen sie ohne die Änderung fehl (siehe oben).
- Selbst nochmals ausgeführt: `bunx vitest run src/__tests__/agreed-costs.dom.test.ts src/__tests__/statement-wizard.dom.test.ts`, 78 bestanden.
- Ob ein Screenreader das Weitergehen nach dem automatischen Absenden ansagt (Persona-Frage, Sven P-3): nicht prüfbar ohne Persona-Lauf. Ich habe nur den Code gelesen: `wizard-status` zeigt «Vorschau wird berechnet», danach fokussiert `goTo(4)` die Überschrift.
