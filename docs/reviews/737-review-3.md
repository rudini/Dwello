# Code-Review 737, Bericht 3 (Slice: Fix Persona Helga P-1/P-2)

Bereich: `git diff 837ac99 3e2a02c -- . ':!docs/reviews'` (ein Commit, 3e2a02c)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | messages/de.json:556 (und fr/it/en:556), backend/src/services/formula.service.ts:304 | Der geänderte Text `backend_formula_all_zero` (V-3, neuer «Prüfen Sie …»-Satz) wird in keiner Schicht geprüft: kein Szenario, kein Unit-, DOM- oder Backend-Test. |

## C-1 (Major): geänderter Text zu «alle Wohnungen null» ohne Szenario und ohne Test

Warum es falsch ist: Der Commit ändert, was die Liegenschaftsverwalterin bei «Formel testen» und beim Speichern sieht, wenn eine Formel für alle Wohnungen 0 ergibt. Neu kommt der Satz «Prüfen Sie, ob sie mit 0 malnimmt oder {units} - 1 enthält ({units} ist für jede Wohnung 1).» dazu, in allen vier Sprachen. Das ist eine sichtbare Verhaltensänderung, und dafür braucht es ein Szenario ohne `@wip` (CLAUDE.md, Workflow 1). Ausserdem verlangt CLAUDE.md für Texte, die ein `fach-reviewer`-Bericht wörtlich vorgibt: «pin them in a test». Bei `not_a_number` und `negative` ist das erfüllt (Szenarien in distribution-keys.feature:63–72, formula-codes.test.ts:39–41, backend-error.test.ts). Bei `all_zero` fehlt es. Ein `grep` nach «alle Wohnungen», «malnimmt», `ALL_ZERO` und `all_zero` in `backend/src/__tests__`, `src/__tests__`, `tests/e2e` und `tests/contracts` findet keinen Test dieses Codes.

So zeigt man es: Setzt man in `messages/de.json:556` den alten Text ohne den «Prüfen Sie …»-Satz ein oder entfernt den Satz in `formula.service.ts:304`, bleiben alle Tests und Szenarien grün. Abhilfe: ein Szenario oder eine Examples-Zeile «Formel testen» mit einer Formel wie `{units} - 1` oder `{area} * 0`, die den ganzen Satz erwartet. Dazu im Backend in formula-codes.test.ts eine Prüfung des Codes `FORMULA_ALL_ZERO`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend `bun run type-check`, `bunx vitest run` (4356 Tests), Backend `bun test` formula-codes, formula.service, api-contracts.pg, distribution-key-admin.pg, error-codes.pg, distribution-key.pg, statement-generation.pg, E2E chromium `-g "distribution-key-(new|edit) |Verteilschlüssel"` (48 bestanden).
- Rot der beiden Szenarien beim alten Text: nur durch Lesen beurteilt. Das neue Szenario zum negativen Wert hätte beim alten Text «Die Formel ergibt einen negativen Wert.» angezeigt und wäre damit rot gewesen. Gesehen habe ich den Lauf nicht.
- Darstellung der längeren Texte bei 390 px und mit U+00A0 im Browser, axe für `formula-test-failed` mit dem neuen Text: nicht ausgeführt (tests/a11y/screens.json:117, tests/e2e/tasks/accessibility.ts:677).

Geprüft: Die Texte stimmen in allen vier Sprachen wörtlich mit 737-fachreview-2.md:26–31 überein (fr mit U+00A0 in « / » und « - », U+2019 in fr/it per Bytevergleich). `apartment_failed` ist überall `{reason}`, Backend-Code und `params.reason` bleiben unverändert. Die Fehlertexte des Backends dienen nur dem Log. Keine API-Form hat sich geändert, kein Vertrag ist betroffen. Der Step `zeigt der Test nur den Fehler` prüft den ganzen Text über eine Question. Nichts im Diff gehört nicht zur Anforderung. Ponytail: keine Befunde.
