# Code-Review #545, Runde 3 (Abschlussrunde, Delta d260c2e..1c9e36a, ohne docs/reviews und docs/archive)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | backend/src/__tests__/reminders.pg.test.ts:140 | Bleibt offen. Der Test hält bestehendes Verhalten fest, aber keine Commit-Nachricht sagt das, auch 1c9e36a nicht. Laut Aufrufer holt es der PR-Text nach. Den gibt es noch nicht, deshalb ist das unbestätigt. |
| C-5 | Minor | src/routes/statements/StatementRow.svelte:67 | Bleibt offen und unverändert. Für die Bedingung `status === 'overdue'` in der Liste gibt es keinen Test, der bezahlte und ersetzte Abrechnungen abdeckt. |

Geschlossen: C-6. Das Szenario «Ein Mahnbrief zählt erst ab dem Versand» (`tests/e2e/features/statement-reminder.feature:140`) prüft jetzt, dass beim wartenden Brief keine Zahlungsfrist steht. Der Step `tests/e2e/steps/documents.steps.ts:131-133` ruft nur die Question `documentFor` auf und prüft `not.toContain('Zahlungsfrist')`.
- Positiver Anker: `Text.of` nutzt `single`, die Zeile des Briefs muss also da sein. Dazu kommt der Schritt «… noch zu versenden ist» davor (`tests/e2e/CLAUDE.md`, «Negative checks»).
- Prüfwort: «Zahlungsfrist» ist das kürzeste Wort, das in jeder falschen Variante vorkommt (`documents_payment_deadline`).
- Rotlauf: Mit der Bedingung der Basis in `DocumentItem.svelte:47` enthält der Zeilentext «Zahlungsfrist der Mahnung: …», der Schritt schlägt dann fehl. Das folgt aus dem Code und passt zur Ausgabe, die der Aufrufer meldet.
- Spec-Freigabe: Das Szenario ist in diesem PR neu und steht nicht auf `main`, der zusätzliche Schritt ist frei.

## Nicht bestätigt

- Diese Checks hat nur der Aufrufer gemeldet, ausgeführt habe ich keinen:
  - auf 1c9e36a:
    - eslint auf `tests/e2e/steps/documents.steps.ts`
    - `bunx vitest run --changed origin/main` (695 pass)
    - E2E Chromium des Szenarios «Ein Mahnbrief zählt erst ab dem Versand» (pass)
    - Rotlauf mit der Bedingung der Basis
  - auf 7957d78:
    - Backend type-check
    - lint
    - check
    - Backend-pg-Tests zu Mahnungen, Dokumenten und Status (546 pass)
    - Prettier auf den hinzugefügten Dateien
- C-3: Der PR-Text, der den E-Mail-pg-Test als Pin nennen soll, liegt noch nicht vor.
- Merge d260c2e: Laut Aufrufer ein sauberer Merge von origin/main. Ich habe ihn nicht auf Konflikte in App-Code geprüft, er gehört nicht zum Delta.

Geprüft: Das Delta umfasst nur das Feature und die Step-Datei. Es hat keine neuen UI-Texte, keinen neuen a11y-Zustand und nichts, das nicht zur Anforderung gehört. Die Screenplay-Schichten sind eingehalten. Ponytail findet nichts zu streichen.
