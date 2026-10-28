

## Session: #654 Checkbox and RadioGroup errors, date picker

- [x] `@wip` scenario «Die Meldung verschwindet, sobald der Irrtum bestätigt ist» (`contract-detail.feature`), seen red (the dialog still showed 1 error)
- [x] Each radio option's explanation is read once (`ui-choices.dom.test.ts`)
- [x] A Checkbox error disappears once the box is changed, and shows again on the next submit
- [x] A RadioGroup error disappears once the choice is changed (`sent-error.svelte.ts` notes the change in the capture phase, before a caller whose error follows from the choice, `AgreementQuestion`, sees the new value); category radio target in `tests/e2e/targets/categories.ts` now finds the option by its exact name
- [x] Native date picker checked with a screen reader (persona Sven, `sven-i654.md`): the calendar button is named, the picker takes arrow keys, Enter and Escape and the field announces the date, typing works without it; what a screen reader announces inside the browser's own picker cannot be judged in headless Chromium (recorded, not fixed); Sven's P-1 is review C-1, already fixed
- [x] Slice review round 1: `docs/reviews/i654-review-1.md`; C-1 (Major: the delete dialog checks outside a form, so the error stayed hidden after untick) fixed in `DeleteContract.svelte` (`contract-detail-page.dom.test.ts`), C-2 and C-3 (comments) fixed
- [x] Review round 2 (C-1 fix, closing): `docs/reviews/i654-review-2.md`, C-1 to C-3 closed, nothing open; contract-detail.feature green after the fix
- [x] PR `Fixes #654`: pushed after this archive
