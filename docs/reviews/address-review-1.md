# Slice-Review «address» (#68, #102), Runde 1

Worktree: `review-address-code`, Commit `767a088`, Bereich `git diff 4968cc0 767a088` (47 Dateien, alle gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/routes/tenants/TenantFormFields.svelte:95-97` | Doppelte ID `address-help`: der neue Hilfetext der Fieldset-Gruppe und die Hilfe/Beispiel-Zeile des Felds «Strasse» (`TextInput id="address"` mit `example`, `Field.svelte` erzeugt `${id}-help`). Das Strassenfeld wird damit durch den falschen Text beschrieben |
| C-2 | Minor | `docs/api-specification.md:82` | Tenant-Body (POST/PUT) nennt das neue optionale Feld `country` (ISO-Code, Standard `CH`) nicht; V-6 hat nur die anderen Dokumente nachgeführt |
| C-3 | Minor | `backend/src/routes/tenants.ts:35` | `^[A-Z]{2}$` nimmt jeden Code aus zwei Buchstaben an (z. B. `XX`); nur das BFF prüft gegen `countryCodes`. Ein direkter API-Aufruf schreibt einen ungültigen Ländercode in die QR-Rechnung. Ausserdem prüft kein Backend-Test die Route mit `country` (weder angenommen noch abgelehnt) |
| C-4 | Minor | `src/routes/tenants/TenantFormFields.svelte:135-142` | Laut #102 ist das Land optional, das `Select` ohne `optional` setzt aber `aria-required="true"`. Ein Screenreader sagt «erforderlich» bei einem Feld mit Vorgabe Schweiz |
| C-5 | Minor | `src/routes/tenants/TenantFormFields.svelte:25-27` | `localeCompare` ohne Locale sortiert auf dem Server mit der Node-Standardlocale und im Browser mit der Locale des Nutzers. Dazu kommen Ländernamen aus zwei ICU-Ständen (Node, Browser): die Reihenfolge und die Texte können zwischen SSR und Hydration abweichen. `localeCompare(b.label, getLocale())` würde wenigstens die Sortierung festlegen |
| C-6 | Minor | `src/routes/tenants/[id]/TenantContactCard.svelte:14-20`, `TenantFormFields.svelte:96-98` | Kein DOM-Test für das Land in der Kontaktkarte (nur im Ausland) und für den Hilfetext mit `aria-describedby`. Beides zeigt nur E2E; ein DOM-Test in `tenant-form-fields.dom.test.ts` hätte C-1 gefunden |
| C-7 | Minor | `tests/e2e/features/statement-detail.feature:67` | Der Schritt im `@wip`-Szenario #114 wechselt von «die Abrechnung versendet» zu «den Versand trotzdem bestätigt». Das gehört zum nächsten Slice (#114) und hat mit #68/#102 nichts zu tun. Kein fremdes Refactoring, aber in den Commit des nächsten Slice verschieben |
| C-8 | Nit | `tests/e2e/fixtures/backend.ts:224` | ponytail `delete:` der Standardwert `country = 'CH'` wird nie genutzt, der einzige Aufrufer übergibt immer `COUNTRIES[country]`. Ersatz: Parameter ohne Standardwert |
| C-9 | Nit | `tests/e2e/steps/tenant-form.steps.ts:64` | ponytail `delete:` `Schweiz: 'CH'` in `COUNTRIES` nutzt kein Szenario. Ersatz: nur `Deutschland` |
| C-10 | Nit | `tests/e2e/tasks/statement-detail.ts:33-36` | ponytail `shrink:` `sendStatement` könnte `openSendConfirmation` und `confirmSending` wiederverwenden (bestehender Code, nur wenn der Slice ihn ohnehin anfasst) |
| C-11 | Nit | `backend/src/__tests__/statement-pdf-render.test.ts:90-91` | V-3: Dass das Adressfeld kein «DE-78462» trägt, prüft der Test nur indirekt. `pdf.text` enthält «DE-78462 Konstanz» aus dem Zahlteil, eine negative Prüfung auf den Adressblock fehlt |

ponytail-review (Rest): `postal-address.ts` (zwei Einzeiler, zwei Aufrufer), `countryCodes` (das Intl-API hat kein `supportedValuesOf('region')`, die Liste ist nötig), `correspondByLetter(…, country?)`: schlank. net: -3 Zeilen möglich (C-8, C-9).

## C-1 (Major): doppelte ID `address-help`

**Warum falsch:** `Field.svelte` gibt jedem Feld mit `help` oder `example` die Hilfezeile `<p id="{id}-help">` und hängt sie an `aria-describedby` des Bedienelements. Das Strassenfeld hat `id="address"` und `example={m.buildings_street_example()}`, rendert also `<p id="address-help">`. Der neue Absatz der Korrespondenzadresse heisst ebenfalls `id="address-help"` und steht davor im DOM. Die Folgen:
- Das HTML ist ungültig (doppelte ID).
- `aria-describedby="address-help"` am Strassenfeld wird zum ersten Element mit dieser ID aufgelöst, also zum Satz «Hierhin gehen Abrechnungen …». Das Beispiel der Strasse liest kein Screenreader mehr vor.
- `aria-describedby` der Fieldset-Gruppe ist mehrdeutig.

axe meldet das wahrscheinlich als `duplicate-id-aria` auf den geprüften Bildschirmen `tenant-new` und `tenant-edit` (`tests/a11y/screens.json:194`, `:213`); gelaufen ist die a11y-Suite nicht (siehe «Nicht bestätigt»). Das verletzt die Design-Regeln (Barrierefreiheit, Hilfe am Feld).

**So zeigt man den Fehler:** In `src/__tests__/tenant-form-fields.dom.test.ts` die Felder mounten und `document.querySelectorAll('#address-help').length` prüfen: das ergibt 2 statt 1. Oder `document.getElementById(input.getAttribute('aria-describedby'))` des Strassenfelds lesen: der Text ist die Korrespondenzadressen-Hilfe, nicht «Beispiel: …». Behebung: eine eindeutige ID, z. B. `correspondence-address-help`.

## Anforderungen, abgeglichen

- #68 Legende «Korrespondenzadresse» und Hilfetext in vier Sprachen: `messages/*.json` (drei Schlüssel in allen vier Dateien, de wörtlich wie entschieden); Szenario tenant-new «Die Korrespondenzadresse sagt, wohin die Post geht» (ohne `@wip`, schlägt ohne die Änderung fehl: keine Test-ID `tenant-address-help`). Detailseite mit Label «Korrespondenzadresse»: `TenantContactCard.svelte`. Mangel: C-1.
- #102 Land optional, Standard Schweiz: Migration `0012` (`NOT NULL DEFAULT 'CH'`), Schema, `tenantFields` und `getStatement` lesen `country`; BFF `readFields` (unbekannt → CH) mit Unit-Test; PLZ-Prüfung nur CH/LI mit Unit-Test; Vertrag `tests/contracts/tenant.json` nachgeführt. Mängel: C-3, C-4.
- QR-Rechnung, Schuldner: `debtorCountry: statement.tenant.country ?? 'CH'`, Test `qr-bill.service.test.ts` (Zeile 7 des Schuldnerblocks `DE`).
- PDF-Adressblock (V-1, Land in Grossbuchstaben allein auf der letzten Zeile, Nachbarländer in eigener Sprache, sonst englisch): `countryLine` in Abrechnung und Mahnung; Tests `statement-pdf-render.test.ts` (DE, US, CH) und `reminder-pdf.test.ts`. Die Mahnung bekommt `country` über `getTenant` → `tenantFields`.
- V-2 Ländercode vor der PLZ ausser CH, Liechtenstein eingeschlossen: `qrTown` für Zahlteil und Empfangsschein (`pdf.service.ts:856`, beide nutzen `debtor`); Test mit LI und CH.
- Keine separate Hausnummer: Doku (`data-model.md`, PRD), kein neues Feld.
- V-3: Szenario statement-detail prüft «Marktstätte 3 78462 Konstanz DEUTSCHLAND» und «DE-78462 Konstanz», ohne `@wip`; die Zeilenstruktur prüft der Unit-Test. Rest: C-11.
- V-6: `anforderungen-vertragsende.md:34` korrigiert; Zeile 132 («bis A-5») gehört zu #114.
- Szenarien tenant-edit «Korrespondenz per Brief festlegen» und «Korrespondenzadresse im Ausland festlegen»: ohne `@wip`. Beide schlagen ohne die Änderung fehl (Test-ID `tenant-address` bzw. `tenant-country-select` fehlen).
- Screenplay-Schichten (auch die Schritte des nächsten Slice in `contract-detail.steps.ts`, `statement-detail.steps.ts`, `statement-generate.steps.ts`, `tenant-form.steps.ts`): Schritte rufen nur Tasks, Questions und `seed`; Questions liefern Texte; Features beschreiben die Absicht, nicht die Bedienung. Kein Verstoss gefunden.
- a11y/Sprachen: kein neuer Bildschirm und kein neuer Zustand (Hilfe und Auswahl stehen auf den bestehenden Seiten `tenant-new`/`tenant-edit`, die schon in `screens.json` sind). Ländernamen kommen über `Intl.DisplayNames` in der UI-Sprache.
- Tokens: `pb-2`, `text-ink-muted` sind zulässig; Bedienelemente aus `src/lib/ui`.

## Nicht bestätigt

- a11y-Suite (axe) auf `tenant-new`/`tenant-edit` nicht gestartet (E2E darf ich nicht starten). Ob axe C-1 als `duplicate-id-aria` meldet, hängt von der axe-Version ab; `node_modules` lag ausserhalb des Worktrees und war für mich gesperrt. Der Fehler in der Barrierefreiheit folgt aus dem Code (`Field.svelte` `helpId`).
- Vom Aufrufer gemeldet: Backend `bun test` 741 bestanden; `bun run type-check` sauber; Frontend `bunx vitest run` grün ausser 4 Tests des nächsten Slice, die nicht im Commit sind; `bun run lint` sauber; `bun run check` sauber; E2E chromium: tenant-new/edit/detail 19 bestanden, «Korrespondenzadresse im Ausland», «PDF erstellen und herunterladen», «Das PDF erklärt …» 4 bestanden.
- Selbst nachgeprüft: `bunx vitest run src/__tests__/tenant-form.test.ts src/__tests__/tenant-form-fields.dom.test.ts`, 15 bestanden.
- `api-contracts.pg.test.ts` gegen den neuen Vertrag `tenant.json` nicht selbst ausgeführt (steckt im gemeldeten Backend-Lauf).
- Verhalten der Schritte für #114 (nächster Slice) nur auf die Schichtregeln geprüft, wie verlangt.
