# Code-Review: Glossar aus den Entscheiden vom 2026-10-18 (Runde 2)

Geprüft: Delta `e2b1ea77..c6acdcd0` (1 Commit `docs(i18n): fix glossary review findings`), gelesen in einem losgelösten Worktree auf c6acdcd0. Gelesen sind alle 12 geänderten Dateien. Vorheriger Bericht: `docs/reviews/g3-glossary-review-1.md` (C-1 bis C-12). Abgeglichen habe ich mit `messages/{de,fr,it,en}.json` und mit den Issues #140, #294, #334, #362, #370, #402 und #411 (per `gh api`).

## Status der Befunde aus Runde 1

| ID | Schwere | Datei:Zeile | Status |
|---|---|---|---|
| C-1 | Major | `UBIQUITOUS_LANGUAGE.md:238-240` | Behoben. Alle drei Definitionen tragen «(in der Datenschutzerklärung geplant, #411)». #411 ist offen. |
| C-2 | Minor | `UBIQUITOUS_LANGUAGE.md:173` | Behoben, mit dem vorgeschlagenen Wortlaut. |
| C-3 | Minor | `docs/design/i18n-begriffe.md:52-53` | Behoben. Beide Zeilen verwenden die Wörter, die `messages/*.json` schon verwenden (`categories_reason_elevator`, OBLF/OLAL/Tenancy Ordinance). |
| C-4 | Minor | `docs/design/i18n-begriffe.md:19, 31` | Teilweise behoben. Die Zeile «Vermietet bis {Datum}» stimmt mit `apartments_status_occupied_until` überein. Für «Ersatzmieter» trägt die Begründung der Triage nicht: Zwei UI-Texte verwenden das Wort, `glossary_notice_period_text` (`messages/de.json:122`) und `contracts_notice_period_short` (`:1608`). #402 Punkt 12 verlangt die fr/it/en-Zeile ausdrücklich. Die App sagt fr «locataire de remplacement», en «replacement tenant» und it «nuovo inquilino». Das italienische Wort steht in `i18n-begriffe.md:31` schon für «Nachmieter», zwei Begriffe aus dem Glossar (`UBIQUITOUS_LANGUAGE.md:44-45`) teilen sich auf Italienisch also ein Wort. Vorschlag: eine Zeile «Ersatzmieter \| locataire de remplacement \| nuovo inquilino ❓ \| replacement tenant» und für das it-Wort ein Issue oder eine Zeile in einem bestehenden. Bleibt Minor. |
| C-5 | Minor | `docs/design/i18n-begriffe.md:50` | Behoben. fr/it entsprechen `invoices_billed_title`, en «billed» entspricht dem heutigen Text. |
| C-6 | Minor | 8 Marker (pdf.service.ts:665, CostTable.svelte:19, audit-log/+page.svelte:10, settings.feature:72, overview.ts:235, TenantDocumentsCard.svelte:40, statement-detail.feature:284, statement-generate.feature:100) | Behoben. Die Marker nennen jetzt das Verbleibende. Bestätigt: Die «Done means» von #294, #334, #362 und #370 verlangen, dass die Hilfetexte bzw. UI-Texte in allen vier Sprachen nachgeführt werden. `git grep` findet für diese vier Issues keinen weiteren Marker mit dem alten Text. |
| C-7 | Minor | `docs/archive/implementation-plan-verlauf.md:1748-1753` | Behoben. Offene Punkte stehen jetzt als `[ ]`, der Bericht ist genannt und die Dateiliste ist vollständig. |
| C-8 | Nit | `UBIQUITOUS_LANGUAGE.md:61` | Behoben. |
| C-9 | Nit | `UBIQUITOUS_LANGUAGE.md:81` | Unverändert, wie vorgesehen (es war keine Änderung nötig). |
| C-10 | Nit | `docs/nebenkostenabrechnung-anforderungen.md:60` | Offen, wird mit der Umsetzung von #402 nachgeführt. Die Begründung trägt. |
| C-11 | Nit | `docs/design/i18n-begriffe.md:32` | Behoben. Das ❓ ist bei fr entfernt und bleibt bei it. |
| C-12 | Nit | PR-Text | Zusage für den PR-Text («No scenario: glossary and code comments only»). Noch nicht prüfbar, weil es den PR noch nicht gibt. |

## Neue Befunde im Delta

Keine. Das Delta enthält nur das Glossar, die Begriffsliste, Kommentare und Marker, den Archiv-Eintrag und den Bericht aus Runde 1. Ein Verhalten, ein UI-Text oder E2E-Code ändert sich nicht. Die Marker in den `.feature`-Dateien sind Kommentare, die Szenarien selbst bleiben gleich. Nichts im Delta hat mit der Anforderung nichts zu tun.

## Blocker/Major

Keine offen. C-1 ist behoben.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check` und `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/i18n.test.ts`: vom Aufrufer gemeldet, nicht wiederholt. Im Review-Worktree sind keine Abhängigkeiten installiert.
- C-12: `tools/open-work/check-issues.mjs` läuft erst auf den künftigen PR-Text und ist nicht ausgeführt.
- Wie in Runde 1 nicht geprüft: ob die fr/it/en-Wörter sprachlich richtig sind (Muttersprachler) und die Gesetzeszitate gegen Fedlex.
