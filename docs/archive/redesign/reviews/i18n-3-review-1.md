# i18n step 3 – review 1

Scope: commit b63e6ac (apartments, tenants, their server modules, tenant languages, contract availability). Independent read-only reviewer. Result: 0 blockers, 0 majors, 4 minors. Verified: German wording identical incl. split and plural keys, no module-level texts, stored tenant language codes unchanged, terms per table, reused keys read correctly in context, 112 related unit tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | Room labels always plural («1 pièces», «1 rooms»; Swiss French writes «1,5 pièce») | `roomsLabel` in `apartment.ts` picks `buildings_rooms_one` by `Intl.PluralRules` of the UI language; used in the apartment card, form and building floors; test in `tenants-i18n.test.ts` (failed first) |
| 2 | Minor | it «Trasloco il» for «Einzug am» is ambiguous | «Entrata il» |
| 3 | Minor | «Contrat de bail Appartement 3.01» capital mid-phrase | fr/it/en with a dash: «Contrat de bail – Appartement 3.01» |
| 4 | Nit | fr/it form examples mix a local name with Winterthur 8400 | Kept: a place name is not UI text |

Step 3 closed after review 2.
