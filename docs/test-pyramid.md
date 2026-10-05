# Testpyramide Dwello (ATDD nach Dave Farley)

**Stand:** 5. Oktober 2026, gezählt aus ausgeführten Läufen (`bun test`, Vitest, Playwright Chromium)

Dwello entwickelt nach **Acceptance Test Driven Development**: Jede Änderung beginnt mit einem fachlichen Akzeptanzszenario, Unit-TDD ist die innere Schleife. Farley unterscheidet zwei Perspektiven, die sich ergänzen:

- **Akzeptanztests** prüfen, ob der Code tut, *was das Business will*.
- **Unit-Tests (TDD)** prüfen, ob der Code tut, *was der Entwickler denkt*.

## Die Pyramide

```
                    ┌──────────────────────┐
                    │  Akzeptanztests (E2E) │   258   Gherkin, Playwright-BDD, Produktions-Build
                    │  "Was das Business    │         ← äussere Schleife: zuerst geschrieben,
                    │   will"               │           grün = Feature fertig
                ┌───┴──────────────────────┴───┐
                │  Integration (echte DB)       │   160   bun test *.pg.test.ts, dwello_test
                │  technische Verträge          │         nur wo Unit-Tests nicht reichen
           ┌────┴───────────────────────────────┴────┐
           │  Unit-TDD                                │   698   Vitest (Frontend 454), bun test (Backend 244)
           │  "Was der Entwickler denkt"              │         ← innere Schleife: Sekunden
           └──────────────────────────────────────────┘
```

Die Menge bleibt eine Pyramide, viele schnelle Unit-Tests unten. Die **Reihenfolge** ist umgekehrt: Das Szenario oben steht am Anfang und entscheidet, wann ein Feature fertig ist.

## Ebenen

| Ebene | Tests | Ort | Runner | Gegen was | Test-Doubles |
|---|---|---|---|---|---|
| Akzeptanz (E2E) | 258 Testfälle aus 40 Features (+2 über den API-Driver) | `tests/e2e/features/*.feature` | Playwright + playwright-bdd | Browser → SvelteKit-Build (`node build`) → Elysia → PostgreSQL `dwello_e2e` (vor jedem Lauf neu migriert) | keine API-Mocks; SMTP-Mail-Catcher statt Mail-Provider, signiertes Session-JWT statt Google-OAuth |
| Integration | 160 in 27 Dateien | `backend/src/__tests__/*.pg.test.ts` | `bun test` | Elysia-App in-process (`app.handle`) → PostgreSQL `dwello_test` (vor jedem Lauf neu migriert) | keine; lokaler SMTP-Server für Mails |
| Unit Backend | 244 in 10 Dateien | `backend/src/__tests__/*.test.ts` | `bun test --isolate` | reine Funktionen der Services | keine |
| Unit Frontend | 454 in 53 Dateien | `src/__tests__`, `src/lib/utils/__tests__`, `tests/unit` | Vitest (`server`: node, `dom`: jsdom) | Load-Funktionen, Actions, BFF, Komponenten | Fake-Backend per `fetch`-Stub / `fakeBff`, `vi.mock` für `$app/*` |

Regeln:

- Kein Test kopiert Produktionslogik („Spiegel-Test“), jeder Test importiert den echten Code.
- Kein Mock der Datenbank: Was SQL braucht, ist ein `*.pg.test.ts`.
- Negative E2E-Prüfungen (etwas fehlt) brauchen zuerst einen positiven Anker (Leer-Hinweis, Seitentitel), sonst bestehen sie auch auf einer Fehlerseite.
- Selektoren: `data-testid` (siehe `CLAUDE.md`).

## Farleys vier Schichten in den Akzeptanztests

| Schicht | Zweck | In Dwello |
|---|---|---|
| Test Cases (Executable Specifications) | *Was* das Business will, in Fachsprache | `tests/e2e/features/*.feature` (Deutsch, Rolle „Liegenschaftsverwalter“, Begriffe aus `UBIQUITOUS_LANGUAGE.md`) |
| Domain Specific Language | Wiederverwendbare fachliche Sprache | `tests/e2e/steps/`, Screenplay: `fixtures/actor.ts`, `tasks/`, `questions/` |
| Protocol Drivers | Übersetzen die DSL in Interaktionen | UI-Driver: `tests/e2e/interactions/` (Browser über Playwright). API-Driver: `tasks/*-api.ts` über `seed.backend` (Backend-API). Vorbedingungen immer über die API (`fixtures/backend.ts`) |
| System under Test | Produktionsähnlich deployt | `npm run build && node build` + Backend + eigene Datenbank (`playwright.config.ts`) |

### Zwei Protocol Drivers

Dasselbe Szenario kann über den Browser oder direkt über die Backend-API laufen. Die Fixture-Option `driver` (`ui` | `api`, `fixtures/test.ts`) wählt den Weg; nur Steps, die mit dem System sprechen, verzweigen danach. Szenarien mit dem Tag `@api` laufen zusätzlich im Playwright-Projekt `api` ohne Seitenaufrufe.

- Wofür `@api`: fachliche Regeln und Berechnungen, die nicht von der Bedienung abhängen (Beispiel: `statement-management-fee.feature`).
- Wofür nur UI: Bedienabläufe, Navigation, Formulare.
- Ein neuer `@api`-Step braucht beide Wege; der API-Weg lebt in `tasks/<bereich>-api.ts`.

Isolation wie bei Farley:

- **Funktional:** `seed.names` hängt an jeden fachlichen Namen eine UUID („Lindenhof“ → „Lindenhof 3f2a…“), Szenarien laufen parallel.
- **Zeitlich:** Jedes Szenario legt seine Daten selbst an und räumt sie weg.
- **System:** Externe Systeme sind an der Grenze ersetzt (Mail-Catcher, Session-JWT).

## Workflow: ein Feature nach ATDD

1. **Beispiele klären:** Akzeptanzkriterien als konkrete Beispiele in der Sprache des Liegenschaftsverwalters formulieren.
2. **Szenario zuerst:** In die passende `.feature`-Datei schreiben, mit `@wip` markieren (von `playwright.config.ts` ausgeschlossen, die Pipeline bleibt grün).
3. **Rot sehen:** `npx bddgen --tags "@wip"` und `npx playwright test`; fehlende Steps über die bestehende DSL ergänzen, bis das Szenario aus dem richtigen Grund fehlschlägt.
4. **Innere Schleife:** Verhalten per TDD herbeiführen (Unit-Tests, pg-Tests nur für SQL, Routing, Mail).
5. **Grün:** `@wip` entfernen. Ab jetzt ist das Szenario Regressionstest und Gate in der Pipeline.

Beispiel: `tests/e2e/features/statement-management-fee.feature` (Verwaltungspauschale nach Verteilschlüssel).

Bedienung, die kein Fachverhalten ist, steht in eigenen Features: `breadcrumb.feature` (Breadcrumb aller Seiten als ein Szenariogrundriss) und `hydration.feature` (Auswahl, bevor eine Seite fertig geladen ist).

## Ausführen

| Ebene | Lokal | CI (`.github/workflows/ci.yml`) |
|---|---|---|
| Unit Frontend | `npm run test` | Job „Unit tests“; in PRs nur Tests geänderter Dateien |
| Unit + Integration Backend | `cd backend && bun run test` (nur DB: `bun run test:pg`) | Job „Unit tests“, wenn `backend/` geändert |
| Akzeptanz | `npm run test:e2e` (nur API-Driver: `-- --project=api`) | Job „E2E tests“; PRs Chromium und `api`, `main` alle Browser und `api` |

Voraussetzung lokal: PostgreSQL auf Port 5432 mit Benutzer `dwello`. Die Testdatenbanken `dwello_test` und `dwello_e2e` werden automatisch neu aufgesetzt; die Entwicklungsdatenbank bleibt unberührt.

## Offen

- [ ] API-Driver auf weitere fachliche Features ausdehnen (heute nur `statement-management-fee.feature`); der Zeitgewinn ist klein, solange das Anlegen der Testdaten dominiert
- [ ] Coverage-Schwelle in Vitest und bun, in CI erzwungen
- [ ] Vertrag BFF ↔ Backend: Frontend-Fakes können abdriften, geprüft wird er nur in E2E
