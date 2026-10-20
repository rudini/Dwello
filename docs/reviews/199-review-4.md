# Code-Review #199, Runde 4 (Abschlussrunde vor dem Push)

Worktree: `review-199-close` auf a237093c. Geprüft habe ich drei Bereiche, jeweils ohne `docs/reviews`, `implementation_plan.md` und `docs/archive`:
- `git diff 0bb4085e f89db47d^1`
- `git show --remerge-diff f89db47d`
- `git diff f89db47d a237093c`

Ausserdem die fr/it/en-Texte des ganzen Branches gegen main (`git diff f89db47d^2 a237093c -- messages/`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-13 | Minor | src/routes/contracts/[id]/MissingStatement.svelte:43; src/lib/server/statement-generation.ts:138 | Für P-5 hat nur der Assistent einen Test (statement-wizard.dom.test.ts:1668, Text und Link in Schritt 2). Zwei Stellen nennen eine bestehende Periode über ein Kalenderjahr jetzt mit ihren Tagen, ohne dass ein Test das zeigt: der Link «Abrechnungsperiode … wählen» am Mietvertrag und die Ablehnung des Laufs. Der einzige `existing`-Weg in contract-detail-page.dom.test.ts:344 ist 2024-07-01 – 2025-06-30, die einzige Ablehnung in statement-generation.test.ts:264 ist 01.07.2023 – 30.06.2024. Setzt man an beiden Stellen `periodName` zurück, bleiben alle Tests grün. Ohne Auswirkung ist dagegen die Zeile `statements_period_short` (MissingStatement:45, OverlapWays:21): Eine kurze Abrechnungsperiode dauert weniger als zwölf Monate und ist darum nie ein Kalenderjahr. |
| C-14 | Minor | messages/fr.json:1264, :1265 | Zwei neue fr-Texte des Branches haben vor der doppelten Interpunktion ein gewöhnliches Leerzeichen (U+0020) statt U+00A0: `statements_building_period_short_many` «courtes : {periods}» und `statements_building_period_vacant` «location ; il». Das widerspricht der Regel FR-6 (461-native-fr, über #514). Der Browser kann die Zeile dann vor «:» bzw. «;» umbrechen. Geprüft habe ich das mit `repr()` in Python: Ausgegeben wurde `' :'` bzw. `' ;'`, nicht `'\xa0'`. Alle anderen neuen fr/it/en-Texte halten sich an die Regeln aus #405. |

Kein Blocker, kein Major.

## Geprüft, ohne Befund

- **C-11:** `docs/api-specification.md:243` stimmt jetzt mit `refuseOverlappingPeriod` überein (`backend/src/services/statement.service.ts:442-456`). Die Abfrage filtert nicht nach Status, und eine Periode, die einer bestehenden gleicht, ist für jede Abrechnung erlaubt.
- **C-12:**
  - (b) `statement-generation.ts:90-95` zählt eine ersetzte Abrechnung und ihre berichtigte als eine, über Mietvertrag und Periode. Der Test statement-generation.test.ts:224 zeigt das. Ohne das `Set` ergäbe er 2, wäre also rot.
  - (a) Den Fall prüft statement-generation.test.ts:234. Ohne `uncovered(run, statements)` über ersetzte Abrechnungen würde für 2024-07-01 – 2024-12-31 eine kurze Periode angeboten.
  - (c, d) Den Fall prüft contract-actions.test.ts:234: Die ersetzte Abrechnung gehört einem anderen Mietvertrag (`c0`), und ihre Periode reicht über das Jahr hinaus. Ohne `periodsOf(building)` hätte der Fall `whole` statt der zwei Teile ergeben.
  - Rot habe ich bei allen drei Tests nur durch Lesen beurteilt. Grün sind sie auf a237093c.
- **P-5 (Dr. Weber):** `periodDays` steht neu in `accounting-period.ts:147`, und `periodName` verwendet es; doppelter Code entsteht so nicht. `periodName` bleibt dort im Einsatz, wo das Glossar eine ganze beendete Abrechnungsperiode mit ihrem Namen verlangt («Hinweis auf fehlende Abrechnungen», MissingStatement:23, :35, :48; Dashboard `overview.ts:123`). Kein Import bleibt ungenutzt.
- **Hilfetext #486:** `statements_short_period_help` habe ich maschinell mit dem Eintrag vom 2026-10-20 in #486 verglichen (`gh api repos/rudini/Dwello/issues/486`). Er stimmt in de, fr, it und en Zeichen für Zeichen überein. Die DOM-Tests (contract-detail-page:335, statement-wizard:1622) und das Szenario `contract-detail.feature:262` wurden angepasst. Der Text ist entschieden, darum braucht er keine TODO-Markierung.
- **Glossarzeile «Hinweis auf fehlende Abrechnungen»** (`UBIQUITOUS_LANGUAGE.md:48`):
  - Der Satz «Liegen die Tage ohne Abrechnung teils … oder eine kurze Abrechnungsperiode abrechnen.» ist durch #487 gedeckt. Dort steht unter «Decided (product owner)» am 2026-10-19 Option 1 mit genau diesem Wortlaut. Der PO hat ausdrücklich verlangt, dass der Pull Request von #199 die Zeile einträgt und `Fixes #487` sagt.
  - Eingetragen wurde der Satz in bf513f61; der Commit liegt vor 0bb4085e. Im Merge hat der Branch ihn behalten. Die Zeile «Abgerechnet bis» kommt im Merge von main («Mietstage und Akontobeiträge»).
  - Die Remerge-Diff zeigt nur diese Konfliktauflösung und sonst keine Änderung.
  - Hinweis ohne Befund: Bei «Kurze Abrechnungsperiode» (Z. 168) steht in der Code-Spalte jetzt «Berechnung». #487 sagt nur, dass «geplant (#408)» entfällt. Andere berechnete Begriffe tragen aber dieselbe Angabe (Z. 44, 54, 80, 135). Das stammt ebenfalls aus bf513f61, wurde also früher schon geprüft.
- **Regeln aus #405 für die neuen fr/it/en-Texte:**
  - fr: kein «imputable», kein «frais de gestion», keine Guillemets in den neuen Texten. Zur Regel U+00A0 siehe C-14.
  - it: keine gross geschriebenen Höflichkeitsformen mitten im Satz (das frühere «Suoi» ist weg), kein «spese di gestione».
  - en: keine “”.
- **`buildings-overlap`:**
  - `tests/e2e/fixtures/screens.ts:39` legt jetzt Daten für den Zustand an. Damit hat `example.building` einen Wert, und die Aufgabe in `tests/e2e/tasks/accessibility.ts:516` wartet auf die richtige Karte.
  - Der Zustand steht in `screens.json:76` und `:492`, in `accessibility.feature:161` und in `sprachen-bildschirme.feature:162`.
- **Testfake `withoutFee` (a237093c):** Jede Zeile von `/statements/billed` bringt `withoutFee` mit, und `FeeNotAgreed.svelte:31` liest es. Die Antwort kommt vom BFF und nicht vom Backend, darum braucht es keinen Vertrag in `tests/contracts`. Neu gelaufen auf a237093c: `statement-wizard.dom.test.ts` mit 81 grünen Tests und ohne «Unhandled»-Ausgabe.
- **Szenario für P-5:** Die Texte sind mit #199 neu und haben schon Szenarien (`statement-generate.feature:449`, `:496`). Für die Nennung eines Kalenderjahrs mit Tagen gibt es kein eigenes Szenario. Diese Variante zeigt der DOM-Test, und auf main gibt es diesen Text noch nicht. Darum melde ich hier keinen Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu gelaufen: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, Backend `bun run test` (1045 Tests, Coverage 93.8 %), vitest komplett (3234 Tests, 8 Zeitüberschreitungen unter Last), E2E axe/Sprache `buildings-overlap` (vor dem Merge), E2E statement-generate, contract-detail, statement-detail, dashboard und statements auf dem Merge.
- Selbst neu gelaufen: `bunx vitest run` für contract-actions, statement-generation, statement-wizard.dom und contract-detail-page.dom, 249 von 249 grün.
- Den Rotlauf der drei C-12-Tests und des P-5-Tests habe ich nur durch Lesen beurteilt, nicht durch Zurücksetzen.
- Ob die fr-Zeile in C-14 im Browser wirklich vor «:» oder «;» umbricht, hängt von der Breite ab. Im Browser habe ich das nicht geprüft.
