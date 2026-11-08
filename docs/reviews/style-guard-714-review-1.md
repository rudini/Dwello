# Review style-guard-714, Runde 1 (75b78a9..dc853ee)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Regel `src/__tests__/design-guard.test.ts:25-32` gegen #714 «Decided (product owner)»: Eigenschaften `color`, `background(-color)`, `border(-side)(-color)`, `outline(-color)` inkl. Kurzschreibweisen erfasst; `border-width`/`-radius`/`-collapse`/`outline-offset` bleiben unberührt; alle 19 Systemfarben aus CSS Color 4, `currentColor`, `transparent`, `inherit|initial|unset|revert|revert-layer` (Backtracking auf `revert-layer` greift), Rahmenstil- und -breitenwörter, Längen (Einheit nach Ziffer scheitert am Lookbehind) und `var(--x)` (Inhalt nach `--` scheitert am Lookbehind; `var(--x, red)` wird gemeldet) zugelassen; Hex bleibt Sache der Regel «Farbwert». Rot-Lauf durch Lesen plausibel: die drei neuen «meldet»-Fälle passen auf die alte Regel nicht, `ButtonText`/`ButtonFace` scheitern an der alten Liste, `GrayText`/`solid`/`medium`/`dotted` an der alten Liste in der neuen Regel, `var(--ink)` ohne `var\(`-Ausnahme. Doku-Satz `docs/design/token-referenz.md:3` stimmt mit der Regel überein. Kein Bezug zu UI-Texten, Szenarien, Kontrakten; `No scenario` begründet (nur Quell-Wächter). Ponytail: keine ungenutzten Teile, kein kopierter Helfer. Keine fremden Änderungen im Diff.

## Nicht bestätigt

- `bunx vitest run src/__tests__/design-guard.test.ts` 497 bestanden: vom Aufrufer gemeldet.
- Rot-Läufe der neuen «meldet»-Fälle, der «lässt … zu»-Fälle mit alter Wortliste und des `var(--x)`-Falls ohne `var\(`-Ausnahme: vom Aufrufer gemeldet (nur durch Lesen plausibel gemacht).
- eslint, prettier und testcheck-Audit auf der Testdatei sauber: vom Aufrufer gemeldet.
- Kein Quelltext in `src` hat ein `<style>`-Element (geprüft mit `grep -rln "<style" src`: nur die zwei Testdateien), die Regel läuft also gegen keine echte Seite; ihre Wirkung zeigen nur die Musterfälle.
