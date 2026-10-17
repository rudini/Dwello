# Review W8c (#65), Runde 2: `git diff de92910 9719b46`

Geprüft im Worktree `review-w8c-code2` (detached auf 9719b46). Gelesen habe ich alle sechs geänderten Dateien im Delta: `invoice-completeness.service.ts`, `statement-wizard.ts`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md`, `docs/reviews/w8c-review-1.md` und `docs/reviews/workflow-notes-issue-65.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Nit | implementation_plan.md:3 | Nach dem Archivieren fehlt am Dateiende der Zeilenumbruch (`\ No newline at end of file`). Frühere Archiv-Commits wie 77832b1 und 8290b6e haben ihn behalten. Die Datei ist dadurch nur unnötig im Diff. |
| C-5 | Nit | docs/archive/implementation-plan-verlauf.md:934 | Der Punkt «workflow-review, session archived, pull request (`Refs #65`)» ist schon abgehakt, obwohl der Pull Request noch nicht existiert. Das ist beim Archivieren vor dem letzten Commit so üblich, die Angabe stimmt aber noch nicht. |

Keine Blocker oder Majors.

## Bestätigt

- **C-1 behoben**: `invoice-completeness.service.ts:50` sagt jetzt «within 92 days of its start». Das passt zu `firstInvoiceDate <= addDays(before.start, 92)`.
- **C-2 behoben**: `statement-wizard.ts:196` sagt jetzt «more than 15 % … more than 30 %». Das passt zu den strikten Vergleichen `change > AKONTO_ABOVE` und `change < -AKONTO_BELOW` und zum Wortlaut von #65.
- **C-3 behoben**: Die Zeile «Files» in der archivierten Session (`implementation-plan-verlauf.md:931`) nennt jetzt `implementation_plan.md`, das Archiv und beide Review-Dateien.
- **Marker #65**: `grep -rn "#65" src backend tests` findet als `TODO(fachlich prüfen, #65)` nur noch `statement-wizard.ts:236` (`GAP_DAYS`) und `PreviewChecks.svelte:121`. Beide gehören zum blockierten Lückenpunkt. Alle anderen Treffer sind Kommentare, die #65 nennen.
- **Plan und Archiv**: Die Session steht unverändert und vollständig im Archiv. Der Lückenpunkt bleibt bewusst offen und begründet. `implementation_plan.md` enthält nur noch den Kopftext, `open-work.test.ts` ist grün.
- **Workflow-Notizen**: `workflow-notes-issue-65.md` hat dieselbe Tabellenform wie die anderen 23 `workflow-notes-*`-Dateien. Beide Notizen betreffen die Aufgabe, und die vorgeschlagene Änderung fasst der Agent nicht selbst an.
- Das Delta ändert nur Kommentare und Dokumentation. Es gibt keine Verhaltensänderung, keine neuen UI-Texte, keine Änderung an E2E oder a11y und nichts, was nicht zur Anforderung gehört. Ponytail-review findet nichts, was sich streichen liesse.

## Nicht bestätigt

- `src/__tests__/open-work.test.ts`: von mir auf 9719b46 erneut ausgeführt, grün (5 Tests).
- `bun run lint` (9719b46) sowie `bun run check`, backend `bun run type-check` und die Tests statement-wizard, design-guard und invoice-completeness (de92910): vom Aufrufer gemeldet. Seit de92910 haben sich im Code nur zwei Kommentarzeilen geändert.
- `tools/open-work/check-issues.mjs` (Marker, Labels, `Refs #65`): nicht gelaufen, das übernimmt CI. Ob die Rückfrage A/B/C in #65 steht und ob das Label `entscheiden` gesetzt ist, habe ich in dieser Runde nicht erneut geprüft.
