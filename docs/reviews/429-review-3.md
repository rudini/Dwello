# Code-Review #429 «Nebenkostenpauschale pro Monat», Runde 3 (Abschlussrunde 2, Re-Review)

Gegenstand im Worktree `review-429-close2` (detached bei 5ebcc21c), Pfadfilter ohne `docs/reviews`, `implementation_plan.md`, `docs/archive` und `docs/design/personas`:
- Merge bcd27cb1: `git diff d23b7054 bcd27cb1^1` ist im Filter leer. `git show --remerge-diff bcd27cb1` zeigt keine Konfliktauflösung. `git diff bcd27cb1^1 bcd27cb1` bringt nur Inhalt von `main`: Glossarzeilen zu #403/#404 (Saldo, Mindestbetrag, Übertrag, Bezahlt, Erledigt, Zahlungsfrist einer Mahnung) und das Entfernen des Markers `TODO(fachlich prüfen, #277)` in `DocumentItem.svelte`.
- Fix: `git diff bcd27cb1 5ebcc21c`. Gelesen habe ich alle 6 Dateien: `Alert.svelte`, `AgreedCategories.svelte`, `RentStep.svelte`, `contract-new.feature`, `questions/contract-form.ts`, `steps/agreed-costs.steps.ts`. Dazu `screenplay/questions.ts` (`Attribute`), `screenplay/actor.ts` (`sees` pollt), `tasks/contract-form.ts` (`untickAllCategories`, `enterFlatRateUtilityCharge`), `targets/contract-form.ts`, `contract-wizard.ts` (`flatRateNotice`, `amount`), `invoice.ts` (`plainAmount`) und `screens.json`.

Vorbericht: `docs/reviews/429-review-2.md`.

## Befunde (nur neue im Delta)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-18 | Nit | tests/e2e/questions/contract-form.ts:55 | Die Question gibt den technischen Tonnamen (`info`/`caution`) zurück, nicht etwas, das der Benutzer sieht. Der Step kapselt das, und es ist ein echter Zustand (Warnung oder Hinweis). Darum nur Nit. Der Kommentar `«caution» warns` erklärt die Zuordnung. |

ponytail-review des Deltas: Das Attribut `data-tone` ist eine Zeile und kommt ohne neuen Helfer aus. Der Import von `plainAmount` ersetzt die Normalisierung aller vier Beträge. Nichts bleibt ungenutzt: `normalizeAmounts` braucht RentStep.svelte:29 weiterhin. `net: 0`.

Der Merge bringt keine Befunde. Die Glossaränderungen stammen aus `main` und nicht aus diesem Branch. Nach dem Entfernen des Markers nennt kein Code in `src`, `backend/src` oder `tests` mehr #277 (`grep`).

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-14 (Major) | erledigt | Das neue Szenario `contract-new.feature:204–210` geht mit Pauschale 120 bis «Miete», entfernt alle Häkchen und prüft Titel und Ton (`toBe('info')`) des Alerts `contract-agreed-costs-none`. Ohne `flatRate={…}` in RentStep.svelte:146 bekommt der Alert den Ton `caution`, und `expect.poll` schlägt fehl. Damit fällt die vorher fehlende Verdrahtung auf. Ohne das Attribut in Alert.svelte:28 liefert die Question `null`. Beides passt zu den roten Läufen, die der Aufrufer meldet. Kein `@wip`. Steps rufen nur Tasks und Questions auf. Die Feature-Sprache beschreibt das Ziel, nicht die Bedienung. Dass ohne Häkchen die Pauschalen-Warnung fehlt, prüft weiter `contract-wizard.test.ts:114` (unterste Schicht). |
| C-15 (Minor) | offen | `screens.json:46–47` hat weiter nur `agreed-costs-none` (Ton `caution`) und `flat-rate-warning`. Der Zustand «Pauschale, keine Häkchen» (Ton `info`) hat keine eigene a11y- und Sprachzeile. |
| C-16 (Nit) | erledigt | RentStep.svelte:146 liest nur die Pauschale über `plainAmount`. Die Bedingung `> 0` steht weiter auch in `flatRateNotice` (contract-wizard.ts:92). Das ist nur noch eine Restdoppelung und kein Befund mehr. |
| C-17 (Nit) | erledigt | AgreedCategories.svelte:17: «no box may be right, so no warning». |
| C-2, C-3, C-4, C-5, C-6 (Minor) | offen | Nicht im Delta, unverändert. |
| C-7, C-8, C-13 (Nit) | offen | Nicht im Delta, unverändert. |

Es ist kein Blocker oder Major offen.

## Bestätigt

- **C-14:** siehe Statustabelle. Das Szenario gilt für die Neuerfassung. «Bearbeiten» nutzt dieselbe Komponente `RentStep`.
- **Alert `data-tone`:** Das Attribut gibt nur den vorhandenen Prop `tone` aus. Es ändert weder Darstellung noch Rolle noch Tokens. Selbst ausgeführt: `bunx vitest run` von `ui-feedback.dom`, `agreed-categories.dom`, `contract-wizard` und `design-guard`. Ergebnis: 453 grün.
- **Texte:** Das Delta enthält keine neuen UI-Texte. Der Step prüft den bestehenden Titel `contracts_agreed_costs_none_title` («Keine Nebenkosten vereinbart», de.json:764).
- **Sicherheit:** kein Server-, BFF- oder Backend-Code im Delta.
- **Bezug zur Anforderung:** Der ganze Fix-Diff dient C-14, C-16 und C-17. Der Merge enthält nur Inhalt von `main`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (3094 Tests) und E2E chromium (40 Szenarien inkl. des neuen sowie der Zeilen `agreed-costs-none` und `flat-rate-warning` für axe und Sprachen). Auch die roten Läufe («Received: null», «Received: caution») sind nur gemeldet. Ich habe sie durch Lesen nachvollzogen, aber nicht wiederholt.
- Ob das Polling in `sees` nach `untickAllCategories` stabil ist: Ich habe nur gelesen, dass `expect.poll` wartet, und keinen Lauf selbst gesehen.
