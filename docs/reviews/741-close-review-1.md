# Code-Review 741-close, Runde 1 (0e046f6..8729f6d)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/features/contract-detail.feature:285-292 | Die neue Reihenfolge der fehlenden Abrechnungen (älteste zuerst, #741 «Decided» Punkt 4) ist eine Verhaltensänderung, die der Liegenschaftsverwalter sieht, aber kein Szenario ohne `@wip` prüft sie; die Commit-Nachricht nennt auch kein `No scenario: <reason>`. |
| C-2 | Minor | src/__tests__/contract-detail-page.dom.test.ts:308 | Der Kommentar über dem geänderten Test sagt weiterhin «the newest first», der Test prüft jetzt aber «die älteste zuerst». |

## C-1 (Major): Kein Szenario für «älteste Periode zuerst»

Nach `CLAUDE.md` (Workflow 1, «Done means») braucht jede Verhaltensänderung ein Szenario in `tests/e2e/features` ohne `@wip`. 8729f6d ändert, in welcher Reihenfolge die Warnung die Perioden zeigt (`missing.toReversed()` in `src/routes/contracts/[id]/MissingStatement.svelte:39`). Das zeigt nur `contract-detail-page.dom.test.ts` (Reihenfolge von Labels und hrefs). Kein Szenario prüft die Reihenfolge: Der Step `meldet der Mietvertrag die fehlende Abrechnung {string}` (`tests/e2e/steps/contract-detail.steps.ts:275`) prüft mit `toContain` nur, ob die Periode irgendwo im Warntext vorkommt. Das Szenario «Fehlende Abrechnungen folgen der Abrechnungsperiode des Gebäudes» (Zeilen 287-292) bliebe deshalb grün, wenn `.toReversed()` wieder entfernt wird; das zeigt auch der grüne Lauf des ganzen Features vor und nach der Änderung. Der E2E-Stack kann den Zustand herstellen: Dasselbe Szenario erzeugt schon drei fehlende Perioden.

Behebung: ein neues Szenario oder eine neue Zeile (frei nach `tests/e2e/CLAUDE.md`, «Rules»), zum Beispiel mit einer Frage, die die Perioden der Warnung als Liste in ihrer Reihenfolge beantwortet («Dann nennt der Mietvertrag die fehlenden Abrechnungen in der Reihenfolge "01.07.2023 – 30.06.2024", "01.07.2024 – 30.06.2025", "01.07.2025 – 30.06.2026"»). Weil der DOM-Test rot gesehen wurde, braucht das Szenario keinen eigenen roten Lauf (Workflow 2), es muss aber ohne die Änderung fehlschlagen können.

Geprüft: `toReversed()` kopiert die Liste und lässt das Prop unverändert, `missing[0]` für den Titel einer einzelnen Periode ist davon nicht betroffen, Node ≥ 20 in `engines`; der Kopfkommentar der Komponente («the newest first») beschreibt weiterhin richtig das Prop. Die Umbenennung von Step und Feature-Kommentar (22448b1) behebt C-1/C-2 aus 741-review-1, die Step-Definition prüft dasselbe wie vorher (`[0, 0]`). ponytail-review: nichts zu melden. Zurückgestellte Persona-Befunde: P-2 (Reihenfolge abrechnen/Rechnungen; schon auf main, inklusive «Erfassen Sie zuerst die Rechnungen» im Text, entschieden in #211), P-3 (#741 Punkt 1: alle Perioden bleiben sichtbar), P-5 (schon auf main) und die Ablehnung von P-4 (Seed) halten; alle sind Minor.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `contract-detail-page.dom.test.ts` (72, die geänderte Erwartung vor der Komponentenänderung rot gesehen), `tests/e2e/features/contract-detail.feature` (67 grün), der umbenannte Step erneut grün; auf 0e046f6: fitness, Backend type-check, `vitest --changed origin/main`, `i18n.test.ts`, a11y- und Sprachzeilen contract-detail/missing-statements.
- P-4: ob «Abgerechnet bis 31.12.2023» neben einer bezahlten Abrechnung 2024 nur durch den SQL-Seed des Aufrufers entsteht, habe ich nicht nachgeprüft (kein Zugriff auf den Persona-Stack); gelesen nur `docs/design/personas/marco-741.md:11,47`.
