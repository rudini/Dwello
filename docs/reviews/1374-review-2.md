# Review Slice 1374, Runde 2 (Delta `git diff 58e294ae f93d41a2`)

Geschlossen: C-1

Das Delta bringt keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `tests/unit/auth-routes.test.ts` (35 bestanden), `fitness --structure` (0 Fehler), der neue Test rot vor dem Fix und grün danach, und die Maintainability 87.9 von fallow für login-flow.ts. Nach dem Lesen ist der Rot-Lauf plausibel: Ohne `URL.parse` wirft der alte `safeTarget` in `rememberLoginFlow` vor `cookies.set`. Das Cookie fehlt dann, und `JSON.parse(undefined)` lässt den Test scheitern.
- Dass `URL.canParse` ab Node 20.0 vorhanden ist (eingeführt in 19.9, zurückportiert nach 18.17), habe ich nicht an einer Node-20-Laufzeit geprüft. Lokal läuft nur Node 22.

Geprüft: `safeTarget` mit `node -e` bei gelöschtem `URL.parse` an den Werten des Aufrufers sowie an `"\n//evil"`, `" /x"`, `"null"` und `"undefined"`. Alle bleiben auf dem eigenen Origin oder fallen auf `/dashboard` zurück. `new URL` kann nicht werfen: Ein falscher Wert landet bei `/dashboard`, und `canParse` prüft dieselbe Zeichenkette, aus der `new URL` sonst die URL baut. Nicht-String-Werte aus dem Cookie in `takeLoginFlow` werfen ebenfalls nicht. Alle drei Aufrufer laufen weiter über `safeTarget`. Das Delta enthält nichts ausserhalb von C-1.
