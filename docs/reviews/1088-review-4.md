# Code-Review #1088, Runde 4 (Abschlussrunde vor dem ersten Push)

Gegenstand: `git diff 7c8642d 3cd6e7e -- . ':!docs/reviews' ':!docs/archive'` und `git show --remerge-diff e6bbbe6` (Worktree review-1088e-code, e6bbbe6). Vorheriger Bericht: docs/reviews/1088-review-3.md.

Geschlossen: C-8, C-9 (am Mietvertrag; der Teil zur Übersicht ist C-11)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Minor | tests/e2e/steps/statement-generate.steps.ts:735-739 | Bleibt offen, wie vom Aufrufer gemeldet: Das Szenario stützt sich auf die Mehrheit der Gebäude paralleler Szenarien. |
| C-11 | Major | src/lib/overview.ts:237-245; backend/src/services/contract-tasks.service.ts:61-70; backend/src/services/statement-run.service.ts:119-136 | Die Übersicht nennt eine Periode, die nur ausserhalb von Dwello abzurechnen ist, wie jede andere fehlende Periode. Sie führt mit «Abrechnungen erstellen» in den Assistenten und sagt «erstellen Sie dann die Abrechnungen». Der Entscheid vom 04.11.2026 verlangt für die Übersicht das Gegenteil. Einzelheiten unten. |
| C-12 | Minor | src/routes/contracts/[id]/MissingStatement.svelte:19, :29 | Fehlt nur eine Periode und ist sie nur ausserhalb abzurechnen, zeigt der Hinweis weiter `contracts_statement_missing_text`: «Der Assistent erstellt die Abrechnungen für alle Mietverträge des Gebäudes. Erfassen Sie zuerst die Rechnungen der Periode.» Darunter folgt der neue Satz, dass Dwello die Periode nicht abrechnen kann. Es gibt keine Schaltfläche in den Assistenten. Der erste Satz stimmt in diesem Zustand nicht, und die beiden Sätze widersprechen sich. Der DOM-Test (contract-detail-page.dom.test.ts:340) prüft nur zwei Perioden. |
| C-13 | Minor | docs/api-specification.md:106 | `GET /contracts/:id/missing-statements` ist weiter als `[{ start, end }]` beschrieben. Das neue Feld `outside` fehlt. Der Text sagt damit etwas Falsches über die Antwort. |
| C-14 | Minor | tests/e2e/steps/statement-detail.steps.ts:375-377 | Main (#734) hat den Schritt «der Liegenschaftsverwalter von dort zurückkehrt» nur für das Szenario «Die Fehlerseite des Briefs zur Zustimmung …» eingeführt. Die Merge-Auflösung löscht das Szenario, lässt den Schritt aber stehen. `grep -rn "von dort zurückkehrt$" tests/e2e/features` findet keinen Treffer. Der Schritt ist damit ungenutzter Code. |

## C-11: Die Übersicht führt in den Assistenten

Der Entscheid in #1088, Abschnitt «Decided (product owner), code review 1088-3», vom 04.11.2026 lautet: «The reminder on the contract page and in the Übersicht still names them, without a way into the wizard, and says to bill them outside Dwello and record «Abgerechnet bis».» Die Commit-Nachricht von 3cd6e7e sagt dasselbe auch für die Übersicht. Im Code gilt das nur für die Seite des Mietvertrags.

- `missingByContract` (statement-run.service.ts:119-136) gibt nach dem Entfernen des Filters die überschnittenen Perioden wieder zurück, aber ohne `outside`. Das Feld setzt nur `missingOfContract`.
- `contract-tasks.service.ts:61-70` fasst die Perioden je Gebäude als `{ start, end }` zusammen. Damit kann auch das BFF eine solche Periode nicht unterscheiden.
- `overview.ts:237-245` zeigt dazu die Aufgabe «Nebenkostenabrechnungen erstellen» mit dem Text `dashboard_task_missing_period(s)_text`, also «Noch nicht abgerechnet: Seeblick (2023, 2022). Erfassen Sie zuerst alle Rechnungen dieser Periode und erstellen Sie dann die Abrechnungen.». Die Hauptaktion «Abrechnungen erstellen» führt nach `/statements/generate`. Dort sperrt Schritt 2 das Gebäude für genau diese Periode (Überschneidung, C-7).
- Ein Hinweis, die Periode ausserhalb von Dwello abzurechnen und «Abgerechnet bis» einzutragen, fehlt in der Übersicht.

Der Liegenschaftsverwalter folgt also der Aufgabe der Übersicht in einen Assistenten, der die Periode nicht abrechnen kann. Genau diesen Weg sollte der Entscheid ausschliessen. Ist das die einzige fehlende Periode, bleibt die Aufgabe für immer stehen und führt immer wieder in die Sperre.

So zeigt man es: Im Aufbau von statement-run.pg.test.ts:155 ff. `GET /api/v1/dashboard` aufrufen. `contractTasks.missingStatements` nennt für das Gebäude 2023-01-01 und 2022-01-01 ohne jede Markierung. In overview.test.ts ergibt eine solche Eingabe die Aufgabe `missing-period` mit `href: '/statements/generate'`. Es fehlt ein Test, der für die Übersicht `outside` verlangt (Backend-Antwort und Vertrag `contracts-missing-statements.json` bzw. `dashboard.json`, Text in allen vier Sprachen).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (Worktree ohne node_modules):
  - auf e6bbbe6: lint, check, Backend type-check, vitest (4053), fitness, bddgen ohne fehlende Schritte;
  - auf 3cd6e7e: Backend-Suite (1991), E2E contract-detail und dashboard (104 bestanden);
  - der volle Chromium-Lauf von e6bbbe6 läuft noch.
- Ob die Tests rot waren, habe ich nur durch Lesen beurteilt:
  - pg-Test `outside` (statement-run.pg.test.ts:175-183): rot ohne die Änderung, denn vorher filterte `missingPeriods` 2022 und 2023 weg.
  - DOM-Test (contract-detail-page.dom.test.ts:338): rot ohne den `{:else}`-Zweig.
  - BFF-Ablehnung (statement-generation.test.ts:143): rot ohne `b.overlap?.length` in `contractsInPeriod`. Laut Commit wurde Rot gezeigt.
- Kein Szenario und keine a11y- oder Sprachzeile für die neue Variante am Mietvertrag (Periode ohne Weg in den Assistenten). Das E2E-Gerüst hat keinen direkten Datenbankzugriff (tests/e2e/fixtures/backend.ts). Das Backend lehnt jede überschneidende Abrechnung ab. Der Zustand ist also wohl nicht herstellbar. Dafür braucht es `No scenario: <Grund>` im Pull-Request-Text. Weder die Commit-Nachricht noch implementation_plan.md nennen das. Den Pull-Request-Text gibt es noch nicht.
- Merge: Die Auflösung löscht ein Szenario von main ohne `@wip` («Die Fehlerseite des Briefs zur Zustimmung …», #734). Das verlangt `Spec change approved: #1088` im Pull-Request-Text. Inhaltlich deckt das #1088 («consent letter … removed … scenarios»). Den Text konnte ich nicht sehen.
- Den Entscheidtext habe ich über die REST-API aus dem Body von #1088 gelesen.

Geprüft: Remerge-Diff (Route, `letter` in `pdfRefusal` und der Fehlerseite, `documents_refused_letter` in allen vier Sprachen, pdf-refusal.test.ts) ohne Reste ausser C-14, keine a11y- oder Sprachzeile von main für den Brief; Texte `contracts_statement_missing_outside` in allen vier Sprachen mit dem Feldnamen der jeweiligen Sprache; Verträge contract-missing-statements.json und README; `overlapped` ohne `same`, ersetzte Abrechnungen wie im Lauf; contract-actions.test.ts über den Vertrag; ponytail-review: nichts zu kürzen ausser C-14.
