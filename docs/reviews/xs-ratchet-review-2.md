# Review xs-ratchet, Runde 2 (Delta 4a4b18af1..0696d58cd)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-2

## Nicht bestätigt

- Diese Prüfungen meldet der Aufrufer, ich habe sie nicht selbst ausgeführt: `bunx vitest run tools/fitness tools/arch-baseline src/__tests__/open-work.test.ts` (88 grün, beide neuen Tests vorher rot gesehen), `bun run lint`, `bun run check`, `bun run fitness`, `bunx fallow audit --base origin/main`, Prettier-Diff und die Commit-Hooks.
- Den Rotlauf des Tests zu `loosened` habe ich nur durch Lesen geprüft: Auf 4a4b18af1 setzt `loosenedFat` für das fehlende `working.fat` ein leeres Default ein und liefert `[]`, also wäre der Test rot.

Geprüft: C-1 ist geschlossen. `loosenedFat` (fitness.ts:248-251) meldet ein gelöschtes `fat` als `ratchet`-Fehler. CI ruft `fitness.ts` bei Pull Requests und Pushes mit `--base` auf (ci.yml:386-389), also fängt `loosened` die Löschung, auch wenn `judge` ohne `r.fat` nichts meldet. Fehlt `fat` schon auf der Basis, gilt das weiterhin nicht als Lockerung.

C-2 ist geschlossen. Der Test zu `fatItems` würde rot, wenn der Filter «Modul ohne Code» fehlte (db:migrations hat 42 > 30 Dateien) oder wenn die Zuordnung `loc` → `lines` nicht stimmte. `source` liest nur `.ts`-Dateien (structure.ts:88), darum braucht der Test keine echten Dateien. Dass er bestehendes Verhalten festhält, steht in der Commit-Message.

Testtitel, Commit-Message und Planzeile geben den Code richtig wieder. Im Delta ist nichts ohne Bezug zur Anforderung und kein ungenutzter Code.
