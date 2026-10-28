# Installing Dwello

For the person who sets up Dwello for a landlord. Afterwards the landlord works in the browser and needs no technical knowledge; updates and backups (section 5) stay with you. Plan for about an hour, most of it the download of the AI model, which Dwello starts by itself.

Two ways:

- **On a PC** (Windows, macOS, Linux): Dwello runs while the PC is on and is opened at `http://localhost:3000` on that PC. Sections 1 to 6.
- **On a home server, NAS or cloud server**: reachable from other devices; HTTPS is recommended. Sections 1 to 6, then section 7.

## 1. What you need

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (on a Linux server: Docker Engine with Compose v2) and [Git](https://git-scm.com/downloads).
- 16 GB of memory for the local AI, which reads invoices on this machine. With less, use an external AI (section 6).
- Nothing to invent: Dwello makes its keys itself, and the landlord creates their Konto mit Passwort in the browser (section 5). Google sign-in is optional (section 3).
- About 10 GB of disk space (images, AI model, database).

## 2. Download

```bash
git clone https://github.com/rudini/Dwello.git
cd Dwello
```

## 3. Optional: Google sign-in

The landlord signs in with e-mail address and password, set up in the browser (section 5). Only if they want to sign in with their Google account as well, create a sign-in key at Google once:

1. Open the [Google Cloud Console](https://console.cloud.google.com/) with any Google account and create a project, e.g. «Dwello».
2. **Google Auth Platform** (formerly «OAuth consent screen»): app name «Dwello», a support e-mail, audience **External**. Set the publishing status to **In production**: in «Testing» only listed test users can sign in. Dwello asks only for e-mail and profile, which needs no verification by Google.
3. **Clients, Create client**: type **Web application**, authorized redirect URI `http://localhost:3000/auth/callback` (on a server: section 7).
4. Copy the **Client ID** and the **Client secret**.

## 4. Optional settings

On a PC Dwello needs no settings: on the first start it makes its keys itself (the key of the sessions, the database password and the key for stored secrets) and keeps them in the Docker volume `dwello_secrets`. Only for Google, the operator details, e-mail to tenants (section 5) or an external AI (section 6), copy the example file and fill in what you need; Docker Compose reads it:

```bash
cp .env.example .env
```

| Setting | Value |
|---|---|
| `ALLOWED_EMAILS` | only with Google (section 3): the landlord's Google address; several separated by commas. With Google, Dwello does not start without it |
| `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET` | only with Google: from section 3 |
| `OAUTH_GOOGLE_REDIRECT_URI` | only with Google: `http://localhost:3000/auth/callback` |
| `COOKIE_SECURE` | keep `false` on a PC, because Dwello is opened over plain `http://localhost` there |

An installation from before #577 keeps the `JWT_SECRET` and `POSTGRES_PASSWORD` of its `.env`; leave them there.

Optional, shown in the terms of use and the privacy statement of the app (which are addressed to the landlord; informing the tenants stays the landlord's duty, Art. 19 DSG): `OPERATOR_NAME`, `OPERATOR_ADDRESS`, `OPERATOR_CONTACT` (who runs the installation and backs up its data), and `OPERATOR_SERVER_COUNTRY`, required when the server is outside Switzerland. When an IT service or hoster runs the server, it processes the tenants' data on the landlord's behalf: the landlord needs a data processing agreement with it (Art. 9 DSG). Keep `.env` private: it holds the keys.

## 5. Start

```bash
docker compose -f docker-compose.prod.yml up -d
docker logs dwello-backend
```

The first start builds Dwello, which takes several minutes. Only the web app (port 3000) is reachable from outside the containers; the backend, the database and the AI stay inside Docker (#719).

The log of the backend shows the **Einrichtungscode** (setup code), e.g. `[setup] Einrichtungscode: K7QF-2MXD`. Open `http://localhost:3000`: Dwello shows «Dwello einrichten». The landlord enters the code, their e-mail address and a password twice (at least 8 characters, best a long one used nowhere else), chooses «Lokale KI auf diesem Server» or «Später entscheiden» (then no KI reads invoices and no model is downloaded until a KI is chosen under «Einstellungen» › «KI», section 6), and is then signed in. Only who knows the code can set Dwello up; a new code is made on each start until the account exists, and 5 wrong codes lock the setup for 15 minutes.

The AI model (about 6 GB) then downloads by itself; the overview shows how far it is, and until then invoices are entered by hand. If the download fails, Dwello tries again at the next start (`docker compose -f docker-compose.prod.yml restart backend`).

- **Forgotten password or Sperre:** `docker exec -it dwello-backend bun run account` sets a new password; it also lifts the Sperre after 5 failed attempts and ends the sessions that were open.

- **Update:** `git pull`, then `docker compose -f docker-compose.prod.yml up -d --build`.
- **Back up** the database and the keys regularly and keep the copy on another device; uploaded invoices and PDFs are stored in the database too. Without the key for stored secrets, secrets Dwello stores encrypted (such as the key of an external AI) cannot be read after a restore. These commands work in every terminal, Windows PowerShell included:

  ```bash
  docker exec dwello-postgres pg_dump -U dwello --clean --if-exists -f /tmp/dwello-backup.sql dwello
  docker cp dwello-postgres:/tmp/dwello-backup.sql dwello-backup.sql
  docker cp dwello-postgres:/run/dwello dwello-keys
  ```

  To restore a copy (it replaces the data in the database):

  ```bash
  docker cp dwello-backup.sql dwello-postgres:/tmp/dwello-backup.sql
  docker exec dwello-postgres psql -U dwello -f /tmp/dwello-backup.sql dwello
  ```

  On a new machine, put the keys back **before its first start**, so the new database gets the saved password; then start it (`up -d`) and restore the database as above:

  ```bash
  docker compose -f docker-compose.prod.yml run --rm --no-deps -v "$PWD/dwello-keys:/keys:ro" secrets sh -c 'cp /keys/* /run/dwello/'
  ```
- **E-mail to tenants:** `.env.example` sets `MAIL_TRANSPORT=smtp` with placeholder values. Fill in `MAIL_FROM` and `SMTP_*` from the landlord's mail provider (or set `MAIL_TRANSPORT=resend` and `RESEND_API_KEY`), and for SMTP also `MAIL_PROVIDER_NAME` and `MAIL_PROVIDER_COUNTRY`, which the privacy statement names (required when the mail server is outside Switzerland). Or remove the `MAIL_TRANSPORT` line: Dwello then sends no e-mail, and the landlord sends the PDFs or prints the letters.

If the page «KI» says that the local KI does not answer, start it again (Docker Desktop shows the container `dwello-ollama`, or in a terminal):

```bash
docker compose -f docker-compose.prod.yml up -d ollama
```

## 6. Without 16 GB of memory: an external AI

Any OpenAI-compatible service that reads images works. Open Dwello, go to «Einstellungen» › «KI», choose «KI eines Anbieters» and fill in the address, the API key, a model that reads images, the name of the provider and the country where it processes the data. «Verbindung prüfen» says whether the key is accepted and the model reads invoice images. Before saving, Dwello asks you to confirm the three data protection points (data processing agreement, country, retention; also in the README, «External LLM provider»). The next invoice uses the provider, without a restart, and the privacy statement names it. Dwello then downloads no model.

The API key is stored encrypted with the key for stored secrets (`ENCRYPTION_KEY`, which Dwello makes on the first start; back it up, section 5); it is never shown again.

To fix the KI for the installation instead, as on a demo, the operator adds to `.env` (the page «KI» then shows these values and cannot change them):

```bash
LLM_BASE_URL=https://api.example.com/v1
LLM_API_KEY=...
LLM_MODEL=<a model that reads images>
LLM_PROVIDER=<name of the provider>
LLM_PROVIDER_COUNTRY=<country where the data is processed>
```

## 7. On a server, reachable from other devices

Over plain `http` the password and every page cross the network unencrypted, and the sign-in page says so: give Dwello a domain (e.g. `dwello.example.ch`) with HTTPS, or reach it only through a VPN. Google sign-in accepts plain `http` only for `localhost`, so with Google HTTPS is required:

1. Point the domain to the server (DNS record of type A) and let ports 80 and 443 reach it.
2. Put [Caddy](https://caddyserver.com/docs/install) in front of Dwello; it gets and renews the certificate itself. The `Caddyfile`:

   ```
   dwello.example.ch {
   	reverse_proxy localhost:3000
   }
   ```

   Another reverse proxy must let requests of at least 11 MB through, or uploads of documents fail (nginx refuses more than 1 MB by default: `client_max_body_size 11m;`). Caddy sets no limit.

3. In `.env`, instead of the PC values:

   ```bash
   PUBLIC_APP_URL=https://dwello.example.ch
   OAUTH_GOOGLE_REDIRECT_URI=https://dwello.example.ch/auth/callback   # only with Google
   COOKIE_DOMAIN=dwello.example.ch
   CORS_ORIGIN=https://dwello.example.ch
   ```

   and remove `COOKIE_SECURE=false`.
4. With Google (section 3): add `https://dwello.example.ch/auth/callback` as redirect URI.
5. `docker-compose.prod.yml` publishes only the web app (3000), for Caddy. Block every port but 22, 80 and 443 in the firewall of your provider or router: Docker's published ports bypass `ufw`.

Without HTTPS, only inside your home network (not recommended: the password and every page cross the network unencrypted, and the sign-in page says so), skip Caddy and set in `.env` the address the other devices open, e.g. `homeserver.local`:

```bash
PUBLIC_APP_URL=http://homeserver.local:3000
COOKIE_DOMAIN=homeserver.local
CORS_ORIGIN=http://homeserver.local:3000
```

and keep `COOKIE_SECURE=false`. Dwello accepts the sign-in only at the address in `PUBLIC_APP_URL`.

For a home server that should stay out of the internet, Caddy can get the certificate through the DNS of the domain instead (see the Caddy documentation, «DNS challenge»); access from outside then goes through a VPN such as Tailscale.

## 8. Security

### End every session at once

After a lost or stolen device, or when someone should no longer use Dwello, end every sign-in at once: give the installation a new session key. Everyone, the landlord included, then signs in again.

```bash
openssl rand -hex 32   # a new key
```

In `.env`, set `JWT_SECRET=` to that key (replace the line if there is one), then:

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

Removing an address from `ALLOWED_EMAILS` (then `docker compose -f docker-compose.prod.yml up -d`, so the web app reads the new list) ends its access without this: only the web app reaches the backend, and it checks the list on every request (#747).

### Failed sign-ins and errors

Dwello locks an account for 15 minutes after 5 wrong passwords, and the setup after 5 wrong codes; it limits nothing else (ADR 0004). An operator who wants more can let the reverse proxy throttle requests (Caddy: the `rate_limit` plugin, which needs a custom Caddy build). Errors are written only to the log of each container, nowhere else:

```bash
docker logs dwello-backend
docker logs dwello-frontend
```

### Installations from before #577: the database password

A database first started before #577 may still use the old default password `dwello`. Check it:

```bash
docker compose -f docker-compose.prod.yml exec backend cat /run/dwello/db_password; echo
```

If it prints `dwello`, give the database a new password and keep it in `.env`:

```bash
new=$(openssl rand -hex 24); echo "$new"   # the new password
docker compose -f docker-compose.prod.yml exec postgres psql -U dwello -d dwello -c "ALTER USER dwello PASSWORD '$new'"
```

In `.env`, set `POSTGRES_PASSWORD=` to that password (replace the line if there is one), then:

```bash
docker compose -f docker-compose.prod.yml up -d --force-recreate
```
