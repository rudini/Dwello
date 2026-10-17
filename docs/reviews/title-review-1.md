# Code-Review: Titel «Tankbestand» (#75) und Nacharbeiten #62

Worktree: `review-title-code` (detached, ac83f8a). Diff: `git diff ae722ad ac83f8a`, 1 Commit, 18 Dateien. Das `@wip`-Szenario kommt aus 5f427ee (`git diff 5f427ee~1 5f427ee -- tests`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | src/routes/tenants/[id]/TenantRentalCard.svelte:27 | Das Feld heisst jetzt `monthlyTotal`, die `data-testid` heisst aber weiter `tenant-rental-rent`. Das ändert kein Verhalten, und die Testid steht nicht in der Anforderung (#62 nennt nur Code-Namen). Wer sie umbenennt, ändert sie auch in tenant-detail-page.dom.test.ts:93. |
| C-2 | Nit | Commit ac83f8a | Der Betreff `feat(buildings): …` deckt nur #75 ab. Der Commit enthält aber auch die Umbenennung zu #62 (Mieterseite, E2E-Schritt). Das ist vertretbar, weil die Anforderung beides im selben Commit verlangt. |

ponytail-review: Lean already. Ship. net: -0 lines possible. Die neue Erwartung im DOM-Test (buildings-pages.dom.test.ts:267) und der E2E-Schritt prüfen beide den Titel. Der DOM-Test ersetzt dabei nur die bestehende Zeile mit dem alten Titel und kommt nicht dazu.

## Blocker/Major

Keine.

## Geprüft und bestätigt

- **#75, Titel:** Neue Werte von `buildings_fuel_title`: de «Tankbestand», fr «Stock de combustible», it «Scorta di combustibile», en «Fuel stock». Das sind die Werte aus `docs/design/i18n-begriffe.md:77` (Zeile «Tankbestand / Heizmaterial»). Kein Titel enthält «Vorrat», «citerne» oder «serbatoio», #315 bleibt also offen. Der Titel wird in `FuelStocks.svelte:33` über `Panel title=… testid="fuel-stocks"` ausgegeben. Alle vier `messages/*.json` sind geändert.
- **V-1:** Im fr-Einleitungstext ist «le stock» als Lagerort an allen drei Stellen durch «le dépôt» ersetzt. «citerne» bleibt, und «stock initial/final» (Bestand) bleibt korrekt.
- **V-3:** Der Szenariotitel heisst jetzt «Der Abschnitt zum Heizmaterial heisst Tankbestand», der Kommentar «Abschnitt» statt «Feld». `@wip` ist entfernt (building-detail.feature:57-60). Das Feature sagt, was der Verwalter sieht, nicht wie (kein «klickt»/«Feld»).
- **Rote Tests:** Gegen ae722ad wird das Szenario rot, weil der Titel dort «Brennstoff im Tank oder Lager» heisst und die Question `fuelStocksTitle` (Text) mit `toBe` vergleicht. Auch der DOM-Test (buildings-pages.dom.test.ts:267, `toBe('Tankbestand')` auf dem h2) schlägt mit dem alten Text fehl. Die Question liefert den Wert selbst (Text). Der Schritt ruft nur die Question auf, die Target-Datei hält den Locator (Screenplay-Schichten eingehalten, 5f427ee).
- **V-5:** `rent` → `monthlyTotal` in `tenants/[id]/+page.server.ts:29`, in `TenantRentalCard.svelte:28` und in beiden Tests (tenant-detail.test.ts:65, tenant-detail-page.dom.test.ts:73). Der Typ kommt über `PageData['rental']` aus dem Load, deshalb gibt es keine weitere Typdefinition. Ein Grep über `src` und `tests` findet kein `rental.rent` mehr.
- **V-6 / C-1 (rename-review):** Schritt «beträgt das Monatlich total der Wohnung {string}» (Feature :19 und Steps :50-51), Question `monthlyTotalOfApartment`, Target-Beschreibung «Monatlich total». Ein Grep findet kein `grossMonthlyRent` und keinen «brutto»-Schritt mehr. Strenge und Betrag (CHF 950.00) sind unverändert.
- **C-2 (rename-review):** `apartment.test.ts:178-185` ist nach `bunx prettier | diff` sauber. Die übrigen Prettier-Abweichungen der Datei (Zeilen 166ff.) bestanden schon vorher und sind nicht angefasst. Der Testname «Akonto» statt «Akontozahlung» folgt V-7 (Glossarbegriff). Der Kommentar in `contract-history.ts:9` sagt bereits «additional rent».
- **Bildschirme:** Es gibt keinen neuen Bildschirm und keinen neuen Zustand, nur einen neuen Text. `building-detail` ist schon in `screens.json`, `accessibility.feature:40-42` und `sprachen-bildschirme.feature:41-43`.
- **API-Verträge:** Keine Antwort des Backends ist geändert, `tests/contracts` muss nicht angepasst werden.
- **Sicherheit, Tokens:** Es gibt keine neuen Endpunkte und keine neuen Klassen.
- **Nichts Fachfremdes:** `docs/reviews/*.md` sind die abgelegten Berichte (skill `slice-review`, Schritt 1). In `implementation_plan.md` sind nur Haken, Punkte und die Dateiliste geändert.

## Nicht bestätigt

- `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- `bunx vitest run` von `apartments-pages.dom`, `open-work` und `design-guard`: vom Aufrufer gemeldet. Selbst ausgeführt und grün (95/95): `buildings-pages.dom.test.ts`, `apartment.test.ts`, `tenant-detail.test.ts`, `tenant-detail-page.dom.test.ts`.
- E2E `building-detail.feature`, `apartment-detail.feature` (20 passed) und die axe-/Sprachzeilen `building-detail` (6 passed): vom Aufrufer gemeldet. Reviewer dürfen E2E nicht starten. Dass das Szenario ohne die Änderung rot wird, habe ich nur durch Lesen bestätigt.
- fr/it/en-Titel: Kein Test prüft die Übersetzungswerte. `sprachen-bildschirme` prüft nur, dass kein Deutsch erscheint. Die Wörter habe ich gegen i18n-begriffe.md:77 und w3d-fachreview-1.md («Bestätigt») gelesen. Die Persona-Prüfung der Sprachen steht im Plan noch offen.
