# Code-Review #186 Slice A – Runde 1

Gegenstand: `d1cf3a0..b98b5ba` (Worktree `review-186a-code`, Commit `b98b5ba`; `543ba1e` entfernt nur drei Glossarzeilen, #180).
Anforderung: Ohne Vorschlag der KI zur neuen Kategorie erfährt der Liegenschaftsverwalter, ob ein neuer Versuch helfen kann: `KI_PROPOSAL_UNAVAILABLE` (keine KI, Fehler, Zeitüberschreitung) bzw. `KI_PROPOSAL_UNSURE` (unbrauchbare Antwort, Konfidenz unter 0.7) statt `KI_NO_PROPOSAL`, mit den beiden Texten aus #186.

Ergebnis: kein Blocker, kein Major.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| J-1 | Minor | `src/lib/server/category.ts:103-111`, `src/__tests__/categories.test.ts:272-275` | Jede andere Ablehnung gilt als «nicht erreichbar». Bei einem Namen über 100 Zeichen (das Feld `category-name-input` hat kein `maxlength`, `parseCategory` prüft nur, ob ein Name da ist; das Backend antwortet 422 `VALIDATION_ERROR`, `backend/src/routes/categories.ts:81`, `backend/src/app.ts:60`) steht dann «Versuchen Sie es später nochmals», obwohl ein neuer Versuch nie hilft. Gerade das soll #186 klären. Der Test hält das Verhalten mit einem erfundenen Body `{ type: 'validation', message: … }` fest. Das Backend sendet aber `{ error: 'Invalid request', code: 'VALIDATION_ERROR', params: {} }`, und der Body kommt nicht aus `tests/contracts` (Gotcha «API contracts»). Gleiche Art wie H-10 (Fachreview). |
| J-2 | Minor | `backend/src/services/llm.service.ts:216` (`if (!llmConfig.enabled) throw unavailable()`) | Der Fall «keine KI» (`LLM_ENABLED=false`) aus der Anforderung hat auf keiner Ebene einen Test. `category-allocability.pg.test.ts` deckt nur «Port 9 hört nicht» ab. Fällt die Zeile weg, ruft der Dienst eine abgeschaltete KI trotzdem auf: Daten gehen an einen Anbieter, obwohl die KI ausgeschaltet ist (Bezug zu #216). Die Prüfung gab es schon vorher, die Zeile ist im Slice aber geändert. |
| J-3 | Minor | `tests/e2e/fixtures/backend.ts:271-276`, `tests/e2e/features/categories.feature:74-79` | Gerüst für Slice B (Szenario «Geänderte vordefinierte Kategorie …», `predefinedCategoryAllowance`, `reasonsOf`, `contractHint`, `contractNote`) steckt im Commit von Slice A. Es ist durch die Nacharbeit nach dem Fachreview erklärbar (Plan Z. 15), wird in diesem Slice aber nicht geprüft. Zudem ändert die Fixture einen gemeinsamen vordefinierten Datensatz, während die Szenarien parallel laufen (`fullyParallel: true`). `PUT isAllowedUtilityCost:false` setzt auch `isValidUtilityCost=false` auf allen Rechnungen der Kategorie (api-specification, PUT `/categories/:id`). Das Zurücksetzen in `cleanUp` stellt nur die Kategorie wieder her, nicht diese Rechnungen. |
| J-4 | Nit | `implementation_plan.md:13` | Die Zeile «Test red» der pg-Tests nennt `KI_UNSURE` / `KI_UNAVAILABLE` als erwartete Codes. Die Tests erwarten jetzt `KI_PROPOSAL_UNSURE` / `KI_PROPOSAL_UNAVAILABLE`. |
| J-5 | Nit | `implementation_plan.md:21` | Der Punkt «Screen states (`ki-unavailable`, reasons) …» ist nicht abgehakt, obwohl `ki-unavailable` in diesem Slice schon in allen drei Dateien steht. Punkt aufteilen oder Teilstand vermerken. |
| J-6 | Nit | `tests/e2e/tasks/accessibility.ts:188` | Der Zustand `ki-unavailable` schreibt den Namenspräfix des Stubs selbst (`askKi('KI-Ausfall Fensterreinigung')`), statt `kiFails` vor `askKi` zu nutzen. Damit kennen zwei Stellen den Auslöser des Stubs. |
| J-7 | Nit | `tests/a11y/screens.json:38` | Der Schlüssel `ki-no-proposal` heisst jetzt «KI unsicher». Sein Name passt nicht mehr zum Gegenstück `ki-unavailable` (z. B. `ki-unsure`). |

Bestätigt durch Code und Test:
- Backend: unsichere oder unbrauchbare Antwort ergibt `KI_PROPOSAL_UNSURE`, nicht erreichbar ergibt `KI_PROPOSAL_UNAVAILABLE`, beide mit 503 (`llm.service.ts`, `routes/categories.ts`; `category-allocability.pg.test.ts` deckt Konfidenz 0.69, unbrauchbare Antwort und nicht erreichbar ab). Eine Zeitüberschreitung landet über `callLlm`, das «LLM request timed out» wirft, im selben `catch`.
- Ein Fehler, der keine `CodedError` ist (z. B. `listCategories`), wird von `codedBody` protokolliert und als `KI_PROPOSAL_UNAVAILABLE` abgelehnt.
- `KI_UNAVAILABLE` für Rechnungen bleibt unverändert (H-3).
- BFF: Die Codes werden auf `backend_ki_proposal_unsure` bzw. `backend_ki_proposal_unavailable` abgebildet, der eigene Text des Backends erscheint nie (`categories.test.ts`).
- Texte in allen vier `messages/*.json`, de wörtlich wie in #186. `backend-codes.test.ts` findet beide Codes über `new CodedError(…)`.
- Vertrag `tests/contracts/category-proposal-refused.json` wird gegen die echte API geprüft (`api-contracts.pg.test.ts`).
- Szenarien «Ohne sichere Antwort …» und «KI ist nicht erreichbar» ohne `@wip`. Im Plan steht «Scenario red» (Z. 12). Zustand `ki-unavailable` steht in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Screenplay: Die Steps rufen nur Tasks, Questions und `seed` auf. Der Fehler liegt zwischen Backend und KI, also hinter dem Server; ein `FailRequests` im Browser kann ihn nicht auslösen. Der Auslöser im Stub mit eigenem Given-Schritt folgt H-13.
- `llm-stub.ts`: Der engere Auslöser `KI-Ausfall` trifft keine andere Kategorie der Szenarien (grep `ausfall` in `tests/`, `backend/`).
- Die Plan-Zeile «Skills: tdd, ponytail, ponytail-review» und «Test red» für `categories.test.ts` sind vorhanden.

## Nicht bestätigt

- Von mir erneut ausgeführt und grün: `bunx vitest run src/__tests__/categories.test.ts src/__tests__/backend-codes.test.ts src/__tests__/categories-page.dom.test.ts` (56 Tests).
- «vom Aufrufer gemeldet», nicht erneut ausgeführt: `bun run lint`; Backend `category-allocability.pg.test.ts` und `api-contracts.pg.test.ts`; `bun run type-check` (Backend); `deepcheck:audit`; E2E-Lauf der beiden KI-Szenarien; axe- und Sprachzeilen `category-new` `ki-no-proposal`/`ki-unavailable`.
- Ob J-3 parallele Szenarien tatsächlich stört: In `tests/e2e/features` kommt «Schneeräumung» nur in `categories.feature` vor. Ob ein anderes Szenario die umlagefähigen Kategorien zählt oder auflistet (`/categories/allowed`), habe ich nicht vollständig geprüft. Das Szenario ist noch `@wip` und gehört zu Slice B.
- Die Übersetzungen fr/it/en habe ich nicht mit `docs/design/i18n-begriffe.md` abgeglichen. Sie folgen dem Wortlaut der bisherigen Meldung `backend_ki_no_proposal` (z. B. «IA», «imputables», «addebitabili»).
