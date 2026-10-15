# Code-Review #176 Slice 1, Runde 1

Geprüfter Stand: Worktree `review-176-s1-code`, Bereich `a344098..210e394` (4556b71 Szenarien und KI-Stellvertreter, 210e394 Stammdaten). Alle 16 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `tests/e2e/features/categories.feature` (kein Szenario); `implementation_plan.md:13` | Sichtbare Verhaltensänderung (Schädlingsbekämpfung, Feuerlöscher-Wartung jetzt «Nicht umlagefähig» in der Kategorienliste, ihre Rechnungen nicht mehr in der Nebenkostenabrechnung) ohne Szenario ohne `@wip` und ohne `Scenario red:` im Plan |
| C-2 | Minor | `backend/src/config/llm.ts:60-61`, `backend/src/services/utility-validation.service.ts:30`, `backend/src/routes/invoices.ts:109` | `SWISS_UTILITY_CATEGORIES` führt beide Kategorien weiter als erlaubt; `GET /api/v1/invoices/utility-rules` und der Rechnungs-Prompt widersprechen damit dem Seed. Die Umlagefähigkeit der Rechnung stimmt trotzdem (`llm.service.ts:187`, Kategorie gewinnt). Slice 2 ersetzt nur den Prompt laut Plan; `/utility-rules` fehlt dort |
| C-3 | Minor | `docs/test-pyramid.md:30`, `docs/test-pyramid.md:82`, `tests/e2e/CLAUDE.md:20`, `playwright.config.ts:57-58` | Der neue E2E-Stellvertreter für die KI (Port 2527) fehlt in der Liste der E2E-Doubles und der Ports, die frei sein müssen; Kommentar «starts the mail catcher, the backend …» nennt ihn nicht |
| C-4 | Minor | `tests/e2e/features/categories.feature:73-76` | Das dritte Szenario prüft «nicht gefragt», nicht «KI hat nicht geantwortet». Das Issue verlangt «Ohne KI muss der Liegenschaftsverwalter selbst wählen» (KI-Antwort per Fehlerstatus an der Browsergrenze, z. B. die Form-Action `?/propose`, oder `No scenario: server-side failure`). Der Stellvertreter beantwortet jeden Namen, also erreicht kein Szenario den Zustand «keine Vorwahl nach KI-Ausfall» |
| C-5 | Minor | `tests/e2e/tasks/categories.ts:35-36`, `tests/e2e/steps/categories.steps.ts:149-152` | `askKi` klickt und wartet nicht auf den Vorschlag; das Warten steckt im Given-Schritt (`proposalText` enthält «Vorschlag der KI»). Laut `tests/e2e/CLAUDE.md` wartet die Task selbst auf den Zustand, zu dem sie führt |
| C-6 | Minor | `tests/e2e/tasks/categories.ts:20-31` | Die nicht-`@wip`-Szenarien «Kategorie erfassen», «Name ist schon vergeben», «Kategorie bearbeiten» nutzen schon Radios, die erst Slice 3 baut: auf 4556b71 und 210e394 rot (vom Aufrufer akzeptiert, nichts gepusht). Im Review von Slice 3 grün nachweisen |
| C-7 | Minor | `implementation_plan.md:24` | Zeile fach-reviewer Runde 1 führt F-9 als offen, obwohl 210e394 die Beschreibungen von Abwasser und Kaltwasser genau nach F-9 umsetzt (Plan Z. 12 sagt das selbst) |
| C-8 | Minor | `backend/migrations/0002_stammdaten.sql:17-21`; `implementation_plan.md:14` | Die geschärften Beschreibungen sind nur Deutsch und erscheinen nur im Bearbeitungsformular einer vordefinierten Kategorie (`CategoryRow.svelte:28-29` zeigt sie in der Liste nicht). Das Issue verlangt «sharper help for Hauswart, Lift, Wasser and Abwasser» in allen vier Sprachen; kein Plan-Punkt nennt das |
| C-9 | Nit | `backend/src/__tests__/allocable-categories.pg.test.ts:56-58` | Kommentar «Tests running at the same time»: `bun test` läuft die Dateien nacheinander; es sind übrig gebliebene Kategorien früherer Dateien. Zudem liest der Test die Liste mit dem Standardlimit 100 (`category.service.ts:31`, Sortierung `sort_order` aufsteigend, eigene Kategorien mit 0 zuerst): ab rund 80 zurückgelassenen Testkategorien fehlen die Seed-Zeilen 107/108. Heute rund 19, der Test schlägt dann laut fehl, nicht still. `?limit=1000` oder Filter `type` im Backend würde es robust machen |
| C-10 | Nit | `backend/src/__tests__/allocable-categories.pg.test.ts:1` | Das Issue nennt `statement-generation.pg.test.ts` für den tabellengetriebenen Test; neue Datei ist vertretbar, im Plan oder Issue-Abgleich erwähnen |

## C-1 (Major): Seed-Änderung ohne Abnahmeszenario

Warum falsch: `CLAUDE.md`, Workflow 1, verlangt für jede Verhaltensänderung, die ein Benutzer sieht, ein deutsches Szenario, rot gesehen und im Plan als `Scenario red:` notiert. Slice 1 ändert, was der Liegenschaftsverwalter sieht: In «Kategorien» trägt Schädlingsbekämpfung jetzt die Plakette «Nicht umlagefähig», und eine Rechnung in dieser Kategorie fehlt in der Nebenkostenabrechnung. Der pg-Test `allocable-categories.pg.test.ts` deckt die untere Schicht ab, ersetzt aber das Szenario nicht. Die Plan-Zeile von Slice 1 (`implementation_plan.md:13`) hat nur `Test red:`, kein `Scenario red:`; die drei `@wip`-Szenarien betreffen den KI-Vorschlag (Slice 3).

Nachweis: `grep -n "Schädling\|Feuerlöscher" tests/e2e/features/*.feature` findet nichts. Auf `a344098` würde ein Szenario wie «Schädlingsbekämpfung und Feuerlöscher-Wartung trägt der Vermieter» (Seite «Kategorien», `allowance('Schädlingsbekämpfung')` = «Nicht umlagefähig») rot, auf `210e394` grün. Die bestehende Frage `allowance` braucht dafür einen Schritt, der den Seed-Namen direkt nimmt (heute `names.get(title)!`).

Hinweis zur Triage: Die Szenarioliste im Issue nennt kein Szenario für den Seed. Wer C-1 ablehnt, muss das mit der Regel in `CLAUDE.md` abwägen; die Regel sagt nichts von einer Ausnahme für Stammdaten.

## Bestätigt

- Seed: beide Kategorien `false`, Sortierung 107/108, Kommentar mit Art. 257a Abs. 1 OR; Beschreibungen Lift, Hauswart, Abwasser, Kaltwasser nennen die Ausschlüsse wie in Issue und F-9 vorgeschlagen (`0002_stammdaten.sql:17-21,37-39`). In-place-Änderung entspricht `backend/CLAUDE.md:24`.
- Demo-Daten: keine Rechnung in den beiden Kategorien (`grep -ri "pest\|extinguisher\|Schädling" backend/demo backend/src/db`), Demo-Abrechnungen unverändert; «Stop and ask» des Issues greift nicht.
- pg-Test: Erwartete Werte ausgeschrieben, nicht aus dem Seed gelesen; prüft jede vordefinierte Kategorie (neue Seed-Zeile lässt `toEqual` scheitern) und dass die Abrechnung genau die erlaubten enthält. Die Rechnung wird mit `isValidUtilityCost: true` erfasst, `invoice.service.ts:215` setzt sie für nicht umlagefähige Kategorien auf `false`: der Test zeigt also den Weg über die Kategorie. Filter gegen fremde Testkategorien hält: `POST /categories` setzt `type: 'custom'` (`category.service.ts:168`), direkte Inserts in `fuel-stock.pg.test.ts` (Typ-Standard `predefined`) tragen eine UUID im Namen. Kein Test ändert eine Seed-Kategorie.
- Stellvertreter: Rechnungs-Prompt hat keine Zeile `Kategorie: …` (`llm.ts:76-97`), also 503 → `catch` → `fallback`, wie bisher bei verweigerter Verbindung (`llm.service.ts:192-201`); `/models` 503 → `isLlmAvailable` false wie bisher; `127.0.0.1` ist in `OPERATOR_HOSTS`, `llmRecipient` bleibt `null`, die Datenschutzerklärung nennt keinen Empfänger. Das leere Backend 3103 zeigt weiter auf Port 9.
- Glossar, `docs/data-model.md`, `docs/PRD-Dwello.md` stimmen mit dem Seed überein; Glossar-Änderung vom Product Owner einmalig erlaubt (Auftrag).
- `invoice-completeness.test.ts`: Beispiel auf eine umlagefähige Kategorie getauscht, Aussage des Tests unverändert.
- Feature-Texte ohne UI-Wörter; Fragen geben Text bzw. echten Zustand (checked) zurück; Schritte rufen nur Tasks und Fragen.

## Nicht bestätigt

- Lint, `deepcheck:audit`, Backend `bun run test` (556 grün, Coverage-Boden), Backend `type-check`, `bun run check`: vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests liegen ausserhalb dessen, was ich ausführen darf).
- E2E: die drei `@wip`-Szenarien rot «vom Aufrufer gemeldet»; nicht gestartet (Regel). Ob der Stellvertreter in CI auf 2527 startet und die Rechnungs- und KI-Szenarien unverändert grün bleiben, nur durch Lesen von `playwright.config.ts:68-91` und `llm.service.ts` geprüft, nicht durch einen Lauf.
- Testrot des pg-Tests (`implementation_plan.md:13`): nur die Plan-Notiz gelesen, nicht reproduziert.
- Rechtliche Einstufung selbst: nicht geprüft, beruht auf `docs/reviews/176-fachreview-1.md` und dem Entscheid im Issue.
