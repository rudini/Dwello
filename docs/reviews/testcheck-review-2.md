# Review testcheck, Runde 2 (350272d..82b01d8, Merge a1f3296)

Worktree: `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/review-tc-code2` (detached auf a1f3296). Proben: `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/cr-probe/r2-probe.ts`, `r2-probe2.ts`, `r2-probe3.ts` (gleiche Fälle wie Runde 1, gegen den neuen Stand).

## Status der IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Major | **offen (teilweise behoben)** | Executor mit Block-Body, zurückgegebenes `new Promise` und `Promise.all([...])` gehen jetzt durch (rules.test.ts ok5–ok7, vor dem Fix rot). Das erste Beispiel des Befunds wird aber weiter gemeldet: `const p = new Promise(...); em.emit(...); await p;` (Details unten) |
| C-2 | Minor | behoben | `expect(hash('a')).toEqual(hash('a'))` → keine Meldung; `expect(x).toEqual(x)` und `expect(a.b).toEqual(a.b)` weiter `tautology`. Test vorhanden |
| C-3 | Minor | teilweise | `checkout()`/`checkbox.click()` behoben (Test ok4). Der dritte Fall des Befunds, `try { screen.getByText('x'); } catch { found = false; } expect(found).toBe(false);`, meldet weiter `swallowed-assertion` (Gate). Bleibt Minor, kein eigener Durchgang |
| C-4 | Minor | behoben | `expect(x).to.be.true`, `.to.exist`, `.not.to.be.null` ohne Befund; `expect(x).toBeNull` weiter `dangling-expect`. Test vorhanden |
| C-5 | Minor | behoben | «at least 90 %» stimmt: jede Gate-Regel ≥ 91,7 % (erster Tuning-Lauf `tautology` 11/12), heute 100 % |
| C-6 | Minor | behoben | «Missed» geht auf: duplicate-body 27+1+2 = 30, duplicate-title 26+1 = 27 |
| C-7 | Minor | behoben | Agent-Meldung «n finding(s) fail the test gate»; Hook prüft genau dieses Muster; Test mit `duplicate-title` |
| C-8 | Minor | behoben | Tests für Unterdrückung über der Befundzeile, unbekannte Regel, Push-Zweig (wäre ohne `--changed-since` grün, also rot ohne den Zweig), fail-open |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Minor | tools/testcheck/src/analyze.ts:422-424 | `hasCall` ist eine Kopie von `runsCode` (analyze.ts:450, Call/New, dazu Await und Tagged Template); `!runsCode(actual)` tut dasselbe (ponytail-review: Kopie eines bestehenden Helfers) |

## C-1 (Major, offen): ein gespeichertes und später awaitetes `new Promise` gilt weiter als «not waited for»

`enclosingPromise` (analyze.ts:243-246) findet das `new Promise`, dann prüft `isWaitedFor(promise, root)` nur, ob *dieser Ausdruck* awaitet oder zurückgegeben wird. Steht das Promise in einer Variablen, endet der Lauf an der `VariableDeclaration`, und die Regel meldet.

Nachweis (`r2-probe.ts` Fall `promiseEvent`, `r2-probe3.ts` Fall `storedAwaited`), Ergebnis `["callback-only-assertion"]`:

```ts
it('emits', async () => { const p = new Promise<void>((resolve) => { em.on('data', (v) => { expect(v).toBe(1); resolve(); }); }); em.emit('data', 1); await p; });
```

Das ist der Weg, auf ein Event zu warten, das der Test selbst auslöst: der Listener muss vor dem `emit` hängen, also wird das Promise zuerst gebaut und erst danach awaitet. Es war das erste Beispiel im Nachweis von C-1, und `rules.test.ts` hat keinen Fall dafür. Da `callback-only-assertion` eine Gate-Regel ist, blockiert das Hook den Commit dieses korrekten Tests; die Meldung rät «await the promise», was der Test schon tut. Behebung: steht das `new Promise` als Initializer einer `const`, gilt es als gewartet, wenn der Testkörper den Namen awaitet oder zurückgibt (auch in `Promise.all`, `expect(p).resolves`); dazu ein Fall in `rules.test.ts`. Alternativ die Regel zum Hint machen.

## Nicht bestätigt

- `bunx eslint tools/testcheck`, `bunx fallow audit`, Prettier, `src/__tests__/open-work.test.ts`, sowie lint/check/type-check auf 350272d: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob «Test checks» ein Pflicht-Check der Branch-Protection ist (aus Runde 1, von hier nicht lesbar).
- Die Labels selbst sind nicht nachgeprüft, ausser dem neuen zod-Label `tuple.test.ts#failed validation` (richtig: alle Assertions im catch, ohne `expect.assertions`).

Geprüft: `bunx vitest run tools/testcheck` (4 Dateien, 41 Tests grün); `measure.ts` reproduziert die Präzisionstabelle exakt (Tuning 149/149, Wilson-Schranke 97,5 %; Holdout unverändert); `seed.ts` reproduziert die Recall-Tabelle exakt (Summe 43 955 ≈ 44 000); Korpus 2537 Dateien / 30 837 Tests (≈ 31 000); `scan` über den Merge zeigt nur den bekannten Hint (#854); die neuen Fälle in `rules.test.ts`/`gate.test.ts`/`hook.test.ts` sind ohne den Fix rot; die Fixes erzeugen in den Proben keine neue Gate-Meldung (die Änderungen an `isWaitedFor`, `comparesWithItself` und `dangling-expect` nehmen nur Meldungen weg; `ASSERT_CALL` ohne `i` verschob im Korpus nur einen Befund, den richtigen zod-Fall); a1f3296 entspricht exakt `git merge-tree` von 82b01d8 und 96d17cd, also konfliktfrei.
