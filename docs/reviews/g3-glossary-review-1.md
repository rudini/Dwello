# Code-Review: Glossar aus den Entscheiden vom 2026-10-18 (Runde 1)

Geprüft: `origin/main..e2b1ea77` (1 Commit `docs(i18n): update glossary from decisions`), gelesen im losgelösten Worktree `scratchpad/wt` auf e2b1ea77. Alle 6 geänderten Dateien sind gelesen. Abgeglichen habe ich mit den Issue-Texten und Kommentaren von #402, #405, #407, #408, #409, #410, #411, #397, #398, #140 (dazu #286 und #66), alle per `gh api` gelesen, mit `backend/src/db/schema.ts`, `messages/{de,fr,it,en}.json` und dem Code hinter den Einträgen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund | Behebung |
|---|---|---|---|---|
| C-1 | Major | `UBIQUITOUS_LANGUAGE.md:238-240` | «Betreiber», «Verantwortlicher (DSG)» und «Auftragsbearbeiter (DSG)» beschreiben die geteilte Verantwortung aus #411 Punkt 1 (B). Die App zeigt diese Aufteilung noch nicht. Die Datenschutzerklärung sagt heute: «Verantwortlich für die Bearbeitung der Daten in dieser Dwello-Installation ist ihr Betreiber» (`messages/de.json:165-166`), und Mieter fragen «beim Betreiber» (`:168`). Keiner der drei Einträge ist als «geplant» markiert. | Den drei Definitionen «(in der Datenschutzerklärung geplant, #411)» anhängen. Die Tabelle hat keine Code-Spalte, deshalb gehört der Vermerk in den Text. |
| C-2 | Minor | `UBIQUITOUS_LANGUAGE.md:173` | In der Code-Spalte von «Satz des Abrechnungslaufs» steht `utility_statements.management_fee_percent`. Diese Spalte speichert aber den Satz, der auf die Abrechnung angewandt wurde: den eigenen Satz, den Satz des Laufs oder 0 (`calculation.service.ts:320-326, 468`; `statement.service.ts:415`). Den Satz des Laufs selbst speichert Dwello nicht. | Zum Beispiel: «Eingabe im Wizard „Abrechnungen erstellen“ (nicht gespeichert; die Abrechnung hält in `management_fee_percent` den angewandten Satz)». |
| C-3 | Minor | `docs/design/i18n-begriffe.md` (fehlende Zeilen) | Für «Vollservicevertrag (Lift)» hat #398 fr/it/en entschieden: «contrat de maintenance complet» / «contratto di manutenzione completo» / «full-service contract». Die App verwendet genau diese Wörter (`categories_reason_elevator`). Für «Verordnung über die Miete (VMWG)» verwendet die App «ordonnance sur le bail (OBLF)», «ordinanza concernente la locazione (OLAL)» und «Tenancy Ordinance (VMWG)». Für beide Begriffe fehlt die Zeile. | Zwei Zeilen mit den Wörtern ergänzen, die die App schon verwendet. |
| C-4 | Minor | `docs/design/i18n-begriffe.md:19, 31` | #402 Punkt 12 verlangt fr/it/en-Zeilen für die Begriffe aus #140. Ergänzt ist nur «Nachmieter / Mieterwechsel». Es fehlen «Vermietet bis {Datum}» (App: «Loué jusqu’au» / «Locato fino al» / «Let until», `apartments_status_occupied_until`) und «Ersatzmieter». Der PR soll #140 schliessen. | «Vermietet bis {Datum}» in Zeile 19 aufnehmen und eine Zeile für «Ersatzmieter» mit den Wörtern aus `glossary_notice_period_text` (fr/it/en) anlegen. |
| C-5 | Minor | `docs/design/i18n-begriffe.md` (fehlende Zeile) | #409 Punkt 5 entscheidet: «abgerechnet» heisst décomptée / conteggiata / in a statement. fr und it stehen so schon in der App (`invoices_billed_title`, `invoices_beleg_billed`), die Zeile fehlt aber. Nur das englische Wort ändert sich erst mit der Umsetzung. | Zeile «abgerechnet (Rechnung) \| décomptée \| conteggiata \| billed» ergänzen. Die Änderung zu «in a statement» bleibt bei der Umsetzung, so wie bei #405 1e/2b. |
| C-6 | Minor | `backend/src/services/pdf.service.ts:665`, `src/routes/statements/[id]/CostTable.svelte:19`, `src/routes/config/audit-log/+page.svelte:10`, `tests/e2e/features/settings.feature:72`, `src/lib/overview.ts:235`, `src/routes/tenants/[id]/TenantDocumentsCard.svelte:40`, `tests/e2e/features/statement-detail.feature:284`, `tests/e2e/features/statement-generate.feature:100` | Diese Marker sagen «… is not in the glossary (yet)» oder «fehlt im Glossar» (#362, #370, #334, #294). Seit diesem Commit stimmt das nicht mehr: Die Einträge stehen jetzt im Glossar. Dass die Issues erst mit #402 schliessen, gibt die Anforderung vor. Der Text der Marker ist trotzdem falsch geworden. | Den Text so anpassen, dass er das Verbleibende nennt, zum Beispiel «help texts follow (#402)». Alternativ entscheiden, die vier Issues jetzt mit zu schliessen. |
| C-7 | Minor | `docs/archive/implementation-plan-verlauf.md:1749-1750` | «Closing code-review round» und «PR `Fixes …`» sind abgehakt, obwohl dieser Review erst läuft und es noch keinen PR gibt. | Erst abhaken, wenn erledigt. Dort auch den Bericht nennen, wie bei den früheren Sessions. |
| C-8 | Nit | `UBIQUITOUS_LANGUAGE.md:61` | Im entschiedenen Eintrag «Freigabe des Mietzinsdepots» (#411, Kommentar) steht noch «UI: «bis das Mietzinsdepot freigegeben ist»». Dieser Teil fehlt hier. | Den Satz anhängen oder die Auslassung im PR begründen. |
| C-9 | Nit | `UBIQUITOUS_LANGUAGE.md:81` | Bei «Akontorechnung» verlangt #409 Punkt 3 «the same sentence». Übernommen ist die Regel als Beschreibung im Passiv, nicht der Imperativ der Hilfe. Inhaltlich ist sie gleich (0 → nicht erfassen; < 0 → Akontorechnung verringern und Abrechnungen berichtigen). | Keine nötig. |
| C-10 | Nit | `UBIQUITOUS_LANGUAGE.md:172`; `docs/nebenkostenabrechnung-anforderungen.md:60` | Das Glossar sagt jetzt «Üblich sind bis 3 %». `glossary_fee_text` und `config_help_management_fee` sagen weiter «etwa 3 %»; diese Texte kommen gemäss #402 Punkt 2 erst mit der Umsetzung. Die Anforderungen zitieren das Glossar noch mit «etwa 3 %» und sind damit veraltet. | Das Zitat in den Anforderungen mit der Umsetzung nachführen. |
| C-11 | Nit | `docs/design/i18n-begriffe.md:32` | fr «annuler la résiliation» ist entschieden und bleibt (#405 1e), trägt aber weiter ❓. Nur it ändert sich. | Das ❓ bei fr entfernen, bei it bis zur Umsetzung stehen lassen. |
| C-12 | Nit | PR-Text (`tools/open-work/check-issues.mjs:37-43`) | Der Diff ändert Dateien unter `src/lib`, `src/routes` und `backend`, wenn auch nur Kommentare, und der PR soll Issues schliessen. Ohne «No scenario: <reason>» im PR-Text schlägt `check-issues` fehl. | Im PR-Text «No scenario: glossary and comment-only change» angeben. |

## Blocker/Major

### C-1: Rechtsbegriffe beschreiben eine Aufteilung, die die App noch nicht zeigt, ohne «geplant»

Die Anforderung verlangt «Not-yet-implemented terms carry «geplant (#n)»» und «no row contradicts … the app's current behaviour without a «geplant» marker». #411 Punkt 1 (Option B) ist entschieden, aber nicht umgesetzt. Der Marker `TODO(fachlich prüfen, #330)` in `src/routes/privacy/+page.svelte:68` («the operator as controller also when a provider hosts Dwello») steht noch.

So zeigt es sich:

- `UBIQUITOUS_LANGUAGE.md:239`: «Für die Daten, die in Dwello erfasst werden, auch die der Mieter, der Vermieter».
- `messages/de.json:165`, was die App heute anzeigt: «Verantwortlich für die Bearbeitung der Daten in dieser Dwello-Installation ist ihr Betreiber: {operator}.»
- `:168`: «… kann beim Betreiber kostenlos Auskunft … verlangen».
- Betreiber-Eintrag `:238`: «für die erfassten Daten nur Auftragsbearbeiter», ebenfalls im Widerspruch zu `:165`.

Wer das Glossar als verbindliche Referenz liest, hält die Aufteilung für umgesetzt. Bei einer gehosteten Installation schickt die App die Mieter aber weiterhin zum Betreiber.

## Bestätigt

- **Wortlaut gegen die Entscheide.** Zeichengenau oder nur in Satzform angepasst und inhaltlich gleich sind:
  - aus #402: Leerstand, Verwaltungspauschale samt Ergänzung, Vereinbarte Verwaltungspauschale, Eigener Satz (mit «grösser als 0» geplant #402), Satz des Abrechnungslaufs, Abrechnungslauf, Abrechnungsdatum, Zahlung zurücksetzen, Bezahlt, Abrechnungsnummer, Gebäude ohne Tank, Verbrauch, Saldo (Plural), Bereits bezahlt / Bereits zurückerstattet, «geplant (#120)» entfernt bei Berichtigte Abrechnung und Ersetzt, Vereinbarte Nebenkosten (korrigierte Fassung «noch nichts angegeben»), Nicht vereinbart, Umlagefähige Nebenkosten, Protokoll, Kosten des Gebäudes, die Umbenennung zu «Nebenkosten des Gebäudes» (Liegenschaft bleibt Synonym, `:14`), VMWG (#397) und Vollservicevertrag (#398);
  - Vereinbart ab, geplant #407 (#407);
  - Tage ohne Abrechnung, Kurze Abrechnungsperiode geplant #408, Hinweis auf fehlende Abrechnungen ohne «geplant», Abgerechnet bis `billed_until`, Mietstage, Geleistete Akontobeiträge, Nebenkostenabrechnung (#408);
  - Abgerechnet (Rechnung) und Akontorechnung, siehe C-9 (#409);
  - Befristet / Unbefristet, Auszug bestätigt (#410);
  - Mietzinsdepot, Protokoll des Servers mit zulässigem Zusatz «Nicht zu verwechseln …», Ausweiskopie (#411).
- **Offene Punkte sind nicht übernommen:** #409 Punkt 4 (kein Dokumenttyp Akontorechnung), #411 Punkte 3 und 7 (kein «Mieter anonymisieren»), #405 1a und 1d (❓ bei «imputable», «fiabilité/affidabilità» bleiben, `i18n-begriffe.md:49, 54`).
- **Code-Spalte.** Alle genannten Namen gibt es in `backend/src/db/schema.ts`: `moved_out`, `billed_until`, `management_fee_agreed`, `management_fee_percent` (auf `rental_contracts` und `utility_statements`), `contract_categories`/`agreed`, `statement_number`, Tabelle `statement_numbers`, `statement_date`, `no_tank`, `prior_payments`, `replaces_id`, Status `replaced` (`:440`), `payment_resets` (jsonb-Spalte, `:434`), `audit_log`, `documents.type = 'upload'`. Einziger falsch zugeordneter Eintrag: C-2.
- **Verhalten.** Geprüft gegen den Code:
  - «Abgerechnet (Rechnung)» in jedem Status: `statement-invoices.service.ts:68` («in any state»).
  - Tage ohne Abrechnung und Name der Periode: `src/lib/accounting-period.ts:40-79`.
  - Vereinbarte Verwaltungspauschale als Pflichtwahl: `contract-form.ts:120`.
  - Eigener Satz 0–10 heute (Muster `routes/contracts.ts:38`), deshalb «grösser als 0» richtig als geplant markiert.
  - Protokoll löschbar: `audit_delete_*`.
- **i18n-Zeilen.** Jedes neue fr/it/en-Wort kommt in `messages/{fr,it,en}.json` vor, ausser «sous-traitant / responsabile del trattamento / processor». Das ist ein neuer Begriff aus #411 ohne bisherigen Text in der App. ❓ ist richtig entfernt bei Abrechnungslauf, der Mahnung-Familie, Mahnung senden (#405 1b, 1c) und Abgerechnet bis (#408 Punkt 3). it «costi immobile», «frais de gestion» und «revocare» bleiben wie verlangt bis zur Umsetzung.
- **Marker #140, #397, #398.** Alle entfernt. `git grep` findet keinen Verweis mehr in `src`, `backend`, `tests` und `messages`. Die drei geänderten Kommentare ändern kein Verhalten.
- **Tabellensyntax.** Die Spaltenzahl jeder Tabelle in beiden Dateien ist per Skript geprüft und einheitlich.
- **Commit-Betreff.** Konventionell, 42 Zeichen.
- **Ponytail.** Der Diff enthält nur Glossar, Begriffsliste, drei Marker-Kommentare und den Archiv-Eintrag, keine fremden Änderungen.
- **Pflichtprüfungen:** Es gibt keine Verhaltensänderung, keinen neuen Bildschirm, keinen UI-Text und keinen E2E-Code. Deshalb sind kein Szenario, kein `screens.json` und keine `messages/*.json` nötig.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/contract-rent-labels.test.ts src/__tests__/open-work.test.ts` und `cd backend && bun test src/__tests__/statement-pdf-render.test.ts`: vom Aufrufer gemeldet, nicht wiederholt. Im Review-Worktree sind keine Abhängigkeiten installiert. Die drei Tests, die die Dokumente nennen, erwähnen sie nur im Kommentar und lesen sie nicht.
- Gesetzeszitate (Art. 266 Abs. 2, 257e OR, Art. 4–8 VMWG, Art. 5 Bst. j/k DSG) habe ich nicht gegen Fedlex geprüft, nur gegen die zitierten Fedlex-Wortlaute in den Kommentaren des fach-reviewers.
- Ob die fr/it/en-Wörter der neuen Zeilen sprachlich richtig sind (Muttersprachler): nicht geprüft. Geprüft habe ich nur, dass sie dem Entscheid und den Wörtern in `messages/*.json` entsprechen.
- `check-issues` für den künftigen PR-Text (C-12) und dass #397, #398 und #140 nach dem Merge schliessbar sind: nur aus `tools/open-work/check-issues.mjs` gelesen, nicht ausgeführt.
