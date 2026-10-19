# Slice-Review #435 «Daten eines Mieters exportieren», Runde 1

Gegenstand: `origin/main..HEAD` (80b68d52, edc0ce9b, bd423e0e auf fd77a177), Worktree `review-435-1` (nur gelesen), ohne `implementation_plan.md` und `docs/reviews`. Gelesen: alle 21 geänderten Dateien, Issue #435 mit «Decided (product owner)» (inkl. 2026-10-19 zu Mahnungsbriefen und E-Mail-Kopien), `docs/reviews/435-fachreview-1.md`, dazu `schema.ts` (tenants, rental_contracts, documents, line items), `statement.service.ts:getStatement`, `statement-send.service.ts`, `document.service.ts`, `today.ts`, `hooks.server.ts`, `statements/zip/+server.ts`, `file-proxy.ts`, `Button.svelte`, `tests/e2e/CLAUDE.md`, `tests/a11y`-Einträge der Mieterdetailseite.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `backend/src/services/tenant-export.service.ts:126`, `:137`; `tests/e2e/steps/tenant-export.steps.ts:46` | Datum der Dokumente im Dateinamen und `exportedOn` sind UTC-Tage, die App zeigt Schweizer Tage; zwischen 00:00 und 01:00/02:00 falsches Datum, und das Szenario (`inDays(0)`, Schweizer Tag) wird in diesem Fenster rot. |
| C-2 | Minor | `docs/api-specification.md:72` | Die Zeile `GET /:id/export` steht in der Tabelle «4. Apartments» statt «5. Tenants»; dokumentiert so `/api/v1/apartments/:id/export`. |
| C-3 | Minor | `backend/src/services/tenant-export.service.ts:47-70` | `rental_contracts.contract_pdf` wird nicht exportiert, obwohl der Plan ihn unter `dokumente/` vorsah; die Streichung ist nirgends begründet (siehe Antwort unten). |
| C-4 | Minor | `backend/src/services/tenant-export.service.ts:101-108` | Positionen ohne Verteilschlüssel, `sharePercentage`, Tage (`positionRentalDays`/`billedDays`) und Heizkostenanteil (`heatingShare`, Heizprofil); die Fachreview verlangt «Positionen so, wie die PDF sie zeigt … Verteilschlüssel». |
| C-5 | Minor | `backend/src/services/tenant-export.service.ts:107` | Jede Position gibt alle abgerechneten Rechnungen mit Beschreibung und Betrag heraus; die PDF zeigt Rechnungsbeschreibungen nur bei Teilen über verschiedene Tage (`statement-pdf.service.ts:95`), und die Fachreview zählt «Rechnungen und Belege des Gebäudes» zu «Nicht aufnehmen». Vom Landlord getippte Beschreibungen können Dritte nennen. Bei `fach-reviewer` bestätigen lassen oder auf das kürzen, was die PDF zeigt. |
| C-6 | Minor | `backend/src/__tests__/tenant-export.pg.test.ts`, `tests/e2e/steps/tenant-export.steps.ts:33-41` | Der berechnete Status «Überfällig» (F-8) ist in keinem Test geprüft; das Szenario hat eine überfällige Abrechnung, prüft aber nur die Nummer. |
| C-7 | Minor | `tests/e2e/steps/tenant-export.steps.ts:37` | Der Schritt «… Name und Kontaktdaten …» prüft nur den Namen; Kontaktdaten (E-Mail, Adresse) prüft weder E2E noch pg-Test. |
| C-8 | Minor | `tests/e2e/features/tenants.feature:68-69` | «Anna Keller» hat nur ein Dokument, keinen Mietvertrag und keine Abrechnung im Gebäude «Seeblick»; F-2 schlug einen Mieter mit eigener Abrechnung im selben Gebäude vor. Der pg-Test (Vormieter derselben Wohnung, `tenant-export.pg.test.ts:110-116`) deckt das Filterrisiko ab, daher nur Minor. |
| C-9 | Minor | `backend/src/services/tenant-export.service.ts:73`, `src/routes/tenants/[id]/export/+server.ts:20-27` | Alle Dateien gehen Base64 in einer JSON-Antwort durch Backend und BFF und werden synchron im Speicher gezippt (Spitze etwa vier- bis fünfmal die Base64-Grösse; 30 Uploads à 10 MB ≈ >1 GB). Für <50 Wohnungen meist harmlos, aber unbegrenzt: Zeile in `docs/design/offene-punkte.md` (Zuverlässigkeit/Performance). Dazu `zipSync(..., { level: 0 })` wie `statements/zip/+server.ts:25`, PDFs/JPEGs sind schon komprimiert. |
| C-10 | Minor | `backend/src/routes/tenants.ts:71-78` | Der 404-Pfad des Backends hat keinen Test (nur der BFF mit gefälschtem Backend, `src/__tests__/tenant-export.test.ts:45-47`); der Aufrufer meldet einen roten «404 check» im pg-Test, die Datei enthält keinen. |
| C-11 | Nit | `tests/e2e/questions/download.ts:44-47` | shrink: `unzipSync(...)['daten.json']` statt `Object.entries(...).find(...)`. |
| C-12 | Nit | `src/routes/tenants/[id]/export/+server.ts:25` | shrink: `Buffer.from(content, 'base64')` ist schon ein `Uint8Array`; `new Uint8Array(...)` kopiert nur. |
| C-13 | Nit | `tests/contracts/README.md:52` | Neue Zeile englisch, die übrigen Zeilen der Tabelle deutsch. |
| C-14 | Nit | `tests/e2e/steps/tenant-export.steps.ts:41`, `:52` | Die Zahlungserinnerung wird in beiden Then-Schritten geprüft (Abrechnungsnummer und Datei); die Titel beider Schritte nennen sie, das überschneidet sich. |

### C-1 (Major): UTC-Tag statt Schweizer Tag

- Beleg: `tenant-export.service.ts:126` `document.createdAt.toISOString().slice(0, 10)` und `:137` `new Date().toISOString().slice(0, 10)`. Server und Datenbank laufen in UTC (`backend/src/services/today.ts:3`: «a day behind until 01:00 or 02:00»). Die Mieterseite zeigt dasselbe Dokument mit `formatDate(d.createdAt)` in `Europe/Zurich` (`src/lib/utils/format.ts:50`, `TenantDocumentRow.svelte:16`). Das Szenario erwartet `dokumente/${inDays(0)} …` (`tenant-export.steps.ts:46`), und `inDays` rechnet den Schweizer Tag (`tests/e2e/fixtures/dates.ts:2`).
- Warum falsch: Ein Dokument, das um 00:30 Schweizer Zeit hochgeladen wurde, heisst im Export «<Vortag> Übergabeprotokoll.pdf», während die App den richtigen Tag zeigt; `exportedOn` ist im selben Fenster der Vortag. Der Mieter erhält damit ein falsches Datum. Das Szenario ist in diesem Fenster (CI-Läufe nachts) deterministisch rot. Die pg-Tests rechnen `today` ebenfalls in UTC (`tenant-export.pg.test.ts:92`, `:155`, `:180`) und sehen den Fehler nicht.
- Nachweis: pg-Test, der ein Dokument mit `createdAt: new Date('2026-10-18T23:30:00Z')` einfügt und `dokumente/2026-10-19 …` erwartet; heute liefert der Export `2026-10-18`. Korrektur: `toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' })` (wie `src/lib/former-tenant-documents.ts:14`) bzw. `swissToday()` für `exportedOn`.

## Antwort auf die Fragen des Aufrufers

- **Daten anderer Mieter:** Alle Abfragen filtern nach dem Mieter: Verträge `rentalContracts.tenantId` (`:45`), Dokumente `documents.tenantId` (`:73`), Abrechnungen `utilityStatements.tenantId` (`:82`); Positionen und Korrekturkette kommen über `getStatement` je eigener Abrechnung; Kategorienamen über die vereinbarten Kategorien des eigenen Vertrags. Kein Leck über Gebäude oder Wohnung gefunden; der pg-Test mit Vormieter derselben Wohnung belegt es. Einziger Rest: Rechnungsbeschreibungen der Positionen (C-5).
- **Export ändert nichts:** Kein Aufruf von `getStatementPdf`/`generateStatementPdf`; `getStatement` liest nur (`statement.service.ts:235-310`, «overdue» berechnet). Der pg-Test vergleicht die Zeilen von `utility_statements` vorher/nachher (`:137`). Bestätigt.
- **Dateinamen:** `safe` ersetzt `\ / : * ? " < > |`; Pfad immer genau `<Ordner>/<Name>` (Test `:186`), Doppelungen mit Zähler, Endung nach MIME (Uploads nur PDF/JPEG/PNG, `document.service.ts:91-93`). Content-Disposition: ASCII-Ersatz entfernt alles ausser `\x20-\x7e` und `"`, `filename*` ist URL-kodiert; keine Header-Injection. fflate setzt das UTF-8-Flag bei Umlauten. Offen nur: Namen, die sich nur in Gross/Kleinschreibung unterscheiden, kollidieren beim Entpacken unter Windows/macOS (nicht gewichtet).
- **N+1 `getStatement`:** etwa 3–4 Abfragen pro Abrechnung; ein Mieter hat höchstens wenige Dutzend Abrechnungen. Für <50 Wohnungen und einen seltenen Export unbedenklich, kein Befund.
- **Speicher:** C-9.
- **Vertrags-PDF (`contract_pdf`):** Nach «Done means» («all data Dwello holds about them») gehört er grundsätzlich hinein. Praktisch schreibt ihn heute nichts: kein Formular, keine BFF-Route, nur das Backend-API nimmt ihn an (`routes/contracts.ts:57`, `:78`; Schema-Kommentar «Base64 or URL»). Deshalb Minor (C-3): entweder als Datei unter `dokumente/` bzw. Wert im JSON aufnehmen, wenn gesetzt, oder die Streichung im Plan/PR begründen.
- **CLAUDE.md-Regeln:** Texte `tenants_export*` in allen vier Sprachen; Französisch mit geschütztem Leerzeichen vor «:» (Bytes `C2 A0` geprüft), «art. 28» wie die übrigen Artikelverweise in `fr.json`. Nur Token-Klassen (`text-ink`, `gap-4`), `Button`/`Panel` aus `src/lib/ui`, Nebenaktion (Variante `secondary` Standard), Hilfetext sichtbar und per `aria-describedby` verbunden, `data-testid` kebab-case. Die Karte liegt auf der bestehenden Mieterdetailseite, die in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` schon steht (Zustand `default`); kein neuer Zustand. Ein Mapper pro Antwort: die Antwort hat nur einen Verbraucher. Screenplay: Schritte rufen nur Tasks, Questions und `seed`; Questions liefern Werte (Namen, Nummern, Dateinamen). Feature-Text ohne UI-Wörter. Kein fremder Diff gefunden.
- **Fehlerzustand:** Scheitert der Aufruf BFF→Backend, wirft der BFF `error(500)`; das fällt unter «No scenario» (`tests/e2e/CLAUDE.md`, «a failure only between server parts»), entspricht dem Muster der Dokument-Downloads (`file-proxy.ts`) und ist im BFF-Test für 404 belegt. Für den PR `No scenario: <reason>` für den 500-Fall nennen.

## Ponytail

- `tests/e2e/questions/download.ts:L44-47: shrink: Object.entries(...).find(...). unzipSync(...)['daten.json'].` (C-11)
- `src/routes/tenants/[id]/export/+server.ts:L25: shrink: new Uint8Array(Buffer.from(...)). Buffer.from(content, 'base64').` (C-12)
- net: -3 Zeilen möglich. Sonst schlank: ein Service, eine Route, eine Karte.

## Rote Tests (nach Lesen)

- pg-Tests 1–6: jeder fiele ohne den jeweiligen Code (Service fehlt; Filter nach Wohnung statt Mieter; Entwurfsregel; Vorrang der E-Mail-Kopie; `safe`/Zähler; Sprache der Ordner). Der Teil «ändert nichts» in Test 3 wäre ohne Änderung auch grün gewesen (es gab nie einen Erzeugungspfad); als Absicherung in Ordnung.
- BFF-Test und DOM-Test fielen ohne Route bzw. Karte. Vertragstest fiele ohne Endpunkt.
- Szenario: fällt am fehlenden Knopf; laut Plan auch an der fehlenden PDF (F-4) gesehen.

## Nicht bestätigt

- Alle Checks des Aufrufers (lint, check, backend type-check, vitest 671, `tenant-export.pg.test.ts` 6, `api-contracts.pg.test.ts` 42, E2E Chromium 46 und die roten Läufe): vom Aufrufer gemeldet. Mein `bunx vitest run src/__tests__/tenant-export.test.ts src/__tests__/tenant-detail-page.dom.test.ts` im Worktree scheiterte mit `ERR_MODULE_NOT_FOUND` (keine `node_modules` im Worktree), nicht weiter verfolgt.
- `accessibility.feature` und `sprachen-bildschirme.feature` für `tenant-detail` (neue Karte in fr/it/en ohne Deutsch, axe hell/dunkel) sind laut Meldung nicht gelaufen (Filter `@tenants|tenant-detail |Mieterdetail|…` trifft sie vermutlich nur teilweise); nicht geprüft.
- Wie Chrome/Firefox/WebKit einen 500 auf einen Link mit `download` zeigen (Seite oder fehlgeschlagener Download): nicht geprüft.
- Ob der Titel einer Mahnung die Mahnstufe enthält (Fachreview, offener Punkt 2: «mit Mahnstufe und Datum im Namen»): nur `title` gesehen, die Erzeugung der Mahnungstitel nicht gelesen.
- 48-px-Höhe und 390-px-Breite der Karte: nur aus `Button.svelte` (Standard) geschlossen, nicht gerendert.
