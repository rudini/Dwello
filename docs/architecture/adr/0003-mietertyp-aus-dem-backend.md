# ADR 0003: Der Mietertyp des Frontends kommt aus dem Backend (Pilot B)

- **Status:** angenommen (Product Owner, 24.10.2026)
- **Szenario:** Ä1 «Neues Feld an einer Entität» (`docs/architecture/utility-tree.md`, H/H), Prinzip AP1 «Eine Form hat eine Quelle»
- **Phase:** 2b, Refactoring-Zyklus 3; Pilot für Kandidat B (Paar #2 `schema.ts` ↔ `src/lib/types.ts`, Baseline §4)

## Kontext

Nach ADR 0001 und 0002 stand die Mieter-Form im BFF noch an drei Stellen: im Mapper (`tenant.ts`), im Formular (`tenant-form.ts`) und im gemeinsamen Typ `src/lib/types.ts`. `types.ts` deklariert die Felder aller Entitäten von Hand («Match backend schema»). Laut Phase 0 ändert es sich 26-mal zusammen mit `schema.ts`, ohne dass eine der beiden Dateien die andere importiert. Ohne diese Handdeklarationen läge die Feldstreuung über alle Entitäten bei Median 5 und P90 18 statt 6 und 19.

Der Spike vom 24.10.2026 (Wegwerf-Worktree, nicht committet) zeigte zweierlei:

- **Machbar:** `import type` aus dem Backend löst `svelte-check` sauber auf, und die Fitness-Regel `boundary-import` erlaubt reine Typ-Importe.
- **Drei Hindernisse:**
  - Das Backend tippte `language` und `correspondenceChannel` nur als `string`; abgeleitet gingen die Wertelisten verloren.
  - Die Antwort von `GET /tenants/:id` hatte keinen Namen, sie entstand erst in der Route.
  - Teil-Mieter in Unit-Tests passten nicht zu einem strengeren Typ.

## Entscheidung

Der Frontend-Typ `Tenant` wird aus dem Backend abgeleitet und nicht mehr von Hand deklariert. Die Ableitung geht von der API-Form aus, nicht von der Tabelle (AP1).

1. `Language` (bisher in `pdf.service.ts`) und `CorrespondenceChannel` (bisher in `tenant-fields.ts`) ziehen nach `backend/src/db/schema.ts`. Die Mieter-Spalten tragen sie mit `$type`. Das ist ein reiner Typ ohne Migration. Der Sprachfilter der Liste bleibt `string`, damit eine unbekannte Sprache wie bisher niemanden findet.
2. `TenantResponse` in `tenant.service.ts` benennt die Antwort von `GET /tenants/:id`. Die Route prüft ihre Rückgabe mit `satisfies`, damit der Typ nicht vom Gesendeten abweichen kann.
3. `Tenant` in `src/lib/types.ts` ist `Json<TenantResponse>`:
   - Pflicht sind `id`, Namen und Sprache, alles andere ist optional.
   - Ohne die Felder, die nur das Backend braucht.
   - `Omit` statt Aufzählung: Ein Feld, das das Backend ergänzt, kommt ohne Änderung im Frontend-Typ an. Genau das verlangt Ä1.
4. Die Listenzeile des Frontends hiess wie das Backend-Typ `TenantWithOccupancy` und hatte eine andere Form (Wohnung als Text, Start des künftigen Vertrags). fallow erkennt die Namensgleichheit jetzt, darum heisst sie `TenantListItem`.

Kein Verhalten ändert sich. Es ändern sich nur Typen und ein Typname.

## Schritte

| Schritt | Commit | Absicherung |
|---|---|---|
| 0 Spike, Messung vorher | – | Spike verworfen; `fitness`, `02-imports`/`05-knowledge`, 3638 Unit-Tests, Backend-Typprüfung, 51 Mieter-Backend-Tests; E2E vorher: grüne CI auf `main` |
| 1 Typen nach `schema.ts`, Spalten typisiert | bb052b9b | Backend 1562 Tests, Frontend 3638, E2E Mieter (22) |
| 2 `TenantResponse` mit `satisfies` | 62d75130 | Backend 1562 Tests, `api-contracts.pg.test.ts` |
| 3 `Tenant` abgeleitet, `TenantListItem` | e4b83c7e | `svelte-check` 0 Fehler, 3638 Unit-Tests, Build, E2E Mieter (30), fallow |
| 4 Messung nachher, `fitness --update` | dieser Commit | – |

In Schritt 1 machte der genauere Spaltentyp zwei Stellen rot: den Sprachfilter (`string`) und eine Testschleife über Sprachen. Beide sind nur im Typ angepasst (Cast im Vergleich, `as const`). In Schritt 3 blockierte das fallow-Gate den doppelten Exportnamen (siehe Punkt 4 der Entscheidung).

## Messergebnis

Gemessen mit `tools/arch-baseline/02-imports.ts` und `05-knowledge.ts` sowie `bun run fitness`, vorher auf bc30b2a7, nachher auf e4b83c7e:

| Messwert | Vorhersage | Vorher | Nachher |
|---|---|---|---|
| `tenants.firstName`, `lastName` | −1 | 15 | **14** |
| `tenants.language` | −1 | 21 | **20** |
| `tenants.correspondenceChannel` | −1 | 8 | **7** |
| Mieter-Spiegel unter `src/` | 3 → 2 | 3 | **2** |
| Entity-Spiegel gesamt | 55 → 54 | 55 | **54** |
| Sprachliste `de\|en\|fr\|it` | eine Quelle weniger | 5 Dateien | **4 Dateien** |
| Kanalliste `email\|letter` | nicht vorhergesagt | 4 Dateien | 4 (umgezogen; `types.ts` nennt sie noch bei der Abrechnung) |
| Frontend-Dateien mit Import aus dem Backend | nicht vorhergesagt | 0 | **1** (nur `import type`, gewollt nach AP1) |
| Feldstreuung Median / P90 / Max | unverändert | 6 / 19 / 60 | 6 / 19 / 60 |

Die Vorhersage traf zu.

Über die drei Zyklen zusammen ergibt sich:

- `tenants.firstName`/`lastName` 18 → 14
- `tenants.language` 23 → 20
- Mieter-Spiegel unter `src/` 5 → 2
- Entity-Spiegel 57 → 55 → 54

## Tradeoffs und verbleibende Risiken

- **Typprüfung länger:** `svelte-check` lädt jetzt Backend-Typen mit. Es prüft 4273 statt 3961 Dateien und braucht 34 s statt 31 s. Mit jeder weiteren Entität wächst das etwas; T1 (CI-Laufzeit) im Auge behalten.
- **Kopplung an den Backend-Code:** Ein Typfehler im Backend kann jetzt `bun run check` des Frontends rot machen. Das ist der Zweck, kann aber eine Frontend-Änderung blockieren, bis das Backend kompiliert.
- **Die API-Form steht noch nicht überall im Backend:** Andere Antworten entstehen weiter in den Routen ohne Namen. Jede weitere Entität braucht zuerst einen benannten Antworttyp mit `satisfies`.
- **Rest:** `src/lib/types.ts` nennt `email | letter` noch bei der Abrechnung (`tenantCorrespondenceChannel`). Das ist der nächste Kandidat derselben Art.

## Ausrollen und neue Ratchet-Schwellen

Die Ratchet ist mit `--update` nachgezogen:

- Entity-Spiegel 54 (vorher 55)
- Sprachliste 4 Dateien (vorher 5)

Mit allen Entitäten in `types.ts` würde die Feldstreuung laut Phase-0-Messung auf Median 5 und P90 18 sinken. Erst dann bewegen sich Median und P90, und erst dann lohnt es, ihre Schwellen zu senken. Jede Entität ist ein eigener Zyklus nach diesem Muster:

1. Wertelisten im Schema typisieren.
2. Den Antworttyp benennen und mit `satisfies` prüfen.
3. Den Frontend-Typ ableiten.
