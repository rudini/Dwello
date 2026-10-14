# Review F-19a (#81) – Runde 2

Delta 0b550a5..87428b0 (`fix(i18n): apply review findings on privacy page`), gelesen im Worktree `review-f19a-2`. Alle 12 geänderten Dateien des Deltas gelesen (Persona-Bericht und Runde-1-Bericht als Dokumente, nur für die Befundprüfung).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-7 | Minor | tests/e2e/features/privacy.feature:31-34 | Die neue Tatsache «Google Maps» (Routen-Link) steht nur im DOM-Test (`privacy-page.dom.test.ts:82-85`), nicht im Szenario «Dienste Dritter». Eine Zeile `Und nennt die Datenschutzerklärung unter "Weitergabe an Dritte" "Google Maps"` würde den Fakt auf Abnahmeebene halten; der Szenariotitel «die der Browser aufruft» passt dazu nur bedingt (Aufruf erst auf Wahl). |
| C-8 | Nit | messages/it.json:142 | «Google riceve l’indirizzo solo quando sceglie il link»: mit der Lei-Form (3. Person) liest sich «sceglie» als Subjekt Google. Eindeutig: «solo quando Lei sceglie il link». |
| C-9 | Nit | messages/de.json:142 (und fr/it/en) | P-4 verlangte, zu nennen, was Google bei der Anmeldung erfährt. Der Schlusssatz verweist jetzt korrekt auf «Anmeldung», der Abschnitt dort sagt aber weiterhin nur, was Dwello von Google erhält, nicht was Google erfährt. Nicht mehr falsch, nur unvollständig; kann in #82 mitlaufen. |
| C-10 | Nit | src/__tests__/privacy-page.dom.test.ts:82-85 | Der Test prüft nur die Abwesenheit des alten Satzes; dass der neue Schlusssatz (`privacy_third_5`) erscheint, prüft kein Test. |

Keine Blocker, keine Major.

## Prüfung der Fixes aus Runde 1

- **C-1 (it «immobile», «mappa»):** `messages/it.json:139-142` verwendet «immobile» und «mappa»; «stabile» kommt in it.json nicht mehr vor (grep: 0), passt zu `i18n-begriffe.md:9` und `buildings_map` «Mappa» (`it.json:260`). Test `privacy-i18n.dom.test.ts:22-28`. Erledigt.
- **C-2 (fr Guillemets):** In `privacy_cookies_2/3/4`, `privacy_third_4/5` stehen « … » mit U+00A0 innen (Bytes geprüft), gleich wie `privacy_draft_notice`. Test-Literal enthält ebenfalls U+00A0. Erledigt.
- **C-3:** abgelehnt mit Begründung im Plan; nachvollziehbar.
- **C-4 / P-4 (Google Maps, Schlusssatz):** `privacy_third_4` nennt den Link mit dem Button-Text je Sprache, identisch mit `buildings_plan_route` (de «Route planen», fr « Planifier l’itinéraire », it «Pianificare il percorso», en «Plan route», je Zeile 254). Fakt stimmt: Link nur in `src/routes/buildings/BuildingCard.svelte:13-15,55-60` (einzige `google.com/maps`-Stelle, `BuildingCard` nur in der Gebäudeliste `buildings/+page.svelte:12`), Adresse + PLZ + Ort in der URL, normaler `href` mit `target="_blank"`, also Übermittlung erst bei Wahl. Schlusssatz `privacy_third_5` verweist auf den Abschnittstitel `privacy_login_title` in der jeweiligen Sprache (Anmeldung / Connexion / Accesso / Sign-in); die LLM-Angabe steht im selben Abschnitt («hier»), der Satz ist damit wahr. Siehe C-9.
- **C-5:** JSDoc steht wieder über `getConfiguredProviders()` (`src/lib/server/oauth.ts:220-223`). Erledigt.
- **C-6:** fr «maintient votre session», it «mantiene la Sua sessione» – geschlechtsneutral, formell. Erledigt.

## Prüfung der Persona-Fixes

- **P-2:** `AddressSearch` nur unter `{#if isCreate}` (`src/routes/buildings/BuildingForm.svelte:34,124-130`); Texte in allen vier Sprachen auf «Erfassen» / «saisie» / «inserimento» / «add» gekürzt. Test `privacy-page.dom.test.ts:76-79`. Erledigt.
- **P-9:** «Sprache der Oberfläche» / «langue de l’interface» / «lingua dell’interfaccia» / «interface language» behauptet keine Wahl mehr; passt zur Strategie `['cookie', 'baseLocale']` (`vite.config.ts:19`) und zur Beobachtung der Persona. Erledigt.
- Offene Persona-Befunde (P-1 in #82, P-3/5/6/10 in #82, P-7/8/11/12 als U-23 in `offene-punkte.md`) sind korrekt verbucht; die U-23-Zeile ist nicht-funktional und passt dort hin.

## Konventionen

- Alle geänderten und neuen Texte in allen vier `messages/*.json`; Stil gemäss `i18n-begriffe.md:5` (fr mit geschütztem Leerzeichen, it/de ohne, formelle Anrede).
- Plan: Zeilen für code-reviewer und Persona, `Test red` für die fünf neuen Tests, `Skills: tdd, ponytail, ponytail-review` vorhanden.
- Kein neuer Bildschirmzustand; keine fremden Änderungen im Delta.

## Nicht bestätigt

- Selbst ausgeführt: `bunx vitest run src/__tests__/privacy-i18n.dom.test.ts src/__tests__/privacy-page.dom.test.ts src/__tests__/privacy.test.ts` – 14 bestanden.
- Vom Aufrufer gemeldet, nicht wiederholt: lint, `bun run check` (0 Fehler), deepcheck:audit, die weiteren Privacy-/i18n-Unit-Tests (insgesamt 20), E2E chromium Privacy- und Sprachszenarien sowie axe/i18n-Zeilen (19 bestanden).
- Rot der neuen Tests (Plan «Test red») nicht selbst nachgestellt.
- Darstellung im Browser (Umbruch der Guillemets mit U+00A0 bei 390 px) nicht angesehen.
