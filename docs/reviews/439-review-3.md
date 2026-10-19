# Code-Review #439, Runde 3 (Abschlussrunde vor dem Push)

Worktree: `review-439-code3`, detached auf 026ab5f2. Delta: `dd42b948..890aaaae`, Merge 07377a38, `07377a38..026ab5f2` (ohne Reports, Plan, Archiv, Personas).

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|----|--------|-------|
| C-4 (Major) | erledigt | Neues Szenario «Nach erneuter Prüfung geht der Assistent zur Vorschau» (`tests/e2e/features/statement-agreed-costs.feature:111-117`). `openSettingsFor` wartet mit `Wait.forCount(agreementsLoading, 0)`, bis die gestörte Prüfung fehlgeschlagen ist. Danach folgt «Weiter» (rein clientseitig, synchron), dann `agreementsCheckAgain` (`FailRequests.noLonger`, Klick auf `agreements-retry`). Die Vorschau prüft eine Frage, die pollt. Ohne den `$effect` in `StatementWizard.svelte:122-124` bleibt der Assistent nach dem erneuten Laden in Schritt 3, und die Vorschau-Frage schlägt fehl. Rot also durch Lesen bestätigt. |
| C-5 (Minor) | bleibt im Report von Runde 2 | nicht Teil dieses Deltas |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Nit | tests/e2e/features/statement-agreed-costs.feature:116 | «die Prüfung erneut versucht, nachdem sie wieder geht» vermischt Systemzustand und Handlung in einem When und liest sich holprig. Das bestehende Muster trennt beides: `contract-edit.feature:86` «… sich wieder laden lassen» mit eigenem Schritt und eigener Task (`contractsLoadAgain`, `retryContracts`). |

Keine Blocker, keine Majors.

## Geprüft ohne Befund

- `AgreementsCheck.svelte`: nur `testid="agreements-retry"` am `Button` aus `src/lib/ui`. Die Prop `testid` gibt es (`Button.svelte:46`). Der Name ist kebab-case und hat Kontext.
- Screenplay-Schichten: Der Step ruft nur die Task auf, die Task nutzt nur Interactions und Target, das Target kapselt den Locator. Die Task ist eine fachliche Tätigkeit. Auf den asynchronen Schritt folgt eine pollende Frage, es gibt also keine zwei Klicks hintereinander auf einen asynchronen Schritt.
- Failure-State-Regel (`tests/e2e/CLAUDE.md`, Rules): Die Störung wird vor dem Laden gesetzt und mit `FailRequests.noLonger` aufgehoben. Das Szenario ist nicht `@api`. Es legt seine Daten selbst an (Seed «Rosenhof», «Anna Keller»).
- Neue UI-Zustände oder Texte: keine. Der Wartehinweis und die Alert-Zustände stammen aus früheren Runden. Darum keine neuen Einträge in `screens.json` oder in den a11y-/Sprachen-Features.
- Merge 07377a38: `git diff 890aaaae 07377a38^1` ist leer. `git show --remerge-diff 07377a38` zeigt keine Konfliktauflösung. Die Dateien aus main (`+page.server.ts`-Loads, `building-lists-load.test.ts` usw.) berühren #439 nicht.
- `messages/fr.json:778`: In «« Réessayer »» stehen jetzt geschützte Leerzeichen (U+00A0), wie in `statements_agreements_failed_text` (geprüft mit `od -c`). Der Wortlaut ist unverändert. Das ist ein Folgefix zum Merge-Lauf und gehört zur Anforderung, denn der Text stammt aus #439.
- Nichts Fremdes im Delta, keine Umformatierung von unberührtem Code.

## Nicht bestätigt

- lint, check, backend type-check, `bunx vitest run` (auch `i18n.test.ts`, 29 bestanden) und die E2E-Läufe (chromium) beider Szenarien: vom Aufrufer gemeldet. Den Lauf von `i18n.test.ts` wollte ich wiederholen, die Berechtigung dafür wurde abgelehnt. Stattdessen habe ich die Bytes in `messages/fr.json` direkt geprüft.
- Den roten Lauf von C-4 mit abgeschaltetem `$effect` habe ich nicht selbst gesehen (vom Aufrufer gemeldet). Durch Lesen ist er plausibel, siehe oben.
