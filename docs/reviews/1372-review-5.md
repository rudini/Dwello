# Code-Review #1372 / PR #1388, CI-Fix (Runde 1), 2af858b1..deb34c00

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

Keine Befunde.

Geprüft: Netto-Diff nur `backend/src/services/ki-settings.service.ts` (Zwischencommits heben sich auf). `trim(value = '')` verhält sich gleich wie `?.trim() ?? ''` für alles, was ankommt: Die Route (`backend/src/routes/ki-settings.ts:31`, `t.Optional(t.String({ maxLength: 2048 }))`) lässt nur `string` oder fehlendes Feld (`undefined`, greift der Default) durch; `null` weist das Schema ab, und der einzige weitere Aufrufer `setup.service.ts:50` (`{ mode: 'none' }`) übergibt nur `undefined`. `KiInput` (Z. 29–37) erlaubt typseitig ebenfalls kein `null`. `${url.username}${url.password}` ist genau dann nicht leer, wenn eines der beiden nicht leer ist; `URL` liefert für beide immer Strings (leer, wenn nicht gesetzt, auch bei `http://:@host`), also gleich wie `url.username || url.password`. `[401, 403].includes(response.status)` ist gleichwertig zum Vergleich. Kein Verhalten geändert, daher kein neuer Test und kein Szenario nötig; nichts Unbenutztes zurückgelassen.

## Nicht bestätigt

- fitness --structure (0 Fehler), `bun run fitness`, lint, Backend type-check, `ki-settings.pg` (35), `api-contracts.pg` + compose-prod auf deb34c00: vom Aufrufer gemeldet, nicht selbst ausgeführt.
