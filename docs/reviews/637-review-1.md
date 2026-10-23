# Code-Review #637, Runde 1 (d4d508cc..66294290)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/tasks/accessibility.ts:147-151 (`restoreDraft`), src/routes/statements/generate/StatementWizard.svelte:137-141 | Es bleibt ein Wettlauf: Der Zustand `draft-restored` wartet nur auf `draftRestored`, nicht darauf, dass Schritt 2 fertig geladen hat (`step-loading` unsichtbar). Liegt «Weiter» vor dem Laden im Fenster (wenige Gebäude in der E2E-Datenbank, z. B. ein Lauf allein; Desktop 1440x900), scrollt der Assistent weiterhin um die Höhe der Rechnungszeilen. Kommen diese nach `window.scrollTo(0, 0)` der Frage `accessibilityViolations` (tests/e2e/screenplay/questions.ts:216) an, misst axe eine gescrollte Seite, und obere Checkboxen liegen unter dem Sticky-Header (`Header.svelte:41`). Der Fix schliesst nur den Fall «Weiter unter dem Fenster», der heute in CI auftritt. |

## Ursachenanalyse

Hält: `restoreDraft` lädt die Seite neu und wartet nur auf den Hinweis «Angaben wiederhergestellt`; die Zeilen `generate-building-invoices-*` (BuildingChoice.svelte:96-100) kommen danach asynchron. Wenn `loading` auf false wechselt, misst `$effect.pre` die Lage von «Weiter» vor dem DOM-Update und scrollt nach `tick()` um die Differenz. Kommt das nach dem `scrollTo(0, 0)` der axe-Frage, bewertet axe eine um etwa die Zeilenhöhe gescrollte Seite, und `target-size` meldet eine Checkbox, die teilweise unter dem Sticky-Header liegt. Das passt zum Ziel `label:nth-child(10)`, also zu vielen Gebäuden, bei denen «Weiter» auf Mobile und Tablet unter dem Fenster liegt. Die neue Bedingung `before > window.innerHeight` verhindert genau diesen Sprung. Für einen Liegenschaftsverwalter, der oben liest, ist das ebenfalls richtig: Inhalt wächst unterhalb des sichtbaren Bereichs, dann verschiebt sich nichts Sichtbares.

Rest-Wettlauf: siehe C-1. Er bleibt bestehen, weil der Assistent bei sichtbarem «Weiter» absichtlich weiter scrollt (#470). Robust gegen den Testablauf wäre, wenn der Zustand `draft-restored` (oder `restoreDraft`) zusätzlich auf das Ende des Ladens wartet. Das gehört zur Aufgabe «wartet auf den Zustand, zu dem sie führt» (tests/e2e/CLAUDE.md). Ob das in CI auftritt, hängt von der Zahl der Gebäude ab. Auf Tablet (Höhe 1180) schlug der Test lokal fehl, also lag «Weiter» bei diesen Daten sogar dort unter dem Fenster. Mit gleich vielen Gebäuden auf Desktop (Höhe 900) ist der Fall daher unwahrscheinlich, aber nicht ausgeschlossen.

Geprüft: Der Fix und sein Kommentar entsprechen der Anforderung. Der neue DOM-Test ist ohne den Fix rot: jsdom `innerHeight` 768, «Weiter» bei 868, ohne die Bedingung käme `scrollBy(0, 220)`. Der bestehende Test bleibt über den Helfer `rowsArrive` erhalten. Der Diff enthält nichts Fremdes und keine neuen Texte oder Bildschirme. Die Verhaltensänderung hat ein Szenario: Das in #637 rote Beispiel `statement-generate draft-restored` in accessibility.feature ist ohne `@wip`. Die Commit-Nachricht hält die Konventionen ein. Ponytail: Der Diff ist minimal.

## Nicht bestätigt

- lint, `bun run check`, `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` (93 grün, neuer Test vorher rot): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- E2E `accessibility.feature -g "statement-generate draft-restored" --repeat-each 16` (16 grün) und `accessibility.feature sprachen-bildschirme.feature -g "statement-generate "` (50 grün): vom Aufrufer gemeldet. E2E darf ich nicht starten.
- Ob «Weiter» auf Desktop bei der Gebäudezahl in CI vor dem Laden im Fenster liegt (C-1): nicht messbar ohne E2E-Lauf. Angesehen habe ich tests/a11y/screens.json:967-980 (Viewports) und tests/e2e/tasks/accessibility.ts:140-151, 767-793.
