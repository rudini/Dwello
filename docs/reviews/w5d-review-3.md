# Code-Review W5d «Abgerechnet bis» (#133), Runde 3 und Abschlussrunde vor dem Push

Worktree `review-w5d-code3`, Commit 00a18e8. Geprüft: `git diff f85b076 00a18e8`. Alle geänderten Dateien habe ich gelesen: `ContractForm.svelte`, `contract-edit.dom.test.ts`, `contract-edit.feature`, `messages/{de,fr,it,en}.json`, `implementation_plan.md`, `docs/reviews/workflow-notes-issue-133.md`. Die Berichte `w5d-review-2.md` und `w5d-fachreview-3.md` habe ich nur für die Befunde gelesen. Dazu kamen `billsIn` (`src/lib/contract-status.ts:18-35`), die Fixture `tests/contracts/contract-end-refused.json` und der Schritt `findet die Abrechnungsliste (keine|die) Abrechnung …` (`tests/e2e/steps/statement-detail.steps.ts:216-223`).

**Ergebnis: C-9 ist behoben.** Es gibt keinen neuen Blocker und keinen neuen Major.

## Stand der offenen Befunde

| ID | Stand |
|----|-------|
| C-9 | **Behoben.** `covered(draft)` ist jetzt `billsIn(dates, period) && !billsIn({ ...dates, billedUntil }, period)` (`ContractForm.svelte:116-127`). Der Fall gilt also nur, wenn erst «Abgerechnet bis» die Periode herausnimmt. Nachgerechnet mit Periode 2025: (a) unbefristet ab 2024-04-01, «Abgerechnet bis» 2025-12-31: ohne «Abgerechnet bis» wahr, mit falsch, also abgedeckt. Der Text bleibt wie bei V-10, die Navigation führt nach `back`. (b) Vertragsende 2024-12-31, «Abgerechnet bis» leer: schon das erste `billsIn` ist falsch, also nicht abgedeckt. Es kommt `billedDaysError` und der Assistent, wie auf main. (c) «Abgerechnet bis» vor dem Vertragsbeginn: beide Aufrufe gleich (`until >= begin`), also nicht abgedeckt. (d) «Abgerechnet bis» deckt die Periode nur teilweise ab: das zweite `billsIn` ist wahr, also nicht abgedeckt. Dasselbe Prädikat steuert Text (`saveError`), Folge (`coveredConsequence`) und Ziel (`deleteDraftAndSave`). Der neue DOM-Test (`contract-edit.dom.test.ts:429-440`) wäre mit dem alten `covered` rot: `billsIn({2024-04-01, 2024-12-31, ''}, 2025)` ist falsch, dann käme «ausserhalb von Dwello» |
| C-10 | Offen (Minor), unverändert. Die zwei geänderten Texte sieht die Sprachprüfung weiterhin nicht |
| C-11 | Offen (Nit), unverändert |
| C-12 | **Behoben.** Der Kommentar steht über `saveError` (`ContractForm.svelte:137`) |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-13 | Minor | src/__tests__/contract-edit.dom.test.ts:429-440 | Der Test zu V-15 prüft nur den Fehlertext. Dass in diesem Fall «Entwurf löschen und Mietvertrag speichern» die Standardfolge nennt und in den Assistenten führt (`wizardLink`, die zweite Hälfte von C-9), prüft er nicht. Weil alle drei Stellen dasselbe `covered` aufrufen, ist das nur ein Minor: Zwei Zeilen am Ende des Tests (`click('delete-draft-and-save')`, `expect(goto).toHaveBeenCalledWith(expect.stringContaining('/statements'))` o. Ä.) würden es festhalten |

Wortlaut V-16: Der neue Satz steht in allen vier `messages/*.json` mit derselben Aussage (`de/fr/it/en.json:1503-1504`). Die Begriffe sind dieselben wie vorher: Mietvertrag / contrat de bail / contratto di locazione / rental contract, Abrechnungsperiode / période de décompte / periodo di conteggio / billing period. Den alten Satz verwendet kein Test und kein Schritt mehr (gesucht in `src`, `tests`, `messages`). DOM-Test (`:119-120`) und Szenario (`contract-edit.feature:107`) prüfen den neuen Satz.

V-18: `Und findet die Abrechnungsliste keine Abrechnung 2025 von "Anna Keller"` verwendet einen bestehenden Schritt. Seine Frage liefert die Anzahl (`listedStatementsOfYear(...)).toBe(0)`), der Schritt ruft nur Tasks und Questions auf, und das Feature beschreibt die Absicht, nicht die Bedienung. Bleibt der Entwurf liegen, wird der Schritt rot.

Ein eigenes Szenario für V-15 braucht es nicht. Gegenüber main ändert sich bei einem Vertragsende vor der Periode nichts (alter Text, Assistent), und zwischendurch war f85b076 nie ausgeliefert. Das Verhalten hält der DOM-Test fest.

Ponytail-Review: `ContractForm.svelte:116-127`: Der kürzere Vorschlag aus Runde 2 (`values.billedUntil >= periodEnd`) wäre falsch, wenn zugleich der Vertragsbeginn nach der Periode liegt. Die gewählte Form mit zwei `billsIn`-Aufrufen ist die kürzeste richtige. Lean already. Ship.

Ausserhalb der Anforderung liegt nichts. Die Workflow-Notizen und die Zeilen im Plan gehören zum Schritt 8.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** auf 00a18e8 `bun run lint`, `bun run check`, `bunx vitest run` (2786 grün) und E2E `contract-edit.feature` (chromium, 21 grün); auf f85b076 backend `bun run test` (787 grün) und type-check, E2E contract-detail, contract-edit, statement-generate (chromium und api) sowie die Axe- und Sprachzeilen der Vertragsbildschirme (167 grün). Den Lauf `bunx vitest run src/__tests__/contract-edit.dom.test.ts` wollte ich wiederholen. Die Prüfung, ob `node_modules` im Worktree vorhanden ist, hat eine Berechtigungsregel geblockt (sie zeigt auf `/home/user/Dwello/node_modules`), darum habe ich keinen Test gestartet. Die Rotprüfung des V-15-Tests und des V-18-Schritts habe ich nur durch Lesen beurteilt (siehe oben).
- **Dass das Backend seit f85b076 unverändert ist:** Das zeigt `git diff --stat f85b076 00a18e8`, dort steht keine Datei unter `backend/`.
- **E2E `api`-Projekt für die geänderte Zeile in contract-edit.feature:** Gemeldet ist nur chromium. Der Schritt ist unverändert und lief laut Aufrufer auf f85b076 in beiden Projekten.
