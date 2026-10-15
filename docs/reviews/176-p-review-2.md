# Code-Review #176, Slice «Persona-Fixes», Runde 2 (Delta)

Geprüft: `969f233..2474675` im Worktree `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/review-176-p2`. Es gibt drei Commits:

- `52d9123`: Workflow-Review
- `97fb68a`: Persona-Bericht
- `2474675`: Fixes

Alle 16 geänderten Dateien sind gelesen. Die Persona-Berichte `helga-176-2.md` und `sven-176-2.md` habe ich nur auf ihre Befunde hin und gegen die Triage im Plan gelesen. Dazu kamen als Umgebung `CategoryProposal.svelte`, `new/+page.svelte`, `RadioGroup.svelte`, `targets/categories.ts`, `backend/scripts/llm-stub.ts`, `docs/test-pyramid.md:30` und `tests/e2e/CLAUDE.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| G-3 | Major (Teil «Prüfung läuft» weiter offen) | `tests/a11y/screens.json:33-35`, `CategoryForm.svelte:132-133` | `ki-proposal-kept` ist nachgetragen. Der Zustand «Die KI prüft die Kategorie …» fehlt weiter in allen drei Listen. Die Begründung der Ablehnung trägt nicht, siehe unten. |
| G-9 | Nit | `tests/e2e/targets/accessibility.ts:20-21` | `notAllowedOption` greift über den CSS-Teil `input[value="false"]` auf die Option zu. Die Konvention verlangt `data-testid`. Gleich daneben steht `targets/categories.ts:7-9` mit `allowanceOption`, das den Namen der Option braucht und deshalb an die Sprache gebunden ist. Eine Test-ID je Option (z. B. `category-allowance-false`) würde beides abdecken. |
| G-10 | Nit | `src/__tests__/categories-page.dom.test.ts:262-268` | «nimmt den Vorschlag zurück, sobald die Beschreibung ändert» prüft nur, dass der Vorschlag verschwindet. Dass auch die Wahl der KI zurückgeht, prüft er nicht. Der Kommentar in `CategoryForm.svelte:52-54` verspricht beides. Abgedeckt ist es nur indirekt: Derselbe `else`-Zweig ist für die Namensänderung getestet. |

## Stand der Befunde aus Runde 1

| ID | Stand | Beleg |
|---|---|---|
| G-1 | behoben | `answered` wird nur ersetzt, wenn ein `proposal` kommt (`CategoryForm.svelte:58-61`). Ein `{ errors }` ohne `proposal` lässt `current` stehen. Der Test «behält Vorschlag und Wahl der KI, wenn das Speichern abgelehnt wird» deckt genau den Ablauf aus Runde 1 ab und ist grün. |
| G-2 | Ablehnung hält | Siehe unten. |
| G-3 | teilweise behoben: `ki-proposal-kept` ja, «Prüfung läuft» nein | Siehe unten. |
| G-4 | behoben | Der zweite Effekt (`:77-79`) leert `kiChoice`, sobald die Wahl davon abweicht. Ein späteres Zurückwählen gilt damit als eigene Wahl. Beide Abläufe aus Runde 1 habe ich nachvollzogen. (a) Beim Umbenennen trifft der `else`-Zweig nicht zu, weil `values.allowed` nicht mehr gleich `kiChoice` ist, das jetzt `''` ist. Dazu gibt es einen Test. (b) Bei einer zweiten Prüfung ist `applied` `false`, und die Wahl bleibt. Dafür gibt es keinen eigenen Test, es ist aber derselbe Mechanismus. Eine Schleife zwischen den beiden Effekten entsteht nicht: Effekt 1 setzt beide Werte gleich, also ändert Effekt 2 nichts. |
| G-5 | behoben (mit G-10) | Das BFF gibt `description` zurück (`category.ts:97, 102`). Der Wert ist in `parseCategory` getrimmt (`:35, 43`), so wie `values.description.trim()`. `categories.test.ts` ist angepasst. Die Antwort kommt vom BFF, deshalb ist kein Vertrag unter `tests/contracts` betroffen. Auf der Bearbeitungsseite wird `values.description.trim()` nicht ausgewertet, weil `answered` fehlt. |
| G-6 | behoben | `ui-choices.dom.test.ts:95-108` prüft am `fieldset` und an der Option, dass der Fehler an erster Stelle steht. |
| G-7 | behoben | `applied && values.allowed === kiChoice` (`:138`). Der Test «sagt nach dem Umwählen nicht mehr, Dwello habe die Wahl vorgewählt» ist grün. |
| G-8 | offene Arbeit | Er steht in U-29 (`offene-punkte.md`). |

## Blocker/Major

### G-3 (weiter offen): Der Zustand «Die KI prüft die Kategorie …» fehlt in den Bildschirmprüfungen

Laut Plan bleibt der Zustand aus den Bildschirmprüfungen draussen: Er daure nur so lange wie die Anfrage, und eine Anfrage aufzuhalten sei kein erlaubtes Double (`docs/test-pyramid.md`: nur Fehlerantworten). Das stimmt für den Browser-Rand: `FailRequests` darf nur mit einem Fehlerstatus antworten (`tests/e2e/CLAUDE.md:33, 65`). Daraus folgt aber nicht, dass sich der Zustand nicht erreichen lässt.

- Die E2E-Umgebung hat schon einen deterministischen Stand-in für die KI an der Systemgrenze. `docs/test-pyramid.md:30` erlaubt ihn ausdrücklich, und er antwortet heute schon je nach Name verschieden (`backend/scripts/llm-stub.ts`: `sanierung`, `bewachung`, Rest).
- Eine Regel wie «antwortet bei `/langsam/` erst nach n Sekunden» erfindet keine Daten. Sie fängt keine Anfrage im Browser ab und ist von derselben Art wie die Regel für `bewachung`.
- Die Persona-Runde 2 hat genau das getan: «Antwort absichtlich um 8 s verzögert» (`helga-176-2.md:24`, Sven P-4).

Die Regel in CLAUDE.md, Design-Regeln/Process, lautet: «new screens or states go into `tests/a11y/screens.json`, …». Eine Ausnahme sieht sie nicht vor.

Was sich ohne diesen Zustand nicht zeigen lässt: Der Zustand enthält einen neuen Text (`categories_proposal_checking`) und den gesperrten Knopf «Bitte warten …» im Formular. Weder axe (hell/dunkel, drei Geräte) noch die Prüfung «kein Deutsch in fr/it/en» sehen ihn. Helga P-11 meldet für genau diesen Zustand, der Knopf sei bei 150 % «nur mit Mühe» lesbar. Der Knopf im Zustand `busy` läuft zwar in der Galerie (`busy-dialog-open`) durch axe, aber nicht im Formular und nicht mit dem Text darunter.

Was den Befund schliesst:

- entweder ein Zustand `ki-checking` über eine verzögerte Antwort des Stand-ins. Er läuft mit `Wait.until` auf den Text und braucht eine Verzögerung, die für axe über alle Varianten reicht.
- oder, wenn der Aufrufer auch eine verzögerte Antwort des Stand-ins für ein unerlaubtes Double hält: Dann widersprechen sich zwei Regeln, und die Entscheidung gehört unter «Blocked on me» bzw. als Befund in `workflow-rules-review-issue-176.md`. Die Liste W-1 … W-12 nennt den Widerspruch bisher nicht. Eine Ablehnung allein reicht dann nicht.

### G-2: Die Ablehnung hält

Workflow 6 regelt den Fall ausdrücklich: «A fixed persona finding is closed by a test that shows it (scenario or lower layer, red before the fix)». Für einen Persona-Befund ist das die speziellere Regel gegenüber Workflow 1. Die DOM-Tests im Plan (`implementation_plan.md:28`, `:46`, `:47`) sind als rot vor dem Fix vermerkt. Die Kernabläufe der Funktion, also Vorschlag, Übersteuern und keine Wahl, bleiben durch die grünen Szenarien von `categories.feature` gedeckt. Mein Einwand aus Runde 1 betraf das Gewicht der Befunde, nicht die Regel. Für die Ablehnung genügt die Regel.

## Geprüft und bestätigt

- **`$effect.pre` für `answered`:** Der Effekt liest nur `proposal` und schreibt nur `answered`. `current` liest `answered`, aber nicht `proposal`. Wenn die Seite neu geladen wird oder die Komponente neu entsteht, fängt `answered` leer an. Nach einem erfolgreichen Speichern wird auf die Liste weitergeleitet. Einen veralteten Vorschlag habe ich auf keinem Weg gefunden, der aus dem Code nachvollziehbar ist.
- **Name oder Beschreibung zurück auf den geprüften Wert:** Vorschlag und Wahl der KI kommen wieder, so wie bisher beim Namen.
- **`ki-proposal-kept`:**
  - Der Eintrag steht in `screens.json` (Zustand beschrieben und der Seite `category-new` zugeordnet), in `accessibility.feature:131` und in `sprachen-bildschirme.feature:132`.
  - Die Aufgabe zuerst wählen und dann prüfen lassen liegt in der Task-Schicht.
  - Der Stand-in antwortet für «Treppenhausreinigung» mit «umlagefähig». Die eigene Wahl «Nicht umlagefähig» bleibt also, und der Text `categories_proposal_kept` erscheint.
  - Der Zustand hängt nicht von der Sprache ab, was für die Sprachzeilen nötig ist (mit G-9).
- **Plan:** Für Helga P-8, G-1, G-4, G-5 und G-6 gibt es je eine `Test red`-Zeile. Die `Skills:`-Zeile umfasst die Persona-Fixes. Die offenen Persona-Befunde der Runde 2 (Sven P-10, P-11; Helga P-7, P-9 bis P-11 und die Beobachtung) und G-8 stehen in U-29. Die Runde 2 der Personas hat keinen Major gemeldet, der offen geblieben wäre.
- **Umfang:** Alle Änderungen im Delta gehören zu den Befunden aus Runde 1 oder zu den Persona-Befunden der Runde 2. Formatierung ausserhalb der Aufgabe habe ich nicht gefunden.

## Nicht bestätigt

- Diese Prüfungen habe ich nicht wiederholt (alle vom Aufrufer gemeldet):
  - lint, check, deepcheck und das Fallow-Gate
  - test:coverage (151 Dateien / 2381 Tests)
  - Backend 579
  - E2E chromium mit «Kostenkategorien» und den `category-*`-Zeilen samt `ki-proposal-kept` (30 + 10)
  - die volle Suite (676) auf `969f233`
- Selbst ausgeführt: `bunx vitest run` auf `categories-page.dom.test.ts`, `categories.test.ts` und `ui-choices.dom.test.ts`. Ergebnis: 3 Dateien, 58 Tests grün.
- Ob die neuen Tests zuerst rot waren, habe ich nicht nachgeprüft. Ich habe nur die Plan-Zeilen `:46` und `:47` gelesen.
- G-4 (b), die zweite Prüfung nach dem Zurückwählen, und die Rücknahme der Wahl der KI bei geänderter Beschreibung (G-10) habe ich nur am Code nachvollzogen. Im Worktree lege ich keine Testdateien an.
- Ob eine verzögerte Antwort des Stand-ins über alle sechs axe-Varianten stabil genug ist, habe ich nicht ausprobiert. E2E starte ich nicht.
