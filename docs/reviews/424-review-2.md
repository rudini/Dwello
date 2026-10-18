# Code-Review #424, Runde 2 (Slice 2: e3fcfc54 gegen a6e4ac61)

Geprüft im Worktree `review-424-code2` (detached an e3fcfc54). Gelesen habe ich alle 5 geänderten Dateien des Diffs (ohne `implementation_plan.md`) und dazu das Umfeld:
- `src/lib/api.ts` (`request`, `failure`, `api.get`)
- `src/routes/statements/generate/BuildingChoice.svelte`
- `src/routes/contracts/ContractFilters.svelte`, `src/lib/ui/Field.svelte`
- `src/__tests__/helpers/dom.ts` (`fakeBff`, `settle`, Rückstellung von `fetch` in `afterEach`)
- `tests/e2e/screenplay/interactions.ts` (`Wait.until`, `Wait.forUrl`, `FailRequests`)
- `tests/e2e/tasks/{statements,tenants,invoices,apartments}.ts` (Suchaufgaben zum Vergleich)
- `tests/e2e/steps/{contracts,contract-detail,statement-generate}.steps.ts`
- `tests/e2e/features/statement-generate.feature`, Zeilen 380–450

Der Bericht 424-review-1 ist keine Vorrunde dieses Slices. Seine Befunde C-1 bis C-7 (alle Minor/Nit) betreffen Slice 1. Die IDs hier beginnen deshalb bei C-8.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | src/__tests__/statement-wizard.dom.test.ts:1311; src/routes/statements/generate/BuildingStep.svelte:45-54 | Dass jede Antwort für sich wirkt, ist korrekt umgesetzt: Schlägt `/statements/billed` fehl, erscheinen die Rechnungszahlen trotzdem, und umgekehrt. Das klappt, weil `api.get` nie verwirft (`api.ts:182-190`: jeder Fehler und jede Netzwerkausnahme wird zu `{ error }`) und weil die beiden `if` getrennt prüfen. Ein Test dafür fehlt aber, auch auf der Basis. Mit `Promise.all` liegt genau hier die neue Kopplung: Ein späteres `if (!invoices.data \|\| !statements.data) return` bliebe grün. Vorschlag: ein DOM-Test, in dem `fakeBff` `/statements/billed` mit `[500]` beantwortet und die Rechnungszahl trotzdem erscheint |
| C-9 | Minor | tests/e2e/tasks/statement-generate.ts:47-52 | `chooseBuilding` wartet auf `generate-building-invoices-{id}`. Schlägt `/api/invoices` in einem Szenario fehl, erscheint diese Zeile nie. Die Aufgabe bricht dann mit einem Timeout auf «Rechnungen von Gebäude … in der Wahl» ab statt beim Wählen. Heute löst kein Szenario des Assistenten einen solchen Fehler aus (`FailRequests` in statement-generate.ts:149-150 betrifft nur `/statements/agreements` und `/contracts/{id}/agreements`; `creatingFails` in invoice-upload.ts:97 nur den Upload-Dialog). Das Risiko ist also nur latent. Ein Satz im Kommentar der Aufgabe würde einem späteren Fehlerszenario den Grund nennen |
| C-10 | Nit | tests/e2e/targets/statement-generate.ts:16 | Der Kommentar «shown once step 2 has counted the building's invoices and its billed contracts» trifft nur zu, wenn `/invoices` gelingt. Schlägt `/statements/billed` fehl, erscheint die Zahl ohne die abgerechneten Mietverträge |
| C-11 | Nit | Commit e3fcfc54 | `fix(statements)` enthält auch die reine Testkorrektur der Mietvertragssuche (`tests/e2e/tasks/contracts.ts`), ohne Bezug zu Abrechnungen. Im Body ist sie erwähnt. Ein eigener `fix(tests)`-Commit wäre sauberer |

Ponytail-Review:
- `BuildingStep.svelte:L29-54` ersetzt zwei `then`-Ketten durch ein `Promise.all` und ist praktisch gleich lang.
- `contracts.ts:L31-36`: Eine Form wie `statements.ts:19` (`Object.entries(...).every`) bräuchte ein Mapping `buildingId -> building` und wäre nicht kürzer.
- Der DOM-Test nutzt ein eigenes `fetch` statt `fakeBff`. Das ist nötig, weil `fakeBff` synchron antwortet und keine Antwort zurückhalten kann.
- Ergebnis: Lean already. Ship. `net: -0 lines possible.`

Keine Blocker, keine Majors.

## Geprüfte Punkte (ohne Befund)

- **Verhalten bei einer fehlschlagenden Anfrage:**
  - `api.get` verwirft nie. Auch ein Netzwerkfehler wird in `request` gefangen (`api.ts:187-190`), ein 401 führt zuerst zur Anmeldung. `Promise.all` löst also immer auf.
  - Fällt `/statements/billed` aus, setzt der Code `invoiceCounts` trotzdem (eigenes `if (invoices.data)`). Fällt `/invoices` aus, wird `billed` trotzdem gesetzt.
  - Der Endzustand ist für den Liegenschaftsverwalter derselbe wie vorher. Neu ist nur der Zeitpunkt: Die Rechnungszahl erscheint erst, wenn auch die langsamere Antwort da ist. Bei zwei schnellen GETs ist das nicht spürbar.
  - Dass die Antwort eines früheren `$effect`-Laufs später ankommen und den neueren überschreiben kann, war schon vorher so. Innerhalb von Schritt 2 ändern sich `buildings` und `period` ohnehin nicht.
- **Keine Zeile verschiebt sich mehr nach dem Warten:** Beide Zuweisungen stehen im selben `.then`, Svelte rendert sie also gemeinsam. Sobald die eigene Zeile ihre Rechnungszahl zeigt, haben auch alle Zeilen darüber ihre Zahl und ihren Hinweis zu abgerechneten Mietverträgen. Das Warten auf die eigene Zeile genügt deshalb.
- **Kann die E2E-Wartezeit hängen?**
  - `chooseBuilding` beginnt immer mit `goToNextStep` von Schritt 1. Alle Aufrufer starten auf Schritt 1:
    - statement-generate.steps.ts:219 (Szenarien 387–419 wählen vor dem Wiederöffnen)
    - `setManagementFee`, `typeManagementFee`
    - `openPreviewThroughUi` (nach dem Setzen der Daten)
  - Draft-Restore und Link mit vorgewähltem Gebäude (`openStatementWizardFor`, `openSettingsFor`) rufen `chooseBuilding` nicht auf. Sie springen direkt zu den Einstellungen.
  - «Alle Gebäude» nutzt `chooseAllBuildings` und wartet über die Dann-Zeile «nennt die Wahl für …» (feature:433, :444). Das ist unverändert.
  - Der API-Pfad von `openPreview` (`openPreviewViaApi`) berührt den Schritt nicht.
  - `Wait.until` nutzt `first().waitFor()` (interactions.ts:106), der Standard-Zustand ist «visible». Die Testid steht an einem `<span>`, der nur bei `invoices !== undefined` gerendert wird (BuildingChoice.svelte:78-81). Die Testid passt zum Target.
- **DOM-Test rot ohne die Änderung:**
  - Im alten Code setzte die `/invoices`-Kette `invoiceCounts` sofort. Nach `next(); await settle()` stünde `generate-building-invoices-b1` schon im DOM, und `toBeNull()` (Zeile 1327) schlüge fehl.
  - `fetch` wird in `afterEach` zurückgesetzt (helpers/dom.ts:19).
  - Selbst wiederholt: 71 grün.
  - Die Testdaten stehen inline wie im Nachbartest (Zeile 1279). Das ist ein bestehendes Muster und nichts Neues.
- **`filterContracts` und die Feldnamen:** `Field` gibt `id` unverändert als `control.id` weiter (Field.svelte:67). Das Snippet `choice` setzt `name={control.id}` (ContractFilters.svelte:33). Die Felder heissen also `building` und `status`, die Suche `name="search"`. Die URL-Bedingungen in `contracts.ts` passen dazu. `searchParams.get` dekodiert, Namen mit Leerzeichen passen daher.
- **`searchContracts` und eine veraltete URL:**
  - Alle Aufrufer öffnen vorher `/contracts` ohne `search` (contracts.steps.ts:56, :78, :151, :160) oder kommen von einer anderen Seite (:100 nach «ist auf der Mietvertragsliste»; contract-detail.steps.ts:193 nach dem Löschen).
  - Kein Aufruf sucht zweimal denselben Begriff hintereinander. Die Bedingung kann also nicht auf einer alten URL sofort erfüllt sein.
  - `filterContracts` wird immer mit `buildingId` aufgerufen (:110, :117), die Bedingung ist also nie trivial wahr.
  - Das Muster entspricht `tenants.ts:26`, `invoices.ts:21`, `statements.ts:19` und `apartments.ts:17`.
- **Pflichtpunkte:**
  - Die sichtbare Änderung (der Assistent ist in Firefox bedienbar) decken bestehende Szenarien ohne `@wip` ab. So verlangt es das Issue («Scenario: the existing scenarios above»).
  - Keine neuen Texte, Bildschirme oder Zustände, also nichts für `messages/*.json` oder `screens.json`.
  - Die Schichtregel ist eingehalten: Steps rufen nur Tasks auf, Tasks nutzen nur Interactions und Targets.
  - Keine Änderung an API-Antworten, also kein Vertrag in `tests/contracts` betroffen.
  - Kein `skip` und kein `fixme`, kein Browser ausgeschlossen.
  - Nichts Fachfremdes im Diff.

## Nicht bestätigt

- Ob die Zeilenverschiebung tatsächlich die Ursache der Firefox-Fehler ist, vor allem für «bleibt auf Schritt Gebäude», wenn «Weiter» aktiv ist (Issue Gruppe 2): Plausibel ist, dass ein verschobener Klick ein anderes Gebäude wählt. Belegen liesse sich das nur per E2E in Firefox, und E2E durfte ich nicht starten.
- Ob WebKit «Entwurf löschen und Mietvertrag speichern» wegen der Suchnavigation unterbrochen wurde: nur «vom Aufrufer gemeldet».
- Vom Aufrufer gemeldete Checks, nicht wiederholt:
  - `bun run lint`, `bun run check`, Backend `type-check`
  - E2E in Chromium, Firefox und WebKit für contract-edit, contracts, statement-generate und statement-rounding (330 grün)
- Selbst wiederholt: `bunx vitest run src/__tests__/statement-wizard.dom.test.ts` (71 grün).
- Done means des Issues ist offen: ein vollständiger E2E-Lauf mit allen Browsern und grünes CI auf `main` (der Fünf-Shard-Lauf des Autors läuft noch).
