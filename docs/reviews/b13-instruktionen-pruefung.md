# B-13 (#143): Prüfung der Instruktionen und Verbesserungen

Lauf vom 13.10.2026, Branch `claude/b13-contracts-unknown` (auf Wunsch aus `claude/workflow-improvements` erstellt).

## Wurden die Instruktionen korrekt umgesetzt?

| Regel (Quelle) | Umgesetzt | Beleg / Abweichung |
|---|---|---|
| Issue lesen, `entscheiden` prüfen (CLAUDE.md, Open work) | ja | #143 hat nur `bug`; via GitHub MCP gelesen |
| Plan-Session mit Checkliste (Workflow 8) | ja | Session 22 in `implementation_plan.md` |
| Szenario zuerst, `@wip`, rot aus dem richtigen Grund, Zeile notiert (Workflow 1) | ja | zwei Szenarien rot (`Received has value: null`), später ein drittes (H1); `Scenario red:` im Plan |
| Fehlerzustand nur über eine scheiternde Anfrage mit Fehlerstatus (Workflow 1, test-pyramid) | ja | neue Interaktion `FailRequests` (Status 500, keine Daten) |
| `fach-reviewer` vor der Umsetzung, wenn Fachregeln/Begriffe betroffen | bewusst nicht | keine Fachregel, kein neuer Begriff, Text existierte; im Plan begründet |
| `/tdd`: jeder Fix mit vorher rotem Test (Workflow 2) | inhaltlich ja, formal nein | Rot-Grün eingehalten (DOM-Tests für Bug, M1, M3, H1, Sven 3), aber der Skill `/tdd` wurde nie geladen |
| `/ponytail` (Workflow 3) | spät | erst am Ende als `ponytail-review` geladen; ein Fund (doppeltes Target) behoben |
| `deepcheck:audit` nach jedem Schritt | ja | stumm/sauber |
| Slice committen, dann `code-reviewer`, Baum nicht ändern (Workflow 4) | ja | 3 Runden, Berichte `docs/reviews/b13-contracts-unknown-review-{1,2,3}.md` |
| Findings prüfen, begründet ablehnen, Fix mit rotem Test (Workflow 6) | ja | Liste im Plan; abgelehnt: M5, N2, N5, H5 und ein Nit der 3. Runde |
| Feature-Review: Personas bei UI-Änderung (Workflow 5) | ja | Helga, Sven; Fehlerzustand von den Personas simuliert |
| a11y/Sprachen: neue Zustände (Design-Regeln, Process) | nach Review | `contracts-unknown` (Wizard Schritt 2, Formular); `contracts-unknown-review` erst nach Major M1 der 3. Review-Runde |
| Commit-Betreff ≤ 50 Zeichen (Conventions) | nach Korrektur | erster Betreff hatte 51 Zeichen, lokal per amend gekürzt |
| Prettier nur auf eigene Dateien | ja | vorher geprüft, dass die Dateien sauber waren |
| Offene Arbeit als Issue/Zeile (Open work) | ja | Issue #151 (`bug`, `entscheiden`), U-15, U-16 |
| Alle Checks vor «fertig» | ja | Coverage 2252 Tests, lint, check, Backend 539 Tests + type-check, E2E-Routinelauf 635/635, betroffene Szenarien erneut |
| Push nur auf Anweisung | ja | nichts gepusht; Stop-Hook verlangt Push, CLAUDE.md hat Vorrang |
| Fertig = kein offener Blocker/Major (Workflow 7) | nein | Helga H2/H3 (Major) brauchen einen Entscheid: Issue #151 |

## Verbesserungen an Instruktionen, Skills, Hooks

1. **Fallow-Gate schlägt still durch** (`.claude/hooks/fallow-gate.sh`): Auf einem Branch ohne Upstream bricht `fallow audit` mit Exit 2 ab («could not detect base branch»), und der Hook schreibt nur «skipping». Meine Commits wurden so nicht geprüft. Vorschlag: wie `deepcheck-gate.sh` auf `--base origin/main` zurückfallen und bei Exit 2 blockieren; in CLAUDE.md, Gotchas, `bunx fallow audit --base origin/main` nennen.
2. **Commit-Betreff automatisch prüfen**: Die 50-Zeichen-Regel prüft nichts; ein `commit-msg`-Check im Gate-Hook (Typ, Scope, Länge) fängt das vor dem Review ab.
3. **Plan-Archiv beim Start**: Session 21 war fertig, aber nicht archiviert; `open-work.test.ts` schlug erst bei der Coverage fehl. CLAUDE.md, Workflow 8: «Am Start einer Aufgabe eine abgehakte Vorgänger-Session archivieren» ergänzen.
4. **«Eine scheiternde Anfrage» präzisieren** (`docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`): Der Reviewer las «eine Anfrage» als einen Aufruf; die Seite lädt den Endpunkt aber pro Wohnung. Formulierung «ein Endpunkt (alle seine Aufrufe), nur mit Fehlerstatus». Dazu die neue Interaktion `FailRequests` in der Screenplay-Tabelle nennen und wie ein a11y-Zustand mit Fehler erreicht wird (Route setzen, dann `Navigate.reload`).
5. **Issue-Vorlage: Ergebnis statt Platzierung und Text prüfen** (`.github/ISSUE_TEMPLATE/task.md`): #143 legte zwei Orte und einen Text fest («Laden Sie die Seite neu»). Die Personas fanden den dritten Ort (Prüfung) fehlend, den doppelten Hinweis störend und den Rat schädlich (Eingaben im Formular gehen verloren). Vorschlag: In «Done means» das Ergebnis («vor dem Speichern weiss der Verwalter, dass nicht geprüft wurde») und bei einem vorgegebenen Text dessen Folge prüfen («was passiert, wenn der Benutzer dem Rat folgt?»).
6. **Skills verbindlich verankern** (CLAUDE.md, Process/Workflow 2-3): «`/tdd` und `/ponytail`» ist leicht zu übergehen. Konkreter: «Vor dem ersten Test `Skill tdd` laden; vor dem `code-reviewer` `ponytail-review` auf den Slice-Diff anwenden.» Dazu im code-reviewer prüfen lassen, ob der Plan beide nennt.
7. **Persona-Major ausserhalb des Entscheids** (Workflow 7): H2/H3 widersprechen dem im Issue entschiedenen Text. Regel ergänzen: «Ein Persona-Major, der einen Produktentscheid braucht, wird ein `entscheiden`-Issue und steht unter Blocked on me; der Rest des Slices gilt als fertig.» Sonst ist unklar, ob der Lauf endet.
8. **Re-Review nach Persona-Fix klären** (Workflow 6): Muss die Persona nach einem behobenen Major erneut laufen, oder reicht ein grünes Szenario, das den Fund zeigt? Ich habe das Szenario genommen; die Regel sagt es nicht.
9. **a11y-Zustand pro Ort?** (Design-Regeln, Process): Gilt ein Zustand, der im Wizard auf mehreren Schritten erscheint, als ein Zustand oder braucht jeder Schritt eine Zeile? Klarstellen.
10. **Personas dürfen speichern** (`.claude/agents/persona.md`): Helga und Sven speicherten nicht, um die geteilte DB zu schonen; so blieb ungeprüft, ob das Backend die Überschneidung ablehnt. Die DB wird pro Lauf neu erstellt: «Speichern ist erlaubt» ergänzen, oder eine DB pro Persona.
11. **code-reviewer und Checks** (`.claude/agents/code-reviewer.md`): Alle drei Runden listeten E2E, check und Coverage unter «Nicht bestätigt». Der Aufrufer sollte die Ergebnisse mitgeben («lint, check, Coverage, Szenarien X grün»), und der Reviewer darf `bunx vitest run` laufen lassen (ändert keine Dateien). Ausserdem: nach dem Start eines Reviews nicht mehr amenden (Hash wechselte).
12. **Build-Konflikt E2E und Personas** (`docs/design/tools/persona-stack.sh`, Workflow 5): Beide bauen nach `build/`; nicht parallel starten. Als Gotcha notieren.
13. **Stop-Hook vs. Push-Regel**: Der Stop-Hook verlangt «commit and push», CLAUDE.md erlaubt Push nur auf Anweisung. Hook-Text anpassen («commit; push only when asked») oder in CLAUDE.md erwähnen, dass der Hook in diesem Punkt nicht gilt.
14. **Live-Region als Komponente** (`src/lib/ui`): Hinweise, die beim Erscheinen angesagt werden, brauchen heute ein handgemachtes `<div role="status">` (Muster in `PeriodStep`), das leer einen Flex-Abstand erzeugt (N5), und `Field` kann keine zusätzliche Beschreibung verknüpfen (Sven 1). Eine `live`-Option an `Alert` und ein `describedby` an `Field` lösen beides zentral (U-16).
