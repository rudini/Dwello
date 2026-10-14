# Review: Instruktionen und Skills nach dem Lauf #121 (B-2, Filter der Abrechnungsliste)

Lauf: Session 2026-10-14, vierter und letzter Bug des Serienauftrags (auf Wunsch nach diesem Bug gestoppt). Slice 1 (Mietvertrag) und Slice 2 (Abrechnungsperiode), Commits c539568 bis 183ab75. Eine Runde `fach-reviewer`, drei Runden `code-reviewer`, je eine Runde Helga und Marco.
Geprüft: was im Lauf an `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `tests/a11y/screens.json`, den Hooks und den Skills gehakt hat. Nur Befunde, keine Umsetzung. Befunde aus `workflow-rules-review-2.md` bis `-4.md` werden nur genannt, wenn der Lauf sie bestätigt.

## Major

- **W-22 (Major) `.claude/hooks/commit-msg-gate.mjs`, `fallow-gate.sh` – ein blockierter Commit verwirft den ganzen Bash-Befehl.** Zweimal stand `git commit` am Ende eines Befehls mit Dateiänderungen davor (Python-Edits, `sed` am Plan, `git worktree remove`). Der Hook blockierte den ganzen Befehl, also liefen auch die Änderungen nicht. Einmal fiel das erst dem `code-reviewer` auf (C-11, C-18: Plan-Zeilen fehlten im Commit). `CLAUDE.md` «Gotchas» sagt «Run git commands on their own», aber nur beim Fallow-Gate und als Rat. Vorschlag: denselben Satz beim Commit-Subject-Gate wiederholen und als Regel formulieren («never chain edits and `git commit` in one Bash command: a blocked commit drops the edits too»).
- **W-23 (Major) `CLAUDE.md:65` (Schritt 6) – Prettier gegen «Surgical changes» kostet ganze Review-Runden.** Dreimal (#99 C-3, #121 C-2, C-10) war ein Major oder Minor nur ein Umbruch von Prettier auf geänderten Dateien; einmal lehnte ich einen Prettier-Nit ab, weil er den vorigen Fix rückgängig gemacht hätte (C-22). Das ist W-20 aus Review 4, jetzt mit Major-Gewicht, weil es eine Runde zum Major machte. Vorschlag wie W-20: in bestehenden Dateien nur die eigenen Zeilen formatieren (`prettier --check` und Hand), oder `lint-staged` mit `--range` statt `--write` auf ganze Dateien.
- **W-17 bestätigt (Major).** Beide Personas meldeten Vorbestehendes (Brotkrümel, Status-Kacheln ohne «Alle», Schrittnamen bei 150 %), zusammen zehn Punkte in U-25. Hier war ein Persona-Major (Zählung der Status-Kacheln) zwar vorbestehend für Gebäude und Suche, wurde aber durch den neuen Satz erst widersprüchlich; ich habe ihn in diesem PR behoben. Die Regel «existed before → open work» hätte ihn liegen lassen. Vorschlag: «existed before» gilt nicht, wenn die Änderung den Fehler sichtbarer oder widersprüchlicher macht.

## Minor

- **W-24 (Minor) `CLAUDE.md:66` (Schritt 7) – Rundengrenze und Major in der dritten Runde.** Runde 3 von `code-reviewer` meldete einen Major (C-17, Szenario fehlt), den ich behoben und rot/grün gezeigt habe. Ob dann eine vierte Runde nötig ist, sagt die Regel nicht: sie stoppt nur, wenn «after its 3rd round» ein Major offen bleibt. Ich habe ohne vierte Runde abgeschlossen. Vorschlag: «A Blocker/Major of the 3rd round that is fixed with a test shown red and green needs no 4th round; say so in the plan.»
- **W-25 (Minor) `tests/a11y/screens.json` – ein Zustand pro Bildschirm, aber zwei Varianten.** Der neue Zustand «Liste mit Satz» hat zwei Varianten (Mietvertrag, Periode). `queries` erlaubt pro Zustand nur eine Adresse, und `a11y-screens.test.ts` verlangt, dass jeder Bildschirm mit `default` beginnt. Die Periode lief so als `default` eines zweiten Bildschirms `statements-period`. Funktioniert, aber die Bedeutung von `default` («as loaded with the seeded records») passt nicht. Vorschlag: `stateMeanings` erlaubt eine Variante pro Zustand (`list-scoped:period`) oder `$comment` erklärt den Weg über einen zweiten Bildschirm.
- **W-26 (Minor) `.claude/agents/persona.md` – Personas teilen sich den Scratchpad.** Helga legte ihre Skripte in einen eigenen Unterordner, weil Marco im selben Ordner arbeitete. Ein Satz im Agent («put scripts and screenshots in `<scratchpad>/<persona>-<slice>/`») verhindert Überschreiben.
- **W-7 bestätigt (Minor) Stop-Hook.** Sieben Aufforderungen in diesem Lauf, eine davon zu einer absichtlich roten, noch nicht committeten Testdatei während des `fach-reviewer`.

## Nit

- **W-27 (Nit) `tests/e2e/CLAUDE.md` – vorhandene Schritte vor neuen.** Ich formulierte zuerst «die Abrechnungen des Mietvertrags anzeigt», obwohl «die Nebenkostenabrechnungen des Mietvertrags anzeigt» schon existierte; `bddgen` meldet nur fehlende, nicht fast gleiche Schritte. «reuse existing steps first» steht in der Tabelle; ein Hinweis auf `grep -rn "Wenn\|When(" tests/e2e/steps` beim Schreiben des Szenarios würde helfen.
- **W-28 (Nit) `CLAUDE.md` «Workflow 1» – rot zeigen, wenn die Schritte fehlen.** Das `@wip`-Szenario kann vor den Schritten nicht «for the right reason» scheitern; ich habe es nach dem Code durch Herausnehmen des Codes rot gezeigt (wie die Regel für Tests es erlaubt). Für Szenarien steht das nicht ausdrücklich da.

## Hat getragen (keine Änderung nötig)

- `fach-reviewer` vor dem Produktionscode fand einen Szenarionamen, der mehr versprach als der Filter (V-1), und den Glossarbegriff «Vertragsbeginn» statt «Mietbeginn».
- Zwei Slices mit je eigenem Review hielten die Runden klein; der Stand von Slice 2 lief im Review von Runde 2 mit.
- Der Fallow-Gate erzwang das Auslagern der Filter (`backendQuery`) und deckte einen ungetesteten Zweig auf.

## Nicht bestätigt

- Ob die Zählung über die Filter (P-1) für Sie eine Erweiterung des Issues ist: Sie machte auch Gebäude- und Suchfilter richtig, die schon vorher falsch zählten.
