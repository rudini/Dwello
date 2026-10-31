# Code-Review #545, Runde 2 (Delta a0b434e..7957d78, ohne docs/reviews und docs/design/personas)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | backend/src/__tests__/reminders.pg.test.ts:140 | Weiter offen. Der Test hält bestehendes Verhalten fest, aber keine Commit-Nachricht sagt das. Laut Aufrufer soll es der PR-Text nachholen. Den gibt es noch nicht. |
| C-5 | Minor | src/routes/statements/StatementRow.svelte:67 | Weiter offen. Für die Bedingung `status === 'overdue'` in der Liste gibt es keinen Test, der bezahlte und ersetzte Abrechnungen abdeckt. |
| C-6 | Major | tests/e2e/features/statement-reminder.feature:133-140; src/routes/documents/DocumentItem.svelte:47 | Die Korrektur von P-1 ändert sichtbares Verhalten. Kein Szenario prüft sie, nur ein DOM-Test. |

## C-6 (Major): Die sichtbare Korrektur von P-1 hat kein Szenario

**Was falsch ist:** Mit 7957d78 zeigt ein Mahnbrief, der noch «Zu versenden» ist, die Zeile «Zahlungsfrist der Mahnung: …» nicht mehr. Das gilt im Abschnitt «Mahnungen» der Abrechnung (`ReminderHistory.svelte:14` nutzt `DocumentItem`) und in «Dokumente». Der Liegenschaftsverwalter sieht die Änderung. Sie behebt den Major P-1 aus dem Persona-Bericht.

Nach CLAUDE.md, Workflow 1, braucht jede Verhaltensänderung, die ein Nutzer sieht, ein Szenario ohne `@wip`. Gedeckt ist sie nur durch den DOM-Test in `src/__tests__/documents.dom.test.ts:54-65`. Dass dieser rot war, entbindet nur vom eigenen Rotlauf des Szenarios, nicht vom Szenario selbst.

Das Szenario «Ein Mahnbrief zählt erst ab dem Versand» sagt im Kommentar dazu (Z. 133): «vorher nennt Dwello weder sein Datum noch eine Frist ab ihm». Keiner seiner Steps prüft aber eine Frist am Brief. Seine Steps prüfen nur:
- `statement-last-reminder` fehlt,
- der Hinweis «zu versenden» steht in der Abrechnung,
- der Hinweis steht in der Liste.

Die einzige E2E-Prüfung der Zahlungsfrist am Brief ist `documents.steps.ts:123-127`. Sie prüft das Vorhandensein bei einer per E-Mail versendeten Mahnung.

Das Szenario ist in diesem PR neu und steht noch nicht auf `main`. Ein weiterer `Dann`-Schritt braucht also keine Spec-Freigabe.

**Wie es sich zeigt:** Die Bedingung in `DocumentItem.svelte:47` auf den Stand der Basis zurücksetzen: `{#if document.paymentDeadline && !document.notToSend}`. Dann schlägt nur der DOM-Test fehl. Alle Szenarien in `statement-reminder.feature` und `documents.feature` bleiben grün, weil keines bei einem wartenden Brief prüft, dass die Zahlungsfrist fehlt.

**Vorschlag:** In «Ein Mahnbrief zählt erst ab dem Versand» einen Schritt ergänzen, etwa «Und führt die Abrechnung die "Zahlungserinnerung" ohne Zahlungsfrist». Die Question dazu gibt den Text des Briefs zurück, so wie `documentFor`.

Geschlossen: C-1, C-2, C-4.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer gemeldet, ausgeführt habe ich keinen:
  - Backend `bun run type-check`
  - eslint auf den geänderten Dateien
  - `bun run check`
  - `bunx vitest run src/__tests__/documents.dom.test.ts src/__tests__/documents.test.ts src/__tests__/tenant-documents.test.ts` (26 pass)
  - E2E Chromium `statement-reminder` und `documents` (20 pass)
  - DOM-Test «Mahnung, die noch zu versenden ist» rot gesehen
- Rotlauf des DOM-Tests: aus dem Code geschlossen. Die Fixture `letter()` hat `status: 'to_send'` und kein `notToSend` (`documents.dom.test.ts:9-18`). Auf a0b434e zeigte die wartende Zeile also die Zahlungsfrist, und `not.toContain('Zahlungsfrist')` schlägt fehl.
- C-2, ein PUT `/statements/:id/status`, der `reminderSentDate` weiter mitschickt: Der Service verteilt `...additionalData` in das Update (`statement.service.ts:739`). Dass Elysia das unbekannte Feld nach dem Entfernen aus `t.Object` verwirft und nicht in die Spalte schreibt, habe ich nur aus dem Standardverhalten von Elysia geschlossen (normalize). In den Quellen habe ich es nicht nachgelesen, ein Test dafür fehlt. Das Frontend und die Tests senden das Feld nicht (grep in `src`, `tests`, `backend/src/__tests__`).

Geprüft:
- Nur Reminder-Dokumente tragen `paymentDeadline` (`reminder.service.ts`, `document.service.ts`). Die neue Bedingung `status === 'sent'` schliesst damit auch die frühere `notToSend`-Bedingung ein. Diese gilt nur für wartende Briefe, deshalb bleibt kein toter Code.
- Doku C-1: Beide Zeilen geben jetzt die Herleitung aus `sent_at` richtig wieder.
- Question C-4: Sie liefert die gelesenen Datumstexte, die Regex passt zu `statements_reminded_on` und `statements_next_reminder_on`. Der Step wurde angepasst und bleibt gleich streng.
- Keine neuen UI-Texte, kein neuer a11y-Zustand, keine fremden Änderungen im Delta.
- Ponytail: Im Delta ist nichts zu streichen.
