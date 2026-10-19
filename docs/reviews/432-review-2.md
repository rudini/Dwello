# Code-Review #432, Runde 2 (Re-Review)

Gegenstand: `git diff fe21d45a 4cbed469` im Worktree `review-432-code2` (detached auf 4cbed469), Commit `fix(contracts): Akonto warning only if all ticked`. Vorheriger Bericht: `docs/reviews/432-review-1.md`.
Gelesen: alle 9 geänderten Dateien, dazu `src/routes/contracts/AgreedCategories.svelte`, `src/routes/contracts/new/RentStep.svelte`, `backend/src/services/agreed-category.service.ts` (welche Ids das Bearbeiten lädt), `tests/e2e/screenplay/{actor,questions,interactions}.ts`, `tests/e2e/targets/contract-form.ts`, `tests/e2e/CLAUDE.md` («Rules»), `docs/design/personas/helga-432.md`, Issue #432 (GitHub API, Text und Kommentare).

## Status der offenen IDs aus Runde 1

| ID | Status |
|----|--------|
| C-1 | erledigt (9f2ff5e5; Zeile `advancePayment: '0'` steht weiter in `contract-wizard.test.ts:132`) |
| C-2 | offen (Nit), unverändert; das Delta fügt einen weiteren Schritt daneben an, macht es aber nicht schlechter |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | Issue #432, «Decided (product owner)» | Die Entscheidung vom 2026-10-19 zu Helga P-1 (mit Akonto nur, solange alle Kästchen angekreuzt sind) steht nicht im Issue. Dort steht noch der Stand vom 2026-10-18: «whenever a Nebenkostenpauschale is entered and at least one Nebenkosten box is ticked, with or without an Akonto». Der Pull Request schliesst damit ein Issue, dessen Entscheidungstext dem Code widerspricht. Die Entscheidung vor dem PR im Issue nachtragen (CLAUDE.md, «Open work»). |
| C-4 | Nit | src/lib/contract-wizard.ts:95 | `const all = !values.agreedCategoryIds \|\| !categories \|\| ticked >= categories.length;` lässt sich auf `ticked >= (categories?.length ?? 0)` kürzen: ohne Auswahl ist `ticked` schon `categories.length`, ohne `categories` ist die Bedingung immer wahr. Gleiches Verhalten, eine Zeile kürzer (ponytail-review). |

Keine Blocker, keine Major.

## Bestätigt

- **Regel:** `flatRateNotice` (`src/lib/contract-wizard.ts:90-97`): ohne Pauschale > 0 oder ohne Häkchen `null`; ohne Akonto > 0 unverändert der Text von #429; mit Akonto der Text `_advance` nur, wenn keine Auswahl getroffen ist (neuer Vertrag, alle angekreuzt) oder alle Kategorien angekreuzt sind, sonst `null`. Entspricht der Entscheidung, wie der Aufrufer sie wiedergibt (siehe C-3 und «Nicht bestätigt»).
- **Zählen statt Vergleichen der Ids hält:** Beim Bearbeiten liefert `agreedCategoryIds()` nur vereinbarte Kategorien, die noch umlagefähig sind (`agreed-category.service.ts:21-33`), und `AgreedCategories.choose` arbeitet auf der angezeigten Liste; eine veraltete Id, die die Zählung verfälschen würde, kommt so nicht ins Formular.
- **Unit-Test** (`contract-wizard.test.ts:127-131`): zwei Kategorien, beide angekreuzt: Warnung; eine angekreuzt: `null` (auf der Basis kam hier der Text `_advance`, also rot); ohne Akonto mit einer angekreuzt: weiter die Warnung (#429 unverändert). Selbst ausgeführt: 26/26 grün.
- **Szenario** `contract-new.feature:212-220`, ohne `@wip`: positiver Anker (Warnung sichtbar), dann ein Kästchen abwählen, dann keine Warnung. Auf der Basis bliebe die Warnung (Stammdaten-Migration `0002_stammdaten.sql` legt mehrere umlagefähige Kategorien an, nach dem Abwählen bleiben also Häkchen), also rot. Die Negativprüfung hat den Anker im vorigen `Dann` und läuft über `expect.poll`. Formulierung fachlich («abwählt»), keine UI-Wörter.
- **Screenplay:** Die Schritte rufen nur den Task `untickOneCategory` und die Frage `flatRateWarningShown` auf; ja/nein-Frage für einen echten Zustand (angezeigt). `tickAllCategories` ist ein Task in `tasks/contract-form.ts`, der Zustand `flat-rate-warning-advance` in `tasks/accessibility.ts:292-299` kreuzt zuerst alle an und wartet dann auf die Warnung. Bei «Neuer Mietvertrag» ändert das nichts (schon alle angekreuzt), bei «Mietvertrag bearbeiten» stellt es den Zustand her, den die neue Regel verlangt.
- **Bildschirme:** kein neuer Zustand; die Bedeutung von `flat-rate-warning-advance` in `screens.json` ist auf «every Nebenkosten ticked» nachgeführt. `accessibility.feature` und `sprachen-bildschirme.feature` brauchen keine Änderung.
- **Texte:** keine neuen oder geänderten Texte; `messages/*.json` nicht betroffen.
- **Sicherheit/API/Design:** keine Änderung an Backend, BFF, Verträgen oder Markup.
- **Nichts Fremdes im Diff;** `implementation_plan.md` nur mit den Punkten dieses Slices. Commit-Betreff 49 Zeichen, im Format.
- **ponytail-review:** bis auf C-4 schlank.

## Nicht bestätigt

- Die Entscheidung des Product Owners vom 2026-10-19 selbst: weder im Issue #432 (Text und Kommentare) noch in `docs/design/personas/helga-432.md` zu finden; nur aus der Angabe des Aufrufers und dem Commit-Text. Siehe C-3.
- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/contract-wizard.test.ts src/__tests__/open-work.test.ts` (31) und E2E chromium `-g "Nebenkostenpauschale|flat-rate-warning"` (18): vom Aufrufer gemeldet; nur `bunx vitest run src/__tests__/contract-wizard.test.ts` selbst wiederholt (26 grün).
- Rot von Unit-Test und Szenario vor dem Code: vom Aufrufer gemeldet; durch Lesen bestätigt, dass beide auf fe21d45a fehlschlagen müssen.
- Die Anzahl umlagefähiger Kategorien in der E2E-Datenbank habe ich nur über die Migration `backend/migrations/0002_stammdaten.sql` erschlossen, nicht in der laufenden Datenbank gezählt.
