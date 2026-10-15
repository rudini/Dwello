# Code-Review #176 Slices 1 und 2, Runde 2 (Delta)

Geprüfter Stand: Worktree `review-176-s12-delta` auf `87a4f05`. Delta: `b821f4d` (Fixes Slice 1), `487401b` (Fixes Slice 2); dazu in `87a4f05` nur, was die offenen Befunde C-4, C-6, C-8 betrifft. Alle Dateien der beiden Delta-Commits gelesen (ausser den Review-Berichten selbst, die nur kopiert sind), dazu `llm.service.ts` ganz, `config/llm.ts` Z. 72-135, `backend/scripts/llm-stub.ts`, `category-allocability.pg.test.ts`, `CategoryForm.svelte` Z. 75-130, `messages/*.json` (Diff von `87a4f05`), `tests/e2e/{tasks,questions,targets}/categories.ts`, `categories.feature`, `0002_stammdaten.sql`, Issue #176.

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| D-11 | Nit | `docs/test-pyramid.md:82` | Nennt den `Bun.serve`-Stellvertreter für die KI weiter «in `invoice-categorization.pg.test.ts`»; seit `487401b` liegt er in `backend/src/__tests__/helpers/llm.ts` und wird auch von `category-allocability.pg.test.ts` und `api-contracts.pg.test.ts` gebraucht |
| D-12 | Nit | `backend/src/services/llm.service.ts:147` | `promptFor` (liest die Kategorien aus der Datenbank) läuft jetzt vor dem `try`; vorher lag `listCategories` im `try` (Z. 161 alt). Ein Datenbankfehler endet damit als Fehler der Route statt als `fallback`. Praktisch ohne Folge (ohne Datenbank scheitert die Rechnung ohnehin), aber eine stille Verhaltensänderung |
| D-13 | Minor | `implementation_plan.md:31`; `backend/src/__tests__/llm-prompt.test.ts:53-58` | Der neue Test «setzt Platzhalter in Kategorienamen nicht ein» (D-8) wurde nach dem Code geschrieben (der Code war schon sicher); der Plan hat keine Zeile `Test red: …` dazu, und kein Rot durch Herausnehmen des Codes ist vermerkt (`CLAUDE.md`, Workflow 2) |

Keine Blocker, keine Major.

## Stand der Befunde aus Runde 1

### Slice 1 (`docs/reviews/176-s1-review-1.md`)

| ID | Stand | Beleg |
|---|---|---|
| C-1 (Major) | behoben | `tests/e2e/features/categories.feature:57-60` Szenario «Vordefinierte Kategorien, deren Kosten der Vermieter trägt», ohne `@wip`; Schritt `categories.steps.ts:110-112` ruft nur die Frage `allowance` (Wert, nicht ja/nein); `Scenario red:` in `implementation_plan.md:14`. Rot/Grün: vom Aufrufer gemeldet |
| C-2 | behoben (Slice 2) | `SWISS_UTILITY_CATEGORIES` hat keinen Verwender mehr (`grep` in `backend/src`, `docs`) |
| C-3 | behoben | `docs/test-pyramid.md:30,82`, `tests/e2e/CLAUDE.md:20` (Port 2527), `playwright.config.ts:59` |
| C-4 | behoben (Slice 3) | Szenario «Ohne sichere Antwort der KI wählt der Liegenschaftsverwalter selbst» (`categories.feature`), Stellvertreter antwortet für «Bewachung» mit Konfidenz 0.5 (`llm-stub.ts`); nicht erreichbare KI und unbrauchbare Antwort führen in denselben Zustand (503 `KI_NO_PROPOSAL`) und sind in `category-allocability.pg.test.ts:84-95` gezeigt. Das Issue lässt diesen Weg zu («or a server-side failure with a lower-layer test») |
| C-5 | Ablehnung hält | Der Given-Schritt (`categories.steps.ts:154-157`) wartet mit `sees(proposalText)` auf den Vorschlag, bevor `saveFormAsNotAllowed` klickt; die beiden When-Schritte mit `askKi` werden nur von wiederholten Fragen gefolgt (`sees` mit `expect.poll`). Keine zwei Klicks hintereinander auf einen asynchronen Schritt |
| C-6 | behoben laut Aufrufer, nicht bestätigt | `CategoryForm.svelte:81-89` baut die Radios (`category-allowance`), `@wip` ist aus `categories.feature` entfernt; dass die Szenarien grün sind: vom Aufrufer gemeldet |
| C-7 | behoben | `implementation_plan.md:29` führt F-9 als behoben (Slice 1) |
| C-8 | teilweise behoben, noch offen (Minor) | `categories_allocable_help` nennt in allen vier Sprachen jetzt Gebäudeversicherung, Erneuerungen und die Ausschlüsse bei Lift und Hauswart sowie Art. 257a Abs. 2 OR. Für Wasser und Abwasser (Grundgebühren nach dem Wert der Liegenschaft, Meteorabwasser) steht der Ausschluss weiter nur in den deutschen Seed-Beschreibungen (`0002_stammdaten.sql:17-18`), die nur im Bearbeitungsformular einer vordefinierten Kategorie erscheinen. Das Issue verlangt unter «Texts» «sharper help for Hauswart, Lift, Wasser and Abwasser» in allen vier Sprachen. Entweder den Hilfetext um Wasser/Abwasser ergänzen oder im Plan begründen, warum die deutsche Seed-Beschreibung genügt (offene Arbeit, falls nicht in diesem Task) |
| C-9 | behoben | `allocable-categories.pg.test.ts:54,56` (`?limit=1000`, Kommentar richtig) |
| C-10 | behoben | `implementation_plan.md:13` begründet die eigene Datei |

### Slice 2 (`docs/reviews/176-s2-review-1.md`)

| ID | Stand | Beleg |
|---|---|---|
| D-1 | behoben | `implementation_plan.md:15-17` (`Test red:` der vier Tests, `No scenario: …`), `Skills:` Z. 25 |
| D-2 | behoben | Punkt in `docs/migration-mva.md` entfernt |
| D-3 | behoben | Cache-Schlüssel ist der ganze Prompt (`llm.service.ts:20-25,147-148,178,237`); eine neue, umbenannte oder umgestellte Kategorie ändert den Prompt (`categoryLines` trennt nach `isAllowedUtilityCost`). Test `invoice-categorization.pg.test.ts:222-240` «fragt die KI neu, sobald es eine neue Kategorie gibt»; Rot vom Aufrufer gemeldet und im Plan vermerkt. Der Schlüssel enthält jetzt auch den Betrag: genauer als vorher, keine Regression |
| D-4 | Ablehnung hält | Zusatzabfrage neben einem KI-Aufruf von Sekunden, unter 50 Wohnungen |
| D-5 | behoben | Prompt durchgehend in Du-Form (`config/llm.ts:72,92,109`) |
| D-6 | behoben | `config/llm.ts:107` beschreibt den Namen als den Text nach «- » ohne deutschen Namen in Klammern und ohne Beschreibung |
| D-7 | behoben | `PromptCategory` nicht mehr exportiert (`config/llm.ts:75`) |
| D-8 | behoben (Rot-Notiz fehlt: D-13) | `llm-prompt.test.ts:53-58` mit `{amount}`, `$&` und `{description}` in Name und Beschreibung |
| D-9 | Ablehnung hält | `utility-rules` hat keinen Bildschirm und keinen Frontend-Leser; eigene Kategorien laufen durch denselben Filter |
| D-10 | an den fach-reviewer verwiesen | nicht Teil dieses Deltas |

## Nicht bestätigt

- Lint, `deepcheck:audit`, `test:coverage` (2334 grün), Backend `bun run test` (570 grün), Backend `type-check`: vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests legen die Testdatenbank neu an; nicht erlaubt).
- Szenario von C-1 rot auf dem alten Seed, grün auf dem neuen; alle Szenarien von `categories.feature` grün (C-6): vom Aufrufer gemeldet, kein E2E gestartet (Regel).
- D-3-Test rot (1 statt 2 Prompts) vor der Cache-Änderung: vom Aufrufer gemeldet, nur die Plan-Notiz gelesen.
- Ob das Szenario von C-1 bei vielen parallel angelegten eigenen Kategorien stabil bleibt: Die Seite lädt `?limit=100` (`src/routes/config/categories/+page.server.ts:9`), eigene Kategorien sortieren vor Schädlingsbekämpfung (107) und Feuerlöscher-Wartung (108). Bei aufgeräumten Szenarien unkritisch; nur gelesen, nicht gemessen.
- Der Rest von Slice 3 (`87a4f05`) ausserhalb von C-4, C-6, C-8 ist nicht Gegenstand dieser Runde.
