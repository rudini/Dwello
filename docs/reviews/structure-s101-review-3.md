# Review structure-s101, Runde 3 (Abschlussrunde)

Bereich: `git diff 810e6ec48 8f9b822ab` (Commit 8f9b822ab `fix(build): show n/a without coverage gap data`), Dateien `tools/arch-baseline/structure.ts`, `tools/arch-baseline/structure.test.ts`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Keine Blocker/Major.

Geprüft: `untested` ist `null` genau dann, wenn `input.gaps` fehlt (`structure.ts:159`); die Modultabelle zeigt dann «n/a» statt eines Badges (`structure.ts:379`). Andere Stellen, die ein `null` brechen könnte: `lights.tests` wird mit `untested ?? 0` grün (`structure.ts:165`) und geht nur so in `worst()` und damit in `m.light` ein (`structure.ts:169`). Grün ist neutral und macht nichts schlechter. `snapshot`/`markdown`/History zählen nur `m.light` und lesen `untested` nicht (`structure.ts:255-275`). Der Kennwert «reach» war schon vorher an `input.gaps` gebunden (`structure.ts:187`). Die Datei-Badges im Drill-down verwenden `f.untested` (boolean, `structure.ts:190,348`). Ausserhalb von `structure.ts` nutzt sonst niemand `untested`/`lights` (grep in `tools/arch-baseline`). Der Tabellenkopf im Drill-down lautet jetzt «Code file (.ts, .svelte)» (`structure.ts:357`). Tests: Der neue Test (`structure.test.ts:308-313`) prüft, dass `untested` bei allen Modulen `null` ist, und dass die 7. Zelle der Zeile `be:routes/a` (`split('<td>')[7]`, die Spalte «Tests») genau `n/a` enthält. Auf der Basis wäre der Wert 0 und die Zelle ein Badge, der Test wäre dort also rot. Die neue Erwartung zum Tabellenkopf (`structure.test.ts:361`) wäre mit dem alten `<th>File</th>` ebenfalls rot. Beide Titel bzw. Erwartungen sagen, was sie prüfen. Das Delta enthält nichts, was nicht zur Anforderung gehört.

Geschlossen: keine neuen in diesem Delta. Die offenen Minors aus den Runden 1 und 2 (u. a. C-4: kein DOM-Test für das Inline-Hash-Skript) bleiben in ihren Berichten und werden hier nicht wiederholt.

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (46 bestanden; beide neuen Erwartungen vor der Codeänderung rot gesehen): vom Aufrufer gemeldet.
- `bun run lint`, `bun run check`, Commit-Hooks (fallow, deepcheck, testcheck, Commit-Betreff): vom Aufrufer gemeldet.
- Dass 810e6ec48 ein sauberer Merge von `main` ist und CI grün war: vom Aufrufer gemeldet, nicht nachgeprüft.
