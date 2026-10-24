# ADR 0002: Der Mieter des Mietvertrags über `toTenant`

- **Status:** angenommen (Product Owner, 24.10.2026)
- **Szenario:** Ä1 «Neues Feld an einer Entität» (`docs/architecture/utility-tree.md`, H/H), Prinzip AP1 «Eine Form hat eine Quelle»
- **Phase:** 2b, Refactoring-Zyklus 2; Folge von ADR 0001

## Kontext

ADR 0001 hat die Mieterliste und den neuen Mietvertrag auf den Mapper `toTenant` umgestellt. Die dritte Kopie stand in `src/routes/contracts/[id]/+page.server.ts`. Dort baute `toContract()` den Mieter mit `filled(data.tenant, { id, firstName: '', lastName: '', email: null, phone: null, language: 'de' })` nach. Sie war in Zyklus 1 ausgenommen, weil die Arbeit an #717 die Datei umbaute. #717 ist inzwischen geschlossen.

## Entscheidung

`toContract()` nimmt den Mieter aus `toTenant(data.tenant)`.

Der Rückfall für einen fehlenden Mieterdatensatz fällt weg. Er ist nicht erreichbar: `rental_contracts.tenant_id` ist NOT NULL mit Fremdschlüssel `restrict`, und `getContract` verbindet den Mieter immer mit. Das hat der Product Owner am 24.10.2026 bestätigt.

Sichtbar ändert sich nichts. Die Seite (`ContractParties.svelte`) nutzt vom Mieter `id`, Vor- und Nachname, E-Mail und Telefon, E-Mail und Telefon nur über `{#if}`. Eine leere E-Mail bleibt `''` statt `null`; das ist dieselbe Art Änderung, die ADR 0001 als «Verhalten unverändert» festhält.

## Schritte

| Schritt | Commit | Absicherung |
|---|---|---|
| 0 Messung vorher | – | `fitness`, `02-imports`/`05-knowledge`, 3638 Unit-Tests, E2E `contract-detail.feature` und `contract-edit.feature` (96 grün) |
| 1, erster Versuch | zurückgenommen | 6 Unit-Tests rot (siehe unten) |
| 0b Test-Stubs auf den API-Vertrag | b51c4b0d | 3638 Unit-Tests vorher und nachher grün |
| 1 `tenant: toTenant(data.tenant)` | 9e65d4a3 | Lint, Check, 3638 Unit-Tests, 96 E2E, `fitness`, fallow, deepcheck |
| 2 Messung nachher, `fitness --update` | dieser Commit | – |

**Rotphase und Befund:** Beim ersten Versuch von Schritt 1 schlugen sechs Tests in `src/__tests__/contract-actions.test.ts` fehl (`TypeError: Cannot read properties of undefined (reading 'id')`). Der Schritt wurde zurückgenommen (Grundregel 2).

Die Ursache: Die Test-Stubs beantworteten `GET /contracts/:id` ohne den Mieter, den das Backend immer mitliefert. Sie verliessen sich damit auf den Rückfall in `toContract()`. Kein Akzeptanztest war betroffen. Die Kopplung lag in den Unit-Test-Stubs, die eine Antwort fütterten, die das Backend nie gibt.

Mit Freigabe des Product Owners nehmen die Stubs den Mieter jetzt aus `tests/contracts/contract.json`. So verlangt es `CLAUDE.md` für Backend-Antworten in Frontend-Tests. Erst danach lief Schritt 1 grün durch.

## Messergebnis

Gemessen mit `tools/arch-baseline/02-imports.ts` und `05-knowledge.ts` sowie `bun run fitness`, vorher auf ddce6ae6, nachher auf 9e65d4a3:

| Messwert | Vorhersage | Vorher | Nachher |
|---|---|---|---|
| `tenants.firstName`, `tenants.lastName` | 16 → 15 | 16 | **15** |
| `tenants.language` | 22 → 21 | 22 | **21** |
| Mieter-Spiegel unter `src/` | 4 → 3 | 4 | **3** |
| Entity-Spiegel gesamt (Fitness) | 56 → 55 | 56 | **55** |
| Feldstreuung Median / P90 / Max | unverändert | 6 / 19 / 60 | 6 / 19 / 60 |
| Wertelisten, BFF-Entscheidungen, Zyklen, Grenzimporte | unverändert | 14 / 8 / 2 / 0 | 14 / 8 / 2 / 0 |

Die Vorhersage traf in allen Punkten zu, ohne unerwartete Verbesserung oder Verschlechterung.

Über beide Zyklen zusammen ergibt sich:

- `tenants.firstName`/`lastName` 18 → 15
- `tenants.language` 23 → 21
- Mieter-Spiegel unter `src/` 5 → 3
- Entity-Spiegel 57 → 55

## Tradeoffs und verbleibende Risiken

- **Kein Rückfall mehr:** Liefert das Backend je einen Vertrag ohne Mieter, scheitert die Ladefunktion mit einem Fehler statt einen leeren Namen zu zeigen. Ein solcher Vertrag widerspräche dem Schema; der Fehler würde ihn sichtbar machen statt ihn zu verdecken.
- **Vier Seiten an einem Mapper:** Mieterliste, Mieterdetail, Mieter bearbeiten (über `loadTenant`) und Vertragsdetail hängen jetzt an `toTenant`. Ändert er sich, ändern sich alle vier; ihre Tests decken das ab.
- **Rest im BFF:** Die drei verbleibenden Mieter-Spiegel sind der Mapper selbst (`tenant.ts`), das Formular (`tenant-form.ts`) und der gemeinsame Typ (`types.ts`). Weiter senkt sie nur ein aus dem Backend abgeleiteter Typ (Kandidat B, Paar #2 `schema.ts` ↔ `types.ts`).

## Neue Ratchet-Schwellen

`tools/fitness/ratchet.json` ist mit `--update` nachgezogen: Entity-Spiegel 55 (vorher 56; der Eintrag `contracts/[id]` unter `tenants` entfällt). Die Feldstreuung bleibt bei 6 / 19 / 60.
