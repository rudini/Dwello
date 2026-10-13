# Code-Review B-13 (#143), Runde 3: Delta 673d38f..de39840

Geprüft: `git diff 673d38f..de39840` (Commit de39840 «fix(contracts): name unknown contracts at review»), alle 12 geänderten Dateien gelesen, dazu `ContractWizard.svelte`, `ContractForm.svelte`, `ApartmentStep.svelte`, `src/lib/contract-wizard.ts` (`stepErrors`), `tests/a11y/screens.json`, `tests/e2e/tasks/accessibility.ts`, die Persona-Berichte `docs/design/personas/{helga,sven}-b13.md` sowie die Issues #143 und #151 (`gh api`). `bunx vitest run` auf `contract-wizard.dom.test.ts` und `contract-edit.dom.test.ts`: 57 grün.

## Blocker/Major

### M1 (Major) Neuer UI-Zustand «Prüfen mit Hinweis» fehlt in der Axe- und Sprachprüfung

- `src/routes/contracts/new/ReviewStep.svelte:26-32` zeigt neu eine `Alert` (`review-contracts-unknown`) im Schritt «Prüfen». Das ist ein neuer Zustand des Bildschirms `contract-new`.
- `tests/a11y/screens.json:28` beschreibt `contracts-unknown` weiterhin als «the hint at the apartment, in the form also at the start», und die Aktivität `tests/e2e/tasks/accessibility.ts:179-183` wartet im Assistenten nur auf `apartmentContractsUnknown` (Schritt 2). `every-wizard-step` läuft ohne fehlschlagende Anfrage. Der Schritt «Prüfen» mit Hinweis wird also weder von axe (hell/dunkel, drei Viewports) noch von `sprachen-bildschirme.feature` je gerendert.
- CLAUDE.md, Design-Regeln «Process»: neue Zustände gehören in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Nachweis: `grep -n "review-contracts-unknown\|reviewContractsUnknown" tests/a11y tests/e2e/tasks tests/e2e/fixtures` findet nichts; der einzige Treffer ist das Fachszenario in `contract-new.feature:62`.
- Das Risiko ist gering (bestehende Meldung in allen vier Sprachen, bekannte `Alert`), die Regel verlangt den Zustand aber. Behebung: einen eigenen Zustand (z. B. `contracts-unknown-review`) mit Bedeutung in `stateMeanings`, Eintrag bei `contract-new`, Aktivität bis «Prüfen» mit `FailRequests` und Beispielzeilen in beiden Features. Alternativ die Aktivität `contracts-unknown` für `/contracts/new` bis «Prüfen» führen, dann prüft der Zustand aber Schritt 2 nicht mehr.

## Minor/Nit

- Minor `src/routes/contracts/new/PeriodStep.svelte:81-88`: Weil der Hinweis aus der Live-Region genommen wurde, ist er im Assistenten stumm, wenn die Anfrage erst in Schritt 3 fehlschlägt. Das passiert mit `?apartment=` in der Adresse: Schritt 2 lässt «Weiter» während `loading` zu (`ContractWizard.svelte:203-206`, `stepErrors` prüft nur `apartmentId`). Der Kommentar «read out at the apartment choice already» stimmt dann nicht. Die doppelte Ansage (Sven 3) gab es nur im Bearbeiten-Formular. Kein Test zeigt den Fall.
- Nit `src/routes/contracts/new/ReviewStep.svelte:13`: Der Standardwert `unknown = false` und das optionale `?` werden nicht gebraucht, weil der einzige Aufrufer (`ContractWizard.svelte:268`) die Eigenschaft immer übergibt.

## Triage der Persona-Befunde (implementation_plan.md, «Findings personas»)

- H1/Sven 4 behoben: DOM-Test `contract-wizard.dom.test.ts:256-270` und Szenario `contract-new.feature:62-66` (ohne `@wip`, `Scenario red` notiert). Dass trotzdem gespeichert werden kann, ist vertretbar, weil das Backend eine Überschneidung beim Speichern ablehnt (#143, «Problem»; `ContractWizard.svelte:171-175`). Die Screenplay-Schichten sind eingehalten: Schritt → Frage `reviewHint` (`Text.of`) → Ziel. Die Frage liefert den Text.
- Sven 3 behoben: `contract-edit.dom.test.ts:139-141` zeigt, dass nur der Hinweis bei der Wohnung in einer `status`-Region steht.
- H5 abgelehnt: Die Ablehnung hält. «Done means» von #143 verlangt den Hinweis bei der Wohnung und beim Vertragsbeginn, die doppelte Ansage ist mit Sven 3 behoben.
- H2, H3, Sven 5 nach #151: Das Issue ist korrekt geschrieben (Labels `bug`, `entscheiden`, Vorschlag zur Bestätigung, «Done means» mit Szenario und Tests). Inhaltlich hält das. Aber H2 und H3 sind Persona-Majors mit dem Status «open». Nach CLAUDE.md, Workflow Schritt 7, ist das Feature nicht fertig, solange ein Persona-Major offen ist. Sie gehören deshalb unter «Blocked on me» (Produktentscheid #151), oder sie werden mit Begründung abgelehnt (der Text ist in #143 entschieden). Ein «open: issue #151» allein schliesst sie nicht.
- H4 → U-15, Sven 1/2, H6-H8, Sven 6/7 → U-16: Das hält. Die Punkte sind nicht-funktional, und U-16 nennt Ort und nächsten Schritt. Die Zusammenfassung «Minor/Nit» passt: H7, H8, Sven 6 und Sven 7 sind Nits, H6 und Sven 1/2 Minors.

## Nicht bestätigt

- Das neue E2E-Szenario «Die Prüfung nennt die nicht geladenen Mietverträge» habe ich nicht ausgeführt. Grundlage sind nur der Code und die Notiz `Scenario red` in `implementation_plan.md:21`.
- Ob ein Screenreader den Hinweis in «Prüfen» beim Lesen ab der fokussierten Überschrift erreicht: Geprüft ist nur die DOM-Reihenfolge (Intro → Hinweis → Zusammenfassung), kein Screenreader. Ein neuer Persona-Lauf auf dem Delta H1 ist im Plan nicht vermerkt.
- `bun run lint`, `check`, `test:coverage`, Fallow und Deepcheck habe ich nicht ausgeführt.
