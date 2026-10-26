# Review testcheck, Runde 3 (a1f3296..9252954)

Worktree: `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/review-tc-code3` (detached auf 9252954). Proben: `/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/cr-probe/r3-probe.ts` (gegen 9252954), `r3-probe-base.ts` (dieselben Fälle gegen a1f3296, Quellen in `cr-probe/base-a1/`), `r3-taut.ts`, Testdatei `cr-probe/r3-files/ws.test.ts`.

Geschlossen: C-1 (gespeichertes, später awaitetes / zurückgegebenes / in `Promise.all` / `expect(p).resolves` stehendes `new Promise` meldet nicht mehr; ohne `await p` weiter gemeldet), C-3 (dritter Fall `catch { found = false; }` ohne Befund), C-10 (`hasCall` entfernt).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Major | tools/testcheck/src/analyze.ts:262-271 | `storedAndWaitedFor` rekursiert endlos, sobald im Executor ein Bezeichner mit dem Namen der Variablen steht (auch ein Property-Name wie `msg.data`): testcheck bricht mit «Maximum call stack size exceeded» ab, Exit 2 |
| C-12 | Minor | tools/testcheck/src/analyze.ts:433; testcheck-validation.md:60 | Durch `runsCode` statt `hasCall` zählt `await` als Code, der läuft: `expect(await p).toEqual(await p)` (dasselbe Promise zweimal, immer gleich) meldet nicht mehr `tautology` (auf a1f3296 schon). Das sind die 2 Seeds, die der Recall verlor; die Validierung erklärt alle 136 als «`toBe` checks identity», was für diese 2 falsch ist. Kein Test für den geänderten Fall. (Meine Aussage in Runde 2, `runsCode` «tut dasselbe», stimmte nicht) |

## C-11 (Major): Stack Overflow im Gate bei einem korrekten Test

`storedAndWaitedFor(promise)` besucht den ganzen Testkörper und ruft für jeden `Identifier` mit dem Variablennamen `isWaitedFor(n, root)`. Liegt dieser Bezeichner im Executor desselben `new Promise`, findet `enclosingPromise(n)` wieder dieses Promise, und `isWaitedFor` ruft `storedAndWaitedFor(promise)` erneut auf, ohne Ende. Der Vergleich nur über `n.text` trifft dabei auch Property-Namen.

Nachweis (`node tools/testcheck/src/cli.ts scan ../cr-probe/r3-files` → `testcheck: Maximum call stack size exceeded`, Exit 2; ohne Dateinamen):

```ts
it('sends', async () => {
	const data = new Promise<void>((resolve) => {
		ws.on('message', (msg) => { expect(msg.data).toBe('x'); resolve(); });
	});
	ws.send('x');
	await data;
});
```

Ebenso mit `expect(p).toBeDefined()` im Callback (`selfRef` in `r3-probe.ts`) und ohne `await` (`propSameNameNoAwait`). Auf a1f3296 liefern alle drei einen Befund statt eines Absturzes, der Fehler kommt also mit dem C-1-Fix. Folgen: im CI-Job «Test checks» (`testcheck:ci`) wird jeder Pull Request mit so einem Test rot mit einem Werkzeugfehler, den keine Unterdrückung behebt und der die Datei nicht nennt; im Hook (Exit 2 → fail-open) fällt die ganze Prüfung des Commits still aus, für alle Dateien. Das Muster (Event-Nachricht mit Feld gleichen Namens wie die Promise-Variable) ist für den Fall, den C-1 erlauben sollte, naheliegend.

Behebung: nur Bezeichner ausserhalb von `promise` betrachten (Knoten im Teilbaum von `promise` überspringen) und nur echte Verweise (kein `name` eines `PropertyAccessExpression`); dazu ein Fall wie oben in `rules.test.ts`, der heute mit RangeError rot ist.

## Nicht bestätigt

- `bunx eslint tools/testcheck --max-warnings 0`, `bunx fallow audit`, `tsc --strict --noUnusedLocals`, `measure.ts` und `seed.ts` (Präzision unverändert, Recall `tautology` 4 857 / 4 993): vom Aufrufer gemeldet, nicht erneut ausgeführt (Korpus nicht lokal geprüft). Welche 2 Seeds der Recall verlor, ist aus dem Code abgeleitet (Seeds ohne `(`, also `await x` oder Tagged Template), nicht am Korpus gesehen.
- Ob «Test checks» ein Pflicht-Check der Branch-Protection ist (von hier nicht lesbar).

Geprüft: `bunx vitest run tools/testcheck` (41 grün); die neuen Fälle `ok5` (guarded) und `ok8` (callback) sind auf a1f3296 rot, `c` pinnt bestehendes Verhalten; die Änderung an `swallowed-assertion` nimmt in allen Proben nur Meldungen weg (`catch { return; }`, Flag-Catch), leerer Catch und Catch mit Kommentar melden weiter, `catch-only-assertion` unverändert, also keine neue Gate-Meldung; `storedAndWaitedFor` erzeugt ausser C-11 keine neue Meldung; `scan` über das Repo zeigt nur den bekannten Hint (#854); README und Meldungstext stimmen mit dem Verhalten.
