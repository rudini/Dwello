# Code-Review #1301 «Fläche und Zimmeranzahl ab einem Tag», Runde 3 (Abschlussrunde, Delta)

Gegenstand: `git diff 9441ed4 114c736` ohne Reports, Plan, Archiv und Personas (`apartment-size-from-day.pg.test.ts`, `apartment-size-from-day.feature`). Worktree `review-1301-code3`, HEAD 114c736. Vorbericht: `docs/reviews/1301-review-2.md`.

Geschlossen: C-3, C-6

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | `backend/src/services/apartment.service.ts:268-270` | Unverändert offen (Runde 1). V-8 wird nur geprüft, wenn mit `sizeFrom` gespeichert wird. Ein «Aufgehoben ab» am Tag einer erfassten Änderung oder davor wird nicht abgelehnt. Kein Test. |
| C-5 | Minor | `tests/contracts/statement.json:83` | Unverändert offen (Runde 1). Das Feld `changed` im Vertrag wird nie gegen die echte API geprüft. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `apartment-size-from-day.pg.test.ts` auf 114c736 (14 bestanden). Ebenso das E2E-Szenario «Die neue Fläche ab einem Tag erfassen» auf chromium (bestanden). Ebenso, dass der 404-Test rot war, als der 404-Zweig herausgenommen wurde.
- Rot nach Lesen beurteilt. Ohne `if (!apartment) set.status = 404` (`backend/src/routes/apartments.ts:165`) antwortet die Route mit 200 und `{ error }`. `removeSizeChange` gibt für eine unbekannte ID `null` zurück und wirft keinen Fehler (`apartment.service.ts:300-303`). Der Test scheitert ohne den Zweig also an `toBe(404)`. Das Szenario mit 7.5 Zimmern braucht nach Workflow 2 keinen eigenen roten Lauf, weil der Unit-Test darunter rot gesehen wurde. Nach Lesen würde es auf a93e158^ an `Select.option('7.5')` scheitern (`tests/e2e/tasks/apartment-form.ts:50`).

Geprüft: Die Feature-Datei ist neu in diesem Pull Request, die Änderung braucht also keine Freigabe. Die Spalte `decimal(3,1)` und die Route (`rooms: t.String()`) nehmen 7.5 an. Zu C-3: Eine Wohnung ohne Änderung bekommt 200 mit unveränderten Werten und nicht 404, wie ich in Runde 2 geschrieben hatte. Der neue Test deckt mit der unbekannten Wohnung den einzigen 404-Fall ab.
