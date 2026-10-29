# Code-Review 817, Runde 3 (abschliessend, e1eab1f..750571c)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-13 | Major | src/routes/config/access-keys/NewAccessKey.svelte:21-33; +page.svelte:54-59; CopyButton.svelte:11-18; tests/e2e/features/zugangsschluessel.feature | Die Knöpfe zum Kopieren (Schlüssel, Adresse im Kasten, Adresse auf der Seite) und ihre Meldungen «Der Schlüssel ist kopiert.» / «Die Adresse ist kopiert.» sind Verhalten, das der Benutzer sieht. Es gibt dafür kein Szenario und keinen Grund `No scenario: <reason>` |
| C-14 | Minor | src/routes/config/access-keys/+page.svelte:57, 118 | Zwei geänderte Zeilen haben keinen Test. Die Meldung `done` des Knopfs auf der Seite prüft kein Test, denn der Test zu C-11 klickt ihn nur im Fall, in dem das Kopieren fehlschlägt. Dass der Widerrufen-Dialog `revokeError` zeigt, prüft ebenfalls kein Test (der Unit-Test, der für «No scenario» nötig ist, bleibt bei der Aktion stehen). Mit `error={undefined}` in Zeile 118 bleiben alle Tests grün |

Geschlossen: C-2, C-11, C-12.

C-2: Die Ablehnung hält. `FailRequests.to` antwortet mit `route.fulfill({ status: 500 })` ohne Inhalt (tests/e2e/screenplay/interactions.ts:164). Das `enhance` von SvelteKit kann die leere Antwort nicht lesen und liefert ein `result` vom Typ `error`, nicht `failure`. `ActionDialog` ruft `showRefusal` nur bei `failure` auf (ActionDialog.svelte:65), und `update()` zeigt dann die Fehlerseite. `createError`/`revokeError` aus `+page.server.ts:36, 44` erreicht der Browser also nur, wenn der Aufruf vom BFF zum Backend fehlschlägt: «a failure only between server parts» (tests/e2e/CLAUDE.md:69). Darum braucht es auch keinen a11y-Zustand. Was noch fehlt, ist der Test der Anzeige im Dialog: C-14.

## C-13 (Major): Kopieren ohne Szenario

**Warum falsch:** Nach `CLAUDE.md`, Workflow 1 und «Done means», braucht jede Verhaltensänderung, die der Benutzer sieht, ein Szenario ohne `@wip` oder einen Grund `No scenario: <reason>`. Die Knöpfe kamen in Runde 2 dazu, und dieser Commit erweitert sie: ein zweiter Knopf im Kasten, je eine eigene Meldung. Die DOM-Tests in `access-keys-page.dom.test.ts` ersetzen kein Szenario. Der E2E-Stack kann den Zustand erzeugen: Das Kopieren nach dem Erstellen läuft im Browser, und die Erfolgsmeldung ist ein sichtbarer Toast. In Chromium lässt sich mit `clipboard-read` auch prüfen, was in der Zwischenablage liegt. Keiner der Gründe in tests/e2e/CLAUDE.md:67-75 trifft zu. In `implementation_plan.md:72, 75` steht kein Grund «No scenario» für das Kopieren. Runde 2 hat diesen Punkt übersehen.

**Zeigen:** `grep -rn -i "kopier\|clipboard\|access-key-new-copy\|address-copy" tests/e2e` findet keinen Schritt, kein Ziel und keine Frage. Entfernt man `CopyButton` aus `NewAccessKey.svelte`, schlagen nur DOM-Tests fehl, kein Szenario.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: lint, check, backend type-check, `access-key.pg.test.ts` (22 pass), `vitest --changed origin/main` (636 pass), E2E chromium+api für zugangsschluessel, privacy, terms und settings (66 passed), axe- und Sprachzeilen von access-keys, privacy und terms (18 passed).
- Die Entscheidung des Product Owners zum «Stand» 29.10.2026 und den Text `Spec change approved: #817` im Pull Request konnte ich nicht prüfen, weil `gh issue view 817` nichts zurückgab. Das Gleiche gilt für die Glossarzeilen aus #942 und dafür, ob der Pull Request bei C-2 «No scenario» nennt (im Plan: implementation_plan.md:73).
- Die Rotläufe belegt nur die Commit-Nachricht von 750571c. Beim Lesen schlagen die Tests zum Stand und der Test zum Kopieren mit Meldung ohne die Änderung fehl (die testid `access-key-new-address-copy` und die neuen Meldungen fehlen dort). Die Tests zu C-11 und C-12 halten laut Nachricht Verhalten fest, das schon im vorigen Commit dieser Änderung stand. Ein Bugfix ist das nicht.
- Den Wortlaut von V-12 (mcp.ts:29-30) und die Übersetzungen der neuen Meldungen in fr/it/en beurteilt `fach-reviewer`.

Geprüft: der Merge e1eab1f mit `--remerge-diff` (ohne Konflikt), der Diff 8a3e898..e1eab1f^1 (leer); die Standardwerte von `limit` in mcp.ts (20, bzw. 50 bei Wohnungen, Mietern und Mietverträgen) gegen building-, apartment-, tenant-, contract-, invoice- und statement.service; keine Reste von `ai_keys_copied`; die neuen Meldungen in allen vier Sprachen; der Satz zur Demo in `audit_privacy_demo`; die Schritte zum Stand prüfen weiterhin den ganzen Text.
