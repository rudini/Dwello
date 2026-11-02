# Code-Review 736, Runde 2 (Abschlussrunde)

Bereich: `git diff b5d261db2 feaa9a47b` ohne Reviews, Plan, Archiv und Personas (Worktree `review-736-code2`)

Geschlossen: C-1, C-3, C-4

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Major | tests/a11y/screens.json (fehlt), src/routes/statements/[id]/ReminderFeedback.svelte:31 | Die Rückmeldung «E-Mail nicht zugestellt» mit Adresse und zwei Links hat weiterhin keine Zeile für axe und Sprachen. Die Begründung für die Ablehnung trifft nicht zu: Der Aufwand fällt nicht in jedem Beispiel der Suite an, weil sich das Seed pro Zustand einschränken lässt |
| C-5 | Major | src/routes/statements/[id]/+page.svelte:206 | Die Korrektur zu Persona P-1 ist eine Änderung, die der Nutzer sieht («Mahnung senden» verschwindet, solange die letzte Mahnung noch zu versenden ist). Ein Szenario ohne `@wip` dazu fehlt, und der Commit nennt kein `No scenario` |

## C-2 (Major): Rückmeldung nach einer nicht zugestellten Mahnung fehlt in a11y/Sprachen

Zur Ablehnung: Das Argument «Dutzende zusätzliche API-Aufrufe für jedes Beispiel der ganzen Suite» trifft nicht zu. `seedFor` und der Fixture-Aufbau legen schon heute Daten nur für einen bestimmten Zustand an: `tests/e2e/fixtures/screens.ts:81` (`if (state === 'key-revoke-dialog') await seed.accessKey(…)`) und `:306` (`upload-partial` …). So geht es auch hier günstig:
- Nur im Beispiel des neuen Zustands (z. B. `reminder-undelivered` auf `statement-detail-undelivered`) legt das Seed für Hugo zusätzliche überfällige Abrechnungen an, etwa eine pro Jahr: Rechnung, Abrechnung, Versand, Zahlungsfrist. Die anderen Beispiele bleiben unverändert.
- Für jeden Blick (Ansicht und Farbschema) mahnt `reachState` eine andere dieser Abrechnungen, mit einem Zähler wie `resultRuns` bei `generation-result` (`tests/e2e/tasks/accessibility.ts:139-141, 685-686`). Die Sperre `REMINDER_PREVIOUS_NOT_SENT` gilt nur für dieselbe Abrechnung.
- Ein Retry startet als neuer Test mit eigenem Seed.

Zum Argument «dieselbe Komponente wie C-1»: Das stimmt für die Links und die Texte, nicht aber für den Untergrund. In der Rückmeldung steht DeliveryFailure in einer `Alert` mit `tone="caution"` (`bg-caution-soft`). Der Text `text-ink-muted` der Adresse steht nur hier auf diesem Grund. Das Paar `ink-muted`/`caution-soft` fehlt in `src/__tests__/tokens.test.ts:31-54`. Nachgerechnet liegt es heute bei 8.0:1 (hell) und 7.2:1 (dunkel), es geht also durch. Eine Prüfung dafür gibt es aber nur, wenn axe diesen Zustand ansieht. Die Regel in CLAUDE.md («once per variant with its own controls») nimmt nur Zustände aus, die der E2E-Stack nicht herstellen kann. Dieser lässt sich herstellen.

Nachweis: `grep -n "reminder-undelivered\|feedback" tests/a11y/screens.json` findet keinen Zustand mit der Rückmeldung nach einer Mahnung.

## C-5 (Major): P-1 ohne Szenario

Warum falsch: Laut CLAUDE.md, Workflow 1, beginnt jede Verhaltensänderung, die ein Nutzer sieht, mit einem Szenario ohne `@wip`. Der DOM-Test «bietet keine weitere Mahnung an, solange die letzte noch zu versenden ist» deckt nur die untere Ebene ab. Auf dem Basis-Commit zeigt die Seite den Knopf, und der Dialog führt in die Ablehnung `REMINDER_PREVIOUS_NOT_SENT` (reminder.service.ts:77-78). Der E2E-Stack kann den Zustand ohne neuen Step herstellen. Ein neues Szenario in `statement-reminder.feature` genügt (neue Szenarien sind frei):
`Angenommen "Anna Keller" wünscht Korrespondenz per Brief` / `Und … ist auf der Detailseite der Abrechnung 2024 von "Anna Keller"` / `Wenn der Liegenschaftsverwalter eine Mahnung sendet` / `Dann bietet die Abrechnung keine Mahnung an`. Der Step besteht schon (`tests/e2e/steps/documents.steps.ts:124`). Auf b5d261db2 schlägt der letzte Step fehl.

Nachweis: `grep -rn "bietet die Abrechnung keine Mahnung an" tests/e2e/features` findet nur statement-reminder.feature:22 und :57 (Zahlungsfrist läuft) und statement-minimum-balance.feature:73. Keiner davon hat eine Mahnung, die noch zu versenden ist.

## Nicht bestätigt

- Vom Aufrufer gemeldet: vitest statement-pages und documents (252 bestanden) sowie der Rot-Lauf zu C-4, lint 0, svelte-check 0, E2E chromium statement-reminder, statement-detail, documents und dashboard (209 bestanden), axe- und Sprachzeilen undelivered, statement-sent-detail und documents (30 bestanden). Ich habe keine Tests ausgeführt.
- Ob `tests/unit/a11y-screens.test.ts` und `tests/unit/i18n-screens.test.ts` mit der neuen Zeile `statement-detail-undelivered` grün sind: Sie lesen screens.json und die Features, stehen aber nicht in den gemeldeten Läufen.
- Rot ohne Änderung bei C-3 (Guard `addressRefused`) und P-1 (`|| reminderToSend`): nur durch Lesen geprüft. Beide Tests schlagen ohne die jeweilige Zeile fehl.
- Ob kein Szenario ohne `@wip` mehr «Mahnung senden» öffnet, während eine Mahnung noch zu versenden ist: Ich habe in `tests/e2e/features` nach «Mahnung sendet/senden will» nach einer Mahnung gesucht, die noch zu versenden ist, und keinen Treffer gefunden (statement-redeliver.feature:37-45 mahnt nur einmal). Ausgeführt habe ich nichts.

Geprüft: Die Zeile zu C-1 führt auf Hugos überfällige Abrechnung mit einer nicht zugestellten Mahnung in «Mahnungen» und steht in beiden Features. `waiting` passt zur Sperre im Backend (`reminderToSend` wie in statement.service.ts:82). Der Kommentar in StatusActions stimmt. Die neuen DOM-Tests prüfen, was ihr Titel sagt. Nichts im Delta gehört nicht zur Anforderung.
