# #688 triage: focus and announcements on the agreements check retry

Read-only triage on `w-688` at `a46bf5c` (origin/main). No code, messages or scenarios changed.

## Sources

- Issue text = row U-40 of `docs/archive/offene-punkte.md:48`, unchanged.
- The persona reports of #439 (Sven P-2, P-5; Helga P-3) could not be read: the clone is shallow
  (`git rev-parse --is-shallow-repository` = true, graft at `ebc0708`, PR #849), no path containing `439` exists in
  the reachable history, and none of the reachable `sven-*`/`helga-*` reports mentions the agreements check (they are
  about the contracts retry of #669/#1153). Deepening the clone was not done (shared `.git`, read-only task). The
  findings below are confirmed from the code instead.

## Point 1 (Sven P-2, Major): focus falls to `body` on «Erneut versuchen»

**Holds.**

- `src/routes/statements/generate/AgreedCosts.svelte:74`: `onretry={() => attempt++}`.
- `AgreedCosts.svelte:42-44`: the effect sets `status = 'loading'` on every attempt.
- `src/routes/statements/generate/AgreementsCheck.svelte:19-28`: the Alert with the button renders only
  `{#if status === 'failed'}`, so the focused button `agreements-retry` is removed while loading; nothing moves the
  focus (the wizard focuses only the step heading on `goTo`, `StatementWizard.svelte:174-183`).
- On success the check renders nothing (`AgreementsCheck.svelte` has no `loaded` branch); on failure the Alert is
  mounted anew, focus still on `body`.

## Point 2 (Sven P-5): a success after the retry is not announced

**Holds.**

- While loading, the wizard's live region says `statements_agreements_loading`
  (`StatementWizard.svelte:92-94`, `:115`, rendered `:287`, role=status), so the retry start is announced.
- Once loaded, `statusText` falls back to `createdText`, which is `''` before drafts exist (`:108-115`): the region
  empties, nothing says the check succeeded. The questions Alert (`AgreedCosts.svelte:77`, tone caution) and the
  not-agreed Alert (`:101`) have no role (`src/lib/ui/Alert.svelte:30`: only `critical` gets `role="alert"`), so
  their appearance is silent too.
- Not affected: the «Weiter»-first path. There the wizard submits once the check passes
  (`StatementWizard.svelte:169-172`) and the step heading of the preview takes the focus; scenario
  `statement-agreed-costs.feature:112` covers it.

## Point 3 (Helga P-3): a failed retry shows the same alert, no sign Dwello tried again

**Holds.** A failed retry flips `loading -> failed`; `AgreementsCheck.svelte:20-27` shows the identical title and
text (`messages/de.json:913-915`). Visually the alert blinks out and back; a screen reader hears the identical alert
again. No text says it was a second attempt. (Only after «Weiter» does `agreements-wait` change between
`statements_agreements_wait` and `_wait_failed`, `AgreementsCheck.svelte:29-33`, which still does not say "again".)

## Proposed smallest fix (one slice)

Follow the existing precedent of the contracts retry (#669, `src/routes/contracts/ContractsUnknown.svelte`, `retried()`):
keep the button while it loads, say the result, move the focus only when the button goes away.

1. `AgreedCosts.svelte`: remember that the check failed once (`let retried = $state(false)`, set in `onretry`), pass
   it to `AgreementsCheck`.
2. `AgreementsCheck.svelte`:
   - render the Alert while `status === 'failed' || (retried && status === 'loading')`, the button with
     `busy={status === 'loading'}` (`src/lib/ui/Button.svelte` keeps the focus when busy: aria-disabled, #677). This
     answers P-2 for the loading phase and P-3's blink.
   - after a failed retry, the Alert text says it tried again: new message, e.g.
     `statements_agreements_retry_failed`: «Dwello hat es erneut versucht und konnte die Mietverträge wieder nicht
     prüfen. Versuchen Sie es später noch einmal.» (de/fr/it/en). Focus stays on the button.
   - after a successful retry: a status line in the check (`<p role="status" tabindex="-1">`, visible,
     testid `agreements-checked`) with e.g. «Die Mietverträge sind geprüft.» and, when questions follow, «Beantworten
     Sie die Fragen unten.»; focus moves to it with `await tick(); el.focus()` (the issue's "status line").
3. Tests (red first): `src/__tests__/agreed-costs.dom.test.ts` (extend the case at `:139-154`): focus is not
   `document.body` while loading and after success; the success line; the retry-failed text. E2E in
   `tests/e2e/features/statement-agreed-costs.feature`: two `@wip` scenarios (retry fails again -> the alert says it
   tried again and the focus is on «Erneut versuchen»; retry succeeds -> the check says it is done and holds the
   focus), reusing `agreementsCannotBeChecked`/`agreementsCheckAgain` (`tests/e2e/tasks/statement-generate.ts:170`);
   a step for "retry while it still fails" is new.
4. Process: the failed-retry alert is a new variant with its own text: add `agreements-retry-failed` (and
   `agreements-checked` if the status line stays visible) to `tests/a11y/screens.json` (next to `:90`, `:680`, `:690`),
   `accessibility.feature:213` and `sprachen-bildschirme.feature:214`, with a task in
   `tests/e2e/tasks/accessibility.ts:569`. Feature review: personas Sven and Helga. No `fach-reviewer` (no domain rule,
   term or amount; «Mietvertrag» is an existing term).

Existing tests unaffected: `agreed-costs.dom.test.ts:152` (`agreements-failed` gone after success) still holds; the
«Weiter»-first scenario (`:112`) is unchanged.

## Product-owner decisions

None strictly needed: the issue's «Done means» fixes the behaviour, the wording is ordinary copy under the Design-Regeln.
One choice the implementer makes and should name in the pull request (no `needs-decision` unless the PO wants it):

- Where the focus goes after a successful retry:
  1. **(recommended)** the check's status line, as the issue suggests; it reads the result and sits right above the
     questions, so the next Tab reaches them.
  2. the first question's radio / the not-agreed alert: one step shorter, but nothing names the result when the
     check finds nothing to ask.
  3. the step heading, like the contracts retry: consistent with #669, but jumps away from the place the landlord was.
