# Review #1376 JWT_SECRET im Backend, Runde 2 (f83420fc..440c20af)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

Geprüft: `jwt-secret.test.ts:30-33` gibt `JWT_SECRET: ''` mit; `''` fällt in `backend/src/config/jwt.ts:6-9` unter `NODE_ENV=production` in die Weigerung «JWT_SECRET environment variable is required», die der Test erwartet; der Kommentar in `src/lib/server/jwt-config.ts:15` nennt jetzt `backend/src/config/jwt.ts`, wo der Fallback liegt; sonst verweist kein Code und keine Doku mehr für den Fallback auf `middleware/auth.ts`. Der Delta enthält nichts, was nicht zu C-1 oder C-2 gehört.

## Nicht bestätigt

- `bun test src/__tests__/jwt-secret.test.ts` (5 pass), `bun run lint`, `open-work.test.ts`, Prettier auf den neuen Dateien: vom Aufrufer gemeldet.
- Dass Bun eine gesetzte, leere Variable nicht aus `backend/.env` bzw. `.env.production` füllt: vom Aufrufer von Hand geprüft gemeldet, nicht ausgeführt.
