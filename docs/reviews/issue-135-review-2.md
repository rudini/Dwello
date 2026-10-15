# Code-Review #135, Runde 2 (Delta)

Geprüft: `9952d96..1dcc988` im Worktree `review-135-code2` (detached auf 1dcc988), dazu die offenen Befunde aus `docs/reviews/issue-135-review-1.md`. Gelesen: alle 18 geänderten Dateien des Deltas (die vier Persona-Berichte nur die Befundtabellen und die Zuordnung im Plan), dazu `src/lib/wizard-draft.ts`, `src/lib/ui/Checkbox.svelte`, `src/routes/api/statements/billed/+server.ts`, `StatementWizard.svelte` (onMount), `tests/e2e/screenplay/interactions.ts` (`keepInLocalStorage`), `tests/e2e/CLAUDE.md` (Abilities), `docs/reviews/issue-135-fachreview-1.md` und die Issues #199 und #201 per `gh api`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – | src/__tests__/statement-wizard.dom.test.ts:940-953 | Behoben. Der Fake beantwortet `/statements/billed` mit einer Liste. Mein Lauf endet mit Exit 0, ohne unbehandelte Rejection. |
| C-2 | – | tests/e2e/tasks/accessibility.ts:254-261 | Behoben. Der Zustand gibt 2025 ein und hängt nicht mehr vom heutigen Datum ab. |
| C-3 | – | src/__tests__/statement-endpoints.test.ts:179-202 | Behoben, soweit es ein Minor verlangt: Der Endpunkt-Test belegt das Lesen der Query und die Zählung. Der Fehlerfall bleibt offene Arbeit (O-25). Leere `buildingIds` sind weiterhin nicht getestet. |
| C-4 | – | src/lib/server/statement-generation.ts:52-53 | Behoben. Der Test mit `b/1` belegt das (`b%2F1`). |
| C-5 | – | src/routes/statements/generate/StatementWizard.svelte:99-101 | Behoben. Der DOM-Test «überspringt die Wahl der Gebäude nicht …» belegt das. |
| C-6 | – | src/lib/server/statement-generation.ts:46-47, 68-69 | Behoben. Jeder Kommentar steht jetzt über seiner Funktion. |
| C-7 | Nit | tests/e2e/tasks/accessibility.ts:247-250 | Die Ablehnung hält nicht: Beide Begründungen treffen nicht zu, siehe unten. Als Nit bleibt der Befund offen (oder wird offene Arbeit). |
| C-8 | Major | src/__tests__/statement-endpoints.test.ts:173-175 | Eine bestehende Zeile eines fremden Tests (PDF aus der Liste, 503) wurde neu umbrochen. Sie gehört nicht zur Anforderung. |
| C-9 | Major | messages/de.json:964-970 (und fr/it/en gleiche Zeilen) | Der Wortlaut der Regel «schon abgerechnet» ist geändert, der fach-reviewer hat ihn in V-1 festgelegt. Zum neuen Wortlaut fehlt eine fach-reviewer-Runde. Plan und Delta zeigen keine. |
| C-10 | Minor | src/routes/statements/generate/BuildingChoice.svelte:50-55 | Die Karte ist kein ganzes Klickziel mehr. `p-4` sitzt jetzt am `div`, nicht mehr am `label`. Ein Tipp auf den Rand der Karte oder auf den Hinweis wählt das Gebäude also nicht. Vorher war die ganze Karte das `label`. |
| C-11 | Minor | implementation_plan.md:22-25 | Die geänderten Texte von Helga P-1 bis P-5 und Anna P-1/P-2 sind Verhalten (CLAUDE.md, Workflow 6). Der Plan nennt dafür kein `Test red`, auch keine angepassten DOM-Asserts oder Szenario-Zeilen. Für die geänderten Texte und den Wechsel von `text-ink-muted` zu `font-semibold text-ink` fehlt eine Persona-Runde 2, oder die Begründung, warum keine nötig ist (Workflow 6: «runs again only when the fix adds a text … it has not seen»). |
| C-12 | Nit | messages/de.json:964-966 | Die Texte nennen die Schritte «Gebäude» und «Heizprofil und Verwaltungspauschale» wörtlich, statt `statements_step_buildings` bzw. `statements_step_settings` einzusetzen. Wird ein Schritt umbenannt, stimmt der Hinweis nicht mehr. Heute stimmen alle vier Sprachen überein. |

## C-7: Die Ablehnung hält nicht (Nit)

Die Begründung im Plan lautet: Das Schreiben im Speicherformat der App sei der einzige Weg, ausser je Viewport ein Gebäude anzulegen und zu löschen. Ausserdem breche eine Formatänderung im selben Commit die DOM-Tests.

- **Zweiter Teil falsch.** Die DOM-Tests schreiben den Entwurf über `writeDraft` aus `src/lib/wizard-draft.ts` (z. B. `statement-wizard.dom.test.ts:856`). Ändert sich Schlüssel oder Format, ändern sich Lesen und Schreiben gemeinsam, und die DOM-Tests bleiben grün. Ausserhalb von `wizard-draft.ts` schreiben nur `src/__tests__/wizard-draft.test.ts:37` (absichtlich kaputter Inhalt) und eben `accessibility.ts:247` den Schlüssel von Hand. Rot würde nur der a11y-Zustand, und zwar erst im E2E-Lauf.
- **Erster Teil auch nicht.** E2E-Code darf App-Code importieren (`tests/e2e/CLAUDE.md`, Abilities; z. B. `tasks/statement-generate-api.ts:1`). Der Zustand kann den Eintrag mit `writeDraft` in einen kleinen `Storage`-Ersatz schreiben und Schlüssel und Wert an `Browser.keepInLocalStorage` übergeben. Dann braucht es kein Gebäude je Viewport.

Weil C-7 ein Nit ist, blockiert er nicht. Die Planzeile sollte aber nicht mit dieser Begründung «rejected» sagen. Entweder umsetzen oder als offene Arbeit führen.

## C-8 (Major): Umformatierung von fremdem Code

**Warum falsch.** `statement-endpoints.test.ts:173-175` gehört zum bestehenden Test «GET /api/statements/[id]/pdf (PDF aus der Liste)». Diesen Test hat #135 nicht berührt; in `039eb29..9952d96` ist die Datei nicht geändert. Das Delta bricht seine einzeilige Erwartung `expect(await sentenceOf(response)).toBe('Das PDF …');` auf drei Zeilen um. CLAUDE.md, Gotchas «Formatting»: «format only your own lines». Die Checkliste dieses Reviews nennt das als Major («Nothing in the diff is unrelated … formatting»).

**Nachweis.** Erst `git diff 9952d96..1dcc988 -- src/__tests__/statement-endpoints.test.ts` ausführen: Die ersten Hunk-Zeilen zeigen `-expect(...).toBe('Das PDF …');` und `+expect(...).toBe(` plus Umbruch. Danach zeigt `git diff 039eb29..9952d96 --stat -- src/__tests__/statement-endpoints.test.ts` für den Umsetzungs-Commit keine Änderung an dieser Datei.

**Behebung.** Die drei Zeilen auf den alten Stand zurücksetzen. Nur den neuen `describe('GET /api/statements/billed')` behalten. Das Verhalten ändert sich dadurch nicht, der Aufwand ist eine Zeile.

## C-9 (Major): Neuer Wortlaut der Abrechnungsregel ohne fach-reviewer

**Warum falsch.** Der fach-reviewer hat in Runde 1 als **Major V-1** verlangt, dass der Text nur sagt, was die Regel prüft. Der Plan hat V-1 mit «… eine Abrechnung, die in diese Abrechnungsperiode fällt» als behoben vermerkt (`implementation_plan.md:12`). Das Delta ersetzt diesen Wortlaut wegen Helga P-2 in allen vier Sprachen durch «… die diese Abrechnungsperiode ganz oder teilweise abdeckt» und ergänzt «Sie müssen es nicht wählen». Damit beschreibt der Text die Überschneidungsregel, über die #199 (offen, `entscheiden`) noch nicht entschieden ist. Der neue Satz ist fachlich vermutlich richtiger: Er entspricht `s.periodStart <= periodEnd && s.periodEnd >= periodStart` in `contractsOf`. Er ändert aber genau die Aussage, die der fach-reviewer abgenommen hat. Laut CLAUDE.md, Workflow 5, gehört bei geänderten Domänenregeln oder Domänenbegriffen der `fach-reviewer` dazu. Workflow 7 verlangt, dass vor «done» kein Blocker/Major des fach-reviewers offen ist. Im Plan steht nach dem Delta keine fach-reviewer-Runde und kein entsprechender Punkt.

**Nachweis.** `implementation_plan.md:11-12` (nur die Runde auf die Szenarien) gegen `messages/de.json:967-970` auf 1dcc988. `grep -n fach-reviewer implementation_plan.md` findet keine Runde nach den Persona-Korrekturen. Die fr/it/en-Fassungen («couvre tout ou partie», «copre del tutto o in parte», «covers all or part») hat noch kein fach-reviewer gesehen; das hat die Runde 1 selbst unter «Nicht bestätigt» notiert.

**Behebung.** Eine fach-reviewer-Runde nur auf die geänderten Texte (de/fr/it/en) gegen V-1 und #199. Danach eine Planzeile. Vorher keinen Merge.

## Bestätigt

- **C-1:** Selbst ausgeführt: `bunx vitest run src/__tests__/statement-wizard.dom.test.ts src/__tests__/statement-endpoints.test.ts` endet mit Exit 0, die Ausgabe enthält «unhandled» 0-mal. Zusammen mit `statement-wizard.test.ts` und `statement-generation.test.ts` liefen 4 Dateien und 99 Tests grün.
- **C-5:** `dropped.buildings` ist eine Zahl (`StatementWizard.svelte:75`). `!dropped.buildings` verhindert den Sprung also nur, wenn ein Gebäude weggefallen ist. Ein weggefallenes Heizprofil verhindert ihn weiterhin über `selectionErrors(…, 2)`. Der Test schreibt den Entwurf mit `b1` und `weg` und erwartet Schritt 1 ohne `resume-notice`. Ohne die Änderung wäre `[b1]` gültig, und der Assistent spränge auf Schritt 3. Das passt zur notierten roten Meldung.
- **Sven P-1:** Der Hinweis steht als `<p id="building-billed-…">` ausserhalb des `label` und ist über `aria-describedby` an die Checkbox gebunden, zusammen mit `buildings-error`, wenn ein Fehler da ist. Der DOM-Test prüft beides (`statement-wizard.dom.test.ts:995-1001`). Die IDs sind je Gebäude eindeutig. `pl-10` und `font-semibold text-ink` sind Token-Klassen, `Checkbox.svelte:43` nutzt dasselbe Muster. Das `label` behält `min-h-12`.
- **Texte:** Alle 7 geänderten Schlüssel sind in de/fr/it/en geändert. `statements_building_billed_all_many` nutzt in keiner Sprache mehr `{total}`, und der Aufruf übergibt keinen Parameter mehr (`BuildingChoice.svelte:41`). Die genannten Schrittnamen stimmen in allen vier Sprachen mit `statements_step_buildings` und `statements_step_settings` überein. Anrede: Sie/vous/Lei.
- **Szenarien und a11y:** `statement-generate.feature:156,161` nennen die neuen Texte. Die Zustände `draft-dropped` und `buildings-billed` bleiben in `screens.json` und den beiden Features. Neue Bildschirmzustände bringt das Delta nicht.
- **Offene Arbeit:** #201 ist offen und hat die Labels `produkt` und `entscheiden`. Es enthält «Proposed (confirm before starting)» und deckt Anna P-3 und die Beobachtungen ab. O-25 deckt Sven P-2 und den Fehlerfall aus C-3 ab.
- **Sicherheit:** Die Route ist unverändert, und an den Client gehen weiterhin nur Zahlen. Seit C-4 gehen die IDs kodiert ans Backend.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer auf 1dcc988 gemeldet; ich habe sie nicht wiederholt:
  - lint 0, check 0, `deepcheck:audit` ohne Ausgabe, fallow audit sauber;
  - test:coverage 2430 passed, ohne unbehandelte Fehler;
  - Design-Guards 418 passed;
  - E2E `statement-generate.feature` chromium + api 30 passed;
  - E2E a11y- und Sprachzeilen 24 passed;
  - Backend unverändert. Das stimmt mit `git diff --stat` überein: keine Datei unter `backend/`.
- Selbst wiederholt habe ich nur die vier Vitest-Dateien unter «Bestätigt».
- Den roten Lauf zu C-5 und zu Sven P-1 habe ich nicht nachgestellt; dafür hätte ich Code ändern müssen. Plausibel ist er aus Test und Code, siehe oben.
- Dass C-2 ab 2027 hält, ist nur aus dem Code abgeleitet (feste Daten 2025, Seed mit 2025). Mit einer Systemzeit 2027 nicht ausgeführt.
- Die Wortwahl der fr-, it- und en-Texte habe ich gegen die vorhandenen Schrittnamen und die Begriffe der Runde 1 geprüft, nicht fachlich (siehe C-9).
- Die Persona-Berichte habe ich nur in ihren Befundtabellen gelesen, nicht die Abschnitte «Beobachtungen».
