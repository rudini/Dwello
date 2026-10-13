# Review Slice 2 (b13-workflow-improvements), Runde 1

Anforderung: Punkte 4, 10, 12, 16 und 18 aus `docs/reviews/b13-instruktionen-pruefung.md`, «Verbesserungen an Instruktionen, Skills, Hooks»; Entscheide in `implementation_plan.md`, Session 24.
Umfang: `git diff e3ea106..72a901d` (6 Dateien) und die Slice-2-Zeilen von `CLAUDE.md` aus e3ea106 (Commands `test:e2e:wip`, Workflow 1, Workflow 5, Gotcha «One build»). Gelesen im Worktree `review-s2` (72a901d).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `CLAUDE.md:63`, `.claude/agents/persona.md:10` | «give each its own building of the demo data»: die Demodaten haben 3 Gebäude, Workflow 5 startet bis zu 5 Personas parallel; für Persona 4 und 5 gibt die Regel nichts vor (Punkt 18 bleibt dort offen). |
| C-2 | Minor | `.claude/agents/code-reviewer.md:21`, `.claude/skills/bdd-acceptance/SKILL.md:21` | Punkt 4 entstand, weil der Reviewer «eine Anfrage» als einen Aufruf las; seine eigene Checkliste und der Skill sagen weiter «A failing request» / «answers that request» ohne «ein Endpunkt, alle seine Aufrufe». |
| C-3 | Minor | `.claude/agents/persona.md:10` | «work in the building the caller gives you»: offen, was gilt, wenn der Aufrufer kein Gebäude nennt (einzelne Persona) und bei Aufgaben, die über alle Gebäude schauen (Anna «was ist zu tun», Dashboard, Dr. Weber «die Abrechnungen prüfen»): dort sieht die Persona die Datensätze der anderen weiterhin, wie im Fall aus Punkt 18. |
| C-4 | Nit | `tests/e2e/CLAUDE.md:64` | «`FailRequests.noLonger` lifts it»: `noLonger` ruft `unrouteAll()` (`screenplay/interactions.ts:141`) und hebt damit alle Routen der Seite auf, z. B. auch `Navigate.toWithScriptsHeldBack`. «lifts all routes of the page» wäre genau. |
| C-5 | Nit | `package.json:13` | `test:e2e:wip` löscht `.features-gen` nicht (Vorschlag in Punkt 16). Gegen den beschriebenen Fehler reicht `&&` (nachgeprüft, siehe unten), aber nach einem roten `bddgen` bleiben die alten Dateien liegen, und ein späteres `bunx playwright test` ohne `bddgen` würde sie laufen lassen. Die Notiz in `tests/e2e/CLAUDE.md:15` deckt das ab. |
| C-6 | Nit | Commit 72a901d | Typ `docs`, obwohl `playwright.config.ts` (`actionTimeout`) und `package.json` (neues Skript) das Verhalten der Testläufe ändern; `chore(tests)` hätte gepasst. |

## Blocker/Major

### C-1: Nicht genug Gebäude für «ein Gebäude pro Persona»

`backend/demo/demo-data.sql:10-13` legt genau drei Gebäude an (Musterhaus Zentrum, Seepark Residenz, Alpenblick). `CLAUDE.md`, Workflow 5, startet «once per affected persona» aus `docs/design/personas/README.md`, also bis zu fünf (Helga, Marco, Dr. Weber, Sven, Anna), und Punkt 15 derselben Prüfung schlägt vor, im Zweifel alle zu starten. Die neue Zeile «Personas that run at the same time share one database: give each its own building of the demo data» lässt sich ab der vierten Persona nicht einhalten. Eine Ersatzregel fehlt, obwohl Punkt 18 selbst eine nennt («oder Speichern nur in einer Persona pro Lauf»). Damit kann der Fall aus Punkt 18 wieder eintreten: zwei Personas speichern im selben Gebäude, und die eine sieht den Mietvertrag der anderen. `persona.md` erlaubt jetzt das Speichern (Punkt 10), also ist dieser Fall wahrscheinlicher als vorher.

So zeigt man den Fehler: Für eine UI-Änderung am Mietvertrags-Wizard sind alle fünf Personas betroffen. Wer Workflow 5 befolgt, braucht fünf Gebäude, hat aber drei.

Behebung (kurz): in Workflow 5 und `persona.md` einen Satz ergänzen, etwa «more personas than buildings: those without their own building do not save», oder «at most three in parallel».

## Bestätigt

- **Punkt 4:** `docs/test-pyramid.md:30`, `CLAUDE.md` Workflow 1 und `tests/e2e/CLAUDE.md:32,64` sagen «ein Endpunkt (alle seine Aufrufe), nur Fehlerstatus», nennen `FailRequests` und den a11y-Zustand mit Fehler (Route setzen, dann `Navigate.reload`). Das stimmt mit dem Code überein: `FailRequests.to` antwortet mit `route.fulfill({ status: 500 })` ohne Body auf jede URL mit diesem Pfad und diesen Query-Werten (`interactions.ts:134-142`), und `tasks/accessibility.ts:183,191` setzt die Route auf der offenen Seite und lädt sie dann neu.
- **Punkt 10:** `persona.md:10` erlaubt das Speichern. Die Begründung stimmt: `persona-stack.sh` löscht `dwello_persona` bei jedem Start und legt die Datenbank neu an.
- **Punkt 12:** Die Gotcha «One build» und der Verweis in Workflow 5 stimmen. `persona-stack.sh` ruft `bun run build` auf und `node build` liest aus `build/`; der `webServer` von `playwright.config.ts` ruft `bun run build && node build` auf, wenn Port 3100 frei ist.
- **Punkt 16 (`@wip`):** In einem Scratch-Projekt mit demselben `playwright-bdd` nachgeprüft. `bddgen` leert den Ausgabeordner vor dem Generieren. `--tags @wip` überschreibt `tags: 'not @wip'` aus der Konfiguration und erzeugt nur die `@wip`-Datei. Bei einem fehlenden Schritt endet es mit Exit 1, und die alte Datei bleibt liegen. Die `&&`-Kette in `test:e2e:wip` hält Playwright in diesem Fall an. `bun run test:e2e:wip -- -g "X"` hängt `-g "X"` an `playwright test` an (mit `bun run` nachgeprüft).
- **Punkt 16 (`actionTimeout`):** ist in `playwright.config.ts:125-126` gesetzt; der Plan hält die Reproduktion fest (32 s vorher, 12 s danach).
- `CLAUDE.md` Commands: `test:e2e:wip` steht dort, `docs/test-pyramid.md:88` nennt es auch, und es gibt in Doku ausserhalb des Archivs keinen alten `bddgen --tags`-Befehl mehr.
- Für eine reine Doku- und Konfigurationsänderung braucht es weder ein Szenario noch Texte in `messages/*.json`, und kein Vertrag in `tests/contracts` ist betroffen.

## Nicht bestätigt

- **Ganze E2E-Suite mit `actionTimeout: 10000`:** nicht gelaufen (der Aufrufer hat das untersagt). Der Wert gilt nicht nur für Klicks, sondern auch für `hydrated()`/`Wait.until` (`locator.waitFor`, `interactions.ts:13,106`) und für `DownloadFrom` (`waitForEvent('download')`, `interactions.ts:116`). Diese Wartezeiten waren bisher nur durch den Test-Timeout von 30 s begrenzt, jetzt durch 10 s. Ob eine PDF-Erzeugung oder eine Hydration unter WebKit/Firefox in CI (2 Worker) länger als 10 s braucht, lässt sich nur mit einem Lauf aller Projekte zeigen. Ob `waitForURL` (`Wait.forUrl`) und `goto` vom `actionTimeout` betroffen sind, hängt davon ab, wie `@playwright/test` den Navigations-Timeout setzt. Der Quelltext in `node_modules` war für mich gesperrt (Leseregel), deshalb ist das nicht nachgeprüft.
- **Wartezeit von über 10 Minuten aus B-13:** auch vom Implementierer nicht reproduziert (siehe Plan). Ob `actionTimeout` sie verhindert hätte, bleibt offen; die Notiz «Give a run a Bash timeout anyway» fängt das auf.
- **Ob jedes Demo-Gebäude für die Standardaufgaben passt:** z. B. eine freie Wohnung für Helga, ein Jahr ohne Abrechnung für Marco (nur Alpenblick hat keine Abrechnung 2025). Nicht nachgeprüft, weil keine Persona gelaufen ist.
