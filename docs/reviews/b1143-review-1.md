# Code-Review b1143, Runde 1

Bereich: `git diff 75b78a9 ea8df3c` (48a8a57, ea8df3c), Worktree review-b1143-code.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Der Text `contracts_delete_draft_contracts_unknown` in allen vier `messages/*.json` stimmt Wort für Wort mit der Tabelle in `docs/reviews/b1143-fachreview-1.md` überein, V-1 ist übernommen. Im Französischen stehen U+00A0 vor «:» und innerhalb « … », dazu U+2019. Der Text verwendet die Wörter aus #666 («frei» / «libre» / «libero» / «free», «Die anderen Mietverträge dieser Wohnung liessen sich nicht laden», messages/de.json:2020–2021) und enthält keine Klick- oder Tipp-Anweisung. Die Knopfbeschriftung entspricht in allen vier Sprachen `contracts_apartment_contracts_retry`. Der Text wird nur an einer Stelle gezeigt (ContractForm.svelte:240). Der alte Text steht sonst nur noch in archivierten Review-Berichten. Die Szenariozeile `contract-edit.feature:239` und der DOM-Test `contract-edit.dom.test.ts:838–844` halten den neuen Text fest und schlagen auf der Basis beim Lesen fehl. Beide Commit-Nachrichten tragen `Spec change approved: #1143`. Der Diff enthält nichts, was nicht zur Anforderung gehört. Die Code-Kommentare in Test und Szenario stimmen weiterhin.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check` und Prettier auf neuen Dateien: vom Aufrufer gemeldet.
- `bunx vitest run` auf contract-edit.dom.test.ts, i18n.test.ts, backend-codes.test.ts, no-german-in-code.test.ts, privacy-*.dom.test.ts, open-work.test.ts und `--changed origin/main`: vom Aufrufer gemeldet.
- Roter Lauf von DOM-Test und Szenario vor der Änderung der messages, danach grün; E2E `--project=chromium -g "Mietvertrag bearbeiten|Bildschirm ohne .* contract-edit"` mit 110 passed: vom Aufrufer gemeldet.
- `Spec change approved: #1143` im Text des Pull Requests: Es gibt noch keinen Pull Request. Die Zeile steht bisher nur in den Commit-Nachrichten.
- Der Entscheid des Product Owners in #1143 (Szenariozeile darf sich ändern): Das Issue habe ich nicht gelesen. Die Grundlage ist die Angabe des Aufrufers und der Abschnitt «Nicht bestätigt» des Fach-Reviews.
