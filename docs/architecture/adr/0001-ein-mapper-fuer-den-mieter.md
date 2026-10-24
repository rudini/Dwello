# ADR 0001: Ein Mapper für den Mieter im BFF

- **Status:** angenommen (Product Owner, 24.10.2026)
- **Szenario:** Ä1 «Neues Feld an einer Entität» (`docs/architecture/utility-tree.md`, H/H), Prinzip AP1 «Eine Form hat eine Quelle» (`principles.md`)
- **Phase:** 2b, Refactoring-Zyklus 1

## Kontext

Ä1 ist das H/H-Szenario mit Abstand zum Ziel, an dem ein reines Refactoring ansetzen kann. T1 braucht Änderungen an der CI, R1 und U1 brauchen neue Funktionen. Ziel für Ä1 ist eine Feldstreuung mit Median ≤ 4 und P90 ≤ 8; heute liegt sie bei 6 und 19.

Phase 0 misst, welche Dateien die Felder einer Tabelle von Hand nachbauen (`m4-entity-mirror-files.csv`). Für den Mieter waren es fünf Dateien unter `src/`. Der BFF hat einen Mapper `toTenant` in `src/lib/server/tenant.ts`, nur nutzten ihn die anderen Ladefunktionen nicht:

- `src/routes/tenants/+page.server.ts` kopierte 9 Felder samt eigener Normalisierung (`|| ''`, `|| null`, `|| 'de'`).
- `src/routes/contracts/new/+page.server.ts` deklarierte ein eigenes `interface Tenant` neben `$lib/types`.

`src/routes/contracts/[id]/+page.server.ts` kopiert die Felder ebenfalls. Die Datei ist ausgenommen, weil die Arbeit an #717 sie gleichzeitig umbaut (Entscheid des Product Owners, 24.10.2026).

## Entscheidung

Die Mieter-Form steht im BFF an einer Stelle: im Mapper `toTenant` und im Typ `Tenant` aus `$lib/types`.

- **Mieterliste:** übernimmt die Felder mit `...toTenant(t)` und ergänzt nur die Belegungsfelder (`currentApartment`, `isActive` …).
- **Neuer Mietvertrag:** nutzt den Typ `Tenant` statt einer eigenen Deklaration.

Es entsteht kein neues Modul, `tenant.ts` exportiert nur seinen Mapper. Fachlogik ist keine betroffen; der Mapper ist reine Integration («Integration dünn», IODA als Denkhilfe).

**Verhalten:** Sichtbar ändert sich nichts. Auf der Datenebene der Seite gibt es zwei Unterschiede, die der Product Owner am 24.10.2026 als «Verhalten unverändert» bestätigt hat:

- Eine Zeile der Mieterliste trägt zusätzlich `country`, `correspondenceChannel` und `anonymisableFrom`.
- Eine leere E-Mail oder Telefonnummer bleibt `''` statt `null`. Die Zeile (`TenantRow.svelte`) zeigt den Kontakt nur über `filter(Boolean)` und nutzt Adresse und Ort nicht.

## Schritte

| Schritt | Commit | Absicherung |
|---|---|---|
| 0 Messung vorher | – | `fitness`, `02-imports`/`05-knowledge`, 3637 Unit-Tests, E2E `tenants.feature` und `contract-new.feature` (47 grün) |
| 1+2 `toTenant` exportieren, Mieterliste darauf umstellen | 81e1c2e6 | Lint, Check, 3637 Unit-Tests, 47 E2E, `fitness`, fallow, deepcheck |
| 3 gemeinsamer Typ im neuen Mietvertrag | 4ced96bd | dieselben |
| 4 Messung nachher, `fitness --update` | dieser Commit | – |

Schritt 1 liess sich nicht allein committen: Das fallow-Gate lehnt einen ungenutzten Export ab. Vorbereitung und Umstellung bilden darum einen Commit. Eine unerwartete Rotphase gab es nicht; es musste auch kein Akzeptanztest angepasst werden.

## Messergebnis

Gemessen mit `tools/arch-baseline/02-imports.ts` und `05-knowledge.ts` sowie `bun run fitness`, vorher auf 61456591, nachher auf 4ced96bd:

| Messwert | Vorhersage | Vorher | Nachher |
|---|---|---|---|
| `tenants.firstName`, `tenants.lastName` (Produktivdateien ausserhalb der DB) | 18 → 16 | 18 | **16** |
| `tenants.language` | 23 → 22 | 23 | **22** |
| Mieter-Spiegel unter `src/` | 5 → 4 | 5 | **4** |
| Entity-Spiegel gesamt (Fitness) | 57 → 56 | 57 | **56** |
| Werteliste `de\|en\|fr\|it` | nicht vorhergesagt | 6 Dateien, darin der BFF | **5 Dateien, ohne BFF** |
| Feldstreuung Median / P90 / Max | unverändert | 6 / 19 / 60 | 6 / 19 / 60 |
| BFF-Entscheidungen, Zyklen, Grenzimporte | unverändert | 8 / 2 / 0 | 8 / 2 / 0 |

Die Vorhersage traf in allen Punkten zu. Dazu kam eine Verbesserung, die nicht vorhergesagt war: Mit dem Cast `as 'de' | 'fr' | 'it' | 'en'` in der Mieterliste verschwindet die Sprachliste aus dem BFF. Verschlechtert hat sich kein Messwert. Der Ratchet ist nachgezogen (`ratchet.json`: ein Mieter-Spiegel weniger, Sprachliste 6 → 5 Dateien).

Die History-Werte M1 (Änderungsumfang) und M2 (Co-Change) bewegen sich erst, wenn künftige Features den Mieter ändern. Sie werden mit der vierteljährlichen Messung von `run.sh` und der nächtlichen Co-Change-Warnung nachgeprüft.

## Tradeoffs und verbleibende Risiken

- **Mehr Daten in der Liste:** Jede Mieterzeile trägt drei Felder mehr in die Seitendaten. Bei unter 50 Wohnungen ist das vernachlässigbar.
- **Gekoppelte Ladefunktionen:** Die Mieterliste hängt jetzt am Mapper der Detailseite. Ändert sich `toTenant`, ändern sich beide Seiten. Das ist gewollt (eine Quelle), braucht aber Tests auf beiden Seiten; sie bestehen (`tenant-detail.test.ts`, `tenant-list.test.ts`, `tenants.feature`).
- **Noch offen:** `src/routes/contracts/[id]/+page.server.ts` kopiert die Mieter-Felder weiterhin. Das ist der nächste Schritt, sobald #717 dort fertig ist.
- **Der grosse Hebel bleibt:** `src/lib/types.ts` deklariert die Felder aller Entitäten von Hand (Paar #2 `schema.ts` ↔ `types.ts`). Ein abgeleiteter API-Typ würde laut Messung Median 6 → 5 und P90 19 → 18 bringen (Kandidat B).

## Neue Ratchet-Schwellen

`tools/fitness/ratchet.json` ist mit `--update` nachgezogen:

- Entity-Spiegel: 56 (vorher 57)
- Sprachliste: 5 Dateien (vorher 6)

Die Schwellen für Median, P90 und Max der Feldstreuung bleiben bei 6 / 19 / 60, weil sich diese Werte nicht bewegt haben.
