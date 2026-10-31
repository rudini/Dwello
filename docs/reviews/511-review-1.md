# Code-Review #511, Runde 1 (7261dbb, Bereich a3b5743..7261dbb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/features/contract-detail.feature:24 | Das neue Szenario steht zwischen dem Kommentar «# Der Mieter kündigt auf einen späteren Termin: der Vertrag läuft bis dahin weiter» und dem Szenario «Mietvertrag auf ein künftiges Datum beenden», zu dem er gehört. Jetzt steht der Kommentar über dem #511-Szenario und sagt dort etwas Falsches. Das neue Szenario mit seinem Kommentar gehört über Z. 24 oder hinter das Szenario «künftiges Datum». |
| C-2 | Minor | tests/e2e/features/statement-detail.feature:306 | «Ohne vereinbarte Verwaltungspauschale nennt das PDF keine» ist auch ohne die Änderung grün: Der Basis-Commit druckt den Satz nie. Laut Aufrufer wurden nur drei der vier @wip-Szenarien rot gesehen. Weder 49cebca noch 7261dbb nennen das Szenario als Pin von bestehendem Verhalten (CLAUDE.md, Workflow 2). Die Bedingung `managementFee > 0` ist im Backend-Test abgedeckt (agreed-categories.pg.test.ts:45, rot über den Teil mit Pauschale). Fix: im PR-Text oder in der nächsten Commit-Message nennen, dass das Szenario bestehendes Verhalten pinnt. |

Blocker/Major: keine.

## Nicht bestätigt

- Vom Aufrufer gemeldet: lint, check, backend type-check, fitness, `bunx vitest run --changed origin/main` (559), backend agreed-categories.pg.test.ts (19; der neue Test rot gesehen), E2E chromium contract-detail, help, statement-detail, statement-agreed-costs (223) sowie die axe-/Sprach-Zeilen der Dialogzustände von contract-detail und von help (12). Drei @wip-Szenarien wurden an den fehlenden Texten rot gesehen. Ich habe nichts davon selbst ausgeführt.
- `Spec change approved: #511` für den gekürzten Anker in tests/e2e/steps/contract-detail.steps.ts:464 (Punkt nach «angekommen ist» entfernt): Der PR-Text existiert noch nicht. Das Issue #511 entscheidet unter «Decided (product owner)» den neuen ersten Satz (M-1). Der Anker prüft weiter denselben Satzteil und den Satz zur Kündigung des Mieters.
- Der PR-Text muss sagen, dass UBIQUITOUS_LANGUAGE.md nur in den drei Zeilen geändert wurde, die V-2 im Issue nennt. Der PR existiert noch nicht.
- Rechtlich offene Punkte der Fachreview 511-1 («unsicher»: Empfang beim Mieter bei M-1; Art. 257a Abs. 2 OR) habe ich nicht geprüft; sie liegen bei der Fachreview.

Geprüft: alle Texte in de/fr/it/en gegen die Tabelle in docs/reviews/511-fachreview-1.md (wörtlich gleich); die Glossarzeilen gegen «Fehlende Begriffe»; die PDF-Bedingung `managementFee > 0` wie die Zeile auf Seite 1 (pdf.service.ts:969), die Höhe des Hinweisblocks rechnet die neue Zeile mit; keine Reste der alten Texte in src/tests/backend; die verwendeten Steps, Targets und `Accessible.descriptionOf` existieren; die Screenplay-Schichten; keine neuen Bildschirme oder Zustände.
