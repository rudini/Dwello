# Code-Review #130, Runde 2 (Schlussrunde vor dem Push)

Worktree: `review-130-code2` (detached e34205ad). Delta `7e10cba8..e34205ad` (Commits dbe20edb, e34205ad), gelesen: `invoice-completeness.service.ts` (Z. 97, 113-138), `invoice-completeness.test.ts` (Z. 240-290), dazu `git show --stat` beider Commits und der Kopf von `docs/reviews/405-fachreview-1.md`. Vorbericht: `docs/reviews/130-review-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status |
|----|--------|
| C-1 | Behoben. Der doppelte Test «4 statt 3» ist entfernt; «ordnet eine Rechnung am letzten Tag …» prüft jetzt `kind: 'gap'` und `missingParts` (Z. 251). |
| C-2 | Offen (Nit), bewusst belassen; zulässig. |
| C-3 | Behoben. `coarserRhythm` (Z. 119-120): `new Set(...sliceOf...)`, `size === n && !has(-1)`. Bei n Rechnungen und n Abschnitten heisst das genau eine Rechnung pro Abschnitt; `sliceOf` (Z. 97, `findIndex`) liefert -1 ausserhalb der Periode, das wird jetzt ausdrücklich abgewiesen. Gleiches Ergebnis wie vorher, Tests decken alle Zweige (doppelter Abschnitt Z. 277-282, Teiler 4/2/6, Grenze Q1+Q3). |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | docs/reviews/405-fachreview-1.md (ganze Datei, Commit dbe20edb) | Fach-Review zu Issue #405 (it-Wort für «Ersatzmieter») im Branch von #130. Ohne Bezug zur Anforderung. |

## C-4: Fremder Inhalt im Branch

Warum falsch: CLAUDE.md verlangt, dass der Diff nur zur Anforderung gehört. `405-fachreview-1.md` behandelt Übersetzungen in `messages/it.json` (Issue #405, Befund M-1 «inquilino sostitutivo»), nicht die Teilerregel von #130/#409. Mit dem Push käme ein Bericht zu einer anderen Aufgabe in den Pull Request von #130, und sein Major M-1 sähe aus wie ein offener Befund dieses Pull Requests. Die Commit-Nachricht nennt es selbst als Beigabe («Also the domain review of the Italian word for #405»).

Nachweis: `git diff 3e728e19 e34205ad --stat -- docs/reviews/405-fachreview-1.md` zeigt die Datei als neu; ihr Inhalt nennt nur #405.

Fix: Datei aus diesem Branch nehmen (eigener Commit, der sie entfernt, oder dbe20edb ohne sie neu schreiben, solange nichts gepusht ist) und auf dem Branch von #405 committen bzw. dem Issue #405 als Kommentar anhängen. Kein Code betroffen.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/invoice-completeness.test.ts`: im Worktree **neu ausgeführt**, 34 pass, 0 fail (35 in Runde 1, minus der entfernte Doppeltest).
- Lint, `bun run check`, Backend-Type-Check, `bun test src/__tests__/invoice-completeness` mit pg (44 pass), `bunx vitest run` (3110 passed): vom Aufrufer gemeldet.
- Persona-Bericht `docs/design/personas/weber-130.md` (gegen 7e10cba8): vom Aufrufer gemeldet, nicht gelesen (per Auftrag ausgeschlossen). Das Delta ändert nur Backend-Logik ohne Verhaltensänderung und einen Test, also kein Einfluss auf die Vorschau.
- `origin/main` ohne neue Commits: vom Aufrufer gemeldet.
- Rot-Läufe: keine neuen Tests im Delta; der umgebaute Test hält beibehaltenes Verhalten fest (Runde 1, Basis zeigt `gap`).
