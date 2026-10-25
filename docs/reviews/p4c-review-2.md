# Review p4c, Runde 2 (Schlussrunde, Delta 8d33d512..1220ebc0)

## Status der offenen IDs

| ID | Schwere | Datei:Zeile | Status |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/statement.service.ts:91 | Behoben: Der Kommentar lautet jetzt «an overdue one: whether a Mahnung is to propose now; null for any other». Das deckt Entwürfe, bezahlte und erledigte Abrechnungen ab und stimmt mit `docs/api-specification.md` überein. |
| C-2 | Minor | src/__tests__/buildings-i18n.test.ts:143 | Behoben: `reminderAfterDays: 14` ist entfernt, und die Testdatei verwendet es nirgends mehr. |

## Neue Befunde

Keine.

Geprüft: Das Delta ändert nur eine Kommentarzeile und entfernt eine Zeile Testeingabe. Es ändert kein Verhalten und braucht deshalb weder einen Red-Test noch ein Szenario. Der Commit-Betreff hält Conventional Commits ein (≤ 50 Zeichen).

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-Type-Check und `bunx vitest run src/__tests__/buildings-i18n.test.ts` (12 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt.
