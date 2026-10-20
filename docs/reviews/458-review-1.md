# Code-Review #458, Runde 1 (Slice c09ec4fd..ab6bcc58)

Worktree: `review-458-code` (detached, ab6bcc58). Anforderung: #458 «Decided (product owner)» inkl. PO-Entscheid zu R-1 bis R-3, «Done means»; `docs/reviews/458-fachreview-1.md` (R-4 bis R-10, R-13 umgesetzt; R-11, R-12 ohne Änderung).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde (kein Blocker, kein Major, kein Minor). |

Ponytail-Review: Lean already. Ship. (`loadHosting` ist eine Funktion mit einem Aufrufer neben dem bestehenden `loadOperator`, kein eigener Layer; die Option `{ weekday }` in `formatDateLong` hat zwei Aufrufer und verdoppelt keinen Helper; der neue Schritt «nennen die Nutzungsbedingungen unter …» ist eine eigene fachliche Formulierung, kein Duplikat eines bestehenden Schritts.)

## Geprüft und bestätigt

- **Geteilte Verantwortung (#330):** `messages/de.json` `privacy_controller_1`, `_none`, `_2` mit dem entschiedenen Wortlaut; `src/routes/privacy/+page.svelte:65-83` hängt «Kontakt: …» über `terms_contact` an. Test: `privacy-page.dom.test.ts:257-268` (inkl. `not.toContain('ist ihr Betreiber')`) und `:288-297` (ohne Betreiber); E2E `privacy.feature:61-67`.
- **Auskunft beim Vermieter und alle erfassten Personen (R-3):** `privacy_controller_3` in allen vier Sprachen wie im Fachreview; DOM `:271-277`; E2E-Schritt `app-frame.steps.ts:165-173` prüft den vollen Satzanfang (strenger als vorher).
- **Rechte (#346):** `privacy_controller_4` in allen vier Sprachen, `_4` beginnt wie von R-3 verlangt; R-7 (fr «couramment utilisé», en «conventional») und R-8 («Art. 32(1)/(2) FADP») umgesetzt; DOM `:280-286`, E2E `privacy.feature:72-74`.
- **Demo (#330):** Satz am Ende von `privacy_demo_1` (4 Sprachen); DOM `:139-144`, E2E `demo.feature:21-24`.
- **Land des Servers (#333, R-1):** `privacy_stored_2` ohne «PostgreSQL-», `privacy_stored_country` de/en mit Doppelpunkt wie entschieden, fr/it wie Entwurf; nur angehängt, wenn `serverCountry` gesetzt (`+page.svelte:89-95`). DOM mit `Schweiz` und ohne Land (`:302-320`), Load-Test mit getrimmtem Wert (`privacy.test.ts:49-63`), E2E `privacy.feature:76-78`.
- **Mailserver (#333):** `privacy_mail_smtp_provider` nur bei `mail === 'smtp'` und beiden `MAIL_PROVIDER_*` (`operator.ts:9-15`, `+page.svelte:33-48`); fehlt eines, `mailProvider: null` (`privacy.test.ts:65-75`); ohne Anbieter bleibt der alte Text (bestehender DOM-Test `privacy-page.dom.test.ts:361-366`). Resend-Text unverändert. E2E `privacy.feature:94-97`.
- **Server-Code ohne `m.*()` auf Modulebene:** `operator.ts` liest nur `process.env` in Funktionen.
- **`.env.example`, README, `docker-compose.prod.yml`:** drei Variablen dokumentiert und an das Frontend durchgereicht; Kommentar englisch mit Hinweis «shown as entered» (R-13).
- **Anmeldeseite ohne «akzeptieren» (#347, R-9):** `login_terms_before` in vier Sprachen; `data-testid="login-legal"` neu; Unit `login-view.test.ts:29-35`, E2E `authentication.feature:13-17`.
- **Nutzungsbedingungen:** `terms_no_contract` (R-10 it), `terms_responsibility_3` mit dem Satz aus R-2 (4 Sprachen; die genannten Abschnittstitel stimmen in allen vier Sprachen mit `privacy_*_title` überein), `terms_availability_1` nach R-6 ohne «Anspruch». DOM `terms-page.dom.test.ts:69-110`, E2E `terms.feature:23-32`.
- **«Stand» auf beiden Seiten:** `legal_as_of` (4 Sprachen) mit `formatDateLong('2026-10-19', { weekday: false })`, UTC-fest; DOM und E2E auf beiden Seiten.
- **R-4 (fr U+00A0):** in den neuen fr-Texten (`terms_responsibility_3`, `privacy_controller_*`, `privacy_stored_country`) U+00A0 vor « : », « ; » und in Guillemets. Die normalen Leerzeichen in `privacy_demo_1` stammen aus dem unveränderten alten Teil des Satzes.
- **Marker:** `TODO(fachlich prüfen, #330)` und `#333` entfernt; `grep -rn "#330\|#333"` in src/backend/tests findet nur Kommentare in Tests und Features, keine Marker.
- **Kein `@wip`** mehr in `privacy`, `terms`, `authentication`, `demo.feature`.
- **Red-Läufe (gelesen):** Jeder neue Unit-, DOM- und E2E-Test prüft Text oder Felder, die es auf c09ec4fd nicht gibt (`serverCountry`/`mailProvider` fehlen dort, also scheitert auch `toMatchObject({ … null })`; «PostgreSQL-Datenbank», «akzeptieren» und «Anspruch» stehen dort noch drin), und scheitert ohne die Änderung.
- **Screenplay:** Schritte rufen nur Questions (`sectionText`, `legalAsOfText`, `loginLegalText`), Targets per `getByTestId`; die Questions geben den Text selbst zurück. Die Features beschreiben, was der Liegenschaftsverwalter erfährt, nicht Klicks. Die gestrichenen alten Szenarien sind ersetzt und gleich streng oder strenger; der alte SMTP-Text ist im DOM-Test abgedeckt (Kommentar `privacy.feature:94`).
- **Design:** neues `<p>` nur mit `text-ink-muted` (Token); kein neuer Bildschirm und kein neuer Zustand, also keine Änderung an `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature` nötig.
- **Commits:** Betreffzeilen höchstens 50 Zeichen, Conventional Commits.
- **Nichts Fremdes im Diff:** alle Dateien gehören zu #458 oder zum Fachreview.

## Nicht bestätigt

- `bun run lint`, `bun run check` (auf 0d847905), `cd backend && bun run type-check` und der volle `bunx vitest run` auf 0d847905: vom Aufrufer gemeldet.
- Selbst nachgeprüft auf ab6bcc58: `bunx vitest run` für `privacy-page.dom`, `privacy`, `terms-page.dom`, `login-view`, `format-language` (72 bestanden) sowie `i18n`, `no-german-in-code`, `design-guard`, `privacy-i18n.dom` (838 bestanden).
- E2E auf ab6bcc58 (Sprachprüfung mit «Liechtenstein» und dem Seed-Wert «Muster Mail AG»): nicht gelaufen, das Ergebnis meldet der Aufrufer nach. Gelesen: `playwright.config.ts:46-50` und `tests/e2e/questions/language.ts:76`. Dass «Liechtenstein» in fr/it/en keinen Treffer der Sprachprüfung mehr auslöst, ist nur durch Lesen bestätigt. Die übrigen 72 E2E auf 0d847905: vom Aufrufer gemeldet.
- Dass der Satz unter `login-legal` im Browser lückenlos «… steht in den Nutzungsbedingungen.» ergibt (Leerraum zwischen Text und Link): nur aus dem Markup (`src/routes/login/+page.svelte:48-60`) und dem gemeldeten grünen E2E auf 0d847905 geschlossen.
- `deploy/demo/.env.example` nennt die neuen Variablen nicht. Die Anforderung verlangt das nur für `.env.example`, darum kein Befund. In welchem Land der Demo-Server steht, ist nicht geprüft.
