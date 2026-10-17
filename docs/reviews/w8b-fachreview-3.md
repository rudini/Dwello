# Fachreview W8b, Runde 3: Tankbestand-Prüfungen (nur Delta)

Gegenstand: `git diff 7e98aaa 76989a8` im Worktree `/tmp/claude-0/-home-user-Dwello/57f5a1ca-407e-5441-98f4-66ca786359d9/scratchpad/review-w8b-fach3` (Commit 76989a8). Geprüft: `periodReadings` (`backend/src/services/fuel-stock.service.ts`), `findingOf`/`changeFinding`/`stockFinding` (`backend/src/services/invoice-completeness.service.ts`), `CategoryCheck.svelte`, `CategoryFindingItem.svelte`, `findingText`/`changeText` (`src/lib/statement-wizard.ts`), die neuen pg-Proben, das neue Szenario, `messages/{de,fr,it,en}.json`, `docs/design/i18n-begriffe.md`, `docs/api-specification.md`.

## Stand der Befunde aus Runde 2

| ID | Stand |
|----|-------|
| V-11 (Major) | **Gelöst.** Nachgerechnet unter «Bestätigt». |
| V-12 (Minor) | **Gelöst** für den gemeldeten Fall (negativer Verbrauch jetzt, Einkauf im Vorjahr). Der umgekehrte Fall bleibt offen, ist aber schon auf dem Basis-Commit so (V-16). |
| V-13 (Nit) | **Gelöst.** |
| V-14 (Minor) | **Gelöst** (fr «sur la page de l’immeuble», it «nella pagina dell’immobile», en «on the building’s page»). |
| V-15 (Minor) | **Gelöst** (Zeile in `i18n-begriffe.md` mit Verweis auf #315, it «Indicare che non c’è un serbatoio: {name}»). |
| Persona Helga P-1 | **Gelöst.** Der Hilfetext ist in allen vier Sprachen richtig und stimmt mit dem Code überein. |

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-16 | Verwalter | Minor | Umgekehrter gemischter Fall (schon auf dem Basis-Commit so): Ist der Verbrauch im Vorjahr ≤ 0 und gibt es jetzt nur Einkauf, entsteht «CHF 1’000.00, 433 % weniger als im Vorjahr (CHF -300.00)» |
| V-17 | Verwalter | Nit | Bleibt Heizmaterial im stillgelegten Tank (Endbestand > 0), fragt Dwello jedes Jahr wieder nach dem Endbestand; «auch wenn er 0 ist» lässt diesen Fall offen |
| V-18 | Verwalter | Nit | Schon auf dem Basis-Commit so: Fehlt nur ein Tankbestand (Bestätigung nötig), heisst der Rahmen «Möglicherweise fehlen Rechnungen», obwohl keine Rechnung fehlt |

Keine Blocker, keine Major.

## Befunde

### V-16 (Minor): Vorjahr mit Verbrauch ≤ 0, jetzt nur Einkauf

**Beleg.** `invoice-completeness.service.ts`, `changeFinding`:
```ts
const tank = stockNow && stockBefore;
if (stockNow && base.current.total <= 0) return null;
if (tank && base.previous.total <= 0) return null;
```
`findingOf` fängt nur `previous.total === 0` ab. Mit `stockBefore = true`, `stockNow = false` und einer negativen Vorjahressumme gibt es keine Sperre. `changeText` nimmt den Betrag des Prozentwerts (`Math.abs(percent)`) und wählt «weniger», weil der Prozentwert negativ ist.

**Nachgerechnet.** 2023: Anfang 100, Endbestand 400, keine Lieferung, also Verbrauch −300 (der Hinweis wurde damals nicht befolgt). 2024: Rechnung über 1000 in der gleichen Kategorie, kein Endbestand 2024 erfasst. `change` = 1000 − (−300) = 1300. |1300| ≥ 100, und 1300 ≤ −75 ist falsch, also gibt es einen Hinweis. `changePercent` = round(1300 / −300 × 100) = −433. Text: «CHF 1’000.00, 433 % weniger als im Vorjahr (CHF -300.00). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.» Die Kosten sind gestiegen, der Text sagt «weniger».

**Warum Minor.** Es braucht einen nicht korrigierten Tippfehler im Vorjahr. Auf 7e98aaa ist es gleich (dort ist `tank` dann falsch und es gibt keine Sperre). Das Delta macht es nicht sichtbarer. Nach den Regeln in CLAUDE.md geht es nicht unter «Blocked on me».

**Was es behebt.** Symmetrisch zu V-12: `if ((stockNow && base.current.total <= 0) || (stockBefore && base.previous.total <= 0)) return null;`. Allgemeiner: Bei `previous.total < 0` nie einen Prozentwert bilden. Eine pg-Probe mit den Zahlen oben gehört dazu.

### V-17 (Nit): Restbestand im stillgelegten Tank

**Beleg.** `fuel-stock.service.ts:42`: `|| Number(opening?.amount) > 0`. Der Hilfetext sagt «… den Endbestand …, auch wenn er 0 ist». Das heisst, er darf auch über 0 sein.

**Nachgerechnet.** Stilllegung 2024, Endbestand per 31.12.2024 = 300 (Öl bleibt im Tank). Periode 2025: Anfang 300 > 0, also gilt `covered`. Es folgt der Befund «Tankbestand am 31.12.2025 fehlt.» mit Bestätigung. Erfasst der Vermieter 300 per 31.12.2025, ist der Verbrauch 300 + 0 − 300 = 0 (richtig), aber 2026 wiederholt sich das. Das ist der Zustand von V-11, nur mit Restbestand.

**Warum nur Nit.** In der Praxis wird ein Tank bei der Stilllegung geleert. Das Restöl geht zurück an den Lieferanten oder wird verkauft, und das ist Sache des Vermieters, nicht der Nebenkosten. Der Endbestand ist dann 0. Ob das Leeren Pflicht ist, habe ich nicht belegt (**unsicher**, siehe «Nicht bestätigt»).

**Was es behebt (nur ein Satz).** Den Hilfetext schärfen, etwa «… den Endbestand am letzten Tag der Abrechnungsperiode, nach dem Leeren des Tanks also 0, …». Am Code muss sich nichts ändern.

### V-18 (Nit): Rahmentitel, wenn nur ein Tankbestand fehlt

**Beleg.** `CategoryCheck.svelte:33-39`: `confirm ? m.statements_maybe_missing_title() : …`. `confirm` kommt aus `PreviewChecks.svelte:83` (`incomplete.length > 0`), und `statement-wizard.ts:250` zählt `stock` dazu. Ist der einzige Befund «Tankbestand am 31.12.2024 fehlt.», steht darüber «Möglicherweise fehlen Rechnungen». Darunter stimmt der Text («Erfassen oder prüfen Sie die Tankbestände – oder bestätigen Sie unten …»).

**Warum.** Der Titel nennt eine Ursache, die es nicht gibt. Das ist schon auf 7e98aaa so. Das Delta fasst die Titel-Logik an, ändert aber diesen Zweig nicht.

**Was es behebt.** `confirm && invoicesMissing` → «Möglicherweise fehlen Rechnungen», sonst bei `confirm` «Tankbestände prüfen».

## Bestätigt

- **V-11, neue Regel `covered` = Ablesung nach dem Tag vor Periodenbeginn oder Anfangsbestand > 0** (`on()` sucht die Ablesung genau an dem Tag):
  - (a) 2023-12-31 = 800, «Kein Tank», Periode 2024: Anfang 800 > 0, also `covered`. Der Befund «Tankbestand am 31.12.2024 fehlt.» bleibt (Szenario «Im Jahr der Stilllegung braucht es noch den Endbestand»). Richtig nach VMWG Art. 5 Abs. 2 lit. a (Wortlaut aus Runde 1: «die Brennstoffe und die Energie, die verbraucht wurden»).
  - (b) Dazu 2024-12-31 = 0, Periode 2025: keine Ablesung > 2024-12-31, Anfang `Number("0.00")` = 0, also nicht `covered`. Kein Befund, keine Tankfrage. Abgerechnet wird nur der Einkauf (keiner). Richtig. Die pg-Probe «verlangt nach dem Jahr der Stilllegung keinen Tankbestand mehr» und das Szenario «Nach dem Jahr der Stilllegung …» (2022-12-31 = 800, 2023-12-31 = 0, Periode 2024) prüfen genau das.
  - (c) Stilllegung mitten im Jahr, 2023-12-31 = 800, 2024-06-30 = 0, Periode 2024: `covered`, der Endbestand 31.12.2024 wird verlangt (so sagt es der Hilfetext jetzt ausdrücklich). Periode 2025: keine Ablesung am 31.12.2024 (`Number(undefined) > 0` ist falsch), keine danach, also frei. Richtig.
  - (d) Randfall Neubefüllung: 2024-12-31 = 0, Lieferung und Ablesung 2025-06-30 = 500: Periode 2025 ist `covered` (Ablesung nach dem Tag vor Beginn), Endbestand verlangt. Richtig.
  - (e) Eine frühere Periode neu abgerechnet (2023, Ablesungen 2022-12-31 und 2023-12-31 = 0): `covered` durch die Ablesung nach 2022-12-31. Richtig, 2023 hatte noch Verbrauch.
  - Kommentar in `0011_building_no_tank.sql` und JSDoc von `periodReadings` stimmen mit dem Code überein. Die Migration ändert nur einen Kommentar, kein DDL.
- **V-12** (pg-Probe «vergleicht einen negativen Verbrauch nicht mit dem Einkauf des Vorjahres»): 2024: 100 + 0 − 400 = −300, `stockNow` gilt, die Summe ist ≤ 0, also kein Vergleich. Es bleibt nur `stockFinding` → `consumption` («Der Endbestand ist CHF 300.00 höher …»). Das Vorjahr 2023 hat keinen Anfangsbestand 2022-12-31, also nur den Einkauf von 1000. Erwartung `['consumption']` richtig. Randfall Verbrauch genau 0 gegen Einkauf 1000: kein Hinweis, gleich wie bei Tank in beiden Jahren (V-2). Vertretbar. Randfall Verbrauch 800 gegen Einkauf 3000 im ersten Jahr mit Beständen: der Hinweis «73 % weniger» bleibt als `deviation`. Er ist sinnvoll; der Rat zum Leistungszeitraum ist der bekannte V-9.
- **V-13**: `compared` ist nur wahr, wenn es einen Befund ausser `stock`/`consumption` gibt. Auch `consumption` mit `changePercent` («Verbrauch …, 100 % mehr als im Vorjahr (…). Prüfen Sie die Tankbestände.») steht unter «Tankbestände prüfen». Der Text nennt das Vorjahr selbst und rät zu den Tankbeständen, das passt. Die DOM-Probe prüft Titel und das Fehlen des Einleitungssatzes. Dass ein negativer Verbrauch keine Bestätigung braucht, ist die Entscheidung aus #73 (beim Product Owner, nicht hier).
- **Helga P-1, Hilfetext** «Im Jahr der Stilllegung erfassen Sie zuerst auf der Seite des Gebäudes den Endbestand am letzten Tag der Abrechnungsperiode, auch wenn er 0 ist, und setzen dann das Häkchen.»:
  - «am letzten Tag der Abrechnungsperiode» entspricht dem Endbestand nach `UBIQUITOUS_LANGUAGE.md` (Stichtag: «der an ihrem letzten Tag Endbestand») und `on(periodEnd)`. Eine Ablesung am Tag der Stilllegung genügt nicht, Fall (c).
  - «auf der Seite des Gebäudes»: `FuelStocks` steht auf `/buildings/[id]` unabhängig von `noTank` (`+page.svelte:75`). Die Reihenfolge «zuerst … dann» braucht der Code nicht, sie schadet aber nicht und führt den Vermieter.
  - Es gibt keine Sperre gegen ein künftiges Stichtagsdatum. Wer mitten im Jahr umstellt, kann den Endbestand gleich erfassen.
  - fr «au dernier jour de la période de décompte … puis cochez la case», it «all’ultimo giorno del periodo di conteggio … e poi metta la crocetta», en «on the last day of the billing period … and then tick the box»: Die Begriffe stimmen mit `i18n-begriffe.md:57` (Abrechnungsperiode) überein, der Inhalt ist vollständig.
- **V-14/V-15**: Wortwahl wie in Runde 2 vorgeschlagen. «citerne désaffectée» / «serbatoio dismesso» passen im Genus zu den Fakten.
- **API-Spezifikation**: Die neue Beschreibung von `stock`/`tank`/`consumption` entspricht `stockFinding`, `tankQuestion` und `changeFinding`.
- **Begriffe**: Das Delta bringt keine neuen Fachbegriffe. «Kein Tank / stillgelegt» und «Verbrauch» bleiben im Glossar offen (#315 bzw. das Issue aus Runde 1).

## Nicht bestätigt

- Die pg-Proben und das Szenario habe ich nicht ausgeführt: Der Worktree greift für `node_modules` auf `/home/user/Dwello` zu, und das ist mir gesperrt. Die Ergebnisse oben sind aus dem Code nachgerechnet (`fuel-stock.service.ts:36-44`, `invoice-completeness.service.ts:129-160, 223-251`, `statement-wizard.ts:160-194`). Laut Aufrufer waren beide Proben vor dem Fix rot.
- V-17: Ob ein stillgelegter Heizöltank in der Schweiz geleert werden muss, habe ich nicht mit Quelle belegt. `mmx search` fand nur Seiten der Kantone (SZ, AG, BE, ZH) und den Hinweis auf die GSchV, ohne den Wortlaut zu einer Leerungspflicht bei der Stilllegung. **unsicher**.
- Neue Rechtsaussagen bringt das Delta nicht. Für VMWG Art. 5 Abs. 2 lit. a gilt der Fedlex-Wortlaut aus Runde 1.
- Layout und Wirkung des Hilfetextes im Browser habe ich nicht gesehen. Das ist Sache der Personas.
