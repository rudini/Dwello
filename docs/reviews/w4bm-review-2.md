# Code-Review W4b-Mietstatus, Runde 2 (9867187..e39481c)

Worktree: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/review-w4bm-code2` (detached, e39481c). Ich habe alle 32 Dateien der Delta gelesen, dazu `ContractWizard.svelte`, `contract-wizard.ts` (`apartmentChoices`), `apartment-detail.feature`, `dashboard.feature`, `dashboard.steps.ts` und `drift()` in `api-contracts.pg.test.ts`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | erledigt | `contracts/[id]/+page.server.ts:154-159`, `DeleteContract.svelte:43-49` | Kann Dwello die Abrechnungen nicht laden, ist `billedBy` jetzt `null`. Der Satz «keine Nebenkostenabrechnung» erscheint nur noch bei `billedBy !== null`. Ein Unit-Test und ein DOM-Test prüfen das. Beide wären auf dem alten Code rot gewesen: `[]` statt `null`, und `null.length` wirft |
| C-9 | Major | `ApartmentFacts.svelte:42`, `BuildingFigures.svelte:62`; `apartment-detail.feature:26-30`, `dashboard.feature:15-20` | Zwei sichtbare Änderungen haben kein Szenario: Der Nebenkosten-Hinweis steht jetzt auf der Seite jeder leeren Wohnung (P-3). Auf der Übersicht erscheint er auch dann, wenn nur nie vermietete Wohnungen leer sind (P-1). Die zweite Änderung prüft auch kein Unit- oder DOM-Test |
| C-10 | Minor | `src/routes/contracts/new/+page.server.ts:61`, `+page.svelte:8`, `src/__tests__/contract-new-load.test.ts:40-61` | ponytail `delete:` Der Assistent zeigt das Feld `status` nirgends an. `apartmentChoices` und `apartmentOption` lesen nur `unit`, `building` und `size`, in `contracts/new/*.svelte` und `contract-wizard.ts` liest niemand `.status`. Mein C-4 aus Runde 1 war deshalb gegenstandslos: Die Änderung und ihr neuer Test prüfen einen Wert, den der Verwalter nie sieht. Ersatz: `status` aus der `load` und aus dem Seitentyp streichen, den Test löschen. net: etwa -25 Zeilen |
| C-11 | Minor | `docs/design/personas/anna-w4b-mietstatus.md` (P-3), `implementation_plan.md:15` | P-3 nennt auch Wohnung 3.02 («Vermietet ab 01.01.2027»): Wer zahlt die Nebenkosten bis zum Einzug? Behoben ist nur der Fall `vacant`. Der Plan meldet P-3 trotzdem als «fixed». Den Teil zu «Vermietet ab» beheben oder mit Grund ablehnen (neuer Text, vermutlich Sache des Fach-Reviews) |
| C-12 | Nit | `tests/contracts/apartments.json:10-13` | Der Beispieldatensatz widerspricht sich: `status: "vacant"`, aber zugleich `currentContractEnd` und `nextContractStart`. `drift()` vergleicht nur die Typen, deshalb geht das durch. Es verwirrt aber Leser und Tests, die `apartments[0]` übernehmen (der Helfer in `dashboard.test.ts:8-17` überschreibt die Felder deshalb) |
| C-13 | Nit | `implementation_plan.md:17` | Die Anführungszeichen passen nicht zusammen: `«Wohnung {Nr} leer"` |

ponytail-review: C-10 (delete, etwa -25 Zeilen). Sonst schlank:
- `apartmentFields` ersetzt zwei gleiche Select-Listen.
- `historyPeriod` ersetzt zwei gleiche Aufrufe mit vier Argumenten.
- `startedNotes` macht aus vier `{#if}` eine Liste.
- `reletParts` sortiert nicht mehr doppelt (C-6).

net: -25 Zeilen möglich.

## C-9 (Major): Hinweis bei nie vermieteten leeren Wohnungen ohne Szenario

**Was fehlt.** Es geht um zwei Änderungen, die der Verwalter sieht.

1. **Seite einer leeren Wohnung (P-3).** `ApartmentFacts.svelte:42` zeigt «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.» jetzt bei jeder leeren Wohnung, also auch bei einer, die nie vermietet war. Vorher stand der Satz dort nicht.
   - Abgedeckt ist das nur durch einen DOM-Test (`apartments-pages.dom.test.ts:329-332`).
   - Das bestehende Szenario «Leere Wohnung» (`apartment-detail.feature:26-30`) prüft den Hinweis nicht.
2. **Übersicht (P-1).** Der Hinweis `occupancy-vacancy-help` erscheint jetzt, sobald irgendeine Wohnung leer ist (`anyVacant`), auch wenn keine davon einen Mietvertrag hatte.
   - Das Szenario «Belegung pro Gebäude» (`dashboard.feature:15-20`) prüft die Zeile «Wohnung 1.02 leer», aber nicht den Hinweis.
   - Auch der Seitentest (`dashboard-page.test.ts:152-168`) prüft den Hinweis nur zusammen mit einer Wohnung, die ein Datum hat.

CLAUDE.md, Workflow 1, verlangt für jede sichtbare Verhaltensänderung ein Szenario.

**Wie es sich zeigt.** Zwei Mutationen:
- In `BuildingFigures.svelte:62` `anyVacant` auf `b.vacant?.some((v) => v.lastContractEnd)` zurückstellen: Alle Unit-, DOM- und E2E-Tests bleiben grün. Das Verhalten aus P-1 kann also unbemerkt verschwinden.
- In `ApartmentFacts.svelte:42` wieder `&& apartment.lastContractEnd` einsetzen: Nur der DOM-Test wird rot, kein Szenario.

**Behebung (Vorschlag).** Je einen Schritt an bestehende Szenarien anhängen; die Schritte gibt es schon:
- an «Leere Wohnung»: `Und erklärt die Wohnungsseite beim Mietstatus "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."`
- an «Belegung pro Gebäude»: `Und erklärt die Belegung "Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter."`

Dazu im Seitentest einen Fall, in dem nur `{ lastContractEnd: null }` leer ist.

## Anforderungen: Abgleich der Delta

- **C-1:** bestätigt (siehe Tabelle). Der Dialog eines beendeten Mietvertrags mit geladenen, leeren Abrechnungen sagt weiter «keine» (`ended && billedBy` mit `[]` ist wahr; der bestehende DOM-Test bleibt grün).
- **Persona Anna P-1:** bestätigt.
  - `dashboard/+page.server.ts:133-138` gibt jede Wohnung im Status `vacant` weiter, mit `lastContractEnd` oder `null`.
  - `BuildingFigures.svelte:53-58` zeigt dafür «Wohnung {Nr} leer» bzw. «… leer seit {Datum}». Gesperrte Wohnungen bleiben aussen vor (bestehender Fall b3 im Test).
  - Tests: `dashboard.test.ts`, `dashboard-page.test.ts` und E2E «Belegung pro Gebäude». Der Schritt ist vor der Änderung rot, weil 1.02 nie vermietet war.
  - Neuer Schlüssel `dashboard_vacant` in allen vier `messages/*.json`.
  - Den Hinweis deckt kein Test ab (C-9).
- **P-3:** Für `vacant` ist der Code geändert und ein DOM-Test vorhanden. Es fehlt das Szenario (C-9), und der Teil zu «Vermietet ab» ist offen (C-11).
- **C-2:** bestätigt. `apartment.test.ts` (Wohnungsliste) und `building-actions.test.ts` prüfen `lastContractEnd` im Mapper.
- **C-3:** bestätigt.
  - `tests/contracts/apartments.json` ist neu und steht in der README.
  - `api-contracts.pg.test.ts:259-262` prüft ihn gegen `GET /apartments`. Bei der Mietpartei sind die drei Datumsfelder `null`; `drift()` prüft dann nur, dass die Schlüssel vorhanden sind.
  - `dashboard.test.ts` liest den Contract.
- **C-4:** Der Code ist geändert und getestet, aber ohne Wirkung (C-10).
- **C-5:** h3 jetzt `text-lg font-semibold`. **C-6:** Es wird nur noch in `reletStarts` sortiert. Alle Aufrufer von `reletParts` bekommen ihre Daten über `reletStarts` (Gebäudeliste, Gebäudeseite, Übersicht).
- **C-8:** Der Kommentar ist angepasst.
- **Fallow-Refactor:**
  - `apartmentFields` enthält genau die bisherigen Felder; `getApartment` ergänzt die drei Adressfelder.
  - `historyPeriod` übergibt dieselben Argumente wie vorher.
  - `startedNotes` gibt dieselben Absätze in derselben Reihenfolge aus (Ausnahme: C-1).
  - Keine Verhaltensänderung gefunden.
- **Rote Tests (nach Lesen):** Jeder neue Test wäre auf 9867187 rot gewesen. Ausnahme: der Test in `contract-new-load.test.ts`; er prüft einen Wert ohne Anzeige (C-10).
- **Screenplay:** Der neue Schritt nutzt den bestehenden Schritt und seine Question (`occupancyText`, Text mit `toContain`). Das Feature nennt keine UI-Elemente.
- **a11y/Sprachen:** Es gibt keinen neuen Bildschirmzustand, nur einen neuen Text in einer bestehenden Zeile. Der Schlüssel steht in allen vier Sprachen.

## Nicht bestätigt

Erneut ausgeführt habe ich: `bunx vitest run` für dashboard-page, dashboard, contract-actions, contract-detail-page.dom, apartment, contract-new-load, apartments-pages.dom und building-actions. Ergebnis: 174 bestanden.

Vom Aufrufer gemeldet, nicht erneut ausgeführt:
- `bun run lint` und `bun run check`
- `bunx vitest run` komplett (2714)
- Backend type-check sowie `apartment-status.pg` und `api-contracts.pg` (31)
- E2E chromium für dashboard, apartment-detail, contract-detail und contract-new (96). Gelaufen vor dem Fallow-Refactor; dass der Refactor das Verhalten nicht ändert, habe ich nur durch Lesen geprüft
- Fallow-Audit

Ausserdem:
- Kein seitliches Scrollen bei 390 px, wenn in einem Gebäude viele Wohnungen leer sind (lange Zeile «Wohnung … leer, Wohnung … leer, …»). Die Zeile bricht über `flex-wrap` um; gemessen habe ich das nicht.
- Die Persona Anna hat «Wohnung {Nr} leer» noch nicht erneut geprüft (laut Plan, Zeile 17, offen).
- Übersetzungen von `dashboard_vacant` habe ich nur gegen das bestehende `dashboard_vacant_since` gelesen.
