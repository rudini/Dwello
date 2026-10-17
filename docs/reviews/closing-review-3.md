# Abschliessendes Review, Runde 3 (Slice «closing»)

Worktree `review-closing-3`, detached auf `8e08408`. Delta `git diff 1a936d2 8e08408` mit drei Commits (`6f78a7e`, `cbc41c1`, `8e08408`). Ich habe alle neun Dateien des Deltas vollständig gelesen. Dazu kamen `generateStatementPdf`, `getStatementPdf` und `changeStatementStatus` (`statement-pdf.service.ts:246-318`), `updateStatementStatus` (`statement.service.ts:486-495`, `sentToday` und `settled`), der ganze `describe`-Block der neuen Tests (`statement-pdf.pg.test.ts:685-739`), der Eintrag «Saldo» in `UBIQUITOUS_LANGUAGE.md:156` und die Logs in `backend/src/services`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | erledigt | `tests/e2e/fixtures/screens.ts:94` | Dort steht jetzt «her ended contract». Bestätigt |
| C-3 | erledigt | `backend/src/services/statement-pdf.service.ts:315-316` | Die Bedingung prüft jetzt den verlangten Status (`status === 'sent'`) und nicht mehr den Status danach. Eine Abrechnung mit Saldo 0, die beim Versand auf `paid` springt, bekommt ihr PDF beim Versand. Zum Test «erstellt das PDF auch beim Versand einer Abrechnung ohne Saldo» (`statement-pdf.pg.test.ts:728-738`): Mit der alten Bedingung wäre `settled.status` `paid` gewesen. `sentToday` hätte `pdfGeneratedAt` auf null gesetzt (`statement.service.ts:495`), und das PDF wäre nicht entstanden. Der Test wäre also am zweiten `expect` rot gewesen. Die Daten setzt er vor den `expect` zurück. Ein ungültiger Übergang wirft vorher in `updateStatementStatus`. Ein wiederholter Versand kann das PDF wie versendet deshalb nicht überschreiben. Bestätigt durch Lesen |
| C-4 | Minor (teilweise offen) | `backend/src/services/statement-pdf.service.ts:316` | Der Fehler wird jetzt mit `console.warn` geloggt, so wie in `llm.service.ts:225` und `invoice.service.ts:221`. Der Rückfall «der Versand bleibt gespeichert, wenn das PDF jetzt scheitert» ist aber immer noch nicht getestet. Ohne `.catch` blieben alle Tests grün. `grep IBAN_INVALID` und `generateStatementPdf` mit Fehler in `backend/src/__tests__` finden keinen solchen Fall. Ein pg-Test mit einer IBAN, die über `setConfig` ungültig gesetzt wird, könnte das zeigen. Wegen dieser Lücke ist es kein Major: Eine ungültige IBAN lässt sich über die Einstellungen nicht speichern (#191) |
| C-5 | erledigt | `docs/api-specification.md:202,225` | Beide Stellen beschreiben jetzt das PDF, das beim Versand entsteht, und den Rückfall beim ersten Abruf. Bestätigt |
| C-6 | Nit (offen, wie gemeldet) | `backend/src/services/statement-pdf.service.ts:313-317` | Unverändert: Die Antwort von `PUT /:id/status` enthält `pdfGeneratedAt: null` |
| C-7 | Minor (offen, wie gemeldet) | `src/routes/statements/[id]/PartiesPanel.svelte` | Ich übernehme die Begründung des Aufrufers: Das Verhalten bestand schon vor dieser Änderung und gehört nicht zu #114. Anna hat es in Runde 2 erneut beobachtet (`anna-w3c-2.md:26`), aber nicht als Befund geführt. Im Delta steht diese Begründung nirgends, weder im Plan noch im Archiv |
| C-8 | Minor | `docs/api-specification.md:225`, `docs/reviews/w3c-datenpruefung-2.md:11` (D-1) | Die Spezifikation sagt jetzt, das Versenden «makes the PDF as sent at that moment and keeps it». Laut D-1 der Datenprüfung im selben Delta überschreibt `POST /:id/generate-pdf` (Zeile 224, «Renders … and stores it») das PDF wie versendet aber mit dem heutigen Stand des Mieters. `generateStatementPdf` prüft den Status nicht (`statement-pdf.service.ts:247-281`). Die Oberfläche erreicht das nicht (`PdfAction.svelte` zeigt nur «Herunterladen»), deshalb ist es kein Major. Weder der Plan noch die Spezifikation behandeln D-1, und es gibt auch kein Issue und keine Zeile in `offene-punkte.md` dazu. Lösung: entweder die Spezifikation bei `generate-pdf` einschränken oder D-1 in der Triage ablehnen bzw. aufnehmen |
| C-9 | Nit | `backend/src/__tests__/statement-pdf.pg.test.ts:729` | «ohne Saldo» ist ungenau. Das Glossar kennt «Saldo 0.00» (`UBIQUITOUS_LANGUAGE.md:156`), also eher «mit Saldo 0» |
| C-10 | Nit | `docs/archive/implementation-plan-verlauf.md:866,870-871` | In der archivierten Session ist «oldaddr round 3 (closing review)» noch offen. Das ist diese Runde, deshalb ist es erwartet, es muss nach dieser Runde aber abgehakt werden. Der Punkt «feature review» nennt weder `anna-w3c-2.md` (P-1 und P-3 sind Minor) noch `w3c-datenpruefung-2.md` (D-1) noch `closing-review-1/2.md` |

ponytail-review (Delta): Die Fixes ändern nur eine Bedingung und ein `catch`. Die Wächterbedingung `statement &&` erspart bei einer unbekannten ID eine Abfrage, ohne Code hinzuzufügen. Der Test hat nur zwölf Zeilen und keinen neuen Helfer. Lean already. Ship. net: -0 lines possible.

## Bestätigt

- C-2, C-3 und C-5 sind behoben (siehe Tabelle). Ich sehe keine neuen Texte für die Oberfläche, keine neuen Bildschirme, keine Änderung in `tests/e2e/features` und keine Änderung an einer API-Antwort (`tests/contracts` ist nicht betroffen).
- Ein Szenario ist nicht nötig: Der Fall Saldo 0 beim Versand ist dieselbe sichtbare Änderung wie C-1 (Download-Link nach dem Versand). Die Demodaten haben keine Abrechnung mit Saldo 0 (`w3c-datenpruefung-2.md:61`). Die niedrigste Schicht, die das zeigen kann, ist der pg-Test.
- Session archiviert: Sie fehlt in `implementation_plan.md` und steht vollständig im Archiv. «Blocked on me» ist begründet abgehakt, und `docs/reviews/workflow-notes-w3c.md` gibt es.
- Commit-Betreffe haben höchstens 50 Zeichen, entsprechen den Conventional Commits und tragen die Attributionszeilen.
- Die beiden neuen Berichte haben verschiedenen Inhalt: Persona Anna in `docs/design/personas/anna-w3c-2.md` und die Datenprüfung in `docs/reviews/w3c-datenpruefung-2.md`.
- Formatierung: Die geänderten Zeilen in den beiden Backend-Dateien folgen dem Stil der übrigen Datei. Beide Dateien waren schon vorher nicht Prettier-sauber, weil der Rest der Datei lange Zeilen hat. `tests/e2e/fixtures/screens.ts` zeigt keine Abweichung. Ich sehe nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: Backend `bun test` (770 bestanden), `type-check`, `bun run lint`, `bunx vitest run open-work.test.ts` (5 bestanden). Backend-Tests schreiben in die Testdatenbank, deshalb habe ich sie nicht gestartet.
- Dass der neue pg-Test vor dem Fix rot war, habe ich nur aus dem Code geschlossen (C-3), nicht mit einem Lauf gezeigt.
- D-1 (C-8) habe ich aus dem Bericht der Datenprüfung und aus dem Code von `generateStatementPdf` übernommen, nicht selbst reproduziert.
- Die Befunde P-1 bis P-3 aus `anna-w3c-2.md` habe ich nicht nachgeprüft. Ihre Triage liegt beim Aufrufer.
