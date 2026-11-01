# Review xs-ratchet, Runde 1 (4a4b18af1, Basis 7d41353f0)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | tools/fitness/fitness.ts:129, :248 | Wenn man `fat` aus `ratchet.json` löscht, sind beide Prüfungen still abgeschaltet: `judge` liefert ohne `r.fat` nichts, und `loosenedFat` setzt für `working.fat` ein leeres Default ein und meldet nichts. Es fehlt auch ein Test dafür. |
| C-2 | Minor | tools/fitness/fitness.ts:391-406 | `fatItems` hat keinen Test. Das betrifft die Messung selbst: die Schwellenfilter, die Zuordnung `loc` → `lines` und die Regel «Modul ohne Code ist nie fett» (db:migrations). Die Tests geben `Measured.fat` von Hand vor. Wer den Filter `a.files.some(...)` entfernt oder `>` gegen `>=` tauscht, bekommt keinen roten Test. |

## C-1 (Major): Wird `fat` gelöscht, sind Prüfung und Ratchet abgeschaltet

`fatFindings` (fitness.ts:129) gibt `[]` zurück, sobald `r.fat` fehlt. `loosenedFat(w = { files: {}, modules: {}, roots: [] }, b)` (fitness.ts:248) ersetzt ein fehlendes `working.fat` durch ein leeres Objekt. Leere Listen ergeben dabei keine Lockerung. Löscht ein PR also nur den Schlüssel `"fat"` aus `ratchet.json`, bleibt `bun run fitness -- --base origin/main` grün. Danach darf jede Datei und jedes Modul beliebig wachsen. Genau dieses Schlupfloch schliesst die bestehende Regel für Ausnahmelisten: «exceptions.k was removed; keep it, empty, …» (fitness.ts:241). Das Dokument verspricht für `fat` ebenfalls «wird nur kürzer» und «wachsen nicht».

So zeigt man, dass es fehlschlägt (im Stil des neuen describe-Blocks):
`loosened({ ...ratchet, fat: undefined }, r)` ergibt `[]`. Erwartet ist eine `ratchet`-Meldung «fat was removed».
`judge(measured([{ path: 'x.ts', lines: 900 }], []), { ...ratchet, fat: undefined })` ergibt ebenfalls `[]`.

Lösung: In `loosened` eine Lockerung melden, wenn die Basis `fat` hat und der Arbeitsstand nicht. Der Default-Parameter von `loosenedFat` fällt dann weg. Fehlen Teilschlüssel (`fat.roots`, `fat.files`), stürzt der Lauf mit einem TypeError ab. Er wird also rot, aber ohne Fix-Hinweis. Das ist annehmbar.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run tools/fitness tools/arch-baseline src/__tests__/open-work.test.ts` (86 grün; die vier neuen fat-Tests vor dem Code rot gesehen), `bun run lint`, `bun run check`, `bun run fitness` (grün; mit pdf.service.ts auf 1400 rot mit fat-file), `bun run fitness -- --base origin/main`, Prettier-Diff, `bunx fallow audit --base origin/main`, Commit-Hooks.
- Die sechs Modulwerte in `ratchet.json` (Dateien und Ce) konnte ich nicht nachmessen: Dafür müssten 01-map und 02-imports laufen, und beide schreiben Dateien. Die neun Dateiwerte habe ich mit `grep -c '[^[:space:]]'` nachgezählt (gleiche Zählung wie 01-map: nicht leere Zeilen). Sie stimmen, und es gibt keine weitere Produktivdatei über 400 Zeilen.
- Ob die fat-Meldung im CI-Log als `::error` mit der richtigen Zeile erscheint, habe ich nicht gesehen. Gelesen habe ich nur `say()` und den Job «Architecture fitness» in `.github/workflows/ci.yml:374-390`.

Geprüft: Die Messung stimmt mit dem Strukturbericht überein. Beide nutzen dieselben Skripte 01-map und 02-imports und dieselbe Funktion `analyze`/`LIMITS`. 02-imports löst `$lib` selbst auf (`basePath`), braucht also kein `svelte-kit sync`. `structure.ts` führt Code nur unter `import.meta.main` aus und importiert keine Pakete, darum genügt im CI-Job das fehlende `bun install`. Migrationen und `static/` sind ohne Code nie fett; be:app ist als Root ausgenommen.

Eine neue Backend-Route geht durch. Eine neue Datei in fe:ui, fe:routes/statements, fe:routes/config oder fe:routes/contracts ist rot, ebenso ein weiterer Import in be:services/statement oder be:services/reminder. Das ist so gewollt; die Meldung nennt mit layers.json einen gangbaren Weg. Ein Umbenennen ist rot, wie gefordert. Fehlt `fat` auf der Basis, ist das keine Lockerung. Ein gestrichener Eintrag wird über `judge` wieder rot, solange die Datei noch fett ist. `tighten` arbeitet korrekt.

Die Testtitel passen zu ihren Prüfungen. Der erste Test hält bestehendes Verhalten fest; das steht in der Commit-Message, und die Basis zeigt dieses Verhalten. Dokument und Plan geben den Code richtig wieder. Nichts im Diff gehört nicht zur Anforderung. Ponytail: kein toter Code, keine Kopie eines bestehenden Helfers.
