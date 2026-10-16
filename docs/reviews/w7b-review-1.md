# Code-Review W7b, Runde 1 (#112 A-3, #52)

Gegenstand: `git diff 5d5038e 4b1a50f` im Worktree `review-w7b-code` (5420300 `@wip`-Szenarien, 4b1a50f Umsetzung). Alle 36 geänderten Dateien gelesen, dazu `DateInput.svelte`, `Field.svelte`, `ActionDialog.svelte`, `contract.service.ts` (`updateContract`, `checkNotice`), `app.ts` (`onError`), `api-contracts.pg.test.ts` (`drift`), Issues #112 und #52 (per `gh api`).

Ergebnis: keine Blocker, keine Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/contracts/[id]/+page.svelte:66-73` (`checkEndDate`), `src/lib/ui/DateInput.svelte:106,116` | Ein ungültig getippter Eingang (z.B. «31.11.2098») ergibt `value = ''`; die Feldmeldung erscheint, aber «Beenden» geht trotzdem durch und speichert ohne Eingang, der Fristhinweis fehlt still. `checkEndDate` prüft nur das Vertragsende. |
| C-2 | Minor | `src/lib/ui/Field.svelte:68-72`, `+page.svelte:243` | Der Fristhinweis erscheint ohne Live-Region; wer das Vertragsende nach dem Eingang ändert, hört ihn nicht (nur über `aria-describedby` beim nächsten Fokus auf «Kündigung erhalten am»). |
| C-3 | Minor | `backend/migrations/0007_contract_notice_received.sql:7`, `backend/src/services/contract.service.ts:373-386` | `PUT {noticeReceivedOn}` auf einen nicht gekündigten Mietvertrag verletzt den DB-Check und endet als 500 statt als codierte Ablehnung. Über die UI nicht erreichbar (BFF sendet immer `terminated: true`), nur direkt über die API. |
| C-4 | Minor | `src/__tests__/contract-actions.test.ts:169-187` | Nur die Aktion `end` ist mit Eingang getestet; `endDeletingDraft` (`+page.server.ts:246-250`, verdecktes Feld `+page.svelte:208`) reicht `noticeReceivedOn` ungetestet weiter. |
| C-5 | Nit | `src/lib/contract-status.ts:266-272`, `+page.svelte:43-47` | Ein Eingang nach dem Vertragsende oder in der Zukunft wird nicht beanstandet; er löst den Hinweis «weniger als 3 Monate» aus, was fachlich passt, aber den Tippfehler nicht benennt. |
| C-6 | Nit | `src/routes/contracts/[id]/+page.server.ts:200` | Kommentarzeile mit 162 Zeichen; die übrigen Kommentare umbrechen bei 120. |
| C-7 | Nit | `tests/e2e/features/accessibility.feature:80`, `sprachen-bildschirme.feature:81` | Tabellenspalte nicht ausgerichtet (`end-dialog-notice-hint` breiter als die Spalte). |
| C-8 | Nit | `tests/e2e/targets/contract-form.ts:54-59` | `.locator('label')` ist ein CSS-Tag-Selektor; es gibt Vorläufer in `targets/` (z.B. `statement-detail.ts:11`), aber eine `data-testid` an der Beschreibung (`RadioGroup.svelte:67`) wäre die Regel. |
| C-10 | Minor | `src/routes/contracts/new/PeriodStep.svelte:45`, `tests/e2e/targets/contract-form.ts:53`, `tests/e2e/steps/contract-form.steps.ts:353`, `tests/e2e/features/contract-edit.feature:79` | #52 «Done means» verlangt wörtlich: `grep -rn "#52" src backend tests` findet nichts. Der `TODO`-Marker ist weg, aber vier Verweise «(#52)» bleiben, der Grep findet sie. Entweder die Verweise streichen oder im Pull Request sagen, dass nur der Marker gemeint ist (`check-issues.mjs` prüft nur `TODO(fachlich prüfen, …)`). |
| C-9 | Nit (ponytail) | `src/routes/contracts/[id]/+page.server.ts:203-209` | `shrink:` `endOn` bekommt das ganze `FormData` für ein Feld. `noticeReceivedOn: string \| undefined` übergeben, die Signatur bleibt einzeilig. |

net: etwa -6 Zeilen möglich (C-9); sonst schlank.

## Bestätigt

- **Regel (#112):** `shortNoticePeriod` rechnet Eingang + 3 Monate, Tag auf Monatsende gekürzt (`Date.UTC(year, month + 3, 0)` = letzter Tag des Zielmonats, `Date.UTC(year, month + 2, min(day, lastDay))` = Fälligkeit), Hinweis bei `endDate < due`. Nachgerechnet: 31.12.2026/31.03.2027 kein, 01.01./31.03. Hinweis, 30.11.2027/29.02.2028 kein (ohne Kürzung würde 01.03.2028 entstehen und der Test rot), 31.03./30.06. kein. Die vier Fälle des Issues stehen in `contract-status.test.ts:240-247`, dazu die zwei Szenario-Daten und der leere Fall.
- **Dialog:** Feld optional, leer beim Öffnen (`startEnding` setzt `noticeReceivedOn = ''`), Hilfe = Satz aus #112 + Formsatz wörtlich, Hinweis als `note` ohne Sperre; Wortlaut des Hinweises wörtlich wie #112. Senden über `fields` und das verdeckte Feld im Draft-Formular.
- **Speichern:** Spalte, Drizzle-Schema, Update-Schema (`t.Nullable(date)`), `contractFields`, BFF sendet leer als `undefined` (fällt in JSON weg, bestehende Body-Tests bleiben gleich), Löschen bei `endDate: null` oder `terminated: false` (`contract-end.pg.test.ts:262-272`; ohne die Änderung schlagen beide Tests am DB-Check mit 500 fehl, also rot). `tests/contracts/contract.json`, `docs/data-model.md`, `docs/api-specification.md` nachgeführt. Detailseite zeigt den Tag (`ContractTerms.svelte:48-55`), E2E prüft ihn.
- **#52:** Text in vier Sprachen im Sinn des Glossars (`UBIQUITOUS_LANGUAGE.md:40`), Szenario «Kündigung aufheben» prüft ihn (`contract-form.steps.ts:353-362`), `TODO`-Marker entfernt (wörtliche Grep-Bedingung siehe C-10).
- **Prozess:** Szenarien ohne `@wip`, Zustand `end-dialog-notice-hint` in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature`; A-3 in `docs/anforderungen-vertragsende.md` als umgesetzt markiert; alle neuen Texte in allen vier `messages/*.json`.
- **E2E-Design:** Steps rufen nur Tasks und Fragen; Fragen liefern Text (`Text.of`) bzw. echten Zustand (`Visibility`); der Negativ-Check «keinen Hinweis» ist an der Hilfe des Felds verankert, also nicht leer wahr. Features ohne UI-Wörter. Szenarien sind rot ohne die Änderung (Feld fehlt bzw. Text fehlt).
- **Design:** nur bestehende Komponenten (`DateInput`, `Field`-Note), Token-Klassen (`text-ink-muted`, `font-semibold text-ink`), kein neuer Stil.
- **Sicherheit:** neues Feld nur über die bestehende, authentifizierte Aktion; Backend validiert das Format (`format: 'date'`, sonst 422).
- Prettier-sauber auf den geänderten E2E- und Testdateien sowie `+page.svelte`.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle), `bun test contract-end.pg.test.ts api-contracts.pg.test.ts`, E2E contract-detail/contract-edit (49) und die axe-/Sprachzeilen (18), Commit-Hooks: vom Aufrufer gemeldet. Ein Neulauf von `bunx vitest run src/__tests__/contract-status.test.ts src/__tests__/contract-actions.test.ts` scheiterte daran, dass `node_modules` im Worktree auf das Haupt-Repo zeigt und dessen Lesen gesperrt ist.
- Ob die fr/it/en-Texte `docs/design/i18n-begriffe.md` folgen: nur gelesen, nicht gegen die Begriffsliste abgeglichen.
- Fachliche Richtigkeit des Formsatzes und der Frist gegen Fedlex: nicht geprüft, dafür liegt `docs/reviews/w7b-fachreview-1.md` vor (keine Blocker/Major).
