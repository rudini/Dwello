# Review #1000, Runde 1 (90e0e7b..449b572)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/reminder-letter.test.ts:58-62 | Der Test «2. Mahnung ohne Teilzahlung weiter ‹noch nicht bezahlt›» pinnt Verhalten, das 90e0e7b schon zeigt, und kann dort nicht rot werden. Die Commit-Nachricht sagt nur «letters without a part stay», nennt den Test aber nicht als Pin von bestehendem Verhalten (CLAUDE.md, Workflow 2). Nachholen im PR-Text oder in der Nachricht des nächsten Commits. |

Keine Blocker, keine Major.

Geprüft: Die vier Sprachen von `partOpenings[0]` und `partOpenings[1]` (reminder-letter.ts:42-46, 70-74, 98-102, 126-130) stimmen Wort für Wort mit den Zeilen `openings[1]`/`openings[2]` «mit Teilzahlung» in docs/reviews/959-fachreview-1.md:113-114 überein, auch die typografischen Apostrophe. Die Bedingung `input.paid && input.level > 1` (reminder-letter.ts:162) lässt Stufe 1 und Briefe ohne Teilzahlung unverändert; der einzige Aufrufer (reminder.service.ts:102) übergibt `Number(paidAmount ?? 0)`, also 0 ohne Teilzahlung. Die 8 neuen Fälle prüfen den ganzen ersten Absatz mit `toBe` und schlagen auf der Basis fehl (dort steht «noch nicht bezahlt» / «réglé» / «pagato» / «paid»). Fiele `level > 1` weg, liefen die bestehenden #959-Fälle (Stufe 1 mit Teilzahlung) in `partOpenings[-1]` und schlügen fehl. Keine UI-Texte, keine messages/*.json, keine API-Antwort und keine E2E-Dateien betroffen; nichts Fremdes im Diff.

## Nicht bestätigt

- `bun test src/__tests__/reminder-letter.test.ts` (33 pass, 8 neue vorher rot), `bun run type-check`, `bun run lint` und Prettier auf beiden Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- `No scenario: <reason>` für #1000: Das gehört in den Pull-Request-Text, den es noch nicht gibt. Die Commit-Nachricht von 449b572 enthält es nicht; der Text von Issue #1000 selbst wurde nicht gelesen, nur die Anforderung des Aufrufers.
