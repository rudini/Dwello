# Installing Dwello

For the person who sets up Dwello for a landlord. Afterwards the landlord works in the browser and needs no technical knowledge; updates and backups (section 5) stay with you. Plan for about an hour, most of it the Google sign-in and the download of the AI model.

Two ways:

- **On a PC** (Windows, macOS, Linux): Dwello runs while the PC is on and is opened at `http://localhost:3000` on that PC. Sections 1 to 6.
- **On a home server, NAS or cloud server**: reachable from other devices. Google sign-in then needs a domain with HTTPS. Sections 1 to 6, then section 7.

## 1. What you need

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (on a Linux server: Docker Engine with Compose v2) and [Git](https://git-scm.com/downloads).
- 16 GB of memory for the local AI, which reads invoices on this machine. With less, use an external AI (section 6).
- The landlord's Google account: they sign in with it, and Dwello admits no other account.
- About 10 GB of disk space (images, AI model, database).

## 2. Download

```bash
git clone https://github.com/rudini/Dwello.git
cd Dwello
```

## 3. Google sign-in

Dwello has no passwords of its own yet (a one-step installer with its own sign-in is planned, #497). Create a sign-in key at Google once:

1. Open the [Google Cloud Console](https://console.cloud.google.com/) with any Google account and create a project, e.g. «Dwello».
2. **Google Auth Platform** (formerly «OAuth consent screen»): app name «Dwello», a support e-mail, audience **External**. Set the publishing status to **In production**: in «Testing» only listed test users can sign in. Dwello asks only for e-mail and profile, which needs no verification by Google.
3. **Clients, Create client**: type **Web application**, authorized redirect URI `http://localhost:3000/auth/callback` (on a server: section 7).
4. Copy the **Client ID** and the **Client secret**.

## 4. Settings

```bash
cp .env.example .env
```

Open `.env` in a text editor and set these values; Docker Compose reads them from this file (of the other values in it, the defaults fit a PC; the optional ones follow below the table):

| Setting | Value |
|---|---|
| `JWT_SECRET` | a random string of at least 32 characters, e.g. from `openssl rand -base64 32`; it signs the sessions |
| `POSTGRES_PASSWORD` | add this line: a random password for the database; it takes effect on the first start only |
| `ALLOWED_EMAILS` | the landlord's Google address; several separated by commas. Without it Dwello does not start |
| `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET` | from section 3 |
| `OAUTH_GOOGLE_REDIRECT_URI` | `http://localhost:3000/auth/callback` (already set) |
| `COOKIE_SECURE` | keep `false` on a PC, because Dwello is opened over plain `http://localhost` there |

Optional, shown in the terms of use and the privacy statement of the app (which are addressed to the landlord; informing the tenants stays the landlord's duty, Art. 19 DSG): `OPERATOR_NAME`, `OPERATOR_ADDRESS`, `OPERATOR_CONTACT` (who runs the installation and backs up its data), and `OPERATOR_SERVER_COUNTRY`, required when the server is outside Switzerland. When an IT service or hoster runs the server, it processes the tenants' data on the landlord's behalf: the landlord needs a data processing agreement with it (Art. 9 DSG). Keep `.env` private: it holds the keys.

## 5. Start

```bash
docker compose -f docker-compose.prod.yml up -d
docker exec dwello-ollama ollama pull qwen3-vl:8b-instruct
```

The first start builds Dwello, which takes several minutes; the AI model is about 6 GB. `docker-compose.prod.yml` publishes the backend (3001), the database (5432) and the AI (11434) on all network interfaces, also on a PC: keep them closed in the firewall of the PC or router. Then open `http://localhost:3000` and sign in with the address from `ALLOWED_EMAILS`. The overview shows the landlord what to do first.

- **Update:** `git pull`, then `docker compose -f docker-compose.prod.yml up -d --build`.
- **Back up** the database regularly and keep the copy on another device; uploaded invoices and PDFs are stored in the database too. These commands work in every terminal, Windows PowerShell included:

  ```bash
  docker exec dwello-postgres pg_dump -U dwello --clean --if-exists -f /tmp/dwello-backup.sql dwello
  docker cp dwello-postgres:/tmp/dwello-backup.sql dwello-backup.sql
  ```

  To restore a copy (it replaces the data in the database):

  ```bash
  docker cp dwello-backup.sql dwello-postgres:/tmp/dwello-backup.sql
  docker exec dwello-postgres psql -U dwello -f /tmp/dwello-backup.sql dwello
  ```
- **E-mail to tenants:** `.env.example` sets `MAIL_TRANSPORT=smtp` with placeholder values. Fill in `MAIL_FROM` and `SMTP_*` from the landlord's mail provider (or set `MAIL_TRANSPORT=resend` and `RESEND_API_KEY`), and for SMTP also `MAIL_PROVIDER_NAME` and `MAIL_PROVIDER_COUNTRY`, which the privacy statement names (required when the mail server is outside Switzerland). Or remove the `MAIL_TRANSPORT` line: Dwello then sends no e-mail, and the landlord sends the PDFs or prints the letters.

## 6. Without 16 GB of memory: an external AI

Any OpenAI-compatible service that reads images works. Add to `.env`:

```bash
LLM_BASE_URL=https://api.example.com/v1
LLM_API_KEY=...
LLM_MODEL=<a model that reads images>
LLM_PROVIDER=<name of the provider>
LLM_PROVIDER_COUNTRY=<country where the data is processed>
```

Invoice data, uploaded invoice files included, then goes to that provider, and the privacy statement names it. Read the checklist in the README («External LLM provider») first: data processing agreement, country, retention. Skip the `ollama pull`.

## 7. On a server, reachable from other devices

Google accepts a plain `http` address only for `localhost`. On a server Dwello therefore needs a domain (e.g. `dwello.example.ch`) with HTTPS:

1. Point the domain to the server (DNS record of type A) and let ports 80 and 443 reach it.
2. Put [Caddy](https://caddyserver.com/docs/install) in front of Dwello; it gets and renews the certificate itself. The `Caddyfile`:

   ```
   dwello.example.ch {
   	reverse_proxy localhost:3000
   }
   ```

3. In `.env`, instead of the PC values:

   ```bash
   PUBLIC_APP_URL=https://dwello.example.ch
   OAUTH_GOOGLE_REDIRECT_URI=https://dwello.example.ch/auth/callback
   COOKIE_DOMAIN=dwello.example.ch
   CORS_ORIGIN=https://dwello.example.ch
   ```

   and remove `COOKIE_SECURE=false`.
4. At Google (section 3): add `https://dwello.example.ch/auth/callback` as redirect URI.
5. `docker-compose.prod.yml` also publishes the backend (3001), the database (5432) and the AI (11434). Block every port but 22, 80 and 443 in the firewall of your provider or router: Docker's published ports bypass `ufw`.

For a home server that should stay out of the internet, Caddy can get the certificate through the DNS of the domain instead (see the Caddy documentation, «DNS challenge»); access from outside then goes through a VPN such as Tailscale.
