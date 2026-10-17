# Code-Review W6d (#94): Mindest-Saldo CHF 5, Runde 3 (Abschlussrunde nach Major-Fixes)

Gegenstand: `git diff 4e7bad1 662facc` (ein Commit, 662facc), Worktree `review-w6d-code3` (detached 662facc). Alle 11 geänderten Dateien gelesen (die drei Review-Berichte unter `docs/reviews/` als Belege für C-10, D-1, V-12).

**Ergebnis: kein Blocker, kein Major.** C-10, C-15, D-1 und V-12 sind erledigt.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-16 | Minor | `docs/data-model.md:272` | Die Doku zu `paid_amount` sagt weiter «the Saldo when marked paid without an amount (#93); 0.00 when … settled on sending». Seit D-1 gilt 0.00 auch, wenn eine Abrechnung unter CHF 5 ohne Betrag als bezahlt markiert wird (nach «Zahlung zurücksetzen»). Die Doku ist also unvollständig |
| C-17 | Nit | `backend/src/services/statement.service.ts:495` | ponytail/Benennung: `const saldo = waived ? '0.00' : existing.balance` enthält unter CHF 5 gerade nicht den Saldo. Ein Name wie `owed` oder das Inline-Ternary in Z. 496 wäre klarer |
| C-18 | Nit | `backend/src/services/statement.service.ts:487-494` | `settled` setzt `paidAmount: '0.00'` nicht mehr selbst. Ein `PUT …/status {status:'sent', paidAmount:'3.40'}` direkt an die API speichert bei einem Saldo unter CHF 5 jetzt 3.40 statt 0.00. Der BFF sendet beim Versenden keinen Betrag (`src/lib/server/statement-actions.ts`). Das gilt also nur für die rohe API, und die Route nimmt `paidAmount` schon vorher bei jedem Status an |

## Bestätigt

- **C-10 (Major, Runde 2) erledigt:** Das neue Szenario steht in `statement-minimum-balance.feature:69-77`, ohne `@wip` und nur in der UI. Das ist richtig, denn es geht um ein Formular (`tests/e2e/CLAUDE.md:77`).
  - Rechnung 1197 ergibt eine Rückerstattung von CHF 3.00.
  - Der Schritt «fragt die Bearbeitungsseite nur nach einer Bemerkung» prüft zuerst positiv, dass das Bemerkungsfeld sichtbar ist (echter Zustand). Danach prüft er `Count.of(paymentDeadlineInput)` = 0. Die Frage antwortet mit der Anzahl, wie es die Regel für negative Prüfungen verlangt (`tests/e2e/CLAUDE.md:40,74`).
  - Steps rufen nur Tasks und Questions auf. `keepNote` ist eine fachliche Tätigkeit: Bemerkung erfassen und speichern. Den Zielzustand prüft der nächste Schritt «ist … auf der Detailseite».
  - Alle anderen Schritte gibt es schon (`statement-edit.steps.ts:18,53`, `statements.steps.ts:106`).
  - Rot ohne die Änderung: Mit Fristfeld antwortet der Zähler 1, so liest es sich und so meldet es der Aufrufer.
  - Die Funktionalität ist fachlich formuliert, ohne «klickt», «Button» oder «Feld».
- **D-1 (Major, Datenprüfung) erledigt:** `updateStatementStatus` setzt bei `belowMinimum` den Vorgabebetrag 0.00. Das gilt für jedes `paid` ohne Betrag, also beim Versenden und beim späteren Markieren.
  - Der echte UI-Weg sendet keinen Betrag: `markStatementPaid` schickt nur `{status:'paid', paidDate}`, `statement-actions.ts:29`. Damit deckt der Fix den Weg aus der Reproduktion ab.
  - Ein ausdrücklich übergebener Betrag bleibt erhalten. Das ist fachlich richtig, wenn tatsächlich Geld eingegangen ist.
  - Test: `statement-lock.pg.test.ts:139-146` (versenden, `payment-reset` (Route vorhanden, `statements.ts:201`), wieder bezahlt) erwartet `paidAmount '0.00'`. Ohne den Fix kommt `'3.40'` heraus, der Test ist also rot.
  - Die bestehenden Fälle 4.95, −4.95 und 0.05 erwarten weiter 0.00, jetzt über den gemeinsamen Zweig. 5.00 und −5.00 bleiben offen.
- **Sichtbarkeit von D-1:** `paidAmount`/`paidThisMonth` erscheinen in keiner Svelte-Komponente. Der Wert ist nur in `src/routes/dashboard/+page.server.ts:22` typisiert, und `paymentResets` werden ohne Betrag abgebildet (`src/lib/server/statement.ts:101`). Für Benutzer ist der Fix also nicht sichtbar. Ein Szenario ist daher nicht nötig, und der pg-Test ist die unterste Schicht, die den Fehler zeigt.
- **C-15 erledigt:** Die Tests nutzen den modulweiten Helfer `today()` (`statement-lock.pg.test.ts:18`). Die lokale Kopie in Z. 104 stammt vom Basis-Commit und gehört nicht zu dieser Änderung.
- **V-12 erledigt:** Der neue fr-Text von `backend_reminder_below_minimum` entspricht wörtlich dem Vorschlag des Fachreviews und dem Nachbarschlüssel `backend_reminder_refund`. Die drei anderen Sprachen sind unverändert und waren nicht betroffen.
- `implementation_plan.md` ist nachgeführt. Die Review-Berichte unter `docs/reviews/` gehören zur Aufgabe. Fremdes enthält der Diff nicht.
- Keine neue UI, also auch keine neuen `screens.json`-Zustände. Keine API-Antwort hat ihre Form geändert, `tests/contracts` muss nicht nachgeführt werden.

## Ponytail

- `statement.service.ts:495-496`: Inline: `paidAmount: updateData.paidAmount ?? (waived ? '0.00' : existing.balance)` (C-17). Das spart eine Zeile, sonst ist der Fix minimal. Gegenüber vorher ist er kürzer, weil `settled` kein eigenes `paidAmount` mehr hat.

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/open-work.test.ts` (wegen `messages/fr.json` und `implementation_plan.md`): 23 bestanden.
- **Vom Aufrufer gemeldet, nicht neu ausgeführt:**
  - `bun run lint`, `bun run check`, Backend `type-check`
  - volles `bunx vitest run` (2796)
  - Backend `bun run test` (811, mit Coverage-Grenze)
  - E2E chromium+api für `@statements|Dashboard|Übersicht` (207)
- **Rot-Sehen:** Neues Szenario und D-1-pg-Test nur durch Lesen beurteilt und laut Aufrufer. Selbst zurückgenommen habe ich nichts, weil keine Dateiänderung erlaubt ist.
- **C-14 (abgelehnt):** Die Begründung, dass das fallow-Komplexitäts-Gate den Commit blockiert, nicht selbst nachgeprüft (kein `git commit`, keine Hooks ausgeführt).
- **Offene Punkte früherer Runden:** C-11 bis C-13, D-2 bis D-5, V-10, V-11 und M-1 (#352) nicht erneut bewertet; laut Plan sind sie offen bzw. an #291/#352/#353 übergeben.
