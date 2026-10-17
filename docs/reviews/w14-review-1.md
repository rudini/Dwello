# Review W14, Runde 1: #80 Juli-Anteil «Heizung Bergregion» (Commit 2e3df574)

Worktree: `/tmp/claude-0/-home-user-Dwello/20114ddf-872a-586c-a859-0b820039965a/scratchpad/review-w14-code`, Diff `origin/main..2e3df574`. Gelesen habe ich: beide geänderten Dateien (`backend/src/__tests__/heating-profiles.pg.test.ts`, `implementation_plan.md`), `backend/migrations/0002_stammdaten.sql` Z. 50–98, `docs/data-model.md:468`, den Text von Issue #80 (gh api), das PDF (`pdftotext -layout`, `pdfinfo`) und `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/heating-profiles.pg.test.ts:34 | Die Jahreszahl «(2023)» stammt nur aus den PDF-Metadaten (`pdfinfo`: CreationDate 2023-09-09). Im Dokument selbst steht kein Jahr. Der Kommentar sollte das sagen (z. B. «PDF dated 2023-09-09»), sonst sieht es aus, als stünde das Jahr im Merkblatt. |
| C-2 | Nit | backend/src/__tests__/heating-profiles.pg.test.ts:33-35 | Issue und Migrationsbeschreibung (`0002_stammdaten.sql:87`) nennen als Quelle die Tabelle «Mieterwechsel: So werden die Heizkosten verteilt». Geprüft wurde aber die Mieterverband-Tabelle «Verteilungsschlüssel in Bergebieten und im Tessin», die im Issue als Kandidat genannt ist. Ein halber Satz, dass diese Tabelle die Quelle der Migrationsbeschreibung bestätigt, würde die beiden Namen verbinden. «Bergebieten» ist ein Tippfehler, steht aber genau so in der Quelle. |
| C-3 | Nit | implementation_plan.md:5 | Die hinzugefügte Leerzeile ergibt zwei Leerzeilen vor `## Session W14`. |

Keine Blocker und keine Majors.

Prüfung der Anforderung:
- Ich habe die Bergregion-Zeile mit der Quelle verglichen. `pdftotext` auf das PDF zeigt auf Seite 2/3 unter «Verteilungsschlüssel in Bergebieten und im Tessin», Zeile «Berggebiete»: `14.0 11.5 11.5 9.0 7.0 4.5 1.0 4.0 5.5 8.5 10.5 13.0`. Das stimmt überein mit `0002_stammdaten.sql:85-86`, `heating-profiles.pg.test.ts:36` und `docs/data-model.md:468`. Ein Druckfehler liegt also nicht vor, und Migration und Wertänderung sind zu Recht weggelassen. Der Juli-Wert 1.0 steht genau so in der Quelle.
- Der Testkommentar nennt die Quelle mit URL, Tabelle, Zeile und Seite. Zum Jahr siehe C-1.
- «No scenario» ist gerechtfertigt: Es ändert sich nur ein Kommentar, kein Verhalten, kein UI-Text und kein Vertrag. Neue Tests gibt es nicht, also muss auch kein Test rot gewesen sein.
- Konventionen: Der Commit-Betreff `docs(tests): name source of Bergregion shares` hält Typ und Scope ein und ist kürzer als 50 Zeichen. Der Kommentar ist englisch, die Zitate sind wörtlich. Nichts im Diff gehört nicht zur Anforderung.
- Ponytail: Lean already. Ship. (net: -1 Zeile möglich, C-3)

## Nicht bestätigt

- **Quelle in Issue #80 notieren:** Laut `implementation_plan.md` ist dieser Punkt noch offen («[ ] Note the source in issue #80»). Ich habe den Issue-Text gelesen, dort steht noch keine Quelle. Diese Zeile der Anforderung ist also noch nicht erfüllt. Der Aufrufer muss sie vor dem Pull Request erledigen.
- **Weitere Quellen:** mietrecht.ch «Verteilung_Heizkosten_Mieterwechsel.pdf» und HEV habe ich nicht geprüft, der Aufrufer meldet sie als nicht erreichbar. Ob sie vom Mieterverband abweichen, bleibt offen. Das wäre der Fall «sources disagree» aus «Stop and ask» im Issue. Eine Abweichung ist mir nicht bekannt.
- **Dass das PDF unter der URL liegt:** Ich habe die lokale Kopie gelesen, die URL nicht abgerufen.
- **Checks, nicht wiederholt, vom Aufrufer gemeldet:** `cd backend && bun test src/__tests__/heating-profiles.pg.test.ts` (5 pass), `cd backend && bun run type-check`, `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/open-work.test.ts`. Da sich nur ein Kommentar und die Plandatei ändern, habe ich keinen davon angezweifelt.
