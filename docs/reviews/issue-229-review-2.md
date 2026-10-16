# Code-Review #229, Runde 2 (nur Delta)

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-229-code2`, Delta `7afac56b..fc20902b` (ein Commit, fc20902b). Gelesen: alle 7 geänderten Dateien. Dazu gelesen: `recomputedHeating`/`heatingOf` in `statement-pdf.service.ts`, `heatingOfRun` und `periodShare` in `calculation.service.ts`, `handleMidYearMoves` (Rückgabe) in `prorating.service.ts`, `pdf.service.ts:646-654`, die Fixtures `heatingProfile`/`statement`/`unique` in `tests/e2e/fixtures/backend.ts`, die PUT-Route `heating-profiles/:id`, `src/lib/names.ts`, Grundlage und Nachbarszenarien in `statement-detail.feature`, die Schicht-Regeln in `tests/e2e/CLAUDE.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-9 | Nit | implementation_plan.md:26 | Rot der zwei neuen Szenarien und des neuen pg-Tests steht nur als Text in der Zeile zu Runde 1, nicht als eigene Zeilen `Scenario red: <assertion>` / `Test red: <test> – <message>` wie bei den übrigen Punkten |
| C-10 | Nit | backend/src/__tests__/statement-pdf.pg.test.ts:405-407 | Der neue Test prüft für das ganze Jahr (`texts[0]`) nicht, dass der Zusatz zu den Summen fehlt. Im neuen Pfad prüft das der Test bei :83, im Pfad für ältere Abrechnungen (`periodPercent` 100) prüft es kein Test |
| C-11 | Nit | implementation_plan.md:26 | Die Begründung für die Ablehnung von C-4 («rental runs the whole year (`byDays`)») stimmt so nicht: ein ganzes Jahr gibt `byDays: false`. `heatingShare` ist im Vertrag `null`, weil die Abrechnung im Vertragstest keine Heizkostenrechnung hat (`heatingOfRun`: `!groups.some(isHeatingCost)` gibt `null`). Die Ablehnung selbst (Minor, Form in `schema.ts` typisiert) trägt trotzdem |

Kein Blocker, kein Major.

## Status der Befunde aus Runde 1

- **C-1 (Major): behoben.**
  - F-7: Neues Szenario «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» (`statement-detail.feature:273-277`). Der neue Schritt `das Heizprofil {string} heisst danach {string}` (`statement-detail.steps.ts:42-44`) ruft nur `seed.renameHeatingProfile` auf, das ist eine Vorbedingung über `seed`, wie `tests/e2e/CLAUDE.md:29` es erlaubt. Die Fixture (`backend.ts:257-260`) ändert über die Backend-API nur `name`. Das Profil aus der Grundlage hat ebenfalls nur `name` (`backend.ts:249-252`). Damit fällt `localName` ohne den Fix auf den neuen Namen zurück, der Test kann also rot werden. Die Frage `nennt die Abrechnung das Heizprofil` vergleicht mit `names.get("Winter")`. Das ist der eindeutige Name, den `unique` beim Erfassen gesetzt hat, und `unique("Sommer")` überschreibt ihn nicht.
  - Rundung: Neues Szenario «PDF nennt in der Erläuterung denselben Anteil …» (`:279-307`). Die Monatsanteile ergeben 100 %. Mit Einzug am 22.2. ergibt sich 13.9 × 7/28 + 67.5 = 70.975 %, also genau der Wert auf der Hälfte. Das Szenario prüft zuerst die Position (`500.00 70.98 %`) und die Erläuterung (`70.98 % der Heizkosten`), beides als Wert und nicht als Ja/Nein. Alle Schritte gibt es schon (`contracts.steps.ts:16,21`, `statement-detail.steps.ts:51,216`).
  - F-3: Die Zeile `No scenario:` mit Begründung steht im Plan (E2E erzeugt jede Abrechnung mit dem heutigen Code, also immer mit `heating_share`). Den Zustand zeigen die pg-Tests.
- **C-2 (Minor): behoben.** `recomputedHeating` gibt im passenden Fall `periodPercent` aus `shared.periodPercentage` weiter. Gerundet wird mit derselben Formel wie `twoPlaces` in `calculation.service.ts:417,423`. Test `statement-pdf.pg.test.ts:389-408`, Periode Januar bis Juni: «zusammen 52.10 %» (18.6+13.9+11.2+6.1+2.3+0 = 52.1).
- **C-3 (Minor): behoben.** Der Vergleich ist jetzt `Math.round((percentage / 100) * 10000)`, dieselbe Rechnung wie `periodShare` (`calculation.service.ts:334,355`) und wie `percent` (`:419`). Der Test setzt `heating_share` auf `null` und nimmt den Fall auf der Hälfte (70.975 %). Laut Aufrufer war er vorher rot.
- **C-4: abgelehnt.** Die Ablehnung trägt, nur die Begründung stimmt nicht ganz (C-11).
- **C-5 → Kommentar auf #232, C-6 → Kommentar auf #227:** im Plan vermerkt. Dass die Kommentare auf GitHub stehen, habe ich nicht geprüft (siehe unten).
- **C-7 (Nit): behoben** (`implementation_plan.md:12`). **C-8 (Nit): behoben** (`rounded`).

## Weitere Prüfungen am Delta

- Der Zweig, in dem die Werte nicht passen, gibt weder `months` noch `periodPercent` zurück. Der Zusatz bleibt also aus, sobald die Monate fehlen. So soll es sein.
- Der Zweig `share == null` ist unverändert (ohne `periodPercent`), wie vor dem Diff.
- Keine neuen UI- oder PDF-Texte, keine neuen Bildschirme oder Zustände, keine Änderung an einem Vertrag. Nichts im Delta hat mit dem Auftrag nichts zu tun. Prettier meldet für die geänderten Code-Dateien keine Abweichung.
- Features beschreiben, was der Verwalter will («heisst danach», «nennt»), keine UI-Wörter.

## Nicht bestätigt

- Backend `statement-pdf.pg.test.ts` (34 pass) und dass der neue Test vor dem Fix rot war: vom Aufrufer gemeldet. Nicht erneut ausgeführt, weil es ein Backend-Test gegen PostgreSQL ist und kein `vitest`.
- `bun run type-check`, `bunx fallow audit`, Frontend lint, check, `statement-mapping.test.ts`: vom Aufrufer gemeldet.
- E2E chromium + api `statement-detail.feature` (30 passed) und dass beide neuen Szenarien rot waren, wenn man ihren Fix herausnimmt: vom Aufrufer gemeldet. Nachgeprüft habe ich nur, ob es rot werden kann, über die Fixture, die nur `name` setzt (siehe C-1).
- Die Kommentare auf #232 (C-5) und #227 (C-6): nicht auf GitHub geprüft, nur die Planzeile gelesen.
- Ob die Wohnungen 3.01 und 3.02 die Heizkosten wirklich je zur Hälfte tragen (500.00): aus dem Verteilschlüssel geschlossen, nicht nachgerechnet. Laut Aufrufer ist das Szenario grün.
