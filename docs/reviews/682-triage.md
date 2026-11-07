# #682 triage: list screens (filters, landmarks, headings)

Checked on branch `w-682` (= origin/main, 2026-11-07). The persona reports named in the issue: only
`sven-issue-159.md` exists in history (deleted in c893731, read from `c893731^`); `helga-issue-159.md` and
`marco-issue-159.md` were never committed, so findings are checked against Sven's report and the issue text.

Lists checked: buildings, apartments, tenants, contracts, invoices, statements, documents
(`src/routes/<area>/+page.svelte` and their filter components), `src/lib/ui/{EmptyState,ResultList,Field}.svelte`,
`src/lib/list-url.ts`, `src/routes/+layout.svelte`.

## 1. Two «Filter zurücksetzen» on an empty filtered list

**Holds (partly).** The different focus Sven reported (P-1) is fixed: `isListNavigation` (`src/lib/list-url.ts:22-25`,
#681) counts the empty state's link, and `+layout.svelte:61-69` focuses `[data-results]` after it. Still two controls
with the same name on the same screen, one a button (or link) in the form, one the EmptyState's primary link:

- buildings: form button `buildings/+page.svelte:74-78` (shown while `searchTerm || cityFilter`) + EmptyState link `:85-92`
- apartments: `ApartmentFilters.svelte:82-84` + `apartments/+page.svelte:53-63`
- tenants: `TenantFilters.svelte:61` (link) + `tenants/+page.svelte:39-46`
- contracts: `ContractFilters.svelte:92` (link) + `contracts/+page.svelte:40-47`
- invoices: `InvoiceSearch.svelte:100-102` + `invoices/+page.svelte:107-114` (Sven P-4's missing link is fixed)
- statements: `StatementSearch.svelte:68-72` + `statements/+page.svelte:176-183`

Also: on buildings, apartments and invoices the form button's visibility follows the form state, not the address
(`ApartmentFilters.svelte:21`, `InvoiceSearch.svelte:34`, `buildings/+page.svelte:74`), so it appears after choosing a
filter before «Suchen» (Sven, note on invoices).

**Fix:** pass the empty state a flag (or simply hide the form's reset) while the filtered empty state shows.
**Decision:** which one to keep.
- A (recommended): keep the EmptyState link (right after the message, 1 Tab; E2E `showAllApartments` and the statements
  scenarios at `contract-detail.feature:332` use it), hide the form's reset while the list is empty.
- B: keep only the form's reset, EmptyState without action (Sven P-4 asked for the link after the text: worse).
- C: keep both, rename the EmptyState one («Alle Wohnungen anzeigen»): new texts in 4 languages × 6 lists.

## 2. Invoice filters without frame and without search landmark

**Holds**, and also on statements. `InvoiceSearch.svelte:47` `<form onsubmit class="grid …">`: no `role="search"`, no
panel classes. `StatementSearch.svelte:33` the same. Buildings/apartments/tenants/contracts use
`role="search" class="… rounded-panel border border-line bg-surface p-6"`.
**Fix:** add `role="search"` and the panel classes to both forms (the grid moves into an inner div as in
`ApartmentFilters.svelte:47`). No decision; a visual change of two screens (persona round, axe rows unchanged).

## 3. Search landmarks without a name

**Holds** on all six lists: none of the `role="search"` forms has `aria-label`/`aria-labelledby`
(`buildings/+page.svelte:44-49`, `ApartmentFilters.svelte:42-46`, `TenantFilters.svelte:19-23`,
`ContractFilters.svelte:45-49`; invoices/statements after fix 2). Documents' filter is a labelled `nav`
(`documents/+page.svelte:83`) plus a select outside any landmark (`:98-116`).
**Fix:** `aria-label` with one new message, e.g. `list_search_label` «Suche und Filter» (de/fr/it/en).
**Decision (small):** one shared name (recommended) vs. one per list («Wohnungen suchen» …, 6 new texts × 4).
Documents: leave as is (recommended), or wrap the tenant select in the same search landmark.

## 4. Count heading names the total while the rest is on page 2

**Fixed on apartments** (#670, `apartments/+page.svelte:19-29`, `apartments.feature:26`). **Holds** on buildings
(page size 10), tenants (12), contracts (12), invoices (20), statements (10): headings use only `count: data.total`
(`buildings/+page.svelte:107`, `tenants/+page.svelte:61`, `contracts/+page.svelte:62`, `invoices/+page.svelte:128`,
`statements/+page.svelte:197`). The page number is only in `Pagination` after the list.
**Fix:** move the apartments heading logic into `ResultList` (it has `page`, `pageSize`, `total`; pass the shown count
and the two message variants) and use it on all lists; new messages `<area>_count_page_{one,many}` for 5 lists × 4
languages. **Decision:** A (recommended) the #670 form «Gebäude 1–10 von 23, Seite 1 von 3» on every list;
B only «…, Seite 1 von 3» appended (fewer texts); C leave other lists (only apartments had it in the report).

## 5. Apartment search hint only a placeholder

**Fixed on apartments**: visible help `apartments_search_help` (`ApartmentFilters.svelte:52`). **Holds on buildings**:
`placeholder={m.buildings_search_placeholder()}` «Name oder Adresse» and city placeholder «Zürich», no help
(`buildings/+page.svelte:56,65`), against the rule "help text at the field". All other lists have `help`.
**Fix:** `help` instead of `placeholder` on the buildings search (reuse the text as a sentence, e.g. «Suchen Sie nach
Name oder Adresse des Gebäudes.»), drop the «Zürich» placeholder or turn it into `example`. No decision beyond the
wording (4 languages).

## 6. A filter choice alone does not change the list

**Holds** on buildings (text only), apartments, tenants, contracts, invoices, statements (building): selects apply on
«Suchen» (`ApartmentFilters.svelte:65,75` only set state; `InvoiceSearch.svelte:56-95` bind; tenants/contracts/statements
plain GET forms). Applies on change: documents tenant select (`documents/+page.svelte:36-40`, #662/#677), the statements
status tiles (links).
**Decision:**
- A (recommended): keep «Suchen» on lists with a search field (one action, GET forms work before hydration, #754/#869;
  typing then choosing does not reload twice); fix only the reset that shows before «Suchen» (see 1, derive from the
  address). Document the rule in `design-decisions.md`.
- B: selects apply on change on all lists (as documents); the form then sends the typed term too, needs JS for
  GET-form lists or a `requestSubmit()` on change; more E2E change (scenarios that pick then click «Suchen» stay valid).

## 7. `&page=1` after every search

**Holds** on apartments and invoices: `listSearchUrl` sets `page=1` (`src/lib/list-url.ts:4`), used at
`ApartmentFilters.svelte:33`, `InvoiceSearch.svelte:38`. Also «Vorherige Seite» to page 1 via `listPageUrl`
(`list-url.ts:11-14`). GET-form lists (buildings, tenants, contracts, statements) send no `page`.
**Fix:** `params.delete('page')` instead of `set('page','1')`; in `listPageUrl` delete it for page 1. Unit tests to
update: `list-url.test.ts:7,12`, `apartments-pages.dom.test.ts:182`, `invoice-pages.dom.test.ts:152`,
`ui-pagination.dom.test.ts:14`. No scenario reads the URL. No decision.

## 8. Every filter label ends in «(optional)»

**Holds** where `optional` is passed: buildings (2), apartments (3), invoices (5), statements (2)
(`Field.svelte:98`, `ui_optional`). Tenants, contracts and documents show no «(optional)» — inconsistent already.
**Decision:** A (recommended) drop `optional` on search/filter fields (a filter is never required; tenants/contracts do
so already; the forms rule "optional marked" is about data entry); B keep everywhere and add it on tenants/contracts;
C keep. Note `TextInput` sets `aria-required={!optional}` (`TextInput.svelte:64`): without `optional` the search
field would be announced as required, so A needs a `required={false}`/separate prop or Field-only label change.

## 9. Count heading and entries both level 2

**Holds** on buildings (`BuildingCard.svelte:29`) and apartments (`ApartmentCard.svelte:34`) under the `h2` of
`ResultList.svelte:30` / `EmptyState.svelte:30`. Tenants/contracts/statements rows have no headings; invoices group
titles are `h3` (`InvoiceItems.svelte:29`).
**Fix:** `h3` in both cards (same classes). No decision.

## 10. 19 Tabs to the search field

**Mostly no longer holds.** The skip link «Zum Inhalt springen» (`+layout.svelte:81-86`) leads to `main`; from there
Tab reaches the page's primary action, then the search field (2 Tabs). Sven's complaint "after every page change,
back or reset I start at the top" is fixed by #681: list navigations focus the results heading
(`+layout.svelte:61-69`, `list-url.ts:22-25`), from which the search is a few Shift+Tab away.
**Decision:** A (recommended) no change, close the point as covered by the skip link and #681; B a second skip link
«Zur Suche» on list pages (new text, layout change); C point the skip link at the search form on lists (breaks the
#675 rule that it leads to the h1).

## Process notes

Changed screens (2, 4, 5, 8 visible) need a persona round; existing `tests/a11y/screens.json` rows for the lists keep
their states (no new states unless 1-C). Scenarios: 1, 4, 5, 6-B are visible behaviour and need `@wip` scenarios;
7, 9, 3, 2 can be lower-layer (DOM) tests, with scenarios in `accessibility.feature` already covering axe.
