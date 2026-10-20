# Code-Review #452, Runde 3

Gegenstand: `git diff 2578a5d3 0cee7aa0` ohne die von main gemergten Dateien, im Worktree `review-452-code3` (0cee7aa0, detached). Commits: 770e9ec0, 32bd4e07, 0cee7aa0 und der Merge 1d498092. Vorberichte: `452-review-2.md` (offen war nur C-12, Minor) und `452-fachreview-3.md` (V-1 bis V-4).

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-12 | erledigt | `fr.json:105–106`: `glossary_allocable_term` heisst «Répercutable», der Glossartext sagt dreimal «répercutable». `categories_allocable` und `categories_allocable_help` sind umgestellt. Die Radiogruppe ist damit einheitlich. Der DOM-Test «nennt die Wahl «Répercutable» und «Non répercutable»» (`category-allocability.dom.test.ts:165`) prüft auch `not.toContain('mputable')` in der Gruppe. Mit dem alten Text «Frais accessoires imputables» / «Imputable» wäre er rot. Die übrigen «imputable»-Stellen sind V-4 und gehören zu #461 |

Fachreview 452-3:
- **V-1: wörtlich umgesetzt.** Ich habe den Korrektursatz aus `452-fachreview-3.md` maschinell mit `backend/src/config/llm.ts` verglichen (Python `in`): Er steht Zeichen für Zeichen in `llm.ts:149`. Der Eval-Fall ist so aufgeteilt, wie der Bericht vorschlägt (`llm-eval.ts:58` false, `:60` true). Der pg-Test prüft beide Sätze (`category-allocability.pg.test.ts:51`, `:121`).
- **V-2: umgesetzt.** `llm.ts:160` sagt jetzt «Heizungs- oder Warmwasseranlage» und «Bst. e und g». Einen genauen Wortlaut gibt der Bericht dafür nicht vor; beide Teile seines Vorschlags sind drin.
- **V-3: erledigt**, siehe C-12.
- **V-4:** Übergangszustand, gehört zu #461 und nicht zu diesem Delta.

## Neue Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-13 | Minor | `docs/design/i18n-begriffe.md:55` | Die Begriffstabelle führt «Umlagefähig» für fr immer noch als «imputable ❓». Das Delta stellt Glossarbegriff, Radiogruppe und Hilfe auf «répercutable» um (#405, 1a). Die Tabelle, nach der sich laut `CLAUDE.md` jede Übersetzung richtet, sagt also etwas Falsches. Wer weitere Texte schreibt, nimmt dann wieder «imputable». Lösung: die Zeile auf «répercutable» stellen und #405 nennen, oder die Zeile ausdrücklich #461 überlassen |
| C-14 | Minor | Commits 32bd4e07, 0cee7aa0 | Die Betreffzeilen haben 52 bzw. 53 Zeichen. Erlaubt sind höchstens 50 (`CLAUDE.md`, Commits; `.claude/hooks/commit-msg-gate.mjs:73`). Die Commits sind nur lokal und lassen sich vor dem Push umformulieren |

Keine Blocker oder Majors im Delta.

## Zu den Prüfpunkten des Koordinators

**Ist der Fix «Rückfrage nennt die Kategorie mit localName» ein sichtbarer Bug?**
- Auf `main` nicht: `AllocabilityQuestion.svelte` kommt erst mit 2caa6692 auf diesen Branch und ist nicht in `origin/main` (`git merge-base --is-ancestor 2caa6692 origin/main` schlägt fehl). Es ist also ein Fehler im eigenen, noch nicht gemergten Code des Slices. Ein eigenes Szenario braucht er nicht. Die Sprachzeile `category-edit-predefined | allocable-confirm` (`sprachen-bildschirme.feature:215`, ebenso `accessibility.feature:214`) deckt den Zustand ab; laut Commit hat sie den Fehler auch gefunden.
- Test, der vorher rot war: ja. `toCategory` setzt `name = nameDE || name` (`src/lib/server/category.ts:26`). Ohne `localName` zeigt die Rückfrage bei fr also «Liegenschaftssteuer». Der neue DOM-Test (`category-allocability.dom.test.ts:147`) erwartet «Impôt foncier» und verbietet «Liegenschaftssteuer», ist also ohne die Änderung rot. Das habe ich durch Lesen geprüft, die Änderung nicht zurückgenommen.
- `localName` ist der bestehende Helfer (`src/lib/names.ts`) und keine Kopie. Bei eigenen Kategorien ohne `nameFR` fällt er auf den deutschen Namen zurück, wie der Seitentitel.

**E2E-Task wählt den Verteilschlüssel** (`tests/e2e/tasks/invoice-form.ts:38`):
- Die Screenplay-Schichten sind eingehalten: Der Task ruft nur seine eigene Interaktion `chooseKey` auf.
- `registerInvoice` nutzt nur der Step `invoice-form.steps.ts:57`, also `invoice-new.feature:13` und `:23`. Beide prüfen den Verteilschlüssel nicht, die Szenarien werden also nicht schwächer.
- Den Vorschlag des Verteilschlüssels prüfen weiter eigene Szenarien (`invoice-new.feature:60`, `:68`).
- `registerInvoiceWithoutKey` wählt jetzt zuerst einen Schlüssel und leert ihn danach. Beides sind synchrone Select-Schritte, das Ergebnis ist dasselbe.

**Merge 1d498092, `Select.svelte`:** Gegenüber main (11a6749b) kommt nur `helpTestid={testid && \`${testid}-help\`}` dazu. Der Kommentar bei `note` zeigt auf `Field`, und dort steht er vollständig (`Field.svelte:25`). Die Auflösung ist richtig.

**Mögliche Konflikte beim nächsten Merge von main** (Stand `origin/main` 3db8976a, enthält facddbb6 #517, 86f13870 #494 und danach #520). Trockenlauf mit `git merge-tree 11a6749b 0cee7aa0 origin/main`, Ausgabe nur nach stdout:
- **Textkonflikte, je einer in `messages/{de,en,fr,it}.json`**, gleiche Stelle: `config_help_distribution_key` (von #452 nach V-19 geändert) liegt direkt neben `config_help_management_fee`, das main geändert hat («bis 3 %», «Art. 4 Abs. 3 VMWG»). Auflösung: die Zeile `config_help_distribution_key` von #452 nehmen, die Zeile `config_help_management_fee` von main.
- **Ohne Textkonflikt, aber inhaltlich zu prüfen:**
  - `fr.json`: main ändert `glossary_fee_text` (Zeile 102) und `glossary_balance_text`. Sie liegen nahe bei `glossary_allocable_*` (105–106), überlappen aber nicht.
  - main bringt mit `audit_empty_text` einen neuen fr-Text mit «caractère imputable». Das ist V-4/#461 und kein neuer Befund.
  - `i18n-begriffe.md`: main ergänzt «Eigener Satz» und «Satz des Abrechnungslaufs» und ändert «Gebäuderegister» und «Kosten des Gebäudes». Die Zeile 55 «Umlagefähig» (C-13) ändert main nicht. Eine Korrektur nach C-13 führt also zu keinem Konflikt.
  - `UBIQUITOUS_LANGUAGE.md`: main ergänzt «Gebäuderegister» und ändert «Eigener Satz». #452 ändert die Datei nicht, es gibt also keinen Konflikt.
- **Weitere Dateien, die beide Seiten ändern** (laut merge-tree ohne Konfliktmarker): `docs/nebenkostenabrechnung-anforderungen.md`, `src/__tests__/config-pages.test.ts`, `src/routes/invoices/+page.svelte`, `tests/e2e/features/statement-detail.feature`, `tests/e2e/fixtures/backend.ts`, `tests/e2e/steps/statement-detail.steps.ts`. Nach dem Merge laufen ihre Tests und Szenarien noch einmal.

## Bestätigt (Delta)

- Prompt: Regel 3 ergänzt Art. 5/6 VMWG, ohne Regel 1 zu widersprechen: Die Reparatur bleibt beim Vermieter. Die Dwello-Regel zur Verwaltungspauschale bleibt als Produktregel erhalten.
- ponytail: nichts zu kürzen, kein ungenutzter Code. Den Import `overwriteGetLocale` und `baseLocale` nutzen beide neuen Tests.
- Texte: Das Delta hat keine neuen Schlüssel. Geändert sind nur fr-Werte, die nach #405 nur fr betreffen. de, it und en ändern sich im Delta nur durch den Merge.
- Keine fremden Änderungen im eigenen Delta. Neu sind nur die zwei Berichte unter `docs/reviews/`.
- Selbst auf 0cee7aa0 ausgeführt: `bunx vitest run src/__tests__/category-allocability.dom.test.ts`: 9/9 grün. `bun test src/__tests__/category-allocability.pg.test.ts` (dwello_test_r452): 11/11 grün.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run type-check`, volle Backend-Suite (1040 pass, Coverage 93.9 %), `bunx vitest run` komplett (mit Zeitüberschreitungen in auth-routes, deepcheck und fallow-gate, einzeln grün), E2E chromium+api der zehn genannten Features samt a11y- und Sprachzeilen, «Kein Neuberechnen …» rot/grün, `llm:eval` 98/98/100 % (vorher 98/94/91 %). E2E und llm:eval habe ich wie vorgegeben nicht gestartet.
- Ob `chooseKey('Pro Fläche (m²)')` in jeder E2E-Datenlage eine passende Option findet: Die Option kommt aus den vordefinierten Schlüsseln. Geprüft habe ich das nur über die Szenarien, die sie schon erwarten (`invoice-detail.feature:15`, `invoice-edit.feature:30`), nicht durch einen Lauf.
- Rot ohne die Änderung: bei allen drei neuen bzw. geänderten Tests nur durch Lesen beurteilt.
- `implementation_plan.md` hat auf 0cee7aa0 keine Session für #452. Ob der Koordinator den Plan woanders führt, habe ich nicht geprüft; das gehört nicht zum Code-Review.
- Die Konfliktliste stützt sich auf `origin/main`, wie er im Worktree liegt (3db8976a). Später gemergte Änderungen sind nicht erfasst.
