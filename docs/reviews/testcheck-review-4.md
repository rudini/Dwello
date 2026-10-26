# testcheck – Review Runde 4 (Abschlussrunde, Delta 9252954..bb5628b)

Geschlossen: C-11, C-12

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde |

Geprüft: `isWaitedFor`/`storedAndWaitedFor` terminieren. Jede Rekursion läuft über `enclosingPromise`, und jedes Promise kommt nur einmal in `seen`. Der `for`-Lauf endet am Testkörper. Eigene Verwendungen im Executor und Property-Namen werden ausgeschlossen. Mit eigenen Proben (`/tmp/claude-0/-home-user-Dwello/09b62bb3-8398-5f22-b98c-22621842b328/scratchpad/cr-probe4/p.ts`: Selbstbezug, zwei und drei Promises im Zyklus mit und ohne `await`, verschachtelte Promises mit gleichem Namen, zwei Verwendungen mit gemeinsamem `seen`) gab es weder Absturz noch Endlosschleife. Die Ergebnisse stimmen alle, und `r3-files/ws.test.ts` meldet nichts mehr. Der gemeinsame `seen` erzeugt keinen neuen Fehlalarm: Ein Promise kommt erst nach einer abgeschlossenen falschen Auswertung oder mitten im Zyklus erneut, das Gesamtergebnis bleibt also gleich. `comparesWithItself` meldet `expect(await p).toEqual(await p)` und `.toStrictEqual(await p.x)`, aber nicht `toBe` mit `await` und nichts mit Aufruf (`await f()`, `await import()`). `runsCode`/`empty-test` verhalten sich wie vorher. Rot: Beim Lesen von 9252954 rekursieren ok9 (Selbstbezug `data`) und ok10 (gegenseitige Promises) endlos. Der Tautologiefall war wegen `await` in `runsCode` nicht gemeldet. Die Zahlen in `testcheck-validation.md` (4,859 + 134 = 4,993; 97.3 %) passen zusammen.

## Nicht bestätigt

- Nachgeprüft: `bunx vitest run tools/testcheck` (42 bestanden).
- Vom Aufrufer gemeldet, nicht nachgeprüft: `bunx eslint tools/testcheck --max-warnings 0`, `bunx fallow audit`, `tsc --strict --noUnusedLocals`, die Messläufe `measure.ts` (Präzision, 31,000 Tests) und `seed.ts` (Tautologie 4,859 / 4,993). Die Zahlen in `testcheck-validation.md` habe ich nur auf ihre Arithmetik geprüft, nicht auf den Korpus.
