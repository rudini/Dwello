# Code-Review 506-5 (Copilot-Fixes PR #941, Runde 1)

Bereich: `git diff 32b8bef d687420 -- . ':!implementation_plan.md'` (ein Commit, d687420)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/statements/[id]/Correction.svelte:30-35 | Der neue Text in «Abrechnung berichtigen» für einen von Hand ausgeglichenen Übertrag (`statements_correct_carry_settled`) ist eine sichtbare Verhaltensänderung ohne Szenario in `tests/e2e/features`. Belegt ist er nur im DOM-Test. |
| C-2 | Minor | backend/src/services/statement.service.ts:830 | Der Kommentar sagt, dass nach dem Versand eines Entwurfs in der Zwischenzeit nichts mehr auszugleichen bleibt. Das stimmt nicht. Weder `settleCarryOver` noch der Versand sperren eine Zeile. Unter READ COMMITTED sieht die Teilabfrage `countedBy` im UPDATE nur den Stand vom Beginn der Anweisung. Den Versand bemerkt sie nicht, weil er die ausgeglichene Zeile nicht ändert und Postgres die Bedingungen deshalb nicht neu prüft. `dropFromDrafts` überspringt danach den inzwischen versendeten Entwurf (`status = 'draft'`). Ergebnis: Der Übertrag ist von Hand ausgeglichen und zugleich verrechnet. Das Zeitfenster ist kleiner geworden, geschlossen ist es nicht. |
| C-3 | Minor | backend/src/services/statement.service.ts:835 | Die umgeschriebenen Bedingungen für die Ablehnung, `isNull(carrySettledOn)` und `` sql`${countedBy} is null` ``, haben keinen Test. Nur die Ablehnung «nicht übertragbar» ist geprüft (`statement-carry-over.pg.test.ts:595`). Nimmt man eine der beiden Bedingungen heraus, bleiben alle Tests grün. Dann liesse sich ein schon ausgeglichener oder verrechneter Übertrag ein zweites Mal ausgleichen. |

## C-1 Kein Szenario für den Hinweis beim Berichtigen nach dem Ausgleich von Hand (Major)

- **Warum falsch:** Bisher sagte der Dialog beim Berichtigen nach einem Ausgleich von Hand `statements_correct_open_settled`. Jetzt sagt er, dass die berichtigte Abrechnung den Übertrag als bezahlt anrechnet. Das sieht der Liegenschaftsverwalter. Nach CLAUDE.md, Workflow 1 und «Done means», braucht diese Änderung ein Szenario ohne `@wip`. Der Diff ändert nichts unter `tests/e2e`. Die E2E-Umgebung kann den Zustand erzeugen, alle Schritte gibt es schon:
  - das Szenario «Ein von Hand ausgeglichener Übertrag ist keine Aufgabe mehr» (`tests/e2e/features/statement-minimum-balance.feature:212`, Schritt «den Übertrag als ausgeglichen markiert»);
  - danach «die Abrechnung berichtigen will» (`tests/e2e/steps/statement-detail.steps.ts:496`) und eine Frage nach dem Text der Bestätigung (wie `statement-detail.feature:965-967`).

  Ein «No scenario» passt deshalb nicht.
- **Wie zeigen:** `grep -rn "von Hand ausgeglichen" tests/e2e/features` findet nur das Szenario `:212`, und dieses öffnet den Dialog «Abrechnung berichtigen» nicht. Stellt man in `Correction.svelte` den alten Zweig wieder her, bleibt jeder E2E-Lauf grün.
- **Ausweg:** Ein neues Szenario in `statement-minimum-balance.feature`. Ein neues Szenario ist frei, die Datei ist auf `main` noch nicht in dieser Form.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `cd backend && bun run test` (1682 pass), `statement-carry-over.pg.test.ts` (54 pass), `src/__tests__/statement-pages.dom.test.ts` und die i18n-Tests (252 pass), `bun run lint`, `bun run check`, `bun run fitness`, Commit-Hooks.
- Regel (c) (Nebenkostenpauschale, Akonto ab dem Tag nach der Periode): Auch vor diesem Diff hat sie kein E2E-Szenario. Die Runden 506-1 bis 506-4 haben das nicht beanstandet. Ob ein Schritt «Akonto ab Datum» für ein Szenario vorhanden ist, habe ich nicht geprüft. Gefunden habe ich nur den Schritt für die Pauschale (`tests/e2e/steps/contract-detail.steps.ts:380`).
- Dass `period_end` eine Spalte vom Typ `date` ist, also `period_end + 1` einen Tag addiert: Ich habe es nicht im Schema gelesen. Der neue pg-Test, der nach Meldung des Aufrufers grün ist, setzt es voraus.

Geprüft: Regel (c) in `carry-over.ts:48-52`. Ein Akonto über 0 genau am Tag nach der Periode fällt jetzt unter `max(valid_from) <= period_end + 1`. Der neue pg-Test (`statement-carry-over.pg.test.ts:541`) wäre auf 32b8bef rot: Das Akonto von 100 gilt am 31.12., das Akonto von 0 ab 1.1. Der DOM-Test (`statement-pages.dom.test.ts:862`) wäre ebenfalls rot: Vorher kam der Text `statements_correct_open_settled`. Der Text stimmt mit `offsetOf()` überein (`paidAmount: balance` bei `carrySettledOn`) und mit dem Fachreview 506-1, V-2. Er steht in allen vier `messages/*.json`. Der neue Dialogtext bringt keine eigenen Bedienelemente, braucht also keine Zeile in `screens.json`. `settleCarryOver` gibt einen Fehler mit Code zurück, und die Transaktion wird zurückgerollt. Die Antwort zu «Zahlung zurücksetzen» hält: `resetPayment` (`statement.service.ts:774`) liegt ausserhalb dieses Diffs. Danach ist die Abrechnung «versendet» und nicht mehr übertragbar, der Dialog nennt das schon («gilt wieder als nicht bezahlt»). Ein neuer Ausgleich von Hand ist möglich, der Fall ist also weder unumkehrbar noch eine Folge dieses Diffs.
