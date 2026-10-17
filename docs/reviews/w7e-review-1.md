# Code-Review 1: Protokoll unter «Einstellungen» (#357)

Worktree `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/review-audit-code`, Diff `f900e5b..27203ee` (f8edd45 Szenarien, 27203ee Umsetzung). Alle 47 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `backend/src/routes/audit-log.ts:105-108`; `src/routes/config/audit-log/+page.server.ts:17-22` | Ein Eintrag, den es nicht mehr gibt, wird mit 404 `{ error: 'Audit log entry not found' }` ohne Code abgelehnt. `backendMessage()` zeigt dann den englischen Text des Backends im Dialog, in allen vier Sprachen. Für diesen Fehlerzustand gibt es weder Test noch Szenario. |
| C-2 | Minor | `backend/src/services/invoice.service.ts:347-358`; `messages/*.json` `audit_invoice_excluded` | Wird eine Rechnung durch eine neue Kategorie oder durch die KI nicht umlagefähig, lautet der Eintrag «… als nicht umlagefähig markiert», als hätte der Verwalter das getan. Fachreview V-1 verlangte den Grund («nicht mehr umlagefähig (Kategorie «Reparaturen»)»). Beim fach-reviewer bestätigen lassen. |
| C-3 | Minor | `statement.service.ts:533`, `invoice.service.ts:342` und `:486`, `config.service.ts:191` (`setConfig` mit `db`) | Der Eintrag wird ausserhalb der Transaktion der Änderung geschrieben; bei Kategorie und `setMultipleConfig` geschieht das in der Transaktion. Schlägt der Insert fehl, ist die Änderung trotzdem gespeichert, die Antwort aber 500. Bei `recategorize` landet der Fehler in `{ success: false, error: <Rohtext> }`. Vorschlag: Eintrag in derselben Transaktion schreiben oder bewusst «fail open» wie beim Login. |
| C-4 | Minor | `src/lib/server/login-flow.ts:61-72` | Eine Antwort mit `!response.ok` (401, 500) geht ohne Log verloren. Ein Fetch ohne Timeout hält die Anmeldung auf, solange das Backend hängt. Vorschlag: `if (!response.ok) logAuthError(...)` und `AbortSignal.timeout(...)`. |
| C-5 | Minor | `src/lib/server/audit-log.ts:531` | Bei einer unbekannten `action` wirft `TEXTS[action](...)` einen TypeError, und die ganze Seite antwortet mit 500. Vorschlag: unbekannte Einträge überspringen oder einen neutralen Text zeigen. |
| C-6 | Minor | `backend/src/__tests__/api-contracts.pg.test.ts:361-366` (`drift` Z. 29) | `drift` prüft nur das erste Array-Element, also nur den Login. Die übrigen fünf Muster in `tests/contracts/audit-log.json`, von denen `audit-log-mapping.test.ts` lebt, werden nie gegen die echte API geprüft (die Details prüfen indirekt die `toEqual` in `audit-log.pg.test.ts`). Vorschlag: je Aktion einen Eintrag erzeugen und jedes Muster mit dem passenden Eintrag vergleichen. |
| C-7 | Minor | `tests/e2e/features/settings.feature:67-70` | Für die zurückgesetzte Zahlung fehlt ein Szenario. Die Begründung im Kommentar (Google-Anmeldung, globale Pauschale) trifft auf sie nicht zu, und `statement-detail.feature` setzt Zahlungen bereits zurück. Den Text `audit_payment_reset` belegt nur der Mapping-Test. |
| C-8 | Minor | `src/routes/config/DeleteDialog.svelte:89-91` mit `+page.server.ts:20` | Bei einem Fehler ohne Code tragen Titel (`notDeleted` = `audit_delete_failed`) und Text (Fallback `audit_delete_failed`) denselben Satz zweimal. Vorschlag: als Fallback ein eigener Text, der sagt, was zu tun ist (z. B. Seite neu laden). |
| C-9 | Minor | `backend/src/services/audit-log.service.ts:138`; `+page.svelte:757` | Liste ohne Grenze: in der Demo kommt mit jeder Anmeldung ein Eintrag dazu, und die Seite rendert alle. Zeile in `docs/design/offene-punkte.md` (Performance) oder ein Limit. |
| C-10 | Minor | `tests/e2e/fixtures/screens.ts:38` (Rückkehr ohne Seed) | `audit-log`/`default` wird nicht geseedet. Je nach Reihenfolge des Laufs zeigt der Zustand Einträge anderer Szenarien oder den leeren Zustand, ist also nicht deterministisch. Vorschlag: `/config/audit-log` für `default` mitseeden. |
| C-11 | Nit | `tests/unit/auth-routes.test.ts:280-287` | «meldet auch an, wenn …» ist auch auf dem Basis-Commit grün (ohne `recordLogin` kein Fetch). Als Schutz vor Regressionen in Ordnung, aber nicht als rot gesehen. |
| C-12 | Nit | `backend/src/__tests__/audit-log.pg.test.ts:174` | Der Testname nennt «dem Betrag», gespeichert wird aber kein Betrag (V-3). |
| C-13 | Nit | `src/routes/config/ConfigLinks.svelte:13,60` | yagni: das neue `testid` pro Link. Das `li` trägt schon `quick-link-audit-log`; das Target kann den Link darin suchen. |
| C-14 | Nit | `src/lib/server/audit-log.ts:496` | delete: der Fallback `?? String(d.provider)` ist toter Code, weil das Backend nur `google` und `microsoft` annimmt. |
| C-15 | Nit | `tests/e2e/steps/audit-log.steps.ts:11-12` | `named()` ersetzt alle Namen mit `replaceAll`. Überlappende Titel («Gartenpflege» und «Gartenpflege Nord» im selben Szenario) würden doppelt ersetzt. |
| C-16 | Nit | `tests/contracts/README.md:17` | Die Zeile steht zwischen den beiden `statement*`-Zeilen. |
| C-17 | Nit | `backend/src/services/config.service.ts:218` | Der Satz wird gespeichert und gezeigt, wie er eingetippt wurde («von 4.25 % auf 4.250 %» ist ausgeschlossen, «3.50 %» erscheint aber so). |

Ponytail: C-13, C-14 (`net: -5 lines possible.`). Sonst ist die Änderung schlank: Mapper und Dialog werden wiederverwendet, `recordAudit` ist eine einzige Funktion.

## C-1 (Major): Löschen eines Eintrags, den es nicht mehr gibt, zeigt Englisch

**Warum falsch.** CLAUDE.md, «UI languages»: «A backend refusal the UI shows carries a code … never the backend's own text.» `deleteRecord` gibt den Body an `backendMessage(body, failure)` weiter. Ohne `code` gibt das `body.error` zurück (`src/lib/backend-error.ts:46-47`), also «Audit log entry not found», auch in fr/it/en. Der Fall ist realistisch: Ein Eintrag wurde in einem anderen Tab gelöscht, oder in der Demo (alle Besucher teilen das Protokoll und dürfen löschen, `audit_privacy_demo`) von einem anderen Besucher. Ein Fehlerzustand braucht ausserdem ein Szenario (`tests/e2e/CLAUDE.md`, «Failure states»). Bisher deckt nur der DOM-Test einen erfundenen `form.error` ab.

**Wie zeigen.** Szenario: Eintrag anlegen (Kategorie nicht umlagefähig), Protokoll öffnen, Löschen anfangen, den Eintrag im Hintergrund über das Seed per `DELETE /api/v1/audit-log/<id>` löschen, dann bestätigen. Erwartet wird ein deutscher Text, der sagt, was zu tun ist. Heute erscheint «Audit log entry not found».

**Korrektur** (eine von beiden):
- `refusal('AUDIT_ENTRY_NOT_FOUND', …)` im Backend, `backend_audit_entry_not_found` in allen vier `messages/*.json`, ein pg-Test auf den Code;
- oder im BFF 404 als «schon gelöscht» behandeln (redirect wie bei Erfolg), mit Unit-Test.

Dazu das Szenario oben; falls ein neuer Zustand entsteht, auch `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (alle), `cd backend && bun run test` (831 pass, Coverage 94.6 %), E2E `test:e2e:wip -g Protokoll`, das Breadcrumb-Beispiel, die axe- und Sprachzeilen `-g "audit-log "`. Der breitere Chromium-E2E-Lauf ist laut Aufrufer noch offen.
- Neu ausgeführt und grün: `bunx vitest run src/__tests__/audit-log-mapping.test.ts src/__tests__/audit-log-page.dom.test.ts tests/unit/auth-routes.test.ts src/__tests__/privacy-page.dom.test.ts` (60 Tests).
- XSRF für die Form-Action `?/delete`: `hooks.server.ts` ist nicht geändert. Das Muster gleicht den bestehenden Löschaktionen (categories, distribution-keys); die Prüfung selbst habe ich nicht nachgelesen.
- Andere Anmeldewege als `/auth/callback`: `generateJwt`/`setSessionCookie` kommen nur in `auth.ts`, `auth/refresh` und `auth/callback` vor. Dass die Verlängerung der Sitzung nichts schreibt, ist so gewollt.
- Ob der Zusatz zur Datenschutzerklärung (`audit_privacy`, `audit_privacy_demo`) R-1/R-2/R-3 rechtlich erfüllt und ob die fr/it/en-Begriffe («Journal», «Registro», «Log») zu `docs/design/i18n-begriffe.md` passen: dort steht kein Eintrag dazu, fachlich nicht bewertet (fach-reviewer, #370).
- Ob die E2E-Sitzung im leeren Fall ohne Login-Eintrag auskommt (Zustand `empty`): nur aus dem Kommentar in `settings.feature` und dem gemeldeten grünen axe-Lauf geschlossen.
