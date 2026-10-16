# Code-Review #209, Runde 2 (nur Delta): gespeicherter Heizanteil im PDF

Gegenstand: `git diff 67053378 6e569c26` im Worktree `review-209-code2`, also die Fixes zu Runde 1 (`docs/reviews/issue-209-review-1.md`). Ich habe alle 6 geänderten Dateien gelesen: `statement-pdf.pg.test.ts`, `calculation.service.ts`, `statement.service.ts`, `docs/api-specification.md`, `docs/reviews/issue-209-review-1.md` und `implementation_plan.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Nit | backend/src/__tests__/statement-pdf.pg.test.ts:278-294 | Der neue Test erstellt die Abrechnung erst, nachdem `beforeAll` das Profil geändert hat. Profil beim Erstellen und Profil zur Zeit des PDFs ergeben also beide 40 %. Der Test zeigt damit, dass ein Rückgriff stattfindet (ohne ihn fehlt der Hinweis, der Test wird rot). Er zeigt aber nicht, dass der Rückgriff das Profil liest, «wie es jetzt ist», obwohl der Testname das sagt. Ändert man das Profil nach `generateStatement` noch einmal, wäre das belegt. |
| C-6 | Nit | backend/src/services/calculation.service.ts:413 | Für den neuen Zweig `if (!profile) return { byDays: true }` gibt es keinen Test. Gesucht habe ich in `backend/src/__tests__` nach einem Aufruf mit unbekannter `heatingProfileId`. Das Verhalten entspricht dem von `handleMidYearMoves` (`prorating.service.ts:199-200`). Die Planzeile nennt «reads the profile … once». Tatsächlich liest `handleMidYearMoves` das Profil noch einmal, und die Schleife liest es pro Gruppe. Im Code steht nichts Falsches, ungenau ist nur der Plan. |

Keine Blocker, keine Major.

## Runde-1-Befunde

- **C-1 (Minor): erledigt.** `statement-pdf.pg.test.ts:278-294` setzt `heatingShare` auf null, bei gesetztem `heatingProfileId`. Der Test erwartet den Hinweis aus dem aktuellen Profil: Juli bis Dezember 0+0+0+30+5+5 = 40 %. Das ist richtig gerechnet. Ohne den Rückgriff in `statement-pdf.service.ts:137-151` gäbe `heatingOf` `{}` zurück, der Hinweis fehlte, und der Test würde rot. Der Rot-Lauf selbst steht nur im Plan. Zur Schärfe des Tests siehe C-5.
- **C-2 (Minor): erledigt.** In `docs/api-specification.md:210` nennt die Antwort von `/preview` jetzt `heating`, mit `{ byDays: true }`, Anteil, Monaten und Namen, sonst `null`. Das passt zu `StatementCalculation.heating: HeatingShare | null` (`calculation.service.ts:68`) und zum Typ in `schema.ts:320-327`. In Zeile 212 nennt `GET /:id` jetzt `heatingShare`, mit `null` für ältere Abrechnungen. Das stimmt mit der nullable Spalte überein.
- **C-3 (Nit): erledigt.** `heatingOfRun` (`calculation.service.ts:404-421`) holt das Profil selbst und gibt die Namen mit. `heatingShareWithNames` und die beiden Non-Null-Assertions sind weg. Die ungenutzten Importe `HeatingShare`, `StatementCalculation` und `getHeatingProfile` sind aus `statement.service.ts` entfernt. Andere Verweise darauf gibt es im Code nicht mehr, gesucht in `backend/src` und `src`. Für das gespeicherte Ergebnis ändert sich nichts. Bei `byDays: false` kommen dieselben Prozente und Monate heraus, dazu dieselben Namen wie bisher. Bei einem fehlenden Profil ergibt sich `{ byDays: true }`, genau wie bisher über `handleMidYearMoves`. Den Fall «Profil zwischen den Lesezugriffen gelöscht» gibt es nicht mehr als TypeError: Die Namen stammen aus derselben Lesung, aus der der Anteil gerechnet wird. Die Beträge der Positionen kommen weiter aus der unveränderten Schleife (`calculation.service.ts:319-334`).
- **C-4 (Nit): erledigt.** Die doppelte Leerzeile ist zusammen mit der Funktion entfernt.

## Weiter geprüft

- **Umfang:** Das Delta enthält nur die Fixes, den Bericht von Runde 1 und eine Planzeile. Fremde Änderungen sind nicht dabei.
- **Texte, UI, Verträge:** Keine neuen Texte, keine Änderung an `messages/*.json`, kein neuer Bildschirmzustand. Die Preview-Antwort hat jetzt zusätzlich `heating.names`. Das Frontend liest `heating` nicht, und `tests/contracts/statement-preview.json` ist eine Teilmenge der Antwort. Ein Vertrag muss deshalb nicht angepasst werden.
- **Plan:** Die Zeile für Runde 1 nennt den Status aller vier Befunde, und für C-1 nennt sie den Test samt Rot-Lauf.

## Nicht bestätigt

- Backend `bun run test` (629 pass, 0 fail) und `bun run type-check`: vom Aufrufer gemeldet. Nicht selbst gestartet, weil der Reviewer nur Vitest ausführen darf.
- Frontend `bun run lint` und `bunx fallow audit`: vom Aufrufer gemeldet.
- Dass der neue Test ohne den Rückgriff rot war: Das steht nur im Plan. Am Code habe ich geprüft, dass er rot werden muss (siehe C-1).
- `deepcheck:audit`, `test:coverage`, `check` und E2E auf 6e569c26: der Aufrufer meldet sie für diesen Commit nicht. Das Delta ändert nur Backend-Code und Dokumentation.
