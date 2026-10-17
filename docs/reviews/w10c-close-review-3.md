# Abschliessendes Code-Review W10c (#363 / #91), Runde 3

Geprüft im Worktree `review-w10c-close3` (9963712), Delta `git diff b30e6f3 9963712`. Gelesen habe ich jede geänderte Datei: den pg-Test, die Anforderungen (Z. 101 und 120), den Plan, das Feature, `targets/accessibility.ts` und `tasks/accessibility.ts`. Die Nachprüfung P-1 in `marco-w10c.md` und mein eigener Bericht aus Runde 2 sind nur Dokumente. Ausserdem gelesen: `steps/contract-form.steps.ts:156-160`, `questions/contract-form.ts:30` (`confirmation = Text.of(successToast)`), `screenplay/actor.ts:47-48` (`sees` = `expect.poll`), `tasks/contract-form.ts:156-159` (`untickAllCategories`) und `targets/contract-form.ts:68-71`. `ponytail-review` ist angewendet.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-11 | behoben | tests/e2e/features/statement-agreed-costs.feature:95 | Der Step wartet über `expect.poll` auf die Meldung «Mietvertrag von … gespeichert». Die Meldung erscheint erst nach dem PUT und nach `goto(next)`. Damit ist das Speichern abgeschlossen, bevor der Assistent die Fragen lädt. Den roten Lauf ohne die Korrektur meldet der Aufrufer (siehe «Nicht bestätigt») |
| C-12 | behoben | docs/nebenkostenabrechnung-anforderungen.md:101, :120 | Z. 101 schränkt jetzt auf «Kosten in seinen Mietstagen» ein. Punkt 7 nennt die vereinbarten Nebenkosten und beide Einschränkungen (nur Abrechnungen seit #91, nicht neben einer Position ohne Kategorie) |
| C-13 | behoben | tests/e2e/tasks/accessibility.ts:254-263; targets/accessibility.ts | Die doppelten Targets und die Schleife sind weg. Der Zustand nutzt `untickAllCategories` und `agreedCategoryBoxes`. Die Imports `Uncheck` und `Count` sind entfernt, ESLint ist grün |
| C-16 | behoben | tests/e2e/tasks/accessibility.ts:255 | Den Bildschirm erkennt der Zustand jetzt an `pageAddress` (`/contracts/new`), wie die Nachbarzustände |
| C-17 | behoben | backend/src/__tests__/agreed-categories.pg.test.ts:285-303 | Der Test prüft beide PUT-Status, setzt im `finally` zurück, und der Einzug stimmt (auch im Nachbar-`it`). Prettier ändert an der Datei nichts. Dass der Test in `describe('Neuer Mietvertrag')` steht, bleibt so, das ist unerheblich |
| C-18 | Nit | tests/e2e/features/statement-agreed-costs.feature:94-96 | Im Wenn-Block steht jetzt «Und sieht der Liegenschaftsverwalter die Bestätigung …» zwischen zwei Handlungen. Das liest sich holprig («Wenn … ändert / Und sieht … / Und … öffnet»). Für Cucumber ist das gleichwertig. Lesbarer wäre «Dann sieht … / Wenn der Liegenschaftsverwalter … öffnet» |
| C-14 | Minor | backend/src/services/agreed-category.service.ts:52 | laut Aufrufer offen, unverändert wie in Runde 2 |
| C-15 | Nit | tests/e2e/features/contract-edit.feature:132-133 | laut Aufrufer offen, unverändert wie in Runde 2 |
| C-6 bis C-10 | wie Runde 1 | – | laut Aufrufer offen, unverändert |

ponytail-review des Deltas: netto kürzer (−3 Target-Zeilen, die Schleife ist durch eine vorhandene Task ersetzt). Es bleibt nichts Ungenutztes zurück. `agreedCategoryBoxAt` braucht `untickAllCategories` weiterhin. Keine neuen Befunde.

## Blocker / Major

Keine. Der einzige Major aus Runde 2 (C-11) ist behoben.

## Nachprüfung weiterer Punkte

- **Nichts Fremdes im Diff:** Der Plan wurde nachgeführt (zwei Häkchen). Die Persona-Nachprüfung steht in ae63875. Der Einzug im Nachbar-`it` des pg-Tests war Teil von C-17.
- **Persona-Nachprüfung:** P-1 ist laut Marco behoben. P-5 (Minor, kein Hinweis auf der Prüfseite und auf der Vertragsseite) bleibt in ihrem Bericht. Das ist nach «Done means» kein offener Blocker/Major.
- **Screenplay-Schichten:** Die Step-Datei ruft weiterhin nur Tasks und Questions auf. Die a11y-Task nutzt Targets und Tasks aus `contract-form`, was zulässig ist.

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** Das C-1-Szenario ist ohne die Korrektur (`setAgreedCategories` ohne `answeredOnly`) auf chromium rot und mit ihr grün. Ausserdem: 24 grün mit den Zeilen von `agreed-costs-none` und «Mietvertrag bearbeiten», `bun run lint` grün, Backend `agreed-categories.pg.test.ts` grün. E2E und Backend-Tests waren mir untersagt. Nicht gemeldet sind `bun run check` und Backend `type-check` auf 9963712.
- **Selbst ausgeführt:** `bunx eslint --max-warnings 0` auf `tests/e2e/tasks/accessibility.ts` und `tests/e2e/targets/accessibility.ts`, Exit-Code 0. `bunx prettier` auf den pg-Test (nur Ausgabe, verglichen): keine Abweichung.
- **Nur durch Lesen beurteilt:** ob der Zustand `agreed-costs-none` auf der Bearbeitungsseite alle Kästchen erfasst. `untickAllCategories` zählt einmal, die Kästchen kommen aus den Server-Props. Würde eins fehlen, liefe `Wait.until` in eine Zeitüberschreitung, ein falsches Grün gäbe es nicht.
