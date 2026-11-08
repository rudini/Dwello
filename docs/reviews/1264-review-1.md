# Code-Review #1264 / #1265, Runde 1 (Commit ad49ee0, Diff 10e0c78..ad49ee0)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | tests/e2e/steps/contract-form.steps.ts:373 | Der neue Schritt «beginnt die Wohnung … in der Auswahl mit …» escapt den Text mit einem eigenen Inline-Regex (`text.replace(/[.*+?^${}()\|[\]\\]/g, '\\$&')`). Das kopiert den vorhandenen Helfer `escapeRegExp` aus tests/e2e/questions/pattern.ts:2 (den statement-send.steps.ts und statement-detail.steps.ts schon importieren), und der Kopie fehlt dazu der `/`, den der Helfer seit #803 mitnimmt. |

Keine Blocker, keine Major.

Geprüft: Die vier `messages/*.json` stimmen Wort für Wort mit docs/reviews/1264-fachreview-1.md überein (`contracts_apartment_cleared_text`, `contracts_apartment_help_unchecked`, `contracts_option_unchecked`). Die neuen Texte sind in contracts-i18n.test.ts (fr/it/en) und contract-form.test.ts (de) festgehalten. Die Hilfe hängt den Satz nur an, solange `availability` ein `null` enthält (ApartmentStep.svelte:45-47). Der DOM-Test prüft das Erscheinen und das Verschwinden nach «Erneut versuchen», und das Szenario contract-new.feature:91 («nur») hält weiter fest, dass der Satz ohne nicht geprüfte Option fehlt. Beim Lesen schlagen die drei Szenarien ohne die Änderung fehl (die Zeile 176 und die Zeilen 269 und 276; keines trägt `@wip`). Die einzige geänderte Szenariozeile ist contract-new.feature:176, durch #1264 freigegeben. Das Szenario in Zeile 266 («enthält "(nicht geprüft)"») bleibt wahr. Der Schritt ruft nur die Frage `apartmentChoiceLabel` auf, und diese Frage liefert den Text der Option. Es gibt keinen neuen Bildschirmzustand: Die Hilfe erscheint im bestehenden Zustand `contracts-unknown` (screens.json:451). Der Diff enthält keine fremden Änderungen und berührt keine Tokens oder Komponenten ausserhalb von `Select`.

## Nicht bestätigt

- Lint, check, fitness, Backend-Typecheck, die drei Vitest-Dateien (117 bestanden, rot gesehen), E2E contract-new.feature auf chromium (61 bestanden, die drei neuen bzw. geänderten Szenarien rot gesehen), Axe- und Sprachzeilen contract-new contracts-unknown / apartment-cleared und contract-edit contracts-unknown, Prettier, testcheck:audit: vom Aufrufer gemeldet.
- Ob die Option bei 150 % und 200 % im geschlossenen Feld wirklich lesbar ist: Kein Szenario zoomt. Das Szenario in Zeile 276 prüft nur, dass das Merkmal vorne steht. Ob der Browser das Ende abschneidet und nicht den Anfang, ist nicht gerendert worden. Das bleibt für den Persona-Lauf in Schritt 5.
- Ob die Zeile `contracts-unknown` von contract-new (screens.json:451, `?tenant=…&apartment={freeApartment}`) im Screens-Fixture eine Option mit «(nicht geprüft)» zeigt und damit den neuen Hilfesatz durch Axe und die Sprachprüfung führt: Den Fixture-Pfad (tests/e2e/fixtures/screens.ts) habe ich nicht bis zur Route verfolgt, die mit einem Fehler antwortet. Die Beschreibung in screens.json:106 sagt, dass die Mietverträge der Wohnungen nicht laden.
