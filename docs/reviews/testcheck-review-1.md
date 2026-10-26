# Review testcheck, Runde 1 (ebc0708..350272d)

Worktree: `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/review-tc-code` (detached auf 350272d).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/testcheck/src/analyze.ts:236-242, 277 | `callback-only-assertion` (Gate-Regel) meldet genau das Muster, das die eigene Meldung als Lösung nennt: ein Callback in einem awaiteten oder zurückgegebenen `new Promise(...)` mit Block-Body. Blockiert einen korrekten Test beim Commit |
| C-2 | Minor | tools/testcheck/src/analyze.ts:406-410; README.md:16 | `tautology` meldet `expect(f(x)).toEqual(f(x))` (Determinismus-Test, kann scheitern). Das README spricht nur von «a variable compared with itself»; der bekannte Fehlalarm aus excalidraw (validation.md:124) ist weiterhin drin |
| C-3 | Minor | tools/testcheck/src/analyze.ts:85, 122, 125 | Der Präfix `check`/`verify`/`should` gilt als Assertion, auch als Receiver: `try { await checkout('main') } catch {}` oder `checkbox.click()` in einem try mit leerem catch löst `swallowed-assertion` aus (Gate), obwohl darin keine Assertion steht. Ebenso `try { screen.getByText('x') } catch { found = false }` (Prüfung, dass etwas fehlt) |
| C-4 | Minor | tools/testcheck/src/analyze.ts:339-341 | `dangling-expect` meldet Chai-Assertions wie `expect(x).to.be.true`, die Vitest unterstützt und die prüfen. Das README (Zeile 3) verspricht Vitest-Testdateien allgemein |
| C-5 | Minor | tools/testcheck/README.md:9 | «each was right in at least 92 %»: `tautology` liegt im Tuning-Korpus bei 11/12 = 91,7 % (von `measure.ts` reproduziert) |
| C-6 | Minor | tools/testcheck/testcheck-validation.md:137-138 | Die Spalte «Missed» erklärt 27 bzw. 26 Fälle «by design». Laut `seed.ts` (nachgerechnet) fehlen aber 30 bzw. 27: dazu kommen 2 Fälle als `duplicate-title` und je 1 als `loop-only-assertion`, ohne Erklärung. Das widerspricht dem eigenen Ziel «every miss explained» (Zeile 86, «All three hold», Zeile 88) |
| C-7 | Minor | tools/testcheck/src/cli.ts:158 | Agent-Meldung «N test(s) can pass without checking what they claim» steht auch bei `duplicate-title`, `duplicate-body` und `invalid-suppression`; für diese ist der Text falsch |
| C-8 | Minor | tools/testcheck/src/gate.ts:103; .claude/hooks/testcheck-gate.sh:31-41, 63-66 | Ohne Test: Unterdrückung über der Zeile des Befunds (nur «above the test» ist getestet), `invalid-suppression` bei unbekannter Regel, Push-Zweig des Hooks (`--changed-since` mit dem Upstream), fail-open bei Tool-Fehler |
| C-9 | Minor | .claude/hooks/testcheck-gate.sh (ganz) | Fast zeilengleiche Kopie von `.claude/hooks/deepcheck-gate.sh` (der `diff` zeigt nur Namen, Meldungstexte und das Verdikt-Muster). Ein Skript mit Tool-Name/Verdikt als Parameter würde reichen (ponytail-review: Kopie eines bestehenden Helfers) |

## C-1 (Major): `callback-only-assertion` meldet awaitete Event- und Timer-Callbacks

`isWaitedFor` (analyze.ts:236) läuft vom Scheduler-Aufruf (`on`, `setTimeout`, `then` …) nur über Ketten-Glieder (`isChainLink`) nach oben. Eine `ExpressionStatement`- oder `ArrayLiteral`-Grenze bricht den Lauf ab. Ein Callback in einem Promise-Executor mit Block-Body oder in `Promise.all([...])` gilt so als «not waited for», obwohl der Test genau darauf wartet. Das ist der übliche Weg, in Vitest auf ein Event zu warten (Vitest kennt kein `done`), und die Meldung (analyze.ts:300) rät selbst: «await the promise or event».

Nachweis mit `analyzeSource` (Skript `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/cr-probe/probe.ts` und `probe2.ts`), jeweils Befund `callback-only-assertion`:

```ts
it('emits', async () => { const p = new Promise<void>((resolve) => { em.on('data', (v) => { expect(v).toBe(1); resolve(); }); }); em.emit('data', 1); await p; });
it('waits', async () => { await new Promise<void>((r) => { setTimeout(() => { expect(x.done).toBe(true); r(); }, 10); }); });
it('emits', () => new Promise<void>((done) => { ws.on('message', (m) => { expect(m).toBe('hi'); done(); }); ws.send('hi'); }));
it('all', async () => { await Promise.all([a().then((v) => expect(v).toBe(1)), b().then((v) => expect(v).toBe(2))]); });
```

Nur die Form mit Concise-Body `(r) => setTimeout(...)` geht durch. Dazu kommt Sveltes `store.subscribe((v) => { expect(v)… })`, das synchron aufruft. Es wird ebenfalls gemeldet; das ist vertretbar, aber die Meldung führt dort in die Irre.

Warum das blockiert: Es ist eine Gate-Regel, und das Hook blockiert damit den Commit eines korrekten Tests. Die Präzisionsangabe für diese Regel beruht auf einem einzigen natürlichen Befund (`measure.ts`: 1/1, untere Schranke 21 %). Die Messung kann diese Lücke also nicht zeigen. Die Validierung nennt das selbst («Small samples», validation.md:156), der README-Satz «at least 92 % … on every corpus» deckt es aber zu. Behebung: `isWaitedFor` sollte einen Executor eines awaiteten oder zurückgegebenen `new Promise(...)` und Argumente von `Promise.all/allSettled/race` als «waited» gelten lassen, mit Regressionsfällen in `rules.test.ts`. Alternativ wird die Regel bis dahin zum Hint.

## Nicht bestätigt

- Ob «Test checks» in der Branch-Protection ein Pflicht-Check ist (mit Auto-Merge sonst nicht blockierend). Wie bei «Deep modules» steht es in keinem `needs:` (ci.yml:350, 553), und die Repository-Einstellungen sind von hier nicht lesbar.
- Ein echter GitHub-Actions-Lauf und actionlint: vom Aufrufer als nicht gelaufen gemeldet. Die Action-Versionen (`checkout@v7`, `setup-node@v7`) stimmen mit den übrigen Jobs überein.
- `bunx vitest run tools` (324 Tests), eslint, fallow, deepcheck:audit, tsc, prettier, `open-work.test.ts` und `readme.test.ts`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Die Labels selbst (ob tp/fp richtig vergeben sind) sind nicht nachgeprüft. Nachgeprüft sind nur ihre Zahl (678) und dass sie die Tabellen tragen.
- Ob das Hook in einer Worktree-Session (`CLAUDE_PROJECT_DIR`) das richtige Repository prüft. Die Logik ist dieselbe wie in `deepcheck-gate.sh`, ein Lauf fand nicht statt.

Geprüft: Die Präzisionstabelle reproduziert `node tools/testcheck/eval/measure.ts <cache>` exakt (Tuning 148/149, Holdout 24/24, Wilson-Schranken). Die Recall-Tabelle reproduziert `seed.ts` (±1 durch eine neue Testdatei). Die Korpusgrösse Dwello beträgt 310 Dateien und 3969 Tests. Der `scan` über den Worktree ergibt nur den genannten Hint, das leere Baseline stimmt also. Weiter geprüft: Baseline wird am Basis-Commit gelesen (`git show base:`), Exit-Codes 0/1/2, das Hook blockiert nur bei Verdikt, CI-Job mit `fetch-depth: 0`, Verdrahtung in CLAUDE.md, Skill und settings.
