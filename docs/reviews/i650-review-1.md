# Code-Review #650, Runde 1 (e9a10863..894bd44a)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/__tests__/env-example.test.ts:17-24 | `git grep -w <Name>` zählt jedes Vorkommen des Worts (Kommentar, Fehlercode, fest gesetzter Wert in Compose) als «gelesen»; `IBAN` und `PUBLIC_APP_NAME` liest nichts, der Test ist trotzdem grün und verdeckt genau den Fehler, den #650 beschreibt |

## C-1 (Major)

Der Testtitel «setzt nur Variablen, die etwas liest» sagt etwas, das der Test nicht prüft. Belege am Commit 894bd44a:

- `IBAN` (`.env.example:93`, «Property manager's IBAN for QR-bill generation»): Die Umgebung liest sie nirgends (`git grep -nE "env(\.|\[')IBAN|\$\{IBAN"` findet nur `.env.example`); die IBAN stammt aus der Konfiguration in der Datenbank (`backend/src/services/config.service.ts:12`, `PUT /config`). Grün ist der Test nur, weil das Wort in Kommentaren und Codes steht: `backend/scripts/test-db.ts:11`, `backend/src/routes/statements.ts:29`, `:434` (`IBAN_MISSING`). Wer `IBAN` setzt, erwartet einen QR-Einzahlungsschein und bekommt `IBAN_MISSING`: Das ist genau die Lage, die #650 abstellen soll.
- `PUBLIC_APP_NAME` (`.env.example:6`): `src` und `backend/src` lesen sie nicht. Der einzige Treffer ist `docker-compose.prod.yml:50` `- PUBLIC_APP_NAME=Dwello`, also ein fest gesetzter Wert und keine Übernahme aus `.env`.

So zeigt man es: `IBAN=…` in `.env.example` belassen und `bunx vitest run src/__tests__/env-example.test.ts` laufen lassen (heute grün, ich habe es wiederholt). Den Wächter, den der Aufrufer beschreibt, gibt es also nur für Namen, die nirgends als Wort vorkommen; eine künftige tote Variable mit einem häufigen Namen (z. B. `PORT`, `TIMEOUT`) rutscht ebenso durch.

Behebung: Nach echten Lesestellen suchen (`env.X`, `env['X']`, `process.env.X`, `Bun.env.X`, `$env/…`-Importe, `${X` in Compose und `ENV`/`ARG X` in Dockerfiles), ohne Kommentare. Danach `IBAN` und `PUBLIC_APP_NAME` entfernen oder für jede ein Issue anlegen. Der Test muss dann für beide rot werden. Die Alternative ist, den Test wieder zu streichen: Das Issue verlangt nur das Entfernen der Variablen und einen Grep.

## Nicht bestätigt

- `bunx vitest run src/__tests__/jwt-config.test.ts`, `cd backend && bun test src/__tests__/compose-prod.test.ts`, eslint und Prettier auf der neuen Testdatei: vom Aufrufer gemeldet. Den Test `env-example.test.ts` habe ich selbst wiederholt (grün).
- Rot vor der Änderung (acht Variablen): vom Aufrufer gemeldet. Beim Lesen plausibel, denn die sieben noch gesetzten Namen aus dem Issue und `DATABASE_POOL_MAX` haben ausserhalb von `.env.example` keinen Treffer.
- Ob in CI bei `vitest` ein Git-Checkout vorhanden ist (der Test ruft `git grep` auf): Die CI-Workflows habe ich nicht gelesen.

Geprüft: Die acht gesetzten Variablen aus dem Issue und `DATABASE_POOL_MAX` sind samt ihren Abschnittskommentaren entfernt (`# === File Storage ===`, `# === Feature Flags ===`). `SENTRY_DSN` war schon weg. Ein `git grep -w` über das ganze Repo findet keine weitere Stelle, nur die ADR 0004, die das Entfernen von `SENTRY_DSN` beschreibt. `DB_POOL_SIZE` ist die gelesene Variable (`backend/src/db/connection.ts:12`). Der Diff enthält nichts, was nicht zur Anforderung gehört.
