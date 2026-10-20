# Review 4 zu #455: Nachprüfung von C-8 und C-9

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w9-review-455-code-4`, detached auf 28d5f7f6.
Delta: `git diff 01539765 28d5f7f6 -- . ':!docs/reviews'`, ein Commit (28d5f7f6 «fix(invoices): name the deleted invoice in drafts»), 9 Dateien. Ich habe alle 9 gelesen.
Vorheriger Bericht: `docs/reviews/455-review-3.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Im Delta gibt es keine neuen Befunde. |

## Status der offenen IDs aus Review 3

- **C-8 (Major): erledigt.**
  - `src/routes/invoices/[id]/DeleteConsequences.svelte:17` setzt `data-testid="invoice-delete-billed-text"` auf den Absatz. Der Name ist kebab-case und nennt den Kontext.
  - Die Target steht in `tests/e2e/targets/invoice-upload.ts:58-60`, die Question `billedRuleOnDelete = Text.of(...)` in `tests/e2e/questions/invoice-upload.ts:58`. Die Question liefert den Text selbst.
  - Der Schritt steht in `tests/e2e/steps/invoice-upload.steps.ts:345-348`. Er ruft nur `verwalter.sees(question)` auf, also keine Page und keinen Locator. Damit hält er die Screenplay-Schichten ein. `toContain` wird auch in `dashboard.steps.ts:91` schon so verwendet.
  - Der Schritt steht in `tests/e2e/features/invoice-detail.feature:128`, im Szenario «Abgerechnete Rechnung mit Beleg löschen», ohne `@wip`. Er sagt, was die Bestätigung sagt, und nennt keine UI-Elemente.
  - Er nennt genau den Teil, der sich gegenüber der Branch-Basis 86f13870 geändert hat: die zwei neuen Sätze und «diese Rechnung». Der übrige Text bleibt durch den DOM-Test (`invoice-pages.dom.test.ts:367-369`) vollständig abgedeckt.
  - Der Schritt wird ohne die Änderung rot, das lese ich so aus dem Code: Ohne Testid findet die Target nichts. Mit «sie weiter» fehlt der Teilstring. Den roten Lauf selbst habe ich nicht gesehen.
- **C-9 (Minor): erledigt.**
  - de: `messages/de.json:954` sagt jetzt «Die Entwürfe enthalten diese Rechnung weiter: …». Das entspricht wörtlich dem Entscheid des Koordinators.
  - en: `messages/en.json:954` sagt «The drafts still include this invoice: …». Das entspricht der Fassung EN-20 aus #514. «offsets» bleibt so, wie es Review 3 als Konfliktpunkt mit #514 beschrieben hat. Das ist kein neuer Befund.
  - Der DOM-Test `invoice-pages.dom.test.ts:368` erwartet die neue de-Fassung.
- **C-3 (Minor): unverändert offen.** `src/lib/ui/Dialog.svelte` ist nicht im Delta.

## Satzzeichen (fr, en) bei den Schlüsseln des Branches

- **fr:** Ich habe alle 14 Schlüssel geprüft, die der Branch gegenüber 86f13870 in `messages/fr.json` hinzufügt oder ändert.
  - Vor «:» und «;» steht immer U+00A0.
  - Nach «« und vor »» steht immer U+00A0.
  - Ein normales Leerzeichen vor `: ; ! ? »` kommt nicht mehr vor.
- **en:** Bei den 16 Branch-Schlüsseln in `messages/en.json` kommen keine “” mehr vor, alle verwenden «». Das passt zum übrigen en-Bestand: 133 Zeilen mit «, 24 mit “.
- `grep` in `src/__tests__` und `tests` findet keinen Test, der die alten en- oder fr-Fassungen erwartet hat.

## Nicht bestätigt

- **Vom Aufrufer gemeldet:**
  - lint pass;
  - vitest invoice-pages und i18n pass;
  - E2E-Features invoice und dashboard, 110 pass;
  - E2E rot mit dem alten deutschen Text vor C-9 und grün danach (chromium);
  - DOM-Test rot vor der C-9-Fassung.
- Ich wollte `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` erneut laufen lassen. Das scheiterte mit `ERR_MODULE_NOT_FOUND`, weil der Review-Worktree kein `node_modules` hat.
- Ob die Branch-Basis 86f13870 (`git merge-base HEAD origin/main`) noch dem aktuellen origin/main entspricht, habe ich nicht geprüft. Davon hängt ab, wie vollständig die Liste der Branch-Schlüssel ist.
