# Review #1270, Runde 1 (40c2993d..1c73dab5)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tools/open-work/check-issues.mjs:212, :233–238 | Eingerückte Schrittdefinitionen in `for`-Schleifen (`Then(step, …)`) werden nicht erkannt; ein nicht erkanntes Muster fällt still auf «passt auf nichts» zurück (fail-open). Es gibt vier solche Definitionen mit sechs Schritten, und Szenarien ohne `@wip` brauchen sie. |
| C-2 | Minor | tools/open-work/check-issues.test.ts:350 | Der Test «neuer Schritt» hängt den neuen Schritt hinter eine Definition an, die nur `@wip`-Szenarien brauchen. Damit ist die Grenze `+start + 0.5` (Zeile 217) ungeprüft: ein Off-by-one, das eine Einfügung direkt nach dem `});` einer Definition dieser zuschlägt, bliebe grün. Der häufigste Fall, ein neuer Schritt hinter einem benutzten, würde dann fälschlich rot. |
| C-3 | Minor | tools/open-work/check-issues.mjs:246 | Den Rückgriff über `process.cwd()` nutzt CI als einzigen Weg, denn das Skript liegt dort in `$RUNNER_TEMP`. Kein Test deckt ihn ab: alle Tests starten das Skript aus `tools/open-work/`, wo schon `import.meta.url` greift. |
| C-4 | Minor | tools/open-work/check-issues.mjs:247 | `@cucumber/cucumber-expressions` steht nicht in `package.json`. Das Paket wird nur über `playwright-bdd` transitiv und gehoistet gefunden (bun.lock:119). Ändert ein Update das Layout, wirft das Skript und jeder Pull Request mit geänderter Schrittdatei wird rot. |
| C-5 | Minor | tests/e2e/CLAUDE.md:86 | Der neue Text sagt, `check-issues.mjs` lasse den Pull Request bei jeder geänderten Schrittdefinition scheitern. Ausgenommen sind aber Definitionen, deren Prüfung in einem Helfer der Schrittdatei steht: `listsNo` in documents.steps.ts:215–225 trägt die ganze Prüfung samt positivem Anker. Wird der Helfer gelockert, bleibt das grün; dazu kommen die Fälle von C-1. Der Text verspricht mehr, als CI prüft. |

## C-1 (Major): Schrittdefinitionen in Schleifen bleiben unsichtbar

Warum falsch: Laut Entscheid ist eine geänderte oder entfernte Schrittdefinition, die ein Szenario ohne `@wip` auf der Basis braucht, ohne `Spec change approved: #n` rot. `changedSteps` sucht nur `^(Given|When|Then)\(` in Spalte 0. Auf der Basis gibt es diese Definitionen eingerückt in einer Schleife:

- tests/e2e/steps/invoice-detail.steps.ts:202–208 (`steht beim Betrag der Rechnung {string}`, gebraucht von invoices.feature:318 und invoice-detail.feature:178 «Abgezogene Akontorechnungen beim Betrag»)
- tests/e2e/steps/invoice-detail.steps.ts:210–213
- tests/e2e/steps/invoice-upload.steps.ts:283–286 (`erinnert Dwello daran, die Originalrechnungen aufzubewahren`, gebraucht von invoices.feature:95 «Mehrere Rechnungen hochladen und erstellen»)
- tests/e2e/steps/statement-detail.steps.ts:399–402 (`der Liegenschaftsverwalter die Fehlerseite verlässt`, gebraucht von invoice-detail.feature:216)

Schon die Erkennung fehlt. Selbst wenn sie da wäre, liefert `matcher` für `Then(step, …)` das Literal `''` und baut daraus `CucumberExpression('')`. Dieser Ausdruck passt auf keinen Schritttext, also meldet das Skript nichts: fail-open statt fail-closed.

So zeigt man es: in invoice-detail.steps.ts:207 `.toContain(text)` durch `.toBeDefined()` ersetzen, committen und `BASE_REF=main node tools/open-work/check-issues.mjs` mit leerem `PR_BODY` laufen lassen. Das Ergebnis ist Exit 0, obwohl die Prüfung von zwei Szenarien ohne `@wip` schwächer wird. Im Testrepo von `check-issues.test.ts` geht es ebenso: `for (const step of ['sieht der Liegenschaftsverwalter nichts']) Then(step, …)` mit eingerücktem Körper, gebraucht von einem Szenario ohne `@wip`.

Mögliche Abhilfe: Definitionen auch eingerückt erkennen. Ist das Muster kein Literal, gilt die Definition als von allen Szenarien gebraucht (fail-closed), oder die Literale der Schleifenliste werden mitgelesen.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `bunx vitest run tools/open-work tools/deepcheck/test tools/claude-hooks tools/ci tools/testcheck/test/wiring.test.ts src/__tests__/open-work.test.ts src/__tests__/e2e-screenplay-lint.test.ts src/__tests__/feature-wording.test.ts`, Prettier, Commit-Hooks, der Probelauf gegen das echte Repository (4 Treffer, 1.5 s).
- Vom Aufrufer gemeldet: Rot gesehen für den ersten Test, den Fall mit eingefügter Zeile und den Grundriss-Fall. Für «mit Freigabe», «nur @wip» und «neuer Schritt» ist kein Rot gemeldet. Diese Tests sind schon auf der Basis grün. Beim Lesen ist nur «nur @wip» eine echte Wächterprüfung: ohne den `scenario.wip`-Filter in `specSteps` würde er rot. Zu «neuer Schritt» siehe C-2.
- Beide Dateien (`tools/` und `CLAUDE.md`) sind Gate-Dateien, der Pull Request braucht also `Gate change approved: #1270`. Ob das «Decided (product owner)» von #1270 auch den neuen Wortlaut in tests/e2e/CLAUDE.md deckt, habe ich nicht geprüft: das Issue habe ich nicht gelesen.
- Ob `bun install` im CI-Job (`steps.deps`) `@cucumber/cucumber-expressions` gehoistet ins Wurzel-`node_modules` legt, ist nur aus bun.lock geschlossen (eine einzige Version). Der Worktree hat kein `node_modules`.

Geprüft: Erkennung und Ende der Definitionen in Spalte 0 an allen Schrittdateien der Basis (alle Muster sind Literale, keine eigenen Parametertypen); Zuordnung der Hunks bei Änderung, Löschung und gelöschter Datei; Grundlage und `@wip` auf Feature-Ebene über `scenarios()`; Ausfaltung der Grundriss-Beispiele; Freigabe über die bestehenden `approvals`; Fehlermeldung nennt Schritt und Szenarien; Zeilennummern der Testerwartungen nachgezählt.
