# Code-Review H-28 Mieterformular (#717), Runde 1

Bereich: `git diff 4cf42a24e ea853e00a` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree review-h28f-code bei ea853e00a.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| K-1 | Major | backend/src/services/tenant-fields.ts:30-32, tests/e2e/steps/tenant-form.steps.ts:82-83 | Die E2E-Vorbereitung «für {string} ist keine Korrespondenzadresse erfasst» sendet PUT mit Kanal `letter` und leerer Adresse. Das Backend lehnt das jetzt mit 400 ab, deshalb schlägt das Szenario statement-detail.feature:362 fehl. |
| K-2 | Minor | backend/src/services/tenant-fields.ts:37 | Bei einem PUT, das nur einen Teil der Felder sendet, ohne `country`, gilt das Land als CH, auch wenn der Mieter im Ausland wohnt. `PUT {postalCode: '78462'}` für einen Mieter in DE wird mit POSTAL_CODE_DIGITS abgelehnt (vor der Änderung angenommen). Der Unit-Test tenant-fields.test.ts:121 hält nur den CH-Fall fest. |
| K-3 | Minor | backend/src/services/tenant-fields.ts:25, docs/api-specification.md:88 | Die Kanalregel greift nur, wenn das Adressfeld im Body steht (`field in t`), auch bei POST: `POST {firstName, lastName, correspondenceChannel: 'email'}` ohne `email` legt den Mieter an (geprüft: `tenantFieldErrors` liefert `[]`). Die API-Spezifikation sagt für POST, dass E-Mail-Kanal eine E-Mail-Adresse verlangt. Das stimmt also nicht. Gleich bei PUT nur mit Kanal. Die App selbst sendet immer alle Felder. |
| K-4 | Minor | backend/src/services/tenant-fields.ts:18 | `blank` ist eine Kopie von `blank` in backend/src/services/building-fields.ts:11. Besser exportieren und wiederverwenden. |

## K-1 (Major): Szenario «Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse» bricht

**Warum falsch:** `tests/e2e/steps/tenant-form.steps.ts:83` ruft `seed.address(tenant, '', '', '', 'CH')` auf. `tests/e2e/fixtures/backend.ts:280` sendet daraus `PUT tenants/:id` mit `{ address: '', postalCode: '', city: '', country: 'CH', correspondenceChannel: 'letter' }`. `tenantFieldErrors` gibt dafür drei Fehler zurück (nachgeprüft mit `bun -e`: `TENANT_ADDRESS_LETTER`, `TENANT_POSTAL_CODE_LETTER`, `TENANT_CITY_LETTER`). Die Route antwortet deshalb mit 400, und `CallTheApi.put` wirft bei einer Antwort, die nicht ok ist (`tests/e2e/screenplay/abilities.ts:12`). Damit scheitert das Szenario `tests/e2e/features/statement-detail.feature:362` (#78) schon bei der Vorbereitung. Der Aufrufer hat nur die E2E-Features für Mieter und Gebäude laufen lassen, statement-detail nicht. CI wird rot.

**So zeigt man den Fehler:** `bun run test:e2e` für statement-detail.feature, Szenario «Der Zahlteil ohne Korrespondenzadresse …». Oder mit `tenantFieldErrors({ address: '', postalCode: '', city: '', country: 'CH', correspondenceChannel: 'letter' })` → 3 Fehler.

**Lösung:** Den Zustand ohne Korrespondenzadresse so vorbereiten, wie ihn die App jetzt erlaubt, zum Beispiel Kanal `email` mit E-Mail-Adresse und leerer Adresse. Das Szenario bleibt dabei gleich streng. Eine Prüfung des Teil-PUT reicht nicht. Ausserdem nach weiteren Fixtures suchen, die über die API ungültige Kombinationen senden. Gefunden habe ich nur diese; `noEmail`, `email`, `correspondence`, `buildingAddress` und `address` mit DE-Adresse bestehen die Prüfung.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen, nicht erneut ausgeführt (vom Aufrufer gemeldet): lint, check, Backend-type-check, fallow; vollständiges Backend-`bun test` (1517/1 mit Reihenfolge-Fehler in heating-distribution); tenant-fields.test.ts, tenant-channel.pg.test.ts, api-contracts.pg.test.ts, building.routes.pg.test.ts; `bunx vitest run` (3616, 6 Fehler in form-selects.dom.test.ts als Worktree-Artefakt); E2E tenant-new, tenant-edit, tenants, tenant-detail, building-new und building-edit (54 grün).
- Die Läufe, die rot waren («Seen red»), habe ich nur anhand der Tests gelesen: Alle neuen Backend-, BFF- und i18n-Tests scheitern ohne die Änderung. Der Name «… und ändert nichts» in tenant-channel.pg.test.ts:45 wird nicht geprüft; das Verhalten folgt aber aus dem frühen Return in routes/tenants.ts:138-142.
- Dass statement-detail.feature:362 wirklich rot ist: aus Code und `bun -e` abgeleitet, E2E nicht gestartet.

Geprüft: Codes und Texte in allen vier `messages/*.json` (gleiche Wortlaute; `tenants_error_email_invalid` und `buildings_error_postal_code_digits` werden in settings.ts noch verwendet); dass «ungültig ersetzt fehlend» dieselbe Reihenfolge der Felder ergibt wie der frühere Spread; dass der BFF immer den ganzen Body sendet (mit `country`); dass Demo-Daten über SQL kommen und keine andere App-Stelle PUT/POST auf Mieter aufruft; Verschiebung von `fieldsRefused`/`refusedFields` ohne Rest; Contract-Datei und Contract-Test; api-specification.md; dass das bisherige Verhalten durch E2E (tenant-new.feature:21, tenant-edit.feature:38) abgedeckt ist. Ponytail: neben K-4 nichts zu kürzen.
