# Slice-Review #448, Runde 3 (Schlussrunde vor dem ersten Push)

Worktree `review-448-code3`, Commit b97b341a. Delta `git diff 43460275 b97b341a`, darin b6e07917, a49c11dd (Merge), c3378998, e6de1d96, c80e2309 und der Merge b97b341a. Die Merge-Auflösungen habe ich mit `git show --remerge-diff a49c11dd`, `git show --cc b97b341a` und einem Drei-Wege-Vergleich aller Schlüssel in `messages/*.json` geprüft (Basis 7261d21a, Seiten b97b341a^1 / ^2, Ergebnis). Vorherige Berichte: `docs/reviews/448-review-1.md`, `448-review-2.md`.

## Status der offenen IDs aus Runde 2

| ID | Status |
|----|--------|
| C-5 | offen, bewusst (unverändert). |
| C-9 | erledigt. `tests/contracts/statement.json:23-24` trägt einen echten Übertrag und einen Eintrag «Bereits verrechnet». `api-contracts.pg.test.ts:99-135` erzeugt beides gegen die echte API und vergleicht es mit dem Vertrag. |
| C-13 | erledigt. `Correction.svelte:26-29` (`carried` gilt auch für die Rückerstattung nach #94, gleiche Bedingung wie `carriable`, `statement.service.ts:396-399`). DOM-Test `statement-pages.dom.test.ts:694-698`: Ohne die Änderung erscheint `statements_correct_settled`, der Test wird rot. |
| C-14 | erledigt (`statement-minimum-balance.feature:8-11`, Kommentar im DOM-Test). |
| C-15 | erledigt (`Tx` exportiert und importiert). |
| C-16 | erledigt. Die Datei heisst jetzt `0028_statement_carry_over.sql`. Auf `origin/main` (a828b368) ist die letzte Migration `0027_master_data_names.sql`. Ein Journal oder Snapshot gibt es nicht: `backend/migrations/` enthält nur `.sql`-Dateien, die nach Dateinamen laufen. Kein Code und kein Test nennt den alten Namen. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-17 | Major | messages/fr.json:108, 1301; messages/it.json:108, 1301 | Der Merge b97b341a verliert #448-Texte auf Französisch und Italienisch. `glossary_balance_text` hat die Fassung von main übernommen, ohne den Übertrag und den Mindestbetrag. `statements_notes_help` hat ebenfalls die Fassung von main, ohne «La remarque figure dans le PDF que reçoit le locataire.» bzw. «L’osservazione figura nel PDF che riceve l’inquilino.». Deutsch und Englisch haben beide Texte. |
| C-18 | Major | src/routes/statements/[id]/Correction.svelte:28, 31-36; statement-pages.dom.test.ts:701-706 | V-32 ist falsch umgesetzt. Bei einer erledigten Abrechnung mit Saldo 0.00 zeigt der Dialog jetzt `statements_correct_open`: «… wird nicht mehr gemahnt … Was der Mieter schon überwiesen hat, tragen Sie bei «Bereits bezahlt» ein.». Das Feld «Bereits bezahlt» erscheint bei «Erledigt» aber nicht (`askPaid`, Z. 50). Die Fachreview hat `statements_correct_settled` empfohlen. Der Test prüft nur `not.toContain('Übertrag')` und bleibt deshalb grün. |
| C-19 | Minor | backend/migrations/0028_statement_carry_over.sql:4-5 | Der Kommentar sagt, Abrechnungen nach #94 behalten «Bezahlt» und «carry nothing over». Seit dem PO-Entscheid vom 2026-10-19 wird eine Rückerstattung nach #94 übertragen (`carriable`, `statement.service.ts:394-399`). Die Migration ist auf main noch nicht angewendet, die Zeile lässt sich also noch ändern. |
| C-20 | Minor | messages/fr.json:439; messages/en.json:451, 1090, 1092 | Regeln nach #405 in Branch-Texten, die schon vor dem Delta da waren (Punkt 4 des Auftrags). In fr steht in `statements_paid_date_early` vor «?» ein normales Leerzeichen statt U+00A0 («Enregistrer quand même ?»). Es ist der einzige fr-Text mit diesem Fehler. In en setzen `backend_statement_paid_amount_invalid`, `statements_correct_open` und `statements_correct_open_refund` “ ” statt « ». Auf `origin/main` hat en.json kein einziges “. `i18n.test.ts` prüft weder das eine noch das andere. |

### C-17 (Major): Der Merge b97b341a verliert #448-Texte in fr und it

**Warum falsch:** Bei den beiden Schlüsseln hat die Konfliktlösung die Fassung von main genommen.
- In `glossary_balance_text` haben beide Seiten geändert. main ersetzt mit #405/#461 die Begriffe: «frais d’administration», «spese amministrative». Der Branch ergänzt den Übertrag («plus un montant à payer reporté ou moins un remboursement reporté …») und den Schlusssatz zum Mindestbetrag («Un solde inférieur à CHF 5.00 n’est ni réclamé ni versé … ; le décompte final ne connaît pas de montant minimum.»). Richtig wäre die Fassung des Branches mit den neuen Begriffen von main gewesen. Vermutlich hat `i18n.test.ts:94-95` («frais de gestion», «spese di gestione») dazu geführt, die Fassung von main zu übernehmen.
- In `statements_notes_help` hat main nichts geändert, der Merge setzt trotzdem den Text der Basis ein (`git show b97b341a^1:messages/fr.json` hat den Satz, b97b341a nicht).

Damit gilt in fr und it nicht mehr, was der Branch für alle vier Sprachen entschieden hat: die Saldo-Hilfe zum Übertrag (#448) und die Bemerkungs-Hilfe nach Fachreview 448-4, Punkt 4 (Anna P-3). Das verstösst gegen «every new or changed text is in all four files». Die Hilfeseite in fr/it erklärt den Saldo jetzt ohne Übertrag, die Detailseite zeigt aber eine Zeile «Report».

**So zeigt es sich:**
- `python3 -c "import json;print(json.load(open('messages/fr.json'))['glossary_balance_text'])"`: Es fehlen «reporté» und «CHF 5.00».
- `statements_notes_help` in fr: nur «Par exemple un accord avec le locataire.».
- Kein Test fängt das ab, denn `help-page.dom.test.ts` und `help.feature` prüfen nur de.

Ein fr/it-Test auf beide Sätze, analog `i18n.test.ts:110-120` (Ersatzmieter), würde rot.

**Fix:** `glossary_balance_text` fr/it: die Fassung von b97b341a^1 mit «frais d’administration» bzw. «spese amministrative». `statements_notes_help` fr/it: die Fassung von c3378998.

### C-18 (Major): Ein Saldo 0.00 schickt den Verwalter zu einem Feld, das es nicht gibt

**Warum falsch:** c3378998 nimmt den Saldo 0.00 aus `carried` heraus (Z. 28). Bei Status `settled` greift dann `statement.status !== 'paid'` (Z. 39), also `unpaidConsequence`. Weil `balance < 0` nicht zutrifft, kommt `m.statements_correct_open` (Z. 36). Dieser Text gehört zu versendeten und überfälligen Abrechnungen:
- Er sagt, die Abrechnung «wird nicht mehr gemahnt». Eine erledigte Abrechnung wird aber nie gemahnt.
- Er verlangt einen Eintrag bei «Bereits bezahlt». Das Feld erscheint nur bei `askPaid`, also bei `sent` oder `overdue` (Z. 50, 152). Dass es bei `settled` fehlt, belegt der Test «fragt beim Berichtigen einer Abrechnung im Status settled nicht nach dem bereits Bezahlten» (`statement-pages.dom.test.ts:708`).

Ein unerfahrener Verwalter sucht im Dialog ein Feld, das es nicht gibt. Fachreview 448-4 V-32 hat `statements_correct_settled` empfohlen («… Die bisherige bleibt unverändert erhalten.»). Vor c3378998 stand an dieser Stelle der harmlose Übertrags-Text. Die Änderung macht es also schlimmer.

**So zeigt es sich:** Im DOM-Test Z. 702-706 `expect(correctDialog()).toContain('Die Abrechnung NK-2024-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten.')` ergänzen und dazu `not.toContain('Bereits bezahlt')`. Der zweite Teil wird rot.

**Fix:** In `consequence` den Fall `statement.status === 'settled' && !carried` auf `m.statements_correct_settled` führen und den Test auf den ganzen Text schärfen.

## Merge-Auflösungen

**a49c11dd:**
- `pdf.service.ts` und `CostTable.svelte`: Die Logik des Branches bleibt (`offsetOf`, `offsets`, `carry`). Die Marker `TODO(#362)`, die main entfernt hat, sind weg.
- `+page.svelte`: `ResultList` von main mit `startPaying` des Branches. `StatementList.svelte` ist korrekt gelöscht.
- `questions/statement-detail.ts`, `statement-detail.steps.ts`: beide Seiten bleiben (Gap und Value).
- `glossary_balance_text`: in allen vier Sprachen beide Ergänzungen. Die beiden Persona-Berichte (`anna-448.md`, `dr-weber-448.md`) kommen erst mit dem Merge-Commit dazu. Das sind nur Dokumente, kein Befund.

**b97b341a:**
- `offene-punkte.md`: Die neue Zeile heisst U-42, U-41 von main bleibt. Das Archiv nennt U-42, kein anderer Verweis nennt mehr U-41 für die Tabelle.
- `statementIcons`: umbenannt, weil `statusIcons` schon in `src/lib/apartment.ts:66` existiert. Alle drei Verwendungen sind nachgezogen.
- en `statements_correct_*`, `statements_correct_limit`, `glossary_allocable_text`: die Fassung von main, richtig.
- fr `statements_correct_open`, `statements_correct_open_refund`: die Fassung des Branches (Feld «Déjà payé»/«Déjà remboursé»), richtig.
- Fehler: siehe C-17.

## Prüfpunkte des Koordinators

1. **Texte aus 448-fachreview-4 wörtlich:** Per Skript verglichen (U+00A0 als Leerzeichen gewertet).
   - `statements_correct_open_settled` (V-26) und `glossary_settled_text` (V-27): in allen vier Sprachen wörtlich.
   - `statements_notes_help_correction`: in allen vier wörtlich.
   - `statements_notes_help`: in de/en wörtlich, in fr/it **nicht** (C-17).
   - Die Begriffsnamen stimmen (Erledigt, Clôturé, Chiuso, Closed).
   - V-32 ist nicht wie empfohlen umgesetzt (C-18).
2. **UBIQUITOUS_LANGUAGE.md, Zeile «Erledigt»:** unverändert gegenüber `origin/main`, wortgleich, nur die Zeilennummer verschiebt sich von 197 auf 198.
3. **Migration 0028:** Die Nummer ist auf `origin/main` frei, ein Journal oder Snapshot gibt es nicht (siehe C-16). Der Kommentar ist veraltet (C-19).
4. **#405-Regeln:** Geprüft habe ich alle fr/it/en-Schlüssel, die vom Stand von `origin/main` abweichen (27 fr, 27 it, 31 en).
   - fr: U+00A0 vor «: ; ! %» und innerhalb von « », mit einer Ausnahme vor «?» (C-20).
   - it: kein kleines «lei», keine grossgeschriebenen Pronomen mitten im Satz, keine “ ”.
   - en: drei Texte mit “ ” (C-20).
   - Die neuen Texte des Deltas halten alle Regeln ein.
5. **Symbol «Erledigt»:**
   - Das Symbol `check` kommt aus `src/lib/ui/icons` (`IconName`) und erscheint über `Badge` aus `src/lib/ui`.
   - Das Abzeichen hat den Ton `neutral` (Token-Klassen über `toneStyle`) und ein Wort als Beschriftung. Die Farbe trägt die Information also nicht allein.
   - Das Symbol unterscheidet sich von dem für «Entwurf» und «Ersetzt» (`info`) und von dem für «Bezahlt» (`success`).
   - DOM-Test `statement-pages.dom.test.ts:563-570`: auf c3378998 rot, weil dort beide Status `info` zeigten.

## Rote Tests (gelesen)

- Ohne die jeweilige Änderung rot werden:
  - V-24 (`statement-carry-over.pg.test.ts:257`, liest den Entwurf direkt nach dem Ersetzen),
  - V-25/C-13,
  - V-32 (Z. 701, war vorher open_settled mit «Übertrag»),
  - «Erledigt» in der Hilfe (`help-page.dom.test.ts:56, 68`),
  - das Symbol,
  - die neuen Texte (DOM, `statement-detail.feature:878`).
- `statement-status.test.ts:20` zieht den Ton nach.
- Der neue pg-Vertragstest von C-9 prüft eine Form, die die API schon lieferte. Er sichert Verhalten, das es schon gab, und ist kein Bugfix. Das ist zulässig, die Commit-Nachricht nennt es aber nicht ausdrücklich so.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3287), `cd backend && bun test` (1100), das fallow-Gate: vom Aufrufer gemeldet, nicht neu ausgeführt.
- E2E der betroffenen Features sowie axe und Sprache der Abrechnungs-Detailseiten: laufen laut Aufrufer noch, Ergebnis offen. Nach C-17 zeigt die Hilfeseite in fr/it trotzdem kein Deutsch, «sprachen-bildschirme» fängt den Fehler also nicht ab.
- `origin/main` (a828b368, #516, #526) ist nach dem Merge b97b341a weitergelaufen und ist kein Vorfahre von b97b341a. Ob der nächste Merge vor dem Push Konflikte in `messages/*.json` oder eine neue Migration 0028 bringt, habe ich nicht geprüft. Auf a828b368 ist 0028 frei.
- Ob die Detailseite eines Entwurfs nach dem Ersetzen ohne Neuladen den neuen Saldo zeigt: nicht geprüft (wie in Fachreview 448-4).
- Die Dokumente (Persona-Berichte, Datenprüfung, Workflow-Notizen, Archiv) habe ich nur auf Verweise geprüft (U-41/U-42), inhaltlich nicht.

## Triage (W4)

- C-17: angenommen, behoben. fr/it haben wieder Übertrag, Mindestbetrag und PDF-Satz; der Begriff von main («frais d’administration», «spese amministrative») bleibt. Kein anderer Text ging im Merge verloren (Vergleich aller Schlüssel gegen beide Eltern). Test `i18n.test.ts` «Saldo und Bemerkung (#448)», zuerst rot.
- C-18: angenommen, behoben. «Erledigt» mit Saldo 0.00 zeigt `statements_correct_settled`. DOM-Test prüft den ganzen Text und dass «Bereits bezahlt» fehlt, zuerst rot.
- C-19: angenommen, Kommentar der Migration korrigiert.
- C-20: angenommen, behoben. Neue Tests «Typografie» in `i18n.test.ts` (fr: geschütztes Leerzeichen vor ? ! ;, en: keine “ ”), zuerst rot mit genau den vier genannten Schlüsseln.
