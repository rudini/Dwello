# Code-Review 6: Konfliktlösung Merge 1df51c46 (PR #518, #450/#490)

Geprüft: `git show --remerge-diff 1df51c46`, Merge-Basis 3add3b59, `git diff 3add3b59..1df51c46^2` (main, u. a. #517 facddbb6, #494 86f13870).

## Befunde

| ID | Schweregrad | Datei:Zeile | Befund |
|----|-------------|-------------|--------|
| – | – | – | Keine Befunde. |

## Belege

- **Konflikt in `notes`** (backend/src/services/pdf.service.ts:991-994): Die Auflösung behält `const contact = senderParts(config).join(', ');` (Branch) und übernimmt die Entfernung von `// TODO(fachlich prüfen, #369)` (main). `grep -rn "#369\|#362" src backend/src tests`: kein Treffer.
- **Hat main den Text der Bemerkungen geändert?** Nein. In pdf.service.ts ändert main nur: die it-Texte `totalAmount`, `sharesNote`, `sharesNoteFuel` («Costi dell’immobile»), die Entfernung von TODO #362 bei `priorLine` und die Entfernung von TODO #369 in `notes`. Die `agreedCosts`-Texte (Zeilen 129/229/329/429, de/fr/it/en) hat main nicht verändert; in `notes` bleibt `contact` auf main die alte Template-Zeile. `git diff 1df51c46^2 1df51c46 -- backend/src/services/pdf.service.ts` zeigt nur die Branch-Änderungen (`senderParts`, `notes`, `frame`).
- **Sind die main-Änderungen in der Auflösung erhalten?** Ja. Für alle zehn Dateien, die beide Seiten geändert haben (pdf.service.ts, messages/{de,fr,it,en}.json, config-pages.test.ts, AgreedCategories.svelte, settings.feature, tests/e2e/fixtures/backend.ts, implementation-plan-verlauf.md), stimmen die geänderten Zeilen von `merge-base..main` mit denen von `1df51c46^1..1df51c46` überein (sortiert verglichen). Über alles: beide Diffs haben 51 Dateien, 803+/152-.
- **Berührt main deine Änderungen?** Nein. Im main-Diff gibt es keine geänderte Zeile mit `companyName`, `postalCode`, `config.address`, `config.city`, `qrBillConfig`, `iban`, `senderParts` oder `settings_sender`. Die Absenderzeile in `frame` (Zeile 1133), `qr-bill.service.ts` (Zeilen 344-372), die Einstellungen und `seed.iban` kommen nur vom Branch. Ein anderer Ort, der die Adresse noch als Template baut, ist in `backend/src` (ohne Tests) nicht hinzugekommen.

## Nicht bestätigt

- backend type-check, `bun test` (1038 grün), lint, check, vitest (3228 grün) auf 1df51c46: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- E2E wurde wie vereinbart nicht ausgeführt. Ob die main-Änderungen an `sendStatement`/`markPaid` (fixtures/backend.ts) zusammen mit den Szenarien des Branches laufen, ist nur durch Lesen geprüft: Der neue Parameter `which` ist optional, und der Standardwert verhält sich wie bisher.
