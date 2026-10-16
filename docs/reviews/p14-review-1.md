# Code-Review P-14 (#110), Runde 1

Worktree: `review-p14-code`, Commit 3431569, Bereich `git diff bd4b58d 3431569` (2 Commits, 17 Dateien, alle gelesen).

Ergebnis: **keine Blocker, keine Major.** 2 Minor, 3 Nits.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `tests/e2e/screenplay/interactions.ts:180` | `Object.defineProperty(navigator, 'languages', { get })` ohne `configurable: true`: Die Eigenschaft ist danach nicht mehr konfigurierbar. Ein zweites `Browser.preferLanguages` im selben Szenario wirft im Init-Skript `TypeError: Cannot redefine property`, und `navigator.languages` behält den ersten Wert. In «Die Sprache des ersten Besuchs bleibt …» schickt der Browser nach dem Schritt «bevorzugt Französisch» also `Accept-Language: fr`, aber `navigator.languages` ist weiter `en`. Kein falsches Grün: `html lang` kommt vom Server, ohne Cookie wäre die Seite `fr`. Die Interaktion bildet den Browser aber nur halb nach. Behebung: `configurable: true` setzen. |
| C-2 | Minor | `tests/e2e/tasks/language.ts:15` | `{word}` passt auf jedes Wort, die Tabelle kennt aber nur Englisch, Französisch und Spanisch. Ein anderes Wort (z. B. «Italienisch», V-3 im Fach-Review) gibt `undefined` weiter und scheitert in `interactions.ts:176` mit `Cannot read properties of undefined (reading 'split')`, statt die fehlende Sprache zu nennen. Behebung: die Sprache melden, die fehlt (oder `Italienisch` ergänzen). |
| C-3 | Nit | `src/hooks.server.ts:48` | ponytail `shrink:` Die Bedingung auf `text/html` prüft kein Test (`i18n.test.ts` liefert nur HTML; die Bedingung zu entfernen lässt alles grün). Entweder immer `Vary` anhängen (eine Zeile weniger; deckt auch die übersetzten Texte in `__data.json` ab) oder einen Test für eine Antwort ohne HTML ergänzen. |
| C-4 | Nit | `tests/e2e/screenplay/interactions.ts:177` | `route.continue` statt `route.fallback`: Eine später registrierte Route mit `continue()` (`Navigate.toWithScriptsHeldBack`, Z. 30–33) übergeht die Sprach-Kopfzeile, und `FailRequests.noLonger` (`unrouteAll`, Z. 163) hebt sie auf. Heute kombiniert das kein Szenario. `route.fallback({ headers })` würde mit beiden zusammenspielen. |
| C-5 | Nit | `tests/exploratory-test.ts:507` | Ein eigener `newContext` ohne `locale`, also `en-US`: Mit der neuen Strategie ist diese Oberfläche jetzt englisch, das Skript sucht aber deutsche Texte («Heizprofil bearbeiten», Z. 351; «Summe:», Z. 374). Kein Script in `package.json` und kein CI-Job ruft es auf; `locale: 'de-CH'` würde es wieder deutsch machen. |

Ponytail-Review: `hooks.server.ts:48` siehe C-3, sonst kurz genug. `net: -1 lines possible.`

## Anforderung gegen Code und Tests

- Strategie `cookie, preferredLanguage, baseLocale` an allen drei Stellen: `package.json:17`, `vite.config.ts:32`, `vitest.config.ts:12`. Bestätigt.
- Das Cookie gewinnt: `i18n.test.ts` «folgt der gewählten Sprache %s, auch wenn der Browser Deutsch will» (mit vertauschter Reihenfolge rot, Server-Seite) und das E2E-Szenario «Die gewählte Sprache gilt vor der Sprache des Browsers». Bestätigt.
- Sonst die Sprache des Browsers (de/fr/it/en): auf dem Server `i18n.test.ts` `it.each` mit vier Sprachen; im Browser die E2E-Szenarien Französisch (Anmeldeseite) und Englisch (Übersicht). Die Sprachen in `navigator.languages` gleicht `extractLocaleFromNavigator` erst als ganzes Tag ab, dann nur die Grundsprache (`src/lib/paraglide/runtime.js:892-911`). Bestätigt.
- Sonst Deutsch: Unit-Test `es-ES` und das E2E-Szenario «Spanisch». Bestätigt.
- «Done means»: Szenario «Ohne Wahl zeigt die Anmeldeseite die Sprache des Browsers» (Browser Französisch, kein Cookie, Anmeldeseite auf Französisch, Titel «Se connecter - Dwello»), ohne `@wip`. Bestätigt.
- `Vary: Accept-Language` auf Seiten: `hooks.server.ts:47-49` und der Unit-Test «sagt Zwischenspeichern …» (ohne die Änderung rot). Bestätigt; siehe auch C-3.
- Satz in der Datenschutzerklärung: Alle vier `messages/*.json` stimmen Wort für Wort mit dem Vorschlag R-1 überein (`docs/reviews/p14-fachreview-1.md`). Die Aussage stimmt: Der Client schreibt das Cookie beim ersten `getLocale()` mit der aufgelösten Sprache (`runtime.js:193-198`, `setLocale(resolved, { reload: false })`), und das E2E-Szenario «Die Sprache des ersten Besuchs bleibt …» zeigt es. Der DOM-Test prüft den deutschen Text (ohne die Änderung rot). Bestätigt.
- E2E und DOM bleiben deutsch: `playwright.config.ts:158` `locale: 'de-CH'` (die Screenshots-Konfiguration und `persona-kit.mjs:31` erben oder setzen es auch); für DOM-Tests `tests/mocks/browser-language.ts` als `setupFiles` nur im Projekt `dom` (jsdom meldet sonst `en-US`). Bestätigt; einzige Ausnahme ist C-5.

Pflichtpunkte: Das Szenario ohne `@wip` ist da. Es gibt keinen neuen Bildschirm und keinen neuen Zustand, also ist kein Eintrag in `screens.json` nötig. Der geänderte Text steht in allen vier Sprachen. Die Steps rufen nur Tasks und Questions auf, die Kopfzeile und `navigator` ändert nur die Interaktion. Nichts im Diff gehört nicht zur Anforderung (Plan und Fach-Review gehören zum Workflow). In den Features steht kein Wort zur UI.

Rote Tests (beim Lesen geprüft): Die neuen Unit-Tests zur Browsersprache, der Test zu `Vary`, der DOM-Test zum Datenschutz sowie die E2E-Szenarien Französisch, Englisch und «Sprache des ersten Besuchs bleibt» schlagen ohne die Änderung fehl. «Spanisch → Deutsch» und «Die gewählte Sprache gilt vor …» sind schon auf dem Basis-Commit grün. Sie sind als Schutz gewollt (Fach-Review V-2), und ihr Rot zeigt der Unit-Test mit vertauschter Reihenfolge.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle 2715, vor der letzten Änderung an `interactions.ts`): vom Aufrufer gemeldet.
- `bun run test:e2e -- --project=chromium tests/e2e/features/sprachen.feature` (20 bestanden) und `privacy.feature` (frühere Ausführung): vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich nur `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/privacy-page.dom.test.ts`: 39 bestanden.
- Firefox und WebKit: Für Pull Requests lässt CI nur `chromium` und `api` laufen (`.github/workflows/ci.yml:190`). Ob `route.continue` mit `accept-language` dort die Kopfzeile ersetzt, ist nicht geprüft. Ebenso nicht nachgeprüft: die Aussage des Aufrufers, Chromium sende die Locale des Kontexts über `setExtraHTTPHeaders` (Probe-Skript).
- Sprachprüfung und axe für `/privacy` mit dem neuen Satz (`sprachen-bildschirme.feature`, `accessibility.feature`) für fr/it/en: nicht ausgeführt und nicht gemeldet. Beim Lesen kommt in den drei Sätzen kein Wort nur aus dem Deutschen und kein Umlaut vor.
- `node_modules` war nicht lesbar (Zugriff verweigert). Die Paraglide-Laufzeit habe ich im erzeugten `src/lib/paraglide/runtime.js` des Worktrees gelesen, nicht im Paket selbst. `extractLocaleFromHeader` auf dem Server (Gewichtung nach q-Werten) habe ich nicht gelesen; die Unit-Tests decken nur Kopfzeilen ab, deren erste Sprache passt.
