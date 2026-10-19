# Code-Review #457, Runde 1

Gegenstand: `git diff 1cc62668 44f25e93 -- . ':!docs/reviews' ':!implementation_plan.md'` (Commits 2d0596d6, 44f25e93), Worktree `review-457-code`, detached auf 44f25e93.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Nit | tests/e2e/features/contract-detail.feature:325 | Der Szenariotitel sagt «Die Frage nach dem Vertragsende nennt …», geprüft wird aber der Hinweis (Einspruchshilfe). Der Schritt wurde nach Fachreview V-3 umbenannt, der Titel nicht. Vorschlag: «Der Hinweis nach dem Vertragsende nennt die stillschweigende Fortsetzung». |

Keine Blocker, keine Major.

## Geprüft

- **Texte:** `contracts_fixed_term_objection` in de/fr/it/en hat den zweiten Satz. de stimmt wörtlich mit dem entschiedenen Text in #457 überein; fr, it und en stimmen wörtlich mit dem «Empfohlenen Wortlaut» in `docs/reviews/457-fachreview-1.md` überein. Die Begriffe passen zu `docs/design/i18n-begriffe.md` (Vertragsende = fin du contrat / fine del contratto / contract end, Mietzins = loyer / pigione / rent). Andere Schlüssel (`contracts_fixed_term_question`, `_consequences`, `contracts_moved_out_*`) sind unverändert.
- **Anzeige für jeden abgelaufenen Mietvertrag:** `FixedTermCheck.svelte:51` zeigt den Schlüssel ohne Datumsgrenze, sobald `shown && endDate` gilt. Daran ändert der Diff nichts, der neue Satz kommt allein über den Text.
- **Marker:** `TODO(fachlich prüfen, #308)` steht nicht mehr in `src/lib/overview.ts` und `FixedTermCheck.svelte`. Auch sonst gibt es in `src backend tests` keinen Marker mit #308. Die übrigen Erwähnungen sind Kommentare ohne Marker, und `tools/open-work/check-issues.mjs` beachtet nur `TODO(fachlich prüfen, #n)`.
- **Tests:** Der DOM-Test (`contract-detail-page.dom.test.ts:844-847`) und das Szenario (`contract-detail.feature:324-331`) prüfen den neuen deutschen Satz wörtlich. Beim Lesen sind beide ohne den Text rot, weil es den Satz auf dem Basis-Commit nicht gibt. Der Commit 2d0596d6 bringt beide mit @wip und ohne Text. Für einen reinen Zustand ist die tiefste Schicht der DOM-Test, also richtig. Das E2E-Szenario verlangt das Issue.
- **Screenplay:** Der neue Schritt ruft nur die Question `fixedTermCheckText` (`Text.of(fixedTermCheck)`) auf, also kein Locator im Schritt. Die Question gibt den Text selbst zurück, nicht ja/nein. Das Feature beschreibt, was der Verwalter sieht, ohne UI-Wörter.
- **a11y/Sprachen:** Es gibt keinen neuen Bildschirm und keinen neuen Zustand, deshalb braucht `screens.json` keinen Eintrag. Laut Aufrufer laufen die Zeilen von contract-detail in axe und in den Sprachprüfungen mit.
- **Ponytail-Review:** Der Diff ist minimal: ein Text pro Sprache, zwei Kommentarzeilen, eine Question, ein Schritt, ein Szenario und eine Assertion. Es gibt nichts zu streichen und keine Abstraktion.
- **Unbeteiligtes:** Der Diff enthält weder Formatierung noch Umbauten von unberührtem Code.
- **Sicherheit:** nicht betroffen, weil nur ein statischer Text dazukommt.

## Nicht bestätigt

- Von mir erneut ausgeführt: `bunx vitest run src/__tests__/contract-detail-page.dom.test.ts src/__tests__/i18n.test.ts` mit 88 bestandenen Tests.
- Vom Aufrufer gemeldet: lint, check, `open-work.test.ts` und `overview.test.ts`, E2E chromium `-g "befristet|Vertragsende|stillschweigende|contract-detail"` mit 94 bestandenen Tests, einschliesslich axe und Sprachzeilen. Rot gesehen vor dem Text (2d0596d6): nur durch Lesen bestätigt, nicht ausgeführt.
- Die Länge des Hinweises bei 390 px und in fr/it/en im Browser habe ich nicht gesehen, das ist Sache der Persona-Runde.
- Dass der PR #308 schliesst, lässt sich erst am PR-Text prüfen. #308 ist noch offen.
