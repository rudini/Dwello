# Code-Review #916/#917, Runde 1 (Schlussrunde), 45e93617..a7aaad53

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Zu den Fragen des Aufrufers:
- XSRF- und OAuth-State-Cookie: nicht nötig. #917 verlangt die Prüfung für «every cookie holding a session or refresh token». `dwello_xsrf` hält kein Sitzungs-Token und muss für das Double-Submit lesbar sein (`src/lib/server/auth.ts:100`). `dwello_oauth_state` und das Login-Flow-Cookie (`login-flow.ts:37`) halten kein Token. Ein Refresh-Cookie gibt es nicht. `setSessionCookie` ist die einzige Stelle, die `dwello_session` setzt (`auth.ts:80`; grep `sessionName` / `cookies.set(` in `src`).
- `docker-compose.prod.yml` lesen: annehmbar. Ein «Secure in Produktion» hängt nur an `COOKIE_SECURE` (`jwt-config.ts:73`), und dessen Standardwert für die Produktion steht nur in dieser Datei (Zeile 61). Andere Tests lesen Repo-Dateien ebenfalls über relative Pfade (`tokens.test.ts`, `app-html.test.ts`). Fiele der Standard auf `false`, würde der Test rot.

Geprüft: beide Issues Punkt für Punkt gegen den Diff; die KI ist über `llmConfig.baseUrl` auf Port 9 nicht erreichbar (beforeAll); der #916-Test geht über HTTP-POST ohne `categoryId`, also über `categorizeWithKi` (`invoice.service.ts:289`); er prüft 201 sowie `categoryId`/`llmCategoryId` null und räumt die Rechnung ab; der #917-Test stellt `env.COOKIE_SECURE` in `afterEach` zurück; `httpOnly`/`sameSite` kommen aus `setSessionCookie` selbst. Die Commit-Nachricht nennt beide Tests als Fixierung von bestehendem Verhalten (Workflow 2). Laut Code zeigt der Basis-Commit das Verhalten schon, und keiner der beiden Tests gehört zu einem Bugfix. Kein Szenario nötig, weil sich kein Verhalten ändert. Der Diff enthält keine UI-Texte, keine `messages`, keine Verträge und keinen E2E-Code. Ponytail-Review: nichts Ungenutztes und keine Kopie eines bestehenden Helpers.

## Nicht bestätigt
- `bun test src/__tests__/invoice-categorization.pg.test.ts` (17 pass), `bunx vitest run src/__tests__/session-cookie.test.ts` (2 pass), `bun run lint`, `bun run check`, `bun run type-check` im Backend, testcheck-Audit: vom Aufrufer gemeldet. Den Vitest-Lauf im Worktree habe ich nicht wiederholt, weil `node_modules` ausserhalb des Worktrees liegt und gesperrt ist.
- Die Rotläufe (#916 nur rot, wenn beide Catches entfernt sind, dann 400 statt 201; #917 rot mit `httpOnly: false`): vom Aufrufer gemeldet. Laut Code sind sie plausibel: `categorizeWithKi` fängt alles ab (`invoice.service.ts:229`).
