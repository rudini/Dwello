# Review #815 Teil A, Runde 1 (d75331fc..be5b3176)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/fitness/ratchet.json:257 | `{#if status === 'overdue' && owes && !waiting}` (StatusActions.svelte:30) steht in `display` mit «branches on the status value alone», prüft aber einen Betrag (`owes`) und eine Frist (`waiting`) |
| C-2 | Minor | tools/fitness/ratchet.json:222, :227 | Correction.svelte:34 und :41 als Statusanzeige eingestuft, verzweigen aber nach `carried`, also nach dem Saldo (≠ 0, unter CHF 5) |
| C-3 | Minor | tools/fitness/fitness.ts:317-318 | `FRONTEND_FILE` lässt Frontend-`.ts` unter `src/routes` (heute `config/help.ts`, `statements/generate/preview.ts`; künftig `+page.ts`, `+layout.ts`) und `src/hooks.client.ts`/`hooks.ts` aus. Eine neue Ableitung dort bleibt ungeprüft |
| C-4 | Minor | docs/architecture/fitness-functions.md:52 | Im Beleg `frontend-decision` steht «lokal auf d75331fc». Auf d75331fc gibt es den Check noch nicht; gelaufen ist der Beleg auf dem Stand mit dem Check (834a80d4/be5b3176) |

## C-1 (Major): Die Mahnungs-Verzweigung ist als Anzeige eingestuft

Der Entscheid des PO vom 25.10.2026 (zweiter Block in #815) zählt eine Verzweigung nur dann als Anzeige, wenn sie allein nach dem Statuswert verzweigt, «with no date or amount». Eine Verzweigung, die zusätzlich einen Betrag oder eine Frist prüft, soll zum Backend-Feld werden; als Beispiel nennt der Entscheid «a deadline before today».

Diese Zeile in `src/routes/statements/[id]/StatusActions.svelte:30` erfüllt die Bedingung nicht:
- `owes` kommt aus `claimed(statement)` (`src/routes/statements/[id]/+page.svelte:162`). Das ist die Betragsregel `balance > 0 && !unpaid(...)` mit dem Mindestbetrag von CHF 5 (`src/lib/statement.ts:57`).
- `waiting` kommt aus `nextReminderLater(statement)` (`+page.svelte:163`). Das ist `nextReminderFrom > localToday()`, also die Frist der letzten Mahnung (`src/lib/statement.ts:80-81`).

Die Zeile entscheidet damit, ob eine Mahnung möglich ist. Diese Regel hat das Backend schon: `reminderDue: effectiveStatus === 'overdue' ? !reminderWaits(...)` (`backend/src/services/statement.service.ts:252`), und die Übersicht nutzt sie.

Folgen:
- Der Eintrag steht in `display`. Diese Liste darf wachsen und wird nie abgebaut. Die Regel fällt so aus dem Ziel 0 heraus.
- «Done» von #815 (Ausnahmeliste leer) wäre erreicht, obwohl die Mahnungsregel im Frontend bleibt.
- Das Einzige, was den Fehler zeigt, ist der Text des Eintrags: Er sagt «status value alone».

Beleg: der Zeilentext selbst und die beiden Props an `+page.svelte:162-163`. Korrektur: den Eintrag nach `exceptions.frontendDecisions` verschieben, dann 43 Anzeige und 39 Ausnahmen in 20 Dateien. Die Zahlen in `utility-tree.md` (Ä4 «Heute», Prioritätsbegründung), `fitness-functions.md` (§1, §3, §6) und im Commit/PR-Text entsprechend anpassen.

## Nicht bestätigt

- `bun run fitness` grün, lint, check, Prettier auf `ratchet.json`, fallow-Gate: vom Aufrufer gemeldet. Den Lauf habe ich nicht wiederholt, weil er Dateien schreibt. Die Messung habe ich mit `decides` nachgezählt, über dieselbe Dateiauswahl: 82 Zeilen in 35 Dateien, keine doppelten Zeilen pro Datei, 38 Ausnahmen in 19 Dateien, 44 Anzeige. Das stimmt mit `ratchet.json` und den Docs überein.
- Die Belege `frontend-decision`, `pre-check`, `ratchet` (Frontend) und `frontend-allowed` aus §3: vom Aufrufer gemeldet bzw. nicht ausgeführt. Die Logik von `frontendFindings`, `loosened`, `tighten` und `addedAllowed` habe ich gelesen und die Unit-Tests dazu geprüft.
- `bunx vitest run tools/fitness/fitness.test.ts`: von mir wiederholt, 26/26 grün. Das Rot der 5 neuen Tests vor dem Code: vom Aufrufer gemeldet. Nach Lesen fällt «accepts a listed display check…» auf der Basis nicht rot aus, weil `judge` dort `frontendDecisions` ignoriert. Rot wird er erst, wenn man die Allowlist-Vereinigung aus dem neuen Code herausnimmt.

Geprüft: Logik von `frontendFindings`, `loosened`, `tighten` und `addedAllowed`; die übrigen 41 `display`-Einträge (reine Statusverzweigungen bzw. Formatprüfungen); AP2 und Ä4 decken jetzt BFF und Frontend ab, Ä4 ist H/H (beide Docs); Zahlen in den Docs; ponytail-review ohne Befund.
