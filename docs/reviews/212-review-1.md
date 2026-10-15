# Code-Review #212, Runde 1

Gegenstand: `e445b1e..af32a73` (7a3e65a `chore(tests): stub small model for #212`, af32a73 `fix(services): clearer KI rules for small models`), Worktree `review-212-code`. Anforderung: Issue #212 («Done means»), Wortlaut nach `docs/reviews/212-fachreview-1.md`.

Gelesene Dateien des Diffs: `backend/src/config/llm.ts`, `backend/scripts/llm-stub.ts`, `backend/src/__tests__/category-allocability.pg.test.ts`, `tests/e2e/features/categories.feature`, `implementation_plan.md`, `docs/reviews/212-fachreview-1.md`. Dazu im Umfeld: `tests/e2e/features/categories-ki.feature`, `tests/e2e/tasks/accessibility.ts:194-196`, `backend/migrations/0002_stammdaten.sql:17-34`, `tests/contracts/category-proposal.json`, Issue #212 (`gh api`).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/__tests__/category-allocability.pg.test.ts:81-97 | Der neue Test hält nur Regel 1 (Anfang) und den ersten Satz von Regel 2 fest. Regel 3 («Art. 5 und 6 VMWG nur anwenden, wenn …», ein eigener Punkt von «Done means»), Regel 4 (Abgaben aus dem Gebrauch umlagefähig, Fix für fach M-2) und der Platzhalter `"confidence": <Zahl von 0 bis 1>` sind ungeprüft. Wer Regel 3 oder 4 streicht, bekommt keinen roten Test. Eine Zeile `toContain('3. Art. 5 und 6 VMWG nur anwenden, wenn die Kategorie Heizung oder Warmwasser betrifft.')` würde genügen; Regel 4 ebenso. |
| C-2 | Nit | backend/src/__tests__/category-allocability.pg.test.ts:81 | Der Testname nennt nur «nicht vollständig» und «ohne eine Antwort vorzugeben». Der Test prüft aber auch den Vorrang der Reparaturen (Regel 1). Der Name verschweigt also ein geprüftes Verhalten. |
| C-3 | Nit | tests/contracts/category-proposal.json:3, src/__tests__/categories-page.dom.test.ts:216 | Die Beispiel-Begründungen zitieren für eine Erneuerung weiterhin Art. 257a Abs. 1 OR. Das ist derselbe Zitierfehler, den fach M-6 im Stub korrigiert hat. Für die Form der Antwort spielt das keine Rolle, und der Aufrufer hat es bewusst so gelassen. Wer die Fixtures liest, sieht so aber weiter das falsche Muster. |
| C-4 | Nit | implementation_plan.md:12 | In der Zeile «Files:» fehlen `docs/reviews/212-fachreview-1.md` und `implementation_plan.md`, obwohl beide im Diff stehen. |

Keine Blocker oder Major.

## Bestätigt

Jede Zeile von «Done means» des Issues ist gegen Code und Test geprüft:

- **Liste nicht vollständig, Einstufung nach der vordefinierten Kategorie:**
  - Code: `llm.ts:155`, Regel 2 im korrigierten Wortlaut des fach-reviewers, «Leistung derselben Art» statt «Teil von».
  - Test: `category-allocability.pg.test.ts:86`.
  - Der Bezug auf «ohne» hat Material: Die Beschreibungen von Hauswart, Lift, Kaltwasser und Abwasser schliessen mit «ohne …» aus (`0002_stammdaten.sql:17-21`).
- **Vorrang der Reparaturen (fach M-1):**
  - Code: `llm.ts:154`.
  - Test: `pg.test.ts:88-90`.
  - Gegenüber dem Vorschlag des fach-reviewers fehlt nur «Gebäudeversicherung». Die Plan-Notiz begründet das mit dem unsicheren Punkt aus seinem «Nicht bestätigt».
- **Art. 5/6 VMWG nur für Heizung:**
  - Code: `llm.ts:156`.
  - Test fehlt (C-1).
- **JSON-Beispiel ohne Antwortwerte und ohne Artikel:**
  - Code: `llm.ts:165-167`.
  - Test: `pg.test.ts:92-93`.
  - Das Beispiel ist jetzt bewusst kein gültiges JSON (fach V-3, im Plan begründet verworfen). `parseAllocabilityResponse` (`llm.ts:188-201`) gibt bei einer wörtlichen Kopie `null` zurück. Das führt zu `KI_NO_PROPOSAL`, und dieser Pfad ist durch den bestehenden Test `pg.test.ts:129-136` abgedeckt.
- **Stub gibt die Antwort des kleinen Modells wieder, wenn die neuen Regeln fehlen:**
  - Code: `llm-stub.ts:44-49`.
  - Die bisherige Bedingung (Hauswart in der umlagefähigen Liste) bleibt. Neu kommt der Satz aus Regel 2 dazu, mit genau dem Wortlaut aus `llm.ts:155`.
  - Die Rückfallantwort `llm-stub.ts:58-68` antwortet weiter falsch mit Art. 257a. Das ist richtig, denn sie stellt das falsche Modell dar.
- **Szenario «KI beurteilt eine neue Kategorie wie die vordefinierten» bleibt:**
  - `tests/e2e/features/categories-ki.feature` hat kein `@wip`.
  - Im Plan steht «Scenario red» mit Zeile und Meldung.
- **Begründung bei Reparatur mit Art. 256 Abs. 1 OR (fach M-6):**
  - `llm-stub.ts:36-39` in allen vier Sprachen.
  - Das Szenario `categories.feature:66` prüft «Art. 256».
  - `accessibility.ts:194` (`ki-proposal`, Dachsanierung) prüft keinen Text. Die a11y- und Sprach-Zeilen sind deshalb nur indirekt betroffen. Laut Aufrufer sind sie grün.
- **Keine neuen UI-Texte:** Kein `messages/*.json` und keine Datei unter `src/` ist geändert. Die Begründung kommt aus der KI und ist kein `m.key()`-Text. `screens.json` und die Feature-Dateien für Bildschirme brauchen deshalb keinen Eintrag.
- **Plan:** Er enthält `Skills: tdd, ponytail, ponytail-review`, `Test red: …` für den neuen Test, `Scenario red: …` und die Zeile des fach-reviewers in der verlangten Form. Der offene Punkt `llm:eval` mit qwen2.5:3b liegt beim Product Owner, wie es das Issue verlangt.
- **Umfang:** Keine fremden Änderungen. Prettier ist auf `llm-stub.ts` und `category-allocability.pg.test.ts` sauber (ich habe `bunx prettier <datei> | diff` nur lesend laufen lassen). Die Kommentare in `llm.ts:139-140` und `llm-stub.ts:42-43` passen zur Änderung.
- **Sicherheit:** Es gibt keine neue Eingabe. `{name}` und `{description}` werden weiter in einem einzigen Durchgang ersetzt (`llm.ts:185-188`).

## Nicht bestätigt

- **Wirkung auf qwen2.5:3b:** Ob das echte Modell die Treppenhausreinigung jetzt richtig beurteilt und ob die Regeln Fälle aus `backend/scripts/llm-eval.ts` kippen, kann der Diff nicht zeigen. Stub und Unit-Test prüfen nur den Text des Prompts. Das zeigt erst `bun run llm:eval` durch den Product Owner (Plan-Punkt offen). Falls das Ergebnis weiter falsch ist, sagt der Abschnitt «Stop and ask» des Issues, wie es weitergeht.
- **Regel 2 mit «ohne» bei nicht umlagefähigen Kategorien:** «Administration (ohne Verwaltungspauschale)» (`0002_stammdaten.sql:34`) könnte ein kleines Modell so lesen, dass eine Kategorie «Verwaltungspauschale» umlagefähig wäre. Der Prompt schliesst das in `llm.ts:144` ausdrücklich aus. Die fachliche Wirkung habe ich nicht gemessen. Das gehört zum fach-reviewer oder zur `llm:eval`.
- **Vom Aufrufer gemeldet, nicht wiederholt:**
  - lint
  - `deepcheck:audit`
  - `backend/src/__tests__/category-allocability.pg.test.ts` (9 bestanden, neuer Test zuerst rot)
  - backend type-check
  - prettier
  - E2E categories, KI-Szenario und die a11y- und Sprach-Zeilen von category-new/check/edit (34 bestanden)
  - Szenario rot vor der Änderung am Prompt

  Ich habe davon nichts erneut ausgeführt. Der Backend-Test braucht PostgreSQL und baut `dwello_test` neu auf, E2E ist mir untersagt.
- **Noch nicht gelaufen (laut Aufrufer):** coverage, check, die ganze Backend-Suite.
