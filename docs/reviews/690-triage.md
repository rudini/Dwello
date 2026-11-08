# Triage #690: warn about a missing Firmenadresse before saving or opening a PDF

Read-only triage on `w-690` at `a46bf5c` (origin/main). Nothing changed besides this file.

Sources: `docs/design/personas/helga-450.md` and `weber-450.md` were deleted in `c893731` («delete analysed review
reports»); read with `git show c893731^:docs/design/personas/{helga,weber}-450.md`.

- Helga 450, Beobachtungen: «Gespeichert wurde aber gar nichts, auch nicht die Mahnfrist. Dass «nichts» gespeichert
  wurde, steht nirgends ausdrücklich. Eine Meldung oben auf der Seite gibt es nicht.»
- Weber 450, Beobachtungen: «Die Ablehnung ist eine nackte Seite ohne Navigation der App … Sie öffnet im selben Tab» and
  «Vorher warnt mich nichts: Die Seite der Abrechnung, die Übersicht und die Einstellungen zeigen keinen Hinweis …».

## Point 1: no warning before saving or opening a PDF — still holds

Evidence:

- Settings: the empty fields are marked only from a refused save. `src/routes/config/+page.svelte:23`
  `missing = form?.missing ?? []`, used by `namedBy` (`:25-30`) for `invalidBy` of Firmenname, PLZ, Ort and the
  Kontoinhaber fields. `form` exists only after a POST, so on load nothing is marked. The only hint is the last sentence
  of `settings_iban_help` (`messages/de.json:1652`): «… Mit einer IBAN braucht es Firmenname, PLZ und Ort.»
- Statement page: `src/routes/statements/[id]/+page.server.ts` loads no settings; `+page.svelte` and
  `PdfAction.svelte` have no settings or IBAN check (grep for `iban|settings|company` finds nothing). The dashboard has
  only `KiModelNotice` (`src/routes/dashboard/+page.server.ts:98`).
- The rules: save, `backend/src/services/config.service.ts:205-217` (`IBAN_COMPANY_ADDRESS_MISSING`,
  `ACCOUNT_HOLDER_MISSING`, with `params.missing`); PDF, `backend/src/services/qr-bill.service.ts:347-350`
  (`CREDITOR_ADDRESS_MISSING`, for the Kontoinhaber or else the Absender), reached only when the PDF has a Zahlteil
  (`pdf.service.ts:896` `owed`: Saldo > 0, not carried over or waived, not paid) or a Mahnung (`addPaymentPart`, `:854`).

Smallest fix:

1. Settings: in `src/routes/config/+page.server.ts` `load`, compute the stored `missing` (IBAN set, and Firmenname, PLZ
   or Ort empty; with «Kontoinhaber ist der Absender» cleared also the Kontoinhaber's) and have the page use
   `form?.missing ?? data.missing`; show the existing refusal text at the IBAN field (`errors.iban ?? data.ibanHint`).
   Better one rule than two: expose the check from the backend (e.g. `GET /config` returns `creditorMissing` from the
   existing `creditorMissing()`), so BFF and backend cannot drift. Needs a contract update in `tests/contracts/`.
2. Statement page: a `caution` Alert in the pattern of `OldAddressWarning.svelte` (shown at `+page.svelte:242`), when
   the statement would get a Zahlteil and the creditor address is incomplete, with the link «Zu den Einstellungen»
   (`documents_to_settings`). The load needs the settings (or the flag from step 1).

Decision needed (product owner), D1, settings hint:
- **a (recommended):** on load, mark the empty fields as after a refused save and show the existing text
  `backend_iban_company_address_missing` / `backend_account_holder_missing` at the field. No new text.
- b: a caution Alert at the top of the page with a new text naming the missing fields.

D2, statement page hint:
- **a (recommended):** only on a statement whose PDF or Mahnung would get a Zahlteil (the `owed` rule), text reused
  from `backend_creditor_address_missing` plus the link «Zu den Einstellungen».
- b: on every statement while the address is incomplete (also refunds, whose PDF prints a header without Ort, Weber 450
  P-1).

## Point 2: refusal is a bare page outside the app — fixed by #734

`pdfRefusal` (`src/lib/server/statement.ts:263-281`) now answers 303 to `/documents/refused`, a page inside the app
frame (`src/routes/documents/refused/+page.svelte`, root layout `src/routes/+layout.svelte:72,99`). It names the cause
from the code (`backendMessage`, `+page.server.ts:33-38`), leads back to the statement it came from (referer, `back`)
and, for `CREDITOR_ADDRESS_MISSING`, `IBAN_MISSING` and `IBAN_INVALID`, links «Zu den Einstellungen»
(`SETTINGS_CODES`, `+page.server.ts:6,52`). In `tests/a11y/screens.json:894-899` (`documents-refused-settings`).

Still the same tab (`PdfAction.svelte:32-36`, `href="/statements/{id}/pdf"`), but «Done means» allows either. Proposed:
close this point as done by #734, no change. Opening in a new tab would contradict #125 and leave a refusal tab without
the statement behind it. Gap: no E2E scenario reaches the refusal with `CREDITOR_ADDRESS_MISSING` and checks the
settings link (grep `pdf-refusal-settings` in `tests/` finds nothing); worth one pinning scenario (kept behaviour, no
red run needed).

D3 (only if the product owner wants more): a, recommended: accept #734 as the fix; b: also `target="_blank"` on the
download.

## Point 3: a refused save does not say nothing was saved — still holds

`src/lib/server/settings.ts:66-81`: a refusal with `causes` returns `fail(400, { errors: refusedFields({ causes }),
missing })`; every cause has a field (`iban`, `accountHolderName`, …), so `errors.form` stays unset. The Alert «Die
Einstellungen wurden nicht gespeichert» (`settings_not_saved`, `messages/de.json:1660`) shows only on `errors.form`
(`src/routes/config/+page.svelte:211-215`), i.e. only for `settings_save_failed`. The same holds for every field
refusal (invalid IBAN, deadlines), not only the address.

Smallest fix: show that Alert whenever the save was refused (`Object.keys(errors).length`), body `errors.form` or one
new text for field refusals. Focus stays on the first field (`focusFirstError`).

D4, wording:
- **a (recommended):** new body, e.g. «Keine Änderung wurde gespeichert, auch nicht in den anderen Feldern. Korrigieren
  Sie die markierten Felder und speichern Sie erneut.» (fr/it/en with it).
- b: the title alone, no body (needs `Alert` without children; title already says «nicht gespeichert», but not «auch
  nicht die Mahnfrist»).

## Related, not in this issue

- `backend_creditor_address_missing` says «Firmenadresse … Name, PLZ und Ort» also when an own Kontoinhaber (#1166) is
  incomplete (`qr-bill.service.ts:349`); a hint built on it would name the wrong block. Only reachable with data stored
  before #1166's save check; D2 should name the Kontoinhaber case.
- Weber 450: history «PDF erstellt» although the download is refused; «Als versendet markieren» stays clickable; refund
  PDF prints «8001» without Ort. No open issue found (REST search «Firmenadresse», «PDF erstellt»); not checked on
  current code.
- Helga 450 P-1/P-3 (message names no field, «Name» vs «Firmenname») are fixed by the field marks of #450; the backend
  text still says «Name».

## Texts and fach-reviewer

- D1a and D2a reuse existing texts: no new copy; D2 touches the terms Firmenadresse/Kontoinhaber/Zahlteil, so a short
  `fach-reviewer` round on the scenario is advised (step 1), mainly for the Kontoinhaber case.
- D4 adds one UI text in four languages: plain copy, no domain term; `fach-reviewer` not required, personas (Helga) in
  step 5.
- New states for `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`: settings with the
  hint on load, statement with the hint, settings after a refused field save (Alert now shown).
- Scenarios (new, `@wip`): `settings.feature` (hint on load; refused save says nothing was saved), `statement-detail.feature`
  (hint on a Nachzahlung). The existing «IBAN ohne Firmenadresse» (`settings.feature:60-67`) keeps holding.
