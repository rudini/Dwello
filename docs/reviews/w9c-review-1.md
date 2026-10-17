# Code-Review W9c, Runde 1 (e11a135..80122d4)

Worktree: `review-w9c-code1` (detached auf 80122d4). Alle 59 geänderten Dateien gelesen; Issues #82 und #178 ("Decided") und `docs/reviews/w9c-fachreview-1.md` als Anforderung abgeglichen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | docs/api-specification.md:23, :118, :269, :288 | Neuer öffentlicher Endpunkt `GET /api/v1/mail-transport` fehlt in der Liste der Endpunkte ohne JWT (Z. 23) und bei den Rechnungs-/Config-Endpunkten; `/auth/me` (Z. 269) und die JWT-Claims (Z. 288) nennen weiterhin `picture?`. |
| C-2 | Minor | tests/unit/auth-routes.test.ts:285; src/routes/auth/refresh/+server.ts:45-50; src/routes/auth/me/+server.ts:43-48 | Kein Test zeigt, dass ein altes Token mit `picture` beim Verlängern und in `/auth/me` das Profilbild verliert: Der Refresh-Test hatte `picture` im Payload, der Diff entfernt es dort, statt zu prüfen, dass es nicht weitergegeben wird. Mit dem alten Code bliebe kein Test rot. Vorschlag: Payload mit `picture` behalten und `not.toHaveProperty('picture')` auf dem neuen JWT bzw. der `/auth/me`-Antwort prüfen. |
| C-3 | Minor | implementation_plan.md:9-18 | Keiner der umgesetzten Punkte ist abgehakt (Workflow 8, "during: tick each item when done"). Geänderte Dateien sind nicht vermerkt. |
| C-4 | Nit | src/routes/privacy/+page.server.ts:23-25 | Zwei Backend-Abfragen nacheinander; `Promise.all` würde die Ladezeit der öffentlichen Seite nicht verdoppeln. |
| C-5 | Nit | src/lib/former-tenant-documents.ts:7-8 | ponytail `reuse:` `swissDay` wiederholt `localToday` (src/lib/contract-status.ts:19-20). `localToday = (date = new Date()) => …` und `localToday(new Date(d.createdAt))`, -3 Zeilen. |
| C-6 | Nit | src/routes/dashboard/+page.server.ts:106-119 | ponytail `shrink:` `of`-Helfer plus zwei Casts und ein zweites `find` für den Namen; `Map.groupBy(contracts, c => c.tenantId)` liefert Verträge und Namen in einem Schritt. |
| C-7 | Nit | tests/e2e/steps/app-frame.steps.ts:176-181 | «"OpenPLZ" in "Deutschland" mit seiner Datenschutzerklärung …» prüft Name, Land und Link je einzeln gegen den ganzen Abschnitt; das Land ist nicht an den Dienst gebunden (würde auch bestehen, wenn ein anderer Absatz das Land nennt). Heute eindeutig, aber schwach. |
| C-8 | Nit | messages/en.json, messages/fr.json (`login_privacy_before` + `privacy_record`) | Satz endet mit Grossbuchstaben mitten im Satz: «set out in the Privacy notice.», «figure dans la Déclaration de protection des données.» (gleiches Muster wie beim Link auf die Nutzungsbedingungen). |
| C-9 | Nit | backend/src/mail/index.ts:23-24 | ponytail `stdlib:` `Object.keys(providers).includes(name)` → `Object.hasOwn(providers, name)`. |

ponytail-review: net: etwa -8 Zeilen möglich (C-5, C-6, C-9). Sonst schlank; `operator.ts` ersetzt die Kopie in den Nutzungsbedingungen, kein toter Code, `privacy_third_1` in allen vier Dateien entfernt, kein `picture` mehr in `src`.

Keine Blocker, keine Majors.

## Geprüft und bestätigt (Kurzfassung)

- #82 Verantwortlicher aus `OPERATOR_*` mit Kontakt, «Betreiber» erklärt, Auskunftsrecht Art. 25 DSG: `privacy/+page.svelte`, `operator.ts`; DOM-Test, privacy.test, Szenarien «Der Betreiber ist verantwortlich», «Auskunft über die eigenen Daten».
- Aufbewahrung (nichts automatisch, Art. 958f OR nur für Buchführungspflichtige, nicht löschbare Datensätze): Texte nach R-2, R-3, R-13; DOM-Test, Szenario.
- Dritte je konfiguriertem Anbieter: Anmeldung (Google/Microsoft nur wenn eingerichtet, Land, DPF, Link, was der Anbieter erfährt), Mail `smtp|resend|null` über öffentlichen Endpunkt (pg-Test ohne Anmeldung, Contract + api-contracts-Test), OpenPLZ und Google Maps mit Land und Link. Der Endpunkt gibt nur den Anbieternamen preis (wie `llm-recipient`), kein Leck.
- Google ohne `access_type`/`prompt`, kein Profilbild in JWT, Refresh, `/auth/me`, `hooks.server.ts`, Typen: oauth.test (rot ohne Änderung), Szenario «Anmeldung ohne dauerhaften Zugriff» mit positivem Anker `client_id`.
- Server-Protokoll Zweck/Leser/Aufbewahrung, Cookie-Gültigkeit aus `JWT_EXPIRY` in jeder Einheit (beide Cookies werden beim Refresh mit `expirySeconds` neu gesetzt, `auth.ts:84/102`), Ablehnen der Cookies und Entwurf ohne Websitedaten (`wizard-draft.ts` fängt blockierten Speicher ab): DOM-Tests, Szenarien.
- Anmeldeseite verlinkt die Datenschutzerklärung (login-view.test, Szenario in sprachen.feature), Nutzungsbedingungen: Demo-Absatz (DOM-Test, demo.feature, screens.json/accessibility/sprachen-bildschirme `terms|demo`), «Liegenschaftsverwalter» in allen vier Sprachen.
- #178: Regel in `former-tenant-documents.ts` (alle Verträge `ended` nach `contractStatusOn`, letzter Vertragsende-Tag, Schweizer Tag, nur `upload`, Tag des Endes ausgeschlossen); Unit-Tests decken die Fälle aus der Fachreview-Tabelle ab; Mieterseite (load-Test, DOM-Test), Übersicht (overview.test mit Einzahl/Mehrzahl, dashboard.test über `documents.json`). Löschen über die bestehende Zeile mit Bestätigung; nach dem Löschen lädt die Seite neu und der Hinweis verschwindet. `No scenario: server clock` entspricht `tests/e2e/CLAUDE.md`, "No scenario".
- TODO-Marker #330, #331, #333, #334 an den offenen Punkten aus R-1, V-1, R-4/R-5, M-1; `TODO(fachlich prüfen, #82)` entfernt.
- E2E-Schichten: Steps rufen nur Tasks/Questions; `Attribute.ofAll` liefert die Werte selbst; Features ohne UI-Wörter.
- Rot ohne Änderung (nach Lesen): alle neuen Unit-/DOM-Tests und Szenarien prüfen Texte, Links, Parameter oder Daten, die es vorher nicht gab; Ausnahme C-2.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (158 Dateien), `bun test` von mail-transport.pg, api-contracts.pg, mail, invoice-categorization.pg: vom Aufrufer gemeldet.
- Selbst erneut gelaufen: `bunx vitest run` der 12 betroffenen Dateien (former-tenant-documents, privacy-page.dom, privacy, dashboard, overview, tenant-detail, tenant-detail-page.dom, terms-page.dom, login-view, tests/unit/oauth, auth, auth-routes): 195 von 196 grün; `auth-routes.test.ts` «should redirect to OAuth provider» lief einmal in den 5-s-Timeout (Rechner durch den E2E-Lauf ausgelastet), allein wiederholt 25/25 grün.
- Rot-Sehen der `@wip`-Szenarien und der volle E2E-Lauf: vom Aufrufer gemeldet, nicht gesehen.
- `open-work.test.ts`/`check-issues`: ob #330, #331, #333, #334 offen sind und das richtige Label tragen, nicht über die API geprüft.
- Zustände «kein Betreiber», «Mail über Resend», «kein Mailversand», «Microsoft eingerichtet» und der Hinweis «Dokumente aus der Mietzeit prüfen» auf der Mieterseite/Übersicht sind nur in DOM-/Unit-Tests abgedeckt und nicht in `tests/a11y/screens.json`: Der E2E-Stack setzt `OPERATOR_*` und `MAIL_TRANSPORT=smtp` für alle Instanzen (playwright.config.ts:41-43, :96), und ein Dokument vor einem vergangenen Vertragsende lässt sich nicht anlegen. Axe auf dem neuen `Alert` der Mieterseite ist daher nicht gelaufen.
- Rechtliche Richtigkeit der Texte (Firmen, Länder, DPF-Zertifizierung, Policy-URLs) nicht selbst recherchiert; sie folgen `docs/reviews/w9c-fachreview-1.md`.
