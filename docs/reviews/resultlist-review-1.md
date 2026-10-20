# Code-Review ResultList (#455), Runde 1

Bereich: `git diff c09ec4fd 91b98543` (ein Commit `91b98543 chore(components): share the list section of lists`), Worktree `review-resultlist-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `docs/design/token-referenz.md:66` | Die Komponententabelle in `src/lib/ui` nennt unter «Lists» nur `Table` und `Pagination`. `ResultList` fehlt, und die Seite verspricht, die Tabelle führe die Komponenten von `src/lib/ui` auf (CLAUDE.md, Design-Regeln: «components in `src/lib/ui`»). Wer die nächste Listenseite baut, findet sie so nicht. |
| C-2 | Minor | `src/routes/apartments/+page.svelte:65-77` | Die Wohnungsliste hat genau den Block, den `ResultList` jetzt kapselt (Abschnitt, h2 `apartments-count` mit `tabindex="-1"` und `data-results`, `ul` mit Grid-Klasse, `Pagination`). Er ist jetzt eine sechste Kopie neben der neuen Komponente. Der Entscheid nennt nur die fünf Seiten der fallow-Gruppe dup:4489c5c6, und der Diff ändert diese Datei nicht. Ohne Rückfrage nachziehen gehört deshalb nicht in diesen Slice (CLAUDE.md, «When to ask»). Nötig ist ein Kommentar in #455 oder eine Folge-Issue. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Keine Verhaltensänderung:** Ich habe jede der fünf Seiten Zeile für Zeile gegen die Basis verglichen.
  - Heading-ID, `tabindex="-1"`, `data-results` und die h2-Klasse `text-xl font-bold text-ink` sind gleich (`src/lib/ui/ResultList.svelte:28`). `aria-labelledby` und die Section-Klasse `flex flex-col gap-4` sind ebenfalls gleich (`:27`). Die Reihenfolge der Attribute hat sich bei invoices/statements geändert, das hat keine Wirkung.
  - Die Listenklassen sind gleich geblieben:
    - Buildings: Grid explizit übergeben.
    - Invoices/Statements: `divide-y …` ohne `flex flex-col`, explizit übergeben.
    - Contracts/Tenants: der Default (`ResultList.svelte:9`) entspricht genau ihrer alten Klasse.
  - `Pagination` steht weiterhin ausserhalb der Section und bekommt die gleichen Props.
  - Die Überschriften-Texte sind die alten `m.*`-Aufrufe, nur umgebrochen.
  - Der `onmarkpaid`-Handler bei Statements ist unverändert.
- **Tests:** Die bestehenden Seitentests prüfen die geteilte Struktur weiter: `contract-list.test.ts:55`, `tenant-list.test.ts:43`, `buildings-pages.dom.test.ts:45`, `statement-pages.dom.test.ts:159-166` und `invoice-pages.dom.test.ts:100`. Ein reiner Umbau ohne Verhaltensänderung braucht keinen neuen roten Test. Der Commit sagt «No behaviour change», das passt.
- **Konventionen:** Es gibt keine neuen UI-Texte, also nichts in `messages/*.json` und auch keine neue a11y-Bildschirmzeile. Ein E2E-Szenario ist nicht nötig, weil sich am Verhalten nichts ändert. Die Komponente nutzt nur Token-Klassen. Tests in `tests/e2e`, API-Verträge und Backend sind nicht betroffen. Die Commit-Subjektzeile hält das Format und die 50 Zeichen ein. Ich habe keine unbeteiligten Änderungen gefunden.
- **Ponytail-Review:** `listClass` hat einen Default und zwei Nutzer, die ihn setzen. Die Props sind die minimal nötigen. Ich habe nichts zum Streichen gefunden («Lean already»).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx fallow audit` und `bunx vitest run` der fünf Seitentests plus design-guard (562 grün): vom Aufrufer gemeldet. Mein Wiederholungslauf von `bunx vitest run` war im Worktree nicht möglich, weil der Zugriff auf `node_modules` (verlinkt nach `/home/user/Dwello/node_modules`) durch eine Deny-Regel gesperrt ist.
- E2E und axe-Läufe der fünf Listenseiten: nicht gelaufen (Vorgabe des Aufrufers). Dass das gerenderte DOM gleich bleibt, habe ich nur durch Lesen des Diffs belegt.
