# Review #1272, Runde 2 (Schlussrunde vor dem Push; Delta 2c408d42..f85d4a30)

Geschlossen: C-1 (umgesetzt nach Entscheid PO vom 09.11.2026), C-2

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-3 | Minor | tools/fitness/fitness.ts:319-323, :569 | `loosenedNewFiles` prüft nur «nicht auf der Merge-Base», aber nicht «auf HEAD vorhanden». Ein Eintrag für eine Datei, die es weder auf der Basis noch im PR gibt (Tippfehler oder vorgemerkte künftige Datei), bleibt grün. Ein späterer PR legt die Datei an, der Eintrag steht dann schon auf der Basis, und `structure-new-file` schweigt ohne neuen Gate-Change. Der Entscheid sagt «only for a file the pull request adds». Gate-Approval braucht dieser Fall trotzdem (#1269), darum nur Minor. Fix: zusätzlich `existsSync(join(ROOT, e.path))` oder `git cat-file -e HEAD:<path>` verlangen, dazu eine Testzeile |

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/fitness/fitness.test.ts` (50 bestanden; der neue Test rot vor dem Code und mit ausgeschaltetem Guard für die entfernte Liste), `eslint tools/fitness`, `bun run fitness -- --base origin/main` (0 Fehler), `bun tools/fitness/fitness.ts --base origin/main --structure` (0 Fehler, auf 5a81cbef, nicht auf f85d4a30), fallow audit sauber.
- C-2-Fix (fitness.ts:523-543): Meldung bei leerer fallow-Ausgabe und Aufräumen im `finally` nur gelesen. Es gibt keinen Unit-Test, weil `structureAt` `measure.sh` startet und keine Naht hat (wie in Runde 1). Fehlt `fallow-health.json` ganz statt leer zu sein, kommt weiter ENOENT von `readFileSync`. measure.sh legt die Datei laut Runde 1 immer an, das habe ich nicht erneut geprüft.
- Den Closure `git cat-file -e ${base}:${path}` (fitness.ts:569) deckt kein Test ab, die Tests übergeben `onBase` selbst. Gelesen: `base` ist die Merge-Base (fitness.ts:558), nicht der Ref.
- Den Merge 3ac7778e..2c408d42 habe ich nicht im Einzelnen geprüft, nur nach Angabe des Aufrufers konfliktfrei.

Geprüft: `unlisted` zählt nur Einträge, die die Basis nicht hat. Ein von der Basis übernommener Eintrag bleibt also grün. Der Test zeigt den neuen Eintrag grün und den alten rot, entfernte Liste rot. `newFiles` ist aus `exceptionSizes` heraus, die Doku in fitness-functions.md (Tabelle, Ausnahmeliste, Nachweis) passt zum Code, der Fix-Text in :233 nennt die Bedingung. Die Commit-Subjects haben je ≤ 50 Zeichen, Scope `ci`. Ponytail: nichts zu kürzen.
