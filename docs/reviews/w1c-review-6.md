# Code-Review W1c (#132), Runde 6: Merge-Commit 0553052f

Geprüft im Worktree `review-w1c-merge3` (detached, 0553052f): `git show --cc 0553052f` und `git diff 0553052f^2 0553052f -- src/ tests/`. Alle Dateien mit Konflikt gelesen: `PreviewChecks.svelte`, `PreviewEmpty.svelte`, `src/lib/statement-wizard.ts`, `statement-wizard.test.ts`, `statement-wizard.dom.test.ts`, `tests/e2e/questions/statement-generate.ts`. Ausserdem die Verdrahtung, die automatisch zusammengeführt wurde: `+page.server.ts` (setzt `partlyBilled`), `src/lib/server/statement-generation.ts` (setzt `changed`), `PreviewStep.svelte`, `ChangedStatements.svelte`, `StatementWizard.svelte:174`, die E2E-Targets/Tasks/Steps sowie `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/routes/statements/generate/PreviewEmpty.svelte:20-43 | Zusammenspiel von #298 und #132: Bei einer leeren Vorschau mit offenen Mietstagen (`open`) lässt #298 den Rat «löschen Sie ihn» bewusst weg (C-1/P-1). #132 nennt dort trotzdem jeden veralteten Entwurf mit «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … erfasst …». Der Hinweis bleibt so ohne Handlung oder lädt gerade zu dem Löschen ein, von dem #298 abrät. Das ist eine fachliche Frage und kein Merge-Defekt: `fach-reviewer` sollte entscheiden, ob dort ein Zusatz nötig ist. Kein Test deckt die Kombination `partlyBilled > 0` plus veralteter Entwurf ab. |
| C-2 | Nit | src/__tests__/statement-wizard.dom.test.ts:1024 | Der Test zu V-6 prüft nur `border-caution`. Eine Umsetzung, die immer «caution» setzt, würde ihn auch bestehen, denn für den Ton «info» ohne Befund gibt es keinen Test, auch nicht auf main. Eine Zeile `not.toContain('border-caution')` im #251-Test (Z. 946) würde das abdecken. |
| C-3 | Nit | src/routes/statements/generate/PreviewChecks.svelte:13-14 | Der Kopfkommentar sagt, bestehende Abrechnungen würden «only named (#251)». Seit V-6 warnt der Hinweis, sobald er eine Abrechnung nennt. Der Kommentar in Z. 39 sagt das richtig, der Kopfkommentar nicht. |

Keine Blocker und keine Majors.

### Bestätigt

- Konfliktlösung `PreviewChecks.svelte`: `existingNote` mit `sameSettingsNote` (#132) und `unbilledDays`/`existingTone` (#298) sind beide da. `confirming` hängt weiter nur an `unbilledDays`: Ein veralteter oder anders eingestellter Entwurf verlangt keine Bestätigung, wie es #132 und V-6 vorsehen (nur der Ton ändert sich). Ton «caution» bei `existing.some(row => row.changed.length)` entspricht V-6 (`docs/reviews/w1c-fachreview-1.md:91-95`). Die Farbe ist nicht der einzige Träger, denn mit dem Ton wechselt auch das Icon (`src/lib/ui/tone.ts`).
- Der V-6-Test ist rot ohne die Änderung: Die Zeilen haben `statements: 2` ohne `partlyBilled`, mit der Regel von main wäre der Ton also «info» (`border-accent`).
- `PreviewEmpty.svelte`: Die Props tragen `partlyBilled` und `changed`. `PreviewStep.svelte:36` gibt `invoiceRows`-Zeilen mit beiden Feldern weiter. Der Text von #298 (`statements_all_billed_lead` + `open ? … : …`) und die Liste veralteter Entwürfe von #132 stehen nebeneinander.
- `statement-wizard.ts`: `Coverage` und `invoiceRows` haben beide Felder. `step` liegt jetzt auf Modulebene und wird von `droppedNotes` und `sameSettingsNote` genutzt. `restoredStep` (#298) ist unverändert.
- Server: `invoicesInPeriod` liefert `changed`, `+page.server.ts:123` ergänzt `partlyBilled`. Die erwartete Zeile in `statement-generate-actions.test.ts` enthält beide.
- E2E: Es gibt je ein `existingStatements`-Target (Z. 16) und eine `existingStatementsText`-Question (Z. 144), beide von main. Die Steps (Z. 513, 574) nutzen sie. Die Targets `existingStatementNotes` und `existingStatementLink` von #132 bleiben, ihr Kommentar ist angepasst. Keine Duplikate, und die Schichtregeln sind eingehalten (Steps rufen nur Tasks und Questions auf).
- a11y/Sprachen: Die Zeilen `preview-outdated` (#132) und `draft-discard-dialog` (#298) stehen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Keine Änderung ohne Bezug zur Anforderung in den Konfliktlösungen.
- Neu ausgeführt: `bunx vitest run statement-wizard.dom.test.ts statement-wizard.test.ts statement-generate-actions.test.ts statement-generation.test.ts`: 155 bestanden.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die ganze Suite mit `bunx vitest run` (3042), das fallow-Audit, E2E `statement-generate.feature` (79) und die axe- und Sprachzeilen (8): vom Aufrufer gemeldet, nicht neu ausgeführt (keine E2E-Läufe nach den Regeln für Reviewer).
- Die Gleichheit der Schlüssel in den vier `messages/*.json` nach dem automatischen Merge habe ich nicht einzeln geprüft. Sie ist durch die gemeldete volle Vitest-Suite (i18n-Tests) abgedeckt, also vom Aufrufer gemeldet.
- Ob die Kombination aus C-1 (offene Mietstage plus veralteter Entwurf in der leeren Vorschau) fachlich einen Zusatz braucht: das entscheidet `fach-reviewer`, nicht dieses Review.
