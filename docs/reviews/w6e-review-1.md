# Code-Review W6e, Runde 1 (#378), `git diff 8b2c710 7ba0b0f`

Worktree: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/review-w6e-cr` (7ba0b0f). Alle fünf geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `messages/de.json:798` (unverändert), `implementation_plan.md:11` | Anforderungszeile «sent or paid: «Abrechnung berichtigen»» ist auf diesem Commit nicht erfüllt: die Warnung schickt den Verwalter für versendete Abrechnungen «ausserhalb von Dwello». Hängt an PR #385 (offen, nicht gemergt); mit `Fixes #378` würde #378 geschlossen, ohne dass die Zeile gilt. |
| C-2 | Major | `src/routes/invoices/new/+page.svelte:121`, `src/__tests__/invoice-pages.dom.test.ts:614-629` | Aus dem Abrechnungs-Assistenten (`returnTo=/statements/generate?schritt=3`, `PreviewChecks.svelte:59-61`) führt das Speichern jetzt auf die Rechnungsseite statt zurück in den Assistenten, sobald es in der Periode schon Abrechnungen gibt; der Assistent ist verloren. Nicht in der Anforderung, ohne Szenario; der DOM-Test schreibt genau diesen Wechsel fest. |
| C-3 | Minor | `src/routes/invoices/new/+page.svelte:112,120` | `saving = false` steht vor dem zusätzlichen `await api.get(...)`: während der zweiten Anfrage ist «Speichern» wieder aktiv, ein zweiter Klick legt die Rechnung doppelt an. `saving = false` erst nach dem GET (oder nur im Fehlerzweig) setzen. |
| C-4 | Minor | `src/routes/invoices/new/+page.svelte:120-121` | Scheitert `GET /invoices/{id}/statements`, geht es still zur Liste zurück, ohne Hinweis; der Fall hat keinen Test. Vertretbar als Rückfall, sollte aber bewusst (Kommentar oder Test) sein. |
| C-5 | Minor | `tests/e2e/features/invoice-edit.feature` (unverändert) | Kein Szenario dafür, dass nach dem Bearbeiten einer abgerechneten Rechnung die Warnung erscheint; `invoice-detail.feature:69-76` deckt nur den Seed-Weg (`kostet danach`) ab, nicht Bearbeiten -> Speichern -> Warnung. Die Aussage «edit already returns to the detail page» stimmt (`[id]/edit/+page.svelte:97`, `+page.svelte:95`). |
| C-6 | Nit | `implementation_plan.md:5-6` | Zwei Leerzeilen vor `## Session`. |

Ponytail-Review: `Lean already. Ship.` (der neue Proxy `src/routes/api/invoices/[id]/statements/+server.ts` ist das gleiche Muster wie die übrigen GET-Proxys; GET braucht kein XSRF; `statementPeriods` in `src/lib/server/invoice.ts:104` ist Server-Code mit SvelteKit-`fetch` und im Browser nicht verwendbar, also kein `reuse:`).

## C-1 (Major): «Abrechnung berichtigen» fehlt auf diesem Stand

Warum falsch: «Done means» von #378 verlangt, dass der Verwalter erfährt, *wo* er korrigiert: Entwürfe neu erstellen, versendete oder bezahlte über «Abrechnung berichtigen». Auf 7ba0b0f gibt es diese Funktion nicht (`grep -n berichtigen messages/de.json` zeigt nur «berichtigen Sie ausserhalb von Dwello», z. B. Zeile 798 `invoices_missed_text`). Das Slice verweist bewusst auf #358/PR #385 (`gh api repos/rudini/Dwello/pulls/385`: `state: open, merged: false`). Das Szenario prüft nur den Satz `invoices_missed_period` («gibt es schon Abrechnungen ohne diese Rechnung …»), nicht den Weg zur Korrektur.

Wie zeigen: Szenario «Rechnung einer schon abgerechneten Periode erfassen» um einen Schritt ergänzen, der «Abrechnung berichtigen» in der Warnung erwartet: auf 7ba0b0f rot.

Lösung: den Branch auf #385 aufsetzen (oder erst nach dessen Merge `main` hineinmergen) und den Text in der Warnung im Szenario prüfen; sonst den PR mit `Refs #378` statt `Fixes #378` führen und die Abhängigkeit unter «Blocked on me» nennen.

## C-2 (Major): Rücksprung in den Abrechnungs-Assistenten geht verloren

Warum falsch: `PreviewChecks.svelte:59-61` öffnet das Rechnungsformular mit `returnTo=/statements/generate?schritt=3`, gerade auch dann, wenn es in der Periode schon Abrechnungen gibt (`existing`-Hinweis, `PreviewChecks.svelte:29,102-115`, z. B. eine frühere Abrechnung bei Mieterwechsel oder Entwürfe für andere Verträge). Für eine solche Periode ist `missedIn` nach dem Speichern nicht leer, und `+page.svelte:121` ersetzt `back` durch `/invoices/{id}`. Der Verwalter landet mitten im Erstellen der Abrechnungen auf der Rechnungsseite; die hat keinen Weg zurück in den Assistenten, und ihre Warnung rät ihm, die Abrechnungen erneut zu erstellen, was er gerade tut. Für die Zielgruppe (wenig Erfahrung, Führung vor Tempo) ist das ein Abbruch des Ablaufs. Die Anforderung verlangt das nicht: sie zielt auf den Fall «zurück zur Rechnungsliste, Seite 1» (Issue-Text, Abschnitt «Problem»). Der neue DOM-Test (`invoice-pages.dom.test.ts:619-621`, `returnTo: '/statements/generate'`) legt genau dieses Verhalten fest.

Wie zeigen: im DOM-Test mit `returnTo: '/statements/generate'` und nicht leerem `missedIn` `expect(goto).toHaveBeenCalledWith('/statements/generate')` erwarten: rot auf 7ba0b0f. E2E: Assistent bis Schritt 3 mit einer bestehenden Abrechnung der Periode, fehlende Rechnung erfassen, «Speichern» -> Seite ist `/invoices/{id}`, nicht der Assistent.

Lösung (kürzeste): nur ohne `returnTo` auf die Rechnungsseite wechseln, z. B. `goto(!data.returnTo && periods.data?.missedIn?.length ? \`/invoices/${id}\` : back)` (dann entfällt der GET mit `returnTo` ganz), Test mit Liste statt Assistent; oder die Produktentscheidung einholen, falls der Wechsel auch im Assistenten gewollt ist.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` (70 passed), E2E `invoice-new.feature` + `invoice-edit.feature` chromium (14 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Sehen: nach Lesen fällt der neue DOM-Test ohne die Änderung (goto mit `/statements/generate`, kein GET) und das Szenario (Titel der Rechnungsliste statt «… - Rechnung - Dwello», Schritt `invoices.steps.ts:91-96`); nicht ausgeführt.
- Dass `/api/invoices/[id]/statements` ohne Sitzung abgewiesen wird: nur über `forwardRequest` (Cookie-JWT, Backend antwortet 401) gelesen, `hooks.server.ts` nicht geprüft.
- Kein neuer Bildschirm oder Zustand (die Rechnungsseite mit `MissedWarning` besteht schon), keine neuen Texte, keine API-Antwort geändert (`tests/contracts/invoice-statements.json` wird genutzt): daher keine Einträge in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `messages/*.json` nötig.
- Ob der Seed «Nebenkostenabrechnung des laufenden Jahres» einen Entwurf oder eine versendete Abrechnung anlegt: nicht nachgesehen; das Szenario deckt damit nur einen der beiden Fälle der Anforderung ab.
