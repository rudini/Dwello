# Code-Review #1149, Runde 1 (e294cff7c)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Blocker | src/routes/tenants/TenantRow.svelte:28, src/routes/tenants/+page.server.ts:41-43 | Die Liste zeigt jetzt «Wohnung Wohnung 2.01 · Ahornhof» («Appartement Appartement 3.01 · …» auf fr): der Load setzt «Wohnung» schon davor, `apartmentName` setzt es ein zweites Mal davor. Unit-Test und E2E-Schritt sehen das nicht. |
| C-2 | Major | src/__tests__/tenant-list.test.ts:55-57 | Der Test gibt der Zeile «2.01» und nicht das, was der Load liefert («Wohnung 2.01», festgehalten in `tenants-i18n.test.ts:46`). So kann er die Verdoppelung aus C-1 nicht zeigen. Seine Rotphase beweist nur, dass sich das Trennzeichen geändert hat. |

## C-1 (Blocker): «Wohnung» doppelt in der Mieterliste

Warum es falsch ist: Die Annahme des Aufrufers, «der Backend sendet nur die Nummer, darum fehlte "Wohnung"», stimmt nur für die API-Antwort. Der BFF-Load `src/routes/tenants/+page.server.ts:41-43` macht daraus schon `m.buildings_apartment_number({ number: … })`, also «Wohnung 2.01». Der Typkommentar `src/lib/types.ts:187` («the backend's apartment number in words») und `src/__tests__/tenants-i18n.test.ts:37-46` («nennt die Wohnung eines Mieters in der Liste auf Französisch», erwartet `'Appartement 3.01'`) halten das fest. Vor der Änderung zeigte die Zeile also «Wohnung 2.01 - Ahornhof» (der Basis-Test erwartete genau das). Jetzt ruft `TenantRow` `apartmentName(tenant.currentApartment, …)` auf. Das ist `` `${m.buildings_apartment_number({ number: unit })} · ${building}` `` (`src/lib/contract-form.ts:238-239`), und so wird die Ausgabe zu «Wohnung Wohnung 2.01 · Ahornhof», in allen vier Sprachen. Diesen Fehler sieht der Liegenschaftsverwalter bei jedem Mieter mit laufendem Vertrag.

So zeigt man, dass es fehlschlägt: Im E2E-Szenario «Aktuelle Wohnung des Mieters» den Text von `listedTenant` lesen, er enthält «Wohnung Wohnung 2.01 · Ahornhof». Der Schritt prüft nur `toContain('2.01 · ')` und bleibt darum grün. Oder in `tenant-list.test.ts` die Zeile mit `'Wohnung 2.01'` füttern, so wie es der Load tut: Die Erwartung «Wohnung 2.01 · Ahornhof» trifft dann nur noch als Teilstring zu, und `not.toContain('Wohnung Wohnung')` wird rot.

Behebung (die kürzere der beiden Möglichkeiten wählen): Entweder bleibt der Load beim Mapping, und die Zeile schreibt nur das Trennzeichen um (`` `${tenant.currentApartment} · ${tenant.currentBuilding}` ``). Oder der Load reicht die Nummer roh durch, und dann laufen `+page.server.ts:41-43`, der Typkommentar in `types.ts:187` und `tenants-i18n.test.ts:37-46` mit (der Sprachtest prüft dann die gerenderte Zeile). Die zweite Möglichkeit verwendet `apartmentName` wirklich wieder, ist aber ein grösserer Diff.

## C-2 (Major): Der Unit-Test prüft an einer Eingabe, die es im System nicht gibt

Warum es falsch ist: Die Änderung des Fixtures von `'Wohnung 2.01'` auf `'2.01'` stützt sich auf `tests/contracts/tenants.json`. Diese Datei beschreibt aber die Antwort des Backends, nicht die Props der Seite (`TenantListItem`, nach dem Load). Der Test gilt als Reproduktion des Fehlers, prüft aber eine Eingabe, die die Seite nie bekommt. Darum hat er die Verdoppelung aus C-1 verdeckt. `öffnet den Mieter über seinen Namen` (Zeile 49) gibt weiterhin `'Wohnung 2.01'`, die beiden Tests im selben File widersprechen sich also. Gefordert ist ein Test auf der tiefsten Ebene, der den ganzen Weg zeigt: Load-Ausgabe → Zeile (oder ein Fixture in der Form des Loads), mit einer Erwartung auf den ganzen Text der Zelle, nicht `toContain`.

So zeigt man, dass es fehlschlägt: siehe C-1, zweite Variante.

## Zur Frage nach dem E2E-Schritt

Die Lesart des Aufrufers hält. Der Schritt prüft wie zuvor «Nummer gefolgt vom Trennzeichen», nur mit dem Trennzeichen, das das Issue ändert. Weder der Text des Szenarios noch Background oder Header ändern sich, und die Strenge bleibt gleich (Teilstring vorher wie nachher). Das ist nach `tests/e2e/CLAUDE.md`, «Rules» («A step refactoring that checks the same is free»), keine Spec-Änderung und braucht kein `Spec change approved`. Er war schon vorher zu schwach, um ein doppeltes «Wohnung» zu sehen. Das ist keine Lockerung durch diesen Diff, bleibt aber der Grund, warum C-1 nur auf der Unit-Ebene nachgewiesen werden muss.

Zum Verzicht auf Personas: einverstanden, sobald C-1 behoben ist. Das Format ist das der Vertragsseiten (#668).

Ponytail: `TenantRow.svelte:28` ist mit `apartmentName` Wiederverwendung eines bestehenden Helfers und in Ordnung. Hängt man den Helfer aber an einen Wert, der schon gemappt ist, entsteht C-1. Sonst nichts zu kürzen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run fitness`: vom Aufrufer gemeldet.
- `bunx vitest run --changed origin/main` (25 Tests grün): vom Aufrufer gemeldet.
- E2E `tenants.feature` chromium (8 grün; Schritt vor der Änderung rot mit «2.01 - »): vom Aufrufer gemeldet.
- Axe- und Sprachzeilen `tenants` (6 grün, vor der Schrittänderung gelaufen): vom Aufrufer gemeldet.
- Prettier auf den geänderten Zeilen: vom Aufrufer gemeldet.
- Die gerenderte Ausgabe «Wohnung Wohnung 2.01 · Ahornhof» habe ich aus dem Code abgeleitet (`+page.server.ts:41-43`, `contract-form.ts:238-239`, `tenants-i18n.test.ts:46`), nicht ausgeführt.

Geprüft: `buildings_apartment_number` in allen vier `messages/*.json`; keine neuen Texte; keine weiteren Nutzer von `listedTenant` mit dem alten Trennzeichen; der Diff enthält nichts, was nicht zum Issue gehört.
