# Triage #687: «Nicht umlagefähig» neutral in list, detail and form

Read-only triage on `w-687` at `a46bf5c` (origin/main). The persona reports the issue cites were deleted in
`b87f03a47a` ("docs(config): delete persona reports none cite"); read from `b87f03a47a^` via the GitHub API (the
local clone is shallow): `docs/design/personas/weber-292.md`, `docs/design/personas/helga-292.md`.

Decision in the issue (product owner, 2026-10-17): «Nicht umlagefähig» is neutral, without a warning, on all three
screens; a grey badge in list and detail, a neutral note instead of the yellow box in the edit form.

## Points

### 1. List badge yellow with warning triangle (Weber P-1 Major, Helga P-5) — still holds

- `src/routes/invoices/InvoiceRow.svelte:57-60`: `tone={invoice.isValidUtilityCost ? 'positive' : 'caution'}`, label
  `m.invoices_not_allocable()` = «Nicht umlagefähig» (fr «Non répercutable», it «Non addebitabile», en «Not allocable»).
- `caution` = `bg-caution-soft border-caution`, icon `warning` (`src/lib/ui/tone.ts:9`).
- The issue names `src/routes/invoices/+page.svelte`; the badge is in `InvoiceRow.svelte` (follow the code, say so in
  the PR).
- Fix: `'caution'` -> `'neutral'` (`bg-sunken border-line-strong`, icon `info`, `tone.ts:11`). Precedent: the category
  list already does exactly this, `src/routes/config/categories/CategoryRow.svelte:42`.

### 2. Detail badge yellow with warning triangle (Weber P-1, Helga P-5) — still holds

- `src/routes/invoices/[id]/CategorizationPanel.svelte:63-68`, same `'caution'` tone.
- Fix: same one-word change to `'neutral'`.

### 3. Edit form: yellow box «Nicht umlagefähige Kategorie» (Weber P-1) — still holds

- `src/routes/invoices/InvoiceCategoryFields.svelte:133-139`: `<Alert tone="caution" title={m.invoices_category_not_allocable()}>`
  with `m.invoices_category_not_allocable_text()`. Shown whenever the chosen category is not allocable (`:57`), next to
  the disabled checkbox that already says «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» (`:126`).
- Texts: title «Nicht umlagefähige Kategorie»; text «Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung)
  können nicht auf Mieter umgelegt werden.» (fr/it/en present).
- The component is shared: «Rechnung bearbeiten», «Neue Rechnung» and the upload dialog (`UploadRowFields.svelte`)
  all change.
- `Alert` refuses `neutral` (`src/lib/ui/Alert.svelte:16`, `Exclude<Tone, 'neutral'>`).
- Smallest fix: replace the `Alert` with a plain muted note, keeping testid, id and texts, e.g.
  `<div data-testid="invoice-category-warning"><p class="font-semibold text-ink">{title}</p><p id=… class="text-ink-muted">{text}</p></div>`
  (same pattern as `CategoryReason.svelte` with `id`). Alternative: allow `neutral` in `Alert`; larger and touches a
  shared component, not recommended.
- Keep the text: the non-`@wip` scenario `tests/e2e/features/invoice-new.feature:28` «Nicht umlagefähige Kategorie
  wählen» checks it (`tests/e2e/steps/invoice-form.steps.ts:116-118`, `toContain('nicht auf Mieter umgelegt')`) and
  the DOM test `src/__tests__/invoice-pages.dom.test.ts:822`. Changing the text is a spec change.
- Optional cleanup: the target label «Warnung nicht umlagefähige Kategorie» (`tests/e2e/targets/invoice-form.ts:13`)
  and the testid name say «warning»; renaming is cosmetic and touches the step, so leave it.

### 4. General text instead of the category reason; «können nicht» too absolute (Weber P-3 Minor) — still holds; PO decision

- The detail page shows the reason of the category (`CategoryReason`, `CategorizationPanel.svelte:73`); the form
  shows the general sentence above.
- **Decision needed** (the issue decides the tone, not the text):
  1. (recommended) Keep the general text now (point 3); open a follow-up issue for P-3. Keeps the scenario, no
     `fach-reviewer` needed.
  2. Show `<CategoryReason category={selectedCategory} id=…>` in the form for predefined categories, the general
     text only for own ones. Changes what the scenario at `invoice-new.feature:28` sees for «Reparaturen» (reason
     «… mit dem Mietzins abgegolten, also nicht umlagefähig» does not contain «nicht auf Mieter umgelegt»): needs
     `Spec change approved: #<n>` and `fach-reviewer`.

### 5. Detail: yellow box «Nicht in der Nebenkostenabrechnung» — not named in the issue; PO decision

- `src/routes/invoices/[id]/+page.svelte:111-117`: `<Alert tone="caution" title={m.invoices_legal_title()}>` with
  `m.invoices_legal_text()` («Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein. Typische nicht
  umlagefähige Kosten: …»). Shown when the invoice is not allocable and no reason is shown: an own non-allocable
  category, or an invoice taken out of an allocable category.
- For an own non-allocable category this is the same «warning for a correct state» the decision removes. Weber P-1
  suggests warning only when the invoice deviates from its category.
- **Decision needed** (does «all three screens» cover this box?):
  1. (recommended) Out of scope for #687; follow-up issue «warn only on deviation from the category». Keeps the
     diff to the three named places.
  2. In scope: neutral note for an own category, caution kept for a deviation. Needs a split in the condition, DOM
     tests (`invoice-pages.dom.test.ts:344-406`) and the scenario `invoice-detail.feature:40`; texts unchanged.

### 6. Help «Die Liste zeigt die Beschreibung vordefinierter Kategorien nicht.» (Helga P-6, U-35) — fixed

- The text no longer exists in `messages/de.json`. #672 (closed) rebuilt the description help,
  `src/routes/config/categories/CategoryForm.svelte:110-120`: predefined categories get
  «Die Beschreibung sagt, welche Kosten zu dieser Kategorie gehören.» + KI sentence + «Auf der Nebenkostenabrechnung
  steht sie nicht.»; the list sentence «Die Liste der Kategorien zeigt die Beschreibung unter dem Namen.» shows only
  for own categories. Nothing to do; say so in the PR.

### 7. Hard words «abgegolten», «gebrauchstauglich» (Helga P-7 Nit) — still holds; PO decision, `fach-reviewer`

- `messages/de.json:1735` `categories_reason_repairs` («… in gebrauchstauglichem Zustand erhalten … Reparaturen sind
  mit dem Mietzins abgegolten …»), `:1738` mortgage, `:1739` administration, `:1740` renovation; also «Vollservicevertrag»
  (`:1728`) and «Verzinsung und Abschreibung der Anlage» (`:1723`). These are reviewed legal reasons
  (`docs/reviews/292-fachreview-1.md`), shown on the category list/form and invoice detail.
- No open issue covers them (REST search «abgegolten», «gebrauchstauglich»: only #687).
- **Decision needed**:
  1. (recommended) Split off into its own issue (domain texts in four languages, `fach-reviewer` round); #687 stays a
     pure presentation change.
  2. Do it in #687: `fach-reviewer` before implementing (CLAUDE.md Workflow 1), all four languages, Helga's
     proposals («ist in der Miete schon enthalten», «so, dass man darin gut wohnen kann») as input.

## Smallest change for #687 (with options 1 everywhere)

- `InvoiceRow.svelte:58` and `CategorizationPanel.svelte:64`: `'caution'` -> `'neutral'`.
- `InvoiceCategoryFields.svelte:133-139`: `Alert` -> plain neutral note, same testid, id and texts; drop the `Alert`
  import if unused.
- `Badge.svelte` needs no change.
- Tests: a DOM test per place that the non-allocable badge/note has no warning icon/caution class (seen red first);
  a new `@wip` scenario, e.g. in `invoices.feature` / `invoice-detail.feature` / `invoice-new.feature`, «zeigt
  «Nicht umlagefähig» ohne Warnung» (steps need a check of the absence of the warning icon via a testid or
  accessible name, not CSS).
- No new screen state (`tests/a11y/screens.json` unchanged); persona check after (Weber, Helga on «Sanitär Keller AG»).
- Domain terms and texts: unchanged, so no `fach-reviewer` and no `messages/*.json` change. Options 2 of points 4 and
  7 would change texts and need `fach-reviewer`.
