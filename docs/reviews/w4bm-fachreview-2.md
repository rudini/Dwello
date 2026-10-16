# Fachreview W4b-Mietstatus, Runde 2 (Umsetzung)

Gegenstand: `git diff b3ff5d3 e2ca0f2 -- messages docs src/routes src/lib backend/src/services` sowie die dazugehörigen Tests (`backend/src/__tests__/tenant-status.pg.test.ts`, `apartment-status.pg.test.ts`, `src/__tests__/tenant-detail.test.ts`, `tests/e2e/features/*.feature`). Gelesen im Worktree `review-w4bm-fach` (detached, e2ca0f2).
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/anforderungen-vertragsende.md`, `docs/design/i18n-begriffe.md`, `messages/{de,fr,it,en}.json`. Die Fedlex-Zitate stammen aus Runde 1 (`docs/reviews/w4bm-fachreview-1.md`). Diese Runde bringt keine neue Rechtsaussage.

Ergebnis: kein Blocker, kein Major. V-2, V-3 und V-6 aus Runde 1 sind beantwortet, V-3 im Code und im Test. Im Glossar ist V-3 noch offen, das entscheidet der Product Owner. Neu sind nur zwei Nits.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-2 | Verwalter | erledigt | «in Dwello» ergänzt, Satz steht vor dem Hinweis auf fehlende Abrechnungen |
| V-3 | Verwalter | erledigt (Code), Glossar offen | Beendeter und künftiger Vertrag = «Künftig», durch `*.pg.test.ts` belegt; der Glossarsatz ist weiterhin doppeldeutig (#140) |
| V-6 | Verwalter | erledigt | `i18n-begriffe.md` Zeile 19 nachgeführt, ❓ bei «re-let» entfernt, Zeile Mieterstatus neu, Glossar- und Legendentext in allen vier Sprachen ohne «Wiedervermietet» |
| V-9 | Verwalter | Nit | it `apartments_vacancy_costs_help` schreibt «a Suo carico» gross, die Texte daneben schreiben das Possessiv klein |
| V-10 | Verwalter | Nit | fr «Futur» als Kennzeichen eines Mieters ist verständlich, «À venir» wäre für die Romandie natürlicher; entschieden ist «futur» in `i18n-begriffe.md`, darum nur ein Hinweis |

## Bestätigt

- **V-2 beantwortet.** `messages/de.json` `contracts_delete_no_statements`: «Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.» `DeleteContract.svelte` zeigt den Satz nur für einen beendeten Vertrag (`{#if ended}`) und vor `contracts_delete_missing_statements`. So liest sich «gibt es in Dwello keine … / fehlen noch …» als Folge und nicht als Widerspruch. Das Szenario `contract-detail.feature` «Löschdialog eines beendeten Mietvertrags ohne Abrechnung» prüft den neuen Wortlaut und hat kein `@wip` mehr. fr/it/en sagen dasselbe («dans Dwello», «in Dwello», «in Dwello»). `docs/anforderungen-vertragsende.md` A-8 nennt den Text und verweist auf V-2.
- **Löschdialog mit Abrechnungen (A-8 Punkt 3).** `contracts_delete_billed` endet in allen vier Sprachen mit «:», die Nummernliste `{numbers}` ist weg. Danach folgt pro Abrechnung ein Link `/statements/{id}` mit Nummer und Status (Entwurf/versendet/bezahlt). Das erfüllt «verlinkt jede Abrechnung mit ihrem Status» (`anforderungen-vertragsende.md` A-8, «Umgesetzt»). Die Regel «kein Löschen mit Abrechnung» (#116) bleibt unverändert.
- **V-3 beantwortet (Mieterstatus).** `backend/src/services/tenant.service.ts`:
  - aktiv = `start_date <= heute` und (`end_date` leer oder `>= heute`): Ein Vertrag läuft heute. Der Vertragsende-Tag zählt mit, wie beim Mietstatus der Wohnung (Vertragsende = letzter Tag des Mietverhältnisses, `UBIQUITOUS_LANGUAGE.md` «Vertragsende»).
  - künftig = nicht aktiv und ein Vertrag mit `start_date > heute`. Beendete Verträge zählen nicht.
  - ehemalig = hat Verträge, nicht aktiv, keiner später.
  - ohne Vertrag: kein Status.

  Die drei Status schliessen sich gegenseitig aus und decken jeden Mieter mit Vertrag ab, das ist nachgeprüft. Es gibt drei Fälle mit Verträgen: einer läuft heute (aktiv), keiner läuft und einer beginnt später (künftig), keiner läuft und keiner beginnt später, also sind alle beendet (ehemalig). Das entspricht der Lesart, die Runde 1 vorgeschlagen hat. Belegt ist es durch `tenant-status.pg.test.ts` mit dem Mieter «Wieder» (beendet vor 30 Tagen, neuer Vertrag ab +100 Tagen). Er erscheint als `isFuture: true`, im Filter `future` und nicht im Filter `inactive`. Die Mieterliste zeigt «Künftig» als eigenes Kennzeichen (`TenantRow.svelte`) und den Filter «Künftige Mieter». Der Vertragsstatus auf der Mieterseite (`getTenantWithHistory`) nutzte schon vorher dieselbe Grenze `start <= heute <= end`.
- **«Leer seit {Datum}» (#145).**
  - `lastContractEnd` ist das grösste `end_date < heute` (`apartment.service.ts`), angezeigt als Folgetag (`endedSince`). Nachgerechnet: 31.03.2024 → 01.04.2024, 29.02.2024 → 01.03.2024, 31.12.2025 → 01.01.2026, 28.02.2023 → 01.03.2023. Bei zwei aufeinanderfolgenden beendeten Verträgen gilt das spätere Ende (Backend-Test «1.07»: -200 und -5 ergibt -5).
  - Grenzfall Vertragsende = heute: Der Vertrag läuft noch (`end_date < heute` greift nicht), der Status lautet «Vermietet bis». Das ist richtig.
  - Nur für den Status `vacant` (`statusText`, `ApartmentFacts.svelte`, Übersicht `a.status === 'vacant' && a.lastContractEnd`). Eine gesperrte Wohnung bekommt weder «seit» noch die Hilfe. Das stimmt mit dem Auftrag überein (V-8 aus Runde 1 bleibt Nit).
  - Eine nie vermietete Wohnung bleibt «Leer» (kein `lastContractEnd`). In der Übersicht bekommt sie keine Zeile. Damit ist der Gegenfall aus V-4 im Code abgedeckt.
  - Mieterwechsel mit Lücke: Hat die Wohnung einen künftigen Vertrag, ist der Status `relet` («Vermietet ab»), nicht «Leer seit». Das entspricht dem Glossar.
  - Wohnungsliste (`ApartmentCard.svelte`) und Gebäudeseite (`ApartmentsByFloor.svelte`) nutzen dasselbe `statusText` mit `lastContractEnd` aus ihrem Load. Damit ist der Wortlaut überall gleich (#58). V-4 aus Runde 1 ist so im Code gelöst, ein Szenario für die Liste fehlt aber weiterhin (Minor, unverändert).
- **«Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.»** Die Hilfe steht auf der Wohnungsseite bei «Leer seit» und in der Übersicht unter der Belegung, sobald eine Wohnung «leer seit» ist. Die rechtliche Grundlage ist in Runde 1 belegt (VMWG Art. 7 Abs. 1; OR Art. 257a Abs. 2). fr/it/en geben den Inhalt richtig wieder: «frais accessoires», «spese accessorie», «utility costs», «bailleur», «locatore», «landlord» wie in `i18n-begriffe.md`.
- **«Vermietet ab {Datum}» / «Vermietet ab …».** Die Texte stimmen in allen vier Sprachen mit der Tabelle aus Runde 1 überein:
  - `apartments_status_relet`, `apartments_status_relet_from`, `apartments_count_relet_one/many`.
  - Die Pluralformen sind fr «loué/loués dès le», it «locato/locati dal», en «let from».
  - Die Gebäudekarten gruppieren jetzt wie die Übersicht pro Datum (`reletParts`, sortiert). Damit ist der Hinweis aus V-4 umgesetzt.
  - `dashboard_relet_from` entfällt zugunsten derselben Texte. Dadurch heisst es in der Übersicht und auf der Karte gleich.
- **«Frühere Mietverträge» und die Hilfe zur Historie (A-8).** Der Wortlaut stimmt mit `anforderungen-vertragsende.md` A-8 überein. Die Hilfe steht nur bei beendeten Verträgen, laufende und künftige stehen oben. «Beendet» folgt dem Vertragsstatus aus dem Glossar. fr «historique» und it «storia» stimmen mit den bestehenden Texten überein (`contracts_delete_real_tenancy_ended`).
- **V-6.** In `i18n-begriffe.md` Zeile 19 stehen «Vermietet / Vermietet ab {Datum} / Leer / Leer seit {Datum} / Gesperrt» mit den Übersetzungen aus Runde 1, ohne ❓. Die neue Zeile «Mieter: aktiv / künftig / ehemalig» hat «actif / futur / ancien», «attivo / futuro / ex» und «active / future / former». Sie passt zu den bestehenden Filtern «Anciens locataires» und «Ex inquilini». `glossary_status_text` und `apartments_legend_text` nennen in allen vier Sprachen «Vermietet ab …» statt «Wiedervermietet».

## Befunde

### V-3 (Rest, Minor, Verwalter): Glossarsatz zum Mieterstatus

**Beleg.** `UBIQUITOUS_LANGUAGE.md:23`: «künftig mit nur einem künftigen Mietvertrag, ehemalig, wenn alle seine Mietverträge beendet sind». Der Code (siehe oben) und `TenantFilters.svelte` («künftig: only a future one») lesen «nur» als «keinen laufenden, aber einen künftigen».
**Warum.** Der Code ist richtig und getestet. Der Glossarsatz lässt aber die andere Lesart («einziger Vertrag») weiterhin zu. Dann hätte der Mieter «Wieder» laut Glossar keinen Status.
**Korrektur.** Nicht in diesem Pull Request, weil das Glossar unverändert bleibt. Im offenen Glossar-Issue #140 als Kommentar vorschlagen: «künftig, wenn keiner läuft, aber einer später beginnt (beendete zählen nicht)». Ein neuer Marker ist nicht nötig, weil die Regel aus #58 so umgesetzt ist.

### V-9 (Nit, Verwalter): Grossschreibung «Suo» im Italienischen

**Beleg.** `messages/it.json:181`: «Le spese accessorie di un appartamento sfitto sono a Suo carico in quanto locatore.» In `messages/it.json` steht das Possessiv meist klein (`suo` 12×, `sua` 16×, `suoi` 31× gegenüber `Suo` 4×, `Sua` 2×), so auch in den benachbarten Hilfetexten.
**Warum.** Das ist kein Fachfehler. `i18n-begriffe.md:5` verlangt nur die Anrede mit «Lei», keine bestimmte Schreibweise.
**Korrektur.** Optional «a suo carico» schreiben, damit es zu den Texten daneben passt.

### V-10 (Nit, Verwalter): fr «Futur» als Mieterkennzeichen

**Beleg.** `messages/fr.json` `tenants_future`: «Futur». `i18n-begriffe.md` neue Zeile: «actif / futur / ancien».
**Warum.** Als Kennzeichen allein klingt «Futur» etwas technisch. In der Romandie sagt man eher «Futur locataire» oder «À venir». Der Filter «Futurs locataires» ist idiomatisch. Bei einer Mieterin bleibt «Futur» männlich, so wie das bestehende «Actif».
**Korrektur.** Keine nötig. Die Wahl kann bei der Durchsicht von #83 mitlaufen.

## Aus Runde 1 unverändert offen (nicht Teil dieses Auftrags)

- V-1 (Hilfe zu «Vermietet ab» ohne Hinweis auf die Nebenkosten bis zum Vertragsbeginn) und V-5 (Begriff «Leer seit {Datum}» fehlt im Glossar): `i18n-begriffe.md` führt «Leer seit {Datum}» jetzt in der Zeile Mietstatus, `UBIQUITOUS_LANGUAGE.md:22` aber nicht. Beide Punkte sind Sache des Product Owners. Nach CLAUDE.md braucht es dafür ein Issue (`fachlich`, `entscheiden`) oder einen Kommentar zu #140/#279, ausser #145 hat «Leer seit» schon entschieden.
- V-4: Die Wohnungsliste und die Gebäudeseite zeigen «Leer seit» über dasselbe `statusText`. Ein Szenario oder ein tieferer Test für die Liste fehlt aber.

## Nicht bestätigt

- **Texte der Issues #58, #117 und #145** sind nicht auf GitHub gelesen. Massgebend waren die Angaben des Aufrufers und `docs/anforderungen-vertragsende.md` A-8.
- **Issue #83:** Ob dort «re-let ❓» schon nachgeführt ist, wurde nicht geprüft. Gelesen wurde nur `i18n-begriffe.md`.
- **`getTenant` (Einzelabfrage)** liefert ebenfalls `TenantWithOccupancy`. Ob es `isFuture` berechnet, wurde nicht geprüft. Die Mieterseite zeigt den Mieterstatus laut Diff nicht, darum ist das ohne fachliche Folge.
- **Die fr/it/en-Wortlaute** sind nur gegen `i18n-begriffe.md` und die bestehenden `messages/*.json` geprüft, nicht mit einer Muttersprachlerin oder einem Muttersprachler.
- **Tests und Szenarien** wurden nicht ausgeführt. Geprüft wurde nur der Code und ihr Inhalt.
