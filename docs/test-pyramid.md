# Testpyramide Dwello (ATDD nach Dave Farley)

**Stand:** 8. Oktober 2026, gezählt aus ausgeführten Läufen (`bun test`, Vitest, Playwright Chromium und `api`)

Dwello entwickelt nach **Acceptance Test Driven Development**: Jede Änderung beginnt mit einem fachlichen Akzeptanzszenario, Unit-TDD ist die innere Schleife. Farley unterscheidet zwei Perspektiven, die sich ergänzen:

- **Akzeptanztests** prüfen, ob der Code tut, *was das Business will*.
- **Unit-Tests (TDD)** prüfen, ob der Code tut, *was der Entwickler denkt*.

## Die Pyramide

```
                    ┌──────────────────────┐
                    │  Akzeptanztests (E2E) │   261   Gherkin, Playwright-BDD, Produktions-Build (+8 über die API)
                    │  "Was das Business    │         ← äussere Schleife: zuerst geschrieben,
                    │   will"               │           grün = Feature fertig
                ┌───┴──────────────────────┴───┐
                │  Integration (echte DB)       │   184   bun test *.pg.test.ts, dwello_test, API-Verträge
                │  technische Verträge          │         nur wo Unit-Tests nicht reichen
           ┌────┴───────────────────────────────┴────┐
           │  Unit-TDD                                │   704   Vitest (Frontend 468), bun test (Backend 236)
           │  "Was der Entwickler denkt"              │         ← innere Schleife: Sekunden
           └──────────────────────────────────────────┘
```

Die Menge bleibt eine Pyramide, viele schnelle Unit-Tests unten. Die **Reihenfolge** ist umgekehrt: Das Szenario oben steht am Anfang und entscheidet, wann ein Feature fertig ist.

## Ebenen

| Ebene | Tests | Ort | Runner | Gegen was | Test-Doubles |
|---|---|---|---|---|---|
| Akzeptanz (E2E) | 261 Testfälle aus 41 Features (+8 über den API-Driver) | `tests/e2e/features/*.feature` | Playwright + playwright-bdd | Browser → SvelteKit-Build (`node build`) → Elysia → PostgreSQL `dwello_e2e` (vor jedem Lauf neu migriert) | keine API-Mocks; SMTP-Mail-Catcher statt Mail-Provider, signiertes Session-JWT statt Google-OAuth |
| Integration | 184 in 31 Dateien | `backend/src/__tests__/*.pg.test.ts` | `bun test` | Elysia-App in-process (`app.handle`) → PostgreSQL `dwello_test` (vor jedem Lauf neu migriert) | keine; lokaler SMTP-Server für Mails |
| Unit Backend | 236 in 12 Dateien | `backend/src/__tests__/*.test.ts` | `bun test` (ein Lauf mit den pg-Tests) | reine Funktionen der Services | keine; Resend-Ersatz per `Bun.serve` in `mail.test.ts` |
| Unit Frontend | 468 in 53 Dateien | `src/__tests__`, `src/lib/utils/__tests__`, `tests/unit` | Vitest (`server`: node, `dom`: jsdom) | Load-Funktionen, Actions, BFF, Komponenten | Fake-Backend per `fetch`-Stub / `fakeBff` (aus den API-Verträgen in `tests/contracts`, wo es einen gibt), `vi.mock` für `$app/*` |

Regeln:

- Kein Test kopiert Produktionslogik („Spiegel-Test“), jeder Test importiert den echten Code.
- Kein Mock der Datenbank: Was SQL braucht, ist ein `*.pg.test.ts`.
- Negative E2E-Prüfungen (etwas fehlt) brauchen zuerst einen positiven Anker (Leer-Hinweis, Seitentitel), sonst bestehen sie auch auf einer Fehlerseite.
- Selektoren: `data-testid` (siehe `CLAUDE.md`).
- Fake-Antworten des Backends in Frontend-Tests kommen aus `tests/contracts/*.json`, wo es einen Vertrag gibt; `backend/src/__tests__/api-contracts.pg.test.ts` prüft jedes Feld gegen die echte API (siehe `tests/contracts/README.md`).

## Coverage

Die heutige Abdeckung ist die Untergrenze (auf ganze Prozent abgerundet, also mit wenig Spielraum); sinkt sie, scheitert der Lauf lokal und in CI. Ziel sind 80 %; die Grenzen werden angehoben, sobald die Abdeckung wächst.

| Bereich | Messung | Untergrenze | Ort |
|---|---|---|---|
| Frontend | `npm run test:coverage` (Vitest, v8, alle `src/**/*.{ts,svelte}`) | 71 % Statements, 60 % Branches, 76 % Funktionen, 66 % Zeilen | `vitest.config.ts` |
| Backend | `bun run test` (alle Backend-Tests, lcov) | 82 % Zeilen, 85 % Funktionen | `backend/scripts/coverage-check.ts` (Bun prüft eigene Schwellen pro Datei) |

## Farleys vier Schichten in den Akzeptanztests

| Schicht | Zweck | In Dwello |
|---|---|---|
| Test Cases (Executable Specifications) | *Was* das Business will, in Fachsprache | `tests/e2e/features/*.feature` (Deutsch, Rolle „Liegenschaftsverwalter“, Begriffe aus `UBIQUITOUS_LANGUAGE.md`) |
| Domain Specific Language | Wiederverwendbare fachliche Sprache | `tests/e2e/steps/`, Screenplay: `fixtures/actor.ts`, `tasks/`, `questions/` |
| Protocol Drivers | Übersetzen die DSL in Interaktionen | UI-Driver: `tests/e2e/interactions/` (Browser über Playwright). API-Driver: `tasks/*-api.ts` über `seed.backend` (Backend-API). Vorbedingungen immer über die API (`fixtures/backend.ts`) |
| System under Test | Produktionsähnlich deployt | `npm run build && node build` + Backend + eigene Datenbank (`playwright.config.ts`) |

### Zwei Protocol Drivers

Dasselbe Szenario kann über den Browser oder direkt über die Backend-API laufen. Die Fixture-Option `driver` (`ui` | `api`, `fixtures/test.ts`) wählt den Weg; nur Steps, die mit dem System sprechen, verzweigen danach. Szenarien mit dem Tag `@api` laufen zusätzlich im Playwright-Projekt `api` ohne Seitenaufrufe.

- Wofür `@api`: fachliche Regeln und Berechnungen, die nicht von der Bedienung abhängen. Heute: Verwaltungspauschale (`statement-management-fee.feature`), Vorschau, Erstellen und Periode ohne Mietverträge (`statement-generate.feature`), Heizkosten bei Mieterwechsel (`statement-detail.feature`).
- Wofür nur UI: Bedienabläufe, Navigation, Formulare.
- Ein neuer `@api`-Step braucht beide Wege; der API-Weg lebt in `tasks/<bereich>-api.ts`.

Isolation wie bei Farley:

- **Funktional:** `seed.names` hängt an jeden fachlichen Namen eine UUID („Lindenhof“ → „Lindenhof 3f2a…“), Szenarien laufen parallel.
- **Zeitlich:** Jedes Szenario legt seine Daten selbst an und räumt sie weg.
- **System:** Externe Systeme sind an der Grenze ersetzt (Mail-Catcher, Session-JWT; lokale Ersätze per `Bun.serve` für Ollama in `invoice-categorization.pg.test.ts` und Resend in `mail.test.ts`).

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
| Lint und Typen | `npm run lint` (Warnungen scheitern), `npm run check` (auch `tests/` und `*.config.ts`), `cd backend && bun run type-check` | Job „Lint and types“ |
| Unit Frontend | `npm run test` (mit Coverage: `npm run test:coverage`) | Job „Unit tests“: alle Tests mit Coverage-Untergrenze |
| Unit + Integration Backend | `cd backend && bun run test` (nur DB: `bun run test:pg`) | Job „Unit tests“, in PRs wenn `backend/` oder `tests/contracts/` geändert, auf `main` immer; mit Coverage-Untergrenze |
| Akzeptanz | `npm run test:e2e` (nur API-Driver: `-- --project=api`) | Job „E2E tests“; PRs Chromium und `api`, `main` alle Browser und `api` |

Voraussetzung lokal: PostgreSQL auf Port 5432 mit Benutzer `dwello`. Die Testdatenbanken `dwello_test` und `dwello_e2e` werden automatisch neu aufgesetzt; die Entwicklungsdatenbank bleibt unberührt.

## Offen

- [ ] Frontend-Coverage auf 80 % anheben, dann die Untergrenzen nachziehen (Backend seit Oktober 2026 darüber)
