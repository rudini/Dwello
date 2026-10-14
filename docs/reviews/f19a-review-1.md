# Review F-19a (#81) – Runde 1

Commit: b826af0..0b550a5 (`fix(i18n): correct facts on the privacy page`), gelesen im Worktree `review-f19a-code-reviewer`. Alle 14 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | messages/it.json:139-140 | «stabile» für Gebäude; `docs/design/i18n-begriffe.md:9` legt «immobile» fest, «stabile» kommt sonst nirgends in it.json vor. Zudem heisst die Karte dort «carta», die App nennt dieselbe Karte «Mappa» (`messages/it.json:259-260`, `buildings_map`). |
| C-2 | Minor | messages/fr.json:144-146 | Guillemets ohne geschütztes Leerzeichen («dwello_session»); `i18n-begriffe.md:5` verlangt « … » mit geschütztem Leerzeichen im Französischen (so auch im bestehenden `privacy_draft_notice`). |
| C-3 | Minor | src/routes/privacy/+page.svelte:26-28 | Ohne eingerichteten Anbieter (`getConfiguredProviders()` leer) entsteht «Die Anmeldung erfolgt über .». Kaum erreichbar (ohne Anbieter keine Anmeldung), aber ungetesteter Randfall des neuen Platzhalters. |
| C-4 | Minor | messages/de.json:141 (`privacy_third_4`) | «Darüber hinaus gibt Dwello keine Daten an Dritte weiter» bleibt absolut, obwohl die Gebäudekarte in der Liste einen Routen-Link zu Google Maps mit der Gebäudeadresse anbietet (`src/routes/buildings/BuildingCard.svelte:13-15`). Vom Benutzer ausgelöst, also keine automatische Übermittlung; trotzdem eine Übermittlung an Google, die der Satz nicht nennt. Nicht Teil der Liste in #81: als offene Arbeit erfassen oder bewusst ablehnen. |
| C-5 | Nit | src/lib/server/oauth.ts:214-222 | `PROVIDER_NAMES` wurde zwischen das JSDoc «Get list of configured OAuth providers» und `getConfiguredProviders()` eingefügt; der Kommentar hängt jetzt an der Konstante. Konstante über das alte JSDoc setzen. |
| C-6 | Nit | messages/it.json:144, messages/fr.json:144 | Geschlechtsform: it «La mantiene connessa» (weiblich), fr «vous garde connecté» (männlich). Neutral formulieren (z. B. «mantiene attiva la sessione» / «maintient votre session»). |

Keine Blocker, keine Major.

## Geprüfte Fakten (Code gegen Text)

- Cookies: `dwello_session` httpOnly, maxAge = JWT-Laufzeit (`src/lib/server/auth.ts:80-86`, Name `src/lib/server/jwt-config.ts:67`); `dwello_xsrf` httpOnly false (`auth.ts:98-104`); `dwello_oauth_state` httpOnly, 600 s, im Callback gelöscht (`auth.ts:173-179`, `src/routes/auth/callback/+server.ts:57`); `dwello_login` httpOnly, 600 s, speichert Anbieter und Zielseite, beim Lesen gelöscht (`src/lib/server/login-flow.ts:7,33-47`); `PARAGLIDE_LOCALE` per `document.cookie`, `max-age=34560000` = 400 Tage (generiertes `src/lib/paraglide/runtime.js:25-27,426`, Strategie `cookie` in `vite.config.ts`). Weitere Cookies setzt die App nicht (grep `cookies.set`, `document.cookie`). Texte stimmen.
- CARTO: Kacheln von `basemaps.cartocdn.com` nur in `BuildingMiniMap.svelte:42`, eingebunden nur in `buildings/[id]/BuildingFacts.svelte:51` (Seite eines Gebäudes), Mittelpunkt = Gebäudekoordinaten, Zoom 16. Marker ist `divIcon`, Leaflet-CSS gebündelt: keine weiteren externen Ladevorgänge. Text stimmt.
- OpenPLZ: `src/lib/services/openplz.ts:8,41-46` sendet den Suchbegriff an `openplzapi.org/ch` direkt aus dem Browser; `AddressSearch` nur in `BuildingForm` (Erfassen `buildings/new`, Bearbeiten `buildings/[id]/edit`). Text stimmt.
- Google Fonts: keine externe Schrift in `src/app.html` und `src` (grep `https://`). Entfernung korrekt.
- Anmeldung: `getConfiguredProviders()` + gemeinsames `PROVIDER_NAMES`, per `Intl.ListFormat` (disjunction) je Sprache verbunden; Login-Seite nutzt dieselbe Tabelle. E2E hat nur Google (`playwright.config.ts:23-26`), daher ist «nicht Microsoft» dort aussagekräftig.
- Backend: keine weiteren Drittanbieter ausser LLM (bereits eigener Hinweis) und Mailversand (bereits `privacy_third_1`).

## Tests und Konventionen

- Szenarien in `tests/e2e/features/privacy.feature:27-41` ohne `@wip`, fachlich formuliert; negative Prüfungen haben jeweils einen positiven Anker davor; Question liefert den Text (`sectionText`), Steps rufen nur Questions auf.
- Unit: `privacy.test.ts` (Load liefert nur eingerichtete Anbieter), `privacy-page.dom.test.ts` (Anbieterliste, CARTO/OpenPLZ, kein Google Fonts, alle fünf Cookies).
- Plan: `Scenario red`, `Test red` und `Skills: tdd, ponytail, ponytail-review` vorhanden.
- Alle neuen Texte in allen vier `messages/*.json`; kein neuer Bildschirmzustand (bestehende Zeilen `privacy`, `privacy-public`).
- Keine fremden Änderungen im Diff (Plan-Zeile zu PR #161 gehört zur laufenden Session).

## Nicht bestätigt

- Selbst ausgeführt: `bunx vitest run src/__tests__/privacy.test.ts src/__tests__/privacy-page.dom.test.ts` – 9 bestanden.
- Vom Aufrufer gemeldet, nicht wiederholt: lint, `bun run check`, `bun run test:coverage` (2286), deepcheck:audit, fallow audit, E2E chromium `privacy.feature` + Sprachszenarien (17), axe/i18n-Zeilen `privacy`, `privacy-public` (4).
- Paraglide-Quelle in `node_modules` war nicht lesbar (Zugriff verweigert); die 400 Tage sind über das generierte `runtime.js` im Worktree bestätigt.
- Darstellung der Liste in fr/it/en (`Intl.ListFormat` auf Server und Client) nur im Code geprüft, nicht im Browser angesehen.
